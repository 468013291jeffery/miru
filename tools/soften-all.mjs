// 一次性把「整行形状」的空 catch 全部换成 soft()，每个文件改完立刻做语法检查；
// 任一文件语法不过就把它回滚并报出来（不猜、不留半成品）。
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const SRC = 'source/src';
const files = fs.readdirSync(SRC).filter(f => f.endsWith('.js'));
const WHOLE = /^try\{[\s\S]*\}catch(\([^)]*\))?\{\}$/;

const changed = [], reverted = [];

for (const f of files) {
  if (f === 'app3_chat.js') continue;                    // 已经做过
  const P = SRC + '/' + f;
  const orig = fs.readFileSync(P, 'utf8');
  const lines = orig.split('\n');
  let n = 0;
  const base = f.replace(/\.js$/, '');

  for (let i = 0; i < lines.length; i++) {
    const s = lines[i].trim();
    if (!WHOLE.test(s)) continue;
    const m = /^try\{([\s\S]*)\}catch(\([^)]*\))?\{\}$/.exec(s);
    if (!m) continue;
    const indent = lines[i].slice(0, lines[i].length - lines[i].trimStart().length);
    lines[i] = indent + 'soft("' + base + ':L' + (i + 1) + '",function(){' + m[1] + '});';
    n++;
  }
  if (!n) continue;

  fs.writeFileSync(P, lines.join('\n'), 'utf8');
  let ok = true;
  try { execFileSync(process.execPath, ['--check', P], { stdio: 'pipe' }) } catch (e) { ok = false }
  if (ok) changed.push(f + '×' + n);
  else { fs.writeFileSync(P, orig, 'utf8'); reverted.push(f + '×' + n) }
}

console.log('改好：' + (changed.join(' · ') || '（无）'));
if (reverted.length) console.log('回滚（语法不过）：' + reverted.join(' · '));
