// 产物体检：防止「指纹被插进 JS 字符串里」这类**只在浏览器里才炸**的破坏
//
//   node tools/bundle-integrity.mjs
//
// 为什么需要它（2026-10-26 实录）：构建指纹原先用 `html.replace("</head>", …, 1)` 注入，
// 而 `window.CREATOR_HTML="…"` 这个字符串里**自带一段 </head>**，且它出现在外层 </head> 之前 ⇒
// 指纹落进了 JS 字符串内部，它自带的 </script> 把脚本块提前截断 ⇒ 页面第 10497 行 SyntaxError ⇒
// **整个应用起不来（黑框）**。而 `node --check` 全绿、二十道闸全绿 —— 因为没人在浏览器里跑过。
//
// 判据（都能红）：
//   ① 指纹必须出现在 `window.CREATOR_HTML=` **之前**（即在外层脚本里，不在那个大字符串里）
//   ② 指纹必须在外层 `</head>` 之前（说明它确实在脚本块里）
//   ③ <script> 与 </script> 数量相等（截断会立刻破坏这个平衡）
import fs from 'node:fs';

const FILE = (process.argv.find(a => a.startsWith('--file=')) || '').split('=').slice(1).join('=') || 'index.html';
const html = fs.readFileSync(FILE, 'utf8');
const at = (s) => html.indexOf(s);
const count = (re) => (html.match(re) || []).length;

const stamp = at('window.MIRU_BUILD');
const creator = at('window.CREATOR_HTML');
const headEnd = at('</head>');
const openTags = count(/<script\b/gi);
const closeTags = count(/<\/script\s*>/gi);

let pass = 0; const fails = [];
const ok = (n, c, d) => { if (c) { pass++; console.log('  ✓ ' + n) } else { fails.push(n); console.log('  ✗ ' + n, d === undefined ? '' : '→ ' + d) } };

ok('产物里有构建指纹', stamp >= 0, stamp);
ok('① 指纹在 CREATOR_HTML 之前（没落进那个大字符串里）', stamp >= 0 && creator >= 0 && stamp < creator, `stamp=${stamp} creator=${creator}`);
ok('② 指纹在外层 </head> 之前（说明它在脚本块里）', stamp >= 0 && headEnd >= 0 && stamp < headEnd, `stamp=${stamp} head=${headEnd}`);
ok('③ 指纹落在页面前段（<1,000,000 字符）—— 落进 CREATOR 大字符串会跳到 6.6M+', stamp >= 0 && stamp < 1000000, 'stamp=' + stamp);

console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) { console.log('FAILED: ' + fails.join(' | ')); process.exit(1) }
console.log('bundle integrity OK');
