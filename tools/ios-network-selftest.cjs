const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const sent=[];const w={URL,Request,Headers,Event,Set,Capacitor:{Plugins:{MIRUNative:{}}},location:{href:'capacitor://localhost/index.html'},navigator:{language:'en'},localStorage:{getItem:()=>null},fetch:async(input,init)=>{const r=new Request(input,init);sent.push({url:r.url,method:r.method,headers:r.headers,body:await r.text()});return new Response('{}')}};
w.window=w;vm.runInNewContext(fs.readFileSync('native/ios-bootstrap.js','utf8'),w);
(async()=>{
 for(const url of ['/api/auth','https://www.miru.plus/api/auth','https://miru.plus/api/auth']){
  await w.fetch(url,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer fixture'},body:JSON.stringify({op:'login',email:'fixture@example.test',password:'fixture'})});
  const r=sent.at(-1);assert.equal(r.url,'https://miru.plus/api/auth');assert.equal(r.method,'POST');assert.equal(r.headers.get('X-Miru-Client'),'ios');assert.equal(r.headers.get('Authorization'),'Bearer fixture');assert.equal(JSON.parse(r.body).op,'login');
 }
 await w.fetch(new Request('https://www.miru.plus/api/auth',{method:'POST',body:'fixture'}));assert.equal(sent.at(-1).url,'https://miru.plus/api/auth');assert.equal(sent.at(-1).body,'fixture');
 assert.equal(w.MIRU_PROXY,'https://miru.plus/api/longcat');assert.equal(w.MIRU_TTS,'https://miru.plus/api/tts');
 console.log('PASS iOS canonical API routing without redirect; POST body, auth and native policy header preserved');
})().catch(e=>{console.error(e);process.exitCode=1});
