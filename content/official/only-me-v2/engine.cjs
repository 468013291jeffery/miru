function createOnlyMeEngine(){
 const initial=()=>({values:Object.fromEntries(['trust','desire','intimacy','suspicion','self','independence','consent','love_thorne','love_ferreira','love_reidy'].map(k=>[k,0])),applied:{}});
 const delta=/^omdelta~(c\d+)~([a-z_]+)~(-?\d+)$/;
 function project(s,flags){const v={...s.values};for(const f of flags||[]){const m=delta.exec(String(f));if(m&&!s.applied[m[1]]&&m[2] in v)v[m[2]]+=Number(m[3]);}return v;}
 function apply(s,flags){s.values=project(s,flags);for(const f of flags||[]){const m=delta.exec(String(f));if(m)s.applied[m[1]]=true;}return s;}
 return {initial,project,apply};
}
if(typeof module!=='undefined')module.exports={createOnlyMeEngine};
