const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const repo=path.resolve(process.argv[2]||process.cwd()),base=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(repo,p),'utf8');
let clock=1800000000000;const hooks={},directives={},ctx={console,Date:{now:()=>clock+=10000},Map,Set,TextDecoder,Uint8Array,window:{addEventListener(){}},S:{lang:'zh',mine:{worlds:{},chars:{}},art:{},threads:{},works:[]},LL:(a,b)=>ctx.S.lang==='zh'?a:b,CL:()=>ctx.S.lang,Lz:o=>typeof o==='string'?o:o?.[ctx.S.lang]||o?.en||o?.zh||'',PARSE:{use:(name,v)=>hooks[name]=v},PKREG:{add:(name,v)=>directives[name]=v},packSt:()=>({}),me:()=>'',save(){},off94Names(){},packLove(){},EN(){return 99},packPick(){},packPrompt(){return ''},pkSet(){},recorded(){},renderChat(){},speakersOf:t=>t.cast,castCardFace:()=>'',mgResult:()=>[],authoredText:(t,s)=>s,BGM_MOODS:{},BGM_NAME:{},SFX100:[],SFX_FILES:{},setTimeout(){},curT:null};
ctx.wd=id=>ctx.S.mine.worlds[id];ctx.ch=id=>ctx.S.mine.chars[id];vm.createContext(ctx);
const core=read('source/src/app51_import.js'),official=read('source/src/app94_official2.js'),done=read('source/src/app144_discfix.js');
vm.runInContext(core.slice(0,core.indexOf('const PARSE =')),ctx);
vm.runInContext(official.slice(0,official.indexOf('/* ---- build:')),ctx);
vm.runInContext(official.slice(official.indexOf('function off94Build('),official.indexOf('/* scene art registered again')),ctx);
vm.runInContext(official.slice(official.indexOf('const YOU94 ='),official.indexOf('PARSE.use("app94:you94"')),ctx);
const ds=done.indexOf('(function () {',done.indexOf('每章要完成固定目标')),de=done.indexOf('/* ---- 运行时 ---- */',ds);vm.runInContext(done.slice(ds,de)+'})();',ctx);
ctx.imParse=text=>hooks['app163:done'].parse(t=>ctx.off94You94Parse(t=>ctx.off94Parse(ctx.imParseCore,t),t),text);
ctx.imBuild=(doc,as)=>{let r=hooks['app163:done'].build((d,a)=>ctx.off94You94Build((d,a)=>ctx.off94Build(ctx.imBuildCore,d,a),d,a),doc,as);for(const name of ['native-v2:metadata','three-stories-v22:bindings'])if(hooks[name])r=hooks[name].build(()=>r,doc,as);return r;};
vm.runInContext(official.slice(official.indexOf('function off94MergeEn('),official.indexOf('/* grab the play response')),ctx);
vm.runInContext(read('source/src/app149_native_v2.js'),ctx);
const mod=done.indexOf('/* ===== mod196'),st=done.indexOf('(function () {',mod),en=done.indexOf('/* ===== mod197',st);vm.runInContext(done.slice(st,en),ctx);
vm.runInContext(read('source/src/app163_three_stories_v22.js'),ctx);
const reports=[];
for(const story of ['A_Forbidden_Brother','B_Devil_Knows_My_Name','C_Midnight_Confession']){
 const d=path.join(base,story,'integration'),release=JSON.parse(fs.readFileSync(path.join(d,'release.json'))),A=JSON.parse(fs.readFileSync(path.join(repo,'art/official/'+release.work_id+'.json')));
 vm.runInContext('OFF94.cur='+JSON.stringify({id:release.work_id})+';OFF94.assets[OFF94.cur.id]='+JSON.stringify(A),ctx);
 const P={meta:{as:'你'}};for(const [lang,loc] of [['zh','zh-CN'],['en','en-US'],['ja','ja-JP'],['ko','ko-KR'],['es','es-ES']])P['script'+(lang==='zh'?'':'_'+lang)]=fs.readFileSync(path.join(d,'script.'+loc+'.md'),'utf8');
 ctx.S.lang='zh';const r=ctx.imBuild(ctx.imParse(P.script),'你'),w=ctx.wd(r.wid);w.community=release.work_id;w.official76=1;ctx.off94MergeEn(w.id,P);
 const ids=new Set(w.cast);assert.equal(w.pack.chapters.length,16);assert(w.pack.nativeV2);assert.equal(w.leads.length,A.v22.characters.filter(c=>c.romanceable).length);
 for(const lang of ['zh','en','ja','ko','es']){ctx.S.lang=lang;ctx.off94Names();let scenes=0,games=0,music=0,lines=0;
  function walk(rows){for(const b of rows||[]){if(!Array.isArray(b))continue;const d=b[2];if(!['n','sys'].includes(b[0])){assert(ids.has(b[0]),story+'/'+lang+' orphan '+b[0]);lines++;}if(b[0]==='sys'&&b[1]==='scene'){assert(d.src94);assert(Array.isArray(d.nativePresent));scenes++;}if(b[1]==='mg')games++;if(b[1]==='bgm'){assert(ctx.window.BGM_FILES[d.m]);music++;}if(d&&typeof d==='object'){walk(d.then);walk(d.else);for(const o of d.opts||[])walk(o.then);}}}
  for(const c of w.pack.chapters){walk(c.beats[lang]);assert.equal(c.done163Locales[lang].length,2);for(const o of c.choices)walk(o.then[lang]);}
  assert.equal(scenes,48);assert.equal(games,32);assert.equal(music,48);assert(lines>80);
  for(const id of w.cast){const role=A.v22.characters.find(x=>x.canonical===ctx.ch(id)?.n94?.zh);if(role){assert.equal(ctx.ch(id).n,role.names[lang]||role.names.en);assert.equal(ctx.ch(id).romanceable,role.romanceable);}}
  const end=w.pack.chapters[15].choices;assert(end.find(o=>o.k==='C').set.includes('ending_open'));reports.push({story,language:lang,scenes,games,music,spoken_lines:lines,orphan_actors:0,role_names_bound:true,neutral_fallback:true});
 }
}
fs.writeFileSync(path.join(__dirname,'multilingual-runtime.json'),JSON.stringify({passed:true,checks:reports},null,2)+'\n');console.log('Actual native v2 and mod196 merge: 3 stories × 5 app languages; 720 scenes, 480 games, media, localized actors, goals and neutral endings verified. Traditional Chinese is delivered as its full source/import and linked admin draft; the app currently exposes five language choices.');
