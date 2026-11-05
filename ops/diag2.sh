#!/usr/bin/env bash
# MIRU · 对比两个版本（只读）：sudo bash ops/diag2.sh <旧版本> <新版本>
R=/opt/miru/releases; A=${1:-20db0b7}; B=${2:-fa250fc}
echo "--- only in $A (depth 3, no media):"
diff <(cd $R/$A && find . -maxdepth 3 -not -path './art*' -not -path './audio*' -not -path './video*' -not -path './scripts*' -not -path './node_modules/*' | sort) \
     <(cd $R/$B && find . -maxdepth 3 -not -path './art*' -not -path './audio*' -not -path './video*' -not -path './scripts*' -not -path './node_modules/*' | sort) | grep '^<' | head -40
echo "--- symlinks in $A:"; find $R/$A -maxdepth 3 -type l -not -path '*/node_modules/*' -printf '%p -> %l\n' | head -20
echo "--- server.cjs:"; grep -v '^\s*$' $R/$A/deploy/server.cjs | cut -c1-180 | head -70
