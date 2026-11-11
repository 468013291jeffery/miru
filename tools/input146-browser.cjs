// Actual bundle and beat98 in a fresh browser; synthetic model and account responses.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.MIRU_PLAYWRIGHT_MODULE||'playwright'),repo=process.cwd();
(async()=>{
 const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://local');if(u.pathname.startsWith('/api/')){res.writeHead(200,{'content-type':'application/json'});return res.end(JSON.stringify({ok:true,db:false,rows:[],works:[]}));}const file=path.resolve(repo,'.'+decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname));if(!file.startsWith(repo+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}res.writeHead(200,{'content-type':({'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png'})[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;let browser;
 try{
  browser=await chromium.launch({headless:true,executablePath:process.env.MIRU_EDGE,args:['--disable-gpu','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-background-networking','--disable-sync','--no-first-run']});const context=await browser.newContext({viewport:{width:430,height:920}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  // Headless macOS audio initialization is excluded from these text interaction checks.
  await page.addInitScript(()=>{window.AudioContext=undefined;window.webkitAudioContext=undefined;});
  await page.route('**/*',async route=>{const u=new URL(route.request().url());if(route.request().resourceType()==='media')return route.fulfill({status:204,body:''});if(u.origin===origin)return route.continue();const file=path.resolve(repo,'.'+decodeURIComponent(u.pathname));if(u.hostname.endsWith('miru.plus')&&file.startsWith(repo+path.sep)&&fs.existsSync(file)&&fs.statSync(file).isFile())return route.fulfill({path:file});return route.fulfill({status:200,contentType:'application/json',body:'{}'});});
  async function screenshot146(file){const cdp=await context.newCDPSession(page);try{const result=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true});fs.writeFileSync(file,Buffer.from(result.data,'base64'));}finally{await cdp.detach();}}
  await page.goto(origin,{waitUntil:'load'});await page.waitForFunction(()=>typeof narrationAfter135==='function');


  const inputs=await page.evaluate(async()=>{
   S.ob=S.ageOk=true;S.authChoice='guest';S.lang='zh';S.fxOff=S.sfxOff=true;S.bgm=false;S.voice=Object.assign({},S.voice,{auto:false});S.autoVoice=false;S.personas[0]={id:'reader146',name:'林安',pron:'she',age:26};S.pid='reader146';S.cloud={token:'isolated',uid:'isolated',known:100};S.keys=100;CL0.on=CL0.checked=true;S.ciPrompt=today();
   bgmInit=()=>false;liveOn=()=>true;aiGate=()=>true;useUnits=()=>{};gen96=async()=>null;cloudPush=async()=>{};walletDiff=()=>{};capi=async()=>({ok:true,status:200,j:{ok:true,db:false,rows:[]}});startApp();closeSheet();
   const wid=await install98('w_scmwaymue65be8983c9b'),b=bOf98(wd(wid)),th=new98(wid,b.player.key);openThread(th.id);closeSheet();
   window.__baseReply146=reply;window.__received146=[];reply=async(t,c)=>{window.__received146.push(c)};
   setSugg([{mode:'say',text:'诺亚，请解释那次签字。'},{mode:'act',text:'看向诺亚，把记录推到桌上'},{mode:'think',text:'我还不能判断谁在说真话'}]);
   window.__thread146=th.id;return {id:th.id};
  });
  for(const mode of ['say','act','think']){
   if(mode!=='say')await page.evaluate(()=>setSugg([{mode:'say',text:'诺亚，请解释那次签字。'},{mode:'act',text:'看向诺亚，把记录推到桌上'},{mode:'think',text:'我还不能判断谁在说真话'}]));
   await page.locator('#sugg [data-input-kind="'+mode+'"]').evaluate(el=>el.click());
   const m=await page.evaluate(()=>{const t=S.threads[curT],m=t.msgs.at(-1);return {k:m.k,txt:m.txt,context:window.__received146.at(-1),shown:document.querySelector('#msgs [data-mi="'+(t.msgs.length-1)+'"]')?.textContent}});
   assert.equal(m.k,mode);assert.equal(m.context.mode,mode);assert(!/^\*|^（|^「/.test(m.txt));assert(m.shown.includes(mode==='act'?'*':mode==='think'?'（':'「'));
  }
  await page.evaluate(()=>{cmode='say';renderChat();});
  await page.locator('#cin').fill('（这段只在心里想，不说出口。）');await page.locator('[data-send]').evaluate(el=>el.click());
  assert.equal(await page.evaluate(()=>S.threads[curT].msgs.at(-1).k),'think');assert.equal(await page.evaluate(()=>window.__received146.at(-1).mode),'think');
  await page.evaluate(()=>{cmode='say';document.querySelector('#cin').value='';});
  await page.locator('#cin').fill('草稿不会消失');await page.locator('[data-inputmenu124]').evaluate(el=>el.click());await page.locator('[data-input124="act"]').evaluate(el=>el.click());
  assert.equal(await page.locator('#cin').inputValue(),'*草稿不会消失*');await page.locator('[data-inputmenu124]').evaluate(el=>el.click());await page.locator('[data-input124="think"]').evaluate(el=>el.click());
  assert.equal(await page.locator('#cin').inputValue(),'（草稿不会消失）');
  const composition=await page.evaluate(()=>{const t=document.querySelector('#cin');t.value='中文组合中';t.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true}));const during=t.value;t.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true}));return {during,after:t.value};});
  assert.equal(composition.during,'中文组合中');assert.equal(composition.after,'（中文组合中）');
  if(process.env.MIRU_REPORT_DIR){fs.mkdirSync(process.env.MIRU_REPORT_DIR,{recursive:true});await screenshot146(path.join(process.env.MIRU_REPORT_DIR,'input146-types.png'));}
  const data=fs.readdirSync(path.join(repo,'art/official')).filter(x=>x.endsWith('.bible.json')).map(x=>({id:x.replace('.bible.json',''),b:JSON.parse(fs.readFileSync(path.join(repo,'art/official',x),'utf8'))}));
  const matrix=await page.evaluate(async(data)=>{
   reply=window.__baseReply146;const prompts=[],actorPrivacy=[];let thinking146=false;
   const written='眼前的交谈还没有结束，刚才提到的记录也还需要核对。每个人说过什么，可以先分别记下；一句解释能够指出调查的方向，却不能直接证明解释中的每一件事。\n\n此刻已经公开的线索和还没有得到回答的问题，留在同一个场景里。接下来问谁、先看哪一项，仍由玩家自己选择，旁白不会提前把后面的结果算作已经发生。';
   ask=async(p,o={})=>{
    const t=S.threads[curT];
    if(p.startsWith('[MIRU_NARRATIVE145_REVIEW]')){const f=JSON.parse(p.split('\nCANDIDATE:')[1].split('\n只回JSON')[0]);return {valid:true,materialIds:f.ids};}
    if(p.startsWith('[MIRU_NARRATIVE145]')){prompts.push(p);const packet=JSON.parse(p.split('PACKET_JSON:\n')[1].split('\nEND_PACKET')[0]);return {paragraphs:written.split('\n\n'),materialIds:packet.allowedMaterials.map(x=>x.id)};}
    if(p.includes('"speakers"'))return {present:t.cast,anchor:-1,speakers:t.cast.slice(0,2).map(id=>({id,intent:thinking146?'PRIVATE_SENTINEL146':'回应当前公开问题'})),new_info:true,options:[{mode:'say',text:'请先说清楚。'},{mode:'act',text:'把记录放到桌上'},{mode:'think',text:'我想再核对一遍'}]};
    if(p.startsWith('You write MIRU'))return {beats:[{who:t.cast[0],kind:'say',text:'先把眼前记录核对清楚。'},{who:t.cast[0],kind:'act',text:'抬起头，等你继续问。'}],status:{place:t.status.place},love:{},suggest:[]};
    actorPrivacy.push(p);return {act:'停下手里的动作。',say:'先核对眼前的记录。你想从哪一项问起？',feel:0,remember:''};
   };
   const enabled=W.filter(w=>w.pack).map(w=>({id:w.id,on:narrativeOn145({wid:w.id,pk:{ch:1}})}));for(const x of data){const id='policy146:'+x.id;S.mine.worlds[id]={id,community:x.id,bible98:1};B98.cache[x.id]=x.b;enabled.push({id:x.id,on:narrativeOn145({wid:id,b98:{ch:1,sc:0}})});}
   const th=S.threads[window.__thread146],b=bOf98(wd(th.wid));delete b.narrative145;delete b.experience.narration;b.chapters[1].scenes[0].beat={zh:'FUTURE_LOCKED_146',en:'FUTURE_LOCKED_146'};th.b98.cards[th.cast[0]].mem.push('OWN_SAVED_MEMORY146');await enter98(th);closeSheet();renderChat();
   const generic=th.msgs.filter(m=>m.narrative145).map(m=>({text:m.txt,kind:m.narrative145.kind,origin:m.narrative145.origin}));
   const count=generic.length;appendMsg(th,{who:'me',k:'think',txt:'PRIVATE_SENTINEL146',at:Date.now()});thinking146=true;await reply(th,{kind:'user',mode:'think',txt:'PRIVATE_SENTINEL146'});thinking146=false;if(th.msgs.filter(m=>m.narrative145).length!==count)throw Error('private thought forced narration');
   const beforeActors=actorPrivacy.length;th.b98.turns+=2;await reply(th,{kind:'user',mode:'say',txt:'记录里有什么线索？'});
   const w=JSON.parse(JSON.stringify(wd(th.wid))),bi=x=>({zh:x,en:x});w.id='legacy146';w.bible98=0;w.pack={chapters:[{t:bi('当前章节'),goal:bi('核对记录'),place:bi(th.status.place),time:bi('夜晚'),choices:[],beats:[]}],secrets:[],bonus:[]};S.mine.worlds[w.id]=w;
   const old=JSON.parse(JSON.stringify(th));old.id='legacy146';old.wid=w.id;delete old.b98;delete old.vers;delete old._pre73;old.pk={ch:1,as:'side',me:1,st:'choose',picks:{},flags:{},q:[]};old.rounds=4;old.cast=old.cast.slice(0,2);old.msgs=[];S.threads[old.id]=old;openThread(old.id);closeSheet();
   window.__read146=setInterval(()=>{if(READING.pending.has(curT)){EXPERIENCE124.positions.delete(curT);READING.advance()}},100);
   await reply(old,{kind:'user',mode:'say',txt:'先核对一下记录。'});clearInterval(window.__read146);
   const legacy=old.msgs.filter(m=>m.narrative145).length;
   const agent=JSON.parse(JSON.stringify(old));agent.id='agent146';delete agent.pk;agent.agent97={ch:1,turns:0,hit:[],cards:{},sum:[],ended:false};agent.msgs=[];S.threads[agent.id]=agent;openThread(agent.id);closeSheet();await agentTurn97(agent,{mode:'say',txt:'先核对一下记录。'});
   const agentFrames=agent.msgs.filter(m=>m.narrative145).length;
   const uploaded=JSON.parse(JSON.stringify(b));uploaded.key='new-upload146';delete uploaded.experience;B98.cache[uploaded.key]=uploaded;const uw=JSON.parse(JSON.stringify(wd(th.wid)));uw.id='upload146';uw.community=uploaded.key;S.mine.worlds[uw.id]=uw;const ut=new98(uw.id,uploaded.player.key);openThread(ut.id);closeSheet();await enter98(ut);
   const uploadFrames=ut.msgs.filter(m=>m.narrative145).length;
   openThread(th.id);closeSheet();renderChat();EXPERIENCE124.positions.delete(curT);scrollChat();
   return {enabled,generic,legacy,agentFrames,uploadFrames,prompts:prompts.map(p=>({future:p.includes('FUTURE_LOCKED_146'),private:p.includes('PRIVATE_SENTINEL146')})),actorPrivate:actorPrivacy.some(p=>p.includes('PRIVATE_SENTINEL146')),leaks:actorPrivacy.filter(p=>p.includes('PRIVATE_SENTINEL146')).map(p=>({head:p.slice(0,60),near:p.slice(Math.max(0,p.indexOf('PRIVATE_SENTINEL146')-100),p.indexOf('PRIVATE_SENTINEL146')+100)})),savedMemory:actorPrivacy.some(p=>p.includes('OWN_SAVED_MEMORY146')),beforeActors,frames:th.msgs.filter(m=>m.narrative145).length};
  },data);
  console.log('CHECK_SUMMARY',JSON.stringify({stories:matrix.enabled.length,generic:matrix.generic.length,legacy:matrix.legacy,agent:matrix.agentFrames,upload:matrix.uploadFrames,actorPrivate:matrix.actorPrivate,leaks:matrix.leaks}));
  assert(matrix.enabled.length>data.length);assert(matrix.enabled.every(x=>x.on));assert(matrix.generic.some(x=>x.text.length>100));assert(matrix.legacy>0);assert(matrix.agentFrames>0);assert(matrix.uploadFrames>0);assert(matrix.prompts.every(x=>!x.future&&!x.private));assert(!matrix.actorPrivate);assert(matrix.savedMemory);assert.deepEqual(errors,[]);
  if(process.env.MIRU_REPORT_DIR){await screenshot146(path.join(process.env.MIRU_REPORT_DIR,'narration146-all-stories.png'));fs.writeFileSync(path.join(process.env.MIRU_REPORT_DIR,'input-narration146.json'),JSON.stringify(matrix,null,2));}
  console.log(JSON.stringify(matrix,null,2));console.log('Input types, draft, IME, all story policies, old engines, future uploads and secret boundaries passed.');
 }finally{if(browser)await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
