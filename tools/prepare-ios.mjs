import { readdir, readFile, writeFile, mkdir, copyFile, rm, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const EXT=new Set(['.js','.css','.json','.png','.jpg','.jpeg','.webp','.svg','.gif','.mp3','.m4a','.wav','.ogg','.mp4','.webm','.woff','.woff2']);
const FILES=['index.html','config.js','tune.js','pdfjs_embed.js','miru_rules.js','miru_dialogue_runtime.js','privacy.html','terms.html','contact.html','about.html','delete-account.html','manifest.webmanifest','art/ui/facefinder'];
const DIRS=['art','audio','video','content','scripts','icons'];
export function nativeHTML(html) {
 return html.replace(/<script\b[^>]*src=["'][^"']*(?:googlesyndication\.com|adsbygoogle)[^"']*["'][^>]*>\s*<\/script>/gi,'').replace('<script src="config.js"></script>','<script src="ios-bootstrap.js"></script>\n<script src="config.js"></script>');
}
export async function prepare(root=ROOT,dest=path.join(root,'native/www')){
 if(path.resolve(dest)!==path.join(path.resolve(root),'native/www'))throw new Error('Destination must be native/www');
 await rm(dest,{recursive:true,force:true});await mkdir(dest,{recursive:true});
 const manifest=[];
 async function copy(rel) {
  const src=path.join(root,rel),st=await lstat(src);
  if(st.isSymbolicLink())throw new Error('Symlink forbidden: '+rel);
  const out=path.join(dest,rel);await mkdir(path.dirname(out),{recursive:true});
  if(rel.endsWith('.html'))await writeFile(out,nativeHTML(await readFile(src,'utf8')));
  else await copyFile(src,out);
  manifest.push(rel);
 }
 async function walk(dir){
  for(const e of (await readdir(path.join(root,dir),{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){
   if(e.name.startsWith('.'))continue;
   const rel=dir+'/'+e.name;
   if(e.isSymbolicLink())throw new Error('Symlink forbidden: '+rel);
   if(e.isDirectory())await walk(rel);
   else if(EXT.has(path.extname(e.name).toLowerCase()))await copy(rel);
  }
 }
 for(const f of FILES)await copy(f);
 for(const dir of DIRS){try{await walk(dir)}catch(e){if(e.code==='ENOENT'&&dir==='icons')continue;throw e}}
 await copy('native/ios-bootstrap.js');
 await copyFile(path.join(root,'native/ios-bootstrap.js'),path.join(dest,'ios-bootstrap.js'));
 // Remove the source-location copy; only the bootstrap at the web root is needed.
 await rm(path.join(dest,'native'),{recursive:true});
 manifest.splice(manifest.indexOf('native/ios-bootstrap.js'),1);manifest.push('ios-bootstrap.js');
 manifest.sort();await writeFile(path.join(dest,'ios-resources.json'),JSON.stringify(manifest,null,2)+'\n');
 return manifest;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log('Packaged '+(await prepare()).length+' public resources');
