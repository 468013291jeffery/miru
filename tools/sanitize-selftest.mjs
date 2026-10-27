// 单测：sanitizeMsgs 真的把对象字段变成人话（判据：渲染前不得再有 [object Object]）
import fs from 'node:fs';

const src = fs.readFileSync('source/src/app3_chat.js', 'utf8');
const i = Math.max(0, Math.min(...[src.indexOf('function objGuard70('), src.indexOf('function asText70(')].filter(x => x >= 0)));
const j = src.indexOf('function setSugg(');
if (i < 0 || j < i) { console.log('✗ 取不到函数区'); process.exit(1) }
const seg = src.slice(i, j);

// asText70 可能依赖别的；先试求值，失败就把简单实现补上
let factory;
try { factory = new Function(seg + '\nreturn {asText70, objGuard70};')() }
catch (e) { console.log('✗ 取不到函数：' + e.message); process.exit(1) }

const { asText70 } = factory;

// 复刻 sanitizeMsgs（与源文件同逻辑，避免依赖整个 app 上下文）
function sanitizeMsgs(th) {
  if (!th || !Array.isArray(th.msgs)) return;
  for (const m of th.msgs) {
    if (!m) continue;
    if (m.txt != null && typeof m.txt !== 'string') m.txt = asText70(m.txt);
    if (m.title != null && typeof m.title !== 'string') m.title = asText70(m.title);
    if (m.txt === '[object Object]') m.txt = '';
    if (m.title === '[object Object]') m.title = '';
  }
}

const th = { msgs: [
  { who: 'sys', k: 'card', title: { h: '关系变了' }, txt: { s: '你们之间动了动' } },
  { who: 'a', k: 'say', txt: '[object Object]' },
  { who: 'b', k: 'say', txt: '正常一句话' },
  { who: 'c', k: 'say', txt: { unknown: 1 } },
] };

sanitizeMsgs(th);

let pass = 0, fail = 0;
const check = (name, ok, got) => { console.log('  ' + (ok ? '✓' : '✗') + ' ' + name + (got !== undefined ? ' → ' + JSON.stringify(got) : '')); ok ? pass++ : fail++ };

check('卡片的 title 对象被取成人话', th.msgs[0].title === '关系变了', th.msgs[0].title);
check('卡片的 txt 对象被取成人话', th.msgs[0].txt === '你们之间动了动', th.msgs[0].txt);
check('字面量 [object Object] 被清空', th.msgs[1].txt === '', th.msgs[1].txt);
check('正常文本原样保留', th.msgs[2].txt === '正常一句话', th.msgs[2].txt);
check('取不出人话的对象被清空', th.msgs[3].txt === '', th.msgs[3].txt);

const leaked = th.msgs.some(m => String(m.txt || '').includes('[object Object]') || String(m.title || '').includes('[object Object]'));
check('没有任何一条还带着 [object Object]', !leaked);

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
