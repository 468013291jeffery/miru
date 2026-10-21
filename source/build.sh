#!/usr/bin/env bash
# Thin wrapper kept for muscle memory.  The build itself is build.py — it does everything
# (content → rules → asset manifest → index.html) and writes straight to the repo root, so
# there are no symlinks to create and nothing to copy afterwards.
#   bash source/build.sh              # same as: python3 source/build.py
#   bash source/build.sh --split      # code + content as two files
set -e
cd "$(dirname "$0")"
python3 build.py "$@"
