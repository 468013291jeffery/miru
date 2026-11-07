/* M105 authored audiovisual scenes and optional, non-scoring activities. */
(function(){
 const ID='w_scmvxnqoko453e6d7bc3',VER='m105-solo-scenes-20261107';let plan=null,promise=null,active=null;
 const own=w=>w&&w.community===ID,bi=(zh,en)=>({zh,en}),local=x=>typeof x==='string'?x:(x&&(x[CL()]||x.en||x.zh))||'';
 function load(){if(plan)return Promise.resolve(plan);if(!promise)promise=fetch('art/official/m105-scenes/experience.json?v='+VER).then(r=>{if(!r.ok)throw Error('M105 scene plan unavailable');return r.json()}).then(j=>plan=j).catch(e=>{promise=null;throw e});return promise;}
 function rows(chapter,section,episode){return Object.values(plan.scenes).filter(r=>r.key.startsWith(section==='main'?'main:'+chapter+':':section+':'+episode+':'));}
 function rowFor(chapter,section,episode,n){return plan.scenes[section==='main'?`main:${chapter}:${n}`:`${section}:${episode}:${n}`];}
 function decorate(w,arr,chapter,section,episode,lang,counter){let current=null,waiting=false;const out=[];counter=counter||{n:0};
  const activity=()=>{if(waiting&&current&&current.game){out.push(['sys','m105activity',{id:current.game}]);waiting=false;}};
  for(const raw of arr||[]){if(!Array.isArray(raw)){out.push(raw);continue}const b=JSON.parse(JSON.stringify(raw));
   if(b[0]==='sys'&&b[1]==='bgm')continue;
   if(b[1]==='cg94'&&['cg_together','cg_kiss','cg_conversation'].includes((b[2]||{}).slot))continue;
   if(b[1]==='scene'){activity();current=rowFor(chapter,section,episode,++counter.n);if(current){const k='m105scene:'+current.key;b[2].m105Scene=current.key;b[2].img=k;b[2].src94=current.src;(window.SCENE_FILES=window.SCENE_FILES||{})[k]=current.src;waiting=!!current.game;out.push(b,['sys','bgm',{m:current.music}],['sys','fx',{k:current.ambient}]);continue;}}
   if(b[1]==='line'){activity();b[2].opts.forEach(o=>o.then=decorate(w,o.then,chapter,section,episode,lang,counter));}
   if(b[1]==='if'){const r=['committed','slow','independent'].find(r=>b[2].cond&&b[2].cond.flag==='end_'+r);const s=chapter>18&&r?r:section,ep=chapter>18?chapter-18:episode;b[2].then=decorate(w,b[2].then,chapter,s,ep,lang,chapter>18&&r?{n:0}:counter);b[2].else=decorate(w,b[2].else,chapter,s,ep,lang,counter);}
   out.push(b);
   if(b[1]==='set'&&(b[2].flags||[]).includes('first_kiss'))out.push(['sys','fx100',{id:'kiss_mark'}]);
  }activity();return out;
 }
 function neutral(c){const text=(c.n94&&c.n94.en||c.n||'?').slice(0,1).toUpperCase();return 'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="64" fill="#24212b"/><text x="64" y="81" text-anchor="middle" font-family="sans-serif" font-size="48" fill="#d2bfa5">'+text+'</text></svg>');}
 function portraits(w){if(!own(w))return;w.cast.forEach(id=>{const c=ch(id);if(c&&c.n!=='Dante'&&!(c.n94&&Object.values(c.n94).includes('Dante')))S.art[id]=neutral(c)});}
 function migrate(a,lookup){const out=[];for(const raw of a||[]){if(!Array.isArray(raw)){out.push(raw);continue}const b=JSON.parse(JSON.stringify(raw));if(b[1]==='bgm'||(b[1]==='cg94'&&['cg_together','cg_kiss','cg_conversation'].includes((b[2]||{}).slot)))continue;if(b[1]==='scene'){const row=lookup.find(r=>Object.values(r.place).includes(b[2].place));if(row){const k='m105scene:'+row.key;b[2].img=k;b[2].src94=row.src;b[2].m105Scene=row.key;(window.SCENE_FILES=window.SCENE_FILES||{})[k]=row.src;out.push(b,['sys','bgm',{m:row.music}],['sys','fx',{k:row.ambient}]);continue;}}if(b[1]==='if'){b[2].then=migrate(b[2].then,lookup);b[2].else=migrate(b[2].else,lookup)}if(b[1]==='line')b[2].opts.forEach(o=>o.then=migrate(o.then,lookup));out.push(b);}return out;}
 function apply(w){portraits(w);if(!plan||!own(w)||!w.pack||!w.pack.m105Version||w.pack.m105Experience===VER)return;
  w.pack.chapters.forEach((c,i)=>{for(const l of ['zh','en'])c.beats[l]=decorate(w,c.beats[l],i+1,'main',0,l);});
  w.pack.authoredMedia105=true;w.pack.m105Experience=VER;
  for(const th of Object.values(S.threads||{})){if(th.wid!==w.id||!th.pk)continue;const section=th.pk.ch>18&&window.M105_RUNTIME.route(th)||'main',episode=Math.max(0,th.pk.ch-18),lookup=rows(th.pk.ch,section,episode);
   th.pk.q=migrate(th.pk.q,lookup);const row=lookup.find(r=>Object.values(r.place).includes(th.status&&th.status.place));if(row){th.pk.bg='m105scene:'+row.key;th.pk.bgm=row.music;th.pk.fx=row.ambient;if(curT===th.id){sceneBg(th,th.pk.bg);if(typeof bgmFollow==='function')bgmFollow(th,false);if(window.FXBUS)FXBUS.ambient(th,row.ambient,'author')}}
  }save();
 }
 const install=installWork;installWork=async function(id){if(id===ID)await load();const wid=await install.apply(this,arguments);apply(wid&&wd(wid));return wid;};
 const assets=off94Assets;off94Assets=async function(id){const r=await assets.apply(this,arguments);if(id===ID)Object.values(S.mine.worlds||{}).forEach(portraits);return r;};
 Promise.all([load(),window.M105_RUNTIME.load()]).then(()=>Object.values(S.mine.worlds||{}).forEach(apply)).catch(e=>console.warn('[M105 media]',e.message));
 if(window.FXBUS){const f=FXBUS.fromScript;FXBUS.fromScript=function(th){if(own(th&&wd(th.wid)))return false;return f.apply(this,arguments)}}
 if(typeof mgMatch==='function'){const m=mgMatch;mgMatch=function(){const th=S.threads[curT];return own(th&&wd(th.wid))?null:m.apply(this,arguments)};}
 STOPK.add('m105activity');const stop=stopHTML;stopHTML=function(th){const b=th.pk&&th.pk.stop;if(!own(wd(th.wid))||!b||b[1]!=='m105activity'||!plan)return stop.apply(this,arguments);const g=plan.games[b[2].id];if(!g)return stop.apply(this,arguments);return '<div class="sttag">'+esc(local(g.title))+'</div><p>'+esc(local(g.intro))+'</p><button class="btn btn-p btn-block" data-m105-play="'+esc(b[2].id)+'">'+(CL()==='zh'?'开始互动':'Start activity')+'</button><button class="btn btn-g btn-block" data-m105-skip="1">'+(CL()==='zh'?'跳过，继续剧情':'Skip and keep reading')+'</button>';};
 function valid(g,a){const selected=Object.keys(a).filter(k=>a[k]!==false);if(g.kind==='classify')return g.items.every((x,i)=>a[i]===x.answer);if(selected.length!==g.min&&g.kind==='budget')return false;if(selected.length<g.min)return false;return g.kind!=='budget'||selected.reduce((s,k)=>s+g.items[k].cost,0)<=g.budget;}
 function draw(){if(!active)return;const g=plan.games[active.id],a=active.answers,zh=CL()==='zh';let h='<h2>'+esc(local(g.title))+'</h2><p>'+esc(local(g.intro))+'</p>';
  g.items.forEach((item,i)=>{if(g.kind==='classify'){h+='<article class="card"><p>'+esc(local(item.t))+'</p><div class="row wrap">'+g.categories.map((c,j)=>'<button class="chip'+(a[i]===j?' on':'')+'" data-m105-choice="'+i+'" data-value="'+j+'">'+esc(local(c))+'</button>').join('')+'</div></article>';}else h+='<button class="btn btn-g btn-block" aria-pressed="'+!!a[i]+'" data-m105-choice="'+i+'">'+(a[i]?'✓ ':'○ ')+esc(local(item.t||item))+(g.kind==='budget'?' · '+item.cost:'')+'</button>';});
  if(g.kind==='budget'){const cost=Object.keys(a).filter(k=>a[k]).reduce((s,k)=>s+g.items[k].cost,0);h+='<p role="status">'+(zh?'合计：':'Total: ')+cost+' / '+g.budget+'</p>';}
  h+='<button class="btn btn-p btn-block" data-m105-finish="1"'+(valid(g,a)?'':' disabled')+'>'+(zh?'保存并继续':'Save and continue')+'</button><button class="btn btn-g btn-block" data-m105-skip="1">'+(zh?'跳过，继续剧情':'Skip and keep reading')+'</button>';sheet(h);
 }
 function finish(th,skip){const beat=th.pk&&th.pk.stop;if(!beat||beat[1]!=='m105activity')return false;const id=beat[2].id,g=plan.games[id];if(!skip&&(!active||active.th!==th.id||active.id!==id||!valid(g,active.answers)))return false;
  th.pk.m105Activities=th.pk.m105Activities||{};th.pk.m105Activities[id]={at:Date.now(),skipped:!!skip,answers:skip?{}:Object.assign({},active.answers)};pkSet(th,'m105_activity_'+id+(skip?'_skipped':'_done'));active=null;closeSheet();save();stopResolve(th,[]);return true;
 }
 document.addEventListener('click',e=>{const x=e.target.closest('[data-m105-play],[data-m105-choice],[data-m105-finish],[data-m105-skip]');if(!x)return;const th=S.threads[curT];if(!th||!own(wd(th.wid))||!th.pk||!th.pk.stop||th.pk.stop[1]!=='m105activity')return;
  if(x.dataset.m105Skip){finish(th,true);return}if(x.dataset.m105Play){active={th:th.id,id:x.dataset.m105Play,answers:{}};draw();return}if(!active||active.th!==th.id)return;
  if(x.dataset.m105Choice!==undefined){const i=+x.dataset.m105Choice,g=plan.games[active.id];if(g.kind==='classify')active.answers[i]=+x.dataset.value;else active.answers[i]=!active.answers[i];draw();return}if(x.dataset.m105Finish)finish(th,false);
 });
 window.M105_MEDIA={load,apply,decorate,migrate,valid,finish,version:VER};
})();
