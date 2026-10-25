// 知情泄漏实验：先把「两种 prompt 差了什么信息」量出来（不花钱），再决定要不要真调模型
//
//   node tools/leak-experiment.mjs gala 5 mason            # 只做离线对比（免费）
//   node tools/leak-experiment.mjs gala 5 mason --live     # 真调两次模型（花钱，需自行确认）
//
// 为什么先离线：能"知道"的前提是信息在上下文里。共享 prompt 里同时装着 8 个人的秘密，
// 每人一份只装他自己的 —— 先把这份**信息差**列清楚，再谈模型会不会用，顺序不能反。
// ---- 两种 prompt ----
//   共享版：CAST 里所有人都带 secret/twist（旧行为，= chat.privateCards 调大）
//   每人份：CAST 里只有目标角色带，其余人公开面（新行为）
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const LIVE = process.argv.includes('--live');
const OUT = 'source/content/out';
const PRESENT = 'source/content/present';

const packs = fs.readdirSync(OUT).filter(f => /^s\d+\.json$/.test(f))
  .map(f => JSON.parse(fs.readFileSync(path.join(OUT, f), 'utf8')));
const wid = args[0] || 'gala', chNo = Number(args[1]) || 5, who = args[2] || 'mason';
const pack = packs.find(p => p.wid === wid);
if (!pack) { console.error('no pack: ' + wid); process.exit(2); }
const ch = pack.chapters[chNo - 1];
if (!ch) { console.error('no chapter ' + chNo); process.exit(2); }

const CHARS = (() => {
  try {
    const src = fs.readFileSync('source/src/content_chars.js', 'utf8');
    const i = src.indexOf('const C={');
    const body = src.slice(i + 'const C='.length, src.lastIndexOf('};') + 1);
    return new Function('T', 'return ' + body + ';')((en, zh) => ({ en, zh }));
  } catch (_) { return {}; }
})();
const zh = (v) => (!v ? '' : (typeof v === 'string' ? v : (v.zh || v.en || '')));

let roster = pack.cast.map(c => c.id);
const pf = path.join(PRESENT, wid + '.json');
if (fs.existsSync(pf)) { const j = JSON.parse(fs.readFileSync(pf, 'utf8')); roster = j.chapters[chNo - 1] || roster; }

const card = (id, priv) => {
  const c = CHARS[id] || {};
  const l = [`- id=${id} · Looks: ${zh(c.looks)} Personality: ${zh(c.vibe)}`];
  if (priv) l.push(`  Contradiction: ${zh(c.twist)}  Secret: ${zh(c.secret)}`);
  return l.join('\n');
};

const beats = (c) => [].concat(c.beats.zh || c.beats.en || [],
  ...(c.choices || []).map(x => (x.then && (x.then.zh || x.then.en)) || []));

const build = (mode) => {
  const parts = [];
  parts.push('You write MIRU… (固定规则略)');
  parts.push('THIS SCENE: ' + zh(ch.place) + ' · 在场：' + roster.join(', '));
  parts.push('CAST (only these ids may speak):');
  for (const id of roster) parts.push(card(id, mode === 'shared' || id === who));
  parts.push('STORY SO FAR: ' + beats(ch).slice(0, 4).map(b => String(b[2]).slice(0, 80)).join(' / '));
  parts.push('NOW: 玩家刚问了一句。（placeholder）');
  return parts.join('\n');
};

const shared = build('shared');
const personal = build('personal');

console.log(`=== ${wid} 第 ${chNo} 章 · 目标是 ${who}（在场：${roster.join(', ')}）===`);
console.log(`共享版 ${shared.length} 字符 · 每人份 ${personal.length} 字符\n`);

// 离线：信息差
const secrets = roster.filter(id => zh((CHARS[id] || {}).secret));
const inShared = secrets.filter(id => shared.includes(zh(CHARS[id].secret)));
const inPersonal = secrets.filter(id => personal.includes(zh(CHARS[id].secret)));
console.log('这份上下文里"装着几个人的秘密"：');
console.log('  共享版   : ' + inShared.length + ' 个 → ' + inShared.join(', '));
console.log('  每人份   : ' + inPersonal.length + ' 个 → ' + inPersonal.join(', '));
const leaked = inShared.filter(id => !inPersonal.includes(id));
console.log('  差出来的 : ' + (leaked.length ? leaked.join(', ') + '（' + leaked.length + ' 个人的秘密，每人份里没有）' : '无'));

console.log('\n判据（离线可判的那一半）：');
console.log('  · 每人份里只有目标角色的秘密：' + (inPersonal.length === 1 && inPersonal[0] === who ? '是 ✓' : '否 ✗'));
console.log('  · 共享版里装着别人的秘密：' + (leaked.length > 0 ? '是（这就是泄漏面）' : '否'));
console.log('  这一半证明了"信息在不在"，证明不了"模型会不会用"——后者只能真调。');

if (!LIVE) {
  console.log('\n（加 --live 会真发两次模型。那两次要花钱，默认不发。）');
  process.exit(0);
}

// ---- 真调：两次（共享 / 每人份），比"他会不会提到别人的秘密" ----
const key = process.env.LONGCAT_KEY || process.env.MIRU_KEY || '';
if (!key) { console.error('没有 LONGCAT_KEY / MIRU_KEY 环境变量，--live 无法执行'); process.exit(2); }
const ask = async (prompt) => {
  const r = await fetch('https://api.longcat.chat/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
    body: JSON.stringify({ model: 'LongCat-Flash-Chat', messages: [{ role: 'user', content: prompt }], max_tokens: 300 }),
  });
  const j = await r.json();
  return (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || JSON.stringify(j).slice(0, 300);
};

for (const [name, p] of [['共享版', shared], ['每人份', personal]]) {
  const out = await ask(p);
  const others = leaked.filter(id => out.includes(zh((CHARS[id] || {}).secret).slice(0, 12)));
  console.log(`\n--- ${name} 的输出（前 300 字）---\n${out.slice(0, 300)}`);
  console.log(`  提到别人的秘密吗：${others.length ? '提到了 ' + others.join(',') + ' ✗' : '没有 ✓'}`);
}
