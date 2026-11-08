// api/_board.js — 打榜（每周角色人气榜）+ 任务（服务器判定的赚钻任务）。2026-11-07。
//
// 不是独立路由（Vercel Hobby 最多 12 个函数），从 /api/wallet 进来：
//   GET  /api/wallet?r=rank&orient=bl|bg|gl|all        本周榜单；带 token 时附上「我」的票数和今天剩几张免费票
//   GET  /api/wallet?r=rank&fans=<cid>                  本周给 TA 投票最多的 10 个人（应援榜）
//   POST /api/wallet?r=rank {op:'vote', cid, n, key}    用免费票投；免费票不够 → 402 {need:'buy'}
//   POST /api/wallet?r=rank {op:'buy',  cid, pack, key} 花钻买票并直接投给 TA（pack: s=1💎/5票 · m=5💎/30票）
//   POST /api/wallet?r=rank {op:'share'}                每天分享一次 +1 张免费票
//   GET  /api/wallet?r=tasks                            任务列表，进度由服务器从数据里算
//   POST /api/wallet?r=tasks {op:'claim', id}           达标才发钻（幂等、受 earn_cap 每日上限约束）
//
// 数据来源（都是服务器已有的或本模块的表，不信任客户端报的“完成了”）：
//   votes        本模块建：每一票一行（免费 / 分享 / 付费）
//   task_claims  本模块建：每个任务每个周期最多领一次
//   events       已有：chapter_done / story_end / talk（客户端埋点，按登录用户记）
//   user_days    已有：每个活跃日一行（needActive 时写）
//   works        已有：作品是否在线、作者
// 角色名单 = art/official/leads.json 里的官方男主卡（id 规则和 source/src/app126_leads.js 一致），作品下线就出榜。
// 时间一律按 UTC：日 = UTC 日期，周 = UTC 周一 00:00 开始。
const fs = require('fs');
const path = require('path');
const L = require('./_lib');
const WRITES = require('./_boardwrite');

const VOTE_HEAT = 520, TALK_HEAT = 20, CHAPTER_HEAT = 10, TALK_CAP = 50;
const PACKS = { s: { gems: 1, votes: 5 }, m: { gems: 5, votes: 30 } };

/* ---------- tables (created on first use; nothing touches api/_lib.js) ---------- */
let _ready = null;
function ready(sql) {
  if (!_ready) _ready = (async () => {
    const installed = await sql("SELECT to_regclass('public.votes') IS NOT NULL AND to_regclass('public.task_claims') IS NOT NULL AND to_regprocedure('public.miru_board_write(text,jsonb)') IS NOT NULL AS ready");
    if (installed[0] && installed[0].ready) return;
    if (process.env.MIRU_SKIP_SCHEMA === '1') { const e = new Error('board schema migration required'); e.code = 503; throw e; }
    for (const q of [
      `CREATE TABLE IF NOT EXISTS votes (id BIGSERIAL PRIMARY KEY, week DATE NOT NULL, day DATE NOT NULL, cid TEXT NOT NULL, user_id TEXT NOT NULL, n INT NOT NULL, src TEXT NOT NULL, key TEXT UNIQUE, at TIMESTAMPTZ DEFAULT now())`,
      `CREATE INDEX IF NOT EXISTS votes_week_cid_idx ON votes (week, cid)`,
      `CREATE INDEX IF NOT EXISTS votes_user_day_idx ON votes (user_id, day)`,
      `CREATE TABLE IF NOT EXISTS task_claims (user_id TEXT NOT NULL, task TEXT NOT NULL, period TEXT NOT NULL, reward INT, at TIMESTAMPTZ DEFAULT now(), PRIMARY KEY (user_id, task, period))`,
    ]) await sql(q);
    await sql(WRITES.INSTALL);
  })().catch(e => { _ready = null; throw e; });
  return _ready;
}

/* ---------- time ---------- */
const dayOf = d => d.toISOString().slice(0, 10);
function today() { return dayOf(new Date()); }
function weekOf(d) { const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())); x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7)); return dayOf(x); }
function thisWeek() { return weekOf(new Date()); }
function lastWeek() { const d = new Date(thisWeek() + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() - 7); return dayOf(d); }
function nextDay(s) { const d = new Date(s + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + 1); return dayOf(d); }
function plusDays(s, n) { const d = new Date(s + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return dayOf(d); }

/* ---------- catalog: official lead cards that are live ---------- */
let _cat = null, _catAt = 0;
async function catalog(sql, req) {
  if (_cat && Date.now() - _catAt < 60e3) return _cat;
  let j = null;
  try { j = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'art', 'official', 'leads.json'), 'utf8')); } catch (_) {}
  if (!j) { try { const r = await fetch('https://' + req.headers.host + '/art/official/leads.json'); if (r.ok) j = await r.json(); } catch (_) {} }
  const works = (j && Array.isArray(j.works)) ? j.works : [];
  const ids = works.map(w => w.wid);
  const live = new Set(ids.length ? (await sql(`SELECT id FROM works WHERE status='live' AND id = ANY($1)`, [ids])).map(r => r.id) : []);
  const chars = [];
  works.forEach(w => {
    if (!live.has(w.wid)) return;
    (w.leads || []).forEach(x => chars.push({ cid: 'ld_' + w.wid.slice(-8) + '_' + x.key, wid: w.wid, orient: w.orient || 'bg', n: x.n || {} }));
  });
  _cat = { chars, byId: new Map(chars.map(c => [c.cid, c])) }; _catAt = Date.now();
  return _cat;
}
/* 客户端埋点里作品的 wid 有三种写法：社区 id 本身（cw 字段）、bible 剧的本地 id（bw_ + 去符号后 12 位）、男主卡世界（ldw_ + id） */
const localIds = wid => [wid, 'bw_' + wid.replace(/[^a-z0-9]/gi, '').slice(-12), 'ldw_' + wid];

/* ---------- board ---------- */
const _board = new Map();
async function board(sql, req, week) {
  const hit = _board.get(week); if (hit && Date.now() - hit.at < 30e3) return hit.rows;
  const cat = await catalog(sql, req), next = plusDays(week, 7);
  const [votes, talk, chap] = await Promise.all([
    sql(`SELECT cid, SUM(n)::int AS v, COUNT(DISTINCT user_id)::int AS f FROM votes WHERE week=$1 GROUP BY cid`, [week]),
    sql(`SELECT cid, SUM(LEAST(c, $3))::int AS t FROM (SELECT props->>'cid' AS cid, user_id, COUNT(*) AS c FROM events
         WHERE name='talk' AND at >= $1::date AND at < $2::date AND props->>'cid' LIKE 'ld\\_%' AND user_id IS NOT NULL GROUP BY 1, 2) x GROUP BY cid`, [week, next, TALK_CAP]),
    sql(`SELECT COALESCE(props->>'cw', props->>'wid') AS w, COUNT(DISTINCT user_id || ':' || COALESCE(props->>'ch', '') || ':' || COALESCE(props->>'sess', ''))::int AS c FROM events
         WHERE name='chapter_done' AND at >= $1::date AND at < $2::date AND user_id IS NOT NULL GROUP BY 1`, [week, next]),
  ]);
  const V = new Map(votes.map(r => [r.cid, r])), T = new Map(talk.map(r => [r.cid, r.t])), CH = new Map(chap.map(r => [r.w, r.c]));
  const rows = cat.chars.map(c => {
    const v = V.get(c.cid), t = T.get(c.cid) || 0, ch = localIds(c.wid).reduce((n, k) => n + (CH.get(k) || 0), 0);
    return { cid: c.cid, wid: c.wid, orient: c.orient, votes: v ? v.v : 0, fans: v ? v.f : 0, talk: t, chapters: ch, heat: (v ? v.v : 0) * VOTE_HEAT + t * TALK_HEAT + ch * CHAPTER_HEAT };
  }).sort((a, b) => b.heat - a.heat || a.cid.localeCompare(b.cid));
  _board.set(week, { at: Date.now(), rows });
  return rows;
}
function ranked(rows, orient) {
  const o = String(orient || 'all');
  return rows.filter(r => o === 'all' || r.orient === o || r.orient === 'all').map((r, i) => Object.assign({}, r, { rank: i + 1 }));
}

/* ---------- my votes today ---------- */
async function myDay(sql, uid, cfg) {
  const d = today();
  const r = await sql(`SELECT src, SUM(n)::int AS n FROM votes WHERE user_id=$1 AND day=$2 GROUP BY src`, [uid, d]);
  const used = {}; r.forEach(x => used[x.src] = x.n);
  const shared = (await sql(`SELECT 1 FROM task_claims WHERE user_id=$1 AND task='vote_share' AND period=$2`, [uid, 'd:' + d])).length > 0;
  const free = (Number(cfg.vote_free_daily) || 3) + (shared ? 1 : 0);
  return { left: Math.max(0, free - (used.free || 0)), free, shared, paid: used.paid || 0, any: Object.values(used).reduce((a, b) => a + b, 0) };
}
const nameOf = (u, id) => { const n = String((u && u.name) || '').trim(); return n && !/@/.test(n) ? n.slice(0, 24) : 'MIRU-' + String(id).slice(-4); };

async function rank(req, res, ctx) {
  const sql = await L.db(); await ready(sql); const q = req.query || {}, cfg = await L.config();
  if (req.method === 'GET') {
    const week = thisWeek();
    if (q.fans) {
      const r = await sql(`SELECT v.user_id, SUM(v.n)::int AS n, MAX(u.name) AS name FROM votes v LEFT JOIN users u ON u.id = v.user_id
                           WHERE v.week=$1 AND v.cid=$2 GROUP BY v.user_id ORDER BY n DESC LIMIT 10`, [week, String(q.fans)]);
      return L.send(res, 200, { week, fans: r.map((x, i) => ({ rank: i + 1, name: nameOf(x, x.user_id), votes: x.n })) });
    }
    const rows = ranked(await board(sql, req, week), q.orient);
    const champs = ranked(await board(sql, req, lastWeek()), q.orient).filter(r => r.heat > 0).slice(0, 3).map(r => r.cid);
    const out = { week, resetsAt: plusDays(week, 7) + 'T00:00:00Z', rows, champs };
    const u = L.who(req);
    if (u) {
      const mine = await sql(`SELECT cid, SUM(n)::int AS n FROM votes WHERE user_id=$1 AND week=$2 GROUP BY cid`, [u.uid, week]);
      out.me = Object.assign(await myDay(sql, u.uid, cfg), { votes: Object.fromEntries(mine.map(r => [r.cid, r.n])) });
    }
    return L.send(res, 200, out);
  }
  const u = await L.needActive(req, res); if (!u) return;
  const b = L.jsonBody(req), op = String(b.op || '');
  if (op === 'share') {
    await sql(`INSERT INTO task_claims (user_id, task, period, reward) VALUES ($1, 'vote_share', $2, 0) ON CONFLICT DO NOTHING`, [u.uid, 'd:' + today()]);
    return L.send(res, 200, { me: await myDay(sql, u.uid, cfg) });
  }
  const cat = await catalog(sql, req), c = cat.byId.get(String(b.cid || ''));
  if (!c) return L.bad(res, 'unknown character');
  const key = b.key ? String(b.key).slice(0, 60) : null, week = thisWeek(), day = today();
  if (!key) return L.bad(res, 'key required');
  const vkey = key ? (op === 'buy' ? 'buy:' : 'vote:') + u.uid + ':' + key : null;
  let change;
  if (op === 'vote') {
    const n = Math.floor(Number(b.n) || 1); if (!(n >= 1 && n <= 10)) return L.bad(res, 'bad n');
    change = await WRITES.write(sql, u.uid, { op, day, week, cid: c.cid, key: vkey, n, cap: Number(cfg.vote_free_daily) || 3 });
  } else if (op === 'buy') {
    const p = PACKS[b.pack]; if (!p) return L.bad(res, 'bad pack');
    change = await WRITES.write(sql, u.uid, { op, day, week, cid: c.cid, key: vkey, n: p.votes, price: p.gems, cap: Number(cfg.vote_paid_daily_cap) || 100 });
  } else return L.bad(res, 'bad op');
  if (change.code) return L.send(res, change.code, Object.assign({}, change, { me: await myDay(sql, u.uid, cfg) }));
  _board.delete(week);
  const rows = ranked(await board(sql, req, week), b.orient || c.orient);
  const mine = await sql(`SELECT cid, SUM(n)::int AS n FROM votes WHERE user_id=$1 AND week=$2 GROUP BY cid`, [u.uid, week]);
  return L.send(res, 200, { ok: true, row: rows.find(r => r.cid === c.cid), rows, gems: change.gems, me: Object.assign(await myDay(sql, u.uid, cfg), { votes: Object.fromEntries(mine.map(r => [r.cid, r.n])) }) });
}

/* ---------- tasks ---------- */
/* 默认任务表；后台 config.tasks（同结构的数组）可以整张替换，改奖励/开关不用发版。 */
const TASKS = [
  { id: 'read1', period: 'day', goal: 1, reward: 1, icon: '📖', go: 'read', t: { zh: '读完 1 章', en: 'Finish a chapter' } },
  { id: 'talk10', period: 'day', goal: 10, reward: 1, icon: '💬', go: 'chat', t: { zh: '和角色聊 10 句', en: 'Send 10 messages to a character' } },
  { id: 'vote1', period: 'day', goal: 1, reward: 1, icon: '🔥', go: 'rank', t: { zh: '打榜投 1 票', en: 'Cast a vote on the chart' } },
  { id: 'ending1', period: 'week', goal: 1, reward: 3, icon: '🎬', go: 'read', t: { zh: '打出 1 个结局', en: 'Reach an ending' } },
  { id: 'days5', period: 'week', goal: 5, reward: 5, icon: '📅', go: null, t: { zh: '本周来 5 天', en: 'Visit on 5 days this week' } },
  { id: 'first_ch', period: 'once', goal: 1, reward: 2, icon: '🌱', go: 'read', newOnly: 14, t: { zh: '新手：读完第一章', en: 'New here: finish your first chapter' } },
  { id: 'publish', period: 'once', goal: 1, reward: 3, icon: '🧬', go: 'create', t: { zh: '发布一部作品并通过审核', en: 'Publish a story that goes live' } },
];
function taskDefs(cfg) { return Array.isArray(cfg.tasks) && cfg.tasks.length ? cfg.tasks : TASKS; }
const periodKey = (p, d, w) => p === 'day' ? 'd:' + d : p === 'week' ? 'w:' + w : 'once';

async function progress(sql, uid) {
  const d = today(), w = thisWeek();
  const [ev, vt, days, pub, user, claims] = await Promise.all([
    sql(`SELECT name, COUNT(*) FILTER (WHERE at >= $2::date)::int AS d, COUNT(*)::int AS w FROM events
         WHERE user_id=$1 AND at >= $3::date AND (name IN ('chapter_done', 'talk') OR (name='story_end' AND COALESCE(props->>'ending', '') <> '')) GROUP BY name`, [uid, d, w]),
    sql(`SELECT COALESCE(SUM(n), 0)::int AS n FROM votes WHERE user_id=$1 AND day=$2`, [uid, d]),
    sql(`SELECT COUNT(*)::int AS n FROM user_days WHERE user_id=$1 AND day >= $2::date`, [uid, w]),
    sql(`SELECT COUNT(*)::int AS n FROM works WHERE author=$1 AND status='live'`, [uid]),
    sql(`SELECT created_at FROM users WHERE id=$1`, [uid]),
    sql(`SELECT task, period FROM task_claims WHERE user_id=$1 AND (period IN ($2, $3, 'once'))`, [uid, 'd:' + d, 'w:' + w]),
  ]);
  const E = {}; ev.forEach(r => E[r.name] = r);
  const created = user[0] && user[0].created_at ? new Date(user[0].created_at) : null;
  let firstCh = 0;
  if (created && Date.now() - created.getTime() < 14 * 864e5) firstCh = (await sql(`SELECT COUNT(*)::int AS n FROM events WHERE user_id=$1 AND name='chapter_done' AND at >= $2`, [uid, created.toISOString()]))[0].n;
  return {
    d, w, created, claimed: new Set(claims.map(c => c.task + '|' + c.period)),
    v: { read1: (E.chapter_done || {}).d || 0, talk10: (E.talk || {}).d || 0, vote1: vt[0].n, ending1: (E.story_end || {}).w || 0, days5: days[0].n, first_ch: firstCh, publish: pub[0].n },
  };
}
function taskList(defs, P) {
  return defs.filter(t => !(t.newOnly && (!P.created || Date.now() - P.created.getTime() > t.newOnly * 864e5) && !P.claimed.has(t.id + '|once'))).map(t => {
    const per = periodKey(t.period, P.d, P.w), got = Math.min(t.goal, P.v[t.src || t.id] || 0), claimed = P.claimed.has(t.id + '|' + per);
    return { id: t.id, period: t.period, icon: t.icon, title: t.t, go: t.go, goal: t.goal, progress: got, reward: t.reward, claimed, claimable: !claimed && got >= t.goal };
  });
}

async function tasks(req, res, ctx) {
  const u = await L.needActive(req, res); if (!u) return;
  const sql = await L.db(); await ready(sql); const cfg = await L.config(), defs = taskDefs(cfg);
  const send = async (code, extra) => L.send(res, code, Object.assign({ tasks: taskList(defs, await progress(sql, u.uid)), day: today(), week: thisWeek(), dayResetsAt: nextDay(today()) + 'T00:00:00Z' }, extra || {}));
  if (req.method === 'GET') return send(200);
  const b = L.jsonBody(req);
  if (b.op !== 'claim') return L.bad(res, 'bad op');
  const t = defs.find(x => x.id === String(b.id || '')); if (!t) return L.bad(res, 'unknown task');
  const P = await progress(sql, u.uid), row = taskList([t], P)[0];
  if (!row) return L.bad(res, 'not available');
  if (row.claimed) return send(409, { error: 'already claimed' });
  if (!row.claimable) return send(409, { error: 'not done yet' });
  const per = periodKey(t.period, P.d, P.w);
  const n = Math.floor(Number(t.reward) || 0);
  if (!(n > 0)) return L.bad(res, 'invalid task reward');
  const change = await WRITES.write(sql, u.uid, { op: 'claim', task: t.id, period: per, day: P.d, week: P.w, n, cap: Number(cfg.earn_cap) || 80 });
  return send(change.code || 200, change);
}

async function handle(req, res, ctx) {
  const r = (req.query || {}).r;
  if (r === 'rank') return rank(req, res, ctx);
  if (r === 'tasks') return tasks(req, res, ctx);
  return L.bad(res, 'bad route', 404);
}
module.exports = { handle, _test: { weekOf, ranked, taskList, periodKey, localIds, TASKS } };
