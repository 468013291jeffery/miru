// /api/auth — MIRU accounts
// GET ?providers=1             → which sign-in methods are switched on (no token needed)
// GET                          → the signed-in account
// POST {op:'guest'}            → guest account (+ welcome diamonds from the console config)
// POST {op:'register', email, password, name}   (upgrades the current guest when its token is sent)
// POST {op:'login', email, password}
// POST {op:'google', idToken} / {op:'apple', idToken, name}   → sign in or create; links to the current guest when possible
// POST {op:'forgot', email}    → 6-digit code by email (Resend);  {op:'reset', email, code, password}
// POST {op:'password', old, password}   change password (signed in)
// POST {op:'logout_all'}       → every other device is signed out
// POST {op:'profile', name}    → rename
// POST {op:'delete'}           → delete the account (App Store requirement): personal data removed, works taken down
const L = require('./_lib');

const pubUser = u => ({ id: u.id, email: u.email || null, name: u.name || null, avatar: u.avatar || null, provider: u.provider || (u.email ? 'email' : 'guest'), created_at: u.created_at });
function blocked(u) { return u.status === 'banned' && (!u.ban_until || new Date(u.ban_until) > new Date()); }

async function newUser(sql, fields) {
  const cfg = await L.config(), id = L.newId('u_'), gems = Number(cfg.welcome_gems) || 0;
  await sql('INSERT INTO users (id, email, pass, name, lang, provider, google_sub, apple_sub, avatar, platform) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
    [id, fields.email || null, fields.pass || null, fields.name || null, fields.lang || null, fields.provider || 'guest', fields.google_sub || null, fields.apple_sub || null, fields.avatar || null, fields.platform || null]);
  await sql('INSERT INTO wallet (user_id, gems) VALUES ($1, $2) ON CONFLICT DO NOTHING', [id, gems]);
  if (gems) await sql('INSERT INTO ledger (user_id, delta, reason, key, balance) VALUES ($1,$2,$3,$4,$2) ON CONFLICT DO NOTHING', [id, gems, 'welcome', 'welcome:' + id]);
  const r = await sql('SELECT * FROM users WHERE id=$1', [id]);
  return { user: r[0], gems };
}
async function signedIn(res, sql, u, extra) {
  if (blocked(u)) return L.send(res, 403, { error: 'banned', reason: u.ban_reason || '', until: u.ban_until });
  if (u.status === 'deleted') return L.bad(res, 'account deleted', 401);
  await sql('UPDATE users SET last_seen=now() WHERE id=$1', [u.id]);
  const w = await sql('SELECT gems FROM wallet WHERE user_id=$1', [u.id]);
  return L.send(res, 200, Object.assign({ token: L.tokenFor(u.id, u.role, u.tv), user: pubUser(u), gems: w[0] ? w[0].gems : 0 }, extra || {}));
}
async function currentGuest(sql, req) {
  const cur = L.who(req); if (!cur || cur.adm) return null;
  const r = await sql('SELECT * FROM users WHERE id=$1', [cur.uid]); const u = r[0];
  return u && !u.email && !u.google_sub && !u.apple_sub && u.status !== 'deleted' ? u : null;
}

const codeMail = (code, what) => ({ subject: 'MIRU ' + (what === 'reg' ? 'sign-up' : 'password reset') + ' code: ' + code + ' · 验证码',
  html: `<div style="font-family:-apple-system,Segoe UI,sans-serif;max-width:420px;margin:auto;padding:24px;color:#222"><h2 style="margin:0 0 8px">MIRU</h2><p>Your ${what === 'reg' ? 'sign-up' : 'password reset'} code is</p><p style="font-size:30px;font-weight:800;letter-spacing:6px;margin:6px 0">${code}</p><p style="color:#666;font-size:13px">It expires in 15 minutes. If you didn't ask for this, you can ignore this email.</p><hr style="border:0;border-top:1px solid #eee"><p style="color:#666;font-size:13px">你的 MIRU 验证码是 <b>${code}</b>，15 分钟内有效。如果不是你本人操作，请忽略这封邮件。</p></div>`,
  text: 'Your MIRU code: ' + code + ' (15 minutes). 你的 MIRU 验证码：' + code + '（15 分钟内有效）' });
module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res)) return;
  const sql = await L.db(); const q = req.query || {};
  if (req.method === 'GET') {
    if (q.providers) { const cfg = await L.config(); const o = L.oauthConfig(); return L.send(res, 200, { google: o.google, apple: o.apple, email: true, reset: L.hasMail(), verify: L.hasMail(), mail: L.hasSES() ? 'ses' : L.hasMail() ? 'resend' : null, guest: cfg.guest_allowed !== false }); }
    const u = await L.needActive(req, res); if (!u) return;
    const r = await sql('SELECT * FROM users WHERE id=$1', [u.uid]);
    return L.send(res, 200, { user: pubUser(r[0]) });
  }
  const b = L.jsonBody(req), op = b.op;

  if (op === 'guest') {
    const cfg = await L.config(); if (cfg.guest_allowed === false) return L.bad(res, 'please sign in', 403);
    const { user, gems } = await newUser(sql, { name: String(b.name || '').slice(0, 40) || null, lang: String(b.lang || '').slice(0, 5) || null, platform: String(b.platform || '').slice(0, 20) || null });
    return L.send(res, 200, { token: L.tokenFor(user.id), user: pubUser(user), gems });
  }

  if (op === 'google' || op === 'apple') {
    let p; try { p = op === 'google' ? await L.verifyGoogle(String(b.idToken || '')) : await L.verifyApple(String(b.idToken || '')); } catch (e) { return L.bad(res, String(e.message || e), 401); }
    const col = op === 'google' ? 'google_sub' : 'apple_sub';
    let r = await sql(`SELECT * FROM users WHERE ${col}=$1`, [p.sub]);
    if (r[0]) return signedIn(res, sql, r[0], { restored: true });
    if (p.email) {
      r = await sql('SELECT * FROM users WHERE email=$1', [p.email]);
      if (r[0]) { await sql(`UPDATE users SET ${col}=$2, avatar=COALESCE(avatar,$3) WHERE id=$1`, [r[0].id, p.sub, p.avatar]); r[0][col] = p.sub; return signedIn(res, sql, r[0], { restored: true }); }
    }
    const name = (b.name && String(b.name).slice(0, 40)) || p.name || null;
    const g = await currentGuest(sql, req);
    if (g) {
      const up = await sql(`UPDATE users SET ${col}=$2, email=COALESCE(email,$3), name=COALESCE(name,$4), avatar=COALESCE(avatar,$5), provider=$6 WHERE id=$1 RETURNING *`, [g.id, p.sub, p.email, name, p.avatar, op]);
      return signedIn(res, sql, up[0], { linked: true });
    }
    const { user } = await newUser(sql, { provider: op, [col]: p.sub, email: p.email, name, avatar: p.avatar });
    return signedIn(res, sql, user, { created: true });
  }

  /* sign-up code: POST {op:'regcode', email} → 6-digit code by email (needed by register whenever mail is configured) */
  if (op === 'regcode') {
    const email = String(b.email || '').trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return L.bad(res, 'invalid email');
    if (!L.hasMail()) return L.send(res, 501, { error: 'mail not configured' });
    const taken = await sql('SELECT id FROM users WHERE email=$1', [email]); if (taken[0]) return L.bad(res, 'email already registered', 409);
    if (!(await L.bump('mail:' + email, 'regcode', 5)) || !(await L.bump('mailip:' + L.ip(req), 'regcode', 20))) return L.bad(res, 'too many requests, try later', 429);
    const code = String(L.crypto.randomInt(100000, 1000000));
    await sql("INSERT INTO reset_codes (email, code, exp, tries) VALUES ($1,$2, now() + interval '15 minutes', 0) ON CONFLICT (email) DO UPDATE SET code=$2, exp=now() + interval '15 minutes', tries=0", ['reg:' + email, L.hashPass(code)]);
    const m = codeMail(code, 'reg'); const ok = await L.sendMail(email, m.subject, m.html, m.text);
    if (!ok) return L.send(res, 502, { error: 'could not send the email', detail: L.mailLast() });
    return L.send(res, 200, { ok: true });
  }
  if (op === 'forgot') {
    const email = String(b.email || '').trim().toLowerCase();
    if (!L.hasMail()) return L.send(res, 501, { error: 'mail not configured', hint: 'contact support to reset your password' });
    const r = await sql('SELECT id FROM users WHERE email=$1 AND status<>$2', [email, 'deleted']);
    if (r[0]) {
      if (!(await L.bump('mail:' + email, 'forgot', 5))) return L.bad(res, 'too many requests, try later', 429);
      const code = String(L.crypto.randomInt(100000, 1000000));
      await sql("INSERT INTO reset_codes (email, code, exp, tries) VALUES ($1,$2, now() + interval '15 minutes', 0) ON CONFLICT (email) DO UPDATE SET code=$2, exp=now() + interval '15 minutes', tries=0", [email, L.hashPass(code)]);
      const m = codeMail(code, 'reset'); await L.sendMail(email, m.subject, m.html, m.text);
    }
    return L.send(res, 200, { ok: true }); // same answer whether or not the email exists
  }
  if (op === 'reset') {
    const email = String(b.email || '').trim().toLowerCase(), pw = String(b.password || '');
    if (pw.length < 6) return L.bad(res, 'password must be at least 6 characters');
    const r = await sql('SELECT code, exp, tries FROM reset_codes WHERE email=$1', [email]); const c = r[0];
    if (!c || new Date(c.exp) < new Date() || c.tries >= 5) return L.bad(res, 'code expired — request a new one', 400);
    if (!L.checkPass(String(b.code || ''), c.code)) { await sql('UPDATE reset_codes SET tries=tries+1 WHERE email=$1', [email]); return L.bad(res, 'wrong code', 400); }
    await sql('DELETE FROM reset_codes WHERE email=$1', [email]);
    const u = await sql("UPDATE users SET pass=$2, tv=COALESCE(tv,0)+1, provider=CASE WHEN provider='guest' THEN 'email' ELSE provider END WHERE email=$1 RETURNING *", [email, L.hashPass(pw)]);
    if (!u[0]) return L.bad(res, 'no such account', 404);
    return signedIn(res, sql, u[0]);
  }

  if (op === 'password' || op === 'logout_all' || op === 'profile' || op === 'delete') {
    const cur = await L.needActive(req, res); if (!cur) return;
    const r = await sql('SELECT * FROM users WHERE id=$1', [cur.uid]); const u = r[0];
    if (op === 'password') {
      const pw = String(b.password || ''); if (pw.length < 6) return L.bad(res, 'password must be at least 6 characters');
      if (u.pass && !L.checkPass(String(b.old || ''), u.pass)) return L.bad(res, 'current password is wrong', 401);
      const up = await sql('UPDATE users SET pass=$2, tv=COALESCE(tv,0)+1 WHERE id=$1 RETURNING *', [u.id, L.hashPass(pw)]);
      return signedIn(res, sql, up[0]);
    }
    if (op === 'logout_all') { const up = await sql('UPDATE users SET tv=COALESCE(tv,0)+1 WHERE id=$1 RETURNING *', [u.id]); return signedIn(res, sql, up[0]); }
    if (op === 'profile') { const up = await sql('UPDATE users SET name=$2 WHERE id=$1 RETURNING *', [u.id, String(b.name || '').slice(0, 40) || null]); return L.send(res, 200, { user: pubUser(up[0]) }); }
    if (op === 'delete') {
      await sql("UPDATE users SET status='deleted', email=NULL, pass=NULL, name=NULL, avatar=NULL, google_sub=NULL, apple_sub=NULL, note=COALESCE(note,'')||' [deleted by user '||now()::date||']', tv=COALESCE(tv,0)+1 WHERE id=$1", [u.id]);
      await sql('DELETE FROM states WHERE user_id=$1', [u.id]); await sql('DELETE FROM memories WHERE user_id=$1', [u.id]);
      await sql("UPDATE works SET status='removed', updated_at=now() WHERE author=$1", [u.id]);
      const a = await sql("UPDATE assets SET status='removed' WHERE owner=$1 RETURNING url", [u.id]);
      for (const x of a) if (x.url) await L.blobDel(x.url);
      return L.send(res, 200, { ok: true });
    }
  }

  const email = String(b.email || '').trim().toLowerCase(), pw = String(b.password || '');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return L.bad(res, 'invalid email');
  if (pw.length < 6) return L.bad(res, 'password must be at least 6 characters');
  if (op === 'register') {
    const taken = await sql('SELECT id FROM users WHERE email=$1', [email]);
    if (taken[0]) return L.bad(res, 'email already registered', 409);
    if (L.hasMail()) { // email ownership check
      const rc = await sql('SELECT code, exp, tries FROM reset_codes WHERE email=$1', ['reg:' + email]); const c = rc[0];
      if (!b.code) return L.bad(res, 'verification code required', 428);
      if (!c || new Date(c.exp) < new Date() || c.tries >= 5) return L.bad(res, 'code expired — request a new one', 400);
      if (!L.checkPass(String(b.code).trim(), c.code)) { await sql('UPDATE reset_codes SET tries=tries+1 WHERE email=$1', ['reg:' + email]); return L.bad(res, 'wrong code', 400); }
      await sql('DELETE FROM reset_codes WHERE email=$1', ['reg:' + email]);
    }
    const g = await currentGuest(sql, req);
    if (g) { const up = await sql("UPDATE users SET email=$2, pass=$3, name=COALESCE($4,name), provider='email' WHERE id=$1 RETURNING *", [g.id, email, L.hashPass(pw), b.name || null]); return signedIn(res, sql, up[0], { linked: true }); }
    const { user } = await newUser(sql, { provider: 'email', email, pass: L.hashPass(pw), name: b.name || null });
    return signedIn(res, sql, user, { created: true });
  }
  if (op === 'login') {
    if (!(await L.bump('login:' + email, 'login', 30))) return L.bad(res, 'too many attempts, try later', 429);
    const r = await sql('SELECT * FROM users WHERE email=$1', [email]);
    if (!r[0] || !L.checkPass(pw, r[0].pass)) return L.bad(res, 'wrong email or password', 401);
    return signedIn(res, sql, r[0], { restored: true });
  }
  L.bad(res, 'unknown op');
});
