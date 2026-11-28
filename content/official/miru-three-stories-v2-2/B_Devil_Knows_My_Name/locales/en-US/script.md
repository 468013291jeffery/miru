# CHAPTER 1｜The Death Order
⟦GOAL|Your name is on the bounty list. What do you do first?|The Death Order⟧
⟦DONE|flag|b_c01_event|Witness the key development|Narration: An emergency screen lights up: your name heads the bounty list. The buyer is “Roman Moretti.”⟧
⟦DONE|say|Express how you wish to handle “Your name is on the bounty list. What do you do first?”; ask, approach, refuse, or postpone.|State your current intent|Narration: You can state your conditions or ask for verification first.⟧

# SCENE｜Underground club
⟦BG|bg_b_c01s01|Underground club⟧
⟦TIME|02:00⟧
Narration: That same night, you arrive at the private underground club. Bass makes the glasses tremble. You slap the detention order bearing Roman's signature in front of him; the band stops instantly. His old left-brow scar deepens in the dim light, but he makes no defensive move.
Roman: “The signature is mine. The order to kill your brother isn't. Do you want me to admit it before everyone, or show you the original first?”
⟦FREE⟧
Narration: He pushes the gun on the table away, leaving nothing between you.

# SCENE｜Private club office
⟦BG|bg_b_c01s02|Private club office⟧
⟦TIME|02:25⟧
Narration: Next, in the club's private meeting room, Roman unlocks a drawer containing three versions of the operation order; only one carries the lethal red stamp. His left hand almost touches the photograph you placed on the table, then withdraws so you can take it first.
Narration: With the three orders laid out, warm up your eye: find 💌 among the paper icons before comparing them.
⟦MG|g_find_letter⟧
Roman: “I signed to bring him back. Someone later changed interrogation into execution. Shall I name who took the document, or explain first why I burned the subsequent records?”
⟦FREE⟧
Narration: The alarm light flares. Hurried footsteps sound in the corridor.

# SCENE｜Club stairwell
⟦BG|bg_b_c01s03|Club stairwell⟧
⟦TIME|02:50⟧
Narration: Next, in the club's emergency stairwell, every light goes out. Roman puts the exit key in your hand and stays by the door to answer an encrypted call.
Narration: The stairwell is dark. Before moving on, try spotting 🗝 among the object icons.
⟦MG|g_find_key⟧
Roman: “This leads to the street. You owe me no reason to follow. Will you leave, stay to hear the call, or first check who bought the bounty?”
⟦FREE⟧
Narration: An emergency screen lights up: your name heads the bounty list. The buyer is “Roman Moretti.”
⟦SET|b_c01_event⟧

# CHOICE｜Your name is on the bounty list. What do you do first?
#### A｜Photograph the list and leave Roman's territory
Narration: The list is photographed and the independent lawyer receives a copy.
⟦OPT|A|set:b_c01_a⟧
#### B｜Demand Roman explain on the spot why he bought your bounty
Narration: Roman admits buying it to prevent others taking the contract, leaving evidence open to further questioning.
⟦OPT|B|set:b_c01_b⟧
#### C｜Stay to verify the original order, but refuse arranged protection
Narration: Roman hands over the original; safety decisions remain yours.
⟦OPT|C|set:b_c01_c⟧
# ·
Narration: Who first put your name on the bounty list?

# CHAPTER 2｜The Man Outside Your Door
⟦GOAL|You receive your brother's record. How will you verify it?|The Man Outside Your Door⟧
⟦DONE|flag|b_c02_event|Witness the key development|Narration: At last he leaves a scorched warehouse photograph by your door, without asking you to open it.⟧
⟦DONE|say|Express how you wish to handle “You receive your brother's record. How will you verify it?”; ask, approach, refuse, or postpone.|State your current intent|Narration: You can state your conditions or ask for verification first.⟧

# SCENE｜Independent lawyer's office
⟦BG|bg_b_c02s01|Independent lawyer's office⟧
⟦TIME|22:00⟧
⟦IF|b_c01_a⟧
Narration: The list is photographed and the independent lawyer receives a copy.
⟦/IF⟧
⟦IF|b_c01_b⟧
Narration: Roman admits buying it to prevent others taking the contract, leaving evidence open to further questioning.
⟦/IF⟧
⟦IF|b_c01_c⟧
Narration: Roman hands over the original; safety decisions remain yours.
⟦/IF⟧
Narration: The next evening, at the independent lawyer's reception room, Roman's lawyer offers three safe residences for you to choose from a map. Roman stands by the window instead of sitting beside you.
Narration: The map is spread before you. Arrange the numbered 🗺 tiles if you want a pause before choosing a residence.
⟦MG|g_slide_map⟧
Independent lawyer: “You can contact me directly, without going through him. Would you rather reach a safe place first, or request an open inquiry into the bounty?”
⟦FREE⟧
Narration: The lawyer leaves an independent phone card and instructions for the emergency exit.

# SCENE｜Apartment living room
⟦BG|bg_b_c02s02|Apartment living room⟧
⟦TIME|22:25⟧
Narration: Next, in the safe apartment's living room, an old record sleeve slides beneath the door: the jazz piece your brother Luca played every birthday. A handwritten childhood code is tucked into the seal. Outside, Roman puts coffee on the floor; the kindness makes you want to ask how he knows your habits.
Narration: No need to touch the sleeve yet. While arranging its examination, try finding 💌 among the paper icons.
⟦MG|g_find_letter⟧
Nadia: “Don't trust a keepsake too quickly. Check how it got here first. Shall we test fingerprints, play the record, or show the handwriting to an old friend of your brother?”
⟦FREE⟧
Narration: The record bears a courier barcode introduced only three weeks ago.

# SCENE｜Apartment corridor
⟦BG|bg_b_c02s03|Apartment corridor⟧
⟦TIME|22:50⟧
Narration: Next, in the corridor outside the safe apartment, Roman sits at the far end, his coat on the chair and an unopened medical kit beside him.
Roman: “Your brother kept things from you. So did I. Do you want me to go, or write down what I know first?”
⟦FREE⟧
Narration: At last he leaves a scorched warehouse photograph by your door, without asking you to open it.
⟦SET|b_c02_event⟧

# CHOICE｜You receive your brother's record. How will you verify it?
#### A｜Have Nadia independently identify the record's source
Narration: Courier records and the childhood code are cross-checked, yielding a new lead.
⟦OPT|A|set:b_c02_a⟧
#### B｜Require Roman to write down the secrets he knows about your brother
Narration: Roman leaves a written statement, giving his account a verifiable record.
⟦OPT|B|set:b_c02_b⟧
#### C｜Leave the safe apartment first to avoid tracking
Narration: Independent counsel updates your address; Roman's team must no longer know your location.
⟦OPT|C|set:b_c02_c⟧
# ·
Narration: Is this concern protection or surveillance?

# CHAPTER 3｜Capture or Murder
⟦GOAL|Knowing Roman burned evidence, what do you ask first?|Capture or Murder⟧
⟦DONE|flag|b_c03_event|Witness the key development|Narration: A short fragment of audio is recovered: “Don't trust that funeral.”⟧
⟦DONE|say|Express how you wish to handle “Knowing Roman burned evidence, what do you ask first?”; ask, approach, refuse, or postpone.|State your current intent|Narration: You can state your conditions or ask for verification first.⟧

# SCENE｜Records facility
⟦BG|bg_b_c03s01|Records facility⟧
⟦TIME|11:00⟧
⟦IF|b_c02_a⟧
Narration: Courier records and the childhood code are cross-checked, yielding a new lead.
⟦/IF⟧
⟦IF|b_c02_b⟧
Narration: Roman leaves a written statement, giving his account a verifiable record.
⟦/IF⟧
⟦IF|b_c02_c⟧
Narration: Independent counsel updates your address; Roman's team must no longer know your location.
⟦/IF⟧
Narration: On the third morning, at the archive station, Nadia lifts the original order with gloved hands. The red stamp was applied after Roman's signature; the ink and paper grain do not match.
Narration: Examination takes time. While waiting, turn the camera, film and other cards to match six identical pairs.
⟦MG|g_mem_memory⟧
Nadia: “These weren't signed on the same day. Someone issued a new order after him. Do you want an examination first, or to confront Roman with the forged version?”
⟦FREE⟧
Narration: An examination lamp reveals a scraped-off archivist number. The immediate task is to compare the ink colors of the two stamps on the order.

# SCENE｜Closed club office
⟦BG|bg_b_c03s02|Closed club office⟧
⟦TIME|11:25⟧
Narration: Next, in the club's closed office, Roman does not hide. He admits burning original footage after the operation because the ledger implicated his own transactions. He closes his eyes when you say your brother's name, as though someone has finally named the guilt he avoided.
Roman: “The lethal stamp wasn't mine. The fire that concealed evidence was. Will you record my statement, or shall I hand over the surviving hard drive first?”
⟦FREE⟧
Narration: He removes his watch, exposing burns from a few weeks earlier.

# SCENE｜Photography darkroom
⟦BG|bg_b_c03s03|Photography darkroom⟧
⟦TIME|11:50⟧
Narration: Next, in the photography studio's darkroom, you retrieve Luca's final dialing record. He called your number, but the telecom backup shows that the call was redirected.
Narration: While the telecom backup is retrieved, focus by tapping the lights in the order shown.
⟦MG|g_simon_lights⟧
Nadia: “You didn't fail to answer. Someone kept it from ringing. Shall we check the cell tower, or meet the person responsible for redirecting it?”
⟦FREE⟧
Narration: A short fragment of audio is recovered: “Don't trust that funeral.”
⟦SET|b_c03_event⟧

# CHOICE｜Knowing Roman burned evidence, what do you ask first?
#### A｜Demand the name of the last person to handle the order
Narration: Roman provides the name and handover records; merely denying murder is not enough.
⟦OPT|A|set:b_c03_a⟧
#### B｜Prioritize tracing the redirected final call
Narration: Telecom records are preserved, pointing next to a switching facility.
⟦OPT|B|set:b_c03_b⟧
#### C｜Refuse further private meetings with him
Narration: Roman may submit material only through counsel and cannot arrange private “chance” encounters.
⟦OPT|C|set:b_c03_c⟧
# ·
Narration: What did your brother say on the day his call was redirected?

# CHAPTER 4｜Just One Dance
⟦GOAL|Someone publicly calls you his woman. How do you respond?|Just One Dance⟧
⟦DONE|flag|b_c04_event|Witness the key development|Narration: Roman quietly names a date engraved inside the ring, without explaining why he remembers.⟧
⟦DONE|say|Express how you wish to handle “Someone publicly calls you his woman. How do you respond?”; ask, approach, refuse, or postpone.|State your current intent|Narration: You can state your conditions or ask for verification first.⟧

# SCENE｜Midnight dance floor
⟦BG|bg_b_c04s01|Midnight dance floor⟧
⟦TIME|23:00⟧
⟦IF|b_c03_a⟧
Narration: Roman provides the name and handover records; merely denying murder is not enough.
⟦/IF⟧
⟦IF|b_c03_b⟧
Narration: Telecom records are preserved, pointing next to a switching facility.
⟦/IF⟧
⟦IF|b_c03_c⟧
Narration: Roman may submit material only through counsel and cannot arrange private “chance” encounters.
⟦/IF⟧
Narration: On the fourth night, at the club's midnight dance floor, a guest calls you “Moretti's new favorite,” drawing every gaze. Roman approaches but stops an arm's length away. As red light dims, his hand pauses by your waist; without permission it will not touch you.
Roman: “One dance could silence them. If you refuse, I can still handle it. Would you like to dance, or have me correct them publicly?”
⟦FREE⟧
Narration: A passing waiter secretly slips a folded note beneath your coaster.

# SCENE｜Red booth beside the dance floor
⟦BG|bg_b_c04s02|Red booth beside the dance floor⟧
⟦TIME|23:25⟧
Narration: Next, in the red booth beside the dance floor, the note shows marks from inside your brother's old ring. Roman's fingers freeze for a second in recognition. Despite the nearby music, only you hear him say, “Wanting to be close doesn't mean you have to stay.”
Narration: Set the note down safely. If you want a moment, find 💌 among the paper icons before asking about its origin.
⟦MG|g_find_letter⟧
Roman: “He loved to gamble. He only told the truth after losing. Shall I tell you where that ring came from, or will you ask whoever sent the note?”
⟦FREE⟧
Narration: Nadia appears behind the curtain and gestures toward somewhere quiet. The immediate task is to reconstruct the childhood code behind the ring.

# SCENE｜Backstage passage
⟦BG|bg_b_c04s03|Backstage passage⟧
⟦TIME|23:50⟧
Narration: Next, in the club's backstage passage, music still vibrates through the wall. Nadia produces an old dock entrance photograph showing someone leaving with Luca's ring.
Narration: The photograph is at hand. Try arranging the numbered 📷 tiles before returning to its date.
⟦MG|g_slide_photo⟧
Nadia: “The timestamp is four days after his reported death. Do you want Roman to verify it, or take the photograph for an independent inquiry?”
⟦FREE⟧
Narration: Roman quietly names a date engraved inside the ring, without explaining why he remembers.
⟦SET|b_c04_event⟧

# CHOICE｜Someone publicly calls you his woman. How do you respond?
#### A｜Choose to dance with Roman and use the chance to question him
Narration: You control the conversation before the crowd and obtain the note.
⟦OPT|A|set:b_c04_a⟧
#### B｜Require him to correct the description immediately
Narration: Roman corrects it publicly; everyone learns you belong to no one.
⟦OPT|B|set:b_c04_b⟧
#### C｜Decline the dance and investigate the note with Nadia
Narration: Nadia preserves the note's provenance; no dance takes place.
⟦OPT|C|set:b_c04_c⟧
# ·
Narration: Can tenderness and wrongdoing exist in the same person?

# CHAPTER 5｜He Bleeds Too
⟦GOAL|Roman is hurt and a key ring appears. How do you act?|He Bleeds Too⟧
⟦DONE|flag|b_c05_event|Witness the key development|Narration: The courier's wrist tattoo matches a design your brother drew as a child.⟧
⟦DONE|say|Express how you wish to handle “Roman is hurt and a key ring appears. How do you act?”; ask, approach, refuse, or postpone.|State your current intent|Narration: You can state your conditions or ask for verification first.⟧

# SCENE｜Garage medical area
⟦BG|bg_b_c05s01|Garage medical area⟧
⟦TIME|03:00⟧
⟦IF|b_c04_a⟧
Narration: You control the conversation before the crowd and obtain the note.
⟦/IF⟧
⟦IF|b_c04_b⟧
Narration: Roman corrects it publicly; everyone learns you belong to no one.
⟦/IF⟧
⟦IF|b_c04_c⟧
Narration: Nadia preserves the note's provenance; no dance takes place.
⟦/IF⟧
Narration: At dawn on the fifth day, at the underground garage's medical corner, Roman shields a driver about to testify from an attack; blood seeps through his shoulder. He checks the driver's safety before sitting. Blood runs between his fingers, yet he keeps checking whether the injured driver is breathing.
Narration: Give the medical team room. While they prepare, you can look for 🗝 among the object icons.
⟦MG|g_find_key⟧
Roman: “Don't stop what you need to do for me. Will you pass the first-aid kit, or let the doctor take over?”
⟦FREE⟧
Narration: A metal key ring engraved with Luca's name falls out of the medical kit.

# SCENE｜Temporary clinic
⟦BG|bg_b_c05s02|Temporary clinic⟧
⟦TIME|03:25⟧
Narration: Next, in the temporary treatment room, the doctor stitches Roman's wound. Without pretending to be strong, he stares at the old key ring on the table, his voice suddenly soft. Pain breaks his breathing, yet he worries you might stop questioning him because he is bleeding.
Roman: “He gave me this. I thought I'd never see it again. Do you want its story, or should I stop talking for now?”
⟦FREE⟧
Narration: The doctor's evidence registration date is three weeks later than the police death report.

# SCENE｜Parking office
⟦BG|bg_b_c05s03|Parking office⟧
⟦TIME|03:50⟧
Narration: Next, in the parking security office, Nadia retrieves an evidence intake scan: someone personally delivered the key ring to the hospital after Luca's “death.”
Narration: The intake scan awaits verification. Take a moment to match identical camera, film and other cards.
⟦MG|g_mem_memory⟧
Nadia: “Someone brought it in. It wasn't removed from a body. Shall we trace the courier, or check that day's hospital footage first?”
⟦FREE⟧
Narration: The courier's wrist tattoo matches a design your brother drew as a child. The immediate task is to verify when the key ring was registered on intake.
⟦SET|b_c05_event⟧

# CHOICE｜Roman is hurt and a key ring appears. How do you act?
#### A｜Help the doctor with the wound without agreeing to intimacy
Narration: Treatment is completed; Roman understands helping a patient is not absolution.
⟦OPT|A|set:b_c05_a⟧
#### B｜Keep your distance and prioritize tracing the key ring
Narration: The hospital preserves the intake records; the key ring enters independent examination.
⟦OPT|B|set:b_c05_b⟧
#### C｜Leave at once and have Nadia obtain the evidence
Narration: You may leave Roman's surroundings; Nadia completes the inquiry independently.
⟦OPT|C|set:b_c05_c⟧
# ·
Narration: How did your brother's belongings appear after his death?

# CHAPTER 6｜The Private File
⟦GOAL|You discover Roman monitored your life. What do you demand?|The Private File⟧
⟦DONE|flag|b_c06_event|Witness the key development|Narration: The paper corners indicate an abandoned old aquarium.⟧
⟦DONE|say|Express how you wish to handle “You discover Roman monitored your life. What do you demand?”; ask, approach, refuse, or postpone.|State your current intent|Narration: You can state your conditions or ask for verification first.⟧

# SCENE｜Roman's study
⟦BG|bg_b_c06s01|Roman's study⟧
⟦TIME|14:00⟧
⟦IF|b_c05_a⟧
Narration: Treatment is completed; Roman understands helping a patient is not absolution.
⟦/IF⟧
⟦IF|b_c05_b⟧
Narration: The hospital preserves the intake records; the key ring enters independent examination.
⟦/IF⟧
⟦IF|b_c05_c⟧
Narration: You may leave Roman's surroundings; Nadia completes the inquiry independently.
⟦/IF⟧
Narration: On the sixth afternoon, in Roman's private study, a wall behind the bookcase is covered with your public interview photographs, schedules and work addresses. A frame even shows an old apartment you never mentioned to him.
Narration: There is no rush to dismantle frames. Arrange the numbered 📷 tiles while waiting for counsel.
⟦MG|g_slide_photo⟧
Roman: “My people carried out this surveillance. I approved it. There is no excuse. Do you want it destroyed, preserved as evidence, or a lawyer called immediately?”
⟦FREE⟧
Narration: He places every storage device in transparent evidence bags, then takes two steps back.

# SCENE｜Study storage room
⟦BG|bg_b_c06s02|Study storage room⟧
⟦TIME|14:25⟧
Narration: Next, in the study storeroom, Roman revokes access before the lawyer and surrenders backup accounts without demanding trust. He offers no defense of the photograph wall, watching you remove the material without asking you to stay.
Independent lawyer: “You control how these surveillance records are used as evidence. Shall we protect your address first, or verify when the surveillance began?”
⟦FREE⟧
Narration: The oldest photograph predates your investigation into your brother's death.

# SCENE｜Independent café
⟦BG|bg_b_c06s03|Independent café⟧
⟦TIME|14:50⟧
Narration: Next, in the independent café downstairs, you turn over a photograph and find your brother's childhood code. Nadia checks the handwriting: Luca may have used Roman's files to send you a message.
Narration: The handwriting still needs checking. Match identical cards, then return to the photograph's reverse.
⟦MG|g_mem_memory⟧
Nadia: “Someone left clues through his eyes. Who is more frightening now? Shall we decode it, or exclude Roman from the investigation completely first?”
⟦FREE⟧
Narration: The paper corners indicate an abandoned old aquarium.
⟦SET|b_c06_event⟧

# CHOICE｜You discover Roman monitored your life. What do you demand?
#### A｜Delete private material immediately while sealing the evidence
Narration: Roman surrenders all access rights; unlawful surveillance stops.
⟦OPT|A|set:b_c06_a⟧
#### B｜Ask independent counsel to pursue responsibility for the surveillance
Narration: The records enter a formal inquiry; a private apology cannot replace accountability.
⟦OPT|B|set:b_c06_b⟧
#### C｜Cut off personal contact with Roman
Narration: Roman stops contacting you directly and submits material only through counsel.
⟦OPT|C|set:b_c06_c⟧
# ·
Narration: Surveillance began before you knew him. Who first started looking for you?

# CHAPTER 7｜A Brother Still Alive
⟦GOAL|Your brother may be alive. How will you arrange the meeting?|A Brother Still Alive⟧
⟦DONE|flag|b_c07_event|Witness the key development|Narration: A cut-off sentence remains at the end: “Don't give the hard drive to Roman.”⟧
⟦DONE|say|Express how you wish to handle “Your brother may be alive. How will you arrange the meeting?”; ask, approach, refuse, or postpone.|State your current intent|Narration: You can state your conditions or ask for verification first.⟧

# SCENE｜Suburban station records room
⟦BG|bg_b_c07s01|Suburban station records room⟧
⟦TIME|16:00⟧
⟦IF|b_c06_a⟧
Narration: Roman surrenders all access rights; unlawful surveillance stops.
⟦/IF⟧
⟦IF|b_c06_b⟧
Narration: The records enter a formal inquiry; a private apology cannot replace accountability.
⟦/IF⟧
⟦IF|b_c06_c⟧
Narration: Roman stops contacting you directly and submits material only through counsel.
⟦/IF⟧
Narration: At dusk on the seventh day, in a suburban station's security room, Nadia retrieves footage from a month ago. A man in a dark coat removes his hat, revealing Luca's old brow scar.
Narration: The footage is paused. Arrange the numbered 📷 tiles if you want a breath before studying the face.
⟦MG|g_slide_photo⟧
Nadia: “He's alive. That's all I dare say; everything else needs verification. Shall we check his identity, go to the station, or notify Roman?”
⟦FREE⟧
Narration: Your phone sounds: an unknown number sends a voice message containing a childhood secret only you and your brother knew.

# SCENE｜Independent law office
⟦BG|bg_b_c07s02|Independent law office⟧
⟦TIME|16:25⟧
Narration: Next, in the independent lawyer's office, Roman stays silent a long time after hearing the message. He admits he only just learned of the footage, rather than claiming he always knew to maintain control. Your brother's voice unsettles him too, but he only pulls out a chair for you, leaving the recording in your hands.
Roman: “If he's alive, I owe you an even worse explanation. Do you want my help finding him, or all my people out?”
⟦FREE⟧
Narration: The lawyer gives you a map of the aquarium area and safe routes.

# SCENE｜Audio examination room
⟦BG|bg_b_c07s03|Audio examination room⟧
⟦TIME|16:50⟧
Narration: Next, in the audio examination room, you and Nadia compare the new voice message against your brother's old videos frame by frame. A subway announcement in the background dates the recording to two days ago.
Narration: While the audio is compared section by section, repeat the screen's light sequence.
⟦MG|g_simon_lights⟧
Nadia: “The voice is genuine. Even alive, he owes you for three months of mourning. Will you meet alone, or have independent counsel nearby?”
⟦FREE⟧
Narration: A cut-off sentence remains at the end: “Don't give the hard drive to Roman.” The immediate task is to compare your brother's new and old voice recordings.
⟦SET|b_c07_event⟧

# CHOICE｜Your brother may be alive. How will you arrange the meeting?
#### A｜Visit the aquarium with independent counsel
Narration: Safe routes and a witness are confirmed; Luca cannot easily monopolize the account.
⟦OPT|A|set:b_c07_a⟧
#### B｜Keep room for a private conversation, with an emergency contact
Narration: You can speak alone with Luca while retaining help independent of Roman.
⟦OPT|B|set:b_c07_b⟧
#### C｜Require voice and identity verification before meeting
Narration: Authentication is organized, reducing the risk of a false identity.
⟦OPT|C|set:b_c07_c⟧
# ·
Narration: Why did your brother let you mourn him?

# CHAPTER 8｜Half a Truth at the Aquarium
⟦GOAL|Luca asks you to hide the drive. How do you respond?|Half a Truth at the Aquarium⟧
⟦DONE|flag|b_c08_event|Witness the key development|Narration: Deep in a locker is another note bearing your name and a meeting time.⟧
⟦DONE|say|Express how you wish to handle “Luca asks you to hide the drive. How do you respond?”; ask, approach, refuse, or postpone.|State your current intent|Narration: You can state your conditions or ask for verification first.⟧

# SCENE｜Abandoned aquarium ticket window
⟦BG|bg_b_c08s01|Abandoned aquarium ticket window⟧
⟦TIME|19:00⟧
⟦IF|b_c07_a⟧
Narration: Safe routes and a witness are confirmed; Luca cannot easily monopolize the account.
⟦/IF⟧
⟦IF|b_c07_b⟧
Narration: You can speak alone with Luca while retaining help independent of Roman.
⟦/IF⟧
⟦IF|b_c07_c⟧
Narration: Authentication is organized, reducing the risk of a false identity.
⟦/IF⟧
Narration: On the seventh night, at the old aquarium's ticket window, a metal token you exchanged with your brother in childhood slides beneath the window onto the floor. Beyond the thick glass, a familiar figure stands at the far end of the pool.
Narration: Keep the token nearby. Before choosing your question, try pairing camera, toy and other familiar icons.
⟦MG|g_mem_memory⟧
Luca: “Don't let Roman follow. At least this once, hear me first. Will you ask why I faked my death, or confirm I'm really Luca?”
⟦FREE⟧
Narration: Blue waterlight falls across his face. Your three months of mourning suddenly have a living target.

# SCENE｜Aquarium glass corridor
⟦BG|bg_b_c08s02|Aquarium glass corridor⟧
⟦TIME|19:25⟧
Narration: Next, in the abandoned aquarium's glass corridor, Luca approaches with a new scar. He starts to embrace you, then stops midway. Roman waits at the exit instead of approaching as he once would; he has learned to keep anxiety in his own eyes.
Luca: “I'm sorry. I couldn't bring myself to say those words while I was alive. Do you need a hug, an explanation, or more distance first?”
⟦FREE⟧
Narration: A model shark's shadow crosses the cracked glass. He avoids explaining how he escaped.

# SCENE｜Aquarium storage room
⟦BG|bg_b_c08s03|Aquarium storage room⟧
⟦TIME|19:50⟧
Narration: Next, in the aquarium storeroom, Luca produces a black hard drive, claiming it contains Roman's criminal accounts, but forbids you to connect it to a computer there.
Narration: Leave the drive disconnected for now. During the handover record, try finding 💌 among paper icons.
⟦MG|g_find_letter⟧
Luca: “I don't trust him. Neither should you. Do you want to ask why I need you to hide it instead of giving it to an independent investigator? I owe you an explanation.”
⟦FREE⟧
Narration: Deep in a locker is another note bearing your name and a meeting time.
⟦SET|b_c08_event⟧

# CHOICE｜Luca asks you to hide the drive. How do you respond?
#### A｜Refuse concealment and request third-party custody
Narration: The drive enters third-party custody and cannot become either man's weapon.
⟦OPT|A|set:b_c08_a⟧
#### B｜Keep it temporarily, but seal a copy and record the timing
Narration: Its source and handover time are documented; family feeling alone is not enough.
⟦OPT|B|set:b_c08_b⟧
#### C｜Require Luca to explain how he survived first
Narration: Luca admits arranging his staged death, and his account is recorded.
⟦OPT|C|set:b_c08_c⟧
# ·
Narration: Your brother returned alive. Why still ask you to hide the drive for him?

# CHAPTER 9｜The Plan Before the Attraction
⟦GOAL|Roman admits using you at first. How do you respond?|The Plan Before the Attraction⟧
⟦DONE|flag|b_c09_event|Witness the key development|Narration: A bicycle courier delivers the password for Luca's drive: the name of your childhood dog.⟧
⟦DONE|say|Express how you wish to handle “Roman admits using you at first. How do you respond?”; ask, approach, refuse, or postpone.|State your current intent|Narration: You can state your conditions or ask for verification first.⟧

# SCENE｜Aquarium exit
⟦BG|bg_b_c09s01|Aquarium exit⟧
⟦TIME|21:00⟧
⟦IF|b_c08_a⟧
Narration: The drive enters third-party custody and cannot become either man's weapon.
⟦/IF⟧
⟦IF|b_c08_b⟧
Narration: Its source and handover time are documented; family feeling alone is not enough.
⟦/IF⟧
⟦IF|b_c08_c⟧
Narration: Luca admits arranging his staged death, and his account is recorded.
⟦/IF⟧
Narration: On the eighth night, at the aquarium exit, Roman waits outside as promised but asks his driver to illuminate the way out. Luca calls from behind you not to take Roman's car. Roman swallows; for once he does not maintain composure through silence.
Narration: The exit is lit; there is no rush to get in a car. Arrange the 🗺 tiles, then choose your route.
⟦MG|g_slide_map⟧
Roman: “I won't ask what you discussed. You have your own path. Shall I leave, contact a lawyer for you, or hand over my operation records?”
⟦FREE⟧
Narration: In the distance Luca turns into an alley, no longer holding the hard drive.

# SCENE｜Empty jazz bar
⟦BG|bg_b_c09s02|Empty jazz bar⟧
⟦TIME|21:25⟧
Narration: Next, at an empty jazz bar, Roman has arranged to meet without his men. Only water and operation documents lie on the table. He says “I missed you” for the first time, then gives the lawyer every plan to approach you.
Roman: “I first approached you to find Luca and the ledger. Later, my feelings became real. Which part makes you want to leave more? You can say it plainly.”
⟦FREE⟧
Narration: He surrenders his encrypted phone to counsel. All approach plans stop immediately.

# SCENE｜Rain canopy outside the bar
⟦BG|bg_b_c09s03|Rain canopy outside the bar⟧
⟦TIME|21:50⟧
Narration: Next, beneath the bar's back-door rain canopy, Roman receives an urgent call from his men and rejects, in front of you, their proposal to continue tracking you “for protection.”
Narration: After the call, try sorting notifications: tap 📵, avoid 💬, then return to contact arrangements.
⟦MG|g_whack_texts⟧
Roman: “I want you to stay. That's my wish, not your obligation. Shall we stop contact, or exchange evidence only through counsel?”
⟦FREE⟧
Narration: A bicycle courier delivers the password for Luca's drive: the name of your childhood dog.
⟦SET|b_c09_event⟧

# CHOICE｜Roman admits using you at first. How do you respond?
#### A｜Require him to stop all private approaches
Narration: Roman cancels all contact plans; no private meetings occur in the near term.
⟦OPT|A|set:b_c09_a⟧
#### B｜Allow continued evidence exchange through counsel
Narration: Necessary investigative cooperation continues; intimacy remains paused.
⟦OPT|B|set:b_c09_b⟧
#### C｜Hear his explanation without immediately believing him
Narration: Roman gives counsel the complete operation documents; trust still requires future proof.
⟦OPT|C|set:b_c09_c⟧
# ·
Narration: How will you judge when lies and genuine feelings coexist?

# CHAPTER 10｜Out of His Shadow
⟦GOAL|Someone is watching your new address. What do you trust first?|Out of His Shadow⟧
⟦DONE|flag|b_c10_event|Witness the key development|Narration: Outside, a delivery van circles the corner for the second time. Its plate has no connection to Roman.⟧
⟦DONE|say|Express how you wish to handle “Someone is watching your new address. What do you trust first?”; ask, approach, refuse, or postpone.|State your current intent|Narration: You can state your conditions or ask for verification first.⟧

# SCENE｜Independent data lab
⟦BG|bg_b_c10s01|Independent data lab⟧
⟦TIME|08:30⟧
⟦IF|b_c09_a⟧
Narration: Roman cancels all contact plans; no private meetings occur in the near term.
⟦/IF⟧
⟦IF|b_c09_b⟧
Narration: Necessary investigative cooperation continues; intimacy remains paused.
⟦/IF⟧
⟦IF|b_c09_c⟧
Narration: Roman gives counsel the complete operation documents; trust still requires future proof.
⟦/IF⟧
Narration: On the ninth morning, in an independent data lab, Nadia opens the drive. Roman repeatedly opposed the organization's trafficking-like illegal deals in writing, yet ultimately allowed its money-laundering network to continue.
Narration: After the files load, take a breath: watch the lights and repeat their sequence.
⟦MG|g_simon_lights⟧
Nadia: “He isn't innocent. And not every accusation is true. Shall we classify evidence by offense, or first find who altered the detention order?”
⟦FREE⟧
Narration: The image freezes on Roman's hand signing a written warning.

# SCENE｜New apartment entrance
⟦BG|bg_b_c10s02|New apartment entrance⟧
⟦TIME|08:55⟧
Narration: Next, outside your newly rented apartment, you have paid the rent yourself and used an independent lock installer. Only coffee beans wait outside, without cameras or guards. Roman's note names your usual coffee but does not request a response.
Narration: Leave the parcel by the door. Before registering it, find 💌 among paper icons if you want a moment to think.
⟦MG|g_find_letter⟧
Building manager: “This package is addressed to you, with no phone number. Will you accept it, return it, or have me register it?”
⟦FREE⟧
Narration: A note inside the sleeve reads: “Don't take your usual street today.”

# SCENE｜Small table by the window
⟦BG|bg_b_c10s03|Small table by the window⟧
⟦TIME|09:20⟧
Narration: Next, at the small table by the window, Roman's apology has only three sentences and no excuses. It ends with his willingness to submit the surveillance records to regulators.
Nadia: “You can read an apology without deciding forgiveness today. Will you keep the letter, or seal it with the case records?”
⟦FREE⟧
Narration: Outside, a delivery van circles the corner for the second time. Its plate has no connection to Roman.
⟦SET|b_c10_event⟧

# CHOICE｜Someone is watching your new address. What do you trust first?
#### A｜Protect yourself and report the unfamiliar plate to police
Narration: Police and counsel retain the vehicle details; risk is independently verified.
⟦OPT|A|set:b_c10_a⟧
#### B｜Require Roman's team to explain the package's source
Narration: His team submits delivery records; concern alone cannot exempt them from scrutiny.
⟦OPT|B|set:b_c10_b⟧
#### C｜Ask Luca directly whether he leaked your address
Narration: Luca's evasive answer is recorded; being your brother does not exempt him from verification.
⟦OPT|C|set:b_c10_c⟧
# ·
Narration: Why does Luca's meeting list say you will bring the ledger?

# CHAPTER 11｜Your Brother's Bait
⟦GOAL|Your brother admits using you as bait. What do you do?|Your Brother's Bait⟧
⟦DONE|flag|b_c11_event|Witness the key development|Narration: He admits he knew a bounty on you was possible, but still gambled that Roman would rescue you.⟧
⟦DONE|say|Express how you wish to handle “Your brother admits using you as bait. What do you do?”; ask, approach, refuse, or postpone.|State your current intent|Narration: You can state your conditions or ask for verification first.⟧

# SCENE｜Independent newsroom
⟦BG|bg_b_c11s01|Independent newsroom⟧
⟦TIME|17:00⟧
⟦IF|b_c10_a⟧
Narration: Police and counsel retain the vehicle details; risk is independently verified.
⟦/IF⟧
⟦IF|b_c10_b⟧
Narration: His team submits delivery records; concern alone cannot exempt them from scrutiny.
⟦/IF⟧
⟦IF|b_c10_c⟧
Narration: Luca's evasive answer is recorded; being your brother does not exempt him from verification.
⟦/IF⟧
Narration: On the tenth afternoon, in an independent newsroom, Nadia discovers that Luca is arranging a secret meeting under your real name with the old organization's weapons procurement contact.
Narration: Leave the booking on the desk. Find 💌 among paper icons if you want a pause before questioning or canceling.
⟦MG|g_find_letter⟧
Nadia: “This isn't protection. He wrote you into danger. Shall we question Luca directly, or cancel the booking first?”
⟦FREE⟧
Narration: The booking note reads: “My sister will bring the ledger.”

# SCENE｜Old harbor warehouse
⟦BG|bg_b_c11s02|Old harbor warehouse⟧
⟦TIME|17:25⟧
Narration: Next, in the old dock warehouse, Luca freezes at the booking in your hand, then grows angry, claiming he only wanted to draw Roman out. Across the bridge, Roman watches you argue with Luca, gripping the rail without crossing the distance you set.
Luca: “He owes me a life. Don't you want him to repay it? You want to know why I used your name? I have to answer that myself.”
⟦FREE⟧
Narration: Luca looks away. You finally see that Roman is not the person he fears facing most.

# SCENE｜Warehouse upstairs office
⟦BG|bg_b_c11s03|Warehouse upstairs office⟧
⟦TIME|17:50⟧
Narration: Next, in the warehouse's upstairs office, you open Luca's voice backup. It contains his request for a stranger to leak your itinerary.
Narration: Pause the backup audio. Repeat the screen's light sequence before deciding who receives the recording.
⟦MG|g_simon_lights⟧
Luca: “I thought I could control the risk. Now I know how ridiculous that was. Will you hear how it was arranged, or give the recording straight to the police?”
⟦FREE⟧
Narration: He admits he knew a bounty on you was possible, but still gambled that Roman would rescue you.
⟦SET|b_c11_event⟧

# CHOICE｜Your brother admits using you as bait. What do you do?
#### A｜Require Luca to stop using your name immediately
Narration: He cancels the meeting before it occurs; you are no longer bait.
⟦OPT|A|set:b_c11_a⟧
#### B｜Submit the recording and involve investigators
Narration: Evidence of misuse of your name is formally received; family ties cannot erase facts.
⟦OPT|B|set:b_c11_b⟧
#### C｜Temporarily stop all contact with both men
Narration: Both may explain facts only through counsel, leaving you free to investigate independently.
⟦OPT|C|set:b_c11_c⟧
# ·
Narration: When both men say they love you, who will respect your refusal?

# CHAPTER 12｜An Investigation of Your Own
⟦GOAL|The evidence is ready. Where will you disclose it?|An Investigation of Your Own⟧
⟦DONE|flag|b_c12_event|Witness the key development|Narration: The lawyer warns that once submitted, these materials cannot be withdrawn through personal connections.⟧
⟦DONE|say|Express how you wish to handle “The evidence is ready. Where will you disclose it?”; ask, approach, refuse, or postpone.|State your current intent|Narration: You can state your conditions or ask for verification first.⟧

# SCENE｜Harbor footbridge
⟦BG|bg_b_c12s01|Harbor footbridge⟧
⟦TIME|09:30⟧
⟦IF|b_c11_a⟧
Narration: He cancels the meeting before it occurs; you are no longer bait.
⟦/IF⟧
⟦IF|b_c11_b⟧
Narration: Evidence of misuse of your name is formally received; family ties cannot erase facts.
⟦/IF⟧
⟦IF|b_c11_c⟧
Narration: Both may explain facts only through counsel, leaving you free to investigate independently.
⟦/IF⟧
Narration: On the eleventh morning, at the harbor safety bridge, Roman takes the lawyer's call on the opposite bank instead of crossing to take control. Luca waits by the bridge. Neither can decide what “protection” means for you now.
Narration: You can pause by the bridge. Arrange the numbered 🗺 tiles, then choose the next direction.
⟦MG|g_slide_map⟧
Roman: “I have no right to ask you to forgive anyone, including me. Do you want us both out, or separate witness statements from each of us?”
⟦FREE⟧
Narration: Boat lights go out beneath the bridge one by one. A journalist's car stops on the bank. The immediate task is to cross-check the ledger against the transaction dates.

# SCENE｜Third-party audit room
⟦BG|bg_b_c12s02|Third-party audit room⟧
⟦TIME|09:55⟧
Narration: Next, in a third-party audit room, you and Nadia cross-check bills from different sources: another senior figure, not Roman, issued the lethal red stamp. Roman wants to answer you himself, but submits the record most damaging to him first.
Narration: The bill checks continue. While sources are compared, try matching six pairs of identical cards.
⟦MG|g_mem_memory⟧
Nadia: “This table explains who wanted Luca dead and who profited from him. Shall we submit the victim records first, or locate the stamp's issuer?”
⟦FREE⟧
Narration: An insurance document completes the chain connecting Roman's earlier cover-up.

# SCENE｜Lawyer's meeting room
⟦BG|bg_b_c12s03|Lawyer's meeting room⟧
⟦TIME|10:20⟧
Narration: Next, in the lawyer's witness room, Roman and counsel submit financial backups from before he burned the files. They are sufficient to expose him to criminal liability.
Roman: “I can't use your safety as an excuse to hide my crimes anymore. Do you want my admission in person, or only written testimony?”
⟦FREE⟧
Narration: The lawyer warns that once submitted, these materials cannot be withdrawn through personal connections.
⟦SET|b_c12_event⟧

# CHOICE｜The evidence is ready. Where will you disclose it?
#### A｜Protect victim identities and submit the complete ledger
Narration: Investigators receive the material with victims' privacy protected.
⟦OPT|A|set:b_c12_a⟧
#### B｜Disclose your own experience without deciding others' guilt
Narration: The journalist receives a verified personal account; criminal findings remain procedural.
⟦OPT|B|set:b_c12_b⟧
#### C｜Seal the evidence first, pending expert verification
Narration: Original files are preserved to avoid harm from unverified exposure.
⟦OPT|C|set:b_c12_c⟧
# ·
Narration: Will the ledger Roman surrendered put him in the dock too?

# CHAPTER 13｜The Devil's Testimony
⟦GOAL|Roman has signed his statement. What else will you ask?|The Devil's Testimony⟧
⟦DONE|flag|b_c13_event|Witness the key development|Narration: The mirrored ceiling ball slowly stops. At last, silence surrounds you.⟧
⟦DONE|say|Express how you wish to handle “Roman has signed his statement. What else will you ask?”; ask, approach, refuse, or postpone.|State your current intent|Narration: You can state your conditions or ask for verification first.⟧

# SCENE｜Independent media archive
⟦BG|bg_b_c13s01|Independent media archive⟧
⟦TIME|10:00⟧
⟦IF|b_c12_a⟧
Narration: Investigators receive the material with victims' privacy protected.
⟦/IF⟧
⟦IF|b_c12_b⟧
Narration: The journalist receives a verified personal account; criminal findings remain procedural.
⟦/IF⟧
⟦IF|b_c12_c⟧
Narration: Original files are preserved to avoid harm from unverified exposure.
⟦/IF⟧
Narration: On the twelfth morning, in an independent media archive, you make multiple tamper-resistant backups of the original photographs and footage, preparing them for the appropriate investigators.
Narration: The originals are filed. Find 💌 among paper icons while settling your desk, before discussing disclosure.
⟦MG|g_find_letter⟧
Independent journalist: “You decide how much of your story becomes public. Will you reveal your brother's staged death, or protect your identity first?”
⟦FREE⟧
Narration: While the backup copies are checked, try a light-sequence exercise: watch, then tap in the same order.
⟦MG|g_simon_lights⟧
Narration: An anonymous email warns: submit the evidence, and the club will burn.

# SCENE｜Legal aid center
⟦BG|bg_b_c13s02|Legal aid center⟧
⟦TIME|10:25⟧
Narration: Next, at the legal aid center, Roman signs a full statement with counsel, explicitly admitting surveillance and destruction of evidence. In his memory of the empty dance floor, an unfinished old record is all that remains; there are no guns or excuses between you. The melody ends. He wants to say the evening is beautiful, but only “I'll plead guilty” emerges.
Roman: “I accept that you hate me. I won't prescribe your answer anymore. What fact do you need me to add so you no longer have to guess?”
⟦FREE⟧
Narration: After signing, he hands the club keys to an independent receiver for the first time.

# SCENE｜Empty dance floor
⟦BG|bg_b_c13s03|Empty dance floor⟧
⟦TIME|10:50⟧
Narration: Next, on the empty dance floor, you and Roman stand in the ballroom one last time, without music. He does not reach for you, only sets down the access card from your first meeting.
Roman: “If we can meet someday, I'd like to start with an ordinary cup of coffee. Do you want to keep this memory, or tell me it shouldn't continue?”
⟦FREE⟧
Narration: The mirrored ceiling ball slowly stops. At last, silence surrounds you.
⟦SET|b_c13_event⟧

# CHOICE｜Roman has signed his statement. What else will you ask?
#### A｜Require him to accept responsibility to the end
Narration: Roman surrenders control of the club through formal procedures; confession of love cannot offset crime.
⟦OPT|A|set:b_c13_a⟧
#### B｜Admit your feelings toward him remain conflicted
Narration: He accepts the conflict without interpreting it as forgiveness.
⟦OPT|B|set:b_c13_b⟧
#### C｜Give no emotional answer; require only lawful future communication
Narration: Counsel records future contact limits, keeping the relationship clear.
⟦OPT|C|set:b_c13_c⟧
# ·
Narration: Can accountability become a new beginning?

# CHAPTER 14｜The Last Pursuit
⟦GOAL|An arson threat emerges. What do you protect first?|The Last Pursuit⟧
⟦DONE|flag|b_c14_event|Witness the key development|Narration: Three names stand side by side in the file, each with distinct legal consequences.⟧
⟦DONE|say|Express how you wish to handle “An arson threat emerges. What do you protect first?”; ask, approach, refuse, or postpone.|State your current intent|Narration: You can state your conditions or ask for verification first.⟧

# SCENE｜Club alley
⟦BG|bg_b_c14s01|Club alley⟧
⟦TIME|04:30⟧
⟦IF|b_c13_a⟧
Narration: Roman surrenders control of the club through formal procedures; confession of love cannot offset crime.
⟦/IF⟧
⟦IF|b_c13_b⟧
Narration: He accepts the conflict without interpreting it as forgiveness.
⟦/IF⟧
⟦IF|b_c13_c⟧
Narration: Counsel records future contact limits, keeping the relationship clear.
⟦/IF⟧
Narration: Before dawn on the thirteenth day, in the club's back alley, firefighters remove suspicious flammables from the doorway. The planned arson was discovered in time. Roman's men do not hunt anyone down.
Narration: Stay safely away from the cleanup. While waiting, practice blocking flashes: tap 📸 and avoid 🙂.
⟦MG|g_whack_flash⟧
Nadia: “They want to destroy the ledger, not the building. Will you send the backups away now, or first stay to document the scene?”
⟦FREE⟧
Narration: Dawn police lights reflect on wet pavement. Roman remains inside the cordon for questioning.

# SCENE｜Independent backup center
⟦BG|bg_b_c14s02|Independent backup center⟧
⟦TIME|04:55⟧
Narration: Next, in the backup center, you and Nadia verify three independent copies. The final unknown issuer is matched to a senior figure in the old organization. Behind the cordon Roman sees your car leave and orders no pursuit.
Narration: Three backups are still being checked. Stay focused by repeating the lights in their displayed order.
⟦MG|g_simon_lights⟧
Nadia: “This time you won't lose the only evidence. Will you keep your private experiences private, or ask the journalist to report only the factual chain?”
⟦FREE⟧
Narration: As the evidence is formally received, people in the distance light candles for victims. The immediate task is to complete an off-site backup of the evidence.

# SCENE｜Harbor police interview room
⟦BG|bg_b_c14s03|Harbor police interview room⟧
⟦TIME|05:20⟧
Narration: Next, in the harbor police interview room, Luca submits records of using his sister's information. Roman is questioned in a separate case. Neither has any right to argue who loves you more.
Luca: “I put you in the line of fire for revenge. Shall I keep explaining, or stop coming to see you for now?”
⟦FREE⟧
Narration: Three names stand side by side in the file, each with distinct legal consequences.
⟦SET|b_c14_event⟧

# CHOICE｜An arson threat emerges. What do you protect first?
#### A｜Prioritize evacuating bystanders and preserving the scene
Narration: Evacuation succeeds and scene evidence is retained.
⟦OPT|A|set:b_c14_a⟧
#### B｜Submit backups to several agencies simultaneously
Narration: No single fire can destroy all evidence.
⟦OPT|B|set:b_c14_b⟧
#### C｜Require Luca to explain the responsibility he omitted
Narration: Luca supplements his testimony, clarifying the old organization's hidden route.
⟦OPT|C|set:b_c14_c⟧
# ·
Narration: The arson failed to destroy the evidence. Who will first answer for their crimes?

# CHAPTER 15｜The Ledger Survives
⟦GOAL|The legal inquiry has begun. How do you want to speak?|The Ledger Survives⟧
⟦DONE|flag|b_c15_event|Witness the key development|Narration: Someone in the bookshop is reading a collection of your photographs.⟧
⟦DONE|say|Express how you wish to handle “The legal inquiry has begun. How do you want to speak?”; ask, approach, refuse, or postpone.|State your current intent|Narration: You can state your conditions or ask for verification first.⟧

# SCENE｜Independent investigation office
⟦BG|bg_b_c15s01|Independent investigation office⟧
⟦TIME|11:00⟧
⟦IF|b_c14_a⟧
Narration: Evacuation succeeds and scene evidence is retained.
⟦/IF⟧
⟦IF|b_c14_b⟧
Narration: No single fire can destroy all evidence.
⟦/IF⟧
⟦IF|b_c14_c⟧
Narration: Luca supplements his testimony, clarifying the old organization's hidden route.
⟦/IF⟧
Narration: On the fourteenth morning, in the independent investigation office, regulators receive the ledger, phone records and all surveillance material. You receive a formal notice protecting your privacy.
Narration: While intake formalities finish, find 💌 among paper icons before looking over the official receipt.
⟦MG|g_find_letter⟧
Investigator: “This is investigation material, not proof of anyone's love. Will you make your experience public, or appear only as a witness?”
⟦FREE⟧
Narration: The receipt reaches you. At last, evidence has a preservation route independent of Roman.

# SCENE｜Hospital corridor bench
⟦BG|bg_b_c15s02|Hospital corridor bench⟧
⟦TIME|11:25⟧
Narration: Next, on a hospital corridor bench, you finish Luca's written explanation. He admits staging his death and using you to draw Roman out. Nothing asks for forgiveness. There is no “wait for me”; for once, you need not be responsible for him.
Luca: “You can see me as your brother, or not see me for now. How would you want us to begin again, or do you need time?”
⟦FREE⟧
Narration: A nurse wheels a trolley past. The real world has not stopped for anyone.

# SCENE｜Independent bookshop
⟦BG|bg_b_c15s03|Independent bookshop⟧
⟦TIME|11:50⟧
Narration: Next, in the independent bookshop by the window, Roman's lawyer delivers a supplemental statement without romantic implications and an apology that permits no reply.
Narration: The letters can wait for an answer. Find 💌 among paper icons and leave yourself time to read.
⟦MG|g_find_letter⟧
Independent lawyer: “His case continues. So does your life. Will you have the letters kept here, or end contact entirely?”
⟦FREE⟧
Narration: Someone in the bookshop is reading a collection of your photographs.
⟦SET|b_c15_event⟧

# CHOICE｜The legal inquiry has begun. How do you want to speak?
#### A｜Disclose only that evidence was submitted, without private romance
Narration: The public sees case progress while personal privacy is retained.
⟦OPT|A|set:b_c15_a⟧
#### B｜Tell your journey through your photography
Narration: The exhibition preserves your version without whitewashing Roman.
⟦OPT|B|set:b_c15_b⟧
#### C｜Remain silent and first restore a peaceful life
Narration: Your silence is respected without affecting formal handling of the evidence.
⟦OPT|C|set:b_c15_c⟧
# ·
Narration: What must it cost to want to love a guilty man?

# CHAPTER 16｜The Door You Open
⟦GOAL|If he respects boundaries in future, how will you live?|The Door You Open⟧
⟦DONE|flag|b_c16_event|Witness the key development|Narration: Only the next scene you actively choose remains in the camera's frame.⟧
⟦DONE|say|Express how you wish to handle “If he respects boundaries in future, how will you live?”; ask, approach, refuse, or postpone.|State your current intent|Narration: You can state your conditions or ask for verification first.⟧

# SCENE｜Corner photography gallery
⟦BG|bg_b_c16s01|Corner photography gallery⟧
⟦TIME|10:30⟧
⟦IF|b_c15_a⟧
Narration: The public sees case progress while personal privacy is retained.
⟦/IF⟧
⟦IF|b_c15_b⟧
Narration: The exhibition preserves your version without whitewashing Roman.
⟦/IF⟧
⟦IF|b_c15_c⟧
Narration: Your silence is respected without affecting formal handling of the evidence.
⟦/IF⟧
Narration: Several months later, at the corner photography gallery, your own documentary exhibition opens. Neither Roman nor Luca hangs on the walls: only the city and people you photographed.
Narration: Before the exhibition begins, arrange the numbered 📷 tiles and bring your attention back to your work.
⟦MG|g_slide_photo⟧
Gallery owner: “This work can carry your full name. What will you call the exhibition, or would you first read the court-forwarded letter?”
⟦FREE⟧
Narration: There is still photography preparation for the exhibition. Try tapping 📸 and avoiding 🙂, then return your attention to the work.
⟦MG|g_whack_flash⟧
Narration: The entrance wind chime rings. A familiar lawyer stands outside.

# SCENE｜Quiet gallery lounge
⟦BG|bg_b_c16s02|Quiet gallery lounge⟧
⟦TIME|10:55⟧
Narration: Next, in the quiet gallery lounge, Roman's letter through counsel contains only case progress and a promise he can actually keep: never to investigate your private life without permission. There is no perfume or seductive language, only a restrained, factual update.
Roman (letter): “If a future opportunity comes, I only want you to know I finally learned not to cross boundaries.”
⟦FREE⟧
Narration: You may answer or leave the letter as this story's ending. The blank envelope space contains no request for a reply and no pressure.

# SCENE｜Morning city street
⟦BG|bg_b_c16s03|Morning city street⟧
⟦TIME|11:20⟧
Narration: Next, on the city's morning street, people buy flowers and hurry for the subway. You walk at your own pace; your phone no longer receives strange tracking notices. Sunlight falls across the bridge; last night's dangerous men return to their own responsibilities.
Narration: What future relationship would you want with him, or would you rather continue your own life?
⟦FREE⟧
Narration: Only the next scene you actively choose remains in the camera's frame.
⟦SET|b_c16_event⟧

# CHOICE｜If he respects boundaries in future, how will you live?
#### A｜Leave room to know him slowly, only where lawful and safe
Narration: There is no promise of immediate reunion, only room for honest future communication.
⟦OPT|A|set:b_c16_a⟧
#### B｜End the romantic possibility and retain only necessary factual contact
Narration: Roman makes no further private demands; your life remains whole.
⟦OPT|B|set:b_c16_b⟧
#### C｜Choose a free new life independent of anyone
Narration: You define love for yourself and no longer wait for anyone's redemption.
⟦OPT|C|set:b_c16_c⟧
# ·
Narration: The lens faces the distance. No one decides whom you love for you.
