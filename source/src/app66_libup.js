/* ================= v2.5 · 素材库 · user uploads =================
   Every tab gets "＋ 上传我的": BGM (audio file), 音效 (audio), 特效 (image → falls like petals or covers the screen; short video → plays over
   the scene), 游戏 (no code upload — pick a template and fill in your own content: find-the-item, memory pairs, code lock, rebuild-the-line,
   scratch card, dice). Each upload gets a name + trigger words and then behaves exactly like a built-in item: keyword triggers in stories,
   author directives, the try button. Files live in this browser (IndexedDB); metadata in S.myLib. Before the platform library goes online
   uploads are personal; the form asks the uploader to confirm they have the rights. */
const ULIM={audio:8,image:3,video:12};
/* uploads use platform storage and bandwidth → they cost diamonds (charged only when the save succeeds) */
const UPRICE={audio:5,image:3,video:10,mg:2};
function upPrice(){if(UPK==="mg")return UPRICE.mg;const t=UPFILE&&UPFILE.type||"";return /^video\//.test(t)?UPRICE.video:/^image\//.test(t)?UPRICE.image:UPK==="fx"?UPRICE.image:UPRICE.audio}
const UDB={db:null};
function udb(){return new Promise((res,rej)=>{if(UDB.db)return res(UDB.db);try{const r=indexedDB.open("miru_lib",1);r.onupgradeneeded=()=>r.result.createObjectStore("f");r.onsuccess=()=>{UDB.db=r.result;res(UDB.db)};r.onerror=()=>rej(r.error)}catch(e){rej(e)}})}
async function uput(id,blob){const db=await udb();return new Promise((res,rej)=>{const tx=db.transaction("f","readwrite");tx.objectStore("f").put(blob,id);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error)})}
async function uget(id){const db=await udb();return new Promise(res=>{const tx=db.transaction("f","readonly"),q=tx.objectStore("f").get(id);q.onsuccess=()=>res(q.result||null);q.onerror=()=>res(null)})}
async function udel(id){try{const db=await udb();db.transaction("f","readwrite").objectStore("f").delete(id)}catch(_){}}
function myLib(){S.myLib=S.myLib||{bgm:[],sfx:[],fx:[],mg:[]};return S.myLib}
const UURL={};
async function uurl(id){if(UURL[id])return UURL[id];const b=await uget(id);if(!b)return null;UURL[id]=URL.createObjectURL(b);return UURL[id]}
/* register an uploaded item into the live libraries */
async function uregister(kind,m){const kw=m.kw||[];
 if(kind==="bgm"){const u=await uurl(m.id);if(!u)return;window.BGM_FILES=window.BGM_FILES||{};BGM_FILES[m.id]=u;
  if(!BGM100.some(x=>x.id===m.id))BGM100.push({id:m.id,zh:"🎧 "+m.name,en:"🎧 "+m.name,st:"upload",root:0,mode:"maj",bpm:0,prog:"pop",kw,mine:1});
  try{const X=window.__SC;if(X&&!X.SC_M[m.id])X.SC_M[m.id]=Object.assign({},X.SC_M.m_slow_burn||X.SC_M.warm);if(typeof BGM_MOODS!=="undefined")BGM_MOODS[m.id]=BGM_MOODS[m.id]||{bpm:70,ch:[[48]],arp:[]};if(typeof BGM_NAME!=="undefined")BGM_NAME[m.id]="🎧 "+m.name}catch(_){}}
 if(kind==="sfx"){const u=await uurl(m.id);if(!u)return;SFX_FILES[m.id]=u;if(!SFX100.some(x=>x.id===m.id))SFX100.push({id:m.id,zh:"🎧 "+m.name,en:"🎧 "+m.name,L:[],kw,mine:1})}
 if(kind==="fx"){const u=await uurl(m.id);if(!u)return;const f={id:m.id,zh:"🖼 "+m.name,en:"🖼 "+m.name,kind:m.mode==="video"?"uvid":m.mode==="cover"?"uimg":"ufall",p:u,sfx:m.sfx||null,kw,mine:1};const i=FX100.findIndex(x=>x.id===m.id);if(i>=0)FX100[i]=f;else FX100.push(f)}
 if(kind==="mg"){if(!MG100.some(x=>x.id===m.id))MG100.push({id:m.id,zh:"🧩 "+m.name,en:"🧩 "+m.name,tpl:m.tpl,a:m.a,b:m.b||"-",kw,mine:1})}}
async function uloadAll(){const L=myLib();for(const k of ["bgm","sfx","fx","mg"])for(const m of L[k]||[]){try{await uregister(k,m)}catch(_){}}}
setTimeout(()=>{uloadAll().catch(()=>{})},800);
/* uploaded visual effects */
const _fx66=fx100;
fx100=function(id,opt){const F=FX100.find(x=>x.id===id);if(!F||!/^u(img|vid|fall)$/.test(F.kind))return _fx66(id,opt);opt=opt||{};if(F.sfx&&!opt.silent)sfx100(F.sfx,.8);if(fxReduced()&&!opt.force)return;
 const ov=document.createElement("div");ov.className="fx100 fk-u";document.body.appendChild(ov);const kill=ms=>setTimeout(()=>{ov.classList.add("out");setTimeout(()=>ov.remove(),500)},ms);
 if(F.kind==="uimg"){ov.innerHTML='<img src="'+F.p+'" alt="" class="fxu-cover">';kill(2600);return}
 if(F.kind==="uvid"){ov.innerHTML='<video src="'+F.p+'" class="fxu-cover" muted playsinline autoplay></video>';const v=ov.querySelector("video");v.onended=()=>kill(0);v.onerror=()=>kill(0);setTimeout(()=>kill(0),12000);return}
 const W=innerWidth,H=innerHeight;for(let i=0;i<18;i++){const im=document.createElement("img");im.src=F.p;im.className="fxu-p";const s=28+Math.random()*30;
  im.style.cssText="left:"+(Math.random()*W)+"px;width:"+s+"px;animation-duration:"+(2.4+Math.random()*1.8)+"s;animation-delay:"+(Math.random()*1.2)+"s;--dx:"+((Math.random()-.5)*120)+"px;--rot:"+((Math.random()-.5)*540)+"deg";ov.appendChild(im)}kill(4200)};
/* ---------- the upload sheet ---------- */
const UTPL=[["find","找东西","要找的 emoji","干扰项 emoji（4–6 个）"],["memory","翻牌配对","6 个 emoji（如 🍷🎻🌹💍🕯🗝）",""],["code","密码锁","位数（3 或 4）","提示语"],["order","拼回原话","一句话，用 / 分段（如 我/一直/在/等你）",""],["scratch","刮开","刮开前的图标 emoji","刮开后看到的话"],["dice","骰子","局数（1 或 3）","规则说明"]];
let UPK="bgm",UPFILE=null;
function upSheet(kind){UPK=kind||LIBT||"bgm";if(UPK==="mg")UPK="mg";UPFILE=null;upRender()}
function upRender(){const zh=CL()==="zh",k=UPK;
 const head={bgm:zh?"上传 BGM":"Upload BGM",sfx:zh?"上传音效":"Upload a sound",fx:zh?"上传特效":"Upload an effect",mg:zh?"用模板做一个小游戏":"Make a mini-game from a template"}[k];
 let body='<div class="up66seg">'+[["bgm","🎵 BGM"],["sfx","🔊 "+(zh?"音效":"SFX")],["fx","✨ "+(zh?"特效":"FX")],["mg","🎮 "+(zh?"游戏":"Game")]].map(([x,l])=>'<button data-upk="'+x+'" class="'+(k===x?"on":"")+'">'+l+'</button>').join("")+'</div>';
 body+='<label class="up66l">'+(zh?"名字":"Name")+'</label><input id="upName" class="up66i" maxlength="16" placeholder="'+(zh?"例如：雨夜钢琴":"e.g. Rainy piano")+'">';
 if(k==="mg"){body+='<label class="up66l">'+(zh?"玩法模板":"Template")+'</label><div class="up66seg wrap">'+UTPL.map(([t0,n])=>'<button data-uptpl="'+t0+'" class="'+((UPK_T||"find")===t0?"on":"")+'">'+n+'</button>').join("")+'</div>';
  const T=UTPL.find(x=>x[0]===(UPK_T||"find"));body+='<label class="up66l">'+T[2]+'</label><input id="upA" class="up66i">'+(T[3]?'<label class="up66l">'+T[3]+'</label><input id="upB" class="up66i">':'')}
 else{const acc=k==="fx"?"image/*,video/mp4,video/webm":"audio/*";
  body+='<label class="up66l">'+(zh?"文件":"File")+' <small>'+(k==="fx"?(zh?"图片 ≤3MB · 短视频 ≤12MB":"image ≤3MB · short video ≤12MB"):(zh?"音频 ≤8MB（mp3 / m4a / wav / ogg）":"audio ≤8MB"))+'</small></label><label class="up66file"><input type="file" id="upFile" accept="'+acc+'" hidden><span id="upFileN">'+(UPFILE?esc(UPFILE.name):(zh?"点这里选择文件":"Tap to choose a file"))+'</span></label>';
  if(k==="fx")body+='<label class="up66l">'+(zh?"效果方式":"How it shows")+'</label><div class="up66seg"><button data-upmode="fall" class="'+(UPMODE==="fall"?"on":"")+'">'+(zh?"飘落":"Falling")+'</button><button data-upmode="cover" class="'+(UPMODE==="cover"?"on":"")+'">'+(zh?"全屏叠加":"Full overlay")+'</button></div>'}
 body+='<label class="up66l">'+(zh?"触发词":"Trigger words")+' <small>'+(zh?"逗号分隔，剧情里出现就会触发":"comma separated")+'</small></label><input id="upKw" class="up66i" placeholder="'+(zh?"例如：下雨, 钢琴, 雨夜":"e.g. rain, piano")+'">'+
  '<label class="up66ok"><input type="checkbox" id="upRight"> '+(zh?"我确认拥有这份素材的使用权（原创、已购买授权或可商用的免费素材）":"I own the rights to this (original, licensed, or free for commercial use)")+'</label>'+
  '<p class="xs faint">'+(zh?"上传会占用平台的存储和流量，按类型收取钻石：音频 💎"+UPRICE.audio+" · 图片 💎"+UPRICE.image+" · 短视频 💎"+UPRICE.video+" · 模板游戏 💎"+UPRICE.mg+"。保存成功才扣。":"Uploads use platform storage and bandwidth: audio 💎"+UPRICE.audio+" · image 💎"+UPRICE.image+" · video 💎"+UPRICE.video+" · template game 💎"+UPRICE.mg+". Charged only when it saves.")+'</p>'+
  '<button class="btn btn-p btn-block" data-upsave="1" id="upSaveBtn">'+(zh?"保存到我的素材":"Save to my library")+' · 💎'+upPrice()+'</button>';
 sheet('<div class="up66"><h2>'+head+'</h2>'+body+'</div>')}
let UPK_T="find",UPMODE="fall";
document.addEventListener("click",async e=>{let x;const zh=CL()==="zh";
 if(x=e.target.closest("[data-upopen]")){upSheet(x.dataset.upopen);return}
 if(x=e.target.closest("[data-upk]")){UPK=x.dataset.upk;UPFILE=null;upRender();return}
 if(x=e.target.closest("[data-uptpl]")){UPK_T=x.dataset.uptpl;upRender();return}
 if(x=e.target.closest("[data-upmode]")){UPMODE=x.dataset.upmode;document.querySelectorAll("[data-upmode]").forEach(b=>b.classList.toggle("on",b===x));return}
 if(x=e.target.closest("[data-updel]")){e.stopImmediatePropagation();e.preventDefault();const [k,id]=x.dataset.updel.split("|");const L=myLib();L[k]=(L[k]||[]).filter(m=>m.id!==id);save();udel(id);
  const arr={bgm:BGM100,sfx:SFX100,fx:FX100,mg:MG100}[k];const i=arr.findIndex(m=>m.id===id);if(i>=0)arr.splice(i,1);toast(zh?"已删除":"Deleted");libOpen();return}
 if(e.target.closest("[data-upsave]")){const name=(($("#upName")||{}).value||"").trim(),kw=(($("#upKw")||{}).value||"").split(/[,，、\s]+/).map(s=>s.trim()).filter(s=>s.length>=1).slice(0,8);
  if(!name)return toast(zh?"起个名字":"Give it a name");if(!$("#upRight").checked)return toast(zh?"请先确认使用权":"Please confirm you have the rights");
  const id="u_"+UPK+"_"+Date.now().toString(36);const L=myLib();let m={id,name,kw,at:Date.now()};
  if(UPK==="mg"){const a=(($("#upA")||{}).value||"").trim(),b=(($("#upB")||{}).value||"").trim();if(!a)return toast(zh?"把内容填上":"Fill in the content");
   if(UPK_T==="order"&&a.split("/").length<3)return toast(zh?"至少分成 3 段，用 / 隔开":"Split into 3+ parts with /");Object.assign(m,{tpl:UPK_T,a,b:b||"-"})}
  else{if(!UPFILE)return toast(zh?"先选一个文件":"Choose a file first");const isV=/^video\//.test(UPFILE.type),isI=/^image\//.test(UPFILE.type),isA=/^audio\//.test(UPFILE.type);
   const lim=(isV?ULIM.video:isI?ULIM.image:ULIM.audio)*1048576;if(UPFILE.size>lim)return toast(zh?"文件太大了":"File too large");
   if((UPK==="fx"&&!(isV||isI))||(UPK!=="fx"&&!isA))return toast(zh?"文件类型不对":"Wrong file type");
   try{await uput(id,UPFILE)}catch(_){return toast(zh?"这个浏览器不能保存文件":"This browser can't store files")}
   if(UPK==="fx")m.mode=isV?"video":UPMODE}
  const price=upPrice();if(!(S.plus&&false)&&!spend(price,"upload")){try{await udel(id)}catch(_){}return}
  (L[UPK]=L[UPK]||[]).push(m);save();await uregister(UPK,m);closeSheet();LIBT=UPK;LIBQ="";libOpen();toast((zh?"已加入我的素材 · 扣 💎":"Added · 💎")+price+(zh?" · 点 ▶ 试试":" · tap ▶ to try"));return}},true);
document.addEventListener("change",e=>{if(e.target&&e.target.id==="upFile"){UPFILE=e.target.files&&e.target.files[0]||null;const n=$("#upFileN");if(n&&UPFILE)n.textContent=UPFILE.name+" · "+(UPFILE.size/1048576).toFixed(1)+"MB";const b=$("#upSaveBtn");if(b)b.textContent=(CL()==="zh"?"保存到我的素材":"Save to my library")+" · 💎"+upPrice()}});
/* the library screen: an upload button and "mine" badges */
const _libOpen66=libOpen;libOpen=function(){_libOpen66();try{const zh=CL()==="zh";const q=$("#libQ");if(q&&!$(".up66btn"))q.insertAdjacentHTML("beforebegin",'<button class="up66btn" data-upopen="'+LIBT+'">＋ '+({mg:zh?"用模板做我的游戏":"Make my own game",bgm:zh?"上传我的 BGM":"Upload my BGM",fx:zh?"上传我的特效":"Upload my effect",sfx:zh?"上传我的音效":"Upload my sound"}[LIBT])+'</button>');
 const L=myLib()[LIBT]||[];document.querySelectorAll("[data-libtry]").forEach(b=>{const id=b.dataset.libtry;if(L.some(m=>m.id===id)&&!b.querySelector(".up66mine")){b.insertAdjacentHTML("afterbegin",'<i class="up66mine">'+(zh?"我的":"Mine")+'</i>');b.insertAdjacentHTML("beforeend",'<span class="up66del" data-updel="'+LIBT+"|"+id+'">🗑</span>')}})}catch(_){}};
/* uploaded BGM: play the file directly when tried from the library */
const _bgmPlay66=bgmPlay;bgmPlay=function(mood,wid){if(/^u_bgm_/.test(mood)&&window.BGM_FILES&&BGM_FILES[mood]){try{bgmStop()}catch(_){}const a=new Audio(BGM_FILES[mood]);a.loop=true;a.volume=.5;a.play().catch(()=>{});BGM.ufile=a;BGM.mood=mood;return}return _bgmPlay66(mood,wid)};
const _bgmStop66=bgmStop;bgmStop=function(k){try{if(BGM.ufile){BGM.ufile.pause();BGM.ufile=null}}catch(_){}return _bgmStop66(k)};
(function(){const st=document.createElement("style");st.textContent=`
.up66btn{display:block;width:100%;margin:0 0 8px;padding:11px;border-radius:12px;border:1px dashed rgba(240,183,126,.6);background:rgba(240,183,126,.08);color:#F6D3AE;font-size:14px;font-weight:700}
.up66 h2{margin:0 0 8px}.up66seg{display:flex;gap:6px}.up66seg.wrap{flex-wrap:wrap}.up66seg button{flex:1;min-width:30%;padding:8px 6px;border-radius:10px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#ddd;font-size:12.5px}.up66seg button.on{border-color:#F0B77E;background:rgba(240,183,126,.15);color:#F6D3AE}
.up66l{display:block;font-size:12.5px;color:#C9BFD6;margin:12px 0 5px}.up66l small{color:#8F86A0;font-weight:400}.up66i{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);color:#fff;font-size:14px}
.up66file{display:block;padding:14px;border-radius:12px;border:1px dashed rgba(255,255,255,.25);text-align:center;color:#ddd;font-size:13px;cursor:pointer}
.up66ok{display:flex;gap:8px;align-items:flex-start;font-size:12px;color:#C9BFD6;margin:14px 0 6px;line-height:1.5}
.up66mine{font-style:normal;font-size:10px;padding:2px 6px;border-radius:6px;background:#7FC4A6;color:#0f1a15;font-weight:800;align-self:flex-start}.up66del{font-size:14px;padding:4px}
.fxu-cover{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;animation:fxucv 2.6s ease-in-out}@keyframes fxucv{0%{opacity:0;transform:scale(1.04)}20%,75%{opacity:.92}100%{opacity:0}}
.fxu-p{position:absolute;top:-60px;animation:fxufall linear forwards}@keyframes fxufall{to{transform:translate(var(--dx),calc(100vh + 120px)) rotate(var(--rot))}}`;document.head.appendChild(st)})();
/* my uploads first */
const _libItems66=libItems;libItems=function(){const L=_libItems66();return L.filter(x=>/^u_/.test(x.id)).reverse().concat(L.filter(x=>!/^u_/.test(x.id)))};
