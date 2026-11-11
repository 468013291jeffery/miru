
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),meta=JSON.parse(fs.readFileSync(process.argv[2])),src=fs.readFileSync('scripts/zero-crown-v3/story_import_v3.txt','utf8');
const {parseManuscript}=require('../api/_scriptparse'),{checkBible,checkDsl}=require('../api/_stylecheck'),{dslQA}=require('../api/_dslqa');
const r=parseManuscript(src,{id:meta.work_id}),st=checkBible(r.bible);assert.equal(r.err.concat(st.err).length,0,JSON.stringify(r.err.concat(st.err)));
assert.equal(r.images.length,32);assert.equal(r.bible.chapters.length,8);assert.equal(r.stats.options,32);assert.equal(r.stats.endings,7);
const b=require('./build-narration145.cjs').apply(r.bible),base='https://miru.plus/art/official/zero-crown/v3.0.0/',map={};
for(const i of r.images)map[i.slot]=base+i.slot+'.webp';
map.poster=map.cover;map.home_video=base+'opening-en-20261110.mp4';
const files=fs.readdirSync('art/official/zero-crown/v3.0.0');
for(const c of b.chapters){const s=c.scenes[0],n=String(c.n).padStart(2,'0'),f=files.find(x=>x.startsWith('chapter_'+n+'_')&&x.endsWith('.mp3'));assert(f);map['bgm_'+s.id]=base+f;s.bgm='zero_crown_'+n;}
const clean=t=>String(t||'').replace(/[|⟦⟧]/g,' ').replace(/\n+/g,' ');
const chapters=b.chapters.map((c,i)=>{
 const s=c.scenes[0],rows=['# CHAPTER '+c.n+'｜'+c.title.zh];
 if(!i){rows.push('⟦ORIENT|bg⟧','⟦CHAR|你|f|25||'+clean(b.player.role.zh)+'|作为你自己参与故事⟧');
  for(const p of b.cast)rows.push('⟦CHAR|'+clean(p.short.zh)+'|'+p.gender+'|'+p.age+'||'+clean(p.role.zh)+'|'+clean(p.bio)+'⟧');}
 rows.push('⟦GOAL|'+clean(c.goal)+'⟧','# SCENE｜'+clean(s.place.zh),'⟦BG|bg_'+s.id+'⟧','⟦TIME|'+clean(c.introduction.time)+'⟧');
 if(!i)rows.push('⟦VIDEO|home_video⟧','旁白：'+clean(b.intro.zh));
 rows.push('旁白：'+clean(c.introduction.text));
 for(const l of c.introduction.lines||[])rows.push(b.cast.find(p=>p.key===l.who).short.zh+'：“'+clean(l.say)+'”');
 rows.push('⟦FREE|'+clean(s.interaction.invitation)+'|'+s.interaction.suggestions.map(clean).join('|')+'⟧','# CHOICE｜你想怎么做？');
 for(const [j,o]of s.choice.options.entries())rows.push('#### '+String.fromCharCode(65+j)+'｜'+clean(o.t),'旁白：'+clean(o.effect));
 rows.push('# ·');return {n:c.n,t:c.title.zh,md:rows.join('\n')};
});
const md='# '+b.title.zh+'\n\n'+chapters.map(c=>c.md).join('\n\n'),qa=dslQA(md),ds=checkDsl(md);assert.equal(qa.err.concat(ds.err).length,0,JSON.stringify(qa.err.concat(ds.err)));
const config={hook:b.hook.zh,premise:b.premise.zh,you:b.player.role.zh,tags:b.tags,cover:map.cover,adult:false};
const payload={id:meta.id,title:b.title.zh,orient:b.orient,lang:'zh',chapters,config};
fs.mkdirSync('content/official/zero-crown-v3',{recursive:true});
for(const [p,v]of [
 ['art/official/'+meta.work_id+'.bible.json',b],['art/official/'+meta.work_id+'.json',map],
 ['scripts/zero-crown-v3/admin-import.json',payload],['scripts/zero-crown-v3/image-slots.json',r.images],
 ['content/official/zero-crown-v3/release.json',{...meta,title:b.title.zh,source_sha256:require('crypto').createHash('sha256').update(src).digest('hex'),stats:r.stats}],
 ['scripts/zero-crown-v3/qa.json',{manuscript:{errors:r.err.concat(st.err),warnings:r.warn.concat(st.warn)},dsl:qa,style:ds}]
])fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const leads=JSON.parse(fs.readFileSync('art/official/leads.json')),entry={wid:meta.work_id,title:b.title,leads:b.cast.filter(c=>c.romanceable&&c.tier==='lead').map((c,i)=>({key:c.key,n:c.name,g:c.gender,age:c.age,h:'',voice:'m'+(i+1),art:map['char_'+c.key],pal:['#BDA67C','#17142A'],role:c.role,looks:{zh:c.bio,en:c.bio},vibe:{zh:c.personality.slice(0,100),en:c.personality.slice(0,100)},pitch:{zh:c.hooks.slice(0,100),en:c.hooks.slice(0,100)},solo:{zh:c.sample_lines[0],en:c.sample_lines[0]}}))};
const idx=leads.works.findIndex(w=>w.wid===meta.work_id);if(idx<0)leads.works.push(entry);else leads.works[idx]=entry;
fs.writeFileSync('art/official/leads.json',JSON.stringify(leads,null,2)+'\n');
console.log(JSON.stringify({stats:r.stats,images:Object.keys(map).length,games:b.chapters.filter(c=>c.scenes[0].game).length,work_id:meta.work_id,errors:0,warnings:r.warn.concat(st.warn).length}));
