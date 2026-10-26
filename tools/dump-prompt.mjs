// 把「一次真实回合的 prompt」导成一份人可读的 md，供 Ann 自己梳理
//
//   node tools/dump-prompt.mjs            # 默认 gala 第 5 章 · watch 模式 · choose 状态
//   node tools/dump-prompt.mjs afterhours 3
//
// 做法：从构建产物 index.html 里把**真的**那几个函数切出来（prompt 数组 / packPrompt / packTail /
// castCard / castCardPublic / memBlock），用真实剧本数据 + 一小段假历史把它们渲染成一个回合。
// 规则段、卡片、块顺序都是线上那一份逐字；只有"历史对话"是我造的样例。
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const WID = args[0] || 'gala';
const CH = Number(args[1] || 5);
const SOLO = (args.find(a => a.startsWith('--solo='))) ? args.find(a => a.startsWith('--solo=')).split('=')[1] : '';
const OUT_ARG = (args.find(a => a.startsWith('--out=')) || '').split('=').slice(1).join('=');
const OUT = OUT_ARG || (SOLO
  ? (process.env.USERPROFILE + '\\Desktop\\MIRU-prompt-单人版.md')
  : (process.env.USERPROFILE + '\\Desktop\\MIRU-prompt-梳理版.md'));

const FROM = (args.find(a => a.startsWith('--from=')) || '').split('=').slice(1).join('=');
const html = fs.readFileSync(FROM || 'index.html', 'utf8');
const cut = (name) => {
  const at = html.indexOf('function ' + name + '(');
  if (at < 0) return '';
  const open = html.indexOf('{', at);
  let d = 0, end = -1;
  for (let i = open; i < html.length; i++) { const c = html[i]; if (c === '{') d++; else if (c === '}') { d--; if (!d) { end = i; break } } }
  return html.slice(at, end + 1);
};
const cutExpr = (marker) => {
  const at = html.indexOf(marker);
  if (at < 0) return '';
  const start = html.indexOf('[', at);
  let d = 0, end = -1;
  for (let i = start; i < html.length; i++) { const c = html[i]; if (c === '[') d++; else if (c === ']') { d--; if (!d) { end = i; break } } }
  return html.slice(start, end + 1);
};

const PROMPT_SRC = cutExpr('const prompt=[');
const FNS = ['packPrompt', 'packTail', 'castCard', 'castCardPublic', 'memBlock', 'transcript'].map(cut).filter(Boolean);

// ---- 数据 ----
const packFile = fs.readdirSync('source/content/out').filter(f => /^s\d+\.json$/.test(f))
  .map(f => JSON.parse(fs.readFileSync(path.join('source/content/out', f), 'utf8'))).find(p => p.wid === WID);
if (!packFile) { console.error('没有剧本: ' + WID); process.exit(2) }
const pack = packFile;
// 角色库：剧本里的 cast 只是引用（{id, au_role}），真人设在 content_36.js 的 PACK_C
const CAST_SRC = fs.readFileSync('source/src/content_36.js', 'utf8');
const castLib = (() => {
  const at = CAST_SRC.indexOf('const PACK_C=');
  if (at < 0) return {};
  const start = CAST_SRC.indexOf('{', at);
  let d = 0, end = -1;
  for (let i = start; i < CAST_SRC.length; i++) { const c = CAST_SRC[i]; if (c === '{') d++; else if (c === '}') { d--; if (!d) { end = i; break } } }
  try { return new Function('return ' + CAST_SRC.slice(start, end + 1))() } catch (_) { return {} }
})();
const castById = {}; pack.cast.forEach(c => { const id = typeof c === 'string' ? c : c.id; if (castLib[id]) castById[id] = castLib[id] });
const ids = pack.cast.map(c => c.id).slice(0, 5);

const th = SOLO
  ? { id: 'c:' + SOLO, kind: 'solo', wid: WID, cast: [SOLO], title: (castById[SOLO] || {}).n || SOLO,
      love: { [SOLO]: 5 }, rounds: 2, mem: [], said: [], typed: [], msgs: [], status: { time: '', place: '', mood: {} } }
  : { id: 't1', wid: WID, cast: ids, love: {}, mem: [], said: [], typed: [], msgs: [], status: { time: '', place: '', mood: {} },
      pk: { ch: CH, as: 'watch', st: 'choose', picks: {} } };
if (!SOLO) ids.forEach(id => th.love[id] = 12);
if (SOLO) {
  const nm = (castById[SOLO] || {}).n || SOLO;
  th.mem.push('She asked why he went quiet after the race; he changed the subject.');
  th.msgs.push({ who: SOLO, k: 'say', txt: '你今天话很少。' });
  th.msgs.push({ who: 'me', k: 'say', txt: '因为我不想解释我为什么还在这儿。' });
  th.said.push('因为我不想解释我为什么还在这儿。');
  th.typed.push('因为我不想解释我为什么还在这儿。');
} else {
  th.mem.push('Ann asked Jack a direct question about the headline; he did not answer it.');
  th.msgs.push({ who: 'me', k: 'say', txt: '我把它挪到中间吧。' });
  th.said.push('我把它挪到中间吧。'); th.typed.push('我把它挪到中间吧。');
}
const chArr = pack.chapters[CH - 1];
th.status.time = (chArr.time && (chArr.time.zh || chArr.time.en)) || '';
th.status.place = (chArr.place && (chArr.place.zh || chArr.place.en)) || '';

// ---- 作用域：真函数优先，其余一律空桩 ----
const LANG = { en: 'English', zh: 'Simplified Chinese (简体中文)' };
const real = {
  th,
  w: { pack, title: pack.title, premise: pack.premise, you: pack.you, warn: pack.warn },
  S: { plus: false, heat: 'steamy', lang: 'zh' },
  MIRU_TUNE: { chat: { transcript: 50, transcriptPlus: 80, typedKeep: 120, saidKeep: 50, publicWants: true, characterMeta: false, chapterAdvance: true } },
  MIRU_REV: {}, LANG_NAME: LANG,
  Lz: (v) => (v && (v.zh || v.en)) || '', CL: () => 'zh',
  ch: (id) => castById[id] || { n: id, age: '', role: {}, looks: {}, vibe: {}, tells: { zh: [] }, likes: {}, want: {}, fear: {}, boundary: {} },
  me: () => 'Ann', p: { name: 'Ann', pron: 'she' }, first: (s) => String(s || '').split(' ')[0],
  wd: () => ({ pack }), pow: () => 0, goals: '', deep: false, sugg: [], qz: null,
  I18N: { en: { 'stage.0': 'stranger', 'stage.1': 'acquaintance', 'stage.2': 'warming', 'stage.3': 'close', 'stage.4': 'lover' } },
  stageOf: () => 0, canonFacts: () => [], cardMemo: () => '',
  speakersOf: (t) => t.cast, ch2: null,
};
let stub;
stub = new Proxy(function () {}, {
  get: (t, k) => (k === Symbol.toPrimitive || k === 'toString' || k === 'valueOf') ? () => '' : stub,
  apply: () => '',
});
const scope = new Proxy(real, {
  has: (t, k) => k !== Symbol.unscopables && !(k in globalThis),
  get: (t, k) => (k === Symbol.unscopables ? undefined : (k in t ? t[k] : stub)),
});

// speakersOf 与 castCardFace 在别处，这里用真实逻辑的等价实现（只影响卡片走哪一面）
const HELPERS = `
function speakersOf(t){return t.cast}
function castCardFace(t,id){const sp=speakersOf(t);const n=Math.max(1,Number(__s.MIRU_TUNE.chat.privateCards)||1);return sp.slice(0,n).includes(id)?castCard(t,id):castCardPublic(t,id)}
`;
const body = FNS.join('\n') + '\n' + HELPERS + '\nreturn ' + PROMPT_SRC + ';';
const parts = new Function('__s', 'with(__s){ ' + body + ' }')(scope);
const text = parts.filter(Boolean).join('\n');

// ---- 块清单（按出现顺序标注来源）----
const BLOCKS = [
  ['1', '角色与世界观（固定规则段）', 'app3_chat.js` 里 prompt 数组开头几行', '硬编码，改它要动源码'],
  ['2', 'STORY / 你的角色 / 赌注', 'same', '来自剧本元数据'],
  ['3', 'STATUS（时间·地点）', 'same', '来自 th.status'],
  ['4', 'CAST（在场角色卡）', 'castCardFace → castCard / castCardPublic', 'privateCards 决定谁拿私有面'],
  ['5', 'WHERE YOU ARE / ALREADY HAPPENED / 时间会走', 'packPrompt（新口径）', 'chat.characterMeta=false'],
  ['6', 'THE USER（玩家是谁）', 'same', 'watch 模式才有'],
  ['7', 'MEMORY', 'memBlock', '记忆条数按档位裁'],
  ['8', 'STORY SO FAR', 'transcript', 'chat.transcript=50'],
  ['9', '玩家手打 / 玩家说过的话', 'prompt 内联', 'chat.typedKeep / saidKeep'],
  ['10', '输出格式与规则', 'prompt 数组尾部', '硬编码'],
];

const md = [];
md.push(SOLO ? '# MIRU · 单人对话的 prompt（一回合）' : '# MIRU · 一次真实回合的 prompt（梳理版）');
if (FROM) md.push('', `> ⚠️ **这一份来自历史产物** \`${FROM}\`（不是当前 index.html），用于对比改动前后。`);
md.push('');
md.push(SOLO
  ? `> **单人对话**（私聊 ${(castById[SOLO] || {}).n || SOLO}）· 剧本 \`${WID}\` · 没有章节块（\`pk\` 不存在）· 语言 zh`
  : `> 剧本 \`${WID}\` 第 ${CH} 章 · 模式 **watch**（旁观 / 协调员） · 章节状态 **choose** · 语言 zh`);
md.push('>');
md.push('> **这份是怎么来的**：从构建产物 `index.html` 里把真的 `packPrompt` / `packTail` / `castCard` / `castCardPublic` / `memBlock` / `transcript` 切出来，');
md.push('> 用真实剧本数据 + 一小段假历史渲染。**规则段、卡片、块顺序都是线上那一份逐字**；只有"历史对话"是我造的样例。');
md.push('> 重跑：`node tools/dump-prompt.mjs gala 5`');
md.push('');
md.push('## 块清单');
md.push('');
md.push('| # | 块 | 来源 | 怎么关 / 怎么改 |');
md.push('|---|---|---|---|');
for (const b of BLOCKS) md.push(`| ${b[0]} | ${b[1]} | \`${b[2].replace(/`/g, '')}\` | ${b[3]} |`);
md.push('');
md.push(`## 全文（${text.length} 字符 ≈ ${Math.round(text.length / 1.5)} tokens）`);
md.push('');
md.push('```text');
md.push(text);
md.push('```');
md.push('');
md.push('## 开关一览（改 tune.js，刷新即生效，不用重建）');
md.push('');
md.push('| 开关 | 现在 | 管什么 |');
md.push('|---|---|---|');
md.push('| `chat.characterMeta` | false | 角色知不知道"第几章/本章目标/下一步要选什么"。false = 不知道 |');
md.push('| `chat.chapterAdvance` | true | 章内能不能推进时间/换场景（不替玩家做选择） |');
md.push('| `chat.publicWants` | true | 每个在场角色卡上带不带"他自己想要什么" |');
md.push('| `chat.transcript` / `transcriptPlus` | 50 / 80 | STORY SO FAR 带多少条消息 |');
md.push('| `chat.typedKeep` / `saidKeep` | 120 / 50 | 玩家手打 / 玩家说过的保留条数 |');
md.push('| `chat.privateCards` | 1 | 几个角色拿"私有面"（含秘密/矛盾），其余走公共面 |');
md.push('');

fs.writeFileSync(OUT, md.join('\n'), 'utf8');
console.log('已写', OUT);
console.log('prompt 长度', text.length, '字符');
