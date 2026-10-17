// MIRU → character voice (TTS) proxy · Vercel Node function
// GET /api/tts?t=<text ≤200>&v=<voice id>&e=<8 emotion weights, comma separated>&l=zh|en
// Providers, first one configured wins:
//   1) TTS_URL  — your own OpenAI-compatible speech server (CosyVoice / IndexTTS / GPT-SoVITS behind /v1/audio/speech). Optional TTS_KEY, TTS_MODEL.
//   2) Hugging Face Space IndexTTS-2 (bilibili IndexTTS2 · free for commercial use under 100M MAU / ¥100M revenue) via the Gradio API.
//      Set HF_TOKEN for a personal GPU quota (without it the Space treats every call as anonymous and the free quota runs out fast).
// Voice references are real, consented Mandarin speakers from AISHELL-3 (Apache-2.0), adults only (age groups 26-40 / 41+).
// Successful audio is cached on Vercel's CDN for a year, so each line is synthesised once for everyone.
const SPACE = process.env.TTS_SPACE_URL || 'https://indexteam-indextts-2-demo.hf.space';
const A3 = 'https://huggingface.co/datasets/AISHELL/AISHELL-3/resolve/main/train/wav/';
const VOICES = {
  m1: A3 + 'SSB0784/SSB07840004.wav', m2: A3 + 'SSB0609/SSB06090002.wav', m3: A3 + 'SSB0590/SSB05900005.wav',
  m4: A3 + 'SSB0710/SSB07100005.wav', m5: A3 + 'SSB0261/SSB02610003.wav', m6: A3 + 'SSB0407/SSB04070004.wav',
  m7: A3 + 'SSB0434/SSB04340001.wav',
  f1: A3 + 'SSB0534/SSB05340001.wav', f2: A3 + 'SSB0599/SSB05990003.wav',
};
const ALLOWED = [/^https:\/\/468013291jeffery\.github\.io$/, /^https:\/\/[a-z0-9-]+\.vercel\.app$/, /^http:\/\/localhost(:\d+)?$/, /^null$/];
const LABELS = { same: ['Same as the voice reference', '与音色参考音频相同'], vec: ['Use emotion vectors', '使用情感向量控制'] };

function cors(req, res) {
  const o = req.headers.origin;
  const ok = !o || ALLOWED.some(r => r.test(o));
  res.setHeader('Access-Control-Allow-Origin', ok && o ? o : '*');
  res.setHeader('Vary', 'Origin');
  return ok;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function viaOpenAI(text, voice) {
  const r = await fetch(process.env.TTS_URL.replace(/\/$/, '') + '/v1/audio/speech', {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...(process.env.TTS_KEY ? { Authorization: 'Bearer ' + process.env.TTS_KEY } : {}) },
    body: JSON.stringify({ model: process.env.TTS_MODEL || 'tts-1', input: text, voice, response_format: 'mp3' }),
  });
  if (!r.ok) throw new Error('tts server ' + r.status);
  return { buf: Buffer.from(await r.arrayBuffer()), type: r.headers.get('content-type') || 'audio/mpeg' };
}

async function gradioOnce(label, ref, text, vec, deadline) {
  const H = { 'Content-Type': 'application/json', ...(process.env.HF_TOKEN ? { Authorization: 'Bearer ' + process.env.HF_TOKEN } : {}) };
  const file = { path: ref, url: ref, orig_name: 'ref.wav', meta: { _type: 'gradio.FileData' } };
  const data = [label, file, text, null, 0.8, ...vec, '', false, 120, true, 0.8, 30, 0.8, 0.0, 3, 10.0, 1500];
  const s = await fetch(SPACE + '/gradio_api/call/gen_single', { method: 'POST', headers: H, body: JSON.stringify({ data }) });
  if (!s.ok) throw new Error('space submit ' + s.status);
  const { event_id } = await s.json();
  const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), Math.max(1000, deadline - Date.now()));
  let txt = '';
  try { const r = await fetch(SPACE + '/gradio_api/call/gen_single/' + event_id, { headers: H, signal: ctl.signal }); txt = await r.text(); }
  finally { clearTimeout(tm); }
  const blocks = txt.split(/\n\n+/);
  const done = blocks.find(b => /^event:\s*complete/m.test(b));
  if (!done) { const err = blocks.find(b => /^event:\s*error/m.test(b)); throw new Error('space ' + (err ? err.replace(/\s+/g, ' ').slice(0, 200) : 'no result')); }
  const json = JSON.parse(done.split(/\ndata:\s*/)[1]);
  const out = Array.isArray(json) ? json[0] : json;
  const f = (out && out.value) || out;
  const url = f && (f.url || (f.path && SPACE + '/gradio_api/file=' + f.path));
  if (!url) throw new Error('no audio url');
  const a = await fetch(url, { headers: H });
  if (!a.ok) throw new Error('audio ' + a.status);
  return { buf: Buffer.from(await a.arrayBuffer()), type: a.headers.get('content-type') || 'audio/wav' };
}

async function viaSpace(text, voice, vec) {
  const ref = VOICES[voice] || VOICES.m1;
  const useVec = vec.some(x => x > 0);
  const deadline = Date.now() + 55000;
  let last;
  for (const label of (useVec ? LABELS.vec : LABELS.same)) {
    try { return await gradioOnce(label, ref, text, useVec ? vec : [0, 0, 0, 0, 0, 0, 0, 0], deadline); }
    catch (e) { last = e; if (!/choice|not in|value/i.test(String(e.message))) break; }
  }
  throw last;
}

module.exports = async (req, res) => {
  const ok = cors(req, res);
  if (req.method === 'OPTIONS') { res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); res.status(204).end(); return; }
  if (!ok) { res.status(403).json({ error: 'origin not allowed' }); return; }
  const q = req.query || {};
  if (q.ping) { res.setHeader('Cache-Control', 'no-store'); res.status(200).json({ ok: true, provider: process.env.TTS_URL ? 'server' : 'space', token: !!process.env.HF_TOKEN, voices: Object.keys(VOICES) }); return; }
  const text = String(q.t || '').replace(/[*（）()]/g, '').trim().slice(0, 200);
  if (!text) { res.status(400).json({ error: 'no text' }); return; }
  const voice = String(q.v || 'm1').slice(0, 12);
  const vec = String(q.e || '').split(',').slice(0, 8).map(x => Math.max(0, Math.min(1, +x || 0)));
  while (vec.length < 8) vec.push(0);
  try {
    const out = process.env.TTS_URL ? await viaOpenAI(text, voice) : await viaSpace(text, voice, vec);
    const riff = out.buf.slice(0, 4).toString() === 'RIFF';
    res.setHeader('Content-Type', /^audio\//.test(out.type) ? out.type : (riff ? 'audio/wav' : 'audio/mpeg'));
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=31536000, immutable');
    res.status(200).send(out.buf);
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ error: String(e && e.message || e).slice(0, 300) });
  }
};
