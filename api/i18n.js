// GET /api/i18n?lang=ja — every cached translation for one language, so devices load the whole dictionary in one request
const L = require('./_lib');
module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res, 'GET, OPTIONS')) return;
  const lang = String((req.query || {}).lang || '');
  if (!/^(ja|ko|es|en|zh)$/.test(lang)) return L.bad(res, 'bad language');
  const sql = await L.db();
  const r = await sql('SELECT src, dst FROM translations WHERE lang=$1 ORDER BY at DESC LIMIT 30000', [lang]);
  const map = {}; r.forEach(x => { map[x.src] = x.dst; });
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400');
  res.status(200).json({ lang, n: r.length, map });
});
