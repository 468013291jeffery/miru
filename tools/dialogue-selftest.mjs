import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const src=fs.readFileSync('source/src/app100_dialogue.js','utf8');
let calls=0, prompt='', resolveAsk, sent=0, replyCount=0;
const input={value:'',focus(){},dispatchEvent(){}}, box={innerHTML:''};
const th={id:'a',wid:'w',pk:{ch:1,as:'side',stop:['c','line',{hint:{zh:'门口有人在等你的答复'}}]},status:{},msgs:[]};
const b={S:{lang:'zh',heat:'steamy',threads:{a:th}},curT:'a',cmode:'say',busy:false,
 talkIntent:()=> 'hostile',TALK_FB:{zh:{},en:{}},talkSugg:()=>[],
 CL:()=> 'zh',LANG_NAME:{zh:'Simplified Chinese'},Lz:v=>typeof v==='string'?v:v?.zh||'',
 ch:id=>({n:id}),wd:()=>({heat:'fluff'}),heatGated:h=>h,
 marksForbidden:()=>['未揭露真相'],cardForbidden:()=>[],speakersOf:()=>['c'],
 liveOn:()=>true,ask:async p=>{calls++;prompt=p;return {replies:['先解释一下。','我想再等等。','先解释一下。']}},
 stopHTML:()=>'<div id="ai97o" class="ai97o"></div>',
 doSend:()=>{sent++},reply:async()=>{replyCount++},
 $:sel=>sel==='#cin'?input:sel==='#ai97o'?box:null,
 esc:s=>s.replaceAll('"','&quot;'),Event:class {},document:{addEventListener(k,fn){this.click=fn}}};
vm.createContext(b);vm.runInContext(src,b);
assert.equal(b.dialogueHeat(th),'fluff');
assert.equal(b.talkIntent('别碰我，保持距离'),'boundary');
assert.equal(b.talkIntent('换个话题吧'),'boundary');
assert.equal(b.talkSugg(th,'boundary','zh').length,3);
assert.equal(b.dialogueHelpRequest('我不知道怎么回复'),true);
assert.equal(b.dialogueHelpRequest('我不知道他为什么离开'),false);
assert.equal(b.dialogueHelpRequest('我卡住了'),true);
assert.equal(b.dialogueHelpRequest('help me reply'),true);
assert.equal(b.dialogueStalled(th),false);
const state=JSON.stringify(th);
const result=await b.dialogueGetIdeas(th);
assert.equal(result.length,2);assert.equal(calls,1);await b.dialogueGetIdeas(th);assert.equal(calls,1);
assert.equal(JSON.stringify(th),state,'ideas never mutate story state');
assert.match(prompt,/defer or change topic/);assert.match(prompt,/Simplified Chinese/);
assert.ok(!prompt.includes('未揭露真相'));
assert.ok(b.stopHTML(th).includes('data-dialogue-idea'));
b.document.click({target:{closest:()=>({dataset:{dialogueIdea:'我想再等等。'}})},preventDefault(){},stopImmediatePropagation(){}});
assert.equal(input.value,'我想再等等。');assert.equal(sent,0,'choosing an idea only fills composer');
b.doSend('我卡住了');assert.equal(sent,0);await Promise.resolve();
b.doSend('我想去门口看看');assert.equal(sent,1);
th.msgs.push({who:'me',txt:'new'});b.ask=()=>{calls++;return new Promise(r=>resolveAsk=r)};
const p1=b.dialogueGetIdeas(th),p2=b.dialogueGetIdeas(th);assert.equal(calls,2,'parallel requests coalesced');
th.pk.ch=2;resolveAsk({replies:['old one','old two']});assert.equal((await p1).length,0);await p2;
b.ask=async()=>{throw Error('offline')};th.msgs.push({who:'c',txt:'a new moment'});
assert.equal((await b.dialogueGetIdeas(th)).length,3,'network failure offers local directions');
assert.equal(b.dialogueIdeasClean(['未揭露真相','only one'],th).length,3);
assert.equal(b.dialogueIdeasClean([{},null,9],th).length,3);
th.msgs=[1,2,3].map(()=>({who:'me',txt:'然后呢？'}));assert.equal(b.dialogueStalled(th),true);
th.pk.as='watch';assert.equal(b.dialogueStalled(th),false);
const chat=fs.readFileSync('source/src/app3_chat.js','utf8');
assert.match(chat,/typeof DIALOGUE_REPLY_CHARTER/);
assert.match(chat,/HEAT CEILING — .*dialogueHeat\(th\)/);
const html=fs.readFileSync('index.html','utf8');assert.match(html,/REPLY CHARTER \(v7.11\/v7.12/);
console.log('dialogue regression passed: request wiring, heat cap, help intent, deduplication, no state writes, editable choices, request coalescing, stale response, offline fallback, stall detection');

const build=fs.readFileSync("source/build.py","utf8");
assert.match(build, /"app94_official2.js","app100_dialogue.js"/);
assert.ok(html.indexOf('window.MIRU_BUILD') >= 0 && html.indexOf('window.MIRU_BUILD') < html.indexOf('window.CREATOR_HTML')); 
for (const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)) new vm.Script(m[1]);
console.log("build wiring and classic script syntax passed");
const proxySource = fs.readFileSync('api/longcat.js','utf8');
const corsContext = vm.createContext({});
vm.runInContext(proxySource.split('\n').find(l=>l.startsWith('const ALLOWED = '))+'\n'+proxySource.match(/function cors\(origin\) \{[\s\S]*?\n\}/)[0],corsContext);
for(const origin of ['https://miru.plus','https://www.miru.plus','https://468013291jeffery.github.io','https://miru-wheat-pi.vercel.app']) assert.equal(corsContext.cors(origin).headers['Access-Control-Allow-Origin'],origin);
for(const origin of ['https://miru.plus.evil.example','https://evil.example','http://www.miru.plus']) assert.equal(corsContext.cors(origin).ok,false);
for(const hostname of ['www.miru.plus','miru.plus','miru-wheat-pi.vercel.app']) {
 const configContext=vm.createContext({window:{},location:{hostname,origin:'https://'+hostname}});
 vm.runInContext(fs.readFileSync('config.js','utf8'),configContext);
 assert.equal(configContext.window.MIRU_PROXY,'https://'+hostname+'/api/longcat');
}
console.log('production domain CORS, spoofed origins, and same-origin proxy passed');
