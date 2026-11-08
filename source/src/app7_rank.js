/* ================= WEEKLY CHARACTER BOARD (打榜) — 2026-11-07 起走服务器 =================
   以前：热度是本机公式算的（排名衰减 + hash + 本周小时数），对手是编的，票只记在自己手机上。
   现在：/api/wallet?r=rank（api/_board.js）。榜单 = 官方男主卡（art/official/leads.json，作品下线就出榜），
     热度 = 本周票数 × 520 + 单聊回合 × 20（每人封顶 50）+ 所在作品读完的章节 × 10，全部是真实数据。
     每人每天 3 张免费票（服务器记），分享一次 +1；花钻买票：1💎 = 5 票，5💎 = 30 票，每天付费票上限 100。
     每周一 00:00 UTC 重置；上周前三名挂「上周冠军」。
   保留的函数名（其他模块在用）：rankHTML · rankRefresh · castVote · voteSheet · charRankCard · rankShare · voteState · wkKey · BLSET · VOTE */
const VOTE=520,BLSET=new Set(BLP.flatMap(b=>[b[1],b[2]]));
const RZ=(zh,en)=>CL()==="zh"?zh:en;
function wkKey(){const d=new Date();const day=(d.getDay()+6)%7;const m=new Date(d.getFullYear(),d.getMonth(),d.getDate()-day);return m.toISOString().slice(0,10)}
/* 旧接口：小游戏 / 广告还会给它加票。现在票在服务器，这里只留一个不起作用的本机对象，免得旧代码报错。 */
function voteState(){if(!S.vote||S.vote.d!==today())S.vote={d:today(),n:0,sh:0};return S.vote}
const RK={orient:null,data:null,at:0,busy:false,err:false,fans:{}};
function rkOrient(){return RK.orient||(S.or&&S.or!=="all"?S.or:"all")}
function rkLeft(){const d=RK.data;if(!d||!d.resetsAt)return "";const h=Math.max(0,Math.round((new Date(d.resetsAt)-Date.now())/36e5));return h>=24?Math.floor(h/24)+RZ(" 天 "," d ")+(h%24)+RZ(" 小时"," h"):h+RZ(" 小时"," h")}
async function rankLoad(force){
 if(RK.busy||(!force&&RK.data&&RK.data._o===rkOrient()&&Date.now()-RK.at<30e3))return;
 if(typeof capi!=="function"||typeof CLOUD_EP==="undefined"||!CLOUD_EP){RK.err=true;rankRefresh();return}
 RK.busy=true;const o=rkOrient();
 try{const r=await capi("/wallet?r=rank&orient="+encodeURIComponent(o));if(r.ok&&Array.isArray(r.j.rows)){RK.data=Object.assign(r.j,{_o:o});RK.at=Date.now();RK.err=false}else RK.err=true}catch(_){RK.err=true}
 RK.busy=false;rankRefresh()}
function rkRows(){return (RK.data&&RK.data.rows||[]).filter(r=>ch(r.cid))}
function rkMe(){return RK.data&&RK.data.me}
function rkBias(L){const me=rkMe(),mine=me&&me.votes||{};
 if(S.bias&&L.some(r=>r.cid===S.bias))return S.bias;
 const top=Object.keys(mine).filter(c=>L.some(r=>r.cid===c)).sort((a,b)=>mine[b]-mine[a])[0];return top||null}
function rkGap(L,r){const up=L[r.rank-2];return up?RZ("再投 "+Math.ceil((up.heat-r.heat+1)/VOTE)+" 票超过 "+first(ch(up.cid).n)+"（第 "+up.rank+" 名）","Just "+Math.ceil((up.heat-r.heat+1)/VOTE)+" votes to pass "+first(ch(up.cid).n)+" (#"+up.rank+")"):RZ("本周第一！守住它","#1 this week — hold the crown")}
function rkChamp(id){return RK.data&&(RK.data.champs||[]).indexOf(id)}
function rankHTML(){
 if(!RK.data||RK.data._o!==rkOrient()){if(!RK.err)rankLoad();
  return RK.err&&!RK.busy?'<div class="rkempty">'+RZ("暂时连不上榜单服务器","Can't reach the chart right now")+'<br><button class="btn btn-g btn-sm" style="margin-top:10px" data-rkretry="1">'+RZ("重试","Retry")+'</button></div>'
   :'<div class="rkempty">'+RZ("正在加载本周榜单…","Loading this week's chart…")+'</div>'}
 if(Date.now()-RK.at>30e3&&!RK.err)rankLoad();
 const L=rkRows(),me=rkMe(),mine=(me&&me.votes)||{},bid=rkBias(L),bias=bid&&L.find(r=>r.cid===bid);
 const tabs=[["bl","BL"],["bg","BG"],["all",RZ("全部","All")]];
 let h='<div class="rkhd"><div class="grow"><div class="eyebrow" style="color:var(--gold)">'+RZ("每周人气榜","WEEKLY CHART")+'</div><b>'+RZ("为你的男主打榜","Vote your lead to the top")+'</b><p class="xs faint">'+RZ("距离本周结算 ","Resets in ")+rkLeft()+'</p></div>'+
  '<div class="rkvotes"><b class="num">'+(me?me.left:"–")+'</b><span>'+RZ("今日免费票","free votes")+'</span></div></div>'+
  '<div class="rkf">'+tabs.map(([k,l])=>'<button data-rkf="'+k+'" class="'+(rkOrient()===k?"on":"")+'">'+l+'</button>').join("")+'<span class="grow"></span><button class="xs" data-rkhow="1">'+RZ("规则","How it works")+'</button></div>';
 if(!L.length)return h+'<div class="rkempty">'+RZ("这个分类下还没有上榜的角色","No characters on this chart yet")+'</div>';
 if(bias)h+='<div class="rkbias"><div class="rkbg" style="background-image:url('+artSrc(bias.cid)+')"></div><div class="rkbv"></div><div class="row" style="gap:12px;position:relative">'+avatar(bias.cid,56)+'<div class="grow" style="min-width:0"><div class="eyebrow">'+RZ("我的本命","MY BIAS")+'</div><b style="font-size:17px">'+esc(ch(bias.cid).n)+'</b><p class="xs">#'+bias.rank+' · 🔥 '+fmtN(bias.heat)+' · '+RZ("我本周投了 ","my votes ")+(mine[bias.cid]||0)+'</p></div></div>'+
   '<p class="sm rkgap">'+rkGap(L,bias)+'</p><div class="row" style="gap:8px;position:relative"><button class="btn btn-p grow" data-vote="'+bias.cid+'">🔥 '+RZ("投票","Vote")+'</button><button class="btn btn-g grow" data-rkfans="'+bias.cid+'">👑 '+RZ("应援榜","Top fans")+'</button><button class="btn btn-g" data-rkshare="'+bias.cid+'">📣</button></div></div>';
 else h+='<div class="rkempty">'+RZ("给喜欢的人投一票，TA 就成了你的本命","Vote for someone and they become your bias")+'</div>';
 if(L.every(r=>!r.heat))h+='<p class="xs faint" style="padding:0 16px 8px">'+RZ("本周还没有人投票——你的第一票就能让 TA 冲上第一。","No votes yet this week — your first one puts them at #1.")+'</p>';
 const crown=id=>rkChamp(id)>=0?'<small class="rkchamp" title="">🏆 '+RZ("上周冠军","Last week's top 3")+'</small>':'';
 const top=L.slice(0,3),ord=[1,0,2];
 h+='<div class="rkpod">'+ord.map(i=>{const r=top[i];if(!r)return"";const c=ch(r.cid);return '<div class="rkp p'+(i+1)+'"><button data-char="'+r.cid+'" class="rkpa">'+avatar(r.cid,i?58:74)+'<span class="rkcr">'+["👑","2","3"][i]+'</span></button><b>'+esc(first(c.n))+'</b><em class="num">🔥 '+fmtN(r.heat)+'</em>'+crown(r.cid)+'<button class="rkvb" data-vote="'+r.cid+'">'+RZ("投票","Vote")+'</button></div>'}).join("")+'</div>';
 const rows=L.slice(3);
 h+='<div class="rank">'+rows.map(r=>{const c=ch(r.cid),w=wd(c.w),up=L[r.rank-2],pct=up&&up.heat?Math.max(6,Math.round(r.heat/up.heat*100)):100;
  return '<div class="rrow'+(r.cid===bid?" me":"")+'"><span class="rn">'+r.rank+'</span><button data-char="'+r.cid+'">'+avatar(r.cid,44)+'</button><div class="grow" style="min-width:0"><b>'+esc(c.n)+(mine[r.cid]?' <small class="rkmy">+'+mine[r.cid]+'</small>':'')+'</b><p>'+esc(Lz(w&&w.title)||"")+'</p>'+crown(r.cid)+'<div class="rkbar"><i style="width:'+pct+'%"></i></div></div><div class="rkr"><em class="num">🔥 '+fmtN(r.heat)+'</em><button class="rkvb" data-vote="'+r.cid+'">'+RZ("投票","Vote")+'</button></div></div>'}).join("")+'</div>';
 return h}
function rankRefresh(){const b=$("#htabBody");if(b&&homeTab==="rank")b.innerHTML=rankHTML();const c=$("#chRank");if(c&&curChar)c.outerHTML=charRankCard(curChar)}
function rkKey(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
function rkApply(j){if(!j)return;if(RK.data){if(Array.isArray(j.rows)&&RK.data._o===rkOrient())RK.data.rows=j.rows;if(j.me)RK.data.me=j.me;RK.at=Date.now()}
 if(typeof j.gems==="number"){S.keys=j.gems;if(typeof cloudInfo==="function")cloudInfo().known=j.gems;save();if(typeof keysChip==="function")keysChip();}}
async function castVote(id,n){n=n||1;if(typeof CL0==="undefined"||!CL0.on){toast(RZ("连上网络、登录后才能投票","Connect and sign in to vote"));return}
 const before=rkRows().find(r=>r.cid===id);
 const r=await capi("/wallet?r=rank",{json:{op:"vote",cid:id,n,key:rkKey(),orient:rkOrient()}});
 if(r.status===402){voteSheet(id);return}
 if(!r.ok){toast(RZ("投票没成功，稍后再试","Vote didn't go through — try again"));return}
 if(!S.bias)S.bias=id;rkApply(r.j);rankRefresh();
 const fl=document.createElement("div");fl.className="rkfloat";fl.textContent="+"+fmtN(n*VOTE)+" 🔥";$("#dev").appendChild(fl);setTimeout(()=>fl.remove(),1100);
 const after=r.j.row;if(before&&after&&after.rank<before.rank)toast("↑ "+RZ(first(ch(id).n)+" 升到第 "+after.rank+" 名",first(ch(id).n)+" climbed to #"+after.rank));
 else if(after)toast(rkGap(rkRows(),after));
 if(typeof taskRefreshUI==="function")taskRefreshUI()}
function voteSheet(id){const c=ch(id),me=rkMe()||{};
 sheet('<div class="eyebrow" style="color:var(--gold)">'+RZ("每周人气榜","WEEKLY CHART")+'</div><h2 style="margin-top:4px">'+RZ("今天的免费票用完了","You're out of free votes")+'</h2><p class="sm dim" style="margin-top:6px">'+RZ("买票直接投给 "+first(c.n)+"。明天 0 点（UTC）免费票恢复。","Buy votes and they go straight to "+first(c.n)+". Free votes come back at 00:00 UTC.")+'</p>'+
  '<div class="rkbuy"><button data-vbuy="'+id+'|s"><b>5 🔥</b><span>💎 1</span></button><button data-vbuy="'+id+'|m" class="hot"><i>+20%</i><b>30 🔥</b><span>💎 5</span></button><button data-vshare="'+id+'" '+(me.shared?"disabled":"")+'><b>1 🔥</b><span>📣 '+RZ("分享免费","Share for free")+'</span></button></div>'+
  '<p class="xs faint" style="margin-top:10px">'+RZ("每人每天最多买 100 票。","Up to 100 bought votes per day.")+'</p>')}
async function rkBuy(id,pack){if(typeof CL0==="undefined"||!CL0.on){toast(RZ("连上网络、登录后才能投票","Connect and sign in to vote"));return}
 const r=await capi("/wallet?r=rank",{json:{op:"buy",cid:id,pack,key:rkKey(),orient:rkOrient()}});
 if(r.status===402){closeSheet();try{paySheet()}catch(_){toast(RZ("钻石不够","Not enough diamonds"))}return}
 if(r.status===429){toast(RZ("今天买的票已经到上限了","You've hit today's limit for bought votes"));return}
 if(!r.ok){toast(RZ("购买没成功，钻石没有扣","Purchase failed — no diamonds were taken"));return}
 closeSheet();if(!S.bias)S.bias=id;rkApply(r.j);rankRefresh();toast("+"+(pack==="m"?30:5)+" 🔥 → "+first(ch(id).n))}
async function rkShareVote(){if(typeof CL0==="undefined"||!CL0.on)return false;const me=rkMe();if(me&&me.shared)return false;
 const r=await capi("/wallet?r=rank",{json:{op:"share"}});if(r.ok){rkApply(r.j);return true}return false}
function charRankCard(id){if(!/^ld_/.test(id))return "";const L=RK.data?rkRows():[],r=L.find(x=>x.cid===id);
 if(!RK.data){if(!RK.err)rankLoad();return '<div class="card rkcc" id="chRank"><p class="xs faint">'+RZ("正在加载人气榜…","Loading the chart…")+'</p></div>'}
 if(!r)return '<div id="chRank"></div>';
 return '<div class="card rkcc" id="chRank"><div class="row" style="gap:10px"><div class="grow"><div class="eyebrow" style="color:var(--gold)">'+RZ("每周人气榜","WEEKLY CHART")+(rkChamp(id)>=0?" · 🏆 "+RZ("上周冠军","last week's top 3"):"")+'</div><b style="font-size:20px" class="num">#'+r.rank+'</b> <span class="xs faint">🔥 '+fmtN(r.heat)+'</span><p class="xs dim">'+rkGap(L,r)+'</p></div><button class="btn btn-p btn-sm" data-vote="'+id+'">🔥 '+RZ("投票","Vote")+'</button></div></div>'}
function rankShare(id){const c=ch(id),r=rkRows().find(x=>x.cid===id),q=RZ("帮 "+first(c.n)+" 冲上第一！","Help "+first(c.n)+" reach #1!");
 openShare({tag:"VOTE WEEK",who:c.n,big:"#"+(r?r.rank:"?"),quote:q,bg:artSrc(id),text:q+" — MIRU",link:shareURL("f",id)})}
async function rkFans(id){let L=RK.fans[id];
 if(!L){const r=await capi("/wallet?r=rank&fans="+encodeURIComponent(id));L=r.ok&&r.j.fans||[];RK.fans[id]=L;setTimeout(()=>delete RK.fans[id],60e3)}
 sheet('<h2>👑 '+RZ(first(ch(id).n)+" 的本周应援榜",first(ch(id).n)+"'s top fans this week")+'</h2><div class="rank" style="margin-top:10px">'+(L.length?L.map(f=>'<div class="rrow"><span class="rn">'+f.rank+'</span><div class="grow"><b>'+esc(f.name)+'</b></div><em class="num">'+f.votes+' '+RZ("票","votes")+'</em></div>').join(""):'<p class="xs faint">'+RZ("还没有人给 TA 投票，第一个就是你。","No votes yet — be the first.")+'</p>')+'</div>')}
const RK_HOW=()=>RZ("• 每人每天 3 张免费票，0 点（UTC）恢复。\n• 每天分享一次「帮 TA 打榜」，再得 1 张。\n• 热度 = 票数 × 520 + 和 TA 单聊的回合 × 20（每人每周最多算 50 回合）+ TA 所在剧本周被读完的章节 × 10。\n• 票不够可以买：1💎 = 5 票，5💎 = 30 票，每人每天最多买 100 票。\n• 每周一 0 点（UTC）结算清零，前三名挂「上周冠军」。\n• 所有数字都来自真实玩家。",
 "• 3 free votes a day, back at 00:00 UTC.\n• Share a “help him climb” card once a day for 1 more.\n• Heat = votes × 520 + 1:1 chat turns × 20 (up to 50 per player a week) + chapters read in his story × 10.\n• Out of votes? 1💎 = 5 votes, 5💎 = 30, up to 100 bought votes a day.\n• Resets every Monday 00:00 UTC; the top 3 wear “Last week's top 3”.\n• Every number comes from real players.");
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-vote]")){e.stopPropagation();castVote(x.dataset.vote,1);return}
 if(x=e.target.closest("[data-rkf]")){RK.orient=x.dataset.rkf;rankRefresh();return}
 if(e.target.closest("[data-rkretry]")){RK.err=false;rankLoad(true);rankRefresh();return}
 if(x=e.target.closest("[data-rkfans]")){rkFans(x.dataset.rkfans);return}
 if(x=e.target.closest("[data-rkshare]")){const id=x.dataset.rkshare;rkShareVote().then(ok=>{if(ok){toast(RZ("分享成功，多了 1 张免费票","Shared — 1 more free vote"));rankRefresh()}});rankShare(id);return}
 if(x=e.target.closest("[data-vshare]")){const id=x.dataset.vshare;closeSheet();rkShareVote().then(ok=>{if(ok){toast(RZ("分享成功，多了 1 张免费票","Shared — 1 more free vote"));rankRefresh()}});rankShare(id);return}
 if(e.target.closest("[data-rkhow]")){sheet('<h2>'+RZ("打榜规则","How the chart works")+'</h2><p class="sm dim" style="margin-top:8px;line-height:1.7;white-space:pre-line">'+RK_HOW()+'</p>');return}
 if(x=e.target.closest("[data-vbuy]")){const [id,pack]=x.dataset.vbuy.split("|");rkBuy(id,pack);return}},true);
(function(){const st=document.createElement("style");st.textContent='.rkchamp{display:inline-block;font-size:10.5px;font-weight:800;color:#FFD27F;background:rgba(255,210,127,.12);border-radius:999px;padding:1px 7px;margin:2px 0}.tkbar{height:4px;border-radius:4px;background:rgba(255,255,255,.08);margin-top:6px;overflow:hidden}.tkbar i{display:block;height:100%;background:var(--gold,#E9B45C)}.tkrw{font-size:12px;font-weight:800;color:#FFD27F;white-space:nowrap}';document.head.appendChild(st)})();
