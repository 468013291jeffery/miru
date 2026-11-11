const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync('source/src/app3_chat.js','utf8'),helpers=source.slice(source.indexOf('function objGuard70'),source.indexOf('/* send from composer */')),send=source.slice(source.indexOf('function doSend('),source.indexOf('/* ================= AI ENGINE'));
const th={id:'t',wid:'w',rounds:0,msgs:[]},calls=[],ctx={console,CL:()=> 'zh',esc:x=>String(x).replace(/</g,'&lt;'),S:{threads:{t:th},lang:'zh'},curT:'t',cmode:'say',busy:false,save(){},$(){return null},aiGate:()=>true,appendMsg:(t,m)=>t.msgs.push(m),reply:(t,c)=>calls.push(c),SENDQ:[],soft:(n,f)=>f(),setTimeout,toast(){}};
vm.createContext(ctx);vm.runInContext(helpers+'\n'+send,ctx);
for(const mode of ['say','act','think']){
 const text=mode+'内容',marked=ctx.playerMark146(text,mode);assert.equal(ctx.playerInput146(marked).mode,mode);assert.equal(ctx.playerInput146(marked).text,text);
 ctx.doSend(marked,'say',true);assert.equal(th.msgs.at(-1).k,mode);assert.equal(th.msgs.at(-1).txt,text);assert.equal(calls.at(-1).mode,mode);
 assert(ctx.suggestionHTML146({mode,text}).includes('data-input-kind="'+mode+'"'));assert.equal(ctx.playerMark146(marked,mode),marked);
}
assert.equal(ctx.playerMark146('','act'),'**');assert.equal(ctx.playerMark146('','think'),'（）');
assert.equal(ctx.playerInput146({mode:'think',text:'*仍是心声*'}).mode,'think');
assert.equal(ctx.suggestionValue146('[object Object]'),'');assert.equal(ctx.suggestionValue146({mode:'act',text:'看向诺亚'}),'*看向诺亚*');
ctx.busy=true;ctx.doSend('（这事还没弄清）','say');assert.equal(ctx.SENDQ.at(-1).mode,'think');assert.equal(th.msgs.at(-1).k,'think');
ctx.busy=false;const before=th.msgs.length;ctx.doSend('**','act');assert.equal(th.msgs.length,before);
const file=fs.readFileSync('source/src/app100_dialogue.js','utf8');assert(file.includes('suggestionRule146()'));assert(file.includes("PRIVATE THOUGHT"));assert(!source.includes('one in ( ) parentheses (the user stays silent'));
assert.equal(ctx.guidanceInput146('让诺亚解释那次签字。').mode,'act');assert.equal(ctx.guidanceInput146('要求海伦别碰记录匣。').text,'示意海伦别碰记录匣。');assert.equal(ctx.guidanceInput146('诺亚，请解释一下。').mode,'say');
const ta={value:'正文*',dataset:{inputKind146:'act'},selectionStart:0,setSelectionRange(){}};ctx.$=q=>q==='#cin'?ta:null;ctx.t=x=>x;ctx.cmode='act';ctx.composerMark146();assert.equal(ta.value,'*正文*');ta.value='*正文';ctx.composerMark146();assert.equal(ta.value,'*正文*');
ta.value='(';ta.dataset={};ctx.cmode='say';ctx.composerMark146();assert.equal(ta.value,'（）');assert.equal(ctx.cmode,'think');
const parser=require('../api/_scriptparse');const fixture=fs.readFileSync('tools/fixtures/manuscript-sample.txt','utf8'),out=parser.parseManuscript(fixture,{id:'typed-test'}),b=out.bible||out;assert.equal(b.experience.narration.schema,2);assert.equal(b.experience.narration.enabled,true);
console.log('Typed player input: three kinds, markers, empty input, queue, safe suggestion objects, private thought and future upload defaults passed.');
