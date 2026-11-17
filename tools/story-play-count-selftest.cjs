const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const file=process.argv[2]||path.join(__dirname,'../source/src/app98_story.js'),src=fs.readFileSync(file,'utf8');
const body=src.slice(src.indexOf('async function install98('),src.indexOf('{ const _iw = installWork;'));
async function run(response){
 const calls=[],b={player:{key:'me',name:{zh:'你',en:'You'},role:{}},cast:[],title:{},hook:{},premise:{},chapters:[]};
 const x={S:{mine:{chars:{},worlds:{}},art:{}},bible98:async()=>b,off94Assets:async()=>({}),cid98:(w,k)=>k,LZ98:()=>'',Z98:()=>true,save:()=>{},OFF89:{at:123},OFFF94:{at:456},OFF94:{play:{}},capi:async p=>{calls.push(p);if(response instanceof Error)throw response;return response;}};
 vm.createContext(x);vm.runInContext(body,x);const wid=await x.install98('w_test');assert(wid);assert.deepEqual(calls,['/works?id=w_test&play=1']);
 if(response.ok){assert.equal(x.OFF89.at,0);assert.equal(x.OFFF94.at,0);}else{assert.equal(x.OFF89.at,123);}
 assert(x.S.mine.worlds[wid]);
}
(async()=>{await run({ok:true});await run({ok:false});await run(new Error('offline'));console.log('Story-bible play reporting, cache refresh, API failure and offline play passed');})().catch(e=>{console.error(e);process.exitCode=1;});
