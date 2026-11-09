/* Who's S++ v4: authored option deltas, scoped by an explicit script marker.
   The original pkSet still owns ordinary flags. No other story changes. */
(function(){
  const initial={authority:20,desire:30,trust:25,consent:0,insight:0,notoriety:10,ax_gaze:0,ax_mercy:0,ax_power:0};
  const set=pkSet;
  pkSet=function(th,value){
    const list=Array.isArray(value)?value:[value];
    if(!th||!th.pk)return set.apply(this,arguments);
    const deltas=list.map(f=>/^sppdelta~(c\d+)~([a-z_]+)~(-?\d+)$/.exec(String(f))).filter(Boolean);
    if(list.includes('spp_v4')||deltas.length){
      const state=th.pk.spp94||(th.pk.spp94={values:Object.assign({},initial),applied:{}});
      const fresh=new Set(deltas.filter(m=>!state.applied[m[1]]).map(m=>m[1]));
      deltas.forEach(m=>{
        if(!fresh.has(m[1])||!Object.hasOwn(initial,m[2])&&!/^bond_[a-z]+$/.test(m[2]))return;
        const max=/^(bond_|ax_)/.test(m[2])?10:100;
        state.values[m[2]]=Math.max(0,Math.min(max,(state.values[m[2]]||0)+Number(m[3])));
      });
      fresh.forEach(id=>state.applied[id]=true);
    }
    return set.call(this,th,list.filter(f=>!String(f).startsWith('sppdelta~')));
  };
  const prompt=packPrompt;
  packPrompt=function(th){
    const base=prompt.apply(this,arguments),state=th&&th.pk&&th.pk.spp94;
    return state?base+'\n当前评级记录（仅已完成选择的结果，不替玩家作决定）：'+JSON.stringify(state.values):base;
  };
})();
