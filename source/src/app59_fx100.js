/* ================= v2.3 · FX + SFX LIBRARY — 100 screen effects, 100 sound effects, keyword-triggered =================
   FX: one canvas/CSS overlay engine with 20 effect kinds (fall, rise, burst, streak, flash, tint, shake, glitch, pulse, fog, crack, siren…)
       × parameters = 100 named effects. Each lasts 1.2–4s, never blocks taps, and respects 「减少特效」 (S.fxOff / prefers-reduced-motion).
   SFX: synthesised one-shots built from tone/noise layers (no files) — 100 named sounds. Real recordings can replace any id later via SFX_FILES.
   Triggers: author directives ["sys","fx",{id}] / ["sys","sfx",{id}], or keywords in any line shown in a story (narration, dialogue, AI replies),
   with cooldowns (fx 7s, sfx 3s) so a scene never turns into fireworks. */
const FX100_SRC=`rain|下雨|Rain|streak|rain|rain|下雨,雨声,雨水,raining
downpour|暴雨|Downpour|streak|heavy|downpour|暴雨,倾盆,downpour
snow|下雪|Snow|fall|❄|wind|下雪,雪花,snowing,snowflakes
blizzard|暴风雪|Blizzard|fall|❄❄❄|wind|暴风雪,blizzard
sakura|樱花|Sakura|fall|🌸|chime|樱花,花瓣,sakura,petals
rose_petals|玫瑰花瓣|Rose Petals|fall|🌹|chime|玫瑰,rose petals,roses
leaves|落叶|Falling Leaves|fall|🍂|wind|落叶,秋天,autumn leaves
hearts_rise|心心飘起|Floating Hearts|rise|💗|sparkle|心动,好喜欢,crush,butterflies in
heart_burst|心跳炸开|Heart Burst|burst|💖|pop|告白,表白,我喜欢你,confess
shooting_star|流星|Shooting Star|streak|star|chime|流星,许愿,shooting star,make a wish
starry|星空|Starry Sky|twinkle|✦|none|星空,满天星,starry,stars above
fireflies|萤火虫|Fireflies|rise|•#FFE27A|none|萤火虫,fireflies
embers|火星|Embers|rise|•#FF8A3D|fire|篝火,壁炉,火星,campfire,fireplace,embers
sparks|火花|Sparks|burst|•#FFD34D|zap|火花,电光,sparks
confetti|彩纸|Confetti|burst|🎉🎊|pop|庆祝,派对,恭喜,party,congrats
fireworks|烟花|Fireworks|fireworks|#F0B77E|firework|烟花,fireworks
balloons|气球|Balloons|rise|🎈|pop|气球,balloon
bubbles|泡泡|Bubbles|rise|◯|bubble|泡泡,泡澡,bubbles,bath
money_rain|撒钱|Money Rain|fall|💵|coins|撒钱,一千万,支票,cash,million dollars
diamonds|钻石|Diamonds|fall|💎|chime|钻石,珠宝,diamond,jewelry
feathers|羽毛|Feathers|fall|🪶|none|羽毛,枕头大战,feathers,pillow fight
notes|音符|Music Notes|rise|🎵🎶|none|唱歌,哼歌,音乐响起,singing,humming
sleepy|困|Sleepy|rise|💤|none|困了,睡着了,sleepy,fell asleep
sweat|冷汗|Sweat Drop|burst|💦|none|冷汗,尴尬死,sweat,cringe
anger|怒|Anger|burst|💢|thud|气死,火大,furious,pissed
question|疑问|Question|burst|❓|blip|疑惑,什么意思,huh,confused
shock|震惊|Shock|burst|❗|sting|震惊,愣住,shocked,stunned
sparkle|闪亮|Sparkle|burst|✨|sparkle|惊艳,闪闪发光,gorgeous,dazzling
blush|脸红|Blush|tint|#FF7FA8|none|脸红,耳尖红,脸颊发烫,blush,flushed
flash_white|白闪|White Flash|flash|#FFFFFF|camera|拍照,快门,闪光灯,camera,shutter
flash_red|红闪|Red Flash|flash|#FF3B3B|hit|受伤,流血,中弹,bleeding,wounded
lightning|闪电|Lightning|light|#DDE6FF|thunder|闪电,打雷,雷声,lightning,thunder
shake|震动|Shake|shake|8|thud|摔倒,砸在,撞上,crashed,slammed
quake|地震|Quake|shake|18|rumble|地震,剧烈震动,earthquake
explosion|爆炸|Explosion|burst|💥|boom|爆炸,炸弹,explosion,bomb
glitch|故障|Glitch|glitch|#00E5FF|glitch|故障,信号中断,系统错误,glitch,signal lost
static|雪花屏|TV Static|static|#FFFFFF|static|监控,监视器,雪花屏,cctv,static
dizzy|眩晕|Dizzy|blur|6|none|头晕,醉了,眩晕,dizzy,drunk
tears|泪|Tears|fall|💧|drip|哭了,眼泪,泪水,tears,crying
heartbeat|心跳|Heartbeat|pulse|#FF4D6D|heartbeat|心跳,砰砰,心脏狂跳,heartbeat,heart pounding
breath_hold|屏息|Breath Held|vignette|#000000|none|屏住呼吸,屏息,held his breath,hold my breath
spotlight|聚光灯|Spotlight|spotlight|#FFF4D6|none|聚光灯,spotlight
fade_black|黑场|Fade to Black|fade|#000000|none|晕倒,昏迷,失去意识,fainted,passed out
fade_white|白场|Fade to White|fade|#FFFFFF|none|醒来,一片白光,woke up,white light
flashback|回忆滤镜|Flashback|tint|#C8A26B|none|回忆起,那年,小时候,flashback,remembered
dreamy|梦境|Dreamy|bokeh|#C9A7FF|chime|梦里,梦境,做梦,dream,dreaming
city_bokeh|城市光斑|City Bokeh|bokeh|#FFB86B|none|夜景,街灯,city lights,streetlights
candle|烛光|Candlelight|tint|#FFB14D|none|蜡烛,烛光,candle,candlelight
neon|霓虹|Neon|tint|#C86BFF|none|霓虹灯,夜店,neon,nightclub
moonlight|月光|Moonlight|tint|#7FA8FF|none|月光,月亮,moonlight
sunset|夕阳|Sunset|tint|#FF8A4D|none|夕阳,黄昏,晚霞,sunset,dusk
police|警灯|Police Lights|siren|#3B6BFF|siren|警车,警笛,police car,sirens
ambulance|救护车|Ambulance|siren|#FF3B3B|siren|救护车,急救车,ambulance
fog|雾|Fog|fog|#D8DEE8|wind|大雾,薄雾,fog,mist
smoke|烟|Smoke|rise|☁|none|抽烟,烟雾,cigarette,smoke
dust|尘埃|Dust Motes|rise|•#F3E3C0|none|尘埃,灰尘,阳光里,dust motes
ripple|涟漪|Ripple|ripple|#9FE3FF|drip|水面,涟漪,泳池,ripple,pool
underwater|水下|Underwater|tint|#2FB5B5|bubble|水下,潜水,沉下去,underwater,diving
glass_crack|玻璃裂|Glass Crack|crack|#FFFFFF|glass|玻璃碎,碎了一地,shattered,glass broke
frost|结冰|Frost|frost|#BFE6FF|ice|结冰,冻住,结霜,frozen,frost
blaze|火海|Blaze|tint|#FF5A1F|fire|着火了,火海,大火,on fire,blaze
magic_circle|法阵|Magic Circle|circle|#B07CFF|magic|法阵,咒语,施法,spell,magic circle
enchant|魔法闪光|Enchant|burst|✦|magic|变身,魔法,enchant,magic
wings|翅膀|Wings|burst|🪽|whoosh|翅膀,天使,wings,angel
bats|蝙蝠|Bats|fall|🦇|flutter|蝙蝠,bats
crows|乌鸦|Crows|fall|🐦‍⬛|flutter|乌鸦,crows,ravens
butterflies|蝴蝶|Butterflies|rise|🦋|none|蝴蝶,butterflies
blood_moon|血月|Blood Moon|tint|#B3001B|none|血月,猩红,blood moon
wolf_eyes|狼眼|Wolf Eyes|eyes|#FFC24D|growl|眼睛发光,狼眼,glowing eyes,wolf eyes
fangs|獠牙|Fangs|tint|#8A0018|none|獠牙,咬住,fangs,bit
hologram|全息|Hologram|static|#45E9FF|blip|全息,投影,hologram
warp|跃迁|Warp|streak|warp|whoosh|跃迁,超光速,warp,hyperspace
speed|速度线|Speed Lines|streak|speed|whoosh|冲过去,飞奔,dashed,sprinted
slowmo|慢动作|Slow Motion|vignette|#1A1030|none|慢动作,时间停了,slow motion,time stopped
zoom|镜头推进|Zoom In|zoom|1.06|sting|死死盯着,凝视,stared,zoom in
cinema|电影黑边|Cinema Bars|letterbox|#000000|none|那一刻,电影般,that moment,cinematic
type|打字机|Typewriter|static|#F3E3C0|type|打字,敲键盘,typing
phone_buzz|手机震动|Phone Buzz|shake|3|buzz|手机震,震动了一下,phone buzzed,vibrated
notify|通知|Notification|burst|🔔|ding|新消息,通知,notification,new message
steam|热气|Steam|rise|♨|none|热茶,冒热气,steam,hot tea
cherries|樱桃|Cherries|fall|🍒|pop|樱桃,cherries
cake|蛋糕|Cake|burst|🎂|pop|生日蛋糕,birthday cake
gift|礼物|Gift|burst|🎁|chime|礼物,送你的,gift,present
ring|戒指|Ring|burst|💍|chime|求婚,戒指,proposal,ring
kiss_mark|吻|Kiss|burst|💋|kiss|吻了,亲了一下,kissed
hold_hands|牵手|Hold Hands|burst|🤝|none|牵手,握住他的手,held hands
sunflowers|向日葵|Sunflowers|rise|🌻|none|向日葵,花田,sunflowers
cats|猫|Cats|fall|🐾|meow|猫咪,小猫,cat,kitten
puppies|狗|Puppies|fall|🐶|bark|小狗,狗狗,puppy,dog
trophy|奖杯|Trophy|burst|🏆|fanfare|奖杯,夺冠,trophy,won the title
dice|骰子|Dice|burst|🎲|dice|骰子,掷骰,dice,roll
cards|扑克|Cards|fall|🃏|shuffle|扑克,牌局,poker,cards
key|钥匙|Key|burst|🗝|unlock|钥匙,解锁,key,unlocked
lock|上锁|Lock|burst|🔒|lock|锁上了,上锁,locked
danger|危险|Danger|burst|☠|sting|危险,死亡,danger,deadly
watched|被盯|Being Watched|eyes|#FFFFFF|sting|有人在看,被监视,being watched,someone watching
clock|时间|Clock|burst|⏰|tick|倒计时,来不及,countdown,running out of time
sun_rays|阳光|Sun Rays|rays|#FFD98A|none|阳光,晴天,sunlight,sun rays
rainbow|彩虹|Rainbow|rays|rainbow|chime|彩虹,雨停了,rainbow
lanterns|孔明灯|Sky Lanterns|rise|🏮|none|孔明灯,放灯,灯笼,sky lanterns,lanterns`;
const SFX100_SRC=`rain|雨声|Rain|n,highpass,5000,5000,2.6,.05,0,.5|雨声,淅淅沥沥
downpour|暴雨声|Downpour|n,lowpass,1800,1800,3,.12,0,.5;n,highpass,6000,6000,3,.05,0,.4|哗啦啦,倾盆
wind|风声|Wind|n,bandpass,400,1200,2.4,.08,0,3|呼呼的风,风声,wind howled
chime|风铃|Chime|t,1568,1568,1.6,sine,.08,0;t,2093,2093,1.4,sine,.06,.12;t,2637,2637,1.2,sine,.05,.24|风铃,叮铃
sparkle|闪光|Sparkle|t,2400,3600,.25,sine,.05,0;t,3000,4200,.2,sine,.04,.08;t,3600,5000,.2,sine,.03,.16|闪闪
pop|啵|Pop|t,600,1200,.08,sine,.18,0|啵,pop
zap|电击|Zap|t,1800,200,.25,sawtooth,.08,0;n,highpass,3000,3000,.2,.06,0,.5|电击,滋啦
fire|火焰|Fire|n,lowpass,600,600,2.4,.08,0,.4;n,highpass,4000,4000,2.2,.02,0,.5|噼啪,燃烧
firework|烟花|Firework|t,300,1800,.6,sine,.06,0;n,lowpass,1200,300,.9,.25,.6,.5|嘭的一声烟花
bubble|气泡|Bubble|t,400,900,.07,sine,.12,0;t,500,1100,.07,sine,.1,.12;t,450,1000,.07,sine,.08,.25|咕嘟
coins|金币|Coins|t,2600,2600,.18,square,.04,0;t,3100,3100,.18,square,.04,.07;t,2800,2800,.2,square,.03,.14|叮当,硬币
thud|闷响|Thud|t,140,50,.25,sine,.35,0;n,lowpass,300,200,.2,.15,0,.6|咚,闷响,thud
blip|提示|Blip|t,880,880,.08,square,.05,0;t,1320,1320,.1,square,.05,.09|嘀
sting|紧张刺|Sting|t,220,233,1.2,sawtooth,.07,0;t,440,466,1.2,sawtooth,.04,0;n,highpass,2000,6000,.6,.04,0,.5|刺耳
camera|快门|Shutter|n,highpass,3000,3000,.04,.2,0,.5;n,highpass,2500,2500,.05,.15,.09,.5|咔嚓,快门声
hit|击中|Hit|t,200,60,.18,square,.2,0;n,lowpass,900,300,.15,.2,0,.6|砰,hit
thunder|雷声|Thunder|n,lowpass,900,120,2.8,.4,0,.5;t,60,40,1.8,sine,.2,0|轰隆,雷鸣
rumble|隆隆|Rumble|n,lowpass,160,80,2.5,.35,0,.6;t,45,35,2.4,sine,.2,0|隆隆,震动
boom|爆炸声|Boom|t,90,30,1.5,sine,.5,0;n,lowpass,1500,100,1.6,.5,0,.5|轰,爆炸声
glitch|电流|Glitch|t,120,2400,.06,square,.06,0;t,3000,200,.05,square,.05,.08;n,bandpass,2000,2000,.08,.08,.15,4|滋滋,电流声
static|噪声|Static|n,bandpass,3000,3000,1.2,.07,0,.3|沙沙,杂音
heartbeat|心跳声|Heartbeat|t,62,40,.18,sine,.5,0;t,58,38,.16,sine,.35,.26;t,62,40,.18,sine,.5,.95;t,58,38,.16,sine,.35,1.21|咚咚,心跳声
siren|警笛|Siren|t,700,1100,.5,triangle,.06,0;t,1100,700,.5,triangle,.06,.5;t,700,1100,.5,triangle,.06,1;t,1100,700,.5,triangle,.06,1.5|警笛,鸣笛
drip|水滴|Drip|t,1400,500,.1,sine,.12,0;t,1300,450,.1,sine,.08,.6|滴答,水滴
glass|玻璃碎|Glass|n,highpass,4000,4000,.6,.2,0,.5;t,3200,3000,.4,sine,.05,0;t,4100,3900,.35,sine,.04,.03;t,5200,5000,.3,sine,.03,.06|哗啦一声,碎裂
ice|冰裂|Ice|t,2600,1800,.2,sine,.05,0;n,highpass,6000,6000,.25,.06,0,.5;t,3400,2400,.15,sine,.04,.15|咔咔
magic|魔法|Magic|t,880,1760,.6,sine,.05,0;t,1320,2640,.6,sine,.04,.1;t,1760,3520,.6,sine,.03,.2;n,highpass,5000,9000,.8,.02,0,.5|叮——魔法
whoosh|呼啸|Whoosh|n,bandpass,300,2400,.45,.18,0,1.5|嗖,呼啸而过
flutter|扑翅|Flutter|n,bandpass,900,900,.05,.1,0,2;n,bandpass,900,900,.05,.1,.09,2;n,bandpass,900,900,.05,.1,.18,2;n,bandpass,900,900,.05,.08,.27,2|扑棱
growl|低吼|Growl|t,90,70,1.1,sawtooth,.12,0;n,lowpass,300,300,1,.1,0,1|低吼,咆哮
type|打字声|Typing|n,highpass,2500,2500,.03,.12,0,.5;n,highpass,2500,2500,.03,.1,.12,.5;n,highpass,2500,2500,.03,.12,.21,.5;n,highpass,2500,2500,.03,.1,.36,.5|哒哒哒
buzz|震动声|Buzz|t,150,150,.35,sawtooth,.06,0;t,150,150,.35,sawtooth,.06,.55|嗡嗡
ding|叮咚|Ding|t,1318,1318,.5,sine,.1,0;t,1046,1046,.7,sine,.1,.25|叮咚
kiss|啾|Kiss|t,1800,900,.07,sine,.08,0;n,bandpass,3000,3000,.05,.05,0,2|啾
meow|喵|Meow|t,700,1100,.15,triangle,.08,0;t,1100,600,.35,triangle,.08,.15|喵
bark|汪|Bark|t,500,300,.12,sawtooth,.12,0;t,520,310,.12,sawtooth,.1,.25|汪汪
fanfare|号角|Fanfare|t,523,523,.18,square,.06,0;t,659,659,.18,square,.06,.18;t,784,784,.18,square,.06,.36;t,1046,1046,.6,square,.07,.54|号角,凯旋
dice|骰子声|Dice|n,highpass,2500,2500,.05,.15,0,.5;n,highpass,2500,2500,.05,.12,.12,.5;n,highpass,2500,2500,.05,.08,.22,.5|骰子落桌
shuffle|洗牌|Shuffle|n,highpass,3500,3500,.6,.08,0,.5|洗牌
unlock|开锁|Unlock|n,highpass,2000,2000,.04,.2,0,.5;t,900,1400,.08,square,.05,.1|咔哒开锁
lock|上锁声|Lock|t,1400,900,.08,square,.05,0;n,highpass,2000,2000,.05,.2,.08,.5|咔哒上锁
tick|滴答|Tick|n,highpass,4000,4000,.02,.15,0,.5;n,highpass,3000,3000,.02,.12,.5,.5;n,highpass,4000,4000,.02,.15,1,.5;n,highpass,3000,3000,.02,.12,1.5,.5|滴答滴答
knock|敲门|Knock|t,180,110,.09,sine,.35,0;n,lowpass,500,500,.06,.2,0,.8;t,180,110,.09,sine,.35,.2;n,lowpass,500,500,.06,.2,.2,.8;t,180,110,.09,sine,.35,.4|敲门,咚咚咚,knock,knocked
door_open|开门|Door Opens|t,220,180,.6,sawtooth,.03,0;n,bandpass,800,500,.6,.06,0,2|推开门,门开了,door opened
door_slam|摔门|Door Slam|t,120,40,.35,sine,.5,0;n,lowpass,700,150,.35,.4,0,.6|摔门,砰地关上,slammed the door
footsteps|脚步|Footsteps|n,lowpass,600,600,.07,.2,0,.8;n,lowpass,600,600,.07,.18,.45,.8;n,lowpass,600,600,.07,.2,.9,.8;n,lowpass,600,600,.07,.18,1.35,.8|脚步声,走近,footsteps
heels|高跟鞋|Heels|n,highpass,1800,1800,.04,.2,0,1;n,highpass,1800,1800,.04,.18,.35,1;n,highpass,1800,1800,.04,.2,.7,1|高跟鞋,heels
bell|铃|Bell|t,880,880,1.6,sine,.1,0;t,2210,2210,1.2,sine,.04,0|铃声,门铃响
church_bell|钟声|Church Bell|t,330,330,3,sine,.14,0;t,792,792,2.4,sine,.06,0;t,1040,1040,2,sine,.03,0|钟声,教堂钟,church bells
phone_ring|电话铃|Phone Ring|t,1400,1400,.12,square,.04,0;t,1750,1750,.12,square,.04,.12;t,1400,1400,.12,square,.04,.24;t,1750,1750,.12,square,.04,.36;t,1400,1400,.12,square,.04,.9;t,1750,1750,.12,square,.04,1.02|电话响,来电铃,phone rang
text_tone|短信|Text Tone|t,1568,1568,.12,sine,.08,0;t,2093,2093,.2,sine,.08,.13|短信,收到消息,text came in
keyboard|键盘|Keyboard|n,highpass,3000,3000,.025,.1,0,.5;n,highpass,3000,3000,.025,.1,.08,.5;n,highpass,3000,3000,.025,.1,.15,.5;n,highpass,3000,3000,.025,.1,.27,.5;n,highpass,3000,3000,.025,.1,.33,.5|键盘声,敲代码
page_turn|翻页|Page Turn|n,bandpass,2500,1200,.35,.08,0,1|翻页,翻书,turned the page
pen|写字|Pen|n,highpass,4000,4000,.5,.03,0,1|写字,签名,signed
zipper|拉链|Zipper|n,bandpass,2500,4000,.4,.06,0,3|拉链,zipper
clap|拍手|Clap|n,bandpass,1500,1500,.08,.3,0,1|拍手,鼓掌一下
applause|掌声|Applause|n,bandpass,2000,2000,2.4,.12,0,.5|掌声,鼓掌,applause
crowd|人群|Crowd|n,bandpass,600,600,2.6,.06,0,.6|人群,嘈杂,crowd
cheer|欢呼|Cheer|n,bandpass,1200,2000,1.8,.12,0,.8;t,600,900,1.2,sawtooth,.02,0|欢呼,尖叫,cheered
car_horn|喇叭|Car Horn|t,415,415,.4,sawtooth,.06,0;t,349,349,.4,sawtooth,.05,0|喇叭,鸣笛
engine|引擎|Engine|t,60,140,1.6,sawtooth,.07,0;n,lowpass,400,800,1.6,.06,0,.6|引擎轰鸣,发动车子,engine roared
brakes|刹车|Brakes|n,bandpass,3000,3600,.9,.12,0,6|急刹车,刹车,brakes screeched
train|火车|Train|n,lowpass,500,500,.15,.15,0,.6;n,lowpass,500,500,.15,.15,.3,.6;n,lowpass,500,500,.15,.15,.6,.6;n,lowpass,500,500,.15,.15,.9,.6;t,600,600,.8,square,.03,1.2|火车进站,列车
plane|飞机|Plane|n,lowpass,700,300,3,.1,0,.4|飞机起飞,轰鸣
waves|海浪|Waves|n,lowpass,500,1500,1.6,.1,0,.5;n,lowpass,1500,400,1.6,.08,1.6,.5|海浪声,浪花
birds|鸟鸣|Birds|t,3200,4200,.08,sine,.04,0;t,3600,4600,.08,sine,.04,.15;t,3000,4000,.1,sine,.03,.7;t,3800,4800,.07,sine,.03,.85|鸟叫,鸟鸣,birds chirping
crickets|蟋蟀|Crickets|t,4500,4500,.05,square,.012,0;t,4500,4500,.05,square,.012,.08;t,4500,4500,.05,square,.012,.6;t,4500,4500,.05,square,.012,.68|虫鸣,蟋蟀,crickets
owl|猫头鹰|Owl|t,420,380,.3,sine,.08,0;t,400,360,.5,sine,.08,.45|猫头鹰,owl
clock_chime|座钟|Clock Chime|t,523,523,1.2,sine,.08,0;t,659,659,1.2,sine,.08,.6;t,784,784,1.2,sine,.08,1.2;t,523,523,1.8,sine,.08,1.8|座钟,钟敲
elevator|电梯到|Elevator Ding|t,1046,1046,.6,sine,.1,0|电梯到了,叮的一声
register|收银|Register|t,2093,2093,.3,sine,.07,0;n,highpass,3000,3000,.15,.1,.05,.5|收银,付钱,cash register
slot|老虎机|Slot|t,880,1760,.1,square,.04,0;t,1046,2093,.1,square,.04,.12;t,1318,2637,.25,square,.04,.24|中奖,jackpot
sword|拔剑|Sword|n,highpass,3000,8000,.5,.12,0,4;t,2400,2200,.6,sine,.03,0|拔剑,剑出鞘,drew his sword
gunshot|枪声|Gunshot|n,lowpass,3000,200,.35,.5,0,.5;t,150,40,.2,sine,.3,0|枪声,开枪,gunshot
reload|上膛|Reload|n,highpass,2000,2000,.04,.2,0,.5;n,highpass,1500,1500,.05,.2,.15,.5|上膛,咔嚓上膛
punch|拳|Punch|t,160,60,.15,sine,.4,0;n,lowpass,1200,300,.1,.25,0,.6|一拳,打在脸上,punched
slap|耳光|Slap|n,highpass,1500,1500,.08,.35,0,.6|耳光,扇了,slapped
splash|水花|Splash|n,lowpass,2500,600,.8,.25,0,.6|扑通,跳进水里,splash
pour|倒酒|Pour|n,bandpass,1200,2200,1.2,.05,0,2|倒酒,倒了一杯,poured
clink|碰杯|Clink|t,3100,3100,.8,sine,.06,0;t,4200,4200,.6,sine,.04,.01|碰杯,干杯,cheers,clinked
cork|开香槟|Cork Pop|t,500,1500,.06,sine,.25,0;n,highpass,3000,3000,.4,.06,.05,.5|开香槟,香槟,pop the champagne
sizzle|滋滋|Sizzle|n,highpass,4500,4500,2,.06,0,.4|煎,滋滋,sizzling
microwave|微波炉|Microwave|t,2000,2000,.2,square,.04,0;t,2000,2000,.2,square,.04,.35;t,2000,2000,.2,square,.04,.7|微波炉,叮好了
kettle|水壶|Kettle|t,1800,2600,1.8,sine,.03,0;n,highpass,4000,4000,1.8,.03,0,.5|水开了,烧水壶
swipe|划屏|Swipe|n,bandpass,1000,3000,.18,.08,0,1|划开,滑动
error|错误|Error|t,200,200,.25,square,.07,0;t,160,160,.35,square,.07,.25|错误,失败了,error
success|成功|Success|t,784,784,.12,sine,.08,0;t,1046,1046,.12,sine,.08,.12;t,1568,1568,.3,sine,.08,.24|成功了,搞定,success
levelup|升级|Level Up|t,523,1046,.15,square,.04,0;t,659,1318,.15,square,.04,.15;t,784,1568,.3,square,.04,.3|升级,level up
coin|金币|Coin|t,988,988,.08,square,.05,0;t,1318,1318,.3,square,.05,.08|金币,coin
alarm|闹钟|Alarm|t,2000,2000,.1,square,.05,0;t,2000,2000,.1,square,.05,.2;t,2000,2000,.1,square,.05,.4;t,2000,2000,.1,square,.05,.6|闹钟响,alarm
radio|调频|Radio Tune|t,400,2000,.8,sine,.03,0;n,bandpass,2000,2000,.8,.05,0,.5|收音机,电台,radio
vinyl|唱片|Vinyl|n,highpass,3000,3000,2,.01,0,.5;t,60,60,2,sine,.01,0|唱片,黑胶,vinyl
piano_note|钢琴|Piano Note|t,523,523,1.6,triangle,.1,0;t,1046,1046,1.2,sine,.03,0|钢琴,弹琴,piano
guitar|吉他|Guitar|t,196,196,1.2,triangle,.08,0;t,247,247,1.2,triangle,.07,.03;t,294,294,1.2,triangle,.07,.06;t,392,392,1.2,triangle,.06,.09|吉他,弹吉他,guitar
harp|竖琴|Harp Gliss|t,523,523,.6,triangle,.05,0;t,659,659,.6,triangle,.05,.05;t,784,784,.6,triangle,.05,.1;t,1046,1046,.6,triangle,.05,.15;t,1318,1318,.8,triangle,.05,.2|竖琴,harp
gong|锣|Gong|t,110,105,3,sine,.2,0;t,227,220,2.6,sine,.08,0;n,bandpass,600,300,2,.04,0,1|锣声,gong
drumroll|鼓点|Drum Roll|n,bandpass,1800,1800,1.6,.12,0,.8;t,200,150,.3,triangle,.2,1.6|鼓点,揭晓,drumroll
rimshot|梗|Rimshot|n,bandpass,1900,1900,.1,.2,0,.8;n,bandpass,1900,1900,.1,.2,.18,.8;t,4000,4000,.4,sine,.03,.4|冷笑话,badum
whistle|口哨|Whistle|t,1800,2400,.25,sine,.06,0;t,2400,1600,.35,sine,.06,.3|吹口哨,whistled
howl|狼嚎|Wolf Howl|t,400,700,1.2,sine,.08,0;t,700,500,1.4,sine,.08,1.2|狼嚎,嚎叫,howled
flutter_heart|小鹿乱撞|Heart Flutter|t,80,60,.08,sine,.3,0;t,80,60,.08,sine,.3,.14;t,80,60,.08,sine,.3,.28;t,80,60,.08,sine,.25,.42|小鹿乱撞,心乱跳
breath|呼吸|Breath|n,bandpass,700,1100,.9,.05,0,1;n,bandpass,1000,600,1,.04,1,1|深呼吸,喘息,breathed in
gasp|倒吸气|Gasp|n,bandpass,1200,2600,.3,.08,0,1.5|倒吸一口气,gasped`;
const FX100=FX100_SRC.split("\n").map(l=>{const [id,zh,en,kind,p,sfx,kw]=l.split("|");return {id,zh,en,kind,p,sfx:sfx==="none"?null:sfx,kw:kw.split(",")}});
const SFX100=SFX100_SRC.split("\n").map(l=>{const [id,zh,en,rec,kw]=l.split("|");return {id,zh,en,L:rec.split(";").map(x=>x.split(",")),kw:(kw||"").split(",").filter(Boolean)}});
/* ---------- SFX synth ---------- */
const SFX_FILES=window.SFX_FILES||{};
function sfx100(id,vol){if(S.sfxOff)return;const s=SFX100.find(x=>x.id===id);if(!s)return;
 if(SFX_FILES[id]){try{const a=new Audio(SFX_FILES[id]);a.volume=.6*(vol||1);a.play().catch(()=>{})}catch(_){}return}
 try{if(typeof bgmInit==="function")bgmInit();const c=BGM.ctx;if(!c)return;if(c.state==="suspended")c.resume().catch(()=>{});const out=c.createGain();out.gain.value=.9*(vol||1);out.connect(c.destination);const t0=c.currentTime+.02;
  s.L.forEach(L=>{if(L[0]==="t"){const [,f0,f1,dur,wave,vel,dl]=L,t=t0+(+dl),o=c.createOscillator(),g=c.createGain();o.type=wave;o.frequency.setValueAtTime(+f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,+f1),t+(+dur));
    o.connect(g);g.connect(out);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(+vel,t+.008);g.gain.exponentialRampToValueAtTime(.0004,t+(+dur));o.start(t);o.stop(t+(+dur)+.05)}
   else{const [,type,f0,f1,dur,vel,dl,q]=L,t=t0+(+dl),src=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();src.buffer=BGM.noise;src.loop=true;f.type=type;f.Q.value=+q||.7;
    f.frequency.setValueAtTime(+f0,t);f.frequency.exponentialRampToValueAtTime(Math.max(20,+f1),t+(+dur));src.connect(f);f.connect(g);g.connect(out);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(+vel,t+Math.min(.05,(+dur)*.2));g.gain.exponentialRampToValueAtTime(.0004,t+(+dur));src.start(t);src.stop(t+(+dur)+.05)}})}catch(_){}}
/* ---------- FX engine ---------- */
function fxReduced(){return S.fxOff||(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)}
function fxHost(){return $("#s-chat")&&!$("#s-chat").hidden?$("#s-chat"):document.body}
function fx100(id,opt){const F=FX100.find(x=>x.id===id);if(!F)return;opt=opt||{};if(F.sfx&&!opt.silent)sfx100(F.sfx,.8);if(fxReduced()&&!opt.force)return;
 const host=fxHost(),ov=document.createElement("div");ov.className="fx100 fk-"+F.kind;ov.dataset.fx=id;host.appendChild(ov);const kill=ms=>setTimeout(()=>{ov.classList.add("out");setTimeout(()=>ov.remove(),500)},ms);
 const col=F.p&&F.p[0]==="#"?F.p:null;
 if(["flash","fade","tint","vignette","letterbox","spotlight","rays","fog","frost","siren","light"].includes(F.kind)){
  if(F.kind==="flash"){ov.style.background=col;kill(140)}
  else if(F.kind==="fade"){ov.style.background=col;kill(1300)}
  else if(F.kind==="tint"){ov.style.background="radial-gradient(ellipse at center,transparent 35%,"+col+"66 100%)";ov.style.mixBlendMode="soft-light";kill(3200)}
  else if(F.kind==="vignette"){ov.style.boxShadow="inset 0 0 140px 60px "+col;kill(2600)}
  else if(F.kind==="letterbox"){ov.innerHTML="<i></i><i></i>";kill(3000)}
  else if(F.kind==="spotlight"){ov.style.background="radial-gradient(circle at 50% 38%,transparent 18%,rgba(0,0,0,.72) 46%)";kill(2800)}
  else if(F.kind==="rays"){ov.style.background=F.p==="rainbow"?"linear-gradient(160deg,rgba(255,0,0,.12),rgba(255,165,0,.12),rgba(255,255,0,.12),rgba(0,200,0,.12),rgba(0,120,255,.12),rgba(140,0,255,.12))":"repeating-conic-gradient(from 200deg at 80% -10%,"+col+"33 0 6deg,transparent 6deg 14deg)";kill(3200)}
  else if(F.kind==="fog"){kill(3800)}else if(F.kind==="frost"){ov.style.boxShadow="inset 0 0 90px 30px "+col+"aa";kill(3000)}
  else if(F.kind==="siren"){ov.style.setProperty("--c1",col);kill(3000)}else if(F.kind==="light"){ov.style.background=col;kill(900)}
  return}
 if(F.kind==="shake"){const n=+F.p||8;host.style.setProperty("--shk",n+"px");host.classList.remove("fxshake");void host.offsetWidth;host.classList.add("fxshake");setTimeout(()=>host.classList.remove("fxshake"),600);ov.remove();return}
 if(F.kind==="zoom"){host.classList.remove("fxzoom");void host.offsetWidth;host.classList.add("fxzoom");setTimeout(()=>host.classList.remove("fxzoom"),1400);ov.remove();return}
 if(F.kind==="blur"){host.classList.add("fxblur");setTimeout(()=>host.classList.remove("fxblur"),2200);ov.remove();return}
 if(F.kind==="glitch"||F.kind==="static"){ov.style.setProperty("--c1",col||"#fff");kill(F.kind==="glitch"?900:1600);return}
 if(F.kind==="pulse"){ov.style.boxShadow="inset 0 0 120px 40px "+col+"88";kill(2600);return}
 if(F.kind==="crack"){ov.innerHTML='<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M52 40 L30 8 M52 40 L90 20 M52 40 L70 96 M52 40 L8 62 M52 40 L40 98 M52 40 L98 60 M30 8 L22 0 M8 62 L0 70" stroke="#fff" stroke-width=".5" fill="none" opacity=".85"/></svg>';kill(2400);return}
 if(F.kind==="circle"){ov.innerHTML='<div class="mc" style="border-color:'+col+';box-shadow:0 0 30px '+col+'"></div>';kill(2600);return}
 if(F.kind==="eyes"){ov.innerHTML='<div class="ey" style="--c1:'+col+'"><i></i><i></i></div>';kill(2400);return}
 if(F.kind==="ripple"){ov.innerHTML='<b></b><b></b><b></b>';ov.style.setProperty("--c1",col);kill(2400);return}
 /* particle kinds on a canvas */
 const cv=document.createElement("canvas"),W=innerWidth,H=innerHeight,dpr=Math.min(2,devicePixelRatio||1);cv.width=W*dpr;cv.height=H*dpr;ov.appendChild(cv);const g=cv.getContext("2d");g.scale(dpr,dpr);
 const P=[],emo=(window.Intl&&Intl.Segmenter?[...new Intl.Segmenter().segment((F.p||"").replace(/^[•#].*/,""))].map(x=>x.segment):[...(F.p||"").replace(/^[•#].*/,"")]).filter(x=>x.trim()&&x!=="️"),dot=F.p&&F.p[0]==="•"?F.p.slice(1):null,dur=F.kind==="burst"?1800:3200,t0=performance.now();
 const mk=()=>{const k=F.kind;if(k==="fall")return {x:Math.random()*W,y:-20,vx:(Math.random()-.5)*.6,vy:1+Math.random()*1.6*(F.p.length>2?2.2:1),r:Math.random()*6.28,vr:(Math.random()-.5)*.06,s:14+Math.random()*12};
  if(k==="rise"||k==="twinkle")return {x:Math.random()*W,y:k==="twinkle"?Math.random()*H*.6:H+10,vx:(Math.random()-.5)*.5,vy:k==="twinkle"?0:-(0.8+Math.random()*1.4),r:0,vr:0,s:12+Math.random()*12,ph:Math.random()*6};
  if(k==="burst"){const a=Math.random()*6.28,v=3+Math.random()*5;return {x:W/2,y:H*.42,vx:Math.cos(a)*v,vy:Math.sin(a)*v-2,r:0,vr:(Math.random()-.5)*.2,s:16+Math.random()*14,gv:.12}}
  if(k==="streak")return {x:Math.random()*W*1.2,y:-30-Math.random()*H*.3,vx:F.p==="warp"||F.p==="speed"?0:-1.2,vy:F.p==="heavy"?16:F.p==="star"?10:F.p==="warp"?0:9,len:F.p==="heavy"?26:F.p==="star"?60:16,s:1};
  if(k==="bokeh")return {x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,s:20+Math.random()*40,ph:Math.random()*6};
  if(k==="fireworks")return null;return {x:Math.random()*W,y:Math.random()*H,vx:0,vy:0,s:10}};
 const N={fall:F.p&&F.p.length>2?70:36,rise:26,twinkle:40,burst:40,streak:F.p==="heavy"?160:F.p==="star"?3:F.p==="warp"||F.p==="speed"?60:90,bokeh:18}[F.kind]||30;
 if(F.kind==="burst"||F.kind==="twinkle"||F.kind==="bokeh")for(let i=0;i<N;i++)P.push(mk());
 const fw=[];if(F.kind==="fireworks")[0,500,1000,1500].forEach(d=>setTimeout(()=>{const cx=W*(.2+Math.random()*.6),cy=H*(.15+Math.random()*.3),hue=Math.random()*360;for(let i=0;i<46;i++){const a=i/46*6.28,v=2+Math.random()*2.5;fw.push({x:cx,y:cy,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,h:hue})}},d));
 const step=now=>{const el=now-t0,fade=Math.max(0,Math.min(1,(dur+600-el)/600));g.clearRect(0,0,W,H);
  if(["fall","rise","streak"].includes(F.kind)&&el<dur)for(let i=0;i<(F.kind==="streak"?6:1.5);i++)if(P.length<N&&Math.random()<.9)P.push(mk());
  P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.gv)p.vy+=p.gv;p.r+=p.vr||0;g.globalAlpha=fade*(F.kind==="twinkle"?(.4+.6*Math.abs(Math.sin(el/400+p.ph))):F.kind==="bokeh"?.28:1);
   if(F.kind==="streak"){g.strokeStyle=F.p==="star"?"#FFF6D8":F.p==="warp"||F.p==="speed"?"rgba(255,255,255,.7)":"rgba(190,215,255,.55)";g.lineWidth=F.p==="star"?2:1;g.beginPath();
    if(F.p==="warp"||F.p==="speed"){const cx=W/2,cy=H/2,a=Math.atan2(p.y-cy,p.x-cx)||Math.random()*6.28;p.d=(p.d||Math.random()*40)+8;g.moveTo(cx+Math.cos(a)*p.d,cy+Math.sin(a)*p.d);g.lineTo(cx+Math.cos(a)*(p.d+30),cy+Math.sin(a)*(p.d+30))}
    else{g.moveTo(p.x,p.y);g.lineTo(p.x-p.vx*p.len/9,p.y-p.len)}g.stroke();return}
   if(F.kind==="bokeh"){g.fillStyle=col||"#fff";g.beginPath();g.arc(p.x,p.y,p.s,0,6.28);g.fill();return}
   if(dot||!emo.length){g.fillStyle=dot||col||"#fff";g.beginPath();g.arc(p.x,p.y+(p.ph?Math.sin(el/300+p.ph)*4:0),dot?2.6:(p.s/5),0,6.28);g.fill();return}
   g.save();g.translate(p.x,p.y);g.rotate(p.r);g.font=p.s+"px serif";g.textAlign="center";g.fillText(emo[(p.i=p.i??Math.floor(Math.random()*emo.length))],0,0);g.restore()});
  fw.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.04;p.l-=.012;if(p.l>0){g.globalAlpha=p.l;g.fillStyle="hsl("+p.h+",90%,65%)";g.beginPath();g.arc(p.x,p.y,2,0,6.28);g.fill()}});
  if(el<dur+600&&ov.isConnected)requestAnimationFrame(step);else ov.remove()};requestAnimationFrame(step)}
(function(){const st=document.createElement("style");st.textContent=`
.fx100{position:fixed;inset:0;pointer-events:none;z-index:85;transition:opacity .5s}.fx100.out{opacity:0}.fx100 canvas{width:100%;height:100%}
.fk-flash{animation:fxfl .16s ease-out}.fk-light{animation:fxlt .9s steps(1)}@keyframes fxlt{0%{opacity:.9}12%{opacity:0}22%{opacity:.7}32%,100%{opacity:0}}@keyframes fxfl{from{opacity:.95}to{opacity:0}}
.fk-fade{animation:fxfd 1.3s ease-in-out}@keyframes fxfd{0%{opacity:0}45%{opacity:1}100%{opacity:0}}
.fk-letterbox i{position:absolute;left:0;right:0;height:11%;background:#000;animation:fxlb 3s ease-in-out}.fk-letterbox i:first-child{top:0}.fk-letterbox i:last-child{bottom:0}@keyframes fxlb{0%{transform:scaleY(0)}15%,85%{transform:scaleY(1)}100%{transform:scaleY(0)}}
.fk-pulse{animation:fxpu .8s ease-in-out 3}@keyframes fxpu{0%,100%{opacity:.2}30%{opacity:1}}
.fk-siren{animation:fxsr .5s steps(1) 6;background:radial-gradient(circle at 10% 0,var(--c1) 0,transparent 45%)}@keyframes fxsr{50%{background:radial-gradient(circle at 90% 0,#FF3B3B 0,transparent 45%)}}
.fk-fog{background:radial-gradient(ellipse at 30% 60%,rgba(220,226,236,.35),transparent 60%),radial-gradient(ellipse at 75% 40%,rgba(220,226,236,.3),transparent 55%);animation:fxfg 3.8s ease-in-out}@keyframes fxfg{0%{opacity:0;transform:translateX(-6%)}30%,70%{opacity:1}100%{opacity:0;transform:translateX(6%)}}
.fk-glitch{background:repeating-linear-gradient(0deg,transparent 0 3px,rgba(255,255,255,.06) 3px 4px);animation:fxgl .12s steps(2) 7}.fk-glitch:before{content:"";position:absolute;inset:30% 0 55%;background:var(--c1);opacity:.25;mix-blend-mode:screen}@keyframes fxgl{50%{transform:translateX(6px);filter:hue-rotate(90deg)}}
.fk-static{background:repeating-linear-gradient(0deg,rgba(255,255,255,.08) 0 1px,transparent 1px 3px);animation:fxst .08s steps(3) 20;mix-blend-mode:screen}.fk-static:after{content:"";position:absolute;inset:0;background:var(--c1);opacity:.06}@keyframes fxst{50%{background-position:0 2px}}
.fk-crack svg{width:100%;height:100%}.fk-crack{animation:fxcr .2s}@keyframes fxcr{from{transform:scale(1.04)}}
.fk-circle .mc{position:absolute;left:50%;top:42%;width:62vw;height:62vw;max-width:340px;max-height:340px;transform:translate(-50%,-50%);border:2px solid;border-radius:50%;animation:fxmc 2.6s ease-in-out;outline:1px dashed rgba(255,255,255,.4);outline-offset:-18px}@keyframes fxmc{0%{opacity:0;transform:translate(-50%,-50%) scale(.4) rotate(0)}30%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1.1) rotate(160deg)}}
.fk-eyes .ey{position:absolute;left:50%;top:30%;transform:translateX(-50%);display:flex;gap:28px;animation:fxey 2.4s ease-in-out}.fk-eyes i{width:22px;height:9px;border-radius:50%;background:var(--c1);box-shadow:0 0 16px var(--c1)}@keyframes fxey{0%,100%{opacity:0}20%,80%{opacity:1}}
.fk-ripple b{position:absolute;left:50%;top:55%;width:40px;height:16px;border:2px solid var(--c1);border-radius:50%;transform:translate(-50%,-50%);animation:fxrp 2.2s ease-out infinite;opacity:0}.fk-ripple b:nth-child(2){animation-delay:.5s}.fk-ripple b:nth-child(3){animation-delay:1s}@keyframes fxrp{0%{opacity:.9;width:30px;height:12px}100%{opacity:0;width:300px;height:110px}}
.fxshake{animation:fxsh .55s}@keyframes fxsh{10%,50%,90%{transform:translate(calc(var(--shk) * -1),2px)}30%,70%{transform:translate(var(--shk),-2px)}}
.fxzoom{animation:fxzm 1.4s ease-in-out}@keyframes fxzm{40%{transform:scale(1.06)}}
.fxblur{animation:fxbl 2.2s ease-in-out}@keyframes fxbl{30%,60%{filter:blur(2px) saturate(1.3)}45%{filter:blur(3px)}}`;document.head.appendChild(st)})();
/* ---------- triggers ---------- */
const FXT={fx:0,sfx:0};
function fxMatch(list,txt){const s=String(txt||"").toLowerCase();let best=null,bs=0;list.forEach(x=>{x.kw.forEach(k=>{if(k&&k.length>=2&&s.includes(k.toLowerCase())&&k.length>bs){bs=k.length;best=x}})});return best}
function fxAuto(th,txt){if(!th||curT!==th.id||(typeof PKSKIP!=="undefined"&&PKSKIP[th.id])||S.autoFx===false)return;const now=Date.now();
 if(now-FXT.fx>7000){const f=fxMatch(FX100,txt);if(f){FXT.fx=now;FXT.sfx=now;fx100(f.id);return}}
 if(now-FXT.sfx>3000){const s=fxMatch(SFX100,txt);if(s){FXT.sfx=now;sfx100(s.id,.7)}}}
const _appendMsg59=appendMsg;appendMsg=function(th,m){const r=_appendMsg59(th,m);try{if(m&&m.who!=="me"&&m.who!=="sys"&&(m.txt||m.parts))fxAuto(th,m.txt||(m.parts||[]).map(p=>p.txt).join(" "))}catch(_){}return r};
const _pkAppend59=pkAppend;pkAppend=function(th,m){const r=_pkAppend59(th,m);try{if(m&&m.who!=="me"&&isNarr(m))fxAuto(th,m.txt)}catch(_){}return r};
PKREG.add("app59_fx100.js", function(th,b, next){if(Array.isArray(b)&&b[0]==="sys"&&(b[1]==="fx100"||b[1]==="sfx")){th.pk.q.shift();const d=b[2]||{};if(curT===th.id&&!PKSKIP[th.id]){if(b[1]==="sfx")sfx100(d.id);else fx100(d.id)}return true}
 if(Array.isArray(b)&&b[0]==="sys"&&b[1]==="fx"&&FX100.some(x=>x.id===(b[2]||{}).id)){th.pk.q.shift();if(curT===th.id&&!PKSKIP[th.id])fx100(b[2].id);return true}
 return next(th,b)});;
