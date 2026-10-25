// /api/wallet — the server-side diamond ledger (the device balance follows this one)
// GET → {gems, plus, recent[]}
// POST {op:'spend', amount, reason, key}   idempotent by key; 402 when the balance is too low
// POST {op:'daily'}                         +3💎 once per day
// POST {op:'purchase', sku, platform, receipt}  store purchases. Real Apple/Google receipt checks need the store keys
//      (APPLE_SHARED_SECRET / GOOGLE_SERVICE_ACCOUNT); until then only PAY_TEST=1 grants (test mode, clearly labelled).
const L = require('./_lib');
// v4.0: no membership. Packs $0.99 → 5 · $2.99 → 16 · $4.99 → 28 · $9.99 → 60 · $19.99 → 125 · $49.99 → 330 · $99.99 → 700 (bonus included in the id)
const SKUS = { gems_5: 5, gems_16: 16, gems_28: 28, gems_60: 60, gems_125: 125, gems_330: 330, gems_700: 700 };
const EARN_DAY_FALLBACK = 80; // 真正生效的是 config.earn_cap
async function apply(sql, uid, delta, reason, key) {
  if (key) { const dup = await sql('SELECT balance FROM ledger WHERE key=$1', [key]); if (dup[0]) return { gems: dup[0].balance, dup: true }; }
  await sql('INSERT INTO wallet (user_id, gems) VALUES ($1, 0) ON CONFLICT DO NOTHING', [uid]);
  const r = await sql('UPDATE wallet SET gems=gems+$2, updated_at=now() WHERE user_id=$1 AND gems+$2>=0 RETURNING gems', [uid, delta]);
  if (!r[0]) return null;
  await sql('INSERT INTO ledger (user_id, delta, reason, key, balance) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (key) DO NOTHING', [uid, delta, String(reason || '').slice(0, 40), key || null, r[0].gems]);
  return { gems: r[0].gems };
}
module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res, 'GET, POST, OPTIONS')) return;
  const u = await L.needActive(req, res); if (!u) return;
  const sql = await L.db(); const cfg = await L.config();
  if (req.method === 'GET') {
    await sql('INSERT INTO wallet (user_id, gems) VALUES ($1, 0) ON CONFLICT DO NOTHING', [u.uid]);
    const w = await sql('SELECT gems, plus_until FROM wallet WHERE user_id=$1', [u.uid]);
    const recent = await sql('SELECT delta, reason, balance, at FROM ledger WHERE user_id=$1 ORDER BY id DESC LIMIT 20', [u.uid]);
    return L.send(res, 200, { gems: w[0].gems, plus: false, recent });
  }
  const b = L.jsonBody(req);
  if (b.op === 'spend') {
    const n = Math.floor(Number(b.amount));
    if (!(n > 0 && n <= 500)) return L.bad(res, 'bad amount');
    const r = await apply(sql, u.uid, -n, b.reason || 'spend', b.key ? 'spend:' + u.uid + ':' + String(b.key).slice(0, 80) : null);
    if (!r) { const w = await sql('SELECT gems FROM wallet WHERE user_id=$1', [u.uid]); return L.send(res, 402, { error: 'not enough diamonds', gems: w[0] ? w[0].gems : 0 }); }
    return L.send(res, 200, r);
  }
  if (b.op === 'earn') {
    const n = Math.floor(Number(b.amount));
    if (!(n > 0 && n <= 50)) return L.bad(res, 'bad amount');
    const used = await sql(`INSERT INTO usage (user_id, day, kind, n) VALUES ($1, CURRENT_DATE, 'earn', $2) ON CONFLICT (user_id, day, kind) DO UPDATE SET n = usage.n + $2 RETURNING n`, [u.uid, n]);
    if (used[0].n > (Number(cfg.earn_cap) || EARN_DAY_FALLBACK)) { await sql(`UPDATE usage SET n = n - $2 WHERE user_id=$1 AND day=CURRENT_DATE AND kind='earn'`, [u.uid, n]); const w = await sql('SELECT gems FROM wallet WHERE user_id=$1', [u.uid]); return L.send(res, 429, { error: 'daily free-diamond limit reached', gems: w[0] ? w[0].gems : 0 }); }
    const r = await apply(sql, u.uid, n, 'earn:' + String(b.reason || '').slice(0, 30), b.key ? 'earn:' + u.uid + ':' + String(b.key).slice(0, 80) : null);
    return L.send(res, 200, r);
  }
  if (b.op === 'daily') {
    const day = new Date().toISOString().slice(0, 10);
    const r = await apply(sql, u.uid, Number(cfg.daily_gems) || 3, 'daily', 'daily:' + u.uid + ':' + day);
    return L.send(res, 200, r);
  }
  if (b.op === 'purchase') {
    const sku = String(b.sku || '');
    const SK = Object.assign({}, ...Object.entries(cfg.skus || {}).map(([k, v]) => ({ [k]: Number(v.gems) || SKUS[k] || 0 })));
    if (!(sku in SKUS) && !(sku in SK)) return L.bad(res, 'unknown sku');
    const test = process.env.PAY_TEST === '1';
    if (!test) return L.send(res, 501, { error: 'store receipt verification is not configured yet (set APPLE_SHARED_SECRET / GOOGLE_SERVICE_ACCOUNT, or PAY_TEST=1 for test purchases)' });
    const key = 'buy:' + u.uid + ':' + String(b.receipt || L.newId()).slice(0, 80);
    const first = await sql("SELECT 1 FROM ledger WHERE user_id=$1 AND reason LIKE 'gems_%' LIMIT 1", [u.uid]);
    const BASE = { gems_5: 5, gems_16: 15, gems_28: 25, gems_60: 50, gems_125: 100, gems_330: 250, gems_700: 500 }; // first top-up doubles the base diamonds (not the bonus)
    const gems = (SK[sku] || SKUS[sku]) + (!first[0] && cfg.first_purchase_double !== false ? (BASE[sku] || 0) : 0);
    const r = await apply(sql, u.uid, gems, sku + '(test)', key);
    if (r && !r.dup) await sql('INSERT INTO orders (id, user_id, sku, platform, gems, price_cents, currency, status, test, receipt) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT DO NOTHING', [L.newId('o_'), u.uid, sku, String(b.platform || 'web').slice(0, 12), gems, ((cfg.skus || {})[sku] || {}).usd || 0, 'USD', 'paid', true, String(b.receipt || '').slice(0, 200)]);
    return L.send(res, 200, Object.assign({ test: true }, r));
  }
  L.bad(res, 'unknown op');
});
