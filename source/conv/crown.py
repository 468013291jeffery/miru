# 《王冠的最后誓言》The Crown's Last Oath → MIRU markup.  Player = 你（皇家誓约记录员）
import re, sys, json, os
sys.path.insert(0, os.path.dirname(__file__))
from miru94 import mk, say, narr, bgm_for, clean
SRC, OUT = sys.argv[1], sys.argv[2]
raw = open(SRC, encoding='utf8').read().replace('‑', '-').replace('‐', '-')
L = []
for l in raw.split('\n'):
    l = re.sub(r'^[>#\s]+', '', l.strip()).strip()
    if l: L.append(l)
out = []; E = out.append
meta = {'chapters': [], 'bg': [], 'calls': 0, 'games': 0, 'free': 0}
SKIP = re.compile(r'^(.*要不要我|.*主线正文已经|章节ID|单章预估|设计说明|分支后果|分支逻辑|分支记忆|转场钩子|跳转|本章退出状态|记忆写入|触发条件|互动内容|romanceable|interaction_entries|daily_topics|plot_conversation|special_interactions|relationship_before|knowledge_changes|memory_carryover|skip_or_decline|如果你想继续|操作：|全局初始化|【I0\d|【深度复|【凯兰专属|【次要NPC|【手记|可选落笔|若|如果投票|仪式成功|暂时封存|mem_|SEED|relation_|arc_|本章|章节体验|容量目标|技术标记|项目遵循|开篇简介|故事前情|角色任务|【分支选)')
CHARS = [('凯兰', 'm', 26, 'm1', '王储', '26岁王储，背负王国公共安全责任；修钟、苦茶，习惯替别人挡风险，从不以王储身份替你做决定。'),
         ('罗温', 'm', 27, 'm5', '禁卫统领', '27岁禁卫统领，严守程序与安全，休息时爱烘焙，可靠的盟友。'),
         ('埃莉拉', 'f', 30, 'f1', '平民议会代表', '30岁平民议会代表，只认证据和政策落地，会支持改革，也会公开批评妥协。'),
         ('马雷克', 'm', 51, 'm4', '摄政顾问', '51岁摄政顾问，畏惧制度崩塌，擅长操纵议事流程，所有操作都会留下痕迹。')]
# real calls: in Elindor people speak through paired "传声铜镜" — the call screen is the mirror lighting up
CALLS = {
 (2, 3): ('凯兰', '深夜，你的传声铜镜亮了。凯兰在镜子那头，声音压得很低：他听说你今天去了工坊街', ['工坊街有密探。你没事吧？', '我不是来问你查到了什么。', '我只想确认，你今晚是安全的。']),
 (4, 6): ('凯兰', '传声铜镜再次亮起。凯兰刚从议事会出来，想听你对第一份誓言的看法', ['议事会刚散。我脑子里全是你下午那句话。', '如果是你来写这份誓言，你会怎么写？', '你说，我记。']),
 (7, 5): ('罗温', '投票前夜，罗温用禁卫的传声铜镜找到你，语气一如既往地公事公办', ['明天投票，宫门换岗表我已经改了。', '有人会在议事厅外等你，我的人会跟着。', '你有什么要我提前安排的，现在说。']),
 (9, 4): ('凯兰', '王冠天平启动前夜，凯兰的铜镜在你桌上亮了很久，你才接起', ['明天之后，我可能就不能这样找你了。', '我不是要你承诺什么。', '只是想在一切开始之前，听听你的声音。']),
}
GAMES = {(1, 4): 'scratch_note', (2, 1): 'find_clue', (3, 2): 'code_door', (4, 3): 'order_vow', (5, 2): 'slide_letter', (6, 2): 'slide_sigil',
         (7, 2): 'quiz_court', (8, 2): 'find_letter', (9, 3): 'balance_tray', (10, 4): 'simon_spell'}
ch = 0; sc = 0; last_choice = False; started = False
def opts_choice(q, opts):
    global last_choice
    opts = [clean(re.sub(r'【可见风险[^】]*】|（[^）]*线[^）]*）', '', o)).strip('；;。 ') for o in opts]
    opts = [o for o in opts if o]
    if not opts: return
    E('# CHOICE｜' + q); [E('#### %s｜%s' % ('ABCD'[k], o)) for k, o in enumerate(opts[:4])]; E('# ·'); last_choice = True
def circled(s):
    parts = re.split(r'[①②③④⑤⑥]', s)
    return [p.strip(' ；;，,。') for p in parts[1:] if p.strip(' ；;，,。')]
def flush_scene_extras():
    pass
i = 0
while i < len(L):
    l = L[i]
    m = re.match(r'^CH(\d{2})\s*(.+)$', l)
    if m and not l.startswith('CH01~'):
        ch = int(m.group(1)); sc = 0; started = True; title = m.group(2).strip()
        E(''); E('# CHAPTER %d｜%s' % (ch, title)); meta['chapters'].append(title); i += 1; last_choice = False; continue
    if l.startswith('尾声'):
        ch = 11; sc = 0; started = True; E(''); E('# CHAPTER 11｜' + l.split('：', 1)[-1]); meta['chapters'].append('尾声'); i += 1; continue
    if not started: i += 1; continue
    m = re.match(r'^(?:K\d{2}|EP)-S(\d+)\s*(.+?)(?:【.*)?$', l)
    if m:
        sc = int(m.group(1)); place = m.group(2).strip()
        E('# SCENE｜' + place); last_choice = False
        g = GAMES.get((ch, sc))
        if g: E(mk('MG', g, place)); meta['games'] += 1
        i += 1; continue
    if '【BG-DESC】' in l or '【BGM-TAG】' in l:
        bg = re.search(r'【BG-DESC】(.*?)(?:【BGM-TAG】|$)', l); tg = re.search(r'【BGM-TAG】\s*(\S+)', l)
        if bg and bg.group(1).strip():
            slot = 'bg_ch%02d_s%d' % (ch, sc); meta['bg'].append({'slot': slot, 'ch': ch, 'sc': sc, 'desc': bg.group(1).strip()}); E(mk('BG', slot, ''))
        if tg: E(mk('BGM', bgm_for(tg.group(1)), tg.group(1)))
        i += 1
        continue
    if SKIP.match(l) or re.match(r'^[✅⚖️❌]', l): i += 1; continue
    if l.startswith('【FREE_INPUT】'):
        if not last_choice: E(mk('FREE', '此刻，你想说什么？')); meta['free'] += 1
        last_choice = False; i += 1; continue
    if l.startswith('【环境调查子交互'):
        j = i + 1; opts = []
        if j < len(L) and ('①' in L[j]): opts = circled(L[j].split('：', 1)[-1] if L[j].startswith('可选') else L[j]); j += 1
        if opts: opts_choice('环境调查：你先留意哪里？', opts)
        i = j; continue
    if l.startswith('【选项分支') or l.startswith('【预设') or l.startswith('【走访路线') or re.match(r'^【.{0,10}(分支|选择|选项).{0,10}】$', l):
        inline = re.split(r'\d\.\s*【[^】]*】', l)
        opts = [x for x in inline[1:] if x.strip()]
        j = i + 1
        if not opts:
            while j < len(L) and not re.match(r'^(【|旁白|K\d|EP-|CH\d|跳转|分支|转场|记忆|本章)', L[j]) and not re.match(r'^[^\s（：“]{1,8}（', L[j]) and len(L[j]) < 160:
                if '①' in L[j]: opts += circled(L[j])
                else: opts.append(L[j])
                j += 1
        q = '你怎么做？'
        if '应对' in l: q = '你怎么应对？'
        if '走访' in l: q = '先去哪里？'
        opts_choice(q, opts); i = j; continue
    if l.startswith('旁白'):
        t = re.sub(r'^旁白[：:]\s*', '', l); t = re.sub(r'✅?【[^】]*线[^】]*】', '', t)
        for p in re.split(r'(?<=[。！？])\s+', t):
            if p.strip(): E(narr(p))
        last_choice = False; i += 1; continue
    # speaker forms
    m = re.match(r'^([^\s（：“”]{1,8})(?:（[^）]*）)?\s*[：:]?\s*“(.+?)”\s*(.*)$', l)
    if m and not m.group(1).startswith('【'):
        E(say(m.group(1), m.group(2)))
        rest = m.group(3)
        if '①' in rest: opts_choice('你怎么回应？', circled(rest.split('可选', 1)[-1]))
        last_choice = False; i += 1; continue
    m = re.match(r'^([^\s（：“”【]{1,8})(?:（[^）]*）)?[：:]?$', l)
    if m and i + 1 < len(L) and L[i + 1].startswith('“'):
        q = L[i + 1]; E(say(m.group(1), q.split('”')[0].lstrip('“'))); last_choice = False; i += 2; continue
    if l.startswith('“'): E(narr(l)); i += 1; continue
    if l.startswith('可选行动') or l.startswith('可选操作'):
        opts_choice('你先做什么？', circled(l)); i += 1; continue
    if len(l) < 220 and not l.startswith('【'): E(narr(l)); last_choice = False
    i += 1
    # a call at the end of the scene that asked for it
# inject calls at the end of their scenes
res = []; cur = (0, 0)
def emit_call(key):
    c = CALLS.get(key)
    if not c: return []
    meta['calls'] += 1
    return [narr('（传声铜镜亮了——' + c[0] + '）'), mk('CALL', c[0], c[1])] + [say(c[0], x) for x in c[2]] + [mk('/CALL')]
chn = 0; scn = 0
for x in out:
    if x.startswith('# CHAPTER') or x.startswith('# SCENE'):
        res += emit_call((chn, scn))
        if x.startswith('# CHAPTER'): chn = int(re.search(r'\d+', x).group(0)); scn = 0
        else: scn += 1
    res.append(x)
res += emit_call((chn, scn))
def tidy(x):
    if not x.startswith('旁白：'): return x
    t = x[3:]
    if re.match(r'^(转场钩子|分支|记忆|跳转)', t): return None
    t = re.sub(r'[，；,;]?\s*(剧情)?跳转\s*(K\d+|EP)-S\d+', '', t)
    t = re.sub(r'(写入|存入)?\s*(个人笔记)?\s*mem_[A-Za-z0-9_]+', '', t)
    t = re.sub(r'SEED\w*|relation_\w+|[A-Z]{3,}_[A-Z0-9_]+', '', t).strip('；;，, ')
    return ('旁白：' + t) if len(t) > 1 else None
res = [y for y in (tidy(x) for x in res) if y is not None]
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
res = ['# 王冠的最后誓言'] + [mk('CHAR', *map(str, c)) for c in CHARS] + res
open(OUT, 'w', encoding='utf8').write('\n'.join(res))
json.dump(meta, open(OUT + '.meta.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('chapters', len(meta['chapters']), 'bg', len(meta['bg']), 'calls', meta['calls'], 'games', meta['games'], 'free', meta['free'], 'lines', len(res))
