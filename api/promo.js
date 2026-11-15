// /api/promo — 推广分佣 + 单剧收入统计（2026-11-16）
// 规则（产品定）：被推广用户自绑定起 30 天内的每笔正式充值，推广人得充值金额的 10%，以钻石发放（$1 = 5 钻），平台出钱，原作者不额外分。
// 比例 / 天数 / 开关存在 promo_cfg 表里，后台「推广与单剧收入」页可以改。
//   GET  ?r=me                       推广人自己的数据（需登录）
//   POST {op:'click', code, wid}     有人点开了推广链接（不需登录）
//   POST {op:'bind',  code, wid}     新用户登录后绑定推广人（需登录；只认新号、只绑一次、不能绑自己）
//   POST {op:'use',   items:[{wid,n,why}]}   某部剧里花了多少钻（统计用，需登录）
//   POST {op:'paywall', wid, why}    在某部剧里打开了充值页（之后 60 分钟内的充值算这部剧的）
// 后台（/api/admin?r=promo）调用 module.exports.adminOverview / saveCfg。
const L = require('./_lib');
const W = require('./_wallet');

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS promo_codes (user_id TEXT PRIMARY KEY, code TEXT UNIQUE NOT NULL, at TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS promo_clicks (id BIGSERIAL PRIMARY KEY, code TEXT, promoter TEXT, wid TEXT, ip TEXT, at TIMESTAMPTZ DEFAULT now())`,
  `CREATE INDEX IF NOT EXISTS promo_clicks_p ON promo_clicks (promoter, at)`,
  `CREATE TABLE IF NOT EXISTS promo_binds (user_id TEXT PRIMARY KEY, promoter TEXT NOT NULL, wid TEXT, bound_at TIMESTAMPTZ DEFAULT now(), days INT NOT NULL DEFAULT 30)`,
  `CREATE INDEX IF NOT EXISTS promo_binds_p ON promo_binds (promoter)`,
  `CREATE TABLE IF NOT EXISTS promo_comm (order_id TEXT PRIMARY KEY, promoter TEXT NOT NULL, user_id TEXT, wid TEXT, price_cents INT, rate REAL, comm_cents REAL, at TIMESTAMPTZ DEFAULT now())`,
  `CREATE INDEX IF NOT EXISTS promo_comm_p ON promo_comm (promoter)`,
  `CREATE TABLE IF NOT EXISTS promo_awards (promoter TEXT PRIMARY KEY, gems INT NOT NULL DEFAULT 0, updated_at TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS promo_use (id BIGSERIAL PRIMARY KEY, user_id TEXT, wid TEXT, n INT, why TEXT, at TIMESTAMPTZ DEFAULT now())`,
  `CREATE INDEX IF NOT EXISTS promo_use_w ON promo_use (wid, at)`,
  `CREATE TABLE IF NOT EXISTS promo_paywall (id BIGSERIAL PRIMARY KEY, user_id TEXT, wid TEXT, why TEXT, at TIMESTAMPTZ DEFAULT now())`,
  `CREATE INDEX IF NOT EXISTS promo_paywall_u ON promo_paywall (user_id, at)`,
  `CREATE TABLE IF NOT EXISTS promo_cfg (id INT PRIMARY KEY DEFAULT 1, rate REAL NOT NULL DEFAULT 0.10, days INT NOT NULL DEFAULT 30, gems_per_usd INT NOT NULL DEFAULT 5, new_days INT NOT NULL DEFAULT 7, on_ BOOLEAN NOT NULL DEFAULT true, updated_by TEXT, updated_at TIMESTAMPTZ DEFAULT now())`,
  `INSERT INTO promo_cfg (id) VALUES (1) ON CONFLICT DO NOTHING`,
];
let ready = null;
async function init(sql) { if (!ready) ready = (async () => { for (const s of SCHEMA) await sql(s); })().catch(e => { ready = null; throw e; }); return ready; }
async function cfg(sql) { await init(sql); const r = await sql('SELECT rate, days, gems_per_usd, new_days, on_ FROM promo_cfg WHERE id=1'); const c = r[0] || {}; return { rate: Number(c.rate) || 0.1, days: Number(c.days) || 30, gemsPerUsd: Number(c.gems_per_usd) || 5, newDays: Number(c.new_days) || 7, on: c.on_ !== false }; }
const okWid = w => /^[A-Za-z0-9_:.-]{1,80}$/.test(String(w || '')) ? String(w) : null;

async function codeOf(sql, uid) {
  await init(sql);
  const r = await sql('SELECT code FROM promo_codes WHERE user_id=$1', [uid]); if (r[0]) return r[0].code;
  for (let i = 0; i < 6; i++) {
    const code = 'm' + L.crypto.randomBytes(5).toString('base64').replace(/[^A-Za-z0-9]/g, '').slice(0, 6).toLowerCase();
    try { await sql('INSERT INTO promo_codes (user_id, code) VALUES ($1,$2)', [uid, code]); return code; } catch (_) {}
  }
  throw new Error('code');
}
async function ownerOf(sql, code) { await init(sql); const r = await sql('SELECT user_id FROM promo_codes WHERE code=$1', [String(code || '').slice(0, 20)]); return r[0] ? r[0].user_id : null; }

/* 结算：把新的正式充值记成佣金，再把累计佣金折成钻石补发（零头留着，下次凑够再发） */
async function settle(sql, promoter) {
  const c = await cfg(sql);
  const args = [c.rate]; let w = '';
  if (promoter) { args.push(promoter); w = ' AND b.promoter=$2'; }
  await sql(`INSERT INTO promo_comm (order_id, promoter, user_id, wid, price_cents, rate, comm_cents, at)
    SELECT o.id, b.promoter, o.user_id, b.wid, o.price_cents, $1, o.price_cents * $1, o.at
    FROM orders o JOIN promo_binds b ON b.user_id = o.user_id
    WHERE o.status = 'paid' AND NOT COALESCE(o.test, false) AND o.at >= b.bound_at AND o.at < b.bound_at + (b.days || ' days')::interval${w}
    ON CONFLICT (order_id) DO NOTHING`, args);
  const rows = await sql(`SELECT p.promoter, p.cents, COALESCE(a.gems, 0) AS gems FROM (SELECT promoter, sum(comm_cents) AS cents FROM promo_comm ${promoter ? 'WHERE promoter=$1' : ''} GROUP BY promoter) p LEFT JOIN promo_awards a ON a.promoter = p.promoter`, promoter ? [promoter] : []);
  for (const r of rows) {
    const due = Math.floor(Number(r.cents) * c.gemsPerUsd / 100);
    const add = due - Number(r.gems);
    if (add <= 0) continue;
    const res = await W.apply(sql, r.promoter, add, 'promo', 'promo:' + r.promoter + ':' + due);
    if (res && !res.code) await sql('INSERT INTO promo_awards (promoter, gems, updated_at) VALUES ($1,$2,now()) ON CONFLICT (promoter) DO UPDATE SET gems=$2, updated_at=now()', [r.promoter, due]);
  }
}

async function stats(sql, promoter) {
  const c = await cfg(sql);
  const [clicks, binds, comm, award, byWork, recent] = await Promise.all([
    sql('SELECT count(*)::int AS n FROM promo_clicks WHERE promoter=$1', [promoter]),
    sql('SELECT count(*)::int AS n, count(*) FILTER (WHERE bound_at + (days || \' days\')::interval > now())::int AS active FROM promo_binds WHERE promoter=$1', [promoter]),
    sql('SELECT count(DISTINCT user_id)::int AS payers, count(*)::int AS orders, COALESCE(sum(price_cents),0)::int AS cents, COALESCE(sum(comm_cents),0)::float AS comm FROM promo_comm WHERE promoter=$1', [promoter]),
    sql('SELECT gems FROM promo_awards WHERE promoter=$1', [promoter]),
    sql(`SELECT w.wid, COALESCE(k.clicks,0)::int AS clicks, COALESCE(b.users,0)::int AS users, COALESCE(m.cents,0)::int AS cents, COALESCE(m.comm,0)::float AS comm, t.title
      FROM (SELECT wid FROM promo_clicks WHERE promoter=$1 UNION SELECT wid FROM promo_binds WHERE promoter=$1 UNION SELECT wid FROM promo_comm WHERE promoter=$1) w
      LEFT JOIN (SELECT wid, count(*) AS clicks FROM promo_clicks WHERE promoter=$1 GROUP BY wid) k ON k.wid IS NOT DISTINCT FROM w.wid
      LEFT JOIN (SELECT wid, count(*) AS users FROM promo_binds WHERE promoter=$1 GROUP BY wid) b ON b.wid IS NOT DISTINCT FROM w.wid
      LEFT JOIN (SELECT wid, sum(price_cents) AS cents, sum(comm_cents) AS comm FROM promo_comm WHERE promoter=$1 GROUP BY wid) m ON m.wid IS NOT DISTINCT FROM w.wid
      LEFT JOIN works t ON t.id = w.wid ORDER BY clicks DESC NULLS LAST LIMIT 50`, [promoter]),
    sql('SELECT wid, price_cents, comm_cents, at FROM promo_comm WHERE promoter=$1 ORDER BY at DESC LIMIT 20', [promoter]),
  ]);
  return { rate: c.rate, days: c.days, gemsPerUsd: c.gemsPerUsd, on: c.on, clicks: clicks[0].n, users: binds[0].n, activeUsers: binds[0].active, payers: comm[0].payers, orders: comm[0].orders, salesCents: comm[0].cents, commCents: Math.round(comm[0].comm * 100) / 100, gems: award[0] ? award[0].gems : 0, byWork, recent };
}

/* ---------- 后台：推广人排行 + 单剧收入 ---------- */
async function adminOverview(sql, q) {
  await settle(sql);
  const c = await cfg(sql);
  const days = Math.min(Math.max(Number(q && q.days) || 30, 1), 3650);
  const since = new Date(Date.now() - days * 864e5).toISOString();
  const [tot, promoters, gemPrice, works, totals] = await Promise.all([
    sql(`SELECT (SELECT count(*) FROM promo_clicks WHERE at > $1)::int AS clicks, (SELECT count(*) FROM promo_binds WHERE bound_at > $1)::int AS users,
      (SELECT COALESCE(sum(price_cents),0) FROM promo_comm WHERE at > $1)::int AS sales, (SELECT COALESCE(sum(comm_cents),0) FROM promo_comm WHERE at > $1)::float AS comm,
      (SELECT COALESCE(sum(gems),0) FROM promo_awards)::int AS gems_all`, [since]),
    sql(`SELECT p.user_id, p.code, u.email, u.name, COALESCE(k.n,0)::int AS clicks, COALESCE(b.n,0)::int AS users, COALESCE(m.payers,0)::int AS payers, COALESCE(m.cents,0)::int AS sales, COALESCE(m.comm,0)::float AS comm, COALESCE(a.gems,0)::int AS gems
      FROM promo_codes p LEFT JOIN users u ON u.id = p.user_id
      LEFT JOIN (SELECT promoter, count(*) AS n FROM promo_clicks WHERE at > $1 GROUP BY promoter) k ON k.promoter = p.user_id
      LEFT JOIN (SELECT promoter, count(*) AS n FROM promo_binds WHERE bound_at > $1 GROUP BY promoter) b ON b.promoter = p.user_id
      LEFT JOIN (SELECT promoter, count(DISTINCT user_id) AS payers, sum(price_cents) AS cents, sum(comm_cents) AS comm FROM promo_comm WHERE at > $1 GROUP BY promoter) m ON m.promoter = p.user_id
      LEFT JOIN promo_awards a ON a.promoter = p.user_id
      WHERE COALESCE(k.n,0) + COALESCE(b.n,0) + COALESCE(m.cents,0) + COALESCE(a.gems,0) > 0
      ORDER BY sales DESC, users DESC, clicks DESC LIMIT 200`, [since]),
    sql(`SELECT COALESCE(sum(price_cents),0)::float AS cents, COALESCE(sum(gems),0)::float AS gems FROM orders WHERE status='paid' AND NOT COALESCE(test,false)`),
    /* 单剧：钻石消耗（玩家在这部剧里花的钻）、直接充值（在这部剧里打开充值页后 60 分钟内的正式充值）、推广带来的收入 */
    sql(`WITH use_w AS (SELECT wid, sum(n)::int AS gems, count(DISTINCT user_id)::int AS spenders FROM promo_use WHERE at > $1 GROUP BY wid),
      pay_w AS (SELECT x.wid, count(*)::int AS orders, COUNT(DISTINCT o.user_id)::int AS payers, sum(o.price_cents)::int AS cents FROM orders o
        JOIN LATERAL (SELECT p.wid FROM promo_paywall p WHERE p.user_id = o.user_id AND p.at <= o.at AND p.at > o.at - interval '60 minutes' ORDER BY p.at DESC LIMIT 1) x ON true
        WHERE o.status = 'paid' AND NOT COALESCE(o.test,false) AND o.at > $1 GROUP BY x.wid),
      pro_w AS (SELECT wid, sum(price_cents)::int AS cents, count(DISTINCT user_id)::int AS users FROM promo_comm WHERE at > $1 GROUP BY wid),
      clk_w AS (SELECT wid, count(*)::int AS clicks FROM promo_clicks WHERE at > $1 GROUP BY wid),
      ids AS (SELECT wid FROM use_w UNION SELECT wid FROM pay_w UNION SELECT wid FROM pro_w UNION SELECT wid FROM clk_w)
      SELECT ids.wid, t.title, t.author_name, t.plays, COALESCE(u.gems,0) AS gems, COALESCE(u.spenders,0) AS spenders, COALESCE(p.orders,0) AS orders, COALESCE(p.payers,0) AS payers, COALESCE(p.cents,0) AS pay_cents,
        COALESCE(r.cents,0) AS promo_cents, COALESCE(r.users,0) AS promo_payers, COALESCE(k.clicks,0) AS clicks
      FROM ids LEFT JOIN works t ON t.id = ids.wid LEFT JOIN use_w u ON u.wid IS NOT DISTINCT FROM ids.wid LEFT JOIN pay_w p ON p.wid IS NOT DISTINCT FROM ids.wid
      LEFT JOIN pro_w r ON r.wid IS NOT DISTINCT FROM ids.wid LEFT JOIN clk_w k ON k.wid IS NOT DISTINCT FROM ids.wid
      WHERE ids.wid IS NOT NULL ORDER BY COALESCE(p.cents,0) + COALESCE(u.gems,0) * 20 DESC LIMIT 300`, [since]),
    sql(`SELECT COALESCE(sum(price_cents),0)::int AS cents FROM orders WHERE status='paid' AND NOT COALESCE(test,false) AND at > $1`, [since]),
  ]);
  /* 一颗钻平均值多少钱：按正式充值算（钻数含赠送），没有正式充值时按 $0.99 / 5 钻 */
  const centsPerGem = gemPrice[0].gems > 0 ? gemPrice[0].cents / gemPrice[0].gems : 19.8;
  works.forEach(w => { w.gem_cents = Math.round(Number(w.gems) * centsPerGem); });
  return { cfg: c, days, centsPerGem: Math.round(centsPerGem * 100) / 100, totals: Object.assign(tot[0], { revenue: totals[0].cents }), promoters, works };
}
async function saveCfg(sql, v, who) {
  await init(sql);
  const rate = Number(v.rate), days = Math.trunc(Number(v.days)), gpu = Math.trunc(Number(v.gemsPerUsd)), nd = Math.trunc(Number(v.newDays));
  if (!(rate >= 0 && rate <= 0.5)) throw new Error('分佣比例要在 0%–50% 之间');
  if (!(days >= 1 && days <= 3650)) throw new Error('归属天数要在 1–3650 之间');
  if (!(gpu >= 1 && gpu <= 100)) throw new Error('钻石换算要在 1–100 之间');
  if (!(nd >= 0 && nd <= 365)) throw new Error('新用户天数要在 0–365 之间');
  await sql('UPDATE promo_cfg SET rate=$1, days=$2, gems_per_usd=$3, new_days=$4, on_=$5, updated_by=$6, updated_at=now() WHERE id=1', [rate, days, gpu, nd, v.on !== false, String(who || '').slice(0, 60)]);
  return cfg(sql);
}

module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res, 'GET, POST, OPTIONS')) return;
  const sql = await L.db(); await init(sql);
  const q = req.query || {}; const b = req.method === 'POST' ? L.jsonBody(req) : {};

  if (b.op === 'click') {
    const ip = L.ip(req) || 'x';
    if (!(await L.bump('promoclick:' + ip, 'promoclick', 60))) return L.send(res, 200, { ok: false });
    const promoter = await ownerOf(sql, b.code); if (!promoter) return L.send(res, 200, { ok: false });
    const h = L.crypto.createHash('sha256').update(ip + ':' + promoter).digest('hex').slice(0, 16);
    const dup = await sql("SELECT 1 FROM promo_clicks WHERE promoter=$1 AND ip=$2 AND at > now() - interval '12 hours' LIMIT 1", [promoter, h]);
    if (!dup.length) await sql('INSERT INTO promo_clicks (code, promoter, wid, ip) VALUES ($1,$2,$3,$4)', [String(b.code).slice(0, 20), promoter, okWid(b.wid), h]);
    return L.send(res, 200, { ok: true });
  }

  const u = await L.needActive(req, res); if (!u) return;
  const c = await cfg(sql);

  if (req.method === 'GET' && q.r === 'me') {
    const code = await codeOf(sql, u.uid);
    await settle(sql, u.uid);
    const s = await stats(sql, u.uid);
    const mine = await sql('SELECT promoter, bound_at FROM promo_binds WHERE user_id=$1', [u.uid]);
    return L.send(res, 200, Object.assign({ code, boundTo: !!mine[0] }, s));
  }
  if (b.op === 'bind') {
    if (!c.on) return L.send(res, 200, { ok: false, why: 'off' });
    const promoter = await ownerOf(sql, b.code);
    if (!promoter || promoter === u.uid) return L.send(res, 200, { ok: false, why: 'code' });
    const had = await sql('SELECT 1 FROM promo_binds WHERE user_id=$1', [u.uid]); if (had.length) return L.send(res, 200, { ok: false, why: 'bound' });
    const me = (await sql('SELECT created_at FROM users WHERE id=$1', [u.uid]))[0];
    if (!me || (c.newDays > 0 && Date.now() - new Date(me.created_at).getTime() > c.newDays * 864e5)) return L.send(res, 200, { ok: false, why: 'old' });
    const paid = await sql("SELECT 1 FROM orders WHERE user_id=$1 AND status='paid' AND NOT COALESCE(test,false) LIMIT 1", [u.uid]);
    if (paid.length) return L.send(res, 200, { ok: false, why: 'paid' });
    /* 防互刷：推广人不能是被他自己拉来的人拉来的 */
    const loop = await sql('SELECT 1 FROM promo_binds WHERE user_id=$1 AND promoter=$2', [promoter, u.uid]); if (loop.length) return L.send(res, 200, { ok: false, why: 'loop' });
    await sql('INSERT INTO promo_binds (user_id, promoter, wid, days) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING', [u.uid, promoter, okWid(b.wid), c.days]);
    return L.send(res, 200, { ok: true });
  }
  if (b.op === 'use') {
    const items = (Array.isArray(b.items) ? b.items : []).slice(0, 40);
    for (const it of items) {
      const wid = okWid(it && it.wid), n = Math.trunc(Number(it && it.n));
      if (!wid || !(n > 0 && n <= 50)) continue;
      await sql('INSERT INTO promo_use (user_id, wid, n, why) VALUES ($1,$2,$3,$4)', [u.uid, wid, n, String(it.why || '').slice(0, 20)]);
    }
    return L.send(res, 200, { ok: true });
  }
  if (b.op === 'paywall') {
    const wid = okWid(b.wid); if (!wid) return L.send(res, 200, { ok: false });
    const recent = await sql("SELECT 1 FROM promo_paywall WHERE user_id=$1 AND wid=$2 AND at > now() - interval '2 minutes' LIMIT 1", [u.uid, wid]);
    if (!recent.length) await sql('INSERT INTO promo_paywall (user_id, wid, why) VALUES ($1,$2,$3)', [u.uid, wid, String(b.why || '').slice(0, 20)]);
    return L.send(res, 200, { ok: true });
  }
  return L.bad(res, 'unknown op');
});
module.exports.adminOverview = adminOverview;
module.exports.saveCfg = saveCfg;
module.exports.settle = settle;
