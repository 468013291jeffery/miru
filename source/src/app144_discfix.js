/* ================= 发现页整理（2026-11-12）=================
   用户反馈：「点击角色后页面真的混乱」。
   1 · 「社区新作」那一排是故事卡片，只该出现在「故事」里；切到「角色」（app140 的 .meet140）时把它藏起来，
       角色页从「故事 / 角色」标签开始，下面只有已配对和遇见。
   2 · 社区新作里有的官方作品没有封面（作品表里 cover 为空，只显示 📖），
       就去读它的官方资源表 art/official/<作品id>.json 里的 cover / poster 补上。
   3 · 用户反馈：「为什么每次都要制作，你做好直接进去不行吗」。
       官方剧第一次开始时 app76 会走 app74 的「正在把你的剧做成正式版」（AI 包装，最多等 30 秒）。
       官方剧的音乐、特效、小游戏剧本里已经写好了，不需要再配 ⇒ 直接开始；
       故事页和简介用后台写好的原文（app76 装作品时已经搭好开场卡），不再等 AI 包装。
   4 · 用户反馈：「语音每次第一句和有的时候要读两遍」。
       朗读有好几条路（剧本播放 pkAppend / pkWait、AI 回复 playBeats、appendMsg 兜底 voiceEnq、气泡 🔊 等），
       各自防重只认自己那份标记，碰上同一句就各念一遍。⇒ 在最底下的 speak() 统一去重：
       同一个人、同一句话 30 秒内只念一次；后来的调用不再发声，只等第一遍念完再回调（剧本节奏不变）。
       玩家自己点气泡上的 🔊（data-mt / data-b86 = play|…）照常重念。
   5 · 用户反馈：「精选」里所有剧都堆在一排「MIRU 新剧」下面，没有分类。
       ⇒ 「MIRU 新剧」只放最新 6 部；下面按主题竖着排几排，每排横滑：
         奇幻言情 · 暗黑与黑帮 · 悬疑反转 · 王室与豪门 · 甜宠心动。
       （「修罗场 / 多男主」试过，14 部里 13 部都是，等于没分，所以不单列。）
       分组按作品的标准标签（catalog.json）归类，一部剧可以出现在几排；少于 2 部的那排不显示。 */
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

  /* ---------- 4 · 同一句不念两遍 ---------- */
  if (typeof speak === "function") {
    const sp = speak, recent = new Map(); let manualAt = 0;
    document.addEventListener("click", e => { const x = e.target.closest && e.target.closest('[data-mt^="play|"],[data-b86^="play|"]'); if (x) manualAt = Date.now(); }, true);
    speak = function (text, id, onend) {
      const now = Date.now(), key = (id || "") + "|" + String(text || "").replace(/\s+/g, "").slice(0, 240);
      for (const [k, v] of recent) if (now - v.at > 30000) recent.delete(k);
      const old = recent.get(key);
      if (old && now - manualAt > 1500) { old.p.then(() => { try { onend && onend(); } catch (_) {} }); return; }
      let res; const p = new Promise(r => { res = r; }); let fired = false;
      const fin = function () { if (fired) return; fired = true; res(); try { onend && onend.apply(this, arguments); } catch (_) {} };
      setTimeout(res, 60000);
      recent.set(key, { at: now, p });
      try { return sp.call(this, text, id, fin); } catch (err) { fin(); throw err; }
    };
  }

  /* ---------- 5 · 精选页按主题分排 ---------- */
  const SHELVES = [
    ["🌙", "奇幻言情", "Romantasy", ["Romantasy", "Vampires", "Werewolves", "Fae", "Dragons", "Paranormal", "Fated Mates", "Gothic Romance"]],
    ["🖤", "暗黑与黑帮", "Dark & Dangerous", ["Dark Romance", "Mafia", "Bratva", "Touch Her and Die", "Touch Them and Die"]],
    ["🔍", "悬疑反转", "Twists & Secrets", ["Romantic Suspense", "Revenge", "Hidden Identity", "Secret Heir", "Mystery"]],
    ["👑", "王室与豪门", "Crowns & Fortunes", ["Royal Court", "Billionaire", "Arranged Marriage", "Castle Life"]],
    ["☀️", "甜宠心动", "Sweet & Swoony", ["Romance", "Rom-Com", "He Falls First", "Golden Retriever", "Mutual Pining", "Secret Admirer", "Vacation", "Celebrity", "Campus"]]
  ];
  if (typeof discMain === "function" && typeof off94RCard === "function") {
    const main = discMain;
    discMain = function () {
      let h = main.apply(this, arguments);
      try {
        const L = (typeof OFFF94 !== "undefined" && OFFF94.list) || [];
        if (!L.length) return h;
        const z = (typeof CL === "function" ? CL() === "zh" : true);
        const old = '<div class="shelf off94s"><div class="shd"><h3>✦ ' + (z ? "MIRU 新剧" : "New from MIRU") + '</h3></div><div class="rail2">' + L.map(off94RCard).join("") + '</div></div>';
        if (h.indexOf(old) < 0) return h;
        const fresh = new Set(L.slice(0, 6).map(w => w.id));   /* 「新剧」角标只留给最新 6 部 */
        const card = w => fresh.has(w.id) ? off94RCard(w) : off94RCard(w).replace(/<span class="rbadge">[^<]*<\/span>/, "");
        const shelf = (title, list, cls) => '<div class="shelf off94s ' + (cls || "") + '"><div class="shd"><h3>' + title + '</h3></div><div class="rail2">' + list.map(card).join("") + '</div></div>';
        let out = shelf("✦ " + (z ? "MIRU 新剧" : "New from MIRU"), L.slice(0, 6), "s144new");
        SHELVES.forEach(([ic, zt, et, tags]) => {
          const list = L.filter(w => (w.tags || []).some(t => tags.includes(t)));
          if (list.length >= 2) out += shelf(ic + " " + (z ? zt : et), list, "s144");
        });
        h = h.replace(old, out);
      } catch (e) { console.warn("[144] shelves", e); }
      return h;
    };
  }
})();
