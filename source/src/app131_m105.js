/* M105 V6: authored choices, one work, three conditional post-season routes. */
(function () {
  const ID='w_scmvxnqoko453e6d7bc3', VERSION='m105-v6-20261107.1';
  const routes=['committed','slow','independent'];let data=null,pending=null;
  const own=w=>w&&w.community===ID;
  const route=th=>routes.find(r=>th&&th.pk&&th.pk.flags&&th.pk.flags['end_'+r]);
  async function load(){if(data)return data;if(!pending)pending=fetch('art/official/m105-v6/runtime.json?v='+VERSION).then(r=>{if(!r.ok)throw Error('M105 content unavailable');return r.json()}).then(j=>data=j).catch(e=>{pending=null;throw e});return pending;}
  function bind(w,arr){const by={};w.cast.forEach(id=>{const c=ch(id);if(c){by[c.n]=id;if(c.n94)Object.values(c.n94).forEach(n=>by[n]=id)}});const A=OFF94.assets[ID]||{};
    return (arr||[]).map(b=>{if(!Array.isArray(b))return b;b=JSON.parse(JSON.stringify(b));
      if(b[0]==='@pov'||b[0]==='@你')b[0]=w.cast.find(id=>ch(id)&&ch(id).n==='你')||'n';
      else if(b[0][0]==='@')b[0]=by[b[0].slice(1)]||'n';
      if(b[1]==='if'){b[2].then=bind(w,b[2].then);b[2].else=bind(w,b[2].else)}
      if(b[1]==='line')b[2].opts.forEach(o=>o.then=bind(w,o.then));
      if(b[1]==='scene'&&b[2].bg94&&A[b[2].bg94]){const k='off94:'+ID+':'+b[2].bg94;b[2].img=k;b[2].src94=A[b[2].bg94];(window.SCENE_FILES=window.SCENE_FILES||{})[k]=b[2].src94}
      if(b[1]==='cg94'&&A[b[2].slot])b[2].src=A[b[2].slot];return b;
    });
  }
  function configure(w){if(!own(w)||!w.pack||!data)return;if(!['Dante','Elena','Vince','June'].every(n=>w.cast.some(id=>ch(id)&&ch(id).n===n)))return;const P=w.pack;if(P.m105Version===VERSION)return;
    const bi=(z,e)=>({zh:z||'',en:e||z||''});
    P.chapters=data.main.zh.map((z,i)=>{const e=data.main.en[i];return {t:bi(z.title,e.title),goal:bi(z.goal&&z.goal.zh,e.goal&&e.goal.en),goalOwn:true,place:bi('',''),time:bi('',''),ask:bi(z.ask,e.ask),beats:{zh:bind(w,z.beats),en:bind(w,e.beats)},choices:z.choices.map((o,j)=>({k:o.k,t:bi(o.t,e.choices[j]&&e.choices[j].t),set:o.set,mem:bi('',''),then:{zh:bind(w,o.then),en:bind(w,e.choices[j]&&e.choices[j].then)}})),outline:false};});
    for(let i=0;i<3;i++){const branches=lang=>routes.map(r=>{const c=data.routes[r][lang][i],beats=bind(w,c.beats);if(c.choices.length)beats.push([w.cast.find(id=>ch(id)&&ch(id).n==='Dante')||w.cast[0],'line',{hint:c.ask,opts:c.choices.map(o=>({k:'say',t:o.t,set:o.set,then:bind(w,o.then)}))}]);return ['sys','if',{cond:{flag:'end_'+r},then:beats}]});
      P.chapters.push({t:bi('后续故事 · 第 '+(i+1)+' 集','After the finale · Episode '+(i+1)),goal:bi('延续你确认的关系与边界。','Continue on the relationship terms you chose.'),goalOwn:true,place:bi('',''),time:bi('',''),ask:bi('',''),beats:{zh:branches('zh'),en:branches('en')},choices:[{k:'A',t:bi('继续','Continue'),then:{zh:[],en:[]},mem:bi('','')}],outline:false,advanceOnly:true});
    }
    P.ready=P.chapters.length;P.exp74=1;P.minRoundsPerChapter=0;P.endings={A:{t:bi('认真相爱','Committed, on equal terms')},B:{t:bi('慢慢了解','Taking your time')},C:{t:bi('自己的生活','Your independent life')},complete:{t:bi('这一季结束，生活继续','The season ends. Life continues.'),txt:bi('',''),line:bi('','')}};P.m105Version=VERSION;
  }
  const install=installWork;installWork=async function(id){if(id===ID){await Promise.all([load(),off94Assets(ID)])}const wid=await install.apply(this,arguments);configure(wid&&wd(wid));if(wid)save();return wid;};
  load().then(()=>{Object.values(S.mine.worlds||{}).forEach(configure)}).catch(e=>console.warn('[M105]',e.message));
  const set=pkSet;pkSet=function(th,flags){if(own(th&&wd(th.wid))&&(Array.isArray(flags)?flags:[flags]).some(f=>routes.some(r=>f==='end_'+r))){th.pk.flags=th.pk.flags||{};routes.forEach(r=>delete th.pk.flags['end_'+r])}return set.apply(this,arguments)};
  const need=EN;EN=function(th){return own(th&&wd(th.wid))?0:need.apply(this,arguments)};
  const love=packLove;packLove=function(th){if(!own(th&&wd(th.wid)))return love.apply(this,arguments)};
  const write=loveWrite;loveWrite=function(th,cid,d,reason){if(own(th&&wd(th.wid))&&reason==='ending:A')return;return write.apply(this,arguments)};
  const after=packAfterPick;packAfterPick=function(th){const n=th&&th.pk&&th.pk.ch;const result=after.apply(this,arguments);if(own(th&&wd(th.wid))&&n===18){pkSet(th,['ch18_complete','route_confirmed']);const r=route(th);if(r){const ps=packSt(th.wid);ps.end=ps.end||{};ps.end['ABC'[routes.indexOf(r)]]=1}save()}return result;};
  const translate=t;t=function(key){if(key==='sp.endRule'&&own(wd(curStory)))return CL()==='zh'?'第 17 章由你选择关系走向：认真相爱、慢慢了解，或保留自己的生活。三条路线都无需累计 A 选项。':'In chapter 17, choose a committed relationship, a slower romance, or your independent life. No route requires an A-choice score.';return translate.apply(this,arguments);};
  const page=storyPage;storyPage=function(id){const result=page.apply(this,arguments);if(own(wd(id))){const box=$('#s-story');if(box)box.querySelectorAll('.chrow p').forEach(p=>p.remove())}return result;};
  function eligible(th,e,now){const r=route(th),state=(th.pk.m105Events||{})[e.id];return !!(r&&th.pk.flags.ch18_complete&&e.eligible_relationships.includes(r)&&(!state||now-state.at>=e.cooldown_days*86400000));}
  function menu(th){if(!data||!own(wd(th.wid)))return;const now=Date.now(),lang=CL()==='zh'?'zh':'en';const es=data.events.filter(e=>eligible(th,e,now));sheet('<h2>'+esc(lang==='zh'?'选择一个生活片段':'Choose a life moment')+'</h2><p>'+esc(lang==='zh'?'只有你主动打开的事件才会发生。':'An event starts only when you choose it.')+'</p>'+es.map(e=>'<button class="btn btn-g btn-block" data-m105-event="'+esc(e.id)+'">'+esc(e.opening[lang])+'</button>').join('')+(es.length?'':'<p>'+esc(lang==='zh'?'生活片段正在冷却中。':'Life moments are on cooldown.')+'</p>'));}
  const panel=packPanel;packPanel=function(th){const h=panel.apply(this,arguments);return own(th&&wd(th.wid))&&th.pk.st==='end'&&route(th)?h+'<button class="btn btn-g btn-block" data-m105-events="1">'+(CL()==='zh'?'生活继续 · 自选片段':'Life continues · Choose a moment')+'</button>':h;};
  document.addEventListener('click',function(ev){const x=ev.target.closest('[data-m105-events],[data-m105-event],[data-m105-option]');if(!x)return;const th=S.threads[curT];if(!th||!th.pk||!own(wd(th.wid)))return;
    if(x.dataset.m105Events){menu(th);return}const id=x.dataset.m105Event||x.dataset.m105Option,e=data&&data.events.find(e=>e.id===id);if(!e||!eligible(th,e,Date.now()))return;const lang=CL()==='zh'?'zh':'en',s=e.script[lang];
    if(x.dataset.m105Event){sheet('<h2>'+esc(e.title[lang])+'</h2><p>'+esc(s.scene)+'</p><p>'+esc(s.player_prompt)+'</p>'+s.choices.map((o,i)=>'<button class="btn btn-g btn-block" data-m105-option="'+esc(id)+'" data-option="'+i+'">'+esc(o.label)+'</button>').join(''));return}
    const o=s.choices[+x.dataset.option];if(!o)return;closeSheet();th.pk.m105Events=th.pk.m105Events||{};th.pk.m105Events[id]={at:Date.now(),choice:o.key,completion:id+':'+Date.now()};pkSet(th,o.effect&&o.effect.set_flag);
    appendMsg(th,{who:'n',k:'act',txt:s.scene,at:Date.now()});appendMsg(th,{who:'me',k:'say',txt:o.label,at:Date.now()});appendMsg(th,{who:'n',k:'act',txt:o.response,at:Date.now()});th.mem=th.mem||[];th.mem.push(e.id+': '+o.label+' — '+o.response);save();packRefresh(th);
  });
  window.M105_RUNTIME={configure,route,eligible,load,version:VERSION};
})();
