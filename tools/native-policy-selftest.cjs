const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const {PGlite}=require('@electric-sql/pglite'),db=new PGlite(),sql=async(q,p=[])=>(await db.query(q,p)).rows;
 const np=require.resolve('@neondatabase/serverless'),original=require(np);
 require.cache[np].exports={...original,neon:()=>sql};
 process.env.DATABASE_URL='postgresql://fixture@localhost/native_policy';process.env.AUTH_SECRET='test-only-native-policy-secret';
 const L=require('../api/_lib');try{await L.db()}finally{require.cache[np].exports=original}
 L.config=async()=>({adult_enabled:true,adult_regions:['*'],report_threshold:2});L.adultRegionOk=()=>true;L.adultAccess=async()=>({ok:true});
 const works=require('../api/works');
 await sql("INSERT INTO users(id,name,status) VALUES ('reader','Reader','active'),('other','Other','active'),('author','Author','active'),('author2','Author2','active')");
 await sql("INSERT INTO works(id,author,author_name,title,status,pack) VALUES ('one','author','Author','One','live',$1::jsonb),('two','author','Author','Two','live',$1::jsonb),('adult','author2','Author2','Adult','live',$2::jsonb)",[JSON.stringify({meta:{adult:false}}),JSON.stringify({meta:{adult:true}})]);
 const call=async(method,query={},body={},uid='reader',native=false)=>{
  const res={headers:{},setHeader(k,v){this.headers[k]=v},status(c){this.code=c;return this},json(x){this.body=x;return this},end(){return this}};
  const headers={authorization:'Bearer '+L.tokenFor(uid)};if(native){headers.origin='capacitor://localhost';headers['x-miru-client']='ios'}
  await works({method,query,body,headers},res);return res;
 };
 let r=await call('GET',{feed:'new'},{},'reader',true);assert.equal(r.code,200);assert.deepEqual(r.body.works.map(x=>x.id).sort(),['one','two']);
 assert.equal((await call('GET',{id:'adult'},{},'reader',true)).code,404);
 assert.equal((await call('GET',{id:'adult'},{},'reader',false)).code,200);
 assert.equal((await call('GET',{mine:'1'},{},'author2',true)).body.works.length,0);
 await sql("UPDATE works SET pack=jsonb_set(pack,'{meta,adult}','\"true\"'::jsonb) WHERE id='adult'");
 assert.equal((await call('GET',{id:'adult'},{},'reader',true)).code,404);
 L.isAdmin=()=>true;assert.equal((await call('GET',{id:'adult'},{},'reader',true)).code,404);L.isAdmin=()=>false;
 r=await call('POST',{}, {op:'block',id:'one'});assert.equal(r.code,200);assert.equal(r.body.author_id,'author');
 assert.deepEqual((await call('GET',{feed:'new'})).body.works.map(x=>x.id),['adult']);
 assert.equal((await call('GET',{id:'two'})).code,404);assert.equal((await call('GET',{id:'two'},{},'other')).code,200);
 assert.equal((await call('GET',{blocked:'1'})).body.blocked[0].author_id,'author');
 await call('POST',{}, {op:'block',id:'adult'});await call('POST',{}, {op:'unblock',author:'author'});
 assert.equal((await call('GET',{id:'two'})).code,200);assert.equal((await call('GET',{id:'adult'})).code,404);
 for(const kind of ['message','asset','other']){
  await call('POST',{}, {op:'report',kind,id:'one',reason:'bad reply',snap:'private report text'});
  const rep=(await sql('SELECT * FROM reports ORDER BY id DESC LIMIT 1'))[0];assert.equal(rep.target_kind,kind);assert.equal(rep.snapshot,'private report text');
 }
 assert.equal((await sql("SELECT reports FROM works WHERE id='one'"))[0].reports,0);
 await call('POST',{}, {op:'report',kind:'work',id:'one',reason:'bad'});await call('POST',{}, {op:'report',kind:'work',id:'one',reason:'bad'});
 assert.equal((await sql("SELECT status FROM works WHERE id='one'"))[0].status,'pending');
 const code=fs.readFileSync(require.resolve('../api/longcat.js'),'utf8');
 const edge=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
 for(const origin of ['capacitor://localhost','https://miru.plus','https://468013291jeffery.github.io','https://abc.vercel.app','http://localhost:3000','null']){
  const x=await edge.default(new Request('https://fixture/api/longcat',{method:'OPTIONS',headers:{origin}}));assert.equal(x.headers.get('access-control-allow-origin'),origin);assert.match(x.headers.get('access-control-allow-headers'),/x-miru-client/i);
 }
 for(const origin of ['capacitor://localhost.evil','capacitor://evil','https://evil.example']){
  const x=await edge.default(new Request('https://fixture/api/longcat',{method:'POST',headers:{origin,'content-type':'application/json'},body:'{}'}));assert.equal(x.status,403);
 }
 await db.close();console.log('PASS native feed/direct/mine/admin adult exclusion, author blocking/isolation, typed reports and native CORS');
})().catch(e=>{console.error(e);process.exitCode=1});
