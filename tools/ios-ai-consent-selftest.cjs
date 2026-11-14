const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const code=fs.readFileSync(path.join(__dirname,'../native/ios-bootstrap.js'),'utf8'),store=new Map();
function launch(){
 const sent=[],prompts=[],answers=[],events=new EventTarget();
 class SR extends EventTarget{start(){this.active=true}abort(){this.active=false;this.dispatchEvent(new Event('end'))}}
 const w={Capacitor:{Plugins:{MIRUNative:{}}},URL,Request,Headers,Event,Set,SpeechRecognition:SR,
 location:{href:'capacitor://localhost/index.html',origin:'capacitor://localhost'},navigator:{language:'en'},
 localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},
 addEventListener:events.addEventListener.bind(events),removeEventListener:events.removeEventListener.bind(events),dispatchEvent:events.dispatchEvent.bind(events),
 confirm:s=>{prompts.push(s);assert.ok(answers.length,'unexpected prompt');return answers.shift()},
 fetch:async(input,init)=>{sent.push({url:typeof input==='string'?input:input.url,init});return new Response('ok')}};
 w.window=w;vm.runInNewContext(code,w);return {w,sent,prompts,answers}
}
(async()=>{
 let {w,sent,prompts,answers}=launch();const post=b=>({method:'POST',body:JSON.stringify(b)});
 const block=(url,init)=>assert.rejects(w.fetch(url,init),e=>e.code==='ai_consent');
 await w.fetch('/api/works?feed=new');await w.fetch('/art/story.jpg');
 await block('/api/translate',post({texts:['draft']}));await block('/api/state?r=mem',post({op:'sync'}));assert.equal(prompts.length,0);assert.equal(sent.length,2);
 answers.push(false);await block('/api/longcat',post({messages:['draft']}));
 for(const [url,init] of [['/api/tts?t=voice'],['/api/tts?doubao=1'],['/api/tts',post({omni:{}})],['/api/tts',post({clone:{audio:'mock'}})],['/api/tts',post({img:{}})],['/api/tts',post({vid:{}})],['/api/studio?r=plan',post({payload:{}})],['/api/state?r=mem',post({op:'recall'})],['https://mine.example/v1/chat/completions',post({})]])await block(url,init);
 assert.equal(sent.length,2);assert.equal(prompts.length,1);assert.throws(()=>new w.SpeechRecognition().start(),e=>e.code==='ai_consent');
 await w.fetch('/api/tts',post({cloneDel:'uabc'}));await w.fetch('/api/state?r=mem',post({op:'forget_all'}));assert.equal(sent.length,4);
 ({w,sent,prompts,answers}=launch());await block('/api/longcat',post({messages:[]}));assert.equal(prompts.length,0);
 answers.push(true);assert.equal(w.MIRU_AI.change(),true);await w.fetch('/api/longcat',post({messages:[]}));
 assert.equal(sent[0].url,'https://miru.plus/api/longcat');assert.equal(sent[0].init.headers.get('X-Miru-Client'),'ios');
 answers.push(false);await block('https://mine.example/v1/chat/completions',post({}));
 answers.push(true);await w.fetch('https://mine.example/v1/chat/completions',post({}));await w.fetch('https://mine.example/v1/chat/completions',post({}));assert.equal(sent.length,3);
 const r=new w.SpeechRecognition();r.start();assert.equal(r.active,true);assert.equal(w.MIRU_AI.change(),false);assert.equal(r.active,false);await block('/api/tts?t=private');assert.equal(sent.length,3);
 let chat=0,replies=0,calls=0,pics=0,vids=0,refresh=0;const input={value:'',dispatchEvent(){}};
 Object.assign(w,{document:{getElementById:()=>input,createElement:()=>({setAttribute(){}})},LL:(a,b)=>b,toast(){},doSend(){chat++},reply(){replies++},startCall(){calls++},callGate(){calls++},aiGenerate(){pics++},vidGo(){vids++},renderMe(){refresh++}});
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../source/src/app149_ai_consent.js'),'utf8'),w);
 w.doSend('preserved draft');await w.reply();w.startCall();w.aiGenerate();w.vidGo();assert.deepEqual([chat,replies,calls,pics,vids],[0,0,0,0,0]);assert.equal(input.value,'preserved draft');
 let btn;w.renderMe({querySelector:()=>null,prepend:x=>btn=x});assert.equal(refresh,1);answers.push(true);btn.onclick();
 w.doSend('send draft');await w.reply();w.startCall();w.aiGenerate();w.vidGo();assert.deepEqual([chat,replies,calls,pics,vids],[1,1,1,1,1]);btn.onclick();await block('/api/tts?t=again');
 console.log('PASS native AI consent, refusal, withdrawal, dictation, custom recipients, draft preservation and browsing');
})().catch(e=>{console.error(e);process.exitCode=1});
