const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
(async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'miru-voice-test-'));process.env.MIRU_VOICE_DIR=dir;process.env.MIRU_VOICE_STORE_ID='fixture-store';process.env.AUTH_SECRET='voice-test-secret';process.env.DATABASE_URL='postgresql://fixture@localhost/voice_test';
 const {PGlite}=require('@electric-sql/pglite'),db=new PGlite(),sql=async(q,p=[])=>(await db.query(q,p)).rows;
 const L=require('../api/_lib'),A=require('../api/_apple'),neonPath=require.resolve('@neondatabase/serverless'),old=require(neonPath);require.cache[neonPath].exports={...old,neon:()=>sql};try{await L.db()}finally{require.cache[neonPath].exports=old}
 L.blobList=async()=>({blobs:[],hasMore:false});L.blobDel=async()=>{};
 const tts=require('../api/tts');let passed=0,failed=0;
 const user=async id=>{await sql('INSERT INTO users(id)VALUES($1)',[id]);return (await sql('SELECT * FROM users WHERE id=$1',[id]))[0]};
 const reload=async id=>(await sql('SELECT * FROM users WHERE id=$1',[id]))[0];
 async function call(uid,body){const r={setHeader(){},status(n){this.code=n;return this},json(b){this.body=b}};await tts({method:'POST',headers:{authorization:'Bearer '+L.tokenFor(uid),origin:'https://miru.plus'},query:{},body},r);return {code:r.code,...r.body}}
 const audio='data:audio/wav;base64,'+Buffer.alloc(5000,1).toString('base64');
 async function check(name,f){try{await f();passed++;console.log('PASS '+name)}catch(e){failed++;console.error('FAIL '+name+': '+e.stack)}}
 try{
  await check('voice registry owner blocks other users deleting clip',async()=>{const a=await user('voice-owner'),b=await user('voice-other');const saved=await call(a.id,{clone:{audio}});assert.equal(saved.code,200);const denied=await call(b.id,{cloneDel:saved.id});assert.equal(denied.code,403);assert.equal((await sql('SELECT user_id FROM voice_clips WHERE id=$1',[saved.id]))[0].user_id,a.id);assert(fs.readdirSync(dir).some(f=>f.startsWith(saved.id)));assert.equal((await call(a.id,{cloneDel:saved.id})).code,200)});
  await check('account deletion erases registered voice files',async()=>{const u=await user('voice-delete'),saved=await call(u.id,{clone:{audio}});assert.equal(saved.code,200);await A.deleteAccount(sql,u,L);assert(!fs.readdirSync(dir).some(f=>f.startsWith(saved.id)));assert.equal((await sql('SELECT * FROM voice_clips WHERE user_id=$1',[u.id])).length,0);assert.equal((await reload(u.id)).deletion_version,2)});
 }finally{await db.close();fs.rmSync(dir,{recursive:true,force:true})}
 console.log(passed+' passed, '+failed+' failed');if(failed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
