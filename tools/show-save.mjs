// 读导出的存档，把「我刚玩的那一局」折成能读的流程
//
//   node tools/show-save.mjs                 # 读 .browser-save.json
//   node tools/show-save.mjs --file=x.json --full
import fs from 'node:fs';

const args = process.argv.slice(2);
const opt = (k, d) => { const a = args.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=').slice(1).join('=') : d };
const FILE = opt('file', '.browser-save.json');
const FULL = args.includes('--full');

const S = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const threads = S.threads || {};
const ids = Object.keys(threads);
console.log(`存档 ${(fs.statSync(FILE).size / 1024).toFixed(0)} KB · 线程 ${ids.length} 个`);
console.log(`顶栏：authChoice=${S.authChoice || '—'} · ob=${S.ob} · lang=${S.lang} · heat=${S.heat || '—'}\n`);

for (const id of ids) {
  const th = threads[id];
  const msgs = th.msgs || [];
  const me = msgs.filter(m => m.who === 'me');
  const mineThink = me.filter(m => m.k === 'think').length;
  const mineAct = me.filter(m => m.k === 'act').length;
  const mineSay = me.length - mineThink - mineAct;
  const typed = me.filter(m => m.typed).length;
  const react = msgs.filter(m => m.k === 'react').length;
  console.log(`=== ${id} · kind=${th.kind || '?'} · ${msgs.length} 条 · rounds=${th.rounds || 0} ===`);
  console.log(`  我说的：${me.length} 条（说 ${mineSay} · 动作 ${mineAct} · 内心 ${mineThink}）· 其中手打 ${typed} 条`);
  console.log(`  他说的：${msgs.length - me.length} 条 · 其中 reaction ${react} 条`);
  if (th.sugg && th.sugg.length) console.log(`  最后一组选项还在（说明没被点掉）：${JSON.stringify(th.sugg)}`);
  console.log('');
  const show = FULL ? msgs : msgs.slice(-24);
  if (!FULL && msgs.length > 24) console.log(`  …（前面 ${msgs.length - 24} 条省略，--full 看全部）`);
  for (const m of show) {
    const who = m.who === 'me' ? '我' : m.who === 'n' ? '旁白' : m.who === 'sys' ? '·' : m.who;
    const k = m.k === 'think' ? '（内心）' : m.k === 'act' ? '（动作）' : m.k === 'react' ? '（反应）' : m.k === 'card' ? '（卡片）' : '';
    const tag = m.typed ? ' [手打]' : '';
    console.log(`  ${who}${k}${tag}: ${String(m.txt || '').replace(/\n/g, ' ').slice(0, 220)}`);
  }
  console.log('');
}
