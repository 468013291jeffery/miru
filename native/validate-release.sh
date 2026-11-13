#!/bin/sh
# Debug uses official test ads. Every Release build must have production identifiers.
set -eu
[ "${CONFIGURATION:-}" = Release ] || exit 0
fail() { echo "error: $1" >&2; exit 1; }
[ "${DEVELOPMENT_TEAM:-}" = H79A5X8935 ] || fail "Confirm the Apple development team."
[ "${PRODUCT_BUNDLE_IDENTIFIER:-}" = com.miru.plus.app ] || fail "Confirm the registered Bundle ID."
case "${MIRU_ADMOB_APP_ID:-}" in ca-app-pub-3940256099942544*|'') fail "Configure a production AdMob iOS App ID.";; ca-app-pub-*~*) ;; *) fail "Invalid AdMob App ID.";; esac
case "${MIRU_REWARDED_AD_UNIT_ID:-}" in ca-app-pub-3940256099942544*|'') fail "Configure a production rewarded ad unit.";; ca-app-pub-*/*) ;; *) fail "Invalid rewarded ad unit.";; esac
case "${MIRU_GOOGLE_IOS_CLIENT_ID:-}" in *.apps.googleusercontent.com) ;; *) fail "Configure the Google iOS OAuth client.";; esac
case "${MIRU_GOOGLE_SERVER_CLIENT_ID:-}" in *.apps.googleusercontent.com) ;; *) fail "Configure the Google server/web OAuth client.";; esac
case "${MIRU_GOOGLE_REVERSED_CLIENT_ID:-}" in com.googleusercontent.apps.*) ;; *) fail "Configure the reversed Google URL scheme.";; esac
