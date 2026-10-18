// GET /api/health — what the backend has configured (no secrets)
// GET /api/health?config=1 — public operations config + active notices for the app
const L = require('./_lib');
module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res, 'GET, OPTIONS')) return;
  const q = req.query || {};
  if (q.config) {
    const c = await L.config(); const sql = await L.db();
    const lang = String(q.lang || '').slice(0, 5);
    const n = await sql("SELECT id, title, body, kind, lang FROM notices WHERE active AND (starts_at IS NULL OR starts_at<=now()) AND (ends_at IS NULL OR ends_at>now()) AND (lang='all' OR lang=$1) ORDER BY id DESC LIMIT 5", [lang || 'all']);
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
    return res.status(200).json({ config: { upload_price: c.upload_price, reroll_free: c.reroll_free, reroll_price: c.reroll_price, daily_gems: c.daily_gems, guest_allowed: c.guest_allowed !== false, maintenance: c.maintenance || '', skus: c.skus }, notices: n, auth: Object.assign(L.oauthConfig(), { reset: L.hasMail() }) });
  }
  let db = false, err = null;
  if (L.hasDb()) { try { const sql = await L.db(); await sql('SELECT 1'); db = true; } catch (e) { err = String(e.message).slice(0, 120); } }
  L.send(res, 200, { ok: true, db, dbError: err, blob: L.hasBlob(), ai: !!(process.env.LONGCAT_API_KEY || process.env.SCNET_API_KEY || process.env.GLM_API_KEY), llm: { longcat: !!process.env.LONGCAT_API_KEY, scnet: !!process.env.SCNET_API_KEY, glm: !!process.env.GLM_API_KEY, order: process.env.LLM_ORDER || 'longcat,scnet,glm' }, tts: process.env.TTS_URL ? 'server' : 'space', hfToken: !!process.env.HF_TOKEN, authSecret: !!process.env.AUTH_SECRET, admin: !!process.env.ADMIN_KEY, google: !!process.env.GOOGLE_CLIENT_ID, apple: !!process.env.APPLE_CLIENT_ID, mail: L.hasMail() });
});
