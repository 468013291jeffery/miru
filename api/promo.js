// /api/promo — 推广分佣 + 单剧收入统计（2026-11-16）
// 规则（产品定）：被推广用户自绑定起 30 天内的每笔正式充值，推广人得充值金额的 10%，以钻石发放（$1 = 5 钻），平台出钱，原作者不额外分。
// 数据库账号没有建表权限，所以全部记在现有的 events 表里（name 以 promo_ 开头），规则存在 config 表的 promo_cfg 键，已发的钻石看 ledger（key 以 promo: 开头）。
//   GET  ?r=me                       推广人自己的数据（需登录）
//   POST {op:'click', code, wid}     有人点开了推广链接（不需登录）
//   POST {op:'bind',  code, wid}     新用户登录后绑定推广人（需登录；只认新号、只绑一次、不能绑自己）
//   POST {op:'use',   items:[{wid,n,why}]}   某部剧里花了多少钻（统计用，需登录）
//   POST {op:'paywall', wid, why}    在某部剧里打开了充值页（之后 60 分钟内的充值算这部剧的）
// 后台（/api/admin?r=promo）调用 module.exports.adminOverview / saveCfg。
const L = require('./_lib');
const W = require('./_wallet');

const DEF = { rate: 0.1, days: 30, gemsPerUsd: 5, newDays: 7, on: true };
async function cfg(sql) {
  const r = await sql("SELECT value FROM config WHERE key='promo_cfg'");
  const v = (r[0] && r[0].value) || {};
  return { rate: Number.isFinite(+v.rate) ? +v.rate : DEF.rate, days: +v.days || DEF.days, gemsPerUsd: +v.gemsPerUsd || DEF.gemsPerUsd, newDays: Number.isFinite(+v.newDays) ? +v.newDays : DEF.newDays, on: v.on !== false };
}
const okWid = w => /^[A-Za-z0-9_:.-]{1,80}$/.test(String(w || '')) ? String(w) : null;
const ev = (sql, uid, name, props) => sql('INSERT INTO events (user_id, name, props) VALUES ($1,$2,$3::jsonb)', [uid, name, JSON.stringify(props || {})]);

/* 公用的子查询 */
const BINDS = `SELECT user_id, props->>'promoter' AS promoter, props->>'wid' AS wid, at AS bound_at, COALESCE((props->>'days')::int, 30) AS days FROM events WHERE name='promo_bind'`;
const COMM = `SELECT props->>'order' AS order_id, props->>'promoter' AS promoter, user_id, props->>'wid' AS wid, (props->>'cents')::int AS price_cents, (props->>'comm')::float8 AS comm_cents, at FROM events WHERE name='promo_comm'`;
const CLICKS = `SELECT props->>'promoter' AS promoter, props->>'wid' AS wid, at FROM events WHERE name='promo_click'`;

async function codeOf(sql, uid) {
  const r = await sql("SELECT props->>'code' AS code FROM events WHERE name='promo_code' AND user_id=$1 ORDER BY id LIMIT 1", [uid]); if (r[0] && r[0].code) return r[0].code;
  for (let i = 0; i < 6; i++) {
    const code = 'm' + L.crypto.randomBytes(6).toString('base64').replace(/[^A-Za-z0-9]/g, '').slice(0, 6).toLowerCase();
    if (code.length < 6) continue;
    const used = await sql("SELECT 1 FROM events WHERE name='promo_code' AND props->>'code'=$1 LIMIT 1", [code]); if (used.length) continue;
    await ev(sql, uid, 'promo_code', { code });
    const again = await sql("SELECT props->>'code' AS code FROM events WHERE name='promo_code' AND user_id=$1 ORDER BY id LIMIT 1", [uid]);
    return again[0].code;
  }
  throw new Error('code');
}
async function ownerOf(sql, code) { const r = await sql("SELECT user_id FROM events WHERE name='promo_code' AND props->>'code'=$1 ORDER BY id LIMIT 1", [String(code || '').slice(0, 20)]); return r[0] ? r[0].user_id : null; }

/* 结算：把新的正式充值记成佣金，再把累计佣金折成钻石补发（零头留着，下次凑够再发；ledger 的 key 保证不重复发） */
async function settle(sql, promoter) {
  const c = await cfg(sql);
  const args = [c.rate]; let w = '';
  if (promoter) { args.push(promoter); w = ' AND b.promoter=$2'; }
  await sql(`INSERT INTO events (user_id, name, props, at)
    SELECT o.user_id, 'promo_comm', jsonb_build_object('order', o.id, 'promoter', b.promoter, 'wid', b.wid, 'cents', o.price_cents, 'comm', o.price_cents * $1::float8, 'rate', $1::float8), o.at
    FROM orders o JOIN (${BINDS}) b ON b.user_id = o.user_id
    WHERE o.status = 'paid' AND NOT COALESCE(o.test, false) AND o.at >= b.bound_at AND o.at < b.bound_at + make_interval(days => b.days)${w}
      AND NOT EXISTS (SELECT 1 FROM events e WHERE e.name = 'promo_comm' AND e.props->>'order' = o.id)`, args);
  const rows = await sql(`SELECT m.promoter, m.cents, COALESCE((SELECT sum(delta) FROM ledger l WHERE l.user_id = m.promoter AND l.key LIKE 'promo:%'), 0) AS gems
    FROM (SELECT promoter, sum(comm_cents) AS cents FROM (${COMM}) x ${promoter ? 'WHERE promoter=$1' : ''} GROUP BY promoter) m`, promoter ? [promoter] : []);
  for (const r of rows) {
    const due = Math.floor(Number(r.cents) * c.gemsPerUsd / 100);
    const add = due - Number(r.gems);
    if (add > 0) await W.apply(sql, r.promoter, add, 'promo', 'promo:' + r.promoter + ':' + due);
  }
}

async function stats(sql, promoter) {
  const c = await cfg(sql);
  const [clicks, binds, comm, award, byWork, recent] = await Promise.all([
    sql(`SELECT count(*)::int AS n FROM (${CLICKS}) k WHERE promoter=$1`, [promoter]),
    sql(`SELECT count(*)::int AS n, count(*) FILTER (WHERE bound_at + make_interval(days => days) > now())::int AS active FROM (${BINDS}) b WHERE promoter=$1`, [promoter]),
    sql(`SELECT count(DISTINCT user_id)::int AS payers, count(*)::int AS orders, COALESCE(sum(price_cents),0)::int AS cents, COALESCE(sum(comm_cents),0)::float8 AS comm FROM (${COMM}) m WHERE promoter=$1`, [promoter]),
    sql("SELECT COALESCE(sum(delta),0)::int AS gems FROM ledger WHERE user_id=$1 AND key LIKE 'promo:%'", [promoter]),
    sql(`WITH k AS (SELECT wid, count(*) AS clicks FROM (${CLICKS}) x WHERE promoter=$1 GROUP BY wid),
      b AS (SELECT wid, count(*) AS users FROM (${BINDS}) x WHERE promoter=$1 GROUP BY wid),
      m AS (SELECT wid, sum(price_cents) AS cents, sum(comm_cents) AS comm FROM (${COMM}) x WHERE promoter=$1 GROUP BY wid),
      ids AS (SELECT wid FROM k UNION SELECT wid FROM b UNION SELECT wid FROM m)
      SELECT ids.wid, COALESCE(k.clicks,0)::int AS clicks, COALESCE(b.users,0)::int AS users, COALESCE(m.cents,0)::int AS cents, COALESCE(m.comm,0)::float8 AS comm, t.title
      FROM ids LEFT JOIN k ON k.wid IS NOT DISTINCT FROM ids.wid LEFT JOIN b ON b.wid IS NOT DISTINCT FROM ids.wid LEFT JOIN m ON m.wid IS NOT DISTINCT FROM ids.wid
      LEFT JOIN works t ON t.id = ids.wid ORDER BY 2 DESC LIMIT 50`, [promoter]),
    sql(`SELECT wid, price_cents, comm_cents, at FROM (${COMM}) m WHERE promoter=$1 ORDER BY at DESC LIMIT 20`, [promoter]),
  ]);
  return { rate: c.rate, days: c.days, gemsPerUsd: c.gemsPerUsd, on: c.on, clicks: clicks[0].n, users: binds[0].n, activeUsers: binds[0].active, payers: comm[0].payers, orders: comm[0].orders, salesCents: comm[0].cents, commCents: Math.round(comm[0].comm * 100) / 100, gems: award[0].gems, byWork, recent };
}

/* ---------- 后台：推广人排行 + 单剧收入 ---------- */
async function adminOverview(sql, q) {
  await settle(sql);
  const c = await cfg(sql);
  const days = Math.min(Math.max(Number(q && q.days) || 30, 1), 3650);
  const since = new Date(Date.now() - days * 864e5).toISOString();
  const [tot, promoters, gemPrice, works, totals] = await Promise.all([
    sql(`SELECT (SELECT count(*) FROM (${CLICKS}) k WHERE at > $1)::int AS clicks, (SELECT count(*) FROM (${BINDS}) b WHERE bound_at > $1)::int AS users,
      (SELECT COALESCE(sum(price_cents),0) FROM (${COMM}) m WHERE at > $1)::int AS sales, (SELECT COALESCE(sum(comm_cents),0) FROM (${COMM}) m WHERE at > $1)::float8 AS comm,
      (SELECT COALESCE(sum(delta),0) FROM ledger WHERE key LIKE 'promo:%')::int AS gems_all`, [since]),
    sql(`WITH p AS (SELECT DISTINCT ON (user_id) user_id, props->>'code' AS code FROM events WHERE name='promo_code' ORDER BY user_id, id),
      k AS (SELECT promoter, count(*) AS n FROM (${CLICKS}) x WHERE at > $1 GROUP BY promoter),
      b AS (SELECT promoter, count(*) AS n FROM (${BINDS}) x WHERE bound_at > $1 GROUP BY promoter),
      m AS (SELECT promoter, count(DISTINCT user_id) AS payers, sum(price_cents) AS cents, sum(comm_cents) AS comm FROM (${COMM}) x WHERE at > $1 GROUP BY promoter),
      a AS (SELECT user_id, sum(delta) AS gems FROM ledger WHERE key LIKE 'promo:%' GROUP BY user_id)
      SELECT p.user_id, p.code, u.email, u.name, COALESCE(k.n,0)::int AS clicks, COALESCE(b.n,0)::int AS users, COALESCE(m.payers,0)::int AS payers, COALESCE(m.cents,0)::int AS sales, COALESCE(m.comm,0)::float8 AS comm, COALESCE(a.gems,0)::int AS gems
      FROM p LEFT JOIN users u ON u.id = p.user_id LEFT JOIN k ON k.promoter = p.user_id LEFT JOIN b ON b.promoter = p.user_id LEFT JOIN m ON m.promoter = p.user_id LEFT JOIN a ON a.user_id = p.user_id
      WHERE COALESCE(k.n,0) + COALESCE(b.n,0) + COALESCE(m.cents,0) + COALESCE(a.gems,0) > 0
      ORDER BY sales DESC, users DESC, clicks DESC LIMIT 200`, [since]),
    sql(`SELECT COALESCE(sum(price_cents),0)::float8 AS cents, COALESCE(sum(gems),0)::float8 AS gems FROM orders WHERE status='paid' AND NOT COALESCE(test,false)`),
    /* 单剧：钻石消耗（玩家在这部剧里花的钻）、直接充值（在这部剧里打开充值页后 60 分钟内的正式充值）、推广带来的收入 */
    sql(`WITH use_w AS (SELECT props->>'wid' AS wid, sum((props->>'n')::int)::int AS gems, count(DISTINCT user_id)::int AS spenders FROM events WHERE name='promo_use' AND at > $1 GROUP BY 1),
      pay_w AS (SELECT x.wid, count(*)::int AS orders, count(DISTINCT o.user_id)::int AS payers, sum(o.price_cents)::int AS cents FROM orders o
        JOIN LATERAL (SELECT p.props->>'wid' AS wid FROM events p WHERE p.name='promo_paywall' AND p.user_id = o.user_id AND p.at <= o.at AND p.at > o.at - interval '60 minutes' ORDER BY p.at DESC LIMIT 1) x ON true
        WHERE o.status = 'paid' AND NOT COALESCE(o.test,false) AND o.at > $1 GROUP BY x.wid),
      pro_w AS (SELECT wid, sum(price_cents)::int AS cents, count(DISTINCT user_id)::int AS users FROM (${COMM}) m WHERE at > $1 GROUP BY wid),
      clk_w AS (SELECT wid, count(*)::int AS clicks FROM (${CLICKS}) k WHERE at > $1 GROUP BY wid),
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
  const rate = Number(v.rate), days = Math.trunc(Number(v.days)), gpu = Math.trunc(Number(v.gemsPerUsd)), nd = Math.trunc(Number(v.newDays));
  if (!(rate >= 0 && rate <= 0.5)) throw new Error('分佣比例要在 0%–50% 之间');
  if (!(days >= 1 && days <= 3650)) throw new Error('归属天数要在 1–3650 之间');
  if (!(gpu >= 1 && gpu <= 100)) throw new Error('钻石换算要在 1–100 之间');
  if (!(nd >= 0 && nd <= 365)) throw new Error('新用户天数要在 0–365 之间');
  const val = { rate, days, gemsPerUsd: gpu, newDays: nd, on: v.on !== false };
  await sql("INSERT INTO config (key, value, updated_by, updated_at) VALUES ('promo_cfg', $1::jsonb, $2, now()) ON CONFLICT (key) DO UPDATE SET value=$1::jsonb, updated_by=$2, updated_at=now()", [JSON.stringify(val), String(who || '').slice(0, 60)]);
  return cfg(sql);
}

module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res, 'GET, POST, OPTIONS')) return;
  const sql = await L.db();
  const q = req.query || {}; const b = req.method === 'POST' ? L.jsonBody(req) : {};

  if (b.op === 'click') {
    const ip = L.ip(req) || 'x';
    if (!(await L.bump('promoclick:' + ip, 'promoclick', 60))) return L.send(res, 200, { ok: false });
    const promoter = await ownerOf(sql, b.code); if (!promoter) return L.send(res, 200, { ok: false });
    const h = L.crypto.createHash('sha256').update(ip + ':' + promoter).digest('hex').slice(0, 16);
    const dup = await sql("SELECT 1 FROM events WHERE name='promo_click' AND props->>'promoter'=$1 AND props->>'ip'=$2 AND at > now() - interval '12 hours' LIMIT 1", [promoter, h]);
    if (!dup.length) await ev(sql, null, 'promo_click', { promoter, code: String(b.code).slice(0, 20), wid: okWid(b.wid), ip: h });
    return L.send(res, 200, { ok: true });
  }

  const u = await L.needActive(req, res); if (!u) return;
  const c = await cfg(sql);

  if (req.method === 'GET' && q.r === 'me') {
    const code = await codeOf(sql, u.uid);
    await settle(sql, u.uid);
    const s = await stats(sql, u.uid);
    const mine = await sql("SELECT 1 FROM events WHERE name='promo_bind' AND user_id=$1 LIMIT 1", [u.uid]);
    return L.send(res, 200, Object.assign({ code, boundTo: !!mine[0] }, s));
  }
  if (b.op === 'bind') {
    if (!c.on) return L.send(res, 200, { ok: false, why: 'off' });
    const promoter = await ownerOf(sql, b.code);
    if (!promoter || promoter === u.uid) return L.send(res, 200, { ok: false, why: 'code' });
    const had = await sql("SELECT 1 FROM events WHERE name='promo_bind' AND user_id=$1 LIMIT 1", [u.uid]); if (had.length) return L.send(res, 200, { ok: false, why: 'bound' });
    const me = (await sql('SELECT created_at FROM users WHERE id=$1', [u.uid]))[0];
    if (!me || (c.newDays > 0 && Date.now() - new Date(me.created_at).getTime() > c.newDays * 864e5)) return L.send(res, 200, { ok: false, why: 'old' });
    const paid = await sql("SELECT 1 FROM orders WHERE user_id=$1 AND status='paid' AND NOT COALESCE(test,false) LIMIT 1", [u.uid]);
    if (paid.length) return L.send(res, 200, { ok: false, why: 'paid' });
    /* 防互刷：推广人不能是被他自己拉来的人拉来的 */
    const loop = await sql("SELECT 1 FROM events WHERE name='promo_bind' AND user_id=$1 AND props->>'promoter'=$2 LIMIT 1", [promoter, u.uid]); if (loop.length) return L.send(res, 200, { ok: false, why: 'loop' });
    await ev(sql, u.uid, 'promo_bind', { promoter, wid: okWid(b.wid), days: c.days });
    return L.send(res, 200, { ok: true });
  }
  if (b.op === 'use') {
    const items = (Array.isArray(b.items) ? b.items : []).slice(0, 40);
    for (const it of items) {
      const wid = okWid(it && it.wid), n = Math.trunc(Number(it && it.n));
      if (!wid || !(n > 0 && n <= 50)) continue;
      await ev(sql, u.uid, 'promo_use', { wid, n, why: String(it.why || '').slice(0, 20) });
    }
    return L.send(res, 200, { ok: true });
  }
  if (b.op === 'paywall') {
    const wid = okWid(b.wid); if (!wid) return L.send(res, 200, { ok: false });
    const recent = await sql("SELECT 1 FROM events WHERE name='promo_paywall' AND user_id=$1 AND props->>'wid'=$2 AND at > now() - interval '2 minutes' LIMIT 1", [u.uid, wid]);
    if (!recent.length) await ev(sql, u.uid, 'promo_paywall', { wid, why: String(b.why || '').slice(0, 20) });
    return L.send(res, 200, { ok: true });
  }
  return L.bad(res, 'unknown op');
});
module.exports.adminOverview = adminOverview;
module.exports.saveCfg = saveCfg;
module.exports.settle = settle;
