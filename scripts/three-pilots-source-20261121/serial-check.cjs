const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),path=require('path');
const root=process.argv[2]||path.join(__dirname,'prepared'),src=fs.readFileSync(path.join(root,'source/src/app98_story.js'),'utf8');
assert(src.includes('function serial98('),'Missing ongoing-story boundary');
let b={publication:{status:'ongoing'},chapters:[{scenes:[{id:'last'}]}]},c=b.chapters[0],s=c.scenes[0],locked=false,exited=true,beats=0,sheets=[],saved=0;
const ctx={console,busy:false,scene98:()=>({b,c,s}),experience98:()=>({}),goalMayAdvance98:()=>!locked,save:()=>saved++,dock98:()=>{},beat98:async()=>{beats++;return exited},enter98:async()=>{},appendMsg:(t,m)=>t.msgs.push(m),L98:z=>z,LZ98:o=>typeof o==='object'?o.zh:o,esc:x=>String(x).replace(/[&<>"']/g,'_'),wd:()=>({title:{zh:'测试剧本'},community:'test'}),OFF94:{assets:{test:{cover:'/art/cover.png'}}},sheet:h=>sheets.push(h)};
vm.createContext(ctx);vm.runInContext(src.slice(src.indexOf('/* Ongoing story boundary. */'),src.indexOf('/* End ongoing story boundary. */')),ctx);vm.runInContext(src.slice(src.indexOf('async function next98('),src.indexOf('async function pick98(')),ctx);
const thread=()=>({wid:'test',msgs:[],b98:{ch:1,sc:0,phase:'talk',ready98:'1:0',picked:{},sum:[]}});
(async()=>{
 let t=thread();locked=true;await ctx.next98(t);assert(!t.b98.serialPaused98);assert.equal(beats,0);locked=false;
 exited=false;await ctx.next98(t);assert(!t.b98.serialPaused98);assert.equal(t.b98.ready98,'1:0');exited=true;
 await ctx.next98(t);assert(t.b98.serialPaused98);assert(!t.b98.ended);assert.equal(t.b98.ch,1);assert.equal(t.b98.sc,0);assert(sheets.at(-1).includes('后续剧情持续更新'));assert(sheets.at(-1).includes('data-serial-detail98'));assert(sheets.at(-1).includes('data-serial-discover98'));assert(saved>0);
 const n=beats;await ctx.next98(t);assert.equal(beats,n,'Paused story must not call model again');
 t=JSON.parse(JSON.stringify(t));assert(ctx.serialWaiting98(t),'Save restore lost waiting boundary');
 b.chapters.push({scenes:[{id:'new'}]});assert(!ctx.serialWaiting98(t));await ctx.next98(t);assert.equal(t.b98.ch,2);assert(!t.b98.serialPaused98);
 b={chapters:[{scenes:[s]}]};c=b.chapters[0];t=thread();await ctx.next98(t);assert(t.b98.ended);assert(!t.b98.serialPaused98,'Complete stories must retain ending');
 assert(src.includes('last && mode === "exit" && !serial98(b)'));assert(src.includes('d.ending && mode === "exit" && !serial98(bOf98(wd(th.wid)))'));
 assert(src.includes('if (serialWaiting98(th)) { serialSheet98(th); return false; }'));
 console.log('PASS: goals, failed exit, ongoing pause, model-free repeat, save restore, new chapter resume, existing endings and no AI ending');
})().catch(e=>{console.error(e);process.exitCode=1});
