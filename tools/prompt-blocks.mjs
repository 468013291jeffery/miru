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

/* E. 角色视角（2026-10-28 Ann 拍）：默认口径里**不许出现编剧语**
   —— 第几章 / Chapter goal / "读者接下来要做官方选择"。
   两向都要验：默认必须没有；开关打开必须**有**（否则这条判据可能只是恒真）。 */
{
  const PP = cut('packPrompt'), TAIL = cut('packTail');
  const pack = { chapters: [{ t: { en: 'The Gala' }, goal: { en: 'Decide who sits in the chair' }, place: { en: 'Main stage' }, time: { en: 'Saturday 8:45pm' }, choices: [{ k: 'A', t: { en: 'Name her' } }] }] };
  const base = {
    wid: 'gala', cast: ['jack'], pk: { ch: 1, as: 'watch', st: 'choose', picks: {} },
    wd: () => ({ pack }), ch: () => ({ n: 'Jack', role: 'narrator' }), Lz: (v) => (v && v.en) || '',
    first: (s) => s, canonFacts: () => [], MIRU_REV: {}, MIRU_TUNE: { chat: {} },
  };
  let stub;
  stub = new Proxy(function () {}, {
    get: (t, k) => (k === Symbol.toPrimitive || k === 'toString' || k === 'valueOf') ? () => '' : stub,
    apply: () => '',
  });
  const render = (tune) => {
    const th = { wid: 'gala', cast: ['jack'], pk: { ch: 1, as: 'watch', st: 'choose', picks: {} } };
    const real = Object.assign({}, base, { MIRU_TUNE: tune, th });
    const scope = new Proxy(real, { has: (t, k) => k !== Symbol.unscopables && !(k in globalThis), get: (t, k) => (k === Symbol.unscopables ? undefined : (k in t ? t[k] : stub)) });
    return new Function('__s', 'with(__s){ ' + PP + '\n' + TAIL + '\nreturn packPrompt(th); }')(scope);
  };

  const META = [/Chapter goal/i, /official choice/i, /CHAPTER\s+1\s*\//i];
  const def = render({ chat: {} });
  const hits = META.filter(re => re.test(def)).map(String);
  ok('默认不给他章节号 / 目标 / 官方选择', hits.length === 0, hits);
  ok('默认有"此刻在哪"打底', /WHERE YOU ARE/.test(def), def.slice(0, 120));
  ok('默认明说他不知道接下来会怎样', /do not know what comes next/i.test(def), '');

  // 上面那条验的是**分支逻辑**（undefined ⇒ 新口径），它抓不到"默认值被改回 true"。
  // 默认值住在 tune 里，所以直接读产物里的那一个字 —— 变异实测：改 tune 默认 ⇒ 这条会红。
  ok('tune 默认 characterMeta=false（角色视角为默认口径）', /characterMeta:\s*false/.test(html), (html.match(/characterMeta:\s*\w+/) || [''])[0]);

  const old = render({ chat: { characterMeta: true } });
  const oldHits = META.filter(re => re.test(old));
  ok('打开 characterMeta 就回到旧文案（三样都在）', oldHits.length === 3, oldHits.map(String));
}

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

