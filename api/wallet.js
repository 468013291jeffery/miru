// /api/wallet — the server-side diamond ledger (the device balance follows this one)
// GET → {gems, plus, recent[]}
// POST {op:'spend', amount, reason, key}   idempotent by key; 402 when the balance is too low
// POST {op:'daily'}                         +3💎 once per day
// POST {op:'purchase', sku, platform, receipt}  store purchases. Real Apple/Google receipt checks need the store keys
//      (APPLE_SHARED_SECRET / GOOGLE_SERVICE_ACCOUNT); until then only PAY_TEST=1 grants (test mode, clearly labelled).
const L = require('./_lib');
// v4.0: no membership. Packs $0.99 → 5 · $2.99 → 16 · $4.99 → 28 · $9.99 → 60 · $19.99 → 125 · $49.99 → 330 · $99.99 → 700 (bonus included in the id)
const SKUS = { gems_5: 5, gems_16: 16, gems_28: 28, gems_60: 60, gems_125: 125, gems_330: 330, gems_700: 700 };
const EARN_DAY = 80; // free diamonds a device can claim per day (check-ins, tasks, rewarded ads)
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
    const A = Object.assign({}, L.CONFIG_DEFAULTS.ads, cfg.ads || {}); const ad = await sql("SELECT n FROM usage WHERE user_id=$1 AND day=CURRENT_DATE AND kind='ad'", [u.uid]);
    return L.send(res, 200, { gems: w[0].gems, plus: false, recent, ads: { provider: A.provider, gam_unit: A.gam_unit, adsense_client: A.adsense_client, h5_test: !!A.h5_test, reward_gems: Number(A.reward_gems) || 1, daily_cap: Number(A.daily_cap) || 5, ep_ads: Number(A.ep_ads) || 2, used: ad[0] ? ad[0].n : 0 } });
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
    if (used[0].n > (Number(cfg.earn_cap) || EARN_DAY)) { await sql(`UPDATE usage SET n = n - $2 WHERE user_id=$1 AND day=CURRENT_DATE AND kind='earn'`, [u.uid, n]); const w = await sql('SELECT gems FROM wallet WHERE user_id=$1', [u.uid]); return L.send(res, 429, { error: 'daily free-diamond limit reached', gems: w[0] ? w[0].gems : 0 }); }
    const r = await apply(sql, u.uid, n, 'earn:' + String(b.reason || '').slice(0, 30), b.key ? 'earn:' + u.uid + ':' + String(b.key).slice(0, 80) : null);
    return L.send(res, 200, r);
  }
  /* v8.2 · rewarded ad completed: server-side daily cap, minimum gap, idempotent by nonce; only 'gem' pays diamonds here
     (episode / vote rewards are applied on the device after this call succeeds, so they share the same cap) */
  if (b.op === 'ad') {
    const A = Object.assign({}, L.CONFIG_DEFAULTS.ads, cfg.ads || {}); if (A.provider === 'off') return L.bad(res, 'ads are off', 403);
    const kind = ['gem', 'ep', 'vote'].includes(b.kind) ? b.kind : 'gem', nonce = String(b.nonce || '').slice(0, 60); if (!nonce) return L.bad(res, 'nonce required');
    const dup = await sql('SELECT balance FROM ledger WHERE key=$1', ['ad:' + u.uid + ':' + nonce]); if (dup[0]) return L.send(res, 200, { ok: true, dup: true, gems: dup[0].balance });
    const gap = Number(A.min_gap_sec) || 20; const last = await sql("SELECT extract(epoch from (now() - at))::int AS s FROM ledger WHERE user_id=$1 AND reason LIKE 'ad:%' ORDER BY id DESC LIMIT 1", [u.uid]);
    if (last[0] && last[0].s < gap) return L.send(res, 429, { error: 'too fast', wait: gap - last[0].s });
    const cap = Number(A.daily_cap) || 5;
    const used = await sql(`INSERT INTO usage (user_id, day, kind, n) VALUES ($1, CURRENT_DATE, 'ad', 1) ON CONFLICT (user_id, day, kind) DO UPDATE SET n = usage.n + 1 RETURNING n`, [u.uid]);
    if (used[0].n > cap) { await sql(`UPDATE usage SET n = n - 1 WHERE user_id=$1 AND day=CURRENT_DATE AND kind='ad'`, [u.uid]); return L.send(res, 429, { error: 'daily ad limit reached', used: cap, cap }); }
    const amt = kind === 'gem' ? (Number(A.reward_gems) || 1) : 0;
    let r;
    if (amt > 0) r = await apply(sql, u.uid, amt, 'ad:' + kind + ':' + String(A.provider).slice(0, 8), 'ad:' + u.uid + ':' + nonce);
    else { await sql('INSERT INTO wallet (user_id, gems) VALUES ($1, 0) ON CONFLICT DO NOTHING', [u.uid]); const g = await sql('SELECT gems FROM wallet WHERE user_id=$1', [u.uid]); await sql('INSERT INTO ledger (user_id, delta, reason, key, balance) VALUES ($1,0,$2,$3,$4) ON CONFLICT (key) DO NOTHING', [u.uid, 'ad:' + kind + ':' + String(A.provider).slice(0, 8), 'ad:' + u.uid + ':' + nonce, g[0].gems]); r = { gems: g[0].gems }; }
    return L.send(res, 200, Object.assign({ ok: true, used: used[0].n, cap, reward: amt }, r || {}));
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
