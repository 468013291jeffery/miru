// MIRU backend · shared helpers (not a route: Vercel ignores files starting with "_")
// Storage: Postgres (Neon via the Vercel integration → DATABASE_URL / POSTGRES_URL) + Vercel Blob (BLOB_READ_WRITE_TOKEN).
// Auth: signed bearer tokens (HMAC-SHA256 with AUTH_SECRET). Guest accounts are created silently; email+password upgrades them.
const crypto = require('crypto');

const ALLOWED = [/^https:\/\/(?:www\.)?miru\.plus$/, /^https:\/\/468013291jeffery\.github\.io$/, /^https:\/\/[a-z0-9-]+\.vercel\.app$/, /^http:\/\/localhost(:\d+)?$/, /^http:\/\/127\.0\.0\.1(:\d+)?$/, /^null$/];
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
  // 事件幂等（2026-10-25）：可选 key 列 + 部分唯一索引。老库靠这两句自动补齐，不需要手工迁移。
  `ALTER TABLE events ADD COLUMN IF NOT EXISTS key TEXT`,
  `CREATE UNIQUE INDEX IF NOT EXISTS events_key_idx ON events (key)`,
  // v2.7 — accounts, moderation, operations console
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS ban_reason TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS ban_until TIMESTAMPTZ`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'guest'`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS google_sub TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS apple_sub TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT`,
  `CREATE UNIQUE INDEX IF NOT EXISTS users_phone_idx ON users (phone) WHERE phone IS NOT NULL`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS note TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS tv INT DEFAULT 0`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS adult_verified_at TIMESTAMPTZ`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS adult_verified_by TEXT`,
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
  `CREATE TABLE IF NOT EXISTS memories (user_id TEXT, id TEXT, thread_id TEXT, cast_ids JSONB DEFAULT '[]'::jsonb, type TEXT, text TEXT, who JSONB DEFAULT '[]'::jsonb, imp INT DEFAULT 2, src TEXT, pin BOOLEAN DEFAULT false, hush BOOLEAN DEFAULT false, created_ms BIGINT, emb REAL[], emb_model TEXT, updated_at TIMESTAMPTZ DEFAULT now(), PRIMARY KEY (user_id, id))`,
  `CREATE INDEX IF NOT EXISTS memories_thread_idx ON memories (user_id, thread_id)`,
  `CREATE TABLE IF NOT EXISTS scripts (id TEXT PRIMARY KEY, title TEXT, orient TEXT DEFAULT 'bl', lang TEXT DEFAULT 'zh', stage INT DEFAULT 1, status TEXT DEFAULT 'draft', config JSONB DEFAULT '{}'::jsonb, research JSONB, brief TEXT, outline TEXT, chapters JSONB DEFAULT '[]'::jsonb, qa JSONB, review JSONB DEFAULT '{}'::jsonb, work_id TEXT, created_by TEXT, updated_by TEXT, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now(), published_at TIMESTAMPTZ)`,
  `CREATE TABLE IF NOT EXISTS script_versions (id BIGSERIAL PRIMARY KEY, script_id TEXT, stage INT, note TEXT, data JSONB, by_name TEXT, at TIMESTAMPTZ DEFAULT now())`,
  `CREATE INDEX IF NOT EXISTS script_versions_idx ON script_versions (script_id, id DESC)`,
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

/* token 记账（2026-10-25）：沿用上面这张 usage 表，只是把 n 累加实际用量而不是次数。
   规范第 10 章要的是"每轮用了多少 token"，这里就是那个口子 —— 已经接进 /api/longcat，
   用的是 provider 返回的 usage 字段（流式要 provider 在最后一帧带 usage 才有；没有就不记，不编数）。
   读法：SELECT kind, sum(n) FROM usage WHERE day = CURRENT_DATE GROUP BY kind。 */
async function addUsage(uid, kind, n) {
  const v = Math.round(Number(n) || 0);
  if (!uid || !v || v < 0) return false;
  try {
    const sql = await db();
    await sql(`INSERT INTO usage (user_id, day, kind, n) VALUES ($1, CURRENT_DATE, $2, $3)
               ON CONFLICT (user_id, day, kind) DO UPDATE SET n = usage.n + EXCLUDED.n`, [uid, kind, v]);
    return true;
  } catch (_) { return false }
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
/* ---------- server-side model calls: same failover order as /api/longcat (LongCat → SCNet → GLM) ---------- */
function chatProviders(order) {
  const E = process.env, all = {
    deepseek: E.DEEPSEEK_API_KEY && { url: (E.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/+$/, '') + '/chat/completions', key: E.DEEPSEEK_API_KEY, model: E.DEEPSEEK_MODEL || 'deepseek-chat', nothink: true },
    longcat: E.LONGCAT_API_KEY && { url: 'https://api.longcat.chat/openai/v1/chat/completions', key: E.LONGCAT_API_KEY, model: 'LongCat-2.0' },
    scnet: E.SCNET_API_KEY && { url: (E.SCNET_BASE_URL || 'https://api.scnet.cn/api/llm/v1').replace(/\/+$/, '') + '/chat/completions', key: E.SCNET_API_KEY, model: E.SCNET_MODEL || 'DeepSeek-V4.1-Flash' },
    glm: E.GLM_API_KEY && { url: (E.GLM_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4').replace(/\/+$/, '') + '/chat/completions', key: E.GLM_API_KEY, model: E.GLM_MODEL || 'glm-4.5-flash' },
  };
  return String(order || E.LLM_ORDER || 'deepseek,scnet,longcat,glm').split(',').map(k => all[k.trim()]).filter(Boolean);
}
async function llm(messages, maxTokens, timeoutMs, order, temperature) {
  const list = chatProviders(order); if (!list.length) throw new Error('no LLM key configured');
  let last;
  for (const p of list) {
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), timeoutMs || 25000);
    try {
      const r = await fetch(p.url, { method: 'POST', signal: ctl.signal, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + p.key }, body: JSON.stringify(Object.assign({ model: p.model, messages, max_tokens: maxTokens || 2000, temperature: temperature == null ? 0.3 : temperature }, p.nothink ? {} : { thinking: { type: 'disabled' } })) });
      if (!r.ok) throw new Error('llm ' + r.status);
      const j = await r.json(); const c = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '';
      if (c.trim()) return c;
      throw new Error('empty');
    } catch (e) { last = e; } finally { clearTimeout(t); }
  }
  throw last || new Error('llm failed');
}
/* ---------- embeddings (for memory recall). Paid on both providers; when none works we return null and callers fall back to model reranking. ---------- */
let _embDown = 0;
function embedProviders() {
  const E = process.env, all = {
    openai: E.OPENAI_API_KEY && { id: 'openai', url: (E.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '') + '/embeddings', key: E.OPENAI_API_KEY, model: E.OPENAI_EMBED_MODEL || 'text-embedding-3-small' },
    scnet: E.SCNET_API_KEY && { id: 'scnet', url: (E.SCNET_BASE_URL || 'https://api.scnet.cn/api/llm/v1').replace(/\/+$/, '') + '/embeddings', key: E.SCNET_API_KEY, model: E.SCNET_EMBED_MODEL || 'Qwen3-Embedding-8B' },
    glm: E.GLM_API_KEY && { id: 'glm', url: (E.GLM_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4').replace(/\/+$/, '') + '/embeddings', key: E.GLM_API_KEY, model: E.GLM_EMBED_MODEL || 'embedding-3' },
  };
  return String(E.EMBED_ORDER || 'openai,scnet,glm').split(',').map(k => all[k.trim()]).filter(Boolean);
}
let _embLast = null; // model id of the last successful embedding call
function embedPreferred() { const p = embedProviders()[0]; return p ? p.id + ':' + p.model : null; }
async function embed(texts) {
  if (!texts.length || Date.now() < _embDown) return null;
  for (const p of embedProviders()) {
    try {
      const r = await fetch(p.url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + p.key }, body: JSON.stringify({ model: p.model, input: texts.map(t => String(t).slice(0, 1000)) }) });
      if (!r.ok) continue;
      const j = await r.json(); const v = (j.data || []).sort((a, b) => (a.index || 0) - (b.index || 0)).map(d => d.embedding);
      if (v.length === texts.length && v[0] && v[0].length) { _embLast = p.id + ':' + p.model; return { model: _embLast, vecs: v }; }
    } catch (_) {}
  }
  _embDown = Date.now() + 10 * 60e3; // none available: don't retry for 10 minutes
  return null;
}
function cosine(a, b) { let d = 0, x = 0, y = 0; const n = Math.min(a.length, b.length); for (let i = 0; i < n; i++) { d += a[i] * b[i]; x += a[i] * a[i]; y += b[i] * b[i]; } return x && y ? d / Math.sqrt(x * y) : 0; }

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
  welcome_gems: 10000, daily_gems: 3, earn_cap: 80, first_purchase_double: true,
  upload_price: { audio: 5, image: 3, video: 10, game: 2 }, reroll_free: 3, reroll_price: 1,
  community_auto_live: true, report_threshold: 5, publish_daily_limit: 30, upload_daily_limit: 40,
  guest_allowed: false, maintenance: '',
  // 成人露骨作品门槛（2026-10-30）：总开关默认关；地区白名单默认空 = 哪里都不开放。
  // 白名单写国家码（"FR"）或 国家-州（"US-CA"），由法务确定后在后台「配置」里填。
  adult_enabled: false, adult_regions: [],
  // 测试期：名单写 "*" = 不限地区；adult_self_verify=true = 用户自己确认年满 18 岁即可（正式上线前换成第三方核验）
  adult_self_verify: false,
  // 容量/超时类（原来写死在各自文件里，挪进来才能不改代码就调）
  state_max_kb: 900, max_pack_kb: 1500, first_token_ms: 22000,
  skus: { gems_5: { gems: 5, usd: 99 }, gems_16: { gems: 16, usd: 299 }, gems_28: { gems: 28, usd: 499 }, gems_60: { gems: 60, usd: 999 }, gems_125: { gems: 125, usd: 1999 }, gems_330: { gems: 330, usd: 4999 }, gems_700: { gems: 700, usd: 9999 } },
  /* 语音 API：地址 / 密钥 / 模型存在这儿就能在后台改，不用去动 Vercel 的环境变量。
     协议目前只认 OpenAI 兼容的 POST <url>/v1/audio/speech（CosyVoice / IndexTTS / GPT-SoVITS / 官方 OpenAI 都是这个形状）。
     url 为空 = 回到原来的行为（TTS_URL 环境变量 → HF Space 兜底）；key 有值才覆盖 TTS_KEY，后台不回显明文。 */
  tts: { protocol: 'openai', url: '', key: '', model: '', voice: '' },
  /* 创作中心那 5 个 AI 步骤 —— 以前每句 prompt 都写死在 source/src/app50_creator2.js 里，改一句要重建 9 MB 产物。
     现在它们住在这儿（config 表 key=studio），执行在 api/studio.js，后台「API 台」可直接改；config 缓存 30 秒，改完最迟 30 秒生效。
     模板里 {{名字}} 由请求 payload 填（step / answers / project / question / current / previous / genre / context / text / optionsText）。 */
  studio: {
    sys: "You are MIRU's story editor, helping an author build an interactive romance drama (all characters are fictional adults 21+, no explicit sexual content, no real people, no copyrighted characters). Write in Simplified Chinese.",
    order: '', max_tokens: 1200, temp: 0.7,
    tasks: {
      'guide-turn': { name: '引导 · 回话', on: true, role: 'architect', prompt: 'The author is on step {{step}} of a guided setup. Their answers so far: {{answers}}\nCurrent project: {{project}}\nGive ONE short, specific reaction to their latest answer and one concrete idea that would make the story stronger (max 70 Chinese characters, warm, no praise filler). JSON {"feedback":""}' },
      'plan': { name: '生成故事大纲', on: true, role: 'architect', prompt: 'Turn the author\'s answers into a sharp story plan. Answers: {{answers}}\nCurrent draft: {{project}}\nKeep the author\'s names and choices; make it specific (place, object, secret, stakes). JSON {"project":{"title":"≤14字","premise":"一句话梗概","hook":"开场：用他的一个具体行为展示吸引力和他对你的态度，并给你一个马上能回应的点（冲突按题材安排，不必一开场就吵）","conflict":"","world":"具体地点和时间","vibe":"","ending":"","lead":{"name":"","role":"","personality":"","goal":"","boundary":""}}}' },
      'options': { name: '给作者出选项', on: true, role: 'architect', prompt: 'The author is answering: {{question}}\nCurrent options (replace them with a NEW, clearly different set): {{current}}\nTheir story so far: {{previous}}\nGive 6 short options in Simplified Chinese (each under 18 characters), concrete and varied, fitting their story, original (no famous works). JSON {"options":["",...]}' },
      'rewrite': { name: '改写一句', on: true, role: 'scene', prompt: 'Rewrite this line so it is more vivid and specific, same meaning, same length or shorter. Genre: {{genre}}. Context: {{context}}\nLine: {{text}}\nJSON {"text":""}' },
      'step-suggest': { name: '建议这一步怎么答', on: true, role: 'architect', prompt: 'Question for the author: {{question}}\nTheir story so far: {{previous}}\n{{optionsText}}' },
    },
  },
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
  admin: ['dashboard', 'users', 'users.write', 'gems', 'works', 'scripts', 'assets', 'reports', 'orders', 'ledger', 'i18n', 'config', 'notices', 'audit', 'events'],
  reviewer: ['dashboard', 'works', 'assets', 'reports', 'users', 'scripts'],
  writer: ['scripts'],
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

/* ---------- email (verification codes) ----------
   Amazon SES (preferred): AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY (an IAM user allowed ses:SendEmail), AWS_REGION / SES_REGION
   (default us-east-1), MAIL_FROM = a verified sender, e.g. "MIRU <no-reply@yourdomain.com>". Signed with SigV4 — no SDK needed.
   Resend still works as a fallback (RESEND_API_KEY + MAIL_FROM). */
const sesKey = () => process.env.SES_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID, sesSecret = () => process.env.SES_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
function hasSES() { return !!(sesKey() && sesSecret() && process.env.MAIL_FROM); }
/* Brevo (BREVO_API_KEY + a sender verified in Brevo: MAIL_FROM or BREVO_SENDER) is tried first when set — no sandbox. */
function hasBrevoMail() { return !!(process.env.BREVO_API_KEY && (process.env.BREVO_SENDER || process.env.MAIL_FROM)); }
function hasMail() { return hasBrevoMail() || hasSES() || !!(process.env.RESEND_API_KEY && process.env.MAIL_FROM); }
function parseFrom(f) { const m = /^\s*(.*?)\s*<([^>]+)>\s*$/.exec(String(f || '')); return m ? { name: m[1].replace(/^"|"$/g, '') || 'MIRU', email: m[2] } : { name: 'MIRU', email: String(f || '').trim() }; }
async function sendBrevoMail(to, subject, html, text) {
  const r = await fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST', headers: { 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ sender: parseFrom(process.env.BREVO_SENDER || process.env.MAIL_FROM), to: [{ email: to }], subject, htmlContent: html, textContent: text || subject, tags: ['miru-code'] }) });
  const t = await r.text(); MAIL_LAST = 'brevo ' + r.status + ' ' + t.slice(0, 300); return r.ok;
}
function sigv4(method, host, path, region, service, body, key, secret, extra, ctype) {
  const now = new Date(), amz = now.toISOString().replace(/[:-]|\.\d{3}/g, ''), day = amz.slice(0, 8);
  const H = (d, enc) => crypto.createHash('sha256').update(d, 'utf8').digest(enc || 'hex'), M = (k, d) => crypto.createHmac('sha256', k).update(d, 'utf8').digest();
  const hd = Object.assign({ 'content-type': ctype || 'application/json', host, 'x-amz-date': amz }, Object.fromEntries(Object.entries(extra || {}).map(([k, v]) => [k.toLowerCase(), v])));
  const names = Object.keys(hd).sort(), signed = names.join(';');
  const canon = [method, path, '', ...names.map(k => k + ':' + String(hd[k]).trim()), '', signed, H(body)].join('\n');
  const scope = day + '/' + region + '/' + service + '/aws4_request', sts = ['AWS4-HMAC-SHA256', amz, scope, H(canon)].join('\n');
  const kS = M(M(M(M('AWS4' + secret, day), region), service), 'aws4_request'), sig = crypto.createHmac('sha256', kS).update(sts, 'utf8').digest('hex');
  const out = { 'Content-Type': hd['content-type'], 'X-Amz-Date': amz, Authorization: 'AWS4-HMAC-SHA256 Credential=' + key + '/' + scope + ', SignedHeaders=' + signed + ', Signature=' + sig };
  Object.keys(extra || {}).forEach(k => { out[k] = extra[k]; }); return out;
}
/* ---------- phone sign-in via Firebase Authentication (Google sends the SMS; no US carrier registration on our side) ----------
   FIREBASE_PROJECT_ID, FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN (all public web-config values). The page does the SMS + code
   with the Firebase SDK and sends us the Firebase ID token; we verify its RS256 signature against Google's public certs. */
let FB_CERTS = null, FB_EXP = 0;
function firebaseConfig() { const id = process.env.FIREBASE_PROJECT_ID; if (!id || !process.env.FIREBASE_API_KEY) return null; return { apiKey: process.env.FIREBASE_API_KEY, authDomain: process.env.FIREBASE_AUTH_DOMAIN || (id + '.firebaseapp.com'), projectId: id }; }
async function fbCerts() {
  if (FB_CERTS && Date.now() < FB_EXP) return FB_CERTS;
  const r = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
  if (!r.ok) throw new Error('firebase certs ' + r.status);
  const m = /max-age=(\d+)/.exec(r.headers.get('cache-control') || ''); FB_EXP = Date.now() + (m ? +m[1] * 1000 : 3600e3); FB_CERTS = await r.json(); return FB_CERTS;
}
async function verifyFirebase(idToken) {
  const cfg = firebaseConfig(); if (!cfg) throw new Error('phone sign-in is not configured');
  const parts = String(idToken || '').split('.'); if (parts.length !== 3) throw new Error('bad token');
  const dec = x => JSON.parse(Buffer.from(x.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
  const h = dec(parts[0]), p = dec(parts[1]);
  if (h.alg !== 'RS256') throw new Error('bad token alg');
  const certs = await fbCerts(); const pem = certs[h.kid]; if (!pem) throw new Error('unknown token key');
  const ok = crypto.createVerify('RSA-SHA256').update(parts[0] + '.' + parts[1]).verify(pem, Buffer.from(parts[2].replace(/-/g, '+').replace(/_/g, '/'), 'base64'));
  if (!ok) throw new Error('bad token signature');
  const now = Math.floor(Date.now() / 1000);
  if (p.aud !== cfg.projectId || p.iss !== 'https://securetoken.google.com/' + cfg.projectId) throw new Error('token for another project');
  if (!(p.exp > now) || !(p.iat <= now + 60) || !p.sub) throw new Error('token expired');
  if (!p.phone_number) throw new Error('no phone number in token');
  return { uid: p.sub, phone: p.phone_number };
}

/* ---------- SMS codes: AWS End User Messaging SMS (PinpointSMSVoiceV2.SendTextMessage) ----------
   Uses the same AWS keys as SES (the IAM user also needs sms-voice:SendTextMessage). SMS_ORIGINATION = the registered
   toll-free number (+1833…) or its ARN / phone-number id; SMS_REGION (default AWS_REGION / us-east-1).
   Optional SMS_CONFIG_SET. Until a number is registered, AWS only delivers to verified destination numbers (sandbox). */
let SMS_LAST = null;
/* Brevo SMS (BREVO_API_KEY + BREVO_SMS_SENDER, ≤11 letters, e.g. MIRU). US/Canada numbers need Brevo toll-free registration first. */
function hasBrevoSMS() { return !!(process.env.BREVO_API_KEY && process.env.BREVO_SMS_SENDER); }
function hasSMS() { return hasBrevoSMS() || !!(sesKey() && sesSecret() && process.env.SMS_ORIGINATION); }
async function sendBrevoSMS(to, text) {
  const r = await fetch('https://api.brevo.com/v3/transactionalSMS/send', { method: 'POST', headers: { 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ sender: String(process.env.BREVO_SMS_SENDER).slice(0, 11), recipient: String(to).replace(/^\+/, ''), content: String(text).replace(/\s*Reply STOP to opt out\.?/i, ''), type: 'transactional', tag: 'miru-code' }) });
  const t = await r.text(); SMS_LAST = 'brevo ' + r.status + ' ' + t.slice(0, 300); return r.ok;
}
async function sendSMS(to, text) {
  if (!hasSMS()) return false;
  if (hasBrevoSMS()) { try { if (await sendBrevoSMS(to, text)) return true; } catch (e) { SMS_LAST = 'brevo ' + String(e.message || e).slice(0, 200); } if (!(sesKey() && process.env.SMS_ORIGINATION)) return false; }
  const region = process.env.SMS_REGION || process.env.AWS_REGION || 'us-east-1', host = 'sms-voice.' + region + '.amazonaws.com';
  const body = JSON.stringify(Object.assign({ DestinationPhoneNumber: to, MessageBody: text, MessageType: 'TRANSACTIONAL', OriginationIdentity: process.env.SMS_ORIGINATION },
    process.env.SMS_CONFIG_SET ? { ConfigurationSetName: process.env.SMS_CONFIG_SET } : {}));
  try {
    const r = await fetch('https://' + host + '/', { method: 'POST', headers: sigv4('POST', host, '/', region, 'sms-voice', body, sesKey(), sesSecret(), { 'X-Amz-Target': 'PinpointSMSVoiceV2.SendTextMessage' }, 'application/x-amz-json-1.0'), body });
    const t = await r.text(); SMS_LAST = 'sms ' + r.status + ' ' + t.slice(0, 300); return r.ok;
  } catch (e) { SMS_LAST = 'sms ' + String(e.message || e).slice(0, 200); return false; }
}
const smsLast = () => SMS_LAST;
let MAIL_LAST = null;
async function sendSES(to, subject, html, text) {
  const region = process.env.SES_REGION || process.env.AWS_REGION || 'us-east-1', host = 'email.' + region + '.amazonaws.com', path = '/v2/email/outbound-emails';
  const body = JSON.stringify({ FromEmailAddress: process.env.MAIL_FROM, Destination: { ToAddresses: [to] },
    Content: { Simple: { Subject: { Data: subject, Charset: 'UTF-8' }, Body: { Html: { Data: html, Charset: 'UTF-8' }, Text: { Data: text || subject, Charset: 'UTF-8' } } } } });
  const r = await fetch('https://' + host + path, { method: 'POST', headers: sigv4('POST', host, path, region, 'ses', body, sesKey(), sesSecret()), body });
  if (!r.ok) { MAIL_LAST = 'ses ' + r.status + ' ' + (await r.text()).slice(0, 300); return false; }
  MAIL_LAST = 'ses ok'; return true;
}
async function sendMail(to, subject, html, text) {
  if (hasBrevoMail()) { try { if (await sendBrevoMail(to, subject, html, text)) return true; } catch (e) { MAIL_LAST = 'brevo ' + String(e.message || e).slice(0, 200); } }
  if (hasSES()) { try { if (await sendSES(to, subject, html, text)) return true; } catch (e) { MAIL_LAST = 'ses ' + String(e.message || e).slice(0, 200); } }
  if (!(process.env.RESEND_API_KEY && process.env.MAIL_FROM)) return false;
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.RESEND_API_KEY }, body: JSON.stringify({ from: process.env.MAIL_FROM, to: [to], subject, html }) });
  MAIL_LAST = 'resend ' + r.status; return r.ok;
}
const mailLast = () => MAIL_LAST;

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


/* ---------- 成人露骨作品门槛：总开关 + 地区白名单 + 账号年龄验证，三者都满足才放行 ---------- */
function region(req) {
  const h = req.headers || {}; const c = String(h['x-vercel-ip-country'] || '').toUpperCase(); const r = String(h['x-vercel-ip-country-region'] || '').toUpperCase();
  return { country: c, code: c && r ? c + '-' + r : c };
}
function adultRegionOk(req, cfg) {
  if (!cfg || cfg.adult_enabled !== true) return false;
  const reg = region(req), list = (Array.isArray(cfg.adult_regions) ? cfg.adult_regions : []).map(x => String(x).toUpperCase().trim()).filter(Boolean);
  if (list.includes('*')) return true;
  return !!reg.country && (list.includes(reg.code) || list.includes(reg.country));
}
async function adultAccess(req, cfg) {
  cfg = cfg || await config();
  if (cfg.adult_enabled !== true) return { ok: false, why: 'disabled' };
  if (!adultRegionOk(req, cfg)) return { ok: false, why: 'region', region: region(req).code || null };
  const u = who(req); if (!u) return { ok: false, why: 'login' };
  const sql = await db(); const r = await sql('SELECT adult_verified_at FROM users WHERE id=$1', [u.uid]);
  if (!r[0] || !r[0].adult_verified_at) return { ok: false, why: 'verify' };
  return { ok: true };
}
const isAdultWork = w => !!(w && w.pack && w.pack.meta && w.pack.meta.adult === true);
module.exports = { region, adultAccess, adultRegionOk, isAdultWork, needActive, addUsage, config, configReset, CONFIG_DEFAULTS, ROLES, can, adminToken, whoAdmin, audit, ip, hasMail, hasSES, hasBrevoMail, hasBrevoSMS, sendMail, mailLast, hasSMS, sendSMS, smsLast, firebaseConfig, verifyFirebase, oauthConfig, verifyGoogle, verifyApple, verify, cors, send, bad, db, hasDb, who, needUser, tokenFor, hashPass, checkPass, newId, isAdmin, bump, safety, structureQA, llm, embed, cosine, embedPreferred, embedLast: () => _embLast, hasBlob, blobPut, blobDel, readBody, jsonBody, wrap, crypto, planValid: require('./_plan').planValid };
