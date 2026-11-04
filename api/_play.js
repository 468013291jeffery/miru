// /api/_play.js — Google Play 内购验单（2026-11-05）
// 用法：
//   const PLAY = require('./_play');
//   const p = await PLAY.verifyProduct(productId, purchaseToken);   // 失败抛错
//   await PLAY.consume(productId, purchaseToken);                    // 钻石是消耗型商品：发完钻就消耗掉，玩家才能再买
// 需要服务器环境变量：
//   GOOGLE_SERVICE_ACCOUNT  —— Play Console 里绑定的服务账号 JSON（整段 JSON 原文，或 base64）
//   PLAY_PACKAGE            —— 安卓包名，默认 com.miru.plus.app
// 不需要任何第三方库：用 Node 自带 crypto 签 RS256 JWT 换 access token，再调 androidpublisher v3。
const crypto = require('crypto');

const PKG = () => process.env.PLAY_PACKAGE || 'com.miru.plus.app';
let cached = { token: '', exp: 0 };

function serviceAccount() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT || '';
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT is not set');
  const txt = raw.trim().startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
  const sa = JSON.parse(txt);
  if (!sa.client_email || !sa.private_key) throw new Error('service account json is missing client_email / private_key');
  return sa;
}
const b64u = b => Buffer.from(b).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

async function accessToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cached.token && cached.exp - 60 > now) return cached.token;
  const sa = serviceAccount();
  const head = b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const body = b64u(JSON.stringify({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/androidpublisher', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const sig = crypto.createSign('RSA-SHA256').update(head + '.' + body).sign(sa.private_key);
  const jwt = head + '.' + body + '.' + b64u(sig);
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer') + '&assertion=' + jwt });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token) throw new Error('google token: ' + (j.error_description || j.error || r.status));
  cached = { token: j.access_token, exp: now + (Number(j.expires_in) || 3600) };
  return cached.token;
}

function url(productId, token, suffix) {
  return 'https://androidpublisher.googleapis.com/androidpublisher/v3/applications/' + encodeURIComponent(PKG()) +
    '/purchases/products/' + encodeURIComponent(productId) + '/tokens/' + encodeURIComponent(token) + (suffix || '');
}

/* 返回 Google 的 ProductPurchase；只有 purchaseState===0（已付款）才算数 */
async function verifyProduct(productId, token) {
  if (!productId || !token) throw new Error('productId and purchaseToken are required');
  const r = await fetch(url(productId, token), { headers: { Authorization: 'Bearer ' + await accessToken() } });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error('google verify: ' + ((j.error && j.error.message) || r.status));
  if (j.purchaseState !== 0) throw new Error('purchase is not completed (state ' + j.purchaseState + ')');
  return j; // { orderId, purchaseState, consumptionState, acknowledgementState, purchaseTimeMillis, regionCode, ... }
}

async function consume(productId, token) {
  const r = await fetch(url(productId, token, ':consume'), { method: 'POST', headers: { Authorization: 'Bearer ' + await accessToken() } });
  if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error('google consume: ' + ((j.error && j.error.message) || r.status)); }
  return true;
}

module.exports = { verifyProduct, consume, PKG };
