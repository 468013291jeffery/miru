// msgHTML 那 19 层其实是「按消息类型分发渲染」——查有没有两个层认领同一个类型（只读）
import fs from 'node:fs';

const SRC = 'source/src';
const RE = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*msgHTML\s*;\s*\n?\s*msgHTML\s*=\s*function\s*\(([^)]*)\)\s*\{/g;

const layers = [];
for (const f of fs.readdirSync(SRC).filter(x => x.endsWith('.js'))) {
  const src = fs.readFileSync(SRC + '/' + f, 'utf8');
  RE.lastIndex = 0;
  let m;
  while ((m = RE.exec(src))) {
    const open = m.index + m[0].length;
    let d = 1, j = open;
    while (j < src.length && d > 0) { const c = src[j]; if (c === '{') d++; else if (c === '}') d--; j++ }
    const body = src.slice(open, j - 1);

    const kinds = new Set();
    let t;
    const reEq = /m\.k\s*===\s*"([a-zA-Z0-9_]+)"/g;
    while ((t = reEq.exec(body))) kinds.add(t[1]);
    const reTest = /\/\^?x?\(?([a-zA-Z0-9_|]+)\)?\$?\/\.test\(m\.k/.exec(body);
    if (reTest) reTest[1].split('|').forEach(k => kinds.add('x' + k.replace(/^x/, '')));

    if (kinds.size) layers.push({ file: f, kinds: [...kinds], chars: body.length });
  }
}

const byKind = {};
for (const L of layers) for (const k of L.kinds) (byKind[k] = byKind[k] || []).push(L.file);

console.log('认领类型的层：' + layers.length + '\n');
Object.entries(byKind).sort().forEach(([k, files]) => {
  const dup = files.length > 1 ? '  ← 冲突！' : '';
  console.log('  ' + k.padEnd(12) + files.join(', ') + dup);
});
const conflicts = Object.entries(byKind).filter(([, f]) => f.length > 1);
console.log('\n冲突类型：' + conflicts.length + ' 个');
