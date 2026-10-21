/* ================= v2.6 · ONE LANGUAGE AT A TIME =================
   1) Taste tags: every name exists in all five app languages; the picker shows only the reader's language (no bilingual chips).
   2) A page-wide localizer: any visible text that isn't in the current language (an English fallback in ja/ko/es, a Chinese line in en,
      an English sentence in zh) is replaced — first from the hand-written dictionary below, then from the server translator
      (/api/translate: LongCat, cached in the database so each line is translated once for everybody, and cached on the device).
      Inputs, the reader's own messages and anything marked data-notr are never touched. Switching language restores the originals. */
const L5=(o)=>o[S.lang]||o.en;
/* ---------- 1 · tag names ---------- */
const TAXN={
 e2l:["Enemies to Lovers","宿敌变恋人","敵から恋人へ","원수에서 연인으로","De enemigos a amantes"],r2l:["Rivals to Lovers","对手变恋人","ライバルから恋人へ","라이벌에서 연인으로","De rivales a amantes"],
 second:["Second Chance","破镜重圆","二度目のチャンス","다시 만난 연인","Segunda oportunidad"],fake:["Fake Dating","假戏真做","偽装恋愛","가짜 연애","Noviazgo falso"],
 arranged:["Arranged Marriage","先婚后爱","政略結婚","정략결혼","Matrimonio arreglado"],prox:["Forced Proximity","被迫同处","強制接近","강제 동거","Proximidad forzada"],
 bed:["Only One Bed","只有一张床","ベッドはひとつだけ","침대는 하나뿐","Solo hay una cama"],slow:["Slow Burn","慢热拉扯","じれじれ","슬로우 번","Romance a fuego lento"],
 pine:["Mutual Pining","双向暗恋","両片想い","쌍방 짝사랑","Amor mutuo en secreto"],f2l:["Friends to Lovers","朋友变恋人","友達から恋人へ","친구에서 연인으로","De amigos a amantes"],
 forbid:["Forbidden Love","禁忌之恋","禁断の恋","금지된 사랑","Amor prohibido"],guard:["Bodyguard Romance","保镖恋爱","ボディガードとの恋","경호원 로맨스","Romance con guardaespaldas"],
 tdie:["Touch Him and Die","碰他者死","彼に触れたら許さない","그를 건드리면 끝장","Tócalo y te mueres"],hc:["Hurt/Comfort","伤痛与治愈","傷と癒し","상처와 위로","Dolor y consuelo"],
 ff:["Found Family","找到家人","選んだ家族","선택한 가족","Familia elegida"],ld:["Long Distance","异地恋","遠距離恋愛","장거리 연애","Amor a distancia"],office:["Office Romance","职场恋爱","オフィスラブ","사내 연애","Romance de oficina"],
 gr:["Golden Retriever","阳光忠犬","ワンコ系","대형견 남친","Tipo golden retriever"],gs:["Grumpy x Sunshine","暴躁×阳光","不機嫌×太陽","까칠×햇살","Gruñón × solecito"],cold:["Ice Prince","冰山","氷の王子","얼음 왕자","Príncipe de hielo"],
 mg:["Morally Grey","灰色地带","グレーな男","도덕적 회색지대","Moralmente gris"],soft:["Soft Giant","温柔大块头","優しい大男","다정한 거인","Gigante tierno"],prot:["Protector","守护型","守ってくれる人","보호자형","Protector"],
 bil:["Billionaire","亿万富翁","御曹司","재벌","Multimillonario"],genius:["Genius","天才","天才","천재","Genio"],bad:["Bad Boy","坏男孩","不良","나쁜 남자","Chico malo"],
 cozy:["Sweet & Cozy","甜 · 治愈","甘くて癒し","달달·힐링","Dulce y acogedor"],romcom:["Rom-Com","轻松搞笑","ラブコメ","로맨틱 코미디","Comedia romántica"],angst:["Angst","虐","切ない","애절","Angustia"],
 dark:["Dark Romance","暗黑","ダークロマンス","다크 로맨스","Romance oscuro"],thrill:["Suspense","悬疑刺激","サスペンス","서스펜스","Suspenso"],
 contemp:["Contemporary","都市","現代","현대","Contemporáneo"],college:["College","校园","キャンパス","캠퍼스","Universidad"],sports:["Sports Romance","体育竞技","スポーツ","스포츠","Romance deportivo"],
 fantasy:["Romantasy & Paranormal","奇幻 · 超自然","ファンタジー・人外","판타지·초자연","Romantasy y paranormal"],mafia:["Mafia & Crime","黑帮","マフィア","마피아","Mafia y crimen"],scifi:["Sci-Fi","科幻","SF","SF","Ciencia ficción"],
 G_trope:["Tropes","你爱的桥段","好きな展開","좋아하는 클리셰","Tropos"],G_him:["His Type","他的类型","彼のタイプ","그의 타입","Su tipo"],G_vibe:["Vibes","氛围","雰囲気","분위기","Vibras"],G_world:["Setting","世界观","舞台","배경","Ambientación"],
 G_pair:["Pairing","配对","カップリング","커플링","Pareja"],G_heat:["Spice Level","尺度","刺激度","수위","Nivel de picante"],G_ex:["Hard Pass 🚫","不想看 🚫","見たくない 🚫","안 볼래요 🚫","Paso 🚫"],
 P_bl:["M/M","BL","BL","BL","Chico × chico"],P_bg:["M/F","BG","男女","남녀","Chico × chica"],P_gl:["F/F","GL","GL","GL","Chica × chica"],P_all:["Any","都可以","なんでも","상관없음","Cualquiera"],
 H_fluff:["Sweet","清水","ピュア","순한 맛","Dulce"],H_slow:["Steamy","暧昧","ドキドキ","설렘","Ardiente"],H_steamy:["Spicy 🌶","微辣 🌶","ちょい辛 🌶","매운 맛 🌶","Picante 🌶"]};
const LIX={en:0,zh:1,ja:2,ko:3,es:4};
function tn(k){const r=TAXN[k];return r?(r[LIX[S.lang]]!=null?r[LIX[S.lang]]:r[0]):k}
taxName=function(k){return tn(k)};
const UIX={
 upto:["pick up to {n}","最多选 {n} 个","{n}つまで","최대 {n}개","hasta {n}"],exHint:["up to 3 · hidden from your feed","最多 3 个 · 含这些的故事不再推荐","3つまで・フィードに出しません","최대 3개 · 피드에서 숨김","hasta 3 · se ocultan de tu feed"],
 pageH:["What are you into?","你爱看什么？","どんな話が好き？","어떤 이야기가 좋아요?","¿Qué te gusta?"],
 pageS:["Pick a few tropes and his type — your first dramas play right after.","选几个最爱的桥段和他的类型，下一步马上给你放对应的短剧。","好きな展開と彼のタイプを選ぶと、次にぴったりのショートドラマが流れます。","좋아하는 클리셰와 그의 타입을 고르면 바로 맞춤 숏드라마를 틀어 드려요.","Elige algunos tropos y su tipo: tus primeros dramas empiezan enseguida."],
 skip:["Skip","跳过","スキップ","건너뛰기","Omitir"],show:["Show my picks ▶","给我推荐 ▶","おすすめを見る ▶","추천 보기 ▶","Ver mis recomendaciones ▶"],
 sheetH:["Your taste","你的口味","あなたの好み","나의 취향","Tus gustos"],sheetS:["Pick by layer. Change anytime.","分层选，随时可以改。","グループごとに選べます。いつでも変更可。","그룹별로 고르고 언제든 바꿀 수 있어요.","Elige por grupos. Cámbialo cuando quieras."],
 reset:["Reset","重置","リセット","초기화","Restablecer"],apply:["Apply","应用","適用","적용","Aplicar"]};
function ux(k,v){const r=UIX[k];let s=r?(r[LIX[S.lang]]||r[0]):k;if(v)for(const x in v)s=s.split("{"+x+"}").join(v[x]);return s}
/* single-language chips */
chip=function(attr,on,ex,a){return '<button '+attr+' class="'+(on?"on":"")+(ex?" ex":"")+'"><b>'+esc(a)+'</b></button>'};
prefBody=function(){const P=PDRAFT;
 const grp=gk=>{const g=TAX[gk],n=P[gk].length;return '<div class="pf64g"><div class="pf64h"><b>'+esc(tn("G_"+gk))+'</b><small>'+ux("upto",{n:g.max})+(n?" · "+n:"")+'</small></div><div class="pf64c">'+
  g.items.map(([k])=>chip('data-pf="'+gk+'|'+k+'"',P[gk].includes(k),P.ex.includes(k),tn(k))).join("")+'</div></div>'};
 return '<div class="pf64g"><div class="pf64h"><b>'+esc(tn("G_pair"))+'</b></div><div class="pf64c">'+["bl","bg","gl","all"].map(k=>chip('data-pfor="'+k+'"',P.or===k,0,tn("P_"+k))).join("")+'</div></div>'+
  TAXG.map(grp).join("")+
  '<div class="pf64g"><div class="pf64h"><b>'+esc(tn("G_heat"))+'</b></div><div class="pf64c">'+["fluff","slow","steamy"].map(k=>chip('data-pfheat="'+k+'"',P.heat===k,0,tn("H_"+k))).join("")+'</div></div>'+
  '<div class="pf64g"><div class="pf64h"><b>'+esc(tn("G_ex"))+'</b><small>'+ux("exHint")+'</small></div><div class="pf64c">'+
   Object.values(TAX).flatMap(g=>g.items).map(([k])=>chip('data-pfex="'+k+'"',P.ex.includes(k),P.ex.includes(k),tn(k))).join("")+'</div></div>'};
prefRender=function(){const keepD=PDRAFT;
 if(PMODE==="page"){const sc=$("#pfPage");const top=sc?sc.scrollTop:0;
  screen("s-ob",'<div class="topbar"><button class="ibtn" id="obBack">'+ic("back")+'</button><div class="progress"><i style="width:66%"></i></div><span class="xs faint num">2 / 3</span></div>'+
   '<div class="scroll pad pf64 pf64page" id="pfPage"><h1 style="font-size:24px;margin:0">'+ux("pageH")+'</h1><p class="dim sm" style="margin:6px 0 0">'+ux("pageS")+'</p>'+prefBody()+'</div>'+
   '<div class="startbar"><div class="row" style="gap:8px"><button class="btn btn-g" data-pfskip="1">'+ux("skip")+'</button><button class="btn btn-p grow" data-pfsave="1">'+ux("show")+'</button></div></div>');show("s-ob");const s2=$("#pfPage");if(s2)s2.scrollTop=top;PDRAFT=keepD;return}
 sheet('<div class="pf64"><h2>'+ux("sheetH")+'</h2><p class="xs faint">'+ux("sheetS")+'</p>'+prefBody()+'<div class="row" style="gap:8px;margin-top:14px"><button class="btn btn-g" data-pfreset="1">'+ux("reset")+'</button><button class="btn btn-p grow" data-pfsave="1">'+ux("apply")+'</button></div></div>');PDRAFT=keepD};
/* hook slides & library: story tags in the reader's language, trigger words only in the reader's script */
const _hookHTML67=hookHTML;hookHTML=function(){let h=_hookHTML67();try{h=h.replace(/<em>([^<]+)<\/em>/g,(m,t0)=>'<em>'+esc(typeof tagName==="function"?tagName(t0):t0)+'</em>')}catch(_){}return h};
const _libItems67=libItems;libItems=function(){const L=_libItems67(),zh=S.lang==="zh";return L.map(x=>Object.assign({},x,{kw:x.kw.filter(k=>zh?/[一-鿿]/.test(k):!/[一-鿿]/.test(k))}))};
/* ---------- 2 · the page-wide localizer ---------- */
const TRD={/* en → [ja, ko, es]: the UI lines that most often fall back to English */
 "For You":["おすすめ","추천","Para ti"],"Picked for you":["あなたへのおすすめ","당신을 위한 추천","Elegido para ti"],"New stories":["新着ストーリー","새 이야기","Historias nuevas"],"From the community":["コミュニティから","커뮤니티","De la comunidad"],
 "Make your own version":["自分だけのバージョンを作る","나만의 버전 만들기","Haz tu propia versión"],"New post":["新規投稿","새 게시물","Nueva publicación"],"Share a moment — the people you talk to will see it":["今の気持ちをシェア——話した相手に届きます","지금 이 순간을 공유하세요 — 대화한 사람들이 볼 수 있어요","Comparte un momento: lo verán las personas con quienes hablas"],
 "What the characters are posting. Reply and it lands in your chat.":["キャラクターたちの投稿。返信するとチャットに届きます。","캐릭터들의 게시물이에요. 답장하면 채팅으로 이어져요.","Lo que publican los personajes. Si respondes, llega a tu chat."],
 "🎯 My taste":["🎯 私の好み","🎯 나의 취향","🎯 Mis gustos"],"Not set — pick to sharpen recommendations":["未設定——選ぶとおすすめが正確に","아직 없음 — 고르면 추천이 정확해져요","Sin elegir: elige para afinar tus recomendaciones"],
 "📖 My stories":["📖 マイストーリー","📖 내 이야기","📖 Mis historias"],"My voice":["私の声","내 목소리","Mi voz"],"Tap to record, up to 12 seconds":["タップで録音（最大12秒）","눌러서 녹음 (최대 12초)","Toca para grabar, hasta 12 segundos"],
 "Say anything — he'll answer you…":["なんでも話して——彼が答えてくれる…","무엇이든 말해 보세요 — 그가 대답해요…","Di lo que quieras: él te responderá…"],"Just type · *action* · (thought)":["そのまま入力 · *行動* · （心の声）","그냥 입력 · *행동* · (속마음)","Escribe · *acción* · (pensamiento)"],
 "Continue":["続ける","계속","Continuar"],"Talking freely · turn {n}":["自由に会話中・{n}回目","자유 대화 중 · {n}번째","Charla libre · turno {n}"],"Keep typing to talk; tap → or pick an option below to move on":["話し続けてもOK。先へ進むなら右か下の選択肢を","계속 대화하거나, 오른쪽 버튼이나 아래 선택지로 진행하세요","Sigue escribiendo para charlar; toca → o elige una opción para avanzar"],
 "Library":["素材ライブラリ","소재 라이브러리","Biblioteca"],"Games":["ゲーム","게임","Juegos"],"Upload my BGM":["BGMをアップロード","BGM 업로드","Subir mi música"],"Upload my effect":["エフェクトをアップロード","효과 업로드","Subir mi efecto"],"Upload my sound":["効果音をアップロード","효과음 업로드","Subir mi sonido"],"Make my own game":["テンプレートでゲームを作る","템플릿으로 게임 만들기","Crear mi propio juego"],
 "Character voices":["キャラクターボイス","캐릭터 음성","Voces de personajes"],"Natural":["ナチュラル","자연스러운 목소리","Natural"],"Device":["端末の音声","기기 음성","Del dispositivo"],"Try":["試聴","들어보기","Probar"],
 "Skip":["スキップ","건너뛰기","Omitir"],"Browse":["見て回る","둘러보기","Explorar"],"Taste":["好み","취향","Gustos"],"What happens next is up to you.":["この先は、あなたが演じる。","이다음은 당신이 연기할 차례.","Lo que pasa después depende de ti."],
 "Walk in as yourself":["自分としてこのシーンに入る","나 자신으로 이 장면에 들어가기","Entra como tú"],"Direct it":["演出する","연출하기","Dirígelo"],"Watch the full short first":["先にショートドラマを最後まで見る","먼저 숏드라마 끝까지 보기","Ver primero el corto completo"],
 "Back to the story":["ストーリーに戻る","이야기로 돌아가기","Volver a la historia"],"You did it!":["成功！","성공!","¡Lo lograste!"],"So close…":["あと少し…","아깝다…","Casi…"],"Got it":["OK","확인","Entendido"]};
const TR={map:{},q:new Set(),busy:false,lang:null,obs:null,orig:new WeakMap(),fail:0};
function trKey(){return "miru_tr_"+S.lang}
function trLoad(){if(TR.lang===S.lang)return;TR.lang=S.lang;TR.map={};try{TR.map=JSON.parse(localStorage.getItem(trKey())||"{}")}catch(_){}
 const i={ja:0,ko:1,es:2}[S.lang];if(i!=null)Object.keys(TRD).forEach(k=>{TR.map[k]=TRD[k][i]})
 let bad=0;Object.keys(TR.map).forEach(k=>{if(!needsTr(k)||!trFits(TR.map[k])){delete TR.map[k];bad++}});if(bad)trSave()}
/* a translation must be written in the target language's script */
function trFits(v){v=String(v||"");const L=S.lang;if(L==="zh")return RX.han.test(v)&&!/[一-鿿][a-z]|[a-z][一-鿿]/.test(v);if(L==="en")return !RX.han.test(v)&&!RX.kana.test(v)&&!RX.hang.test(v);if(L==="ja")return RX.kana.test(v)||RX.han.test(v);if(L==="ko")return RX.hang.test(v);if(L==="es")return !RX.han.test(v);return true}
function trSave(){try{const keys=Object.keys(TR.map);if(keys.length>6000)keys.slice(0,keys.length-6000).forEach(k=>delete TR.map[k]);localStorage.setItem(trKey(),JSON.stringify(TR.map))}catch(_){}}
const RX={han:/[一-鿿]/,kana:/[぀-ヿ]/,hang:/[가-힯]/,words:/[A-Za-z]{2,}[^\n]*\s+[A-Za-z]{2,}/};
function needsTr(t){if(!t||t.length<2||t.length>600)return false;if(!/[A-Za-z一-鿿]/.test(t))return false;const L=S.lang;
 if(L==="en")return RX.han.test(t)&&!RX.kana.test(t);
 if(L==="zh")return RX.words.test(t)&&!RX.han.test(t)&&!/^(https?:|[A-Z0-9_.-]+$)/.test(t);
 if(L==="ja")return (RX.words.test(t)&&!RX.kana.test(t)&&!RX.han.test(t))||(RX.han.test(t)&&!RX.kana.test(t)&&t.replace(/[^一-鿿]/g,"").length>=4);
 if(L==="ko")return !RX.hang.test(t)&&(RX.words.test(t)||RX.han.test(t));
 if(L==="es")return RX.han.test(t)||(RX.words.test(t)&&/\b(the|you|your|and|to|of|for|with|tap|this|is|are|my|it|on|what|who|he|his|her|she|we|they|be|will|can|no|not|all|more|new|get)\b/i.test(t)&&!/\b(el|la|los|las|que|tu|tus|una|con|para|por|más|es|y|del)\b/i.test(t))
 ;return false}
function trSkip(el){return !el||el.closest&&el.closest("[data-notr],textarea,input,script,style,code,.m.me,.mine,.mb-me,[contenteditable]")}
function trNode(n){const raw=n.nodeValue,t=raw.trim();if(!t||(TR.me&&TR.me.has(t)))return;const o=TR.orig.get(n);const src=o&&o.tr===raw?o.src:t;
 if(TR.map[src]!=null&&needsTr(src)&&trFits(TR.map[src])){const out=raw.replace(t,TR.map[src]);if(out!==raw){TR.orig.set(n,{src,tr:out});n.nodeValue=out}return}
 if(needsTr(src))TR.q.add(src)}
function trAttr(el,a){const v=el.getAttribute(a);if(!v)return;const o=el["__tro_"+a]||v;if(TR.map[o]!=null&&needsTr(o)&&trFits(TR.map[o])){el["__tro_"+a]=o;el.setAttribute(a,TR.map[o])}else if(needsTr(o))TR.q.add(o)}
function meTexts(){const th=S.threads&&S.threads[curT];const set=new Set();if(th)(th.msgs||[]).forEach(m=>{if(m.who==="me"&&m.txt)set.add(String(m.txt).trim())});return set}
function trScan(root){trLoad();TR.me=meTexts();const w=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT,{acceptNode:n=>trSkip(n.parentElement)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
 let n;while((n=w.nextNode()))trNode(n);(root||document.body).querySelectorAll&&(root||document.body).querySelectorAll("[placeholder],[title]").forEach(el=>{if(trSkip(el.parentElement))return;trAttr(el,"placeholder");trAttr(el,"title")});trFlush()}
function trEP(){const p=typeof TTS_EP!=="undefined"&&TTS_EP?TTS_EP.replace(/\/api\/tts$/,"/api/translate"):"";return p}
let trT=null;function trFlush(){clearTimeout(trT);trT=setTimeout(async()=>{if(TR.busy||!TR.q.size||TR.fail>3)return;const ep=trEP();if(!ep){TR.q.clear();return}
 const batch=[...TR.q].slice(0,40);batch.forEach(x=>TR.q.delete(x));TR.busy=true;const lang0=S.lang;
 try{const r=await fetch(ep,{method:"POST",headers:Object.assign({"Content-Type":"application/json"},typeof cloudAuth==="function"?cloudAuth():{}),body:JSON.stringify({to:S.lang,texts:batch})});const j=await r.json();
  if(S.lang!==lang0||TR.lang!==lang0){TR.busy=false;return}
  if(j&&j.map){Object.keys(j.map).forEach(k=>{if(!needsTr(k)||!trFits(j.map[k]))delete j.map[k]});Object.assign(TR.map,j.map);trSave();TR.fail=0;trScan()}else TR.fail++}catch(_){TR.fail++}TR.busy=false;if(TR.q.size)trFlush()},350)}
function trRestore(){document.querySelectorAll("*").forEach(el=>{["placeholder","title"].forEach(a=>{if(el["__tro_"+a]){el.setAttribute(a,el["__tro_"+a]);delete el["__tro_"+a]}})});
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const o=TR.orig.get(n);if(o&&n.nodeValue===o.tr){n.nodeValue=o.tr.replace(o.tr.trim(),o.src);TR.orig.delete(n)}}}
function trStart(){if(TR.obs)return;let pend=new Set(),tm=null;
 TR.obs=new MutationObserver(ms=>{ms.forEach(m=>{if(m.type==="characterData")pend.add(m.target.parentElement);else m.addedNodes.forEach(x=>pend.add(x.nodeType===1?x:x.parentElement))});clearTimeout(tm);tm=setTimeout(()=>{const P=[...pend];pend=new Set();P.forEach(el=>{if(el&&el.isConnected)trScan(el)})},60)});
 TR.obs.observe(document.body,{childList:true,subtree:true,characterData:true});setTimeout(()=>trScan(),300)}
const _toast67=toast;toast=function(msg){try{trLoad();const s=String(msg||"");if(TR.map[s]!=null&&needsTr(s)&&trFits(TR.map[s]))msg=TR.map[s];else if(needsTr(s)){TR.q.add(s);trFlush()}}catch(_){}return _toast67(msg)};
/* language switches: restore originals, then localize again */
let LANG67=S.lang;setInterval(()=>{if(S.lang!==LANG67){LANG67=S.lang;trRestore();TR.lang=null;setTimeout(()=>trScan(),200)}},700);
if(document.body)trStart();else document.addEventListener("DOMContentLoaded",trStart);
