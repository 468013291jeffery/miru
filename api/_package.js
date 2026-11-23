// 剧本文件包（miru.package/1）——纯函数，服务端与测试共用，不碰数据库。
//
// 依据：《MIRU 互动剧本写作规范 v2》（2026-11-14）。
//   · 交稿 = 剧本（可执行正文）+ 作品资料（首页介绍 / 人物卡 / 素材表）。一个文件只放剧本。
//   · 素材按剧本里的标签挂在位置上，名字必须对得上：
//       ⟦BG|bg_c03s01|书房·夜⟧   ⟦CG|槽位⟧   ⟦VIDEO|槽位⟧   ⟦BGM|标签⟧   ⟦MG|g_游戏⟧
//       ⟦CHAR|名字|性别|年龄|音色|身份⟧，立绘文件名 char_key
//   · 官方剧的素材表在 art/official/<work>.json；创作者交包时，这张表随包走。
//
// 包结构（zip）：
//   manifest.json 或 bible.json   ← 作品资料（标题、简介、前情提要、人物卡、素材表）
//   script.md                     ← 只放剧本
//   assets/...                    ← 文件名随意，manifest.assets 负责映射到槽位
//
// manifest.json：
//   {
//     "format": "miru.package/1",
//     "work": { "title", "hook", "premise", "you", "lang", "orient", "tags", "adult", "as" },
//     "script": "script.md",
//     "cover": "assets/cover.jpg",
//     "opening_video": "assets/opening.mp4",
//     "characters": [{ "key":"adrian", "name":"阿德里安", "gender":"m", "age":26, "portrait":"assets/char_adrian.jpg", … }],
//     "assets": { "bg_c01s01": "assets/bg/c01s01.jpg", "char_adrian": "assets/char_adrian.jpg", "BGM_TENSE": "assets/bgm/tense.mp3" },
//     "games": [{ "id":"g_find_ring", "tpl":"find", "a":"…", "b":"…" }]
//   }
//
// 兼容：assets 的值也可以直接是 https URL（已上传过的素材）；bible.json 正是官方后台的字段名。

const FORMAT = 'miru.package/1';
const MANIFEST_NAMES = ['manifest.json', 'bible.json', '作品资料.json', 'miru.package.json'];
const RE_DIR = /^⟦([A-Z/]+)((?:\|[^|⟧]*)*)⟧$/;
const SLOT_DIRECTIVES = { BG: 'bg', CG: 'cg', VIDEO: 'video', PHOTO: 'photo', BGM: 'bgm', MG: 'mg', CHAR: 'char', SFX: 'sfx' };
const MAX_ASSETS = 400;
const MAX_KEY = 64;
const MAX_URL = 600;
const KEY_RE = /^[\p{L}\p{N}_\-:.]+$/u;

/* 槽位名只允许字母数字和 _ - : .；防止 manifest 里塞奇怪的东西进运行时对象。 */
function keyOk(k) {
  return typeof k === 'string' && k.length > 0 && k.length <= MAX_KEY && KEY_RE.test(k);
}

/**
 * 从剧本正文里读出所有素材位置。
 * 只做行级识别，和 api/_dslqa.js / source/src/app94_official2.js 的指令表保持一致。
 * @returns {{bg:string[],cg:string[],video:string[],photo:string[],bgm:string[],mg:string[],char:string[],sfx:string[],orient:string,chapters:number,scenes:number}}
 */
function slotsOf(script) {
  const out = { bg: [], cg: [], video: [], photo: [], bgm: [], mg: [], char: [], sfx: [], orient: '', chapters: 0, scenes: 0 };
  const seen = {};
  Object.keys(out).forEach(k => { if (Array.isArray(out[k])) seen[k] = new Set(); });
  const add = (kind, v) => {
    const s = String(v || '').trim();
    if (!s || seen[kind].has(s)) return;
    seen[kind].add(s); out[kind].push(s);
  };
  for (const raw of String(script || '').replace(/\r\n?/g, '\n').split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (/^#+\s*CHAPTER\s+\d+/i.test(line) || /^第\s*[0-9一二三四五六七八九十百]+\s*章/.test(line)) { out.chapters++; continue; }
    if (/^#\s*(SCENE|场景)/i.test(line)) { out.scenes++; continue; }
    if (line.charAt(0) !== '⟦') continue;
    const m = line.match(RE_DIR);
    if (!m) continue;
    const kind = m[1];
    const a = m[2] ? m[2].slice(1).split('|').map(s => { try { return decodeURIComponent(s); } catch (_) { return s; } }) : [];
    if (kind === 'ORIENT') { out.orient = String(a[0] || '').trim().toLowerCase(); continue; }
    const slotKind = SLOT_DIRECTIVES[kind];
    if (!slotKind) continue;
    if (kind === 'CHAR') { add('char', a[0]); continue; }
    if (kind === 'PHOTO') { add('photo', a[0]); continue; }
    if (kind === 'MG') { add('mg', /^g_/.test(a[0] || '') ? a[0] : 'g_' + (a[0] || '')); continue; }
    add(slotKind, a[0]);
  }
  return out;
}

/** 剧本引用到的、建议必须有文件的槽位（PHOTO 是 AI 静帧，不算必交；char 可选）。 */
function requiredSlots(slots) {
  return {
    bg: (slots && slots.bg) || [],
    cg: (slots && slots.cg) || [],
    video: (slots && slots.video) || [],
    bgm: (slots && slots.bgm) || [],
    mg: (slots && slots.mg) || [],
  };
}

/**
 * 校验并规整素材表。
 * @param {object} input {slot: url|filePath}
 * @returns {{ok:boolean, assets:object, errors:string[]}}
 */
function normalizeAssets(input) {
  const errors = [];
  const assets = {};
  if (input == null) return { ok: true, assets, errors };
  if (typeof input !== 'object' || Array.isArray(input)) return { ok: false, assets, errors: ['assets must be an object {slot: url}'] };
  const keys = Object.keys(input);
  if (keys.length > MAX_ASSETS) return { ok: false, assets, errors: ['too many assets (' + keys.length + ', limit ' + MAX_ASSETS + ')'] };
  for (const k of keys) {
    if (!keyOk(k)) { errors.push('bad asset slot "' + String(k).slice(0, 40) + '"'); continue; }
    const v = input[k];
    if (typeof v !== 'string' || !v.trim()) { errors.push('asset "' + k + '" has no url'); continue; }
    const u = v.trim();
    if (u.length > MAX_URL) { errors.push('asset "' + k + '" url too long'); continue; }
    // 只接受 https 或包内相对路径（客户端上传后会把相对路径换成 https）
    if (!/^https:\/\//i.test(u) && !/^[A-Za-z0-9._/ -]+$/.test(u)) { errors.push('asset "' + k + '" url must be https or a package path'); continue; }
    assets[k] = u;
  }
  return { ok: errors.length === 0, assets, errors };
}

/**
 * 人物卡（作品资料的 ②）。字段同时接受英文键和规范里的中文列名。
 * 规范：key* / 名字* / 性别、年龄、身高* / 身份* / 外貌* / 性格与反差* / 一句话卖点* / 单聊开场白* / 说话方式 / 喜好 / 边界 / 立绘
 * @returns {{characters:object[], errors:string[]}}
 */
function normalizeCharacters(input) {
  const arr = Array.isArray(input) ? input : [];
  const characters = [], errors = [];
  arr.slice(0, 40).forEach((c, i) => {
    if (!c || typeof c !== 'object') return;
    const key = String(c.key || c.id || '').trim().toLowerCase();
    const name = String(c.name || c['名字'] || '').trim();
    if (!key || !/^[a-z0-9_]+$/.test(key)) errors.push('characters[' + i + '].key must be lowercase letters/digits/underscore');
    if (!name) errors.push('characters[' + i + '].name is required');
    const rawAge = c.age != null ? c.age : c['年龄'];
    const age = rawAge == null ? 0 : parseInt(String(rawAge).replace(/[^\d]/g, ''), 10) || 0;
    if (age && age < 18) errors.push('characters[' + i + '] (' + (name || key) + ') must be an adult (age ' + age + ')');
    characters.push({
      key: key.slice(0, 40),
      name: name.slice(0, 40),
      gender: String(c.gender || c.g || c['性别'] || '').trim().toLowerCase().charAt(0),
      age,
      height: String(c.height || c['身高'] || '').trim().slice(0, 20),
      identity: String(c.identity || c.role || c['身份'] || '').trim().slice(0, 80),
      looks: String(c.looks || c.appearance || c['外貌'] || '').trim().slice(0, 400),
      personality: String(c.personality || c['性格与反差'] || '').trim().slice(0, 400),
      sellingPoint: String(c.sellingPoint || c.hook || c['一句话卖点'] || '').trim().slice(0, 120),
      openingLine: String(c.openingLine || c.opening || c['单聊开场白'] || '').trim().slice(0, 300),
      speech: String(c.speech || c['说话方式'] || '').trim().slice(0, 200),
      likes: String(c.likes || c['喜好'] || '').trim().slice(0, 200),
      boundary: String(c.boundary || c['边界'] || '').trim().slice(0, 200),
      portrait: String(c.portrait || c.art || c['立绘'] || '').trim().slice(0, MAX_URL),
    });
  });
  return { characters, errors };
}

/**
 * 结构审查（规范第三～九节里能从文本直接判定的硬规则）。
 * 不重实现解析器；只查作者交稿时最容易静默出错的地方。
 * @returns {{errors:string[], warnings:string[]}}
 */
function scriptRules(script) {
  const errors = [], warnings = [];
  const text = String(script || '').replace(/\r\n?/g, '\n');
  const lines = text.split('\n');
  let chapters = 0, scenes = 0, scenesInCh = 0;
  const perCh = [];
  const mgPerCh = [];
  let chapterNo = 0, mgInCh = 0;
  let nextAfterScene = -1;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i], line = raw.trim();
    if (!line) continue;
    if (/^#+\s*CHAPTER\s+\d+/i.test(line) || /^第\s*[0-9一二三四五六七八九十百]+\s*章/.test(line)) {
      if (chapterNo) { perCh.push(scenesInCh); mgPerCh.push(mgInCh); }
      chapterNo++; chapters++; scenesInCh = 0; mgInCh = 0; nextAfterScene = -1; continue;
    }
    if (/^#\s*(SCENE|场景)/i.test(line)) {
      scenes++; scenesInCh++;
      if (!/#[^｜|]*[｜|]/.test(line)) warnings.push('第 ' + (chapterNo || '?') + ' 章：场景名请写成「# SCENE｜地点」');
      nextAfterScene = i + 1; continue;
    }
    if (line.charAt(0) === '⟦') {
      const m = line.match(RE_DIR);
      if (!m) continue;
      if (m[1] === 'MG') mgInCh++;
      if (m[1] === 'BG' && nextAfterScene === i) nextAfterScene = -1;
      continue;
    }
    if (nextAfterScene >= 0 && nextAfterScene <= i && !/^#/.test(line)) {
      errors.push('第 ' + (chapterNo || '?') + ' 章：每个 # SCENE 的下一行必须是 ⟦BG|槽位|说明⟧，这一场没有背景卡（规范第三节）');
      nextAfterScene = -1;
    }
    if (/^##\s/.test(line)) warnings.push('剧本里出现了「## 」小标题 —— 它会被原样播给玩家；作品资料请放另一个文件（规范第三节）');
  }
  if (chapterNo) { perCh.push(scenesInCh); mgPerCh.push(mgInCh); }
  if (chapters && (chapters < 15 || chapters > 20)) warnings.push('全剧 ' + chapters + ' 章：规范建议 15–20 章');
  perCh.forEach((n, i) => { if (n && (n < 3 || n > 5)) warnings.push('第 ' + (i + 1) + ' 章有 ' + n + ' 场：规范建议 3–5 场'); });
  mgPerCh.forEach((n, i) => { if (n > 1) warnings.push('第 ' + (i + 1) + ' 章有 ' + n + ' 个小游戏：规范要求每章最多 1 个'); });
  return { errors, warnings };
}

/**
 * 整包审查。只回答「能不能按规范挂上」，内容尺度由 api/_lib.js 的 safety() 管。
 * @param {{script:string, assets?:object, characters?:object[], cover?:string, opening_video?:string, games?:any[]}} pkg
 * @returns {{ok:boolean, errors:string[], warnings:string[], missing:string[], unused:string[], coverage:object, slots:object, characters:object[]}}
 */
function packageQA(pkg) {
  const p = pkg || {};
  const errors = [];
  const warnings = [];
  const script = typeof p.script === 'string' ? p.script : '';
  if (!script.trim()) errors.push('缺少剧本正文（script）');
  const slots = slotsOf(script);
  const rules = scriptRules(script);
  rules.errors.forEach(e => errors.push(e));
  rules.warnings.forEach(w => warnings.push(w));
  if (!slots.chapters) warnings.push('剧本里没有 CHAPTER 标记（可能仍然能播，但章节会由解析器自行推断）');

  const na = normalizeAssets(p.assets);
  na.errors.forEach(e => errors.push(e));
  const assets = na.assets;

  // 人物卡：立绘自动补成 char_<名字> 和 char_<key> 两个槽位，和脚本里的 ⟦CHAR|名字⟧ 对齐
  const nc = normalizeCharacters(p.characters);
  nc.errors.forEach(e => errors.push(e));
  const characters = nc.characters;
  characters.forEach(c => {
    const portrait = c.portrait || assets['char_' + c.key] || assets['char_' + c.name];
    if (portrait && /^https?:\/\//.test(portrait)) {
      if (c.name && !assets['char_' + c.name]) assets['char_' + c.name] = portrait;
      if (c.key && !assets['char_' + c.key]) assets['char_' + c.key] = portrait;
    }
  });

  const req = requiredSlots(slots);
  const missing = [];
  for (const kind of ['bg', 'cg', 'video', 'bgm', 'mg']) {
    for (const slot of req[kind]) {
      const keys = [slot];
      if (kind === 'bgm') keys.push('bgm_' + slot);
      if (kind === 'mg') keys.push('mg_' + slot);
      if (!keys.some(k => assets[k])) missing.push(slot);
    }
  }
  // 视频是「可后补」的：缺了只提示，不挡发布
  const missingBlocking = missing.filter(s => !req.video.includes(s));

  const referenced = new Set();
  for (const kind of ['bg', 'cg', 'video', 'bgm', 'mg', 'char', 'photo', 'sfx']) {
    for (const s of slots[kind]) {
      referenced.add(s);
      if (kind === 'bgm') referenced.add('bgm_' + s);
      if (kind === 'char') { referenced.add('char_' + s); characters.forEach(c => referenced.add('char_' + c.name)); }
    }
  }
  characters.forEach(c => { if (c.key) referenced.add('char_' + c.key); });
  const reserved = /^(cover|poster|opening_video|vid_open|home_video|endings|voices|leads|bible|trailer)$/;
  const unused = Object.keys(assets).filter(k => !referenced.has(k) && !reserved.test(k));

  if (!p.cover && !assets.cover && !assets.poster) {
    const firstBg = slots.bg.find(s => assets[s]);
    if (firstBg) warnings.push('没有封面：发布时会用第一张背景（' + firstBg + '）兜底');
    else warnings.push('没有封面，也没有背景图：发现页会显示占位封面');
  }
  if (!p.opening_video && !assets.opening_video && !assets.vid_open) warnings.push('没有开场视频（可选，发布后仍可补）');
  if (missingBlocking.length) warnings.push('还有 ' + missingBlocking.length + ' 个剧本槽位没有素材，播放时会跳过或由 AI 兜底');
  if (unused.length) warnings.push(unused.length + ' 个文件没有被剧本引用：' + unused.slice(0, 5).join(', '));

  // 人物卡和剧本要对得上：剧本里每个 ⟦CHAR⟧ 都应该有卡（规范：没有卡的角色不会出现在角色页）
  const cardNames = new Set(characters.map(c => c.name).filter(Boolean));
  const cardKeys = new Set(characters.map(c => c.key).filter(Boolean));
  const noCard = slots.char.filter(n => !cardNames.has(n) && !cardKeys.has(n));
  if (noCard.length) warnings.push(noCard.length + ' 个剧本角色没有人物卡：' + noCard.slice(0, 6).join('、') + '（不会出现在「发现 → 角色」）');
  const noPortrait = characters.filter(c => !c.portrait && !assets['char_' + c.key] && !assets['char_' + c.name]);
  if (noPortrait.length) warnings.push(noPortrait.length + ' 个人物卡没有立绘：' + noPortrait.slice(0, 6).map(c => c.name || c.key).join('、'));

  const coverage = {};
  for (const kind of ['bg', 'cg', 'video', 'bgm', 'mg', 'char']) {
    const keysFor = s => kind === 'bgm' ? ['bgm_' + s, s] : kind === 'char' ? ['char_' + s, s] : [s];
    coverage[kind] = { have: slots[kind].filter(s => keysFor(s).some(k => assets[k])).length, total: slots[kind].length };
  }
  try { if (p.games && !Array.isArray(p.games)) warnings.push('games 必须是数组'); } catch (_) {}

  return { ok: errors.length === 0, errors, warnings, missing, unused, coverage, slots, characters, assets };
}

/** manifest 的默认值与字段收敛（客户端和后台都用同一份）。 */
function normalizeManifest(m) {
  const src = (m && typeof m === 'object') ? m : {};
  const w = (src.work && typeof src.work === 'object') ? src.work : src;
  const tags = Array.isArray(w.tags) ? w.tags.filter(x => typeof x === 'string' && x.trim()).slice(0, 12) : [];
  const orient = ['bl', 'gl', 'bg', 'all'].includes(String(w.orient || '').toLowerCase()) ? String(w.orient).toLowerCase() : 'all';
  const nc = normalizeCharacters(src.characters || src.cast || w.characters || w.cast);
  const assets = (src.assets && typeof src.assets === 'object' && !Array.isArray(src.assets)) ? src.assets
    : (src.assetTable && typeof src.assetTable === 'object' && !Array.isArray(src.assetTable)) ? src.assetTable
      : (w.assets && typeof w.assets === 'object' && !Array.isArray(w.assets)) ? w.assets : {};
  return {
    format: String(src.format || FORMAT),
    script: String(src.script || src.scriptFile || 'script.md'),
    cover: src.cover ? String(src.cover) : '',
    opening_video: (src.opening_video || src.video) ? String(src.opening_video || src.video) : '',
    work: {
      title: String(w.title || w['标题'] || '').slice(0, 80),
      hook: String(w.hook || w.logline || w['一句话'] || '').slice(0, 240),
      premise: String(w.premise || w.synopsis || w['简介'] || w['前情提要'] || '').slice(0, 4000),
      you: String(w.you || w.player || w['玩家'] || '').slice(0, 400),
      lang: String(w.lang || 'zh').slice(0, 5),
      orient,
      tags,
      adult: w.adult === true,
      as: String(w.as || '').slice(0, 40),
    },
    characters: nc.characters,
    characterErrors: nc.errors,
    assets,
    games: Array.isArray(src.games) ? src.games.slice(0, 100) : [],
  };
}

module.exports = { FORMAT, MANIFEST_NAMES, KEY_RE, slotsOf, requiredSlots, normalizeAssets, normalizeCharacters, scriptRules, packageQA, normalizeManifest };
