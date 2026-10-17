// /api/events — product analytics (funnel: open → taste → hook → role → chapter → pay …)
// POST {events:[{name, props, at}]}   GET ?admin summary needs X-Admin-Key
const L = require('./_lib');
module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res, 'GET, POST, OPTIONS')) return;
  const sql = await L.db();
  if (req.method === 'GET') {
    if (!L.isAdmin(req)) return L.bad(res, 'admin only', 403);
    const days = Math.min(Number((req.query || {}).days) || 7, 90);
    const r = await sql(`SELECT name, count(*)::int AS n, count(DISTINCT user_id)::int AS users FROM events WHERE at > now() - ($1 || ' days')::interval GROUP BY name ORDER BY n DESC`, [String(days)]);
    return L.send(res, 200, { days, events: r });
  }
  const u = L.who(req), b = L.jsonBody(req);
  const evs = (Array.isArray(b.events) ? b.events : []).slice(0, 50);
  for (const e of evs) await sql('INSERT INTO events (user_id, name, props) VALUES ($1,$2,$3::jsonb)', [u ? u.uid : null, String(e.name || '').slice(0, 40), JSON.stringify(e.props || {}).slice(0, 2000)]);
  L.send(res, 200, { n: evs.length });
});
