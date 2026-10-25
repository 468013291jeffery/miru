// 「历史才 20 条」到底是多少内容：量字符、量轮数、量占 prompt 的比例
//
//   node tools/transcript-size.mjs            # 用 gala 一部剧本估
//   node tools/transcript-size.mjs afterhours
//
// 口径：一条消息 ≈ 一个 beat（模型一回 3–6 条 beat，所以 20 条 ≈ 4–6 轮）。
// 这里用**真实剧本文本长度**估，不拍脑袋。
import fs from 'node:fs';
import path from 'node:path';

const wid = process.argv[2] || 'gala';
const OUT = 'source/content/out';
const pack = fs.readdirSync(OUT).filter(f => /^s\d+\.json$/.test(f))
  .map(f => JSON.parse(fs.readFileSync(path.join(OUT, f), 'utf8'))).find(p => p.wid === wid);
if (!pack) { console.error('no pack ' + wid); process.exit(2); }

const zh = (v) => (!v ? '' : (typeof v === 'string' ? v : (v.zh || v.en || '')));
const est = (s) => { const cjk = (s.match(/[\u4e00-\u9fff]/g) || []).length; return Math.round(cjk / 1.5 + (s.length - cjk) / 4) };

// 剧本里每个 beat 的文本长度 = 模型输出一条消息的近似长度
const beatLens = [];
const choiceThenLens = [];
for (const ch of pack.chapters) {
  for (const b of (ch.beats.zh ? ch.beats.zh : ch.beats.en)) beatLens.push(String(b[2]).length);
  for (const c of ch.choices) for (const b of ((c.then.zh || c.then.en) || [])) choiceThenLens.push(String(b[2]).length);
}
const avg = (a) => Math.round(a.reduce((x, y) => x + y, 0) / a.length);
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)] };

console.log(`=== ${wid} · ${pack.chapters.length} 章 · cast ${pack.cast.length} ===`);
console.log(`剧本 beat 文本：平均 ${avg(beatLens)} 字 · 中位 ${med(beatLens)} 字（${beatLens.length} 条样本）`);
console.log(`选项后效文本：平均 ${avg(choiceThenLens)} 字（${choiceThenLens.length} 条）`);

const perBeat = avg(beatLens);
const beatsPerTurn = 4.5;                 // 模型一回 3–6 条，取中
const perTurnChars = Math.round(perBeat * beatsPerTurn + 40);  // + 玩家自己那句

for (const w of [20, 30, 40, 60]) {
  const chars = perTurnChars * (w / beatsPerTurn);
  const turns = Math.round(w / beatsPerTurn * 10) / 10;
  console.log(`  窗口 ${String(w).padStart(2)} 条 ⇒ ≈ ${turns} 轮对话 · ≈ ${Math.round(chars)} 字符 · ≈ ${est('x'.repeat(0) + '中'.repeat(chars))} tokens（中文按 1.5 字/token）`);
}

const turnsPerChapter = 18;               // 一章大约的轮数（剧本 8 章）
console.log(`\n一章按 ${turnsPerChapter} 轮算：20 条窗口只覆盖最近 ${(20 / beatsPerTurn).toFixed(1)} 轮 ≈ ${Math.round((20 / beatsPerTurn) / turnsPerChapter * 100)}% 的本章对话`);
console.log(`每章剧本自带 beat 约 ${avg(pack.chapters.map(c => (c.beats.zh || c.beats.en).length))} 条（这些不进窗口，靠 packPrompt 逐章给）`);
