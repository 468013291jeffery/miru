const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),crypto=require('crypto');
const E=require('../source/src/wtsr_state');
const R=JSON.parse(fs.readFileSync('content/official/when-song-returns-v1/release.json'));
const script=fs.readFileSync('content/official/when-song-returns-v1/script.md','utf8');
const published=JSON.parse(fs.readFileSync('content/official/when-song-returns-v1/admin-import.json'));assert.equal(published.patch.config.leads.length,2);assert(published.patch.config.leads.every(c=>c.key&&c.n.zh&&c.g==='f'&&c.art));
for(const line of script.split('\n'))if(line.startsWith('⟦CHAR|')){const a=line.slice(6,-1).split('|').map(decodeURIComponent);assert.equal(a.length,6);assert(!/本包|此前|char_c|中文统一/.test(a[5]));}

const qa=require('../api/_dslqa').dslQA(script);assert.deepEqual(qa.err,[]);assert.equal(qa.stats.chapters,12);assert.equal(qa.stats.scenes,48);assert.equal(R.games.length,24);
assert.deepEqual(require('../api/_lib').safety([script]),[]);
assert(!/回应空间|隐藏分支|运行卡|player_intent|effects：|条件正文|ROUTE_STAGE|后台设定/.test(script));
for(const row of JSON.parse(fs.readFileSync('content/official/when-song-returns-v1/media-hashes.json'))){const b=fs.readFileSync(row.path);assert.equal(b.length,row.bytes);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),row.sha256);}
for(const c of R.chapters)for(const s of c.scenes)assert(fs.existsSync('.'+R.assets[s.bg]));
assert.equal(R.cast.filter(c=>c.romanceable).length,2);assert.equal(R.cast.find(c=>c.name==='朱尔斯').gender,'nb');assert.equal(R.premise.split('\n\n').length,6);assert(!R.video);
let s=E.initial();s=E.apply(s,'pause','休息').state;assert.equal(s.project,'paused');assert(E.apply(s,'terms','看看合同').issue);assert.equal(E.apply(s,'exit','结束整个项目').state.ending,'END_EARLY');s=E.apply(s,'resume','恢复').state;s=E.apply(s,'terms','先看看合同').state;s.scene='SCN_0104';s=E.apply(s,'confirm','确认条款并有限参与').state;assert(s.goals[1]&&s.withholdingHandled);
s.scene='SCN_0904';s.outing='viv';let out=E.apply(s,'date_viv','愿意约会');assert(out.issue);assert.equal(out.state.dating,null);E.visit(s,'D5','viv');E.visit(s,'D5','viv');assert.equal(s.private.viv.length,1);E.visit(s,'D9','viv');out=E.apply(s,'date_viv','我愿意和你约会');assert.equal(out.state.dating,'viv');s=out.state;
s=E.apply(s,'close_viv','停止私人联系').state;assert.equal(s.dating,null);assert(E.apply(s,'date_viv','约会').issue);s=E.apply(s,'reopen_viv','重新讨论').state;assert.equal(E.apply(s,'date_viv','约会').state.dating,'viv');
s=E.initial();s.scene='SCN_0904';s.outing='eri';s.respected.eri=true;E.visit(s,'D5','eri');E.visit(s,'D9','eri');assert(E.apply(s,'date_eri','愿意').issue);s.oldStatusDisclosed=true;assert.equal(E.apply(s,'date_eri','接受约会').state.dating,'eri');s.exclusive='viv';assert(E.apply(s,'date_eri','接受约会').issue);
s=E.initial();s.scene='SCN_1004';assert(E.apply(s,'stage_ready','直播').issue);s=E.apply(s,'handover','退出演出并交接').state;s.scene='SCN_1103';assert(E.apply(s,'complete','唱完').issue);s=E.apply(s,'handover','完成交接').state;s.scene='SCN_1104';assert(E.apply(s,'confirm','核对交接').state.goals[11]);
s=E.initial();s.scene='SCN_1204';assert(E.apply(s,'END_VIV','继续约会').issue);for(const k of ['END_SOLO','END_FRIEND','END_CLOSE'])assert.equal(E.apply(s,k,k).state.ending,k);
let hooks={},registered={},resolved=0,asks=-1;
const ctx={console,window:{},module:undefined,MG100:[],MG_T:{},off94Feed:async()=>[],off94Assets:async()=>({}),OFF94:{cur:null,assets:{}},mgMatch(){},mgResult(){},packModes(){return []},packOpen(){},packPick(){},packAdvanceChapter(){},packPrompt(){return ''},reply:async th=>{await Promise.resolve();if(th.pk?.q)th.pk.q.splice(0,Math.min(2,th.pk.q.length));ctx.stopResolve(th,[]);},authoredMatch:async()=>asks,stopResolve:()=>{resolved++;},toast(){},S:{mine:{worlds:{},chars:{}},art:{},threads:{},works:[]},LL:a=>a,Lz:o=>typeof o==='string'?o:o?.zh||'',CL:()=> 'zh',me:()=>'',wd:id=>ctx.S.mine.worlds[id],ch:id=>ctx.S.mine.chars[id],PARSE:{use:(n,v)=>hooks[n]=v},pkDirective(){return false;},PKREG:{add:(n,f)=>registered[n]=f},packSt:()=>({}),save(){},pkSet(th,f){th.pk.flags||={};th.pk.flags[f]=1;},appendMsg(th,m){th.msgs.push(m);}};
Object.assign(ctx,{doSend(){throw Error('Shared sender must not discard Song queue');},document:{getElementById:()=>null,createElement:()=>({}),head:{appendChild(){}}},busy:false,aiGate:()=>true,cmode:'say',playerInput146:(text,mode)=>({text,mode}),PKPAUSE:{}});
vm.createContext(ctx);vm.runInContext(fs.readFileSync('source/src/app159_song_data.js','utf8'),ctx);vm.runInContext(fs.readFileSync('source/src/wtsr_state.js','utf8'),ctx);vm.runInContext(fs.readFileSync('source/src/app159_song.js','utf8'),ctx);
const state=E.initial(),th={id:'song',wid:'song',pk:{wtsr:state,ch:1},msgs:[]};ctx.S.mine.worlds.song={community:R.work_id,cast:R.cast.map(c=>c.name),pack:{chapters:R.chapters.map(c=>({n:c.n,beats:{zh:[]}}))}};R.cast.forEach(c=>ctx.S.mine.chars[c.name]={n:c.name});ctx.S.threads.song=th;
const api=ctx.window.WTSR_RUNTIME;
for(const c of R.chapters)for(const sc of c.scenes){const q=api.render(th,sc.id,false);assert(q.at(-1)[2].wtsr);assert(!q.filter(b=>b[0]!=='sys').some(b=>/回应空间|隐藏分支|运行卡|player_intent|effects：/.test(b[2])));}
for(const route of ['stage_ready','room_ready','handover']){state.eventRoute=route;const q=api.render(th,'SCN_1103',false);const body=q.filter(b=>b[0]!=='sys').map(b=>b[2]).join('\n');assert(route!=='handover'||!body.includes('红灯亮起'));assert(route!=='room_ready'||!body.includes('红灯亮起'));assert(fs.existsSync('.'+q[0][2].src94));}
state.plans.voice='decline';let q=api.render(th,'SCN_0704',false);assert(!q.some(b=>b[2]?.includes?.('我爱你')));assert.equal(th.present.length,0);
state.plans.voice='audio';q=api.render(th,'SCN_0704',false);assert(q.some(b=>b[2]?.includes?.('我爱你')));assert.equal(th.present.length,0);
state.plans.voice='live';api.render(th,'SCN_0704',false);assert(th.present.includes('薇薇安'));
state.outing='eri';q=api.render(th,'SCN_0904',false);assert(!q.some(b=>b[0]==='薇薇安'));assert(q.some(b=>b[0]==='艾琳'));
state.outing='viv';q=api.render(th,'SCN_0904',false);assert(!q.some(b=>b[0]==='艾琳'));
assert.equal(ctx.MG100.length,24);assert(!/setTimeout|setInterval/.test(fs.readFileSync('source/src/app159_song.js','utf8')));
(async()=>{th.pk.wtsr=E.initial();th.pk.stop=['sys','line',{wtsr:true,opts:[]}];await ctx.reply(th,{kind:'user',txt:'为什么买剧院',mode:'say'});assert.equal(resolved,1); // prologue advances only to the same scene, not a signature
assert.equal(th.pk.wtsr.project,'unconfirmed');resolved=0;await ctx.reply(th,{kind:'user',txt:'继续',mode:'say'});assert.equal(resolved,0);assert(!th.pk.wtsr.goals[1]);
ctx.curT='song';th.pk.q=[th.pk.stop,['sys','wtsrScene',{id:'SCN_0102'}]];const queue=JSON.stringify(th.pk.q);ctx.doSend('我想先问几个问题','say');await new Promise(r=>setImmediate(r));assert.equal(JSON.stringify(th.pk.q),queue);
const before=JSON.stringify(th.pk.wtsr);ctx.stopResolve(th,[]);assert.equal(resolved,0);assert.equal(JSON.stringify(th.pk.wtsr),before);
ctx.S.mine.worlds.other={community:'other'};const other={id:'other',wid:'other',pk:{},msgs:[]};await ctx.reply(other,{kind:'user',txt:'继续'});assert.equal(resolved,1);
console.log('Song: 12 chapters / 48 scenes / 24 optional games / 51 original hashes; branch isolation, privacy, consent, ending eligibility, pause/exit, idempotent visits, no forced navigation and other-story isolation passed.');})().catch(e=>{console.error(e);process.exitCode=1;});
