// MIRU backend · shared helpers (not a route: Vercel ignores files starting with "_")
// Storage: Postgres (Neon via the Vercel integration → DATABASE_URL / POSTGRES_URL) + Vercel Blob (BLOB_READ_WRITE_TOKEN).
// Auth: signed bearer tokens (HMAC-SHA256 with AUTH_SECRET). Guest accounts are created silently; email+password upgrades them.
const crypto = require('crypto');

const ALLOWED = [/^https:\/\/468013291jeffery\.github\.io$/, /^https:\/\/[a-z0-9-]+\.vercel\.app$/, /^http:\/\/localhost(:\d+)?$/, /^http:\/\/127\.0\.0\.1(:\d+)?$/, /^null$/];
function cors(req, res, methods) {
  const o = req.headers.origin;
  const ok = !o || ALLOWED.some(r => r.test(o));
  res.setHeader('Access-Control-Allow-Origin', ok && o ? o : '*');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', methods || 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Key, X-Meta');
  if (req.method === 'OPTIONS') { res.status(204).end(); return null; }
  if (!ok) { res.status(403).json({ error: 'origin not allowed' }); return null; }
  return true;
}
const send = (res, code, obj) => { res.setHeader('Cache-Control', 'no-store'); res.status(code).json(obj); };
const bad = (res, msg, code) => send(res, code || 400, { error: msg });

/* ---------- database ---------- */
let _sql = null, _ready = null;
function dbUrl() { return process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL || ''; }
function hasDb() { return !!dbUrl(); }
function sqlFn() {
  if (_sql) return _sql;
  const { neon } = require('@neondatabase/serverless');
  _sql = neon(dbUrl());
  return _sql;
}
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE, pass TEXT, name TEXT, role TEXT DEFAULT 'user', lang TEXT, created_at TIMESTAMPTZ DEFAULT now(), last_seen TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS states (user_id TEXT PRIMARY KEY, data JSONB, ver INT DEFAULT 0, updated_at TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS wallet (user_id TEXT PRIMARY KEY, gems INT NOT NULL DEFAULT 0, plus_until TIMESTAMPTZ, updated_at TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS ledger (id BIGSERIAL PRIMARY KEY, user_id TEXT, delta INT, reason TEXT, key TEXT UNIQUE, balance INT, at TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS works (id TEXT PRIMARY KEY, author TEXT, author_name TEXT, title TEXT, hook TEXT, lang TEXT, orient TEXT, tags JSONB, cover TEXT, pack JSONB, status TEXT DEFAULT 'pending', qa JSONB, plays INT DEFAULT 0, likes INT DEFAULT 0, reports INT DEFAULT 0, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS work_likes (user_id TEXT, work_id TEXT, PRIMARY KEY (user_id, work_id))`,
  `CREATE TABLE IF NOT EXISTS assets (id TEXT PRIMARY KEY, owner TEXT, kind TEXT, name TEXT, kw JSONB, url TEXT, mime TEXT, size INT, meta JSONB, status TEXT DEFAULT 'private', created_at TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS translations (h TEXT PRIMARY KEY, lang TEXT, src TEXT, dst TEXT, at TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS events (id BIGSERIAL PRIMARY KEY, user_id TEXT, name TEXT, props JSONB, at TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS usage (user_id TEXT, day DATE, kind TEXT, n INT DEFAULT 0, PRIMARY KEY (user_id, day, kind))`,
  `CREATE TABLE IF NOT EXISTS reports (id BIGSERIAL PRIMARY KEY, user_id TEXT, target_kind TEXT, target_id TEXT, reason TEXT, at TIMESTAMPTZ DEFAULT now())`,
  `CREATE INDEX IF NOT EXISTS works_status_idx ON works (status, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS assets_owner_idx ON assets (owner)`,
  `CREATE INDEX IF NOT EXISTS events_name_idx ON events (name, at)`,
  // v2.7 — accounts, moderation, operations console
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS ban_reason TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS ban_until TIMESTAMPTZ`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'guest'`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS google_sub TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS apple_sub TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS note TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS tv INT DEFAULT 0`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS platform TEXT`,
  `UPDATE users SET provider='email' WHERE email IS NOT NULL AND google_sub IS NULL AND apple_sub IS NULL AND (provider IS NULL OR provider='guest')`,
  `CREATE UNIQUE INDEX IF NOT EXISTS users_google_idx ON users (google_sub) WHERE google_sub IS NOT NULL`,
  `CREATE UNIQUE INDEX IF NOT EXISTS users_apple_idx ON users (apple_sub) WHERE apple_sub IS NOT NULL`,
  `CREATE INDEX IF NOT EXISTS users_created_idx ON users (created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS ledger_user_idx ON ledger (user_id, id DESC)`,
  `ALTER TABLE works ADD COLUMN IF NOT EXISTS reject_reason TEXT`,
  `ALTER TABLE works ADD COLUMN IF NOT EXISTS reviewed_by TEXT`,
  `ALTER TABLE works ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ`,
  `ALTER TABLE works ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false`,
  `ALTER TABLE assets ADD COLUMN IF NOT EXISTS reject_reason TEXT`,
  `ALTER TABLE assets ADD COLUMN IF NOT EXISTS reviewed_by TEXT`,
  `ALTER TABLE assets ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ`,
  `ALTER TABLE reports ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open'`,
  `ALTER TABLE reports ADD COLUMN IF NOT EXISTS handled_by TEXT`,
  `ALTER TABLE reports ADD COLUMN IF NOT EXISTS handled_at TIMESTAMPTZ`,
  `ALTER TABLE reports ADD COLUMN IF NOT EXISTS note TEXT`,
  `CREATE TABLE IF NOT EXISTS user_days (user_id TEXT, day DATE, PRIMARY KEY (user_id, day))`,
  `CREATE INDEX IF NOT EXISTS user_days_day_idx ON user_days (day)`,
  `CREATE TABLE IF NOT EXISTS admins (id TEXT PRIMARY KEY, username TEXT UNIQUE, pass TEXT, name TEXT, role TEXT DEFAULT 'reviewer', status TEXT DEFAULT 'active', tv INT DEFAULT 0, created_by TEXT, created_at TIMESTAMPTZ DEFAULT now(), last_login TIMESTAMPTZ)`,
  `CREATE TABLE IF NOT EXISTS audit_log (id BIGSERIAL PRIMARY KEY, admin_id TEXT, admin_name TEXT, action TEXT, target_kind TEXT, target_id TEXT, detail JSONB, ip TEXT, at TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value JSONB, updated_by TEXT, updated_at TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS reset_codes (email TEXT PRIMARY KEY, code TEXT, exp TIMESTAMPTZ, tries INT DEFAULT 0)`,
  `CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, user_id TEXT, sku TEXT, platform TEXT, gems INT, price_cents INT, currency TEXT, status TEXT, test BOOLEAN DEFAULT false, receipt TEXT, refunded_by TEXT, at TIMESTAMPTZ DEFAULT now())`,
  `CREATE INDEX IF NOT EXISTS orders_user_idx ON orders (user_id, at DESC)`,
  `CREATE TABLE IF NOT EXISTS notices (id BIGSERIAL PRIMARY KEY, title TEXT, body TEXT, lang TEXT DEFAULT 'all', kind TEXT DEFAULT 'banner', active BOOLEAN DEFAULT true, starts_at TIMESTAMPTZ, ends_at TIMESTAMPTZ, created_by TEXT, created_at TIMESTAMPTZ DEFAULT now())`,
];
async function db() {
  if (!hasDb()) { const e = new Error('database not configured'); e.code = 503; throw e; }
  const sql = sqlFn();
  if (!_ready) _ready = (async () => { for (const s of SCHEMA) await sql(s); })().catch(e => { _ready = null; throw e; });
  await _ready;
  return sql;
}

/* ---------- auth ---------- */
function secret() { return process.env.AUTH_SECRET || process.env.LONGCAT_API_KEY || 'miru-dev-secret-change-me'; }
const b64u = b => Buffer.from(b).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
function sign(payload) {
  const body = b64u(JSON.stringify(payload));
  const mac = b64u(crypto.createHmac('sha256', secret()).update(body).digest());
  return body + '.' + mac;
}
function verify(tok) {
  if (!tok || tok.indexOf('.') < 0) return null;
  const [body, mac] = tok.split('.');
  const exp = b64u(crypto.createHmac('sha256', secret()).update(body).digest());
  if (mac.length !== exp.length || !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(exp))) return null;
  try { const p = JSON.parse(Buffer.from(body.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()); if (p.exp && p.exp < Date.now()) return null; return p; } catch { return null; }
}
function tokenFor(uid, role, tv) { return sign({ uid, role: role || 'user', tv: tv || 0, iat: Date.now(), exp: Date.now() + 365 * 864e5 }); }
function who(req) { const h = req.headers.authorization || ''; return verify(h.replace(/^Bearer\s+/i, '')); }
function needUser(req, res) { const u = who(req); if (!u) { bad(res, 'not signed in', 401); return null; } return u; }
function hashPass(pw, salt) { salt = salt || crypto.randomBytes(16).toString('hex'); const h = crypto.scryptSync(String(pw), salt, 32).toString('hex'); return salt + ':' + h; }
function checkPass(pw, stored) { if (!stored) return false; const [salt] = stored.split(':'); const a = Buffer.from(hashPass(pw, salt)), b = Buffer.from(stored); return a.length === b.length && crypto.timingSafeEqual(a, b); }
const newId = p => (p || '') + Date.now().toString(36) + crypto.randomBytes(5).toString('hex');
function isAdmin(req) { const k = req.headers['x-admin-key']; return !!(process.env.ADMIN_KEY && k && k === process.env.ADMIN_KEY); }

/* ---------- limits ---------- */
async function bump(uid, kind, max) {
  const sql = await db();
  const r = await sql(`INSERT INTO usage (user_id, day, kind, n) VALUES ($1, CURRENT_DATE, $2, 1) ON CONFLICT (user_id, day, kind) DO UPDATE SET n = usage.n + 1 RETURNING n`, [uid, kind]);
  return (r[0] && r[0].n) <= max;
}

/* ---------- content safety (mirrors the client QA hard rules) ---------- */
const EXPLICIT = ['性器', '勃起', '插入', '抽插', '内裤', '下身', 'erection', 'crotch', 'groin', 'penetrat', 'genital', 'naked body', 'nipple'];
const MINOR = /(未成年|初中生|小学生|中学生|高中生|(?:^|[^\d])1[0-7]\s*岁|十[一二三四五六七]岁|underage|\b1[0-7]\s*(?:yo|years? old)|high school(?:er)? student)/i;
function textOf(x) { let s = ''; const w = v => { if (v == null) return; if (typeof v === 'string') { s += v + '\n'; return; } if (Array.isArray(v)) { v.forEach(w); return; } if (typeof v === 'object') Object.values(v).forEach(w); }; w(x); return s; }
function safety(obj) {
  const t = textOf(obj), out = [];
  const t2 = t.replace(/鼓起(勇气|腮|掌|嘴)/g, '').replace(/(青筋|血管|脸颊|肌肉)[^。，,.]{0,8}鼓起/g, '');
  const ex = EXPLICIT.filter(w => t2.toLowerCase().includes(w));
  if (ex.length) out.push('explicit: ' + ex.slice(0, 3).join(', '));
  const rx = new RegExp(MINOR.source, 'gi'); let m;
  while ((m = rx.exec(t))) { const win = t.slice(Math.max(0, m.index - 30), m.index + m[0].length + 30); if (/(那年|小时候|当年|years ago|when (?:i|we|he) was)/i.test(win)) continue; if (/(亲吻|接吻|恋爱|暧昧|心动|上床|kiss|dating|crush on|in love)/i.test(win)) { out.push('minor in a romance'); break; } }
  return out;
}
function structureQA(pack) {
  const err = [], warn = [];
  if (!pack || !Array.isArray(pack.chapters) || !pack.chapters.length) err.push('no chapters');
  else pack.chapters.forEach((c, i) => {
    const beats = c.beats && (c.beats.zh || c.beats.en || c.beats) || [];
    if (!Array.isArray(beats) || beats.length < 3) warn.push('chapter ' + (i + 1) + ' is very short');
    if (!Array.isArray(c.choices) || c.choices.length < 1) warn.push('chapter ' + (i + 1) + ' has no choices');
    if ((c.choices || []).some(x => x.need) && !(c.choices || []).some(x => !x.need)) err.push('chapter ' + (i + 1) + ': every option needs an item');
  });
  return { err, warn };
}

/* ---------- LLM (LongCat, same key as the chat proxy) ---------- */
async function llm(messages, maxTokens) {
  const key = process.env.LONGCAT_API_KEY;
  if (!key) throw new Error('LONGCAT_API_KEY missing');
  const r = await fetch('https://api.longcat.chat/openai/v1/chat/completions', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
    body: JSON.stringify({ model: 'LongCat-2.0', messages, max_tokens: maxTokens || 2000, temperature: 0.3, thinking: { type: 'disabled' } }),
  });
  if (!r.ok) throw new Error('llm ' + r.status);
  const j = await r.json();
  return (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '';
}

/* ---------- blob ---------- */
function hasBlob() { return !!process.env.BLOB_READ_WRITE_TOKEN; }
async function blobPut(path, buf, contentType) { const { put } = require('@vercel/blob'); const r = await put(path, buf, { access: 'public', contentType, addRandomSuffix: true }); return r.url; }
async function blobDel(url) { try { const { del } = require('@vercel/blob'); await del(url); } catch (_) {} }

async function readBody(req) {
  if (req.body && Buffer.isBuffer(req.body)) return req.body;
  return await new Promise((ok, no) => { const chunks = []; req.on('data', c => chunks.push(c)); req.on('end', () => ok(Buffer.concat(chunks))); req.on('error', no); });
}
function jsonBody(req) { if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body; try { return JSON.parse(req.body || '{}'); } catch { return {}; } }
function wrap(fn) { return async (req, res) => { try { await fn(req, res); } catch (e) { send(res, e.code === 503 ? 503 : 500, { error: String(e && e.message || e).slice(0, 300) }); } }; }

/* ---------- v2.7: active-account check (bans, signed-out sessions, daily actives) ---------- */
const _seen = new Set();
async function needActive(req, res) {
  const u = needUser(req, res); if (!u) return null;
  if (u.adm) { bad(res, 'admin token', 401); return null; }
  const sql = await db();
  const r = await sql('SELECT status, ban_until, ban_reason, tv FROM users WHERE id=$1', [u.uid]);
  const x = r[0];
  if (!x) { bad(res, 'account not found', 401); return null; }
  if (x.status === 'deleted') { bad(res, 'account deleted', 401); return null; }
  if (x.status === 'banned' && (!x.ban_until || new Date(x.ban_until) > new Date())) { send(res, 403, { error: 'banned', reason: x.ban_reason || '', until: x.ban_until }); return null; }
  if ((x.tv || 0) !== (u.tv || 0)) { bad(res, 'session expired — please sign in again', 401); return null; }
  const day = new Date().toISOString().slice(0, 10), k = u.uid + day;
  if (!_seen.has(k)) { _seen.add(k); if (_seen.size > 50000) _seen.clear(); await sql('INSERT INTO user_days (user_id, day) VALUES ($1, CURRENT_DATE) ON CONFLICT DO NOTHING', [u.uid]); await sql('UPDATE users SET last_seen=now() WHERE id=$1', [u.uid]); }
  return u;
}

/* ---------- v2.7: operations config (editable in the console; defaults below) ---------- */
const CONFIG_DEFAULTS = {
  welcome_gems: 30, daily_gems: 3, earn_cap: 80, first_purchase_double: true,
  upload_price: { audio: 5, image: 3, video: 10, game: 2 }, reroll_free: 3, reroll_price: 1,
  community_auto_live: true, report_threshold: 5, publish_daily_limit: 30, upload_daily_limit: 40,
  guest_allowed: true, maintenance: '',
  skus: { gems_10: { gems: 10, usd: 199 }, gems_60: { gems: 60, usd: 999 }, gems_150: { gems: 150, usd: 1999 }, gems_400: { gems: 400, usd: 4999 }, plus_month: { gems: 20, usd: 999 } },
};
let _cfg = null, _cfgAt = 0;
async function config() {
  if (_cfg && Date.now() - _cfgAt < 30000) return _cfg;
  const sql = await db(); const r = await sql('SELECT key, value FROM config');
  const c = JSON.parse(JSON.stringify(CONFIG_DEFAULTS)); r.forEach(x => { c[x.key] = x.value; });
  _cfg = c; _cfgAt = Date.now(); return c;
}
function configReset() { _cfg = null; }

/* ---------- v2.7: operations console accounts ---------- */
const ROLES = {
  owner: ['*'],
  admin: ['dashboard', 'users', 'users.write', 'gems', 'works', 'assets', 'reports', 'orders', 'ledger', 'i18n', 'config', 'notices', 'audit', 'events'],
  reviewer: ['dashboard', 'works', 'assets', 'reports', 'users'],
  support: ['dashboard', 'users', 'users.write', 'gems', 'orders', 'ledger', 'reports'],
  analyst: ['dashboard', 'events', 'orders', 'users'],
};
function can(role, perm) { const p = ROLES[role] || []; return p.includes('*') || p.includes(perm); }
function adminToken(a) { return sign({ aid: a.id, role: a.role, adm: 1, tv: a.tv || 0, iat: Date.now(), exp: Date.now() + 12 * 3600e3 }); }
async function whoAdmin(req) {
  if (isAdmin(req)) return { id: 'key', name: 'ADMIN_KEY', username: 'key', role: 'owner' };
  const h = req.headers.authorization || ''; const p = verify(h.replace(/^Bearer\s+/i, ''));
  if (!p || !p.adm) return null;
  const sql = await db(); const r = await sql('SELECT id, username, name, role, status, tv FROM admins WHERE id=$1', [p.aid]);
  const a = r[0]; if (!a || a.status !== 'active' || (a.tv || 0) !== (p.tv || 0)) return null;
  return a;
}
function ip(req) { return String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || ''; }
async function audit(sql, a, action, kind, id, detail, req) {
  try { await sql('INSERT INTO audit_log (admin_id, admin_name, action, target_kind, target_id, detail, ip) VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7)', [a.id, a.name || a.username, action, kind || null, id == null ? null : String(id), JSON.stringify(detail || {}), req ? ip(req) : null]); } catch (_) {}
}

/* ---------- v2.7: email (password reset). Uses Resend when RESEND_API_KEY + MAIL_FROM are set. ---------- */
function hasMail() { return !!(process.env.RESEND_API_KEY && process.env.MAIL_FROM); }
async function sendMail(to, subject, html) {
  if (!hasMail()) return false;
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.RESEND_API_KEY }, body: JSON.stringify({ from: process.env.MAIL_FROM, to: [to], subject, html }) });
  return r.ok;
}

/* ---------- v2.7: Sign in with Google / Apple (ID-token verification on the server) ---------- */
const list = v => String(v || '').split(',').map(s => s.trim()).filter(Boolean);
function oauthConfig() { return { google: list(process.env.GOOGLE_CLIENT_ID)[0] || '', apple: list(process.env.APPLE_CLIENT_ID)[0] || '' }; }
async function verifyGoogle(idToken) {
  const ids = list(process.env.GOOGLE_CLIENT_ID); if (!ids.length) throw new Error('Google sign-in is not configured');
  const r = await fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken));
  if (!r.ok) throw new Error('invalid Google token');
  const p = await r.json();
  if (!ids.includes(p.aud)) throw new Error('Google token for another app');
  if (!/^(https:\/\/)?accounts\.google\.com$/.test(p.iss || '')) throw new Error('bad issuer');
  if (Number(p.exp) * 1000 < Date.now()) throw new Error('Google token expired');
  return { sub: p.sub, email: p.email_verified === 'true' || p.email_verified === true ? String(p.email || '').toLowerCase() : null, name: p.name || null, avatar: p.picture || null };
}
let _appleKeys = null, _appleAt = 0;
async function verifyApple(idToken) {
  const ids = list(process.env.APPLE_CLIENT_ID); if (!ids.length) throw new Error('Apple sign-in is not configured');
  const [h64, p64, s64] = String(idToken).split('.'); if (!s64) throw new Error('invalid Apple token');
  const dec = x => Buffer.from(x.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  const head = JSON.parse(dec(h64).toString()), p = JSON.parse(dec(p64).toString());
  if (!_appleKeys || Date.now() - _appleAt > 6 * 3600e3) { const r = await fetch('https://appleid.apple.com/auth/keys'); _appleKeys = (await r.json()).keys; _appleAt = Date.now(); }
  const jwk = _appleKeys.find(k => k.kid === head.kid); if (!jwk) throw new Error('unknown Apple key');
  const ok = crypto.verify('RSA-SHA256', Buffer.from(h64 + '.' + p64), crypto.createPublicKey({ key: jwk, format: 'jwk' }), dec(s64));
  if (!ok) throw new Error('bad Apple signature');
  if (p.iss !== 'https://appleid.apple.com') throw new Error('bad issuer');
  if (!ids.includes(p.aud)) throw new Error('Apple token for another app');
  if (p.exp * 1000 < Date.now()) throw new Error('Apple token expired');
  return { sub: p.sub, email: p.email && (p.email_verified === true || p.email_verified === 'true') ? String(p.email).toLowerCase() : null, name: null, avatar: null };
}

module.exports = { needActive, config, configReset, CONFIG_DEFAULTS, ROLES, can, adminToken, whoAdmin, audit, ip, hasMail, sendMail, oauthConfig, verifyGoogle, verifyApple, verify, cors, send, bad, db, hasDb, who, needUser, tokenFor, hashPass, checkPass, newId, isAdmin, bump, safety, structureQA, llm, hasBlob, blobPut, blobDel, readBody, jsonBody, wrap, crypto };
