/* ================= REWARDED ADS — the third path between paying and waiting =================
   Economics (US rewarded video eCPM ≈ $14–22 → ~$0.015–0.02 per completed view; 1 💎 sells for ~$0.17–0.20):
   · 1 completed ad = 1 💎, capped at 5 ads a day (max ≈ $0.10/day ad revenue from a non-payer, max 5 💎 given away).
   · Ad diamonds are the same currency, so a non-payer can unlock ~2 episodes a day by ads — Wait-Until-Free stays the slow free path.
   · MIRU+ removes every ad offer (it is a Plus perk). Offers only appear at a need moment (short of 💎, locked EP, out of votes).
   Production: AppLovin MAX mediation (Meta Audience Network + Pangle/TikTok + AdMob + Unity), reward granted only on the
   network's server-side verification (SSV) callback. In this prototype the ad is a 15-second simulated player. */
const ADS={cap:5,val:1,sec:15};
function adState(){const d=today();if(!S.ad||S.ad.d!==d)S.ad={d,n:0,ep:{}};return S.ad}
function adLeft(){return S.plus?0:Math.max(0,ADS.cap-adState().n)}
function adBtn(kind,arg,label){const l=adLeft();if(S.plus)return "";
 return '<button class="adbtn" data-ad="'+kind+'|'+(arg||"")+'"'+(l?'':' disabled')+'><span class="adic">▶</span><div class="grow"><b>'+label+'</b><small>'+(l?t("ad.left",{n:l,c:ADS.cap}):t("ad.none"))+'</small></div><em>AD</em></button>'}
function watchAd(done){if(!adLeft()){toast(t("ad.none"));return}closeSheet();
 const w=allWorlds().filter(x=>x.cover)[hash(String(Date.now()))%5]||{};
 const el=document.createElement("div");el.className="adv";let s=ADS.sec;
 el.innerHTML='<div class="adv-top"><span class="adv-tag">'+t("ad.sponsored")+'</span><span class="adv-t" id="advT">'+s+'</span><button class="adv-x" id="advX" disabled>✕</button></div>'+
  '<div class="adv-art" style="background-image:url('+(w.id?artSrc(w.id):"art/world_default.jpg")+')"></div><div class="adv-cap"><b>'+t("ad.demoH")+'</b><p>'+t("ad.demoS")+'</p></div><div class="adv-bar"><i id="advB"></i></div>';
 $("#dev").appendChild(el);let ok=false;
 const tk=setInterval(()=>{s--;const a=$("#advT"),b=$("#advB");if(a)a.textContent=s>0?s:"✓";if(b)b.style.width=((ADS.sec-s)/ADS.sec*100)+"%";
  if(s<=0){clearInterval(tk);ok=true;const x=$("#advX");if(x){x.disabled=false;x.classList.add("on")}}},1000);
 el.querySelector("#advX").onclick=()=>{if(!ok){toast(t("ad.keep"));return}el.remove();const st=adState();st.n++;save();done&&done()}}
function adGrant(kind,arg){
 if(kind==="gem"){S.keys+=ADS.val;save();toast(t("ad.got",{n:ADS.val,left:S.keys}));const k=$(".topbar .chip.num");if(k)k.textContent="💎 "+S.keys;return}
 if(kind==="vote"){const v=voteState();v.n+=2;save();toast(t("ad.votes"));castVote(arg,1);return}
 if(kind==="ep"){const [w,n]=arg.split("-"),st=adState(),k=w+"-"+n;st.ep[k]=(st.ep[k]||0)+1;save();
  if(st.ep[k]>=2){unlockEp(w,+n);toast(t("ad.epDone",{n}));openShort(w,+n)}
  else{toast(t("ad.epHalf"));setTimeout(()=>epLockSheet(w,+n),300)}}}
document.addEventListener("click",e=>{const x=e.target.closest("[data-ad]");if(!x||x.disabled)return;const [kind,arg]=x.dataset.ad.split("|");watchAd(()=>adGrant(kind,arg))});
Object.assign(I18N.en,{"ad.left":"{n} of {c} left today","ad.none":"No more ads today — back tomorrow","ad.gem":"Watch an ad · +1 💎","ad.vote":"Watch an ad · +2 votes","ad.ep":"Watch 2 ads · unlock this episode ({k}/2)",
 "ad.sponsored":"Sponsored","ad.keep":"Finish the ad to get your reward","ad.got":"+{n} 💎 · {left} total","ad.votes":"+2 votes","ad.epHalf":"1 of 2 — one more ad unlocks it","ad.epDone":"EP {n} unlocked",
 "ad.demoH":"Ad preview","ad.demoS":"A real 15–30s rewarded video from Meta / TikTok (Pangle) / AdMob plays here.","pay.p6":"No ads, ever"});
Object.assign(I18N.zh,{"ad.left":"今天还剩 {n}/{c} 次","ad.none":"今天的广告次数用完了，明天再来","ad.gem":"看广告 · +1 💎","ad.vote":"看广告 · +2 票","ad.ep":"看 2 条广告 · 免费解锁本集（{k}/2）",
 "ad.sponsored":"赞助内容","ad.keep":"看完广告才能领取奖励","ad.got":"+{n} 💎 · 共 {left}","ad.votes":"+2 票","ad.epHalf":"已看 1/2 —— 再看一条就解锁","ad.epDone":"第 {n} 集已解锁",
 "ad.demoH":"广告位预览","ad.demoS":"正式版这里播放 Meta / TikTok（Pangle）/ AdMob 的 15–30 秒激励视频。","pay.p6":"永久无广告"});

/* boot moved to app99_boot.js */
