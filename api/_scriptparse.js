// 编剧中文稿 → 故事圣经。纯函数，命令行（tools/script-import.mjs）和后台共用这一份。
//
// 编剧按《剧本编写规范》的模板，用【栏目名】写稿，不接触系统字段。这里按栏目名逐行解析，
// 不经过模型：作者的原文一个字都不改，也不会因为模型发挥而丢内容。
//
// 结构靠三个栏目分段：
//   【全名】开始一个人物  【章序】开始一章  【结局名】开始一个结局
//   一章里再出现【地点】 = 这一章的下一场
// 报错一律用编剧能看懂的话，并指出第几行、哪一栏。

const FX_NAMES = {
  下雨: 'rain', 暴雨雷电: 'storm', 大风: 'wind', 下雪: 'snowfall', 暴风雪: 'blizzard', 严寒结冰: 'ice', 烛光: 'candle', 炉火: 'embers', 火灾现场: 'inferno', 停电: 'blackout', 地下室滴水: 'drip', 城市夜景: 'bokeh', 霓虹夜店: 'neon', 暖阳光束: 'godrays', 室内浮尘: 'dust', 萤火虫: 'fireflies', 极光: 'aurora', 星空: 'galaxy', 飘落花瓣: 'petals', 甜蜜氛围: 'hearts', 恢复平静: 'none',
  心跳失控: 'heartbeat', 温暖拥抱: 'bloom', 克制思念: 'longing', 害羞脸红: 'blush', 心动飘起: 'hearts_rise', 告白: 'heart_burst', 接吻: 'kiss_mark', 求婚: 'ring',
  内心翻涌: 'ink', 重大冲击: 'shock', 落泪: 'tears', 屏息: 'breath_hold', 眩晕: 'dizzy', 进入回忆: 'flashback', 梦境恍惚: 'dreamy',
  电影定格: 'cinema', 聚光灯: 'spotlight', 对视推近: 'zoom', 慢动作: 'slowmo', 惊艳亮相: 'sparkle', 拍照闪光: 'flash_white', 黑场: 'fade_black', 白光苏醒: 'fade_white',
  彩纸: 'confetti', 烟花: 'fireworks', 流星: 'shooting_star', 放灯: 'lanterns',
  闪电: 'lightning', 起雾: 'fog', 彩虹: 'rainbow', 落叶: 'leaves', 月光: 'moonlight', 晚霞: 'sunset', 阳光照入: 'sun_rays', 水面涟漪: 'ripple', 落水: 'underwater', 结霜: 'frost',
  撞击: 'shake', 地震: 'quake', 爆炸: 'explosion', 受伤: 'flash_red', 玻璃碎裂: 'glass_crack', 突然起火: 'blaze', 警车: 'police', 救护车: 'ambulance', 致命威胁: 'danger', 被人盯着: 'watched', 飞奔追逐: 'speed', 倒计时: 'clock',
  手机震动: 'phone_buzz', 收到消息: 'notify', 系统故障: 'glitch', 监控画面: 'static', 全息投影: 'hologram', 超光速: 'warp',
  法阵: 'magic_circle', 魔法变化: 'enchant', 显出翅膀: 'wings', 血月: 'blood_moon', 兽瞳发光: 'wolf_eyes', 露出獠牙: 'fangs', 蝙蝠群: 'bats', 乌鸦群: 'crows', 蝴蝶: 'butterflies',
};
const AMBIENT_IDS = new Set(['rain', 'storm', 'wind', 'snowfall', 'blizzard', 'ice', 'candle', 'embers', 'inferno', 'blackout', 'drip', 'bokeh', 'neon', 'godrays', 'dust', 'fireflies', 'aurora', 'galaxy', 'petals', 'hearts', 'none']);

const WORK = { 作品名: 'title', 取向: 'orient', 题材标签: 'tags', 一句话卖点: 'hook', 作品简介: 'premise', 故事背景: 'intro', 世界规则: 'world', 演出风格: 'style', 相处规则: 'rules', 玩家身份: 'player', 每章节奏: 'pacing', 核心问题: 'question', 对白风格: 'dialogueStyle' };
const PERSON = { 全名: 'name', 常用称呼: 'short', 性别: 'gender', 年龄: 'age', 人物定位: 'tier', 能否发展感情: 'romanceable', 身份: 'role', 外貌和习惯: 'bio', 说话方式: 'voice', 性格: 'personality', 想要: 'want', 害怕: 'fear', 秘密: 'secret', 底线: 'boundaries', 对玩家的初始态度: 'toward_player', 吸引力: 'hooks', 开局认知: 'knows', 样例台词: 'sample_lines', 人设类型: 'archetype', 嘴上和心里: 'expression', 怎么调情: 'flirt', 怎么吃醋: 'jealousy', 玩家提要求时: 'when_asked' , 可解锁秘密: 'secrets', 怎么看其他人: 'others', 会怎么变: 'arc' };
const CHAPTER = { 章序: 'no', 章名: 'title', 时间: 'time', 眼前的事: 'event', 章节导语: 'text', 开场对白: 'lines', 本章目标: 'goal', 这一级的表现: 'behavior', 本章音乐: 'bgm', 小游戏: 'game', 事件: 'events' };
const SCENE = { 地点: 'place', 在场人物: 'present', 本章安排: 'beat', 参考对白: 'referenceDialogue', 已知事实: 'facts', 角色任务: 'tasks', 眼前邀请: 'invitation', 开场建议: 'suggestions', 环境氛围: 'ambient', 关键特效: 'moment', 主场景图: 'image', 高光图: 'highlight', 照片: 'photo', 这一级的表现: 'growth', 本章音乐: 'music', 小游戏: 'game', 事件: 'events' };
const ENDING = { 结局名: 'name', 触发条件: 'condition', 收束文字: 'text' };
const ART = { 封面: 'cover', 人物图: 'portrait', 开场视频: 'video' };
const NOT_FILLED = /^(?:不写|无|没有|选填)(?:[，,。].*)?$/;
/* 2026-11-07 故事卡升级：台阶、秘密、事件、小游戏、音乐（见《MIRU 故事卡全面升级方案》）。章节剧本照收，一章 = 一级台阶 */
const MOODS = ['暧昧', '慢热', '吃醋', '危险', '紧张', '冷战', '秘密', '悬疑', '背叛', '告白', '心碎', '道歉', '接吻', '枪火', '黑帮', '往事', '日常', '温柔', '天亮', '终章', '静默'];
const LOVE_STAGE = { 有点好奇: 12, 开始在意: 30, 心动: 55, 深深在意: 80 };
const GAME_PURPOSE = ['推进悬疑', '考验亲密', '暧昧时刻', '危机', '较劲'];
let GAME_IDS = null;
function gameIds() { /* 小游戏库在前端 app60_games100.js 里；按名字或 id 都能认 */
  if (GAME_IDS) return GAME_IDS; GAME_IDS = {};
  try { const src = require('fs').readFileSync(require('path').join(__dirname, '..', 'source', 'src', 'app60_games100.js'), 'utf8'); (src.match(/^[a-z_0-9]+\|[^|\n]+\|/gm) || []).forEach(l => { const [id, zh] = l.split('|'); GAME_IDS[id] = id; GAME_IDS[zh] = id; }); } catch (_) {}
  return GAME_IDS;
}
function kv(line) { const o = {}; String(line || '').split(/[；;]\s*/).forEach(part => { const m = part.match(/^\s*([^：:]{1,8})[：:]\s*([\s\S]*)$/); if (m) o[m[1].trim()] = m[2].trim(); }); return o; }

const bi = s => ({ zh: s, en: s });
const CN = '零一二三四五六七八九十';
function chineseNumber(s) {
  s = String(s).replace(/[第章\s]/g, '');
  if (/^\d+$/.test(s)) return +s;
  if (s === '十') return 10;
  const m = s.match(/^([一二三四五六七八九])?十([一二三四五六七八九])?$/);
  if (m) return (m[1] ? CN.indexOf(m[1]) : 1) * 10 + (m[2] ? CN.indexOf(m[2]) : 0);
  return CN.indexOf(s) > 0 ? CN.indexOf(s) : NaN;
}
const lines = s => String(s || '').split('\n').map(x => x.trim()).filter(Boolean);
const list = s => String(s || '').split(/[、，,；;\s]+/).map(x => x.trim()).filter(Boolean);
/* 「主角 / 次要角色」这种模板提示没改就交上来，当没填 */
const untouched = s => /\s[/／]\s/.test(s);
/* 同一栏里的「小标题：内容」，如 选项文字：… 选项后果：… */
function subFields(text, names) {
  const out = {}; let cur = null;
  /* 编剧常把几个小标题写在同一行，先断开 */
  const split = String(text || '').replace(new RegExp('\\s*(?=(?:' + names.join('|') + ')[：:])', 'g'), '\n');
  lines(split).forEach(line => {
    const m = line.match(/^([^：:]{1,8})[：:]\s*(.*)$/);
    if (m && names.includes(m[1])) { cur = m[1]; out[cur] = m[2]; }
    else if (cur) out[cur] += (out[cur] ? '\n' : '') + line;
  });
  Object.keys(out).forEach(k => { out[k] = out[k].replace(/[。，,；;\s]+$/, m => (/[。]/.test(m) && out[k].length > 30 ? '。' : '')); });
  return out;
}

/* 拆成一串 { label, value, line } */
function tokenize(text) {
  const items = []; let cur = null;
  String(text || '').replace(/^﻿/, '').replace(/\r\n?/g, '\n').split('\n').forEach((raw, i) => {
    const line = raw.replace(/^\s*(?:[#>*-]+\s*)+/, '').replace(/\*\*/g, '').trim();
    const m = line.match(/^【([^】]{1,16})】[：:]?\s*(.*)$/);
    if (m) { cur = { label: m[1].trim(), value: m[2], line: i + 1 }; items.push(cur); return; }
    if (/^第[一二三四五]部分/.test(line)) { cur = null; return; }
    if (cur && line) cur.value += (cur.value ? '\n' : '') + line;
  });
  return items;
}

function parseManuscript(text, opts) {
  opts = opts || {};
  const err = [], warn = [];
  const tokens = tokenize(text);
  if (!tokens.length) return { ok: false, err: ['没有识别到任何【栏目】，请确认是按模板写的'], warn, bible: null, images: [] };

  const work = {}, people = [], chapters = [], endings = [], art = { portraits: [] };
  let person = null, chapter = null, scene = null, ending = null;
  const newScene = () => { scene = { n: chapter.scenes.length + 1, tasks: {}, options: [], highlights: [], photos: [], moments: [] }; chapter.scenes.push(scene); return scene; };

  tokens.forEach(t => {
    const where = '第 ' + t.line + ' 行【' + t.label + '】';
    const label = t.label, value = t.value.trim();
    const opt = label.match(/^选项([一二三四五六七八九十\d]+)$/);
    if (label === '全名') { person = { line: t.line }; people.push(person); chapter = scene = ending = null; }
    else if (label === '章序') { chapter = { line: t.line, scenes: [] }; chapters.push(chapter); scene = null; person = ending = null; }
    else if (label === '结局名') { ending = { line: t.line }; endings.push(ending); chapter = scene = person = null; }

    if (label in WORK) { work[WORK[label]] = value; work['_line_' + WORK[label]] = t.line; return; }
    if (label in ART) {
      if (label === '封面') art.cover = subFields(value, ['画面描述'])['画面描述'] || value;
      else if (label === '开场视频') { /* 2026-11-07：每部剧开头 10 秒视频的脚本（见规范「开场视频」） */
        const f = subFields(value, ['一句话钩子', '悬念问题', '镜头脚本']);
        art.video = { hook: (f.一句话钩子 || '').trim(), question: (f.悬念问题 || '').trim(), script: (f.镜头脚本 || value).trim() };
      }
      else {
        const portraitRows = lines(value);
        if (portraitRows.length > 1 && portraitRows.every(l => /^[^：:]{1,20}[：:]/.test(l))) {
          portraitRows.forEach(l => { const m = l.match(/^([^：:]+)[：:]\s*([\s\S]*)$/); art.portraits.push({ who: m[1].trim(), desc: m[2].replace(/^画面描述[：:]\s*/, '').trim() }); });
          person = chapter = scene = ending = null;
          return;
        }
        const f = subFields(value, ['角色名', '画面描述']), m = value.match(/^([^：:\n]+)[：:]\s*([\s\S]*)$/);
        if (f.角色名) art.portraits.push({ who: f.角色名.trim(), desc: (f.画面描述 || '').trim() });
        else if (m) art.portraits.push({ who: m[1].trim(), desc: m[2].trim() });
        else err.push(where + '：要写成“角色名：画面描述”');
      }
      person = chapter = scene = ending = null;
      return;
    }
    if (person && label in PERSON) { person[PERSON[label]] = value; return; }
    if (ending && label in ENDING) { ending[ENDING[label]] = value; return; }
    if (chapter) {
      if (label in CHAPTER) { chapter[CHAPTER[label]] = value; if (!(label in SCENE)) return; }
      if (label === '地点' && scene && scene.place) newScene();
      if (label in SCENE || opt) {
        if (!scene) newScene();
        if (label === '角色任务') { lines(value).forEach(l => { const m = l.match(/^([^：:]+)[：:]\s*(.+)$/); if (m) scene.tasks[m[1].trim()] = m[2].trim(); else err.push(where + '：要写成“角色名：任务”，这一行不对：' + l.slice(0, 20)); }); return; }
        if (opt) { const f = subFields(value, ['选项文字', '选项后果', '角色任务', '特殊标记']); scene.options.push({ line: t.line, label, ...f }); return; }
        if (label === '高光图') { if (!NOT_FILLED.test(value)) { const f = subFields(value, ['图名', '画面描述', '触发条件']); if (f.图名 || f.画面描述) scene.highlights.push({ line: t.line, ...f }); else err.push(where + '：要写“图名：”“画面描述：”“触发条件：”'); } return; }
        /* 【照片】角色发给玩家、要解锁的照片（2026-11-06）。不写也行：玩家要看时导演会现拍 */
        if (label === '照片') { if (!NOT_FILLED.test(value)) { const f = subFields(value, ['图名', '画面描述', '谁发', '什么时候发']); if (f.图名 || f.画面描述) scene.photos.push({ line: t.line, ...f }); else err.push(where + '：要写“图名：”“画面描述：”“谁发：”“什么时候发：”'); } return; }
        if (label === '主场景图') { if (!NOT_FILLED.test(value)) { const f = subFields(value, ['图名', '画面描述']); scene.image = { name: f.图名 || '', desc: f.画面描述 || (f.图名 ? '' : value) }; } return; }
        if (label === '关键特效') { if (!NOT_FILLED.test(value)) lines(value).forEach(l => scene.moments.push({ line: t.line, text: l })); return; }
        if (label === '开场建议') { scene.suggestions = lines(value); return; }
        scene[SCENE[label]] = value;
        return;
      }
    }
    err.push(where + '：' + (label in PERSON ? '要写在某个人物的【全名】之后' : label in CHAPTER || label in SCENE ? '要写在某一章的【章序】之后' : label in ENDING ? '要写在【结局名】之后' : '不认识这个栏目，请对照模板') );
  });

  /* ---------- 作品 ---------- */
  const need = (v, msg) => { if (!String(v == null ? '' : v).trim()) err.push(msg); };
  need(work.title, '作品设定：缺【作品名】');
  need(work.hook, '作品设定：缺【一句话卖点】');
  need(work.premise, '作品设定：缺【作品简介】');
  need(work.intro, '作品设定：缺【故事背景】');
  need(work.world, '作品设定：缺【世界规则】');
  need(work.style, '作品设定：缺【演出风格】');
  need(work.rules, '作品设定：缺【相处规则】');
  const orient = { 男女: 'bg', 男男: 'bl', 女女: 'gl' }[String(work.orient || '').trim()];
  if (!orient) err.push('作品设定：【取向】只能填 男女、男男 或 女女');
  const player = subFields(work.player || '', ['性别', '身份', '处境', '藏着的事']);
  const playerGender = { 女: 'f', 女性: 'f', 男: 'm', 男性: 'm' }[String(player.性别 || '').trim()];
  if (!playerGender) err.push('作品设定：【玩家身份】要写“性别：女（或男）”');
  if (!String(player.身份 || '').trim()) err.push('作品设定：【玩家身份】要写“身份：……”');
  const pace = String(work.pacing || '').match(/最少聊\s*(\d+)\s*轮[^\d]*聊满\s*(\d+)\s*轮/);
  if (!pace) warn.push('作品设定：【每章节奏】没填成“最少聊 12 轮，聊满 18 轮”，先按 12 和 18 处理');

  /* ---------- 人物 ---------- */
  const seen = {}, keyOf = {};
  const cast = people.map((p, i) => {
    const key = 'c' + String(i + 1).padStart(2, '0'), tag = '人物“' + (p.name || '第 ' + (i + 1) + ' 个') + '”';
    ['name', 'short', 'role', 'bio', 'voice', 'personality', 'want', 'fear', 'boundaries', 'toward_player', 'hooks', 'knows'].forEach(k => { const zh = Object.keys(PERSON).find(x => PERSON[x] === k); need(p[k], tag + '：缺【' + zh + '】'); });
    const age = +String(p.age || '').replace(/[^\d]/g, '');
    if (!age) err.push(tag + '：【年龄】要写数字');
    else if (age < 18) err.push(tag + '：所有角色必须成年，现在写的是 ' + age + ' 岁');
    const gender = { 女: 'f', 女性: 'f', 男: 'm', 男性: 'm' }[String(p.gender || '').trim()];
    if (!gender) err.push(tag + '：【性别】要写 男 或 女');
    const tierText = String(p.tier || '').trim();
    if (!['主角', '次要角色', '次要'].includes(tierText)) err.push(tag + '：【人物定位】只能填 主角 或 次要角色');
    const romText = String(p.romanceable || '').trim();
    if (!['能', '不能'].includes(romText)) err.push(tag + '：【能否发展感情】只能填 能 或 不能');
    const sample = lines(p.sample_lines);
    if (sample.length < 5) warn.push(tag + '：【样例台词】建议 5 句，现在 ' + sample.length + ' 句');
    sample.filter(x => x.length > 45).forEach(x => warn.push(tag + '：样例台词超过 45 字：' + x.slice(0, 16) + '…'));
    if (String(p.knows || '').length > 160) warn.push(tag + '：【开局认知】只读前 160 字，现在 ' + p.knows.length + ' 字');
    if (String(p.personality || '').length > 600) warn.push(tag + '：【性格】只读前 600 字，现在 ' + p.personality.length + ' 字');
    if (String(p.hooks || '').length > 500) warn.push(tag + '：【吸引力】只读前 500 字，现在 ' + p.hooks.length + ' 字');
    if (tierText === '主角') [['archetype', '人设类型'], ['expression', '嘴上和心里'], ['flirt', '怎么调情'], ['jealousy', '怎么吃醋'], ['when_asked', '玩家提要求时']].forEach(([k, zh]) => { if (!String(p[k] || '').trim()) warn.push(tag + '：主角建议写【' + zh + '】，人物会更鲜明'); });
    [p.name, p.short].filter(Boolean).forEach(n => {
      n = String(n).trim();
      if (seen[n] && seen[n] !== key) err.push(tag + '：名字“' + n + '”和别的人物重复');
      seen[n] = key; keyOf[n] = key;
    });
    p.unlockable_secrets = p.secrets; p.other_views = p.others;
    const unlockable = lines(p.unlockable_secrets).filter(l => !NOT_FILLED.test(l)).map((l, si) => {
      const f = subFields(l, ['秘密名', '内容', '从第几章起', '好感到', '说出口的样子']);
      const minChapter = chineseNumber(f.从第几章起), minLove = { '有点好奇': 12, '开始在意': 30, '心动': 55, '深深在意': 80 }[f.好感到];
      if (!f.秘密名 || !f.内容 || !Number.isFinite(minChapter) || minLove == null) err.push(tag + '：可解锁秘密缺少有效名字、内容、章节或好感阶段');
      return { id: key + '_secret_' + (si + 1), name: f.秘密名 || '', text: f.内容 || '', from: minChapter || 1, minLove: minLove == null ? 100 : minLove, expression: f.说出口的样子 || '', source: l };
    });
    return { key, ...(unlockable.length ? { unlockableSecrets: unlockable } : {}), name: bi(p.name || ''), short: bi(p.short || ''), gender: gender || 'm', age: age || 0, tier: tierText === '主角' ? 'lead' : 'secondary', romanceable: romText !== '不能', role: bi(p.role || ''), bio: p.bio || '', voice: p.voice || '', personality: p.personality || '', want: p.want || '', fear: p.fear || '', secret: NOT_FILLED.test(p.secret || '') ? '' : (p.secret || ''), boundaries: p.boundaries || '', toward_player: p.toward_player || '', hooks: p.hooks || '', knows: p.knows || '', sample_lines: sample,
      ...Object.fromEntries(['archetype', 'expression', 'flirt', 'jealousy', 'when_asked', 'other_views', 'arc'].filter(k => String(p[k] || '').trim()).map(k => [k, p[k].trim()])) };
  });
  /* 【可解锁秘密】【怎么看其他人】【会怎么变】：要等所有人物的名字都登记好才能对上 */
  people.forEach((p, i) => {
    const c = cast[i], tag = '人物“' + (p.name || '第 ' + (i + 1) + ' 个') + '”';
    if (p.arc && !NOT_FILLED.test(p.arc)) c.arc = p.arc.trim();
    if (p.others && !NOT_FILLED.test(p.others)) { const o = {}; lines(p.others).forEach(l => { const m = l.match(/^([^：:]{1,12})[：:]\s*(.+)$/); if (!m) { err.push(tag + '【怎么看其他人】：要写成“名字：态度”，这一行不对：' + l.slice(0, 20)); return; } const k = keyOf[m[1].trim()]; if (k) o[k] = m[2].trim(); else err.push(tag + '【怎么看其他人】：“' + m[1] + '”没有对应的人物小传'); }); if (Object.keys(o).length) c.others = o; }
    if (p.secrets && !NOT_FILLED.test(p.secrets)) {
      const out = [];
      lines(p.secrets).forEach((l, si) => {
        const f = kv(l), text = f.内容 || '', title = f.秘密名 || f.标题 || '';
        if (!text) { err.push(tag + '【可解锁秘密】第 ' + (si + 1) + ' 条：要写“秘密名：…；内容：…；从第几章起：…；好感到：…；说出口的样子：…”'); return; }
        const stage = chineseNumber(String(f.从第几章起 || '').replace(/^第|章.*$/g, '')) || +String(f.从第几章起 || '').replace(/\D/g, '') || 1;
        const lv = f.好感到 ? (LOVE_STAGE[f.好感到] != null ? LOVE_STAGE[f.好感到] : +String(f.好感到).replace(/\D/g, '') || 0) : 0;
        if (f.好感到 && !(f.好感到 in LOVE_STAGE) && !/\d/.test(f.好感到)) warn.push(tag + '【可解锁秘密】“' + (title || text.slice(0, 8)) + '”：好感到只能写 有点好奇、开始在意、心动、深深在意，或一个数字');
        out.push(Object.assign({ id: 's' + (out.length + 1), title: title || text.slice(0, 12), text, unlock: { stage, love: lv } }, f.说出口的样子 ? { reveal: f.说出口的样子 } : {}));
      });
      if (out.length) c.secrets = out;
    }
  });
  if (!cast.length) err.push('人物小传：至少要写一个人物');
  if (!chapters.length) err.push('分章大纲：至少要写一章');
  if (!endings.length) err.push('结局：至少要写一个结局');

  /* ---------- 结局 ---------- */
  const endingIdOf = {}, usedEndingIds = new Set();
  const endingList = endings.map((e, i) => {
    const tag = '结局“' + (e.name || '第 ' + (i + 1) + ' 个') + '”';
    need(e.name, tag + '：缺【结局名】'); need(e.condition, tag + '：缺【触发条件】'); need(e.text, tag + '：缺【收束文字】');
    let id = /离开|提前/.test(String(e.name || '')) && !usedEndingIds.has('leave') ? 'leave' : 'end' + (i + 1);
    usedEndingIds.add(id); endingIdOf[String(e.name || '').trim()] = id;
    return { id, name: bi(e.name || ''), condition: e.condition || '', text: e.text || '' };
  });
  if (endings.length && !usedEndingIds.has('leave')) warn.push('结局：建议写一个“提前离开”的结局（结局名里带“离开”二字），玩家说“我想离开这里”时会用到');

  /* ---------- 章节 ---------- */
  const images = [];
  if (art.cover) images.push({ slot: 'cover', kind: '封面', name: '封面', desc: art.cover });
  else warn.push('图片：没有写【封面】的画面描述');
  art.portraits.forEach(p => { const k = keyOf[p.who]; if (!k) err.push('图片：【人物图】里的“' + p.who + '”没有对应的人物小传'); else images.push({ slot: 'char_' + k, kind: '人物图', name: p.who, desc: p.desc }); });

  const names = name => {
    const k = keyOf[String(name).trim()];
    return k;
  };
  const fxId = (name, tag) => {
    const n = String(name || '').trim();
    if (FX_NAMES[n]) return FX_NAMES[n];
    warn.push(tag + '：特效“' + n + '”不在特效表里，已跳过，审查时请换成最接近的一个');
    return null;
  };
  const taskMap = (tasks, tag) => {
    const out = {};
    Object.entries(tasks || {}).forEach(([who, task]) => { const k = names(who); if (k) out[k] = task; else err.push(tag + '：角色任务里的“' + who + '”没有对应的人物小传'); });
    return out;
  };

  chapters.sort((a, b) => (chineseNumber(a.no) || 0) - (chineseNumber(b.no) || 0));
  const outChapters = chapters.map((c, ci) => {
    const n = ci + 1, tag = '第 ' + n + ' 章';
    if (chineseNumber(c.no) !== n) err.push(tag + '（第 ' + c.line + ' 行）：【章序】应为第 ' + n + ' 章，请检查有没有跳号或重复');
    need(c.title, tag + '：缺【章名】'); need(c.time, tag + '：缺【时间】'); need(c.event, tag + '：缺【眼前的事】'); need(c.text, tag + '：缺【章节导语】'); need(c.goal, tag + '：缺【本章目标】');
    if (!c.scenes.length) err.push(tag + '：缺【地点】和【本章安排】');
    const scenes = c.scenes.map((s, si) => {
      const id = 'c' + String(n).padStart(2, '0') + 's' + String(si + 1).padStart(2, '0'), st = tag + (c.scenes.length > 1 ? '第 ' + (si + 1) + ' 场' : '');
      need(s.place, st + '：缺【地点】'); need(s.beat, st + '：缺【本章安排】'); need(s.present, st + '：缺【在场人物】'); need(s.invitation, st + '：缺【眼前邀请】');
      if (!(s.suggestions && s.suggestions.length)) err.push(st + '：缺【开场建议】');
      const present = list(s.present).map(p => { const k = names(p); if (!k) err.push(st + '：【在场人物】里的“' + p + '”没有对应的人物小传'); return k; }).filter(Boolean);
      const payload = taskMap(s.tasks, st);
      present.filter(k => !payload[k]).forEach(k => { const c0 = cast.find(x => x.key === k); warn.push(st + '：在场的“' + c0.short.zh + '”没有写【角色任务】'); });
      const options = (s.options || []).map((o, oi) => {
        const ot = st + '【' + o.label + '】', out = { t: String(o.选项文字 || '').trim(), key: String.fromCharCode(65 + oi), effect: String(o.选项后果 || '').trim() };
        if (!out.t) err.push(ot + '（第 ' + o.line + ' 行）：缺“选项文字：”');
        if (!out.effect) warn.push(ot + '：建议写“选项后果：”，导演靠它安排回应');
        const pay = {};
        lines(o.角色任务).forEach(l => l.split(/(?<=[。！？!?；;])\s*(?=[^：:。！？!?；;]{1,12}[：:])/).forEach(part => { const m = part.match(/^([^：:]{1,12})[：:]\s*(.+)$/); if (!m) return; const k = names(m[1]); if (k) pay[k] = m[2].trim(); else err.push(ot + '：角色任务里的“' + m[1] + '”没有对应的人物小传'); }));
        if (Object.keys(pay).length) out.actor_payload = pay;
        const mark = String(o.特殊标记 || '').trim(), state = {};
        if (/朋友/.test(mark)) state.romanceMode = 'friends';
        const em = mark.match(/结局[：:]\s*(.+)$/);
        if (em) { const id = endingIdOf[em[1].trim()]; if (id) state.ending = id; else err.push(ot + '：特殊标记里的结局“' + em[1].trim() + '”没有写在结局部分'); }
        if (Object.keys(state).length) out.state = state;
        return out;
      });
      const sc = { id, place: bi(s.place || ''), present, beat: s.beat || '', ref_lines: [], actor_payload: payload, interaction: { invitation: s.invitation || '', suggestions: s.suggestions || [] } };
      if(s.facts)sc.facts=lines(s.facts);
      if(s.referenceDialogue){
        lines(s.referenceDialogue).forEach(l=>{const m=l.match(/^([^：:]{1,20})[：:]\s*(.+)$/),who=m&&names(m[1]);
          if(!m||!who){err.push(st+'【参考对白】：要写已登记的角色名和台词：'+l.slice(0,40));return;}
          if(!present.includes(who)){err.push(st+'【参考对白】：说话的人不在本场');return;}
          sc.ref_lines.push({who,line:m[2].trim()});
        });
      }
      if (options.length) sc.choice = { q: '', options };
      if (s.growth) sc.growth = taskMap(Object.fromEntries(lines(s.growth).map(l => { const m = l.match(/^([^：:]+)[：:]\s*(.*)$/); return m ? [m[1].trim(),m[2]] : ['',l]; })), st + '【这一级的表现】');
      if (s.events) sc.events = lines(s.events);
      if (s.music && !NOT_FILLED.test(s.music)) {
        sc.musicLabel = s.music;
        sc.bgm = ({ 紧张:'standoff', 吃醋:'jealousy', 悬疑:'clue', 燃:'dragon_flight', 暧昧:'masquerade', 悲伤:'memory_lane', 背叛:'betrayal', 温暖:'reunion' })[s.music] || 'clue';
      }
      if (s.game && !NOT_FILLED.test(s.game)) {
        const f = subFields(s.game, ['用途','玩法','出现时机','赌注','赢了','输了','不玩']);
        const kind = ({ 真心话骰:'truth', 赌一把:'bet', 记旋律:'melody', 找线索:'clue', 默契考验:'rapport', 还原经过:'timeline' })[f.玩法];
        if (kind) {
          if (!f.出现时机 || !f.赢了 || !f.输了 || !f.不玩) err.push(st + '【小游戏】：缺有效玩法、出现时机或三种结果');
          sc.game = { id:'game_' + id, kind, name:f.玩法 || '', purpose:f.用途 || '', when:f.出现时机 || '', stake:f.赌注 || '', outcomes:{ WIN:f.赢了 || '', LOSE:f.输了 || '', SKIP:f.不玩 || '' }, source:s.game };
        }
      }
      const fx = {};
      if (s.ambient && !NOT_FILLED.test(s.ambient)) { const id = fxId(s.ambient, st + '【环境氛围】'); if (id) { if (AMBIENT_IDS.has(id)) fx.ambient = id; else warn.push(st + '【环境氛围】：“' + s.ambient + '”是瞬间特效，请写到【关键特效】'); } }
      const planned = [];
      (s.moments || []).forEach(m => {
        const p = m.text.match(/^([^：:]+?)(?:[。，,；;]?\s*触发条件)?[：:]\s*(.*)$/), name = (p ? p[1] : m.text).replace(/^特效名[：:]?/, '').trim(), when = p ? p[2].replace(/^触发条件[：:]\s*/, '').trim() : '';
        const id = fxId(name, st + '【关键特效】'); if (!id) return;
        if (when) planned.push({ id, when }); else if (fx.moment) warn.push(st + '：没写触发条件的关键特效只放第一个，“' + name + '”已跳过'); else fx.moment = id;
      });
      if (Object.keys(fx).length) sc.fx = fx;
      if (planned.length) sc.fxPlan = { moments: planned };
      if (s.image) images.push({ slot: 'bg_' + id, kind: '主场景图', chapter: n, name: s.image.name, desc: s.image.desc });
      else warn.push(st + '：没有写【主场景图】');
      if (s.highlights.length > 2) warn.push(st + '：高光图建议最多 2 张，现在 ' + s.highlights.length + ' 张');
      const hl = s.highlights.map((h, hi) => {
        const slot = 'hl_' + id + '_' + (hi + 1);
        if (!h.触发条件) err.push(st + '【高光图】（第 ' + h.line + ' 行）：缺“触发条件：”');
        images.push({ slot, kind: '高光图', chapter: n, name: h.图名 || '', desc: h.画面描述 || '', when: h.触发条件 || '' });
        return { id: slot, name: h.图名 || '', when: h.触发条件 || '' };
      });
      if (hl.length) sc.highlights = hl;
      const ph = s.photos.map((p, pi) => {
        const slot = 'ph_' + id + '_' + (pi + 1), who = p.谁发 ? names(p.谁发) || '' : '';
        if (p.谁发 && !who) err.push(st + '【照片】（第 ' + p.line + ' 行）：“谁发”写的「' + p.谁发 + '」不在人物小传里');
        images.push({ slot, kind: '照片', chapter: n, name: p.图名 || '', desc: p.画面描述 || '', when: p.什么时候发 || '' });
        return Object.assign({ id: slot, name: p.图名 || '', when: p.什么时候发 || '' }, who ? { who } : {});
      });
      if (ph.length) sc.photos = ph;
      return sc;
    });
    /* 【开场对白】：章节卡最后两句人物的话，让玩家知道怎么接 */
    const opening = [];
    lines(c.lines).forEach(l => { const m = l.match(/^([^：:]{1,12})[：:]\s*(.+)$/); if (!m) { err.push(tag + '【开场对白】：要写成“角色名：台词”，这一行不对：' + l.slice(0, 20)); return; } const k = names(m[1]); if (!k) { err.push(tag + '【开场对白】：“' + m[1] + '”没有对应的人物小传'); return; } const say = m[2].trim().replace(/^[“"「]|[”"」]$/g, ''); if (say.length > 45) warn.push(tag + '【开场对白】：“' + say.slice(0, 12) + '…”超过 45 字'); opening.push({ who: k, say }); });
    if (!opening.length) warn.push(tag + '：建议写两句【开场对白】，玩家一进章就知道怎么接话');
    if (opening.length > 2) warn.push(tag + '【开场对白】：只显示前两句');
    if (scenes[0]) opening.filter(o => !scenes[0].present.includes(o.who)).forEach(o => err.push(tag + '【开场对白】：说话的人不在本章【在场人物】里'));
    const extra = {};
    if (c.behavior && !NOT_FILLED.test(c.behavior)) { const o = {}; lines(c.behavior).forEach(l => { const m = l.match(/^([^：:]{1,12})[：:]\s*(.+)$/); const k = m && names(m[1]); if (k) o[k] = m[2].trim(); else err.push(tag + '【这一级的表现】：要写成“角色名：表现”，这一行不对：' + l.slice(0, 20)); }); if (Object.keys(o).length) extra.behavior = o; }
    if (c.bgm && !NOT_FILLED.test(c.bgm)) { const m = String(c.bgm).trim(); if (MOODS.includes(m)) extra.bgm = m; else warn.push(tag + '【本章音乐】：“' + m + '”不在情绪表里（' + MOODS.join('、') + '），已跳过'); }
    if (c.game && !NOT_FILLED.test(c.game)) {
      const f = subFields(c.game, ['用途', '玩法', '出现时机', '赌注', '赢了', '输了', '不玩']), id = gameIds()[String(f.玩法 || '').trim()];
      if (!id && !scenes.some(s => s.game && s.game.source === c.game)) err.push(tag + '【小游戏】：玩法“' + (f.玩法 || '') + '”不在小游戏库里，请写库里的名字（如 找线索、赌一把、读心）');
      else if (id) {
        if (f.用途 && !GAME_PURPOSE.includes(f.用途.trim())) warn.push(tag + '【小游戏】：用途只能写 ' + GAME_PURPOSE.join('、'));
        ['赢了', '输了', '不玩'].forEach(k => { if (!String(f[k] || '').trim()) err.push(tag + '【小游戏】：缺“' + k + '：”，三种结果都要写，输了也要有戏，不能是死路'); });
        extra.game = [{ id, purpose: (f.用途 || '').trim(), when: (f.出现时机 || '').trim(), stakes: (f.赌注 || '').trim(), win: (f.赢了 || '').trim(), lose: (f.输了 || '').trim(), skip: (f.不玩 || '').trim() }];
      }
    }
    if (c.events && !NOT_FILLED.test(c.events)) { const ev = lines(c.events).map((l, ei) => { const m = l.match(/^(.*?)[（(]触发[：:]\s*([^）)]*)[）)]\s*$/); return { id: 'c' + n + 'e' + (ei + 1), text: (m ? m[1] : l).trim(), ...(m ? { when: m[2].trim() } : {}) }; }).filter(e => e.text); if (ev.length) extra.events = ev; }
    return Object.assign({ n, title: bi(c.title || ''), goal: c.goal || '', introduction: Object.assign({ time: c.time || '', event: c.event || '', text: c.text || '' }, opening.length ? { lines: opening.slice(0, 2) } : {}), scenes }, extra);
  });

  const bible = {
    key: opts.id || '', title: bi(work.title || ''), hook: bi(work.hook || ''), pitch: bi(work.hook || ''), ...(String(work.question || '').trim() ? { question: bi(work.question.trim()) } : {}), premise: bi(work.premise || ''), intro: bi(work.intro || ''), orient: orient || 'bg', tags: list(work.tags).slice(0, 8),
    world: work.world || '', style: work.style || '', coreQuestion: work.question || '', state: {}, relations: [], games_on: outChapters.some(c => c.scenes.some(s => s.game)), playable: ['me'],
    player: { key: 'me', name: { zh: '你', en: 'You' }, short: { zh: '你', en: 'You' }, gender: playerGender || 'f', role: bi(player.身份 || ''), ...(String(player.处境 || '').trim() ? { pressure: bi(player.处境.trim()) } : {}), ...(String(player.藏着的事 || '').trim() && !NOT_FILLED.test(player.藏着的事.trim()) ? { secret: bi(player.藏着的事.trim()) } : {}) },
    cast, chapters: outChapters, endings: endingList,
    experience: { schema: 1, narration: {schema:2,enabled:true,mode:'story',timeoutMs:14000,maxChars:450}, context: {schema:1,enabled:true}, focus: 'player', storyIntroduction: true, chapterIntroduction: true, actionView: 'thirdPerson', choiceDock: 'contextual', allowFreeContinue: true, pacing: { mode: 'player-controlled', minExchanges: pace ? +pace[1] : 12, targetExchanges: pace ? +pace[2] : 18, allowExplicitSkip: true }, companionRules: bi(work.rules || '') },
    capabilities: { freeConversation: true, chapterNavigation: 'manual' },
    source: 'manuscript', ...(work.dialogueStyle?{dialogueStyle:work.dialogueStyle,dialoguePolicy:{schema:1,maxChars:90}}:{}),
  };
  if (art.video) bible.openingVideo = art.video;
  else warn.push('开场视频：没有写【开场视频】，上线前要补一段 10 秒的开场视频脚本');
  if (cast.length === 1) bible.solo98 = 1;
  const stats = { chapters: outChapters.length, scenes: outChapters.reduce((a, c) => a + c.scenes.length, 0), people: cast.length, endings: endingList.length, options: outChapters.reduce((a, c) => a + c.scenes.reduce((b, s) => b + ((s.choice && s.choice.options.length) || 0), 0), 0), images: images.length, authoredFx: outChapters.reduce((a, c) => a + c.scenes.reduce((b, s) => b + (s.fx ? Object.keys(s.fx).length : 0) + (s.fxPlan ? s.fxPlan.moments.length : 0), 0), 0) };
  return { ok: !err.length, err, warn, bible, images, stats };
}

module.exports = { parseManuscript, FX_NAMES, AMBIENT_IDS };
