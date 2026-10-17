// /api/translate — machine translation of UI and story text, cached for everyone
// POST {to:'ja'|'ko'|'es'|'en'|'zh', texts:[…≤60]} → {map:{src:dst}}
// Cached in Postgres by sha1(lang+text), so each line is translated once for all users; misses go to LongCat in one batch.
const L = require('./_lib');
const NAMES = { ja: 'Japanese', ko: 'Korean', es: 'Spanish (Latin American, US audience)', en: 'English (American)', zh: 'Simplified Chinese' };
module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res, 'POST, OPTIONS')) return;
  const b = L.jsonBody(req), to = String(b.to || '');
  if (!NAMES[to]) return L.bad(res, 'bad language');
  const texts = [...new Set((Array.isArray(b.texts) ? b.texts : []).map(t => String(t || '').slice(0, 600)).filter(t => t.trim()))].slice(0, 60);
  if (!texts.length) return L.send(res, 200, { map: {} });
  const sql = await L.db();
  const h = t => L.crypto.createHash('sha1').update(to + '\n' + t).digest('hex');
  const hs = texts.map(h);
  const rows = await sql('SELECT h, dst FROM translations WHERE h = ANY($1)', [hs]);
  const got = {}; rows.forEach(r => { got[r.h] = r.dst; });
  const map = {}, miss = [];
  texts.forEach((t, i) => { if (got[hs[i]] != null) map[t] = got[hs[i]]; else miss.push(t); });
  if (miss.length) {
    const u = L.who(req);
    if (u && !(await L.bump(u.uid, 'translate', 400))) return L.send(res, 200, { map, limited: true });
    const sys = 'You localize an interactive romance-drama app for ' + NAMES[to] + ' readers. Translate each string naturally, the way a native app would say it: keep emoji, numbers, placeholders like {n}, character names and English trope names that ' + NAMES[to] + ' romance readers also use as-is (e.g. "Slow Burn") only if that is what local readers use. Keep the tone (flirty, dry, dramatic). Do not add quotes or notes. Return ONLY a JSON array of strings, same order and length as the input.';
    try {
      const txt = await L.llm([{ role: 'system', content: sys }, { role: 'user', content: JSON.stringify(miss) }], 3500);
      const arr = JSON.parse(txt.slice(txt.indexOf('['), txt.lastIndexOf(']') + 1));
      if (Array.isArray(arr) && arr.length === miss.length) {
        for (let i = 0; i < miss.length; i++) {
          const dst = String(arr[i] || '').slice(0, 1200); if (!dst) continue; map[miss[i]] = dst;
          await sql('INSERT INTO translations (h, lang, src, dst) VALUES ($1,$2,$3,$4) ON CONFLICT (h) DO NOTHING', [h(miss[i]), to, miss[i], dst]);
        }
      }
    } catch (e) { return L.send(res, 200, { map, error: String(e.message).slice(0, 120) }); }
  }
  L.send(res, 200, { map });
});
