// 空 catch 闸（源自 Mythica 编码习惯第 7 条「裸 except 禁止」的 JS 版）
//
//   为什么这条对我们最致命：今晚三次「静默失败」全是空 catch 造成的 ——
//     ① [object Object]：取值失败不吭声
//     ② 剧本队列：空 beat 被静默跳过
//     ③ UI 调度器：`U` 不在作用域 ⇒ 每次调用都抛 ⇒ 被 catch 吞掉 ⇒ 钩子一次没跑（界面无异常）
//
//   判据（可数）：`catch` 后接**空块**（只有空白/注释）的数量。
//   · 存量不要求立刻清零（900+ 处，清不动），但**不许增加**：新增必须跑 --write 显式确认。
//   · 汇报时给出「最集中的文件」，那是下一次清理的入口。
//
//   用法：node tools/empty-catch-check.mjs          人读
//        node tools/empty-catch-check.mjs --write  写基线
//        node tools/empty-catch-check.mjs --check  只比新增（check-all 用）
import fs from 'node:fs';

const SRC = 'source/src';
const BASE = 'tools/empty-catch-baseline.json';

// catch 之后：可选参数 + 块内容只含空白与注释
const RE = /catch\s*(?:\([^)]*\))?\s*\{((?:\s|\/\/[^\n]*|\/\*[\s\S]*?\*\/)*)\}/g;

/* 生成的 soft 调用里带一个**兜底垫片**：function(n,f){try{return f()}catch(e){}}
   它那个空 catch 是设计的一部分（沙箱里没有 soft 时就地吞掉），不该算进债务。 */
const SHIM = 'function(n,f){try{return f()}catch(e){}}';

const per = {};
let total = 0;
for (const f of fs.readdirSync(SRC).filter(x => x.endsWith('.js'))) {
  const t = fs.readFileSync(SRC + '/' + f, 'utf8').split(SHIM).join('');
  const n = (t.match(RE) || []).length;
  if (n) { per[f] = n; total += n }
}

const rows = Object.entries(per).sort((a, b) => b[1] - a[1]);

if (process.argv.includes('--write')) {
  fs.writeFileSync(BASE, JSON.stringify({ total, per }, null, 2) + '\n', 'utf8');
  console.log('基线已写：空 catch ' + total + ' 处 / ' + rows.length + ' 个文件 → ' + BASE);
  process.exit(0);
}

if (process.argv.includes('--check')) {
  if (!fs.existsSync(BASE)) { console.log('没有基线（先跑 --write）'); process.exit(1) }
  const b = JSON.parse(fs.readFileSync(BASE, 'utf8'));
  const added = [];
  for (const [f, n] of Object.entries(per)) {
    const was = b.per[f] || 0;
    if (n > was) added.push(f + ' ' + was + '→' + n);
  }
  if (added.length) {
    console.log('✗ 新增空 catch（它会把硬错误变成无操作）: ' + added.slice(0, 6).join(' · '));
    console.log('要么在里面记一条日志，要么跑 --write 显式确认。');
    process.exit(1);
  }
  console.log('空 catch 无新增（存量 ' + total + ' 处，债务不是零但要开始下降）');
  process.exit(0);
}

console.log('=== 空 catch 存量 ===\n');
console.log('合计 ' + total + ' 处 / ' + rows.length + ' 个文件\n');
console.log('最集中的 10 个（清理入口）：');
for (const [f, n] of rows.slice(0, 10)) console.log('   ' + f.padEnd(24) + n);
console.log('\n判据：只增不减就是坏味道；新增必须显式确认（--write）。');
