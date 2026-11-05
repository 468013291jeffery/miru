#!/usr/bin/env bash
# MIRU · 语音密钥自检（只读，不显示密钥本身）：sudo bash ops/tts-check.sh
ENVF=/opt/miru/shared/production.env
echo "env file changed: $(date -r "$ENVF" '+%F %T')"
echo "miru started:     $(systemctl show -p ActiveEnterTimestamp --value miru)"
for v in DASHSCOPE_API_KEY DASHSCOPE_INTL_API_KEY QWEN_API_KEY DASHSCOPE_BASE_URL; do
  n=$(grep -c "^$v=" "$ENVF")
  val=$(grep "^$v=" "$ENVF" | tail -1 | cut -d= -f2- | tr -d '"'"'"' \r')
  [ "$n" = 0 ] && { echo "$v: (none)"; continue; }
  if [ "$v" = DASHSCOPE_BASE_URL ]; then echo "$v: $val"; continue; fi
  echo "$v: lines=$n len=${#val} starts=${val:0:3} spaces=$(grep "^$v=" "$ENVF" | tail -1 | grep -c ' ')"
  for host in dashscope.aliyuncs.com dashscope-intl.aliyuncs.com dashscope-us.aliyuncs.com; do
    code=$(curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $val" "https://$host/compatible-mode/v1/models")
    echo "   $host -> $code"
  done
done
echo "live api: $(curl -s 'http://127.0.0.1:3000/api/tts?ping=qwen' | head -c 200)"
