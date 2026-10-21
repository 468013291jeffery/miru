/* ---- v131 you speak your own lines ----
   When you play a character, that character's written lines no longer auto-play.
   Each one becomes "your line": type it in your own words, or tap the 💡 hint (the written line — or, with live AI,
   a fresh suggestion) to say it. A switch lets you hand your lines back to autoplay if you just want to read. */
STOPK.add("myline");
const MYL={sug:null,busy:false};
function mySelf(){return S.selfSpeak!==false}
const _stopAuto32=stopAuto;
stopAuto=function(th,b){if(b&&b[1]==="myline"){if(!mySelf()||th.pk.as!==b[0])return [[b[0],"say",b[2].t,1]];return null}return _stopAuto32(th,b)};
/* turn a written line of the character you play into your turn (packRun reads th.pk.q[0] fresh every loop) */
const _pkDir32=pkDirective;
pkDirective=function(th,b){if(Array.isArray(b)&&b[1]==="say"&&!b[3]&&th.pk&&th.pk.as&&b[0]===th.pk.as&&mySelf()&&!PKSKIP[th.id]&&typeof b[2]==="string"){
  th.pk.q[0]=[b[0],"myline",{t:b[2]}];MYL.sug=null;return true}
 return _pkDir32(th,b)};
const _stopHTML32=stopHTML;
stopHTML=function(th){const b=th.pk.stop;if(!b||b[1]!=="myline")return _stopHTML32(th);const d=b[2],c=ch(th.pk.as),nm=c?first(c.n):"";
 const prev=[...th.msgs].reverse().find(m=>m.k==="box"&&m.say||m.k==="say"&&m.who!==th.pk.as);const cue=prev?(prev.say?prev.say.txt:prev.txt):"";
 return '<div class="sttag you">🎭 '+t("my.turn",{n:esc(nm)})+'</div>'+
  (cue?'<p class="mycue">'+t("my.reply")+'<b>'+esc(String(cue).slice(0,60))+'</b></p>':'')+
  '<div class="mybox"><textarea id="myTxt" rows="2" maxlength="120" placeholder="'+esc(t("my.ph"))+'"></textarea><button class="mysend" data-mysend="1">↑</button></div>'+
  '<div class="mysug"><button data-myhint="1"><i>💡</i><span><small>'+t("my.hint")+'</small>'+fmtMix(esc(MYL.sug||d.t))+'</span></button>'+
  '<button class="myai" data-myai="1">'+(MYL.busy?'…':'✨ '+t("my.ai")+'<small>'+(typeof payTag==="function"?payTag("alt"):"💎1")+'</small>')+'</button></div>'+
  '<label class="myauto"><input type="checkbox" data-myauto="1"> '+t("my.auto",{n:esc(nm)})+'</label>'};
function mySay(th,txt){const b=th.pk.stop;if(!b||b[1]!=="myline")return;txt=String(txt||"").trim();if(!txt)return;MYL.sug=null;th.rounds=(th.rounds||0)+1;stopResolve(th,[[b[0],"say",txt,1]])}
document.addEventListener("click",async e=>{let x;const th=S.threads[curT];if(!th||!th.pk||!th.pk.stop||th.pk.stop[1]!=="myline")return;const d=th.pk.stop[2];
 if(e.target.closest("[data-myhint]")){mySay(th,MYL.sug||d.t);return}
 if(e.target.closest("[data-mysend]")){mySay(th,($("#myTxt")||{}).value);return}
 if(e.target.closest("[data-myai]")){if(MYL.busy)return;if(typeof payGo==="function"&&!payGo("alt"))return;
  const pool=(((typeof ALT_LINES!=="undefined"&&ALT_LINES[th.pk.as])||{})[S.lang==="zh"?"zh":"en"]||{})[d.t]||[];
  if(!(liveOn()&&!LIVE_ERR)){if(pool.length){MYL.k=((MYL.k||0)+1);MYL.sug=pool[(MYL.k-1)%pool.length]}else toast(t("my.noalt"));packRefresh(th);return}
  MYL.busy=true;packRefresh(th);
  try{const c=ch(th.pk.as);const hist=th.msgs.slice(-8).map(m=>m.k==="box"?((m.parts||[]).map(p=>p.txt).join(" ")+(m.say?" "+first(ch(m.say.who).n)+": "+m.say.txt:"")):(m.who+": "+(m.txt||""))).join("\n");
   const r=await ask("You help a reader play "+c.n+" in an interactive BL drama. Two men; before any confession keep it restrained, dry, masculine, subtext over naming feelings. Recent scene:\n"+hist+"\nThe written line here is: \""+d.t+"\". Write ONE alternative line "+c.n+" could say instead, same intent, his voice, under 25 words, in "+LANG_NAME[S.lang]+". Reply as JSON: {\"line\":\"...\"}",{modelTier:"quick"});
   const s=String(r&&(r.line||r.text)||"").trim().replace(/^["“]|["”]$/g,"");if(s)MYL.sug=s}catch(_){}
  MYL.busy=false;packRefresh(th);return}},true);
document.addEventListener("change",e=>{const x=e.target.closest&&e.target.closest("[data-myauto]");if(!x)return;const th=S.threads[curT];S.selfSpeak=!x.checked;save();
 if(!mySelf()&&th&&th.pk&&th.pk.stop&&th.pk.stop[1]==="myline")mySay(th,th.pk.stop[2].t)});
document.addEventListener("keydown",e=>{if(e.target&&e.target.id==="myTxt"&&e.key==="Enter"&&!e.shiftKey){e.preventDefault();const th=S.threads[curT];if(th)mySay(th,e.target.value)}});
Object.assign(I18N.zh,{"my.turn":"轮到你说 · 你是 {n}","my.reply":"他刚说：","my.ph":"用你自己的话说……（回车发送）","my.hint":"不知道说什么？点这句","my.ai":"AI 换一句","my.noalt":"这句暂时没有别的说法，试试自己写一句","my.auto":"这一段让 {n} 自动说（只想看剧情时打开）"});
Object.assign(I18N.en,{"my.turn":"Your line · you are {n}","my.reply":"He just said: ","my.ph":"Say it your way… (Enter to send)","my.hint":"Stuck? Tap to say this","my.ai":"AI: another way","my.noalt":"No other version for this line yet — try your own words","my.auto":"Let {n} speak automatically (just watching)"});
(function(){const st=document.createElement("style");st.textContent=`
.mycue{font-size:12px;color:#B4ABBF;text-align:center;margin:6px 0 8px}.mycue b{color:#fff;font-weight:600;margin-left:4px}
.mybox{display:flex;gap:8px;align-items:flex-end;background:rgba(10,9,14,.7);border:1px solid rgba(240,183,126,.45);border-radius:14px;padding:8px}
#myTxt{flex:1;background:transparent;border:0;color:#fff;font-size:15px;line-height:1.5;resize:none;font-family:inherit;outline:none}
.mysend{flex:none;width:38px;height:38px;border-radius:50%;border:0;background:linear-gradient(135deg,#F0B77E,#EE6F97);color:#1B1017;font-size:18px;font-weight:900}
.mysug{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}
.mysug [data-myhint]{flex:1;min-width:0;display:flex;gap:8px;align-items:flex-start;text-align:left;padding:9px 11px;border-radius:12px;background:rgba(18,16,26,.8);border:1px dashed rgba(240,183,126,.5);color:#fff;font-size:14px;line-height:1.45}
.mysug [data-myhint] small{display:block;font-size:10.5px;color:#F0B77E;margin-bottom:2px}
.mysug .myai{flex:none;padding:9px 12px;border-radius:12px;background:rgba(140,111,224,.18);border:1px solid rgba(140,111,224,.5);color:#D4C7FA;font-size:12.5px}
.mysug .myai small{display:block;font-size:10px;color:#F0B77E;margin-top:2px}
.myauto{display:flex;gap:6px;align-items:center;justify-content:center;font-size:11.5px;color:#B4ABBF;margin-top:8px}`;document.head.appendChild(st)})();
/* what you just said appears at once */
const _pkWait32=pkWait;pkWait=function(th,prev,spd,ms){const nx=th.pk&&th.pk.q&&th.pk.q[0];if(Array.isArray(nx)&&nx[1]==="say"&&nx[3]===1&&nx[0]===th.pk.as)return Promise.resolve();return _pkWait32(th,prev,spd,ms)};
