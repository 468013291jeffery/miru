/* ================= 发现页整理（2026-11-12）=================
   用户反馈：「点击角色后页面真的混乱」。
   1 · 「社区新作」那一排是故事卡片，只该出现在「故事」里；切到「角色」（app140 的 .meet140）时把它藏起来，
       角色页从「故事 / 角色」标签开始，下面只有已配对和遇见。
   2 · 社区新作里有的官方作品没有封面（作品表里 cover 为空，只显示 📖），
       就去读它的官方资源表 art/official/<作品id>.json 里的 cover / poster 补上。
   3 · 用户反馈：「为什么每次都要制作，你做好直接进去不行吗」。
       官方剧第一次开始时 app76 会走 app74 的「正在把你的剧做成正式版」（AI 包装，最多等 30 秒）。
       官方剧的音乐、特效、小游戏剧本里已经写好了，不需要再配 ⇒ 直接开始；
       故事页和简介用后台写好的原文（app76 装作品时已经搭好开场卡），不再等 AI 包装。 */
(function () {
  "use strict";
  const st = document.createElement("style");
  st.textContent = "#s-main .scroll:has(.meet140) .comm68,#s-main:has(.meet140) .comm68{display:none!important}";
  document.head.appendChild(st);

  const cache = {};
  async function coverOf(id) {
    if (Object.prototype.hasOwnProperty.call(cache, id)) return cache[id];
    cache[id] = null;
    try {
      const r = await fetch("/art/official/" + encodeURIComponent(id) + ".json");
      if (r.ok) {
        const j = await r.json(); let c = String(j.cover || j.poster || "");
        if (c && !/^https?:\/\//.test(c)) c = "/" + c.replace(/^\/+/, "");
        cache[id] = c || null;
      }
    } catch (_) {}
    return cache[id];
  }
  let busy = false;
  function patch() {
    if (busy) return; busy = true;
    const list = [...document.querySelectorAll(".comm68 [data-cwork] .cph")];
    Promise.all(list.map(async ph => {
      const b = ph.closest("[data-cwork]"); if (!b) return;
      const c = await coverOf(b.dataset.cwork);
      if (c && ph.isConnected) { const im = document.createElement("img"); im.src = c; im.alt = ""; im.loading = "lazy"; ph.replaceWith(im); }
    })).finally(() => { busy = false; });
  }
  let t = 0;
  new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => { if (document.querySelector(".comm68 .cph")) patch(); }, 150); })
    .observe(document.body, { childList: true, subtree: true });

  /* ---------- 3 · 官方剧直接开始 ---------- */
  if (typeof packStart === "function") {
    const start = packStart;
    packStart = function (wid) {
      try {
        const w = wd(wid);
        if (w && w.official76 && w.pack && !w.pack.exp74) {
          w.pack.exp74 = { at: Date.now(), official: 1, quiet: 1 }; save();
        }
      } catch (e) { console.warn("[144] start", e); }
      return start.apply(this, arguments);
    };
  }
})();
