/* ================= 自动走完 8 章，逐章记账 =================
   由 tools/perf-ingame.mjs 注入。需要先注入 tools/perf-ingame.js（探针）。
   它做的是**真的换章**：packPick → packNext → packOpen → packRun，和玩家按键走的是同一条路。
   每一章记一个窗口：从「开始播这一章」到「这章正文播完、等玩家选」。
   窗口里记：墙钟时长、save 次数与累计、renderChat 次数与累计、长任务、掉帧、DOM/堆/存档字节。

   用法：
     __PERFRUN.start({chapters:8, choice:"B"})   // 开始（在页内自己跑，几十分钟也没关系）
     __PERFRUN.status()                          // 进度
     __PERFRUN.report()                          // 全部读数（JSON 字符串）
     __PERFRUN.abort()
   ========================================================= */
(function () {
  if (window.__PERFRUN && window.__PERFRUN.v === 1) return "already";
  if (!window.__MIRUPERF) return "need __MIRUPERF first";

  const F = {
    v: 1,
    cfg: null,
    phase: "idle",
    runs: [],
    log: [],
    cur: null,
    done: false,
    err: null,
  };

  function P() { return window.__MIRUPERF; }
  function th() { return (typeof curT !== "undefined" && curT) ? S.threads[curT] : null; }
  function num(v) { return (typeof v === "number" && isFinite(v)) ? v : 0; }

  function snap() {
    const p = P();
    return {
      t: +(performance.now() - p.t0).toFixed(1),
      saveCalls: p.save.calls, saveMs: num(p.save.total),
      renderChatCalls: p.renderChat.calls, renderChatMs: num(p.renderChat.total),
      appendMsgCalls: p.appendMsg.calls, appendMsgMs: num(p.appendMsg.total),
      pkAppendCalls: p.pkAppend.calls, pkAppendMs: num(p.pkAppend.total),
      chatBgSetCalls: p.chatBgSet.calls, chatBgSetMs: num(p.chatBgSet.total),
      ltN: p.longtasks.length,
      ltMs: +p.longtasks.reduce((s, x) => s + x.d, 0).toFixed(1),
      ltMax: p.longtasks.length ? Math.max.apply(null, p.longtasks.map(x => x.d)) : 0,
      frames: p.frames.length,
      framesDropped: p.framesDropped,
      frameMax: p.frameMax,
    };
  }
  function diff(a, b) {
    const o = {};
    for (const k of Object.keys(b)) o[k] = typeof b[k] === "number" ? +(b[k] - a[k]).toFixed(1) : b[k];
    return o;
  }
  function hb(label) { try { return P().heartbeat(label); } catch (_) { return null; } }

  function note(s) { F.log.push(s); if (F.log.length > 400) F.log.shift(); }

  // 等到条件成立（轮询 120ms），超时后记 err 并停
  function until(cond, timeoutMs, onOk, onTimeout) {
    const t0 = performance.now();
    const tick = () => {
      let ok = false;
      try { ok = cond(); } catch (e) { F.err = "cond threw: " + e.message; }
      if (ok) return onOk();
      if (performance.now() - t0 > timeoutMs) {
        F.err = "timeout after " + timeoutMs + "ms in phase " + F.phase;
        F.done = true;
        return;
      }
      setTimeout(tick, 120);
    };
    tick();
  }

  F.start = function (cfg) {
    F.cfg = Object.assign({ chapters: 8, choice: "B", startChapter: 1 }, cfg || {});
    F.runs = []; F.log = []; F.done = false; F.err = null;
    const t = th();
    if (!t || !t.pk) { F.err = "no pack thread open"; return "no thread"; }
    F.cur = { ch: t.pk.ch, start: snap(), hbBefore: hb("ch" + t.pk.ch + "-start") };
    if (t.pk.st === "choose") {
      /* 起跑时这一章已经播完了（手工先玩过一章）⇒ 只记一笔，直接进「选择 → 下一章」 */
      note("ch" + t.pk.ch + " already at choose (pre-played, no window) msgs=" + t.msgs.length);
      F.runs.push({ ch: t.pk.ch, phase: "main", note: "pre-played", msgsAfter: t.msgs.length });
      F.cur.pickStart = snap();
      F.phase = "play-pick";
      try { packPick(F.cfg.choice); } catch (e) { F.err = "packPick: " + e.message; F.done = true; return "err"; }
      setTimeout(loop, 200);
      return "started";
    }
    F.phase = "play-main";
    note("start at ch=" + t.pk.ch + " msgs=" + t.msgs.length);
    loop();
    return "started";
  };

  function loop() {
    if (F.done) return;
    const t = th();
    if (!t) { F.err = "thread vanished"; F.done = true; return; }
    const st = t.pk.st;

    if (F.phase === "play-main") {
      if (st === "choose") {           // 这一章的正文播完了
        F.cur.end = snap();
        F.cur.hbAfter = hb("ch" + t.pk.ch + "-playEnd");
        const d = diff(F.cur.start, F.cur.end);
        F.runs.push(Object.assign({
          ch: t.pk.ch, phase: "main",
          msgsBefore: F.cur.hbBefore ? F.cur.hbBefore.msgs : null,
          msgsAfter: t.msgs.length,
          wallMs: +(F.cur.end.t - F.cur.start.t).toFixed(1),
          domBefore: F.cur.hbBefore ? F.cur.hbBefore.dom : null,
          domAfter: F.cur.hbAfter ? F.cur.hbAfter.dom : null,
          saveBytes: F.cur.hbAfter ? F.cur.hbAfter.saveBytes : null,
          memMB: F.cur.hbAfter ? F.cur.hbAfter.memMB : null,
        }, d));
        note("ch" + t.pk.ch + " main done wall=" + (F.cur.end.t - F.cur.start.t).toFixed(0) + "ms");
        F.phase = "pick";
        F.cur.pickStart = snap();
        try { packPick(F.cfg.choice); } catch (e) { F.err = "packPick: " + e.message; F.done = true; return; }
        F.phase = "play-pick";
        setTimeout(loop, 200);
        return;
      }
      if (st === "end") { // 最后一章没有 next
        F.cur.end = snap();
        F.runs.push(Object.assign({ ch: t.pk.ch, phase: "main", note: "reached end" }, diff(F.cur.start, F.cur.end)));
        F.done = true; return;
      }
      setTimeout(loop, 200);
      return;
    }

    if (F.phase === "play-pick") {
      if (st === "next" || st === "end") {
        F.cur.pickEnd = snap();
        F.runs.push(Object.assign({ ch: t.pk.ch, phase: "pick" }, diff(F.cur.pickStart, F.cur.pickEnd)));
        if (st === "end") { F.done = true; note("story end"); return; }
        measureOpenThenAdvance();
        return;
      }
      setTimeout(loop, 200);
      return;
    }
  }

  // 进 thread 的代价：此刻消息最多，openThread 会全量重建 DOM
  function measureOpenThenAdvance() {
    const t = th();
    const id = t.id;
    F.phase = "measure-open";
    F.cur.openStart = snap();
    const msgsNow = t.msgs.length;
    let ok = true, err = null, openMs = null;
    const w0 = performance.now();
    try { openThread(id); } catch (e) { ok = false; err = e.message; }
    openMs = +(performance.now() - w0).toFixed(1);   // 同步那一段（到可交互为止）
    const s = snap();
    const d = diff(F.cur.openStart, s);
    F.runs.push(Object.assign({
      ch: t.pk.ch, phase: "openThread", ok: ok, err: err, msgs: msgsNow, openMs: openMs,
    }, d));
    note("openThread msgs=" + msgsNow + " wall=" + openMs + "ms renderChat=" + d.renderChatMs + "ms");
    if (F.cur.ch >= F.cfg.chapters) { F.done = true; F.phase = "done"; return; }
    // 下一章
    const t2 = th();
    F.cur = { ch: t2.pk.ch + 1, start: null };
    F.phase = "advance";
    try { packNext(); } catch (e) { F.err = "packNext: " + e.message; F.done = true; return; }
    // packOpen 之后 th.pk.ch 已经变成 n+1；从这里开始记这一章的窗口
    const t3 = th();
    F.cur.ch = t3.pk.ch;
    F.cur.start = snap();
    F.cur.hbBefore = hb("ch" + t3.pk.ch + "-start");
    F.phase = "play-main";
    note("advanced to ch" + t3.pk.ch);
    setTimeout(loop, 200);
  }

  F.status = function () {
    const t = th();
    return JSON.stringify({
      phase: F.phase, done: F.done, err: F.err,
      runs: F.runs.length,
      ch: t && t.pk ? t.pk.ch : null,
      st: t && t.pk ? t.pk.st : null,
      msgs: t ? t.msgs.length : null,
      log: F.log.slice(-6),
    });
  };
  F.report = function () { return JSON.stringify({ v: F.v, cfg: F.cfg, done: F.done, err: F.err, runs: F.runs, log: F.log }); };
  F.abort = function () { F.done = true; F.phase = "aborted"; return "aborted"; };

  window.__PERFRUN = F;
  return "perfrun installed";
})()
