#!/usr/bin/env python3
"""python3 content/deep/validate_heir.py <scene>  — checks content/deep/heir_ch1_s<scene>.json
(adapted from validate3.py for "The Heir He Came Back For": POV adrianv, pick/feature/lock stops, toolkit-v5 directives)"""
import json, sys, glob, os
H = os.path.dirname(os.path.abspath(__file__)); wid, chn, sn = "heir", 2, int(sys.argv[1])
pack = [d for d in (json.load(open(f)) for f in glob.glob(H + "/../out/s*.json")) if d["wid"] == wid][0]
cast = {c["id"] for c in pack["cast"]}; POV = "adrianv"; PAIRS = {"adrianv|roman", "roman|sienna", "adrianv|sienna"}
d = json.load(open(f"{H}/{wid}_ch{chn}_s{sn}.json")); E = []
STOPS = {"line", "pick", "photo", "video", "game", "call", "voice", "feature", "missed", "reveal"}
FEATS = {"feed", "phone", "match", "group", "heart", "snap", "quiz", "lie", "bottle"}
FXK = {"rain", "storm", "wind", "snowfall", "blizzard", "candle", "blackout", "drip", "hearts", "petals", "confetti", "none","flashes","danger","glassrain","aurora","starwarp","fireworks","neon","godrays","galaxy","inferno","bokeh3d"}
DIMK = {"att", "tru", "jea", "ten", "gru"}
NEED = set()
BANNED = ["仿佛", "不禁", "嘴角勾起", "一抹", "勾起一抹"]
EXPLICIT = ["性器", "勃起", "硬物", "插入", "抽动", "抽插", "拉链", "内裤", "下身", "鼓起", "erection", "crotch", "zipper", "groin", "thrust", "inside him", "penetrat", "bulge", "his hard", "人鱼线"]

def chk_rd(rd, where):
    if not isinstance(rd, dict): E.append(f"{where}: rd must be an object"); return
    for p, v in rd.items():
        if p not in PAIRS: E.append(f"{where}: rd pair {p} not declared")
        for k in v:
            if k not in DIMK: E.append(f"{where}: rd key {k}")

def text_checks(x, where):
    if not isinstance(x, str): return
    for b in BANNED:
        if b in x: E.append(f"{where}: cliché '{b}': {x[:30]}")
    for b in EXPLICIT:
        if b.lower() in x.lower(): E.append(f"{where}: explicit term '{b}': {x[:40]}")

def walk_text(x, where):
    if isinstance(x, str): text_checks(x, where)
    elif isinstance(x, list): [walk_text(v, where) for v in x]
    elif isinstance(x, dict): [walk_text(v, where + "." + k) for k, v in x.items()]

def beat(b, where, inline=False):
    if not (isinstance(b, list) and len(b) == 3): E.append(f"{where}: bad beat {str(b)[:80]}"); return 0, []
    w, k, x = b
    if w == "sys":
        if k == "scene":
            if not isinstance(x, dict) or not str(x.get("img", "")).startswith("heir/") or not x.get("place"): E.append(f"{where}: scene needs heir/img + place")
            return 1, []
        if k == "if":
            if not x.get("cond"): E.append(f"{where}: if needs cond")
            a = lines(x.get("then", []), where + ".then"); b2 = lines(x.get("else", []), where + ".else")
            return (a[0] + b2[0]) / 2, a[1] + b2[1]
        if k == "bg":
            if not str(x.get("img", "")).startswith("heir/"): E.append(f"{where}: bg img must be heir/…")
            return 0, []
        if k == "bgm":
            return 0, []
        if k == "fx":
            if x.get("k") not in FXK: E.append(f"{where}: fx k {x.get('k')}")
            return 0, []
        if k == "rd":
            chk_rd({x.get("p"): x.get("d", {})}, where)
            if not x.get("why"): E.append(f"{where}: rd needs why")
            return 0, []
        if k == "mono":
            for y in x.get("t", []):
                if y[0] not in cast: E.append(f"{where}: mono speaker {y[0]}")
                if y[0] == POV: E.append(f"{where}: no POV monologue")
            return 0, []
        if k == "set":
            if not isinstance(x.get("flag"), str): E.append(f"{where}: set flag must be a string")
            return 0, []
        if k in ("title", "anchor"): return (1, []) if x.get("t") else (E.append(f"{where}: {k} needs t") or (0, []))
        if k == "money": return (1, []) if x.get("from") and x.get("to") else (E.append(f"{where}: money needs from/to") or (0, []))
        if k == "post":
            if not x.get("handle") or not x.get("txt"): E.append(f"{where}: post needs handle/txt")
            return 1 + len(x.get("cm", [])) * 0.25, []
        if k == "event":
            if not isinstance(x, dict) or not x.get("title"): E.append(f"{where}: event needs title")
            return 1, ["event"]
        if k == "recall":
            if not isinstance(x, dict) or x.get("who") not in cast or not isinstance(x.get("txt"), str) or not x["txt"].strip(): E.append(f"{where}: recall needs who (cast id) + txt")
            return 1, ["recall"]
        E.append(f"{where}: unknown sys {k}"); return 0, []
    if k == "lock":
        if not x.get("title") or not x.get("then"): E.append(f"{where}: lock needs title+then")
        lines(x.get("then", []), where + ".lock"); return 0, ["lock"]
    if k in STOPS: return stop(b, where)
    if w != "n" and w not in cast: E.append(f"{where}: unknown speaker {w}")
    if w == POV and k not in ("say","think"): E.append(f"{where}: scripted Adrian beat must be say/think: {str(x)[:40]}")
    if w == "n" and k != "act": E.append(f"{where}: narrator must be 'act'")
    if k not in ("say", "act", "think"): E.append(f"{where}: bad kind {k}")
    if not isinstance(x, str) or not x.strip(): E.append(f"{where}: empty text"); return 1, []
    if ".zh" in where or where.startswith("beats.zh") or ".zh" in where:
        if k == "act" and w != "n" and x.startswith("我"): E.append(f"{where}: actions are third person: {x[:30]}")
        if w == "n" and len(x) > 90: E.append(f"{where}: narration too long ({len(x)} chars, max 90): {x[:30]}…")
    return 1, []

def lines(L, where, inline=True):
    p = 0; ks = []
    for i, b in enumerate(L): a, k = beat(b, f"{where}[{i}]", inline); p += a; ks += k
    return p, ks

def stop(b, where):
    w, k, d = b
    if not isinstance(d, dict): E.append(f"{where}: stop data must be an object"); return 0, []
    def req(*ks):
        for x in ks:
            if x not in d: E.append(f"{where} {k}: missing '{x}'")
    if k == "line":
        if w not in (POV, "roman"): E.append(f"{where}: line stop speaker must be {POV} or roman")
        if w == "roman": RL.append(where)
        req("hint", "opts"); o = d.get("opts", [])
        if not 2 <= len(o) <= 5: E.append(f"{where}: line needs 2-5 opts")
        tot = 0
        for j, x in enumerate(o):
            if x.get("k") not in ("say", "act", "think") or not x.get("t"): E.append(f"{where} opt{j}: needs k + t")
            if "rd" not in x: E.append(f"{where} opt{j}: missing rd")
            else: chk_rd(x["rd"], f"{where} opt{j}")
            if "set" in x and not isinstance(x["set"], str): E.append(f"{where} opt{j}: set must be a flag string")
            tot += lines(x.get("then", []), f"{where} opt{j}.then")[0]
        return 1 + tot / max(1, len(o)), ["line"]
    if k == "pick":
        if w != POV: E.append(f"{where}: pick speaker must be {POV}")
        req("title", "hint", "items"); o = d.get("items", [])
        if not 2 <= len(o) <= 6: E.append(f"{where}: pick needs 2-6 items")
        tot = 0
        for j, x in enumerate(o):
            if not x.get("t"): E.append(f"{where} item{j}: needs t")
            if "rd" in x: chk_rd(x["rd"], f"{where} item{j}")
            if "set" in x and not isinstance(x["set"], str): E.append(f"{where} item{j}: set must be a flag string")
            tot += lines(x.get("then", []), f"{where} item{j}.then")[0]
        return 1 + tot / max(1, len(o)), ["pick"]
    if k == "photo": req("cap", "prompt", "then", "skip")
    if k == "feature":
        req("k", "cid", "hint", "skip"); fk = d.get("k")
        if fk not in FEATS: E.append(f"{where}: feature k {fk}")
        if fk == "group":
            req("name", "msgs", "items"); its = d.get("items", [])
            for j, x in enumerate(its):
                if "set" in x and not isinstance(x["set"], str): E.append(f"{where} item{j}: set must be a flag string")
                if "rd" in x: chk_rd(x["rd"], f"{where} item{j}")
            return 1 + sum(lines(x.get("then", []), f"{where} item{j}")[0] for j, x in enumerate(its)) / max(1, len(its)), ["feature:group"]
        req("win", "lose")
        if fk == "feed":
            req("cams", "answer")
            if len(d.get("cams", [])) != 4: E.append(f"{where}: feed needs 4 cams")
        if fk == "match":
            for j, q in enumerate(d.get("qs", [])):
                if not (0 <= q.get("a", -1) < len(q.get("opts", []))): E.append(f"{where} q{j}: bad answer index")
            if not 3 <= len(d.get("qs", [])) <= 5: E.append(f"{where}: match needs 3-5 qs")
        if fk == "phone":
            req("owner", "apps")
            for a in d.get("apps", []):
                if "set" in a and not isinstance(a["set"], str): E.append(f"{where} app {a.get('id')}: set must be a flag string")
        a = lines(d.get("win", []), where + ".win")[0]; b2 = lines(d.get("lose", []), where + ".lose")[0]
        return 1 + (a + b2) / 2, ["feature:" + str(fk)]
    if k == "missed":
        req("cid", "hint", "lines", "then", "skip")
        if d.get("cid") not in cast: E.append(f"{where}: missed cid must be a cast id")
        ml = d.get("lines", [])
        if not 3 <= len(ml) <= 10: E.append(f"{where}: missed needs 3-10 lines")
        for j, x in enumerate(ml):
            if not (isinstance(x, list) and len(x) == 2 and x[0] in cast and isinstance(x[1], str) and x[1].strip()): E.append(f"{where} missed line {j}: [speakerId,text]")
        lines(d.get("skip", []), where + ".skip")
        return 1 + len(ml) + lines(d.get("then", []), where + ".then")[0], ["missed"]
    if k == "reveal":
        req("img", "lines")
        if w != POV: E.append(f"{where}: reveal speaker must be {POV}")
        for im in ("img", "img2"):
            if im in d and not str(d[im]).startswith("heir/"): E.append(f"{where}: reveal {im} must be heir/…")
        rl = d.get("lines", [])
        if not 4 <= len(rl) <= 10: E.append(f"{where}: reveal needs 4-10 lines")
        for j, x in enumerate(rl):
            if not isinstance(x, str) or not x.strip(): E.append(f"{where} reveal line {j}: empty")
            elif ".zh" in where and len(x) > 60: E.append(f"{where} reveal line {j}: too long ({len(x)} chars, max 60): {x[:30]}…")
        return len(rl), ["reveal"]
    if k == "voice": req("who", "txt", "hint", "then", "skip")
    if k == "call":
        req("cid", "lines", "hint", "then", "skip")
        if not 3 <= len(d.get("lines", [])) <= 10: E.append(f"{where}: call needs 3-10 lines")
        for j, x in enumerate(d.get("lines", [])):
            if not (isinstance(x, list) and len(x) == 2 and x[0] in cast): E.append(f"{where} call line {j}: [speakerId,text]")
    t = lines(d.get("then", []), where + ".then")[0]
    return 1 + t + (len(d.get("lines", [])) if k == "call" else 0), [k]

RL = []
res = {}
for lang in ("zh", "en"):
    L = d["beats"][lang]
    if not (L and L[0][0] == "sys" and L[0][1] == "scene"): E.append(f"{lang}: first beat must be the scene directive")
    p, ks = lines(L, f"beats.{lang}", inline=False); res[lang] = (round(p), {k: ks.count(k) for k in set(ks)})
    if p < 60 or p > 140: E.append(f"{lang}: ~{round(p)} played lines (need 60–140)")
    for k in NEED:
        if k not in ks: E.append(f"{lang}: scene {sn} needs a '{k}' stop")
    if lang == "zh": walk_text(L, "beats.zh")
    else: walk_text(L, "beats.en")
if sn == 4:
    for c in ("A", "B", "C", "D"):
        for lang in ("zh", "en"):
            T = d.get("then", {}).get(c, {}).get(lang)
            if T is None: E.append(f"then.{c}.{lang} missing"); continue
            p, ks = lines(T, f"then.{c}.{lang}")
            walk_text(T, f"then.{c}.{lang}")
            if p < 12: E.append(f"then.{c}.{lang}: only {round(p)} lines (need ≥12)")
            if not [k for k in ks if k != "event"]: E.append(f"then.{c}.{lang}: needs at least one stop")

def shape(x):
    """structure signature with every human-language string blanked, so zh/en must match index-for-index all the way down"""
    if isinstance(x, str): return "s"
    if isinstance(x, list): return [shape(v) for v in x]
    if isinstance(x, dict): return {k: shape(v) for k, v in x.items()}
    return x
BEATK = {"act", "say", "think", "line", "pick", "feature", "photo", "video", "game", "call", "voice", "lock", "scene", "bg", "fx", "set", "if", "event", "mono", "rd", "title", "money", "post", "anchor", "bgm", "recall", "missed", "reveal"}
def ids(x):
    if isinstance(x, list) and len(x) == 3 and isinstance(x[0], str) and x[1] in BEATK: return [x[0], x[1], ids(x[2])]
    if isinstance(x, list): return [ids(v) for v in x]
    if isinstance(x, dict): return {k: (v if k in ("k", "img", "img2", "id", "cid", "who", "set", "flag", "answer", "a", "p", "ic", "icon", "lock") else ids(v)) for k, v in x.items()}
    return "s" if isinstance(x, str) else x
if shape(d["beats"]["zh"]) != shape(d["beats"]["en"]): E.append("zh/en structure differs")
if ids(d["beats"]["zh"]) != ids(d["beats"]["en"]): E.append("zh/en speakers/kinds/ids differ")
if sn == 4:
    for c in d.get("then", {}):
        if shape(d["then"][c]["zh"]) != shape(d["then"][c]["en"]) or ids(d["then"][c]["zh"]) != ids(d["then"][c]["en"]): E.append(f"then.{c}: zh/en differ")
print("played lines / stops:", res, "· roman line stops:", len([x for x in RL if x.startswith("beats.en")]))
print("\n".join(E[:60]) if E else "OK ✓"); sys.exit(1 if E else 0)
