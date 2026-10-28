#!/usr/bin/env node
/* doc-freshness — 「架构文档跟上了吗」的闸
 *
 * 为什么要有它（Ann 2026-10-28）：
 *   「架构文档我们写的时候要跟上，要不然做的多了，会忘记之前的事情。」
 *   —— 到手实测：语音那 5 层补丁已换成 VOICE 注册表、speakQueue 加了看门狗、
 *      新增了 voice-probe / sim-dialogue --lines，而 ARCHITECTURE.md 只在「猴补丁数」那一行
 *      提了半句，没有一节讲语音现在长什么样。doc-ref-check 全绿 —— 因为它只对账**数字**。
 *
 * 它查的是什么：**结构性的改动，有没有同一次提交里带上 ARCHITECTURE.md。**
 *   结构性 = 动到「新增/移动入口、状态机、注册表、构建清单」这几类文件（下面 STRUCT 表）。
 *   为什么不按 mtime 比：mtime 谁更晚跟「有没有写进去」没关系（见实痛库）。
 *
 * 两道缺口怎么过：
 *   ① 同一次提交里改 ARCHITECTURE.md；
 *   ② 提交信息里写 `doc:none <理由>`（纯注释改动、纯措辞、一次 typo）。
 *      —— 理由必须写，`doc:none` 三个字母单独出现不算。
 *
 * 用法：
 *   node tools/doc-freshness.mjs            # 人读：列出违规
 *   node tools/doc-freshness.mjs --check    # 闸：基线外的违规 ⇒ exit 1
 *   node tools/doc-freshness.mjs --write    # 把当前违规冻成基线（只允许做一次，之后要解释）
 *   node tools/doc-freshness.mjs --selftest # 证明这把尺能红（分类器单元测试）
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const BASE = path.join(ROOT, 'tools', 'doc-freshness-baseline.json');
const DOC = 'ARCHITECTURE.md';
const WINDOW = 60;          // 看最近多少个提交

/* 结构性文件：动它们 = 可能在改架构。加进来的标准是「这张表本身就在 ARCHITECTURE.md 里」。
   ⚠️ 新增 source/src/*.js 永远算结构性（多一层就是多一个入口），不用列在这。 */
const STRUCT = [
  'source/src/app1_core.js',       // 核心：speak/VOICE 注册表、HEAT_RULE、状态
  'source/src/app3_chat.js',       // say 的渲染与 speakQueue
  'source/src/app100_dialogue.js', // REPLY CHARTER / heat 分派
  'source/src/app16_story2.js',    // 故事渲染
  'source/src/app62_tts.js',       // TTS 层
  'source/src/app86_voicefix.js',  // 语音兜底层
  'source/src/app88_memcall.js',   // 通话层
  'source/src/shell.html',         // 样式入口
  'source/build.py',               // parts 清单 = 加载顺序
];

const sh = (c) => execSync(c, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });

/** 从一个提交里判定：算不算「结构性改动但没带文档」 */
export function judge(files, subject) {
  const isStruct = files.some(f => STRUCT.includes(f) || /^source\/src\/[^/]+\.js$/.test(f) && !/\.bak-/.test(f));
  const hasDoc = files.includes(DOC);
  if (!isStruct || hasDoc) return null;
  const m = /doc:none\s+(\S.*)$/.exec(subject || '');
  if (m && m[1].trim().length >= 4) return null;      // 写清了理由 ⇒ 放行
  return { reason: isStruct ? '结构性改动' : '?', hasDoc };
}

function collect() {
  const raw = sh(`git log -n ${WINDOW} --pretty=format:"@@%H%x09%s" --name-only`).split('\n');
  const out = [];
  let cur = null;
  for (const line of raw) {
    if (line.startsWith('@@')) {
      if (cur) out.push(cur);
      const [sha, ...rest] = line.slice(2).split('\t');
      cur = { sha: sha.slice(0, 8), subject: rest.join('\t'), files: [] };
    } else if (line.trim() && cur) cur.files.push(line.trim());
  }
  if (cur) out.push(cur);
  return out.map(c => ({ ...c, verdict: judge(c.files, c.subject) })).filter(c => c.verdict);
}

function selftest() {
  const cases = [
    [['source/src/app1_core.js'], '改了点东西', true, '结构性 + 没带文档 ⇒ 必须红'],
    [['source/src/app1_core.js', DOC], '改了点东西', false, '同一提交带文档 ⇒ 放行'],
    [['source/src/app1_core.js'], 'typo doc:none 只改注释', false, 'doc:none + 理由 ⇒ 放行'],
    [['source/src/app1_core.js'], 'typo doc:none', true, 'doc:none 没理由 ⇒ 仍红'],
    [['tools/foo.mjs'], '改了个工具', false, '非结构性 ⇒ 不管'],
    [['source/src/app_newlayer.js'], '新加一层', true, '新增 source/src 层 ⇒ 算结构性'],
    [['source/src/app1_core.js.bak-20261028'], '备份', false, '备份文件 ⇒ 不算'],
  ];
  let bad = 0;
  for (const [files, subj, wantRed, why] of cases) {
    const got = judge(files, subj) !== null;
    const ok = got === wantRed;
    if (!ok) bad++;
    console.log(`  ${ok ? '✓' : '✗'} ${why}（期望${wantRed ? '红' : '绿'}，实得${got ? '红' : '绿'}）`);
  }
  // 负对照：把 ARCHITECTURE.md 从路径里拿掉，判据必须还能红
  const canRed = judge(['source/src/app3_chat.js'], 'x') !== null;
  console.log(`  ${canRed ? '✓' : '✗'} 负对照：本项目里确实存在会红的形状`);
  if (!canRed) bad++;
  console.log(bad ? `\n✗ 自测失败 ${bad} 条 —— 这把尺现在不能信` : '\n✓ 自测通过：7 臂，含 3 条放行臂与 1 条「必须红」的负对照');
  return bad ? 1 : 0;
}

const args = process.argv.slice(2);
if (args.includes('--selftest')) process.exit(selftest());

const bad = collect();

if (args.includes('--write')) {
  fs.writeFileSync(BASE, JSON.stringify(bad.map(b => ({ sha: b.sha, subject: b.subject })), null, 1) + '\n');
  console.log(`已冻结 ${bad.length} 条为基线 → ${path.relative(ROOT, BASE)}`);
  console.log('⚠️ 冻结不是解决：每一条都该在下次动那个文件时顺手补文档，补完把它从基线删掉。');
  process.exit(0);
}

if (!bad.length) { console.log('✓ 结构性改动都带了 ARCHITECTURE.md（最近 ' + WINDOW + ' 个提交）'); process.exit(0) }

const base = fs.existsSync(BASE) ? JSON.parse(fs.readFileSync(BASE, 'utf8')) : [];
const baseSet = new Set(base.map(b => b.sha));
const fresh = bad.filter(b => !baseSet.has(b.sha));

console.log(`结构性改动但没带 ${DOC}：${bad.length} 个提交（基线内 ${bad.length - fresh.length} · 新增 ${fresh.length}）\n`);
for (const b of bad) {
  console.log(`  ${baseSet.has(b.sha) ? '·' : '✗'} ${b.sha}  ${b.subject}`);
  if (!baseSet.has(b.sha)) console.log(`      → 补 ${DOC}，或提交信息里写 doc:none <理由>`);
}
if (!fresh.length) { console.log('\n✓ 没有基线外的新增'); process.exit(0) }
if (args.includes('--check')) { console.log(`\n✗ ${fresh.length} 个提交没让架构文档跟上`); process.exit(1) }
