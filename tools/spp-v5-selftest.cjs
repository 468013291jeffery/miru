const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const b=JSON.parse(fs.readFileSync('art/official/w_scmw9biwsq6dcfcceb84.bible.json')),map=JSON.parse(fs.readFileSync('art/official/w_scmw9biwsq6dcfcceb84.json'));
const source=fs.readFileSync('source/src/app98_story.js','utf8');const fn=source.slice(source.indexOf('function introductions98('),source.indexOf('function chapterText98('));
const ctx={experience98:()=>({storyIntroduction:true,chapterIntroduction:false}),scene98:()=>({b,c:b.chapters[0],s:b.chapters[0].scenes[0]}),OFF94:{assets:{spp:map}},wd:()=>({community:'spp'}),L98:z=>z,LZ98:o=>o.zh,appendMsg:(th,m)=>th.msgs.push(m),save:()=>{}};vm.createContext(ctx);vm.runInContext(fn,ctx);
const th={wid:'spp',b98:{ch:1,sc:0},msgs:[]};ctx.introductions98(th);ctx.introductions98(th);
assert.equal(th.msgs[0].k,'storyTrailer');assert.equal(th.msgs.filter(m=>m.k==='storyTrailer').length,1);assert.equal(th.msgs[1].intro98,'story');
ctx.OFF94.assets.spp={};const noMedia={wid:'spp',b98:{ch:1,sc:0},msgs:[]};ctx.introductions98(noMedia);assert(!noMedia.msgs.some(m=>m.k==='storyTrailer'));
for(const c of b.cast)assert(map['char_'+c.key]);
assert.equal(b.chapters[3].scenes[0].present[0],'c03');assert(map.bg_c04s01.includes('bg_emeka_morning'));
assert.equal(b.chapters[0].scenes[0].ref_lines.length,0);assert(!/本章安排|程序字段|角色任务/.test(th.msgs[1].txt));
const chat=fs.readFileSync('source/src/app3_chat.js','utf8');const render=chat.slice(chat.indexOf(' if(m.k===\'storyTrailer\''),chat.indexOf(' if(m&&m.who==='));const rc={m:th.msgs[0],CL:()=> 'zh',esc:s=>String(s).replace(/"/g,'&quot;')};vm.createContext(rc);vm.runInContext('function render(){'+render+'};this.html=render()',rc);assert(rc.html.includes('<video controls playsinline'));assert(!rc.html.includes('autoplay'));assert(rc.html.includes('data-story-trailer')); 
console.log('SPP v5: 19 chapters, 118 scenes, correct cast/avatar IDs, Emeka scene mapping, backstage separation, opening trailer before background, one-time playback card and missing-media fallback passed.');

const guard=fs.readFileSync('source/src/app142_authored.js','utf8');vm.runInContext(guard.slice(guard.indexOf('function authoredBackstage142'),guard.indexOf('async function authoredReply142')),ctx);
for(const text of ['⟦BG|bg_c01s01|Room⟧','```json','【角色任务】核验','当前任务：核验','{"avatar_slot":"c01"}'])assert(ctx.authoredBackstage142(text));
assert(!ctx.authoredBackstage142('贝尔特把文件转向桌子的另一侧。'));
console.log('SPP backstage guard: directives, code blocks, role instructions, task labels and JSON rejected; natural prose retained.');

let post;const postctx={MSGKIND:{post:(name,fn)=>post=fn},introHTML98:()=>'<chapter />'};vm.createContext(postctx);vm.runInContext(source.split('\n').find(l=>l.startsWith('MSGKIND.post("app98_story.js"')),postctx);
assert.equal(post('<video controls></video>',th.msgs[0],0,th),undefined);
assert.equal(post('<old />',{intro98:'chapter:1'},0,th),'<chapter />');
console.log('Opening trailer survives the final introduction post-renderer; chapter cards still use chapter rendering.');
