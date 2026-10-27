// 消息渲染快照对拍（2026-10-27）
//
//   用途：迁移 `msgHTML` 那 19 层之前/之后，**逐字节**比较每种消息类型的渲染结果。
//   判据不是"看着还行"，而是：同一样例、同一线程，HTML 一字不差。
//
//   用法：
//     node tools/render-snapshot.mjs --write    把当前渲染存成基线 tools/render-baseline.json
//     node tools/render-snapshot.mjs --check    重新渲染并与基线比对（check-all 用）
//
//   实现：起一个 headless 浏览器打开 tools/render-snapshot.html，
//         那个页面把游戏装进 iframe、对 19 种消息各渲染一次，把 HTML 吐在一行 JSON 里。
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const PORT = process.env.MIRU_PORT || 8131;
const URL = 'http://127.0.0.1:' + PORT + '/tools/render-snapshot.html';
const BASE = 'tools/render-baseline.json';
const EDGE = process.env.MIRU_EDGE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function snapshot() {
  const r = spawnSync(EDGE, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    '--virtual-time-budget=16000', '--dump-dom', URL
  ], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

  const dom = (r.stdout || '') + (r.stderr || '');
  const m = /SNAPSHOT_JSON:(\{[\s\S]*?\})<\/pre>/.exec(dom);
  if (!m) {
    console.log('拿不到快照（页面没起来？本地服务要跑在 ' + PORT + '，见 tools/serve.mjs）');
    return null;
  }
  try { return JSON.parse(m[1]) } catch (e) { console.log('快照 JSON 解析失败: ' + e.message); return null }
}

/* 规范化：把"会变但不是结构"的东西抹平，否则每次跑都不一样、对拍永远红。
   · 内联 base64 图（头像/封面占位）→ data:IMG
   · 13 位时间戳 → T
   只抹这两类：它们与 msgHTML 的分支结构无关。 */
function normalize(obj) {
  const out = {};
  for (const k of Object.keys(obj)) {
    out[k] = String(obj[k])
      .replace(/data:image\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+/gi, 'data:IMG')
      .replace(/\b1[6-9]\d{11}\b/g, 'T');
  }
  return out;
}

const snap = snapshot();
if (!snap) process.exit(2);
const norm = normalize(snap);

const kinds = Object.keys(norm);
const snapUse = norm;
const errs = kinds.filter(k => String(norm[k]).startsWith('ERR '));

if (process.argv.includes('--write')) {
  fs.writeFileSync(BASE, JSON.stringify(norm, null, 2) + '\n', 'utf8');
  console.log('基线已写：' + kinds.length + ' 种消息 → ' + BASE);
  if (errs.length) console.log('  ⚠ 有 ' + errs.length + ' 种渲染抛错（基线里也记下来了）: ' + errs.join(', '));
  process.exit(0);
}

if (!fs.existsSync(BASE)) { console.log('没有基线（先跑 --write）'); process.exit(1) }
const base = JSON.parse(fs.readFileSync(BASE, 'utf8'));

const diffs = [];
for (const k of kinds) {
  if (!(k in base)) { diffs.push(k + '：基线里没有'); continue }
  if (String(base[k]) !== String(norm[k])) {
    const a = String(base[k]), b = String(norm[k]);
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) i++;
    diffs.push(k + '：第 ' + i + ' 字符起不同（基线 ' + a.length + ' 字符 · 现在 ' + b.length + ' 字符）');
  }
}
for (const k of Object.keys(base)) if (!(k in norm)) diffs.push(k + '：现在渲染不出来了');

if (diffs.length) {
  console.log('✗ 渲染结果变了 ' + diffs.length + ' 处：');
  diffs.slice(0, 10).forEach(d => console.log('   ' + d));
  console.log('   （迁移前后本应逐字节一致；若这次是有意改版，跑 --write 更新基线）');
  process.exit(1);
}
console.log('渲染快照与基线逐字节一致（' + kinds.length + ' 种消息）');
process.exit(0);
