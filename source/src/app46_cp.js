/* ---- v146 · 后悔药 = jump back to ANY section you've reached (paid) ----
   Stories: a checkpoint is saved at every chapter start and every scene (第N章 · 第M节). Free chats: at the first meeting and every 8 turns.
   ⏪ opens a chapter → section map; reached sections can be revisited for 💎2 (members free), later ones show as locked.
   Restoring truncates the chat to that point, restores every meter/flag/choice as it was, and replays the script from there. */
const RW_PRICE=2;
function cpState(th){const o={};for(const k in th){if(k==="msgs"||k==="cps"||k==="_snap")continue;o[k]=th[k]}const s=JSON.parse(JSON.stringify(o));if(s.pk)delete s.pk.q;return s}
function cpChapBeats(th,n){const w=wd(th.wid),c=w&&w.pack&&w.pack.chapters[n-1];return c?packBeats(c.beats):[]}
function cpScenes(th,n){return cpChapBeats(th,n).map((b,i)=>[b,i]).filter(([b])=>Array.isArray(b)&&b[0]==="sys"&&b[1]==="scene")}
function cpAdd(th,cp){th.cps=th.cps||[];const k=cp.kind+"|"+cp.ch+"|"+cp.idx;th.cps=th.cps.filter(c=>c.kind+"|"+c.ch+"|"+c.idx!==k);cp.s=cpState(th);cp.at=Date.now();th.cps.push(cp);if(th.cps.length>40)th.cps=th.cps.slice(-40)}
/* chapter starts */
const _packOpen46=packOpen;packOpen=function(th,n,instant){try{if(th&&th.pk&&!th._cpRestoring)cpAdd(th,{kind:"start",ch:n,idx:0,n:th.msgs.length})}catch(_){}return _packOpen46.apply(this,arguments)};
/* scenes */
PKREG.add("app46_cp.js", function(th,b, next){try{if(Array.isArray(b)&&b[0]==="sys"&&b[1]==="scene"&&th.pk&&th.pk.ch){const key=JSON.stringify(b),last=(th.cps||[]).filter(c=>c.ch===th.pk.ch&&c.kind==="scene").map(c=>c.idx);const from=last.length?Math.max(...last)+1:0;
  const sc=cpScenes(th,th.pk.ch).find(([x,i])=>i>=from&&JSON.stringify(x)===key)||cpScenes(th,th.pk.ch).find(([x])=>JSON.stringify(x)===key);
  if(sc&&!(th.cps||[]).some(c=>c.kind==="scene"&&c.ch===th.pk.ch&&c.idx===sc[1]))cpAdd(th,{kind:"scene",ch:th.pk.ch,idx:sc[1],n:th.msgs.length})}}catch(_){}return next(th,b)});;
/* free chats: the first meeting + every 8 turns */
const _appendMsg46=appendMsg;appendMsg=function(th,m){try{if(th&&!th.pk&&m&&m.who==="me"){const mine=th.msgs.filter(x=>x.who==="me").length;if(mine===0||mine%8===0)cpAdd(th,{kind:"chat",ch:0,idx:mine,n:th.msgs.length})}}catch(_){}return _appendMsg46.apply(this,arguments)};
function cpLabel(th,cp){if(cp.kind==="chat")return cp.idx===0?LL("初遇","First meeting"):LL("第 "+cp.idx+" 回合","Turn "+cp.idx);const sc=cpScenes(th,cp.ch),j=sc.findIndex(([,i])=>i===cp.idx);return cp.kind==="start"?LL("开头","Opening"):LL("第 "+(j+1)+" 节","Section "+(j+1))}
function cpPlace(b){const d=(b&&b[2])||{};return [d.place,d.time].filter(Boolean).join(" · ")}
function cpImg(d){const id=d&&d.img;const f=id&&(window.SCENE_FILES||{})[id];return f||null}
rewindSheet=function(){const th=S.threads[curT];if(!th)return;const tag=S.plus?t("pay.vip"):"💎"+RW_PRICE;let h='<h2>⏪ '+LL("回到某一节","Go back to a section")+'</h2><p class="sm dim" style="margin-top:4px;line-height:1.55">'+LL("走过的章节都能回去重来，之后的剧情会按你新的选择重新展开。","Any section you've reached can be replayed; everything after it unfolds again from your new choices.")+' · '+tag+'</p><div class="cpmap">';
 if(th.pk&&th.wid){const w=wd(th.wid),cur=th.pk.ch||1;(w.pack.chapters||[]).forEach((c,ci)=>{const n=ci+1;if(n>cur+1)return;const cps=(th.cps||[]).filter(x=>x.ch===n);
   h+='<div class="cpch"><b>'+LL("第 "+n+" 章","Chapter "+n)+' · '+esc(Lz(c.t))+'</b>';
   const rows=[{kind:"start",idx:0,d:{place:Lz(c.place),time:Lz(c.time)}}].concat(cpScenes(th,n).map(([b,i])=>({kind:"scene",idx:i,d:b[2]||{}})));
   rows.forEach((r,j)=>{const cp=cps.find(x=>x.kind===r.kind&&x.idx===r.idx),here=n===cur&&cp&&!(th.cps||[]).some(x=>x.ch===n&&x.at>cp.at),im=cpImg(r.d);
    h+='<button class="cprow'+(cp?"":" lock")+(here?" here":"")+'" '+(cp?'data-cpgo2="'+th.cps.indexOf(cp)+'"':'disabled')+'>'+(im?'<i style="background-image:url(\''+im+'\')"></i>':'<i class="ph">'+(r.kind==="start"?"✦":j)+'</i>')+'<span class="grow"><b>'+(r.kind==="start"?LL("开头","Opening"):LL("第 "+j+" 节","Section "+j))+'</b><small>'+esc(cpPlace([0,0,r.d])||"")+'</small></span><em>'+(here?LL("当前","Now"):cp?"⟲":"🔒")+'</em></button>'});h+='</div>'})}
 else{const cps=(th.cps||[]).filter(c=>c.kind==="chat");if(!cps.length)h+='<p class="empty">'+LL("还没有可以回去的节点——先聊几句。","Nothing to go back to yet — talk a little first.")+'</p>';
  cps.forEach(cp=>{h+='<button class="cprow" data-cpgo2="'+th.cps.indexOf(cp)+'"><i class="ph">'+(cp.idx===0?"✦":cp.idx)+'</i><span class="grow"><b>'+cpLabel(th,cp)+'</b><small>'+esc(ago(cp.at))+'</small></span><em>⟲</em></button>'})}
 h+='</div>'+(th.pk&&th.wid?'<button class="btn btn-g btn-block" style="margin-top:12px" data-cprestart="1">'+LL("从头开始，重新选身份（免费）","Start over and pick a role (free)")+'</button>':'');sheet(h)};
function cpRestore(th,cp){try{if(typeof pkTrace==="function")pkTrace("cpRestore",cp&&cp.ch)}catch(_){}const snap=JSON.parse(JSON.stringify(cp.s)),msgs=th.msgs.slice(0,cp.n),cps=(th.cps||[]).filter(c=>c.at<=cp.at),g=(th._gen||0)+1,w=PKWAIT[th.id],nx=typeof PKNEXT!=="undefined"?PKNEXT[th.id]:null;
 Object.keys(th).forEach(k=>delete th[k]);Object.assign(th,snap,{msgs,cps});th._gen=g;delete PKWAIT[th.id];try{delete PKNEXT[th.id]}catch(_){}try{CH=null}catch(_){}if(w)w([]);if(nx)nx();
 (typeof soft==="function"?soft:function(n,f){try{return f()}catch(e){}})("app46_cp:L32",function(){const L=$("#fxLayer");if(L)L.innerHTML=""});
 if(th.pk&&cp.kind==="start"){th.pk.q=[];th.pk.stop=null;save();renderChat();th._cpRestoring=1;setTimeout(()=>{delete PKPLAY[th.id];packOpen(th,cp.ch);delete th._cpRestoring},150)}
 else if(th.pk){th.pk.q=cpChapBeats(th,cp.ch).slice(cp.idx);th.pk.stop=null;(typeof pkGo==="function"?pkGo:(typeof window!=="undefined"&&window.PKST&&window.PKST.go?window.PKST.go:function(t,s){t.pk.st=s}))(th,'busy','restore');th.pk.after="choose";save();renderChat();setTimeout(()=>{delete PKPLAY[th.id];packRun(th)},150)}
 else{save();renderChat()}
 appendMsg(th,{who:"sys",k:"card",title:"⏪ "+LL("回到了这里","Back to this point"),txt:(th.pk?LL("第 "+cp.ch+" 章 · ","Chapter "+cp.ch+" · "):"")+cpLabel(th,cp)+LL("。这一次，换个方式走。"," — try it differently this time."),at:Date.now()})}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-cpgo2]")){const th=S.threads[curT],cp=th&&th.cps&&th.cps[+x.dataset.cpgo2];if(!cp)return;
  sheet('<div style="text-align:center"><div style="font-size:30px">⏪</div><h2 style="margin-top:6px">'+(th.pk?LL("第 "+cp.ch+" 章 · ","Chapter "+cp.ch+" · "):"")+esc(cpLabel(th,cp))+'</h2><p class="sm dim" style="margin-top:8px;line-height:1.6">'+LL("回到这一节。之后发生的对话、选择和关系变化都会清除，从这里重新走。","Go back here. Everything after it — lines, choices, relationship changes — is cleared and replayed.")+'</p></div>'+
   '<button class="btn btn-p btn-block" style="margin-top:14px" data-cpok2="'+x.dataset.cpgo2+'">⏪ '+LL("回到这一节","Go back")+' · '+(S.plus?t("pay.vip"):"💎"+RW_PRICE)+'</button><p class="xs faint" style="text-align:center;margin-top:6px">💎 '+S.keys+'</p>');return}
 if(x=e.target.closest("[data-cpok2]")){const th=S.threads[curT],cp=th&&th.cps&&th.cps[+x.dataset.cpok2];if(!cp)return;if(!S.plus&&!spend(RW_PRICE,"event"))return;closeSheet();cpRestore(th,cp);return}
 if(e.target.closest("[data-cprestart]")){const th=S.threads[curT];closeSheet();if(th&&th.wid)startSheet(th.wid,true)}});
/* menu label */
const _menuSheet46=menuSheet;menuSheet=function(){_menuSheet46.apply(this,arguments);try{const b=$(".sheet [data-rewind]");if(b){b.querySelector("b").textContent=LL("回到某一节","Go back to a section");const sm=b.querySelector(".grow span");if(sm)sm.textContent=LL("任意章节 · 小节都能回去重来 · ","Any chapter or section · ")+(S.plus?t("pay.vip"):"💎"+RW_PRICE)}}catch(_){}};
(function(){const st=document.createElement("style");st.textContent=`
.cpmap{display:flex;flex-direction:column;gap:12px;margin-top:12px;max-height:60vh;overflow:auto}.cpch>b{display:block;font-size:13px;color:var(--gold);margin-bottom:6px}
.cprow{display:flex;align-items:center;gap:10px;width:100%;padding:8px 10px;margin-top:6px;border-radius:12px;background:var(--panel2);border:1px solid var(--line);text-align:left}
.cprow i{width:44px;height:44px;border-radius:10px;background-size:cover;background-position:center;flex:none}.cprow i.ph{display:grid;place-items:center;font-style:normal;background:rgba(240,183,126,.14);color:var(--gold);font-weight:800}
.cprow b{display:block;font-size:14px}.cprow small{display:block;font-size:11.5px;color:#aaa;margin-top:2px}.cprow em{font-style:normal;color:var(--gold);font-weight:800;font-size:13px}
.cprow.lock{opacity:.4}.cprow.here{border-color:var(--gold);background:rgba(240,183,126,.1)}`;document.head.appendChild(st)})();
