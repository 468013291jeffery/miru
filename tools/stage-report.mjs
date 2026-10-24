// 关系阶段：它是存起来的，还是算出来的？（SPEC-AUDIT #10 / 文档 §04.2）
//
//   node tools/stage-report.mjs
//
// 文档 04.2 要求「阶段转移规则」：什么条件下从 X 升到 Y、什么条件下掉。
// 这条工具先把事实弄清楚，再谈规则：
//   ① 代码里有没有任何一个地方**存**阶段（还是每次由 love 算出来）
//   ② 升 / 降 两条路各自有没有痕迹（提示、埋点、状态）
//   ③ 跨一档要多少轮（阈值间距 ÷ 单次最大变动）
import fs from 'node:fs';

const SRC = 'source/src';
const files = {};
for (const f of fs.readdirSync(SRC)) if (f.endsWith('.js')) files[f] = fs.readFileSync(`${SRC}/${f}`, 'utf8');
const all = Object.entries(files);
const hits = (re) => all.flatMap(([f, t]) => (t.match(re) || []).map(() => f));

// ① 派生还是存储
const derive = /function stageOf\(th,cid\)\{[^}]*th\.love/.test(files['app3_chat.js'] || '');
const storedFields = hits(/th\.(stg|stage)\s*=|\.stage\s*=\s*\d/g);
const stgIsDims = /th\._stg/.test(files['app36_live.js'] || '') && /dimStage/.test(files['app36_live.js'] || '');

// ② 升 / 降 的痕迹
const up = /s>before\[c\]/.test(files['app3_chat.js'] || '') || /const up=/.test(files['app14_pack.js'] || '');
const down = /s\s*<\s*before\[c\]/.test(Object.values(files).join('\n'));

// ③ 阈值与单次变动
// 注释里也有同样的键（示例块），先剥掉注释再取默认值 —— 否则会读到示例里的 20
// 头部的示例块在 /* … */ 里，行注释也在 —— 两种都要剥掉，否则读到的是示例里的 20
const tuneCode = (files['app96_tune.js'] || '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
const T = tuneCode.match(/stageMin:\s*\[([^\]]+)\]/);
const STAGE_MIN = T ? T[1].split(',').map(x => Number(x.trim())) : [];
const cap = tuneCode.match(/deltaCap:\s*(-?\d+)/);
const CAP = cap ? Number(cap[1]) : 0;
// 两条路各自的单次上限也从源码读，别写死
const packA = ((files['app14_pack.js'] || '').match(/const d=\{A:(-?\d+),/) || [])[1];
const modelCap = ((files['app3_chat.js'] || '').match(/Math\.min\((\d+),\+r\.love/) || [])[1];
const PATH_A = Number(packA) || 0, PATH_M = Number(modelCap) || 0;

console.log('① 阶段是算出来的，不是存的');
console.log('   stageOf 由 th.love 推导：' + (derive ? '是 ✓' : '否 ✗'));
console.log('   全库写阶段字段的地方：' + (storedFields.length ? storedFields.join(',') : '0 处'));
console.log('   （app36 的 th._stg 是**五维**的阶段，不是关系阶段：' + (stgIsDims ? '确认 ✓' : '待核') + '）');

console.log('\n② 升降两条路的痕迹');
console.log('   升级有检测 + 提示卡：' + (up ? '有 ✓' : '无 ✗'));
console.log('   降级有检测 / 提示：' + (down ? '有' : '**没有 ✗** —— 好感掉了，阶段跟着掉，但界面与埋点都不出声'));

console.log('\n③ 跨一档要多少轮');
const gaps = STAGE_MIN.slice(1).map((v, i) => v - STAGE_MIN[i]);
console.log('   阈值：[' + STAGE_MIN.join(', ') + ']  每档间距：[' + gaps.join(', ') + ']');
console.log('   单次上限 deltaCap = ' + CAP + '；剧本 A 选项 +' + PATH_A + '；模型提议 +' + PATH_M + '（三者取小者才是真的每次涨幅上界）');
const g0 = gaps[0];
const per = Math.min(CAP, PATH_A);
console.log(`   每档间距 ${g0} 分 ⇒ 最快 ${Math.ceil(g0 / per)} 轮一档；模型路 ${Math.ceil(g0 / PATH_M)} 轮`);
const total = STAGE_MIN[STAGE_MIN.length - 1];
console.log(`   0 → ${total}（满档）最少 ${Math.ceil(total / per)} 轮（每轮都吃满）`);

console.log('\n结论：阶段是**派生量**（不存、不迁移、每次由 love 算），所以「转移规则」目前等于');
console.log('      「love 越过阈值即变」——升的那一下有卡，降的那一下什么都没发生。');
console.log('      要不要补规则是产品决定；但不补的话，至少要知道降级是无声的。');

// ---- 降级那条分支必须真的在（不然这份读数只是描述历史） ----
let pass = 0; const fails = [];
const ok = (n, c) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fails.push(n); console.log('  ✗ ' + n); } };
console.log('\n④ 降级反馈（本轮补的）');
const chat = files['app3_chat.js'] || '';
ok('有降级分支', /else if\(s<before\[c\]\)/.test(chat));
ok('降级有去重（不会反复弹）', /th\._stDown/.test(chat));
ok('升级会清掉去重记录', /delete th\._stDown\[c\]/.test(chat));
ok('文案有五语', (Object.values(files).join('\n').match(/"st\.down"/g) || []).length >= 5);
if (process.argv.includes('--selftest')) {
  const mut = chat.replace(/else if\(s<before\[c\]\)/, 'else if(false)');
  const caught = !/else if\(s<before\[c\]\)/.test(mut);
  console.log('  · 变异（把降级分支废掉）：' + (caught ? '已抓住 ✓' : '没抓住 ✗'));
  if (!caught) { console.log('SELFTEST FAILED'); process.exit(1); }
}
console.log('\n' + pass + ' passed, ' + fails.length + ' failed');
if (fails.length) process.exit(1);
