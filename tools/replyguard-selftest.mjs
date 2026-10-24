// 台词守门的判据（对应他们清单里的「台词检查：先重写一次；还不对就换成保守回答」）
//
//   node tools/replyguard-selftest.mjs
//
// 三条主判据 + 两条边界：
//   ① 干净回复 → 一个字都不改，ask 只被调一次
//   ② 命中禁区 → 重写一次，第二次的 prompt 必须点名那几个词
//   ③ 重写仍命中 → 落到保守句，并标 fellBack
//   ④ 禁区只取"未来"章节（当章已发生的不算禁区）
//   ⑤ 太短的词不进禁区（避免"球""他"这种误伤）
import fs from 'node:fs';
import vm from 'node:vm';

const src = fs.readFileSync('source/src/app94_replyguard.js', 'utf8');
const sandbox = {
  MIRU_MARKS: {
    demo: {
      chapters: {
        3: { breaks: { noor: { promised: 1 } } },
        5: { reveals: { mason: 'self' } },
      },
    },
  },
  ch: (id) => ({ noor: { secret: { zh: '他和球的那件事' } }, mason: { twist: { zh: '他其实早就知道' } } }[id] || null),
};
vm.createContext(sandbox);
vm.runInContext(src + '\nthis.API={marksForbidden,cardForbidden,leakHits,beatsText,guardReply,canonFacts};', sandbox);
const A = sandbox.API;

let pass = 0; const fails = [];
const ok = (n, c, d) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fails.push(n); console.log('  ✗ ' + n, d === undefined ? '' : '→ ' + JSON.stringify(d).slice(0, 140)); } };

const clean = { beats: [{ who: 'noor', kind: 'say', text: '外面下雨了。' }] };
const leaky = { beats: [{ who: 'noor', kind: 'say', text: '他其实早就知道，只是一直没说。' }] };
const words = A.marksForbidden('demo', 2).concat(A.cardForbidden(null, ['noor', 'mason']));

console.log('④ 禁区只取未来的章节');
ok('ch2 看到 ch3/ch5 的词', words.length >= 2, words.map(w => w.t));
const atCh5 = A.marksForbidden('demo', 5);
ok('ch5 时 ch3 的词已解禁', !atCh5.some(w => w.t === 'promised'), atCh5.map(w => w.t));

console.log('⑤ 太短的词不误伤');
ok('length<3 的词不报命中', A.leakHits('他说了个字', [{ t: '字' }]).length === 0);
ok('长词正常报命中', A.leakHits('他其实早就知道了', [{ t: '他其实早就知道' }]).length === 1);

console.log('① 干净回复原样通过');
let calls = 0;
const r1 = await A.guardReply({ reply: clean, words, ask: async () => { calls++; return clean; }, fallback: () => ({}) });
ok('内容不变', r1.reply === clean);
ok('ask 没被调用', calls === 0);
ok('没重写/没兜底', r1.retried === false && r1.fellBack === false);

console.log('② 命中禁区 → 重写一次且点名');
let prompts = [];
const rewritten = { beats: [{ who: 'noor', kind: 'say', text: '有些事我还没打算说。' }] };
const r2 = await A.guardReply({ reply: leaky, words, ask: async (p) => { prompts.push(p); return rewritten; }, fallback: () => ({}) });
ok('采用了重写后的回复', r2.reply === rewritten);
ok('ask 恰好被调一次', prompts.length === 1);
ok('重写 prompt 点名了禁区词', leaksNamed(prompts[0], r2.leaked), { p: prompts[0], leaked: r2.leaked });
ok('标记 retried、未兜底', r2.retried === true && r2.fellBack === false);

console.log('③ 重写仍命中 → 保守句');
const safeReply = { beats: [{ who: 'noor', kind: 'act', text: '他把话题岔开了。' }] };
const r3 = await A.guardReply({ reply: leaky, words, ask: async () => leaky, fallback: () => safeReply });
ok('落到保守句', r3.reply === safeReply);
ok('标记 fellBack', r3.fellBack === true);
ok('两次命中的词都记下来了', r3.leaked.length >= 1);

console.log('②b 重写返回空 → 也算失败，走保守句');
const r4 = await A.guardReply({ reply: leaky, words, ask: async () => null, fallback: () => safeReply });
ok('空回复不冒充成功', r4.reply === safeReply && r4.fellBack === true);

console.log('⑥ canon 清单：已发生的进、未来的不进');
const c2 = A.canonFacts('demo', 2);
const c5 = A.canonFacts('demo', 5);
ok('ch2 时 canon 为空（前面的章节没有标记）', c2.length === 0, c2);
ok('ch5 时 ch3 与 ch5 的都算已发生', c5.length >= 2, c5);
ok('canon 里出现 Ch3 那条', c5.some(x => /^Ch3:/.test(x)), c5);
ok('canon 里不出现比当前章更晚的', !c5.some(x => /^Ch[7-9]:/.test(x)), c5);

function leaksNamed(prompt, leaked) {
  if (!prompt || !leaked.length) return false;
  return leaked.every(t => prompt.indexOf(t) >= 0);
}

console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) { console.log('FAILED: ' + fails.join(' | ')); process.exit(1); }
console.log('reply guard OK');
