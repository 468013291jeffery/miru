/* ================= 存档变更观测 v0.1（2026-10-27 · 第五件）=================
   Ann：「继续做吧，副作用都能修，但增强稳健性、做软件工程上的升级是最重要的事。」

   ## 病
   `save()` 在 app1_core.js:19，一行：`localStorage.setItem(KEY, JSON.stringify(S))`。
   **有 397 个调用点**，谁也不说自己在改什么。于是：
     · 出问题时无法回答「谁把 S 改成这样」（今晚查了好几次）
     · 一次交互里可以写上几十次（性能窗口量到过 288 次/60ms），但没人知道是哪些调用点

   ## 这一版做什么（只观测，不改写行为）
     SAVE.go(rawFn)    包住真正的 saveRaw，记：次数 / 总耗时 / 最慢一次 / 明细
     __save()          控制台读数：调用次数、最烧的几个调用点（文件:行）、空写次数

   · **归因靠调用栈**（不必改 397 个调用点）：抓 `new Error().stack` 第 3 行
   · **空写检测**：抽样算一个廉价签名（JSON 长度 + 前后各 40 字符），与上次相同 ⇒ 空写
   · 抽样不是省事，是因为 397 处里高频那几个本来就会重复上千次，抽样已足够排序

   ## 没做
   没有「值没变就不写」——那会改变行为（有些流程依赖写入时机）。先把数字量出来。
================================================================================== */
(function () {
  'use strict';
  const SV = {
    v: 1,
    n: 0, ms: 0, max: 0, maxAt: '',
    byCaller: {},          // "file:line" → 次数
    uniq: [],              // 最近若干次签名
    unchanged: 0,
    checked: 0,            // 做过签名比对的次数
    slow: []               // 最慢 10 次
  };

  const SAMPLE_STACK = 10;   // 每 10 次抓一次栈（抓栈不便宜）
  const SAMPLE_HASH = 20;    // 每 20 次算一次签名

  function callerOf() {
    try {
      const st = new Error().stack || "";
      const lines = st.split("\n");
      /* 跳过 save / saveRaw / SAVE.go 自己这几帧，取第一个真正的外部调用点。
         完整保留行号（index.html:NNNN）—— 用 tools/line2file.mjs 翻回源文件。 */
      for (let k = 2; k < lines.length; k++) {
        const ln = lines[k] || "";
        /* 跳过包装层自己（save / saveRaw / callerOf / go）的帧，取真正的外部调用点 */
        if (/^\s*at\s+(save|saveRaw|callerOf|go)\s+\(/.test(ln) || /\bsaveRaw\b|\bcallerOf\b|SV\.go/.test(ln)) continue;
        const m = /([\w.\-]+\.(?:js|html)):(\d+):(\d+)/.exec(ln);
        if (m) return m[1] + ":" + m[2];
      }
      return "?";
    } catch (_) { return "?" }
  }

  function sig(raw) {
    try {
      const s = JSON.stringify(window.S || {});
      return s.length + '|' + s.slice(0, 40) + '|' + s.slice(-40);
    } catch (_) { return '?'; }
  }

  SV.go = function (raw) {
    const t0 = performance.now();
    let out;
    try { out = raw() } finally {
      const dt = performance.now() - t0;
      SV.n++; SV.ms += dt;
      if (dt > SV.max) { SV.max = dt; SV.maxAt = callerOf(); }
      if (dt > 4) { SV.slow.push({ ms: Math.round(dt), at: callerOf() }); if (SV.slow.length > 10) SV.slow.shift() }
      /* 前 50 次全采（短启动也能出归因表），之后抽样 */
      if (SV.n < 50 || SV.n % SAMPLE_STACK === 0) {
        const k = callerOf();
        SV.byCaller[k] = (SV.byCaller[k] || 0) + 1;
      }
      if (SV.n % SAMPLE_HASH === 0) {
        const s = sig();
        SV.checked++;
        if (SV.uniq.length && SV.uniq[SV.uniq.length - 1] === s) SV.unchanged++;
        SV.uniq.push(s);
        if (SV.uniq.length > 40) SV.uniq.shift();
      }
    }
    return out;
  };

  SV.reset = function () { SV.n = 0; SV.ms = 0; SV.max = 0; SV.byCaller = {}; SV.slow = []; SV.unchanged = 0; SV.checked = 0; SV.uniq = [] };

  window.SAVE = SV;
  window.__save = function (detail) {
    const top = Object.entries(SV.byCaller).sort((a, b) => b[1] - a[1]).slice(0, 10)
      .map(([k, v]) => ({ 调用点: k, 抽样次数: v }));
    const sum = {
      次数: SV.n, 总ms: Math.round(SV.ms), 平均ms: SV.n ? +(SV.ms / SV.n).toFixed(2) : 0,
      最慢ms: Math.round(SV.max), 最慢处: SV.maxAt,
      空写: SV.unchanged + '/' + SV.checked + '（抽样）'
    };
    if (!detail) return sum;
    return { 汇总: sum, 最烧调用点: top, 慢写: SV.slow };
  };
})();
