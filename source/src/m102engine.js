/* M102 deterministic state. Shared verbatim by browser and authenticated API. */
(function(root,factory){const E=factory();if(typeof module==='object'&&module.exports)module.exports=E;else root.M102Engine=E;})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';
 const actors=['luca','sebastian','nolan','gabriel'];
 const clone=o=>JSON.parse(JSON.stringify(o));
 function initial(){return {version:7,next_chapter:1,choices:{},fields:{ownership_control:'sole'},events:[],facts:[],affinity_target:null,confirmed_relationship:null,celebration_guest:null,consent:{},access:Object.fromEntries(actors.map(k=>[k,true])),actor_knowledge:Object.fromEntries(actors.map(k=>[k,[]])),relations:Object.fromEntries(actors.map(k=>[k,{trust:15,affection:15,conflict:0,respect:0}]))};}
 function fail(t){throw new Error(t);}
 function apply(state,action,data){
  const s=clone(state),a=action||{};
  if(!a.id||typeof a.id!=='string'||a.id.length>100)fail('event id required');
  if(s.events.some(x=>x.request===a.id))return s;
  if(a.op==='choice'){
   const n=a.chapter,k=a.option;
   if(!Number.isInteger(n)||n!==s.next_chapter||!data.effects[n]||!['A','B'].includes(k))fail('wrong chapter or choice');
   if(s.choices[n])fail('checkpoint already committed');
   if((n===13||n===14)&&k==='A'&&!actors.includes(a.target))fail('choose a person explicitly');
   if(n===13&&k==='A')s.affinity_target=a.target;
   if(n===13&&k==='B'){s.affinity_target=null;s.confirmed_relationship=null;}
   if(n===14){s.celebration_guest=k==='A'?a.target:null;}
   if((n===1||n===11)&&k==='B')actors.forEach(cid=>{s.access[cid]=false;});
   const r=data.effects[n].options[k];Object.assign(s.fields,r.set);s.facts.push(...r.facts);s.choices[n]=k;s.next_chapter++;
   // Refusal is respected, never punished with a relationship loss.
   for(const cid of actors)s.relations[cid].respect=Math.min(100,s.relations[cid].respect+1);
   const focus={2:'luca',3:'gabriel',6:'nolan',8:'gabriel',10:'sebastian'}[n];
   if(focus&&k==='A')s.relations[focus].trust=Math.min(100,s.relations[focus].trust+2);
   if(n===13&&k==='A')s.relations[a.target].affection=Math.min(100,s.relations[a.target].affection+3);
   s.events.push({id:r.event_id,request:a.id,chapter:n,choice:k,target:a.target||null});
  }else if(a.op==='boundary'){
   if(!actors.includes(a.actor)||!['touch','kiss','private_visit','publish_photo','commercial_access'].includes(a.category)||typeof a.granted!=='boolean')fail('invalid boundary');
   s.consent[a.actor+':'+a.category]=a.granted;
   s.events.push({id:'boundary',request:a.id,actor:a.actor,category:a.category,granted:a.granted});
  }else if(a.op==='access'){
   if(!actors.includes(a.actor)||typeof a.granted!=='boolean')fail('invalid access');s.access[a.actor]=a.granted;
   s.events.push({id:'access',request:a.id,actor:a.actor,granted:a.granted});
  }else if(a.op==='relationship'){
   if(a.actor!==null&&(!actors.includes(a.actor)||s.next_chapter<14||s.affinity_target!==a.actor))fail('interest must be chosen first');
   s.confirmed_relationship=a.actor;s.events.push({id:'relationship',request:a.id,actor:a.actor});
  }else if(a.op==='learn'){
   if(!actors.includes(a.actor)||!s.events.some(e=>e.id===a.source)||!s.facts.includes(a.fact))fail('canonical source required');
   if(!s.actor_knowledge[a.actor].includes(a.fact))s.actor_knowledge[a.actor].push(a.fact);
   s.events.push({id:'learn',request:a.id,actor:a.actor,fact:a.fact,source:a.source});
  }else fail('unknown operation');
  if(!['sole','player_majority'].includes(s.fields.ownership_control))fail('player control invariant');
  return s;
 }
 function entry(s,n,d){if(n!==s.next_chapter)fail('chapter order mismatch');if(n===1)return null;const k=s.choices[n-1];if(!['A','B'].includes(k)||!d.entries[n])fail('missing checkpoint');return d.entries[n].variants[k];}
 function ending(s){if(s.next_chapter!==15)fail('story incomplete');if(s.choices[14]==='B')return 'independent_ending';const g=s.celebration_guest;if(s.choices[13]==='A'&&s.affinity_target===g)return (s.confirmed_relationship===g?'relationship_epilogue_':'mutual_interest_unconfirmed_')+g;return 'friendship_or_open_future_'+g;}
 return {initial,apply,entry,ending,actors};
});
