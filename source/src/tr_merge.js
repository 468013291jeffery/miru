/* ================= CONTENT TRANSLATIONS (ja · ko · es) =================
   Each language pack mirrors the English content by id and position. */
const TX={};
const TAG_L={zh:TAG_ZH};
function mergeLang(lang){const P=TX[lang];if(!P)return;
 const F=["role","looks","vibe","tells","twist","likes","secret","pitch","solo"];
 Object.entries(P.c||{}).forEach(([id,a])=>{const c=C[id];if(!c)return;F.forEach((f,i)=>{if(a[i]==null||!c[f])return;c[f][lang]=a[i]})});
 Object.entries(P.w||{}).forEach(([id,a])=>{const w=W.find(x=>x.id===id);if(!w)return;
  ["title","hook","premise","you","warn"].forEach((f,i)=>{if(a[i]!=null)w[f][lang]=a[i]});
  (a[5]||[]).forEach((r,i)=>{if(w.rel[i])w.rel[i][2][lang]=r});
  if(a[6])w.status.time[lang]=a[6];if(a[7])w.status.place[lang]=a[7];
  Object.entries(a[8]||{}).forEach(([oid,[tt,texts]])=>{const op=w.openings.find(o=>o.id===oid);if(!op)return;op.t[lang]=tt;op.beats[lang]=op.beats.en.map((b,i)=>[b[0],b[1],texts[i]||b[2]])});
  if(a[9]&&w.quest){w.quest.qtitle[lang]=a[9][0];a[9][1].forEach((g,i)=>{if(w.quest.goals[i])w.quest.goals[i][lang]=g});w.quest.hidden[lang]=a[9][2]}});
 Object.entries(P.sh||{}).forEach(([id,[texts,cliff]])=>{const s=SHORTS[id];if(!s)return;s[lang]=s.en.map((b,i)=>[b[0],texts[i]||b[1]]);s.cliff[lang]=cliff});
 Object.entries(P.bank||{}).forEach(([a,v])=>{if(BANK[a])BANK[a][lang]=v});
 (P.gifts||[]).forEach((x,i)=>{if(GIFTS[i])GIFTS[i].n[lang]=x});
 (P.events||[]).forEach(([a,b],i)=>{if(EVENTS[i]){EVENTS[i].t[lang]=a;EVENTS[i].d[lang]=b}});
 (P.dq||[]).forEach((x,i)=>{if(DAILYQ[i])DAILYQ[i][lang]=x});
 (P.quiz||[]).forEach((q,i)=>{if(QUIZ[i])q.forEach((x,j)=>{QUIZ[i][j][lang]=x})});
 (P.posts||[]).forEach((x,i)=>{if(POSTS[i])POSTS[i].cap[lang]=x});
 TAG_L[lang]=P.tags||{};SUGG_FB[lang]=P.sugg||SUGG_FB.en;FBN[lang]=P.fbn||FBN.en;}
function CL(){/* content language actually available */return ["zh","ja","ko","es"].includes(S.lang)&&(S.lang==="zh"||TX[S.lang])?S.lang:"en"}
