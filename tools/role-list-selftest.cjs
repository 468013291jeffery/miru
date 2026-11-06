const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
async function main(){
 let rerenders=0;const data=JSON.parse(fs.readFileSync('art/official/leads.json','utf8'));
 const c={console,C:{},W:[],S:{art:{}},CL:()=> 'zh',disc:{mode:'chars'},renderDiscRes:()=>rerenders++,save:()=>{},fetch:async url=>({ok:true,json:async()=>url.startsWith('art/')?data:{works:data.works.map(w=>({id:w.wid}))}}),document:{readyState:'complete',addEventListener:()=>{},querySelector:()=>({}),createElement:()=>({}),head:{appendChild:()=>{}}},window:{}};
 vm.createContext(c);vm.runInContext(fs.readFileSync('source/src/app126_leads.js','utf8'),c);await new Promise(resolve=>setImmediate(resolve));
 const princes=Object.values(c.C).filter(x=>x.ld126==='w_scmw2calg4a57f5c1974');assert.equal(princes.length,8);assert.equal(rerenders,1);
 const source=fs.readFileSync('source/src/app2_pages.js','utf8'),body=source.slice(source.indexOf('function renderDiscRes(){'),source.indexOf('function sCard('));
 c.disc.sel={};c.disc.q='';c.disc.sort='hot';
 const host={innerHTML:''};Object.assign(c,{$:()=>host,allChars:()=>Object.keys(c.C),ch:id=>c.C[id],wd:id=>c.W.find(w=>w.id===id),orOK:()=>false,discMatch:()=>false,Lz:x=>typeof x==='string'?x:x?.zh||'',t:(key,o)=>key==='disc.results'?String(o.n):key,cCard:id=>'<b>'+id+'</b>'});
 vm.runInContext(body,c);c.renderDiscRes();assert(host.innerHTML.includes('ld_7f5c1974_cassian'),'Story orientation incorrectly hid a prince');
 c.disc.q='八位王子';c.renderDiscRes();assert.equal((host.innerHTML.match(/<b>ld_/g)||[]).length,8);
 c.disc.q='no such character';c.renderDiscRes();assert(!host.innerHTML.includes('<b>ld_'));
 console.log('Async role refresh, independent orientation and eight-prince search passed.');
}
main().catch(e=>{console.error(e);process.exitCode=1});
