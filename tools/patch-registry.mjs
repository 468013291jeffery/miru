// 猴补丁登记表（第 ④ 件：先看清，不合并）
//
//   这个代码库有 358 处「存旧函数再覆盖」：
//       const _renderChat = renderChat;
//       renderChat = function(){ … _renderChat.apply(this, arguments) … }
//   每一处都是一条**没有契约的接口**：谁覆盖谁只由文件名顺序决定。
//   今晚「改一处、坏另一处」的机制就在这里 —— 我改原始函数，实际跑的是包了三四层之后那份。
//
//   这个脚本只做一件事：把「谁覆盖了谁」排成表，按加载顺序。
//
//   用法：node tools/patch-registry.mjs [--json]
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'source/src';
const BUILD = 'source/build.py';

// 加载顺序 = build.py 里 parts 的顺序（不是文件名字典序）
const py = fs.readFileSync(BUILD, 'utf8');
const m = /parts\s*=\s*\[([\s\S]*?)\]/.exec(py);
const order = m ? [...m[1].matchAll(/"([^"]+\.js)"/g)].map(x => x[1]) : fs.readdirSync(SRC).filter(f => f.endsWith('.js'));
const rank = new Map(order.map((f, i) => [f, i]));

// 两种写法都收：
//   const _x = x;  x = function …
//   x = (function(_x){ … })(x);
const pat1 = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*([A-Za-z_$][\w$]*)\s*;[\s\S]{0,200}?\2\s*=\s*(?:function\b|\(|\w+\s*=>)/g;
const pat2 = /([A-Za-z_$][\w$]*)\s*=\s*\(\s*function\s*\(\s*([A-Za-z_$][\w$]*)\s*\)[\s\S]{0,400}?\}\s*\)\s*\(\s*\1\s*\)/g;

const table = new Map();   // 被覆盖的函数 → [{file, kind, via}]
const files = fs.existsSync(SRC) ? fs.readdirSync(SRC).filter(f => f.endsWith('.js')) : [];

for (const f of files) {
  const txt = fs.readFileSync(path.join(SRC, f), 'utf8');
  for (const re of [pat1, pat2]) {
    re.lastIndex = 0;
    let hit;
    while ((hit = re.exec(txt))) {
      const covered = re === pat1 ? hit[2] : hit[1];
      if (!covered || covered.length < 3) continue;
      const arr = table.get(covered) || [];
      arr.push({ file: f, order: rank.has(f) ? rank.get(f) : 9999, line: txt.slice(0, hit.index).split('\n').length });
      table.set(covered, arr);
    }
  }
}

const rows = [...table.entries()]
  .map(([fn, arr]) => ({ fn, wrappers: arr.sort((a, b) => a.order - b.order) }))
  .sort((a, b) => b.wrappers.length - a.wrappers.length);

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(rows, null, 2));
} else {
  const total = rows.reduce((a, r) => a + r.wrappers.length, 0);
  console.log(`=== 被覆盖的函数 ${rows.length} 个 · 覆盖点 ${total} 处 ===\n`);
  for (const r of rows.slice(0, 15)) {
    console.log(`${r.fn}  ← 被 ${r.wrappers.length} 处包过`);
    for (const w of r.wrappers) console.log(`     ${w.file.padEnd(24)} L${w.line}`);
  }
  console.log(`\n（只列前 15 个；--json 看全部）`);
  console.log('读法：同一个函数被包得越多，改它就越危险 —— 你改的是原始那份，跑的是最外层那份。');
}
