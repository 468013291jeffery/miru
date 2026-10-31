const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let time=0,bar=null,checks=0,intervalId=0;const intervals=new Map(),calls=[];
const noop=()=>{},check=(v,m)=>{assert.ok(v,m);checks++;};
function element(){const nodes={};return {dataset:{},classList:{add:noop,toggle:noop},querySelector:s=>nodes[s]||(nodes[s]={}),remove(){bar=null;}};}
const chat={hidden:false,classList:{add:noop},querySelector:s=>s==='[data-reading-bar]'?bar:s==='.composer'?{before:e=>bar=e}:null,appendChild:e=>bar=e};
const ctx={console,Map,WeakMap,Promise,Set,Date:class extends Date{static now(){return time;}},window:null,
 document:{createElement:element,head:{appendChild:noop}},addEventListener:noop,
 S:{threads:{},voice:{auto:false},couples:{},autoVoice:false},curT:'t',HIST_OPEN:false,PKNEXT:{},PKPLAY:{},PKSKIP:{},PKWAIT:{},VIS28:new Set(['scene']),
 $:s=>s==='#s-chat'?chat:s==='#msgs'?{scrollTop:0}:null,
 speak:(text,who,onend)=>{ctx.AUD_CUR={paused:false,ended:false};calls.push({text,onend,audio:ctx.AUD_CUR});},stopVoice:()=>{if(ctx.AUD_CUR)ctx.AUD_CUR.paused=true;ctx.AUD_CUR=null;},
 setInterval:fn=>{const id=++intervalId;intervals.set(id,fn);return id;},clearInterval:id=>intervals.delete(id),setTimeout:fn=>{queueMicrotask(fn);return 1;},clearTimeout:noop,
 pkSpd:()=>1,pkWait:async()=>{},pkAppend:(th,m)=>{th.msgs.push(m);th._unread=1;},isNarr:m=>m.who==='n',streamPreview:noop,renderChat:noop,save:noop,
 mainOf:th=>th.cast[0],speakersOf:th=>th.cast,stageOf:()=>0,ch:()=>({n:'Actor'}),asText70:x=>String(x),POSES:[],MIRU_TUNE:{chat:{beatMs:1,reaction:false}},appendMsg:(th,m)=>th.msgs.push(m),voiceAutoOK:()=>false,voiceCount:noop,levelUpCheck:noop,setSugg:noop,scrollChat:noop,typing:noop,VOICE_BUSY:0,
 readMs:()=>999999,pkDirective:()=>false,isStop:b=>b[1]==='line',stopAuto:()=>null,packRefresh:noop,beatMsg:b=>({who:b[0],k:b[1],txt:b[2]}),pkGo:(th,s)=>th.pk.st=s,packAfterPick:noop,
};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync('source/src/app116_reading.js','utf8'),ctx);
const R=ctx.READING;const flush=async()=>{for(let i=0;i<30;i++)await Promise.resolve();};const tick=()=>{for(const fn of [...intervals.values()])fn();};
const thread=()=>({id:'t',cast:['a','b'],msgs:[],love:{a:0,b:0},rounds:0,status:{},pk:{ch:1,st:'busy',q:[],after:'choose'}});
(async()=>{
 let th=thread();ctx.S.threads.t=th;
 ctx.speak('A long line','a',noop);let resolved=false;const message={txt:'A long line',k:'say'};const wait=R.wait(th,message,'ai').then(()=>resolved=true);
 check(bar.querySelector('[data-reading-next]').disabled,'next is disabled while voice plays');
 time=120000;tick();await flush();check(!resolved&&calls.length===1,'even a two minute audible line cannot be timed out');
 check(!R.advance(),'early click cannot cut off current voice');calls[0].onend();await flush();check(!resolved,'early callback cannot bypass the real audio end');
 calls[0].audio.ended=true;calls[0].audio.paused=true;tick();await flush();check(!resolved,'voice finishing never advances text on its own');
 check(R.advance(),'click after voice end advances');await wait;check(resolved,'acknowledgement releases the current message');
 ctx.speak('First queued voice','a',noop);ctx.speak('Second queued voice','b',noop);check(calls.length===2,'second voice is queued, not started');
 calls[1].onend();check(calls.length===2,'callback during audible speech does not start next voice');calls[1].audio.ended=true;calls[1].audio.paused=true;tick();check(calls.length===3&&calls[2].text==='Second queued voice','next voice starts only after actual completion');ctx.stopVoice();
 check(!R.voice.busy(),'explicit stop releases the voice lock and cancels queued speech');
 const failedMessage={txt:'Voice unavailable',k:'say'};ctx.speak('Voice unavailable','a',noop);calls.at(-1).audio.paused=true;const failedWait=R.wait(th,failedMessage,'ai');time+=26000;tick();check(!R.voice.busy(),'unavailable audio releases after a bounded wait');check(R.pending.has(th.id),'audio failure still waits for a reader click');R.advance();await failedWait;
 resolved=false;const timedWait=ctx.pkWait(th,{txt:'Read at your own pace',k:'act'}).then(()=>resolved=true);time+=999999;tick();await flush();check(!resolved,'script text has no automatic reading deadline');R.advance();await timedWait;
 const source=fs.readFileSync('source/src/app3_chat.js','utf8'),start=source.indexOf('async function playBeats('),end=source.indexOf('let VOICE_BUSY=',start);vm.runInContext(source.slice(start,end),ctx);
 th=thread();ctx.S.threads.t=th;delete th.pk;const ai=ctx.playBeats(th,{beats:[{who:'a',kind:'say',text:'First reply'},{who:'b',kind:'say',text:'Second reply'}]}, {kind:'cont'},false);await flush();
 check(th.msgs.length===1&&th.msgs[0].txt==='First reply','real multi-character playBeats displays just the first reply');time+=600000;tick();await flush();check(th.msgs.length===1,'another speaker cannot appear while the first reply is unread');
 R.advance();await flush();check(th.msgs.length===2&&th.msgs[1].txt==='Second reply','one click reveals exactly one next reply');check(R.pending.has(th.id),'last AI reply also waits to be read');R.advance();await ai;
 const burst=fs.readFileSync('source/src/app28_burst.js','utf8');vm.runInContext(burst.slice(burst.indexOf('packRun=async function')),ctx);
 th=thread();ctx.S.threads.t=th;th.pk.q=[['a','say','Script first'],['b','say','Script last']];const run=ctx.packRun(th);await flush();check(th.msgs.length===1,'real script player pauses on first line');R.advance();await flush();check(th.msgs.length===2&&th.pk.st==='busy','last scripted line cannot disappear into a chapter decision');R.advance();await run;check(th.pk.st==='choose','chapter choice appears only after final acknowledgement');
 th=thread();ctx.S.threads.t=th;th.pk.q=[['a','say','Before optional input'],['a','line',{hint:'Optional input'}]];const stopRun=ctx.packRun(th);await flush();check(!th.pk.stop,'optional input waits until preceding line is read');R.advance();await flush();check(th.pk.stop&&th.pk.stop[1]==='line','optional input appears after acknowledgement');ctx.PKWAIT.t([]);await stopRun;
 console.log('Reading/voice: '+checks+' checks passed. Real AI/script players, long audio, early callbacks, sequential playback, reader acknowledgement and failure recovery.');
})().catch(e=>{console.error(e);process.exitCode=1;});
