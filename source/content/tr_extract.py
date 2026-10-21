import json,sys,glob,os
def units(d):
    U=[]
    def walk(n,path):
        if isinstance(n,dict):
            if 'en' in n and 'zh' in n:
                e=n['en']
                if isinstance(e,str): U.append((path,None,e))
                elif isinstance(e,list):
                    for i,x in enumerate(e):
                        if isinstance(x,str): U.append((path,(i,),x))
                        elif isinstance(x,list): U.append((path,(i,2),x[2]))
                return
            for k,v in n.items():
                if k=='looks': continue
                walk(v,path+[k])
        elif isinstance(n,list):
            for i,v in enumerate(n): walk(v,path+[i])
    walk(d,[]);return U
def _main():
    tot=0
    for f in sorted(glob.glob('content/out/s*.json')):
        d=json.load(open(f));U=units(d);c=sum(len(u[2]) for u in U);tot+=c
        print(os.path.basename(f),len(U),c)
    print(tot)

def prep():
    for f in sorted(glob.glob('content/out/s*.json')):
        b=os.path.basename(f)[:-5];d=json.load(open(f))
        json.dump([u[2] for u in units(d)],open(f'content/tr/{b}.in.json','w'),ensure_ascii=False,indent=0)
def inject(langs=("ja","ko","es")):
    for f in sorted(glob.glob('content/out/s*.json')):
        b=os.path.basename(f)[:-5];d=json.load(open(f));U=units(d)
        for l in langs:
            tp=f'content/tr/{b}.{l}.json'
            if not os.path.exists(tp): continue
            T=json.load(open(tp))
            if len(T)!=len(U): print('MISMATCH',b,l,len(T),len(U)); continue
            for (path,idx,en),x in zip(U,T):
                n=d
                for k in path: n=n[k]
                if idx is None: n[l]=x
                elif len(idx)==1:
                    n.setdefault(l,list(n['en']))[idx[0]]=x
                else:
                    if l not in n: n[l]=[list(bt) for bt in n['en']]
                    n[l][idx[0]][2]=x
        json.dump(d,open(f.replace('/out/','/out_tr/'),'w'),ensure_ascii=False)

if __name__=="__main__":
    import sys
    {"prep":prep,"inject":inject,"stat":_main}[sys.argv[1]]()
