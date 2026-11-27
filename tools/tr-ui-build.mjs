#!/usr/bin/env node
/* 界面文字提前翻译（2026-11-28）
   以前：日 / 韩 / 西班牙语界面里没写进词表的文字，要等页面显示出来再实时去 /api/translate 翻，先闪一下英文。
   现在：把源码里所有界面文字（LL("中","英")、zh ? "中" : "英"、I18N 词表里缺日韩西的条目）一次性整理出来，
   提前翻好写进 tr_ui.json；App 启动时整份读进来，页面上直接就是目标语言，基本不再走实时翻译。
   用法：node tools/tr-ui-build.mjs <仓库根目录> <输出 tr_ui.json>     （只补缺的，已经翻过的不重翻）
   环境变量 TR_EP：翻译接口，默认 https://miru.plus/api/translate（服务器上的 LongCat，同一个实时翻译用的接口）。
   DRY=1：只统计要翻多少条，不调用接口。 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(process.argv[2] || '.');
const OUT = path.resolve(process.argv[3] || path.join(ROOT, 'tr_ui.json'));
const EP = process.env.TR_EP || 'https://miru.plus/api/translate';
const DRY = process.env.DRY === '1';
const SRC = path.join(ROOT, 'source/src');
const HAN = /[\u4e00-\u9fff]/, KANA = /[\u3040-\u30ff]/, HANG = /[\uac00-\ud7af]/;

const unq = s => { try { return JSON.parse('"' + s.replace(/\n/g, '\\n') + '"'); } catch (_) { return s.replace(/\\(["'\\])/g, '$1'); } };
const Q2 = '"((?:[^"\\\\\\n]|\\\\.){1,400})"', Q1 = "'((?:[^'\\\\\\n]|\\\\.){1,400})'";
/* 任意「函数名("中文", "English")」都算（LL / T / T2 / TZ / L98 …各模块叫法不一样） */
const FN = '\\b[A-Za-z_$][\\w$]{0,10}\\(\\s*';
const RXS = [
  new RegExp(FN + Q2 + '\\s*,\\s*' + Q2 + '\\s*\\)', 'g'),
  new RegExp(FN + Q1 + '\\s*,\\s*' + Q1 + '\\s*\\)', 'g'),
  new RegExp('(?:zh\\(\\)|\\bzh|\\bZH|isZh|S\\.lang\\s*===\\s*"zh"|CL\\(\\)\\s*===\\s*"zh"|\\blang\\s*===\\s*"zh")\\s*\\?\\s*' + Q2 + '\\s*:\\s*' + Q2, 'g'),
  new RegExp('(?:zh\\(\\)|\\bzh|\\bZH|isZh)\\s*\\?\\s*' + Q1 + '\\s*:\\s*' + Q1, 'g')
];

/* 1 · 源码里的中英成对文字 */
const pairs = new Map(); // en -> zh
const files = fs.readdirSync(SRC).filter(f => /\.js$/.test(f));
for (const f of files) {
  const s = fs.readFileSync(path.join(SRC, f), 'utf8');
  for (const rx of RXS) {
    rx.lastIndex = 0; let m;
    while ((m = rx.exec(s))) {
      const zh = unq(m[1]), en = unq(m[2]);
      if (HAN.test(zh) && /[A-Za-z]{2}/.test(en) && !HAN.test(en) && en.length <= 400) { if (!pairs.has(en)) pairs.set(en, zh); }
    }
  }
}

/* 2 · I18N 词表：base（i18n.js）+ 各模块 Object.assign(I18N.xx,{…}) */
const I = { en: {}, zh: {}, ja: {}, ko: {}, es: {} };
function objAt(s, i) { // s[i] === '{' → 平衡括号截出对象字面量
  let d = 0, q = null;
  for (let j = i; j < s.length; j++) {
    const c = s[j];
    if (q) { if (c === '\\') { j++; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; continue; }
    if (c === '{') d++; else if (c === '}') { d--; if (!d) return s.slice(i, j + 1); }
  }
  return null;
}
const evalObj = t => { try { return vm.runInNewContext('(' + t + ')', {}, { timeout: 500 }); } catch (_) { return null; } };
try {
  const base = fs.readFileSync(path.join(SRC, 'i18n.js'), 'utf8');
  const i = base.indexOf('{', base.indexOf('const I18N'));
  const o = evalObj(objAt(base, i));
  if (o) for (const k of Object.keys(I)) Object.assign(I[k], o[k] || {});
} catch (_) {}
for (const f of files) {
  const s = fs.readFileSync(path.join(SRC, f), 'utf8');
  const rx = /Object\.assign\(\s*I18N\.(en|zh|ja|ko|es)\s*,\s*\{/g; let m;
  while ((m = rx.exec(s))) { const o = evalObj(objAt(s, m.index + m[0].length - 1)); if (o) Object.assign(I[m[1]], o); }
}
const i18nMiss = { ja: [], ko: [], es: [] };
for (const lg of Object.keys(i18nMiss)) for (const [k, v] of Object.entries(I.en)) if (typeof v === 'string' && I[lg][k] == null && /[A-Za-z]{2}/.test(v)) i18nMiss[lg].push(v);
const enMiss = Object.entries(I.zh).filter(([k, v]) => typeof v === 'string' && HAN.test(v) && I.en[k] == null).map(([, v]) => v);

/* 2b · 首页 / 发现里的剧本卡片（标题、一句话简介、标签）：来自线上作品列表，不在源码里 */
const WORKS = (process.env.TR_WORKS || 'https://miru.plus/api/works?r=list,https://miru.plus/api/works?feed=featured&limit=50,https://miru.plus/art/official/catalog.json,https://miru.plus/art/official/discover.json,https://miru.plus/art/official/leads.json').split(',');
const cards = new Set();
const KEYS = /^(title|hook|premise|tagline|logline|genre|tags?|sub|subtitle|desc|description|summary|blurb|pitch|label|shelf|en|zh)$/i;
const take = v => { if (typeof v === 'string' && v.length >= 2 && v.length <= 400 && /[A-Za-z一-鿿]/.test(v) && !/^(https?:|\/|[a-z0-9_.-]+$)/i.test(v)) cards.add(v); };
const walk = (o, d, k) => { if (o == null || d > 8) return; if (typeof o === 'string') { if (k && KEYS.test(k)) take(o); return; } if (Array.isArray(o)) return o.forEach(x => walk(x, d + 1, k)); if (typeof o !== 'object') return;
  for (const [kk, v] of Object.entries(o)) walk(v, d + 1, kk); };
for (const u of WORKS) { try { walk(await (await fetch(u)).json(), 0, ''); } catch (_) {} }
const cardsEn = [...cards].filter(t => !HAN.test(t)), cardsZh = [...cards].filter(t => HAN.test(t));

/* 3 · 要翻的清单 */
let out = { v: 1, at: '', ja: {}, ko: {}, es: {}, en: {} };
try { out = Object.assign(out, JSON.parse(fs.readFileSync(OUT, 'utf8'))); } catch (_) {}
const want = {
  ja: [...new Set([...pairs.keys(), ...i18nMiss.ja, ...cardsEn, ...cardsZh])],
  ko: [...new Set([...pairs.keys(), ...i18nMiss.ko, ...cardsEn, ...cardsZh])],
  es: [...new Set([...pairs.keys(), ...i18nMiss.es, ...cardsEn, ...cardsZh])],
  en: [...new Set([...pairs.values(), ...enMiss, ...cardsZh])]
};
/* 英文用户：中英成对的直接用源码里的英文，不用翻 */
for (const [en, zh] of pairs) if (!out.en[zh]) out.en[zh] = en;
const fits = (lg, v) => { v = String(v || ''); if (!v.trim()) return false; if (lg === 'ja') return KANA.test(v) || HAN.test(v); if (lg === 'ko') return HANG.test(v); if (lg === 'es') return !HAN.test(v) && !KANA.test(v) && !HANG.test(v); if (lg === 'en') return !HAN.test(v); return true; };
const todo = {}; for (const lg of Object.keys(want)) todo[lg] = want[lg].filter(t => t.length >= 2 && !fits(lg, out[lg][t]));
console.log('cards', cards.size, '| pairs', pairs.size, '| i18n en keys', Object.keys(I.en).length, '| to translate:', Object.fromEntries(Object.entries(todo).map(([k, v]) => [k, v.length])));
if (DRY) process.exit(0);

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function call(lg, texts) {
  for (let t = 0; t < 3; t++) {
    try {
      const r = await fetch(EP, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: lg, texts }) });
      const j = await r.json();
      if (j && j.map) return j.map;
    } catch (_) {}
    await sleep(1500 * (t + 1));
  }
  return {};
}
let n = 0, bad = 0;
for (const lg of Object.keys(todo)) {
  const list = todo[lg];
  for (let i = 0; i < list.length; i += 30) {
    const batch = list.slice(i, i + 30);
    const map = await call(lg, batch);
    for (const t of batch) { const v = map[t]; if (fits(lg, v)) { out[lg][t] = v; n++; } else bad++; }
    out.at = new Date().toISOString();
    fs.writeFileSync(OUT, JSON.stringify(out));
    process.stdout.write(lg + ' ' + Math.min(i + 30, list.length) + '/' + list.length + '\r');
    await sleep(300);
  }
  console.log('');
}
console.log('done: +' + n + ' translated, ' + bad + ' skipped →', OUT, Object.fromEntries(['ja', 'ko', 'es', 'en'].map(k => [k, Object.keys(out[k]).length])));
