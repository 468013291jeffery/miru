// /api/auth
// POST {op:'guest'} → new guest account + token (30💎 welcome gift)
// POST {op:'register', email, password, name}  (upgrades the current guest when a token is sent)
// POST {op:'login', email, password} → token (the device then pulls that account's saved state)
// GET  → current account
const L = require('./_lib');
const WELCOME = 30;
module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res)) return;
  const sql = await L.db();
  if (req.method === 'GET') {
    const u = L.needUser(req, res); if (!u) return;
    const r = await sql('SELECT id, email, name, role, lang, created_at FROM users WHERE id=$1', [u.uid]);
    if (!r[0]) return L.bad(res, 'no such user', 404);
    await sql('UPDATE users SET last_seen=now() WHERE id=$1', [u.uid]);
    return L.send(res, 200, { user: r[0] });
  }
  const b = L.jsonBody(req), op = b.op;
  if (op === 'guest') {
    const id = L.newId('u_');
    await sql('INSERT INTO users (id, name, lang) VALUES ($1, $2, $3)', [id, String(b.name || '').slice(0, 40) || null, String(b.lang || '').slice(0, 5) || null]);
    await sql('INSERT INTO wallet (user_id, gems) VALUES ($1, $2) ON CONFLICT DO NOTHING', [id, WELCOME]);
    await sql('INSERT INTO ledger (user_id, delta, reason, key, balance) VALUES ($1,$2,$3,$4,$2)', [id, WELCOME, 'welcome', 'welcome:' + id]);
    return L.send(res, 200, { token: L.tokenFor(id), user: { id, email: null }, gems: WELCOME });
  }
  const email = String(b.email || '').trim().toLowerCase(), pw = String(b.password || '');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return L.bad(res, 'invalid email');
  if (pw.length < 6) return L.bad(res, 'password must be at least 6 characters');
  if (op === 'register') {
    const taken = await sql('SELECT id FROM users WHERE email=$1', [email]);
    if (taken[0]) return L.bad(res, 'email already registered', 409);
    const cur = L.who(req);
    if (cur) {
      const r = await sql('UPDATE users SET email=$2, pass=$3, name=COALESCE($4,name) WHERE id=$1 AND email IS NULL RETURNING id', [cur.uid, email, L.hashPass(pw), b.name || null]);
      if (r[0]) return L.send(res, 200, { token: L.tokenFor(cur.uid), user: { id: cur.uid, email } });
    }
    const id = L.newId('u_');
    await sql('INSERT INTO users (id, email, pass, name) VALUES ($1,$2,$3,$4)', [id, email, L.hashPass(pw), b.name || null]);
    await sql('INSERT INTO wallet (user_id, gems) VALUES ($1, $2) ON CONFLICT DO NOTHING', [id, WELCOME]);
    return L.send(res, 200, { token: L.tokenFor(id), user: { id, email } });
  }
  if (op === 'login') {
    const r = await sql('SELECT id, pass, role FROM users WHERE email=$1', [email]);
    if (!r[0] || !L.checkPass(pw, r[0].pass)) return L.bad(res, 'wrong email or password', 401);
    await sql('UPDATE users SET last_seen=now() WHERE id=$1', [r[0].id]);
    return L.send(res, 200, { token: L.tokenFor(r[0].id, r[0].role), user: { id: r[0].id, email } });
  }
  L.bad(res, 'unknown op');
});
