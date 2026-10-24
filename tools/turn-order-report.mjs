// 一轮的执行顺序：把「先提交、后写结果」这两段量出来（SPEC-AUDIT §08.2 / #16）
//
//   node tools/turn-order-report.mjs
//
// 文档 v7.11 §08.2 要的是**两段式**：
//   ① 用户动作 → 验证前置 → 提交真实事件（此刻世界已经变了）
//   ② 组装 payload → 调模型 → 输出给玩家
//   ③ 真正的用户操作 / 工具结果 → 写可信事件
//
// 这条工具回答两个问题：
//   A. 代码里「提交」是不是真的排在「演出」之前？（看剧本回合的调用顺序）
//   B. AI 回合里模型提议的数值，有没有经过前置验证才落盘？
//
// 顺序不看时间戳：一轮全在同一毫秒内完成，**调用顺序才是真相**。所以这里把每个会产生
// 副作用的地方换成记录器，按调用先后打印。
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const cut = (a, b) => {
  const i = html.indexOf(a), j = html.indexOf(b, i + a.length);
  if (i < 0 || j < 0) throw new Error('cannot cut ' + a + ' .. ' + b);
  return html.slice(i, j);
};

const seq = [];
const rec = (what, extra) => seq.push(Object.assign({ what, i: seq.length + 1 }, extra || {}));
const noop = () => {};
const CH = (n) => ({ t: { en: 'ch' + n }, choices: [
  { k: 'A', t: { en: 'A' + n }, then: [['n', 'act', 'x'], ['ethan', 'say', 'y']], mem: { en: 'm' }, set: 'FLAG_' + n },
  { k: 'B', t: { en: 'B' + n }, then: [], mem: { en: 'm' }, set: 'FLAG_B' + n },
  { k: 'C', t: { en: 'C' + n }, then: [], mem: { en: 'm' }, set: 'FLAG_C' + n },
] });
const world = { id: 'ice', pack: { chapters: [CH(1), CH(2)] } };
const th = { id: 't1', wid: 'ice', cast: ['ethan'], mem: [], love: {}, loveLog: [], rounds: 0, pk: { st: 'choose', ch: 1, picks: {}, as: 'ethan' } };

const stubs = {
  S: { threads: { t1: th } }, busy: false, curT: 't1',
  wd: () => world, PCN: (w) => w.pack.chapters.length, aCount: () => 0, EN: () => 0,
  toast: noop, t: (k) => k, stageOf: () => 0, setSugg: noop,
  appendMsg: (tt, m) => rec('输出给玩家', { who: m && m.who }),
  pkSet: (tt, s) => rec('提交事件（置标志）', { n: s }),
  Lz: (v) => (v && (v.zh || v.en || v)) || '',
  packBeats: () => [], save: noop, packRefresh: noop, packRun: () => rec('演出（播 then）'),
  packLove: (tt, k) => rec('写结果（好感）', { k }),
  packSt: () => ({ end: {} }), taskClaimOnce: () => false,
  renderChat: noop, scrollChat: noop, levelUpCheck: noop, $: () => ({ hidden: true }),
  track: (n) => rec('埋点 ' + n),
  loveWrite: (tt, id, d, why) => rec('写结果 love(' + why + ')', { id, d }),
  stopResolve: () => rec('演出（播 then）'),
};
const block = cut('function pkSess(th)', 'function packNext()');
const api = new Function(...Object.keys(stubs), block + '\nreturn { pkOpenMark, packPick, packAfterPick };')(...Object.values(stubs));

api.pkOpenMark(th, 1);
rec('— 玩家点了 A —');
api.packPick('A');
rec('— 后果结算 —');
api.packAfterPick(th, 'A');

console.log('剧本回合的调用顺序：');
for (const s of seq) {
  const d = s.who ? ' who=' + s.who : s.n ? ' ' + s.n : s.id ? ' ' + s.id + ' ' + (s.d == null ? '' : s.d) : '';
  console.log('  ' + String(s.i).padStart(2) + '  ' + s.what + d);
}

const at = (k) => seq.findIndex(s => s.what.startsWith(k));
const iCommit = at('提交事件'), iPlay = at('演出'), iResult = at('写结果');
const twoPhase = iCommit >= 0 && iPlay >= 0 && iCommit < iPlay;
const resultAfter = iResult >= 0 && iPlay >= 0 && iResult > iPlay;

console.log('\nA. 提交是否早于演出：' + (twoPhase ? '是 ✓（两段式的第一段成立）' : '否 ✗'));
console.log('   结果写入是否晚于演出：' + (resultAfter ? '是 ✓（第三段成立）' : '否 ✗'));

// B. AI 回合：模型提议的数值有没有前置验证
const src = fs.readFileSync('source/src/app3_chat.js', 'utf8');
const line = (src.match(/if\(r\.love\)[^\n]*/) || [''])[0];
const clamped = /Math\.max\(0,Math\.min\(6,/.test(line);
const viaEntry = /loveWrite\(th,id/.test(line);
console.log('\nB. AI 回合里模型提议的好感：');
console.log('   走唯一入口 loveWrite：' + (viaEntry ? '是' : '否'));
console.log('   数值本身有夹值：' + (clamped ? '是（0..6，只增不减）' : '否'));
console.log('   是否先验证前置（例如：本拍他是否在场 / 是否已冷却）：否 —— 模型说加就加');

console.log('\n结论：两段式在代码里是成立的（提交 → 演出 → 写结果）；');
console.log('      缺的不是顺序，是**第二段里的前置验证**：模型提议的数值没有任何事实依据检查。');
process.exit(0);
