/* ================= 自动用上新版本（2026-11-04）=================
   玩家：上新了，手机上还是旧样子（iPhone Safari 会把页面一直留在内存里，不刷新就一直是旧版）。
   做法：打开时记下 index.html 的 ETag；之后每次从后台切回来（离开 ≥ 20 秒），悄悄问一次服务器，
   ETag 变了 = 有新版本 → 先 save() 再刷新。进度都在本地存档里，刷新不丢。
   AI 正在回复时不刷，等下次切回来。 */
(function () {
  "use strict";
  let base = null, hiddenAt = 0;
  const tag = () => fetch("/index.html", { method: "HEAD", cache: "no-store" })
    .then(r => r.ok ? (r.headers.get("etag") || r.headers.get("last-modified") || "") : "")
    .catch(() => "");
  const busy = () => { try { return !!(window.BUSY || document.querySelector(".typing,.alt123busy,[data-b98next][disabled]")); } catch (e) { return false; } };
  setTimeout(() => { tag().then(t => { base = t || null; }); }, 4000);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { hiddenAt = Date.now(); return; }
    if (!base || !hiddenAt || Date.now() - hiddenAt < 20000) return;
    tag().then(t => {
      if (!t || t === base || busy()) return;
      try { if (typeof save === "function") save(); } catch (e) { console.warn("[fresh] save", e); }
      location.reload();
    });
  });
  window.__fresh = () => ({ base: base });
})();
