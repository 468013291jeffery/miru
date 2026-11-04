/* MIRU service worker（2026-11-05）—— 只为让网站满足「可安装应用」的要求（安卓 App / 添加到主屏幕）。
   不缓存任何东西：每次都直接走网络，网站一更新，用户打开就是新版，不会卡在旧版本。 */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
