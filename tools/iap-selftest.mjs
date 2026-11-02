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
function check(name, fn) {
  try { fn(); pass++; results.push(`  ✓ ${name}`); }
  catch (e) { fail++; results.push(`  ✗ ${name}  — ${String(e.message || e).slice(0, 140)}`); }
}
function expectThrow(name, fn, wantPattern) {
  check(name, () => {
    let threw = null;
    try { fn(); } catch (e) { threw = e; }
    if (!threw) throw new Error('expected it to throw, but it passed');
    if (wantPattern && !wantPattern.test(String(threw.message))) {
      throw new Error('threw, but message was "' + threw.message + '" (wanted ' + wantPattern + ')');
    }
  });
}

// ---------- 造夹具 ----------
const gen = spawnSync('python', [path.join(HERE, 'fixtures', 'gen-iap-fixture.py')], { encoding: 'utf8' });
if (gen.status !== 0) {
  console.error('fixture generation failed:\n' + (gen.stderr || gen.error));
  process.exit(2);
}
const F = JSON.parse(gen.stdout.trim());

const b64u = buf => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64uJson = o => b64u(Buffer.from(JSON.stringify(o), 'utf8'));

function makeJws({ payload, leafDerB64 = F.leafDerB64, leafKeyPem = F.leafKeyPem, alg = 'ES256', extraHeader = {} }) {
  const header = Object.assign({ alg, x5c: [leafDerB64, F.rootDerB64] }, extraHeader);
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
};
const TEST_ROOT_FP = new crypto.X509Certificate(
  Buffer.from(F.rootDerB64, 'base64') instanceof Buffer
    ? '-----BEGIN CERTIFICATE-----\n' + F.rootDerB64.match(/.{1,64}/g).join('\n') + '\n-----END CERTIFICATE-----\n'
    : ''
).fingerprint256;

// ---------- 正向 ----------
check('① 合法 JWS ⇒ 通过，字段解析正确', () => {
  const t = IAP.verifyTransaction(makeJws({ payload: GOOD_PAYLOAD }), { roots: [TEST_ROOT_FP] });
  if (t.transactionId !== GOOD_PAYLOAD.transactionId) throw new Error('transactionId mismatch: ' + t.transactionId);
  if (t.productId !== 'gems_5') throw new Error('productId mismatch');
  if (t.bundleId !== 'com.miru.plus.app') throw new Error('bundleId mismatch');
});

// ---------- 负对照 ----------
expectThrow('② payload 被篡改 ⇒ 签名不符', () => {
  const jws = makeJws({ payload: GOOD_PAYLOAD });
  const parts = jws.split('.');
  const tampered = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
  tampered.productId = 'gems_700';                       // 想白拿 700 钻
  const forged = parts[0] + '.' + b64uJson(tampered) + '.' + parts[2];
  IAP.verifyTransaction(forged, { roots: [TEST_ROOT_FP] });
}, /signature does not match/);

expectThrow('③ 根不在信任列表 ⇒ 拒（换根攻击）', () => {
  const jws = makeJws({ payload: GOOD_PAYLOAD });
  IAP.verifyTransaction(jws, { roots: ['00'.repeat(32)] });
}, /untrusted root/);

expectThrow('④ 证书已过期 ⇒ 拒', () => {
  const jws = makeJws({ payload: GOOD_PAYLOAD, leafDerB64: F.expiredLeafDerB64, leafKeyPem: F.expiredLeafKeyPem });
  IAP.verifyTransaction(jws, { roots: [TEST_ROOT_FP] });
}, /expired/);

expectThrow('⑤ alg 不是 ES256 ⇒ 拒', () => {
  const jws = makeJws({ payload: GOOD_PAYLOAD, alg: 'none' });
  IAP.verifyTransaction(jws, { roots: [TEST_ROOT_FP] });
}, /alg/);

expectThrow('⑥ 已撤销（revocationDate）⇒ 拒', () => {
  const jws = makeJws({ payload: Object.assign({}, GOOD_PAYLOAD, { revocationDate: 1762000000000 }) });
  IAP.verifyTransaction(jws, { roots: [TEST_ROOT_FP] });
}, /revoked/);

expectThrow('⑦ 缺 transactionId ⇒ 拒', () => {
  const p = Object.assign({}, GOOD_PAYLOAD);
  delete p.transactionId;
  const jws = makeJws({ payload: p });
  IAP.verifyTransaction(jws, { roots: [TEST_ROOT_FP] });
}, /transactionId/);

expectThrow('⑧ 只有 1 段/2 段的假 JWS ⇒ 拒', () => {
  IAP.verifyTransaction('abc.def', { roots: [TEST_ROOT_FP] });
}, /3 dot-separated parts/);

// ---------- 内置 Apple 根：确认它真的被钉进去了 ----------
check('⑨ 内置 Apple Root CA G3 指纹 = 63343ABF…3E9179', () => {
  const fp = IAP.TRUSTED_ROOTS[0].toLowerCase();
  const want = '63343abfb89a6a03ebb57e9b3f5fa7be7c4f5c756f3017b3a8c488c3653e9179';
  if (fp !== want) throw new Error('built-in root fp is ' + fp);
  if (!/BEGIN CERTIFICATE/.test(IAP.APPLE_ROOT_G3_PEM)) throw new Error('built-in PEM missing');
  const cert = new crypto.X509Certificate(IAP.APPLE_ROOT_G3_PEM);
  if (!/Apple Root CA - G3/.test(cert.subject)) throw new Error('built-in PEM subject is ' + cert.subject);
});

// ---------- 真实 Apple 根签不住伪造链（跨信任域） ----------
expectThrow('⑩ 测试链的根 ≠ Apple 根 ⇒ 用默认信任列表必拒', () => {
  const jws = makeJws({ payload: GOOD_PAYLOAD });
  IAP.verifyTransaction(jws);          // 不传 roots ⇒ 用内置 Apple 根
}, /untrusted root/);

// ---------- 钱包侧：productId → 钻石数 的映射 ----------
const { gemsForSku } = require(path.join(HERE, '..', 'api', 'wallet.js'));
const CFG = { skus: { gems_5: { gems: 5, usd: 99 }, gems_700: { gems: 700, usd: 9999 }, special: { gems: 42, usd: 1, apple: 'com.miru.plus.app.special' } } };
check('⑪ productId = 裸 sku 名 ⇒ 映射对', () => {
  const m = gemsForSku('gems_5', CFG);
  if (!m || m.gems !== 5 || m.sku !== 'gems_5') throw new Error(JSON.stringify(m));
});
check('⑫ productId 带 bundle 前缀 ⇒ 取末段', () => {
  const m = gemsForSku('com.miru.plus.app.gems_700', CFG);
  if (!m || m.gems !== 700 || m.sku !== 'gems_700') throw new Error(JSON.stringify(m));
});
check('⑬ 后台显式 apple 映射优先', () => {
  const m = gemsForSku('com.miru.plus.app.special', CFG);
  if (!m || m.gems !== 42 || m.sku !== 'special') throw new Error(JSON.stringify(m));
});
check('⑭ 不认识的 productId ⇒ null（调用方转 400）', () => {
  if (gemsForSku('com.miru.plus.app.nope', CFG) !== null) throw new Error('expected null');
});

console.log('iap-selftest');
results.forEach(r => console.log(r));
console.log(`\n${pass} passed / ${fail} failed`);
process.exit(fail ? 1 : 0);
