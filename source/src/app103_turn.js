/* ================= 回合状态机 v0.1（2026-10-27 · Ann 定的第二件事）=================
   Ann：「这是解耦之后应该做的第二件事，统一接口之类的，没有这个谈不上代码质量。」

   ## 病
   `busy` 只是一个 boolean（`app3_chat.js` 里的 `let busy=false`），有四拨人各自解释它：
     reply()      置真/置假
     packRun()    完全不理它
     doSend()     读它决定「丢弃还是排队」
     dock97/UI    另算一套「轮到你了」

   同一个动作（比如「我正在说话时点了一个选项」）因此在四个地方得到四种答案 ——
   这就是「一会好一会坏」的机械原因。

   ## 这一步做什么（小、可回滚、不改行为）
   给它一个**唯一持有人**：谁拿的、什么时候拿的、有没有第二个人同时拿。
     TURN.acquire('reply')   置忙（同时记 owner 与起点）
     TURN.release('reply')   置闲（只有持有者能放）
     TURN.state()            给 UI 读的唯一状态
     __turn()                控制台读数：此刻谁持有、历史冲突几次

   ## 刻意没做
   没有把 `busy` 换成 getter（那要改几十处读点，风险大且不是这一步的目的）。
   这一版只保证：**置真/置假只有一个入口，且第二个人抢会被记下来。**
   等冲突读数归零，再谈把 UI 全部改成读 TURN.state()。
================================================================================== */
(function () {
  'use strict';

  const T = {
    v: 1,
    owner: '',            // 当前持有者
    since: 0,             // 何时拿到的
    total: 0,             // 累计回合数
    conflicts: [],        // 两个人同时要忙 ⇒ 竞态的形状
    history: [],          // 最近 50 次 acquire/release
    _set: null            // 由 app3_chat 注册：把 busy 真正改掉的那个人
  };

  function stamp(kind, owner, extra) {
    T.history.push({ at: Date.now(), kind, owner, extra: extra || '' });
    if (T.history.length > 50) T.history.shift();
  }

  T.bind = function (setter) { T._set = setter };

  T.acquire = function (owner) {
    if (!T._set) return false;
    if (T.owner && T.owner !== owner) {
      // 有人还拿着就又来了一个 —— 不是"排队"，是两个人在同一时刻都以为自己是唯一
      T.conflicts.push({ at: Date.now(), holder: T.owner, wanted: owner, heldMs: Date.now() - T.since });
      if (T.conflicts.length > 50) T.conflicts.shift();
    }
    if (!T.owner) { T.owner = owner || '?'; T.since = Date.now(); T.total++; }
    stamp('acquire', owner || '?', T.owner !== (owner || '?') ? ('held by ' + T.owner) : '');
    try { T._set(true) } catch (_) {}
    return true;
  };

  T.release = function (owner) {
    if (!T._set) return false;
    if (T.owner && owner && T.owner !== owner) {
      // 不是持有者却来放 —— 会把别人的忙状态误清掉，这是最危险的一种
      T.conflicts.push({ at: Date.now(), holder: T.owner, wanted: 'release:' + owner, heldMs: Date.now() - T.since });
      return false;
    }
    T.owner = ''; T.since = 0;
    stamp('release', owner || '?');
    try { T._set(false) } catch (_) {}
    return true;
  };

  T.state = function () {
    if (!T.owner) return 'idle';
    const ms = Date.now() - T.since;
    return ms > 60000 ? 'stuck' : 'busy';
  };

  T.heldMs = function () { return T.owner ? Date.now() - T.since : 0 };

  window.TURN = T;
  window.__turn = function (detail) {
    const s = {
      现在: T.state(), 持有者: T.owner || '(无)', 已持ms: T.heldMs(),
      累计回合: T.total, 冲突次数: T.conflicts.length
    };
    if (!detail) return s;
    return { 汇总: s, 冲突: T.conflicts.slice(-20), 最近: T.history.slice(-20) };
  };
})();
