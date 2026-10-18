// MIRU → LLM proxy (Vercel Edge Function) with automatic failover: LongCat → SCNet → GLM (order via LLM_ORDER).
// Keys are read from environment variables only and never reach the browser:
//   LONGCAT_API_KEY
//   SCNET_API_KEY, SCNET_MODEL (required, e.g. the model name shown in SCNet 模型广场), SCNET_BASE_URL (default https://api.scnet.cn/api/llm/v1)
//   GLM_API_KEY,   GLM_MODEL (default glm-4.5-air),  GLM_BASE_URL (default https://open.bigmodel.cn/api/paas/v4)
//   LLM_ORDER  e.g. "longcat,scnet,glm" (default) — first healthy provider wins; a provider that errors / times out before
//              its first token is skipped and the next one answers, so players never see a broken reply.
// POST {probe:true} → tests every configured provider with a tiny prompt and reports latency/status (for the ops console).
export const config = { runtime: 'edge' };

const LONGCAT_MODELS = ['LongCat-2.0', 'LongCat-2.5-Preview'];
const ALLOWED = [/^https:\/\/468013291jeffery\.github\.io$/, /^https:\/\/[a-z0-9-]+\.vercel\.app$/, /^http:\/\/localhost(:\d+)?$/, /^null$/];
const FIRST_TOKEN_MS = 22000; // give up on a provider that hasn't started answering by then

const env = (k, d) => (typeof process !== 'undefined' && process.env && process.env[k]) || d;
/* SCNet: one key reaches many models. Without SCNET_MODEL we read the account's model list once and pick a good chat model. */
let SCNET_AUTO = null, SCNET_LIST = null, SCNET_AT = 0;
const SCNET_PREF = [/deepseek[-_ ]?v3/i, /qwen3[-_ ]?235b/i, /qwen3/i, /deepseek/i, /qwen/i, /glm/i, /llama/i];
async function scnetResolve() {
  if (env('SCNET_MODEL') || !env('SCNET_API_KEY')) return;
  if (SCNET_AUTO && Date.now() - SCNET_AT < 3600e3) return;
  try {
    const base = env('SCNET_BASE_URL', 'https://api.scnet.cn/api/llm/v1').replace(/\/+$/, '');
    const r = await fetch(base + '/models', { headers: { 'Authorization': 'Bearer ' + env('SCNET_API_KEY') } });
    const j = await r.json();
    const ids = (j.data || j.models || []).map(m => typeof m === 'string' ? m : (m.id || m.name)).filter(Boolean);
    SCNET_LIST = ids;
    const chat = ids.filter(id => !/embed|rerank|vision|vl\b|-vl|ocr|tts|asr|whisper|image|reason|r1\b|-r1|think/i.test(id));
    for (const re of SCNET_PREF) { const hit = chat.find(id => re.test(id)); if (hit) { SCNET_AUTO = hit; break; } }
    if (!SCNET_AUTO) SCNET_AUTO = chat[0] || ids[0] || null;
    SCNET_AT = Date.now();
  } catch (_) {}
}
function providers() {
  const all = {
    longcat: { id: 'longcat', name: 'LongCat', url: 'https://api.longcat.chat/openai/v1/chat/completions', key: env('LONGCAT_API_KEY'), model: m => (LONGCAT_MODELS.includes(m) ? m : LONGCAT_MODELS[0]), extra: { thinking: { type: 'disabled' } }, maxOut: 8000 },
    scnet: { id: 'scnet', name: 'SCNet', url: env('SCNET_BASE_URL', 'https://api.scnet.cn/api/llm/v1').replace(/\/+$/, '') + '/chat/completions', key: env('SCNET_API_KEY'), model: () => env('SCNET_MODEL') || SCNET_AUTO, extra: {}, maxOut: 8000 },
    glm: { id: 'glm', name: 'GLM', url: env('GLM_BASE_URL', 'https://open.bigmodel.cn/api/paas/v4').replace(/\/+$/, '') + '/chat/completions', key: env('GLM_API_KEY'), model: () => env('GLM_MODEL', 'glm-4.5-air'), extra: { thinking: { type: 'disabled' } }, maxOut: 8000 },
  };
  const order = String(env('LLM_ORDER', 'longcat,scnet,glm')).split(',').map(s => s.trim().toLowerCase()).filter(k => all[k]);
  for (const k of Object.keys(all)) if (!order.includes(k)) order.push(k);
  return order.map(k => all[k]).filter(p => p.key && p.model(''));
}

function cors(origin) {
  const ok = !origin || ALLOWED.some(r => r.test(origin));
  return { ok, headers: { 'Access-Control-Allow-Origin': ok && origin ? origin : 'null', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Expose-Headers': 'X-MIRU-Provider', 'Vary': 'Origin' } };
}
const J = (o, status, h) => new Response(JSON.stringify(o), { status, headers: { ...h, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/* open a streaming completion on one provider; resolves once the upstream answered with a 2xx and the first chunk arrived */
async function open(p, clean) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), FIRST_TOKEN_MS);
  try {
    const body = { ...clean, ...p.extra, model: p.model(clean.model), max_tokens: Math.min(clean.max_tokens, p.maxOut), stream: true };
    const up = await fetch(p.url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + p.key }, body: JSON.stringify(body), signal: ctl.signal });
    if (!up.ok) { const e = await up.text().catch(() => ''); throw new Error(p.name + ' ' + up.status + ' ' + e.slice(0, 200)); }
    const rd = up.body.getReader(); const first = await rd.read(); // waits for the first bytes (still under the timer)
    clearTimeout(t);
    if (first.done) throw new Error(p.name + ' empty response');
    const head = new TextDecoder().decode(first.value);
    if (/"error"\s*:/.test(head) && !/"choices"/.test(head)) throw new Error(p.name + ' ' + head.slice(0, 200));
    return { rd, first: first.value, ctl };
  } catch (e) { clearTimeout(t); try { ctl.abort(); } catch (_) {} throw e.name === 'AbortError' ? new Error(p.name + ' timeout') : e; }
}

export default async function handler(req) {
  const origin = req.headers.get('origin');
  const c = cors(origin);
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: c.headers });
  if (req.method !== 'POST') return new Response('POST only', { status: 405, headers: c.headers });
  if (!c.ok) return J({ error: { message: 'origin not allowed' } }, 403, c.headers);
  await scnetResolve();
  let body;
  try { body = await req.json(); } catch { return J({ error: { message: 'bad json' } }, 400, c.headers); }
  const list = providers();
  if (!list.length) return J({ error: { message: 'no LLM provider configured (LONGCAT_API_KEY / SCNET_API_KEY / GLM_API_KEY)' } }, 500, c.headers);

  /* ops probe: which providers answer right now */
  if (body.probe) {
    const res = await Promise.all(list.map(async p => {
      const t0 = Date.now();
      try { const o = await open(p, { model: '', messages: [{ role: 'user', content: '只回复：好' }], max_tokens: 8, temperature: 0 }); try { o.ctl.abort(); } catch (_) {} return { id: p.id, name: p.name, model: p.model(''), ok: true, ms: Date.now() - t0 }; }
      catch (e) { return { id: p.id, name: p.name, model: p.model(''), ok: false, ms: Date.now() - t0, error: String(e.message || e).slice(0, 200) }; }
    }));
    return J({ order: list.map(p => p.id), providers: res, scnet_models: SCNET_LIST || undefined, scnet_auto: SCNET_AUTO || undefined, configured: { longcat: !!env('LONGCAT_API_KEY'), scnet: !!env('SCNET_API_KEY'), glm: !!env('GLM_API_KEY') } }, 200, c.headers);
  }

  // Only pass through what MIRU uses, with hard caps so the proxy can't be used for huge jobs.
  const clean = {
    model: String(body.model || ''),
    messages: Array.isArray(body.messages) ? body.messages.slice(-40).map(m => ({ role: m.role === 'assistant' ? 'assistant' : m.role === 'system' ? 'system' : 'user', content: String(m.content || '').slice(0, m.role === 'system' ? 80000 : 40000) })) : [],
    max_tokens: Math.min(Number(body.max_tokens) || 1500, 8000),
    temperature: typeof body.temperature === 'number' ? body.temperature : 0.85,
  };
  if (!clean.messages.length) return J({ error: { message: 'no messages' } }, 400, c.headers);
  const only = body.provider && list.find(p => p.id === body.provider); // admin may force one provider
  const chain = only ? [only] : list;

  /* streaming callers: hand back the first provider that starts answering (SSE passes straight through) */
  if (body.stream) {
    const errs = [];
    for (const p of chain) {
      try {
        const o = await open(p, clean);
        const rs = new ReadableStream({ async start(ctrl) { ctrl.enqueue(o.first); for (;;) { const { done, value } = await o.rd.read(); if (done) break; ctrl.enqueue(value); } ctrl.close(); } });
        return new Response(rs, { status: 200, headers: { ...c.headers, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', 'X-MIRU-Provider': p.id } });
      } catch (e) { errs.push(String(e.message || e)); }
    }
    return J({ error: { code: 'all_providers_failed', message: errs.join(' | ').slice(0, 600) } }, 502, c.headers);
  }

  // Non-streaming callers: answer at once and keep the connection alive with whitespace while the model writes, so a slow reply
  // never hits the platform's first-byte limit. Providers are tried in order; the full text is sent as one OpenAI-style JSON at the end.
  const enc = new TextEncoder(), dec = new TextDecoder(), ts = new TransformStream(), w = ts.writable.getWriter();
  (async () => {
    const ka = setInterval(() => { w.write(enc.encode(' ')).catch(() => {}); }, 4000);
    let out = null; const errs = [];
    for (const p of chain) {
      let content = '', finish = null, buf = '';
      const eat = chunk => {
        buf += dec.decode(chunk, { stream: true }); const lines = buf.split('\n'); buf = lines.pop();
        for (const ln of lines) { const t = ln.trim(); if (!t.startsWith('data:')) continue; const d = t.slice(5).trim(); if (d === '[DONE]') continue; try { const j = JSON.parse(d), c0 = (j.choices || [])[0] || {}; if (c0.finish_reason) finish = c0.finish_reason; const dl = c0.delta && c0.delta.content; if (dl) content += dl; } catch (_) {} }
      };
      try {
        const o = await open(p, clean); eat(o.first);
        for (;;) { const { done, value } = await o.rd.read(); if (done) break; eat(value); }
        if (!content.trim()) throw new Error(p.name + ' returned no text');
        out = { provider: p.id, model: p.model(clean.model), choices: [{ index: 0, finish_reason: finish || 'stop', message: { role: 'assistant', content } }] };
        break;
      } catch (e) { errs.push(String(e.message || e)); if (content.trim().length > 200) { out = { provider: p.id, partial: true, choices: [{ index: 0, finish_reason: 'length', message: { role: 'assistant', content } }] }; break; } }
    }
    clearInterval(ka);
    if (!out) out = { error: { code: 'all_providers_failed', message: errs.join(' | ').slice(0, 600) } };
    else if (errs.length) out.fallback_from = errs.map(s => s.slice(0, 120));
    try { await w.write(enc.encode(JSON.stringify(out))); await w.close(); } catch (_) {}
  })();
  return new Response(ts.readable, { status: 200, headers: { ...c.headers, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}
