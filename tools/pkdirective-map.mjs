// pkDirective 链的地图（2026-10-27）
//
//   现状：`pkDirective` 被 **26 处**猴补丁包过。每一层的形状都一样：
//       if (Array.isArray(b) && b[0]==="sys" && b[1]==="<类型>") { …做点事…; return true }
//       return _pkDirNN(th, b)
//   ⇒ **这不是包装链，是一张伪装成链的分发表**，而"谁先谁后"由**文件名加载顺序**决定。
//
//   这个工具只做地图与冲突检测（只读）：
//     · 每层认领哪些 `b[1]` 类型、是不是"消费型"（return true）
//     · 同一个类型被**两个消费型**认领 ⇒ 冲突：谁生效取决于加载顺序，另一个永远不跑
//     · 不认领类型、只看所有 beat 的 ⇒ 标记为「观察者」
//
//   用法：node tools/pkdirective-map.mjs [--json]
import fs from 'node:fs';

const SRC = 'source/src';
const RE = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*pkDirective\s*;\s*pkDirective\s*=\s*function\s*\(([^)]*)\)\s*\{/g;

const build = fs.readFileSync('source/build.py', 'utf8');
const m = /parts\s*=\s*\[([\s\S]*?)\]/.exec(build);
const order = m ? [...m[1].matchAll(/"([^"]+\.js)"/g)].map(x => x[1]) : [];
const rank = new Map(order.map((f, i) => [f, i]));

const layers = [];
for (const f of fs.readdirSync(SRC).filter(x => x.endsWith('.js'))) {
  const src = fs.readFileSync(SRC + '/' + f, 'utf8');
  RE.lastIndex = 0;
  let h;
  while ((h = RE.exec(src))) {
    const open = h.index + h[0].length;
    let d = 1, j = open;
    while (j < src.length && d > 0) { const c = src[j]; if (c === '{') d++; else if (c === '}') d--; j++ }
    const body = src.slice(open, j - 1);

    // 认领的类型：b[1]==="x" / ["a","b"].includes(b[1]) 两种写法
    const types = new Set();
    let t;
    const reEq = /b\[1\]\s*===\s*"([a-z0-9_]+)"/g;
    while ((t = reEq.exec(body))) types.add(t[1]);
    const reInc = /\[([^\]]*)\]\.includes\(b\[1\]\)/g;
    while ((t = reInc.exec(body))) {
      [...t[1].matchAll(/"([a-z0-9_]+)"/g)].forEach(x => types.add(x[1]));
    }

    const consumes = /return\s+true/.test(body);
    layers.push({
      file: f,
      order: rank.has(f) ? rank.get(f) : 9999,
      prev: h[1],
      chars: body.length,
      types: [...types],
      consumes,
    });
  }
}

layers.sort((a, b) => a.order - b.order);

/* 冲突：同一类型被两个「消费型」认领 —— 只有最外层那个会跑 */
const byType = {};
for (const L of layers) {
  if (!L.consumes) continue;
  for (const ty of L.types) (byType[ty] = byType[ty] || []).push(L.file + (L.types.length > 1 ? '' : ''));
}
const conflicts = Object.entries(byType).filter(([, v]) => v.length > 1);

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ layers, conflicts }, null, 2));
  process.exit(0);
}

console.log('=== pkDirective 的 ' + layers.length + ' 层 ===\n');
console.log('加载序  文件                    认领类型                       消费?  字符');
for (const L of layers) {
  console.log(
    String(L.order).padStart(5) + '  ' + L.file.padEnd(23) +
    (L.types.length ? L.types.join(',').padEnd(30) : '（观察者：看所有 beat）'.padEnd(30)) +
    (L.consumes ? ' 是 ' : ' 否 ') + String(L.chars).padStart(5)
  );
}

console.log('\n=== 冲突：同一类型被两个消费型认领（只有最外层会跑）===');
if (!conflicts.length) console.log('  没有');
for (const [ty, who] of conflicts) console.log('  ' + ty.padEnd(10) + who.join('  vs  '));

const consumers = layers.filter(L => L.consumes).length;
console.log('\n合计：消费型 ' + consumers + ' 层 · 观察者 ' + (layers.length - consumers) + ' 层 · 冲突类型 ' + conflicts.length + ' 个');
