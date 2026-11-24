/* Drive authored queues and actual input wrappers through all 48 scene stops. */
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const R=JSON.parse(fs.readFileSync('content/official/brides-reckoning-v1/release.json'));
const worlds={},chars={},threads={},handlers={};let actionId=null;
const c={console,window:{},S:{mine:{worlds,chars},art:{},threads},OFF94:{cur:null,assets:{}},
 wd:id=>worlds[id],ch:id=>chars[id],LL:x=>x,CL:()=> 'zh',Lz:x=>typeof x==='string'?x:x?.zh||'',
 PARSE:{use(){}},PKREG:{add:(n,f)=>handlers[n]=f},MG100:[],MG_T:{},mgMatch(){},mgResult(){},
 off94Assets:async()=>({}),off94Feed:async()=>[],packPrompt:()=>'',packModes(){},packOpen(){},packPick(){},packAdvanceChapter(){},
 doSend(){throw Error('Queue-discarding shared sender used');},busy:false,curT:'flow',cmode:'say',PKPAUSE:{},aiGate:()=>true,
 playerInput146:(text,mode)=>({text,mode}),document:{getElementById:()=>null,createElement:()=>({}),head:{appendChild(){}}},
 packSt:()=>({end:{}}),save(){},toast(){},appendMsg:(th,m)=>th.msgs.push(m),
 pkSet(th,f){th.pk.flags??={};th.pk.flags[f]=1;},
 stopResolve(th,extra){assert.equal(th.pk.q[0],th.pk.stop,'current stop remains at queue head');th.pk.q.shift();th.pk.q.unshift(...extra);th.pk.stop=null;},
 reply:async th=>{await Promise.resolve();if(th.pk.q)th.pk.q.splice(0,2);c.stopResolve(th,[]);},
 authoredMatch:async()=>c.window.BRIDE_RUNTIME.options(threads.flow).findIndex(o=>o.id===actionId)};
// Persist one ending registry, just as packSt does in the real app.
const endings={end:{}};c.packSt=()=>endings;
c.window=c;c.addEventListener=()=>{};vm.createContext(c);vm.runInContext(fs.readFileSync('source/src/app110_pkreg.js','utf8'),c);c.PKREG.install();assert(c.PKREG.installed);let oldAdapterCalls=0;const oldAdapter=c.pkDirective;c.pkDirective=function(th,b){if(th.wid==='existing-empress'&&b[1]==='legacy-rune'){oldAdapterCalls++;return true;}return oldAdapter(th,b);};for(const f of ['app104_pkstate.js','app161_bride_state.js','app161_bride_data.js','app161_bride.js'])vm.runInContext(fs.readFileSync('source/src/'+f,'utf8'),c);
assert(c.pkDirective({wid:'existing-empress'},['sys','legacy-rune',{}]));assert.equal(oldAdapterCalls,1,'pre-existing direct adapter survives Song activation');
R.cast.forEach(x=>chars[x.name]={n:x.name,n94:{zh:x.name}});
worlds.bride={community:R.work_id,cast:R.cast.map(x=>x.name),pack:{chapters:R.chapters.map(x=>({n:x.n,beats:{zh:[]}}))}};
function drain(th){let count=0;while(th.pk.q.length){assert(++count<300,'finite queue');const b=th.pk.q[0];if(b[0]==='sys'&&b[1]==='line'){th.pk.stop=b;return;}if(c.pkDirective(th,b))continue;th.pk.q.shift();if(b[0]==='sys'&&b[1]==='mg')th.pk.q.unshift(...c.mgResult(th,b[2],'skip'));else if(b[0]!=='sys')th.msgs.push({who:b[0],k:b[1],txt:b[2]});}th.pk.stop=null;}
async function choose(th,id){actionId=id;const opts=c.window.BRIDE_RUNTIME.options(th),o=opts.find(x=>x.id===id);assert(o,th.pk.bride.scene+' has action '+id);th.msgs.push({who:'me',k:'say',txt:o.intent});await c.reply(th,{kind:'user',txt:o.intent,mode:'say'});drain(th);}
async function next(th){await choose(th,'next');}

async function run(method,ending,privateItems=true,original=true){
 const th={id:'flow',wid:'bride',rounds:0,msgs:[],pk:{ch:1,flags:{},q:[]}};threads.flow=th;
 const acts={SCN_0104:['work_only'],SCN_0204:['safe_place'],SCN_0304:['records'],SCN_0401:[privateItems?'inspect':'identity_only'],SCN_0404:['preserve'],SCN_0504:['original'],SCN_0604:['necessary_only'],SCN_0704:['compare_later'],SCN_0804:['bounded_statement'],SCN_0904:['separate_plan_fact'],SCN_1001:[original?'check_original':'seal_original'],SCN_1004:original?['crosscheck']:[],SCN_1104:['safety_first'],SCN_1204:[method==='reckoning'?'revenge':method==='gate'?'escape':'witness'],SCN_1304:['witness_report'],SCN_1404:[...(method==='reckoning'?['risk_ack']:[]),'final_'+method,'decline_veil','no_innocents'],SCN_1502:['locations_only'],SCN_1503:['protect_people'],SCN_1504:[ending==='END_WAIT'?'limited_result':'perform_'+method],SCN_1603:['bounded_record'],SCN_1604:[ending]};
 for(const chapter of R.chapters){th.pk.ch=chapter.n;th.pk.q=chapter.scenes.map(s=>['sys','brideScene',{id:s.id}]);drain(th);
  for(const sc of chapter.scenes){assert.equal(th.pk.bride.scene,sc.id);if(sc.id==='SCN_0101'){assert.equal(th.pk.bride.bell,0);await next(th);assert.equal(th.pk.bride.phase,'body');}
   for(const a of acts[sc.id]||[])await choose(th,a);
   if(sc.id==='SCN_1004'&&!original){assert(!th.pk.bride.evidence.lock_record);/* Sealed originals allow bounded completion without fabricating verification. */await choose(th,'record_pending');}
   if(!th.pk.bride.ending)await next(th);
  }assert(th.pk.bride.goals[chapter.n],chapter.n+' real chapter goal');
 }
 assert.equal(c.PKREG.errors,0);assert.equal(th.pk.bride.ending,ending);assert.equal(th.pk.st,'end');assert.equal(th.pk.q.length,0);assert.equal(th.pk.bride.bell,ending==='END_WAIT'?12:13);assert(!th.pk.bride.faceShown);
 assert(!th.msgs.some(m=>m.who!=='me'&&/隐藏分支|回应空间|原音锚点|玩家|⟦MG|SCN_/.test(m.txt||'')));
 if(!privateItems)assert(!th.msgs.some(m=>(m.txt||'').includes('明天我不再等了')));
 if(!original)assert(!th.msgs.some(m=>(m.txt||'').includes('那为什么要拿走钥匙')));
 assert.deepEqual(JSON.parse(JSON.stringify(th.pk.bride)),JSON.parse(JSON.stringify(th)).pk.bride);
 console.log(method,ending,'64 scenes, 32 skips, consent, facts, actual ending and saved state passed');return th;
}
(async()=>{
 await run('witness','END_NAME');await run('gate','END_GATE',false,false);await run('reckoning','END_RECKONING',false);await run('gate','END_WAIT',false,false);
 for(const ritual of [false,true]){const th={id:'flow',wid:'bride',msgs:[],pk:{q:[['sys','brideScene',{id:'SCN_0101'}]]}};threads.flow=th;drain(th);th.pk.bride.ritual=ritual;await choose(th,'pause');assert(th.pk.bride.paused);const snapshot=JSON.stringify(th.pk.bride);await choose(th,'next');assert.equal(JSON.stringify(th.pk.bride),snapshot);await choose(th,'exit');assert.equal(th.pk.end,ritual?'END_WITHDRAW':'END_EARLY');}
 console.log('Both early endings, paused queue, legacy direct adapter and no silent navigation consent passed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
