#!/usr/bin/env python3
"""python3 content/deep/validate2.py afterhours 1 <scene>  — checks content/deep/afterhours_ch1_s<scene>.json against STORY2_SPEC.md"""
import json,sys,glob,os,re
H=os.path.dirname(os.path.abspath(__file__));wid,chn,sn="afterhours",1,int(sys.argv[1])
pack=[json.load(open(f)) for f in glob.glob(H+"/../out/s*.json") if json.load(open(f))["wid"]==wid][0]
cast={c["id"] for c in pack["cast"]};POV="nico"
d=json.load(open(f"{H}/{wid}_ch{chn}_v4_s{sn}.json"));E=[];W=[]
STOPS={"line","gift","photo","video","game","call","voice","feature","missed","reveal"};GIFTS={"coffee","flower","hoodie","letter","ring"}
NEED={1:{"feature:snap","event"},2:{"gift","feature:heart","photo","event"},3:{"feature:bottle","voice","photo","event"}}[sn]
def beat(b,where,inline=False):
    """returns (played_lines, kinds_found)"""
    if not(isinstance(b,list) and len(b)==3):E.append(f"{where}: bad beat {str(b)[:80]}");return 0,[]
    w,k,x=b
    if w=="sys":
        if k=="scene":
            if not isinstance(x,dict) or not x.get("img") or not x.get("place"):E.append(f"{where}: scene needs img+place")
            return 1,[]
        if k=="if":
            c=x.get("cond");
            if not c:E.append(f"{where}: if needs cond")
            a=lines(x.get("then",[]),where+".then");b2=lines(x.get("else",[]),where+".else")
            return (a[0]+b2[0])/2,a[1]+b2[1]
        if k in("set","bg","mono","rd","fx","bgm"):return 0,[]
        if k=="event":
            if not isinstance(x,dict) or not x.get("title"):E.append(f"{where}: event needs title")
            return 1,["event"]
        if k=="recall":
            if not isinstance(x,dict) or x.get("who") not in cast or not isinstance(x.get("txt"),str) or not x["txt"].strip():E.append(f"{where}: recall needs who (cast id) + txt")
            return 1,["recall"]
        E.append(f"{where}: unknown sys {k}");return 0,[]
    if k=="lock":return 0,[]
    if k in STOPS:return stop(b,where)
    if w!="n" and w not in cast:E.append(f"{where}: unknown speaker {w}")
    if w==POV and not inline:E.append(f"{where}: scripted Nico beat — Nico only speaks through 'line' stops (use narration: 'Nico…'): {str(x)[:40]}")
    if w=="n" and k!="act":E.append(f"{where}: narrator must be 'act'")
    if k not in("say","act","think"):E.append(f"{where}: bad kind {k}")
    if not isinstance(x,str) or not x.strip():E.append(f"{where}: empty text");return 1,[]
    if ".zh" in where or "zh" in where.split(".")[0]:
        if k=="act" and w!="n" and x.startswith("我"):E.append(f"{where}: actions are third person — don't start with 我: {x[:30]}")
        if w=="n" and len(x)>90:E.append(f"{where}: narration too long ({len(x)} chars, max 90): {x[:30]}…")
    return 1,[]
def lines(L,where,inline=True):
    p=0;ks=[]
    for i,b in enumerate(L):a,k=beat(b,f"{where}[{i}]",inline);p+=a;ks+=k
    return p,ks
def stop(b,where):
    w,k,d=b
    if not isinstance(d,dict):E.append(f"{where}: stop data must be an object");return 0,[]
    def req(*ks):
        for x in ks:
            if x not in d:E.append(f"{where} {k}: missing '{x}'")
    if k=="line":
        if w!=POV:E.append(f"{where}: line stop speaker must be nico")
        req("hint","opts");o=d.get("opts",[])
        if not 2<=len(o)<=3:E.append(f"{where}: line needs 2-3 opts")
        tot=0
        for j,x in enumerate(o):
            if x.get("k") not in("say","act","think") or not x.get("t"):E.append(f"{where} opt{j}: needs k + t")
            tot+=lines(x.get("then",[]),f"{where} opt{j}.then")[0]
        return 1+tot/max(1,len(o)),["line"]
    if k=="gift":
        req("who","hint","then","skip");by=d.get("by",{})
        if set(by)!=GIFTS:E.append(f"{where}: gift 'by' must react to all of {sorted(GIFTS)}")
        return 1+sum(lines(L,f"{where}.by.{g}")[0] for g,L in by.items())/5,["gift"]
    if k=="photo":req("cap","prompt","then","skip")
    if k=="feature":
        req("k","cid","hint","win","lose","skip")
        if d.get("k")=="snap" and (len(d.get("frames",[]))!=4 or d.get("with")!="nico"):E.append(f"{where}: snap needs with=nico and 4 frames")
        if d.get("k") not in("snap","quiz","lie","heart","bottle"):E.append(f"{where}: feature k must be snap/quiz/lie/heart/bottle")
        a=lines(d.get("win",[]),where+".win")[0];b2=lines(d.get("lose",[]),where+".lose")[0]
        return 1+(a+b2)/2,["feature:"+str(d.get("k"))]
    if k=="game":
        req("k","hint","then","skip","pair")
        if d.get("k") not in("remember","order"):E.append(f"{where}: game k must be remember or order")
    if k=="missed":
        req("cid","hint","lines","then","skip")
        if d.get("cid") not in cast:E.append(f"{where}: missed cid must be a cast id")
        ml=d.get("lines",[])
        if not 3<=len(ml)<=10:E.append(f"{where}: missed needs 3-10 lines")
        for j,x in enumerate(ml):
            if not(isinstance(x,list) and len(x)==2 and x[0] in cast and isinstance(x[1],str) and x[1].strip()):E.append(f"{where} missed line {j}: [speakerId,text]")
        lines(d.get("skip",[]),where+".skip")
        return 1+len(ml)+lines(d.get("then",[]),where+".then")[0],["missed"]
    if k=="reveal":
        req("img","lines")
        if w!=POV:E.append(f"{where}: reveal speaker must be {POV}")
        for im in("img","img2"):
            if im in d and not str(d[im]).startswith("afterhours/"):E.append(f"{where}: reveal {im} must be afterhours/…")
        rl=d.get("lines",[])
        if not 4<=len(rl)<=10:E.append(f"{where}: reveal needs 4-10 lines")
        for j,x in enumerate(rl):
            if not isinstance(x,str) or not x.strip():E.append(f"{where} reveal line {j}: empty")
            elif ".zh" in where and len(x)>60:E.append(f"{where} reveal line {j}: too long ({len(x)} chars, max 60): {x[:30]}…")
        return len(rl),["reveal"]
    if k=="voice":req("who","txt","hint","then","skip")
    if k=="call":
        req("cid","lines","hint","then","skip")
        if not 4<=len(d.get("lines",[]))<=10:E.append(f"{where}: call needs 4-10 lines")
        for j,x in enumerate(d.get("lines",[])):
            if not(isinstance(x,list) and len(x)==2 and x[0] in cast):E.append(f"{where} call line {j}: [speakerId,text]")
    t=lines(d.get("then",[]),where+".then")[0]
    return 1+t+(len(d.get("lines",[])) if k=="call" else 0),[k]
res={}
for lang in("zh","en"):
    L=d["beats"][lang]
    if not(L and L[0][0]=="sys" and L[0][1]=="scene"):E.append(f"{lang}: first beat must be the scene directive")
    p,ks=lines(L,f"beats.{lang}",inline=False);res[lang]=(round(p),{k:ks.count(k) for k in set(ks)})
    if p<50 or p>100:E.append(f"{lang}: ~{round(p)} played lines (need 50–100)")
    if ks.count("line")<4:E.append(f"{lang}: {ks.count('line')} 'line' stops (need ≥4)")
    for k in NEED:
        if k not in ks:E.append(f"{lang}: scene {sn} needs a '{k}' stop")
if sn==3:
    for c in("A","B","C"):
        for lang in("zh","en"):
            T=d.get("then",{}).get(c,{}).get(lang)
            if T is None:E.append(f"then.{c}.{lang} missing");continue
            p,ks=lines(T,f"then.{c}.{lang}")
            if p<15:E.append(f"then.{c}.{lang}: only {round(p)} lines (need ≥15)")
            if not ks:E.append(f"then.{c}.{lang}: needs at least one stop")
sig=lambda L:[(b[0] if b[0]=="sys" else "")+(b[1] if b[1] in STOPS or b[0]=="sys" else "b") for b in L]
if sig(d["beats"]["zh"])!=sig(d["beats"]["en"]):E.append("zh and en must have the same beat/stop sequence")
print("played lines / stops:",res)
print("\n".join(E[:60]) if E else "OK ✓");sys.exit(1 if E else 0)
