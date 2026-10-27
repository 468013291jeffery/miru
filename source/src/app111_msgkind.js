/* ================= 消息渲染：登记 + 冲突检测（2026-10-27）=================
   背景：`msgHTML` 被 **19 层**包装（`tools/msghtml-triage.mjs`），其中 10 层是「按 m.k 认领渲染」。
   四类消息被多层认领（act / box / think / say），另有 **后处理层**（app73 给每条消息挂工具条、
   app98 改写收尾）—— 所以**不能**把认领层统一挪到最外层，那会让后处理看不到它们。

   ## 这一版做什么
   **保留原位安装**（顺序一字不改），但把「谁认领了哪些类型」写进一张表：
       MSGKIND.inline('app42_decline.js', ['declined'], function(m, i, th, next){ …body…; return next(m,i,th) })
   `inline` 干三件事：
     ① 立刻按原位置装一个包装（与手写包装逐字等价）
     ② 把 { 名字, 认领类型 } 记进 MSGKIND.items
     ③ **重复认领当场记一笔**（同一个 m.k 被两个层认领 —— 从前只有靠加载顺序才知道谁赢）

   ## 读数
       __msgkind()           注册层 · 认领类型数 · **冲突类型**
       __msgkind(true)       冲突明细（哪个类型、哪几层）

   ## 为什么不是"一次搬成一张类型表"
   因为后处理层要看到所有消息的 HTML。真正扁平化需要先有 **post/wrap 两类独立注册**（见
   `docs/msg-render-registry.md` 第 3 节），那是一步更大的改动。这一版先让"谁认领什么"可见、可查重。
================================================================================== */
(function () {
  'use strict';

  const M = { v: 1, items: [], claims: {}, conflicts: [], installed: 0 };

  M.inline = function (name, kinds, fn) {
    if (typeof fn !== 'function') return false;
    const list = Array.isArray(kinds) ? kinds.slice() : [kinds];

    /* ① 原位安装：与手写包装等价 */
    const prev = window.msgHTML;
    window.msgHTML = function (m, i, th) {
      return fn.call(this, m, i, th, function (a, b, c) { return prev.apply(this, arguments) });
    };
    M.installed++;

    /* ② 登记 */
    M.items.push({ name: String(name || '?'), kinds: list });

    /* ③ 查重：同一个 m.k 被两层认领时，谁赢只由加载顺序决定 —— 把它记下来 */
    for (const k of list) {
      (M.claims[k] = M.claims[k] || []).push(String(name || '?'));
      if (M.claims[k].length === 2) M.conflicts.push(k);
    }
    return true;
  };

  window.MSGKIND = M;
  window.__msgkind = function (detail) {
    const sum = {
      注册层: M.items.length,
      认领类型: Object.keys(M.claims).length,
      冲突类型: M.conflicts.length
    };
    if (!detail) return sum;
    return {
      汇总: sum,
      冲突明细: M.conflicts.map(k => ({ 类型: k, 认领层: M.claims[k] })),
      层: M.items.map(x => x.name + ' → ' + x.kinds.join(','))
    };
  };
})();
