// M102 checkpoints: owner authentication + compare-and-swap + idempotent request IDs.
const L=require('./_lib'),E=require('./_m102engine'),DATA=require('./_m102data.json');
module.exports=L.wrap(async(req,res)=>{
 if(!L.cors(req,res,'GET, POST, OPTIONS'))return;
 const u=await L.needActive(req,res);if(!u)return;
 const b=req.method==='GET'?(req.query||{}):L.jsonBody(req),session=String(b.session||'');
 if(!/^[a-zA-Z0-9_-]{1,80}$/.test(session))return L.bad(res,'invalid session',400);
 const sql=await L.db();
 await sql('CREATE TABLE IF NOT EXISTS m102_checkpoints (user_id TEXT NOT NULL, session_id TEXT NOT NULL, data JSONB NOT NULL, ver INTEGER NOT NULL DEFAULT 0, updated_at TIMESTAMPTZ DEFAULT now(), PRIMARY KEY(user_id,session_id))');
 await sql('INSERT INTO m102_checkpoints(user_id,session_id,data) VALUES($1,$2,$3::jsonb) ON CONFLICT DO NOTHING',[u.uid,session,JSON.stringify(E.initial())]);
 const row=(await sql('SELECT data,ver FROM m102_checkpoints WHERE user_id=$1 AND session_id=$2',[u.uid,session]))[0];
 if(req.method==='GET')return L.send(res,200,{state:row.data,ver:row.ver});
 if(req.method!=='POST')return L.bad(res,'method not allowed',405);
 if(row.data.events.some(e=>e.request===(b.action||{}).id))return L.send(res,200,{state:row.data,ver:row.ver,replayed:true});
 if(b.ver!==row.ver)return L.send(res,409,{error:'checkpoint changed on another device',state:row.data,ver:row.ver});
 let next;try{next=E.apply(row.data,b.action,DATA);}catch(e){return L.bad(res,e.message,400);}
 const updated=await sql('UPDATE m102_checkpoints SET data=$3::jsonb,ver=ver+1,updated_at=now() WHERE user_id=$1 AND session_id=$2 AND ver=$4 RETURNING data,ver',[u.uid,session,JSON.stringify(next),row.ver]);
 if(!updated.length)return L.send(res,409,{error:'checkpoint changed; reload and retry'});
 L.send(res,200,{state:updated[0].data,ver:updated[0].ver});
});
