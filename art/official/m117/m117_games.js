
/* ===== mod175: M117《纽约最后一家吸血鬼急诊室》32 个小游戏（每章 2 个），全部是“根据现场资料判断”的单选题 ===== */
(function () {
  if (typeof MG_T === "undefined" || !window.MG168) return;
  const P = (id, zh, en, items, ans) => ({ id, zh, en, tpl: "m111_pick", seconds: 40,
    pz: "根据眼前的资料做出判断。可以跳过，由在场的人补做核验。", pe: "Make a call based on what's in front of you. You can skip—someone on shift will double-check.",
    ask: ["哪一项判断站得住？", "Which call holds up?"], items, ans });
  const games = [
    P("m117_c01_g1", "腕带的时间裂缝", "Timestamp Rift", [["22:17与00:17来自同一日期", "22:17 and 00:17 are from the same date"], ["00:17已经出院", "He was already discharged at 00:17"], ["暂不能确定到院时间", "His arrival time can't be confirmed yet"]], 2),
    P("m117_c01_g2", "七号病房封条", "Seal of Room Seven", [["新贴封条覆盖旧铆钉", "A new seal covers the old rivets"], ["旧封条没有折痕", "The old seal has no creases"], ["只要旧就是真", "If it's old, it must be real"]], 0),
    P("m117_c02_g1", "拒收单上的同一枚章", "The Duplicate Stamp", [["A与B有相同破角", "A and B share the same chipped corner"], ["B与C只颜色相同", "B and C only share a color"], ["三份全部相同", "All three are identical"]], 0),
    P("m117_c02_g2", "捐献说明的缺失行", "Consent Form Gap", [["先解释代价再邀请决定", "Explain the cost first, then invite a decision"], ["先签字后解释", "Sign first, explain later"], ["沉默算同意", "Silence counts as consent"]], 0),
    P("m117_c03_g1", "缺页的编号", "Missing Folio", [["第12页到第14页", "Pages 12 to 14"], ["第14页到第15页", "Pages 14 to 15"], ["第8页到第9页", "Pages 8 to 9"]], 0),
    P("m117_c03_g2", "隐私黑条", "Redact the Record", [["遮住姓名与住址保留异常日期", "Black out the name and address, keep the odd dates"], ["遮住日期保留全名", "Black out the dates, keep the full name"], ["整份完整公开", "Release the whole file as is"]], 0),
    P("m117_c04_g1", "黎明前的路线", "Before Sunrise Route", [["地下通道B并复核封闭情况", "Tunnel B, after checking it's still sealed"], ["玻璃桥A最快", "Glass bridge A, the fastest"], ["临时穿过广场", "Cut across the plaza"]], 0),
    P("m117_c04_g2", "三短一长", "Three Short, One Long", [["短短短长", "Short-short-short-long"], ["短长短短", "Short-long-short-short"], ["长长短短", "Long-long-short-short"]], 0),
    P("m117_c05_g1", "两份死亡证明", "The Two Certificates", [["草签版缺公证编号", "The initialed copy has no notary number"], ["两份都必然真", "Both must be genuine"], ["年代较新一定合法", "The newer one must be legal"]], 0),
    P("m117_c05_g2", "出院计划顺序", "Discharge Independence", [["医护评估后患者自主决定住所", "After a medical review, the patient chooses where to live"], ["有喜欢的人就出院", "Discharge him once he likes someone"], ["先安排相亲再问患者", "Set up a date first, ask the patient later"]], 0),
    P("m117_c06_g1", "药价断点", "The Price Spike", [["医院被拒供那晚突然涨价", "Prices spiked the night the hospital was cut off"], ["全周价格不变", "Prices stayed flat all week"], ["药房免费", "The pharmacy is free"]], 0),
    P("m117_c06_g2", "记忆契约的边界", "Memory Contract", [["捐献前可以撤回", "You can withdraw before donating"], ["术后要求撤回已消耗部分", "You can reclaim what's already been used after the procedure"], ["家属可代签一切", "Family can sign anything on your behalf"]], 0),
    P("m117_c07_g1", "未来日期搜查令", "Tomorrow's Warrant", [["落款晚于申请发生", "It's dated after the request was even made"], ["所有日期完全一致", "All the dates match exactly"], ["签发当天在过去", "It was issued on a day in the past"]], 0),
    P("m117_c07_g2", "匿名宣誓", "Protected Testimony", [["仅使用匿名编号与本人批准事实", "Use only an anonymous number and facts he approved"], ["公开真实地址", "Publish his real address"], ["公开全部病历", "Publish his whole medical file"]], 0),
    P("m117_c08_g1", "两种可能的录像", "Two Possible Futures", [["两段都只是预测候选", "Both clips are only predicted possibilities"], ["选开心的那段为事实", "Treat the happy one as fact"], ["选悲伤的那段为事实", "Treat the sad one as fact"]], 0),
    P("m117_c08_g2", "真实患者优先", "Reality Before Probability", [["采集真实评估信息交专业医护", "Gather a real assessment and hand it to the medical staff"], ["直接按钟的分数拒收", "Turn patients away by the bell's score"], ["按贵族家族排名", "Rank patients by noble family"]], 0),
    P("m117_c09_g1", "裁掉的真相", "The Cropped Frame", [["原图右侧有救护车", "The original shows an ambulance on the right"], ["裁图显示全景", "The cropped version shows the full scene"], ["裁图时间比原图早一天", "The cropped version is dated a day earlier"]], 0),
    P("m117_c09_g2", "公开信里的名字", "Names on the Letter", [["本人可选择署名其他人匿名", "Each person chooses to sign; everyone else stays anonymous"], ["所有人必须署名", "Everyone must sign"], ["负责人统一代签", "The person in charge signs for everyone"]], 0),
    P("m117_c10_g1", "备用电池标签", "Battery Label Swap", [["冷却柜标签与照明柜被交换", "The cooler label was swapped with the lighting cabinet's"], ["全部标签正确", "Every label is correct"], ["只有颜色不同无影响", "Only the colors differ, so it doesn't matter"]], 0),
    P("m117_c10_g2", "地下敲击码", "Tunnel Knock", [["短短短长", "Short-short-short-long"], ["短短长长", "Short-short-long-long"], ["长短长短", "Long-short-long-short"]], 0),
    P("m117_c11_g1", "试点印章的变更", "The Changed Seal", [["旧章授权研究新章扩展筛选", "The old seal approved research; the new one widened screening"], ["两章必然相同", "The two seals must be the same"], ["所有文件都没有签署", "None of the documents were signed"]], 0),
    P("m117_c11_g2", "道歉不是免罪卡", "Repair Is Action", [["公开承认并接受外部监督", "Admit it publicly and accept outside oversight"], ["说对不起就恢复信任", "Saying sorry restores trust"], ["用礼物换玩家原谅", "Trade gifts for the player's forgiveness"]], 0),
    P("m117_c12_g1", "证人期限", "Expired Protection", [["保护授权三年前已到期", "His protection expired three years ago"], ["期限永不过期", "The protection never expires"], ["只有口头授权", "It was only a verbal authorization"]], 0),
    P("m117_c12_g2", "属于Lucian的证词", "His Own Testimony", [["公开本人经历遮住其他患者信息", "Share his own story, hide other patients' details"], ["公开所有保护者姓名", "Publish every protector's name"], ["禁止Lucian自主决定", "Don't let Lucian decide for himself"]], 0),
    P("m117_c13_g1", "资金拆分", "Split the Funding", [["三笔小额来自一笔被拆拨款", "Three small payments split from one grant"], ["三笔全部是患者捐献", "All three are patient donations"], ["收据完全无法核对", "The receipts can't be checked at all"]], 0),
    P("m117_c13_g2", "没有面孔的抗议", "Anonymous Assembly", [["只拍无字纸板与远景", "Only shoot blank signs and wide shots"], ["近拍患者病历", "Close-ups of patients' records"], ["公开所有人住址", "Publish everyone's address"]], 0),
    P("m117_c14_g1", "未来画面接错线", "Crossed Signal", [["预测端口接入历史回放", "The prediction port is plugged into the history replay"], ["历史回放只接历史", "The history replay only carries history"], ["预测与历史相同", "Prediction and history are the same"]], 0),
    P("m117_c14_g2", "匿名冻结凭证", "Protected Archive", [["冻结删除并只记匿名证明", "Freeze deletion and keep only anonymous proof"], ["导出完整姓名上网", "Export the full names online"], ["彻底删除全部数据", "Delete all the data for good"]], 0),
    P("m117_c15_g1", "证据的三层", "Three Levels of Evidence", [["核验日志属于事实栏", "Verified logs go in the Facts column"], ["推测属于事实栏", "Guesses go in the Facts column"], ["预测属于已发生栏", "Predictions go in the Already Happened column"]], 0),
    P("m117_c15_g2", "改变规则的提案", "Write a Fair Rule", [["先公开理由再听取申诉最后复核", "Publish the reasons, hear appeals, then review"], ["先删名单再通知", "Delete the list first, notify later"], ["由一人永久决定", "One person decides forever"]], 0),
    P("m117_c16_g1", "新的夜班预算", "Next Shift Budget", [["同时保留人工复核与社区补充渠道", "Keep both human review and a community channel"], ["所有预算只买钟的预测", "Spend the whole budget on the bell's predictions"], ["取消患者监督", "Cancel patient oversight"]], 0),
    P("m117_c16_g2", "下一次夜班的约定", "The Next Shift", [["邀请明确自愿且不绑定医院服务", "An invitation that's clearly voluntary and never tied to hospital care"], ["亲密换医疗资源", "Intimacy in exchange for medical resources"], ["不回应就失去全部帮助", "No answer means losing all help"]], 0)
  ];
  MG168.reg(games);
  window.M117G = games;
})();
