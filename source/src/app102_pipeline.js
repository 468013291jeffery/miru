/* ================= 对话流：一道缝（2026-10-27 · 设计见 DIALOGUE-PIPELINE.md）=================
   Ann：「应该把这些统一起来，做成接口，现在到处乱改乱错，就是这个原因吧。」
   ⇒ 这条链原来被六个文件各自改：显示（appendMsg / app11）· 节奏（pkWait / app28 / playBeats 各一套）·
   发声（speak 被 app45/app62/app86 各覆盖一次）· 预取（只挂剧本行）。

   这里立三个动词，谁都不必再自己拼：
     D.pace(msg)          这句该停多久 —— **纯函数**，只依赖文本与设置，不依赖有没有声音
     D.say(msg)          让它发声 —— 返回 Promise<{ok,why}>，**永不 reject、永不阻塞对话**
     D.line(th,msg,opt)  一整句：出现 → 发声（say 台词）→ 收尾节奏

   一条铁律写进代码而不是注释：**声音决定"什么时候翻页"，但绝不允许决定"翻不翻页"。**
   ============================================================= */
(function(){
  const D = (window.D = window.D || {});
  if (D.v === 1) return;

  const S_ = () => (typeof S !== "undefined" ? S : null);
  function log(e) {
    try { const s = S_(); if (!s) return; s._voiceLog = s._voiceLog || []; s._voiceLog.push(e); if (s._voiceLog.length > 60) s._voiceLog.shift() } catch (_) {}
  }
  function tune(k, dflt) {
    try { const t = (typeof MIRU_TUNE !== "undefined" && MIRU_TUNE.chat) || {}; return (k in t) ? t[k] : dflt } catch (_) { return dflt }
  }
  const voiceOn = () => { try { const s = S_(); return !!(s && s.voice && s.voice.auto && (typeof voiceAutoOK !== "function" || voiceAutoOK())) } catch (_) { return false } };
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  /* ---------- ① 节奏：纯函数 ---------- */
  D.pace = function (msg) {
    let read = 1800;
    try { if (typeof readMs === "function") read = readMs(msg) } catch (_) {}
    const extra = tune("linePause", 2000);          // Ann：每句再慢一点
    return Math.min(14000, Math.max(600, read * 0.75 + extra));
  };

  /* ---------- ② 发声：永不 reject ---------- */
  D.state = "idle";                                  // idle | playing | speaking
  D.stats = { lines: 0, said: 0, silent: 0 };
  D.say = function (msg, opt) {
    const o = opt || {};
    const txt = String((msg && msg.txt) || "");
    const who = String((msg && msg.who) || "n");
    const cap = Math.min(20000, Math.max(6000, txt.length * 170));
    return new Promise(res => {
      let done = false;
      const t0 = Date.now();
      const fin = (ok, why) => {
        if (done) return; done = true; clearTimeout(tm);
        log({ t: Date.now(), ev: ok ? "said" : "silent", who: who, k: String((msg && msg.k) || ""), len: txt.length, ms: Date.now() - t0, why: why || "" });
        if (ok) D.stats.said++; else D.stats.silent++;
        res({ ok: !!ok, why: why || "", ms: Date.now() - t0 });
      };
      const tm = setTimeout(() => fin(false, "timeout"), cap);
      try {
        if (typeof speak !== "function") return fin(false, "no-speak");
        speak(txt, who, () => fin(true));
      } catch (e) { fin(false, "throw:" + String((e && e.message) || e).slice(0, 40)) }
    });
  };

  /* ---------- ③ 一整句：出现 → 发声 → 收尾 ----------
     规则（Ann 要的挂钩）：
       · 能念 ⇒ **念完才结束这一句**，语音结束对话才继续；念完后再停 linePause，
       · 不能念 ⇒ 按**阅读速度**停 `D.pace`（关语音就按这套速度走），
       · 任何情况都不许因为语音失败而卡住。 */
  D.line = async function (th, msg, opt) {
    const o = opt || {};
    if (o.silent) { try { appendMsg(th, msg) } catch (_) {} return { ok: true, said: false, why: "silent" } }

    D.state = "playing";
    if (o.preDelay) await sleep(o.preDelay);
    if (msg) msg._voiced = 1;            // 这一条由 D.line 负责发声 ⇒ 别让 appendMsg 的兜底再念一遍
    try { appendMsg(th, msg) } catch (_) {}
    D.stats.lines++;

    let said = false, why = "";
    const speakable = msg && msg.k === "say" && msg.who !== "n" && msg.who !== "sys" && (() => { try { return !!ch(msg.who) } catch (_) { return false } })();
    if (speakable && voiceOn()) {
      D.state = "speaking";
      const r = await D.say(msg);
      said = r.ok; why = r.why;
      D.state = "playing";
      if (said) { const extra = tune("linePause", 2000); if (extra > 0) await sleep(extra) }
    }
    if (!said) await sleep(D.pace(msg));
    return { ok: true, said: said, why: why };
  };

  D.v = 1;

  /* ---------- ④ 兜底挂钩：任何「角色说的一句话」落进来，只要没人声明已经念过，就由这里念 ----------
     审计（`tools/say-voice-audit.mjs`）时发现 20 个产生 say 的位置里 14 个没挂语音：
     自由模式的 agent（app97/app98）、剧本直接 push（app12）、sideLine（app45）……
     **逐个补是补不完的** —— 他们各自都在正确的时机 appendMsg，缺的只是"顺手念一声"。
     ⇒ 把这件事收到唯一入口上：`appendMsg` 见到「角色 + k=say + 没被标 _voiced」就念。
     已经自己念过的路径（`D.line` / `playBeats` / `pkAppend`）在 append 之前打 `_voiced=1`，不会重复。 */
  (function () {
    try {
      if (typeof appendMsg !== "function" || appendMsg.__dvoiced) return;
      const orig = appendMsg;
      appendMsg = function (th, m) {
        const r = orig.apply(this, arguments);
        try {
          if (m && m.k === "say" && !m._voiced && m.who && m.who !== "me" && m.who !== "n" && m.who !== "sys"
              && (typeof ch === "function" && ch(m.who)) && voiceOn()) {
            m._voiced = 1;
            D.say(m).catch(function () {});
          }
        } catch (_) {}
        return r;
      };
      appendMsg.__dvoiced = 1;
    } catch (_) {}
  })();
})();
