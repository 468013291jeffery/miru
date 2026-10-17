// /api/works — community stories (UGC)
// GET ?feed=new|hot&lang=&orient=&limit=&before=   live works (no pack body)
// GET ?id=…            one work with its pack (counts a play when &play=1)
// GET ?mine=1          my works, any status
// POST {op:'publish', work:{id?,title,hook,lang,orient,tags,cover,pack}}  → server QA: safety blocks; structure errors → 'pending' (review); clean → 'live'
// POST {op:'like'|'unlike'|'report', id, reason}
// DELETE ?id=          remove my work
const L = require('./_lib');
const MAXPACK = 1500 * 1024;
const pub = r => ({ id: r.id, author: r.author_name || 'MIRU creator', title: r.title, hook: r.hook, lang: r.lang, orient: r.orient, tags: r.tags || [], cover: r.cover, plays: r.plays, likes: r.likes, status: r.status, featured: !!r.featured, created_at: r.created_at });
module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res)) return;
  const sql = await L.db();
  const q = req.query || {};
  if (req.method === 'GET') {
    if (q.id) {
      const r = await sql('SELECT * FROM works WHERE id=$1', [String(q.id)]);
      const w = r[0]; const u = L.who(req);
      if (!w || (w.status !== 'live' && !(u && u.uid === w.author) && !L.isAdmin(req))) return L.bad(res, 'not found', 404);
      if (q.play) await sql('UPDATE works SET plays=plays+1 WHERE id=$1', [w.id]);
      return L.send(res, 200, Object.assign(pub(w), { pack: w.pack, qa: w.qa }));
    }
    if (q.mine) { const u = await L.needActive(req, res); if (!u) return; const r = await sql('SELECT * FROM works WHERE author=$1 ORDER BY updated_at DESC LIMIT 100', [u.uid]); return L.send(res, 200, { works: r.map(w => Object.assign(pub(w), { qa: w.qa })) }); }
    const lim = Math.min(Number(q.limit) || 20, 50), hot = q.feed === 'hot';
    const args = [lim]; let where = "status='live'";
    if (q.orient && q.orient !== 'all') { args.push(String(q.orient)); where += ` AND (orient=$${args.length} OR orient='all')`; }
    if (q.before) { args.push(new Date(Number(q.before)).toISOString()); where += ` AND created_at < $${args.length}`; }
    if (q.feed === 'featured') where += ' AND featured';
    const r = await sql(`SELECT id, author_name, title, hook, lang, orient, tags, cover, plays, likes, status, featured, created_at FROM works WHERE ${where} ORDER BY featured DESC, ${hot ? '(likes*3+plays) DESC, created_at DESC' : 'created_at DESC'} LIMIT $1`, args);
    return L.send(res, 200, { works: r.map(pub) });
  }
  const u = await L.needActive(req, res); if (!u) return;
  const cfg = await L.config();
  if (req.method === 'DELETE') { await sql('DELETE FROM works WHERE id=$1 AND author=$2', [String(q.id || ''), u.uid]); return L.send(res, 200, { ok: true }); }
  const b = L.jsonBody(req);
  if (b.op === 'publish') {
    if (!(await L.bump(u.uid, 'publish', Number(cfg.publish_daily_limit) || 30))) return L.bad(res, 'daily publish limit reached', 429);
    const w = b.work || {};
    const raw = JSON.stringify(w.pack || null);
    if (raw.length > MAXPACK) return L.bad(res, 'story too large', 413);
    const safety = L.safety([w.title, w.hook, w.pack]);
    if (safety.length) return L.send(res, 422, { error: 'blocked by safety review', reasons: safety });
    const s = L.structureQA(w.pack);
    const prev = await sql('SELECT status FROM works WHERE id=$1', [w.id || '']);
    const status = s.err.length || cfg.community_auto_live === false || (prev[0] && ['rejected', 'takedown'].includes(prev[0].status)) ? 'pending' : 'live';
    const me = await sql('SELECT name, email FROM users WHERE id=$1', [u.uid]);
    const author = (b.authorName || (me[0] && (me[0].name || (me[0].email || '').split('@')[0])) || 'creator').slice(0, 40);
    const id = w.id && /^w_[a-z0-9]+$/.test(w.id) ? w.id : L.newId('w_');
    const own = await sql('SELECT author FROM works WHERE id=$1', [id]);
    if (own[0] && own[0].author !== u.uid) return L.bad(res, 'not your work', 403);
    await sql(`INSERT INTO works (id, author, author_name, title, hook, lang, orient, tags, cover, pack, status, qa, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10::jsonb,$11,$12::jsonb, now())
      ON CONFLICT (id) DO UPDATE SET reject_reason=NULL, title=$4, hook=$5, lang=$6, orient=$7, tags=$8::jsonb, cover=$9, pack=$10::jsonb, status=$11, qa=$12::jsonb, updated_at=now()`,
      [id, u.uid, author, String(w.title || '').slice(0, 80), String(w.hook || '').slice(0, 240), String(w.lang || 'zh').slice(0, 5), String(w.orient || 'all').slice(0, 4), JSON.stringify((w.tags || []).slice(0, 12)), typeof w.cover === 'string' && w.cover.length < 600 ? w.cover : null, raw, status, JSON.stringify(s)]);
    return L.send(res, 200, { id, status, qa: s });
  }
  if (b.op === 'like' || b.op === 'unlike') {
    const id = String(b.id || '');
    if (b.op === 'like') { const r = await sql('INSERT INTO work_likes (user_id, work_id) VALUES ($1,$2) ON CONFLICT DO NOTHING RETURNING work_id', [u.uid, id]); if (r[0]) await sql('UPDATE works SET likes=likes+1 WHERE id=$1', [id]); }
    else { const r = await sql('DELETE FROM work_likes WHERE user_id=$1 AND work_id=$2 RETURNING work_id', [u.uid, id]); if (r[0]) await sql('UPDATE works SET likes=GREATEST(0,likes-1) WHERE id=$1', [id]); }
    const c = await sql('SELECT likes FROM works WHERE id=$1', [id]);
    return L.send(res, 200, { likes: c[0] ? c[0].likes : 0 });
  }
  if (b.op === 'report') {
    const id = String(b.id || '');
    await sql('INSERT INTO reports (user_id, target_kind, target_id, reason) VALUES ($1,$2,$3,$4)', [u.uid, 'work', id, String(b.reason || '').slice(0, 300)]);
    const r = await sql("UPDATE works SET reports=reports+1, status=CASE WHEN reports+1>=$2 AND status='live' THEN 'pending' ELSE status END WHERE id=$1 RETURNING status", [id, Number(cfg.report_threshold) || 5]);
    return L.send(res, 200, { ok: true, status: r[0] && r[0].status });
  }
  L.bad(res, 'unknown op');
});
