function createSvfEngine(){
 const initial=()=>({values:{authority:15,buzz:60,scandal:10,consent:0,trust:20,health:80,ax_family:0,ax_stage:0,ax_rule:0,...Object.fromEntries(['rhys','dorian','kai','noah','matteo','sasha','jonah'].map(k=>['love_'+k,0]))},applied:{}});
 const delta=/^svfdelta~(c\d+)~([a-z_]+)~(-?\d+)$/;
 function project(s,flags){const v={...s.values};for(const flag of flags||[]){const m=delta.exec(String(flag));if(!m||s.applied[m[1]]||!(m[2] in v))continue;const max=m[2]==='ax_rule'?7:/^(ax_|love_)/.test(m[2])?10:100;v[m[2]]=Math.max(0,Math.min(max,v[m[2]]+Number(m[3])));}return v;}
 function apply(s,flags){const v=project(s,flags);for(const f of flags||[]){const m=delta.exec(String(f));if(m)s.applied[m[1]]=true;}s.values=v;return s;}
 function eligible(s,key,flags=[]){const v=project(s,flags);if(key==='A')return Object.keys(v).some(k=>k.startsWith('love_')&&v[k]>=8)&&v.scandal<60;if(key==='B')return v.ax_family<=3&&v.authority>=70;if(key==='C')return v.ax_stage>=8&&v.ax_family>=7;return false;}
 return {initial,project,apply,eligible,delta};
}
if(typeof module!=='undefined')module.exports={createSvfEngine};
