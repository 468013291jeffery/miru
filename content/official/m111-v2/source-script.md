# CHAPTER 1｜THE NIGHT I DIED AGAIN
⟦GOAL|确认重生与银色印记的真实性，并决定第一位调查对象|Confirm the reset and investigate the first witness⟧
⟦DONE|flag|c01clue_seen|找到关键线索|旁白：关键的痕迹已经出现，你可以继续追问来源。⟧
⟦DONE|say|确认七日前重生、调查死亡警告或找到能核验的人|说出你的打算|旁白：线索已经摆在眼前，在场的人等你说出判断。⟧
# SCENE｜天台坠落
⟦BG|bg_c01s01|天台坠落·Lucien在场，面向玩家，动作对应剧情⟧
⟦TIME|23:50⟧
旁白：午夜，曼哈顿天台。
旁白：暴雨沿着栏杆往下流。
旁白：你手心有一道新伤，身后有人正逼近。
Masked Figure："The hundredth time changes nothing."
Lucien："No—look at me. Hold on to my voice!"
⟦FREE⟧
旁白：关于「天台坠落」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜七日前重生
⟦BG|bg_c01s02|七日前重生·玩家独处，无其他角色⟧
⟦TIME|09:20⟧
旁白：你从豪华公寓的床上猛地坐起，手机显示11月7日。
旁白：天台的雨仍在耳边，但窗外是晴朗早晨。
旁白：手腕上出现一枚像时钟断针的银色印记。
Card："Do not trust the man who remembers you."
⟦SET|c01clue_seen⟧
# CHOICE｜相信谁
#### A｜Trust Lucien
旁白：你提出先听Lucien解释，但要求他把时间、地点和证物写下来。
⟦OPT|A|set:c01approach_a;love:2⟧
#### B｜Get an independent test
旁白：你预约Rowan的诊疗，在不向陌生人暴露身份的前提下检查印记。
⟦OPT|B|set:c01approach_b;love:1⟧
#### C｜Walk away and investigate
旁白：你暂时拒绝立即跟随陌生人，先在公共档案中核对博物馆的历史。
⟦OPT|C|set:c01approach_c;love:0⟧
# ·
旁白：关于「七日前重生」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜第一次遇见亲王
⟦BG|bg_c01s03|第一次遇见亲王·Lucien在场，面向玩家，动作对应剧情⟧
⟦TIME|16:30⟧
⟦IF|c01approach_a⟧
旁白：先前的信任使对方主动提供更完整的记录。
⟦/IF⟧
⟦IF|c01approach_b⟧
旁白：你独立核验的要求，让证物被妥善留存。
⟦/IF⟧
⟦IF|c01approach_c⟧
旁白：你更谨慎的安排让另一名证人加入调查。
⟦/IF⟧
旁白：博物馆慈善预展上，你撞见一个黑衣男人。
旁白：他捧着酒杯，却没有喝。
旁白：看到你时，他猛地停住，像见到奇迹，又像再次经历丧失。
Lucien："You’re alive."
Lucien："Not in this life. Not yet."
Lucien："Please, stay away from the rooftop on Friday."
⟦FREE⟧
旁白：关于「第一次遇见亲王」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜一百次之谜
⟦BG|bg_c01s04|一百次之谜·Lucien在场，面向玩家，动作对应剧情⟧
⟦TIME|22:45⟧
旁白：你在空展厅看见九十九张跨越四世纪的肖像。
旁白：画中女子每一张都有你的眼睛。
旁白：最末一格空白。
Lucien："I have watched you die ninety-nine times."
Lucien："Because this is the first time you remembered dying."
Lucien："I used to mistake protecting you for owning the answer. I won’t do that again."
# CHOICE｜肖像如何处理
#### A｜Ask about the happiest life
旁白：Lucien翻开旧相册，指向一场雨中的巴黎舞会。
⟦OPT|A|set:c01route_a;love:2⟧
#### B｜Demand the death records
旁白：你索取每一世的日期、死因和记录来源。Lucien将文件交给你。
⟦OPT|B|set:c01route_b;love:1⟧
#### C｜Photograph the empty frame
旁白：你拍下空白画像的钉孔，发现背面刻有不属于任何世代的印章。
⟦OPT|C|set:c01route_c;love:0⟧
# ·
旁白：手中的线索还缺最后一环，下一步必须由你决定。


# CHAPTER 2｜THE MAN WITH NINETY-NINE GRAVES
⟦GOAL|辨认墓碑和录音来源，决定让谁核实记忆|Verify graves and the voice recording⟧
⟦DONE|flag|c02clue_seen|找到关键线索|旁白：关键的痕迹已经出现，你可以继续追问来源。⟧
⟦DONE|say|核对墓碑名字、录音身份或医院的梦境|说出你的打算|旁白：线索已经摆在眼前，在场的人等你说出判断。⟧
# SCENE｜地下纪念室
⟦BG|bg_c02s01|地下纪念室·Lucien在场，面向玩家，动作对应剧情⟧
⟦TIME|23:50⟧
⟦IF|c01route_a⟧
旁白：你沿着上一章主动确认的线索推进调查。
⟦/IF⟧
⟦IF|c01route_b⟧
旁白：上一章留存的证物现在可以逐项核验。
⟦/IF⟧
⟦IF|c01route_c⟧
旁白：上一章取得的第三方线索引来新的证人。
⟦/IF⟧
旁白：Lucien带你到旧教堂地下。
旁白：每块石碑都刻着不同年代和你的曾用名字：Amelia、June、Etta。
旁白：墙角放着今年刚买的白玫瑰。
Lucien："I kept a place for every life, even the ones where you hated me."
Lucien："Sometimes. Never because I asked you to."
⟦FREE⟧
旁白：关于「地下纪念室」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜上一世的录音
⟦BG|bg_c02s02|上一世的录音·Lucien在场，面向玩家，动作对应剧情⟧
⟦TIME|09:20⟧
旁白：你按下留声机播放键。
旁白：陌生女声说她自愿把一段记忆交给未来的自己，警告不要把永恒当作爱的证据。
旁白：Lucien皱眉，他从未听过这段录音。
Recording："He can remember you and still misunderstand you."
Lucien："That was your voice. I never heard this before."
⟦SET|c02clue_seen⟧
# CHOICE｜地下室的回应
#### A｜Hear Lucien’s account
旁白：Lucien把旧誓言收起，将这一世的决定权留给你。他主动交出一条可独立核验的线索。
⟦OPT|A|set:c02approach_a;love:2⟧
#### B｜Read every grave alone
旁白：你暂时拒绝以过去的誓言交换此刻的决定权。对方虽失望，却必须让开道路。
⟦OPT|B|set:c02approach_b;love:1⟧
#### C｜Bring Rowan to verify
旁白：你优先保障人的生命与可核实的事实。Rowan按你的要求建立救援清单，记录失踪者姓名与最后位置。
⟦OPT|C|set:c02approach_c;love:0⟧
# ·
旁白：关于「上一世的录音」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜医生的梦
⟦BG|bg_c02s03|医生的梦·Lucien、Rowan在场，面向玩家，动作对应剧情⟧
⟦TIME|16:30⟧
⟦IF|c02approach_a⟧
旁白：先前的信任使对方主动提供更完整的记录。
⟦/IF⟧
⟦IF|c02approach_b⟧
旁白：你独立核验的要求，让证物被妥善留存。
⟦/IF⟧
⟦IF|c02approach_c⟧
旁白：你更谨慎的安排让另一名证人加入调查。
⟦/IF⟧
旁白：Rowan在急诊诊室替你处理手腕异常发热。
旁白：他突然说出你梦里的天台场景，甚至准确描述Lucien的一只裂纹戒指。
Rowan："I keep dreaming you fall. Then I wake up with blood on my hands."
Rowan："Ninety-seven is the number I hear. I don’t know why."
⟦FREE⟧
旁白：关于「医生的梦」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜两种保护
⟦BG|bg_c02s04|两种保护·Lucien、Rowan在场，面向玩家，动作对应剧情⟧
⟦TIME|22:45⟧
旁白：Lucien出现在医院，说Rowan的梦可能是轮回污染。
旁白：Rowan反驳，要求先检查你是否受伤。
旁白：两个男人第一次正面交锋，你拒绝让他们代你做决定。
Lucien："She’s in danger."
Rowan："Then let her decide who she trusts."
Lucien："You stole a bicycle in Paris. You insisted I ride on the back. We fell into a fountain."
# CHOICE｜医院的安排
#### A｜Let Rowan examine the mark
旁白：你优先保障人的生命与可核实的事实。Rowan按你的要求建立救援清单，记录失踪者姓名与最后位置。
⟦OPT|A|set:c02route_a;love:2⟧
#### B｜Ask Lucien for protection
旁白：Lucien把旧誓言收起，将这一世的决定权留给你。他主动交出一条可独立核验的线索。
⟦OPT|B|set:c02route_b;love:1⟧
#### C｜Request both leave the room
旁白：你作出这一选择后，眼前人物给出实际回应；新的线索或关系记忆被写入当前周目，后续场景需继续引用。
⟦OPT|C|set:c02route_c;love:0⟧
# ·
旁白：手中的线索还缺最后一环，下一步必须由你决定。


# CHAPTER 3｜A KISS FROM ANOTHER LIFE
⟦GOAL|找到1931年的誓言原件，决定如何处理旧世关系|Find the original vow⟧
⟦DONE|flag|c03clue_seen|找到关键线索|旁白：关键的痕迹已经出现，你可以继续追问来源。⟧
⟦DONE|say|追问1931年的证据或界定今生的亲密距离|说出你的打算|旁白：线索已经摆在眼前，在场的人等你说出判断。⟧
# SCENE｜午夜车站
⟦BG|bg_c03s01|午夜车站·Lucien在场，面向玩家，动作对应剧情⟧
⟦TIME|23:50⟧
⟦IF|c02route_a⟧
旁白：你沿着上一章主动确认的线索推进调查。
⟦/IF⟧
⟦IF|c02route_b⟧
旁白：上一章留存的证物现在可以逐项核验。
⟦/IF⟧
⟦IF|c02route_c⟧
旁白：上一章取得的第三方线索引来新的证人。
⟦/IF⟧
旁白：你循着印记来到废弃地铁站，看到墙壁上刻着某一世你的手写字：“不要相信预言，只相信选择”。
旁白：一辆不存在于时刻表的列车驶来。
Lucien："I died here once trying to save you."
Lucien："For twenty-one minutes."
⟦FREE⟧
旁白：关于「午夜车站」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜不可伪造的记忆
⟦BG|bg_c03s02|不可伪造的记忆·Lucien在场，面向玩家，动作对应剧情⟧
⟦TIME|09:20⟧
旁白：列车玻璃映出1931年的夜晚：你穿着红裙，Lucien为你挡下一枚银弹；下一秒你主动吻
旁白：他，说“这一次不要替我决定”。
旁白：现在的Lucien不敢触碰你。
Lucien："I remember the kiss. I remember what you said afterward."
⟦SET|c03clue_seen⟧
# CHOICE｜前世亲密记忆
#### A｜Accept the memory as evidence
旁白：你先保全证据、标注时间戳和来源，拒绝仅凭任何人的私人记忆做出不可逆决定。
⟦OPT|A|set:c03approach_a;love:2⟧
#### B｜Keep emotional distance
旁白：你作出这一选择后，眼前人物给出实际回应；新的线索或关系记忆被写入当前周目，后续场景需继续引用。
⟦OPT|B|set:c03approach_b;love:1⟧
#### C｜Ask what you chose afterward
旁白：你作出这一选择后，眼前人物给出实际回应；新的线索或关系记忆被写入当前周目，后续场景需继续引用。
⟦OPT|C|set:c03approach_c;love:0⟧
# ·
旁白：关于「不可伪造的记忆」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜第一条誓言
⟦BG|bg_c03s03|第一条誓言·Mara在场，面向玩家，动作对应剧情⟧
⟦TIME|16:30⟧
⟦IF|c03approach_a⟧
旁白：先前的信任使对方主动提供更完整的记录。
⟦/IF⟧
⟦IF|c03approach_b⟧
旁白：你独立核验的要求，让证物被妥善留存。
⟦/IF⟧
⟦IF|c03approach_c⟧
旁白：你更谨慎的安排让另一名证人加入调查。
⟦/IF⟧
旁白：你在档案馆找到一份1894年的双方契约：每一世你都必须在第七日午夜前主动选择是否启用记
旁白：忆；任何人不可用爱情代替同意。
旁白：契约的最后一页被撕走。
Mara："Consent was written into the first pact."
Mara："Someone who feared what you would choose."
⟦FREE⟧
旁白：关于「第一条誓言」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜选择亲近还是距离
⟦BG|bg_c03s04|选择亲近还是距离·Lucien在场，面向玩家，动作对应剧情⟧
⟦TIME|22:45⟧
旁白：雨后的河边，Lucien问你愿不愿意听他讲一次快乐的前世。
旁白：他不要求触碰，也不假装此刻的你就是过去的你。
Lucien："May I tell you about the year we were happy?"
Lucien："That is fair."
Lucien："She loved me. I have no right to assume you do."
# CHOICE｜档案末页
#### A｜Protect the contract copy
旁白：你作出这一选择后，眼前人物给出实际回应；新的线索或关系记忆被写入当前周目，后续场景需继续引用。
⟦OPT|A|set:c03route_a;love:2⟧
#### B｜Confront Lucien
旁白：Lucien把旧誓言收起，将这一世的决定权留给你。他主动交出一条可独立核验的线索。
⟦OPT|B|set:c03route_b;love:1⟧
#### C｜Ask Mara to certify it
旁白：你作出这一选择后，眼前人物给出实际回应；新的线索或关系记忆被写入当前周目，后续场景需继续引用。
⟦OPT|C|set:c03route_c;love:0⟧
# ·
旁白：手中的线索还缺最后一环，下一步必须由你决定。


# CHAPTER 4｜THE HUNTER WHO KILLED ME
⟦GOAL|破解被篡改的猎杀令，决定是否与猎人合作|Examine the altered hunting order⟧
⟦DONE|flag|c04clue_seen|找到关键线索|旁白：关键的痕迹已经出现，你可以继续追问来源。⟧
⟦DONE|say|查验猎杀令、追问Cassian的责任或提出合作条件|说出你的打算|旁白：线索已经摆在眼前，在场的人等你说出判断。⟧
# SCENE｜猎人之刃
⟦BG|bg_c04s01|猎人之刃·Cassian在场，面向玩家，动作对应剧情⟧
⟦TIME|23:50⟧
⟦IF|c03route_a⟧
旁白：你沿着上一章主动确认的线索推进调查。
⟦/IF⟧
⟦IF|c03route_b⟧
旁白：上一章留存的证物现在可以逐项核验。
⟦/IF⟧
⟦IF|c03route_c⟧
旁白：上一章取得的第三方线索引来新的证人。
⟦/IF⟧
旁白：Cassian在博物馆地下停车场拦住你，手里有一把刻着你名字的银刃。
旁白：他说出第76次轮回的死亡细节，随后主动把刀放在地上。
Cassian："I was sent to kill you. I won’t pretend otherwise."
Cassian："Tonight I came to warn you."
⟦FREE⟧
旁白：关于「猎人之刃」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜被篡改的猎杀令
⟦BG|bg_c04s02|被篡改的猎杀令·Cassian在场，面向玩家，动作对应剧情⟧
⟦TIME|09:20⟧
旁白：你与Cassian潜入骑士团档案厅，发现第76次的刺杀令在发出后被修改：原目标是“寄生
旁白：在宿主体内的无名者”，而非宿主本人。
旁白：Cassian承认自己可能误判。
Cassian："I remember blood on my hands. I don’t remember a face."
⟦SET|c04clue_seen⟧
# CHOICE｜猎人的警告
#### A｜Hear Cassian out
旁白：你要求Cassian提交原始命令和来源，不准未经核验采取行动。他把武器收好，接受协作安排。
⟦OPT|A|set:c04approach_a;love:2⟧
#### B｜Have him surrender his weapon
旁白：你作出这一选择后，眼前人物给出实际回应；新的线索或关系记忆被写入当前周目，后续场景需继续引用。
⟦OPT|B|set:c04approach_b;love:1⟧
#### C｜Call Lucien as witness
旁白：Lucien把旧誓言收起，将这一世的决定权留给你。他主动交出一条可独立核验的线索。
⟦OPT|C|set:c04approach_c;love:0⟧
# ·
旁白：关于「被篡改的猎杀令」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜三人同场
⟦BG|bg_c04s03|三人同场·Lucien、Cassian在场，面向玩家，动作对应剧情⟧
⟦TIME|16:30⟧
⟦IF|c04approach_a⟧
旁白：先前的信任使对方主动提供更完整的记录。
⟦/IF⟧
⟦IF|c04approach_b⟧
旁白：你独立核验的要求，让证物被妥善留存。
⟦/IF⟧
⟦IF|c04approach_c⟧
旁白：你更谨慎的安排让另一名证人加入调查。
⟦/IF⟧
旁白：Lucien闯入档案厅，发现Cassian与你同行，差点拔剑。
旁白：你将已经取得的证据放在两人中间，要求他们一起调查。
Lucien："Step away from her."
Cassian："Ask her what she wants."
⟦FREE⟧
旁白：关于「三人同场」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜猎人欠下的命
⟦BG|bg_c04s04|猎人欠下的命·Lucien、Rowan、Cassian在场，面向玩家，动作对应剧情⟧
⟦TIME|22:45⟧
旁白：异界猎犬袭来。
旁白：Cassian为挡下攻击受伤，你可以冒险救他，也可先带证据撤离再召集援助。
旁白：无论如何，他不能靠受伤来索取感情。
Cassian："Take the ledger. That’s an order to myself, not to you."
Cassian："I can’t undo what I believed. I can give you every record that proves I was wrong."
Cassian："I know. The truth is still yours."
# CHOICE｜袭击之后
#### A｜Save Cassian directly
旁白：你优先保障人的生命与可核实的事实。Rowan按你的要求建立救援清单，记录失踪者姓名与最后位置。
⟦OPT|A|set:c04route_a;love:2⟧
#### B｜Secure the ledger first
旁白：你作出这一选择后，眼前人物给出实际回应；新的线索或关系记忆被写入当前周目，后续场景需继续引用。
⟦OPT|B|set:c04route_b;love:1⟧
#### C｜Call Rowan to lead the rescue
旁白：你优先保障人的生命与可核实的事实。Rowan按你的要求建立救援清单，记录失踪者姓名与最后位置。
⟦OPT|C|set:c04route_c;love:0⟧
# ·
旁白：手中的线索还缺最后一环，下一步必须由你决定。


# CHAPTER 5｜THE CITY THAT FORGETS
⟦GOAL|证明城市正在遗忘居民，确定救援优先级|Verify the city-wide erasure⟧
⟦DONE|flag|c05clue_seen|找到关键线索|旁白：关键的痕迹已经出现，你可以继续追问来源。⟧
⟦DONE|say|确认城市失踪记录并提出救援顺序|说出你的打算|旁白：线索已经摆在眼前，在场的人等你说出判断。⟧
# SCENE｜消失的街道
⟦BG|bg_c05s01|消失的街道·Rowan在场，面向玩家，动作对应剧情⟧
⟦TIME|23:50⟧
⟦IF|c04route_a⟧
旁白：你沿着上一章主动确认的线索推进调查。
⟦/IF⟧
⟦IF|c04route_b⟧
旁白：上一章留存的证物现在可以逐项核验。
⟦/IF⟧
⟦IF|c04route_c⟧
旁白：上一章取得的第三方线索引来新的证人。
⟦/IF⟧
旁白：午夜过后，地图上整条街消失。
旁白：路人坚称那里从未有过医院。
旁白：只有你和三个男人能看见“空白”的轮廓。
Rowan："Forty-seven patients are gone from every record."
Rowan："I remember their names. I refuse to let them disappear twice."
⟦FREE⟧
旁白：关于「消失的街道」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜余烬档案
⟦BG|bg_c05s02|余烬档案·Mara在场，面向玩家，动作对应剧情⟧
⟦TIME|09:20⟧
旁白：Mara打开被封存的“余烬档案”：每次你在第七日死亡，整座城市都会倒回七天，但总有少量人被擦除。
旁白：99次累计的代价比任何人承认的都大。
Mara："The city isn’t saved for free. Someone pays every time."
Mara："Your first self—and someone beside her."
⟦SET|c05clue_seen⟧
# CHOICE｜城市裂缝
#### A｜Go to the hospital
旁白：你优先保障人的生命与可核实的事实。Rowan按你的要求建立救援清单，记录失踪者姓名与最后位置。
⟦OPT|A|set:c05approach_a;love:2⟧
#### B｜Investigate the missing street
旁白：你先保全证据、标注时间戳和来源，拒绝仅凭任何人的私人记忆做出不可逆决定。
⟦OPT|B|set:c05approach_b;love:1⟧
#### C｜Seek Mara’s archive
旁白：你先保全证据、标注时间戳和来源，拒绝仅凭任何人的私人记忆做出不可逆决定。
⟦OPT|C|set:c05approach_c;love:0⟧
# ·
旁白：关于「余烬档案」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜医院封锁
⟦BG|bg_c05s03|医院封锁·Lucien、Rowan、Cassian在场，面向玩家，动作对应剧情⟧
⟦TIME|16:30⟧
⟦IF|c05approach_a⟧
旁白：先前的信任使对方主动提供更完整的记录。
⟦/IF⟧
⟦IF|c05approach_b⟧
旁白：你独立核验的要求，让证物被妥善留存。
⟦/IF⟧
⟦IF|c05approach_c⟧
旁白：你更谨慎的安排让另一名证人加入调查。
⟦/IF⟧
旁白：Rowan接到电话：医院一层正以异常速度老化。
旁白：你们赶到，看见一个小女孩的病历在屏幕上逐字消失。
旁白：你指挥团队疏散，而不是等待男主救援。
Rowan："I can keep the door open for six minutes."
⟦FREE⟧
旁白：关于「医院封锁」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜城中第一次胜利
⟦BG|bg_c05s04|城中第一次胜利·Lucien、Rowan、Mara在场，面向玩家，动作对应剧情⟧
⟦TIME|22:45⟧
旁白：你找到轮回裂缝的临时锚点，将自己的银色印记按在病历柜上，成功恢复部分居民的记录。
旁白：印记灼痛，却没有夺走你的生命。
旁白：Mara惊讶：此前99次你都无法如此操作。
Mara："That shouldn’t be possible before the final night."
Rowan："Her name was Ana Morales. She liked astronomy."
Lucien："There must be another way."
# CHOICE｜救援资源
#### A｜Restore patient names
旁白：你优先保障人的生命与可核实的事实。Rowan按你的要求建立救援清单，记录失踪者姓名与最后位置。
⟦OPT|A|set:c05route_a;love:2⟧
#### B｜Stabilize the power
旁白：你作出这一选择后，眼前人物给出实际回应；新的线索或关系记忆被写入当前周目，后续场景需继续引用。
⟦OPT|B|set:c05route_b;love:1⟧
#### C｜Evacuate the children first
旁白：你作出这一选择后，眼前人物给出实际回应；新的线索或关系记忆被写入当前周目，后续场景需继续引用。
⟦OPT|C|set:c05route_c;love:0⟧
# ·
旁白：手中的线索还缺最后一环，下一步必须由你决定。


# CHAPTER 6｜THREE MEN, THREE TRUTHS
⟦GOAL|听完三人的坦白，重新约定谁承担什么责任|Hear their confessions⟧
⟦DONE|flag|c06clue_seen|找到关键线索|旁白：关键的痕迹已经出现，你可以继续追问来源。⟧
⟦DONE|say|回应三份证词并提出新的合作规则|说出你的打算|旁白：线索已经摆在眼前，在场的人等你说出判断。⟧
# SCENE｜三份自白
⟦BG|bg_c06s01|三份自白·Lucien、Rowan、Cassian在场，面向玩家，动作对应剧情⟧
⟦TIME|23:50⟧
⟦IF|c05route_a⟧
旁白：你沿着上一章主动确认的线索推进调查。
⟦/IF⟧
⟦IF|c05route_b⟧
旁白：上一章留存的证物现在可以逐项核验。
⟦/IF⟧
⟦IF|c05route_c⟧
旁白：上一章取得的第三方线索引来新的证人。
⟦/IF⟧
旁白：你把Lucien、Rowan、Cassian叫到公寓，让他们各自说出对你死亡的记忆，不许打断。
旁白：三份证词相互矛盾，却都带着真实伤痛。
Lucien："I held her as the clock struck twelve."
Rowan："I heard her heartbeat return."
Cassian："I saw someone else wearing her face."
⟦FREE⟧
旁白：关于「三份自白」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜Lucien的错误
⟦BG|bg_c06s02|Lucien的错误·Lucien在场，面向玩家，动作对应剧情⟧
⟦TIME|09:20⟧
旁白：Lucien承认第54次轮回，他曾锁住你不让你冒险，以为这样能阻止死亡。
旁白：结果城市被吞噬了两个街区，你依然死去。
Lucien："I mistook control for protection."
Lucien："No. Even if I’m terrified."
⟦SET|c06clue_seen⟧
# CHOICE｜三份口供
#### A｜Separate testimonies
旁白：你先保全证据、标注时间戳和来源，拒绝仅凭任何人的私人记忆做出不可逆决定。
⟦OPT|A|set:c06approach_a;love:2⟧
#### B｜Confront them together
旁白：你作出这一选择后，眼前人物给出实际回应；新的线索或关系记忆被写入当前周目，后续场景需继续引用。
⟦OPT|B|set:c06approach_b;love:1⟧
#### C｜Record everything with Mara
旁白：你先保全证据、标注时间戳和来源，拒绝仅凭任何人的私人记忆做出不可逆决定。
⟦OPT|C|set:c06approach_c;love:0⟧
# ·
旁白：关于「Lucien的错误」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜Rowan的错误
⟦BG|bg_c06s03|Rowan的错误·Rowan在场，面向玩家，动作对应剧情⟧
⟦TIME|16:30⟧
⟦IF|c06approach_a⟧
旁白：先前的信任使对方主动提供更完整的记录。
⟦/IF⟧
⟦IF|c06approach_b⟧
旁白：你独立核验的要求，让证物被妥善留存。
⟦/IF⟧
⟦IF|c06approach_c⟧
旁白：你更谨慎的安排让另一名证人加入调查。
⟦/IF⟧
旁白：Rowan承认第97次，他为了保护医院拒绝转移异常病人，导致轮回裂缝扩大。
旁白：他后来梦到每一位死者。
Rowan："I called it triage. Part of it was fear."
Rowan："Listen before I decide who is expendable."
⟦FREE⟧
旁白：关于「Rowan的错误」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜Cassian的错误
⟦BG|bg_c06s04|Cassian的错误·Lucien、Rowan、Cassian在场，面向玩家，动作对应剧情⟧
⟦TIME|22:45⟧
旁白：Cassian拿出自己当年签署的命令，指出上面的血誓可以被伪造。
旁白：他曾追杀错误的人，却也第一次提供能够撕毁誓言的办法。
Cassian："I followed orders because thinking was harder."
Cassian："Now I follow evidence. If you want me beside you, say so."
Lucien："I thought I was choosing safety."
# CHOICE｜新的盟约
#### A｜Trust Lucien with a task
旁白：Lucien把旧誓言收起，将这一世的决定权留给你。他主动交出一条可独立核验的线索。
⟦OPT|A|set:c06route_a;love:2⟧
#### B｜Partner with Rowan
旁白：你优先保障人的生命与可核实的事实。Rowan按你的要求建立救援清单，记录失踪者姓名与最后位置。
⟦OPT|B|set:c06route_b;love:1⟧
#### C｜Assign Cassian as scout
旁白：你要求Cassian提交原始命令和来源，不准未经核验采取行动。他把武器收好，接受协作安排。
⟦OPT|C|set:c06route_c;love:0⟧
# ·
旁白：手中的线索还缺最后一环，下一步必须由你决定。


# CHAPTER 7｜THE HUNDREDTH BRIDE
⟦GOAL|识破永夜议会的舞会陷阱，找到被删除的协议条款|Expose the council trap⟧
⟦DONE|flag|c07clue_seen|找到关键线索|旁白：关键的痕迹已经出现，你可以继续追问来源。⟧
⟦DONE|say|质询议会、找回被删除的结局或提出撤销线索|说出你的打算|旁白：线索已经摆在眼前，在场的人等你说出判断。⟧
# SCENE｜议会邀请
⟦BG|bg_c07s01|议会邀请·Evelyn在场，面向玩家，动作对应剧情⟧
⟦TIME|23:50⟧
⟦IF|c06route_a⟧
旁白：你沿着上一章主动确认的线索推进调查。
⟦/IF⟧
⟦IF|c06route_b⟧
旁白：上一章留存的证物现在可以逐项核验。
⟦/IF⟧
⟦IF|c06route_c⟧
旁白：上一章取得的第三方线索引来新的证人。
⟦/IF⟧
旁白：永夜议会发来黑色邀请函：第七日你必须作为“第一百位新娘”参加仪式。
旁白：Evelyn声称只有你自愿戴上夜冠，城市才不会彻底消失。
Evelyn："You’ve always been the price of dawn."
⟦FREE⟧
旁白：关于「议会邀请」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜舞会的真相
⟦BG|bg_c07s02|舞会的真相·Lucien、Evelyn在场，面向玩家，动作对应剧情⟧
⟦TIME|09:20⟧
旁白：舞会上，贵族们熟练地叫出你不同前世的名字，却没人记得那些失踪的普通人。
旁白：你拒绝让他们把你当作仪式道具。
Lucien："May I have this dance?"
Evelyn："She remembers more than you intended, Lucien."
⟦SET|c07clue_seen⟧
# CHOICE｜议会的邀请
#### A｜Attend openly
旁白：你作出这一选择后，眼前人物给出实际回应；新的线索或关系记忆被写入当前周目，后续场景需继续引用。
⟦OPT|A|set:c07approach_a;love:2⟧
#### B｜Enter disguised
旁白：你作出这一选择后，眼前人物给出实际回应；新的线索或关系记忆被写入当前周目，后续场景需继续引用。
⟦OPT|B|set:c07approach_b;love:1⟧
#### C｜Send a refusal and demand records
旁白：你先保全证据、标注时间戳和来源，拒绝仅凭任何人的私人记忆做出不可逆决定。
⟦OPT|C|set:c07approach_c;love:0⟧
# ·
旁白：关于「舞会的真相」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜红色房间
⟦BG|bg_c07s03|红色房间·Lucien、Evelyn在场，面向玩家，动作对应剧情⟧
⟦TIME|16:30⟧
⟦IF|c07approach_a⟧
旁白：先前的信任使对方主动提供更完整的记录。
⟦/IF⟧
⟦IF|c07approach_b⟧
旁白：你独立核验的要求，让证物被妥善留存。
⟦/IF⟧
⟦IF|c07approach_c⟧
旁白：你更谨慎的安排让另一名证人加入调查。
⟦/IF⟧
旁白：你闯入议会红色档案室，找到第1次轮回的录像：最早的你与Evelyn共同创造回溯仪式，本
旁白：意是挽救瘟疫中的城市；Lucien只是后来加入。
⟦FREE⟧
旁白：关于「红色房间」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜被删除的结局
⟦BG|bg_c07s04|被删除的结局·Evelyn在场，面向玩家，动作对应剧情⟧
⟦TIME|22:45⟧
旁白：录像后半段显示：第1次轮回其实成功终止瘟疫；是议会为了保留永夜权力，故意不销毁时钟，导
旁白：致重复献祭。
旁白：Evelyn没有否认，只说“我不能让城市回到混乱”。
Evelyn："I preserved order."
Evelyn："Sometimes those are the same thing."
Evelyn："Without ceremony, your city collapses."
# CHOICE｜舞会中选择
#### A｜Dance with Lucien
旁白：Lucien把旧誓言收起，将这一世的决定权留给你。他主动交出一条可独立核验的线索。
⟦OPT|A|set:c07route_a;love:2⟧
#### B｜Investigate with Cassian
旁白：你要求Cassian提交原始命令和来源，不准未经核验采取行动。他把武器收好，接受协作安排。
⟦OPT|B|set:c07route_b;love:1⟧
#### C｜Follow Mara into archives
旁白：你先保全证据、标注时间戳和来源，拒绝仅凭任何人的私人记忆做出不可逆决定。
⟦OPT|C|set:c07route_c;love:0⟧
# ·
旁白：手中的线索还缺最后一环，下一步必须由你决定。


# CHAPTER 8｜THE NIGHT LUCIEN DIED
⟦GOAL|揭示Lucien第37次死亡，决定如何分担现实风险|Learn Lucien’s sacrifice⟧
⟦DONE|flag|c08clue_seen|找到关键线索|旁白：关键的痕迹已经出现，你可以继续追问来源。⟧
⟦DONE|say|询问第37次复活真相并决定如何分担风险|说出你的打算|旁白：线索已经摆在眼前，在场的人等你说出判断。⟧
# SCENE｜第37次轮回
⟦BG|bg_c08s01|第37次轮回·Lucien在场，面向玩家，动作对应剧情⟧
⟦TIME|23:50⟧
⟦IF|c07route_a⟧
旁白：你沿着上一章主动确认的线索推进调查。
⟦/IF⟧
⟦IF|c07route_b⟧
旁白：上一章留存的证物现在可以逐项核验。
⟦/IF⟧
⟦IF|c07route_c⟧
旁白：上一章取得的第三方线索引来新的证人。
⟦/IF⟧
旁白：你触碰破碎镜片，看到第37次轮回：Lucien为你挡下时钟核心的碎片，被永夜火焰吞没。
旁白：那一夜你活过了午夜，但城市在黎明前重置。
⟦FREE⟧
旁白：关于「第37次轮回」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜不死者的代价
⟦BG|bg_c08s02|不死者的代价·Lucien在场，面向玩家，动作对应剧情⟧
⟦TIME|09:20⟧
旁白：Lucien坦白，他之所以存活至今不是因为强大，而是被时钟绑定：每轮他重获生命，却保留
旁白：死亡痛楚和记忆。
旁白：每次轮回他都失去一点对阳光的感觉。
Lucien："Immortality is not the same as living."
⟦SET|c08clue_seen⟧
# CHOICE｜Lucien的真相
#### A｜Comfort him
旁白：你作出这一选择后，眼前人物给出实际回应；新的线索或关系记忆被写入当前周目，后续场景需继续引用。
⟦OPT|A|set:c08approach_a;love:2⟧
#### B｜Ask him to release control
旁白：你作出这一选择后，眼前人物给出实际回应；新的线索或关系记忆被写入当前周目，后续场景需继续引用。
⟦OPT|B|set:c08approach_b;love:1⟧
#### C｜Request space
旁白：你作出这一选择后，眼前人物给出实际回应；新的线索或关系记忆被写入当前周目，后续场景需继续引用。
⟦OPT|C|set:c08approach_c;love:0⟧
# ·
旁白：关于「不死者的代价」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜第一次主动求助
⟦BG|bg_c08s03|第一次主动求助·Lucien在场，面向玩家，动作对应剧情⟧
⟦TIME|16:30⟧
⟦IF|c08approach_a⟧
旁白：先前的信任使对方主动提供更完整的记录。
⟦/IF⟧
⟦IF|c08approach_b⟧
旁白：你独立核验的要求，让证物被妥善留存。
⟦/IF⟧
⟦IF|c08approach_c⟧
旁白：你更谨慎的安排让另一名证人加入调查。
⟦/IF⟧
旁白：这一次Lucien没有独自处理核心碎片。
旁白：他向你和其他两人请求帮助。
旁白：你可以接近、安慰，也可以要求更多真相。
Lucien："I don’t know how to do this alone anymore."
Lucien："I’m trying to believe that."
⟦FREE⟧
旁白：关于「第一次主动求助」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜新的代价
⟦BG|bg_c08s04|新的代价·Lucien、Rowan、Cassian在场，面向玩家，动作对应剧情⟧
⟦TIME|22:45⟧
旁白：Mara计算出毁掉时钟可能让Lucien失去吸血鬼力量，甚至变回凡人；Rowan也可能
旁白：失去轮回记忆。
旁白：Cassian说他宁可忘记罪行，也不能让城里的人再次被抹去。
Mara："Ending the loop is not free. But the cost can be chosen and shared."
Lucien："Dying was the easy part. Waking up and remembering was worse."
Lucien："I’m trying to believe you."
# CHOICE｜代价分配
#### A｜Research a nonlethal path
旁白：你作出这一选择后，眼前人物给出实际回应；新的线索或关系记忆被写入当前周目，后续场景需继续引用。
⟦OPT|A|set:c08route_a;love:2⟧
#### B｜Ask every ally for consent
旁白：你作出这一选择后，眼前人物给出实际回应；新的线索或关系记忆被写入当前周目，后续场景需继续引用。
⟦OPT|B|set:c08route_b;love:1⟧
#### C｜Delay decision for evidence
旁白：你先保全证据、标注时间戳和来源，拒绝仅凭任何人的私人记忆做出不可逆决定。
⟦OPT|C|set:c08route_c;love:0⟧
# ·
旁白：手中的线索还缺最后一环，下一步必须由你决定。


# CHAPTER 9｜THE BETRAYAL OF THE FIRST SELF
⟦GOAL|找到第一世被篡改的契约末页，拒绝伪造献祭|Recover the missing contract page⟧
⟦DONE|flag|c09clue_seen|找到关键线索|旁白：关键的痕迹已经出现，你可以继续追问来源。⟧
⟦DONE|say|核对原始契约、反对献祭或召集见证人|说出你的打算|旁白：线索已经摆在眼前，在场的人等你说出判断。⟧
# SCENE｜第一世的录像
⟦BG|bg_c09s01|第一世的录像·玩家独处，无其他角色⟧
⟦TIME|23:50⟧
⟦IF|c08route_a⟧
旁白：你沿着上一章主动确认的线索推进调查。
⟦/IF⟧
⟦IF|c08route_b⟧
旁白：上一章留存的证物现在可以逐项核验。
⟦/IF⟧
⟦IF|c08route_c⟧
旁白：上一章取得的第三方线索引来新的证人。
⟦/IF⟧
旁白：你终于看完整卷录像。
旁白：第1世的你曾认为牺牲少数人值得挽救城市，因此主动设置记忆屏障，防止未来的自己动摇；后来
旁白：她后悔，在最后一页留下撤销条款。
⟦FREE⟧
旁白：关于「第一世的录像」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜被偷走的最后一页
⟦BG|bg_c09s02|被偷走的最后一页·Mara在场，面向玩家，动作对应剧情⟧
⟦TIME|09:20⟧
旁白：Mara在时钟内部找到契约末页：撤销权只属于当代的你，须在第七日午夜之前有三名独立证人
旁白：共同见证，且不得以誓言胁迫。
Mara："The witness clause was hidden for a century."
⟦SET|c09clue_seen⟧
# CHOICE｜第一世的责任
#### A｜Reject inherited guilt
旁白：你暂时拒绝以过去的誓言交换此刻的决定权。对方虽失望，却必须让开道路。
⟦OPT|A|set:c09approach_a;love:2⟧
#### B｜Honor the original good intention
旁白：你作出这一选择后，眼前人物给出实际回应；新的线索或关系记忆被写入当前周目，后续场景需继续引用。
⟦OPT|B|set:c09approach_b;love:1⟧
#### C｜Demand the full account
旁白：你作出这一选择后，眼前人物给出实际回应；新的线索或关系记忆被写入当前周目，后续场景需继续引用。
⟦OPT|C|set:c09approach_c;love:0⟧
# ·
旁白：关于「被偷走的最后一页」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜Evelyn的诱惑
⟦BG|bg_c09s03|Evelyn的诱惑·Evelyn在场，面向玩家，动作对应剧情⟧
⟦TIME|16:30⟧
⟦IF|c09approach_a⟧
旁白：先前的信任使对方主动提供更完整的记录。
⟦/IF⟧
⟦IF|c09approach_b⟧
旁白：你独立核验的要求，让证物被妥善留存。
⟦/IF⟧
⟦IF|c09approach_c⟧
旁白：你更谨慎的安排让另一名证人加入调查。
⟦/IF⟧
旁白：Evelyn单独来见你，承诺让你保留全部前世爱人的记忆和永生，代价是继续城市每七天的重置。
旁白：她声称其他人都会忘掉你。
Evelyn："You can have every version of love you ever lost."
⟦FREE⟧
旁白：关于「Evelyn的诱惑」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜第三名证人的困局
⟦BG|bg_c09s04|第三名证人的困局·Lucien、Rowan、Cassian在场，面向玩家，动作对应剧情⟧
⟦TIME|22:45⟧
旁白：三名男主都愿作证，但契约要求证人不受时钟直接支配。
旁白：Lucien被绑定，Cassian持有猎人血誓，Rowan受轮回污染。
旁白：你必须解除至少一人的束缚，或取得Mara的独立守护者资格。
Cassian："Then we stop looking for a perfect witness."
Rowan："We find a lawful one."
Lucien："Even if it’s not me."
# CHOICE｜Evelyn的提议
#### A｜Reject the eternal bargain
旁白：你暂时拒绝以过去的誓言交换此刻的决定权。对方虽失望，却必须让开道路。
⟦OPT|A|set:c09route_a;love:2⟧
#### B｜Pretend to consider for evidence
旁白：你先保全证据、标注时间戳和来源，拒绝仅凭任何人的私人记忆做出不可逆决定。
⟦OPT|B|set:c09route_b;love:1⟧
#### C｜Ask who benefits from the loop
旁白：你作出这一选择后，眼前人物给出实际回应；新的线索或关系记忆被写入当前周目，后续场景需继续引用。
⟦OPT|C|set:c09route_c;love:0⟧
# ·
旁白：手中的线索还缺最后一环，下一步必须由你决定。


# CHAPTER 10｜THE LAST SEVEN HOURS
⟦GOAL|在最后七小时救援居民并确定共同行动|Save civilians before midnight⟧
⟦DONE|flag|c10clue_seen|找到关键线索|旁白：关键的痕迹已经出现，你可以继续追问来源。⟧
⟦DONE|say|决定救援资源、行动伙伴或紧急方案|说出你的打算|旁白：线索已经摆在眼前，在场的人等你说出判断。⟧
# SCENE｜零点倒计时
⟦BG|bg_c10s01|零点倒计时·Mara在场，面向玩家，动作对应剧情⟧
⟦TIME|23:50⟧
⟦IF|c09route_a⟧
旁白：你沿着上一章主动确认的线索推进调查。
⟦/IF⟧
⟦IF|c09route_b⟧
旁白：上一章留存的证物现在可以逐项核验。
⟦/IF⟧
⟦IF|c09route_c⟧
旁白：上一章取得的第三方线索引来新的证人。
⟦/IF⟧
旁白：距离仪式七小时。
旁白：整座城市出现时间错位，旧汽车在街上出现，摩天楼部分变为19世纪砖墙。
旁白：你决定分队寻找三枚见证印章。
Mara："I can open the archive gate once."
⟦FREE⟧
旁白：关于「零点倒计时」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜救谁的代价
⟦BG|bg_c10s02|救谁的代价·Rowan、Cassian在场，面向玩家，动作对应剧情⟧
⟦TIME|09:20⟧
旁白：Rowan发现医院和猎人据点同时陷落。
旁白：你必须决定先去哪里，并派遣其他人救援；两边均有独立的成功条件，不允许用单一男主好感替代城市安全。
Rowan："I can hold the hospital if you send the emergency generator."
Cassian："My team can evacuate the south tunnel."
⟦SET|c10clue_seen⟧
# CHOICE｜双线救援
#### A｜Prioritize hospital
旁白：你优先保障人的生命与可核实的事实。Rowan按你的要求建立救援清单，记录失踪者姓名与最后位置。
⟦OPT|A|set:c10approach_a;love:2⟧
#### B｜Prioritize south tunnels
旁白：你将决定写入最终行动计划，明确负责者、撤离路线及失败时的备选步骤。新的盟友状态被保存。
⟦OPT|B|set:c10approach_b;love:1⟧
#### C｜Divide allies with clear duties
旁白：你将决定写入最终行动计划，明确负责者、撤离路线及失败时的备选步骤。新的盟友状态被保存。
⟦OPT|C|set:c10approach_c;love:0⟧
# ·
旁白：关于「救谁的代价」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜三条关系的告白
⟦BG|bg_c10s03|三条关系的告白·Lucien、Rowan、Cassian在场，面向玩家，动作对应剧情⟧
⟦TIME|16:30⟧
⟦IF|c10approach_a⟧
旁白：先前的信任使对方主动提供更完整的记录。
⟦/IF⟧
⟦IF|c10approach_b⟧
旁白：你独立核验的要求，让证物被妥善留存。
⟦/IF⟧
⟦IF|c10approach_c⟧
旁白：你更谨慎的安排让另一名证人加入调查。
⟦/IF⟧
旁白：短暂休整时，三位男人分别向你表达爱意，但都明确不会以自己受过的苦换取你的选择。
旁白：Lucien承认爱你也必须允许你改变；Rowan珍惜现在的你；Cassian承认他仍在学着信任。
Lucien："I love you now, not only the ghosts I remember."
Rowan："You don’t owe me a future. I just want you to have one."
Cassian："If you walk away, I’ll still stand against the clock."
⟦FREE⟧
旁白：关于「三条关系的告白」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜最后一枚印章
⟦BG|bg_c10s04|最后一枚印章·Lucien、Rowan、Cassian在场，面向玩家，动作对应剧情⟧
⟦TIME|22:45⟧
旁白：Evelyn毁掉一枚印章。
旁白：你用第5章学到的方法让时钟印记与城市居民的记忆共鸣：数百位居民说出自己曾被抹除亲友的名
旁白：字，形成新的共同见证。
Mara："The pact never required royalty. It required independent wills."
Rowan："Hospital team moving."
Cassian："North exit secured."
# CHOICE｜告白后的回应
#### A｜Express feelings for Lucien
旁白：Lucien把旧誓言收起，将这一世的决定权留给你。他主动交出一条可独立核验的线索。
⟦OPT|A|set:c10route_a;love:2⟧
#### B｜Express feelings for Rowan
旁白：你优先保障人的生命与可核实的事实。Rowan按你的要求建立救援清单，记录失踪者姓名与最后位置。
⟦OPT|B|set:c10route_b;love:1⟧
#### C｜Express feelings for Cassian
旁白：你要求Cassian提交原始命令和来源，不准未经核验采取行动。他把武器收好，接受协作安排。
⟦OPT|C|set:c10route_c;love:0⟧
# ·
旁白：手中的线索还缺最后一环，下一步必须由你决定。


# CHAPTER 11｜BREAK THE CLOCK
⟦GOAL|召集证人并撤销契约，确保有人生还|Break the clock without sacrifice⟧
⟦DONE|flag|c11clue_seen|找到关键线索|旁白：关键的痕迹已经出现，你可以继续追问来源。⟧
⟦DONE|say|确认契约撤销、见证机制或新的安全计划|说出你的打算|旁白：线索已经摆在眼前，在场的人等你说出判断。⟧
# SCENE｜永夜之塔
⟦BG|bg_c11s01|永夜之塔·Evelyn在场，面向玩家，动作对应剧情⟧
⟦TIME|23:50⟧
⟦IF|c10route_a⟧
旁白：你沿着上一章主动确认的线索推进调查。
⟦/IF⟧
⟦IF|c10route_b⟧
旁白：上一章留存的证物现在可以逐项核验。
⟦/IF⟧
⟦IF|c10route_c⟧
旁白：上一章取得的第三方线索引来新的证人。
⟦/IF⟧
旁白：午夜前一小时，你进入永夜之塔。
旁白：时钟核心悬浮在空中，投影出99次死亡场景。
旁白：Evelyn仍相信只要你戴上夜冠，一切可回到可控的秩序。
Evelyn："Order or chaos. Choose."
⟦FREE⟧
旁白：关于「永夜之塔」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜你的第一次拒绝
⟦BG|bg_c11s02|你的第一次拒绝·Lucien、Mara在场，面向玩家，动作对应剧情⟧
⟦TIME|09:20⟧
旁白：你念出末页撤销条款。
旁白：契约反噬开始，三个男人各自面对失败的前世。
旁白：玩家选择分配资源与信任，救援依靠证据、合作和先前建立的盟友。
Lucien："The clock is resisting."
Mara："Then hold the line."
⟦SET|c11clue_seen⟧
# CHOICE｜撤销契约
#### A｜Read the clause aloud
旁白：你把三方代价写入见证簿，确保无人独自承担。
⟦OPT|A|set:c11approach_a;love:2⟧
#### B｜Protect the witnesses first
旁白：被篡改的条款被钉在议会公开档案中。
⟦OPT|B|set:c11approach_b;love:1⟧
#### C｜Challenge Evelyn publicly
旁白：城市居民的独立证词使撤销结果不能被反悔。
⟦OPT|C|set:c11approach_c;love:0⟧
# ·
旁白：关于「你的第一次拒绝」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜牺牲与替代
⟦BG|bg_c11s03|牺牲与替代·Lucien、Rowan、Cassian在场，面向玩家，动作对应剧情⟧
⟦TIME|16:30⟧
⟦IF|c11approach_a⟧
旁白：先前的信任使对方主动提供更完整的记录。
⟦/IF⟧
⟦IF|c11approach_b⟧
旁白：你独立核验的要求，让证物被妥善留存。
⟦/IF⟧
⟦IF|c11approach_c⟧
旁白：你更谨慎的安排让另一名证人加入调查。
⟦/IF⟧
旁白：核心要求一道生命交换。
旁白：你发现所谓“必死代价”是议会伪造的双重校验；正确解法是让三位独立见证同时放弃对时间的控制权。
旁白：Lucien失去不死绑定，Rowan的梦可能退去，Cassian的血誓断裂。
Cassian："On your count."
Rowan："Together."
Lucien："For the first time."
⟦FREE⟧
旁白：关于「牺牲与替代」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜钟停了
⟦BG|bg_c11s04|钟停了·Lucien、Rowan、Cassian在场，面向玩家，动作对应剧情⟧
⟦TIME|22:45⟧
旁白：零点。
旁白：钟面碎裂。
旁白：你没有坠落，城市也没有重置。
Mara："It’s 12:01."
Mara："Tomorrow exists."
Evelyn："The city needs a keeper!"
# CHOICE｜最终风险
#### A｜Share the cost
旁白：你将决定写入最终行动计划，明确负责者、撤离路线及失败时的备选步骤。新的盟友状态被保存。
⟦OPT|A|set:c11route_a;love:2⟧
#### B｜Find the forged rule
旁白：你将决定写入最终行动计划，明确负责者、撤离路线及失败时的备选步骤。新的盟友状态被保存。
⟦OPT|B|set:c11route_b;love:1⟧
#### C｜Use citizen witness mechanism
旁白：你将决定写入最终行动计划，明确负责者、撤离路线及失败时的备选步骤。新的盟友状态被保存。
⟦OPT|C|set:c11route_c;love:0⟧
# ·
旁白：手中的线索还缺最后一环，下一步必须由你决定。


# CHAPTER 12｜THE FIRST TOMORROW
⟦GOAL|确认城市迎来真正的明天，并说出未来的个人选择|Choose life after the loop⟧
⟦DONE|flag|c12clue_seen|找到关键线索|旁白：关键的痕迹已经出现，你可以继续追问来源。⟧
⟦DONE|say|说出想与谁同行、暂缓选择或独立生活|说出你的打算|旁白：线索已经摆在眼前，在场的人等你说出判断。⟧
# SCENE｜没有重置的清晨
⟦BG|bg_c12s01|没有重置的清晨·Lucien、Rowan、Cassian在场，面向玩家，动作对应剧情⟧
⟦TIME|07:00⟧
⟦IF|c11route_a⟧
旁白：你沿着上一章主动确认的线索推进调查。
⟦/IF⟧
⟦IF|c11route_b⟧
旁白：上一章留存的证物现在可以逐项核验。
⟦/IF⟧
⟦IF|c11route_c⟧
旁白：上一章取得的第三方线索引来新的证人。
⟦/IF⟧
旁白：清晨七点，城市仍然存在。
旁白：失踪者的姓名记录开始恢复，人们陆续记起被抹去的亲友。
旁白：你没有银色印记。
Lucien："I can feel the warmth."
Rowan："Your pulse is normal."
Cassian："The clock is gone. I checked twice."
⟦FREE⟧
旁白：关于「没有重置的清晨」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜三封没有要求的信
⟦BG|bg_c12s02|三封没有要求的信·Lucien、Rowan、Cassian在场，面向玩家，动作对应剧情⟧
⟦TIME|09:20⟧
旁白：桌上放着三封未封口的信。
旁白：Lucien愿从零相识，Rowan邀请你去海边。
旁白：Cassian邀请你重建猎人团的责任制度。
⟦SET|c12clue_seen⟧
# CHOICE｜太阳下的第一天
#### A｜Take Lucien’s hand
旁白：Lucien把旧誓言收起，将这一世的决定权留给你。他主动交出一条可独立核验的线索。
⟦OPT|A|set:c12approach_a;love:2⟧
#### B｜Celebrate with all allies
旁白：你将决定写入最终行动计划，明确负责者、撤离路线及失败时的备选步骤。新的盟友状态被保存。
⟦OPT|B|set:c12approach_b;love:1⟧
#### C｜Go alone to the river
旁白：你暂时拒绝以过去的誓言交换此刻的决定权。对方虽失望，却必须让开道路。
⟦OPT|C|set:c12approach_c;love:0⟧
# ·
旁白：关于「三封没有要求的信」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜你的选择
⟦BG|bg_c12s03|你的选择·Lucien、Rowan、Cassian在场，面向玩家，动作对应剧情⟧
⟦TIME|16:30⟧
⟦IF|c12approach_a⟧
旁白：先前的信任使对方主动提供更完整的记录。
⟦/IF⟧
⟦IF|c12approach_b⟧
旁白：你独立核验的要求，让证物被妥善留存。
⟦/IF⟧
⟦IF|c12approach_c⟧
旁白：你更谨慎的安排让另一名证人加入调查。
⟦/IF⟧
旁白：在博物馆玻璃穹顶下，你做出自己的未来选择。
旁白：可以选择Lucien、Rowan、Cassian、暂不决定或独自生活。
旁白：任何选择都不抹去其他人的友谊与城市的修复工作。
⟦FREE⟧
旁白：关于「你的选择」的问题暂时停在这里；前往下一处线索前，你仍可继续交谈。

# SCENE｜新生活的第一份约定
⟦BG|bg_c12s04|博物馆玻璃穹顶·清晨，Lucien、Rowan、Cassian站在不远处，等玩家说话⟧
⟦TIME|18:30⟧
旁白：灯光穿过玻璃穹顶，落在三封尚未封口的信上。
旁白：Lucien、Rowan、Cassian保持着彼此可以听见的距离。
Lucien：“I won't ask you to remember what you never chose.”
Rowan：“Whatever you decide, you get to live tomorrow.”
Cassian：“No more orders. No more borrowed destinies.”
旁白：Mara打开城市档案馆的第一本公开登记簿。
# CHOICE｜这个没有倒计时的未来，你希望与谁同行
#### A｜选择与Lucien从这一世重新相爱
旁白：Lucien把旧肖像留在档案馆，二人约定第一次真正的约会。
⟦OPT|A|set:ending_lucien;love:5⟧
#### B｜选择与Rowan建立新的生活
旁白：医院重新开放夜间急诊，两人约好在值班结束后一起看日出。
⟦OPT|B|set:ending_rowan;love:5⟧
#### C｜选择与Cassian一起重建猎人团
旁白：猎人团撤销旧血誓，你们共同见证第一批成员的自由宣誓。
⟦OPT|C|set:ending_cassian;love:5⟧
#### D｜选择独自探索世界
旁白：你收起三封信，把新一张没有期限的车票放进包里。
⟦OPT|D|set:ending_independent⟧
#### E｜暂不决定爱情，继续与伙伴同行
旁白：大家约定先修复城市，新的关系将在没有轮回压力的日子里慢慢形成。
⟦OPT|E|set:ending_open⟧
# ·
⟦IF|ending_lucien⟧
旁白：旧墓室的门被封存，Lucien将第一张空白相片交给你决定如何使用。
⟦/IF⟧
⟦IF|ending_rowan⟧
旁白：Rowan的急救包里多了一张写着未来旅行日期的便笺。
⟦/IF⟧
⟦IF|ending_cassian⟧
旁白：Cassian把写有旧命令的纸投进火中，新的誓约在你们面前摊开。
⟦/IF⟧
⟦IF|ending_independent⟧
旁白：你走出博物馆，第一班不再重复的列车已经进站。
⟦/IF⟧
⟦IF|ending_open⟧
旁白：四人的城市修复计划在档案馆存档，下一次见面不必依赖命运安排。
⟦/IF⟧
旁白：城市的钟继续向前走，这一次没有人需要替你决定明天。
