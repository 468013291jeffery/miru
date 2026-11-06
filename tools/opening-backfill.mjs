// 给存量故事圣经补写开场包：章节的时间、眼前的事、导语和两句开场对白（规则在 source/src/opening_core.js）
//
//   node tools/opening-backfill.mjs art/official/w_xxx.bible.json            只生成，打印前两章看看
//   node tools/opening-backfill.mjs art/official/*.bible.json --write        补全并写回文件
//
// 只补缺的项，编剧写过的一个字不动；补写的章节带 introduction.source = "auto"，后台和样式检查据此标出「系统补写」。
// 调的是线上同一个模型接口（/api/longcat），所以要能联网；这台机器走代理时加 NODE_USE_ENV_PROXY=1。
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const OPENING_CORE = require('../source/src/opening_core.js');

const args = process.argv.slice(2), write = args.includes('--write');
const files = args.filter(a => a.endsWith('.bible.json'));
const API = process.env.MIRU_LLM || 'https://miru-wheat-pi.vercel.app/api/longcat';
const zh = v => (v && typeof v === 'object') ? (v.zh || v.en || '') : String(v || '');

async function ask(prompt) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://localhost' }, body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], max_tokens: 900, temperature: 0.85, thinking: { type: 'disabled' } }) });
      const j = await r.json(); const t = (((j.choices || [])[0] || {}).message || {}).content || '';
      const m = t.match(/\{[\s\S]*\}/); if (m) return JSON.parse(m[0]);
    } catch (e) { if (i === 2) throw e; }
  }
  return null;
}

async function fill(file) {
  const b = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!b || !Array.isArray(b.chapters)) return { file, skipped: true };
  const cast = b.cast.map(x => ({ key: x.key, name: zh(x.short || x.name), role: zh(x.role), voice: x.voice, archetype: x.archetype, expression: x.expression, sample: (x.sample_lines || []).slice(0, 2).join(' / ') }));
  let done = 0;
  for (const c of b.chapters) {
    const s = c.scenes[0], given = c.introduction || {};
    if (given.time && given.event && given.text && given.lines && given.lines.length) continue;
    const o = { title: zh(b.title), premise: zh(b.premise), world: b.world, playerRole: zh((b.player || {}).role), cast,
      prev: b.chapters.slice(Math.max(0, c.n - 4), c.n - 1).map(x => zh(x.title) + '：' + String(x.goal || '').slice(0, 80)),
      chapter: { n: c.n, title: zh(c.title), place: zh(s.place), time: zh(given.time), goal: c.goal, beat: s.beat, present: s.present || [], given } };
    let r = null; try { r = OPENING_CORE.validate(await ask(OPENING_CORE.prompt(o)), o); } catch (e) { console.log('  ✗ 第 ' + c.n + ' 章：' + e.message); continue; }
    c.introduction = Object.assign({}, given, {
      time: given.time || r.time, event: given.event || r.event, text: given.text || r.text,
      lines: given.lines && given.lines.length ? given.lines : r.lines, source: given.source || 'auto' });
    done++;
    if (!write && done <= 2) console.log('  第 ' + c.n + ' 章 ' + JSON.stringify(c.introduction, null, 0).slice(0, 400));
  }
  if (write && done) fs.writeFileSync(file, JSON.stringify(b, null, 2) + '\n');
  return { file, chapters: b.chapters.length, filled: done };
}

if (!files.length) { console.log('用法：node tools/opening-backfill.mjs art/official/w_xxx.bible.json [--write]'); process.exit(1); }
for (const f of files) {
  const t0 = Date.now(), r = await fill(f);
  console.log((r.skipped ? '— ' : '✓ ') + f.split('/').pop() + (r.skipped ? '：不是故事圣经，跳过' : '：' + r.filled + '/' + r.chapters + ' 章补写 · ' + Math.round((Date.now() - t0) / 1000) + ' 秒') + (write ? '' : '（未写入）'));
}
