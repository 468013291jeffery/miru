// One command for every check in this repo of tests.
//   node tools/check-all.mjs
// Each suite prints its own detail; this runner only answers "is the tree honest right now".
// The end-to-end one needs the fake backend, so it is probed rather than assumed: if it is not
// running this runner says so (and how to start it) instead of quietly passing.
import { spawnSync } from 'node:child_process';

const api = 'http://127.0.0.1:8130/api/health';
let apiUp = false;
try { const r = await fetch(api, { signal: AbortSignal.timeout(1500) }); apiUp = r.ok; } catch (_) { apiUp = false; }

const suites = [
  ['ledger-selftest.mjs', ['tools/ledger-selftest.mjs'], true],
  ['events-selftest.mjs', ['tools/events-selftest.mjs', 'index.html'], true],
  ['events-contract.mjs', ['tools/events-contract.mjs', 'index.html', '--selftest'], true],
  ['pack-flow-selftest.mjs', ['tools/pack-flow-selftest.mjs', 'index.html'], true],
  ['flush-e2e.mjs', ['tools/flush-e2e.mjs'], apiUp],
  ['status-contract.mjs', ['tools/status-contract.mjs', '--selftest'], true],
  ['tune-selftest.mjs', ['tools/tune-selftest.mjs'], true],
  ['cache-split-contract.mjs', ['tools/cache-split-contract.mjs', '--selftest'], true],
  ['stage-report.mjs', ['tools/stage-report.mjs', '--selftest'], true],
];

let failed = 0;
for (const [name, args, enabled] of suites) {
  if (!enabled) { console.log(`— ${name}: skipped (fake api not on 8130 — run: node tools/fake-api.mjs)`); continue; }
  const r = spawnSync(process.execPath, args, { encoding: 'utf8' });
  const out = (r.stdout || '').trim().split('\n');
  const last = out[out.length - 1] || '';
  const ok = r.status === 0;
  if (!ok) failed++;
  console.log(`${ok ? '✓' : '✗'} ${name}: ${last}`);
  if (!ok) console.log((r.stdout || '') + (r.stderr || ''));   // show the failing assertions
}
console.log(failed ? `\n${failed} suite(s) failed` : '\nall suites passed');
process.exit(failed ? 1 : 0);
