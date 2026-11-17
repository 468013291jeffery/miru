#!/usr/bin/env python3
"""Verify that the first iOS binary has no advertising SDK or static web ad loader."""
import pathlib, plistlib, re, subprocess, sys
app = pathlib.Path(sys.argv[1])
assert app.is_dir(), f"Missing app bundle: {app}"
with (app / "Info.plist").open("rb") as f:
    info = plistlib.load(f)
assert info["CFBundleIdentifier"] == "com.miru.plus.app"
assert "GADApplicationIdentifier" not in info
assert "MIRURewardedAdUnitID" not in info
for item in app.rglob("*"):
    assert not any(name in item.name for name in ("GoogleMobileAds", "UserMessagingPlatform")), item
linked = subprocess.check_output(["otool", "-L", str(app / info["CFBundleExecutable"])], text=True)
assert "GoogleMobileAds" not in linked and "UserMessagingPlatform" not in linked
html = (app / "public/index.html").read_text()
scripts = re.findall(r'<script\b[^>]*\bsrc=["\x27]([^"\x27]+)', html, flags=re.I)
assert not any("googlesyndication" in src or "adsbygoogle" in src for src in scripts)
assert (app / "public/ios-bootstrap.js").exists()
print("PASS actual app bundle has no GMA/UMP, advertising Info keys or static web ad script")
