/* Pure, save-local authored state. No inference from scores, time or game wins. */
const WTSR_STATE = (() => {
  const clone = x => JSON.parse(JSON.stringify(x));
  const initial = () => ({version:1, scene:'SCN_0101', phase:'opening', project:'unconfirmed',
    plans:{}, goals:{}, seen:{}, games:{}, consent:{}, receipts:[], private:{viv:[],eri:[]},
    boundaries:{viv:'colleague',eri:'colleague'}, respected:{viv:false,eri:false},
    mutual:{viv:false,eri:false}, dating:null, exclusive:null, outing:null, company:{},
    oldStatusDisclosed:false, withholdingHandled:false, eventRoute:'pending', eventResult:null,
    demo:'not_started', ending:null, stats:{viv:{interest:60,trust:20,respect:35},eri:{interest:20,trust:30,respect:40}}});
  const choices = {};
  function add(scene,id,intent,effect) { (choices[scene] ||= []).push({id,intent,effect}); }
  const done = (s,ch) => {s.goals[ch]=true;};
  add('SCN_0101','terms','明确愿意查看并协商制作合同，尚未签约',s=>{s.project='negotiating';});
  add('SCN_0101','work','愿意先核对工作条件，但要求薇薇安只谈工作',s=>{s.project='negotiating';s.boundaries.viv='work_only';});
  add('SCN_0104','confirm','明确确认已看过的报酬、署名、授权和退出条件，愿意合作或有限试排',s=>{if(s.project!=='negotiating')return '先核对报酬、署名和退出条款，再确认参与范围。';s.project='active';s.withholdingHandled=true;s.respected.viv=true;done(s,1);});
  for(const [id,intent] of [['new','采用修改后的旧歌版本试排'],['old','保留原版试排，仅是音乐决定'],['deferred','暂缓使用旧歌，约定先比较版本或留到后续再定'],['instrumental','将旧歌改为器乐试排']]) add('SCN_0204',id,intent,s=>{s.plans.song=id;done(s,2);});
  for(const [id,intent] of [['split','将宣传录制改为分段录制，并逐项确认拍摄范围'],['reschedule','明确改期录制'],['cancel','明确取消宣传录制，继续其他制作工作']]) add('SCN_0301',id,intent,s=>{s.plans.recording=id;});
  for(const [id,intent] of [['allow','明确同意薇薇安这一次帮忙贴护指'],['supplies','只接受用品，自己贴护指'],['decline','明确拒绝本次个人帮助']]) add('SCN_0303',id,intent,s=>{s.consent.hand=id==='allow';s.plans.help=id;if(id!=='allow')s.respected.viv=true;});
  add('SCN_0304','coffee','接受艾琳在第五天前一起喝咖啡的私人邀约（这只是约定，尚未发生）',s=>{s.plans.coffee='planned';});
  add('SCN_0304','work','告诉艾琳只谈工作，不接受私人邀约',s=>{s.boundaries.eri='work_only';s.respected.eri=true;});
  add('SCN_0304','confirm','明确确认本章的录制安排与帮助范围，包括取消或改期',s=>{if(!s.plans.recording||!s.plans.help)return '录制安排和个人帮助范围还需要分别说清。';done(s,3);});
  add('SCN_0401','archive_yes','允许调取并在本人在场时核对完整采访与公开剪辑',s=>{s.plans.interview='allowed';});
  add('SCN_0401','archive_no','不愿查看旧采访，只处理本次工作宣传',s=>{s.plans.interview='declined';});
  for(const [id,intent] of [['work_facts','仅公开更正工作事实，不宣传私人关系'],['private_limited','愿讨论有限私人说明，但具体项目必须逐条确认后才能发布'],['none','不公开回应，并限制官方继续利用私人关系']]) add('SCN_0404',id,intent,s=>{s.plans.publicScope=id;done(s,4);});
  for(const [id,intent] of [['new','愿意展示个人新歌'],['instrumental','展示个人器乐作品'],['private','只做闭门试录，不对公众演出'],['cancel','取消这次小型展示']]) add('SCN_0501',id,intent,s=>{s.plans.showcase=id;});
  for(const [id,intent] of [['eri','邀请艾琳单独晚餐并聊生活'],['viv','邀请薇薇安单独聊新歌'],['team','与团队一起夜宵'],['solo','独自离开休息']]) add('SCN_0504',id,intent,s=>{if(!s.plans.showcase)return '先确认个人展示采用什么方式。';if(['viv','eri'].includes(id)&&['closed','work_only'].includes(s.boundaries[id]))return '之前约定只谈工作，若想改变，需要先说明新的联系范围。';s.company['SCN_0504']=id;done(s,5);});
  add('SCN_0602','read','明确愿意阅读已获授权打开的旧工作邮件和巡演方案',s=>{s.plans.archive='read';});
  add('SCN_0602','keep','只做安全保存、不读旧邮件，或要求以后再谈',s=>{s.plans.archive='keep';});
  for(const [id,intent] of [['viv','今晚邀请薇薇安单独陪伴'],['eri','今晚邀请艾琳单独陪伴'],['solo','今晚想独处或由玛拉安排回程']]) add('SCN_0604',id,intent,s=>{if(['viv','eri'].includes(id)&&['closed','work_only'].includes(s.boundaries[id]))return '之前的私人边界仍有效，可以先明确新的陪伴范围。';s.company['SCN_0604']=id;});
  add('SCN_0604','hug','明确同意在场薇薇安刚才提出的本次拥抱',s=>{if(s.company.SCN_0604!=='viv')return '当前没有这份拥抱邀请。';s.consent.hug='SCN_0604';});
  add('SCN_0604','confirm','确认干区档案已由工作人员安全清点，今晚安排已确定',s=>{if(!s.company.SCN_0604)return '今晚想怎样安排，还可以说具体些。';done(s,6);});
  for(const [id,intent] of [['audio','明确同意自己播放四分十八秒的私人旧语音'],['transcript','明确同意自己阅读私人旧语音转录'],['live','邀请薇薇安约在安全地点，当面回答旧事'],['decline','不听不读私人语音，也不安排当面解释']]) add('SCN_0704',id,intent,s=>{s.plans.voice=id;});
  for(const [id,intent] of [['reconnecting','愿继续了解薇薇安，但尚未答应恋爱'],['friend','愿意做朋友，但不复合'],['work_only','尚不能原谅，只愿工作'],['closed','不再与薇薇安有私人接触']]) add('SCN_0704','boundary_'+id,intent,s=>{s.boundaries.viv=id;s.respected.viv=true;if(s.dating==='viv'&&['friend','work_only','closed'].includes(id))s.dating=null;done(s,7);});
  for(const [id,intent] of [['stage','接受带明确授权清单的有限直播方案，仍需第十天确认修订合同、安全许可和最终曲目'],['room','不直播，采用小场或Side Room备用方案'],['pending','继续谈判，尚未签订直播协议']]) add('SCN_0804',id,intent,s=>{s.eventRoute=id;done(s,8);});
  for(const [id,intent] of [['viv','邀请薇薇安今天私人出行'],['eri','邀请艾琳今天私人出行'],['team','今天与朋友或团队一起出行'],['solo','今天独处，自行安排生活']]) add('SCN_0901',id,intent,s=>{if(['viv','eri'].includes(id)&&['closed','work_only'].includes(s.boundaries[id]))return '先明确是否重新开放私人联系；之前的边界继续有效。';s.outing=id;});
  for(const p of ['viv','eri']) {
    const name=p==='viv'?'薇薇安':'艾琳';
    add('SCN_0904','date_'+p,'明确接受'+name+'刚才提出的约会邀约，愿意开始约会',s=>date(s,p));
    add('SCN_0904','slow_'+p,'想与'+name+'继续认识，但暂不建立恋爱关系',s=>{if(s.outing!==p)return '今天实际同行的人与这份邀请不一致，需要先说清。';s.mutual[p]=true;s.boundaries[p]=p==='viv'?'reconnecting':'getting_to_know';done(s,9);});
  }
  add('SCN_0904','friend','明确只愿朋友来往',s=>{if(['viv','eri'].includes(s.outing)){s.boundaries[s.outing]='friend';s.respected[s.outing]=true;}done(s,9);});
  add('SCN_0904','solo','选择独立生活或确认今天的独处／朋友安排，不进入恋爱',s=>{s.plans.relation='solo';done(s,9);});
  add('SCN_0903','old_place','明确愿意与薇薇安去旧公寓附近散步',s=>{s.plans.oldPlace='yes';});
  add('SCN_0903','new_place','不去旧公寓附近，选择新的散步路线',s=>{s.plans.oldPlace='no';s.respected.viv=true;});
  for(const [id,intent] of [['stage_ready','明确确认修订直播合同、授权范围、安全许可和最终节目单均已逐项核对，采用正式直播'],['room_ready','明确确认合法小场／Side Room备用时段、缩编与现场授权，不使用未授权旧母带'],['handover','明确退出登台演出，改为工作交接，保留已完成制作报酬']]) add('SCN_1004',id,intent,s=>{if(id==='stage_ready'&&s.eventRoute!=='stage')return '直播仍需先谈妥条件与授权清单，不能从未签约直接变成直播。';s.eventRoute=id;done(s,10);});
  for(const [id,intent] of [['complete','按确认的演出方案实际唱完／演完，本次现场完成'],['partial','演出已经开始，但决定中途停止或仅完成一部分'],['cancel','现在明确取消尚未开始的演出，办理交接'],['handover','已明确交接完制作工作，不登台演出']]) add('SCN_1103',id,intent,s=>{if(s.eventRoute==='handover'&&!['handover','cancel'].includes(id))return '当前采用的是交接方案，没有登台演出的事实。';if(s.eventRoute!=='handover'&&id==='handover')return '要改成交接，需要先明确取消登台安排。';s.eventResult=id==='cancel'?'handover':s.eventRoute+'_'+id;});
  add('SCN_1104','confirm','确认本次现场或交接的实际结果，以及署名、交付和待处理事项',s=>{if(!s.eventResult)return '先把现场完成、部分完成或交接的实际情况说清。';done(s,11);});
  for(const [id,intent] of [['planned','预约今后的录音，目前尚未录制'],['done','明确已在当前录音场景完成这份短小样'],['not_started','暂不开始录音，不预订时间']]) add('SCN_1203',id,intent,s=>{s.demo=id;});
  for(const [id,intent] of [['END_VIV','明确继续与薇薇安约会，并愿意协商下一次见面'],['END_ERI','明确继续与艾琳约会，并愿意协商柏林／见面安排'],['END_FRIEND','明确以朋友身份继续来往或温和告别，不建立恋爱'],['END_SOLO','明确选择独立生活与个人作品，不进入恋爱'],['END_SLOW','双方愿意慢慢了解，具体问题未解决，先不称为恋爱'],['END_CLOSE','明确结束全部私人联系或结束整个故事']]) add('SCN_1204',id,intent,s=>{
    if(id==='END_VIV'&&s.dating!=='viv')return '目前尚未确认与薇薇安的约会关系，可以继续了解、做朋友或独立生活。';
    if(id==='END_ERI'&&s.dating!=='eri')return '目前尚未确认与艾琳的约会关系，可以继续了解、做朋友或独立生活。';
    if(id==='END_SLOW'&&!Object.values(s.mutual).some(Boolean))return '还需要确认对方也愿意继续了解，以及下一次具体安排。';
    s.ending=id;if(['END_SOLO','END_FRIEND','END_CLOSE','END_SLOW'].includes(id))s.dating=null;done(s,12);
  });
  const global = [
    {id:'pause',intent:'明确暂时暂停剧情或休息，以后继续，不是结束整个项目'},
    {id:'resume',intent:'明确从暂停处恢复，继续当前谈话'},
    {id:'exit',intent:'明确结束整个项目／整个故事，并办理已完成工作结算；不是只退出某场演出或结束某个话题'},
    {id:'next',intent:'明确要求进入下一场或继续下一段剧情；不是答应恋爱、签约、亲吻或任何尚未确认的计划'},
    {id:'eri_disclosure',intent:'向在场的艾琳具体说明自己与薇薇安当前是否有关系或承诺；不能只是“我以后会告诉你”'},
    ...['viv','eri'].flatMap(p=>[
      {id:'friend_'+p,intent:'明确要求与'+(p==='viv'?'薇薇安':'艾琳')+'只做朋友，停止浪漫追求'},
      {id:'close_'+p,intent:'明确拒绝与'+(p==='viv'?'薇薇安':'艾琳')+'私人接触，保留工作交接'},
      {id:'reopen_'+p,intent:'明确主动请求重新讨论与'+(p==='viv'?'薇薇安':'艾琳')+'的私人关系，尚未答应约会'},
      {id:'touch_no_'+p,intent:'明确拒绝或撤回与'+(p==='viv'?'薇薇安':'艾琳')+'本次牵手、拥抱或亲吻许可'},
      {id:'kiss_'+p,intent:'明确同意在场的'+(p==='viv'?'薇薇安':'艾琳')+'刚刚提出的本次接吻邀请，不包括未来接触'},
    ])
  ];
  function eligible(s,p) {
    if(['friend','closed','work_only'].includes(s.boundaries[p]))return '之前的私人边界仍有效，需要先主动重开讨论。';
    if(s.exclusive&&s.exclusive!==p)return '先明确处理现有排他承诺，再讨论新的约会。';
    if(s.private[p].length<2)return '目前实际私人相处还不足两次，可以先继续了解。';
    if(!s.respected[p])return '还需要在实际相处中确认边界得到遵守。';
    if(p==='viv'&&!s.withholdingHandled)return '本次邀请隐瞒业主身份的问题还需要处理。';
    if(p==='eri'&&!s.oldStatusDisclosed)return '艾琳还需要知道你与薇薇安目前是否有承诺。';
    return null;
  }
  function date(s,p) {
    if(s.outing!==p)return '只能回应今天实际同行者的邀请，不能同时播放两段约会。';
    const issue=eligible(s,p);if(issue)return issue;
    s.mutual[p]=true;s.dating=p;s.boundaries[p]='dating';done(s,9);
  }
  function visit(s,scene,person) {
    if(!['viv','eri'].includes(person))return;
    if(!s.private[person].includes(scene))s.private[person].push(scene);
  }
  function apply(state,id,txt) {
    const s=clone(state), c=s.scene;
    if(s.ending)return {state:s,issue:'这段故事已结束；现有进度会保留。'};
    if(id==='exit'){s.ending=c.startsWith('SCN_01')?'END_EARLY':'END_CLOSE';return {state:s};}
    if(id==='pause'){if(s.project!=='paused')s.projectBeforePause=s.project;s.project='paused';return {state:s};}
    if(id==='resume'){if(s.project==='paused')s.project=s.projectBeforePause||'active';return {state:s};}
    if(s.project==='paused')return {state:s,issue:'剧情停在这里。想继续时，请先说恢复。'};
    if(id==='next')return {state:s,advance:true};
    if(id==='eri_disclosure'){s.oldStatusDisclosed=true;s.disclosures=s.disclosures||{};s.disclosures.eri={scene:c,text:String(txt||'').slice(0,2000)};return {state:s};}
    const m=/^(friend|close|reopen|touch_no|kiss)_(viv|eri)$/.exec(id);
    if(m){const p=m[2];if(m[1]==='kiss'){if(!s.mutual[p]||s.dating!==p)return {state:s,issue:'先确认彼此的约会意愿和本次接触邀请。'};s.consent['kiss_'+p]=c;}else if(m[1]==='touch_no'){delete s.consent['kiss_'+p];if(p==='viv'){delete s.consent.hug;s.consent.hand=false;}s.respected[p]=true;}else {s.boundaries[p]={friend:'friend',close:'closed',reopen:p==='viv'?'reconnecting':'getting_to_know'}[m[1]];if(m[1]!=='reopen'){s.mutual[p]=false;s.respected[p]=true;if(s.dating===p)s.dating=null;delete s.consent['kiss_'+p];}}return {state:s};}
    const action=(choices[c]||[]).find(a=>a.id===id);
    if(!action)return {state:s,issue:'这句话暂时没有改变已确认的安排，可以继续说清你的意思。'};
    const key=c+':'+id;
    const issue=action.effect(s);
    if(issue)return {state:clone(state),issue};
    if(!s.seen[key]){s.seen[key]=true;s.receipts.push({scene:c,action:id,text:String(txt||'').slice(0,1200)});}
    return {state:s};
  }
  return {initial,choices,global,apply,visit,eligible};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=WTSR_STATE;
