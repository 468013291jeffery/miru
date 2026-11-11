/* Scene-aware interaction and a continuous, readable conversation. */
(function(){
 'use strict';
 const X={positions:new Map(),lastFX:new WeakMap()};window.EXPERIENCE124=X;
 const zh=()=>CL()==='zh',text=(a,b)=>zh()?a:b;
 const local=v=>v==null?'':typeof v==='string'?v:String(Lz(v)||'');
 const current=()=>S.threads[curT];
 X.canCall=function(th,cid,event){
  if(!th||!cid||!event||!local(event.reason||event.hint).trim())return false;
  if(curT!==th.id||busy||document.hidden||document.querySelector('.sheet,.callv,.ringv'))return false;
  if(window.READING&&READING.pending.has(th.id))return false;
  const c=th.pk&&wd(th.wid)?.pack?.chapters[th.pk.ch-1];
  const present=th.present||th.status?.present||c?.present;
  // Presence is authoritative; missing presence needs explicit remote staging.
  if(Array.isArray(present)&&present.includes(cid))return false;
  if(th.pk?.stop&&!['call','missed'].includes(th.pk.stop[1]))return false;
  return event.remote===true||Array.isArray(present)&&!present.includes(cid)&&event.remote!==false;
 };
 X.brief=function(th,c,n){
  const beats=packBeats(c.beats),scene=beats.find(b=>Array.isArray(b)&&b[1]==='scene'&&b[2]&&typeof b[2]==='object')?.[2]||{};
  // Only explicit public chapter context; goals/secrets are not opening exposition.
  const firstScene=beats.findIndex(b=>b[1]==='scene'),nextScene=beats.findIndex((b,i)=>i>firstScene&&b[1]==='scene');
  const opening=beats.slice(0,nextScene<0?beats.length:nextScene);
  const ids=Array.isArray(scene.present)?scene.present:Array.isArray(c.present)?c.present:[...new Set(opening.filter(b=>['say','act'].includes(b[1])&&ch(b[0])).map(b=>b[0]))];
  const narration=opening.find(b=>b[0]==='n'&&['act','narr'].includes(b[1])&&typeof b[2]==='string');
  return {time:local(c.time)||local(scene.time)||text('时间待剧情交代','Time not yet established'),place:local(c.place)||local(scene.place)||text('地点待剧情交代','Location not yet established'),cast:ids.filter(id=>id!==th.pk.as).map(id=>ch(id)?.n).filter(Boolean),background:local(c.background||c.context||c.summaryPublic||(narration&&narration[2])).slice(0,240)||text('从本章开场继续了解当前情境。','Follow the opening scene for context.')};
 };
 const briefHTML=(b)=>'<dl class="brief124"><dt>'+text('时间','Time')+'</dt><dd>'+esc(b.time)+'</dd><dt>'+text('地点','Place')+'</dt><dd>'+esc(b.place)+'</dd><dt>'+text('人物','Present')+'</dt><dd>'+esc([text('你','You'),...(b.cast||[])].join(text('、',', ')))+((b.cast||[]).length?'':text(' · 其余人物随登场介绍',' · Others introduced on arrival'))+'</dd></dl><p>'+esc(b.background)+'</p>';
 MSGKIND.inline('app124_experience.js',['chap'],function(m,i,th,next){
  if(m.k!=='chap')return next(m,i,th);
  const c=wd(th.wid)?.pack?.chapters[m.n-1],b=m.brief124||(c&&X.brief(th,c,m.n));
  if(!b)return next(m,i,th);
  return '<article class="chapter124" data-mi="'+i+'"><small>'+text('第 '+m.n+' 章','Chapter '+m.n)+'</small><h3>'+esc(m.title||'')+'</h3>'+briefHTML(b)+'</article>';
 });
 X.remember=function(){const m=document.getElementById('msgs');if(!m||m.dataset.thread124!==curT)return;X.positions.set(curT,{top:m.scrollTop,away:m.scrollHeight-m.scrollTop-m.clientHeight>72,count:current()?.msgs.length||0});};
 X.hold=function(){if(window.holdTop98&&holdTop98(current()))return true;const p=X.positions.get(curT);if(p?.away){const b=document.querySelector('[data-latest124]');if(b){b.hidden=false;b.textContent=text('有新消息 ↓','New messages ↓');}return true;}return false;};
 X.readingHistory=function(){const m=document.getElementById('msgs');return !!X.positions.get(curT)?.away||!!(m&&Date.now()-(m._scrolled124||0)<400);};
 X.openHistory=function(){HIST_OPEN=false;const m=document.getElementById('msgs');if(m){m.scrollTop=Math.max(0,m.scrollTop-m.clientHeight*.8);X.remember();}};
 X.callFallback=function(th,event){const cid=event.cid||mainOf(th);if(Array.isArray(th.present)&&th.present.includes(cid)&&Array.isArray(event.lines))return event.lines.map(line=>Array.isArray(line)?[line[0],'say',line[1]]:[cid,'say',line]).concat(event.then||[]);return event.skip||[];};
 function history(){
  const m=document.getElementById('msgs'),th=current();if(!m||!th)return;
  m.dataset.thread124=th.id;m.querySelectorAll('.cold').forEach(el=>el.classList.remove('cold'));
  let b=document.querySelector('[data-latest124]');if(!b){b=document.createElement('button');b.dataset.latest124='1';b.className='latest124';b.hidden=true;m.after(b);}
  const p=X.positions.get(th.id);if(p?.away)m.scrollTop=p.top;else if(window.holdTop98&&holdTop98(th))m.scrollTop=0;else m.scrollTop=m.scrollHeight;
  b.hidden=!p?.away;b.textContent=p&&th.msgs.length>p.count?text('有新消息 ↓','New messages ↓'):text('回到最新 ↓','Latest ↓');
  const update=()=>{const away=m.scrollHeight-m.scrollTop-m.clientHeight>72;X.positions.set(th.id,{top:m.scrollTop,away,count:th.msgs.length});b.hidden=!away;m.classList.toggle('reading-history124',away);};
  m.addEventListener('scroll',update,{passive:true});
  m.addEventListener('pointerdown',e=>{m._gesture124={x:e.clientX,y:e.clientY};},{passive:true});
  m.addEventListener('pointermove',e=>{const g=m._gesture124;if(g&&Math.abs(g.y-e.clientY)>12){m._scrolled124=Date.now();X.remember();}},{passive:true});
 }
 /* 2026-11-04（玩家：「设置与更多」可以不要 —— 顶栏的 ⋯ 就是它）⇒ 从「更多」格子里拿掉 */
 X.tools=function(){return [['data-detail124="1"','📖',text('剧情详情','Story details')],['data-ideas="1"','✦',text('回复建议','Reply ideas')],['data-cont="1"','⏩',text('继续','Continue')],['data-cs="1"','🎬',text('剧情工具','Story tools')]].filter(([a])=>!a.includes('data-stepin')||!!current()?.pk).map(([a,i,t])=>'<button class="pmt" '+a+'><i>'+i+'</i><b>'+t+'</b></button>').join('');};
 function composer(){
  const box=document.querySelector('#s-chat .composer');if(!box)return;
  box.querySelectorAll('.c55h,#modeMoreBtn,.modebtn,#modeToggle').forEach(el=>el.remove());
  const watch=current()?.pk?.as==='watch';box.classList.toggle('input124',!watch);if(watch)return;
  /* 2026-11-05 玩家：台词 / 动作 / 心声占地方太大 ⇒ 收成「对谁说」左边的一个小按钮，点开才出选项。
     名字多了在 .addr73s 里左滑查看，显示和隐藏的分界线对齐下面输入框的右边。 */
  box.querySelectorAll('.input-modes124,.ctl124').forEach(el=>el.remove());
  const row=document.createElement('div');row.className='ctl124';
  const wrap=document.createElement('div');wrap.className='input-modes124';
  wrap.innerHTML='<button class="im124" data-inputmenu124="1" aria-haspopup="true" aria-expanded="false" aria-label="'+text('输入类型','Input mode')+'">'+modeLabel()+'<svg viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4"/></svg></button><div class="immenu124" role="menu" hidden>'+MODES().map(([k,i,l])=>'<button role="menuitemradio" data-input124="'+k+'" aria-checked="'+(cmode===k)+'"><i>'+i+'</i>'+l+'</button>').join('')+'</div>';
  row.appendChild(wrap);
  const addr=box.querySelector('.addr73');if(addr)row.appendChild(addr);
  box.prepend(row);
  const input=box.querySelector('#cin');
  if(input){const gap=row.getBoundingClientRect().right-input.getBoundingClientRect().right;if(gap>0)row.style.paddingRight=gap+'px';if(cmode==='act'||cmode==='think')input.placeholder=text(cmode==='act'?'你要做什么……':'你心里在想……',cmode==='act'?'What do you do?':'Your private thought…');}
 }
 const MODES=()=>[['say','💬',text('台词','Say')],['act','✱',text('动作','Action')],['think','💭',text('心声','Thought')]];
 function modeLabel(){const m=MODES().find(([k])=>k===cmode);return m?'<i>'+m[1]+'</i><span>'+m[2]+'</span>':'<i>🎬</i><span>'+text('导演','Direct')+'</span>';}
 function closeModeMenu(){document.querySelectorAll('.immenu124').forEach(el=>{el.hidden=true;});document.querySelectorAll('[data-inputmenu124]').forEach(b=>b.setAttribute('aria-expanded','false'));}
 /* 2026-11-05（玩家：顶栏还是之前的版本好看，只是不要「历史」）⇒ 顶栏恢复：左边头像 + 剧名 + 💗 关系，工具按钮照旧；
    「历史」按钮由 app121_dock 的 noHist() 去掉。不另加「♥ 陌生人」。 */
 function header(){const h=document.querySelector('#s-chat .chead');if(!h)return;h.classList.remove('slim124');const r=h.querySelector('.row');if(!r)return;
  r.querySelectorAll('.relationship124').forEach(el=>el.remove());[...r.children].forEach(el=>{if(el.matches('.chavs,.av,[data-us]'))el.hidden=false;});
 }
 function details(){const th=current(),w=th&&wd(th.wid);if(!th)return;
  sheet('<h2>'+esc(th.title)+'</h2><p>'+esc(local(w?.premise||w?.hook))+'</p>'+((th.pk&&w?.pack?.chapters[th.pk.ch-1])?briefHTML(X.brief(th,w.pack.chapters[th.pk.ch-1],th.pk.ch)):'')+'<div class="stack">'+(th.cast||[]).map(id=>{const c=ch(id);return c?'<article><h3>'+esc(c.n)+'</h3><p>'+esc(local(c.role||c.vibe))+'</p></article>':'';}).join('')+'</div>');
 }
 document.addEventListener('click',e=>{
  if(e.target.closest('.sheet [data-mode="dir"]')){e.preventDefault();e.stopImmediatePropagation();cmode='dir';closeSheet();const i=document.getElementById('cin');if(i){i.value=playerInput146(i.value).text;i.placeholder=text('输入导演指令……','Director instruction…');i.focus();}return;}
  const menuBtn=e.target.closest('[data-inputmenu124]');if(menuBtn){e.preventDefault();e.stopImmediatePropagation();const menu=menuBtn.parentNode.querySelector('.immenu124'),open=menu.hidden;closeModeMenu();menu.hidden=!open;menuBtn.setAttribute('aria-expanded',String(open));return;}
  const mode=e.target.closest('[data-input124]');if(!mode)closeModeMenu();if(mode){e.preventDefault();e.stopImmediatePropagation();cmode=mode.dataset.input124;document.querySelectorAll('[data-input124]').forEach(b=>b.setAttribute('aria-checked',String(b===mode)));document.querySelectorAll('[data-inputmenu124]').forEach(b=>{b.querySelector('i').textContent=mode.querySelector('i').textContent;b.querySelector('span').textContent=mode.textContent.replace(mode.querySelector('i').textContent,'');});closeModeMenu();const i=document.getElementById('cin');if(i){i.value=playerMark146(playerInput146(i.value).text,cmode);i.placeholder=text(cmode==='act'?'你要做什么……':cmode==='think'?'你心里在想……':'你想说什么……',cmode==='act'?'What do you do?':cmode==='think'?'Your private thought…':'Say something…');i.focus();composerMark146();i.setSelectionRange(Math.max(1,i.value.length-1),Math.max(1,i.value.length-1));}return;}
  if(e.target.closest('[data-detail124]')){e.preventDefault();e.stopImmediatePropagation();details();return;}
  if(e.target.closest('[data-latest124]')){e.preventDefault();e.stopImmediatePropagation();X.positions.delete(curT);const m=document.getElementById('msgs');if(m)m.scrollTop=m.scrollHeight;e.target.closest('button').hidden=true;return;}
  const m=e.target.closest('#msgs');if(m&&(X.positions.get(curT)?.away||Date.now()-(m._scrolled124||0)<400)&&!e.target.closest('button,a')){e.stopImmediatePropagation();}
 },true);
 X.effect=function(th,m){
  if(curT!==th.id||X.positions.get(th.id)?.away||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
  // Effects follow committed events, never keywords in a question or private thought.
  const kind=m.k==='dec'?'choice':m.k==='chap'?'chapter':m.k==='act'&&m.who==='me'?'action':null;
  if(!kind)return;const el=document.querySelector('#msgs [data-mi="'+(th.msgs.length-1)+'"]')||document.querySelector('#msgs>:last-child');
  if(el){el.classList.add('feedback124');setTimeout(()=>el.classList.remove('feedback124'),700);}
 };
 PKREG.add('app124_experience.js',function(th,b,next){const result=next(th,b);if(result&&Array.isArray(b)&&b[1]==='scene'&&curT===th.id&&!X.readingHistory()&&!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){const bg=document.getElementById('chatBg');if(bg){bg.classList.remove('scene-shift124');void bg.offsetWidth;bg.classList.add('scene-shift124');setTimeout(()=>bg.classList.remove('scene-shift124'),650);}}return result;});
 UI.add('experience124',()=>{header();composer();history();});
})();
