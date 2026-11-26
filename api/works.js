// /api/works — community stories (UGC)
// GET ?feed=new|hot&lang=&orient=&limit=&before=   live works (no pack body)
// GET ?id=…            one work with its pack (counts a play when &play=1)
// GET ?mine=1          my works, any status
// POST {op:'publish', work:{id?,title,hook,lang,orient,tags,cover,pack}}  → server QA: safety blocks; structure errors → 'pending' (review); clean → 'live'
// POST {op:'like'|'unlike'|'report', id, reason}
// DELETE ?id=          remove my work
const L = require('./_lib');
const MAXPACK_FALLBACK = 1500 * 1024;   // 真正的上限读 config.max_pack_kb
const pub = r => ({ id: r.id, adult: r.adult === true, author: r.author_name || 'MIRU creator', title: r.title, hook: r.hook, lang: r.lang, orient: r.orient, tags: r.tags || [], cover: r.cover, plays: r.plays, likes: r.likes, status: r.status, featured: !!r.featured, created_at: r.created_at, en: r.en || undefined, langs: Array.isArray(r.langs) ? r.langs : (r.pack && r.pack.meta && Array.isArray(r.pack.meta.langs) ? r.pack.meta.langs : undefined), format: r.format || (r.pack && r.pack.meta && r.pack.meta.format) || undefined, media: r.media || (r.pack && r.pack.meta && r.pack.meta.media) || undefined, official: r.official === true || r.author === 'miru' });
/* ---------- 自动补全（2026-11-26）：发现页分类标签 / 人物卡 / 语言 ---------- */
const AUTO_TAGS = [[/mafia|黑帮|教父|cartel/i, 'Mafia'], [/bratva/i, 'Bratva'], [/billionaire|\bceo\b|总裁|富豪|继承人/i, 'Billionaire'], [/vampire|吸血鬼/i, 'Vampires'], [/werewolf|狼人|\balpha\b/i, 'Werewolves'],
  [/hockey|冰球/i, 'Hockey'], [/royal|prince|王子|王储|皇室/i, 'Royal Court'], [/college|campus|大学|校园/i, 'Campus'], [/celebrity|idol|明星|偶像|演员/i, 'Celebrity'], [/dragon|巨龙/i, 'Dragons'],
  [/ghost|鬼魂|幽灵/i, 'Ghosts'], [/\bfae\b|精灵/i, 'Fae'], [/office|上司|职场/i, 'Workplace'], [/wedding|婚礼|新娘/i, 'Wedding'], [/enem(y|ies)|宿敌|死对头/i, 'Enemies to Lovers'],
  [/second chance|破镜|重逢|前任/i, 'Second Chance'], [/fake dating|假情侣|契约恋/i, 'Fake Dating'], [/arranged|联姻/i, 'Arranged Marriage'], [/slow burn|慢热/i, 'Slow Burn'], [/bodyguard|保镖/i, 'Bodyguard'],
  [/forbidden|禁忌/i, 'Forbidden'], [/love triangle|三角恋|修罗场/i, 'Love Triangle'], [/revenge|复仇/i, 'Revenge'], [/hidden identity|secret identity|隐藏身份|秘密身份/i, 'Hidden Identity'],
  [/possessive|占有欲/i, 'Possessive'], [/obsess|偏执/i, 'Obsessive'], [/dark romance|暗黑/i, 'Dark Romance'], [/fantasy|奇幻|魔法/i, 'Romantasy'], [/suspense|悬疑|mystery|谋杀|凶手/i, 'Romantic Suspense']];
function autoMeta(w) {
  const pk = w.pack && typeof w.pack === 'object' ? w.pack : null; if (!pk) return;
  /* 呈现形式（2026-11-26）：按作品实际挂上的素材自动分类，作者不用选也改不了 —— film 影视版 / illus 插画版 / lite 轻读版。
     创作者专区按它筛选、用不同卡片；官方精选也按它分两条道（影视进官方视频排，插画进「创作者精选」）。 */
  try {
    pk.meta = pk.meta && typeof pk.meta === 'object' ? pk.meta : {};
    const all = JSON.stringify(pk);
    const uniq = re => new Set((all.match(re) || []).map(x => x.toLowerCase())).size;
    const img = uniq(/https?:\/\/[^"'\s\\]+?\.(?:jpe?g|png|webp|avif)/gi);
    let vid = uniq(/https?:\/\/[^"'\s\\]+?\.(?:mp4|webm|mov|m3u8)/gi);
    const sc = typeof pk.script === 'string' ? pk.script : '';
    const wp = pk.world && pk.world.pack ? pk.world.pack : pk;
    const ch = sc ? (sc.match(/^#+\s*CHAPTER\s+\d+/gim) || []).length : (Array.isArray(wp.chapters) ? wp.chapters.length : 0);
    const games = (all.match(/⟦MG\||\\?"mg\\?"|\\?"game\\?"/g) || []).length;
    const format = vid >= 1 && img >= Math.max(10, ch * 3) ? 'film' : img >= Math.max(6, ch * 2) ? 'illus' : 'lite';
    pk.meta.media = { img, vid, ch, games };
    pk.meta.format = format;
  } catch (_) {}
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
    /* 待精选（2026-11-26，后台用）：每天自动算出够格的用户作品，运营点「通过」才真正进精选。
       门槛：剧本无必改问题（有 AI 审稿分的要 ≥80）/ 图片位置基本挂齐 / 每章有小游戏 / 读者数和点赞率达标。视频只决定进哪条道。 */
    if (q.candidates) {
      /* 后台登录（admin.html 的令牌）或服务器 ADMIN_KEY 都可以 */
      if (!L.isAdmin(req) && !(typeof L.whoAdmin === 'function' && await L.whoAdmin(req))) return L.bad(res, 'admin only', 403);
      const r = await sql("SELECT id, author, author_name, title, hook, lang, orient, tags, cover, plays, likes, status, featured, created_at, qa, pack->'meta'->'format' AS format, pack->'meta'->'media' AS media, pack->'qa'->'score' AS qscore FROM works WHERE status='live' AND author<>'miru' ORDER BY (likes*3+plays) DESC LIMIT 300");
      const rated = r.filter(w => w.plays >= 20).map(w => w.likes / Math.max(1, w.plays));
      const avgRate = rated.length ? rated.reduce((a, b) => a + b, 0) / rated.length : 0;
      const minPlays = Number(q.min_plays) || 200;
      const list = r.map(w => {
        const qa = w.qa || {}, m = w.media || {}, ch = Number(m.ch) || 0, errs = Array.isArray(qa.err) ? qa.err.length : (Number(qa.err) || 0);
        const rate = w.likes / Math.max(1, w.plays), qs = w.qscore == null ? null : Number(w.qscore);
        const checks = { script: errs === 0 && (qs == null || qs >= 80), assets: (Number(m.img) || 0) >= Math.max(8, Math.round(ch * 3 * 0.8)), games: ch > 0 && (Number(m.games) || 0) >= Math.ceil(ch * 0.8), data: w.plays >= minPlays && rate >= avgRate };
        return Object.assign(pub(w), { checks, pass: Object.values(checks).every(Boolean), lane: w.format === 'film' ? 'film' : 'illus', rate: Math.round(rate * 1000) / 10, qscore: qs });
      });
      return L.send(res, 200, { avgRate: Math.round(avgRate * 1000) / 10, minPlays, works: list.filter(w => !w.featured).sort((a, b) => (b.pass - a.pass) || (b.plays - a.plays)).slice(0, 100), featured: list.filter(w => w.featured) });
    }
    if (q.mine) { const u = await L.needActive(req, res); if (!u) return; const r = await sql("SELECT * FROM works WHERE author=$1" + (native ? " AND COALESCE(pack->'meta'->>'adult','false') <> 'true'" : '') + ' ORDER BY updated_at DESC LIMIT 100', [u.uid]); return L.send(res, 200, { works: r.map(w => Object.assign(pub(w), { qa: w.qa })) }); }
    const lim = Math.min(Number(q.limit) || 20, 50), hot = q.feed === 'hot';
    const args = [lim]; let where = "status='live'";
    if (q.orient && q.orient !== 'all') { args.push(String(q.orient)); where += ` AND (orient=$${args.length} OR orient='all')`; }
    if (q.before) { args.push(new Date(Number(q.before)).toISOString()); where += ` AND created_at < $${args.length}`; }
    if (q.feed === 'featured') where += ' AND featured';
    /* 创作者专区（2026-11-26）：只看用户作品；可按呈现形式筛选 */
    if (q.feed === 'creator') where += " AND author<>'miru'";
    if (q.feed === 'creator_featured') where += " AND featured AND author<>'miru'";
    if (['film', 'illus', 'lite'].includes(String(q.format || ''))) { args.push(String(q.format)); where += ` AND COALESCE(pack->'meta'->>'format','lite')=${args.length}`; }
    const viewer = L.who(req);
    if (viewer) { args.push(viewer.uid); where += ` AND NOT EXISTS (SELECT 1 FROM user_blocks b WHERE b.user_id=$${args.length} AND b.author_id=works.author)`; }
    if (native || !L.adultRegionOk(req, await L.config())) where += " AND COALESCE(pack->'meta'->>'adult','false') <> 'true'";
    const r = await sql(`SELECT id, author_name, title, hook, lang, orient, tags, cover, plays, likes, status, featured, created_at, pack->'meta'->'en' AS en, pack->'meta'->'langs' AS langs, pack->'meta'->'adult' AS adult, pack->'meta'->'format' AS format, pack->'meta'->'media' AS media, (author='miru') AS official FROM works WHERE ${where} ORDER BY featured DESC, ${hot ? '(likes*3+plays) DESC, created_at DESC' : 'created_at DESC'} LIMIT $1`, args);
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
