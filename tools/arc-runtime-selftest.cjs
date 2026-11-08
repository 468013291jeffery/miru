const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('source/src/app134_arc98.js', 'utf8');
const calls = [], messages = [];
const ctx = { document: { addEventListener() {} }, MG100: [], L98: (zh, en) => en, save() {},
  appendMsg: (th, m) => messages.push(m), renderChat() {}, beat98: (...args) => calls.push(args),
  ch: () => null, S: { threads: {} }, curT: 't', busy: false, console };
vm.createContext(ctx); vm.runInContext(source, ctx);
function setup() {
  calls.length = messages.length = 0; ctx.busy = false; ctx.curT = 't';
  const m = { at: 1, game98: { id: 'g_find_clue', ch: 1, sc: 0, win: 'win', lose: 'lose', skip: 'skip' } };
  const th = { b98: { ch: 1, sc: 0, ended: false }, msgs: [m] }; ctx.S.threads = { t: th };
  return { th, m };
}
for (const r of ['win', 'lose', 'skip']) {
  const { th, m } = setup(); ctx.arcGameDone98(th, m, r); ctx.arcGameDone98(th, m, r);
  assert.equal(calls.length, 1); assert.equal(messages.length, 1); assert.equal(m.game98.done, r);
}
for (const change of [
  th => { th.b98.ch = 2; }, th => { th.b98.sc = 1; }, th => { th.b98.ended = true; },
  () => { ctx.curT = 'other'; }, () => { ctx.busy = true; }, th => { th.msgs = []; },
  (_th, m) => { delete m.game98.ch; },
]) {
  const { th, m } = setup(); change(th, m); ctx.arcGameDone98(th, m, 'win');
  assert.equal(calls.length, 0); assert.equal(messages.length, 0); assert.equal(m.game98.done, undefined);
}
const { th, m } = setup(); ctx.arcGameDone98(th, m, 'unexpected'); assert.equal(m.game98.done, 'skip');
console.log('Arc runtime: win/lose/skip, duplicate, stale scene/thread, ended story and removed cards passed.');
(async () => {
  let finish, requests = 0, saved;
  Object.assign(ctx, { Z98: () => true, wd: () => ({}), bOf98: () => ({}), cardOf98: () => ({ tier: 'lead' }),
    tail98: () => 'recorded dialogue', LANG98: () => 'English', first: s => s, ch: () => ({ n: 'Lead' }),
    ask: () => { requests++; return new Promise(r => { finish = r; }); }, save: () => { saved = JSON.parse(JSON.stringify(t.b98)); } });
  const t = { cast: ['lead'], b98: { turns: 20, cards: { lead: { mem: [] } } } };
  const pending = ctx.arcCompress98(t); await ctx.arcCompress98(t); assert.equal(requests, 1);
  t.b98.turns = 21; finish({ recap: 'Summary', chars: { lead: 'A fact' } }); await pending;
  assert.equal(saved.comp98busy, undefined); assert.equal(saved.compAt98, 20);
  t.b98.turns = 40; const stale = ctx.arcCompress98(t); const replacement = { turns: 0 }; t.b98 = replacement;
  finish({ recap: 'Stale summary', chars: {} }); await stale; assert.equal(replacement.recap98, undefined);
  console.log('Arc memory: one in-flight request, reload-safe lock, snapshot boundary and stale result rejection passed.');
})().catch(e => { console.error(e); process.exitCode = 1; });
