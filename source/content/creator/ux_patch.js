/* ---- Creator adjustments from the meeting notes ----
   1 · 故事编辑 sits in the middle: centre tab of the bottom bar, and folded into the AI guide as a drawer (preview + prompt).
   2 · 专业版 without JSON: conditions and outcomes are written as plain sentences (如果… / 选了以后…), JSON is hidden under 高级.
       The story map is drawn as a branching chart you can tap.
   3 · 素材管理: script-upload entry and 我的作品 always one tap away.
   4 · 引导: 「换一换」 refreshes the option set (live AI when connected), 「自定义填表」 shows every question on one page,
       and a new question asks how the story should be told (补充故事讲法). */
names.gform=['📝','自定义填表'];
const MET={trust:'信任',attraction:'吸引',tension:'张力',jealousy:'嫉妒',resentment:'旧恨'};
let UX_DRAWER=false;
/* ---------- 1 · bottom bar + header ---------- */
navbottom=function(){const it=[['guide','✨','AI引导'],['assets','🎬','素材'],['draft','✒️','故事编辑'],['pro','⌘','专业版'],['preview','▶','试玩']];
 return `<nav class="footerNav uxNav">${it.map(([k,i,l])=>`<button data-nav="${k}" class="${tab===k||(k==='guide'&&tab==='gform')?'active':''} ${k==='draft'?'uxMid':''}"><b>${i}</b>${l}</button>`).join('')}</nav>`};
const _header_ux=header;header=function(){return _header_ux().replace('<button class="btn sm" data-action="mobile-menu">','<button class="btn sm" data-nav="works" title="我的作品">🗂</button><button class="btn sm" data-action="mobile-menu">')};
/* ---------- 1 · story editor folded into the guide ---------- */
function uxDrawer(){return `<details class="uxDrawer" ${UX_DRAWER?'open':''}><summary data-ux-drawer="1">📖 故事编辑 · 预览与提示词 <small>${esc((p.title||'').slice(0,16))}</small></summary><div class="uxDrawerBody">${field('故事标题','title')}${field('一句话钩子','hook','textarea')}${field('故事简介','premise','textarea')}${field('核心矛盾','conflict','textarea')}<div class="uxRow"><button class="btn sm" data-ux-go="draft|story">完整编辑</button><button class="btn sm" data-ux-go="draft|prompt">看提示词</button><button class="btn sm primary" data-action="preview">▶ 试玩</button></div></div></details>`}
const _guide_ux=guide;guide=function(){let h=_guide_ux();const step=steps[wizard.step]||{};
 const top=`<div class="uxModes"><button class="${tab==='guide'?'on':''}" data-nav="guide">一步步问</button><button data-nav="gform">📝 自定义填表</button></div>`;
 h=h.replace('<div class="wizardShell">','<div class="wizardShell">'+top);
 h=h.replace(/<div class="wizardBottom">/,uxDrawer()+'<div class="wizardBottom">');
 h=h.replace('↻ 换个灵感','↻ 换一换').replace('📎 上传参考文件','📎 文件').replace('🎤 语音输入','🎤');
 /* every step gets its own confirm right under the input — typing then 「确认，下一步」 commits the answer */
 h=h.replace(/(data-action="wizard-inspire">↻ 换一换<\/button><\/div>)/,'$1<button class="btn primary full wizConfirm" data-action="wizard-next">✓ 确认，下一步</button>');
 return h};
/* ---------- 4 · 补充故事讲法 ---------- */
const _fill_ux=fillGuideData;fillGuideData=function(step,answer){_fill_ux(step,answer);if(step.key==='narration'){p.narration=String(answer||'');p.guided ||= {};}};
/* ---------- 4 · 换一换: new option set ---------- */
const UX_POOL={concept:['凌晨三点，我的室友在阳台上和一个不存在的人说话','我被雇来假扮一个男人的未婚夫，只有一周','我继承的旧公寓里，墙上有人刻了我的名字','我替死对头顶了罪，他却来探监','婚礼前夜，伴郎把戒指放进了我的口袋','我是夜班急诊医生，他每周三都"不小心"受伤'],
 world:['波士顿冬夜的公寓楼','拉斯维加斯通宵赌场的顶层','西雅图雨季的码头仓库','新奥尔良的老唱片店','阿拉斯加封路的科研站','纽约上东区的私人俱乐部'],
 opening:['他把一份写着我名字的遗嘱放在桌上','停电的电梯里只有我们两个','我在他的手机里看到了自己的照片','他敲错了门，却说"就是你"','葬礼上，一个陌生人叫出了我的小名']};
let UX_BUSY=false;
async function uxShuffle(){const st=steps[wizard.step];if(!st||st.type==='review')return;const B=MB();
 if(st.chips&&st.chips.length&&B.ask&&!UX_BUSY){UX_BUSY=true;toast('正在换一批选项…');let r=null;try{r=await B.ask('/api/options',{question:st.title,current:st.chips,previous:JSON.stringify(p.guided||{}).slice(0,1500),project:p,multi:st.type==='multi'})}catch(_){}UX_BUSY=false;
  if(r&&Array.isArray(r.options)&&r.options.length>=3){st.chips=r.options.slice(0,10).map(x=>String(x).slice(0,40));wizard.altChips ||= {};wizard.altChips[st.key]=st.chips;save();render();return toast('已换一批')}}
 const pool=UX_POOL[st.key];if(pool&&st.chips){const cur=new Set(st.chips),fresh=pool.filter(x=>!cur.has(x));if(fresh.length){st.chips=fresh.slice(0,6).concat(st.chips.slice(0,Math.max(0,6-fresh.length)));wizard.altChips ||= {};wizard.altChips[st.key]=st.chips;save();render();return toast('已换一批')}}
 wizard.custom[st.key]=wizardAIExample(st);save();render();toast('已换一个灵感，可以再改')}
/* ---------- 4 · 自定义填表 ---------- */
function gformView(){const qs=steps.filter(s=>s.type!=='review'&&s.type!=='media');let lastG='';
 return `<div class="wizardShell uxForm"><div class="uxModes"><button data-nav="guide">一步步问</button><button class="on" data-nav="gform">📝 自定义填表</button></div><p class="uxHint">所有问题一页填完；不想填的留空，AI 会按前面的回答补齐。</p>${qs.map(s=>{const i=steps.indexOf(s),sel=wizard.selections?.[s.key]||[],g=s.group!==lastG?`<h3 class="uxG">${esc(s.group)}</h3>`:'';lastG=s.group;
  return `${g}<div class="uxQ"><b>${esc(s.title)}${s.type==='multi'?' <em>可多选</em>':''}</b>${s.chips?.length?`<div class="uxChips">${s.chips.map(c=>`<button class="${sel.includes(c)?'on':''}" data-gf-chip="${i}|${esc(c)}">${esc(c)}</button>`).join('')}</div>`:''}<textarea rows="2" data-gf-text="${i}" placeholder="${s.chips?.length?'其他想法（可选）':'写下你的想法'}">${esc(wizard.custom?.[s.key]||'')}</textarea></div>`}).join('')}
 <div class="wizardBottom"><button class="btn" data-nav="guide">← 回到一步步问</button><button class="btn primary" data-ux-gsave="1">保存全部 →</button></div></div>`}
const _view_ux=view;view=function(){if(tab==='gform')return gformView();return _view_ux()};
function uxSaveForm(){for(const s of steps){if(s.type==='review'||s.type==='media')continue;const i=steps.indexOf(s),t=Q(`[data-gf-text="${i}"]`);if(t)wizard.custom[s.key]=t.value;const v=wizardValue(s);if(v){wizard.answers[i]=v;try{fillGuideData(s,v)}catch(_){}}}
 wizard.step=steps.length-1;wizard.complete=true;save();makeEngine();tab='guide';render();window.scrollTo(0,0);toast('已保存，看看总览')}
/* ---------- 2 · plain-language conditions and outcomes ---------- */
function uxCast(){return [['lead',p.lead?.name||'主角'],['support',p.support?.name||'配角'],...(p.extraCast||[]).map(c=>[c.id,c.name])]}
function uxReqRows(c){const f=(c.requires&&c.requires.flags)||{};return Object.entries(f).map(([k,v])=>({k,v}))}
function uxEffRows(c){const e=c.effects||{},out=[];Object.entries(e.flags||{}).forEach(([k,v])=>out.push({t:'flag',k,v}));Object.entries(e.relationships||{}).forEach(([k,v])=>{const [a,m]=k.split('.');out.push({t:'rel',a,m,v})});return out}
function uxSentence(c){const r=uxReqRows(c),e=uxEffRows(c),nm=Object.fromEntries(uxCast());
 const cond=r.length?'当 '+r.map(x=>`「${x.k}」${x.v?'已发生':'没发生'}`).join(' 且 ')+' 时才出现':'一直出现';
 const res=e.length?e.map(x=>x.t==='flag'?(x.v?`记下「${x.k}」`:`取消「${x.k}」`):`${nm[x.a]||x.a}的${MET[x.m]||x.m} ${x.v>0?'+':''}${x.v}`).join('，'):'不改变数值';
 return `${cond}；选了以后：${res}；然后去「${esc(c.next)}」。`}
function uxFlagOpts(){const s=new Set();for(const n of getStory().nodes)for(const c of n.choices||[]){Object.keys(c.effects?.flags||{}).forEach(k=>s.add(k));Object.keys(c.requires?.flags||{}).forEach(k=>s.add(k))}return [...s]}
proChoices=function(){const story=getStory(),node=story.nodes.find(x=>x.id===currentScene)||story.nodes[0],cast=uxCast(),flags=uxFlagOpts();
 const dl=`<datalist id="uxFlags">${flags.map(f=>`<option value="${esc(f)}">`).join('')}</datalist>`;
 const reqRow=(cid,x)=>`<div class="uxL" data-req-row="${cid}">如果 <input list="uxFlags" data-k value="${esc(x.k||'')}" placeholder="事件名，如 已核验证据"> <select data-v><option value="1" ${x.v!==false?'selected':''}>已发生</option><option value="0" ${x.v===false?'selected':''}>没发生</option></select><button class="uxX" data-ux-del="1">✕</button></div>`;
 const effRow=(cid,x)=>x.t==='rel'?`<div class="uxL" data-eff-row="${cid}" data-t="rel"><select data-a>${cast.map(([id,n])=>`<option value="${id}" ${x.a===id?'selected':''}>${esc(n)}</option>`).join('')}</select> 的 <select data-m>${Object.entries(MET).map(([k,l])=>`<option value="${k}" ${x.m===k?'selected':''}>${l}</option>`).join('')}</select> <input type="number" data-n value="${Number(x.v)||0}" style="width:64px"><button class="uxX" data-ux-del="1">✕</button></div>`
  :`<div class="uxL" data-eff-row="${cid}" data-t="flag"><select data-v><option value="1" ${x.v!==false?'selected':''}>记下</option><option value="0" ${x.v===false?'selected':''}>取消</option></select> <input list="uxFlags" data-k value="${esc(x.k||'')}" placeholder="事件名"><button class="uxX" data-ux-del="1">✕</button></div>`;
 return `<div class="section">${dl}<h3>🔀 分支条件 · 用文字写逻辑</h3><p class="muted">不用写代码：每个选项写清楚「什么时候出现」和「选了以后会怎样」。由程序执行，AI 不能擅自改。</p><div class="thinCard"><label>当前场景</label><select id="proChoiceScene">${story.nodes.map(n=>`<option value="${n.id}" ${n.id===node.id?'selected':''}>${esc(n.title)}</option>`).join('')}</select></div>
 ${node.choices.map(c=>`<div class="thinCard uxC" data-ux-choice="${esc(c.id)}"><h4>${esc(c.text)}</h4><p class="uxSent">${uxSentence(c)}</p>
  <div class="uxBlk"><b>什么时候出现</b>${uxReqRows(c).map(x=>reqRow(c.id,x)).join('')}<button class="btn sm ghost" data-ux-add="req|${esc(c.id)}">＋ 加一个条件</button></div>
  <div class="uxBlk"><b>选了以后</b>${uxEffRows(c).map(x=>effRow(c.id,x)).join('')}<button class="btn sm ghost" data-ux-add="rel|${esc(c.id)}">＋ 关系变化</button><button class="btn sm ghost" data-ux-add="flag|${esc(c.id)}">＋ 记下一件事</button></div>
  <details class="uxAdv"><summary>高级（给开发看）</summary><textarea rows="4" class="codeEdit" readonly>${esc(JSON.stringify({requires:c.requires||{},effects:c.effects||{}},null,1))}</textarea></details></div>`).join('')}
 ${node.choices.length?'<button class="btn primary full" data-ux-save-logic="1">保存这一场的全部逻辑</button>':'<p>这是结局节点，没有后续选择。</p>'}</div>`};
function uxCollect(cid,old){const req={},eff={};const keepFlags={...(old.requires||{})};delete keepFlags.flags;
 document.querySelectorAll(`[data-req-row="${CSS.escape(cid)}"]`).forEach(r=>{const k=r.querySelector('[data-k]').value.trim();if(k)req[k]=r.querySelector('[data-v]').value==='1'});
 const ef={},rel={};document.querySelectorAll(`[data-eff-row="${CSS.escape(cid)}"]`).forEach(r=>{if(r.dataset.t==='rel'){const n=Number(r.querySelector('[data-n]').value)||0;if(n){const kk=r.querySelector('[data-a]').value+'.'+r.querySelector('[data-m]').value;rel[kk]=Math.max(-20,Math.min(20,(rel[kk]||0)+n))}}else{const k=r.querySelector('[data-k]').value.trim();if(k)ef[k]=r.querySelector('[data-v]').value==='1'}});
 const out={...old};out.requires={...keepFlags};if(Object.keys(req).length)out.requires.flags=req;const e2={...(old.effects||{})};delete e2.flags;delete e2.relationships;if(Object.keys(ef).length)e2.flags=ef;if(Object.keys(rel).length)e2.relationships=rel;out.effects=e2;return out}
function uxSaveLogic(){const original=clone(p.advanced.scenes||[]);try{const story=getStory(),n=story.nodes.find(x=>x.id===currentScene);if(!n)return toast('场景不存在');let o=p.advanced.scenes.find(x=>x.id===currentScene);if(!o){o={id:currentScene};p.advanced.scenes.push(o)}
  o.choices=clone(o.choices||n.choices).map(c=>uxCollect(c.id,c));const v=window.MiruValidate(getStory());if(!v.valid)throw Error(v.errors[0]);save();makeEngine();render();toast('已保存这一场的逻辑')}catch(e){p.advanced.scenes=original;toast('保存失败：'+e.message)}}
/* ---------- 2 · branching chart ---------- */
function uxChart(){const st=getStory(),N=st.nodes,by=Object.fromEntries(N.map(n=>[n.id,n])),depth={},q=[[N[0].id,0]];depth[N[0].id]=0;
 while(q.length){const [id,d]=q.shift();for(const c of (by[id]?.choices||[]))if(by[c.next]&&depth[c.next]===undefined){depth[c.next]=d+1;q.push([c.next,d+1])}}
 let maxD=Math.max(0,...Object.values(depth));N.forEach(n=>{if(depth[n.id]===undefined)depth[n.id]=++maxD});
 const rows={};N.forEach(n=>(rows[depth[n.id]] ||= []).push(n));const W=340,BW=96,BH=40,GY=74,pos={};
 Object.entries(rows).forEach(([d,arr])=>arr.forEach((n,i)=>{const gap=W/(arr.length);pos[n.id]={x:gap*i+gap/2-BW/2,y:Number(d)*GY+8}}));
 const H=(Math.max(...Object.keys(rows).map(Number))+1)*GY+10;let lines='';
 N.forEach(n=>(n.choices||[]).forEach(c=>{const a=pos[n.id],b=pos[c.next];if(!a||!b)return;const x1=a.x+BW/2,y1=a.y+BH,x2=b.x+BW/2,y2=b.y;const cond=c.requires&&c.requires.flags&&Object.keys(c.requires.flags).length;
  lines+=`<path d="M${x1},${y1} C${x1},${(y1+y2)/2} ${x2},${(y1+y2)/2} ${x2},${y2-4}" fill="none" stroke="${cond?'#f4bc8d':'#8a7a99'}" stroke-width="1.4" ${cond?'stroke-dasharray="4 3"':''} marker-end="url(#uxArr)"/>`}));
 const boxes=N.map(n=>{const P=pos[n.id],end=n.type==='ending';return `<button class="uxNode ${n.id===currentScene?'on':''} ${end?'end':''}" data-scene="${n.id}" style="left:${P.x}px;top:${P.y}px;width:${BW}px;height:${BH}px">${esc(String(n.title||n.id).replace(/^第\d+章 · /,'').slice(0,12))}</button>`}).join('');
 return `<div class="thinCard"><h4>剧情分支图 · ${N.length} 个场景</h4><p class="small muted">点场景就能编辑；虚线 = 有出现条件的选项；红框 = 结局。</p><div class="uxChartWrap"><div class="uxChart" style="width:${W}px;height:${H}px"><svg width="${W}" height="${H}"><defs><marker id="uxArr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#8a7a99"/></marker></defs>${lines}</svg>${boxes}</div></div></div>`}
const _proGraph_ux=proGraph;proGraph=function(){return _proGraph_ux().replace(/<div class="thinCard"><h4>剧情地图[\s\S]*?<\/div><\/div>/,uxChart()).replace(/<button class="btn sm primary" data-action="export"\s*>⇩ JSON<\/button>/,'').replace('这里给 MIRU 编剧和研发','编剧用的结构编辑器')};
/* ---------- 3 · works: script upload + drafts ---------- */
const _works_ux=worksView;worksView=function(){return _works_ux().replace('<div class="section">','<div class="section"><div class="thinCard uxUp"><h4>📄 上传剧本文件</h4><p class="small">.md / .txt / .docx / .doc / .pdf，按 MIRU 标准格式转成能玩的剧。</p><button class="btn primary full" data-ux-import="1">选择文件上传</button></div>')};
/* ---------- events ---------- */
document.addEventListener('click',e=>{let b;
 if(e.target.closest('[data-ux-drawer]')){setTimeout(()=>{const d=Q('.uxDrawer');UX_DRAWER=!!(d&&d.open)},0);return}
 if(b=e.target.closest('[data-ux-go]')){const [t,sub]=b.dataset.uxGo.split('|');draftTab=sub;setTab(t);return}
 if(e.target.closest('[data-action="wizard-inspire"]')){e.stopImmediatePropagation();uxShuffle();return}
 if(b=e.target.closest('[data-gf-chip]')){const [i,c]=b.dataset.gfChip.split(/\|(.*)/s);const s=steps[+i];const arr=wizard.selections[s.key]||[];wizard.selections[s.key]=s.type==='multi'?(arr.includes(c)?arr.filter(x=>x!==c):[...arr,c]):(arr.includes(c)?[]:[c]);
  document.querySelectorAll(`[data-gf-chip^="${i}|"]`).forEach(x=>x.classList.toggle('on',wizard.selections[s.key].includes(x.dataset.gfChip.split(/\|(.*)/s)[1])));save();return}
 if(e.target.closest('[data-ux-gsave]')){uxSaveForm();return}
 if(b=e.target.closest('[data-ux-add]')){const [t,cid]=b.dataset.uxAdd.split('|');const html=t==='req'?`<div class="uxL" data-req-row="${cid}">如果 <input list="uxFlags" data-k placeholder="事件名"> <select data-v><option value="1">已发生</option><option value="0">没发生</option></select><button class="uxX" data-ux-del="1">✕</button></div>`
   :t==='rel'?`<div class="uxL" data-eff-row="${cid}" data-t="rel"><select data-a>${uxCast().map(([id,n])=>`<option value="${id}">${esc(n)}</option>`).join('')}</select> 的 <select data-m>${Object.entries(MET).map(([k,l])=>`<option value="${k}">${l}</option>`).join('')}</select> <input type="number" data-n value="5" style="width:64px"><button class="uxX" data-ux-del="1">✕</button></div>`
   :`<div class="uxL" data-eff-row="${cid}" data-t="flag"><select data-v><option value="1">记下</option><option value="0">取消</option></select> <input list="uxFlags" data-k placeholder="事件名"><button class="uxX" data-ux-del="1">✕</button></div>`;b.insertAdjacentHTML('beforebegin',html);return}
 if(b=e.target.closest('[data-ux-del]')){b.closest('.uxL')?.remove();return}
 if(e.target.closest('[data-ux-save-logic]')){uxSaveLogic();return}
 if(e.target.closest('[data-ux-import]')){const B=MB();if(B.importScript)B.importScript();else toast('请在 MIRU 里打开创作中心');return}},true);
try{if(wizard.altChips)for(const s of steps)if(wizard.altChips[s.key])s.chips=wizard.altChips[s.key]}catch(_){}
(function(){const st=document.createElement('style');st.textContent=`
.uxNav button.uxMid b{display:grid;place-items:center;width:46px;height:46px;margin:-22px auto 2px;border-radius:50%;background:linear-gradient(135deg,#f4bc8d,#f59ba9);color:#1a1016;font-size:20px;box-shadow:0 6px 18px #0008}.uxNav button.uxMid{color:#f7d2a8;font-weight:800}
.uxModes{display:flex;gap:6px;margin:0 0 8px}.uxModes button{flex:1;padding:7px;border-radius:10px;border:1px solid #3a2f42;background:#1b1626;color:#ccc;font-size:12.5px;font-weight:700}.uxModes button.on{background:#5b3648;border-color:#f5c080;color:#ffe1ba}
.uxDrawer{margin:0 0 8px;border:1px solid #3a2f42;border-radius:12px;background:#17141e}.uxDrawer summary{padding:9px 12px;font-size:13px;font-weight:800;color:#f7d2a8;cursor:pointer;list-style:none}.uxDrawer summary small{color:#aaa3bb;font-weight:600;margin-left:6px}.uxDrawerBody{padding:0 12px 10px}.uxRow{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
.uxForm{padding-bottom:90px!important}.uxHint{font-size:12px;color:#aaa3bb;margin:0 0 6px}.uxG{margin:16px 0 6px;font-size:14px;color:#f4bc8d}.uxQ{background:#17141e;border:1px solid #342939;border-radius:12px;padding:10px;margin-bottom:8px}.uxQ b{display:block;font-size:13.5px;margin-bottom:6px}.uxQ em{font-style:normal;font-size:10.5px;color:#8bd5c4;margin-left:4px}
.uxChips{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:6px}.uxChips button{padding:5px 9px;border-radius:99px;border:1px solid #3a2f42;background:#1f1a29;color:#ddd;font-size:12px}.uxChips button.on{background:#5b3648;border-color:#f5c080;color:#ffe1ba}.uxQ textarea{width:100%;box-sizing:border-box;background:#120f18;border:1px solid #342939;border-radius:8px;color:#fff;padding:7px;font-size:12.5px}
.uxSent{font-size:12.5px;line-height:1.55;color:#f7d2a8;background:#2a1f2b;border-radius:8px;padding:7px 9px;margin:6px 0}.uxBlk{margin-top:8px}.uxBlk>b{display:block;font-size:12px;color:#aaa3bb;margin-bottom:4px}.uxL{display:flex;align-items:center;gap:5px;flex-wrap:wrap;font-size:12.5px;margin-bottom:5px}.uxL input,.uxL select{background:#120f18;border:1px solid #3a2f42;border-radius:8px;color:#fff;padding:5px 6px;font-size:12.5px;min-width:0}.uxL input[data-k]{flex:1;min-width:110px}.uxX{border:0;background:none;color:#aa8;font-size:14px;cursor:pointer}.uxAdv summary{font-size:11px;color:#777;margin-top:6px;cursor:pointer}
.uxChartWrap{overflow-x:auto}.uxChart{position:relative;margin:4px auto}.uxChart svg{position:absolute;inset:0}.uxNode{position:absolute;border-radius:10px;border:1px solid #4a3b55;background:#1f1a29;color:#eee;font-size:11px;font-weight:700;line-height:1.2;padding:2px 4px;cursor:pointer;overflow:hidden}.uxNode.on{border-color:#f5c080;background:#5b3648;color:#ffe1ba}.uxNode.end{border-color:#f59ba9}`;document.head.appendChild(st)})();
/* ---------- 5 · AI 帮我想：想换就换，免费 ----------
   The suggestion pop-up had only 采用 / 不采用 and could charge. Now: ↻ 换一个 (live AI first, then a local idea mixer), ← 上一个 to go back,
   a counter, and it is always free — suggestions are a creation aid, not a paid feature. */
const UXI={hist:[],i:0,n:0,day:''};
const UX_IDEA={who:['被家族除名的继承人','失忆的前任','欠我一条命的保镖','我的新室友','对手公司的谈判代表','只在雨夜出现的陌生人','我高中时的死对头','即将订婚的男人','深夜电台的匿名听众','值夜班的急诊医生'],
 hook:['敲开了我的门','在我的婚礼上出现','把一把旧钥匙塞进我手里','叫出了只有我知道的名字','替我挡下了一刀','用我的名字签了一份合同','在监控里看着我','把我的照片设成了锁屏'],
 twist:['却隐瞒了真正的身份','而我们十年前就见过','可他口袋里装着我的辞职信','但他明天就要离开这座城市','而他要找的人正是我','可是他根本不该还活着','而唯一的证人是我的弟弟']};
function uxPick(a){return a[Math.floor(Math.random()*a.length)]}
function uxLocalIdea(st){if(st.chips&&st.chips.length&&st.type!=='text'){const c=st.chips.slice().sort(()=>Math.random()-.5);return c.slice(0,st.type==='single'?1:3).join('、')}
 const pool=(typeof UX_POOL!=='undefined'&&UX_POOL[st.key])||[];const fresh=pool.filter(x=>!UXI.hist.includes(x));if(fresh.length&&Math.random()<.5)return uxPick(fresh);
 if(st.key==='world'||st.key==='place')return uxPick(['波士顿冬夜的公寓楼','新奥尔良的老唱片店','阿拉斯加封路的科研站','纽约上东区的私人俱乐部','西雅图雨季的码头仓库','拉斯维加斯通宵赌场的顶层','加州海边的废弃灯塔'])+'。'+uxPick(['每个人都欠着某种人情','这里的规矩比法律更硬','夜里才是真正的白天','所有门禁都记录着谁来过']);
 for(let k=0;k<6;k++){const t=uxPick(UX_IDEA.who)+uxPick(UX_IDEA.hook)+'，'+uxPick(UX_IDEA.twist)+'。';if(!UXI.hist.includes(t))return t}return wizardAIExample(st)}
const _wizardAIOffer5=wizardAIOffer;
wizardAIOffer=function(){_wizardAIOffer5();if(modal&&modal.kind==='wizard-ai'){modal.cost=0;modal.text=uxClean(modal.text);UXI.hist=[modal.text];UXI.i=0;Q('#modalMount').innerHTML=modalHTML()}};
const _modalHTML5=modalHTML;
modalHTML=function(){let h=_modalHTML5();if(modal&&modal.kind==='wizard-ai'){modal.cost=0;
 h=h.replace(/(<h3>[\s\S]*?<\/h3>)<p>[\s\S]*?<\/p>/,'$1<p>不满意就点「换一个」· 每天前 3 次免费，之后每次 💎1 · 采用不收费</p>');
 h=h.replace(/采用建议(?: · 💎 ?\d+| · 免费)?|采用本地灵感（免费）/,'✓ 采用这个');
 h=h.replace('<div class="modalButtons">','<div class="uxRe"><button class="btn" data-action="wizard-ai-prev"'+(UXI.i>0?'':' disabled')+'>← 上一个</button><span>'+(UXI.i+1)+' / '+Math.max(1,UXI.hist.length)+'</span><button class="btn primary" data-action="wizard-ai-reroll">'+(UXI.busy?'生成中…':'↻ 换一个'+uxRerollTag())+'</button></div><div class="modalButtons">');
 h=h.replace('不采用（不扣费）','不用了')}return h};
const UX_FREE_REROLL=3;
function uxRerollLeft(){const d=new Date().toDateString();if(UXI.day!==d){UXI.day=d;UXI.n=0}return Math.max(0,UX_FREE_REROLL-UXI.n)}
function uxRerollTag(){const l=uxRerollLeft();return l>0?' · 免费 '+l+' 次':' · 💎1'}
function uxClean(t){return String(t||'').replace(/\n*\s*(理由|原因|Why|Reason)[:：][\s\S]*$/i,'').trim()}
async function uxReroll(){if(!modal||modal.kind!=='wizard-ai'||UXI.busy)return;const st=steps[modal.step];const cur=(Q('#aiSuggestion')||{}).value||modal.text;UXI.hist[UXI.i]=cur;
 const left=uxRerollLeft(),cost=left>0?0:1;if(cost&&MG()<cost){toast('钻石不足，回 MIRU 充值');return}UXI.n++;let txt=null;const B=MB();
 if(B&&B.ask&&UXI.n<=60){UXI.busy=true;Q('#modalMount').innerHTML=modalHTML();const ta=Q('#aiSuggestion');if(ta)ta.value=cur;
  try{const r=await B.ask('/api/step-suggest',{question:st.title+'（只写内容本身，不要写理由；换一个和下面这些完全不同的方向，不要重复：'+UXI.hist.slice(-5).join(' / ').slice(0,500)+'）',previous:JSON.stringify(p.guided||{}).slice(0,2200),genre:p.genre,options:st.chips,mode:st.type,project:p});
   if(r&&r.text&&r.text.trim())txt=uxClean(r.text).slice(0,1200)}catch(_){}UXI.busy=false}
 let charged=0;if(txt&&cost){if(B.pay&&B.pay('suggest',cost)){charged=cost}else{toast('钻石不足，回 MIRU 充值');return}}
 if(!txt||UXI.hist.includes(txt))txt=uxLocalIdea(st);
 if(charged)toast('已换一个 · 扣 💎'+charged);UXI.hist.push(txt);UXI.i=UXI.hist.length-1;if(!modal||modal.kind!=='wizard-ai')return;modal.text=txt;Q('#modalMount').innerHTML=modalHTML()}
document.addEventListener('click',e=>{
 if(e.target.closest('[data-action="wizard-ai-reroll"]')){e.stopImmediatePropagation();e.preventDefault();uxReroll();return}
 if(e.target.closest('[data-action="wizard-ai-prev"]')){e.stopImmediatePropagation();e.preventDefault();if(!modal||UXI.i<=0)return;UXI.hist[UXI.i]=(Q('#aiSuggestion')||{}).value||modal.text;UXI.i--;modal.text=UXI.hist[UXI.i];Q('#modalMount').innerHTML=modalHTML();return}
 if(e.target.closest('[data-action="wizard-ai-accept"]')&&modal&&modal.kind==='wizard-ai'){modal.cost=0}},true);
(function(){const s=document.createElement('style');s.textContent='.uxRe{display:flex;align-items:center;gap:8px;margin:10px 0 4px}.uxRe .btn{flex:1}.uxRe span{font-size:12px;color:#aaa3bb;min-width:44px;text-align:center}.uxRe .btn[disabled]{opacity:.4}';document.head.appendChild(s)})();

(function(){try{const st=document.createElement('style');st.textContent='.wizConfirm{margin-top:10px;width:100%;padding:12px!important;font-weight:800}';document.head.appendChild(st)}catch(_){}})();
/* ---------- v2.9 · 试玩 = 正式版体验 ----------
   「✨ 完成创建并试玩」 and the ▶ 试玩 tab no longer open the bare preview engine. They hand the story to MIRU, which builds the full
   official experience (story page with background, character profiles and relationships; music, sound, effects and games matched
   from MIRU's libraries) and opens it — exactly like an official story. Nothing is published to the community from here. */
const _setTab_exp=setTab;
setTab=function(t){if(t==='preview'&&MB().preview){try{if(dirty)makeEngine();save();MB().preview(getStory(),clone(p),clone(sourcebook));return}catch(e){console.warn(e)}}return _setTab_exp(t)};

/* v2.9 · 专业版保留，但不再出现任何 JSON：触发器交给 AI 自动匹配，JSON 字段隐藏（数据仍保留以便保存） */
const _pro_nojson=pro;pro=function(){if(proTab==='triggers')proTab='graph';let h=_pro_nojson();try{const t=document.createElement('template');t.innerHTML=h;
t.content.querySelectorAll('[data-pro-tab="triggers"]').forEach(b=>b.remove());
t.content.querySelectorAll('[data-pro-tab="review"]').forEach(b=>b.textContent='🧪 结构校验');
t.content.querySelectorAll('details.uxAdv').forEach(d=>d.remove());
t.content.querySelectorAll('[data-action="export"],[data-action="pro-save-rules"],[data-action="pro-add-rule"]').forEach(b=>b.remove());
t.content.querySelectorAll('textarea.codeEdit').forEach(ta=>{const card=ta.closest('.thinCard');if(ta.id==='ruleJSON'&&card){card.remove();return}const f=ta.closest('.field')||ta;f.style.display='none'});
t.content.querySelectorAll('p,h4,small').forEach(e=>{if(/JSON|scene_enter|round_gte|cooldown/.test(e.textContent)&&!e.querySelector('*'))e.textContent=e.textContent.replace(/[（(]?JSON[^）)]*[）)]?/g,'').replace(/允许 scene_enter.*$/,'互动与触发由 AI 按剧情自动匹配。')});
const tip=document.createElement('div');tip.className='helpOverlay';tip.textContent='互动、小游戏、音效和特效由 AI 按剧情从 MIRU 素材库自动匹配，这里只需要管剧情结构、人物和结局。';const sec=t.content.querySelector('.proTabs');if(sec)sec.after(tip);
h=t.innerHTML}catch(_){}return h};
