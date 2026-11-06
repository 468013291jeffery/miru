// 编剧中文稿识别的自检：每个栏目都要落到正确的字段，写错要报得出是哪一栏。
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { parseManuscript, FX_NAMES, AMBIENT_IDS } = require('../api/_scriptparse.js');
const { checkBible, FX_IDS } = require('../api/_stylecheck.js');

let checks = 0;
const test = (name, f) => { f(); checks++; console.log('✓ ' + name); };
const sample = fs.readFileSync('tools/fixtures/manuscript-sample.txt', 'utf8');
const r = parseManuscript(sample, { id: 'w_sample' });
const b = r.bible, c1 = b.chapters[0], s1 = c1.scenes[0], s2 = b.chapters[1].scenes[0];

test('样稿识别通过，也过样式检查', () => { assert.deepEqual(r.err, []); assert.deepEqual(checkBible(b).err, []); });
test('作品设定落到对应字段', () => {
  assert.equal(b.key, 'w_sample'); assert.equal(b.title.zh, '雨夜留白'); assert.equal(b.orient, 'bg');
  assert.deepEqual(b.tags, ['一对二', '雨夜画廊', '成年暧昧']);
  assert(b.hook.zh.startsWith('闭馆前')); assert(b.premise.zh.startsWith('城南画廊'));
  assert.equal(b.intro.zh.split(/\n/).filter(Boolean).length, 3); assert(b.world.startsWith('当代城市')); assert(b.style.startsWith('先回答'));
  assert(b.experience.companionRules.zh.startsWith('先接住'));
  assert.equal(b.player.gender, 'f'); assert.equal(b.player.role.zh, '来取画的成年客人');
  assert.equal(b.experience.schema, 1); assert.equal(b.experience.pacing.minExchanges, 10); assert.equal(b.experience.pacing.targetExchanges, 16);
});
test('人物小传落到对应字段', () => {
  assert.equal(b.cast.length, 2); const a = b.cast[0];
  assert.equal(a.key, 'c01'); assert.equal(a.name.zh, '沈砚'); assert.equal(a.gender, 'm'); assert.equal(a.age, 33); assert.equal(a.tier, 'lead'); assert.equal(a.romanceable, true);
  assert.equal(a.role.zh, '画廊修复师'); assert(a.voice.startsWith('短句')); assert.equal(a.sample_lines.length, 5); assert.equal(a.secret, '');
});
test('章节和场景落到对应字段', () => {
  assert.equal(b.chapters.length, 2); assert.equal(c1.title.zh, '闭馆前的一场雨'); assert.equal(c1.introduction.time, '闭馆夜·九点');
  assert(c1.introduction.event.startsWith('雨突然')); assert(c1.introduction.text.startsWith('卷帘门')); assert(c1.goal.startsWith('两人'));
  assert.equal(s1.id, 'c01s01'); assert.equal(s1.place.zh, '城南画廊·前厅'); assert.deepEqual(s1.present, ['c01', 'c02']); assert(s1.beat.startsWith('进场'));
  assert.equal(s1.actor_payload.c01, '先回答玩家的问题，不抢话。'); assert.equal(s1.interaction.suggestions.length, 3); assert(s1.interaction.invitation.startsWith('可以看看'));
});
test('选项、标记和结局都识别到', () => {
  const [a, f] = s1.choice.options;
  assert.equal(a.t, '沈砚，带我看看那幅画'); assert(a.effect.startsWith('先和沈砚')); assert.equal(a.actor_payload.c01, '领你去修复台。'); assert(a.actor_payload.c02.startsWith('带点不服气')); assert.equal(a.state, undefined);
  assert.equal(f.state.romanceMode, 'friends');
  assert.equal(b.endings.length, 3); assert.equal(b.endings[2].id, 'leave'); assert.equal(s2.choice.options[0].state.ending, 'leave');
});
test('特效：中文名转成特效 id，带条件的进预留', () => {
  assert.equal(s1.fx.ambient, 'rain'); assert.deepEqual(s1.fxPlan.moments, [{ id: 'lightning', when: '卷帘门外亮了一下，玩家抬头去看' }]);
  assert.equal(s2.fxPlan.moments[0].id, 'heartbeat'); assert.equal(r.stats.authoredFx, 3);
});
test('图片：生成清单和高光图条件', () => {
  const slots = r.images.map(i => i.slot);
  ['cover', 'char_c01', 'char_c02', 'bg_c01s01', 'bg_c02s01', 'hl_c01s01_1'].forEach(x => assert(slots.includes(x), x));
  assert.deepEqual(s1.highlights, [{ id: 'hl_c01s01_1', name: '修复台前', when: '玩家走到修复台前，沈砚把画递过来' }]);
  assert.equal(r.images.find(i => i.slot === 'bg_c01s01').name, '雨夜前厅');
});
test('特效中文表和推荐表完全一致', () => {
  assert.deepEqual(Object.values(FX_NAMES).sort(), [...FX_IDS].sort());
  [...AMBIENT_IDS].forEach(id => assert(FX_IDS.has(id), id));
  assert.equal(new Set(Object.values(FX_NAMES)).size, Object.keys(FX_NAMES).length);
});
test('一章里第二个【地点】算第二场', () => {
  const t = sample.replace('【章序】第二章', '【地点】城南画廊·后巷\n【在场人物】沈砚\n【本章安排】巷子里说几句。\n【角色任务】\n沈砚：陪你走。\n【眼前邀请】可以走走。\n【开场建议】\n走吧\n【主场景图】图名：后巷 画面描述：雨后的后巷。\n\n【章序】第二章');
  const x = parseManuscript(t); assert.deepEqual(x.err, []); assert.equal(x.bible.chapters[0].scenes.length, 2); assert.equal(x.bible.chapters[0].scenes[1].id, 'c01s02');
});
test('写错时指出是哪一栏', () => {
  const bad = (from, to, re) => { const x = parseManuscript(sample.replace(from, to)); assert(x.err.some(e => re.test(e)), re + ' → ' + x.err.join(' | ')); };
  bad('【年龄】33', '【年龄】16', /必须成年/);
  bad('【取向】男女', '【取向】都行', /取向/);
  bad('【章名】谁留下来', '【章名】', /第 2 章.*章名/);
  bad('【在场人物】沈砚、陆行舟\n【眼前的事】雨停了', '【在场人物】沈砚、王五\n【眼前的事】雨停了', /王五/);
  bad('【本章目标】两人各自', '【章节目标】两人各自', /不认识这个栏目/);
  bad('【章序】第二章', '【章序】第五章', /章序/);
  bad('直接进入结局：提前离开', '直接进入结局：没有这个', /没有这个/);
  assert.equal(parseManuscript('随便写的一段话').ok, false);
});
test('人设五项和开场对白都识别到', () => {
  const a = b.cast[0];
  assert.equal(a.archetype, '高冷嘴硬型'); assert(a.expression.startsWith('嘴上说随便')); assert(a.flirt && a.jealousy && a.when_asked);
  assert.equal(b.cast[1].archetype, undefined);
  assert.deepEqual(c1.introduction.lines, [{ who: 'c01', say: '雨停之前走不了。画在里面，要看吗？' }, { who: 'c02', say: '他就会说画。你先告诉我，你叫什么？' }]);
  assert(r.warn.some(w => /陆行舟.*人设类型/.test(w)));
  assert(parseManuscript(sample.replace('沈砚：雨停之前', '王五：雨停之前')).err.some(e => /开场对白/.test(e)));
});
test('不在表里的特效给提醒，不会放错', () => {
  const x = parseManuscript(sample.replace('【环境氛围】下雨', '【环境氛围】彩虹雨')); assert(x.warn.some(w => /彩虹雨/.test(w))); assert.equal(x.bible.chapters[0].scenes[0].fx, undefined);
});
console.log('manuscript selftest: ' + checks + ' 项通过');
