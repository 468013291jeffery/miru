/* ================= 媒体库（2026-10-25）=================
   问题：图片以前是 base64 字符串存在**存档对象 S 里**（S.art 每角色一张、S.album 最多 12 张）。
   而 save() 是 `localStorage.setItem(KEY, JSON.stringify(S))`，全仓 384 个调用点 ——
   每次保存都要把 3~4 MB 的 base64 重新拼一遍，同步写盘；线上已经撞过 5 MB 配额，
   兜底是把玩家相册砍掉（app1_core.js:19）。

   现在：媒体（图、以后的视频/音频）存 IndexedDB 的 **Blob**，S 里只留一个引用 `{__m:id}`。
     · Blob 比 base64 省 33%（base64 是 4/3 膨胀）
     · 视频/音频根本不可能塞进 localStorage —— 这条路现在一次铺好
     · save() 只剩 KB 级

   三条保命性质（改玩家数据，必须有）：
     ① **迁移不先删**：先把 Blob 写进去、**读回来核对字节数**，一致才把 S 里那格换成引用；
     ② 中途崩了不会更糟：已换成引用的读得到，没换的还是老样子，下次启动继续迁（幂等）；
     ③ 库打不开（隐私模式/旧浏览器）就**什么都不迁**，一切按老路径走，页面照常。
*/

const MEDIA = { db: null, blobs: new Map(), urls: new Map(), ready: null, stats: { migrated: 0, failed: 0, bytes: 0 } };
const MEDIA_BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

function mediaOpen() {
  return new Promise((res) => {
    try {
      if (typeof indexedDB === "undefined") return res(null);
      const rq = indexedDB.open("miru-media", 1);
      rq.onupgradeneeded = () => { try { rq.result.createObjectStore("b") } catch (_) {} };
      rq.onsuccess = () => { MEDIA.db = rq.result; res(MEDIA.db) };
      rq.onerror = () => res(null);
      rq.onblocked = () => res(null);
    } catch (_) { res(null) }
  });
}

/** "data:image/jpeg;base64,xxxx" → Blob（内存里只存在一瞬） */
function mediaDataToBlob(u) {
  try {
    const s = String(u || "");
    const i = s.indexOf(",");
    if (i < 0) return null;
    const head = s.slice(0, i), body = s.slice(i + 1);
    const mime = (head.match(/data:([^;]+)/) || [])[1] || "application/octet-stream";
    if (!/;base64/i.test(head)) return new Blob([decodeURIComponent(body)], { type: mime });
    const bin = atob(body);
    const arr = new Uint8Array(bin.length);
    for (let k = 0; k < bin.length; k++) arr[k] = bin.charCodeAt(k);
    return new Blob([arr], { type: mime });
  } catch (_) { return null }
}

function mediaTx(mode) {
  try { return MEDIA.db.transaction("b", mode).objectStore("b") } catch (_) { return null }
}

/** 存一段媒体。成功返回 true（**已经读回核对过**）。 */
async function mediaPut(id, data) {
  if (!MEDIA.db) return false;
  try {
    const blob = (data instanceof Blob) ? data : mediaDataToBlob(data);
    if (!blob || !blob.size) return false;
    const store = mediaTx("readwrite");
    if (!store) return false;
    await new Promise((res, rej) => {
      const rq = store.put(blob, id);
      rq.onsuccess = () => res();
      rq.onerror = () => rej(rq.error || new Error("put failed"));
    });
    const back = await mediaGet(id);                      // ① 读回来核对
    if (!back || back.size !== blob.size) return false;    //    不一致 ⇒ 当作没存成功
    MEDIA.blobs.set(id, back);
    MEDIA.stats.bytes += blob.size;
    if (!MEDIA.urls.get(id)) { try { MEDIA.urls.set(id, URL.createObjectURL(back)) } catch (_) {} }
    return true;
  } catch (_) { return false }
}

async function mediaGet(id) {
  if (MEDIA.blobs.has(id)) return MEDIA.blobs.get(id);
  if (!MEDIA.db) return null;
  try {
    const store = mediaTx("readonly");
    if (!store) return null;
    return await new Promise((res) => {
      const rq = store.get(id);
      rq.onsuccess = () => res(rq.result || null);
      rq.onerror = () => res(null);
    });
  } catch (_) { return null }
}

/** 同步拿 URL：拿不到返回 null（调用方去用异步版，回来再重画）。 */
function mediaUrl(id) { return MEDIA.urls.get(id) || null }

/** 后台取一次，取到就通知重画。 */
function mediaUrlAsync(id, onReady) {
  if (MEDIA.urls.get(id)) { try { onReady && onReady() } catch (_) {} return }
  mediaGet(id).then((blob) => {
    if (!blob) return;
    MEDIA.blobs.set(id, blob);
    try { MEDIA.urls.set(id, URL.createObjectURL(blob)) } catch (_) {}
    try { onReady && onReady() } catch (_) {}
  });
}

function mediaRef(id) { return { __m: id } }
function mediaIsRef(v) { return !!(v && typeof v === "object" && typeof v.__m === "string") }

/** 把 S 里所有 base64 媒体搬到 IndexedDB。幂等；失败一律保留原值。 */
async function mediaMigrate() {
  if (!MEDIA.db) return MEDIA.stats;
  const jobs = [];
  try {
    S.art = S.art || {};
    for (const id of Object.keys(S.art)) {
      const v = S.art[id];
      if (typeof v !== "string" || v.slice(0, 5) !== "data:") continue;
      jobs.push((async () => {
        const key = "art:" + id;
        if (await mediaPut(key, v)) { S.art[id] = mediaRef(key); MEDIA.stats.migrated++ }
        else MEDIA.stats.failed++;
      })());
    }
    (S.album || []).forEach((a) => {
      if (!a || !a.id) return;
      const v = a.src;
      if (typeof v !== "string" || v.slice(0, 5) !== "data:") return;
      jobs.push((async () => {
        const key = "album:" + a.id;
        if (await mediaPut(key, v)) { a.src = mediaRef(key); MEDIA.stats.migrated++ }
        else MEDIA.stats.failed++;
      })());
    });
    await Promise.all(jobs);
    if (MEDIA.stats.migrated) { try { save() } catch (_) {} }
  } catch (_) {}
  return MEDIA.stats;
}

/** 启动时跑一遍：开库 → 迁移 → 预热相册缩略图。失败不影响启动。 */
function mediaBoot() {
  if (!MEDIA.ready) {
    MEDIA.ready = (async () => {
      await mediaOpen();
      try { await mediaMigrate() } catch (_) {}
      return MEDIA;
    })();
  }
  return MEDIA.ready;
}

/** 相册一格的图片地址（同步）。引用型就返回缓存 URL 或占位，并后台补齐。 */
function albumSrc(a) {
  if (!a) return MEDIA_BLANK;
  const v = a.src;
  if (mediaIsRef(v)) {
    const u = mediaUrl(v.__m);
    if (u) return u;
    mediaUrlAsync(v.__m, () => {
      try {
        const uu = mediaUrl(v.__m); if (!uu) return;
        document.querySelectorAll('img[data-amid="' + a.id + '"]').forEach(im => { if (im.src !== uu) im.src = uu });
      } catch (_) {}
    });
    return MEDIA_BLANK;
  }
  return (typeof v === "string" && v) ? v : MEDIA_BLANK;
}

/** 写一格媒体：data: 就去 IndexedDB 并返回引用；其它（路径/已有引用）原样返回。 */
function mediaWrap(key, data) {
  if (typeof data === "string" && data.slice(0, 5) === "data:") {
    try { mediaPut(key, data) } catch (_) {}
    return mediaRef(key);
  }
  return data;
}
