/* ================= v2.4 · feed fixes =================
   1) Characters post at most ONE moment per day each: the day's live post if there is one, otherwise one of their written posts,
      rotated by date (so tomorrow shows a different one). Identical texts are never shown twice.
   2) "Save to my moments" from a story (e.g. the Vale heir post) can't create duplicates when a chapter is replayed;
      existing duplicates in saved data are merged (comments kept, the newest copy stays). */
function dayN(){return Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5)}
const _feedPosts63=feedPosts;
feedPosts=function(){const all=_feedPosts63.apply(this,arguments)||[],byWho={},seenTxt=new Set(),out=[];
 all.forEach(p=>{if(!p||!p.who)return;(byWho[p.who]=byWho[p.who]||[]).push(p)});
 Object.keys(byWho).forEach(w=>{const L=byWho[w],live=L.find(p=>p.day===today()||p.daily);const pick=live||L[(dayN()+hash(w))%L.length];
  const key=String(Lz(pick.txt)||pick.txt||"").trim();if(key&&seenTxt.has(key))return;seenTxt.add(key);out.push(pick)});
 return out.sort((a,b)=>(b.at||0)-(a.at||0))};
function momDedupe(){const L=S.moments||[];if(L.length<2)return;const keep=[],byTxt={};
 L.forEach(p=>{const k=String(p.txt||"").trim()+"|"+(p.img?String(p.img).slice(-40):"");const o=byTxt[k];
  if(!o||!k.trim()){byTxt[k]=p;keep.push(p);return}
  /* merge comments into the copy we keep (the newer one comes first in the list) */
  const ids=new Set((o.cm||[]).map(c=>c.id));(p.cm||[]).forEach(c=>{if(!ids.has(c.id))(o.cm=o.cm||[]).push(c)});o.likes=Math.max(o.likes||0,p.likes||0)});
 if(keep.length!==L.length){S.moments=keep;save()}}
(typeof soft==="function"?soft:function(n,f){try{return f()}catch(e){}})("app63_fixes:L19",function(){momDedupe()});
document.addEventListener("click",e=>{const x=e.target.closest("[data-xpsave]");if(!x)return;const th=S.threads[curT],m=th&&th.msgs[+x.dataset.xpsave];if(!m)return;
 const txt=String(Lz(m.txt)||"").trim();if((S.moments||[]).some(p=>String(p.txt||"").trim()===txt)){m.saved=1;save();e.stopImmediatePropagation();toast(CL()==="zh"?"已经在你的动态里了":"Already in your moments");renderChat()}},true);
