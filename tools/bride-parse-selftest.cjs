const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),crypto=require('crypto');
const hooks={},ctx={console,window:{addEventListener(){}},MG100:[],MG_T:{},off94Feed:async()=>[],mgMatch(){return 'previous'},mgResult(){return 'previous'},openThread(){},packPrompt(){return ''},S:{mine:{worlds:{},chars:{}},art:{},threads:{},works:[]},LL:a=>a,Lz:o=>typeof o==='string'?o:o?.zh||'',me:()=>'',wd:id=>ctx.S.mine.worlds[id],ch:id=>ctx.S.mine.chars[id],PARSE:{use:(n,v)=>hooks[n]=v},packSt:()=>({}),save(){},pkSet(th,flags){th.pk.flags=th.pk.flags||{};for(const f of Array.isArray(flags)?flags:[flags])th.pk.flags[f]=1;}};
vm.createContext(ctx);let p=fs.readFileSync('source/src/app51_import.js','utf8');vm.runInContext(p.slice(0,p.indexOf('const PARSE =')),ctx);let o=fs.readFileSync('source/src/app94_official2.js','utf8');vm.runInContext(o.slice(0,o.indexOf('/* ---- build:')),ctx);vm.runInContext(o.slice(o.indexOf('function off94Build('),o.indexOf('/* scene art registered again')),ctx);

vm.runInContext(o.slice(o.indexOf('const YOU94 ='),o.indexOf('PARSE.use("app94:you94"')),ctx);
Object.assign(ctx,{off94Assets:async()=>({}),packModes(){},packOpen(){},packPick(){},packAdvanceChapter(){},stopResolve(){},reply:async()=>{},doSend(){},pkDirective(){return false;},PKREG:{add(){}},document:{createElement:()=>({}),head:{appendChild(){}}}});
for(const f of ['app161_bride_state.js','app161_bride_data.js','app161_bride.js'])vm.runInContext(fs.readFileSync('source/src/'+f,'utf8'),ctx);
let done=fs.readFileSync('source/src/app144_discfix.js','utf8'),ds=done.indexOf('(function () {',done.indexOf('每章要完成固定目标'));vm.runInContext(done.slice(ds,done.indexOf('/* ---- 运行时 ---- */',ds))+'})();',ctx);
const dir='content/official/brides-reckoning-v1/',r=JSON.parse(fs.readFileSync(dir+'release.json')),script=fs.readFileSync(dir+'script.md','utf8'),map=r.assets;
vm.runInContext('OFF94.cur={id:'+JSON.stringify(r.work_id)+'};OFF94.assets[OFF94.cur.id]='+JSON.stringify(map),ctx);
const doc=hooks['app163:done'].parse(t=>ctx.off94You94Parse(t=>ctx.off94Parse(ctx.imParseCore,t),t),script);assert.equal(doc.chapters.length,16);assert.equal(doc.scenes,64);assert.equal(doc.chars94.length,7);
const result=hooks['bride:authored'].build((d,a)=>hooks['app163:done'].build((d,a)=>ctx.off94You94Build((d,a)=>ctx.off94Build(ctx.imBuildCore,d,a),d,a),d,a),doc,'你');
const w=ctx.wd(result.wid);assert.equal(w.leads.length,0);assert.equal(w.pack.chapters.length,16);assert(w.cast.some(c=>ctx.ch(c).n==='艾莲娜'));
for(const ch of w.pack.chapters){assert(ch.strictDone);assert.equal(ch.done163.length,2);assert.equal(ch.beats.zh.length,4);assert(ch.beats.zh.every(b=>b[1]==='brideScene'));assert(!/%[0-9A-F]{2}/.test(ch.goal.zh));}
assert(w.you94);assert(ctx.packModes({...w,community:r.work_id})[0].as===w.you94);
assert.equal(ctx.ch(w.you94).g,'u');
console.log('Bride native import: real parser/build, 16 chapters / 64 scenes, 6 nonromantic cast + self, decoded goals and strict gates passed.');
