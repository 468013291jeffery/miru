// 剧本结构的运行时校验（发布前 / 续写生成后都能用）
//
// 只查「能不能被正确播出来」，不查作者约定。
// content/validate.py 管的是内部那 37 部的写法（looks 必须从既有角色复制、n 与 wid 对应……），
// 那些规则对玩家作品不适用，也不该搬过来。

const LANGS = ['en', 'zh', 'ja', 'ko', 'es'];

/** 一段文本是否至少有一种语言的非空字符串。返回 {ok, why}。 */
function textOk(v) {
  if (typeof v === 'string') return { ok: v.trim().length > 0 };
  if (v && typeof v === 'object') {
    for (const k of Object.keys(v)) {
      if (typeof v[k] === 'string' && v[k].trim()) return { ok: true };
    }
  }
  return { ok: false, why: 'needs text in at least one language' };
}

/**
 * @param {object} pack 玩家发布/生成的剧本
 * @returns {{ok:boolean, errors:{path:string, why:string}[]}}
 */
function planValid(pack) {
  const errors = [];
  const bad = (path, why) => errors.push({ path, why });

  if (!pack || typeof pack !== 'object') return { ok: false, errors: [{ path: 'pack', why: 'not an object' }] };

  for (const k of ['title', 'hook', 'logline']) {
    if (pack[k] == null) continue;                       // 可选
    const t = textOk(pack[k]);
    if (!t.ok) bad(k, t.why || 'empty');
  }

  const castIds = new Set((Array.isArray(pack.cast) ? pack.cast : []).map(c => c && c.id).filter(Boolean));
  if (castIds.size < 1) bad('cast', 'at least one character with an id');

  const chapters = Array.isArray(pack.chapters) ? pack.chapters : [];
  if (!chapters.length) bad('chapters', 'at least one chapter');

  chapters.forEach((ch, i) => {
    const at = `chapters[${i}]`;
    if (!ch || typeof ch !== 'object') return bad(at, 'not an object');
    for (const k of ['t', 'goal']) {
      if (ch[k] == null) continue;
      const t = textOk(ch[k]);
      if (!t.ok) bad(`${at}.${k}`, t.why || 'empty');
    }
    const beats = Array.isArray(ch.beats) ? ch.beats : [];
    if (!beats.length) bad(`${at}.beats`, 'at least one beat');
    beats.forEach((b, j) => {
      if (!Array.isArray(b) || b.length < 3) return bad(`${at}.beats[${j}]`, 'needs [who, kind, text]');
      const [who, kind, text] = b;
      if (who !== 'n' && !castIds.has(who)) bad(`${at}.beats[${j}].who`, `unknown speaker "${who}"`);
      if (!['say', 'act', 'think'].includes(kind)) bad(`${at}.beats[${j}].kind`, `"${kind}" is not say/act/think`);
      const t = textOk(text);
      if (!t.ok) bad(`${at}.beats[${j}].text`, t.why || 'empty');
    });
    const choices = Array.isArray(ch.choices) ? ch.choices : [];
    if (choices.length < 2) bad(`${at}.choices`, 'at least 2 choices');
    choices.forEach((c, j) => {
      const ca = `${at}.choices[${j}]`;
      if (!c || typeof c !== 'object') return bad(ca, 'not an object');
      if (!c.k) bad(`${ca}.k`, 'needs a key');
      const t = textOk(c.t);
      if (!t.ok) bad(`${ca}.t`, t.why || 'empty');
      if (!Array.isArray(c.then)) bad(`${ca}.then`, 'needs an array (may be empty)');
      else c.then.forEach((b, k2) => {
        if (!Array.isArray(b) || b.length < 3) return bad(`${ca}.then[${k2}]`, 'needs [who, kind, text]');
        const [who, kind, text] = b;
        if (who !== 'n' && !castIds.has(who)) bad(`${ca}.then[${k2}].who`, `unknown speaker "${who}"`);
        if (!['say', 'act', 'think'].includes(kind)) bad(`${ca}.then[${k2}].kind`, `"${kind}" is not say/act/think`);
        const tt = textOk(text);
        if (!tt.ok) bad(`${ca}.then[${k2}].text`, tt.why || 'empty');
      });
    });
  });

  const endings = pack.endings;
  if (!endings || typeof endings !== 'object' || !Object.keys(endings).length) bad('endings', 'at least one ending');

  return { ok: errors.length === 0, errors };
}

module.exports = { planValid, textOk, LANGS };
