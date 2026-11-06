const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),src=root+'/content/official/m105-v6';
const read=p=>fs.readFileSync(p,'utf8');
let a=read(root+'/source/src/app51_import.js');a=a.slice(0,a.indexOf('/* ---------- build a MIRU world'));
let b=read(root+'/source/src/app94_official2.js');const you=b.slice(b.indexOf('function off94You94Parse('),b.indexOf('function off94You94Build('));b=b.slice(0,b.indexOf('/* ---- build: names'));
const ctx={window:{},LL:(z,e)=>z,console,decodeURIComponent};vm.createContext(ctx);vm.runInContext(a+b+you,ctx);

const aliases={'但丁':'Dante','但丁·莫雷蒂':'Dante','埃琳娜':'Elena','艾琳娜':'Elena','文斯':'Vince','玛拉':'Mara','萨尔瓦托雷':'Salvatore','诺拉':'Nora','卢卡':'Luca','朱恩':'June'};
function closeChoices(t){let open=false;const out=[];for(const line of t.split('\n')){if(/^# (?:SCENE|CHAPTER|CHOICE)\b/.test(line)&&open){out.push('# ·','');open=false}if(/^# CHOICE\b/.test(line))open=true;out.push(line)}if(open)out.push('# ·');return out.join('\n');}
function norm(t){for(const [z,n] of Object.entries(aliases))t=t.replace(new RegExp('^'+z+'([：:])','gm'),n+'$1');return closeChoices(t.replace(/\r\n?/g,'\n'));}
function parse(t){return ctx.off94You94Parse(x=>ctx.off94Parse(ctx.imParseCore,x),t);}
function compile(c){
 const line=(x)=>['@Dante','line',{hint:x.choice.q,opts:x.choice.opts.map(o=>({k:'say',t:o.t,set:o.set,then:walk(o.then)}))}];
 function walk(items){return (items||[]).map(x=>{if(x.choice)return line(x);if(x.variant)return ['sys','if',{cond:{pick:[0,x.variant.k]},then:walk(x.variant.then)}];if(!Array.isArray(x))throw Error('unknown parsed item');if(x[0]==='sys'&&x[1]==='if')return ['sys','if',{...x[2],then:walk(x[2].then),else:walk(x[2].else)}];return x;});}
 const items=c.items.slice();let at=-1;for(let i=items.length-1;i>=0;i--){if(items[i].choice){at=i;break}if(Array.isArray(items[i])&&items[i][0]!=='sys')break;}
 const end=at>=0?items.splice(at,1)[0].choice:null;
 return {title:c.t,goal:c.goal94,beats:walk(items),ask:end?.q||'',choices:end?end.opts.map((o,i)=>({k:'ABC'[i],t:o.t,set:o.set,then:walk(o.then)})):[]};
}
const runtime={version:'m105-v6-20261107',main:{},routes:{},events:JSON.parse(read(src+'/events.json'))};

for(const lang of ['ZH','EN']){runtime.main[lang.toLowerCase()]=parse(read(src+'/main_'+lang+'.md')).chapters.map(compile);for(const route of ['committed','slow','independent']){runtime.routes[route]??={};runtime.routes[route][lang.toLowerCase()]=parse(norm(read(src+'/M105_V6_Route_'+route+'_'+lang+'.md'))).chapters.map(compile)}}
const output=JSON.stringify(runtime),target=root+'/art/official/m105-v6/runtime.json';
if(process.argv.includes('--check'))assert.equal(read(target),output,'M105 runtime differs from authored source');else fs.writeFileSync(target,output);
console.log('M105 authored-source build matches runtime.');
