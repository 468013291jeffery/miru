// GET /api/health — what the backend has configured (no secrets)
const L = require('./_lib');
module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res, 'GET, OPTIONS')) return;
  let db = false, err = null;
  if (L.hasDb()) { try { const sql = await L.db(); await sql('SELECT 1'); db = true; } catch (e) { err = String(e.message).slice(0, 120); } }
  L.send(res, 200, { ok: true, db, dbError: err, blob: L.hasBlob(), ai: !!process.env.LONGCAT_API_KEY, tts: process.env.TTS_URL ? 'server' : 'space', hfToken: !!process.env.HF_TOKEN, authSecret: !!process.env.AUTH_SECRET, admin: !!process.env.ADMIN_KEY });
});
