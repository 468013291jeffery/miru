/* MIRU service worker
   2026-11-05 最早只为满足「可安装应用」要求，不缓存任何东西。
   2026-11-27 加缓存，让第二次起打开基本不用等：
   · 页面本身（导航请求）：先走网络，3 秒拿不到就用上次缓存的页面 —— 网站更新后用户照样马上拿到新版，只有网络很慢/断网时才用旧页面兜底；
   · 主程序 app.<哈希>.js：文件名带内容哈希、内容永不变，存一次以后直接从手机里读（只留最近 3 个）；
   · 图片（icons/、art/ 等 png/jpg/webp/gif/svg）：先给缓存里的，后台再去网上更新一份（下次打开就是新图）；最多留 600 张，超了删最早的；
   · config.js / tune.js / manifest：先网络，失败用缓存；
   · /api/、音频、视频、带 Range 的请求、别的域名：完全不碰，照常走网络。
   不支持 service worker 的浏览器（极少数）注册会直接跳过，网站照常从网络加载，没有任何影响。 */
const V = "miru-v2";  /* 2026-11-28 tr_ui.json（提前翻好的界面文字）也走「先网络、失败用缓存」 */
const PAGE = V + "-page", APP = V + "-app", IMG = V + "-img", MISC = V + "-misc";
const KEEP = [PAGE, APP, IMG, MISC];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(IMG).then(c => c.addAll(["/icons/splash.webp", "/icons/icon-192.png"])).catch(() => {}));
});
self.addEventListener("activate", e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (!KEEP.includes(k)) await caches.delete(k);
  await self.clients.claim();
})()));

async function trim(name, max) {
  try {
    const c = await caches.open(name), ks = await c.keys();
    for (let i = 0; i < ks.length - max; i++) await c.delete(ks[i]);
  } catch (_) {}
}
function okToStore(r) { return r && r.ok && r.status === 200 && r.type === "basic"; }

async function networkFirst(req, name, ms) {
  const c = await caches.open(name);
  try {
    const net = fetch(req).then(r => { if (okToStore(r)) c.put(req, r.clone()); return r; });
    if (!ms) return await net;
    const hit = await c.match(req);
    if (!hit) return await net;
    return await Promise.race([net, new Promise(res => setTimeout(() => res(hit), ms))]);
  } catch (_) {
    const hit = await c.match(req);
    if (hit) return hit;
    throw _;
  }
}
async function cacheFirst(req, name, max) {
  const c = await caches.open(name);
  const hit = await c.match(req);
  if (hit) return hit;
  const r = await fetch(req);
  if (okToStore(r)) { await c.put(req, r.clone()); trim(name, max); }
  return r;
}
async function staleWhileRevalidate(e, req, name, max) {
  const c = await caches.open(name);
  const hit = await c.match(req);
  const net = fetch(req).then(r => { if (okToStore(r)) { c.put(req, r.clone()); trim(name, max); } return r; });
  if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
  return net;
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || req.headers.has("range")) return;
  const u = new URL(req.url);
  if (u.origin !== self.location.origin) return;
  const p = u.pathname;
  if (p.startsWith("/api/") || /\.(mp3|m4a|aac|ogg|wav|mp4|webm|mov)$/i.test(p)) return;
  if (req.mode === "navigate") {
    // 只缓存首页本身；带 ?v= 之类参数的也算同一个页面
    if (p === "/" || p === "/index.html") {
      const key = new Request("/", { credentials: "same-origin" });
      e.respondWith((async () => {
        const c = await caches.open(PAGE);
        try {
          const net = fetch(req).then(r => { if (okToStore(r)) c.put(key, r.clone()); return r; });
          const hit = await c.match(key);
          if (!hit) return await net;
          return await Promise.race([net, new Promise(res => setTimeout(() => res(hit), 3000))]);
        } catch (_) {
          const hit = await c.match(key);
          if (hit) return hit;
          throw _;
        }
      })());
    }
    return;
  }
  if (/^\/app\.[0-9a-f]{12}\.js$/.test(p)) { e.respondWith(cacheFirst(req, APP, 3)); return; }
  if (/\.(png|jpe?g|webp|gif|svg|avif)$/i.test(p)) { e.respondWith(staleWhileRevalidate(e, req, IMG, 600)); return; }
  if (p === "/config.js" || p === "/tune.js" || p === "/manifest.webmanifest" || p === "/tr_ui.json") { e.respondWith(networkFirst(req, MISC)); return; }
});
