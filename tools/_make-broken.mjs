// 变异样本生成器：把指纹重新塞回 CREATOR 那个大字符串里（= 复现 2026-10-26 的黑屏 bug 形态）
// 输出 index.broken.html，供 bundle-integrity --file= 判定它必须变红
import fs from 'node:fs';

let h = fs.readFileSync('index.html', 'utf8');

// 1) 取出当前的指纹语句
const m = h.match(/window\.MIRU_BUILD="[^"]*";\n/);
if (!m) throw new Error('找不到指纹语句');
const stampLine = m[0];
h = h.replace(stampLine, '');

// 2) 以 <script> 形式插到第一个 </head> 之前（那个 </head> 属于 CREATOR 的字符串）
const idx = h.indexOf('</head>');
if (idx < 0) throw new Error('找不到 </head>');
const stampTag = '<script>' + stampLine.trim() + '</script>';
h = h.slice(0, idx) + stampTag + h.slice(idx);

fs.writeFileSync('index.broken.html', h, 'utf8');
console.log('已生成 index.broken.html · 指纹位置', h.indexOf('window.MIRU_BUILD'), '· CREATOR', h.indexOf('window.CREATOR_HTML'));
