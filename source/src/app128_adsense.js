/* ================= 真广告：Google AdSense 激励广告（H5 Ad Placement API · adBreak）（2026-11-05）=================
   以前 watchAd 是 15 秒模拟播放，不产生收入。这里接上 AdSense：
     · PUB 填上 AdSense 发布商 ID（ca-pub-…）后生效；没填时保持原来的模拟播放（开发 / 预览用）。
     · 激励广告：adBreak({type:'reward'})，只有 adViewed（看完）才发奖励；没有可播的广告就提示“暂时没有广告”，不发奖励。
     · 次数上限、MIRU+ 免广告等规则沿用 app9_ads.js（adLeft / adState）。
     · 网站根目录要放 ads.txt（google.com, pub-…, DIRECT, f08c47fec0942fa0）。
   安卓 App 是 TWA（真 Chrome，不是 WebView），AdSense 在 App 里同样可用。 */
(function () {
  "use strict";
  if (window.MIRU_NATIVE && window.MIRU_NATIVE.platform === "ios") return;
  const PUB = "ca-pub-1779576119248059"; /* 2026-11-09 打开：AdSense 还在审核时没有广告可播，自动退回原来的模拟广告；审核通过后真广告自动接上，不用再改代码 */
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  window.__ads128 = () => ({ pub: PUB, ready: !!window.adBreak });
  if (!PUB || typeof watchAd !== "function") return;

  try {
    /* 2026-11-12：页面 <head> 里已经静态放了 adsbygoogle.js（审核要求代码在页面源码里），这里就不再插第二份 */
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(PUB);
    s.crossOrigin = "anonymous";
    s.setAttribute("data-ad-frequency-hint", "30s");
    if (/[?&]adtest=on/.test(location.search)) s.setAttribute("data-adbreak-test", "on");
    document.head.appendChild(s);
    }
  } catch (e) { console.warn("[ads] load", e); }
  window.adsbygoogle = window.adsbygoogle || [];
  window.adBreak = window.adConfig = function (o) { window.adsbygoogle.push(o); };
  try { window.adConfig({ preloadAdBreaks: "on", sound: "on" }); } catch (e) { console.warn("[ads] config", e); }

  const sim = watchAd; /* 原来的模拟播放：没有真广告时兜底 */
  let busy = false;
  watchAd = function (done) {
    if (!adLeft()) { toast(t("ad.none")); return; }
    if (busy) return; busy = true;
    if (typeof closeSheet === "function") closeSheet();
    let viewed = false, offered = false, settled = false;
    /* 5 秒内广告脚本没反应（审核中 / 被拦截 / 网络慢）→ 用模拟广告，不让玩家干等 */
    const fb = setTimeout(function () { if (settled || offered) return; settled = true; busy = false; sim(done); }, 5000);
    window.adBreak({
      type: "reward",
      name: "miru_reward",
      beforeReward: function (showAdFn) { offered = true; showAdFn(); },
      adDismissed: function () { toast(t("ad.keep")); },
      adViewed: function () { viewed = true; },
      adBreakDone: function (info) {
        if (settled) return; settled = true; clearTimeout(fb);
        busy = false;
        if (viewed) { const st = adState(); st.n++; save(); if (done) done(); return; }
        if (!offered) sim(done); /* 没有真广告可播：退回模拟广告 */
        try { if (typeof track === "function") track("ad_nofill", { status: info && info.breakStatus }); } catch (e) { console.debug("[ads]", e); }
      }
    });
    setTimeout(function () { busy = false; }, 60000);
  };
})();
