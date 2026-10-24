// 计划层入口的判据（Ann 2026-10-25 拍：「留个入口位置」，先只观测）
//
//   node tools/plan-gate-selftest.mjs
//
// 这条闸盯的是**入口活着、而且不做事**：
//   ① 新鲜场景 → call=true，且恰好记一条 plot_would_continue
//   ② 已缓存   → call=false（why=reuse），一条事件都不记
//   ③ 试过一次 → call=false（why=already-tried）
//   ④ 开关关掉 → skipped，不判断也不记
//   ⑤ 传 null   → 不抛，ok=false
//   ⑥ **绝不生成**：入口的返回值里不能出现章节/选项这类产物（防止有人偷偷把它接成 B）
import fs from 'node:fs';
import vm from 'node:vm';

const src = fs.readFileSync('source/src/app99_plan.js', 'utf8');

function makeEnv(opts = {}) {
  const events = [];
  const sandbox = {
    MIRU_TUNE: { chat: { planGate: opts.gate !== false } },
    MIRU_REV: { gala: 'REV1' },
    track: (name, props) => events.push({ name, props }),
    Object,
  };
  vm.createContext(sandbox);
  vm.runInContext(src + '\nthis.API={plotGate,planDecide,planSet,planKey};', sandbox);
  return { A: sandbox.API, events };
}

let pass = 0; const fails = [];
const ok = (n, c, d) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fails.push(n); console.log('  ✗ ' + n, d === undefined ? '' : '→ ' + JSON.stringify(d).slice(0, 140)); } };

const mkTh = () => ({ wid: 'gala', pk: { ch: 2 } });

console.log('① 新鲜场景');
{
  const { A, events } = makeEnv();
  const r = A.plotGate(mkTh());
  ok('call=true', r.call === true, r);
  ok('恰好一条 plot_would_continue', events.length === 1 && events[0].name === 'plot_would_continue', events);
  ok('事件带 wid 与章号', events[0].props.wid === 'gala' && events[0].props.ch === 2, events[0].props);
}

console.log('② 已有计划');
{
  const { A, events } = makeEnv();
  const th = mkTh();
  A.planSet(th, { beats: ['x'] });
  const r = A.plotGate(th);
  ok('call=false 且 why=reuse', r.call === false && r.why === 'reuse', r);
  ok('不记事件', events.length === 0, events);
}

console.log('③ 试过一次');
{
  const { A, events } = makeEnv();
  const th = mkTh();
  th.planTry = { [A.planKey(th)]: true };
  const r = A.plotGate(th);
  ok('call=false 且 why=already-tried', r.call === false && r.why === 'already-tried', r);
  ok('不记事件', events.length === 0, events);
}

console.log('④ 开关关掉');
{
  const { A, events } = makeEnv({ gate: false });
  const r = A.plotGate(mkTh());
  ok('skipped', r.skipped === true, r);
  ok('不记事件', events.length === 0, events);
}

console.log('⑤ 传 null 不抛');
{
  const { A, events } = makeEnv();
  let threw = false, r = null;
  try { r = A.plotGate(null); } catch (_) { threw = true; }
  ok('没抛异常', threw === false);
  ok('不抛且明确说明为什么没续（no-thread）', r && r.ok === true && r.call === false && r.why === 'no-thread', r);
  ok('不记事件', events.length === 0, events);
}

console.log('⑥ 只观测，不生成');
{
  const { A } = makeEnv();
  const r = A.plotGate(mkTh());
  const keys = Object.keys(r).sort();
  const allowed = ['call', 'key', 'ok', 'why'];
  ok('返回值只有判断字段', keys.every(k => allowed.includes(k)), keys);
  ok('没有章节/选项产物', !('chapters' in r) && !('choices' in r) && !('beats' in r), keys);
}

console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) { console.log('FAILED: ' + fails.join(' | ')); process.exit(1); }
console.log('plan gate OK');
