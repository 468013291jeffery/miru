# English version of the converted scripts: same structure, every Chinese text unit swapped for its translation.
import re, json, sys, os
from urllib.parse import unquote, quote
H = os.path.dirname(os.path.abspath(__file__))
CJK = re.compile(r'[一-鿿]')
NAMES = {'陆识野': 'Lu Shiye', '方叙': 'Fang Xu', '林小满': 'Lin Xiaoman', '老周': 'Director Zhou', '顾母': 'Mom', '医院': 'Hospital', '顾昭': 'Gu Zhao',
         '凯兰': 'Caelan', '罗温': 'Rowan', '埃莉拉': 'Elira', '马雷克': 'Marek',
         '埃文': 'Evan', '马特奥': 'Mateo', '丹娜': 'Dana', '哈珀': 'Harper', '梅森': 'Mason'}
SHEET = set(NAMES)
BIO = {'陆识野': ('Best Actor / producer', 'Thirty-three. Best Actor and the film\'s producer. Only the second button of his suit is ever done up; his old watch runs twelve minutes slow; an old injury in his left shoulder. Says little, acts instead, never says your name.'),
 '方叙': ('Producer', 'Forty. A producer who is always on the phone and always doing the math. He believes feelings cost money, but he leaves a door open a crack.'),
 '林小满': ('Your agent', 'Twenty-eight. Your agent: a row of heels in one hand, the phone in the other, cries only in the parking garage. Your shield, and your soft spot.'),
 '老周': ('Director', 'Fifty-five. The director who never calls cut, watching everything from behind the monitor. The clearest head on set.'),
 '顾母': ('Your mother', 'Your mother. She doesn\'t say much; she only calls after the news.'),
 '医院': ('Hospital nurse', 'The nurse on duty at the hospital.'),
 '凯兰': ('Crown Prince', 'Twenty-six. Heir to Elindor, carrying the realm\'s safety on his shoulders. Mends clocks, drinks bitter tea, steps in front of risks meant for others, and never decides for you with his title.'),
 '罗温': ('Commander of the Royal Guard', 'Twenty-seven. By the book on procedure and safety; bakes on his days off. A steady ally.'),
 '埃莉拉': ('Commoners\' Council representative', 'Thirty. Trusts only evidence and policy that actually lands. She backs reform and calls out compromise in public.'),
 '马雷克': ('Regent Advisor', 'Fifty-one. Afraid of the system collapsing, skilled at steering council procedure, and every move he makes leaves a trace.'),
 '埃文': ('Team captain', 'Twenty-two. Hockey captain. Evidence before judgment, and he carries the whole team\'s mistakes alone. Breakfast at seven: eggs, not spicy, black coffee. Short sentences, no empty promises.'),
 '马特奥': ('Goalie', 'Twenty-one. Goalie who fixes old cameras. Says "don\'t thank me," but he\'s always watching out for the team.'),
 '丹娜': ('Head coach', 'Forty-five. Head coach. Backs an investigation, never a witch hunt.'),
 '哈珀': ('Team doctor', 'Thirty. Team doctor. Answers health questions only within what she\'s authorized to share.'),
 '梅森': ('Teammate', 'Twenty-one. Teammate competing for the starting spot, hostile to you from day one.')}  # speaker tokens that stay as-is (they are the cast keys)
def units(md):
    """every translatable Chinese string in a converted script"""
    out = []
    for l in md.split('\n'):
        l = l.strip()
        if not l: continue
        if l.startswith('⟦'):
            parts = l.strip('⟦⟧').split('|')
            if parts[0] in ('CALL', 'FREE', 'PHOTO', 'CHAR', 'CG', 'MG', 'BG', 'BGM'):
                for p in parts[1:]:
                    p = unquote(p)
                    if CJK.search(p) and p not in NAMES: out.append(p)
            continue
        if l.startswith('#'):
            m = re.match(r'^(#+\s*(?:CHAPTER \d+｜|SCENE｜|CHOICE｜|[A-D]｜)?)(.*)$', l)
            if m and CJK.search(m.group(2)): out.append(m.group(2).lstrip('⁣'))
            continue
        m = re.match(r'^([^：]{1,16})：“(.*)”$', l)
        if m:
            if m.group(1) == '旁白': out.append(m.group(2))
            else:
                if m.group(1) not in SHEET and m.group(1) != '你': out.append(m.group(1))
                out.append(m.group(2))
            continue
        if l.startswith('旁白：'): out.append(l[3:]); continue
        if CJK.search(l): out.append(l)
    return out
def T(s, D):
    s0 = s
    if not s or not CJK.search(s): return s
    if s in D: return D[s]
    if s in NAMES: return NAMES[s]
    sys.stderr.write('MISSING: ' + s0[:60] + '\n'); return s0
def rebuild(md, D):
    out = []
    for l in md.split('\n'):
        s = l.strip()
        if not s: out.append(l); continue
        if s.startswith('⟦'):
            parts = s.strip('⟦⟧').split('|'); k = parts[0]
            if k in ('CALL', 'FREE', 'PHOTO', 'CHAR', 'CG', 'MG', 'BG', 'BGM'):
                new = [k]
                for j, p in enumerate(parts[1:]):
                    v = unquote(p)
                    if j == 0 and k in ('CALL', 'CHAR', 'BG', 'CG', 'MG', 'BGM'): new.append(p)  # speaker key stays
                    else: new.append(quote(T(v, D), safe=''))
                if k == 'CHAR':
                    nm = unquote(parts[1])
                    if nm in BIO: new[5] = quote(BIO[nm][0], safe=''); new[6] = quote(BIO[nm][1], safe='')
                    new.append(quote(NAMES.get(unquote(parts[1]), unquote(parts[1])), safe=''))
                out.append('⟦' + '|'.join(new) + '⟧')
            else: out.append(s)
            continue
        if s.startswith('#'):
            m = re.match(r'^(#+\s*(?:CHAPTER \d+｜|SCENE｜|CHOICE｜|[A-D]｜)?)(.*)$', s)
            body = m.group(2); inv = body.startswith('⁣')
            out.append(m.group(1) + ('⁣' if inv else '') + T(body.lstrip('⁣'), D)); continue
        m = re.match(r'^([^：]{1,16})：“(.*)”$', s)
        if m:
            sp, tx = m.group(1), m.group(2)
            if sp == '旁白': out.append('旁白：' + T(tx, D))
            elif sp in SHEET or sp == '你': out.append(sp + '：“' + T(tx, D) + '”')
            else: out.append('旁白：' + T(sp, D) + ': “' + T(tx, D) + '”')
            continue
        if s.startswith('旁白：'): out.append('旁白：' + T(s[3:], D)); continue
        out.append(T(s, D) if CJK.search(s) else s)
    return '\n'.join(out)
if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'extract':
        pre = json.load(open(os.path.join(H, 'tsuns.md.pairs.json')))
        todo = {}
        for f in ('tsuns', 'crown', 'office'):
            for s in units(open(os.path.join(H, f + '.md')).read()):
                if s in pre or s in NAMES: continue
                todo.setdefault(s, f)
        items = list(todo.items())
        # batches of ~9000 chars, grouped by story so context stays coherent
        batches = []; cur = []; n = 0; last = None
        for s, f in items:
            if cur and (n > 9000 or f != last): batches.append(cur); cur = []; n = 0
            cur.append({'zh': s, 'story': f}); n += len(s); last = f
        if cur: batches.append(cur)
        os.makedirs(os.path.join(H, 'tr'), exist_ok=True)
        for i, b in enumerate(batches): json.dump(b, open(os.path.join(H, 'tr', 'b%02d.json' % i), 'w'), ensure_ascii=False, indent=0)
        print(len(items), 'strings,', sum(len(s) for s, f in items), 'chars,', len(batches), 'batches', [len(b) for b in batches])
    if cmd == 'build':
        D = dict(json.load(open(os.path.join(H, 'tsuns.md.pairs.json'))))
        import glob
        for fn in sorted(glob.glob(os.path.join(H, 'tr', 'o*.json'))): D.update(json.load(open(fn)))
        for f in ('tsuns', 'crown', 'office'):
            open(os.path.join(H, f + '.en.md'), 'w').write(rebuild(open(os.path.join(H, f + '.md')).read(), D))
        print('ok', len(D))
