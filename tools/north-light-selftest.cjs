const fs=require('fs'),assert=require('node:assert/strict'),crypto=require('crypto'),{execFileSync}=require('child_process');
const wid='w_scmwaymue65be8983c9b',dir='scripts/north-light-v1/',file='art/official/'+wid+'.bible.json';
const original=fs.readFileSync(dir+'北灯未熄_八章重写版.txt','utf8'),reviewed=fs.readFileSync(dir+'story-reviewed.txt','utf8'),b=JSON.parse(fs.readFileSync(file));
const intro=reviewed.split('故事背景 玩家进入时首先看到\n\n')[1].split('\n玩家身份')[0].trim();assert.equal(b.intro.zh,intro);assert.equal(b.premise.zh,intro);assert.equal(b.sourceContract.introChars,Array.from(intro).length);assert.equal(intro.split(/\n\s*\n/).length,7);for(const fact of ['第十二天','二十六岁','半年前','十一名','诺亚','伊莱','玛拉','海伦','二十四人','三格电'])assert(intro.includes(fact),fact);
assert.equal(crypto.createHash('sha256').update(reviewed).digest('hex'),b.sourceContract.sourceSha256);
const scenes=b.chapters.flatMap(c=>c.scenes);assert.equal(scenes.length,16);assert.equal(scenes.filter(s=>s.game).length,9);assert.equal(scenes.flatMap(s=>s.authored_dialogue).length,150);assert.equal(scenes.flatMap(s=>s.ref_lines).length,87);
for(const p of b.cast){assert.notEqual(p.voice,p.role.zh);assert(p.knows.length>30);assert(p.sample_lines.length>=5);if(p.romanceable)assert(p.flirt&&p.arc&&p.when_asked);}
const ai=b.cast.find(p=>p.key==='c05');assert.equal(ai.entity,'system');assert.equal(ai.age,null);assert.equal(ai.romanceable,false);
for(const s of scenes){for(const key of s.present)assert(s.actor_payload[key],s.id+' missing task '+key);for(const l of s.ref_lines)assert(s.present.includes(l.who));}
assert(!scenes.find(s=>s.id==='c06s02').ref_lines.length);assert(!scenes.find(s=>s.id==='c08s01').ref_lines.length);assert(scenes.find(s=>s.id==='c05s02').choice.options.length===3);
assert.deepEqual(scenes.find(s=>s.id==='c07s01').choice.options.map(o=>o.state.authoredRoute),['A','B','C','A']);
const {checkBible}=require('../api/_stylecheck');assert.deepEqual(checkBible(b).err,[]);
const damaged=JSON.parse(JSON.stringify(b));damaged.intro.zh='被误压缩';assert(checkBible(damaged).err.some(x=>x.includes('原稿')));
const dropped=JSON.parse(JSON.stringify(b));dropped.chapters[0].scenes[0].authored_dialogue=[];assert(checkBible(dropped).err.some(x=>x.includes('对白')));
// Compiling twice must be stable: prevents accidental handwritten output drifting from source.
const before=fs.readFileSync(file,'utf8');execFileSync(process.env.PYTHON||'python3',['tools/rebuild-north-light.py']);assert.equal(fs.readFileSync(file,'utf8'),before);
console.log('North Light fidelity: complete seven-paragraph reviewed background; 150 dialogue lines, 87 anchors, 16 distinct scene tasks, nine games, route choices and repeatable import passed.');
