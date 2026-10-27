/* ================= 消息渲染：三类登记 + 冲突检测 + 存活读数（2026-10-27）=================
   背景：`msgHTML` 被 **19 层**包装（`tools/msghtml-triage.mjs`）。三形状：
     · kind  按 `m.k` 认领渲染（10 层）—— 认领了就不往下走
     · post  先渲染再加工（5 层）—— app73 挂工具条 / app98 加接听按钮 / app18 贴纸改写 /
             app35 付款行 / app16 的 fmtMix（行内 *动作* 高亮）
     · wrap  条件改写入参（1 层）—— app34 把「玩家那句」换成舞台指令

   ## 为什么分三类而不是一张类型表
   因为**形状不同，判据也不同**：kind 层要能答「谁认领了这个类型」；post 层要能答
   「它有没有真的改过东西」（`.bub` 那次选择器失效就是这么死掉的）；wrap 层要能答
   「它换了入参之后内层还认得出吗」。一张表答不了三种问题。

   ## 这一版做什么
   **保留原位安装**（顺序一字不改 —— 后处理层必须看到内层渲染结果，所以不能整体挪到最外层），
   但把「谁、属于哪一类、认领什么」写进一张表，并且给每层记两个可数的读数：
       hit         这一层**真的改了东西**的次数
       nextCalled  这一层把活交给内层的次数（kind 层用）
   于是「一个层从来没改过任何东西」= 死代码，是可读出来的，不再靠猜。

   ## 用法（在各自的源文件里，原位）
       MSGKIND.inline('app42_decline.js', ['declined'], function(m, i, th, next){ …; return next(m,i,th) })
       MSGKIND.post('app98_story.js', function(h, m, i, th){ …; return h })      // 返回字符串 = 改过了
       MSGKIND.wrap('app34_hints.js', function(m, i, th){ …; return m2 })        // 返回对象 = 换入参

   ## 读数
       __msgkind()           注册层 · 各类层数 · 认领类型 · 冲突类型 · 有命中的层
       __msgkind(true)       逐层：名字 · 类 · 认领 · 命中 · 交内层 · 抛错

   ## 为什么不是"一次搬成一张类型表"
   见 `docs/msg-render-registry.md`：19 层里有 4 个类型被多层认领（say/act/think/box），
   搬它们之前必须先有逐字节对拍（`tools/render-snapshot.mjs`）。这一版是那一步的地基。
   ================================================================================== */
(function () {
  'use strict';

  const M = { v: 2, items: [], claims: {}, conflicts: [], installed: 0, classes: {} };

  function add(name, cls, kinds) {
    const it = { name: String(name || '?'), cls: cls, kinds: kinds || [], hit: 0, nextCalled: 0, err: 0 };
    M.items.push(it);
    M.classes[cls] = (M.classes[cls] || 0) + 1;
    M.installed++;
    return it;
  }

  /* 抛错不许静默：记次数 + 走 console.error（app108 的 errlog 会接住它）*/
  function boom(it, e) {
    it.err++;
    try { console.error('[msgkind] ' + it.name + '(' + it.cls + ') 抛错：' + ((e && (e.code || e.message)) || e)); } catch (_) { }
  }

  /* ---------- kind：认领某个 m.k ---------- */
  M.inline = function (name, kinds, fn) {
    if (typeof fn !== 'function') return false;
    const list = Array.isArray(kinds) ? kinds.slice() : [kinds];
    const it = add(name, 'kind', list);
    const prev = window.msgHTML;

    window.msgHTML = function (m, i, th) {
      let prevOut = null, calledNext = false;
      const next = function () { calledNext = true; it.nextCalled++; prevOut = prev.apply(this, arguments); return prevOut };
      let out;
      try { out = fn.call(this, m, i, th, next) } catch (e) { boom(it, e); return typeof prevOut === 'string' ? prevOut : '' }
      /* 「命中」= 这一层**自己答了**（没把活交给内层）或者**改了内层的结果**。
         两种都算真的干活；只有「交给内层且原样返回」才算没干活。
         ⚠️ 第一版只比 out!==prevOut，于是四个认领层全部报 0 命中 —— 因为它们从不调 next，
            prevOut 一直是 null。量不到自己这件事，本身就是没量。
         ⚠️ 这条读数分辨不了「无条件吃掉所有消息」的坏层，那由 render-snapshot 的 19 种对拍管。 */
      if (typeof out === 'string' && (!calledNext || out !== prevOut)) it.hit++;
      return out;
    };

    /* 认领 + 查重：同一个 m.k 被两层认领时，谁赢只由加载顺序决定 —— 把它记下来 */
    for (const k of list) {
      (M.claims[k] = M.claims[k] || []).push(it.name);
      if (M.claims[k].length === 2) M.conflicts.push(k);
    }
    return true;
  };

  /* ---------- post：拿到已渲染的 HTML 再加工 ---------- */
  M.post = function (name, fn) {
    if (typeof fn !== 'function') return false;
    const it = add(name, 'post');
    const prev = window.msgHTML;

    window.msgHTML = function (m, i, th) {
      const h = prev.apply(this, arguments);
      let out;
      try { out = fn(h, m, i, th) } catch (e) { boom(it, e); return h }
      if (typeof out === 'string') { if (out !== h) it.hit++; return out }
      return h;
    };
    return true;
  };

  /* ---------- wrap：改写入参，再交给内层 ---------- */
  M.wrap = function (name, fn) {
    if (typeof fn !== 'function') return false;
    const it = add(name, 'wrap');
    const prev = window.msgHTML;

    window.msgHTML = function (m, i, th) {
      let mm = m;
      try { const r = fn(m, i, th); if (r && typeof r === 'object') mm = r } catch (e) { boom(it, e) }
      if (mm !== m) it.hit++;
      return prev.call(this, mm, i, th);
    };
    return true;
  };

  M.classesOf = function (cls) { return M.items.filter(x => x.cls === cls) };

  window.MSGKIND = M;
  window.__msgkind = function (detail) {
    const alive = M.items.filter(x => x.hit > 0).length;
    const sum = {
      注册层: M.items.length,
      认领类型: Object.keys(M.claims).length,
      冲突类型: M.conflicts.length,
      类: { kind: M.classes.kind || 0, post: M.classes.post || 0, wrap: M.classes.wrap || 0 },
      有命中的层: alive,
      抛错层: M.items.filter(x => x.err > 0).length
    };
    if (!detail) return sum;
    return {
      汇总: sum,
      冲突明细: M.conflicts.map(k => ({ 类型: k, 认领层: M.claims[k] })),
      层: M.items.map(x => ({ 名字: x.name, 类: x.cls, 认领: x.kinds.join(','), 命中: x.hit, 交内层: x.nextCalled, 抛错: x.err }))
    };
  };
})();
