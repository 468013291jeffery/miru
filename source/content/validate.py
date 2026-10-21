#!/usr/bin/env python3
"""Validate a MIRU story pack JSON (content/out/sNN.json). Prints OK or a list of errors."""
import json, sys, os

WIDS = "ice crimson made pole fourth unseelie pact night pack light split roomies offbook bratva lowseason afterhours masque gala market dog crush float laundry rewind secondset dragon heroics forecast august twominutes recipe openhouse lastplate turn lastjam landing".split()
HERE = os.path.dirname(os.path.abspath(__file__))
EXIST = json.load(open(os.path.join(HERE, "existing_chars.json")))
REUSE = {"ada": "sasha", "riley": "marisol", "mara": "nora", "finn": "callum", "lena": "dakota", "june": "june"}
ARCH = {"guard", "charm", "dark", "grump", "steady", "sun"}
KINDS = {"say", "act", "think"}

def main(path):
    E = []
    try:
        d = json.load(open(path))
    except Exception as ex:
        print("JSON PARSE ERROR:", ex); return 1
    def bi(x, where, maxen=None):
        if not isinstance(x, dict) or not isinstance(x.get("en"), str) or not isinstance(x.get("zh"), str) or not x["en"].strip() or not x["zh"].strip():
            E.append(f"{where}: needs non-empty {{en,zh}}"); return
        if maxen and len(x["en"]) > maxen: E.append(f"{where}: en longer than {maxen} chars ({len(x['en'])})")
    n = d.get("n")
    if not isinstance(n, int) or not 1 <= n <= 36: E.append("n must be 1..36")
    elif d.get("wid") != WIDS[n - 1]: E.append(f"wid must be {WIDS[n-1]}")
    if d.get("or") not in ("bl", "gl", "bg", "all"): E.append("or")
    if d.get("kind") not in ("story", "ensemble"): E.append("kind")
    if d.get("heat") not in ("fluff", "slow", "steamy", "mature"): E.append("heat")
    for k, mx in (("title", 60), ("hook", 110), ("logline", 240), ("premise", None), ("you", None), ("stakes", None), ("place", None), ("time", None)):
        bi(d.get(k), k, mx)
    tags = d.get("tags")
    if not isinstance(tags, list) or not 4 <= len(tags) <= 8: E.append("tags: 4..8 items")
    if not isinstance(d.get("tag_zh", {}), dict): E.append("tag_zh must be an object")
    cast = d.get("cast") or []
    ids = [c.get("id") for c in cast]
    ens = d.get("kind") == "ensemble" and d.get("or") == "all"
    if len(cast) < 2: E.append("cast: at least 2")
    if not ens:
        povs = [c for c in cast if c.get("pov")]
        if len(povs) != 1: E.append("cast: exactly one pov:true")
        for c in cast:
            w = f"cast[{c.get('id')}]"
            for k in ("n",):
                if not isinstance(c.get(k), str): E.append(w + ".n")
            if not isinstance(c.get("age"), int) or c["age"] < 21: E.append(w + ".age must be an int >= 21")
            if c.get("g") not in ("m", "f", "nb"): E.append(w + ".g")
            if c.get("a") not in ARCH: E.append(w + ".a")
            for k in ("role", "vibe", "twist", "likes", "secret", "pitch", "want", "fear", "boundary", "solo"):
                bi(c.get(k), w + "." + k)
            tl = c.get("tells")
            if not (isinstance(tl, dict) and isinstance(tl.get("en"), list) and isinstance(tl.get("zh"), list) and len(tl["en"]) >= 2 and len(tl["zh"]) == len(tl["en"])):
                E.append(w + ".tells: {en:[2+],zh:[same]}")
            cid = c.get("id")
            src = cid if cid in EXIST else REUSE.get(cid)
            if src:
                if c.get("looks") != EXIST[src]["looks"]: E.append(w + f".looks must be copied exactly from existing '{src}'")
            elif c.get("looks") is not None: E.append(w + ".looks must be null for a brand-new character")
    else:
        for c in cast:
            if c.get("id") not in EXIST: E.append(f"ensemble cast {c.get('id')} must be an existing character")
            bi(c.get("au_role"), f"cast[{c.get('id')}].au_role")
        if not d.get("pov") in ids: E.append('ensemble: add top-level "pov": "<cast id>" (whose side choices are on)')
    for r in d.get("rel") or []:
        if not (isinstance(r, list) and len(r) == 3 and (r[0] in ids or r[0] == "you") and (r[1] in ids or r[1] == "you")): E.append(f"rel bad: {r}")
        else: bi(r[2], "rel text")
    if not d.get("rel"): E.append("rel: at least one")
    for j in d.get("join") or []:
        if j.get("as") not in ids + ["side"]: E.append(f"join.as {j.get('as')}")
        bi(j.get("t"), "join.t")
    if not d.get("join"): E.append("join: at least one")
    valid = set(ids) | {"n"}
    def beats(b, where, lo, hi):
        if not isinstance(b, dict) or not isinstance(b.get("en"), list) or not isinstance(b.get("zh"), list):
            E.append(where + ": {en:[],zh:[]}"); return
        en, zh = b["en"], b["zh"]
        if not lo <= len(en) <= hi: E.append(f"{where}: {lo}-{hi} beats (has {len(en)})")
        if len(en) != len(zh): E.append(f"{where}: en/zh beat counts differ ({len(en)} vs {len(zh)})"); return
        for i, (a, z) in enumerate(zip(en, zh)):
            if not (isinstance(a, list) and len(a) == 3 and isinstance(z, list) and len(z) == 3): E.append(f"{where}[{i}]: [who,kind,text]"); continue
            if a[0] not in valid: E.append(f"{where}[{i}]: who '{a[0]}' not in cast")
            if a[1] not in KINDS: E.append(f"{where}[{i}]: kind '{a[1]}'")
            if a[0] == "n" and a[1] != "act": E.append(f"{where}[{i}]: narration must be act")
            if a[0] != z[0] or a[1] != z[1]: E.append(f"{where}[{i}]: zh who/kind must match en")
            if not str(a[2]).strip() or not str(z[2]).strip(): E.append(f"{where}[{i}]: empty text")
            if len(str(a[2]).split()) > 40: E.append(f"{where}[{i}]: en beat over 40 words")
    chs = d.get("chapters") or []
    if len(chs) != 8: E.append(f"chapters: exactly 8 (has {len(chs)})")
    for i, c in enumerate(chs):
        w = f"ch{i+1}"
        bi(c.get("t"), w + ".t", 48); bi(c.get("goal"), w + ".goal", 110); bi(c.get("place"), w + ".place"); bi(c.get("time"), w + ".time"); bi(c.get("ask"), w + ".ask", 80)
        beats(c.get("beats"), w + ".beats", 5, 10)
        cs = c.get("choices") or []
        if [x.get("k") for x in cs] != ["A", "B", "C"]: E.append(w + ".choices: A,B,C in order")
        for x in cs:
            ww = w + ".choice" + str(x.get("k"))
            bi(x.get("t"), ww + ".t", 70)
            beats(x.get("then"), ww + ".then", 2, 5)
            bi(x.get("mem"), ww + ".mem")
    en = d.get("endings") or {}
    for k in "ABC":
        e = en.get(k) or {}
        bi(e.get("t"), f"endings.{k}.t"); bi(e.get("txt"), f"endings.{k}.txt")
        ln = e.get("line") or {}
        if ln.get("who") not in ids: E.append(f"endings.{k}.line.who")
        bi({"en": ln.get("en"), "zh": ln.get("zh")}, f"endings.{k}.line")
    b = d.get("bonus") or {}
    bi(b.get("t"), "bonus.t"); bi(b.get("d"), "bonus.d"); bi(d.get("polaroid"), "polaroid")
    f = d.get("features") or {}
    for k in ("game", "gift", "date", "photo", "voice", "room"): bi(f.get(k), "features." + k)
    dr = d.get("director") or {}
    if len(dr.get("allowed") or []) < 3: E.append("director.allowed: 3")
    if len(dr.get("au") or []) < 2: E.append("director.au: 2")
    for x in (dr.get("allowed") or []) + (dr.get("au") or []): bi(x, "director item")
    if E:
        print(f"{len(E)} ERROR(S):"); [print(" -", e) for e in E[:80]]; return 1
    print("OK", path); return 0

if __name__ == "__main__":
    sys.exit(max(main(p) for p in sys.argv[1:]))
