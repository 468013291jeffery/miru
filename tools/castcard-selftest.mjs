// 角色卡分面：谁的卡带秘密，谁的卡不带（SPEC-AUDIT #8 / PER-CHARACTER-PAYLOAD 第 3 步）
//
//   node tools/castcard-selftest.mjs
//
// 共享 prompt 下，"所有人都带秘密"等于同屋全知。这条闸切三张卡出来真跑：
//   castCard（私密面）· castCardPublic（公开面）· castCardFace（决定用哪张）
// 并断言：只有这一拍上场的那个人拿到秘密；其余人一个字都不许漏。
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');

const cutFn = (name) => {
  const i = html.indexOf('function ' + name + '(');
  if (i < 0) throw new Error('missing ' + name);
  let d = 0, j = html.indexOf('{', i);
  for (; j < html.length; j++) {
    if (html[j] === '{') d++;
    else if (html[j] === '}') { d--; if (!d) break; }
  }
  return html.slice(i, j + 1);
};

const code = [cutFn('castCard'), cutFn('castCardPublic'), cutFn('castCardFace')].join('\n');

const SECRET = 'HIS-SECRET-TEXT';
const TWIST = 'HIS-TWIST-TEXT';
const CARD = {
  n: 'Mason', age: 26, role: { en: 'forward' }, looks: { en: 'tall' }, vibe: { en: 'cold' },
  tells: { en: ['jaw tightens'] }, twist: { en: TWIST }, likes: { en: 'ice rinks' },
  secret: { en: SECRET },
};

function run(privateCards) {
  const TUNE = { chat: { privateCards } };
  const stubs = {
    MIRU_TUNE: TUNE, I18N: { en: { 'stage.1': 'Getting close' } },
    ch: () => CARD, Lz: (x) => (x && (x.en || x)) || '',
    CL: () => 'en', me: () => 'you', stageOf: () => 1,
    wd: () => ({ pack: {} }),
    speakersOf: (th) => th.cast,
    mainOf: (th) => (th.focus && th.cast.includes(th.focus) ? th.focus : th.cast[0]),
  };
  const f = new Function(...Object.keys(stubs), code + '\nreturn { castCard, castCardPublic, castCardFace };')(...Object.values(stubs));
  const th = { cast: ['mason', 'luca', 'iris'], focus: 'mason', love: {}, status: { mood: {} } };
  return { f, th, cardOf: (id) => f.castCardFace(th, id) };
}

let pass = 0; const fails = [];
const ok = (n, c) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fails.push(n); console.log('  ✗ ' + n); } };

console.log('① 默认 privateCards = 1');
const one = run(1);
const leadCard = one.cardOf('mason');
const otherCard = one.cardOf('luca');
ok('主角卡带秘密', leadCard.includes(SECRET));
ok('主角卡带矛盾点', leadCard.includes(TWIST));
ok('主角卡仍带外貌与亲近度', leadCard.includes('tall') && /Closeness to you/.test(leadCard));
ok('**其他人卡里没有秘密**', !otherCard.includes(SECRET));
ok('**其他人卡里没有矛盾点**', !otherCard.includes(TWIST));
ok('其他人的卡仍有可见信息', otherCard.includes('tall') && otherCard.includes('ice rinks') && /Closeness to you/.test(otherCard));
ok('公开卡里没有 "Secret" 这个词', !/Secret/.test(otherCard));

console.log('② 放开到 privateCards = 3（旧行为）');
const three = run(3);
ok('三个人的卡都带秘密', three.th.cast.every(c => three.cardOf(c).includes(SECRET)));

console.log('③ 主角不在开口名单里时，退到第一个开口的人');
const f2 = run(1);
const th2 = { cast: ['luca', 'iris'], focus: 'mason', love: {}, status: { mood: {} } };
ok('第一个开口的人拿到私密面', f2.f.castCardFace(th2, 'luca').includes(SECRET));
ok('第二个没有', !f2.f.castCardFace(th2, 'iris').includes(SECRET));

if (process.argv.includes('--selftest')) {
  const broken = code.replace('return castCardPublic(th,id);', 'return castCard(th,id);');
  let leaked = '';
  try {
    const stubs = {
      MIRU_TUNE: { chat: { privateCards: 1 } }, I18N: { en: { 'stage.1': 'x' } },
      ch: () => CARD, Lz: (x) => (x && (x.en || x)) || '', CL: () => 'en', me: () => 'you',
      stageOf: () => 1, wd: () => ({ pack: {} }), speakersOf: (th) => th.cast,
      mainOf: (th) => th.cast[0],
    };
    const g = new Function(...Object.keys(stubs), broken + '\nreturn castCardFace;')(...Object.values(stubs));
    leaked = g({ cast: ['a', 'b'], love: {}, status: { mood: {} } }, 'b');
  } catch (_) {}
  const caught = leaked.includes(SECRET);
  console.log(`  · 变异（让分面函数一律返回私密卡）：${caught ? '已抓住 ✓' : '没抓住 ✗'}`);
  if (!caught) { console.log('SELFTEST FAILED'); process.exit(1); }
}

console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) { console.log('FAILED: ' + fails.join(' | ')); process.exit(1); }
console.log('cast card faces OK');
