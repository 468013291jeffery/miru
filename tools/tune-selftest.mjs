// 可调参数（滑钮）的自检
//   node tools/tune-selftest.mjs
//
// 三件事：
//   1) 默认值齐全，且改一个键真的会生效（不是写了个对象没人读）
//   2) 拼错的键**不会**静默生效（否则你在 config.js 里写了 typo，以为改了其实没改）
//   3) 调用处真的读 MIRU_TUNE，原来的字面量已经不在那儿了
import fs from 'node:fs';

const SRC = 'source/src';
const TUNE = fs.readFileSync(`${SRC}/app96_tune.js`, 'utf8');
const load = (override) => new Function('window', TUNE + '\nreturn MIRU_TUNE;')(override === undefined ? {} : { MIRU_TUNE_OVERRIDE: override });

let pass = 0; const fails = [];
const ok = (name, cond, detail) => {
  if (cond) { pass++; console.log('  ✓', name); }
  else { fails.push(name); console.log('  ✗', name, detail === undefined ? '' : '→ ' + detail); }
};

console.log('1) 默认值');
const d = load();
ok('pay.packPrice = 50', d.pay.packPrice === 50, d.pay.packPrice);
ok('pay.endingNeed = 4', d.pay.endingNeed === 4, d.pay.endingNeed);
ok('chat.transcript = 20 / plus 60', d.chat.transcript === 20 && d.chat.transcriptPlus === 60);
ok('love.deltaCap = 12', d.love.deltaCap === 12, d.love.deltaCap);
ok('love.stageMin 是 5 档', Array.isArray(d.love.stageMin) && d.love.stageMin.length === 5);
ok('report.omniscienceThreshold = 0.10', d.report.omniscienceThreshold === 0.10, d.report.omniscienceThreshold);

console.log('2) 覆盖');
const o = load({ pay: { packPrice: 60 }, love: { deltaCap: 20 } });
ok('覆盖生效（packPrice 60）', o.pay.packPrice === 60, o.pay.packPrice);
ok('覆盖生效（deltaCap 20）', o.love.deltaCap === 20, o.love.deltaCap);
ok('同段其它键保持默认', o.pay.endingNeed === 4, o.pay.endingNeed);
ok('其它段保持默认', o.chat.transcript === 20, o.chat.transcript);
ok('拼错的键被忽略（不会静默生效）', load({ pay: { packprice: 99 } }).pay.packPrice === 50);
ok('拼错也不会新增键', load({ pay: { packprice: 99 } }).pay.packprice === undefined);
ok('未声明的段被忽略', load({ nonsense: { x: 1 } }).nonsense === undefined);

console.log('3) 调用处真的读了它');
const files = {};
for (const f of fs.readdirSync(SRC)) if (f.endsWith('.js')) files[f] = fs.readFileSync(`${SRC}/${f}`, 'utf8');
const has = (f, s) => (files[f] || '').includes(s);
ok('app14_pack 价格来自 MIRU_TUNE', has('app14_pack.js', 'MIRU_TUNE.pay.packPrice'));
ok('app14_pack 结局需求来自 MIRU_TUNE', has('app14_pack.js', 'MIRU_TUNE.pay.endingNeed'));
ok('app14_pack aiCost 来自 MIRU_TUNE', has('app14_pack.js', 'MIRU_TUNE.ai.costDeep'));
ok('app3_chat 窗口来自 MIRU_TUNE', has('app3_chat.js', 'MIRU_TUNE.chat.transcriptPlus'));
ok('app3_chat 阶段门槛来自 MIRU_TUNE', has('app3_chat.js', 'MIRU_TUNE.love.stageMin'));
ok('app73 每日上限来自 MIRU_TUNE', has('app73_features.js', 'MIRU_TUNE.affinity.cap'));
ok('app95 步长上限来自 MIRU_TUNE', has('app95_status.js', 'MIRU_TUNE.love.deltaCap'));
ok('app45 冷却下限来自 MIRU_TUNE', has('app45_rel.js', 'MIRU_TUNE.love.cooldownMin'));
ok('app16 合并块数来自 MIRU_TUNE', has('app16_story2.js', 'MIRU_TUNE.chat.partMergeMax'));

console.log('4) 旧字面量已经不在那儿（变异：塞回去必须被抓）');
const literals = [
  ['app14_pack.js', 'const PACK_PRICE=50,'],
  ['app3_chat.js', 'const STAGE_MIN=[0,20,40,60,80];'],
  ['app73_features.js', 'const AF_CAP = 15,'],
  ['app95_status.js', 'const LOVE_MIN = 0, LOVE_MAX = 100, LOVE_DELTA_CAP = 12;'],
  ['app45_rel.js', '"cooldown",{min:-60}'],
  ['app16_story2.js', 'L.parts.length<5'],
];
for (const [f, lit] of literals) ok(`${f} 里不再是字面量`, !has(f, lit));
const mutated = Object.assign({}, files, { 'app95_status.js': files['app95_status.js'] + '\nconst LOVE_MIN = 0, LOVE_MAX = 100, LOVE_DELTA_CAP = 12;\n' });
const caught = literals.some(([f, lit]) => (mutated[f] || '').includes(lit));
console.log(`  · 变异（把字面量塞回去）：${caught ? '已抓住 ✓' : '没抓住 ✗'}`);
if (!caught) { console.log('SELFTEST FAILED'); process.exit(1); }

console.log('5) 服务端那一套（另一条机制：数据库配置 / 环境变量）');
const api = {};
for (const f of fs.readdirSync('api')) if (f.endsWith('.js')) api[f] = fs.readFileSync('api/' + f, 'utf8');
const ahas = (f, s) => (api[f] || '').includes(s);
ok('CONFIG_DEFAULTS 里有 state_max_kb', ahas('_lib.js', 'state_max_kb: 900'));
ok('CONFIG_DEFAULTS 里有 max_pack_kb', ahas('_lib.js', 'max_pack_kb: 1500'));
ok('CONFIG_DEFAULTS 里有 first_token_ms', ahas('_lib.js', 'first_token_ms: 22000'));
ok('state.js 读 config.state_max_kb', ahas('state.js', 'state_max_kb'));
ok('works.js 读 config.max_pack_kb', ahas('works.js', 'max_pack_kb'));
ok('wallet.js 用 config.earn_cap（不再有第二个 80）', ahas('wallet.js', 'cfg.earn_cap') && !ahas('wallet.js', '|| EARN_DAY)'));
ok('longcat 走 env（edge 热路径不查库）', ahas('longcat.js', 'MIRU_FIRST_TOKEN_MS'));
ok('state.js 的上限由配置算出（不是常量）', ahas('state.js', 'const MAX = (Number(_cfg.state_max_kb)'));
ok('works.js 的上限由配置算出（不是常量）', ahas('works.js', 'const MAXPACK = (Number(cfg.max_pack_kb)'));


// 流式预览开关（2026-10-25）：默认开；能被覆盖关掉；拼错了不影响
{
  const a = load().chat;
  ok('streamPreview 默认开', a.streamPreview === true, a.streamPreview);
  const b = load({ chat: { streamPreview: false } }).chat;
  ok('streamPreview 可被关掉', b.streamPreview === false, b.streamPreview);
}
console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) { console.log('FAILED: ' + fails.join(' | ')); process.exit(1); }
console.log('tune selftest OK');
