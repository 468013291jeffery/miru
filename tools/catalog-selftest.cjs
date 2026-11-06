const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const W=[{id:'heir'},{id:'m102'},{id:'landing'},{id:'kept'}];let entered=0,msg=0;
const c={allWorlds:()=>W,packWorlds:()=>W,feedList:()=>W,orOK:()=>true,allChars:()=>['old','new'],ch:id=>({w:id==='old'?'heir':'kept'}),openStory:()=>entered++,startSheet:()=>entered++,packStart:()=>entered++,toast:()=>msg++,CL:()=> 'zh',document:{addEventListener:()=>{},querySelectorAll:()=>[]}};
vm.createContext(c);vm.runInContext(fs.readFileSync('source/src/app129_catalog.js','utf8'),c);
assert.equal(c.allWorlds().length,1);assert.equal(c.packWorlds()[0].id,'kept');assert.equal(c.feedList()[0].id,'kept');assert.equal(c.orOK(W[0]),false);assert.equal(c.orOK(W[3]),true);assert.equal(c.allChars().join(','),'new');
for(const n of ['openStory','startSheet','packStart']){c[n]('heir');c[n]('kept')}
assert.equal(entered,3);assert.equal(msg,3);assert.equal(W.length,4);
console.log('Retired catalog filters, pinned feed, blocked new entries and preserved definitions passed.');
