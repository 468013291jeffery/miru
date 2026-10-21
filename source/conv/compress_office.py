import re,sys
Z=open('office.md').read().split('\n');E=open('office.en.md').read().split('\n')
assert len(Z)==len(E)
oz,oe=[],[];i=0;scene_free=False;scene_fake=0;stats={'kept':0,'free':0,'say':0,'collapsed':0,'freedrop':0}
def parse(i):
    """block starting at '# CHOICE' -> (end index, q, options[(text_idx, body_idx_list)])"""
    j=i+1;opts=[]
    while not Z[j].startswith('# ·'):
        if Z[j].startswith('#### '): opts.append([j,[]])
        else: opts[-1][1].append(j)
        j+=1
    return j,opts
while i<len(Z):
    z,e=Z[i],E[i]
    if z.startswith('# SCENE') or z.startswith('# CHAPTER'): scene_free=False;scene_fake=0
    if z.startswith('# CHOICE｜'):
        q=z.split('｜',1)[1];end,opts=parse(i)
        ot=lambda L,k:L[opts[k][0]].split('｜',1)[1]
        bodies=[tuple(Z[x] for x in b) for _,b in opts]
        if '最后' in q:
            oz+=Z[i:end+1];oe+=E[i:end+1];stats['kept']+=1
        elif '可以直接打字说' in q:
            if not scene_free: oz+=Z[i:end+1];oe+=E[i:end+1];scene_free=True;stats['free']+=1
            else: stats['freedrop']+=1
        elif len(opts)==1:
            oz.append('旁白：你说：“%s”'%ot(Z,0).strip('“”'));oe.append('旁白：You: “%s”'%ot(E,0).strip('“”'))
            oz+=[Z[x] for x in opts[0][1]];oe+=[E[x] for x in opts[0][1]];stats['say']+=1
        elif len(set(bodies))>1 or scene_fake==0:
            oz+=Z[i:end+1];oe+=E[i:end+1];stats['kept']+=1
            if len(set(bodies))==1: scene_fake+=1
        else:
            oz.append('旁白：你决定：%s'%ot(Z,0));oe.append('旁白：You decide: %s'%ot(E,0))
            oz+=[Z[x] for x in opts[0][1]];oe+=[E[x] for x in opts[0][1]];stats['collapsed']+=1
        i=end+1;continue
    oz.append(z);oe.append(e);i+=1
open('office.c.md','w').write('\n'.join(oz));open('office.c.en.md','w').write('\n'.join(oe))
print(stats)
ch=0;per={}
for l in oz:
    if l.startswith('# CHAPTER'): ch+=1
    if l.startswith('# CHOICE'): per[ch]=per.get(ch,0)+1
print(per)
