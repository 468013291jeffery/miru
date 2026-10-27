// 加载顺序闸（2026-10-27）：状态机模块必须在**它们的绑定调用点**之前出现。
// 踩过的坑：模块排在最后 ⇒ bind 那一刻 window.TURN 还不存在 ⇒ 绑定被跳过 ⇒
// 模块整个形同虚设，而"字符串在不在"这类检查照样全绿。
import fs from 'node:fs';

const h = fs.readFileSync('index.html', 'utf8');
const at = (s) => h.indexOf(s);

const pairs = [
  { name: 'TURN',   mod: 'window.TURN =',  use: 'TURN.bind(function' },
  { name: 'PKST',   mod: 'window.PKST =',  use: 'PKST.bind(function' },
];

let pass = 0, fail = 0;
for (const p of pairs) {
  const a = at(p.mod), b = at(p.use);
  const ok = a >= 0 && b > a;
  console.log('  ' + (ok ? '✓' : '✗') + ' ' + p.name + ' 模块(' + a + ') 早于绑定点(' + b + ')');
  ok ? pass++ : fail++;
}
console.log('\n' + pass + ' passed, ' + fail + ' failed');
if (fail) { console.log('FAILED: 状态机加载顺序不对 —— 绑定会被跳过'); process.exit(1) }
console.log('wiring order OK');
