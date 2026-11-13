const crypto=require('node:crypto');
const PUBLIC=require('../native/ios-release.public.json');
const ISSUER='https://appleid.apple.com';
const ids=()=>String(process.env.APPLE_CLIENT_ID||'').split(',').map(x=>x.trim()).filter(Boolean);
const nativeId=()=>process.env.APPLE_NATIVE_CLIENT_ID||PUBLIC.bundleId;
function failure(message,code=401,action,retryable=false){return Object.assign(new Error(message),{code,action,retryable});}
function configError(name){return failure('Apple server configuration required: '+name,503,'configure_apple',true);}
function encryptionKey(){const value=process.env.APPLE_TOKEN_ENCRYPTION_KEY||'';if(!/^[A-Za-z0-9+/]{43}=$/.test(value))throw configError('APPLE_TOKEN_ENCRYPTION_KEY (base64, 32 bytes)');const key=Buffer.from(value,'base64');if(key.length!==32)throw configError('APPLE_TOKEN_ENCRYPTION_KEY (base64, 32 bytes)');return key;}
function seal(value,aad){const iv=crypto.randomBytes(12),c=crypto.createCipheriv('aes-256-gcm',encryptionKey(),iv);c.setAAD(Buffer.from(aad));const body=Buffer.concat([c.update(value,'utf8'),c.final()]);return ['v1',iv.toString('base64url'),body.toString('base64url'),c.getAuthTag().toString('base64url')].join('.');}
function open(value,aad){const [version,iv,body,tag,...rest]=String(value).split('.');if(version!=='v1'||!iv||!body||!tag||rest.length)throw failure('Apple stored credential invalid',503,'configure_apple',true);try{const c=crypto.createDecipheriv('aes-256-gcm',encryptionKey(),Buffer.from(iv,'base64url'));c.setAAD(Buffer.from(aad));c.setAuthTag(Buffer.from(tag,'base64url'));return Buffer.concat([c.update(Buffer.from(body,'base64url')),c.final()]).toString('utf8')}catch(e){if(e.action)throw e;throw failure('Apple stored credential cannot be decrypted',503,'configure_apple',true)}}
function signingKey(){if(!process.env.APPLE_PRIVATE_KEY)throw configError('APPLE_PRIVATE_KEY');try{const k=crypto.createPrivateKey(process.env.APPLE_PRIVATE_KEY.replace(/\\n/g,'\n'));if(k.asymmetricKeyType!=='ec'||k.asymmetricKeyDetails.namedCurve!=='prime256v1')throw Error();return k}catch{throw configError('APPLE_PRIVATE_KEY (P-256 .p8)')}}
function ready(client){encryptionKey();signingKey();if(!(process.env.APPLE_TEAM_ID||PUBLIC.teamId))throw configError('APPLE_TEAM_ID');if(!process.env.APPLE_KEY_ID)throw configError('APPLE_KEY_ID');if(client!==nativeId()&&!ids().includes(client))throw configError('APPLE_CLIENT_ID');if(client!==nativeId()&&!process.env.APPLE_REDIRECT_URI)throw configError('APPLE_REDIRECT_URI');}
function clientSecret(client){ready(client);const now=Math.floor(Date.now()/1000),b64=x=>Buffer.from(JSON.stringify(x)).toString('base64url');const body=b64({alg:'ES256',kid:process.env.APPLE_KEY_ID})+'.'+b64({iss:process.env.APPLE_TEAM_ID||PUBLIC.teamId,iat:now,exp:now+300,aud:ISSUER,sub:client});return body+'.'+crypto.sign('sha256',Buffer.from(body),{key:signingKey(),dsaEncoding:'ieee-p1363'}).toString('base64url');}
function isNative(req={}){const h=req.headers||{};return h.origin==='capacitor://localhost'||String(h['x-miru-client']||'').toLowerCase()==='ios';}
let keys=null,keysAt=0;
async function fetchKeys(force=false){if(!force&&keys&&Date.now()-keysAt<3600000)return keys;try{const r=await fetch(ISSUER+'/auth/keys',{signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error();const j=await r.json();if(!Array.isArray(j.keys))throw Error();keys=j.keys;keysAt=Date.now();return keys}catch{throw failure('Apple public keys temporarily unavailable',503,'retry_apple_sign_in',true)}}
async function verifyIdentity(token,audiences,nonce){let head,p,parts;try{parts=String(token).split('.');if(parts.length!==3||parts.some(x=>!x))throw Error();head=JSON.parse(Buffer.from(parts[0],'base64url'));p=JSON.parse(Buffer.from(parts[1],'base64url'));}catch{throw failure('invalid Apple identity token')}
 if(head.alg!=='RS256'||typeof head.kid!=='string')throw failure('invalid Apple token algorithm');
 let jwk=(await fetchKeys()).find(k=>k.kid===head.kid);if(!jwk)jwk=(await fetchKeys(true)).find(k=>k.kid===head.kid);
 if(!jwk||jwk.kty!=='RSA'||(jwk.alg&&jwk.alg!=='RS256')||(jwk.use&&jwk.use!=='sig'))throw failure('unknown Apple token key');
 let valid=false;try{valid=crypto.verify('RSA-SHA256',Buffer.from(parts[0]+'.'+parts[1]),crypto.createPublicKey({key:jwk,format:'jwk'}),Buffer.from(parts[2],'base64url'))}catch{}if(!valid)throw failure('invalid Apple token signature');
 const now=Math.floor(Date.now()/1000);if(p.iss!==ISSUER)throw failure('invalid Apple issuer');if(!audiences.includes(p.aud))throw failure('Apple token audience is for another app');if(!Number.isFinite(p.exp)||p.exp<=now||!Number.isFinite(p.iat)||p.iat>now+60||typeof p.sub!=='string'||!p.sub)throw failure('Apple identity token expired or invalid');
 if(nonce!==undefined&&(typeof p.nonce!=='string'||p.nonce!==nonce))throw failure('Apple nonce mismatch');return p;
}
async function challenge(sql,b={},req={}){const native=b.client==='native'||b.client==='ios'||isNative(req),client=native?nativeId():ids().find(id=>id!==nativeId());if(!client)throw configError('APPLE_CLIENT_ID');ready(client);const nonce=crypto.randomBytes(32).toString('base64url'),id=crypto.randomBytes(32).toString('base64url');await sql('DELETE FROM apple_challenges WHERE expires_at<=now()');await sql("INSERT INTO apple_challenges(id,nonce,client_id,expires_at)VALUES($1,$2,$3,now()+interval '5 minutes')",[id,nonce,client]);return {nonce,challenge:id};}
async function post(endpoint,client,values){try{const r=await fetch(ISSUER+endpoint,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:client,client_secret:clientSecret(client),...values}),signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error();return r}catch(e){if(e.action==='configure_apple')throw e;throw failure('Apple authorization service temporarily unavailable',503,endpoint==='/auth/revoke'?'retry_account_deletion':'retry_apple_sign_in',true)}}
async function authenticate(sql,b,req={}){
 if(!b.challenge&&!b.authorizationCode&&!isNative(req)){const web=ids().filter(id=>id!==nativeId());if(!web.length)throw configError('APPLE_CLIENT_ID');const p=await verifyIdentity(b.idToken,web);return identity(p,null)}
 if(!b.authorizationCode||typeof b.authorizationCode!=='string'||b.authorizationCode.length>4096)throw failure('Apple authorization code required');if(typeof b.challenge!=='string')throw failure('Apple challenge required');
 const c=(await sql('SELECT * FROM apple_challenges WHERE id=$1 AND expires_at>now()',[b.challenge]))[0];if(!c)throw failure('Apple challenge expired or already used');if(isNative(req)&&c.client_id!==nativeId())throw failure('Apple native audience mismatch');ready(c.client_id);
 const p=await verifyIdentity(b.idToken,[c.client_id],c.nonce);
 const consumed=await sql('DELETE FROM apple_challenges WHERE id=$1 AND expires_at>now() RETURNING id',[b.challenge]);if(!consumed.length)throw failure('Apple challenge expired or already used');
 const r=await post('/auth/token',c.client_id,{grant_type:'authorization_code',code:b.authorizationCode,...(c.client_id===nativeId()?{}:{redirect_uri:process.env.APPLE_REDIRECT_URI})});let j;try{j=await r.json()}catch{throw failure('Apple authorization response invalid',503,'retry_apple_sign_in',true)}
 const exchanged=await verifyIdentity(j.id_token,[c.client_id],c.nonce);if(exchanged.sub!==p.sub)throw failure('Apple exchanged identity mismatch');if(typeof j.refresh_token!=='string'||!j.refresh_token)throw failure('Apple authorization response missing refresh token',503,'retry_apple_sign_in',true);
 return identity(p,{client_id:c.client_id,token:seal(j.refresh_token,p.sub+':'+c.client_id)});
}
function identity(p,grant){return {sub:p.sub,email:p.email&&(p.email_verified===true||p.email_verified==='true')?String(p.email).toLowerCase():null,name:null,avatar:null,grant};}
async function saveGrant(sql,uid,p){if(!p.grant)return;const r=await sql("INSERT INTO apple_grants(user_id,client_id,apple_sub,refresh_token) SELECT id,$2,$3,$4 FROM users WHERE id=$1 AND apple_sub=$3 AND (status='active' OR (status='banned' AND ban_until IS NOT NULL AND ban_until<=now())) ON CONFLICT(user_id,client_id)DO UPDATE SET apple_sub=EXCLUDED.apple_sub,refresh_token=EXCLUDED.refresh_token,revoked_at=NULL RETURNING user_id",[uid,p.grant.client_id,p.sub,p.grant.token]);if(!r.length)throw failure('Apple account is unavailable',409,'retry_apple_sign_in',true);}
async function deleteAccount(sql,u,L){
 const begun=(await sql('SELECT miru_begin_account_deletion($1,$2) AS result',[u.id,u.tv||0]))[0].result;
 if(begun.error)throw failure(begun.error,begun.code,begun.action,begun.code!==401);
 u=begun.account;if(begun.done)return {ok:true,...(u.deletion_apple_gap?{appleRevocation:'unverifiable_legacy_history'}:{})};
 const grants=await sql('SELECT * FROM apple_grants WHERE user_id=$1',[u.id]);
 for(const g of grants)if(!g.revoked_at)ready(g.client_id);
 for(const g of grants)if(!g.revoked_at){await post('/auth/revoke',g.client_id,{token:open(g.refresh_token,g.apple_sub+':'+g.client_id),token_type_hint:'refresh_token'});await sql('UPDATE apple_grants SET revoked_at=now() WHERE user_id=$1 AND client_id=$2 AND refresh_token=$3',[u.id,g.client_id,g.refresh_token]);}
 try{for(const a of await sql('SELECT url FROM assets WHERE owner=$1',[u.id]))if(a.url)await L.blobDel(a.url,true);await require('./_voice').cleanupOwner(sql,u.id);await sql('SELECT miru_delete_account($1)',[u.id]);return {ok:true,...(u.deletion_apple_gap?{appleRevocation:'unverifiable_legacy_history'}:{})}}catch(e){if(e.action)throw e;throw failure('Account deletion cleanup temporarily unavailable; retry deletion',503,'retry_account_deletion',true)}
}
const SCHEMA=[
 `CREATE TABLE IF NOT EXISTS voice_clips(id text PRIMARY KEY,user_id text NOT NULL,ext text NOT NULL,store_id text NOT NULL,state text NOT NULL,created_at timestamptz NOT NULL DEFAULT now())`,
 `ALTER TABLE users ADD COLUMN IF NOT EXISTS deletion_version integer NOT NULL DEFAULT 0`,
 `ALTER TABLE users ADD COLUMN IF NOT EXISTS deletion_apple_gap boolean NOT NULL DEFAULT false`,
 `ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at timestamptz`,
 `CREATE TABLE IF NOT EXISTS apple_challenges(id text PRIMARY KEY,nonce text NOT NULL,client_id text NOT NULL,expires_at timestamptz NOT NULL)`,
 `CREATE INDEX IF NOT EXISTS apple_challenges_exp_idx ON apple_challenges(expires_at)`,
 `CREATE TABLE IF NOT EXISTS apple_grants(user_id text NOT NULL,client_id text NOT NULL,apple_sub text NOT NULL,refresh_token text NOT NULL,revoked_at timestamptz,PRIMARY KEY(user_id,client_id))`,
 `CREATE OR REPLACE FUNCTION miru_begin_account_deletion(p_uid text,p_tv integer)RETURNS jsonb LANGUAGE plpgsql AS $$
 DECLARE u users%ROWTYPE; legacy boolean;
 BEGIN
  SELECT * INTO u FROM users WHERE id=p_uid FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('code',401,'error','account not found'); END IF;
  IF u.status='deleted' AND u.deletion_version>=2 THEN RETURN jsonb_build_object('done',true,'account',to_jsonb(u)); END IF;
  legacy:=u.deletion_version<2 AND (u.status='deleted' OR (u.status='deletion_pending' AND u.deletion_apple_gap));
  IF COALESCE(u.tv,0)<>p_tv AND NOT(legacy AND COALESCE(u.tv,0)=p_tv+1) THEN RETURN jsonb_build_object('code',401,'error','session expired — please sign in again'); END IF;
  IF u.apple_sub IS NOT NULL AND NOT EXISTS(SELECT 1 FROM apple_grants WHERE user_id=p_uid AND apple_sub=u.apple_sub) THEN RETURN jsonb_build_object('code',409,'error','Sign in with Apple again to delete this account','action','apple_reauthentication_required'); END IF;
  UPDATE users SET status='deletion_pending',deletion_apple_gap=deletion_apple_gap OR legacy WHERE id=p_uid RETURNING * INTO u;
  RETURN jsonb_build_object('done',false,'account',to_jsonb(u));
 END $$`,
 `CREATE OR REPLACE FUNCTION miru_delete_account(p_uid text)RETURNS void LANGUAGE plpgsql AS $$
 DECLARE u users%ROWTYPE; t text;
 BEGIN
  SELECT * INTO u FROM users WHERE id=p_uid FOR UPDATE;
  IF NOT FOUND OR (u.status='deleted' AND u.deletion_version>=2) THEN RETURN; END IF;
  IF u.status<>'deletion_pending' THEN RAISE EXCEPTION 'account deletion was not started'; END IF;
  IF EXISTS(SELECT 1 FROM apple_grants WHERE user_id=p_uid AND revoked_at IS NULL) THEN RAISE EXCEPTION 'Apple authorization not revoked'; END IF;
  IF EXISTS(SELECT 1 FROM voice_clips WHERE user_id=p_uid AND state='writing') THEN RAISE EXCEPTION 'voice operation unresolved'; END IF;
  UPDATE reports SET user_id=CASE WHEN user_id=p_uid THEN NULL ELSE user_id END,reason=NULL,note=NULL,target_id=CASE WHEN target_kind='user' AND target_id=p_uid THEN NULL ELSE target_id END
  WHERE user_id=p_uid OR (target_kind='user' AND target_id=p_uid) OR (target_kind='work' AND target_id IN(SELECT id FROM works WHERE author=p_uid)) OR (target_kind='asset' AND target_id IN(SELECT id FROM assets WHERE owner=p_uid));
  UPDATE audit_log SET detail='{}'::jsonb,ip=NULL WHERE (target_kind='user' AND target_id=p_uid) OR (target_kind='work' AND target_id IN(SELECT id FROM works WHERE author=p_uid)) OR (target_kind='asset' AND target_id IN(SELECT id FROM assets WHERE owner=p_uid));
  DELETE FROM work_likes WHERE user_id=p_uid OR work_id IN(SELECT id FROM works WHERE author=p_uid);
  DELETE FROM states WHERE user_id=p_uid;
  DELETE FROM memories WHERE user_id=p_uid;
  DELETE FROM works WHERE author=p_uid;
  DELETE FROM assets WHERE owner=p_uid;
  DELETE FROM events WHERE user_id=p_uid;
  DELETE FROM usage WHERE user_id=p_uid OR user_id='mail:'||u.email OR user_id='login:'||u.email OR user_id='sms:'||u.phone;
  DELETE FROM voice_clips WHERE user_id=p_uid;
  DELETE FROM user_days WHERE user_id=p_uid;
  DELETE FROM reset_codes WHERE email=u.email OR email='reg:'||u.email OR email='sms:'||u.phone;
  DELETE FROM apple_grants WHERE user_id=p_uid;
  DELETE FROM wallet WHERE user_id=p_uid;
  DELETE FROM wallet_accounts WHERE user_id=p_uid;
  FOREACH t IN ARRAY ARRAY['m102_checkpoints','votes','task_claims'] LOOP
   IF to_regclass('public.'||t)IS NOT NULL THEN EXECUTE format('DELETE FROM %I WHERE user_id=$1',t)USING p_uid; END IF;
  END LOOP;
  UPDATE users SET status='deleted',deletion_version=2,deleted_at=now(),email=NULL,phone=NULL,pass=NULL,name=NULL,avatar=NULL,google_sub=NULL,apple_sub=NULL,note=NULL,lang=NULL,platform=NULL,provider=NULL,ban_reason=NULL,ban_until=NULL,adult_verified_at=NULL,adult_verified_by=NULL,last_seen=NULL,tv=COALESCE(tv,0)+1 WHERE id=p_uid;
 END $$`
];
module.exports={SCHEMA,challenge,authenticate,verifyIdentity,saveGrant,deleteAccount,seal,open};
