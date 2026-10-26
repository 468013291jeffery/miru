/* ---- v126 your turn, in your words ----
   Step 1: pick HOW you answer (an attitude read from what each option does to the relationship).
   Step 2: see the line, add a body move, rewrite it in your own words if you like, then say it.
   The branch that follows is the one belonging to the attitude you chose. */
const ATT={
 flirt:{i:"😏",c:"#EE6F97",zh:"撩回去",en:"Flirt back",act:{zh:["往前半步","盯着他的嘴","勾住他的领带"],en:["steps closer","looks at his mouth","hooks a finger in his tie"]}},
 push:{i:"🗡",c:"#E36A6A",zh:"顶回去",en:"Push back",act:{zh:["把文件夹合上","往后一靠","冷笑一声"],en:["snaps the folder shut","leans back","laughs, short and cold"]}},
 press:{i:"⚡",c:"#FFB35C",zh:"逼问到底",en:"Press him",act:{zh:["一步不让","按住他的手","挡住车门"],en:["doesn't give an inch","pins his hand","blocks the door"]}},
 soft:{i:"🤍",c:"#B9A4FF",zh:"示弱靠近",en:"Let him in",act:{zh:["声音放低","别开视线","碰了碰他的手腕"],en:["voice drops","looks away","touches his wrist"]}},
 honest:{i:"🤝",c:"#7CC8FF",zh:"认真回答",en:"Straight answer",act:{zh:["直视他","深吸一口气","把手机扣在腿上"],en:["looks right at him","takes a breath","turns his phone face-down"]}},
 cold:{i:"😶",c:"#9AA3B5",zh:"冷处理",en:"Shut it down",act:{zh:["移开目光","没接话","看向窗外"],en:["looks away","lets it hang","watches the window"]}},
 move:{i:"✱",c:"#F0B77E",zh:"用动作回应",en:"Answer with a move",act:null},
 deny:{i:"🙄",c:"#F0B77E",zh:"嘴硬",en:"Deny it",act:{zh:["面不改色","挑了下眉","耳根却红了"],en:["doesn't blink","raises an eyebrow","ears going red anyway"]}},
 dodge:{i:"🫥",c:"#9AA3B5",zh:"躲开",en:"Dodge",act:null},
 tease:{i:"😉",c:"#FF8FB8",zh:"调侃他",en:"Tease him",act:{zh:["歪了下头","嘴角一挑","故意慢慢说"],en:["tilts his head","half a smile","says it slowly, on purpose"]}},
 bold:{i:"🔥",c:"#FF6B6B",zh:"主动越界",en:"Cross the line",act:null},
 kiss:{i:"💋",c:"#FF4D8D",zh:"吻上去",en:"Kiss him",act:null},
 provoke:{i:"🧨",c:"#FF9F43",zh:"故意刺他",en:"Needle him",act:{zh:["看着他的反应","语气很随意","转着手里的笔"],en:["watching his face","all casual","turning a pen in his fingers"]}},
 jealous:{i:"😤",c:"#E36A6A",zh:"吃醋",en:"Jealous",act:{zh:["下颌收紧","把手机扣在桌上"],en:["jaw tight","sets the phone face-down"]}},
 probe:{i:"🔍",c:"#7CC8FF",zh:"试探",en:"Probe",act:{zh:["盯着他的眼睛","放慢语速","把东西推到他面前"],en:["watching his eyes","slowing down","pushes it across to him"]}},
 guard:{i:"🕶",c:"#9AA3B5",zh:"公事公办",en:"All business",act:{zh:["扫了一眼四周","按了下耳机"],en:["checks the street","touches his earpiece"]}},
 restrain:{i:"🧊",c:"#8FB8FF",zh:"克制",en:"Hold back",act:null},
 protect:{i:"🛡",c:"#5FD39A",zh:"护着他",en:"Protect him",act:{zh:["挡在他前面","手按在他后背"],en:["steps in front of him","hand on his back"]}},
 secret:{i:"🤫",c:"#B9A4FF",zh:"偷偷收着",en:"Keep it secret",act:null},
 inner:{i:"💭",c:"#8C6FE0",zh:"藏在心里",en:"Keep it inside",act:null}};
function attOf(th,o){if(o.att&&ATT[o.att])return o.att;if(o.k==="think")return "inner";
 let d={};try{if(o.rd){const v=Object.values(o.rd)[0];d=v||{}}else d=dimRule(o)}catch(_){}
 const at=d.att||0,te=d.ten||0,tr=d.tru||0,gr=d.gru||0,lv=o.love||0;
 if(o.k==="act")return (at>0||lv>0||te>=3)?"flirt":"move";
 if(tr<0||gr>0||lv<0)return te>=3?"push":"cold";
 if(at>0&&te>=3)return "flirt";
 if(tr>0&&at>0)return "soft";
 if(tr>0)return "honest";
 if(te>0)return "press";
 return "cold"}
function attList(th,d){const seen={};return d.opts.map((o,i)=>{let k=attOf(th,o);if(seen[k]&&!o.att){const alt={flirt:"soft",push:"press",press:"push",soft:"honest",honest:"soft",cold:"honest",move:"flirt",inner:"cold"}[k];if(alt&&!seen[alt])k=alt}seen[k]=1;return {i,k,o}})}
let CH=null;
const _stopHTML27=stopHTML;
stopHTML=function(th){const b=th.pk.stop;if(!b||b[1]!=="line")return _stopHTML27(th);const d=b[2],zh=S.lang==="zh",lang=zh?"zh":"en";
 const who=first(ch(th.pk.as)?ch(th.pk.as).n:"");const hint=d.hint?'<p class="pkask">'+esc(Lz(d.hint))+'</p>':'';
 if(CH&&CH.b!==b)CH=null;
 const A=attList(th,d);
 if(!CH)return '<div class="sttag you">🎭 '+t("st.yourTurn",{n:who})+'</div>'+hint+'<p class="chq">'+t("ch27.how")+'</p><div class="chatt">'+
  A.map(a=>{const x=ATT[a.k];return '<button data-chatt="'+a.i+'" style="--ac:'+x.c+'"><b>'+x.i+' '+x[lang]+'</b><span>'+esc(Lz(a.o.t))+'</span></button>'}).join("")+'</div><p class="pkhint">'+t(liveOn()?"st.typeLive":"st.type")+'</p>';
 const a=A.find(z=>z.i===CH.i),x=ATT[a.k],acts=x.act?x.act[lang]:[];
 return '<div class="sttag you">🎭 '+t("st.yourTurn",{n:who})+'</div>'+
  '<div class="chstep" style="--ac:'+x.c+'"><div class="chh"><button class="chback" data-chback="1">‹ '+t("ch27.back")+'</button><b>'+x.i+' '+x[lang]+'</b></div>'+
  (acts.length?'<p class="chl">'+t("ch27.add")+'</p><div class="chacts">'+acts.map((s,j)=>'<button data-chact="'+j+'" class="'+(CH.act===j?"on":"")+'">✱ '+esc(s)+'</button>').join("")+'</div>':'')+
  '<p class="chl">'+t("ch27.words")+'</p><textarea id="chTxt" rows="2" maxlength="80">'+esc(CH.txt)+'</textarea>'+
  /* 2026-10-27 Ann：这一行和上面的输入框是同一句，看着重复 ⇒ 去掉；
   chPreview 保留（别处还在用），只是这里不再渲染。 */

  '<button class="btn btn-p btn-block chgo" data-chgo="1">'+t("ch27.go")+' →</button><p class="pkhint">'+t("ch27.note")+'</p></div>'};
function chText(th){const d=th.pk.stop[2],a=attList(th,d).find(z=>z.i===CH.i),x=ATT[a.k],lang=S.lang==="zh"?"zh":"en";
 const act=x.act&&CH.act!=null?x.act[lang][CH.act]:"";const w=(CH.txt||"").trim()||Lz(a.o.t);return (act?"*"+act+"* ":"")+w}
function chPreview(th){try{return '<small>'+t("ch27.prev")+'</small>'+fmtMix(esc(chText(th)))}catch(_){return ""}}
document.addEventListener("input",e=>{if(e.target&&e.target.id==="chTxt"&&CH){CH.txt=e.target.value;const p=$("#chPrev");const th=S.threads[curT];if(p&&th)p.innerHTML=chPreview(th)}});
document.addEventListener("click",e=>{let x;const th=S.threads[curT];if(!th||!th.pk||!th.pk.stop||th.pk.stop[1]!=="line")return;const b=th.pk.stop,d=b[2];
 if(x=e.target.closest("[data-chatt]")){const i=+x.dataset.chatt;CH={b,i,act:null,txt:Lz(d.opts[i].t)};packRefresh(th);setTimeout(()=>{const ta=$("#chTxt");if(ta)ta.scrollIntoView({block:"nearest"})},50);return}
 if(e.target.closest("[data-chback]")){CH=null;packRefresh(th);return}
 if(x=e.target.closest("[data-chact]")){const j=+x.dataset.chact;CH.act=CH.act===j?null:j;packRefresh(th);return}
 if(e.target.closest("[data-chgo]")){const o=d.opts[CH.i],keep=o.t,txt=chText(th),i=CH.i;CH=null;o.t=txt;
  const btn=document.createElement("button");btn.dataset.stopline=String(i);btn.hidden=true;document.body.appendChild(btn);try{btn.click()}finally{btn.remove();o.t=keep}return}});
Object.assign(I18N.zh,{"ch27.how":"你想怎么回他？","ch27.back":"换个态度","ch27.add":"加个动作（可选）","ch27.words":"用你自己的话说（可以改）","ch27.prev":"你会这样说：","ch27.go":"就这么说","ch27.note":"意思别改太远——他会按你选的态度接下去。"});
Object.assign(I18N.en,{"ch27.how":"How do you answer him?","ch27.back":"Different approach","ch27.add":"Add a move (optional)","ch27.words":"Say it your way (edit freely)","ch27.prev":"You'll say:","ch27.go":"Say it","ch27.note":"Keep the meaning close — he'll answer the attitude you picked."});
