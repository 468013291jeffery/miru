// /api/pkg — 剧本文件包里的素材上传（按「剧本槽位」存，不按素材库分类）
//
// 为什么单独一个口：/api/assets 是「素材库」，按 BGM / 音效 / 图片分类，还要按件扣钻石；
// 创作者提交作品包时，素材不是独立商品，而是剧本某个位置的附件。按件收费会把一部剧的
// 54 张背景变成 162 颗钻石，等于把「提交文件包」这条路堵死。所以：
//
//   PUT ?work=<草稿id>&slot=<槽位>&mime=<type>&name=<名字>   body = 原始文件（≤4MB）
//   GET ?work=<草稿id>                                       我上传过的包内素材
//   DELETE ?id=<assetId>
//
// 存储复用 assets 表：kind='pkg'，meta={slot, work}。文件本身在 Vercel Blob（public URL），
// 这样发布后的作品在任何设备上都能直接按槽位取到。
const L = require('./_lib');
const PKG = require('./_package');

const MAX = 4 * 1048576;                 // 平台函数体上限；视频大文件应走分片或外部链接
const WORK_RE = /^[A-Za-z0-9_\-:.]{1,80}$/;

/* 槽位 → 文件类别。规则跟剧本指令同名：BG/CG/封面是图，VIDEO 是视频，BGM 是音频，g_ 是互动游戏。 */
function slotClass(slot) {
  const s = String(slot || '');
  if (/^(BG|CG|COVER|POSTER|PHOTO|CHAR|FACE)[_:-]/i.test(s) || /^(cover|poster)$/i.test(s)) return 'image';
  if (/^(VID|VIDEO|OPENING|TRAILER|HOME_VIDEO)/i.test(s) || /^(opening_video|vid_open|home_video)$/i.test(s)) return 'video';
  if (/^(BGM|SFX)[_:-]/i.test(s) || /^(bgm|sfx)$/i.test(s)) return 'audio';
  if (/^g_/i.test(s) || /^(MG|GAME)[_:-]/i.test(s)) return 'game';
  return 'file';
}
function mimeOk(cls, mime) {
  const m = String(mime || '').toLowerCase();
  if (cls === 'image') return /^image\//.test(m);
  if (cls === 'video') return /^video\//.test(m);
  if (cls === 'audio') return /^audio\//.test(m);
  if (cls === 'game') return /^application\/json/.test(m) || /^text\//.test(m);
  return /^(image|video|audio|application\/json|text\/)/.test(m);
}
const out = r => ({ id: r.id, slot: (r.meta && r.meta.slot) || '', work: (r.meta && r.meta.work) || '', name: r.name, url: r.url, mime: r.mime, size: r.size, created_at: r.created_at });

module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res, 'GET, PUT, DELETE, OPTIONS')) return;
  const sql = await L.db();
  const q = req.query || {};
  const u = await L.needActive(req, res); if (!u) return;
  const cfg = await L.config();

  if (req.method === 'GET') {
    const work = String(q.work || '');
    if (!work) {
      const r = await sql('SELECT * FROM assets WHERE owner=$1 AND kind=$2 ORDER BY created_at DESC LIMIT 400', [u.uid, 'pkg']);
      return L.send(res, 200, { assets: r.map(out) });
    }
    if (!WORK_RE.test(work)) return L.bad(res, 'bad work id', 400);
    const r = await sql("SELECT * FROM assets WHERE owner=$1 AND kind=$2 AND meta->>'work'=$3 ORDER BY created_at DESC LIMIT 400", [u.uid, 'pkg', work]);
    return L.send(res, 200, { assets: r.map(out) });
  }

  if (req.method === 'DELETE') {
    const id = String(q.id || '');
    const r = await sql("DELETE FROM assets WHERE id=$1 AND owner=$2 AND kind='pkg' RETURNING url", [id, u.uid]);
    if (r[0] && r[0].url) await L.blobDel(r[0].url);
    return L.send(res, 200, { ok: !!r[0] });
  }

  if (req.method !== 'PUT') return L.bad(res, 'GET, PUT or DELETE', 405);
  if (!L.hasBlob()) return L.bad(res, 'file storage not configured', 503);

  const work = String(q.work || '');
  const slot = String(q.slot || '');
  if (!WORK_RE.test(work)) return L.bad(res, 'bad work id', 400);
  if (!PKG.KEY_RE.test(slot)) return L.bad(res, 'bad slot name', 400);
  const cls = slotClass(slot);
  const mime = String(q.mime || req.headers['content-type'] || '').split(';')[0].toLowerCase();
  if (!mimeOk(cls, mime)) return L.bad(res, 'wrong file type for slot ' + slot + ' (' + cls + ')', 400);
  if (!(await L.bump(u.uid, 'pkgup', Number(cfg.pkg_upload_daily_limit) || 600))) return L.bad(res, 'daily package upload limit reached', 429);

  const buf = await L.readBody(req);
  if (!buf.length) return L.bad(res, 'empty file', 400);
  if (buf.length > MAX) return L.bad(res, 'file too large (max 4MB)', 413);

  const id = L.newId('a_');
  const ext = (mime.split('/')[1] || 'bin').replace(/[^a-z0-9]/g, '').slice(0, 5) || 'bin';
  const url = await L.blobPut('pkg/' + u.uid + '/' + work + '/' + slot + '.' + ext, buf, mime);
  const name = String(q.name || slot).slice(0, 60);
  await sql('INSERT INTO assets (id, owner, kind, name, kw, url, mime, size, meta, status) VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7,$8,$9::jsonb,$10)',
    [id, u.uid, 'pkg', name, JSON.stringify([]), url, mime, buf.length, JSON.stringify({ slot, work, cls }), 'private']);
  return L.send(res, 200, { ok: true, asset: { id, slot, work, name, url, mime, size: buf.length, cls }, free: cfg.pkg_free !== false });
});
