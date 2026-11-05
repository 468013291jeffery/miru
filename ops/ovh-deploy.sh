#!/usr/bin/env bash
# MIRU · OVH 部署脚本（2026-11-05）
# 用法（在服务器上，用 sudo）：  sudo bash ops/ovh-deploy.sh            # 部署 GitHub main 最新版
#                                sudo bash ops/ovh-deploy.sh --install  # 第一次：另外装好「每 5 分钟自动部署」和 nginx 补丁
# 做的事：
#   1 · 下载 GitHub main 的代码 → /opt/miru/releases/<sha>
#   2 · 沿用当前版本里服务器专属的 deploy/（server.cjs）和 node_modules
#   3 · 生成 public/（nginx 的网站根目录）：静态页面 + 安卓需要的 .well-known / manifest / sw.js / icons / delete-account.html
#   4 · 切换 /opt/miru/current，重启 miru 服务，自检失败自动回滚
#   5 · 只保留最近 5 个版本
# 已经是最新就什么都不做，所以可以放进定时器反复跑。
set -euo pipefail
REPO="468013291jeffery/miru"
APP=/opt/miru
LOG=/var/log/miru-deploy.log
exec > >(tee -a "$LOG") 2>&1
echo "== $(date -Is) deploy start"

install_extras() {
  # 定时器：每 5 分钟检查一次 GitHub
  install -m 0755 "$0" /usr/local/sbin/miru-deploy
  cat > /etc/systemd/system/miru-deploy.service <<'EOF'
[Unit]
Description=MIRU auto deploy from GitHub main
After=network-online.target
[Service]
Type=oneshot
ExecStart=/usr/local/sbin/miru-deploy
EOF
  cat > /etc/systemd/system/miru-deploy.timer <<'EOF'
[Unit]
Description=MIRU auto deploy every 5 minutes
[Timer]
OnBootSec=2min
OnUnitActiveSec=5min
[Install]
WantedBy=timers.target
EOF
  systemctl daemon-reload
  systemctl enable --now miru-deploy.timer
  # nginx：放行 /.well-known/（安卓 assetlinks），manifest 用正确的类型
  local CONF=/etc/nginx/conf.d/miru-production.conf
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
  # 环境变量：安卓包名
  local ENVF=$APP/shared/production.env
  grep -q '^PLAY_PACKAGE=' "$ENVF" || echo 'PLAY_PACKAGE=com.miru.plus.app' >> "$ENVF"
}

[ "${1:-}" = "--install" ] && install_extras

SHA=$(curl -fsSL "https://api.github.com/repos/$REPO/commits/main" | python3 -c 'import sys,json;print(json.load(sys.stdin)["sha"][:7])')
CUR=$(readlink -f "$APP/current")
NEW="$APP/releases/$SHA"
if [ "$(basename "$CUR")" = "$SHA" ]; then echo "already at $SHA"; exit 0; fi

TMP=$(mktemp -d)
curl -fsSL "https://codeload.github.com/$REPO/tar.gz/$SHA" | tar xz -C "$TMP" --strip-components=1
rm -rf "$NEW"; mv "$TMP" "$NEW"

# 服务器专属文件沿用当前版本
mkdir -p "$NEW/deploy"
for f in "$CUR"/deploy/*; do [ -e "$NEW/deploy/$(basename "$f")" ] || cp -a "$f" "$NEW/deploy/"; done
if [ -d "$CUR/node_modules" ] && cmp -s "$CUR/package.json" "$NEW/package.json"; then cp -a "$CUR/node_modules" "$NEW/";
else (cd "$NEW" && npm install --omit=dev --no-audit --no-fund); fi

# public/：nginx 网站根目录
P="$NEW/public"; rm -rf "$P"; mkdir -p "$P"
for f in index.html admin.html export.html privacy.html terms.html delete-account.html ads.txt config.js tune.js \
         miru_rules.js miru_dialogue_runtime.js pdfjs_embed.js manifest.webmanifest sw.js; do
  [ -f "$NEW/$f" ] && cp -a "$NEW/$f" "$P/"
done
for d in art audio video scripts icons; do [ -d "$NEW/$d" ] && ln -s "$NEW/$d" "$P/$d"; done
[ -d "$NEW/.well-known" ] && cp -a "$NEW/.well-known" "$P/"
for f in "$CUR"/public/*; do b=$(basename "$f"); [ -e "$P/$b" ] || [ -L "$P/$b" ] || [ ! -f "$NEW/$b" ] || cp -a "$NEW/$b" "$P/"; done

chown -R debian:www-data "$NEW"; chmod -R g+rX,o-rwx "$NEW"

# 切换 + 自检（失败回滚）
ln -sfn "$NEW" "$APP/current.next"; mv -Tf "$APP/current.next" "$APP/current"
systemctl restart miru
ok=0
for i in 1 2 3 4 5 6 7 8 9 10; do
  sleep 2
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:3000/api/works?feed=new&limit=1" || true)
  case "$code" in ""|000|5??) ;; *) ok=1; break;; esac
done
if [ "$ok" != 1 ]; then
  echo "!! health check failed ($code), rolling back to $CUR"
  ln -sfn "$CUR" "$APP/current.next"; mv -Tf "$APP/current.next" "$APP/current"; systemctl restart miru
  exit 1
fi
echo "== deployed $SHA (api $code)"

# 只留最近 5 个版本（不删当前和上一个）
ls -1dt "$APP"/releases/*/ | tail -n +6 | while read -r d; do
  d=${d%/}; [ "$d" = "$NEW" ] || [ "$d" = "$CUR" ] || rm -rf "$d"; done
