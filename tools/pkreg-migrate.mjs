// 26 层 pkDirective 包装 → PKREG.add（形状不变，只把"下一层"从闭包变量换成参数 next）
//
//   原：  const _pkX = pkDirective; pkDirective = function(th,b){ BODY（内含 _pkX(th,b)） };
//   新：  PKREG.add('文件.js', function(th,b,next){ BODY（把 _pkX 换成 next） });
//
//   · 先在原文收集全部匹配，再从后往前替换（防自匹配）
//   · 每文件改完立刻 node --check，不过就回滚该文件
//   · 不支持"完全不含 _pkX 调用"的层（那种不是包装，跳过并报出）
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const dry = process.argv.includes('--dry');
const SRC = 'source/src';
const RE = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*pkDirective\s*;\s*\n?\s*pkDirective\s*=\s*function\s*\(([^)]*)\)\s*\{/g;

let total = 0;
const report = [];

for (const f of fs.readdirSync(SRC).filter(x => x.endsWith('.js'))) {
  if (f === 'app110_pkreg.js') continue;
  const P = SRC + '/' + f;
  const orig = fs.readFileSync(P, 'utf8');
  if (!/pkDirective\s*=\s*function/.test(orig)) continue;

  RE.lastIndex = 0;
  const hits = [];
  let m;
  while ((m = RE.exec(orig))) {
    const open = m.index + m[0].length;
    let d = 1, j = open;
    while (j < orig.length && d > 0) { const c = orig[j]; if (c === '{') d++; else if (c === '}') d--; j++ }
    hits.push({ start: m.index, end: j, prev: m[1], args: m[2], body: orig.slice(open, j - 1) });
  }
  if (!hits.length) continue;

  let t = orig, n = 0;
  for (let k = hits.length - 1; k >= 0; k--) {
    const h = hits[k];
    const nameRe = new RegExp('\\b' + h.prev.replace(/\$/g, '\\$') + '\\b', 'g');
    if (!nameRe.test(h.body)) { report.push('跳过 ' + f + '（body 里没有调用 ' + h.prev + '）'); continue }
    const body = h.body.replace(nameRe, 'next');
    const args = h.args.trim();
    const sig = args ? (args + ', next') : 'next';
    const rep = 'PKREG.add(' + JSON.stringify(f) + ', function(' + sig + '){' + body + '});';
    t = t.slice(0, h.start) + rep + t.slice(h.end);
    n++;
  }
  if (!n) continue;
  total += n;

  if (dry) { report.push(f + ' × ' + n + '（dry）'); continue }

  fs.writeFileSync(P, t, 'utf8');
  let ok = true;
  try { execFileSync(process.execPath, ['--check', P], { stdio: 'pipe' }) } catch (e) { ok = false }
  if (!ok) { fs.writeFileSync(P, orig, 'utf8'); report.push('回滚 ' + f + '（语法不过）') }
  else report.push(f + ' × ' + n);
}

console.log((dry ? '将改 ' : '已改 ') + total + ' 层');
report.forEach(x => console.log('  ' + x));
