const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../miru_dialogue_runtime.js'),'utf8');
const early={window:{}};vm.runInNewContext(src,early);assert(!early.window.MIRU_DIALOGUE_RUNTIME_READY);
const legacy={window:{},document:{addEventListener(){}},talkIntent:()=> 'other',TALK_FB:{zh:{},en:{}},talkSugg:()=>[],stopHTML:()=>'',doSend(){},reply:async()=>{},ask:async()=>({})};vm.runInNewContext(src,legacy);assert(legacy.window.MIRU_DIALOGUE_RUNTIME_READY);assert.equal(legacy.talkIntent('别碰我'),'boundary');assert(legacy.TALK_FB.en.boundary.length);
console.log('Legacy dialogue compatibility: early deferred load does not throw; classic engine still installs refusal handling.');
