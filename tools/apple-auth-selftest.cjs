const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const voiceTestDir=fs.mkdtempSync(path.join(os.tmpdir(),'miru-apple-voice-'));
process.env.MIRU_VOICE_DIR=voiceTestDir;process.env.MIRU_VOICE_STORE_ID='apple-fixture-store';
(async()=>{
 const A=require('../api/_apple'),L=require('../api/_lib');
 let db,sql,close,pool;
 if(process.env.APPLE_TEST_DATABASE_URL){const {Pool}=require('pg');pool=new Pool({connectionString:process.env.APPLE_TEST_DATABASE_URL,max:12});sql=async(q,p=[])=>(await pool.query(q,p)).rows;close=()=>pool.end();}
 else{const {PGlite}=require('@electric-sql/pglite');db=new PGlite();sql=async(q,p=[])=>(await db.query(q,p)).rows;close=()=>db.close();}
 const neonPath=require.resolve('@neondatabase/serverless'),neonExports=require(neonPath);
 require.cache[neonPath].exports={...neonExports,neon:()=>sql};
 process.env.DATABASE_URL='postgresql://fixture@localhost/apple_auth_test';
 try{await L.db();}finally{require.cache[neonPath].exports=neonExports;}
 Object.assign(process.env,{AUTH_SECRET:'test-only-auth-secret',APPLE_CLIENT_ID:'test.web.service',APPLE_NATIVE_CLIENT_ID:'com.miru.plus.app',APPLE_TEAM_ID:'H79A5X8935',APPLE_KEY_ID:'TESTKEY123',APPLE_TOKEN_ENCRYPTION_KEY:Buffer.alloc(32,7).toString('base64'),APPLE_REDIRECT_URI:'https://miru.plus/'});
 const rsa=crypto.generateKeyPairSync('rsa',{modulusLength:2048}),ec=crypto.generateKeyPairSync('ec',{namedCurve:'prime256v1'});
 process.env.APPLE_PRIVATE_KEY=ec.privateKey.export({type:'pkcs8',format:'pem'});
 const jwk={...rsa.publicKey.export({format:'jwk'}),kid:'fixture',alg:'RS256',use:'sig'};
 const b64=x=>Buffer.from(JSON.stringify(x)).toString('base64url');
 function jwt(extra={}){const now=Math.floor(Date.now()/1000),h=b64({alg:'RS256',kid:'fixture'}),p=b64({iss:'https://appleid.apple.com',aud:'com.miru.plus.app',sub:'apple-person',iat:now,exp:now+300,...extra});return h+'.'+p+'.'+crypto.sign('RSA-SHA256',Buffer.from(h+'.'+p),rsa.privateKey).toString('base64url');}
 let exchanged,failRevoke=false,revokeCalls=0,tokenCalls=0;
 const originalFetch=global.fetch;
 global.fetch=async(url,opts={})=>{
  if(url.endsWith('/auth/keys'))return {ok:true,json:async()=>({keys:[jwk]})};
  const form=new URLSearchParams(opts.body);
  if(url.endsWith('/auth/token')||url.endsWith('/auth/revoke')){
   const secret=form.get('client_secret').split('.'),head=JSON.parse(Buffer.from(secret[0],'base64url')),claims=JSON.parse(Buffer.from(secret[1],'base64url'));
   assert.equal(head.alg,'ES256');assert.equal(claims.iss,'H79A5X8935');assert.equal(claims.sub,form.get('client_id'));assert.equal(claims.aud,'https://appleid.apple.com');
   assert(crypto.verify('sha256',Buffer.from(secret[0]+'.'+secret[1]),{key:ec.publicKey,dsaEncoding:'ieee-p1363'},Buffer.from(secret[2],'base64url')));
  }
  if(url.endsWith('/auth/token')){tokenCalls++;assert.equal(form.get('grant_type'),'authorization_code');if(form.get('client_id')==='com.miru.plus.app')assert.equal(form.has('redirect_uri'),false);return {ok:true,json:async()=>({id_token:exchanged,refresh_token:'private-refresh-fixture'})};}
  if(url.endsWith('/auth/revoke')){revokeCalls++;assert.equal(form.get('token'),'private-refresh-fixture');assert.equal(form.get('token_type_hint'),'refresh_token');return {ok:!failRevoke,status:failRevoke?503:200};}
  throw Error('unexpected network '+url);
 };
 let passed=0,failed=0;async function check(name,f){try{await f();passed++;console.log('PASS '+name)}catch(e){failed++;console.error('FAIL '+name+': '+e.stack)}}
 L.blobList=async()=>({blobs:[],hasMore:false});
 L.hasBlob=()=>true;
 const native={headers:{'x-miru-client':'ios',origin:'capacitor://localhost'}};
 const flow=async(extra={})=>{const c=await A.challenge(sql,{client:'native'});exchanged=jwt({nonce:c.nonce,...extra});return {op:'apple',idToken:jwt({nonce:c.nonce}),authorizationCode:'fresh-code',challenge:c.challenge};};
 await check('AES-GCM hides tokens and authenticates binding',async()=>{const x=A.seal('private-refresh-fixture','person:native');assert(!x.includes('private-refresh-fixture'));assert.equal(A.open(x,'person:native'),'private-refresh-fixture');assert.throws(()=>A.open(x,'other:native'));const z=x.split('.');z[2]=(z[2][0]==='a'?'b':'a')+z[2].slice(1);assert.throws(()=>A.open(z.join('.'),'person:native'));});
 await check('missing encryption config returns retryable server error',async()=>{const k=process.env.APPLE_TOKEN_ENCRYPTION_KEY;delete process.env.APPLE_TOKEN_ENCRYPTION_KEY;try{await assert.rejects(A.challenge(sql,{client:'native'}),e=>e.code===503&&e.action==='configure_apple'&&e.retryable===true)}finally{process.env.APPLE_TOKEN_ENCRYPTION_KEY=k}});
 await check('signed native exchange stores encrypted grant privately',async()=>{await sql("INSERT INTO users(id,apple_sub)VALUES('native-person','apple-person')");const b=await flow(),p=await A.authenticate(sql,b,native);assert.equal(p.sub,'apple-person');await A.saveGrant(sql,'native-person',p);const g=(await sql("SELECT * FROM apple_grants WHERE user_id='native-person'"))[0];assert(g);assert(!JSON.stringify(g).includes('private-refresh-fixture'));});
 await check('native rejects missing code and wrong web audience',async()=>{let b=await flow();delete b.authorizationCode;await assert.rejects(A.authenticate(sql,b,native),/authorization code/i);b=await flow();b.idToken=jwt({aud:'test.web.service'});await assert.rejects(A.authenticate(sql,b,native),/audience|another app/i);});
 await check('nonce mismatch expiry and replay rejected',async()=>{let b=await flow();b.idToken=jwt({nonce:'wrong'});await assert.rejects(A.authenticate(sql,b,native),/nonce/i);b=await flow();await sql("UPDATE apple_challenges SET expires_at=now()-interval '1 second' WHERE id=$1",[b.challenge]);await assert.rejects(A.authenticate(sql,b,native),/challenge/i);b=await flow();await A.authenticate(sql,b,native);await assert.rejects(A.authenticate(sql,b,native),/challenge/i);});
 await check('parallel challenge exchanges once',async()=>{const b=await flow(),before=tokenCalls,r=await Promise.allSettled([A.authenticate(sql,b,native),A.authenticate(sql,b,native)]);assert.equal(r.filter(x=>x.status==='fulfilled').length,1);assert.equal(tokenCalls-before,1);});
 await check('exchanged ID binds same subject and nonce',async()=>{for(const extra of [{sub:'other-person'},{nonce:'other-nonce'},{aud:'test.web.service'}]){const b=await flow(extra);await assert.rejects(A.authenticate(sql,b,native),/identity|nonce|audience|another app/i);}});
 await check('expiry missing sub future iat and HS256 fail',async()=>{for(const extra of [{exp:1},{sub:''},{iat:Math.floor(Date.now()/1000)+600}]){const b=await flow();b.idToken=jwt(extra);await assert.rejects(A.authenticate(sql,b,native));}const b=await flow(),parts=b.idToken.split('.');parts[0]=b64({alg:'HS256',kid:'fixture'});b.idToken=parts.join('.');await assert.rejects(A.authenticate(sql,b,native));});
 await check('legacy web login preserved and native audience rejected',async()=>{const p=await A.authenticate(sql,{idToken:jwt({aud:'test.web.service'})},{headers:{}});assert.equal(p.sub,'apple-person');assert.equal(p.grant,null);await assert.rejects(A.authenticate(sql,{idToken:jwt()},{headers:{}}),/audience|another app|challenge/i);});
 async function user(id,apple=false){await sql('INSERT INTO users(id,email,apple_sub,name,note,lang,platform) VALUES($1,$2,$3,$4,$5,$6,$7)',[id,id+'@example.invalid',apple?id:null,'Private Name','Private note','zh','ios']);return (await sql('SELECT * FROM users WHERE id=$1',[id]))[0]}
 const reload=async id=>(await sql('SELECT * FROM users WHERE id=$1',[id]))[0];
 await check('legacy Apple deletion requests reauthentication',async()=>{const u=await user('legacy',true);await assert.rejects(A.deleteAccount(sql,u,L),e=>e.code===409&&e.action==='apple_reauthentication_required');assert.equal((await reload(u.id)).status,'active');});
 async function grant(u){const b=await flow({sub:u.apple_sub});b.idToken=jwt({nonce:JSON.parse(Buffer.from(b.idToken.split('.')[1],'base64url')).nonce,sub:u.apple_sub});await A.saveGrant(sql,u.id,await A.authenticate(sql,b,native));}
 await check('revocation failure retains binding and retry completes once',async()=>{const u=await user('revoke-retry',true);await grant(u);failRevoke=true;try{await assert.rejects(A.deleteAccount(sql,u,L),e=>e.retryable===true);assert.equal((await reload(u.id)).apple_sub,u.apple_sub);assert.equal((await sql('SELECT * FROM apple_grants WHERE user_id=$1',[u.id])).length,1)}finally{failRevoke=false}await A.deleteAccount(sql,await reload(u.id),L);assert.equal((await reload(u.id)).status,'deleted');const n=revokeCalls;await A.deleteAccount(sql,await reload(u.id),L);assert.equal(revokeCalls,n);});
 await check('storage failure stays retryable and retry deletes personal rows',async()=>{const u=await user('storage-retry');await sql('INSERT INTO states(user_id,data)VALUES($1,$2)',[u.id,{private:'secret'}]);await sql("INSERT INTO memories(user_id,id,text)VALUES($1,'m','private memory')",[u.id]);await sql("INSERT INTO works(id,author,title,pack,status)VALUES('delete-work',$1,'private title','{\"secret\":true}','live')",[u.id]);await sql("INSERT INTO assets(id,owner,url,status)VALUES('delete-asset',$1,'https://fixture.public.blob.vercel-storage.com/file','private')",[u.id]);await sql("INSERT INTO events(user_id,name,props)VALUES($1,'private-event','{\"private\":true}')",[u.id]);await sql("INSERT INTO reports(user_id,target_kind,target_id,reason,note)VALUES($1,'work','delete-work','private reason','private note')",[u.id]);await sql('INSERT INTO wallet(user_id,gems)VALUES($1,7)',[u.id]);const saved=L.blobDel;let failures=1;L.blobDel=async()=>{if(failures--)throw Error('storage unavailable')};try{await assert.rejects(A.deleteAccount(sql,u,L));assert.notEqual((await reload(u.id)).status,'deleted');assert.equal((await sql('SELECT * FROM assets WHERE owner=$1',[u.id])).length,1);await A.deleteAccount(sql,await reload(u.id),L);await A.deleteAccount(sql,await reload(u.id),L)}finally{L.blobDel=saved}for(const [table,col]of [['states','user_id'],['memories','user_id'],['works','author'],['assets','owner'],['events','user_id']])assert.equal((await sql('SELECT * FROM '+table+' WHERE '+col+'=$1',[u.id])).length,0);const x=await reload(u.id);for(const key of ['email','name','apple_sub','note','lang','platform'])assert.equal(x[key],null);const reports=await sql("SELECT * FROM reports WHERE target_id='delete-work'");assert(!JSON.stringify(reports).includes('private'));assert.equal((await sql('SELECT * FROM wallet WHERE user_id=$1',[u.id])).length,0);});
 await check('DB cleanup failure rolls back completion and supports retry',async()=>{const u=await user('db-retry');await sql('INSERT INTO states(user_id,data)VALUES($1,$2)',[u.id,{private:true}]);await sql("ALTER TABLE users ADD CONSTRAINT fail_delete CHECK(id<>'db-retry' OR status<>'deleted')");try{await assert.rejects(A.deleteAccount(sql,u,L));assert.notEqual((await reload(u.id)).status,'deleted');assert.equal((await sql('SELECT * FROM states WHERE user_id=$1',[u.id])).length,1)}finally{await sql('ALTER TABLE users DROP CONSTRAINT fail_delete')}await A.deleteAccount(sql,await reload(u.id),L);assert.equal((await reload(u.id)).status,'deleted');});
 await check('HTTP deletion retains bearer for retry then becomes idempotent',async()=>{
  const saved={config:L.config,bump:L.bump};L.config=async()=>({welcome_gems:0});L.bump=async()=>true;
  const auth=require('../api/auth');
  async function call(body,token,run=auth){const r={setHeader(){},status(c){this.code=c;return this},json(x){this.body=x}};await run({method:'POST',headers:token?{authorization:'Bearer '+token}:{},body,query:{}},r);return {code:r.code,...r.body};}
  try{const u=await user('http-retry');await sql("INSERT INTO assets(id,owner,url)VALUES('http-asset',$1,'https://fixture.public.blob.vercel-storage.com/http')",[u.id]);const token=L.tokenFor(u.id,'user',0),del=L.blobDel;let fail=true;L.blobDel=async()=>{if(fail)throw Error('temporary storage failure')};
   try{let r=await call({op:'delete'},token);assert.equal(r.code,503);assert.equal(r.action,'retry_account_deletion');assert.equal(r.retryable,true);r=await call({op:'profile',name:'Must not resurrect'},token);assert.equal(r.code,409);fail=false;assert.equal((await call({op:'delete'},token)).code,200);assert.equal((await call({op:'delete'},token)).code,200)}finally{L.blobDel=del}
   assert.equal((await call({op:'delete'},'malformed')).code,401);assert.equal((await call({op:'delete'})).code,401);
   const stale=await user('http-stale');await sql('UPDATE users SET tv=1 WHERE id=$1',[stale.id]);assert.equal((await call({op:'delete'},L.tokenFor(stale.id,'user',0))).code,401);assert.equal((await reload(stale.id)).status,'active');
   const apple=await user('http-legacy-apple',true);const r=await call({op:'delete'},L.tokenFor(apple.id));assert.equal(r.code,409);assert.equal(r.action,'apple_reauthentication_required');
   const events=require('../api/events');assert.equal((await call({events:[{name:'late',props:{private:true}}]},token,events)).code,401);assert.equal((await call({events:[{name:'anonymous-preserved'}]},null,events)).code,200);
  }finally{Object.assign(L,saved)}
 });
 await check('deletion rechecks expected session version atomically',async()=>{
  const u=await user('fix1-stale-begin');await sql('UPDATE users SET tv=1 WHERE id=$1',[u.id]);
  await assert.rejects(A.deleteAccount(sql,u,L),e=>e.code===401);assert.equal((await reload(u.id)).status,'active');
 });
 await check('expired temporary ban stores fresh Apple grant for deletion',async()=>{
  const u=await user('fix1-expired-ban',true);await sql("UPDATE users SET status='banned',ban_until=now()-interval '1 day' WHERE id=$1",[u.id]);
  await grant(await reload(u.id));assert.equal((await sql('SELECT * FROM apple_grants WHERE user_id=$1',[u.id])).length,1);
  await A.deleteAccount(sql,await reload(u.id),L);assert.equal((await reload(u.id)).status,'deleted');
 });
 await check('deletion removes contact-shaped auth rate-limit keys',async()=>{
  const u=await user('fix1-contact'),phone='+15551234567';await sql('UPDATE users SET phone=$2 WHERE id=$1',[u.id,phone]);
  for(const key of ['mail:'+u.email,'login:'+u.email,'sms:'+phone])await sql("INSERT INTO usage(user_id,day,kind,n)VALUES($1,CURRENT_DATE,'auth',1)",[key]);
  await A.deleteAccount(sql,await reload(u.id),L);
  assert.equal((await sql('SELECT * FROM usage WHERE user_id=ANY($1::text[])',[['mail:'+u.email,'login:'+u.email,'sms:'+phone]])).length,0);
 });
 await check('asset DELETE keeps durable URL on storage failure then retries',async()=>{
  const u=await user('fix1-asset-delete');await sql("INSERT INTO assets(id,owner,url,status)VALUES('fix1-delete',$1,'https://fixture.public.blob.vercel-storage.com/retry','private')",[u.id]);
  const handler=require('../api/assets'),saved=L.blobDel;let fail=true;L.blobDel=async()=>{if(fail)throw Error('fixture storage failure')};
  const call=async()=>{const r={setHeader(){},status(n){this.code=n;return this},json(b){this.body=b}};await handler({method:'DELETE',query:{id:'fix1-delete'},headers:{authorization:'Bearer '+L.tokenFor(u.id)}},r);return r};
  try{assert((await call()).code>=500);assert.equal((await sql("SELECT * FROM assets WHERE id='fix1-delete'")).length,1);fail=false;assert.equal((await call()).code,200);assert.equal((await sql("SELECT * FROM assets WHERE id='fix1-delete'")).length,0)}finally{L.blobDel=saved}
 });
 if(pool)await check('locked deletion sees concurrent Apple binding and refuses unrevoked deletion',async()=>{
  const u=await user('fix1-pg-late-apple'),writer=await pool.connect();let deleting;
  try{await writer.query('BEGIN');await writer.query("UPDATE users SET apple_sub='late-apple-subject' WHERE id=$1",[u.id]);
   deleting=A.deleteAccount(sql,u,L).then(value=>({value}),error=>({error}));
   let waiting=false;for(let i=0;i<100;i++){const rows=await sql("SELECT EXISTS(SELECT 1 FROM pg_stat_activity WHERE pid<>pg_backend_pid() AND wait_event_type='Lock' AND (query LIKE 'UPDATE users SET status=%' OR query LIKE '%miru_begin_account_deletion%')) AS waiting");if(rows[0].waiting){waiting=true;break}await new Promise(r=>setTimeout(r,10))}
   assert(waiting,'deletion waits for concurrent binding writer');await writer.query('COMMIT');const out=await deleting;assert.equal(out.error?.action,'apple_reauthentication_required');assert.equal((await reload(u.id)).status,'active');assert.equal((await reload(u.id)).apple_sub,'late-apple-subject');
  }finally{await writer.query('ROLLBACK');writer.release();if(deleting)await deleting}
 });
 await check('CORS retains sites and exact native origin',async()=>{for(const origin of ['https://miru.plus','https://www.miru.plus','https://468013291jeffery.github.io','https://abc.vercel.app','http://localhost:8080','http://127.0.0.1:4000','null','capacitor://localhost']){const h={},r={setHeader:(k,v)=>h[k]=v,status(){return this},json(){}};assert.equal(L.cors({headers:{origin},method:'POST'},r),true,origin);assert.equal(h['Access-Control-Allow-Origin'],origin);assert.match(h['Access-Control-Allow-Headers'],/X-Miru-Client/i)}for(const origin of ['capacitor://evil','capacitor://localhost.evil','https://evil.example']){const r={setHeader(){},status(c){this.code=c;return this},json(){}};assert.equal(L.cors({headers:{origin},method:'POST'},r),null);assert.equal(r.code,403)}});
 global.fetch=originalFetch;await close();console.log(passed+' passed, '+failed+' failed');if(failed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>fs.rmSync(voiceTestDir,{recursive:true,force:true}));
