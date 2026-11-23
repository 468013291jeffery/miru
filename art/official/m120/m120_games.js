
/* ===== mod178: M120《她毁了我的首秀》24 个小游戏（每章 2 个），复用 m111_pick 单选模板 ===== */
(function () {
  if (typeof MG_T === "undefined" || !window.MG168) return;
  const P = (id, zh, en, rule, items, ans) => ({ id, zh, en, tpl: "m111_pick", seconds: 35,
    pz: rule, pe: "Pick the one that's actually right. You can skip—the story keeps going either way.",
    ask: ["哪一个是对的？", "Which one is right?"], items, ans });
  const games = [
    P("m120_g01", "救回第一针", "Save the First Stitch", "袖边裂开了。怎样才能把它救回来？", [["先缝再说，纹路对不对无所谓", "Just sew it—the grain doesn't matter"], ["把两边线纹对齐，再用定位针固定", "Line up both sides of the grain, then pin it"], ["用胶带先粘住", "Tape it shut for now"]], 1),
    P("m120_g02", "9F痕迹", "The 9F Mark", "比对现场照片，哪两张的编号真正一致？", [["9F原现场 ↔ 6F模糊照", "9F scene photo ↔ blurry 6F photo"], ["9F原现场 ↔ 9F近景", "9F scene photo ↔ 9F close-up"], ["6F模糊照 ↔ 9F近景", "Blurry 6F photo ↔ 9F close-up"]], 1),
    P("m120_g03", "领口三点", "Three Collar Points", "领口的三个定位点，正确顺序是？", [["左肩 → 锁骨 → 右肩", "Left shoulder → collarbone → right shoulder"], ["锁骨 → 左肩 → 右肩", "Collarbone → left shoulder → right shoulder"], ["右肩 → 左肩 → 锁骨", "Right shoulder → left shoulder → collarbone"]], 0),
    P("m120_g04", "收据上的日期", "The Receipt Date", "按日期整理品牌的第一笔成交，正确顺序是？", [["成交收据 → 付款回执 → 展会纪念卡", "Sales receipt → payment slip → expo card"], ["付款回执 → 展会纪念卡 → 成交收据", "Payment slip → expo card → sales receipt"], ["展会纪念卡 → 成交收据 → 付款回执", "Expo card → sales receipt → payment slip"]], 2),
    P("m120_g05", "不该签的条款", "Find the Clause", "合同里哪一条允许未经授权拍你的私人感情？", [["赛事公平条款", "The fair-competition clause"], ["摄影公开条款", "The photo-publicity clause"], ["私人生活授权条款", "The private-life release clause"]], 2),
    P("m120_g06", "被遮住的照片", "The Hidden Print", "哪一张照片可以公开展出？", [["授权工作照", "The authorized work photo"], ["未授权的私人照", "The unauthorized private photo"], ["已提出撤展的作品", "The piece you asked to withdraw"]], 0),
    P("m120_g07", "完整采访", "The Full Statement", "把采访录音按真实顺序排好：", [["Sloane回应 → 记者提问 → 会后承认", "Sloane answers → reporter asks → later admission"], ["记者提问 → Sloane回应 → 会后承认", "Reporter asks → Sloane answers → later admission"], ["会后承认 → 记者提问 → Sloane回应", "Later admission → reporter asks → Sloane answers"]], 1),
    P("m120_g08", "上传源头", "Track the Upload", "比对两张图的上传记录，能下的结论是？", [["两张图哈希相同，泄露者就是官方", "Same hash—the leak came from the official team"], ["两张图哈希不同，来源尚未证实", "Different hashes—the source isn't proven yet"], ["Evelyn一定是泄露者", "Evelyn must be the leaker"]], 1),
    P("m120_g09", "删掉那一格", "Cancel the Shot", "拍摄日程里，哪一个机位必须移出？", [["公开走秀镜头", "The public runway shot"], ["服装细节镜头", "The garment detail shot"], ["未经同意的旧情侣镜头", "The ex-couple shot nobody agreed to"]], 2),
    P("m120_g10", "夜风里的别针", "The Safety Pin", "风一吹，哪个东西可能勾住栏杆？", [["袖口纽扣", "The cuff button"], ["松脱的别针", "The loose pin"], ["披肩流苏", "The shawl fringe"]], 1),
    P("m120_g11", "暗房的遮幅", "Protect the Worker", "照片里有一位没授权的工人。遮光板该盖住哪里？", [["照片主体", "The main subject"], ["工人的姓名牌", "The worker's name tag"], ["整张照片", "The whole photo"]], 1),
    P("m120_g12", "报告的两个日期", "Two Report Dates", "核对安全报告，哪个说法站得住？", [["检测日期早于封存日期，批次可追溯", "Testing came before sealing, and the lot is traceable"], ["封存日期早于检测，所以报告是假的", "Sealing came first, so the report is fake"], ["摘要已经足以定最终责任", "The summary is enough to assign final blame"]], 0),
    P("m120_g13", "证言顺序", "Witness Timeline", "把三份记录按真实时间排好：", [["停秀通知 → 值班记录 → 9F异常报告", "Shutdown notice → shift log → 9F report"], ["9F异常报告 → 停秀通知 → 值班记录", "9F report → shutdown notice → shift log"], ["值班记录 → 9F异常报告 → 停秀通知", "Shift log → 9F report → shutdown notice"]], 2),
    P("m120_g14", "寄不出的信", "Unsent Letter", "Sloane沉默了多久？按时间排好：", [["首秀取消 → 媒体归责 → 未寄出的信", "Show cancelled → media blames you → unsent letter"], ["未寄出的信 → 首秀取消 → 媒体归责", "Unsent letter → show cancelled → media blames you"], ["媒体归责 → 未寄出的信 → 首秀取消", "Media blames you → unsent letter → show cancelled"]], 0),
    P("m120_g15", "小灯下的针", "Needle in the Dark", "停电了，银针掉在桌脚附近。怎么找最稳？", [["用手在地上摸", "Feel around on the floor by hand"], ["把手电光束照到桌脚，找到后放回针盒", "Aim the flashlight at the table leg, then put it back in the box"], ["等来电再说", "Wait for the power to come back"]], 1),
    P("m120_g16", "照片使用许可", "Photo Consent Check", "三类照片该怎么处理？", [["全部可以展出", "All of them can be shown"], ["授权照可展出，私人底片私存，撤展作品移除", "Authorized photos shown, private negatives kept, withdrawn pieces removed"], ["只要好看就可以展出", "Show whatever looks best"]], 1),
    P("m120_g17", "底片元数据", "Negative Metadata", "比对时间码，哪个结论是对的？", [["媒体截图的时间码和登记一致", "The media screenshot matches the registry"], ["原始时间码和授权登记一致，媒体截图不一致", "The original timecode matches the registry; the screenshot doesn't"], ["三者都对不上，无法判断", "Nothing matches; can't tell"]], 1),
    P("m120_g18", "原话在哪里", "Restore the Quote", "把短剪版和原始问答对齐，被删掉的是？", [["记者的提问", "The reporter's question"], ["Sloane的完整答复", "Sloane's full answer"], ["片头字幕", "The opening titles"]], 1),
    P("m120_g19", "两份互不交换的合同", "Separate Agreements", "摄影许可、工作指导、私人邀约，该怎么签？", [["三项写进同一份合同", "Put all three in one contract"], ["前两项进专业合同，私人邀约另外处理", "The first two go in the work contract; the invitation stays separate"], ["先答应约会，再谈合同", "Agree to the date first, then the contract"]], 1),
    P("m120_g20", "安全走台线", "Safe Runway Path", "裙摆和移动灯架之间，怎么排才安全？", [["裙摆不越过灯架的安全线", "Keep the hem behind the rig's safety line"], ["让模特自己躲开灯架", "Let the model dodge the rig"], ["关掉灯架就不用管距离", "Turn off the rig and ignore the spacing"]], 0),
    P("m120_g21", "最后一针", "The Final Stitch", "修补压轴裙摆的正确顺序：", [["剪线 → 固定 → 走针", "Trim → secure → stitch"], ["固定布边 → 加固走针 → 剪断线头", "Secure the edge → reinforce the stitch → trim the thread"], ["走针 → 剪线 → 固定", "Stitch → trim → secure"]], 1),
    P("m120_g22", "只签事实", "Sign the Facts", "责任声明里，哪一项还不能当事实写？", [["安全叫停的记录", "The safety shutdown record"], ["错误归责的报道", "The reports that wrongly blamed you"], ["谁指使泄露的猜测", "Guesses about who ordered the leak"]], 2),
    P("m120_g23", "属于你的版权", "Your Rights", "新订单、展示许可和摄影授权签完，核心设计版权归谁？", [["归工作室；另外两项只限定使用范围", "Your studio; the other two only grant limited use"], ["归下单的客户", "The client who placed the order"], ["归摄影师", "The photographer"]], 0),
    P("m120_g24", "下一个星期六", "Next Saturday", "安排下周的日程，正确顺序是？", [["个人时间 → 客户交付 → 团队休息", "Personal time → client delivery → crew rest"], ["客户交付 → 团队休息 → 个人时间", "Client delivery → crew rest → personal time"], ["团队休息 → 个人时间 → 客户交付", "Crew rest → personal time → client delivery"]], 1)
  ];
  MG168.reg(games);
  window.M120G = games;
})();
