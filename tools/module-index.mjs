#!/usr/bin/env node
/* module-index — 把 `source/src/*.js` 的**头注释**生成一张模块索引，写进 ARCHITECTURE.md
 *
 * 为什么要有它（Ann 2026-10-29：「把本地的构架文档更新一下」）：
 *   实测 138 个模块，ARCHITECTURE.md 提到 42 个。缺的 96 个**不该手写补** ——
 *   架构文档写的是链和入口，不是文件目录；但读者确实需要「这个 app4_more 是干嘛的」。
 *   ⇒ 手写必漂、必漏。而这些文件 **131/138 开头本来就有自述**。
 *   ⇒ 那就**生成**：一张附录表，加一条闸，过期就红。
 *
 * 做法：取每个文件顶部第一条注释的第一句（去掉 ===== 装饰与日期），截断到 74 字符。
 * 次序按文件名里的数字（app4 在 app19 前，app100 在 app96 后 —— 数字序，不是字典序）。
 *
 * 用法：
 *   node tools/module-index.mjs            # 打印生成结果（人看）
 *   node tools/module-index.mjs --write    # 写进 ARCHITECTURE.md 的标记区间
 *   node tools/module-index.mjs --check    # 闸：文件里的表 ≠ 现生成的表 ⇒ exit 1
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const DOC = path.join(ROOT, 'ARCHITECTURE.md');
const BEGIN = '<!-- BEGIN module-index（由 tools/module-index.mjs 生成，别手改） -->';
const END = '<!-- END module-index -->';
const SRC = path.join(ROOT, 'source', 'src');
const MAXLEN = 74;

/** 从文件顶部取第一条注释的第一句；太短（横幅）就往后找下一条真注释 */
function clean(body) {
  let s = body
    .replace(/[=\-—]{3,}/g, ' ')
    .split('\n').map(x => x.replace(/^\s*\*?\s?/, '')).join(' ')
    .replace(/^\s*(v?\d+(\.\d+)*\s*[·:：]?\s*)/i, '')
    .replace(/\b20\d\d-\d\d-\d\d\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  s = s.split(/(?<=[。．.！!？?])\s/)[0] || s;
  return s.replace(/\s*[。．.]$/, '').trim();
}

function header(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const cands = [];
  // 前 60 行里的所有注释块，按出现顺序
  const head = lines.slice(0, 60).join('\n');
  for (const m of head.matchAll(/\/\*([\s\S]*?)\*\//g)) cands.push(m[1]);
  for (const m of lines.slice(0, 60)) { const d = /^\s*\/\/(.*)$/.exec(m); if (d) cands.push(d[1]) }
  if (!cands.length) return '（文件头没有说明 —— 该补一句）';
  // 取第一个「像说明」的：长度 ≥ 15，或不是纯大写横幅
  for (const c of cands) {
    const s = clean(c);
    if (!s) continue;
    const banner = /^[A-Z0-9 &·—\-()+_/]{2,30}$/.test(s.replace(/\s+/g, ' ').trim());
    const prose = /^[\p{L}\p{Script=Han}]/u.test(s);       // 不像说明的（以标点/引号开头）跳过
    if ((s.length >= 15 || !banner) && prose) return s.length > MAXLEN ? s.slice(0, MAXLEN - 1) + '…' : s;
  }
  // 全是横幅（比如只有 /* ===== CORE ===== */）⇒ 老实说它是横幅
  const s = clean(cands[0]);
  return (s || '?') + '（原文只有段落横幅）';
}

const num = (n) => Number((/^app(\d+)/.exec(n) || [0, 9999])[1]);

function build() {
  const files = fs.readdirSync(SRC).filter(f => f.endsWith('.js') && !/\.bak-/.test(f)).sort((a, b) => num(a) - num(b) || a.localeCompare(b));
  const rows = files.map(f => {
    const lines = fs.readFileSync(path.join(SRC, f), 'utf8').split('\n').length;
    return { f, h: header(path.join(SRC, f)).replace(/\|/g, '\\|'), lines };
  });
  const out = [];
  out.push(BEGIN);
  out.push('');
  out.push(`共 **${rows.length} 个模块**；「是什么」那一列**取自各文件自己的头注释**，不是手写的。`);
  out.push('加一个文件、改一句头注释，这张表就该跟着变 —— `tools/module-index.mjs --check` 会红。');
  out.push('');
  out.push('| 模块 | 是什么 | 行数 |');
  out.push('|---|---|---|');
  for (const r of rows) out.push(`| \`${r.f}\` | ${r.h} | ${r.lines} |`);
  out.push('');
  out.push(END);
  return out.join('\n');
}

const gen = build();
const args = process.argv.slice(2);

if (args.includes('--write')) {
  const doc = fs.readFileSync(DOC, 'utf8');
  const i = doc.indexOf(BEGIN), j = doc.indexOf(END);
  const next = (i >= 0 && j > i)
    ? doc.slice(0, i) + gen + doc.slice(j + END.length)
    : doc.replace(/\n*$/, '\n\n' + gen + '\n');
  fs.writeFileSync(DOC, next);
  console.log(`已写入 ARCHITECTURE.md（${gen.split('\n').length} 行）`);
  process.exit(0);
}

if (args.includes('--check')) {
  const doc = fs.readFileSync(DOC, 'utf8');
  const i = doc.indexOf(BEGIN), j = doc.indexOf(END);
  if (i < 0 || j < i) {
    console.log('✗ ARCHITECTURE.md 里没有模块索引区间（标记行被删了？）');
    process.exit(1);
  }
  const have = doc.slice(i, j + END.length);
  if (have === gen) { console.log('✓ 模块索引与源码一致（' + (gen.match(/^\| `/gm) || []).length + ' 个模块）'); process.exit(0) }
  const hl = have.split('\n'), gl = gen.split('\n');
  let first = -1;
  for (let k = 0; k < Math.max(hl.length, gl.length); k++) if (hl[k] !== gl[k]) { first = k; break }
  console.log('✗ 模块索引过期（第 ' + (first + 1) + ' 行起不同）');
  console.log('  文档里：' + (hl[first] || '（没有这一行）'));
  console.log('  现生成：' + (gl[first] || '（没有这一行）'));
  console.log('  ⇒ 跑 node tools/module-index.mjs --write');
  process.exit(1);
}

console.log(gen);
