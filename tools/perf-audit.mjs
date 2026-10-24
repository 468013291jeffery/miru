// 卡顿/内存的实际测量（不猜）：单文件体积构成 · 无界数组 · 每帧循环 · 频繁全量保存
//
//   node tools/perf-audit.mjs
//
// 只回答「哪里大、哪里会长、哪里每帧都在跑」，不回答「所以应该怎么改」。
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'source/src';
const files = fs.readdirSync(SRC).filter(f => f.endsWith('.js'));

console.log('=== 1. 单文件构成（构建产物的前十大块）===');
const sizes = files.map(f => ({ f, n: fs.statSync(path.join(SRC, f)).size })).sort((a, b) => b.n - a.n);
const total = sizes.reduce((a, b) => a + b.n, 0);
console.log(`  ${files.length} 个源文件 · 合计 ${(total / 1024 / 1024).toFixed(2)} MB`);
const html = fs.statSync('index.html').size;
console.log(`  产物 index.html: ${(html / 1024 / 1024).toFixed(2)} MB（源合计占 ${(total / html * 100).toFixed(0)}%）`);
for (const s of sizes.slice(0, 10)) {
  console.log(`    ${s.f.padEnd(28)} ${(s.n / 1024).toFixed(0).padStart(6)} KB  ${(s.n / html * 100).toFixed(1)}%`);
}

console.log('\n=== 2. 无界数组：只 push 不裁剪的 ===');
const unbounded = [];
for (const f of files) {
  const text = fs.readFileSync(path.join(SRC, f), 'utf8');
  const lines = text.split('\n');
  lines.forEach((ln, i) => {
    const m = ln.match(/([\w.$]+)\s*\.push\(/);
    if (!m) return;
    const arr = m[1];
    // 同一个文件里有没有对它的裁剪（slice / splice / = [] / length=）
    const pruned = new RegExp(`(${arr.replace(/[.$]/g, '\\$&')}\\s*=\\s*[^;]*\\.slice\\(|${arr.replace(/[.$]/g, '\\$&')}\\s*=\\s*\\[\\]|${arr.replace(/[.$]/g, '\\$&')}\\.splice\\(|${arr.replace(/[.$]/g, '\\$&')}\\.length\\s*=)`).test(text);
    if (!pruned) unbounded.push({ f, line: i + 1, arr: arr.replace(/^th\./, ''), txt: ln.trim().slice(0, 80) });
  });
}
const byArr = new Map();
for (const u of unbounded) {
  const k = u.arr;
  if (!byArr.has(k)) byArr.set(k, []);
  byArr.get(k).push(u);
}
for (const [k, list] of [...byArr].sort((a, b) => b[1].length - a[1].length).slice(0, 12)) {
  console.log(`  ${k.padEnd(22)} ${list.length} 处 push，本文件内没看到裁剪  ← ${list[0].f}:${list[0].line}`);
}

console.log('\n=== 3. 每帧 / 定时循环 ===');
for (const f of files) {
  const text = fs.readFileSync(path.join(SRC, f), 'utf8');
  const lines = text.split('\n');
  lines.forEach((ln, i) => {
    if (/requestAnimationFrame\s*\(/.test(ln) || /setInterval\s*\(/.test(ln)) {
      console.log(`  ${f}:${i + 1}  ${ln.trim().slice(0, 90)}`);
    }
  });
}

console.log('\n=== 4. 全量保存：save() 的调用点与体积 ===');
let saveCalls = 0;
for (const f of files) {
  const text = fs.readFileSync(path.join(SRC, f), 'utf8');
  saveCalls += (text.match(/(?<![\w.])save\s*\(\s*\)/g) || []).length;
}
console.log(`  save() 调用点 ${saveCalls} 处`);
const saveDef = files.map(f => path.join(SRC, f)).find(p => /function save\s*\(/.test(fs.readFileSync(p, 'utf8')));
if (saveDef) {
  const text = fs.readFileSync(saveDef, 'utf8');
  const i = text.indexOf('function save');
  console.log('  save 定义（' + path.basename(saveDef) + '）：');
  console.log('    ' + text.slice(i, i + 420).split('\n').map(s => s.trim()).filter(Boolean).slice(0, 8).join('\n    '));
}

console.log('\n=== 5. 事件监听：是不是每次渲染都加一个 ===');
for (const f of files) {
  const text = fs.readFileSync(path.join(SRC, f), 'utf8');
  const n = (text.match(/addEventListener\s*\(/g) || []).length;
  if (n >= 3) console.log(`  ${f.padEnd(28)} ${n} 处`);
}
