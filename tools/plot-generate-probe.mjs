// T19②：真的生成一份续写候选（一次调用），并用 planValidChapter 核验它
//
//   $env:OPENCODE_KEY="oc_sk_..."; node tools/plot-generate-probe.mjs gala
//   node tools/plot-generate-probe.mjs gala --model deepseek-v4.1-flash-free
//
// 契约见 PLOT98.md 的「T19② 生成候选」：输入五块、输出一个 JSON（场景 + 3 选项 + 一句目标）。
// 这个脚本只做一件事：证明「生成器写得出能被核验的候选」。
// ⚠️ key 只从环境变量读，绝不写进仓库。
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { planValidChapter } = require('../api/_plan.js');

const OUT = 'source/content/out', PRESENT = 'source/content/present';
const args = process.argv.slice(2);
const wid = args.find(a => !a.startsWith('--')) || 'gala';
const model = (args.find(a => a.startsWith('--model=')) || '--model=deepseek-v4.1-flash').split('=')[1];
const MAXTOK = Number((args.find(a => a.startsWith('--maxtokens=')) || '--maxtokens=3000').split('=')[1]) || 3000;
const EFFORT = (args.find(a => a.startsWith('--effort=')) || '').split('=')[1] || '';
const KEY = (() => {
  if (process.env.OPENCODE_API_KEY) return process.env.OPENCODE_API_KEY;
  if (process.env.OPENCODE_KEY) return process.env.OPENCODE_KEY;
  // 公共 key：测试用的便宜 key，存在 ~/.dsh/.credentials.yaml，**不进仓库**
  try {
    const home = process.env.USERPROFILE || process.env.HOME || '';
    const f = home + '/.dsh/.credentials.yaml';
    const line = fs.readFileSync(f, 'utf8').split(/\r?\n/).find(l => /^\s*OPENCODE_API_KEY\s*:/.test(l));
    if (line) return line.replace(/^\s*OPENCODE_API_KEY\s*:\s*/, '').trim().replace(/^['"]|['"]$/g, '');
  } catch (_) {}
  return '';
})();
if (!KEY) { console.error('没有 key：设 OPENCODE_API_KEY，或写进 ~/.dsh/.credentials.yaml'); process.exit(2); }

const pack = fs.readdirSync(OUT).filter(f => /^s\d+\.json$/.test(f))
  .map(f => JSON.parse(fs.readFileSync(path.join(OUT, f), 'utf8'))).find(p => p.wid === wid);
if (!pack) { console.error('no pack: ' + wid); process.exit(2); }

const CHARS = (() => {
  const src = fs.readFileSync('source/src/content_chars.js', 'utf8');
  const i = src.indexOf('const C={');
  return new Function('T', 'return ' + src.slice(i + 'const C='.length, src.lastIndexOf('};') + 1) + ';')((en, zh) => ({ en, zh }));
})();
const zh = (v) => (!v ? '' : (typeof v === 'string' ? v : (v.zh || v.en || '')));

// canon：已发生、不可推翻（与 app94_replyguard.js 的 canonFacts 同口径，直接读 marks 源文件）
const marksPath = path.join('source/content/marks', wid + '.json');
const MARKS = fs.existsSync(marksPath) ? JSON.parse(fs.readFileSync(marksPath, 'utf8')).chapters : null;
const canonFacts = (ch) => {
  const out = [];
  if (!MARKS) return out;
  for (const k of Object.keys(MARKS).map(Number).sort((a, b) => a - b)) {
    if (!(k <= ch)) continue;
    const box = MARKS[String(k)] || {};
    for (const [tag, o] of [['revealed', box.reveals], ['broke', box.breaks]]) {
      if (!o || typeof o !== 'object') continue;
      for (const who of Object.keys(o)) {
        const v = o[who];
        if (typeof v === 'string') out.push('Ch' + k + ': ' + who + ' ' + tag + ' ' + v);
        else if (v && typeof v === 'object') for (const kk of Object.keys(v)) out.push('Ch' + k + ': ' + who + ' ' + tag + ' ' + kk);
      }
    }
  }
  return out;
};

const present = (() => {
  const p = path.join(PRESENT, wid + '.json');
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')).chapters : null;
})();

const lead = (pack.cast.find(c => c.id !== pack.pov) || pack.cast[0]).id;
const c = CHARS[lead] || {};
const castIds = pack.cast.map(x => x.id);
const roster = present ? present[present.length - 1] : castIds;

const recent = pack.chapters.slice(-2).map((ch, k) => {
  const idx = pack.chapters.length - 2 + k + 1;
  const lines = (ch.beats.zh || ch.beats.en || []).map(b => `${b[0]}: ${String(b[2]).slice(0, 90)}`);
  const pick = (ch.choices || [])[0];
  const then = ((pick && (pick.then.zh || pick.then.en)) || []).slice(0, 3).map(b => `${b[0]}: ${String(b[2]).slice(0, 90)}`);
  return `CHAPTER ${idx} (${zh(ch.place)})\n` + lines.join('\n') + `\nPlayer chose A ->\n` + then.join('\n');
}).join('\n\n');

const prompt = [
  'You are the plot planner for an interactive romance story. Write ONE candidate chapter that continues it.',
  '',
  'STORY: ' + zh(pack.logline),
  'STAKES: ' + zh(pack.stakes),
  '',
  `CAST (speakers must be one of these ids): ${castIds.join(', ')}`,
  `IN THIS SCENE: ${roster.join(', ')}`,
  `LEAD CHARACTER (${lead}): ${zh(c.looks)} | ${zh(c.vibe)} | wants: ${zh(c.want)} | fears: ${zh(c.fear)} | secret (hint only): ${zh(c.secret)}`,
  '',
  'WHAT JUST HAPPENED (canon — never contradict):',
  recent,
  ...(canonFacts(pack.chapters.length).length
    ? ['', 'ESTABLISHED FACTS (settled, never re-open these conflicts):', canonFacts(pack.chapters.length).join('\n')]
    : []),
  '',
  'Write the NEXT chapter. Hard rules:',
  '- 4 to 8 beats in the scene; every beat is ["<cast id or n>","say|act|think","<text>"]',
  '- exactly 3 choices, keys A, B, C; each choice has "t" (its text) and "then" (1-3 beats of what happens if picked)',
  '- do NOT resolve the chapter goal in this candidate; leave the player a real decision',
  '- text in Chinese; keep every established fact',
  'Return ONLY JSON, no prose, no code fences:',
  '{"scene":{"place":"","time":"","beats":[["id","say","text"]]},"choices":[{"k":"A","t":"","then":[["id","act","text"]]}],"goal":""}',
].join('\n');

console.log(`=== ${wid} · 续写候选 · model=${model} ===`);
console.log(`prompt ${prompt.length} 字符\n`);

if (args.includes('--dry')) {
  const cf = canonFacts(pack.chapters.length);
  console.log('--- dry run（不调用模型）---');
  console.log('prompt ' + prompt.length + ' 字符 · 含 canon 块: ' + /ESTABLISHED FACTS/.test(prompt) + ' · canon 条数: ' + cf.length);
  if (cf.length) console.log('  例: ' + cf.slice(0, 3).join(' / '));
  process.exit(/ESTABLISHED FACTS/.test(prompt) === (cf.length > 0) ? 0 : 1);
}

const body = {
  model,
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.7,
  max_tokens: MAXTOK,
  ...(EFFORT ? { reasoning_effort: EFFORT } : {}),
};

const t0 = Date.now();
const res = await fetch('https://opencode.ai/inference/openai/v1/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + KEY },
  body: JSON.stringify(body),
});
const ms = Date.now() - t0;
const txt = await res.text();
if (!res.ok) { console.error('HTTP ' + res.status + ': ' + txt.slice(0, 400)); process.exit(1); }

const j = JSON.parse(txt);
const rawMsg = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '';
const raw = Array.isArray(rawMsg)
  ? rawMsg.filter(b => b && (b.type === 'text' || typeof b.text === 'string')).map(b => b.text || '').join('')
  : String(rawMsg);
console.log(`HTTP ${res.status} · ${ms}ms · usage=${JSON.stringify(j.usage || {})}`);
console.log('--- 模型原文（前 900 字）---');
console.log(raw.slice(0, 900));
if (!raw.trim()) {
  const u = j.usage || {};
  console.log('\n!! 内容为空。usage=' + JSON.stringify(u.completion_tokens_details || u) +
    '（推理型模型会把 max_tokens 全烧在 reasoning 上 ⇒ 要么加大 --maxtokens，要么换非推理模型）');
}

// 抽取 JSON（模型可能裹了 ``` 或前后废话）
const m = raw.match(/\{[\s\S]*\}/);
let cand = null;
if (m) { try { cand = JSON.parse(m[0]); } catch (e) { console.log('\n!! JSON 解析失败：' + e.message); } }

if (!cand) { console.log('\n结论：模型没有给出可解析的 JSON —— 这一版 prompt 还不够硬'); process.exit(1); }

const v = planValidChapter(cand, castIds);
console.log('\n--- 核验（planValidChapter）---');
console.log(v.ok ? '✓ 结构合法，能喂给运行时' : '✗ 结构不合法：');
if (!v.ok) for (const e of v.errors.slice(0, 6)) console.log('   ' + e.path + ': ' + e.why);
console.log(`\n候选规模：beats=${((cand.scene && cand.scene.beats) || []).length} · choices=${(cand.choices || []).length}`);
process.exit(v.ok ? 0 : 1);
