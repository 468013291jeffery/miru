const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict'),cp=require('node:child_process');
const repo=path.resolve(process.argv[2]||process.cwd()),base=path.resolve(__dirname,'..'),relative=p=>path.relative(repo,p).split(path.sep).join('/');
const read=p=>fs.readFileSync(path.join(repo,p),'utf8'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const {dslQA}=require(path.join(repo,'api/_dslqa.js')),{checkDsl}=require(path.join(repo,'api/_stylecheck.js'));
const lib=read('api/_lib.js');
const safety=vm.runInNewContext(lib.slice(lib.indexOf('const EXPLICIT ='),lib.indexOf('function structureQA('))+'\nsafety',{});
let clock=1800000000000;
const hooks={},ctx={console,Date:{now:()=>clock+=10000},window:{addEventListener(){}},S:{mine:{worlds:{},chars:{}},art:{},threads:{},works:[]},LL:a=>a,Lz:o=>typeof o==='string'?o:o?.zh||'',PARSE:{use:(name,v)=>hooks[name]=v},packSt:()=>({}),me:()=>'',save(){}};
ctx.wd=id=>ctx.S.mine.worlds[id];ctx.ch=id=>ctx.S.mine.chars[id];
vm.createContext(ctx);
const core=read('source/src/app51_import.js'),official=read('source/src/app94_official2.js'),done=read('source/src/app144_discfix.js');
assert(core.includes('const PARSE ='));assert(official.includes('/* ---- build:'));
vm.runInContext(core.slice(0,core.indexOf('const PARSE =')),ctx);
vm.runInContext(official.slice(0,official.indexOf('/* ---- build:')),ctx);
vm.runInContext(official.slice(official.indexOf('function off94Build('),official.indexOf('/* scene art registered again')),ctx);
vm.runInContext(official.slice(official.indexOf('const YOU94 ='),official.indexOf('PARSE.use("app94:you94"')),ctx);
const ds=done.indexOf('(function () {',done.indexOf('每章要完成固定目标')),de=done.indexOf('/* ---- 运行时 ---- */',ds);
assert(ds>=0&&de>ds);vm.runInContext(done.slice(ds,de)+'})();',ctx);assert(hooks['app163:done']?.parse);
const result={repository:'468013291jeffery/miru',baseline_commit:cp.execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim(),checks:{source_package_checksums:true,image_and_audio_paths:true,native_parser_structure:true},stories:[],release_blockers:[],limits:['This is repository/asset and real-parser acceptance, not a live player or AI conversation test.','The published admin auto-review policy requires two games per chapter as of 2026-11-27.','This report validates revised source and derived bindings; live publication has a separate post-release report.']};
result.baseline_files=Object.fromEntries(['api/_dslqa.js','api/_lib.js','api/_stylecheck.js','api/admin.js','source/src/app51_import.js','source/src/app94_official2.js','source/src/app144_discfix.js'].map(p=>[p,sha(fs.readFileSync(path.join(repo,p)))]));
let images=0,audio=0,scripts=0,chapters=0,scenes=0;
for(const line of fs.readFileSync(path.join(base,'SHA256SUMS.txt'),'utf8').trim().split('\n')){
  const [want,file]=line.split('  ');assert.equal(sha(fs.readFileSync(path.join(base,file))),want,file+' checksum changed');
}
for(const story of ['A_Forbidden_Brother','B_Devil_Knows_My_Name','C_Midnight_Confession']){
  const dir=path.join(base,story),assets=JSON.parse(fs.readFileSync(path.join(dir,'production/asset_manifest.json'))),map={};
  for(const a of assets){const p=path.join(dir,a.file);assert(fs.statSync(p).size>0,a.id+' absent');map[a.id]=relative(p);
    if(['cover','character','scene_bg'].includes(a.kind)){images++;assert.equal(sha(fs.readFileSync(p)),a.sha256_webp);assert.equal(sha(fs.readFileSync(path.join(dir,a.master_file))),a.sha256_jpg);}
    else{audio++;assert.equal(sha(fs.readFileSync(p)),a.audio_spec.sha256);assert(fs.existsSync(path.join(dir,a.runtime_mp3)));}
  }
  const cover=assets.find(a=>a.kind==='cover');map.cover=map[cover.id];
  const integration=path.join(dir,'integration');fs.mkdirSync(integration,{recursive:true});fs.writeFileSync(path.join(integration,'asset-map.json'),JSON.stringify(map,null,2)+'\n');
  vm.runInContext('OFF94.cur={id:'+JSON.stringify(story)+'};OFF94.assets[OFF94.cur.id]='+JSON.stringify(map),ctx);
  const perStory={story,images:assets.filter(a=>['cover','character','scene_bg'].includes(a.kind)).length,locales:[]};
  for(const locale of ['zh-CN','zh-TW','en-US','ja-JP','ko-KR','es-ES']){
    const file=path.join(dir,'locales',locale,'script.md'),text=fs.readFileSync(file,'utf8'),q=dslQA(text),safetyErrors=safety([text]);assert.equal(safetyErrors.length,0,story+'/'+locale+' content gate');
    const doc=hooks['app163:done'].parse(t=>ctx.off94You94Parse(t=>ctx.off94Parse(ctx.imParseCore,t),t),text);
    assert.equal(q.err.length,0,story+'/'+locale+': '+q.err.join(';'));
    assert.equal(doc.chapters.length,16);assert.equal(doc.scenes,48);assert.equal(doc.choices,16);
    const slots=[...text.matchAll(/⟦BG\|([^|⟧]+)/g)].map(m=>m[1]);assert.equal(slots.length,48);assert(slots.every(id=>map[id]));
    const missingGames=q.perCh.filter(c=>c.mg<2).map(c=>({chapter:c.n,games:c.mg,required:2}));
    const counts=(doc.done163||[]).map(a=>a.length);assert.equal(counts.length,16);assert(counts.every(n=>n===2));
    const gameIds=[...text.matchAll(/⟦MG\|([^|⟧]+)/g)].map(m=>decodeURIComponent(m[1]));
    const library=read('source/src/app60_games100.js');for(const id of gameIds)assert(library.includes(id.replace(/^g_/, '')+'|'),'unregistered game '+id);
    assert.equal(gameIds.length,32,story+'/'+locale+' needs exactly 32 explicit games');
    const r={locale,script:relative(file),dsl_errors:q.err,dsl_warnings:q.warn,native_chapters:doc.chapters.length,native_scenes:doc.scenes,native_choices:doc.choices,native_lines:doc.lines,omitted_passages:doc.omit,native_cast:doc.cast,native_inferred_player:doc.pov||null,inline_character_cards:(doc.chars94||[]).length,inline_orientation:doc.orient94||null,done_conditions_per_chapter:counts,chapter_game_deficits:missingGames,sha256:sha(fs.readFileSync(file))};
    if(doc.omit)result.release_blockers.push({story,locale,type:'parser_omitted_passages',count:doc.omit});
    if(missingGames.length)result.release_blockers.push({story,locale,type:'chapter_games_missing',chapters:missingGames.length,tag_instances_missing:missingGames.reduce((n,c)=>n+2-c.games,0)});
    if((doc.chars94||[]).length===0)r.import_metadata_binding_required=true;
    const adapted=fs.readFileSync(path.join(integration,'script.'+locale+'.md'),'utf8'),amap=JSON.parse(fs.readFileSync(path.join(integration,'assets.'+locale+'.json')));
    vm.runInContext('OFF94.assets[OFF94.cur.id]='+JSON.stringify(amap),ctx);
    const adoc=hooks['app163:done'].parse(t=>ctx.off94You94Parse(t=>ctx.off94Parse(ctx.imParseCore,t),t),adapted);
    assert.equal(adoc.pov,'你');assert.equal(adoc.orient94,'bg');assert(!adoc.cast.some(n=>/TIME|ナレーション|내레이션|Narration|Narración/.test(n)));
    const built=hooks['app163:done'].build((d,a)=>ctx.off94You94Build((d,a)=>ctx.off94Build(ctx.imBuildCore,d,a),d,a),adoc,'你'),w=ctx.wd(built.wid);
    assert(w.you94);assert.equal(w.or,'bg');assert.equal(w.pack.chapters.length,16);
    let boundScenes=0,builtGames=0,builtMusic=0;for(const c of w.pack.chapters){assert.equal(c.done163.length,2);assert.equal(c.choices.length,3);for(const b of c.beats.zh){if(Array.isArray(b)&&b[0]==='sys'&&b[1]==='mg')builtGames++;if(Array.isArray(b)&&b[0]==='sys'&&b[1]==='bgm')builtMusic++;if(Array.isArray(b)&&b[0]==='sys'&&b[1]==='scene'){assert(b[2].time);assert(b[2].src94);boundScenes++;}}}assert.equal(boundScenes,48);assert.equal(builtGames,32);assert.equal(builtMusic,48);assert(w.pack.chapters[15].choices.find(o=>o.k==='C').set.includes('ending_open'));
    const castIds=new Set(w.cast);function walk(rows){for(const b of rows||[]){if(!Array.isArray(b))continue;if(!['sys','n'].includes(b[0]))assert(castIds.has(b[0]),'orphan actor '+b[0]);const d=b[2];if(d&&typeof d==='object'){walk(d.then);walk(d.else);for(const o of d.opts||[])walk(o.then);}}}for(const c of w.pack.chapters){walk(c.beats.zh);for(const o of c.choices)walk(o.then.zh);}
    for(const id of w.cast.filter(id=>(adoc.chars94||[]).some(a=>a[0]===ctx.ch(id)?.n)||id===w.you94))assert(ctx.S.art[id],'Missing cast portrait');
    const style=checkDsl(adapted);r.derived_import={script:relative(path.join(integration,'script.'+locale+'.md')),player:adoc.pov,orient:w.or,scenes_with_time_and_bound_image:boundScenes,built_games:builtGames,built_music_cues:builtMusic,neutral_fallback_ending:true,orphan_actors:0,done_per_chapter:2,chapter_ending_choices:3,safety_errors:safetyErrors,style_errors:style.err,style_warnings:style.warn};
    if(style.err.length)result.release_blockers.push({story,locale,type:'style_errors',errors:style.err});
    if(locale==='zh-CN')perStory.zh_source_nonempty_lines=text.split('\n').filter(l=>l.trim()).length;
    if(['en-US','ja-JP','ko-KR','es-ES'].includes(locale)){const n=text.split('\n').filter(l=>l.trim()).length;r.source_nonempty_lines=n;if(Math.abs(n-perStory.zh_source_nonempty_lines)>2)result.release_blockers.push({story,locale,type:'translation_line_alignment',chinese_lines:perStory.zh_source_nonempty_lines,localized_lines:n});}
    perStory.locales.push(r);scripts++;chapters+=doc.chapters.length;scenes+=doc.scenes;
  }

  result.stories.push(perStory);
}
assert.equal(images,163);assert.equal(audio,18);assert.equal(scripts,18);
result.totals={images,audio,scripts,localized_chapters:chapters,localized_scenes:scenes};
result.canonical_game_instances_missing=result.release_blockers.filter(x=>x.type==='chapter_games_missing'&&x.locale==='zh-CN').reduce((n,x)=>n+x.tag_instances_missing,0);
result.release_ready=result.release_blockers.length===0;
result.repository_asset_checks_passed=true;
fs.writeFileSync(path.join(__dirname,'repository-acceptance.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({repository_asset_checks_passed:true,release_ready:result.release_ready,totals:result.totals,release_blocker_records:result.release_blockers.length,canonical_game_instances_missing:result.canonical_game_instances_missing,omitted:result.release_blockers.filter(x=>x.type==='parser_omitted_passages'),report:relative(path.join(__dirname,'repository-acceptance.json'))},null,2));
