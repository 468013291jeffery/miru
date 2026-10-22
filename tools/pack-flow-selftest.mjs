// Whole-chapter flow test for the gameplay events — the helpers were unit-tested, this one
// drives the REAL packPick / packAfterPick / pkOpenMark cut out of the built bundle, so the
// event ORDER is what a player would actually produce.
//
//   node tools/pack-flow-selftest.mjs index.html
//
// Everything the two functions touch is stubbed below; nothing else from the app runs.
import fs from 'node:fs';

const file = process.argv[2] || 'index.html';
const html = fs.readFileSync(file, 'utf8');
const start = html.indexOf('function pkSess(th)');
const end = html.indexOf('function packNext()');
if (start < 0 || end < 0 || end < start) { console.error('pack block not found in ' + file); process.exit(2); }
const block = html.slice(start, end);
// the paywall lives further down the same file; cut it separately and glue it after the block
const payStart = html.indexOf('function packPaywall(wid,n)');
const payEnd = payStart < 0 ? -1 : html.indexOf('\nfunction ', payStart + 10);
if (payStart < 0 || payEnd < 0) { console.error('paywall block not found in ' + file); process.exit(2); }
const payBlock = html.slice(payStart, payEnd);

const events = [];
let curT = 't1', busy = false;

// ---- the stubs the two functions reach for ----
const CH = (n) => ({ t: { en: 'ch' + n, zh: 'ch' + n }, choices: [
  { k: 'A', t: { en: 'A' + n }, then: [], mem: { en: 'memA' + n }, set: 'SET_A' + n },
  { k: 'B', t: { en: 'B' + n }, then: [], mem: { en: 'memB' + n }, set: 'SET_B' + n },
  { k: 'C', t: { en: 'C' + n }, then: [], mem: { en: 'memC' + n }, set: 'SET_C' + n },
] });
const world = { id: 'ice', pack: { chapters: [CH(1), CH(2), CH(3)] } };
const th = { id: 't1', wid: 'ice', cast: ['p1', 'p2'], mem: [], love: {}, rounds: 0, pk: { st: 'choose', ch: 1, picks: {}, as: 'p1' } };
const S = { threads: { t1: th } };

const noop = () => {};
const stubs = {
  S, busy, curT,
  wd: () => world,
  PCN: (w) => w.pack.chapters.length,
  aCount: () => 0,
  EN: () => 0,
  toast: noop, t: (k) => k,
  pkSet: noop, stageOf: () => 0, setSugg: noop, appendMsg: noop,
  Lz: (v) => (v && (v.zh || v.en || v)) || '',
  packBeats: () => [], save: noop, packRefresh: noop, packRun: noop,
  packLove: noop, packSt: () => ({ end: {} }), taskClaimOnce: () => false,
  renderChat: noop, scrollChat: noop, levelUpCheck: noop,
  $: () => ({ hidden: true }),
  esc: (s) => String(s == null ? '' : s),
  sheet: noop, PACK_UNITS: 6, PACK_PRICE: 300,
  track: (name, props) => events.push({ name, props }),
};

const api = new Function(...Object.keys(stubs), block + '\n' + payBlock + '\nreturn { pkOpenMark, packPick, packAfterPick, pkDone, packPaywall };')(...Object.values(stubs));
const { pkOpenMark, packPick, packAfterPick, packPaywall } = api;

let pass = 0; const fails = [];
const ok = (name, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g === w) { pass++; console.log('  ✓', name); } else { fails.push(name); console.log('  ✗', name, '\n      got  ' + g + '\n      want ' + w); }
};
const seq = () => events.map(e => e.name + (e.props.ch != null ? ':' + e.props.ch : '') + (e.props.key ? ':' + e.props.key : '') + (e.props.ending ? ':' + e.props.ending : ''));

// ---- a full 3-chapter run: open, pick, consequence, next ----
for (const [n, k] of [[1, 'B'], [2, 'A'], [3, 'C']]) {
  th.pk.ch = n; th.pk.st = 'choose';
  pkOpenMark(th, n);
  packPick(k);
  packAfterPick(th, k);
}

console.log('a whole 3-chapter run, events in order');
ok('exact event sequence', seq(), [
  'chapter_open:1', 'choice_pick:1:B', 'chapter_done:1',
  'chapter_open:2', 'choice_pick:2:A', 'chapter_done:2',
  'chapter_open:3', 'choice_pick:3:C', 'chapter_done:3', 'story_end:3:C',
]);
ok('story_end comes after that chapter is done', seq().indexOf('chapter_done:3') < seq().indexOf('story_end:3:C'), true);
ok('10 events for 3 chapters + 1 ending', events.length, 10);
ok('one session for the whole run', new Set(events.map(e => e.props.sess)).size, 1);
ok('every event carries wid', events.every(e => e.props.wid === 'ice'), true);
ok('chapter_done carries a numeric ms', events.filter(e => e.name === 'chapter_done').every(e => typeof e.props.ms === 'number'), true);

console.log('guards');
const before = events.length;
th.pk.st = 'next';
packPick('A');                       // not in the choose state -> must not emit
ok('picking outside the choose state emits nothing', events.length - before, 0);
th.pk.st = 'choose';
packPick('Z');                       // no such option -> must not emit
ok('picking a non-existent option emits nothing', events.length - before, 0);
pkOpenMark(th, 3);                   // re-entering chapter 3 -> already counted
ok('re-entering a chapter does not re-open it', events.filter(e => e.name === 'chapter_open' && e.props.ch === 3).length, 1);

console.log('the paid gate');
const g0 = events.length;
packPaywall('ice', 3);
const pay = events.slice(g0);
ok('showing the wall emits exactly one paywall event', pay.length, 1);
ok('it carries ch + wid + sess', [pay[0].props.ch, pay[0].props.wid, typeof pay[0].props.sess], [3, 'ice', 'string']);
ok('it belongs to the run that is being played', pay[0].props.sess === events[0].props.sess, true);
const g1 = events.length;
packPaywall('dog', 3);               // a wall for some other story while this thread is open
ok('a wall for another story is not attributed to this run', events.length - g1, 0);

console.log('replay');
th.pk.st = 'end';
th.pk.ch = 1;
pkOpenMark(th, 1);
const last = events[events.length - 1];
ok('a replay opens chapter 1 again', last.name === 'chapter_open' && last.props.ch === 1, true);
ok('and starts a new session', last.props.sess !== events[0].props.sess, true);

console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) { console.log('FAILED: ' + fails.join(' | ')); process.exit(1); }
console.log('pack flow OK');
