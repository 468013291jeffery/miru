/* Native-only bootstrap. Runs before application scripts and cloud initialization. */
(function () {
 'use strict';
 window.MIRU_PROXY='https://miru.plus/api/longcat';
 window.MIRU_TTS='https://miru.plus/api/tts';
 window.MIRU_ACCOUNT=true;
 if(localStorage.getItem('miru.deleteLocalPending'))window.MIRU_ACCOUNT_DELETED=true;
 const plugin=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.MIRUNative;
 if(!plugin)throw new Error('MIRU native bridge unavailable');
 const methods=['configuration','products','purchase','pendingTransactions','finish','signInWithApple','signInWithGoogle','showRewardedAd','privacyOptions'];
 const native={platform:'ios'};
 methods.forEach(function(name){native[name]=function(args){return plugin[name](args||{});};});
 native.addListener=function(name,fn){return plugin.addListener(name,fn);};
 window.MIRU_NATIVE=Object.freeze(native);
 const consentKey='miru.ios.aiConsent.v1';
 let consent='unset',hosts=[];
 try{const v=JSON.parse(localStorage.getItem(consentKey)||'{}');consent=v.state==='yes'?'yes':v.state==='no'?'no':'unset';hosts=Array.isArray(v.hosts)?v.hosts:[]}catch(_){}
 const zh=()=>{try{return (typeof S!=='undefined'&&S.lang?S.lang:navigator.language).startsWith('zh')}catch(_){return false}};
 const notice=()=>zh()?'使用 AI 将按所选功能发送你的输入、角色与对话记录、故事记忆、创作及翻译文本、语音或音色样本、参考图和视频提示。文字与记忆可由 DeepSeek、美团 LongCat、SCNet、智谱 GLM 或 OpenAI 处理；语音和图像可由阿里通义、字节豆包、Inworld、Hugging Face IndexTTS 或配置的语音服务处理；视频由 Vidu 处理；系统听写可能使用 Apple。是否允许？取消后仍可浏览，可在「我」更改。':'Allow AI processing? Depending on the feature and configuration, MIRU sends your input, character and conversation history, story memories, creator or translation text, voice recordings or voice samples, reference images and video prompts. Text and memory may use DeepSeek, Meituan LongCat, SCNet, Zhipu GLM or OpenAI. Speech and images may use Alibaba Qwen, ByteDance Doubao, Inworld, Hugging Face IndexTTS or the configured speech service. Video uses Vidu. System dictation may use Apple. Cancel to keep browsing. Change this in Me.';
 function remember(state){consent=state;if(state!=='yes')hosts=[];try{localStorage.setItem(consentKey,JSON.stringify({state,hosts}))}catch(_){try{localStorage.removeItem(consentKey)}catch(_){}}}
 function allowed(interactive){if(consent==='unset'&&interactive)remember(window.confirm(notice())?'yes':'no');return consent==='yes'}
 function permitHost(url){if(!allowed(true))return false;if(hosts.includes(url.origin))return true;if(!window.confirm((zh()?'允许向你设置的服务发送对话及 API Key？\n':'Send chat input and your API key to your chosen service?\n')+url.origin))return false;hosts.push(url.origin);remember('yes');return true}
 const ai=window.MIRU_AI=Object.freeze({allowed,recipient:permitHost,change(){if(consent==='yes'){remember('no');window.dispatchEvent(new Event('miru-ai-withdrawn'))}else remember(window.confirm(notice())?'yes':'no');return consent==='yes'}});
 function denial(){return Object.assign(new Error('AI sharing is off. Change this in Me.'),{name:'NotAllowedError',code:'ai_consent'})}
 function isAI(url,method,b){const p=url.pathname.replace(/\/+$/,'');if(/\/v1\/chat\/completions$/.test(p))return 'custom';if(p==='/api/longcat')return 'ask';if(p==='/api/translate'||(p==='/api/state'&&url.searchParams.get('r')==='mem'&&method==='POST'&&!['forget','forget_all'].includes(b.op)))return 'quiet';if(p==='/api/studio'&&method==='POST')return 'ask';if(p==='/api/tts'&&!(method==='POST'&&typeof b.cloneDel==='string'&&Object.keys(b).length===1))return 'ask';return ''}
 for(const C of new Set([window.SpeechRecognition,window.webkitSpeechRecognition])){
  if(!C)continue;const p=C.prototype,original=p.start;
  p.start=function(){if(!allowed(true))throw denial();const cancel=()=>this.abort();window.addEventListener('miru-ai-withdrawn',cancel,{once:true});const clean=()=>window.removeEventListener('miru-ai-withdrawn',cancel);this.addEventListener('end',clean,{once:true});try{return original.apply(this,arguments)}catch(e){clean();throw e}}
 }
 const originalFetch=window.fetch.bind(window);
 window.fetch=async function(input,init){
  const raw=input instanceof Request?input.url:String(input),url=new URL(raw,location.href);
  const method=String(init?.method||(input instanceof Request?input.method:'GET')).toUpperCase();
  let body={};
  if(method==='POST'&&['/api/tts','/api/state'].includes(url.pathname)){
   try{body=JSON.parse(typeof init?.body==='string'?init.body:input instanceof Request&&!init?.body?await input.clone().text():'{}')||{}}catch(_){}
  }
  const kind=isAI(url,method,body);
  if(kind&&(kind==='custom'?!permitHost(url):!allowed(kind!=='quiet')))throw denial();
  if(url.pathname.startsWith('/api/')&&((url.protocol==='capacitor:'&&url.hostname==='localhost')||url.origin==='https://www.miru.plus'))url.href='https://miru.plus'+url.pathname+url.search;
  if(url.origin==='https://miru.plus'&&url.pathname.startsWith('/api/')){
   const headers=new Headers(init&&init.headers||(input instanceof Request?input.headers:undefined));
   headers.set('X-Miru-Client','ios');
   return originalFetch(input instanceof Request?new Request(url.href,input):url.href,Object.assign({},init,{headers:headers}));
  }
  return originalFetch(input,init);
 };
})();
