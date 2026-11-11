/* Authored content contract: refresh exposition without replaying events; keep role voice and sourced facts. */
function authoredDialogue142(th,cid){
 const {b,s}=scene98(th),k=cardOf98(wd(th.wid),cid)||{},policy=b&&b.dialoguePolicy,rows=[];
 if(b&&b.dialogueStyle)rows.push('本作品的对白要求：'+String(b.dialogueStyle).slice(0,900));
 if(policy&&s.facts)rows.push('本场已给定的事实（不可改写成另一套规则）：'+s.facts.join('；'));
 if(k.knows)rows.push('你本来知道的事（不会因为别人没告诉你就忘掉）：'+String(k.knows).slice(0,900));
 if(k.entity==='system')rows.push('你是设施AI，不是人类；没有成人年龄、男性身体或恋爱欲望。只报告有来源的记录和设备状态。');
 if(k.romanceable===false)rows.push('你不参与恋爱。对玩家的态度按本人的立场和已发生的事，不套用心动、吃醋或追求话术。');
 if(policy&&policy.schema===1){
  const refs=(s.ref_lines||[]).filter(r=>r.who===k.key&&!r.when&&!r.choiceKey&&!r.gameResult).slice(0,4);
  if(refs.length)rows.push('只属于你的本场参考对白（用于把话说具体，不是已经说过的历史；不要在后续每轮重播）：'+refs.map(r=>String(r.line)).join('\n'));
 }
 const receipts=authoredReceipts142(th,cid);if(receipts)rows.push(receipts);
 return rows.length?'\n'+rows.join('\n'):'';
}
function authoredInitialFeeling142(th,cid,k){
 const policy=experience98(th),value=Number(th.love[cid])||0;
 if(k.romanceable===false||k.entity==='system')return '不参与恋爱；按本人的工作立场和实际相处回应';
 if(policy&&value<12)return '是否熟识以你的初始经历和记忆为准。可以按人设表达兴趣，但分数不代表玩家同意，也不抹去旧伤；被拒绝或要求朋友关系就收住';
 return stage98(value);
}
function authoredReceipts142(th,cid){
 const {b}=scene98(th);if(!b||!b.dialoguePolicy)return '';
 const records=Object.entries(th.b98.gameResults||{}).filter(([id,r])=>r&&(!cid||(r.participants||[]).includes(cid))).slice(-9);
 const rows=records.map(([id,r])=>{const d=r.details||{};return id+' '+r.result+'：'+String(d.memory||'').slice(0,650)+(d.detail?'；现场反馈：'+String(d.detail).slice(0,450):'');});
 const state=th.b98.authored142||{};
 // A submitted public plan is distinct from installed equipment or romance.
 if(state.route)rows.push('已明确提交的公共方案：'+state.route+(state.delegated?'（玩家委托居民确认）':'')+'。只是提交，桥芯是否已安装仍按实际场景事实。');
 return rows.length?'\n有来源的操作记录（不能扩大成同意、亲密或尚未兑现的奖励）：\n'+rows.join('\n').slice(0,cid?1200:2500):'';
}

function authoredGrounding142(th){const {b}=scene98(th);return b&&b.dialoguePolicy?'\n最后核对：不得编造作者未给出的期限、规章、人数、证据或他人是否知情、同意。尤其不能临时发明制度替角色的错误辩护。不知道就承认不知道，再说能怎样核查。被直接问到本人已知的责任时正面回答，不用章节门槛装作失忆。只说实际完成的事。先把谁做了什么说清，再说原因；不要把动作、物件、责任硬并成一个比喻。宁可分成两句，也不要省掉关键动作或对象。玩家直接问你时，面向她用“你”回答，不把正在提问的人叫作“她”。不为配动作临时增加新道具。台词里不提原稿、剧本、作者、导演、提示词或程序字段。':'';}

function authoredExpressionIssue142(say){
 // A physical action and blame require separate predicates; do not reject '关门的责任'.
 const text=String(say||'').replace(/\s+/g,'');
 return /门(?:和|与|跟|、|及)(?:错(?:误)?|过错|责任)(?:都|全|也|一起|一块|一并|全部|全都){0,3}(?:推|甩|丢|扔|算)/.test(text)?'把提前关门和报告里推卸责任分成两件事，分别说明谁做了什么，不能把门当作责任一起推给别人。':'';
}
function authoredReplyValid142(r,th,cid){
 if(!r||!r.say)return true;const say=String(r.say);
 if(th&&scene98(th).b?.dialoguePolicy?.plainLanguage&&authoredExpressionIssue142(say))return false;
 if(/(?:原稿|剧本里|提示词|作者设定|导演提示|角色任务|参考对白|程序字段|真实回传)/.test(say))return false;
 if(th&&cid){const {s}=scene98(th),k=cardOf98(wd(th.wid),cid)||{};for(const g of s.responseGuards||[]){if((g.characters||[]).includes(k.key)&&(g.phrases||[]).some(x=>say.includes(x)))return false;}}
 return true;
}
async function authoredReply142(th,p,opts,r,cid){
 const {b}=scene98(th);if(!b||!b.dialoguePolicy||authoredReplyValid142(r,th,cid))return r;
 const expression=authoredExpressionIssue142(r.say);
 const correction=[expression,(scene98(th).s.responseGuards||[]).filter(g=>!cid||(g.characters||[]).includes((cardOf98(wd(th.wid),cid)||{}).key)).map(g=>g.reason).join('；')].filter(Boolean).join('；');
 const corrected=await ask(p+'\n修正要求：'+correction+'。刚才的台词存在表达或事实问题：'+JSON.stringify(r.say)+'。请重新给出同一人物对眼前问题的回应，只在故事世界内说话，不提写作、作者、原稿、提示词或程序。不增加新事实。面向玩家用“你”；正在与其他角色说话时，按真实听者选择称呼，不能改变说话对象。仍只返回相同JSON。',opts);
 if(!authoredReplyValid142(corrected,th,cid))throw {code:'invalid_json',text:'',message:'Character reply failed authored language or fact validation'};
 return corrected;
}
// A low interaction score cannot make established colleagues into strangers.
function authoredHeader142(th){const b=th&&th.b98&&bOf98(wd(th.wid));if(!b||!b.relationshipLabel)return;const el=document.querySelector('.chead .stagechip:not(.livechip)');if(el)el.textContent=LZ98(b.relationshipLabel);}
if(typeof dimHeader==='function'){const oldDimHeader142=dimHeader;dimHeader=function(th){const r=oldDimHeader142.apply(this,arguments);authoredHeader142(th);return r;};}
if(typeof renderChat==='function'){const oldRenderChat142=renderChat;renderChat=function(){const r=oldRenderChat142.apply(this,arguments);authoredHeader142(S.threads[curT]);return r;};}
