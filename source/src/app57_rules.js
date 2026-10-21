/* ================= v2.3 · UGC CONSTRAINTS — the generation rules every AI call follows + the publish-time auto-review =================
   Distilled from the ISE docs (系统1 世界内核 · 六 AI 分工 · 分支与结局 · 独立互动与付费 · 内容工厂 · 人物框架) and the narrative upgrade
   (长短分支 / 道具 / 汇合 / 人物弧光 / 自由对话 / 流水线). Two halves:
   1) MIRU_GEN_RULES — appended to every creator-side LLM call (architect / scene writer / rewrite / options), so what users generate is
      shaped before it exists.
   2) miruQA(world) — runs on publish (creator, import). Red = must fix (content safety blocks publishing), amber = should fix, green = passed. */
/* v2.9: the generation rules now come from the single source MIRU_RULES (终版) — see miru_rules.js / rules_final.md */
const MIRU_GEN_RULES=MIRU_RULES.gen;
const _crSys57=crSys;crSys=function(p,path){return _crSys57(p,path)+"\n"+MIRU_GEN_RULES};
/* ---------- the auto-review ---------- */
const QA_MINOR=/(未成年|初中生|小学生|中学生|高中生|(?:^|[^\d])1[0-7]\s*岁|十[一二三四五六七]岁|underage|\b1[0-7]\s*(?:yo|years? old))/i;
function qaText(x){let s="";const walk=v=>{if(v==null)return;if(typeof v==="string"){s+=v+"\n";return}if(Array.isArray(v)){v.forEach(walk);return}if(typeof v==="object")Object.keys(v).forEach(k=>walk(v[k]))};walk(x);return s}
function qaSafety(text){const out=[];const t2=text.replace(/鼓起(勇气|腮|掌|嘴)/g,"").replace(/(青筋|血管|脸颊|肌肉|腮帮)[^。，,.]{0,8}鼓起/g,"").replace(/硬物(砸|落|撞)/g,"");
 const ex=(typeof IM_EXPLICIT!=="undefined"?IM_EXPLICIT:[]).filter(w=>t2.toLowerCase().includes(w.toLowerCase()));
 if(ex.length)out.push(LL("出现露骨描写词：","Explicit wording: ")+ex.slice(0,4).join("、"));
 const rx=new RegExp(QA_MINOR.source,"gi");let m;while((m=rx.exec(text))){const win=text.slice(Math.max(0,m.index-30),m.index+m[0].length+30);
  if(/(那年|那时|小时候|当年|以前|years ago|when (?:i|we|he) was)/i.test(win))continue;
  if(/(亲吻|接吻|吻了|恋爱|暧昧|心动|上床|kiss|dating|crush on|in love)/i.test(win)){out.push(LL("疑似未成年人恋爱内容：「","Possible minor in a romance: \"")+win.replace(/\s+/g," ").trim().slice(0,40)+LL("」——所有角色必须是成年人","\" — every character must be an adult"));break}}
 return out}
function qaBeats(o){return Array.isArray(o)?o:o?(o.zh||o.en||[]):[]}
function miruQA(w){const P=w&&w.pack,R={err:[],warn:[],ok:[],stats:{}};if(!P||!P.chapters||!P.chapters.length){R.err.push(LL("没有任何章节","No chapters"));return R}
 const set=new Set(),read=new Set(),given=new Set(),needed=new Set(),longs=[],joins=new Set(),st=R.stats;Object.assign(st,{ch:P.chapters.length,beats:0,choices:0,short:0,long:0,items:0,decide:0,games:0,fx:0,bgm:0,talkHooks:(P.hooks||[]).length,paid:0});
 const condWalk=c=>{if(!c)return;if(c.flag)read.add(c.flag);if(c.not)read.add(c.not);if(c.item||c.noitem)needed.add(c.item||c.noitem);(c.any||[]).concat(c.all||[]).forEach(condWalk)};
 const walk=(L,where)=>{qaBeats(L).forEach(b=>{if(!Array.isArray(b))return;st.beats++;const d=b[2]||{};
  if(b[0]==="sys"){
   if(b[1]==="set")[].concat(d.flags||d.flag||[]).forEach(f=>set.add(f));
   if(b[1]==="if"){condWalk(d.cond);walk(d.then,where);walk(d.else,where)}
   if(b[1]==="item"){if(d.give){given.add(d.give);st.items++}}
   if(b[1]==="use"){needed.add(d.item);if(!d.else||!qaBeats(d.else).length)R.err.push(where+LL("：道具『"+d.item+"』的使用点没有「不用道具」的替代解法",": using "+d.item+" has no alternative path"));walk(d.then,where);walk(d.else,where)}
   if(b[1]==="branch"){if(d.len==="long"){st.long++;longs.push([d.id,where]);set.add("br_"+d.id)}else st.short++;walk(d.then,where)}
   if(b[1]==="join"&&d.id)joins.add(d.id);
   if(b[1]==="decide"){st.decide++;if(!d.else)R.warn.push(where+LL("：角色自主决定缺少兜底分支(else)","：decide without else"));Object.values(d.by||{}).forEach(x=>walk(x,where));walk(d.else,where)}
   if(b[1]==="game"||b[1]==="mg"){st.games++;walk(d.win,where);walk(d.lose,where);walk(d.skip,where)}if(b[1]==="fx"||b[1]==="sfx")st.fx++;if(b[1]==="bgm")st.bgm++}
  else if(["photo","video","voice"].includes(b[1]))st.paid++;
  else if(b[1]==="line"||b[1]==="pick"){(d.opts||[]).forEach(o=>{[].concat(o.set||[]).forEach(f=>set.add(f));if(o.give)given.add(o.give);walk(o.then,where)})}})};
 P.chapters.forEach((c,i)=>{const where=LL("第"+(i+1)+"章","Ch"+(i+1));walk(c.beats,where);const ch0=c.choices||[];st.choices+=ch0.length;
  ch0.forEach(x=>{[].concat(x.set||[]).forEach(f=>set.add(f));if(x.give)given.add(x.give);if(x.need)needed.add(x.need);if(x.len==="long"){st.long++;set.add("br_ch"+(i+1)+"_"+x.k)}walk(x.then,where)});
  if(ch0.some(x=>x.need)&&!ch0.some(x=>!x.need))R.err.push(where+LL("：所有选项都要道具——没有道具的读者会卡住","：every option needs an item"));
  const n=qaBeats(c.beats).length;if(c.outline||n<4){(R._ol=R._ol||[]).push(i+1)}else if(n<6)R.warn.push(where+LL("：只有 "+n+" 行，太短（建议 30–90 行）"," is very short ("+n+" lines)"));if(n>160)R.warn.push(where+LL("：超过 160 行，建议拆章"," is over 160 lines"));
  const inter=ch0.length>=2||qaBeats(c.beats).some(b=>Array.isArray(b)&&["line","myline","pick","use"].includes(b[1]));if(!inter&&i<P.chapters.length-1)R.warn.push(where+LL("：没有读者介入点（选项或轮到你说）","：no point where the reader acts"))});
 if(R._ol){R.warn.push(LL("还只是大纲、没写成正文的章节：第 "+R._ol.join("、")+" 章（读者会看到 AI 现场生成的版本）","Outline-only chapters: "+R._ol.join(", ")));delete R._ol}
 (P.hooks||[]).forEach(h=>{if(h&&h.set)set.add(h.set)});
 /* reachability of endings: every ending key must be the key of a last-chapter choice */
 const last=P.chapters[P.chapters.length-1],keys=new Set((last.choices||[]).map(x=>x.k)),E=P.endings||{};
 Object.keys(E).forEach(k=>{if(E[k]&&Lz(E[k].txt)&&!keys.has(k))R.warn.push(LL("结局 "+k+" 不可达（最后一章没有对应选项）","Ending "+k+" is unreachable"))});
 if(!Object.keys(E).some(k=>E[k]&&Lz(E[k].txt)))R.warn.push(LL("还没写结局文字","No ending text yet"));
 const deadR=[...read].filter(f=>!set.has(f)&&!/^seed_|^evidence_|^delayed_/.test(f));if(deadR.length)R.warn.push(LL("这些标记被判断但从未被设置（那条分支永远走不到）：","Flags checked but never set: ")+deadR.slice(0,6).join("、"));
 const deadI=[...needed].filter(x=>!given.has(x));if(deadI.length)R.warn.push(LL("这些道具被使用但没有获得点：","Items used but never given: ")+deadI.join("、"));
 const unusedI=[...given].filter(x=>!needed.has(x));if(unusedI.length)R.warn.push(LL("这些道具拿到后从没用上：","Items never used: ")+unusedI.join("、"));
 longs.forEach(([id,where])=>{if(!read.has("br_"+id)&&!joins.has(id))R.warn.push(where+LL("：长分支「"+id+"」之后既没被读取也没汇合——它其实只是短分支","：long branch "+id+" is never read or joined"))});
 if(st.games>P.chapters.length*2)R.warn.push(LL("小游戏太多（每章最多 2 个）","Too many mini-games"));
 /* safety: blocks publishing */
 qaSafety(qaText([P.chapters.map(c=>[c.t,c.goal,c.beats,(c.choices||[]).map(x=>[x.t,x.then])]),P.endings,w.title,w.premise,w.hook])).forEach(x=>R.err.push("⛔ "+x));
 /* passed checks */
 if(!R.err.length)R.ok.push(LL("安全红线：通过","Safety: passed"));
 R.ok.push(LL(st.ch+" 章 · "+st.beats+" 行 · "+st.choices+" 个章末选项",st.ch+" chapters · "+st.beats+" lines · "+st.choices+" choices"));
 if(st.long||st.short)R.ok.push(LL("分支：短 "+st.short+" · 长 "+st.long,"Branches: short "+st.short+" · long "+st.long));
 if(st.items)R.ok.push(LL("道具 "+st.items+" 件","Items: "+st.items));if(st.decide)R.ok.push(LL("角色自主决定 "+st.decide+" 处","Character decisions: "+st.decide));
 R.ok.push(LL("付费点 "+st.paid+" 个，全部可免费跳过","Paid moments: "+st.paid+", all skippable"));
 R.score=Math.max(0,100-R.err.length*25-R.warn.length*6);return R}
function qaHTML(R,title){const li=(a,c)=>a.map(x=>'<li class="'+c+'">'+esc(x)+'</li>').join("");
 return '<div class="qa57"><h3>📋 '+esc(title||LL("发布审稿报告","Publish review"))+' <small>'+R.score+' / 100</small></h3>'+
  (R.err.length?'<p class="qh r">'+LL("必须修改","Must fix")+'</p><ul>'+li(R.err,"r")+'</ul>':'')+(R.warn.length?'<p class="qh a">'+LL("建议修改","Should fix")+'</p><ul>'+li(R.warn,"a")+'</ul>':'')+
  '<p class="qh g">'+LL("已通过","Passed")+'</p><ul>'+li(R.ok,"g")+'</ul><button class="btn btn-p btn-block" data-qaok="1">'+LL("知道了","Got it")+'</button></div>'}
document.addEventListener("click",e=>{if(e.target.closest("[data-qaok]"))closeSheet()});
/* creator publish: safety blocks, everything else is reported after publishing */
(function(){const B=window.MIRU_BRIDGE;if(!B||!B.publish)return;const _pub=B.publish;
 B.publish=function(story,proj,sb){const bad=qaSafety(qaText([story,proj]));
  if(bad.length){sheet(qaHTML({err:bad.map(x=>"⛔ "+x),warn:[],ok:[],score:0},LL("未通过安全审核 · 没有发布","Not published — safety review")));return}
  const r=_pub.apply(this,arguments);try{const wid=S.crmap&&proj&&S.crmap[proj.id],w=wid&&wd(wid);if(w){const R=miruQA(w);w.pack.qa={score:R.score,err:R.err.length,warn:R.warn.length,at:Date.now()};save();
   if(R.err.length||R.warn.length)setTimeout(()=>sheet(qaHTML(R)),900)}}catch(_){}return r}})();
(function(){const st=document.createElement("style");st.textContent=`
.qa57 h3{margin:0 0 10px;font-size:17px}.qa57 h3 small{font-size:12px;color:#F0B77E;margin-left:6px}.qa57 ul{margin:0 0 10px;padding:0;list-style:none}
.qa57 li{font-size:13px;line-height:1.5;padding:6px 10px;border-radius:10px;margin-bottom:5px}.qa57 li.r{background:rgba(238,111,111,.14);color:#FFC4C4}.qa57 li.a{background:rgba(240,183,126,.12);color:#F6D3AE}.qa57 li.g{background:rgba(127,196,166,.1);color:#CDEBDD}
.qa57 .qh{font-size:11.5px;font-weight:800;margin:8px 0 4px;letter-spacing:.04em}.qa57 .qh.r{color:#FF8E8E}.qa57 .qh.a{color:#F0B77E}.qa57 .qh.g{color:#7FC4A6}`;document.head.appendChild(st)})();
