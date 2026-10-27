/* ================= v4.0 · NO MEMBERSHIP — pay-as-you-go diamonds only (owner's decision) =================
   · MIRU+ is gone: nobody is a member, no plans, no trials. Everything is paid with 💎 at the AI-cost prices in PRICES.
   · Recharge from $0.99; bigger packs add more bonus diamonds (+0% → +40%). First purchase still doubles the base diamonds.
   · What used to be member-only quality is now everyone's baseline: 32K memory (60 lines of transcript, 40 key moments,
     cross-story memories). Deep memory (128K) for one story stays a 💎 purchase. */
const PACKS84=[{usd:"0.99",gems:5,bonus:0},{usd:"2.99",gems:15,bonus:1},{usd:"4.99",gems:25,bonus:3},{usd:"9.99",gems:50,bonus:10,best:1},{usd:"19.99",gems:100,bonus:25},{usd:"49.99",gems:250,bonus:80},{usd:"99.99",gems:500,bonus:200}];
function noSub84(){try{if(typeof S==="object"&&S){S.plus=false;S.plusMax=false}}catch(_){}}
noSub84();
const _save84=save;save=function(){noSub84();return _save84.apply(this,arguments)};
setInterval(noSub84,3000);
/* memory: the old member tier is the baseline for everyone; deep memory per story is cheap (its extra prompt costs pennies) */
(typeof soft==="function"?soft:function(n,f){try{return f()}catch(e){}})("app84_nosub:L12",function(){memTier=function(th){if(th&&S.deepMem&&S.deepMem[th.id])return "deep";return "plus"}});
transcript=(function(orig){return function(th){const p=S.plus;S.plus=true;try{return orig.apply(this,arguments)}finally{S.plus=p}}})(transcript);
/* the recharge sheet */
paySheet=function(why){const head=why?t("pay.why."+why):t("pay.h"),zh=CL()==="zh";const first=!S.firstBuy;
 sheet('<div class="row"><div class="grow"><div class="eyebrow" style="color:var(--gold)">💎 '+(zh?"充值":"TOP UP")+'</div><h2 style="margin-top:4px">'+head+'</h2></div><span class="chip num">💎 '+S.keys+'</span></div>'+
  (why&&typeof adBtn==="function"?adBtn("gem","",t("ad.gem")):"")+
  '<div class="packs packs84">'+PACKS84.map(p=>{const n=p.gems+p.bonus,pct=p.bonus?Math.round(p.bonus/p.gems*100):0;
   return '<button class="pack'+(p.best?" best":"")+'" data-buy="'+n+'">'+(p.best?'<i>'+t("pay.best")+'</i>':pct?'<i>+'+pct+'%</i>':'')+
    '<b>💎 '+n+'</b>'+(p.bonus?'<small>'+p.gems+' + '+p.bonus+(zh?' 赠送':' bonus')+'</small>':'<small>'+(zh?'最低充值':'smallest pack')+'</small>')+
    (first?'<u>'+(zh?'首充再送 ':'1st top-up +')+p.gems+'</u>':'')+'<span>$'+p.usd+'</span></button>'}).join("")+'</div>'+
  (first?'<p class="xs" style="color:var(--gold);margin-top:6px;text-align:center">'+(zh?"首次充值：基础钻石翻倍":"First top-up: base diamonds doubled")+'</p>':'')+
  (typeof ciHTML==="function"?ciHTML():"")+
  '<p class="xs faint" style="margin-top:10px;line-height:1.55">'+(zh?"没有会员，用多少花多少：AI 图片 💎"+PRICES.img+" · 通话 💎"+PRICES.callMin+"/分钟 · 视频 💎"+PRICES.video+" · 前 3 集免费，之后每集 💎"+PRICES.ep+"（或等 23 小时免费解锁一集）。钻石永远买不到角色的感情。":
   "No membership — pay only for what you use: AI picture 💎"+PRICES.img+" · call 💎"+PRICES.callMin+"/min · video 💎"+PRICES.video+" · episodes 1–3 free, then 💎"+PRICES.ep+" each (or wait 23h for a free one). Diamonds never buy a character's feelings.")+'</p>')};
/* the old "first top-up doubles" handler adds n (the full pack incl. bonus) twice; keep the double to the base diamonds only */
document.addEventListener("click",e=>{const x=e.target.closest(".packs84 [data-buy]");if(!x)return;e.stopImmediatePropagation();
 const n=+x.dataset.buy,p=PACKS84.find(q=>q.gems+q.bonus===n);if(!p)return;const extra=S.firstBuy?0:p.gems;S.firstBuy=true;
 if(typeof CL0!=="undefined"&&CL0.on&&typeof PENDING_SKU!=="undefined")PENDING_SKU="gems_"+n;
 S.keys+=n+extra;save();closeSheet();toast("+"+(n+extra)+" 💎"+(extra?" · "+t("pay.doubled"):""));if(typeof refreshAfterPay==="function")refreshAfterPay()},true);
/* words that still mentioned the membership */
(function(){const Z={"call.gateS":"免费体验已用完。继续通话按分钟收费。","mem.t.plus":"标准","mem.t.free":"标准","mem.d.plus":"每个故事都有","mem.l3S":"他们之间的事也会记住",
  "pay.what":"没有会员，用多少花多少。钻石永远买不到角色的感情。","vp.unl":"按次使用","vp.plus":"语音按次使用","u.plus":"本月充值","lk.vip":"用钻石解锁","lk.vipP":"充值 $0.99 起",
  "hn.vip":"💎1","pay.vip":"💎","mo.hint":"用钻石查看","mono.vip":"偷看","w2.t3":"首次充值奖励","w2.b3":"首充钻石翻倍","w2.s3":"$0.99 起充 · 充得越多送得越多（最高 +40%）","rk.how":"• 每人每天 3 票免费。\n• 1 票 = 给他 +520 🔥 热度。\n• 分享「帮他打榜」卡片：每天 +1 票。\n• 票用完了？可以用钻石买票。"};
 const E={"call.gateS":"Your free call is used. Keep talking — billed by the minute.","mem.t.plus":"Standard","mem.t.free":"Standard","mem.d.plus":"for every story","mem.l3S":"What they share is remembered too",
  "pay.what":"No membership — pay only for what you use. Diamonds never buy a character's feelings.","vp.unl":"pay per use","vp.plus":"Voice, pay per use","u.plus":"Top-ups this month","lk.vip":"Unlock with diamonds","lk.vipP":"Top up from $0.99",
  "hn.vip":"💎1","pay.vip":"💎","mo.hint":"See it with diamonds","mono.vip":"Peek","w2.t3":"First top-up bonus","w2.b3":"First top-up: diamonds ×2","w2.s3":"Packs from $0.99 · bigger packs add up to +40% bonus","rk.how":"• Everyone gets 3 free votes a day.\n• 1 vote = +520 🔥 heat for that character.\n• Share a “help him climb” card: +1 vote a day.\n• Out of votes? Buy more with diamonds."};
 try{Object.assign(I18N.zh,Z);Object.assign(I18N.en,E)}catch(_){}})();
(function(){const st=document.createElement("style");st.textContent=`.plusc,[data-buyplus],[data-buymax],.plans,.lockvip,[data-paysheet="mem"]{display:none!important}
.packs84{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}.packs84 .pack{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;padding:14px 6px 10px}
.packs84 .pack small{font-size:10.5px;opacity:.7}.packs84 .pack u{position:static!important;transform:none!important;background:none!important;padding:0!important;text-decoration:none;font-size:10px;color:#8bd5c4}.packs84 .pack i{position:absolute;top:-8px;right:6px;font-style:normal;font-size:10px;padding:1px 6px;border-radius:999px;background:var(--gold);color:#241a10}`;document.head.appendChild(st)})();
