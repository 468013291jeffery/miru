// Offline self-test for api/_ledger.js — no DB, no network.
//   node tools/ledger-selftest.mjs
// It proves three things, in this order:
//   1) the CSV has the promised columns and survives commas/quotes inside props
//   2) the numbers are the numbers we claim (funnel, choice shares, chapter duration)
//   3) the numbers MOVE when one input changes  (a metric that cannot fail is not a metric)
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const LED = require('../api/_ledger.js');

const T0 = Date.parse('2026-10-22T10:00:00Z');
const ev = (user, name, props, secs) => ({ user_id: user, name, props, at: new Date(T0 + secs * 1000) });

// --- fixture: 2 works. "ice" has 3 sessions (one drops out of ch2), "dog" has 1.
//     plus one story_start with NO chapter_open — it must not become a session (denominator rule).
const rows = [
  ev('u1', 'story_start', { wid: 'ghost' }, 0), // no chapter_open -> not a session
  ev('u1', 'chapter_open', { wid: 'ice', ch: 1, sess: 's1', t: T0 }, 1),
  ev('u1', 'choice_pick', { wid: 'ice', ch: 1, sess: 's1', key: 'A', t: T0 + 30000 }, 31),
  ev('u1', 'chapter_done', { wid: 'ice', ch: 1, sess: 's1' }, 60),
  ev('u1', 'chapter_open', { wid: 'ice', ch: 2, sess: 's1', t: T0 + 60000 }, 61),
  ev('u1', 'choice_pick', { wid: 'ice', ch: 2, sess: 's1', key: 'B', t: T0 + 90000 }, 91),
  ev('u1', 'chapter_done', { wid: 'ice', ch: 2, sess: 's1' }, 120),

  ev('u2', 'chapter_open', { wid: 'ice', ch: 1, sess: 's2', t: T0 }, 2),
  ev('u2', 'choice_pick', { wid: 'ice', ch: 1, sess: 's2', key: 'A', t: T0 + 40000 }, 42),
  ev('u2', 'chapter_done', { wid: 'ice', ch: 1, sess: 's2' }, 90),
  ev('u2', 'chapter_open', { wid: 'ice', ch: 2, sess: 's2', t: T0 + 90000 }, 92),
  ev('u2', 'choice_pick', { wid: 'ice', ch: 2, sess: 's2', key: 'A', t: T0 + 150000 }, 152),
  // u2 never finishes chapter 2 -> drop-off

  ev('u3', 'chapter_open', { wid: 'ice', ch: 1, sess: 's3', t: T0 }, 3),
  ev('u3', 'choice_pick', { wid: 'ice', ch: 1, sess: 's3', key: 'B', t: T0 + 10000 }, 13),
  ev('u3', 'chapter_done', { wid: 'ice', ch: 1, sess: 's3' }, 30),
  ev('u3', 'chapter_open', { wid: 'ice', ch: 2, sess: 's3', t: T0 + 30000 }, 33),
  ev('u3', 'choice_pick', { wid: 'ice', ch: 2, sess: 's3', key: 'C', t: T0 + 60000 }, 63),
  ev('u3', 'chapter_done', { wid: 'ice', ch: 2, sess: 's3' }, 180),

  ev('u4', 'chapter_open', { wid: 'dog', ch: 1, sess: 'd1', t: T0 }, 5),
  ev('u4', 'choice_pick', { wid: 'dog', ch: 1, sess: 'd1', key: 'C', t: T0 + 20000 }, 25),
  ev('u4', 'chapter_done', { wid: 'dog', ch: 1, sess: 'd1' }, 45),
  ev('u4', 'story_end', { wid: 'dog', sess: 'd1', ending: 'C', note: 'a, "quoted" value' }, 46),
];

let pass = 0;
const fails = [];
function ok(name, got, want) {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g === w) { pass++; console.log('  ✓', name); }
  else { fails.push(name); console.log('  ✗', name, '\n      got  ' + g + '\n      want ' + w); }
}

console.log('1) CSV shape');
const text = LED.csv(rows);
const lines = text.trim().split('\n');
ok('header', lines[0], LED.COLS.join(','));
ok('row count (header + 21 events)', lines.length - 1, rows.length);
ok('10 columns on every row', lines.every(l => l.split(',').length >= 10 || l.includes('"')), true);
// parse the CSV back: a field with commas and quotes must round-trip to the original props
function parseLine(line) {
  const out = []; let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') inQ = false;
      else cur += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ',') { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur); return out;
}
const lastRow = parseLine(lines[lines.length - 1]);
ok('commas/quotes round-trip inside props', JSON.parse(lastRow[9]).note, 'a, "quoted" value');
ok('every row parses to 10 fields', lines.slice(1).every(l => parseLine(l).length === 10), true);

console.log('2) The numbers');
const s = LED.summary(rows);
// 'ghost' is kept on purpose: opening a story and never entering a chapter IS a funnel step.
// But it is not a session — sessions only count runs that opened a chapter.
ok('works = every work with events, busiest first', s.works.map(w => w.work), ['ice', 'dog', 'ghost']);
const ice = s.works[0], dog = s.works[1], ghost = s.works[2];
ok('ghost has 0 sessions (story_start alone is not a session)', ghost.sessions, 0);
ok('ice sessions = 3', ice.sessions, 3);
ok('ice ch1 done_rate', ice.chapters['1'].done_rate, 1);
ok('ice ch1 choice shares', ice.chapters['1'].choices, { A: { n: 2, share: 0.667 }, B: { n: 1, share: 0.333 } });
// durations are server-time: open@+1s done@+60s => 59s; +2s/90s => 88s; +3s/30s => 27s
ok('ice ch1 median duration (59s,88s,27s)', ice.chapters['1'].median_ms, 59000);
ok('ice ch2 done_rate (2 of 3 finished)', ice.chapters['2'].done_rate, 0.667);
ok('ice ch2 shares are even', ice.chapters['2'].choices, { A: { n: 1, share: 0.333 }, B: { n: 1, share: 0.333 }, C: { n: 1, share: 0.333 } });
ok('ice ch2 median duration (59s,147s)', ice.chapters['2'].median_ms, 103000);
ok('dog ch1 choice C took everything', dog.chapters['1'].choices.C.share, 1);

console.log('3) Mutation — the reading must move when the input moves');
const flipped = rows.map(r => (r.name === 'choice_pick' && r.props.sess === 's2' && r.props.ch === 1) ? { ...r, props: { ...r.props, key: 'C' } } : r);
const s2 = LED.summary(flipped);
ok('ice ch1 shares after flipping u2 A->C', s2.works[0].chapters['1'].choices, { A: { n: 1, share: 0.333 }, B: { n: 1, share: 0.333 }, C: { n: 1, share: 0.333 } });
ok('done_rate must NOT move (a choice change is not a completion change)', s2.works[0].chapters['1'].done_rate, ice.chapters['1'].done_rate);

const dropped = rows.filter(r => !(r.name === 'chapter_done' && r.props.sess === 's3' && r.props.ch === 1));
ok('removing one chapter_done lowers done_rate', LED.summary(dropped).works[0].chapters['1'].done_rate, 0.667);

console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) { console.log('FAILED: ' + fails.join(' | ')); process.exit(1); }
console.log('ledger self-test OK');
