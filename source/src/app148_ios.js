/* iOS services. Web and Android keep their existing implementations. */
(function(){
 'use strict';
 const N=window.MIRU_NATIVE;if(!N||N.platform!=='ios')return;
 const say=(zh,en)=>CL()==='zh'?zh:en;
 let buying=false,recovering=false,adBusy=false;
 function balance(j){
  if(!j||typeof j.gems!=='number')throw new Error('Missing wallet balance');
  S.keys=j.gems;cloudInfo().known=j.gems;if(j.iap)cloudInfo().iap=j.iap;
  save0();keysChip();
 }
 async function deliver(tx){
  const r=await capi('/wallet',{json:{op:'iap',jws:tx.jws}});
  if(!r.ok||r.j.transactionId!==tx.transactionId)throw new Error(r.j.error||'Purchase delivery is pending; retry after signing in');
  balance(r.j);S.firstBuy=true;save0();
  await N.finish({transactionId:tx.transactionId});
  return r.j;
 }
 async function recover(){
  if(recovering||buying||!au70Loggedin())return;
  recovering=true;
  try{
   const p=await N.pendingTransactions();
   for(const tx of p.transactions||[]){try{await deliver(tx)}catch(e){console.warn('[ios] purchase remains unfinished',e.message)}}
  }finally{recovering=false}
 }
 async function purchase(productId){
  if(buying)return;
  if(!au70Loggedin()){authAll70();return}
  buying=true;
  try{
   const w=await capi('/wallet');if(!w.ok)throw new Error(w.j.error||'Wallet unavailable');
   const iap=w.j.iap;if(!iap||!iap.available||!iap.productIds.includes(productId))throw new Error('Product unavailable');
   const tx=await N.purchase({productId,appAccountToken:iap.appAccountToken});
   if(tx.status==='cancelled')return;
   if(tx.status==='pending'){toast(say('购买正在等待批准，批准后会自动补发。','Purchase awaits approval. Diamonds will arrive after approval.'));return}
   if(tx.status!=='purchased'||!tx.jws||!tx.transactionId)throw new Error('Purchase was not verified');
   await deliver(tx);closeSheet();toast(say('充值已到账','Diamonds delivered'));refreshAfterPay();
  }catch(e){toast(String(e.message||e))}
  finally{buying=false}
 }
 paySheet=function(){
  const id='ios-packs-'+Date.now();
  sheet('<h2>💎 '+say('充值','Top up')+'</h2><div id="'+id+'">'+say('正在连接 App Store…','Connecting to the App Store…')+'</div><button class="lnk" data-ios-sync>'+say('同步购买与余额','Sync purchases and balance')+'</button>');
  (async()=>{
   const [w,h]=await Promise.all([capi('/wallet'),capi('/health?config=1')]);
   if(!w.ok||!h.ok)throw new Error('Store connection unavailable');
   balance(w.j);
   const iap=w.j.iap;if(!iap||!iap.available)throw new Error('Purchases are currently unavailable');
   const skus=(h.j.config||{}).skus||{},items=await N.products({ids:iap.productIds}),box=document.getElementById(id);if(!box)return;
   const products=items.products||[];
   box.innerHTML='<div class="packs packs84">'+products.map(p=>{
    const v=Object.values(skus).find(s=>s.apple===p.productId);if(!v)return '';
    return '<button class="pack" data-ios-product="'+esc(p.productId)+'"><b>💎 '+Number(v.gems)+'</b><span>'+esc(p.displayPrice)+'</span></button>';
   }).join('')+'</div>'+(!products.length?'<p>'+say('商品暂不可用，请稍后重试。','Products are unavailable. Please try again.')+'</p>':'')+
   '<p class="xs faint">'+say('钻石保存在你的 MIRU 账号中。首充奖励以服务端结算为准。','Diamonds are saved in your MIRU account. Any first-purchase bonus is confirmed by the server.')+'</p>'+
   (iap.test?'<p class="xs">'+say('测试购买余额','Test purchase balance')+'</p>':'');
  })().catch(e=>{const box=document.getElementById(id);if(box)box.textContent=e.message});
 };
 async function apple(){
  const c=await capi('/auth',{json:{op:'apple_challenge',client:'ios'}});
  if(!c.ok)throw new Error(c.j.error||'Apple sign-in unavailable');
  const p=await N.signInWithApple({nonce:c.j.nonce});
  return capi('/auth',{json:{op:'apple',challenge:c.j.challenge,idToken:p.idToken,authorizationCode:p.authorizationCode,name:p.name}});
 }
 async function login(provider){
  try{
   const r=provider==='apple'?await apple():await capi('/auth',{json:{op:'google',...(await N.signInWithGoogle())}});
   if(!r.ok)throw new Error(r.j.error||'Sign-in failed');
   await au70Done(r.j,provider);await recover();
  }catch(e){toast(String(e.message||e))}
 }
 au70MountGoogle=async function(){};
 au70Apple=function(){return login('apple')};
 async function resetLocal(){
  window.MIRU_ACCOUNT_DELETED=true;CL0.on=false;clearTimeout(CL0.timer);
  if(typeof call!=='undefined'&&call&&typeof endCall==='function')endCall();
  if(typeof stopVoice==='function')stopVoice();
  localStorage.clear();localStorage.setItem('miru.deleteLocalPending','1');
  if(typeof UDB!=='undefined'&&UDB.db){UDB.db.close();UDB.db=null}
  if(typeof MEDIA!=='undefined'){if(MEDIA.db)MEDIA.db.close();MEDIA.db=null;MEDIA.blobs.clear();MEDIA.urls.forEach(u=>URL.revokeObjectURL(u));MEDIA.urls.clear()}
  if(typeof indexedDB!=='undefined')for(const name of ['miru_lib','miru-media'])await new Promise((resolve,reject)=>{
   const r=indexedDB.deleteDatabase(name);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error);r.onblocked=()=>reject(new Error('Close other MIRU windows and retry local data deletion'));
  });
  localStorage.removeItem('miru.deleteLocalPending');location.reload();
 }
 async function deleteAccount(confirmed=false){
  if(!confirmed&&!confirm(au('delAsk')))return;
  try{
   let r=await capi('/auth',{json:{op:'delete'}});
   if(!r.ok&&r.j.action==='apple_reauthentication_required'){
    const uid=cloudInfo().uid,fresh=await apple();
    if(!fresh.ok)throw new Error(fresh.j.error||'Apple reauthentication failed');
    if(!fresh.j.user||fresh.j.user.id!==uid)throw new Error(say('请使用当前账号绑定的 Apple 账号重试。','Use the Apple account linked to your current MIRU account.'));
    cloudInfo().token=fresh.j.token;save0();
    r=await capi('/auth',{json:{op:'delete'}});
   }
   if(!r.ok)throw new Error(r.j.error||say('注销尚未完成，请重试。','Deletion is not complete. Please retry.'));
   await resetLocal();
  }catch(e){toast(String(e.message||e))}
 }
 watchAd=async function(done){
  if(adBusy)return;
  if(!adLeft()){toast(t('ad.none'));return}
  adBusy=true;
  try{
   closeSheet();const r=await N.showRewardedAd();
   if(r.rewarded===true){adState().n++;save();if(done)done()}
   else toast(t('ad.keep'));
  }catch(e){toast(say('暂时没有广告，请稍后重试。','No ad is available. Please try again later.'))}
  finally{adBusy=false}
 };
 window.addEventListener('click',function(e){
  const x=e.target.closest('[data-ios-product],[data-buy],[data-buyplus],[data-buymax],[data-ios-sync],[data-au70="apple"],[data-au70="google"],[data-au70card="del"]');
  if(!x)return;e.preventDefault();e.stopImmediatePropagation();
  if(x.hasAttribute('data-ios-product')){purchase(x.dataset.iosProduct);return}
  if(x.hasAttribute('data-ios-sync')){recover().then(()=>walletPull()).then(()=>toast(say('余额已同步','Balance synced'))).catch(e=>toast(e.message));return}
  if(x.hasAttribute('data-au70')){login(x.dataset.au70);return}
  if(x.dataset.au70card==='del'){deleteAccount();return}
  paySheet();
 },true);
 const oldWallet=walletPull;walletPull=async function(){const r=await oldWallet.apply(this,arguments);recover().catch(()=>{});return r};
 window.addEventListener('focus',()=>recover().catch(()=>{}));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)recover().catch(()=>{})});
 N.addListener('transactionUpdated',()=>recover().catch(()=>{}));
 const oldMe=renderMe;renderMe=function(v){const r=oldMe.apply(this,arguments);if(!v.querySelector('[data-ios-ad-privacy]')){
  const b=document.createElement('button');b.type='button';b.className='btn btn-g';b.setAttribute('data-ios-ad-privacy','');b.textContent=say('广告隐私选项','Ad privacy options');b.onclick=()=>N.privacyOptions().catch(e=>toast(e.message));(v.querySelector('.scroll')||v).prepend(b)
 }return r};
 if(localStorage.getItem('miru.deleteLocalPending'))resetLocal().catch(e=>toast(e.message));
 window.__miruIOS={deliver,recover,purchase,login,deleteAccount,resetLocal};
})();
