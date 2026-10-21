/* ================= v4.8 · THE PLAYER SPEAKS FOR THEMSELF =================
   Scripts (admin studio or uploads) sometimes write the player's own dialogue as 你：“……” / You: "...".
   In MIRU the player's words are never pre-played: each such line becomes a "your turn" stop — the scripted line is
   offered as a suggestion, and the player can tap it or type / say their own. "你" is never treated as a character. */
const YOU90=/^(你|您|You|you|YOU|我|玩家|Me|me|Player)$/;
const _imParse90=imParse;
imParse=function(text){const d=_imParse90.apply(this,arguments);try{if(Array.isArray(d.cast))d.cast=d.cast.filter(n=>!YOU90.test(n));if(d.pov&&YOU90.test(d.pov))d.pov=null;
  /* a script that addresses the player as 你 / you is second-person: the player is "you", not one of the named characters */
  if(/^\s*(你|您|You|you)\s*[:：]/m.test(String(text||"")))d.pov=null}catch(_){}return d};
const _imBuild90=imBuild;
imBuild=function(doc,as){try{const zh=(typeof CL==="function"?CL():S.lang)==="zh";const hint=zh?"轮到你说":"Your turn";
 const nested=arr=>(arr||[]).map(b=>Array.isArray(b)&&typeof b[0]==="string"&&b[0][0]==="@"&&YOU90.test(b[0].slice(1))?["n","act",(zh?"你：“":"You: “")+b[2]+"”"]:b);
 (doc.chapters||[]).forEach(c=>{const out=[];(c.items||[]).forEach(x=>{
   if(Array.isArray(x)&&typeof x[0]==="string"&&x[0][0]==="@"&&YOU90.test(x[0].slice(1))&&x[1]!=="think"){out.push({choice:{q:hint,opts:[{t:x[2],then:[]}]},you90:1});return}
   if(x&&x.choice)x.choice.opts.forEach(o=>{o.then=nested(o.then)});if(x&&x.variant)x.variant.then=nested(x.variant.then);out.push(x)});
  /* never let a converted line become the chapter-ending choice */
  for(let j=out.length-1;j>=0;j--){const y=out[j];if(y&&y.choice&&!y.you90)break;if(y&&y.you90){out.splice(j+1,0,["n","act","…"]);break}if(Array.isArray(y)&&y[0]!=="sys")break}
  c.items=out})}catch(_){}return _imBuild90.apply(this,arguments)};
