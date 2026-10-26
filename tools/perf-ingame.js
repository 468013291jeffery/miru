/* ================= 进游戏之后的卡顿探针 =================
   为什么需要这个文件：PERF.md 里的每一条读数都是**引导页 / 首屏**的（它自己写着
   「射程要说清：这次测的是引导页，不是我进不去的游戏内画面」）。而玩起来卡的两张
   症状全在**进去之后**——进 thread、换章。所以这里把尺子伸进去：
   注入页面，包住那几个热函数，记录**真实耗时**、长任务、掉帧、DOM/堆增长。

   用法（由 tools/perf-ingame.mjs 驱动，也可手工）：
     agent-browser --session dsh eval "$(Get-Content -Raw tools/perf-ingame.js)"
   注入后页面里就有 window.__MIRUPERF：
     __MIRUPERF.reset()         清空所有读数（从下一页开始量）
     __MIRUPERF.mark("名字")     打一个时间点
     __MIRUPERF.report()        JSON 字符串形式的读数
   注入是幂等的：再注入一次只返回 report()，不会包第二层。
   ========================================================= */
(function () {
  if (window.__MIRUPERF && window.__MIRUPERF.v === 1) return window.__MIRUPERF.report();

  const P = {
    v: 1,
    cap: 20000,
    t0: performance.now(),
    marks: {},
    // 每个被包的函数：{calls, total, max, samples}
    save: { calls: 0, total: 0, max: 0, samples: [], bytes: [] },
    renderChat: { calls: 0, total: 0, max: 0, samples: [] },
    openThread: { calls: 0, total: 0, max: 0, samples: [] },
    appendMsg: { calls: 0, total: 0, max: 0, samples: [] },
    pkAppend: { calls: 0, total: 0, max: 0, samples: [] },
    pkWait: { calls: 0, total: 0, max: 0, samples: [] },
    packRefresh: { calls: 0, total: 0, max: 0, samples: [] },
    chatBgSet: { calls: 0, total: 0, max: 0, samples: [] },
    msgHTML: { calls: 0, total: 0, max: 0, samples: [] },
    pkDirective: { calls: 0, total: 0, max: 0, samples: [] },
    longtasks: [],     // {start, dur}
    frames: [],        // 帧间隔 ms（只留最近 cap 条）
    frameMax: 0,
    framesDropped: 0,  // >33.4ms（<30fps）的帧数
    heartbeats: [],    // {t, msgs, dom, nodes, mem}
    notes: [],
    frameOn: false,
    installedAt: Date.now(),
  };

  function rec(b, ms) {
    b.calls++;
    b.total += ms;
    if (ms > b.max) b.max = ms;
    if (b.samples.length < P.cap) b.samples.push(ms);
  }
  function q(arr) { // 分位
    if (!arr.length) return null;
    const a = arr.slice().sort((x, y) => x - y);
    const at = p => a[Math.min(a.length - 1, Math.max(0, Math.round((a.length - 1) * p)))];
    return { n: a.length, p50: at(0.5), p95: at(0.95), p99: at(0.99), max: a[a.length - 1], mean: a.reduce((s, x) => s + x, 0) / a.length };
  }
  P.q = q;

  // ---- 包一个全局函数（这些都在打包脚本的顶层声明，等于 window 上的同名属性）----
  function wrap(name, bucket, opts) {
    const orig = window[name];
    if (typeof orig !== "function") { P.notes.push("wrap failed: " + name + " (" + typeof orig + ")"); return false; }
    if (orig.__perfwrapped) return true;
    const w = function () {
      const t0 = performance.now();
      try { return orig.apply(this, arguments); }
      finally {
        rec(P[bucket], performance.now() - t0);
        if (opts && opts.after) { try { opts.after(arguments); } catch (_) {} }
      }
    };
    w.__perfwrapped = 1;
    window[name] = w;
    return true;
  }

  const ok = {};
  // ⚠️ 存档字节数每 20 次才读一次 localStorage：每次 save 都读会把量到的时间本身撑大
  //（尺子不能改变它量的东西 —— 这条是量的时候发现的，见 PERF.md「进游戏之后」一节）
  let saveTick = 0;
  ok.save = wrap("save", "save", {
    after: () => {
      if (++saveTick % 20) return;
      try {
        const s = localStorage.getItem(KEY);
        if (s && P.save.bytes.length < P.cap) P.save.bytes.push(s.length);
      } catch (_) {}
    }
  });
  ["renderChat", "openThread", "appendMsg", "pkAppend", "pkWait", "packRefresh", "chatBgSet", "msgHTML", "pkDirective"].forEach(n => {
    ok[n] = wrap(n, n);
  });
  // openThread 是 async? 不是；packRun 是 async —— 包它只量同步那一段，没意义，跳过。
  P.notes.push("wrapped: " + Object.keys(ok).filter(k => ok[k]).join(","));
  P.notes.push("not wrapped: " + Object.keys(ok).filter(k => !ok[k]).join(","));

  // ---- 长任务（>50ms），这是「卡」在浏览器里的定义 ----
  try {
    new PerformanceObserver(list => {
      for (const e of list.getEntries()) {
        if (P.longtasks.length < P.cap) P.longtasks.push({ t: +e.startTime.toFixed(1), d: +e.duration.toFixed(1) });
      }
    }).observe({ entryTypes: ["longtask"] });
  } catch (e) { P.notes.push("no longtask observer: " + e.message); }

  // ---- 帧间隔：一直采样，reset() 决定算不算 ----
  let lastTs = 0, rafId = 0;
  function loop(ts) {
    if (P.frameOn) {
      if (lastTs) {
        const dt = ts - lastTs;
        if (P.frames.length < P.cap) P.frames.push(+dt.toFixed(1));
        if (dt > P.frameMax) P.frameMax = +dt.toFixed(1);
        if (dt > 33.4) P.framesDropped++;
      }
      lastTs = ts;
    } else lastTs = 0;
    rafId = requestAnimationFrame(loop);
  }
  rafId = requestAnimationFrame(loop);

  function domNow() {
    let nodes = document.getElementsByTagName("*").length;
    const msgs = document.getElementById("msgs");
    const cb = document.getElementById("cbImg");
    return {
      dom: nodes,
      msgsNodes: msgs ? msgs.children.length : null,
      cbVideos: cb ? cb.querySelectorAll("video").length : null,
      cbImgs: cb ? cb.querySelectorAll("img").length : null,
      rafHandles: null,
    };
  }

  P.reset = function () {
    for (const k of ["save", "renderChat", "openThread", "appendMsg", "pkAppend", "pkWait", "packRefresh", "chatBgSet", "msgHTML", "pkDirective"]) {
      P[k] = { calls: 0, total: 0, max: 0, samples: [] };
      if (k === "save") P[k].bytes = [];
    }
    P.longtasks = []; P.frames = []; P.frameMax = 0; P.framesDropped = 0;
    P.heartbeats = []; P.marks = {};
    P.frameOn = true; lastTs = 0;
    try { performance.clearMarks(); performance.clearMeasures(); } catch (_) {}
    const th = (typeof curT !== "undefined" && curT) ? S.threads[curT] : null;
    P.notes.push("reset at " + Date.now() + " th=" + (th ? th.id + " msgs=" + th.msgs.length : "none"));
    return "reset";
  };

  P.mark = function (name) { P.marks[name] = +(performance.now() - P.t0).toFixed(1); return name; };

  P.heartbeat = function (label) {
    const th = (typeof curT !== "undefined" && curT) ? S.threads[curT] : null;
    let mem = null;
    try { mem = performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null; } catch (_) {}
    const d = domNow();
    const h = {
      label: label || "", t: +(performance.now() - P.t0).toFixed(0),
      msgs: th ? th.msgs.length : null,
      saveBytes: (() => { try { const s = localStorage.getItem(KEY); return s ? s.length : null; } catch (_) { return null; } })(),
      memMB: mem, dom: d.dom, msgsNodes: d.msgsNodes, cbVideos: d.cbVideos, cbImgs: d.cbImgs,
    };
    P.heartbeats.push(h);
    return h;
  };

  P.report = function () {
    const th = (typeof curT !== "undefined" && curT) ? S.threads[curT] : null;
    const out = {
      v: P.v,
      threads: (() => { try { return Object.keys(S.threads).length; } catch (_) { return null; } })(),
      curThread: th ? { id: th.id, msgs: th.msgs.length, ch: th.pk ? th.pk.ch : null, st: th.pk ? th.pk.st : null } : null,
      cjk: null,
      marks: P.marks,
      longtasks: {
        n: P.longtasks.length,
        totalMs: +P.longtasks.reduce((s, x) => s + x.d, 0).toFixed(1),
        maxMs: P.longtasks.length ? Math.max.apply(null, P.longtasks.map(x => x.d)) : 0,
        list: P.longtasks.slice(0, 40),
      },
      frames: P.frames.length ? Object.assign(P.q(P.frames), { max: P.frameMax, dropped: P.framesDropped }) : null,
      heartbeats: P.heartbeats,
      notes: P.notes,
    };
    for (const k of ["save", "renderChat", "openThread", "appendMsg", "pkAppend", "pkWait", "packRefresh", "chatBgSet", "msgHTML", "pkDirective"]) {
      const b = P[k];
      out[k] = { calls: b.calls, totalMs: +b.total.toFixed(1), maxMs: +b.max.toFixed(2), stats: q(b.samples) };
      if (k === "save" && b.bytes.length) {
        out[k].bytes = { p50: q(b.bytes).p50, p95: q(b.bytes).p95, max: Math.max.apply(null, b.bytes), last: b.bytes[b.bytes.length - 1] };
      }
    }
    return JSON.stringify(out);
  };

  window.__MIRUPERF = P;
  return "installed v" + P.v + " | " + P.notes.join(" | ");
})()
