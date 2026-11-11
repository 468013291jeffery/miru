// Isolated synthetic reader, real application routing and real production LLM transport.
// Account/billing/ancillary calls are isolated; ask/director/actor/narration are never canned.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{spawn}=require('node:child_process');
function publicModel(raw){return new Promise((resolve,reject)=>{const args=['-sS','--connect-timeout','10','--max-time','65','-H','content-type: application/json','-H','origin: https://miru.plus','--data-binary','@-','-w','\n__MIRU_HTTP__:%{http_code}','https://miru.plus/api/longcat'];if(process.env.MIRU_TEST_PROXY)args.unshift('--proxy',process.env.MIRU_TEST_PROXY);const transport=process.env.MIRU_MODEL_TRANSPORT==='ssh';const remote="curl -sS --connect-timeout 10 --max-time 65 -H 'content-type: application/json' -H 'origin: https://miru.plus' --data-binary @- -w '\\n__MIRU_HTTP__:%{http_code}' http://127.0.0.1:3000/api/longcat";const c=transport?spawn('ssh',['-o','BatchMode=yes','-o','StrictHostKeyChecking=yes','-o','ConnectTimeout=10','-i','/Users/tiger/.ssh/miru_deploy_mac_ed25519','debian@51.81.92.252',remote]):spawn('/usr/bin/curl',args),out=[],err=[];c.stdout.on('data',x=>out.push(x));c.stderr.on('data',x=>err.push(x));c.stdin.on('error',()=>{});c.on('error',reject);c.on('close',code=>{const text=Buffer.concat(out).toString(),at=text.lastIndexOf('\n__MIRU_HTTP__:');if(code||at<0)return reject(Error(Buffer.concat(err).toString().slice(0,160)||'curl transport '+code));resolve({status:Number(text.slice(at+15)),body:text.slice(0,at)});});c.stdin.end(raw);});}
const {chromium}=require(process.env.MIRU_PLAYWRIGHT_MODULE||'playwright'),repo=process.cwd(),report=process.env.MIRU_REPORT_DIR;
(async()=>{
 const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://local'),file=path.resolve(repo,'.'+decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname));if(!file.startsWith(repo+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}res.setHeader('content-type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const local='http://127.0.0.1:'+server.address().port,origin=process.env.MIRU_LIVE_ORIGIN||local;let browser;
 try{
  browser=await chromium.launch({proxy:process.env.MIRU_TEST_PROXY?{server:process.env.MIRU_TEST_PROXY,bypass:'localhost,127.0.0.1'}:undefined,headless:true,executablePath:process.env.MIRU_EDGE,args:['--disable-gpu','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-background-networking','--disable-sync','--no-first-run']});const context=await browser.newContext({viewport:{width:430,height:920}}),page=await context.newPage(),errors=[],requests=[];
  page.on('pageerror',e=>{errors.push(e.message);console.log('PAGE_ERROR',e.message);});page.on('console',m=>{if(/\[story98\]|\[narrative145\]/.test(m.text()))console.log('APP_LOG',m.text().slice(0,450));});
  await page.addInitScript(o=>{window.MIRU_PROXY=o+'/api/longcat';},origin);
  // Headless macOS audio initialization is excluded from these text interaction checks.
  await page.addInitScript(()=>{window.AudioContext=undefined;window.webkitAudioContext=undefined;});
  await page.route('**/*',async route=>{const u=new URL(route.request().url());if(route.request().resourceType()==='media')return route.fulfill({status:204,body:''});
   if(u.pathname==='/api/longcat'){
    const body=route.request().postDataJSON(),prompt=body.messages.map(m=>m.content).join('\n'),kind=prompt.startsWith('[MIRU_NARRATIVE145_REVIEW]')?'review':prompt.startsWith('[MIRU_NARRATIVE145]')?'narration':prompt.includes('"speakers"')?'director':'actor-or-writer',record={kind,status:0,started:Date.now()};requests.push(record);console.log("REAL_REQUEST",JSON.stringify({kind,chars:prompt.length}));
    let response;try{response=await publicModel(route.request().postData());}catch(e){record.error=String(e.message).slice(0,160);console.log('MODEL_ERROR',JSON.stringify(record));return route.abort('timedout');}
    if(kind==='narration'||kind==='review'){try{record.modelOutput=JSON.parse(response.body).choices?.[0]?.message?.content||'';}catch(_){}}record.privateThought=prompt.includes('我把担忧藏在心底');record.status=response.status;record.ms=Date.now()-record.started;delete record.started;record.transport=process.env.MIRU_MODEL_TRANSPORT==='ssh'?'ssh-local-production-api':'curl-public-api';console.log('REAL_MODEL',JSON.stringify(record));
    return route.fulfill({status:response.status,contentType:body.stream?'text/event-stream':'application/json',body:response.body});
   }
   if(u.pathname.startsWith('/api/'))return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,db:false,rows:[],works:[]})});
   if(u.origin===origin)return route.continue();
   if(u.hostname.endsWith('miru.plus')){const file=path.resolve(repo,'.'+decodeURIComponent(u.pathname));if(file.startsWith(repo+path.sep)&&fs.existsSync(file)&&fs.statSync(file).isFile())return route.fulfill({path:file});}
   return route.fulfill({status:200,contentType:'application/json',body:'{}'});
  });
  async function screenshot146(file){const cdp=await context.newCDPSession(page);try{const result=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true});fs.writeFileSync(file,Buffer.from(result.data,'base64'));}finally{await cdp.detach();}}
  await page.goto(origin,{waitUntil:'load'});await page.waitForFunction(()=>typeof narrativeOn145==='function');

  const fresh=await page.evaluate(async()=>{
   S.ob=S.ageOk=true;S.authChoice='guest';S.lang='zh';S.fxOff=S.sfxOff=true;S.bgm=false;S.voice=Object.assign({},S.voice,{auto:false});S.autoVoice=false;S.personas[0]={id:'v2-real-reader',name:'林安',pron:'she',age:26};S.pid='v2-real-reader';S.ciPrompt=today();S.cloud={token:'isolated-test',uid:'isolated-test',known:100,provider:'email'};S.keys=100;CL0.on=CL0.checked=true;
   bgmInit=()=>false;aiGate=()=>true;useUnits=()=>{};gen96=async()=>null;cloudPush=async()=>{};walletDiff=()=>{};capi=async()=>({ok:true,status:200,j:{ok:true,rows:[],db:false}});lcApply();startApp();closeSheet();window.__readAll145=setInterval(()=>{if(READING.pending.has(curT)){EXPERIENCE124.positions.delete(curT);READING.advance();}},300);window.__done145=0;const original=reply;reply=async function(){try{return await original.apply(this,arguments);}finally{window.__done145++;}};
   const wid=await installWork('w_scmwaymue65be8983c9b'),b=bOf98(wd(wid)),th=new98(wid,b.player.key);if(!narrativeOn145(th))throw Error('New narration policy not loaded');openThread(th.id);await new Promise(r=>setTimeout(r,1100));lcApply();SAMPLE=LC_SAMPLE;S.live=true;const until=Date.now()+15000;while(busy&&Date.now()<until)await new Promise(r=>setTimeout(r,100));await enter98(th);closeSheet();renderChat();
   window.__first145=th.id;return {id:th.id,live:liveOn(),sample:SAMPLE===LC_SAMPLE,busy,notice:document.body.innerText.slice(-300),frames:th.msgs.filter(m=>m.narrative145).map(m=>({text:m.txt,phase:m.narrative145.phase,origin:m.narrative145.origin})),actors:th.msgs.filter(m=>m.k==='box'&&m.say).length,entryIndex:th.msgs.findIndex(m=>m.narrative145),actorIndex:th.msgs.findIndex(m=>m.k==='box'&&m.say)};
  });
  console.log('FRESH_V2',JSON.stringify(fresh));assert(fresh.actors>0);assert(fresh.entryIndex<fresh.actorIndex);assert(fresh.frames[0].origin==='authored'?fresh.frames[0].text.length>60:fresh.frames[0].text.length>=100);

  const ideas=await page.evaluate(async()=>{const th=S.threads[curT],items=await dialogueGetIdeas(th);setSugg(items);return items.map(x=>playerInput146(x));});
  console.log('REAL_IDEAS',JSON.stringify(ideas));assert(ideas.length>=2);assert(ideas.some(x=>x.mode==='act'));assert(ideas.some(x=>x.mode==='think'));
  const beforeAction=await page.evaluate(()=>window.__done145);await page.locator('#sugg [data-input-kind="act"]').evaluate(el=>el.click());await page.waitForFunction(n=>window.__done145>n,beforeAction,{timeout:120000});
  const action=await page.evaluate(()=>S.threads[curT].msgs.filter(m=>m.who==='me').at(-1));assert.equal(action.k,'act');
  async function send(text){const n=await page.evaluate(()=>window.__done145);await page.locator('#cin').fill(text);await page.locator('[data-send]').evaluate(el=>el.click());await page.waitForFunction(n=>window.__done145>n,n,{timeout:120000});}
  await send('（我把担忧藏在心底，暂时不告诉任何人。）');
  const thought=await page.evaluate(()=>S.threads[curT].msgs.filter(m=>m.who==='me').at(-1));assert.equal(thought.k,'think');assert(!requests.filter(r=>r.kind==='actor-or-writer').some(r=>r.privateThought));
  await page.locator('[data-inputmenu124]').evaluate(el=>el.click());await page.locator('[data-input124="say"]').evaluate(el=>el.click());
  const count=await page.evaluate(()=>S.threads[curT].msgs.filter(m=>m.narrative145).length);
  await send('诺亚，我想核对登记本和签字记录。请先说清你当时做了什么。');
  const result=await page.evaluate(()=>{const th=S.threads[curT];EXPERIENCE124.positions.delete(curT);scrollChat();return {build:window.MIRU_BUILD,frames:th.msgs.filter(m=>m.narrative145).map(m=>({text:m.txt,origin:m.narrative145.origin,kind:m.narrative145.kind})),stats:narrativeState145(th),messages:th.msgs.filter(m=>m.who==='me').map(m=>({kind:m.k,text:m.txt})),suggestions:th.sugg};});
  assert(result.frames.length>count,'investigation adds relevant narration');assert(result.frames.at(-1).text.length>=90);assert(!result.frames.at(-1).text.includes('给出了回应'));assert.deepEqual(errors,[]);
  const summary={origin,ideas,action:{kind:action.k,text:action.txt},thought:{kind:thought.k,text:thought.txt},...result,requests,errors};
  if(report){fs.mkdirSync(report,{recursive:true});fs.writeFileSync(path.join(report,'input146-real.json'),JSON.stringify(summary,null,2));await screenshot146(path.join(report,'input146-real.png'));}
  console.log(JSON.stringify(summary,null,2));console.log('Real North Light: typed AI ideas, action send, private thought boundary, generic narration and investigation passed.');
 }finally{if(browser)await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
