/* Use the same-origin backend on MIRU production domains. */
if (['miru.plus', 'www.miru.plus'].includes(location.hostname)) {
  window.MIRU_TTS = '/api/tts';
}
/* ---- MIRU 可调参数（外置滑钮）-----------------------------------------
   改这里**不用重新构建**：保存后刷新页面就生效。只写你想改的键，其余保持默认。
   拼错的键会被忽略（不会静默生效）。每一格的含义与风险见 TUNING.md。
   取消注释就是改用它：
   window.MIRU_TUNE_OVERRIDE = {
     pay:  { packPrice: 60, endingNeed: 5 },
     ai:   { costDeep: 4 },
     chat: { transcript: 30 },
     love: { deltaCap: 20 },
     affinity: { cap: 20 },
     report: { omniscienceThreshold: 0.15 }
   };
------------------------------------------------------------------------ */
window.MIRU_TUNE_OVERRIDE = window.MIRU_TUNE_OVERRIDE || {};
/* AdSense web bootstrap: production only; separate from rewarded ads. */
(function () {
  function loadWebAds() {
    if (!['miru.plus', 'www.miru.plus'].includes(location.hostname)) return;
    if (typeof S !== 'undefined' && S.plus) return;
    if (document.getElementById('miru-adsense')) return;
    var script = document.createElement('script');
    script.id = 'miru-adsense';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1779576119248059';
    document.head.appendChild(script);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWebAds, { once: true });
  } else {
    loadWebAds();
  }
})();
