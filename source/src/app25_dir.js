/* ---- v124 director: no more context-free jumps ----
   · The 🌙 card is now a "fast-forward" that follows the story clock:
       scripted pack  → jumps to the next scene written in the script (its real time + place), or to the chapter's end
       live AI        → story clock +2h, a transition card, and the AI is told what time it is now and where they are
   · Without live AI the other director cards can't be performed by the written script, so they are marked
     "需实时 AI" and explain why instead of charging gems and echoing nonsense. */
function dirLive(){return typeof liveOn==="function"&&liveOn()&&!LIVE_ERR}
function dirScripted(th){return !!(th&&th.pk&&Array.isArray(th.pk.q)&&th.pk.q.length)}
function dirNextScene(th){const q=(th.pk&&th.pk.q)||[];for(let i=0;i<q.length;i++){const b=q[i];if(Array.isArray(b)&&b[0]==="sys"&&b[1]==="scene")return {i,d:b[2]||{}}}return null}
/* story clock: "周四，深夜11:47" → "周五，凌晨1:47"; "Thu, 11:47 PM" → "Fri, 1:47 AM" */
const ZH_DAY=["周日","周一","周二","周三","周四","周五","周六"],EN_DAY=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
function zhPeriod(h){return h<5?"凌晨":h<9?"早上":h<12?"上午":h<13?"中午":h<18?"下午":h<23?"晚上":"深夜"}
function clockPlus(str,hrs){str=String(str||"");const m=str.match(/(凌晨|早上|清晨|上午|中午|下午|傍晚|晚上|深夜|半夜)?(\d{1,2})[:：](\d{2})\s*(AM|PM|am|pm)?/);
 if(!m)return null;let h=+m[2];const mm=m[3],p=m[1],ap=m[4];
 if(ap){h=h%12+(/pm/i.test(ap)?12:0)}else if(p){if(/下午|傍晚|晚上/.test(p)&&h<12)h+=12;else if(/深夜|半夜/.test(p)){if(h>=6&&h<12)h+=12;else if(h===12)h=0}else if(p==="中午"&&h<11)h+=12;else if(/凌晨/.test(p)&&h===12)h=0}
 let nh=h+hrs,dayShift=0;if(nh>=24){nh-=24;dayShift=1}
 let out;if(ap||(!p&&!/[一-鿿]/.test(str))){const h12=nh%12||12;out=h12+":"+mm+" "+(nh<12?"AM":"PM")}else out=zhPeriod(nh)+(nh%12||12)+":"+mm;
 let res=str.slice(0,m.index)+out+str.slice(m.index+m[0].length);
 if(dayShift){res=res.replace(/周[日一二三四五六]/,d=>ZH_DAY[(ZH_DAY.indexOf(d)+1)%7]).replace(/\b(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\b/,d=>EN_DAY[(EN_DAY.indexOf(d)+1)%7])}
 return res}
function dirFF(th){/* what the 🌙 card will do right now */
 if(dirScripted(th)&&!dirLive()){const n=dirNextScene(th);if(n){const d=n.d;return {mode:"scene",n,title:t("dr.ffScene"),sub:[Lz(d.time)||d.time,Lz(d.place)||d.place].filter(Boolean).join(" · ")||t("dr.ffSceneS")}}
  return {mode:"end",title:t("dr.ffEnd"),sub:t("dr.ffEndS")}}
 const now=(th.status||{}).time,to=clockPlus(now,2);return {mode:"clock",to,title:t("dr.ff2h"),sub:to?"→ "+to:t("dr.ff2hS")}}
/* dress the sheet: honest labels for the current mode */
const _dirSheet25=dirSheet;dirSheet=function(){_dirSheet25();const th=S.threads[curT];if(!th)return;const ff=dirFF(th),live=dirLive();
 const n=$('[data-dre="night"]');if(n){n.querySelector("b").textContent=ff.title;n.querySelector("span").textContent=ff.sub;n.querySelector("i").textContent="⏩";if(ff.mode!=="clock"){const em=n.querySelector("em");if(em)em.textContent=t("dr.ffFree")}}
 if(!live){$$(".drg [data-dre]").forEach(b=>{if(b.dataset.dre==="night")return;b.classList.add("needai");const em=b.querySelector("em");if(em)em.remove();b.insertAdjacentHTML("beforeend",'<em class="dreai">'+t("dr.needai")+'</em>')});
  const f=$(".drfree");if(f)f.insertAdjacentHTML("beforebegin",'<p class="drnote">'+t("dr.note")+'</p>')}};
function dirTransition(th,title,sub){appendMsg(th,{who:"sys",k:"xtitle",t:title,sub:sub,at:Date.now()});if(th.status)save();if(curT===th.id)renderChat()}
function dirFastForward(th){const ff=dirFF(th),zh=S.lang==="zh",p=pairOf(th.wid),v=DIR_EV.find(d=>d.k==="night");
 if(p&&v&&v.rd&&typeof rdAdd==="function")rdAdd(p,v.rd,ff.title);
 if(ff.mode==="scene"||ff.mode==="end"){const q=th.pk.q,cut=ff.mode==="scene"?ff.n.i:q.length;
  dirTransition(th,"⏩ "+ff.title,ff.mode==="scene"?ff.sub:t("dr.ffEndS"));
  const rest=q.slice(cut);
  if(th.pk.stop&&PKWAIT[th.id]){th.pk.q=[th.pk.stop].concat(rest);const r=PKWAIT[th.id];save();r([])}
  else{th.pk.q=rest;if(PKNEXT[th.id])PKNEXT[th.id]();save();if(!PKPLAY[th.id])packRun(th)}
  return}
 /* clock mode: move the clock, show the cut, then let the AI continue from there */
 const place=(th.status||{}).place||"";if(ff.to){th.status=th.status||{};th.status.time=ff.to}
 dirTransition(th,"⏩ "+t("dr.ff2hT"),[ff.to,place].filter(Boolean).join(" · "));
 const T=zh?"【时间快进】两个小时过去了"+(ff.to?"，现在是 "+ff.to:"")+(place?"，地点仍是 "+place:"")+"。先用一句旁白交代这两个小时里发生了什么（顺着刚才的剧情，不要凭空换场景），然后接着演。"
  :"[Time skip] Two hours pass"+(ff.to?" — it is now "+ff.to:"")+(place?", still at "+place:"")+". Open with one line of narration covering what happened in those two hours (follow from the scene so far; do not invent a new location), then continue.";
 if(th.watch){appendMsg(th,{who:"me",k:"dir",txt:T,at:Date.now()});reply(th,{kind:"watch",txt:"Director's note: "+T})}else doSend(T,"dir")}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest('[data-dre="night"]')){e.stopImmediatePropagation();const th=S.threads[curT];if(!th)return;const v=DIR_EV.find(d=>d.k==="night");
  const ff=dirFF(th);if(ff.mode==="clock"&&!v.free&&!S.plus&&!spend(2,"event"))return;closeSheet();dirFastForward(th);return}
 if((x=e.target.closest(".needai[data-dre]"))||(e.target.closest("[data-drown]")&&!dirLive())){e.stopImmediatePropagation();toast(t("dr.needaiT"));return}},true);
Object.assign(I18N.en,{"dr.ffScene":"Skip to the next scene","dr.ffFree":"Free","dr.ffSceneS":"Where the story goes next","dr.ffEnd":"Skip to the chapter's end","dr.ffEndS":"No more scenes in this chapter","dr.ff2h":"Two hours later","dr.ff2hS":"Fast-forward the clock","dr.ff2hT":"Two hours later",
 "dr.needai":"Live AI","dr.needaiT":"This one needs live AI — the written script can't improvise it. Tap \"Test live AI\" at the top to connect.","dr.note":"You're on the written script. Without live AI you can only fast-forward; the other moves unlock once live AI is connected."});
Object.assign(I18N.zh,{"dr.ffScene":"快进到下一幕","dr.ffFree":"免费","dr.ffSceneS":"剧情接下来去的地方","dr.ffEnd":"快进到本章结尾","dr.ffEndS":"这一章后面没有新场景了","dr.ff2h":"两小时后","dr.ff2hS":"把时间往后拨","dr.ff2hT":"两小时后",
 "dr.needai":"需实时 AI","dr.needaiT":"这个需要实时 AI 才能即兴演出，写好的台词演不了。点顶部「测试实时 AI」连接后再用。","dr.note":"当前是写好的台词：没有实时 AI 时只能快进；其他导演指令连接实时 AI 后可用。"});
