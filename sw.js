/* MIRU service worker
   2026-11-05 最早只为满足「可安装应用」要求，不缓存任何东西。
   2026-11-27 加缓存，让第二次起打开基本不用等：
   · 页面本身（导航请求）：先走网络，3 秒拿不到就用上次缓存的页面 —— 网站更新后用户照样马上拿到新版，只有网络很慢/断网时才用旧页面兜底；
   · 主程序 app.<哈希>.js：文件名带内容哈希、内容永不变，存一次以后直接从手机里读（只留最近 3 个）；
   · 图片（icons/、art/ 等 png/jpg/webp/gif/svg）：先给缓存里的，后台再去网上更新一份（下次打开就是新图）；最多留 600 张，超了删最早的；
   · config.js / tune.js / manifest：先网络，失败用缓存；
   · /api/、音频、视频、带 Range 的请求、别的域名：完全不碰，照常走网络。
   不支持 service worker 的浏览器（极少数）注册会直接跳过，网站照常从网络加载，没有任何影响。 */
/* 2026-11-28 修：手机存储满了（或浏览器给的额度用完）时，把主程序存进缓存会失败，以前这个失败会连带让主程序本身加载失败 ——
   用户就一直卡在开屏页进不去。现在：存缓存失败绝不影响正常加载（存不进去就直接用网络拿到的那份），并顺手清掉图片缓存腾地方；
   任何缓存环节出错都退回普通网络请求。版本号升到 v3，旧缓存在新版本生效时会清掉。 */
const V = "miru-v3";  /* 2026-11-28 tr_ui.json（提前翻好的界面文字）也走「先网络、失败用缓存」 */
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
    const net = fetch(req).then(r => { if (okToStore(r)) c.put(req, r.clone()).catch(() => {}); return r; });
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
  let c = null, hit = null;
  try { c = await caches.open(name); hit = await c.match(req); } catch (_) {}
  if (hit) return hit;
  const r = await fetch(req);
  if (c && okToStore(r)) {
    const copy = r.clone();
    (async () => {
      try { await trim(name, max - 1); await c.put(req, copy); }
      catch (_) { try { await caches.delete(IMG); } catch (__) {} }
    })();
  }
  return r;
}
const safe = (p, req) => Promise.resolve(p).catch(() => fetch(req));
async function staleWhileRevalidate(e, req, name, max) {
  const c = await caches.open(name);
  const hit = await c.match(req);
  const net = fetch(req).then(r => { if (okToStore(r)) { c.put(req, r.clone()).then(() => trim(name, max)).catch(() => {}); } return r; });
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
          const net = fetch(req).then(r => { if (okToStore(r)) c.put(key, r.clone()).catch(() => {}); return r; });
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
  if (/^\/app\.[0-9a-f]{12}\.js$/.test(p)) { e.respondWith(safe(cacheFirst(req, APP, 3), req)); return; }
  if (/\.(png|jpe?g|webp|gif|svg|avif)$/i.test(p)) { e.respondWith(safe(staleWhileRevalidate(e, req, IMG, 300), req)); return; }
  if (p === "/config.js" || p === "/tune.js" || p === "/manifest.webmanifest" || p === "/tr_ui.json") { e.respondWith(safe(networkFirst(req, MISC), req)); return; }
});
