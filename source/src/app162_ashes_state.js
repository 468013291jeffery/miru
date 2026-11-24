function createAshesEngine(R){
 const copy=x=>JSON.parse(JSON.stringify(x));
 const initial=()=>({version:1,scene:'SCN_01_01',phase:'opening',paused:false,goals:{},plans:{},boundaries:{},privateClosed:false,violations:0,relationship:'undecided',games:{},facts:{},seen:{},ending:null,lenaWilling:false});
 const intents=[['terms','明确提出联合展览的合作条件，不将合作当成恋爱承诺'],['memory','确认观看或有限回看这段相识往事，保留固定历史'],['ownership','明确区分作品处分权、私人关系公开和照片展示的许可'],['questions','明确把样张印制与画廊会面分开，记录需要核对的事实，不靠猜测定罪'],['separation','承认当年分离已发生，明确现在愿意继续核对或只保留事实范围'],['privacy','明确说明自己愿意分享的私人经历范围，或将旧信留在自己这里'],['ask_logistics','先询问莱娜对运输和作品安排的意见，再确认合作范围'],['reject_marketing','拒绝把私人恋情当作商业宣传条件，与莱娜分别核对工作安排'],['timeline','按乔纳亲历的印制时间和莱娜自己的说法核对先后，保留各自证词范围'],['account','说明自己当年的打算，承认未经询问就决定带来的伤害，不以好意抵消责任'],['public_scope','在莱娜的明确许可范围内说明商业责任，私人关系不作宣传；展出由她决定']];
 const choices={};intents.forEach(([id,intent],i)=>choices['SCN_'+String(i+1).padStart(2,'0')+'_03']=[{id,intent}]);
 choices.SCN_11_03.push({id:'private_scope',intent:'只作不涉及私人经历的必要工作说明，保留异议和问责，不擅自公开莱娜的私事'});
 choices.SCN_12_02=[{id:'invite',intent:'愿意先询问莱娜是否考虑一次平等的约会，不预设她答应，也不以资源交换'},{id:'friends',intent:'明确放下恋爱期待，希望保持朋友关系，工作授权另行确认'},{id:'slow',intent:'明确暂不发展恋爱，彼此各自生活，未来是否再见另行确认'},{id:'goodbye',intent:'明确结束私人追求和联系，按确认范围交接工作'}];
 choices.SCN_12_03=[{id:'END_REBUILD',intent:'确认双方已经明确愿意的一次约会，以重新交往收束'},{id:'END_SLOW',intent:'按已确认的暂别与各自生活收束，不用等待证明感情'},{id:'END_FRIENDS',intent:'按已确认的朋友关系收束，不把友谊当成复合过渡'},{id:'END_GOODBYE',intent:'按已确认的正式告别收束，只保留必要工作交接'},{id:'END_BREAK',intent:'按莱娜已经终止私人合作的事实收束，职业责任仍需交接'}];
 const global=[{id:'next',intent:'明确进入下一场，只是导航，不是许可亲密、公开或复合'},{id:'pause',intent:'暂停当前阅读休息，保留进度以后恢复'},{id:'resume',intent:'明确恢复当前暂停的剧情'},{id:'exit',intent:'明确结束整个故事或本次参与，不是只结束一个话题或一场对话'},{id:'no_touch',intent:'明确暂不接吻或身体接触，要求保持距离'},{id:'no_romance',intent:'明确结束恋爱追求，只保留必要的工作关系'},{id:'coerce',intent:'明确用资金、展出或职业机会威胁莱娜接受私人关系，或在明确拒绝后仍实施接触；讨论、提问、引用不算实施'}];
 function apply(state,id){const s=copy(state);if(s.ending)return {state:s};if(id==='pause'){s.paused=true;return {state:s};}if(id==='exit'){s.ending='END_EARLY';return {state:s};}if(id==='resume'){s.paused=false;return {state:s};}if(s.paused)return {state:s,issue:'先恢复阅读，再继续当前安排。'};if(id==='next')return {state:s,advance:true};
 let event=null;
 if(id==='no_touch'){s.boundaries.noTouch=true;s.boundaries['user_distance']=true;}
 else if(id==='no_romance'){s.relationship='goodbye';s.privateClosed=true;}
 else if(id==='coerce'){s.violations++;s.privateClosed=true;s.relationship='break';s.lenaWilling=false;event='break';}
 else if((choices[s.scene]||[]).some(x=>x.id===id)){
  if(id.startsWith('END_')){const expect={END_REBUILD:'rebuild',END_FRIENDS:'friends',END_SLOW:'slow',END_GOODBYE:'goodbye',END_BREAK:'break'}[id];if(s.relationship!==expect)return {state:copy(state),issue:'先说清希望采用的关系安排，并留出对方回应的空间。'};if(id==='END_REBUILD'&&(!s.lenaWilling||s.privateClosed||!s.goals[11]||Object.keys(s.boundaries).filter(k=>['ask_logistics','reject_marketing','public_scope','private_scope'].includes(k)).length<2))return {state:copy(state),issue:'重新交往还没有双方明确同意与实际边界行动作为基础，可以选择朋友、暂别或告别。'};s.ending=id;s.goals[12]=true;}
  else if(id==='invite'){if(s.privateClosed)return {state:copy(state),issue:'私人追求已经结束，可以确认朋友、暂别或告别。'};if(!s.goals[11]||Object.keys(s.boundaries).filter(k=>['ask_logistics','reject_marketing','public_scope','private_scope'].includes(k)).length<2)return {state:copy(state),issue:'先把工作说明与彼此边界做实，再讨论约会；也可以选择朋友或告别。'};s.pendingEvent='invite';event='invite';}
  else if(['friends','slow','goodbye'].includes(id)){s.pendingEvent=id;event=id;}
  else{const n=+s.scene.slice(4,6);s.plans[n]=id;s.goals[n]=true;if(['ask_logistics','reject_marketing','public_scope','private_scope'].includes(id))s.boundaries[id]=true;}
 }
 else return {state:s};s.seen[s.scene+':'+id]=true;return {state:s,event};
 }
 function commit(s,event){if(event!==s.pendingEvent)return;if(event==='invite'){s.lenaWilling=true;s.relationship='rebuild';}else if(['friends','slow','goodbye'].includes(event))s.relationship=event;s.pendingEvent=null;}
 return {initial,choices,global,apply,commit};
}
if(typeof module!=='undefined'&&module.exports)module.exports=createAshesEngine;
