import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = fs.readFileSync('source/src/app73_features.js', 'utf8');
const section = (a, b) => source.slice(source.indexOf(a), source.indexOf(b));
const listeners = {};
let clicks = 0, calls = 0;
const sandbox = {
  console, busy: false, REDO73: false, curT: 't', sugg: [],
  S: { lang: 'en', threads: {} }, save() {}, renderChat() {}, scrollChat() {}, toast() {}, t73: k => k,
  window: { getSelection: () => ({ isCollapsed: true }) },
  document: { addEventListener: (name, fn) => { listeners[name] = fn; }, querySelector: () => ({ click: () => clicks++ }) },
};
vm.createContext(sandbox);
vm.runInContext(section('function lastAIStart73', '/* ---------- 1 · affinity'), sandbox);
vm.runInContext(section('let RG_PENDING73', 'function edit73'), sandbox);
const clone = value => JSON.parse(JSON.stringify(value));
const state = n => ({ love: { c: n }, status: { place: 'place' + n }, mem: ['memory' + n],
  pk: { q: [n] }, quest: { done: n }, sugg: ['suggestion' + n], turn94: { n }, afDay: { g: { c: n } } });
function thread() {
  const th = { id: 't', ...state(2), msgs: [{ who: 'me', txt: 'hello' }, { who: 'c', ai: 1, k: 'say', txt: 'original', turn73: 'first' }], _ctx73: { kind: 'user', txt: 'hello' } };
  th._pre73 = sandbox.snap73(state(1));
  sandbox.S.threads.t = th; return th;
}
let th = thread();
sandbox.reply = async target => {
  calls++; Object.assign(target, state(3)); target.replyFailed = false;
  target.msgs.push({ who: 'c', k: 'say', ai: 1, txt: 'alternative', turn73: 'new' }); return true;
};
await sandbox.rg73(th);
assert.equal(calls, 1, 'one generation request per swipe');
assert.equal(th.vers.list.length, 2);
assert.equal(th.msgs[1].txt, 'alternative');
assert.equal(sandbox.vswitch73(th, -1), true);
assert.equal(th.msgs[1].txt, 'original');
assert.deepEqual(clone(th.status), { place: 'place2' });
assert.deepEqual(clone(th.mem), ['memory2']);
assert.deepEqual(clone(sandbox.sugg), ['suggestion2']);
assert.equal(th.love.c, 2, 'switching back restores affinity');
th = clone(th); sandbox.S.threads.t = th;
assert.equal(sandbox.vswitch73(th, 1), true, 'versions survive save/reload');
assert.equal(th.msgs[1].txt, 'alternative');
assert.equal(th.love.c, 3);
assert.deepEqual(clone(th.quest), { done: 3 });
assert.deepEqual(clone(th.pk.q), [3]);
assert.deepEqual(clone(th.turn94), { n: 3 });
sandbox.busy = true;
assert.equal(sandbox.vswitch73(th, -1), false);
await sandbox.rg73(th); assert.equal(calls, 1, 'busy blocks regeneration');
sandbox.busy = false;
for (const failure of ['warning', 'throw', 'empty']) {
  th = thread(); const before = clone(th);
  sandbox.reply = async target => {
    Object.assign(target, state(99));
    if (failure === 'throw') throw new Error('offline');
    if (failure === 'warning') { target.replyFailed = true; target.msgs.push({ who: 'sys', txt: 'failed' }); return false; }
    return true;
  };
  await sandbox.rg73(th);
  assert.deepEqual(clone(th.msgs), before.msgs, failure + ': original reply preserved');
  for (const k of ['love', 'status', 'mem', 'pk', 'quest', 'sugg', 'turn94']) assert.deepEqual(clone(th[k]), before[k]);
  assert.equal(th.vers.list.length, 1, 'failed candidate never stored');
}
th = thread(); let finish;
sandbox.reply = target => new Promise(resolve => { finish = () => { target.msgs.push({ who: 'c', ai: 1, txt: 'ok' }); resolve(true); }; });
const pending = sandbox.rg73(th); await sandbox.rg73(th);
assert.equal(sandbox.vswitch73(th, -1), false, 'pending generation locks switching');
const interrupted = clone(th);
finish(); await pending;
sandbox.S.threads.t = interrupted; sandbox.recoverSwipes73();
assert.equal(interrupted.msgs[1].txt, 'original', 'reload during generation recovers original');
assert.equal(interrupted.status.place, 'place2');
assert.equal(interrupted._swipeRecovery73, undefined);
th.vers.list = Array(5).fill(th.msgs.slice(1));
sandbox.reply = () => { throw new Error('limit failed'); };
await sandbox.rg73(th); assert.equal(th.vers.list.length, 5);
assert.equal(sandbox.lastAIStart73({ msgs: [{ ai: 1, turn73: 'a' }, { ai: 1, turn73: 'b' }, { who: 'sys' }] }), 1, 'continue turns stay separate');
assert.equal(sandbox.lastAIStart73({ msgs: [{ ai: 1 }, { pk: 1, who: 'c' }] }), -1, 'scripted beats are protected');

th = thread();
const row = { dataset: { mi: '1' } };
const target = { closest: selector => selector.startsWith('#msgs') ? row : null };
const down = (x, y) => listeners.pointerdown({ target, isPrimary: true, button: 0, pointerId: 1, clientX: x, clientY: y });
const up = (x, y) => listeners.pointerup({ pointerId: 1, clientX: x, clientY: y });
down(200, 20); up(80, 25); assert.equal(clicks, 1, 'left swipe generates at newest version');
down(200, 20); up(180, 150); assert.equal(clicks, 1, 'vertical scroll does not generate');
down(200, 20); listeners.pointercancel(); up(80, 20); assert.equal(clicks, 1, 'cancelled gesture ignored');
down(200, 20); sandbox.curT = 'other'; up(80, 20); assert.equal(clicks, 1, 'switching chats cancels gesture');
sandbox.curT = 't';
down(200, 20); sandbox.window.getSelection = () => ({ isCollapsed: false }); up(80, 20); assert.equal(clicks, 1, 'text selection protected');

let prompt;
Object.assign(sandbox, { ask: value => { prompt = value; }, ADDR73: null, ch: () => null, REDO73: true });
vm.runInContext(section('const _ask73 = ask;', 'let RG_PENDING73'), sandbox);
sandbox.ask('You write MIRU\nNOW: hello', {});
assert.match(prompt, /REGENERATE:/, 'regeneration instruction reaches model');
th = thread(); let html = '';
const node = { dataset: { mi: '1' }, insertAdjacentHTML: (_, value) => { html = value; } };
const box = { querySelector: () => null, querySelectorAll: () => [node] };
Object.assign(sandbox, { mainOf: () => 'c', speakersOf: () => [], esc: x => String(x),
  $: () => box, STAGE_MIN: [], busy: false });
sandbox.document.querySelector = () => null;
vm.runInContext(section('const __body73 = function', 'if (window.UI &&'), sandbox);
vm.runInContext('__body73()', sandbox);
assert.match(html, /1 \/ 1/, 'version controls visible before first regeneration');
assert.match(html, /Next version or regenerate/);
assert.match(html, /Previous version/);
assert.equal(node.dataset.swipe73, '1');
console.log('Swipe: generation, rollback, saved versions, state, locking, gestures and prompt checks passed.');
