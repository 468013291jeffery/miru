// 发布前的结构校验（T19/T20 的共同前置）
//
//   node tools/plan-valid-selftest.mjs
//
// ⚠️ 这**不是** content/validate.py 的替代品。
//   validate.py 查的是**内部作者约定**：n 与 wid 对得上、looks 必须从既有角色原样复制、
//   age ≥ 21、tells 中英条数一致……那些规则只适用于我们自己的 37 部剧本。
//   这里是**玩家发布的剧本**要过的最小结构关：能不能被运行时正确播出来。
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { planValid, planValidChapter } = require('../api/_plan.js');

let pass = 0; const fails = [];
const ok = (n, c, d) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fails.push(n); console.log('  ✗ ' + n, d === undefined ? '' : '→ ' + JSON.stringify(d).slice(0, 160)); } };

const L = (en, zh) => ({ en, zh });
const good = () => ({
  wid: 'mytest', title: L('T', '标题'), kind: 'story', heat: 'slow',
  cast: [{ id: 'a', n: 'A', age: 26 }, { id: 'b', n: 'B', age: 28 }],
  chapters: [{
    t: L('ch1', '第一章'), goal: L('g', '目标'), place: L('p', '地点'), time: L('t', '时间'),
    beats: [['n', 'act', L('x', 'x')], ['a', 'say', L('hi', '嗨')]],
    choices: [
      { k: 'A', t: L('a', 'a'), then: [['b', 'say', L('ok', '好')]], mem: L('m', 'm') },
      { k: 'B', t: L('b', 'b'), then: [], mem: L('m2', 'm2') },
    ],
  }],
  endings: { A: { line: L('e', 'e') } },
});

console.log('① 好剧本通过');
const r0 = planValid(good());
ok('合法剧本 ok', r0.ok === true, r0.errors);

console.log('② 结构性错误要被点名');
const noCh = good(); noCh.chapters = [];
ok('没有章节 → 报错', planValid(noCh).errors.some(e => /chapters/.test(e.path)));

const noBeats = good(); noBeats.chapters[0].beats = [];
ok('一章没有 beats → 报错', planValid(noBeats).errors.some(e => /beats/.test(e.path)));

const badWho = good(); badWho.chapters[0].beats.push(['ghost', 'say', L('boo', 'boo')]);
ok('说话的人不在 cast 里 → 报错', planValid(badWho).errors.some(e => /who/.test(e.path)));

const noThen = good(); delete noThen.chapters[0].choices[0].then;
ok('选项缺 then → 报错', planValid(noThen).errors.some(e => /then/.test(e.path)));

const oneChoice = good(); oneChoice.chapters[0].choices = [oneChoice.chapters[0].choices[0]];
ok('只有一个选项 → 报错（至少 2 个）', planValid(oneChoice).errors.some(e => /choices/.test(e.path)));

const noEnd = good(); delete noEnd.endings;
ok('没有结局 → 报错', planValid(noEnd).errors.some(e => /endings/.test(e.path)));

console.log('③ 单语内容可以用（不强制双语，玩家写自己的剧本）');
const zhOnly = good();
zhOnly.title = { zh: '只有中文' };
zhOnly.chapters[0].beats[0] = ['n', 'act', { zh: '只有中文' }];
const r1 = planValid(zhOnly);
ok('只有 zh 的剧本通过', r1.ok === true, r1.errors);
const emptyText = good(); emptyText.title = { en: '', zh: '' };
ok('两种语言都空 → 报错', planValid(emptyText).errors.some(e => /title/.test(e.path)));

console.log('④ 不吞异常');
let threw = false;
try { planValid(null); } catch (_) { threw = true; }
ok('传 null 不抛异常', threw === false);
ok('传 null 返回 not ok', planValid(null).ok === false);

console.log('⑤ 候选章节（续写生成器吐出来的东西）');
const castIds = ['a', 'b'];
const cand = {
  scene: { beats: [['n', 'act', { zh: '一' }], ['a', 'say', { zh: '二' }], ['b', 'think', { zh: '三' }], ['n', 'act', { zh: '四' }]] },
  choices: ['A', 'B', 'C'].map(k => ({ k, t: { zh: '选' + k }, then: [['a', 'say', { zh: '后' + k }]] })),
  goal: { zh: '目标' },
};
ok('合法候选通过', planValidChapter(cand, castIds).ok === true, planValidChapter(cand, castIds).errors);
const few = JSON.parse(JSON.stringify(cand)); few.scene.beats = few.scene.beats.slice(0, 2);
ok('拍数不足 → 报错', planValidChapter(few, castIds).errors.some(e => /4 to 8/.test(e.why)));
const two = JSON.parse(JSON.stringify(cand)); two.choices = two.choices.slice(0, 2);
ok('选项不是 3 个 → 报错', planValidChapter(two, castIds).errors.some(e => /exactly 3/.test(e.why)));
const wrongKey = JSON.parse(JSON.stringify(cand)); wrongKey.choices[0].k = 'D';
ok('选项键不是 ABC → 报错', planValidChapter(wrongKey, castIds).errors.some(e => /A,B,C/.test(e.why)));
const ghost = JSON.parse(JSON.stringify(cand)); ghost.scene.beats[1][0] = 'zzz';
ok('说话人不在 cast → 报错', planValidChapter(ghost, castIds).errors.some(e => /unknown speaker/.test(e.why)));

console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) { console.log('FAILED: ' + fails.join(' | ')); process.exit(1); }
console.log('plan validity OK');
