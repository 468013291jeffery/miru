// /api/state — cloud save of the app state (progress, choices, memories, settings) per account
// GET → {data, ver}   PUT {data, ver} → {ver}   (409 + newer copy when another device saved in between)
const L = require('./_lib');
const MAX = 900 * 1024;
module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res, 'GET, PUT, OPTIONS')) return;
  const u = await L.needActive(req, res); if (!u) return;
  const sql = await L.db();
  if (req.method === 'GET') {
    const r = await sql('SELECT data, ver, updated_at FROM states WHERE user_id=$1', [u.uid]);
    return L.send(res, 200, r[0] || { data: null, ver: 0 });
  }
  if (req.method !== 'PUT') return L.bad(res, 'GET or PUT', 405);
  const b = L.jsonBody(req);
  const raw = JSON.stringify(b.data || null);
  if (raw.length > MAX) return L.bad(res, 'state too large (' + Math.round(raw.length / 1024) + 'KB)', 413);
  const base = Number(b.ver) || 0, force = !!b.force;
  const cur = await sql('SELECT ver FROM states WHERE user_id=$1', [u.uid]);
  if (cur[0] && !force && cur[0].ver > base) {
    const r = await sql('SELECT data, ver FROM states WHERE user_id=$1', [u.uid]);
    return L.send(res, 409, { error: 'newer copy on server', data: r[0].data, ver: r[0].ver });
  }
  const r = await sql(`INSERT INTO states (user_id, data, ver, updated_at) VALUES ($1, $2::jsonb, 1, now())
    ON CONFLICT (user_id) DO UPDATE SET data=$2::jsonb, ver=states.ver+1, updated_at=now() RETURNING ver`, [u.uid, raw]);
  L.send(res, 200, { ver: r[0].ver });
});
