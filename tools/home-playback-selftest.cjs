const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const src=fs.readFileSync('source/src/app15_home.js','utf8');
const body=src.slice(src.indexOf('function feedStopVideo(')>=0?src.indexOf('function feedStopVideo('):src.indexOf('function feedWire('),src.indexOf('document.addEventListener("click",e=>{let x;',src.indexOf('function feedWire(')));
function env(){
 const observers=[],attrs={};let pending=[];
 const video={dataset:{src:'clip.mp4',poster:'cover.jpg'},isConnected:true,paused:true,muted:false,playCalls:0,loads:0,src:'',getAttribute:k=>attrs[k]||null,setAttribute(k,v){attrs[k]=v;if(k==='src')this.src=v},removeAttribute(k){delete attrs[k];if(k==='src')this.src=''},load(){this.loads++},pause(){this.paused=true},play(){this.playCalls++;this.paused=false;return new Promise((ok,no)=>pending.push({ok,no}))},closest:()=>null};
 const card={querySelector:()=>video,querySelectorAll:()=>[],contains:()=>true};
 const feed={contains:v=>v===video,querySelectorAll:s=>s==='.fcard'?[card]:[],querySelector:()=>video};
 const ctx={feedObs:null,feedNear:null,feedSound:true,feedCurrent:null,feedPlaySeq:0,feedWireSeq:0,document:{hidden:false,addEventListener(){},querySelector:()=>null},$:s=>s==='#feed'?feed:null,IntersectionObserver:class{constructor(cb,opts){this.cb=cb;this.opts=opts;observers.push(this)}observe(){}unobserve(){}disconnect(){}},console};
 vm.createContext(ctx);vm.runInContext(body,ctx);ctx.feedWire();
 return {ctx,video,card,observers,pending,async tick(){await Promise.resolve();await Promise.resolve()},entry(r){observers[0].cb([{target:card,isIntersecting:r>0,intersectionRatio:r}])}};
}
(async()=>{
 const e=env();e.entry(1);assert.equal(e.video.playCalls,1);e.entry(0);e.pending[0].no(Object.assign(Error('paused'),{name:'AbortError'}));await e.tick();assert.equal(e.video.playCalls,1,'An interrupted offscreen play must not restart the video');assert.equal(e.video.src,'','Offscreen video must release its download');
 const t=env();t.entry(.6);assert.equal(t.video.playCalls,1,'The observer threshold must start playback at exactly 60%');
 const a=env();a.entry(1);a.pending[0].no(Object.assign(Error('autoplay'),{name:'NotAllowedError'}));await a.tick();assert.equal(a.video.playCalls,2);assert.equal(a.video.muted,true,'Autoplay rejection retries muted only while current');
 console.log('Home playback: cancelled/offscreen play cannot restart, downloads release, exact threshold and muted fallback passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
