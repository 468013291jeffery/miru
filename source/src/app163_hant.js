/* ===== app163 · 2026-11-28 中文界面全部显示为繁体 =====
   需求：目前所有中文（界面文字、剧本正文、AI 回复、卡片标题简介……）全部换成繁体。
   做法：不改任何数据和源码里的简体字，只在「显示」这一层转换 —— 语言是中文时，
   按需加载 /opencc-cn2t.js（OpenCC 开源简繁转换词库，台湾字形 cn → tw，约 450KB 压缩后，浏览器会缓存），
   把页面上已有的文字整页转一遍，再用 MutationObserver 盯住之后新出现 / 变化的文字（新页面、AI 逐字输出等），
   在浏览器画出来之前就转成繁体。
   不转：用户正在输入的输入框 / 文本框 / 可编辑区域里的内容、<script> / <style>、带 data-no-hant 的元素。
   转：普通文字、placeholder、title、aria-label、alt、按钮 value、网页标题。
   英 / 日 / 韩 / 西语界面完全不受影响（不加载词库）。 */
(function () {
  "use strict";
  const SRC = "/opencc-cn2t.js";
  const SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, NOSCRIPT: 1, CODE: 1, PRE: 1 };
  const ATTRS = ["placeholder", "title", "aria-label", "alt"];
  const HAN = /[\u4e00-\u9fff]/;
  let conv = null, loading = false, obs = null, on = false, busy = false;

  const isZh = () => { try { return (typeof CL === "function" ? CL() : (window.S && S.lang)) === "zh"; } catch (_) { return false; } };

  function skipEl(el) {
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      if (SKIP[e.tagName] || e.isContentEditable || (e.dataset && e.dataset.noHant != null)) return true;
    }
    return false;
  }
  function cvText(n) {
    const v = n.nodeValue;
    if (!v || !HAN.test(v)) return;
    const p = n.parentElement;
    if (p && skipEl(p)) return;
    const w = conv(v);
    if (w !== v) n.nodeValue = w;
  }
  function cvAttrs(el) {
    if (el.nodeType !== 1 || skipEl(el.tagName === "INPUT" || el.tagName === "TEXTAREA" ? el.parentElement : el)) return;
    for (const a of ATTRS) {
      const v = el.getAttribute && el.getAttribute(a);
      if (v && HAN.test(v)) { const w = conv(v); if (w !== v) el.setAttribute(a, w); }
    }
    if (el.tagName === "INPUT" && /^(button|submit|reset)$/i.test(el.type) && HAN.test(el.value)) el.value = conv(el.value);
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { cvText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1) { if (SKIP[root.tagName] && root.tagName !== "INPUT" && root.tagName !== "TEXTAREA") return; cvAttrs(root); }
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null);
    let n;
    while ((n = tw.nextNode())) { if (n.nodeType === 3) cvText(n); else cvAttrs(n); }
  }
  function title() { const t = document.title; if (t && HAN.test(t)) { const w = conv(t); if (w !== t) document.title = w; } }

  function start() {
    if (on || !conv) return;
    on = true;
    busy = true; try { walk(document.body); title(); } finally { busy = false; }
    obs = new MutationObserver(list => {
      if (!on || busy) return;
      busy = true;
      try {
        for (const m of list) {
          if (m.type === "characterData") cvText(m.target);
          else if (m.type === "attributes") cvAttrs(m.target);
          else for (const n of m.addedNodes) walk(n);
        }
        title();
      } finally { busy = false; }
    });
    obs.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  function stop() { on = false; if (obs) { obs.disconnect(); obs = null; } }

  function load() {
    if (conv || loading) return;
    loading = true;
    const s = document.createElement("script");
    s.src = SRC; s.async = true;
    s.onload = () => {
      try { conv = window.OpenCC.Converter({ from: "cn", to: "tw" }); window.toHant = conv; } catch (e) { console.warn("[hant]", e); }
      loading = false;
      if (isZh()) start();
    };
    s.onerror = () => { loading = false; };
    document.head.appendChild(s);
  }

  /* 语言随时可能切换：每秒看一次，切到中文就开始转，切走就停（已转的文字在切语言时页面会重画） */
  function tick() { if (isZh()) { if (conv) start(); else load(); } else if (on) stop(); }
  tick();
  setInterval(tick, 1000);
  /* 首屏尽早开始：词库提前下载（只在中文时） */
  try { if (isZh()) load(); } catch (_) {}
})();
