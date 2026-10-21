# MIRU — deep interactive chapter spec

MIRU is an interactive romance drama app (adult readers, US + Chinese audiences). A story has 8 chapters. Each chapter
plays as a chat-style scene: narration and character lines appear one by one; the reader plays one character (the
story's **POV** character) and *speaks for them at "line" stops*; the scene also stops for gifts, mini-games, photo
unlocks, video unlocks, voice notes and phone calls that are **part of the story**, not bolted on. The chapter ends at
the official A/B/C choice (already written — you must lead into it, not resolve it).

Your job: write ONE chapter file `content/deep/<wid>_ch<N>.json` (paths relative to the v2 project folder), then run
`python3 content/deep/validate.py <wid> <N>` and fix everything until it prints `OK ✓`.

## Source material (read these first)
- `content/out/sNN.json` whose `"wid"` equals the story id: title, premise, `you`, stakes, cast (role, vibe, tells,
  twist, want, fear, boundary, secret, likes), all 8 chapters (`t`, `goal`, `place`, `time`, `beats`, `ask`,
  `choices[k,t,then,mem]`), endings. The current `beats` are a ~8-line sketch of the chapter — your chapter must keep
  every key event in that sketch (you may reword), expanded into a full scene.
- `content/deep/crimson_ch1.json` = a reference for tone and stop usage (it is shorter than required).

## File format
```json
{
 "beats": { "en": [ BEAT_OR_STOP, ... ], "zh": [ ...same sequence... ] },
 "then":  { "A": {"en":[...], "zh":[...]}, "B": {...}, "C": {...} }
}
```
A **beat** is `[who, kind, text]`:
- `["n","act","…"]` narration, third person, present tense.
- `["<castId>","say","…"]` a spoken line (no quote marks).
- `["<castId>","act","…"]` that character's action, written in **first person** from that character ("I turn my ring…").
- `["<castId>","think","…"]` that character's private thought, first person.

**The POV character never has scripted beats in the opening** (`beats`). Everything the POV says or does happens
through **line stops**, or is described in short `n` narration ("Adrian folds the towel."). Other characters talk freely.

A **stop** is `[who, kind, {data}]`. Every text field is plain text in that language (en file → English, zh → Chinese):

| kind | who | data |
|---|---|---|
| `line` | POV id | `hint` (what's at stake in this beat, ≤1 sentence), `opts`: 2–3 × `{k:"say"|"act"|"think", t:"the POV's line/action", then:[beats — the others' reaction, 1–4 beats], love: -3..3}`; optional `free:[beats]` = reaction if the reader types their own line |
| `gift` | love interest id | `who` (recipient id), `hint`, `by`: reactions for **all five** gift ids `coffee` (a coffee made the way they like it), `flower` (a single rose), `hoodie` (your hoodie), `letter` (a handwritten letter), `ring` (a ring, "no pressure") — 1–3 beats each, in character and specific to this moment; `then:[]` (after any gift), `skip:[beats]` (if the reader gives nothing) |
| `game` | love interest id | `k` one of `phone` (Found Phone: his phone left behind, last text from the other), `remember` (Who Remembers Wrong: they tell the same night differently, find the lies), `asleep` (Was He Really Asleep: inspect evidence), `photo` (The One Not in the Photo), `keepsake` (Private Keepsakes: search his room for 3 things he kept of the other), `shutter` (Memory Shutter: match shared memories), `sync` (Heartbeat Sync: match his heartbeat when the other walks in), `order` (His Order: what he orders for the other every morning). Pick the game whose premise fits the scene and write `hint` that makes it a story beat. `then:[beats after playing]`, `skip:[beats]` |
| `photo` | the character in the shot | `cap` (caption of the exact moment, with time), `prompt` (**English in both files**: an image prompt describing the scene — setting, light, pose, clothes; no names, adults only, no text), `then:[]`, `skip:[]` |
| `video` | love interest id | `clip` (index into the story's filmed clips — see list below), `cap` (subtitle for the clip), `hint` (frame it: flash-forward / memory / dream / "what he's picturing", unless it literally fits the scene), `then:[1 beat returning to the scene]` |
| `voice` | sender id | `who`, `txt` (the locked voice note, 1–3 sentences, in his voice), `hint` (why there's a voice note now), `then:[]`, `skip:[]` |
| `call` | caller id | `cid`, `hint`, `lines`: 5–8 × `[speakerId, "text"]` (what he says on the phone — the reader listens; can include pauses described in words), `then:[beats after hanging up]`, `skip:[beats if declined]` |

The whole opening must contain **≥10 line stops** and **at least one** each of gift, game, photo, video, voice, call
(a call/voice note needs a reason: they're apart, someone stepped out, a flashback to a voicemail, the scene moves, etc.
It's fine for the scene to move through 2–3 locations inside the chapter's `place`/`time` window).

## Length and depth
- The opening must reach **≥100 played lines** (validator counts beats + each stop + its reactions). Aim for 105–130.
  Depth means: real back-and-forth, subtext, physical detail, the characters' `tells`, a turn or two in the middle,
  a reveal tied to their `secret`/`twist` that fits this chapter, rising tension that ends exactly at the chapter's `ask`.
  No filler, no repetition, no recap of earlier chapters beyond a line.
- Each choice aftermath `then.A/B/C` (both languages): **≥12 played lines**, keeping every event of the existing sketch
  and its `mem` summary true (that summary is canon for later chapters). Here the POV *may* have scripted beats (the
  reader chose this). Put at least one stop (photo / voice / call / line) in each aftermath.
- Never decide the A/B/C choice inside the opening. Never jump to the next chapter's events.
- Earlier choices vary per reader: refer to past chapters only in ways true for every path.

## Voice and language
- English: natural, modern, literary-but-fast, US audience. Chinese: native, idiomatic web-novel quality — **not a
  translation of the English**; the same events and stops in the same order, each line written the way a Chinese
  writer would write it. Names stay in Latin letters in Chinese (Adrian, Lucien).
- Each character sounds like their `vibe`. Show, don't explain. Tension > exposition.
- Adult romance, slow-burn / dark tones allowed; no explicit sex, no minors, consent and each character's `boundary`
  are respected (a refusal is a real answer; gifts/money never buy affection).
- `line` options should be meaningfully different (e.g. sharp / soft / evasive, or say / act / think), each with a
  distinct reaction. Use `love` +2/+3 for options that build real intimacy, negative for cruelty.

## Filmed clips available (video `clip` index → what is on screen)
- crimson: 0 = 5:51 AM, Adrian presses a wooden stake to Lucien's heart · 1 = Lucien: "Do it. Your debt dies with me."
  · 2 = Adrian: "You bought my sister's debt too. Why?" · 4 = Lucien takes his wrist and pulls the stake closer; it
  breaks skin · 5 = Lucien: "Because I waited four hundred years for someone who would." · 6 = Adrian throws himself
  between Lucien and the rising sun. (These belong to a dawn confrontation — use them as flash-forwards, dreams,
  premonitions, or literally if the chapter is that dawn.)

## Done = `python3 content/deep/validate.py <wid> <N>` prints `OK ✓`.
