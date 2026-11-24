/* Drive authored queues and actual input wrappers through all 48 scene stops. */
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const R=JSON.parse(fs.readFileSync('content/official/ashes-of-us-v1/release.json'));
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
 authoredMatch:async()=>c.window.ASHES_RUNTIME.options(threads.flow).findIndex(o=>o.id===actionId)};
// Persist one ending registry, just as packSt does in the real app.
const endings={end:{}};c.packSt=()=>endings;
c.window=c;c.addEventListener=()=>{};vm.createContext(c);vm.runInContext(fs.readFileSync('source/src/app110_pkreg.js','utf8'),c);c.PKREG.install();assert(c.PKREG.installed);let oldAdapterCalls=0;const oldAdapter=c.pkDirective;c.pkDirective=function(th,b){if(th.wid==='existing-empress'&&b[1]==='legacy-rune'){oldAdapterCalls++;return true;}return oldAdapter(th,b);};for(const f of ['app104_pkstate.js','app162_ashes_state.js','app162_ashes_data.js','app162_ashes.js'])vm.runInContext(fs.readFileSync('source/src/'+f,'utf8'),c);
assert(c.pkDirective({wid:'existing-empress'},['sys','legacy-rune',{}]));assert.equal(oldAdapterCalls,1,'pre-existing direct adapter survives Song activation');
R.cast.forEach(x=>chars[x.name]={n:x.name,n94:{zh:x.name}});
worlds.ashes={community:R.work_id,cast:R.cast.map(x=>x.name),pack:{chapters:R.chapters.map(x=>({n:x.n,beats:{zh:[]}}))}};
function drain(th){let count=0;while(th.pk.q.length){assert(++count<300,'finite queue');const b=th.pk.q[0];if(b[0]==='sys'&&b[1]==='line'){th.pk.stop=b;return;}if(c.pkDirective(th,b))continue;th.pk.q.shift();if(b[0]==='sys'&&b[1]==='mg')th.pk.q.unshift(...c.mgResult(th,b[2],'skip'));else if(b[0]!=='sys')th.msgs.push({who:b[0],k:b[1],txt:b[2]});}th.pk.stop=null;}
async function choose(th,id){actionId=id;const opts=c.window.ASHES_RUNTIME.options(th),o=opts.find(x=>x.id===id);assert(o,th.pk.ashes.scene+' has action '+id);th.msgs.push({who:'me',k:'say',txt:o.intent});await c.reply(th,{kind:'user',txt:o.intent,mode:'say'});drain(th);}
async function next(th){await choose(th,'next');}


async function run(relationship,ending){
 const th={id:'flow',wid:'ashes',rounds:0,msgs:[],pk:{ch:1,flags:{},q:[]}};threads.flow=th;
 const action=['terms','memory','ownership','questions','separation','privacy','ask_logistics','reject_marketing','timeline','account','public_scope'];
 for(const chapter of R.chapters){th.pk.ch=chapter.n;th.pk.q=chapter.scenes.map(s=>['sys','ashesScene',{id:s.id}]);drain(th);
 for(const sc of chapter.scenes){assert.equal(th.pk.ashes.scene,sc.id);if(sc.id==='SCN_01_01')await next(th);if(sc.memory)assert.equal(th.present.length,0);if(sc.id.endsWith('_03')&&chapter.n<12)await choose(th,action[chapter.n-1]);if(sc.id==='SCN_12_02')await choose(th,relationship);if(sc.id==='SCN_12_03')await choose(th,ending);if(!th.pk.ashes.ending)await next(th);}
 assert(th.pk.ashes.goals[chapter.n],chapter.n+' real goal');}
 assert.equal(th.pk.end,ending);assert.equal(th.pk.st,'end');assert.equal(th.pk.q.length,0);assert.equal(Object.keys(th.pk.ashes.games).length,24);assert(!th.msgs.some(m=>m.who!=='me'&&/【本章安排】|对白参考|SCN_|【角色任务】/.test(m.txt||'')));assert(!th.msgs.some(m=>m.who==='伊芙琳'&&m.k==='say'));
 console.log(ending+': all 36 scenes, 24 optional game skips, historical isolation and 12 real goals passed');return th;
}
(async()=>{for(const [rel,end]of [['invite','END_REBUILD'],['friends','END_FRIENDS'],['slow','END_SLOW'],['goodbye','END_GOODBYE'],['coerce','END_BREAK']])await run(rel,end);const th={id:'flow',wid:'ashes',msgs:[],pk:{q:[['sys','ashesScene',{id:'SCN_01_01'}]]}};threads.flow=th;drain(th);await choose(th,'pause');assert(th.pk.ashes.paused);await choose(th,'exit');assert.equal(th.pk.end,'END_EARLY');console.log('Ashes: paused exit, six endings and older direct adapter preserved.');})().catch(e=>{console.error(e);process.exitCode=1;});
