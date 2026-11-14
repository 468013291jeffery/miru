// GET /api/i18n?lang=ja — explicitly published public labels only
const L = require('./_lib');
module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res, 'GET, OPTIONS')) return;
  const lang = String((req.query || {}).lang || '');
  if (!/^(ja|ko|es|en|zh)$/.test(lang)) return L.bad(res, 'bad language');
  const sql = await L.db();
  const r = await sql('SELECT src, dst FROM translations WHERE lang=$1 AND published ORDER BY at DESC LIMIT 30000', [lang]);
  const map = {}; r.forEach(x => { map[x.src] = x.dst; });
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ lang, n: r.length, map });
});
