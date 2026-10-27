// 样式「生效值」快照（2026-10-27）
//
//   为什么需要它：把 `shell.html` 里 5 次 `.dkwrap` 并成 1 次，**必然改变 CSS 文本**，
//   而那可能正是对的 ⇒ 样式不能用文本对拍，只能用**生效值**对拍（getComputedStyle）。
//
//   用法：
//     node tools/style-computed-snapshot.mjs            拍基线（写 tools/style-computed-baseline.json）
//     node tools/style-computed-snapshot.mjs --check    与基线逐格比（check-all 里跑这一种）
//     node tools/style-computed-snapshot.mjs --json     原样读数
//
//   三条判据（缺一条这张闸就是摆设）：
//     ① 与基线逐格**逐字节**一致
//     ② 每个探针的每个属性都必须是**非空**读数（空串 = 没算出来 ⇒ 会「全空但一致」地假绿）
//     ③ 探针数量与名字集合必须一致（少一个探针也是红 —— 否则删掉那个探针就等于让它绿）
//
//   前提：本地服务在 8131（tools/serve.mjs）。探针页：tools/style-computed-snapshot.html
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const PORT = process.env.MIRU_PORT || 8131;
/* ⚠️ 别叫 `URL`：会遮住全局构造函数，`new URL(import.meta.url)` 直接抛（上一次实测撞过） */
const PAGE = 'http://127.0.0.1:' + PORT + '/tools/style-computed-snapshot.html';
const EDGE = process.env.MIRU_EDGE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const BASE = path.join(ROOT, 'tools', 'style-computed-baseline.json');
const WRITE = !process.argv.includes('--check');
const JSONOUT = process.argv.includes('--json');

function unesc(s) {
  return String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}

const r = spawnSync(EDGE, ['--headless=new', '--disable-gpu', '--no-sandbox',
  '--virtual-time-budget=20000', '--dump-dom', PAGE], { encoding: 'utf8', maxBuffer: 96 * 1024 * 1024 });
const dom = r.stdout || '';
const b = /<pre id="out"[^>]*>([\s\S]*?)<\/pre>/.exec(dom);
if (!b) { console.log('✗ 拿不到快照读数（本地服务要跑在 ' + PORT + '，见 tools/serve.mjs）'); process.exit(2) }
let data;
try { data = JSON.parse(unesc(b[1]).replace(/^CSS_SNAP_JSON:/, '')) }
catch (e) { console.log('✗ 读数解析失败：' + String(e.message).slice(0, 120) + '\n  ' + unesc(b[1]).slice(0, 160)); process.exit(2) }

if (JSONOUT) { console.log(JSON.stringify(data, null, 2)); process.exit(0) }

const rows = data.rows || [];
const bad = [];

/* ② 空值 = 这个探针根本没算出来（多半祖先 display:none）。空值一律算红，绝不当「一致」。 */
for (const m of (data.missing || [])) bad.push('探针读数不完整：' + m);
/* ① 与基线逐格比 */
let diffTotal = 0, diffRows = [];
const cur = { v: 1, at: data.at, count: rows.length, rows: rows };
const flat = (rws) => {
  const o = {};
  for (const x of rws) for (const k of Object.keys(x.vals || {})) o[x.name + ' · ' + k] = x.vals[k];
  return o;
};
const curFlat = flat(rows);

if (WRITE) {
  fs.writeFileSync(BASE, JSON.stringify(cur, null, 1) + '\n', 'utf8');
  console.log('✓ 基线已写：tools/style-computed-baseline.json —— ' +
    rows.length + ' 个探针 × ' + (rows[0] ? Object.keys(rows[0].vals).length : 0) + ' 个属性 = ' + Object.keys(curFlat).length + ' 格');
  process.exit(bad.length ? 1 : 0);
}

if (!fs.existsSync(BASE)) { console.log('✗ 没有基线（先跑一次不带 --check 的）'); process.exit(2) }
const base = JSON.parse(fs.readFileSync(BASE, 'utf8'));
const baseFlat = flat(base.rows || []);

/* ③ 探针名字集合必须一致 */
const baseNames = new Set((base.rows || []).map(x => x.name));
const curNames = new Set(rows.map(x => x.name));
for (const n of baseNames) if (!curNames.has(n)) bad.push('探针消失了：' + n + '（删探针 ≠ 变绿）');
for (const n of curNames) if (!baseNames.has(n)) bad.push('多出没登记的探针：' + n + '（加探针要重拍基线）');

for (const k of Object.keys(baseFlat)) {
  if (!(k in curFlat)) { bad.push('基线有、现在没有：' + k); continue }
  if (baseFlat[k] !== curFlat[k]) {
    diffTotal++;
    if (diffRows.length < 15) diffRows.push('    ' + k + '\n      基线: ' + baseFlat[k] + '\n      现在: ' + curFlat[k]);
  }
}
if (diffTotal) bad.push(diffTotal + ' 格生效值变了');

if (bad.length) {
  console.log('✗ 样式生效值快照 ' + bad.length + ' 处不符：');
  for (const x of bad.slice(0, 10)) console.log('   ' + x);
  if (diffRows.length) { console.log('   逐格：'); for (const d of diffRows) console.log(d) }
  process.exit(1);
}
console.log('✓ 样式生效值快照一致：' + rows.length + ' 个探针 × ' +
  (rows[0] ? Object.keys(rows[0].vals).length : 0) + ' 个属性 = ' + Object.keys(curFlat).length + ' 格，逐字节相同');
process.exit(0);
