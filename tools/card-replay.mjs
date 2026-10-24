// 用真剧本把 8 章走一遍，看角色卡在真实内容上是什么样（不花钱、不碰运行时）
//
//   node tools/card-replay.mjs gala          # 全 A 走完 8 章
//   node tools/card-replay.mjs gala ABCABACA # 指定每章选什么
//
// 三个要检查的问题：
//   ① 有没有「该变没变」的章（规则漏了）
//   ② 有没有「没变却弹了卡」的章（噪声）
//   ③ 第 8 章的卡，与他这 8 章的经历对得上吗
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const wid = args[0] || 'gala';
const picks = (args[1] || '').toUpperCase();

const OUT = 'source/content/out', PRESENT = 'source/content/present', MARKS = 'source/content/marks';
const pack = fs.readdirSync(OUT).filter(f => /^s\d+\.json$/.test(f))
  .map(f => JSON.parse(fs.readFileSync(path.join(OUT, f), 'utf8'))).find(p => p.wid === wid);
if (!pack) { console.error('no pack: ' + wid); process.exit(2); }

const readJson = (dir, f) => { const p = path.join(dir, f + '.json'); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null; };
const present = readJson(PRESENT, wid);
const marks = readJson(MARKS, wid);

// 角色表（真实字段）
const CHARS = (() => {
  const src = fs.readFileSync('source/src/content_chars.js', 'utf8');
  const i = src.indexOf('const C={');
  const body = src.slice(i + 'const C='.length, src.lastIndexOf('};') + 1);
  return new Function('T', 'return ' + body + ';')((en, zh) => ({ en, zh }));
})();

// 真实的 packLove 数值（A/B/C 各加多少）
const packSrc = fs.readFileSync('source/src/app14_pack.js', 'utf8');
const LOVE = (packSrc.match(/const d=\{A:(-?\d+),B:(-?\d+),C:(-?\d+)\}/) || []).slice(1).map(Number);
const LOVE_BY = { A: LOVE[0] || 0, B: LOVE[1] || 0, C: LOVE[2] || 0 };

// 卡模块（同一份源码，注入运行时依赖）
const code = fs.readFileSync('source/src/app97_card.js', 'utf8');
const world = { pack: { chapters: pack.chapters.map(c => ({
  choices: c.choices.map(x => ({ k: x.k, then: x.then }))
})) } };
const api = new Function('ch', 'wd', 'stageOf', 'MIRU_MARKS', 'CL', code +
  '\nreturn { cardBase, cardCommit, cardAt, cardDiff, cardCommitChapter, cardChanges, cardMemo };')(
  (id) => CHARS[id], () => world, (th, cid) => {
    const lv = (th.love && th.love[cid]) || 0;
    const T = [0, 20, 40, 60, 80];
    let k = 0; T.forEach((m, i) => { if (lv >= m) k = i; }); return k;
  }, marks ? { [wid]: marks } : {}, () => 'zh');

const th = { wid: wid, cast: pack.cast.map(c => c.id), pk: { as: pack.pov, ch: 1 }, love: {}, cardLog: {} };
for (const c of th.cast) th.love[c] = 5;

const clamp = v => Math.max(0, Math.min(100, v));
const rows = [];
for (let n = 1; n <= pack.chapters.length; n++) {
  const k = picks[n - 1] || 'A';
  th.pk.ch = n;
  // 剧本规则：除玩家外全员按 A/B/C 加减
  for (const c of th.cast) if (c !== th.pk.as) th.love[c] = clamp(th.love[c] + (LOVE_BY[k] || 0));
  api.cardCommitChapter(th, n, k);
  const changes = api.cardChanges(th, n);
  rows.push({ n: n, k: k, changes: changes });
}

console.log(`=== ${wid} · ${pack.chapters.length} 章 · 选法 ${Array.from({length: pack.chapters.length}, (_, i) => picks[i] || 'A').join('')} ===`);
const scene = (n) => (present ? (present.chapters[n - 1] || []) : pack.cast.map(c => c.id));

console.log('\n章  选择  在场  这一章谁变了');
for (const r of rows) {
  const txt = r.changes.map(x => `${x.cid}(好感${x.loveDelta > 0 ? '+' : ''}${x.loveDelta}${Object.keys(x.stance).length ? ' 立场:' + Object.keys(x.stance).join(',') : ''}${x.revealed ? ' 揭示:' + x.revealed : ''})`).join('  ') || '—';
  console.log(`ch${r.n}  ${r.k}   ${String(scene(r.n).length).padStart(2)}   ${txt}`);
}

const noisy = rows.filter(r => r.changes.length > 0 && r.changes.every(x => Math.abs(x.loveDelta) > 0 && !Object.keys(x.stance).length && !x.revealed && !x.knows));
const silent = rows.filter(r => r.changes.length === 0);
// 真正该对的是「标了标记的章」与「真的弹了卡的章」是否一一对应
const marked = Object.keys((marks && marks.chapters) || {}).map(Number).sort((a, b) => a - b);
const changed = rows.filter(r => r.changes.length > 0).map(r => r.n);
const missed = marked.filter(n => !changed.includes(n));
const extra = changed.filter(n => !marked.includes(n));
console.log('\n① 标记 vs 弹卡');
console.log('   标了 breaks/reveals 的章：' + (marked.length ? marked.map(n => 'ch' + n).join(',') : '没有'));
console.log('   真的产生卡级变化的章：  ' + (changed.length ? changed.map(n => 'ch' + n).join(',') : '没有'));
console.log('   标了却没变（规则漏了）：' + (missed.length ? missed.map(n => 'ch' + n).join(',') : '没有'));
console.log('   没标却变了（噪声）：    ' + (extra.length ? extra.map(n => 'ch' + n).join(',') : '没有'));
console.log('② 只有好感在动、没有别的事的章（这些不该弹卡）：' + (noisy.length ? noisy.map(r => 'ch' + r.n).join(',') : '没有'));
console.log('   其余章没有卡级变化是**预期**的：只有标了 breaks/reveals 的章才会有。');

const who = pack.cast.find(c => c.id !== pack.pov)?.id || pack.cast[0].id;
const card = api.cardAt(th, who, pack.chapters.length);
console.log(`\n③ 第 ${pack.chapters.length} 章时 ${who} 的卡：`);
console.log('   好感/阶段快照:', JSON.stringify(card.mutable));
console.log('   firsts:', JSON.stringify(card.firsts));
console.log('   said:', JSON.stringify(card.said).slice(0, 200));
console.log('   立场:', JSON.stringify(card.stance));
console.log('   揭示:', JSON.stringify(card.revealed));
console.log('   cardMemo:', api.cardMemo(th, who, pack.chapters.length) || '（空）');
console.log('\n他的秘密原文（应当始终不变）：' + JSON.stringify(api.cardBase(who).secret).slice(0, 80));
