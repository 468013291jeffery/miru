/* ================= v2.7.1 · 中文版只显示中文 =================
   Audit (every onboarding step, tabs, store, taste sheet, a story) found these English labels left in the Chinese UI:
   BL/BG/GL/GG pairing names, 「10 ch」, 「AU」, 「API Key」 and the pronoun labels he/she/they. Fixed at the source where the strings live,
   with a small safety net that rewrites the same tokens if they show up anywhere else in Chinese mode. Character names stay as they are
   (product decision), so do brand / product names (MIRU, Apple, Google, iPhone, Claude, LongCat). The English UI was already clean. */
(function () {
  try {
    if (I18N.zh) Object.assign(I18N.zh, {
      "ob.bl": "男男", "ob.blS": "宿敌、保镖、慢热", "ob.gl": "女女", "ob.glS": "暗恋、室友、对手", "ob.bg": "男女", "ob.nl": "男女",
      "ob.bothS": "男男优先，也看男女", "ob.glLink": "也想看女女", "dc.makeS": "二创任意故事——平行世界、新结局、你的阵容。",
    });
  } catch (_) {}
  try { if (typeof TAXN === "object") { if (TAXN.P_bl) TAXN.P_bl[1] = "男男"; if (TAXN.P_bg) TAXN.P_bg[1] = "男女"; if (TAXN.P_gl) TAXN.P_gl[1] = "女女"; } } catch (_) {}
})();
const ZH_FIX = [
  [/\bM\/M\b/g, "男男"], [/\bM\/F\b/g, "男女"], [/\bF\/F\b/g, "女女"],
  [/\bBL\b/g, "男男"], [/\bBG\b/g, "男女"], [/\bGL\b/g, "女女"], [/\bGG\b/g, "女女"],
  [/(\d+)\s*ch\b/g, "$1 章"], [/\bAU\b/g, "平行世界"], [/API\s*(Key|密钥)/gi, "接口密钥"],
  [/(\d+(?:\.\d+)?)([KM])\b/g, (m, n, u) => { const v = parseFloat(n) * (u === "K" ? 1e3 : 1e6); return v >= 1e4 ? (Math.round(v / 1e3) / 10) + "万" : String(Math.round(v)); }],
  [/@miru\b/g, "MIRU 官方"],
  [/\bhe\/him\b/g, "他"], [/\bshe\/her\b/g, "她"], [/\bthey\/them\b/g, "TA"], [/^they\b/g, "TA"], [/^she\b/g, "她"], [/^he\b/g, "他"],
];
function zhFixText(s) { let o = s; for (const [rx, to] of ZH_FIX) o = o.replace(rx, to); return o; }
function zhFixTree(root) {
  if (S.lang !== "zh" || !root) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => { const p = n.parentElement; if (!p || p.closest("script,style,textarea,input,.msg,.bubble,.mtxt,[contenteditable]")) return NodeFilter.FILTER_REJECT; return /[A-Za-z]/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP; } });
  const list = []; while (w.nextNode()) list.push(w.currentNode);
  for (const n of list) { const v = zhFixText(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
}
(function () {
  let q = null;
  const mo = new MutationObserver(ms => { if (S.lang !== "zh") return; if (q) return; q = setTimeout(() => { q = null; zhFixTree(document.body); }, 30); });
  mo.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  setTimeout(() => zhFixTree(document.body), 300);
})();
