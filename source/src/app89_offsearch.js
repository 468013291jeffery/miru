/* ================= v4.7 · OFFICIAL STORIES IN SEARCH =================
   Stories published from the admin "剧本生产" studio live on the server until someone opens them, so the tag search
   (which only looked at stories already on the device) couldn't find them. Now search also matches the server's
   official/featured list by title, hook and tags; tapping one installs and opens it. */
const OFF89={list:[],at:0,busy:null};
function off89Load(){if(typeof CL0==="undefined"||!CL0.on)return Promise.resolve([]);if(Date.now()-OFF89.at<120000)return Promise.resolve(OFF89.list);
 if(OFF89.busy)return OFF89.busy;OFF89.busy=capi("/works?feed=featured&limit=50").then(r=>{if(r.ok){OFF89.list=(r.j.works||[]).filter(w=>w.featured);OFF89.at=Date.now()}return OFF89.list}).catch(()=>OFF89.list).finally(()=>{OFF89.busy=null});return OFF89.busy}
function off89Installed(id){const x=S.off76&&S.off76[id];return !!(x&&wd(x.wid))}
function off89Card(w){return '<button class="gcard" data-cwork="'+esc(w.id)+'"><div class="art" style="aspect-ratio:3/4">'+(w.cover?'<img src="'+esc(w.cover)+'" alt="">':'<div class="off89ph">📖</div>')+'<span class="dramab">✦ MIRU</span></div>'+
 '<div class="b"><b>'+esc(w.title||"")+'</b><p class="s">'+esc(w.hook||"")+'</p><div class="m">▶ '+fmtN(w.plays||0)+' · ♥ '+fmtN(w.likes||0)+'</div></div></button>'}
const _renderDiscRes89=renderDiscRes;
renderDiscRes=function(){const r=_renderDiscRes89.apply(this,arguments);try{if(disc.mode!=="stories")return r;const my=(OFF89.seq=(OFF89.seq||0)+1);
 off89Load().then(L=>{if(OFF89.seq!==my)return;const host=$("#discRes");if(!host||!L.length)return;
  const hit=L.filter(w=>!off89Installed(w.id)&&orOK({or:w.orient||"all"})&&discMatch(w.tags||[],(w.title||"")+" "+(w.hook||"")+" "+(w.author||""),[]));if(!hit.length)return;
  const grid=host.querySelector(".grid2"),empty=host.querySelector(".empty");
  if(grid)grid.insertAdjacentHTML("afterbegin",hit.map(off89Card).join(""));else if(empty)empty.outerHTML='<div class="grid2" style="padding-bottom:24px">'+hit.map(off89Card).join("")+'</div>';
  const b=host.querySelector(".row b.sm");if(b){const n=(grid?grid.querySelectorAll(".gcard").length:hit.length);b.textContent=t("disc.results",{n})}})}catch(_){}return r};
setTimeout(()=>{try{off89Load()}catch(_){}},3000);
(function(){const st=document.createElement("style");st.textContent=`.off89ph{width:100%;height:100%;display:grid;place-items:center;font-size:40px;background:linear-gradient(160deg,#2a1d2c,#120f18)}`;document.head.appendChild(st)})();
