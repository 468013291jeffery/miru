// MIRU → LongCat proxy (Vercel Edge Function).
// The API key is read from the LONGCAT_API_KEY environment variable and never reaches the browser.
export const config = { runtime: 'edge' };

const UPSTREAM = 'https://api.longcat.chat/openai/v1/chat/completions';
const MODELS = ['LongCat-2.0', 'LongCat-2.5-Preview'];
// Pages allowed to call this proxy (add your own domains here).
const ALLOWED = [/^https:\/\/468013291jeffery\.github\.io$/, /^https:\/\/[a-z0-9-]+\.vercel\.app$/, /^http:\/\/localhost(:\d+)?$/, /^null$/];

function cors(origin) {
  const ok = !origin || ALLOWED.some(r => r.test(origin));
  return { ok, headers: { 'Access-Control-Allow-Origin': ok && origin ? origin : 'null', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' } };
}

export default async function handler(req) {
  const origin = req.headers.get('origin');
  const c = cors(origin);
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: c.headers });
  if (req.method !== 'POST') return new Response('POST only', { status: 405, headers: c.headers });
  if (!c.ok) return new Response(JSON.stringify({ error: { message: 'origin not allowed' } }), { status: 403, headers: { ...c.headers, 'Content-Type': 'application/json' } });
  const key = process.env.LONGCAT_API_KEY;
  if (!key) return new Response(JSON.stringify({ error: { message: 'LONGCAT_API_KEY is not set on the server' } }), { status: 500, headers: { ...c.headers, 'Content-Type': 'application/json' } });
  let body;
  try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: { message: 'bad json' } }), { status: 400, headers: { ...c.headers, 'Content-Type': 'application/json' } }); }
  // Only pass through what MIRU uses, with hard caps so the proxy can't be used for huge jobs.
  const clean = {
    model: MODELS.includes(body.model) ? body.model : MODELS[0],
    messages: Array.isArray(body.messages) ? body.messages.slice(-40).map(m => ({ role: m.role === 'assistant' ? 'assistant' : m.role === 'system' ? 'system' : 'user', content: String(m.content || '').slice(0, 24000) })) : [],
    max_tokens: Math.min(Number(body.max_tokens) || 1500, 4000),
    temperature: typeof body.temperature === 'number' ? body.temperature : 0.85,
    stream: !!body.stream,
    thinking: { type: 'disabled' },
  };
  if (!clean.messages.length) return new Response(JSON.stringify({ error: { message: 'no messages' } }), { status: 400, headers: { ...c.headers, 'Content-Type': 'application/json' } });
  if (clean.stream) {
    const up = await fetch(UPSTREAM, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key }, body: JSON.stringify(clean) });
    return new Response(up.body, { status: up.status, headers: { ...c.headers, 'Content-Type': up.headers.get('content-type') || 'application/json', 'Cache-Control': 'no-store' } });
  }
  // Non-streaming callers: answer at once and keep the connection alive with whitespace while LongCat writes, so a slow reply never
  // hits the platform's 25-second first-byte limit (that was the source of the 504s → canned fallback lines in free talk).
  // The model is still called in streaming mode; the full text is sent as one OpenAI-style JSON at the end (leading spaces are valid JSON).
  const enc = new TextEncoder(), ts = new TransformStream(), w = ts.writable.getWriter();
  (async () => {
    let content = '', finish = null, status = 200, errText = '';
    const ka = setInterval(() => { w.write(enc.encode(' ')).catch(() => {}); }, 4000);
    try {
      const up = await fetch(UPSTREAM, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key }, body: JSON.stringify({ ...clean, stream: true }) });
      if (!up.ok) { status = up.status; errText = await up.text().catch(() => ''); }
      else {
        const rd = up.body.getReader(), dec = new TextDecoder(); let buf = '';
        for (;;) {
          const { done, value } = await rd.read(); if (done) break;
          buf += dec.decode(value, { stream: true }); const lines = buf.split('\n'); buf = lines.pop();
          for (const ln of lines) { const t = ln.trim(); if (!t.startsWith('data:')) continue; const d = t.slice(5).trim(); if (d === '[DONE]') continue; try { const j = JSON.parse(d), c0 = (j.choices || [])[0] || {}; if (c0.finish_reason) finish = c0.finish_reason; const dl = c0.delta && c0.delta.content; if (dl) content += dl; } catch (_) {} }
        }
      }
    } catch (e) { status = 502; errText = String(e && e.message || e); }
    clearInterval(ka);
    const out = status === 200 ? { choices: [{ index: 0, finish_reason: finish || 'stop', message: { role: 'assistant', content } }] } : { error: { code: 'upstream_' + status, message: errText.slice(0, 300) } };
    try { await w.write(enc.encode(JSON.stringify(out))); await w.close(); } catch (_) {}
  })();
  return new Response(ts.readable, { status: 200, headers: { ...c.headers, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}
