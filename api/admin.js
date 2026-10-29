// /api/admin?r=<route> — MIRU operations console API (one function, routed; the Hobby plan allows 12 functions)
// Auth: POST r=login {username,password} → bearer token (12h). First run: username "admin" + the ADMIN_KEY env value creates the owner.
//       X-Admin-Key: <ADMIN_KEY> also works (owner, for scripts).
// Roles: owner · admin · reviewer · support · analyst (see L.ROLES). Every write is recorded in audit_log.
const L = require('./_lib');
const LED = require('./_ledger');
const TR = require('./_transcript');

const PAGE = q => { const size = Math.min(Math.max(Number(q.size) || 20, 1), 200), page = Math.max(Number(q.page) || 1, 1); return { size, page, off: (page - 1) * size }; };
const like = s => '%' + String(s || '').replace(/[%_\\]/g, m => '\\' + m) + '%';
const deny = (res) => L.bad(res, '没有权限 / forbidden', 403);
const userOut = u => ({ id: u.id, email: u.email, name: u.name, provider: u.provider || (u.email ? 'email' : 'guest'), status: u.status || 'active', ban_reason: u.ban_reason, ban_until: u.ban_until, lang: u.lang, platform: u.platform, avatar: u.avatar, note: u.note, created_at: u.created_at, last_seen: u.last_seen, gems: u.gems == null ? undefined : u.gems, works: u.works == null ? undefined : u.works, google: !!u.google_sub, apple: !!u.apple_sub });

async function grant(sql, uid, n, reason) {
  await sql('INSERT INTO wallet (user_id, gems) VALUES ($1, 0) ON CONFLICT DO NOTHING', [uid]);
  const r = await sql('UPDATE wallet SET gems=GREATEST(0,gems+$2), updated_at=now() WHERE user_id=$1 RETURNING gems', [uid, n]);
  await sql('INSERT INTO ledger (user_id, delta, reason, key, balance) VALUES ($1,$2,$3,$4,$5)', [uid, n, String(reason).slice(0, 40), 'admin:' + L.newId(), r[0] ? r[0].gems : 0]);
  return r[0] ? r[0].gems : 0;
}

module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res, 'GET, POST, OPTIONS')) return;
  const sql = await L.db(); const q = req.query || {}; const r = String(q.r || ''); const b = req.method === 'POST' ? L.jsonBody(req) : {};

  /* ---------- sign in ---------- */
  if (r === 'login') {
    const username = String(b.username || '').trim().toLowerCase(), pw = String(b.password || '');
    if (!(await L.bump('adminlogin:' + (L.ip(req) || username), 'adminlogin', 20))) return L.bad(res, '尝试次数过多，请稍后再试', 429);
    const n = await sql('SELECT count(*)::int AS n FROM admins');
    if (!n[0].n) {
      if (username !== 'admin' || !process.env.ADMIN_KEY || pw !== process.env.ADMIN_KEY) return L.bad(res, '首次登录：用户名 admin，密码为 ADMIN_KEY', 401);
      await sql('INSERT INTO admins (id, username, pass, name, role, created_by) VALUES ($1,$2,$3,$4,$5,$6)', [L.newId('ad_'), 'admin', L.hashPass(pw), '超级管理员', 'owner', 'bootstrap']);
    }
    const a = (await sql('SELECT * FROM admins WHERE username=$1', [username]))[0];
    if (!a || !L.checkPass(pw, a.pass)) return L.bad(res, '用户名或密码错误', 401);
    if (a.status !== 'active') return L.bad(res, '该管理员账号已停用', 403);
    await sql('UPDATE admins SET last_login=now() WHERE id=$1', [a.id]);
    await L.audit(sql, a, 'login', 'admin', a.id, {}, req);
    return L.send(res, 200, { token: L.adminToken(a), admin: { id: a.id, username: a.username, name: a.name, role: a.role }, perms: L.ROLES[a.role] });
  }

  const A = await L.whoAdmin(req);
  if (!A) return L.bad(res, '请先登录后台', 401);
  const need = p => { if (!L.can(A.role, p)) { deny(res); return false; } return true; };
  const log = (action, kind, id, detail) => L.audit(sql, A, action, kind, id, detail, req);

  if (r === 'me') return L.send(res, 200, { admin: { id: A.id, username: A.username, name: A.name, role: A.role }, perms: L.ROLES[A.role] });
  if (r === 'password') {
    if (A.id === 'key') return L.bad(res, 'ADMIN_KEY 不能在这里改');
    const a = (await sql('SELECT * FROM admins WHERE id=$1', [A.id]))[0];
    if (!L.checkPass(String(b.old || ''), a.pass)) return L.bad(res, '原密码不正确', 401);
    if (String(b.password || '').length < 8) return L.bad(res, '新密码至少 8 位');
    const up = await sql('UPDATE admins SET pass=$2, tv=COALESCE(tv,0)+1 WHERE id=$1 RETURNING *', [A.id, L.hashPass(String(b.password))]);
    await log('change_password', 'admin', A.id);
    return L.send(res, 200, { token: L.adminToken(up[0]) });
  }

  /* ---------- dashboard ---------- */
  if (r === 'dashboard') {
    if (!need('dashboard')) return;
    const k = (await sql(`SELECT
      (SELECT count(*) FROM users WHERE status IS DISTINCT FROM 'deleted')::int AS users,
      (SELECT count(*) FROM users WHERE provider IN ('email','google','apple') AND status IS DISTINCT FROM 'deleted')::int AS registered,
      (SELECT count(*) FROM users WHERE created_at >= CURRENT_DATE)::int AS new_today,
      (SELECT count(*) FROM users WHERE created_at >= CURRENT_DATE - 1 AND created_at < CURRENT_DATE)::int AS new_yesterday,
      (SELECT count(*) FROM user_days WHERE day = CURRENT_DATE)::int AS dau,
      (SELECT count(*) FROM user_days WHERE day = CURRENT_DATE - 1)::int AS dau_yesterday,
      (SELECT count(DISTINCT user_id) FROM user_days WHERE day > CURRENT_DATE - 7)::int AS wau,
      (SELECT count(DISTINCT user_id) FROM user_days WHERE day > CURRENT_DATE - 30)::int AS mau,
      (SELECT count(*) FROM users WHERE status='banned')::int AS banned,
      (SELECT coalesce(sum(price_cents),0) FROM orders WHERE status='paid' AND at >= CURRENT_DATE)::int AS revenue_today,
      (SELECT coalesce(sum(price_cents),0) FROM orders WHERE status='paid' AND at > now() - interval '30 days')::int AS revenue_30d,
      (SELECT count(*) FROM orders WHERE status='paid' AND at > now() - interval '30 days')::int AS orders_30d,
      (SELECT count(DISTINCT user_id) FROM orders WHERE status='paid')::int AS payers,
      (SELECT count(*) FROM orders WHERE test)::int AS test_orders,
      (SELECT coalesce(sum(-delta),0) FROM ledger WHERE delta<0 AND at >= CURRENT_DATE)::int AS gems_spent_today,
      (SELECT coalesce(sum(gems),0) FROM wallet)::int AS gems_outstanding,
      (SELECT count(*) FROM works WHERE status='live')::int AS works_live,
      (SELECT count(*) FROM works WHERE status='pending')::int AS works_pending,
      (SELECT count(*) FROM assets WHERE status='review')::int AS assets_review,
      (SELECT count(*) FROM reports WHERE status IS DISTINCT FROM 'resolved' AND status IS DISTINCT FROM 'dismissed')::int AS reports_open`))[0];
    const series = await sql(`SELECT d::date AS day,
      (SELECT count(*) FROM users WHERE created_at >= d AND created_at < d + interval '1 day')::int AS new_users,
      (SELECT count(*) FROM user_days WHERE day = d::date)::int AS dau,
      (SELECT coalesce(sum(-delta),0) FROM ledger WHERE delta<0 AND at >= d AND at < d + interval '1 day')::int AS gems_spent,
      (SELECT coalesce(sum(price_cents),0) FROM orders WHERE status='paid' AND at >= d AND at < d + interval '1 day')::int AS revenue
      FROM generate_series(CURRENT_DATE - 13, CURRENT_DATE, interval '1 day') d ORDER BY d`);
    const retention = await sql(`SELECT d::date AS day,
      (SELECT count(*) FROM users u WHERE u.created_at >= d AND u.created_at < d + interval '1 day')::int AS cohort,
      (SELECT count(*) FROM users u JOIN user_days x ON x.user_id=u.id AND x.day = d::date + 1 WHERE u.created_at >= d AND u.created_at < d + interval '1 day')::int AS d1,
      (SELECT count(*) FROM users u JOIN user_days x ON x.user_id=u.id AND x.day = d::date + 7 WHERE u.created_at >= d AND u.created_at < d + interval '1 day')::int AS d7
      FROM generate_series(CURRENT_DATE - 14, CURRENT_DATE - 1, interval '1 day') d ORDER BY d`);
    const funnelNames = ['app_open', 'auth_view', 'login', 'taste_done', 'hook_play', 'story_start', 'chapter_done', 'talk', 'store_open', 'purchase', 'publish'];
    const f = await sql("SELECT name, count(DISTINCT user_id)::int AS users, count(*)::int AS n FROM events WHERE at > now() - interval '7 days' AND name = ANY($1) GROUP BY name", [funnelNames]);
    const funnel = funnelNames.map(n => Object.assign({ name: n, users: 0, n: 0 }, f.find(x => x.name === n) || {}));
    const topWorks = await sql("SELECT id, title, author_name, plays, likes FROM works WHERE status='live' ORDER BY plays DESC LIMIT 5");
    const providers = await sql("SELECT coalesce(provider,'guest') AS provider, count(*)::int AS n FROM users WHERE status IS DISTINCT FROM 'deleted' GROUP BY 1");
    const langs = await sql("SELECT coalesce(lang,'?') AS lang, count(*)::int AS n FROM users GROUP BY 1 ORDER BY 2 DESC LIMIT 8");
    return L.send(res, 200, { kpi: k, series, retention, funnel, topWorks, providers, langs, payTest: process.env.PAY_TEST === '1' });
  }

  /* ---------- users ---------- */
  if (r === 'users') {
    if (!need('users')) return; const p = PAGE(q); const args = []; let w = '1=1';
    if (q.q) { args.push(like(q.q)); w += ` AND (u.id ILIKE $${args.length} OR u.email ILIKE $${args.length} OR u.name ILIKE $${args.length})`; }
    if (q.status) { args.push(String(q.status)); w += ` AND coalesce(u.status,'active') = $${args.length}`; }
    if (q.provider) { args.push(String(q.provider)); w += ` AND coalesce(u.provider,'guest') = $${args.length}`; }
    const order = { last_seen: 'u.last_seen DESC NULLS LAST', gems: 'gems DESC NULLS LAST', created: 'u.created_at DESC' }[q.sort] || 'u.created_at DESC';
    const total = (await sql(`SELECT count(*)::int AS n FROM users u WHERE ${w}`, args))[0].n;
    const rows = await sql(`SELECT u.*, w.gems, (SELECT count(*) FROM works x WHERE x.author=u.id)::int AS works FROM users u LEFT JOIN wallet w ON w.user_id=u.id WHERE ${w} ORDER BY ${order} LIMIT ${p.size} OFFSET ${p.off}`, args);
    return L.send(res, 200, { total, rows: rows.map(userOut) });
  }
  /* ---------- one player: gameplay ledger + dialogue export ---------- */
  // ?r=user_ledger&id=&days=   → funnel / choice mix / chapter duration for ONE account
  // ?r=user_transcript&id=&limit=  → their dialogue as a .txt download (most recent N lines)
  if (r === 'user_ledger') {
    if (!need('users')) return;
    const id = String(q.id || '');
    if (!id) return L.bad(res, '缺少 id');
    const days = Math.min(Number(q.days) || 90, 365);
    const rows = await sql(`SELECT user_id, name, props, at FROM events WHERE user_id=$1 AND at > now() - ($2 || ' days')::interval ORDER BY at DESC LIMIT 5000`, [id, String(days)]);
    const sum = LED.summary(rows);
    return L.send(res, 200, Object.assign({ id, days, rows: rows.length }, sum, {
      recent: rows.slice(0, 60).map(x => ({ at: x.at, name: x.name, props: x.props })),
    }));
  }
  if (r === 'user_transcript') {
    if (!need('users')) return;
    const id = String(q.id || '');
    if (!id) return L.bad(res, '缺少 id');
    const limit = Math.min(Math.max(Number(q.limit) || 200, 1), 20000);
    const st = (await sql('SELECT data FROM states WHERE user_id=$1', [id]))[0];
    if (!st || st.data == null) return L.bad(res, '这个账号还没有云存档，读不到对话', 404);
    const t = TR.transcript(st.data, limit);
    await log('export_transcript', 'user', id, { limit, lines: t.lines, threads: t.threads });
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="miru-${id}-${t.lines}lines.txt"`);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(t.text);
  }
  if (r === 'user') {
    if (req.method === 'GET') {
      if (!need('users')) return; const id = String(q.id || '');
      const u = (await sql('SELECT u.*, w.gems, w.plus_until FROM users u LEFT JOIN wallet w ON w.user_id=u.id WHERE u.id=$1', [id]))[0];
      if (!u) return L.bad(res, '用户不存在', 404);
      const [ledger, works, assets, orders, reportsBy, st, days] = await Promise.all([
        sql('SELECT id, delta, reason, balance, at FROM ledger WHERE user_id=$1 ORDER BY id DESC LIMIT 100', [id]),
        sql('SELECT id, title, status, plays, likes, reports, created_at FROM works WHERE author=$1 ORDER BY created_at DESC LIMIT 50', [id]),
        sql('SELECT id, kind, name, url, mime, size, status, created_at FROM assets WHERE owner=$1 ORDER BY created_at DESC LIMIT 50', [id]),
        sql('SELECT * FROM orders WHERE user_id=$1 ORDER BY at DESC LIMIT 50', [id]),
        sql('SELECT * FROM reports WHERE user_id=$1 ORDER BY id DESC LIMIT 20', [id]),
        sql('SELECT ver, updated_at, length(data::text)::int AS bytes FROM states WHERE user_id=$1', [id]),
        sql("SELECT count(*)::int AS n FROM user_days WHERE user_id=$1", [id])]);
      return L.send(res, 200, { user: Object.assign(userOut(u), { plus_until: u.plus_until, active_days: days[0].n }), ledger, works, assets, orders, reportsBy, state: st[0] || null });
    }
    const id = String(b.id || ''), op = b.op;
    const u = (await sql('SELECT * FROM users WHERE id=$1', [id]))[0]; if (!u) return L.bad(res, '用户不存在', 404);
    if (op === 'gems') {
      if (!need('gems')) return; const n = Math.trunc(Number(b.amount));
      if (!n || Math.abs(n) > 100000) return L.bad(res, '数量不对');
      if (!String(b.reason || '').trim()) return L.bad(res, '请填写原因');
      if (A.role === 'support' && Math.abs(n) > 500) return L.bad(res, '客服单次最多 ±500，请找管理员');
      const gems = await grant(sql, id, n, (n > 0 ? 'admin_grant:' : 'admin_deduct:') + String(b.reason).slice(0, 24));
      await log(n > 0 ? 'gems_grant' : 'gems_deduct', 'user', id, { amount: n, reason: b.reason, balance: gems });
      return L.send(res, 200, { gems });
    }
    if (!need('users.write')) return;
    if (op === 'ban') {
      const days = Number(b.days) || 0, reason = String(b.reason || '').slice(0, 200); if (!reason) return L.bad(res, '请填写封禁原因');
      await sql("UPDATE users SET status='banned', ban_reason=$2, ban_until=$3, tv=COALESCE(tv,0)+1 WHERE id=$1", [id, reason, days > 0 ? new Date(Date.now() + days * 864e5).toISOString() : null]);
      if (b.hideWorks) await sql("UPDATE works SET status='takedown', reject_reason=$2 WHERE author=$1 AND status='live'", [id, '作者被封禁']);
      await log('user_ban', 'user', id, { reason, days, hideWorks: !!b.hideWorks }); return L.send(res, 200, { ok: true });
    }
    if (op === 'unban') { await sql("UPDATE users SET status='active', ban_reason=NULL, ban_until=NULL WHERE id=$1", [id]); await log('user_unban', 'user', id); return L.send(res, 200, { ok: true }); }
    if (op === 'resetpw') {
      if (!u.email) return L.bad(res, '游客账号没有密码');
      const pw = String(b.password || '') || ('Miru' + L.crypto.randomInt(100000, 999999));
      if (pw.length < 6) return L.bad(res, '密码至少 6 位');
      await sql('UPDATE users SET pass=$2, tv=COALESCE(tv,0)+1 WHERE id=$1', [id, L.hashPass(pw)]);
      await log('user_reset_password', 'user', id); return L.send(res, 200, { password: pw });
    }
    if (op === 'logout') { await sql('UPDATE users SET tv=COALESCE(tv,0)+1 WHERE id=$1', [id]); await log('user_force_logout', 'user', id); return L.send(res, 200, { ok: true }); }
    if (op === 'note') { await sql('UPDATE users SET note=$2 WHERE id=$1', [id, String(b.note || '').slice(0, 500)]); await log('user_note', 'user', id, { note: b.note }); return L.send(res, 200, { ok: true }); }
    if (op === 'rename') { await sql('UPDATE users SET name=$2 WHERE id=$1', [id, String(b.name || '').slice(0, 40) || null]); await log('user_rename', 'user', id, { name: b.name }); return L.send(res, 200, { ok: true }); }
    if (op === 'email') {
      const e = String(b.email || '').trim().toLowerCase(); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return L.bad(res, '邮箱格式不对');
      if ((await sql('SELECT 1 FROM users WHERE email=$1 AND id<>$2', [e, id]))[0]) return L.bad(res, '该邮箱已被其他账号使用');
      await sql("UPDATE users SET email=$2, provider=CASE WHEN provider='guest' THEN 'email' ELSE provider END WHERE id=$1", [id, e]); await log('user_email', 'user', id, { from: u.email, to: e }); return L.send(res, 200, { ok: true });
    }
    return L.bad(res, 'unknown op');
  }

  /* ---------- works (community stories) ---------- */
  if (r === 'works') {
    if (!need('works')) return; const p = PAGE(q); const args = []; let w = '1=1';
    if (q.status) { args.push(String(q.status)); w += ` AND status=$${args.length}`; }
    if (q.q) { args.push(like(q.q)); w += ` AND (title ILIKE $${args.length} OR author_name ILIKE $${args.length} OR id ILIKE $${args.length} OR author ILIKE $${args.length})`; }
    if (q.reported) w += ' AND reports>0';
    const total = (await sql(`SELECT count(*)::int AS n FROM works WHERE ${w}`, args))[0].n;
    const rows = await sql(`SELECT id, author, author_name, title, hook, lang, orient, tags, cover, status, qa, plays, likes, reports, featured, reject_reason, reviewed_by, reviewed_at, created_at, updated_at, length(pack::text)::int AS bytes FROM works WHERE ${w} ORDER BY ${q.status === 'pending' ? 'updated_at ASC' : 'updated_at DESC'} LIMIT ${p.size} OFFSET ${p.off}`, args);
    return L.send(res, 200, { total, rows });
  }
  if (r === 'work') {
    if (!need('works')) return;
    if (req.method === 'GET') {
      const w = (await sql('SELECT * FROM works WHERE id=$1', [String(q.id || '')]))[0]; if (!w) return L.bad(res, '作品不存在', 404);
      const rep = await sql("SELECT * FROM reports WHERE target_kind='work' AND target_id=$1 ORDER BY id DESC LIMIT 50", [w.id]);
      return L.send(res, 200, { work: w, reports: rep, safety: L.safety([w.title, w.hook, w.pack]) });
    }
    const id = String(b.id || ''), op = b.op, reason = String(b.reason || '').slice(0, 300);
    const map = { approve: 'live', reject: 'rejected', takedown: 'takedown', restore: 'live' };
    if (map[op]) {
      if ((op === 'reject' || op === 'takedown') && !reason) return L.bad(res, '请填写原因（会展示给作者）');
      await sql('UPDATE works SET status=$2, reject_reason=$3, reviewed_by=$4, reviewed_at=now(), updated_at=now() WHERE id=$1', [id, map[op], op === 'approve' || op === 'restore' ? null : reason, A.name || A.username]);
      if (op === 'approve' || op === 'restore') await sql("UPDATE reports SET status='resolved', handled_by=$2, handled_at=now(), note=COALESCE(note,'审核通过') WHERE target_kind='work' AND target_id=$1 AND status='open'", [id, A.name || A.username]);
      if (op === 'takedown') await sql("UPDATE reports SET status='resolved', handled_by=$2, handled_at=now(), note=$3 WHERE target_kind='work' AND target_id=$1 AND status='open'", [id, A.name || A.username, '已下架：' + reason]);
      await log('work_' + op, 'work', id, { reason }); return L.send(res, 200, { ok: true, status: map[op] });
    }
    if (op === 'feature' || op === 'unfeature') { await sql('UPDATE works SET featured=$2 WHERE id=$1', [id, op === 'feature']); await log('work_' + op, 'work', id); return L.send(res, 200, { ok: true }); }
    if (op === 'delete') { if (!L.can(A.role, 'config')) return deny(res); await sql('DELETE FROM works WHERE id=$1', [id]); await log('work_delete', 'work', id, { reason }); return L.send(res, 200, { ok: true }); }
    return L.bad(res, 'unknown op');
  }

  /* ---------- assets (creator uploads) ---------- */
  if (r === 'assets') {
    if (!need('assets')) return; const p = PAGE(q); const args = []; let w = '1=1';
    if (q.status) { args.push(String(q.status)); w += ` AND a.status=$${args.length}`; }
    if (q.kind) { args.push(String(q.kind)); w += ` AND a.kind=$${args.length}`; }
    if (q.q) { args.push(like(q.q)); w += ` AND (a.name ILIKE $${args.length} OR a.owner ILIKE $${args.length} OR a.id ILIKE $${args.length})`; }
    const total = (await sql(`SELECT count(*)::int AS n FROM assets a WHERE ${w}`, args))[0].n;
    const rows = await sql(`SELECT a.*, u.email AS owner_email, u.name AS owner_name FROM assets a LEFT JOIN users u ON u.id=a.owner WHERE ${w} ORDER BY a.created_at DESC LIMIT ${p.size} OFFSET ${p.off}`, args);
    return L.send(res, 200, { total, rows });
  }
  if (r === 'asset') {
    if (!need('assets')) return; const id = String(b.id || ''), op = b.op, reason = String(b.reason || '').slice(0, 300);
    const map = { approve: 'public', reject: 'rejected', private: 'private' };
    if (map[op]) {
      if (op === 'reject' && !reason) return L.bad(res, '请填写驳回原因');
      await sql('UPDATE assets SET status=$2, reject_reason=$3, reviewed_by=$4, reviewed_at=now() WHERE id=$1', [id, map[op], op === 'reject' ? reason : null, A.name || A.username]);
      await log('asset_' + op, 'asset', id, { reason }); return L.send(res, 200, { ok: true });
    }
    if (op === 'delete') { const x = await sql('DELETE FROM assets WHERE id=$1 RETURNING url', [id]); if (x[0] && x[0].url) await L.blobDel(x[0].url); await log('asset_delete', 'asset', id, { reason }); return L.send(res, 200, { ok: true }); }
    return L.bad(res, 'unknown op');
  }

  /* ---------- reports ---------- */
  if (r === 'reports') {
    if (!need('reports')) return; const p = PAGE(q); const args = []; let w = '1=1';
    if (q.status) { args.push(String(q.status)); w += ` AND coalesce(r.status,'open')=$${args.length}`; }
    const total = (await sql(`SELECT count(*)::int AS n FROM reports r WHERE ${w}`, args))[0].n;
    const rows = await sql(`SELECT r.*, coalesce(r.status,'open') AS status, w.title AS work_title, w.status AS work_status, u.email AS reporter_email FROM reports r LEFT JOIN works w ON r.target_kind='work' AND w.id=r.target_id LEFT JOIN users u ON u.id=r.user_id WHERE ${w} ORDER BY r.id DESC LIMIT ${p.size} OFFSET ${p.off}`, args);
    return L.send(res, 200, { total, rows });
  }
  if (r === 'report') {
    if (!need('reports')) return; const id = Number(b.id), op = b.op;
    if (!['resolve', 'dismiss'].includes(op)) return L.bad(res, 'unknown op');
    await sql('UPDATE reports SET status=$2, handled_by=$3, handled_at=now(), note=$4 WHERE id=$1', [id, op === 'resolve' ? 'resolved' : 'dismissed', A.name || A.username, String(b.note || '').slice(0, 300)]);
    await log('report_' + op, 'report', id, { note: b.note }); return L.send(res, 200, { ok: true });
  }

  /* ---------- orders & diamond ledger ---------- */
  if (r === 'orders') {
    if (!need('orders')) return; const p = PAGE(q); const args = []; let w = '1=1';
    if (q.user) { args.push(String(q.user)); w += ` AND o.user_id=$${args.length}`; }
    if (q.status) { args.push(String(q.status)); w += ` AND o.status=$${args.length}`; }
    if (q.test === '0') w += ' AND NOT o.test'; if (q.test === '1') w += ' AND o.test';
    const total = (await sql(`SELECT count(*)::int AS n, coalesce(sum(price_cents),0)::int AS cents FROM orders o WHERE ${w}`, args))[0];
    const rows = await sql(`SELECT o.*, u.email FROM orders o LEFT JOIN users u ON u.id=o.user_id WHERE ${w} ORDER BY o.at DESC LIMIT ${p.size} OFFSET ${p.off}`, args);
    return L.send(res, 200, { total: total.n, cents: total.cents, rows });
  }
  if (r === 'order') {
    if (!need('gems')) return; const o = (await sql('SELECT * FROM orders WHERE id=$1', [String(b.id || '')]))[0];
    if (!o) return L.bad(res, '订单不存在', 404); if (b.op !== 'refund') return L.bad(res, 'unknown op'); if (o.status !== 'paid') return L.bad(res, '只有已支付订单可以退款');
    const gems = await grant(sql, o.user_id, -o.gems, 'refund:' + o.sku);
    await sql("UPDATE orders SET status='refunded', refunded_by=$2 WHERE id=$1", [o.id, A.name || A.username]);
    await log('order_refund', 'order', o.id, { user: o.user_id, gems: o.gems, reason: b.reason }); return L.send(res, 200, { ok: true, gems });
  }
  if (r === 'ledger') {
    if (!need('ledger')) return; const p = PAGE(q); const args = []; let w = '1=1';
    if (q.user) { args.push(String(q.user)); w += ` AND l.user_id=$${args.length}`; }
    if (q.reason) { args.push(like(q.reason)); w += ` AND l.reason ILIKE $${args.length}`; }
    if (q.dir === 'in') w += ' AND l.delta>0'; if (q.dir === 'out') w += ' AND l.delta<0';
    const total = (await sql(`SELECT count(*)::int AS n FROM ledger l WHERE ${w}`, args))[0].n;
    const rows = await sql(`SELECT l.*, u.email FROM ledger l LEFT JOIN users u ON u.id=l.user_id WHERE ${w} ORDER BY l.id DESC LIMIT ${p.size} OFFSET ${p.off}`, args);
    const sum = await sql("SELECT split_part(reason,':',1) AS kind, count(*)::int AS n, sum(delta)::int AS gems FROM ledger WHERE at > now() - interval '30 days' GROUP BY 1 ORDER BY abs(sum(delta)) DESC LIMIT 12");
    return L.send(res, 200, { total, rows, summary: sum });
  }

  /* ---------- translations ---------- */
  if (r === 'i18n') {
    if (!need('i18n')) return;
    if (req.method === 'GET') {
      const p = PAGE(q); const args = [String(q.lang || 'ja')]; let w = 'lang=$1';
      if (q.q) { args.push(like(q.q)); w += ` AND (src ILIKE $2 OR dst ILIKE $2)`; }
      const total = (await sql(`SELECT count(*)::int AS n FROM translations WHERE ${w}`, args))[0].n;
      const rows = await sql(`SELECT h, lang, src, dst, at FROM translations WHERE ${w} ORDER BY at DESC LIMIT ${p.size} OFFSET ${p.off}`, args);
      const langs = await sql('SELECT lang, count(*)::int AS n FROM translations GROUP BY lang');
      return L.send(res, 200, { total, rows, langs });
    }
    if (b.op === 'edit') { await sql('UPDATE translations SET dst=$2, at=now() WHERE h=$1', [String(b.h), String(b.dst || '').slice(0, 1200)]); await log('i18n_edit', 'i18n', b.h, { dst: b.dst }); return L.send(res, 200, { ok: true }); }
    if (b.op === 'delete') { await sql('DELETE FROM translations WHERE h=$1', [String(b.h)]); await log('i18n_delete', 'i18n', b.h); return L.send(res, 200, { ok: true }); }
    if (b.op === 'add') {
      const lang = String(b.lang || ''), src = String(b.src || ''), dst = String(b.dst || ''); if (!lang || !src || !dst) return L.bad(res, '语言、原文、译文都要填');
      const h = L.crypto.createHash('sha1').update(lang + '\n' + src).digest('hex');
      await sql('INSERT INTO translations (h, lang, src, dst) VALUES ($1,$2,$3,$4) ON CONFLICT (h) DO UPDATE SET dst=$4, at=now()', [h, lang, src, dst]); await log('i18n_add', 'i18n', h, { lang, src, dst }); return L.send(res, 200, { ok: true });
    }
    return L.bad(res, 'unknown op');
  }

  /* ---------- operations config ---------- */
  if (r === 'config') {
    if (!need('config')) return;
    if (req.method === 'GET') { const c = await L.config(); const rows = await sql('SELECT key, updated_by, updated_at FROM config'); return L.send(res, 200, { values: c, defaults: L.CONFIG_DEFAULTS, meta: rows }); }
    const vals = b.values || {}; const changed = {};
    for (const [k, v] of Object.entries(vals)) {
      if (!(k in L.CONFIG_DEFAULTS)) continue;
      const d = L.CONFIG_DEFAULTS[k]; if (typeof d !== typeof v || (typeof d === 'number' && !(v >= 0 && v <= 1e6))) return L.bad(res, '配置项 ' + k + ' 的值不合法');
      await sql('INSERT INTO config (key, value, updated_by, updated_at) VALUES ($1,$2::jsonb,$3,now()) ON CONFLICT (key) DO UPDATE SET value=$2::jsonb, updated_by=$3, updated_at=now()', [k, JSON.stringify(v), A.name || A.username]); changed[k] = v;
    }
    L.configReset(); await log('config_update', 'config', Object.keys(changed).join(','), changed);
    return L.send(res, 200, { ok: true, changed });
  }

  /* ---------- in-app notices ---------- */
  if (r === 'notices') {
    if (!need('notices')) return;
    if (req.method === 'GET') return L.send(res, 200, { rows: await sql('SELECT * FROM notices ORDER BY id DESC LIMIT 200') });
    if (b.op === 'delete') { await sql('DELETE FROM notices WHERE id=$1', [Number(b.id)]); await log('notice_delete', 'notice', b.id); return L.send(res, 200, { ok: true }); }
    const n = b.notice || {}; if (!String(n.title || '').trim()) return L.bad(res, '标题必填');
    const vals = [String(n.title).slice(0, 80), String(n.body || '').slice(0, 1000), String(n.lang || 'all').slice(0, 5), String(n.kind || 'banner').slice(0, 10), n.active !== false, n.starts_at || null, n.ends_at || null];
    if (n.id) { await sql('UPDATE notices SET title=$2, body=$3, lang=$4, kind=$5, active=$6, starts_at=$7, ends_at=$8 WHERE id=$1', [Number(n.id), ...vals]); await log('notice_update', 'notice', n.id, n); }
    else { const x = await sql('INSERT INTO notices (title, body, lang, kind, active, starts_at, ends_at, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id', [...vals, A.name || A.username]); await log('notice_create', 'notice', x[0].id, n); }
    return L.send(res, 200, { ok: true });
  }

  /* ---------- console accounts ---------- */
  if (r === 'admins') {
    if (!need('admins')) return;
    if (req.method === 'GET') return L.send(res, 200, { rows: await sql('SELECT id, username, name, role, status, created_by, created_at, last_login FROM admins ORDER BY created_at'), roles: Object.keys(L.ROLES) });
    const op = b.op;
    if (op === 'create') {
      const username = String(b.username || '').trim().toLowerCase(), pw = String(b.password || ''), role = String(b.role || '');
      if (!/^[a-z0-9_.-]{3,30}$/.test(username)) return L.bad(res, '用户名 3–30 位字母数字'); if (pw.length < 8) return L.bad(res, '初始密码至少 8 位'); if (!L.ROLES[role]) return L.bad(res, '角色不对');
      if ((await sql('SELECT 1 FROM admins WHERE username=$1', [username]))[0]) return L.bad(res, '用户名已存在');
      const id = L.newId('ad_'); await sql('INSERT INTO admins (id, username, pass, name, role, created_by) VALUES ($1,$2,$3,$4,$5,$6)', [id, username, L.hashPass(pw), String(b.name || username).slice(0, 30), role, A.name || A.username]);
      await log('admin_create', 'admin', id, { username, role }); return L.send(res, 200, { ok: true, id });
    }
    const t = (await sql('SELECT * FROM admins WHERE id=$1', [String(b.id || '')]))[0]; if (!t) return L.bad(res, '账号不存在', 404);
    if (t.id === A.id && op !== 'update') return L.bad(res, '不能对自己执行这个操作');
    if (op === 'update') { const role = L.ROLES[b.role] ? b.role : t.role; if (t.id === A.id && role !== t.role) return L.bad(res, '不能修改自己的角色'); await sql('UPDATE admins SET name=$2, role=$3 WHERE id=$1', [t.id, String(b.name || t.name).slice(0, 30), role]); await log('admin_update', 'admin', t.id, { name: b.name, role }); return L.send(res, 200, { ok: true }); }
    if (op === 'disable' || op === 'enable') { await sql('UPDATE admins SET status=$2, tv=COALESCE(tv,0)+1 WHERE id=$1', [t.id, op === 'disable' ? 'disabled' : 'active']); await log('admin_' + op, 'admin', t.id); return L.send(res, 200, { ok: true }); }
    if (op === 'resetpw') { const pw = 'Miru-' + L.crypto.randomBytes(5).toString('hex'); await sql('UPDATE admins SET pass=$2, tv=COALESCE(tv,0)+1 WHERE id=$1', [t.id, L.hashPass(pw)]); await log('admin_reset_password', 'admin', t.id); return L.send(res, 200, { password: pw }); }
    if (op === 'delete') { await sql('DELETE FROM admins WHERE id=$1', [t.id]); await log('admin_delete', 'admin', t.id, { username: t.username }); return L.send(res, 200, { ok: true }); }
    return L.bad(res, 'unknown op');
  }

  /* ---------- audit log & analytics ---------- */
  if (r === 'audit') {
    if (!need('audit')) return; const p = PAGE(q); const args = []; let w = '1=1';
    if (q.admin) { args.push(like(q.admin)); w += ` AND admin_name ILIKE $${args.length}`; }
    if (q.action) { args.push(like(q.action)); w += ` AND action ILIKE $${args.length}`; }
    if (q.target) { args.push(String(q.target)); w += ` AND target_id=$${args.length}`; }
    const total = (await sql(`SELECT count(*)::int AS n FROM audit_log WHERE ${w}`, args))[0].n;
    return L.send(res, 200, { total, rows: await sql(`SELECT * FROM audit_log WHERE ${w} ORDER BY id DESC LIMIT ${p.size} OFFSET ${p.off}`, args) });
  }
  if (r === 'events') {
    if (!need('events')) return; const days = Math.min(Number(q.days) || 14, 90);
    const rows = await sql(`SELECT name, at::date AS day, count(*)::int AS n, count(DISTINCT user_id)::int AS users FROM events WHERE at > now() - ($1 || ' days')::interval GROUP BY 1, 2 ORDER BY 2, 1`, [String(days)]);
    const totals = await sql(`SELECT name, count(*)::int AS n, count(DISTINCT user_id)::int AS users FROM events WHERE at > now() - ($1 || ' days')::interval GROUP BY 1 ORDER BY 2 DESC`, [String(days)]);
    return L.send(res, 200, { days, rows, totals });
  }

  /* ---------- 剧本生产 · 5-step workbench (选题素材 → 生成 → 自动检查 → 编剧审改 → 上线) ---------- */
  if (r === 'scripts') {
    if (!need('scripts')) return;
    return L.send(res, 200, { rows: await sql("SELECT id, title, orient, lang, stage, status, work_id, created_by, updated_by, created_at, updated_at, published_at, jsonb_array_length(COALESCE(chapters,'[]'::jsonb))::int AS chapters FROM scripts ORDER BY updated_at DESC LIMIT 200") });
  }
  if (r === 'script') {
    if (!need('scripts')) return;
    if (req.method === 'GET') {
      const s = (await sql('SELECT * FROM scripts WHERE id=$1', [String(q.id || '')]))[0]; if (!s) return L.bad(res, '剧本不存在', 404);
      if (q.versions) return L.send(res, 200, { rows: await sql('SELECT id, stage, note, by_name, at FROM script_versions WHERE script_id=$1 ORDER BY id DESC LIMIT 100', [s.id]) });
      if (q.version) { const v = (await sql('SELECT * FROM script_versions WHERE script_id=$1 AND id=$2', [s.id, Number(q.version)]))[0]; return L.send(res, 200, { version: v || null }); }
      return L.send(res, 200, { script: s });
    }
    const op = b.op, who = A.name || A.username;
    if (op === 'create') {
      const title = String(b.title || '').trim().slice(0, 80); if (!title) return L.bad(res, '标题必填');
      const id = L.newId('sc_');
      await sql('INSERT INTO scripts (id, title, orient, lang, config, research, brief, created_by, updated_by) VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7,$8,$8)', [id, title, String(b.orient || 'bl').slice(0, 4), String(b.lang || 'zh').slice(0, 5), JSON.stringify(b.config || {}), b.research ? JSON.stringify(b.research) : null, b.brief ? String(b.brief).slice(0, 60000) : null, who]);
      await log('script_create', 'script', id, { title }); return L.send(res, 200, { id });
    }
    const s = (await sql('SELECT * FROM scripts WHERE id=$1', [String(b.id || '')]))[0]; if (!s) return L.bad(res, '剧本不存在', 404);
    /* ---------- 自动审查（D先生）----------
       2026-10-28：官方剧的 publish 原来只查「有章节」+「有人点了审改通过」，
       而「这份文本能不能播」没有任何东西看。这一步就是那个看的人：
       结构（章/场景/选择/收尾/指令闭包/未知指令）+ 受限词，两条都跑，绿了才敢盖 review.approved。 */
    if (op === 'autoreview') {
      const QA = require('./_dslqa');
      const md = '# ' + s.title + '\n\n' + (s.chapters || []).slice().sort((x, y) => x.n - y.n).map(c => c.md).join('\n\n');
      const q = QA.dslQA(md);
      const sf = L.safety([md]);
      const err = q.err.concat(sf.length ? ['受限词：' + sf.join('; ')] : []);
      const review = { approved: !err.length, auto: true, by: 'D先生', at: Date.now(), notes: '自动审查：结构' + (q.ok ? '通过' : '不通过') + ' · 受限词 ' + sf.length, checks: { list: [], stats: q.stats, perCh: q.perCh } };
      const qa = { err, warn: q.warn, ok: q.ok ? ['结构检查通过'] : [], info: ['stats: ' + JSON.stringify(q.stats)], auto: true, by: 'D先生', at: Date.now() };
      await sql('UPDATE scripts SET qa=$2::jsonb, review=$3::jsonb, stage=GREATEST(stage,4), updated_by=$4, updated_at=now() WHERE id=$1', [s.id, JSON.stringify(qa), JSON.stringify(review), who]);
      await log('script_autoreview', 'script', s.id, { err: err.length, warn: q.warn.length });
      return L.send(res, 200, { ok: !err.length, err, warn: q.warn, stats: q.stats, perCh: q.perCh, review });
    }
    if (op === 'save') {
      const f = b.patch || {}, sets = [], args = [s.id];
      const put = (col, v, json) => { args.push(json ? JSON.stringify(v) : v); sets.push(col + '=$' + args.length + (json ? '::jsonb' : '')); };
      if ('title' in f) put('title', String(f.title || s.title).slice(0, 80));
      if ('orient' in f) put('orient', String(f.orient || 'bl').slice(0, 4));
      if ('lang' in f) put('lang', String(f.lang || 'zh').slice(0, 5));
      if ('config' in f) put('config', f.config || {}, true);
      if ('research' in f) put('research', f.research || null, true);
      if ('brief' in f) put('brief', String(f.brief || '').slice(0, 60000));
      if ('outline' in f) put('outline', String(f.outline || '').slice(0, 120000));
      if ('chapters' in f) { const ch = Array.isArray(f.chapters) ? f.chapters.slice(0, 40).map(c => ({ n: Number(c.n) || 0, t: String(c.t || '').slice(0, 80), md: String(c.md || '').slice(0, 200000), at: c.at || Date.now(), by: c.by || who })) : []; if (JSON.stringify(ch).length > 3500000) return L.bad(res, '剧本太大（超过 3.5MB）', 413); put('chapters', ch, true); }
      if ('qa' in f) put('qa', f.qa || null, true);
      if ('review' in f) put('review', Object.assign({}, f.review || {}, { by: who, at: Date.now() }), true);
      if ('stage' in f) { const st = Math.max(1, Math.min(5, Number(f.stage) || 1)); put('stage', st); }
      if (!sets.length) return L.bad(res, '没有要保存的内容');
      args.push(who); sets.push('updated_by=$' + args.length); sets.push('updated_at=now()');
      const up = (await sql('UPDATE scripts SET ' + sets.join(', ') + ' WHERE id=$1 RETURNING *', args))[0];
      if (b.snapshot) await sql('INSERT INTO script_versions (script_id, stage, note, data, by_name) VALUES ($1,$2,$3,$4::jsonb,$5)', [s.id, up.stage, String(b.snapshot).slice(0, 120), JSON.stringify({ outline: up.outline, chapters: up.chapters, config: up.config, brief: up.brief, qa: up.qa, review: up.review }), who]);
      await log('script_save', 'script', s.id, { fields: Object.keys(f), snapshot: b.snapshot || null }); return L.send(res, 200, { script: up });
    }
    if (op === 'restore') {
      const v = (await sql('SELECT * FROM script_versions WHERE script_id=$1 AND id=$2', [s.id, Number(b.version)]))[0]; if (!v) return L.bad(res, '版本不存在', 404);
      const d = v.data || {};
      const up = (await sql('UPDATE scripts SET outline=$2, chapters=$3::jsonb, updated_by=$4, updated_at=now() WHERE id=$1 RETURNING *', [s.id, d.outline || null, JSON.stringify(d.chapters || []), who]))[0];
      await log('script_restore', 'script', s.id, { version: v.id }); return L.send(res, 200, { script: up });
    }
    if (op === 'publish') {
      const ch = s.chapters || []; if (!ch.length) return L.bad(res, '还没有章节');
      if (!(s.review && s.review.approved)) return L.bad(res, '第 4 步「编剧审改」还没有标记通过，不能上线');
      if (s.qa && Array.isArray(s.qa.err) && s.qa.err.length && !b.force) return L.bad(res, '自动检查还有 ' + s.qa.err.length + ' 个错误，请先修改（或由超级管理员强制上线）');
      if (b.force && A.role !== 'owner') return deny(res);
      const md = '# ' + s.title + '\n\n' + ch.slice().sort((x, y) => x.n - y.n).map(c => c.md).join('\n\n');
      /* 上线前再跑一次受限词（防的是"审完之后又改了正文"，review 是旧的、文本是新的） */
      if (!b.force) { const sf = L.safety([md]); if (sf.length) return L.bad(res, '受限词命中：' + sf.slice(0, 3).join('; ') + '（先改文本，或由超级管理员强制上线）'); }
      const cfg = s.config || {};
      /* 2026-10-29 · 门面闸：没有一句话简介，发现页上就是一张空卡。
         实测代价：5 部上线时 hook 全空，公开列表里只有标题、一行介绍都没有。 */
      if (!String(cfg.hook || '').trim() && !b.force) return L.bad(res, '还没有一句话简介（hook）—— 发现页上会是一张空卡。先填「一句话卖点」再上线（或由超级管理员强制上线）');
      const id = s.work_id || ('w_' + s.id.replace(/[^a-z0-9]/gi, '').toLowerCase());
      let mdEn = null;
      if (cfg.en_sid) { const e = (await sql('SELECT chapters FROM scripts WHERE id=$1', [String(cfg.en_sid)]))[0]; if (e && Array.isArray(e.chapters) && e.chapters.length) mdEn = '# ' + ((cfg.en && cfg.en.title) || s.title) + '\n\n' + e.chapters.slice().sort((x, y) => x.n - y.n).map(c => c.md).join('\n\n'); }
      const pack = { script: md, script_en: mdEn, ver: Date.now(), meta: { title: s.title, hook: cfg.hook || '', premise: cfg.premise || '', you: cfg.you || '', tags: cfg.tags || [], heat: cfg.heat || '', taste: cfg.taste || null, as: cfg.as || '', en: cfg.en || null }, official: true, rules: b.rulesVersion || null };
      await sql(`INSERT INTO works (id, author, author_name, title, hook, lang, orient, tags, cover, pack, status, qa, featured, reviewed_by, reviewed_at, updated_at)
        VALUES ($1,'miru','MIRU 官方',$2,$3,$4,$5,$6::jsonb,$7,$8::jsonb,'live',$9::jsonb,true,$10,now(),now())
        ON CONFLICT (id) DO UPDATE SET title=$2, hook=$3, lang=$4, orient=$5, tags=$6::jsonb, cover=$7, pack=$8::jsonb, status='live', qa=$9::jsonb, featured=true, reviewed_by=$10, reviewed_at=now(), updated_at=now()`,
        [id, s.title, String(cfg.hook || '').slice(0, 240), s.lang || 'zh', s.orient || 'bl', JSON.stringify((cfg.tags || []).slice(0, 12)), cfg.cover && /^https?:/.test(cfg.cover) ? cfg.cover : null, JSON.stringify(pack), JSON.stringify(s.qa || null), who]);
      await sql("UPDATE scripts SET work_id=$2, status='live', stage=5, published_at=now(), updated_by=$3, updated_at=now() WHERE id=$1", [s.id, id, who]);
      await sql('INSERT INTO script_versions (script_id, stage, note, data, by_name) VALUES ($1,5,$2,$3::jsonb,$4)', [s.id, '上线', JSON.stringify({ outline: s.outline, chapters: s.chapters, config: s.config, qa: s.qa, review: s.review }), who]);
      await log('script_publish', 'script', s.id, { work: id, chapters: ch.length }); return L.send(res, 200, { ok: true, work_id: id });
    }
    if (op === 'unpublish') {
      if (s.work_id) await sql("UPDATE works SET status='takedown', reject_reason='官方剧本下线' WHERE id=$1", [s.work_id]);
      await sql("UPDATE scripts SET status='offline', updated_by=$2, updated_at=now() WHERE id=$1", [s.id, who]);
      await log('script_unpublish', 'script', s.id, { work: s.work_id }); return L.send(res, 200, { ok: true });
    }
    if (op === 'delete') {
      if (s.status === 'live') return L.bad(res, '请先下线再删除');
      await sql('DELETE FROM script_versions WHERE script_id=$1', [s.id]); await sql('DELETE FROM scripts WHERE id=$1', [s.id]);
      await log('script_delete', 'script', s.id, { title: s.title }); return L.send(res, 200, { ok: true });
    }
    return L.bad(res, 'unknown op');
  }

  L.bad(res, 'unknown route');
});
