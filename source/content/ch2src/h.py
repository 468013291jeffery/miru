import json
P="adrianv|roman"
def N(t): return ["n","act",t]
def R(t): return ["roman","say",t]
def RA(t): return ["roman","act",t]
def A(t): return ["adrianv","say",t]
def AA(t): return ["adrianv","act",t]
def AT(t): return ["adrianv","think",t]
def SI(t): return ["sienna","say",t]
def SIA(t): return ["sienna","act",t]
def scene(img,place,time): return ["sys","scene",{"img":img,"place":place,"time":time}]
def bg(img): return ["sys","bg",{"img":img}]
def fx(k): return ["sys","fx",{"k":k}]
def bgm(m): return ["sys","bgm",{"m":m}]
def ev(icon,title,txt): return ["sys","event",{"icon":icon,"title":title,"txt":txt}]
def rd(d,why,p=P): return ["sys","rd",{"p":p,"d":d,"why":why}]
def mono(t): return ["sys","mono",{"t":[["roman",t]]}]
def recall(t,who="roman"): return ["sys","recall",{"who":who,"txt":t}]
def setf(f): return ["sys","set",{"flag":f}]
def iff(cond,then,els=None):
    d={"cond":cond,"then":then}
    if els is not None: d["else"]=els
    return ["sys","if",d]
def flag(f): return {"flag":f}
def opt(k,t,then,rdv,att,rthink,love=1,setf=None,rwho="roman"):
    o={"k":k,"t":t,"then":then,"love":love,"rd":{P:rdv},"att":att,"rthink":rthink,"rwho":rwho}
    if setf: o["set"]=setf
    return o
def line(hint,opts,who="adrianv"): return [who,"line",{"hint":hint,"opts":opts}]
def save(name,beats): json.dump({"beats":{"zh":beats}},open(name,"w"),ensure_ascii=False,indent=1); print(name,len(beats))
