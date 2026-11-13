const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict'),root=process.argv[2],dir=path.join(root,'content/official/m110-husband-v3-1'),d=JSON.parse(fs.readFileSync(dir+'/authoring-input.json')),bindings=JSON.parse(fs.readFileSync(dir+'/media-bindings.json'));const bi=(zh,en)=>({zh,en}),hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const titles=[['老婆，欢迎回家','Welcome Home, My Love'],['女王的一天','Your Good Husband'],['今晚，我只想服侍你','All Yours Tonight'],['我的乖老公，也会吃醋','The Jealous Husband'],['在外是王，在家只听我的','He Kneels for No One Else'],['我们建立自己的王国','Our Little Kingdom'],['一百个爱你的理由','One Hundred Reasons'],['全世界都看见他跪在我面前','The Video'],['老婆，求你听我解释',"Don't Leave Me"],['我的丈夫不是筹码',"My Husband Isn't for Sale"],['如果失去一切，我还是选择你','I Choose You'],['老婆，我每天都重新爱上你','Forever Your Husband']];
const sceneEn=['The Man at the Door','A Perfect Dinner','A Quiet Offer','What Praise Means','Three Breakfasts','A Day for You','The Apron Question','A Weekend Tradition','His Request','Our Private Rituals','An Afternoon Together','The Broken Plate','The Dinner Invitation','Making Plans','An Evening Message','Coming Home','The Boardroom','His Private Office','The Charity Gala','The Ride Home','A Family Scrapbook','Freely Chosen Devotion','Our Relationship','Shared Promises','White Petals','One Hundred Reasons','A Renewed Vow','The Midnight Message','The Stolen Video','An Honest Reaction','The Interview','The Agreement','Three Days Before the Wedding','An Apology in the Rain',"Nathan's Lead",'His Fear',"Marcus's Offer",'Independent Advice','Telling Adrian','Verified Findings','The Board Proposal','An Imperfect Evening','Beyond the Fortune','A Career and a Life','The Same Doorway','His Last Letter','The Future You Choose','The Life Ahead'];
const extras=`阳光落在三份早餐上：蓝莓松饼、法式吐司、班尼迪克蛋。让他推荐，也不等于你从此必须喜欢那一种。
周末安排卡摊在桌上。他清空的是普通会议，真正紧急的工作仍需要说明；陪伴不是取消双方生活的其他部分。
粉色、白色和深蓝色围裙并排放在凳子上。你可以挑颜色，也可以让他自己决定。
他承认有点累，仍然很高兴这一天能与你一起度过。传统需要商量，不能默认每个周末都交给同一个人。
晨光照着床沿。他说明这是一种自己喜欢的迎接方式，同时认真听你是否也喜欢。
笔记本留着空白页。你可以说出最多三项偏好，也可以明确拒绝任何一项；改变主意不需要解释或补偿。
水果盘放在你伸手能拿到的位置。他在软垫边停住，等待你邀请，没把你的专注和时间当成理所当然。
他先让开碎片所在的位置。你们要处理的是一个失误，不是判定谁还配不配得到爱。
内森的新餐厅试营业邀请放在桌边。阿德里安坦白吃醋，也说明不会干涉你的朋友关系。
离出门还有一点时间。一起赴宴、各自安排或另约明天，都可以被认真听见。
如果他留在家里，这是一条不要求立即回复的消息；如果你们一起赴宴，夜宵则是回家后的提议。照顾不会变成催促报备。
他愿意说出不安，也承担管理自己情绪的责任。你的社交不必用补偿换取许可。
你坐在访客席旁听会议。他看完收购报告，要求团队拿证据支持估值，语气冷静而明确。
办公室门合上以后，他才松开领带。亲密的昵称让他脸红，却不会抹去刚才那个能做决定的人。
宴会灯光落在他礼服上。他先问是否需要帮忙，等你点头才处理鞋子的装饰，不把公开照料变成宣示所有权。
车窗外街灯向后掠过。他说自己在乎职业，也不想伪装成不会照顾妻子的人；与此同时，一项住宅安防访问申请留下了记录。
电影票、旧食谱和照片夹在书页中。任何你不愿保存的私人影像，都可以请他移除。
他解释，跟随你的安排有时让他觉得安静。那不代表他没有愿望，也不是换取爱的代价。
女性主导、互相照顾、私下仪式或灵活相处，都只在双方愿意时成立。今天的答案不会剥夺明天重新商量的权利。
诚实、允许改变主意、每天自由选择彼此，写在同一页。他又留出余地，提醒你们别把婚姻过成一张任务清单。
白色花瓣沿地灯铺向餐厅，他抱着郁金香，穿着深蓝衬衫。今天是你们结婚六个月的纪念日。
其中写着普通日子的笑声、诚实和不必永远扮演总裁的轻松。礼物不是要求你回报同等分量的承诺。
纪念戒指留在打开的小盒子里。重新表达的不是一份不可撤销的契约，而是继续一起生活的愿望。
匿名消息的挑衅文字出现在屏幕上。真正紧急的问题是，有人未经允许取得并传播了住宅安防影像。
你们保留原消息和时间，不继续转发视频。任何私人偏好，都不能成为侵犯隐私的理由。
为他骄傲、为侵权愤怒，或需要时间消化，是不同的感受。他不能把你的反应当成忠诚测试。
在与律师商量过的有限采访中，他只谈自己的行为与工作能力。你的具体偏好与立场，不由他代为公开。
维多利亚发来的文件显示，治理协议在婚礼前签署。文件的存在与视频泄露是两个问题，不能因此认定她是幕后主使。
他说明签署的是治理安排，并拒绝了另一份披露私人生活的附加条款。但他承认，早该把这次谈判告诉你。
雨声隔着玻璃传进来，文件放在你们之间。他不靠下跪索取原谅，也允许你今晚不接受拥抱。
内森把承包商访问线索连同时间记录交来。你们请律师保全材料，在独立核验前不宣布谁有罪。
暂时放下调查后，他终于承认害怕不再成功就失去价值。倾听不意味着你必须承担管理他全部情绪的责任。
马库斯的书面提议，以金钱交换一份支持罢免的公开声明。收到或询问提议，都不等于你已经接受或签署。
律师与埃琳娜安排独立保全访问日志和交易文件。已核实记录与怀疑被分开放置，你本人的利益同样需要保护。
你告诉他自己实际做了什么，也说明仍待专业意见的部分。支持不等于替他承担公司，更不必隐瞒不确定性。
独立调查核实了承包商不当访问，以及马库斯顾问的利益冲突。后续责任须按证据与正式程序处理，不靠流言或提前定罪。
董事会提出调整监督后的复职方案。他可以审阅条件、工时与授权范围，再决定是否继续担任总裁。
他关掉炉火才坐下，承认今晚做不了完美晚餐。简单吃一点、叫餐或分担家务，都不会让他变得不值得爱。
爱与财富可以被区分，但工作、经济独立和安全感也值得谈。你不必用一句浪漫承诺跳过所有现实问题。
继续担任总裁、正式交接或限期休整，都需要时间表和他自己的确认。任何人都不该被要求以放弃事业来证明爱情。
电梯又在同一时间抵达。他先等你说明今天希望怎样被迎接，当前的偏好比复刻第一次的姿势更重要。
信纸读完后留在你手里。他的依恋不再要求你证明自己永远不会走，你的主导也不必依靠抹去他的自我。
你可以继续女性主导的婚姻、选择互相照顾、协商事业、换一种节奏，或分开生活。沉默不代表已经同意任何未来。
你们要承担实际安排，也保留各自的边界。没有一个结局能替你决定往后的每一天。`.split('\n');assert.equal(extras.length,44);
d.scenes.forEach((s,i)=>{s.title=bi(s.title,sceneEn[i]);if(i>=4)s.narration.zh+=extras[i-4];});d.scenes.forEach(s=>{s.narration.zh=s.narration.zh.replaceAll('Adrian','阿德里安').replaceAll('Nathan','内森').replaceAll('Victoria','维多利亚').replaceAll('Marcus','马库斯').replaceAll('Elena','埃琳娜');});d.scenes[2].narration.zh='晚饭后，你坐在客厅沙发上揉了揉肩。阿德里安拿来温毛巾，在你身旁停下，先问是否需要帮助；他等你同意才会碰触。';d.scenes[0].narration.zh='周五晚上七点四十二分，私人电梯抵达家门。阿德里安穿着粉色围裙，自愿跪坐在玄关软垫上迎接你。晚餐、温水和拖鞋已经准备好，他先等你回应，再伸手接包。';
const endings=[
['女王与自由的心','A Queen and a Willing Heart','你们保留女性主导的相处方式，也把休息、拒绝与重新协商写进共同约定。阿德里安有自己的事业决定；围裙与迎接仪式只在双方愿意时出现。门再次打开，他先问今天需要什么，而不是完成一场必须得到好评的表演。','You keep a female-led relationship with room for rest, refusal and revision. Adrian retains his own career decisions. The apron and greeting rituals happen only by mutual choice. When the door opens, he asks what you want today instead of performing for approval.'],
['彼此的家','A Home for Both of You','家务与照顾开始轮流安排。忙碌的一方可以先休息，另一方也能把自己的需要说出来。阿德里安依然会撒娇，也依然喜欢为你做饭，但再没有人必须靠服务换取被爱。','You begin sharing care and household work. Whoever is exhausted can rest; both can say what they need. Adrian remains affectionate and enjoys cooking for you, but neither of you has to earn love through service.'],
['两种梦想，一张餐桌','Two Dreams, One Table','你们没有用一场告白消除职业冲突，而是把工作时段、陪伴时间和各自不可退让的目标逐项谈清。若此前的事业计划不再适合，新的安排须经阿德里安本人同意后再调整。下一次复盘写进日历，爱情与现实都被认真对待。','A declaration does not erase incompatible career needs. You negotiate work hours, time together and non-negotiable goals. Any revision to the earlier career plan requires Adrian’s own agreement. A review date goes into the calendar: love and practical reality both receive attention.'],
['重新学习生活','Learning a New Rhythm','你们选择一起换一种生活节奏，不把搬家或休假当作万能答案。预算、工作交接与试行期限被写清；如果原先决定继续担任总裁，是否改变仍由他确认。你们先过好一段普通日子，再讨论更远的未来。','You choose a different rhythm together without treating a move or a holiday as a cure. You agree on budgets, any handover and a trial period. If he previously chose to remain CEO, changing that decision still requires his agreement. You begin with ordinary days before deciding the distant future.'],
['各自的明天','Separate Tomorrows','你选择结束婚姻关系。阿德里安难过，却没有要求最后一次拥抱、继续等待或日后复合。财务与手续交给各自的专业代理处理，私人影像与个人资料按双方要求妥善处理。你走向自己的生活；这不是等待他把你追回来的过场。','You choose to end the marriage. Adrian is hurt, but asks for neither a final embrace nor a promise to wait or reconcile. Independent advisers handle practical and financial arrangements, and private recordings and personal data are handled according to your wishes. You move toward your own life. This is not a pause before he wins you back.']
].map((e,i)=>({id:'ABCDE'[i],title:bi(e[0],e[1]),narration:bi(e[2],e[3])}));d.endings=endings;d.version='3.2.0-authorized-completion';
const key='m110-husband-v3-1',pfx='husband_',opts=new Map(d.choice_groups.map(g=>[g.scene_id,g])),name='阿德里安';
function flags(o,g){const f=['authored~'+o.choice_id,'intent~'+Buffer.from(o.player_intent.zh+' / '+o.player_intent.en).toString('base64url')];for(const bit of o.effect_as_written.split(',')){const [k,v]=bit.split(':');if(/^[+-]?\d+$/.test(v))f.push('stat~'+o.choice_id+'~'+k+'~'+v);else if(k==='memory'){const value=o.choice_id.split('-O-')[1].toLowerCase();f.push('remember~'+o.choice_id+'~'+(v==='ritual_preferences'?'ritual_'+value:v)+'~'+value);}else if(k==='flag')f.push('husband_'+v);else if(k==='ending'){f.push('husband_ending_'+v);f.push('relationship~'+(v==='E'?'separated':'married'));};}if(g.selection)f.push('multi~3');return f.join(',');}
function scene(s,l){const m=bindings.sceneMedia.find(x=>x.scene_id===s.scene_id);let out=`\n# SCENE｜${s.place[l]}\n⟦TIME|${s.time[l]}⟧\n⟦BG|${s.asset_id}|${s.place[l]}⟧\n⟦SET|husband_scene~${s.scene_id}⟧\n`;if(m.music)out+=`⟦BGM|${pfx+m.music}⟧\n`;const sfx={1:'door_unlock',2:'plate_touch',5:'coffee_machine',12:'plate_touch',17:'pages_flip',20:'shoe_step',25:'soft_notification',28:'phone_vibrate',29:'soft_notification',34:'rain_light',37:'tension_hit',38:'pages_flip',45:'elevator'}[s.chapter*4-4+s.scene];if(sfx)out+=`⟦SFX|${pfx+sfx}⟧\n`;const n=s.chapter*4-4+s.scene,fx={1:'candle',18:'blush',25:'sun_rays',27:'zoom',28:'notify',32:'spotlight',34:'rain',38:'spotlight',42:'slowmo'}[n];if(fx)out+=`⟦FX|${fx}⟧\n`;out+=`旁白：${s.narration[l]}\n`;if(s.actor==='Adrian')out+=`${name}：“${s.dialogue[l]}”\n`;else out+=`旁白：${l==='zh'?({message:'匿名消息',Victoria:'维多利亚的便笺',Nathan:'内森发来的说明',Marcus:'马库斯的书面提议',lawyer:'律师的意见'}[s.actor]):({message:'The anonymous message',Victoria:'Victoria’s note',Nathan:'Nathan’s message',Marcus:'Marcus’s written offer',lawyer:'Your lawyer’s advice'}[s.actor])} — ${s.dialogue[l]}\n`;return out;}
const scripts={};for(const l of ['zh','en']){let text='# '+(l==='zh'?d.title:'My Billionaire Husband Kneels for Me')+'\n';for(let ch=1;ch<=12;ch++){text+=`\n# CHAPTER ${ch}｜${titles[ch-1][l==='zh'?0:1]}\n`;if(ch===1)text+=`⟦ORIENT|bg⟧\n⟦CHAR|你|f|25|f1|${l==='zh'?'玩家本人':'The player'}|${l==='zh'?'成年妻子，姓名、职业与边界由玩家决定':'Adult spouse; the player chooses name, career and boundaries'}|${l==='zh'?'你':'You'}⟧\n⟦CHAR|${name}|m|28|m1|${l==='zh'?'丈夫，科技公司创办人':'Husband and technology founder'}|${l==='zh'?'美籍亚裔，黑色中长发，强壮、自愿温柔，也有自己的需求与事业':'East Asian American; layered black hair, athletic, affectionate by choice, with his own needs and career'}|${l==='zh'?name:'Adrian'}⟧\n⟦SET|authored~${key},relationship~married,initial~devotion~60,initial~trust~55,initial~intimacy~50,initial~leadership~50,initial~autonomy~60⟧\n`;
for(const s of d.scenes.filter(x=>x.chapter===ch)){if(ch===12&&s.scene===4)continue;text+=scene(s,l);const g=opts.get(s.scene_id);if(g){text+=`# CHOICE｜${s.actor==='Adrian'?s.dialogue[l]:(l==='zh'?'对这份提议，你打算怎样回应？':'How do you want to respond to the proposal?')}\n`;g.options.forEach((o,j)=>{text+=`#### ${'ABCDE'[j]}｜${o.label[l]}\n⟦OPT|${'ABCDE'[j]}|set:${flags(o,g)}⟧\n`;if(s.scene_id==='M110-C10-S01')text+=`旁白：${o.response[l]}\n`;else text+=`${name}：“${o.response[l]}”\n`;if(ch===12){text+=`⟦SET|husband_scene~M110-C12-S04⟧\n⟦CG|M110-BG-048|${endings[j].title[l]}⟧\n`;text+=`⟦BGM|${pfx+'ending_'+'ABCDE'[j]}⟧\n⟦FX|sun_rays⟧\n旁白：${endings[j].narration[l]}\n`;}});text+='# ·\n';}else if(!(ch===12&&s.scene===4)){text+=`⟦FREE|${s.actor==='Adrian'?s.dialogue[l]:(l==='zh'?'你想怎样回应眼前的情况？':'How would you like to respond?')}⟧\n`;}}
}scripts[l]=text;fs.writeFileSync(dir+(l==='zh'?'/script.md':'/script-en.md'),text);}
fs.writeFileSync(dir+'/story.json',JSON.stringify(d,null,2)+'\n');
const assets=JSON.parse(JSON.stringify(bindings.assets));assets['char_'+name]=assets.char_Adrian;Object.keys(assets).filter(k=>/^(bgm|sfx)_/.test(k)).forEach(k=>{const [kind,...tail]=k.split('_');assets[kind+'_'+pfx+tail.join('_')]=assets[k];delete assets[k];});const oldAssets=JSON.parse(fs.readFileSync(dir+"/asset-map.template.json"));if(oldAssets.voices)assets.voices=oldAssets.voices;assets.endings=Object.fromEntries(endings.map(e=>[e.id,{t:e.title,txt:e.narration,line:bi('','')}]));fs.writeFileSync(dir+'/asset-map.template.json',JSON.stringify(assets,null,2)+'\n');
const premise='你与科技公司创办人阿德里安已经结婚近六个月。他在工作中冷静果断，在家却喜欢穿粉色围裙做饭，享受由你主导的亲密仪式。\n\n这些偏好只有在双方愿意时才成立。你保留自己的事业、朋友与生活，他也有自己的需求和决定。\n\n一段遭窃的住宅安防视频将私人生活推到公众面前。你们要处理泄露、公司治理与隐瞒，也要重新谈清：怎样的婚姻才是各自真正选择的生活。';
const config={content_key:key,cover:assets.cover,adult:true,as:'你',hook:'他在外面执掌公司，在家只想等你回来。',premise,you:'直接扮演成年妻子，自定姓名、职业和边界。',tags:['Contemporary Romance','Devoted Husband','Female-Led','Marriage'],en:{title:'My Billionaire Husband Kneels for Me',hook:'He leads an empire. At home, he wants to welcome you.',premise:'You have been married to technology founder Adrian Vale for almost six months. Decisive at work, he enjoys cooking in a pink apron and freely following your lead at home.\n\nThose rituals exist only by mutual choice. You keep your own career, friends and life; he has his own wishes and decisions.\n\nA stolen security recording exposes your private life. Corporate governance, withheld information and the privacy breach force you to negotiate the marriage you both want.',you:'Play yourself as an adult spouse; choose your name, career and boundaries.'}};
const chapters=l=>scripts[l].split(/(?=^# CHAPTER \d+)/m).filter(x=>/^# CHAPTER /m.test(x)).map((md,i)=>({n:i+1,t:titles[i][l==='zh'?0:1],md}));const sourceSha256=hash(fs.readFileSync(dir+'/source.docx'));const bundle={title:d.title,sourceSha256,scriptSha256:hash(scripts.zh),chapters:chapters('zh'),config,en:{title:config.en.title,chapters:chapters('en'),config:{...config,lang:'en',hook:config.en.hook,premise:config.en.premise,you:config.en.you}}};fs.writeFileSync(dir+'/bundle.json',JSON.stringify(bundle,null,2)+'\n');
for(const l of ['zh','en']){const qa=require(path.join(root,'api/_dslqa.js')).dslQA(scripts[l]),style=require(path.join(root,'api/_stylecheck.js')).checkDsl(scripts[l]);fs.writeFileSync(dir+'/qa-'+l+'.json',JSON.stringify({qa,style},null,2)+'\n');assert.deepEqual(qa.err,[]);assert.deepEqual(style.err,[]);assert.equal(qa.stats.chapters,12);assert.equal(qa.stats.choices,21);assert.equal(qa.stats.options,72);}
console.log(JSON.stringify({chapters:12,uniqueScenes:48,choiceGroups:21,options:72,endings:5,languages:['zh','en'],sourceSha256}));
