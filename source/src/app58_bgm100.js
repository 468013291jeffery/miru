/* ================= v2.3 · BGM LIBRARY — 100 scored cues, picked by keywords =================
   Honest note: these are live-synthesised (Web Audio) arrangements — 21 arrangement styles × key × mode × tempo × progression,
   each with its own name and trigger words. No licensed recordings are bundled. Any cue can be replaced by a real recording later:
   drop art/bgm/<id>.mp3 into the site (BGM_FILES) and the same id plays the file instead.
   Stories use them three ways: ["sys","bgm",{m:"m_rainy_cafe"}] (author), the creator's scene keywords at publish, and runtime
   keyword matching when a scene opens without a cue. */
const BGM100_SRC=`rainy_cafe|雨天咖啡馆|Rainy Café|rain|5|maj|72|pop|咖啡,下雨,窗边,咖啡馆,cafe,rain,coffee
midnight_jazz|午夜爵士|Midnight Jazz|jazz|5|dor|66|jazz|酒吧,爵士,威士忌,吧台,bar,jazz,whiskey
first_snow|初雪|First Snow|lullaby|0|maj|70|pop|初雪,下雪,冬天,snow,winter
heartbeat_close|心跳靠近|Heartbeat Close|heart|9|min|60|sad|靠近,心跳,呼吸声,贴近,close,heartbeat
ballroom|舞会华尔兹|Ballroom Waltz|waltz|7|maj|84|pop|舞会,跳舞,华尔兹,ball,dance,waltz
chase_night|夜路追逐|Night Chase|drive|2|min|128|minor|追,逃跑,追车,快跑,chase,escape,run
interrogation|审讯室|Interrogation|tension|1|phr|80|phr|审讯,警局,口供,interrogation,police station
sunlit_campus|阳光校园|Sunlit Campus|ballad|0|maj|96|pop|校园,教室,操场,学长,campus,classroom
library_hush|图书馆|Library Hush|ambient|4|lyd|60|lyd|图书馆,书架,library,bookshelf
old_letter|旧信|Old Letter|strings|9|min|64|sad|旧信,信封,旧照片,letter,old photo
hospital_night|夜班病房|Night Ward|ambient|2|min|58|minor|医院,病房,夜班,急诊,hospital,ward,ER
betrayal|背叛|Betrayal|tension|4|hm|76|minor|背叛,出卖,骗了我,betray,traitor
confession|告白|Confession|ballad|2|maj|68|cano|告白,表白,我喜欢你,confess,i like you
goodbye_station|车站告别|Station Goodbye|strings|7|min|62|sad|车站,告别,站台,station,goodbye,platform
seaside|海边日落|Seaside Sunset|ballad|7|mix|80|pop|海边,海浪,沙滩,beach,seaside,waves
neon_city|霓虹都市|Neon City|lofi|9|dor|88|minor|霓虹,街头,夜景,neon,downtown
rooftop_wind|天台的风|Rooftop Wind|ambient|0|lyd|70|lyd|天台,屋顶,rooftop,roof
masquerade|假面舞会|Masquerade|waltz|2|min|90|minor|面具,假面,mask,masquerade
royal_court|王庭|Royal Court|epic|0|maj|72|pop|王宫,王座,国王,殿下,palace,throne,king
vampire_castle|血族古堡|Vampire Castle|church|5|hm|60|minor|古堡,吸血鬼,血族,castle,vampire
full_moon|满月|Full Moon|tension|9|min|70|minor|满月,狼人,狼嚎,full moon,werewolf
fae_forest|妖精森林|Fae Forest|lullaby|4|lyd|76|lyd|森林,精灵,妖精,forest,fae,elf
dragon_flight|龙翼|Dragon Flight|epic|2|dor|96|minor|龙,巨龙,翅膀,dragon,wings
starship|星舰|Starship|ambient|7|lyd|64|lyd|飞船,星舰,太空,宇宙,starship,space
wasteland|废土|Wasteland|tension|4|phr|72|phr|末世,废墟,丧尸,wasteland,zombie,ruins
courtroom|法庭|Courtroom|strings|0|min|76|minor|法庭,律师,法官,court,lawyer,judge
boardroom|董事会|Boardroom|noir|2|dor|82|jazz|董事会,会议室,合同,boardroom,contract
gala_night|晚宴|Gala Night|jazz|10|maj|78|jazz|晚宴,香槟,礼服,gala,champagne
ice_rink|冰场|Ice Rink|drive|4|maj|118|pop|冰场,冰球,rink,hockey
locker_room|更衣室|Locker Room|lofi|7|min|86|minor|更衣室,训练后,locker room
race_track|赛道|Race Track|drive|9|min|138|minor|赛车,引擎,赛道,F1,racing
stage_lights|聚光灯|Stage Lights|epic|5|maj|100|pop|演唱会,舞台,concert,on stage
backstage|后台|Backstage|noir|0|dor|74|jazz|后台,化妆间,backstage,dressing room
standoff|对峙|Standoff|tension|11|phr|90|phr|对峙,挑衅,僵持,standoff,provoke
slow_burn|慢热|Slow Burn|ballad|4|maj|64|cano|对视,沉默,慢慢地,gaze,silence
jealousy|醋意|Jealousy|tango|2|hm|108|minor|吃醋,嫉妒,醋意,jealous,envy
tango_duel|探戈|Tango Duel|tango|9|hm|112|minor|探戈,较量,tango,duel
good_morning|早安|Good Morning|latin|0|maj|92|jazz|早安,早餐,醒来,morning,breakfast
sunday_kitchen|周日厨房|Sunday Kitchen|pizz|7|maj|104|pop|做饭,厨房,煎蛋,cooking,kitchen
clumsy|手忙脚乱|Clumsy|pizz|0|maj|116|pop|打翻,尴尬,手忙脚乱,clumsy,awkward,oops
prank|恶作剧|Prank|chip|5|mix|124|pop|恶作剧,捉弄,偷笑,prank,tease
game_night|游戏夜|Game Night|chip|0|maj|120|pop|打游戏,手柄,电竞,video game,esports
goodnight|晚安|Goodnight|lullaby|7|maj|58|pop|晚安,睡吧,哄睡,goodnight,sleep
fever_care|发烧照顾|Fever Care|ballad|9|maj|62|sad|发烧,生病,喂药,fever,sick
one_umbrella|一把伞|One Umbrella|rain|2|maj|70|cano|一把伞,撑伞,淋湿,umbrella,soaked
thunder_night|雷雨夜|Thunder Night|tension|7|min|74|minor|雷雨,暴雨,thunderstorm,storm
blackout|停电|Blackout|heart|0|min|64|minor|停电,一片漆黑,blackout,power out
one_bed|只有一张床|Only One Bed|heart|5|maj|60|cano|一张床,同床,只有一张,one bed
motel_neon|汽车旅馆|Motel Neon|lofi|4|dor|80|minor|汽车旅馆,motel
road_trip|公路旅行|Road Trip|drive|7|mix|108|pop|公路,自驾,旅行,road trip,highway
airport|机场|Airport|strings|0|maj|74|sad|机场,航班,登机口,airport,flight,gate
long_distance|异地|Long Distance|ambient|9|min|66|sad|异地,视频通话,时差,long distance,video call
late_call|深夜电话|Late Call|lofi|2|min|72|minor|深夜电话,来电,打给你,late call,phone call
waiting_text|等回复|Waiting for a Text|box|4|maj|80|pop|已读,不回,等消息,read receipt,texting
secret|秘密|Secret|mystery|9|min|70|minor|秘密,隐瞒,不能说,secret,hiding
clue|线索|Clue|mystery|2|dor|84|minor|线索,证据,调查,clue,evidence
heist|潜入|Heist|drive|5|min|120|minor|潜入,保险箱,偷走,heist,vault
gunfire|枪火|Gunfire|epic|1|phr|132|phr|枪战,开枪,子弹,gunfight,bullets
the_don|教父|The Don|tango|4|hm|88|minor|家族,教父,黑手党,mafia,don
bratva_snow|雪原兄弟会|Bratva Snow|church|9|min|62|minor|兄弟会,伏特加,bratva,vodka
memory_lane|往事|Memory Lane|strings|5|maj|66|cano|小时候,那年,往事,childhood,back then
reunion|重逢|Reunion|ballad|0|maj|70|cano|重逢,好久不见,回来了,reunion,long time no see
amnesia|失忆|Amnesia|ambient|11|lyd|60|lyd|失忆,想不起来,amnesia,can't remember
ghost|幽灵|Ghost|mystery|6|phr|62|phr|鬼魂,幽灵,ghost,haunted
temple_bell|古寺钟声|Temple Bell|church|2|dor|56|minor|古寺,寺庙,钟声,temple,bell
palace_walls|宫墙|Palace Walls|strings|7|min|68|minor|宫墙,皇上,娘娘,emperor,imperial
jianghu|江湖|Jianghu|epic|9|min|110|minor|江湖,比武,剑客,swordsman,duel
wedding|婚礼|Wedding|church|0|maj|70|pop|婚礼,誓言,新郎,wedding,vows
contract_marriage|契约婚姻|Contract Marriage|noir|4|min|76|jazz|契约,协议,假结婚,contract marriage,deal
fake_dating|假戏真做|Fake Dating|latin|2|maj|98|pop|假扮,假装男友,演戏,fake dating,pretend
late_office|加班夜|Late at the Office|lofi|0|dor|78|jazz|加班,办公室,office,overtime
elevator|电梯|Elevator|box|7|lyd|86|lyd|电梯,elevator
convenience|便利店|Convenience Store|lofi|5|maj|84|pop|便利店,泡面,凌晨三点,convenience store
festival|夏日祭|Summer Festival|festival|0|maj|112|pop|祭典,庙会,夏日祭,festival,fair
christmas|圣诞夜|Christmas Eve|lullaby|2|maj|90|pop|圣诞,平安夜,christmas
new_year|跨年|New Year|festival|7|maj|120|pop|跨年,倒数,新年,new year,countdown
birthday|生日|Birthday|pizz|0|maj|108|pop|生日,蛋糕,许愿,birthday,cake
heartbreak|心碎|Heartbreak|strings|9|min|58|sad|分手,心碎,哭了,breakup,heartbreak
apology|道歉|Apology|ballad|4|min|62|sad|对不起,道歉,原谅我,sorry,forgive
the_kiss|吻|The Kiss|heart|2|lyd|58|lyd|吻,亲吻,嘴唇,kiss,lips
alone|独舞|Alone|waltz|9|min|78|sad|孤单,一个人,寂寞,alone,lonely
victory|胜利|Victory|epic|0|maj|120|pop|赢了,冠军,胜利,victory,champion
defeat|失败|Defeat|strings|4|min|60|minor|输了,失败,defeat,lost
training|训练|Training Montage|drive|7|dor|126|minor|训练,健身房,拳击,training,gym
the_lab|实验室|The Lab|ambient|1|lyd|70|lyd|实验室,实验,lab,experiment
android|仿生人|Android Heart|chip|9|min|96|minor|仿生人,机器人,android,robot
hacker|黑客|Hacker|drive|2|phr|130|phr|黑客,入侵,代码,hacker,code
poison|毒药|Poison|mystery|5|hm|66|minor|毒药,下毒,poison
the_hunt|狩猎|The Hunt|tension|0|min|100|minor|狩猎,猎人,猎物,hunt,prey
locked_room|密室|Locked Room|mystery|7|phr|88|phr|密室,被锁,困住,locked room,trapped
auction|拍卖会|Auction|noir|9|dor|84|jazz|拍卖,竞价,auction,bid
the_will|遗嘱|The Will|strings|2|hm|66|minor|遗嘱,继承人,遗产,will,heir,inheritance
vineyard|葡萄园|Vineyard|latin|5|maj|88|jazz|葡萄园,酒庄,红酒,vineyard,wine
paris_walk|巴黎漫步|Paris Walk|waltz|0|maj|96|pop|巴黎,塞纳河,paris
tokyo_night|东京夜|Tokyo Night|lofi|4|min|82|minor|东京,居酒屋,tokyo,izakaya
snow_cabin|雪山小屋|Snow Cabin|ballad|7|maj|64|pop|小屋,壁炉,雪山,cabin,fireplace
dawn|天亮了|Dawn|ambient|2|lyd|68|lyd|天亮,黎明,清晨,dawn,sunrise
finale|终章|Finale|epic|9|maj|76|cano|终章,最后一战,终于,finale,at last
hush_still|静默|Stillness|ambient|0|lyd|50|lyd|寂静,一动不动,stillness,dead silent
end_credits|片尾|End Credits|ballad|5|maj|72|cano|片尾,尾声,谢幕,epilogue,credits`;
const BGM100=BGM100_SRC.split("\n").map(l=>{const [id,zh,en,st,root,mode,bpm,prog,kw]=l.split("|");return {id:"m_"+id,zh,en,st,root:+root,mode,bpm:+bpm,prog,kw:kw.split(",")}});
(function(){const X=window.__SC;if(!X)return;const {SC_M,I,C}=X;
 const MODE={maj:[0,2,4,5,7,9,11],min:[0,2,3,5,7,8,10],dor:[0,2,3,5,7,9,10],lyd:[0,2,4,6,7,9,11],phr:[0,1,3,5,7,8,10],hm:[0,2,3,5,7,8,11],mix:[0,2,4,5,7,9,10]};
 const PROG={pop:[0,4,5,3],cano:[0,4,5,2,3,0,3,4],sad:[5,3,0,4],minor:[0,5,2,6],jazz:[1,4,0,0],lyd:[0,1,0,4],phr:[0,1,0,6]};
 const deg=(sc,d)=>sc[((d%7)+7)%7]+12*Math.floor(d/7);
 function chordsOf(root,mode,prog,seven){const sc=MODE[mode]||MODE.maj;return (PROG[prog]||PROG.pop).map(d=>{const r=36+((root+sc[d%7])%12);const v=[0,2,4].concat(seven?[6]:[]).map(k=>55+root+deg(sc,d+k));
  while(v[0]>62)v.forEach((x,i)=>v[i]-=12);while(v[0]<52)v.forEach((x,i)=>v[i]+=12);return C(r,...v)})}
 const rnd=(a,b)=>a+Math.random()*(b-a);
 /* 21 arrangement styles — each is one play(s) callback driven by the 16-step sequencer in app31 */
 const ST={
  ballad(s){const{V,t,i,c,d16,bar}=s;if(i===0){I.pad(V,c.v,t,d16*17,{wave:"triangle",cut:1300,vel:.05,att:1.4});I.bass(V,c.r,t,d16*14,.2)}
   const up=c.v.concat([c.v[0]+12,c.v[1]+12]);if(i%2===0)I.pno(V,up[(i/2+(bar%2))%up.length]+12,t,.06,{dur:2.4})},
  rain(s){const{V,t,i,c,d16,bar}=s;ST.ballad(s);if(i%2===1)I.noise(V,t,.05,.008+Math.random()*.01,"highpass",5200,.4);if(i===0&&bar%4===0)I.noise(V,t,d16*16,.012,"lowpass",900,.3,1.5)},
  jazz(s){const{V,t,i,c,nc,d16,sw,bar}=s;if(i===0){c.v.forEach((n,j)=>I.ep(V,n,t+j*.02,.07,{dur:3}));}
   if(i%4===0){const R=36+(c.r%12),NR=36+(nc.r%12),n=[R,R+7,R+12-(bar%2?2:0),NR+(NR>R?-1:1)][i/4];I.bass(V,n>48?n-12:n,t,d16*3.6,.28,{pl:1})}
   if(i===4||i===12)I.brush(V,t,.045);if(i%4===2)I.noise(V,t+sw,.06,.016,"bandpass",6500,1.2);if(bar%2&&i===10)I.ep(V,c.v[c.v.length-1]+12,t+sw,.04,{dur:1.6,bark:.8})},
  noir(s){const{V,t,i,c,d16,bar}=s;if(i===0){I.pad(V,c.v,t,d16*17,{cut:800,vel:.05,att:1})}if(i%4===0)I.bass(V,c.r,t,d16*3.4,.24,{pl:1});
   if(i===6||i===14)c.v.slice(1).forEach((n,j)=>I.ep(V,n,t+j*.015,.04,{dur:1.1,bark:.7}));if(i===4||i===12)I.brush(V,t,.04)},
  lullaby(s){const{V,t,i,c,d16,bar}=s;if(i===0)I.pad(V,c.v,t,d16*17,{wave:"sine",cut:1500,vel:.04,att:1.6,mono:1});
   if(i%2===0){const up=c.v.concat(c.v.map(n=>n+12));I.box(V,up[(i/2*(bar%2?3:1))%up.length]+12,t,.045,{dur:2.4})}},
  box(s){const{V,t,i,c,d16}=s;if(i===0){I.pad(V,c.v,t,d16*17,{cut:1700,vel:.035,att:1,mono:1});I.bass(V,c.r,t,d16*8,.16)}if([0,3,6,8,11,14].includes(i))I.box(V,c.v[i%c.v.length]+24,t,.04,{dur:1.6})},
  heart(s){const{V,t,i,c,d16,bar}=s;if(i===0){I.pad(V,c.v,t,d16*17,{cut:1000,vel:.055,att:1.8,vib:4});}if(i===0||i===8)I.heart(V,t,.24);if(i===12&&bar%2)I.pno(V,c.v[c.v.length-1]+12,t,.05,{dur:3})},
  strings(s){const{V,t,i,c,d16,bar}=s;if(i===0){I.pad(V,c.v,t,d16*17,{cut:2100,vel:.085,att:1.6,vib:6});I.bass(V,c.r,t,d16*15,.2)}if(i===8&&bar%2===0)I.pno(V,c.v[c.v.length-1]+12,t,.05,{dur:3.4})},
  ambient(s){const{V,t,i,c,d16,bar}=s;if(i===0&&bar%2===0)I.pad(V,c.v.concat([c.v[0]+12]),t,d16*33,{wave:"sine",cut:1800,vel:.06,att:3,rel:3});if(i===0&&bar%4===1)I.box(V,c.v[1]+24,t,.025,{dur:4});if(i%8===4)I.crackle(V,t,.004)},
  tension(s){const{V,t,i,c,d16,bar}=s;if(i===0)I.pad(V,[c.v[0],c.v[0]+1],t,d16*17,{cut:700,vel:.05,att:1.2});if(i%2===0)I.pulse(V,c.r,t,d16*1.6,.08,260);if(i===0&&bar%2===0)I.boom(V,t,.2);if(bar%4===3&&i===0)I.riser(V,t,d16*15,.05)},
  drive(s){const{V,t,i,c,d16}=s;if(i%4===0)I.kick(V,t,.32);if(i===4||i===12)I.snare(V,t,.14);if(i%2===1)I.hat(V,t,.03);if(i%2===0)I.pulse(V,c.r,t,d16*1.5,.07,420);if(i===0)I.pad(V,c.v,t,d16*17,{cut:1600,vel:.04,att:.6})},
  epic(s){const{V,t,i,c,d16,bar}=s;if(i===0){I.pad(V,c.v.concat([c.v[0]-12]),t,d16*17,{cut:2400,vel:.09,att:.9,vib:5});I.bass(V,c.r,t,d16*15,.26)}if(i===0||i===10)I.boom(V,t,.28);if(i===6||i===14)I.boom(V,t,.12);if(bar%4===3&&i===0)I.riser(V,t,d16*16,.06)},
  church(s){const{V,t,i,c,d16,bar}=s;if(i===0){I.pad(V,c.v.concat([c.v[0]+12,c.r+12]),t,d16*17,{wave:"square",cut:1200,vel:.05,att:.5,mono:1});I.bass(V,c.r,t,d16*15,.2)}if(i===0&&bar%4===0)I.box(V,c.v[0]+24,t,.03,{dur:5})},
  lofi(s){const{V,t,i,c,d16,sw}=s;if(i===0)c.v.forEach((n,j)=>I.ep(V,n,t+j*.03,.05,{dur:2.6,bark:.6}));if(i===0||i===10)I.kick(V,t,.2);if(i===4||i===12)I.snare(V,t,.07);if(i%2===1)I.hat(V,t+sw,.015);if(i%4===0)I.crackle(V,t,.006);if(i===0)I.bass(V,c.r,t,d16*6,.2)},
  tango(s){const{V,t,i,c,d16}=s;if([0,3,6,8].includes(i)){I.bass(V,c.r,t,d16*1.4,.28,{pl:1});c.v.forEach(n=>I.harp(V,n,t,.03,{dur:.5,br:3}))}if(i===12||i===14)I.pno(V,c.v[(i/2)%c.v.length]+12,t,.06,{dur:.9});if(i===0)I.pad(V,c.v,t,d16*16,{cut:900,vel:.04,att:.3})},
  latin(s){const{V,t,i,c,d16}=s;if([0,3,6,10,12].includes(i))c.v.forEach((n,j)=>I.ep(V,n,t+j*.01,.035,{dur:.8,bark:.6}));if(i===0||i===6||i===8||i===14)I.bass(V,i<8?c.r:c.r+7,t,d16*2,.24,{pl:1});if(i%2===0)I.noise(V,t,.05,.012,"highpass",6000,.4)},
  pizz(s){const{V,t,i,c,d16,bar}=s;if(i%2===0)I.harp(V,c.v[(i/2)%c.v.length]+(i%4?12:0),t,.06,{dur:.5,br:4});if(i===0||i===8)I.bass(V,c.r,t,d16*2,.24,{pl:1});if(i===14&&bar%2)I.box(V,c.v[2]+24,t,.04,{dur:1})},
  chip(s){const{V,t,i,c,d16}=s;const arp=c.v.concat([c.v[0]+12]);if(i%1===0)I.pulse(V,arp[i%arp.length]+12,t,d16*.8,.03,2400);if(i%4===0)I.kick(V,t,.18);if(i===4||i===12)I.noise(V,t,.08,.05,"highpass",3000,.5);if(i===0)I.bass(V,c.r,t,d16*7,.18,{pl:1})},
  waltz(s){const{V,t,i,c,d16}=s;/* 12 steps = one 3/4 bar */if(i===0)I.bass(V,c.r,t,d16*3.5,.26,{pl:1});if(i===4||i===8)c.v.forEach((n,j)=>I.pno(V,n,t+j*.01,.035,{dur:.9}));if(i===0)I.pad(V,c.v,t,d16*12.5,{cut:1800,vel:.05,att:.8,vib:5});if(i===6)I.harp(V,c.v[c.v.length-1]+12,t,.04,{dur:1.4})},
  mystery(s){const{V,t,i,c,d16,bar}=s;if(i===0)I.pad(V,[c.v[0],c.v[1],c.v[0]+6],t,d16*17,{wave:"sine",cut:1100,vel:.05,att:2});if([0,5,10].includes(i))I.box(V,c.v[(i/5+bar)%c.v.length]+24,t,.03,{dur:2.2});if(i===8)I.bass(V,c.r,t,d16*6,.16)},
  festival(s){const{V,t,i,c,d16}=s;if(i%4===0)I.boom(V,t,.14);if(i%2===0)I.harp(V,c.v[(i/2)%c.v.length]+12,t,.05,{dur:.7});if(i===2||i===10)I.noise(V,t,.06,.03,"highpass",5000,.4);if(i===0){I.pad(V,c.v,t,d16*16,{cut:2000,vel:.04,att:.4});I.bass(V,c.r,t,d16*7,.2,{pl:1})}}};
 const REV={ambient:.45,church:.5,strings:.38,lullaby:.36,heart:.35,mystery:.4,epic:.32};
 BGM100.forEach(m=>{const seven=["jazz","noir","lofi","latin"].includes(m.st);
  SC_M[m.id]={bpm:m.bpm,sw:["jazz","lofi"].includes(m.st)?.55:0,rev:REV[m.st]||.26,lv:m.st==="drive"||m.st==="chip"?.5:.62,key:m.root,spb:m.st==="waltz"?12:16,prog:chordsOf(m.root,m.mode,m.prog,seven),play:ST[m.st]||ST.ballad};
  if(typeof BGM_MOODS!=="undefined")BGM_MOODS[m.id]={bpm:m.bpm,ch:[[SC_M[m.id].prog[0].r]],arp:[]};
  if(typeof BGM_NAME!=="undefined")BGM_NAME[m.id]="🎵 "+m.zh})})();
/* keyword picker: score = number of trigger words found (longer words weigh more) */
function bgmPick(text){const s=String(text||"").toLowerCase();let best=null,bs=0;BGM100.forEach(m=>{let sc=0;m.kw.forEach(k=>{if(k&&s.includes(k.toLowerCase()))sc+=Math.min(3,k.length/2)});if(sc>bs){bs=sc;best=m}});return bs>=1?best:null}
function bgmName(id){const m=BGM100.find(x=>x.id===id);return m?(CL()==="zh"?m.zh:m.en):(typeof BGM_NAME!=="undefined"&&BGM_NAME[id])||id}
function bgmAhead(th){const q=(th.pk&&th.pk.q)||[];for(let i=0;i<Math.min(q.length,10);i++){const b=q[i];if(!Array.isArray(b)||b[0]!=="sys")continue;if(b[1]==="scene")break;if(b[1]==="bgm")return true}return false}
/* when a scene opens and the author gave no cue, choose one from the scene's own words */
PKREG.add("app58_bgm100.js", function(th,b, next){const isScene=Array.isArray(b)&&b[0]==="sys"&&b[1]==="scene";const r=next(th,b);
 if(isScene&&r&&th.pk&&!bgmAhead(th)){try{const d=b[2]||{};const ahead=(th.pk.q||[]).slice(0,14).map(x=>Array.isArray(x)?(typeof x[2]==="string"?x[2]:Lz((x[2]||{}).txt)||""):"").join(" ");
  const m=bgmPick([d.place,d.time,ahead].join(" "));if(m&&th.pk.bgm!==m.id){th.pk.bgm=m.id;th.pk.bgmAuto=1;save();if(curT===th.id&&typeof bgmFollow==="function")bgmFollow(th,true)}}catch(_){}}
 return r});;
