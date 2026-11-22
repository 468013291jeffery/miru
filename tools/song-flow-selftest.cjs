/* Drive authored queues and actual input wrappers through all 48 scene stops. */
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const R=JSON.parse(fs.readFileSync('content/official/when-song-returns-v1/release.json'));
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
 authoredMatch:async()=>c.window.WTSR_RUNTIME.options(threads.flow).findIndex(o=>o.id===actionId)};
// Persist one ending registry, just as packSt does in the real app.
const endings={end:{}};c.packSt=()=>endings;
vm.createContext(c);for(const f of ['app159_song_data.js','wtsr_state.js','app159_song.js'])vm.runInContext(fs.readFileSync('source/src/'+f,'utf8'),c);
R.cast.forEach(x=>chars[x.name]={n:x.name,n94:{zh:x.name}});
worlds.song={community:R.work_id,cast:R.cast.map(x=>x.name),pack:{chapters:R.chapters.map(x=>({n:x.n,beats:{zh:[]}}))}};
function drain(th){let count=0;while(th.pk.q.length){assert(++count<300,'finite queue');const b=th.pk.q[0];if(b[0]==='sys'&&b[1]==='line'){th.pk.stop=b;return;}if(handlers['song:queues'](th,b,()=>false))continue;th.pk.q.shift();if(b[0]==='sys'&&b[1]==='mg')th.pk.q.unshift(...c.mgResult(th,b[2],'skip'));else if(b[0]!=='sys')th.msgs.push({who:b[0],k:b[1],txt:b[2]});}th.pk.stop=null;}
async function choose(th,id){actionId=id;const opts=c.window.WTSR_RUNTIME.options(th),o=opts.find(x=>x.id===id);assert(o,th.pk.wtsr.scene+' has action '+id);th.msgs.push({who:'me',k:'say',txt:o.intent});await c.reply(th,{kind:'user',txt:o.intent,mode:'say'});drain(th);}
async function next(th){await choose(th,'next');}
async function run(route,lead,ending){
 const th={id:'flow',wid:'song',rounds:0,msgs:[],pk:{ch:1,flags:{},q:[]}};threads.flow=th;
 const acts={
 SCN_0101:['terms'],SCN_0104:['confirm'],SCN_0204:['new'],SCN_0301:['split'],SCN_0303:['decline'],SCN_0304:['confirm'],
 SCN_0401:['archive_no'],SCN_0404:['work_facts'],SCN_0501:['private'],SCN_0504:[lead||'solo'],SCN_0602:['keep'],SCN_0604:[lead||'solo','confirm'],
 SCN_0704:['decline',lead==='viv'?'boundary_reconnecting':'boundary_work_only'],SCN_0804:[route==='stage_ready'?'stage':'room'],
 SCN_0901:[lead||'solo'],SCN_0904:lead==='eri'?['eri_disclosure','date_eri']:lead==='viv'?[ending==='END_SLOW'?'slow_viv':'date_viv']:['solo'],
 SCN_1004:[route],SCN_1103:[route==='handover'?'handover':'complete'],SCN_1104:['confirm'],SCN_1203:['planned'],SCN_1204:[ending]};
 for(const chapter of R.chapters){if(chapter.n>1)assert(th.pk.wtsr.goals[chapter.n-1]);th.pk.ch=chapter.n;th.pk.q=chapter.scenes.map(s=>['sys','wtsrScene',{id:s.id}]);drain(th);
  for(const sc of chapter.scenes){assert.equal(th.pk.wtsr.scene,sc.id);
   for(const a of acts[sc.id]||[])await choose(th,a);
   if(sc.id==='SCN_0101')assert.equal(th.pk.wtsr.phase,'body');
   if(!th.pk.wtsr.ending){await next(th);if(!sc.id.endsWith('04'))assert.notEqual(th.pk.wtsr.scene,sc.id,'next scene reached, including after a CG');}
  }
  assert(th.pk.wtsr.goals[chapter.n],chapter.n+' completed by actual intent');
 }
 assert.equal(th.pk.wtsr.ending,ending);assert.equal(th.pk.st,'end');assert.equal(th.pk.q.length,0);
 assert(!th.msgs.some(m=>/隐藏分支|回应空间|player_intent|ROUTE_STAGE/.test(m.txt||'')));
 assert(th.msgs.some(m=>m.who==='me'));
 const saved=JSON.parse(JSON.stringify(th));assert.deepEqual(saved.pk.wtsr,JSON.parse(JSON.stringify(th.pk.wtsr)));
 console.log(route+' / '+(lead||'independent')+' / '+ending+': all 48 scenes, 12 real goal confirmations, native game skips, CG return and saved ending passed');
}
(async()=>{await run('stage_ready','viv','END_VIV');await run('room_ready','eri','END_ERI');await run('handover',null,'END_SOLO');await run('room_ready',null,'END_FRIEND');await run('room_ready','viv','END_SLOW');await run('handover',null,'END_CLOSE');const early={id:'flow',wid:'song',msgs:[],pk:{ch:1,q:[['sys','wtsrScene',{id:'SCN_0101'}]]}};threads.flow=early;drain(early);await choose(early,'exit');assert.equal(early.pk.end,'END_EARLY');console.log('Explicit early exit: preserved unsigned contract and END_EARLY passed.');})().catch(e=>{console.error(e);process.exitCode=1;});
