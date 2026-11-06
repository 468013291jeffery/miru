#!/usr/bin/env bash
# Use the guarded deployment path; do not switch /opt/miru/current by hand.
set -euo pipefail
exec bash "$(dirname "$(readlink -f "$0")")/ovh-deploy-safe.sh" "$@"