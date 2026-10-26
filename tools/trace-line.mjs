// 判「那句‘保护’是剧本照念，还是模型现写的」——看存档里这条消息的来路
//
//   node tools/trace-line.mjs 保护          # 找含有这个词的消息
//   node tools/trace-line.mjs --tail 20      # 只看最后 20 条
//
// 判据：
//   · 剧本 beat 走 pkAppend → 落成 k:"box"（旁白/合并块）或 who 是角色但没有 ai:1
//   · 模型回复走 reply → 每条带 ai:1
//   · 再看它在时间线上是不是**紧接着你自己的话**立刻出现（照念）还是间隔一段（回应）
import fs from 'node:fs';

const args = process.argv.slice(2);
const word = args.find(a => !a.startsWith('--'));
const tailN = Number((args.find(a => a.startsWith('--tail')) || '').split(/[= ]/)[1] || 0);

const S = JSON.parse(fs.readFileSync('.browser-save.json', 'utf8'));
const threads = S.threads || {};
let printed = 0;

for (const id of Object.keys(threads)) {
  const th = threads[id];
  const msgs = th.msgs || [];
  if (!msgs.length) continue;

  const idxs = [];
  if (tailN) { for (let i = Math.max(0, msgs.length - tailN); i < msgs.length; i++) idxs.push(i) }
  else if (word) { msgs.forEach((m, i) => { if (String(m.txt || '').includes(word)) idxs.push(i) }) }
  if (!idxs.length) continue;

  console.log(`\n=== ${id} · 共 ${msgs.length} 条 ===`);
  for (const i of idxs) {
    const m = msgs[i];
    const prev = msgs[i - 1] || {};
    const gap = (m.at && prev.at) ? ((m.at - prev.at) / 1000).toFixed(1) + 's' : '—';
    const src = m.k === 'box' ? '剧本块'
      : (m.ai ? '模型' : (m.who === 'me' ? '我' : (m.who === 'sys' ? '系统' : '剧本')));
    const who = m.who === 'me' ? '我' : m.who === 'n' ? '旁白' : m.who === 'sys' ? '·' : m.who;
    console.log(`  [${i}] +${gap} ${who} · ${src} · k=${m.k || 'say'}`);
    console.log(`      ${String(m.txt || '').replace(/\n/g, ' ').slice(0, 200)}`);
  }
  printed++;
  if (printed >= 2) break;
}

if (!printed) console.log('没找到匹配的消息');
