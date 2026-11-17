import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import os from 'node:os';import {createHash} from 'node:crypto';import path from 'node:path';
import {prepare,nativeHTML} from './prepare-ios.mjs';
const root=await mkdtemp(path.join(os.tmpdir(),'miru-ios-package-'));
try{
 for(const dir of ['native','art','audio','video','content','scripts','icons','api','.private'])await mkdir(path.join(root,dir));
 for(const file of ['index.html','config.js','tune.js','pdfjs_embed.js','miru_rules.js','miru_dialogue_runtime.js','privacy.html','terms.html','contact.html','about.html','delete-account.html','manifest.webmanifest','native/ios-bootstrap.js'])await writeFile(path.join(root,file),'fixture');
 await mkdir(path.join(root,'art/ui'));await writeFile(path.join(root,'art/ui/facefinder'),'model');
 await writeFile(path.join(root,'art/cover.webp'),'image');
 await writeFile(path.join(root,'content/notes.md'),'internal');
 await writeFile(path.join(root,'api/private.js'),'secret');
 const a=await prepare(root),b=await prepare(root);assert.deepEqual(a,b);assert(a.includes('art/cover.webp'));assert(!a.includes('content/notes.md'));assert(!a.some(x=>x.startsWith('api/')));
 const html=nativeHTML('<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=test"></script><script src="config.js"></script>');
 assert(!html.includes('googlesyndication'));assert(html.indexOf('ios-bootstrap.js')<html.indexOf('config.js'));
 await assert.rejects(prepare(root,path.join(root,'elsewhere')),/Destination/);
 // Two tiers: chapter media and large video go to the server; covers, referenced pages and data stay bundled.
 for(const d of ['art/official/w1','scripts/game','video'])await mkdir(path.join(root,d),{recursive:true});
 await writeFile(path.join(root,'index.html'),'<script src="config.js"></script><script>open("/scripts/game/games.html");img.src="art/official/w1/hero.png";v.src="video/loop.mp4"</script>');
 await writeFile(path.join(root,'art/official/w1/scene01.png'),'scene');await writeFile(path.join(root,'art/official/w1/cover.png'),'cover');
 await writeFile(path.join(root,'art/official/w1/hero.png'),'hero');await writeFile(path.join(root,'art/official/w1.json'),'{"poster":"art/official/w1/scene01.png"}');
 await writeFile(path.join(root,'art/official/w1/voice.mp3'),'voice');await writeFile(path.join(root,'art/official/w1/data.json'),'{}');
 await writeFile(path.join(root,'scripts/game/games.html'),'<p>game</p>');await writeFile(path.join(root,'scripts/game/draft.html'),'draft');
 await writeFile(path.join(root,'video/big.mp4'),Buffer.alloc(1600000));await writeFile(path.join(root,'video/loop.mp4'),'tiny');
 const c=await prepare(root),remote=JSON.parse(await readFile(path.join(root,'native/www/ios-remote.json'),'utf8'));
 assert.equal(remote.base,'https://miru.plus/ios-assets/b7/');
 assert.deepEqual(Object.keys(remote.files).sort(),['art/official/w1/voice.mp3','video/big.mp4']);
 for(const x of ['art/official/w1/cover.png','art/official/w1/hero.png','art/official/w1/scene01.png','art/official/w1/data.json','scripts/game/games.html','video/loop.mp4'])assert(c.includes(x),x);
 assert(!c.includes('scripts/game/draft.html'));assert(!Object.keys(remote.files).some(x=>/\.(js|json|html|css)$/.test(x)));
 assert.deepEqual(remote.files['art/official/w1/voice.mp3'],[5,createHash('sha256').update('voice').digest('hex')]);
 console.log('PASS deterministic public resource packaging, bundle/remote media tiers with SHA-256 manifest, exclusions, native bootstrap and AdSense removal');
}finally{await rm(root,{recursive:true,force:true})}
