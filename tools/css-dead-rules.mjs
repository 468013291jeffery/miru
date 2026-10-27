// 死样式普查：哪些 CSS 规则在真页面上一个元素都匹配不到（2026-10-27）
//
//   和「死层」同一个形状：结构对拍永远绿，而那段代码一次都没执行过。
//   判据分三档（探针页里做两次查询，见 tools/css-dead-rules.html 的注释）：
//     活      raw > 0
//     状态型  raw = 0 但剥掉伪类/伪元素后 > 0（:hover / :disabled / ::after …）
//     死候选  两次都 0
//
//   ⚠️ **死候选 ≠ 可以删**。有些类只在某个弹层 / 某章剧情里才出现，页面此刻没有元素是正常的。
//   删之前必须为每一条说出「它在哪一屏才有元素」；说不出来的标「暂不判」，不删。
//
//   用法：
//     node tools/css-dead-rules.mjs            汇总 + 死候选清单（按声明体积降序）
//     node tools/css-dead-rules.mjs --json     原样读数
//     node tools/css-dead-rules.mjs --grep .x  只报选择器里含 .x 的
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const PORT = process.env.MIRU_PORT || 8131;
const PAGE = 'http://127.0.0.1:' + PORT + '/tools/css-dead-rules.html';
const EDGE = process.env.MIRU_EDGE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');

const r = spawnSync(EDGE, ['--headless=new', '--disable-gpu', '--no-sandbox',
  '--virtual-time-budget=25000', '--dump-dom', PAGE], { encoding: 'utf8', maxBuffer: 128 * 1024 * 1024 });
const dom = r.stdout || '';
const b = /<pre id="out"[^>]*>([\s\S]*?)<\/pre>/.exec(dom);
if (!b) { console.log('✗ 拿不到读数（本地服务要跑在 ' + PORT + '，见 tools/serve.mjs）'); process.exit(2) }
let data;
try {
  const txt = String(b[1]).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
  data = JSON.parse(txt.replace(/^CSS_DEAD_JSON:/, ''));
} catch (e) { console.log('✗ 读数解析失败：' + e.message); process.exit(2) }

if (process.argv.includes('--json')) { console.log(JSON.stringify(data, null, 1)); process.exit(0) }

const gi = process.argv.indexOf('--grep');
const filt = gi > 0 ? process.argv[gi + 1] : null;
let dead = data.deadList || [];
if (filt) dead = dead.filter(x => x.sel.includes(filt));

/* 逐条给出「它可能在哪一屏」的线索：从源码里找这个类名是不是被 JS 动态创建的。
   ⚠️ 一定要**排除 `creator_embed.js`** —— 它是另一个页面（Creator）的整段 HTML/JS 字符串，
   本页面永远不会创建那些类；把它算进来会让一堆真死规则看起来"有人用"。 */
const srcDir = path.join(ROOT, 'source', 'src');
const srcFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.js') && !f.includes('.bak-') && f !== 'creator_embed.js');
const corpus = srcFiles.map(f => ({ f, t: fs.readFileSync(path.join(srcDir, f), 'utf8') }));
function owners(sel) {
  /* ⚠️ 不能只看 class：`#chTxt` / `#cbImg` 这类是 **id 选择器**，按 `.cls` 取会得到空数组，
    于是「源码里没人用」这个结论会把所有 id 规则判成真死（第一版就这么错判了一批）。 */
  const ids = (sel.match(/#[\w-]+/g) || []).map(x => x.slice(1));
  const cls = (sel.match(/\.[\w-]+/g) || []).map(x => x.slice(1));
  const keys = ids.concat(cls);
  if (!keys.length) return { key: '', used: [] };
  const key = keys[0];
  /* 任一 token 在 JS 里出现过就算"有人用"——一个规则可能靠 id 抓元素、也可能靠 class */
  const used = corpus.filter(x => keys.some(k => x.t.indexOf(k) >= 0));
  return { key, used };
}

/* 分三档：**这一刻页面上没有元素**是正常的（多屏应用，此刻只显示首页）；
   **类名在整个 JS 里从未出现过**才是真死 —— 没有任何代码能把它造出来。 */
function classify(x) {
  const ids = (x.sel.match(/#[\w-]+/g) || []).map(s => s.slice(1));
  const cls = (x.sel.match(/\.[\w-]+/g) || []).map(s => s.slice(1));
  const keys = ids.concat(cls);
  if (!keys.length) return 'notoken';                       // `:focus-visible` / `*` 这类，没法按类名归因
  const used = corpus.some(f => keys.some(k => f.t.indexOf(k) >= 0));
  if (used) return 'inscreen';                              // 源码里有人用，只是此刻不在屏上
  /* 拼接型：`'ds-' + mood` 这种，完整类名在源码里搜不到，但前缀会出现。
     判据宁可宽一点（宁可留着），因为漏判的代价是"删了活代码"。 */
  const concat = cls.some(c => {
    const i = c.lastIndexOf('-');
    if (i <= 0) return false;
    const pre = c.slice(0, i + 1);
    return corpus.some(f => f.t.indexOf("'" + pre + "'") >= 0 || f.t.indexOf('"' + pre + '"') >= 0 ||
      f.t.indexOf("'" + pre + '"') >= 0 || f.t.indexOf('`' + pre) >= 0);
  });
  return concat ? 'concat' : 'dead';
}
const buckets = { dead: [], concat: [], notoken: [], inscreen: [] };
for (const x of dead) buckets[classify(x)].push(x);
const truly = buckets.dead, concat = buckets.concat, notoken = buckets.notoken, justNotNow = buckets.inscreen;

console.log('样式规则普查（真页面 · **这一刻只显示首页**）');
console.log('  ' + data.sheets + ' 张 sheet · ' + data.rules + ' 条规则 → ' +
  data.live + ' 活 · ' + data.state + ' 状态型 · ' + data.dead + ' 此刻没元素');
console.log('  其中 52 类分成四档（判据从紧到松）：');
console.log('    ' + truly.length + ' 条 **真死候选**（类名/id 在 JS 里从未出现过，也没有拼接前缀）');
console.log('    ' + concat.length + ' 条 可能拼接出来（前缀 `xx-` 在 JS 里出现过，完整名搜不到 ⇒ **先留着**）');
console.log('    ' + notoken.length + ' 条 没法按类名归因（`:focus-visible` / `*` / 纯标签选择器）');
console.log('    ' + justNotNow.length + ' 条 源码里有人用，只是此刻不在屏上（正常）');
console.log('');
if (!dead.length) { console.log('  没有死候选（或 --grep 过滤后为空）'); process.exit(0) }

const show = (list, title) => {
  if (!list.length) return;
  console.log(title + '（按声明体积降序）：');
  for (const x of list.slice(0, 30)) console.log('  [' + x.len + ' 字符] sheet ' + x.sheet + '  ' + x.sel.slice(0, 76));
  if (list.length > 30) console.log('  … 还有 ' + (list.length - 30) + ' 条');
  console.log('');
};
show(truly, '真死候选 ' + truly.length + ' 条');
show(concat, '可能拼接 ' + concat.length + ' 条');
show(notoken, '无法按类名归因 ' + notoken.length + ' 条');

const bytes = truly.reduce((s, x) => s + (x.len || 0), 0);
console.log('  真死候选合计 ' + bytes + ' 字符 —— 仍然**不是"删掉就好"**：');
console.log('  ① 有些类名是**服务端返回的 HTML** 里带的（`/api/works` 之类），源码里造不出来；');
console.log('  ② 逐条确认之后才能删，删前后各跑一次 tools/style-computed-snapshot.mjs --check；');
console.log('  ③ 删之前先跑一次变异（把一条活规则的选择器改成不存在的类），确认这把尺会把它判死。');
process.exit(0);
