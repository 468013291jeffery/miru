// 把 index.html 里的行号翻回「哪个源文件第几行」（2026-10-27）
//   用途：__save() / __turn() / __pkst() 报出来的调用点都是 index.html:NNNN，
//        这个工具把它翻成 source/src/xxx.js:MM。
//   做法：按 build.py 的 parts 顺序重放一遍拼接（块之间用 "\n" 连接），得到每个文件的起始行。
//
//   用法：node tools/line2file.mjs 12345        → app3_chat.js:678
//        node tools/line2file.mjs 12345 13000  → 一段区间的归属
import fs from 'node:fs';

const py = fs.readFileSync('source/build.py', 'utf8');
const m = /parts\s*=\s*\[([\s\S]*?)\]/.exec(py);
if (!m) { console.error('读不到 build.py 的 parts'); process.exit(1) }
const parts = [...m[1].matchAll(/"([^"]+\.js)"/g)].map(x => x[1]);

// build.py 里正片之前的头部（assets 等）行数未知，所以用「相对锚定」：
//   在产物里找到每个文件的第一行原文，用它的行号作为起点 —— 比复算偏移可靠。
const html = fs.readFileSync('index.html', 'utf8').split('\n');
const starts = [];
for (const p of parts) {
  const src = fs.readFileSync('source/src/' + p, 'utf8').split('\n').filter(l => l.trim().length > 12)[0];
  if (!src) continue;
  const needle = src.trim();
  const idx = html.findIndex(l => l.trim() === needle);
  if (idx >= 0) starts.push({ file: p, line1: idx + 1 });
}
starts.sort((a, b) => a.line1 - b.line1);

function lookup(n) {
  let hit = null;
  for (const s of starts) if (s.line1 <= n) hit = s; else break;
  if (!hit) return '(在头部，未归属)';
  return hit.file + ' （块内第 ' + (n - hit.line1 + 1) + ' 行）';
}

const args = process.argv.slice(2).map(Number).filter(n => n > 0);
if (!args.length) {
  console.log('已定位 ' + starts.length + '/' + parts.length + ' 个文件块');
  console.log('用法: node tools/line2file.mjs <行号…>');
} else {
  for (const n of args) console.log(n + '  →  ' + lookup(n));
}
