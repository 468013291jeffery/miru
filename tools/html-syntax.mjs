// Extract inline <script> blocks from a single-file HTML page and syntax-check each one.
//   node tools/html-syntax.mjs admin.html
// Prints one line per block: size + OK/FAIL. Exit 1 if any block fails to parse.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const file = process.argv[2];
if (!file) { console.error('usage: node tools/html-syntax.mjs <file.html>'); process.exit(2); }
const html = fs.readFileSync(file, 'utf8');
/* ⚠️ 2026-10-27：这个工具**切不开 index.html**，而且它给的是「语法错」这种最吓人的红。
   实测：index.html 里 `<script` 开标签 6 个、`</script>` 闭标签 2 个（`creator_embed.js` 把一整段
   别的页面的 HTML 当字符串塞进来了）⇒ 正则按「第一个 `</script>`」截断，截出来的那块 JS 当然
   `--check` 不过 ⇒ 报「1 block failed」。**那不是页面坏了，是尺子切不开它。**
   所以我加一道前置：开闭标签对不上就明确说「不适用」，而不是给一个假红。
   真要验 index.html 的 JS 有没有语法错，走浏览器：加载页面看 uncaught（0 就是 0）。 */
const nOpen = (html.match(/<script\b/gi) || []).length;
const nClose = (html.match(/<\/script>/gi) || []).length;
if (nOpen !== nClose) {
  console.error('✗ 不适用：' + file + ' 里 <script> 开标签 ' + nOpen + ' 个、</script> 闭标签 ' + nClose +
    ' 个 —— 这个文件把别的页面的 HTML 当字符串嵌进来了，正则切不干净。');
  console.error('  要验它的 JS：用浏览器加载页面看 uncaught（tools/…probe 或 headless --dump-dom）。');
  process.exit(2);
}
const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let m, i = 0, bad = 0, checked = 0;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'htmlsyn-'));
while ((m = re.exec(html))) {
  const attrs = m[1] || '', body = m[2] || '';
  if (/\bsrc\s*=/.test(attrs)) continue;          // external: nothing to parse here
  const type = (attrs.match(/\btype\s*=\s*["']([^"']+)["']/i) || [])[1];
  if (type && !/^(module|text\/javascript|application\/javascript)$/i.test(type)) continue; // x-template etc.
  if (!body.trim()) continue;
  i++;
  const p = path.join(tmp, 'block' + i + '.mjs');
  fs.writeFileSync(p, body, 'utf8');
  try {
    execFileSync(process.execPath, ['--check', p], { stdio: 'pipe' });
    checked++;
    console.log(`  block ${i}: ${body.length} chars  OK`);
  } catch (e) {
    bad++;
    const msg = String(e.stderr || e.message).split('\n').slice(0, 6).join('\n');
    console.log(`  block ${i}: ${body.length} chars  FAIL\n${msg}`);
  }
}
console.log(`${checked} block(s) parsed, ${bad} failed`);
process.exit(bad ? 1 : 0);
