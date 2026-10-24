// 内容拆包的收益验证：在**副本**上把剧本包裁到只剩 1 部，量冷启动 DOM 可交互时间
//
//   node tools/split-probe.mjs            # 生成 index.gala.html
//   然后用浏览器打开它，读 performance navigation timing
//
// 判据（先写死）：domInteractive 必须掉到基线的 **1/3 以下** 才算值得做；
// 达不到就把 PERF.md 第 4 条降级，不再提。基线见 PERF.md「三·总」= 1,708 ms（本机桌面）。
//
// ⚠️ 只写副本，不动 index.html、不动 source/。
import fs from 'node:fs';

const src = fs.readFileSync('index.html', 'utf8');

// 找 `const PACK_W=[` 并配平到它的 `];`
function cutArray(text, marker) {
  const at = text.indexOf(marker);
  if (at < 0) throw new Error('找不到 ' + marker);
  const open = text.indexOf('[', at);
  let depth = 0, end = -1;
  for (let i = open; i < text.length; i++) {
    const ch = text[i];
    if (ch === '[') depth++;
    else if (ch === ']') { depth--; if (depth === 0) { end = i; break } }
  }
  if (end < 0) throw new Error('配平失败: ' + marker);
  return { at, open, end, json: text.slice(open, end + 1) };
}

const orig = fs.statSync('index.html').size;
const packs = cutArray(src, 'const PACK_W=[');
const arr = JSON.parse(packs.json);
const keep = arr.filter((w) => w && w.id === 'gala');
if (!keep.length) throw new Error('PACK_W 里没有 gala');

const shrunk = '[' + keep.map((w) => JSON.stringify(w)).join(',') + ']';
const out = src.slice(0, packs.open) + shrunk + src.slice(packs.end + 1);
fs.writeFileSync('index.gala.html', out, 'utf8');

const now = fs.statSync('index.gala.html').size;
const mb = (n) => (n / 1024 / 1024).toFixed(2) + ' MB';
console.log('原包      ' + mb(orig));
console.log('副本      ' + mb(now) + '  （少 ' + mb(orig - now) + '，' + Math.round((1 - now / orig) * 100) + '%）');
console.log('剧本数    ' + arr.length + ' → ' + keep.length);
console.log('\n下一步：浏览器打开 http://127.0.0.1:8131/index.gala.html 读 domInteractive，和基线 1,708 ms 比。');
console.log('判据：< ' + Math.round(1708 / 3) + ' ms（1/3）才算值得做。');
