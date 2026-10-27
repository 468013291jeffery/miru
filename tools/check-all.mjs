// One command for every check in this repo of tests.
//   node tools/check-all.mjs
// Each suite prints its own detail; this runner only answers "is the tree honest right now".
// The end-to-end one needs the fake backend, so it is probed rather than assumed: if it is not
// running this runner says so (and how to start it) instead of quietly passing.
import { spawnSync } from 'node:child_process';
import { readdirSync, existsSync } from 'node:fs';

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
  ['castcard-selftest.mjs', ['tools/castcard-selftest.mjs', '--selftest'], true],
  ['card-selftest.mjs', ['tools/card-selftest.mjs', '--selftest'], true],
  ['regression-25.mjs', ['tools/regression-25.mjs'], true],
  ['rev-selftest.mjs', ['tools/rev-selftest.mjs'], true],
  ['plan-valid-selftest.mjs', ['tools/plan-valid-selftest.mjs'], true],
  ['replyguard-selftest.mjs', ['tools/replyguard-selftest.mjs'], true],
  ['wiring-check.mjs', ['tools/wiring-check.mjs'], true],
  ['plan-gate-selftest.mjs', ['tools/plan-gate-selftest.mjs'], true],
  ['account-check.mjs', ['tools/account-check.mjs'], true],
  ['perf-budget.mjs', ['tools/perf-budget.mjs'], true],
  ['timer-audit.mjs', ['tools/timer-audit.mjs', '--check'], true],
  ['ask-retry-selftest.mjs', ['tools/ask-retry-selftest.mjs'], true],
  ['render-snapshot.mjs', ['tools/render-snapshot.mjs','--check'], true],
  ['doc-ref-check.mjs', ['tools/doc-ref-check.mjs'], true],
  ['pkdirective-check.mjs', ['tools/pkdirective-check.mjs'], true],
  ['on-assign-check.mjs', ['tools/on-assign-check.mjs','--check'], true],
  ['errlog-selftest.mjs', ['tools/errlog-selftest.mjs'], true],
  ['soft-syntax-probe.mjs', ['tools/soft-syntax-probe.mjs'], true],
  ['empty-catch-check.mjs', ['tools/empty-catch-check.mjs','--check'], true],
  ['ui-entry-check.mjs', ['tools/ui-entry-check.mjs'], true],
  ['patch-registry.mjs', ['tools/patch-registry.mjs','--check'], true],
  ['sanitize-selftest.mjs', ['tools/sanitize-selftest.mjs'], true],
  ['save-instrument-check.mjs', ['tools/save-instrument-check.mjs'], true],
  ['pkstate-check.mjs', ['tools/pkstate-check.mjs'], true],
  ['wiring-order-check.mjs', ['tools/wiring-order-check.mjs'], true],
  ['turn-wiring-check.mjs', ['tools/turn-wiring-check.mjs'], true],
  ['bundle-integrity.mjs', ['tools/bundle-integrity.mjs'], true],
  ['prompt-blocks.mjs', ['tools/prompt-blocks.mjs'], true],
];

let failed = 0;

// 在册检查：tools/ 里凡是能被当闸用的文件，必须真的在 suites 里。
// 为什么加这条：card-selftest 曾经"以为接了其实没接"——我拿 includes('card-selftest') 去核对，
// 而那个子串同时命中 castcard-selftest，于是闸整整一轮没跑，check-all 一直是绿的。
{
  const registered = new Set(suites.map(s => s[1][0].replace(/^tools\//, '')));
  const shouldBe = readdirSync('tools').filter(f =>
    /-(selftest|contract)\.mjs$/.test(f) || /^regression-\d+\.mjs$/.test(f));
  const missing = shouldBe.filter(f => !registered.has(f));
  if (missing.length) {
    failed++;
    console.log(`✗ 在册检查: 这些闸没接进 check-all → ${missing.join(', ')}`);
  } else {
    console.log(`✓ 在册检查: ${shouldBe.length} 个闸全部在册`);
  }
  const ghosts = suites.filter(s => !existsSync(s[1][0])).map(s => s[1][0]);
  if (ghosts.length) { failed++; console.log(`✗ 在册检查: 登记了但文件不存在 → ${ghosts.join(', ')}`); }
}

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
