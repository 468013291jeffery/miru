/* ================= CORE ================= */
const KEY="miru_v2";
const DEF={v:2,lang:"en",ob:false,or:"all",tropes:[],heat:"slow",personas:[{id:"p1",name:"",pron:"they",look:""}],pid:"p1",
 threads:{},feedSeen:{},liked:{},follow:{},art:{},album:[],saved:[],keys:10000,plus:false,couples:{},mine:{chars:{},worlds:{}},works:[],
 voice:{auto:true},live:true,tier:"std",lastTab:"home"};
let S=load();
/* repair data saved by older versions so one bad record can never blank a page */
function cleanState(hard){try{S.threads=S.threads||{};for(const k of Object.keys(S.threads)){const th=S.threads[k];if(!th||typeof th!=="object"){delete S.threads[k];continue}
  th.cast=(Array.isArray(th.cast)?th.cast:[]).filter(id=>typeof id==="string");th.msgs=Array.isArray(th.msgs)?th.msgs:[];th.mem=Array.isArray(th.mem)?th.mem:[];th.love=th.love||{};th.tasks=th.tasks||{};th.status=th.status||{time:"",place:"",mood:{}};th.at=th.at||0;
  if(!Array.isArray(th.said)){th.said=th.msgs.filter(m=>m&&m.who==="me"&&(m.k==="say"||m.k==="act"||m.k==="think"||m.k==="dir")&&String(m.txt||"").trim()).map(m=>String(m.txt).trim()).slice(-60)}
 if(!th.cast.length&&hard)delete S.threads[k]}
 S.album=(S.album||[]).filter(a=>a&&a.id);S.follow=S.follow||{};S.mine=S.mine||{chars:{},worlds:{}};S.mine.worlds=S.mine.worlds||{};S.mine.chars=S.mine.chars||{};
 for(const k of Object.keys(S.mine.worlds)){const w=S.mine.worlds[k];if(!w||!Array.isArray(w.cast)||!w.title){delete S.mine.worlds[k]}}
 if(S.daily&&!Array.isArray(S.daily.p))S.daily=null;if(hard)save()}catch(_){}}
cleanState();
function load(){try{const r=localStorage.getItem(KEY);if(r){const o=JSON.parse(r);return Object.assign(JSON.parse(JSON.stringify(DEF)),o)}}catch(e){}
 const d=JSON.parse(JSON.stringify(DEF));
 /* the app starts in English for everyone; players switch language themselves */return d}
function saveRaw(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){
 /* storage full: drop oldest album frames first */
 try{if(S.album.length>4){S.album=S.album.slice(0,4);localStorage.setItem(KEY,JSON.stringify(S))}}catch(_){}}}
/* 2026-10-27：save 的唯一入口（观测见 app105_save.js）。沙箱里没有 SAVE 就直接写。 */
function save(){ try{ if(window.SAVE&&window.SAVE.go) return window.SAVE.go(saveRaw) }catch(_){} return saveRaw() }
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
function t(k,v){let s=(I18N[S.lang]&&I18N[S.lang][k])||I18N.en[k]||k;if(v)for(const x in v)s=s.split("{"+x+"}").join(v[x]);return s}
function L(o){if(o==null)return"";if(typeof o==="string")return o;return o[S.lang]||o.en||o.zh||""}
function Lz(o){/* content: zh has its own text; ja/ko/es fall back to English */if(o==null)return"";if(typeof o==="string")return o;return S.lang==="zh"?(o.zh||o.en):(o[S.lang]||o.en)}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function tagName(x){const m=TAG_L[S.lang];return m&&m[x]?m[x]:x}
function first(n){return String(n||"").replace(/^(Dr\.|Prince)\s+/,"").split(" ")[0]}
function fmtN(n){if(n>=1e6)return (n/1e6).toFixed(n>=1e7?0:1).replace(/\.0$/,"")+"M";if(n>=1e3)return (n/1e3).toFixed(n>=1e4?0:1).replace(/\.0$/,"")+"K";return String(n)}
function ago(ts){const m=Math.max(1,Math.round((Date.now()-ts)/6e4));if(m<60)return m+"m";const h=Math.round(m/60);if(h<24)return h+"h";return Math.round(h/24)+"d"}
function hash(s){let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function persona(){return S.personas.find(p=>p.id===S.pid)||S.personas[0]}
function me(){return persona().name||"You"}
function ch(id){return C[id]||S.mine.chars[id]||null}
function wd(id){return W.find(w=>w.id===id)||S.mine.worlds[id]||null}
function allChars(){return Object.keys(C).filter(id=>!C[id].retired).concat(Object.keys(S.mine.chars))}
function allWorlds(){return W.concat(Object.values(S.mine.worlds))}
function fem(c){return c&&c.g==="f"}
function toast(msg){const o=$(".toast");if(o)o.remove();const d=document.createElement("div");d.className="toast";d.textContent=msg;$("#dev").appendChild(d);clearTimeout(toast.t);toast.t=setTimeout(()=>d.remove(),2800)}
function sheet(html,onMount){closeSheet();const d=document.createElement("div");d.className="sheet";
 d.innerHTML='<div class="sheet-card"><div class="grip"></div>'+html+'</div>';
 d.addEventListener("click",e=>{if(e.target===d)closeSheet()});$("#dev").appendChild(d);onMount&&onMount(d);return d}
function closeSheet(){$$(".sheet").forEach(x=>x.remove())}
function ic(name){const P={
 home:'<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
 disc:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
 compass:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
 chat:'<path d="M20 15a3 3 0 0 1-3 3H8l-4 3V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3z"/>',
 create:'<path d="M12 5v14M5 12h14"/><rect x="3" y="3" width="18" height="18" rx="5"/>',
 me:'<circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c.7-3.8 3.5-5.7 7-5.7s6.3 1.9 7 5.7"/>',
 back:'<path d="M15 5 8 12l7 7"/>',send:'<path d="M12 19V5M6 11l6-6 6 6"/>',plus:'<path d="M12 5v14M5 12h14"/>',
 heart:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
 msg:'<path d="M21 12a8 8 0 0 1-11.6 7.2L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
 dots:'<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
 play:'<path d="M8 5v14l11-7z" fill="currentColor"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'};
 return '<svg viewBox="0 0 24 24" aria-hidden="true">'+(P[name]||"")+'</svg>'}

/* ================= ART =================
   Official portraits ship as files in art/. Characters without one get a generated poster
   (gradient + monogram) until the user uploads a portrait or the image server draws one. */
const POSTER={};
/* 立绘可能已经不是 base64 而是 {__m:id} 引用（见 app92_media.js）：
   拿得到就返回 URL；拿不到先给 1×1 占位，后台取到再把带 data-art 的 img 补上。 */
function refreshArtImgs(id){try{const u=mediaUrl("art:"+id);if(!u)return;document.querySelectorAll('img[data-art="'+id+'"]').forEach(im=>{if(im.src!==u)im.src=u})}catch(_){}}
function artSrc(id){
 const v0=S.art[id];
 if(typeof mediaIsRef==="function"&&mediaIsRef(v0)){const u=mediaUrl(v0.__m);if(u)return u;mediaUrlAsync(v0.__m,()=>refreshArtImgs(id));return (typeof MEDIA_BLANK!=="undefined")?MEDIA_BLANK:"";}
 if(typeof v0==="string"&&v0)return v0;
 const c=ch(id),w=wd(id);
 if(w&&w.mine&&!w.cover)return "art/world_default.jpg";
 const f=(c&&c.art)||(w&&w.cover);
 if(f)return "art/"+f+".jpg";
 return poster(id);}
function poster(id){
 if(POSTER[id])return POSTER[id];
 const c=ch(id),w=wd(id),pal=(c&&c.pal)||(w&&w.pal)||["#8C7AA8","#141019"];
 const name=(c?c.n:w?Lz(w.title):id).replace(/^(Dr\.|Prince)\s+/,"");
 const Wd=420,Ht=540,cv=document.createElement("canvas");cv.width=Wd;cv.height=Ht;const x=cv.getContext("2d");const hx=hash(id);
 /* ground: deep duotone from the character's palette */
 let g=x.createLinearGradient(0,0,Wd,Ht);g.addColorStop(0,pal[1]);g.addColorStop(1,"#050407");x.fillStyle=g;x.fillRect(0,0,Wd,Ht);
 const lx=Wd*(.3+(hx%40)/100),ly=Ht*(.18+(hx%25)/100);
 g=x.createRadialGradient(lx,ly,4,lx,ly,Wd*.95);g.addColorStop(0,pal[0]+"F0");g.addColorStop(.3,pal[0]+"55");g.addColorStop(1,pal[0]+"00");x.fillStyle=g;x.fillRect(0,0,Wd,Ht);
 /* fine diagonal hatching, like a printed cover */
 x.save();x.globalAlpha=.07;x.strokeStyle="#fff";x.lineWidth=1;for(let k=-Ht;k<Wd;k+=7){x.beginPath();x.moveTo(k,0);x.lineTo(k+Ht,Ht);x.stroke()}x.restore();
 /* giant initial, cut off at the edge */
 x.save();x.fillStyle=pal[0];x.globalAlpha=.9;x.font="italic 600 430px Fraunces, Georgia, 'Times New Roman', serif";x.textAlign="center";x.textBaseline="alphabetic";
 x.shadowColor="rgba(0,0,0,.55)";x.shadowBlur=40;x.fillText(name[0],Wd*.52,Ht*.8);x.restore();
 x.save();x.globalCompositeOperation="overlay";g=x.createLinearGradient(0,Ht*.2,0,Ht);g.addColorStop(0,"rgba(255,255,255,.35)");g.addColorStop(1,"rgba(0,0,0,.6)");x.fillStyle=g;x.fillRect(0,0,Wd,Ht);x.restore();
 /* inset frame + name plate */
 x.strokeStyle="rgba(240,183,126,.55)";x.lineWidth=1.5;x.strokeRect(16,16,Wd-32,Ht-32);
 x.fillStyle="rgba(5,4,7,.55)";x.fillRect(16,Ht-92,Wd-32,76);
 x.fillStyle="#F4EFF5";x.font="600 30px Fraunces, Georgia, serif";x.textAlign="left";x.fillText(name.split(" ")[0],34,Ht-50);
 x.fillStyle="rgba(240,183,126,.9)";x.font="800 12px Manrope, Helvetica, sans-serif";x.fillText((c?(c.n.split(" ").slice(1).join(" ")||"MIRU"):"MIRU").toUpperCase().split("").join(" "),34,Ht-28);
 const d=x.getImageData(0,0,Wd,Ht),p=d.data;for(let k=0;k<p.length;k+=4){const n=(Math.random()-.5)*16;p[k]+=n;p[k+1]+=n;p[k+2]+=n}x.putImageData(d,0,0);
 return POSTER[id]=cv.toDataURL("image/jpeg",.84);}
function img(id,cls,style){return '<div class="'+(cls||"art")+'"'+(style?' style="'+style+'"':"")+'><img src="'+artSrc(id)+'" data-art="'+id+'" alt="" loading="lazy"></div>'}
function avatar(id,size){return '<div class="av" style="width:'+size+'px;height:'+size+'px"><img src="'+artSrc(id)+'" data-art="'+id+'" alt=""></div>'}
function hasOfficial(id){const c=ch(id);return !!(S.art[id]||(c&&c.art))}

/* ================= VOICE =================
   With no voice server, every character still gets a distinct voice: a system voice matched to
   their gender and language, plus their own pitch and speed.                                     */
let VOICES=[];
function loadVoices(){try{VOICES=speechSynthesis.getVoices()||[]}catch(e){VOICES=[]}}
(typeof soft==="function"?soft:function(n,f){try{return f()}catch(e){}})("app1_core:L108",function(){loadVoices();speechSynthesis.onvoiceschanged=loadVoices});
const FEM=/female|woman|yu-?shu|lili|mei-?jia|li-?na|xiaoyi|yaoyao|samantha|victoria|karen|moira|tessa|zira|susan|fiona|allison|ava|serena|kate|ting|mei|sin-ji|kyoko|yuna|sora|paulina|monica|helena|lucia|google.*(uk english female|us english)|siri.*female|xiaoxiao|hanhan|huihui|nanami|sunhi|elvira/i;
const MAL=/\bmale\b|li-?mu|yunxi|yunjian|yunze|kangkang|zhiwei|daniel|nathan|evan|tom\b|alex|fred|david|mark|james|thomas|oliver|arthur|aaron|gordon|rishi|jorge|diego|juan|otoya|hattori|injoon|yunjhe|kangkang|yunyang|keita|google uk english male/i;
const LTAG={en:"en",zh:"zh",ja:"ja",ko:"ko",es:"es"};
/* only the standard accent for each language (zh → Mandarin zh-CN, never zh-HK/zh-TW/dialects), best-quality voices first */
const LEXACT={en:/^en[-_](us|gb)/i,zh:/^(zh[-_]cn|cmn|zh[-_]hans)/i,ja:/^ja/i,ko:/^ko/i,es:/^es/i};
const VQ=v=>(/premium|enhanced|natural|neural|online|siri/i.test(v.name)?3:0)+(/google/i.test(v.name)?2:0)+(v.localService===false?1:0)-(/compact|eloquence|espeak|novelty|bad news|bells|whisper|zarvox|trinoids|albert|bahh|boing|bubbles|cellos|deranged|hysterical|jester|organ|superstar|wobble|grandma|grandpa|rocko|shelley|flo|reed|sandy/i.test(v.name)?9:0);
function voiceFor(id){
 const lang=LTAG[S.lang],re=LEXACT[lang];let pool=VOICES.filter(v=>re.test(v.lang||""));
 if(!pool.length&&lang!=="zh")pool=VOICES.filter(v=>(v.lang||"").toLowerCase().startsWith(lang));
 const src=(pool.length?pool:VOICES.filter(v=>/^en[-_]us/i.test(v.lang||""))).slice().sort((a,b)=>VQ(b)-VQ(a));
 if(!src.length)return null;const top=src.filter(v=>VQ(v)>=VQ(src[0])-1);
 if(id==="n")return top.find(v=>FEM.test(v.name))||top[0];
 const c=ch(id),g=c?c.g:"m";
 const want=top.filter(v=>g==="f"?FEM.test(v.name):MAL.test(v.name)&&!FEM.test(v.name));
 const want2=want.length?want:src.filter(v=>g==="f"?FEM.test(v.name):MAL.test(v.name)&&!FEM.test(v.name));
 const list=want2.length?want2:top;
 /* characters in the same story get different voices whenever the device has more than one of that gender */
 const w0=c&&c.w?wd(c.w):null,i0=w0&&w0.cast?w0.cast.filter(x=>ch(x)&&ch(x).g===g).indexOf(id):-1;
 return list[(i0>=0?i0+hash(c.w||""):hash(id))%list.length];}
function hasGenderVoice(g){const lang=LTAG[S.lang],re=LEXACT[lang];return VOICES.some(v=>re.test(v.lang||"")&&(g==="f"?FEM.test(v.name):MAL.test(v.name)&&!FEM.test(v.name)))}
/* a real recorded line in this character's own voice, if the pack has one */
function recLineOf(id){const l=audLang();if(!l)return null;audPack(l);const P=AUDP[l];if(!P)return null;const k=Object.keys(P).find(x=>x.startsWith(id+"|"));return k?{txt:k.slice(id.length+1),src:P[k]}:null}
/* Recorded voices: every scripted line (openings, intros, drama episodes) is pre-voiced per character
   with its own neural voice (en + zh). Packs load in the background; live AI lines use the device voice
   pushed apart per character until a server TTS is connected. */
const AUDP={};let AUD_CUR=null;
function audPack(lang){if(AUDP[lang]!==undefined)return;AUDP[lang]=null;
 if(window.AUDPACK&&AUDPACK[lang]){AUDP[lang]=AUDPACK[lang];return}
 fetch("audio/"+lang+".json").then(r=>r.ok?r.json():null).then(j=>{AUDP[lang]=j||{}}).catch(()=>{AUDP[lang]={}})}
function audLang(){return S.lang==="zh"?"zh":S.lang==="en"?"en":null}
function recorded(text,id){
 /* 2026-10-27 Ann：「虽然现在删不合适，但是可以不用吗？」—— 可以。语言包**保留在仓库**，
    但默认**不启用**（S.voice.pack 未开就完全不走这条路：不下载、不查表、不参与判断）。
    实测她那条线程 10 次发声命中 0 次，而它要 11 MB 预取。想用的时候把开关打开即可。 */
 if(!(typeof S!=="undefined"&&S.voice&&S.voice.pack))return null;
 const l=audLang();if(!l)return null;audPack(l);const P=AUDP[l];if(!P)return null;
 const k=(id||"n")+"|"+String(text).replace(/[*()（）]/g,"").trim();return P[k]||(ch(id)?null:P["n|"+k.split("|").slice(1).join("|")])||null}
function hasVoice(text,id){return !!recorded(text,id)}
function speak(text,id,onend){
 try{
  stopVoice();
  const rec=recorded(text,id);
  if(rec){const a=new Audio(rec);AUD_CUR=a;if(onend)a.onended=onend;a.play().catch(()=>{});return}
  if(!("speechSynthesis" in window)){toast(t("voice.none"));return}
  const u=new SpeechSynthesisUtterance(String(text).replace(/[*()（）]/g,""));
  const v=voiceFor(id);if(v){u.voice=v;u.lang=v.lang}else u.lang=LTAG[S.lang];
  const c=id&&id!=="n"?ch(id):null;const sp=(c&&c.v)||{pitch:1,rate:1};
  /* keep it human: small pitch/pace differences only — big shifts are what make a voice sound synthetic */
  const j=((hash(id||"n")%5)-2)*.02;
  /* only a hair of pitch/pace difference: anything more is exactly what makes a device voice sound robotic */
  u.pitch=id==="n"?1:Math.max(.95,Math.min(1.05,1+((sp.pitch||1)-1)*.25+j*.5));u.rate=id==="n"?.96:Math.max(.94,Math.min(1.02,.98+((sp.rate||1)-1)*.25));
  if(onend)u.onend=onend;speechSynthesis.speak(u);
 }catch(e){}}
function stopVoice(){try{speechSynthesis.cancel()}catch(e){}try{if(AUD_CUR){AUD_CUR.pause();AUD_CUR=null}}catch(e){}}
/* 2026-10-27 Ann：「语言包说实话也是没什么用的」——实测她那条线程 10 次发声里命中录音包 0 次。
   而它在启动 600ms 后就把 audio/<lang>.json（zh 11 MB）整份拉下来。⇒ 改成**按需**：
   第一次真要念某句时由 recorded() 自己去调 audPack()，启动不再预取。 */


/* ================= LIVE AI ================= */
let SAMPLE=null,LIVE_ERR=null,LIVE_STATE="pending";
(async()=>{try{if(window.claude&&typeof claude.use==="function"){const s=await claude.use("sample");SAMPLE=s||null}}catch(e){SAMPLE=null}
 LIVE_STATE=SAMPLE?"ready":"na";refreshLive()})();
async function liveTest(){
 if(!SAMPLE)return {ok:false,code:LIVE_STATE==="pending"?"pending":"na"};
 try{const r=await SAMPLE("Reply with exactly the word OK.",{modelTier:"quick",cache:false});LIVE_ERR=null;S.live=true;save();refreshLive();return {ok:true,text:(r&&r.text||"").trim()}}
 catch(e){LIVE_ERR=(e&&e.code)||"error";refreshLive();return {ok:false,code:LIVE_ERR,msg:e&&e.message}}}
function liveWhy(code){return code==="na"?t("live.na"):code==="pending"?t("live.pending"):["not_granted","sampling_disabled","not_declared","capability_disabled"].includes(code)?t("live.denied"):t("live.err",{c:code})}
function liveOn(){return !!(SAMPLE&&S.live)}
function refreshLive(){const on=liveOn()&&!LIVE_ERR;$$(".livechip").forEach(el=>{el.textContent=on?t("cx.live"):t("cx.script");el.classList.toggle("off",!on)});
 $$(".livebanner").forEach(el=>{el.hidden=on;const s=el.querySelector("span");if(s)s.textContent=t("live.banner",{c:LIVE_ERR||(SAMPLE?"":LIVE_STATE)})})}
function jsonLoose(t){if(!t)return null;t=String(t).replace(/```(?:json)?/g,"");const i=t.search(/[\[{]/);if(i<0)return null;const open=t[i],close=open==="{"?"}":"]";const j=t.lastIndexOf(close);if(j<=i)return null;try{return JSON.parse(t.slice(i,j+1))}catch(_){try{return JSON.parse(t.slice(i,j+1).replace(/,\s*([}\]])/g,"$1"))}catch(__){return null}}}
async function ask(prompt,opts){
 opts=opts||{};
 if(!liveOn())throw {code:"na"};
 const _tier=opts.modelTier||"default";
 try{let r;try{r=await SAMPLE.json(prompt,Object.assign({modelTier:"default",cache:false},opts))}
  catch(e0){if(!e0||e0.code!=="invalid_json")throw e0;r=jsonLoose(e0.text);
   if(r==null){const t2=await SAMPLE(prompt+"\n\nIMPORTANT: reply with valid JSON only — no prose, no code fences.",Object.assign({modelTier:"default",cache:false},opts));r=jsonLoose(t2&&t2.text)}
   /* 自适应预算（2026-10-25 · Ann「你看着办」）：
      同一档位仍解析不出来，多半是两种情形之一 ——
        ① 输出被预算掐断（JSON 少半截）② 推理型模型把预算全烧在思考上、正文为空。
      这两种都不是"再问一遍就会好"，而是"预算不够"。
      ⇒ 用更大的档位（complex）重试**一次**。只升一次，不循环；已经是 complex 就不再升。
      为什么不是"一律给大预算"：实测模型会跑满上限才停（LATENCY.md），一律给大 = 每次都慢。
      为什么不是"一律给小预算"：给 3000 时推理型模型直接返回空内容。 */
   if(r==null&&_tier!=="complex"){
    (typeof soft==="function"?soft:function(n,f){try{return f()}catch(e){}})("app1_core:L196",function(){track&&track("llm_escalate",{from:_tier,to:"complex"})});
    const t3=await SAMPLE(prompt+"\n\nIMPORTANT: reply with valid JSON only — no prose, no code fences.",Object.assign({},opts,{modelTier:"complex",cache:false}));
    r=jsonLoose(t3&&t3.text);
   }
   if(r==null)throw e0}
  LIVE_ERR=null;refreshLive();return r}
 catch(e){LIVE_ERR=(e&&e.code)||"error";refreshLive();
  if(e&&["not_granted","sampling_disabled","not_declared","capability_disabled"].includes(e.code))toast(t("live.denied"));
  else if(e&&e.code!=="cancelled")toast(t("live.err",{c:LIVE_ERR}));
  throw e}}
const HEAT_RULE={fluff:"Keep it warm and non-sexual: banter, comfort, almost-touching.",slow:"Hold tension on purpose: longing, restraint, near-misses. Nothing physical beyond a touch.",steamy:"Charged and suggestive. Kissing and closeness are fine. Fade to black before anything explicit.",mature:"Adult emotional themes and charged physicality, but never explicit sexual description — cut away at the door."};

/* ================= NAV ================= */
const STACK=[];
function screen(id,html,cls){let el=$("#"+id);if(!el){el=document.createElement("section");el.id=id;el.className="screen "+(cls||"");$("#dev").appendChild(el)}
 el.innerHTML=html;return el}
function show(id){stopVoice();$$(".screen").forEach(s=>s.hidden=s.id!==id);const top=STACK[STACK.length-1];if(top!==id)STACK.push(id);if(STACK.length>30)STACK.shift()}
function back(){STACK.pop();const id=STACK.pop()||"s-main";if(id==="s-main")renderTab(S.lastTab);show(id)}
document.addEventListener("click",e=>{if(e.target.closest("[data-back]")){back()}});
/* generic character-grid search box — a text input with class "pickq" and data-pickfor="#gridId" filters
   that grid's buttons by the character's shown name as more characters pile up. */
function pickSearch(inputId,gridId){return '<div class="field" style="margin-top:10px"><input class="pickq" id="'+inputId+'" data-pickfor="#'+gridId+'" placeholder="'+esc(t("g.searchChar"))+'"></div>'}
document.addEventListener("input",e=>{const x=e.target.closest(".pickq");if(!x)return;const sel=x.dataset.pickfor,q=x.value.trim().toLowerCase();
 $$(sel+" > *").forEach(b=>{const nm=(b.querySelector("span")||b).textContent.toLowerCase();b.style.display=(!q||nm.includes(q))?"":"none"})});

