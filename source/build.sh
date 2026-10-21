#!/usr/bin/env bash
# Build the app page from source/src/*.js and put it at the repo root (what Vercel serves).
# Run from anywhere:  bash source/build.sh
set -e
cd "$(dirname "$0")"
ROOT=..
mkdir -p deploy/api
ln -sfn "$ROOT/art" art            # build.py lists art/scenes, art/bgm, art/cut
python3 build.py
cp index.html "$ROOT/index.html"
cp deploy/miru_rules.js "$ROOT/miru_rules.js"
cp deploy/api/_rules.js "$ROOT/api/_rules.js"
rm -rf deploy all.js index.html art
echo "built → index.html"
