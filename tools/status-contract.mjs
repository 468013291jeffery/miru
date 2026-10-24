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
const BASELINE = 0;           // 2026-10-25：29 → 25 → 11 → 0。任何一处新的直写都会红。
const WRITE_RE = /th\.love\[[^\]]+\]\s*(?:=(?!=)|\+=|-=)/g;

/** 第二套投影：dims（五维）——它自己的写入口是 dimAdd，不归 loveWrite 管 */
const DIM_RE = /th\.rdv\[[^\]]+\]\s*(?:=(?!=)|\+=|-=)/g;
const DIM_MODULE = 'app21_dims.js';

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

export function scanDims(files) {
  const perFile = {};
  let total = 0;
  for (const [name, text] of Object.entries(files)) {
    if (name === DIM_MODULE) continue;          // dimState 在那里初始化，dimAdd 在那里改值
    const n = (text.match(DIM_RE) || []).length;
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

// ---- 第二套投影：dims（五维）。它本来就有单一入口 dimAdd，这条臂是把它钉住 ----
const dims = scanDims(files);
console.log(`dims 直写 ${dims.total} 处（模块外应为 0）· dimAdd 存在=${/function dimAdd\(/.test(files[DIM_MODULE] || '')}`);
ok('dims 的写入口存在（dimAdd）', /function dimAdd\(/.test(files[DIM_MODULE] || ''));
ok('dims 没有模块外的直写', dims.total === 0, `${dims.total} 处：${Object.keys(dims.perFile).join(',')}`);
ok('至少 4 处已经走写入口', calls >= 5, `${calls} < 5`);
ok('模型那条提议走写入口', /loveWrite\(th,id,d,"model:proposal"\)/.test(files['app3_chat.js'] || ''));
ok('模型那条提议带在场验证', /loveAllowed\(th,id\)/.test(files['app3_chat.js'] || ''));

// ---- 前置验证（loveAllowed）：从产物里切出真函数跑一遍 ----
// 为什么必须跑真函数：这条规则的价值全在「不在名单里就拦下来」，
// 而它只是一行 indexOf —— 说它对没有意义，得看它对。
let bundle = '';
try { bundle = fs.readFileSync('index.html', 'utf8'); } catch (_) {}
const li = bundle.indexOf('function loveAllowed(');
if (li >= 0) {
  let depth = 0, j = bundle.indexOf('{', li);
  const start2 = j;
  for (; j < bundle.length; j++) {
    if (bundle[j] === '{') depth++;
    else if (bundle[j] === '}') { depth--; if (!depth) break; }
  }
  const fn = new Function(bundle.slice(li, j + 1) + '; return loveAllowed;')();
  ok('没有在场名单 ⇒ 放行（旧行为不变）', fn({ love: {} }, 'ethan') === true);
  ok('在场名单里没有他 ⇒ 拦下', fn({ present: ['luca'] }, 'ethan') === false);
  ok('在场名单里有他 ⇒ 放行', fn({ present: ['ethan', 'luca'] }, 'ethan') === true);
  ok('空名单等同没有名单', fn({ present: [] }, 'ethan') === true);
  ok('拿不到 th 时不崩', fn(null, 'ethan') === false);
} else {
  ok('产物理应有 loveAllowed', false, '在 index.html 里找不到');
}

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
