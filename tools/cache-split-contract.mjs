// prompt 切分的契约（SPEC-AUDIT 12.3 / #18）
//   node tools/cache-split-contract.mjs            # 检查
//   node tools/cache-split-contract.mjs --selftest # 证明它能红
//
// 背景：app80_cache.js 把「稳定部分进 system / 每轮变的进 user」这一刀，是靠 **6 个字面串**
// 在提示词里定位的：You write MIRU / HOW TO WRITE / HEAT CEILING / CAST ( / - id= / NOW:，
// 外加 app79_ledger.js 追加的 LEDGER CHECK。任何一处标题改了，切分就**静默降级**成一条
// user 消息：不报错、缓存全废、账单翻倍，而且下一轮才会有人发现「怎么贵了」。
//
// 这道闸做两件事：
//   ① 运行时半边：把切分器从**构建产物**里切出来，喂一份真形状的提示词，断言它真的切出
//      system + user，而且两边装的东西对；
//   ② 源码半边：那 6 个字面串还在不在 —— 改了标题的提交当场红，而不是等账单。
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const SRC = 'source/src';

// ---------- ① 从产物里切出切分器 ----------
const start = html.indexOf('lcMsgs = (function (orig)');
const endMark = '})(lcMsgs);';
const end = start < 0 ? -1 : html.indexOf(endMark, start);
if (start < 0 || end < 0) { console.error('切分器不在产物里（app80_cache.js 没进构建？）'); process.exit(2); }
const code = html.slice(start, end + endMark.length);

const passthrough = (input) => [{ role: 'user', content: String(input) }];
const splitter = new Function('lcMsgs', 'window', 'location', code + '; return lcMsgs;')(passthrough, {}, { hostname: '127.0.0.1' });

// ---------- ② 一份真形状的提示词（标签与 app3_chat.js 一致） ----------
const PROMPT = [
  'You write MIRU, an interactive romance story app for adult readers in the United States.',
  'STORY: 被剪辑的录像 — 赛前更衣室里，一段被剪过的录像让你成了嫌疑人。',
  "THE USER'S ROLE: 你是队里新来的。",
  "WHAT'S AT STAKE: 全队的信任。",
  'STATUS: 赛前 20 分钟 · 更衣室',
  'CAST (only these ids may speak):',
  '- id=ethan · Closeness to you: 60/100 (stage: warm). Current mood: tense',
  '- id=mason · Closeness to you: 15/100 (stage: cold). Current mood: hostile',
  'PACK: 第 1 章 · 更衣室指控 · 本章目标：把录像的事摊开',
  'MEMORIES: (他答应过今晚给你答复)',
  'STORY SO FAR:\nme: 把完整录像放出来。\nethan: 完整录像不在这个房间。',
  'NOW: 玩家选了 B「留一步」——让他把话说完',
  'HEAT CEILING — SLOW: 可以有张力，但不写露骨内容。',
  'HOW TO WRITE (this is what makes it feel human):\n- React to the exact words just used.',
  'LANGUAGE: write every text field only in Chinese.',
  'Reply with ONLY this JSON: {"beats":[...]}',
  '\n\nLEDGER CHECK: 这一拍有没有推进关系？',
].join('\n');

let pass = 0; const fails = [];
const ok = (name, cond, detail) => {
  if (cond) { pass++; console.log('  ✓', name); }
  else { fails.push(name); console.log('  ✗', name, detail === undefined ? '' : '→ ' + detail); }
};

console.log('① 运行时：切分器真的切出两段');
const out = splitter(PROMPT);
ok('返回两条消息', Array.isArray(out) && out.length === 2, out && out.length);
const [sys, usr] = out;
ok('第一条是 system', sys && sys.role === 'system', sys && sys.role);
ok('第二条是 user', usr && usr.role === 'user', usr && usr.role);
ok('system 里有身份句', sys && sys.content.includes('You write MIRU'));
ok('system 里有写作规则', sys && sys.content.includes('HOW TO WRITE'));
ok('system 里有语气上限', sys && sys.content.includes('HEAT CEILING'));
ok('system 里有输出格式', sys && sys.content.includes('Reply with ONLY this JSON'));
ok('system 里有固定角色卡', sys && sys.content.includes('- id=ethan'));
ok('user 里有 NOW', usr && usr.content.includes('NOW:'));
ok('user 里有聊天记录', usr && usr.content.includes('STORY SO FAR:'));
ok('user 里有状态', usr && usr.content.includes('STATUS: 赛前'));
ok('LEDGER CHECK（每轮变）落在 user', usr && usr.content.includes('LEDGER CHECK'));
ok('system 里没有 NOW（否则缓存每轮都废）', !(sys && sys.content.includes('NOW: 玩家选了')));
ok('system 里没有聊天记录', !(sys && sys.content.includes('STORY SO FAR')));
ok('user 里没有写作规则', !(usr && usr.content.includes('HOW TO WRITE')));

console.log('   已知的静默失效形态（改标题之后）：');
const renamed = PROMPT.replace('HOW TO WRITE', 'WRITING RULES');
const degraded = splitter(renamed);
ok('标题改名 ⇒ 退化成一条 user 消息（不报错）', degraded.length === 1 && degraded[0].role === 'user', degraded.length);
console.log('      ↑ 这就是为什么下面这条源码检查必须存在');

console.log('② 源码：那 6 个字面串还在');
const anchors = [
  ['app3_chat.js', 'You write MIRU'],
  ['app3_chat.js', 'HOW TO WRITE'],
  ['app3_chat.js', 'HEAT CEILING'],
  ['app3_chat.js', 'CAST ('],
  ['app3_chat.js', '- id='],
  ['app3_chat.js', 'NOW:'],
  ['app79_ledger.js', 'LEDGER CHECK'],
];
const src = {};
for (const f of fs.readdirSync(SRC)) if (f.endsWith('.js')) src[f] = fs.readFileSync(`${SRC}/${f}`, 'utf8');
const missing = anchors.filter(([f, lit]) => !(src[f] || '').includes(lit));
ok('切分依赖的锚点一个都不少', missing.length === 0, missing.map(m => m.join(':')).join(', '));

if (process.argv.includes('--selftest')) {
  const mutated = Object.assign({}, src, { 'app3_chat.js': (src['app3_chat.js'] || '').replace('HOW TO WRITE', 'WRITING RULES') });
  const miss2 = anchors.filter(([f, lit]) => !(mutated[f] || '').includes(lit));
  const caught = miss2.length > 0;
  console.log(`  · 变异（把 HOW TO WRITE 改名）：${caught ? '已抓住 ✓' : '没抓住 ✗'}`);
  if (!caught) { console.log('SELFTEST FAILED'); process.exit(1); }
}

console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) { console.log('FAILED: ' + fails.join(' | ')); process.exit(1); }
console.log('cache split contract OK');
