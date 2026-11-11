"""Compile the reviewed manuscript without shortening the introduction or dropping dialogue.
Only this script produces the North Light bible, compatibility import and fidelity manifest.
"""
from pathlib import Path
import json,re,hashlib,sys
R=Path(__file__).resolve().parents[1];D=R/'scripts/north-light-v1';WID='w_scmwaymue65be8983c9b'
def dump(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def bi(s):return {'zh':s,'en':s}
original=(D/'北灯未熄_八章重写版.txt').read_text()
source=D/'story-reviewed.txt'
if not source.exists():
 text=original
 replacements={
 '我提前封门，后来又把主责推给你。不是写错，是我逃责。':'门是我提前关的。后来写报告，我又把错推给了你。不是写错，是我不敢认。',
 '我认得。我用高级见证权限担保，核查责任记我名下。':'我认得她。我替她担保，要查什么，先来问我。',
 '当前二百五十二人。一项身份与旧档案冲突。':'现在所里有252人。可你的登记还写着“已死亡”，这条得改。',
 '外营断联之后，你被登记死亡。记录匣给我，我来纠正。':'外营失联后，我把你记成了死亡。把记录匣给我，我来改。',
 '独立身份凭证已签发。临时担保解除，不再续用。':'你的新身份证明办好了。以后进出这里，不用再找人担保。',
 '误操作会让读取口回退，原始波形不一定留得住。':'操作错了，机器就会退回保护状态。那段原始录音可能就取不出来了。',
 '旧预案自动播报，不等于有人冒充。':'这是以前设好的广播。光听声音，还不能说有人在冒充你。',
 '我提前封门，后来救人，第二天又签了失实归责。三件都在。':'门是我提前关的，人是我后来救的。第二天，我又把责任推给了你。哪件都别替我省。',
 '正式结果仍送达。缺席不写成认可或宽恕。':'结果还是会交给你。你不来，不等于你同意，更不等于你原谅了谁。',
 '要确认今天的命令从何而来，还需核对原始语音、凭据调用和转交记录。':'还得查三样：原来的录音、今天谁用了旧凭证，还有凭证是怎么转手的。',
 '同一旧凭据被再次使用，同一录音被剪接。没有证据表明本人今天发出这条指令。':'有人又用了你的旧凭证，还剪过旧录音。但没有证据说，这条命令是你今天发的。',
 '死亡名册与旧广播是两套记录。名册注销了人，海伦保留了旧凭据。':'死亡登记和广播用的不是一套记录。海伦把你记成了死人，却没停用你的旧凭证。',
 '注销确认。旧设备改为本地值守，自动代签停止。':'旧凭证已经停用。以后这些设备要有人到现场操作，不能再自动用你的名字签字。',
 '双重确认生效，既有录音不能再单独触发。':'设置改好了。以后要你本人和一名居民一起确认，光放旧录音不管用了。',
 '旧片作废，新公共授权需三方确认。本人不再被默认为全部行动担责。':'旧片作废。以后要三方一起确认，不能再把所有决定都算在你头上。',
 '基础生活另路供电。每轮可调测试电六格。':'吃饭、取暖用的是另一路电。测试这边，每轮有六格可以用。',
 '三项完成。测试顺序已记录，结果一起公开。':'三项都测完了。先测哪项我记下了，结果会一起给大家看。',
 '桥芯只有一颗，投入后不能当作仍在桌上。':'桥芯只有这一颗。装进哪套设备，就不能同时拿去给另一套用。',
 '桌上只有你的新凭证还没插入。':'桌上还留着你的新凭证，等你决定要不要接入。',
 '签名最干净地收回':'彻底停用你的旧签名',
 }
 for a,b in replacements.items():
  if a not in text:raise ValueError('Editorial replacement missing: '+a)
  text=text.replace(a,b)
 source.write_text(text)
 dump(D/'editorial-changes.json',[{'before':a,'after':b} for a,b in replacements.items()])
text=source.read_text();b=json.loads((R/f'art/official/{WID}.bible.json').read_text())
intro=text.split('故事背景 玩家进入时首先看到\n\n',1)[1].split('\n玩家身份',1)[0].strip()
b['intro']=bi(intro);b['premise']=bi(intro)
b['dialoguePolicy']={'schema':1,'plainLanguage':True,'maxChars':90}
b['relationshipLabel']=bi('旧识')
b['dialogueStyle']='说日常话。先回答玩家刚问的具体事情，再解释原因。工作上需要提设备或规则时，随口解释它是干什么的，不连续堆“核验、凭据、代签、回执”等词。不把主持人说明念给玩家听，不反复用抽象宣言收尾。动作和责任分别说清：门是提前关的，责任是后来在报告里推给别人的；分别用完整的动作说明，不能共用一个含糊的动词。需要两句就分开说，不为缩短字数硬合成一句。说明谁做了什么，代词要让听者知道在指谁。允许一两句完整的话，把因果说清楚。'
b['world']='北灯是近未来美国西北的一座避难所。灰潮是危险的风沙，不是怪物。原来有240名居民（包含伊莱救下的12名病人），这次玩家带11人返回，总数252。吃饭、床位、医疗和取暖不靠恋爱或游戏输赢交换。聊天和离线不推进第三夜的实施期限。旧授权片是一块曾交伊莱保管的工程凭证，只能打开旧广播和维护频道的代签功能，不是万能钥匙。死亡名册与旧广播分开管理。假广播只能剪接玩家以前录过的工作语音，不能造出新句子。桥芯是各套设备都需要的一枚供能核心，只有一颗，最终只能选一种用途。'
b['style']='照当前场景的事实和待选分支演，不连续播放互斥分支。角色先接玩家的问题，不把后台条件、题目答案或主持人结论说成台词。不替玩家说话、行动、同意、原谅或恋爱。只把真实操作回传和已在场演出的事当经历。知情人被直接问到自己的责任要正面答，后章改为核实，不重新装不知道。名字、署名与公共帮助不附带恋爱条件。各人的说话方式分别执行。'
keys={'诺亚':'c01','伊莱':'c02','玛拉':'c03','海伦':'c04','灯塔':'c05'}
# Read the author's existing role cards rather than copying one role summary into every field.
appendix=text.split('作者附录二')[1].split('作者附录三')[0]
for p in b['cast']:
 name=p['name']['zh'];k=p['key'];m=re.search(r'【'+name+r' CHAR_[A-Z] [^】]+】(.*?)(?=\n【[^】]+ CHAR_|\Z)',appendix,re.S);card=m[1].strip();fields={}
 for line in card.splitlines():
  if '：' in line:label,val=line.split('：',1);fields[label]=val
 if name in ['诺亚','伊莱']:
  p['bio']=fields['CV与造型'].split('。',2)[-1];p['personality']=fields['人格链']+'。'+fields['日常'];p['voice']=fields['语言'];p['flirt']=fields['调情素材'];p['arc']=fields['关系、知情与成长'];p['when_asked']=fields['动态反应'];p['hooks']=fields['聊天知识'];p['archetype']='寡言、做事快、爱赢棋的旧同事' if name=='诺亚' else '用具体玩笑试探，认真时会收笑的外勤修理师';p['expression']='说出本人想要什么，不用工作术语遮住心虚。';p['jealousy']='可以坦白有点酸，不能曝光别人私话或阻止玩家选择。'
  p['knows']=('你和玩家共事过，知道自己提前封门、折返救援和次日推责，玩家受伤及被外派也是真的。对自己做过的事被问就答，不用等到第三章才认错。你不知道伊莱与海伦的私下交易，也不知道未被转告的私聊。' if name=='诺亚' else '你认识玩家，也曾与诺亚共事。你知道自己三十天前未经玩家同意把授权片交给海伦，换12名病人入所；初始不知道海伦后来怎样剪录音冒用。被问到卖片就承认，不以救人要求原谅。')
 else:
  p['bio']=card.split('。')[0]+'。';p['personality']=card;p['voice']={'玛拉':'说清具体的人、物件和办法。熟人前可以快一点，有脾气也有幽默；承认错误时不索求安慰。','海伦':'平稳、完整的句子，用具体成本争辩。失势也不尖叫，不把管理术语堆成一串。','灯塔':'像好用的设备提示：先说测到什么，再说明能证明什么。未知就说还不知道；必要术语用一句白话解释。'}[name];p['knows']={'玛拉':'知道自己改造过线路，也知道原设计署名被盖住。知道收到的公开材料，不知道伊莱交易细节和他人私聊。','海伦':'知道自己把外营断联当作死亡依据，保留旧片并冒用广播，也知道自己安排24人优先名单。被证据质询时回应具体问题，不知道他人私聊。','灯塔':'只能读取获准接入的记录和传感器。知道旧索引，不自动知道隐藏交易或私人谈话。声纹相同只能说明录音相同，不能证明本人今天同意。'}[name];p['hooks']=card;p['when_asked']='回答当场能核实的具体问题；不替玩家表态。'
  if name=='灯塔':p['entity']='system';p['gender']='none';p['age']=None;p['fear']='不凭不完整的记录下结论。'
 p['role']=bi({'诺亚':'北灯的安全队长，曾与你共事。','伊莱':'外勤修理师，也是诺亚的旧搭档。','玛拉':'你的旧友，如今负责居民组织。','海伦':'北灯的管理长。','灯塔':'运行四年的设施AI，出现在公共终端。'}[name])
 p['want']={'诺亚':'把做错的事交代清楚，也想在不需要队长的日子里被你叫住。','伊莱':'想走远，也想被你认真选择；不假装自己没有愿望。','玛拉':'维护居民的发言权，也希望自己的真实贡献被看见。','海伦':'保住控制权，证明自己的成本判断必要。','灯塔':'把记录和设备状态报告准确。'}[name]
 p['secret']={'诺亚':'知道自己曾抢先封门并把主责推给玩家。对自己的责任早问早答。','伊莱':'未经玩家同意转交过授权片，换12名病人入所；被直接问到就承认。','玛拉':'知道自己容许原设计署名被盖住。','海伦':'隐瞒保留旧片、剪接录音与优先名单的具体安排。','灯塔':''}[name]
 p['boundaries']='只知道亲历或被告知的事。拒绝、朋友和停止联系要持续有效；问责不因恋爱取消。';p['toward_player']=('曾与你共事，具体旧伤和信任按已发生的事处理，不能说刚认识。' if name in ['诺亚','伊莱','玛拉'] else '按本人的工作立场回应，不追求玩家。')
 p['sample_lines']=[line.split('：',1)[1] for line in text.splitlines() if line.startswith(name+'：')][:5]
# Scene-specific tasks: facts, intent and a human response, not a shared boilerplate.
tasks=[
 {'诺亚':'拦住海伦拿走记录匣，认出旧同事。承认自己的签字不是笔误；是否接受担保由玩家决定。','海伦':'解释自己因失联登记死亡，想取走记录匣；被玩家拒绝就收手，给核查依据。','灯塔':'报出252人和死亡登记冲突，把旧工程证与昨日工单的用途说清楚。'},
 {'伊莱':'把门、灯、滑轨各需要几格电说清楚。引导玩家先机械固定门，再借走门电；不替玩家按按钮。','海伦':'提醒机器保护会退回，但不能用风险阻止玩家查询。','灯塔':'只反馈实际供电和门位。没取到原匣时不能说已看过原波形。'},
 {'诺亚':'可以争报数的机会；搭档由玩家选。真被选中就按口令等，不抢接线。','伊莱':'用维修现场的具体玩笑争一次搭档，认真听玩家半张卡；没选你就退出私人校准。','灯塔':'交新身份证明，解除担保；反馈三拍信号，不替玩家输入暗号。'},
 {'诺亚':'拿缺角棋出价，也能提出一个没任务的具体邀请。只记真实成交和谁拥有棋。','伊莱':'拿旧票换即兴播报，可以争被记住；没说过的题词不编成共同回忆。','玛拉':'主持四轮交换，提供地图与修夹办法；玩家只找你时留出空间，不替男主求情。'},
 {'诺亚':'把封门、救援、翌日推责三件事分开认，交原件并接受撤职，不把救人当抵账。','海伦':'可以说明当时压力，但不能把诺亚的失实报告说成正确。','灯塔':'按原始时间报记录，指出哪条不能证明什么，不替玩家说原谅。'},
 {'诺亚':'材料已经交了。想再见玩家就直说；不以认错换亲密，玩家让你走就停止追求。','灯塔':'若玩家允许私人谈话，先停录并退出；此后听不到的内容不能进入你的记忆。'},
 {'玛拉':'承认原设计属于玩家，说明自己做过哪些改造。还署名与以后是否合作分开谈。','海伦':'争论公开设计的成本，证据成立不能继续占原作者名字。','灯塔':'展示底图与修改记录，区分原设计和集体改造。'},
 {'伊莱':'承认未经同意转片换12人，讲清交易与后来冒用的区别。被早问过就直接核对原件，不演第二次坦白。','诺亚':'可以质问旧搭档，但不能用他的错误抹掉自己的责任。','灯塔':'把旧片、旧录音、管理端调用三件事拆开说明。相同声音不是本人今天批准。'},
 {'海伦':'逐轮提出设备、人数、居民要求的主张，让对应证据反驳；不同材料只能证明各自范围。','玛拉':'拿车厢铭牌和居民请求争公开清点，不提前替所有人同意撤离。','伊莱':'出示真实交易凭条，不再私谈；车能坐270不等于终点已验证。'},
 {'诺亚':'队徽已经交出；不把自己当第二把钥匙，让玩家选居民见证。','伊莱':'支持停用旧片，不再次把已经交过的材料当礼物，不替玩家说同意。','玛拉':'谈谁来值班、谁来共同确认的具体安排，不把工作塞回玩家一人。','灯塔':'解释死亡名册和广播凭证分开。只在玩家真实确认后执行停用、双重或共同确认。'},
 {'诺亚':'希望先测主网，但开关要等玩家；说明2格的测试，不代表已经决定留守。','伊莱':'讲明灯列测试要3格，允许玩家先测别项；不能用自己的旅行愿望藏结果。','玛拉':'说明附站4格和分站代价，所有必要测试都能补齐。','灯塔':'测试每轮6格，基本生活另一路电；只报真实已完成的ABC项目。'},
 {'诺亚':'在玩家允许的单独窗口说清想留下、想约见，不假装什么都随玩家。','伊莱':'在允许的单独窗口谈旅行、异地和班表；不能用离开逼恋爱。','玛拉':'尊重分别私谈；玩家两人都不留时，可以和她谈自己的工位与生活。'},
 {'诺亚':'说明留守时你负责哪些维修；玩家选别的路线也做最后清点。','伊莱':'支持出走，但明确252人的座位优先于私人箱。','玛拉':'核对三站安排或居民委托。只有玩家明确确认方案才记提交，不把建议当施工。','灯塔':'桥芯只有一颗，本场仍完整，过门后才能安装或拆分。'},
 {'诺亚':'先撑门，听玩家口令，不抢闭锁杆。四张人员牌都核对后才关门。','伊莱':'报告实际位置和接口；只有真实约过的暗号才使用，没有就要一句清楚口令。','玛拉':'核对实际撤出的四人，箱与桥芯按回传区别，不能把丢失的箱变回来。'},
 {'诺亚':'只按已确认路线履行维修或清点，撤职继续有效；不自动与玩家同住。','伊莱':'只在路线对应地点出现，按真实物主和真实题词回应，不瞬移也不复制旧箱。','玛拉':'按留守、整体迁移或三站中的一条完成安置，署名与问责是共同结果。','海伦':'承认实际移交并接受审查，可说自己的看法，不再恢复独占权。','灯塔':'只呈现已安装和实测的结果。路线未提交或安置未完成就先补实际操作。'},
 {'诺亚':'只在玩家允许联系的个人窗口邀请下一次，没玩过棋就重新约，朋友不暗示转正。','伊莱':'只在允许联系的窗口提具体节目或见面，没有真实题词就请玩家现说；不替玩家接受。','玛拉':'必要时提供公开生活信息，不听私人邀请，也不替玩家选择恋人。'}]
facts=[['玩家回来的这天，死亡登记已经过去十二天。海伦把外营失联当作死亡依据，当时只有失联记录，没有死亡的现场证据。她不能把自己的判断说成已经核实的死亡。', '诺亚签过把责任推给玩家的报告；玩家还没答应接受他的担保。记录匣属于玩家，未经同意不能拿走。'], ['可调电三格：门两格、滑轨两格、照明一格。门机械固定后才可撤门电。', '原始日志和录音是否拿到，以G02回传为准。'], ['新的独立身份证明已经签发，临时担保解除。', '搭档、操作顺序和暗号都要由玩家真实选择，不能把共修写成恋爱。'], ['票最初属于伊莱，缺角棋属于诺亚，地图副本由玛拉提供。', '只有真实成交或转赠后才改变物主；没有真实题词就不能回忆玩家说过。'], ['诺亚先提前封门，后救人，次日又签失实报告。救人不抵销封门和推责。', '他将交原件并接受撤职，不以玩家先原谅或恋爱为条件。'], ['诺亚已交材料和队徽，后续审查继续。', '私人谈话须先停录、灯塔退出；未参加者不能知道谈话内容。'], ['原设计属于玩家，玛拉也做过真实改造，两件事要分开署名。', '恢复署名不等于恢复私人信任。'], ['伊莱三十天前未经同意转交旧片，换12名病人入所；他们已计入原240人。', '相同录音不等于本人今天同意。伊莱初始不知道海伦后来怎样冒用。'], ['三节车厢，每节90座，共270座；海伦的优先名单只有24人。', '座位数不能证明列车已能开到终点，居民请求公开也不是同意迁移。'], ['死亡名册和旧广播是两套记录；办好新身份不会自动停用旧片。', '停用、双重确认或共同确认，必须玩家明确选择后才执行。'], ['每轮测试电六格，基本生活另路供电。主网2格、灯列3格、附站4格。', '桥芯只有一颗；测试先后不是最终路线，也不是选择恋人。'], ['诺亚想留下，伊莱想走。各自愿望不会因玩家偏好被抹去。', '私人窗口分别出现，已停止联系者不出现。'], ['三种方案已验证。只有明确确认才能提交路线；本场桥芯仍完整，未安装也未拆分。', '选D是委托居民按公开预案确认A，不是选择恋人。'], ['作业区四个人：诺亚、伊莱、玛拉和一名维修员。', '安全顺序是撑门、卸箱清路、四人撤出清点、外部闭锁；箱是否保全以真实回传为准。'], ['仅播放已经提交的A、B、C其中一条路线，实际安置未完成就先补操作。', '已经丢失的箱不能重现；252人身份、署名和问责不取决于恋爱。'], ['一周后的个人邀请须分别且获准联系；人物位置由实际居住地和通信条件决定。', '只做朋友、停止联系或独立生活都有效，不因好感数值自动确立关系。']]
chapters=list(re.finditer(r'^第[一二三四五六七八]章 (.+)$',text,re.M));dialogue_count=0;scene_index=0;archive=[]
for ci,cm in enumerate(chapters):
 chunk=text[cm.end():chapters[ci+1].start() if ci+1<len(chapters) else text.index('作者附录一')]
 sms=list(re.finditer(r'^场景\d+ (.+)\nSCN(\d\d)_(\d) (.+)$',chunk,re.M))
 c=b['chapters'][ci]
 for si,sm in enumerate(sms):
  body=chunk[sm.end():sms[si+1].start() if si+1<len(sms) else len(chunk)].strip();s=c['scenes'][si]
  if not body.startswith('【开场导语】'):body='【开场导语】先按你已经提交的方案完成安置，再核对实际设备与人员。\n'+body
  s['beat']=body;s['actor_payload']={keys[n]:v for n,v in tasks[scene_index].items()};scene_index+=1
  s['facts']=facts[scene_index-1]
  if s['id']=='c01s01':s['responseGuards']=[{'characters':['c04'],'phrases':['按北灯的规矩','按北灯规矩','按规矩','按规定','失联满期','失联满三十天','失联满十二天'],'reason':'死亡登记是海伦基于失联作出的错误判断，不能编造失联到期就认定死亡的条款来替自己辩护。直接说明是自己判错，当时没有死亡现场证据。'}]
  if s['id']=='c04s02':
   s['facts'].append('十二名病人早已因伊莱的交易被接纳，包含在原240人里，不是现在等玩家决定要不要救。伊莱必须承担未经同意转交授权片的责任。')
   s['responseGuards']=[{'characters':['c02'],'phrases':['你救不救他们','等你救他们','你决定救不救'],'reason':'十二名病人早已被接纳。解释伊莱过去擅自交易的责任，不把已经完成的救援说成玩家现在需要作的选择。'}]
  if s['id']=='c06s01':
   s['facts'].append('附站指三个独立的居住站，不是医疗、取暖、水泵三条功能管线。若最终选择分迁，才把桥芯不可逆加工成三套匹配器，各站实际住84人、容量90。测试不加工桥芯。4格只是测试附站用的电量，不能据此编造实际生活比其他方案多耗几格电。')
   s['responseGuards']=[{'characters':['c03'],'phrases':['医疗、取暖、水泵','医疗、取暖和水泵','四格比三格多烧','三条功能管线','三个功能回路'],'reason':'附站是三个独立居住站，分迁时每站84人，不是按医疗、取暖、水泵分成三条线。4格仅指本轮测试耗电，不能推导长期生活用电更贵。测试尚不加工或安装桥芯。'}]
  # Only unconditional opening speech is an actor anchor. Conditional lines stay attached to their selected branches.
  opening=re.split(r'【(?!开场导语)',body,maxsplit=1)[0]
  refs=[]
  for line in opening.splitlines():
   m=re.match(r'^(诺亚|伊莱|玛拉|海伦|灯塔)：(.+)$',line)
   if m:refs.append({'who':keys[m[1]],'line':m[2]})
  if s['id'] in ['c06s02','c08s01','c08s02']:refs=[] # Mutually exclusive personal/route windows are not shared openings.
  s['ref_lines']=refs
  all_dialogue=[{'who':keys[m[1]],'line':m[2]} for m in re.finditer(r'^(诺亚|伊莱|玛拉|海伦|灯塔)：(.+)$',body,re.M)]
  s['authored_dialogue']=all_dialogue;dialogue_count+=len(all_dialogue)
  opts=[];block=re.search(r'【轮到玩家[^】]*】(.*?)(?=【|\Z)',body,re.S) or re.search(r'【策略互动[^】]*】(.*?)(?=【|\Z)',body,re.S)
  if block:
   matches=list(re.finditer(r'^([ABCD]) (.+)$',block[1],re.M))
   for oi,om in enumerate(matches):
    branch=block[1][om.end():matches[oi+1].start() if oi+1<len(matches) else len(block[1])].strip();title=om[2];payload={}
    # Inline response after the choice label also belongs only to that branch.
    for nm,key in keys.items():
     found=re.findall(re.escape(nm)+r'：([^\n]+)',title+'\n'+branch)
     if found:payload[key]='玩家已选此项；用你的口吻回应这件事，保留原意：'+' / '.join(found)
    title=re.split(r'[：:]?(?:诺亚|伊莱|玛拉|海伦|灯塔)：',title,1)[0].rstrip('：:')
    if len(title)>30:title=re.split('[：:；，。]',title,maxsplit=1)[0]
    o={'t':title,'key':om[1],'effect':branch or '回应玩家选择，不替玩家追加行动。','actor_payload':payload}
    if s['id']=='c07s01':o['state']={'authoredRoute':om[1] if om[1]!='D' else 'A','delegated':om[1]=='D'}
    opts.append(o)
  if opts:s['choice']={'q':'你想怎么做？','options':opts};s['interaction']['suggestions']=[o['t'] for o in opts[:3]]
  invitation=re.search(r'【轮到玩家[^】]*】([^\n]+)',body)
  if invitation:s['interaction']['invitation']=invitation[1]
  if si==0:
   c['introduction']['text']=re.search(r'【开场导语】([^\n]+)',body)[1]
   c['introduction']['lines']=[{'who':x['who'],'say':x['line']} for x in refs[:2]]
  archive.append({'scene':s['id'],'dialogue':len(all_dialogue),'anchors':len(refs),'choices':len(opts)})
assert scene_index==16
b['relations']=[{'a':'c01','b':'c02','text':'旧外勤搭档，因诺亚封门弃人决裂。会互揭错误，也要合作；不能互相替对方洗账。'},{'a':'c03','b':'c04','text':'玛拉争居民自治，海伦维护管理控制。玩家是否恋爱不改变她们的立场。'}]
b['contentRevision']='north-light-20261111-r3';b['sourceContract']={'schema':1,'sourceFile':'scripts/north-light-v1/story-reviewed.txt','sourceSha256':hashlib.sha256(text.encode()).hexdigest(),'introSha256':hashlib.sha256(intro.encode()).hexdigest(),'introChars':len(intro),'dialogueLines':dialogue_count,'scenes':16}
b['player']['history']=text.split('玩家身份 你带着怎样的过去进来',1)[1].split('人物看点',1)[0].strip()
dump(R/f'art/official/{WID}.bible.json',b)
# Compatibility script retains actual authored dialogue and choices, never a synopsis-only shell.
old=json.loads((D/'admin-import.json').read_text());chap=[]
for c in b['chapters']:
 rows=['# CHAPTER '+str(c['n'])+'｜'+c['title']['zh']]
 if c['n']==1:
  rows+=['⟦ORIENT|bg⟧','⟦CHAR|你|f|26||供能工程师|作为自己参与故事⟧']
  for p in b['cast']:rows.append('⟦CHAR|'+p['name']['zh']+'|'+('m' if p['entity']=='system' else p['gender'])+'|'+str(p['age'] or 18)+'||'+p['role']['zh']+'|'+p['voice']+'⟧') if p.get('entity')=='system' else rows.append('⟦CHAR|'+p['name']['zh']+'|'+p['gender']+'|'+str(p['age'])+'||'+p['role']['zh']+'|'+p['voice']+'⟧')
 for s in c['scenes']:
  rows+=['# SCENE｜'+s['place']['zh'],'⟦BG|bg_'+s['id']+'⟧','旁白：'+re.search(r'【开场导语】([^\n]+)',s['beat'])[1]]
  rows += [next(n for n,k in keys.items() if k==a['who'])+'：'+a['line'] for a in s['ref_lines']]
  rows+=['⟦FREE|'+s['interaction']['invitation']+'|'+ '|'.join(s['interaction']['suggestions'])+'⟧']
 last=c['scenes'][-1];options=(last.get('choice') or {}).get('options') or [{'key':chr(65+i),'t':v,'effect':'回应你选的行动。'} for i,v in enumerate(last['interaction']['suggestions'])]
 rows+=['# CHOICE｜你想怎么做？']
 for o in options:rows+=['#### '+o['key']+'｜'+o['t'],'旁白：'+re.sub(r'\s+',' ',o['effect']).replace('插入','接入')]
 rows+=['# ·'];chap.append({'n':c['n'],'t':c['title']['zh'],'md':'\n'.join(rows).replace('插入','接入')})
old['chapters']=chap;old['config']['premise']=intro;dump(D/'admin-import.json',old)
dump(D/'fidelity.json',{'schema':1,'source':b['sourceContract'],'introMatchesReviewedSource':b['intro']['zh']==intro,'scenes':archive,'dialogueLines':dialogue_count,'characterVoiceDistinct':all(p['voice']!=p['role']['zh'] for p in b['cast'])})
leads=json.loads((R/'art/official/leads.json').read_text())
for w in leads['works']:
 if w['wid']==WID:
  for lead in w['leads']:
   p=next(p for p in b['cast'] if p['key']==lead['key']);lead['role']=p['role'];lead['looks']=bi(p['bio']);lead['vibe']=bi(p['personality']);lead['pitch']=bi(p['hooks']);lead['solo']=bi(p['sample_lines'][0])
dump(R/'art/official/leads.json',leads)
print(json.dumps({'introChars':len(intro),'scenes':scene_index,'dialogueLines':dialogue_count,'anchors':sum(x['anchors'] for x in archive)},ensure_ascii=False))
