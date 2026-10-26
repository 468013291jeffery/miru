// 「回复 ONLY 这个 JSON」到底遵从得怎么样 —— 用真模型量，不靠感觉
//
//   node tools/json-compliance.mjs --n=40               # 线上口径（无 json mode）
//   node tools/json-compliance.mjs --n=40 --jsonmode    # 对比：开 provider json mode
//   node tools/json-compliance.mjs --n=40 --file=<多人的那份.md>
//
// 三档判定（关键：Ann 的经验是"解析率很低"，而她真正关心的是**玩家会不会看到坏的一轮**）：
//   ① 严格解析通过                 —— 模型给的字节就是合法 JSON
//   ② 严格失败但 jsonLoose 救回      —— 生产 ask() 走的正是这条路（invalid_json 分支）
//   ③ 救不回来                     —— **这一档玩家会看到一整轮空/坏**
// 另报 love 越界（语义层，格式救不了），并给 ①③ 的 Wilson 95% 区间 —— n 小的时候区间很宽，必须一起看。
import fs from 'node:fs';

const args = process.argv.slice(2);
const opt = (k, d) => { const a = args.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=').slice(1).join('=') : d };
const N = Number(opt('n', 40));
const FILE = opt('file', process.env.USERPROFILE + '\\Desktop\\MIRU-prompt-接手前-单人.md');
const MODEL = opt('model', 'deepseek-chat');
const JSONMODE = args.includes('--jsonmode');

const raw = fs.readFileSync(FILE, 'utf8');
const m = raw.match(/```text\n([\s\S]*?)\n```/);
const PROMPT = m ? m[1] : raw;

// 生产用的抢救函数，直接从产物里切出来（保证测的是线上那一份）
const html = fs.readFileSync('index.html', 'utf8');
const at = html.indexOf('function jsonLoose(');
const o = html.indexOf('{', at);
let d = 0, end = -1;
for (let i = o; i < html.length; i++) { const c = html[i]; if (c === '{') d++; else if (c === '}') { d--; if (!d) { end = i; break } } }
const jsonLoose = new Function(html.slice(at, end + 1) + '\nreturn jsonLoose;')();

const { chat } = await import('file:///C:/dev/opc-trace/llm.mjs');

const wilson = (k, n) => {
  if (!n) return '—';
  const z = 1.96, p = k / n, den = 1 + z * z / n;
  const c = (p + z * z / (2 * n)) / den, hw = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / den;
  return `${(100 * Math.max(0, c - hw)).toFixed(0)}–${(100 * Math.min(1, c + hw)).toFixed(0)}%`;
};
const strip = (s) => s.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();

let strict = 0, rescued = 0, dead = 0, lost = 0, loveBad = 0, enOnly = 0;
const deadSamples = [], loveVals = [];

for (let i = 1; i <= N; i++) {
  let content = '';
  try {
    const r = await chat({ prompt: PROMPT, model: MODEL, maxTokens: 1400, temperature: 0.85, json: JSONMODE });
    content = String(r.content || '');
  } catch (e) { lost++; continue }

  let j = null;
  try { j = JSON.parse(strip(content)); strict++; }
  catch (_) {
    j = jsonLoose(content);            // ← 生产走的就是这条路
    if (j && typeof j === 'object') rescued++;
    else { dead++; if (deadSamples.length < 3) deadSamples.push(content.slice(0, 300)) }
  }
  if (j && j.love) for (const v of Object.values(j.love)) { loveVals.push(v); if (!(typeof v === 'number' && v >= 0 && v <= 6)) loveBad++ }
  if (!/[\u4e00-\u9fff]/.test(content)) enOnly++;
  if (i % 10 === 0) console.log(`  …${i}/${N}（严格 ${strict} · 救回 ${rescued} · 死 ${dead}）`);
}

const done = strict + rescued + dead;
console.log(`\n=== ${N} 次 · ${MODEL} · temp 0.85 · json mode=${JSONMODE} ===`);
console.log(`prompt：${FILE.split('\\').pop()} · ${PROMPT.length} 字符\n`);
console.log(`① 严格解析通过      ${strict}/${done}（${(strict / done * 100).toFixed(0)}%）  95%CI ${wilson(strict, done)}`);
console.log(`② 严格失败但救回    ${rescued}/${done}（${(rescued / done * 100).toFixed(0)}%）`);
console.log(`③ 救不回来（玩家看到坏的一轮）  ${dead}/${done}（${(dead / done * 100).toFixed(0)}%）  95%CI ${wilson(dead, done)}`);
if (lost) console.log(`   调用失败（网络/超时，不算解析）  ${lost}`);
console.log(`love 越界          ${loveBad} 次` + (loveBad ? `（样本 ${JSON.stringify(loveVals.slice(0, 12))}）` : ''));
console.log(`整段没中文          ${enOnly} 次`);
if (deadSamples.length) {
  console.log('\n救不回来的样本（截断 300 字）：');
  deadSamples.forEach((s, i) => console.log(`  #${i + 1} ${s.replace(/\n/g, ' ')}`));
}
