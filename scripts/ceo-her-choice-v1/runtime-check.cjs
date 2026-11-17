const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=process.argv[2],wid=process.argv[3],b=JSON.parse(fs.readFileSync(path.join(root,'art/official/'+wid+'.bible.json'))),src=fs.readFileSync(path.join(root,'source/src/app98_story.js'),'utf8');
const begin=src.indexOf('/* Authored protagonist and chapter objectives. */'),end=src.indexOf('/* End authored protagonist and chapter objectives. */');assert(begin>=0&&end>begin);
let c,s;const world={id:'world',community:wid},S={threads:{},storyProtagonists98:{[wid]:{age:90,role:'CEO',name:'现实玩家',personality:'好奇',expression:'简短直接'}}};
const ctx={console,Date,WeakSet,Set,Map,JSON,S,document:{getElementById:()=>null},wd:()=>world,bOf98:()=>b,scene98:()=>({b,c,s}),Z98:()=>true,L98:z=>z,LZ98:o=>typeof o==='object'?o.zh:o,save:()=>{},esc:String,toast:()=>{},busy:false,experience98:()=>b.experience,pacing98:()=>({min:4,target:8}),dock98:()=>{},renderChat:()=>{},appendMsg:(t,m)=>t.msgs.push(m),beat98:()=>{throw Error('Incomplete chapter advanced');}};
vm.createContext(ctx);vm.runInContext(src.slice(begin,end),ctx);vm.runInContext(src.slice(src.indexOf('function gate98('),src.indexOf('function gateAsk98(')),ctx);
vm.runInContext(src.slice(src.indexOf('function finishExperience98('),src.indexOf('function explicitPreference98(')),ctx);vm.runInContext(src.slice(src.indexOf('async function next98('),src.indexOf('async function pick98(')),ctx);
assert.equal(ctx.authoredPersona98('world').age,28);assert(!JSON.stringify(ctx.authoredPersona98('world')).includes('CEO'));assert.equal(ctx.authoredPersona98('world').personality,'好奇');
(async()=>{
c=b.chapters[8];s=c.scenes[2];const history={wid:'world',b98:{ch:9,sc:2},msgs:[{who:'c01',k:'say',txt:'我妹妹两年前做手术。她一个人在医院等，我没来得及赶到。',context135:{chapter:9,scene:c.scenes[0].id}}]};
assert(ctx.goalReceiptValid98({...c.done[1],evidenceFromScene:0},{evidence:[{message:0,quote:'我妹妹两年前做手术'}]},ctx.goalEvidence98(history)),'Earlier hospital testimony must remain valid evidence at chapter-end');
assert.equal(typeof ctx.hiddenChoiceReply98,'function','Hidden natural-language choices are missing');
// Exercise the real dock and routing; only the model/network and final turn are boundaries.
let html='',matched=null,talked=null,result={n:2};ctx.curT='test';ctx.S.threads.test={wid:'world',cast:[],msgs:[],b98:{ch:9,sc:2,phase:'talk',picked:{}}};ctx.$=q=>q==='#dk98'?null:{insertAdjacentHTML:(_,v)=>html=v};ctx.cq98=String;ctx.playerMark146=String;ctx.nextLabel98=()=> '下一章';ctx.aiGate=()=>true;ctx.liveOn=()=>true;ctx.ask=async()=>result;ctx.pick98=async(t,i)=>{matched=i};ctx.beat98=async(t,m,a)=>{talked=a};
vm.runInContext(src.slice(src.indexOf('function dock98()'),src.indexOf('\n{ /* 2026-10-27')),ctx);ctx.dock98();assert(!html.includes('data-b98pick'),'Formal options leaked into hidden-choice dock');
await ctx.hiddenChoiceReply98(ctx.S.threads.test,{txt:'请先听我说完',mode:'say'});assert.equal(matched,1);assert.equal(talked,null);
matched=null;result={n:0};await ctx.hiddenChoiceReply98(ctx.S.threads.test,{txt:'你能解释一下吗？',mode:'say'});assert.equal(matched,null);assert.equal(talked.txt,'你能解释一下吗？');
talked=null;result={n:99};await ctx.hiddenChoiceReply98(ctx.S.threads.test,{txt:'不相关输入',mode:'say'});assert.equal(matched,null);assert.equal(talked.txt,'不相关输入');
let release;ctx.ask=()=>new Promise(r=>release=r);talked=null;const pending=ctx.hiddenChoiceReply98(ctx.S.threads.test,{txt:'我愿意',mode:'say'});ctx.S.threads.test.msgs.push({txt:'新消息'});release({n:1});await pending;assert.equal(matched,null);assert.equal(talked,null,'Stale semantic match committed');
ctx.dock98=()=>{};ctx.beat98=()=>{throw Error('Incomplete chapter advanced')};
for(c of b.chapters){s=c.scenes[0];const th={wid:'world',cast:[],msgs:[],b98:{ch:c.n,sc:0,turns:1000,phase:'talk',picked:{}}};
 assert(ctx.goalLocked98(th));assert(ctx.goalBar98(th).includes('0/2'));
 const flag=1,say=0;th.msgs=[{who:'n',k:'act',txt:'已经核验了现场证据。',context135:{chapter:c.n,scene:s.id}},{who:'me',k:'think',txt:'我想先了解。',context135:{chapter:c.n,scene:s.id}}];
 assert(!ctx.goalCommit98(th,{done:[{id:flag,evidence:[{message:0,quote:'已经核验了现场证据'}]},{id:say,evidence:[{message:1,quote:'我想先了解'}]}]},ctx.goalEvidence98(th)),'Earlier scene or private thought completed a goal');
 th.b98.sc=4;s=c.scenes[4];th.b98.picked[s.id]=2;
 ctx.gate98(th,{ready:true,wants_next:true});assert.equal(th.b98.ready98,null);await ctx.next98(th);assert.equal(th.b98.ch,c.n);
 th.msgs=[{who:'n',k:'act',txt:'现场资料已经完成核验。',context135:{chapter:c.n,scene:s.id}},{who:'me',k:'say',txt:c.done[0].val,context135:{chapter:c.n,scene:s.id}}];
 assert(!ctx.goalCommit98(th,{done:[{id:flag,evidence:[{message:999,quote:'伪造证据'}]}]},ctx.goalEvidence98(th)));
 assert(ctx.goalCommit98(th,{done:[{id:flag,evidence:[{message:0,quote:'现场资料已经完成核验'}]},{id:say,evidence:[{message:1,quote:c.done[0].val.slice(0,120)}]}]},ctx.goalEvidence98(th)));assert(!ctx.goalLocked98(th));assert(ctx.goalBar98(th).includes('2/2'));
 const restored=JSON.parse(JSON.stringify(th));assert(!ctx.goalLocked98(restored));restored.msgs[0].txt='明天再核验';assert(ctx.goalLocked98(restored));
}
c=b.chapters[17];s=c.scenes[4];for(const ending of ['END_TENDER','END_ALLIES','END_SOVEREIGN','END_OPEN']){const th={wid:'world',cast:[],msgs:[],b98:{ch:18,sc:4,phase:'talk'}};ctx.finishExperience98(th,ending);assert(!th.b98.ended);assert.equal(th.b98.pendingEnding98,ending);}
console.log('PASS: 18 chapter gates, 36 evidence receipts, private/early/fabricated rejection, save restore, 4 deferred endings, fixed editable Ava');
})().catch(e=>{console.error(e);process.exitCode=1});
