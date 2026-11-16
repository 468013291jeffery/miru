# CHAPTER 1｜First Day, All Eyes on You
⟦ORIENT|bg⟧
⟦SET|cast_all⟧
⟦CHAR|你|f|25|f2|The adult player, team media director|Only the player determines their name, attitude, personal relationships and feelings. Never prescribe their words or face.|You⟧
⟦CHAR|亚历山大|m|32|m1|Alexander Knight, captain and defensive defenseman|Short dark-brown hair, deep-blue eyes, old right-shoulder injury, navy jersey. Disciplined and restrained; repairs equipment alone and fears losing another teammate. Brief low speech; pauses over evidence. No authority over the player’s work or intimacy.|Alexander⟧
⟦CHAR|杰斯|m|26|m2|Jace Walker, star scoring forward|Tousled blond hair, hazel eyes, modest left-arm tattoos, small eyebrow scar. Fast humor, plain apologies; fears having attention without value. No touching without consent or using edited footage to excuse his conduct. Navy jersey before his trade, red-black afterward.|Jace⟧
⟦CHAR|伊森|m|29|m3|Ethan Brooks, team goaltender|Short wavy chestnut hair, hazel eyes, small left-hand scar, white goalie jersey. Quiet and considerate, afraid of burdening others. Slow specific speech, asks about needs under stress. Illness never demands romance; the player does not replace medical care or decide clearance.|Ethan⟧
⟦CHAR|戴蒙|m|28|m4|Damon Steele, rival-club star forward|Short black hair, gray-green eyes, faint jaw scar, red-black jersey. Sharp and competitive but rejects coercive bargains; evidence first. Fears being seen as manipulative. Never demands tactical secrets or trades relationships.|Damon⟧
⟦CHAR|瑞安|m|35|m7|Ryan Cole, retired captain and charity adviser|Short dark-blond hair, gray eyes, light stubble, old right-knee injury, black coat. Steady but burdened by guilt; measured pauses. Repair requires corrected testimony and actions, never the player’s redemption, romance or forgiveness.|Ryan⟧
⟦CHAR|玛雅|f|34|f1|Maya Chen, independent investigator; non-romantic|Short black hair, dark-brown eyes, gray suit. Precise about evidence, testimony and inference. Knows only obtained material; protects witnesses, never omniscient.|Maya⟧
⟦CHAR|奥利维娅|f|41|f2|Olivia Reed, physician with independent clinical authority; non-romantic|Shoulder-length black hair, brown eyes, white coat. Calm and clear; protects confidentiality. Scores, media and relationships never determine care or clearance.|Olivia⟧
⟦CHAR|莱恩|m|46|m5|Victor Lane, arena technician; non-romantic|Salt-and-pepper hair, dark coveralls, old hand burn. Careful and plain-spoken about witnessed maintenance and original logs, never guessing guilt. Not the sponsor executive Victor Hale.|Victor Lane⟧
⟦CHAR|黑尔|m|49|m6|Victor Hale, sponsor operations executive; non-romantic|Slicked-back dark-brown hair, gray suit, silver glasses. Polished and controlled, prioritizes commercial schedules. Knows his own actions; others cannot establish responsibility before verification. Not technician Lane.|Victor Hale⟧
⟦SECRET|hockey_alarm|Hale authorized the old alarm override; records and testimony must establish it|knows:黑尔|reveal_from:8⟧
⟦SECRET|hockey_statement|Ryan signed an inaccurate statement under pressure; others must verify the circumstances|knows:瑞安|reveal_from:6⟧
⟦GOAL|Handle the press crisis and trace the hidden camera⟧
⟦DONE|flag|c01_clue|Verify the camera setup|旁白：The verifiable record is preserved; you still decide the next step.⟧
⟦DONE|say|Ask a player about the camera or request an investigation|State your next action|旁白：The conversation remains open: ask, request verification, or state a boundary.⟧

# SCENE｜Media Corridor
⟦BG|bg_c01s01|Media Corridor (visible cast: Alexander, Jace; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 1 · 08:40⟧
⟦BGM|hockey_investigation⟧
旁白：On day 1, the meeting begins at media corridor.
旁白：Before you've even fixed your new ID badge, reporters block the team corridor.
杰斯：“They want a scandal? I can give them one.”
旁白：He steps toward the camera, then notices a concealed lens aimed at both of you.
亚历山大：“Jace. Back off. Now.”
旁白：Someone calls you by name. They knew when the new media director would arrive.
⟦FREE⟧
⟦SET|native_v2⟧
旁白：Alexander opens the outer locker-room door; the interview can continue outside.

# SCENE｜Locker Room Entrance
⟦BG|bg_c01s02|Locker Room Entrance (visible cast: Alexander, Ethan; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 1 · 09:10⟧
⟦BGM|hockey_investigation⟧
旁白：A metal locker slams behind the door.
伊森：“The fight wasn’t about losing.”
亚历山大：“Your job is the press. Mine is my team.”
旁白：A page marked THIRD PERIOD, LAST NIGHT peeks out beside the trash can.
亚历山大：“What exactly are you trying to find out?”
# CHOICE｜First Day, All Eyes on You: what will you do next?
#### A｜Request a public explanation of last night’s locker-room fight
旁白：The questions go on record; the team must address last night's conflict, not just the trending clip.
⟦OPT|A|set:c01_mid_a⟧
#### B｜Privately interview the players and review security footage first
旁白：Separate player interviews are arranged; raw footage is preserved without circulating speculation.
⟦OPT|B|set:c01_mid_b⟧
# ·
旁白：The editing suite retains the raw camera log for an afternoon review.

# SCENE｜Editing Suite
⟦BG|bg_c01s03|Editing Suite (visible cast: Jace; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 1 · 13:25⟧
⟦BGM|hockey_investigation⟧
旁白：Security footage shows the hidden camera was installed before you arrived.
杰斯：“I crossed a line. I’m not defending that.”
旁白：He places the original file in front of you.
杰斯：“But someone planned that shot.”
旁白：An unknown administrator has just deleted the access logs.
旁白：Three clips are out of order. The camera's installation time must be reconstructed.
⟦MG|g_m110_clip_trace⟧
⟦IF|mg_m110_clip_trace_win⟧
旁白：The footage sequence is restored, giving investigators a verifiable timeline.
⟦SET|clip_order_verified⟧
⟦ELSE⟧
旁白：The order remains uncertain. Maya advises preserving the originals for review.
⟦/IF⟧
⟦FREE⟧
⟦IF|c01_mid_a⟧
旁白：The public inquiry receipt accompanies the raw clip; the publisher must explain the camera setup.
⟦/IF⟧
⟦IF|c01_mid_b⟧
旁白：The privately verified camera log identifies setup time without becoming a public accusation.
⟦/IF⟧
⟦SET|c01_clue⟧
旁白：Ryan brings a request for the sealed archive; a custodian can accompany an evening review.

# SCENE｜Sealed Archive
⟦BG|bg_c01s04|Sealed Archive (visible cast: Ryan; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 1 · 20:10⟧
⟦BGM|hockey_investigation⟧
旁白：Your new employee badge opens a room sealed for three years.
瑞安：“This room should have been sealed.”
旁白：An anonymous recording of the old accident starts playing by itself.
瑞安：“That footage ruined my career.”
旁白：A log-deletion alert flashes across the screen.
瑞安：“Who do you want to trust with it?”
⟦IF|clip_order_verified⟧
旁白：Your reconstructed video timeline enters the official evidence file.
⟦/IF⟧
# CHOICE｜First Day, All Eyes on You: what will you do next?
#### A｜Hand a copy to independent compliance and preserve the checksum
旁白：The independent compliance officer signs for a copy and checksum; the original stays sealed.
⟦OPT|A|set:c01_final_a⟧
⟦IF|c01_final_a⟧
旁白：In the final frame, the former captain is standing at the accident site three years ago.
⟦/IF⟧
#### B｜Ask Ryan to identify the footage before taking a recorded statement
旁白：Ryan identifies his position frame by frame; testimony and footage are preserved separately.
⟦OPT|B|set:c01_final_b⟧
⟦IF|c01_final_b⟧
旁白：In the final frame, the former captain is standing at the accident site three years ago.
⟦/IF⟧
# ·
# CHAPTER 2｜The Captain’s Contract
⟦GOAL|Find out what Alexander signed and preserve evidence⟧
⟦DONE|flag|c02_clue|Obtain the captain’s file|旁白：The verifiable record is preserved; you still decide the next step.⟧
⟦DONE|say|Ask Alexander why he signed the agreement|State your next action|旁白：The conversation remains open: ask, request verification, or state a boundary.⟧

# SCENE｜Strategy Room
⟦BG|bg_c02s01|Strategy Room (visible cast: Alexander; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 2 · 08:15⟧
⟦BGM|hockey_investigation⟧
旁白：On day 2, the meeting begins at strategy room.
⟦IF|c01_final_a⟧
旁白：Because you submitted the footage to compliance, Alexander has a sealed-evidence receipt.
⟦/IF⟧
⟦IF|c01_final_b⟧
旁白：Because Ryan viewed the footage first, Alexander requests an additional custody record.
⟦/IF⟧
旁白：Less than twelve hours have passed since you left the archive.
亚历山大：“You went into the sealed room.”
旁白：He hands over a disciplinary record from three years ago.
亚历山大：“I signed something I should have challenged.”
旁白：The contractor's name has been blacked out with thick marker.
⟦FREE⟧
旁白：The interview moves to the player corridor; the contract copy remains logged.

# SCENE｜Player Tunnel
⟦BG|bg_c02s02|Player Tunnel (visible cast: Alexander; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 2 · 11:30⟧
⟦BGM|hockey_investigation⟧
旁白：Through the glass, reporters photograph the old injury in his right shoulder.
亚历山大：“I took the blame to keep the season alive.”
旁白：A second witness signed the final page of the contract appendix.
亚历山大：“I won’t ask you to ignore this.”
亚历山大：“Will you question me on record?”
⟦SET|c02_clue⟧
# CHOICE｜The Captain’s Contract: what will you do next?
#### A｜Ask Alexander for the contract and a written statement
旁白：The captain provides the disclosable contract copy; redactions remain available to counsel.
⟦OPT|A|set:c02_mid_a⟧
#### B｜Have outside counsel review the nondisclosure terms first
旁白：Independent counsel reviews the clauses; the captain explains the signing without leaking restricted documents.
⟦OPT|B|set:c02_mid_b⟧
# ·
旁白：The captain heads to the recovery room for an ice pack; the contract discussion can continue.

# SCENE｜Rehabilitation Room
⟦BG|bg_c02s03|Rehabilitation Room (visible cast: Alexander, Ethan; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 2 · 16:20⟧
⟦BGM|hockey_investigation⟧
旁白：Alexander loses his grip. His water bottle drops to the floor.
伊森：“His shoulder has been bad for months.”
亚历山大：“That’s not yours to disclose.”
旁白：He puts his own medical file away; the contract copy stays on the table.
伊森：“Can we keep the medical facts separate?”
⟦FREE⟧
⟦IF|c02_mid_a⟧
旁白：The recorded interview concerns contractual responsibility; the medical file is kept separate.
⟦/IF⟧
⟦IF|c02_mid_b⟧
旁白：Counsel requests witness details; medical records remain outside the request.
⟦/IF⟧
旁白：Security can accompany the walk to the parking garage that evening.

# SCENE｜Underground Garage
⟦BG|bg_c02s04|Underground Garage (visible cast: Alexander; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 2 · 22:05⟧
⟦BGM|hockey_investigation⟧
旁白：An envelope addressed to you is wedged beneath the windshield wiper.
亚历山大：“Don’t touch the seal. We need a record.”
旁白：The security camera abruptly turns to face the wall.
亚历山大：“Someone knows our schedules.”
旁白：The envelope bears the watermark of the contractor from the old accident.
亚历山大：“Who should receive this first?”
# CHOICE｜The Captain’s Contract: what will you do next?
#### A｜Report the threat to police and submit the camera anomaly
旁白：Police log the threat and camera anomaly; security preserves the scene.
⟦OPT|A|set:c02_final_a⟧
⟦IF|c02_final_a⟧
旁白：Its paper matches the specialty stock used in the accident report.
⟦/IF⟧
#### B｜Ask independent security to preserve the footage first
旁白：Independent security logs the seal and camera interval; the affected person retains the choice to contact police.
⟦OPT|B|set:c02_final_b⟧
⟦IF|c02_final_b⟧
旁白：Its paper matches the specialty stock used in the accident report.
⟦/IF⟧
# ·
# CHAPTER 3｜A Bad Boy’s Apology
⟦GOAL|Hold Jace accountable and trace the leaked video⟧
⟦DONE|flag|c03_clue|Check the export source|旁白：The verifiable record is preserved; you still decide the next step.⟧
⟦DONE|say|Ask Jace to explain his conduct or offer restitution|State your next action|旁白：The conversation remains open: ask, request verification, or state a boundary.⟧

# SCENE｜Public Practice Stands
⟦BG|bg_c03s01|Public Practice Stands (visible cast: Jace; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 3 · 09:10⟧
⟦BGM|hockey_investigation⟧
旁白：On day 3, the meeting begins at public practice stands.
⟦IF|c02_final_a⟧
旁白：Your police report links the hidden-camera incident and the threat investigation.
⟦/IF⟧
⟦IF|c02_final_b⟧
旁白：Preserved footage shows the same visitor entered the editing room.
⟦/IF⟧
旁白：The team announces internal disciplinary action against Jace.
杰斯：“I shouldn’t have put you on the spot.”
旁白：He removes his gloves and keeps a deliberate distance in front of everyone.
杰斯：“I owe you an apology, not a performance.”
旁白：The arena screen keeps replaying the unauthorized footage.
⟦FREE⟧
旁白：Jace sends the raw-clip index to the editing room for a midday review.

# SCENE｜Editing Room
⟦BG|bg_c03s02|Editing Room (visible cast: Jace; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 3 · 12:40⟧
⟦BGM|hockey_investigation⟧
旁白：The upload predates the reporters' livestream by twenty minutes.
杰斯：“That means they had the material before I approached you.”
旁白：The export history points to a sponsor-controlled content account.
杰斯：“I’ll testify. Even if it costs me.”
杰斯：“Do we confront them or build the case?”
⟦SET|c03_clue⟧
# CHOICE｜A Bad Boy’s Apology: what will you do next?
#### A｜Require Jace to take public responsibility and provide the full video
旁白：Jace signs an accountability statement and requests preservation of the full raw clip.
⟦OPT|A|set:c03_mid_a⟧
#### B｜Commission independent video forensics before speaking publicly
旁白：Independent reviewers compare the raw clip and export log before any personal interview is released.
⟦OPT|B|set:c03_mid_b⟧
# ·
旁白：Export records need comparison at the editing workstation; the original stays in custody.

# SCENE｜Players Lounge
⟦BG|bg_c03s03|Players Lounge (visible cast: Jace; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 3 · 17:00⟧
⟦BGM|hockey_investigation⟧
旁白：His agent sends a statement denying any wrongdoing.
杰斯：“I told him to delete it.”
旁白：He deletes a scheduled joke video while you watch.
杰斯：“You decide how close I’m allowed to get.”
旁白：An anonymous countdown appears on the hallway advertising screen.
旁白：Two frames sit side by side, revealing signs of unauthorized editing.
⟦MG|g_m110_metadata⟧
⟦IF|mg_m110_metadata_win⟧
旁白：Three edit points are confirmed, and the original file's checksum is preserved.
⟦SET|metadata_diff_verified⟧
⟦ELSE⟧
旁白：The differences remain inconclusive. An independent examiner can still review them.
⟦/IF⟧
⟦FREE⟧
⟦IF|c03_mid_a⟧
旁白：Jace's accountability statement is filed separately; editing concerns do not excuse his boundary violation.
⟦/IF⟧
⟦IF|c03_mid_b⟧
旁白：Reviewers request three export markers; Jace still has to answer for his own conduct.
⟦/IF⟧
旁白：The interview room is available that evening; publication still depends on verification.

# SCENE｜Press Room
⟦BG|bg_c03s04|Press Room (visible cast: Jace; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 3 · 21:00⟧
⟦BGM|hockey_investigation⟧
旁白：The team gives you ten minutes to submit a public response.
杰斯：“I’ll say what I did wrong. No excuses.”
旁白：The sponsor's account makes the original video link inaccessible.
杰斯：“But if they edited it, people deserve the truth.”
旁白：A confidential trade notification lights up his phone.
杰斯：“How do we do this without another lie?”
⟦IF|metadata_diff_verified⟧
旁白：The verified editing discrepancies are entered into the case file.
⟦/IF⟧
# CHOICE｜A Bad Boy’s Apology: what will you do next?
#### A｜Have Jace apologize publicly and release only verified facts
旁白：The interview retains the apology and verified facts; unverified blame is removed.
⟦OPT|A|set:c03_final_a⟧
⟦IF|c03_final_a⟧
旁白：Jace receives notice that the next game may be his last with this team.
⟦/IF⟧
#### B｜Issue the team’s investigation notice before Jace speaks alone
旁白：The team publishes the inquiry scope and next update time; Jace's personal interview waits.
⟦OPT|B|set:c03_final_b⟧
⟦IF|c03_final_b⟧
旁白：Jace receives notice that the next game may be his last with this team.
⟦/IF⟧
# ·
# CHAPTER 4｜The Goalie’s Second Save
⟦GOAL|Protect Ethan’s medical autonomy and investigate equipment⟧
⟦DONE|flag|c04_clue|Confirm an independent assessment|旁白：The verifiable record is preserved; you still decide the next step.⟧
⟦DONE|say|Discuss an independent assessment and privacy with Ethan|State your next action|旁白：The conversation remains open: ask, request verification, or state a boundary.⟧

# SCENE｜Goaltender Training Zone
⟦BG|bg_c04s01|Goaltender Training Zone (visible cast: Ethan; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 5 · 07:50⟧
⟦BGM|hockey_care⟧
旁白：On day 5, the meeting begins at goaltender training zone.
⟦IF|c03_final_a⟧
旁白：Jace's public apology prompts other players to report symptoms to the team doctor.
⟦/IF⟧
⟦IF|c03_final_b⟧
旁白：After the team's investigation notice, Ethan asks that his condition not become a media spectacle.
⟦/IF⟧
旁白：Only the sound of a goaltender's stick breaks the morning silence.
伊森：“Coffee’s in the lounge. I remembered your order.”
旁白：He steadies himself against the frame while picking up a puck.
伊森：“It’s just a rough morning.”
旁白：A strap on his protective gear shows unusual wear.
⟦FREE⟧
旁白：The physician is waiting in the clinic; the team will not announce examination results on Ethan's behalf.

# SCENE｜Team Physician’s Office
⟦BG|bg_c04s02|Team Physician’s Office (visible cast: Ethan, Olivia; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 5 · 10:35⟧
⟦BGM|hockey_care⟧
旁白：The physician calls for a fresh balance assessment.
奥利维娅：“Symptoms come before the score.”
伊森：“I’m scared they’ll replace me.”
旁白：Two equipment inspection sheets carry the same serial number.
伊森：“Can we talk before anyone posts about me?”
⟦SET|c04_clue⟧
# CHOICE｜The Goalie’s Second Save: what will you do next?
#### A｜Support an independent assessment and respect Ethan’s privacy choices
旁白：The physician arranges an independent assessment; Ethan decides which results may be disclosed.
⟦OPT|A|set:c04_mid_a⟧
#### B｜Help Ethan and the physician discuss assessment and confidentiality first
旁白：Ethan and the physician discuss testing privately; media staff receive only necessary availability information.
⟦OPT|B|set:c04_mid_b⟧
# ·
旁白：The afternoon youth session can use rink-side coaching, subject to Ethan and his physician's agreement.

# SCENE｜Empty Rink Bench
⟦BG|bg_c04s03|Empty Rink Bench (visible cast: Ethan; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 5 · 15:20⟧
⟦BGM|hockey_care⟧
旁白：With no crowd at dusk, every scrape of a skate sounds louder.
伊森：“I tell kids at camp to speak up about injuries.”
旁白：He rubs the small scar between the thumb and forefinger of his left hand.
伊森：“Then I hide mine. That isn’t fair.”
旁白：He passes the medical-consent form back to the physician.
⟦FREE⟧
⟦IF|c04_mid_a⟧
旁白：The assessment is booked; the camp must adjust its goaltending demonstration.
⟦/IF⟧
⟦IF|c04_mid_b⟧
旁白：Ethan retains control of disclosure; the camp knows only that he will avoid strenuous demonstrations.
⟦/IF⟧
旁白：The physician reviews the evening warm-up plan; media staff await only necessary availability information.

# SCENE｜Game Entrance
⟦BG|bg_c04s04|Game Entrance (visible cast: Alexander, Ethan; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 5 · 19:05⟧
⟦BGM|hockey_care⟧
旁白：Ethan suddenly stops during the pregame warmup.
亚历山大：“Call medical. Right now.”
旁白：The doctor holds him out of play. His replacement is already dressed.
伊森：“Please tell the truth. Just not my private details.”
旁白：A serial number on the inspection sheet matches the old case.
伊森：“What can the team say tonight?”
# CHOICE｜The Goalie’s Second Save: what will you do next?
#### A｜Announce only his medical hold and the safety precautions
旁白：The announcement lists the playing restriction and safeguards; no medical chart is attached.
⟦OPT|A|set:c04_final_a⟧
⟦IF|c04_final_a⟧
旁白：The medical file contains the same equipment number found in Ryan's accident.
⟦/IF⟧
#### B｜Have the doctor and league issue the minimum participation update
旁白：The physician and league confirm the publishable availability status; the team shares only authorized details.
⟦OPT|B|set:c04_final_b⟧
⟦IF|c04_final_b⟧
旁白：The medical file contains the same equipment number found in Ryan's accident.
⟦/IF⟧
# ·
# CHAPTER 5｜An Ally in Rival Colors
⟦GOAL|Verify Damon’s evidence without trading team secrets⟧
⟦DONE|flag|c05_clue|Preserve access logs|旁白：The verifiable record is preserved; you still decide the next step.⟧
⟦DONE|say|Ask Damon about the source and conditions of his evidence|State your next action|旁白：The conversation remains open: ask, request verification, or state a boundary.⟧

# SCENE｜Visiting Arena Corridor
⟦BG|bg_c05s01|Visiting Arena Corridor (visible cast: Damon; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 7 · 12:15⟧
⟦BGM|hockey_investigation⟧
旁白：On day 7, the meeting begins at visiting arena corridor.
⟦IF|c04_final_a⟧
旁白：The doctor's limited statement prompts the visiting arena to share replacement records.
⟦/IF⟧
⟦IF|c04_final_b⟧
旁白：After a status-only release, the league asks both teams for equipment inspection reports.
⟦/IF⟧
旁白：After the rival team's practice, you arrive in the public corridor by appointment.
戴蒙：“I’m not asking you to switch sides.”
旁白：He sets the arena access logs on the table.
戴蒙：“I’m asking you to check the timestamps.”
旁白：One name belongs to a current sponsor executive.
⟦FREE⟧
旁白：Damon suggests the official reception room so the handover can be signed.

# SCENE｜League Compliance Office
⟦BG|bg_c05s02|League Compliance Office (visible cast: Damon; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 7 · 14:40⟧
⟦BGM|hockey_investigation⟧
旁白：The compliance officer checks visitor signatures and handoff times.
戴蒙：“I won’t trade evidence for team secrets.”
旁白：A go-between demands the rival team's playbook in exchange for evidence.
玛雅：“That message belongs in our evidence file.”
戴蒙：“Will you make the contact official?”
# CHOICE｜An Ally in Rival Colors: what will you do next?
#### A｜Reject any exchange of tactics and register Damon’s evidence
旁白：The tactical-information trade is rejected; Damon's copy is logged through the formal channel.
⟦OPT|A|set:c05_mid_a⟧
#### B｜Let counsel verify the source before accepting his copy
旁白：Counsel first checks how the records were obtained; tactical documents stay out of the meeting.
⟦OPT|B|set:c05_mid_b⟧
# ·
旁白：The access log can be checked that evening; Damon carries only the logged copy.

# SCENE｜Empty Stands
⟦BG|bg_c05s03|Empty Stands (visible cast: Damon; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 7 · 18:10⟧
⟦BGM|hockey_investigation⟧
旁白：A few empty rows separate you. A practice whistle echoes in the distance.
戴蒙：“My brother played in that arena.”
旁白：He smooths out a ticket stub from three years earlier.
戴蒙：“When the board failed, no one would listen.”
旁白：The back carries an access number that can be checked against the logs.
旁白：Four access entries conflict with the codes on the old ticket.
⟦MG|g_m110_gate_match⟧
⟦IF|mg_m110_gate_match_win⟧
旁白：The key entries are matched, exposing an unusual door-opening time.
⟦SET|gate_pair_verified⟧
⟦ELSE⟧
旁白：Only unrelated entries are ruled out. Maya can still request the backend logs.
⟦/IF⟧
⟦FREE⟧
⟦IF|c05_mid_a⟧
旁白：The formally logged records can be checked against gate locations without any bargain from Damon.
⟦/IF⟧
⟦IF|c05_mid_b⟧
旁白：The source review defines the permitted scope; counsel releases only lawfully verifiable access copies.
⟦/IF⟧
⟦SET|c05_clue⟧
旁白：Technician Lane agrees to explain the seal at a location arranged by investigators.

# SCENE｜Equipment Access Door
⟦BG|bg_c05s04|Equipment Access Door (visible cast: Damon, Victor; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 7 · 20:30⟧
⟦BGM|hockey_investigation⟧
旁白：A repair sticker on the lock matches the model in an old photograph.
莱恩：“That seal was replaced before warm-up.”
旁白：The intermediary demands tactical information again.
戴蒙：“No deal. We go on record or walk away.”
旁白：The records show a door opening two hours before the accident.
戴蒙：“Which evidence route do you trust?”
⟦IF|gate_pair_verified⟧
旁白：The verified access-code matches enter the investigation file.
⟦/IF⟧
# CHOICE｜An Ally in Rival Colors: what will you do next?
#### A｜Ask investigators to record Damon and Victor’s joint testimony
旁白：Investigators take Damon and Lane's accounts separately so neither fills gaps in the other's memory.
⟦OPT|A|set:c05_final_a⟧
⟦IF|c05_final_a⟧
旁白：Original logs show the equipment seal was replaced two hours before the game.
⟦/IF⟧
#### B｜Request the raw access logs first and protect witness identities
旁白：The arena receives an access-backup preservation request; witness identities remain out of public documents.
⟦OPT|B|set:c05_final_b⟧
⟦IF|c05_final_b⟧
旁白：Original logs show the equipment seal was replaced two hours before the game.
⟦/IF⟧
# ·
# CHAPTER 6｜The Man Who Lost Three Years
⟦GOAL|Establish how Ryan’s statement was altered⟧
⟦DONE|flag|c06_clue|Review old-case testimony|旁白：The verifiable record is preserved; you still decide the next step.⟧
⟦DONE|say|Ask Ryan about the discrepancies in his prior statement|State your next action|旁白：The conversation remains open: ask, request verification, or state a boundary.⟧

# SCENE｜Old Practice Arena
⟦BG|bg_c06s01|Old Practice Arena (visible cast: Ryan; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 9 · 09:00⟧
⟦BGM|hockey_distance⟧
旁白：On day 9, the meeting begins at old practice arena.
⟦IF|c05_final_a⟧
旁白：Combined witness statements persuade Ryan to speak to the official investigator.
⟦/IF⟧
⟦IF|c05_final_b⟧
旁白：When the backup is restored, Ryan recognizes the access operator's name.
⟦/IF⟧
旁白：The old practice arena still has the seat numbers from three years ago.
瑞安：“I used to come here after every win.”
旁白：He stops in front of the section of boards that once collapsed.
瑞安：“After the accident, I couldn’t come back.”
旁白：He brings a box of unregistered audio recordings from the scene.
⟦FREE⟧
旁白：Ryan offers to compare the old statement in the archive reading room after logging the documents.

# SCENE｜Independent Interview Room
⟦BG|bg_c06s02|Independent Interview Room (visible cast: Ryan, Maya; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 9 · 11:50⟧
⟦BGM|hockey_distance⟧
旁白：Ryan's original statement is eleven minutes out of sync with the actual timeline.
瑞安：“I signed what they put in front of me.”
旁白：Maya points to a sentence crossed out on the liability waiver.
玛雅：“Who told you the alarm never sounded?”
瑞安：“Do you want me to answer on the record?”
⟦SET|c06_clue⟧
# CHOICE｜The Man Who Lost Three Years: what will you do next?
#### A｜Ask Ryan to testify formally and correct his previous account
旁白：Ryan signs a corrected account identifying claims he never verified himself.
⟦OPT|A|set:c06_mid_a⟧
#### B｜Verify his statement against the medical timeline before a hearing
旁白：Independent reviewers first check the medical timeline; the hearing appointment awaits that comparison.
⟦OPT|B|set:c06_mid_b⟧
# ·
旁白：The empty arena is available that evening for Ryan to explain his old position; investigators retain the recording.

# SCENE｜Recovery Walkway
⟦BG|bg_c06s03|Recovery Walkway (visible cast: Ryan; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 9 · 17:20⟧
⟦BGM|hockey_distance⟧
旁白：Ryan pauses to ease the pain in his injured right knee.
瑞安：“I thought silence would save the rookies.”
旁白：He takes two old team photographs from his pocket.
瑞安：“It only taught them to stay quiet.”
旁白：He offers to testify at a public hearing.
⟦FREE⟧
⟦IF|c06_mid_a⟧
旁白：The corrected account retains the original signature page; Ryan cannot erase the old record with a new story.
⟦/IF⟧
⟦IF|c06_mid_b⟧
旁白：The comparison lists discrepancies between memory and records; Ryan leaves unresolved points open.
⟦/IF⟧
旁白：Playback is arranged in the independent hearing room; nobody will be publicly named without verification.

# SCENE｜Archive Screening Room
⟦BG|bg_c06s04|Archive Screening Room (visible cast: Ryan, Maya; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 9 · 22:00⟧
⟦BGM|hockey_distance⟧
旁白：A warning alarm sounds in the recording. Then a voice orders it shut off.
瑞安：“That’s the voice I was afraid of.”
旁白：Maya immediately seals the original recording medium.
玛雅：“We need authentication before naming anyone.”
旁白：The last words are unmistakable: "The game can't stop."
瑞安：“What should happen to this recording?”
# CHOICE｜The Man Who Lost Three Years: what will you do next?
#### A｜Submit the original audio for authentication and request a hearing
旁白：The original recording enters independent authentication; the hearing request identifies unverified points.
⟦OPT|A|set:c06_final_a⟧
⟦IF|c06_final_a⟧
旁白：Someone on the recording says, "Disable the safety alarm first. The game cannot stop."
⟦/IF⟧
#### B｜Seek preservation orders and witness protection before disclosure
旁白：Counsel seeks preservation and witness protection; public playback awaits authentication and permission.
⟦OPT|B|set:c06_final_b⟧
⟦IF|c06_final_b⟧
旁白：Someone on the recording says, "Disable the safety alarm first. The game cannot stop."
⟦/IF⟧
# ·
# CHAPTER 7｜Blood on the Ice
⟦GOAL|Prioritize the injured player and preserve the accident scene⟧
⟦DONE|flag|c07_clue|Log equipment defects|旁白：The verifiable record is preserved; you still decide the next step.⟧
⟦DONE|say|Request a safe response to the on-ice injury|State your next action|旁白：The conversation remains open: ask, request verification, or state a boundary.⟧

# SCENE｜Pregame Entrance
⟦BG|bg_c07s01|Pregame Entrance (visible cast: Alexander, Ethan; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 12 · 18:30⟧
⟦BGM|hockey_action⟧
旁白：On day 12, the meeting begins at pregame entrance.
⟦IF|c06_final_a⟧
旁白：The hearing request leads the arena to accept an independent safety inspection.
⟦/IF⟧
⟦IF|c06_final_b⟧
旁白：A preservation order requires the facility to retain every piece of repaired boarding.
⟦/IF⟧
旁白：The home arena is packed as the warmup whistle fades.
亚历山大：“If the board feels wrong, we stop.”
旁白：Ethan follows medical advice and is not on the active roster tonight.
伊森：“Good. Someone finally listened.”
旁白：One of the boarding brackets is visibly shaking.
⟦FREE⟧
旁白：The captain asks for the unusual board to be logged before play, with the right to stop at any time.

# SCENE｜Rinkside
⟦BG|bg_c07s02|Rinkside (visible cast: Alexander, Olivia; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 12 · 19:46⟧
⟦BGM|hockey_action⟧
旁白：A player slams into the boards. The impact silences the cheering.
亚历山大：“Medic! Stop the game!”
旁白：The referee stops play and the medical team rushes onto the ice.
奥利维娅：“Give us space. Nobody moves him.”
旁白：A loose fastener is visible beneath the damaged boards.
亚历山大：“Tell me what you need from the team.”
# CHOICE｜Blood on the Ice: what will you do next?
#### A｜Call for an immediate stoppage, equipment cordon, and emergency care
旁白：Play remains stopped; the medical route is cleared and the faulty board is cordoned off.
⟦OPT|A|set:c07_mid_a⟧
#### B｜Arrange independent scene preservation while ensuring medical response
旁白：Medical care continues while independent witnesses preserve the equipment area against alteration.
⟦OPT|B|set:c07_mid_b⟧
# ·
旁白：The rescue area remains restricted; equipment records will be checked in the technical inspection area.

# SCENE｜Equipment Inspection Area
⟦BG|bg_c07s03|Equipment Inspection Area (visible cast: Maya, Victor; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 12 · 20:20⟧
⟦BGM|hockey_action⟧
旁白：The injured player has been transferred to hospital.
莱恩：“That bolt shouldn’t have been reused.”
旁白：The back of the fastener bears a batch number from three years ago.
玛雅：“Document the serial number before removal.”
旁白：Staff wait beyond the cordon for a verified statement.
旁白：Maya photographs the fastener for a preliminary safety review.
⟦MG|g_m110_bolt_compare⟧
⟦IF|mg_m110_bolt_compare_win⟧
旁白：Three hazards are marked for priority inspection by independent engineers.
⟦SET|bolt_risks_marked⟧
⟦ELSE⟧
旁白：The assessment needs expert confirmation. The area remains closed.
⟦/IF⟧
⟦FREE⟧
⟦IF|c07_mid_a⟧
旁白：The stoppage log prioritizes medical transfer; engineers inspect fasteners only after the cordon is established.
⟦/IF⟧
⟦IF|c07_mid_b⟧
旁白：Witness photographs retain their original order; component numbers are logged before removal.
⟦/IF⟧
⟦SET|c07_clue⟧
旁白：After the hospital contacts family, the team can present confirmed information in the evening briefing room.

# SCENE｜Postgame Media Zone
⟦BG|bg_c07s04|Postgame Media Zone (visible cast: Alexander, Olivia; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 12 · 21:50⟧
⟦BGM|hockey_action⟧
旁白：The game is suspended as reporters demand updates on the player's safety.
亚历山大：“The players come first.”
奥利维娅：“The family has been contacted.”
旁白：The hospital confirms the player is conscious but still under observation.
旁白：The safety officer orders the affected section closed.
亚历山大：“What facts can we confirm publicly?”
⟦IF|bolt_risks_marked⟧
旁白：Your equipment-inspection findings enter the investigation file.
⟦/IF⟧
# CHOICE｜Blood on the Ice: what will you do next?
#### A｜Release only confirmed injury status and a game suspension notice
旁白：The team states verified injury status and the stoppage arrangements without predicting recovery.
⟦OPT|A|set:c07_final_a⟧
⟦IF|c07_final_a⟧
旁白：The damaged fastener carries the same repair-batch number as the old case.
⟦/IF⟧
#### B｜Have a medical spokesperson speak within consent limits and publish repairs
旁白：The medical spokesperson stays within authorized disclosure; the team separately announces facility remediation.
⟦OPT|B|set:c07_final_b⟧
⟦IF|c07_final_b⟧
旁白：The damaged fastener carries the same repair-batch number as the old case.
⟦/IF⟧
# ·
# CHAPTER 8｜Five Conflicting Stories
⟦GOAL|Reconcile conflicting accounts and investigate a forged email⟧
⟦DONE|flag|c08_clue|Check authorization records|旁白：The verifiable record is preserved; you still decide the next step.⟧
⟦DONE|say|Ask how the witness timelines can be reconciled|State your next action|旁白：The conversation remains open: ask, request verification, or state a boundary.⟧

# SCENE｜Investigation Boardroom
⟦BG|bg_c08s01|Investigation Boardroom (visible cast: Ryan, Maya; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 13 · 09:45⟧
⟦BGM|hockey_investigation⟧
旁白：On day 13, the meeting begins at investigation boardroom.
⟦IF|c07_final_a⟧
旁白：After the public safety notice, a witness contacts Maya.
⟦/IF⟧
⟦IF|c07_final_b⟧
旁白：A facilities notice prompts a technician to surrender archived repair orders.
⟦/IF⟧
旁白：Five witness statements are pinned to one timeline.
玛雅：“They can all be sincere and still be wrong.”
旁白：Ryan's watch ran eleven minutes behind the arena server.
瑞安：“I remember the alarm. Not the order.”
旁白：Restored access logs reveal another unregistered account.
⟦FREE⟧
旁白：The separate statements go to the timeline workroom for midday calibration.

# SCENE｜Interview Room
⟦BG|bg_c08s02|Interview Room (visible cast: Alexander, Jace; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 13 · 12:10⟧
⟦BGM|hockey_investigation⟧
旁白：Jace's self-recorded clip does not match Alexander's game report.
杰斯：“My camera clock was wrong.”
亚历山大：“My report came from the scoreboard.”
旁白：The devices have different time offsets.
亚历山大：“What do you need us to verify?”
# CHOICE｜Five Conflicting Stories: what will you do next?
#### A｜Synchronize equipment clocks and interview witnesses separately
旁白：Devices are recalibrated to one reference; witnesses supplement their sequences separately.
⟦OPT|A|set:c08_mid_a⟧
#### B｜Use the server clock to verify video and access logs first
旁白：Server time becomes the initial reference; access logs and video retain their individual offset records.
⟦OPT|B|set:c08_mid_b⟧
# ·
旁白：Authorization records can be checked in the server audit room that afternoon without overwriting original times.

# SCENE｜Server Backup Room
⟦BG|bg_c08s03|Server Backup Room (visible cast: Damon, Maya; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 13 · 16:35⟧
⟦BGM|hockey_investigation⟧
旁白：An offline backup restores the access logs altered three years ago.
玛雅：“Here. The alarm override has an authorizer.”
旁白：The authorization account belongs to the sponsor's operations director.
戴蒙：“Then put the evidence before the story.”
旁白：A strange sent message suddenly appears in your email account.
⟦FREE⟧
⟦IF|c08_mid_a⟧
旁白：Recalibrated statements retain their originals; contradictions become verification questions, not accusations.
⟦/IF⟧
⟦IF|c08_mid_b⟧
旁白：The server comparison identifies the authorization action; an account name alone does not prove the operator's identity.
⟦/IF⟧
⟦SET|c08_clue⟧
旁白：The account anomaly requires review in a separate office; investigators preserve a device image first.

# SCENE｜Media Office
⟦BG|bg_c08s04|Media Office (visible cast: Alexander, Maya; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 13 · 23:00⟧
⟦BGM|hockey_investigation⟧
旁白：The email sent under your name accuses Ryan of deliberately causing the accident.
玛雅：“That message wasn’t sent from this device.”
旁白：Login data reveal an unfamiliar IP address.
亚历山大：“We can correct the record without hiding anything.”
旁白：Several outlets are already citing the forged email.
玛雅：“What correction should we issue?”
# CHOICE｜Five Conflicting Stories: what will you do next?
#### A｜Publicly deny sending the forged email and submit forensic proof
旁白：The correction includes account-forensics progress and separates impersonation from unverified accusations.
⟦OPT|A|set:c08_final_a⟧
⟦IF|c08_final_a⟧
旁白：Someone has used your account to send reporters an accusation you never authorized.
⟦/IF⟧
#### B｜Request takedown of the forged email before issuing verified clarification
旁白：The platform receives a takedown request; the public correction cites only authenticated information.
⟦OPT|B|set:c08_final_b⟧
⟦IF|c08_final_b⟧
旁白：Someone has used your account to send reporters an accusation you never authorized.
⟦/IF⟧
# ·
# CHAPTER 9｜The Star They Traded
⟦GOAL|Examine Jace’s trade and its hidden restrictions⟧
⟦DONE|flag|c09_clue|Review the trade annex|旁白：The verifiable record is preserved; you still decide the next step.⟧
⟦DONE|say|Ask who authorized the trade or challenge its clause|State your next action|旁白：The conversation remains open: ask, request verification, or state a boundary.⟧

# SCENE｜Management Boardroom
⟦BG|bg_c09s01|Management Boardroom (visible cast: Jace; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 16 · 08:20⟧
⟦BGM|hockey_distance⟧
旁白：On day 16, the meeting begins at management boardroom.
⟦IF|c08_final_a⟧
旁白：Your identity-theft clarification draws public attention to the trade paperwork.
⟦/IF⟧
⟦IF|c08_final_b⟧
旁白：The lawyer connects the fake email's network exit to the trade agent's system.
⟦/IF⟧
旁白：The club announces Jace's immediate trade.
杰斯：“They didn’t tell me until this morning.”
旁白：A final-page clause forbids discussion of the old accident.
杰斯：“I’ll go if I have to. I won’t lie.”
旁白：He gives you his agent's details so the paperwork can be checked.
⟦FREE⟧
旁白：The trade meeting continues in the team office; Jace may bring an independent representative.

# SCENE｜Training Exit
⟦BG|bg_c09s02|Training Exit (visible cast: Alexander, Jace; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 16 · 11:15⟧
⟦BGM|hockey_distance⟧
旁白：Alexander does not ask him to stay. He only returns Jace's old stick.
亚历山大：“You still owe the team an apology.”
杰斯：“I know. I’ll give them one.”
旁白：For once, neither man interrupts the other.
杰斯：“Do you think this transfer is clean?”
⟦SET|c09_clue⟧
# CHOICE｜The Star They Traded: what will you do next?
#### A｜Question the trade decision-makers and Jace on the record
旁白：The meeting records the decision-makers and Jace separately; the missing notification time is flagged for review.
⟦OPT|A|set:c09_mid_a⟧
#### B｜Have counsel review the trade and nondisclosure terms first
旁白：Counsel reviews the trade annex first; Jace retains his right to independent advice.
⟦OPT|B|set:c09_mid_b⟧
# ·
旁白：Jace reports to the new club that evening; Damon agrees to check the trade notification in person.

# SCENE｜Visitor Reception
⟦BG|bg_c09s03|Visitor Reception (visible cast: Jace, Damon; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 16 · 17:30⟧
⟦BGM|hockey_distance⟧
旁白：Two former rivals now have to play on the same team.
戴蒙：“Wear the jersey. Keep your own spine.”
杰斯：“Did you ask for this trade?”
戴蒙：“No. But somebody did.”
旁白：The trade appendix uses the same document prefix as the old accident contract.
⟦FREE⟧
⟦IF|c09_mid_a⟧
旁白：The meeting record goes to the new club for procedural checks, without requesting rival tactics.
⟦/IF⟧
⟦IF|c09_mid_b⟧
旁白：Counsel's flagged restrictions are discussed separately; a new jersey does not waive the right to challenge them.
⟦/IF⟧
旁白：Counsel sends the disputed annex to the meeting room for an evening decision on the challenge channel.

# SCENE｜League Appeals Office
⟦BG|bg_c09s04|League Appeals Office (visible cast: Jace; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 16 · 20:55⟧
⟦BGM|hockey_distance⟧
旁白：The lawyer identifies an unusual confidentiality obligation in the contract.
杰斯：“I want my career. Not this gag order.”
旁白：The league says the trade can proceed while the clause is independently reviewed.
戴蒙：“We can compete without making this personal.”
旁白：An old sponsorship agreement is tucked inside the trade packet.
杰斯：“Will you challenge the clause?”
# CHOICE｜The Star They Traded: what will you do next?
#### A｜Request league review of the extra confidentiality clause
旁白：The league receives the clause-review request; Jace's training and the inquiry proceed separately.
⟦OPT|A|set:c09_final_a⟧
⟦IF|c09_final_a⟧
旁白：The appendix includes a commercial nondisclosure agreement tied to the old accident.
⟦/IF⟧
#### B｜Require both clubs to disclose the procedure and conflicts of interest
旁白：Both clubs receive procedural and conflict-disclosure requests; independent custodians retain the old-case evidence.
⟦OPT|B|set:c09_final_b⟧
⟦IF|c09_final_b⟧
旁白：The appendix includes a commercial nondisclosure agreement tied to the old accident.
⟦/IF⟧
# ·
# CHAPTER 10｜Secrets Before the Final
⟦GOAL|Protect testimony and define your personal boundaries⟧
⟦DONE|flag|c10_clue|Preserve named testimony|旁白：The verifiable record is preserved; you still decide the next step.⟧
⟦DONE|say|Explain your preferred personal boundaries|State your next action|旁白：The conversation remains open: ask, request verification, or state a boundary.⟧

# SCENE｜Playoff Practice Arena
⟦BG|bg_c10s01|Playoff Practice Arena (visible cast: Alexander, Ethan; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 23 · 10:00⟧
⟦BGM|hockey_resolve⟧
旁白：On day 23, the meeting begins at playoff practice arena.
⟦IF|c09_final_a⟧
旁白：A formal inquiry brings a league compliance officer to the pregame meeting.
⟦/IF⟧
⟦IF|c09_final_b⟧
旁白：The conflict-of-interest statement ties the original sponsor to the trade talks.
⟦/IF⟧
旁白：The team enters the playoffs under arena-wide safety inspections.
亚历山大：“We can chase a cup and do the right thing.”
伊森：“I’m cleared for practice, not for games.”
旁白：Both men comply with their latest medical clearances.
亚历山大：“If my feelings complicate your job, say so.”
⟦FREE⟧
旁白：The afternoon meeting is in the open lounge, where everyone can state their boundaries.

# SCENE｜Charity Youth Rink
⟦BG|bg_c10s02|Charity Youth Rink (visible cast: Jace, Ethan; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 23 · 14:25⟧
⟦BGM|hockey_resolve⟧
旁白：Children practice passing with plastic sticks.
伊森：“You don’t owe us a romance to belong here.”
杰斯：“And nobody gets to decide your answer for you.”
旁白：Jace folds the latest trade-dispute letter into his pocket.
伊森：“Can we ask where you want the boundaries?”
# CHOICE｜Secrets Before the Final: what will you do next?
#### A｜Express interest in knowing someone privately, subject to conflict rules
旁白：Any private invitation is separated from work scheduling; both sides must approve recusal arrangements first.
⟦OPT|A|set:c10_mid_a⟧
#### B｜Maintain professional boundaries and pursue no romance for now
旁白：The players withdraw private invitations while keeping work cooperation intact.
⟦OPT|B|set:c10_mid_b⟧
# ·
旁白：The evening hearing first checks the recording; personal relationships do not determine whose evidence counts.

# SCENE｜Testimony Recording Room
⟦BG|bg_c10s03|Testimony Recording Room (visible cast: Ryan, Maya; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 23 · 18:30⟧
⟦BGM|hockey_resolve⟧
旁白：Ryan finally recognizes the voice that ordered the alarm disabled.
瑞安：“It was the sponsor’s operations chief.”
旁白：Maya plays the original audio and checks every word.
玛雅：“We will verify independently before release.”
旁白：Ryan signs a statement under his own name without asking you for anything.
旁白：Maya starts the audio and asks for the sequence of alarm and command to be checked.
⟦MG|g_m110_audio_verify⟧
⟦IF|mg_m110_audio_verify_win⟧
旁白：The alarm comes first, then the order. Investigators have a point to test.
⟦SET|audio_sequence_verified⟧
⟦ELSE⟧
旁白：Noise obscures the audio. Maya refers the recording to forensic acoustics specialists.
⟦/IF⟧
⟦FREE⟧
⟦IF|c10_mid_a⟧
旁白：An unnamed private interest is not treated as romantic consent; independent staff still lead the hearing.
⟦/IF⟧
⟦IF|c10_mid_b⟧
旁白：The meeting follows professional boundaries; no personal response is required for the testimony handover.
⟦/IF⟧
⟦SET|c10_clue⟧
旁白：Authentication materials go to the finals coordination room; safety staff confirm contact arrangements.

# SCENE｜Finals Entrance
⟦BG|bg_c10s04|Finals Entrance (visible cast: Alexander, Damon; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 23 · 22:10⟧
⟦BGM|hockey_resolve⟧
旁白：The two rival clubs will face each other in the final.
戴蒙：“The truth doesn’t belong to either jersey.”
亚历山大：“Neither does your decision.”
旁白：A threat has been written on the back of a championship ticket.
旁白：Security preserves the ticket and opens an investigation.
戴蒙：“What should the league know tonight?”
⟦IF|audio_sequence_verified⟧
旁白：The audio-sequence findings are filed with the other evidence.
⟦/IF⟧
# CHOICE｜Secrets Before the Final: what will you do next?
#### A｜Submit sworn testimony to league safety officials and request protection
旁白：Named testimony goes to the league safety committee, alongside protection and equipment-review requests.
⟦OPT|A|set:c10_final_a⟧
⟦IF|c10_final_a⟧
旁白：A ticket bears a threat: "Name him, and the championship disappears."
⟦/IF⟧
#### B｜Authenticate the testimony through external counsel and report the threat
旁白：Outside counsel arranges independent authentication and logs the anonymous threat for protection.
⟦OPT|B|set:c10_final_b⟧
⟦IF|c10_final_b⟧
旁白：A ticket bears a threat: "Name him, and the championship disappears."
⟦/IF⟧
# ·
# CHAPTER 11｜Before the Last Whistle
⟦GOAL|Secure the final and publish only verified findings⟧
⟦DONE|flag|c11_clue|Verify the safety statement|旁白：The verifiable record is preserved; you still decide the next step.⟧
⟦DONE|say|Ask officials about the clearance and safety protocols|State your next action|旁白：The conversation remains open: ask, request verification, or state a boundary.⟧

# SCENE｜Championship Locker Room
⟦BG|bg_c11s01|Championship Locker Room (visible cast: Alexander, Ethan; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 30 · 17:50⟧
⟦BGM|hockey_resolve⟧
旁白：On day 30, the meeting begins at championship locker room.
⟦IF|c10_final_a⟧
旁白：After receiving sworn testimony, the league stations independent safety officers on site.
⟦/IF⟧
⟦IF|c10_final_b⟧
旁白：An expert report finds no signs of audio splicing, and event security is increased.
⟦/IF⟧
旁白：The game begins in ten minutes.
亚历山大：“We play. If it’s safe.”
伊森：“And if it isn’t, we walk.”
旁白：Players sign the stoppage protocol in front of the independent safety officer.
亚历山大：“What do you need us to hear?”
⟦FREE⟧
旁白：Both teams enter the playing area; staff keep the stoppage route available.

# SCENE｜Championship Rinkside
⟦BG|bg_c11s02|Championship Rinkside (visible cast: Alexander, Damon; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 30 · 20:05⟧
⟦BGM|hockey_resolve⟧
旁白：An equipment alarm sounds across the arena in the second period.
⟦SFX|hockey_alarm⟧
戴蒙：“That’s the same alarm. Stop play!”
旁白：The referee blows the whistle. The crowd rises to its feet.
亚历山大：“Nobody crosses that line.”
旁白：Safety staff inspect every replaced bracket.
戴蒙：“Do we wait for independent clearance?”
# CHOICE｜Before the Last Whistle: what will you do next?
#### A｜Keep the game stopped until safety officers give formal clearance
旁白：The game remains stopped; staff guide spectators while awaiting formal safety sign-off.
⟦OPT|A|set:c11_mid_a⟧
#### B｜Require an independent inspection and player briefing before resuming
旁白：Independent engineers receive inspection access; play will not resume before players receive the risk briefing.
⟦OPT|B|set:c11_mid_b⟧
# ·
旁白：Safety checks continue; the evening briefing room prepares only verified material.

# SCENE｜Postgame Press Hall
⟦BG|bg_c11s03|Postgame Press Hall (visible cast: Alexander, Ryan, Maya; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 30 · 23:15⟧
⟦BGM|hockey_resolve⟧
旁白：Only after independent clearance does play resume. The winner is determined on the ice.
玛雅：“The old override was authorized by the sponsor’s executive.”
瑞安：“I signed a false statement. I’m correcting it.”
旁白：The league announces a formal accountability and compensation process.
亚历山大：“We won’t hide behind the scoreboard.”
旁白：Before publication, each media claim is checked against the investigation file.
⟦MG|g_m110_statement_check⟧
⟦IF|mg_m110_statement_check_win⟧
旁白：Four statements are verified, allowing a notice that goes no further than the evidence.
⟦SET|statement_checked⟧
⟦ELSE⟧
旁白：Unverified claims are removed; Maya retains the smallest fully defensible statement.
⟦/IF⟧
⟦FREE⟧
⟦IF|c11_mid_a⟧
旁白：The stoppage notice is released first; unconfirmed reinspection conclusions stay out of the statement.
⟦/IF⟧
⟦IF|c11_mid_b⟧
旁白：The statement lists the independent inspection scope without describing unpassed items as safe.
⟦/IF⟧
⟦SET|c11_clue⟧
旁白：After the briefing, the empty rink offers room for a farewell and discussion of what comes next.

# SCENE｜Empty Center Ice
⟦BG|bg_c11s04|Empty Center Ice (visible cast: Alexander, Jace, Ethan, Damon, Ryan; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 30 · 23:55⟧
⟦BGM|hockey_resolve⟧
旁白：The crowd has left. Zamboni lights ripple across the empty ice.
瑞安：“You gave the truth a way back.”
杰斯：“You didn’t let me buy forgiveness with charm.”
伊森：“You listened when safety mattered.”
戴蒙：“You stayed on your own side: yours.”
亚历山大：“Where do you want to go after tonight?”
⟦IF|statement_checked⟧
旁白：Your fact-checking results become part of the final case file.
⟦/IF⟧
# CHOICE｜Before the Last Whistle: what will you do next?
#### A｜Stay involved in sports safety reform while postponing personal decisions
旁白：Follow-up safety-reform contacts go to the independent committee; private invitations are excluded from work commitments.
⟦OPT|A|set:c11_final_a⟧
⟦IF|c11_final_a⟧
旁白：With the safety findings public, the five men must also decide what comes next.
⟦/IF⟧
#### B｜Leave the club role and pursue independent sports investigation
旁白：The team starts the role handover; the independent reporting organization provides a separate collaboration channel.
⟦OPT|B|set:c11_final_b⟧
⟦IF|c11_final_b⟧
旁白：With the safety findings public, the five men must also decide what comes next.
⟦/IF⟧
# ·
# CHAPTER 12｜The New Season Is Yours
⟦GOAL|Choose your career and relationships without pressure⟧
⟦DONE|flag|c12_clue|Confirm remediation results|旁白：The verifiable record is preserved; you still decide the next step.⟧
⟦DONE|say|State your preferred next step for career or relationships|State your next action|旁白：The conversation remains open: ask, request verification, or state a boundary.⟧

# SCENE｜Safety Commission Hall
⟦BG|bg_c12s01|Safety Commission Hall (visible cast: Ryan, Maya; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 58 · 10:00⟧
⟦BGM|hockey_future⟧
旁白：On day 58, the meeting begins at safety commission hall.
⟦IF|c11_final_a⟧
旁白：The safety commission invites you to help shape new policies.
⟦/IF⟧
⟦IF|c11_final_b⟧
旁白：An independent sports-investigation group offers you long-term work.
⟦/IF⟧
旁白：Four weeks later, the independent commission publishes its corrective-action report.
玛雅：“The process belongs to the athletes now.”
旁白：The contractor faces formal sanctions, and injured players receive compensation plans.
瑞安：“I’ll help the kids who had no voice.”
旁白：Two offers arrive: stay with the team or investigate sports safety independently.
⟦FREE⟧
⟦SET|c12_clue⟧
旁白：The afternoon youth session welcomes visitors; the committee's work invitation can be answered separately.

# SCENE｜Youth Hockey Rink
⟦BG|bg_c12s02|Youth Hockey Rink (visible cast: Alexander, Jace, Ethan; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 58 · 15:30⟧
⟦BGM|hockey_future⟧
旁白：Children on the ice try their first turns.
伊森：“Some days, healing looks like showing up.”
杰斯：“And some days, like admitting you were wrong.”
旁白：Alexander hands the youth coach a safety checklist.
亚历山大：“You don’t need my permission for anything.”
# CHOICE｜The New Season Is Yours: what will you do next?
#### A｜Tell someone you are open to knowing him better once boundaries are clear
旁白：Private meeting times remain for the people involved to confirm; recusal arrangements enter the contact plan first.
⟦OPT|A|set:c12_mid_a⟧
#### B｜Tell everyone you prefer friendship or more personal space
旁白：The charity event offers places as friends or independent visitors, without personal commitments.
⟦OPT|B|set:c12_mid_b⟧
# ·
旁白：After the session, the riverside offers time for a walk separate from work scheduling.

# SCENE｜Riverside Walk
⟦BG|bg_c12s03|Riverside Walk (visible cast: Damon, Ryan; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 58 · 18:45⟧
⟦BGM|hockey_future⟧
旁白：Sunset stretches across the river, the practice arena visible in the distance.
戴蒙：“I don’t need a rival to tell me who to be.”
瑞安：“I owe my future to doing better. Not to you.”
旁白：Both of you exchange ways to stay in touch, with no promises attached.
戴蒙：“Whatever you decide, say it your way.”
⟦FREE⟧
⟦IF|c12_mid_a⟧
旁白：The riverside contacts carry no exclusivity requirement; you still choose whom to name explicitly.
⟦/IF⟧
⟦IF|c12_mid_b⟧
旁白：Both men leave professional contact channels and room for no further contact.
⟦/IF⟧
旁白：The arena lobby stays open that evening, with schedules and visitor arrangements available.

# SCENE｜New-Season Arena Lobby
⟦BG|bg_c12s04|New-Season Arena Lobby (visible cast: Maya; first-person viewpoint; match asset manifest)⟧
⟦TIME|Day 58 · 20:00⟧
⟦BGM|hockey_future⟧
旁白：The first schedule for next season has just gone up on the wall.
亚历山大：“I’ll respect your choice.”
杰斯：“Same here. No pressure.”
伊森：“We can start with a conversation.”
瑞安：“Or no conversation. That is yours too.”
戴蒙：“So, what life do you want from here?”
# CHOICE｜How do you want to begin the next season?
#### A｜Explicitly name Alexander, Jace, Ethan, Damon, or Ryan and freely state that you want to date him
旁白：The person you explicitly name offers time for another private meeting; physical contact still requires separate consent.
⟦OPT|A|set:c12_final_a⟧
⟦IF|c12_final_a⟧
旁白：The new-season visitor pass stays at reception; another visit remains your choice.
⟦/IF⟧
#### B｜Keep the five men as friends through another season
旁白：The youth-session invitation is offered as friendship, not a romance waiting for approval.
⟦OPT|B|set:c12_final_b⟧
⟦IF|c12_final_b⟧
旁白：The new-season visitor pass stays at reception; another visit remains your choice.
⟦/IF⟧
#### C｜Focus on independent work and personal life rather than romance
旁白：The independent reporting organization offers a new work plan; the club completes the role handover.
⟦OPT|C|set:c12_final_c⟧
⟦IF|c12_final_c⟧
旁白：The new-season visitor pass stays at reception; another visit remains your choice.
⟦/IF⟧
#### D｜Remain undecided and continue open-ended companionship
旁白：The visitor pass stays at reception; the next visit can simply be to watch practice.
⟦OPT|D|set:c12_final_d,ending_open⟧
⟦IF|c12_final_d⟧
旁白：The new-season visitor pass stays at reception; another visit remains your choice.
⟦/IF⟧
# ·
