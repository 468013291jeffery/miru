const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const b=JSON.parse(fs.readFileSync('art/official/w_scmw9biwsq6dcfcceb84.bible.json'));
const src=fs.readFileSync('source/src/app101_you.js','utf8'),fn=src.slice(src.indexOf('  function leadsOf(w)'),src.indexOf('  function leadsHTML(w)'));
const ids=b.cast.map(c=>c.key),ctx={ch:id=>b.cast.find(c=>c.key===id),povOf:()=> 'me',bOf98:()=>b,cid98:(w,k)=>k};vm.createContext(ctx);vm.runInContext(fn,ctx);
const result=ctx.leadsOf({id:'spp',cast:['me',...ids]});assert.equal(result.length,18);assert(!result.includes('c19'));assert(!result.includes('c20'));assert.equal(new Set(result).size,18);
const explicit=ctx.leadsOf({id:'spp',cast:ids,leads:result});assert.equal(explicit.length,18);
console.log('Introduction shows all 18 authored male leads, excludes both supporting roles, and handles cached worlds.');
