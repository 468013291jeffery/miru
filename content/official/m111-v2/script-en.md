# CHAPTER 1｜THE NIGHT I DIED AGAIN
⟦ORIENT|bg⟧
⟦CHAR|你|f|25|f2|The adult player, an independent investigator|Only the player decides their words, attitude, and intimate boundaries. Never depict a fixed face.|You⟧
⟦CHAR|卢西恩|m|32|m1|Lucien Voss, vampire prince|Wavy black hair, silver-gray eyes, tailored long black coat. Low restrained speech, shorter under fear of loss. Remembers 99 seven-day cycles; past relationships never establish present consent.|Lucien⟧
⟦CHAR|罗文|m|30|m3|Rowan Ashford, emergency physician|Short auburn hair, green eyes, navy scrubs. Direct, compassionate, practical care and verification. Has only dream fragments since cycle 97, not complete knowledge.|Rowan⟧
⟦CHAR|卡西安|m|29|m4|Cassian Thorne, hunter|Short dark blond hair, healed eyebrow scar, leather coat. Brief and sardonic, plain when admitting fault; memories suppressed by a blood oath. Injury never entitles him to forgiveness.|Cassian⟧
⟦CHAR|玛拉|f|36|f3|Mara Ellery, independent archive custodian; non-romantic|Short natural curls, burgundy coat, copper glasses. Calm and precise about originals, inference, and testimony. Preserves offline records outside the boundary; not omniscient.|Mara⟧
⟦CHAR|伊芙琳|f|41|f4|Evelyn Rook, council chair; non-romantic|Ivory-white hair, black velvet suit. Controlled and commanding; justifies control as order. Knows the sacrifice clause was altered, but others require evidence before knowing this.|Evelyn⟧
⟦SECRET|lucien_revival|Died in cycle 37 and was revived by the clock|knows:卢西恩|reveal_from:8⟧
⟦SECRET|rowan_lockdown|Wrongly locked down the hospital|knows:罗文|reveal_from:6⟧
⟦SECRET|cassian_order|Executed an altered hunting order|knows:卡西安|reveal_from:4⟧
⟦SECRET|council_forgery|Sacrifice validation is absent from the original pact|knows:伊芙琳|reveal_from:7⟧
⟦GOAL|核实银色印记和死亡片段，选择调查线索|Verify the mark and the remembered death; choose a lead⟧
⟦DONE|flag|c01clue_seen|Verify key evidence|旁白：A silver mark shaped like a broken clock hand remains on your wrist.⟧
⟦DONE|say|Ask about the reset, verify the silver mark, or propose an investigation|State an intention|旁白：The evidence is preserved; your wishes for the next step still need to be heard.⟧

# SCENE｜Manhattan rooftop · remembered fragment
⟦BG|bg_c01s01|Manhattan rooftop · remembered fragment · Lucien⟧
⟦TIME|Cycle 99 · November 13 23:59⟧
⟦FX|rain⟧
⟦BGM|m111_mystery⟧
⟦SET|native_v2⟧
旁白：A rain-soaked rooftop flickers like a recording played again.
旁白：Beyond the railing is darkness. A silver clock hand reflects in the glass.
卢西恩：“Look at me. Stay with my voice.”
旁白：His outstretched hand hangs in the rain; the bell swallows the rest.
⟦SFX|m111_clock⟧
旁白：The image freezes at midnight. A bedside alarm sounds in the dark.
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：The alarm continues, but there is no rain outside.

# SCENE｜Apartment bedroom
⟦BG|bg_c01s02|Apartment bedroom · viewer alone⟧
⟦TIME|Cycle 100 · November 7 09:20⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
旁白：Sunlight fills the window. The bedside phone reads November 7.
旁白：A silver mark shaped like a broken clock hand remains on your wrist.
旁白：The rooftop access photo is dated November 13.
旁白：A bedside card reads: Do not trust only the man who remembers you.
旁白：The back lists a museum preview and an emergency clinic number.
⟦SET|c01clue_seen⟧
# CHOICE｜Two records disagree about the date. How will you verify them?
#### A｜Hear Lucien out and request verifiable evidence
旁白：A copy of Lucien’s visitor log is preserved, with its time intact.
⟦OPT|A|set:c01approach_a⟧
#### B｜Get an independent examination of the mark
旁白：The clinic offers to preserve results without sharing them with visitors.
⟦OPT|B|set:c01approach_b⟧
#### C｜Stay independent and check public records
旁白：The public catalog lists ninety-nine sealed loans from the same lender.
⟦OPT|C|set:c01approach_c⟧
# ·
旁白：The afternoon preview is public; its guest list can be checked independently.

# SCENE｜Museum preview hall
⟦BG|bg_c01s03|Museum preview hall · Lucien⟧
⟦TIME|Day 1 · November 7 16:30⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
⟦IF|c01approach_a⟧
旁白：The visitor-log copy accompanies the preview visit; Lucien’s name matches the photograph.
⟦/IF⟧
⟦IF|c01approach_b⟧
旁白：The clinic receipt stays in your personal file, not with the gallery visitors.
⟦/IF⟧
⟦IF|c01approach_c⟧
旁白：The public catalog on the preview desk matches the loan codes to the exhibits.
⟦/IF⟧
旁白：In the preview hall, a man in black holds an untouched glass of wine.
旁白：Lucien sees you; his fingers tighten around the stem.
卢西恩：“You’re alive.”
卢西恩：“Before midnight on Friday, do not go to that rooftop alone.”
卢西恩：“I can give you records. You need not take my word for it.”
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：He leaves the side-gallery key on the counter and steps back.

# SCENE｜Museum side gallery
⟦BG|bg_c01s04|Museum side gallery · Lucien⟧
⟦TIME|Day 1 · November 7 18:10⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
旁白：Ninety-nine frames line the side gallery, all dated within the same week.
旁白：Each has a different cycle number. The hundredth is empty.
卢西恩：“The same seven days. I remember ninety-nine of them.”
卢西恩：“This is the first time you have brought back a fragment of dying.”
旁白：The seals behind the frames match the impression on the bedside card.
# CHOICE｜Where should the records be checked first?
#### A｜Ask about a moment in a cycle that was not defined by death
旁白：Lucien retrieves the twelfth cycle’s album: a riverside picnic in the same week.
旁白：The loan slip points to a vault beneath the old church.
⟦OPT|A|set:c01route_a⟧
#### B｜Request all ninety-nine death records
旁白：Ninety-nine records are placed on the public desk, all bearing the same vault code.
旁白：The old church assigned that code is still staffed tonight.
⟦OPT|B|set:c01route_b⟧
#### C｜Photograph the empty frame’s seal and trace its source
旁白：The empty frame’s seal is photographed; the museum traces it to the old church.
旁白：The seal is newer than the final death record.
⟦OPT|C|set:c01route_c⟧
# ·

# CHAPTER 2｜THE MAN WITH NINETY-NINE GRAVES
⟦GOAL|核验纪念碑、录音和医生的梦境|Verify the memorials, recording, and the doctor’s dreams⟧
⟦DONE|flag|c02clue_seen|Verify key evidence|旁白：A voice matching the old footage comes through the speaker.⟧
⟦DONE|say|Ask about provenance, check the recording, or arrange an independent examination|State an intention|旁白：The evidence is preserved; your wishes for the next step still need to be heard.⟧

# SCENE｜Old church memorial vault
⟦BG|bg_c02s01|Old church memorial vault · Lucien⟧
⟦TIME|Day 1 · November 7 20:00⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
⟦IF|c01route_a⟧
旁白：The twelfth-cycle album reaches the memorial vault first, its riverside date still in the same week.
⟦/IF⟧
⟦IF|c01route_b⟧
旁白：The custodian checks all ninety-nine numbered pouches in sequence.
⟦/IF⟧
⟦IF|c01route_c⟧
旁白：The empty-frame seal photo becomes the search key; the custodian leaves a signed receipt.
⟦/IF⟧
旁白：Two hours later, the church custodian opens the memorial vault.
旁白：Ninety-nine markers carry cycle numbers and the same end date: November 13.
旁白：Beside white roses, the record bags match the museum’s vault codes.
卢西恩：“Not ninety-nine centuries. Ninety-nine weeks that could not end.”
卢西恩：“Remembering does not give me the right to decide for you.”
旁白：The custodian’s key is in the holding tray and must be identified among the objects.
⟦MG|g_find_key⟧
⟦IF|mg_find_key_win⟧
旁白：The key is found promptly; the custodian verifies its number and opens the recording room.
⟦ELSE⟧
旁白：The custodian uses the spare and leaves the original key for a logged search.
⟦/IF⟧
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：The custodian delivers an unopened recording to the reading room.

# SCENE｜Church recording room
⟦BG|bg_c02s02|Church recording room · Lucien⟧
⟦TIME|Day 1 · November 7 20:30⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
旁白：The pouch is marked cycle ninety-eight, recorded before midnight.
⟦SFX|m111_paper⟧
旁白：A voice matching the old footage comes through the speaker.
旁白：The recording says: You can remember someone and still misunderstand them.
卢西恩：“I have never heard this recording before.”
旁白：An on-duty hospital physician signed the pouch’s receipt.
⟦SET|c02clue_seen⟧
# CHOICE｜The sealed recording and Lucien’s memory differ. Who should verify them?
#### A｜Compare Lucien’s account item by item
旁白：His account is transcribed in separate columns; unexplained gaps stay blank.
⟦OPT|A|set:c02approach_a⟧
#### B｜Examine every memorial record independently
旁白：The custodian provides copies and a private desk; Lucien waits outside.
⟦OPT|B|set:c02approach_b⟧
#### C｜Ask Rowan, the physician who signed for it, to verify the seal
旁白：The custody form is added to the examination file so Rowan can check the signature.
⟦OPT|C|set:c02approach_c⟧
# ·
旁白：The hospital’s night clinic is open; the signatory is on duty.

# SCENE｜Hospital night clinic
⟦BG|bg_c02s03|Hospital night clinic · Rowan⟧
⟦TIME|Day 1 · November 7 21:20⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
⟦IF|c02approach_a⟧
旁白：Lucien’s columned account reaches Rowan for comparison, separate from the dream record.
⟦/IF⟧
⟦IF|c02approach_b⟧
旁白：The independent notes do not quote Lucien’s interpretation; Rowan checks their sources first.
⟦/IF⟧
⟦IF|c02approach_c⟧
旁白：Rowan verifies the pouch signature and receipt, without claiming to explain the memory.
⟦/IF⟧
旁白：Rowan angles the examination lamp toward the silver mark without touching it.
罗文：“May I examine it? You can stop me at any point.”
旁白：He sketches the rooftop railing and a cracked ring on paper.
罗文：“Since the number ninety-seven began appearing, I keep dreaming of this place.”
旁白：The ring in the drawing matches Lucien’s in the preview photograph.
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：Rowan preserves the original sketch and moves to the adjacent consultation room.

# SCENE｜Hospital consultation room
⟦BG|bg_c02s04|Hospital consultation room · Lucien、Rowan⟧
⟦TIME|Day 1 · November 7 22:00⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
旁白：Lucien arrives at the consultation room at the duty desk’s request.
卢西恩：“His dreams may be affected by the clock. They are not testimony by themselves.”
罗文：“That is why I keep examination and custody records, not conclusions about dreams.”
旁白：The door stays open. Both men put their records on the same desk.
罗文：“You decide who stays for the next step.”
# CHOICE｜What arrangement respects your boundaries for the next examination?
#### A｜Let Rowan examine the mark in private
旁白：Rowan prepares a non-invasive examination; Lucien leaves a transit key at the duty desk.
旁白：The key belongs to a closed platform listed in the anomalous signal log.
⟦OPT|A|set:c02route_a⟧
#### B｜Ask Lucien to secure the route without accessing medical records
旁白：Lucien takes only the route map; the hospital retains the medical file.
旁白：At the map’s end, a closed platform registers another train signal tonight.
⟦OPT|B|set:c02route_b⟧
#### C｜Ask both men to leave while you review the copies
旁白：Both men step outside, leaving hospital copies and public transit records.
旁白：The transit records show a sealed platform still signaling at midnight.
⟦OPT|C|set:c02route_c⟧
# ·

# CHAPTER 3｜A VOW FROM ANOTHER CYCLE
⟦GOAL|核实旧影像与契约，界定当下的同意|Check old footage and the pact; define consent in the present⟧
⟦DONE|flag|c03clue_seen|Verify key evidence|旁白：In the footage, a ring is left on a bench. No vow is made.⟧
⟦DONE|say|Verify the footage, ask about the pact, or state present boundaries|State an intention|旁白：The evidence is preserved; your wishes for the next step still need to be heard.⟧

# SCENE｜Closed subway platform
⟦BG|bg_c03s01|Closed subway platform · Lucien⟧
⟦TIME|Day 2 · November 8 00:10⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
⟦IF|c02route_a⟧
旁白：The examination finds no immediate injury, but the anomalous signal still points to the closed platform.
⟦/IF⟧
⟦IF|c02route_b⟧
旁白：The duty desk retains the route map; Lucien has not accessed the medical records.
⟦/IF⟧
⟦IF|c02route_c⟧
旁白：The transit code found in private review matches the platform lock.
⟦/IF⟧
旁白：After midnight, the cataloged key opens the closed platform.
旁白：Lucien stays behind the safety line; other lights flicker in the train glass.
旁白：Scratches on the wall match their position in the twelfth-cycle photograph.
卢西恩：“It releases fragments. Fragments are not the whole truth.”
旁白：A stationary carriage door slides open. There are no passengers inside.
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：The reflection inside the glass settles on a night in the same week.

# SCENE｜Stationary subway carriage
⟦BG|bg_c03s02|Stationary subway carriage · Lucien⟧
⟦TIME|Day 2 · November 8 00:20⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
旁白：The glass shows the platform in cycle twelve, still dated November 8.
旁白：In the footage, a ring is left on a bench. No vow is made.
卢西恩：“We were close then. Later, you asked me not to decide for you.”
卢西恩：“That relationship is not one you are required to continue now.”
旁白：He closes the ring box and places it on a seat away from you.
⟦SET|c03clue_seen⟧
# CHOICE｜How should this past relationship enter the present investigation?
#### A｜Treat the footage as evidence to verify, not a promise
旁白：The footage is preserved as unverified material, separate from the present relationship.
⟦OPT|A|set:c03approach_a⟧
#### B｜State that you want emotional distance
旁白：The ring box stays on the seat; Lucien does not move closer.
⟦OPT|B|set:c03approach_b⟧
#### C｜Ask what happened after the earlier refusal
旁白：He provides the later recording’s index; Mara must unseal the original.
⟦OPT|C|set:c03approach_c⟧
# ·
旁白：The recorder’s custody tag points to the city archive, which opens in the morning.

# SCENE｜City archive reading room
⟦BG|bg_c03s03|City archive reading room · Mara⟧
⟦TIME|Day 2 · November 8 09:00⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
⟦IF|c03approach_a⟧
旁白：Mara logs the unverified footage as evidence, not as a relationship record.
⟦/IF⟧
⟦IF|c03approach_b⟧
旁白：The appointment specifies pact verification only; Lucien does not enter the reading area.
⟦/IF⟧
⟦IF|c03approach_c⟧
旁白：Mara unseals the later recording; there is no renewed consent recorded after the refusal.
⟦/IF⟧
旁白：After dawn, Mara unfolds an 1894 pact on the archive reading desk.
玛拉：“This is the clock’s historical charter, not proof of a previous incarnation.”
旁白：Its modern activation addendum requires personal consent for memory access and revocation.
玛拉：“Love cannot sign for you. Neither can memory.”
旁白：Beneath the binding, the final page has been neatly cut away.
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：Mara permits a certified copy to leave; the evening handover is at the riverside pavilion.

# SCENE｜Riverside reading pavilion
⟦BG|bg_c03s04|Riverside reading pavilion · Lucien⟧
⟦TIME|Day 2 · November 8 18:30⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
旁白：At dusk, after the rain, the certified copy is handed over at the riverside pavilion.
旁白：Lucien brings a custody list with no visible alterations.
卢西恩：“I can tell you the happier fragments, or we can discuss only evidence.”
旁白：The list bears a hunters’ loan stamp dated just after the page disappeared.
卢西恩：“That stamp needs checking. My dislike is not proof of guilt.”
# CHOICE｜How should the missing-page evidence be protected?
#### A｜Seal the copy and follow the loan record
旁白：The copy is sealed in a tamper-evident pouch with the hunters’ loan code outside.
旁白：The signatory is waiting beneath the museum.
⟦OPT|A|set:c03route_a⟧
#### B｜Question Lucien’s responsibility for the records
旁白：Lucien’s signature is preserved separately from the hunters’ loan record.
旁白：Both custody trails lead to the museum’s underground garage.
⟦OPT|B|set:c03route_b⟧
#### C｜Ask Mara to certify the stamp and chain of custody
旁白：Mara certifies the missing section without obscuring the original loan stamp.
旁白：The certification includes contact details for the signatory, Cassian.
⟦OPT|C|set:c03route_c⟧
# ·

# CHAPTER 4｜THE HUNTER WHO KILLED ME
⟦GOAL|查清猎杀令的改写，决定救援与证据安排|Trace the altered hunting order and decide how to protect people and evidence⟧
⟦DONE|flag|c04clue_seen|Verify key evidence|旁白：The draft targets a clock attachment; the revision targets its host.⟧
⟦DONE|say|Question Cassian’s responsibility, examine the order, or propose a rescue arrangement|State an intention|旁白：The evidence is preserved; your wishes for the next step still need to be heard.⟧

# SCENE｜Museum underground garage
⟦BG|bg_c04s01|Museum underground garage · Cassian⟧
⟦TIME|Day 2 · November 8 20:00⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
⟦IF|c03route_a⟧
旁白：The tamper-evident pouch is intact; Cassian checks the loan code through it.
⟦/IF⟧
⟦IF|c03route_b⟧
旁白：Lucien’s responsibility remains separately filed; Cassian must explain his portion of custody.
⟦/IF⟧
⟦IF|c03route_c⟧
旁白：Mara’s certified copy reaches the duty desk first, beyond Cassian’s ability to alter it.
⟦/IF⟧
旁白：After the evening handover, Cassian waits beneath a garage security camera.
旁白：He lays down the sheathed silver blade and takes his hands away.
卡西安：“In cycle seventy-six, I carried out an order against you.”
卡西安：“Missing memories do not excuse me. The original order is at headquarters.”
旁白：The envelope bears two seals; the lower one has been scraped thin.
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：Cassian hands over an archive pass for the headquarters evidence room.

# SCENE｜Hunters’ evidence room
⟦BG|bg_c04s02|Hunters’ evidence room · Cassian⟧
⟦TIME|Day 2 · November 8 20:40⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
旁白：The evidence-room checkout clock matches the museum handover time.
旁白：The draft targets a clock attachment; the revision targets its host.
卡西安：“I acted without comparing the two versions.”
旁白：A blood-oath seal on the revision covers the issuer’s signature.
卡西安：“You need not forgive me. Both versions are yours to examine.”
⟦SET|c04clue_seen⟧
旁白：Copies of the order are mixed among old envelopes; locate the one with a double seal.
⟦MG|g_find_clue⟧
⟦IF|mg_find_clue_win⟧
旁白：The double-sealed copy is identified first and logged with the original.
⟦ELSE⟧
旁白：The custodian compares the catalog item by item and finds the same copy a little later.
⟦/IF⟧
# CHOICE｜How should the hunter’s warning be checked without leaving you exposed?
#### A｜Hear Cassian’s testimony and compare the draft
旁白：Cassian’s testimony and the draft are recorded independently, with uncertainties marked.
⟦OPT|A|set:c04approach_a⟧
#### B｜Require him to surrender his weapon before proceeding
旁白：The silver blade is sealed in the evidence locker; he keeps only the archive key.
⟦OPT|B|set:c04approach_b⟧
#### C｜Ask Lucien to witness the verification
旁白：Lucien is invited to witness; the original seal stays intact until he arrives.
⟦OPT|C|set:c04approach_c⟧
# ·
旁白：The adjacent verification room has an independent camera for preserving both versions.

# SCENE｜Hunters’ verification room
⟦BG|bg_c04s03|Hunters’ verification room · Lucien、Cassian⟧
⟦TIME|Day 2 · November 8 21:10⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
⟦IF|c04approach_a⟧
旁白：The separate testimony reaches the revision time without filling memory gaps as facts.
⟦/IF⟧
⟦IF|c04approach_b⟧
旁白：The blade remains in the locker; verification uses only paper and cameras.
⟦/IF⟧
⟦IF|c04approach_c⟧
旁白：The witness invitation limits Lucien to checking originals, not declaring a verdict alone.
⟦/IF⟧
旁白：The verification-room door stays open as Lucien places the museum copy on the desk.
卢西恩：“The seal comes from the council. The signature is not yet confirmed.”
卡西安：“Then we keep checking. We do not invent a name for a blank.”
旁白：Both orders use the same paper fibers, but the ink was applied across two sealing events.
旁白：Metal scraping sounds from the far end of the corridor.
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：The evidence-room alarm lights up; the evacuation door is at the corridor’s end.

# SCENE｜Headquarters evacuation corridor
⟦BG|bg_c04s04|Headquarters evacuation corridor · Lucien、Rowan、Cassian⟧
⟦TIME|Day 2 · November 8 21:20⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
旁白：A spectral hound strikes the fire door; its edge cuts Cassian’s forearm.
⟦SFX|m111_door⟧
⟦FX|shake⟧
旁白：Lucien braces the bolt. Rowan, called from emergency duty, reaches the entrance.
罗文：“The exit is usable. The evidence pouch is on the desk; I have the stretcher.”
卡西安：“Do not let my injury make the decision for you.”
旁白：The bolt begins to bend; the emergency exit remains lit.
# CHOICE｜The bolt will not hold much longer. How should rescue and evidence be handled?
#### A｜Help transfer Cassian while Lucien carries the evidence
旁白：Rowan stabilizes the arm; Cassian reaches the stretcher while Lucien carries the sealed ledger.
旁白：On the evacuation sheet, a hospital street address begins to fade.
⟦OPT|A|set:c04route_a⟧
#### B｜Secure the ledger while Rowan treats the injured
旁白：The sealed ledger reaches the exit; Rowan and Lucien transfer Cassian behind it.
旁白：A street name fades in the ledger, matching a gap in the hospital map.
⟦OPT|B|set:c04route_b⟧
#### C｜Let Rowan direct the rescue while you check the evacuation list
旁白：Rowan takes charge of the stretcher; Lucien secures the evidence to the evacuation cart.
旁白：During the headcount, the hospital’s street disappears from the digital map.
⟦OPT|C|set:c04route_c⟧
# ·

# CHAPTER 5｜THE CITY THAT FORGETS
⟦GOAL|证明居民记录遭到抹除，安排可执行的救援|Prove residents are being erased and arrange a practical rescue⟧
⟦DONE|flag|c05clue_seen|Verify key evidence|旁白：It is stored outside the boundary and carried back by custodians. Time does not reverse everywhere.⟧
⟦DONE|say|Check missing records, propose a memory anchor, or allocate rescue resources|State an intention|旁白：The evidence is preserved; your wishes for the next step still need to be heard.⟧

# SCENE｜Hospital street entrance
⟦BG|bg_c05s01|Hospital street entrance · Rowan⟧
⟦TIME|Day 3 · November 9 08:00⟧
⟦FX|none⟧
⟦BGM|m111_rescue⟧
⟦IF|c04route_a⟧
旁白：The stretcher handover preserves Cassian’s condition and Lucien’s evidence receipt.
⟦/IF⟧
⟦IF|c04route_b⟧
旁白：The ledger reaches the safe first; the medical sheet records the injured arriving safely afterward.
⟦/IF⟧
⟦IF|c04route_c⟧
旁白：Rowan’s evacuation list is complete, with independent receipts for the injured and the evidence.
⟦/IF⟧
旁白：By morning the hospital street sign remains, but the map is blank.
旁白：Rowan’s paper handover sheet retains forty-seven names.
罗文：“None of them remain in the electronic records.”
旁白：The duty light is still on inside. Calls for help come from the corridor.
罗文：“The people are still here. We need their records to stay, too.”
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：Mara brings offline records to the temporary archive desk beside the hospital.

# SCENE｜Temporary offline archive
⟦BG|bg_c05s02|Temporary offline archive · Mara⟧
⟦TIME|Day 3 · November 9 08:30⟧
⟦FX|none⟧
⟦BGM|m111_rescue⟧
旁白：Mara lays out the Ember Archive preserved across ninety-nine cycles.
玛拉：“It is stored outside the boundary and carried back by custodians. Time does not reverse everywhere.”
旁白：A few names fade after each reset, though the paper edges remain intact.
玛拉：“We can verify gaps with independent records, not someone’s confidence in their memory.”
旁白：The hospital announcement reports a power failure on the ground floor.
⟦SET|c05clue_seen⟧
旁白：The street map is in pieces; the original coordinates remain in the registry on its back.
⟦MG|g_slide_map⟧
⟦IF|mg_slide_map_win⟧
旁白：The map is assembled promptly, giving the team a clear exit copy.
⟦ELSE⟧
旁白：Mara supplies the exit coordinates from the register; the route remains usable.
⟦/IF⟧
# CHOICE｜Which evidence should establish this erasure first?
#### A｜Check the ward’s patient roster
旁白：Rowan checks paper wristbands by bed number; the count matches the handover sheet.
⟦OPT|A|set:c05approach_a⟧
#### B｜Survey the physical boundary of the missing street
旁白：The street survey preserves the hospital’s physical coordinates despite the blank map.
⟦OPT|B|set:c05approach_b⟧
#### C｜Compare Mara’s offline copies
旁白：Mara compares offline copies page by page and identifies the first seven names to disappear.
⟦OPT|C|set:c05approach_c⟧
# ·
旁白：Verification materials can go to the ward, street survey point, or offline backup desk.

# SCENE｜Hospital ground-floor evacuation hall
⟦BG|bg_c05s03|Hospital ground-floor evacuation hall · Lucien、Rowan、Cassian⟧
⟦TIME|Day 3 · November 9 09:10⟧
⟦FX|none⟧
⟦BGM|m111_rescue⟧
⟦IF|c05approach_a⟧
旁白：Ward verification yields forty-seven paper wristbands; evacuation proceeds by bed number.
⟦/IF⟧
⟦IF|c05approach_b⟧
旁白：The physical survey gives the team a real exit, preventing the blank map from misdirecting evacuation.
⟦/IF⟧
⟦IF|c05approach_c⟧
旁白：Offline copies restore seven names first, then match them to bed numbers.
⟦/IF⟧
旁白：The three men reach the ground floor with the verification material as old brickwork shows through the walls.
⟦SFX|m111_alarm⟧
⟦FX|glitch⟧
罗文：“The door can hold for six minutes. The stairs lead to the outdoor triage area.”
旁白：Cassian braces the ramp with his uninjured hand; Lucien opens the side door.
旁白：A paper roster is placed on the record cabinet. The silver mark lights up nearby.
罗文：“Your life is not powering this. The names are responding.”
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：Evacuation continues, leaving a safe verification station beside the cabinet.

# SCENE｜Hospital temporary triage area
⟦BG|bg_c05s04|Hospital temporary triage area · Lucien、Rowan、Mara⟧
⟦TIME|Day 3 · November 9 09:40⟧
⟦FX|none⟧
⟦BGM|m111_rescue⟧
旁白：The patients reach temporary triage; some electronic records return.
玛拉：“Independent records matched with personal names form a memory anchor.”
罗文：“Ana Morales. She still remembers that she loves astronomy.”
卢西恩：“No one died for this restoration. Preserve the procedure.”
旁白：Triage needs three teams: identity verification, power, and transport.
# CHOICE｜With triage stable, which safeguard should be strengthened first?
#### A｜Restore patient identities and family contacts first
旁白：The identity desk opens first; duty teams continue power and transport work.
旁白：A signature shared by the missing records needs three separate accounts.
⟦OPT|A|set:c05route_a⟧
#### B｜Stabilize the backup power first
旁白：Backup power is connected first while paper identification and transport continue.
旁白：The power log shows the same signature across three lockdown orders.
⟦OPT|B|set:c05route_b⟧
#### C｜Transfer children and patients needing continuous care first
旁白：High-dependency patients are transferred first; duty teams maintain the wards and identification.
旁白：The transport vehicle returns with three conflicting death-witness records.
⟦OPT|C|set:c05route_c⟧
# ·

# CHAPTER 6｜THREE MEN, THREE TRUTHS
⟦GOAL|核对三份证词，并约定新的责任边界|Compare three accounts and agree on new responsibilities⟧
⟦DONE|flag|c06clue_seen|Verify key evidence|旁白：In cycle fifty-four, I locked you inside, thinking it would keep you from the rooftop.⟧
⟦DONE|say|Question conflicting testimony, set boundaries, or assign verification tasks|State an intention|旁白：The evidence is preserved; your wishes for the next step still need to be heard.⟧

# SCENE｜Apartment common sitting room
⟦BG|bg_c06s01|Apartment common sitting room · Lucien、Rowan、Cassian⟧
⟦TIME|Day 3 · November 9 14:00⟧
⟦FX|none⟧
⟦BGM|m111_confession⟧
⟦IF|c05route_a⟧
旁白：The family-contact sheet is completed first, linking three accounts through the missing names.
⟦/IF⟧
⟦IF|c05route_b⟧
旁白：Backup power preserves a continuous log, letting all three accounts be checked against one timeline.
⟦/IF⟧
⟦IF|c05route_c⟧
旁白：Transfer forms retain patients’ own accounts; the three men’s memories are no longer the only sources.
⟦/IF⟧
旁白：That afternoon, three files are laid out separately in the apartment’s common room.
卢西恩：“I remember the midnight bell and her breath stopping in my arms.”
罗文：“I dreamed of a heartbeat returning. The dream had no date.”
卡西安：“My fragment contains a mask. I cannot prove who wore it.”
旁白：The three files stay side by side; their contradictions remain visible.
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：Lucien stays in the sitting room while the others retrieve their original records.

# SCENE｜Apartment study
⟦BG|bg_c06s02|Apartment study · Lucien⟧
⟦TIME|Day 3 · November 9 14:30⟧
⟦FX|none⟧
⟦BGM|m111_confession⟧
旁白：The study door is open. Lucien places an old key on the desk.
卢西恩：“In cycle fifty-four, I locked you inside, thinking it would keep you from the rooftop.”
卢西恩：“Two blocks were erased. The death still happened.”
卢西恩：“That was control, not protection. Fear does not excuse it.”
旁白：The full record lies beside the key. No one blocks the doorway.
⟦SET|c06clue_seen⟧
# CHOICE｜How should the conflicting accounts be checked without contaminating one another?
#### A｜Record them separately before comparing
旁白：The accounts are sealed separately, retaining their sequence and uncertainties.
⟦OPT|A|set:c06approach_a⟧
#### B｜Compare them together and challenge unsupported claims
旁白：The public comparison lists agreements and conflicts without using majority vote as proof.
⟦OPT|B|set:c06approach_b⟧
#### C｜Ask Mara to establish independent custody
旁白：Mara takes custody of originals; revisions to their copies require a version trail.
⟦OPT|C|set:c06approach_c⟧
# ·
旁白：The accounts can be sealed separately or compared at the public verification desk.

# SCENE｜Hospital staff rest room
⟦BG|bg_c06s03|Hospital staff rest room · Rowan⟧
⟦TIME|Day 3 · November 9 17:00⟧
⟦FX|none⟧
⟦BGM|m111_confession⟧
⟦IF|c06approach_a⟧
旁白：Rowan’s original account is sealed separately; the comparison retains unresolved conflicts.
⟦/IF⟧
⟦IF|c06approach_b⟧
旁白：After joint review, agreements and conflicts are printed separately instead of becoming a single script.
⟦/IF⟧
⟦IF|c06approach_c⟧
旁白：Mara’s receipt stays with the original account; Rowan revises only his supplementary page.
⟦/IF⟧
旁白：After the evening handover, Rowan brings the paper lockdown order from cycle ninety-seven.
罗文：“I kept anomalous patients inside, believing a locked door would protect everyone else.”
罗文：“The breach spread. I cannot call fear a medical judgment.”
旁白：The revised plan puts patient consent and independent review before transfers.
罗文：“This time, we listen to the people affected before deciding how to help.”
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：Cassian waits in the public meeting room downstairs with the original orders.

# SCENE｜Hospital public meeting room
⟦BG|bg_c06s04|Hospital public meeting room · Lucien、Rowan、Cassian⟧
⟦TIME|Day 3 · November 9 18:00⟧
⟦FX|none⟧
⟦BGM|m111_confession⟧
旁白：In the public meeting room, Cassian secures the blood-oath order beneath a clear sheet.
卡西安：“I carried out an order without checking who would be harmed.”
卡西安：“No more orders of uncertain origin. If evidence is missing, we stop.”
旁白：Lucien provides the custody list; Rowan provides the original lockdown order.
旁白：All three trails lead to the council’s preparatory ceremony tomorrow night.
# CHOICE｜Who should lead which line of the council investigation?
#### A｜Assign Lucien to verify council access and custody
旁白：Lucien takes the access records without signing any ceremony consent for you.
旁白：He finds the pre-filled designation “hundredth bride” in the guest register.
⟦OPT|A|set:c06route_a⟧
#### B｜Work with Rowan to check the ceremony’s medical risks
旁白：Rowan submits the risk review to an independent duty team and preserves the right to leave.
旁白：The ceremony form has no medical withdrawal field, only a pre-filled crowning time.
⟦OPT|B|set:c06route_b⟧
#### C｜Assign Cassian to scout the guards and exit routes
旁白：Cassian provides the guard schedule and two unarmed evacuation routes.
旁白：Both routes have been redirected toward the council ceremony hall.
⟦OPT|C|set:c06route_c⟧
# ·

# CHAPTER 7｜THE HUNDREDTH BRIDE
⟦GOAL|识破预备仪式的强制条款，保全原始录像|Expose coercion in the preparatory ceremony and preserve the original recording⟧
⟦DONE|flag|c07clue_seen|Verify key evidence|旁白：Guests recite cycle numbers; no one explains the missing residents.⟧
⟦DONE|say|Challenge pre-filled consent, request records, or propose a non-coercive investigation|State an intention|旁白：The evidence is preserved; your wishes for the next step still need to be heard.⟧

# SCENE｜Council reception foyer
⟦BG|bg_c07s01|Council reception foyer · Evelyn⟧
⟦TIME|Day 4 · November 10 18:00⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
⟦IF|c06route_a⟧
旁白：Lucien’s access review shows attendance and ceremony consent use different reference codes.
⟦/IF⟧
⟦IF|c06route_b⟧
旁白：Rowan’s risk report establishes that a form without withdrawal cannot establish voluntary consent.
⟦/IF⟧
⟦IF|c06route_c⟧
旁白：Cassian gives the exit map to an independent lead, preventing the council from controlling the only way out.
⟦/IF⟧
旁白：The following evening, the preparatory ceremony’s review begins in the reception foyer.
旁白：Evelyn slides a black invitation with a pre-filled designation to the table’s edge.
伊芙琳：“On the seventh day, you will wear the crown as the hundredth bride.”
旁白：The signature field is blank. The crown remains locked in glass.
伊芙琳：“You may inspect the records before stating your terms.”
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：The review invitation permits access to the ballroom edge, not consent to a ceremony.

# SCENE｜Council ballroom anteroom
⟦BG|bg_c07s02|Council ballroom anteroom · Lucien、Evelyn⟧
⟦TIME|Day 4 · November 10 18:30⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
旁白：The anteroom overlooks the ballroom, separated from the crowning seat by a door.
旁白：Guests recite cycle numbers; no one explains the missing residents.
卢西恩：“Your entry record is not consent to wear the crown.”
伊芙琳：“The original records are in the red archive. Access must be registered.”
旁白：Public review, confidential review, and written retrieval each have a separate reference code.
⟦SET|c07clue_seen⟧
旁白：Access seals need matching to their registrations so copies cannot be mistaken for ceremony invitations.
⟦MG|g_mem_gala⟧
⟦IF|mg_mem_gala_win⟧
旁白：The seals are matched to their entries; the review copy arrives promptly.
⟦ELSE⟧
旁白：The custodian checks each paper entry and delivers the copy shortly afterward.
⟦/IF⟧
# CHOICE｜How should the archive be accessed without implying acceptance of the ceremony?
#### A｜Enter openly as an investigator
旁白：Investigator status is entered in the guest register; crowning consent stays blank.
⟦OPT|A|set:c07approach_a⟧
#### B｜Use confidential reviewer access away from gala guests
旁白：Mara’s confidential review permit replaces the gala pass without adding a guest entry.
⟦OPT|B|set:c07approach_b⟧
#### C｜Decline the gala and demand written retrieval of records
旁白：The refusal is filed; a custodian brings the recording to the independent review desk.
⟦OPT|C|set:c07approach_c⟧
# ·
旁白：The red archive’s custody procedure awaits confirmation.

# SCENE｜Red archive verification desk
⟦BG|bg_c07s03|Red archive verification desk · Lucien、Evelyn⟧
⟦TIME|Day 4 · November 10 19:00⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
⟦IF|c07approach_a⟧
旁白：The public investigator code remains at the desk; a guest designation has not replaced authorization.
⟦/IF⟧
⟦IF|c07approach_b⟧
旁白：The confidential review code belongs to an independent custodian; gala guests cannot access personal files.
⟦/IF⟧
⟦IF|c07approach_c⟧
旁白：The retrieval receipt and refusal are filed together; the same authenticated copy serves inside and outside review.
⟦/IF⟧
旁白：The original recording is unsealed at the desk; projector light washes over the red walls.
⟦SFX|m111_paper⟧
旁白：The first cycle began with this month’s emergency ceremony during the city epidemic.
旁白：In the recording, the activation addendum authorizes only one limited reversal.
卢西恩：“I joined later. I had never seen this original addendum.”
旁白：In the continuation, the epidemic is resolved, but the clock is not shut down as agreed.
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：The recording’s checksum links to the shutdown order in the adjacent hearing room.

# SCENE｜Council hearing room
⟦BG|bg_c07s04|Council hearing room · Evelyn⟧
⟦TIME|Day 4 · November 10 19:30⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
旁白：The shutdown order lies beneath a power-renewal form. Its execution field is unsigned.
伊芙琳：“After shutdown, I cannot guarantee everyone will keep obeying.”
旁白：She does not deny changing the validation clauses.
伊芙琳：“If you take copies, leave a complete handover record.”
旁白：Three copy-preservation routes meet at the public reception hall.
# CHOICE｜How should the recording and shutdown order leave council custody?
#### A｜Ask Lucien to cover the copy handover as a publicly registered dance partner
旁白：The handover is publicly registered at the gala desk; physical contact still requires separate consent.
旁白：A cycle-thirty-seven pouch in the copy requires Lucien to verify its provenance.
⟦OPT|A|set:c07route_a⟧
#### B｜Ask Cassian to verify escort and exit routes
旁白：Cassian checks the escort list and takes the copies through the unarmed corridor.
旁白：The escort sheet separates a resurrection record from cycle thirty-seven.
⟦OPT|B|set:c07route_b⟧
#### C｜Use Mara’s independent archive custody procedure
旁白：Mara’s receipt is countersigned, ending the council’s exclusive custody of the copies.
旁白：The new receipt links to a resurrection record from cycle thirty-seven.
⟦OPT|C|set:c07route_c⟧
# ·

# CHAPTER 8｜THE NIGHT LUCIEN DIED
⟦GOAL|核实第37次循环的复活，并确定风险边界|Verify the resurrection in cycle thirty-seven and set risk boundaries⟧
⟦DONE|flag|c08clue_seen|Verify key evidence|旁白：Strength did not keep me alive. It kept restarting me.⟧
⟦DONE|say|Ask about the resurrection record, state boundaries, or propose nonlethal research|State an intention|旁白：The evidence is preserved; your wishes for the next step still need to be heard.⟧

# SCENE｜Museum mirror-fragment vault
⟦BG|bg_c08s01|Museum mirror-fragment vault · Lucien⟧
⟦TIME|Day 5 · November 11 09:00⟧
⟦FX|none⟧
⟦BGM|m111_tender⟧
⟦IF|c07route_a⟧
旁白：The public handover time matches the cycle-thirty-seven receipt without entering a gala designation as a private relationship.
⟦/IF⟧
⟦IF|c07route_b⟧
旁白：Cassian’s escort check finds the separated resurrection record and confirms the pouch was not switched.
⟦/IF⟧
⟦IF|c07route_c⟧
旁白：Mara’s custody chain is complete; the cycle-thirty-seven pouch leaves exclusive council control for the first time.
⟦/IF⟧
旁白：The next morning, the cycle-thirty-seven pouch is opened in the museum vault.
旁白：The mirror shows only Lucien standing in the path of the clock fragments.
旁白：The record states: life signs ceased at 23:58; present again after reset.
卢西恩：“I died that time. The reset brought me back without taking the memory.”
旁白：At the bottom of the pouch lies a ring threaded with the clock’s pattern.
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：The ring and resurrection record are transferred to the adjacent examination room.

# SCENE｜Museum isolation examination room
⟦BG|bg_c08s02|Museum isolation examination room · Lucien⟧
⟦TIME|Day 5 · November 11 09:30⟧
⟦FX|none⟧
⟦BGM|m111_tender⟧
旁白：Under glass, the ring pulses in time with the clock signal.
卢西恩：“Strength did not keep me alive. It kept restarting me.”
卢西恩：“Immortality is not the same as living.”
旁白：He shifts the chair aside, leaving a route that does not require approaching him.
卢西恩：“You may care, or we can discuss only how to end the binding.”
⟦SET|c08clue_seen⟧
# CHOICE｜After hearing his account, how would you like this conversation to continue?
#### A｜Offer care without making a romantic commitment
旁白：Lucien leaves the resurrection record without asking for touch or commitment.
⟦OPT|A|set:c08approach_a⟧
#### B｜Ask him to release control and accept shared verification
旁白：Custody passes to a shared sign-in desk; Lucien no longer holds the only key.
⟦OPT|B|set:c08approach_b⟧
#### C｜Ask for space and resume later
旁白：Lucien moves behind the partition, leaving the records for private review.
⟦OPT|C|set:c08approach_c⟧
# ·
旁白：The examination files can remain on either side of the glass; no contact is necessary.

# SCENE｜Museum conservation workshop
⟦BG|bg_c08s03|Museum conservation workshop · Lucien⟧
⟦TIME|Day 5 · November 11 11:00⟧
⟦FX|none⟧
⟦BGM|m111_tender⟧
⟦IF|c08approach_a⟧
旁白：Care has not been logged as a debt; Lucien provides the complete examination record as agreed.
⟦/IF⟧
⟦IF|c08approach_b⟧
旁白：The shared key is at the custody desk; Lucien no longer handles the core fragment alone.
⟦/IF⟧
⟦IF|c08approach_c⟧
旁白：Time for private review is preserved; workshop files can be transferred without close contact.
⟦/IF⟧
旁白：In the workshop, the core fragment remains sealed in a protective tray.
卢西恩：“Before, I would have taken it away myself. Not this time.”
旁白：He unfolds the risk sheet and leaves the tools where they are.
卢西恩：“I need help. You are not obliged to bear the risk for me.”
旁白：The test suggests unbinding need not cause death, but independent review is still required.
旁白：A separated pattern copy beside the tray can be reassembled to check the binding interface.
⟦MG|g_slide_sigil⟧
⟦IF|mg_slide_sigil_win⟧
旁白：The pattern aligns promptly; its interface code matches the test record.
⟦ELSE⟧
旁白：A conservator checks the interface against the original drawing; research continues.
⟦/IF⟧
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：Mara arranges independent reviewers in the risk conference room downstairs.

# SCENE｜Museum risk conference room
⟦BG|bg_c08s04|Museum risk conference room · Lucien、Rowan、Cassian、Mara⟧
⟦TIME|Day 5 · November 11 14:00⟧
⟦FX|none⟧
⟦BGM|m111_tender⟧
旁白：Mara separates the binding, dreams, and blood oath into three restrictions to resolve.
玛拉：“Ending them may cost power or some memories. Consent cannot be signed by someone else.”
罗文：“The risks need review, and medical support must be present.”
卡西安：“I sign for myself, not for anyone else.”
旁白：The original pact’s missing-page index appears again on the back of the risk sheet.
# CHOICE｜What must be done before attempting to unbind the clock?
#### A｜Verify a nonlethal unbinding method first
旁白：The nonlethal method enters independent review and will not be used unverified.
旁白：The review identifies the missing page as the source of the original revocation conditions.
⟦OPT|A|set:c08route_a⟧
#### B｜Obtain each ally’s consent to their own risk
旁白：Each person’s consent is recorded separately and may be withdrawn before implementation.
旁白：The signed forms still lack the original revocation conditions. The page must be found.
⟦OPT|B|set:c08route_b⟧
#### C｜Delay the decision until the missing-page evidence is complete
旁白：Implementation is deferred while the collected risk evidence remains open.
旁白：The index points to an uncut backup of the first-cycle ceremony.
⟦OPT|C|set:c08route_c⟧
# ·

# CHAPTER 9｜THE BETRAYAL OF THE FIRST SELF
⟦GOAL|找回撤销末页，揭穿献祭检验|Recover the revocation page and expose the sacrificial validation⟧
⟦DONE|flag|c09clue_seen|Verify key evidence|旁白：Revocation belongs to the current operator. An old promise cannot sign for them.⟧
⟦DONE|say|Check the original revocation terms, reject sacrifice, or question who benefits|State an intention|旁白：The evidence is preserved; your wishes for the next step still need to be heard.⟧

# SCENE｜Archive private screening room
⟦BG|bg_c09s01|Archive private screening room · viewer alone⟧
⟦TIME|Day 6 · November 12 09:00⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
⟦IF|c08route_a⟧
旁白：The nonlethal review identifies the missing original terms as more important than any personal assurance.
⟦/IF⟧
⟦IF|c08route_b⟧
旁白：Individual risk consents remain separate; the uncut recording cannot decide for them.
⟦/IF⟧
⟦IF|c08route_c⟧
旁白：The deferral remains valid; screening completes evidence without automatically approving action.
⟦/IF⟧
旁白：After overnight verification, the uncut backup reaches the private screening room.
旁白：In the first-cycle recording, the signatory authorizes a single emergency reversal.
旁白：An addendum permits temporary memory suspension, then adds a right to withdraw it.
旁白：The recording cannot speak for you now or excuse whoever altered it.
旁白：The final page’s custody number recurs, pointing to the old clock’s service box.
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：Mara has requested a witnessed opening in the clock-tower vault.

# SCENE｜Clock-tower vault
⟦BG|bg_c09s02|Clock-tower vault · Mara⟧
⟦TIME|Day 6 · November 12 10:00⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
旁白：The service-box seal matches the index. Mara removes the page before the camera.
⟦SFX|m111_seal⟧
玛拉：“Revocation belongs to the current operator. An old promise cannot sign for them.”
旁白：The terms specify the original page, independent witnesses, residents’ memory anchors, and three simultaneous validations.
玛拉：“There is no sacrificial clause here.”
旁白：The stitching at the edge matches the 1894 charter exactly.
⟦SET|c09clue_seen⟧
# CHOICE｜How should the earlier signatory’s decision be separated from responsibility now?
#### A｜Reject guilt imposed without present consent
旁白：The review separates present revocation rights from earlier liability; personal freedom is not collateral.
⟦OPT|A|set:c09approach_a⟧
#### B｜Acknowledge the rescue intention while demanding repair of later harm
旁白：Rescue achievements and repeated harm are recorded separately; intention does not cancel consequences.
⟦OPT|B|set:c09approach_b⟧
#### C｜Demand the full history of every alteration
旁白：Every revision is preserved; the council cannot publish only a favorable page.
⟦OPT|C|set:c09approach_c⟧
# ·
旁白：A certified copy goes to the council hearing room; the original remains in independent custody.

# SCENE｜Council inquiry room
⟦BG|bg_c09s03|Council inquiry room · Evelyn⟧
⟦TIME|Day 6 · November 12 14:00⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
⟦IF|c09approach_a⟧
旁白：Present revocation rights are listed separately; the earlier signatory’s record creates no new debt.
⟦/IF⟧
⟦IF|c09approach_b⟧
旁白：Rescue intentions and repeated harm appear in separate columns that Evelyn must address separately.
⟦/IF⟧
⟦IF|c09approach_c⟧
旁白：All revisions are bound into the case file, preventing selective quotation.
⟦/IF⟧
旁白：In the inquiry room, Evelyn places a crown case beside the certified copy.
伊芙琳：“Keep the loop, and you can keep those memories.”
旁白：The revocation right on the copy does not vanish with her offer.
伊芙琳：“I would rather repeat the city than lose control of it.”
旁白：Her statement is independently recorded, not registered as anyone’s consent.
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：Witness eligibility will be reviewed in the archive’s public verification hall.

# SCENE｜Archive public verification hall
⟦BG|bg_c09s04|Archive public verification hall · Lucien、Rowan、Cassian、Mara⟧
⟦TIME|Day 6 · November 12 16:00⟧
⟦FX|none⟧
⟦BGM|m111_mystery⟧
旁白：All three men’s restrictions appear on the review sheet; none can simply claim independence.
玛拉：“First release the binding, dream validation, and blood oath; then confirm voluntary participation separately.”
旁白：Mara’s outside-boundary custody receipts provide an independent witness backup.
罗文：“Rescue cannot wait. Neither can the witness procedure be skipped.”
旁白：Only one night remains before day seven. Independent custodians retain every original.
# CHOICE｜Evelyn is trying to preserve the loop. What public record should be made?
#### A｜Reject eternity in exchange for continuing the resets
旁白：The refusal rejects continued resets while preserving revocation and rescue rights.
旁白：The council still holds the three validation seals. Their handover needs witnesses.
⟦OPT|A|set:c09route_a⟧
#### B｜Withhold commitment and request written terms as evidence
旁白：The written terms are marked as evidence only, not consent; Evelyn’s signature becomes version evidence.
旁白：An annex reveals where the three validation seals are kept.
⟦OPT|B|set:c09route_b⟧
#### C｜Trace who benefits from the loop and who is responsible
旁白：Power-renewal records enter the public case file, exposing responsibility behind the anonymous council.
旁白：Authorization to borrow the seals expires at dusk on day seven.
⟦OPT|C|set:c09route_c⟧
# ·

# CHAPTER 10｜THE LAST SEVEN HOURS
⟦GOAL|完成双线救援，准备居民见证与三路校验|Complete the two rescues and prepare residents’ testimony and three-way validation⟧
⟦DONE|flag|c10clue_seen|Verify key evidence|旁白：The hospital needs continuous power. Manual ventilation can bridge a short gap.⟧
⟦DONE|say|Assign rescue duties, check memory anchors, or state present relationship boundaries|State an intention|旁白：The evidence is preserved; your wishes for the next step still need to be heard.⟧

# SCENE｜Archive emergency coordination desk
⟦BG|bg_c10s01|Archive emergency coordination desk · Mara⟧
⟦TIME|Day 7 · November 13 17:00⟧
⟦FX|none⟧
⟦BGM|m111_resolve⟧
⟦IF|c09route_a⟧
旁白：An independent custodian holds the explicit refusal; the seals are still handed over by procedure.
⟦/IF⟧
⟦IF|c09route_b⟧
旁白：Evidence-only written terms identify the storage location without becoming authorization.
⟦/IF⟧
⟦IF|c09route_c⟧
旁白：The power-renewal beneficiaries are public, with independent observers at the final loan procedure.
⟦/IF⟧
旁白：On the seventh evening, seven hours remain until midnight.
旁白：Mara entrusts originals to independent custodians and registers the loan of the three seals.
玛拉：“The seals establish provenance. They grant no authority over you.”
旁白：The hospital and south tunnel both report blocked evacuation routes.
玛拉：“Both have teams. The backup generator can reach only one first.”
旁白：The backup signal lights need a sequence check; the lead retains the paper route.
⟦MG|g_simon_lights⟧
⟦IF|mg_simon_lights_win⟧
旁白：The backup signal passes its test; the paper route remains the cross-check.
⟦ELSE⟧
旁白：The backup lights stay off; the lead uses the verified paper route instead.
⟦/IF⟧
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：Rowan and Cassian await resource allocation in the hospital dispatch room.

# SCENE｜Hospital dispatch room
⟦BG|bg_c10s02|Hospital dispatch room · Rowan、Cassian⟧
⟦TIME|Day 7 · November 13 17:30⟧
⟦FX|none⟧
⟦BGM|m111_resolve⟧
旁白：In dispatch, the patient roster and tunnel evacuation map are posted side by side.
罗文：“The hospital needs continuous power. Manual ventilation can bridge a short gap.”
卡西安：“The south tunnel needs pumping. The dry north passage works, but takes longer.”
旁白：Two independent team leaders are present. No one needs to be abandoned.
罗文：“Resource allocation is not a test of whom you love.”
⟦SET|c10clue_seen⟧
# CHOICE｜One generator, two rescue lines. How will you allocate them?
#### A｜Send the generator to the hospital and use the dry tunnel route
旁白：Continuous hospital power returns; Cassian leads staggered evacuation through the dry passage.
⟦OPT|A|set:c10approach_a⟧
#### B｜Pump the tunnel first while the hospital uses manual support
旁白：The tunnel is pumped clear; Rowan’s duty team completes the manual ventilation handover.
⟦OPT|B|set:c10approach_b⟧
#### C｜Rotate power on a schedule with named handover leads
旁白：The leads hand over power on schedule, retaining manual backup teams at both sites.
⟦OPT|C|set:c10approach_c⟧
# ·
旁白：The dispatch sheet has primary and backup steps. Both teams await clear duties.

# SCENE｜Hospital rooftop rest area
⟦BG|bg_c10s03|Hospital rooftop rest area · Lucien、Rowan、Cassian⟧
⟦TIME|Day 7 · November 13 20:00⟧
⟦FX|none⟧
⟦BGM|m111_resolve⟧
⟦IF|c10approach_a⟧
旁白：Hospital power is stable; the dry-passage team delivers the last residents to the north exit.
⟦/IF⟧
⟦IF|c10approach_b⟧
旁白：The tunnel is drained; the hospital’s manual-support handover accounts for everyone.
⟦/IF⟧
⟦IF|c10approach_c⟧
旁白：Both scheduled power-handover sheets match, with backup teams maintaining care.
⟦/IF⟧
旁白：At eight, both teams report people safe; separate handover sheets are signed.
卢西恩：“I love you now, not only the fragments I remember.”
罗文：“I want a future. You do not owe me that future.”
卡西安：“Even if you walk alone, I will still stand against that clock.”
旁白：None demands an answer. They leave the rest-area exit clear.
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：Mara brings news: the last seal has been damaged at the public registry.

# SCENE｜Residents’ public registry
⟦BG|bg_c10s04|Residents’ public registry · Lucien、Rowan、Cassian、Mara⟧
⟦TIME|Day 7 · November 13 21:30⟧
⟦FX|none⟧
⟦BGM|m111_resolve⟧
旁白：The seal lies in two pieces; the security recording preserves Evelyn breaking it.
⟦SFX|m111_seal⟧
玛拉：“We verified it on day three: names matched with independent records can form an alternative anchor.”
旁白：Residents’ paper statements are checked individually; unconfirmed records are kept separate.
旁白：Collective testimony replaces the damaged seal’s function. No life is demanded.
玛拉：“You may still state your boundaries before the tower. Rescue will not be withdrawn for your answer.”
# CHOICE｜After hearing their feelings, how would you like to approach the final operation together?
#### A｜Express feelings for someone while keeping operational consent separate
旁白：Relationship wishes are not entered as operational consent; each risk consent remains separate.
旁白：The Tower of Eternal Night opens its final evidence handover.
⟦OPT|A|set:c10route_a⟧
#### B｜Set romance aside and cooperate as allies
旁白：The men leave relationship discussions until safety is secured; rescue duties remain unchanged.
旁白：The independent custodian arrives at the tower door with the original final page.
⟦OPT|B|set:c10route_b⟧
#### C｜Request private space and proceed only by agreed responsibilities
旁白：The team stops personal questioning and retains the exit route and independent witnesses.
旁白：The tower’s final signal lights up as the validation deadline approaches.
⟦OPT|C|set:c10route_c⟧
# ·

# CHAPTER 11｜BREAK THE CLOCK
⟦GOAL|在不献祭任何人的前提下完成三路撤销校验|Complete three-way revocation without sacrificing anyone⟧
⟦DONE|flag|c11clue_seen|Verify key evidence|旁白：The three restrictions enter verified release preparation; the core is not yet activated.⟧
⟦DONE|say|Confirm revocation terms, specify witnesses, or propose a nonlethal validation plan|State an intention|旁白：The evidence is preserved; your wishes for the next step still need to be heard.⟧

# SCENE｜Tower entrance hall
⟦BG|bg_c11s01|Tower entrance hall · Evelyn⟧
⟦TIME|Day 7 · November 13 23:00⟧
⟦FX|none⟧
⟦BGM|m111_resolve⟧
⟦IF|c10route_a⟧
旁白：Relationship wishes and risk consent are filed separately; only the latter enters the tower procedure.
⟦/IF⟧
⟦IF|c10route_b⟧
旁白：The alliance record names no partner in advance; each tower duty still needs personal confirmation.
⟦/IF⟧
⟦IF|c10route_c⟧
旁白：The agreement for personal space remains valid; entering the tower restores no right to personal interrogation.
⟦/IF⟧
旁白：One hour before midnight, the independent custodian completes the original-document handover at the tower door.
旁白：Evelyn stands in the entrance hall as ninety-nine termination numbers flicker in projection.
伊芙琳：“After revocation, the city will no longer answer to me.”
旁白：The original final page and altered version lie at opposite ends of a glass table.
伊芙琳：“You can still stop.”
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：The page is authenticated. The witnesses move to the outer-ring validation desk.

# SCENE｜Core outer-ring validation desk
⟦BG|bg_c11s02|Core outer-ring validation desk · Lucien、Rowan、Cassian、Mara⟧
⟦TIME|Day 7 · November 13 23:15⟧
⟦FX|none⟧
⟦BGM|m111_resolve⟧
旁白：Mara states the scope of authentication without declaring revocation on your behalf.
旁白：The three restrictions enter verified release preparation; the core is not yet activated.
卢西恩：“I consent to release my binding.”
罗文：“I confirm my own risk. It will not be transferred to someone else.”
卡西安：“The blood oath cannot replace consent today.”
⟦SET|c11clue_seen⟧
# CHOICE｜Before the core starts, which procedure should secure revocation first?
#### A｜Request revocation under the original terms and verify each clause
旁白：Original revocation conditions are logged clause by clause; the altered version is isolated as evidence.
⟦OPT|A|set:c11approach_a⟧
#### B｜Secure witness protection and exits first
旁白：Witness protection and medical support take position; withdrawal will not be treated as breach.
⟦OPT|B|set:c11approach_b⟧
#### C｜Publicly challenge Evelyn’s alterations
旁白：Revision records and Evelyn’s statement enter the public case file, preventing secret replacement.
⟦OPT|C|set:c11approach_c⟧
# ·
旁白：Authentication, protection, or public challenge may lead, but none can omit the original terms.

# SCENE｜Core safety enclosure
⟦BG|bg_c11s03|Core safety enclosure · Lucien、Rowan、Cassian⟧
⟦TIME|Day 7 · November 13 23:35⟧
⟦FX|none⟧
⟦BGM|m111_resolve⟧
⟦IF|c11approach_a⟧
旁白：Original-term authentication is complete, but the screen’s sacrificial test comes from another version.
⟦/IF⟧
⟦IF|c11approach_b⟧
旁白：The exit and medical support are ready, but the screen still shows a test absent from the original.
⟦/IF⟧
⟦IF|c11approach_c⟧
旁白：The public file fixes the revision time; the isolation screen’s version cannot pass as the original.
⟦/IF⟧
旁白：A red sacrificial test lights up on the isolation panel, contradicting the original page.
⟦SFX|m111_alarm⟧
旁白：Comparison with the certified copy removes the forged double check from execution.
卢西恩：“We release control of time, not anyone’s life.”
罗文：“All three channels are ready, with medical backup.”
卡西安：“We execute together after your plan is confirmed.”
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：The midnight synchronization window opens only at the core desk. The exit remains usable.

# SCENE｜Core synchronization desk
⟦BG|bg_c11s04|Core synchronization desk · Lucien、Rowan、Cassian、Mara、Evelyn⟧
⟦TIME|Day 7 · November 13 23:58⟧
⟦FX|none⟧
⟦BGM|m111_resolve⟧
旁白：At 23:58, the original page, residents’ anchors, and independent eligibility checks are in place.
玛拉：“Three-way synchronization is essential. We can reorder checks, not transfer a cost in lives.”
旁白：Lucien’s binding, Rowan’s dream validation, and Cassian’s blood oath await release.
伊芙琳：“Without a keeper, what will tomorrow be?”
旁白：The hands are still moving. The system has not signed the decision for you.
# CHOICE｜With the evidence complete, which safety procedure should guide synchronized revocation?
#### A｜Distribute responsibilities and release together after independent confirmations
旁白：Each man confirms his own risk; Mara checks the original terms while residents’ testimony continues.
旁白：At midnight, all three channels release together. The next minute brings no reset.
旁白：At 00:01, the time signal outside announces November 14 for the first time.
⟦OPT|A|set:c11route_a⟧
#### B｜Publicly lock out the forged rule before simultaneous release
旁白：The forged test version is locked into the public case file; the original channels and residents’ anchors are checked again.
旁白：At midnight, all three channels release together. The red test behind the glass goes dark.
旁白：At 00:01, the independent record preserves one uninterrupted minute.
⟦OPT|B|set:c11route_b⟧
#### C｜Confirm residents’ collective testimony before three-way release
旁白：Residents confirm their own statements; Mara verifies the terms and each man confirms his risk.
旁白：At midnight, all three channels release together. The city’s names do not fade again.
旁白：At 00:01, the broadcast announces the date that had never arrived.
⟦OPT|C|set:c11route_c⟧
# ·

# CHAPTER 12｜THE FIRST TOMORROW
⟦GOAL|确认重置结束，自主决定未来的关系与生活|Confirm the reset has ended and choose relationships and life freely⟧
⟦DONE|flag|c12clue_seen|Verify key evidence|旁白：If you wish, we can begin again with a first date.⟧
⟦DONE|say|State whom to be with, choose independence, or explicitly defer romance|State an intention|旁白：The evidence is preserved; your wishes for the next step still need to be heard.⟧

# SCENE｜Hospital morning observation terrace
⟦BG|bg_c12s01|Hospital morning observation terrace · Lucien、Rowan、Cassian⟧
⟦TIME|November 14 07:00 · after the loop⟧
⟦FX|none⟧
⟦BGM|m111_tomorrow⟧
⟦IF|c11route_a⟧
旁白：The distributed-operation log continues into the morning, retaining every independent consent.
⟦/IF⟧
⟦IF|c11route_b⟧
旁白：The public version of the forged rule is preserved; a third party verifies today’s uninterrupted date.
⟦/IF⟧
⟦IF|c11route_c⟧
旁白：Residents’ collective testimony continues; today’s names have not been overwritten by the new date.
⟦/IF⟧
旁白：At seven on November 14, the hospital record remains continuous with the night before.
⟦SFX|m111_release⟧
旁白：The silver wrist mark fades. The residents’ roster remains in place.
卢西恩：“I can feel the warmth of the sun.”
罗文：“Your vital signs are stable. We will check again, not rely on one moment.”
卡西安：“I checked twice. The clock did not restart.”
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：Morning restoration registration opens in the museum’s public lounge.

# SCENE｜Museum public lounge
⟦BG|bg_c12s02|Museum public lounge · Lucien、Rowan、Cassian⟧
⟦TIME|November 14 09:20⟧
⟦FX|none⟧
⟦BGM|m111_tomorrow⟧
旁白：Three unsealed letters lie in the public lounge. None has a reply deadline.
卢西恩：“If you wish, we can begin again with a first date.”
罗文：“The invitation to the coast comes with no relationship conditions.”
卡西安：“Rebuilding the hunters needs witnesses, not anyone belonging to anyone.”
旁白：The restoration desk accepts independent participation without requiring any relationship.
⟦SET|c12clue_seen⟧
# CHOICE｜How would you like to spend the first morning without a countdown?
#### A｜Invite Lucien for a walk without defining a relationship in advance
旁白：The walk is accepted. Being together does not reactivate an old vow.
⟦OPT|A|set:c12approach_a⟧
#### B｜Celebrate with all your allies
旁白：More cups are set out in the public lounge. No seats are reserved for couples.
⟦OPT|B|set:c12approach_b⟧
#### C｜Visit the river alone and keep time for yourself
旁白：The riverside route and return time remain yours to arrange. No one demands company or reports.
⟦OPT|C|set:c12approach_c⟧
# ·
旁白：There is time this morning to be together, be alone, or discuss only restoration.

# SCENE｜Museum restoration gallery
⟦BG|bg_c12s03|Museum restoration gallery · Lucien、Rowan、Cassian⟧
⟦TIME|November 14 16:30⟧
⟦FX|none⟧
⟦BGM|m111_tomorrow⟧
⟦IF|c12approach_a⟧
旁白：The morning walk defined no partner in advance; wishes can still be stated anew this afternoon.
⟦/IF⟧
⟦IF|c12approach_b⟧
旁白：The celebration photo stays on the public desk and is not used as proof of anyone’s romance.
⟦/IF⟧
⟦IF|c12approach_c⟧
旁白：The morning alone remains yours; returning requires no account of your whereabouts or compensation.
⟦/IF⟧
旁白：The restoration gallery opens that afternoon as city records begin returning to residents.
旁白：The three operational records preserve responsibilities without recasting them as romantic merit.
卢西恩：“You do not need to remember those fragments to have the right to refuse me.”
罗文：“A future without a romantic decision is still complete.”
卡西安：“Freedom is not something we award you for helping save the city.”
⟦FREE|You may ask about the people and evidence here, or reserve judgment.⟧
旁白：At dusk, Mara opens a new contact register without deadlines beneath the glass dome.

# SCENE｜Museum glass-dome registry
⟦BG|bg_c12s04|Museum glass-dome registry · Lucien、Rowan、Cassian、Mara⟧
⟦TIME|November 14 18:30⟧
⟦FX|none⟧
⟦BGM|m111_tomorrow⟧
旁白：Sunset passes through the glass dome and falls across the still-unsealed letters.
旁白：Mara opens a new contact register without filling in anyone’s relationship.
玛拉：“We record only the agreements you want now. They may still change later.”
旁白：The three men remain within earshot without blocking the exit.
旁白：The city’s clocks move forward. This time there is no final minute.
# CHOICE｜How do you want to begin this future without a countdown?
#### A｜Explicitly choose a new romantic relationship with Lucien
旁白：The old portraits remain in the archive. Lucien leaves the first date’s time open for both of you to agree.
旁白：You retain separate lives and agree to hear present wishes before every new intimacy.
旁白：The next meeting can simply be coffee. It need not save an entire city.
⟦OPT|A|set:ending_lucien⟧
⟦IF|ending_lucien⟧
旁白：The city keeps rebuilding; relationships and daily life can continue on new dates.
⟦/IF⟧
#### B｜Explicitly choose romance and a shared life with Rowan
旁白：The hospital’s night clinic reopens. Rowan leaves a coastal trip on a schedule both of you can change.
旁白：Romance does not replace work boundaries or make you responsible for every shift.
旁白：The next follow-up and a sunrise together can both belong to ordinary life.
⟦OPT|B|set:ending_rowan⟧
⟦IF|ending_rowan⟧
旁白：The city keeps rebuilding; relationships and daily life can continue on new dates.
⟦/IF⟧
#### C｜Explicitly choose romance with Cassian and rebuild trust
旁白：The hunters revoke the old blood oath. Cassian submits accountability review to independent members.
旁白：Your relationship does not exempt him from responsibility. Trust can be rebuilt slowly.
旁白：The first walk without a mission has a route the two of you can choose together.
⟦OPT|C|set:ending_cassian⟧
⟦IF|ending_cassian⟧
旁白：The city keeps rebuilding; relationships and daily life can continue on new dates.
⟦/IF⟧
#### D｜Choose an independent life without a romantic relationship
旁白：The register retains friends and public support contacts without naming a romantic partner.
旁白：An open-ended ticket can be bought now or later. The city no longer charges for freedom.
旁白：The next letter from a friend will first ask whether you wish to receive it.
⟦OPT|D|set:ending_independent⟧
⟦IF|ending_independent⟧
旁白：The city keeps rebuilding; relationships and daily life can continue on new dates.
⟦/IF⟧
#### E｜Defer romance and continue together as companions
旁白：The restoration plan records companionship without silently inventing a relationship.
旁白：There may be dates later, or lasting friendship. No one keeps a debt for waiting.
旁白：The next meeting can start with a meal. New days need no permission from fate.
⟦OPT|E|set:ending_open⟧
⟦IF|ending_open⟧
旁白：The city keeps rebuilding; relationships and daily life can continue on new dates.
⟦/IF⟧
# ·
