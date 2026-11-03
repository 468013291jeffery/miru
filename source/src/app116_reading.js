/* Reading is acknowledged by the player, never by a timer or a voice callback. */
(function(){
 'use strict';
 const R={pending:new Map(),ack:new WeakMap()};
 const rawSpeak=speak,rawStop=stopVoice;
 const A={queue:[],active:null,starting:false};
 const audible=()=>{try{if(typeof AUD_CUR!=='undefined'&&AUD_CUR&&!AUD_CUR.paused&&!AUD_CUR.ended)return true;}catch(e){console.debug('[reading] audio state',e);}try{return !!(window.speechSynthesis&&(speechSynthesis.speaking||speechSynthesis.pending));}catch(e){return false;}};
 A.busy=()=>!!A.active||A.queue.length>0||audible();
 A.pump=function(){
  if(A.active||!A.queue.length)return;const item=A.queue.shift();A.active=item;item.startedAt=Date.now();item.completed=false;
  const finish=()=>{if(A.active!==item)return;clearInterval(item.watch);A.active=null;paint();if(item.onend)item.onend();A.pump();};
  const completed=()=>{item.completed=true;if(!audible())finish();};
  item.watch=setInterval(()=>{
   if(A.active!==item){clearInterval(item.watch);return;}
   if(item.completed&&!audible()){finish();return;}
   // A failed request may release the voice lock; an audible line never times out.
   if(!audible()&&Date.now()-item.startedAt>25000){rawStop();item.completed=true;finish();}
  },200);
  A.starting=true;try{rawSpeak(item.text,item.who,completed);}catch(e){console.warn('[reading] voice failed',e);completed();}finally{A.starting=false;}
  paint();
 };
 speak=function(text,who,onend){A.queue.push({text,who,onend});A.pump();};
 stopVoice=function(){
  if(A.starting)return rawStop.apply(this,arguments);
  const active=A.active;if(active)clearInterval(active.watch);A.active=null;A.queue.length=0;
  const result=rawStop.apply(this,arguments);paint();return result;
 };
 R.voice=A;
 R.manual=()=>true;
 const readable=m=>m&&((typeof m.txt==='string'&&m.txt.trim())||m.k==='intro'||m.k==='chap');
 const signature=m=>String(m.txt||'')+'|'+String(m.last||'');
 /* 2026-11-03（玩家：「下一句」没必要做成一条大横幅，点一下屏幕就该继续）
    ⇒ 不再画大横幅。等你读的时候，点屏幕任意空处 / 点那句话 = 下一句。
    只有前 5 次在输入区上方飘一行很淡的小字「轻点屏幕继续」，之后什么都不显示。朗读中显示「朗读中…」，点一下就停读。 */
 const HINT_N=5;
 function paint(){
  const th=S.threads[curT],chat=$('#s-chat');if(!chat)return;
  chat.classList.add('manual-reading');
  const old=chat.querySelector('[data-reading-bar]');if(old)old.remove();
  let tip=chat.querySelector('[data-tap-hint]');const entry=th&&R.pending.get(th.id);
  chat.classList.toggle('await-tap',!!entry);
  const voicing=A.busy();
  const show=entry&&(voicing||(S.tapHintN||0)<HINT_N);
  if(!show){if(tip)tip.remove();return;}
  if(!tip){tip=document.createElement('div');tip.dataset.tapHint='1';tip.className='tap-hint';const composer=chat.querySelector('.composer');if(composer)composer.before(tip);else chat.appendChild(tip);}
  tip.textContent=voicing?'朗读中… 点一下停止':'轻点屏幕继续 ›';
  tip.classList.toggle('voicing',voicing);
 }
 R.wait=function(th,message,kind){
  if(!th||!readable(message))return Promise.resolve();
  const sig=signature(message);if(R.ack.get(message)===sig)return Promise.resolve();
  const current=R.pending.get(th.id);if(current)return current.promise;
  let resolve;const promise=new Promise(r=>resolve=r);
  const entry={message,sig,promise,kind,finish:null};
  entry.finish=()=>{
   if(R.pending.get(th.id)!==entry||A.busy())return;
   R.ack.set(message,sig);R.pending.delete(th.id);
   if(PKNEXT[th.id]===entry.finish)delete PKNEXT[th.id];
   th._unread=0;paint();resolve();
  };
  R.pending.set(th.id,entry);if(kind==='script')PKNEXT[th.id]=entry.finish;
  if(R._counted!==message){R._counted=message;S.tapHintN=(S.tapHintN||0)+1;}
  paint();return promise;
 };
 R.advance=function(){if(window.EXPERIENCE124&&EXPERIENCE124.readingHistory())return false;const th=S.threads[curT],chat=$('#s-chat');if(!th||!chat||chat.hidden||(typeof HIST_OPEN!=='undefined'&&HIST_OPEN))return false;
  const entry=R.pending.get(th.id);if(!entry||A.busy())return false;
  entry.finish();return true;
 };
 window.READING=R;
 // Replace all older automatic/voice and narration-burst wait shortcuts at the final entry point.
 pkSpd=function(){return 0;};
 pkWait=function(th,prev){th._held=0;return R.wait(th,prev,'script');};
 const append=pkAppend;pkAppend=function(th,message){if(isNarr(message))th._brk=1;return append.apply(this,arguments);};
 if(typeof streamPreview==='function'){const preview=streamPreview;streamPreview=function(){if(!R.manual())return preview.apply(this,arguments);};}
 window.addEventListener('click',ev=>{if(window.EXPERIENCE124&&EXPERIENCE124.readingHistory()&&ev.target.closest('#msgs'))return;
  if(ev.target.closest('[data-reading-next]')){ev.preventDefault();ev.stopImmediatePropagation();R.advance();return;}
  /* 点屏幕 = 下一句。点在气泡上要等 230ms：双击是给这句回 ❤️（app122），不能顺手翻掉两句 */
  {const th=S.threads[curT],chat=$('#s-chat');
   /* 剧情停在「▶ 继续剧情」（比如刷新页面后）时，点屏幕也算继续 */
   if(th&&chat&&!chat.hidden&&!R.pending.get(th.id)&&ev.target.closest('#msgs')&&!ev.target.closest('button,a,input,textarea,select,label,.rx122p')){const rs=chat.querySelector('[data-pkresume]');if(rs){ev.stopImmediatePropagation();rs.click();return;}}
   if(th&&chat&&!chat.hidden&&R.pending.get(th.id)&&ev.target.closest('#s-chat')&&!ev.target.closest('button,a,input,textarea,select,label,.composer,.chead,.sheet,.rx122p,#pkwrap,.status')){
    ev.stopImmediatePropagation();
    if(A.busy()){stopVoice();paint();return;}
    if(ev.target.closest('[data-mi]')){if(R._tapT){clearTimeout(R._tapT);R._tapT=null;return;}R._tapT=setTimeout(()=>{R._tapT=null;R.advance();},230);return;}
    R.advance();return;}}
  if(ev.target.closest('[data-reading-stop-voice]')){ev.preventDefault();ev.stopImmediatePropagation();stopVoice();return;}
  if(ev.target.closest('[data-vtog]')){ev.preventDefault();ev.stopImmediatePropagation();S.autoVoice=!S.autoVoice;S.voice=S.voice||{};S.voice.auto=S.autoVoice;if(!S.autoVoice)stopVoice();save();renderChat();}
 },true);
 if(window.UI&&typeof window.UI.add==='function')window.UI.add('manual-reading',paint);
 const render=renderChat;renderChat=function(){const result=render.apply(this,arguments);paint();return result;};
 const style=document.createElement('style');style.textContent='.tap-hint{align-self:center;margin:0 auto 6px;padding:4px 12px;border-radius:999px;font-size:12px;color:rgba(255,255,255,.72);background:rgba(10,9,14,.35);pointer-events:none;animation:tapHint 2.4s ease-in-out infinite;flex-shrink:0}.tap-hint.voicing{animation:none;color:#F0B77E}@keyframes tapHint{0%,100%{opacity:.45}50%{opacity:.95}}.await-tap #msgs{cursor:pointer}.reading-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;flex-shrink:0;background:rgba(16,13,22,.88);border-top:1px solid #ffffff16}.reading-bar span{font-size:11px;color:#c9c1d0}.reading-bar>button{min-height:44px;min-width:112px;flex-shrink:0}.reading-bar [data-reading-stop-voice]{display:block;margin-top:3px;background:none;border:0;padding:3px 0;font-size:11px;color:#c9c1d0;text-decoration:underline}.reading-bar [data-reading-stop-voice][hidden]{display:none}.reading-bar>button:disabled{opacity:.6}.manual-reading .pkspeed,.manual-reading .pkspeed+.pkhint,.manual-reading .pkplay,.manual-reading [data-pkspd],.manual-reading [data-pkskip],.manual-reading [data-stpause]{display:none!important}';document.head.appendChild(style);
})();

