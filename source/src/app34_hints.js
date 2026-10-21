/* ---- v133 games give you something to go on ----
   Compatibility quiz: every question has a 💡 "think back" clue that quotes the moment in the story where the answer
   was shown (or the question's own clue). CCTV puzzle: each camera tile shows what the narration said about it. */
function storyLines(th){const out=[];(th.msgs||[]).forEach(m=>{if(m.k==="box"){(m.parts||[]).forEach(p=>p.txt&&out.push(p.txt));if(m.say)out.push((ch(m.say.who)?first(ch(m.say.who).n)+"：":"")+m.say.txt)}else if(m.txt&&typeof m.txt==="string")out.push(m.txt)});return out}
function clueFor(th,q){if(q.clue)return L(q.clue)||q.clue;const ans=String((L(q.opts)||q.opts)[q.a]||"").replace(/[，。、！？…—\s,.!?]/g,"");if(!ans)return "";
 const lines=storyLines(th);let best="",bs=0;
 for(const ln of lines){let sc=0;for(let n=Math.min(6,ans.length);n>=2;n--){for(let i=0;i+n<=ans.length;i++){if(ln.includes(ans.slice(i,i+n))){sc=Math.max(sc,n);break}}if(sc)break}
  if(sc>bs){bs=sc;best=ln}}
 return bs>=2?best:""}
window.onMatchQ=function(th,q){try{const c=clueFor(th,q);const st=$(".sheet .stack");if(st)st.insertAdjacentHTML("afterend",'<button class="mqclue" data-mqclue="1">💡 '+t("hn.think")+' · '+(S.plus?t("hn.vip"):'💎'+HINT_PRICE)+'</button><p class="mqcl" id="mqCl" hidden>'+(c?'“'+esc(c.length>90?c.slice(0,90)+"…":c)+'”':t("hn.none"))+'</p>')}catch(_){}};
const HINT_PRICE=1;
document.addEventListener("click",e=>{if(e.target.closest("[data-mqclue]")){if(!S.plus&&!spend(HINT_PRICE,"event"))return;try{const q=MQ&&MQ.d&&MQ.d.qs[MQ.i];if(q){const n=(L(q.opts)||q.opts).length;let w=[...Array(n).keys()].filter(j=>j!==q.a);const j=w[Math.floor(Math.random()*w.length)];const b=$('[data-mqa="'+j+'"]');if(b){b.disabled=true;b.style.opacity=".35";b.style.textDecoration="line-through"}}}catch(_){}const p=$("#mqCl");if(p)p.hidden=false;e.target.closest("[data-mqclue]").remove()}});
/* CCTV tiles: show what the story told you about each camera */
const _feedObs=new MutationObserver(()=>{const g=$(".sheet .cctv");if(!g||g.dataset.cap)return;g.dataset.cap=1;const th=S.threads[curT];if(!th)return;const lines=storyLines(th).slice(-40);
 g.querySelectorAll("[data-cam]").forEach((b,i)=>{const k="CAM "+String.fromCharCode(65+i);const ln=[...lines].reverse().find(x=>x.indexOf(k)===0||x.indexOf(k+"，")>=0||x.indexOf(k+",")>=0);if(ln)b.insertAdjacentHTML("beforeend",'<span class="camcap">'+esc(ln.replace(/^CAM [A-D][，,]?\s*/,""))+'</span>')})});
_feedObs.observe(document.body,{childList:true,subtree:true});
Object.assign(I18N.zh,{"hn.think":"AI 提示","hn.none":"这一题考的是你对他的了解——想想他一路上的样子。","hn.vip":"会员免费"});
Object.assign(I18N.en,{"hn.think":"AI hint","hn.none":"This one tests how well you know him — think about what he's done so far.","hn.vip":"members free"});
(function(){const st=document.createElement("style");st.textContent=`
.mqclue{display:block;margin:12px auto 0;padding:7px 14px;border-radius:99px;border:1px dashed rgba(240,183,126,.55);background:rgba(240,183,126,.08);color:#F0B77E;font-size:12.5px}
.mqcl{margin:8px 4px 0;font-size:13px;line-height:1.55;color:#E9E2EE;background:rgba(255,255,255,.05);border-left:3px solid #F0B77E;padding:8px 10px;border-radius:0 10px 10px 0}
.cam{position:relative}.camcap{position:absolute;left:6px;right:6px;bottom:22px;font-size:10.5px;line-height:1.35;color:#fff;background:rgba(0,0,0,.62);padding:4px 6px;border-radius:6px;text-align:left}`;document.head.appendChild(st)})();
/* in written lines, （…） is a stage direction (an action), not inner voice: show it with the ✱ action marker */
function stageDir(s){return String(s||"").replace(/（([^）]{1,60})）/g,"*$1*").replace(/\(([^)]{1,60})\)/g,"*$1*")}
const _boxHTML34=boxHTML;boxHTML=function(m,i,th){if(m&&m.say&&m.pk!==0){m=Object.assign({},m,{say:Object.assign({},m.say,{txt:stageDir(m.say.txt)})})}return _boxHTML34(m,i,th)};
const _msgHTML34=msgHTML;msgHTML=function(m,i,th){if(m&&m.pk&&m.k==="say"&&th&&th.pk&&m.who===th.pk.as)m=Object.assign({},m,{txt:stageDir(m.txt)});return _msgHTML34(m,i,th)};
