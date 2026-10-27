// 看 msgHTML 那 19 层包装是「后处理」还是「改写调用」，决定怎么收（只读）
import fs from 'node:fs';

const SRC = 'source/src';
const RE = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*msgHTML\s*;\s*\n?\s*msgHTML\s*=\s*function\s*\(([^)]*)\)\s*\{/g;

const rows = [];
for (const f of fs.readdirSync(SRC).filter(x => x.endsWith('.js'))) {
  const src = fs.readFileSync(SRC + '/' + f, 'utf8');
  RE.lastIndex = 0;
  let m;
  while ((m = RE.exec(src))) {
    const open = m.index + m[0].length;
    let d = 1, j = open;
    while (j < src.length && d > 0) { const c = src[j]; if (c === '{') d++; else if (c === '}') d--; j++ }
    const body = src.slice(open, j - 1);
    const prev = m[1];

    /* 分类：后处理（先调用、再加工、返回 h/r） vs 其它 */
    const callsInner = new RegExp('\\b' + prev + '\\b').test(body);
    const postprocess = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*/.test(body) && /return\s+\1/.test(body);
    const shortCircuit = new RegExp('return\\s+"').test(body) && !postprocess;

    rows.push({
      file: f, prev, args: m[2].trim(), chars: body.length,
      callsInner, postprocess, shortCircuit,
      head: body.replace(/\s+/g, ' ').slice(0, 90)
    });
  }
}

const post = rows.filter(r => r.postprocess), other = rows.filter(r => !r.postprocess);
console.log('msgHTML 包装共 ' + rows.length + ' 层：后处理 ' + post.length + ' · 其它 ' + other.length + '\n');
console.log('— 后处理型（可以先执行内层、再依次加工）—');
post.forEach(r => console.log('  ' + r.file.padEnd(22) + String(r.chars).padStart(5) + '  ' + r.head));
if (other.length) {
  console.log('\n— 其它形状（需人工看）—');
  other.forEach(r => console.log('  ' + r.file.padEnd(22) + String(r.chars).padStart(5) + '  ' + r.head));
}
