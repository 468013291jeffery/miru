#!/bin/sh
# First iOS release has no advertising. Validate only the services it ships.
set -eu
[ "${CONFIGURATION:-}" = Release ] || exit 0
fail() { echo "error: $1" >&2; exit 1; }
[ "${DEVELOPMENT_TEAM:-}" = H79A5X8935 ] || fail "Confirm the Apple development team."
[ "${PRODUCT_BUNDLE_IDENTIFIER:-}" = com.miru.plus.app ] || fail "Confirm the registered Bundle ID."
[ "${MIRU_ADS_DISABLED:-}" = YES ] || fail "This release must disable advertising."
case " ${SWIFT_ACTIVE_COMPILATION_CONDITIONS:-} ${OTHER_SWIFT_FLAGS:-} " in *MIRU_ADS*) fail "Advertising code must not be compiled in this release.";; esac
case "${MIRU_APP_APPLE_ID:-}" in ''|0*|*[!0-9]*) fail "Configure the numeric App Store Apple ID.";; esac
case "${MIRU_GOOGLE_IOS_CLIENT_ID:-}" in *.apps.googleusercontent.com) ;; *) fail "Configure the Google iOS OAuth client.";; esac
case "${MIRU_GOOGLE_SERVER_CLIENT_ID:-}" in *.apps.googleusercontent.com) ;; *) fail "Configure the Google server/web OAuth client.";; esac
case "${MIRU_GOOGLE_REVERSED_CLIENT_ID:-}" in com.googleusercontent.apps.*) ;; *) fail "Configure the reversed Google URL scheme.";; esac
