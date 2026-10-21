# MIRU — story pack authoring brief (production content)

MIRU is a US-market interactive romance app (BL / GL / BG / group stories, all characters adults 21+ in spirit;
ages given in sources are canon). Every story is played in **8 chapters**. Each chapter opens with a short scripted
scene (beats), then the reader makes **one of three choices (A/B/C)**, which plays a short scripted consequence.
The reader can also free-type to the AI between choices, but YOUR job is the official scripted layer, which must be
good enough to play on its own, with no AI.

Chapters 1–2 are free. Chapter 3+ is in the paid Story Pack, so chapter 2 must end on a specific, desirable
hook/invitation (not a cut-off reply — the scene itself is complete, but the reader wants the next one).

You write ONE JSON file per story: `content/out/sNN.json` (NN = 01..36). Then run
`python3 content/validate.py content/out/sNN.json` and fix every error until it prints OK.

## Sources (read ALL of them for your story)

- `content/src/sNN.md` — SOURCE A (six-scene script with key English dialogue + three endings + product binding),
  SOURCE B (eight-chapter pack: chapter titles, goals, key lines, choice logic), SOURCE C (structured json:
  cast wants/fears/boundaries/speech style, director rules, endings, features, products).
- Story 20 ONLY: `content/src/s20_commerce_v2.md` is the PRIMARY source and overrides the others (its 8 chapters:
  Two Wrong Shoes / The Good Coat / Empty-Handed Knock / Two Walking Routes / A Crooked Photo / The Retracted
  Invitation / Different Calendars / The Third Shoeprint; Ben 33 librarian, Miles 31 dog trainer, Toast the dog).
- `content/existing_chars.json` — characters that already exist in the app (with portrait art). If your cast id is in
  this file, keep its `looks` EXACTLY (copy en/zh) because the portrait already shows that face. Update name/age/role/etc.
  to the NEW canon in the sources (e.g. Ethan is now a 25-year-old goalie).
- `content/existing_worlds.json` — the old versions of the 19 reworked stories (for continuity of ids only; the new
  sources win on every story fact).

Reused portraits for renamed characters — use these ids and copy `looks` from the listed existing character:
`ada` ← looks of `sasha` · `riley` ← `marisol` · `mara` ← `nora` · `finn` ← `callum` · `lena` ← `dakota` ·
`june` (story 12, illustrator) ← `june` (keep looks).
Every OTHER new character (not in existing_chars.json and not in that list) gets `"looks": null` — a separate artist
writes their looks and paints them. Do not invent looks for them.

## World ids (use exactly)

01 ice · 02 crimson · 03 made · 04 pole · 05 fourth · 06 unseelie · 07 pact · 08 night · 09 pack · 10 light ·
11 split · 12 roomies · 13 offbook · 14 bratva · 15 lowseason · 16 afterhours · 17 masque · 18 gala · 19 market ·
20 dog · 21 crush · 22 float · 23 laundry · 24 rewind · 25 secondset · 26 dragon · 27 heroics · 28 forecast ·
29 august · 30 twominutes · 31 recipe · 32 openhouse · 33 lastplate · 34 turn · 35 lastjam · 36 landing

Character ids: use the ids in SOURCE C `cast` (lowercase first name). Stories 16–19 are group/ensemble AUs reusing
characters from other stories: set `"kind":"ensemble"`, `"or":"all"`, and in `cast` give only
`{"id":..., "au_role":{"en","zh"}}` for each member (their role in THIS AU) — do NOT redefine their profile.
Story 09 (pack, 3 wolves) is `"kind":"ensemble"`, `"or":"bl"` but DOES define full profiles.

## JSON schema

Every user-facing string is bilingual: `{"en": "...", "zh": "..."}`. English is the product language — natural,
contemporary American, specific, a little funny, never purple. Chinese is a fluent, natural rendering for Chinese
readers (not word-for-word; keep names in English).

```json
{
 "n": 20,
 "wid": "dog",
 "or": "bl",                      // bl | gl | bg | all
 "kind": "story",                 // story | ensemble
 "heat": "slow",                  // fluff | slow | steamy | mature   (content ceiling; nothing explicit ever)
 "title":   {"en": "The Dog Comes on Fridays", "zh": "狗每周五来"},
 "hook":    {"en": "The dog comes every Friday. One week, he comes alone.", "zh": "…"},      // <= 90 chars en: the poster line
 "logline": {"en": "1–2 sentences, <= 200 chars, what the story is and why it hurts/charms.", "zh": "…"},
 "premise": {"en": "3–4 sentences: who, where, the specific conflict, what the reader decides.", "zh": "…"},
 "you":     {"en": "The side role the reader can Join as (e.g. 'The neighbor across the landing who…').", "zh": "…"},
 "stakes":  {"en": "One sentence: what is lost if nobody acts.", "zh": "…"},
 "place":   {"en": "Opening place", "zh": "…"},
 "time":    {"en": "Opening time, e.g. 'Friday, 6:10 PM'", "zh": "…"},
 "tags":    ["Rom-Com", "Pet Park", "Slow Burn", "Mutual Pining", "Golden Retriever"],   // 5–7 English tags
 "tag_zh":  {"Pet Park": "宠物公园"},     // Chinese for any tag you use that is NOT in the list below
 "cast": [
  {"id": "ben", "n": "Ben Okafor", "age": 33, "g": "m",  // g: m | f | nb
   "a": "steady",                 // fallback voice archetype: guard | charm | dark | grump | steady | sun
   "pov": true,                   // exactly ONE cast member is the POV lead (whose side the choices are on)
   "role":  {"en": "Reference librarian, branch on Maple", "zh": "…"},
   "looks": null,                 // null for brand-new characters; copied for existing / reused ones
   "vibe":  {"en": "Dry, observant, allergic to asking directly", "zh": "…"},
   "tells": {"en": ["2 concrete behaviors that show feelings"], "zh": ["…","…"]},
   "twist": {"en": "The contradiction that makes them interesting", "zh": "…"},
   "likes": {"en": "3 specific things", "zh": "…"},
   "secret":{"en": "Something true they haven't said (revealed later)", "zh": "…"},
   "pitch": {"en": "“A one-line quote in their voice”", "zh": "…"},
   "want":  {"en": "…", "zh": "…"}, "fear": {"en": "…", "zh": "…"}, "boundary": {"en": "…", "zh": "…"},
   "solo":  {"en": "*Opening line for a 1:1 chat with them, first person, with an *action* and a (thought).*", "zh": "…"}
  }
 ],
 "rel": [["ben", "miles", {"en": "Neighbors. Every Friday, a dog makes them talk.", "zh": "…"}]],
 "join": [
  {"as": "ben",  "t": {"en": "Play as Ben — the librarian who wore the good coat.", "zh": "…"}},
  {"as": "side", "t": {"en": "Join as the neighbor across the landing.", "zh": "…"}}
 ],
 "chapters": [                    // EXACTLY 8
  {
   "t":     {"en": "Two Wrong Shoes", "zh": "两只错鞋"},
   "goal":  {"en": "Get the shoes back to their owners", "zh": "…"},        // short objective, shown as the chapter goal
   "place": {"en": "Ben's doorway, 4th floor", "zh": "…"},
   "time":  {"en": "Friday, 6:10 PM", "zh": "…"},
   "beats": {
     "en": [["n","act","Narration in present tense."], ["ben","say","That's not even my size."], ["miles","act","I …"], ["ben","think","(…)"]],
     "zh": [ … same number of beats, same order, same who/kind … ]
   },
   "ask":   {"en": "What does Ben do?", "zh": "…"},
   "choices": [
    {"k": "A", "t": {"en": "Help him find the owners", "zh": "…"},
     "then": {"en": [["miles","say","…"],["n","act","…"]], "zh": [ … ]},
     "mem":  {"en": "Ben and Miles returned both shoes together.", "zh": "…"}},
    {"k": "B", "t": {"en": "…"}, "then": {…}, "mem": {…}},
    {"k": "C", "t": {"en": "…"}, "then": {…}, "mem": {…}}
   ]
  }
 ],
 "endings": {
  "A": {"t": {"en": "Without an Excuse", "zh": "…"}, "txt": {"en": "2–3 sentence ending summary.", "zh": "…"},
        "line": {"who": "miles", "en": "The final line.", "zh": "…"}},
  "B": {…}, "C": {…}
 },
 "bonus":    {"t": {"en": "A Saturday Without the Dog", "zh": "…"}, "d": {"en": "What the paid extra episode delivers (2 sentences).", "zh": "…"}},
 "polaroid": {"en": "Custom photo moment, e.g. 'The crooked photo, retaken — your caption on the border'", "zh": "…"},
 "features": {"game": {"en","zh"}, "gift": {"en","zh"}, "date": {"en","zh"}, "photo": {"en","zh"}, "voice": {"en","zh"}, "room": {"en","zh"}},
 "director": {"allowed": [{"en","zh"}, {"en","zh"}, {"en","zh"}], "au": [{"en","zh"}, {"en","zh"}]}
}
```

### Beat rules
- `who` = a cast id or `"n"` (narration). `kind` = `say` | `act` | `think`. Narration is always kind `act`.
- `act` lines for a character are FIRST PERSON from that character ("I set the shoe down."). Narration is third person, present tense.
- `think` is a private thought in parentheses-free plain text.
- Chapter `beats`: 5–9 beats, each <= 32 English words. Must contain the source's key English dialogue lines for that
  chapter (verbatim or lightly polished). Add connective narration and 1–2 invented lines so the scene flows.
- Each choice's `then`: 2–4 beats showing a DISTINCT, concrete consequence. `mem`: one factual sentence recorded
  to memory (what actually happened).
- `en` and `zh` arrays have the same length and the same who/kind in the same order.

### Choice rules (this is the product)
- `t` is imperative, <= 9 English words, from the POV lead's side ("Ask him why — to his face.").
- A = moves toward honesty / connection / the chapter goal. B = a slower, careful, or alternative path WITH a
  boundary (not a failure). C = refuses / walks away / keeps control — never punished cruelly; it changes the road.
- Chapter 3 choices come from SOURCE B chapter 3; chapter 7–8 choices are the relationship/slow/exit branches.
- Chapter 8: the three choices ARE the three endings (A relationship, B slow-burn/friendship/open, C exit/goodbye);
  their `then` beats play the ending scene; `endings` summarizes them with the canonical final lines from the sources.
- Nothing is bought with love: no choice, gift or payment makes a character consent; refusals are respected.
- Group stories (16–19): choices are group decisions from the POV lead's side; endings are group outcomes.

### Tone & safety
- Adults only; no minors, no explicit sex (heat is a ceiling for tension), no real people, brands, teams or celebrities.
- Dark stories (crimson, made, bratva, masque, pack) can be tense and morally grey, but every "exit" stays available.
- Keep each character's voice distinct (use `speech_style` from SOURCE C).

### Allowed tags (preferred; you may add up to 2 new setting tags with `tag_zh`)
genre: Romance, Dark Romance, Romantasy, Rom-Com, Angst, Drama, Slice of Life, Cozy, Sci-Fi, Mystery, Bittersweet
setting: Hockey, F1, College Football, Esports, Mafia, Bratva, Vampires, Fae, Werewolves, Small Town, Hospital, Broadway,
Wedding, Roommates, Bakery, Kitchen, Jazz Club, Radio, Roller Derby, Dragons, Ghosts, Space Station, Road Trip, Apartment Life
trope: Enemies to Lovers, Rivals to Lovers, Fake Dating, Only One Bed, Forced Proximity, Slow Burn, Grumpy x Sunshine,
Bodyguard, Arranged Marriage, Second Chance, Hurt/Comfort, Forbidden, Why Choose, Mutual Pining, Secret Admirer,
Touch Them and Die, Found Family, Neighbors, Coworkers, Long Distance, Friends to Lovers
character: Possessive, Golden Retriever, Cold Prince, Morally Grey, Soft Giant, Himbo, Genius, Protective, Chaotic
