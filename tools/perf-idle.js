/* ================= 进游戏之后的 idle：后台还有没有东西在烧 CPU =================
   PERF.md 量过**引导页** idle 10 秒：长任务 0 个、0 ms，正对照（忙等 120ms）能检出 1 条 ⇒ 那把尺会开火。
   但那一节自己写着「这次测的是引导页，不是我进不去的游戏内画面」。
   换章之后「更卡」如果真有来历，「后台累积的东西」是最可疑的一类（每帧循环 / 定时器 / 观察者 / 视频解码）。
   这一支就只答那一个问题：**游戏里 idle N 秒，主线程忙不忙；第 8 章和第 2 章是不是一样忙。**

   注入后：
     __IDLE.run(3000)        // 量 3 秒 idle（人不动、剧情也在等），返回读数
     __IDLE.control(120)     // 正对照：故意忙等 120ms，确认这把尺会开火
   ============================================================== */
(function () {
  if (window.__IDLE) return "already";
  const I = { v: 1 };

  function measure(ms) {
    return new Promise(resolve => {
      const lts = [];
      let obs = null;
      try {
        obs = new PerformanceObserver(list => { for (const e of list.getEntries()) lts.push(+e.duration.toFixed(1)); });
        obs.observe({ entryTypes: ["longtask"] });
      } catch (_) {}
      const gaps = [];
      let last = 0, maxGap = 0, dropped = 0;
      let raf = 0;
      const t0 = performance.now();
      const step = ts => {
        if (last) {
          const dt = ts - last;
          gaps.push(dt);
          if (dt > maxGap) maxGap = dt;
          if (dt > 33.4) dropped++;
        }
        last = ts;
        if (ts - t0 < ms) raf = requestAnimationFrame(step);
        else {
          cancelAnimationFrame(raf);
          try { obs && obs.disconnect(); } catch (_) {}
          let mem = null;
          try { mem = performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null; } catch (_) {}
          const th = (typeof curT !== "undefined" && curT) ? S.threads[curT] : null;
          const cb = document.getElementById("cbImg");
          resolve({
            windowMs: Math.round(ts - t0),
            longtasks: lts.length,
            longtaskTotalMs: +lts.reduce((a, b) => a + b, 0).toFixed(1),
            longtaskMaxMs: lts.length ? Math.max.apply(null, lts) : 0,
            frames: gaps.length,
            fps: +(gaps.length / ((ts - t0) / 1000)).toFixed(1),
            frameMaxMs: +maxGap.toFixed(1),
            droppedFrames: dropped,
            dom: document.getElementsByTagName("*").length,
            msgsNodes: (function () { const m = document.getElementById("msgs"); return m ? m.children.length : null; })(),
            cbVideos: cb ? cb.querySelectorAll("video").length : null,
            cbImgs: cb ? cb.querySelectorAll("img").length : null,
            canvases: document.getElementsByTagName("canvas").length,
            threadMsgs: th ? th.msgs.length : null,
            chapter: th && th.pk ? th.pk.ch : null,
            memMB: mem,
          });
        }
      };
      raf = requestAnimationFrame(step);
    });
  }

  I.run = function (ms) { return measure(ms || 3000).then(r => JSON.stringify(r)); };

  // 正对照：故意让主线程忙等 ms 毫秒 —— 如果这时 longtasks 还是 0，是尺子坏了，不是页干净
  I.control = function (ms) {
    const t0 = performance.now();
    while (performance.now() - t0 < (ms || 120)) { /* busy */ }
    return "busy " + Math.round(performance.now() - t0) + "ms";
  };

  window.__IDLE = I;
  return "idle-probe installed";
})()
