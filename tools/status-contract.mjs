// 状态写入契约：`th.love[...] =` 的直接写入只许降、不许升。
//   node tools/status-contract.mjs            # 检查
//   node tools/status-contract.mjs --selftest # 证明这条闸会红（变异一次）
//
// 规格 v7.11 §04.6 要求"唯一写入点"。现状是几十处，一次改完风险太大，
// 所以这里用一个**棘轮**：基线写死，超过就红；每收敛一批，把基线调小。
// loveWrite() 自己那个文件（app95_status.js）不算——它就是那个唯一入口。
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'source/src';
const MODULE = 'app95_status.js';
const BASELINE = 25;          // 2026-10-25 实测：29 处 → 收敛 4 处后 25 处
const WRITE_RE = /th\.love\[[^\]]+\]\s*(?:=(?!=)|\+=|-=)/g;

export function scan(files) {
  const perFile = {};
  let total = 0;
  for (const [name, text] of Object.entries(files)) {
    if (name === MODULE) continue;
    const n = (text.match(WRITE_RE) || []).length;
    if (n) { perFile[name] = n; total += n; }
  }
  return { total, perFile };
}

function load() {
  const out = {};
  for (const f of fs.readdirSync(SRC)) if (f.endsWith('.js')) out[f] = fs.readFileSync(path.join(SRC, f), 'utf8');
  return out;
}

const files = load();
const { total, perFile } = scan(files);
const mod = files[MODULE] || '';
const calls = (Object.values(files).join('\n').match(/loveWrite\(/g) || []).length;

let pass = 0; const fails = [];
const ok = (name, cond, detail) => {
  if (cond) { pass++; console.log('  ✓', name); }
  else { fails.push(name); console.log('  ✗', name, detail === undefined ? '' : '→ ' + detail); }
};

console.log(`直接写入 ${total} 处（基线 ${BASELINE}）· loveWrite 调用 ${calls} 次`);
for (const [f, n] of Object.entries(perFile).sort((a, b) => b[1] - a[1])) console.log(`    ${f.padEnd(22)} ${n}`);

ok('写入口存在', /function loveWrite\(/.test(mod));
ok('写入口做夹值', /LOVE_MIN/.test(mod) && /LOVE_MAX/.test(mod) && /LOVE_DELTA_CAP/.test(mod));
ok('写入口留痕', /loveLog\(th,/.test(mod));
ok('直接写入不超过基线（棘轮只降不升）', total <= BASELINE, `${total} > ${BASELINE}`);
ok('至少 4 处已经走写入口', calls >= 5, `${calls} < 5`);
ok('模型那条提议已经走写入口', /loveWrite\(th,id,Math\.max\(0,Math\.min\(6,/.test(files['app3_chat.js'] || ''));

if (process.argv.includes('--selftest')) {
  const mutated = Object.assign({}, files, { 'app3_chat.js': (files['app3_chat.js'] || '') + '\nth.love["x"] = 99;\n' });
  const m = scan(mutated);
  const caught = m.total > BASELINE;
  console.log(`  · 变异（多写一处）：${caught ? '已抓住 ✓' : '没抓住 ✗'}`);
  if (!caught) { console.log('SELFTEST FAILED'); process.exit(1); }
}

console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) { console.log('FAILED: ' + fails.join(' | ')); process.exit(1); }
console.log('status contract OK');
