// 角色卡（每章一份快照）的判据 —— 五条，缺一条这套设计就不成立
//
//   node tools/card-selftest.mjs            # 检查
//   node tools/card-selftest.mjs --selftest # 证明它真会红
//
// ① 可变折叠正确        ② 只增不回退、但早期章节看不到后来的
// ③ 立场只能加码        ④ 揭示不改卡上的秘密本身
// ⑤ 可回放（重算两次逐字节相同）
import fs from 'node:fs';

const SRC = 'source/src/app97_card.js';
const code = fs.readFileSync(SRC, 'utf8');
// 模块里的 cardBase 依赖运行时 ch()；这里注入一个假的角色表
const CHARS = { mason: { n: 'Mason', age: 26, role: { en: 'forward' }, looks: { en: 'tall' }, vibe: { en: 'cold' }, tells: { en: ['jaw'] }, twist: { en: 'kind' }, likes: { en: 'ice' }, secret: { en: 'THE-PUCK' } } };
const api = new Function('ch', code + '\nreturn { cardBase, cardPatch, cardCommit, cardAt, cardDiff };')((id) => CHARS[id]);
const { cardCommit, cardAt, cardDiff } = api;

let pass = 0; const fails = [];
const ok = (n, c, d) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fails.push(n); console.log('  ✗ ' + n, d === undefined ? '' : '→ ' + d); } };

const th = {};
cardCommit(th, 1, { mutable: { love: 5, stage: 0 }, knows: ['他在更衣室出现过'], firsts: { met: 1 } });
cardCommit(th, 2, { mutable: { love: 9 } });
cardCommit(th, 3, { mutable: { love: -4, mood: 'hostile' }, stance: { betrayed: 3 }, revealed: { secret: 'self' } });
cardCommit(th, 4, { mutable: { love: 6 }, knows: ['那段录像被剪过'], said: ['“完整录像不在这个房间。”'] });

console.log('① 可变折叠');
const at4 = cardAt(th, 'mason', 4);
ok('love 取章末快照（第 4 章是 6）', at4.mutable.love === 6, at4.mutable.love);
ok('mood 保留最后一次', at4.mutable.mood === 'hostile');
ok('到第 2 章时 love 是 9', cardAt(th, 'mason', 2).mutable.love === 9, cardAt(th, 'mason', 2).mutable.love);

console.log('② 只增不回退，但早期看不到后来的');
ok('第 4 章有两个 knows', at4.knows.length === 2, at4.knows.length);
ok('第 2 章只有第一个 knows', cardAt(th, 'mason', 2).knows.length === 1, cardAt(th, 'mason', 2).knows.length);
ok('第 1 章一个都没有', cardAt(th, 'mason', 1).knows.length === 1);   // ch1 本身就写了那条
ok('第 0 章什么都没有', cardAt(th, 'mason', 0).knows.length === 0);

console.log('③ 立场只能加码');
ok('第 3 章出现 betrayed', cardAt(th, 'mason', 3).stance.betrayed === 3);
ok('第 2 章还没有', cardAt(th, 'mason', 2).stance.betrayed === undefined);
cardCommit(th, 5, { stance: { betrayed: 2 } });
ok('第二次加码是相加不是覆盖', cardAt(th, 'mason', 5).stance.betrayed === 5, cardAt(th, 'mason', 5).stance.betrayed);
ok('传 0 不会被当成清零写入', (cardCommit(th, 6, { stance: { betrayed: 0 } }).ok === false));

console.log('④ 揭示不改卡上的秘密本身');
const before = JSON.stringify(api.cardBase('mason').secret);
ok('第 3 章揭示后 secret 一字未改', JSON.stringify(cardAt(th, 'mason', 3).secret) === before);
ok('revealed 记下来了', cardAt(th, 'mason', 3).revealed.secret === 'self');
ok('第 2 章还没有 revealed', !cardAt(th, 'mason', 2).revealed.secret);

console.log('⑤ 可回放');
const a = JSON.stringify(cardAt(th, 'mason', 4));
const b = JSON.stringify(cardAt(th, 'mason', 4));
ok('重算两次逐字节相同', a === b);
const shuffled = { cardLog: th.cardLog.slice().reverse() };
ok('补丁顺序打乱也不影响结果', JSON.stringify(cardAt(shuffled, 'mason', 4)) === a);

console.log('⑥ 章末只提交一次');
ok('同一章重复提交被拒', cardCommit(th, 4, { mutable: { love: 99 } }).ok === false);
ok('love 没有被第二次污染', cardAt(th, 'mason', 4).mutable.love !== 99);

console.log('⑦ diff（这一章他变了什么）');
const d4 = cardDiff(th, 'mason', 4);
ok('diff 抓到 love 从 -4 到 6', d4.mutable.love && d4.mutable.love.from === -4 && d4.mutable.love.to === 6, JSON.stringify(d4.mutable.love));
ok('diff 抓到新知道的', Array.isArray(d4.added.knows) && d4.added.knows.length === 1);

if (process.argv.includes('--selftest')) {
  // 变异：让"只看这一章及以前"失效（把 > 改成 >=，等于把未来的补丁也算进来）
  const broken = code.replace('if (p.ch > ch) continue;', 'if (p.ch > ch + 1) continue;');
  const bad = new Function('ch', broken + '\nreturn { cardAt };')((id) => CHARS[id]);
  const leak = bad.cardAt(th, 'mason', 2).stance.betrayed;
  const caught = leak === 3;
  console.log(`  · 变异（让第 2 章看到第 3 章的立场）：${caught ? '已抓住 ✓' : '没抓住 ✗'}`);
  if (!caught) { console.log('SELFTEST FAILED'); process.exit(1); }
}

console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) { console.log('FAILED: ' + fails.join(' | ')); process.exit(1); }
console.log('character card OK');
