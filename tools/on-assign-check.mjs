// on* 门禁（2026-10-27 · Ann：「我们到现在没怎么检查 on」）
//
//   为什么值得单独一道闸：`el.onclick = fn` 与 `addEventListener` 不是同一件事 ——
//     · 它**覆盖**前一个处理器（不报错，前一个静默消失，且没有 remove）
//     · 它只能有一个 ⇒ 第二个写的人永远不知道自己踩掉了第一个
//   ⇒ 与「猴补丁层层覆盖」同一个病：**没有入口，谁后写谁说了算**。
//
//   两类分开管（否则一刀切会把 27 处 `img.onerror` 这类天生形态也判死）：
//
//     硬类 HARD：`window.on<event> =` / `document.on<event> =` 这类**全局**覆盖
//                —— 一旦发生，别人的处理器静默消失，且全站只认最后一个。**必须为 0**。
//     软类 SOFT：元素级 `el.on* =` —— 大多数出现在**刚创建出来的元素**上（安全惯例）。
//                要求：**只增不减**（基线），新增必须显式确认或写进 ALLOW 并注明理由。
//
//   用法：node tools/on-assign-check.mjs           人读
//        node tools/on-assign-check.mjs --write   写软类基线
//        node tools/on-assign-check.mjs --check   check-all 用（硬类 + 软类都查）
import fs from 'node:fs';

const SRC = 'source/src';
const BASE = 'tools/on-assign-baseline.json';

/* 真·事件名白名单：避免把 `one` / `onehalf`（音乐测试里的分数键）当成事件 */
const EVENTS = [
  'click', 'dblclick', 'load', 'error', 'ended', 'change', 'input', 'keydown', 'keyup', 'keypress',
  'pause', 'play', 'playing', 'timeupdate', 'canplay', 'canplaythrough', 'loadedmetadata', 'seeking',
  'success', 'upgradeneeded', 'audioprocess', 'message', 'open', 'close', 'focus', 'blur', 'submit',
  'scroll', 'resize', 'drop', 'dragover', 'dragend', 'dragstart', 'pointerdown', 'pointerup', 'touchstart',
  'touchend', 'touchmove', 'voiceschanged', 'beforeunload', 'pagehide', 'visibilitychange', 'animationend',
  'transitionend', 'readystatechange', 'progress', 'abort', 'stalled', 'waiting', 'volumechange'
];
const ALT = EVENTS.join('|');

const RE_HARD = new RegExp('(?:window|document|self|globalThis)\\.(on(?:' + ALT + '))\\s*=\\s*(?!null\\b)', 'g');
const RE_SOFT = new RegExp('(?:^|[^.\\w])[\\w$]+(?:\\.\\w+)*\\.(on(?:' + ALT + '))\\s*=\\s*(?!null\\b)', 'g');
const RE_ADDL = /addEventListener\s*\(/g;

/* 显式豁免：必须写明理由。当前为空 —— 空的豁免表本身就是一条读数。 */
const ALLOW = {
 'app86_voicefix.js': '媒体元素只有 a.onended / a.onerror 这组属性 API，没有 addEventListener 的等价物；2026-10-27 新增 a.onerror 是为了把「解码失败」从「播完了」里分出来（修前 1-3ms 静默跳过、修后降级设备语音）。'
};

const hard = [];
const soft = {}, byName = {};
let softTotal = 0, addlTotal = 0;

for (const f of fs.readdirSync(SRC).filter(x => x.endsWith('.js'))) {
  const lines = fs.readFileSync(SRC + '/' + f, 'utf8').split('\n');
  lines.forEach((ln, i) => {
    RE_HARD.lastIndex = 0;
    let m;
    while ((m = RE_HARD.exec(ln))) {
      if (ALLOW[f]) return;
      hard.push({ file: f, line: i + 1, name: m[1] });
    }
    RE_SOFT.lastIndex = 0;
    while ((m = RE_SOFT.exec(ln))) {
      if (ALLOW[f]) continue;
      soft[f] = (soft[f] || 0) + 1;
      softTotal++;
      byName[m[1]] = (byName[m[1]] || 0) + 1;
    }
    addlTotal += (ln.match(RE_ADDL) || []).length;
  });
}

const rows = Object.entries(soft).sort((a, b) => b[1] - a[1]);

if (process.argv.includes('--write')) {
  fs.writeFileSync(BASE, JSON.stringify({ softTotal, per: soft }, null, 2) + '\n', 'utf8');
  console.log('软类基线已写：元素级 on* ' + softTotal + ' 处 / ' + rows.length + ' 个文件 → ' + BASE);
  process.exit(0);
}

if (process.argv.includes('--check')) {
  let bad = 0;
  if (hard.length) {
    console.log('✗ 硬类：全局 on* 覆盖 ' + hard.length + ' 处（别人的处理器会静默消失）: ' +
      hard.slice(0, 4).map(x => x.file + ':' + x.line + ' ' + x.name).join(' · '));
    bad++;
  }
  if (!fs.existsSync(BASE)) { console.log('✗ 没有软类基线（先跑 --write）'); process.exit(1) }
  const b = JSON.parse(fs.readFileSync(BASE, 'utf8'));
  const added = [];
  for (const [f, n] of Object.entries(soft)) {
    const was = b.per[f] || 0;
    if (n > was) added.push(f + ' ' + was + '→' + n);
  }
  if (added.length) {
    console.log('✗ 软类新增 on* 赋值: ' + added.slice(0, 6).join(' · ') + ' —— 改用 addEventListener，或写进 ALLOW 注明理由');
    bad++;
  }
  if (bad) process.exit(1);
  console.log('on* 无新增（硬类 0 · 软类 ' + softTotal + ' 处 · addEventListener ' + addlTotal + ' 处）');
  process.exit(0);
}

console.log('=== on* 属性赋值（隐式覆盖的入口）===\n');
console.log('硬类（全局 window./document.on*）: ' + hard.length + ' 处' + (hard.length ? '' : '  ← 干净'));
console.log('软类（元素级 el.on*）        : ' + softTotal + ' 处 / ' + rows.length + ' 个文件');
console.log('对照：addEventListener       : ' + addlTotal + ' 处\n');
console.log('软类最集中的 10 个：');
for (const [f, n] of rows.slice(0, 10)) console.log('   ' + f.padEnd(24) + n);
console.log('\n用到哪些事件：');
Object.entries(byName).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log('   ' + k.padEnd(22) + v));
console.log('\n读法：`img.onerror` / `xhr.onload` / `audio.onended` 这类一次性形态本来就只能是 on*；');
console.log('      真正要警惕的是**共享元素**上的 on*：它会静默盖掉别人的处理器，且没有 remove。');
