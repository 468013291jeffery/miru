// 结构账自检：`STRUCTURE-ACCOUNT.md` 里每一行「我们有 / 我们没有」到底成不成立
//
//   node tools/account-check.mjs            # 两列对照
//   node tools/account-check.mjs --verbose  # 带上命中的那一行原文
//
// 它防的是「表自己变成新的夸夸」：文档说"有"，代码里必须真的找得到；
// 文档说"没有"，代码里必须真的找不到；而文档那一行的『我们』格也必须还写着同样的说法
// —— 三者任一不符就红。
//
// ⚠️ 这条闸只回答「机制在不在源码里」，**不回答**「线上跑得对不对」。
import fs from 'node:fs';
import path from 'node:path';

const DOC = 'STRUCTURE-ACCOUNT.md';
const CLAIMS = 'tools/account-claims.json';
const verbose = process.argv.includes('--verbose');

const doc = fs.readFileSync(DOC, 'utf8');
const { claims } = JSON.parse(fs.readFileSync(CLAIMS, 'utf8'));

/** 从文档里找出某一行，返回它的格子数组（去掉首尾的 |）。 */
function findRow(text) {
  const lines = doc.split(/\r?\n/);
  for (const ln of lines) {
    if (!/^\s*\|/.test(ln)) continue;
    const cells = ln.split('|').slice(1, -1).map(s => s.trim());
    if (cells.length >= 3 && cells[0].includes(text)) return cells;
  }
  return null;
}

/** 源码里有没有（支持 a|b 这种或写法）。 */
function sourceHas(file, pattern) {
  const targets = [];
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    for (const f of fs.readdirSync(file)) targets.push(path.join(file, f));
  } else if (fs.existsSync(file)) {
    targets.push(file);
  } else {
    return { ok: false, why: '文件不存在: ' + file, hit: '' };
  }
  const re = new RegExp(pattern);
  for (const t of targets) {
    if (!/\.js$|\.mjs$/.test(t)) continue;
    const lines = fs.readFileSync(t, 'utf8').split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      if (re.test(lines[i])) return { ok: true, why: path.relative(process.cwd(), t) + ':' + (i + 1), hit: lines[i].trim().slice(0, 90) };
    }
  }
  return { ok: false, why: '源码里找不到 /' + pattern + '/', hit: '' };
}

/** 某个函数有没有调用点（同文件也算）。 */
function isWired(name) {
  const roots = ['source/src', 'api'];
  const files = [];
  for (const d of roots) for (const f of fs.readdirSync(d)) if (f.endsWith('.js')) files.push(path.join(d, f));
  const defRe = new RegExp('function\\s+' + name + '\\s*\\(');
  const callRe = new RegExp('(?<![\\w.$])' + name + '\\s*\\(');
  for (const f of files) {
    const lines = fs.readFileSync(f, 'utf8').split(/\r?\n/);
    for (const ln of lines) {
      if (!callRe.test(ln)) continue;
      if (defRe.test(ln)) continue;
      if (/^\s*(\/\/|\*)/.test(ln)) continue;
      return true;
    }
  }
  return false;
}

let pass = 0; const fails = [];
console.log('结构账复核（' + claims.length + ' 行）\n');
console.log('  ' + '条目'.padEnd(26) + '文档说'.padEnd(14) + '实际'.padEnd(10) + '依据');
for (const c of claims) {
  const row = findRow(c.row);
  const docSays = row ? row[2] : '(文档里没有这一行)';
  // 两边都做同样的归一：去星号 → 去括号补充 → 去空白；然后比前缀。
  const norm = (s) => String(s).replace(/\*\*/g, '').replace(/（[^）]*）/g, '').replace(/\([^)]*\)/g, '').replace(/\s+/g, '');
  const a = norm(docSays), b = norm(c.our);
  const docOk = !!row && a.startsWith(b.slice(0, Math.max(2, b.length)));
  const absent = c.check === 'absent';
  const has = sourceHas(c.file, c.pattern);
  const codeOk = absent ? !has.ok : has.ok;
  const wiredOk = c.wired ? isWired(c.wired) : true;

  const ok = docOk && codeOk && wiredOk;
  const actual = (absent ? (has.ok ? '居然有' : '确实没有') : (has.ok ? '有' : '没有')) + (c.wired ? (wiredOk ? '·已接线' : '·未接线') : '');
  const why = absent ? (has.ok ? '不该有却命中 ' + has.why : '扫过 ' + c.file) : (has.ok ? has.why : has.why);

  console.log('  ' + (ok ? '✓' : '✗') + ' ' + c.row.slice(0, 24).padEnd(24) + docSays.slice(0, 12).padEnd(14) + actual.padEnd(10) + why);
  if (verbose && has.ok) console.log('      ' + has.hit);
  if (!ok) fails.push({ row: c.row, docOk, codeOk, wiredOk, docSays, why });
  else pass++;
}

console.log(`\n${pass} 一致 · ${fails.length} 不一致`);
if (fails.length) {
  for (const f of fails) {
    console.log('  ✗ ' + f.row + '：' + (f.docOk ? '' : `文档那格写着「${f.docSays}」与声明不符；`) + (f.codeOk ? '' : '代码与声明不符；') + (f.wiredOk ? '' : '函数没接线；'));
  }
  console.log('\nFAILED');
  process.exit(1);
}
console.log('account OK（文档说的和代码里有的对得上）');
