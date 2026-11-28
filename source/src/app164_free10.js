/* ===== app164 · 2026-11-28 免费额度调整（老板定）=====
   ① 文字聊天：免费 10 句（原来是 24 个「AI 回合」免费体验，一个账号一次性），用完后要付费：
      购买 AI 回合（💎，价格见 MIRU_TUNE.pay.topupUnits / topupCost）。不再卖 MIRU+ 会员。
      老用户手里剩余的免费回合超过 10 的，一次性压到 10；已经花钻石买的回合、会员回合不动。
   ② AI 生图：非会员不再有「每天 1 张免费」，每张都按 PRICES.img 收 💎。（不再卖会员；历史上已是会员的账号不受影响。）
   说明：回合数和生图次数目前记在用户自己的存档里（和原来一样），服务器没有另外计数。 */
(function () {
  "use strict";
  const FREE = 10;
  if (typeof uState === "function" && typeof S !== "undefined") {
    const U0 = uState;
    uState = function () {
      if (!S.units) S.units = { trial: FREE, pack: 0, pm: "", pl: 0, f10: 1 };
      const u = U0.apply(this, arguments);
      if (!u.f10) { if (u.trial > FREE) u.trial = FREE; u.f10 = 1; try { save(); } catch (_) {} }
      return u;
    };
    try { uState(); if (typeof unitChip === "function") unitChip(); } catch (_) {}
  }
  const noFreeImg = () => {
    try {
      if (typeof S === "undefined" || S.plus) return;
      const d = typeof today === "function" ? today() : new Date().toISOString().slice(0, 10);
      const n = S.imgDay && S.imgDay.d === d ? (S.imgDay.n || 0) : 0;
      S.imgDay = { d: d, n: Math.max(1, n) };
    } catch (_) {}
  };
  if (typeof aiGenerate === "function") { const A0 = aiGenerate; aiGenerate = function () { noFreeImg(); return A0.apply(this, arguments); }; }
  if (typeof rxGenCover === "function") { const R0 = rxGenCover; rxGenCover = function () { noFreeImg(); return R0.apply(this, arguments); }; }
  try {
    const p = (typeof PRICES !== "undefined" && PRICES.img) || 2;
    if (typeof I18N !== "undefined") {
      Object.assign(I18N.zh, { "pay.imgFree": "AI 生图每张 💎 " + p + "——点 ✨ 生成。", "pay.why.img": "AI 生图每张 💎 " + p, "u.trial": "免费 10 句" });
      Object.assign(I18N.en, { "pay.imgFree": "AI images are 💎 " + p + " each — tap ✨ to make one.", "pay.why.img": "AI images are 💎 " + p + " each", "u.trial": "10 free messages" });
    }
  } catch (_) {}
  /* 2026-11-28 老板定：不卖会员（MIRU+）了，额度用完就再买。购买面板里的会员入口之前已经隐藏（app84），
     （11-28 修正：只隐藏 MIRU+ 那一行；它和「钻石 · 充值」在同一张卡片里，之前把整张卡片藏掉，充值按钮也跟着不见了。）
     这里把剩下的两处也去掉：「我的」页里的 MIRU+ 卡片、AI 回合面板里的「本月会员回合」那一格。 */
  try {
    const st = document.createElement("style");
    st.textContent = '.row:has(>[data-plusset]),[data-plusset]{display:none!important}.ubreak>div:nth-child(3){display:none!important}';
    document.head.appendChild(st);
  } catch (_) {}
  /* 2026-11-28 老板定：创作者专业版（剧本工具）所有 AI 收费先统一 💎1 —— 专业版里的 AI 生图价格由这里给（其余在 web/src/Pro.jsx 的 PRICE）。
     App 里聊天时的 AI 生图不受影响，还是 PRICES.img。 */
  try { window.studioImagePrice = function () { return 1; }; } catch (_) {}
  window.__free10 = () => ({ units: (typeof S !== "undefined" && S.units) || null, img: (typeof S !== "undefined" && S.imgDay) || null });
})();

/* ===== 2026-11-28 · 视频定价 video15 =====
   老板：视频生成成本大约 ¥1 / 秒，对用户至少按成本的 3–5 倍收。
   现在的「让画面动起来」是 5 秒 720p，成本约 ¥5；原价 💎5（按 $0.99 = 5 钻约 ¥7，大礼包折后更低，再扣掉商店抽成基本不赚）。
   改成 💎15：按标价约 ¥21（约 4 倍），按最大礼包折后价再扣 15% 商店抽成约 ¥14（约 2.7 倍）。生成失败照旧全额退回。 */
(function () {
  "use strict";
  /* 2026-11-28 更正：老板确认视频是 10 秒一段（成本约 ¥7）。15 钻按标价只有 3 倍、礼包折后再扣商店抽成只有约 2 倍，
     所以改成 💎25：按标价约 ¥35（约 5 倍），折后扣抽成约 ¥23（约 3.3 倍），落在「至少 3–5 倍」里。 */
  try { if (typeof PRICES === "object") PRICES.video = 25; } catch (_) {}
  try { if (typeof VID === "object") VID.price = 25; } catch (_) {}
})();
