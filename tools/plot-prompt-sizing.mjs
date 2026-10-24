// 续写一次的 prompt 有多大？（T19② 的体量测量，不调用模型）
//
//   node tools/plot-prompt-sizing.mjs gala
//
// 只回答一件事：**要生成一章候选，得喂多少东西进去**。
// 输入 = 剧本头 + 本章已有 beats + 玩家实际选过的选项 + 主角的卡（+ 一句输出格式要求）
// 输出 = 1 个场景 + 3 个选项 + 一句目标（结构化 JSON）
//
// token 是估算：中文约 1 token / 1.5 字，英文约 1 token / 4 字符。只用来判断量级。
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'source/content/out', PRESENT = 'source/content/present';
const wid = process.argv[2] || 'gala';

const pack = fs.readdirSync(OUT).filter(f => /^s\d+\.json$/.test(f))
  .map(f => JSON.parse(fs.readFileSync(path.join(OUT, f), 'utf8'))).find(p => p.wid === wid);
if (!pack) { console.error('no pack: ' + wid); process.exit(2); }

const CHARS = (() => {
  const src = fs.readFileSync('source/src/content_chars.js', 'utf8');
  const i = src.indexOf('const C={');
  return new Function('T', 'return ' + src.slice(i + 'const C='.length, src.lastIndexOf('};') + 1) + ';')((en, zh) => ({ en, zh }));
})();
const zh = (v) => (!v ? '' : (typeof v === 'string' ? v : (v.zh || v.en || '')));
const est = (s) => {
  const cjk = (s.match(/[\u4e00-\u9fff]/g) || []).length;
  const other = s.length - cjk;
  return Math.round(cjk / 1.5 + other / 4);
};

const present = (() => {
  const p = path.join(PRESENT, wid + '.json');
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')).chapters : null;
})();

// 「主角」= 第一个非 pov 角色（续写以他为中心最贴近实际）
const lead = (pack.cast.find(c => c.id !== pack.pov) || pack.cast[0]).id;
const c = CHARS[lead] || {};
const leadCard = [
  `- id=${lead} · Looks: ${zh(c.looks)} Personality: ${zh(c.vibe)}`,
  `  Contradiction: ${zh(c.twist)}  Likes: ${zh(c.likes)}`,
  `  Secret (hint only): ${zh(c.secret)}  Wants: ${zh(c.want)}  Fears: ${zh(c.fear)}`,
].join('\n');

// 最近两章的 beats（续写要看刚发生什么）+ 玩家选过的选项
const n = pack.chapters.length;
const recent = pack.chapters.slice(-2).map((ch, k) => {
  const idx = n - 2 + k + 1;
  const lines = (ch.beats.zh || ch.beats.en || []).map(b => `  ${b[0]}: ${String(b[2]).slice(0, 90)}`);
  const pick = (ch.choices || [])[0];
  const then = ((pick && (pick.then.zh || pick.then.en)) || []).slice(0, 3).map(b => `  ${b[0]}: ${String(b[2]).slice(0, 90)}`);
  return `本章 ${idx} · ${zh(ch.place)}\n` + lines.join('\n') + '\n  玩家选了 A →\n' + then.join('\n');
}).join('\n\n');

const SPEC = [
  'You are the plot planner for an interactive romance story. Write ONE candidate chapter that continues it.',
  'Return ONLY JSON: {"scene":{"place":{},"time":{},"beats":[["who","say|act|think",{}]]},"choices":[{"k":"A","t":{},"then":[["who","say",{}]],"mem":{}}],"goal":{}}',
  'Rules: 4-8 beats; exactly 3 choices; every speaker must be an id from CAST; keep every established fact; do not resolve the chapter goal in this candidate.',
].join('\n');

const blocks = [
  ['指令与输出格式', SPEC],
  ['故事头（一句话前提 + 赌注）', 'PREMISE: ' + zh(pack.logline) + '\nSTAKES: ' + zh(pack.stakes)],
  ['主角的卡', leadCard],
  ['在场名单', (present ? present[present.length - 1] : pack.cast.map(x => x.id)).join(', ')],
  ['最近两章发生过什么', recent],
];
let total = 0;
console.log(`=== ${wid} · 续写一份候选的输入体量 ===\n`);
for (const [name, text] of blocks) {
  const t = est(text);
  total += t;
  console.log(`  ${name.padEnd(22)} ${String(text.length).padStart(6)} 字符  ≈ ${String(t).padStart(5)} tokens`);
}
console.log(`  ${'合计'.padEnd(22)} ${String(blocks.reduce((a, b) => a + b[1].length, 0)).padStart(6)} 字符  ≈ ${String(total).padStart(5)} tokens`);

// 输出量：按"6 拍场景 + 3 个选项 × 各 3 拍后果"拼一份**样例**，再算它的字符数
const SAMPLE = JSON.stringify({
  scene: { place: { zh: '主舞台侧幕'.repeat(2) }, time: { zh: '周六 晚上9:10' },
           beats: Array.from({ length: 6 }, (_, i) => ['mason', 'say', '“这是第' + (i + 1) + '句台词，长度大致如此，用来估体量。”'.repeat(1)]) },
  choices: ['A', 'B', 'C'].map(k => ({ k, t: { zh: '选项文案大致这么长，一行左右。' },
           then: Array.from({ length: 3 }, () => ['jack', 'act', '他往门口退了一步，手还搭在门把上。']), mem: { zh: '一句记忆' } })),
  goal: { zh: '这一章的目的一句话。' },
});
console.log(`\n输出样例（6 拍 + 3 选项 × 3 拍）≈ ${SAMPLE.length} 字符 ⇒ ≈ ${est(SAMPLE)} tokens 输出`);
console.log('\n口径提醒：以上是**估算**（中文 1 token ≈ 1.5 字）。真实用量看账单，不看这里。');
console.log('用途：判断"续写一章"是不是一次能承受的调用 —— 输入量级与一次普通回合相当，输出更短。');
