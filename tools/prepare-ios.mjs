// iOS 打包：把网页资源分成两层。
//   包内（bundle）：外壳、JS/CSS/JSON 数据、通用 UI 图音、首页要用的封面 —— 启动、浏览不需要网络。
//   服务器（remote）：剧情场景图、立绘、配音、视频 —— 进到哪一章才用到，App 原生层按需从
//   https://miru.plus/ios-assets/<版本>/<同一路径> 下载并缓存（MIRURemoteAssets.swift），网页代码不变。
// 服务器层只放媒体文件（图片/音频/视频），永远不放 JS/HTML，App 不会从网上加载任何代码（审核指南 2.5.2）。
// 远程清单写在 native/www/ios-remote.json（路径 → [大小, sha256]），App 下载后逐个校验。
import { readdir, readFile, writeFile, mkdir, copyFile, rm, lstat, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const REMOTE_VERSION='b7';
export const REMOTE_BASE='https://miru.plus/ios-assets/'+REMOTE_VERSION+'/';
const EXT=new Set(['.js','.css','.json','.png','.jpg','.jpeg','.webp','.svg','.gif','.mp3','.m4a','.wav','.ogg','.mp4','.webm','.woff','.woff2']);
const MEDIA=new Set(['.png','.jpg','.jpeg','.webp','.gif','.mp3','.m4a','.wav','.ogg','.mp4','.webm']);
// 这些目录下的媒体默认放服务器（封面和首页直接引用的除外）
const REMOTE_ROOTS=['art/official/','scripts/','video/'];
const COVER_NAME=/封面|cover|poster|thumb/i;
const COVER_KEY=/^(cover|covers|coverImg|coverUrl|poster|thumb|thumbnail|banner|hero|card|avatar)$/i;
const FILES=['index.html','config.js','tune.js','pdfjs_embed.js','miru_rules.js','miru_dialogue_runtime.js','privacy.html','terms.html','contact.html','about.html','delete-account.html','manifest.webmanifest','art/ui/facefinder'];
const DIRS=['art','audio','video','content','scripts','icons'];
const REF=/(?:^|["'`(\s/])((?:art|video|scripts|audio)\/[^"'`()\s<>?#]+?\.(?:png|jpe?g|webp|gif|mp3|m4a|wav|ogg|mp4|webm|html))(?=["'`)\s?#]|$)/gi;
export function nativeHTML(html) {
 return html.replace(/<script\b[^>]*src=["'][^"']*(?:googlesyndication\.com|adsbygoogle)[^"']*["'][^>]*>\s*<\/script>/gi,'').replace('<script src="config.js"></script>','<script src="ios-bootstrap.js"></script>\n<script src="config.js"></script>');
}
const norm=s=>{try{s=decodeURI(s)}catch{}return s.replace(/^\.?\//,'')};
// 首页/外壳直接写死的资源 + 剧目 JSON 里的封面字段：这些留在包里
async function pinned(root){
 const pin=new Set();
 const add=s=>{if(typeof s==='string'&&!/^[a-z]+:/i.test(s))pin.add(norm(s))};
 try{for(const m of (await readFile(path.join(root,'index.html'),'utf8')).matchAll(REF))add(m[1])}catch(e){if(e.code!=='ENOENT')throw e}
 async function json(file){
  let v;try{v=JSON.parse(await readFile(file,'utf8'))}catch{return}
  (function walk(o){if(Array.isArray(o))return o.forEach(walk);if(o&&typeof o==='object')for(const[k,x]of Object.entries(o)){if(COVER_KEY.test(k)){if(typeof x==='string')add(x);else if(x&&typeof x==='object')JSON.stringify(x).replace(/"((?:art|video|scripts)\/[^"]+)"/g,(_,p)=>add(p))}walk(x)}})(v);
 }
 try{for(const f of await readdir(path.join(root,'art/official')))if(f.endsWith('.json'))await json(path.join(root,'art/official',f))}catch(e){if(e.code!=='ENOENT')throw e}
 return pin;
}
const sha=async f=>createHash('sha256').update(await readFile(f)).digest('hex');
// 包里 400KB 以上的 JPG 用系统自带 sips 重压（只在明显变小时替换；只动包里的副本，源文件不变）
function shrinkJPG(file,size){
 if(process.platform!=='darwin'||size<400e3)return;
 const tmp=path.join(os.tmpdir(),'miru-sips-'+process.pid+'.jpg');
 try{execFileSync('sips',['-s','format','jpeg','-s','formatOptions','78',file,'--out',tmp],{stdio:'ignore'});return tmp}catch{return}
}
export async function prepare(root=ROOT,dest=path.join(root,'native/www'),opts={}){
 if(path.resolve(dest)!==path.join(path.resolve(root),'native/www'))throw new Error('Destination must be native/www');
 await rm(dest,{recursive:true,force:true});await mkdir(dest,{recursive:true});
 const manifest=[],remote={},pin=await pinned(root);
 const stats={bundle:0,remote:0,saved:0};
 // 1.5MB 以上的视频（含封面预告）一律放服务器边下边播；其余按目录 + 是否首页引用来分
 const isRemote=(rel,size)=>REMOTE_ROOTS.some(r=>rel.startsWith(r))&&MEDIA.has(path.extname(rel).toLowerCase())&&((/\.(mp4|webm)$/i.test(rel)&&size>1.5e6)||(!pin.has(rel)&&!COVER_NAME.test(path.basename(rel))));
 async function copy(rel) {
  const src=path.join(root,rel),st=await lstat(src);
  if(st.isSymbolicLink())throw new Error('Symlink forbidden: '+rel);
  if(isRemote(rel,st.size)){remote[rel]=[st.size,await sha(src)];stats.remote+=st.size;return}
  const out=path.join(dest,rel);await mkdir(path.dirname(out),{recursive:true});
  if(rel.endsWith('.html'))await writeFile(out,nativeHTML(await readFile(src,'utf8')));
  else if(opts.compress&&/\.jpe?g$/i.test(rel)){
   const tmp=shrinkJPG(src,st.size);let done=false;
   if(tmp){const n=(await stat(tmp)).size;if(n<st.size*0.9){await copyFile(tmp,out);stats.saved+=st.size-n;done=true}await rm(tmp,{force:true})}
   if(!done)await copyFile(src,out);
  }else await copyFile(src,out);
  stats.bundle+=(await stat(out)).size;
  manifest.push(rel);
 }
 async function walk(dir){
  for(const e of (await readdir(path.join(root,dir),{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){
   if(e.name.startsWith('.'))continue;
   const rel=dir+'/'+e.name;
   if(e.isSymbolicLink())throw new Error('Symlink forbidden: '+rel);
   if(e.isDirectory())await walk(rel);
   else if(EXT.has(path.extname(e.name).toLowerCase()))await copy(rel);
   // scripts/ 下的独立页面（如北灯小游戏 games.html）只打包外壳真正引用到的
   else if(rel.endsWith('.html')&&pin.has(rel))await copy(rel);
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
 const files=Object.fromEntries(Object.keys(remote).sort().map(k=>[k,remote[k]]));
 await writeFile(path.join(dest,'ios-remote.json'),JSON.stringify({version:REMOTE_VERSION,base:REMOTE_BASE,files})+'\n');
 prepare.stats=stats;prepare.remote=files;
 return manifest;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const m=await prepare(ROOT,undefined,{compress:!process.argv.includes('--no-compress')}),s=prepare.stats,mb=n=>(n/1e6).toFixed(1)+' MB';
 console.log('Packaged '+m.length+' public resources ('+mb(s.bundle)+', JPG recompression saved '+mb(s.saved)+')');
 console.log('Remote on demand: '+Object.keys(prepare.remote).length+' media files ('+mb(s.remote)+') at '+REMOTE_BASE);
}
