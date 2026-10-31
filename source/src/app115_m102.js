/* M102: authored pack, authenticated choices, per-scene free chat and explicit permissions. */
(function(){
 'use strict';
 const D=window.M102_DATA,E=window.M102Engine;if(!D||!E)return;
 const ID='m102',roles=E.actors,copy=o=>JSON.parse(JSON.stringify(o)),is=th=>th&&th.wid===ID;
 const sayError=e=>{console.warn('[m102]',e);toast('暂时没能保存：'+String(e.message||e));};
 Object.assign(C,D.chars);if(!W.some(w=>w.id===ID))W.unshift(D.world);
 D.world.pack.minRoundsPerChapter=0;
 D.world.pack.bonus={t:{zh:'',en:''},d:{zh:'',en:''}};
 const base=Object.fromEntries(D.world.pack.chapters.map((c,i)=>[i+1,copy(c.beats)]));
 S.art[ID]='art/official/m102/cover.jpg';for(const k of Object.keys(D.chars))if(k!=='m102_you')S.art[k]='art/official/m102/char_'+k.slice(5)+'.jpg';
 const assets={};for(const c of D.world.pack.chapters)for(const b of c.beats.zh)if(b[1]==='scene'){const d=b[2];assets[d.img]=d.src94;}
 Object.assign(window.SCENE_FILES||(window.SCENE_FILES={}),assets);
 const uuid=()=>Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,12);
 async function request(th,action){
  if(th._m102Busy)throw Error('上一项正在保存，请稍等');th._m102Busy=true;
  try{
   th.m102=th.m102||{session:'m102_'+uuid(),state:E.initial(),ver:0};
   const m=th.m102,r=await capi('/state?r=m102'+(action?'':'&session='+encodeURIComponent(m.session)),action?{json:{session:m.session,ver:m.ver,action}}:undefined);
   if(!r.ok){if(r.j&&r.j.state){m.state=r.j.state;m.ver=r.j.ver;save();}throw Error(r.status===401?'请先登录，再保存这部剧的进度':(r.j&&r.j.error)||'网络连接失败');}
   m.state=r.j.state;m.ver=r.j.ver;th.pk.picks=copy(m.state.choices);
   th.love=th.love||{};for(const k of roles)th.love['m102_'+k]=m.state.relations[k].affection;
   save();return m.state;
  }finally{th._m102Busy=false;}
 }
 const action=(th,a)=>request(th,Object.assign({id:uuid()},a));
 function state(th){return th.m102&&th.m102.state||E.initial();}
 function denied(th){return roles.filter(k=>!state(th).access[k]);}
 const _chLocked=chLocked;chLocked=function(wid,n){return wid===ID?false:_chLocked.apply(this,arguments);};
 // Replays rebuild from committed events; never invent a missing B choice.
 const _init=packInit;packInit=function(th,w,extra){
  if(!is(th))return _init.apply(this,arguments);
  extra=extra||{};th.pk={ch:0,picks:{},as:extra.as||'m102_you',st:'busy'};
  let replay=[];const from=extra.fromCh||1;
  if(from>1){const old=Object.values(S.threads).filter(t=>t!==th&&is(t)&&t.m102&&t.m102.state.next_chapter>=from).sort((a,b)=>b.at-a.at)[0];
   if(!old){toast('没有可用的章节存档，请从第一章开始');return;}
   for(const ev of old.m102.state.events){if(ev.chapter>=from)break;
    if(/^M102_CH/.test(ev.id))replay.push({op:'choice',chapter:ev.chapter,option:ev.choice,target:ev.target});
    else if(['access','boundary','relationship'].includes(ev.id))replay.push(Object.assign({},ev,{op:ev.id}));
   }
  }
  th.m102={session:'m102_'+uuid(),state:E.initial(),ver:0};
  (async()=>{await request(th);for(const a of replay)await action(th,a);await packOpen(th,from,true);})().catch(e=>{sayError(e);th.pk.m102Resume=state(th).next_chapter;save();packRefresh(th);});
 };
 const _open=packOpen;packOpen=async function(th,n,instant){
  if(!is(th))return _open.apply(this,arguments);
  try{await request(th);const s=state(th),entry=E.entry(s,n,D),c=D.world.pack.chapters[n-1];
   let beats=copy(base[n][CL()]||base[n].zh),absent=denied(th);
   if(entry)beats.splice(1,0,['n','act',entry.text]);
   // A refused visit stays refused. Use the independently authored off-site path.
   if(absent.length===roles.length&&n>1){beats=copy(D.offsite[n]);if(entry)beats.splice(1,0,['n','act',entry.text]);}
   else if(absent.length){const names=absent.map(k=>D.chars['m102_'+k].n.split('·')[0]);beats=beats.filter(b=>!absent.some(k=>b[0]==='m102_'+k)&&!(b[0]==='n'&&typeof b[2]==='string'&&names.some(nm=>b[2].includes(nm))));}
   th.present=D.world.cast.filter(cid=>cid!=='m102_you'&&!absent.includes(cid.slice(5)));
   const old=c.beats,oldPresent=c.present;c.beats={zh:beats,en:beats};c.present=th.present.slice();try{const result=_open.call(this,th,n,instant);if(curT===th.id)renderChat();return result;}finally{c.beats=old;c.present=oldPresent;}
  }catch(e){sayError(e);th.pk.st='busy';th.pk.m102Resume=n;save();packRefresh(th);}
 };
 const _pick=packPick;packPick=async function(k,target){
  const th=S.threads[curT];if(!is(th))return _pick.apply(this,arguments);
  if(!th.pk||th.pk.st!=='choose'||busy||th._m102Busy)return;
  const n=th.pk.ch;if(!['A','B'].includes(k))return;
  if((n===13||n===14)&&k==='A'&&!target){sheet('<h2>'+(n===13?'你想回应谁？':'你想邀请谁？')+'</h2><p class="sm dim">这不会自动确认恋爱，也不会授权身体接触。</p><div class="stack" style="margin-top:12px">'+roles.map(cid=>'<button class="btn btn-g" data-m102-target="'+cid+'" data-choice="'+k+'">'+esc(D.chars['m102_'+cid].n)+'</button>').join('')+'</div>');return;}
  try{await request(th);const committed=state(th).choices[n];
   if(committed&&committed!==k)throw Error('这一章已在另一处选择了'+committed+'，请重新读取进度');
   if(!committed)await action(th,{op:'choice',chapter:n,option:k,target:target||null});closeSheet();
   const x=D.world.pack.chapters[n-1].choices.find(o=>o.k===k);pkTrack(th,'choice_pick',{ch:n,key:k});
   pkGo(th,'busy','m102-choice');appendMsg(th,{who:'sys',k:'dec',n,c:k,txt:Lz(x.t),at:Date.now()});
   th.pk.q=packBeats(x.then).slice();th.pk.after='pick:'+k;setSugg([]);save();packRefresh(th);packRun(th);
  }catch(e){sayError(e);}
 };
 const _after=packAfterPick;packAfterPick=function(th,k){
  if(!is(th))return _after.apply(this,arguments);
  const n=th.pk.ch,x=D.world.pack.chapters[n-1].choices.find(o=>o.k===k);th.mem.push(Lz(x.mem));pkDone(th,n);
  if(n<14)pkGo(th,'next','m102-chapter-done');else{
   const s=state(th),end=E.ending(s),guest=s.celebration_guest,nm=guest?D.chars['m102_'+guest].n:'';
   th.pk.end=k;th.pk.m102Ending=end;packSt(ID).end[end]=1;pkGo(th,'end','m102-ending');
   let text=end==='independent_ending'?'你独自打开店门。有人愿意帮忙，但经营和生活的决定权仍在你手里。':end.startsWith('relationship_')?'你与'+nm+'已经明确确认关系。今晚的庆祝不改变店铺归属，也不代替下一次询问。':end.startsWith('mutual_')?'你邀请'+nm+'留下，也回应了好感。你们还没有确认恋爱，可以慢慢来。':'你邀请'+nm+'一起庆祝。朋友、合作伙伴，或者未来更多可能，都还由你决定。';
   appendMsg(th,{who:'sys',k:'card',title:'午夜照常营业',txt:text,at:Date.now()});pkTrack(th,'story_end',{ch:14,ending:end});
  }save();packRefresh(th);if(curT===th.id){renderChat();scrollChat();}
 };
 const _endingNeed=EN;EN=function(th){return is(th)?0:_endingNeed.apply(this,arguments);};
 const _startSheet=startSheet;startSheet=function(wid,fresh){
  if(wid!==ID)return _startSheet.apply(this,arguments);
  const run=fresh?null:Object.values(S.threads).filter(is).sort((a,b)=>b.at-a.at)[0];
  sheet('<h2>午夜不打烊</h2><p class="sm dim">14章完整故事 · 选择与进度自动保存</p>'+(run?'<button class="btn btn-p btn-block" data-open="'+esc(run.id)+'" style="margin-top:12px">继续到第'+run.pk.ch+'章</button>':'')+'<div class="stack" style="margin-top:12px"><button class="opt" data-pkgo="m102|m102_you"><b>扮演店主</b><span>你说自己的话，作出自己的选择。</span></button><button class="opt" data-pkgo="m102|side"><b>以自己的身份加入</b><span>走进咖啡店，随时与在场的人交谈。</span></button><button class="opt" data-pkgo="m102|watch"><b>导演视角</b><span>旁观故事，也可以随时提出想法。</span></button></div>');
 };
 const _storyPage=storyPage;storyPage=function(id,keep){
  if(id!==ID)return _storyPage.apply(this,arguments);curStory=ID;if(!keep)storyTab='intro';
  const w=D.world,run=Object.values(S.threads).filter(is).sort((a,b)=>b.at-a.at)[0];
  let body='<p class="sm" style="line-height:1.8">'+esc(Lz(w.premise))+'</p><div class="card"><b>你是店主，决定权归你</b><p class="sm dim" style="line-height:1.7;margin-top:8px">'+esc(Lz(w.you))+'</p></div><p class="xs dim">14章 · 56场 · 可自由对话 · 可拒绝所有恋爱 · 选择会影响后续场景</p>';
  if(storyTab==='chapters')body='<div class="chlist">'+w.pack.chapters.map((c,i)=>'<div class="chrow"><span class="chn num">'+(i+1)+'</span><div class="grow"><b>'+esc(Lz(c.t))+'</b><p>'+esc(Lz(c.ask))+'</p></div>'+((run&&run.pk.picks[i+1])?'<span>已选 '+esc(run.pk.picks[i+1])+'</span>':'')+'</div>').join('')+'</div><p class="xs dim">按章推进；你可以在对话页的章节菜单重玩已到达的章节。</p>';
  if(storyTab==='cast')body='<div class="stack">'+roles.concat('amy').map(k=>{const c=D.chars['m102_'+k];return '<div class="card row" style="gap:12px"><img src="art/official/m102/char_'+k+'.jpg" alt="'+esc(c.n)+'" style="width:82px;height:110px;object-fit:cover;border-radius:10px"><div><b>'+esc(c.n)+'</b><p class="sm dim">'+c.age+'岁 · '+esc(Lz(c.role))+'</p><p class="xs">'+esc(Lz(c.vibe))+'</p></div></div>';}).join('')+'</div>';
  screen('s-story','<button class="ibtn backbtn" data-back="1">'+ic('back')+'</button><div class="scroll"><div class="hero"><img src="art/official/m102/cover.jpg" alt="午夜不打烊" style="object-position:center 25%"><div class="veil"></div><div class="cap"><div class="eyebrow">MIRU · 都市悬疑恋爱</div><h1>午夜不打烊</h1><p>'+esc(Lz(w.hook))+'</p></div></div><div class="tabs">'+[['intro','故事'],['chapters','章节'],['cast','人物']].map(([key,label])=>'<button data-stab="'+key+'" class="'+(storyTab===key?'on':'')+'">'+label+'</button>').join('')+'</div><div class="pad stack" style="gap:14px;padding-bottom:120px">'+body+'</div></div><div class="startbar"><div class="row" style="gap:8px">'+(run?'<button class="btn btn-g" data-pkrestart="m102">重新开始</button>':'')+'<button class="btn btn-p grow" data-pkstart="m102">'+(run?'继续故事':'走进咖啡店')+'</button></div></div>');$('#s-story').classList.add('m102-story');show('s-story');
 };
 const _stopAuto=stopAuto;stopAuto=function(th,b){if(is(th)&&b[2]&&b[2].m102free)return null;return _stopAuto.apply(this,arguments);};
 const _stopHTML=stopHTML;stopHTML=function(th){const d=th.pk&&th.pk.stop&&th.pk.stop[2];if(!is(th)||!d||!d.m102free)return _stopHTML.apply(this,arguments);
  return '<p class="sm" style="line-height:1.6">'+esc(Lz(d.hint))+'</p><p class="xs dim" style="margin:8px 0">可以在下面输入任何话；想先听下去，也可以直接继续。</p><button class="btn btn-g btn-block" data-m102-continue="1">先继续剧情</button>';
 };
 const _panel=packPanel;packPanel=function(th){if(!is(th))return _panel.apply(this,arguments);
  if(th.pk.m102Resume)return '<div class="pkpanel"><p>进度尚未读取，请登录或恢复连接后重试。</p><button class="btn btn-p" data-m102-retry="1">重试读取进度</button></div>';
  const h=_panel.apply(this,arguments);return h+'<button class="btn btn-g btn-sm" data-m102-boundaries="1" style="margin:8px">人物来访与关系边界</button>';
 };
 const _prompt=packPrompt;packPrompt=function(th){if(!is(th))return _prompt.apply(this,arguments);
  const s=state(th),c=D.world.pack.chapters[th.pk.ch-1];
  return ['M102 Midnight at Four Corners. Play only the current moment in chapter '+th.pk.ch+': '+Lz(c.t),
   'Player is the adult cafe owner, sole decision-maker. Never narrate her feelings, consent or choices. Respond to her exact input first, in natural spoken Chinese.',
   'Trusted completed events: '+JSON.stringify(s.events.filter(e=>e.chapter).map(e=>({chapter:e.chapter,choice:e.choice}))),
   'Verified business state: '+JSON.stringify(s.fields),
   'Allowed present actors: '+(th.present||[]).join(', ')+'. No absent actor may speak or enter. Do not create remote calls or messages without permission.',
   'Explicit boundaries: '+JSON.stringify(s.consent)+'. No permission is implied by affection, help or invitation. All unspecified touch/kiss/private_visit permissions require asking first. A plain-language refusal or withdrawal in the latest user message overrides any earlier permission immediately; stop the action, even before settings are updated.',
   'Interest: '+s.affinity_target+'; confirmed relationship: '+s.confirmed_relationship+'. Relationship tendencies: '+JSON.stringify(s.relations)+'. These are private engine data, never show numbers. Chapter choice or celebration is never relationship consent.',
   'Actor knowledge is limited to witnessed visible messages and these explicitly shared facts: '+JSON.stringify(s.actor_knowledge)+'. Never invent private motives, unseen evidence, later chapter facts or official legal results.',
   'Stay at this scene. The program owns choices, checkpoints and endings. Never claim a selection was saved, relationship confirmed or permission granted by AI dialogue.',
   'The player may refuse all romance and still complete the investigation. Do not turn help into debt or intimacy.'].join('\n');
 };
 const _speakers=speakersOf;speakersOf=function(th){return is(th)?(th.present||th.cast).filter(cid=>cid!=='m102_you'&&!(th.pk&&cid===th.pk.as)):_speakers.apply(this,arguments);};
 // Existing reply pipeline receives only present characters; reject an absent speaker on output too.
 const _play=playBeats;playBeats=async function(th,r,ctx,silent){if(is(th)&&r&&Array.isArray(r.beats))r=Object.assign({},r,{beats:r.beats.filter(b=>b.who==='n'||b.who==='sys'||speakersOf(th).includes(b.who))});return _play.call(this,th,r,ctx,silent);};
 const _reply=reply;reply=async function(th,ctx,silent){
  if(!is(th))return _reply.apply(this,arguments);
  try{await request(th);const txt=String(ctx&&ctx.txt||'').trim();
   for(const k of roles){const name=D.chars['m102_'+k].n.split('·')[0],m=new RegExp('^'+name+'[，, ]*(请)?(出去|离开|别再进来|不要再进来|别碰我|不要碰我|别亲我|不要亲我)[。！!\\s]*$').exec(txt);
    if(m){const command=m[2];if(/出去|离开|进来/.test(command))await action(th,{op:'access',actor:k,granted:false});else await action(th,{op:'boundary',actor:k,category:/亲/.test(command)?'kiss':'touch',granted:false});}
   }
   th.present=D.world.cast.filter(cid=>cid!=='m102_you'&&!denied(th).includes(cid.slice(5)));
   if(th.pk.q)th.pk.q=th.pk.q.filter(b=>!denied(th).some(k=>b[0]==='m102_'+k));
   save();return _reply.call(this,th,ctx,silent);
  }catch(e){sayError(e);return null;}
 };
 function boundarySheet(th){const s=state(th);sheet('<h2>来访与关系边界</h2><p class="sm dim">这里只记录你明确作出的决定。允许来访不等于同意触碰或恋爱。</p><div class="stack" style="margin-top:12px">'+roles.map(k=>'<div class="card"><b>'+esc(D.chars['m102_'+k].n)+'</b><button class="btn btn-g btn-sm" data-m102-access="'+k+'" data-grant="'+(!s.access[k])+'">'+(s.access[k]?'请他离开 / 撤回来访许可':'允许他到场')+'</button>'+['touch','kiss','private_visit','publish_photo','commercial_access'].map((p,i)=>'<button class="btn btn-g btn-xs" data-m102-permission="'+k+':'+p+'" data-grant="'+(!s.consent[k+':'+p])+'">'+['触碰','亲吻','私人来访','公开照片','商业访问'][i]+'：'+(s.consent[k+':'+p]?'已允许，点此撤回':'未允许，点此允许')+'</button>').join('')+'</div>').join('')+(s.affinity_target?'<button class="btn btn-p" data-m102-relationship="'+s.affinity_target+'">明确确认与'+esc(D.chars['m102_'+s.affinity_target].n)+'的恋爱关系</button>':'')+(s.confirmed_relationship?'<button class="btn btn-g" data-m102-relationship="none">撤回恋爱关系确认</button>':'')+'</div>');}
 document.addEventListener('click',async ev=>{
  const th=S.threads[curT];if(!is(th))return;const el=ev.target.closest('[data-m102-target],[data-m102-continue],[data-m102-boundaries],[data-m102-access],[data-m102-permission],[data-m102-relationship],[data-m102-retry]');if(!el)return;
  ev.preventDefault();
  if(el.dataset.m102Target){packPick(el.dataset.choice,el.dataset.m102Target);return;}
  if(el.dataset.m102Continue){if(!busy&&!th._m102Busy)stopResolve(th,[]);return;}
  if(el.dataset.m102Boundaries){boundarySheet(th);return;}
  if(el.dataset.m102Retry){const n=th.pk.m102Resume;delete th.pk.m102Resume;await packOpen(th,n,true);return;}
  el.disabled=true;try{
   if(el.dataset.m102Access)await action(th,{op:'access',actor:el.dataset.m102Access,granted:el.dataset.grant==='true'});
   else if(el.dataset.m102Permission){const [actor,category]=el.dataset.m102Permission.split(':');await action(th,{op:'boundary',actor,category,granted:el.dataset.grant==='true'});}
   else if(el.dataset.m102Relationship)await action(th,{op:'relationship',actor:el.dataset.m102Relationship==='none'?null:el.dataset.m102Relationship});
   th.present=D.world.cast.filter(cid=>cid!=='m102_you'&&!denied(th).includes(cid.slice(5)));
   // A revoked visitor cannot keep speaking from an already-built queue.
   if(el.dataset.m102Access&&el.dataset.grant==='false'&&th.pk.q){const cid='m102_'+el.dataset.m102Access;th.pk.q=th.pk.q.filter(b=>b[0]!==cid);}
   save();boundarySheet(th);
  }catch(e){sayError(e);el.disabled=false;}
 });
 const _renderChat=renderChat;renderChat=function(){const r=_renderChat.apply(this,arguments),el=$('#s-chat');if(el)el.classList.toggle('m102-chat',is(S.threads[curT]));return r;};
 const style=document.createElement('style');style.textContent='.m102-story .hero{height:auto!important;aspect-ratio:9/16;min-height:0}.m102-story .hero>img{width:100%;height:100%;object-fit:cover;object-position:center top!important}.m102-chat #cbImg img{object-position:center top}.m102-chat .cg94{padding:10px}.m102-chat .cg94 img{max-width:100%;max-height:calc(100% - 78px);object-fit:contain}.m102-chat .pkpanel{overflow-wrap:anywhere}.m102-chat [data-m102-boundaries]{min-height:44px}';document.head.appendChild(style);
 // A shareable entry respects the app's normal sign-in requirement.
 if(new URLSearchParams(location.search).get('story')==='m102'){
  let entered=false;const enter=()=>{if(entered)return;if(typeof MUST92==='function'&&MUST92()&&!loggedIn92())return;entered=true;openStory(ID);};
  setTimeout(enter,700);if(window.UI&&typeof window.UI.add==='function')window.UI.add('m102-entry',enter);
 }
})();
