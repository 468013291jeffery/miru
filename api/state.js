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
/* v8.2.5 · 唯一可信事件模型（v7.11 §08.1 / §09.3）：/api/state?r=ev
   POST {op:'commit', thread, events:[{idem, event_id, story_id, scene_id, type, actor_id, visible_to, payload, base_rev}]}
     → 每个事件按 idem 幂等（同一选项 / 礼物 / 回执重复提交只记一次）；剧情推进类事件带 base_rev 乐观锁，落后于服务器版本就返回 conflict
   GET ?r=ev&thread=  → {rev, events}（服务器是版本的最终来源） */
const EV_TYPES = ['choice', 'tool_result', 'chapter', 'scene', 'relation', 'boundary', 'reveal', 'continue', 'pack_publish'];
const EV_LOCKED = ['choice', 'chapter', 'scene', 'continue'];
async function evCommit(sql, uid, th, e) {
  const idem = String(e.idem || '').slice(0, 160); if (!idem) return { error: 'idem required' };
  const type = EV_TYPES.includes(e.type) ? e.type : null; if (!type) return { idem, error: 'bad type' };
  const ex = await sql('SELECT rev, event_id FROM world_events WHERE user_id=$1 AND idem=$2', [uid, idem]);
  if (ex[0]) return { idem, dup: true, rev: ex[0].rev, event_id: ex[0].event_id };
  await sql('INSERT INTO story_revs (user_id, thread_id, rev) VALUES ($1,$2,0) ON CONFLICT (user_id, thread_id) DO NOTHING', [uid, th]);
  const cur = (await sql('SELECT rev FROM story_revs WHERE user_id=$1 AND thread_id=$2', [uid, th]))[0].rev;
  const base = e.base_rev == null || e.base_rev === '' ? null : Number(e.base_rev);
  if (base != null && base < cur && EV_LOCKED.includes(type)) return { idem, conflict: true, rev: cur };
  const up = await sql('UPDATE story_revs SET rev=rev+1, updated_at=now() WHERE user_id=$1 AND thread_id=$2 AND rev=$3 RETURNING rev', [uid, th, cur]);
  if (!up[0]) return { idem, conflict: true, rev: cur + 1 };
  const rev = up[0].rev, eid = String(e.event_id || ('EVT_' + rev + '_' + Date.now().toString(36))).slice(0, 80);
  const ins = await sql(`INSERT INTO world_events (user_id, idem, event_id, story_id, thread_id, scene_id, type, actor_id, visible_to, payload, base_rev, rev)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11,$12) ON CONFLICT (user_id, idem) DO NOTHING RETURNING rev`,
    [uid, idem, eid, String(e.story_id || '').slice(0, 80), th, String(e.scene_id || '').slice(0, 80), type, String(e.actor_id || '').slice(0, 80), JSON.stringify((e.visible_to || []).slice(0, 12).map(String)), JSON.stringify(e.payload || {}).slice(0, 4000), base, rev]);
  if (!ins[0]) { const d = await sql('SELECT rev, event_id FROM world_events WHERE user_id=$1 AND idem=$2', [uid, idem]); return { idem, dup: true, rev: d[0] && d[0].rev, event_id: d[0] && d[0].event_id }; }
  return { idem, rev, event_id: eid };
}
async function events(req, res, u, sql) {
  const q = req.query || {};
  if (req.method === 'GET') {
    const th = String(q.thread || '').slice(0, 80);
    const r = await sql('SELECT rev FROM story_revs WHERE user_id=$1 AND thread_id=$2', [u.uid, th]);
    const rows = await sql('SELECT idem, event_id, type, scene_id, actor_id, visible_to, payload, base_rev, rev, at FROM world_events WHERE user_id=$1 AND thread_id=$2 ORDER BY rev DESC LIMIT 60', [u.uid, th]);
    return L.send(res, 200, { rev: (r[0] && r[0].rev) || 0, events: rows });
  }
  const b = L.jsonBody(req); if (b.op !== 'commit') return L.bad(res, 'unknown op');
  const th = String(b.thread || '').slice(0, 80); if (!th) return L.bad(res, 'thread required');
  const out = []; for (const e of (b.events || []).slice(0, 20)) out.push(await evCommit(sql, u.uid, th, e || {}));
  const r = await sql('SELECT rev FROM story_revs WHERE user_id=$1 AND thread_id=$2', [u.uid, th]);
  return L.send(res, 200, { results: out, rev: (r[0] && r[0].rev) || 0 });
}
/* v8.2.5 · 模式 B 动态 Scene Pack 发布事务（v7.11 §05.8）：/api/state?r=pack
   POST {op:'validate', thread, story_id, base_rev, pack, canon:{chapters, flags}, forbidden:[], cast_keys:[]}
   generate_candidate（客户端）→ schema → 版本 → 知识 → 工具白名单 → 内容边界 → canon（一次轻量模型核对，失败则降级放行并记录）→ 发布并记一条 pack_publish 事件 */
const PACK_TOOLS = ['ask', 'gift', 'game', 'photo', 'voice', 'call'];
async function packs(req, res, u, sql) {
  const b = L.jsonBody(req); if (b.op !== 'validate') return L.bad(res, 'unknown op');
  const th = String(b.thread || '').slice(0, 80), pk = b.pack || {}, reasons = [], warn = [];
  const sc = Array.isArray(pk.scenes) ? pk.scenes : [];
  if (!sc.length || sc.length > 6) reasons.push('schema: scenes must be 1–6');
  const tx = v => typeof v === 'string' ? v : (v && (v.zh || v.en)) || ''; sc.forEach((s, i) => { if (!s || !tx(s.place).trim()) reasons.push('schema: scene ' + (i + 1) + ' has no place'); if (!s || !tx(s.beat).trim()) reasons.push('schema: scene ' + (i + 1) + ' has no beat'); });
  const keys = (b.cast_keys || []).map(String);
  if (keys.length) sc.forEach((s, i) => (s && s.present || []).forEach(k => { if (!keys.includes(String(k))) reasons.push('schema: scene ' + (i + 1) + ' present has unknown key ' + k); }));
  sc.forEach((s, i) => (Array.isArray(s && s.tools) ? s.tools : []).forEach(t => { if (!PACK_TOOLS.includes(String(t))) reasons.push('tools: scene ' + (i + 1) + ' uses unsupported tool ' + t); }));
  const cur = (await sql('SELECT rev FROM story_revs WHERE user_id=$1 AND thread_id=$2', [u.uid, th]))[0];
  if (cur && b.base_rev != null && Number(b.base_rev) < cur.rev) return L.send(res, 409, { ok: false, stale: true, rev: cur.rev, reasons: ['state: base_rev ' + b.base_rev + ' < server rev ' + cur.rev] });
  const txt = JSON.stringify(pk);
  (b.forbidden || []).map(x => String(x).trim()).filter(x => x.length >= 4).forEach(f => { const key = f.slice(0, 8); if (txt.includes(key)) reasons.push('knowledge: reveals something not yet revealed (' + key + '…)'); });
  const sf = L.safety(pk); if (sf.length) reasons.push('content: ' + sf.join('; '));
  if (!reasons.length) {
    try {
      const canon = b.canon || {};
      const t = await L.llm([{ role: 'system', content: '你是互动剧的 canon 校验器。只判断“候选新章节”是否推翻或改写了已经发生的事实（已发生的事件、已做的选择、已揭露的秘密、已确认的关系），或把已经收束的主冲突原样重演。不评价文笔。只输出 JSON。' },
        { role: 'user', content: '【已经发生（canon）】\n' + String((canon.chapters || []).join('\n')).slice(0, 3000) + '\n已做的选择：' + String((canon.flags || []).join('；')).slice(0, 1500) + '\n\n【候选新章节】\n' + txt.slice(0, 6000) + '\n\n输出 {"ok":true|false,"conflicts":["具体哪一句和哪条 canon 冲突"]}' }], 300, 9000, 'deepseek,scnet,longcat,glm');
      const m = String(t || '').match(/\{[\s\S]*\}/); const j = m ? JSON.parse(m[0]) : null;
      if (j && j.ok === false && Array.isArray(j.conflicts) && j.conflicts.length) j.conflicts.slice(0, 4).forEach(c => reasons.push('canon: ' + String(c).slice(0, 160)));
      if (!j) warn.push('canon_unchecked');
    } catch (e) { warn.push('canon_unchecked: ' + String(e.message || e).slice(0, 80)); }
  }
  const id = 'PK_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  if (reasons.length) { await sql('INSERT INTO scene_packs (id, user_id, thread_id, story_id, rev, status, reasons, pack) VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb)', [id, u.uid, th, String(b.story_id || ''), cur ? cur.rev : 0, 'rejected', JSON.stringify(reasons), txt.slice(0, 60000)]); return L.send(res, 200, { ok: false, id, reasons, warn }); }
  const ev = await evCommit(sql, u.uid, th, { idem: 'pack:' + id, type: 'pack_publish', story_id: b.story_id, payload: { id, scenes: sc.length } });
  await sql('INSERT INTO scene_packs (id, user_id, thread_id, story_id, rev, status, reasons, pack) VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb)', [id, u.uid, th, String(b.story_id || ''), ev.rev || 0, 'published', JSON.stringify(warn), txt.slice(0, 60000)]);
  return L.send(res, 200, { ok: true, id, rev: ev.rev, warn });
}
module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res, 'GET, PUT, POST, OPTIONS')) return;
  const u = await L.needActive(req, res); if (!u) return;
  const sql = await L.db();
  if ((req.query || {}).r === 'mem') return memory(req, res, u, sql);
  if ((req.query || {}).r === 'ev') return events(req, res, u, sql);
  if ((req.query || {}).r === 'pack') { if (req.method !== 'POST') return L.bad(res, 'POST only', 405); return packs(req, res, u, sql); }
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
