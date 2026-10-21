# 《Off the Ice / 冰场之外》→ MIRU markup.  Every table row is one turn: your line / options / free topic → their answer.
import re, sys, json, os
sys.path.insert(0, os.path.dirname(__file__))
from miru94 import mk, say, narr, bgm_for, clean
SRC, OUT = sys.argv[1], sys.argv[2]
L = [l.rstrip() for l in open(SRC, encoding='utf8').read().split('\n')]
out = []; E = out.append
meta = {'chapters': [], 'bg': [], 'calls': 0, 'games': 0, 'free': 0, 'rows': 0}
CN = '零一二三四五六七八九十'
def cnum(s):
    s = s.strip()
    if s.isdigit(): return int(s)
    if s == '十': return 10
    if s.startswith('十'): return 10 + CN.index(s[1])
    if '十' in s: a, b = s.split('十'); return CN.index(a) * 10 + (CN.index(b) if b else 0)
    return CN.index(s)
CHARS = [('埃文', 'm', 22, 'm2', '队长', '22岁冰球队长。证据先于判定，习惯一个人扛下全队的责任；七点吃早餐，煎蛋不辣，咖啡；说话短，从不空口担保。'),
         ('马特奥', 'm', 21, 'm6', '门将', '21岁门将，爱修旧相机，嘴上说别谢，其实一直在看着全队。'),
         ('丹娜', 'f', 45, 'f2', '主教练', '45岁主教练，按程序办事，支持调查，不支持私刑。'),
         ('哈珀', 'f', 30, 'f1', '队医', '30岁队医，只在授权范围内回答健康问题。'),
         ('梅森', 'm', 21, 'm5', '队友', '21岁队友，首发竞争者，对你一开始就不友好。')]
NAMES = [c[0] for c in CHARS]
CALLS = {
 (3, 0): ('埃文', '前一晚十一点，埃文打来电话。他没寒暄，只确认明早的事', ['明早七点，公共厨房。', '你不来也行，不扣任何东西。', '来的话，煎蛋我多做一个。不辣。']),
 (5, 1): ('埃文', '首发名单公布前一晚，埃文打来电话。他说他不能透露名单，只想问你的状态', ['名单我不能说。', '我打来不是因为名单。', '你今天在冰上，肩膀是不是不对劲？']),
 (6, 2): ('马特奥', '马特奥打来电话，背景里有旧相机快门声，他想先确认授权的事', ['相机里的东西，我还没给任何人看过。', '你要看，得按流程来。', '但我想先听你说，你要它做什么。']),
 (8, 1): ('埃文', '深夜，埃文打给你。他的声音比平时低，像是在训练馆外面', ['我有件事，本来不该瞒。', '你先别急着替我找理由。', '听我说完，再决定要不要生气。']),
 (11, 2): ('埃文', '远征的酒店，隔着两个房间，埃文还是打了电话过来', ['墙太薄，敲门会吵醒马特奥。', '明天的阵容你别想太多。', '……你睡不着的话，我陪你说会儿话。']),
 (15, 1): ('埃文', '半决赛前夜，埃文打来电话。他说只占用你两分钟', ['明天不管结果怎样，规则不改。', '我不会一个人扛了。', '所以我想先问你：你准备好了吗？']),
}
GAMES = {(1, 2): 'scratch_photo', (2, 2): 'quiz_hockey', (3, 1): 'order_recipe', (4, 2): 'hold_aim', (5, 1): 'code_locker', (6, 1): 'slide_photo',
         (7, 1): 'whack_flash', (8, 1): 'find_pill', (9, 1): 'order_clue', (10, 2): 'beat_drum', (11, 1): 'mem_sport', (12, 2): 'quiz_hockey',
         (13, 4): 'dice_fate', (14, 4): 'balance_skate', (15, 2): 'hold_breath', (16, 3): 'beat_heart', (17, 1): 'catch_snow', (18, 1): 'quiz_date'}
SPK = re.compile(r'^([^\s：“”（(]{1,8}?)(?:点头|插话|看你一眼|停顿|在门口|递水|记下|冷笑|短促|低声|抬头|走来|停步|重复|递表|把[^：]{0,8}|[^：“]{0,6})?[：:]\s*“(.+?)”(.*)$')
def answer(cell):
    """their side of the row → script lines"""
    c = clean(cell.replace('\\', ''))
    if not c or c.startswith('系统') or c.startswith('玩家'): return []
    who = next((n for n in NAMES if c.startswith(n)), None)
    if '“' in c and '”' in c:
        q = c[c.index('“') + 1:c.index('”', c.index('“'))]
        pre = c[:c.index('“')].rstrip('：: ')
        if who:
            act = pre[len(who):].strip()
            act = re.sub(r'^教练|^队长', '', act)
            return ([narr(who + act + '。')] if act else []) + [say(who, q)]
        return [narr(pre + '：“' + q + '”')]
    if any(c.startswith(n) for n in NAMES): return [narr(c.rstrip('。') + '。')]
    return []
ch = 0; sc = 0; started = False; in_table = False; scene_title = ''; key_choice = None
def end_choice():
    global key_choice
    if key_choice:
        opts = [clean(x) for x in re.split(r'[／/]', key_choice) if clean(x)][:4]
        if len(opts) >= 2:
            E('# CHOICE｜这一章，你最后怎么选？'); [E('#### %s｜%s' % ('ABCD'[k], o)) for k, o in enumerate(opts)]
    key_choice = None
i = 0
while i < len(L):
    l = L[i].strip()
    m = re.match(r'^#\s*第(.+?)章｜(.+)$', l)
    if m:
        end_choice()
        ch = cnum(m.group(1)); sc = 0; started = True; E(''); E('# CHAPTER %d｜%s' % (ch, m.group(2).strip())); meta['chapters'].append(m.group(2).strip()); i += 1; continue
    if not started: i += 1; continue
    mk_ = re.match(r'^-\s*.?关键选择.{0,4}[：:]\s*(.+)$', l)
    if mk_: key_choice = re.split(r'[；;]', mk_.group(1).replace('`', '').replace('*', ''))[0]; i += 1; continue
    m = re.match(r'^##\s*S(\d+)｜([^｜]+)', l)
    if m:
        sc += 1; scene_title = m.group(2).strip(); E('# SCENE｜' + scene_title); in_table = False
        g = GAMES.get((ch, sc))
        if g: E(mk('MG', g, scene_title)); meta['games'] += 1
        i += 1; continue
    if l.startswith('## '): in_table = False; sc_skip = True; i += 1
    if l.startswith('**背景图生成场外描述**'):
        d = l.split('：', 1)[-1].strip(); slot = 'bg_ch%02d_s%d' % (ch, sc); meta['bg'].append({'slot': slot, 'ch': ch, 'sc': sc, 'title': scene_title, 'desc': d})
        E(mk('BG', slot, scene_title))
        first = re.split(r'[。]', d)[0]
        if first: E(narr(first + '。'))
        i += 1; continue
    m = re.search(r'\[BGM[:：]\s*(.+?)\]', l)
    if m and l.startswith('**BGM'): E(mk('BGM', bgm_for(m.group(1)), m.group(1))); i += 1; continue
    if l.startswith('### 交互轮次表'): in_table = True; i += 1; continue
    if in_table and l.startswith('|'):
        cells = [x.strip() for x in l.strip('|').split('|')]
        if len(cells) < 3 or not cells[0].isdigit(): i += 1; continue
        you, them = cells[1], cells[2]; meta['rows'] += 1
        ans = answer(them)
        mm = re.match(r'^原定[：:]\s*[“"](.+?)[”"]', you)
        if mm:
            E('# CHOICE｜轮到你说'); E('#### A｜' + clean(mm.group(1))); [E(x) for x in ans]; E('# ·'); i += 1; continue
        mm = re.match(r'^选项(.+)$', you)
        if mm:
            parts = re.split(r'[／/]', mm.group(1)); opts = []
            for p in parts:
                p = re.sub(r'^[A-D]', '', p.strip()).strip()
                if p and p != '自由' and not p.startswith('自由'): opts.append(p)
            if opts:
                E('# CHOICE｜你怎么做？')
                for k, o in enumerate(opts[:3]): E('#### %s｜%s' % ('ABC'[k], o)); [E(x) for x in ans]
                E('# ·')
            i += 1; continue
        mm = re.match(r'^自由(?:窗口)?[：:]\s*(.+)$', you)
        if mm:
            topic = clean(mm.group(1)); meta['free'] += 1
            E('# CHOICE｜' + topic + '（可以直接打字说）'); E('#### A｜（' + topic + '）'); [E(x) for x in ans]; E('# ·'); i += 1; continue
        [E(x) for x in ans]; i += 1; continue
    if in_table and not l.startswith('|') and l and not l.startswith('>'): in_table = False
    i += 1
end_choice()
# calls at the end of their scenes
res = []
def emit_call(key):
    c = CALLS.get(key)
    if not c: return []
    meta['calls'] += 1
    return [narr('（📞 ' + c[0] + ' 打来了电话）'), mk('CALL', c[0], c[1])] + [say(c[0], x) for x in c[2]] + [mk('/CALL')]
chn = scn = 0
for x in out:
    if x.startswith('# CHAPTER') or x.startswith('# SCENE'):
        if scn > 0: res += emit_call((chn, scn))
        if x.startswith('# CHAPTER'): chn = int(re.search(r'\d+', x).group(0)); scn = 0
        else: scn += 1
    res.append(x)
    if x.startswith('# CHAPTER'): res += emit_call((chn, 0))
res += emit_call((chn, scn))
# CG at the last scene of each chapter + opening / finale films
idx_last = {}
cur = 0
for k, x in enumerate(res):
    if x.startswith('# CHAPTER'): cur = int(re.search(r'\d+', x).group(0))
    if x.startswith('# SCENE'): idx_last[cur] = k
maxch = max(idx_last) if idx_last else 0
for chn_ in sorted(idx_last, reverse=True):
    k = idx_last[chn_]
    res.insert(k + 1, mk('CG', 'cg_ch%02d' % chn_, res[k][8:]))
first_scene = next(k for k, x in enumerate(res) if x.startswith('# SCENE'))
res.insert(first_scene + 1, mk('VIDEO', 'vid_open', ''))
last_scene = max(k for k, x in enumerate(res) if x.startswith('# SCENE'))
res.insert(last_scene + 1, mk('VIDEO', 'vid_final', ''))
res = ['# 冰场之外 Off the Ice'] + [mk('CHAR', *map(str, c)) for c in CHARS] + res
open(OUT, 'w', encoding='utf8').write('\n'.join(res))
json.dump(meta, open(OUT + '.meta.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('chapters', len(meta['chapters']), 'bg', len(meta['bg']), 'rows', meta['rows'], 'calls', meta['calls'], 'games', meta['games'], 'free', meta['free'], 'lines', len(res), 'chars', sum(len(x) for x in res))
