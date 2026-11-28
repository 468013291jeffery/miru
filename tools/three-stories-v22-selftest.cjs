const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),file=path.join(root,'source/src/app163_three_stories_v22.js');
const w={id:'test',community:'w_scmwzzyizs9e25d81856',cast:['you','d','m'],leads:[],pack:{chapters:[{beats:{zh:[['sys','scene',{bg94:'bg_a_c01s01'}]]}}]}},chars={you:{n:'你'},d:{n:'达米安',n94:{zh:'达米安',en:'Damian'}},m:{n:'米娅',n94:{zh:'米娅',en:'Mia'}}};
const data={schema:1,characters:[{canonical:'达米安',names:{zh:'达米安',en:'Damian',ja:'ダミアン'},romanceable:true,voice:'m2',appearance:'grey eyes',voice_and_boundaries:'Ask before touching.'},{canonical:'米娅',names:{zh:'米娅',en:'Mia',ja:'ミア'},romanceable:false,voice:'f2',appearance:'brown hair',voice_and_boundaries:'Work comes first.'}],player:{fields:{A02:{content:'adult designer'}}}};
let baseResults=0,saves=0;
const hooks={},ctx=vm.createContext({console,Set,Map,Date,JSON,window:{},S:{lang:'zh',mine:{chars,worlds:{test:w}},threads:{}},OFF94:{assets:{[w.community]:{v22:data,scene_present:{bg_a_c01s01:['米娅']}}},cur:{id:w.community}},PARSE:{use:(k,v)=>hooks[k]=v},wd:()=>w,ch:id=>chars[id],CL:()=>ctx.S.lang,Lz:o=>typeof o==='object'?o[ctx.S.lang]||o.en:o,save:()=>saves++,off94Names:()=>{},off94MergeEn:()=>{},castCardFace:()=> 'base private card',packPrompt:()=> 'base prompt',mgResult:()=>{baseResults++;return ['base'];},pkSet:(th,flag)=>{th.pk.flags[flag]=1},PKREG:{add:()=>{}},SFX100:[],BGM_MOODS:{},BGM_NAME:{},SFX_FILES:{},renderChat:()=>{},setTimeout:()=>{}});
assert(fs.existsSync(file),'scoped runtime module is required');
vm.runInContext(fs.readFileSync(file,'utf8'),ctx);
const r=hooks['three-stories-v22:bindings'].build(()=>({wid:'test'}),{},'你');assert.equal(r.wid,'test');
assert.equal(chars.m.romanceable,false);assert.equal(chars.d.romanceable,true);assert.equal(w.pack.nativeV2,1);
let th={id:'t',wid:'test',cast:['d','m'],present:['m'],pk:{ch:1,as:'you',flags:{},nativeScene:{present:['m']}}};
assert(!ctx.castCardFace(th,'m').includes('base private card'));assert(ctx.castCardFace(th,'m').includes('not a romance route'));
ctx.S.lang='ja';ctx.off94Names();assert.equal(chars.d.n,'ダミアン');assert(ctx.packPrompt(th).includes('Japanese'));assert(ctx.packPrompt(th).includes('adult designer'));
const before=JSON.stringify(th.love||{});for(const result of ['win','lose','skip']){const beats=ctx.mgResult(th,{id:'g_find_letter'},result);assert(Array.isArray(beats));}
assert.equal(JSON.stringify(th.love||{}),before);assert.equal(baseResults,0);assert.equal(th.pk.v22Games.length,3);
const other={wid:'other',pk:{flags:{}}};ctx.wd=()=>({community:'unrelated',pack:{}});assert.equal(ctx.castCardFace(other,'d'),'base private card');assert.equal(ctx.mgResult(other,{},'win')[0],'base');assert.equal(baseResults,1);
console.log('three-stories-v22: scoped roles, no private future fields, Japanese names/prompt, game receipts without romance, unrelated stories preserved');
