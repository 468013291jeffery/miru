# Production deployment

All contributors publish from the same GitHub `main` history. Commit source changes and media before deployment. Generated `index.html` is rebuilt from the selected commit; it must never be copied from an older branch over a newer release.

Use the installed entry point:

```sh
sudo /usr/local/sbin/miru-deploy --expected-current "$(readlink -f /opt/miru/current)"
```

The deployer takes a shared lock, verifies the current release fingerprint, rejects a target commit that does not include the current production commit, validates required assets, rebuilds, then checks the baseline again before switching. Failed health checks restore the previous release. The JSON metadata `.miru-release.json` records the source commit; `.miru-files.json` detects edits made directly to production.

If a deployment is rejected, fetch current `main`, merge the missing changes, rebuild and test, then deploy again. Do not bypass the check by rewriting the production fingerprint. `--adopt-current` is for a reviewed first migration from a release without a manifest, not a routine overwrite switch.

`shared/production.env`, the database and explicit server adapters remain outside Git. When upstream changes a file covered by a server adapter, deployment stops for a manual merge instead of hiding either version. Never display credentials in logs.

Keep media and image mappings in Git. Additional media from the current release is carried forward, but direct edits to an existing release still trigger the drift check. Store mutable application data in the database or blob store.

All automation and people must use this entry point. An administrator can still bypass it with a direct symlink change or an old deploy script; do not run those paths. The former deploy script is replaced by a wrapper. No new deployment timer is enabled by this change.

Checks:

```sh
python3 source/build.py
node --check source/all.js
node tools/release-contract.mjs
python3 tools/deploy-guard-selftest.py
```
