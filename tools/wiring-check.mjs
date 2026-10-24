// 接线检查：机制的函数**有没有人调用**（不是"函数在不在"）
//
//   node tools/wiring-check.mjs            # 只看结论
//   node tools/wiring-check.mjs --list     # 每个函数列出调用点
//
// 为什么需要它：`regression-25` 的 PASS 判据是"机制存在且行为对"，而**存在 ≠ 接上了**。
// 2026-10-25 实测：`planDecide` / `planGet` / `planSet` / `planTried` 四个函数定义齐全、
// 单测也过，但**全仓没有任何一处调用** —— 整条计划层是死代码，而映射表上那几条是 PASS。
// 这条闸把「定义在、没人用」变成一次红灯。
import fs from 'node:fs';
import path from 'node:path';

const SRC = ['source/src', 'api'];
const files = [];
for (const d of SRC) {
  for (const f of fs.readdirSync(d)) if (/\.js$/.test(f)) files.push(path.join(d, f));
}
const src = new Map(files.map(f => [f, fs.readFileSync(f, 'utf8')]));

// 要检查的机制函数（来自回归映射表与今晚新增的那几层）
const WATCH = [
  'loveWrite', 'toolGate', 'toolUse', 'loveAllowed',
  'emotionNorm', 'heatGated', 'ageAllowed', 'ageGateAsk',
  'cardAt', 'cardCommitChapter', 'cardChanges', 'cardMemo',
  'planDecide', 'planGet', 'planSet', 'planTried',
  'guardReply', 'marksForbidden', 'canonFacts',
  'castCardPublic', 'castCardFace', 'pkSetPresent',
];

const listMode = process.argv.includes('--list');
let dead = [], wired = [];

for (const name of WATCH) {
  const defRe = new RegExp('function\\s+' + name + '\\s*\\(');
  const callRe = new RegExp('(?<![\\w.$])' + name + '\\s*\\(');
  let definedIn = null;
  const calls = [];
  for (const [f, text] of src) {
    if (defRe.test(text)) definedIn = definedIn || f;
    const lines = text.split('\n');
    lines.forEach((ln, i) => {
      if (!callRe.test(ln)) return;
      if (defRe.test(ln)) return;                        // 定义行不算调用
      if (/^\s*\/\//.test(ln) || /^\s*\*/.test(ln)) return;  // 注释里提到不算
      calls.push({ file: f, line: i + 1, text: ln.trim() });
    });
  }
  // 同文件内部调用也算接线（app3_chat 里 castCard 调 castCardFace 就是这种）。
  // 只有"定义行以外一处都没有"才算死代码。
  if (!definedIn) { dead.push({ name, why: '没有定义', calls: [] }); continue; }
  if (!calls.length) dead.push({ name, why: '定义了但没人调用', calls });
  else wired.push({ name, definedIn, calls });
}

console.log(`检查 ${WATCH.length} 个机制函数：接线 ${wired.length} · 未接线 ${dead.length}\n`);
for (const w of wired) {
  console.log(`  ✓ ${w.name.padEnd(18)} ← ${w.calls.length} 处调用（定义在 ${path.basename(w.definedIn)}）`);
  if (listMode) for (const c of w.calls.slice(0, 3)) console.log(`      ${path.basename(c.file)}:${c.line}  ${c.text.slice(0, 80)}`);
}
for (const d of dead) {
  console.log(`  ✗ ${d.name.padEnd(18)} ${d.why}`);
}

// 基线：已知未接线的，每条都带理由；接上了就必须从基线里删掉（否则基线会腐烂）
let base = {};
try { base = JSON.parse(fs.readFileSync('tools/wiring-baseline.json', 'utf8')); } catch (_) {}
delete base._why;
const deadNames = dead.map(d => d.name).sort();
const baseNames = Object.keys(base).sort();
const fresh = deadNames.filter(n => !baseNames.includes(n));      // 新出现的死代码
const stale = baseNames.filter(n => !deadNames.includes(n));      // 基线里已接线 ⇒ 该删

if (fresh.length) console.log('\n✗ 新出现的未接线：' + fresh.map(n => `${n}`).join(', '));
if (stale.length) console.log('\n✗ 基线已过期（这些现在接线了，请从 wiring-baseline.json 删掉）：' + stale.join(', '));
if (deadNames.length && baseNames.length && !fresh.length && !stale.length) {
  console.log('\n已知未接线（基线内，带理由）：');
  for (const n of deadNames) console.log('  · ' + n + ' — ' + base[n]);
}
if (fresh.length || stale.length) process.exit(1);
console.log('\nwiring OK（没有基线之外的空接线）');
