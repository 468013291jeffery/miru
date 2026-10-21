/* ---- v143 · couple room you can actually walk into ----
   Tap a person in 情侣房:
   · 30+ turns → 💍 confirm the relationship right there
   · fewer → progress sheet: 💬 keep talking (opens the chat) · 💍 confirm now for 💎5 (members free) */
const CP_PRICE=5;
function cpConfirm(cid,th){S.couples=S.couples||{};S.couples[cid]={since:Date.now(),tid:th.id,ans:{}};save();
 appendMsg(th,{who:"sys",k:"card",title:"💍 "+t("cr.h"),txt:t("cp.done"),at:Date.now()});
 try{if(th.kind!=="pack"&&liveOn())reply(th,{kind:"user",txt:"(We just made it official. This is the moment. React.)"})}catch(_){}
 try{window.emoFx&&emoFx("bloom")}catch(_){}try{typeof fxBurst==="function"&&fxBurst("hearts")}catch(_){}
 closeSheet();toast("💍 "+t("cp2.done",{n:first(ch(cid).n)}));coupleRoom()}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-cpgo]")){const [cid,tid]=x.dataset.cpgo.split("|"),th=S.threads[tid],c=ch(cid);if(!th||!c)return;const n=Math.min(30,th.rounds||0);
  sheet('<div style="text-align:center">'+avatar(cid,64)+'<h2 style="margin-top:8px">'+esc(c.n)+'</h2><p class="xs faint num" style="margin-top:4px">'+t("cr.turns",{a:n})+'</p><div class="meter" style="margin:10px 0 4px"><i style="width:'+(n/30*100)+'%"></i></div>'+
   '<p class="sm dim" style="margin-top:8px;line-height:1.6">'+(n>=30?t("cp2.ready",{n:first(c.n)}):t("cp2.left",{k:30-n,n:first(c.n)}))+'</p></div>'+
   (n>=30?'<button class="btn btn-p btn-block" style="margin-top:14px" data-cpok="'+cid+'|'+tid+'">💍 '+t("cp2.ok")+'</button>':
   '<button class="btn btn-p btn-block" style="margin-top:14px" data-cpbuy="'+cid+'|'+tid+'">💍 '+t("cp2.buy")+' · '+(S.plus?t("pay.vip"):"💎"+CP_PRICE)+'</button>')+
   '<button class="btn btn-g btn-block" style="margin-top:8px" data-open="'+tid+'">💬 '+t("cp2.talk")+'</button>');return}
 if(x=e.target.closest("[data-cpok]")){const [cid,tid]=x.dataset.cpok.split("|");const th=S.threads[tid];if(th)cpConfirm(cid,th);return}
 if(x=e.target.closest("[data-cpbuy]")){const [cid,tid]=x.dataset.cpbuy.split("|");const th=S.threads[tid];if(!th)return;if(!S.plus&&!spend(CP_PRICE,"event"))return;cpConfirm(cid,th);return}});
Object.assign(I18N.zh,{"cp2.left":"再聊 {k} 回合，就能和{n}确定关系。剧情里你说的每一句、做的每个选择都算。","cp2.ready":"你们已经聊够了。要和{n}确定关系吗？","cp2.ok":"确定关系","cp2.buy":"现在就确定关系","cp2.talk":"继续去聊","cp2.done":"你和{n}在一起了"});
Object.assign(I18N.en,{"cp2.left":"{k} more turns and you can make it official with {n}. Every line and choice in the story counts.","cp2.ready":"You've talked enough. Make it official with {n}?","cp2.ok":"Make it official","cp2.buy":"Make it official now","cp2.talk":"Keep talking","cp2.done":"You and {n} are together"});
