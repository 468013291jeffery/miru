# CHAPTER 1｜The Death Order
⟦GOAL|Understand the Death Order and decide your next step.|The Death Order⟧
⟦DONE|flag|b_c01_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning The Death Order|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Underground club
⟦BG|bg_b_c01s01|Underground club; Player, Roman; Bass shakes the glasses as you place the signed detention order in front of Roman. He pushes the gun on the table away from both of you.⟧
⟦TIME|02:00⟧
Narration: At two in the morning, at the underground club.
Narration: Bass shakes the glasses as you place the signed detention order in front of Roman.
Narration: He pushes the gun on the table away from both of you.
Roman: “I signed the detention order. I didn't authorize his death.”
⟦FREE⟧
Narration: Next, if you want to continue: Private club office.

# SCENE｜Private club office
⟦BG|bg_b_c01s02|Private club office; Player, Roman; He produces three versions of the order. Only one bears the later red mark. A warning light flashes outside.⟧
⟦TIME|02:25⟧
Narration: A little later. Private club office.
Narration: He produces three versions of the order.
Narration: Only one bears the later red mark.
Narration: A warning light flashes outside.
Roman: “Don't take my word for it. Look at the documents.”
⟦FREE⟧
Narration: Next, if you want to continue: Club stairwell.

# SCENE｜Club stairwell
⟦BG|bg_b_c01s03|Club stairwell; Player, Roman; The lights go out. Roman offers the exit key. An emergency screen lists your name as the target, and Roman Moretti as the buyer.⟧
⟦TIME|02:50⟧
Narration: A little later. Club stairwell.
Narration: The lights go out.
Narration: Roman offers the exit key.
Narration: An emergency screen lists your name as the target, and Roman Moretti as the buyer.
Roman: “I can explain why I bought it. You don't have to stay here to hear me.”
⟦FREE⟧
⟦SET|b_c01_event⟧

# CHOICE｜Who first put your name on the list?
#### A｜Photograph the list and leave
Narration: The independent lawyer receives a copy.
⟦OPT|A|set:b_c01_a⟧
#### B｜Demand an explanation for buying the bounty
Narration: Roman admits buying it to prevent others accepting it; the statement is recorded.
⟦OPT|B|set:b_c01_b⟧
#### C｜Verify the original order while declining protection
Narration: Roman releases the original and leaves safety decisions to you.
⟦OPT|C|set:b_c01_c⟧
# ·
Narration: Who first put your name on the list?

# CHAPTER 2｜The Man Outside Your Door
⟦GOAL|Understand the Man Outside Your Door and decide your next step.|The Man Outside Your Door⟧
⟦DONE|flag|b_c02_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning The Man Outside Your Door|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Independent lawyer's office
⟦BG|bg_b_c02s01|Independent lawyer's office; Player, Roman; The lawyer presents three temporary accommodation options and independent contact details. Roman waits by the window.⟧
⟦TIME|22:00⟧
Narration: The following evening, at the independent lawyer's office.
⟦IF|b_c01_a⟧
Narration: The independent lawyer receives a copy.
⟦/IF⟧
⟦IF|b_c01_b⟧
Narration: Roman admits buying it to prevent others accepting it; the statement is recorded.
⟦/IF⟧
⟦IF|b_c01_c⟧
Narration: Roman releases the original and leaves safety decisions to you.
⟦/IF⟧
Narration: The lawyer presents three temporary accommodation options and independent contact details.
Narration: Roman waits by the window.
Roman: “You can choose somewhere I don't know about.”
⟦FREE⟧
Narration: Next, if you want to continue: Apartment living room.

# SCENE｜Apartment living room
⟦BG|bg_b_c02s02|Apartment living room; Player, Roman; An old jazz record appears under the door, with a childhood code inside. The courier label is only three weeks old. Roman leaves a coffee outside.⟧
⟦TIME|22:25⟧
Narration: A little later. Apartment living room.
Narration: An old jazz record appears under the door, with a childhood code inside.
Narration: The courier label is only three weeks old.
Narration: Roman leaves a coffee outside.
Roman: “Your brother used to tell me things. Ask me exactly what.”
⟦FREE⟧
Narration: Next, if you want to continue: Apartment corridor.

# SCENE｜Apartment corridor
⟦BG|bg_b_c02s03|Apartment corridor; Player, Roman; He sits at the other end of the corridor with an unopened first-aid kit. A scorched warehouse photograph rests by the door.⟧
⟦TIME|22:50⟧
Narration: A little later. Apartment corridor.
Narration: He sits at the other end of the corridor with an unopened first-aid kit.
Narration: A scorched warehouse photograph rests by the door.
Roman: “I'm not coming in. If you want me gone, say so.”
⟦FREE⟧
⟦SET|b_c02_event⟧

# CHOICE｜Is his concern protection or surveillance?
#### A｜Have Nadia independently identify the record's source
Narration: The courier record and code yield a new lead.
⟦OPT|A|set:b_c02_a⟧
#### B｜Ask Roman for a written account of Luca's secrets
Narration: His account is fixed for later verification.
⟦OPT|B|set:b_c02_b⟧
#### C｜Move elsewhere to avoid surveillance
Narration: The lawyer arranges independent accommodation without disclosing the address to Roman.
⟦OPT|C|set:b_c02_c⟧
# ·
Narration: Is his concern protection or surveillance?

# CHAPTER 3｜Capture or Murder
⟦GOAL|Understand capture or Murder and decide your next step.|Capture or Murder⟧
⟦DONE|flag|b_c03_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning Capture or Murder|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Records facility
⟦BG|bg_b_c03s01|Records facility; Player, Nadia; Under examination, the red mark proves later than Roman's signature. An archivist's number has been erased.⟧
⟦TIME|11:00⟧
Narration: On the third morning, at the records facility.
⟦IF|b_c02_a⟧
Narration: The courier record and code yield a new lead.
⟦/IF⟧
⟦IF|b_c02_b⟧
Narration: His account is fixed for later verification.
⟦/IF⟧
⟦IF|b_c02_c⟧
Narration: The lawyer arranges independent accommodation without disclosing the address to Roman.
⟦/IF⟧
Narration: Under examination, the red mark proves later than Roman's signature.
Narration: An archivist's number has been erased.
Nadia: “The paper and ink disagree with the official chronology.”
⟦FREE⟧
Narration: Next, if you want to continue: Closed club office.

# SCENE｜Closed club office
⟦BG|bg_b_c03s02|Closed club office; Player, Roman; Roman admits destroying original footage after the operation to hide transactions in his own ledger. He reveals an old burn beneath his watch.⟧
⟦TIME|11:25⟧
Narration: A little later. Closed club office.
Narration: Roman admits destroying original footage after the operation to hide transactions in his own ledger.
Narration: He reveals an old burn beneath his watch.
Roman: “I destroyed evidence. I'm not pretending I'm innocent.”
⟦FREE⟧
Narration: Next, if you want to continue: Photography darkroom.

# SCENE｜Photography darkroom
⟦BG|bg_b_c03s03|Photography darkroom; Player, Nadia; Luca's last call to your number was redirected. A fragment of his voice says not to trust the funeral.⟧
⟦TIME|11:50⟧
Narration: A little later. Photography darkroom.
Narration: Luca's last call to your number was redirected.
Narration: A fragment of his voice says not to trust the funeral.
Nadia: “We need to find where this call was diverted.”
⟦FREE⟧
⟦SET|b_c03_event⟧

# CHOICE｜What was Luca trying to say when he called?
#### A｜Demand the name of the last person who handled the order
Narration: Roman provides the name and transfer record.
⟦OPT|A|set:b_c03_a⟧
#### B｜Trace the redirected call
Narration: The communications records are preserved.
⟦OPT|B|set:b_c03_b⟧
#### C｜End private meetings with Roman
Narration: Evidence travels through counsel instead.
⟦OPT|C|set:b_c03_c⟧
# ·
Narration: What was Luca trying to say when he called?

# CHAPTER 4｜Just One Dance
⟦GOAL|Understand just One Dance and decide your next step.|Just One Dance⟧
⟦DONE|flag|b_c04_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning Just One Dance|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Midnight dance floor
⟦BG|bg_b_c04s01|Midnight dance floor; Player, Roman; A guest calls you Moretti's new woman. Roman stops an arm's length away rather than taking your waist.⟧
⟦TIME|23:00⟧
Narration: On the fourth night, at the midnight dance floor.
⟦IF|b_c03_a⟧
Narration: Roman provides the name and transfer record.
⟦/IF⟧
⟦IF|b_c03_b⟧
Narration: The communications records are preserved.
⟦/IF⟧
⟦IF|b_c03_c⟧
Narration: Evidence travels through counsel instead.
⟦/IF⟧
Narration: A guest calls you Moretti's new woman.
Narration: Roman stops an arm's length away rather than taking your waist.
Roman: “She doesn't belong to me. Do you want to stay here?”
⟦FREE⟧
Narration: Next, if you want to continue: Red booth beside the dance floor.

# SCENE｜Red booth beside the dance floor
⟦BG|bg_b_c04s02|Red booth beside the dance floor; Player, Roman; A note carries the mark inside Luca's old ring. Roman recognizes it. Nadia appears behind the curtain.⟧
⟦TIME|23:25⟧
Narration: A little later. Red booth beside the dance floor.
Narration: A note carries the mark inside Luca's old ring.
Narration: Roman recognizes it.
Narration: Nadia appears behind the curtain.
Roman: “I want to be close. That doesn't mean you have to let me.”
⟦FREE⟧
Narration: Next, if you want to continue: Backstage passage.

# SCENE｜Backstage passage
⟦BG|bg_b_c04s03|Backstage passage; Player, Nadia; Nadia produces a harbor photograph showing someone leaving with Luca's ring. Roman recognizes the engraved date.⟧
⟦TIME|23:50⟧
Narration: A little later. Backstage passage.
Narration: Nadia produces a harbor photograph showing someone leaving with Luca's ring.
Narration: Roman recognizes the engraved date.
Nadia: “This photograph predates the report. Let's keep the original.”
⟦FREE⟧
⟦SET|b_c04_event⟧

# CHOICE｜Can tenderness and guilt exist in the same person?
#### A｜Choose to dance and use the conversation to ask questions
Narration: The conversation yields the note only if the dance is explicitly chosen.
⟦OPT|A|set:b_c04_a⟧
#### B｜Demand Roman correct the possessive label
Narration: He publicly corrects the description.
⟦OPT|B|set:b_c04_b⟧
#### C｜Decline the dance and investigate the note with Nadia
Narration: Nadia preserves the clue without any dance occurring.
⟦OPT|C|set:b_c04_c⟧
# ·
Narration: Can tenderness and guilt exist in the same person?

# CHAPTER 5｜He Bleeds Too
⟦GOAL|Understand he Bleeds Too and decide your next step.|He Bleeds Too⟧
⟦DONE|flag|b_c05_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning He Bleeds Too|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Garage medical area
⟦BG|bg_b_c05s01|Garage medical area; Player, Roman; Roman is wounded while shielding a witness who was about to testify. He checks the driver's condition before sitting.⟧
⟦TIME|03:00⟧
Narration: On the fifth morning, at the garage medical area.
⟦IF|b_c04_a⟧
Narration: The conversation yields the note only if the dance is explicitly chosen.
⟦/IF⟧
⟦IF|b_c04_b⟧
Narration: He publicly corrects the description.
⟦/IF⟧
⟦IF|b_c04_c⟧
Narration: Nadia preserves the clue without any dance occurring.
⟦/IF⟧
Narration: Roman is wounded while shielding a witness who was about to testify.
Narration: He checks the driver's condition before sitting.
Roman: “Make sure he's all right. Then you can ask me whatever you need.”
⟦FREE⟧
Narration: Next, if you want to continue: Temporary clinic.

# SCENE｜Temporary clinic
⟦BG|bg_b_c05s02|Temporary clinic; Player, Roman; A doctor treats his shoulder. A familiar key ring was registered as evidence weeks after Luca's reported death.⟧
⟦TIME|03:25⟧
Narration: A little later. Temporary clinic.
Narration: A doctor treats his shoulder.
Narration: A familiar key ring was registered as evidence weeks after Luca's reported death.
Roman: “Don't let seeing me bleed stop you from asking what you came here to ask.”
⟦FREE⟧
Narration: Next, if you want to continue: Parking office.

# SCENE｜Parking office
⟦BG|bg_b_c05s03|Parking office; Player, Nadia; The hospital intake scan shows someone delivered the key ring after Luca supposedly died. The person's wrist bears a familiar design.⟧
⟦TIME|03:50⟧
Narration: A little later. Parking office.
Narration: The hospital intake scan shows someone delivered the key ring after Luca supposedly died.
Narration: The person's wrist bears a familiar design.
Nadia: “That date matters more than anybody's promise.”
⟦FREE⟧
⟦SET|b_c05_event⟧

# CHOICE｜How could Luca's belongings appear after his death?
#### A｜Assist the doctor without agreeing to intimacy
Narration: Medical care is not interpreted as absolution.
⟦OPT|A|set:b_c05_a⟧
#### B｜Examine the key ring's entry date
Narration: The hospital preserves the chain of custody.
⟦OPT|B|set:b_c05_b⟧
#### C｜Leave and commission an independent examination
Narration: Nadia obtains a copy without requiring you to remain with Roman.
⟦OPT|C|set:b_c05_c⟧
# ·
Narration: How could Luca's belongings appear after his death?

# CHAPTER 6｜The Private File
⟦GOAL|Understand the Private File and decide your next step.|The Private File⟧
⟦DONE|flag|b_c06_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning The Private File|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Roman's study
⟦BG|bg_b_c06s01|Roman's study; Player, Roman; A wall behind the bookcase contains your interview photos, schedules and old address. Roman places the storage devices into evidence bags.⟧
⟦TIME|14:00⟧
Narration: On the sixth afternoon, at Roman's study.
⟦IF|b_c05_a⟧
Narration: Medical care is not interpreted as absolution.
⟦/IF⟧
⟦IF|b_c05_b⟧
Narration: The hospital preserves the chain of custody.
⟦/IF⟧
⟦IF|b_c05_c⟧
Narration: Nadia obtains a copy without requiring you to remain with Roman.
⟦/IF⟧
Narration: A wall behind the bookcase contains your interview photos, schedules and old address.
Narration: Roman places the storage devices into evidence bags.
Roman: “I had no right to collect this. Look through it with your lawyer.”
⟦FREE⟧
Narration: Next, if you want to continue: Study storage room.

# SCENE｜Study storage room
⟦BG|bg_b_c06s02|Study storage room; Player, Roman; He revokes access under counsel's supervision. The earliest photo predates your investigation.⟧
⟦TIME|14:25⟧
Narration: A little later. Study storage room.
Narration: He revokes access under counsel's supervision.
Narration: The earliest photo predates your investigation.
Roman: “I won't ask you to trust me because I turned it over.”
⟦FREE⟧
Narration: Next, if you want to continue: Independent café.

# SCENE｜Independent café
⟦BG|bg_b_c06s03|Independent café; Player, Nadia; A photograph has Luca's childhood code on the reverse. Its location clue points to an abandoned aquarium.⟧
⟦TIME|14:50⟧
Narration: A little later. Independent café.
Narration: A photograph has Luca's childhood code on the reverse.
Narration: Its location clue points to an abandoned aquarium.
Nadia: “Your brother may have used the file to send a message.”
⟦FREE⟧
⟦SET|b_c06_event⟧

# CHOICE｜Who started looking for you before you knew about Roman?
#### A｜Require access to cease and evidence to be secured
Narration: Roman relinquishes access while the material is preserved.
⟦OPT|A|set:b_c06_a⟧
#### B｜Request an investigation of the surveillance
Narration: The records enter independent review.
⟦OPT|B|set:b_c06_b⟧
#### C｜Cut off private contact
Narration: Roman is restricted to legal channels.
⟦OPT|C|set:b_c06_c⟧
# ·
Narration: Who started looking for you before you knew about Roman?

# CHAPTER 7｜A Brother Still Alive
⟦GOAL|Understand a Brother Still Alive and decide your next step.|A Brother Still Alive⟧
⟦DONE|flag|b_c07_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning A Brother Still Alive|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Suburban station records room
⟦BG|bg_b_c07s01|Suburban station records room; Player, Nadia; Footage from a month earlier shows a man with Luca's distinctive brow scar. A new voice message contains your childhood code.⟧
⟦TIME|16:00⟧
Narration: On the seventh evening, at the suburban station records room.
⟦IF|b_c06_a⟧
Narration: Roman relinquishes access while the material is preserved.
⟦/IF⟧
⟦IF|b_c06_b⟧
Narration: The records enter independent review.
⟦/IF⟧
⟦IF|b_c06_c⟧
Narration: Roman is restricted to legal channels.
⟦/IF⟧
Narration: Footage from a month earlier shows a man with Luca's distinctive brow scar.
Narration: A new voice message contains your childhood code.
Nadia: “We need to compare the voice and the date.”
⟦FREE⟧
Narration: Next, if you want to continue: Independent law office.

# SCENE｜Independent law office
⟦BG|bg_b_c07s02|Independent law office; Player, Roman; Roman listens to the message and admits he has only just learned about the footage. Counsel offers a safe route to the aquarium.⟧
⟦TIME|16:25⟧
Narration: A little later. Independent law office.
Narration: Roman listens to the message and admits he has only just learned about the footage.
Narration: Counsel offers a safe route to the aquarium.
Roman: “I didn't know he was alive. I won't claim I did.”
⟦FREE⟧
Narration: Next, if you want to continue: Audio examination room.

# SCENE｜Audio examination room
⟦BG|bg_b_c07s03|Audio examination room; Player, Nadia; Recent background announcements establish the recording is new. Luca's voice warns against giving the hard drive to Roman.⟧
⟦TIME|16:50⟧
Narration: A little later. Audio examination room.
Narration: Recent background announcements establish the recording is new.
Narration: Luca's voice warns against giving the hard drive to Roman.
Nadia: “We can verify the identity before deciding to meet.”
⟦FREE⟧
⟦SET|b_c07_event⟧

# CHOICE｜Why does Luca warn you about the drive?
#### A｜Arrange a meeting with independent counsel present
Narration: A witness and safe arrangements are established.
⟦OPT|A|set:b_c07_a⟧
#### B｜Allow private conversation with independent emergency contact
Narration: Private discussion remains optional and independent of Roman.
⟦OPT|B|set:b_c07_b⟧
#### C｜Verify voice and identity first
Narration: Authentication precedes the meeting.
⟦OPT|C|set:b_c07_c⟧
# ·
Narration: Why does Luca warn you about the drive?

# CHAPTER 8｜Half a Truth at the Aquarium
⟦GOAL|Understand half a Truth at the Aquarium and decide your next step.|Half a Truth at the Aquarium⟧
⟦DONE|flag|b_c08_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning Half a Truth at the Aquarium|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Abandoned aquarium ticket window
⟦BG|bg_b_c08s01|Abandoned aquarium ticket window; Player, Luca; A token from your childhood slides beneath the glass. A familiar silhouette waits beyond the dark tank.⟧
⟦TIME|19:00⟧
Narration: That night, at the abandoned aquarium ticket window.
⟦IF|b_c07_a⟧
Narration: A witness and safe arrangements are established.
⟦/IF⟧
⟦IF|b_c07_b⟧
Narration: Private discussion remains optional and independent of Roman.
⟦/IF⟧
⟦IF|b_c07_c⟧
Narration: Authentication precedes the meeting.
⟦/IF⟧
Narration: A token from your childhood slides beneath the glass.
Narration: A familiar silhouette waits beyond the dark tank.
Luca: “You recognize it, don't you?”
⟦FREE⟧
Narration: Next, if you want to continue: Aquarium glass corridor.

# SCENE｜Aquarium glass corridor
⟦BG|bg_b_c08s02|Aquarium glass corridor; Player, Luca; Luca approaches with a new scar, then stops before embracing you. Roman waits at the exit. Luca avoids explaining how he survived.⟧
⟦TIME|19:25⟧
Narration: A little later. Aquarium glass corridor.
Narration: Luca approaches with a new scar, then stops before embracing you.
Narration: Roman waits at the exit.
Narration: Luca avoids explaining how he survived.
Luca: “I wanted to come back. I couldn't tell you everything.”
⟦FREE⟧
Narration: Next, if you want to continue: Aquarium storage room.

# SCENE｜Aquarium storage room
⟦BG|bg_b_c08s03|Aquarium storage room; Player, Luca; Luca offers a black hard drive containing alleged records of Roman's crimes. A note in the cabinet lists your name and meeting time.⟧
⟦TIME|19:50⟧
Narration: A little later. Aquarium storage room.
Narration: Luca offers a black hard drive containing alleged records of Roman's crimes.
Narration: A note in the cabinet lists your name and meeting time.
Luca: “Don't give it to him. Please.”
⟦FREE⟧
⟦SET|b_c08_event⟧

# CHOICE｜Why does your living brother need you to hide his evidence?
#### A｜Reject concealment and request third-party custody
Narration: The drive enters independent custody.
⟦OPT|A|set:b_c08_a⟧
#### B｜Preserve a copy and document the transfer
Narration: Source and transfer time are recorded.
⟦OPT|B|set:b_c08_b⟧
#### C｜Require Luca to explain his survival
Narration: Luca acknowledges arranging his apparent death.
⟦OPT|C|set:b_c08_c⟧
# ·
Narration: Why does your living brother need you to hide his evidence?

# CHAPTER 9｜The Plan Before the Attraction
⟦GOAL|Understand the Plan Before the Attraction and decide your next step.|The Plan Before the Attraction⟧
⟦DONE|flag|b_c09_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning The Plan Before the Attraction|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Aquarium exit
⟦BG|bg_b_c09s01|Aquarium exit; Player, Roman; Roman stays outside as agreed. Luca calls after you not to get into Roman's car.⟧
⟦TIME|21:00⟧
Narration: The following night, at the aquarium exit.
⟦IF|b_c08_a⟧
Narration: The drive enters independent custody.
⟦/IF⟧
⟦IF|b_c08_b⟧
Narration: Source and transfer time are recorded.
⟦/IF⟧
⟦IF|b_c08_c⟧
Narration: Luca acknowledges arranging his apparent death.
⟦/IF⟧
Narration: Roman stays outside as agreed.
Narration: Luca calls after you not to get into Roman's car.
Roman: “I won't decide how you leave.”
⟦FREE⟧
Narration: Next, if you want to continue: Empty jazz bar.

# SCENE｜Empty jazz bar
⟦BG|bg_b_c09s02|Empty jazz bar; Player, Roman; Roman lays out the documents detailing his plans to approach you. He gives his device to counsel and stops the private operation.⟧
⟦TIME|21:25⟧
Narration: A little later. Empty jazz bar.
Narration: Roman lays out the documents detailing his plans to approach you.
Narration: He gives his device to counsel and stops the private operation.
Roman: “I missed you. But I started this with a lie.”
⟦FREE⟧
Narration: Next, if you want to continue: Rain canopy outside the bar.

# SCENE｜Rain canopy outside the bar
⟦BG|bg_b_c09s03|Rain canopy outside the bar; Player, Roman; He refuses a proposal from his staff to resume tracking you. A courier arrives with the drive's password hint.⟧
⟦TIME|21:50⟧
Narration: A little later. Rain canopy outside the bar.
Narration: He refuses a proposal from his staff to resume tracking you.
Narration: A courier arrives with the drive's password hint.
Roman: “I can stop contacting you. I can still provide the documents.”
⟦FREE⟧
⟦SET|b_c09_event⟧

# CHOICE｜How much of his tenderness was planned?
#### A｜Demand he stop private approaches
Narration: The contact plan is revoked.
⟦OPT|A|set:b_c09_a⟧
#### B｜Allow evidence exchange through counsel
Narration: Investigation continues while intimacy is paused.
⟦OPT|B|set:b_c09_b⟧
#### C｜Hear his explanation without promising trust
Narration: The complete contact plan is given to counsel.
⟦OPT|C|set:b_c09_c⟧
# ·
Narration: How much of his tenderness was planned?

# CHAPTER 10｜Out of His Shadow
⟦GOAL|Understand out of His Shadow and decide your next step.|Out of His Shadow⟧
⟦DONE|flag|b_c10_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning Out of His Shadow|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Independent data lab
⟦BG|bg_b_c10s01|Independent data lab; Player, Nadia; The drive shows Roman objected to certain illicit transactions, yet enabled a money-laundering network.⟧
⟦TIME|08:30⟧
Narration: The ninth morning, at the independent data lab.
⟦IF|b_c09_a⟧
Narration: The contact plan is revoked.
⟦/IF⟧
⟦IF|b_c09_b⟧
Narration: Investigation continues while intimacy is paused.
⟦/IF⟧
⟦IF|b_c09_c⟧
Narration: The complete contact plan is given to counsel.
⟦/IF⟧
Narration: The drive shows Roman objected to certain illicit transactions, yet enabled a money-laundering network.
Nadia: “Opposing it doesn't make him innocent.”
⟦FREE⟧
Narration: Next, if you want to continue: New apartment entrance.

# SCENE｜New apartment entrance
⟦BG|bg_b_c10s02|New apartment entrance; Player, Nadia; You have an independently rented apartment. Coffee beans and a warning note appear outside despite the new address.⟧
⟦TIME|08:55⟧
Narration: A little later. New apartment entrance.
Narration: You have an independently rented apartment.
Narration: Coffee beans and a warning note appear outside despite the new address.
Nadia: “Whoever sent this knew the address. We should verify the delivery.”
⟦FREE⟧
Narration: Next, if you want to continue: Small table by the window.

# SCENE｜Small table by the window
⟦BG|bg_b_c10s03|Small table by the window; Player, Nadia; Roman's short apology offers his surveillance records to investigators. A delivery van circles the block again.⟧
⟦TIME|09:20⟧
Narration: A little later. Small table by the window.
Narration: Roman's short apology offers his surveillance records to investigators.
Narration: A delivery van circles the block again.
Nadia: “We don't have to guess. We can document what happened.”
⟦FREE⟧
⟦SET|b_c10_event⟧

# CHOICE｜Why is Luca's meeting list expecting you to bring a ledger?
#### A｜Report the unfamiliar vehicle through appropriate authorities
Narration: Its details are retained independently.
⟦OPT|A|set:b_c10_a⟧
#### B｜Ask Roman's team to explain the delivery
Narration: Delivery records are provided for review.
⟦OPT|B|set:b_c10_b⟧
#### C｜Ask Luca whether he shared your address
Narration: His response is retained for comparison.
⟦OPT|C|set:b_c10_c⟧
# ·
Narration: Why is Luca's meeting list expecting you to bring a ledger?

# CHAPTER 11｜Your Brother's Bait
⟦GOAL|Understand your Brother's Bait and decide your next step.|Your Brother's Bait⟧
⟦DONE|flag|b_c11_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning Your Brother's Bait|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Independent newsroom
⟦BG|bg_b_c11s01|Independent newsroom; Player, Nadia; A reservation uses your real name for a meeting with an old criminal contact. The note says Luca's sister will bring the ledger.⟧
⟦TIME|17:00⟧
Narration: The tenth afternoon, at the independent newsroom.
⟦IF|b_c10_a⟧
Narration: Its details are retained independently.
⟦/IF⟧
⟦IF|b_c10_b⟧
Narration: Delivery records are provided for review.
⟦/IF⟧
⟦IF|b_c10_c⟧
Narration: His response is retained for comparison.
⟦/IF⟧
Narration: A reservation uses your real name for a meeting with an old criminal contact.
Narration: The note says Luca's sister will bring the ledger.
Nadia: “He put you on the list without asking.”
⟦FREE⟧
Narration: Next, if you want to continue: Old harbor warehouse.

# SCENE｜Old harbor warehouse
⟦BG|bg_b_c11s02|Old harbor warehouse; Player, Luca; Luca sees the booking and admits wanting to draw Roman out. Roman stays across the bridge rather than intervening.⟧
⟦TIME|17:25⟧
Narration: A little later. Old harbor warehouse.
Narration: Luca sees the booking and admits wanting to draw Roman out.
Narration: Roman stays across the bridge rather than intervening.
Luca: “I thought he'd come if you were there.”
⟦FREE⟧
Narration: Next, if you want to continue: Warehouse upstairs office.

# SCENE｜Warehouse upstairs office
⟦BG|bg_b_c11s03|Warehouse upstairs office; Player, Luca; A recording reveals Luca arranged for your itinerary to be leaked. He knew the bounty was possible and gambled Roman would rescue you.⟧
⟦TIME|17:50⟧
Narration: A little later. Warehouse upstairs office.
Narration: A recording reveals Luca arranged for your itinerary to be leaked.
Narration: He knew the bounty was possible and gambled Roman would rescue you.
Luca: “I told myself he'd never let anything happen to you.”
⟦FREE⟧
⟦SET|b_c11_event⟧

# CHOICE｜Who is willing to respect your refusal?
#### A｜Require Luca to stop using your name
Narration: The unapproved meeting is canceled.
⟦OPT|A|set:b_c11_a⟧
#### B｜Give the recording to investigators
Narration: Evidence of Luca's involvement is formally retained.
⟦OPT|B|set:b_c11_b⟧
#### C｜Pause all contact with both men
Narration: Counsel handles further statements independently.
⟦OPT|C|set:b_c11_c⟧
# ·
Narration: Who is willing to respect your refusal?

# CHAPTER 12｜An Investigation of Your Own
⟦GOAL|Understand an Investigation of Your Own and decide your next step.|An Investigation of Your Own⟧
⟦DONE|flag|b_c12_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning An Investigation of Your Own|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Harbor footbridge
⟦BG|bg_b_c12s01|Harbor footbridge; Player, Nadia; Roman remains on the far side. Luca waits nearby. A journalist's car arrives, and neither man controls the inquiry.⟧
⟦TIME|09:30⟧
Narration: The eleventh morning, at the harbor footbridge.
⟦IF|b_c11_a⟧
Narration: The unapproved meeting is canceled.
⟦/IF⟧
⟦IF|b_c11_b⟧
Narration: Evidence of Luca's involvement is formally retained.
⟦/IF⟧
⟦IF|b_c11_c⟧
Narration: Counsel handles further statements independently.
⟦/IF⟧
Narration: Roman remains on the far side.
Narration: Luca waits nearby.
Narration: A journalist's car arrives, and neither man controls the inquiry.
Nadia: “We can choose where the documents go without them.”
⟦FREE⟧
Narration: Next, if you want to continue: Third-party audit room.

# SCENE｜Third-party audit room
⟦BG|bg_b_c12s02|Third-party audit room; Player, Nadia; Cross-checks show the lethal order came from another senior figure. An insurance record connects Roman to the subsequent cover-up.⟧
⟦TIME|09:55⟧
Narration: A little later. Third-party audit room.
Narration: Cross-checks show the lethal order came from another senior figure.
Narration: An insurance record connects Roman to the subsequent cover-up.
Nadia: “He didn't sign that order, but this evidence still implicates him.”
⟦FREE⟧
Narration: Next, if you want to continue: Lawyer's meeting room.

# SCENE｜Lawyer's meeting room
⟦BG|bg_b_c12s03|Lawyer's meeting room; Player, Roman; Roman submits financial backups that expose his own wrongdoing. Counsel explains that the submission cannot be privately withdrawn.⟧
⟦TIME|10:20⟧
Narration: A little later. Lawyer's meeting room.
Narration: Roman submits financial backups that expose his own wrongdoing.
Narration: Counsel explains that the submission cannot be privately withdrawn.
Roman: “Put it in the file. All of it.”
⟦FREE⟧
⟦SET|b_c12_event⟧

# CHOICE｜Will the ledger Roman surrendered also lead to charges against him?
#### A｜Protect victim identities and submit the complete ledger
Narration: Investigators receive evidence with privacy protections.
⟦OPT|A|set:b_c12_a⟧
#### B｜Disclose your own experience without declaring anyone guilty
Narration: The verified personal account goes to the journalist.
⟦OPT|B|set:b_c12_b⟧
#### C｜Preserve originals pending expert review
Narration: The records remain intact for formal verification.
⟦OPT|C|set:b_c12_c⟧
# ·
Narration: Will the ledger Roman surrendered also lead to charges against him?

# CHAPTER 13｜The Devil's Testimony
⟦GOAL|Understand the Devil's Testimony and decide your next step.|The Devil's Testimony⟧
⟦DONE|flag|b_c13_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning The Devil's Testimony|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Independent media archive
⟦BG|bg_b_c13s01|Independent media archive; Player, Nadia; Verified originals are duplicated and prepared for formal submission. An anonymous message threatens the club if the evidence is delivered.⟧
⟦TIME|10:00⟧
Narration: The twelfth morning, at the independent media archive.
⟦IF|b_c12_a⟧
Narration: Investigators receive evidence with privacy protections.
⟦/IF⟧
⟦IF|b_c12_b⟧
Narration: The verified personal account goes to the journalist.
⟦/IF⟧
⟦IF|b_c12_c⟧
Narration: The records remain intact for formal verification.
⟦/IF⟧
Narration: Verified originals are duplicated and prepared for formal submission.
Narration: An anonymous message threatens the club if the evidence is delivered.
Nadia: “The threat is now part of the case, not a reason to destroy the records.”
⟦FREE⟧
Narration: Next, if you want to continue: Legal aid center.

# SCENE｜Legal aid center
⟦BG|bg_b_c13s02|Legal aid center; Player, Roman; Roman signs a full statement admitting surveillance and destruction of evidence. He hands the club keys to independent management.⟧
⟦TIME|10:25⟧
Narration: A little later. Legal aid center.
Narration: Roman signs a full statement admitting surveillance and destruction of evidence.
Narration: He hands the club keys to independent management.
Roman: “I'll answer for what I did.”
⟦FREE⟧
Narration: Next, if you want to continue: Empty dance floor.

# SCENE｜Empty dance floor
⟦BG|bg_b_c13s03|Empty dance floor; Player, Roman; The music is off. He sets down the original access card without reaching for you.⟧
⟦TIME|10:50⟧
Narration: A little later. Empty dance floor.
Narration: The music is off.
Narration: He sets down the original access card without reaching for you.
Roman: “I have no right to ask you to make this easier for me.”
⟦FREE⟧
⟦SET|b_c13_event⟧

# CHOICE｜Can taking responsibility become a beginning rather than a bargaining chip?
#### A｜Require him to follow through with accountability
Narration: His control of the club is surrendered through formal procedures.
⟦OPT|A|set:b_c13_a⟧
#### B｜Express conflicted feelings without forgiving him
Narration: He accepts the ambiguity without treating it as absolution.
⟦OPT|B|set:b_c13_b⟧
#### C｜Limit all further communication to legal channels
Narration: Counsel documents the contact restrictions.
⟦OPT|C|set:b_c13_c⟧
# ·
Narration: Can taking responsibility become a beginning rather than a bargaining chip?

# CHAPTER 14｜The Last Pursuit
⟦GOAL|Understand the Last Pursuit and decide your next step.|The Last Pursuit⟧
⟦DONE|flag|b_c14_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning The Last Pursuit|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Club alley
⟦BG|bg_b_c14s01|Club alley; Player, Nadia; Firefighters secure the area after a threat is discovered. Roman remains behind the safety line for questioning.⟧
⟦TIME|04:30⟧
Narration: Early on the thirteenth day, at the club alley.
⟦IF|b_c13_a⟧
Narration: His control of the club is surrendered through formal procedures.
⟦/IF⟧
⟦IF|b_c13_b⟧
Narration: He accepts the ambiguity without treating it as absolution.
⟦/IF⟧
⟦IF|b_c13_c⟧
Narration: Counsel documents the contact restrictions.
⟦/IF⟧
Narration: Firefighters secure the area after a threat is discovered.
Narration: Roman remains behind the safety line for questioning.
Nadia: “They're securing the scene. Stay clear of the cordon.”
⟦FREE⟧
Narration: Next, if you want to continue: Independent backup center.

# SCENE｜Independent backup center
⟦BG|bg_b_c14s02|Independent backup center; Player, Nadia; Three independent backups are checked. The remaining unidentified signatory matches a senior figure in the old organization.⟧
⟦TIME|04:55⟧
Narration: A little later. Independent backup center.
Narration: Three independent backups are checked.
Narration: The remaining unidentified signatory matches a senior figure in the old organization.
Nadia: “The records agree. They can no longer make the original disappear without a trace.”
⟦FREE⟧
Narration: Next, if you want to continue: Harbor police interview room.

# SCENE｜Harbor police interview room
⟦BG|bg_b_c14s03|Harbor police interview room; Player, Luca; Luca gives records of his use of your information. Roman is questioned separately. Their names appear in the case file.⟧
⟦TIME|05:20⟧
Narration: A little later. Harbor police interview room.
Narration: Luca gives records of his use of your information.
Narration: Roman is questioned separately.
Narration: Their names appear in the case file.
Luca: “I used your name. I need to tell them exactly what I did.”
⟦FREE⟧
⟦SET|b_c14_event⟧

# CHOICE｜Who will take responsibility now that the records have survived?
#### A｜Prioritize evacuation and preservation of evidence
Narration: The scene is secured and records retained.
⟦OPT|A|set:b_c14_a⟧
#### B｜Submit independent backups through formal channels
Narration: Evidence remains available even if one location is compromised.
⟦OPT|B|set:b_c14_b⟧
#### C｜Demand Luca explain omitted responsibilities
Narration: His additional statement is included in the inquiry.
⟦OPT|C|set:b_c14_c⟧
# ·
Narration: Who will take responsibility now that the records have survived?

# CHAPTER 15｜The Ledger Survives
⟦GOAL|Understand the Ledger Survives and decide your next step.|The Ledger Survives⟧
⟦DONE|flag|b_c15_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning The Ledger Survives|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Independent investigation office
⟦BG|bg_b_c15s01|Independent investigation office; Player, Nadia; Investigators accept the ledger, call records and surveillance material. You receive a privacy notice and a receipt.⟧
⟦TIME|11:00⟧
Narration: The fourteenth morning, at the independent investigation office.
⟦IF|b_c14_a⟧
Narration: The scene is secured and records retained.
⟦/IF⟧
⟦IF|b_c14_b⟧
Narration: Evidence remains available even if one location is compromised.
⟦/IF⟧
⟦IF|b_c14_c⟧
Narration: His additional statement is included in the inquiry.
⟦/IF⟧
Narration: Investigators accept the ledger, call records and surveillance material.
Narration: You receive a privacy notice and a receipt.
Nadia: “You have an independent record of what was submitted.”
⟦FREE⟧
Narration: Next, if you want to continue: Hospital corridor bench.

# SCENE｜Hospital corridor bench
⟦BG|bg_b_c15s02|Hospital corridor bench; Player, Luca; Luca's written explanation admits the staged death and his decision to use you to draw Roman out. It contains no request for forgiveness.⟧
⟦TIME|11:25⟧
Narration: A little later. Hospital corridor bench.
Narration: Luca's written explanation admits the staged death and his decision to use you to draw Roman out.
Narration: It contains no request for forgiveness.
Luca: “You don't owe me a response.”
⟦FREE⟧
Narration: Next, if you want to continue: Independent bookshop.

# SCENE｜Independent bookshop
⟦BG|bg_b_c15s03|Independent bookshop; Player, Nadia; Roman's lawyer sends a supplemental statement and an apology that requires no reply. Someone is reading your photography book.⟧
⟦TIME|11:50⟧
Narration: A little later. Independent bookshop.
Narration: Roman's lawyer sends a supplemental statement and an apology that requires no reply.
Narration: Someone is reading your photography book.
Nadia: “Your work is still yours. What do you want people to know?”
⟦FREE⟧
⟦SET|b_c15_event⟧

# CHOICE｜What would loving a guilty man cost, and is that a price you want to pay?
#### A｜Disclose only that evidence was submitted
Narration: The public receives the case update without private relationship details.
⟦OPT|A|set:b_c15_a⟧
#### B｜Tell your experience through photography
Narration: The exhibition reflects your own perspective.
⟦OPT|B|set:b_c15_b⟧
#### C｜Remain silent and restore ordinary life
Narration: Your privacy is respected while the case proceeds.
⟦OPT|C|set:b_c15_c⟧
# ·
Narration: What would loving a guilty man cost, and is that a price you want to pay?

# CHAPTER 16｜The Door You Open
⟦GOAL|Understand the Door You Open and decide your next step.|The Door You Open⟧
⟦DONE|flag|b_c16_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning The Door You Open|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Corner photography gallery
⟦BG|bg_b_c16s01|Corner photography gallery; Player, Gallery owner; Months later, the exhibition displays your own photographs, not portraits of either man. A lawyer waits at the entrance.⟧
⟦TIME|10:30⟧
Narration: Several months later, at the corner photography gallery.
⟦IF|b_c15_a⟧
Narration: The public receives the case update without private relationship details.
⟦/IF⟧
⟦IF|b_c15_b⟧
Narration: The exhibition reflects your own perspective.
⟦/IF⟧
⟦IF|b_c15_c⟧
Narration: Your privacy is respected while the case proceeds.
⟦/IF⟧
Narration: Months later, the exhibition displays your own photographs, not portraits of either man.
Narration: A lawyer waits at the entrance.
Gallery owner: “The exhibition can carry your name alone.”
⟦FREE⟧
Narration: Next, if you want to continue: Quiet gallery lounge.

# SCENE｜Quiet gallery lounge
⟦BG|bg_b_c16s02|Quiet gallery lounge; Player, Nadia; A letter from Roman contains a case update and a promise never to investigate your private life without permission. It asks for no reply.⟧
⟦TIME|10:55⟧
Narration: A little later. Quiet gallery lounge.
Narration: A letter from Roman contains a case update and a promise never to investigate your private life without permission.
Narration: It asks for no reply.
Nadia: “You can leave the letter unanswered.”
⟦FREE⟧
Narration: Next, if you want to continue: Morning city street.

# SCENE｜Morning city street
⟦BG|bg_b_c16s03|Morning city street; Player alone; People buy flowers and hurry for trains. The city continues at its own pace, and there are no tracking notifications. Your camera is in your hand.⟧
⟦TIME|11:20⟧
Narration: A little later. Morning city street.
Narration: People buy flowers and hurry for trains.
Narration: The city continues at its own pace, and there are no tracking notifications.
Narration: Your camera is in your hand.
Narration: You can decide what comes next, or leave the question open.
⟦FREE⟧
⟦SET|b_c16_event⟧

# CHOICE｜No one else chooses where you point the camera.
#### A｜Explicitly allow a possible future connection within legal and safe boundaries
Narration: Any future contact requires clear consent and applicable legal permission.
⟦OPT|A|set:b_c16_a⟧
#### B｜Close the romantic possibility and keep necessary factual contact
Narration: Only essential information passes through appropriate channels.
⟦OPT|B|set:b_c16_b⟧
#### C｜Choose an independent future or defer the question
Narration: Your life continues without any romantic commitment.
⟦OPT|C|set:b_c16_c⟧
# ·
Narration: No one else chooses where you point the camera.
