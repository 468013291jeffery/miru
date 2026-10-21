/* ================= v2.4 · 素材库 — browse & try every game / BGM / FX / SFX =================
   The libraries fire by themselves inside stories (keywords in the lines), which made them invisible. This page lists all of them
   with their trigger words, and every item can be tried on the spot. Entry: Me page card · ⋯ tray in a chat · creator hub. */
let LIBT="mg",LIBQ="";
function libItems(){const zh=CL()==="zh",N=x=>zh?x.zh:x.en;
 if(LIBT==="mg")return MG100.map(g=>({id:g.id,n:N(g),sub:{find:"找东西",memory:"翻牌",code:"密码锁",rhythm:"心跳节拍",hold:"屏息",whack:"快拍",wires:"拆线",slide:"拼图",simon:"记顺序",scratch:"刮开",dice:"骰子",order:"拼回原话",catch:"接住",balance:"平衡",quiz:"问答"}[g.tpl]||g.tpl,kw:g.kw}));
 if(LIBT==="bgm")return BGM100.map(m=>({id:m.id,n:N(m),sub:m.bpm+" BPM · "+m.st,kw:m.kw}));
 if(LIBT==="fx")return FX100.map(f=>({id:f.id,n:N(f),sub:f.kind+(f.sfx?" + 🔊":""),kw:f.kw}));
 return SFX100.map(s=>({id:s.id,n:N(s),sub:"",kw:s.kw}))}
function libOpen(){const zh=CL()==="zh";const tabs=[["mg","🎮 "+(zh?"游戏":"Games"),MG100.length],["bgm","🎵 BGM",BGM100.length],["fx","✨ "+(zh?"特效":"FX"),FX100.length],["sfx","🔊 "+(zh?"音效":"SFX"),SFX100.length]];
 const q=LIBQ.toLowerCase(),L=libItems().filter(x=>!q||x.n.toLowerCase().includes(q)||x.kw.some(k=>k.toLowerCase().includes(q)));
 screen("s-lib",'<div class="topbar"><button class="ibtn" data-back="1">'+ic("back")+'</button><h2 class="grow" style="font-size:18px;text-align:center">'+(zh?"素材库":"Library")+'</h2><button class="ibtn" data-libstop="1" aria-label="stop">⏹</button></div>'+
  '<div class="lib65tabs">'+tabs.map(([k,l,n])=>'<button data-libt="'+k+'" class="'+(LIBT===k?"on":"")+'">'+l+'<small>'+n+'</small></button>').join("")+'</div>'+
  '<div class="pad" style="padding-top:8px"><input id="libQ" class="lib65q" placeholder="'+(zh?"搜名字或触发词，例如：雨、钥匙、心跳":"Search name or trigger word, e.g. rain, key, heartbeat")+'" value="'+esc(LIBQ)+'"><p class="xs faint" style="margin:8px 2px 0">'+
  (zh?"剧情里出现触发词就会自动出现（每章最多 1 个自动小游戏，特效/音效有冷却）；作者也可以在剧本里直接指定。点任意一项试玩。BGM 与音效为程序实时合成，可替换为正式音频。":"They fire by themselves when a trigger word shows up in a story (max 1 auto game per chapter; FX/SFX have cooldowns); authors can also place them directly. Tap any item to try it.")+'</p></div>'+
  '<div class="scroll pad lib65list">'+L.map(x=>'<button class="lib65i" data-libtry="'+x.id+'"><div class="grow"><b>'+esc(x.n)+'</b><span>'+esc(x.sub||"")+'</span><p>'+x.kw.slice(0,5).map(k=>'<i>'+esc(k)+'</i>').join("")+'</p></div><em>▶</em></button>').join("")+(L.length?'':'<p class="xs faint">'+(zh?"没有匹配的":"Nothing matches")+'</p>')+'</div>');show("s-lib")}
document.addEventListener("click",e=>{let x;
 if(e.target.closest("[data-libopen]")){LIBQ="";libOpen();return}
 if(x=e.target.closest("[data-libt]")){LIBT=x.dataset.libt;libOpen();return}
 if(e.target.closest("[data-libstop]")){try{bgmStop()}catch(_){}document.querySelectorAll(".fx100").forEach(n=>n.remove());return}
 if(x=e.target.closest("[data-libtry]")){const id=x.dataset.libtry;try{if(typeof audioUnlock==="function")audioUnlock()}catch(_){}
  if(LIBT==="mg"){mgOpen(id,r=>toast(r==="win"?"🎉":r==="lose"?"🫠":"↩"));return}
  if(LIBT==="bgm"){const was=S.bgm;S.bgm=true;try{bgmPlay(id,null)}catch(_){}S.bgm=was;toast("🎵 "+bgmName(id));return}
  if(LIBT==="fx"){fx100(id,{force:1});return}
  sfx100(id,1);return}});
document.addEventListener("input",e=>{if(e.target&&e.target.id==="libQ"){LIBQ=e.target.value;clearTimeout(libOpen.t);libOpen.t=setTimeout(()=>{libOpen();const q=$("#libQ");if(q){q.focus();q.setSelectionRange(q.value.length,q.value.length)}},250)}});
/* entry points */
const _renderMe65=renderMe;renderMe=function(v){const r=_renderMe65.apply(this,arguments);try{if(!v.querySelector(".lib65me")){const zh=CL()==="zh";
 const h='<button class="card lib65me" data-libopen="1"><div class="row"><div class="grow"><b>🎛 '+(zh?"素材库":"Library")+'</b><p class="xs faint">🎮 '+MG100.length+(zh?" 游戏":" games")+' · 🎵 '+BGM100.length+' BGM · ✨ '+FX100.length+(zh?" 特效":" FX")+' · 🔊 '+SFX100.length+(zh?" 音效":" SFX")+'</p></div><span>›</span></div></button>';
 const a=v.querySelector(".pf64me")||v.querySelector(".ttscard")||v.querySelector(".lccard");if(a)a.insertAdjacentHTML("afterend",h);else{const sc=v.querySelector(".scroll");if(sc)sc.insertAdjacentHTML("afterbegin",h)}}}catch(_){}return r};
const _renderChat65=renderChat;renderChat=function(){const r=_renderChat65.apply(this,arguments);try{const t2=$("#modes2");if(t2&&!t2.querySelector("[data-libopen]"))t2.insertAdjacentHTML("beforeend",'<button class="tool" data-libopen="1">🎛 '+(CL()==="zh"?"素材库":"Library")+'</button>')}catch(_){}return r};
(function(){const st=document.createElement("style");st.textContent=`
.lib65tabs{display:flex;gap:6px;padding:4px 16px 0}.lib65tabs button{flex:1;padding:9px 4px;border-radius:12px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:#ddd;font-size:12.5px;display:flex;flex-direction:column;align-items:center;gap:2px}
.lib65tabs button small{font-size:10.5px;color:#9C93A8}.lib65tabs button.on{border-color:#F0B77E;background:rgba(240,183,126,.14);color:#F6D3AE}
.lib65q{width:100%;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);color:#fff;font-size:14px;box-sizing:border-box}
.lib65list{display:flex;flex-direction:column;gap:7px;padding-bottom:30px}.lib65i{display:flex;gap:10px;align-items:center;text-align:left;padding:10px 12px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.035);color:#fff}
.lib65i b{font-size:14px}.lib65i span{font-size:11px;color:#9C93A8;margin-left:8px}.lib65i p{margin:5px 0 0;display:flex;flex-wrap:wrap;gap:4px}.lib65i p i{font-style:normal;font-size:10.5px;padding:2px 7px;border-radius:999px;background:rgba(240,183,126,.1);color:#F6D3AE}
.lib65i em{font-style:normal;color:#F0B77E}.lib65me{display:block;width:100%;text-align:left;margin-bottom:12px}`;document.head.appendChild(st)})();
