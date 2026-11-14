const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),base=path.join(root,'scripts/spp-v5'),id='w_scmw9biwsq6dcfcceb84';
let text=fs.readFileSync(path.join(base,'SPP_谁是S++_完整整合本_v6.md'),'utf8');
// Normalize the author's single-line identity into the parser's explicit subfields.
text=text.replace(/【玩家身份】([^\n]+)/,(_,v)=>'【玩家身份】性别：女\n身份：Vera Kessler，26岁，纽约艺术品保险估价师。\n处境：'+v.replace(/^性别：女。/,''));
const r=require('../api/_scriptparse').parseManuscript(text,{id});
// The author explicitly requests free conversation without canned invitations or options.
// Retain empty interaction fields; do not fabricate dialogue to satisfy template UI defaults.
const errors=r.err.filter(e=>!/^第 \d+ 章第 \d+ 场：缺【(?:眼前邀请|开场建议)】$/.test(e));
assert.deepEqual(errors,[]);const b=r.bible;
b.contentRevision='spp-v5-20261114';b.openingMedia={slot:'opening_video'};
b.player.age=26;b.dialoguePolicy={schema:1,plainLanguage:true,maxChars:180};
b.dialogueStyle='只输出人物真实说出的话和可感知动作。设定、程序字段、图片描述、评分规则、导演任务、提示词均是内部资料，禁止朗读或变为旁白。一次只回应当前输入，不替玩家发言或决定。';
const mapping=JSON.parse(fs.readFileSync(path.join(base,'asset_mapping_v5.json'))).slots;
mapping.cover='assets/cover/cover.jpg';mapping.opening_video='谁是s++预告片.mp4';mapping.home_video=mapping.vid_open=mapping.opening_video;
const registry=JSON.parse(fs.readFileSync(path.join(base,'character_registry_v5.json')));
for(const c of registry){assert.equal(b.cast.find(x=>x.key===c.key).short.zh,c.name);mapping['char_'+c.key]=c.avatar_path;mapping['char_'+c.name]=c.avatar_path;}
// Package maps the added prologue and the new Emeka chapter explicitly.
for(const img of r.images)assert(mapping[img.slot],img.slot+' mapping absent');
const result={};for(const [slot,value]of Object.entries(mapping)){const v=Array.isArray(value)?value[0]:value;assert(fs.statSync(path.join(base,v)).size>0,slot);result[slot]='/scripts/spp-v5/'+v.split('/').map(encodeURIComponent).join('/');}
assert.equal(b.cast.length,20);assert.equal(b.chapters.length,19);assert.equal(b.chapters.reduce((n,c)=>n+c.scenes.length,0),118);
assert.equal(b.cast.filter(c=>c.tier==='lead'&&c.romanceable).length,18);
for(const c of b.chapters)for(const s of c.scenes){assert(s.present.every(k=>b.cast.some(x=>x.key===k)));assert(result['bg_'+s.id]);assert.equal(s.ref_lines.length,0);}
const style=require('../api/_stylecheck').checkBible(b);assert.deepEqual(style.err,[]);
for(const [name,data]of [[id+'.bible.json',b],[id+'.json',result]])fs.writeFileSync(path.join(root,'art/official',name),JSON.stringify(data,null,2)+'\n');
console.log(JSON.stringify({chapters:b.chapters.length,scenes:118,cast:20,leads:18,slots:Object.keys(result).length,styleWarnings:style.warn,omittedOptionalTemplateFields:r.err.length,warnings:r.warn.length}));
