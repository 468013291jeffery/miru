const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const E=require('../api/_m102engine'),D=JSON.parse(fs.readFileSync('art/official/m102/story.json','utf8'));
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;};
const choose=(s,n,k,target)=>E.apply(s,{id:'c'+n,op:'choice',chapter:n,option:k,target},D);
// Exhaust every authored A/B combination, including refusal-only completion.
for(let mask=0;mask<16384;mask++){
 let s=E.initial();for(let n=1;n<=14;n++){const k=(mask>>(n-1))&1?'A':'B';if(n>1)assert.equal(E.entry(s,n,D).scene_id,'M102_CH'+String(n).padStart(2,'0')+'_'+s.choices[n-1]);s=choose(s,n,k,'luca');}
 assert.equal(s.next_chapter,15);assert.ok(E.ending(s));assert.ok(['sole','player_majority'].includes(s.fields.ownership_control));
}checks+=16384;
for(const target of E.actors)for(const guest of E.actors){
 let s=E.initial();for(let n=1;n<=13;n++)s=choose(s,n,'A',target);
 ok(!s.confirmed_relationship,'interest is not a relationship');
 let e=choose(s,14,'A',guest);ok(!E.ending(e).startsWith('relationship_'),'celebration is not a relationship');
 s=E.apply(s,{id:'confirm',op:'relationship',actor:target},D);e=choose(s,14,'A',guest);
 ok(E.ending(e)===(target===guest?'relationship_epilogue_'+target:'friendship_or_open_future_'+guest),'route follows explicit person');
}
let s=choose(E.initial(),1,'B');ok(E.actors.every(k=>!s.access[k]),'refused actors cannot reenter');
ok(E.actors.every(k=>s.relations[k].respect===1),'refusal is not punished');
const a={id:'permission',op:'boundary',actor:'luca',category:'kiss',granted:true};s=E.apply(s,a,D);s=E.apply(s,{...a,id:'withdraw',granted:false},D);ok(!s.consent['luca:kiss'],'permission can be revoked');
ok(JSON.stringify(E.apply(s,{...a,id:'withdraw',granted:false},D))===JSON.stringify(s),'duplicate id is idempotent');
for(const a of [{id:'bad',op:'choice',chapter:3,option:'A'},{id:'bad',op:'choice',chapter:2,option:'C'},{id:'bad',op:'learn',actor:'luca',fact:'private',source:'invented'},{id:'bad',op:'relationship',actor:'luca'}])assert.throws(()=>E.apply(s,a,D));checks+=4;
ok(D.world.pack.chapters.length===14,'14 chapters');
ok(D.world.pack.chapters.reduce((n,c)=>n+c.beats.zh.filter(b=>b[1]==='scene').length,0)===56,'56 scenes');
ok(D.world.pack.chapters.reduce((n,c)=>n+c.beats.zh.filter(b=>b[2]&&b[2].m102free).length,0)===56,'56 real free stops');
for(let n=2;n<=14;n++){
 ok(D.offsite[n].filter(b=>b[1]==='scene').length===4,'offsite has four authored scenes');
 ok(D.offsite[n].every(b=>!E.actors.some(k=>b[0]==='m102_'+k)),'no refused actors in offsite path');
}
// Run the real frontend adapter with controlled network and actual authored data.
const noop=()=>{},messages=[],opened=[],server=new Map(),endings={},C={},W=[];
const ctx={console,URLSearchParams,location:{search:''},Math,Date,JSON,Promise,window:null,document:{addEventListener:noop,createElement:()=>({}),head:{appendChild:noop}},M102_DATA:D,M102Engine:E,C,W,$:()=>null,S:{art:{},threads:{}},busy:false,curT:'t',CL:()=> 'zh',save:noop,toast:noop,copy:o=>JSON.parse(JSON.stringify(o)),chLocked:()=>true,EN:()=>4,packInit:noop,
 reply:async()=>null,startSheet:noop,storyPage:noop,packOpen:(th,n)=>{th.pk.ch=n;th.pk.q=JSON.parse(JSON.stringify(D.world.pack.chapters[n-1].beats.zh));opened.push(th.pk.q);},packPick:noop,packAfterPick:noop,stopAuto:()=>[],stopHTML:()=>'',packPanel:()=>'',packPrompt:()=>'',mainOf:th=>th.cast[0],speakersOf:th=>th.cast,playBeats:async(th,r)=>r,packBeats:v=>v.zh,pkTrack:noop,pkDone:noop,pkGo:(th,s)=>th.pk.st=s,appendMsg:(th,m)=>messages.push(m),packRun:noop,packRefresh:noop,packSt:()=>({end:endings}),renderChat:noop,scrollChat:noop,setSugg:noop,closeSheet:noop,sheet:noop,Lz:v=>v.zh||v,esc:s=>s,openStory:noop,clearTimeout:noop,setTimeout:noop,
 capi:async(path,opts)=>{const b=opts&&opts.json,session=b?b.session:new URLSearchParams(path.split('?')[1]).get('session');let row=server.get(session)||{state:E.initial(),ver:0};if(b){row={state:E.apply(row.state,b.action,D),ver:row.ver+1};}server.set(session,row);return {ok:true,j:JSON.parse(JSON.stringify(row))};}};
ctx.window=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync('source/src/app115_m102.js','utf8'),ctx);
const th={id:'t',wid:'m102',cast:D.world.cast,mem:[],pk:{ch:1,st:'choose',picks:{},as:'m102_you'},m102:{session:'test',state:E.initial(),ver:0}};ctx.S.threads.t=th;
(async()=>{
 await ctx.packPick('B');ok(th.pk.picks[1]==='B','frontend saves choice on server');
 ctx.packAfterPick(th,'B');await ctx.packOpen(th,2,false);
 ok(opened.at(-1).every(b=>!E.actors.some(k=>b[0]==='m102_'+k)),'real packOpen uses refusal path');
 ok(opened.at(-1).some(b=>typeof b[2]==='string'&&b[2].includes(D.entries[2].variants.B.text)),'exclusive branch entrance inserted');
 const stop=['m102_you','line',{m102free:true,hint:{zh:'问谁？'},opts:[]}];ok(ctx.stopAuto(th,stop)===null,'all entry modes pause for free chat');
 th.pk.stop=stop;ok(ctx.stopHTML(th).includes('data-m102-continue'),'free chat has explicit continuation');
 const result=await ctx.playBeats(th,{beats:[{who:'m102_luca',text:'I came back'},{who:'m102_amy',text:'I am here'}]});ok(result.beats.length===1&&result.beats[0].who==='m102_amy','AI output cannot reintroduce absent actor');
 ok(ctx.packPrompt(th).includes('confirmed relationship: null'),'prompt carries actual relationship state');
 // Exercise the actual HTTP handler: owner isolation, duplicate retries and simultaneous writers.
 const rows=new Map();let user='u1';const sql=async(q,a)=>{
  if(q.startsWith('CREATE'))return [];
  const key=a[0]+':'+a[1];
  if(q.startsWith('INSERT')){if(!rows.has(key))rows.set(key,{data:JSON.parse(a[2]),ver:0});return [];}
  if(q.startsWith('SELECT'))return [JSON.parse(JSON.stringify(rows.get(key)))];
  if(q.startsWith('UPDATE')){const r=rows.get(key);if(r.ver!==a[3])return [];r.data=JSON.parse(a[2]);r.ver++;return [JSON.parse(JSON.stringify(r))];}throw Error(q);
 };
 const L={wrap:x=>x,cors:()=>true,needActive:async(req,res)=>user?{uid:user}:(res.status(401).json({error:'login'}),null),db:async()=>sql,jsonBody:r=>r.body,send:(r,s,b)=>r.status(s).json(b),bad:(r,m,s)=>r.status(s).json({error:m})};
 const sandbox={module:{exports:{}},require:p=>p==='./_lib'?L:p==='./_m102engine'?E:D};vm.runInNewContext(fs.readFileSync('api/_m102.js','utf8'),sandbox);
 const http=async(method,body)=>{const r={code:200,status(n){this.code=n;return this;},json(b){this.body=b;return this;}};await sandbox.module.exports({method,query:body,body},r);return r;};
 let r=await http('GET',{session:'test'});ok(r.body.ver===0,'API initializes own session');
 const body={session:'test',ver:0,action:{id:'once',op:'choice',chapter:1,option:'B'}};r=await http('POST',body);ok(r.body.ver===1,'API commits checkpoint');
 r=await http('POST',body);ok(r.body.ver===1&&r.body.replayed,'API repeat does not double apply');
 const parallel=await Promise.all(['x','y'].map(id=>http('POST',{session:'test',ver:1,action:{id,op:'choice',chapter:2,option:'A'}})));ok(parallel.filter(r=>r.code===200).length===1&&parallel.filter(r=>r.code===409).length===1,'API concurrent choices have one winner');
 user='u2';r=await http('GET',{session:'test'});ok(r.body.state.next_chapter===1,'another account cannot read the first account state');user=null;r=await http('GET',{session:'test'});ok(r.code===401,'API requires authentication');
 console.log('M102: '+checks+' checks passed; exhaustive 16384 routes, explicit relationships, refusal, frontend adapter, authenticated CAS API.');
})().catch(e=>{console.error(e);process.exitCode=1;});
