
/* ===== mod176: M118《我必须亲手逮捕我的前男友》32 个小游戏（每章 2 个），全部是“根据证据判断”的单选题 ===== */
(function () {
  if (typeof MG_T === "undefined" || !window.MG168) return;
  const P = (id, zh, en, rule, items, ans) => ({ id, zh, en, tpl: "m111_pick", seconds: 40,
    pz: rule, pe: "Make the call the evidence actually supports. You can skip—Maya will handle it by the book.",
    ask: ["哪一项站得住？", "Which one holds up?"], items, ans });
  const games = [
    P("m118_c01_g1", "湿卡时间核验", "Rain-Soaked Pass", "对照门禁系统时间与手写登记时间，找出应优先保全的记录。", [["原始门禁导出", "The original gate-system export"], ["雨中口头传言", "Word of mouth in the rain"], ["模糊翻拍照片", "A blurry photo of a screen"]], 0),
    P("m118_c01_g2", "反光机位识别", "Impossible Reflection", "判断镜头反光是否足以单独认定人物身份。", [["直接定罪", "Convict on it directly"], ["标记异常并请求源文件", "Flag the anomaly and request the source file"], ["忽略所有影像", "Ignore all footage"]], 1),
    P("m118_c02_g1", "三只时钟", "Three Clocks", "把本地时间、服务器时间与警局日志放在可比时间线上。", [["直接按显示值排序", "Sort by the displayed values"], ["统一时区和偏差再排序", "Align time zones and drift, then sort"], ["把最早记录删掉", "Delete the earliest record"]], 1),
    P("m118_c02_g2", "旧听证索引", "The Hearing Index", "寻找与SABLE-19有关的公开听证文件，而不是私人信件。", [["公开听证编号", "The public hearing number"], ["邻居私信", "A neighbor's private message"], ["未授权访问日志", "An unauthorized access log"]], 0),
    P("m118_c03_g1", "虚构机位拼图", "The Fourth Camera", "将公开采购摄像头机位放到仓库墙面图上。", [["三台设备匹配真实安装点", "Three devices that match real install points"], ["四台设备随意拼接", "Four devices stitched together at random"], ["直接删去仓库", "Just delete the warehouse"]], 0),
    P("m118_c03_g2", "九帧不同步", "Nine Frames Early", "比较脚步声与鞋跟落地的先后，提出不超出数据的结论。", [["已证实谋杀者", "The murderer is proven"], ["音画同步存在异常", "There's an audio-video sync anomaly"], ["声音本身造假无疑", "The sound is definitely faked"]], 1),
    P("m118_c04_g1", "证词来源卡", "What Did You See?", "将证人的话分为亲眼所见、转述和推测。", [["三类分开归档", "File the three types separately"], ["全部当目击", "Treat it all as eyewitness"], ["只留最戏剧化一句", "Keep only the most dramatic line"]], 0),
    P("m118_c04_g2", "供应商交叉线索", "Supplier Trail", "通过公开地址和采购公告核对Vesper公司身份。", [["依据公开注册记录交叉查证", "Cross-check against public registration records"], ["根据匿名留言定案", "Decide based on an anonymous comment"], ["直接搜索私人邮箱", "Search a private inbox"]], 0),
    P("m118_c05_g1", "资金年度表", "The Payment Year", "把基金会捐款年度与赔偿审批年度配对。", [["将收款视为犯罪", "Treat any payment as a crime"], ["按年份对照并标明未知", "Match by year and mark the unknowns"], ["只看最大金额", "Only look at the biggest amount"]], 1),
    P("m118_c05_g2", "照片角落编码", "The Corner Code", "从原始照片边角读出与旧仓库有关的公开编号。", [["SABLE-19", "SABLE-19"], ["警员徽号", "An officer's badge number"], ["不可见的完整密码", "An invisible full password"]], 0),
    P("m118_c06_g1", "演示片缺失秒数", "Missing Disclaimer", "比对官方完整版与转发剪辑版，找出被删除的提示。", [["重建推断免责声明", "The reconstruction disclaimer"], ["演示开场音乐", "The demo's opening music"], ["人物姓名表", "The cast list"]], 0),
    P("m118_c06_g2", "钟鸣与画面", "The Bell Does Not Lie", "比对背景钟鸣与视频标注时间，判断是否存在进一步核查理由。", [["直接证明杀人", "It proves murder outright"], ["存在来源时间冲突", "There's a conflict in the source timing"], ["无需保全原文件", "No need to preserve the original file"]], 1),
    P("m118_c07_g1", "授权与保管", "Two Different Keys", "把文件保全授权与见证权分给不同的适当角色。", [["同一人全拿", "One person holds everything"], ["律师保全、独立机构见证", "Counsel preserves, an independent body witnesses"], ["记者保管原始密钥", "A reporter keeps the original keys"]], 1),
    P("m118_c07_g2", "纪要措辞核验", "The Exact Minutes", "核对最终听证纪要与草稿，确保引用符合原文。", [["引用最终签署文本", "Quote the final signed text"], ["只引用朋友圈截图", "Quote only a social media screenshot"], ["猜测Nolan内心", "Guess what Nolan was thinking"]], 0),
    P("m118_c08_g1", "证人安全路线", "The Approved Route", "从证人已同意的公共路径中选通行且不涉封闭施工的一条。", [["经关闭工地抄近道", "Cut through a closed construction site"], ["沿开放地铁换乘", "Follow the open subway transfer"], ["未经同意追踪住址", "Track her home without consent"]], 1),
    P("m118_c08_g2", "一张证词的边界", "The Witness Boundary", "只选出Iris自述亲眼经历的内容。", [["亲见的记录封存指令", "The sealing order she saw herself"], ["推测某人杀人", "A guess that someone killed"], ["媒体编写的动机", "A motive the media wrote"]], 0),
    P("m118_c09_g1", "照片不能说谎吗", "Crop and Context", "在两种裁剪中选不误导的上下文。", [["只展示两人同框", "Show only the two of them in frame"], ["展示完整场景及拍摄时间", "Show the full scene and when it was taken"], ["只展示Damien", "Show only Damien"]], 1),
    P("m118_c09_g2", "关系不是证据", "Memory vs Fact", "把私人关系回忆与案件可核验事实分开。", [["两者直接合并", "Merge them directly"], ["按私人记忆与可核验事实分栏", "Separate private memory from verifiable fact"], ["把证据丢掉", "Throw out the evidence"]], 1),
    P("m118_c10_g1", "匿名消息核验", "Anonymous Claims", "从三条互相矛盾的爆料里挑出可实地核实的那条。", [["时间地点可验证的记录", "The record with a checkable time and place"], ["只写情绪的帖文", "The post that's all emotion"], ["相互转述的猜测", "Speculation passed between people"]], 0),
    P("m118_c10_g2", "到庭清单", "Counsel and Court", "确定合法到庭需要优先完成的程序步骤。", [["先毁掉传票", "Destroy the subpoena"], ["向律师确认日期并按要求到庭", "Confirm the date with counsel and appear as required"], ["躲开记者然后不去", "Dodge the reporters and skip it"]], 1),
    P("m118_c11_g1", "钟楼双时间", "Two Independent Clocks", "将老剧院钟响与路口信号变化配成同一时间点。", [["两者均可独立核实的时间窗", "A time window both can verify independently"], ["媒体截图时间", "The time on a media screenshot"], ["Nolan自述", "Nolan's own account"]], 0),
    P("m118_c11_g2", "公文包路线", "Silver Case Route", "辨认银色公文包穿过公共街景的连续路线。", [["仅依人脸猜测", "Guess from faces alone"], ["按物件和时间顺序连线", "Connect by the object and the time order"], ["把每位路人认作Nolan", "Assume every passerby is Nolan"]], 1),
    P("m118_c12_g1", "文件与校验摘要", "Provenance Match", "正确匹配来源文件、校验摘要与独立见证记录。", [["来源—摘要—见证对应", "Source, digest and witness matched up"], ["凭文件名判相同", "Judge by the filename"], ["凭图标颜色判相同", "Judge by the icon color"]], 0),
    P("m118_c12_g2", "不是实拍", "Reconstruction Field", "从导出说明中识别唯一标注“事件重建概率”的版本。", [["被剪辑展示版本", "The edited showcase version"], ["保留reconstruction probability字段版本", "The version that keeps the reconstruction-probability field"], ["匿名媒体转发版本", "The version an anonymous outlet reposted"]], 1),
    P("m118_c13_g1", "材料找出处", "Who Owns the Source", "给听证材料逐一匹配原始出处及权限。", [["每份材料标来源与可披露范围", "Label each item's source and what can be disclosed"], ["优先惊悚标题", "Lead with the scariest headline"], ["忽略私人资料权限", "Ignore permissions on private records"]], 0),
    P("m118_c13_g2", "推测与事实", "Claims on the Record", "分清Nolan发言中的可验证主张和无法验证推断。", [["将辩解视为定罪", "Treat his defense as a conviction"], ["按证据来源分类", "Sort by evidence source"], ["谁声音大谁赢", "Whoever's loudest wins"]], 1),
    P("m118_c14_g1", "证词三色标注", "Three Kinds of Truth", "将亲历、收到的邮件与个人推测标为三类。", [["三类分别标示", "Mark the three kinds separately"], ["全部归为亲历", "Call it all firsthand"], ["仅保留推断", "Keep only the guesses"]], 0),
    P("m118_c14_g2", "谁能公开什么", "Consent to Disclose", "按Iris明确授权的公开范围处理她的资料。", [["媒体可随意公开住址", "The media can publish her address"], ["只公开她书面同意的段落", "Publish only the passages she agreed to in writing"], ["必须全部上网", "Put everything online"]], 1),
    P("m118_c15_g1", "程序先于头条", "First Preserve, Then Publish", "安排证据保全、见证人许可和新闻发布的先后。", [["先发布未经核对的证词", "Publish the unchecked testimony first"], ["先保全并征求许可、后公开核实部分", "Preserve and ask permission first, then publish what's verified"], ["完全毁掉文件", "Destroy the files"]], 1),
    P("m118_c15_g2", "两条罪责链", "Two Different Cases", "将“推断误标”与“实际凶案”的证据各自归类。", [["一条假视频足以证明杀人", "One fake video proves murder"], ["两条罪责链各有独立证据", "Each chain of guilt has its own evidence"], ["所有嫌疑人自动无罪", "Every suspect is automatically innocent"]], 1),
    P("m118_c16_g1", "手表和今天", "Watch the Memory", "将三段回忆按发生顺序排列，并标注今天的感受可以不同。", [["旧日约会—离别—现在", "Old date, the goodbye, now"], ["离别—约会—现在", "The goodbye, old date, now"], ["现在—约会—离别", "Now, old date, the goodbye"]], 0),
    P("m118_c16_g2", "未来不是判决", "Tomorrow's Terms", "把关系或个人生活计划与边界条件匹配。", [["先征求双方同意并约定可修改", "Both agree first, and it can be revised"], ["要求对方永久承诺", "Demand a permanent promise"], ["用案件结果换恋爱", "Trade the case outcome for romance"]], 0)
  ];
  MG168.reg(games);
  window.M118G = games;
})();
