// 剧本样式检查 —— 纯函数，CLI（tools/script-style-check.mjs）和后台「D先生审查」共用这一份。
//
// 开场和每章导语的版式写死在前端（app98_story.js 的 introHTML98 + shell.html 的 .entry98）：
// 标题、时间 / 地点 / 人物 / 眼前的事各占一行，全部左对齐。作者只提供内容，这里查的是
// 「内容能不能被这个固定版式正确显示」—— 字段缺没缺、有没有自带标签或排版符号、长度放不放得下。
//
// err = 版式会坏，不能上线；warn = 能显示但不好看，建议改。
// 只有 experience.schema === 1 的作品才有固定开场卡，其他作品只查章节标题和选项长度。

const LIMIT = { storyIntro: 400, storyParas: 4, title: 16, time: 18, place: 18, event: 40, text: 120, option: 30, suggestion: 30 };
const LABEL = /^\s*(?:时间|地点|人物|眼前的事|故事背景|Time|Place|Present|Now)\s*[：:]/;
const MARKUP = /<[a-z/!][^>]*>|\*\*|^#{1,6}\s|⟦|⟧/im;
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
const CHAPTER_PREFIX = /^\s*(?:第\s*[一二三四五六七八九十百零\d]+\s*章|chapter\s*\d+)/i;

/* 特效 id：要和前端 source/src/app128_fxlib.js、app59_fx100.js 一致（tools/fx-selftest.mjs 对账）。
   FX_IDS 是推荐表；FX_LEGACY 是老特效，还能播，但写新剧本不推荐 */
const FX_IDS = new Set('none rain storm wind snowfall blizzard ice candle embers inferno blackout drip bokeh neon godrays dust fireflies aurora galaxy petals hearts heartbeat bloom longing blush hearts_rise heart_burst kiss_mark ring ink shock tears breath_hold dizzy flashback dreamy cinema spotlight zoom slowmo sparkle flash_white fade_black fade_white confetti fireworks shooting_star lanterns lightning fog rainbow leaves moonlight sunset sun_rays ripple underwater frost shake quake explosion flash_red glass_crack blaze police ambulance danger watched speed clock phone_buzz notify glitch static hologram warp magic_circle enchant wings blood_moon wolf_eyes fangs bats crows butterflies'.split(' '));
const FX_LEGACY = new Set('sparks downpour snow sakura rose_petals starry balloons bubbles money_rain diamonds feathers notes sleepy sweat anger question city_bokeh smoke steam cherries cake gift hold_hands sunflowers cats puppies trophy dice cards key lock type'.split(' '));
function checkFxId(id, where, err, warn) {
  const x = String(id == null ? '' : id).trim();
  if (!x) return;
  if (FX_LEGACY.has(x)) warn.push(where + '：特效「' + x + '」是老特效，建议换成推荐表里的');
  else if (!FX_IDS.has(x)) err.push(where + '：没有「' + x + '」这个特效，见 scripts/syntax.md');
}
function checkFxField(fx, where, err, warn) {
  if (fx == null) return;
  if (typeof fx !== 'object') { err.push(where + '：fx 要写成 {"ambient":"rain","moment":"lightning"}'); return; }
  checkFxId(fx.ambient, where + ' fx.ambient', err, warn);
  checkFxId(fx.moment, where + ' fx.moment', err, warn);
}

/* 环境氛围是进章就显示、一直持续的画面。文字里一个字都没写到，玩家会觉得突兀（2026-11-06《黑港》第 1 章：暴雨雷电，剧情里没有雨）。
   和前端 app128_fxlib.js 的 MENTION 是同一份 */
const AMB_MENTION = { rain: [/雨/, '下雨'], storm: [/雨|雷(?:声|电|鸣|暴)|打雷|闪电/, '暴雨雷电'], wind: [/(?:大|狂|寒|海|夜|冷|晚)风|风(?:声|很大|吹|刮|灌)/, '大风'], snowfall: [/雪/, '下雪'], blizzard: [/雪/, '暴风雪'], ice: [/冰|冻|严寒/, '结冰的严寒'],
  candle: [/烛/, '烛光'], embers: [/炉火|篝火|壁炉/, '炉火、篝火'], inferno: [/火灾|着火|火光|大火|火势/, '火灾现场'], blackout: [/停电|断电|灯.{0,4}(?:灭|黑)|应急灯|黑暗/, '停电'], drip: [/漏水|滴水|地下室/, '地下室、漏水'],
  neon: [/霓虹|夜店/, '霓虹夜店'], godrays: [/阳光|日光|光束|晨光/, '暖阳光束'], dust: [/灰尘|浮尘|尘埃/, '浮尘'], fireflies: [/萤火/, '萤火虫'], aurora: [/极光/, '极光'], galaxy: [/星空|星星|银河/, '星空'], petals: [/花瓣/, '飘落的花瓣'] };
function checkAmbientText(fx, text, where, warn) {
  const id = fx && typeof fx === 'object' ? String(fx.ambient || '').trim() : '', m = AMB_MENTION[id];
  if (m && !m[0].test(text)) warn.push(where + '：环境氛围是「' + m[1] + '」，但时间、导语和本章安排里都没写到，玩家一进章就看到它会觉得突兀。请在时间或导语里写一句，或者把环境氛围改成「无」');
}

const zhOf = v => (v && typeof v === 'object') ? String(v.zh || v.en || '') : String(v == null ? '' : v);

function checkBible(b) {
  const err = [], warn = [], stats = { chapters: 0, scenes: 0, schema: 0 };
  if (!b || typeof b !== 'object') return { ok: false, err: ['不是有效的故事圣经（文件为空或不是对象）'], warn, stats };
  const chapters = Array.isArray(b.chapters) ? b.chapters : [];
  if (!chapters.length) err.push('没有章节');
  stats.chapters = chapters.length;
  const exp = b.experience && b.experience.schema === 1 ? b.experience : null;
  stats.schema = exp ? 1 : 0;
  const castKeys = new Set((Array.isArray(b.cast) ? b.cast : []).map(c => c && c.key));

  const single = (where, value, max, required) => {
    const s = zhOf(value).trim();
    if (!s) { if (required) err.push(where + '：缺失'); return s; }
    if (/\n/.test(s)) err.push(where + '：不能换行，版式固定一行一项');
    if (LABEL.test(s)) err.push(where + '：不要自带「时间：」这类标签，前端会加');
    if (MARKUP.test(s)) err.push(where + '：不要带 HTML / Markdown / 指令符号');
    if (s.length > max) warn.push(where + '：' + s.length + ' 字，建议不超过 ' + max + ' 字');
    return s;
  };

  if (exp) {
    if (exp.storyIntroduction) {
      const intro = zhOf(b.intro).trim();
      if (!intro) err.push('故事背景（intro）：缺失');
      else {
        if (MARKUP.test(intro)) err.push('故事背景（intro）：不要带 HTML / Markdown / 指令符号');
        if (LABEL.test(intro)) err.push('故事背景（intro）：不要自带「故事背景：」标题，前端会加');
        if (intro.length > LIMIT.storyIntro) warn.push('故事背景（intro）：' + intro.length + ' 字，建议不超过 ' + LIMIT.storyIntro + ' 字，否则一屏放不下');
        const paras = intro.split(/\n\s*\n/).filter(Boolean).length;
        if (paras > LIMIT.storyParas) warn.push('故事背景（intro）：' + paras + ' 段，建议不超过 ' + LIMIT.storyParas + ' 段');
      }
    }
    const pacing = exp.pacing;
    if (pacing) {
      const min = +pacing.minExchanges, target = +pacing.targetExchanges;
      if (pacing.minExchanges != null && !(min >= 1)) err.push('experience.pacing.minExchanges：必须是正整数');
      if (pacing.targetExchanges != null && !(target >= 1)) err.push('experience.pacing.targetExchanges：必须是正整数');
      if (min >= 1 && target >= 1 && min > target) err.push('experience.pacing：minExchanges（' + min + '）不能大于 targetExchanges（' + target + '）');
      if (min >= 1 && min < 3) warn.push('experience.pacing.minExchanges：' + min + ' 轮偏少，「下一章」按钮会很快出现');
    } else warn.push('experience.pacing：未配置，将按默认轮数显示「下一章」按钮');
    if (b.capabilities && b.capabilities.chapterNavigation && b.capabilities.chapterNavigation !== 'manual') err.push('capabilities.chapterNavigation：必须是 manual，换章只能由玩家点按钮');
  }

  chapters.forEach((c, i) => {
    const tag = '第 ' + (c && c.n != null ? c.n : i + 1) + ' 章';
    const scenes = (c && Array.isArray(c.scenes)) ? c.scenes : [];
    stats.scenes += scenes.length;
    if (!scenes.length) err.push(tag + '：没有场景');
    checkFxField(c && c.fx, tag, err, warn);
    const title = single(tag + ' 标题', c && c.title, LIMIT.title, true);
    if (CHAPTER_PREFIX.test(title)) err.push(tag + ' 标题：不要写「第 N 章」，前端会加');
    if (exp && exp.chapterIntroduction) {
      const intro = c && c.introduction;
      if (!intro || typeof intro !== 'object') err.push(tag + ' 导语（introduction）：缺失');
      else {
        const first = scenes[0] || {};
        single(tag + ' 导语 time', intro.time, LIMIT.time, true);
        single(tag + ' 导语 event', intro.event, LIMIT.event, true);
        single(tag + ' 地点（scenes[0].place）', first.place, LIMIT.place, true);
        const text = zhOf(intro.text).trim();
        if (!text) err.push(tag + ' 导语 text：缺失');
        else {
          if (LABEL.test(text)) err.push(tag + ' 导语 text：不要自带「时间：」这类标签，前端会加');
          if (MARKUP.test(text)) err.push(tag + ' 导语 text：不要带 HTML / Markdown / 指令符号');
          if (text.length > LIMIT.text) warn.push(tag + ' 导语 text：' + text.length + ' 字，建议不超过 ' + LIMIT.text + ' 字');
          if (text === zhOf(intro.event).trim()) warn.push(tag + ' 导语：text 和 event 完全相同，会重复显示');
        }
        (Array.isArray(intro.lines) ? intro.lines : []).forEach((l, n) => {
          if (!castKeys.has(l && l.who)) err.push(tag + ' 开场对白 ' + (n + 1) + '：说话的人不在 cast 里');
          const say = zhOf(l && l.say).trim();
          if (!say) err.push(tag + ' 开场对白 ' + (n + 1) + '：没有台词');
          else if (say.length > 45) warn.push(tag + ' 开场对白 ' + (n + 1) + '：' + say.length + ' 字，建议不超过 45 字');
        });
        const present = Array.isArray(first.present) ? first.present : [];
        if (!present.length) err.push(tag + ' 人物（scenes[0].present）：缺失');
        present.filter(k => !castKeys.has(k)).forEach(k => err.push(tag + ' 人物（scenes[0].present）：「' + k + '」不在 cast 里'));
      }
    }
    scenes.forEach((s, si) => {
      checkFxField(s && s.fx, tag + ' ' + ((s && s.id) || ''), err, warn);
      { const intro = (si === 0 && c && c.introduction) || {};
        checkAmbientText((s && s.fx) || (si === 0 && c && c.fx), [intro.time, intro.event, intro.text, s && s.place, s && s.beat].map(zhOf).join(' '), tag + ' ' + ((s && s.id) || ''), warn); }
      ((s && s.fxPlan && s.fxPlan.moments) || []).forEach(m => { checkFxId(m && m.id, tag + ' 关键特效', err, warn); if (!(m && String(m.when || '').trim())) err.push(tag + ' 关键特效：缺触发条件'); });
      ((s && s.highlights) || []).forEach(h => { if (!(h && h.id)) err.push(tag + ' 高光图：缺 id'); if (!(h && String(h.when || '').trim())) err.push(tag + ' 高光图：缺触发条件'); });
      const options = (s && s.choice && Array.isArray(s.choice.options)) ? s.choice.options : [];
      options.forEach((o, n) => {
        const t = zhOf(o && o.t).trim();
        if (!t) err.push(tag + ' ' + (s.id || '') + ' 选项 ' + (n + 1) + '：没有文字');
        else if (t.length > LIMIT.option) warn.push(tag + ' ' + (s.id || '') + ' 选项 ' + (n + 1) + '：' + t.length + ' 字，建议不超过 ' + LIMIT.option + ' 字');
      });
      const sugg = (s && s.interaction && Array.isArray(s.interaction.suggestions)) ? s.interaction.suggestions : [];
      sugg.forEach((x, n) => {
        const t = zhOf(x);
        if (t.length > LIMIT.suggestion) warn.push(tag + ' ' + (s.id || '') + ' 建议回复 ' + (n + 1) + '：' + t.length + ' 字，建议不超过 ' + LIMIT.suggestion + ' 字');
      });
    });
  });
  if (exp && EMOJI.test(zhOf(b.intro))) warn.push('故事背景（intro）：含表情符号，和固定版式不协调');
  return { ok: !err.length, err, warn, stats };
}

/* DSL 剧本（后台「剧本生产」）：章节标题同样由前端写死版式 */
function checkDsl(md) {
  const err = [], warn = [];
  let chapters = 0;
  String(md || '').replace(/\r\n?/g, '\n').split('\n').forEach(raw => {
    const fx = raw.trim().match(/^⟦FX\|([^|⟧]*)⟧$/);
    if (fx) checkFxId(fx[1], '⟦FX⟧', err, warn);
    const m = raw.trim().match(/^#+\s*CHAPTER\s+(\d+)\s*(?:[｜|]\s*(.*))?$/i);
    if (!m) return;
    chapters++;
    const tag = '第 ' + m[1] + ' 章', title = String(m[2] || '').trim();
    if (!title) { err.push(tag + ' 标题：缺失'); return; }
    if (CHAPTER_PREFIX.test(title)) err.push(tag + ' 标题：不要写「第 N 章」，前端会加');
    if (MARKUP.test(title)) err.push(tag + ' 标题：不要带 HTML / Markdown / 指令符号');
    if (title.length > LIMIT.title) warn.push(tag + ' 标题：' + title.length + ' 字，建议不超过 ' + LIMIT.title + ' 字');
  });
  return { ok: !err.length, err, warn, stats: { chapters } };
}

module.exports = { checkBible, checkDsl, LIMIT, FX_IDS, FX_LEGACY };
