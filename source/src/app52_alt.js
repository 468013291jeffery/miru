/* ---- v152 · 「AI 换一句」 rethought ----
   Before: every tap cost 💎1 and the new line was often the old line reworded.
   Now: one paid tap writes THREE lines that must differ in approach (直接 / 克制 / 带刺或玩笑), each checked against the written line and
   everything already shown — near-duplicates are dropped. Switching between the three is free. If nothing distinct comes back, no charge.
   Offline (no live AI) the pre-written alternatives are always free. */
const ALT_TONES=[["直接","Direct"],["克制","Holding back"],["带刺","With an edge"]];
let ALTS=null; /* {key, list:[{t,tone}], i, seen:[]} */
function altKey(th){const d=th.pk.stop&&th.pk.stop[2];return th.id+"|"+(d&&d.t||"")}
function altGrams(s){s=String(s||"").replace(/[\s，。,.!?！？…“”"'‘’—\-]/g,"").toLowerCase();const g=new Set();for(let i=0;i<s.length-1;i++)g.add(s.slice(i,i+2));return g}
function altSim(a,b){const A=altGrams(a),B=altGrams(b);if(!A.size||!B.size)return a===b?1:0;let n=0;A.forEach(x=>{if(B.has(x))n++});return n/Math.min(A.size,B.size)}
function altDistinct(s,prev){return prev.every(p=>altSim(s,p)<0.5)}
async function altFetch(th){const d=th.pk.stop[2],c=ch(th.pk.as);const hist=th.msgs.slice(-8).map(m=>m.k==="box"?((m.parts||[]).map(p=>p.txt).join(" ")+(m.say?" "+first(ch(m.say.who).n)+": "+m.say.txt:"")):(m.who+": "+(m.txt||""))).join("\n");
 const seen=[d.t].concat(ALTS&&ALTS.seen||[],ALTS&&ALTS.list?ALTS.list.map(o=>o.t):[]);
 const r=await ask("You help a reader play "+c.n+" in an interactive drama. Recent scene:\n"+hist+"\nThe written line here is: \""+d.t+"\".\nAlready shown (do NOT repeat or paraphrase any of these): "+JSON.stringify(seen.slice(-9))+
  "\nWrite THREE alternative lines "+c.n+" could say at this moment, each a genuinely different move — not a rewording:\n1) direct: says the real thing plainly\n2) holding back: deflects, changes the subject or says less than he means\n3) with an edge: teasing, a challenge, or a dry joke\nEach must use different words and a different idea from the written line and from each other. Under 25 words, in his voice, in "+LANG_NAME[S.lang]+'. JSON {"lines":["","",""]}',{modelTier:"quick"});
 const raw=(r&&Array.isArray(r.lines)?r.lines:[r&&(r.line||r.text)]).map(s=>String(s||"").trim().replace(/^["“「]|["”」]$/g,"")).filter(Boolean);
 const out=[];raw.forEach((s,i)=>{if(altDistinct(s,seen.concat(out.map(o=>o.t))))out.push({t:s,tone:i})});return out}
function altPool(th){const d=th.pk.stop[2];return (((typeof ALT_LINES!=="undefined"&&ALT_LINES[th.pk.as])||{})[S.lang==="zh"?"zh":"en"]||{})[d.t]||[]}
/* intercept the old handler (window capture runs before document capture) */
window.addEventListener("click",async e=>{const x=e.target.closest&&e.target.closest("[data-myai],[data-altpick]");if(!x)return;const th=S.threads[curT];if(!th||!th.pk||!th.pk.stop||th.pk.stop[1]!=="myline")return;
 e.stopImmediatePropagation();e.preventDefault();const k=altKey(th);if(!ALTS||ALTS.key!==k)ALTS={key:k,list:[],i:-1,seen:[]};
 if(x.dataset.altpick!=null){const o=ALTS.list[+x.dataset.altpick];ALTS=null;if(o)mySay(th,o.t);return}
 if(MYL.busy)return;
 /* still unseen options from the last batch → free */
 if(ALTS.list.length&&ALTS.i<ALTS.list.length-1){ALTS.i++;MYL.sug=ALTS.list[ALTS.i].t;packRefresh(th);return}
 if(!(liveOn()&&!LIVE_ERR)){const pool=altPool(th).filter(s=>altDistinct(s,[th.pk.stop[2].t]));if(!pool.length){toast(t("my.noalt"));return}
  ALTS.list=pool.map((t2,i)=>({t:t2,tone:i%3}));ALTS.i=(ALTS.i+1)%ALTS.list.length;MYL.sug=ALTS.list[ALTS.i].t;packRefresh(th);return}
 const before=S.keys,firstFree=!S.plus&&!(S.payFree||{}).alt;if(!payGo("alt"))return;const charged=S.keys<before?before-S.keys:0;
 MYL.busy=true;packRefresh(th);let got=[];try{got=await altFetch(th)}catch(_){}MYL.busy=false;
 if(!got.length){if(charged){S.keys+=charged;save()}if(firstFree){S.payFree.alt=0;save()}toast(LL("这次没想出和原句不一样的说法，没有扣费","Nothing different enough came back — no charge"));packRefresh(th);return}
 ALTS.seen=ALTS.seen.concat(ALTS.list.map(o=>o.t));ALTS.list=got;ALTS.i=0;MYL.sug=got[0].t;packRefresh(th)},true);
/* show the batch as tappable chips under the suggestion */
const _packRefresh52=packRefresh;packRefresh=function(th){const r=_packRefresh52.apply(this,arguments);try{if(th&&th.id===curT&&th.pk&&th.pk.stop&&th.pk.stop[1]==="myline"){
 const box=$(".mysug");const ai=box&&box.querySelector(".myai small");const fresh=ALTS&&ALTS.key===altKey(th)&&ALTS.list.length;
 if(ai){const left=fresh?ALTS.list.length-1-ALTS.i:0;ai.textContent=left>0?LL("下一句 · 免费","Next · free"):(liveOn()&&!LIVE_ERR?(typeof payTag==="function"?payTag("alt"):"💎1")+LL(" · 3 句"," · 3 lines"):LL("免费","Free"))}
 if(box&&fresh&&ALTS.list.length>1&&!$(".altrow"))box.insertAdjacentHTML("afterend",'<div class="altrow"><small>'+LL("点一句直接说出口","Tap one to say it")+'</small>'+ALTS.list.map((o,i)=>'<button data-altpick="'+i+'" class="'+(i===ALTS.i?"on":"")+'">'+(liveOn()?'<em>'+LL(ALT_TONES[o.tone%3][0],ALT_TONES[o.tone%3][1])+'</em>':'')+esc(o.t)+'</button>').join("")+'</div>')}}catch(_){}return r};
(function(){const st=document.createElement("style");st.textContent=`
.altrow small{font-size:10.5px;color:#999}.altrow{display:flex;flex-direction:column;gap:5px;margin-top:6px}.altrow button{text-align:left;font-size:12.5px;line-height:1.4;padding:7px 10px;border-radius:11px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);color:#ddd}
.altrow button.on{border-color:var(--gold);background:rgba(240,183,126,.12);color:#fff}.altrow em{font-style:normal;font-size:10px;font-weight:800;color:var(--gold);margin-right:6px;border:1px solid rgba(240,183,126,.4);border-radius:5px;padding:0 4px}`;document.head.appendChild(st)})();
