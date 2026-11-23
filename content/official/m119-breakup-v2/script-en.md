# CHAPTER 1｜A Million Dollars to Leave
⟦ORIENT|bg⟧
⟦CHAR|你|f|28|f2|Adult female founder of Second Act|The player decides their name, appearance, words, and boundaries|You⟧
⟦CHAR|加布里埃尔|m|33|m3|Financial heir; former fiancé|Short dark chestnut hair, deep green eyes, charcoal suit. Precise and restrained; folds documents carefully and waits before approaching. Affection cannot erase responsibility.|Gabriel⟧
⟦CHAR|薇薇安|f|31|f1|Investor, employee-welfare trustee, and client|Olive skin, shoulder-length black hair, ivory blouse, camel coat. Calm and direct; covers private photographs herself and controls her own exit.|Vivian⟧
⟦CHAR|西奥|m|30|m5|Public-interest legal adviser; potential partner|Black, short natural curls, brown eyes, navy blazer. Warm, with understated humor and clear boundaries. Asks first; cannot represent every party without conflicts.|Theo⟧
⟦CHAR|奥利维亚|f|29|f2|Operations lead; potential business partner|Copper-brown bob, hazel eyes, emerald suit. Quick and pragmatic, quietly funny; uses checklists and seeks real decision-making authority.|Olivia⟧
⟦CHAR|莉娜|f|32|f2|Independent investigative journalist|Light brown freckled skin, dark curls in a low bun, black leather jacket. Distinguishes public fact from private experience; never trades another person’s trauma for a story.|Lena⟧
⟦CHAR|玛拉|f|56|f2|Retired nurse and records witness|Silver hair, burgundy cardigan. Carefully distinguishes her direct observations from uncertainty.|Mara⟧
⟦CHAR|乔纳斯|m|48|m5|Pier worker and incident witness|Dark brown skin, short gray hair, work coat; describes only what he directly saw.|Jonas⟧
⟦CHAR|哈珀|f|26|f1|Adult singer and publicity client|Blonde hair, black performance dress; refuses to be represented by an invented breakup story.|Harper⟧
⟦CHAR|基拉|f|28|f1|Adult online creator and privacy client|Blonde hair, green hoodie; sets explicit boundaries around private photographs.|Kira⟧
⟦CHAR|凯西|m|30|m4|Joint asset handover client|Short light brown hair, white shirt; needs workable shared-brand and pet-care arrangements.|Casey⟧
⟦CHAR|马丁|m|49|m3|Corporate crisis PR adviser|Gray hair, dark suit; presents control as order. Other people need evidence before knowing his actions.|Martin⟧
⟦SECRET|m119_delay|Gabriel signed a repair delay and remained silent after the incident; this does not establish an order to lock exits.|knows:加布里埃尔|reveal_from:5⟧
⟦SECRET|m119_marriage|Vivian and Gabriel’s marriage involves an employee-trust arrangement.|knows:薇薇安,加布里埃尔|reveal_from:4⟧
⟦SECRET|m119_procurement|Martin’s procurement account links to exit-locking and casualty-list instructions; other people must verify this through lawful records.|knows:马丁|reveal_from:14⟧
⟦GOAL|确认神秘委托是否合法，同时决定是否调查照片中的前未婚夫|Establish the client’s wishes and the agency’s conflict of interest.⟧
⟦DONE|flag|m119_done_CH01_S01|Complete: The Silver Check at Midnight|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH01_S02|Complete: The Man in the Wedding Photo|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH01_S03|Complete: She Refuses to Be the Villain|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH01_S04|Complete: The Name Among the Dead|Respond to this scene; declining or deferring is valid.⟧

# SCENE｜The Silver Check at Midnight
⟦BG|BG_CH01_01|Agency reception, late at night · Vivian Cross, Olivia Reed⟧
⟦TIME|Day 1⟧
⟦FX|rain⟧
⟦BGM|m119_ch01⟧
⟦SET|native_v2,m119_scene~CH01_S01⟧
⟦SFX|m119_ch01_s01⟧
旁白：Vivian removes her wet gloves and slides a check across the desk. Olivia closes the door before touching the money.
旁白：She wants a marriage to end but has not explained why.
薇薇安：“I need a marriage to end.”
奥利维亚：“Then start with the truth.”
薇薇安：“A million dollars. No questions asked.”
旁白：You may ask about confidentiality, authority, and conflicts before considering the case.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH01_S01~protect_client,m119_done_CH01_S01⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH01_S01~seek_evidence,m119_done_CH01_S01⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH01_S01~state_boundary,m119_done_CH01_S01⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH01_S01~defer_or_reject,m119_done_CH01_S01⟧
# ·

# SCENE｜The Man in the Wedding Photo
⟦BG|BG_CH01_02|The agency evidence table · Vivian Cross, Olivia Reed⟧
⟦TIME|Day 1⟧
⟦FX|rain⟧
⟦BGM|m119_ch01⟧
⟦SET|native_v2,m119_scene~CH01_S02⟧
⟦SFX|m119_ch01_s02⟧
旁白：Vivian turns a framed wedding photo toward you. Olivia reaches for the conflict-of-interest form.
旁白：The groom is the fiancé you lost contact with three years ago. This creates a potential conflict for the client.
薇薇安：“You know him.”
奥利维亚：“We have to disclose the conflict.”
薇薇安：“He thinks you died.”
⟦MG|g_m119_ch01_a⟧
旁白：You may decline the case, arrange independent representation, or accept only preliminary information.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH01_S02~protect_client,m119_done_CH01_S02⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH01_S02~seek_evidence,m119_done_CH01_S02⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH01_S02~state_boundary,m119_done_CH01_S02⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH01_S02~defer_or_reject,m119_done_CH01_S02⟧
# ·

# SCENE｜She Refuses to Be the Villain
⟦BG|BG_CH01_03|The agency meeting room · Vivian Cross, Olivia Reed⟧
⟦TIME|Day 1⟧
⟦FX|rain⟧
⟦BGM|m119_ch01⟧
⟦SET|native_v2,m119_scene~CH01_S03⟧
⟦SFX|m119_ch01_s03⟧
旁白：Vivian removes her ring beside a glass of water and pulls out a chair. Olivia marks the limits of confidentiality.
旁白：Vivian will not frame her departure as destroying another woman or expose private marital details.
薇薇安：“I'm not hiring you to hurt him.”
奥利维亚：“Who would be hurt if you stayed?”
薇薇安：“People who never signed our deal.”
⟦MG|g_m119_ch01_b⟧
旁白：Vivian explains that the shareholder meeting is seven days away. The vote makes her exit urgent.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH01_S03~protect_client,m119_done_CH01_S03⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH01_S03~seek_evidence,m119_done_CH01_S03⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH01_S03~state_boundary,m119_done_CH01_S03⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH01_S03~defer_or_reject,m119_done_CH01_S03⟧
# ·

# SCENE｜The Name Among the Dead
⟦BG|BG_CH01_04|The agency’s private back room · Olivia Reed, Vivian Cross⟧
⟦TIME|Day 1⟧
⟦FX|rain⟧
⟦BGM|m119_ch01⟧
⟦SET|native_v2,m119_scene~CH01_S04⟧
⟦SFX|m119_ch01_s04⟧
旁白：Olivia shines a flashlight over an old fire casualty list. Vivian pauses at the door to leave you space.
旁白：Your former identity is marked deceased. The list does not establish who submitted that information.
奥利维亚：“This isn't proof you died.”
薇薇安：“It's proof someone wanted the file closed.”
奥利维亚：“We can still walk away.”
旁白：An anonymous message offers a way to verify the original fire records tomorrow.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH01_S04~protect_client,m119_done_CH01_S04⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH01_S04~seek_evidence,m119_done_CH01_S04⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH01_S04~state_boundary,m119_done_CH01_S04⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH01_S04~defer_or_reject,m119_done_CH01_S04⟧
# ·
# CHAPTER 2｜Secrets Are Not for Sale
⟦GOAL|建立事务所受理规则，保护委托人，同时找到第一次可核验的线索|Set separate permissions and protect the clients’ privacy.⟧
⟦DONE|flag|m119_done_CH02_S01|Complete: Bad News in the Morning|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH02_S02|Complete: The Contract with Covered Names|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH02_S03|Complete: The Streamer’s Last Photo|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH02_S04|Complete: A Marriage Before the Vote|Respond to this scene; declining or deferring is valid.⟧

# SCENE｜Bad News in the Morning
⟦BG|BG_CH02_01|Agency reception · Olivia Reed, Lena Brooks⟧
⟦TIME|Day 1⟧
⟦FX|none⟧
⟦BGM|m119_ch02⟧
⟦SET|native_v2,m119_scene~CH02_S01⟧
⟦SFX|m119_ch02_s01⟧
旁白：Olivia locks the uncashed check away. Lena arrives with images being used to blackmail a streamer.
旁白：Ordinary clients still need help while the wealthy client’s case competes for attention.
奥利维亚：“We don't sell revenge.”
莉娜：“Then you'll like this client.”
奥利维亚：“We protect people, not secrets at any price.”
⟦IF|CH01_S02_defer_or_reject⟧
旁白：That mandate remains deferred. Any referral will use a separate file from ordinary clients.
⟦/IF⟧
旁白：You may set intake priorities and separate the risks of each case.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH02_S01~protect_client,m119_done_CH02_S01⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH02_S01~seek_evidence,m119_done_CH02_S01⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH02_S01~state_boundary,m119_done_CH02_S01⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH02_S01~defer_or_reject,m119_done_CH02_S01⟧
# ·

# SCENE｜The Contract with Covered Names
⟦BG|BG_CH02_02|The agency consultation table · Olivia Reed, Theo Morgan, Vivian Cross⟧
⟦TIME|Day 1⟧
⟦FX|none⟧
⟦BGM|m119_ch02⟧
⟦SET|native_v2,m119_scene~CH02_S02⟧
⟦SFX|m119_ch02_s02⟧
旁白：Theo covers the names on a contract while explaining fees and consent. Vivian turns her phone toward you.
旁白：The small case and the million-dollar proposal cannot share one blanket permission.
西奥：“Consent isn't a line in tiny print.”
薇薇安：“I can give you access. Not ownership.”
西奥：“Good. Then we have a deal.”
⟦MG|g_m119_ch02_a⟧
旁白：Independent legal review can separate Vivian’s representation from your personal conflict.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH02_S02~protect_client,m119_done_CH02_S02⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH02_S02~seek_evidence,m119_done_CH02_S02⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH02_S02~state_boundary,m119_done_CH02_S02⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH02_S02~defer_or_reject,m119_done_CH02_S02⟧
# ·

# SCENE｜The Streamer’s Last Photo
⟦BG|BG_CH02_03|The agency media worktable · Lena Brooks, Olivia Reed⟧
⟦TIME|Day 1⟧
⟦FX|none⟧
⟦BGM|m119_ch02⟧
⟦SET|native_v2,m119_scene~CH02_S03⟧
⟦SFX|m119_ch02_s03⟧
旁白：Lena separates an authorized public photo from a private image of uncertain origin. Olivia passes you notes.
旁白：Keeping or circulating the private image could cause a second privacy violation.
莉娜：“The public photo is fine.”
奥利维亚：“The other one isn't ours to keep.”
莉娜：“That's the difference that matters.”
⟦MG|g_m119_ch02_b⟧
旁白：You may sort the material by source and permission and prepare a removal request.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH02_S03~protect_client,m119_done_CH02_S03⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH02_S03~seek_evidence,m119_done_CH02_S03⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH02_S03~state_boundary,m119_done_CH02_S03⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH02_S03~defer_or_reject,m119_done_CH02_S03⟧
# ·

# SCENE｜A Marriage Before the Vote
⟦BG|BG_CH02_04|The building’s rooftop entrance · Theo Morgan, Vivian Cross⟧
⟦TIME|Day 1⟧
⟦FX|none⟧
⟦BGM|m119_ch02⟧
⟦SET|native_v2,m119_scene~CH02_S04⟧
⟦SFX|m119_ch02_s04⟧
旁白：Theo points to a corporate announcement on his phone. Vivian stops at the rooftop door.
旁白：A spouse’s voting authority still needs independent legal interpretation.
薇薇安：“Seven days. That's all I have.”
西奥：“Time pressure doesn't erase her choices.”
薇薇安：“I know. That's why I came.”
旁白：You may preserve the records without letting your personal history dictate Vivian’s exit.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH02_S04~protect_client,m119_done_CH02_S04⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH02_S04~seek_evidence,m119_done_CH02_S04⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH02_S04~state_boundary,m119_done_CH02_S04⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH02_S04~defer_or_reject,m119_done_CH02_S04⟧
# ·
# CHAPTER 3｜A Death Recorded in Error
⟦GOAL|找到死者登记与医院收治记录之间的冲突|Compare the original transfer records with the death entry.⟧
⟦DONE|flag|m119_done_CH03_S01|Complete: A Cold Draft in the Archives|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH03_S02|Complete: Medical Folder Seven|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH03_S03|Complete: Signatures and Seals|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH03_S04|Complete: An Unknown Number in the Stairwell|Respond to this scene; declining or deferring is valid.⟧

# SCENE｜A Cold Draft in the Archives
⟦BG|BG_CH03_01|The public archive reading room · Olivia Reed, Theo Morgan⟧
⟦TIME|Day 2⟧
⟦FX|none⟧
⟦BGM|m119_ch03⟧
⟦SET|native_v2,m119_scene~CH03_S01⟧
⟦SFX|m119_ch03_s01⟧
旁白：Theo draws a fire index from a box. Olivia holds the page steady.
旁白：The public index lacks the originals, and the names have been changed more than once.
西奥：“A stamp isn't the whole story.”
奥利维亚：“Someone changed the index.”
西奥：“We need the source, not a rumor.”
旁白：You may request certified copies or arrange access through an authorized lawyer.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH03_S01~protect_client,m119_done_CH03_S01⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH03_S01~seek_evidence,m119_done_CH03_S01⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH03_S01~state_boundary,m119_done_CH03_S01⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH03_S01~defer_or_reject,m119_done_CH03_S01⟧
# ·

# SCENE｜Medical Folder Seven
⟦BG|BG_CH03_02|A permitted medical-records consultation · Theo Morgan, Mara Ellis⟧
⟦TIME|Day 2⟧
⟦FX|none⟧
⟦BGM|m119_ch03⟧
⟦SET|native_v2,m119_scene~CH03_S02⟧
⟦SFX|m119_ch03_s02⟧
旁白：Mara offers an authorized transfer entry. Theo asks to see only the parts you may legally request.
旁白：Other unidentified survivors’ information remains private.
玛拉：“We sent one woman out alive.”
西奥：“Only the entries she can request, please.”
玛拉：“That's enough to ask the next question.”
⟦MG|g_m119_ch03_a⟧
旁白：You may compare the transfer time and destination with the conflicting death entry.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH03_S02~protect_client,m119_done_CH03_S02⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH03_S02~seek_evidence,m119_done_CH03_S02⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH03_S02~state_boundary,m119_done_CH03_S02⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH03_S02~defer_or_reject,m119_done_CH03_S02⟧
# ·

# SCENE｜Signatures and Seals
⟦BG|BG_CH03_03|The archive comparison table · Olivia Reed, Theo Morgan⟧
⟦TIME|Day 2⟧
⟦FX|none⟧
⟦BGM|m119_ch03⟧
⟦SET|native_v2,m119_scene~CH03_S03⟧
⟦SFX|m119_ch03_s03⟧
旁白：Olivia places two versions on a lightbox. Theo offers a magnifying glass.
旁白：One receipt number leads to a closed contractor account.
奥利维亚：“Same date. Different signature.”
西奥：“That doesn't prove who ordered it.”
奥利维亚：“But it tells us where to look.”
⟦MG|g_m119_ch03_b⟧
旁白：The contractor number is a lead, not proof of who ordered the change.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH03_S03~protect_client,m119_done_CH03_S03⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH03_S03~seek_evidence,m119_done_CH03_S03⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH03_S03~state_boundary,m119_done_CH03_S03⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH03_S03~defer_or_reject,m119_done_CH03_S03⟧
# ·

# SCENE｜An Unknown Number in the Stairwell
⟦BG|BG_CH03_04|The archive stairwell · Gabriel Hawthorne, Theo Morgan⟧
⟦TIME|Day 2⟧
⟦FX|none⟧
⟦BGM|m119_ch03⟧
⟦SET|native_v2,m119_scene~CH03_S04⟧
⟦SFX|m119_ch03_s04⟧
旁白：Gabriel finishes a call at a distance, steps toward you, then stops. Theo moves between you.
旁白：Gabriel has not yet verified your identity.
加布里埃尔：“Do I know you?”
西奥：“Any contact goes through me.”
加布里埃尔：“Then tell her I'm listening.”
旁白：You may ask Theo to relay a message or decline direct contact.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH03_S04~protect_client,m119_done_CH03_S04⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH03_S04~seek_evidence,m119_done_CH03_S04⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH03_S04~state_boundary,m119_done_CH03_S04⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH03_S04~defer_or_reject,m119_done_CH03_S04⟧
# ·
# CHAPTER 4｜A Marriage on Paper
⟦GOAL|厘清 薇薇安 与 加布里埃尔 的婚姻真实结构，而不替双方决定离婚|Separate the marriage from the employee trust.⟧
⟦DONE|flag|m119_done_CH04_S01|Complete: A Wedding Without a Kiss|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH04_S02|Complete: The Price of a Ring|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH04_S03|Complete: The Lawyer Who Gives No Answer|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH04_S04|Complete: Two Exits from the Reception|Respond to this scene; declining or deferring is valid.⟧

# SCENE｜A Wedding Without a Kiss
⟦BG|BG_CH04_01|A private video-review room · Vivian Cross, Theo Morgan⟧
⟦TIME|Day 2⟧
⟦FX|none⟧
⟦BGM|m119_ch04⟧
⟦SET|native_v2,m119_scene~CH04_S01⟧
⟦SFX|m119_ch04_s01⟧
旁白：Vivian pauses the wedding footage at a moment when their hands remain apart. Theo lowers the volume.
旁白：Social-media edits turned a formal arrangement into a perfect love story.
薇薇安：“We never promised forever.”
西奥：“Then what did you promise?”
薇薇安：“To keep the fund alive.”
旁白：You may preserve relevant evidence while respecting what Vivian does not wish to publish.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH04_S01~protect_client,m119_done_CH04_S01⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH04_S01~seek_evidence,m119_done_CH04_S01⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH04_S01~state_boundary,m119_done_CH04_S01⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH04_S01~defer_or_reject,m119_done_CH04_S01⟧
# ·

# SCENE｜The Price of a Ring
⟦BG|BG_CH04_02|A private trust consultation · Vivian Cross, Olivia Reed⟧
⟦TIME|Day 2⟧
⟦FX|none⟧
⟦BGM|m119_ch04⟧
⟦SET|native_v2,m119_scene~CH04_S02⟧
⟦SFX|m119_ch04_s02⟧
旁白：Vivian places her ring beside a trust explanation. Olivia weighs down two separate clauses with coins.
旁白：Vivian refuses to trade employee welfare for her own freedom.
薇薇安：“It's not about the ring.”
奥利维亚：“Then we negotiate the fund first.”
薇薇安：“Finally. Someone heard me.”
⟦MG|g_m119_ch04_a⟧
旁白：You may separate her marital interests from the employees’ independent rights.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH04_S02~protect_client,m119_done_CH04_S02⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH04_S02~seek_evidence,m119_done_CH04_S02⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH04_S02~state_boundary,m119_done_CH04_S02⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH04_S02~defer_or_reject,m119_done_CH04_S02⟧
# ·

# SCENE｜The Lawyer Who Gives No Answer
⟦BG|BG_CH04_03|An independent consultation room · Theo Morgan, Vivian Cross⟧
⟦TIME|Day 2⟧
⟦FX|none⟧
⟦BGM|m119_ch04⟧
⟦SET|native_v2,m119_scene~CH04_S03⟧
⟦SFX|m119_ch04_s03⟧
旁白：Theo closes the reference book and returns the pen to Vivian.
旁白：The voting arrangement may require outside counsel; the agency cannot issue a legal ruling.
西奥：“I can tell you the risks.”
薇薇安：“I make the choice.”
西奥：“Exactly.”
⟦MG|g_m119_ch04_b⟧
旁白：Vivian chooses her own adviser and negotiation terms.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH04_S03~protect_client,m119_done_CH04_S03⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH04_S03~seek_evidence,m119_done_CH04_S03⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH04_S03~state_boundary,m119_done_CH04_S03⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH04_S03~defer_or_reject,m119_done_CH04_S03⟧
# ·

# SCENE｜Two Exits from the Reception
⟦BG|BG_CH04_04|A formal reception hall · Gabriel Hawthorne, Vivian Cross⟧
⟦TIME|Day 2⟧
⟦FX|none⟧
⟦BGM|m119_ch04⟧
⟦SET|native_v2,m119_scene~CH04_S04⟧
⟦SFX|m119_ch04_s04⟧
旁白：Gabriel and Vivian stand on opposite sides of the hall. After exchanging a look, they move toward different exits.
旁白：Public assumptions about their marriage could affect the trust.
加布里埃尔：“I won't fight the divorce.”
薇薇安：“Then stop letting them use our marriage.”
加布里埃尔：“I'll read the proposal.”
旁白：You may propose a confidential announcement schedule within the authorized scope.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH04_S04~protect_client,m119_done_CH04_S04⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH04_S04~seek_evidence,m119_done_CH04_S04⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH04_S04~state_boundary,m119_done_CH04_S04⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH04_S04~defer_or_reject,m119_done_CH04_S04⟧
# ·
# CHAPTER 5｜Pier Forty-Seven
⟦GOAL|发现旧火灾中真正的安全漏洞并确认 加布里埃尔 的责任范围|Verify the exit changes and Gabriel’s acknowledged signature.⟧
⟦DONE|flag|m119_done_CH05_S01|Complete: Pier Forty-Seven|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH05_S02|Complete: The Last Door Latch|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH05_S03|Complete: The Page You Signed|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH05_S04|Complete: Footprints in the Rain|Respond to this scene; declining or deferring is valid.⟧

# SCENE｜Pier Forty-Seven
⟦BG|BG_CH05_01|The former pier site · Theo Morgan, Lena Brooks⟧
⟦TIME|Day 3⟧
⟦FX|none⟧
⟦BGM|m119_ch05⟧
⟦SET|native_v2,m119_scene~CH05_S01⟧
⟦SFX|m119_ch05_s01⟧
旁白：Lena opens an old newspaper and a site photograph. Theo compares them with the remaining exit.
旁白：The site has been rebuilt; today’s structure is not the original scene.
莉娜：“They called it an accident.”
西奥：“The exits tell a different story.”
莉娜：“Let's prove it carefully.”
旁白：Public plans and contemporary photographs may be compared carefully.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH05_S01~protect_client,m119_done_CH05_S01⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH05_S01~seek_evidence,m119_done_CH05_S01⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH05_S01~state_boundary,m119_done_CH05_S01⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH05_S01~defer_or_reject,m119_done_CH05_S01⟧
# ·

# SCENE｜The Last Door Latch
⟦BG|BG_CH05_02|A plan-review workroom · Theo Morgan, Olivia Reed⟧
⟦TIME|Day 3⟧
⟦FX|none⟧
⟦BGM|m119_ch05⟧
⟦SET|native_v2,m119_scene~CH05_S02⟧
⟦SFX|m119_ch05_s02⟧
旁白：Olivia pins the old plans and fire approvals to a board. Theo traces the route with a transparent ruler.
旁白：The latch position differs between two versions.
奥利维亚：“That door should have opened out.”
西奥：“On paper, yes.”
奥利维亚：“Someone altered the plan.”
⟦MG|g_m119_ch05_a⟧
旁白：You may identify when the change occurred and preserve the document trail.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH05_S02~protect_client,m119_done_CH05_S02⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH05_S02~seek_evidence,m119_done_CH05_S02⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH05_S02~state_boundary,m119_done_CH05_S02⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH05_S02~defer_or_reject,m119_done_CH05_S02⟧
# ·

# SCENE｜The Page You Signed
⟦BG|BG_CH05_03|A lawyer-supervised meeting room · Gabriel Hawthorne, Theo Morgan⟧
⟦TIME|Day 3⟧
⟦FX|none⟧
⟦BGM|m119_ch05⟧
⟦SET|native_v2,m119_scene~CH05_S03⟧
⟦SFX|m119_ch05_s03⟧
旁白：Gabriel unfolds the repair-delay page he signed three years ago. His hand tightens, but he leaves it on the table.
旁白：He confirms his signature while denying knowledge of a later instruction to lock the exit.
加布里埃尔：“I signed it.”
西奥：“What did you know that day?”
加布里埃尔：“Not enough. That's still on me.”
⟦MG|g_m119_ch05_b⟧
旁白：You may insist on verification and pause personal contact without accepting an apology.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH05_S03~protect_client,m119_done_CH05_S03⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH05_S03~seek_evidence,m119_done_CH05_S03⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH05_S03~state_boundary,m119_done_CH05_S03⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH05_S03~defer_or_reject,m119_done_CH05_S03⟧
# ·

# SCENE｜Footprints in the Rain
⟦BG|BG_CH05_04|The memorial wall · Lena Brooks, Theo Morgan⟧
⟦TIME|Day 3⟧
⟦FX|none⟧
⟦BGM|m119_ch05⟧
⟦SET|native_v2,m119_scene~CH05_S04⟧
⟦SFX|m119_ch05_s04⟧
旁白：Lena places flowers beside the wall. Theo steps back to give you room.
旁白：Relatives were turned away when they asked the company for help.
莉娜：“They were people, not numbers.”
西奥：“We can remember them without using them.”
莉娜：“Thank you.”
旁白：Their wishes can be recorded without using their grief or exposing your own history against your will.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH05_S04~protect_client,m119_done_CH05_S04⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH05_S04~seek_evidence,m119_done_CH05_S04⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH05_S04~state_boundary,m119_done_CH05_S04⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH05_S04~defer_or_reject,m119_done_CH05_S04⟧
# ·
# CHAPTER 6｜A Story She Refuses to Perform
⟦GOAL|处理一个公关操控委托，识别与三年前同源的资料泄漏|Help Harper reject fabricated publicity and verify the vendor lead.⟧
⟦DONE|flag|m119_done_CH06_S01|Complete: Smiles Behind the Red Carpet|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH06_S02|Complete: The Same Watermark|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH06_S03|Complete: An Empty Microphone|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH06_S04|Complete: An Invitation to the Dead|Respond to this scene; declining or deferring is valid.⟧

# SCENE｜Smiles Behind the Red Carpet
⟦BG|BG_CH06_01|A backstage dressing room · Olivia Reed, Lena Brooks, Harper Lane⟧
⟦TIME|Day 3⟧
⟦FX|none⟧
⟦BGM|m119_ch06⟧
⟦SET|native_v2,m119_scene~CH06_S01⟧
⟦SFX|m119_ch06_s01⟧
旁白：Harper removes an earring and hands Olivia two publicity scripts. Lena watches the doorway.
旁白：The company wants a breakup announcement for a relationship that never existed.
哈珀：“They wrote my breakup before I had one.”
奥利维亚：“You can say no.”
哈珀：“I want to. Help me do it.”
⟦IF|m119_case_CASE02_delivered⟧
旁白：The anonymized removal checklist can be reused. The previous client’s photograph stays closed.
⟦/IF⟧
旁白：You may ask what Harper truly wants to leave: the contract, the campaign, or a relationship.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH06_S01~protect_client,m119_done_CH06_S01⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH06_S01~seek_evidence,m119_done_CH06_S01⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH06_S01~state_boundary,m119_done_CH06_S01⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH06_S01~defer_or_reject,m119_done_CH06_S01⟧
# ·

# SCENE｜The Same Watermark
⟦BG|BG_CH06_02|The agency media review room · Olivia Reed, Lena Brooks⟧
⟦TIME|Day 3⟧
⟦FX|none⟧
⟦BGM|m119_ch06⟧
⟦SET|native_v2,m119_scene~CH06_S02⟧
⟦SFX|m119_ch06_s02⟧
旁白：Lena projects a leaked publicity image beside an old fire attachment. Olivia checks authorized metadata.
旁白：A shared watermark does not identify the individual who leaked either file.
莉娜：“Different scandals. Same vendor.”
奥利维亚：“That isn't guilt.”
莉娜：“It's a trail.”
⟦MG|g_m119_ch06_a⟧
旁白：The vendor name Greybridge Media becomes a lead for further inquiry.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH06_S02~protect_client,m119_done_CH06_S02⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH06_S02~seek_evidence,m119_done_CH06_S02⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH06_S02~state_boundary,m119_done_CH06_S02⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH06_S02~defer_or_reject,m119_done_CH06_S02⟧
# ·

# SCENE｜An Empty Microphone
⟦BG|BG_CH06_03|A press-event stage · Harper Lane, Lena Brooks⟧
⟦TIME|Day 3⟧
⟦FX|none⟧
⟦BGM|m119_ch06⟧
⟦SET|native_v2,m119_scene~CH06_S03⟧
⟦SFX|m119_ch06_s03⟧
旁白：Harper folds the false statement and faces the cameras. Lena stands beside her.
旁白：Refusing the campaign may cost Harper an endorsement.
哈珀：“I won't fake my private life.”
莉娜：“That's enough.”
哈珀：“More than enough.”
⟦MG|g_m119_ch06_b⟧
旁白：You may help prepare a truthful alternative that does not disclose anyone else’s private life.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH06_S03~protect_client,m119_done_CH06_S03⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH06_S03~seek_evidence,m119_done_CH06_S03⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH06_S03~state_boundary,m119_done_CH06_S03⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH06_S03~defer_or_reject,m119_done_CH06_S03⟧
# ·

# SCENE｜An Invitation to the Dead
⟦BG|BG_CH06_04|The agency’s secure correspondence desk · Olivia Reed, Theo Morgan⟧
⟦TIME|Day 3⟧
⟦FX|none⟧
⟦BGM|m119_ch06⟧
⟦SET|native_v2,m119_scene~CH06_S04⟧
⟦SFX|m119_ch06_s04⟧
旁白：Olivia prints a receipt from the secure mailbox. Theo checks the authorized delivery address.
旁白：A Greybridge contact appears to know your former identity.
奥利维亚：“It's addressed to your old name.”
西奥：“Don't go alone.”
奥利维亚：“And don't delete it.”
旁白：The invitation proposes a meeting with someone who kept an old ledger.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH06_S04~protect_client,m119_done_CH06_S04⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH06_S04~seek_evidence,m119_done_CH06_S04⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH06_S04~state_boundary,m119_done_CH06_S04⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH06_S04~defer_or_reject,m119_done_CH06_S04⟧
# ·
# CHAPTER 7｜The Survivor in the Records
⟦GOAL|验证玩家过去三年的身份与死亡登记为何不一致|Confirm the transfer history without forcing public disclosure.⟧
⟦DONE|flag|m119_done_CH07_S01|Complete: The Ticket Never Used|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH07_S02|Complete: Two Different Lists|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH07_S03|Complete: The Sealed Hospital Room|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH07_S04|Complete: He Thought the Fire Took You|Respond to this scene; declining or deferring is valid.⟧

# SCENE｜The Ticket Never Used
⟦BG|BG_CH07_01|A quiet consultation room · Mara Ellis, Theo Morgan⟧
⟦TIME|Day 4⟧
⟦FX|none⟧
⟦BGM|m119_ch07⟧
⟦SET|native_v2,m119_scene~CH07_S01⟧
⟦SFX|m119_ch07_s01⟧
旁白：Mara takes an unused train ticket from her wallet. Theo asks permission before receiving it.
旁白：She helped arrange the transfer but does not know who altered the later account.
玛拉：“I remember a woman breathing.”
西奥：“You don't have to tell us everything.”
玛拉：“But I can tell you that.”
旁白：Her hospital transfer reference can be checked independently.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH07_S01~protect_client,m119_done_CH07_S01⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH07_S01~seek_evidence,m119_done_CH07_S01⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH07_S01~state_boundary,m119_done_CH07_S01⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH07_S01~defer_or_reject,m119_done_CH07_S01⟧
# ·

# SCENE｜Two Different Lists
⟦BG|BG_CH07_02|The agency lightbox · Olivia Reed, Theo Morgan⟧
⟦TIME|Day 4⟧
⟦FX|none⟧
⟦BGM|m119_ch07⟧
⟦SET|native_v2,m119_scene~CH07_S02⟧
⟦SFX|m119_ch07_s02⟧
旁白：Olivia overlays hospital records and the company’s casualty list. A replaced entry appears.
旁白：The company’s list marked a survivor as deceased, affecting later public records.
奥利维亚：“This line was replaced.”
西奥：“The hospital never declared her dead.”
奥利维亚：“Then who did?”
⟦MG|g_m119_ch07_a⟧
旁白：Certified differences can establish where the erroneous conclusion entered the record.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH07_S02~protect_client,m119_done_CH07_S02⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH07_S02~seek_evidence,m119_done_CH07_S02⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH07_S02~state_boundary,m119_done_CH07_S02⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH07_S02~defer_or_reject,m119_done_CH07_S02⟧
# ·

# SCENE｜The Sealed Hospital Room
⟦BG|BG_CH07_03|An authorized records room · Mara Ellis, Theo Morgan⟧
⟦TIME|Day 4⟧
⟦FX|none⟧
⟦BGM|m119_ch07⟧
⟦SET|native_v2,m119_scene~CH07_S03⟧
⟦SFX|m119_ch07_s03⟧
旁白：Mara opens photographs of the old ward. Theo stays beside you as you view your permitted records.
旁白：Recovery records concern private health information and do not require public disclosure.
玛拉：“You were here. You recovered.”
西奥：“You decide what becomes public.”
玛拉：“No one gets to take that from you.”
⟦MG|g_m119_ch07_b⟧
旁白：You may confirm your survival while keeping the details private.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH07_S03~protect_client,m119_done_CH07_S03⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH07_S03~seek_evidence,m119_done_CH07_S03⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH07_S03~state_boundary,m119_done_CH07_S03⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH07_S03~defer_or_reject,m119_done_CH07_S03⟧
# ·

# SCENE｜He Thought the Fire Took You
⟦BG|BG_CH07_04|A supervised private meeting · Gabriel Hawthorne, Theo Morgan⟧
⟦TIME|Day 4⟧
⟦FX|none⟧
⟦BGM|m119_ch07⟧
⟦SET|native_v2,m119_scene~CH07_S04⟧
⟦SFX|m119_ch07_s04⟧
旁白：Gabriel opens a box of old condolence cards. Theo waits by the door so you can choose the distance.
旁白：The false death notice does not excuse Gabriel’s repair-delay signature.
加布里埃尔：“They gave me a death certificate.”
西奥：“It was false.”
加布里埃尔：“That doesn't erase what I signed.”
旁白：The notice and real transfer record can be examined without an embrace or reconciliation.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH07_S04~protect_client,m119_done_CH07_S04⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH07_S04~seek_evidence,m119_done_CH07_S04⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH07_S04~state_boundary,m119_done_CH07_S04⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH07_S04~defer_or_reject,m119_done_CH07_S04⟧
# ·
# CHAPTER 8｜Her Mother’s Fund
⟦GOAL|使 薇薇安 获得独立的谈判与安全选择，并保护员工信托|Protect Vivian’s independent authority and employee welfare.⟧
⟦DONE|flag|m119_done_CH08_S01|Complete: The Box Her Mother Left|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH08_S02|Complete: Four Signatures|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH08_S03|Complete: Her First Introduction|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH08_S04|Complete: No Rivalry Between Them|Respond to this scene; declining or deferring is valid.⟧

# SCENE｜The Box Her Mother Left
⟦BG|BG_CH08_01|A private trust meeting room · Vivian Cross, Theo Morgan⟧
⟦TIME|Day 4⟧
⟦FX|none⟧
⟦BGM|m119_ch08⟧
⟦SET|native_v2,m119_scene~CH08_S01⟧
⟦SFX|m119_ch08_s01⟧
旁白：Vivian takes out her mother’s employee-trust passbook and a photograph. Theo moves unrelated papers aside.
旁白：Family directors have tied her inheritance to the marriage.
薇薇安：“My mother built that fund.”
西奥：“Then it's not a bargaining chip.”
薇薇安：“It never was.”
旁白：Her priority is the employee medical fund her mother built.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH08_S01~protect_client,m119_done_CH08_S01⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH08_S01~seek_evidence,m119_done_CH08_S01⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH08_S01~state_boundary,m119_done_CH08_S01⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH08_S01~defer_or_reject,m119_done_CH08_S01⟧
# ·

# SCENE｜Four Signatures
⟦BG|BG_CH08_02|The trust document table · Vivian Cross, Olivia Reed⟧
⟦TIME|Day 4⟧
⟦FX|none⟧
⟦BGM|m119_ch08⟧
⟦SET|native_v2,m119_scene~CH08_S02⟧
⟦SFX|m119_ch08_s02⟧
旁白：Vivian lays out four documents granting different powers. Olivia marks each authorization period.
旁白：Marital consent and corporate authority cannot be treated as the same thing.
奥利维亚：“This one expired.”
薇薇安：“They still use it.”
奥利维亚：“Then we challenge that, not your life.”
⟦MG|g_m119_ch08_a⟧
旁白：You may compare valid authority with expired proxy arrangements.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH08_S02~protect_client,m119_done_CH08_S02⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH08_S02~seek_evidence,m119_done_CH08_S02⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH08_S02~state_boundary,m119_done_CH08_S02⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH08_S02~defer_or_reject,m119_done_CH08_S02⟧
# ·

# SCENE｜Her First Introduction
⟦BG|BG_CH08_03|The beneficiaries’ meeting · Vivian Cross, Lena Brooks⟧
⟦TIME|Day 4⟧
⟦FX|none⟧
⟦BGM|m119_ch08⟧
⟦SET|native_v2,m119_scene~CH08_S03⟧
⟦SFX|m119_ch08_s03⟧
旁白：Vivian removes the name badge identifying her as a director’s wife and replaces it with her own speaking card.
旁白：Her statement could be misreported as a declaration of marital war.
薇薇安：“I won't be introduced as his wife.”
莉娜：“What should I call you?”
薇薇安：“The trustee.”
⟦MG|g_m119_ch08_b⟧
旁白：You may keep the speech focused on employees and verifiable facts.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH08_S03~protect_client,m119_done_CH08_S03⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH08_S03~seek_evidence,m119_done_CH08_S03⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH08_S03~state_boundary,m119_done_CH08_S03⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH08_S03~defer_or_reject,m119_done_CH08_S03⟧
# ·

# SCENE｜No Rivalry Between Them
⟦BG|BG_CH08_04|A private side entrance · Vivian Cross, Gabriel Hawthorne⟧
⟦TIME|Day 4⟧
⟦FX|none⟧
⟦BGM|m119_ch08⟧
⟦SET|native_v2,m119_scene~CH08_S04⟧
⟦SFX|m119_ch08_s04⟧
旁白：Gabriel holds the door without touching Vivian. She pauses to give him her final negotiation boundaries.
旁白：Their arrangement once protected both of them but now restricts them.
薇薇安：“We did what we could.”
加布里埃尔：“We should stop pretending it still works.”
薇薇安：“Then sign the release.”
旁白：Vivian proposes an exit that preserves the trust.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH08_S04~protect_client,m119_done_CH08_S04⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH08_S04~seek_evidence,m119_done_CH08_S04⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH08_S04~state_boundary,m119_done_CH08_S04⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH08_S04~defer_or_reject,m119_done_CH08_S04⟧
# ·
# CHAPTER 9｜What the Night Shift Saw
⟦GOAL|让码头事故受害者有自主发声的机会，而不是把他们当作剧情工具|Record only what witnesses freely agree to share.⟧
⟦DONE|flag|m119_done_CH09_S01|Complete: The Night Worker’s Hands|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH09_S02|Complete: The Exit That Never Opened|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH09_S03|Complete: A Call Without a Clear Threat|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH09_S04|Complete: The Name He Will Give|Respond to this scene; declining or deferring is valid.⟧

# SCENE｜The Night Worker’s Hands
⟦BG|BG_CH09_01|Jonas’s kitchen · Lena Brooks, Jonas Pike⟧
⟦TIME|Day 4⟧
⟦FX|none⟧
⟦BGM|m119_ch09⟧
⟦SET|native_v2,m119_scene~CH09_S01⟧
⟦SFX|m119_ch09_s01⟧
旁白：Jonas repairs the handle of an old thermos. Lena keeps the recorder in her bag until he agrees.
旁白：He worries that speaking could cost him his job.
乔纳斯：“They told us the door was fine.”
莉娜：“You can stop this conversation.”
乔纳斯：“I want it on record. Carefully.”
旁白：You may discuss anonymity, legal support, and a safe way to communicate.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH09_S01~protect_client,m119_done_CH09_S01⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH09_S01~seek_evidence,m119_done_CH09_S01⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH09_S01~state_boundary,m119_done_CH09_S01⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH09_S01~defer_or_reject,m119_done_CH09_S01⟧
# ·

# SCENE｜The Exit That Never Opened
⟦BG|BG_CH09_02|A warehouse-plan consultation · Jonas Pike, Theo Morgan⟧
⟦TIME|Day 4⟧
⟦FX|none⟧
⟦BGM|m119_ch09⟧
⟦SET|native_v2,m119_scene~CH09_S02⟧
⟦SFX|m119_ch09_s02⟧
旁白：Jonas marks the escape route on an old plan. Theo places a photograph beside it for comparison.
旁白：Time and trauma may affect a witness’s recollection.
乔纳斯：“We hit that door twice.”
西奥：“What could you see?”
乔纳斯：“A new latch. From the outside.”
⟦MG|g_m119_ch09_a⟧
旁白：His account can be checked against an independent photograph.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH09_S02~protect_client,m119_done_CH09_S02⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH09_S02~seek_evidence,m119_done_CH09_S02⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH09_S02~state_boundary,m119_done_CH09_S02⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH09_S02~defer_or_reject,m119_done_CH09_S02⟧
# ·

# SCENE｜A Call Without a Clear Threat
⟦BG|BG_CH09_03|The agency legal liaison desk · Theo Morgan, Olivia Reed⟧
⟦TIME|Day 4⟧
⟦FX|none⟧
⟦BGM|m119_ch09⟧
⟦SET|native_v2,m119_scene~CH09_S03⟧
⟦SFX|m119_ch09_s03⟧
旁白：Theo takes a legal liaison call while Olivia records the permission and time. Gabriel is elsewhere.
旁白：A suggestion that benefits may stop is concerning, but the caller’s responsibility is unverified.
西奥：“Please put that in writing.”
奥利维亚：“Was that a threat?”
西奥：“We don't know. We document it.”
⟦MG|g_m119_ch09_b⟧
旁白：You may preserve the communication while leaving the witness free to continue or withdraw.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH09_S03~protect_client,m119_done_CH09_S03⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH09_S03~seek_evidence,m119_done_CH09_S03⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH09_S03~state_boundary,m119_done_CH09_S03⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH09_S03~defer_or_reject,m119_done_CH09_S03⟧
# ·

# SCENE｜The Name He Will Give
⟦BG|BG_CH09_04|Outside a community hall · Jonas Pike, Lena Brooks⟧
⟦TIME|Day 4⟧
⟦FX|none⟧
⟦BGM|m119_ch09⟧
⟦SET|native_v2,m119_scene~CH09_S04⟧
⟦SFX|m119_ch09_s04⟧
旁白：Jonas tightens his coat. Lena slides her contact card toward him.
旁白：Reporters want a personal accusation; he refuses to guess.
乔纳斯：“Finance signed the work order.”
莉娜：“That's what you know?”
乔纳斯：“That's what I can swear to.”
⟦IF|m119_case_CASE05_referred⟧
旁白：The independent adviser handles further contact. The witness’s number stays out of the reporting draft.
⟦/IF⟧
旁白：He identifies a department, not an unverified individual suspect.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH09_S04~protect_client,m119_done_CH09_S04⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH09_S04~seek_evidence,m119_done_CH09_S04⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH09_S04~state_boundary,m119_done_CH09_S04⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH09_S04~defer_or_reject,m119_done_CH09_S04⟧
# ·
# CHAPTER 10｜Responsibility Without Excuses
⟦GOAL|拆分 加布里埃尔 的过失与他未实施的行为，让情感选择不替代证据|Separate admitted failures from instructions still requiring proof.⟧
⟦DONE|flag|m119_done_CH10_S01|Complete: Three Similar Signatures|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH10_S02|Complete: One Minute in the Boardroom|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH10_S03|Complete: An Apology That Is Not Enough|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH10_S04|Complete: Another Unsent Letter|Respond to this scene; declining or deferring is valid.⟧

# SCENE｜Three Similar Signatures
⟦BG|BG_CH10_01|The agency document table · Theo Morgan, Olivia Reed⟧
⟦TIME|Day 5⟧
⟦FX|none⟧
⟦BGM|m119_ch10⟧
⟦SET|native_v2,m119_scene~CH10_S01⟧
⟦SFX|m119_ch10_s01⟧
旁白：After the expert leaves, Theo lays out three authorized documents. Olivia checks the strokes with a penlight.
旁白：Similar electronic signatures may come from different accounts.
西奥：“One signature is his.”
奥利维亚：“The other could be copied.”
西奥：“Keep the categories separate.”
旁白：You may separate the signature Gabriel confirms from material needing independent authentication.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH10_S01~protect_client,m119_done_CH10_S01⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH10_S01~seek_evidence,m119_done_CH10_S01⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH10_S01~state_boundary,m119_done_CH10_S01⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH10_S01~defer_or_reject,m119_done_CH10_S01⟧
# ·

# SCENE｜One Minute in the Boardroom
⟦BG|BG_CH10_02|A meeting-records review room · Gabriel Hawthorne, Vivian Cross⟧
⟦TIME|Day 5⟧
⟦FX|none⟧
⟦BGM|m119_ch10⟧
⟦SET|native_v2,m119_scene~CH10_S02⟧
⟦SFX|m119_ch10_s02⟧
旁白：Gabriel pauses beside old minutes. Vivian points to the absent-vote column.
旁白：He requested a repair delay and later remained silent about the family’s statement.
加布里埃尔：“I knew repairs were late.”
薇薇安：“Then why stay quiet?”
加布里埃尔：“I thought I could fix it from inside.”
⟦MG|g_m119_ch10_a⟧
旁白：You may establish the sequence and examine his failure to speak up.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH10_S02~protect_client,m119_done_CH10_S02⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH10_S02~seek_evidence,m119_done_CH10_S02⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH10_S02~state_boundary,m119_done_CH10_S02⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH10_S02~defer_or_reject,m119_done_CH10_S02⟧
# ·

# SCENE｜An Apology That Is Not Enough
⟦BG|BG_CH10_03|A supervised meeting room · Gabriel Hawthorne, Theo Morgan⟧
⟦TIME|Day 5⟧
⟦FX|none⟧
⟦BGM|m119_ch10⟧
⟦SET|native_v2,m119_scene~CH10_S03⟧
⟦SFX|m119_ch10_s03⟧
旁白：Gabriel slides a written account of his responsibility toward you. Theo does not answer for him.
旁白：An apology cannot repair the fire’s consequences or the missing years.
加布里埃尔：“I was wrong.”
西奥：“What will you do now?”
加布里埃尔：“Whatever the investigation requires. Not what saves me.”
⟦MG|g_m119_ch10_b⟧
旁白：You may keep the statement, ask for action, or decline a private conversation.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH10_S03~protect_client,m119_done_CH10_S03⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH10_S03~seek_evidence,m119_done_CH10_S03⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH10_S03~state_boundary,m119_done_CH10_S03⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH10_S03~defer_or_reject,m119_done_CH10_S03⟧
# ·

# SCENE｜Another Unsent Letter
⟦BG|BG_CH10_04|The agency’s private correspondence room · Gabriel Hawthorne, Olivia Reed⟧
⟦TIME|Day 5⟧
⟦FX|none⟧
⟦BGM|m119_ch10⟧
⟦SET|native_v2,m119_scene~CH10_S04⟧
⟦SFX|m119_ch10_s04⟧
旁白：Gabriel offers a letter written three years ago. Olivia places it in a separate envelope to reduce pressure.
旁白：The letter is personal correspondence, not courtroom evidence.
加布里埃尔：“I wrote to someone I thought was gone.”
奥利维亚：“She doesn't have to open it.”
加布里埃尔：“I know.”
旁白：You may read it, keep it sealed, or refuse it permanently.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH10_S04~protect_client,m119_done_CH10_S04⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH10_S04~seek_evidence,m119_done_CH10_S04⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH10_S04~state_boundary,m119_done_CH10_S04⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH10_S04~defer_or_reject,m119_done_CH10_S04⟧
# ·
# CHAPTER 11｜A Name Returned
⟦GOAL|决定是否恢复旧身份记录，保护自己对公开叙事的控制|Choose a record-correction process and trace the procurement trail.⟧
⟦DONE|flag|m119_done_CH11_S01|Complete: Two Proofs of Identity|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH11_S02|Complete: Who Removed the Entry?|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH11_S03|Complete: The Person at the Door|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH11_S04|Complete: A Message to Your Former Name|Respond to this scene; declining or deferring is valid.⟧

# SCENE｜Two Proofs of Identity
⟦BG|BG_CH11_01|An identity-record consultation · Theo Morgan, Olivia Reed⟧
⟦TIME|Day 5⟧
⟦FX|none⟧
⟦BGM|m119_ch11⟧
⟦SET|native_v2,m119_scene~CH11_S01⟧
⟦SFX|m119_ch11_s01⟧
旁白：Theo lays out your old registration and verified current-name records. Olivia puts away unnecessary copies.
旁白：Correcting the record requires verification; publicity remains a separate choice.
西奥：“Your name belongs to you.”
奥利维亚：“The agency can stay private.”
西奥：“Records and publicity are two choices.”
旁白：You may choose a correction process and how you wish to be addressed publicly.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH11_S01~protect_client,m119_done_CH11_S01⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH11_S01~seek_evidence,m119_done_CH11_S01⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH11_S01~state_boundary,m119_done_CH11_S01⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH11_S01~defer_or_reject,m119_done_CH11_S01⟧
# ·

# SCENE｜Who Removed the Entry?
⟦BG|BG_CH11_02|The agency investigation desk · Lena Brooks, Theo Morgan⟧
⟦TIME|Day 5⟧
⟦FX|none⟧
⟦BGM|m119_ch11⟧
⟦SET|native_v2,m119_scene~CH11_S02⟧
⟦SFX|m119_ch11_s02⟧
旁白：Lena brings lawfully released procurement records. Theo checks the Greybridge payments.
旁白：A payment trail still does not establish the precise instruction given.
莉娜：“They paid for silence.”
西奥：“They paid a vendor. Prove the purpose.”
莉娜：“Fair.”
⟦MG|g_m119_ch11_a⟧
旁白：Martin’s crisis-management contract covered the months after the fire.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH11_S02~protect_client,m119_done_CH11_S02⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH11_S02~seek_evidence,m119_done_CH11_S02⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH11_S02~state_boundary,m119_done_CH11_S02⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH11_S02~defer_or_reject,m119_done_CH11_S02⟧
# ·

# SCENE｜The Person at the Door
⟦BG|BG_CH11_03|The former ambulance entrance · Mara Ellis, Olivia Reed⟧
⟦TIME|Day 5⟧
⟦FX|none⟧
⟦BGM|m119_ch11⟧
⟦SET|native_v2,m119_scene~CH11_S03⟧
⟦SFX|m119_ch11_s03⟧
旁白：Mara pauses at the entrance and points to a doorbell that has since been replaced.
旁白：She recalls an employee asking about survivor registration but did not see identification.
玛拉：“Someone came looking for the list.”
奥利维亚：“Did they show identification?”
玛拉：“No. And I won't guess.”
⟦MG|g_m119_ch11_b⟧
旁白：You may preserve her account without inventing a name or request a formal interview.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH11_S03~protect_client,m119_done_CH11_S03⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH11_S03~seek_evidence,m119_done_CH11_S03⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH11_S03~state_boundary,m119_done_CH11_S03⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH11_S03~defer_or_reject,m119_done_CH11_S03⟧
# ·

# SCENE｜A Message to Your Former Name
⟦BG|BG_CH11_04|The agency’s private call room · Theo Morgan⟧
⟦TIME|Day 5⟧
⟦FX|none⟧
⟦BGM|m119_ch11⟧
⟦SET|native_v2,m119_scene~CH11_S04⟧
⟦SFX|m119_ch11_s04⟧
# CHOICE｜Would you like to take the scheduled call?
#### A｜Accept a call about the correction notice only
旁白：The call connects. You can end it whenever you wish.
⟦OPT|A|set:m119_call_accepted⟧
#### B｜Decline the call and use the written acknowledgment
旁白：The phone stays disconnected. The written acknowledgment remains available.
⟦OPT|B|set:m119_call_declined⟧
# ·
旁白：Theo places the correction acknowledgment beside the notebook.
旁白：The caller is not physically present, and you may end or skip the call.
⟦IF|m119_call_accepted⟧
加布里埃尔：“They said you were gone.”
⟦/IF⟧
⟦IF|m119_call_accepted⟧
西奥：“You can end this call at any time.”
⟦/IF⟧
⟦IF|m119_call_accepted⟧
加布里埃尔：“I won't ask you to forgive me.”
⟦/IF⟧
⟦IF|m119_call_declined⟧
旁白：Theo leaves the written acknowledgment open for you to review. No call is required.
⟦/IF⟧
旁白：You may discuss the records without agreeing to a personal relationship.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH11_S04~protect_client,m119_done_CH11_S04⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH11_S04~seek_evidence,m119_done_CH11_S04⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH11_S04~state_boundary,m119_done_CH11_S04⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH11_S04~defer_or_reject,m119_done_CH11_S04⟧
# ·
# CHAPTER 12｜The Work of Leaving
⟦GOAL|解决客户的两宗普通委托，验证事务所理念与个人成长|Resolve practical exits and define the agency’s partnership.⟧
⟦DONE|flag|m119_done_CH12_S01|Complete: Who Will Care for the Dog?|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH12_S02|Complete: The Trademark Between Them|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH12_S03|Complete: The Partner’s Key|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH12_S04|Complete: Your Pace, Your Company|Respond to this scene; declining or deferring is valid.⟧

# SCENE｜Who Will Care for the Dog?
⟦BG|BG_CH12_01|The agency consultation room · Olivia Reed, Casey Miller⟧
⟦TIME|Day 6⟧
⟦FX|none⟧
⟦BGM|m119_ch12⟧
⟦SET|native_v2,m119_scene~CH12_S01⟧
⟦SFX|m119_ch12_s01⟧
旁白：An elderly rescue dog walks slowly between former partners. Olivia opens veterinary and care schedules.
旁白：Both people love the dog, but their care arrangements differ.
凯西：“He sleeps by my bed.”
奥利维亚：“Who can handle his medication?”
凯西：“That's the real question.”
旁白：You may work toward practical care based on the animal’s needs rather than a winner and loser.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH12_S01~protect_client,m119_done_CH12_S01⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH12_S01~seek_evidence,m119_done_CH12_S01⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH12_S01~state_boundary,m119_done_CH12_S01⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH12_S01~defer_or_reject,m119_done_CH12_S01⟧
# ·

# SCENE｜The Trademark Between Them
⟦BG|BG_CH12_02|A business-exit consultation · Theo Morgan, Olivia Reed⟧
⟦TIME|Day 6⟧
⟦FX|none⟧
⟦BGM|m119_ch12⟧
⟦SET|native_v2,m119_scene~CH12_S02⟧
⟦SFX|m119_ch12_s02⟧
旁白：The former business partners each carry packaging boxes. Theo separates the trademark filing from the stock.
旁白：A breakup does not automatically transfer intellectual-property rights.
西奥：“Breakups don't rewrite contracts.”
奥利维亚：“But we can rewrite the plan.”
西奥：“With both signatures.”
⟦MG|g_m119_ch12_a⟧
旁白：You may explore a transition license, a buyout, or an agreed wind-down.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH12_S02~protect_client,m119_done_CH12_S02⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH12_S02~seek_evidence,m119_done_CH12_S02⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH12_S02~state_boundary,m119_done_CH12_S02⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH12_S02~defer_or_reject,m119_done_CH12_S02⟧
# ·

# SCENE｜The Partner’s Key
⟦BG|BG_CH12_03|The agency worktable · Olivia Reed, Lena Brooks⟧
⟦TIME|Day 6⟧
⟦FX|none⟧
⟦BGM|m119_ch12⟧
⟦SET|native_v2,m119_scene~CH12_S03⟧
⟦SFX|m119_ch12_s03⟧
旁白：Olivia places a spare key before you. Lena opens the partnership terms.
旁白：Olivia wants real authority and refuses unlimited overtime.
奥利维亚：“I want a vote. Not a nicer title.”
莉娜：“Finally, someone said it.”
奥利维亚：“We can build this right.”
⟦MG|g_m119_ch12_b⟧
旁白：You may offer a genuine decision-making role rather than another verbal promise.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH12_S03~protect_client,m119_done_CH12_S03⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH12_S03~seek_evidence,m119_done_CH12_S03⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH12_S03~state_boundary,m119_done_CH12_S03⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH12_S03~defer_or_reject,m119_done_CH12_S03⟧
# ·

# SCENE｜Your Pace, Your Company
⟦BG|BG_CH12_04|A quiet restaurant · Theo Morgan⟧
⟦TIME|Day 6⟧
⟦FX|none⟧
⟦BGM|m119_ch12⟧
⟦SET|native_v2,m119_scene~CH12_S04⟧
⟦SFX|m119_ch12_s04⟧
旁白：Dessert rests at the edge of the table. The opposite chair has not been pulled closer.
旁白：Tonight is yours to decide. Someone waiting does not oblige you to accept.
旁白：You may prefer privacy, friendship, or a relationship that meets the necessary boundaries.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH12_S04~protect_client,m119_done_CH12_S04⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH12_S04~seek_evidence,m119_done_CH12_S04⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH12_S04~state_boundary,m119_done_CH12_S04⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH12_S04~defer_or_reject,m119_done_CH12_S04⟧
# ·
# CHAPTER 13｜Terms No One Can Accept for Her
⟦GOAL|完成双方均知情的谈判方案，拒绝以封口换取胜利|Review silence clauses and preserve independent choices.⟧
⟦DONE|flag|m119_done_CH13_S01|Complete: Terms Across the Table|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH13_S02|Complete: The Line Through the Clause|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH13_S03|Complete: The Withheld Medical Fund|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH13_S04|Complete: Please Do Not Protect Me Tonight|Respond to this scene; declining or deferring is valid.⟧

# SCENE｜Terms Across the Table
⟦BG|BG_CH13_01|An independent negotiation room · Vivian Cross, Gabriel Hawthorne, Theo Morgan⟧
⟦TIME|Day 6⟧
⟦FX|none⟧
⟦BGM|m119_ch13⟧
⟦SET|native_v2,m119_scene~CH13_S01⟧
⟦SFX|m119_ch13_s01⟧
旁白：Vivian places the trust terms in the middle. Gabriel moves his own signature page toward her.
旁白：The company’s proposed settlement includes a sweeping silence provision about the accident.
薇薇安：“I want the divorce. Not silence.”
加布里埃尔：“Strike that clause.”
西奥：“Then we can negotiate.”
旁白：You may refuse to accept such a clause on the client’s behalf.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH13_S01~protect_client,m119_done_CH13_S01⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH13_S01~seek_evidence,m119_done_CH13_S01⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH13_S01~state_boundary,m119_done_CH13_S01⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH13_S01~defer_or_reject,m119_done_CH13_S01⟧
# ·

# SCENE｜The Line Through the Clause
⟦BG|BG_CH13_02|The legal review table · Theo Morgan, Olivia Reed⟧
⟦TIME|Day 6⟧
⟦FX|none⟧
⟦BGM|m119_ch13⟧
⟦SET|native_v2,m119_scene~CH13_S02⟧
⟦SFX|m119_ch13_s02⟧
旁白：Theo marks the broad non-disparagement clause. Olivia explains the risk to Vivian.
旁白：Removing one clause does not resolve every issue; independent counsel must finalize the language.
西奥：“Privacy is fine. Forced silence isn't.”
奥利维亚：“Can she still tell the truth?”
西奥：“That's the test.”
⟦MG|g_m119_ch13_a⟧
旁白：You may distinguish legitimate privacy protections from barriers to truthful reporting.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH13_S02~protect_client,m119_done_CH13_S02⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH13_S02~seek_evidence,m119_done_CH13_S02⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH13_S02~state_boundary,m119_done_CH13_S02⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH13_S02~defer_or_reject,m119_done_CH13_S02⟧
# ·

# SCENE｜The Withheld Medical Fund
⟦BG|BG_CH13_03|Outside the meeting room · Vivian Cross, Lena Brooks⟧
⟦TIME|Day 6⟧
⟦FX|none⟧
⟦BGM|m119_ch13⟧
⟦SET|native_v2,m119_scene~CH13_S03⟧
⟦SFX|m119_ch13_s03⟧
旁白：Vivian waits at the door. Lena gives her notice of the beneficiaries’ meeting.
旁白：The company delays funding while pressuring Vivian to change her position.
薇薇安：“They can delay the payment.”
莉娜：“Can the board do that?”
薇薇安：“Let the independent lawyers ask.”
⟦MG|g_m119_ch13_b⟧
旁白：You may consider independent civil action, public oversight, or continued negotiation.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH13_S03~protect_client,m119_done_CH13_S03⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH13_S03~seek_evidence,m119_done_CH13_S03⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH13_S03~state_boundary,m119_done_CH13_S03⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH13_S03~defer_or_reject,m119_done_CH13_S03⟧
# ·

# SCENE｜Please Do Not Protect Me Tonight
⟦BG|BG_CH13_04|A private meeting room · Gabriel Hawthorne, Theo Morgan⟧
⟦TIME|Day 6⟧
⟦FX|none⟧
⟦BGM|m119_ch13⟧
⟦SET|native_v2,m119_scene~CH13_S04⟧
⟦SFX|m119_ch13_s04⟧
旁白：Gabriel puts the old engagement-ring box in his own pocket. Theo steps toward the window to leave space.
旁白：Making decisions for you repeats an old failure, even when described as help.
加布里埃尔：“I thought protecting you meant deciding for you.”
西奥：“That wasn't protection.”
加布里埃尔：“I know that now.”
旁白：You decide whether his promise to respect boundaries permits further cooperation.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH13_S04~protect_client,m119_done_CH13_S04⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH13_S04~seek_evidence,m119_done_CH13_S04⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH13_S04~state_boundary,m119_done_CH13_S04⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH13_S04~defer_or_reject,m119_done_CH13_S04⟧
# ·
# CHAPTER 14｜What We May Submit
⟦GOAL|把证据交给独立机构，确保当事人不被替代发声|Verify sources, authority, and the limits of disclosure.⟧
⟦DONE|flag|m119_done_CH14_S01|Complete: The Originals Leave Your Hands|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH14_S02|Complete: One Form, Two Destinations|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH14_S03|Complete: A Surname Is Not a Weapon|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH14_S04|Complete: The Last Witness|Respond to this scene; declining or deferring is valid.⟧

# SCENE｜The Originals Leave Your Hands
⟦BG|BG_CH14_01|The evidence handover table · Theo Morgan, Olivia Reed⟧
⟦TIME|Day 7⟧
⟦FX|none⟧
⟦BGM|m119_ch14⟧
⟦SET|native_v2,m119_scene~CH14_S01⟧
⟦SFX|m119_ch14_s01⟧
旁白：Theo seals certified copies into evidence packets. Olivia checks the seal numbers.
旁白：Truth does not justify submitting private material without permission.
西奥：“We only submit what we can prove.”
奥利维亚：“And what people agreed to share.”
西奥：“Both matter.”
旁白：You may verify both the submission list and the authority to share it.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH14_S01~protect_client,m119_done_CH14_S01⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH14_S01~seek_evidence,m119_done_CH14_S01⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH14_S01~state_boundary,m119_done_CH14_S01⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH14_S01~defer_or_reject,m119_done_CH14_S01⟧
# ·

# SCENE｜One Form, Two Destinations
⟦BG|BG_CH14_02|A private disclosure review room · Vivian Cross, Lena Brooks⟧
⟦TIME|Day 7⟧
⟦FX|none⟧
⟦BGM|m119_ch14⟧
⟦SET|native_v2,m119_scene~CH14_S02⟧
⟦SFX|m119_ch14_s02⟧
旁白：Vivian places a public account beside a sealed private version. Lena does not photograph them.
旁白：The extent of disclosure changes the risks to individuals and employees.
薇薇安：“I want the truth out.”
莉娜：“Not every detail?”
薇薇安：“Not every wound belongs to the public.”
⟦MG|g_m119_ch14_a⟧
旁白：You may separate public facts from confidential health information.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH14_S02~protect_client,m119_done_CH14_S02⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH14_S02~seek_evidence,m119_done_CH14_S02⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH14_S02~state_boundary,m119_done_CH14_S02⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH14_S02~defer_or_reject,m119_done_CH14_S02⟧
# ·

# SCENE｜A Surname Is Not a Weapon
⟦BG|BG_CH14_03|The independent counsel’s room · Gabriel Hawthorne, Theo Morgan⟧
⟦TIME|Day 7⟧
⟦FX|none⟧
⟦BGM|m119_ch14⟧
⟦SET|native_v2,m119_scene~CH14_S03⟧
⟦SFX|m119_ch14_s03⟧
旁白：Gabriel removes his badge and offers Theo a document.
旁白：Willingness to testify must still be backed by verification.
加布里埃尔：“Use my statement.”
西奥：“Even the part that hurts you?”
加布里埃尔：“Especially that part.”
⟦MG|g_m119_ch14_b⟧
旁白：You may submit the adverse statement and relevant originals through the authorized process.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH14_S03~protect_client,m119_done_CH14_S03⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH14_S03~seek_evidence,m119_done_CH14_S03⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH14_S03~state_boundary,m119_done_CH14_S03⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH14_S03~defer_or_reject,m119_done_CH14_S03⟧
# ·

# SCENE｜The Last Witness
⟦BG|BG_CH14_04|Outside the hearing rooms · Jonas Pike, Mara Ellis⟧
⟦TIME|Day 7⟧
⟦FX|none⟧
⟦BGM|m119_ch14⟧
⟦SET|native_v2,m119_scene~CH14_S04⟧
⟦SFX|m119_ch14_s04⟧
旁白：Jonas and Mara exchange a nod, then walk toward separate entrances.
旁白：Either may decide not to testify publicly; other evidence can still support the case.
乔纳斯：“I'm ready to say what I saw.”
玛拉：“I'll only speak to the records I kept.”
乔纳斯：“That's enough.”
旁白：Their individual choices are recorded before the hearing.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH14_S04~protect_client,m119_done_CH14_S04⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH14_S04~seek_evidence,m119_done_CH14_S04⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH14_S04~state_boundary,m119_done_CH14_S04⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH14_S04~defer_or_reject,m119_done_CH14_S04⟧
# ·
# CHAPTER 15｜The Cost of Accountability
⟦GOAL|完成独立听证并使婚姻、员工信托和事故问责各自得到结论|Present the supported evidence without promising a final judgment.⟧
⟦DONE|flag|m119_done_CH15_S01|Complete: A Seat for Everyone|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH15_S02|Complete: No Perfect Testimony|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH15_S03|Complete: He Names His Own Failure|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH15_S04|Complete: The Price of Leaving|Respond to this scene; declining or deferring is valid.⟧

# SCENE｜A Seat for Everyone
⟦BG|BG_CH15_01|The hearing chamber · Vivian Cross, Gabriel Hawthorne, Theo Morgan⟧
⟦TIME|Day 7⟧
⟦FX|none⟧
⟦BGM|m119_ch15⟧
⟦SET|native_v2,m119_scene~CH15_S01⟧
⟦SFX|m119_ch15_s01⟧
旁白：Vivian gives the front row to employee representatives. Gabriel reviews his statement behind them. Theo checks everyone is ready.
旁白：The participants seek different outcomes: freedom, welfare, remediation, and accountability.
薇薇安：“The workers go first.”
加布里埃尔：“I'll answer for my part.”
西奥：“Then let's do it properly.”
旁白：You may state your own aims without making a witness’s decision for them.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH15_S01~protect_client,m119_done_CH15_S01⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH15_S01~seek_evidence,m119_done_CH15_S01⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH15_S01~state_boundary,m119_done_CH15_S01⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH15_S01~defer_or_reject,m119_done_CH15_S01⟧
# ·

# SCENE｜No Perfect Testimony
⟦BG|BG_CH15_02|The hearing evidence display · Theo Morgan, Lena Brooks⟧
⟦TIME|Day 7⟧
⟦FX|none⟧
⟦BGM|m119_ch15⟧
⟦SET|native_v2,m119_scene~CH15_S02⟧
⟦SFX|m119_ch15_s02⟧
旁白：Theo projects a timeline while Lena checks every quotation against its source.
旁白：One missing page does not erase all valid records.
西奥：“We know what the records show.”
莉娜：“Say what they don't.”
西奥：“That's how this holds.”
⟦MG|g_m119_ch15_a⟧
旁白：You may separate direct evidence, supporting material, and what remains unknown.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH15_S02~protect_client,m119_done_CH15_S02⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH15_S02~seek_evidence,m119_done_CH15_S02⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH15_S02~state_boundary,m119_done_CH15_S02⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH15_S02~defer_or_reject,m119_done_CH15_S02⟧
# ·

# SCENE｜He Names His Own Failure
⟦BG|BG_CH15_03|The hearing statement table · Gabriel Hawthorne, Vivian Cross⟧
⟦TIME|Day 7⟧
⟦FX|none⟧
⟦BGM|m119_ch15⟧
⟦SET|native_v2,m119_scene~CH15_S03⟧
⟦SFX|m119_ch15_s03⟧
旁白：Gabriel signs his formal statement. Vivian replaces the pen cap without applauding.
旁白：Admitting fault neither wins you back nor settles compensation.
加布里埃尔：“I failed to speak when it mattered.”
薇薇安：“Then speak now.”
加布里埃尔：“I will.”
⟦MG|g_m119_ch15_b⟧
旁白：You may evaluate his actions rather than accept an emotional performance.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH15_S03~protect_client,m119_done_CH15_S03⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH15_S03~seek_evidence,m119_done_CH15_S03⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH15_S03~state_boundary,m119_done_CH15_S03⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH15_S03~defer_or_reject,m119_done_CH15_S03⟧
# ·

# SCENE｜The Price of Leaving
⟦BG|BG_CH15_04|The agency’s closing meeting · Vivian Cross, Olivia Reed⟧
⟦TIME|Day 7⟧
⟦FX|none⟧
⟦BGM|m119_ch15⟧
⟦SET|native_v2,m119_scene~CH15_S04⟧
⟦SFX|m119_ch15_s04⟧
旁白：Vivian places her ring in a small box and gives Olivia notice of interim trust protection.
旁白：Divorce and regulatory processes still need formal completion.
薇薇安：“The marriage can end.”
奥利维亚：“And the fund?”
薇薇安：“It finally has a chance.”
旁白：The agency’s present work may close without deciding your romantic future.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH15_S04~protect_client,m119_done_CH15_S04⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH15_S04~seek_evidence,m119_done_CH15_S04⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH15_S04~state_boundary,m119_done_CH15_S04⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH15_S04~defer_or_reject,m119_done_CH15_S04⟧
# ·
# CHAPTER 16｜Another Ordinary Morning
⟦GOAL|结算事务所未来、个人身份与恋爱意愿，留下可以持续经营的世界|Choose a sustainable agency and a freely chosen personal future.⟧
⟦DONE|flag|m119_done_CH16_S01|Complete: Open at Nine|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH16_S02|Complete: Three Plans, Different Costs|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH16_S03|Complete: The Chair Beside You|Respond to this scene; declining or deferring is valid.⟧
⟦DONE|flag|m119_done_CH16_S04|Complete: The Next Client|Respond to this scene; declining or deferring is valid.⟧

# SCENE｜Open at Nine
⟦BG|BG_CH16_01|The agency, next morning · Olivia Reed, Lena Brooks⟧
⟦TIME|Day 7⟧
⟦FX|none⟧
⟦BGM|m119_ch16⟧
⟦SET|native_v2,m119_scene~CH16_S01⟧
⟦SFX|m119_ch16_s01⟧
旁白：Olivia hangs the new opening sign. Lena files the news clipping rather than displaying it as a trophy.
旁白：A major case does not replace everyday operations.
奥利维亚：“We still have clients at nine.”
莉娜：“That's a good kind of normal.”
奥利维亚：“Let's keep it.”
⟦IF|m119_case_CASE07_delivered⟧
旁白：A private follow-up on the care plan reports a stable medication and appointment schedule.
⟦/IF⟧
旁白：You may expand, remain a small practice, or reserve pro bono capacity.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH16_S01~protect_client,m119_done_CH16_S01⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH16_S01~seek_evidence,m119_done_CH16_S01⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH16_S01~state_boundary,m119_done_CH16_S01⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH16_S01~defer_or_reject,m119_done_CH16_S01⟧
# ·

# SCENE｜Three Plans, Different Costs
⟦BG|BG_CH16_02|The agency planning table · Olivia Reed, Theo Morgan⟧
⟦TIME|Day 7⟧
⟦FX|none⟧
⟦BGM|m119_ch16⟧
⟦SET|native_v2,m119_scene~CH16_S02⟧
⟦SFX|m119_ch16_s02⟧
旁白：Olivia brings three plans: pro bono work, boutique consulting, and partnership expansion. Theo marks their costs.
旁白：Unlimited free services cannot coexist with unlimited resources.
奥利维亚：“We can grow, or we can stay personal.”
西奥：“Both have a cost.”
奥利维亚：“It's your call.”
⟦MG|g_m119_ch16_a⟧
⟦IF|budget_feasible⟧
旁白：The team budget preserves operations, legal work, and community places. The partnership terms remain a separate document.
⟦/IF⟧
旁白：You may set a feasible budget and a genuine management arrangement.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH16_S02~protect_client,m119_done_CH16_S02⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH16_S02~seek_evidence,m119_done_CH16_S02⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH16_S02~state_boundary,m119_done_CH16_S02⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH16_S02~defer_or_reject,m119_done_CH16_S02⟧
# ·

# SCENE｜The Chair Beside You
⟦BG|BG_CH16_03|A Brooklyn restaurant · Alone⟧
⟦TIME|Day 7⟧
⟦FX|none⟧
⟦BGM|m119_ch16⟧
⟦SET|native_v2,m119_scene~CH16_S03⟧
⟦SFX|m119_ch16_s03⟧
旁白：The chair facing you is empty. Sunlight falls across the pavement outside.
旁白：Two place settings stand apart. You can invite someone to sit or keep the space for yourself.
⟦IF|m119_cast_CH16_S03_Gabriel_yes⟧
加布里埃尔：“I want another chance. Only if you do.”
⟦/IF⟧
⟦IF|m119_cast_CH16_S03_Theo_yes⟧
西奥：“I'd like to see where this goes. No pressure.”
⟦/IF⟧
⟦IF|m119_solo_CH16_S03⟧
旁白：You recall Olivia’s earlier message: “You don't need anyone to make this a happy ending.”
⟦/IF⟧
⟦MG|g_m119_ch16_b⟧
旁白：The chair can stay empty. An invitation depends on what both people want now.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH16_S03~protect_client,m119_done_CH16_S03⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH16_S03~seek_evidence,m119_done_CH16_S03⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH16_S03~state_boundary,m119_done_CH16_S03⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH16_S03~defer_or_reject,m119_done_CH16_S03⟧
# ·

# SCENE｜The Next Client
⟦BG|BG_CH16_04|The agency doorway · Olivia Reed⟧
⟦TIME|Day 7⟧
⟦FX|none⟧
⟦BGM|m119_ch16⟧
⟦SET|native_v2,m119_scene~CH16_S04⟧
⟦SFX|m119_ch16_s04⟧
旁白：A quiet knock reaches the office. Olivia looks up from the appointment book.
旁白：The appointment book still has an open slot. The next client’s story is theirs to tell.
奥利维亚：“We've got another call.”
⟦IF|m119_cast_CH16_S04_Vivian_yes⟧
薇薇安：“This time, I'm here to say thank you.”
⟦/IF⟧
奥利维亚：“Ready when you are.”
旁白：The appointment book remains open. You may finish the available cases or refer them to someone else.
⟦FREE|Ask about the people and records here, set a boundary, decline, or propose another approach.⟧
# CHOICE｜What would you like to do next?
#### A｜Protect the client’s autonomy and privacy
旁白：The client’s records remain separate. Further action still requires their permission.
⟦OPT|A|set:m119_pick~CH16_S04~protect_client,m119_done_CH16_S04⟧
#### B｜Verify sources, dates, and records
旁白：The item is logged for verification, with its source and date preserved.
⟦OPT|B|set:m119_pick~CH16_S04~seek_evidence,m119_done_CH16_S04⟧
#### C｜State my boundaries and permissions
旁白：Your boundary is recorded. It grants neither intimacy nor disclosure permission.
⟦OPT|C|set:m119_pick~CH16_S04~state_boundary,m119_done_CH16_S04⟧
#### D｜Defer, decline, or propose an alternative
旁白：The proposal is deferred. A lawful alternative remains open.
⟦OPT|D|set:m119_pick~CH16_S04~defer_or_reject,m119_done_CH16_S04⟧
# ·
