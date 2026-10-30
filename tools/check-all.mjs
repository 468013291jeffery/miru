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
  /* 剧本解析只剩一张表：层表 / 顺序 / 无猴子补丁 / 兼容门（--selftest 五臂，含四枚变异） */
  ['parse-registry-check.mjs', ['tools/parse-registry-check.mjs'], true],
  ['dialogue-selftest.mjs', ['tools/dialogue-selftest.mjs'], true],
  ['wiring-check.mjs', ['tools/wiring-check.mjs'], true],
  ['plan-gate-selftest.mjs', ['tools/plan-gate-selftest.mjs'], true],
  ['account-check.mjs', ['tools/account-check.mjs'], true],
  ['perf-budget.mjs', ['tools/perf-budget.mjs'], true],
  ['timer-audit.mjs', ['tools/timer-audit.mjs', '--check'], true],
  ['ask-retry-selftest.mjs', ['tools/ask-retry-selftest.mjs'], true],
  ['render-snapshot.mjs', ['tools/render-snapshot.mjs','--check'], true],
  ['msgkind-probe.mjs', ['tools/msgkind-probe.mjs'], true],
  /* 样式版的对拍：文本对拍在 CSS 上不成立（合并重复定义必然改文本），只能比生效值 */
  ['style-computed-snapshot.mjs', ['tools/style-computed-snapshot.mjs','--check'], true],
  /* 死样式「别新增」：基线在 tools/css-dead-baseline.json，新增或复活都红 */
  ['css-dead-rules.mjs', ['tools/css-dead-rules.mjs','--check'], true],
  /* 弹层版的对拍：每个具名弹层开一次，HTML 逐字节比 */
  ['sheet-snapshot.mjs', ['tools/sheet-snapshot.mjs','--check'], true],
  /* 防回潮：具名弹层被包了几层，与基线比（两个方向都红） */
  ['sheet-census.mjs', ['tools/sheet-census.mjs','--check'], true],
  ['doc-ref-check.mjs', ['tools/doc-ref-check.mjs'], true],
  /* 2026-10-28 Ann：「架构文档写的时候要跟上，要不然做的多了会忘记之前的事情」 */
  ['doc-freshness.mjs', ['tools/doc-freshness.mjs','--check'], true],
  /* 2026-10-29：模块索引是生成的 —— 加一个文件或改一句头注释，这张表就该跟着变 */
  ['module-index.mjs', ['tools/module-index.mjs','--check'], true],
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
  /* 2026-10-30：进故事「有哪几个视角」—— Ann 报「只有导演视角」那天，**没有任何闸看这个面**。
     它验的是「三路永远是三路」（补齐 + 提示 + 负对照 + 界面按钮数），不是某部剧的数据。 */
  ['entry-modes-probe.mjs', ['tools/entry-modes-probe.mjs'], true],
  /* 2026-10-30：**谁先开口**，第一次能在渲染层判红判绿。
     用 ice#1 / 扮演 mason：37 部里只有 2 部开场先轮到玩家（crimson / heir），ice 不是其中之一。
     它看的是用户屏幕上真出现的东西（`narr,narr,narr,other` vs `…,self,other`），
     不是数据层推断 —— 10-29 那次「数据层全绿」其实只做了一半（只避开 think，没避开 say）。
     探针自己会点「下一句」（默认是「点一下才继续」），否则它永远停在第 3 条。 */
  ['beat-order-probe.mjs', ['tools/beat-order-probe.mjs', '--mode=open', '--pack=ice', '--as=mason'], true],
  ['prompt-blocks.mjs', ['tools/prompt-blocks.mjs'], true],
  /* 2026-10-27：语音探针**暂不挂这里** —— 它需要一个跑着 tools/serve.mjs 的本地服务（8131），
     而全量环境不保证有；硬挂会把整套拖红。用法：先起服务，再 node tools/voice-probe.mjs。
     （它已经抓到并守住了两个真 bug：解码失败被当成「播完了」、TTS 卡死时每条等 8 秒。） */
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
