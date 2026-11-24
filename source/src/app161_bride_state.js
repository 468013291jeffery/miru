/* Bride story state: evidence provenance, explicit intent, ritual facts and endings. */
function createBrideEngine(data){
 const copy=v=>JSON.parse(JSON.stringify(v)),choices={};
 const initial=()=>({version:1,scene:'SCN_0101',phase:'opening',paused:false,ritual:false,bell:0,closedChapters:{},goals:{},plans:{},consent:{veil:false,privateItems:false,original:false},horror:'standard',contact:'limited',delegated:false,evidence:{},observations:{},games:{},receipts:[],seen:{},methodCandidate:null,methodFinal:null,riskAcknowledged:false,protected:[],present:[],harm:[],resolution:null,exit:'normal',bride:'anchored',noInnocents:false,ending:null,exposure:0});
 const goal=(s,n)=>{s.goals[n]=true;};
 function add(scene,id,intent,effect){(choices[scene]||=[]).push({id,intent,effect});}
 function evidence(s,key){return !!s.evidence[key]&&s.evidence[key].verified!==false;}
 function need(s,keys){return keys.filter(k=>!evidence(s,k));}
 function finishGoal(s,n,required=[]){const missing=need(s,required);if(missing.length)return '仍需核对这部分资料，或让同伴提供有来源的说明。';goal(s,n);}
 add('SCN_0104','work_only','明确继续修复或有限查看，但拒绝签见证册和参加婚礼',s=>{s.plans.scope='work_only';goal(s,1);});
 add('SCN_0104','investigate','愿在知情、结伴且可暂停的范围内调查异常，要求说明邀请安排',s=>{s.plans.scope='investigate';goal(s,1);});
 add('SCN_0204','safe_place','明确选定修复室及可见门厅作为暂留处，并核对同行者',s=>{s.plans.safePlace='restore';return finishGoal(s,2,['loop']);});
 add('SCN_0204','companions','先核对新郎和妹妹的位置，再结伴返回可见的暂留处',s=>{s.plans.safePlace='restore';return finishGoal(s,2,['loop']);});
 add('SCN_0304','limited','愿与新娘保持距离交谈，按在场位置和约定事项核对声音',s=>{s.contact='limited';s.plans.voiceRule='position_and_agreed_information';return finishGoal(s,3,['voice_replay']);});
 add('SCN_0304','records','只看有来源的文字和影像记录，不接受新娘靠近，约定位置核对',s=>{s.contact='records';s.plans.voiceRule='position_and_records';return finishGoal(s,3,['voice_replay']);});
 add('SCN_0401','inspect','允许检查婚纱和暗袋，但不掀面纱；愿意核对私人物件',s=>{s.consent.privateItems=true;s.plans.identityCheck='inspect';});
 add('SCN_0401','identity_only','只通过鲁思与必要的缝线、姓名线索核实婚纱，不看私人信件',s=>{s.consent.privateItems=false;s.plans.identityCheck='witness';});
 add('SCN_0404','preserve','保存婚纱位置和必要身份记录，并限定私密材料范围',s=>finishGoal(s,4,['dress_identity']));
 add('SCN_0404','seal_private','封存私人信件，只保存婚纱身份的非私密核验',s=>{s.consent.privateItems=false;return finishGoal(s,4,['dress_identity']);});
 add('SCN_0504','original','明确保护并保留名册原件和覆页结构，先不破坏',s=>{s.plans.register='original';return finishGoal(s,5,['register_false']);});
 add('SCN_0504','copy','只带名册副本，承认原件仍在庄园、有被改动的风险',s=>{s.plans.register='copy';return finishGoal(s,5,['register_false']);});
 add('SCN_0504','controlled_knot','保留名册，之后在可控条件下试验双结，不剪开所有红物',s=>{s.plans.register='controlled_test';return finishGoal(s,5,['register_false']);});
 add('SCN_0604','save_workshop','核对来源后保存工坊材料及记者联络路径，不据此直接宣布定罪',s=>{s.plans.workshop='preserve';return finishGoal(s,6,['workshop']);});
 add('SCN_0604','necessary_only','只记录工坊旧案必要信息，不再观看额外死亡回忆',s=>{s.plans.workshop='bounded';return finishGoal(s,6,['workshop']);});
 add('SCN_0704','question','要求新郎具体解释当年离席和十分钟的位置，不用旧情代替责任',s=>{s.plans.groom='questioned';return finishGoal(s,7,['groom_left']);});
 add('SCN_0704','compare_later','先保存记录，之后交叉核对，不继续私人回忆',s=>{s.plans.groom='compare_records';return finishGoal(s,7,['groom_left']);});
 add('SCN_0804','bounded_statement','记录鲁思亲眼看见与听见的范围，要求独立核对，不替她免责',s=>{s.plans.ruth='bounded';return finishGoal(s,8,['false_statement']);});
 add('SCN_0804','register_instead','暂不与鲁思合作，以原册旧页和其他记录核对其证词',s=>{s.plans.ruth='register_comparison';return finishGoal(s,8,['register_false']);});
 add('SCN_0904','separate_plan_fact','明确区分她计划离开与实际未离开，保存可核对的票据与意愿',s=>finishGoal(s,9,['departure_plan']));
 add('SCN_0904','distance','不走近新娘，只记录她的自述，并以车票等材料另行核对',s=>{s.contact='limited';return finishGoal(s,9,['departure_plan']);});
 add('SCN_1001','check_original','同意查看现有母带和可读转录，核对原件与工作副本，不生成缺失内容',s=>{s.consent.original=true;s.plans.original='check';});
 add('SCN_1001','seal_original','先封存原件交专业人员，当前只使用已核对的副本与必要说明',s=>{s.consent.original=false;s.plans.original='sealed';});
 add('SCN_1004','crosscheck','保存原件位置、原音与服务记录的交叉核验，口供单独记录',s=>{s.plans.lock='crosscheck';return finishGoal(s,10,['lock_record']);});
 add('SCN_1004','public_question','拒绝与新郎私聊，让同伴在公共位置核对锁门事实，允许他回应或否认',s=>{s.plans.lock='public';return finishGoal(s,10,['lock_record']);});
 add('SCN_1004','record_pending','明确封存原音，只登记现有记录和待核的锁门疑点，不宣称完成原音验证',s=>{if(s.plans.original!=='sealed')return '原件未按封存安排记录。';s.plans.lock='pending_professional_check';goal(s,10);});
 add('SCN_1104','separate_responsibility','分开记录毁档命令、实施和没有开门的责任，明确保存证据的方法',s=>{s.plans.fire='separate_records';return finishGoal(s,11,['fire_records']);});
 add('SCN_1104','safety_first','先保安全，记录资料最后位置与已有副本，不单独进入危险区域',s=>{s.plans.fire='safe_location';return finishGoal(s,11,['fire_records']);});
 for(const [id,method,intent]of [['witness','witness','拒绝代位，候选方法是公开有来源的见证'],['revenge','reckoning','拒绝代位，提出限定复仇的候选方案，先了解致命风险与保护范围'],['escape','gate','拒绝代位，候选方法是终止假见证并带资料离开'],['undecided',null,'拒绝代位，暂不选最后方法，先核实纪念台']])add('SCN_1204',id,intent,s=>{if(!evidence(s,'substitute_false'))return '先核实原册和新增补页，代位不是已被证明的办法。';s.methodCandidate=method;goal(s,12);});
 add('SCN_1304','mark_location','安全记录纪念台的异常和物件关联，保护现场，身份留给专业人员核验',s=>{s.plans.location='protected';return finishGoal(s,13,['location']);});
 add('SCN_1304','witness_report','不看检修口，由同伴说明必要发现并记录准确位置，不搬动遗体',s=>{s.plans.location='reported';return finishGoal(s,13,['location']);});
 for(const [id,method,intent]of [['final_witness','witness','明确采用公开见证的方法，确认公开范围，只陈述有来源事实'],['final_reckoning','reckoning','了解致命风险后仍明确选择限定复仇，先保护无辜者，不束缚活人'],['final_gate','gate','明确停止参与假见证，以已建立的通道和资料安排撤离']])add('SCN_1404',id,intent,s=>{if(method==='reckoning'&&!s.riskAcknowledged)return '这个方法可能造成人命损失，不能保证可挽回。先确认你是否理解风险；也可以改为见证或离开。';s.methodFinal=method;goal(s,14);});
 add('SCN_1502','preserve_copies','明确实际安排原件、工作副本、来源记录分开保存，不声称云端已上传',s=>{s.plans.copies='separated';});
 add('SCN_1502','locations_only','不制作额外副本，只记录已核对的原件位置与现有副本范围',s=>{s.plans.copies='locations_only';});
 add('SCN_1503','protect_people','核对在场位置，让米里亚姆、鲁思和玩家离开锚点危险区，所有活人均可自行离开',s=>{s.protected=['sister','ruth','player'];s.plans.innocents='protected';});
 add('SCN_1504','perform_witness','现在按核验过的材料执行公开见证，更正假覆页，不替新娘签婚约',s=>{
  if(s.methodFinal!=='witness')return '当前确认的不是公开见证方案，可以先明确更改方法。';
  const missing=need(s,['lock_record','register_false','location']);if(missing.length)return '见证所需的记录还有缺口，可以明确按有限结论收束或选择已建立的离开方案。';
  if(!s.noInnocents)return '还需明确向她提出停止束缚和伤害无辜者，并得到她本人的回应。';
  s.pendingEvent='witness';
 });
 add('SCN_1504','perform_gate','按已核对的路线和覆页结构，实际终止本次假见证，带愿同行者及可保存记录离开',s=>{
  if(s.methodFinal!=='gate')return '先明确将最后方法改为离开。';
  if(need(s,['register_false','service_route']).length)return '先核对假覆页和可用服务侧廊，不能把尚未找到的出口写成已经打开。';
  s.pendingEvent='gate';
 });
 add('SCN_1504','perform_reckoning','在明确风险后执行限定复仇，已保护无辜者，让责任者自行选择是否留在锚点，不捆绑或献祭任何人',s=>{
  if(s.methodFinal!=='reckoning'||!s.riskAcknowledged)return '限定复仇尚未经过明确风险确认。';
  if(s.protected.length<3||!evidence(s,'fire_records')||!evidence(s,'lock_record'))return '先核对责任链、同伴位置与保护措施，不能凭愤怒实施伤害。';
  s.pendingEvent='reckoning';
 });
 add('SCN_1504','limited_result','明确停止当前仪式输入，在暂留安全处按有限结论收束，承认未核实事项',s=>{s.pendingEvent='partial';});
 add('SCN_1603','bounded_record','以Elena Ward本名记录已经证实的部分，保留不确定内容和隐私，不声称司法定罪',s=>{s.plans.aftermath='bounded';});
 const endingTitles={END_NAME:'她终于不是谁的新娘',END_RECKONING:'空下来的主位',END_GATE:'你把门外的风带回来',END_WAIT:'还有一句话没有说完',END_EARLY:'没有人替你坐下',END_WITHDRAW:'没有人替你坐下'};
 for(const [id,intent]of [['END_NAME','明确按已完成的见证与新娘离去收束，不要求原谅'],['END_RECKONING','明确按已经发生的有限复仇及其未解决后果收束，不追加死亡'],['END_GATE','确认已实际离开，只交付已经保存的记录，未查清的保持未定'],['END_WAIT','明确按有限结果结算，保留具体缺项，未来联系范围另行确认']])add('SCN_1604',id,intent,s=>{
  const issue=eligible(s,id);if(issue)return issue;s.ending=id;goal(s,16);
 });
 const global=[
  {id:'next',intent:'明确进入下一场或继续下一段；只是导航，不是答应代位、公开私信或同意伤害'},
  {id:'pause',intent:'暂时暂停阅读或休息，稍后恢复，不是正式结束体验'},
  {id:'resume',intent:'明确恢复暂停的当前剧情'},
  {id:'exit',intent:'明确结束本次体验或整个故事，不是结束一个话题、只离开某间房或只是暂停'},
  {id:'lower',intent:'降低恐怖表现强度，不要突发惊吓或尾声追吓'},
  {id:'standard',intent:'恢复普通恐怖表现强度，仍遵守已设定边界'},
  {id:'stay_safe',intent:'留在已建立的暂留处，暂时不亲自进入新的危险区域'},
  {id:'delegate',intent:'请求愿意配合的米里亚姆或鲁思做安全外围观察、带回来源说明，不强迫他人冒险'},
  {id:'direct',intent:'明确愿意离开暂留处，在已核对同伴的情况下亲自继续调查'},
  {id:'risk_ack',intent:'明确理解限定复仇可能导致无法挽回的人命损失；这只是理解风险，不是同意实施'},
  {id:'allow_veil',intent:'在艾莲娜主动提出展示面孔后，同意观看她自行抬纱，不是强掀面纱'},
  {id:'decline_veil',intent:'不愿观看面孔，或撤回观看许可，要求保持遮纱'},
  {id:'force_veil',intent:'尝试不经许可强行掀开她的面纱'},
  {id:'no_innocents',intent:'明确请求新娘停止束缚、伤害无辜者，保留所有人离开的权利'},
  {id:'switch_gate',intent:'明确撤回复仇或见证方案，改为停止当前参与并按已有路线离开'}
 ];
 function eligible(s,id){
  if(id==='END_NAME'&&!(s.resolution==='truth_recorded'&&s.bride==='left'&&s.bell===13))return '完整见证或她的离去尚未发生，可以选择有限结论或已完成的离开结果。';
  if(id==='END_RECKONING'&&!['retaliation_contained','harm_recorded'].includes(s.resolution))return '没有已经发生的复仇后果，不能仅凭说过气话判成复仇结局。';
  if(id==='END_GATE'&&s.exit!=='open')return '实际出口尚未恢复，可以在安全处结算有限结果，不能假装已经逃离。';
  if(id==='END_WAIT'&&!s.resolution)return '先明确当前实际做到哪一步，再结算有限结果。';
  return null;
 }
 function observe(s,record,witnesses){
  if(s.observations[record.id])return false;
  s.observations[record.id]=true;
  s.evidence[record.id]={...copy(record),source_scene:s.scene,witnesses:[...witnesses],later_readers:[],holder:record.holder||'recorded_location',sharing:'bounded',view:s.delegated?'reported_with_source':'direct'};
  return true;
 }
 function closeChapter(s,n){
  if(!s.goals[n])return false;
  if(!s.closedChapters[n]){s.closedChapters[n]=true;if(n>=3&&n<=13)s.bell=Math.max(s.bell,n-1);}
  return true;
 }
 function commit(s,event){
  if(event==='ritual_started'){s.ritual=true;s.exit='loop';s.bell=Math.max(s.bell,1);return;}
  if(event==='veil_shown'){if(s.consent.veil)s.faceShown=true;return;}
  if(event==='innocents_agreement'){s.noInnocents=true;return;}
  if(event!==s.pendingEvent)return;
  if(event==='witness'){s.resolution='truth_recorded';s.bride='left';s.exit='open';s.bell=13;}
  if(event==='gate'){s.resolution='escaped_with_records';s.exit='open';s.bell=13;}
  if(event==='reckoning'){s.resolution='retaliation_contained';s.bride='anchored';s.exit='open';s.bell=13;}
  if(event==='partial'){s.resolution='limited_records';s.exit='safe';}
  s.pendingEvent=null;goal(s,15);
 }
 function apply(state,id,text){
  const s=copy(state);if(s.ending)return {state:s,issue:'这段经历已按确认的范围结束。'};
  if(id==='pause'){s.paused=true;return {state:s};}
  if(id==='resume'){s.paused=false;return {state:s};}
  if(id==='exit'){s.ending=s.ritual?'END_WITHDRAW':'END_EARLY';return {state:s};}
  if(id==='lower'){s.horror='low';return {state:s};}
  if(id==='decline_veil'){s.consent.veil=false;return {state:s};}
  if(s.paused)return {state:s,issue:'剧情停在这里，想继续时先说恢复。'};
  if(id==='next')return {state:s,advance:true};
  let issue=null,event=null;
  if(id==='standard')s.horror='standard';
  else if(id==='stay_safe'){s.plans.staySafe=true;s.delegated=false;}
  else if(id==='delegate'){s.plans.staySafe=true;s.delegated=true;}
  else if(id==='direct'){s.plans.staySafe=false;s.delegated=false;}
  else if(id==='risk_ack'){if(!s.riskNotice)issue='先了解限定复仇的具体风险。';else s.riskAcknowledged=true;}
  else if(id==='allow_veil'){if(s.scene!=='SCN_1404')issue='当前没有她主动抬纱的邀请，可以保持遮纱交谈。';else{s.consent.veil=true;event='veil_shown';}}
  else if(id==='force_veil'){issue='她按住面纱，走廊传来一声衣料摩擦。鲁思指向婚服箱：先看针脚，也能核对身份。';}
  else if(id==='no_innocents'){s.proposedNoInnocents=true;if(s.scene==='SCN_1404'||s.scene==='SCN_1504')event='innocents_agreement';}
  else if(id==='switch_gate'){s.methodFinal='gate';if(s.scene==='SCN_1404')goal(s,14);}
  else{
   const action=(choices[s.scene]||[]).find(a=>a.id===id);if(!action)return {state:s};
   issue=action.effect(s)||null;
  }
  if(issue)return {state:copy(state),issue};
  const key=s.scene+':'+id;if(!s.seen[key]){s.seen[key]=true;s.receipts.push({id:key,scene:s.scene,intent:id,text:String(text||'').slice(0,1500)});}
  return {state:s,event};
 }
 return {initial,choices,global,apply,observe,commit,closeChapter,eligible,endingTitles};
}
if(typeof module!=='undefined'&&module.exports)module.exports=createBrideEngine;
