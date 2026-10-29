// /api/studio — the Creator's AI steps run HERE, not inside the 9 MB bundle.
// Why: each step used to be a prompt hard-coded in source/src/app50_creator2.js, so changing one sentence
// meant rebuild → 45 gates → deploy. Now the prompt lives in the console config (`config` table, key `studio`)
// and the model call happens server-side: edit in the console, save, the next request already uses it.
//
//   GET                     → { sys, order, max_tokens, tasks:[{id,name,on,role,prompt}] }
//   POST ?r=<task> {payload} → { ok, json, raw, ms }
//
// Templates are plain text with {{placeholders}} filled from the request payload (see TASKS for the ones a step uses).
// Unknown placeholders render as empty strings, so a half-written template never throws.
const L = require('./_lib');

const TASK_IDS = ['guide-turn', 'plan', 'options', 'rewrite', 'step-suggest'];
const MAX_VAR = 8000;

const fmtVar = v => {
  if (v == null) return '';
  if (typeof v === 'string') return v.slice(0, MAX_VAR);
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  try { return JSON.stringify(v).slice(0, MAX_VAR); } catch (_) { return ''; }
};
function fill(tmpl, p) {
  return String(tmpl || '').replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_, k) => fmtVar(p[k]));
}
/* step-suggest branches on whether the author is answering a choice or a free question; that branch is
   server-side now (it used to be an inline ternary in the bundle), so the template stays one readable block. */
function expand(id, payload) {
  if (id !== 'step-suggest') return payload;
  const o = Array.isArray(payload.options) ? payload.options.filter(x => typeof x === 'string' && x.trim()) : [];
  payload.optionsText = o.length
    ? 'Options they can pick (mode ' + (payload.mode || '') + '): ' + o.join(' | ') + '\nIf it is a choice question, start with the best option(s) copied exactly, then one sentence why. '
    : 'Otherwise write a ready-to-use answer (max 120 Chinese characters) that fits everything they chose before.';
  return payload;
}
function pickJson(raw) {
  const s = String(raw || '').replace(/```(?:json)?/g, '');
  const i = s.search(/[\[{]/);
  if (i < 0) return null;
  const open = s[i], close = open === '{' ? '}' : ']', j = s.lastIndexOf(close);
  if (j <= i) return null;
  try { return JSON.parse(s.slice(i, j + 1)); } catch (_) { return null; }
}

module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res, 'GET, POST, OPTIONS')) return;
  const u = L.who(req);
  /* 后台「试跑」走 admin token 这一道门（不必为了看一眼效果去注册一个账号）；玩家侧仍然只要用户 token。 */
  let A = null;
  if (!u || !u.uid) { try { A = await L.whoAdmin(req); } catch (_) {} }
  if ((!u || !u.uid) && !A) return L.bad(res, '请先登录', 401);
  const uid = (u && u.uid) || ('admin:' + (A && A.id));

  const cfg = await L.config();
  const st = (cfg.studio && typeof cfg.studio === 'object') ? cfg.studio : {};
  const tasks = (st.tasks && typeof st.tasks === 'object') ? st.tasks : {};
  const view = id => ({
    id,
    name: (tasks[id] && tasks[id].name) || id,
    on: !(tasks[id] && tasks[id].on === false),
    role: (tasks[id] && tasks[id].role) || '',
    prompt: (tasks[id] && tasks[id].prompt) || '',
  });

  if (req.method === 'GET') {
    return L.send(res, 200, {
      sys: st.sys || '',
      order: st.order || '',
      max_tokens: Number(st.max_tokens) || 1200,
      tasks: TASK_IDS.map(view),
    });
  }
  if (req.method !== 'POST') return L.bad(res, 'GET or POST', 405);

  const id = String((req.query || {}).r || '');
  if (TASK_IDS.indexOf(id) < 0) return L.bad(res, '未知步骤: ' + (id || '(空)'), 404);
  const t = tasks[id] || {};
  if (t.on === false) return L.bad(res, '这一步已在后台停用', 403);
  if (!(await L.bump('studio:' + uid, 'studio', 90))) return L.bad(res, '太频繁了，缓一下再试', 429);

  const b = L.jsonBody(req);
  const payload = expand(id, (b && b.payload && typeof b.payload === 'object') ? b.payload : {});
  const user = fill(t.prompt || '', payload).trim();
  if (!user) return L.bad(res, '这一步的 prompt 是空的（后台 → API 台 里补上）', 500);
  /* the two per-project injections that used to be spliced in by the bundle (crSys): the author's role rules
     and the story's system1 rules. They stay request data (the server has no idea which project this is). */
  const extra = [];
  if (payload.roleRules) extra.push('Your role rules (follow them): ' + String(payload.roleRules).slice(0, 600));
  if (payload.storyRules) extra.push('Story rules: ' + String(payload.storyRules).slice(0, 900));
  if (t.role) extra.push('ROLE: ' + t.role);
  const sys = [fill(st.sys || '', payload).trim()].concat(extra).filter(Boolean).join('\n\n');

  const t0 = Date.now();
  let raw = '';
  try {
    raw = await L.llm(
      [{ role: 'system', content: sys }, { role: 'user', content: user }],
      Number(st.max_tokens) || 1200, 45000, st.order || '', st.temp == null ? 0.7 : Number(st.temp)
    );
  } catch (e) {
    return L.bad(res, '模型调用失败: ' + String((e && e.message) || e).slice(0, 200), 502);
  }
  return L.send(res, 200, { ok: true, json: pickJson(raw), raw: String(raw).slice(0, 4000), ms: Date.now() - t0 });
});
