const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 let sql,close;
 if(process.env.WALLET_TEST_DATABASE_URL){const {Pool}=require('pg');const p=new Pool({connectionString:process.env.WALLET_TEST_DATABASE_URL,max:12});sql=async(q,a=[])=>(await p.query(q,a)).rows;close=()=>p.end();}
 else{const {PGlite}=require('@electric-sql/pglite');const p=new PGlite();sql=async(q,a=[])=>(await p.query(q,a)).rows;close=()=>p.close();}
 for(const q of [
 'CREATE TABLE wallet(user_id text primary key,gems int not null default 0,plus_until timestamptz,updated_at timestamptz default now())',
 'CREATE TABLE ledger(id bigserial primary key,user_id text,delta int,reason text,key text unique,balance int,at timestamptz default now())',
 'CREATE TABLE orders(id text primary key,user_id text,sku text,platform text,gems int,price_cents int,currency text,status text,test boolean default false,receipt text,refunded_by text,at timestamptz default now())',
 'CREATE TABLE usage(user_id text,day date,kind text,n int default 0,primary key(user_id,day,kind))'
 ])await sql(q);
 const L=require('../api/_lib');const realWrap=L.wrap;let uid='buyer',receipt;
 L.wrap=f=>f;L.cors=()=>true;L.needActive=async()=>({uid});L.db=async()=>sql;
 const DEFAULT_CFG={first_purchase_double:true,earn_cap:80,skus:{gems_5:{gems:5,usd:99,apple:'com.miru.plus.app.gems_5'}}};let CFG=DEFAULT_CFG;L.config=async()=>CFG;L.jsonBody=r=>r.body||{};
 const I=require('../api/_iap');I.verifyTransaction=jws=>({...receipt,transactionId:jws});
 const handler=require('../api/wallet');
 if(fs.existsSync(require('node:path').join(__dirname,'../api/_wallet.js')))for(const q of require('../api/_wallet').SCHEMA)await sql(q);
 async function call(user,body,method='POST',run=handler,headers={}){uid=user;const res={setHeader(){},status(c){this.code=c;return this},json(b){this.body=b}};await run({method,headers,query:{},body},res);return {code:res.code,...res.body};}
 const balance=async user=>(await sql('SELECT gems FROM wallet WHERE user_id=$1',[user]))[0]?.gems||0;
 async function prepare(user,extra={}){const r=await call(user,null,'GET');receipt={bundleId:'com.miru.plus.app',productId:'com.miru.plus.app.gems_5',type:'Consumable',quantity:1,environment:'Production',appAccountToken:r.iap?.appAccountToken||'11111111-1111-4111-8111-111111111111',...extra};}
 let pass=0,fail=0;async function check(name,f){try{await f();console.log('PASS '+name);pass++}catch(e){console.error('FAIL '+name+': '+e.message);fail++}}
 await check('stable server account token',async()=>{const a=await call('metadata',null,'GET'),b=await call('metadata',null,'GET');assert.match(a.iap?.appAccountToken||'',/^[0-9a-f-]{36}$/i);assert.equal(a.iap.appAccountToken,b.iap.appAccountToken);assert(a.iap.productIds.includes('com.miru.plus.app.gems_5'));});
 await check('parallel receipt delivers one bonus and order',async()=>{await prepare('parallel');const rs=await Promise.all(Array.from({length:8},()=>call('parallel',{op:'iap',jws:'10001'})));assert(rs.every(r=>r.code===200));assert.equal(await balance('parallel'),10);assert.equal((await sql("SELECT * FROM ledger WHERE key='iap:10001'")).length,1);assert.equal((await sql("SELECT * FROM orders WHERE user_id='parallel'")).length,1);});
 await check('ledger failure rolls back credit',async()=>{await prepare('rollback');await sql("ALTER TABLE ledger ADD CONSTRAINT reject_ledger CHECK(user_id<>'rollback')");try{await assert.rejects(call('rollback',{op:'iap',jws:'10002'}));assert.equal(await balance('rollback'),0);}finally{await sql('ALTER TABLE ledger DROP CONSTRAINT reject_ledger')}await call('rollback',{op:'iap',jws:'10002'});assert.equal(await balance('rollback'),10);});
 await check('order failure rolls back receipt and credit',async()=>{await prepare('orderfail');await sql("ALTER TABLE orders ADD CONSTRAINT reject_order CHECK(user_id<>'orderfail')");try{await assert.rejects(call('orderfail',{op:'iap',jws:'10003'}));assert.equal(await balance('orderfail'),0);assert.equal((await sql("SELECT * FROM ledger WHERE key='iap:10003'")).length,0);}finally{await sql('ALTER TABLE orders DROP CONSTRAINT reject_order')}});
 await check('duplicate returns current spent balance',async()=>{await prepare('spent');await call('spent',{op:'iap',jws:'10004'});await call('spent',{op:'spend',amount:3,key:'spend1'});const r=await call('spent',{op:'iap',jws:'10004'});assert.equal(r.gems,7);assert.equal(r.dup,true);});
 await check('receipt cannot credit a different account',async()=>{await prepare('owner');await call('owner',{op:'iap',jws:'10005'});const r=await call('thief',{op:'iap',jws:'10005'});assert(r.code>=400&&r.code<500);assert.equal(await balance('thief'),0);});
 await check('invalid Apple purchase fields rejected',async()=>{let n=20000;for(const extra of [{quantity:0},{quantity:2},{quantity:'1'},{type:'Non-Consumable'},{productId:'evil.gems_5'},{appAccountToken:null}]){const u='invalid'+(++n);await prepare(u,extra);const r=await call(u,{op:'iap',jws:String(n)});assert(r.code>=400&&r.code<500,JSON.stringify(extra));assert.equal(await balance(u),0);}});
 await check('Sandbox review works and records its environment',async()=>{await prepare('review',{environment:'Sandbox'});const r=await call('review',{op:'iap',jws:'10006'});assert.equal(r.code,200);assert.equal(r.test,true);assert.equal(r.environment,'Sandbox');const o=(await sql("SELECT test,environment FROM orders WHERE user_id='review'"))[0];assert.equal(o.test,true);assert.equal(o.environment,'Sandbox');await prepare('review');assert.equal((await call('review',{op:'iap',jws:'10007'})).code,200);});
 await check('different parallel purchases double only the first',async()=>{await prepare('two-orders');await Promise.all(['10008','10009'].map(jws=>call('two-orders',{op:'iap',jws})));assert.equal(await balance('two-orders'),15);});
 await check('spend reason cannot consume first purchase bonus',async()=>{
  await sql("INSERT INTO wallet(user_id,gems) VALUES('reason-spoof',5)");
  await call('reason-spoof',{op:'spend',amount:1,reason:'gems_5(iap)',key:'spoof'});
  await prepare('reason-spoof');assert.equal((await call('reason-spoof',{op:'iap',jws:'30001'})).code,200);
  assert.equal(await balance('reason-spoof'),14);
 });
 await check('custom SKU consumes the first purchase exactly once',async()=>{
  try{CFG={...DEFAULT_CFG,skus:{...DEFAULT_CFG.skus,special:{gems:7,usd:99,apple:'com.miru.plus.app.special'}}};
   await prepare('custom-first',{productId:'com.miru.plus.app.special'});
   assert.equal((await call('custom-first',{op:'iap',jws:'30002'})).code,200);
   CFG=DEFAULT_CFG;await prepare('custom-first');
   assert.equal((await call('custom-first',{op:'iap',jws:'30003'})).code,200);
   assert.equal(await balance('custom-first'),12);
  }finally{CFG=DEFAULT_CFG;}
 });
 await check('trusted legacy receipt without order still consumes bonus',async()=>{
  await sql("INSERT INTO wallet(user_id,gems) VALUES('legacy-first',7)");
  await sql("INSERT INTO ledger(user_id,delta,reason,key,balance) VALUES('legacy-first',7,'special(iap)','iap:legacy-fixture',7)");
  await prepare('legacy-first');await call('legacy-first',{op:'iap',jws:'30004'});
  assert.equal(await balance('legacy-first'),12);
 });
 await check('committed receipt survives catalog removal and returns current balance',async()=>{
  await prepare('removed-product');await call('removed-product',{op:'iap',jws:'30005'});
  await call('removed-product',{op:'spend',amount:3,key:'removed-spend'});
  try{CFG={...DEFAULT_CFG,skus:{}};
   const r=await call('removed-product',{op:'iap',jws:'30005'});
   assert.equal(r.code,200);assert.equal(r.dup,true);assert.equal(r.gems,7);
   assert.equal((await call('removed-product',{op:'iap',jws:'30006'})).code,400);
   assert.equal(await balance('removed-product'),7);
  }finally{CFG=DEFAULT_CFG;}
 });
 await check('unconfigured default-looking product is rejected',async()=>{
  await prepare('unconfigured',{productId:'com.miru.plus.app.gems_700'});
  assert.equal((await call('unconfigured',{op:'iap',jws:'30007'})).code,400);
  assert.equal(await balance('unconfigured'),0);
 });
 await check('ambiguous Apple product mappings fail closed',async()=>{
  await prepare('ambiguous',{productId:'com.miru.plus.app.shared'});
  try{CFG={...DEFAULT_CFG,skus:{gems_5:{gems:5,apple:'com.miru.plus.app.shared'},special:{gems:50,apple:'com.miru.plus.app.shared'}}};
   assert.equal((await call('ambiguous',{op:'iap',jws:'30008'})).code,400);
   assert.equal(await balance('ambiguous'),0);
  }finally{CFG=DEFAULT_CFG;}
 });
 await check('account-token database failure remains HTTP 500',async()=>{
  await prepare('token-db-error');const saved=L.db;
  try{L.db=async()=>async(q,p=[])=>{if(/INSERT INTO wallet_accounts/.test(q))throw new Error('test account-token database failure');return sql(q,p);};
   const r=await call('token-db-error',{op:'iap',jws:'30009'},'POST',realWrap(handler));
   assert.equal(r.code,500);assert.equal(await balance('token-db-error'),0);
  }finally{L.db=saved;}
 });
 await sql('CREATE TABLE assets(id text PRIMARY KEY,owner text,kind text,name text,kw jsonb,url text,mime text,size int,meta jsonb,status text,created_at timestamptz DEFAULT now())');
 await sql('CREATE TABLE users(id text PRIMARY KEY,email text UNIQUE,pass text,name text,lang text,provider text,google_sub text,apple_sub text,avatar text,platform text,created_at timestamptz DEFAULT now())');
 const assetsHandler=require('../api/assets'),authHandler=require('../api/auth');
 await check('asset retries debit one atomic ledger entry',async()=>{
  await sql("INSERT INTO wallet(user_id,gems) VALUES('asset-parallel',20)");
  const body={op:'game',key:'same-game',name:'Safe test game',tpl:'find',a:'A',b:'B'};
  const rs=await Promise.all(Array.from({length:6},()=>call('asset-parallel',body,'POST',assetsHandler)));
  assert(rs.every(r=>r.code===200));assert.equal(await balance('asset-parallel'),18);
  assert.equal((await sql("SELECT * FROM ledger WHERE key='game:asset-parallel:same-game'")).length,1);
 });
 await check('asset ledger failure rolls back debit and permits retry',async()=>{
  await sql("INSERT INTO wallet(user_id,gems) VALUES('asset-rollback',10)");
  await sql("ALTER TABLE ledger ADD CONSTRAINT reject_asset_ledger CHECK(user_id<>'asset-rollback')");
  const body={op:'game',key:'retry-game',name:'Safe retry game',tpl:'find',a:'A',b:'B'};
  try{await assert.rejects(call('asset-rollback',body,'POST',assetsHandler));
   assert.equal(await balance('asset-rollback'),10);
   assert.equal((await sql("SELECT * FROM assets WHERE owner='asset-rollback'")).length,0);
  }finally{await sql('ALTER TABLE ledger DROP CONSTRAINT reject_asset_ledger');}
  assert.equal((await call('asset-rollback',body,'POST',assetsHandler)).code,200);
  assert.equal(await balance('asset-rollback'),8);
 });
 await sql('ALTER TABLE users ADD COLUMN last_seen timestamptz DEFAULT now()');
 await check('failed welcome grant rolls back email signup; same email retry receives bonus',async()=>{
  const saved={tokenFor:L.tokenFor,who:L.who,hasMail:L.hasMail};
  const body={op:'register',email:'wallet-retry@example.invalid',password:'fixture-password',name:'Email retry fixture'};
  try{CFG={...DEFAULT_CFG,welcome_gems:5};L.tokenFor=()=> 'fixture-token';L.who=()=>null;L.hasMail=()=>false;
   await sql("ALTER TABLE ledger ADD CONSTRAINT reject_signup_email CHECK(reason<>'welcome') NOT VALID");
   try{await assert.rejects(call('unused',body,'POST',authHandler));
    assert.equal((await sql('SELECT * FROM users WHERE email=$1',[body.email])).length,0);
   }finally{await sql('ALTER TABLE ledger DROP CONSTRAINT reject_signup_email');}
   const r=await call('unused',body,'POST',authHandler);
   assert.equal(r.code,200);assert.equal(r.gems,5);assert.equal(r.user.email,body.email);
   assert.equal(await balance(r.user.id),5);
   assert.equal((await sql("SELECT * FROM ledger WHERE user_id=$1 AND reason='welcome'",[r.user.id])).length,1);
   assert.equal((await sql('SELECT * FROM users WHERE email=$1',[body.email])).length,1);
  }finally{CFG=DEFAULT_CFG;Object.assign(L,saved);}
 });
 await check('failed welcome grant rolls back provider signup; same provider retry receives bonus',async()=>{
  const saved={tokenFor:L.tokenFor,who:L.who,verifyGoogle:L.verifyGoogle};
  const sub='wallet-provider-retry-fixture',body={op:'google',idToken:'fixture-google-token'};
  try{CFG={...DEFAULT_CFG,welcome_gems:5};L.tokenFor=()=> 'fixture-token';L.who=()=>null;
   L.verifyGoogle=async()=>({sub,email:null,name:'Provider retry fixture'});
   await sql("ALTER TABLE ledger ADD CONSTRAINT reject_signup_provider CHECK(reason<>'welcome') NOT VALID");
   try{await assert.rejects(call('unused',body,'POST',authHandler));
    assert.equal((await sql('SELECT * FROM users WHERE google_sub=$1',[sub])).length,0);
   }finally{await sql('ALTER TABLE ledger DROP CONSTRAINT reject_signup_provider');}
   const r=await call('unused',body,'POST',authHandler);
   assert.equal(r.code,200);assert.equal(r.gems,5);
   assert.equal((await sql('SELECT * FROM users WHERE google_sub=$1',[sub])).length,1);
   assert.equal(await balance(r.user.id),5);
   assert.equal((await sql("SELECT * FROM ledger WHERE user_id=$1 AND reason='welcome'",[r.user.id])).length,1);
  }finally{CFG=DEFAULT_CFG;Object.assign(L,saved);}
 });
 await check('explicit Web test purchases retained, native iOS uses verified IAP',async()=>{
  const savedPay=process.env.PAY_TEST,savedNode=process.env.NODE_ENV;
  try{process.env.PAY_TEST='1';process.env.NODE_ENV='production';
   const web=await call('web-staging',{op:'purchase',sku:'gems_5',receipt:'staging-test'});
   assert.equal(web.code,200);assert.equal(web.test,true);
   for(const headers of [{origin:'capacitor://localhost'},{'x-miru-client':'ios'}]){
    const r=await call('native-fake',{op:'purchase',sku:'gems_5',receipt:'native-test'},'POST',handler,headers);
    assert.equal(r.code,400);assert.equal(await balance('native-fake'),0);
   }
   process.env.PAY_TEST='0';
   assert.equal((await call('web-disabled',{op:'purchase',sku:'gems_5',receipt:'disabled'})).code,501);
  }finally{
   if(savedPay===undefined)delete process.env.PAY_TEST;else process.env.PAY_TEST=savedPay;
   if(savedNode===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=savedNode;
  }
 });
 await check('invalid Apple catalog preserves Web and Android wallet pull',async()=>{
  try{let i=0;
   for(const skus of [
    {gems_5:{gems:5,apple:'com.miru.plus.app.duplicate'},special:{gems:20,apple:'com.miru.plus.app.duplicate'}},
    {gems_5:{gems:0,apple:'com.miru.plus.app.gems_5'}}
   ]){
    const user='catalog-wallet-'+(++i);
    await sql('INSERT INTO wallet(user_id,gems) VALUES($1,17)',[user]);
    await sql('INSERT INTO ledger(user_id,delta,reason,key,balance) VALUES($1,17,$2,$3,17)',[user,'fixture-credit','catalog-seed:'+user]);
    CFG={...DEFAULT_CFG,skus};
    const r=await call(user,null,'GET',realWrap(handler));
    assert.equal(r.code,200);assert.equal(r.gems,17);assert.equal(r.recent.length,1);
    assert.equal(r.iap.available,false);assert.deepEqual(r.iap.productIds,[]);
    assert.match(r.iap.error,/catalog/i);assert.match(r.iap.appAccountToken,/^[0-9a-f-]{36}$/i);
    receipt={bundleId:'com.miru.plus.app',productId:i===1?'com.miru.plus.app.duplicate':'com.miru.plus.app.gems_5',type:'Consumable',quantity:1,environment:'Production',appAccountToken:r.iap.appAccountToken};
    assert.equal((await call(user,{op:'iap',jws:String(40000+i)})).code,400);
    assert.equal(await balance(user),17);
   }
  }finally{CFG=DEFAULT_CFG;}
 });
 await check('wallet metadata database errors remain server failures',async()=>{
  const saved=L.db;
  try{L.db=async()=>async(q,p=[])=>{if(/SELECT environment FROM orders/.test(q))throw new Error('fixture metadata database failure');return sql(q,p);};
   assert.equal((await call('metadata-db-error',null,'GET',realWrap(handler))).code,500);
  }finally{L.db=saved;}
 });
 await close();console.log('Wallet: '+pass+' passed / '+fail+' failed');process.exitCode=fail?1:0;
})().catch(e=>{console.error(e);process.exitCode=1});
