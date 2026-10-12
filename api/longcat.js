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
  const up = await fetch(UPSTREAM, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key }, body: JSON.stringify(clean) });
  return new Response(up.body, { status: up.status, headers: { ...c.headers, 'Content-Type': up.headers.get('content-type') || 'application/json', 'Cache-Control': 'no-store' } });
}
