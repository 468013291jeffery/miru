// 验证 TURN 接线在产物里，并做一次「不卡 busy」的静态核对
import fs from 'node:fs';

const h = fs.readFileSync('index.html', 'utf8');
const checks = [
  ['TURN 模块在产物里', /window\.TURN\s*=/.test(h)],
  ['setter 绑定', /TURN\.bind\(function/.test(h)],
  ["acquire('reply')", /TURN\.acquire\('reply'\)/.test(h)],
  ["release('reply')", /TURN\.release\('reply'\)/.test(h)],
  ['装进构建（app103 在列表里）', /app103_turn\.js/.test(fs.readFileSync('source/build.py', 'utf8'))],
  ['模块文件存在', fs.existsSync('source/src/app103_turn.js')],
];
let pass = 0, fail = 0;
for (const [n, ok] of checks) { console.log('  ' + (ok ? '✓' : '✗') + ' ' + n); ok ? pass++ : fail++ }
console.log(`\n${pass} passed, ${fail} failed`);

// 关键的静态一致性：三件套必须同时存在，否则 release 会把 busy 卡死
const three = ['TURN.bind', "TURN.acquire('reply')", "TURN.release('reply')"].every(s => h.includes(s));
console.log(three ? '✓ 三件套齐全（bind/acquire/release）' : '✗ 三件套缺一 —— busy 可能永远卡住');
process.exit(fail || !three ? 1 : 0);
