/* ================= BACKGROUND MUSIC in every chat =================
   Each story gets a mood from its genre (late-night jazz bar, dark romance, cozy rom-com, romantasy, bittersweet, sports, sci-fi).
   Music is generated live with Web Audio — no files to download. If art/bgm/<storyId>.mp3 exists it plays that instead (BGM_FILES, built at compile time).
   Inside a story the mood follows the plot: a blackout turns it tense, a near-kiss turns it intimate.
   🎵 button in the chat header turns it on/off (remembered). Music ducks while a voice line plays. Starts on the first tap (mobile autoplay rules). */
const BGM_MOODS={
 night:{bpm:72,ch:[[50,53,57,60,64],[43,53,57,59,64],[48,52,55,59,62],[45,52,55,58,61]],arp:[0,2,1,3,2,4,3,1],sw:.16,wave:"sine",cut:1700,brush:1,bass:1,vel:.5},
 dark:{bpm:54,ch:[[38,45,50,53],[34,41,46,50],[36,43,48,51],[33,45,49,52]],arp:[3,-1,2,-1,1,-1,2,-1],wave:"sawtooth",cut:650,bass:1,bell:1,vel:.4},
 warm:{bpm:96,ch:[[48,52,55,60],[41,48,53,57],[45,52,57,60],[43,50,55,59]],arp:[0,2,1,3,0,2,1,3],wave:"triangle",cut:2600,bass:1,vel:.45},
 fantasy:{bpm:64,ch:[[50,54,57,62],[50,52,56,59],[47,54,59,62],[43,50,55,59]],arp:[0,1,2,3,2,1,3,-1],wave:"triangle",cut:1500,bell:1,vel:.4},
 sad:{bpm:60,ch:[[45,52,57,60],[41,48,53,57],[48,52,55,60],[43,50,55,59]],arp:[0,2,3,2,1,2,3,-1],wave:"sine",cut:1400,bass:1,vel:.5},
 sport:{bpm:112,ch:[[40,47,52,55],[36,43,48,52],[43,50,55,59],[38,45,50,54]],arp:[0,0,2,0,1,0,3,0],wave:"square",cut:1100,bass:1,pulse:1,vel:.28},
 scifi:{bpm:58,ch:[[48,55,59,64],[41,48,57,64],[45,52,59,64],[43,50,57,62]],arp:[3,-1,-1,2,-1,-1,1,-1],wave:"sine",cut:2200,bell:1,vel:.35},
 tense:{bpm:84,ch:[[38,44,50],[37,44,49],[38,45,51],[36,43,49]],arp:[0,-1,0,-1,0,-1,1,-1],wave:"sawtooth",cut:520,bass:1,pulse:1,vel:.35},
 intimate:{bpm:58,ch:[[52,56,59,63,66],[49,52,56,59,64],[45,52,56,61,64],[47,51,54,59,63]],arp:[0,2,4,3,1,3,4,-1],wave:"sine",cut:1300,vel:.42}};
const BGM_SCENE=[[/dark|blackout|basement|s3$/,"tense"],[/nearkiss|shoulder|squeeze|collar|forehead|s4$|candle/,"intimate"],[/party|toast|glass|thumb|group|s1$/,"night"]];
const BGM_NAME={night:"🎷 深夜爵士",dark:"🖤 暗夜弦乐",warm:"☀️ 轻快心动",fantasy:"✨ 奇幻",sad:"🌧 温柔感伤",sport:"⚡ 热血节拍",scifi:"🌌 星际漂流",tense:"⚠️ 紧张",intimate:"🌙 暧昧"};
function bgmMoodOf(wid){const w=wd(wid);if(!w)return"warm";if(w.bgm)return w.bgm;const s=(w.tags||[]).join(" ")+" "+w.id;
 if(/afterhours|Jazz|Bar\b|Club|Billionaire|Heir/.test(s))return"night";if(/Dark|Vampire|Mafia|Bratva|Morally/.test(s))return"dark";if(/Sci-Fi|Space/.test(s))return"scifi";
 if(/Fae|Dragon|Werewol|Romantasy/.test(s))return"fantasy";if(/Bittersweet|Ghost|Second Chance/.test(s))return"sad";if(/Hockey|F1|Esports|Football|Roller/.test(s))return"sport";return"warm"}
const BGM={ctx:null,master:null,mood:null,timer:null,step:0,next:0,file:null,want:null,duck:1};
function bgmOn(){return S.bgm!==false}
function bgmInit(){if(BGM.ctx)return true;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;BGM.ctx=new C();
 const m=BGM.ctx.createGain();m.gain.value=0;const comp=BGM.ctx.createDynamicsCompressor();m.connect(comp);comp.connect(BGM.ctx.destination);BGM.master=m;
 /* soft room reverb */const len=BGM.ctx.sampleRate*2.2,ir=BGM.ctx.createBuffer(2,len,BGM.ctx.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3)}
 const rv=BGM.ctx.createConvolver();rv.buffer=ir;const rg=BGM.ctx.createGain();rg.gain.value=.35;rv.connect(rg);rg.connect(m);BGM.rev=rv;
 const nb=BGM.ctx.createBuffer(1,BGM.ctx.sampleRate,BGM.ctx.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;BGM.noise=nb;return true}catch(e){return false}}
const mtof=n=>440*Math.pow(2,(n-69)/12);
function bgmNote(n,t,dur,o){const c=BGM.ctx,g=c.createGain(),f=c.createBiquadFilter();f.type="lowpass";f.frequency.value=o.cut||1500;
 const os=c.createOscillator();os.type=o.wave||"sine";os.frequency.value=mtof(n);if(o.det)os.detune.value=o.det;os.connect(f);f.connect(g);g.connect(BGM.master);g.connect(BGM.rev);
 const v=o.vel||.3,a=o.att||.01;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0008,t+dur);os.start(t);os.stop(t+dur+.05)}
function bgmNoise(t,dur,v,freq){const c=BGM.ctx,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=BGM.noise;f.type="bandpass";f.frequency.value=freq||6000;f.Q.value=.8;
 s.connect(f);f.connect(g);g.connect(BGM.master);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0005,t+dur);s.start(t,Math.random()*.5);s.stop(t+dur+.02)}
function bgmTick(){const M=BGM_MOODS[BGM.mood];if(!M||!BGM.ctx)return;const c=BGM.ctx,eighth=60/M.bpm/2;
 while(BGM.next<c.currentTime+.4){const t=BGM.next,i=BGM.step,bar=Math.floor(i/8)%M.ch.length,ch=M.ch[bar],k=i%8;
  if(k===0){/* pad: whole chord, slow attack */ch.forEach((n,j)=>{bgmNote(n+12,t,eighth*8.6,{wave:M.wave==="square"?"triangle":M.wave,cut:M.cut*.7,vel:.045*M.vel*2,att:eighth*2.5,det:j%2?7:-7})});
   if(M.bass)bgmNote(ch[0]-12,t,eighth*7,{wave:"sine",cut:400,vel:.22*M.vel*2,att:.03})}
  if(M.bass&&k===4&&!M.pulse)bgmNote(ch[0]-12+(bar%2?7:0),t,eighth*3.5,{wave:"sine",cut:400,vel:.16*M.vel*2,att:.03});
  if(M.pulse&&k%2===0)bgmNote(ch[0]-12,t,eighth*.9,{wave:"triangle",cut:500,vel:.1*M.vel*2});
  const ai=M.arp[k];if(ai>=0&&ch[ai%ch.length]!=null){const sw=(k%2&&M.sw)?eighth*M.sw:0;bgmNote(ch[ai%ch.length]+24,t+sw,eighth*(M.bell?6:3),{wave:M.bell?"sine":M.wave==="sawtooth"?"triangle":M.wave,cut:M.cut*1.6,vel:.07*M.vel*2})}
  if(M.bell&&k===6&&bar%2===0)bgmNote(ch[ch.length-1]+36,t,eighth*10,{wave:"sine",cut:5000,vel:.03});
  if(M.brush){if(k%2===1)bgmNoise(t+(M.sw?eighth*M.sw:0),.08,.035,7000);if(k===2||k===6)bgmNoise(t,.18,.05,3500)}
  BGM.next+=eighth;BGM.step++}}
function bgmGain(v,sec){if(!BGM.master)return;const c=BGM.ctx,g=BGM.master.gain;g.cancelScheduledValues(c.currentTime);g.setValueAtTime(g.value,c.currentTime);g.linearRampToValueAtTime(v,c.currentTime+(sec||1.5))}
function bgmLevel(){return .55*BGM.duck}
function bgmPlay(mood,wid){BGM.want={mood,wid};if(!bgmOn())return;
 const f=(window.BGM_FILES||{})[wid];
 if(f){if(BGM.file&&BGM.file.dataset.src===f){if(BGM.file.paused)BGM.file.play().catch(()=>{});return}bgmStop(true);const a=new Audio(f);a.loop=true;a.volume=.35*BGM.duck;a.dataset.src=f;BGM.file=a;a.play().catch(()=>{});return}
 if(!bgmInit())return;if(BGM.ctx.state==="suspended")BGM.ctx.resume().catch(()=>{});
 if(BGM.mood===mood&&BGM.timer)return;
 if(BGM.timer){/* crossfade to the new mood at the next bar */bgmGain(0,.8);setTimeout(()=>{BGM.mood=mood;BGM.step=0;BGM.next=BGM.ctx.currentTime+.05;bgmGain(bgmLevel(),2)},850);bgmChip();return}
 BGM.mood=mood;BGM.step=0;BGM.next=BGM.ctx.currentTime+.1;BGM.timer=setInterval(bgmTick,120);bgmGain(bgmLevel(),2.5);bgmChip()}
function bgmStop(keepWant){if(!keepWant)BGM.want=null;if(BGM.file){try{BGM.file.pause()}catch(_){}BGM.file=null}
 if(BGM.timer){bgmGain(0,.6);const tm=BGM.timer;BGM.timer=null;setTimeout(()=>{if(!BGM.timer)clearInterval(tm);else clearInterval(tm)},700);BGM.mood=null}}
function bgmForThread(th){if(!th)return null;const wid=th.wid||((ch(th.cast[0])||{}).w);let mood=bgmMoodOf(wid);
 if(th.pk&&th.pk.bg){const hit=BGM_SCENE.find(([re])=>re.test(th.pk.bg));if(hit)mood=hit[1]}return {mood,wid}}
function bgmChip(){const b=$(".chead .bgmtog");if(!b)return;b.classList.toggle("on",bgmOn());b.textContent=bgmOn()?"🎵":"🎵̸";b.title=bgmOn()&&BGM.mood?BGM_NAME[BGM.mood]||"":""}
/* header button */
const _renderChat19=renderChat;
renderChat=function(){_renderChat19.apply(this,arguments);const hd=$(".chead .vtog")||$(".chead [data-cmenu]");
 if(hd&&!$(".chead .bgmtog"))hd.insertAdjacentHTML("beforebegin",'<button class="ibtn bgmtog'+(bgmOn()?" on":"")+'" data-bgm="1" aria-label="music">🎵</button>');bgmChip();
 const th=S.threads[curT],w=bgmForThread(th);if(w&&bgmOn()){if(BGM.ctx&&BGM.ctx.state==="running"||BGM.file)bgmPlay(w.mood,w.wid);else BGM.want=w}};
document.addEventListener("click",e=>{if(!e.target.closest("[data-bgm]"))return;S.bgm=!bgmOn();save();
 if(bgmOn()){const w=bgmForThread(S.threads[curT]);if(w)bgmPlay(w.mood,w.wid);toast("🎵 "+(BGM_NAME[BGM.mood]||t("bgm.on")))}else{bgmStop();toast(t("bgm.off"))}bgmChip()});
/* first tap anywhere in the chat unlocks audio (mobile autoplay rules) */
["pointerdown","touchstart","keydown"].forEach(ev=>document.addEventListener(ev,()=>{const sc=$("#s-chat");if(!sc||sc.hidden||!bgmOn())return;const w=bgmForThread(S.threads[curT]);if(w&&!BGM.timer&&!BGM.file)bgmPlay(w.mood,w.wid);else if(BGM.ctx&&BGM.ctx.state==="suspended")BGM.ctx.resume()},{passive:true}));
/* stop when leaving the chat, follow the plot inside a story */
const _show19=show;show=function(id){_show19(id);if(id!=="s-chat")bgmStop()};
const _sceneBg19=sceneBg;sceneBg=function(th,img){_sceneBg19.apply(this,arguments);if(curT===th.id&&bgmOn()&&(BGM.timer||BGM.file)){const w=bgmForThread(th);if(w)bgmPlay(w.mood,w.wid)}};
/* duck under voice lines */
const _speak19=speak;speak=function(text,id,onend){BGM.duck=.35;if(BGM.timer)bgmGain(bgmLevel(),.3);if(BGM.file)BGM.file.volume=.35*BGM.duck;
 const back=()=>{BGM.duck=1;if(BGM.timer)bgmGain(bgmLevel(),1.2);if(BGM.file)BGM.file.volume=.35};const est=setTimeout(back,Math.max(2500,String(text||"").length*(S.lang==="zh"?260:75)));
 return _speak19(text,id,()=>{clearTimeout(est);back();if(onend)onend()})};
document.addEventListener("visibilitychange",()=>{if(!BGM.ctx)return;if(document.hidden)BGM.ctx.suspend().catch(()=>{});else if(BGM.timer)BGM.ctx.resume().catch(()=>{})});
Object.assign(I18N.en,{"bgm.on":"Music on","bgm.off":"Music off"});Object.assign(I18N.zh,{"bgm.on":"背景音乐已开启","bgm.off":"背景音乐已关闭"});

/* ================= 内心独白 · inner monologue =================
   At key moments the story drops ["sys","mono",{t:[[who,text],…]}]: what each person in the room is secretly thinking.
   It arrives sealed. Tap to read — 2 free a day, then 💎1 (it's the one thing you can't get by watching). */
const _pkDir19=pkDirective;
pkDirective=function(th,b){if(Array.isArray(b)&&b[0]==="sys"&&b[1]==="mono"){th.pk.q.shift();const L=(b[2]||{}).t||[];
  if(L.length){appendMsg(th,{who:"sys",k:"mono",t:L,at:Date.now()})}return true}return _pkDir19(th,b)};
function monoFree(){const d=today();if((S.monoDay||{}).d!==d)S.monoDay={d,n:0};return S.monoDay.n<2}
const _msgHTML19=msgHTML;
msgHTML=function(m,i,th){if(!m||m.k!=="mono")return _msgHTML19(m,i,th);
 return '<div class="m-mono'+(m.open?" open":"")+'"><div class="mmh">💜 '+t("mono.h")+'</div>'+
  (m.open?m.t.filter(([w])=>ch(w)).map(([w,x])=>'<p><b>'+esc(first(ch(w).n))+'：</b>'+esc(x)+'</p>').join(""):
   '<div class="mmlock">'+m.t.filter(([w])=>ch(w)).map(([w])=>avatar(w,26)).join("")+'<span>'+t("mono.peek")+'</span></div><button class="mmbtn" data-mono="'+i+'">'+(S.plus?t("mono.vip"):"💎 1 · "+t("mono.read"))+'</button>')+'</div>'};
document.addEventListener("click",e=>{const x=e.target.closest("[data-mono]");if(!x)return;const th=S.threads[curT],m=th&&th.msgs[+x.dataset.mono];if(!m||m.open)return;
 if(!S.plus&&!spend(1,"line"))return;m.open=true;save();renderChat()});
Object.assign(I18N.en,{"mono.h":"Inner monologue","mono.peek":"What they're really thinking right now","mono.free":"Read (free today)","mono.vip":"Read · members free","mono.read":"Read"});
Object.assign(I18N.zh,{"mono.h":"内心独白","mono.peek":"他们此刻心里在想什么","mono.free":"偷看（今日免费）","mono.vip":"偷看 · 会员免费","mono.read":"偷看"});

/* ================= MEMBERSHIP: weekly / monthly / yearly, auto-renew =================
   New members (within 24h of joining): weekly = first 7 days free, first renewal 60% off ($1.99), then $4.99/wk.
   Monthly first month $7.99 (then $9.99). Yearly first year $63.99 (then $79.99). Terms always shown before the button. */
const PLANS={week:{p:4.99,promo:0,renew:1.99,unit:"wk"},month:{p:9.99,promo:7.99,unit:"mo"},year:{p:79.99,promo:63.99,unit:"yr"}};
function planSelNow(){const pr=promoLeft()>0;if(!S.planSel||(!pr&&S.planSel==="week"&&false))return pr?"week":"year";return S.planSel}
function planCard(k,sel,pr){const P=PLANS[k],u=t("pl."+P.unit),on=k===sel?" on":"";
 if(k==="week")return '<button class="plan pl3'+on+'" data-plan="week">'+(pr?'<i class="trial">'+t("pl.trial")+'</i><em class="plcd">⏱ <span data-promocd="1">'+hms(promoLeft())+'</span></em>':'')+'<small>'+t("pl.week")+'</small><b>'+(pr?'$0 <s>$'+P.p+'</s>':'$'+P.p)+'</b><span>'+(pr?t("pl.renew60"):"/"+u)+'</span></button>';
 return '<button class="plan pl3'+on+'" data-plan="'+k+'">'+(k==="year"?'<i>'+t("pay.save33")+'</i>':'')+'<small>'+t("pl."+k)+'</small><b>'+(pr?'$'+P.promo+' <s>$'+P.p+'</s>':'$'+P.p)+'</b><span>'+(k==="year"?'≈ $'+((pr?P.promo:P.p)/52).toFixed(2)+'/'+t("pl.wk"):'/'+u)+'</span></button>'}
function planTerms(k,pr){const P=PLANS[k];if(k==="week")return pr?t("pl.tWeekP",{r:P.renew,p:P.p}):t("pl.tWeek",{p:P.p});
 return pr?t("pl.tFirst",{a:P.promo,p:P.p,u:t("pl."+P.unit)}):t("pl.tPlain",{p:P.p,u:t("pl."+P.unit)})}
function planBtn(k,pr){return k==="week"&&pr?t("pl.btnFree"):k==="week"?t("pl.btnSub"):pr?t("pl.btnDeal"):t("pl.btnSub")}
const _paySheet19=paySheet;
paySheet=function(why){_paySheet19(why);const pl=$(".sheet .plans");if(!pl)return;const pr=promoLeft()>0;let sel=S.planSel;if(!sel||!PLANS[sel])sel=pr?"week":"year";S.planSel=sel;
 pl.classList.add("plans3");pl.innerHTML=["week","month","year"].map(k=>planCard(k,sel,pr)).join("");
 const b=$(".sheet [data-buyplus]");if(b){b.id="plusGo";b.textContent=planBtn(sel,pr)}const ts=b&&b.nextElementSibling;if(ts){ts.id="plusTerms";ts.textContent=planTerms(sel,pr)+" "+t("pl.demo")}};
document.addEventListener("click",e=>{const x=e.target.closest("[data-plan]");if(!x)return;const pr=promoLeft()>0,k=x.dataset.plan,b=$("#plusGo"),ts=$("#plusTerms");
 if(b)b.textContent=planBtn(k,pr);if(ts)ts.textContent=planTerms(k,pr)+" "+t("pl.demo")});
document.addEventListener("click",e=>{if(!e.target.closest("[data-buyplus]"))return;const k=S.planSel||"year";S.plusRenew={plan:k,trialEnd:k==="week"&&promoLeft()>0?Date.now()+7*864e5:0,first:k==="week"?PLANS.week.renew:PLANS[k].promo}},true);
Object.assign(I18N.en,{"pl.trial":"Trial","pl.week":"Weekly","pl.month":"Monthly","pl.year":"Yearly","pl.wk":"wk","pl.mo":"mo","pl.yr":"yr","pl.renew60":"First renewal 60% off",
 "pl.tWeekP":"$0 today. In 7 days your first renewal is ${r} (60% off), then ${p}/week. Auto-renews — cancel anytime before the trial ends.","pl.tWeek":"${p}/week, auto-renews. Cancel anytime.",
 "pl.tFirst":"First {u} ${a}, then ${p}/{u}. Auto-renews — cancel anytime.","pl.tPlain":"${p}/{u}, auto-renews. Cancel anytime.","pl.demo":"Demo — no real charge.",
 "pl.btnFree":"Start 7 days free","pl.btnSub":"Subscribe","pl.btnDeal":"Get new-member price"});
Object.assign(I18N.zh,{"pl.trial":"试用","pl.week":"每周","pl.month":"每月","pl.year":"每年","pl.wk":"周","pl.mo":"月","pl.yr":"年","pl.renew60":"首次续费享 6 折优惠",
 "pl.tWeekP":"今天 $0。7 天后首次续费 ${r}（6折），之后每周 ${p}。自动续费，试用结束前随时可取消。","pl.tWeek":"每周 ${p}，自动续费，可随时取消。",
 "pl.tFirst":"首{u} ${a}，之后每{u} ${p}。自动续费，可随时取消。","pl.tPlain":"每{u} ${p}，自动续费，可随时取消。","pl.demo":"演示，不会真的扣款。",
 "pl.btnFree":"免费试用 7 天","pl.btnSub":"立即开通","pl.btnDeal":"以新人价开通"});
