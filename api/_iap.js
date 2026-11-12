// StoreKit 2 signed transactions: await Apple's official verifier, with online certificate checks.
const crypto=require('node:crypto');
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
const {SignedDataVerifier,Environment,VerificationStatus}=require('@apple/app-store-server-library');
const TRUSTED_ROOTS=['63343ABFB89A6A03EBB57E9B3F5FA7BE7C4F5C756F3017B3A8C488C3653E9179'];
const verifierCache=new Map();
function parseJws(jws){
 const parts=String(jws||'').split('.');
 if(parts.length!==3)throw new Error('jws must have 3 dot-separated parts');
 let header,payload;
 try{header=JSON.parse(Buffer.from(parts[0],'base64url').toString('utf8'));payload=JSON.parse(Buffer.from(parts[1],'base64url').toString('utf8'));}
 catch(_){throw new Error('invalid jws JSON');}
 if(!header||!payload||Array.isArray(header)||Array.isArray(payload)||typeof header!=='object'||typeof payload!=='object')throw new Error('invalid jws object');
 return {header,payload};
}
function unavailable(message){const e=new Error(message);e.code=503;return e;}
async function verifyTransaction(jws,opt={}){
 const {header,payload:untrusted}=parseJws(jws);
 if(header.alg!=='ES256')throw new Error('unexpected jws alg');
 // This untrusted value only selects a verifier; signed environment is checked by Apple.
 const environment=untrusted.environment;
 if(environment!==Environment.SANDBOX&&environment!==Environment.PRODUCTION)throw new Error('invalid transaction environment');
 const bundle=process.env.IAP_BUNDLE_ID||'com.miru.plus.app';
 let appAppleId;
 if(environment===Environment.PRODUCTION){
  const raw=opt.appAppleId===undefined?process.env.IAP_APP_APPLE_ID:opt.appAppleId;
  appAppleId=Number(raw);
  if(!/^[0-9]+$/.test(String(raw||''))||!Number.isSafeInteger(appAppleId)||appAppleId<=0)throw unavailable('IAP_APP_APPLE_ID is required for Production verification');
 }
 // Trusted function arguments for signed test fixtures; never HTTP request input.
 const roots=opt.rootCertificates||[new crypto.X509Certificate(APPLE_ROOT_G3_PEM).raw];
 const online=opt.enableOnlineChecks===undefined?true:opt.enableOnlineChecks;
 const key=environment+':'+bundle+':'+String(appAppleId||'');
 let verifier;
 if(Object.keys(opt).length===0){
  verifier=verifierCache.get(key);
  if(!verifier){verifier=new SignedDataVerifier(roots,online,environment,bundle,appAppleId);verifierCache.set(key,verifier);}
 }else verifier=new SignedDataVerifier(roots,online,environment,bundle,appAppleId);
 let payload;
 try{payload=await verifier.verifyAndDecodeTransaction(String(jws));}
 catch(e){
  if(e.status===VerificationStatus.RETRYABLE_VERIFICATION_FAILURE)throw unavailable('Apple certificate status temporarily unavailable; retry purchase delivery');
  throw new Error('Apple transaction verification failed');
 }
 if(typeof payload.transactionId!=='string'||!/^[0-9]{1,80}$/.test(payload.transactionId))throw new Error('invalid transactionId');
 if(typeof payload.productId!=='string'||!payload.productId)throw new Error('invalid productId');
 if(payload.revocationDate!==undefined&&payload.revocationDate!==null)throw new Error('transaction has been revoked');
 if(payload.type!=='Consumable')throw new Error('transaction must be Consumable');
 if(payload.quantity!==1)throw new Error('transaction quantity must be 1');
 if(typeof payload.appAccountToken!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload.appAccountToken))throw new Error('invalid appAccountToken');
 return {
  transactionId:payload.transactionId,originalTransactionId:payload.originalTransactionId||null,
  productId:payload.productId,bundleId:payload.bundleId,type:payload.type,quantity:payload.quantity,
  appAccountToken:payload.appAccountToken,purchaseDate:payload.purchaseDate||null,
  inAppOwnershipType:payload.inAppOwnershipType||null,environment:payload.environment,payload,
 };
}
module.exports={verifyTransaction,parseJws,APPLE_ROOT_G3_PEM,TRUSTED_ROOTS};
