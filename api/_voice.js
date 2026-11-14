const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const VEXT={'audio/webm':'webm','audio/ogg':'ogg','audio/mp4':'m4a','audio/aac':'aac','audio/mpeg':'mp3','audio/wav':'wav','audio/x-wav':'wav','audio/x-m4a':'m4a'};
const VMIME={webm:'audio/webm',ogg:'audio/ogg',m4a:'audio/mp4',aac:'audio/aac',mp3:'audio/mpeg',wav:'audio/wav'};
const isUV=id=>/^u[0-9a-f]{20}$/.test(String(id||''));let cachedDir;
function directory(){if(cachedDir)return cachedDir;const explicit=process.env.MIRU_VOICE_DIR;const choices=explicit?[path.resolve(explicit)]:[path.resolve(process.cwd(),'..','..','shared','voices'),path.join(os.tmpdir(),'miru-voices')];for(const d of choices){try{fs.mkdirSync(d,{recursive:true});fs.accessSync(d,fs.constants.W_OK);return cachedDir=d}catch(e){if(explicit)throw problem('Configured voice directory is unavailable','configure_voice_storage')}}throw problem('Voice storage unavailable','configure_voice_storage');}
function storeId(){const dir=path.resolve(directory());return process.env.MIRU_VOICE_STORE_ID||'local:'+os.hostname()+':'+dir;}
function problem(message,action,code=503){return Object.assign(new Error(message),{code,action,retryable:code!==403});}
function file(id){if(!isUV(id))return null;for(const ext of Object.keys(VMIME)){const f=path.join(directory(),id+'.'+ext);if(fs.existsSync(f))return {f,type:VMIME[ext]}}return null;}
function unlink(row){if(row.store_id!==storeId())throw problem('Voice files require their original persistent storage','configure_voice_storage');if(!isUV(row.id)||!VMIME[row.ext])throw problem('Voice storage registration invalid','configure_voice_storage');try{fs.unlinkSync(path.join(directory(),row.id+'.'+row.ext))}catch(e){if(e.code!=='ENOENT')throw e}}
async function create(sql,uid,ext,buffer){
 const id='u'+crypto.randomBytes(10).toString('hex');
 await sql("INSERT INTO voice_clips(id,user_id,ext,store_id,state)VALUES($1,$2,$3,$4,'writing')",[id,uid,ext,storeId()]);
 const row={id,ext,store_id:storeId()};
 try{fs.writeFileSync(path.join(directory(),id+'.'+ext),buffer);await sql("UPDATE voice_clips SET state='ready' WHERE id=$1",[id]);return id}
 catch(e){try{unlink(row);await sql("UPDATE voice_clips SET state='ready' WHERE id=$1",[id])}catch(_){}throw problem('Voice save interrupted; cleanup remains registered','retry_voice_save')}
}
async function remove(sql,uid,id){
 const row=(await sql('SELECT * FROM voice_clips WHERE id=$1',[id]))[0];
 if(!row){if(file(id))throw problem('Legacy voice ownership needs operator inventory','legacy_voice_owner_unknown',409);return {ok:true}}
 if(row.user_id!==uid)throw problem('voice clip belongs to another account','voice_owner_required',403);
 if(row.state==='writing')throw problem('Voice save still pending; retry','pending_voice_operation');
 unlink(row);await sql('DELETE FROM voice_clips WHERE id=$1 AND user_id=$2',[id,uid]);return {ok:true};
}
async function cleanupOwner(sql,uid){
 const rows=await sql('SELECT * FROM voice_clips WHERE user_id=$1',[uid]);
 if(rows.some(r=>r.state==='writing'))throw problem('Voice save unresolved; operator reconciliation may be required','pending_voice_operation');
 for(const row of rows)unlink(row);

}
const SCHEMA=["CREATE TABLE IF NOT EXISTS voice_clips(id text PRIMARY KEY,user_id text NOT NULL,ext text NOT NULL,store_id text NOT NULL,state text NOT NULL,created_at timestamptz NOT NULL DEFAULT now())"];
module.exports={SCHEMA,VEXT,VMIME,isUV,file,directory,storeId,create,remove,cleanupOwner};
