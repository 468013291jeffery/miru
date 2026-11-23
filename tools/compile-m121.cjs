/* Compile M121 OFF CAMERA source JSON into the MIRU script, asset map and runtime release.
   Source of truth: content/official/m121-off-camera/source/*.json
   Run: node tools/compile-m121.cjs
*/
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'content/official/m121-off-camera');
const src = path.join(dir, 'source');
const read = name => JSON.parse(fs.readFileSync(path.join(src, name), 'utf8'));

const nodes = read('nodes.json');
const chapters = read('chapters.json');
const world = read('world.json');
const endings = read('endings.json');
const castSrc = read('characters.json');
const games = read('games.json');
const assets = read('assets.json');
const audio = read('audio.json');

const CAST = {
  SEB: { zh: '塞巴斯蒂安', en: 'Sebastian Vale', g: 'm', age: 33, voice: 'm3', role: '投资人，成年，可恋爱' },
  RYA: { zh: '莱恩', en: 'Ryan Cole', g: 'm', age: 29, voice: 'm1', role: '冰球运动员，成年，可恋爱' },
  JUL: { zh: '朱利安', en: 'Julian Cross', g: 'm', age: 31, voice: 'm2', role: '演员，成年，可恋爱' },
  LUC: { zh: '卢卡', en: 'Luca Moretti', g: 'm', age: 30, voice: 'm4', role: '主厨，成年，可恋爱' },
  NAO: { zh: '娜奥米', en: 'Naomi Chen', g: 'f', age: 38, voice: 'f1', role: '节目制片人，成年' },
  QUI: { zh: '奎因', en: 'Quinn Hart', g: 'f', age: 27, voice: 'f2', role: '助理剪辑，成年' },
  ADA: { zh: '艾达', en: 'Ada Brooks', g: 'f', age: 41, voice: 'f3', role: '选手律师，成年' },
  MIL: { zh: '迈尔斯', en: 'Miles Voss', g: 'm', age: 48, voice: 'm5', role: '赞助商高管，成年' }
};
const BLOCK = ['性器', '勃起', '硬物', '插入', '抽动', '抽插', '内裤', '下身', 'erection', 'crotch', 'groin', 'thrust', 'penetrat', 'bulge', 'genital', 'naked body', 'nipple'];
const IMG = 'art/official/m121-off-camera/images/';
const AUD = 'art/official/m121-off-camera/audio/';

function scrub(s) {
  let t = String(s || '').replace(/\*\*/g, '').replace(/\r/g, '');
  t = t.replace(/剩下身体/g, '只剩温度和呼吸');
  const swaps = [[/下身/g, '腰线'], [/性器/g, ''], [/勃起/g, ''], [/硬物/g, ''], [/抽插/g, ''], [/抽动/g, ''], [/插入/g, '贴近'], [/内裤/g, ''], [/erection/gi, ''], [/crotch/gi, ''], [/groin/gi, ''], [/penetrat\w*/gi, ''], [/genital\w*/gi, ''], [/naked body/gi, ''], [/nipple\w*/gi, ''], [/thrust\w*/gi, ''], [/bulge/gi, '']];
  for (const [re, to] of swaps) t = t.replace(re, to);
  return t.replace(/[ \t]{2,}/g, ' ').trim();
}
function blocked(s) { const low = String(s || '').toLowerCase(); return BLOCK.some(w => low.includes(w)); }
function safeText(s) {
  const t = scrub(s);
  const parts = t.split(/(?<=[。！？.!?])/);
  return parts.filter(p => p.trim() && !blocked(p)).join('').replace(/\s+/g, ' ').trim();
}
function say(line) {
  const m = /^([A-Z]{3}):\s*(.*)$/.exec(String(line || '').trim());
  if (!m || !CAST[m[1]]) return '';
  const tx = safeText(m[2]).replace(/^["“]|["”]$/g, '');
  return tx ? CAST[m[1]].zh + '：“' + tx + '”' : '';
}
function narrations(node, heat) {
  const bits = [node.action];
  if (heat && Array.isArray(node.romance_beat)) {
    for (const x of node.romance_beat) {
      if (typeof x !== 'string' || /^(SEB|RYA|JUL|LUC|NAO|QUI|ADA|MIL)$/.test(x.trim())) continue;
      bits.push(x.replace(/\*\*/g, '').replace(/^(?:玩家触发|升级分支|亲密场面|他自己的刹车|他会自己喊暂停)[^：]{0,12}：/, ''));
    }
  }
  const text = safeText(bits.filter(Boolean).map(x => /[。！？.!?]$/.test(x.trim()) ? x.trim() : x.trim() + '。').join(''));
  if (!text) return ['这一场先停在门口。他在等你开口，没有你的话，什么都不会发生。'];
  const out = [];
  let rest = text;
  while (rest.length > 180) {
    let cut = rest.lastIndexOf('。', 180);
    if (cut < 40) cut = 180;
    out.push(rest.slice(0, cut + 1).trim());
    rest = rest.slice(cut + 1).trim();
    if (out.length >= 6) break;
  }
  if (rest && out.length < 6) out.push(rest);
  return out;
}

const factFlags = new Set(world.fact_flags || []);
const plotFlags = new Set();
for (const n of nodes) for (const h of n.hidden_intents || []) {
  const pf = h.effects && h.effects.plot_flag;
  if (pf) plotFlags.add(pf);
}
let previousMain = null;
const heatRules = [];
for (const n of nodes) {
  if (!n.heat_scene) { previousMain = n.scene_id; continue; }
  const parts = String(n.entry_if || '').split(/\s+AND\s+/);
  const needFlags = [];
  const needHeat = [];
  const optionalHeat = [];
  for (const raw of parts) {
    const p = raw.trim();
    if (!p || /完成/.test(p)) continue;
    if (/无未修复/.test(p)) continue;
    const optional = /或玩家|或本场/.test(p);
    if (/玩家/.test(p) && !/[a-z]_heat_|heat_\d/.test(p)) continue;
    for (const t of p.match(/[a-z][a-z0-9_]{2,}/g) || []) {
      if (/heat/.test(t)) (optional ? optionalHeat : needHeat).push(t);
      else needFlags.push(t);
    }
  }
  const mentioned = (String(n.entry_if || '').match(/C\d\d_S\d\d/) || [])[0];
  if (mentioned && mentioned !== previousMain) throw new Error(n.scene_id + ' entry scene ' + mentioned + ' != previous ' + previousMain);
  for (const f of needFlags) if (!factFlags.has(f) && !plotFlags.has(f)) throw new Error(n.scene_id + ' unknown flag ' + f);
  for (const f of needHeat.concat(optionalHeat)) if (!plotFlags.has(f)) throw new Error(n.scene_id + ' unknown heat flag ' + f);
  heatRules.push({
    id: n.scene_id, after: previousMain, partner: n.partner_id, cg: n.visual_event || null,
    boundaryAsset: n.boundary_state || null, level: n.heat_level || '',
    needFlags: [...new Set(needFlags)], needHeat: [...new Set(needHeat)], optionalHeat: [...new Set(optionalHeat)]
  });
}
const heatByAfter = new Map();
for (const h of heatRules) {
  if (!heatByAfter.has(h.after)) heatByAfter.set(h.after, []);
  heatByAfter.get(h.after).push(h);
}
const gameByScene = new Map(games.map(g => [g.scene_id, g]));
const chapterById = new Map(chapters.map(c => [c.chapter_id, c]));
const assetIds = new Set(assets.map(a => a.asset_id));

function bgFor(node) {
  const raw = String(node.visual_initial || '').replace(/\s*\(.*$/, '');
  if (assetIds.has(raw)) return raw;
  const own = 'BG_' + node.scene_id;
  if (assetIds.has(own)) return own;
  return '';
}

const lines = [];
const push = s => lines.push(s);
push('# CHAPTER 1｜' + chapters[0].title_zh);
push('⟦ORIENT|bg⟧');
push('⟦CHAR|你|f|28|f2|成年女性选手，第一人称|外貌由玩家决定，画面里不出现固定的脸|You⟧');
for (const c of castSrc) {
  const m = CAST[c.id];
  if (!m) continue;
  push('⟦CHAR|' + m.zh + '|' + m.g + '|' + m.age + '|' + m.voice + '|' + m.role + '|' + m.en + '，成年|' + m.en + '⟧');
}
push('⟦SET|native_v2,m121_scene~C01_S01⟧');

let chapterOpen = 'C01';
for (const node of nodes) {
  if (node.heat_scene) continue;
  if (node.chapter_id !== chapterOpen) {
    chapterOpen = node.chapter_id;
    const card = chapterById.get(chapterOpen);
    push('');
    push('# CHAPTER ' + Number(chapterOpen.slice(1)) + '｜' + card.title_zh);
    push('⟦GOAL|' + card.goal_zh + '|' + card.title_en + '⟧');
  }
  const bg = bgFor(node) || ('BG_' + node.scene_id);
  push('');
  push('# SCENE｜' + node.title);
  push('⟦BG|' + bg + '|' + node.title + '⟧');
  push('⟦TIME|第' + Number(node.chapter_id.slice(1)) + '天⟧');
  push('⟦BGM|BGM_M121_' + node.chapter_id + '|本章⟧');
  push('⟦SET|m121_scene~' + node.scene_id + '⟧');
  for (const para of narrations(node, false)) push('旁白：' + para);
  for (const line of node.spoken_lines || []) {
    const said = say(line);
    if (said) push(said);
  }
  const game = gameByScene.get(node.scene_id);
  if (game) {
    push('# CHOICE｜小游戏可跳过：' + game.name_zh);
    push('#### A｜我来完成');
    push('旁白：你自己做完了这一步。结果记下来，故事继续。');
    push('⟦OPT|A|set:m121_mg_' + game.id + '_win⟧');
    push('#### B｜请他们补完');
    push('旁白：在场的人帮你补完。没有惩罚，故事继续。');
    push('⟦OPT|B|set:m121_mg_' + game.id + '_lose⟧');
    push('#### C｜跳过');
    push('旁白：这一步跳过了。没有额外标记，故事继续。');
    push('⟦OPT|C|set:m121_mg_' + game.id + '_skip⟧');
    push('# ·');
  }
  const intents = node.hidden_intents || [];
  push('# CHOICE｜' + (safeText(node.player_prompt).slice(0, 42) || '你想怎么做？'));
  const labels = { CLARIFY: '先问清楚', ENGAGE: '我愿意试试', BOUNDARY: '先保持距离', CONSENT: '我明确同意', OTHER: '我还没想好' };
  const keys = 'ABCDE';
  intents.slice(0, 5).forEach((h, i) => {
    const kind = h.id.split('_').pop();
    push('#### ' + keys[i] + '｜' + (labels[kind] || '另说'));
    const fx = safeText(h.visual_feedback) || '你的话被记下了。';
    push('旁白：' + fx.slice(0, 80));
    push('⟦OPT|' + keys[i] + '|set:m121_i_' + h.id + '⟧');
  });
  push('# ·');
  for (const heat of heatByAfter.get(node.scene_id) || []) {
    const hnode = nodes.find(n => n.scene_id === heat.id);
    push('# CHOICE｜' + CAST[heat.partner].zh + '在等你点头。同意、慢一点、停下，或今晚不去。');
    push('#### A｜我同意，继续');
    push('⟦OPT|A|set:m121_i_' + heat.id + '_CONSENT_FULL⟧');
    push('⟦IF|m121_enter_' + heat.id + '⟧');
    push('旁白：他先问过你。没有你的话，画面不会往下走。这一场的同意只在这一场有效。');
    for (const para of narrations(hnode, true)) push('旁白：' + para);
    for (const line of hnode.spoken_lines || []) { const said = say(line); if (said) push(said); }
    if (heat.cg) push('⟦CG|' + heat.cg + '|双方同意之后⟧');
    push('旁白：你随时可以喊停。停了以后，这张亲密画面就不会再留在这一场里。');
    push('⟦ELSE⟧');
    push('旁白：条件还没齐，或者你之前让他停过。他没有把沉默当成同意，你们留在原来的距离。');
    push('⟦/IF⟧');
    push('#### B｜慢一点就好');
    push('⟦OPT|B|set:m121_i_' + heat.id + '_CONSENT_SLOW⟧');
    push('⟦IF|m121_enter_' + heat.id + '⟧');
    push('旁白：他停在你允许的动作上。没有亲密特写，只有你们说过的那一段。');
    push('⟦ELSE⟧');
    push('旁白：他还不能把这当成邀请。距离保持原样。');
    push('⟦/IF⟧');
    push('#### C｜停');
    push('旁白：他立刻停下，退开，不再劝。好感不会因为你喊停而下降。');
    if (heat.boundaryAsset) push('⟦CG|' + heat.boundaryAsset + '|他停下了⟧');
    push('⟦OPT|C|set:m121_i_' + heat.id + '_BOUNDARY⟧');
    push('#### D｜今晚不去');
    push('旁白：你没有进这扇门。主线照旧向前。');
    push('⟦OPT|D|set:m121_skip_' + heat.id + '⟧');
    push('# ·');
  }
  if (node.scene_id === 'C12_S03') {
    push('# CHOICE｜你想和谁认真在一起？');
    const ends = [['A', '塞巴斯蒂安', 'SEB'], ['B', '莱恩', 'RYA'], ['C', '朱利安', 'JUL'], ['D', '卢卡', 'LUC'], ['E', '先不选某一个人', 'UNSPEC']];
    for (const [k, label, id] of ends) {
      push('#### ' + k + '｜' + label);
      push('旁白：这是你当面说的选择。缺了对方已经做完的那一步，就不会被记成结局。');
      push('⟦OPT|' + k + '|set:m121_pick_END_' + id + '⟧');
    }
    push('# ·');
    push('# CHOICE｜如果他再问一次，你怎么回答？');
    push('#### A｜留下');
    push('⟦OPT|A|set:m121_epi_yes⟧');
    push('旁白：上一次的同意不算数。这一次才算。');
    for (const [flag, name, cg] of [['SEB', '塞巴斯蒂安', 'CG_M121_041'], ['RYA', '莱恩', 'CG_M121_042'], ['JUL', '朱利安', 'CG_M121_043'], ['LUC', '卢卡', 'CG_M121_044']]) {
      push('⟦IF|m121_end_' + flag + '⟧');
      push('旁白：' + name + '等到你再次点头。');
      push('⟦CG|' + cg + '|再次同意之后⟧');
      push('⟦/IF⟧');
    }
    push('⟦IF|m121_end_SOLO⟧');
    push('旁白：没有人发出新的邀请。');
    push('⟦/IF⟧');
    push('⟦IF|m121_end_OPEN⟧');
    push('旁白：没有排他的邀请。约会如果继续，也要分开说。');
    push('⟦/IF⟧');
    push('#### B｜这样就好');
    push('旁白：你们把距离留在已经说好的地方。');
    push('⟦OPT|B|set:m121_epi_no⟧');
    push('#### C｜停');
    push('旁白：他停住。亲密画面不会留下。');
    push('⟦OPT|C|set:m121_epi_stop⟧');
    push('# ·');
    push('# CHOICE｜如果刚才没有选定一个人');
    push('#### A｜自己走');
    push('旁白：你没有开始一段恋爱。日子还是你的。');
    push('⟦OPT|A|set:m121_pick_END_SOLO⟧');
    push('#### B｜不排他，分开约会');
    push('旁白：你说清楚了：没有隐藏的排他承诺。');
    push('⟦OPT|B|set:m121_pick_END_OPEN⟧');
    push('#### C｜维持刚才的选择');
    push('旁白：已经说定的结局保持不变。');
    push('⟦OPT|C|set:m121_pick_END_KEEP⟧');
    push('# ·');
  }
}

const script = lines.join('\n') + '\n';
if (blocked(script)) throw new Error('script still contains a blocked token');

const map = {};
for (const a of assets) map[a.asset_id] = IMG + a.asset_id + '.webp';
for (const [id, meta] of Object.entries(CAST)) map['char_' + meta.zh] = map[castSrc.find(c => c.id === id).reference_asset_id];
for (const b of audio.bgm) map[b.id] = AUD + b.id + '.mp3';

const runtimeNodes = nodes.map(n => ({
  scene_id: n.scene_id,
  chapter_id: n.chapter_id,
  title: n.title,
  heat_scene: !!n.heat_scene,
  partner_id: n.partner_id || null,
  characters: n.characters || [],
  persistent_scene_flag: n.persistent_scene_flag || null,
  exit_flag: n.exit_flag || null,
  next_scene: n.next_scene || null,
  bg: bgFor(n) || null,
  cg: n.visual_event || null,
  boundary_asset: n.boundary_state || null,
  intents: (n.hidden_intents || []).map(h => ({ id: h.id, effects: h.effects || {} }))
}));
const release = {
  schema: 1,
  slug: 'm121-off-camera',
  title: '镜头关掉后，他们都想吻我',
  english: 'OFF CAMERA',
  code: 'M121',
  orient: 'bg',
  lang: 'zh',
  adult: true,
  heat: 'explicit',
  hook: '摄像机关掉以后，四个成年男人各自等你点头。吻不吻，由你说。',
  premise: '你是一位28岁的成年女性，受邀参加私人海岛恋爱真人秀《Off Camera》。四位成年男嘉宾是投资人塞巴斯蒂安、冰球运动员莱恩、演员朱利安和主厨卢卡。\n\n节目组安排他们在镜头前竞争你的注意。摄像机关掉之后，有人请求亲吻，有人邀你跳舞，也有人只想跟你坐着吃一碗热面。\n\n你可以认识任何一个人，也可以拒绝所有邀请。没有人能替你决定身体边界。你很快发现，私人时段的收音规则没有说清楚，一段被剪过的画面可能让外界以为你同意了一场根本不存在的亲吻。',
  you: '你是28岁的成年女性选手。姓名和外貌由你决定。亲密、约会和是否继续，都要你当面说。',
  nodes: runtimeNodes,
  heatRules,
  endings: endings.map(e => ({
    id: e.ending_id.replace('END_', ''),
    partner: e.partner_id,
    flag: e.required_story_flag,
    explicit: !!e.requires_explicit_final_intent,
    cg: e.v2_heat_epilogue ? e.v2_heat_epilogue.asset : null
  })),
  relations: world.relationships,
  games: games.map(g => ({
    id: g.id, scene_id: g.scene_id, type: g.type, ui_template: g.ui_template,
    name_zh: g.name_zh, name_en: g.name_en, implemented: false
  })),
  assets: map
};

const chapterBlocks = script.split(/(?=# CHAPTER )/).filter(s => s.startsWith('# CHAPTER'));
const payload = {
  title: release.title,
  orient: 'bg',
  lang: 'zh',
  config: {
    hook: release.hook,
    premise: release.premise,
    you: release.you,
    adult: true,
    heat: 'explicit',
    tags: ['女性向', '多男主', '真人秀', '成人', '同意'],
    leads: ['SEB', 'RYA', 'JUL', 'LUC'].map(id => ({ key: id.toLowerCase(), n: { zh: CAST[id].zh, en: CAST[id].en }, g: 'm', age: CAST[id].age, role: { zh: CAST[id].role, en: CAST[id].en } })),
    en: { title: 'OFF CAMERA', hook: 'After the cameras stop, four adult men wait for you to say yes.', you: release.you }
  },
  chapters: chapterBlocks.map((md, i) => ({ n: i + 1, t: (md.split('\n')[0].split('｜')[1] || '').trim(), md }))
};

fs.writeFileSync(path.join(dir, 'script.md'), script);
fs.writeFileSync(path.join(dir, 'release.json'), JSON.stringify(release));
fs.writeFileSync(path.join(dir, 'assets.json'), JSON.stringify({
  note: 'Files are not in the repo yet. Paths are the IDs the player will request. A missing file falls back to a labeled placeholder.',
  images: Object.fromEntries(assets.map(a => [a.asset_id, { type: a.type, scene_id: a.scene_id, path: map[a.asset_id], present: false }])),
  audio: Object.fromEntries(audio.bgm.map(b => [b.id, { path: map[b.id], present: false }]))
}, null, 2) + '\n');
fs.writeFileSync(path.join(dir, 'publish-payload.json'), JSON.stringify(payload));
const dataJs = '/* Generated by tools/compile-m121.cjs. Do not edit by hand. */\nconst M121_RELEASE=' + JSON.stringify(release) + ';\n';
fs.writeFileSync(path.join(root, 'source/src/app160_m121_data.js'), dataJs);
const sceneCount = (script.match(/^# SCENE/gm) || []).length;
const chapterCount = (script.match(/^# CHAPTER/gm) || []).length;
console.log(JSON.stringify({ chapters: chapterCount, scenes: sceneCount, heat: heatRules.length, assets: assets.length, games: games.length, scriptBytes: Buffer.byteLength(script) }));
