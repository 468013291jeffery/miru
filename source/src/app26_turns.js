/* ---- v125 who-said-what ----
   A speaker's bubble only carries that speaker's own actions / inner voice right before the line.
   Narration, other people's actions and events stay in their own unnamed context box, so nothing
   reads as if Roman said it when it was the narrator or Adrian. Narration that comes after a line
   always starts a new box instead of slipping into the bubble above the line. */
function boxRedraw(th,i){const L=th.msgs[i];const el=$('#msgs [data-mi="'+i+'"]');if(el&&curT===th.id){el.outerHTML=msgHTML(L,i,th);scrollChat()}}
const _pkAppend26=pkAppend;
pkAppend=function(th,m){const i=th.msgs.length-1,L=th.msgs[i];const isBox=L&&L.k==="box"&&L.pk;
 if(m&&m.pk&&m.k==="say"&&ch(m.who)&&m.who!=="me"){
  if(th.pk&&m.who===th.pk.as){appendMsg(th,m);return}
  if(isBox&&!L.say){let j=L.parts.length;while(j>0&&L.parts[j-1].who===m.who&&L.parts[j-1].k!=="event")j--;
   if(j>0){const mine=L.parts.slice(j);L.parts=L.parts.slice(0,j);L.txt=L.parts.map(p=>p.txt||"").join(" ");save();boxRedraw(th,i);
    appendMsg(th,{who:"n",k:"box",pk:1,parts:mine,say:{who:m.who,txt:m.txt},txt:m.txt,last:m.txt,lastWho:m.who,at:Date.now()});
    if(curT===th.id){try{chatBgSet(m.who,poseOf(m))}catch(_){}if(S.autoVoice)speak(m.txt,m.who)}return}}
  return _pkAppend26(th,m)}
 if(m&&isNarr(m)&&isBox&&L.say){const part={who:m.who,k:m.who==="n"?"act":m.k,txt:m.txt};
  appendMsg(th,{who:"n",k:"box",pk:1,parts:[part],txt:m.txt,last:m.txt,lastWho:m.who,at:Date.now()});return}
 return _pkAppend26(th,m)};
/* scripted lines of the character you play: the same right-hand bubble as the lines you choose */
const _msgHTML26=msgHTML;
msgHTML=function(m,i,th){if(m&&m.pk&&m.k==="say"&&th&&th.pk&&m.who===th.pk.as&&ch(m.who)){const c=ch(m.who);
  return '<div class="m-row me pkme" data-mi="'+i+'"><div class="bub"><small class="pkmen">'+esc(first(c.n))+' · '+t("pk26.you")+'</small>'+fmtMix(esc(m.txt))+'</div></div>'}
 return _msgHTML26(m,i,th)};
Object.assign(I18N.en,{"pk26.you":"you"});Object.assign(I18N.zh,{"pk26.you":"你"});

/* ---- opening short for THE HEIR: the 72-hours-later warehouse cold open now lives here, not in the chat ---- */
SHORTS.heir={zh:[["n","72小时后。废弃仓库。Adrian穿着昂贵的白衬衫，双手被绑在椅背后，颧骨上一道擦伤。","heir/warehouse"],["n","地上的手机在倒计时：VALE继承投票 00:08:42。绑匪：“你们Vale家还有八分钟。”","heir/warehouse"],["adrianv","那他们用不了八分钟。","heir/warehouse"],["n","灯灭了。一声枪响，门被撞开。","heir/warehouse"],["roman","Adrian，看着我。","heir/warehouse"],["adrianv","你还是来了。","heir/kiss_warehouse"],["roman","你真以为我不会来？","heir/kiss_warehouse"],["n","Adrian扣住他的后颈，吻了上去。Roman第二秒才扣住他的腰，把最后一点距离拉没。","heir/kiss_warehouse"],["roman","时机烂透了。","heir/kiss_warehouse"],["adrianv","已经晚十年了。……你中枪了。","heir/kiss_warehouse"],["roman","他不是冲你开的枪。是冲我。","heir/kiss_warehouse"]],
 en:[["n","72 hours later. An abandoned warehouse. Adrian in an expensive white shirt, wrists tied behind the chair, a scrape across his cheekbone.","heir/warehouse"],["n","A phone on the floor counts down: VALE SUCCESSION VOTE 00:08:42. The kidnapper: \"Your family has eight minutes.\"","heir/warehouse"],["adrianv","Then they'll need less.","heir/warehouse"],["n","The lights die. A gunshot. The door gives.","heir/warehouse"],["roman","Adrian. Look at me.","heir/warehouse"],["adrianv","You came.","heir/kiss_warehouse"],["roman","You really thought I wouldn't?","heir/kiss_warehouse"],["n","Adrian grabs the back of his neck and kisses him. A second later Roman's hand closes on his waist and takes the last inch away.","heir/kiss_warehouse"],["roman","Bad timing.","heir/kiss_warehouse"],["adrianv","Ten years late. …You're hit.","heir/kiss_warehouse"],["roman","He wasn't aiming at you. He was aiming at me.","heir/kiss_warehouse"]],
 cliff:T("A second car brakes outside. — 72 hours earlier: the day he came back for me.","外面，第二辆车急刹。——72小时前，他回来接我那天。")};
EP_TITLE.heir=T("72 Hours Later","72小时后");
/* a short's beat may name its own scene image as a third item */
const _spShow26=spShow;spShow=function(i,off){_spShow26(i,off);try{const g=sp.segs[i],img=g&&g.b&&g.b[2];if(img&&!g.clip&&(window.SCENE_FILES||{})[img]){const bg=$("#spBg");const ims=bg&&bg.querySelectorAll("img");const last=ims&&ims[ims.length-1];if(last)last.src=SCENE_FILES[img]}}catch(_){}};
/* the chat intro of a story with an opening short offers it first */
const _introHTML26=introHTML;introHTML=function(th){const h=_introHTML26(th);if(!th||!SHORTS[th.wid]||!th.pk)return h;
 return h.replace('<div class="m-intro"','<div class="m-intro"').replace(/(<div class="m-intro"[^>]*>)/,'$1<button class="mi-short" data-short="'+th.wid+'">▶ '+t("pk26.short")+'<small>'+esc(Lz(EP_TITLE[th.wid]||""))+'</small></button>')};
Object.assign(I18N.en,{"pk26.short":"Watch the opening first"});Object.assign(I18N.zh,{"pk26.short":"先看开场短剧"});
