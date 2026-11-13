#!/usr/bin/env bash
# MIRU · nginx 补丁（一次性）：www.miru.plus 一律 301 到 https://miru.plus（Google 只认一个网址，AdSense / Search Console 需要）。
# 用法：sudo bash ops/nginx-www.sh   改之前备份到 /opt/miru/shared/nginx-before-www.conf，nginx -t 不通过就自动还原。
set -euo pipefail
APP=/opt/miru
CONF=${1:-/etc/nginx/conf.d/miru-production.conf}
[ -f "$CONF" ] || { echo "no $CONF"; ls /etc/nginx/conf.d /etc/nginx/sites-enabled 2>/dev/null; exit 1; }
if grep -q 'miru-www-redirect' "$CONF"; then echo "already patched"; else
  mkdir -p "$APP/shared"; cp "$CONF" "$APP/shared/nginx-before-www.conf"
  python3 - "$CONF" <<'PY'
import sys,re
p=sys.argv[1]; s=open(p).read()
out=[];i=0;n=0
# 找每个 server { ... } 块；只改带 443 / ssl 的、server_name 里有 miru.plus 的块
for m in re.finditer(r'server_name[^;]*;', s):
    pass
def blocks(s):
    res=[];j=0
    for m in re.finditer(r'\bserver\s*\{', s):
        st=m.start();k=m.end();d=1
        while d and k<len(s):
            c=s[k]
            if c=='{': d+=1
            elif c=='}': d-=1
            k+=1
        res.append((st,k))
    return res
new=s;off=0
for st,en in blocks(s):
    b=s[st:en]
    if 'miru.plus' not in b or not re.search(r'listen[^;]*443', b): continue
    m=re.search(r'server_name[^;]*;', b)
    if not m: continue
    ins='\n    # miru-www-redirect\n    if ($host = www.miru.plus) { return 301 https://miru.plus$request_uri; }'
    pos=st+m.end()+off
    new=new[:pos]+ins+new[pos:]; off+=len(ins); n+=1
open(p,'w').write(new)
print('patched server blocks:',n)
PY
  if nginx -t; then systemctl reload nginx; echo "nginx patched"; else cp "$APP/shared/nginx-before-www.conf" "$CONF"; nginx -t && systemctl reload nginx; echo "nginx patch failed, restored"; exit 1; fi
fi
for h in www.miru.plus miru.plus; do curl -s -o /dev/null -w "$h: %{http_code} %{redirect_url}\n" -k --resolve $h:443:127.0.0.1 https://$h/stories/ || true; done
