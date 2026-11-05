// 特效基础层的自检（2026-11-05）
//
// 守四件事：
//   ① 特效库：表里每个 id 都有真实的渲染实现；每类情境都有可选的；id 不重复
//   ② 对账：api/_stylecheck.js 的 FX_IDS / FX_LEGACY 和前端完全一致，老特效一个不丢
//   ③ 判据：否定、假设、比喻、人名不触发；真实事件能触发（负对照 + 正对照）
//   ④ 指令：发给智能体的提示词包含整张表，并且默认 null
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const src = n => fs.readFileSync('source/src/' + n, 'utf8');
let checks = 0;
const test = (name, f) => { f(); checks++; console.log('✓ ' + name); };

/* 特效库 + 判据部分不碰 DOM，给最小桩就能跑 */
const noop = () => {};
const sandbox = {
  console, Set, Date, Math, Object, String, Array,
  document: { addEventListener: noop, querySelector: () => null, querySelectorAll: () => [], getElementById: () => null, body: { classList: { toggle: noop } } },
  navigator: {}, S: {}, curT: 't',
  CL: () => 'zh',
  UI: { add: noop },
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(src('app128_fxlib.js'), sandbox);
const X = sandbox.FXBUS;

/* vm 里的数组和外面不是同一个原型，先转一次才能 deepEqual */
const MOMENT = JSON.parse(JSON.stringify(X.MOMENT)), AMBIENT = JSON.parse(JSON.stringify(X.AMBIENT));
const momentIds = Object.values(MOMENT).flat().map(r => r[0]);
const ambientIds = AMBIENT.map(r => r[0]);
const fx100Ids = [...src('app59_fx100.js').match(/const FX100_SRC=`([\s\S]*?)`/)[1].split('\n')].map(l => l.split('|')[0]);
const kinds22 = JSON.parse(src('app22_fx2.js').match(/const KINDS=(\[[^\]]*\])/)[1]);
const glOnly = JSON.parse(src('app24_gl.js').match(/GLONLY=(\[[^\]]*\])/)[1]);
const emo = ['heartbeat', 'bloom', 'longing', 'ink', 'shock'];

test('瞬间特效都有渲染实现', () => { const bad = momentIds.filter(i => !fx100Ids.includes(i) && !emo.includes(i)); assert.deepEqual(bad, []); });
test('持续氛围都有渲染实现', () => { const ok = [...kinds22, ...glOnly, 'ice']; const bad = ambientIds.filter(i => !ok.includes(i)); assert.deepEqual(bad, []); });
test('表里没有重复 id', () => { const all = [...ambientIds, ...momentIds]; assert.equal(new Set(all).size, all.length); });
test('每类情境都有可选的特效', () => {
  for (const c of ['恋爱|romance', '情绪|emotion', '镜头|camera', '庆祝|celebration', '自然|nature', '危险|danger', '科技|tech', '奇幻|fantasy']) assert(MOMENT[c] && MOMENT[c].length >= 3, c);
  for (const a of ['rain', 'storm', 'snowfall', 'wind', 'candle', 'blackout', 'bokeh', 'godrays']) assert(ambientIds.includes(a), a);
});
test('每个特效都写了中英文用途', () => { [...AMBIENT, ...Object.values(MOMENT).flat()].forEach(r => assert(r[1] && r[2], r[0])); });

const { FX_IDS, FX_LEGACY, checkBible, checkDsl } = createRequire(import.meta.url)('../api/_stylecheck.js');
test('样式检查的推荐表和前端一致', () => { assert.deepEqual([...FX_IDS].sort(), ['none', ...ambientIds, ...momentIds].sort()); });
test('老特效一个不丢（100 个都还能被指令调用）', () => {
  const known = new Set([...FX_IDS, ...FX_LEGACY]);
  assert.deepEqual(fx100Ids.filter(i => !known.has(i)), []);
  assert.deepEqual([...FX_LEGACY].filter(i => !fx100Ids.includes(i)), []);
});
test('样式检查能拦住不存在的特效', () => {
  assert.equal(checkDsl('## CHAPTER 1｜开始\n⟦FX|nope⟧').err.length, 1);
  assert.equal(checkDsl('## CHAPTER 1｜开始\n⟦FX|rain⟧').err.length, 0);
  const b = { cast: [], chapters: [{ n: 1, title: '开始', scenes: [{ id: 's', fx: { moment: 'nope' } }] }] };
  assert.equal(checkBible(b).err.length, 1);
});
test('别名归到表里', () => { assert.equal(X.resolve('downpour').id, 'storm'); assert.equal(X.resolve('rain').type, 'ambient'); assert.equal(X.resolve('heartbeat').type, 'moment'); assert.equal(X.resolve('不存在'), null); assert.equal(X.resolve(null), null); });

const hit = (re, t) => X.happened(re, t);
test('负对照：否定、假设、比喻、回忆都不算发生', () => {
  for (const [re, t] of [[/下雨/, '今晚不会下雨吧'], [/烟花/, '别放烟花'], [/枪声/, '没有枪声'], [/爆炸/, '如果爆炸了怎么办'], [/吻了/, '好像吻了一下'], [/雷声/, '他的笑声像雷声'], [/下雨/, '记得那年也下雨']]) assert.equal(hit(re, t), false, t);
});
test('正对照：真实事件算发生，带否定字的固定说法也算', () => {
  for (const [re, t] of [[/下雨/, '窗外开始下雨了。'], [/吻了/, '他忍不住吻了她。'], [/爆炸/, '远处传来爆炸声'], [/枪声/, '门外，枪声响起']]) assert.equal(hit(re, t), true, t);
});
test('氛围规则不再误伤人名和普通词', () => {
  const rules = src('app20_fx_booth.js').match(/const FX_RULES=(\[[\s\S]*?\]\]);/)[1];
  const list = vm.runInNewContext(rules);
  const from = t => (list.find(([re]) => X.happened(re, t)) || [])[1] || null;
  for (const t of ['他叫雷蒙', '雪莉端来咖啡', '你的风格我喜欢', '今晚不会下雨吧', '这件事不下雨也得办']) assert.equal(from(t), null, t);
  assert.equal(from('窗外下起了暴雨'), 'storm'); assert.equal(from('整座城市停电了'), 'blackout'); assert.equal(from('雨夜的街口'), 'rain');
});
test('提示词包含整张表，默认 null，中英文都有', () => {
  for (const zh of [true, false]) {
    const p = X.promptBlock(null, zh);
    [...ambientIds, ...momentIds].forEach(i => assert(p.includes(i), i));
    assert(p.includes('null'));
  }
});
test('所有智能体路径都接上了 fx', () => {
  assert(/FXBUS\.promptBlock/.test(src('app98_story.js')) && /FXBUS\.agent/.test(src('app98_story.js')), '官方自由模式');
  assert(/FXBUS\.promptBlock/.test(src('app97_agents.js')) && /FXBUS\.agent/.test(src('app97_agents.js')), '试点自由模式');
  assert(/FXBUS\.promptBlock/.test(src('app3_chat.js')) && /FXBUS\.agent/.test(src('app3_chat.js')), '单模型回复');
  assert(!/const _appendMsg59/.test(src('app59_fx100.js')), 'AI 台词不能再走关键词');
});
console.log('fx selftest: ' + checks + ' 项通过 · ' + ambientIds.length + ' 个氛围 + ' + momentIds.length + ' 个瞬间');
