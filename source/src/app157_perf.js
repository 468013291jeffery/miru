/* ================= 2026-11-21 · 性能：首页列表请求合并 + 媒体滚到眼前才加载 =================
   起因：线上「登录后、运行时都很卡」。实测（服务器在美国，国内一次往返约 250 ms，服务器只有 HTTP/1.1、同域最多 6 条连接）：
   1 首页官方新剧列表 off94Feed() 会被好几处同时调（进页面、2.5 秒后、每次画首页、每 60 秒刷新、切回页面），
     每调一次就把 40 多部剧的素材表重新取一遍，几条链同时跑。⇒ 这里加一层「正在取就等同一次结果」。
     （素材表本身改成并发 + 同一个文件同时只取一次，在 app94_official2.js 的 off94Assets / off94Feed 里。）
   2 发现页 / 搜索结果的卡片：封面图和预告片滚到眼前才加载（卡片上标 data-lz，地址写在 data-src / data-poster）。
     预告片同一时间最多放 2 个 —— 以前每张卡都是 autoplay 视频，一打开几十个视频同时下载，把 6 条连接全占住，
     点开一部剧、登录、对话的请求都只能排在后面等。
     （首页竖滑卡片的封面在 app15_home.js 的 feedWire 里按需加载。）
   3 首页列表缓存（miru_off94_v1，约 300 KB）内容没变就不重写 localStorage。
   这个文件必须排在所有包装 off94Feed 的模块（app100_fixes / app150_catalogrefresh）之后。 */
(function () {
  "use strict";
  /* ---------- 1 · off94Feed：同一时间只跑一趟 ---------- */
  try {
    if (typeof off94Feed === "function") {
      const feed = off94Feed; let busy = null;
      off94Feed = function () {
        if (busy) return busy;
        const p = Promise.resolve().then(() => feed.apply(this, arguments));
        busy = p; const done = () => { if (busy === p) busy = null; }; p.then(done, done);
        return p;
      };
    }
  } catch (e) { console.warn("[perf157] feed", e); }

  /* ---------- 2 · data-lz：滚到眼前才加载 ---------- */
  const MAX_PLAYING = 2;
  const fill = el => {
    try {
      if (el.tagName === "VIDEO") { if (el.dataset.poster && !el.getAttribute("poster")) el.setAttribute("poster", el.dataset.poster); }
      else if (el.dataset.src && !el.getAttribute("src")) el.setAttribute("src", el.dataset.src);
    } catch (e) { console.warn("[perf157] fill", e); }
  };
  const play = v => {
    try {
      if (!v.getAttribute("src") && v.dataset.src) v.setAttribute("src", v.dataset.src);
      v.muted = true; const p = v.play(); if (p && p.catch) p.catch(() => {});
    } catch (e) { console.warn("[perf157] play", e); }
  };
  const stop = v => { try { v.pause(); if (v.getAttribute("src")) { v.removeAttribute("src"); v.load(); } } catch (_) {} };
  const stopAll = () => {
    if (typeof feedStopVideo === "function" && feedCurrent) feedStopVideo(feedCurrent);
    document.querySelectorAll("video[data-lz]").forEach(stop);
  };
  try {
    if (typeof IntersectionObserver === "function" && typeof MutationObserver === "function") {
      const showing = new Set();   /* 眼前（露出一半以上）的预告片，按进入先后 */
      const pump = () => { let n = 0; showing.forEach(v => { if (!v.isConnected || document.hidden || v.closest(".screen[hidden]")) { stop(v); showing.delete(v); return; } if (n < MAX_PLAYING) { n++; if (v.paused) play(v); } else stop(v); }); };
      const io = new IntersectionObserver(es => {
        es.forEach(en => {
          const el = en.target;
          if (el.tagName === "VIDEO") {
            if (en.isIntersecting) fill(el);
            if (en.isIntersecting && en.intersectionRatio >= .5) showing.add(el); else { showing.delete(el); stop(el); }
          } else if (en.isIntersecting) { fill(el); io.unobserve(el); }
        });
        pump();
      }, { rootMargin: "120px", threshold: [0, .5] });
      let queued = false;
      const scan = () => { queued = false; pump(); document.querySelectorAll("[data-lz]:not([data-lzo])").forEach(el => { el.dataset.lzo = "1"; io.observe(el); }); };
      const ask = () => { if (queued) return; queued = true; setTimeout(scan, 60); };
      new MutationObserver(ask).observe(document.body, { childList: true, subtree: true });
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) { showing.forEach(stop); showing.clear(); }
        else document.querySelectorAll("[data-lz]").forEach(el => { io.unobserve(el); io.observe(el); });
      });
      ask();
    } else {
      /* 老浏览器：没有 IntersectionObserver 就照以前的做法，卡片一出现就全部直接加载（不用定时器） */
      const all = () => document.querySelectorAll("[data-lz]:not([data-lzo])").forEach(el => { el.dataset.lzo = "1"; fill(el); if (el.tagName === "VIDEO") play(el); });
      const later = () => setTimeout(all, 80);
      if (typeof MutationObserver === "function") new MutationObserver(later).observe(document.body, { childList: true, subtree: true });
      else document.addEventListener("click", later, true);
      all();
    }
  } catch (e) { console.warn("[perf157] lazy", e); }

  const showScreen = show;
  show = function (id) { if (id !== "s-main") stopAll(); return showScreen.apply(this, arguments); };
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAll();
    else if (typeof feedWire === "function" && !document.getElementById("s-main")?.hidden) feedWire();
  });
  window.PERF157 = { max: MAX_PLAYING, stopAll };
})();
