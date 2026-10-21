# Shared helpers: turn script pieces into MIRU standard markup (+ v94 ⟦…⟧ directives read by src/app94_official2.js)
import json, re, os
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = json.load(open(os.path.join(HERE, '..', 'lib94.json')))
BGM = LIB['bgm']; MG = LIB['mg']

# hand-tuned words → BGM cue (checked before the library's own trigger words)
BGM_WORDS = [
 ('archive', 'library_hush'), ('档案', 'library_hush'),
 ('对峙', 'standoff'), ('冷光', 'standoff'), ('压抑', 'standoff'), ('紧张', 'standoff'), ('tense', 'standoff'), ('审', 'interrogation'),
 ('镜', 'backstage'), ('后台', 'backstage'), ('闪光', 'stage_lights'), ('红毯', 'stage_lights'), ('首映', 'stage_lights'), ('聚光', 'stage_lights'),
 ('发布会', 'stage_lights'), ('片场', 'stage_lights'), ('镜头', 'stage_lights'),
 ('暗号', 'secret'), ('秘密', 'secret'), ('密谋', 'secret'), ('悬疑', 'clue'), ('线索', 'clue'), ('录像', 'clue'), ('archive', 'library_hush'), ('档案', 'library_hush'),
 ('卷宗', 'library_hush'), ('抄录', 'library_hush'), ('书', 'library_hush'),
 ('王宫', 'royal_court'), ('宫廷', 'royal_court'), ('加冕', 'royal_court'), ('王冠', 'royal_court'), ('议会', 'courtroom'), ('议事', 'courtroom'), ('法庭', 'courtroom'),
 ('宣誓', 'royal_court'), ('誓', 'royal_court'), ('court', 'royal_court'), ('throne', 'royal_court'), ('宫墙', 'palace_walls'),
 ('冰场', 'ice_rink'), ('冰面', 'ice_rink'), ('更衣室', 'locker_room'), ('训练', 'training'), ('比赛', 'victory'), ('决赛', 'victory'), ('赛场', 'victory'),
 ('胜利', 'victory'), ('终场', 'finale'), ('失误', 'defeat'), ('失败', 'defeat'), ('伤', 'hospital_night'), ('医', 'hospital_night'), ('病', 'hospital_night'),
 ('早餐', 'good_morning'), ('清晨', 'good_morning'), ('厨房', 'sunday_kitchen'), ('咖啡', 'rainy_cafe'), ('雨', 'one_umbrella'), ('雷', 'thunder_night'),
 ('烟花', 'new_year'), ('跨年', 'new_year'), ('车站', 'goodbye_station'), ('机场', 'airport'), ('远征', 'road_trip'), ('公路', 'road_trip'), ('车里', 'road_trip'),
 ('电梯', 'elevator'), ('便利店', 'convenience'), ('天台', 'rooftop_wind'), ('屋顶', 'rooftop_wind'), ('风', 'rooftop_wind'), ('海', 'seaside'),
 ('酒馆', 'midnight_jazz'), ('爵士', 'midnight_jazz'), ('酒', 'midnight_jazz'), ('晚宴', 'gala_night'), ('宴', 'gala_night'), ('舞会', 'ballroom'), ('华尔兹', 'ballroom'),
 ('董事', 'boardroom'), ('会议', 'boardroom'), ('资本', 'boardroom'), ('合同', 'contract_marriage'), ('夜', 'late_office'), ('深夜', 'late_call'), ('电话', 'late_call'),
 ('告白', 'confession'), ('心跳', 'heartbeat_close'), ('靠近', 'heartbeat_close'), ('亲密', 'heartbeat_close'), ('吻', 'the_kiss'), ('温柔', 'slow_burn'), ('慢', 'slow_burn'),
 ('钢琴', 'hush_still'), ('克制', 'hush_still'), ('静', 'hush_still'), ('沉默', 'hush_still'), ('孤', 'alone'), ('心碎', 'heartbreak'), ('至暗', 'heartbreak'), ('背叛', 'betrayal'),
 ('醋', 'jealousy'), ('重逢', 'reunion'), ('回忆', 'memory_lane'), ('往事', 'memory_lane'), ('旧', 'memory_lane'), ('道歉', 'apology'), ('婚', 'wedding'),
 ('终章', 'finale'), ('结局', 'finale'), ('片尾', 'end_credits'), ('天亮', 'dawn'), ('黎明', 'dawn'), ('街', 'neon_city'), ('城', 'neon_city'), ('市', 'festival'),
 ('弦乐', 'finale'), ('主题', 'finale'), ('吉他', 'midnight_jazz'), ('低频', 'standoff'), ('鼓', 'standoff'), ('脉冲', 'standoff'),
]
def bgm_for(tag):
    t = str(tag or '')
    for w, m in BGM_WORDS:
        if w.lower() in t.lower(): return m
    for b in BGM:
        for k in str(b['kw']).split(','):
            k = k.strip()
            if len(k) >= 2 and k in t: return b['id']
    return 'slow_burn'

MG_BY_TPL = {}
for g in MG: MG_BY_TPL.setdefault(g['tpl'], []).append(g['id'])
def mg_for(text, used=None):
    """pick the library game that best fits what the scene is doing"""
    t = str(text or '')
    best, score = None, 0
    for g in MG:
        s = 0
        for k in str(g['kw']).split(','):
            k = k.strip()
            if len(k) >= 2 and k.lower() in t.lower(): s += 2
        if g['zh'] and g['zh'] in t: s += 3
        if used and g['id'] in used: s -= 3
        if s > score: best, score = g['id'], s
    return best

def clean(s):
    s = str(s or '').replace('⟦', '[').replace('⟧', ']').replace('　', ' ')
    return re.sub(r'\s+', ' ', s).strip()
def mk(kind, *parts):
    from urllib.parse import quote
    return '⟦' + kind + ''.join('|' + quote(clean(p)[:400], safe='') for p in parts) + '⟧'
def say(name, txt):
    txt = clean(txt).strip('“”"「」')
    return '%s：“%s”' % (name, txt) if txt else ''
def narr(txt):
    txt = clean(txt)
    return ('旁白：' + txt) if txt else ''
