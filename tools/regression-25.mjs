// 文档 §14.1 的「核心回归 25 条」—— 现在能跑几条、跑不了的缺什么
//
//   node tools/regression-25.mjs            # 跑能跑的那几条 + 打印完整映射
//   node tools/regression-25.mjs --strict   # 只要还有 NOT-YET 就红（等 25 条都能跑的那天用）
//
// 这一份的诚实之处在于：**不把 25 条都写成绿的**。
// 文档要求的这 25 条依赖一堆还不存在的东西（Plot98、emotion 合同、revision、author_only…），
// 硬把它们标成"通过"等于骗自己。所以每条只有三种状态：
//   PASS      —— 代码里有这个机制，这里真跑一遍
//   FAIL      —— 有这个机制，但行为不对（会让 check-all 红）
//   NOT-YET   —— 机制还不存在，写明缺什么、指向对账的哪一条
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const html = fs.readFileSync('index.html', 'utf8');
const src = {};
for (const f of fs.readdirSync('source/src')) if (f.endsWith('.js')) src[f] = fs.readFileSync('source/src/' + f, 'utf8');
const all = Object.values(src).join('\n');

// 从产物里切一个函数出来（按大括号配对）
const cutFn = (name, from = html) => {
  const i = from.indexOf('function ' + name + '(');
  if (i < 0) return null;
  let d = 0, j = from.indexOf('{', i);
  for (; j < from.length; j++) { if (from[j] === '{') d++; else if (from[j] === '}') { d--; if (!d) break; } }
  return from.slice(i, j + 1);
};

// 卡模块的两个常量：切函数时必须一起带，否则 cardPatch 里 ReferenceError 会被 try 吞成 ok:false
const CONSTS = (() => {
  const m = fs.readFileSync('source/src/app97_card.js', 'utf8');
  const a = m.match(/const CARD_MONO = \[[^\]]*\];/);
  const b = m.match(/const CARD_FIRSTS = "[^"]*";/);
  return (a ? a[0] : '') + '\n' + (b ? b[0] : '');
})();

const results = [];
const add = (id, what, verdict, detail) => results.push({ id, what, verdict, detail });

// ---- 能真跑的几条 ----
try {
  const wsrc = fs.readFileSync('api/wallet.js', 'utf8');
  const a0 = wsrc.indexOf('async function apply(');
  let d0 = 0, j0 = wsrc.indexOf('{', a0);
  for (; j0 < wsrc.length; j0++) { if (wsrc[j0] === '{') d0++; else if (wsrc[j0] === '}') { d0--; if (!d0) break; } }
  const applySrc = wsrc.slice(a0, j0 + 1);
  // 假库：内存里一张 wallet + 一张 ledger，行为按 apply 里那几条 SQL 的语义对齐
  const db = { gems: {}, ledger: {} };
  const fakeSql = async (q, args) => {
    if (/SELECT balance FROM ledger WHERE key/.test(q)) { const v = db.ledger[args[0]]; return v == null ? [] : [{ balance: v }]; }
    if (/INSERT INTO wallet/.test(q)) { if (db.gems[args[0]] == null) db.gems[args[0]] = 0; return []; }
    if (/UPDATE wallet SET gems/.test(q)) {
      const next = (db.gems[args[0]] || 0) + args[1];
      if (next < 0) return [];
      db.gems[args[0]] = next; return [{ gems: next }];
    }
    if (/INSERT INTO ledger/.test(q)) {
      const [uid, delta, reason, key, balance] = args;
      if (key == null) { db.ledger['auto' + Math.random()] = balance; return []; }
      if (db.ledger[key] == null) db.ledger[key] = balance;
      return [];
    }
    return [];
  };
  const apply = new Function('return ' + applySrc + ';')();
  const uid = 'u1';
  const r1 = await apply(fakeSql, uid, 100, 'sku', 'order-42');
  const after1 = db.gems[uid];
  const r2 = await apply(fakeSql, uid, 100, 'sku', 'order-42');   // 同一回执再来一次
  const after2 = db.gems[uid];
  const ok = r1 && r1.gems === 100 && after1 === 100 && r2 && r2.dup === true && after2 === 100;
  add('T22', '两次同一支付回执不重复扣费/加分', ok ? 'PASS' : 'FAIL',
    `第一次余额 ${after1} · 第二次 ${after2} · 第二次判为重复 ${!!(r2 && r2.dup)}`);
} catch (e) { add('T22', '两次同一支付回执不重复扣费/加分', 'FAIL', e.message); }

try {
  const code = [cutFn('toolGate'), cutFn('toolUse')].join('\n');
  const A = new Function(code + '\nreturn { toolGate, toolUse };')();
  const th = { pk: { ch: 1 } };
  const off = A.toolGate(th, 'gift', {}).ok;                       // 默认不限 ⇒ 旧行为
  const g4 = i => A.toolGate(th, 'gift', { perScene: 4 });
  A.toolUse(th, 'gift'); A.toolUse(th, 'gift'); A.toolUse(th, 'gift');
  const third = g4().ok;                                          // 第 3 次还应放行
  A.toolUse(th, 'gift');
  const fifth = g4();                                             // 第 4 次之后应拦
  th.pk.ch = 2;                                                   // 换章 ⇒ 计数重置
  const nextScene = g4().ok;
  const cd = A.toolGate(th, 'date', { cooldownMs: 60000 });
  A.toolUse(th, 'date');
  const inCd = A.toolGate(th, 'date', { cooldownMs: 60000 });
  const ok = off && third && fifth.ok === false && nextScene && cd.ok && inCd.ok === false;
  add('T23', '工具冷却 / 本场上限 → 非法工具不展示不执行', ok ? 'PASS' : 'FAIL',
    `默认不限 ${off} · 第3次放行 ${third} · 第4次后拦 ${fifth.ok === false} · 换章重置 ${nextScene} · 冷却生效 ${inCd.ok === false}`);
} catch (e) { add('T23', '工具冷却 / 本场上限', 'FAIL', e.message); }

try {
  const r = spawnSync(process.execPath, ['tools/pack-flow-selftest.mjs', 'index.html'], { encoding: 'utf8' });
  const ran = r.status === 0 && /does not advance the chapter by itself/.test(r.stdout || '');
  add('T14', '玩家不点继续 → 不自动跳场', ran ? 'PASS' : 'FAIL',
    '断言在 pack-flow-selftest（选完不推进章节、结算完停在 next/end）；这里跨套核对它真的跑了');
} catch (e) { add('T14', '玩家不点继续 → 不自动跳场', 'FAIL', e.message); }

try {
  const code = cutFn('loveAllowed');
  const fn = new Function(code + '; return loveAllowed;')();
  const ok1 = fn({ present: ['luca'] }, 'mason') === false;      // 不在场 ⇒ 拦
  const ok2 = fn({ present: ['mason'] }, 'mason') === true;      // 在场 ⇒ 放
  const ok3 = fn({}, 'mason') === true;                          // 没有名单 ⇒ 旧行为
  add('T10', '角色不在场不能发言/触发工具', ok1 && ok2 && ok3 ? 'PASS' : 'FAIL',
    `不在场被拦 ${ok1} · 在场放行 ${ok2} · 无名单放行 ${ok3}`);
} catch (e) { add('T10', '角色不在场不能发言/触发工具', 'FAIL', 'loveAllowed 切不出来：' + e.message); }

try {
  const code = cutFn('loveAllowed');
  // 注入角色表：mason 是恋爱对象，coach 不是
  const CH = { mason: { n: 'M' }, coach: { n: 'C', romanceable: false } };
  const fn = new Function('ch', code + '; return loveAllowed;')((id) => CH[id]);
  const noRomance = fn({}, 'coach') === false;      // 非恋爱对象：即使没有在场名单也不许动
  const romance = fn({}, 'mason') === true;
  const inRoom = fn({ present: ['coach'] }, 'coach') === false;   // 在场也不行
  let cardOk = false;
  try {
    const cc = [cutFn('castCard'), cutFn('castCardPublic')].join('\n');
    const card = new Function('ch', 'Lz', 'CL', 'me', 'stageOf', 'wd', 'I18N', cc + '\nreturn castCard;')(
      () => ({ n: 'C', age: 40, role: { en: 'r' }, looks: { en: 'l' }, vibe: { en: 'v' }, tells: { en: [] }, twist: { en: 'w' }, likes: { en: 'k' }, secret: { en: 's' }, romanceable: false }),
      x => (x && (x.en || x)) || '', () => 'en', () => 'you', () => 0, () => ({ pack: {} }), { en: { 'stage.0': 's' } });
    cardOk = card({ love: {}, status: { mood: {} } }, 'coach').includes('Not a romance option');
  } catch (_) {}
  add('T07', 'romanceable=false → 不自动调情/不涨好感', (noRomance && romance && inRoom && cardOk) ? 'PASS' : 'FAIL',
    `非恋爱对象被拦 ${noRomance} · 恋爱对象放行 ${romance} · 在场也拦 ${inRoom} · 卡面写明 ${cardOk}`);
} catch (e) { add('T07', 'romanceable=false → 不自动调情', 'FAIL', e.message); }

try {
  const code = [cutFn('castCard'), cutFn('castCardPublic')].join('\n');
  const CH = { n: 'M', age: 26, role: { en: 'r' }, looks: { en: 'l' }, vibe: { en: 'v' }, tells: { en: ['t'] }, twist: { en: 'TWIST-X' }, likes: { en: 'k' }, secret: { en: 'SECRET-X' } };
  const f = new Function('ch', 'Lz', 'CL', 'me', 'stageOf', 'wd', 'I18N', code + '\nreturn { castCard, castCardPublic };')(
    () => CH, x => (x && (x.en || x)) || '', () => 'en', () => 'you', () => 1, () => ({ pack: {} }), { en: { 'stage.1': 's' } });
  const pub = f.castCardPublic({ love: {}, status: { mood: {} } }, 'm');
  const priv = f.castCard({ love: {}, status: { mood: {} } }, 'm');
  const ok = !pub.includes('SECRET-X') && !pub.includes('TWIST-X') && priv.includes('SECRET-X');
  add('T11', '作者秘密仅 author_only / 角色不能提前知道', ok ? 'PASS' : 'FAIL',
    `公开面含秘密 ${pub.includes('SECRET-X')} · 私密面含秘密 ${priv.includes('SECRET-X')}`);
} catch (e) { add('T11', '作者秘密仅 author_only / 角色不能提前知道', 'FAIL', e.message); }

try {
  const code = CONSTS + '\n' + cutFn('cardCommit') + '\n' + cutFn('cardPatch');
  const f = new Function(code + '; return cardCommit;')();
  const th = { cardLog: {} };
  const a = f(th, 'mason', 1, { mutable: { love: 5 } });
  const b = f(th, 'mason', 1, { mutable: { love: 9 } });
  add('T15', '重复请求只执行一次效果', (a.ok && !b.ok && th.cardLog.mason.length === 1) ? 'PASS' : 'FAIL',
    `第一次 ${a.ok} · 第二次 ${b.ok} · 补丁数 ${th.cardLog.mason.length}`);
} catch (e) { add('T15', '重复请求只执行一次效果', 'FAIL', e.message); }

try {
  const code = CONSTS + '\n' + [cutFn('cardBase'), cutFn('cardPatch'), cutFn('cardAt'), cutFn('cardCommit')].join('\n');
  const CH = { n: 'M', age: 26, role: { en: 'r' }, looks: { en: 'l' }, vibe: { en: 'v' }, tells: { en: ['t'] }, twist: { en: 'w' }, likes: { en: 'k' }, secret: { en: 'S' } };
  const f = new Function('ch', code + '\nreturn { cardCommit, cardAt };')(() => CH);
  const th = { cardLog: {} };
  f.cardCommit(th, 'm', 1, { mutable: { love: 5 } });
  f.cardCommit(th, 'm', 2, { mutable: { love: 60 }, stance: { betrayed: 1 } });
  const c1 = f.cardAt(th, 'm', 1), c2 = f.cardAt(th, 'm', 2);
  const stable = JSON.stringify(c1.immutable) === JSON.stringify(c2.immutable) && c1.secret === c2.secret;
  add('T24', '成长事件未达阈值不改变核心人格', stable ? 'PASS' : 'FAIL',
    `两章之间不可变部分逐字节相同 ${stable}`);
} catch (e) { add('T24', '成长事件未达阈值不突然改变核心人格', 'FAIL', e.message); }

// 静态断言（不是运行时，但能锁住"这个机制还在"）
const has = (re) => re.test(all);
add('T09', '玩家明确拒绝 → 降档并停止试探', has(/dimAdd\(th,as\+"\|\"\+cid,\{ten:6,tru:-4\},"decline"\)/) ? 'PASS' : 'FAIL',
  '拒绝路径写 dims：张力 +6 / 信任 −4（app42_decline.js）');

// ---- 机制还不存在的：写明缺什么 ----
const NY = [
  ['T01', '没有任何 heat/emotion → 缺省 steamy/[angst]', '没有 emotion 合同（对账 #2）；heat 只有用户全局档（#1）'],
  ['T02', '显式 fluff + cozy → 不混入 steamy/angst', '同上：没有 emotion 标签系统'],
  ['T03', 'emotion=[angst,cozy] → 去重与主辅顺序稳定', '同上'],
  ['T04', 'heat 非法或情绪超过两个 → 明确校验错误', '同上：没有校验层'],
  ['T05', 'trope.slow + heat.slow → 不互相覆盖', 'TROPE_MAP 存在但没有"慢燃"这一维的合并规则'],
  ['T06', '编剧更新标签版本 → 固定缓存与计划失效', '没有 revision 概念（对账 #6）'],
  ['T08', '未确认成年 → 保守表达', '全库 0 处年龄验证'],
  ['T12', '角色错误信念 → 不把猜测说成事实', '四类认知（fact/guess/misbelief/author_only）不存在（对账 #8）'],
  ['T13', '玩家普通问题 → 先回答不硬推进', '这是 prompt 规则，没有可断言的行为；需真实对话样本'],
  ['T16', 'Plot98 返回旧 revision → 丢弃', '没有 Plot98（对账 #12）'],
  ['T17', '普通对话有有效计划 → 不频繁调 Plot98', '同上'],
  ['T18', '新场景无计划 → 按需一次并缓存', '同上'],
  ['T19', '剧本耗尽且允许续写 → 先生成/校验/发布', '没有续写流程（对账 #14）'],
  ['T20', '新 Scene Pack 与 canon 冲突 → 拒绝发布', '查过了：content/validate.py 只查结构（双语齐、拍数范围），不查与既有事实的冲突'],
  ['T21', '未授权通知/静默时段 → 不发召回', '查过了：全库无 serviceWorker / push 订阅 / requestPermission；app20 那条“一天一次来电”是应用内提示，不是推送'],
  ['T25', 'Plot98 失败 → 角色仍可回答', '没有 Plot98（对账 #12）'],
];
for (const [id, what, why] of NY) add(id, what, 'NOT-YET', why);

// ---- 打印 ----
// 表必须正好 25 行、ID 不重复 —— 我一度把 T22 写成两行（一条 PASS 一条 NOT-YET），
// 于是"通过 9 / 缺口 16"合计 26，看起来像进度多了一条。这条闸专治那种自我美化。
{
  const ids = results.map(r => r.id);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (results.length !== 25 || dup.length) {
    console.log(`✗ 映射表本身不对：行数 ${results.length}（应为 25）· 重复 ID ${dup.join(',') || '无'}`);
    process.exit(1);
  }
}

const order = { PASS: 0, FAIL: 1, 'NOT-YET': 2 };
results.sort((a, b) => (a.id < b.id ? -1 : 1));
const count = k => results.filter(r => r.verdict === k).length;

console.log('文档 §14.1 · 核心回归 25 条（现状映射）\n');
console.log('  ID    结果      测试');
for (const r of results) {
  console.log('  ' + r.id.padEnd(5) + r.verdict.padEnd(10) + r.what);
  if (r.detail) console.log('        └ ' + r.detail);
}
console.log(`\nPASS ${count('PASS')} · FAIL ${count('FAIL')} · NOT-YET ${count('NOT-YET')} · 共 ${results.length}`);
console.log('说明：NOT-YET 不是"通过"，是"这条依赖的机制还不存在"——写清楚了缺什么、指向对账哪条。');

const fails = results.filter(r => r.verdict === 'FAIL');
if (fails.length) { console.log('\nFAILED: ' + fails.map(r => r.id).join(', ')); process.exit(1); }
if (process.argv.includes('--strict') && count('NOT-YET')) {
  console.log(`\nSTRICT: 还有 ${count('NOT-YET')} 条跑不了`); process.exit(1);
}
console.log('\nregression map OK（没有 FAIL）');
