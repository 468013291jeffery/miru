// 生成「每幕在场名单」旁档：source/content/present/<wid>.json
//
//   node tools/derive-present.mjs s18          # 也可以直接给 wid: gala
//   node tools/derive-present.mjs --all        # 只给 8 部多人本（缺口 > 0 的那些）
//
// 口径（先写死，免得以后争议）：
//   present = 这一章里**开口过**的角色 ∪ pov
//   · 「开口」从 beats / 各选项 then 的 who 反推——这是内容里唯一可用的信号；
//   · pov 永远在场（他是镜头），否则每章都会把视角人物判成"不在场"。
// 这个文件是**机器推导的初稿**（"derived": true）。作者改一手、把 derived 改成 false，
// 就表示"这份是审过的"。运行时只读它，不读推导逻辑。
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'source/content/out';
const DIR = 'source/content/present';
const arg = process.argv[2];

const files = fs.readdirSync(OUT).filter(f => /^s\d+\.json$/.test(f));
const packs = files.map(f => ({ f, p: JSON.parse(fs.readFileSync(path.join(OUT, f), 'utf8')) }));

const gaps = wid => {
  const { p } = packs.find(x => x.p.wid === wid) || {};
  if (!p) return -1;
  const cast = p.cast.map(c => c.id);
  let wrong = 0, cap = 0;
  (p.chapters || []).forEach(ch => {
    const sp = new Set();
    for (const b of (ch.beats.en || [])) if (b[0] !== 'n') sp.add(b[0]);
    for (const c of (ch.choices || [])) for (const b of ((c.then && c.then.en) || [])) if (b[0] !== 'n') sp.add(b[0]);
    let n = (ch.beats.en || []).length;
    for (const c of (ch.choices || [])) n += ((c.then && c.then.en) || []).length;
    cap += cast.length * n;
    for (const c of cast) if (!sp.has(c) && c !== p.pov) wrong += n;
  });
  // 除掉了 pov 之后的近似比（pov 是镜头，不该算错见）
  return cap ? wrong / cap : 0;
};

let targets;
if (arg === '--all') {
  targets = packs.map(x => x.p.wid).filter(w => gaps(w) > 0.001);
} else if (arg) {
  const hit = packs.find(x => x.p.wid === arg || x.f === arg + '.json' || x.f === arg);
  if (!hit) { console.error('no pack: ' + arg); process.exit(2); }
  targets = [hit.p.wid];
} else {
  console.error('usage: node tools/derive-present.mjs <wid|sNN> | --all');
  process.exit(2);
}

fs.mkdirSync(DIR, { recursive: true });
for (const wid of targets) {
  const p = packs.find(x => x.p.wid === wid).p;
  const chapters = (p.chapters || []).map((ch, i) => {
    const sp = new Set([p.pov]);
    for (const b of (ch.beats.en || [])) if (b[0] !== 'n' && b[0] !== 'you') sp.add(b[0]);
    for (const c of (ch.choices || [])) for (const b of ((c.then && c.then.en) || [])) if (b[0] !== 'n' && b[0] !== 'you') sp.add(b[0]);
    const cast = p.cast.map(x => x.id);
    const ids = cast.filter(id => sp.has(id));           // 只保留真是 cast 里的人，且按 cast 顺序
    return ids;
  });
  const out = { wid, derived: true, note: '机器推导：本章开口过的角色 ∪ pov。作者审过之后把 derived 改成 false。', chapters };
  fs.writeFileSync(path.join(DIR, wid + '.json'), JSON.stringify(out, null, 1) + '\n', 'utf8');

  console.log(`\n${wid}   cast=${p.cast.length}  推导缺口=${(gaps(wid) * 100).toFixed(1)}%`);
  chapters.forEach((ids, i) => {
    const absent = p.cast.map(c => c.id).filter(id => !ids.includes(id));
    console.log(`  ch${i + 1}  在场 ${String(ids.length).padStart(2)}  ${absent.length ? '缺席: ' + absent.join(',') : ''}`);
  });
}
console.log(`\n写成 ${targets.length} 个旁档 → ${DIR}/`);
