/* ================= 章节状态机 v0.1（2026-10-27 · 第三件）=================
   Ann：「继续做吧，副作用都能修，但增强稳健性、做软件工程上的升级是最重要的事。」

   ## 病
   `th.pk.st` 的取值只有四个（busy / choose / next / end），但**有 10 个写点散在 4 个文件里**：
     app14_pack.js  6 处 · app28_burst.js 1 处 · app3_chat.js 1 处 · app46_cp.js 1 处
   每个写点都自己顺手做（或不顺手做）save() / packRefresh() / scrollChat()。
   ⇒ 「自动换章」「选完状态不对」「复档回来卡住」这些，全是**一次转移没按规矩走**。

   ## 这一版做什么
   给四个状态一个**迁移表**，并让「写 st」只有一个门：
     pkGo(th, to, why)     合法就照做（save + 刷新），非法就**记一笔再照做**
     __pkst()              控制台读数：各状态计数 · 非法迁移明细

   没做：没有禁止非法迁移（那会让玩家卡死在旧版本存档里），只把它变成**可数的**。
   等非法计数归零，再谈把非法迁移改成拒绝。

   ## 迁移表（照着今晚的真实流程写的）
     busy   → choose | next | end | busy
     choose → busy | choose
     next   → busy | next
     end    → busy            （重玩 / 复档）
   其余（如 choose→next、end→choose）算非法。
====================================================================== */
(function () {
  'use strict';

  const LEGAL = {
    busy: ['busy', 'choose', 'next', 'end'],
    choose: ['choose', 'busy'],
    next: ['next', 'busy'],
    end: ['end', 'busy']
  };

  const M = {
    v: 1,
    n: 0,                    // 总转移次数
    byState: {},             // 落到每个状态的次数
    byEdge: {},              // "from→to" 次数
    violations: [],          // 非法迁移（保留最近 50）
    _write: null             // 由 app14 注册：真正写 th.pk.st 的那一个
  };

  M.bind = function (fn) { M._write = fn };

  M.go = function (th, to, why) {
    if (!th || !th.pk) return false;
    const from = th.pk.st || '(none)';
    const ok = from === '(none)' || (LEGAL[from] && LEGAL[from].indexOf(to) >= 0);
    M.n++;
    M.byState[to] = (M.byState[to] || 0) + 1;
    const edge = from + '→' + to;
    M.byEdge[edge] = (M.byEdge[edge] || 0) + 1;
    if (!ok) {
      M.violations.push({ at: Date.now(), from, to, why: why || '', ch: th.pk.ch });
      if (M.violations.length > 50) M.violations.shift();
      try { console.warn('[pkst] 非法迁移 ' + edge + '（' + (why || '') + '）'); } catch (_) {}
    }
    try { if (M._write) M._write(th, to); else th.pk.st = to; } catch (_) { try { th.pk.st = to } catch (_) {} }
    return ok;
  };

  window.PKST = M;
  window.pkGo = M.go;
  window.__pkst = function (detail) {
    const sum = { 总转移: M.n, 各状态: M.byState, 非法次数: M.violations.length };
    if (!detail) return sum;
    return { 汇总: sum, 边: M.byEdge, 非法明细: M.violations.slice(-20) };
  };
})();
