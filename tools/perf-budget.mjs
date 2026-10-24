// 体积预算：主包不许把 PDF.js 再塞回去（2026-10-25 拆出去省了 1.36 MB / 13%）
//
//   node tools/perf-budget.mjs
//
// 判据（都能红）：
//   ① index.html < 9.5 MB —— 现在是 9.02；一旦把 1.4 MB 的 pdfjs 塞回去就会超线
//   ② pdfjs_embed.js 在仓库根、能定义两个全局（这是「按需加载」能成立的前提）
//   ③ index.html 里对它的引用只有加载器那一处（不许再有内联副本）
import fs from 'node:fs';
import vm from 'node:vm';

const LIMIT_MB = 9.5;
let pass = 0; const fails = [];
const ok = (n, c, d) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fails.push(n); console.log('  ✗ ' + n, d === undefined ? '' : '→ ' + d); } };

const idx = fs.statSync('index.html').size;
const mb = idx / 1024 / 1024;
ok(`index.html ${mb.toFixed(2)} MB < ${LIMIT_MB} MB`, mb < LIMIT_MB, mb.toFixed(2));

ok('pdfjs_embed.js 在仓库根', fs.existsSync('pdfjs_embed.js'));

let a = 0, b = 0;
try {
  const src = fs.readFileSync('pdfjs_embed.js', 'utf8');
  const sb = { window: {} };
  vm.createContext(sb);
  vm.runInContext(src, sb);
  a = (sb.window.PDFJS_SRC || '').length;
  b = (sb.window.PDFJS_WORKER_SRC || '').length;
} catch (e) {
  console.log('  !! 跑不动：' + e.message);
}
// 口径：主库 ~320 KB、worker ~1.09 MB（第一版我把判据写成 SRC>1MB，把自己判红了）
ok('PDFJS_SRC 有内容（>200 KB）', a > 200000, a);
ok('PDFJS_WORKER_SRC 有内容（>1 MB）', b > 1000000, b);

const html = fs.readFileSync('index.html', 'utf8');
// 只数带引号的字面量：注释里提到文件名不算引用（第一版就被自己的注释判红了）
const refs = (html.match(/"pdfjs_embed\.js"/g) || []).length;
ok('index.html 里只引用一次（加载器，带引号那条）', refs === 1, refs);
ok('index.html 里没有内联的 PDFJS_SRC 赋值', !/PDFJS_SRC\s*=/.test(html));

console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) { console.log('FAILED: ' + fails.join(' | ')); process.exit(1); }
console.log('perf budget OK');
