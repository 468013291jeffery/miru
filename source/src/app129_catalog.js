/* Catalog availability, 2026-11-06: retain source and local history. */
(function(){
  const retired=new Set(['heir','pole','heroics','float','ice','secondset','forecast','openhouse','crush','laundry','lastplate','honor','fourth','crimson','pack','made','gala','night','twominutes','turn','august','recipe','dog','dragon','unseelie','pact','rewind','split','lastjam','bratva','afterhours','masque','light','market','offbook','lowseason','roomies','landing','m102']);
  const available=w=>!!w&&!retired.has(w.id);
  const worlds=allWorlds;allWorlds=function(){return worlds.apply(this,arguments).filter(available)};
  const packs=packWorlds;packWorlds=function(){return packs.apply(this,arguments).filter(available)};
  const orient=orOK;orOK=function(w){return available(w)&&orient.apply(this,arguments)};
  const chars=allChars;allChars=function(){return chars.apply(this,arguments).filter(id=>{const c=ch(id);return c&&!retired.has(c.w)})};
  const unavailable=()=>toast(CL()==='zh'?'这部剧已下线，已有记录仍保留。':'This story is unavailable. Your history is preserved.');
  const story=openStory;openStory=function(id){if(retired.has(id)){unavailable();return}return story.apply(this,arguments)};
  const sheet=startSheet;startSheet=function(id){if(retired.has(id)){unavailable();return}return sheet.apply(this,arguments)};
  const start=packStart;packStart=function(id){if(retired.has(id)){unavailable();return}return start.apply(this,arguments)};
  document.addEventListener('click',function(e){
    const t=e.target&&e.target.closest&&e.target.closest('[data-story],[data-pkstart],[data-chto],[data-char]');if(!t)return;
    const cid=t.dataset.char,c=cid&&ch(cid),id=t.dataset.story||t.dataset.pkstart||(t.dataset.chto||'').split('|')[0]||(c&&c.w);
    if(retired.has(id)){e.preventDefault();e.stopImmediatePropagation();unavailable()}
  },true);
})();


/* Catalog pin guard */
(function(){const blocked=new Set(['heir','pole','heroics','float','ice','secondset','forecast','openhouse','crush','laundry','lastplate','honor','fourth','crimson','pack','made','gala','night','twominutes','turn','august','recipe','dog','dragon','unseelie','pact','rewind','split','lastjam','bratva','afterhours','masque','light','market','offbook','lowseason','roomies','landing','m102']);const f=feedList;feedList=function(){return f.apply(this,arguments).filter(w=>!blocked.has(w.id))};document.querySelectorAll("#feed [data-fw]").forEach(el=>{if(blocked.has(el.dataset.fw))el.remove()})})();
