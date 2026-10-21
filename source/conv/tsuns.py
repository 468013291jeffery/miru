# 《王不见王》TWO SUNS → MIRU markup.  Player = 顾昭 (her lines become "your turn" stops: 你：“…”)
import re, sys, json
sys.path.insert(0, __import__('os').path.dirname(__file__))
from miru94 import mk, say, narr, bgm_for, clean
SRC = sys.argv[1]; OUT = sys.argv[2]
L = [l.strip() for l in open(SRC, encoding='utf8').read().split('\n')]
L = [l for l in L if l]
PLAYER = '顾昭'; W = 'tsuns'
PAIRS = {}
CJK = re.compile(r'[一-鿿]')
GAME_MAP = [('猜谜', 'quiz_heart'), ('飞镖', 'hold_aim'), ('转瓶', 'dice_truth'), ('打赌', 'dice_bet'), ('赌', 'dice_bet'), ('拍照', 'scratch_photo'), ('记', 'simon_lights')]
out = []; meta = {'chapters': [], 'bg': {}, 'cg': [], 'photos': [], 'calls': 0, 'games': 0, 'free': 0}
E = out.append
SKIP = re.compile(r'^(收彩蛋|埋彩蛋|称呼进度|章尾停在这里|本章时间跨度|本章时长|场景数|本章锚点|本章数值|⚠️|结局：|全季彩蛋|第.{1,3}章完|解锁MEMORY|章尾累计|亲密场次|亲密 ·|触发条件|结局[ABC]数值|隐藏结局.*数值|成就「|.*（CALL）$)')
STAT = re.compile(r'^([A-Za-z]+\s*[+\-−]\s*\d+\s*(／|/)?\s*)+$|^[A-Za-z]+\s*[+\-−]\d')
def is_stat(l): return bool(re.match(r'^(Ember|Sparks|Buzz|Tension|Trust|Attraction|Agency|Suspicion|Protection|Intimacy)\b', l))
i = 0; ch = 0; sc = 0; in_choice = False; done_end = False
def speaker_of(l):
    m = re.match(r'^([^\s：:（(“"]{1,10})(?:（([^）]{0,12})）)?[：:]$', l)
    return m.group(1) if m else None
def take_lines(j):
    """quoted lines after a speaker: EN line + ZH line (sometimes only one)"""
    zh = en = None; k = j
    while k < len(L) and k < j + 3:
        t = L[k]
        if re.match(r'^["“].*["”]$', t) or (not CJK.search(t) and k == j and not t.startswith('（')):
            q = t.strip('"“”')
            if CJK.search(q): zh = q
            else: en = q
            k += 1
            if zh: break
        else: break
    if zh and en: PAIRS[clean(zh).strip('“”"「」')] = en.strip()
    return zh or en, en, k
def line_you(txt): return say('你', txt)
def emit_dialog(name, txt):
    if not txt: return
    if name == PLAYER: E(line_you(txt))
    else: E(say(name, txt))
EXTRA_CALLS = [
 (3, '深夜电话', '陆识野', '他开走十分钟后，又打了回来。他不解释自己为什么打，只是确认你到家没有', ['你还在车库？', '我没问那通电话。我问的是你。', '车里冷，别坐太久。到家给我发个句号。']),
 (5, '凌晨三点', '陆识野', '凌晨三点，他不发文字了，直接打了过来：今晚不演了，你问什么他都答真话', ['我今晚不演了。', '没有台词。问我什么都行。', '这个点，我只说真话。']),
]
pending_call = None
def flush_call():
    global pending_call
    if pending_call:
        c = pending_call; pending_call = None
        E(narr('（📞 ' + c[1] + ' 打来了电话）')); E(mk('CALL', c[1], c[2])); [E(say(c[1], x)) for x in c[3]]; E(mk('/CALL')); meta['calls'] += 1
used_extra = set()
while i < len(L):
    l = L[i]
    if l.startswith('【附件') or l.startswith('【全季封账'): break
    if ch == 0 and not re.match(r'^CH\s*\d+｜', l): i += 1; continue
    m = re.match(r'^CH\s*(\d+)｜([^｜]*)｜(.+)$', l)
    if m:
        if in_choice: E('# ·'); in_choice = False
        flush_call()
        for k, (cch, key, who_, hint_, ls_) in enumerate(EXTRA_CALLS):
            if k not in used_extra and cch == ch and not key: E(narr('（📞 ' + who_ + ' 打来了电话）')); E(mk('CALL', who_, hint_)); [E(say(who_, x)) for x in ls_]; E(mk('/CALL')); meta['calls'] += 1; used_extra.add(k)
        ch = int(m.group(1)); sc = 0; title = re.sub(r'（.*?）', '', m.group(3)).strip()
        E(''); E('# CHAPTER %d｜%s' % (ch, title)); meta['chapters'].append(title); i += 1; continue
    if l.startswith('【第') and '幕' in l: i += 1; continue
    if SKIP.match(l) or is_stat(l): i += 1; continue
    m = re.match(r'^【BGM[：:](.+?)】', l)
    if m: E(mk('BGM', bgm_for(m.group(1)), m.group(1))); i += 1; continue
    if l.startswith('Cold Open'): E('# SCENE｜' + ('冷开场')); i += 1; continue
    m = re.match(r'^SCENE\s*[\d+]*｜([^｜]*)｜(.+)$', l)
    if m:
        if in_choice: E('# ·'); in_choice = False
        flush_call()
        sc += 1; place = m.group(2).strip()
        me_ = re.match(r'^ENDING\s*([ABC])', m.group(1).strip())
        if ch == 12: E('@@END ' + me_.group(1) if me_ else ('@@COMMON' if re.match(r'^(HIDDEN|CREDITS)', m.group(1).strip()) else '@@SC'))
        for k, (cch, key, who_, hint_, ls_) in enumerate(EXTRA_CALLS):
            if k not in used_extra and cch == ch and key and key in place: pending_call = (cch, who_, hint_, ls_); used_extra.add(k)
        E('# SCENE｜' + place); i += 1
        # time / BG lines right after
        while i < len(L) and re.match(r'^(时间|BG)[：:]', L[i]):
            t = L[i]
            if t.startswith('BG'):
                loc = clean(t.split('：', 1)[-1] if '：' in t else t.split(':', 1)[-1])
                slot = 'bg_' + re.sub(r'\W+', '', loc)[:16]
                meta['bg'].setdefault(loc, {'slot': slot, 'first': 'CH%d S%d %s' % (ch, sc, place)})
                E(mk('BG', meta['bg'][loc]['slot'], loc))
            else:
                E(mk('TIME', t.split('：', 1)[-1]))
            i += 1
        continue
    m = re.match(r'^【CG\s*(\d+)】', l)
    if m:
        slot = 'cg_ch%02d_%02d' % (ch, int(m.group(1)))
        # caption = next narration line
        cap = ''
        for k in range(i + 1, min(i + 4, len(L))):
            if L[k].startswith('（'): cap = L[k].strip('（）'); break
        meta['cg'].append({'slot': slot, 'ch': ch, 'cap': cap}); E(mk('CG', slot, cap)); i += 1; continue
    m = re.match(r'^📸\s*解锁照片[：:]\s*📸?「(.+?)」[—\-]*(.*)$', l)
    if m:
        meta['photos'].append({'ch': ch, 't': m.group(1), 'cap': m.group(2)})
        pm = mk('PHOTO', m.group(1), m.group(2))
        if in_choice:
            k = max(x for x in range(len(out)) if out[x].startswith('# CHOICE'))
            out.insert(k, pm)
        else: E(pm)
        i += 1; continue
    m = re.match(r'^GAME\s*\d+｜类型[：:]([^：:（]+)[：:]?(.*)$', l)
    if m:
        if in_choice: E('# ·'); in_choice = False
        kind = m.group(1); g = next((v for k, v in GAME_MAP if k in kind + m.group(2)), 'quiz_heart')
        E(mk('MG', g, kind + '：' + m.group(2))); meta['games'] += 1; i += 1
        # the game's staged text is kept as narration/dialogue; options a/b/c become a quick line stop
        continue
    if re.match(r'^阶段[一二三四]', l): i += 1; continue
    if re.match(r'^[a-d][.．]\s*\S', l):
        opts = []
        while i < len(L) and re.match(r'^[a-d][.．]\s*\S', L[i]): opts.append(re.sub(r'^[a-d][.．]\s*', '', L[i])); i += 1
        if in_choice: E('# ·'); in_choice = False
        E('# CHOICE｜你猜？'); [E('#### %s｜%s' % ('ABCD'[k], o)) for k, o in enumerate(opts[:4])]; E('# ·'); continue
    m = re.match(r'^CALL\s*\d+｜(.+)$', l)
    if m:
        if in_choice: E('# ·'); in_choice = False
        # collect the call block until the "你会怎么做？" menu or the next header
        title = m.group(1); j = i + 1; lines = []; who = None; pre = []
        while j < len(L) and not re.match(r'^(SCENE|CHOICE|CH |GAME|CALL|【自由|你会怎么做)', L[j]) and not is_stat(L[j]) and not L[j].startswith('📸'):
            sp = speaker_of(L[j])
            if sp:
                txt, en, k = take_lines(j + 1)
                nm = re.sub(r'（.*', '', sp).replace('医院电话', '医院')
                if nm != PLAYER and txt:
                    if '接过电话' in L[j] or nm == '陆识野' and who and who != '陆识野': pre.append(say(nm, txt))
                    else:
                        who = who or nm; lines.append(say(nm, txt))
                j = k; continue
            if L[j].startswith('（'): pre.append(narr(L[j].strip('（）')))
            j += 1
        blk = ' '.join(L[i:j])
        to_you = any(speaker_of(L[x]) and speaker_of(L[x]).startswith(PLAYER) for x in range(i, j)) or re.search(r'手机震|打电话来|你接起|医院电话|打给你|来电', blk)
        if who and lines and to_you:
            E(narr('（📞 ' + title + '）')); E(mk('CALL', who, title)); [E(x) for x in lines]; E(mk('/CALL')); [E(x) for x in pre]
            meta['calls'] += 1
        else:
            [E(x) for x in pre]
        i = j
        if i < len(L) and L[i].startswith('你会怎么做'):
            opts = []; i += 1
            while i < len(L) and re.match(r'^[✅🔓📢🎁]', L[i]):
                o = re.sub(r'^[✅🔓📢🎁]\s*', '', L[i]); o = re.split(r'——免费', o)[0]; o = re.sub(r'（[^）]*[+\-−][^）]*）|（默认[：:]?', '', o).strip(' （）')
                if o: opts.append(o)
                i += 1
            if opts:
                E('# CHOICE｜你会怎么做？'); [E('#### %s｜%s' % ('ABCD'[k], o)) for k, o in enumerate(opts[:4])]; E('# ·')
        continue
    if ch == 12 and l.startswith('CHOICE') and '开哪扇门' in l: E('@@DOOR'); i += 1; continue
    m = re.match(r'^🔑\s*KEY\s*([ABC])', l)
    if m: E('@@KEY ' + m.group(1)); i += 1; continue
    if l.startswith('SOCIAL'): E('@@SOCIAL'); i += 1; continue
    if l.startswith('📌'): i += 1; continue
    if ch == 12 and l.startswith('若'): i += 1; continue
    if re.match(r'^章尾炸弹·章末选择|^章末选择', l): l = 'CHOICE 9｜章末选择：你怎么做？'
    m = re.match(r'^CHOICE\s*\d+｜(.+)$', l)
    if m:
        if in_choice: E('# ·')
        E('# CHOICE｜' + m.group(1)); in_choice = True; i += 1; continue
    m = re.match(r'^([A-D])｜(.+)$', l)
    if m and in_choice:
        E('#### %s｜%s' % (m.group(1), re.sub(r'（→[^）]*）', '', m.group(2)).strip())); i += 1; continue
    if l.startswith('【自由输入窗口'):
        qs = []; ex = []; i += 1
        while i < len(L) and not re.match(r'^(SCENE|CHOICE|CH |GAME|CALL|【|（|📸)', L[i]) and not is_stat(L[i]):
            t = L[i]
            if '回复风格示例' in t: i += 1; continue
            mm = re.match(r'^"(.+?)"\s*/\s*"(.+?)"$', t)
            if mm: ex.append(mm.group(2)); PAIRS[clean(mm.group(2))] = mm.group(1)
            elif t.endswith('？') or t.endswith('?'): qs.append(t)
            i += 1
        if in_choice: E('# ·'); in_choice = False
        if qs or ex:
            E(mk('FREE', qs[0] if qs else '你想说什么？', *(ex[:3] or qs[1:3]))); meta['free'] += 1
        continue
    if l.startswith('📱'):
        E(narr('📱 ' + l.strip('📱 ：:'))); i += 1
        txt, en, k = take_lines(i)
        if txt: E(narr('「' + txt + '」')); i = k
        continue
    sp = speaker_of(l)
    if sp:
        txt, en, k = take_lines(i + 1)
        nm = re.sub(r'（.*', '', sp)
        if '电视里' in l: E(narr(nm + '（电视里）：“' + (txt or '') + '”')); i = k; continue
        emit_dialog(nm, txt); i = k; continue
    if l.startswith('（') or l.startswith('('):
        t = l.strip('（）()')
        if t.startswith('——') and ('彩蛋' in t or '埋' in t or '收' in t[:6]): i += 1; continue
        E(narr(t)); i += 1; continue
    if re.match(r'^[a-zA-Z0-9 ,.\'"!?\-:;]+$', l): i += 1; continue  # loose English line
    if l.startswith('【') or l.startswith('🔓') or l.startswith('F1') or l.startswith('Ch'): i += 1; continue
    if len(l) < 200 and not l.startswith('你会怎么做'): E(narr(l))
    i += 1
flush_call()
# ---- ch12: three doors → the chapter's ending choice; each door carries its ending + the shared hidden coda/credits
def doors(lines):
    try: a = lines.index('@@DOOR')
    except ValueError: return [x for x in lines if not x.startswith('@@')]
    head = lines[:a]; rest = lines[a + 1:]; keys = {}; ends = {}; common = []; mid = []; cur = None; buf = None
    for x in rest:
        if x.startswith('@@KEY '): cur = ('k', x[-1]); keys[x[-1]] = []; continue
        if x.startswith('@@SOCIAL'): cur = ('m', None); continue
        if x.startswith('@@END '): cur = ('e', x[-1]); ends[x[-1]] = []; continue
        if x.startswith('@@COMMON'): cur = ('c', None); continue
        if x.startswith('@@SC'): cur = ('m', None); continue
        if x.startswith('@@'): continue
        if cur is None or cur[0] == 'm': mid.append(x)
        elif cur[0] == 'k':
            if x.startswith('旁白：——进入'): continue
            keys[cur[1]].append(x)
        elif cur[0] == 'e': ends[cur[1]].append(x)
        else: common.append(x)
    lab = {'A': '拿起A钥匙（太阳徽章）——同框登顶', 'B': '拿起B钥匙（镜头盖）——隐于幕后', 'C': '拿起C钥匙（飞镖）——各自封神'}
    out2 = [x for x in head if not x.startswith('@@')] + mid + ['# CHOICE｜开哪扇门？（三结局分叉点）']
    for k in 'ABC':
        body = [y for y in keys.get(k, []) + ends.get(k, []) + common if not y.startswith('# CHOICE') and not y.startswith('#### ') and y != '# ·']
        body = [('## ' + y[2:]) if y.startswith('# SCENE') else y for y in body]
        out2 += ['#### %s｜%s' % (k, lab[k])] + [y for y in body if not y.startswith('## SCENE')]
    return out2
out = doors(out)
fs = next(k for k, x in enumerate(out) if x.startswith('# SCENE'))
out.insert(fs + 1, mk('VIDEO', 'vid_open', ''))
fe = next((k for k, x in enumerate(out) if x.startswith('# CHAPTER 12')), None)
if fe is not None:
    s2 = next(k for k in range(fe, len(out)) if out[k].startswith('# SCENE'))
    out.insert(s2 + 1, mk('VIDEO', 'vid_final', ''))
CHARS = [('陆识野','m',33,'m1','影帝／出品人','33岁影帝兼出品人。西装只扣第二颗扣子，腕上旧表慢12分钟，左肩旧伤。寡言克制，用行动代替语言，从不喊她名字。'),
 ('方叙','m',40,'m3','制片人','40岁制片人，永远在打电话、在算账，相信感情要花钱，但给人留了一条门缝。'),
 ('林小满','f',28,'f1','顾昭的经纪人','28岁经纪人，抱着一排鞋跟赶场，哭起来躲在车库，是顾昭的盾牌也是软肋。'),
 ('老周','m',55,'m4','导演','55岁导演，不喊卡，在监视器后看一切，全剧最清醒的人。'),
 ('顾母','f',58,'f2','顾昭的母亲','顾昭的母亲，说话不多，只在新闻之后打来电话。'),
 ('医院','f',40,'f2','医院护士站','医院护士站的值班护士。')]
out = ['# 王不见王'] + [mk('CHAR', *map(str, c)) for c in CHARS] + out
open(OUT, 'w', encoding='utf8').write('\n'.join(x for x in out if x is not None))
json.dump(PAIRS, open(OUT + '.pairs.json', 'w', encoding='utf8'), ensure_ascii=False)
json.dump(meta, open(OUT + '.meta.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('chapters', len(meta['chapters']), 'bg', len(meta['bg']), 'cg', len(meta['cg']), 'photos', len(meta['photos']), 'calls', meta['calls'], 'games', meta['games'], 'free', meta['free'], 'lines', len(out))
