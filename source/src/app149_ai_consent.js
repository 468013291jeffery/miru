/* Consent before interactive AI and before the first boot. */
(function(){
 const ai=window.MIRU_AI;if(!ai)return;
 const stop=()=>{
  if(ai.allowed(true)&&!(typeof lcKey==='function'&&lcKey()&&!ai.recipient(new URL(lcCfg().base||LC_BASE))))return false;
  toast(LL('AI 数据共享已关闭，可在「我」更改。','AI sharing is off. Change it in Me.'));return true
 };
 const oldSend=doSend;doSend=function(txt){
  if(String(txt||'').trim()&&stop()){const t=document.getElementById('cin');if(t&&!t.value){t.value=String(txt);t.dispatchEvent(new Event('input',{bubbles:true}))}return}
  return oldSend.apply(this,arguments)
 };
 const oldReply=reply;reply=async function(){if(stop())return;return oldReply.apply(this,arguments)};
 const oldCall=startCall;startCall=function(){if(!stop())return oldCall.apply(this,arguments)};
 const oldGate=callGate;callGate=function(){if(!stop())return oldGate.apply(this,arguments)};
 const oldPic=aiGenerate;aiGenerate=function(){if(!stop())return oldPic.apply(this,arguments)};
 const oldVid=vidGo;vidGo=function(){if(!stop())return oldVid.apply(this,arguments)};
 const label=()=>ai.allowed(false)?LL('撤回 AI 数据共享许可','Withdraw AI data sharing'):LL('允许 AI 数据共享','Allow AI data sharing');
 const oldMe=renderMe;renderMe=function(v){
  const r=oldMe.apply(this,arguments);
  if(!v.querySelector('[data-ai-consent]')){
   const btn=document.createElement('button');btn.type='button';btn.className='btn btn-g';btn.setAttribute('data-ai-consent','');btn.textContent=label();
   btn.onclick=()=>{ai.change();btn.textContent=label();if(ai.allowed(false)&&typeof trScan==='function')trScan()};
   (v.querySelector('.scroll')||v).prepend(btn)
  }return r
 };
 window.addEventListener('miru-ai-withdrawn',()=>{if(typeof call!=='undefined'&&call)endCall();if(typeof stopVoice==='function')stopVoice()});
})();
