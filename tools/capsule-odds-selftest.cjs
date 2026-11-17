const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('source/src/app6_games.js','utf8'),i18n=fs.readFileSync('source/src/app8_i18n.js','utf8');
const start=src.indexOf('function gCapsule()'),end=src.indexOf('/* ---------- 4.',start),part=src.slice(start,end);
function run(day,who,kind,lang='en'){
 const handlers={},paid=[],result=[],draws=[who,kind];let html='';
 const node={classList:{add(){},remove(){}},style:{},disabled:false,innerHTML:''};
 const ctx={S:{capDay:day,lang},today:()=>'today',curPair:()=>['w','a','b'],t:k=>k==='gc.capHow'?(lang==='zh'?i18n.match(/"gc.capHow":"([^"]+)"/g)[1]:i18n.match(/"gc.capHow":"([^"]+)"/g)[0]):k,
 gScreen:(_t,h)=>html=h,document:{addEventListener:(k,h)=>handlers[k]=h},spend:(n,why)=>{paid.push([n,why]);return true},save(){},$:()=>node,
 Math:Object.assign(Object.create(Math),{random:()=>draws.shift()}),Date:{now:()=>123},hash:()=>0,ch:id=>({n:id,pitch:'voice',tells:{en:['secret'],zh:['secret']},twist:'secret'}),Lz:x=>x,artSrc:id=>'photo-'+id,esc:x=>x,first:x=>x,gResult:(p,n,description,extra)=>result.push({description,extra}),speak(){},setTimeout:f=>f()};
 vm.runInNewContext(part,ctx);ctx.gCapsule();handlers.click({target:{closest:()=>true}});return {html,paid,result};
}
let n=0;
for(const lang of ['en','zh']){const r=run('',0,0,lang);assert.match(r.html,/1\/3/,'odds must be visible before spin in '+lang);assert.match(r.html,/1\/2/);assert.equal(r.paid.length,0);n++}
for(const [random,icon] of [[0,'🔊'],[.33334,'🤫'],[.66667,'📸'],[.99999,'📸']]){const r=run('today',0,random);assert(r.result[0].extra.includes(icon),'reward category must follow disclosed equal thirds');assert.deepEqual(r.paid,[[1,'img']]);n++}
for(const [random,character] of [[.49,'a'],[.5,'b']]){const r=run('today',random,.7);assert(r.result[0].description.includes(character));n++}
console.log('PASS '+n+' capsule odds, bilingual disclosure, free/paid price and reward boundaries');
