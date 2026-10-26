/* say-voice-audit.mjs —— 「哪些 say 类台词没挂上语音」
 *
 * 背景（2026-10-27）：这条链的发声入口分散在六个文件里，谁都能往对话里塞一条 say，
 * 而"塞进去"和"念出来"从来不是同一个动作。于是出现「屏幕上有话，但没有声音」。
 *
 * 判据（静态、可复跑）：
 *   对每个「产生 say 消息」的位置，看它附近（前后 25 行）有没有发声调用：
 *     · 直接：speak( / D.say( / D.line(
 *     · 间接：speakQueue(  （把一批消息排进语音队列）
 *   两者都没有 ⇒ 标记为 **没挂语音**。
 *
 * 用法：node tools/say-voice-audit.mjs [--all]
 *   --all 也打印已挂钩的行（默认只打印可疑的）
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'source/src';
const WINDOW = 25;
const showAll = process.argv.includes('--all');

// 产生 say 的写法（本仓库实际出现过的那几种）
const PRODUCE = [
  /k\s*:\s*["']say["']/g,
  /kind\s*:\s*["']say["']/g,
  /\bwho\s*:\s*[^,]{1,40},\s*k\s*:\s*["']say["']/g,
];
const HOOKS = [/[^.\w]speak\s*\(/, /\bD\.say\s*\(/, /\bD\.line\s*\(/, /\bspeakQueue\s*\(/];

const files = fs.readdirSync(SRC).filter(f => f.endsWith('.js'));
const rows = [];

for (const f of files) {
  const text = fs.readFileSync(path.join(SRC, f), 'utf8');
  const lines = text.split('\n');
  const hitLines = new Set();
  for (const re of PRODUCE) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      hitLines.add(text.slice(0, m.index).split('\n').length - 1); // 0-based
    }
  }
  for (const i of hitLines) {
    const from = Math.max(0, i - WINDOW), to = Math.min(lines.length - 1, i + WINDOW);
    let hook = null;
    for (let j = from; j <= to; j++) {
      if (HOOKS.some(re => re.test(lines[j]))) { hook = j + 1; break }
    }
    rows.push({ file: f, line: i + 1, hook, snippet: lines[i].trim().slice(0, 96) });
  }
}

const bad = rows.filter(r => !r.hook);
console.log(`scan ${files.length} files · say-producers ${rows.length} · 没挂语音 ${bad.length}`);
console.log('');
const byFile = {};
for (const r of (showAll ? rows : bad)) (byFile[r.file] = byFile[r.file] || []).push(r);
for (const f of Object.keys(byFile).sort()) {
  console.log(`== ${f}`);
  for (const r of byFile[f]) {
    console.log(`   L${String(r.line).padStart(4)} ${r.hook ? `hook@L${r.hook}` : '⚠ 无发声'}  ${r.snippet}`);
  }
}
if (!bad.length) console.log('（没有发现"没挂语音"的 say 产生点）');
process.exit(0);
