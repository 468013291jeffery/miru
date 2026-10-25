// ① 验证「玩家原话块」真的会进 prompt、且窗口真的是 50
//
//   node tools/prompt-blocks.mjs
//
// 两条判据（都能红）：
//   A. 从产物里切出 transcript()，喂 80 条消息 ⇒ 只能返回最近 50 条（窗口默认 50）
//   B. 产物里「玩家原话块」紧跟在 STORY SO FAR 之后（顺序错 = 模型读到的是另一段东西）
//   C. 块的内容由 th.said 生成，且为空时整行不出现（不让模型看见空标题）
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
let pass = 0; const fails = [];
const ok = (n, c, d) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fails.push(n); console.log('  ✗ ' + n, d === undefined ? '' : '→ ' + String(d).slice(0, 160)); } };

console.log('A. 窗口切片（真函数）');
const cut = (name) => {
  const at = html.indexOf('function ' + name + '(');
  if (at < 0) throw new Error('找不到 ' + name);
  const open = html.indexOf('{', at);
  let d = 0, end = -1;
  for (let i = open; i < html.length; i++) { if (html[i] === '{') d++; else if (html[i] === '}') { d--; if (!d) { end = i; break } } }
  return html.slice(at, end + 1);
};
const TR = cut('transcript');
const exec = (src, ...args) => new Function('MIRU_TUNE', 'S', 'ch', 'me', 'PN', src + '\nreturn transcript;')(
  { chat: { transcript: 50, transcriptPlus: 80 } }, { plus: false }, () => ({ n: 'A' }), () => 'you', () => Date.now()
);

const msgs = [];
for (let i = 0; i < 80; i++) msgs.push(i % 2 ? { who: 'mason', k: 'say', txt: 'beats-' + i } : { who: 'me', k: 'say', txt: 'player-' + i });
const th = { msgs };
const out = exec(TR)(th);
const lines = out.split('\n').filter(Boolean);
ok('喂 80 条只保留 50 条', lines.length === 50, lines.length);
ok('最早那条已被裁掉', !out.includes('player-0') && !out.includes('beats-1'), '');
ok('最后一条还在', out.includes('beats-79'), '');

console.log('B. 块的顺序（紧跟 STORY SO FAR）');
const idxStory = html.indexOf('"STORY SO FAR:\\n"+transcript(th),');
const idxBlock = html.indexOf("THE PLAYER'S OWN WORDS", idxStory);
ok('STORY SO FAR 存在', idxStory > 0);
ok('原话块在它之后', idxBlock > idxStory && idxBlock - idxStory < 1200, idxBlock - idxStory);

console.log('C. 空的时候不出现');
const mk = html.slice(html.indexOf("(function(){try{"), idxBlock + 400);
ok('块由 th.said 生成', /Array\.isArray\(th\.said\)/.test(html), '');
ok('空数组时返回空串', /if\(!arr\.length\)return ""/.test(html), '');

console.log('D. 手打那一档（与"玩家说过的话"分开）');
{
  const iTyped = html.indexOf('THE PLAYER TYPED THESE THEMSELVES');
  const iSaid = html.indexOf("THE PLAYER'S OWN WORDS");
  ok('手打块存在', iTyped > 0);
  ok('它排在"玩家说过的话"之前（更近的上下文放前面）', iTyped > 0 && iSaid > 0 && iTyped < iSaid, iTyped + ' vs ' + iSaid);
  ok('只读 th.typed，不读 th.said', /Array\.isArray\(th\.typed\)/.test(html), '');
  ok('空的时候整块不出现', /if\(!arr\.length\)return ""/.test(html), '');
}

console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) { console.log('FAILED: ' + fails.join(' | ')); process.exit(1); }
console.log('prompt blocks OK');

