const crypto=require('node:crypto');
const BASE={gems_5:5,gems_16:15,gems_28:25,gems_60:50,gems_125:100,gems_330:250,gems_700:500};
const INSTALL=`CREATE OR REPLACE FUNCTION miru_wallet_write(p_uid text,b jsonb)
RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE
 k text := NULLIF(b->>'key','');
 amount integer := (b->>'delta')::integer;
 bonus integer := 0;
 balance integer;
 owner text;
 receipt_id bigint;
 used integer;
 ord jsonb := b->'order';
BEGIN
 PERFORM pg_advisory_xact_lock(hashtextextended('miru-board:' || p_uid,0));
 INSERT INTO wallet (user_id,gems) VALUES (p_uid,0) ON CONFLICT DO NOTHING;
 SELECT gems INTO balance FROM wallet WHERE user_id=p_uid FOR UPDATE;
 IF k IS NOT NULL THEN
  SELECT user_id INTO owner FROM ledger WHERE key=k;
  IF owner IS NOT NULL THEN
   IF owner<>p_uid THEN RETURN jsonb_build_object('code',409,'error','receipt belongs to another account'); END IF;
   RETURN jsonb_build_object('gems',balance,'dup',true);
  END IF;
 END IF;
 IF ord IS NOT NULL AND ord<>'null'::jsonb THEN
  IF NOT EXISTS(SELECT 1 FROM orders WHERE user_id=p_uid AND status IN ('paid','refunded'))
     AND NOT EXISTS(SELECT 1 FROM ledger WHERE user_id=p_uid AND delta>0 AND (key LIKE 'iap:%' OR key LIKE 'play:%' OR key LIKE 'buy:%')) THEN
   bonus:=COALESCE((b->>'bonus')::integer,0);
  END IF;
  amount:=amount+bonus;
 END IF;
 IF b ? 'earnCap' AND amount>(b->>'earnCap')::integer THEN RETURN jsonb_build_object('code',429,'error','daily free-diamond limit reached','gems',balance); END IF;
 IF balance+amount<0 THEN RETURN NULL; END IF;
 INSERT INTO ledger(user_id,delta,reason,key,balance)
 VALUES(p_uid,amount,left(COALESCE(b->>'reason',''),40),k,balance+amount)
 ON CONFLICT(key) DO NOTHING RETURNING id INTO receipt_id;
 IF receipt_id IS NULL THEN
  SELECT user_id INTO owner FROM ledger WHERE key=k;
  IF owner IS DISTINCT FROM p_uid THEN RETURN jsonb_build_object('code',409,'error','receipt belongs to another account'); END IF;
  RETURN jsonb_build_object('gems',balance,'dup',true);
 END IF;
 IF b ? 'earnCap' THEN
  INSERT INTO usage(user_id,day,kind,n) VALUES(p_uid,CURRENT_DATE,'earn',amount)
  ON CONFLICT(user_id,day,kind) DO UPDATE SET n=usage.n+EXCLUDED.n
  WHERE usage.n+EXCLUDED.n<=(b->>'earnCap')::integer RETURNING n INTO used;
  IF used IS NULL THEN
   DELETE FROM ledger WHERE id=receipt_id;
   RETURN jsonb_build_object('code',429,'error','daily free-diamond limit reached','gems',balance);
  END IF;
 END IF;
 UPDATE wallet SET gems=gems+amount,updated_at=now() WHERE user_id=p_uid RETURNING gems INTO balance;
 IF ord IS NOT NULL AND ord<>'null'::jsonb THEN
  INSERT INTO orders(id,user_id,sku,platform,gems,price_cents,currency,status,test,receipt,environment)
  VALUES(ord->>'id',p_uid,ord->>'sku',ord->>'platform',amount,(ord->>'price')::integer,'USD','paid',(ord->>'test')::boolean,k,ord->>'environment');
 END IF;
 RETURN jsonb_build_object('gems',balance,'dup',false,'credited',amount,'doubled',bonus>0);
END $$`;
const SCHEMA=[
 'CREATE TABLE IF NOT EXISTS wallet_accounts(user_id text PRIMARY KEY,app_account_token uuid NOT NULL UNIQUE)',
 "ALTER TABLE orders ADD COLUMN IF NOT EXISTS environment text NOT NULL DEFAULT 'Production'",
 INSTALL
];
async function accountToken(sql,uid){
 await sql('INSERT INTO wallet_accounts(user_id,app_account_token) VALUES($1,$2::uuid) ON CONFLICT(user_id) DO NOTHING',[uid,crypto.randomUUID()]);
 return (await sql('SELECT app_account_token FROM wallet_accounts WHERE user_id=$1',[uid]))[0].app_account_token;
}
function appleProducts(cfg){
 const products=new Map();
 for(const [sku,value] of Object.entries((cfg&&cfg.skus)||{})){
  if(!value||typeof value.apple!=='string'||!value.apple)continue;
  if(products.has(value.apple))throw new Error('duplicate Apple product mapping');
  const gems=Number(value.gems);
  if(!Number.isSafeInteger(gems)||gems<=0)throw new Error('invalid Apple product gems');
  products.set(value.apple,{sku,gems});
 }
 return products;
}
async function info(sql,uid,cfg){
 const last=await sql("SELECT environment FROM orders WHERE user_id=$1 AND platform='ios' ORDER BY at DESC,id DESC LIMIT 1",[uid]);
 const environment=last[0]?last[0].environment:'Production';
 const token=await accountToken(sql,uid);
 let productIds,error;
 try{productIds=[...appleProducts(cfg).keys()];}
 catch(_){productIds=[];error='Apple product catalog is unavailable';}
 return {appAccountToken:token,environment,productIds,test:environment==='Sandbox',available:productIds.length>0,...(error?{error}:{})};
}
function validateIdentity(t,token){
 if(t.bundleId!==(process.env.IAP_BUNDLE_ID||'com.miru.plus.app'))throw new Error('transaction for another app');
 if(typeof t.transactionId!=='string'||!/^[0-9]{1,80}$/.test(t.transactionId))throw new Error('invalid transactionId');
 if(t.type!=='Consumable')throw new Error('transaction must be Consumable');
 if(t.quantity!==1)throw new Error('transaction quantity must be 1');
 if(t.environment!=='Production'&&t.environment!=='Sandbox')throw new Error('invalid transaction environment');
 if(typeof t.appAccountToken!=='string'||t.appAccountToken.toLowerCase()!==String(token).toLowerCase())throw new Error('transaction belongs to another account');
}
function validateApple(t,token,cfg){
 validateIdentity(t,token);
 const mapped=appleProducts(cfg).get(t.productId);
 if(!mapped)throw new Error('unknown Apple product');return mapped;
}
async function replay(sql,uid,transactionId){
 const rows=await sql(`SELECT l.user_id,w.gems,
  (SELECT o.sku FROM orders o WHERE o.user_id=l.user_id AND o.receipt=l.key ORDER BY o.at DESC,o.id DESC LIMIT 1) AS sku
  FROM ledger l LEFT JOIN wallet w ON w.user_id=l.user_id WHERE l.key=$1`,['iap:'+transactionId]);
 if(!rows[0])return null;
 if(rows[0].user_id!==uid)return {code:409,error:'receipt belongs to another account'};
 return {gems:rows[0].gems||0,dup:true,sku:rows[0].sku||undefined};
}
async function write(sql,uid,body){
 if(!Number.isSafeInteger(body.delta)||Math.abs(body.delta)>2147483647)throw new Error('invalid wallet delta');
 return (await sql('SELECT miru_wallet_write($1,$2::jsonb) AS result',[uid,JSON.stringify(body)]))[0].result;
}
async function apply(sql,uid,delta,reason,key){return write(sql,uid,{delta,reason,key});}
async function purchase(sql,uid,mapped,cfg,details){
 const price=Number((((cfg||{}).skus||{})[mapped.sku]||{}).usd)||0;
 return write(sql,uid,{delta:mapped.gems,bonus:cfg.first_purchase_double===false?0:(BASE[mapped.sku]||0),reason:mapped.sku+'('+details.reason+')',key:details.key,
 order:{id:'o_'+crypto.randomUUID(),sku:mapped.sku,platform:details.platform,price,test:!!details.test,environment:details.environment||'Production'}});
}
module.exports={INSTALL,SCHEMA,apply,write,purchase,info,accountToken,appleProducts,validateApple,validateIdentity,replay};
