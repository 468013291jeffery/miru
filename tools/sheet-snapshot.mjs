// 弹层快照：每个具名弹层开一次，HTML 逐字节对拍（2026-10-27）
//
//   node tools/sheet-snapshot.mjs            拍基线（写 tools/sheet-baseline.json）
//   node tools/sheet-snapshot.mjs --check    与基线逐字节比（check-all 里跑这个）
//   node tools/sheet-snapshot.mjs --json     原样读数
//
//   三条判据（缺一条这张闸就是摆设）：
//     ① 每个弹层的 HTML 与基线**逐字节**一致
//     ② 每个弹层都必须**有内容**（空串 = 那一刻根本没弹出来；不查这条会「全空而一致」地假绿）
//     ③ 弹层名字集合必须一致（删掉一个探针 = 让它绿）
//
//   射程（写在明处）：只覆盖 SHEETS 里列的那几个、且只用「一个带 pk 的 solo 线程」造场景；
//   需要真实消息对象/真实章节的弹层（imgSheet 之类）没进来 —— 它们今天不在快照里，别当成"验过了"。
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const PORT = process.env.MIRU_PORT || 8131;
const PAGE = 'http://127.0.0.1:' + PORT + '/tools/sheet-snapshot.html';
const EDGE = process.env.MIRU_EDGE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const BASE = path.join(ROOT, 'tools', 'sheet-baseline.json');
const CHECK = process.argv.includes('--check');

const unesc = (s) => String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

const r = spawnSync(EDGE, ['--headless=new', '--disable-gpu', '--no-sandbox',
  '--virtual-time-budget=25000', '--dump-dom', PAGE], { encoding: 'utf8', maxBuffer: 128 * 1024 * 1024 });
const dom = r.stdout || '';
const m = /<pre id="out"[^>]*>([\s\S]*?)<\/pre>/.exec(dom);
if (!m) { console.log('✗ 拿不到快照（本地服务要跑在 ' + PORT + '）'); process.exit(2) }
const raw = unesc(m[1]);
if (raw.startsWith('ERR')) { console.log('✗ ' + raw.slice(0, 160)); process.exit(2) }
let data;
try { data = JSON.parse(raw.replace(/^SHEET_SNAP_JSON:/, '')) } catch (e) { console.log('✗ 解析失败：' + e.message + '\n  ' + raw.slice(0, 160)); process.exit(2) }

if (process.argv.includes('--json')) { console.log(JSON.stringify(data, null, 1)); process.exit(0) }

const rows = data.rows || [];
const bad = [];
/* ② 空内容 */
for (const x of rows) {
  if (x.err) bad.push(x.name + ' 抛错：' + x.err);
  else if (!x.len) bad.push(x.name + ' 是空的（那一刻没弹出来，或造场景失败）');
}
const cur = { v: 1, at: data.at, log: data.log, rows: rows.map(x => ({ name: x.name, len: x.len, html: x.html })) };

if (!CHECK) {
  fs.writeFileSync(BASE, JSON.stringify(cur, null, 1) + '\n', 'utf8');
  console.log('✓ 基线已写：tools/sheet-baseline.json —— ' + rows.length + ' 个弹层');
  for (const x of rows) console.log('   ' + x.name.padEnd(16) + x.len + ' 字符' + (x.len ? '' : '  ⚠ 空'));
  process.exit(bad.length ? 1 : 0);
}

if (!fs.existsSync(BASE)) { console.log('✗ 没有基线（先跑一次不带 --check 的）'); process.exit(2) }
const base = JSON.parse(fs.readFileSync(BASE, 'utf8'));
const bNames = new Set((base.rows || []).map(x => x.name)), cNames = new Set(rows.map(x => x.name));
for (const n of bNames) if (!cNames.has(n)) bad.push('弹层消失了：' + n);
for (const n of cNames) if (!bNames.has(n)) bad.push('多出没登记的弹层：' + n + '（要拍基线）');
for (const b of (base.rows || [])) {
  const c = rows.find(x => x.name === b.name);
  if (!c) continue;
  if (c.html !== b.html) {
    /* 找第一个不同的位置，把上下文打出来 —— 只说"变了"没法定位 */
    let i = 0; while (i < Math.min(b.html.length, c.html.length) && b.html[i] === c.html[i]) i++;
    bad.push(b.name + ' 变了（基线 ' + b.html.length + ' → 现在 ' + c.html.length + ' 字符，首个差异在第 ' + i + ' 位）\n' +
      '      基线: …' + b.html.slice(Math.max(0, i - 40), i + 60) + '\n' +
      '      现在: …' + c.html.slice(Math.max(0, i - 40), i + 60));
  }
}
if (bad.length) {
  console.log('✗ 弹层快照 ' + bad.length + ' 处不符：');
  for (const x of bad.slice(0, 8)) console.log('   ' + x);
  process.exit(1);
}
console.log('✓ 弹层快照一致：' + rows.length + ' 个弹层，HTML 逐字节相同');
process.exit(0);
