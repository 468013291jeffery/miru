/* ---- MIRU media: per-scene backgrounds, cover, character looks — upload or AI, chosen in the guide ---- */
const MKEYS={bg:['🌆','场景背景'],cover:['🖼️','故事封面'],face:['👤','角色形象'],video:['🎬','开场视频']};
const MBUSY={};
function mScenes(){try{return getStory().nodes.map(n=>({id:n.id,title:n.title||n.id,text:String(((n.opening||[])[0]||{}).text||'').replace(/^【[^】]*】\s*/,'')}))}catch(_){return []}}
function mCast(){return [{id:'lead',name:p.lead?.name||'主角',role:p.lead?.role||'',pers:p.lead?.personality||''},{id:'support',name:p.support?.name||'配角',role:p.support?.role||'',pers:p.support?.personality||''},...(p.extraCast||[]).map(c=>({id:c.id,name:c.name,role:c.role,pers:c.personality||''}))]}
function mStore(){p.media=p.media||{};p.media.bgs=p.media.bgs||{};p.media.faces=p.media.faces||{};return p.media}
function mPrice(k){return MB().price?MB().price(k==='face'?'portrait':k==='cover'?'cover':'bg'):3}
function mSrc(){if(!p.mediaSrc){const v=(p.mediaPlan||[]).join(' ');p.mediaSrc={bg:'ai',cover:'ai',face:'ai',video:/视频/.test(v)?'ai':'later'}}return p.mediaSrc}
function mSummary(){const s=mSrc(),L={ai:'AI 生成',up:'自己上传',later:'稍后'};return Object.keys(MKEYS).map(k=>MKEYS[k][1]+'：'+L[s[k]])}
function mCount(){const m=mStore(),sc=mScenes(),cast=mCast();return {bg:[sc.filter(x=>m.bgs[x.id]).length,sc.length],cover:[m.cover?.src?1:0,1],face:[cast.filter(c=>m.faces[c.id]).length,cast.length]}}
function mediaStepHTML(){const s=mSrc();wizard.selections.mediaSrc=mSummary();const sc=mScenes(),cast=mCast(),cnt=mCount();
 const rows=[['bg',`${sc.length} 个场景各一张，剧情切到哪个场景就换哪张`],['cover','发现页和分享卡片上的封面'],['face',cast.map(c=>c.name).join('、')],['video','先出分镜脚本，发布后制作']];
 return `<div class="mstep">${rows.map(([k,d])=>{const v=s[k],n=k==='bg'?sc.length:k==='face'?cast.length:1,pr=k==='video'?30:mPrice(k)*n,c=cnt[k];
  return `<div class="mrow"><div class="mhd"><b>${MKEYS[k][0]} ${MKEYS[k][1]}</b>${c?`<em>${c[0]}/${c[1]}</em>`:''}<small>${esc(d)}</small></div><div class="mseg">${k!=='video'?`<button data-msrc="${k}|up" class="${v==='up'?'on':''}">📤 自己上传</button>`:''}<button data-msrc="${k}|ai" class="${v==='ai'?'on':''}">✨ AI 生成 · ${pr?'💎'+pr:'免费'}</button><button data-msrc="${k}|later" class="${v==='later'?'on':''}">稍后</button></div>${v==='up'?`<label class="mup">📤 选择图片${k==='cover'?'':'（可多选，按顺序对应'+(k==='bg'?'场景':'角色')+'）'}<input type="file" accept="image/*" ${k==='cover'?'':'multiple'} data-mup="${k}" hidden></label>`:''}</div>`}).join('')}<p class="mnote">选「AI 生成」的，在「素材」页一键生成或逐张生成，成功才扣钻石。任何时候都可以换成自己上传。</p></div>`}
function mShrink(file,maxW){return new Promise((res,rej)=>{const u=URL.createObjectURL(file),im=new Image();im.onload=()=>{const W=Math.min(maxW,im.width),H=Math.round(im.height*W/im.width),H2=Math.min(H,Math.round(W*2)),c=document.createElement('canvas');c.width=W;c.height=H2;const x=c.getContext('2d');x.drawImage(im,0,(H-H2)/2*(im.width/W)*0,im.width,im.height*(H2/H),0,0,W,H2);URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',.78))};im.onerror=()=>{URL.revokeObjectURL(u);rej()};im.src=u})}
function mPut(kind,id,src){const m=mStore();if(kind==='bg')m.bgs[id]=src;else if(kind==='face')m.faces[id]=src;else m.cover={src,at:Date.now()}}
function mDel(kind,id){const m=mStore();if(kind==='bg')delete m.bgs[id];else if(kind==='face')delete m.faces[id];else delete m.cover}
function mCtx(kind,id){if(kind==='bg'){const n=mScenes().find(x=>x.id===id)||{};return {kind,title:n.title,text:n.text,world:p.world,style:p.imageStyle,genre:p.genre}}
 if(kind==='face'){const c=mCast().find(x=>x.id===id)||{};return {kind,name:c.name,role:c.role,pers:c.pers,style:p.imageStyle,genre:p.genre,world:p.world}}return {kind,title:p.title,hook:p.hook,world:p.world,style:p.imageStyle,genre:p.genre}}
async function mGen(spec){const [kind,id]=spec.split(':');if(MBUSY[spec])return;const B=MB();if(!B.genP)return toast('请在 MIRU 里打开创作中心');
 MBUSY[spec]=1;render();const r=await B.genP(kind==='face'?'portrait':kind,mCtx(kind,id));delete MBUSY[spec];
 if(r&&r.src){mPut(kind,id,r.src);save();render();toast('✓ 已生成 · 扣 💎'+r.cost)}else{render();toast(r&&r.err==='nosvc'?'AI 绘图服务没连上（登录 Claude 后可用），可以先自己上传':r&&r.err==='nogems'?'钻石不足，回 MIRU 充值':'没生成出来，没有扣费')}}
function mMissing(){const s=mSrc(),m=mStore(),L=[];if(s.bg!=='up')mScenes().forEach(x=>{if(!m.bgs[x.id])L.push('bg:'+x.id)});if(s.cover!=='up'&&!m.cover?.src)L.push('cover');if(s.face!=='up')mCast().forEach(c=>{if(!m.faces[c.id])L.push('face:'+c.id)});return L}
function mMissingCost(L){return L.reduce((a,x)=>a+mPrice(x.split(':')[0]),0)}
async function mGenAll(){const L=mMissing();if(!L.length)return toast('都齐了');for(const x of L){await mGen(x);if(!mStore()||(MB().gems&&MB().gems()<mPrice(x.split(':')[0])))break}}
function mCard(kind,id,title,sub,src){const spec=kind+(id?':'+id:''),busy=MBUSY[spec],pr=mPrice(kind);
 return `<div class="mcard"><div class="mthumb ${kind}">${src?`<img src="${src}" alt="">`:busy?'<span class="mspin">⏳</span>':`<span>${MKEYS[kind][0]}</span>`}</div><div class="mbody"><b>${esc(title)}</b>${sub?`<small>${esc(String(sub).slice(0,60))}</small>`:''}<div class="mbtns"><label class="mb">📤 上传<input type="file" accept="image/*" data-mup="${spec}" hidden></label><button class="mb ai" data-mgen="${spec}" ${busy?'disabled':''}>${busy?'生成中…':'✨ AI · 💎'+pr}</button>${src?`<button class="mb x" data-mdel="${spec}">✕</button>`:''}</div></div></div>`}
function assetsView2(){const m=mStore(),sc=mScenes(),cast=mCast(),miss=mMissing(),cost=mMissingCost(miss),cnt=mCount();
 return `<div class="panelTop"><div><h2>🎬 素材</h2><p>每样都可以自己上传，或让 AI 生成（成功才扣钻石）。</p></div><div class="gem">💎 ${MG()}</div></div><div class="section">
 ${miss.length?`<button class="btn primary full" data-mgenall="1">✨ 一键生成缺少的 ${miss.length} 张 · 💎${cost}</button><p class="mnote" style="text-align:center">选了「自己上传」的不会被 AI 生成</p>`:'<div class="helpOverlay">✓ 图片素材都齐了</div>'}
 <div class="sectionTitle">🌆 场景背景 <em class="mcnt">${cnt.bg[0]}/${cnt.bg[1]}</em></div><p class="mnote">每个场景一张，剧情切到这个场景时自动换背景。可一次选多张，按顺序填进还空着的场景。</p>
 <label class="btn full mupall">📤 批量上传场景图<input type="file" accept="image/*" multiple data-mup="bg" hidden></label>
 <div class="mlist">${sc.map(x=>mCard('bg',x.id,x.title,x.text,m.bgs[x.id])).join('')}</div>
 <div class="sectionTitle">🖼️ 故事封面</div><div class="mlist">${mCard('cover','','封面',p.title,m.cover?.src)}</div>
 <div class="sectionTitle">👤 角色形象 <em class="mcnt">${cnt.face[0]}/${cnt.face[1]}</em></div><div class="mlist">${cast.map(c=>mCard('face',c.id,c.name,c.role,m.faces[c.id])).join('')}</div>
 <div class="sectionTitle">🎬 视频 · 🎙 音色 · ✨ 特效</div><div class="assetList">${D.ASSETS.map(a=>`<div class="assetLine"><div class="assetEmoji">${a.icon}</div><div class="assetBody"><b>${esc(a.title)}</b><span>${esc(a.detail)}</span>${p.media?.[a.id]?'<span style="color:#8bd5c4">✓ 已加入制作计划</span>':''}</div><button class="btn sm primary" data-asset="${a.id}">${a.cost?'💎 '+a.cost:'免费'}</button></div>`).join('')}</div>${p.media?.video?$btn('video-demo','▶ 看 10 秒开场分镜','btn primary full'):''}</div>`}
document.addEventListener('click',e=>{let b;
 if(b=e.target.closest('[data-msrc]')){const [k,v]=b.dataset.msrc.split('|');mSrc()[k]=v;wizard.selections.mediaSrc=mSummary();save();render();return}
 if(b=e.target.closest('[data-mgen]')){mGen(b.dataset.mgen);return}
 if(e.target.closest('[data-mgenall]')){mGenAll();return}
 if(b=e.target.closest('[data-mdel]')){const [k,id]=b.dataset.mdel.split(':');mDel(k,id);save();render();return}});
document.addEventListener('change',async e=>{const spec=e.target.dataset&&e.target.dataset.mup;if(!spec)return;const files=[...(e.target.files||[])];if(!files.length)return;const [kind,id]=spec.split(':');const m=mStore();let n=0;
 try{if(id||kind==='cover'){mPut(kind,id,await mShrink(files[0],kind==='face'?600:720));n=1}
  else{const slots=kind==='bg'?mScenes().map(x=>x.id):mCast().map(c=>c.id),have=kind==='bg'?m.bgs:m.faces;let free=slots.filter(x=>!have[x]);if(free.length<files.length)free=free.concat(slots.filter(x=>have[x]));
   for(let i=0;i<files.length&&i<free.length;i++){mPut(kind,free[i],await mShrink(files[i],kind==='face'?600:720));n++}}
  save();render();toast('已上传 '+n+' 张')}catch(_){toast('这张图读不出来，换一张试试')}});
