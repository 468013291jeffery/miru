/* ================= WEEKLY CHARACTER BOARD (打榜) — fans push their bias up the chart =================
   Everyone gets free votes every day (Plus gets double). 1 vote = +520 heat. Rivals keep moving on their own,
   so there is always a "you're only X behind #N" nudge. Sharing a "help him climb" card earns a bonus vote once a day. */
const VOTE=520,BLSET=new Set(BLP.flatMap(b=>[b[1],b[2]]));
let rankF="bl";
function wkKey(){const d=new Date();const day=(d.getDay()+6)%7;const m=new Date(d.getFullYear(),d.getMonth(),d.getDate()-day);return m.toISOString().slice(0,10)}
function wkLeft(){const d=new Date(),day=(d.getDay()+6)%7,end=new Date(d.getFullYear(),d.getMonth(),d.getDate()-day+7);const h=Math.max(0,Math.round((end-d)/36e5));return h>=24?Math.floor(h/24)+t("rk.d")+" "+(h%24)+t("rk.h"):h+t("rk.h")}
function voteState(){const d=today();S.boost=S.boost||{};if(S.boostWk!==wkKey()){S.boostWk=wkKey();S.boost={}}
 if(!S.vote||S.vote.d!==d)S.vote={d,n:S.plus?6:3,sh:0};return S.vote}
function rankList(f){voteState();const hrs=(Date.now()-new Date(wkKey()).getTime())/36e5;
 let ids=allChars().filter(id=>{const c=ch(id),w=c&&wd(c.w);return w&&orOK(w)});if(f==="bl")ids=ids.filter(id=>BLSET.has(id));
 const base=ids.map(id=>({id,s:((wd(ch(id).w).stats||[0])[0]||0)+hash(id)%5e4})).sort((a,b)=>b.s-a.s);
 return base.map((r,i)=>({id:r.id,heat:Math.round(186000*Math.pow(.952,i)+hash(r.id)%1500+hrs*(18+hash(r.id)%40))+(S.boost[r.id]||0)*VOTE,mine:(S.boost[r.id]||0)})).sort((a,b)=>b.heat-a.heat).map((r,i)=>Object.assign(r,{rk:i+1}))}
function rankHTML(){const v=voteState(),L=rankList(rankF),bias=S.bias&&L.find(r=>r.id===S.bias);
 let h='<div class="rkhd"><div class="grow"><div class="eyebrow" style="color:var(--gold)">'+t("rk.week")+'</div><b>'+t("rk.h1")+'</b><p class="xs faint">'+t("rk.reset",{t:wkLeft()})+'</p></div><div class="rkvotes"><b class="num">'+v.n+'</b><span>'+t("rk.left")+'</span></div></div>'+
  '<div class="rkf">'+[["bl","BL"],["all",t("rk.all")]].map(([k,l])=>'<button data-rkf="'+k+'" class="'+(rankF===k?"on":"")+'">'+l+'</button>').join("")+'<span class="grow"></span><button class="xs" data-rkhow="1">'+t("rk.howQ")+'</button></div>';
 if(bias){const up=L[bias.rk-2],gap=up?up.heat-bias.heat+1:0,need=up?Math.ceil(gap/VOTE):0;
  h+='<div class="rkbias"><div class="rkbg" style="background-image:url('+artSrc(bias.id)+')"></div><div class="rkbv"></div><div class="row" style="gap:12px;position:relative">'+avatar(bias.id,56)+'<div class="grow" style="min-width:0"><div class="eyebrow">'+t("rk.bias")+'</div><b style="font-size:17px">'+esc(ch(bias.id).n)+'</b><p class="xs">#'+bias.rk+' · 🔥 '+fmtN(bias.heat)+' · '+t("rk.mine",{n:bias.mine})+'</p></div></div>'+
   '<p class="sm rkgap">'+(up?t("rk.gap",{n:need,who:first(ch(up.id).n),r:up.rk}):t("rk.top1"))+'</p><div class="row" style="gap:8px;position:relative"><button class="btn btn-p grow" data-vote="'+bias.id+'">🔥 '+t("rk.vote")+'</button><button class="btn btn-g grow" data-rkshare="'+bias.id+'">📣 '+t("rk.rally")+'</button></div></div>'}
 else h+='<div class="rkempty">'+t("rk.pick")+'</div>';
 const top=L.slice(0,3),ord=[1,0,2];
 h+='<div class="rkpod">'+ord.map(i=>{const r=top[i];if(!r)return"";const c=ch(r.id);return '<div class="rkp p'+(i+1)+'"><button data-char="'+r.id+'" class="rkpa">'+avatar(r.id,i?58:74)+'<span class="rkcr">'+["👑","2","3"][i]+'</span></button><b>'+esc(first(c.n))+'</b><em class="num">🔥 '+fmtN(r.heat)+'</em><button class="rkvb" data-vote="'+r.id+'">'+t("rk.vote")+'</button></div>'}).join("")+'</div>';
 const rows=L.slice(3,20);if(bias&&bias.rk>20)rows.push(bias);
 h+='<div class="rank">'+rows.map(r=>{const c=ch(r.id),w=wd(c.w),up=L[r.rk-2],pct=up?Math.max(6,Math.round(r.heat/up.heat*100)):100;
  return '<div class="rrow'+(r.id===S.bias?" me":"")+'"><span class="rn">'+r.rk+'</span><button data-char="'+r.id+'">'+avatar(r.id,44)+'</button><div class="grow" style="min-width:0"><b>'+esc(c.n)+(r.mine?' <small class="rkmy">+'+r.mine+'</small>':'')+'</b><p>'+esc(Lz(w.title))+'</p><div class="rkbar"><i style="width:'+pct+'%"></i></div></div><div class="rkr"><em class="num">🔥 '+fmtN(r.heat)+'</em><button class="rkvb" data-vote="'+r.id+'">'+t("rk.vote")+'</button></div></div>'}).join("")+'</div>';
 return h}
function rankRefresh(){const b=$("#htabBody");if(b&&homeTab==="rank")b.innerHTML=rankHTML();const c=$("#chRank");if(c&&curChar)c.outerHTML=charRankCard(curChar)}
function castVote(id,n){const v=voteState();const before=rankList(rankF).find(r=>r.id===id);
 if(v.n<n){voteSheet(id);return}v.n-=n;S.boost[id]=(S.boost[id]||0)+n;if(!S.bias)S.bias=id;save();
 if(typeof taskClaimDay==="function"&&taskClaimDay("vote",1))toast(t("task.gotVote"));
 const after=rankList(rankF).find(r=>r.id===id);rankRefresh();
 const fl=document.createElement("div");fl.className="rkfloat";fl.textContent="+"+fmtN(n*VOTE)+" 🔥";$("#dev").appendChild(fl);setTimeout(()=>fl.remove(),1100);
 if(before&&after&&after.rk<before.rk)toast("↑ "+t("rk.up",{n:first(ch(id).n),r:after.rk}));else{const L=rankList(rankF),up=L[after?after.rk-2:0];if(up&&after)toast(t("rk.gap",{n:Math.ceil((up.heat-after.heat+1)/VOTE),who:first(ch(up.id).n),r:up.rk}))}}
function voteSheet(id){const c=ch(id);sheet('<div class="eyebrow" style="color:var(--gold)">'+t("rk.week")+'</div><h2 style="margin-top:4px">'+t("rk.outH",{n:first(c.n)})+'</h2><p class="sm dim" style="margin-top:6px">'+t("rk.outS")+'</p>'+
 adBtn("vote",id,t("ad.vote"))+'<div class="rkbuy"><button data-vbuy="'+id+'|1|5"><b>5 🔥</b><span>💎 1</span></button><button data-vbuy="'+id+'|5|30" class="hot"><i>+20%</i><b>30 🔥</b><span>💎 5</span></button><button data-vbuy="'+id+'|0|1" '+(voteState().sh?"disabled":"")+'><b>1 🔥</b><span>📣 '+t("rk.shareFree")+'</span></button></div>'+(S.plus?'':'<p class="xs faint" style="margin-top:10px">MIRU+ · '+t("rk.plus")+'</p>'))}
function charRankCard(id){const L=rankList(BLSET.has(id)?"bl":"all"),r=L.find(x=>x.id===id);if(!r)return "";const up=L[r.rk-2];
 return '<div class="card rkcc" id="chRank"><div class="row" style="gap:10px"><div class="grow"><div class="eyebrow" style="color:var(--gold)">'+t("rk.week")+(BLSET.has(id)?" · BL":"")+'</div><b style="font-size:20px" class="num">#'+r.rk+'</b> <span class="xs faint">🔥 '+fmtN(r.heat)+'</span><p class="xs dim">'+(up?t("rk.gap",{n:Math.ceil((up.heat-r.heat+1)/VOTE),who:first(ch(up.id).n),r:up.rk}):t("rk.top1"))+'</p></div><button class="btn btn-p btn-sm" data-vote="'+id+'">🔥 '+t("rk.vote")+'</button></div></div>'}
function rankShare(id){const c=ch(id),r=rankList(BLSET.has(id)?"bl":"all").find(x=>x.id===id);
 openShare({tag:"VOTE WEEK",who:c.n,big:"#"+(r?r.rk:"?"),quote:t("rk.shareQ",{n:first(c.n)}),bg:artSrc(id),text:t("rk.shareQ",{n:first(c.n)})+" — MIRU",link:shareURL("f",id)})}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-vote]")){e.stopPropagation();castVote(x.dataset.vote,1);return}
 if(x=e.target.closest("[data-rkf]")){rankF=x.dataset.rkf;rankRefresh();return}
 if(x=e.target.closest("[data-rkshare]")){const v=voteState();if(!v.sh){v.sh=1;v.n++;save();toast(t("rk.shareGot"));rankRefresh()}rankShare(x.dataset.rkshare);return}
 if(e.target.closest("[data-rkhow]")){sheet('<h2>'+t("rk.howQ")+'</h2><p class="sm dim" style="margin-top:8px;line-height:1.7;white-space:pre-line">'+t("rk.how")+'</p>');return}
 if(x=e.target.closest("[data-vbuy]")){const [id,d,n]=x.dataset.vbuy.split("|");const v=voteState();
  if(+d===0){if(v.sh)return;v.sh=1;v.n+=1;save();closeSheet();rankShare(id);return}
  if(!spend(+d,"vote"))return;v.n+=+n;save();closeSheet();castVote(id,+n);return}},true);
