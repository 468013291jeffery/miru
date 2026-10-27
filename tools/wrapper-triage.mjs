// 给剩下的 renderChat 包装分类：哪些能机械搬、哪些必须先读
// 判据（都可数）：
//   机械可搬 = body 不含 await、不定义函数、不 return 值、且只做「查 DOM 后插入/更新」
//   需先读   = 含 await / 改 S 或 th / 调用了非幂等函数（开始/停止某物）/ body > 600 字符
import fs from 'node:fs';

const files = fs.readdirSync('source/src').filter(f => f.endsWith('.js'));
const re = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*renderChat\s*;\s*renderChat\s*=\s*function\s*\([^)]*\)\s*\{/;
const rows = [];

for (const f of files) {
  const t = fs.readFileSync('source/src/' + f, 'utf8');
  const m = re.exec(t);
  if (!m) continue;
  if (/UI\.add\(/.test(t)) continue;             // 已搬
  const open = m.index + m[0].length;
  let d = 1, j = open;
  while (j < t.length && d > 0) { const c = t[j]; if (c === '{') d++; else if (c === '}') d--; j++ }
  const body = t.slice(open, j - 1).trim();

  const flags = [];
  if (/\bawait\b/.test(body)) flags.push('await');
  if (/\breturn\s+r\b/.test(body)) flags.push('return-r');
  if (/\b(th|S)\.[\w.]+\s*=/.test(body)) flags.push('写状态');
  if (/(start|stop|play|init|load|fetch|capi|ask)\s*\(/.test(body)) flags.push('副作用调用');
  if (body.length > 600) flags.push('体量大');
  if (/insertAdjacentHTML|appendChild|innerHTML/.test(body)) flags.push('动DOM');

  rows.push({ file: f, chars: body.length, flags, mech: flags.filter(x => ['await', '写状态', '副作用调用', '体量大'].includes(x)).length === 0 });
}

rows.sort((a, b) => a.chars - b.chars);
console.log('=== 剩下的 renderChat 包装 ===\n');
console.log('可机械搬（先搬这些）：');
rows.filter(r => r.mech).forEach(r => console.log('  ' + r.file.padEnd(24) + String(r.chars).padStart(5) + ' 字符  ' + r.flags.join('/')));
console.log('\n需要先读再动：');
rows.filter(r => !r.mech).forEach(r => console.log('  ' + r.file.padEnd(24) + String(r.chars).padStart(5) + ' 字符  ' + r.flags.join('/')));
console.log('\n合计 ' + rows.length + ' 处 · 机械可搬 ' + rows.filter(r => r.mech).length + ' · 需先读 ' + rows.filter(r => !r.mech).length);
