#!/usr/bin/env bash
# Single deployment entry point. Serialize, reject production drift, build from source.
set -euo pipefail
APP=${MIRU_DEPLOY_APP:-/opt/miru}
REPO=468013291jeffery/miru
REF=main
EXPECTED= TREE= ARCHIVE= REVISION=
ADOPT=0 CHECK_ONLY=0
while [ "$#" -gt 0 ]; do
  case "$1" in
    --ref) REF=$2; shift 2;;
    --expected-current) EXPECTED=$2; shift 2;;
    --expected-tree) TREE=$2; shift 2;;
    --archive) ARCHIVE=$2; shift 2;;
    --revision) REVISION=$2; shift 2;;
    --adopt-current) ADOPT=1; shift;;
    --check-only) CHECK_ONLY=1; shift;;
    *) echo "Unknown deployment option: $1" >&2; exit 64;;
  esac
done
mkdir -p "$APP/shared" "$APP/releases"
exec 9>"$APP/shared/deploy.lock"
flock -n 9 || { echo 'Another deployment is running; retry after it finishes.' >&2; exit 75; }
CUR=$(readlink -f "$APP/current")
case "$CUR" in "$APP"/releases/*) ;; *) echo 'Unexpected current release path' >&2; exit 65;; esac
[ -z "$EXPECTED" ] || [ "$CUR" = "$EXPECTED" ] || { echo 'Production advanced since this work started; merge again.' >&2; exit 73; }
HELPER=$(dirname "$(readlink -f "$0")")/deploy-state.py
if [ -n "$TREE" ]; then python3 "$HELPER" verify "$CUR" "$TREE"; fi
if [ -f "$CUR/.miru-files.json" ]; then
  python3 "$HELPER" verify "$CUR" "$CUR/.miru-files.json"
elif [ "$ADOPT" != 1 ]; then
  echo 'Untracked production baseline. Reconcile changes, then explicitly use --adopt-current.' >&2; exit 73
fi
[ "$CHECK_ONLY" != 1 ] || { echo 'Deployment preflight passed.'; exit 0; }
BASELINE=$(mktemp "$APP/shared/.baseline.XXXXXX")
python3 "$HELPER" snapshot "$CUR" > "$BASELINE"
NEW=$(mktemp -d "$APP/releases/.staging.XXXXXX")
cleanup() { rm -f "$BASELINE"; }
trap cleanup EXIT
if [ -n "$ARCHIVE" ]; then
  [ -n "$REVISION" ] || { echo '--archive requires --revision' >&2; exit 64; }
  SHA=$REVISION
  tar -xzf "$ARCHIVE" -C "$NEW"
else
  SHA=$(curl -fsSL "https://api.github.com/repos/$REPO/commits/$REF" | python3 -c 'import sys,json;print(json.load(sys.stdin)["sha"])')
  curl -fsSL "https://codeload.github.com/$REPO/tar.gz/$SHA" | tar -xz -C "$NEW" --strip-components=1
fi
[[ "$SHA" =~ ^[0-9a-f]{40}$ ]] || { echo 'Deployment revision must be a full commit SHA.' >&2; exit 65; }
test -f "$NEW/tools/release-contract.mjs"
PREVIOUS_REV=$(python3 - "$CUR" <<'PY'
import pathlib,json,sys,re
p=pathlib.Path(sys.argv[1]);m=p/'.miru-release.json'
print(json.loads(m.read_text())['revision'] if m.exists() else (p.name if re.fullmatch('[0-9a-f]{7,40}',p.name) else ''))
PY
)
if [ -n "$PREVIOUS_REV" ] && [ "$PREVIOUS_REV" != "$SHA" ]; then
  relation=$(curl -fsSL "https://api.github.com/repos/$REPO/compare/$PREVIOUS_REV...$SHA" | python3 -c 'import json,sys;print(json.load(sys.stdin)["status"])')
  case "$relation" in ahead|identical) ;; *) echo 'Target does not include the current production commit; merge before deployment.' >&2; exit 73;; esac
fi
FINAL="$APP/releases/${SHA:0:12}-$(date -u +%Y%m%dT%H%M%S)"
[ ! -e "$FINAL" ] || { echo 'Release path already exists.' >&2; exit 73; }
mv "$NEW" "$FINAL"; NEW=$FINAL
# Save pristine repository hashes before applying explicit server adapters.
python3 - "$NEW" "$CUR" <<'PY'
import pathlib,hashlib,json,sys
new,old=map(pathlib.Path,sys.argv[1:]);ov=new.parent.parent/'shared/overrides'
prior=json.loads((old/'.miru-release.json').read_text()).get('override_repository_hashes',{}) if (old/'.miru-release.json').exists() else {}
hashes={}
if ov.exists():
 for p in ov.rglob('*'):
  if not p.is_file():continue
  rel=p.relative_to(ov);target=new/rel
  digest=hashlib.sha256(target.read_bytes()).hexdigest() if target.exists() else None
  if str(rel) in prior and digest!=prior[str(rel)]:raise SystemExit('Repository changed a server-adapter file; merge manually before deployment: '+str(rel))
  hashes[str(rel)]=digest
(new/'.miru-overrides.json').write_text(json.dumps(hashes))
PY
if [ -d "$APP/shared/overrides" ]; then cp -a "$APP/shared/overrides/." "$NEW/"; fi
mkdir -p "$NEW/deploy"
for f in "$CUR"/deploy/*; do [ ! -f "$f" ] || [ -e "$NEW/deploy/$(basename "$f")" ] || cp -a "$f" "$NEW/deploy/"; done
# Media added outside Git is retained. Conflicting edits to an existing release are rejected above.
for d in art audio video scripts; do
  if [ -d "$CUR/$d" ]; then mkdir -p "$NEW/$d"; cp -an "$CUR/$d/." "$NEW/$d/"; fi
done
if [ -d "$CUR/node_modules" ] && cmp -s "$CUR/package.json" "$NEW/package.json"; then cp -a "$CUR/node_modules" "$NEW/";
else (cd "$NEW" && npm install --omit=dev --no-audit --no-fund); fi
(cd "$NEW" && python3 source/build.py && node --check source/all.js && node tools/release-contract.mjs && node tools/catalog-selftest.cjs && node tools/role-list-selftest.cjs && python3 tools/deploy-guard-selftest.py)
P="$NEW/public"; mkdir -p "$P"
for f in index.html admin.html export.html privacy.html terms.html delete-account.html ads.txt config.js tune.js miru_rules.js miru_dialogue_runtime.js pdfjs_embed.js manifest.webmanifest sw.js; do
  [ ! -f "$NEW/$f" ] || cp -a "$NEW/$f" "$P/"
done
for d in art audio video scripts icons; do [ ! -d "$NEW/$d" ] || ln -s "$NEW/$d" "$P/$d"; done
[ ! -d "$NEW/.well-known" ] || cp -a "$NEW/.well-known" "$P/"
python3 - "$NEW" "$SHA" <<'PY'
import pathlib,json,sys,datetime
r=pathlib.Path(sys.argv[1]);p=r/'.miru-overrides.json'
(r/'.miru-release.json').write_text(json.dumps({'revision':sys.argv[2],'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'override_repository_hashes':json.loads(p.read_text())},indent=2));p.unlink()
PY
chown -R debian:www-data "$NEW"; chmod -R g+rX,o-rwx "$NEW"
python3 "$HELPER" snapshot "$NEW" > "$NEW/.miru-files.json"
chown debian:www-data "$NEW/.miru-files.json"; chmod 640 "$NEW/.miru-files.json"
# Check both the symlink and its content immediately before the atomic switch.
[ "$(readlink -f "$APP/current")" = "$CUR" ] || { echo 'Production changed during staging; aborting.' >&2; exit 73; }
python3 "$HELPER" verify "$CUR" "$BASELINE"
ln -sfn "$NEW" "$APP/current.next"; mv -Tf "$APP/current.next" "$APP/current"
systemctl restart miru
ok=0
for i in {1..10}; do
  if curl -fsS 'http://127.0.0.1:3000/api/works?feed=new&limit=1' >/dev/null; then ok=1; break; fi
  sleep 2
done
if [ "$ok" != 1 ]; then
  ln -sfn "$CUR" "$APP/current.next"; mv -Tf "$APP/current.next" "$APP/current"; systemctl restart miru
  echo 'Health check failed; previous release restored.' >&2; exit 1
fi
echo "DEPLOYED revision=$SHA previous=$CUR current=$NEW"
# Keep previous releases for recovery; cleanup is a separate reviewed operation.
