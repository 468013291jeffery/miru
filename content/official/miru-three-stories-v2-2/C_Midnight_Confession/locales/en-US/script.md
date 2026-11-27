# CHAPTER 1｜Midnight Confession
⟦GOAL|Understand midnight Confession and decide your next step.|Midnight Confession⟧
⟦DONE|flag|c_c01_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning Midnight Confession|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Closed confessional entrance
⟦BG|bg_c_c01s01|Closed confessional entrance; Player, Lucian; The bell strikes twelve. Water glistens on the stone floor. A key touches a table behind the wooden screen.⟧
⟦TIME|00:00⟧
Narration: On the first night, at the closed confessional entrance.
Narration: The bell strikes twelve.
Narration: Water glistens on the stone floor.
Narration: A key touches a table behind the wooden screen.
Lucian: “You brought her photograph, didn't you?”
⟦FREE⟧
Narration: Next, if you want to continue: Wooden confessional screen.

# SCENE｜Wooden confessional screen
⟦BG|bg_c_c01s02|Wooden confessional screen; Player, Lucian; Lucian describes Mara's blue coat and its missing button. His fingers whiten against the wood. He slides a lamp toward you.⟧
⟦TIME|00:25⟧
Narration: A little later. Wooden confessional screen.
Narration: Lucian describes Mara's blue coat and its missing button.
Narration: His fingers whiten against the wood.
Narration: He slides a lamp toward you.
Lucian: “I remember the night she went through that door.”
⟦FREE⟧
Narration: Next, if you want to continue: Chapel side room.

# SCENE｜Chapel side room
⟦BG|bg_c_c01s03|Chapel side room; Player, Lucian; He sets down your mother's rosary and the basement key. A portrait shows a child wearing your childhood scarf.⟧
⟦TIME|00:50⟧
Narration: A little later. Chapel side room.
Narration: He sets down your mother's rosary and the basement key.
Narration: A portrait shows a child wearing your childhood scarf.
Lucian: “I opened the door for her. I saw them lock it from outside.”
⟦FREE⟧
⟦SET|c_c01_event⟧

# CHOICE｜Who is guarding the door that was locked seven years ago?
#### A｜Demand his account of the locked door
Narration: He provides his duty record from that night.
⟦OPT|A|set:c_c01_a⟧
#### B｜Keep the rosary and verify its source
Narration: Its provenance is documented independently.
⟦OPT|B|set:c_c01_b⟧
#### C｜Decline his company and contact an investigator
Narration: Nora receives the location and key information.
⟦OPT|C|set:c_c01_c⟧
# ·
Narration: Who is guarding the door that was locked seven years ago?

# CHAPTER 2｜Echoes Beneath the Abbey
⟦GOAL|Understand echoes Beneath the Abbey and decide your next step.|Echoes Beneath the Abbey⟧
⟦DONE|flag|c_c02_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning Echoes Beneath the Abbey|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Abbey basement corridor
⟦BG|bg_c_c02s01|Abbey basement corridor; Player, Lucian; Names have been scraped from the visitor register. A hospital prescription slip lies in the margin.⟧
⟦TIME|01:00⟧
Narration: Later that night, at the abbey basement corridor.
⟦IF|c_c01_a⟧
Narration: He provides his duty record from that night.
⟦/IF⟧
⟦IF|c_c01_b⟧
Narration: Its provenance is documented independently.
⟦/IF⟧
⟦IF|c_c01_c⟧
Narration: Nora receives the location and key information.
⟦/IF⟧
Narration: Names have been scraped from the visitor register.
Narration: A hospital prescription slip lies in the margin.
Lucian: “Someone has been changing these records.”
⟦FREE⟧
Narration: Next, if you want to continue: Underground records room.

# SCENE｜Underground records room
⟦BG|bg_c_c02s02|Underground records room; Player, Lucian; The cabinet holds medicine records and a sealed temporary-isolation envelope. A freshly used teacup sits beside a loose frame.⟧
⟦TIME|01:25⟧
Narration: A little later. Underground records room.
Narration: The cabinet holds medicine records and a sealed temporary-isolation envelope.
Narration: A freshly used teacup sits beside a loose frame.
Lucian: “Someone has been here tonight.”
⟦FREE⟧
Narration: Next, if you want to continue: Hidden basement door.

# SCENE｜Hidden basement door
⟦BG|bg_c_c02s03|Hidden basement door; Player, Lucian; Behind the frame is a family portrait painted by your mother. The child wears your red scarf. A slip contains seven dates.⟧
⟦TIME|01:50⟧
Narration: A little later. Hidden basement door.
Narration: Behind the frame is a family portrait painted by your mother.
Narration: The child wears your red scarf.
Narration: A slip contains seven dates.
Lucian: “I don't know why your picture is here. We can find out.”
⟦FREE⟧
⟦SET|c_c02_event⟧

# CHOICE｜Who included you in the plan?
#### A｜Keep the portrait and verify the handwriting
Narration: The hidden crescent mark is preserved.
⟦OPT|A|set:c_c02_a⟧
#### B｜Ask Lucian to document what he does not know
Narration: His knowledge limits are recorded.
⟦OPT|B|set:c_c02_b⟧
#### C｜Have Nora examine signs of recent access
Narration: Recent visitors can be investigated independently.
⟦OPT|C|set:c_c02_c⟧
# ·
Narration: Who included you in the plan?

# CHAPTER 3｜Rain and Old Vows
⟦GOAL|Understand rain and Old Vows and decide your next step.|Rain and Old Vows⟧
⟦DONE|flag|c_c03_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning Rain and Old Vows|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Storm-lit library
⟦BG|bg_c_c03s01|Storm-lit library; Player, Lucian; Rain shakes the stained glass. Lucian removes his old badge and places it in an unlocked drawer.⟧
⟦TIME|22:00⟧
Narration: On the second night, at the storm-lit library.
⟦IF|c_c02_a⟧
Narration: The hidden crescent mark is preserved.
⟦/IF⟧
⟦IF|c_c02_b⟧
Narration: His knowledge limits are recorded.
⟦/IF⟧
⟦IF|c_c02_c⟧
Narration: Recent visitors can be investigated independently.
⟦/IF⟧
Narration: Rain shakes the stained glass.
Narration: Lucian removes his old badge and places it in an unlocked drawer.
Lucian: “I walked away from that life. That doesn't mean I've taken responsibility for it.”
⟦FREE⟧
Narration: Next, if you want to continue: Reading table.

# SCENE｜Reading table
⟦BG|bg_c_c03s02|Reading table; Player, Lucian; His fingers stop at the edge of the page. He pushes an old ward diagram toward you. Thunder makes him shield Mara's diary.⟧
⟦TIME|22:25⟧
Narration: A little later. Reading table.
Narration: His fingers stop at the edge of the page.
Narration: He pushes an old ward diagram toward you.
Narration: Thunder makes him shield Mara's diary.
Lucian: “The room is still there. This shows you where to find it.”
⟦FREE⟧
Narration: Next, if you want to continue: Stained-glass window.

# SCENE｜Stained-glass window
⟦BG|bg_c_c03s03|Stained-glass window; Player, Lucian; A notice forbids discharge. Nora reports that old surveillance footage survives offline.⟧
⟦TIME|22:50⟧
Narration: A little later. Stained-glass window.
Narration: A notice forbids discharge.
Narration: Nora reports that old surveillance footage survives offline.
Lucian: “I want to be close to you. I know this matters more.”
⟦FREE⟧
⟦SET|c_c03_event⟧

# CHOICE｜What will the old footage show?
#### A｜Allow attraction to be discussed but demand evidence
Narration: He provides the ward diagram without claiming intimacy.
⟦OPT|A|set:c_c03_a⟧
#### B｜Keep the conversation focused on Mara
Narration: He stops personal overtures and provides facts.
⟦OPT|B|set:c_c03_b⟧
#### C｜Ask whether desire is obscuring his guilt
Narration: He acknowledges that closeness does not reduce responsibility.
⟦OPT|C|set:c_c03_c⟧
# ·
Narration: What will the old footage show?

# CHAPTER 4｜She Did Not Leave Voluntarily
⟦GOAL|Understand she Did Not Leave Voluntarily and decide your next step.|She Did Not Leave Voluntarily⟧
⟦DONE|flag|c_c04_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning She Did Not Leave Voluntarily|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Surveillance archive
⟦BG|bg_c_c04s01|Surveillance archive; Player, Nora; Seven-year-old footage shows attendants taking Mara into a locked ward. The date contradicts the voluntary-care report.⟧
⟦TIME|11:00⟧
Narration: On the third morning, at the surveillance archive.
⟦IF|c_c03_a⟧
Narration: He provides the ward diagram without claiming intimacy.
⟦/IF⟧
⟦IF|c_c03_b⟧
Narration: He stops personal overtures and provides facts.
⟦/IF⟧
⟦IF|c_c03_c⟧
Narration: He acknowledges that closeness does not reduce responsibility.
⟦/IF⟧
Narration: Seven-year-old footage shows attendants taking Mara into a locked ward.
Narration: The date contradicts the voluntary-care report.
Nora: “There it is. The report and the film cannot both be true.”
⟦FREE⟧
Narration: Next, if you want to continue: Old medical corridor.

# SCENE｜Old medical corridor
⟦BG|bg_c_c04s02|Old medical corridor; Player, Lucian; Lucian admits he knew the door locked from outside and did not intervene. His duty badge goes into an evidence bag.⟧
⟦TIME|11:25⟧
Narration: A little later. Old medical corridor.
Narration: Lucian admits he knew the door locked from outside and did not intervene.
Narration: His duty badge goes into an evidence bag.
Lucian: “I saw it. I did nothing. That's the truth.”
⟦FREE⟧
Narration: Next, if you want to continue: Independent legal meeting room.

# SCENE｜Independent legal meeting room
⟦BG|bg_c_c04s03|Independent legal meeting room; Player, Nora; Nora submits the footage to counsel. Lucian writes a statement. The medical file refers to seven letters never sent.⟧
⟦TIME|11:50⟧
Narration: A little later. Independent legal meeting room.
Narration: Nora submits the footage to counsel.
Narration: Lucian writes a statement.
Narration: The medical file refers to seven letters never sent.
Nora: “Those letters may explain who prevented her contacting you.”
⟦FREE⟧
⟦SET|c_c04_event⟧

# CHOICE｜What else did his silence conceal?
#### A｜Require Lucian to document his presence
Narration: His account is formally recorded.
⟦OPT|A|set:c_c04_a⟧
#### B｜Investigate who locked the door and authorized the order
Narration: Ward and attendant records are preserved.
⟦OPT|B|set:c_c04_b⟧
#### C｜Suspend all private meetings with Lucian
Narration: Evidence transfers through Nora instead.
⟦OPT|C|set:c_c04_c⟧
# ·
Narration: What else did his silence conceal?

# CHAPTER 5｜Seven Unsent Letters
⟦GOAL|Understand seven Unsent Letters and decide your next step.|Seven Unsent Letters⟧
⟦DONE|flag|c_c05_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning Seven Unsent Letters|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Bell tower stairs
⟦BG|bg_c_c05s01|Bell tower stairs; Player, Lucian; A dusty iron box contains seven sealed letters. Each bears a crescent mark.⟧
⟦TIME|21:00⟧
Narration: On the third night, at the bell tower stairs.
⟦IF|c_c04_a⟧
Narration: His account is formally recorded.
⟦/IF⟧
⟦IF|c_c04_b⟧
Narration: Ward and attendant records are preserved.
⟦/IF⟧
⟦IF|c_c04_c⟧
Narration: Evidence transfers through Nora instead.
⟦/IF⟧
Narration: A dusty iron box contains seven sealed letters.
Narration: Each bears a crescent mark.
Lucian: “These seals aren't the ones your grandmother used.”
⟦FREE⟧
Narration: Next, if you want to continue: Bell tower storage ledge.

# SCENE｜Bell tower storage ledge
⟦BG|bg_c_c05s02|Bell tower storage ledge; Player, Lucian; The sixth letter names the grandmother's lawyer. The seventh is torn. An older will attachment lies beneath them.⟧
⟦TIME|21:25⟧
Narration: A little later. Bell tower storage ledge.
Narration: The sixth letter names the grandmother's lawyer.
Narration: The seventh is torn.
Narration: An older will attachment lies beneath them.
Lucian: “I recognize your mother's handwriting. Someone kept these from reaching you.”
⟦FREE⟧
Narration: Next, if you want to continue: Bell tower window.

# SCENE｜Bell tower window
⟦BG|bg_c_c05s03|Bell tower window; Player, Lucian; The seven-night condition appears to have been added later in imitated handwriting. The torn letter names Agnes.⟧
⟦TIME|21:50⟧
Narration: A little later. Bell tower window.
Narration: The seven-night condition appears to have been added later in imitated handwriting.
Narration: The torn letter names Agnes.
Lucian: “Don't stay because a piece of paper tells you to.”
⟦FREE⟧
⟦SET|c_c05_event⟧

# CHOICE｜Who designed the seven-night countdown?
#### A｜Verify the original will with the lawyer
Narration: The added document is formally questioned.
⟦OPT|A|set:c_c05_a⟧
#### B｜Reconstruct the letters' sequence
Narration: The timeline reveals intercepted correspondence.
⟦OPT|B|set:c_c05_b⟧
#### C｜Ask Agnes about the added condition
Narration: Her initial explanation is recorded.
⟦OPT|C|set:c_c05_c⟧
# ·
Narration: Who designed the seven-night countdown?

# CHAPTER 6｜Jealousy Is More Honest Than Prayer
⟦GOAL|Understand jealousy Is More Honest Than Prayer and decide your next step.|Jealousy Is More Honest Than Prayer⟧
⟦DONE|flag|c_c06_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning Jealousy Is More Honest Than Prayer|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Abbey cloister
⟦BG|bg_c_c06s01|Abbey cloister; Player, Nora; Nora arrives with a copied witness statement. Lucian pauses with the tea half a step away.⟧
⟦TIME|15:00⟧
Narration: On the fourth afternoon, at the abbey cloister.
⟦IF|c_c05_a⟧
Narration: The added document is formally questioned.
⟦/IF⟧
⟦IF|c_c05_b⟧
Narration: The timeline reveals intercepted correspondence.
⟦/IF⟧
⟦IF|c_c05_c⟧
Narration: Her initial explanation is recorded.
⟦/IF⟧
Narration: Nora arrives with a copied witness statement.
Narration: Lucian pauses with the tea half a step away.
Nora: “The copy is newer than the event it describes.”
⟦FREE⟧
Narration: Next, if you want to continue: Cloister sunroom.

# SCENE｜Cloister sunroom
⟦BG|bg_c_c06s02|Cloister sunroom; Player, Lucian; His name is partially obscured on the statement. He admits envy of the trust Nora has earned, but does not interfere.⟧
⟦TIME|15:25⟧
Narration: A little later. Cloister sunroom.
Narration: His name is partially obscured on the statement.
Narration: He admits envy of the trust Nora has earned, but does not interfere.
Lucian: “I envy her because you have reason to trust her. I gave you reasons not to trust me.”
⟦FREE⟧
Narration: Next, if you want to continue: Courtyard bench.

# SCENE｜Courtyard bench
⟦BG|bg_c_c06s03|Courtyard bench; Player, Nora; Missing pages in the register match fibers in the letters. Agnes watches from the far passageway.⟧
⟦TIME|15:50⟧
Narration: A little later. Courtyard bench.
Narration: Missing pages in the register match fibers in the letters.
Narration: Agnes watches from the far passageway.
Nora: “Someone replaced a page. We need the original.”
⟦FREE⟧
⟦SET|c_c06_event⟧

# CHOICE｜Who altered Lucian's witness statement?
#### A｜Tell him honesty is a condition of closeness
Narration: He admits signing a record and seeks the original.
⟦OPT|A|set:c_c06_a⟧
#### B｜Require him to separate jealousy from the case
Narration: He remains a witness and does not obstruct Nora.
⟦OPT|B|set:c_c06_b⟧
#### C｜Decline private contact and work with Nora
Narration: Lucian supplies material at agreed times.
⟦OPT|C|set:c_c06_c⟧
# ·
Narration: Who altered Lucian's witness statement?

# CHAPTER 7｜The Name Beneath the Wax
⟦GOAL|Understand the Name Beneath the Wax and decide your next step.|The Name Beneath the Wax⟧
⟦DONE|flag|c_c07_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning The Name Beneath the Wax|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Seal archive
⟦BG|bg_c_c07s01|Seal archive; Player, Lucian; A receipt inside a letter shows a payment from the abbey to a private care institution. Lucian recognizes the signature.⟧
⟦TIME|21:30⟧
Narration: On the fourth night, at the seal archive.
⟦IF|c_c06_a⟧
Narration: He admits signing a record and seeks the original.
⟦/IF⟧
⟦IF|c_c06_b⟧
Narration: He remains a witness and does not obstruct Nora.
⟦/IF⟧
⟦IF|c_c06_c⟧
Narration: Lucian supplies material at agreed times.
⟦/IF⟧
Narration: A receipt inside a letter shows a payment from the abbey to a private care institution.
Narration: Lucian recognizes the signature.
Lucian: “I handled that money. I thought it was for treatment.”
⟦FREE⟧
Narration: Next, if you want to continue: Abbey accounting room.

# SCENE｜Abbey accounting room
⟦BG|bg_c_c07s02|Abbey accounting room; Player, Lucian; He retrieves cash records, including his own signature, rather than offering excuses.⟧
⟦TIME|21:55⟧
Narration: A little later. Abbey accounting room.
Narration: He retrieves cash records, including his own signature, rather than offering excuses.
Lucian: “The full ledger is here. Don't just take my explanation.”
⟦FREE⟧
Narration: Next, if you want to continue: Night portico.

# SCENE｜Night portico
⟦BG|bg_c_c07s03|Night portico; Player, Agnes; Agnes asks pleasantly whether you are comfortable. Her key ring includes the key to the old ward.⟧
⟦TIME|22:20⟧
Narration: A little later. Night portico.
Narration: Agnes asks pleasantly whether you are comfortable.
Narration: Her key ring includes the key to the old ward.
Agnes: “Some doors were closed for the patients' own good.”
⟦FREE⟧
⟦SET|c_c07_event⟧

# CHOICE｜Was Lucian a witness, a participant, or both?
#### A｜Demand all receipts and payment records
Narration: Lucian's involvement is formally documented.
⟦OPT|A|set:c_c07_a⟧
#### B｜Have Nora independently trace the payment
Narration: The receiving accounts are examined independently.
⟦OPT|B|set:c_c07_b⟧
#### C｜Ask Agnes who authorized the payment
Narration: Her explanation is retained for comparison.
⟦OPT|C|set:c_c07_c⟧
# ·
Narration: Was Lucian a witness, a participant, or both?

# CHAPTER 8｜The Seven-Night Inheritance Trap
⟦GOAL|Understand the Seven-Night Inheritance Trap and decide your next step.|The Seven-Night Inheritance Trap⟧
⟦DONE|flag|c_c08_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning The Seven-Night Inheritance Trap|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Grandmother's lawyer's office
⟦BG|bg_c_c08s01|Grandmother's lawyer's office; Player, Nora; The original will contains no seven-night requirement. Counsel provides papers to protect the inheritance.⟧
⟦TIME|09:00⟧
Narration: On the fifth morning, at the grandmother's lawyer's office.
⟦IF|c_c07_a⟧
Narration: Lucian's involvement is formally documented.
⟦/IF⟧
⟦IF|c_c07_b⟧
Narration: The receiving accounts are examined independently.
⟦/IF⟧
⟦IF|c_c07_c⟧
Narration: Her explanation is retained for comparison.
⟦/IF⟧
Narration: The original will contains no seven-night requirement.
Narration: Counsel provides papers to protect the inheritance.
Nora: “You're free to leave. That condition wasn't in the original.”
⟦FREE⟧
Narration: Next, if you want to continue: Abbey guest room.

# SCENE｜Abbey guest room
⟦BG|bg_c_c08s02|Abbey guest room; Player, Nora; Records show previous visitors looking for Mara were encouraged to stay, then sent letters discouraging further questions.⟧
⟦TIME|09:25⟧
Narration: A little later. Abbey guest room.
Narration: Records show previous visitors looking for Mara were encouraged to stay, then sent letters discouraging further questions.
Nora: “You can investigate from outside these walls.”
⟦FREE⟧
Narration: Next, if you want to continue: Front steps.

# SCENE｜Front steps
⟦BG|bg_c_c08s03|Front steps; Player, Lucian; Lucian offers the gate keys and a travel schedule. A recent package containing a voice recorder arrives for Nora.⟧
⟦TIME|09:50⟧
Narration: A little later. Front steps.
Narration: Lucian offers the gate keys and a travel schedule.
Narration: A recent package containing a voice recorder arrives for Nora.
Lucian: “You don't have to promise you'll come back.”
⟦FREE⟧
⟦SET|c_c08_event⟧

# CHOICE｜If the seven-night rule is false, who still wants you here?
#### A｜Challenge the added condition through counsel
Narration: The correction proceeds independently.
⟦OPT|A|set:c_c08_a⟧
#### B｜Leave the abbey and investigate externally
Narration: Accommodation is no longer a means of control.
⟦OPT|B|set:c_c08_b⟧
#### C｜Stay voluntarily to verify the archive
Narration: You keep the ability to leave at any time.
⟦OPT|C|set:c_c08_c⟧
# ·
Narration: If the seven-night rule is false, who still wants you here?

# CHAPTER 9｜Mother Is Alive
⟦GOAL|Understand mother Is Alive and decide your next step.|Mother Is Alive⟧
⟦DONE|flag|c_c09_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning Mother Is Alive|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Audio restoration studio
⟦BG|bg_c_c09s01|Audio restoration studio; Player, Nora; A recent recording contains Mara's voice and a contemporary weather broadcast. Lucian's chair falls as he stands.⟧
⟦TIME|10:00⟧
Narration: Later that morning, at the audio restoration studio.
⟦IF|c_c08_a⟧
Narration: The correction proceeds independently.
⟦/IF⟧
⟦IF|c_c08_b⟧
Narration: Accommodation is no longer a means of control.
⟦/IF⟧
⟦IF|c_c08_c⟧
Narration: You keep the ability to leave at any time.
⟦/IF⟧
Narration: A recent recording contains Mara's voice and a contemporary weather broadcast.
Narration: Lucian's chair falls as he stands.
Nora: “This isn't an old recording. She's alive.”
⟦FREE⟧
Narration: Next, if you want to continue: Morning cloister table.

# SCENE｜Morning cloister table
⟦BG|bg_c_c09s02|Morning cloister table; Player, Lucian; An old call record shows Lucian had mistakenly believed Mara dead. He removes the outdated label from the folder.⟧
⟦TIME|10:25⟧
Narration: A little later. Morning cloister table.
Narration: An old call record shows Lucian had mistakenly believed Mara dead.
Narration: He removes the outdated label from the folder.
Lucian: “I thought she was gone. I was wrong.”
⟦FREE⟧
Narration: Next, if you want to continue: Abbey greenhouse.

# SCENE｜Abbey greenhouse
⟦BG|bg_c_c09s03|Abbey greenhouse; Player, Nora; The mailbox mentioned in the recording contains fresh paper, a station receipt and a familiar red button. Three knocks sound on the glass.⟧
⟦TIME|10:50⟧
Narration: A little later. Abbey greenhouse.
Narration: The mailbox mentioned in the recording contains fresh paper, a station receipt and a familiar red button.
Narration: Three knocks sound on the glass.
Nora: “Let's find a safe way to confirm the source.”
⟦FREE⟧
⟦SET|c_c09_event⟧

# CHOICE｜Why is your mother alive but afraid to meet you?
#### A｜Verify the recording's location
Narration: Nora checks the audio and pursues a lawful contact route.
⟦OPT|A|set:c_c09_a⟧
#### B｜Establish whether Mara wants direct contact
Narration: A confidential message is left without exposing her whereabouts.
⟦OPT|B|set:c_c09_b⟧
#### C｜Request Lucian's old route information
Narration: He supplies the relevant records without directing your movements.
⟦OPT|C|set:c_c09_c⟧
# ·
Narration: Why is your mother alive but afraid to meet you?

# CHAPTER 10｜The Kiss That Almost Happened
⟦GOAL|Understand the Kiss That Almost Happened and decide your next step.|The Kiss That Almost Happened⟧
⟦DONE|flag|c_c10_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning The Kiss That Almost Happened|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Greenhouse passage
⟦BG|bg_c_c10s01|Greenhouse passage; Player, Lucian; Rain rattles the glass. Lucian holds a lamp within reach, leaving the exit clear. He stops a step away.⟧
⟦TIME|19:00⟧
Narration: On the fifth night, at the greenhouse passage.
⟦IF|c_c09_a⟧
Narration: Nora checks the audio and pursues a lawful contact route.
⟦/IF⟧
⟦IF|c_c09_b⟧
Narration: A confidential message is left without exposing her whereabouts.
⟦/IF⟧
⟦IF|c_c09_c⟧
Narration: He supplies the relevant records without directing your movements.
⟦/IF⟧
Narration: Rain rattles the glass.
Narration: Lucian holds a lamp within reach, leaving the exit clear.
Narration: He stops a step away.
Lucian: “I want to kiss you. I won't assume you want that.”
⟦FREE⟧
Narration: Next, if you want to continue: Greenhouse workbench.

# SCENE｜Greenhouse workbench
⟦BG|bg_c_c10s02|Greenhouse workbench; Player, Lucian; A new letter includes a route to the old care institution. An old guardianship record indicates Agnes still interfered with Mara's life.⟧
⟦TIME|19:25⟧
Narration: A little later. Greenhouse workbench.
Narration: A new letter includes a route to the old care institution.
Narration: An old guardianship record indicates Agnes still interfered with Mara's life.
Lucian: “Finding that record matters more than figuring out where we stand.”
⟦FREE⟧
Narration: Next, if you want to continue: Greenhouse eaves.

# SCENE｜Greenhouse eaves
⟦BG|bg_c_c10s03|Greenhouse eaves; Player, Lucian; He leaves an umbrella nearby and waits in the rain. Counsel sends permission to retrieve ward records lawfully.⟧
⟦TIME|19:50⟧
Narration: A little later. Greenhouse eaves.
Narration: He leaves an umbrella nearby and waits in the rain.
Narration: Counsel sends permission to retrieve ward records lawfully.
Lucian: “I can wait. Tell me what matters to you right now.”
⟦FREE⟧
⟦SET|c_c10_event⟧

# CHOICE｜Where is Mara hiding while the old guardianship record remains in use?
#### A｜Express an explicit wish for closeness without forgiving him
Narration: Only the expressed wish is recorded; no contact is assumed.
⟦OPT|A|set:c_c10_a⟧
#### B｜Tell him not to approach intimately
Narration: He keeps the requested distance.
⟦OPT|B|set:c_c10_b⟧
#### C｜Prioritize confirming Mara's safety
Narration: The investigation proceeds without an intimate commitment.
⟦OPT|C|set:c_c10_c⟧
# ·
Narration: Where is Mara hiding while the old guardianship record remains in use?

# CHAPTER 11｜The Locked Room
⟦GOAL|Understand the Locked Room and decide your next step.|The Locked Room⟧
⟦DONE|flag|c_c11_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning The Locked Room|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Old care institution ward
⟦BG|bg_c_c11s01|Old care institution ward; Player, Lucian; The rusted lock opens from the outside. Calendar marks cover the wall. Lucian grips the doorframe.⟧
⟦TIME|11:00⟧
Narration: On the sixth morning, at the old care institution ward.
⟦IF|c_c10_a⟧
Narration: Only the expressed wish is recorded; no contact is assumed.
⟦/IF⟧
⟦IF|c_c10_b⟧
Narration: He keeps the requested distance.
⟦/IF⟧
⟦IF|c_c10_c⟧
Narration: The investigation proceeds without an intimate commitment.
⟦/IF⟧
Narration: The rusted lock opens from the outside.
Narration: Calendar marks cover the wall.
Narration: Lucian grips the doorframe.
Lucian: “I brought her here. I believed Agnes when she called it treatment.”
⟦FREE⟧
Narration: Next, if you want to continue: Ward records cabinet.

# SCENE｜Ward records cabinet
⟦BG|bg_c_c11s02|Ward records cabinet; Player, Lucian; He turns over the register. A discharge certificate has been altered. He cries without asking to be forgiven.⟧
⟦TIME|11:25⟧
Narration: A little later. Ward records cabinet.
Narration: He turns over the register.
Narration: A discharge certificate has been altered.
Narration: He cries without asking to be forgiven.
Lucian: “Look at the date. It was changed.”
⟦FREE⟧
Narration: Next, if you want to continue: Institution exit.

# SCENE｜Institution exit
⟦BG|bg_c_c11s03|Institution exit; Player, Nora; Nora seals the medical orders, photographs and duty roster as evidence. Agnes's lawyer no longer blocks the exit.⟧
⟦TIME|11:50⟧
Narration: A little later. Institution exit.
Narration: Nora seals the medical orders, photographs and duty roster as evidence.
Narration: Agnes's lawyer no longer blocks the exit.
Nora: “We can preserve the originals through proper channels.”
⟦FREE⟧
⟦SET|c_c11_event⟧

# CHOICE｜Who has the right to ask for forgiveness for this?
#### A｜Photograph the lock and preserve the ward traces
Narration: The physical evidence is documented.
⟦OPT|A|set:c_c11_a⟧
#### B｜Require Lucian to write a full account
Narration: His actions enter the formal record.
⟦OPT|B|set:c_c11_b⟧
#### C｜Ask investigators to obtain the original documents
Narration: The evidence is secured through formal procedures.
⟦OPT|C|set:c_c11_c⟧
# ·
Narration: Who has the right to ask for forgiveness for this?

# CHAPTER 12｜The False Statement He Signed
⟦GOAL|Understand the False Statement He Signed and decide your next step.|The False Statement He Signed⟧
⟦DONE|flag|c_c12_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning The False Statement He Signed|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Notarial archive
⟦BG|bg_c_c12s01|Notarial archive; Player, Nora; The original discharge certificate appears. Lucian's signature predates the actual release date by three days.⟧
⟦TIME|15:00⟧
Narration: That afternoon, at the notarial archive.
⟦IF|c_c11_a⟧
Narration: The physical evidence is documented.
⟦/IF⟧
⟦IF|c_c11_b⟧
Narration: His actions enter the formal record.
⟦/IF⟧
⟦IF|c_c11_c⟧
Narration: The evidence is secured through formal procedures.
⟦/IF⟧
Narration: The original discharge certificate appears.
Narration: Lucian's signature predates the actual release date by three days.
Nora: “The signature is real. The date is false.”
⟦FREE⟧
Narration: Next, if you want to continue: Suburban station waiting room.

# SCENE｜Suburban station waiting room
⟦BG|bg_c_c12s02|Suburban station waiting room; Player, Lucian; Lucian admits that he knew Mara had not been released. He signed to protect the abbey's reputation. He writes a full statement.⟧
⟦TIME|15:25⟧
Narration: A little later. Suburban station waiting room.
Narration: Lucian admits that he knew Mara had not been released.
Narration: He signed to protect the abbey's reputation.
Narration: He writes a full statement.
Lucian: “I knew enough to refuse. I signed anyway.”
⟦FREE⟧
Narration: Next, if you want to continue: Lawyer's meeting room.

# SCENE｜Lawyer's meeting room
⟦BG|bg_c_c12s03|Lawyer's meeting room; Player, Nora; Lucian submits a statement against his own interests. Counsel receives news that Mara is willing to meet at a confidential location.⟧
⟦TIME|15:50⟧
Narration: A little later. Lawyer's meeting room.
Narration: Lucian submits a statement against his own interests.
Narration: Counsel receives news that Mara is willing to meet at a confidential location.
Nora: “We have to respect the conditions Mara set.”
⟦FREE⟧
⟦SET|c_c12_event⟧

# CHOICE｜What did his false statement cost your mother?
#### A｜Require a formal admission and testimony
Narration: His statement enters the accountability process.
⟦OPT|A|set:c_c12_a⟧
#### B｜Suspend private contact and use Nora as intermediary
Narration: Investigation continues without personal intimacy.
⟦OPT|B|set:c_c12_b⟧
#### C｜Leave future contact open without forgiving the false statement
Narration: Trust and accountability remain separate.
⟦OPT|C|set:c_c12_c⟧
# ·
Narration: What did his false statement cost your mother?

# CHAPTER 13｜Mother Returns in the Rain
⟦GOAL|Understand mother Returns in the Rain and decide your next step.|Mother Returns in the Rain⟧
⟦DONE|flag|c_c13_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning Mother Returns in the Rain|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Rural railway station
⟦BG|bg_c_c13s01|Rural railway station; Player, Nora; A thin woman steps out of the rain beside Nora. Her eyes match the photograph. She is holding the old red scarf.⟧
⟦TIME|09:00⟧
Narration: On the seventh morning, at the rural railway station.
⟦IF|c_c12_a⟧
Narration: His statement enters the accountability process.
⟦/IF⟧
⟦IF|c_c12_b⟧
Narration: Investigation continues without personal intimacy.
⟦/IF⟧
⟦IF|c_c12_c⟧
Narration: Trust and accountability remain separate.
⟦/IF⟧
Narration: A thin woman steps out of the rain beside Nora.
Narration: Her eyes match the photograph.
Narration: She is holding the old red scarf.
Nora: “Mara asked me to accompany her here.”
⟦FREE⟧
Narration: Next, if you want to continue: Quiet town inn.

# SCENE｜Quiet town inn
⟦BG|bg_c_c13s02|Quiet town inn; Player, Mara; Mara lays out seven years of receipts with trembling fingers. She describes false guardianship and threats. A birthday card was never sent.⟧
⟦TIME|09:25⟧
Narration: A little later. Quiet town inn.
Narration: Mara lays out seven years of receipts with trembling fingers.
Narration: She describes false guardianship and threats.
Narration: A birthday card was never sent.
Mara: “I didn't stop thinking of you. I didn't know how to reach you safely.”
⟦FREE⟧
Narration: Next, if you want to continue: Private family meeting room.

# SCENE｜Private family meeting room
⟦BG|bg_c_c13s03|Private family meeting room; Player, Mara; She gives Nora payment records connecting Agnes to falsified medical records. Lucian is not present.⟧
⟦TIME|09:50⟧
Narration: A little later. Private family meeting room.
Narration: She gives Nora payment records connecting Agnes to falsified medical records.
Narration: Lucian is not present.
Mara: “I'll tell you what I can, when you're ready to hear it.”
⟦FREE⟧
⟦SET|c_c13_event⟧

# CHOICE｜Will you and Mara want to face the public together?
#### A｜Prioritize Mara's safety and health
Narration: Independent support and accommodation are arranged.
⟦OPT|A|set:c_c13_a⟧
#### B｜Hear what Mara is willing to share
Narration: She controls the pace of her account.
⟦OPT|B|set:c_c13_b⟧
#### C｜Keep some distance until you are ready
Narration: No embrace or reconciliation is presumed.
⟦OPT|C|set:c_c13_c⟧
# ·
Narration: Will you and Mara want to face the public together?

# CHAPTER 14｜A Real Confession
⟦GOAL|Understand a Real Confession and decide your next step.|A Real Confession⟧
⟦DONE|flag|c_c14_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning A Real Confession|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Independent hearing room
⟦BG|bg_c_c14s01|Independent hearing room; Player, Lucian; Lucian admits signing the false certificate. Every word is entered into the hearing record.⟧
⟦TIME|14:00⟧
Narration: That afternoon, at the independent hearing room.
⟦IF|c_c13_a⟧
Narration: Independent support and accommodation are arranged.
⟦/IF⟧
⟦IF|c_c13_b⟧
Narration: She controls the pace of her account.
⟦/IF⟧
⟦IF|c_c13_c⟧
Narration: No embrace or reconciliation is presumed.
⟦/IF⟧
Narration: Lucian admits signing the false certificate.
Narration: Every word is entered into the hearing record.
Lucian: “I signed it. I won't hide behind my vows.”
⟦FREE⟧
Narration: Next, if you want to continue: Abbey entrance steps.

# SCENE｜Abbey entrance steps
⟦BG|bg_c_c14s02|Abbey entrance steps; Player, Nora; Agnes's management authority is temporarily restricted. Financial and medical records are under review. The seven-night rule is removed.⟧
⟦TIME|14:25⟧
Narration: A little later. Abbey entrance steps.
Narration: Agnes's management authority is temporarily restricted.
Narration: Financial and medical records are under review.
Narration: The seven-night rule is removed.
Nora: “The inquiry isn't over, but no one has to obey that rule.”
⟦FREE⟧
Narration: Next, if you want to continue: Empty chapel pew.

# SCENE｜Empty chapel pew
⟦BG|bg_c_c14s03|Empty chapel pew; Player, Lucian; Lucian sits in the last row. The final candle burns low. He apologizes without asking you to remain.⟧
⟦TIME|14:50⟧
Narration: A little later. Empty chapel pew.
Narration: Lucian sits in the last row.
Narration: The final candle burns low.
Narration: He apologizes without asking you to remain.
Lucian: “I'm sorry for every time I chose silence.”
⟦FREE⟧
⟦SET|c_c14_event⟧

# CHOICE｜Can someone who finally admits his wrongs ever earn an equal introduction?
#### A｜Require further testimony and disclosure
Narration: His accountability continues through formal proceedings.
⟦OPT|A|set:c_c14_a⟧
#### B｜Limit future contact to necessary matters
Narration: Personal boundaries remain clear.
⟦OPT|B|set:c_c14_b⟧
#### C｜Express possible attraction while demanding sustained change
Narration: He accepts the need for evidence of change without claiming a relationship.
⟦OPT|C|set:c_c14_c⟧
# ·
Narration: Can someone who finally admits his wrongs ever earn an equal introduction?

# CHAPTER 15｜Freedom on the Seventh Night
⟦GOAL|Understand freedom on the Seventh Night and decide your next step.|Freedom on the Seventh Night⟧
⟦DONE|flag|c_c15_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning Freedom on the Seventh Night|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Grandmother's lawyer's office
⟦BG|bg_c_c15s01|Grandmother's lawyer's office; Player, Nora; Counsel confirms the added condition is invalid and your inheritance can be managed independently. The seventh bell rings outside.⟧
⟦TIME|21:00⟧
Narration: On the seventh night, at the grandmother's lawyer's office.
⟦IF|c_c14_a⟧
Narration: His accountability continues through formal proceedings.
⟦/IF⟧
⟦IF|c_c14_b⟧
Narration: Personal boundaries remain clear.
⟦/IF⟧
⟦IF|c_c14_c⟧
Narration: He accepts the need for evidence of change without claiming a relationship.
⟦/IF⟧
Narration: Counsel confirms the added condition is invalid and your inheritance can be managed independently.
Narration: The seventh bell rings outside.
Nora: “You don't have to spend another night at the abbey.”
⟦FREE⟧
Narration: Next, if you want to continue: Outside the abbey wall.

# SCENE｜Outside the abbey wall
⟦BG|bg_c_c15s02|Outside the abbey wall; Player, Lucian; Lucian gives the keys to the new administrator. His access to the ward ends. He carries only the evidence checklist.⟧
⟦TIME|21:25⟧
Narration: A little later. Outside the abbey wall.
Narration: Lucian gives the keys to the new administrator.
Narration: His access to the ward ends.
Narration: He carries only the evidence checklist.
Lucian: “You don't have to tell me where you're going.”
⟦FREE⟧
Narration: Next, if you want to continue: Seventh-night cloister.

# SCENE｜Seventh-night cloister
⟦BG|bg_c_c15s03|Seventh-night cloister; Player, Mara; Mara waits beneath the lamp as Nora hands over receipts. No one blocks the passage. Dawn approaches.⟧
⟦TIME|21:50⟧
Narration: A little later. Seventh-night cloister.
Narration: Mara waits beneath the lamp as Nora hands over receipts.
Narration: No one blocks the passage.
Narration: Dawn approaches.
Mara: “What do you want to take with you when you leave?”
⟦FREE⟧
⟦SET|c_c15_event⟧

# CHOICE｜What does freedom look like beyond the abbey?
#### A｜Support lawful access to the archives
Narration: The archive transition begins with appropriate privacy safeguards.
⟦OPT|A|set:c_c15_a⟧
#### B｜Prioritize inheritance and family recovery
Narration: Mara has a voice in decisions; romance can wait.
⟦OPT|B|set:c_c15_b⟧
#### C｜Leave and reconsider any private relationship later
Narration: No reunion is assumed and you remain free to leave.
⟦OPT|C|set:c_c15_c⟧
# ·
Narration: What does freedom look like beyond the abbey?

# CHAPTER 16｜The Choice in Morning Light
⟦GOAL|Understand the Choice in Morning Light and decide your next step.|The Choice in Morning Light⟧
⟦DONE|flag|c_c16_event|Witness key event|Narration: Take a closer look at what just happened.⟧
⟦DONE|say|Express what you want to investigate, do, refuse, or postpone concerning The Choice in Morning Light|State your intent|Narration: You can say what you need or ask for more time.⟧

# SCENE｜Public archive
⟦BG|bg_c_c16s01|Public archive; Player, Nora; Six months later, the old library is open as an archive. Lucian's name appears in a lawful public statement.⟧
⟦TIME|10:00⟧
Narration: Six months later, at the public archive.
⟦IF|c_c15_a⟧
Narration: The archive transition begins with appropriate privacy safeguards.
⟦/IF⟧
⟦IF|c_c15_b⟧
Narration: Mara has a voice in decisions; romance can wait.
⟦/IF⟧
⟦IF|c_c15_c⟧
Narration: No reunion is assumed and you remain free to leave.
⟦/IF⟧
Narration: Six months later, the old library is open as an archive.
Narration: Lucian's name appears in a lawful public statement.
Nora: “The case is still in process. At last, we can see the documents.”
⟦FREE⟧
Narration: Next, if you want to continue: West archive table.

# SCENE｜West archive table
⟦BG|bg_c_c16s02|West archive table; Player, Lucian; Lucian comes by appointment with a notebook documenting his accountability. He waits for an invitation to sit.⟧
⟦TIME|10:25⟧
Narration: A little later. West archive table.
Narration: Lucian comes by appointment with a notebook documenting his accountability.
Narration: He waits for an invitation to sit.
Lucian: “If we meet again, I'd like to spend an afternoon with you without hiding anything.”
⟦FREE⟧
Narration: Next, if you want to continue: Morning valley path.

# SCENE｜Morning valley path
⟦BG|bg_c_c16s03|Morning valley path; Player, Lucian; The fog clears from the old building. Morning light catches Mara's rosary. The path is open in both directions.⟧
⟦TIME|10:50⟧
Narration: A little later. Morning valley path.
Narration: The fog clears from the old building.
Narration: Morning light catches Mara's rosary.
Narration: The path is open in both directions.
Lucian: “I'd like to walk with you. But if you'd rather go alone, I won't stop you.”
⟦FREE⟧
⟦SET|c_c16_event⟧

# CHOICE｜The morning door stays open. Confession is no longer a chain.
#### A｜Explicitly choose an equal romantic relationship once accountability and boundaries allow it
Narration: Only a clearly expressed wish can open the romance route; the legal process remains independent.
⟦OPT|A|set:c_c16_a⟧
#### B｜Choose friendship and shared archive work
Narration: The relationship continues without romantic obligations.
⟦OPT|B|set:c_c16_b⟧
#### C｜Choose independence or defer private contact
Narration: Your life proceeds without making love a condition of redemption.
⟦OPT|C|set:c_c16_c⟧
# ·
Narration: The morning door stays open. Confession is no longer a chain.
