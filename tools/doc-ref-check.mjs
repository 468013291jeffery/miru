// 文档引用的每个名字都必须真在（否则就是新的假指针 —— 今晚已经在 ARCHITECTURE 上栽过一次）
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const doc = fs.readFileSync('ARCHITECTURE.md', 'utf8');

/* ① 文件类引用 */
const files = [
  'source/src/app103_turn.js', 'source/src/app104_pkstate.js', 'source/src/app105_save.js',
  'source/src/app106_ui.js', 'source/src/app108_errlog.js', 'source/src/app110_pkreg.js',
  'source/src/app109_pkdirect.js', 'source/src/app3_chat.js',
  'tools/turn-wiring-check.mjs', 'tools/pkstate-check.mjs', 'tools/save-instrument-check.mjs',
  'tools/ui-entry-check.mjs', 'tools/pkdirective-check.mjs', 'tools/empty-catch-check.mjs',
  'tools/on-assign-check.mjs', 'tools/errlog-selftest.mjs', 'tools/sanitize-selftest.mjs',
  'tools/wiring-order-check.mjs', 'tools/patch-registry.mjs', 'tools/line2file.mjs',
  'tools/check-all.mjs', 'tools/read-health.mjs', 'tools/read-errlog.mjs',
  'docs/message-renderers.md'
];
let bad = 0;
for (const f of files) if (!fs.existsSync(f)) { console.log('  ✗ 不存在: ' + f); bad++ }

/* ② 文档里提到的闸，必须真的在 check-all 里 */
const checkAll = fs.readFileSync('tools/check-all.mjs', 'utf8');
const gates = ['turn-wiring-check', 'pkstate-check', 'save-instrument-check', 'ui-entry-check',
  'pkdirective-check', 'empty-catch-check', 'on-assign-check', 'errlog-selftest',
  'sanitize-selftest', 'wiring-order-check', 'patch-registry'];
for (const g of gates) {
  const mentioned = doc.includes(g);
  const registered = checkAll.includes(g);
  if (mentioned && !registered) { console.log('  ✗ 文档提到但没挂进 check-all: ' + g); bad++ }
  if (!mentioned && registered) console.log('  · 挂在 check-all 但文档没提: ' + g);
}

/* ③ 文档里写的数字 vs 实测 */
const run = (c) => { try { return execFileSync(process.execPath, c, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim().split('\n').pop() } catch (e) { return '' } };
const patch = run(['tools/patch-registry.mjs', '--check']);
const m = /(\d+) 函数 \/ (\d+) 处/.exec(patch);
if (m) {
  const sites = Number(m[2]);
  const claimed = Number((/猴补丁\s+148 个函数 \/ (\d+) 处/.exec(doc) || [])[1] || 0);
  console.log('  猴补丁实测 ' + sites + ' · 文档写 ' + claimed + (sites === claimed ? ' ✓' : ' ✗ 过期'));
  if (sites !== claimed) bad++;
}

/* ④ 闸套数 */
const gatesInDoc = Number((/（\*\*(\d+) 套\*\*）/.exec(doc) || [])[1] || 0);
const gatesReal = (checkAll.match(/\['[a-z0-9-]+\.mjs'/g) || []).length;
console.log('  闸套数实测 ' + gatesReal + ' · 文档写 ' + gatesInDoc + (gatesReal === gatesInDoc ? ' ✓' : ' ✗ 过期'));
if (gatesReal !== gatesInDoc) bad++;

console.log(bad ? '\n✗ ' + bad + ' 处不一致' : '\n文档与代码一致');
process.exit(bad ? 1 : 0);
