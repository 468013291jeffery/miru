// End-to-end for the telemetry TRANSPORT: the app's own track()/evFlush()/capi(), cut out of the
// built bundle, posting to tools/fake-api.mjs over real HTTP and landing in tools/_events.ndjson.
//
//   node tools/fake-api.mjs &          # or Start-Process; must be listening on 8130
//   node tools/flush-e2e.mjs           # --reset empties the log first
//
// Why not the browser: the page is 10 MB and every headless eval on it takes over a minute, which
// turned this into three stalls. The three functions below are the whole transport; the UI click
// path is a separate question and is NOT claimed by this test.
import fs from 'node:fs';

const ROOT = process.cwd();
const LOG = 'tools/_events.ndjson';
const API = 'http://127.0.0.1:8130/api';
const html = fs.readFileSync('index.html', 'utf8');

const cut = (a, b) => {
  const i = html.indexOf(a), j = html.indexOf(b, i + a.length);
  if (i < 0 || j < 0) throw new Error('cannot cut ' + a + ' .. ' + b);
  return html.slice(i, j);
};

if (process.argv.includes('--reset')) fs.writeFileSync(LOG, '');

// the real code, straight from the bundle
const src = [
  cut('async function capi(path,opt)', 'async function cloudBoot(){'),
  cut('const EVQ=[];function track(name,props)', 'async function evFlush'),
  cut('async function evFlush()', 'setInterval(evFlush,15000)'),
].join('\n');

const CL0 = { on: true, busy: false, lastPush: 0 };
const runtime = new Function('CLOUD_EP', 'CL0', 'S', 'cloudAuth', 'cloudInfo', 'save0', 'fetch',
  src + '\nreturn { track, evFlush, EVQ: (typeof EVQ !== "undefined" ? EVQ : null) };')(
  API, CL0, { cloud: { token: 'local-token', uid: 'u_local' } }, () => ({ Authorization: 'Bearer local-token' }), () => ({}), () => {}, fetch);

let pass = 0; const fails = [];
const ok = (n, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g === w) { pass++; console.log('  ✓', n); } else { fails.push(n); console.log('  ✗', n, '\n      got  ' + g + '\n      want ' + w); }
};
const lines = () => fs.existsSync(LOG) ? fs.readFileSync(LOG, 'utf8').trim().split('\n').filter(Boolean) : [];

(async () => {
  fs.writeFileSync(LOG, '');

  console.log('queue -> flush -> HTTP -> disk');
  runtime.track('chapter_open', { wid: 'ice', ch: 1, sess: 'S1', t: Date.now() });
  runtime.track('choice_pick', { wid: 'ice', ch: 1, sess: 'S1', key: 'B', t: Date.now() });
  runtime.track('chapter_done', { wid: 'ice', ch: 1, sess: 'S1' });
  ok('three events are queued, nothing sent yet', lines().length, 0);

  await runtime.evFlush();
  const got = lines().map(l => JSON.parse(l));
  ok('flush wrote all three', got.length, 3);
  ok('names survive the trip', got.map(g => g.name), ['chapter_open', 'choice_pick', 'chapter_done']);
  ok('props survive the trip', got[1].props.key, 'B');
  ok('the server stamped its own time', got.every(g => typeof g.at === 'string' && g.at.length >= 19), true);
  ok('queue is empty after a flush', runtime.EVQ ? runtime.EVQ.length : 0, 0);

  console.log('gates');
  CL0.on = false;
  runtime.track('probe_off', { wid: 'ice' });
  await runtime.evFlush();
  ok('with the cloud OFF nothing is sent', lines().length, 3);
  CL0.on = true;
  await runtime.evFlush();
  ok('…and the held event goes out once it is back on', lines().length, 4);

  console.log(`\n${pass} passed, ${fails.length} failed`);
  if (fails.length) { console.log('FAILED: ' + fails.join(' | ')); process.exit(1); }
  console.log('flush e2e OK');
})();
