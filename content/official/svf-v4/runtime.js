(function(){
 const R=window.SVF_RELEASE,E=createSvfEngine(),bi=x=>({zh:x,en:x});
 const own=th=>!!(th&&th.pk&&wd(th.wid)?.community===R.work_id);
 const state=th=>{th.pk.authoredContract=1;return th.pk.svf||(th.pk.svf=E.initial());};
 function configure(w){w.leads=w.cast.filter(id=>R.cast.some(c=>c.lead&&c.name===ch(id).n));w.bgm='warm';w.pack.minRoundsPerChapter=0;w.pack.authoredContract=1;for(const c of w.pack.chapters){for(const lang of ['zh','en']){const b=c.beats[lang].find(b=>b[1]==='scene');if(b){c.place[lang]=b[2].place||'';c.time[lang]=b[2].time||'';}}}if(w.premise){for(const lang of ['zh','en'])if(w.pack.intro?.[lang]){w.pack.intro[lang].bg=String(w.premise?.[lang]||'').split(/\n\s*\n/).filter(Boolean);w.pack.intro[lang].you=w.you?.[lang]||'';}}}
 PARSE.use('svf-v4',{build(next,doc,as){const r=next(doc,as),w=wd(r?.wid||r);if(OFF94.cur?.id!==R.work_id||!w)return r;
  configure(w);
  // The source's final choice precedes three conditional epilogues. Lift it into the
  // authored chapter ending so the legacy default “continue → A” cannot replace it.
  const c=w.pack.chapters[17];const lifted=c.choices;
  for(const lang of ['zh','en']){
   const a=c.beats[lang],at=a.findIndex(b=>b[1]==='line'&&b[2]?.opts?.length===3);
   const opts=at>=0?a[at][2].opts:lifted;
   const split=at>=0?at+1:a.findIndex(b=>b[1]==='scene'&&/^END A/.test(b[2]?.place||''));
   if(opts.length!==3||split<0)throw Error('SVF ending choice missing');
   const tail=a.slice(split),starts=tail.map((b,i)=>b[1]==='scene'?i:-1).filter(i=>i>=0);
   if(starts.length!==3)throw Error('SVF ending scenes missing');
   if(lang==='zh')c.choices=opts.map((o,i)=>({k:'ABC'[i],t:typeof o.t==='string'?bi(o.t):o.t,then:{},set:o.set||[],mem:typeof o.t==='string'?bi(o.t):o.t}));
   opts.forEach((o,i)=>{const route=tail.slice(starts[i],starts[i+1]??tail.length);c.choices[i].then[lang]=(Array.isArray(o.then)?o.then:o.then[lang]).concat(route);});
   c.advanceOnly=false;c.beats[lang]=a.slice(0,at>=0?at:split);
  }
  w.pack.endings={A:{t:bi('留下，重写团规'),txt:bi(''),line:null},B:{t:bi('回伦敦，建立公司'),txt:bi(''),line:null},C:{t:bi('站到自己的舞台上'),txt:bi(''),line:null}};
  return r;}});
 const set=pkSet;pkSet=function(th,value){const a=Array.isArray(value)?value:[value];if(own(th))E.apply(state(th),a);return set.call(this,th,a.filter(f=>!String(f).startsWith('svfdelta~')));};
 const need=EN;EN=function(th){return own(th)?0:need.apply(this,arguments);};
 const love=packLove;packLove=function(th){return own(th)?undefined:love.apply(this,arguments);};
 const pick=packPick;packPick=function(k){const th=S.threads[curT];if(own(th)&&th.pk.ch===18){const o=wd(th.wid).pack.chapters[17].choices.find(o=>o.k===k);if(!o||!E.eligible(state(th),k,o.set)){toast('该结局尚未满足原稿条件：'+({A:'任一男主好感 ≥ 8，绯闻风险 < 60',B:'家族距离 ≤ 3，威信 ≥ 70',C:'舞台轴 ≥ 8，家族距离 ≥ 7'}[k]));return;}}return pick.apply(this,arguments);};
 const prompt=packPrompt;packPrompt=function(th){const p=prompt.apply(this,arguments);return own(th)?p+'\nSEVENFOLD 内部演出规则：世界设定、图片描述、数值和样例玩家台词不是旁白。玩家只由本人发言；说停立即停止，不用感情惩罚拒绝。角色只说亲历和明确得知的事，不提前知道后续章或结局。当前已确认选择产生的数值：'+JSON.stringify(state(th).values):p;};
 const install=installWork;installWork=async function(id){const r=await install.apply(this,arguments),w=wd(r);if(id===R.work_id&&w)configure(w);return r;};
 const open=openThread;openThread=function(id){const th=S.threads[id];if(own(th)){configure(wd(th.wid));if(typeof EXPERIENCE124!=='undefined')for(const m of th.msgs||[])if(m.k==='chap'){const c=wd(th.wid).pack.chapters[m.n-1];if(c)m.brief124=EXPERIENCE124.brief(th,c,m.n);}}if(own(th)&&!th.msgs.some(m=>m.svfTrailer)){const A=OFF94.assets[R.work_id]||{};if(A.opening_video)th.msgs.unshift({who:'sys',k:'storyTrailer',src:A.opening_video,poster:A.cover,title:'开场预告片',intro98:'opening-media',svfTrailer:true,at:Date.now()});}return open.apply(this,arguments);};
 window.SVF_ENGINE={...E,own,state};
})();
