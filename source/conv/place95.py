import json, os, subprocess, sys
U='/root/.claude/uploads/be5c97bb-7ac4-528f-825e-7b15fb67169f/'
ART='v2/deploy/art/official/'
P=json.load(open('conv/assetplan.json'))
W={'office':'w_scmvgzd4lafc1f500336','tsuns':'w_scmvgzd2sneff0fa38ae'}
def put(st, fid, name, w):
    d=ART+W[st]; os.makedirs(d,exist_ok=True)
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',U+fid+'-image.jpg','-vf','scale=%d:-2'%w,'-q:v','4',d+'/'+name],check=True)
    return 'art/official/%s/%s'%(W[st],name)
J={st:json.load(open(ART+W[st]+'.json')) for st in W}
# ---- office
bgs={'o08':'403a7bfa','o01':'348b98a0','o02':'c6081486','o03':'10a9d1ec','o04':'22bb8f23','o05':'460c662c','o06':'e7c71934','o07':'f89a5427',
     'o09':'324ee575','o10':'c14c3d5c','o11':'9bacf27c','o12':'89057865','o13':'e2c194be','o14':'525c9c6a','o15':'563caf91','o16':'647cb6bc'}
A=['052a0c83','3bb15206','e32269e5','d3241d18','e9b7ff42','42976389','b9b3be1c','e96cc935','e8ff1708','8b6ca114','c082faa6','94c6fe14','1d612436','c1032ea9','1a78aabe','b207da3f']
cg=[A[0],A[1],A[3],A[2]]+A[4:]+['4035c9b2','c75ee56f']
chars={'丹娜':'6e45811d','埃文':'44110f3c','哈珀':'a5bb7529','梅森':'413ebc79','马特奥':'f497aafe'}
def do(st,bgs,cgs,chars,cover):
    j=J[st]; url={c:put(st,f,c+'.jpg',1080) for c,f in bgs.items()}
    for slot,c in P[st].items():
        if c in url: j[slot]=url[c]
    for slot,f in cgs.items(): j[slot]=put(st,f,slot+'.jpg',1080)
    for n,f in chars.items(): j['char_'+n]=put(st,f,'char_%s.jpg'%f[:6],600)
    j['cover']=put(st,cover,'cover.jpg',900)
    json.dump(j,open(ART+W[st]+'.json','w'),ensure_ascii=False)
    print(st,len(j),'bg slots',sum(1 for k in j if k.startswith('bg_')),'/',len(P[st]))
do('office',bgs,{'cg_ch%02d'%(i+1):f for i,f in enumerate(cg)},chars,'2af94b7d')
# ---- tsuns
tb={'t01':'c33376e6','t02':'cb243aa0','t03':'8f2ddd52','t04':'e6a2ebc4','t05':'1ae14a4d','t06':'d01b7830','t07':'987a8a2f','t08':'b133b8c7','t09':'c7ae8591','t10':'dd69e90d',
    't11':'ca0b95fd','t12':'6d422aa2','t13':'128a8720','t14':'f5ead2c5','t15':'6daf5b72','t16':'01fb5483','t17':'a59fd384','t18':'77d4bb49','t19':'967fe814','t20':'298482eb'}
tc={'cg_ch01_04':'f8864161','cg_ch02_03':'af03add5','cg_ch03_02':'b57ba003','cg_ch04_04':'65dee5d5','cg_ch05_05':'308872fe','cg_ch06_04':'c8c82f87','cg_ch07_07':'2d28c946',
    'cg_ch08_07':'208edc67','cg_ch09_10':'9e9a6def','cg_ch10_03':'bd03aea8','cg_ch11_10':'329584ae','cg_ch12_06':'a7bdbafe','cg_ch12_07':'3d00e8e1','cg_ch12_08':'8c6300d9'}
tch={'方叙':'6764f00a','陆识野':'82d76111','林小满':'f7b2fb57','老周':'876d68ba'}
do('tsuns',tb,tc,tch,'aa1a6a30')
