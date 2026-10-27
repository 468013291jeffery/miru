// 弹层入口普查：谁在开弹层、谁在包它、谁绕过它直接改 DOM（2026-10-27 · **只读**）
//
//   背景：Ann 那句「UI 出问题 = 没做整合 / 没做工程优化 / 没做入口」里，弹层是还没碰的一块。
//   先量清楚它的**真形状** —— 第一版我以为痛点是「120 个 sheet() 直连」，
//   量完才发现不是：入口只有一个，但 **二十来个具名 sheet 各自被包了 1~3 层**，
//   而且 `sheet` / `closeSheet` 自己也被包过。
//
//   输出四块：
//     ① 入口：`sheet(html,onMount)` 定义在哪、被谁包过；`closeSheet` 同理
//     ② 具名弹层：每个 `*Sheet` 函数被几个文件包过、有几处直连调用
//     ③ 绕过：哪些地方自己去摸 `.sheet-card` / `.sheet .plans` 这类内部结构（说明它没走入口）
//     ④ 叠加：`sheet()` 定义里有没有先 `closeSheet()`（有 ⇒ 结构上不可能叠两个）
//
//   node tools/sheet-census.mjs           人类可读
//   node tools/sheet-census.mjs --json    原样读数
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const SRC = path.join(ROOT, 'source', 'src');
const files = fs.readdirSync(SRC).filter(f => f.endsWith('.js') && !f.includes('.bak-'));
const src = files.map(f => ({ f, lines: fs.readFileSync(path.join(SRC, f), 'utf8').split('\n') }));

const hit = (re, opts = {}) => {
  const out = [];
  for (const { f, lines } of src) for (let i = 0; i < lines.length; i++) {
    if (re.test(lines[i])) out.push({ f, line: i + 1, text: lines[i].trim() });
  }
  return out;
};

/* ① 入口与它的包装链 */
const sheetDefs = hit(/(^|\W)function\s+sheet\s*\(/);
const sheetPatchers = hit(/^\s*(?:\{\s*)?sheet\s*=\s*function/);
const closeDefs = hit(/(^|\W)function\s+closeSheet\s*\(/);
const closePatchers = hit(/closeSheet\s*=\s*function/);
/* 结构上会不会叠：定义体里第一句是不是 closeSheet() */
const sheetBody = sheetDefs.length
  ? src.find(x => x.f === sheetDefs[0].f).lines.slice(sheetDefs[0].line - 1, sheetDefs[0].line + 2).join(' ')
  : '';
const closesFirst = /function\s+sheet\s*\([^)]*\)\s*\{\s*closeSheet\(\)/.test(sheetBody);

/* ② 具名弹层 `*Sheet`：定义 + 包装链 + 直连调用 */
const named = new Map();   // name → {defs:[], patches:[], calls:[]}
const NAME = /\b([A-Za-z_$][\w$]*Sheet[A-Za-z0-9_$]*)\b/g;
for (const { f, lines } of src) {
  lines.forEach((ln, i) => {
    for (const m of ln.matchAll(NAME)) {
      const name = m[1];
      if (!named.has(name)) named.set(name, { defs: [], patches: [], calls: [] });
      const rec = named.get(name);
      /* ⚠️ 顺序要紧：先判「包装」，再判「定义」。
         包装行长得像 `const _menuSheet45=menuSheet;menuSheet=function(…)` —— 它同时含
         `NAME=function`，先判定义的话每一处包装都会被记成新定义（第一版就 46 个全是「包 0 层」）。 */
      const isPatch = new RegExp('=\\s*' + name + '\\s*;').test(ln) && new RegExp(name + '\\s*=\\s*function').test(ln);
      if (isPatch) rec.patches.push(f + ':' + (i + 1));
      else if (new RegExp('function\\s+' + name + '\\s*\\(').test(ln) || new RegExp('(^|[^.\\w])' + name + '\\s*=\\s*function').test(ln)) rec.defs.push(f + ':' + (i + 1));
      /* 直连调用：NAME(（不含定义行与包装行本身） */
      if (new RegExp('(^|[^.\\w])' + name + '\\s*\\(').test(ln) && !isPatch && !new RegExp('function\\s+' + name).test(ln)) rec.calls.push(f + ':' + (i + 1));
    }
  });
}
/* ⚠️ 必须去重：一行里 `const _menuSheet45=menuSheet;menuSheet=function(){…}` 含**两次** `menuSheet`，
   matchAll 会匹配两次 ⇒ 按出现次数计数会把 7 层数成 14 层（第一版就是这么翻倍的）。
   计数单位是「哪一行的哪一次包装」，不是「那个词出现了几次」。 */
for (const [, v] of named) {
  v.defs = [...new Set(v.defs)];
  v.patches = [...new Set(v.patches)];
  v.calls = [...new Set(v.calls)];
}
/* 去掉只被当作「被包装对象」出现的伪具名；closeSheet 是**关闭**器，单独报，不混进「具名弹层」 */
const names = [...named.entries()].filter(([n, v]) => (v.defs.length || v.patches.length) && n !== 'closeSheet')
  .sort((a, b) => (b[1].patches.length + b[1].calls.length) - (a[1].patches.length + a[1].calls.length));
const closeCalls = hit(/(^|[^.\w])closeSheet\s*\(/).filter(x => !/function\s+closeSheet/.test(x.text));

/* ③ 绕过入口：直接摸弹层内部结构 */
const bypass = hit(/\.sheet-card|\.sheet \.plans|\.sheet\b[^]*?\$\$?\(|\$\("#cards"\)|\$\("\.sheet/);

/* ④ 直连 sheet( 的调用点 */
const directSheetCalls = hit(/(^|[^.\w])sheet\s*\(/).filter(x => !/function\s+sheet/.test(x.text) && !/^\s*sheet\s*=\s*function/.test(x.text));

const data = {
  entry: { defs: sheetDefs, patchers: sheetPatchers, closesFirst },
  close: { defs: closeDefs, patchers: closePatchers },
  named: names.map(([name, v]) => ({ name, defs: v.defs, patches: v.patches, calls: v.calls })),
  bypass: bypass.map(x => x.f + ':' + x.line + '  ' + x.text.slice(0, 80)),
  directSheetCalls: directSheetCalls.map(x => x.f + ':' + x.line)
};
if (process.argv.includes('--json')) { console.log(JSON.stringify(data, null, 1)); process.exit(0) }

console.log('弹层入口普查（只读）');
console.log('');
console.log('① 入口 `sheet(html,onMount)`');
console.log('   定义：' + (sheetDefs.map(d => d.f + ':' + d.line).join(', ') || '(没找到)'));
console.log('   定义体第一句就调 closeSheet()：' + (closesFirst ? '是 ⇒ **结构上不可能叠两个**' : '否 ⇒ 可能叠'));
console.log('   被包过：' + (sheetPatchers.length ? sheetPatchers.map(d => d.f + ':' + d.line).join(' · ') : '没有') +
  (sheetPatchers.length ? '  ← 连入口本身都被包了一层' : ''));
console.log('   `closeSheet` 定义：' + (closeDefs.map(d => d.f + ':' + d.line).join(', ') || '(没找到)') +
  ' · 被包过：' + (closePatchers.length ? closePatchers.map(d => d.f + ':' + d.line).join(' · ') : '没有') +
  ' · 直接调用 ' + closeCalls.length + ' 处');
console.log('');
console.log('② 具名弹层 ' + names.length + ' 个（按「被包次数 + 直连调用数」降序）');
for (const [name, v] of names.slice(0, 22)) {
  const flag = v.patches.length >= 2 ? '  ⚠ 包了 ' + v.patches.length + ' 层' : '';
  console.log('   ' + name.padEnd(22) + ' 包 ' + String(v.patches.length).padStart(2) + ' · 调用 ' + String(v.calls.length).padStart(3) + flag);
}
console.log('');
console.log('③ 绕过入口、直接摸弹层内部结构：' + bypass.length + ' 处');
for (const x of bypass.slice(0, 10)) console.log('   ' + x.f + ':' + x.line + '  ' + x.text.slice(0, 74));
if (bypass.length > 10) console.log('   … 还有 ' + (bypass.length - 10) + ' 处');
console.log('');
console.log('④ 直连 `sheet(` 调用点：' + directSheetCalls.length + ' 处 / ' +
  new Set(directSheetCalls.map(x => x.f)).size + ' 个文件');
const top = {};
for (const x of directSheetCalls) top[x.f] = (top[x.f] || 0) + 1;
console.log('   最集中的：' + Object.entries(top).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([f, n]) => f + ' ×' + n).join(' · '));
process.exit(0);
