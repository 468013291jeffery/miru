/* V2.2 official manuscripts use the shared native engine; only these works opt in. */
(function () {
  'use strict';
  const works=new Set(['w_scmwzzyizs9e25d81856','w_scmwzzyj6ic3f89e7bbc','w_scmwzzyjclce837623b6']);
  const on=w=>!!(w&&works.has(w.community));
  const assets=w=>OFF94.assets[w.community]||{};
  const data=w=>assets(w).v22;
  const role=(w,id)=>{const c=ch(id);return data(w)?.characters.find(x=>x.canonical===(c?.n94?.zh||c?.n));};
  const language=()=>({zh:'Simplified Chinese',en:'English',ja:'Japanese',ko:'Korean',es:'Spanish'})[CL()]||'English';
  function configure(w){
    if(!on(w)||!data(w))return;
    w.pack.nativeV2=1;w.pack.minRoundsPerChapter=0;
    const ids=names=>(names||[]).map(n=>w.cast.find(id=>(ch(id)?.n94?.zh||ch(id)?.n)===n)).filter(Boolean);
    for(const id of w.cast){const c=ch(id),r=role(w,id);if(!r)continue;
      c.v22Role=r.canonical;c.romanceable=r.romanceable;c.voiceId=r.voice;
      c.n94={zh:r.canonical,en:r.names.en||r.canonical};
      c.n=r.names[CL()]||r.names.en||r.canonical;
    }
    w.leads=w.cast.filter(id=>role(w,id)?.romanceable);
    for(const c of w.pack.chapters)for(const beats of Object.values(c.beats||{})){
      function walk(rows){for(const b of rows||[]){if(!Array.isArray(b))continue;const d=b[2];
        if(b[0]==='sys'&&b[1]==='scene'&&assets(w).scene_present?.[d.bg94])d.nativePresent=ids(assets(w).scene_present[d.bg94]);
        if(d&&typeof d==='object'){walk(d.then);walk(d.else);for(const o of d.opts||[])walk(o.then);}
      }}walk(beats);
    }
    for(const [k,u] of Object.entries(assets(w))){
      if(k.startsWith('bgm_')&&typeof u==='string'){
        (window.BGM_FILES=window.BGM_FILES||{})[k.slice(4)]=u;
        if(typeof BGM_MOODS!=='undefined')BGM_MOODS[k.slice(4)]={bpm:72,ch:[[60,64,67]],arp:[]};
      }
      if(k.startsWith('sfx_')&&typeof u==='string'&&typeof SFX100!=='undefined'){
        const id=k.slice(4);if(!SFX100.some(x=>x.id===id))SFX100.push({id,zh:k,en:k,L:[],kw:[]});
        SFX_FILES[id]=u;
      }
    }
  }
  PARSE.use('three-stories-v22:bindings',{build(next,doc,as){const r=next(doc,as);configure(wd(r&&(r.wid||r)));return r;}});
  const merge=off94MergeEn;
  off94MergeEn=function(wid,P){const r=merge.apply(this,arguments),w=wd(wid);configure(w);
    if(on(w)&&P){for(const [lang,suffix] of [['zh',''],['en','_en'],['ja','_ja'],['ko','_ko'],['es','_es']]){
      if(typeof imParse!=='function'||!P['script'+suffix])continue;
      const doc=imParse(P['script'+suffix]);
      w.pack.chapters.forEach((c,i)=>{c.done163Locales=c.done163Locales||{};c.done163Locales[lang]=doc.done163?.[i]||[];});
    }}return r;
  };
  const names=off94Names;
  off94Names=function(){const r=names.apply(this,arguments);for(const w of Object.values(S.mine.worlds||{}))configure(w);return r;};
  const card=castCardFace;
  castCardFace=function(th,id){const w=wd(th.wid),r=on(w)&&role(w,id);if(!r)return card.apply(this,arguments);
    return '- id='+id+' · '+(r.names[CL()]||r.names.en||r.canonical)+'. Role: '+(r.public_role?.[CL()]||r.public_role?.en||'')+'. Appearance: '+r.appearance+
      '\nVoice, habits and boundaries: '+r.voice_and_boundaries+
      (r.romanceable?'\nA potential romance route, only with explicit player consent.':'\nThis is not a romance route; no courtship or intimacy progression.')+
      '\nKnowledge comes only from this person’s own experience and evidence actually disclosed in this save. Never infer undisclosed facts from authoring cards or later chapters. No other person can read their thoughts.';
  };
  const prompt=packPrompt;
  packPrompt=function(th){const s=prompt.apply(this,arguments),w=wd(th.wid);if(!on(w)||!data(w))return s;
    const f=data(w).player?.fields||{};
    const endings=Object.entries(data(w).contract?.final_flags||{}).filter(([flag])=>th.pk?.flags?.[flag]).map(([flag,rule])=>({flag,intent:rule.intent,effect:rule.effect}));
    return s+'\nWORK-SPECIFIC PLAYER IDENTITY: '+[f.A02?.content,f.A03?.content,f.A07?.content].filter(Boolean).join(' ')+
      '\nOnly present characters may speak. Keep the current scene and wait for the player to advance. A game result proves only the recorded interaction; it cannot create evidence, agreement, forgiveness or a romantic commitment. A refusal, request to pause, or independence remains valid after the ending. No unsolicited contact after a declined invitation.'+
      '\nCONFIRMED ENDING STATE: '+JSON.stringify(endings)+'. Only these actual saved choices establish post-story intent; an empty list establishes none. Post-story contact requires fresh permission and must respect this ending.'+
      '\nOUTPUT LANGUAGE OVERRIDE: Use natural '+language()+' only, including narration and suggestions. Use each character’s localized name. Prior generic English-only instructions do not apply to this multilingual work.';
  };
  const result=mgResult;
  mgResult=function(th,d,r){const w=wd(th.wid);if(!on(w))return result.apply(this,arguments);
    if(!['win','lose','skip'].includes(r))return [];
    const ledger=th.pk.v22Games=th.pk.v22Games||[];
    ledger.push({chapter:th.pk.ch,scene:th.pk.nativeScene?.place||th.status?.place||'',game:d.id,result:r,at:Date.now()});
    if(ledger.length>96)ledger.shift();
    if(r==='win')pkSet(th,'v22_game_'+th.pk.ch+'_'+(th.pk.mgN||0)+'_win');
    th.pk.mgN=(th.pk.mgN||0)+1;save();
    const msg={zh:{win:'互动已完成，继续眼前的事。',lose:'这次没有完成，可以继续剧情。',skip:'已跳过，剧情照常继续。'},en:{win:'Interaction complete. Return to the scene.',lose:'Not completed this time. The story continues.',skip:'Skipped. The story continues.'},ja:{win:'操作が完了しました。場面に戻ります。',lose:'今回は未完了です。物語は続きます。',skip:'スキップしました。物語は続きます。'},ko:{win:'조작을 마쳤습니다. 장면으로 돌아갑니다.',lose:'이번에는 완료하지 못했습니다. 이야기는 계속됩니다.',skip:'건너뛰었습니다. 이야기는 계속됩니다.'},es:{win:'Interacción completada. Vuelve a la escena.',lose:'Esta vez no se completó. La historia continúa.',skip:'Omitido. La historia continúa.'}};
    return [['n','act',(msg[CL()]||msg.en)[r]]];
  };
  if(typeof renderChat==='function'){const render=renderChat;renderChat=function(){const th=S.threads[curT];if(th)configure(wd(th.wid));return render.apply(this,arguments);};}
})();
