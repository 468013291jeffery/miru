#!/usr/bin/env bash
# MIRU · 服务器自检（只读）：sudo bash ops/diag.sh
APP=/opt/miru
echo "current -> $(readlink -f $APP/current)"
ls -1t $APP/releases | head -5
for u in "/api/works?feed=new&limit=1" "/api/works" "/api/auth" "/api/wallet"; do
  printf '%-32s %s\n' "$u" "$(curl -s -o /tmp/diag.body -w '%{http_code}' "http://127.0.0.1:3000$u")  $(head -c 160 /tmp/diag.body | tr '\n' ' ')"
done
systemctl is-active miru
journalctl -u miru -n 25 --no-pager -o cat | cut -c1-200
tail -n 8 /var/log/miru-deploy.log 2>/dev/null
