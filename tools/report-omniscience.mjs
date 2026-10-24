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
const only = process.argv.slice(2).find(a => !a.startsWith('--'));

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

// --present: 用「旁档里声明的在场名单」再算一遍，和「从 beats 反推」并排看。
// 两者应当接近；差出来的那部分，正好是「pov 也算全知」和「作者把沉默但真在场的人补上」两个来源。
const USE_PRESENT = process.argv.includes('--present');
const PRESENT_DIR = 'source/content/present';
const declared = (wid) => {
  const f = path.join(PRESENT_DIR, wid + '.json');
  if (!fs.existsSync(f)) return null;
  try { const j = JSON.parse(fs.readFileSync(f, 'utf8')); return Array.isArray(j.chapters) ? j.chapters : null; } catch (_) { return null; }
};

for (const p of packs) {
  const dec = USE_PRESENT ? declared(p.wid) : null;
  if (!dec) continue;
  const cast = (p.cast || []).map(c => c.id);
  let total = 0, wrong = 0;
  (p.chapters || []).forEach((ch, i) => {
    let n = ((ch.beats && ch.beats.en) || []).length;
    for (const c of (ch.choices || [])) n += ((c.then && c.then.en) || []).length;
    total += n;
    const pres = new Set(dec[i] || []);
    for (const c of cast) if (!pres.has(c)) wrong += n;
  });
  const r = rows.find(x => x.wid === p.wid);
  if (r) { r.declaredShare = +(wrong / (cast.length * total || 1)).toFixed(3); r.hasPresent = true; }
}

rows.sort((a, b) => b.wrongShare - a.wrongShare);
console.log('wid        cast  msgs  推导%  声明%   最严重的角色（不在场却会读到的条数 / 在第几章）');
for (const r of rows) {
  const worst = r.perChar.slice().sort((a, b) => b.wrong - a.wrong)[0];
  console.log(
    String(r.wid).padEnd(11) +
    String(r.cast).padStart(3) +
    String(r.msgs).padStart(7) +
    String((r.wrongShare * 100).toFixed(0) + '%').padStart(7) +
    (r.hasPresent ? String((r.declaredShare * 100).toFixed(0) + '%').padStart(7) : '      —') + '   ' +
    (worst && worst.wrong ? `${worst.c}  ${worst.wrong} 条  章${worst.chapters.join(',')}` : '—')
  );
}
const avg = rows.reduce((a, b) => a + b.wrongShare, 0) / rows.length;
console.log(`\n${rows.length} 部 · 平均错见占比 ${(avg * 100).toFixed(1)}%`);
console.log('读法：这个百分比是「角色能读到的台词里，有多大比例发生在他不在场的章节」。');
console.log('      它不是 runtime 读数——present 字段还不存在（SPEC-AUDIT #8），这是从内容反推的上界。');

// ---- 自证：两条路径必须是两个读数，不是同一个计算 ----
// 声明列由旁档决定，推导列由 beats 决定。往旁档里**塞一个本来缺席的人**，
// 声明列必须动、推导列必须不动；两边一起动就说明我其实只测了一遍。
if (process.argv.includes('--selftest')) {
  const wid = rows.find(r => r.hasPresent) ? rows.find(r => r.hasPresent).wid : null;
  if (!wid) { console.log('SELFTEST: 没有带旁档的剧本，无法自证'); process.exit(1); }
  const p = packs.find(x => x.wid === wid);
  const dec = declared(wid).map(a => a.slice());
  const cast = p.cast.map(c => c.id);
  const absent = cast.find(c => !dec[0].includes(c));   // 第 1 章不在场的人，够用了
  if (!absent) { console.log('SELFTEST: 这个剧本没有缺席角色，换一部'); process.exit(1); }
  for (const list of dec) if (!list.includes(absent)) list.push(absent);   // 假设他每章都在
  let total = 0, wrong = 0;
  (p.chapters || []).forEach((ch, i) => {
    let n = ((ch.beats && ch.beats.en) || []).length;
    for (const c of (ch.choices || [])) n += ((c.then && c.then.en) || []).length;
    total += n; const pres = new Set(dec[i] || []);
    for (const c of cast) if (!pres.has(c)) wrong += n;
  });
  const before = rows.find(r => r.wid === wid).declaredShare;
  const after = +(wrong / (cast.length * total || 1)).toFixed(3);
  const ok = after < before;
  console.log(`  · 变异（把 ${absent} 塞进每章在场）：声明 ${(before * 100).toFixed(0)}% → ${(after * 100).toFixed(0)}%  ${ok ? '已动 ✓' : '没动 ✗'}`);
  if (!ok) { console.log('SELFTEST FAILED: 声明列没有跟着旁档变，说明它不是独立读数'); process.exit(1); }
}
