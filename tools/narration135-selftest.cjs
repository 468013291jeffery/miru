const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('source/src/app135_narration.js','utf8'),clone=x=>JSON.parse(JSON.stringify(x));
const GOOD='剑停住了，刚才的话有了片刻空隙。';let checks=0;
function setup(){
 const b=JSON.parse(fs.readFileSync('art/official/w_scmw7f7e4565778126fa.bible.json','utf8'));
 b.experience.narration={schema:1,enabled:true,cooldown:3,maxChars:90,timeoutMs:1000};
 const names={c01:'凯尔',c02:'卢西安',c03:'罗恩',c04:'索伦'},s={id:'s1',place:'审判台'};
 const th={id:'t',wid:'w',cast:Object.keys(names),status:{time:'第一夜'},b98:{ch:1,sc:0,turns:6},msgs:[
  {who:'me',k:'say',txt:'先把剑放下。'},
  {who:'c01',k:'act',txt:'凯尔把剑向后收了半寸，握剑的手停住。'},
  {who:'c01',k:'say',txt:'好，你说，我听。'}]};
 const calls=[],ctx={console,Intl,AbortController,setTimeout,clearTimeout,S:{threads:{t:th}},curT:'t',Z98:()=>true,LANG98:()=> 'Simplified Chinese',LZ98:x=>typeof x==='object'?(x.zh||x.en||''):String(x||''),wd:()=>({}),bOf98:()=>b,scene98:()=>({b,s}),here98:()=>['c01','c02'],byKey98:(_,k)=>k,ch:id=>({n:names[id]}),first:x=>x,appendMsg:(target,m)=>target.msgs.push(m)};
 ctx.ask=async(p,o)=>{calls.push({p,o,messageCount:th.msgs.length});const lines=JSON.parse(p.split('VISIBLE_SOURCES_JSON:\n')[1].split('\nEND_VISIBLE_SOURCES')[0]);return {text:GOOD,sources:[lines.find(x=>x.type==='action').id]};};
 vm.createContext(ctx);vm.runInContext(source,ctx);
 return {b,s,th,ctx,calls,opt:{mode:'talk',act:{txt:'先把剑放下。',mode:'say'},d:{beat:'危机',intent:'PRIVATE_DIRECTOR_SECRET',state:'FUTURE_STATE'},start:1,delivered:1}};
}
const frames=x=>x.th.msgs.filter(m=>m.narrative135);
async function test(name,fn){await fn();checks++;console.log('✓ '+name);}
(async()=>{
 await test('opt-in only',async()=>{const x=setup();delete x.b.experience.narration;assert.equal(x.ctx.narrationOn135(x.th),false);await x.ctx.narrationAfter135(x.th,x.opt);assert.equal(x.calls.length,0);});
 await test('post-actor isolated optional frame',async()=>{const x=setup();await x.ctx.narrationAfter135(x.th,x.opt);assert.equal(frames(x).length,1);assert.equal(x.th.msgs.at(-1).txt,GOOD);assert.equal(x.calls[0].messageCount,3);assert(x.calls[0].o.optional&&x.calls[0].o.isolatedContext);assert.equal(x.th.b98.narration135.shown,1);});
 await test('private/future material excluded',async()=>{const x=setup();x.b.world='WORLD_SECRET';x.b.chapters[1].goal='LATER_CHAPTER_SECRET';await x.ctx.narrationAfter135(x.th,x.opt);for(const token of ['PRIVATE_DIRECTOR_SECRET','FUTURE_STATE','WORLD_SECRET','LATER_CHAPTER_SECRET'])assert(!x.calls[0].p.includes(token));});
 for(const [name,change] of [['think',x=>x.opt.act.mode='think'],['fast',x=>x.opt.d.fast98=1],['failed actors',x=>x.opt.delivered=0],['exit',x=>x.opt.mode='exit'],['enter',x=>x.opt.mode='enter'],['sense',x=>x.th.msgs.push({who:'n',k:'act',txt:'你的呼吸微微一顿。',sense98:1})],['event',x=>x.th.msgs.push({who:'n',k:'act',txt:'灯熄灭了。',ev98:'e1'})],['arrival',x=>x.th.msgs.push({who:'n',k:'act',txt:'卢西安走来。'})]])await test(name+' skips',async()=>{const x=setup();change(x);await x.ctx.narrationAfter135(x.th,x.opt);assert.equal(x.calls.length,0);});
 await test('valid citations cannot invent outcomes/props/consent',async()=>{for(const text of ['凯尔把一枚从未出现的戒指放在桌上。','凯尔已经解开了锁环。','凯尔看着你，你闭上眼接受了这次亲吻。','罗恩站到你身旁。','你决定相信凯尔。','凯尔说：“相信我。”']){const x=setup(),base=x.ctx.ask;x.ctx.ask=async(p,o)=>Object.assign(await base(p,o),{text});await x.ctx.narrationAfter135(x.th,x.opt);assert.equal(frames(x).length,1,text);assert.notEqual(frames(x)[0].txt,text);assert.equal(frames(x)[0].narrative135.origin,'cue');}});
 await test('unknown source rejected',async()=>{const x=setup();x.ctx.ask=async()=>({text:GOOD,sources:[999]});await x.ctx.narrationAfter135(x.th,x.opt);assert.equal(frames(x).length,1);assert.equal(frames(x)[0].narrative135.origin,'cue');});
 await test('tentative/negative actions excluded',async()=>{for(const text of ['凯尔想把剑收回。','凯尔没有放下剑。','凯尔试图退开半步。']){const x=setup();x.th.msgs[1].txt=text;await x.ctx.narrationAfter135(x.th,x.opt);assert.equal(x.calls.length,0,text);}});
 await test('actions cannot move between performers',async()=>{const x=setup();x.th.msgs.push({who:'c02',k:'act',txt:'卢西安按住笔记本。'});const base=x.ctx.ask;x.ctx.ask=async(p,o)=>Object.assign(await base(p,o),{text:'凯尔按住笔记本，刚才的话有了片刻空隙。'});await x.ctx.narrationAfter135(x.th,x.opt);assert.equal(frames(x).length,1);assert(!frames(x)[0].txt.includes('笔记本'));});
 await test('failure/timeout preserve delivered actors',async()=>{for(const failure of ['throw','timeout']){const x=setup(),before=clone(x.th.msgs);x.ctx.ask=failure==='throw'?async()=>{throw Error('synthetic');}:()=>new Promise(()=>{});await x.ctx.narrationAfter135(x.th,x.opt);assert.deepEqual(clone(x.th.msgs.slice(0,before.length)),before);assert.equal(x.th.b98.narration135.failed,1);assert.equal(frames(x).length,1);assert.equal(frames(x)[0].narrative135.origin,'cue');}});
 await test('stale regeneration/scene/thread/message rejected',async()=>{for(const change of [x=>x.th.b98=clone(x.th.b98),x=>x.s.id='s2',x=>x.ctx.curT='other',x=>x.th.msgs.push({who:'me',k:'say',txt:'next'})]){const x=setup();let done;const base=x.ctx.ask;x.ctx.ask=(p,o)=>new Promise(resolve=>{done=async()=>resolve(await base(p,o));});const pending=x.ctx.narrationAfter135(x.th,x.opt);change(x);await done();await pending;assert.equal(frames(x).length,0);}});
 await test('cooldown and state restore',async()=>{const x=setup(),before=clone(x.th.b98);await x.ctx.narrationAfter135(x.th,x.opt);const n=x.calls.length;x.opt.start=x.th.msgs.length;x.th.msgs.push(clone(x.th.msgs[1]));x.th.b98.turns++;await x.ctx.narrationAfter135(x.th,x.opt);assert.equal(x.calls.length,n);x.th.b98=before;assert.equal(x.th.b98.narration135,undefined);});
 await test('screenshot choice has a visible frame even during ordinary cooldown',async()=>{
  const x=setup();x.th.msgs[0].txt='凯尔，撤销处决，我要证据';x.th.msgs[1].txt='＊ 凯尔 拇指离开护手，朝台下抬手，声音压低';x.th.msgs[2].txt='处决先撤，审判令暂缓。你要证据，我让人当场封存复核。要查哪一样，你说。';
  x.th.msgs.push({who:'c02',k:'act',txt:'卢西安没有伸手，想了想。'},{who:'c02',k:'say',txt:'先核对这张纸。'});x.opt.mode='choice';x.opt.delivered=2;x.th.b98.narration135={lastTurn:5,lastAttempt:5,attempts:0,shown:1};
  await x.ctx.narrationAfter135(x.th,x.opt);assert.equal(x.calls.length,0);assert.equal(frames(x).length,1);assert.equal(frames(x)[0].narrative135.cue,'voice');assert(frames(x)[0].txt.includes('证据'));assert(!frames(x)[0].txt.includes('封存'));await x.ctx.narrationAfter135(x.th,x.opt);assert.equal(frames(x).length,1);
 });
 await test('empty and rejected model outputs still show screenshot fallback',async()=>{
  for(const response of [null,{text:'',sources:[]},{text:'凯尔拿出从未出现的戒指。',sources:[999]}]){const x=setup();x.th.msgs[1].txt='＊ 凯尔 拇指离开护手，朝台下抬手，声音压低';x.ctx.ask=async()=>response;await x.ctx.narrationAfter135(x.th,x.opt);assert.equal(frames(x).length,1);assert.equal(frames(x)[0].narrative135.cue,'voice');assert(!frames(x)[0].txt.includes('戒指'));}
 });
 await test('mobile without Segmenter and fast replies need no extra model call',async()=>{
  for(const variant of ['mobile','fast','backoff']){const x=setup();x.th.msgs[1].txt='＊ 凯尔 拇指离开护手，朝台下抬手，声音压低';if(variant==='mobile')x.ctx.Intl={};if(variant==='fast')x.opt.d.fast98=1;if(variant==='backoff')x.th.b98.narration135={lastTurn:-99,lastAttempt:5,attempts:0,shown:0};await x.ctx.narrationAfter135(x.th,x.opt);assert.equal(x.calls.length,0);assert.equal(frames(x).length,1);}
 });
 await test('conditional and other-person gestures cannot create a fallback cue',async()=>{
  const x=setup();for(const text of ['如果她后退，他就让开','凯尔看向低声说话的卢西安','凯尔退还证件','凯尔等你点头后再退开半步。','凯尔等你同意，才把声音压低。'])assert.equal(x.ctx.narrationCue135(x.th,{who:'凯尔',type:'action',text}),'');assert.equal(x.ctx.narrationCue135(x.th,{who:'凯尔',type:'action',text:'凯尔抬手示意停刑'}),'gesture');
 });
 await test('unposted frame does not count as displayed or start cooldown',async()=>{const x=setup();x.ctx.appendMsg=()=>{};await x.ctx.narrationAfter135(x.th,x.opt);assert.equal(frames(x).length,0);assert.equal(x.th.b98.narration135.shown,0);assert.equal(x.th.b98.narration135.lastTurn,-99);});
 await test('cue compatibility keeps English word boundaries',async()=>{const x=setup();assert.equal(x.ctx.narrationCue135(x.th,{who:'Kyle',type:'action',text:'Kyle lowers his voice.'}),'voice');assert.equal(x.ctx.narrationCue135(x.th,{who:'Kyle',type:'action',text:'Kyle steps back.'}),'space');});
 // Exercise the actual core ask's optional failure contract, not a mock of it.
 await test('optional ask has no retry, toast or global error mutation',async()=>{const core=fs.readFileSync('source/src/app1_core.js','utf8');const a=core.indexOf('async function ask('),z=core.indexOf('\nconst HEAT_RULE=',a);let calls=0,toasts=0,refresh=0;const run={Date,ORAL_RULE:'',liveOn:()=>true,LIVE_ERR:'prior',refreshLive:()=>refresh++,toast:()=>toasts++,t:x=>x,SAMPLE:{json:async()=>{calls++;throw {code:'invalid_json',text:'broken'};}}};vm.createContext(run);vm.runInContext(core.slice(a,z),run);await assert.rejects(run.ask('synthetic',{optional:true}));assert.equal(calls,1);assert.equal(toasts,0);assert.equal(refresh,0);assert.equal(run.LIVE_ERR,'prior');});
 console.log(checks+' narration pilot checks passed');
})().catch(e=>{console.error(e);process.exitCode=1;});
