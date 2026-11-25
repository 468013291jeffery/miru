// /api/works — community stories (UGC)
// GET ?feed=new|hot&lang=&orient=&limit=&before=   live works (no pack body)
// GET ?id=…            one work with its pack (counts a play when &play=1)
// GET ?mine=1          my works, any status
// POST {op:'publish', work:{id?,title,hook,lang,orient,tags,cover,pack}}  → server QA: safety blocks; structure errors → 'pending' (review); clean → 'live'
// POST {op:'like'|'unlike'|'report', id, reason}
// DELETE ?id=          remove my work
const L = require('./_lib');
const MAXPACK_FALLBACK = 1500 * 1024;   // 真正的上限读 config.max_pack_kb
const pub = r => ({ id: r.id, adult: r.adult === true, author: r.author_name || 'MIRU creator', title: r.title, hook: r.hook, lang: r.lang, orient: r.orient, tags: r.tags || [], cover: r.cover, plays: r.plays, likes: r.likes, status: r.status, featured: !!r.featured, created_at: r.created_at, en: r.en || undefined, langs: Array.isArray(r.langs) ? r.langs : (r.pack && r.pack.meta && Array.isArray(r.pack.meta.langs) ? r.pack.meta.langs : undefined) });
/* ---------- 自动补全（2026-11-26）：发现页分类标签 / 人物卡 / 语言 ---------- */
const AUTO_TAGS = [[/mafia|黑帮|教父|cartel/i, 'Mafia'], [/bratva/i, 'Bratva'], [/billionaire|\bceo\b|总裁|富豪|继承人/i, 'Billionaire'], [/vampire|吸血鬼/i, 'Vampires'], [/werewolf|狼人|\balpha\b/i, 'Werewolves'],
  [/hockey|冰球/i, 'Hockey'], [/royal|prince|王子|王储|皇室/i, 'Royal Court'], [/college|campus|大学|校园/i, 'Campus'], [/celebrity|idol|明星|偶像|演员/i, 'Celebrity'], [/dragon|巨龙/i, 'Dragons'],
  [/ghost|鬼魂|幽灵/i, 'Ghosts'], [/\bfae\b|精灵/i, 'Fae'], [/office|上司|职场/i, 'Workplace'], [/wedding|婚礼|新娘/i, 'Wedding'], [/enem(y|ies)|宿敌|死对头/i, 'Enemies to Lovers'],
  [/second chance|破镜|重逢|前任/i, 'Second Chance'], [/fake dating|假情侣|契约恋/i, 'Fake Dating'], [/arranged|联姻/i, 'Arranged Marriage'], [/slow burn|慢热/i, 'Slow Burn'], [/bodyguard|保镖/i, 'Bodyguard'],
  [/forbidden|禁忌/i, 'Forbidden'], [/love triangle|三角恋|修罗场/i, 'Love Triangle'], [/revenge|复仇/i, 'Revenge'], [/hidden identity|secret identity|隐藏身份|秘密身份/i, 'Hidden Identity'],
  [/possessive|占有欲/i, 'Possessive'], [/obsess|偏执/i, 'Obsessive'], [/dark romance|暗黑/i, 'Dark Romance'], [/fantasy|奇幻|魔法/i, 'Romantasy'], [/suspense|悬疑|mystery|谋杀|凶手/i, 'Romantic Suspense']];
function autoMeta(w) {
  const pk = w.pack && typeof w.pack === 'object' ? w.pack : null; if (!pk) return;
  const raw = JSON.stringify(pk).slice(0, 60000), text = [w.title, w.hook, raw.replace(/data:[^"]{50,}/g, '')].join(' ');
  /* 标签 */
  const tags = Array.isArray(w.tags) ? w.tags.filter(Boolean).map(String) : [];
  if (tags.length < 3) {
    if (w.orient === 'bl' && !tags.includes('MM Romance')) tags.push('MM Romance');
    if (w.orient === 'gl' && !tags.includes('WLW')) tags.push('WLW');
    for (const [re, t] of AUTO_TAGS) { if (tags.length >= 8) break; if (!tags.includes(t) && re.test(text)) tags.push(t); }
    if (!tags.length) tags.push('Romance');
    w.tags = tags.slice(0, 12);
  }
  /* 人物卡：剧本 ⟦CHAR|名字|性别|年龄|…|身份|外貌⟧（字段是 URL 编码的） */
  pk.meta = pk.meta && typeof pk.meta === 'object' ? pk.meta : {};
  if (!(Array.isArray(pk.meta.leads) && pk.meta.leads.length) && typeof pk.script === 'string') {
    const dec = x => { try { return decodeURIComponent(x); } catch (_) { return x; } }, seen = new Set(), leads = [];
    const en = typeof pk.script_en === 'string' ? pk.script_en : '', enChars = (en.match(/⟦CHAR\|[^⟧]*⟧/g) || []);
    (pk.script.match(/⟦CHAR\|[^⟧]*⟧/g) || []).forEach((m, i) => {
      const f = m.slice(6, -1).split('|').map(dec), n = (f[0] || '').trim(); if (!n || /^(你|you|我)$/i.test(n) || seen.has(n) || leads.length >= 8) return; seen.add(n);
      const fe = enChars[i] ? enChars[i].slice(6, -1).split('|').map(dec) : [];
      leads.push({ key: 'c' + (leads.length + 1), n: { zh: n, en: fe[0] || n }, g: f[1] || '', age: Number(f[2]) || undefined, role: { zh: f[4] || '', en: fe[4] || f[4] || '' }, vibe: { zh: f[5] || '', en: fe[5] || f[5] || '' }, auto: true });
    });
    if (leads.length) pk.meta.leads = leads;
  }
  /* 语言：包里有哪种语言的正文，就把它列进 meta.langs */
  const langs = new Set(Array.isArray(pk.meta.langs) ? pk.meta.langs : []);
  if (typeof pk.script === 'string' && pk.script.trim()) langs.add(w.lang || 'zh');
  ['en', 'ja', 'ko', 'es'].forEach(L => { if (typeof pk['script_' + L] === 'string' && pk['script_' + L].trim()) langs.add(L); else if ((raw.match(new RegExp('"' + L + '":[\\["]', 'g')) || []).length >= 5) langs.add(L); });
  if (langs.size) pk.meta.langs = Array.from(langs);
}
module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res)) return;
  const sql = await L.db();
  const q = req.query || {};
  const native = req.headers['x-miru-client'] === 'ios' || req.headers.origin === 'capacitor://localhost';
  if (req.method === 'GET') {
    if (q.blocked) {
      const u = await L.needActive(req, res); if (!u) return;
      const r = await sql('SELECT b.author_id, COALESCE(u.name,b.author_id) AS author_name FROM user_blocks b LEFT JOIN users u ON u.id=b.author_id WHERE b.user_id=$1', [u.uid]);
      return L.send(res, 200, { blocked: r });
    }
    if (q.id) {
      const r = await sql('SELECT * FROM works WHERE id=$1', [String(q.id)]);
      const w = r[0]; const u = L.who(req);
      if (!w || (w.status !== 'live' && !(u && u.uid === w.author) && !L.isAdmin(req))) return L.bad(res, 'not found', 404);
      if (native && L.isAdultWork(w)) return L.bad(res, 'not found', 404);
      if (u && (await sql('SELECT 1 FROM user_blocks WHERE user_id=$1 AND author_id=$2', [u.uid, w.author]))[0]) return L.bad(res, 'not found', 404);
      if (L.isAdultWork(w) && !L.isAdmin(req)) { const g = await L.adultAccess(req); if (!g.ok) return L.send(res, 451, { error: 'adult_gate', why: g.why, self: g.why === 'verify' && (await L.config()).adult_self_verify === true }); }
      if (q.play) await sql('UPDATE works SET plays=plays+1 WHERE id=$1', [w.id]);
      return L.send(res, 200, Object.assign(pub(w), { pack: w.pack, qa: w.qa }));
    }
    if (q.mine) { const u = await L.needActive(req, res); if (!u) return; const r = await sql("SELECT * FROM works WHERE author=$1" + (native ? " AND COALESCE(pack->'meta'->>'adult','false') <> 'true'" : '') + ' ORDER BY updated_at DESC LIMIT 100', [u.uid]); return L.send(res, 200, { works: r.map(w => Object.assign(pub(w), { qa: w.qa })) }); }
    const lim = Math.min(Number(q.limit) || 20, 50), hot = q.feed === 'hot';
    const args = [lim]; let where = "status='live'";
    if (q.orient && q.orient !== 'all') { args.push(String(q.orient)); where += ` AND (orient=$${args.length} OR orient='all')`; }
    if (q.before) { args.push(new Date(Number(q.before)).toISOString()); where += ` AND created_at < $${args.length}`; }
    if (q.feed === 'featured') where += ' AND featured';
    const viewer = L.who(req);
    if (viewer) { args.push(viewer.uid); where += ` AND NOT EXISTS (SELECT 1 FROM user_blocks b WHERE b.user_id=$${args.length} AND b.author_id=works.author)`; }
    if (native || !L.adultRegionOk(req, await L.config())) where += " AND COALESCE(pack->'meta'->>'adult','false') <> 'true'";
    const r = await sql(`SELECT id, author_name, title, hook, lang, orient, tags, cover, plays, likes, status, featured, created_at, pack->'meta'->'en' AS en, pack->'meta'->'langs' AS langs, pack->'meta'->'adult' AS adult FROM works WHERE ${where} ORDER BY featured DESC, ${hot ? '(likes*3+plays) DESC, created_at DESC' : 'created_at DESC'} LIMIT $1`, args);
    return L.send(res, 200, { works: r.map(pub) });
  }
  const u = await L.needActive(req, res); if (!u) return;
  const cfg = await L.config();
  if (req.method === 'DELETE') { await sql('DELETE FROM works WHERE id=$1 AND author=$2', [String(q.id || ''), u.uid]); return L.send(res, 200, { ok: true }); }
  const b = L.jsonBody(req);
  if (b.op === 'publish') {
    if (!(await L.bump(u.uid, 'publish', Number(cfg.publish_daily_limit) || 30))) return L.bad(res, 'daily publish limit reached', 429);
    const w = b.work || {};
    const PKG = require('./_package');
    /* 两条发布路径：
       ① 文件包（pack.script）：剧本正文是唯一事实源，发布前查「能不能播」+「素材有没有挂到剧本的位置上」；
       ② 老路径（pack.world / pack.chapters）：创作中心已经构建好的 pack，保持原样。
       运行时对两者都能装（app76_official.js 会解析 pack.script），差别只在入库前的审查。 */
    const script = (w.pack && typeof w.pack.script === 'string' && w.pack.script.trim()) ? w.pack.script : '';
    let scriptQA = null, pkgQA = null;
    if (script) {
      scriptQA = require('./_dslqa').dslQA(script);
      if (!scriptQA.ok) return L.bad(res, 'script invalid (' + scriptQA.err.length + '): ' + scriptQA.err.slice(0, 3).join('; '), 400);
      pkgQA = PKG.packageQA({ script, assets: w.pack.assets, characters: w.pack.characters, cover: w.cover, opening_video: w.pack.opening_video });
      if (!pkgQA.ok) return L.bad(res, 'package invalid (' + pkgQA.errors.length + '): ' + pkgQA.errors.slice(0, 3).join('; '), 400);
      w.pack.assets = pkgQA.assets;
      /* 缺封面就补：用剧本里第一张真的上传了的背景。不编造、不下载，只做引用兜底。 */
      if (!w.cover) {
        const firstBg = (pkgQA.slots.bg || []).map(k => w.pack.assets[k]).find(Boolean);
        if (firstBg) w.cover = firstBg;
      }
    } else {
      const v = L.planValid ? L.planValid(w.pack) : { ok: true, errors: [] };
      if (!v.ok) {
        const head = v.errors.slice(0, 3).map(e => e.path + ': ' + e.why).join('; ');
        return L.bad(res, 'pack invalid (' + v.errors.length + '): ' + head, 400);
      }
    }
    /* 2026-11-26 自动补全：发现页分类标签、人物卡、语言列表（作者没填时才补，填了以作者为准） */
    try { autoMeta(w); } catch (_) {}
    const raw = JSON.stringify(w.pack || null);
    const MAXPACK = (Number(cfg.max_pack_kb) || 1500) * 1024;
    if (raw.length > MAXPACK) return L.bad(res, 'story too large (' + Math.round(raw.length / 1024) + 'KB, limit ' + Math.round(MAXPACK / 1024) + 'KB)', 413);
    const safety = L.safety([w.title, w.hook, w.pack]);
    if (safety.length) return L.send(res, 422, { error: 'blocked by safety review', reasons: safety });
    /* 回执里写清：剧本结构、素材覆盖率、还缺哪些槽位、哪些文件没被引用。
       缺素材不挡发布（作者可以后补，运行时也会跳过），但必须让作者和审核看见。 */
    const s = script ? {
      err: scriptQA.err, warn: scriptQA.warn,
      script: { ok: scriptQA.ok, chapters: scriptQA.stats.chapters, scenes: scriptQA.stats.scenes, choices: scriptQA.stats.choices, orient: scriptQA.stats.orient },
      assets: pkgQA ? { coverage: pkgQA.coverage, missing: pkgQA.missing, unused: pkgQA.unused, warnings: pkgQA.warnings } : null,
    } : L.structureQA(w.pack);
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
  if (b.op === 'block') {
    const r = await sql('SELECT author,author_name FROM works WHERE id=$1', [String(b.id || '')]);
    if (!r[0] || !r[0].author) return L.bad(res, 'not found', 404);
    if (r[0].author === u.uid) return L.bad(res, 'cannot block yourself', 400);
    await sql('INSERT INTO user_blocks (user_id,author_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [u.uid,r[0].author]);
    return L.send(res,200,{ok:true,author_id:r[0].author,name:r[0].author_name});
  }
  if (b.op === 'unblock') {
    await sql('DELETE FROM user_blocks WHERE user_id=$1 AND author_id=$2', [u.uid,String(b.author || '')]);
    return L.send(res,200,{ok:true});
  }
  if (b.op === 'report') {
    const id = String(b.id || '');
    const kind = ['work','message','asset','other'].includes(b.kind) ? b.kind : 'work';
    await sql('INSERT INTO reports (user_id, target_kind, target_id, reason, snapshot) VALUES ($1,$2,$3,$4,$5)', [u.uid, kind, id, String(b.reason || '').slice(0, 300), String(b.snap || '').slice(0, 4000)]);
    const r = kind === 'work' ? await sql("UPDATE works SET reports=reports+1, status=CASE WHEN reports+1>=$2 AND status='live' THEN 'pending' ELSE status END WHERE id=$1 RETURNING status", [id, Number(cfg.report_threshold) || 5]) : [];
    return L.send(res, 200, { ok: true, status: r[0] && r[0].status });
  }
  L.bad(res, 'unknown op');
});
