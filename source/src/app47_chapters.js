/* ---- v147 · 章节目录: jump to any chapter ----
   Chapters you've already reached: jump back free. Chapters ahead of you: unlock early for 💎 (100 for ch.2, +20 per chapter after),
   once per story, then jump any time. The chat header "第 N 章 / M" opens the map. */
function jumpPrice(n){return 100+Math.max(0,n-2)*20}
function chReach(wid){const ps=packSt(wid);const fromRuns=Math.max(0,...Object.values(S.threads).filter(t2=>t2.wid===wid&&t2.pk).map(t2=>t2.pk.ch||0));return Math.max(ps.reach||0,fromRuns,1)}
function chJumped(wid,n){const ps=packSt(wid);return !!(ps.jump&&ps.jump[n])}
function chOpen(wid,n){return n<=chReach(wid)||chJumped(wid,n)}
const _chLocked47=chLocked;chLocked=function(wid,n){return _chLocked47(wid,n)&&!chJumped(wid,n)};
const _packOpen47=packOpen;packOpen=function(th,n,instant){try{if(th&&th.wid){const ps=packSt(th.wid);ps.reach=Math.max(ps.reach||0,n);save()}}catch(_){}return _packOpen47.apply(this,arguments)};
function chOutline(c){const b=(c.beats&&(c.beats.zh||c.beats.en))||[];return b.length<12}
function chMap(wid){const w=wd(wid);if(!w||!w.pack)return;const P=w.pack,reach=chReach(wid),th=S.threads[curT],cur=th&&th.wid===wid&&th.pk?th.pk.ch:0;
 sheet('<div class="eyebrow" style="color:var(--gold)">📖 '+LL("章节目录","Chapters")+'</div><h2 style="margin-top:4px">'+esc(Lz(w.title))+'</h2><p class="xs faint" style="margin-top:4px;line-height:1.5">'+
  LL("共 "+P.chapters.length+" 章。读到过的章节随时免费跳回；还没读到的，可以提前解锁。","" +P.chapters.length+" chapters. Jump back to any chapter you've reached for free; unlock ones ahead early.")+'</p><div class="chlist">'+
  P.chapters.map((c,i)=>{const n=i+1,open=chOpen(wid,n),here=n===cur;
   const tag=here?LL("当前","Now"):n<=reach?"✓ "+LL("读到过","Reached"):chJumped(wid,n)?"🔓 "+LL("已解锁","Unlocked"):"🔒 💎"+jumpPrice(n);
   return '<button class="chrow'+(open?"":" lock")+(here?" here":"")+'" data-chto="'+wid+'|'+n+'"><i>'+n+'</i><span class="grow"><b>'+esc(Lz(c.t))+(chOutline(c)?' <em class="chol">'+LL("大纲版","Outline")+'</em>':'')+'</b><small>'+esc(Lz(c.goal))+'</small></span><em class="chtag">'+tag+'</em></button>'}).join("")+'</div>'+
  '<p class="xs faint" style="margin-top:10px;line-height:1.5">'+LL("跳到某一章会开一局新的进度；之前章节的选择按默认结果计入。大纲版章节的完整剧本还在制作中。","Jumping starts a new run there; earlier chapters count with default choices. Outline chapters are still being written in full.")+'</p>')}
function chRoleSheet(wid,n){const w=wd(wid),th=S.threads[curT],keep=th&&th.wid===wid&&th.pk?th.pk.as:null;
 sheet('<h2>'+LL("第 "+n+" 章 · ","Chapter "+n+" · ")+esc(Lz(w.pack.chapters[n-1].t))+'</h2><p class="sm dim" style="margin-top:4px">'+LL("以什么身份进入？","Who do you play?")+'</p><div class="stack" style="gap:8px;margin-top:10px">'+
  packModes(w).map(m=>'<button class="opt" data-chjump="'+wid+'|'+n+'|'+m.as+'"><span class="ic">'+(m.as==="watch"?"👁":"▶")+'</span><span class="grow"><b>'+esc(packAsName(w,m.as))+'</b></span>'+(keep===m.as?'<span class="check on">✓</span>':'')+'</button>').join("")+'</div>')}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-chmap]")){e.stopPropagation();chMap(x.dataset.chmap);return}
 if(x=e.target.closest("[data-chto]")){const [wid,n0]=x.dataset.chto.split("|"),n=+n0;
  if(chOpen(wid,n)){chRoleSheet(wid,n);return}
  const w=wd(wid),c=w.pack.chapters[n-1],pr=jumpPrice(n);
  sheet('<div style="text-align:center"><div style="font-size:30px">🔓</div><h2 style="margin-top:6px">'+LL("提前解锁第 "+n+" 章","Unlock Chapter "+n+" early")+'</h2><p class="sm" style="margin-top:6px">《'+esc(Lz(c.t))+'》</p><p class="sm dim" style="margin-top:8px;line-height:1.6">'+esc(Lz(c.goal))+'</p>'+
   '<p class="xs faint" style="margin-top:8px">'+LL("解锁后，这一章永久可跳转。","Once unlocked, you can jump here any time.")+'</p></div>'+
   '<button class="btn btn-p btn-block" style="margin-top:14px" data-chbuy="'+wid+'|'+n+'">'+LL("解锁并开始","Unlock & start")+' · 💎'+pr+'</button><p class="xs faint" style="text-align:center;margin-top:6px">💎 '+S.keys+'</p>');return}
 if(x=e.target.closest("[data-chbuy]")){const [wid,n0]=x.dataset.chbuy.split("|"),n=+n0;if(!spend(jumpPrice(n),"event"))return;const ps=packSt(wid);ps.jump=ps.jump||{};ps.jump[n]=1;save();toast(LL("第 "+n+" 章已解锁","Chapter "+n+" unlocked"));chRoleSheet(wid,n);return}
 if(x=e.target.closest("[data-chjump]")){const [wid,n0,as]=x.dataset.chjump.split("|"),n=+n0;const th=S.threads[curT];const picks=th&&th.wid===wid&&th.pk?th.pk.picks:{};closeSheet();packStart(wid,as,n,picks);return}},true);
/* entry points: the start sheet and the chat menu */
const _startSheet47=startSheet;startSheet=function(wid,fresh){_startSheet47(wid,fresh);try{const w=wd(wid);if(w&&w.pack){const st=$(".sheet .stack");if(st)st.insertAdjacentHTML("afterend",'<button class="btn btn-g btn-block" style="margin-top:10px" data-chmap="'+wid+'">📖 '+LL("章节目录 · 跳到任意一章","Chapters · jump to any chapter")+'</button>')}}catch(_){}};
/* 2026-10-27：从「包一层 menuSheet」搬成登记一块（top）。HTML 一字未改。 */
SHEET.add("menu","app47_chapters.js","top",function(){try{const th=S.threads[curT];if(!(th&&th.pk))return "";return '<button class="opt" data-chmap="'+th.wid+'"><span class="ic">📖</span><span class="grow"><b>'+LL("章节目录","Chapters")+'</b><span>'+LL("第 "+th.pk.ch+" 章 / 共 "+PCN(wd(th.wid))+" 章 · 跳到任意一章","Chapter "+th.pk.ch+" of "+PCN(wd(th.wid))+" · jump anywhere")+'</span></span></button>'}catch(_){return ""}});
(function(){const st=document.createElement("style");st.textContent=`
.chlist{display:flex;flex-direction:column;gap:6px;margin-top:12px;max-height:58vh;overflow:auto}
.chrow.spch{width:100%;text-align:left;cursor:pointer}.chrow.spch .chl{white-space:nowrap;font-size:12px;font-weight:800;color:#F7D2A8}.chrow.spch .chf{white-space:nowrap}
.chlist .chrow:not(.spch){display:flex;align-items:center;gap:10px;width:100%;padding:9px 10px;border-radius:12px;background:var(--panel2);border:1px solid var(--line);text-align:left}
.chrow>i{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;font-style:normal;font-weight:900;background:rgba(240,183,126,.14);color:var(--gold);flex:none}
.chrow b{display:block;font-size:14px}.chrow small{display:block;font-size:11.5px;color:#aaa;margin-top:2px;line-height:1.4}
.chrow .chtag{font-style:normal;font-size:12px;font-weight:800;color:var(--gold);white-space:nowrap}.chrow.lock{opacity:.75}.chrow.lock .chtag{color:#F7D2A8}
.chrow.here{border-color:var(--gold);background:rgba(240,183,126,.1)}.chol{font-style:normal;font-size:10px;font-weight:700;color:#aaa;border:1px solid rgba(255,255,255,.2);border-radius:6px;padding:0 4px;margin-left:4px}`;document.head.appendChild(st)})();
