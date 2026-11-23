// tools/iap-selftest.mjs — api/_iap.js 的自检（8 臂，含负对照）
// 跑法：node tools/iap-selftest.mjs
// 夹具是现造的测试证书链（tools/fixtures/gen-iap-fixture.py，需要 python + cryptography）：
// 它验的是「这套验签逻辑能不能区分合法与非法」，不是「Apple 真的会发什么」。
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const IAP = require(path.join(HERE, '..', 'api', '_iap.js'));

let pass = 0, fail = 0;
const results = [];
async function check(name, fn) {
  try { await fn(); pass++; results.push(`  ✓ ${name}`); }
  catch (e) { fail++; results.push(`  ✗ ${name}  — ${String(e.message || e).slice(0, 140)}`); }
}
async function expectThrow(name, fn, wantPattern) {
  await check(name, async () => {
    let threw = null;
    try { await fn(); } catch (e) { threw = e; }
    if (!threw) throw new Error('expected it to throw, but it passed');
    if (wantPattern && !wantPattern.test(String(threw.message))) {
      throw new Error('threw, but message was "' + threw.message + '" (wanted ' + wantPattern + ')');
    }
  });
}

// ---------- 造夹具 ----------
const PY = (() => { for (const c of ['python3','python']) { const r = spawnSync(c, ['-c','import cryptography'], { encoding: 'utf8' }); if (r.status === 0) return c; } return 'python3'; })();
const gen = spawnSync(PY, [path.join(HERE, 'fixtures', 'gen-iap-fixture.py')], { encoding: 'utf8' });
if (gen.status !== 0) {
  console.error('fixture generation failed:\n' + (gen.stderr || gen.error));
  process.exit(2);
}
const F = JSON.parse(gen.stdout.trim());
const TEST_ROOTS = [Buffer.from(F.rootDerB64, 'base64')];
const OPTS = { rootCertificates: TEST_ROOTS, enableOnlineChecks: false };

const b64u = buf => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64uJson = o => b64u(Buffer.from(JSON.stringify(o), 'utf8'));

function makeJws({ payload, leafDerB64 = F.leafDerB64, leafKeyPem = F.leafKeyPem, alg = 'ES256', extraHeader = {} }) {
  const header = Object.assign({ alg, x5c: [leafDerB64, F.interDerB64, F.rootDerB64] }, extraHeader);
  const signingInput = b64uJson(header) + '.' + b64uJson(payload);
  const key = crypto.createPrivateKey(leafKeyPem);
  const sig = crypto.sign('sha256', Buffer.from(signingInput, 'utf8'), { key, dsaEncoding: 'ieee-p1363' });
  return signingInput + '.' + b64u(sig);
}

const GOOD_PAYLOAD = {
  transactionId: '2000000123456789',
  originalTransactionId: '2000000123456789',
  bundleId: 'com.miru.plus.app',
  productId: 'gems_5',
  type: 'Consumable',
  quantity: 1,
  purchaseDate: 1762000000000,
  environment: 'Sandbox',
  appAccountToken: '12345678-1234-4123-8123-123456789abc',
};
// ---------- 正向 ----------
await check('① 合法 JWS ⇒ 通过，字段解析正确', async () => {
  const t = await IAP.verifyTransaction(makeJws({ payload: GOOD_PAYLOAD }), OPTS);
  if (t.transactionId !== GOOD_PAYLOAD.transactionId) throw new Error('transactionId mismatch: ' + t.transactionId);
  if (t.productId !== 'gems_5') throw new Error('productId mismatch');
  if (t.bundleId !== 'com.miru.plus.app') throw new Error('bundleId mismatch');
});

// ---------- 负对照 ----------
await expectThrow('② payload 被篡改 ⇒ 签名不符', async () => {
  const jws = makeJws({ payload: GOOD_PAYLOAD });
  const parts = jws.split('.');
  const tampered = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
  tampered.productId = 'gems_700';                       // 想白拿 700 钻
  const forged = parts[0] + '.' + b64uJson(tampered) + '.' + parts[2];
  await IAP.verifyTransaction(forged, OPTS);
}, /Apple transaction verification failed/);

await expectThrow('③ 根不在信任列表 ⇒ 拒（换根攻击）', async () => {
  const jws = makeJws({ payload: GOOD_PAYLOAD });
  await IAP.verifyTransaction(jws, { ...OPTS, rootCertificates: [Buffer.from(IAP.APPLE_ROOT_G3_PEM)] });
}, /Apple transaction verification failed/);

await expectThrow('④ 证书已过期 ⇒ 拒', async () => {
  const jws = makeJws({ payload: GOOD_PAYLOAD, leafDerB64: F.expiredLeafDerB64, leafKeyPem: F.expiredLeafKeyPem });
  await IAP.verifyTransaction(jws, OPTS);
}, /Apple transaction verification failed/);

await expectThrow('⑤ alg 不是 ES256 ⇒ 拒', async () => {
  const jws = makeJws({ payload: GOOD_PAYLOAD, alg: 'none' });
  await IAP.verifyTransaction(jws, OPTS);
}, /alg/);

await expectThrow('⑥ 已撤销（revocationDate）⇒ 拒', async () => {
  const jws = makeJws({ payload: Object.assign({}, GOOD_PAYLOAD, { revocationDate: 1762000000000 }) });
  await IAP.verifyTransaction(jws, OPTS);
}, /revoked/);

await expectThrow('⑦ 缺 transactionId ⇒ 拒', async () => {
  const p = Object.assign({}, GOOD_PAYLOAD);
  delete p.transactionId;
  const jws = makeJws({ payload: p });
  await IAP.verifyTransaction(jws, OPTS);
}, /transactionId/);

await expectThrow('⑧ 只有 1 段/2 段的假 JWS ⇒ 拒', async () => {
  await IAP.verifyTransaction('abc.def', OPTS);
}, /3 dot-separated parts/);

// ---------- 内置 Apple 根：确认它真的被钉进去了 ----------
await check('⑨ 内置 Apple Root CA G3 指纹 = 63343ABF…3E9179', async () => {
  const fp = IAP.TRUSTED_ROOTS[0].toLowerCase();
  const want = '63343abfb89a6a03ebb57e9b3f5fa7be7c4f5c756f3017b3a8c488c3653e9179';
  if (fp !== want) throw new Error('built-in root fp is ' + fp);
  if (!/BEGIN CERTIFICATE/.test(IAP.APPLE_ROOT_G3_PEM)) throw new Error('built-in PEM missing');
  const cert = new crypto.X509Certificate(IAP.APPLE_ROOT_G3_PEM);
  if (!/Apple Root CA - G3/.test(cert.subject)) throw new Error('built-in PEM subject is ' + cert.subject);
});

// ---------- 真实 Apple 根签不住伪造链（跨信任域） ----------
await expectThrow('⑩ 测试链的根 ≠ Apple 根 ⇒ 用默认信任列表必拒', async () => {
  const jws = makeJws({ payload: GOOD_PAYLOAD });
  await IAP.verifyTransaction(jws);          // 不传 roots ⇒ 用内置 Apple 根
}, /Apple transaction verification failed/);

// ---------- 钱包侧：productId → 钻石数 的映射 ----------
const { gemsForSku } = require(path.join(HERE, '..', 'api', 'wallet.js'));
const CFG = { skus: { gems_5: { gems: 5, usd: 99 }, gems_700: { gems: 700, usd: 9999 }, special: { gems: 42, usd: 1, apple: 'com.miru.plus.app.special' } } };
await check('⑪ productId = 裸 sku 名 ⇒ 映射对', async () => {
  const m = gemsForSku('gems_5', CFG);
  if (!m || m.gems !== 5 || m.sku !== 'gems_5') throw new Error(JSON.stringify(m));
});
await check('⑫ productId 带 bundle 前缀 ⇒ 取末段', async () => {
  const m = gemsForSku('com.miru.plus.app.gems_700', CFG);
  if (!m || m.gems !== 700 || m.sku !== 'gems_700') throw new Error(JSON.stringify(m));
});
await check('⑬ 后台显式 apple 映射优先', async () => {
  const m = gemsForSku('com.miru.plus.app.special', CFG);
  if (!m || m.gems !== 42 || m.sku !== 'special') throw new Error(JSON.stringify(m));
});
await check('⑭ 不认识的 productId ⇒ null（调用方转 400）', async () => {
  if (gemsForSku('com.miru.plus.app.nope', CFG) !== null) throw new Error('expected null');
});

console.log('iap-selftest');
results.forEach(r => console.log(r));
console.log(`\n${pass} passed / ${fail} failed`);
process.exit(fail ? 1 : 0);
