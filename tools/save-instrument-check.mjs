// 存档观测闸（第五件收口）
//   ① saveRaw 存在（原始实现）② save 包了一层且走 SAVE ③ SAVE 模块在 saveRaw 之前 ④ 归因解析器存在
// 变异：去掉包装 ⇒ 红；把 SAVE 挪到 app1_core 之后 ⇒ 加载顺序红。
import fs from 'node:fs';

const h = fs.readFileSync('index.html', 'utf8');
let pass = 0, fail = 0;
const t = (n, ok, extra) => { console.log('  ' + (ok ? '✓' : '✗') + ' ' + n + (extra ? ' — ' + extra : '')); ok ? pass++ : fail++ };

const iRaw = h.indexOf('function saveRaw(');
const iWrap = h.indexOf('window.SAVE.go(saveRaw)');
const iMod = h.indexOf('window.SAVE = SV');

t('原始实现 saveRaw 存在', iRaw > 0);
t('save 包了一层并走 SAVE', iWrap > 0);
t('观测模块存在', iMod > 0);
t('观测模块早于 saveRaw（否则包不上）', iMod > 0 && iRaw > iMod, '模块 ' + iMod + ' · saveRaw ' + iRaw);
t('归因解析（跳过包装层自身帧）', /at\\s\+'|at\\s\+/.test(h) || h.includes('saveRaw|callerOf|go'));

const tool = fs.existsSync('tools/line2file.mjs');
t('行号→源文件 工具在', tool);

console.log('\n' + pass + ' passed, ' + fail + ' failed');
if (fail) { console.log('FAILED: 存档观测接线不完整'); process.exit(1) }
console.log('save instrument OK');
