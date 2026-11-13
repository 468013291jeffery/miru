const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),base='art/official/m110-empress/',m=JSON.parse(fs.readFileSync(root+'/'+base+'manifest.json'));
assert.equal(m.images.length,48);assert.equal(m.clips.length,122);assert.equal(m.music.length,8);assert.equal(m.sfx.length,13);
const files=[...m.images.map(x=>({...x,file:base+x.file})),...m.clips.map(x=>({...x,file:base+'voice/'+x.file})),...m.music.concat(m.sfx).map(x=>({...x,file:base+'audio/'+x.file})),m.video];
for(const x of files){assert(x.sha256,x.file);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(root+'/'+x.file)).digest('hex'),x.sha256,x.file);}
assert.equal(files.length,192);assert.equal(new Set(m.images.map(x=>x.sha256)).size,48);
assert.deepEqual(JSON.parse(fs.readFileSync(root+'/content/official/m110-empress/media.json')),m);
console.log('Empress release: all 192 final media files and matching manifests verified.');
