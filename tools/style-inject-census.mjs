// 样式注入面：**只量不改**的读数（2026-10-27）
//
//   为什么先量再动：`msgHTML` 那条链已经收口（20 层登记 · 两张表绿），下一条「没做整合」的
//   是样式 —— 71 处 `createElement("style")` 散在 57 个文件里。但**能不能拼成一张表，取决于两件事**，
//   现在都还不知道：
//     ① 有没有**晚到**的注入（点开某个 sheet 才加的）⇒ 有的话，静态表会把顺序和时机都改掉
//     ② 同一个选择器是不是真的被**重复定义**过 ⇒ 那才是「改了这里坏那里」的机制，
//        如果重复率是 0，那这 71 处的痛在别处（体积、可读性），拆它的收益就不是我以为的那个
//
//   所以这一版**只输出读数，不改任何东西、也不挂闸**：
//     node tools/style-inject-census.mjs           人类可读
//     node tools/style-inject-census.mjs --json    原样读数
//
//   前提：本地服务在 8131（tools/serve.mjs），页面自己能起来。
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const PORT = process.env.MIRU_PORT || 8131;
const PAGE = 'http://127.0.0.1:' + PORT + '/tools/style-inject-census.html';
const EDGE = process.env.MIRU_EDGE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
/* ⚠️ 别把这个常量叫 `URL` —— 它会把全局 URL 构造函数遮住，`new URL(import.meta.url)` 直接
   `TypeError: URL is not a constructor`（第一版就这么撞的，报错位置还指向下一行）。 */
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');

function unesc(s) {
  return String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}
function grab(dom, tag) {
  const b = new RegExp('<pre id="' + tag + '"[^>]*>([\\s\\S]*?)<\\/pre>').exec(dom);
  if (!b) return null;
  try { return JSON.parse(unesc(b[1]).replace(/^STYLE_JSON:/, '')) }
  catch (e) { return { error: String(e.message).slice(0, 120) } }
}

/* ---------- 运行期 ---------- */
const r = spawnSync(EDGE, ['--headless=new', '--disable-gpu', '--no-sandbox',
  '--virtual-time-budget=20000', '--dump-dom', PAGE], { encoding: 'utf8', maxBuffer: 96 * 1024 * 1024 });
const dom = (r.stdout || '');
const early = grab(dom, 'early'), late = grab(dom, 'late');
if (!early) {
  console.log('✗ 拿不到样式读数（本地服务要跑在 ' + PORT + '，见 tools/serve.mjs）');
  process.exit(2);
}
if (early.error) { console.log('✗ ' + early.error); process.exit(2) }

/* ---------- 静态：注入点（file:line）与它的 CSS 原文指纹 ---------- */
function staticSites() {
  const dir = path.join(ROOT, 'source', 'src');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') && !f.includes('.bak-'));
  const sites = [];
  for (const f of files) {
    const txt = fs.readFileSync(path.join(dir, f), 'utf8');
    const lines = txt.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (!/createElement\(\s*["']style["']\s*\)/.test(lines[i])) continue;
      /* 指纹：从这一行往后 700 字符内找 textContent = 后面的第一个字符串字面量 */
      const from = lines.slice(i, i + 12).join('\n');
      const tm = /textContent\s*=\s*([`"'])([\s\S]{0,400}?)\1/.exec(from);
      let head = '';
      if (tm) head = tm[2].replace(/\s+/g, ' ').trim().slice(0, 64);
      sites.push({ at: f + ':' + (i + 1), head, shape: lines[i].trim().slice(0, 50) });
    }
  }
  /* shell.html 的静态 <style> 也算一个注入点 */
  try {
    const sh = fs.readFileSync(path.join(dir, 'shell.html'), 'utf8');
    const m = /<style>([\s\S]*?)<\/style>/.exec(sh);
    if (m) sites.push({ at: 'shell.html:17', head: m[1].replace(/\s+/g, ' ').trim().slice(0, 64), shape: '<style> 静态标签' });
  } catch (e) { }
  return sites;
}
const sites = staticSites();

/* ---------- 连结：运行期每个 <style> 能不能对回一个 file ----------
   两条路，缺一不可（第一版只有第一条，只对得上 20/65）：
     a 字面量直取：注入点是 `textContent = \`…\`` 这种一整个字面量 —— 头 64 字符直接比
     b 文本回溯：注入是数组 join / 拼接 / 带插值拼出来的，头对不上，但**中段那 36 字符照样在源码里逐字存在**
   b 用的是中段切片，不是头 —— 头部往往是 `\n` 加公共前缀，容易撞。 */
const corpus = {};
{
  const dir = path.join(ROOT, 'source', 'src');
  for (const f of fs.readdirSync(dir)) {
    if (!/\.(js|html)$/.test(f) || f.includes('.bak-')) continue;
    corpus[f] = fs.readFileSync(path.join(dir, f), 'utf8');
  }
}
function owners(slice) {
  if (!slice || slice.length < 16) return [];
  return Object.keys(corpus).filter(f => corpus[f].includes(slice));
}
function literalOwner(sheet) {
  const h = String(sheet.head || '');
  if (!h) return '';
  for (const s of sites) {
    if (!s.head) continue;
    if (s.head.startsWith(h.slice(0, 32)) || h.startsWith(s.head.slice(0, 32))) return s.at;
  }
  return '';
}
for (const s of (early.sheets || [])) {
  s.byLiteral = literalOwner(s);
  const o1 = owners(s.mid), o2 = owners(s.mid2);
  const both = o1.filter(f => o2.indexOf(f) >= 0);
  s.byText = both.length === 1 ? both[0] : (both.length === 0 && o1.length === 1 ? o1[0] : '');
  s.owner = s.byLiteral || s.byText || '';
}
const orphan = (early.sheets || []).filter(s => !s.owner);
const byLiteral = (early.sheets || []).filter(s => s.byLiteral).length;
const byTextOnly = (early.sheets || []).filter(s => !s.byLiteral && s.byText).length;
/* 静态注入点里，哪些在当前这一屏上**没生效**（条件不成立 / 按需）—— 与「晚到」是两件事。
   ⚠️ 按**文件**比，不按 `文件:行` 比：字面量归因给出的是 `file:line`，按行比的话，
   那个文件里所有其它注入点都会被误判成「没生效」（第一版就这么把 26 处报多了）。 */
const liveFiles = new Set((early.sheets || []).map(s => s.owner.split(':')[0]).filter(Boolean));
const notOnScreenFiles = sites.filter(s => !liveFiles.has(s.at.split(':')[0]));

/* ---------- 晚到：2.5 秒 vs 14 秒 ---------- */
const before = new Set((early.sheets || []).map(s => s.hash));
const lateAdds = late ? (late.sheets || []).filter(s => !before.has(s.hash)) : [];

/* ---------- 重复定义：同一 sheet 内叠层 vs 跨 sheet 抢 ---------- */
const allDups = early.dups || [];
const sameSheet = allDups.filter(d => new Set(d.sheets).size === 1);
const crossSheet = allDups.filter(d => new Set(d.sheets).size > 1);

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ early, late, sites, orphan: orphan.map(o => o.head), crossSheet, sameSheet }, null, 2));
  process.exit(0);
}

const L = [];
L.push('样式注入面（只量不改）');
L.push('  运行期 @2.5s ：' + early.count + ' 个 <style> · ' + early.ruleTotal + ' 条规则 · 序列指纹 ' + early.seqHash);
L.push('  运行期 @14s  ：' + (late ? (late.count + ' 个 <style> · ' + late.ruleTotal + ' 条规则 · 序列指纹 ' + late.seqHash) : '（没测到）'));
L.push('  晚到的注入   ：' + (late ? lateAdds.length : '?') + (lateAdds.length ? ' ← ' + lateAdds.slice(0, 6).map(s => (s.head || '').slice(0, 28)).join(' | ') : '（两次一样 ⇒ 这一屏上没有按需注入）'));
L.push('');
L.push('  静态注入点   ：' + sites.length + ' 处 / ' + new Set(sites.map(s => s.at.split(':')[0])).size + ' 个文件');
L.push('  能对回源码   ：' + ((early.sheets || []).length - orphan.length) + ' / ' + (early.sheets || []).length +
  '  = 字面量直取 ' + byLiteral + ' + 文本回溯 ' + byTextOnly);
if (orphan.length) for (const o of orphan.slice(0, 10)) L.push('      ✗ 未归因：' + (o.head || '').slice(0, 52) + '  [' + o.len + ' 字符 / ' + o.rules + ' 条规则]');
if (notOnScreenFiles.length) {
  L.push('  这一屏没生效的注入点：' + notOnScreenFiles.length + ' 处 —— ' +
    notOnScreenFiles.slice(0, 8).map(s => s.at).join(' · ') + (notOnScreenFiles.length > 8 ? ' …' : ''));
}
L.push('');
L.push('  重复定义：' + allDups.length + ' 个选择器被定义了不止一次 —— ' +
  '同 sheet 内叠层 ' + sameSheet.length + ' · 跨 sheet 抢 ' + crossSheet.length);
for (const d of crossSheet.slice(0, 8)) L.push('      [跨] ×' + d.n + '  ' + d.sel.slice(0, 52) + '   sheets ' + JSON.stringify(d.sheets.slice(0, 6)));
for (const d of sameSheet.slice(0, 6)) L.push('      [叠] ×' + d.n + '  ' + d.sel.slice(0, 52) + '   sheet ' + d.sheets[0]);
L.push('');
L.push('  ⇒ 判据①（能否拼一张静态表）：晚到注入 ' + (late ? lateAdds.length : '?') + ' 个 · 这一屏没生效的注入点 ' + notOnScreenFiles.length + ' 处 —— ' +
  ((late && lateAdds.length === 0) ? '这一屏静态可拼（条件型注入仍要按条件保留，其它屏还没量）' : '存在按需注入，拼静态表会改掉顺序与时机'));
L.push('  ⇒ 判据②（重复定义是不是真痛）：跨 sheet 抢 ' + crossSheet.length + ' · 同 sheet 叠层 ' + sameSheet.length + ' —— ' +
  (crossSheet.length > 0 ? '跨文件抢同一个选择器 = 谁赢看加载顺序，这是真痛' :
    '没有跨文件抢；重复全在同一个 sheet 里自己叠，痛在"叠了几层没人知道"，不在顺序'));
console.log(L.join('\n'));
process.exit(0);
