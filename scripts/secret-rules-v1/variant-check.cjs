const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert/strict');const root=process.argv[2],wid=process.argv[3],b=JSON.parse(fs.readFileSync(path.join(root,'art/official/'+wid+'.bible.json'))),src=fs.readFileSync(path.join(root,'source/src/app98_story.js'),'utf8'),ctx={wd:()=>({}),bOf98:()=>b};vm.createContext(ctx);vm.runInContext(src.slice(src.indexOf('function scene98('),src.indexOf('function byKey98(')),ctx);
function scene(ch,sc,picked){return ctx.scene98({wid:'w',b98:{ch,sc,picked}});}
const before=JSON.stringify(b);
assert.equal(scene(1,3,{c01s03:2}).s.present.length,0);assert.equal(scene(3,0,{c01s03:2}).s.backgroundKey,'CHAR_PLAYER_SOLO_v1');assert.equal(scene(3,0,{c01s03:2}).c.introduction.lines.length,0);
assert.equal(scene(13,3,{c01s03:2,c13s03:0}).s.present[0],'c01');assert.equal(scene(14,0,{c13s03:1}).s.present.length,0);
assert.equal(scene(18,0,{c13s03:0,c17s03:2}).s.present.length,0);assert.equal(scene(18,0,{c13s03:0,c17s03:0}).s.present[0],'c01');
assert(!scene(12,2,{c04s03:2}).s.ref_lines.some(r=>r.line.includes('SP')));
assert(!scene(4,2,{c03s03:1}).s.ref_lines.some(r=>/SP|私密/.test(r.line)));assert(scene(4,0,{c03s03:2}).c.introduction.text.includes('不谈私人'));
assert(b.chapters[14].done[1].criterion.includes('预约报告'));assert(b.chapters[15].done[1].criterion.includes('材料不足项清单'));
assert.equal(scene(9,0,{c01s03:2}).s.present.length,0);
assert.equal(JSON.stringify(b),before);const saved=JSON.parse(JSON.stringify({c13s03:1,c17s03:2}));assert.equal(scene(18,0,saved).s.present.length,0);
assert(b.chapters[11].done[1].criterion.includes('不必读信或双方谈妥'));
console.log('PASS: independent route, no forced reunion, explicit rehire, solo submission, no unsolicited SP anchor, persistence and immutable source');
