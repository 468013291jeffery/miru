# 2026-11-25 把 Xsolla 的两段代码（Webhook + xs_create）补进服务器覆盖版 wallet.js。用法：curl -s <raw> | sudo python3 -
import urllib.request as u, shutil, subprocess, sys
P = '/opt/miru/shared/overrides/api/wallet.js'
s = u.urlopen('https://raw.githubusercontent.com/468013291jeffery/miru/b10c43ed4437643a3dff92d085bc6593038bef7a/api/wallet.js').read().decode()
A = " const u=await L.needActive(req,res);if(!u)return;"
B = " if(b.op==='purchase'){"
i1 = s.index(" if(req.query&&req.query.r==='xsolla')"); b1 = s[s.rindex(' /* 2026-11-25', 0, i1):s.index(A)]
i2 = s.index(" if(b.op==='xs_create')"); b2 = s[s.rindex(' /* 2026-11-25', 0, i2):s.index(B)]
o = open(P).read()
if 'xs_create' in o: print('already patched'); sys.exit(0)
assert o.count(A) == 1 and o.count(B) == 1
shutil.copy(P, '/var/tmp/wallet.override.bak-1125b')
o = o.replace(A, b1 + A).replace(B, b2 + B)
open('/var/tmp/w4xs.js', 'w').write(o)
subprocess.check_call(['node', '--check', '/var/tmp/w4xs.js'])
shutil.copy('/var/tmp/w4xs.js', P)
print('patched', len(b1), len(b2), open(P).read().count('xs_create'))
