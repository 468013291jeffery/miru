# M121 OFF CAMERA / 《镜头关掉后，他们都想吻我》

V2 design package, converted into the MIRU script the official importer already plays. Twelve chapters, forty-eight scenes, sixteen optional intimate scenes. All 117 images are in `art/official/m121-off-camera/images/<ID>.webp`, including `CG_M121_024`. The only video is `video/official/m121-off-camera/V01_opening.mp4`, played at the start of chapter 1. There are no other trailers. Music files are not in the repo yet.

Intimate scenes are not separate chapter stops. They open only from the consent choice on the preceding scene, and only when the story flags, the earlier consent step and a clear boundary allow it. Stop clears that scene's consent. A later exclusive ending hides the other men's intimate scenes. The six endings are chosen by name at chapter 12. The highest affection score does not pick anyone.

The twenty-four mini-games are recorded as skippable win / help / skip choices so the story can continue. Their drag, sort and audio widgets are not built: the shared library does not have templates for those specs (`existing_template_to_verify`, and seven marked as needing a new template).

Rebuild the script after editing `source/`:

```text
node tools/compile-m121.cjs
node tools/m121-selftest.cjs
```

Publishing is a separate step on the server. `publish-payload.json` is the admin draft (`adult: true`, `heat: explicit`). Do not publish it until the age-gate switches in production are on, or the story will be rejected or hidden.
