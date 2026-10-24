// 首轮回复要多久：**首字延迟（TTFT）**与**整段完成**各是多少
//
//   node tools/latency-probe.mjs            # 一次调用，流式，量 TTFT + 总时长
//   node tools/latency-probe.mjs --n=3      # 跑三次看抖动
//
// 为什么要分两个数：玩家感知的是**首字**，而 MIRU 的聊天路径现在是**非流式**（ask() 没传 onText），
// 所以玩家等的是**整段**。这两个数差多少，就是"改成流式"能省多少。
//
// ⚠️ 这是**代理量**：走 opencode 的测试 key，不是他们的 LongCat/SCNet。
//    只用来回答「同尺寸请求在正常网络下的量级」，不能当他们的生产延迟。
import fs from 'node:fs';

const args = process.argv.slice(2);
const n = Number((args.find(a => a.startsWith('--n=')) || '--n=1').split('=')[1]) || 1;
const model = (args.find(a => a.startsWith('--model=')) || '--model=glm-5.3-flash').split('=')[1];
const maxtok = Number((args.find(a => a.startsWith('--maxtokens=')) || '--maxtokens=1200').split('=')[1]);

const KEY = (() => {
  if (process.env.OPENCODE_API_KEY) return process.env.OPENCODE_API_KEY;
  try {
    const home = process.env.USERPROFILE || process.env.HOME || '';
    const line = fs.readFileSync(home + '/.dsh/.credentials.yaml', 'utf8').split(/\r?\n/).find(l => /^\s*OPENCODE_API_KEY\s*:/.test(l));
    if (line) return line.replace(/^\s*OPENCODE_API_KEY\s*:\s*/, '').trim().replace(/^['"]|['"]$/g, '');
  } catch (_) {}
  return '';
})();
if (!KEY) { console.error('没有 key'); process.exit(2); }

// 模仿 MIRU 一次回合的形状：较长的中文指令 + 要求结构化 JSON 输出
const PROMPT = [
  'You write MIRU, an interactive romance story app. Reply with ONLY JSON.',
  'Cast: jack (guarded, sharp), mason (blunt, territorial), ethan (warm, calculating), brody (golden retriever energy), ezra (precise).',
  'Scene: an awards dinner, one chair marked 支持, nine blank place cards, the flow sheet is twelve minutes late.',
  'Write the next beat: 3-6 beats, each under 32 words; every speaker must be from the cast; end on something the player can answer.',
  '{"beats":[{"who":"id","kind":"say|act|think","text":"..."}],"suggest":["...","...","..."]}',
].join('\n');

async function once(i) {
  const t0 = Date.now();
  let ttft = null, chunks = 0, text = '';
  const res = await fetch('https://opencode.ai/inference/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + KEY },
    body: JSON.stringify({ model, messages: [{ role: 'user', content: PROMPT }], temperature: 0.7, max_tokens: maxtok, stream: true }),
  });
  if (!res.ok) { console.log('  HTTP ' + res.status + ' ' + (await res.text()).slice(0, 160)); return null }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let idx;
    while ((idx = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, idx).trim();
      buf = buf.slice(idx + 1);
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') continue;
      try {
        const j = JSON.parse(data);
        const d = j.choices && j.choices[0] && j.choices[0].delta;
        const piece = d && (d.content || d.reasoning_content);
        if (piece) { if (ttft === null) ttft = Date.now() - t0; chunks++; text += piece }
      } catch (_) {}
    }
  }
  const total = Date.now() - t0;
  console.log(`  第 ${i} 次：首字 ${ttft === null ? '—' : ttft + ' ms'} · 完成 ${total} ms · 片段 ${chunks} · 输出约 ${text.length} 字`);
  return { ttft, total };
}

console.log(`模型 ${model} · max_tokens ${maxtok} · 跑 ${n} 次（流式，量首字与整段）`);
const runs = [];
for (let i = 1; i <= n; i++) { const r = await once(i); if (r) runs.push(r) }
if (runs.length) {
  const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)] };
  const t = runs.map(r => r.ttft).filter(v => v !== null);
  console.log(`\n中位：首字 ${med(t) ?? '—'} ms · 完成 ${med(runs.map(r => r.total))} ms`);
  if (t.length) console.log(`⇒ 非流式（MIRU 现状）玩家等 ${med(runs.map(r => r.total))} ms；流式（首字出现）只要 ${med(t)} ms —— 差 ${(med(runs.map(r => r.total)) / med(t)).toFixed(1)}×`);
}
