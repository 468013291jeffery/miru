const assert=require('node:assert/strict');
module.exports=function(dsl,D,L){
 const names=Object.fromEntries(D.characters.map(c=>[c.name,L.names[c.id]]));
 const chinese=s=>Object.entries(names).reduce((v,[en,zh])=>v.split(en).join(zh),s);
 const zh=dsl.replace(/^([A-Z]+)：“(.+)”$/gm,(_,actor,text)=>{assert(L.voicesZh[text],'Missing Chinese dialogue: '+text);return actor+'：“'+L.voicesZh[text]+'”';}).split('\n').map(chinese).join('\n');
 const extras={
 '你把各人的位置与意愿逐一问清，给每个人留下决定是否参加的余地。':'You ask everyone about their wishes and make room for each person to decide whether to join.',
 '你前往图书馆，核对三枚自愿契约符文；三位同伴分别确认献魔出于本人意愿。':'In the library, you verify three voluntary contract runes. Each companion separately confirms that he freely offers his magic.',
 '你和达里安进入龙室，核对龙焰符文，并先为宫殿和灵魂设下结界。':'You and Darian enter the dragon chamber, verify the dragonfire rune, and first raise barriers to protect the palace and its souls.',
 '你走进图书馆，对照古代原稿找到王冠真名；学士逐字复核抄本。':'In the library, you find the crown’s true name in the ancient manuscript. The scholar verifies every word of the copy.',
 '你前往密探室，与瓦莱里安核对情报和假王冠，确认封印所需的真名。':'In the intelligence chamber, you and Valerian check the reports and the decoy crown, confirming the true name needed for the seal.',
 '卢西恩失声哭泣，卡西安组织疏散，达里安怒意点燃大厅。凯尔的灵魂仍困在王冠内。':'Lucien breaks down, Cassian organizes the evacuation, and Darian’s rage ignites the hall. Kael’s soul remains trapped inside the crown.',
 '三位同伴分别重申自愿献魔；符文逐一亮起，王冠上的束缚开始断裂。':'Each of the three companions renews his freely given offer of magic. The runes light one by one, and the crown’s bonds begin to break.',
 '你维持保护结界，达里安以龙火熔开王冠。帝国将失去部分魔法储量，困住的灵魂有了出口。':'You hold the protective barrier while Darian melts the crown with dragonfire. The empire loses part of its magical reserve, but the trapped souls now have a way out.',
 '迷宫中的三道符文按月、龙、心依次亮起。你以古代原稿和真名改写吞噬生命的咒文。':'The labyrinth’s three runes light in order: moon, dragon, heart. Using the ancient manuscript and the true name, you rewrite the life-devouring curse.',
 '伊萨克向假王冠伸手，暴露真名。瓦莱里安按核验过的情报发动反封印。':'Isaac reaches for the decoy crown and exposes his true name. Acting on verified intelligence, Valerian turns the seal against him.',
 '海底王冠的线索与塞拉菲娜的画像相互印证，庆典的镜面映出另一顶王冠。':'The clues to the sunken crown match Seraphine’s portrait. In a mirror at the celebration, another crown appears.',
 '庆典的灯光在水面铺开。此刻没有新的线索，你可以安心享受恢复平静的宫廷。':'The celebration’s lights spread across the water. There are no new clues for now; you can enjoy a court at peace.'};
 let node=null,option=null,chapter=0;
 const en=dsl.split('\n').map(line=>{
  if(line==='# 女帝的绝色后宫')return '# HER MAJESTY’S HAREM';
  let m;if((m=line.match(/^# CHAPTER (\d+)｜/))){chapter=+m[1];node=null;return '# CHAPTER '+chapter+'｜'+D.chapters[chapter-1].en;}
  if((m=line.match(/^# SCENE｜(.+)/))){node=D.nodes.find(n=>n.chapter===chapter&&n.title===m[1]);assert(node);option=null;return '# SCENE｜'+L.nodes[node.id].title;}
  if(line.startsWith('⟦CHAR|')){const a=line.slice(1,-1).split('|'),c=L.characters[a[1]];if(c){a[5]=c.roleEn;a[6]=c.appearanceEn;}else if(a[1]==='你'){a[5]='Empress Aurelia';a[6]='Customize your name. Affection, rank, and romance always remain your choice.';}else if(a[1]==='SERAPHINE'){a[5]='Projection of the First Empress';a[6]='Not a romantic companion.';}else if(a[1]==='ISAAC'){a[5]='The priest who corrupted the crown';a[6]='Antagonist; not a romantic companion.';}return '⟦'+a.join('|')+'⟧';}
  if(line.startsWith('⟦TIME|'))return '⟦TIME|'+(chapter===9?'Three days after the resurrection':chapter===10?'One month later':'Day '+chapter)+'⟧';
  if(line.startsWith('# CHOICE｜'))return '# CHOICE｜'+L.nodes[node.id].title+': what would you like to do?';
  if((m=line.match(/^#### ([A-E])｜(.+)/))){option=node.options.find(o=>o.text===m[2]);assert(option);return '#### '+m[1]+'｜'+L.nodes[node.id].options[node.options.indexOf(option)];}
  if(line.startsWith('你：“'))return '你：“'+L.nodes[node.id].options[node.options.indexOf(option)]+'”';
  if(line.startsWith('旁白：')){const text=line.slice(3);let t=extras[text];if(!t&&text===node.narration)t=L.nodes[node.id].narration;if(!t&&text.startsWith('你把「')){const actor=D.characters.find(c=>text.includes(c.name));assert(actor);t='You make your choice clear: “'+L.nodes[node.id].options[node.options.indexOf(option)]+'.” '+actor.name+' pauses and gives you his full attention.';}assert(t,'Untranslated English narration: '+text);return '旁白：'+t;}
  return line;
 }).join('\n');
 return {zh,en};
};
