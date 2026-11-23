// 剧本文件包：槽位提取与整包审查的单元测试。
//   node tools/package-qa-selftest.mjs
// 纯函数，不需要数据库、不需要起服务。
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const P = require('../api/_package.js');

let pass = 0;
const fails = [];
function ok(name, got, want) {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g === w) { pass++; console.log('  ✓', name); }
  else { fails.push(name); console.log('  ✗', name, '\n      got  ' + g + '\n      want ' + w); }
}
function truthy(name, v) { if (v) { pass++; console.log('  ✓', name); } else { fails.push(name); console.log('  ✗', name); } }
function falsy(name, v) { if (!v) { pass++; console.log('  ✓', name); } else { fails.push(name); console.log('  ✗', name); } }

const SCRIPT = [
  '⟦ORIENT|bg⟧',
  '⟦CHAR|你|f|29||主角⟧',
  '⟦CHAR|罗温|m|34||工程师|m1⟧',
  '# CHAPTER 1｜雨夜',
  '# SCENE｜影院',
  '⟦BG|BG_CH01_01|影院正门⟧',
  '⟦TIME|D01⟧',
  '⟦BGM|BGM_TENSE|紧张⟧',
  '旁白：门开了。',
  '罗温：“你还没睡。”',
  '⟦CG|CG_RAIN|雨里的他⟧',
  '⟦VIDEO|VID_OPEN|开场⟧',
  '⟦MG|find|找不同⟧',
  '# CHOICE｜让他进来吗？',
  '#### A｜“进来。”',
  '⟦OPT|A|set:let_in⟧',
  '他侧身让开。',
  '#### B｜“在门口说。”',
  '他没有动。',
  '# CHAPTER 2｜第二天',
  '# SCENE｜咖啡馆',
  '⟦BG|BG_CH02_01|咖啡馆⟧',
  '# CHOICE｜坐哪？',
  '#### A｜靠窗',
  '窗边的光很好。',
  '#### B｜吧台',
  '吧台更安静。',
].join('\n');

console.log('slots');
const slots = P.slotsOf(SCRIPT);
ok('chapters', slots.chapters, 2);
ok('bg', slots.bg, ['BG_CH01_01', 'BG_CH02_01']);
ok('cg', slots.cg, ['CG_RAIN']);
ok('video', slots.video, ['VID_OPEN']);
ok('bgm', slots.bgm, ['BGM_TENSE']);
ok('mg gets g_ prefix', slots.mg, ['g_find']);
ok('char', slots.char, ['你', '罗温']);
ok('orient', slots.orient, 'bg');

console.log('normalizeAssets');
ok('null is fine', P.normalizeAssets(null), { ok: true, assets: {}, errors: [] });
const bad = P.normalizeAssets({ 'bad key!': 'https://x/y.png', GOOD: 42, NEG: 'javascript:alert(1)' });
ok('bad entries rejected', bad.ok, false);
ok('bad errors counted', bad.errors.length, 3);
ok('good https kept', P.normalizeAssets({ A: 'https://cdn.example.com/a.png' }).assets, { A: 'https://cdn.example.com/a.png' });
ok('package path kept', P.normalizeAssets({ A: 'assets/bg/a.png' }).assets, { A: 'assets/bg/a.png' });

console.log('packageQA — complete package');
const full = P.packageQA({
  script: SCRIPT,
  assets: {
    BG_CH01_01: 'https://cdn.example.com/bg1.png',
    BG_CH02_01: 'https://cdn.example.com/bg2.png',
    CG_RAIN: 'https://cdn.example.com/cg.png',
    VID_OPEN: 'https://cdn.example.com/open.mp4',
    BGM_TENSE: 'https://cdn.example.com/tense.mp3',
    g_find: 'https://cdn.example.com/find.json',
    cover: 'https://cdn.example.com/cover.jpg',
  },
});
ok('complete is ok', full.ok, true);
ok('complete has no missing', full.missing, []);
ok('coverage bg', full.coverage.bg, { have: 2, total: 2 });
ok('coverage cg', full.coverage.cg, { have: 1, total: 1 });
ok('coverage video', full.coverage.video, { have: 1, total: 1 });
ok('coverage bgm', full.coverage.bgm, { have: 1, total: 1 });
ok('coverage mg', full.coverage.mg, { have: 1, total: 1 });

console.log('packageQA — gaps are warnings, not blockers');
const gap = P.packageQA({ script: SCRIPT, assets: { BG_CH01_01: 'https://cdn.example.com/bg1.png' } });
ok('gaps still publishable', gap.ok, true);
truthy('missing lists BG_CH02_01', gap.missing.includes('BG_CH02_01'));
truthy('missing lists CG_RAIN', gap.missing.includes('CG_RAIN'));
truthy('warns about missing', gap.warnings.some(w => /没有素材/.test(w)));
truthy('cover falls back to first bg', gap.warnings.some(w => /用第一张背景/.test(w)));

console.log('packageQA — unused files are reported');
const extra = P.packageQA({ script: SCRIPT, assets: { BG_CH01_01: 'https://x/1.png', BG_CH02_01: 'https://x/2.png', CG_RAIN: 'https://x/3.png', VID_OPEN: 'https://x/4.mp4', BGM_TENSE: 'https://x/5.mp3', g_find: 'https://x/6.json', NOT_IN_SCRIPT: 'https://x/7.png', cover: 'https://x/c.jpg' } });
truthy('unused listed', extra.unused.includes('NOT_IN_SCRIPT'));

console.log('packageQA — malformed input is an error');
ok('no script', P.packageQA({}).ok, false);
ok('array assets', P.packageQA({ script: SCRIPT, assets: [] }).ok, false);

console.log('normalizeManifest');
const m = P.normalizeManifest({ title: 'X', orient: 'BG', tags: ['a', 'b', ''], assets: { A: 'https://x/a.png' } });
ok('format default', m.format, P.FORMAT);
ok('script default', m.script, 'script.md');
ok('orient normalised', m.work.orient, 'bg');
ok('tags filtered', m.work.tags, ['a', 'b']);
ok('assets kept', m.assets, { A: 'https://x/a.png' });
ok('unknown orient falls back', P.normalizeManifest({ orient: 'xx' }).work.orient, 'all');

console.log('脚本结构规则（规范 v2）');
const noBg = P.scriptRules('# CHAPTER 1｜A\n# SCENE｜书房\n旁白：没有背景卡。\n');
ok('scene without BG is an error', noBg.errors.length, 1);
const heading = P.scriptRules('# CHAPTER 1｜A\n# SCENE｜书房\n⟦BG|bg_c01s01|书房⟧\n## 作品资料\n正文\n');
truthy('## heading is a warning', heading.warnings.some(w => /##/.test(w)));
const mg = P.scriptRules(['# CHAPTER 1｜A', '# SCENE｜A', '⟦BG|bg_c01s01|A⟧', '⟦MG|g_find⟧', '⟦MG|g_code⟧', '正文'].join('\n'));
truthy('more than one MG in a chapter warns', mg.warnings.some(w => /小游戏/.test(w)));
const short = P.scriptRules('# CHAPTER 1｜A\n# SCENE｜A\n⟦BG|bg_c01s01|A⟧\n正文\n');
truthy('chapter count outside 15-20 warns', short.warnings.some(w => /15–20/.test(w)));

console.log('人物卡（作品资料 ②）');
const ch = P.normalizeCharacters([{ key: 'adrian', name: '阿德里安', gender: 'm', age: '26', portrait: 'https://x/char_adrian.jpg' }]);
ok('character normalized', ch.characters[0].key, 'adrian');
ok('age parsed', ch.characters[0].age, 26);
ok('no character errors', ch.errors, []);
const minor = P.normalizeCharacters([{ key: 'kid', name: '小孩', age: 17 }]);
truthy('under 18 is an error', minor.errors.some(e => /adult/.test(e)));
const badKey = P.normalizeCharacters([{ key: 'Adrian!', name: 'x' }]);
truthy('bad key is an error', badKey.errors.some(e => /key/.test(e)));
const withCards = P.packageQA({ script: SCRIPT, characters: [{ key: 'rowan', name: '罗温', age: 34, portrait: 'https://x/char_rowan.jpg' }], assets: { BG_CH01_01: 'https://x/1.png', BG_CH02_01: 'https://x/2.png', CG_RAIN: 'https://x/3.png', VID_OPEN: 'https://x/4.mp4', BGM_TENSE: 'https://x/5.mp3', g_find: 'https://x/6.json' } });
truthy('portrait mapped to char_<name>', withCards.coverage.char.have >= 1);
truthy('missing character card warned', withCards.warnings.some(w => /人物卡/.test(w)));

console.log('\n' + pass + ' passed, ' + fails.length + ' failed');
if (fails.length) { console.log('FAILED: ' + fails.join(' | ')); process.exit(1); }
