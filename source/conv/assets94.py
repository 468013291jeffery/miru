# Asset plan: which picture/film each script slot uses, and the prompts the owner generates them from.
import json, re, os
H = os.path.dirname(os.path.abspath(__file__))
WORK = {'tsuns': 'w_scmvgzd2sneff0fa38ae', 'crown': 'w_scmvgzcvbef7c6a40707', 'office': 'w_scmvgzd4lafc1f500336'}
STYLE_BG = 'cinematic film still, vertical 9:16, no people, soft depth of field, rich atmosphere, high detail, no text, no watermark'
STYLE_PT = 'cinematic portrait, vertical 3:4, waist-up, adult, looking slightly off camera, natural skin texture, soft rim light, plain dark background, no text'
STYLE_CG = 'cinematic film still, vertical 9:16, two adults, emotional key moment, shallow depth of field, no text, no watermark'
TSUNS = [  # (id, match words, 中文说明, prompt)
 ('t01', ['立项会议室（后台保险箱）', '立项会议室（临时危机', '陆氏出品', '立项会议室'], '会议室（立项/出品/危机会）', 'modern film-studio boardroom, long conference table, one contract with a folded corner, cold coffee cup, glass wall, cool grey morning light'),
 ('t02', ['发布会', '粉丝应援', '庆功午宴'], '发布会厅', 'film press conference stage with step-and-repeat backdrop, rows of camera flashes, empty microphones on a long table, warm stage lights'),
 ('t03', ['电梯两米', '他家走廊', '后台走廊', '首映礼后台走廊'], '电梯 / 走廊', 'mirrored elevator interior and narrow backstage corridor, cool fluorescent light, two meters of empty space, green emergency light'),
 ('t04', ['定妆间镜子（话剧后台', '定妆间镜子（补妆', '定妆间镜子（单人更衣', '定妆间镜子（休息', '定妆间镜子（你的化妆间', '定妆间镜子'], '定妆间 / 化妆镜', 'actor makeup room, vanity mirror ringed with bulbs, color swatches, a red pen on the counter, one lamp left on'),
 ('t05', ['酒店房间', '你家', '你的客厅', '你的车里'], '她的房间（酒店 / 家）', 'quiet apartment living room at night, black curtains, phone screen glow on the sofa, city lights beyond the window'),
 ('t06', ['地下车库'], '地下车库 / 车内', 'underground parking garage B3 at night, cold white tube lights, two cars parked side by side, wet concrete reflections'),
 ('t07', ['第十二摄影棚'], '第十二摄影棚（雨街布景）', 'huge film soundstage with a fake rainy street set, rain towers, monitors and director chairs, moody blue light'),
 ('t08', ['海报拍摄棚', '巨幅海报墙'], '海报拍摄棚 / 海报墙', 'white cyclorama photo studio with a giant movie poster wall showing two names side by side, softboxes'),
 ('t09', ['读本会长桌'], '读本会长桌', 'script read-through room, long table with open scripts, page header "7-04", paper cups, late-night snacks'),
 ('t10', ['顶层天台'], '顶层天台', 'rooftop of a city tower at night, wind, distant skyline, a railing where someone could knock twice'),
 ('t11', ['十二楼落地窗'], '他的公寓（十二楼落地窗）', 'penthouse living room with floor-to-ceiling windows on the 12th floor, warm lamp, sofa, morning or night city view'),
 ('t12', ['首映礼红毯'], '首映礼红毯', 'film festival red carpet at night, crowds behind barriers, camera flashes, premiere banners'),
 ('t13', ['放映厅'], '放映厅', 'small cinema auditorium, rows of red seats, big screen glowing, dim aisle lights'),
 ('t14', ['杀青宴厅'], '杀青宴厅', 'film wrap party banquet hall, round tables, champagne, warm string lights'),
 ('t15', ['便利店'], '深夜便利店', 'late-night convenience store, bright white light, two boxed lunches on the counter, rain outside'),
 ('t16', ['洗手台双杯'], '浴室洗手台', 'bathroom sink with two toothbrush cups, steam on the mirror, soft warm light (no people)'),
 ('t17', ['机场', '私人飞机'], '机场 / 私人飞机', 'airport security gate at dawn and private jet cabin at night, cool blue light'),
 ('t18', ['十年后酒馆'], '十年后酒馆（结局C）', 'old jazz bar ten years later, faded movie poster on the wall, TV showing an interview'),
 ('t19', ['无署名工作室'], '无署名工作室（结局B）', 'unnamed film studio with two cameras facing each other, sticky note "We stopped counting"'),
 ('t20', ['两个太阳', '顶层休息室'], '两个太阳（隐藏结局）', 'empty cinema last row bathed in bright daylight, two suns in the sky through a window, dreamlike'),
]
CROWN = [
 ('c01', ['加冕', '大殿'], '加冕大殿', 'grand royal coronation hall, painted dome, candlelight through stained glass, golden crown on a sapphire altar, nobles\' seats'),
 ('c02', ['回廊', '大厅出口', '主回廊'], '王宫回廊', 'marble palace colonnade, tall carved pillars, candle reflections on the floor'),
 ('c03', ['抄录室', '记录室', '收发室', '阅览隔间'], '誓文抄录室', 'narrow archive-scribe room, wooden shelves of parchment scrolls, quills, sealing wax, a single candle'),
 ('c04', ['档案库'], '王室档案库', 'royal archive vault, dark wooden cabinets to the ceiling, brass chandelier, dust in the light'),
 ('c05', ['工坊'], '王城工坊街', 'medieval workshop street by day, seal-maker\'s shop, cobblestones, hanging cloth'),
 ('c06', ['住处', '窗台'], '你的住处', 'simple clerk\'s lodging, small fireplace, desk covered in parchment, moonlight on the window sill'),
 ('c07', ['钟楼'], '钟楼', 'inside a royal clock tower, giant brass gears, spiral stone stairs, open balcony over the city at night'),
 ('c08', ['办公厅', '听证厅', '听证前厅', '听证台', '接待前厅'], '王室办公厅 / 听证厅', 'royal council office and hearing hall, heavy oak table, parchment laid out, banners'),
 ('c09', ['驿馆'], '驿馆庭院', 'wet stone courtyard of a royal post inn, couriers, horses, lanterns'),
 ('c10', ['林道', '营地', '篝火'], '西境林地营地', 'forest road at dusk and a tribal camp with a bonfire, carved totem stones'),
 ('c11', ['议事厅'], '议事厅', 'council chamber with empty high throne, tiered noble seats, voting placards'),
 ('c12', ['地窖', '地下通道', '下层通道'], '地下地窖', 'underground archive cellar behind iron gates, damp stone walls, a brass lamp over an old wooden desk'),
 ('c13', ['露天听证', '听证高台', '高台旁', '高台中央'], '露天听证高台', 'open-air public hearing platform in the city square, bells, sunset sky'),
 ('c14', ['圣坛'], '誓约圣坛', 'ancient black-stone oath altar on a hill, glowing runes, herb grove'),
 ('c15', ['塔楼'], '塔楼书房 / 露台', 'tower study with open windows in spring, petals blowing in, view of the kingdom from the balcony'),
 ('c16', ['蒙太奇', '四季'], '四季（尾声）', 'four seasons montage over a fantasy kingdom, soft painterly light'),
]
OFFICE = [
 ('o01', ['更衣室中央', '赛前更衣室', '赛后更衣室', '球队更衣室', '更衣室，'], '更衣室', 'ice hockey locker room, metal lockers, narrow benches, cold white light, hockey bags and tape'),
 ('o02', ['录像室'], '录像室', 'video review room, old monitor with a timeline that has gaps, training logs, marker pens'),
 ('o03', ['训练冰场', '冰场边', '训练后空场', '训练场边'], '训练冰场', 'college hockey practice rink, freshly resurfaced ice, boards with scuffs, empty bleachers'),
 ('o04', ['正式比赛冰场', '半决赛正式冰场', '半决赛冰场', '关键战冰场', '决赛', '收官冰场'], '比赛冰场', 'packed hockey arena on game night, scoreboard lit, crowd blur, bright ice'),
 ('o05', ['走廊'], '训练馆走廊', 'training facility hallway at night, team posters, vending machine blue glow, a bench'),
 ('o06', ['会议室', '战术室', '复盘室', '办公室'], '球队会议室', 'team meeting room, whiteboard with plays drawn on it, long table, schedules'),
 ('o07', ['公共厨房'], '公共厨房（七点早餐）', 'campus shared kitchen at 7am, frying pan with eggs, two coffee mugs, morning light'),
 ('o08', ['校园路', '校园走廊'], '校园路', 'college campus path connecting the rink and the dorms, early morning'),
 ('o09', ['公告栏'], '训练馆公告栏', 'glass notice board with the starting lineup posted, corridor light'),
 ('o10', ['医务', '恢复区', '休息区'], '医务恢复区', 'sports medicine recovery room, ice packs, massage table, training towels'),
 ('o11', ['媒体区', '采访区'], '媒体采访区', 'arena media area, sponsor backdrop, microphones'),
 ('o12', ['广场', '停车场', '互动区', '侧门'], '球馆外广场 / 停车场', 'outside the arena at night, plaza lights, team bus and parking lot'),
 ('o13', ['队巴'], '队巴', 'team bus interior at night, seats in rows, window reflections'),
 ('o14', ['客场', '酒店'], '客场酒店', 'away-game hotel corridor and lounge, half-open doors, recovery corner'),
 ('o15', ['夏季'], '夏季校园', 'summer campus lake and green lawn, café table with a semester planner, warm sun'),
 ('o16', ['器材房'], '器材房', 'equipment room with metal shelves of skates and sticks, skate sharpener'),
]
PRI = {'tsuns': ['t15','t05','t02','t16','t20','t18','t19','t17','t12','t13','t14','t08','t09','t11','t10','t07','t06','t03','t04','t01'],
       'crown': ['c16','c15','c14','c13','c12','c11','c10','c09','c07','c05','c04','c06','c03','c08','c02','c01'],
       'office': ['o09','o08','o13','o14','o15','o16','o11','o10','o07','o02','o04','o03','o06','o12','o01','o05']}
def cluster(name, table):
    key = 'tsuns' if table is TSUNS else 'crown' if table is CROWN else 'office'
    order = {c: i for i, c in enumerate(PRI[key])}
    for cid, words, zh, pr in sorted(table, key=lambda r: order.get(r[0], 99)):
        if any(w in name for w in words): return cid
    return table[0][0]
def plan():
    out = {}
    tm = json.load(open(os.path.join(H, 'tsuns.md.meta.json')))
    out['tsuns'] = {v['slot']: cluster(k, TSUNS) for k, v in tm['bg'].items()}
    cm = json.load(open(os.path.join(H, 'crown.md.meta.json')))
    out['crown'] = {b['slot']: cluster(b['desc'], CROWN) for b in cm['bg']}
    om = json.load(open(os.path.join(H, 'office.md.meta.json')))
    out['office'] = {b['slot']: cluster(b['desc'], OFFICE) for b in om['bg']}
    return out
if __name__ == '__main__':
    p = plan(); json.dump(p, open(os.path.join(H, 'assetplan.json'), 'w'), ensure_ascii=False, indent=1)
    from collections import Counter
    for k, v in p.items(): print(k, len(v), dict(Counter(v.values())))
