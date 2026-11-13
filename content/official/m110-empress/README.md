# 女帝的绝色后宫 · MIRU M110

This is a separate work from the existing island drama that also uses the M110 label. `m110-empress` is the stable content key. The original manuscript is preserved in `source.md`; production-only instructions are excluded from `script.md`.

Scope: 10 chapters, 40 scenes, 126 options; 20 adult romantic characters; four curse routes with explicit fallback investigation; three retryable rune rounds; five endings, with the second crown gated by four clues and the portrait; original 36 daily event cards plus one clearly marked Kael supplement. State, memory, availability, consent boundaries and cooldowns are saved in `th.pk.empress147`. Generic A/B/C affection rewards and legacy exclusivity gates are disabled only for this work.

Production assets: 20 portraits, 16 backgrounds, 12 CG illustrations, 122 prerecorded English dialogue clips, 8 original procedural music tracks and 13 synthesized sound effects. Voices reuse seven existing male voice slots, rather than twenty distinct actors. The user-provided 9.963-second 1080×1920 video is preserved unchanged and supplies the poster. All 192 final media files passed full decoding and hash checks. Repeated event templates are not a fully authored infinite dialogue library. Free conversation uses the site's existing AI service and does not grant state changes.

Corrections at integration: Day 9/10 labels follow the story's three-day and one-month elapsed time; living Kael reactions are omitted while his soul is trapped; conditional second-crown exposition stays hidden until earned. The manuscript's 36 cards omit Kael, hence a separate optional supplement.

Build: `node tools/build-empress.cjs` then `python source/build.py`.
Checks: `node tools/empress-selftest.cjs`, `node --check source/all.js`, and the repository release contract. Production must use `/usr/local/sbin/miru-deploy` with its exact current-release guard. Import and automatic review happen before publication; no force flag is used.

Publication is incomplete until the authenticated server operation and public checks succeed. A local build or Git push is not evidence of live publication.
