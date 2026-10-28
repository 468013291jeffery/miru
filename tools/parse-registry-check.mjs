#!/usr/bin/env node
/* parse-registry-check — 「剧本解析只剩一张表」的闸（2026-10-29）
 *
 * 为什么要有它：
 *   `imParse` / `imBuild` 曾经被 4 个文件各自 `imParse = function(){…}` 包一层，
 *   层序**只由 build.py 的 parts[] 决定** —— 包错一层不会报错，只会「结果怪一点」
 *   （⟦ITEM⟧ 能用，纯粹是因为 app101 恰好排在 app94 之后）。
 *   现在它们注册进 PARSE（与 VOICE.use 同形），这条闸守住三件事：
 *     ① 层表就是那一张：名字、顺序、各自管 parse 还是 build
 *     ② 没有人再偷偷 `imParse =` / `imBuild =`（那是回到猴子补丁的路）
 *     ③ 兼容门还在（老调用点 imParse(...) / imBuild(...) 仍然能用）
 *
 * 判据（缺一即红）：
 *   - PARSE.use 的出现顺序 === 期望层表
 *   - 源码里 `imParse =` / `imBuild =` 赋值 0 处，`_imParse9x` / `_imBuild9x` 0 处
 *   - app51 里有 imParse/imBuild 两个兼容门，且都 delegate 到 PARSE
 *   - `window.__parse` 存在（显示接口）
 *   - 注册顺序 === build.py parts[] 里这些文件的装载顺序（顺序即语义）
 *
 * 自检（--selftest）：四臂，必须能红、且红在预期那条
 *   A 正常树 → 绿
 *   B 删掉一层注册 → 红（点名缺哪层）
 *   C 加一层重名 → 红
 *   D 把 app101 提到 app94 前面 → 红（顺序）
 *   E 在 app90 里塞回 `imParse = function` → 红（猴子补丁回潮）
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const EXPECT = [
  { name: 'app90:youturn', file: 'app90_youturn.js', parse: true, build: true },
  { name: 'app94:directives', file: 'app94_official2.js', parse: true, build: true },
  { name: 'app94:scene-rereg', file: 'app94_official2.js', parse: false, build: true },
  { name: 'app94:you94', file: 'app94_official2.js', parse: true, build: true },
  { name: 'app101:item', file: 'app101_you.js', parse: true, build: false },
];

function readTree(files) {
  const m = {};
  for (const f of files) m[f] = fs.readFileSync(path.join(ROOT, 'source', 'src', f), 'utf8');
  return m;
}
const ALL = ['app51_import.js', 'app90_youturn.js', 'app94_official2.js', 'app101_you.js'];
const LOADED = ALL.slice(); // 装载顺序由 build.py 的 parts[] 决定，下面单独核

function check(tree) {
  const err = [], ok = [];
  // 1) 收集注册（按文件装载顺序 + 文件内出现顺序）
  const regs = [];
  for (const f of LOADED) {
    const src = tree[f] || '';
    for (const chunk of src.split('PARSE.use(').slice(1)) {
      const nm = chunk.match(/^\s*["']([^"']+)["']/); if (!nm) continue;
      const body = chunk.split('PARSE.use(')[0];          // 切到下一层为止，别把下一层算进来
      regs.push({ name: nm[1], file: f, parse: /parse\s*:/.test(body), build: /build\s*:/.test(body) });
    }
  }
  if (regs.length !== EXPECT.length) err.push('注册层数 ' + regs.length + ' ≠ 期望 ' + EXPECT.length + '：' + regs.map(r => r.name).join(' / '));
  const seen = new Set();
  for (const r of regs) { if (seen.has(r.name)) err.push('重名注册：' + r.name + '（同一层注册了两次，层序会静默变）'); seen.add(r.name) }
  if (regs.length === EXPECT.length) {
    for (let i = 0; i < EXPECT.length; i++) {
      const a = regs[i], b = EXPECT[i];
      if (a.name !== b.name) err.push('第 ' + (i + 1) + ' 层是 ' + a.name + '，期望 ' + b.name + '（顺序即语义）');
      else if (a.parse !== b.parse || a.build !== b.build) err.push(a.name + ' 的职责不对：parse=' + a.parse + ' build=' + a.build);
      else if (a.file !== b.file) err.push(a.name + ' 注册在 ' + a.file + '，期望 ' + b.file);
    }
    if (!err.length) ok.push('层表一致：' + regs.map(r => r.name + (r.parse && r.build ? '(p+b)' : r.parse ? '(p)' : '(b)')).join(' → '));
  }
  // 2) 猴子补丁不许回潮
  const all = Object.entries(tree).map(([f, s]) => [f, s]);
  for (const [f, s] of all) {
    if (/^\s*imParse\s*=/m.test(s)) err.push(f + ' 里又有 `imParse =` 赋值（回到猴子补丁了）');
    if (/^\s*imBuild\s*=/m.test(s)) err.push(f + ' 里又有 `imBuild =` 赋值（回到猴子补丁了）');
    if (/_imParse9\d|_imBuild9\d/.test(s)) err.push(f + ' 里还有 `_imParse9x/_imBuild9x` 旧包法');
  }
  if (!err.length) ok.push('没有 imParse=/imBuild= 重赋值，也没有 _im*9x 旧包法');
  // 3) 兼容门 + 显示接口
  const core = tree['app51_import.js'] || '';
  if (!/function imParse\(text\)\s*\{\s*return PARSE\.parse/.test(core)) err.push('app51 的 imParse 兼容门不见了');
  if (!/function imBuild\(doc, as\)\s*\{\s*return PARSE\.build/.test(core)) err.push('app51 的 imBuild 兼容门不见了');
  if (!/window\.__parse\s*=/.test(core)) err.push('window.__parse（显示接口）不见了');
  if (!err.length) ok.push('兼容门 + __parse 都在');
  // 4) 装载顺序与 parts[] 一致
  const build = fs.readFileSync(path.join(ROOT, 'source', 'build.py'), 'utf8');
  const partsM = build.match(/parts=\[(.*?)\]/s);
  if (!partsM) err.push('读不到 build.py 的 parts[]');
  else {
    const parts = [...partsM[1].matchAll(/"([^"]+\.js)"/g)].map(m => m[1]);
    const idx = ALL.map(f => parts.indexOf(f));
    if (idx.some(i => i < 0)) err.push('parts[] 里缺文件：' + ALL.filter((f, i) => idx[i] < 0).join(', '));
    else if (!(idx[0] < idx[1] && idx[1] < idx[2] && idx[2] < idx[3])) err.push('装载顺序不是 51 → 90 → 94 → 101（注册顺序=层序，必须先装载里层）');
    else ok.push('parts[] 装载顺序 51(' + idx[0] + ') → 90(' + idx[1] + ') → 94(' + idx[2] + ') → 101(' + idx[3] + ')');
  }
  return { pass: !err.length, err, notes: ok };
}

const tree = readTree(ALL);
const r = check(tree);

if (process.argv.includes('--selftest')) {
  const arms = [];
  const t = JSON.parse(JSON.stringify(tree));
  const clone = () => JSON.parse(JSON.stringify(tree));
  // A 正常
  arms.push(['A 正常树', () => check(clone()).pass === true]);
  // B 删一层
  arms.push(['B 删掉 app101 那一层', () => { const x = clone(); x['app101_you.js'] = x['app101_you.js'].replace(/PARSE\.use\("app101:item"[\s\S]*?\}\);\s*/, ''); const q = check(x); return !q.pass && q.err.some(e => /层数/.test(e)) }]);
  // C 重名
  arms.push(['C 重名（再注册一次 app90:youturn）', () => { const x = clone(); x['app101_you.js'] += '\nPARSE.use("app90:youturn", { parse: function(n,t){return n(t)} });\n'; const q = check(x); return !q.pass && q.err.some(e => /重名/.test(e)) }]);
  // D 顺序错：把 item 那一层从 app101 拆掉、改注册在 app94 的最前面（层数仍是 5，只有顺序变）
  arms.push(['D 顺序错（item 挪到第 2 层）', () => { const x = clone(); x['app101_you.js'] = x['app101_you.js'].replace(/PARSE\.use\("app101:item"[\s\S]*?\}\);\s*/, ''); x['app94_official2.js'] = x['app94_official2.js'].replace('function off94Parse', 'PARSE.use("app101:item", { parse: function(n,t){return n(t)} });\nfunction off94Parse'); const q = check(x); return !q.pass && q.err.some(e => /第 2 层/.test(e)) }]);
  // E 猴子补丁回潮
  arms.push(['E app90 里塞回 imParse = function', () => { const x = clone(); x['app90_youturn.js'] += '\nimParse = function(t){ return t };\n'; const q = check(x); return !q.pass && q.err.some(e => /imParse =/.test(e)) }]);
  let bad = 0;
  for (const [name, fn] of arms) {
    let pass = false; try { pass = fn() } catch (e) { pass = false }
    if (!pass) bad++;
    console.log((pass ? '✓ ' : '✗ ') + name);
  }
  console.log(bad ? '\n' + bad + ' 臂没打中' : '\n五臂全中（正常绿 / 四枚变异各自红在预期那条）');
  process.exit(bad ? 1 : 0);
}

for (const l of r.notes) console.log('  ✓ ' + l);
for (const l of r.err) console.log('  ✗ ' + l);
console.log(r.pass ? '解析层注册表 OK' : '解析层注册表有 ' + r.err.length + ' 条问题');
process.exit(r.pass ? 0 : 1);
