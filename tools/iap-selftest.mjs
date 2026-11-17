import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),HERE=path.dirname(fileURLToPath(import.meta.url));
const IAP=require('../api/_iap');
const generated=spawnSync(process.env.IAP_TEST_PYTHON||'python3',[path.join(HERE,'fixtures/gen-iap-fixture.py')],{encoding:'utf8'});
if(generated.status!==0){console.error(generated.stderr||generated.error);process.exit(2);}
const F=JSON.parse(generated.stdout),root=Buffer.from(F.rootDerB64,'base64');
const TEST_ROOT_FP=new crypto.X509Certificate(root).fingerprint256;
const OPT={roots:[TEST_ROOT_FP],rootCertificates:[root],enableOnlineChecks:false};
const GOOD={transactionId:'2000000123456789',originalTransactionId:'2000000123456789',bundleId:'com.miru.plus.app',productId:'com.miru.plus.app.gems_5',type:'Consumable',quantity:1,purchaseDate:Date.now(),signedDate:Date.now(),environment:'Sandbox',appAccountToken:'11111111-1111-4111-8111-111111111111'};
const enc=o=>Buffer.from(JSON.stringify(o)).toString('base64url');
function jws(payload=GOOD,fixture={},extraHeader={}){
 const leaf=fixture.leafDerB64||F.leafDerB64,key=fixture.leafKeyPem||F.leafKeyPem;
 const intermediate=fixture.intermediateDerB64||F.intermediateDerB64;
 const header={alg:'ES256',x5c:[leaf,intermediate,F.rootDerB64],...extraHeader};
 const input=enc(header)+'.'+enc(payload);
 const sig=crypto.sign('sha256',Buffer.from(input),{key:crypto.createPrivateKey(key),dsaEncoding:'ieee-p1363'});
 return input+'.'+sig.toString('base64url');
}
let pass=0,fail=0;
async function check(name,fn){try{await fn();console.log('PASS '+name);pass++;}catch(e){console.error('FAIL '+name+': '+e.message);fail++;}}
async function rejects(name,fn){await check(name,async()=>assert.rejects(async()=>fn()));}
await check('valid purpose-bound signed Sandbox transaction',async()=>{const t=await IAP.verifyTransaction(jws(),OPT);assert.equal(t.transactionId,GOOD.transactionId);assert.equal(t.appAccountToken,GOOD.appAccountToken);assert.equal(t.environment,'Sandbox');});
await rejects('changed payload fails signature',()=>{const parts=jws().split('.');parts[1]=enc({...GOOD,productId:'com.miru.plus.app.gems_700'});return IAP.verifyTransaction(parts.join('.'),OPT);});
await rejects('untrusted root fails',()=>IAP.verifyTransaction(jws(),{...OPT,roots:['00'.repeat(32)],rootCertificates:[new crypto.X509Certificate(IAP.APPLE_ROOT_G3_PEM).raw]}));
await rejects('expired signing certificate fails',()=>IAP.verifyTransaction(jws(GOOD,{leafDerB64:F.expiredLeafDerB64,leafKeyPem:F.expiredLeafKeyPem}),OPT));
await rejects('unexpected algorithm fails',()=>IAP.verifyTransaction(jws(GOOD,{}, {alg:'none'}),OPT));
await rejects('revoked transaction fails',()=>IAP.verifyTransaction(jws({...GOOD,revocationDate:Date.now()}),OPT));
await rejects('missing transaction ID fails',()=>{const p={...GOOD};delete p.transactionId;return IAP.verifyTransaction(jws(p),OPT);});
await rejects('malformed JWS fails',()=>IAP.verifyTransaction('abc.def',OPT));
await check('built-in root fingerprint is Apple G3',async()=>{assert.equal(new crypto.X509Certificate(IAP.APPLE_ROOT_G3_PEM).fingerprint256.replace(/:/g,''),IAP.TRUSTED_ROOTS[0]);});
await rejects('test chain cannot use default production trust',()=>IAP.verifyTransaction(jws()));
for(const [name,fixture] of Object.entries({wrongPurposeLeaf:F.wrongPurposeLeaf,wrongPurposeIntermediate:F.wrongPurposeIntermediate,nonCAIntermediate:F.nonCAIntermediate,wrongIssuer:F.wrongIssuer,wrongCurve:F.wrongCurve}))await rejects('reject '+name+' signed chain',()=>IAP.verifyTransaction(jws(GOOD,fixture),OPT));
await rejects('wrong bundle cannot pass selected verifier',()=>IAP.verifyTransaction(jws({...GOOD,bundleId:'other.app'}),OPT));
for(const quantity of [0,2,-1,'1',null])await rejects('reject signed quantity '+JSON.stringify(quantity),()=>IAP.verifyTransaction(jws({...GOOD,quantity}),OPT));
for(const type of ['Non-Consumable','Auto-Renewable Subscription',null])await rejects('reject signed type '+type,()=>IAP.verifyTransaction(jws({...GOOD,type}),OPT));
await rejects('Xcode bypass environment cannot enter receipt delivery',()=>IAP.verifyTransaction(jws({...GOOD,environment:'Xcode'}),OPT));
await rejects('missing account token fails',()=>IAP.verifyTransaction(jws({...GOOD,appAccountToken:null}),OPT));
await check('Production uses the registered public appAppleId by default',async()=>{
 const saved=process.env.IAP_APP_APPLE_ID;delete process.env.IAP_APP_APPLE_ID;
 try{assert.equal(require('../native/ios-release.public.json').appAppleId,'6834383803');const t=await IAP.verifyTransaction(jws({...GOOD,environment:'Production'}),OPT);assert.equal(t.environment,'Production');}
 finally{if(saved===undefined)delete process.env.IAP_APP_APPLE_ID;else process.env.IAP_APP_APPLE_ID=saved;}
});
await check('Explicit empty Production appAppleId fails closed',async()=>{
 const saved=process.env.IAP_APP_APPLE_ID;process.env.IAP_APP_APPLE_ID='';
 try{await assert.rejects(async()=>IAP.verifyTransaction(jws({...GOOD,environment:'Production'}),OPT),e=>e.code===503);}
 finally{if(saved===undefined)delete process.env.IAP_APP_APPLE_ID;else process.env.IAP_APP_APPLE_ID=saved;}
});
await check('Production verifier accepts Production test fixture with fixture-only app ID',async()=>{const t=await IAP.verifyTransaction(jws({...GOOD,environment:'Production'}),{...OPT,appAppleId:123456789});assert.equal(t.environment,'Production');});
const {gemsForSku}=require('../api/wallet');
const cfg={skus:{gems_5:{gems:5},special:{gems:42,apple:'com.miru.plus.app.special'}}};
await check('legacy Play bare SKU mapping retained',async()=>assert.deepEqual(gemsForSku('gems_5',cfg),{sku:'gems_5',gems:5}));
await check('legacy Play prefixed SKU mapping retained',async()=>assert.equal(gemsForSku('com.miru.plus.app.gems_700',cfg).gems,700));
await check('explicit custom mapping retained',async()=>assert.deepEqual(gemsForSku('com.miru.plus.app.special',cfg),{sku:'special',gems:42}));
await check('unknown SKU rejected',async()=>assert.equal(gemsForSku('com.miru.plus.app.nope',cfg),null));
console.log('IAP: '+pass+' passed / '+fail+' failed');process.exitCode=fail?1:0;
