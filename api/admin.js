// /api/admin — review queue for the operations team (header X-Admin-Key = env ADMIN_KEY)
// GET → pending works, assets waiting for review, latest reports, user / content counts
// POST {op:'work', id, status:'live'|'rejected'|'pending'}   POST {op:'asset', id, status:'public'|'private'|'rejected'}
// POST {op:'grant', user, amount, reason}   (customer support: add/remove diamonds)
const L = require('./_lib');
module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res, 'GET, POST, OPTIONS')) return;
  if (!L.isAdmin(req)) return L.bad(res, 'admin only', 403);
  const sql = await L.db();
  if (req.method === 'GET') {
    const works = await sql("SELECT id, author_name, title, hook, status, qa, reports, created_at FROM works WHERE status IN ('pending') OR reports>0 ORDER BY created_at DESC LIMIT 100");
    const assets = await sql("SELECT id, owner, kind, name, kw, url, mime, size, meta, status, created_at FROM assets WHERE status='review' ORDER BY created_at DESC LIMIT 100");
    const reports = await sql('SELECT * FROM reports ORDER BY id DESC LIMIT 50');
    const counts = await sql("SELECT (SELECT count(*) FROM users)::int AS users, (SELECT count(*) FROM users WHERE email IS NOT NULL)::int AS registered, (SELECT count(*) FROM works WHERE status='live')::int AS live_works, (SELECT count(*) FROM assets)::int AS assets, (SELECT coalesce(sum(-delta),0) FROM ledger WHERE delta<0)::int AS gems_spent");
    return L.send(res, 200, { counts: counts[0], works, assets, reports });
  }
  const b = L.jsonBody(req);
  if (b.op === 'work') { await sql('UPDATE works SET status=$2, updated_at=now() WHERE id=$1', [String(b.id), String(b.status)]); return L.send(res, 200, { ok: true }); }
  if (b.op === 'asset') { await sql('UPDATE assets SET status=$2 WHERE id=$1', [String(b.id), String(b.status)]); return L.send(res, 200, { ok: true }); }
  if (b.op === 'grant') {
    const n = Math.floor(Number(b.amount)); if (!n) return L.bad(res, 'amount');
    await sql('INSERT INTO wallet (user_id, gems) VALUES ($1, 0) ON CONFLICT DO NOTHING', [String(b.user)]);
    const r = await sql('UPDATE wallet SET gems=GREATEST(0,gems+$2) WHERE user_id=$1 RETURNING gems', [String(b.user), n]);
    await sql('INSERT INTO ledger (user_id, delta, reason, key, balance) VALUES ($1,$2,$3,$4,$5)', [String(b.user), n, 'admin:' + String(b.reason || '').slice(0, 30), 'admin:' + L.newId(), r[0] ? r[0].gems : 0]);
    return L.send(res, 200, { gems: r[0] ? r[0].gems : 0 });
  }
  L.bad(res, 'unknown op');
});
