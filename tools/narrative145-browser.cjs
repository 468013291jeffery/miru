// Actual bundle and beat98 in a fresh browser; synthetic model and account responses.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.MIRU_PLAYWRIGHT_MODULE||'playwright'),repo=process.cwd();
(async()=>{
 const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://local');if(u.pathname.startsWith('/api/')){res.writeHead(200,{'content-type':'application/json'});return res.end(JSON.stringify({ok:true,db:false,rows:[],works:[]}));}const file=path.resolve(repo,'.'+decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname));if(!file.startsWith(repo+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}res.writeHead(200,{'content-type':({'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png'})[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;let browser;
 try{
  browser=await chromium.launch({headless:true,executablePath:process.env.MIRU_EDGE,args:['--disable-gpu','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-background-networking','--disable-sync','--no-first-run']});const context=await browser.newContext({viewport:{width:430,height:920}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',async route=>{const u=new URL(route.request().url());if(route.request().resourceType()==='media')return route.fulfill({status:204,body:''});if(u.origin===origin)return route.continue();const file=path.resolve(repo,'.'+decodeURIComponent(u.pathname));if(u.hostname.endsWith('miru.plus')&&file.startsWith(repo+path.sep)&&fs.existsSync(file)&&fs.statSync(file).isFile())return route.fulfill({path:file});return route.fulfill({status:200,contentType:'application/json',body:'{}'});});
  await page.goto(origin,{waitUntil:'load'});await page.waitForFunction(()=>typeof narrationAfter135==='function');

  const result=await page.evaluate(async()=>{
   S.ob=S.ageOk=true;S.authChoice='guest';S.lang='zh';S.fxOff=S.sfxOff=true;S.bgm=false;S.voice=Object.assign({},S.voice,{auto:false});S.autoVoice=false;S.personas[0]={id:'story-reader',name:'林安',pron:'she',age:26};S.pid='story-reader';S.ciPrompt=today();S.cloud={token:'synthetic',uid:'synthetic',known:100,provider:'email'};S.keys=100;CL0.on=CL0.checked=true;
   liveOn=()=>true;aiGate=()=>true;useUnits=()=>{};gen96=async()=>null;cloudPush=async()=>{};walletDiff=()=>{};capi=async()=>({ok:true,status:200,j:{ok:true,rows:[],db:false}});startApp();closeSheet();
   let position='after',material=null,reject=false;const requests=[];
   ask=async(p,o={})=>{
    const th=S.threads[curT];
    if(p.startsWith('[MIRU_NARRATIVE145_REVIEW]')){const f=JSON.parse(p.split('\nCANDIDATE:')[1].split('\n只回JSON')[0]);requests.push({type:'review'});return {valid:!reject,materialIds:f.ids};}
    if(p.startsWith('[MIRU_NARRATIVE145]')){const packet=JSON.parse(p.split('PACKET_JSON:\n')[1].split('\nEND_PACKET')[0]),m=narrationBible135(th).narrative145.materials.find(m=>m.id===packet.allowedMaterials[0]?.id);requests.push({type:'narration',budget:packet.budget,ids:packet.allowedMaterials.map(m=>m.id)});return m?{paragraphs:m.prose.zh.split('\n\n'),materialIds:[m.id]}:null;}
    if(p.startsWith('You write MIRU'))return {beats:[{who:th.cast[0],kind:'say',text:'停刑先算数，指控还要拿记录核对。'},{who:th.cast[0],kind:'act',text:'我把剑收回，等你把要查的事说清。'}],status:{place:th.status.place},love:{},suggest:[],reaction:''};
    if(p.includes('"speakers"')){requests.push({type:'director'});return {narration:'',speakers:here98(th,scene98(th).s).slice(0,2).map(id=>({id,intent:'接住本轮提问',why:'有不同的公开信息可补充'})),narration_plan:{position,material},new_info:true,options:[]};}
    requests.push({type:'actor',hasProof:p.includes('zc1-proof')});
    return {act:'抬起目光，停住手里的动作。',say:th.b98&&th.b98.ch===7?'原始账本就在这里。先看记录，再问每个人当时做了什么。':'先把指控和眼前的故障分清。记录里能查到什么，就查什么。',feel:0,remember:''};
   };
   const wid=await installWork('w_scmw7f7e4565778126fa'),b=bOf98(wd(wid)),th=new98(wid,b.player.key);openThread(th.id);await enter98(th);closeSheet();
   const first=th.msgs.findIndex(m=>m.narrative145),actor=th.msgs.findIndex(m=>m.k==='box'&&m.say),entry=th.msgs[first];
   const start=th.msgs.length;requests.length=0;position='between';material='zc1-proof';appendMsg(th,{who:'me',k:'say',txt:'凯尔，我要核对处决的证据。'});await reply(th,{kind:'user',mode:'say',txt:'凯尔，我要核对处决的证据。'});renderChat();
   const tail=th.msgs.slice(start),middle=tail.findIndex(m=>m.narrative145),boxes=tail.map((m,i)=>m.k==='box'?i:-1).filter(i=>i>=0),between={middle,boxes,requests:requests.slice(),text:tail[middle]?.txt};
   position='after';material='zc1-writing';appendMsg(th,{who:'me',k:'say',txt:'我想看看锁环文字，大家都说说。'});await reply(th,{kind:'user',mode:'say',txt:'我想看看锁环文字，大家都说说。'});
   const saved=JSON.parse(JSON.stringify(th)),snap=snap73(th);th.b98.narrative145.facts.fake={id:'fake',text:'unreleased'};restore73(th,snap);
   const restore=!th.b98.narrative145.facts.fake,chapter1Frames=th.msgs.filter(m=>m.narrative145).map(m=>({text:m.txt,phase:m.narrative145.phase,kind:m.narrative145.kind}));
   const trial=new98(wid,b.player.key);trial.b98.ch=7;openThread(trial.id);await enter98(trial);closeSheet();position='after';material='zc7-cost';appendMsg(trial,{who:'me',k:'say',txt:'先说清王冠拿走记忆的代价。'});await reply(trial,{kind:'user',mode:'say',txt:'先说清王冠拿走记忆的代价。'});
   material='zc7-charge';reject=true;appendMsg(trial,{who:'me',k:'say',txt:'账本里有碎片被盗的记录吗？'});await reply(trial,{kind:'user',mode:'say',txt:'账本里有碎片被盗的记录吗？'});reject=false;
   const reveal={facts:Object.keys(trial.b98.narrative145.facts),frames:trial.msgs.filter(m=>m.narrative145).map(m=>({kind:m.narrative145.kind,text:m.txt,origin:m.narrative145.origin}))};
   const w=JSON.parse(JSON.stringify(wd(wid)));w.id='legacy145';w.bible98=0;const bi=x=>({zh:x,en:x});w.pack={chapters:[{t:bi('审判台'),goal:bi('查证据'),place:bi('王城·悬空审判台'),time:bi('第一夜'),choices:[],beats:[]}],secrets:[],bonus:[]};S.mine.worlds[w.id]=w;
   const old=JSON.parse(JSON.stringify(th));delete old.b98;delete old.vers;delete old._pre73;old.id='legacy145';old.wid=w.id;old.pk={ch:1,as:'side',me:1,st:'choose',picks:{},flags:{},q:[]};old.cast=th.cast.slice(0,2);old.msgs=[];old.status.place='王城·悬空审判台';old.rounds=1;S.threads[old.id]=old;openThread(old.id);closeSheet();
   const timer=setInterval(()=>{if(READING.pending.has(curT)){EXPERIENCE124.positions.delete(curT);READING.advance();}},300);try{appendMsg(old,{who:'me',k:'say',txt:'凯尔，我要核对证据。'});await reply(old,{kind:'user',mode:'say',txt:'凯尔，我要核对证据。'});}finally{clearInterval(timer);}renderChat();
   const another=await install98('w_mr_dreamreunion'),other=new98(another,bOf98(wd(another)).player.key);
   return {entry:{first,actor,text:entry.txt},between,chapter1Frames,restore,savedFrames:saved.msgs.filter(m=>m.narrative145).length,reveal,legacy:{b98:!!old.b98,chapter:old.pk.ch,text:old.msgs.find(m=>m.narrative145)?.txt,known:Object.keys(old.pk.narrative145.facts)},otherEnabled:narrativeOn145(other)};
  });
  assert(result.entry.first<result.entry.actor);assert(result.entry.text.length>100);assert(result.between.middle>result.between.boxes[0]);assert(result.between.middle<result.between.boxes[1]);assert(result.between.requests.filter(x=>x.type==='actor')[1].hasProof);
  assert(result.chapter1Frames.every(m=>m.text.length>90));assert(result.chapter1Frames.some(m=>m.phase==='after'));assert(result.restore);assert.equal(result.savedFrames,3);assert(result.reveal.facts.includes('zc7-cost'));assert(result.reveal.facts.includes('zc7-charge'));assert(result.reveal.frames.some(m=>m.kind==='reveal'&&m.origin==='authored'&&m.text.length>160));assert.equal(result.legacy.b98,false);assert.equal(result.legacy.chapter,1);assert(result.legacy.text.length>90);assert.equal(result.otherEnabled,true);
  const frame=page.locator('#msgs .narrative145').last();await frame.waitFor({state:'visible'});const visual=await frame.evaluate(el=>({label:el.querySelector('.narrative135-label')?.textContent,bg:getComputedStyle(el).backgroundColor,whiteSpace:getComputedStyle(el).whiteSpace}));assert.equal(visual.label,'旁白');assert(visual.bg.includes('0.94'));assert.equal(visual.whiteSpace,'pre-line');assert.deepEqual(errors,[]);
  if(process.env.MIRU_REPORT_DIR){fs.mkdirSync(process.env.MIRU_REPORT_DIR,{recursive:true});await page.screenshot({animations:'disabled',timeout:15000,path:path.join(process.env.MIRU_REPORT_DIR,'narrative145-browser.png')});fs.writeFileSync(path.join(process.env.MIRU_REPORT_DIR,'narrative145-browser.json'),JSON.stringify({...result,visual,errors},null,2));}
  console.log(JSON.stringify(result,null,2));console.log('Story narration v2 browser: before/between/after, witnessed clues, gated reveal, semantic fallback, snapshots and legacy engine passed.');
 }finally{if(browser)await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
