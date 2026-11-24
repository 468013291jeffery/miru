const fs=require('fs'),path=require('path'),crypto=require('crypto');
const dir='content/official/brides-reckoning-v1/',r=JSON.parse(fs.readFileSync(dir+'release.json'));
for(const f of JSON.parse(fs.readFileSync(dir+'media-hashes.json'))){const b=fs.readFileSync(f.path);if(crypto.createHash('sha256').update(b).digest('hex')!==f.sha256)throw Error('Media hash '+f.path);}
if(r.chapters.length!==16||r.chapters.some(c=>c.scenes.length!==4)||r.games.length!==32)throw Error('Structure drift');
const slim=JSON.parse(JSON.stringify(r));delete slim.endings_source;delete slim.truth;delete slim.rules;
fs.writeFileSync('source/src/app161_bride_data.js','var BRIDE_RELEASE='+JSON.stringify(slim)+';\nvar BRIDE_STATE=createBrideEngine(BRIDE_RELEASE);\n');
fs.writeFileSync('art/official/'+r.work_id+'.json',JSON.stringify(r.assets,null,2)+'\n');
console.log('Bride: 68 hashes, 16 chapters / 64 scenes / 32 optional games; generated runtime and canonical asset map.');
