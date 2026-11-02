// /api/_iap.js — StoreKit 2 交易凭证验证（本地验签，不需要 App Store Connect 的 .p8）
// 用法：
//   const IAP = require('./_iap');
//   const t = IAP.verifyTransaction(jws);              // 失败抛错，调用方转 4xx
//   // opt.roots / opt.now 可注入，供自检使用（生产不传）
// 判据：JWS 的 x5c 链必须验到受信任的根（默认 Apple Root CA - G3），签名必须是 ES256 且能被子证书公钥验过。
const crypto = require('crypto');

// Apple Root CA - G3 · 来源 https://www.apple.com/certificateauthority/AppleRootCA-G3.cer
// SHA-256 = 63:34:3A:BF:B8:9A:6A:03:EB:B5:7E:9B:3F:5F:A7:BE:7C:4F:5C:75:6F:30:17:B3:A8:C4:88:C3:65:3E:91:79
// 有效期 2014-04-30 → 2039-04-30
const APPLE_ROOT_G3_PEM = `-----BEGIN CERTIFICATE-----
MIICQzCCAcmgAwIBAgIILcX8iNLFS5UwCgYIKoZIzj0EAwMwZzEbMBkGA1UEAwwS
QXBwbGUgUm9vdCBDQSAtIEczMSYwJAYDVQQLDB1BcHBsZSBDZXJ0aWZpY2F0aW9u
IEF1dGhvcml0eTETMBEGA1UECgwKQXBwbGUgSW5jLjELMAkGA1UEBhMCVVMwHhcN
MTQwNDMwMTgxOTA2WhcNMzkwNDMwMTgxOTA2WjBnMRswGQYDVQQDDBJBcHBsZSBS
b290IENBIC0gRzMxJjAkBgNVBAsMHUFwcGxlIENlcnRpZmljYXRpb24gQXV0aG9y
aXR5MRMwEQYDVQQKDApBcHBsZSBJbmMuMQswCQYDVQQGEwJVUzB2MBAGByqGSM49
AgEGBSuBBAAiA2IABJjpLz1AcqTtkyJygRMc3RCV8cWjTnHcFBbZDuWmBSp3ZHtf
TjjTuxxEtX/1H7YyYl3J6YRbTzBPEVoA/VhYDKX1DyxNB0cTddqXl5dvMVztK517
IDvYuVTZXpmkOlEKMaNCMEAwHQYDVR0OBBYEFLuw3qFYM4iapIqZ3r6966/ayySr
MA8GA1UdEwEB/wQFMAMBAf8wDgYDVR0PAQH/BAQDAgEGMAoGCCqGSM49BAMDA2gA
MGUCMQCD6cHEFl4aXTQY2e3v9GwOAEZLuN+yRhHFD/3meoyhpmvOwgPUnPWTxnS4
at+qIxUCMG1mihDK1A3UT82NQz60imOlM27jbdoXt2QfyFMm+YhidDkLF1vLUagM
6BgD56KyKA==
-----END CERTIFICATE-----`;

const TRUSTED_ROOTS = ['63343ABFB89A6A03EBB57E9B3F5FA7BE7C4F5C756F3017B3A8C488C3653E9179'];

function b64u(s) {
  return Buffer.from(String(s).replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

function parseJws(jws) {
  const parts = String(jws || '').split('.');
  if (parts.length !== 3) throw new Error('jws must have 3 dot-separated parts');
  let header, payload;
  try { header = JSON.parse(b64u(parts[0]).toString('utf8')); } catch (_) { throw new Error('jws header is not json'); }
  try { payload = JSON.parse(b64u(parts[1]).toString('utf8')); } catch (_) { throw new Error('jws payload is not json'); }
  return { header, payload, signingInput: Buffer.from(parts[0] + '.' + parts[1], 'utf8'), sig: b64u(parts[2]) };
}

function pemFromDer(der) {
  const lines = Buffer.from(der).toString('base64').match(/.{1,64}/g) || [];
  return '-----BEGIN CERTIFICATE-----\n' + lines.join('\n') + '\n-----END CERTIFICATE-----\n';
}

/* 校验 x5c 链：逐级验签 → 根必须自签且指纹命中信任列表；同时检查每张证书的有效期。返回叶子证书。 */
function verifyChain(x5c, roots, now) {
  if (!Array.isArray(x5c) || !x5c.length) throw new Error('jws header has no x5c chain');
  const certs = x5c.map(d => new crypto.X509Certificate(pemFromDer(b64u(d))));
  const t = now || Date.now();
  for (let i = 0; i < certs.length; i++) {
    const from = Date.parse(certs[i].validFrom), to = Date.parse(certs[i].validTo);
    if (from > t) throw new Error('certificate #' + i + ' not yet valid');
    if (to < t) throw new Error('certificate #' + i + ' expired');
  }
  for (let i = 0; i + 1 < certs.length; i++) {
    if (!certs[i].verify(certs[i + 1].publicKey)) throw new Error('certificate chain broken at #' + i);
  }
  const last = certs[certs.length - 1];
  if (!last.verify(last.publicKey)) throw new Error('root certificate is not self-signed');
  const fp = last.fingerprint256.replace(/:/g, '').toLowerCase();
  if (!roots.map(r => String(r).replace(/:/g, '').toLowerCase()).includes(fp)) throw new Error('untrusted root certificate');
  return certs[0];
}

/* 验一条 StoreKit 2 的 JWS（App 端 Transaction.jwsRepresentation 原样发上来）。 */
function verifyTransaction(jws, opt) {
  const o = opt || {};
  const roots = o.roots || TRUSTED_ROOTS;
  const { header, payload, signingInput, sig } = parseJws(jws);
  if (header.alg !== 'ES256') throw new Error('unexpected jws alg: ' + header.alg);

  const leaf = verifyChain(header.x5c, roots, o.now);
  const ok = crypto.verify('sha256', signingInput, { key: leaf.publicKey, dsaEncoding: 'ieee-p1363' }, sig);
  if (!ok) throw new Error('jws signature does not match the signing certificate');

  if (!payload.transactionId) throw new Error('payload has no transactionId');
  if (!payload.productId) throw new Error('payload has no productId');
  if (!payload.bundleId) throw new Error('payload has no bundleId');
  if (payload.revocationDate) throw new Error('transaction has been revoked');

  return {
    transactionId: String(payload.transactionId),
    originalTransactionId: payload.originalTransactionId ? String(payload.originalTransactionId) : null,
    productId: String(payload.productId),
    bundleId: String(payload.bundleId),
    type: payload.type || null,
    quantity: Number(payload.quantity) || 1,
    purchaseDate: payload.purchaseDate || null,
    inAppOwnershipType: payload.inAppOwnershipType || null,
    environment: payload.environment || null,
    payload,
  };
}

module.exports = { verifyTransaction, verifyChain, parseJws, APPLE_ROOT_G3_PEM, TRUSTED_ROOTS };
