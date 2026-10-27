/* ---- v132 onboarding picks that actually follow your choices ----
   Each story's tropes = its tags + a hand-checked trope map. Rare tropes weigh more than common ones (picking
   "Brother's Best Friend" matters more than "Slow Burn"), heat is a tie-breaker not the decider, and equal scores
   are broken by a hash of your exact choices so different answers never collapse onto the same three stories. */
function wTropes(w){const m=(typeof TROPE_MAP!=="undefined"&&TROPE_MAP[w.id])||[];return [...new Set([...(w.tags||[]),...m])]}
let _tropeCnt=null;function tropeCnt(){if(_tropeCnt)return _tropeCnt;const c={};packWorlds().forEach(w=>wTropes(w).forEach(x=>c[x]=(c[x]||0)+1));return _tropeCnt=c}
function hash32(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0)/4294967295}
obMatch=function(w){const tr=S.tropes||[],wt=wTropes(w),cnt=tropeCnt(),hits=tr.filter(x=>wt.includes(x));
 const hd=S.heat?Math.abs(OB_HEAT.indexOf(w.heat)-OB_HEAT.indexOf(S.heat)):0,orx=S.or&&S.or!=="all"&&w.or===S.or;
 const tw=hits.reduce((a,x)=>a+40/(1+Math.log2(1+(cnt[x]||1))),0);
 const sc=tw+(S.heat?(hd===0?10:hd===1?3:-6):0)+(orx?8:0)+(w.cover?3:0)+Math.log10(w.stats?w.stats[0]:10)*.6+((S.favs||{})[w.id]?12:0)+hash32(tr.join("|")+"#"+S.heat+"#"+w.id)*5;
 const frac=tr.length?hits.length/tr.length:0;
 const pct=Math.max(72,Math.min(99,Math.round(74+frac*20+(S.heat&&hd===0?4:0)+(hits.length>=2?2:0))));
 const why=hits.sort((a,b)=>(cnt[a]||0)-(cnt[b]||0)).slice(0,3).map(x=>tagName(x));if(S.heat&&hd===0)why.push(t("heat."+S.heat));
 return {w,sc,pct,why}};
/* the heat label shouldn't repeat a trope that is already listed (Slow Burn / Slow burn) */
const _obMatch33=obMatch;obMatch=function(w){const r=_obMatch33(w);const seen=new Set();r.why=r.why.filter(x=>{const k=String(x).toLowerCase();if(seen.has(k))return false;seen.add(k);return true});return r};
/* ---- actions *…* and inner voice （…） inside spoken bubbles get the legend's colours and markers ---- */
fmtMix=function(h){return String(h).replace(/\*([^*<]{1,80})\*/g,'<em class="ma">$1</em>').replace(/（([^）<]{1,80})）/g,'<em class="mt">$1</em>').replace(/\(([^)<]{1,80})\)/g,'<em class="mt">$1</em>')};
(function(){const st=document.createElement("style");st.textContent=`
.chatscreen em.ma,.chatscreen em.mt{display:block;font-size:12.5px;line-height:1.45;font-style:italic;font-weight:600;margin-bottom:3px}
.chatscreen em.ma::before{content:"✱ ";font-style:normal}
.chatscreen em.mt::before{content:"💭 ";font-style:normal}
.chatscreen .m-row.me .bub em.ma,.chatscreen .m-row.me .bub em.mt{background:none!important;padding:0!important;border:0!important;box-shadow:none!important;border-radius:0!important}
.chatscreen .m-row.me .bub em.ma{color:#8A3D0F!important}
.chatscreen .m-row.me .bub em.mt{color:#4B2A8A!important}
.chatscreen .tsay em.ma{color:#F0B77E!important}
.chatscreen .tsay em.mt{color:#C3B2F5!important}`;document.head.appendChild(st)})();
/* before the story starts, show the intro from its top: background first, not the how-to at the bottom */
/* 2026-10-27：从「包 renderChat」搬成钩子（收尾批次）。逻辑原样。 */
const __body_recs33 = function () { const th=S.threads[curT];if(th&&th.pk&&th.pk.stop&&th.pk.stop[1]==="start"){const m=$("#msgs");if(m&&!th._introShown){const go=()=>{const it=$("#msgs .m-intro");if(it)m.scrollTop=Math.max(0,it.offsetTop-8)};[60,350,900].forEach(d=>setTimeout(go,d));setTimeout(()=>{th._introShown=1},950)}} };
if (window.UI && typeof window.UI.add === "function") window.UI.add("recs33", __body_recs33);
else { const _renderChat33 = renderChat; renderChat = function () { const r = _renderChat33.apply(this, arguments); __body_recs33(); return r; }; };
const _packRefresh33=packRefresh;packRefresh=function(th){const r=_packRefresh33.apply(this,arguments);try{if(th&&th.id===curT&&th.pk&&th.pk.stop&&th.pk.stop[1]==="start"&&!th._introShown){const m=$("#msgs");const go=()=>{const it=$("#msgs .m-intro");if(m&&it)m.scrollTop=Math.max(0,it.offsetTop-8)};[30,300,800].forEach(d=>setTimeout(go,d));setTimeout(()=>{th._introShown=1},850)}}catch(_){}return r};
