const fs=require('fs'),path=require('path'),dir=path.resolve(__dirname,'../content/official/m119-breakup-v2'),D=require(dir+'/data.json');
// Each exercise uses authored evidence, not character affection or a timer.
const rows=[
['single','Classify the proposed source of funds.','Authorized escrow transfer|Unknown anonymous cryptocurrency|Cash tied to a threat',[0]],
['sequence','Order the verified dates, earliest first.','Pier fire: three years ago|Marriage registration: eighteen months ago|Today’s request',[0,1,2]],
['privacy','Assign each record to the people authorized to see it.','Client’s marriage file|Public reporting|Your health records',['client','public','player']],
['multi','Select information that must be redacted before sharing.','Home address|Public stage|Person who authorized this use',[0]],
['single','Match the incident number to the public index: P47-0604.','P47-0604|P47-0640|R47-0604',[0]],
['single','Copy A: receipt 218. Copy B: receipt 281. Other fields match. Which field differs?','Receipt number|Paper color|Binding',[0]],
['single','Which item belongs to the independent employee trust?','Ring|Beneficiary welfare|Wedding photograph',[1]],
['single','A proxy expired yesterday. Which field determines whether it is usable today?','Signature date|Expiry date|Recipient’s nickname',[1]],
['single','Choose the usable evacuation route on the old plan.','Outward-opening fire exit|Locked storage door|Return to freight elevator',[0]],
['multi','Select the fact already admitted by Gabriel. The other claims remain unverified.','Gabriel signed the repair delay|Anonymous order to lock the door|Online rumor',[0]],
['single','Which proposed publicity must not be published as a verified update?','Accurate work update|Invented breakup announcement|Public performance date',[1]],
['single','Which attachment marker can connect a legitimately obtained file to its supplier?','Greybridge supplier watermark|Random page number|Weather in the photograph',[0]],
['single','The two records share a transfer ID but list different patient status. Identify the substantive discrepancy.','Matching transfer ID, conflicting status|Different font|Paper thickness',[0]],
['sequence','Reconstruct the transfer stages in chronological order.','On-site treatment|Identity pending|Hospital transfer|Later rehabilitation',[0,1,2,3]],
['single','The trust document delegates authority to its trustee. Who may represent it?','Named trustee|A spouse automatically|PR adviser',[0]],
['single','Compare the grant history. Which entry requires investigation?','Continuing grants|Interruption without authorization|Routine account explanation',[1]],
['single','Align the two door photographs using the hinge and handle. What changed?','New latch outside the door|Wall color|Lighting',[0]],
['multi','Choose only material cleared for publication.','Description with publication consent|Phone number without consent|Unverified name',[0]],
['multi','Choose the attribution supported by the record. Shared logins do not identify a person.','Signature confirmed by its signer|Shared account login|Unverified attachment',[0]],
['multi','Select the admitted failures. The locking order still needs separate proof.','Delayed repairs|Order to seal the exit|Silence after the incident',[0,2]],
['single','Which package supports a lawful request to correct an identity record?','Your ID and certified hospital record|Online screenshot|Retold interview',[0]],
['sequence','Order the procurement records by their documented stages.','Procurement contract|Payment request|Completed transfer',[0,1,2]],
['single','Choose the care arrangement that meets the elderly dog’s daily needs.','Daily medication and stable home|Verbal promise only|Who feels most hurt',[0]],
['budget','Allocate 100 units while preserving at least 45 for wages.','Wages|Legal work|Community places|Reserve',[45,25,15,15]],
['single','Which clause improperly obstructs independent accountability?','Protecting a home address|Preventing testimony to regulators|Confidential transaction price',[1]],
['sequence','Arrange a lawful transition that preserves employee benefits.','Establish transition escrow|Notify beneficiaries|Continue interim grants|Audit the transition',[0,1,2,3]],
['sequence','Arrange the certified copy’s chain of custody.','Source record|Authorization|Seal number|Handover record',[0,1,2,3]],
['privacy','Assign public facts and private medical information separately.','Procurement date|Personal medical details|Testimony authorized for release',['public','sealed','public']],
['multi','Choose materials that directly support the submission. A social post remains a lead.','Certified purchase order|Anonymous social post|Original witness record',[0,2]],
['privacy','Route each document to a separate review; no signature binds the other files.','Divorce intention|Change of trustee|Media statement',['divorce','trust','media']],
['budget','Allocate 100 units while keeping at least 55 for operating costs.','Operations|Legal work|Community places|Reserve',[55,20,15,10]],
['single','Choose a communication method that respects both people’s present wishes.','State expectations and distance clearly|Assume reconciliation|Treat silence as agreement',[0]]
];
const ui={privacy:{zh:['客户本人及独立代理','公开范围','玩家本人授权范围','封存，不公开','离婚独立审查','信托独立审查','媒体独立审查'],en:['Client and independent representative','Public scope','Player-authorized scope','Sealed, not public','Separate divorce review','Separate trust review','Separate media review'],keys:['client','public','player','sealed','divorce','trust','media']}};
const items=D.games.items.map((g,i)=>({id:'g_m119_'+g.id.toLowerCase(),sourceId:g.id,zh:g.zh_name,en:g.en_name,tpl:'m119',kw:[],mode:rows[i][0],rule:{zh:g.rule_zh,en:rows[i][1]},options:{zh:g.options.map(s=>s.replace(/Gabriel/g,'加布里埃尔').replace(/Greybridge/g,'格雷布里奇')),en:rows[i][2].split('|')},answer:rows[i][3]}));
// Correct the source’s underspecified wording to match its actual three records.
items[2].rule.zh='将三类资料分给对应授权范围，不跨客户共享';
items[5].rule.zh='副本甲的签收号为218，副本乙为281，其余相同。找出差异字段';
items[12].rule.zh='两份记录的转运号相同，但患者状态不同。找出实质矛盾';
items[22].options.zh=['每日给药并有稳定住址','只有口头承诺','只按谁更伤心'];
items[23].options.zh=['工资','法务','公益名额','备用金'];items[30].options.zh=['运营','法务','公益名额','备用金'];
items[29].rule.zh='将三份文件分别交给对应的独立审查，不用一份签名代替全部授权';
fs.writeFileSync(dir+'/games.json',JSON.stringify({items,ui},null,2)+'\n');console.log('32 bilingual evidence, privacy, sequence and budget exercises compiled.');
