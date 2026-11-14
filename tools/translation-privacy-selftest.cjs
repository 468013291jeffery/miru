const assert=require('node:assert/strict');
(async()=>{
 const {PGlite}=require('@electric-sql/pglite'),db=new PGlite(),sql=async(q,p=[])=>(await db.query(q,p)).rows;
 const np=require.resolve('@neondatabase/serverless'),original=require(np);require.cache[np].exports={...original,neon:()=>sql};
 process.env.DATABASE_URL='postgresql://fixture@localhost/private_translation';const L=require('../api/_lib');try{await L.db()}finally{require.cache[np].exports=original}
 const hash=t=>L.crypto.createHash('sha1').update('en\n'+t).digest('hex');
 await sql("INSERT INTO translations(h,lang,src,dst)VALUES($1,'en','private legacy draft','legacy leaked translation')",[hash('private legacy draft')]);
 await sql("INSERT INTO translations(h,lang,src,dst,published)VALUES($1,'en','公开标签','Public label',true)",[hash('公开标签')]);
 let inputs=[];L.llm=async messages=>{inputs=JSON.parse(messages[1].content);return JSON.stringify(inputs.map(t=>'private result '+t))};
 const call=async(handler,method,query={},body={})=>{const res={headers:{},setHeader(k,v){this.headers[k]=v},status(c){this.code=c;return this},json(j){this.body=j;return this}};await handler({method,query,body,headers:{}},res);assert.equal(res.code,200);return res};
 const i18n=require('../api/i18n'),translate=require('../api/translate');
 let r=await call(i18n,'GET',{lang:'en'});assert.deepEqual(r.body.map,{'公开标签':'Public label'});assert.equal(r.headers['Cache-Control'],'no-store');
 r=await call(translate,'POST',{}, {to:'en',texts:['private legacy draft','new private memory','公开标签']});
 assert.equal(r.body.map['private legacy draft'],'private result private legacy draft');assert.equal(r.body.map['new private memory'],'private result new private memory');assert.equal(r.body.map['公开标签'],'Public label');
 assert.equal((await sql('SELECT count(*)::int AS n FROM translations'))[0].n,2);assert(!inputs.includes('公开标签'));
 r=await call(i18n,'GET',{lang:'en'});assert.deepEqual(r.body.map,{'公开标签':'Public label'});
 await db.close();console.log('PASS private translations stay out of anonymous dictionary; legacy entries hidden and curated labels retained');
})().catch(e=>{console.error(e);process.exitCode=1});
