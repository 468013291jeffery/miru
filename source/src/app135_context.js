/* 作品级上下文摘录：保留完整聊天，只压缩模型输入，并按当时见证人隔离记忆。 */
const CONTEXT135={tailChars:1400,actorTailChars:1000,recapChars:1300,memoryChars:1000,lineChars:280,recent:12,digestRows:48,pinRows:48};
function contextConfig135(th){const b=th&&th.b98&&typeof bOf98==='function'&&bOf98(wd(th.wid)),c=b&&b.experience&&b.experience.context;return c&&c.schema===1&&c.enabled===true?c:null;}
function contextOn135(th){return !!contextConfig135(th);}
function contextState135(th){const A=th.b98;if(!A.context135||A.context135.schema!==1)A.context135={schema:1,seq:0,digest:[],pins:[],through:0,stats:{}};return A.context135;}
function contextName135(th,id){if(id==='me')return typeof yn98==='function'?yn98(th):'PLAYER';const c=typeof ch==='function'&&ch(id);return c&&c.n?String(c.n):String(id||'');}
function contextHere135(th){const s=typeof scene98==='function'&&scene98(th).s;return s&&typeof here98==='function'?here98(th,s).filter(id=>(th.cast||[]).includes(id)):[];}
function contextPrivate135(m){return !!(m&&(m.sense98||m.k==='think'||m.k==='dir'||m.private||(m.context135&&m.context135.kind==='private')));}
function contextStyle135(m){return !!(m&&m.narrative135&&m.narrative135.kind==='style');}
function contextAppend135(th,m){
 if(!contextOn135(th)||!m||typeof m!=='object'||m.context135&&m.context135.schema===1)return m;
 const st=contextState135(th),A=th.b98,s=typeof scene98==='function'&&scene98(th).s,priv=contextPrivate135(m),style=contextStyle135(m),who=m.say&&m.say.who||m.who,seen=m.narrative145?[...new Set((m.narrative145.facts||[]).flatMap(f=>f.seen||[]))]:priv||style?[]:contextHere135(th);
 if(!priv&&!style&&(th.cast||[]).includes(who)&&!seen.includes(who))seen.push(who);
 m.context135={schema:1,id:String(th.id)+':'+(++st.seq),seen:[...new Set(seen)],chapter:A.ch,scene:s&&s.id||'',turn:A.turns||0,kind:priv?'private':style?'style':m.ev98?'event':m.k==='say'||m.k==='box'||m.lines98?'quote':m.who==='n'?'scene':m.k==='act'?'action':'other'};return m;
}
function contextVisible135(th,m,cid){
 if(!m||contextPrivate135(m)||contextStyle135(m))return false;if(!cid)return true;
 if(m.narrative145)return (m.narrative145.facts||[]).some(f=>(f.seen||[]).includes(cid));const a=m.context135;
 if(a&&a.schema===1)return Array.isArray(a.seen)&&a.seen.includes(cid);
 return m.who===cid||!!(m.say&&m.say.who===cid); // Unknown legacy attendance is never retroactively shared.
}
function contextText135(th,m,cid){
 if(m.narrative145)return (m.narrative145.facts||[]).filter(f=>!cid||(f.seen||[]).includes(cid)).map(f=>'[NARRATIVE '+(f.kind==='reveal'?'REVEALED':'OBSERVED')+' '+f.id+'] '+f.text).join('\n');
 const clean=v=>typeof v==='string'?v.replace(/\s+/g,' ').trim():'',t=clean(m.txt),who=m.say&&m.say.who||m.who,name=contextName135(th,who);
 if(m.ph98)return name+(m.ph98.open?' [PHOTO OPENED] '+clean(m.ph98.what):' [PHOTO SENT, NOT OPENED]');
 if(m.k==='box'&&m.say){const a=(m.parts||[]).filter(p=>p&&(p.k==='act'||p.kind==='act')).map(p=>clean(p.txt)).filter(Boolean).join(' ').slice(0,80);return (a?'[ACTION REPORT; attempt is not success] '+name+': '+a+'\n':'')+(clean(m.say.txt)?'[QUOTED SPEECH; not proof of completion] '+name+': '+clean(m.say.txt).slice(0,120):'');}
 if(m.k==='card'&&Array.isArray(m.lines98))return m.lines98.filter(l=>l&&l.say).map(l=>'[QUOTED SPEECH] '+contextName135(th,l.who)+': '+clean(l.say)).join('\n');
 if(m.sec98)return '[COMMITTED SECRET RECEIPT '+String(m.sec98)+'] '+(t||clean(m.title));
 if(['card','react','img'].includes(m.k)||!t)return ''; // Cards may contain pending authored outcome hints.
 if(m.ev98)return '[COMMITTED EVENT '+String(m.ev98)+'] '+t;
 if(m.who==='n')return '[VISIBLE SCENE] '+t;
 if(m.k==='act')return '[ACTION REPORT; attempt is not success] '+name+': '+t;
 if(m.k==='say')return '[QUOTED SPEECH; not proof of completion] '+name+': '+t;
 return '';
}
function contextRows135(th,cid){
 const rows=[],messages=th.msgs||[];
 for(let i=0;i<messages.length;i++){const m=messages[i];if(!contextVisible135(th,m,cid))continue;const t=contextText135(th,m,cid);if(!t)continue;const a=m.context135;
 const pin=m.sec98?'secret':m.ev98?'event':m.narrative145&&m.narrative145.facts.length?'clue':/(?:^|[\s，。！？：:]|你|请)别(?:再)?|不要|不想|拒绝|只做朋友|先做朋友|停止|保持距离|不接受|不答应|\b(?:don.t|do not|stop|refuse|friends only|keep your distance)\b/i.test(t)?'boundary':/答应|承诺|保证|我会|我愿意|\b(?:I will|I.ll|promise|agree to)\b/i.test(t)?'promise':'';
 rows.push({id:a&&a.id||String(th.id)+':legacy:'+i,index:i,who:m.say&&m.say.who||m.who,seen:a&&Array.isArray(a.seen)?a.seen.slice():null,text:t.length>CONTEXT135.lineChars?t.slice(0,CONTEXT135.lineChars-1)+'…':t,kind:a&&a.kind||'legacy',chapter:a&&a.chapter||0,pin});}
 return rows;
}
function contextWindow135(rows,cap,limit){
 const chosen=[],lines=[];let size=0;
 for(const r of rows.slice().reverse()){const line='['+(r.kind==='legacy'?'L'+r.index:'M'+String(r.id).split(':').pop())+'] '+r.text;if(lines.length>=limit)break;
  if(size+line.length+1>cap){if(!lines.length&&cap>1){chosen.unshift(r);lines.unshift(line.slice(0,cap-1)+'…');}break;}
  chosen.unshift(r);lines.unshift(line);size+=line.length+1;}
 return {rows:chosen,text:lines.join('\n')};
}
function contextFit135(rows,cap,limit){return contextWindow135(rows,cap,limit).text;}
function contextRecent135(th,n,cid){return contextWindow135(contextRows135(th,cid),cid?CONTEXT135.actorTailChars:CONTEXT135.tailChars,Math.min(n||12,cid?8:10));}
function contextTail135(th,n,cid){if(!contextOn135(th))return typeof tail98==='function'?tail98(th,n):'';return contextRecent135(th,n,cid).text;}
function contextCanonical135(th,cid){
 const A=th.b98,rows=[],state=A.experienceState||{},boundary=state.romanceMode?'CURRENT relationship boundary: '+state.romanceMode+' (not consent to any act).':'';
 if(!cid&&state.focus)rows.push('CURRENT focus: '+state.focus);
 for(const c of (state.choices||[]).slice(-16)){if(cid&&!(th.msgs||[]).some(m=>m.who==='me'&&m.txt===c.text&&m.context135&&m.context135.scene===c.scene&&m.context135.chapter===c.chapter&&contextVisible135(th,m,cid)))continue;rows.push('SELECTED ch'+c.chapter+' '+c.scene+': '+String(c.text||'').slice(0,100)+' (selection, not completed effects)');}
 if(!cid){for(const [id,key] of Object.entries(A.picked||{}).slice(-16))rows.push('SELECTED '+id+': '+String(key));}
 for(const [id,g] of Object.entries(A.gameResults||{}).slice(-16)){if(!g||cid&&!(g.participants||[]).includes(cid))continue;rows.push('GAME RECEIPT '+id+': '+String(g.result)+' (result only; follow-up not yet proven)');}
 const secretRows=(th.msgs||[]).filter(m=>m.sec98&&contextVisible135(th,m,cid)).slice(-4).map(m=>'SECRET REVEALED '+String(m.sec98)+': '+String(m.txt||m.title||'').slice(0,90));
 if(typeof narrativeOn145==='function'&&narrativeOn145(th))for(const f of narrativeFacts145(th,cid).slice(-4))rows.push('NARRATIVE '+f.id+': '+f.text);
 const receipts=secretRows.join('\n').slice(-240);
 const cap=cid?450:750,tail=[];let used=boundary.length+receipts.length;for(const row of rows.slice().reverse()){if(used+row.length+1>cap)break;tail.unshift(row);used+=row.length+1;}return [boundary,receipts,...tail].filter(Boolean).join('\n');
}
function contextStored135(th,cid){
 const st=contextState135(th),canSee=r=>!cid||(Array.isArray(r.seen)?r.seen.includes(cid):r.who===cid);
 const recent=new Set(contextRecent135(th,12,cid).rows.map(r=>r.id));
 const pins=(st.pins||[]).filter(r=>canSee(r)&&!recent.has(r.id)),ids=new Set(pins.map(r=>r.id));
 return {pins,digest:(st.digest||[]).filter(r=>canSee(r)&&!ids.has(r.id)&&!recent.has(r.id))};
}
function contextRecap135(th,zh){if(!contextOn135(th))return '';const {pins,digest}=contextStored135(th);return ('\n'+(zh?'已核实状态与有来源的旧记录（引文不是已兑现承诺；更新表达优先）：\n':'Verified state and sourced older records (quotes are not fulfilled promises; later statements take priority):\n')+[contextCanonical135(th),(th.b98.keep98||[]).length?'DIRECTOR KEY RECORDS: '+th.b98.keep98.slice(-4).join('；').slice(0,280):'',contextFit135(pins,350,5),contextFit135(digest,250,4)].filter(Boolean).join('\n')).slice(0,CONTEXT135.recapChars);}
function contextMemory135(th,cid){
 if(!contextOn135(th))return '';const cd=th.b98.cards&&th.b98.cards[cid],mem=cd&&Array.isArray(cd.mem)?cd.mem:[];
 const initial=mem.filter(x=>typeof x==='string'&&/^(?:（初始知道）|\(known from the start\))/.test(x)).slice(0,1).join('\n').slice(0,200),{pins,digest}=contextStored135(th,cid);
 return [initial,contextCanonical135(th,cid),contextFit135(pins,270,4),contextFit135(digest,230,4)].filter(Boolean).join('\n').slice(0,CONTEXT135.memoryChars);
}
function contextSelect135(rows,cast,limit,each){
 const selected=new Map(),people=cast||[],quota=Math.min(each,Math.floor(limit/(people.length+1))),add=list=>list.forEach(r=>selected.set(r.id,r));
 for(const cid of people)add(rows.filter(r=>Array.isArray(r.seen)?r.seen.includes(cid):r.who===cid).slice(-quota));for(const row of rows.slice().reverse()){if(selected.size>=limit)break;selected.set(row.id,row);}
 return [...selected.values()].sort((a,b)=>a.index-b.index).slice(-limit);
}
function contextPreview135(th,cid){if(!contextOn135(th))return {enabled:false};return {enabled:true,recent:contextTail135(th,12,cid),memory:cid?contextMemory135(th,cid):contextRecap135(th,typeof Z98==='function'&&Z98()),limits:Object.assign({},CONTEXT135),stats:Object.assign({},contextState135(th).stats)};}
async function contextCompress135(th){
 if(!contextOn135(th)||th.b98.ended)return false;const A=th.b98,st=contextState135(th),messages=th.msgs||[],length=messages.length,last=messages[length-1],seq=st.seq,rows=contextRows135(th);
 // Store all candidate evidence, then exclude the actual bounded recent window at read time. This avoids gaps when a few long lines fill that window.
 const digest=contextSelect135(rows,th.cast,CONTEXT135.digestRows,6),pins=contextSelect135(rows.filter(r=>r.pin),th.cast,CONTEXT135.pinRows,6);
 await Promise.resolve();if(th.b98!==A||A.ended||th.msgs!==messages||messages.length!==length||messages[length-1]!==last||A.context135!==st||st.seq!==seq)return false;
 st.digest=digest;st.pins=pins;st.through=length;
 const raw=messages.map(m=>typeof line98==='function'?line98(th,m):contextText135(th,m)),before=raw.slice(-14).join('\n').length+(A.sum||[]).slice(-8).join('\n').length+String(A.recap98||'').length+(A.keep98||[]).slice(-12).join('；').length;
 const actorBefore=Math.max(0,...(th.cast||[]).map(cid=>{const memory=(((A.cards||{})[cid]||{}).mem||[]);return raw.slice(-12).join("\n").length+memory.slice(-22).join("\n").length;}));
 const after=contextTail135(th,14).length+contextRecap135(th,true).length;
 const actorAfter=Math.max(0,...(th.cast||[]).map(cid=>contextTail135(th,12,cid).length+contextMemory135(th,cid).length));
 st.stats={messages:length,compactedThrough:length,sourceRows:rows.length,keptRows:digest.length,pinnedRows:pins.length,directorBeforeChars:before,directorAfterChars:after,actorBeforeMaxChars:actorBefore,actorAfterMaxChars:actorAfter,modelCalls:0,atTurn:A.turns||0};if(typeof save==='function')save();return true;
}
if(typeof appendMsg==='function'){const contextAppendBase135=appendMsg;appendMsg=function(th,m){contextAppend135(th,m);return contextAppendBase135.apply(this,arguments);};}
if(typeof window!=='undefined')window.CONTEXT135={preview:contextPreview135,stats:th=>contextOn135(th)?Object.assign({},contextState135(th).stats):{enabled:false}};
