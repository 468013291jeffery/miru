// /api/chapter — one chapter of a story pack, as protocol events. Read-only: no DB, no auth, no upload.
// GET  /api/chapter?worldId=ice&chapter=1&lang=zh
// POST {worldId, chapter, lang, choice}   → the same body (for shells that would rather send JSON)
//
// → { world:{id,title,cast,chars}, chapter:{n,title,place,time,goal,lang,count,next,dropped},
//     events:[ {t:'say',who,text} | {t:'think',who,text} | {t:'act',who?,text} | {t:'choice',ask,options[]} ] }
//
// · Event shapes follow 05-事件协议.md (nine kinds). MIRU's beats carry engine instructions as well
//   (scene / bg / bgm / fx / if / lock / rd / …) — those are for the game core and are dropped here;
//   only say / act / think reach the shell. Anything dropped is counted in chapter.dropped, so the
//   projection stays auditable instead of silently losing lines.
// · lang default zh; a chapter with no translation for that language falls back to en (ja/ko/es are
//   partial on 8 chapters — that is in the script data, not a bug here).
// · choice='A' is opt-in: it returns the beats that follow that option (game.choose has to play
//   *something*). Without it the response is exactly the chapter as asked.
const fs = require('fs');
const path = require('path');
const L = require('./_lib');

/* 剧本文件的两个位置（内容一样，6,572,785 B）：仓库根是构建产物（本地/dev 在这里），
   source/src 那份才是 git 里被跟踪的。⚠️ 部署时：仓库根那份**必须被提交进 git** 才会进函数包
   —— 现在它是未跟踪状态（`git status` 里 `?? content_36.js`）；而 source/ 被 .vercelignore 排掉，
   所以线上只有「仓库根那份被提交了」这一条路。读不到时下面的 503 会把话说到底。 */
const CONTENT_PATHS = [
  path.join(__dirname, '..', 'content_36.js'),
  path.join(__dirname, '..', 'source', 'src', 'content_36.js'),
];
const LANGS = ['zh', 'en', 'ja', 'ko', 'es'];
const BEAT_KINDS = ['say', 'act', 'think'];
const OPT_KINDS = ['say', 'act', 'silent'];

/* content_36.js is a browser script: right after PACK_C / PACK_W it runs an IIFE that needs the page's
   globals (C / W / TAGS / TAG_ZH / TX) — require() or vm-ing the whole file throws. So: cut the two
   assignment right-sides out and JSON.parse them. 6.5 MB file → ~50 ms, once per process. */
function take(src, name) {
  const at = src.indexOf('const ' + name + '=');
  if (at < 0) throw new Error('content_36.js 里找不到 const ' + name + '=');
  let i = src.indexOf('=', at) + 1;
  while (i < src.length && /\s/.test(src[i])) i++;
  const open = src[i], close = open === '[' ? ']' : '}';
  let depth = 0, quote = '';
  for (let j = i; j < src.length; j++) {
    const ch = src[j];
    if (quote) {
      if (ch === '\\') { j++; continue; }
      if (ch === quote) quote = '';
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; continue; }
    if (ch === open) depth++;
    else if (ch === close) { depth--; if (depth === 0) return src.slice(i, j + 1); }
  }
  throw new Error('const ' + name + ' 的括号没有闭合（content_36.js 被改坏了？）');
}

let PACK = null;   // { C, W, byId, buildMs, bytes } — parsed once per process, then it is free

/* 返回 { P, hit }：hit 在**唯一决定它的那个地方**算 —— 不要在外面用 `!!PACK` 推断，
   否则「已经建过」会被读成「这次命中了」，而那个 header 就成了会撒谎的读数。 */
function packs() {
  if (PACK) return { P: PACK, hit: true };
  const t0 = Date.now();
  let src = null, from = '';
  const tried = [];
  for (const p of CONTENT_PATHS) {
    try { src = fs.readFileSync(p, 'utf8'); from = p; break; }
    catch (e) { tried.push(p + ' (' + (e && e.code) + ')'); }
  }
  if (src === null) {
    /* 部署包里没带上剧本文件 ⇒ 说清是哪一件事、怎么修，别让它变成一句看不懂的 500 堆栈。 */
    const err = new Error('读不到剧本文件 content_36.js，试过：' + tried.join(' / ') +
      ' —— 线上要有它，得把仓库根那份提交进 git（`git add content_36.js`；现在它是未跟踪状态）；' +
      '若文件确实已在仓库里仍报这个，就在 vercel.json 的 functions 里给 api/chapter.js 加 {"includeFiles": "content_36.js"}');
    err.code = 503;
    throw err;
  }
  const C = JSON.parse(take(src, 'PACK_C'));
  const W = JSON.parse(take(src, 'PACK_W'));
  const byId = new Map(W.map(w => [w.id, w]));
  PACK = { C, W, byId, from: from, buildMs: Date.now() - t0, bytes: Buffer.byteLength(src) };
  console.log('[chapter] parsed content_36.js in ' + PACK.buildMs + ' ms (' + PACK.bytes + ' B, ' + W.length + ' worlds) from ' + from);
  return { P: PACK, hit: false };
}

/* 多语言字段 → 一个字符串。缺这一种语言就退到 en（再退 zh）——宁可给英文，也不要给空。 */
function pick(v, lang) {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  const s = v[lang] || v.en || v.zh;
  return typeof s === 'string' ? s : '';
}

/* 旁白用 "n"，引擎用 "sys"：都不是角色。协议里 act 的 who 是可选的，所以这两种一律不带 who。 */
function whoOf(raw) {
  const w = String(raw == null ? '' : raw);
  if (w === 'me' || w === '你') return 'me';
  return w;
}

/* 语言取值镜像前端那条规矩（source/src/app14_pack.js:63 `packBeats(o)=(o&&(o[CL()]||o.en))||[]`）：
   有这一种就整章用它，没有再退 en —— 只改一处：**空数组也退 en**（前端的 `||` 会用空数组，那才是真丢内容）。 */
function beatsOf(chapter, lang) {
  const dict = (chapter && chapter.beats) || {};
  if (Array.isArray(dict[lang]) && dict[lang].length) return { list: dict[lang], lang: lang };
  if (Array.isArray(dict.en) && dict.en.length) return { list: dict.en, lang: 'en' };
  return { list: [], lang: lang };
}

/* beats → events。三种之外一律拦掉（这是硬名单，不是黑名单）；拦掉的记在 dropped 里。 */
function eventsFrom(list) {
  const events = [];
  const dropped = { engine: 0, malformed: 0, empty: 0 };
  for (const b of list) {
    if (!Array.isArray(b) || b.length < 3) { dropped.malformed++; continue; }
    const kind = b[1];
    if (BEAT_KINDS.indexOf(kind) < 0) { dropped.engine++; continue; }
    const text = typeof b[2] === 'string' ? b[2] : '';
    if (!text.trim()) { dropped.empty++; continue; }
    const who = whoOf(b[0]);
    if (kind === 'act') {
      const e = { t: 'act', text: text };
      if (who && who !== 'n' && who !== 'sys') e.who = who;
      events.push(e);
    } else {
      events.push({ t: kind, who: who, text: text });
    }
  }
  return { events, dropped };
}

/* 章末那道：MIRU 的 choices[] 是「A/B/C + 后果」，协议里是一颗 choice 事件（ask + options）。
   选项自带的 kind 只有 say/act/silent 三种会下发；数据里现在没有这个字段 ⇒ 按协议默认 say。
   choices[].then / .mem / .set 不放进来：那是剧情走向与游戏状态，不是「显示什么」（协议 §5）。 */
function choiceEvent(chapter, lang) {
  const list = (chapter && chapter.choices) || [];
  const options = list
    .filter(c => c && c.k != null)
    .map(c => ({
      k: String(c.k),
      t: pick(c.t, lang),
      kind: OPT_KINDS.indexOf(c.kind) >= 0 ? c.kind : 'say',
    }));
  if (options.length < 2) return null;
  return { t: 'choice', ask: pick(chapter.ask, lang), options: options };
}

module.exports = L.wrap(async (req, res) => {
  if (!L.cors(req, res, 'GET, POST, OPTIONS')) return;
  if (req.method !== 'GET' && req.method !== 'POST') return L.bad(res, 'GET or POST', 405);

  const q = req.query || {};
  const b = req.method === 'POST' ? L.jsonBody(req) : {};
  const src = req.method === 'POST' ? b : q;

  const worldId = String(src.worldId || '').trim();
  if (!worldId) return L.bad(res, 'worldId required');

  const lang = String(src.lang || 'zh').trim();
  if (LANGS.indexOf(lang) < 0) return L.bad(res, 'unsupported lang (one of ' + LANGS.join('/') + ')');

  const want = src.chapter == null || src.chapter === '' ? 1 : Number(src.chapter);
  if (!Number.isInteger(want) || want < 1) return L.bad(res, 'chapter must be 1..N');

  const { P, hit } = packs();
  const world = P.byId.get(worldId);
  if (!world) {
    return L.send(res, 404, { error: 'unknown worldId', worldId: worldId, worlds: P.W.map(w => w.id) });
  }
  const chapters = (world.pack && world.pack.chapters) || [];
  if (want > chapters.length) {
    return L.bad(res, 'chapter out of range (1..' + chapters.length + ')');
  }
  const chapter = chapters[want - 1];

  const choice = src.choice == null ? '' : String(src.choice).trim().toUpperCase();
  let events, dropped, used;
  if (choice) {
    const one = (chapter.choices || []).filter(c => c && String(c.k).toUpperCase() === choice)[0];
    if (!one) {
      const keys = (chapter.choices || []).map(c => String(c.k));
      return L.bad(res, 'unknown choice (one of ' + keys.join('/') + ')');
    }
    const then = one.then || {};
    const branch = Array.isArray(then[lang]) && then[lang].length
      ? { list: then[lang], lang: lang }
      : { list: then.en || [], lang: 'en' };
    const box = eventsFrom(branch.list);
    events = box.events;
    dropped = box.dropped;
    used = branch.lang;
  } else {
    const beats = beatsOf(chapter, lang);
    const box = eventsFrom(beats.list);
    events = box.events;
    dropped = box.dropped;
    used = beats.lang;
    const tail = choiceEvent(chapter, lang);
    if (tail) events = events.concat([tail]);
  }

  const chars = {};
  for (const id of (world.cast || [])) {
    const c = P.C[id];
    chars[id] = c
      ? { name: String(c.n || id), g: String(c.g || ''), a: String(c.a || ''), role: pick(c.role, lang) }
      : { name: String(id), g: '', a: '', role: '' };
  }

  res.setHeader('x-miru-cache', hit ? 'hit' : 'miss');
  res.setHeader('x-miru-parse-ms', String(P.buildMs));
  L.send(res, 200, {
    world: { id: world.id, title: pick(world.title, lang), cast: (world.cast || []).slice(), chars: chars },
    chapter: {
      n: want,
      title: pick(chapter.t, lang),
      place: pick(chapter.place, lang),
      time: pick(chapter.time, lang),
      goal: pick(chapter.goal, lang),
      lang: used,
      count: events.length,
      next: want < chapters.length ? want + 1 : null,
      dropped: dropped,
    },
    events: events,
  });
});
