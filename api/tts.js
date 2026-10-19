// MIRU → character voice (TTS) proxy · Vercel Node function
// GET /api/tts?t=<text ≤200>&v=<voice id>&e=<8 emotion weights, comma separated>&l=zh|en
// Qwen-TTS (qwen3-tts-flash) is the main voice for every line when DASHSCOPE_INTL_API_KEY / DASHSCOPE_API_KEY is set.
// English lines: Inworld TTS-2 when INWORLD_API_KEY is set (Basic credentials copied from the Inworld portal, used as-is).
//   Our voice slots (m1…m7, f1, f2) are matched once to Inworld's English preset voices by their tags; override with INWORLD_VOICE_MAP='{"m1":"Edward",…}'.
//   INWORLD_MODEL (default inworld-tts-2; inworld-tts-2-flash is cheaper/faster).
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

/* ---------- Qwen-TTS (Alibaba Model Studio) · main voice for Chinese and English when a key is set ----------
   DASHSCOPE_INTL_API_KEY (international console) or DASHSCOPE_API_KEY (China console); optional DASHSCOPE_BASE_URL (workspace host),
   QWEN_TTS_MODEL (default qwen3-tts-flash), QWEN_VOICE_MAP='{"m1":"Moon",…}'. Every system voice speaks both Mandarin and English. */
const QWEN_WS = 'https://ws-cnxfgp13wlelgkbu.ap-southeast-1.maas.aliyuncs.com';
const QV = { m1: 'Moon', m2: 'Ethan', m3: 'Andre', m4: 'Alek', m5: 'Kai', m6: 'Mochi', m7: 'Ryan', f1: 'Serena', f2: 'Katerina' };
let QSITE = null, QBASE = null;
function qwenSites() {
  const E = process.env, intl = E.DASHSCOPE_INTL_API_KEY, cn = E.DASHSCOPE_API_KEY || E.QWEN_API_KEY, out = [];
  const add = (base, key) => { if (key && base) { base = base.replace(/\/+$/, '').replace(/\/(compatible-mode|api)\/.*$/, ''); if (!out.some(x => x.base === base && x.key === key)) out.push({ base, key }); } };
  if (E.DASHSCOPE_BASE_URL) add(E.DASHSCOPE_BASE_URL, intl || cn);
  if (intl) { add(QWEN_WS, intl); add('https://dashscope-intl.aliyuncs.com', intl); }
  if (cn) { add('https://dashscope.aliyuncs.com', cn); add(QWEN_WS, cn); add('https://dashscope-intl.aliyuncs.com', cn); }
  if (QSITE) out.sort((a, b) => (b.base + b.key === QSITE) - (a.base + a.key === QSITE));
  return out;
}
function qwenVoice(v) { let m = {}; try { m = JSON.parse(process.env.QWEN_VOICE_MAP || '{}'); } catch (_) {} return m[v] || QV[v] || (String(v)[0] === 'f' ? 'Serena' : 'Ethan'); }
async function viaQwen(text, voice, en) {
  let last = 'no site';
  for (const site of qwenSites()) {
    const r = await fetch(site.base + '/api/v1/services/aigc/multimodal-generation/generation', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + site.key },
      body: JSON.stringify({ model: process.env.QWEN_TTS_MODEL || 'qwen3-tts-flash', input: { text, voice: qwenVoice(voice), language_type: en ? 'English' : 'Chinese' } }) });
    const j = await r.json().catch(() => ({}));
    const a = j.output && j.output.audio;
    if (!r.ok || !a || (!a.url && !a.data)) { last = site.base.replace(/^https:\/\//, '').slice(0, 24) + ' ' + r.status + ' ' + (j.code || '') + ' ' + String(j.message || '').slice(0, 160); continue; }
    QSITE = site.base + site.key; QBASE = site.base;
    if (a.data) return { buf: Buffer.from(a.data, 'base64'), type: 'audio/wav' };
    const f = await fetch(a.url); if (!f.ok) throw new Error('qwen audio ' + f.status);
    return { buf: Buffer.from(await f.arrayBuffer()), type: f.headers.get('content-type') || 'audio/wav' };
  }
  throw new Error('qwen ' + last);
}

/* ---------- Inworld (English) ---------- */
const IW_WANT = { m1: ['deep', 'low', 'calm', 'serious'], m2: ['young', 'bright', 'energetic', 'youthful'], m3: ['warm', 'friendly', 'smooth', 'gentle'],
  m4: ['serious', 'authoritative', 'deep', 'cold'], m5: ['relaxed', 'laid-back', 'casual', 'soft'], m6: ['bright', 'upbeat', 'energetic', 'expressive'],
  m7: ['middle-aged', 'mature', 'calm', 'smooth'], f1: ['warm', 'soft', 'gentle', 'natural'], f2: ['confident', 'professional', 'clear', 'crisp'] };
let IW_MAP = null, IW_LIST = null;
const iwAuth = () => ({ Authorization: 'Basic ' + process.env.INWORLD_API_KEY, 'Content-Type': 'application/json' });
async function iwVoices() {
  if (IW_MAP) return IW_MAP;
  let fixed = {}; try { fixed = JSON.parse(process.env.INWORLD_VOICE_MAP || '{}'); } catch (_) {}
  const r = await fetch('https://api.inworld.ai/tts/v1/voices?filter=language%3Den', { headers: iwAuth() });
  const j = r.ok ? await r.json() : { voices: [] };
  IW_LIST = (j.voices || []).filter(v => !v.isCustom).map(v => ({ id: v.voiceId, tags: (v.tags || []).map(t => String(t).toLowerCase()), desc: String(v.description || '').toLowerCase() }));
  const used = new Set(Object.values(fixed)), map = Object.assign({}, fixed);
  for (const slot of Object.keys(IW_WANT)) {
    if (map[slot]) continue;
    const g = slot[0] === 'f' ? 'female' : 'male';
    const pool = IW_LIST.filter(v => v.tags.includes(g) || v.desc.includes(g));
    const score = v => IW_WANT[slot].reduce((n, t) => n + (v.tags.includes(t) || v.desc.includes(t) ? 1 : 0), 0);
    const best = pool.filter(v => !used.has(v.id)).sort((a, b) => score(b) - score(a))[0] || pool[0];
    if (best) { map[slot] = best.id; used.add(best.id); }
  }
  map.m1 = map.m1 || 'Dennis'; map.f1 = map.f1 || 'Ashley';
  IW_MAP = map; return map;
}
async function viaInworld(text, voice, vec) {
  const map = await iwVoices();
  const strong = Math.max(...vec) >= 0.5; // a charged line gets a freer delivery
  const r = await fetch('https://api.inworld.ai/tts/v1/voice', { method: 'POST', headers: iwAuth(), body: JSON.stringify({
    text, voiceId: map[voice] || map[voice[0] === 'f' ? 'f1' : 'm1'], modelId: process.env.INWORLD_MODEL || 'inworld-tts-2', language: 'en-US',
    audioConfig: { audioEncoding: 'MP3', sampleRateHertz: 24000 }, deliveryMode: strong ? 'CREATIVE' : 'BALANCED', applyTextNormalization: 'ON' }) });
  if (!r.ok) throw new Error('inworld ' + r.status + ' ' + (await r.text()).slice(0, 160));
  const j = await r.json(); if (!j.audioContent) throw new Error('inworld: no audio');
  return { buf: Buffer.from(j.audioContent, 'base64'), type: 'audio/mpeg' };
}

module.exports = async (req, res) => {
  const ok = cors(req, res);
  if (req.method === 'OPTIONS') { res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); res.status(204).end(); return; }
  if (!ok) { res.status(403).json({ error: 'origin not allowed' }); return; }
  const q = req.query || {};
  if (q.ping === 'qwen') { res.setHeader('Cache-Control', 'no-store'); const t0 = Date.now();
    try { const o = await viaQwen(q.l === 'en' ? 'You finally came. No umbrella?' : '你终于来了。外面雨这么大，你也不带把伞？', String(q.v || 'm1'), q.l === 'en'); res.status(200).json({ ok: true, bytes: o.buf.length, type: o.type, ms: Date.now() - t0, site: QBASE, voices: QV }); }
    catch (e) { res.status(200).json({ ok: false, error: String(e.message || e).slice(0, 400), sites: qwenSites().map(x => x.base) }); } return; }
  if (q.ping) { res.setHeader('Cache-Control', 'no-store'); let iw = null; if (q.ping === 'inworld' && process.env.INWORLD_API_KEY) { try { iw = { map: await iwVoices(), english_voices: (IW_LIST || []).map(v => v.id + ' [' + v.tags.join(',') + ']') }; } catch (e) { iw = { error: String(e.message || e) }; } }
    res.status(200).json({ ok: true, provider: process.env.TTS_URL ? 'server' : 'space', qwen: qwenSites().length > 0, english: process.env.INWORLD_API_KEY ? 'inworld' : null, token: !!process.env.HF_TOKEN, voices: Object.keys(VOICES), inworld: iw || undefined }); return; }
  const text = String(q.t || '').replace(/[*（）()]/g, '').trim().slice(0, 400);
  if (!text) { res.status(400).json({ error: 'no text' }); return; }
  const voice = String(q.v || 'm1').slice(0, 12);
  const vec = String(q.e || '').split(',').slice(0, 8).map(x => Math.max(0, Math.min(1, +x || 0)));
  while (vec.length < 8) vec.push(0);
  try {
    const en = q.l === 'en' || (!/[\u4e00-\u9fff]/.test(text) && q.l !== 'zh');
    let out = null, qerr = null;
    if (qwenSites().length) { try { out = await viaQwen(text, voice, en); } catch (e) { qerr = e; out = null; } }
    if (!out && en && process.env.INWORLD_API_KEY) { try { out = await viaInworld(text, voice, vec); } catch (e) { out = null; } }
    if (!out) out = process.env.TTS_URL ? await viaOpenAI(text, voice) : await viaSpace(text, voice, vec);
    const riff = out.buf.slice(0, 4).toString() === 'RIFF';
    res.setHeader('Content-Type', /^audio\//.test(out.type) ? out.type : (riff ? 'audio/wav' : 'audio/mpeg'));
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=31536000, immutable');
    res.status(200).send(out.buf);
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ error: String(e && e.message || e).slice(0, 300) });
  }
};
