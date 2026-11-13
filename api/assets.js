// /api/assets — creator uploads (BGM / SFX / FX / template games)
// PUT ?kind=bgm|sfx|fx&name=&kw=a,b&mode=fall|cover|video&key=   body = the raw file (≤4 MB, platform function limit)
//      charges diamonds on the server ledger (audio 5 · image 3 · video 10), stores the file in Vercel Blob, keeps it private to the owner
// POST {op:'game', name, kw, tpl, a, b}        template game (💎2)
// POST {op:'share', id}                         ask for review → 'review'; admins approve → 'public' (everyone's library)
// GET  ?mine=1 → my uploads    GET → public library additions
// DELETE ?id=
const L = require('./_lib');
const PRICE = { audio: 5, image: 3, video: 10, game: 2 };
const LIM = { audio: 4, image: 3, video: 4 };
async function charge(sql, uid, n, reason, key) {
  const r = await require('./_wallet').apply(sql, uid, -n, reason, key);
  return !!r && !r.code;
}
const out = r => ({ id: r.id, kind: r.kind, name: r.name, kw: r.kw || [], url: r.url, mime: r.mime, size: r.size, meta: r.meta || {}, status: r.status });
module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res)) return;
  const sql = await L.db(); const q = req.query || {};
  if (req.method === 'GET') {
    if (q.mine) { const u = await L.needActive(req, res); if (!u) return; const r = await sql('SELECT * FROM assets WHERE owner=$1 ORDER BY created_at DESC LIMIT 200', [u.uid]); return L.send(res, 200, { assets: r.map(out) }); }
    const r = await sql("SELECT * FROM assets WHERE status='public' ORDER BY created_at DESC LIMIT 300"); return L.send(res, 200, { assets: r.map(out) });
  }
  const u = await L.needActive(req, res); if (!u) return;
  const cfg = await L.config(); const PR = Object.assign({}, PRICE, cfg.upload_price || {});
  if (req.method === 'DELETE') {
    const id=String(q.id||''), row=(await sql('SELECT url FROM assets WHERE id=$1 AND owner=$2',[id,u.uid]))[0];
    try { if(row&&row.url)await L.blobDel(row.url,true); await sql('DELETE FROM assets WHERE id=$1 AND owner=$2',[id,u.uid]); return L.send(res,200,{ok:true}); }
    catch (_) { return L.send(res,503,{error:'Asset deletion could not finish; retry',action:'retry_asset_deletion',retryable:true}); }
  }
  if (req.method === 'PUT') {
    if (!L.hasBlob()) return L.bad(res, 'file storage not configured', 503);
    const kind = String(q.kind || ''); if (!['bgm', 'sfx', 'fx'].includes(kind)) return L.bad(res, 'bad kind');
    const mime = String(q.mime || req.headers['content-type'] || '').split(';')[0].toLowerCase();
    const cls = /^audio\//.test(mime) ? 'audio' : /^image\//.test(mime) ? 'image' : /^video\//.test(mime) ? 'video' : null;
    if (!cls || (kind === 'fx' ? cls === 'audio' : cls !== 'audio')) return L.bad(res, 'wrong file type');
    const buf = await L.readBody(req);
    if (!buf.length) return L.bad(res, 'empty file');
    if (buf.length > LIM[cls] * 1048576) return L.bad(res, 'file too large (max ' + LIM[cls] + 'MB)', 413);
    if (!(await L.bump(u.uid, 'upload', Number(cfg.upload_daily_limit) || 40))) return L.bad(res, 'daily upload limit reached', 429);
    const id = L.newId('a_');
    if (!(await charge(sql, u.uid, PR[cls], 'upload:' + cls, 'upload:' + u.uid + ':' + String(q.key || id).slice(0, 60)))) return L.send(res, 402, { error: 'not enough diamonds', price: PR[cls] });
    const url = await L.blobPut('assets/' + u.uid + '/' + id + '.' + (mime.split('/')[1] || 'bin').replace(/[^a-z0-9]/g, '').slice(0, 5), buf, mime);
    const name = String(q.name || '').slice(0, 24) || kind, kw = String(q.kw || '').split(',').map(s => s.trim()).filter(Boolean).slice(0, 8);
    await sql('INSERT INTO assets (id, owner, kind, name, kw, url, mime, size, meta, status) VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7,$8,$9::jsonb,$10)', [id, u.uid, kind, name, JSON.stringify(kw), url, mime, buf.length, JSON.stringify({ mode: String(q.mode || '').slice(0, 8) }), 'private']);
    return L.send(res, 200, { asset: { id, kind, name, kw, url, mime, size: buf.length, status: 'private' }, price: PR[cls] });
  }
  const b = L.jsonBody(req);
  if (b.op === 'game') {
    const id = L.newId('a_');
    if (!(await charge(sql, u.uid, PR.game, 'upload:game', 'game:' + u.uid + ':' + String(b.key || id).slice(0, 60)))) return L.send(res, 402, { error: 'not enough diamonds', price: PR.game });
    const meta = { tpl: String(b.tpl || 'find').slice(0, 10), a: String(b.a || '').slice(0, 200), b: String(b.b || '-').slice(0, 200) };
    const sf = L.safety([b.name, meta.a, meta.b]); if (sf.length) return L.send(res, 422, { error: 'blocked by safety review', reasons: sf });
    await sql('INSERT INTO assets (id, owner, kind, name, kw, meta, status) VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7)', [id, u.uid, 'mg', String(b.name || '').slice(0, 24), JSON.stringify((b.kw || []).slice(0, 8)), JSON.stringify(meta), 'private']);
    return L.send(res, 200, { asset: { id, kind: 'mg', name: b.name, kw: b.kw || [], meta, status: 'private' }, price: PR.game });
  }
  if (b.op === 'share') { const r = await sql("UPDATE assets SET status='review' WHERE id=$1 AND owner=$2 AND status IN ('private','rejected') RETURNING id", [String(b.id || ''), u.uid]); return L.send(res, 200, { ok: !!r[0], status: r[0] ? 'review' : undefined }); }
  L.bad(res, 'unknown op');
});
