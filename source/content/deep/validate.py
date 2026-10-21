#!/usr/bin/env python3
"""python3 content/deep/validate.py <wid> <chapter-number>   — checks content/deep/<wid>_ch<N>.json against DEEP_SPEC.md"""
import json,sys,glob,os
H=os.path.dirname(os.path.abspath(__file__));wid,n=sys.argv[1],int(sys.argv[2])
pack=[json.load(open(f)) for f in glob.glob(H+"/../out/s*.json") if json.load(open(f))["wid"]==wid][0]
cast={c["id"] for c in pack["cast"]};pov=pack.get("pov") or next(c["id"] for c in pack["cast"] if c.get("pov"))
d=json.load(open(f"{H}/{wid}_ch{n}.json"));E=[]
GAMES={"phone","remember","asleep","photo","keepsake","shutter","sync","order"};GIFTS={"coffee","flower","hoodie","letter","ring"}
STOPS={"line","gift","photo","video","game","call","voice"}
def beat_ok(b,where,allow_pov=True):
    if not(isinstance(b,list) and len(b)==3):E.append(f"{where}: bad beat {str(b)[:80]}");return False
    w,k,t=b
    if k in STOPS:return True
    if w!="n" and w not in cast:E.append(f"{where}: unknown speaker {w}")
    if w=="n" and k!="act":E.append(f"{where}: narrator must be 'act'")
    if k not in("say","act","think"):E.append(f"{where}: bad kind {k}")
    if not isinstance(t,str) or not t.strip():E.append(f"{where}: empty text")
    if not allow_pov and w==pov:E.append(f"{where}: scripted {pov} beat — {pov} only speaks through 'line' stops: {t[:50]}")
    return True
def lines(L,where):
    for i,b in enumerate(L):beat_ok(b,f"{where}[{i}]",True)
    return len(L)
def stop_ok(b,where):
    w,k,d=b
    def req(*ks):
        for x in ks:
            if x not in d:E.append(f"{where} {k}: missing '{x}'")
    if k=="line":
        if w!=pov:E.append(f"{where}: line stop speaker must be {pov}")
        req("hint","opts");o=d.get("opts",[])
        if not 2<=len(o)<=3:E.append(f"{where}: line needs 2-3 opts")
        for j,x in enumerate(o):
            if x.get("k") not in("say","act","think") or not x.get("t"):E.append(f"{where} opt{j}: needs k + t")
            lines(x.get("then",[]),f"{where} opt{j}.then")
        return 1+sum(len(x.get("then",[])) for x in o)/max(1,len(o))
    if k=="gift":
        req("who","hint","then","skip");by=d.get("by",{})
        if set(by)!=GIFTS:E.append(f"{where}: gift 'by' must react to all of {sorted(GIFTS)}")
        for g,L in by.items():lines(L,f"{where}.by.{g}")
        lines(d.get("then",[]),where+".then");return 1+sum(len(L) for L in by.values())/5+len(d.get("then",[]))
    if k=="photo":req("cap","prompt","then","skip")
    if k=="video":
        req("clip","cap","hint","then")
        if d.get("clip") not in CLIPS:E.append(f"{where}: clip must be one of {CLIPS}")
    if k=="voice":req("who","txt","hint","then","skip")
    if k=="game":
        req("k","hint","then","skip")
        if d.get("k") not in GAMES:E.append(f"{where}: game k must be one of {sorted(GAMES)}")
    if k=="call":
        req("cid","lines","hint","then","skip")
        if len(d.get("lines",[]))<4:E.append(f"{where}: call needs ≥4 lines")
        for j,x in enumerate(d.get("lines",[])):
            if not(isinstance(x,list) and len(x)==2 and x[0] in cast):E.append(f"{where} call line {j}: [speaker,text]")
    lines(d.get("then",[]),where+".then")
    return 1+len(d.get("then",[]))+(len(d.get("lines",[])) if k=="call" else 0)
CLIPS={"crimson":[0,1,2,4,5,6]}.get(wid,[0,1,2,3,4,5,6])
ch=pack["chapters"][n-1];res={}
for lang in("en","zh"):
    L=d["beats"][lang];played=0;kinds={}
    for i,b in enumerate(L):
        if isinstance(b,list) and len(b)==3 and b[1] in STOPS:kinds[b[1]]=kinds.get(b[1],0)+1;played+=stop_ok(b,f"beats.{lang}[{i}]")
        else:beat_ok(b,f"beats.{lang}[{i}]",False);played+=1
    res[lang]=(round(played),kinds)
    if played<100:E.append(f"{lang}: only ~{round(played)} played lines in the opening (need ≥100)")
    if kinds.get("line",0)<10:E.append(f"{lang}: {kinds.get('line',0)} 'line' stops (need ≥10)")
    for k in("gift","game","photo","video","voice","call"):
        if not kinds.get(k):E.append(f"{lang}: no '{k}' stop in the opening")
    for c in ch["choices"]:
        T=d.get("then",{}).get(c["k"],{}).get(lang)
        if T is None:E.append(f"then.{c['k']}.{lang} missing");continue
        p=0
        for i,b in enumerate(T):
            if isinstance(b,list) and len(b)==3 and b[1] in STOPS:p+=stop_ok(b,f"then.{c['k']}.{lang}[{i}]")
            else:beat_ok(b,f"then.{c['k']}.{lang}[{i}]");p+=1
        if p<12:E.append(f"then.{c['k']}.{lang}: only {round(p)} lines (need ≥12)")
sig=lambda L:[b[1] if b[1] in STOPS else "b" for b in L]
if sig(d["beats"]["en"])!=sig(d["beats"]["zh"]):E.append("en and zh openings must have the same beat/stop sequence")
print("played lines / stops:",res)
print("\n".join(E[:60]) if E else "OK ✓");sys.exit(1 if E else 0)
