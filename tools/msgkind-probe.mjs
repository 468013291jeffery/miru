// msgHTML 各层「活着吗」探针（2026-10-27）
//
//   为什么需要它：`render-snapshot.mjs` 证的是「19 种消息的 HTML 逐字节没变」，
//   它证不了「某一层还在干活」。反例就在这个仓库里：
//     · app16 的 fmtMix 找 `<div class="bub">`、app18 的贴纸分支同理，
//       而气泡早就换成 `.m-box` 了 —— 对拍一直绿，这两个功能一直是死的。
//   所以这里不问「结构变没变」，只问每一层：**你改过东西吗**。
//
//   判据（三条，缺一条这个闸就是摆设）：
//     1 每条 `fires` 探针 → 那一层的 hit 必须真的涨（光"没报错"不算）
//     2 每条 `silent` 探针 → 那一层必须确实没动（已知死掉的层要显式登记在这里，写清原因）
//     3 对照探针 → 一个后处理层都不许动它（防止"所有层都在改"这种隐形状）
//   外加：注册表里每一层都必须至少被一条探针点名 —— 声明了却从不验证 = 没有这个层。
//
//   用法：node tools/msgkind-probe.mjs        （check-all 里跑）
//         node tools/msgkind-probe.mjs --json 原样吐出读数
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const PORT = process.env.MIRU_PORT || 8131;
const URL = 'http://127.0.0.1:' + PORT + '/tools/render-snapshot.html';
const EDGE = process.env.MIRU_EDGE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

/* 期望表。fires = 这一层必须真的改动 HTML；silent = 这一层此刻确实动不了东西（必须写原因）。
   `contains`：一个字符串或数组；`!xxx` = **必须不出现**（唯一一个「靠删除干活」的层要它）。
   第 6 格 opts：目前只有 `allow`（对照探针允许被哪些层动 —— 那条层是设计上每行都动的）。
   ⚠️ 这张表是**判据**，不是现状抄写：改代码后它变绿/变红都要回来改这里。 */
const EXPECT = [
  ['对照：普通一句台词', '*', 'silent', '', '普通一句台词没触发任何条件层',
    { allow: ['app16_story2.js#mquick'] }],
  ['去快捷按钮 · 普通台词', 'app16_story2.js#mquick', 'fires', '!mquick',
    'post 类：删掉每行右侧的 🔊/🖼/📤 一排 —— app3_chat 一直在发，这一层一直在删，所以对照探针允许它动'],
  ['行内 *动作* 高亮', 'app16_story2.js', 'fires', '<em class="ma">', 'post 类：把 *…* /（…）换成 <em class="ma">（2026-10-27 修好：原来找 .bub，气泡早换成 .m-box）'],
  ['（舞台指令）改入参', 'app34_hints.js', 'fires', '', 'wrap 类：把（…）换成 *…*'],
  ['付款行 · 没说出口的话', 'app35_pay.js', 'fires', 'payrow', 'post 类：挂付款行'],
  ['电话卡 · 接听按钮', 'app98_story.js', 'fires', 'data-call98', 'post 类：加接听按钮'],
  ['编辑过 · 小标签', 'app73_features.js', 'fires', 'ed73tag', 'post 类：追加「已编辑」标签'],
  ['贴纸 / 纯表情放大', 'app18_promo.js', 'silent', '', '同样找 `<div class="bub">` —— 已知死，且 .stk/.bigemo 根本没有 CSS'],
  ['未接来电', 'app20_fx_booth.js', 'fires', '', 'kind 类：认领 missed'],
  ['撤回', 'app37_hooks.js', 'fires', '', 'kind 类：认领 xrecall'],
  ['拒绝', 'app42_decline.js', 'fires', '', 'kind 类：认领 declined'],
  ['视觉小说行', 'app96_social.js', 'fires', '', 'kind 类：认领 vn96'],

  /* —— 第 3 步：条件型认领层 —— */
  ['块里有台词（box）', 'app16_story2.js#kinds', 'fires', 'm-box ctx', 'kind 类：认领 box（没有 m.say 的上下文盒）'],
  ['场景卡（scene）', 'app16_story2.js#kinds', 'fires', 'm-scene', 'kind 类：认领 scene'],
  ['开场介绍（intro）', 'app16_story2.js#kinds', 'fires', 'm-intro', 'kind 类：认领 intro'],
  ['剧情事件卡（event）', 'app16_story2.js#pk', 'fires', 'm-event', 'kind 类：认领 event'],
  ['玩家的动作行', 'app16_story2.js#pk', 'fires', 'm-act me', 'kind 类：认领 act，但只认「你扮演的人」那一支（who==="me" 且本局有 pk）'],
  ['玩家的心声行', 'app16_story2.js#pk', 'fires', 'm-think me', 'kind 类：认领 think，同上只认你那一支'],
  /* 2026-10-27：say 的认领已收进 app3_chat.js 的 speakerOf/sayHTML（Ann：三句都走 .bub）。
     app17 / app26 这两层**退场**，所以这里不再有它们的 fires 断言 —— 它们原先证的那两件事
     （别人的台词成气泡、你扮演的台词是右手气泡）现在由 render-snapshot 的 npc-say / say 两张
     逐字节快照守着，那比「某层命中过」更硬：形状一变就红。 */
  ['内心独白卡（mono）', 'app19_bgm.js', 'fires', 'm-mono', 'kind 类：认领 mono'],
  ['章节标题（xtitle）', 'app23_heir.js', 'fires', 'xtitle', 'kind 类：认领 x* 四种'],
  ['遗产金额 · 已解锁（交给内层）', 'app23_heir.js', 'fires', ['xmoney', '!sealed'],
    'xmoney 有两个认领层：app24 在最外层只认「没解锁且非会员」，解锁后它把活交回内层 → app23 画',
    { mustNot: ['app24_gl.js'] }],
  ['遗产金额 · 未解锁封口', 'app24_gl.js', 'fires', ['xmblur', 'sealed'],
    '同上：这一支由外层的 app24 直接答，内层 app23 根本不跑（所以它在这条探针里必须 0 命中）',
    { mustNot: ['app23_heir.js'] }],
  ['旁白换人称（扮演别人）', 'app94_official2.js', 'fires', '测试角色推开门', 'wrap 类：扮演的不是主角时，把旁白里的「你」换成主角名'],
  ['捡到东西（item101）', 'app101_you.js', 'fires', 'it101', 'kind 类：认领 item101'],
];

function read() {
  const r = spawnSync(EDGE, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    '--virtual-time-budget=18000', '--dump-dom', URL
  ], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const dom = (r.stdout || '') + (r.stderr || '');
  const m = /MSGKIND_JSON:(\{[\s\S]*?\})<\/pre>/.exec(dom);
  if (!m) return null;
  try { return JSON.parse(m[1]) } catch (e) { return null }
}

const data = read();
if (!data) {
  console.log('✗ 拿不到探针读数（页面没起来？本地服务要跑在 ' + PORT + '，见 tools/serve.mjs）');
  process.exit(2);
}
if (data.error) { console.log('✗ ' + data.error); process.exit(2) }

if (process.argv.includes('--json')) { console.log(JSON.stringify(data, null, 2)); process.exit(0) }

/* `--graph`：把「类型 → 认领层」从**运行时**打出来。以前这张图靠 `tools/msghtml-kinds.mjs`
   静态扫源码（按正则猜 `m.k===` 的形状），它漏掉了 app24 的 xmoney（条件是 `m.k!=="xmoney"` 取反写）。
   认领是运行期才知道的事，图就该从运行期读。 */
if (process.argv.includes('--graph')) {
  const g = {};
  for (const x of (data.layers || [])) for (const k of (x.kinds || [])) (g[k] = g[k] || []).push(x.name);
  for (const k of Object.keys(g).sort()) {
    console.log('  ' + k.padEnd(9) + g[k].join(' · ') + (g[k].length > 1 ? '   ← 多层认领（顺序接力）' : ''));
  }
  process.exit(0);
}

const layers = data.layers || [];
const probes = new Map((data.probes || []).map(p => [p.name, p]));
const bad = [];
const known = new Set();

/* ⚠️ 坑：`--dump-dom` 把 `<pre>` 里的文本**转义**了（`<` → `&lt;`），
   于是同一段 HTML 在页面里是 `<em class="ma">`、到这里是 `&lt;em class="ma"&gt;`。
   第一版没还原，结果「命中了但 HTML 里没有 <em class=\"ma\">」这条**误报**了一次 ——
   待查的是我给的两边格式不一致，不是代码。⇒ 先还原，再判。 */
function unesc(s) {
  return String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}

/* 标记检查：`!xxx` = 必须**不**出现。唯一靠删除干活的层（app16 的 mquick）只能这样验 ——
   「改了东西」证明它动了，证明不了删对了东西。 */
function checkMarkers(label, html, contains) {
  const list = contains == null ? [] : (Array.isArray(contains) ? contains : [contains]);
  for (const c of list) {
    if (!c) continue;
    const neg = c.charAt(0) === '!', want = neg ? c.slice(1) : c;
    const has = html.includes(want);
    if (neg && has) bad.push('「' + label + '」：不该出现 `' + want + '` 却出现了');
    if (!neg && !has) bad.push('「' + label + '」：命中了但 HTML 里没有 `' + want + '`');
  }
}

for (const [probeName, layer, want, contains, reason, opts] of EXPECT) {
  const p = probes.get(probeName);
  if (!p) { bad.push('探针「' + probeName + '」在页面上没有产出'); continue }
  p.html = unesc(p.html);
  if (p.html.startsWith('ERR ')) bad.push('探针「' + probeName + '」渲染抛错：' + p.html.slice(0, 80));

  if (layer === '*') {
    /* 对照：一个后处理/wrap 层都不许动它（`allow` 里点名的层除外 —— 那是设计上每行都动的） */
    const allow = (opts && opts.allow) || [];
    const moved = p.fired.filter(n => (layers.find(x => x.name === n) || {}).cls !== 'kind' && allow.indexOf(n) < 0);
    if (moved.length) bad.push('对照探针被这些层改动了 → ' + moved.join(', '));
    continue;
  }

  known.add(layer);
  const fired = p.fired.indexOf(layer) >= 0;
  if (want === 'fires') {
    if (!fired) bad.push('「' + probeName + '」：' + layer + ' 该动而没动（命中 0）');
    checkMarkers(probeName, p.html, contains);
  } else {
    if (fired) bad.push('「' + probeName + '」：' + layer + ' 登记为【已知死】却动了起来 —— 底下改了，回来改这张表与原因');
  }
  /* 「接力」要两边都断言：外层答了、内层就必须没跑。只查一边的话，
     顺序反了（内层先答）照样绿 —— 而那正是这一类最容易出的错。 */
  for (const n of (opts && opts.mustNot) || []) {
    if (p.fired.indexOf(n) >= 0) bad.push('「' + probeName + '」：' + n + ' 本该把活交出去，却自己动了（顺序或条件变了）');
  }
}

/* 注册表里每一层都要被点名：声明了却从不验证 = 这一层等于不存在 */
const unprobed = layers.filter(x => !known.has(x.name)).map(x => x.name + '(' + x.cls + ')');
if (unprobed.length) bad.push('注册了但没有探针点名 → ' + unprobed.join(', '));

/* 探针期间任何一层抛错都是真 bug（不是"环境问题"） */
const thrown = layers.filter(x => x.err > 0).map(x => x.name + ' ×' + x.err);
if (thrown.length) bad.push('探针期间有层抛错 → ' + thrown.join(', '));

const liveRows = EXPECT.filter(e => e[2] === 'fires').length;
const liveLayers = new Set(EXPECT.filter(e => e[2] === 'fires').map(e => e[1])).size;
const dead = new Set(EXPECT.filter(e => e[2] === 'silent' && e[1] !== '*').map(e => e[1])).size;

if (bad.length) {
  console.log('✗ msgkind 探针 ' + bad.length + ' 处不符：');
  bad.slice(0, 12).forEach(x => console.log('   ' + x));
  console.log('   （fires/silent 的定义在 tools/msgkind-probe.mjs 顶部；登记为 silent 的原因必须写清）');
  process.exit(1);
}
console.log('✓ msgkind-probe: ' + layers.length + ' 层在册 · ' + EXPECT.length + ' 条探针 —— ' +
  liveLayers + '/' + layers.length + ' 层被证明活着（' + liveRows + ' 条命中判据）· ' +
  dead + ' 层登记为已知死 · 对照未被扰动');
process.exit(0);
