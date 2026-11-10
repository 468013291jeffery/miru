// Isolated synthetic reader, real application routing and real production LLM transport.
// Account/billing/ancillary calls are isolated; ask/director/actor/narration are never canned.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.MIRU_PLAYWRIGHT_MODULE||'playwright'),repo=process.cwd(),report=process.env.MIRU_REPORT_DIR;
(async()=>{
 const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://local'),file=path.resolve(repo,'.'+decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname));if(!file.startsWith(repo+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}res.setHeader('content-type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const local='http://127.0.0.1:'+server.address().port,origin=process.env.MIRU_LIVE_ORIGIN||local;let browser;
 try{
  browser=await chromium.launch({proxy:process.env.MIRU_TEST_PROXY?{server:process.env.MIRU_TEST_PROXY,bypass:'localhost,127.0.0.1'}:undefined,headless:true,executablePath:process.env.MIRU_EDGE,args:['--disable-gpu','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-background-networking','--disable-sync','--no-first-run']});const context=await browser.newContext({viewport:{width:430,height:920}}),page=await context.newPage(),errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(o=>{window.MIRU_PROXY=o+'/api/longcat';},origin);
  await page.route('**/*',async route=>{const u=new URL(route.request().url());if(route.request().resourceType()==='media')return route.fulfill({status:204,body:''});
   if(u.pathname==='/api/longcat'){
    const body=route.request().postDataJSON(),prompt=body.messages.map(m=>m.content).join('\n'),kind=prompt.startsWith('[MIRU_NARRATION135]')?'narration':prompt.includes('"speakers"')?'director':'actor-or-writer',record={kind,status:0};requests.push(record);
    let response;try{response=await route.fetch({url:'https://miru.plus/api/longcat',headers:{'content-type':'application/json',origin:'https://miru.plus'},timeout:60000});}catch(e){record.error=String(e.message).slice(0,120);return route.abort('timedout');}record.status=response.status();record.provider=response.headers()['x-miru-provider']||'';if(kind==='director'){try{const j=await response.json(),raw=j.choices?.[0]?.message?.content||'',v=JSON.parse(raw.replace(/^```json\s*|\s*```$/g,''));record.speakers=v.speakers;}catch(_){}}console.log('REAL_MODEL',JSON.stringify(record));return route.fulfill({response});
   }
   if(u.pathname.startsWith('/api/'))return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,db:false,rows:[],works:[]})});
   if(u.origin===origin)return route.continue();
   if(u.hostname.endsWith('miru.plus')){const file=path.resolve(repo,'.'+decodeURIComponent(u.pathname));if(file.startsWith(repo+path.sep)&&fs.existsSync(file)&&fs.statSync(file).isFile())return route.fulfill({path:file});}
   return route.fulfill({status:200,contentType:'application/json',body:'{}'});
  });
  await page.goto(origin,{waitUntil:'load'});await page.waitForFunction(()=>typeof narrationAfter135==='function');
  const fresh=await page.evaluate(async()=>{
   S.ob=S.ageOk=true;S.authChoice='guest';S.lang='zh';S.fxOff=S.sfxOff=true;S.bgm=false;S.voice=Object.assign({},S.voice,{auto:false});S.autoVoice=false;S.personas[0]={id:'pilot-real-reader',name:'林安',pron:'she',age:26};S.pid='pilot-real-reader';S.ciPrompt=today();S.cloud={token:'isolated-test',uid:'isolated-test',known:100,provider:'email'};S.keys=100;CL0.on=CL0.checked=true;
   aiGate=()=>true;useUnits=()=>{};gen96=async()=>null;cloudPush=async()=>{};walletDiff=()=>{};capi=async()=>({ok:true,status:200,j:{ok:true,rows:[],db:false}});lcApply();if(SAMPLE!==LC_SAMPLE)throw Error('real provider not active');window.__replyDone135=0;window.__routes135=[];const liveReply135=reply;reply=async function(th,ctx,silent){window.__routes135.push({id:th.id,kind:ctx&&ctx.kind,on:narrationOn135(th),pk:!!th.pk,b98:!!th.b98});try{return await liveReply135.apply(this,arguments);}finally{window.__replyDone135++;}};startApp();closeSheet();
   const wid=await installWork('w_scmw7f7e4565778126fa'),b=bOf98(wd(wid)),th=new98(wid,b.player.key);openThread(th.id);await new Promise(resolve=>setTimeout(resolve,1100));lcApply();await enter98(th);closeSheet();renderChat();
   const frames=th.msgs.filter(m=>m.narrative135);return {id:th.id,b98:!!th.b98,frames:frames.map(m=>({text:m.txt,origin:m.narrative135.origin})),shown:th.b98.narration135&&th.b98.narration135.shown,actors:th.msgs.filter(m=>m.k==='box'&&m.say).length};
  });
  console.log('FRESH_ENTRY',JSON.stringify(fresh));
  assert(fresh.actors>0,'entry actors actually delivered');assert(fresh.frames.length>0,'entry has independent narration');assert(await page.locator('#msgs .narrative135-label').count()>0);
  // Simulate a previously saved pre-fix state; next normal UI send must gain a slot.
  await page.evaluate(()=>{const th=S.threads[curT];th.b98.narration135={lastTurn:th.b98.turns,shown:0};save();});
  const before=await page.evaluate(()=>S.threads[curT].msgs.filter(m=>m.narrative135).length);
  await page.locator('#cin').fill('凯尔，我要先核对证据。你手上有什么？');await page.locator('[data-send]').click();
  await page.waitForFunction(()=>{const th=S.threads[curT];return !busy&&th.b98.narration135?.version===2&&th.b98.narration135.shown>0;},null,{timeout:90000}).catch(async e=>{console.log('SEND_DIAGNOSTIC',JSON.stringify(await Promise.race([page.evaluate(()=>{const th=S.threads[curT];return {busy,phase:th.b98.phase,state:th.b98.narration135,tail:th.msgs.slice(-7),labelCount:document.querySelectorAll('#msgs .narrative135-label').length,input:document.querySelector('#cin')?.value,notices:document.body.innerText.slice(-800)};}),new Promise(resolve=>setTimeout(()=>resolve({unresponsive:true}),2000))])));throw e;});
  assert(await page.locator('#msgs .narrative135-label').count()>before,'resumed reply has a visible narrator');
  const resumed=await page.evaluate(()=>{const th=S.threads[curT];return {frames:th.msgs.filter(m=>m.narrative135).map(m=>({text:m.txt,origin:m.narrative135.origin})),state:th.b98.narration135,contextOn:contextOn135(th)};});
  if(report){fs.mkdirSync(report,{recursive:true});await page.evaluate(()=>{EXPERIENCE124.positions.delete(curT);scrollChat();});await page.screenshot({animations:'disabled',timeout:15000,path:path.join(report,'narration135-real-b98.png')});}
  // Preserve a legacy engine shape. Do not install a replacement world or add b98.
  const legacy=await page.evaluate(()=>{
   const base=S.threads[curT],w=JSON.parse(JSON.stringify(wd(base.wid))),wid='legacy-zero-test',id='legacy-zero-saved-test',bi=x=>({zh:x,en:x});w.id=wid;w.bible98=0;w.pack={chapters:[{t:bi('审判台'),goal:bi('核对眼前证据'),place:bi('审判台'),time:bi('第一夜'),choices:[],beats:[]}],secrets:[],bonus:[]};S.mine.worlds[wid]=w;
   const th=JSON.parse(JSON.stringify(base));th.id=id;th.wid=wid;delete th.b98;delete th.vers;delete th._pre73;delete th._ctx73;th.pk={ch:1,as:'side',me:1,st:'choose',picks:{},flags:{},q:[]};th.cast=base.cast.slice(0,2);th.rounds=4;th.msgs=[{who:'n',k:'act',txt:'审判台前，刚才的争执暂时停了下来。',at:Date.now()},{who:th.cast[0],k:'say',txt:'先核对证据。',at:Date.now()}];S.threads[id]=th;save();openThread(id);closeSheet();return {id,wid};
  });
  await page.evaluate(()=>{window.__readTap135=setInterval(()=>{if(READING.pending.has(curT)){EXPERIENCE124.positions.delete(curT);READING.advance();}},400);});
  const repliesBefore=await page.evaluate(()=>window.__replyDone135);
  await page.locator('#cin').fill('凯尔，先别着急。说清楚证据从哪里来。');await page.locator('[data-send]').click();
  await page.waitForFunction(n=>window.__replyDone135>n,repliesBefore,{timeout:120000});
  await page.evaluate(()=>clearInterval(window.__readTap135));
  const old=await page.evaluate(()=>{const th=S.threads[curT];renderChat();return {id:th.id,b98:!!th.b98,chapter:th.pk.ch,state:th.pk.narration135,policy:narrationPolicy135(th),route:window.__routes135,hook:playBeats.toString().includes('narrationPlayBase135'),tail:th.msgs.slice(-5),frames:th.msgs.filter(m=>m.narrative135).map(m=>({text:m.txt,origin:m.narrative135.origin})),labels:document.querySelectorAll('#msgs .narrative135-label').length,failed:th.replyFailed};});
  console.log('LEGACY_REPLY',JSON.stringify(old));
  assert.equal(old.id,legacy.id);assert.equal(old.b98,false);assert.equal(old.chapter,1);assert(!old.failed);assert(old.state&&old.state.shown>0,'legacy completed frame is counted');assert(old.labels>1,'new legacy performance has a narrator label');
  assert(requests.some(x=>x.kind==='narration'&&x.status===200));assert(requests.every(x=>x.status===200));assert.deepEqual(errors,[]);
  const result={origin,build:await page.evaluate(()=>window.MIRU_BUILD),fresh,resumed,legacy:old,requests,errors};
  if(report){await page.evaluate(()=>{EXPERIENCE124.positions.delete(curT);scrollChat();});await page.screenshot({animations:'disabled',timeout:15000,path:path.join(report,'narration135-real-legacy.png')});fs.writeFileSync(path.join(report,'narration135-real.json'),JSON.stringify(result,null,2));}
  console.log(JSON.stringify(result,null,2));console.log('Real LLM: fresh entry, resumed normal UI send, legacy saved engine and visible narration passed.');
 }finally{if(browser)await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
