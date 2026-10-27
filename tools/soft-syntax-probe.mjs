// 产物里「soft(…) 后面又接一个 (」= ASI 陷阱：
//   soft("x",fn)      ← 行尾没有分号
//   (function(){…})() ← 下一行以括号开头 ⇒ 被读成 soft(...) 的返回值被调用
//   ⇒ 运行时报 "soft(...) is not a function"（2026-10-27 实测过一次，42 处都受影响）
//
// 闸：发现任何一处就退出码 1。
import fs from 'node:fs';

const h = fs.readFileSync('index.html', 'utf8');
const hits = [];
let i = 0;
while ((i = h.indexOf('soft("', i)) >= 0) {
  const pOpen = h.indexOf('(', i + 4);
  let d = 1, j = pOpen + 1;
  while (j < h.length && d > 0) { const c = h[j]; if (c === '(') d++; else if (c === ')') d--; j++ }
  const after = h.slice(j, j + 40);
  if (/^\s*\(/.test(after)) hits.push({ line: h.slice(0, i).split('\n').length, after: after.replace(/\s+/g, ' ').slice(0, 50) });
  i = j;
}

const total = (h.match(/soft\("/g) || []).length;
if (hits.length) {
  console.log('✗ ' + hits.length + '/' + total + ' 处 soft 调用缺分号（下一行是括号）: L' + hits.slice(0, 5).map(x => x.line).join(', L'));
  process.exit(1);
}
console.log('soft 调用没有 ASI 陷阱（' + total + ' 处检查通过）');
