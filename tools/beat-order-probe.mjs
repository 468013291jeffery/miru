#!/usr/bin/env node
/* beat-order-probe — 验「我扮演的角色不许先说」这一刀到底生效没有
 *
 * 为什么不靠 tools/sim-dialogue.mjs：它把模型给的 beats **直接塞进 st.msgs**，
 *   根本不经过 playBeats ⇒ 它看不见那段重排。这里走真页面、走真的 playBeats。
 *
 * 判据（写死）：喂一条「我扮演的角色先说」的回复进去，
 *   渲染出来的第一条必须是别人（或旁白），不是 self。
 *
 * 依赖：本地服务跑在 8131（node tools/serve.mjs 8131）
 * 用法：node tools/beat-order-probe.mjs [--json]
 */
import { spawnSync } from 'node:child_process';

const EDGE = process.env.MIRU_EDGE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = process.env.MIRU_PORT || 8131;
const args = process.argv.slice(2);
const argOf = (k, d) => { const a = args.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=').slice(1).join('=') : d };
const HASH = `#mode=${argOf('mode','open')}&pack=${argOf('pack','crimson')}&as=${argOf('as','adrian')}`;
const URL = `http://127.0.0.1:${PORT}/tools/beat-order-probe.html${HASH}`;
const JSON_ONLY = process.argv.includes('--json');

const r = spawnSync(EDGE, [
  '--headless=new', '--disable-gpu', '--no-sandbox',
  '--virtual-time-budget=120000', '--dump-dom', URL
], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const dom = (r.stdout || '') + (r.stderr || '');
const m = /BEATORDER_JSON:(\[[\s\S]*?\])<\/pre>/.exec(dom);
if (!m) {
  const err = /ERR [^<]*/.exec(dom);
  console.log('拿不到读数' + (err ? '（' + err[0] + '）' : '（页面没起来？本地服务要跑在 ' + PORT + '，见 tools/serve.mjs）'));
  process.exit(2);
}

let rows;
try { rows = JSON.parse(m[1]) } catch (e) { console.log('JSON 解析失败: ' + e.message); process.exit(2) }
const get = (k) => { const x = rows.find(s => s.startsWith(k + ': ')); return x ? x.slice(k.length + 2) : null };

if (JSON_ONLY) { console.log(JSON.stringify(Object.fromEntries(rows.map(s => s.split(/: (.*)/s))))); process.exit(get('verdict') === 'PASS' ? 0 : 1) }

console.log('=== 谁先说（喂进去的第一句是「我扮演的角色」）===');
console.log('  我扮演的角色 = ' + get('pk.as'));
console.log('  渲染顺序     = ' + get('rows'));
console.log('  第一条 self 的位置 = ' + get('firstSelf') + ' · 第一条 other 的位置 = ' + get('firstOther'));
const v = get('verdict');
console.log('\n' + (v === 'PASS' ? '✓ PASS：别人先说' : v === 'FAIL' ? '✗ FAIL：还是我扮演的角色先说' : '✗ 读数不全：' + JSON.stringify(rows)));
process.exit(v === 'PASS' ? 0 : 1);
