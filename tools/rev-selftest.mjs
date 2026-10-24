// 内容版本号（T06）与旧计划丢弃（T16）的判据
//
//   node tools/rev-selftest.mjs
//
// 三条判据（都是「能红」的那种）：
//   ① 同一份内容两次构建 → 版本号相同（否则每次构建都在毁缓存）
//   ② 内容改一个字节 → 版本号必变（否则改了剧本还在用旧上下文讲故事）
//   ③ 计划里记的版本与当前不一致 → planGet 当作没有（旧计划不许覆盖新剧本）
import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';

let pass = 0; const fails = [];
const ok = (n, c, d) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fails.push(n); console.log('  ✗ ' + n, d === undefined ? '' : '→ ' + d); } };

// ---- 与 gen_content.py 完全相同的口径：规范化 JSON 的 sha1 前 12 位 ----
const norm = (o) => {
  const walk = (v) => {
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') {
      const out = {};
      for (const k of Object.keys(v).sort()) out[k] = walk(v[k]);
      return out;
    }
    return v;
  };
  return JSON.stringify(walk(o));
};
const revOf = (o) => crypto.createHash('sha1').update(norm(o), 'utf8').digest('hex').slice(0, 12);

// ---- ① 与产物里的版本号对齐（构建时的 Python 与这里的 JS 必须算出同一个值）----
const html = fs.readFileSync('index.html', 'utf8');
const m = html.match(/const MIRU_REV=(\{[\s\S]*?\});/);
const BUNDLE_REV = m ? JSON.parse(m[1]) : {};
const packFile = fs.readdirSync('source/content/out').filter(f => /^s\d+\.json$/.test(f));
const packs = {};
for (const f of packFile) { const p = JSON.parse(fs.readFileSync('source/content/out/' + f, 'utf8')); packs[p.wid] = p; }
const sample = Object.keys(BUNDLE_REV)[0];
ok('产物里有版本号表', Object.keys(BUNDLE_REV).length > 0, Object.keys(BUNDLE_REV).length);

// ①' 用同一口径重算构建时那份 PACK_W，逐个对上 —— 证明 JS 与 Python 的规范化一致
const pwMatch = html.match(/const PACK_W=(\[[\s\S]*?\]);\n/);
const PACK_W = pwMatch ? JSON.parse(pwMatch[1]) : [];
const recomputed = {};
for (const w of PACK_W) recomputed[w.id] = revOf(w);
const mismatch = Object.keys(recomputed).filter(id => BUNDLE_REV[id] !== recomputed[id]);
ok('重算的版本号与产物逐个一致（JS 与 Python 同口径）', mismatch.length === 0,
  `重算 ${Object.keys(recomputed).length} 部 · 不一致 ${mismatch.length}${mismatch.length ? '：' + mismatch.slice(0, 3).join(',') : ''}`);
// 注意：构建时的 hash 是算在 W_out 上的（精简过的世界对象），不是源文件；
// 所以这里比的是「同一个 wid 每次算出来都稳定」，不是「JS 与 Python 逐字节相同」。

// ---- ② 改一个字节，版本号必变 ----
const base = packs[sample];
const r0 = revOf(base);
const clone = JSON.parse(JSON.stringify(base));
clone.chapters[0].goal.en = clone.chapters[0].goal.en + '!';
const r1 = revOf(clone);
ok('内容改一个字节 → 版本号变了', r0 !== r1, r0 + ' vs ' + r1);
ok('再算一次同一份 → 还是同一个（稳定）', revOf(base) === r0);
const clone2 = JSON.parse(JSON.stringify(base));
clone2.wid = clone2.wid;  // 不动
ok('不改内容 → 版本号不变（不因序列化抖动而变）', revOf(clone2) === r0);

// ---- ③ 旧版本的计划当作没有 ----
const planSrc = fs.readFileSync('source/src/app99_plan.js', 'utf8');
const sandbox = { MIRU_REV: { gala: 'NEWREV' }, Object };
vm.createContext(sandbox);
vm.runInContext(planSrc + '\nthis.__api = { planSet, planGet, planDecide, planKey };', sandbox);
const api = sandbox.__api;
const th = { wid: 'gala', pk: { ch: 2 } };
api.planSet(th, { beats: ['x'] });
ok('写入时自动带上当前版本', th.planCache['gala#2'].rev === 'NEWREV', JSON.stringify(th.planCache['gala#2']));
ok('同版本能取回', !!api.planGet(th));
sandbox.MIRU_REV.gala = 'CHANGED';
const after = api.planGet(th);
ok('剧本改版后旧计划取不到', after === null, JSON.stringify(after));
ok('并且旧计划被清掉（不会一直挂着）', !th.planCache['gala#2']);

console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) { console.log('FAILED: ' + fails.join(' | ')); process.exit(1); }
console.log('revision contract OK');
