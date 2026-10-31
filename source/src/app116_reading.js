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
 function paint(){
  const th=S.threads[curT],chat=$('#s-chat');if(!chat)return;
  chat.classList.add('manual-reading');
  let bar=chat.querySelector('[data-reading-bar]');const entry=th&&R.pending.get(th.id);
  if(!entry){if(bar)bar.remove();return;}
  if(!bar){bar=document.createElement('div');bar.dataset.readingBar='1';bar.className='reading-bar';
   bar.innerHTML='<div><span data-reading-hint>读完再点，内容会一直保留</span><button type="button" data-reading-stop-voice="1">停止朗读</button></div><button type="button" class="btn btn-p" data-reading-next="1">下一句 ›</button>';
   const composer=chat.querySelector('.composer');if(composer)composer.before(bar);else chat.appendChild(bar);
  }
  const voicing=A.busy(),next=bar.querySelector('[data-reading-next]');next.disabled=voicing;next.textContent=voicing?'朗读中…':'下一句 ›';
  bar.querySelector('[data-reading-hint]').textContent=voicing?'这一句读完后，再点下一句':'读完再点，内容会一直保留';
  bar.querySelector('[data-reading-stop-voice]').hidden=!voicing;
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
  paint();return promise;
 };
 R.advance=function(){const th=S.threads[curT],chat=$('#s-chat');if(!th||!chat||chat.hidden||(typeof HIST_OPEN!=='undefined'&&HIST_OPEN))return false;
  const entry=R.pending.get(th.id);if(!entry||A.busy())return false;
  entry.finish();return true;
 };
 window.READING=R;
 // Replace all older automatic/voice and narration-burst wait shortcuts at the final entry point.
 pkSpd=function(){return 0;};
 pkWait=function(th,prev){th._held=0;return R.wait(th,prev,'script');};
 const append=pkAppend;pkAppend=function(th,message){if(isNarr(message))th._brk=1;return append.apply(this,arguments);};
 if(typeof streamPreview==='function'){const preview=streamPreview;streamPreview=function(){if(!R.manual())return preview.apply(this,arguments);};}
 window.addEventListener('click',ev=>{
  if(ev.target.closest('[data-reading-next]')){ev.preventDefault();ev.stopImmediatePropagation();R.advance();return;}
  if(ev.target.closest('[data-reading-stop-voice]')){ev.preventDefault();ev.stopImmediatePropagation();stopVoice();return;}
  if(ev.target.closest('[data-vtog]')){ev.preventDefault();ev.stopImmediatePropagation();S.autoVoice=!S.autoVoice;S.voice=S.voice||{};S.voice.auto=S.autoVoice;if(!S.autoVoice)stopVoice();save();renderChat();}
 },true);
 if(window.UI&&typeof window.UI.add==='function')window.UI.add('manual-reading',paint);
 const render=renderChat;renderChat=function(){const result=render.apply(this,arguments);paint();return result;};
 const style=document.createElement('style');style.textContent='.reading-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;flex-shrink:0;background:rgba(16,13,22,.88);border-top:1px solid #ffffff16}.reading-bar span{font-size:11px;color:#c9c1d0}.reading-bar>button{min-height:44px;min-width:112px;flex-shrink:0}.reading-bar [data-reading-stop-voice]{display:block;margin-top:3px;background:none;border:0;padding:3px 0;font-size:11px;color:#c9c1d0;text-decoration:underline}.reading-bar [data-reading-stop-voice][hidden]{display:none}.reading-bar>button:disabled{opacity:.6}.manual-reading .pkspeed,.manual-reading .pkspeed+.pkhint,.manual-reading .pkplay,.manual-reading [data-pkspd],.manual-reading [data-pkskip],.manual-reading [data-stpause]{display:none!important}';document.head.appendChild(style);
})();

