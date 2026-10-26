/* ================= renderChat 花在哪：一次拆开 =================
   tools/perf-ingame.js 只答「renderChat 一共多少毫秒」。这一支答「那几百毫秒分给了谁」——
   因为它要决定改哪一行：是 innerHTML 重建（screen）、是强制回流（scrollChat）、
   是背景换人（chatBgSet）、还是消息列表本身（msgHTML 循环）。

   注入后调用：
     __RENDERPROBE.once()        // 现在跑一次 renderChat，返回分步耗时
     __RENDERPROBE.once(3)       // 跑三次，返回每次的分步（看方差）
     __RENDERPROBE.growth()      // 在不动存档的前提下，把同一章的 msgs 复制成 10/40/160 条，
                                 // 量 renderChat 随消息条数怎么长（答「越玩越卡」是不是 O(N)）
   ⚠️ growth() 会临时改 th.msgs，跑完自动还原（返回前先恢复）。
   ============================================================== */
(function () {
  if (window.__RENDERPROBE) return "already";
  const R = { v: 1, notes: [] };

  function timeit(fn) { const t0 = performance.now(); const r = fn(); return { ms: +(performance.now() - t0).toFixed(2), r }; }

  // 包住 renderChat 内部会被调到的几个步骤（都不在 perf-ingame.js 的名单里）
  const steps = ["screen", "scrollChat", "refreshLive", "cleanDecor", "cleanMark", "chatBgSet", "chatFx", "show", "statusSync"];
  const acc = {};
  R.install = function () {
    for (const n of steps) {
      const orig = window[n];
      if (typeof orig !== "function" || orig.__rprobe) continue;
      const w = function () {
        const t0 = performance.now();
        try { return orig.apply(this, arguments); }
        finally {
          const d = performance.now() - t0;
          (acc[n] = acc[n] || { calls: 0, ms: 0, max: 0 });
          acc[n].calls++; acc[n].ms += d; if (d > acc[n].max) acc[n].max = +d.toFixed(2);
        }
      };
      w.__rprobe = 1;
      window[n] = w;
    }
    return Object.keys(acc).join(",");
  };

  R.once = function (times) {
    times = times || 1;
    const out = [];
    for (let k = 0; k < times; k++) {
      for (const n of Object.keys(acc)) { acc[n] = { calls: 0, ms: 0, max: 0 }; }
      const a = timeit(() => renderChat());
      // 强制一次样式+布局，把「innerHTML 之后真正要付的回流」计入这一格
      const b = timeit(() => { void document.getElementById("s-chat").offsetHeight; });
      out.push({
        renderChatMs: a.ms,
        forcedLayoutMs: b.ms,
        steps: JSON.parse(JSON.stringify(acc)),
        msgs: (function () { try { const t = S.threads[curT]; return t ? t.msgs.length : null; } catch (_) { return null; } })(),
        nodes: document.getElementById("s-chat") ? document.getElementById("s-chat").getElementsByTagName("*").length : null,
      });
    }
    return JSON.stringify(out);
  };

  /* 「越玩越卡」是不是 O(N)：把当前线程的消息复制成 N 条再渲染，量耗时。
     只用现成的消息做复制，不碰剧情内容、不碰存档（跑完还原）。 */
  R.growth = function () {
    const th = S.threads[curT];
    if (!th || !th.msgs.length) return JSON.stringify({ error: "no thread" });
    const save0 = localStorage.getItem("miru_v2");
    const orig = th.msgs.slice();
    const out = [];
    try {
      for (const N of [orig.length, 4 * orig.length, 16 * orig.length, 64 * orig.length]) {
        const m = [];
        while (m.length < N) m.push.apply(m, orig);
        th.msgs = m.slice(0, N);
        // 预热一次（JIT / 字体 / 图片），只记第二次
        renderChat();
        const t0 = performance.now();
        renderChat();
        const ms = +(performance.now() - t0).toFixed(2);
        let layout = 0;
        try { const t1 = performance.now(); void document.getElementById("s-chat").offsetHeight; layout = +(performance.now() - t1).toFixed(2); } catch (_) {}
        const pkw = document.getElementById("pkwrap");
        out.push({
          msgs: N, renderChatMs: ms, forcedLayoutMs: layout,
          nodes: document.getElementById("s-chat").getElementsByTagName("*").length,
          htmlBytes: document.getElementById("msgs").innerHTML.length,
          pkwrap: pkw ? pkw.getElementsByTagName("*").length : null,
        });
      }
    } finally {
      th.msgs = orig;
      if (save0) localStorage.setItem("miru_v2", save0);   // 存档原样还回去
      try { renderChat(); } catch (_) {}
    }
    return JSON.stringify(out);
  };

  window.__RENDERPROBE = R;
  return "renderprobe installed; wrapped: " + R.install();
})()
