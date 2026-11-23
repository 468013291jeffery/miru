const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const listeners={},observers=[];let oldShow=0;
function video(){const attrs={};return {tagName:'VIDEO',dataset:{src:'clip.mp4'},isConnected:true,paused:true,plays:0,loads:0,closest:()=>null,getAttribute:k=>attrs[k],setAttribute:(k,v)=>attrs[k]=v,removeAttribute:k=>delete attrs[k],play(){this.paused=false;this.plays++;return Promise.resolve()},pause(){this.paused=true},load(){this.loads++}}}
const a=video(),b=video(),c=video(),all=[a,b,c];
const x={console,show:()=>oldShow++,feedCurrent:null,document:{body:{},hidden:false,addEventListener(k,f){(listeners[k]||=[]).push(f)},querySelectorAll:s=>s==='video[data-lz]'||s==='[data-lz]'?all:[],getElementById:()=>null},setTimeout:()=>0,IntersectionObserver:class{constructor(cb){this.cb=cb;observers.push(this)}observe(){}unobserve(){}},MutationObserver:class{observe(){}}};x.window=x;vm.createContext(x);vm.runInContext(fs.readFileSync('source/src/app157_perf.js','utf8'),x);
const entry=(v,r)=>({target:v,isIntersecting:r>0,intersectionRatio:r});
observers[0].cb(all.map(v=>entry(v,1)));assert(a.getAttribute('src'));assert(b.getAttribute('src'));assert(!c.getAttribute('src'),'Only two visible previews may download');
observers[0].cb([entry(a,0)]);assert(!a.getAttribute('src'));assert(c.getAttribute('src'),'A newly available preview slot should start');
x.show('s-story');assert.equal(oldShow,1);assert(all.every(v=>!v.getAttribute('src')&&v.paused),'Entering a story releases every preview connection');
x.document.hidden=true;(listeners.visibilitychange||[]).forEach(f=>f());assert(all.every(v=>v.paused));
console.log('Preview lifecycle: two-video limit, release offscreen downloads and release on story entry/background passed.');
