// 对话流的「缝」覆盖了多少 —— 稳健性的可数判据（2026-10-27）
//
//   背景：DIALOGUE-PIPELINE.md 定的三个动词是 D.post / D.say / D.pace（source/src/app102_pipeline.js）。
//   只要还有人**绕过** D 直接 appendMsg / speak / 自己 setTimeout 排队，稳健性就还是纸上的。
//
//   这个脚本不判断"好不好"，只报三件事：
//     ① 还有哪些文件**直接**写对话流（appendMsg 的直接调用点）
//     ② 还有哪些文件**直接**发声（speak 的直接调用点）
//     ③ 还有哪些地方**自己算节奏**（setTimeout 排队 / pkWait 调用）
//
//   用法：node tools/pipeline-coverage.mjs [--json]
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'source/src';
const files = fs.readdirSync(SRC).filter(f => f.endsWith('.js'));

const rules = [
  { key: '写对话流', re: /\bappendMsg\s*\(/g, allow: ['app102_pipeline.js', 'app3_chat.js'] },
  { key: '发声', re: /\bspeak\s*\(/g, allow: ['app102_pipeline.js', 'app1_core.js'] },
  { key: '算节奏', re: /\bpkWait\s*\(|\breadMs\s*\(/g, allow: ['app102_pipeline.js', 'app16_story2.js'] },
];

const out = {};
for (const r of rules) {
  const hits = [];
  for (const f of files) {
    if (r.allow.includes(f)) continue;
    const txt = fs.readFileSync(path.join(SRC, f), 'utf8');
    const m = txt.match(r.re);
    if (m) hits.push({ file: f, n: m.length });
  }
  out[r.key] = hits;
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(out, null, 2));
} else {
  console.log('=== 绕过 D 层（D.post / D.say / D.pace）的地方 ===\n');
  for (const r of rules) {
    const hits = out[r.key];
    const total = hits.reduce((a, b) => a + b.n, 0);
    console.log(`${r.key}：${hits.length} 个文件 / ${total} 处`);
    hits.sort((a, b) => b.n - a.n).forEach(h => console.log(`   ${h.file.padEnd(24)} ${h.n}`));
    console.log('');
  }
  const total = Object.values(out).reduce((a, hs) => a + hs.length, 0);
  console.log(total === 0
    ? '✓ 全部走 D 层'
    : `⇒ 还有 ${total} 个文件没过 D 层。每少一个，就少一条「改一处动两处」的路。`);
}
