/* ---- v129 writing rules for live AI (male/male stories) + "look back" unlocks ---- */
const MM_RULES=["TWO MEN (BL) — follow these whenever the leads are men:",
"- Male-coded life and situations: self-reliance, physical work, fights, sports injuries patched up without fuss, money trouble handled alone, pride. Never female-lead tropes (waiting alone in the ER for someone to come, being walked home, crying for comfort, waiting to be rescued, swooning).",
"- Both men are strong and act; protection goes both ways. When hurt, he answers with action, a dry line, or silence.",
"- The protagonist's inner voice and lines sound like a man, fit the setting and the occasion: blunt, sardonic, practical. In public: face, restraint, dry humor; in private: more direct but still restrained; in danger: act first, talk later.",
"- Before either has confessed or come out to the other: push and pull. Never name the feeling (no 'jealous', 'I like you', 'I missed you', 'are you jealous?'). Show it through behavior and subtext: a tightened jaw, a subject change, a too-casual question about the other guy, a look held a beat too long. Every advance is followed by a deflection.",
"- PRESENCE: only characters already in the scene may speak. Anyone else must first ENTER with a narrated bridge (a knock, footsteps, a call, someone announcing them) — never just start talking.",
"HIGH POINTS (wealth reveal, power, luxury, rescue, first touch): give 2–3 beats of objective description in a deliberate order — far to near, outside to inside, shape then color, sound then sight — using plain description, metaphor or contrast as fits, then the character's inner reaction, so the reader feels the payoff immediately."].join("\n");
function mmCast(th){try{const ids=(th.cast||[]).filter(id=>ch(id));const p=typeof pairOf==="function"&&pairOf(th.wid);const pr=p?[p[1],p[2]]:ids.slice(0,2);return pr.length>=1&&pr.every(id=>ch(id)&&(ch(id).g||"m")==="m")}catch(_){return false}}
/* inject into the live prompt: ask() is the single entry to the model */
const _ask29=ask;ask=function(prompt,opts){try{const th=S.threads[curT];if(typeof prompt==="string"&&prompt.indexOf("You write MIRU")===0&&th&&mmCast(th))prompt=prompt.replace("HOW TO WRITE (this is what makes it feel human):",MM_RULES+"\nHOW TO WRITE (this is what makes it feel human):")}catch(_){}return _ask29(prompt,opts)};
/* a lock flagged recall:true is a look-back unlock (an info hook paid off later) */
const _stopHTML29=stopHTML;stopHTML=function(th){const h=_stopHTML29(th);const b=th.pk&&th.pk.stop;if(b&&b[1]==="lock"&&b[2]&&b[2].recall)return h.replace('🔒 '+t("lk.key"),'⏪ '+t("lk.recall"));return h};
Object.assign(I18N.zh,{"lk.recall":"回看当时"});Object.assign(I18N.en,{"lk.recall":"Look back"});
/* camera flashes: two quick bursts for atmosphere, then back to calm so the text stays readable */
const _fxSet29=fxSet;fxSet=function(th,k){_fxSet29(th,k);if(k==="flashes"){clearTimeout(fxSet._t);fxSet._t=setTimeout(()=>{if(th.pk&&th.pk.fx==="flashes")_fxSet29(th,"none")},1500)}};
/* scene change: a short curtain with the place written large, and a breath before the new scene's text */
function sceneCurtain(place,time,img){const host=(typeof fxLayer==="function"?fxLayer():null)||$("#s-chat")||document.body;const o=document.createElement("div");o.className="scurt"+(img?" pic":"");const src=img&&(window.SCENE_FILES||{})[img];
 o.innerHTML=(src?'<div class="scimg"><img src="'+src+'" alt=""></div><div class="scshade"></div>':'')+'<div class="scin"><small>'+t("sc29.next")+'</small><b>'+esc(place||"")+'</b>'+(time?'<em>'+esc(time)+'</em>':'')+'</div>';host.appendChild(o);
 requestAnimationFrame(()=>o.classList.add("on"));const T=img?2600:1700;setTimeout(()=>o.classList.remove("on"),T);setTimeout(()=>o.remove(),T+700)}
PKREG.add("app29_style.js", function(th,b, next){const isScene=Array.isArray(b)&&b[0]==="sys"&&b[1]==="scene";const n=th.msgs.length;const r=next(th,b);
 if(isScene&&r&&curT===th.id&&th.msgs.length>n&&th.msgs.some((m,i)=>i<n&&m.k==="scene")&&!PKSKIP[th.id]){const d=b[2]||{};sceneCurtain(Lz(d.place)||d.place,Lz(d.time)||d.time,d.img);th._sceneHold=1}return r});;
const _pkWait29=pkWait;pkWait=function(th,prev,spd,ms){if(th._sceneHold){th._sceneHold=0;ms=Math.max(ms,3400)}return _pkWait29(th,prev,spd,ms)};
Object.assign(I18N.zh,{"sc29.next":"下一幕"});Object.assign(I18N.en,{"sc29.next":"NEXT SCENE"});
/* the free-chat quick lines don't belong to a written story */
/* 2026-10-27：从「包 renderChat」搬成钩子（批量迁移）。逻辑原样，只是不再包住渲染器。 */
const __body_style29 = function () { const th=S.threads[curT];if(th&&th.pk){$$(".composer .qchips > button").forEach(b=>b.remove())} };
if (window.UI && typeof window.UI.add === "function") window.UI.add("style29", __body_style29);
else { const _renderChat29 = renderChat; renderChat = function () { const r = _renderChat29.apply(this, arguments); __body_style29(); return r; }; };
