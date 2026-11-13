import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import os from 'node:os';import path from 'node:path';
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
 console.log('PASS deterministic public resource packaging, exclusions, native bootstrap and AdSense removal');
}finally{await rm(root,{recursive:true,force:true})}
