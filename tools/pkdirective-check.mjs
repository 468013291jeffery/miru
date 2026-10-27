// 剧本指令分发表的闸（2026-10-27）
//
//   把「代码扫出来的赢家」和「app109_pkdirect.js 里声明的赢家」对账。
//   任一条不符就红 —— 因为那意味着**行为已经悄悄变了**（加载顺序变了 / 有人又包了一层）。
//
//   红的三类：
//     ① 扫到某个类型有消费型处理者，但表里没登记
//     ② 表里写的赢家 ≠ 扫出来的最外层赢家（加载顺序变了 ⇒ 谁生效变了）
//     ③ 表里声明为"死代码"的实现，现在其实是赢家（它活了）
import fs from 'node:fs';

import { scanPkDirective } from './pkdirective-scan.mjs';

const SRC = 'source/src';
const { layers, winner } = scanPkDirective(SRC, 'source/build.py');

/* 读声明 */
const dec = fs.readFileSync(SRC + '/app109_pkdirect.js', 'utf8');
const declared = {};
for (const m of dec.matchAll(/^\s{4}([a-z0-9_]+):\s*\{\s*by:\s*'([^']*)'/gm)) declared[m[1]] = m[2];
const deadDecl = {};
for (const m of dec.matchAll(/\{\s*type:\s*'([a-z0-9_]+)',\s*by:\s*'([^']*)'/g)) deadDecl[m[1] + '@' + m[2]] = true;

const problems = [];

/* ① 扫到但没登记 */
for (const ty of Object.keys(winner)) {
  if (!(ty in declared)) problems.push('① 未登记的类型: ' + ty + '（实际由 ' + winner[ty].file + ' 处理）');
}

/* ② 登记的赢家与扫出来的不一致 */
for (const [ty, by] of Object.entries(declared)) {
  if (!by) continue;
  if (!winner[ty]) { problems.push('② 表里写了 ' + ty + ' → ' + by + '，但代码里没人消费它'); continue }
  if (winner[ty].file !== by) problems.push('② ' + ty + ' 的赢家变了: 表里 ' + by + ' · 实际 ' + winner[ty].file);
}

/* ③ 声明为死代码的，现在别是赢家 */
for (const key of Object.keys(deadDecl)) {
  const [ty, by] = key.split('@');
  if (winner[ty] && winner[ty].file === by) problems.push('③ ' + ty + ' 的死代码活了: ' + by + ' 现在是赢家');
}

console.log('扫到 ' + layers.length + ' 层认领型 · ' + Object.keys(winner).length + ' 个类型 · 表里登记 ' + Object.keys(declared).length + ' 个');
if (problems.length) {
  console.log('✗ ' + problems.length + ' 处不一致：');
  problems.slice(0, 10).forEach(p => console.log('   ' + p));
  process.exit(1);
}
console.log('分发表与代码一致（谁赢 = 表里写的那一行）');
