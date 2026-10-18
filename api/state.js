// /api/state — cloud save of the app state (progress, choices, memories, settings) per account
// GET → {data, ver}   PUT {data, ver} → {ver}   (409 + newer copy when another device saved in between)
const L = require('./_lib');
const MAX = 900 * 1024;
const TYPES = ['boundary', 'promise', 'pref', 'self', 'fact', 'event', 'guess'];
/* /api/state?r=mem — long-term memory store (phase 2): structured rows per account + semantic recall.
   POST {op:'sync', thread, cast, items:[{id,t,type,imp,who,src,pin,hush,at}], gone:[ids]}  → upsert/delete, embeds new rows when an embedding API is available
   POST {op:'recall', thread, cast, query, k, cross}  → [{id, t, type, thread, score}]  (vectors if available, else the model picks; R42 knowledge filter by cast)
   POST {op:'forget', ids} / {op:'forget_all', thread}  → hard delete (R48)
   GET  ?r=mem&thread=   → rows (no vectors) */
async function memory(req, res, u, sql) {
  const q = req.query || {};
  if (req.method === 'GET') return L.send(res, 200, { rows: await sql('SELECT id, thread_id, type, text, who, imp, src, pin, hush, created_ms, emb_model FROM memories WHERE user_id=$1 AND ($2 = \'\' OR thread_id=$2) ORDER BY created_ms DESC LIMIT 1000', [u.uid, String(q.thread || '')]) });
  const b = L.jsonBody(req), op = b.op;
  if (op === 'sync') {
    const thread = String(b.thread || '').slice(0, 80), cast = JSON.stringify((b.cast || []).slice(0, 12).map(String));
    const items = (b.items || []).slice(0, 150).filter(x => x && x.id && x.t);
    for (const x of items) {
      await sql(`INSERT INTO memories (user_id, id, thread_id, cast_ids, type, text, who, imp, src, pin, hush, created_ms, updated_at) VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7::jsonb,$8,$9,$10,$11,$12,now())
        ON CONFLICT (user_id, id) DO UPDATE SET type=$5, emb=CASE WHEN memories.text=$6 THEN memories.emb ELSE NULL END, text=$6, who=$7::jsonb, imp=$8, pin=$10, hush=$11, cast_ids=$4::jsonb, updated_at=now()`,
        [u.uid, String(x.id).slice(0, 40), thread, cast, TYPES.includes(x.type) ? x.type : 'event', String(x.t).slice(0, 400), JSON.stringify((x.who || []).slice(0, 12)), Math.max(1, Math.min(3, Number(x.imp) || 2)), String(x.src || '').slice(0, 10), !!x.pin, !!x.hush, Number(x.at) || Date.now()]);
    }
    const gone = (b.gone || []).slice(0, 300).map(String);
    if (gone.length) await sql('DELETE FROM memories WHERE user_id=$1 AND id = ANY($2::text[])', [u.uid, gone]);
    // embed rows that don't have a vector yet (best effort, small batches)
    let embedded = 0;
    const pref = L.embedPreferred(), healthy = pref && L.embedLast() === pref; // re-embed old vectors only once the preferred model is known to work
    const todo = await sql('SELECT id, text FROM memories WHERE user_id=$1 AND (emb IS NULL OR ($2::text IS NOT NULL AND emb_model IS DISTINCT FROM $2)) ORDER BY created_ms DESC LIMIT 32', [u.uid, healthy ? pref : null]);
    if (todo.length) { const e = await L.embed(todo.map(r => r.text)); if (e) { for (let i = 0; i < todo.length; i++) await sql('UPDATE memories SET emb=$3::real[], emb_model=$4 WHERE user_id=$1 AND id=$2', [u.uid, todo[i].id, e.vecs[i], e.model]); embedded = todo.length; } }
    return L.send(res, 200, { ok: true, saved: items.length, deleted: gone.length, embedded });
  }
  if (op === 'recall') {
    const thread = String(b.thread || ''), cast = (b.cast || []).map(String), query = String(b.query || '').slice(0, 600), k = Math.max(1, Math.min(30, Number(b.k) || 8));
    if (!query.trim()) return L.send(res, 200, { mode: 'none', items: [] });
    const rows = await sql(`SELECT id, thread_id, type, text, who, imp, emb, emb_model FROM memories WHERE user_id=$1 AND hush=false AND (thread_id=$2 OR ($3 AND cast_ids ?| $4::text[])) ORDER BY created_ms DESC LIMIT 500`, [u.uid, thread, !!b.cross, cast.length ? cast : ['-']]);
    const cand = rows.filter(r => { const w = r.who || []; return !w.length || w.some(id => cast.includes(id)); }); // R42: only what these characters know
    if (!cand.length) return L.send(res, 200, { mode: 'empty', items: [] });
    const out = x => ({ id: x.id, t: x.text, type: x.type, thread: x.thread_id, score: Math.round((x._s || 0) * 1000) / 1000 });
    const withV = cand.filter(r => r.emb && r.emb.length);
    if (withV.length >= Math.min(cand.length, 5)) {
      const e = await L.embed([query]);
      const same = e ? withV.filter(r => r.emb_model === e.model) : [];
      if (e && same.length >= Math.min(cand.length, 5)) { for (const r of same) r._s = L.cosine(e.vecs[0], r.emb) + (r.imp - 2) * 0.03 + (r.thread_id === thread ? 0.02 : 0); return L.send(res, 200, { mode: 'vector', model: e.model, items: same.sort((a, b2) => b2._s - a._s).slice(0, k).map(out) }); }
    }
    // no embeddings: let the model pick by meaning (cheap, short)
    const list = cand.slice(0, 80);
    try {
      const txt = await L.llm([{ role: 'system', content: 'You pick which remembered facts are relevant to what the user just said. Relevance means same topic or meaning, even with different words (e.g. "rain" ↔ "afraid of thunder"). Reply JSON only.' },
        { role: 'user', content: 'USER JUST SAID: ' + query + '\n\nMEMORIES:\n' + list.map((r, i) => i + '. ' + r.text).join('\n') + '\n\nReturn up to ' + k + ' numbers of the relevant memories, most relevant first: {"ids":[3,0]}  (empty list if none)' }], 120, 5000, 'deepseek,scnet,longcat,glm');
      const m = txt.match(/\{[\s\S]*\}/); const ids = m ? (JSON.parse(m[0]).ids || []) : [];
      const picked = ids.map(Number).filter(i => list[i]).slice(0, k).map((i, n) => Object.assign(list[i], { _s: 1 - n * 0.05 }));
      return L.send(res, 200, { mode: 'model', items: picked.map(out) });
    } catch (e) { return L.send(res, 200, { mode: 'error', items: [], error: String(e.message || e).slice(0, 120) }); }
  }
  if (op === 'forget') { const ids = (b.ids || []).slice(0, 500).map(String); await sql('DELETE FROM memories WHERE user_id=$1 AND id = ANY($2::text[])', [u.uid, ids]); return L.send(res, 200, { ok: true }); }
  if (op === 'forget_all') { await sql('DELETE FROM memories WHERE user_id=$1 AND ($2 = \'\' OR thread_id=$2)', [u.uid, String(b.thread || '')]); return L.send(res, 200, { ok: true }); }
  return L.bad(res, 'unknown op');
}
module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res, 'GET, PUT, POST, OPTIONS')) return;
  const u = await L.needActive(req, res); if (!u) return;
  const sql = await L.db();
  if ((req.query || {}).r === 'mem') return memory(req, res, u, sql);
  if (req.method === 'GET') {
    const r = await sql('SELECT data, ver, updated_at FROM states WHERE user_id=$1', [u.uid]);
    return L.send(res, 200, r[0] || { data: null, ver: 0 });
  }
  if (req.method !== 'PUT') return L.bad(res, 'GET or PUT', 405);
  const b = L.jsonBody(req);
  const raw = JSON.stringify(b.data || null);
  if (raw.length > MAX) return L.bad(res, 'state too large (' + Math.round(raw.length / 1024) + 'KB)', 413);
  const base = Number(b.ver) || 0, force = !!b.force;
  const cur = await sql('SELECT ver FROM states WHERE user_id=$1', [u.uid]);
  if (cur[0] && !force && cur[0].ver > base) {
    const r = await sql('SELECT data, ver FROM states WHERE user_id=$1', [u.uid]);
    return L.send(res, 409, { error: 'newer copy on server', data: r[0].data, ver: r[0].ver });
  }
  const r = await sql(`INSERT INTO states (user_id, data, ver, updated_at) VALUES ($1, $2::jsonb, 1, now())
    ON CONFLICT (user_id) DO UPDATE SET data=$2::jsonb, ver=states.ver+1, updated_at=now() RETURNING ver`, [u.uid, raw]);
  L.send(res, 200, { ver: r[0].ver });
});
