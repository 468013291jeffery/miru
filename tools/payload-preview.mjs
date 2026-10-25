// 每人一份 payload 的**草稿预览**（不动运行时，只为了眼看一遍形状）
//
//   node tools/payload-preview.mjs gala 5 mason      # 给第 5 章的 mason 生成一份
//   node tools/payload-preview.mjs gala 3 mason      # 第 3 章（他不在场）——看少掉什么
//   node tools/payload-preview.mjs --sizes gala      # 只报每章每人的体量对比
//
// 这一份是**近似**：卡片的排版照 castCardPublic / castCard 的语义复刻，
// 语气规则之类用占位行代替。目的不是发出去，是让作者与工程看形状对不对。
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'source/content/out';
const PRESENT = 'source/content/present';

const arg = process.argv.slice(2).filter(a => !a.startsWith('--'));
const SIZES = process.argv.includes('--sizes');

const packs = fs.readdirSync(OUT).filter(f => /^s\d+\.json$/.test(f))
  .map(f => JSON.parse(fs.readFileSync(path.join(OUT, f), 'utf8')));
const wid = arg[0] || 'gala';
const pack = packs.find(p => p.wid === wid);
if (!pack) { console.error('no pack: ' + wid); process.exit(2); }

let present = null;
const pf = path.join(PRESENT, wid + '.json');
if (fs.existsSync(pf)) present = JSON.parse(fs.readFileSync(pf, 'utf8')).chapters;


// ---- 真实角色表（source/src/content_chars.js 的 const C={...}） ----
const CHARS_ALL = (() => {
  try {
    const src = fs.readFileSync('source/src/content_chars.js', 'utf8');
    const i = src.indexOf('const C={');
    if (i < 0) return {};
    const body = src.slice(i + 'const C='.length, src.lastIndexOf('};') + 1);
    const T = (en, zh) => ({ en, zh });
    return new Function('T', 'return ' + body + ';')(T);
  } catch (e) { return {}; }
})();

const chars = {};
for (const c of pack.cast) chars[c.id] = Object.assign({ id: c.id }, CHARS_ALL[c.id] || {});

// 角色卡的可见信息来自全局角色表；这份预览里只有 pack 自带的 au_role，其余用占位
const zh = (v) => (!v ? '' : (typeof v === 'string' ? v : (v.zh || v.en || '')));
const cardOf = (id, priv) => {
  const c = chars[id] || {};
  const au = (pack.pack && pack.pack.au && pack.pack.au[id]) || null;
  const looks = zh(c.looks) || '(外貌缺)';
  const vibe = zh(c.vibe) || '(气质缺)';
  const lines = [`- id=${id} · ${id}${au ? ' · in this story: ' + (au.zh || au.en) : ''}. Looks: ${looks} Personality: ${vibe}`];
  if (priv) lines.push(`  Contradiction: ${zh(c.twist) || "(无)"}  Secret (hint only): ${zh(c.secret) || "(无)"}`);
  lines.push(`  Closeness to you: ?/100 (stage: ?). Current mood: ?`);
  return lines.join('\n');
};

const beatsOf = (ch, k) => {
  const out = [];
  for (const b of ((ch.beats && ch.beats.zh) || ch.beats.en || [])) out.push(b);
  const c = (ch.choices || []).find(x => x.k === k);
  if (c) for (const b of ((c.then && (c.then.zh || c.then.en)) || [])) out.push(b);
  return out;
};

const sizeOf = (parts) => parts.join('\n').length;

function build(who, chIdx) {
  const ch = pack.chapters[chIdx];
  const preset = present ? (present[chIdx] || []) : pack.cast.map(c => c.id);
  const inScene = preset.includes(who);
  const sp = preset.slice();
  // 私密面：这一拍上场的人里第一个（真运行时是 mainOf）
  const lead = who;   // 这一份就是写给他的：私密面归他，不是名单第一个

  const parts = [];
  parts.push('You write MIRU, an interactive romance story app for adult readers. (语气/规则略)');
  parts.push('STORY: ' + (pack.logline?.zh || pack.logline?.en || wid));
  parts.push("THE USER'S ROLE: " + (pack.you?.zh || pack.you?.en || ''));
  parts.push("WHAT'S AT STAKE: " + (pack.stakes?.zh || pack.stakes?.en || ''));
  parts.push('STATUS: ' + ((ch.time && (ch.time.zh || ch.time.en)) || '') + ' · ' + ((ch.place && (ch.place.zh || ch.place.en)) || ''));
  parts.push('THIS SCENE: ' + (inScene ? who + ' 在场' : '**' + who + ' 不在场**') + ' · 在场的人：' + (sp.join(', ') || '（空）'));
  parts.push('CAST (only these ids may speak):');
  for (const id of sp) parts.push(cardOf(id, id === lead));
  // 注：真运行时（单 prompt）用 mainOf 决定谁是 lead；每人一份时 lead 必须等于 who。
  const seen = [];
  pack.chapters.forEach((c, i) => {
    if (!present || (present[i] || []).includes(who)) for (const b of beatsOf(c, 'A')) seen.push(b);
  });
  parts.push('MEMORIES: ' + (seen.slice(0, 3).map(b => '· ' + String(b[2]).slice(0, 60)).join('\n          ') || '（无）'));
  parts.push('STORY SO FAR (only what ' + who + ' was present for):\n' +
    seen.slice(-6).map(b => (b[0] === 'n' ? '  ' : b[0] + ': ') + String(b[2]).slice(0, 90)).join('\n'));
  parts.push('NOW: （玩家刚说的话 + 这一拍的目标）');
  parts.push('HEAT CEILING — ' + String(pack.heat || 'slow').toUpperCase() + ': (略)');
  parts.push('LANGUAGE: 中文。Reply with ONLY this JSON.');
  return parts;
}

if (SIZES) {
  console.log('每章「每人一份」的体量（字符数）\n');
  console.log('  章   在场   共享版   该角色版   差');
  pack.chapters.forEach((ch, i) => {
    const preset = present ? (present[i] || []) : pack.cast.map(c => c.id);
    const shared = build(pack.cast[0].id, i).join('\n').length;   // 同一章里随手取一个人的版本当"共享版"的近似
    const one = build(preset[0] || pack.cast[0].id, i).join('\n').length;
    console.log(`  ch${i + 1}   ${String(preset.length).padStart(3)}   ${String(shared).padStart(6)}   ${String(one).padStart(7)}   ${one === shared ? '—' : (one - shared > 0 ? '+' : '') + (one - shared)}`);
  });
  console.log('\n别把这几个数当成本结论：');
  console.log('  · 每人一份的 **字符数** 和共享版是同一量级（CAST 块一样大），省的不是字，是"谁知道什么"；');
  console.log('  · 真正的成本差别是**调用次数**（每个开口的人各一次），不是字符数。');
  process.exit(0);
}

const chIdx = Math.max(1, Number(arg[1]) || 5) - 1;
const who = arg[2] || pack.cast[0].id;
const hasKey = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
if (!hasKey(chars, who)) { console.error('no such cast: ' + who); process.exit(2); }

const presetNow = present ? (present[chIdx] || []) : pack.cast.map(c => c.id);
if (!presetNow.includes(who)) {
  console.log(`${who} 不在第 ${chIdx + 1} 章的在场名单里（在场：${presetNow.join(', ') || '空'}）。`);
  console.log('按设计，这一拍**不会给他发 payload** —— 他不说话，也不该知道这场戏里发生了什么。');
  console.log('这正是"每人一份"要的效果；单 prompt 做不到，所以现在他仍然会读到这一章。');
  process.exit(0);
}
const draft = build(who, chIdx);
console.log(`=== 发给 ${who} 的一份草稿 · ${wid} 第 ${chIdx + 1} 章 · ${draft.join('\n').length} 字符 ===\n`);
console.log(draft.join('\n'));
console.log('\n=== 检查 ===');
const text = draft.join('\n');
console.log('  在场名单来自旁档：' + (present ? '是' : '否（没有旁档，退回全 cast）'));
console.log('  别人带秘密吗：' + (/Contradiction/.test(draft.filter(l => l.startsWith('- id=')).join('\n')) ? '检查' : '不带 ✓'));
console.log('  不在场的人出现在 CAST 里吗：' + (draft.filter(l => l.startsWith('- id=')).length === (present ? present[chIdx].length : pack.cast.length) ? '不出现 ✓' : '检查'));
