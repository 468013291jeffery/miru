const L=require('./_lib');
const BOARD=require('./_board');
const W=require('./_wallet');
const SKUS={gems_5:5,gems_16:16,gems_28:28,gems_60:60,gems_125:125,gems_330:330,gems_700:700};
function gemsForSku(productId,cfg){
 const pid=String(productId||'');if(!pid)return null;const sk=(cfg&&cfg.skus)||{};
 for(const name of Object.keys(sk)){const v=sk[name];if(v&&typeof v==='object'&&v.apple===pid)return {sku:name,gems:Number(v.gems)||SKUS[name]||0};}
 const pick=name=>({sku:name,gems:(sk[name]&&Number(sk[name].gems))||SKUS[name]});
 if(SKUS[pid])return pick(pid);const tail=pid.split('.').pop();return SKUS[tail]?pick(tail):null;
}
async function apply(sql,uid,delta,reason,key){return W.apply(sql,uid,delta,reason,key);}
module.exports=L.wrap(async(req,res)=>{
 if(!L.cors(req,res,'GET, POST, OPTIONS'))return;
 if(req.query&&(req.query.r==='rank'||req.query.r==='tasks'))return BOARD.handle(req,res,{apply});
 /* 2026-11-24 Unity Ads 激励视频·服务器回调（S2S redeem callback）。Unity 服务器直接 GET 这里：
    /api/wallet?r=unity&sid=<用户ID>.<本次编号>&oid=<Unity 订单号>&hmac=<签名>
    签名 = HMAC-MD5(除 hmac 外所有参数按字母序 key=value 用逗号连起来, 密钥)。密钥由 Unity 客服发，放服务器环境变量 UNITY_S2S_SECRET。
    同一个 oid 只发一次（钱包流水 key=unity:<oid>）；每人每天上限 ad_daily_cap 次（默认 5），每次 ad_reward_gems 钻（默认 1）。
    成功回 200「1」；签名错 403；超上限也回「1」（不让 Unity 反复重试），但不发钻。 */
 if(req.query&&req.query.r==='unity'){
  const txt=(code,body)=>{res.statusCode=code;res.setHeader('Content-Type','text/plain; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(body);};
  const sql=await L.db();let secret=process.env.UNITY_S2S_SECRET||'';if(!secret){try{const r=(await sql("SELECT value FROM config WHERE key='secret_unity_s2s'"))[0];secret=r&&typeof r.value==='string'?r.value:'';}catch(_){}}if(!secret)return txt(503,'not configured');
  const q=req.query||{},crypto=require('crypto');
  const base=Object.keys(q).filter(k=>k!=='hmac').sort().map(k=>k+'='+(q[k]==null?'':(Array.isArray(q[k])?q[k][0]:q[k]))).join(',');
  const want=crypto.createHmac('md5',secret).update(base).digest('hex'),got=String(q.hmac||'').toLowerCase();
  if(got.length!==want.length||!crypto.timingSafeEqual(Buffer.from(got),Buffer.from(want)))return txt(403,'bad signature');
  const oid=String(q.oid||'').slice(0,100),sid=String(q.sid||''),dot=sid.lastIndexOf('.');
  const uid=dot>0?sid.slice(0,dot):sid,n=dot>0?sid.slice(dot+1).replace(/[^a-z0-9]/gi,'').slice(0,20):'';
  if(!oid||!/^u_[A-Za-z0-9_-]{4,60}$/.test(uid))return txt(400,'bad sid/oid');
  const cfg=await L.config();
  const ok=(await sql('SELECT 1 FROM users WHERE id=$1',[uid]))[0];if(!ok)return txt(400,'unknown user');
  if((await sql('SELECT 1 FROM ledger WHERE key=$1',['unity:'+oid]))[0])return txt(200,'1');
  const cap=Number(cfg.ad_daily_cap)>0?Number(cfg.ad_daily_cap):5,val=Number(cfg.ad_reward_gems)>0?Math.floor(Number(cfg.ad_reward_gems)):1;
  const used=Number((await sql("SELECT count(*)::int AS n FROM ledger WHERE user_id=$1 AND reason LIKE 'ad_unity%' AND at>=CURRENT_DATE",[uid]))[0].n)||0;
  if(used>=cap){try{await sql("INSERT INTO events(name,user_id,props) VALUES('ad_cap',$1,$2::jsonb)",[uid,JSON.stringify({oid,n})]);}catch(_){}return txt(200,'1');}
  try{await W.write(sql,uid,{delta:val,reason:('ad_unity:'+n).slice(0,40),key:'unity:'+oid});}catch(e){if(!/duplicate|unique/i.test(String(e&&e.message)))return txt(500,'wallet error');}
  return txt(200,'1');
 }
 /* 2026-11-25 网页版充值：Xsolla（艾克索拉）Webhook。Xsolla 服务器 POST 到 /api/wallet?r=xsolla。
    签名：头 Authorization: Signature <sha1(原始请求体 + Webhook 密钥)>（十六进制）。密钥放环境变量 XSOLLA_WEBHOOK_SECRET，或后台「系统配置」粘贴（config 表 secret_xsolla_wh）。
    user_validation：确认用户存在；order_paid：按订单里的商品 SKU 发钻（钱包流水 key=xsolla:<订单号>:<sku>:<序号>，同一笔只发一次）。
    沙盒订单只有后台把模式设成「沙盒」时才发钻（标记为测试单）。成功回 204；签名错 400 INVALID_SIGNATURE；用户不存在 400 INVALID_USER。 */
 if(req.query&&req.query.r==='xsolla'){
  const crypto=require('crypto');const sql=await L.db(),cfg=await L.config();
  const sec=async k=>{try{const r=(await sql('SELECT value FROM config WHERE key=$1',[k]))[0];return r&&typeof r.value==='string'?r.value:'';}catch(_){return '';}};
  const err=(c,code,msg)=>L.send(res,c,{error:{code,message:msg}});
  const whs=process.env.XSOLLA_WEBHOOK_SECRET||await sec('secret_xsolla_wh');if(!whs)return err(500,'SERVER_ERROR','not configured');
  const raw=Buffer.isBuffer(req.rawBody)?req.rawBody.toString('utf8'):(typeof req.body==='string'?req.body:JSON.stringify(req.body||{}));
  const got=String(req.headers.authorization||'').replace(/^Signature\s+/i,'').trim().toLowerCase();
  const want=crypto.createHash('sha1').update(raw+whs).digest('hex');
  if(got.length!==want.length||!crypto.timingSafeEqual(Buffer.from(got),Buffer.from(want)))return err(400,'INVALID_SIGNATURE','Invalid signature');
  let j={};try{j=JSON.parse(raw);}catch(_){return err(400,'INVALID_PARAMETER','Invalid JSON');}
  const t=String(j.notification_type||'');
  const uidOf=x=>{if(!x)return '';const v=x.external_id!=null?x.external_id:(x.id&&typeof x.id==='object'?x.id.value:x.id);return String(v==null?'':v).slice(0,80);};
  const ok=()=>{res.statusCode=204;res.end();};
  const uid=uidOf(j.user);
  if(t==='user_validation'){const r=uid?(await sql('SELECT 1 FROM users WHERE id=$1',[uid]))[0]:null;return r?ok():err(400,'INVALID_USER','Invalid user');}
  if(t==='order_paid'||t==='payment'){
   const order=j.order||{},tr=j.transaction||((j.billing||{}).transaction)||{};
   let items=Array.isArray(j.items)?j.items:[];
   if(!items.length&&j.purchase&&j.purchase.virtual_items&&Array.isArray(j.purchase.virtual_items.items))items=j.purchase.virtual_items.items;
   const oid=String(order.id||tr.id||'').replace(/[^A-Za-z0-9_-]/g,'').slice(0,60);
   if(!uid||!oid||!items.length)return err(400,'INVALID_PARAMETER','missing user, order or items');
   if(!(await sql('SELECT 1 FROM users WHERE id=$1',[uid]))[0])return err(400,'INVALID_USER','Invalid user');
   const sandbox=order.mode==='sandbox'||!!tr.dry_run;
   if(sandbox&&(process.env.XSOLLA_MODE||await sec('secret_xsolla_mode'))!=='sandbox')return ok();
   for(const it of items){
    const mapped=gemsForSku(String(it.sku||''),cfg);if(!mapped)continue;
    const n=Math.max(1,Math.min(20,Number(it.quantity||it.amount)||1));
    for(let i=0;i<n;i++){
     try{await W.purchase(sql,uid,mapped,cfg,{key:('xsolla:'+oid+':'+mapped.sku+':'+i).slice(0,120),reason:'xsolla',platform:'web',environment:sandbox?'Sandbox':'Production',test:sandbox});}
     catch(e){if(!/duplicate|unique/i.test(String(e&&e.message)))return err(500,'SERVER_ERROR','wallet error');}
    }
   }
   return ok();
  }
  return ok();
 }
 const u=await L.needActive(req,res);if(!u)return;
 const sql=await L.db(),cfg=await L.config();
 if(req.method==='GET'){
  await sql('INSERT INTO wallet(user_id,gems) VALUES($1,0) ON CONFLICT DO NOTHING',[u.uid]);
  const w=await sql('SELECT gems FROM wallet WHERE user_id=$1',[u.uid]);
  const recent=await sql('SELECT delta,reason,balance,at FROM ledger WHERE user_id=$1 ORDER BY id DESC LIMIT 20',[u.uid]);
  return L.send(res,200,{gems:w[0].gems,plus:false,recent,iap:await W.info(sql,u.uid,cfg)});
 }
 const b=L.jsonBody(req),respond=r=>L.send(res,r&&r.code?r.code:200,r);
 if(b.op==='spend'){
  const n=Math.floor(Number(b.amount));if(!(n>0&&n<=500))return L.bad(res,'bad amount');
  const r=await apply(sql,u.uid,-n,b.reason||'spend',b.key?'spend:'+u.uid+':'+String(b.key).slice(0,80):null);
  if(!r){const w=await sql('SELECT gems FROM wallet WHERE user_id=$1',[u.uid]);return L.send(res,402,{error:'not enough diamonds',gems:w[0]?w[0].gems:0});}return respond(r);
 }
 if(b.op==='earn'){
  const n=Math.floor(Number(b.amount));if(!(n>0&&n<=50))return L.bad(res,'bad amount');
  return respond(await W.write(sql,u.uid,{delta:n,reason:'earn:'+String(b.reason||'').slice(0,30),key:b.key?'earn:'+u.uid+':'+String(b.key).slice(0,80):null,earnCap:Number(cfg.earn_cap)||80}));
 }
 if(b.op==='daily'){const day=new Date().toISOString().slice(0,10);return respond(await apply(sql,u.uid,Number(cfg.daily_gems)||3,'daily','daily:'+u.uid+':'+day));}
 if(b.op==='iap'){
  const jws=String(b.jws||b.jwsRepresentation||'');if(!jws)return L.bad(res,'jws required');
  let t,mapped;
  try{t=await require('./_iap').verifyTransaction(jws);}
  catch(e){if(e.code===503)throw e;return L.bad(res,'invalid transaction: '+String(e.message||e).slice(0,120));}
  const token=await W.accountToken(sql,u.uid);
  try{W.validateIdentity(t,token);}catch(e){return L.bad(res,'invalid transaction: '+String(e.message||e).slice(0,120));}
  const reply=r=>L.send(res,r&&r.code?r.code:200,Object.assign({iap:true,transactionId:t.transactionId,productId:t.productId,environment:t.environment,test:t.environment==='Sandbox'},r||{}));
  const committed=await W.replay(sql,u.uid,t.transactionId);if(committed)return reply(committed);
  try{mapped=W.appleProducts(cfg).get(t.productId);if(!mapped)throw new Error('unknown Apple product');}
  catch(e){return L.bad(res,String(e.message||e));}
  return reply(Object.assign({sku:mapped.sku},await W.purchase(sql,u.uid,mapped,cfg,{key:'iap:'+t.transactionId,reason:'iap',platform:'ios',environment:t.environment,test:t.environment==='Sandbox'})));
 }
 if(b.op==='play'){
  const PLAY=require('./_play'),productId=String(b.sku||b.productId||''),token=String(b.token||b.purchaseToken||''),mapped=gemsForSku(productId,cfg);
  if(!mapped)return L.bad(res,'unknown product: '+productId.slice(0,60));let p;
  try{p=await PLAY.verifyProduct(productId,token);}catch(e){const msg=String(e.message||e);return L.send(res,/not set/.test(msg)?501:400,{error:msg.slice(0,160)});}
  const r=await W.purchase(sql,u.uid,mapped,cfg,{key:'play:'+String(p.orderId||token).slice(0,80),reason:'play',platform:'android',test:p.purchaseType===0,environment:p.purchaseType===0?'Sandbox':'Production'});
  if(r&&r.code)return L.send(res,r.code,r);let consumed=p.consumptionState===1;
  if(!consumed){try{await PLAY.consume(productId,token);consumed=true;}catch(e){console.warn('[play] consume',e.message);}}
  return L.send(res,200,Object.assign({play:true,orderId:p.orderId,sku:mapped.sku,consumed,test:p.purchaseType===0},r||{}));
 }
 /* 2026-11-25 网页版充值：PayPal（Orders v2）。pp_create 按服务器里的商品价格建单；用户付完款，pp_capture 向 PayPal 扣款确认，
    确认金额、币种、下单人都对得上才发钻（钱包流水 key=paypal:<captureId>，同一笔只发一次）。
    Client ID 是公开的；Secret 放环境变量 PAYPAL_SECRET，或在后台「系统配置」里粘贴（config 表 secret_paypal，配置接口读取时会剔除）。 */
 if(b.op==='pp_create'||b.op==='pp_capture'){
  const PP_ID=process.env.PAYPAL_CLIENT_ID||'BAAvWaWCDv9CwcqNlXE7Bmz_C1T6wRH9vfRbThLkKBX6kang-u7J6pKUrCOaQ3HgH4iThKcw5Ci2kugTwg';
  const PP_API=process.env.PAYPAL_API||'https://api-m.paypal.com';
  let secret=process.env.PAYPAL_SECRET||'';
  if(!secret){try{const r=(await sql("SELECT value FROM config WHERE key='secret_paypal'"))[0];secret=r&&typeof r.value==='string'?r.value:'';}catch(_){}}
  if(!secret)return L.send(res,501,{error:'paypal not configured'});
  const tk=await fetch(PP_API+'/v1/oauth2/token',{method:'POST',headers:{Authorization:'Basic '+Buffer.from(PP_ID+':'+secret).toString('base64'),'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=client_credentials'});
  const tj=await tk.json().catch(()=>({}));if(!tk.ok||!tj.access_token)return L.send(res,502,{error:'paypal auth failed'});
  const H={Authorization:'Bearer '+tj.access_token,'Content-Type':'application/json'};
  if(b.op==='pp_create'){
   const mapped=gemsForSku(String(b.sku||''),cfg);if(!mapped)return L.bad(res,'unknown product');
   const cents=Number((((cfg.skus||{})[mapped.sku])||{}).usd)||0;if(!(cents>=50))return L.bad(res,'product has no price');
   const r=await fetch(PP_API+'/v2/checkout/orders',{method:'POST',headers:H,body:JSON.stringify({intent:'CAPTURE',purchase_units:[{reference_id:mapped.sku,custom_id:u.uid,description:'MIRU '+mapped.gems+' diamonds',amount:{currency_code:'USD',value:(cents/100).toFixed(2)}}],application_context:{brand_name:'MIRU',shipping_preference:'NO_SHIPPING',user_action:'PAY_NOW'}})});
   const j=await r.json().catch(()=>({}));if(!r.ok||!j.id)return L.send(res,502,{error:'paypal create failed',detail:String((j.details&&j.details[0]&&(j.details[0].issue+' '+(j.details[0].description||'')))||j.message||j.name||'').slice(0,240)});
   return L.send(res,200,{id:j.id});
  }
  const oid=String(b.orderId||'').replace(/[^A-Za-z0-9]/g,'').slice(0,40);if(!oid)return L.bad(res,'orderId required');
  let r=await fetch(PP_API+'/v2/checkout/orders/'+oid+'/capture',{method:'POST',headers:H,body:'{}'});let j=await r.json().catch(()=>({}));
  if(!r.ok&&j&&j.details&&j.details.some(d=>d.issue==='ORDER_ALREADY_CAPTURED')){r=await fetch(PP_API+'/v2/checkout/orders/'+oid,{headers:H});j=await r.json().catch(()=>({}));}
  const pu=(j.purchase_units||[])[0]||{},cap=(((pu.payments||{}).captures)||[])[0]||{};
  if(j.status!=='COMPLETED'||cap.status!=='COMPLETED')return L.send(res,402,{error:'payment not completed',status:j.status||null});
  if(pu.custom_id&&pu.custom_id!==u.uid)return L.send(res,409,{error:'order belongs to another account'});
  const mapped=gemsForSku(String(pu.reference_id||''),cfg);if(!mapped)return L.bad(res,'unknown product on order');
  const cents=Number((((cfg.skus||{})[mapped.sku])||{}).usd)||0,paid=Math.round(Number((cap.amount||{}).value||0)*100);
  if(((cap.amount||{}).currency_code)!=='USD'||paid<cents)return L.send(res,409,{error:'amount mismatch'});
  const r2=await W.purchase(sql,u.uid,mapped,cfg,{key:'paypal:'+String(cap.id||oid).slice(0,60),reason:'paypal',platform:'web',environment:'Production',test:false});
  return L.send(res,r2&&r2.code?r2.code:200,Object.assign({paypal:true,orderId:oid,sku:mapped.sku},r2||{}));
 }
 /* 2026-11-25 网页版充值：Xsolla 下单。按商品 SKU（在 Xsolla 后台建好的 gems_5…gems_700，价格在 Xsolla 那边）向 Xsolla 要支付令牌，返回付款页地址。
    API Key 放环境变量 XSOLLA_API_KEY 或后台「系统配置」（secret_xsolla_api）；模式 sandbox/live（secret_xsolla_mode，默认 live）。到账以 Webhook 为准。 */
 if(b.op==='xs_create'){
  const sec=async k=>{try{const r=(await sql('SELECT value FROM config WHERE key=$1',[k]))[0];return r&&typeof r.value==='string'?r.value:'';}catch(_){return '';}};
  const key=process.env.XSOLLA_API_KEY||await sec('secret_xsolla_api');if(!key)return L.send(res,501,{error:'xsolla not configured'});
  const mode=(process.env.XSOLLA_MODE||await sec('secret_xsolla_mode'))==='sandbox'?'sandbox':'live';
  const PID=Number(process.env.XSOLLA_PROJECT_ID)||324046;
  const mapped=gemsForSku(String(b.sku||''),cfg);if(!mapped)return L.bad(res,'unknown product');
  const ip=String((typeof L.ip==='function'?L.ip(req):'')||'').split(',')[0].trim();
  const body={user:{id:{value:String(u.uid)}},purchase:{items:[{sku:mapped.sku,quantity:1}]},settings:{return_url:'https://miru.plus/?xs=done'}};
  if(/^[a-z]{2}$/.test(String(b.lang||'')))body.settings.language=String(b.lang);
  if(mode==='sandbox')body.sandbox=true;
  const H={Authorization:'Basic '+Buffer.from(PID+':'+key).toString('base64'),'Content-Type':'application/json'};
  if(/^[0-9a-fA-F.:]{3,45}$/.test(ip)&&!/^(127\.|10\.|192\.168\.|::1$)/.test(ip))H['X-User-Ip']=ip;else body.user.country={value:'US'};
  const r=await fetch('https://store.xsolla.com/api/v3/project/'+PID+'/admin/payment/token',{method:'POST',headers:H,body:JSON.stringify(body)});
  const j=await r.json().catch(()=>({}));
  if(!r.ok||!j.token)return L.send(res,502,{error:'xsolla create failed',detail:String(j.errorMessage||j.message||j.errorCode||r.status).slice(0,240)});
  return L.send(res,200,{url:(mode==='sandbox'?'https://sandbox-secure.xsolla.com':'https://secure.xsolla.com')+'/paystation4/?token='+encodeURIComponent(j.token),order_id:j.order_id||null,sandbox:mode==='sandbox'});
 }
 if(b.op==='purchase'){
  const sku=String(b.sku||''),SK=Object.assign({},...Object.entries(cfg.skus||{}).map(([k,v])=>({[k]:Number(v.gems)||SKUS[k]||0})));
  if(!(sku in SKUS)&&!(sku in SK))return L.bad(res,'unknown sku');
  const nativeIOS=req.headers.origin==='capacitor://localhost'||String(req.headers['x-miru-client']||'').toLowerCase()==='ios';
  if(nativeIOS)return L.send(res,400,{error:'iOS purchases require a verified App Store transaction'});
  // Existing explicit Web/Android test mode; PAY_TEST must be disabled for a production release.
  if(process.env.PAY_TEST!=='1')return L.send(res,501,{error:'test purchases are not enabled'});
  const r=await W.purchase(sql,u.uid,{sku,gems:SK[sku]||SKUS[sku]},cfg,{key:'buy:'+u.uid+':'+String(b.receipt||L.newId()).slice(0,80),reason:'test',platform:String(b.platform||'web').slice(0,12),environment:'Sandbox',test:true});
  return L.send(res,r&&r.code?r.code:200,Object.assign({test:true},r||{}));
 }
 return L.bad(res,'unknown op');
});
module.exports.gemsForSku=gemsForSku;
