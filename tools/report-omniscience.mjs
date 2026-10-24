// 「角色全知」有多大 —— 用真实剧本量，不靠感觉。
//
//   node tools/report-omniscience.mjs            # 全部 37 部
//   node tools/report-omniscience.mjs dog        # 只看某一部
//
// 口径（先说清，否则数没法读）：
//   · 「在场」= 这一章里**出现过**的角色（出现在 beats 或任一选项的 then 里）
//     这是从内容反推的近似，不是 runtime 的 present 字段——因为那个字段还不存在
//     （SPEC-AUDIT #8）。它只用来给「过滤应该做多大」一个量级。
//   · 「错见」= 某角色**不在场的那一章**里的消息条数。现在它们全都进了同一个
//     transcript，所以这个数就是「他会读到多少本不该知道的对话」。
//   · 一句 = beats 里的一条（en 侧）。中文侧条数相同（validate.py 会拦）。
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'source/content/out';
const only = process.argv[2];

const packs = fs.readdirSync(ROOT).filter(f => /^s\d+\.json$/.test(f))
  .map(f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')))
  .filter(p => !only || p.wid === only);

if (!packs.length) { console.error('no pack matched: ' + only); process.exit(2); }

const rows = [];
for (const p of packs) {
  const cast = (p.cast || []).map(c => c.id);
  const perChar = Object.fromEntries(cast.map(c => [c, { seen: 0, wrong: 0, chapters: [] }]));
  let total = 0;

  (p.chapters || []).forEach((ch, i) => {
    const msgs = [];
    for (const b of ((ch.beats && ch.beats.en) || [])) msgs.push(b[0]);
    const present = new Set(msgs.filter(w => w !== 'n'));
    for (const c of (ch.choices || [])) {
      for (const b of ((c.then && c.then.en) || [])) { msgs.push(b[0]); if (b[0] !== 'n') present.add(b[0]); }
    }
    total += msgs.length;
    for (const c of cast) {
      if (present.has(c)) perChar[c].seen += msgs.length;
      else { perChar[c].wrong += msgs.length; perChar[c].chapters.push(i + 1); }
    }
  });

  const wrong = Object.values(perChar).reduce((a, b) => a + b.wrong, 0);
  const cap = cast.length * total || 1;
  rows.push({
    wid: p.wid, kind: p.kind, cast: cast.length, msgs: total,
    wrongShare: +(wrong / cap).toFixed(3),
    perChar: cast.map(c => ({ c, ...perChar[c] })),
  });
}

rows.sort((a, b) => b.wrongShare - a.wrongShare);
console.log('wid        cast  msgs  错见占比   最严重的角色（不在场却会读到的条数 / 在第几章）');
for (const r of rows) {
  const worst = r.perChar.slice().sort((a, b) => b.wrong - a.wrong)[0];
  console.log(
    String(r.wid).padEnd(11) +
    String(r.cast).padStart(3) +
    String(r.msgs).padStart(7) +
    String((r.wrongShare * 100).toFixed(0) + '%').padStart(9) + '   ' +
    (worst && worst.wrong ? `${worst.c}  ${worst.wrong} 条  章${worst.chapters.join(',')}` : '—')
  );
}
const avg = rows.reduce((a, b) => a + b.wrongShare, 0) / rows.length;
console.log(`\n${rows.length} 部 · 平均错见占比 ${(avg * 100).toFixed(1)}%`);
console.log('读法：这个百分比是「角色能读到的台词里，有多大比例发生在他不在场的章节」。');
console.log('      它不是 runtime 读数——present 字段还不存在（SPEC-AUDIT #8），这是从内容反推的上界。');
