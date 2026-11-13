const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function setup(){
 const log=[],events={},cloud={uid:'same',token:'original'},S={keys:10,lang:'en'},pending=[{transactionId:'1',jws:'signed'}];
 let mode='success',status='purchased',logged=true,ads=true;
 const native={platform:'ios',addListener(){return Promise.resolve()},finish:async x=>log.push('finish:'+x.transactionId),pendingTransactions:async()=>({transactions:pending}),purchase:async()=>({status,transactionId:'1',jws:'signed'}),showRewardedAd:async()=>({rewarded:ads}),signInWithApple:async()=>({idToken:'id',authorizationCode:'code'}),privacyOptions:async()=>{}};
 const w={S,window:null,CL0:{on:true},clearTimeout(){},MIRU_NATIVE:native,document:{addEventListener(){},getElementById(){return null}},addEventListener:(name,fn)=>events[name]=fn,CL:()=> 'en',cloudInfo:()=>cloud,save0:()=>log.push('save'),keysChip(){},save(){},console:{warn(){}},au70Loggedin:()=>logged,authAll70(){log.push('login')},toast:s=>log.push('toast:'+s),closeSheet(){},refreshAfterPay(){},au70MountGoogle(){},au70Apple(){},au70Done(){},renderMe(){},walletPull:async()=>{},sheet(){},esc:x=>x,confirm:()=>true,au:x=>x,localStorage:{getItem(){return null},setItem(){},removeItem(){},clear(){log.push('clear')}},location:{reload(){log.push('reload')}},setTimeout:fn=>fn(),adLeft:()=>5,adState:()=>({n:0}),t:x=>x,
 capi:async(path,opt)=>{
  if(path==='/wallet'&&opt){log.push('ack');if(mode==='fail')return {ok:false,j:{error:'offline'}};return {ok:true,j:{transactionId:'1',gems:22}}}
  if(path==='/wallet')return {ok:true,j:{iap:{available:true,productIds:['p'],appAccountToken:'uuid'}}};
  if(opt.json.op==='apple_challenge')return {ok:true,j:{nonce:'n',challenge:'c'}};
  if(opt.json.op==='apple')return {ok:true,j:{user:{id:mode==='mismatch'?'different':'same'},token:'fresh'}};
  if(opt.json.op==='delete'){log.push('delete');return {ok:false,j:{error:'retry',action:mode==='mismatch'?'apple_reauthentication_required':'retry_account_deletion'}}}
 }};
 w.window=w;vm.runInNewContext(fs.readFileSync(require.resolve('../source/src/app148_ios.js'),'utf8'),w);
 return {w,log,cloud,S,setMode:x=>mode=x,setStatus:x=>status=x,setLogged:x=>logged=x,setAds:x=>ads=x,events}
}
(async()=>{
 let x=setup();await x.w.__miruIOS.deliver({transactionId:'1',jws:'signed'});assert(x.log.indexOf('ack')<x.log.indexOf('finish:1'));assert.equal(x.cloud.known,22);assert.equal(x.S.keys,22);
 x=setup();x.setMode('fail');await assert.rejects(x.w.__miruIOS.deliver({transactionId:'1',jws:'signed'}));assert(!x.log.includes('finish:1'));assert.equal(x.S.keys,10);
 for(const status of ['cancelled','pending']){x=setup();x.setStatus(status);await x.w.__miruIOS.purchase('p');assert(!x.log.includes('ack'));assert(!x.log.includes('finish:1'));assert.equal(x.S.keys,10)}
 x=setup();await x.w.__miruIOS.recover();assert(x.log.includes('finish:1'));x=setup();x.setLogged(false);await x.w.__miruIOS.recover();assert(!x.log.includes('ack'));
 x=setup();x.setAds(false);let earned=0;await x.w.watchAd(()=>earned++);assert.equal(earned,0);x.setAds(true);await x.w.watchAd(()=>earned++);assert.equal(earned,1);
 x=setup();await x.w.__miruIOS.deleteAccount();assert.equal(x.cloud.token,'original');assert(!x.log.includes('clear'));
 x=setup();x.setMode('mismatch');await x.w.__miruIOS.deleteAccount();assert.equal(x.cloud.token,'original');assert.equal(x.log.filter(z=>z==='delete').length,1);assert(!x.log.includes('clear'));
 x=setup();const data=new Map([['save','deleted account']]);x.w.KEY='save';x.w.localStorage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k),clear:()=>data.clear()};
 const core=fs.readFileSync(require.resolve('../source/src/app1_core.js'),'utf8'),start=core.indexOf('function saveRaw(){'),end=core.indexOf('function save(){',start);vm.runInNewContext(core.slice(start,end),x.w);
 const erased=[];x.w.indexedDB={deleteDatabase(name){erased.push(name);const r={};queueMicrotask(()=>{x.w.saveRaw();r.onsuccess()});return r}};
 await x.w.__miruIOS.resetLocal();x.w.saveRaw();assert.equal(data.size,0);assert.deepEqual(erased,['miru_lib','miru-media']);assert(x.log.includes('reload'));
 const startup={window:{MIRU_ACCOUNT_DELETED:true},mediaBoot(){throw Error('database reopened during deletion')},startApp(){throw Error('booted during deletion')},renderOB(){throw Error('booted during deletion')}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../source/src/app99_boot.js'),'utf8'),startup);
 const uploads=fs.readFileSync(require.resolve('../source/src/app66_libup.js'),'utf8');vm.runInNewContext(uploads.split('\n').find(l=>l.startsWith('function udb(){')),startup);await assert.rejects(startup.udb(),/being removed/);
 const media=fs.readFileSync(require.resolve('../source/src/app92_media.js'),'utf8');vm.runInNewContext(media.slice(media.indexOf('function mediaOpen()'),media.indexOf('/**',media.indexOf('function mediaOpen()'))),startup);assert.equal(await startup.mediaOpen(),null);
 console.log('PASS iOS server-before-finish, retry, cancel/pending, real ad reward, deletion retry and same-account reauthentication');
})().catch(e=>{console.error(e);process.exitCode=1});
