/* ================= 官方剧男主角色卡（2026-11-05）=================
   玩家：每个剧本的主角人物，都生成角色卡，让用户可以单独去玩。
   数据：art/official/leads.json（每部剧的男主：名字、立绘、身份、外貌、性格、第一句话……），先做《丝绒谎言》一部试效果。
   做法：
     · 每个男主注册成一个独立角色（id = ld_<作品>_<key>），出现在「发现 → 角色」里，点进去「💬 开始聊天」= 1 对 1 单聊（c:<id> 线程），
       和剧情线程互不影响；
     · 只有作品在线（官方作品列表里有它）时才出现，作品下线角色卡也跟着消失；
     · 角色页上「来自《丝绒谎言》」直接打开那部剧；「⑂ 改编」对这类角色不显示。
   不写进存档（C / W 是运行时的内置表），只有立绘地址记在 S.art。 */
(function () {
  "use strict";
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  const WID = wid => "ldw_" + wid;
  const live = new Set();
  let loaded = false;

  async function load() {
    let data = null, ids = null;
    try { const r = await fetch("art/official/leads.json?catalog=20261106&v=" + Math.floor(Date.now() / 6e5)); if (r.ok) data = await r.json(); } catch (e) { console.warn("[leads] json", e); }
    if (!data || !Array.isArray(data.works)) return;
    try {
      const r = await fetch("/api/works?feed=new&limit=200", { cache: "no-store" });
      if (r.ok) { const j = await r.json(); const rows = j.rows || j.works || j; if (Array.isArray(rows)) ids = new Set(rows.map(w => w.id)); }
    } catch (e) { console.warn("[leads] feed", e); }
    data.works.forEach(function (wk) {
      if (ids && !ids.has(wk.wid)) return;           /* 作品下线 → 不出角色卡（拿不到列表时照常显示） */
      live.add(wk.wid);
      const wid = WID(wk.wid), cast = [];
      (wk.leads || []).forEach(function (L) {
        const id = "ld_" + wk.wid.slice(-8) + "_" + L.key;
        cast.push(id);
        C[id] = {
          n: zh() ? L.n.zh : L.n.en, n94: L.n, age: L.age, h: L.h || "", w: wid, g: L.g || "m", pal: L.pal || ["#2B2238", "#0E0B14"],
          a: "charm", v: { pitch: 1, rate: 1 }, voiceId: L.voice || "", by: "@miru",
          role: L.role, looks: L.looks, vibe: L.vibe, pitch: L.pitch, solo: L.solo,
          likes: L.likes || { zh: "", en: "" }, boundary: L.boundary || { zh: "", en: "" },
          tells: { zh: [], en: [] }, twist: { zh: "", en: "" }, secret: { zh: "", en: "" }, want: { zh: "", en: "" }, fear: { zh: "", en: "" },
          ld126: wk.wid
        };
        /* 名字随语言切换（取值时按当前语言算，不用定时器） */
        Object.defineProperty(C[id], "n", { get: function () { return zh() ? L.n.zh : L.n.en; }, enumerable: true, configurable: true });
        if (L.art && S.art[id] !== L.art) S.art[id] = L.art;
      });
      if (!W.some(w => w.id === wid)) W.push({ id: wid, title: wk.title, or: wk.orient || "bg", tags: wk.tags || [], cast: cast, ld126: wk.wid, hook: { zh: "", en: "" }, stats: [0, 0], status: wk.status || { time: { zh: "", en: "" }, place: { zh: "", en: "" } } });
    });
    loaded = true;
    if (typeof disc !== "undefined" && disc.mode === "chars" && document.querySelector("#discRes")) renderDiscRes();
    try { if (typeof save === "function") save(); } catch (e) { console.warn("[leads] save", e); }
  }

  /* 这些「壳」作品只为角色卡服务，不出现在任何作品列表里 */
  if (typeof allWorlds === "function") { const _aw = allWorlds; allWorlds = function () { return _aw.apply(this, arguments).filter(w => !(w && w.ld126)); }; }

  /* 「来自《…》」→ 打开真正的那部剧；「改编」对这类角色无效 */
  document.addEventListener("click", function (e) {
    const t = e.target; if (!t || !t.closest) return;
    const s = t.closest('[data-story^="ldw_"]');
    if (s) {
      e.preventDefault(); e.stopImmediatePropagation();
      const wid = s.dataset.story.slice(4); const b = document.createElement("button"); b.dataset.off94 = wid; b.hidden = true;
      document.body.appendChild(b); b.click(); b.remove(); return;
    }
    const r = t.closest('[data-remix^="ldw_"]');
    if (r) { e.preventDefault(); e.stopImmediatePropagation(); if (typeof toast === "function") toast(zh() ? "这个角色来自官方剧，可以直接和他聊天" : "This character is from an official story — just chat with him"); }
  }, true);
  try { const st = document.createElement("style"); st.textContent = '[data-remix^="ldw_"]{display:none!important}'; document.head.appendChild(st); } catch (e) { console.warn("[leads] style", e); }

  if (document.readyState === "complete") load(); else window.addEventListener("load", load);
  window.__leads = () => ({ loaded: loaded, live: [...live], chars: Object.keys(C).filter(id => C[id] && C[id].ld126) });
})();
