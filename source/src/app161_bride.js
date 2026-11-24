/* Bride: scoped queues; explicit consent and evidence-driven resolution. */
(function(){'use strict';
const R=BRIDE_RELEASE,E=BRIDE_STATE,bi=s=>({zh:s,en:s});
const own=th=>!!(th&&wd(th.wid)?.community===R.work_id);
const state=th=>th.pk.bride||(th.pk.bride=E.initial());
const scene=id=>R.chapters.flatMap(c=>c.scenes).find(s=>s.id===id);
const cid=(th,name)=>(wd(th.wid).cast||[]).find(id=>(ch(id)?.n94?.zh||ch(id)?.n)===name);
const free=hint=>['sys','line',{hint:bi('\u2063'+hint),opts:[],bride:true}];
function configure(w){
 if(!w?.pack)return;w.pack.nativeV2=1;w.pack.authoredContract=1;w.pack.minRoundsPerChapter=0;w.literalPlayerNames101=true;
 w.you94=w.you94||(w.cast||[]).find(id=>(ch(id)?.n94?.zh||ch(id)?.n)==='你');
 if(w.you94){w.pack.pov=w.you94;const you=ch(w.you94);if(you){you.n='你';you.n94=bi('你');you.g='u';you.romanceable=false;}}
 w.pack.endings=Object.fromEntries(Object.entries(R.ending_titles).map(([k,t])=>[k,{t:bi(t)}]));w.leads=[];
 for(const id of w.cast||[]){const c=ch(id),m=R.cast.find(x=>x.name===(c?.n94?.zh||c?.n));if(m){c.g=m.gender;c.romanceable=false;S.art[id]=m.art;}}
 for(const c of w.pack.chapters){const raw=R.chapters[c.n?c.n-1:w.pack.chapters.indexOf(c)];if(!raw)continue;c.strictDone=true;c.goalOwn=true;c.time=bi(raw.scenes[0].time);c.place=bi(raw.scenes[0].place);const beats=raw.scenes.map(s=>['sys','brideScene',{id:s.id}]);c.beats={zh:beats,en:beats};}
}
PARSE.use('bride:authored',{build(next,doc,as){const out=next(doc,as),w=wd(out?.wid||out);if(OFF94.cur?.id===R.work_id&&w)configure(w);return out;}});
for(const [slot,url]of Object.entries(R.assets))if(slot.startsWith('bg_')){window.SCENE_FILES=window.SCENE_FILES||{};window.SCENE_FILES['off94:'+R.work_id+':'+slot]=url;}
function text(th,line){const m=/^(旁白|艾莲娜|阿德里安|比阿特丽斯|米里亚姆|鲁思|贾尔斯)：(.*)$/.exec(line);if(!m)return ['n','act',line];return [m[1]==='旁白'?'n':cid(th,m[1])||'n',m[1]==='旁白'?'act':'say',m[2].replace(/^“|”$/g,'')];}
const responseHint='可以提出问题、说明打算，或明确说“进入下一场”。暂停、结束体验和降低恐怖强度随时有效。';
function markGoals(th){const s=state(th);for(const[n,yes]of Object.entries(s.goals))if(yes){const f=R.chapters[+n-1].done.map(x=>x.match(/⟦DONE\|flag\|([^|]+)/)?.[1]).find(Boolean);if(f)pkSet(th,f);}}
function fact(th,id){const s=state(th),a=R.facts[id];if(!a)return [];let [key,kind,body]=a;
 if(key==='lock_record'&&!s.consent.original){key='lock_pending';body='原件保持封存。当前只登记录音的位置与待核片段，锁门原音尚未作为已核验事实。';}
 if(key==='departure_plan'&&!s.consent.privateItems)body='票据支持她计划独自离开。私人告别信保持封存，不据此证明她已经离开。';
 E.observe(s,{id:key,kind,text:body,verified:key!=='lock_pending'},scene(s.scene).people);
 if(key==='loop')E.observe(s,{id:'service_route',kind:'observation',text:'贾尔斯标出原通院子的服务侧廊；当前仍在循环，需要先终止假覆页输入。',verified:true},scene(s.scene).people);
 return [['n','act',body]];
}
function render(th,id,opening){
 const c=scene(id),s=state(th);s.scene=id;s.phase=opening?'opening':'body';let lines=opening?R.opening.split(/\n+/).filter(Boolean):c.baseline.slice(),url=R.assets[c.bg];
 if(!opening){
  if(id==='SCN_0903'&&!s.consent.privateItems)lines=lines.filter(l=>!l.includes('艾莲娜的原文'));
  if(id==='SCN_1003'&&!s.consent.original)lines=c.games.map(g=>'⟦MG|'+g+'⟧').concat('米里亚姆：原件先封存。我们把最后位置和待核问题记在交接单上。');
  if(id==='SCN_1203')lines=c.games.map(g=>'⟦MG|'+g+'⟧').concat('米里亚姆：见证需要核实原件和安置处；离开需要终止本次假见证。限定复仇有致命风险，先保护人。任何方法都不是替她结婚。');
  if(id==='SCN_1404')lines.push('艾莲娜：你愿意看我吗？我可以自己抬起来。也可以就这样说话。');
  if(id==='SCN_1504')lines=R.preludes[s.methodFinal||'undecided'].slice();
  if(id==='SCN_1601')lines=s.exit==='open'?['旁白：门外的风吹进来，院子不再连回同一条走廊。','米里亚姆：先核对人员。还没有确认的人，只记最后的位置。']:['旁白：修复室的灯仍亮着。工作台上放着已有记录，通道尚未确认恢复。','米里亚姆：先停在这里，把已经知道的和仍缺的分开。'];
  if(id==='SCN_1601'&&s.resolution==='retaliation_contained')lines.push('米里亚姆：比阿特丽斯最后还在纪念台内，情况未明。阿德里安和贾尔斯刚才已经退向通道。');
  if(id==='SCN_1604'){const need=['lock_record','register_false','location'].filter(k=>!s.evidence[k]);lines=['米里亚姆：按已经发生的结果收束，你还想保留哪些工作或联系？'];if(need.length)lines.push('旁白：仍待核实的资料有：'+need.map(k=>({lock_record:'锁门原音',register_false:'名册假覆页',location:'疑似安置处'})[k]).join('、')+'。');}
  if(s.plans.staySafe&&s.delegated){lines=lines.map(l=>'旁白：同伴从有来源的现场记录中转述：'+l);}
  if(s.horror==='low')lines=lines.filter(l=>!/(呼吸停了一拍|身体没动|盖布下面传来呼吸|肩膀却还停在转角)/.test(l));
 }
 if(id.startsWith('SCN_16')&&s.exit!=='open')url=R.assets.variant_slots?.bg_c16s04?.safe_archive||url;
 if(id==='SCN_1604'&&s.exit==='open')url=R.assets.variant_slots?.bg_c16s04?.[s.resolution==='truth_recorded'?'name':s.resolution==='retaliation_contained'?'wait':'gate']||url;
 const img='off94:'+R.work_id+':'+c.bg;window.SCENE_FILES=window.SCENE_FILES||{};window.SCENE_FILES[img]=url;
 const beats=[['sys','scene',{img,bg94:c.bg,src94:url,place:c.place,time:c.time}]];
 th.present=(opening?['米里亚姆']:s.plans.staySafe?['米里亚姆','鲁思']:c.people).filter(n=>s.contact!=='records'||n!=='艾莲娜').map(n=>cid(th,n)).filter(Boolean);th.addr=null;th.pk.nativeScene={place:c.place,time:c.time,present:th.present};
 if(s.plans.staySafe&&!s.delegated&&!opening){beats.push(text(th,'米里亚姆：先留在这里。想继续核查，可以提出由谁转述必要发现，或者结伴回去。'),free(responseHint));s.waitingSafe=true;return beats;}s.waitingSafe=false;
 for(const l of lines){const m=/^⟦MG\|([^⟧]+)⟧$/.exec(l);if(m){if(!s.games[m[1]])beats.push(['sys','mg',{id:'g_'+m[1]}]);}else beats.push(text(th,l));}
 if(!opening&&id==='SCN_1203')s.riskNotice=true;
 if(!opening&&id==='SCN_0201')beats.push(['sys','brideCommit',{event:'ritual_started'}]);
 if(!opening&&c.detail_slots?.length)beats.push(['sys','brideDetails',{slots:c.detail_slots.filter(slot=>!(id==='SCN_0903'||id==='SCN_0603')||s.consent.privateItems)}]);
 const hs=Object.keys(R.assets).filter(k=>k.startsWith('hl_c'+id.slice(4).toLowerCase().replace(/^(\d{2})(\d{2})$/,'$1s$2')+'_'));
 if(!opening&&(id!=='SCN_1004'||s.consent.original)&&s.horror!=='low'&&!['SCN_1404','SCN_1504','SCN_1604'].includes(id))for(const slot of hs)beats.push(['sys','brideCG',{slot}]);
 beats.push(free(responseHint));return beats;
}
function canAdvance(s){if(s.paused)return '剧情已暂停，先说恢复。';if(s.waitingSafe)return '先确认是在安全处接收同伴转述，还是结伴调查。';if(s.scene==='SCN_0401'&&!s.plans.identityCheck)return '想查看必要身份线索，还是也允许检查私人物件？面纱另行确认。';if(s.scene==='SCN_1001'&&!s.plans.original)return '原音是现在核对，还是封存交给专业人员？';if(s.scene==='SCN_1502'&&!s.plans.copies)return '先明确实际保存安排，也可以只登记原件的位置。';if(s.scene==='SCN_1503'&&!s.plans.innocents)return '先核对同伴位置和安全通道，保留所有人的离开权利。';if(s.scene==='SCN_1604'&&!s.ending)return '按已经完成的事实确认这次经历的结果。';const n=+s.scene.slice(4,6);if(s.scene.endsWith('04')&&!s.goals[n])return '这一章的目标还需结合已有资料明确行动或范围，继续说出你的打算。';return null;}
let resolving=false;const resolve=stopResolve;stopResolve=function(th,extra){if(own(th)&&th.pk.stop?.[2]?.bride&&!resolving)return;return resolve.apply(this,arguments);};
function go(th,beats){resolving=true;try{return stopResolve(th,beats||[]);}finally{resolving=false;}}
function finish(th){const s=state(th);th.pk.q=th.pk.stop?[th.pk.stop]:[];th.pk.after=null;const beats=R.ending_text[s.ending].map(x=>text(th,x)).concat([['sys','brideEnd',{id:s.ending}]]);if(th.pk.stop)go(th,beats);else{th.pk.q=beats;packRun(th);}}
const directive=function(th,b,next){
 if(!own(th)||b?.[0]!=='sys')return next(th,b);const s=state(th);
 if(b[1]==='brideScene'){th.pk.q.shift();const opening=b[2].id==='SCN_0101'&&!s.seenOpening;s.seenOpening=true;th.pk.q.unshift(...render(th,b[2].id,opening));save();return true;}
 if(b[1]==='brideCommit'){th.pk.q.shift();E.commit(s,b[2].event);markGoals(th);save();return true;}
 if(b[1]==='brideCG'){th.pk.q.shift();const slot=b[2].slot;s.images=s.images||{};if((slot!=='hl_c14s04_1'||s.faceShown)&&!s.images[slot]&&R.assets[slot]){s.images[slot]=true;th.pk.q.unshift(['sys','cg94',{slot,src:R.assets[slot]}]);}save();return true;}
 if(b[1]==='brideDetails'){th.pk.q.shift();for(const slot of b[2].slots)if(R.assets[slot])appendMsg(th,{who:'sys',k:'brideDetail',slot,caption:scene(s.scene).title+' · 线索图',at:Date.now()});return true;}
 if(b[1]==='brideEnd'){th.pk.q.shift();pkGo(th,'end','bride:ending');th.pk.end=b[2].id;const p=packSt(th.wid);p.end=p.end||{};p.end[b[2].id]=1;appendMsg(th,{who:'sys',k:'card',title:R.ending_titles[b[2].id],txt:'',at:Date.now()});save();return true;}
 return next(th,b);
};PKREG.add('bride:queues',directive);const previousDirective=pkDirective;pkDirective=function(th,b){return own(th)?directive(th,b,(t,x)=>previousDirective(t,x)):previousDirective.apply(this,arguments);};
function options(th){const s=state(th);return [...(E.choices[s.scene]||[]),...E.global].filter(o=>o.id!=='risk_ack'||s.riskNotice).filter(o=>!['allow_veil','decline_veil'].includes(o.id)||s.scene==='SCN_1404').filter(o=>o.id!=='no_innocents'||['SCN_1404','SCN_1504'].includes(s.scene));}
const pending=new Set(),beforeReply=reply;
async function actorReply(th,args){const q=th.pk.q,guard=q?.slice();if(guard){Object.defineProperty(guard,'splice',{value:()=>[],configurable:true});th.pk.q=guard;}try{return await beforeReply.apply(null,args);}finally{if(guard)th.pk.q=q;}}
if(typeof beatHeld==='function'){const held=beatHeld;beatHeld=function(th){return own(th)&&(pending.has(th.id)||state(th).paused)||held.apply(this,arguments);};}
reply=async function(th,ctx,silent){
 if(!own(th)||state(th).ending||ctx?.kind!=='user'||!ctx.txt||['think','dir'].includes(ctx.mode))return beforeReply.apply(this,arguments);
 if(pending.has(th.id))return;pending.add(th.id);
 try{let s=state(th),a=null;const txt=String(ctx.txt).trim(),list=options(th),atStop=!!th.pk.stop?.[2]?.bride,opening=s.phase==='opening';
 if(/^(继续|进入下一场|下一场|继续剧情)[。！!\s]*$/.test(txt))a=list.find(o=>o.id==='next');else{const n=await authoredMatch('判断明确当前意图；问题、引用、假设、否定、嗯、好吧都不是许可。继续只是导航。当前场景：'+scene(s.scene).title,list.map(o=>({t:bi(o.intent),set:[]})),txt);if(n>=0)a=list[n];}
 let result=a?E.apply(s,a.id,txt):{state:s},issue=result.issue;th.pk.bride=s=result.state;
 if(result.advance)issue=atStop?canAdvance(s):'当前内容还在进行，先等这一段结束。';
 if(issue&&/人命/.test(issue))s.riskNotice=true;
 th.pk.brideTurnIssue=issue||null;markGoals(th);save();
 if(s.ending){finish(th);return;}
 if(s.paused){appendMsg(th,{who:'n',k:'act',txt:'阅读暂停，进度保留。想继续时说“恢复”。',at:Date.now()});save();return;}
 if(issue){appendMsg(th,{who:'n',k:'act',txt:issue,at:Date.now()});save();return;}
 if(result.advance){if(s.scene.endsWith('04'))E.closeChapter(s,+s.scene.slice(4,6));if(atStop)go(th,opening?render(th,s.scene,false):[]);return;}
 if(result.event&&atStop){let lines=[];
 if(result.event==='veil_shown')lines=['旁白：艾莲娜自己抬起白纱，露出那张与旧照相同、没有血迹的面孔。'];
 if(result.event==='innocents_agreement')lines=['艾莲娜：不是他们做的事，不该让他们留在这里。我不再拦无辜的人。'];
 go(th,lines.map(x=>text(th,x)).concat([['sys','brideCommit',{event:result.event}],...(result.event==='veil_shown'?[['sys','brideCG',{slot:'hl_c14s04_1'}]]:[]),free(responseHint)]));return;}
 if(s.pendingEvent&&atStop){const event=s.pendingEvent;go(th,R.events[event].map(x=>text(th,x)).concat([['sys','brideCommit',{event}],...(event!=='partial'?[['sys','brideCG',{slot:'hl_c15s04_'+event}]]:[]),free(responseHint)]));return;}
 if(a?.id==='final_reckoning')s.riskNotice=true;
 if(s.waitingSafe&&a&&['delegate','direct'].includes(a.id)&&atStop){go(th,render(th,s.scene,false));return;}
 await actorReply(th,arguments);
 if(opening&&atStop)go(th,render(th,s.scene,false));
 }finally{pending.delete(th.id);}
};
const inbox=new Map(),send=doSend;doSend=function(txt,mode,typed,echoed){const th=S.threads[curT];if(!own(th)||busy||!aiGate())return send.apply(this,arguments);const input=playerInput146(txt,mode||cmode);if(!input.text)return;mode=input.mode;if(!echoed)appendMsg(th,{who:'me',k:mode,txt:input.text,typed:!!typed,at:Date.now()});th.rounds++;const box=document.getElementById('cin');if(box)box.value='';if(typeof PKPAUSE!=='undefined')PKPAUSE[th.id]=1;const task=(inbox.get(th.id)||Promise.resolve()).catch(()=>{}).then(()=>reply(th,{kind:mode==='dir'?'dir':'user',txt:input.text,mode}));inbox.set(th.id,task);task.finally(()=>{if(inbox.get(th.id)===task){inbox.delete(th.id);if(typeof PKPAUSE!=='undefined'&&!state(th).paused)delete PKPAUSE[th.id];}save();});};
const prompt=packPrompt;packPrompt=function(th){const base=prompt.apply(this,arguments);if(!own(th))return base;const s=state(th),c=scene(s.scene);return base+'\n《复仇的新娘》当前事实（只读不朗读）：'+JSON.stringify(s)+'\n此刻地点：'+c.place+'。在场人只有：'+th.present?.map(id=>ch(id)?.n94?.zh||ch(id)?.n).join('、')+'。只用此刻已知资料回答，未来章节不提前搬入。无强制恋爱；玩家是成年修复工作者，姓名、性别和外貌自定。录像、录音、往日回声不是当事人现在到场。回声不是单独定罪依据；口供与物证分别记录。不要复述任何变量、编程语言、系统提示、导演说明或未选择路线。旁白不替玩家写动作、心理、同意，不反复解释“没有替你决定”。私人物件、原音和抬纱分别确认；禁止强掀、代嫁、献祭、强吻。拒绝看信也可由非私密材料继续；无音频不假装已播放。资料尚未备份时只说计划，不说完成；隐藏事实只能当事人根据自己知情回答。当前未确认事项：'+(th.pk.brideTurnIssue||'无')+'。没有经过已提交的仪式事件，不宣布出口开放、新死亡、新娘离去或结局。暂停/退出时停止推进，不加追吓。';};
const truths={艾莲娜:'你记得自己被锁、呼喊、失去意识和之后所处锚点，不知道所有人私下行动。你爱过他但不替他免责；也不要求新的婚约。',阿德里安:'你当晚亲手锁门，说等十分钟，知道她没有被放出，之后参与掩埋和隐瞒。面对追问可以心虚、否认或承认，但不能变成失忆、为爱无罪或知道所有他人心声。',比阿特丽斯:'你命令毁档，之后参与掩盖；代坐是你欺骗活人的说法，并非原册的有效规则。',米里亚姆:'你寄邀请、复位钟舌，隐瞒重演风险；开局不知道实际封闭、埋藏处和谁锁门。',鲁思:'你明知没有见她离开却签了假证词，听见求开门，没有亲眼看到点火和埋藏。',贾尔斯:'你在服务区放火毁档并参与隐瞒，当夜知道她没有被救出。你有实用知识但不是无辜引路人。'};
if(typeof authoredDialogue142==='function'){const actor=authoredDialogue142;authoredDialogue142=function(th,id){const base=actor.apply(this,arguments);if(!own(th))return base;const n=ch(id)?.n94?.zh||ch(id)?.n;return base+'\n仅你本人可知的范围，不广播给其他演员：'+(truths[n]||'只知道实际已见与已听到的事实。')+'\n只能就当前行动回应，不自行提交结局或资料保存成功。';};}
for(const name of ['packPick','packAdvanceChapter']){const old=name==='packPick'?packPick:packAdvanceChapter;const guard=function(arg){const th=name==='packPick'?S.threads[curT]:arg;if(own(th)&&!state(th).goals[th.pk.ch]){toast('先核对这一章的目标和实际行动。');return;}if(own(th))E.closeChapter(state(th),th.pk.ch);return old.apply(this,arguments);};if(name==='packPick')packPick=guard;else packAdvanceChapter=guard;}
const open=packOpen;packOpen=function(th,n){if(own(th)){if(n>1&&!state(th).goals[n-1])return Promise.resolve();configure(wd(th.wid));}return open.apply(this,arguments);};
const modes=packModes;packModes=function(w){return w?.community===R.work_id?[{as:w.you94,t:'扮演我自己'}]:modes.apply(this,arguments);};
const match=mgMatch;mgMatch=function(){return own(S.threads[curT])?null:match.apply(this,arguments);};
for(const g of R.games)MG100.push({id:'g_'+g.id,zh:g.title,en:g.title,tpl:'bride_cards',spec:g});
MG_T.bride_cards=function(area,G,sub,done){const g=G.spec;sub.textContent='可选核查：'+g.question;const start=document.createElement('button');start.textContent='开始（也可直接跳过）';area.replaceChildren(start);start.onclick=()=>{area.replaceChildren();const p=document.createElement('p');p.textContent=g.options;area.append(p);const input=document.createElement('input');input.placeholder='输入编号、配对或意思相同的回答';area.append(input);const submit=document.createElement('button');submit.textContent='提交';const note=document.createElement('p');area.append(submit,note);let active=false;submit.onclick=async()=>{if(active||!input.value.trim())return;active=true;submit.disabled=true;try{const r=await ask('核对可选调查小游戏。接受中文自由回答和编号。不是答案则unknown。只返回JSON {"result":"win|lose|unknown"}。'+JSON.stringify({question:g.question,options:g.options,answer:g.answer,response:input.value}),{maxTokens:80,timeout:12000,modelTier:'default'});if(['win','lose'].includes(r?.result)){done(r.result);return;}note.textContent='可以换种说法，也可跳过；必要线索仍会交代。';}catch(_){note.textContent='暂时没能核对，可以重试或跳过。';}active=false;submit.disabled=false;};};};
const result=mgResult;mgResult=function(th,d,r){const g=R.games.find(x=>'g_'+x.id===d.id);if(!own(th)||!g)return result.apply(this,arguments);const s=state(th);if(s.games[g.id]||!scene(s.scene).games.includes(g.id))return [];s.games[g.id]=r;pkSet(th,'mg_'+g.id+'_'+r);const beats=fact(th,g.id);save();return beats;};
const assets=off94Assets;off94Assets=async function(id){const a=await assets.apply(this,arguments);return id===R.work_id?(OFF94.assets[id]=Object.assign({},a,R.assets)):a;};
const feed=off94Feed;off94Feed=async function(){const list=await feed.apply(this,arguments);const w=list.find(x=>x.id===R.work_id);if(w)w.A=Object.assign({},w.A,R.assets);return list;};
if(typeof MSGKIND!=='undefined')MSGKIND.inline('bride:detail',['brideDetail'],function(m,i,th,next){if(m.k!=='brideDetail'||!own(th)||!R.assets[m.slot])return next(m,i,th);return '<div class="m-card"><button class="btn btn-sm" data-bride-open="'+esc(m.slot)+'">查看'+esc(m.caption||'线索图')+'</button></div>';});
window.addEventListener('click',function(e){const b=e.target.closest('[data-bride-open]'),th=S.threads[curT];if(!b||!own(th))return;const slot=b.dataset.brideOpen;if(R.assets[slot])off94Show({src:R.assets[slot],cap:'线索图；查看不等于已经对外公开。'},false);});
const style=document.createElement('style');style.textContent='.av img[src*="brides-reckoning-v1/characters/"]{object-position:50% 22%}';document.head.appendChild(style);
window.BRIDE_RUNTIME={render,canAdvance,options,configure};
})();
