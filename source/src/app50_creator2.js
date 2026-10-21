/* ---- v150 · 创作中心: the full Creator v2.1 (AI guide · templates · story workbench · interaction lab · sourcebook · assets · try-out · pro mode)
   runs inside MIRU in a full-screen frame. The bridge below gives it MIRU's live AI, MIRU's 💎 wallet with workload pricing, the image
   service, and "发布到 MIRU", which turns the creator's story graph into a normal playable MIRU story pack.
   The create page now has ONE entry (创作中心) instead of three overlapping ones (一句话 / 创建角色 / 二创). */
let CRX=null;
function crOpen(tab,fresh){crClose(true);window.MIRU_BRIDGE.startTab=tab||"guide";window.MIRU_BRIDGE.fresh=!!fresh;
 const d=document.createElement("div");d.id="crx";d.innerHTML='<iframe title="MIRU Creator" allow="microphone"></iframe>';document.body.appendChild(d);
 const f=d.querySelector("iframe");f.srcdoc=window.CREATOR_HTML;CRX=d}
function crClose(silent){const d=$("#crx");if(d)d.remove();CRX=null;if(!silent&&$("#s-main")&&!$("#s-main").hidden){try{renderTab(S.lastTab)}catch(_){}}}
function crJSON(prompt){return cAsk(prompt+"\nReply ONLY JSON.",30000)}
/* Creator 2.2: the project's 系统1 rules + the matching AI's own rules ride along with every request */
function crSys(p,path){p=p||{};const role={"/api/guide-turn":"architect","/api/plan":"architect","/api/rewrite":"scene","/api/step-suggest":"architect"}[path]||"architect";
 const rr=p.aiRoleRules&&p.aiRoleRules[role],s1=p.system1||{};const parts=[CR_SYS];if(rr)parts.push("Your role rules (follow them): "+String(rr).slice(0,600));
 const keep=["storyRule","gateRule","delayedRule","knowledgeRule","sourceRule"].map(k=>s1[k]).filter(Boolean).join(" / ");if(keep)parts.push("Story rules: "+keep.slice(0,900));return parts.join("\n")}
const CR_SYS="You are MIRU's story editor, helping an author build an interactive romance drama (all characters are fictional adults 21+, no explicit sexual content, no real people, no copyrighted characters). Write in Simplified Chinese.";
window.MIRU_BRIDGE={startTab:"guide",fresh:false,
 gems:()=>S.keys,
 price:kind=>kind==="suggest"?(cFreeLeft("line")>0?0:cPrice("line")):cPrice(kind),
 pay:(kind,n)=>{if(!n){cFreeLeft("line");S.cfree.line=(S.cfree.line||0)+1;save();return true}if(S.keys<n)return false;return spend(n,"event")},
 close:()=>crClose(),
 async ask(path,pl){if(!liveOn())return null;pl=pl||{};const proj=pl.project?JSON.stringify({title:pl.project.title,premise:pl.project.premise,genre:pl.project.genre,world:pl.project.world,hook:pl.project.hook,conflict:pl.project.conflict,secret:pl.project.secret,lead:pl.project.lead,support:pl.project.support}).slice(0,2400):"";
  try{
   if(path==="/api/guide-turn")return await crJSON(crSys(pl.project,path)+"\nThe author is on step "+(+pl.step+1)+" of a guided setup. Their answers so far: "+JSON.stringify(pl.answers||[]).slice(0,2000)+"\nCurrent project: "+proj+'\nGive ONE short, specific reaction to their latest answer and one concrete idea that would make the story stronger (max 70 Chinese characters, warm, no praise filler). JSON {"feedback":""}');
   if(path==="/api/plan")return await crJSON(crSys(pl.project,path)+"\nTurn the author's answers into a sharp story plan. Answers: "+JSON.stringify(pl.answers||[]).slice(0,3000)+"\nCurrent draft: "+proj+'\nKeep the author\'s names and choices; make it specific (place, object, secret, stakes). JSON {"project":{"title":"≤14字","premise":"一句话梗概","hook":"开场：用他的一个具体行为展示吸引力和他对你的态度，并给你一个马上能回应的点（冲突按题材安排，不必一开场就吵）","conflict":"","world":"具体地点和时间","vibe":"","ending":"","lead":{"name":"","role":"","personality":"","goal":"","boundary":""}}}');
   if(path==="/api/options")return await crJSON(crSys(pl.project,path)+"\nThe author is answering: "+(pl.question||"")+"\nCurrent options (replace them with a NEW, clearly different set): "+JSON.stringify(pl.current||[])+"\nTheir story so far: "+(pl.previous||"")+'\nGive 6 short options in Simplified Chinese (each under 18 characters), concrete and varied, fitting their story, original (no famous works). JSON {"options":["",...]}');
   if(path==="/api/rewrite")return await crJSON(crSys(pl.project,path)+"\nRewrite this line so it is more vivid and specific, same meaning, same length or shorter. Genre: "+(pl.genre||"")+". Context: "+(pl.context||"")+"\nLine: "+(pl.text||"")+'\nJSON {"text":""}');
   if(path==="/api/step-suggest")return await crJSON(crSys(pl.project,path)+"\nQuestion for the author: "+(pl.question||"")+"\nTheir story so far: "+(pl.previous||"")+"\n"+(pl.options&&pl.options.length?"Options they can pick (mode "+pl.mode+"): "+pl.options.join(" | ")+"\nIf it is a choice question, start with the best option(s) copied exactly, then one sentence why. ":"")+'Otherwise write a ready-to-use answer (max 120 Chinese characters) that fits everything they chose before. JSON {"text":""}')}
  catch(_){return null}return null},
 importScript(){crClose(true);show("s-main");imOpen()},
 async media(path,pl){pl=pl||{};if(/video/.test(path))return {error:LL("视频生成还没接入。先用分镜脚本，发布后由 MIRU 制作。","Video generation isn't connected yet.")};
  const r=await this.genP("cover",{raw:pl.prompt});if(r&&r.src)return {data_url:r.src};return {error:r&&r.err==="nosvc"?LL("AI 绘图服务没连上（登录 Claude 后可用）","Image service not connected"):r&&r.err==="nogems"?LL("钻石不足","Not enough gems"):LL("没生成出来，没有扣费","Failed — nothing charged")}},
 async extract(file){const n=file.name||"",buf=await file.arrayBuffer();if(/\.pdf$/i.test(n))return await imPdf(buf);if(/\.docx$/i.test(n))return await imDocx(buf);if(/\.doc$/i.test(n))return imDoc(buf);return await file.text()},
 async genP(kind,x){if(!AIG.mcp)return {err:"nosvc"};const price=cPrice(kind==="bg"?"bg":kind);if(S.keys<price)return {err:"nogems"};
  try{const prompt=await crImgPrompt2(kind,x);const res=await Promise.race([AIG.mcp.callTool(AIG.srv,AIG.tool,{prompt,width:576,height:1024,num_inference_steps:24,randomize_seed:true},{cache:false}),new Promise((_,rj)=>setTimeout(()=>rj("timeout"),90000))]);
   const src=aiImgFrom(res);if(!src)return {err:"fail"};spend(price,"event");return {src,cost:price}}catch(_){return {err:"fail"}}},
 assetGo(asset,proj,ok,fail){if(!asset.cost)return "plan";const kind={background:"bg",cover:"cover"}[asset.id];if(!kind||!AIG.mcp)return "plan";
  const price=cPrice(kind);if(S.keys<price)return "nogems";
  (async()=>{try{const prompt=await crImgPrompt(proj,asset.id);const res=await Promise.race([AIG.mcp.callTool(AIG.srv,AIG.tool,{prompt,width:576,height:1024,num_inference_steps:24,randomize_seed:true},{cache:false}),new Promise((_,rj)=>setTimeout(()=>rj("timeout"),90000))]);
    const src=aiImgFrom(res);if(!src)throw 0;spend(price,"event");ok(src)}catch(_){fail()}})();return "busy"},
 publish(story,proj,sb){const wid=crPublish(story,proj,sb);crClose(true);show("s-main");const w=wd(wid);toast(LL("已发布到 MIRU · ","Published to MIRU · ")+Lz(w.title));setTimeout(()=>packStart(wid,crAs(proj,w)),250)}};
async function crImgPrompt(p,kind){const base="Cinematic vertical film still, "+(kind==="cover"?"story poster composition, ":"empty establishing shot, no people, ")+"moody practical lighting, 35mm, shallow depth of field, photoreal. No text, no watermark.";
 if(!SAMPLE)return base;try{const r=await SAMPLE("Write ONE English prompt (max 60 words) for a text-to-image model: "+(kind==="cover"?"a cinematic poster image for this romance drama (adult characters, fully clothed)":"an establishing background shot of the main location, no people")+". Story: "+JSON.stringify({world:p.world,hook:p.hook,genre:p.genre,vibe:p.vibe}).slice(0,800)+". Reply with the prompt only.");const t2=String((r&&r.text)||"").trim();return t2.length>30?t2+" No text, no watermark.":base}catch(_){return base}}
function crAs(p,w){const r=String(p.playerRole||"");return /扮演主角|扮演原作/.test(r)?w.cast[0]:/旁观|导演/.test(r)?"watch":"side"}
/* ---------- creator images → MIRU scenes ---------- */
function crBg(wid,p,nodeId){const src=p.media&&p.media.bgs&&p.media.bgs[nodeId];if(!src)return null;const k="ugc_"+wid+"_"+nodeId;S.ugcBg=S.ugcBg||{};S.ugcBg[k]=src;return k}
const _sceneSrc50=sceneSrc;sceneSrc=function(th,img){if(img&&/^ugc_/.test(img)&&S.ugcBg&&S.ugcBg[img])return S.ugcBg[img];return _sceneSrc50(th,img)};
const _scnProbe50=scnProbe;scnProbe=function(img){if(img&&/^ugc_/.test(img))return Promise.resolve(S.ugcBg&&S.ugcBg[img]||null);return _scnProbe50(img)};
async function crImgPrompt2(kind,x){if(x&&x.raw)return String(x.raw).slice(0,600)+" Fictional adults only, fully clothed. No text, no watermark.";const style=x.style&&!/无图/.test(x.style)?x.style:"cinematic photoreal";
 const base={bg:"Vertical establishing shot of a location, no people: "+(x.title||"")+". "+(x.world||""),cover:"Vertical story poster for a romance drama, two adult men, fully clothed: "+(x.title||"")+". "+(x.hook||""),portrait:"Vertical portrait of a fictional adult man in his late 20s, fully clothed, waist up, looking at camera: "+(x.name||"")+", "+(x.role||"")+". "+(x.pers||"")}[kind]+" Style: "+style+". Moody practical lighting, shallow depth of field. No text, no watermark.";
 if(!SAMPLE)return base;try{const r=await SAMPLE("Write ONE English prompt (max 70 words) for a text-to-image model. Fictional adults only, fully clothed, no real people, no logos. Make it concrete and visual. Kind: "+kind+". Details (may be Chinese): "+JSON.stringify(x).slice(0,900)+". Reply with the prompt only.");const t2=String((r&&r.text)||"").trim();return t2.length>30?t2+" No text, no watermark.":base}catch(_){return base}}
/* ---------- story graph → MIRU pack ---------- */
function crLine(o,ids,names){const sp=o.speaker==="narrator"?"n":ids[o.speaker]||"n";let tx=String(o.text||"").trim();
 const nm=names[o.speaker];if(sp!=="n"){if(nm&&tx.indexOf(nm+"：")===0)tx=tx.slice(nm.length+1);tx=tx.replace(/^「([\s\S]*)」$/,"$1")}
 return tx.split(/\n{2,}/).map(s=>s.trim()).filter(Boolean).map(s=>[sp,sp==="n"?"act":"say",s.replace(/^(\S{1,12})说：/,"")])}
function crNodeBeats(n,ids,names){return (n.opening||[]).map(o=>Object.assign({},o,{text:String(o.text||"").replace(/^【[^】]*】\s*/,"")})).flatMap(o=>crLine(o,ids,names))}
function crPublish(story,p,sb){S.crmap=S.crmap||{};let wid=S.crmap[p.id];const tp=CTPL.find(x=>x.id===p.templateId)||CTPL[CTPL.length-1];
 const c=Object.assign(cardFromTpl(tp,p.premise),{title:p.title||cL(tp.t),lead:{name:p.lead.name||cL(tp.lead),role:p.lead.role||"",lib:tp.lib},sup:{name:(p.support&&p.support.name)||cL(tp.sup),role:(p.support&&p.support.role)||"",lib:tp.sl},
  place:p.world||cL(tp.place),obj:p.object||cL(tp.obj),sec:p.secret||"",con:p.conflict||"",hook:p.hook||""});
 const nodes=story.nodes||[],byId={};nodes.forEach(n=>byId[n.id]=n);
 const chNodes=[byId.start].concat(nodes.filter(n=>/^chapter_\d+$/.test(n.id)).sort((a,b)=>+a.id.split("_")[1]-+b.id.split("_")[1])).filter(Boolean);
 const nCh=Math.max(1,chNodes.length);
 if(!wid||!wd(wid)){const r=cBuildWorld(c,{len:String(nCh),tone:/甜/.test(p.vibe||"")?"sweet":/暗黑|危险/.test(p.vibe||"")?"dark":"pull",as:"side"});wid=r.wid;S.crmap[p.id]=wid}
 const w=wd(wid),L=w.cast[0],S2=w.cast[1],x0=s=>({zh:s,en:s});
 /* cast */
 const setC=(id,o)=>{const k=S.mine.chars[id];if(!k||!o)return;k.n=o.name||k.n;k.role=x0(o.role||"");k.vibe=x0(o.personality||o.role||"");k.likes=x0(o.goal||"");
  if(k.studio)Object.assign(k.studio,{name:k.n,role:o.role||"",vibe:o.personality||"",opening:id===L?c.hook:k.studio.opening})};
 setC(L,p.lead);setC(S2,p.support);
 const ids={lead:L,support:S2},names={lead:c.lead.name,support:c.sup.name};
 w.cast=[L,S2];(p.extraCast||[]).forEach((e,i)=>{let id=(w.crx||{})[e.id];if(!id||!S.mine.chars[id]){id="u"+(Date.now()+10+i);S.mine.chars[id]=JSON.parse(JSON.stringify(S.mine.chars[S2]));S.mine.chars[id].secret=x0("");w.crx=w.crx||{};w.crx[e.id]=id}
  setC(id,e);ids[e.id]=id;names[e.id]=e.name;w.cast.push(id)});
 /* chapters */
 const custom=new Set(((p.advanced||{}).scenes||[]).map(s=>s.id));const end1=byId.final&&byId.final.type==="ending"?byId.final:null;
 const chs=chNodes.map((n,i)=>{const old=w.pack.chapters[i]||{};const scene=["sys","scene",{place:c.place,time:old.time?Lz(old.time):c.time}];
  let beats;if(i===0&&!custom.has("start"))beats=cFirstScene(c,L,S2);else beats=[scene].concat(crNodeBeats(n,ids,names));
  const bgk=crBg(wid,p,n.id);if(bgk&&beats[0]&&beats[0][1]==="scene")beats[0]=["sys","scene",Object.assign({},beats[0][2],{img:bgk})];
  const opts=(n.choices||[]).slice(0,3).map((ch2,j)=>{const nx=byId[ch2.next];let then=nx&&nx.id!==n.id&&!/^chapter_|season_end/.test(nx.id)?crNodeBeats(nx,ids,names).slice(0,4):[["n","act",LL("你做出了选择。","You've made your choice.")]];
   if(nx&&nx.id==="final"&&byId.final)then=crNodeBeats(byId.final,ids,names).slice(0,3);
   const bk=nx&&crBg(wid,p,nx.id==="final"&&!byId.final?n.id:nx.id);if(bk&&nx&&!/^chapter_|season_end/.test(nx.id))then=[["sys","bg",{img:bk}]].concat(then);
   const fl=ch2.effects&&ch2.effects.flags?Object.keys(ch2.effects.flags).filter(k=>ch2.effects.flags[k]):[];
   const o={k:"ABC"[j],t:x0(ch2.text),then:{zh:then,en:then},mem:x0(LL("你选择了：","You chose: ")+ch2.text)};if(fl.length)o.set=fl;const rl=ch2.effects&&ch2.effects.relationships;if(rl){o.rd={};Object.keys(rl).forEach(k=>{const m=k.split(".").pop();o.rd[m]=(o.rd[m]||0)+(+rl[k]||0)})}if(ch2.effects&&ch2.effects.len)o.len=ch2.effects.len;return o});
  if(!opts.length)opts.push({k:"A",t:x0(LL("继续","Continue")),then:{zh:[],en:[]},mem:x0("")});
  return {t:x0(String(n.title||"").replace(/^第\d+章\s*·\s*/,"")||LL("第 "+(i+1)+" 章","Chapter "+(i+1))),goal:x0(i===0?c.con:String((n.opening||[])[0]&&n.opening[0].text||"").replace(/^【[^】]*】\s*/,"").slice(0,60)),place:x0(c.place),time:x0(c.time),
   ask:x0(LL("你怎么做？","What do you do?")),beats:{zh:beats,en:beats},choices:opts,outline:i>0&&!custom.has(n.id),crsig:JSON.stringify(n.opening||[])}});
 /* keep chapters the author already wrote in the MIRU workbench (non-outline) unless the creator changed that scene */
 chs.forEach((ch2,i)=>{const old=w.pack.chapters[i];if(old&&old.outline===false&&old.crsig===ch2.crsig&&i>0){ch2.beats=old.beats;ch2.outline=false}});
 w.pack.chapters=chs;w.pack.ready=chs.length;
 /* Creator 2.2 delayed bottleneck: the seed is set by an early choice, repaired by a later one, and settled at the end of the last chapter */
 const gate=byId.MIRU_BOTTLENECK_EVIDENCE,dbe=byId.MIRU_DELAYED_BE;if(gate&&chs.length){const last=chs[chs.length-1],gx=crNodeBeats(gate,ids,names),bad=dbe?crNodeBeats(dbe,ids,names):[];
  const seed=["sys","if",{cond:{all:[{flag:"seed_unverified_claim"},{not:"evidence_checked"}]},then:gx.concat(bad).concat([["sys","set",{flag:"delayed_failure_triggered"}]]),else:gx.concat([["n","act",LL("你早前核验过证据，这一关稳稳过去了。","You checked the evidence earlier — it holds.")]])}];
  last.beats.zh.push(seed);last.beats.en=last.beats.zh}
 const fin=(byId.season_end||end1);const finTx=fin?crNodeBeats(fin,ids,names).map(b=>b[2]).join("\n"):(p.ending||"");
 w.pack.endings.A.txt=x0(finTx);w.pack.endings.A.t=x0((p.ending||"").slice(0,16)||LL("在一起","Together"));
 /* story card, intro, sourcebook */
 w.title=x0(c.title);w.hook=x0(c.hook);w.premise=x0(p.premise||c.con);w.status.place=x0(c.place);
 w.pack.card=c;w.pack.lore=(sb||[]).map(s=>({t:s.title||"",d:s.detail||"",vis:s.visibility||"all"}));w.pack.creator={narration:p.narration||"",rules:{system1:story.system1||p.system1||null,ai:story.aiGuidance||p.aiRoleRules||null,pay:story.payRules||p.payRules||null},endMode:story.endingMode||p.endingMode||"guided",id:p.id,genre:p.genre,vibe:p.vibe,persona:p.playerPersona,role:p.playerRole,interactions:p.interactionIds||[],ver:(w.pack.creator&&w.pack.creator.ver||0)+1};
 const intro=w.pack.intro.zh;intro.bg=[c.place+"。",c.con?c.con+"。":"",p.premise||""].filter(Boolean);if(p.playerRole)intro.you=LL("你的身份：","You: ")+p.playerRole+(p.playerPersona?" · "+p.playerPersona:"")+"。"+LL("你的选择会改变人物对你的信任、吸引和张力。","Your choices change their trust, attraction and tension.");
 intro.cast=w.cast.map(id=>[id,Lz(S.mine.chars[id].role)]);w.pack.intro.en=JSON.parse(JSON.stringify(intro));w.pack.join=[{as:L,t:x0(LL("扮演"+c.lead.name,"Play as "+c.lead.name))}];
 const media=p.media||{};const fc=media.faces||{};Object.keys(fc).forEach(k=>{const id=ids[k];if(id&&fc[k])S.art[id]=fc[k]});if(media.cover&&media.cover.src)w.cover=media.cover.src;else if(media.bgs&&media.bgs.start)w.cover=media.bgs.start;else if(media.background&&media.background.src)w.cover=media.background.src;
 const wk=S.works.find(k=>k.id===wid);if(wk)wk.title=c.title;save();return wid}
/* ---------- one entry on the create page ---------- */
function crHub(){const draft=(()=>{try{return JSON.parse(localStorage.getItem("miru.creator.v2.project")||"null")}catch(_){return null}})();
 const row=(k,ic2,b,s,rec)=>'<button class="opt crhopt'+(rec?" rec":"")+'" data-crh="'+k+'"><span class="ic">'+ic2+'</span><span class="grow"><b>'+b+(rec?' <em class="crrec">'+LL("推荐","Best")+'</em>':'')+'</b><span>'+s+'</span></span><span style="color:var(--gold)">›</span></button>';
 sheet('<div class="eyebrow" style="color:var(--gold)">✦ '+LL("创作中心","Creator")+'</div><h2 style="margin-top:4px">'+LL("你想怎么开始？","How do you want to start?")+'</h2>'+
  '<p class="xs faint" style="margin-top:4px;line-height:1.5">'+LL("剧、角色、二创都在这里。手动编辑、试玩、保存永远免费；AI 和素材按工作量计价，成功才扣钻石。","Stories, characters and remixes all start here. Editing, trying and saving are free; AI and assets are priced by workload and only charged on success.")+'</p><div class="stack" style="gap:8px;margin-top:12px">'+
  (draft&&draft.title?row("continue","📝",LL("继续写《","Continue “")+esc(draft.title)+LL("》","”"),LL("回到上次的草稿","Back to your last draft")):"")+
  row("guide","🧭",LL("AI 一步步引导","AI guided"),LL("24 个问题，点选为主，每一步 AI 都能帮你想；人物、关系、分支、互动、素材、结局全部覆盖","23 questions, mostly taps; AI can help at every step"),1)+
  row("quick","⚡",LL("一句话极速开玩","One line, play now"),LL("说一句灵感 → 故事卡 → 第一幕免费直接玩","One idea → story card → play scene 1 free"))+
  row("templates","▦",LL("从灵感模板开始","Start from a template"),LL("吸血鬼、黑帮、校园、狼人、规则生存……改改就是你的","Vampire, mafia, campus, wolves, survival…"))+
  row("pro","🛠",LL("专业版","Pro mode"),LL("剧情图、分支与效果、逐句台词、人物知识、触发器、规则配置、发布自检","Story graph, branches, dialogue, knowledge, triggers, checks"))+
  row("char","🧬",LL("只做一个角色","Just a character"),LL("头像、音色、开场白，发布后别人也能和他聊","Portrait, voice, opening line — others can chat too"))+
  row("remix","⑂",LL("二创一个已有的剧","Remix a story"),LL("改一件事，分享出去，按游玩量分成","Change one thing, share it, earn by plays"))+
  row("works","🗂",LL("我的草稿","My drafts"),LL("所有作品、副本和导入导出","All drafts, copies, import/export"))+'</div>')}
document.addEventListener("click",e=>{let x;
 if(e.target.closest("[data-crhub]")){crHub();return}
 if(x=e.target.closest("[data-crh]")){const k=x.dataset.crh;closeSheet();
  if(k==="quick")return cNew();if(k==="char")return createChar();if(k==="remix")return createRemix(W[0].id);
  return crOpen({continue:"guide",guide:"guide",templates:"templates",pro:"pro",works:"works"}[k],k==="guide")}
 if(x=e.target.closest("[data-crpro]")){const wid=x.dataset.crpro,pid=Object.keys(S.crmap||{}).find(k=>S.crmap[k]===wid);if(pid)crOpenWork(pid,"pro");return}});
function crOpenWork(pid,tab){try{const shelf=JSON.parse(localStorage.getItem("miru.creator.v2.works")||"{}");const w=shelf[pid];if(w){localStorage.setItem("miru.creator.v2.project",JSON.stringify(w.project));localStorage.setItem("miru.creator.v2.wizard",JSON.stringify(w.wizard))}}catch(_){}crOpen(tab)}
const _renderCreate50=renderCreate;renderCreate=function(v){_renderCreate50(v);try{const sc=v.querySelector(".scroll");if(!sc)return;
 sc.querySelectorAll('[data-cnew],[data-cre="remix"],[data-cre="char"]').forEach(b=>b.remove());
 sc.insertAdjacentHTML("afterbegin",'<button class="card crhub" data-crhub="1"><div class="row" style="align-items:flex-start"><span style="font-size:30px">✨</span><div class="grow"><b style="font-size:17px;display:block">'+LL("创作中心","Creator")+'</b><p class="xs faint" style="margin-top:4px;line-height:1.5">'+LL("写一部剧、做一个角色、二创别人的剧，都从这里开始。AI 一步步引导，也有专业版。","Write a story, make a character, or remix one — all from here. AI-guided, with a Pro mode.")+'</p>'+
  '<div class="crtags"><span>🧭 '+LL("AI 引导","AI guide")+'</span><span>⚡ '+LL("一句话","One line")+'</span><span>🛠 '+LL("专业版","Pro")+'</span><span>🧬 '+LL("角色","Character")+'</span><span>⑂ '+LL("二创","Remix")+'</span></div></div><span style="color:var(--gold);font-size:20px">›</span></div></button>');
 v.querySelectorAll("[data-cwork]").forEach(b=>{const wid=b.dataset.cwork;if(Object.values(S.crmap||{}).includes(wid)&&!b.parentElement.querySelector("[data-crpro]"))b.insertAdjacentHTML("beforebegin",'<button class="btn btn-g btn-sm" data-crpro="'+wid+'" style="margin-right:6px">🛠 '+LL("专业版","Pro")+'</button>')})}catch(_){}};
(function(){const st=document.createElement("style");st.textContent=`
#crx{position:fixed;inset:0;z-index:9000;background:#0c0a12}#crx iframe{width:100%;height:100%;border:0;display:block}
.crhub{text-align:left;border-color:rgba(238,111,151,.5);background:linear-gradient(135deg,rgba(238,111,151,.16),rgba(240,183,126,.10))}
.crtags{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}.crtags span{font-size:11px;font-weight:700;padding:3px 8px;border-radius:99px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);color:#F7D2A8}
.crhopt.rec{border-color:var(--gold);background:rgba(240,183,126,.09)}.crrec{font-style:normal;font-size:10px;font-weight:800;color:#1a1208;background:var(--gold);border-radius:6px;padding:1px 5px;margin-left:4px}`;document.head.appendChild(st)})();

/* Creator-made stories: the in-story chat AI gets the author's 场景演出 rules and 秘密权限 rule */
const _ask50=ask;ask=function(prompt,opts){try{const th=S.threads[curT],w=th&&wd(th.wid),R=w&&w.pack&&w.pack.creator&&w.pack.creator.rules;
 if(R&&typeof prompt==="string"&&prompt.indexOf("You write MIRU")===0){const add=[R.ai&&R.ai.scene,R.system1&&R.system1.knowledgeRule].filter(Boolean).join(" / ");if(add)prompt+="\n\nAUTHOR RULES FOR THIS STORY (obey; never reveal secrets a character doesn't know): "+String(add).slice(0,800)}}catch(_){}return _ask50.apply(this,arguments)};
