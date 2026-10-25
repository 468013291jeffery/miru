// 定时器台账：哪些 interval 会一直跑、跑多快、有没有人关它
//
//   node tools/timer-audit.mjs            # 表（● = 确定没人关 · ~ = 可能已统一清理 · 空 = 有明确 clear）
//   node tools/timer-audit.mjs --check    # 闸：确定常驻的必须登记在 tools/timers-baseline.json
//
// 为什么先只出读数、不改行为：关定时器很容易把功能弄坏（倒计时、轮询、BGM 都在用它）。
//
// ⚠️ 这台尺子修过三次，三次都是它自己撒谎：
//   ① 间隔要按**括号配平**取最后一个顶层参数 —— 正则 `,\d+\)` 会把 `reduce(...,0)` 里的 0 当成间隔，
//      于是 5 秒的轮询被标成 0ms 常驻；
//   ② 「有没有人关」要看**句柄**，不能只 grep `clearInterval(`；
//   ③ 数组句柄常被**改名传进别的函数**再统一清理（`T.push(setInterval)` → `timers.forEach(clearInterval)`），
//      静态判断不出来 ⇒ 标成「可能」，把「不知道」和「确实没有」分开。
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'source/src';
const CHECK = process.argv.includes('--check');
const files = fs.readdirSync(SRC).filter(f => f.endsWith('.js'));

/** 找到 text 里从 open 位置开始那个括号对，返回 [endIndex, 顶层逗号位置数组] */
function matchParen(text, open) {
  let depth = 0;
  const commas = [];
  for (let k = open; k < text.length; k++) {
    const ch = text[k];
    if (ch === '(') depth++;
    else if (ch === ')') { depth--; if (depth === 0) return [k, commas] }
    else if (ch === ',' && depth === 1) commas.push(k);
  }
  return [-1, []];
}

function analyze(text) {
  const out = [];
  let i = 0;
  while ((i = text.indexOf('setInterval', i)) >= 0) {
    const open = text.indexOf('(', i);
    if (open < 0) break;
    const [end, commas] = matchParen(text, open);
    if (end < 0) break;
    const delayExpr = commas.length ? text.slice(commas[commas.length - 1] + 1, end).trim() : '';
    const ms = /^\d+$/.test(delayExpr) ? Number(delayExpr) : null;
    const line = text.slice(0, i).split('\n').length;

    const before = text.slice(Math.max(0, i - 90), i);
    let handle = null;
    let m = before.match(/([A-Za-z_$][\w$.]*)\s*=\s*$/);
    if (m) handle = m[1];
    else { m = before.match(/([A-Za-z_$][\w$.]*)\.push\(\s*$/); if (m) handle = m[1] }

    out.push({ line, ms, delayExpr, handle, cleared: false, maybe: false });
    i = end;
  }

  const hasForEachClear = /forEach\(\s*clearInterval/.test(text);
  for (const r of out) {
    if (!r.handle) { r.maybe = hasForEachClear && false; continue }
    const h = r.handle.replace(/[.$]/g, '\\$&');
    const pats = [
      new RegExp('clearInterval\\s*\\(\\s*' + h + '(\\s*[,\\)\\[]|\\s*$)'),
      new RegExp(h + '\\.forEach\\(\\s*clearInterval'),
      new RegExp(h + '\\s*=\\s*\\[\\s*\\]'),
    ];
    r.cleared = pats.some(p => p.test(text));
    if (!r.cleared) r.maybe = hasForEachClear;
  }
  return out;
}

const rows = [];
for (const f of files) {
  const text = fs.readFileSync(path.join(SRC, f), 'utf8');
  const lines = text.split('\n');
  for (const r of analyze(text)) {
    rows.push({ file: f, ...r, code: (lines[r.line - 1] || '').trim().slice(0, 88) });
  }
}

rows.sort((a, b) => (a.ms == null ? 99999 : a.ms) - (b.ms == null ? 99999 : b.ms));
const isHot = r => r.ms != null && r.ms <= 3000 && !r.cleared && !r.maybe;
const isMaybe = r => r.ms != null && r.ms <= 3000 && !r.cleared && r.maybe;
const hot = rows.filter(isHot);
const maybe = rows.filter(isMaybe);

console.log(`共 ${rows.length} 个 setInterval · 确定常驻（没人关 且 ≤3s）${hot.length} 个 · 可能已统一清理 ${maybe.length} 个\n`);
console.log('  ' + '间隔'.padEnd(9) + '文件:行'.padEnd(30) + '句柄'.padEnd(14) + '关?'.padEnd(5) + '代码');
for (const r of rows) {
  const mark = isHot(r) ? '●' : (isMaybe(r) ? '~' : ' ');
  const msTxt = r.ms == null ? (r.delayExpr || '?') : r.ms + 'ms';
  console.log(mark + ' ' + msTxt.padEnd(9) + (r.file + ':' + r.line).padEnd(30) +
    String(r.handle || '—').padEnd(14) + (r.cleared ? 'yes' : (r.maybe ? 'maybe' : 'no')).padEnd(5) + r.code);
}

if (CHECK) {
  let base = {};
  try { base = JSON.parse(fs.readFileSync('tools/timers-baseline.json', 'utf8')); } catch (_) {}
  for (const k of Object.keys(base)) if (k.startsWith('_')) delete base[k];   // _why / _howto 是给人看的，不是条目
  const sig = r => r.file + ' ' + r.ms + 'ms';
  const hotSigs = [...new Set(hot.map(sig))].sort();
  const baseSigs = Object.keys(base).sort();
  const fresh = hotSigs.filter(s => !baseSigs.includes(s));
  const stale = baseSigs.filter(s => !hotSigs.includes(s));
  console.log('');
  if (fresh.length) console.log('✗ 新出现的常驻定时器（没登记）：' + fresh.join(' | '));
  if (stale.length) console.log('✗ 基线里这些已经不存在（收敛后请删掉）：' + stale.join(' | '));
  if (!fresh.length && !stale.length) {
    console.log('确定的常驻定时器全部在册（' + hotSigs.length + ' 个）：');
    for (const s of hotSigs) console.log('  · ' + s + ' — ' + base[s]);
  }
  if (fresh.length || stale.length) process.exit(1);
  console.log('\ntimers OK');
}
