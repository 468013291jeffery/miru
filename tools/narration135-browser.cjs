// Actual bundle and beat98 in a fresh browser; synthetic model and account responses.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.MIRU_PLAYWRIGHT_MODULE||'playwright'),repo=process.cwd();
(async()=>{
 const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://local');if(u.pathname.startsWith('/api/')){res.writeHead(200,{'content-type':'application/json'});return res.end(JSON.stringify({ok:true,db:false,rows:[],works:[]}));}const file=path.resolve(repo,'.'+decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname));if(!file.startsWith(repo+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}res.writeHead(200,{'content-type':({'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png'})[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;let browser;
 try{
  browser=await chromium.launch({headless:true,executablePath:process.env.MIRU_EDGE,args:['--disable-background-networking','--disable-sync','--no-first-run']});const context=await browser.newContext({viewport:{width:430,height:920}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',async route=>{const u=new URL(route.request().url());if(u.origin===origin)return route.continue();const file=path.resolve(repo,'.'+decodeURIComponent(u.pathname));if(u.hostname.endsWith('miru.plus')&&file.startsWith(repo+path.sep)&&fs.existsSync(file)&&fs.statSync(file).isFile())return route.fulfill({path:file});return route.fulfill({status:200,contentType:'application/json',body:'{}'});});
  await page.goto(origin,{waitUntil:'load'});await page.waitForFunction(()=>typeof narrationAfter135==='function');
  const result=await page.evaluate(async()=>{
   S.ob=S.ageOk=true;S.authChoice='guest';S.lang='zh';S.fxOff=S.sfxOff=true;S.bgm=false;S.voice=Object.assign({},S.voice,{auto:false});S.autoVoice=false;S.personas[0]={id:'pilot-reader',name:'测试读者',pron:'she',age:26};S.pid='pilot-reader';S.ciPrompt=today();S.cloud={token:'synthetic',uid:'synthetic',known:100,provider:'email'};S.keys=100;CL0.on=CL0.checked=true;
   liveOn=()=>true;aiGate=()=>true;useUnits=()=>{};gen96=async()=>null;cloudPush=async()=>{};walletDiff=()=>{};capi=async()=>({ok:true,status:200,j:{ok:true,rows:[],db:false}});startApp();closeSheet();
   const requests=[];
   ask=async(p,o={})=>{
    const th=S.threads[curT],{s}=scene98(th);
    if(p.startsWith('[MIRU_NARRATION135]')){
      const sources=JSON.parse(p.split('VISIBLE_SOURCES_JSON:\n')[1].split('\nEND_VISIBLE_SOURCES')[0]);
      requests.push({type:'narration',optional:o.optional,isolated:o.isolatedContext});
      return {text:'凯尔拿出一枚从未出现的戒指，已经把证据全部交给了你。',sources:[sources.find(x=>x.type==='action').id]};
    }
    if(p.includes('"speakers"')){requests.push({type:'director'});return {narration:'',speakers:here98(th,s).slice(0,2).map(id=>({id,intent:'先回应她'})),beat:'危机',new_info:true,fx:{},options:[],summary:'玩家要求核对证据。'};}
    const kyle=p.startsWith('你是「凯尔');requests.push({type:'actor',who:kyle?'凯尔':'卢西安'});
    return kyle?{act:'＊ 凯尔 拇指离开护手，朝台下抬手，声音压低',say:'处决先撤，审判令暂缓。你要证据，我让人当场封存复核。要查哪一样，你说。',feel:0,remember:''}:{act:'＊ 卢西安没有伸手，想了想。',say:'先核对眼前这张纸，别把猜测当成证据。',feel:0,remember:''};
   };
   const wid=await install98('w_scmw7f7e4565778126fa'),b=bOf98(wd(wid)),th=new98(wid,b.player.key);
   openThread(th.id);await enter98(th);closeSheet();th.b98.turns=6;requests.length=0;
   th.msgs=th.msgs.filter(m=>!m.narrative135);th.b98.narration135={version:2,lastTurn:5,lastAttempt:5,attempts:0,shown:0,failed:0,rejected:0,ms:0};
   await pick98(th,0);renderChat();
   const choiceRequests=requests.splice(0),choiceFrame=th.msgs.filter(m=>m.narrative135).at(-1);
   const actorIndex=th.msgs.findLastIndex(m=>m.k==='box'||m.k==='say'&&m.ai),frameIndex=th.msgs.findLastIndex(m=>m.narrative135);
   th.b98.turns+=3;appendMsg(th,{who:'me',k:'say',txt:'凯尔，把证据说清楚。'});
   await beat98(th,'talk',{txt:'凯尔，把证据说清楚。',mode:'say'});renderChat();
   const frames=th.msgs.filter(m=>m.narrative135),saved=JSON.parse(JSON.stringify(th)),st=snap73(th);th.b98.narration135.shown=99;restore73(th,st);
   const restored=th.b98.narration135.shown;
   const other=await install98('w_mr_dreamreunion'),old=new98(other,bOf98(wd(other)).player.key);
   return {title:th.title,choiceRequests,requests,choiceFrame,frames:frames.map(m=>({text:m.txt,origin:m.narrative135.origin,cue:m.narrative135.cue})),actorIndex,frameIndex,savedHasFrame:saved.msgs.some(m=>m.narrative135),restored,pilot:narrationOn135(th),otherEnabled:narrationOn135(old),contextEnabled:contextOn135(th),stats:th.b98.narration135};
  });
  if(process.env.MIRU_REPORT_DIR){fs.mkdirSync(process.env.MIRU_REPORT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.MIRU_REPORT_DIR,'narration135-debug.png')});}
  assert.equal(result.pilot,true);assert.equal(result.otherEnabled,false);assert.equal(result.frames.length,2);assert(result.frameIndex>result.actorIndex);assert.equal(result.savedHasFrame,true);assert.equal(result.restored,2);
  assert.deepEqual(result.choiceRequests.map(x=>x.type),['director','actor','actor','narration']);
  assert.equal(result.choiceFrame.narrative135.origin,'bridge');assert(result.choiceFrame.txt.includes('凯尔'));assert(result.choiceFrame.txt.includes('卢西安'));
  assert(result.requests.some(x=>x.type==='narration'&&x.optional&&x.isolated));assert(result.frames.every(x=>x.origin==='bridge'&&!x.text.includes('戒指')&&!x.text.includes('全部交给')));
  const frame=page.locator('#msgs .m-narr.narrative135').last();await frame.waitFor({state:'visible'});assert.equal(await frame.locator('.narrative135-label').innerText(),'旁白');
  const history=await page.evaluate(()=>{const m=document.getElementById('msgs');m.scrollTop=0;m.dispatchEvent(new Event('scroll'));const before=m.scrollTop;renderChat();return {before,after:document.getElementById('msgs').scrollTop,hold:EXPERIENCE124.positions.get(curT)?.away};});
  assert(history.hold);assert(Math.abs(history.after-history.before)<2);await page.locator('[data-latest124]').click();
  const distance=await page.evaluate(()=>{const m=document.getElementById('msgs');return m.scrollHeight-m.scrollTop-m.clientHeight;});assert(distance<72);
  assert.deepEqual(errors,[]);
  if(process.env.MIRU_REPORT_DIR){fs.mkdirSync(process.env.MIRU_REPORT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.MIRU_REPORT_DIR,'narration135.png')});fs.writeFileSync(path.join(process.env.MIRU_REPORT_DIR,'narration135-browser.json'),JSON.stringify({...result,errors},null,2));}console.log(JSON.stringify(result,null,2));console.log('Narration browser: screenshot choice, two actors, rejected model fallback, narration label, history hold, latest jump and state restore passed.');
 }finally{if(browser)await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
