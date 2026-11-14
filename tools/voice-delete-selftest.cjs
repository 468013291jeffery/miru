const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('source/src/app144_discfix.js','utf8'),tts=fs.readFileSync('api/tts.js','utf8');
const toggle=source.slice(source.indexOf('  let CL_BUSY = false;'),source.indexOf('  const paintMy =',source.indexOf('  let CL_BUSY = false;')));
const clickStart=source.indexOf('  document.addEventListener("click",',source.indexOf('  const paintMy ='));
const click=source.slice(clickStart,source.indexOf('  }, true);',clickStart)+12);
const id='u'+'a'.repeat(20);
function frontend(result){
 const notices=[],handlers={},S={myClone:{id,on:1},myVoice:'data:audio/wav;base64,fixture'};
 const c={S,T:(_a,b)=>b,toast:x=>notices.push(x),save(){},paintMy(){},refresh(){},cloneOn:()=>!!S.myClone?.on,TTS_EP:'/api/tts',cloudAuth:()=>({Authorization:'Bearer fixture'}),fetch:result,document:{addEventListener:(n,f)=>handlers[n]=f}};
 vm.runInNewContext(toggle+'\n'+click,c);
 return {c,S,notices,remove:()=>handlers.click({target:{closest:()=>({dataset:{v146del:'1'}})},preventDefault(){},stopImmediatePropagation(){}})};
}
async function response(status,body){return {ok:status===200,status,json:async()=>body};}
async function audio(voice){
 const headers={},res={setHeader(k,v){headers[k]=v},status(){return this},send(){}};
 const tail=tts.slice(tts.indexOf('  const text = String(q.t'),tts.lastIndexOf('\n};'));
 const out={buf:Buffer.from('RIFFfixture'),type:'audio/wav'};
 const c={Buffer,process:{env:{}},isUV:x=>/^u[0-9a-f]{20}$/.test(x),QLANG:{en:true},L:{config:async()=>({})},qwenSites:()=>[],viaClone:async()=>out,viaSpace:async()=>out};
 vm.runInNewContext('run=async function(req,res){const q=req.query;\n'+tail+'\n}',c);
 await c.run({query:{t:'Hello',v:voice,l:'en'}},res);return headers['Cache-Control'];
}
let pass=0,fail=0;
async function check(name,f){try{await f();pass++;console.log('PASS '+name)}catch(e){fail++;console.error('FAIL '+name+': '+e.message)}}
(async()=>{
 await check('failed remote deletion preserves retryable clone and local recording',async()=>{
  for(const status of [403,409,503]){
   const x=frontend(()=>response(status,{error:'fixture rejection'}));await x.c.cloneToggle();
   assert.equal(x.S.myClone?.id,id,'remote failure must preserve its id');assert(x.S.myVoice);assert(x.notices.length,'remote failure must be visible');
  }
 });
 await check('network failure preserves retry state',async()=>{const x=frontend(async()=>{throw Error('offline')});await x.c.cloneToggle();assert.equal(x.S.myClone?.id,id);assert(x.notices.length)});
 await check('turn off waits for acknowledgement and retains local recording',async()=>{
  let resolve;const x=frontend(()=>new Promise(r=>resolve=r));const pending=x.c.cloneToggle();assert.equal(x.S.myClone?.id,id);resolve(await response(200,{ok:true}));await pending;assert.equal(x.S.myClone,null);assert(x.S.myVoice);
 });
 await check('Delete does not erase local recording when server deletion fails',async()=>{const x=frontend(()=>response(503,{error:'retry'}));await x.remove();assert.equal(x.S.myClone?.id,id);assert(x.S.myVoice)});
 await check('Delete clears both local references after server success',async()=>{const x=frontend(()=>response(200,{ok:true}));await x.remove();assert.equal(x.S.myClone,null);assert.equal(x.S.myVoice,null)});
 await check('Redo retains the old recording when its server deletion fails',async()=>{
  const x=frontend(()=>response(503,{error:'retry'}));x.c.fr={result:'data:audio/wav;base64,new-recording'};
  const start=source.indexOf('fr.onload = async',source.indexOf('async function recToggle'));
  const handler=source.slice(source.indexOf('async',start),source.indexOf('; fr.readAsDataURL(blob);',start));
  vm.runInNewContext('redo='+handler,x.c);const old=x.S.myVoice;await x.c.redo();assert.equal(x.S.myVoice,old);assert.equal(x.S.myClone?.id,id);
 });
 await check('custom voice synthesis is never public cached',async()=>assert.match(await audio(id),/no-store/));
 await check('preset voice caching remains unchanged',async()=>assert.match(await audio('m1'),/^public,.*immutable/));
 await check('reference clips are not retained in client or shared caches',async()=>{
  const part=tts.slice(tts.indexOf('  if (q.vref)'),tts.indexOf('  if (q.doubao)'));const headers={};
  const c={require:()=>({readFileSync:()=>Buffer.from('fixture')}),vfile:()=>({f:'fixture',type:'audio/wav'})};
  vm.runInNewContext('run=function(q,res){'+part+'}',c);
  c.run({vref:id},{setHeader:(k,v)=>headers[k]=v,status(){return this},send(){}});assert.match(headers['Cache-Control'],/no-store/);
 });
 console.log(pass+' passed, '+fail+' failed');process.exitCode=fail?1:0;
})().catch(e=>{console.error(e);process.exitCode=1});
