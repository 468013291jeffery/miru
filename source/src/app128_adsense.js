/* ================= 真广告：Google AdSense 激励广告（H5 Ad Placement API · adBreak）（2026-11-05）=================
   以前 watchAd 是 15 秒模拟播放，不产生收入。这里接上 AdSense：
     · PUB 填上 AdSense 发布商 ID（ca-pub-…）后生效；没填时保持原来的模拟播放（开发 / 预览用）。
     · 激励广告：adBreak({type:'reward'})，只有 adViewed（看完）才发奖励；没有可播的广告就提示“暂时没有广告”，不发奖励。
     · 次数上限、MIRU+ 免广告等规则沿用 app9_ads.js（adLeft / adState）。
     · 网站根目录要放 ads.txt（google.com, pub-…, DIRECT, f08c47fec0942fa0）。
   安卓 App 是 TWA（真 Chrome，不是 WebView），AdSense 在 App 里同样可用。 */
(function () {
  "use strict";
  const PUB = ""; /* AdSense 审核通过后填：ca-pub-1779576119248059 */
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  window.__ads128 = () => ({ pub: PUB, ready: !!window.adBreak });
  if (!PUB || typeof watchAd !== "function") return;

  try {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(PUB);
    s.crossOrigin = "anonymous";
    s.setAttribute("data-ad-frequency-hint", "30s");
    if (/[?&]adtest=on/.test(location.search)) s.setAttribute("data-adbreak-test", "on");
    document.head.appendChild(s);
  } catch (e) { console.warn("[ads] load", e); }
  window.adsbygoogle = window.adsbygoogle || [];
  window.adBreak = window.adConfig = function (o) { window.adsbygoogle.push(o); };
  try { window.adConfig({ preloadAdBreaks: "on", sound: "on" }); } catch (e) { console.warn("[ads] config", e); }

  let busy = false;
  watchAd = function (done) {
    if (!adLeft()) { toast(t("ad.none")); return; }
    if (busy) return; busy = true;
    if (typeof closeSheet === "function") closeSheet();
    let viewed = false, offered = false;
    window.adBreak({
      type: "reward",
      name: "miru_reward",
      beforeReward: function (showAdFn) { offered = true; showAdFn(); },
      adDismissed: function () { toast(t("ad.keep")); },
      adViewed: function () { viewed = true; },
      adBreakDone: function (info) {
        busy = false;
        if (viewed) { const st = adState(); st.n++; save(); if (done) done(); return; }
        if (!offered) toast(zh() ? "暂时没有可播放的广告，稍后再试" : "No ad available right now — try again later");
        try { if (typeof track === "function") track("ad_nofill", { status: info && info.breakStatus }); } catch (e) { console.debug("[ads]", e); }
      }
    });
    setTimeout(function () { busy = false; }, 60000);
  };
})();
