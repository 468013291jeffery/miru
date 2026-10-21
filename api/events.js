// /api/events — product analytics + the exportable ledger.
//
// POST {events:[{name, props, at}]}                    batch up to 50
// GET  ?days=7                                          counts by event name (admin)
// GET  ?summary=1&days=&work=                           funnel / choice mix / chapter duration (admin)
// GET  ?export=csv&days=&work=&limit=                   the raw ledger as CSV (admin)
//
// The two GET views are built by api/_ledger.js, which is pure (no db, no clock) so the
// numbers can be checked offline: node tools/ledger-selftest.mjs
const L = require('./_lib');
const LED = require('./_ledger');

// props is stored as jsonb: never truncate the JSON *string* (that produces invalid json and
// fails the whole batch). Shrink the payload instead, and say so in the row.
function propsFor(p) {
  let s = JSON.stringify(p || {});
  if (s.length <= 2000) return s;
  const keep = {};
  for (const k of ['wid', 'ch', 'sess', 'key', 'ending', 'ms', 't', 'sku']) if (p && p[k] != null) keep[k] = p[k];
  keep._trunc = 1;
  s = JSON.stringify(keep);
  return s.length <= 2000 ? s : JSON.stringify({ _trunc: 1, wid: (p && p.wid) || null });
}

module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res, 'GET, POST, OPTIONS')) return;
  const sql = await L.db();
  const q = req.query || {};

  if (req.method === 'GET') {
    if (!L.isAdmin(req)) return L.bad(res, 'admin only', 403);
    const days = Math.min(Number(q.days) || 7, 90);
    const wid = q.work ? String(q.work) : null;

    if (q.export === 'csv' || q.summary) {
      const lim = Math.min(Number(q.limit) || (q.export === 'csv' ? 200000 : 50000), 500000);
      const args = [String(days)];
      let where = "at > now() - ($1 || ' days')::interval";
      if (wid) { args.push(wid); where += ` AND props->>'wid' = $${args.length}`; }
      args.push(lim);
      const rows = await sql(`SELECT user_id, name, props, at FROM events WHERE ${where} ORDER BY at LIMIT $${args.length}`, args);
      if (q.export === 'csv') {
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="miru-ledger-${days}d${wid ? '-' + wid : ''}.csv"`);
        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).send(LED.csv(rows));
      }
      return L.send(res, 200, Object.assign({ days, work: wid, rows: rows.length }, LED.summary(rows)));
    }

    const r = await sql(`SELECT name, count(*)::int AS n, count(DISTINCT user_id)::int AS users FROM events WHERE at > now() - ($1 || ' days')::interval GROUP BY name ORDER BY n DESC`, [String(days)]);
    return L.send(res, 200, { days, events: r });
  }

  const u = L.who(req), b = L.jsonBody(req);
  const evs = (Array.isArray(b.events) ? b.events : []).slice(0, 50);
  for (const e of evs) await sql('INSERT INTO events (user_id, name, props) VALUES ($1,$2,$3::jsonb)',
    [u ? u.uid : null, String(e.name || '').slice(0, 40), propsFor(e.props)]);
  L.send(res, 200, { n: evs.length });
});
