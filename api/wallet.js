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
  const sql=await L.db();let secret=process.env.UNITY_S2S_SECRET||'';if(!secret){try{const r=(await sql("SELECT v FROM secrets WHERE k='unity_s2s'"))[0];secret=r?String(r.v):'';}catch(_){}}if(!secret)return txt(503,'not configured');
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
