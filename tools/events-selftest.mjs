// Runs the telemetry helpers AS SHIPPED (cut out of the built bundle) against a stub `track`.
//   node tools/events-selftest.mjs index.html
// Why not a browser: the page is 10 MB and headless runs of it are slow and flaky; this test
// exercises the same bytes that ship, in 100 ms, deterministically.
import fs from 'node:fs';

const file = process.argv[2] || 'index.html';
const html = fs.readFileSync(file, 'utf8');

const start = html.indexOf('function pkSess(th)');
const end = html.indexOf('function packPick(k)');
if (start < 0 || end < 0 || end < start) { console.error('telemetry block not found in ' + file); process.exit(2); }
const block = html.slice(start, end);

const events = [];
const track = (name, props) => events.push({ name, props });
const fn = new Function('track', block + '; return { pkSess, pkTrack, pkOpenMark, pkDone };')(track);
const { pkOpenMark, pkDone, pkSession } = fn;

let pass = 0; const fails = [];
const ok = (name, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g === w) { pass++; console.log('  ✓', name); } else { fails.push(name); console.log('  ✗', name, '\n      got  ' + g + '\n      want ' + w); }
};
const mk = extra => Object.assign({ id: 't', wid: 'ice', pk: {}, cast: [], mem: [], love: {} }, extra || {});

console.log('telemetry helpers, cut from ' + file + ' (' + block.length + ' chars)');

const th = mk();
pkOpenMark(th, 1);
pkOpenMark(th, 1);           // re-entering the same chapter must NOT count twice
ok('one chapter_open for two opens of ch1', events.filter(e => e.name === 'chapter_open').length, 1);
ok('payload carries wid + sess + ch + t', Object.keys(events[0].props).sort(), ['ch', 'sess', 't', 'wid']);
ok('ch = 1', events[0].props.ch, 1);
ok('sess is a stable id', typeof events[0].props.sess === 'string' && events[0].props.sess.length > 5, true);

pkOpenMark(th, 2);
ok('chapter 2 opens once', events.filter(e => e.name === 'chapter_open').map(e => e.props.ch), [1, 2]);
ok('same session across chapters', events[1].props.sess === events[0].props.sess, true);

pkDone(th, 1);
const done = events.find(e => e.name === 'chapter_done');
ok('chapter_done emitted', !!done, true);
ok('chapter_done carries a numeric ms', Number.isFinite(done.props.ms), true);
ok('chapter_done keeps the chapter', done.props.ch, 1);

const before = th.pk._sess;
pkOpenMark(th, 1);           // a replay: starts at chapter 1 again
ok('replay starts a NEW session', th.pk._sess !== before, true);
ok('replay re-opens chapter 1', events.filter(e => e.name === 'chapter_open').map(e => e.props.ch), [1, 2, 1]);

console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) { console.log('FAILED: ' + fails.join(' | ')); process.exit(1); }
console.log('events self-test OK');
