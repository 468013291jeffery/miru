# M105 illustrated edition

Source delivery: `MIRU_M105_COMPLETE_ILLUSTRATED_EN_ZH (1).zip`.

The existing work `w_scmvxnqoko453e6d7bc3` keeps its identity. Chinese and English have 18 main chapters, 36 choices and a separate player. Import formatting closes every choice with `# ·`; Chinese speaker aliases use the same canonical names as the cast sheet. Luca remains absent from present-day dialogue.

`source/src/app131_m105.js` applies only to this work. It adds three episodes to the same work, with conditional beats for committed, slow and independent paths. Chapter 17 flags select one path; generic A-choice affection and ending gates do not override authored decisions. It also exposes the 36 authored life moments after the season, only on explicit player action, with relationship eligibility, saved choices and per-event cooldowns.

The five supplied images are preserved as web JPEGs in `art/official/m105-v6`. The file named `03_Dinner_CG` depicts a kiss and must not be treated as a neutral dinner image. The map uses the independent portrait for Dante instead of the old study-background placeholder. Existing appropriate environment backdrops remain available; this delivery does not provide a unique CG for every chapter.

Rebuild the runtime data with `node tools/build-m105-runtime.cjs`. Validate it with `node tools/build-m105-runtime.cjs --check` and `node tools/m105-selftest.cjs`; both run through the release contract. Publish the source/media via the guarded deployment entry, then publish the reviewed Chinese draft linked to its English draft. Keep backups in server shared storage, outside the release tree. Do not publish the English edition or the route texts as duplicate standalone works.
