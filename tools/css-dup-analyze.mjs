// 重复定义能不能**机械并**：只读判定（2026-10-27）
//
//   背景：`shell.html` 里 60 多个选择器被定义了不止一次 —— 那是 CSS 版的猴补丁。
//   并掉一层是对的，但「并」有两种：机械可做的、和必须人看的。这个脚本只回答一档：
//
//     node tools/css-dup-analyze.mjs          给人看：A 档（可机械并）/ B 档（需人看）+ 理由
//     node tools/css-dup-analyze.mjs --json   A 档的合并计划（给下一步的批量脚本吃）
//
//   判 A 档要同时满足三条（缺一条就 B）：
//     ① 上下文相同 —— 都在顶层，或都在同一串 @media/@supports/@container 里。
//        上下文不同就不能并：`@media(max-width:600px)` 里的那条只在窄屏生效。
//     ② 没有 shorthand / longhand 交叠 —— `padding:10px` 和 `padding-top:3px` 同时出现时，
//        「后来的赢」只对**同名属性**成立；合并得先把 shorthand 展开，那是另一件事。
//     ③ 同名属性的定义之间没有别的规则挡着 —— 否则「把合并版放在最后一条的位置」
//        会让中间那条对某些属性的胜负翻转（这是最容易静默改样子的地方）。
//
//   它**不改任何东西**。改是下一步的事，判据是 `tools/style-computed-snapshot.mjs --check`。
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const FILE = path.join(ROOT, 'source', 'src', 'shell.html');

/* ---------- 把 <style> 切成「顶层规则 + 上下文」的序列 ---------- */
function scan(css) {
  const rules = [];          // {ctx:[...], sel, body, line, index}
  let i = 0, n = css.length, line = 1;
  const stack = [];          // 正在展开的 at-rule 上下文
  let buf = '', depth = 0;

  while (i < n) {
    const c = css[i];
    if (c === '\n') line++;
    /* 注释整段跳过 */
    if (c === '/' && css[i + 1] === '*') { const e = css.indexOf('*/', i + 2); const seg = css.slice(i, e < 0 ? n : e + 2); line += (seg.match(/\n/g) || []).length; i = e < 0 ? n : e + 2; continue }
    /* 字符串整段跳过 */
    if (c === '"' || c === "'") { let j = i + 1; while (j < n && css[j] !== c) { if (css[j] === '\\') j++; if (css[j] === '\n') line++; j++ } i = j + 1; continue }
    if (c === '{') {
      const head = buf.trim();
      buf = '';
      if (head.startsWith('@')) { stack.push(head.replace(/\s+/g, ' ')); depth = 0; i++; continue }
      /* @keyframes 里的 `from` / `to` / `0%` 不是选择器，不参与层叠 —— 第一版把它们当成了
         「被重复定义 18 次的选择器」，那是纯噪声（而且把 B 档整档灌满了）。 */
      if (stack.some(x => /@(-\w+-)?keyframes/.test(x))) {
        let k = i + 1, d = 1;
        while (k < n && d > 0) { if (css[k] === '{') d++; else if (css[k] === '}') d--; if (css[k] === '\n') line++; k++ }
        i = k; continue;
      }
      /* 普通规则：读到配对的 } */
      let j = i + 1, d = 1, startLine = line;
      while (j < n && d > 0) {
        const ch = css[j];
        if (ch === '\n') line++;
        else if (ch === '{') d++;
        else if (ch === '}') d--;
        if (ch === '/' && css[j + 1] === '*') { const e = css.indexOf('*/', j + 2); j = e < 0 ? n : e + 2; continue }
        if (ch === '"' || ch === "'") { let k = j + 1; while (k < n && css[k] !== ch) { if (css[k] === '\\') k++; if (css[k] === '\n') line++; k++ } j = k + 1; continue }
        if (d > 0) j++;
      }
      rules.push({ ctx: stack.slice(), sel: head.replace(/\s+/g, ' '), body: css.slice(i + 1, j), line: startLine, index: rules.length, from: i - head.length, bodyFrom: i + 1, bodyTo: j, to: j + 1 });
      i = j + 1;
      continue;
    }
    if (c === '}') { stack.pop(); buf = ''; i++; continue }
    buf += c; i++;
  }
  return rules;
}

/* 声明拆成 {属性: 值}（同名重复时后者赢 —— 这跟浏览器一致） */
function decls(body) {
  const out = {};
  for (const part of body.split(';')) {
    const k = part.indexOf(':');
    if (k < 0) continue;
    const p = part.slice(0, k).trim().toLowerCase(), v = part.slice(k + 1).trim();
    if (p) out[p] = v;
  }
  return out;
}
/* shorthand 的真实展开表 —— **不能用前缀猜**。
   第一版用「名字前缀包含」判交叠，于是 `border ⊃ border-radius`、`flex ⊃ flex-direction`
   都被报成交叠：这两对根本不相干（`border` 设的是 width/style/color；`flex` 设的是 grow/shrink/basis）。
   一个判据在两个方向都会错，那它就不是判据。 */
const SHORTHAND = {
  margin: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
  padding: ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
  border: ['border-width', 'border-style', 'border-color', 'border-top', 'border-right', 'border-bottom', 'border-left'],
  'border-width': ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'],
  'border-style': ['border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style'],
  'border-color': ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'],
  'border-top': ['border-top-width', 'border-top-style', 'border-top-color'],
  'border-right': ['border-right-width', 'border-right-style', 'border-right-color'],
  'border-bottom': ['border-bottom-width', 'border-bottom-style', 'border-bottom-color'],
  'border-left': ['border-left-width', 'border-left-style', 'border-left-color'],
  'border-radius': ['border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius'],
  background: ['background-color', 'background-image', 'background-position', 'background-size', 'background-repeat', 'background-attachment', 'background-origin', 'background-clip'],
  font: ['font-style', 'font-variant', 'font-weight', 'font-size', 'line-height', 'font-family'],
  flex: ['flex-grow', 'flex-shrink', 'flex-basis'],
  'flex-flow': ['flex-direction', 'flex-wrap'],
  gap: ['row-gap', 'column-gap'],
  inset: ['top', 'right', 'bottom', 'left'],
  overflow: ['overflow-x', 'overflow-y'],
  outline: ['outline-width', 'outline-style', 'outline-color'],
  transition: ['transition-property', 'transition-duration', 'transition-timing-function', 'transition-delay'],
  animation: ['animation-name', 'animation-duration', 'animation-timing-function', 'animation-delay', 'animation-iteration-count', 'animation-direction', 'animation-fill-mode', 'animation-play-state'],
  'list-style': ['list-style-type', 'list-style-position', 'list-style-image'],
  'text-decoration': ['text-decoration-line', 'text-decoration-style', 'text-decoration-color', 'text-decoration-thickness'],
  'place-items': ['align-items', 'justify-items']
};
function relate(a, b) {
  if (a === b) return true;
  return (SHORTHAND[a] || []).includes(b) || (SHORTHAND[b] || []).includes(a);
}
function overlaps(props) {
  const bad = [];
  for (let i = 0; i < props.length; i++) for (let j = 0; j < props.length; j++) {
    if (i === j) continue;
    if (relate(props[i], props[j])) bad.push(props[i] + ' ⊃ ' + props[j]);
  }
  return [...new Set(bad)];
}
/* 简易特异性：[id, class/attr/伪类, 元素/伪元素]。
   两条规则只有在**特异性相同**时才由先后决定胜负，差一档就不是顺序问题。 */
function spec(sel) {
  const s = String(sel).replace(/\s*([>+~])\s*/g, ' ');
  let id = 0, cls = 0, el = 0;
  for (const tok of s.split(/\s+/)) {
    if (!tok) continue;
    id += (tok.match(/#[\w-]+/g) || []).length;
    cls += (tok.match(/\.[\w-]+|\[[^\]]*\]|:(?!:)[\w-]+/g) || []).length;
    el += (tok.match(/(^|[\s>+~])([a-z][\w-]*)|::[\w-]+/gi) || []).length;
  }
  return id + ',' + cls + ',' + el;
}
function classTokens(sel) {
  return new Set((String(sel).match(/\.[\w-]+/g) || []).map(x => x.slice(1)));
}

const html = fs.readFileSync(FILE, 'utf8');
const sm = /<style>([\s\S]*?)<\/style>/.exec(html);
if (!sm) { console.log('✗ shell.html 里没有 <style> 块'); process.exit(2) }
const css = sm[1];
const rules = scan(css);

/* 按 selector 分组（同一条选择器文本才算同一组；`.a` 与 `.a.b` 是不同的规则） */
const groups = new Map();
for (const r of rules) {
  if (!groups.has(r.sel)) groups.set(r.sel, []);
  groups.get(r.sel).push(r);
}
const dups = [...groups.entries()].filter(([, v]) => v.length > 1)
  .sort((a, b) => b[1].length - a[1].length || b[1][0].body.length - a[1][0].body.length);

const A = [], B = [];
for (const [sel, list] of dups) {
  const reasons = [];
  const ctxs = new Set(list.map(r => r.ctx.join(' ')));
  if (ctxs.size > 1) reasons.push('上下文不同：' + [...ctxs].map(x => x || '(顶层)').join(' / '));

  const propSets = list.map(r => Object.keys(decls(r.body)));
  const allProps = [...new Set(propSets.flat())];
  const ov = overlaps(allProps);
  if (ov.length) reasons.push('shorthand/longhand 交叠：' + ov.slice(0, 4).join(', '));

  /* 同名属性在各定义间「有没有别的东西挡着」：
     只有三件事同时成立才会翻转胜负 —— ① 特异性相同 ② 选择器**可能匹配同一个元素**（共用一个 class）
     ③ 那条规则也设了同一批属性（或它的 shorthand/longhand）。
     第一版把「中间任何一条设了同名属性」都算进来，于是 `.dk` 被判「121 条夹在中间」 —— 那些是
     `.dkn` / `.htabs` 之类，特异性未必相同、也未必能匹配到同一个元素，噪声盖掉了真信号。 */
  const between = rules.filter(r => r.index > list[0].index && r.index < list[list.length - 1].index && r.sel !== sel);
  const shared = propSets.reduce((acc, s) => acc.filter(p => s.includes(p)), propSets[0]);
  if (between.length && shared.length && new Set(ctxs).size === 1) {
    const mySpec = spec(sel), myCls = classTokens(sel);
    const touched = between.filter(r => {
      if (spec(r.sel) !== mySpec) return false;
      const other = classTokens(r.sel);
      if (![...other].some(c => myCls.has(c))) return false;
      /* 尾巴上的标签名不同 ⇒ 不可能匹配到同一个元素（`.dkc p` 与 `.dkc h2`）。
         不加这一条，`.dkc p` 会被 `.dkc h2` 判成「夹着同名属性规则」—— 又是自己造的噪声。 */
      const tagOf = (s) => { const m = /([a-z][\w-]*)\s*$/i.exec(s.replace(/[)\]]+$/, '')); return m ? m[1].toLowerCase() : '' };
      const ta = tagOf(sel), tb = tagOf(r.sel);
      if (ta && tb && ta !== tb) return false;
      const d = Object.keys(decls(r.body));
      return d.some(p => shared.some(s => relate(p, s)));
    });
    if (touched.length) reasons.push(touched.length + ' 条同特异性、可能匹配同一元素的规则夹在中间（' + touched.slice(0, 3).map(r => r.sel).join(' / ') + '）');
  }

  const merged = {};
  for (const r of list) Object.assign(merged, decls(r.body));
  const plan = { sel, n: list.length, at: list.map(r => 'line ' + r.line), ctx: [...ctxs][0] || '', merged, bytes: list.reduce((s, r) => s + r.body.length, 0) };
  if (reasons.length) B.push({ ...plan, reasons });
  else A.push(plan);
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ A, B: B.map(x => ({ sel: x.sel, n: x.n, reasons: x.reasons })) }, null, 1));
  process.exit(0);
}

if (process.argv.includes('--apply')) {
  /* 机械并 A 档：**最后一条**的声明块换成合并体（按「后来的赢」），更早的每条整条删掉。
     为什么是最后一条的位置：它保住「相对所有其它规则的先后」，而组内谁先谁后已经并进合并体了。 */
  const cssOff = sm.index + '<style>'.length;
  const edits = [];
  let plan = 0;
  for (const x of A) {
    const list = groups.get(x.sel);
    const last = list[list.length - 1];
    const mergedBody = Object.keys(x.merged).map(k => k + ':' + x.merged[k]).join(';');
    edits.push({ from: cssOff + last.bodyFrom, to: cssOff + last.bodyTo, text: mergedBody, what: 'merge ' + x.sel });
    for (const r of list.slice(0, -1)) {
      let end = cssOff + r.to;
      /* 连带吃掉后面那个换行，别留空行 */
      if (html.slice(end, end + 2) === '\r\n') end += 2; else if (html[end] === '\n') end += 1;
      edits.push({ from: cssOff + r.from, to: end, text: '', what: 'drop line ' + r.line + ' ' + x.sel });
    }
    plan++;
  }
  if (process.argv.includes('--dry')) {
    console.log('--dry：将改 ' + plan + ' 个选择器、' + edits.length + ' 处文本编辑');
    process.exit(0);
  }
  edits.sort((a, b) => b.from - a.from);
  let out = html;
  for (const e of edits) out = out.slice(0, e.from) + e.text + out.slice(e.to);
  fs.writeFileSync(FILE, out, 'utf8');
  console.log('✓ 已并 ' + plan + ' 个选择器（' + edits.length + ' 处编辑）· shell.html ' + html.length + ' → ' + out.length + ' 字符');
  console.log('  判据：node tools/style-computed-snapshot.mjs --check（真浏览器，780 格必须一致）');
  process.exit(0);
}

const saved = A.reduce((s, x) => s + x.bytes - Object.entries(x.merged).reduce((t, [k, v]) => t + k.length + v.length + 2, 0), 0);
console.log('shell.html：' + rules.length + ' 条规则 · 被重复定义的选择器 ' + dups.length + ' 个');
console.log('');
console.log('A 档（可机械并）' + A.length + ' 个 —— 并掉能省 ' + saved + ' 字符');
for (const x of A.slice(0, 40)) console.log('  ×' + x.n + '  ' + x.sel.slice(0, 56) + (x.ctx ? '  [' + x.ctx + ']' : '') + '  ' + x.at.join(', '));
if (A.length > 40) console.log('  … 还有 ' + (A.length - 40) + ' 个');
console.log('');
console.log('B 档（需人看）' + B.length + ' 个：');
for (const x of B.slice(0, 40)) console.log('  ×' + x.n + '  ' + x.sel.slice(0, 48) + '  ← ' + x.reasons.join(' · '));
if (B.length > 40) console.log('  … 还有 ' + (B.length - 40) + ' 个');
process.exit(0);
