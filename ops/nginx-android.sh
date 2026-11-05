#!/usr/bin/env bash
# MIRU · nginx 补丁（一次性）：放行 /.well-known/（安卓 App 验证域名用的 assetlinks.json），manifest / sw.js 用正确的类型。
# 用法：sudo bash ops/nginx-android.sh     改之前会备份到 /opt/miru/shared/nginx-before-android.conf，nginx -t 不通过就自动还原。
set -euo pipefail
APP=/opt/miru
# nginx：放行 /.well-known/（安卓 assetlinks），manifest 用正确的类型
CONF=/etc/nginx/conf.d/miru-production.conf
if [ -f "$CONF" ] && ! grep -q 'miru-android' "$CONF"; then
  cp "$CONF" "$APP/shared/nginx-before-android.conf"
  python3 - "$CONF" <<'PY'
import sys,re
p=sys.argv[1]; s=open(p).read()
block = ("    # miru-android\n"
       "    location ^~ /.well-known/ { default_type application/json; add_header Cache-Control \"no-cache\"; try_files $uri =404; }\n"
       "    location = /manifest.webmanifest { default_type application/manifest+json; add_header Cache-Control \"no-cache\"; try_files $uri =404; }\n"
       "    location = /sw.js { add_header Cache-Control \"no-cache\"; add_header Service-Worker-Allowed \"/\"; try_files $uri =404; }\n")
i = s.find("location ~ /\\.")
if i < 0: i = s.rfind("location / {")
s = s[:i] + block.lstrip() + "    " + s[i:]
open(p,"w").write(s)
PY
  if nginx -t; then systemctl reload nginx; echo "nginx patched"; else cp "$APP/shared/nginx-before-android.conf" "$CONF"; echo "nginx patch failed, restored"; fi
fi
curl -s -o /dev/null -w 'assetlinks: %{http_code}\n' -H 'Host: www.miru.plus' -k https://127.0.0.1/.well-known/assetlinks.json || true
