import asyncio,json,pathlib
from playwright.async_api import async_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
OUT=ROOT.parent/'browser-review';OUT.mkdir(exist_ok=True)
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True)
  context=await browser.new_context(viewport={'width':390,'height':844},device_scale_factor=1)
  page=await context.new_page();errors=[]
  page.on('pageerror',lambda e:(errors.append(str(e)),print('PAGE_ERROR: '+str(e),flush=True)))
  await page.goto('http://127.0.0.1:8119/',wait_until='domcontentloaded')
  await page.wait_for_timeout(1500)
  result=await page.evaluate('''async () => {
   const dir='content/official/m119-breakup-v2/', [script,payload,A]=await Promise.all([fetch(dir+'script.md').then(r=>r.text()),fetch(dir+'publish-payload.json').then(r=>r.json()),fetch(dir+'asset-map.template.json').then(r=>r.json())]);
   S.lang='zh';S.autoVoice=false;S.bgm=false;S.sfx=false;OFF94.cur={id:'w_miru_m119'};OFF94.assets.w_miru_m119=A;
   const doc=imParse(script),r=imBuild(doc,'side'),wid=r.wid||r,w=wd(wid);w.community='w_miru_m119';w.official76=true;
   for(const k of ['title','hook','premise','you'])w[k]={zh:payload.patch.meta[k],en:payload.patch.meta.en[k]};w.premiseAuthor=1;
   off94MergeEn(wid,payload.patch);OFF94.cur=null;window.__m119test={wid,doc};
   const th=newThread(null,wid,null,{as:w.you94||w.pack.pov});th.pk.me=1;window.__m119test.thid=th.id;openThread(th.id);
   return {wid,thid:th.id,chapters:w.pack.chapters.length,native:w.pack.nativeV2,scoped:w.pack.m119,cast:w.cast.map(id=>({name:ch(id).n,n94:ch(id).n94,g:ch(id).g,age:ch(id).age})),joins:packModes(w),goals:w.pack.chapters.map(c=>c.done163),bg:th.pk.bg,premise:w.premise};
  }''')
  await page.wait_for_timeout(1200)
  await page.screenshot(path=str(OUT/'opening-zh.png'))
  print(json.dumps(await page.evaluate('''() => ({as:S.threads[__m119test.thid].pk.as,you:wd(__m119test.wid).you94,pov:wd(__m119test.wid).pack.pov})''')),flush=True)
  checks=await page.evaluate('''async () => {
   const assert=(v,m)=>{if(!v)throw Error(m);},out={games:0,actions:0,ai:'stubbed for deterministic navigation'},oldTh=S.threads[window.__m119test.thid],w=wd(oldTh.wid);
   // Drive the actual shared queue; this checks navigation, not model quality.
   reply=async()=>{};busy=false;stopVoice();oldTh._gen=(oldTh._gen||0)+1;if(PKNEXT[oldTh.id])PKNEXT[oldTh.id]();if(PKWAIT[oldTh.id])PKWAIT[oldTh.id]([]);pkWait=async()=>{};READING.wait=async()=>{};readMs=()=>0;S.pkTap101=false;
   const th=newThread(null,w.id,null,{as:w.you94||w.pack.pov});th.pk.me=1;window.__m119test.thid=th.id;openThread(th.id);PKPAUSE[th.id]=false;
   let last='',stalls=0;
   for(let i=0;i<1400;i++){
    stopVoice();if(PKNEXT[th.id])PKNEXT[th.id]();
    if(th._held162&&window.SC162)SC162.release(th);
    if(window.READING?.pending?.get(th.id))READING.pending.get(th.id).finish();
    const status=JSON.stringify([th.pk.ch,th.pk.st,th.pk.stop?.[1],th.pk.q?.length,Object.keys(__m119.state(th).commits).length]);
    if(status===last)stalls++;else stalls=0;last=status;if(stalls>150)throw Error('Queue stalled: '+status+' '+JSON.stringify({live:__pkLive(th),current:curT,hidden:document.getElementById('s-chat').hidden,reading:!!READING.pending.get(th.id),voice:READING.voice.busy(),first:th.pk.q?.[0],scene:__m119.state(th).current_scene,errors:PKREG.errors}));
    if(th.pk.stop){const b=th.pk.stop;if(b[1]==='mg'){stopResolve(th,mgResult(th,b[2],'skip'));out.actions++;}
     else if(b[1]==='line'){packChooseLine(th,0);out.actions++;}
     else if(b[1]==='start'){stopResolve(th,[]);out.actions++;}}
    else if(th.pk.st==='choose'){await Promise.race([Promise.resolve(packPick('A')),new Promise((_,reject)=>setTimeout(()=>reject(Error('Chapter choice timed out: '+JSON.stringify({ch:th.pk.ch,flags:th.pk.flags,goals:w.pack.chapters[th.pk.ch-1].done163,g:th.pk.g163}))),4000))]);out.actions++;}
    else if(th.pk.st==='next'){assert(!chLocked(w.id,th.pk.ch+1),'Unexpected chapter pay gate');packOpen(th,th.pk.ch+1,false);out.actions++;}
    else if(th.pk.st==='end')break;
    await new Promise(r=>setTimeout(r,10));
   }
   const s=__m119.state(th);assert(Object.keys(s.commits).length===64,'Not all 64 scene decisions committed');assert(Object.keys(s.games).length===32,'Missing game result');assert(th.pk.st==='end','Story did not reach its ending');assert(s.resource.escrow_million_not_income===1000000&&s.resource.cash_available===25000,'Escrow became revenue');assert(__m119.engine.ending(s).relationship==='INDEPENDENT','Navigation invented romance');out.route={scenes:Object.keys(s.commits).length,games:Object.keys(s.games).length,state:th.pk.st};
   // Exercise each real form in both languages, including wrong answers and skip.
   for(const lang of ['zh','en']){S.lang=lang;for(const g of M119_GAMES.items)for(const expected of ['win','lose','skip']){
    let got=null;mgOpen(g.id,r=>got=r);const A=MGX.ov.querySelector('.mgarea');
    if(expected==='skip')MGX.ov.querySelector('[data-mgskip]').click();
    else{const opts=g.options[lang],find=t=>[...A.querySelectorAll('button')].find(b=>b.textContent===t);
     if(g.mode==='budget')[...A.querySelectorAll('input')].forEach((f,i)=>f.value=expected==='win'?g.answer[i]:999);
     else if(g.mode==='privacy')[...A.querySelectorAll('select')].forEach((f,i)=>f.value=expected==='win'?g.answer[i]:'');
     else if(g.mode==='single')find(opts[expected==='win'?g.answer[0]:opts.findIndex((_,i)=>!g.answer.includes(i))]).click();
     else if(g.mode==='sequence')for(const i of (expected==='win'?g.answer:g.answer.slice().reverse()))find(opts[i]).click();
     else if(expected==='win')for(const i of g.answer)find(opts[i]).click();
     if(g.mode!=='single')[...A.querySelectorAll('button')].at(-1).click();
     assert(MGX.ov.querySelector('.mgres').dataset.r===expected,'Wrong form result '+g.id+' '+expected);
     if(lang==='en')assert(!/[\\u3400-\\u9fff]/.test(MGX.ov.textContent),'Chinese leaked into English game '+g.id);
     MGX.ov.querySelector('[data-mgback]').click();
    }assert(got===expected,'Form callback mismatch '+g.id);out.games++;
   }}
   S.lang='en';off94Names();renderChat();out.englishTail=th.msgs.slice(-8).map(m=>m.txt||'');out.pkErrors=PKREG.errors;
   assert(!/[\\u3400-\\u9fff]/.test(document.querySelector('.m-end')?.textContent||''),'Chinese leaked into the English ending');
   assert(__m119.summary(th,'en').includes('Independent investigation continues'),'Missing English ending summary');
   assert(off94PreviewSrc({A:OFF94.assets.w_miru_m119}).endsWith('d37be3eb.mp4'),'English trailer mapping');S.lang='zh';assert(off94PreviewSrc({A:OFF94.assets.w_miru_m119}).endsWith('d37be3eb-zh.mp4'),'Chinese trailer mapping');S.lang='en';
   const serialized=JSON.stringify(s),restored=JSON.parse(serialized);assert(JSON.stringify(__m119.engine.ending(restored))===JSON.stringify(__m119.engine.ending(s)),'Ending changed after JSON save');out.saveRestored=true;
   return out;
  }''')
  await page.screenshot(path=str(OUT/'ending-en.png'))
  result['checks']=checks
  result['pageErrors']=errors
  (OUT/'initial.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),'utf8')
  print(json.dumps(result,ensure_ascii=False)[:5500],flush=True)
  await browser.close()
asyncio.run(main())
