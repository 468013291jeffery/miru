# CHAPTER 1｜First Day, All Eyes on You
⟦GOAL|Handle the press crisis and trace the hidden camera|First Day, All Eyes on You⟧
⟦DONE|flag|c01_clue|Find the key clue|旁白：The relevant evidence is now on record.⟧
⟦DONE|say|Ask a player about the camera or request an investigation|Have the conversation|旁白：The person concerned waits for your question.⟧

# SCENE｜Media Corridor
⟦BG|bg_c01s01|Media Corridor (visible cast: Alexander, Jace; first-person viewpoint; match asset manifest)⟧
⟦TIME|08:40⟧
旁白：Before you've even fixed your new ID badge, reporters block the team corridor.
Jace：“They want a scandal? I can give them one.”
旁白：He steps toward the camera, then notices a concealed lens aimed at both of you.
Alexander：“Jace. Back off. Now.”
旁白：Someone calls you by name. They knew when the new media director would arrive.
⟦SET|c01_clue⟧
⟦FREE⟧
旁白：The conversation ends here. There are still questions at the next location.

# SCENE｜Locker Room Entrance
⟦BG|bg_c01s02|Locker Room Entrance (visible cast: Alexander, Ethan; first-person viewpoint; match asset manifest)⟧
⟦TIME|09:10⟧
旁白：A metal locker slams behind the door.
Ethan：“The fight wasn’t about losing.”
Alexander：“Your job is the press. Mine is my team.”
旁白：A page marked THIRD PERIOD, LAST NIGHT peeks out beside the trash can.
Alexander：“What exactly are you trying to find out?”
⟦IF|c01_clue⟧
旁白：The saved records are checked against the dates and signatures in front of you.
⟦/IF⟧
# CHOICE｜First Day, All Eyes on You: what will you do next?
#### A｜Request a public explanation of last night’s locker-room fight
旁白：Maya opens the evidence log and lists the records requested for public verification.
⟦OPT|A|set:c01_mid_a⟧
#### B｜Privately interview the players and review security footage first
旁白：The originals are sealed. Maya records every person who handles them.
⟦OPT|B|set:c01_mid_b⟧
#·
旁白：Both procedures leave a paper trail. Witnesses can now be questioned formally.

# SCENE｜Editing Suite
⟦BG|bg_c01s03|Editing Suite (visible cast: Jace; first-person viewpoint; match asset manifest)⟧
⟦TIME|13:25⟧
旁白：Security footage shows the hidden camera was installed before you arrived.
Jace：“I crossed a line. I’m not defending that.”
旁白：He places the original file in front of you.
Jace：“But someone planned that shot.”
旁白：An unknown administrator has just deleted the access logs.
旁白：Three clips are out of order. The camera's installation time must be reconstructed.
⟦MG|g_m110_clip_trace⟧
⟦IF|mg_g_m110_clip_trace_win⟧
旁白：The footage sequence is restored, giving investigators a verifiable timeline.
⟦SET|clip_order_verified⟧
⟦ELSE⟧
旁白：The order remains uncertain. Maya advises preserving the originals for review.
⟦/IF⟧
⟦FREE⟧
⟦IF|c01_mid_a⟧
旁白：The formal investigation log now includes a request for the team to explain last night's altercation publicly.
⟦ELSE⟧
旁白：An independent investigator follows the private interview and surveillance-review route.
⟦/IF⟧

# SCENE｜Sealed Archive
⟦BG|bg_c01s04|Sealed Archive (visible cast: Ryan; first-person viewpoint; match asset manifest)⟧
⟦TIME|20:10⟧
旁白：Your new employee badge opens a room sealed for three years.
Ryan：“This room should have been sealed.”
旁白：An anonymous recording of the old accident starts playing by itself.
Ryan：“That footage ruined my career.”
旁白：A log-deletion alert flashes across the screen.
Ryan：“Who do you want to trust with it?”
⟦IF|clip_order_verified⟧
旁白：Your reconstructed video timeline enters the official evidence file.
⟦/IF⟧
# CHOICE｜First Day, All Eyes on You: what will you do next?
#### A｜Hand a copy to independent compliance and preserve the checksum
旁白：Maya records the request on a signed chain-of-custody form.
⟦OPT|A|set:c01_final_a⟧
#### B｜Ask Ryan to identify the footage before taking a recorded statement
旁白：The evidence enters an alternative independent-review process, changing who may access it.
⟦OPT|B|set:c01_final_b⟧
#·
旁白：In the final frame, the former captain is standing at the accident site three years ago.

# CHAPTER 2｜The Captain’s Contract
⟦GOAL|Find out what Alexander signed and preserve evidence|The Captain’s Contract⟧
⟦DONE|flag|c02_clue|Find the key clue|旁白：The relevant evidence is now on record.⟧
⟦DONE|say|Ask Alexander why he signed the agreement|Have the conversation|旁白：The person concerned waits for your question.⟧

# SCENE｜Strategy Room
⟦BG|bg_c02s01|Strategy Room (visible cast: Alexander; first-person viewpoint; match asset manifest)⟧
⟦TIME|08:15⟧
⟦IF|c01_final_a⟧
旁白：Because you submitted the footage to compliance, Alexander has a sealed-evidence receipt.
⟦ELSE⟧
旁白：Because Ryan viewed the footage first, Alexander requests an additional custody record.
⟦/IF⟧
旁白：Less than twelve hours have passed since you left the archive.
Alexander：“You went into the sealed room.”
旁白：He hands over a disciplinary record from three years ago.
Alexander：“I signed something I should have challenged.”
旁白：The contractor's name has been blacked out with thick marker.
⟦SET|c02_clue⟧
⟦FREE⟧
旁白：The conversation ends here. There are still questions at the next location.

# SCENE｜Player Tunnel
⟦BG|bg_c02s02|Player Tunnel (visible cast: Alexander; first-person viewpoint; match asset manifest)⟧
⟦TIME|11:30⟧
旁白：Through the glass, reporters photograph the old injury in his right shoulder.
Alexander：“I took the blame to keep the season alive.”
旁白：A second witness signed the final page of the contract appendix.
Alexander：“I won’t ask you to ignore this.”
Alexander：“Will you question me on record?”
⟦IF|c02_clue⟧
旁白：The saved records are checked against the dates and signatures in front of you.
⟦/IF⟧
# CHOICE｜The Captain’s Contract: what will you do next?
#### A｜Ask Alexander for the contract and a written statement
旁白：Maya opens the evidence log and lists the records requested for public verification.
⟦OPT|A|set:c02_mid_a⟧
#### B｜Have outside counsel review the nondisclosure terms first
旁白：The originals are sealed. Maya records every person who handles them.
⟦OPT|B|set:c02_mid_b⟧
#·
旁白：Both procedures leave a paper trail. Witnesses can now be questioned formally.

# SCENE｜Rehabilitation Room
⟦BG|bg_c02s03|Rehabilitation Room (visible cast: Alexander, Ethan; first-person viewpoint; match asset manifest)⟧
⟦TIME|16:20⟧
旁白：Alexander loses his grip. His water bottle drops to the floor.
Ethan：“His shoulder has been bad for months.”
Alexander：“That’s not yours to disclose.”
旁白：He closes the medical record and gives it back to Ethan.
Ethan：“Can we keep the medical facts separate?”
⟦FREE⟧
旁白：The conversation ends here. There are still questions at the next location.
⟦IF|c02_mid_a⟧
旁白：The formal log requests a written statement and original documents from Alexander.
⟦ELSE⟧
旁白：The independent investigator first reviews the confidentiality terms with outside counsel.
⟦/IF⟧

# SCENE｜Underground Garage
⟦BG|bg_c02s04|Underground Garage (visible cast: Alexander; first-person viewpoint; match asset manifest)⟧
⟦TIME|22:05⟧
旁白：An envelope addressed to you is wedged beneath the windshield wiper.
Alexander：“Don’t touch the seal. We need a record.”
旁白：The security camera abruptly turns to face the wall.
Alexander：“Someone knows our schedules.”
旁白：The envelope bears the watermark of the contractor from the old accident.
Alexander：“Who should receive this first?”
# CHOICE｜The Captain’s Contract: what will you do next?
#### A｜Report the threat to police and submit the camera anomaly
旁白：Maya records the request on a signed chain-of-custody form.
⟦OPT|A|set:c02_final_a⟧
#### B｜Ask independent security to preserve the footage first
旁白：The evidence enters an alternative independent-review process, changing who may access it.
⟦OPT|B|set:c02_final_b⟧
#·
旁白：Its paper matches the specialty stock used in the accident report.

# CHAPTER 3｜A Bad Boy’s Apology
⟦GOAL|Hold Jace accountable and trace the leaked video|A Bad Boy’s Apology⟧
⟦DONE|flag|c03_clue|Find the key clue|旁白：The relevant evidence is now on record.⟧
⟦DONE|say|Ask Jace to explain his conduct or offer restitution|Have the conversation|旁白：The person concerned waits for your question.⟧

# SCENE｜Public Practice Stands
⟦BG|bg_c03s01|Public Practice Stands (visible cast: Jace; first-person viewpoint; match asset manifest)⟧
⟦TIME|09:10⟧
⟦IF|c02_final_a⟧
旁白：Your police report links the hidden-camera incident and the threat investigation.
⟦ELSE⟧
旁白：Preserved footage shows the same visitor entered the editing room.
⟦/IF⟧
旁白：The team announces internal disciplinary action against Jace.
Jace：“I shouldn’t have put you on the spot.”
旁白：He removes his gloves and keeps a deliberate distance in front of everyone.
Jace：“I owe you an apology, not a performance.”
旁白：The arena screen keeps replaying the unauthorized footage.
⟦SET|c03_clue⟧
⟦FREE⟧
旁白：The conversation ends here. There are still questions at the next location.

# SCENE｜Editing Room
⟦BG|bg_c03s02|Editing Room (visible cast: Jace; first-person viewpoint; match asset manifest)⟧
⟦TIME|12:40⟧
旁白：The upload predates the reporters' livestream by twenty minutes.
Jace：“That means they had it before the kiss.”
旁白：The export history points to a sponsor-controlled content account.
Jace：“I’ll testify. Even if it costs me.”
Jace：“Do we confront them or build the case?”
⟦IF|c03_clue⟧
旁白：The saved records are checked against the dates and signatures in front of you.
⟦/IF⟧
# CHOICE｜A Bad Boy’s Apology: what will you do next?
#### A｜Require Jace to take public responsibility and provide the full video
旁白：Maya opens the evidence log and lists the records requested for public verification.
⟦OPT|A|set:c03_mid_a⟧
#### B｜Commission independent video forensics before speaking publicly
旁白：The originals are sealed. Maya records every person who handles them.
⟦OPT|B|set:c03_mid_b⟧
#·
旁白：Both procedures leave a paper trail. Witnesses can now be questioned formally.

# SCENE｜Players Lounge
⟦BG|bg_c03s03|Players Lounge (visible cast: Jace; first-person viewpoint; match asset manifest)⟧
⟦TIME|17:00⟧
旁白：His agent sends a statement denying any wrongdoing.
Jace：“I told him to delete it.”
旁白：He deletes a scheduled joke video while you watch.
Jace：“You decide how close I’m allowed to get.”
旁白：An anonymous countdown appears on the hallway advertising screen.
旁白：Two frames sit side by side, revealing signs of unauthorized editing.
⟦MG|g_m110_metadata⟧
⟦IF|mg_g_m110_metadata_win⟧
旁白：Three edit points are confirmed, and the original file's checksum is preserved.
⟦SET|metadata_diff_verified⟧
⟦ELSE⟧
旁白：The differences remain inconclusive. An independent examiner can still review them.
⟦/IF⟧
⟦FREE⟧
⟦IF|c03_mid_a⟧
旁白：The formal log requires Jace to accept responsibility and provide the uncut file.
⟦ELSE⟧
旁白：Independent forensic review comes before any public disclosure.
⟦/IF⟧

# SCENE｜Press Room
⟦BG|bg_c03s04|Press Room (visible cast: Jace; first-person viewpoint; match asset manifest)⟧
⟦TIME|21:00⟧
旁白：The team gives you ten minutes to submit a public response.
Jace：“I’ll say what I did wrong. No excuses.”
旁白：The sponsor's account makes the original video link inaccessible.
Jace：“But if they edited it, people deserve the truth.”
旁白：A confidential trade notification lights up his phone.
Jace：“How do we do this without another lie?”
⟦IF|metadata_diff_verified⟧
旁白：The verified editing discrepancies are entered into the case file.
⟦/IF⟧
# CHOICE｜A Bad Boy’s Apology: what will you do next?
#### A｜Have Jace apologize publicly and release only verified facts
旁白：Maya records the request on a signed chain-of-custody form.
⟦OPT|A|set:c03_final_a⟧
#### B｜Issue the team’s investigation notice before Jace speaks alone
旁白：The evidence enters an alternative independent-review process, changing who may access it.
⟦OPT|B|set:c03_final_b⟧
#·
旁白：Jace receives notice that the next game may be his last with this team.

# CHAPTER 4｜The Goalie’s Second Save
⟦GOAL|Protect Ethan’s medical autonomy and investigate equipment|The Goalie’s Second Save⟧
⟦DONE|flag|c04_clue|Find the key clue|旁白：The relevant evidence is now on record.⟧
⟦DONE|say|Discuss an independent assessment and privacy with Ethan|Have the conversation|旁白：The person concerned waits for your question.⟧

# SCENE｜Goaltender Training Zone
⟦BG|bg_c04s01|Goaltender Training Zone (visible cast: Ethan; first-person viewpoint; match asset manifest)⟧
⟦TIME|07:50⟧
⟦IF|c03_final_a⟧
旁白：Jace's public apology prompts other players to report symptoms to the team doctor.
⟦ELSE⟧
旁白：After the team's investigation notice, Ethan asks that his condition not become a media spectacle.
⟦/IF⟧
旁白：Only the sound of a goaltender's stick breaks the morning silence.
Ethan：“Coffee’s in the lounge. I remembered your order.”
旁白：He steadies himself against the frame while picking up a puck.
Ethan：“It’s just a rough morning.”
旁白：A strap on his protective gear shows unusual wear.
⟦SET|c04_clue⟧
⟦FREE⟧
旁白：The conversation ends here. There are still questions at the next location.

# SCENE｜Team Physician’s Office
⟦BG|bg_c04s02|Team Physician’s Office (visible cast: Ethan, Olivia; first-person viewpoint; match asset manifest)⟧
⟦TIME|10:35⟧
旁白：The physician calls for a fresh balance assessment.
Olivia：“Symptoms come before the score.”
Ethan：“I’m scared they’ll replace me.”
旁白：Two equipment inspection sheets carry the same serial number.
Ethan：“Can we talk before anyone posts about me?”
⟦IF|c04_clue⟧
旁白：The saved records are checked against the dates and signatures in front of you.
⟦/IF⟧
# CHOICE｜The Goalie’s Second Save: what will you do next?
#### A｜Support an independent assessment and respect Ethan’s privacy choices
旁白：Maya opens the evidence log and lists the records requested for public verification.
⟦OPT|A|set:c04_mid_a⟧
#### B｜Help Ethan and the physician discuss assessment and confidentiality first
旁白：The originals are sealed. Maya records every person who handles them.
⟦OPT|B|set:c04_mid_b⟧
#·
旁白：Both procedures leave a paper trail. Witnesses can now be questioned formally.

# SCENE｜Empty Rink Bench
⟦BG|bg_c04s03|Empty Rink Bench (visible cast: Ethan; first-person viewpoint; match asset manifest)⟧
⟦TIME|15:20⟧
旁白：With no crowd at dusk, every scrape of a skate sounds louder.
Ethan：“I tell kids at camp to speak up about injuries.”
旁白：He rubs the small scar between the thumb and forefinger of his left hand.
Ethan：“Then I hide mine. That isn’t fair.”
旁白：He passes the medical-consent form back to the physician.
⟦FREE⟧
旁白：The conversation ends here. There are still questions at the next location.
⟦IF|c04_mid_a⟧
旁白：The care plan prioritizes independent assessment and Ethan's control over disclosure.
⟦ELSE⟧
旁白：An independent review is arranged after Ethan and the doctor discuss privacy.
⟦/IF⟧

# SCENE｜Game Entrance
⟦BG|bg_c04s04|Game Entrance (visible cast: Alexander, Ethan; first-person viewpoint; match asset manifest)⟧
⟦TIME|19:05⟧
旁白：Ethan suddenly stops during the pregame warmup.
Alexander：“Call medical. Right now.”
旁白：The doctor holds him out of play. His replacement is already dressed.
Ethan：“Please tell the truth. Just not my private details.”
旁白：A serial number on the inspection sheet matches the old case.
Ethan：“What can the team say tonight?”
# CHOICE｜The Goalie’s Second Save: what will you do next?
#### A｜Announce only his medical hold and the safety precautions
旁白：Maya records the request on a signed chain-of-custody form.
⟦OPT|A|set:c04_final_a⟧
#### B｜Have the doctor and league issue the minimum participation update
旁白：The evidence enters an alternative independent-review process, changing who may access it.
⟦OPT|B|set:c04_final_b⟧
#·
旁白：The medical file contains the same equipment number found in Ryan's accident.

# CHAPTER 5｜An Ally in Rival Colors
⟦GOAL|Verify Damon’s evidence without trading team secrets|An Ally in Rival Colors⟧
⟦DONE|flag|c05_clue|Find the key clue|旁白：The relevant evidence is now on record.⟧
⟦DONE|say|Ask Damon about the source and conditions of his evidence|Have the conversation|旁白：The person concerned waits for your question.⟧

# SCENE｜Visiting Arena Corridor
⟦BG|bg_c05s01|Visiting Arena Corridor (visible cast: Damon; first-person viewpoint; match asset manifest)⟧
⟦TIME|12:15⟧
⟦IF|c04_final_a⟧
旁白：The doctor's limited statement prompts the visiting arena to share replacement records.
⟦ELSE⟧
旁白：After a status-only release, the league asks both teams for equipment inspection reports.
⟦/IF⟧
旁白：After the rival team's practice, you arrive in the public corridor by appointment.
Damon：“I’m not asking you to switch sides.”
旁白：He sets the arena access logs on the table.
Damon：“I’m asking you to check the timestamps.”
旁白：One name belongs to a current sponsor executive.
⟦SET|c05_clue⟧
⟦FREE⟧
旁白：The conversation ends here. There are still questions at the next location.

# SCENE｜League Compliance Office
⟦BG|bg_c05s02|League Compliance Office (visible cast: Damon; first-person viewpoint; match asset manifest)⟧
⟦TIME|14:40⟧
旁白：The compliance officer checks visitor signatures and handoff times.
Damon：“I won’t trade evidence for team secrets.”
旁白：A go-between demands the rival team's playbook in exchange for evidence.
Maya：“That message belongs in our evidence file.”
Damon：“Will you make the contact official?”
⟦IF|c05_clue⟧
旁白：The saved records are checked against the dates and signatures in front of you.
⟦/IF⟧
# CHOICE｜An Ally in Rival Colors: what will you do next?
#### A｜Reject any exchange of tactics and register Damon’s evidence
旁白：Maya opens the evidence log and lists the records requested for public verification.
⟦OPT|A|set:c05_mid_a⟧
#### B｜Let counsel verify the source before accepting his copy
旁白：The originals are sealed. Maya records every person who handles them.
⟦OPT|B|set:c05_mid_b⟧
#·
旁白：Both procedures leave a paper trail. Witnesses can now be questioned formally.

# SCENE｜Empty Stands
⟦BG|bg_c05s03|Empty Stands (visible cast: Damon; first-person viewpoint; match asset manifest)⟧
⟦TIME|18:10⟧
旁白：A few empty rows separate you. A practice whistle echoes in the distance.
Damon：“My brother played in that arena.”
旁白：He smooths out a ticket stub from three years earlier.
Damon：“When the board failed, no one would listen.”
旁白：The back carries an access number that can be checked against the logs.
旁白：Four access entries conflict with the codes on the old ticket.
⟦MG|g_m110_gate_match⟧
⟦IF|mg_g_m110_gate_match_win⟧
旁白：The key entries are matched, exposing an unusual door-opening time.
⟦SET|gate_pair_verified⟧
⟦ELSE⟧
旁白：Only unrelated entries are ruled out. Maya can still request the backend logs.
⟦/IF⟧
⟦FREE⟧
⟦IF|c05_mid_a⟧
旁白：The evidence register records Damon's material without any exchange of tactics.
⟦ELSE⟧
旁白：Counsel verifies the source before the evidence copy is accepted.
⟦/IF⟧

# SCENE｜Equipment Access Door
⟦BG|bg_c05s04|Equipment Access Door (visible cast: Damon, Victor; first-person viewpoint; match asset manifest)⟧
⟦TIME|20:30⟧
旁白：A repair sticker on the lock matches the model in an old photograph.
Victor：“That seal was replaced before warm-up.”
旁白：The intermediary demands tactical information again.
Damon：“No deal. We go on record or walk away.”
旁白：The records show a door opening two hours before the accident.
Damon：“Which evidence route do you trust?”
⟦IF|gate_pair_verified⟧
旁白：The verified access-code matches enter the investigation file.
⟦/IF⟧
# CHOICE｜An Ally in Rival Colors: what will you do next?
#### A｜Ask investigators to record Damon and Victor’s joint testimony
旁白：Maya records the request on a signed chain-of-custody form.
⟦OPT|A|set:c05_final_a⟧
#### B｜Request the raw access logs first and protect witness identities
旁白：The evidence enters an alternative independent-review process, changing who may access it.
⟦OPT|B|set:c05_final_b⟧
#·
旁白：Original logs show the equipment seal was replaced two hours before the game.

# CHAPTER 6｜The Man Who Lost Three Years
⟦GOAL|Establish how Ryan’s statement was altered|The Man Who Lost Three Years⟧
⟦DONE|flag|c06_clue|Find the key clue|旁白：The relevant evidence is now on record.⟧
⟦DONE|say|Ask Ryan about the discrepancies in his prior statement|Have the conversation|旁白：The person concerned waits for your question.⟧

# SCENE｜Old Practice Arena
⟦BG|bg_c06s01|Old Practice Arena (visible cast: Ryan; first-person viewpoint; match asset manifest)⟧
⟦TIME|09:00⟧
⟦IF|c05_final_a⟧
旁白：Combined witness statements persuade Ryan to speak to the official investigator.
⟦ELSE⟧
旁白：When the backup is restored, Ryan recognizes the access operator's name.
⟦/IF⟧
旁白：The old practice arena still has the seat numbers from three years ago.
Ryan：“I used to come here after every win.”
旁白：He stops in front of the section of boards that once collapsed.
Ryan：“After the accident, I couldn’t come back.”
旁白：He brings a box of unregistered audio recordings from the scene.
⟦SET|c06_clue⟧
⟦FREE⟧
旁白：The conversation ends here. There are still questions at the next location.

# SCENE｜Independent Interview Room
⟦BG|bg_c06s02|Independent Interview Room (visible cast: Ryan, Maya; first-person viewpoint; match asset manifest)⟧
⟦TIME|11:50⟧
旁白：Ryan's original statement is eleven minutes out of sync with the actual timeline.
Ryan：“I signed what they put in front of me.”
旁白：Maya points to a sentence crossed out on the liability waiver.
Maya：“Who told you the alarm never sounded?”
Ryan：“Do you want me to answer on the record?”
⟦IF|c06_clue⟧
旁白：The saved records are checked against the dates and signatures in front of you.
⟦/IF⟧
# CHOICE｜The Man Who Lost Three Years: what will you do next?
#### A｜Ask Ryan to testify formally and correct his previous account
旁白：Maya opens the evidence log and lists the records requested for public verification.
⟦OPT|A|set:c06_mid_a⟧
#### B｜Verify his statement against the medical timeline before a hearing
旁白：The originals are sealed. Maya records every person who handles them.
⟦OPT|B|set:c06_mid_b⟧
#·
旁白：Both procedures leave a paper trail. Witnesses can now be questioned formally.

# SCENE｜Recovery Walkway
⟦BG|bg_c06s03|Recovery Walkway (visible cast: Ryan; first-person viewpoint; match asset manifest)⟧
⟦TIME|17:20⟧
旁白：Ryan pauses to ease the pain in his injured right knee.
Ryan：“I thought silence would save the rookies.”
旁白：He takes two old team photographs from his pocket.
Ryan：“It only taught them to stay quiet.”
旁白：He offers to testify at a public hearing.
⟦FREE⟧
旁白：The conversation ends here. There are still questions at the next location.
⟦IF|c06_mid_a⟧
旁白：A formal statement from Ryan must acknowledge the mistakes in his earlier account.
⟦ELSE⟧
旁白：Investigators compare his testimony with medical timestamps before scheduling the hearing.
⟦/IF⟧

# SCENE｜Archive Screening Room
⟦BG|bg_c06s04|Archive Screening Room (visible cast: Ryan, Maya; first-person viewpoint; match asset manifest)⟧
⟦TIME|22:00⟧
旁白：A warning alarm sounds in the recording. Then a voice orders it shut off.
Ryan：“That’s the voice I was afraid of.”
旁白：Maya immediately seals the original recording medium.
Maya：“We need authentication before naming anyone.”
旁白：The last words are unmistakable: "The game can't stop."
Ryan：“What should happen to this recording?”
# CHOICE｜The Man Who Lost Three Years: what will you do next?
#### A｜Submit the original audio for authentication and request a hearing
旁白：Maya records the request on a signed chain-of-custody form.
⟦OPT|A|set:c06_final_a⟧
#### B｜Seek preservation orders and witness protection before disclosure
旁白：The evidence enters an alternative independent-review process, changing who may access it.
⟦OPT|B|set:c06_final_b⟧
#·
旁白：Someone on the recording says, "Disable the safety alarm first. The game cannot stop."

# CHAPTER 7｜Blood on the Ice
⟦GOAL|Prioritize the injured player and preserve the accident scene|Blood on the Ice⟧
⟦DONE|flag|c07_clue|Find the key clue|旁白：The relevant evidence is now on record.⟧
⟦DONE|say|Request a safe response to the on-ice injury|Have the conversation|旁白：The person concerned waits for your question.⟧

# SCENE｜Pregame Entrance
⟦BG|bg_c07s01|Pregame Entrance (visible cast: Alexander, Ethan; first-person viewpoint; match asset manifest)⟧
⟦TIME|18:30⟧
⟦IF|c06_final_a⟧
旁白：The hearing request leads the arena to accept an independent safety inspection.
⟦ELSE⟧
旁白：A preservation order requires the facility to retain every piece of repaired boarding.
⟦/IF⟧
旁白：The home arena is packed as the warmup whistle fades.
Alexander：“If the board feels wrong, we stop.”
旁白：Ethan follows medical advice and is not on the active roster tonight.
Ethan：“Good. Someone finally listened.”
旁白：One of the boarding brackets is visibly shaking.
⟦SET|c07_clue⟧
⟦FREE⟧
旁白：The conversation ends here. There are still questions at the next location.

# SCENE｜Rinkside
⟦BG|bg_c07s02|Rinkside (visible cast: Alexander, Olivia; first-person viewpoint; match asset manifest)⟧
⟦TIME|19:46⟧
旁白：A player slams into the boards. The impact silences the cheering.
Alexander：“Medic! Stop the game!”
旁白：The referee stops play and the medical team rushes onto the ice.
Olivia：“Give us space. Nobody moves him.”
旁白：A loose fastener is visible beneath the damaged boards.
Alexander：“Tell me what you need from the team.”
⟦IF|c07_clue⟧
旁白：The saved records are checked against the dates and signatures in front of you.
⟦/IF⟧
# CHOICE｜Blood on the Ice: what will you do next?
#### A｜Call for an immediate stoppage, equipment cordon, and emergency care
旁白：Maya opens the evidence log and lists the records requested for public verification.
⟦OPT|A|set:c07_mid_a⟧
#### B｜Arrange independent scene preservation while ensuring medical response
旁白：The originals are sealed. Maya records every person who handles them.
⟦OPT|B|set:c07_mid_b⟧
#·
旁白：Both procedures leave a paper trail. Witnesses can now be questioned formally.

# SCENE｜Equipment Inspection Area
⟦BG|bg_c07s03|Equipment Inspection Area (visible cast: Maya, Victor; first-person viewpoint; match asset manifest)⟧
⟦TIME|20:20⟧
旁白：The injured player has been transferred to hospital.
Victor：“That bolt shouldn’t have been reused.”
旁白：The back of the fastener bears a batch number from three years ago.
Maya：“Document the serial number before removal.”
旁白：Staff wait beyond the cordon for a verified statement.
旁白：Maya photographs the fastener for a preliminary safety review.
⟦MG|g_m110_bolt_compare⟧
⟦IF|mg_g_m110_bolt_compare_win⟧
旁白：Three hazards are marked for priority inspection by independent engineers.
⟦SET|bolt_risks_marked⟧
⟦ELSE⟧
旁白：The assessment needs expert confirmation. The area remains closed.
⟦/IF⟧
⟦FREE⟧
⟦IF|c07_mid_a⟧
旁白：The formal response prioritizes stopping play, securing the equipment, and emergency transport.
⟦ELSE⟧
旁白：Medical care proceeds while an independent team preserves the scene.
⟦/IF⟧

# SCENE｜Postgame Media Zone
⟦BG|bg_c07s04|Postgame Media Zone (visible cast: Alexander, Olivia; first-person viewpoint; match asset manifest)⟧
⟦TIME|21:50⟧
旁白：The game is suspended as reporters demand updates on the player's safety.
Alexander：“The players come first.”
Olivia：“The family has been contacted.”
旁白：The hospital confirms the player is conscious but still under observation.
旁白：The safety officer orders the affected section closed.
Alexander：“What facts can we confirm publicly?”
⟦IF|bolt_risks_marked⟧
旁白：Your equipment-inspection findings enter the investigation file.
⟦/IF⟧
# CHOICE｜Blood on the Ice: what will you do next?
#### A｜Release only confirmed injury status and a game suspension notice
旁白：Maya records the request on a signed chain-of-custody form.
⟦OPT|A|set:c07_final_a⟧
#### B｜Have a medical spokesperson speak within consent limits and publish repairs
旁白：The evidence enters an alternative independent-review process, changing who may access it.
⟦OPT|B|set:c07_final_b⟧
#·
旁白：The damaged fastener carries the same repair-batch number as the old case.

# CHAPTER 8｜Five Conflicting Stories
⟦GOAL|Reconcile conflicting accounts and investigate a forged email|Five Conflicting Stories⟧
⟦DONE|flag|c08_clue|Find the key clue|旁白：The relevant evidence is now on record.⟧
⟦DONE|say|Ask how the witness timelines can be reconciled|Have the conversation|旁白：The person concerned waits for your question.⟧

# SCENE｜Investigation Boardroom
⟦BG|bg_c08s01|Investigation Boardroom (visible cast: Ryan, Maya; first-person viewpoint; match asset manifest)⟧
⟦TIME|09:45⟧
⟦IF|c07_final_a⟧
旁白：After the public safety notice, a witness contacts Maya.
⟦ELSE⟧
旁白：A facilities notice prompts a technician to surrender archived repair orders.
⟦/IF⟧
旁白：Five witness statements are pinned to one timeline.
Maya：“They can all be sincere and still be wrong.”
旁白：Ryan's watch ran eleven minutes behind the arena server.
Ryan：“I remember the alarm. Not the order.”
旁白：Restored access logs reveal another unregistered account.
⟦SET|c08_clue⟧
⟦FREE⟧
旁白：The conversation ends here. There are still questions at the next location.

# SCENE｜Interview Room
⟦BG|bg_c08s02|Interview Room (visible cast: Alexander, Jace; first-person viewpoint; match asset manifest)⟧
⟦TIME|12:10⟧
旁白：Jace's self-recorded clip does not match Alexander's game report.
Jace：“My camera clock was wrong.”
Alexander：“My report came from the scoreboard.”
旁白：The devices have different time offsets.
Alexander：“What do you need us to verify?”
⟦IF|c08_clue⟧
旁白：The saved records are checked against the dates and signatures in front of you.
⟦/IF⟧
# CHOICE｜Five Conflicting Stories: what will you do next?
#### A｜Synchronize equipment clocks and interview witnesses separately
旁白：Maya opens the evidence log and lists the records requested for public verification.
⟦OPT|A|set:c08_mid_a⟧
#### B｜Use the server clock to verify video and access logs first
旁白：The originals are sealed. Maya records every person who handles them.
⟦OPT|B|set:c08_mid_b⟧
#·
旁白：Both procedures leave a paper trail. Witnesses can now be questioned formally.

# SCENE｜Server Backup Room
⟦BG|bg_c08s03|Server Backup Room (visible cast: Damon, Maya; first-person viewpoint; match asset manifest)⟧
⟦TIME|16:35⟧
旁白：An offline backup restores the access logs altered three years ago.
Maya：“Here. The alarm override has an authorizer.”
旁白：The authorization account belongs to the sponsor's operations director.
Damon：“Then put the evidence before the story.”
旁白：A strange sent message suddenly appears in your email account.
⟦FREE⟧
旁白：The conversation ends here. There are still questions at the next location.
⟦IF|c08_mid_a⟧
旁白：The log now calls for clock synchronization and separate witness follow-ups.
⟦ELSE⟧
旁白：Investigators use the server clock to verify the video and entry logs first.
⟦/IF⟧

# SCENE｜Media Office
⟦BG|bg_c08s04|Media Office (visible cast: Alexander, Maya; first-person viewpoint; match asset manifest)⟧
⟦TIME|23:00⟧
旁白：The email sent under your name accuses Ryan of deliberately causing the accident.
Maya：“That message wasn’t sent from this device.”
旁白：Login data reveal an unfamiliar IP address.
Alexander：“We can correct the record without hiding anything.”
旁白：Several outlets are already citing the forged email.
Maya：“What correction should we issue?”
# CHOICE｜Five Conflicting Stories: what will you do next?
#### A｜Publicly deny sending the forged email and submit forensic proof
旁白：Maya records the request on a signed chain-of-custody form.
⟦OPT|A|set:c08_final_a⟧
#### B｜Request takedown of the forged email before issuing verified clarification
旁白：The evidence enters an alternative independent-review process, changing who may access it.
⟦OPT|B|set:c08_final_b⟧
#·
旁白：Someone has used your account to send reporters an accusation you never authorized.

# CHAPTER 9｜The Star They Traded
⟦GOAL|Examine Jace’s trade and its hidden restrictions|The Star They Traded⟧
⟦DONE|flag|c09_clue|Find the key clue|旁白：The relevant evidence is now on record.⟧
⟦DONE|say|Ask who authorized the trade or challenge its clause|Have the conversation|旁白：The person concerned waits for your question.⟧

# SCENE｜Management Boardroom
⟦BG|bg_c09s01|Management Boardroom (visible cast: Jace; first-person viewpoint; match asset manifest)⟧
⟦TIME|08:20⟧
⟦IF|c08_final_a⟧
旁白：Your identity-theft clarification draws public attention to the trade paperwork.
⟦ELSE⟧
旁白：The lawyer connects the fake email's network exit to the trade agent's system.
⟦/IF⟧
旁白：The club announces Jace's immediate trade.
Jace：“They didn’t tell me until this morning.”
旁白：A final-page clause forbids discussion of the old accident.
Jace：“I’ll go if I have to. I won’t lie.”
旁白：He gives you his agent's details so the paperwork can be checked.
⟦SET|c09_clue⟧
⟦FREE⟧
旁白：The conversation ends here. There are still questions at the next location.

# SCENE｜Training Exit
⟦BG|bg_c09s02|Training Exit (visible cast: Alexander, Jace; first-person viewpoint; match asset manifest)⟧
⟦TIME|11:15⟧
旁白：Alexander does not ask him to stay. He only returns Jace's old stick.
Alexander：“You still owe the team an apology.”
Jace：“I know. I’ll give them one.”
旁白：For once, neither man interrupts the other.
Jace：“Do you think this transfer is clean?”
⟦IF|c09_clue⟧
旁白：The saved records are checked against the dates and signatures in front of you.
⟦/IF⟧
# CHOICE｜The Star They Traded: what will you do next?
#### A｜Question the trade decision-makers and Jace on the record
旁白：Maya opens the evidence log and lists the records requested for public verification.
⟦OPT|A|set:c09_mid_a⟧
#### B｜Have counsel review the trade and nondisclosure terms first
旁白：The originals are sealed. Maya records every person who handles them.
⟦OPT|B|set:c09_mid_b⟧
#·
旁白：Both procedures leave a paper trail. Witnesses can now be questioned formally.

# SCENE｜Visitor Reception
⟦BG|bg_c09s03|Visitor Reception (visible cast: Jace, Damon; first-person viewpoint; match asset manifest)⟧
⟦TIME|17:30⟧
旁白：Two former rivals now have to play on the same team.
Damon：“Wear the jersey. Keep your own spine.”
Jace：“Did you ask for this trade?”
Damon：“No. But somebody did.”
旁白：The trade appendix uses the same document prefix as the old accident contract.
⟦FREE⟧
旁白：The conversation ends here. There are still questions at the next location.
⟦IF|c09_mid_a⟧
旁白：The inquiry logs the decision-makers' names and Jace's account separately.
⟦ELSE⟧
旁白：Counsel reviews the transfer process and confidentiality restrictions.
⟦/IF⟧

# SCENE｜League Appeals Office
⟦BG|bg_c09s04|League Appeals Office (visible cast: Jace; first-person viewpoint; match asset manifest)⟧
⟦TIME|20:55⟧
旁白：The lawyer identifies an unusual confidentiality obligation in the contract.
Jace：“I want my career. Not this gag order.”
旁白：The league says the trade can proceed while the clause is independently reviewed.
Damon：“We can compete without making this personal.”
旁白：An old sponsorship agreement is tucked inside the trade packet.
Jace：“Will you challenge the clause?”
# CHOICE｜The Star They Traded: what will you do next?
#### A｜Request league review of the extra confidentiality clause
旁白：Maya records the request on a signed chain-of-custody form.
⟦OPT|A|set:c09_final_a⟧
#### B｜Require both clubs to disclose the procedure and conflicts of interest
旁白：The evidence enters an alternative independent-review process, changing who may access it.
⟦OPT|B|set:c09_final_b⟧
#·
旁白：The appendix includes a commercial nondisclosure agreement tied to the old accident.

# CHAPTER 10｜Secrets Before the Final
⟦GOAL|Protect testimony and define your personal boundaries|Secrets Before the Final⟧
⟦DONE|flag|c10_clue|Find the key clue|旁白：The relevant evidence is now on record.⟧
⟦DONE|say|Explain your preferred personal boundaries|Have the conversation|旁白：The person concerned waits for your question.⟧

# SCENE｜Playoff Practice Arena
⟦BG|bg_c10s01|Playoff Practice Arena (visible cast: Alexander, Ethan; first-person viewpoint; match asset manifest)⟧
⟦TIME|10:00⟧
⟦IF|c09_final_a⟧
旁白：A formal inquiry brings a league compliance officer to the pregame meeting.
⟦ELSE⟧
旁白：The conflict-of-interest statement ties the original sponsor to the trade talks.
⟦/IF⟧
旁白：The team enters the playoffs under arena-wide safety inspections.
Alexander：“We can chase a cup and do the right thing.”
Ethan：“I’m cleared for practice, not for games.”
旁白：Both men comply with their latest medical clearances.
Alexander：“If my feelings complicate your job, say so.”
⟦SET|c10_clue⟧
⟦FREE⟧
旁白：The conversation ends here. There are still questions at the next location.

# SCENE｜Charity Youth Rink
⟦BG|bg_c10s02|Charity Youth Rink (visible cast: Jace, Ethan; first-person viewpoint; match asset manifest)⟧
⟦TIME|14:25⟧
旁白：Children practice passing with plastic sticks.
Ethan：“You don’t owe us a romance to belong here.”
Jace：“And nobody gets to decide your answer for you.”
旁白：Jace folds the latest trade-dispute letter into his pocket.
Ethan：“Can we ask where you want the boundaries?”
⟦IF|c10_clue⟧
旁白：The saved records are checked against the dates and signatures in front of you.
⟦/IF⟧
# CHOICE｜Secrets Before the Final: what will you do next?
#### A｜Express interest in knowing someone privately, subject to conflict rules
旁白：Maya opens the evidence log and lists the records requested for public verification.
⟦OPT|A|set:c10_mid_a⟧
#### B｜Maintain professional boundaries and pursue no romance for now
旁白：The originals are sealed. Maya records every person who handles them.
⟦OPT|B|set:c10_mid_b⟧
#·
旁白：Both procedures leave a paper trail. Witnesses can now be questioned formally.

# SCENE｜Testimony Recording Room
⟦BG|bg_c10s03|Testimony Recording Room (visible cast: Ryan, Maya; first-person viewpoint; match asset manifest)⟧
⟦TIME|18:30⟧
旁白：Ryan finally recognizes the voice that ordered the alarm disabled.
Ryan：“It was the sponsor’s operations chief.”
旁白：Maya plays the original audio and checks every word.
Maya：“We will verify independently before release.”
旁白：Ryan signs a statement under his own name without asking you for anything.
旁白：Maya starts the audio and asks for the sequence of alarm and command to be checked.
⟦MG|g_m110_audio_verify⟧
⟦IF|mg_g_m110_audio_verify_win⟧
旁白：The alarm comes first, then the order. Investigators have a point to test.
⟦SET|audio_sequence_verified⟧
⟦ELSE⟧
旁白：Noise obscures the audio. Maya refers the recording to forensic acoustics specialists.
⟦/IF⟧
⟦FREE⟧
⟦IF|c10_mid_a⟧
旁白：The records note that any private relationship needs clear workplace conflict safeguards.
⟦ELSE⟧
旁白：The boundary request is recorded: professional distance, no romantic involvement for now.
⟦/IF⟧

# SCENE｜Finals Entrance
⟦BG|bg_c10s04|Finals Entrance (visible cast: Alexander, Damon; first-person viewpoint; match asset manifest)⟧
⟦TIME|22:10⟧
旁白：The two rival clubs will face each other in the final.
Damon：“The truth doesn’t belong to either jersey.”
Alexander：“Neither does your decision.”
旁白：A threat has been written on the back of a championship ticket.
旁白：Security preserves the ticket and opens an investigation.
Damon：“What should the league know tonight?”
⟦IF|audio_sequence_verified⟧
旁白：The audio-sequence findings are filed with the other evidence.
⟦/IF⟧
# CHOICE｜Secrets Before the Final: what will you do next?
#### A｜Submit sworn testimony to league safety officials and request protection
旁白：Maya records the request on a signed chain-of-custody form.
⟦OPT|A|set:c10_final_a⟧
#### B｜Authenticate the testimony through external counsel and report the threat
旁白：The evidence enters an alternative independent-review process, changing who may access it.
⟦OPT|B|set:c10_final_b⟧
#·
旁白：A ticket bears a threat: "Name him, and the championship disappears."

# CHAPTER 11｜Before the Last Whistle
⟦GOAL|Secure the final and publish only verified findings|Before the Last Whistle⟧
⟦DONE|flag|c11_clue|Find the key clue|旁白：The relevant evidence is now on record.⟧
⟦DONE|say|Ask officials about the clearance and safety protocols|Have the conversation|旁白：The person concerned waits for your question.⟧

# SCENE｜Championship Locker Room
⟦BG|bg_c11s01|Championship Locker Room (visible cast: Alexander, Ethan; first-person viewpoint; match asset manifest)⟧
⟦TIME|17:50⟧
⟦IF|c10_final_a⟧
旁白：After receiving sworn testimony, the league stations independent safety officers on site.
⟦ELSE⟧
旁白：An expert report finds no signs of audio splicing, and event security is increased.
⟦/IF⟧
旁白：The game begins in ten minutes.
Alexander：“We play. If it’s safe.”
Ethan：“And if it isn’t, we walk.”
旁白：Players sign the stoppage protocol in front of the independent safety officer.
Alexander：“What do you need us to hear?”
⟦SET|c11_clue⟧
⟦FREE⟧
旁白：The conversation ends here. There are still questions at the next location.

# SCENE｜Championship Rinkside
⟦BG|bg_c11s02|Championship Rinkside (visible cast: Alexander, Damon; first-person viewpoint; match asset manifest)⟧
⟦TIME|20:05⟧
旁白：An equipment alarm sounds across the arena in the second period.
Damon：“That’s the same alarm. Stop play!”
旁白：The referee blows the whistle. The crowd rises to its feet.
Alexander：“Nobody crosses that line.”
旁白：Safety staff inspect every replaced bracket.
Damon：“Do we wait for independent clearance?”
⟦IF|c11_clue⟧
旁白：The saved records are checked against the dates and signatures in front of you.
⟦/IF⟧
# CHOICE｜Before the Last Whistle: what will you do next?
#### A｜Keep the game stopped until safety officers give formal clearance
旁白：Maya opens the evidence log and lists the records requested for public verification.
⟦OPT|A|set:c11_mid_a⟧
#### B｜Require an independent inspection and player briefing before resuming
旁白：The originals are sealed. Maya records every person who handles them.
⟦OPT|B|set:c11_mid_b⟧
#·
旁白：Both procedures leave a paper trail. Witnesses can now be questioned formally.

# SCENE｜Postgame Press Hall
⟦BG|bg_c11s03|Postgame Press Hall (visible cast: Alexander, Ryan, Maya; first-person viewpoint; match asset manifest)⟧
⟦TIME|23:15⟧
旁白：Only after independent clearance does play resume. The winner is determined on the ice.
Maya：“The old override was authorized by the sponsor’s executive.”
Ryan：“I signed a false statement. I’m correcting it.”
旁白：The league announces a formal accountability and compensation process.
Alexander：“We won’t hide behind the scoreboard.”
旁白：Before publication, each media claim is checked against the investigation file.
⟦MG|g_m110_statement_check⟧
⟦IF|mg_g_m110_statement_check_win⟧
旁白：Four statements are verified, allowing a notice that goes no further than the evidence.
⟦SET|statement_checked⟧
⟦ELSE⟧
旁白：Unverified claims are removed; Maya retains the smallest fully defensible statement.
⟦/IF⟧
⟦FREE⟧
⟦IF|c11_mid_a⟧
旁白：The incident record supports a stoppage until the safety officer authorizes play.
⟦ELSE⟧
旁白：Independent inspection and player risk disclosure are required before the game resumes.
⟦/IF⟧

# SCENE｜Empty Center Ice
⟦BG|bg_c11s04|Empty Center Ice (visible cast: Alexander, Jace, Ethan, Damon, Ryan; first-person viewpoint; match asset manifest)⟧
⟦TIME|23:55⟧
旁白：The crowd has left. Zamboni lights ripple across the empty ice.
Ryan：“You gave the truth a way back.”
Jace：“You didn’t let me buy forgiveness with charm.”
Ethan：“You listened when safety mattered.”
Damon：“You stayed on your own side: yours.”
Alexander：“Where do you want to go after tonight?”
⟦IF|statement_checked⟧
旁白：Your fact-checking results become part of the final case file.
⟦/IF⟧
# CHOICE｜Before the Last Whistle: what will you do next?
#### A｜Stay involved in sports safety reform while postponing personal decisions
旁白：Maya records the request on a signed chain-of-custody form.
⟦OPT|A|set:c11_final_a⟧
#### B｜Leave the club role and pursue independent sports investigation
旁白：The evidence enters an alternative independent-review process, changing who may access it.
⟦OPT|B|set:c11_final_b⟧
#·
旁白：With the safety findings public, the five men must also decide what comes next.

# CHAPTER 12｜The New Season Is Yours
⟦GOAL|Choose your career and relationships without pressure|The New Season Is Yours⟧
⟦DONE|flag|c12_clue|Find the key clue|旁白：The relevant evidence is now on record.⟧
⟦DONE|say|State your preferred next step for career or relationships|Have the conversation|旁白：The person concerned waits for your question.⟧

# SCENE｜Safety Commission Hall
⟦BG|bg_c12s01|Safety Commission Hall (visible cast: Ryan, Maya; first-person viewpoint; match asset manifest)⟧
⟦TIME|10:00⟧
⟦IF|c11_final_a⟧
旁白：The safety commission invites you to help shape new policies.
⟦ELSE⟧
旁白：An independent sports-investigation group offers you long-term work.
⟦/IF⟧
旁白：Four weeks later, the independent commission publishes its corrective-action report.
Maya：“The process belongs to the athletes now.”
旁白：The contractor faces formal sanctions, and injured players receive compensation plans.
Ryan：“I’ll help the kids who had no voice.”
旁白：Two offers arrive: stay with the team or investigate sports safety independently.
⟦SET|c12_clue⟧
⟦FREE⟧
旁白：The conversation ends here. There are still questions at the next location.

# SCENE｜Youth Hockey Rink
⟦BG|bg_c12s02|Youth Hockey Rink (visible cast: Alexander, Jace, Ethan; first-person viewpoint; match asset manifest)⟧
⟦TIME|15:30⟧
旁白：Children on the ice try their first turns.
Ethan：“Some days, healing looks like showing up.”
Jace：“And some days, like admitting you were wrong.”
旁白：Alexander hands the youth coach a safety checklist.
Alexander：“You don’t need my permission for anything.”
⟦IF|c12_clue⟧
旁白：The saved records are checked against the dates and signatures in front of you.
⟦/IF⟧
# CHOICE｜The New Season Is Yours: what will you do next?
#### A｜Tell someone you are open to knowing him better once boundaries are clear
旁白：Maya opens the evidence log and lists the records requested for public verification.
⟦OPT|A|set:c12_mid_a⟧
#### B｜Tell everyone you prefer friendship or more personal space
旁白：The originals are sealed. Maya records every person who handles them.
⟦OPT|B|set:c12_mid_b⟧
#·
旁白：Both procedures leave a paper trail. Witnesses can now be questioned formally.

# SCENE｜Riverside Walk
⟦BG|bg_c12s03|Riverside Walk (visible cast: Damon, Ryan; first-person viewpoint; match asset manifest)⟧
⟦TIME|18:45⟧
旁白：Sunset stretches across the river, the practice arena visible in the distance.
Damon：“I don’t need a rival to tell me who to be.”
Ryan：“I owe my future to doing better. Not to you.”
旁白：Both of you exchange ways to stay in touch, with no promises attached.
Damon：“Whatever you decide, say it your way.”
⟦FREE⟧
旁白：The conversation ends here. There are still questions at the next location.
⟦IF|c12_mid_a⟧
旁白：The records note a possible future connection only after workplace boundaries are clear.
⟦ELSE⟧
旁白：The independent review records your preference for friendship or personal space.
⟦/IF⟧

# SCENE｜New-Season Arena Lobby
⟦BG|bg_c12s04|New-Season Arena Lobby (visible cast: Maya; first-person viewpoint; match asset manifest)⟧
⟦TIME|20:00⟧
旁白：The first schedule for next season has just gone up on the wall.
Alexander：“I’ll respect your choice.”
Jace：“Same here. No pressure.”
Ethan：“We can start with a conversation.”
Ryan：“Or no conversation. That is yours too.”
Damon：“So, what life do you want from here?”
# CHOICE｜How do you want to begin the next season?
#### A｜Name the man you freely want to date, and state your consent
旁白：A personal relationship can begin only if you explicitly name someone and consent.
⟦OPT|A|set:c12_final_a⟧
#### B｜Keep the five men as friends through another season
旁白：Everyone respects a choice to remain friends. The relationship can evolve naturally.
⟦OPT|B|set:c12_final_b⟧
#### C｜Focus on independent work and personal life rather than romance
旁白：The club formally separates workplace decisions from private arrangements.
⟦OPT|C|set:c12_final_c⟧
#### D｜Remain undecided and continue open-ended companionship
旁白：Nobody demands an answer. Next season remains an open door.
⟦OPT|D|set:c12_final_d⟧
#·
旁白：Training begins for the new season. An unmarked visitor badge waits at reception.
⟦IF|c12_final_a⟧
旁白：The person you named approaches, stopping at a distance you allow.
⟦ELSE⟧
旁白：No one else gets to decide your relationships or your career here.
⟦/IF⟧
⟦IF|c12_final_b⟧
旁白：A youth-hockey event offers a way to spend time together as friends, without romance.
⟦/IF⟧
⟦IF|c12_final_c⟧
旁白：The independent investigation group receives your career plan. Your next chapter is yours.
⟦/IF⟧
⟦IF|c12_final_d⟧
旁白：Uncertainty is not a failure. Everyday life in the new season can continue.
⟦/IF⟧

