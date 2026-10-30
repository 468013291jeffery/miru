#!/usr/bin/env node
/* entry-modes-probe — 「进去有哪几个视角可选」普查 + 补齐是否成立（只读）
 *
 * 由来（2026-10-30）：Ann 报「现在进去只有导演视角，别的视角没了」。
 *   量下来内置 38 部剧本来就有三条（导演 / 扮演 X / 加入场景）——
 *   但这条路一直**由数据决定**：`packModes = [导演] ++ w.pack.join`。
 *   少写一条 `join`，玩家就少一条路，而且没有任何东西会红。
 *   ⇒ 改成「三路永远是三路，缺的补上、并给一条提示」（source/src/app114_entry.js）。
 *
 * 判据（写死，缺一条就是没做到）：
 *   A 数据面：没有哪部剧只给一个视角；也没有哪一行的名字是空的
 *   B 补齐：`join` 全空的世界 → 仍然三条，且 hint 非空
 *   C 补齐：`join` 只有主角的世界 → 仍然三条（含 side），且 hint 非空
 *   D 负对照：`join` 写全了的真剧 → hint 必须为空（否则提示就是装饰，永远亮着）
 *   E 界面面：弹层按钮数 == packModes 条数；且 D 那类剧的弹层上**不出现**提示
 *
 * 依赖：本地服务跑在 8131（node tools/serve.mjs 8131）
 * 用法：node tools/entry-modes-probe.mjs [--json]
 */
import { spawnSync } from 'node:child_process';

const EDGE = process.env.MIRU_EDGE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = process.env.MIRU_PORT || 8131;
const URL = `http://127.0.0.1:${PORT}/tools/entry-modes-probe.html`;
const JSON_ONLY = process.argv.includes('--json');

const r = spawnSync(EDGE, [
  '--headless=new', '--disable-gpu', '--no-sandbox',
  '--virtual-time-budget=60000', '--dump-dom', URL
], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const dom = (r.stdout || '') + (r.stderr || '');
const m = /ENTRYMODES_JSON:(\{[\s\S]*?\})<\/pre>/.exec(dom);
if (!m) {
  const err = /ERR [^<]*/.exec(dom);
  console.log('拿不到读数' + (err ? '（' + err[0] + '）' : '（页面没起来？本地服务要跑在 ' + PORT + '）'));
  process.exit(2);
}

let d;
try { d = JSON.parse(m[1]) } catch (e) { console.log('JSON 解析失败: ' + e.message); process.exit(2) }

if (JSON_ONLY) { console.log(JSON.stringify(d, null, 2)); process.exit(0) }

const A = d.arms || {};
const has = (arm, keys) => !!arm && Array.isArray(arm.modes) && keys.every(k => arm.modes.some(x => x.split(':')[0] === k));

const checks = [];
checks.push(['A 数据面：没有只给一个视角的剧', d.onlyWatch.length === 0, d.onlyWatch.length ? d.onlyWatch.join(', ') : '全部 ≥2']);
checks.push(['A 数据面：没有空名字的行', d.blank.length === 0, d.blank.length ? d.blank.join(', ') : '无']);
checks.push(['B join 全空 → 三条都在 + 有提示', has(A.B, ['watch', 'side']) && A.B.modes.length >= 3 && !!A.B.hint, JSON.stringify(A.B && A.B.modes) + (A.B && A.B.hint ? ' · 提示=' + A.B.hint : ' · 提示为空')]);
checks.push(['C join 只有主角 → 三条都在 + 有提示', has(A.C, ['watch', 'side']) && A.C.modes.length >= 3 && !!A.C.hint, JSON.stringify(A.C && A.C.modes)]);
checks.push(['D 负对照：写全了的剧 hint 必须为空', !!A.D && A.D.hint === '' && A.D.derived === 0, A.D ? (A.D.id + ' · derived=' + A.D.derived + ' · hint=' + JSON.stringify(A.D.hint)) : '缺读数']);
checks.push(['E 界面面：按钮数 == 条数', d.control.buttons === d.control.modes.length && d.control.buttons >= 2, d.control.pack + ' · 按钮=' + d.control.buttons + ' · 条数=' + d.control.modes.length]);
checks.push(['E 界面面：写全了的剧不显示提示行', !!d.diag && d.diag.hintShown === false, 'hintShown=' + (d.diag && d.diag.hintShown)]);
checks.push(['F 首屏三条同源（join 空也三条）', !!A.F && !A.F.err && Array.isArray(A.F.modes) && A.F.modes.length === 3 && A.F.modes.indexOf('side') >= 0 && A.F.modes.indexOf('watch') >= 0, A.F ? (JSON.stringify(A.F.modes) + ' · ' + JSON.stringify(A.F.labels)) : '缺读数']);

console.log('=== 每部剧「进去能选什么」（共 ' + d.total + ' 部）===');
d.multi.slice(0, 6).forEach(x => console.log('  ' + x));
if (d.multi.length > 6) console.log('  …（其余 ' + (d.multi.length - 6) + ' 部同类）');
console.log('\n=== 判据 ===');
let bad = 0;
checks.forEach(([n, ok, extra]) => { if (!ok) bad++; console.log('  ' + (ok ? '✓' : '✗') + ' ' + n + ' — ' + extra) });
if (d.errors.length) { console.log('  读数出错：'); d.errors.forEach(x => console.log('    ' + x)) }
console.log('\n' + (bad === 0 ? '✓ PASS：三路永远是三路，补出来的会说出来' : '✗ FAIL：' + bad + ' 条不成立'));
process.exit(bad === 0 ? 0 : 1);
