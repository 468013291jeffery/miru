// 章节状态机闸（第四件收口）
//   ① 状态机模块在产物里
//   ② 写入者已注册（PKST.bind）
//   ③ 除「状态机内部 + bind」外，不再有直接赋值 pk.st="…"
// 变异：删掉 bind ⇒ 必须红；制造一处直接赋值 ⇒ 必须红。
import fs from 'node:fs';
import path from 'node:path';

const h = fs.readFileSync('index.html', 'utf8');
let pass = 0, fail = 0;
const t = (name, ok, extra) => { console.log('  ' + (ok ? '✓' : '✗') + ' ' + name + (extra ? ' — ' + extra : '')); ok ? pass++ : fail++ };

t('状态机模块在产物里', /window\.PKST\s*=/.test(h));
t('写入者已注册', /PKST\.bind\(function/.test(h));
t('迁移表存在四个状态', ['busy', 'choose', 'next', 'end'].every(s => new RegExp('\\b' + s + '\\s*:').test(h)));

// ③ 直接赋值审计：允许的只有 app104 内部与 bind 那一行
const SRC = 'source/src';
const ALLOW = new Set(['app104_pkstate.js']);
const offenders = [];
for (const f of fs.readdirSync(SRC).filter(x => x.endsWith('.js'))) {
  if (ALLOW.has(f)) continue;
  const lines = fs.readFileSync(path.join(SRC, f), 'utf8').split('\n');
  lines.forEach((ln, i) => {
    if (/pk\.st\s*=\s*["']/.test(ln) && !/PKST\.bind/.test(ln)) offenders.push(f + ':' + (i + 1) + '  ' + ln.trim().slice(0, 90));
  });
}
t('没有绕过状态机的直接赋值', offenders.length === 0, offenders.length ? offenders.slice(0, 5).join(' | ') : '');

console.log('\n' + pass + ' passed, ' + fail + ' failed');
if (fail) { console.log('FAILED: 章节状态机接线不完整'); process.exit(1) }
console.log('pkstate OK');
