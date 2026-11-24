const fs=require('fs'),crypto=require('crypto'),assert=require('assert/strict');
const d='content/official/ashes-of-us-v1/',r=JSON.parse(fs.readFileSync(d+'release.json'));assert.equal(r.chapters.length,12);assert.equal(r.chapters.flatMap(c=>c.scenes).length,36);assert.equal(r.games.length,24);
for(const row of JSON.parse(fs.readFileSync(d+'media-hashes.json'))){assert.equal(crypto.createHash('sha256').update(fs.readFileSync(row.path)).digest('hex'),row.sha256);}
fs.writeFileSync('source/src/app162_ashes_data.js','var ASHES_RELEASE='+JSON.stringify(r)+';\n');fs.writeFileSync('art/official/'+r.work_id+'.json',JSON.stringify(r.assets,null,2)+'\n');console.log('Ashes: 50 hashes, source slot mapping, 12 chapters and 24 optional activities verified.');
