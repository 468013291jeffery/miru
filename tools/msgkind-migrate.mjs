// 把 msgHTML 的单类型认领层改成 MSGKIND.inline(...)（原位安装，顺序不变）
//
//   原：  const _mh = msgHTML; msgHTML = function(m,i,th){ if(m.k!=="X") return _mh(m,i,th); …; return '<div…' };
//   新：  MSGKIND.inline('文件.js', ['X'], function(m,i,th,next){ if(m.k!=="X") return next(m,i,th); …; return '<div…' });
//
//   · 只处理「body 里确实调用了被捕获的那个变量」的形状；其它跳过并报出
//   · 每个文件改完立刻 node --check，不过就回滚该文件
//   · 认领类型从 body 里的 m.k==="X" / m.k!=="X" 推断（只认一个类型的才自动搬）
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const dry = process.argv.includes('--dry');
const SRC = 'source/src';
/* 只搬这些文件（其余留给下一批，要求人工读条件） */
const TARGETS = ['app96_social.js', 'app42_decline.js', 'app20_fx_booth.js', 'app37_hooks.js'];

const RE = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*msgHTML\s*;\s*\n?\s*msgHTML\s*=\s*function\s*\(([^)]*)\)\s*\{/g;

for (const f of TARGETS) {
  const P = SRC + '/' + f;
  const orig = fs.readFileSync(P, 'utf8');
  RE.lastIndex = 0;
  const hits = [];
  let m;
  while ((m = RE.exec(orig))) {
    const open = m.index + m[0].length;
    let d = 1, j = open;
    while (j < orig.length && d > 0) { const c = orig[j]; if (c === '{') d++; else if (c === '}') d--; j++ }
    hits.push({ start: m.index, end: j, prev: m[1], args: m[2], body: orig.slice(open, j - 1) });
  }
  if (!hits.length) { console.log('跳过 ' + f + '（没有 const X=msgHTML 形状）'); continue }

  let t = orig, n = 0;
  for (let k = hits.length - 1; k >= 0; k--) {
    const h = hits[k];
    const nameRe = new RegExp('\\b' + h.prev.replace(/\$/g, '\\$') + '\\b', 'g');
    if (!nameRe.test(h.body)) { console.log('跳过 ' + f + '（body 没调用 ' + h.prev + '）'); continue }

    const kinds = new Set();
    let mm;
    const reK = /m\.k\s*[!=]==\s*"([a-zA-Z0-9_]+)"/g;
    while ((mm = reK.exec(h.body))) kinds.add(mm[1]);
    if (kinds.size !== 1) { console.log('跳过 ' + f + '（认领了 ' + kinds.size + ' 个类型，需人工）'); continue }
    const kind = [...kinds][0];

    const body = h.body.replace(nameRe, 'next');
    const args = h.args.trim();
    const sig = args ? (args + ', next') : 'next';
    const rep = 'MSGKIND.inline(' + JSON.stringify(f) + ', [' + JSON.stringify(kind) + '], function(' + sig + '){' + body + '});';
    t = t.slice(0, h.start) + rep + t.slice(h.end);
    n++;
  }
  if (!n) continue;

  if (dry) { console.log(f + ' × ' + n + '（dry）'); continue }
  fs.writeFileSync(P, t, 'utf8');
  let ok = true;
  try { execFileSync(process.execPath, ['--check', P], { stdio: 'pipe' }) } catch (e) { ok = false }
  if (!ok) { fs.writeFileSync(P, orig, 'utf8'); console.log('回滚 ' + f + '（语法不过）') }
  else console.log(f + ' × ' + n);
}
