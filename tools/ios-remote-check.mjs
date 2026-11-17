// 归档前必跑：确认 native/www/ios-remote.json 里每个按需下载的媒体都在服务器快照上、大小一致。
//   node tools/ios-remote-check.mjs            # HEAD 全部文件（大小 + 类型）
//   node tools/ios-remote-check.mjs --sha 20   # 另外随机完整下载 20 个核对 SHA-256
// 任何一个缺失 / 大小不符 / 返回脚本或网页，就以非 0 退出，不允许归档。
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2),shaN=args.includes('--sha')?Number(args[args.indexOf('--sha')+1]||10):0;
const man=JSON.parse(await readFile(path.join(ROOT,'native/www/ios-remote.json'),'utf8'));
if(!/^https:\/\/miru\.plus\/ios-assets\/[a-z0-9]+\/$/.test(man.base))throw new Error('Unexpected remote base '+man.base);
const entries=Object.entries(man.files),bad=[];
const url=p=>new URL(p.split('/').map(encodeURIComponent).join('/'),man.base).href;
async function head(p,[size]){
 for(let i=0;i<3;i++){try{
  const r=await fetch(url(p),{method:'HEAD',signal:AbortSignal.timeout(30000)});
  const len=Number(r.headers.get('content-length')),type=r.headers.get('content-type')||'';
  if(r.status!==200)return bad.push(p+' → HTTP '+r.status);
  if(len!==size)return bad.push(p+' → size '+len+' ≠ '+size);
  if(!/^(image|audio|video)\//.test(type)&&!(type==='application/octet-stream'&&/\.(wav|ogg)$/i.test(p)))return bad.push(p+' → type '+type);
  return;
 }catch(e){if(i===2)bad.push(p+' → '+e.message)}}
}
let next=0,done=0;
await Promise.all(Array.from({length:16},async()=>{while(next<entries.length){const e=entries[next++];await head(...e);if(++done%500===0)console.log('checked '+done+'/'+entries.length)}}));
const shuffled=entries.filter(([,[s]])=>s<6e5).sort(()=>Math.random()-.5).slice(0,shaN);
for(const[p,[,sha]]of shuffled){
 try{const b=Buffer.from(await (await fetch(url(p),{signal:AbortSignal.timeout(120000)})).arrayBuffer());
  if(createHash('sha256').update(b).digest('hex')!==sha)bad.push(p+' → sha256 mismatch')}catch(e){bad.push(p+' → '+e.message)}
}
const mb=(entries.reduce((a,[,[s]])=>a+s,0)/1e6).toFixed(1);
if(bad.length){console.error('FAIL '+bad.length+' of '+entries.length+' remote media files:\n'+bad.slice(0,40).join('\n'));process.exit(1)}
console.log('PASS '+entries.length+' remote media files ('+mb+' MB) present at '+man.base+(shaN?', '+shuffled.length+' SHA-256 verified':''));
