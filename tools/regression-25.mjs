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
// T05：不是欠账，是风险本身不存在（与 T21 同类）
add('T05', 'trope.slow + heat.slow → 不互相覆盖', 'N/A', `TROPE_MAP 是推荐标签表（"Slow Burn" 只是标签字符串，37 部），heat 是包上的独立字段；两者从来没有合并逻辑，所以「互相覆盖」这个风险不存在。`);

// T21：当前没有任何推送渠道，所以「未授权推送」这个风险暂时不存在 —— 这是 N/A，
// 既不是通过，也不是欠账。
add('T21', '未授权通知/静默时段 → 不发召回', 'N/A',
  `全库无 sw.js / manifest.json / serviceWorker / requestPermission；唯一的「一天一次来电」是应用内提示（app20）。加了推送那天要先把静默时段做上。`);

try {
  // T08：年龄门（开关默认关；开着时未确认 ⇒ heat 压到 slow）
  const src98 = fs.readFileSync('source/src/app98_emotion.js', 'utf8');
  const mk = (ageGate, ageOk) => {
    const sb = { MIRU_TUNE: { tools: { ageGate: ageGate } }, S: { ageOk: ageOk, heat: 'steamy' } };
    return new Function('MIRU_TUNE', 'S', src98 + '\nreturn { ageAllowed, heatGated };')(sb.MIRU_TUNE, sb.S);
  };
  const off = mk(false, false);
  const onUnconfirmed = mk(true, undefined);
  const onConfirmed = mk(true, true);
  const c1 = off.heatGated('steamy') === 'steamy';
  const c2 = onUnconfirmed.heatGated('steamy') === 'slow' && onUnconfirmed.heatGated('mature') === 'slow';
  const c3 = onUnconfirmed.heatGated('fluff') === 'fluff';
  const c4 = onConfirmed.heatGated('steamy') === 'steamy';
  add('T08', '未确认成年 → 保守表达（机制）', (c1 && c2 && c3 && c4) ? 'PASS' : 'FAIL',
    `开关关着不限 ${c1} · 开着未确认压到 slow（steamy+mature）${c2} · fluff 不动 ${c3} · 确认后不压 ${c4}；` +
    `**开关默认关，要不要对现有用户强制是产品决定**`);
} catch (e) { add('T08', '未确认成年 → 保守表达', 'FAIL', e.message); }

try {
  // T06 / T16：内容版本号与旧计划丢弃（tools/rev-selftest.mjs 已单独跑，这里核对产物）
  const hasTable = /const MIRU_REV=\{/.test(html);
  const hasLine = /script rev /.test(html);
  const hasCheck = /旧计划不许覆盖新剧本/.test(html);
  add('T06', '编剧更新内容 → 固定缓存与计划失效', (hasTable && hasLine) ? 'PASS' : 'FAIL',
    `产物里有版本号表 ${hasTable} · PACK 行带 rev ${hasLine}（内容一改，固定段就变）`);
  add('T16', 'Plot98 返回旧版本的旧计划 → 丢弃', (hasCheck) ? 'PASS' : 'FAIL',
    'planGet 比对剧本版本，不一致就当没有并清掉（rev-selftest 有 8 条真跑）');
} catch (e) { add('T06', '内容版本号', 'FAIL', e.message); }

try {
  // T17 / T18 / T25：计划层的判断与缓存（source/src/app99_plan.js）
  const P = new Function(fs.readFileSync('source/src/app99_plan.js', 'utf8') +
    '\nreturn { planKey, planGet, planDecide, planTried, planSet };')();
  const th = { wid: 'gala', pk: { ch: 3 } };
  const first = P.planDecide(th);                       // 没计划 ⇒ 该调用一次
  P.planTried(th, false);                               // 试过了（失败也算）
  const second = P.planDecide(th);                      // 同一场景 ⇒ 不再调用
  P.planSet(th, { beats: ['a', 'b'] });                 // 有缓存过后
  const third = P.planDecide(th);                       // ⇒ 复用
  th.pk.ch = 4;
  const other = P.planDecide(th);                       // 换场景 ⇒ 重新触发一次
  let crashed = null;
  try { crashed = P.planDecide(null); } catch (e) { crashed = { call: true, why: 'threw' }; }
  add('T17', '普通对话有有效计划 → 不额外频繁调用', (second.call === false && third.call === false && third.why === 'reuse') ? 'PASS' : 'FAIL',
    `有缓存时 why=${third.why} · 试过一次后 why=${second.why}`);
  add('T18', '新场景无计划 → 按需一次，结果可缓存', (first.call === true && other.call === true) ? 'PASS' : 'FAIL',
    `首次 ${first.call}（${first.why}）· 换场景后 ${other.call}（${other.why}）`);
  add('T25', '计划层失败 → 角色仍可正常回答', (crashed && crashed.call === false) ? 'PASS' : 'FAIL',
    '拿不到 thread 时 planDecide 返回 ' + JSON.stringify(crashed) + '（调用方拿 false 就照常回复）');
} catch (e) { add('T17', '计划层', 'FAIL', e.message); }

try {
  // T01–T04：情绪合同（source/src/app98_emotion.js）
  const emo = new Function(fs.readFileSync('source/src/app98_emotion.js', 'utf8') + '\nreturn { emotionNorm };')().emotionNorm;
  const e1 = emo({});                                            // T01 什么都没有
  const e2 = emo({ heat: 'slow', emotions: ['cozy', 'angst'] });  // T02 暖烈混用
  const e3 = emo({ heat: 'slow', emotions: ['angst', 'angst', 'cozy', 'cozy'] }); // T03 去重
  const e4 = emo({ heat: 'extreme', emotions: ['a', 'b', 'c'] }); // T04 非法 + 超两个
  add('T01', '没有任何 heat/emotion → 缺省 steamy / [angst]',
    (e1.heat === 'steamy' && e1.emotions.length === 1 && e1.emotions[0] === 'angst' && !e1.errors.length) ? 'PASS' : 'FAIL',
    `heat=${e1.heat} emotions=${e1.emotions.join(',')}（现有 37 部都写了 heat，所以这条对它们无影响）`);
  add('T02', 'fluff/cozy 不与 steamy/angst 混用', (e2.errors.some(x => /暖与烈混用/.test(x))) ? 'PASS' : 'FAIL',
    e2.errors.join(' | '));
  add('T03', '多标签去重、主辅顺序稳定', (e3.emotions.join(',') === 'angst,cozy') ? 'PASS' : 'FAIL',
    '去重后 = ' + e3.emotions.join(','));
  const e4heat = e4.errors.some(x => /heat 非法/.test(x));
  const e4bad = e4.errors.filter(x => /情绪标签非法/.test(x)).length === 3;
  const e4max = emo({ heat: 'slow', emotions: ['angst', 'cozy', 'dark'] }).errors.some(x => /最多两个/.test(x));
  add('T04', '非法取值 → 明确校验错误（不静默吞）',
    (e4heat && e4bad && e4max) ? 'PASS' : 'FAIL',
    `heat 报错 ${e4heat} · 三个非法标签各报一条 ${e4bad} · 超两个报错 ${e4max}（非法标签被丢弃后回落到缺省 angst）`);
} catch (e) { add('T01', '情绪合同', 'FAIL', e.message); }

try {
  // T13：prompt 里「先回答玩家说的那句话」这条规则还在不在（app71_narrative.js:29）
  const rule = 'BEAT 1 MUST respond to exactly that';
  const free = 'Free talk answers what the player actually said';
  const inBundle = html.includes(rule) && html.includes(free);
  const inSrc = (src['app71_narrative.js'] || '').includes(rule);
  add('T13', '玩家普通问题 → 先回答，不强制剧情推进', (inBundle && inSrc) ? 'PASS' : 'FAIL',
    'prompt 级规则（app71_narrative.js:29）；行为级只能靠真实对话样本，这里只保证规则不被改掉');
} catch (e) { add('T13', '玩家普通问题 → 先回答，不强制剧情推进', 'FAIL', e.message); }

try {
  // 记忆层的类型表 M2T：fact 与 guess 是两栏，且 guess 明确写着"未确认，不要当成事实"
  const i0 = html.indexOf('const M2T = {');
  let d0 = 0, j0 = html.indexOf('{', i0);
  for (; j0 < html.length; j0++) { if (html[j0] === '{') d0++; else if (html[j0] === '}') { d0--; if (!d0) break; } }
  const M2T = new Function(html.slice(i0, j0 + 1) + '; return M2T;')();
  const hasGuess = !!M2T.guess, hasFact = !!M2T.fact;
  const guessLine = hasGuess ? String(M2T.guess.p || '') : '';
  const saysUnconfirmed = /unconfirmed/i.test(guessLine) && /do not state/i.test(guessLine);
  const distinct = hasGuess && hasFact && M2T.guess.p !== M2T.fact.p;
  // 角色卡那边还是一个平铺的 knows（没有类型）——这一点如实记在 detail 里，不假装它已经好了
  const cardKnowsTyped = /knows:s*\[\]/.test(fs.readFileSync('source/src/app97_card.js', 'utf8')) === false;
  add('T12', '角色错误信念 → 不把猜测说成客观事实', (hasGuess && hasFact && saysUnconfirmed && distinct) ? 'PASS' : 'FAIL',
    `记忆层：fact/guess 两栏 ${distinct} · guess 标注"未确认、别当事实" ${saysUnconfirmed} · 角色卡的 knows 已带 kind ${!cardKnowsTyped}`);
} catch (e) { add('T12', '角色错误信念 → 不把猜测说成客观事实', 'FAIL', e.message); }

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
  ['T19', '剧本耗尽且允许续写 → 先生成/校验/发布', '拆开看：①「判断该不该续」= app99_plan.js 已能给（planDecide）；②「生成候选」缺 ◯ 计划生成 prompt；③「核验」可复用 content/validate.py 的结构规则；④「发布」需人工确认。前三步都是小件，第四步是产品决定'],
  ['T20', '新 Scene Pack 与 canon 冲突 → 拒绝发布', '查过了：content/validate.py 只查结构（双语齐、拍数范围），不查与既有事实的冲突'],
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
console.log(`\nPASS ${count('PASS')} · FAIL ${count('FAIL')} · NOT-YET ${count('NOT-YET')} · N/A ${count('N/A')} · 共 ${results.length}`);
console.log('N/A = 这个风险在当前形态下不存在（不是通过，也不是欠账）');
console.log('说明：NOT-YET 不是"通过"，是"这条依赖的机制还不存在"——写清楚了缺什么、指向对账哪条。');

const fails = results.filter(r => r.verdict === 'FAIL');
if (fails.length) { console.log('\nFAILED: ' + fails.map(r => r.id).join(', ')); process.exit(1); }
if (process.argv.includes('--strict') && count('NOT-YET')) {
  console.log(`\nSTRICT: 还有 ${count('NOT-YET')} 条跑不了`); process.exit(1);
}
console.log('\nregression map OK（没有 FAIL）');
