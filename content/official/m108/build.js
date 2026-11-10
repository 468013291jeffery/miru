/* 《第八誓约》M108 → MIRU 标准剧本（zh / en 两份）。
   d = 解析好的源数据（m108c.json）；tr = { en: {中文原文: 英文}, zh: {英文原文: 中文} }。
   缺译的字符串原样保留（宁可留原文，也不丢内容）。 */
function buildM108(d, tr, lang) {
  const zh = lang === 'zh';
  const toEn = s => (zh ? s : ((tr.en || {})[s] || s));      // 中文源 → 当前语言
  const toZh = s => (zh ? ((tr.zh || {})[s] || s) : s);      // 英文源 → 当前语言
  const NAME = zh
    ? { CASSIAN: '卡西安', ADRIAN: '阿德里安', LUCIEN: '卢西恩', DANTE: '但丁', SOREN: '索伦', ELIAS: '伊莱亚斯', RIVEN: '里文', SEVERIN: '塞弗林', MOTHER: '母亲', DOUBLE: '假身', 'FALSE PRINCE': '假身', YOU: '你' }
    : { CASSIAN: 'Cassian', ADRIAN: 'Adrian', LUCIEN: 'Lucien', DANTE: 'Dante', SOREN: 'Soren', ELIAS: 'Elias', RIVEN: 'Riven', SEVERIN: 'Severin', MOTHER: 'Mother', DOUBLE: 'The Double', 'FALSE PRINCE': 'The Double', YOU: 'You' };
  const PRINCES = ['CASSIAN', 'ADRIAN', 'LUCIEN', 'DANTE', 'SOREN', 'ELIAS', 'RIVEN'];
  const NARR = zh ? '旁白' : 'Narrator';
  const q = s => (zh ? '“' + s + '”' : '“' + s + '”');
  const bgName = n => 'bg' + String(n).padStart(3, '0');
  const say = (who, txt) => (NAME[who] || who) + (zh ? '：' : ': ') + q(toZh(txt));
  const narr = t => NARR + (zh ? '：' : ': ') + zhNames(toEn(t));
  const line = l => l[0] === 'narr' ? narr(l[1]) : say(l[1], l[2]);
  const chosen = txt => PRINCES.map(p => '⟦IF|heart_' + p.toLowerCase() + '⟧\n' + say(p, txt) + '\n⟦/IF⟧').join('\n');
  const L = { what: zh ? '你怎么做？' : 'What do you do?', who: zh ? '你想认真对待谁？' : 'Who do you want to try this with?', none: zh ? '暂时不选任何人' : 'No one, not yet', with: zh ? '和{n}认真试试' : 'Try this with {n}',
    endT: zh ? '终局' : 'Endings', meet: zh ? '你们决定继续相识，不急着承诺。' : 'You decide to keep getting to know each other, with no promises yet.', door: zh ? '第八门外' : 'Outside the Eighth Door' };
  /* 去掉策划备注式的句子（玩法说明、解锁提示），只留故事 */
  const META = /(玩家|解锁|开启|支线|路线|结局|不强制|可以选择|你选择优先|出现“|正史|男主|长期事件|缺少条件|前置|取决于|关系进展|获得|提升|增加|激活|锁定|进入|产生真实资源|开放世界|不能被写成|章入口|若有人拒绝)/;
  const keep = t => t && !META.test(t);
  const ZHN = { Cassian: '卡西安', Adrian: '阿德里安', Lucien: '卢西恩', Dante: '但丁', Soren: '索伦', Elias: '伊莱亚斯', Riven: '里文', Severin: '塞弗林', Mae: '梅' };
  const zhNames = t => (zh ? t.replace(/Cassian|Adrian|Lucien|Dante|Soren|Elias|Riven|Severin|Mae/g, m => ZHN[m]) : t);
  const out = [];
  d.chapters.forEach(c => {
    const md = [];
    const title = zhNames(toEn(c.title));
    md.push('# CHAPTER ' + c.n + '｜' + title);
    if (c.n === 1) {
      md.push('⟦ORIENT|bg⟧', '⟦SET|m108⟧');
      const R = zh
        ? { CASSIAN: ['赤曜王庭的长兄', '金棕发、赤金瞳，黑色礼服配深红披肩；公开偏爱，克制保护'], ADRIAN: ['战争亲王，霜刃军团统帅', '银白短发、冰蓝瞳、黑色军装；危险的安全感'], LUCIEN: ['梦境亲王，星镜塔之主', '墨黑长发、紫灰瞳、月白衬衫；温柔，懂你的灵魂'], DANTE: ['狂欢亲王，夜宴之城的主人', '乌黑卷发、绿金瞳、酒红丝绒西装；爱调情，内里脆弱'], SOREN: ['影刃亲王，黑鸦情报局首领', '黑发、乌金瞳、深灰大衣、手背旧疤；只为你破例'], ELIAS: ['治愈亲王，白蔷薇圣庭', '浅金发、浅灰瞳、白金长外套；安心可靠，也需要被照顾'], RIVEN: ['流放亲王，余烬禁地', '深棕发、暗金瞳、褪色皮衣；叛逆，给你留一条退路'], SEVERIN: ['摄政王', '伪造了七王求娶第八继承人的传统'] }
        : { CASSIAN: ['Eldest prince of the Crimson Court', 'Golden-brown hair, red-gold eyes, black formalwear and a crimson mantle; open devotion, careful protection'], ADRIAN: ['War prince of the Frost Blade Legion', 'Short silver hair, ice-blue eyes, black uniform; dangerous kind of safe'], LUCIEN: ['Dream prince of the Star Mirror Tower', 'Long black hair, violet-grey eyes, moon-white shirt; gentle, reads your soul'], DANTE: ['Revel prince of the City of Night Feasts', 'Black curls, green-gold eyes, wine-red velvet suit; flirt with a soft core'], SOREN: ['Shadow prince, head of the Raven Bureau', 'Black hair, dark-gold eyes, charcoal coat, an old scar on his hand; breaks every rule for you'], ELIAS: ['Healing prince of the White Rose Sanctum', 'Pale gold hair, light grey eyes, white-gold coat; steady, and needs care too'], RIVEN: ['Exiled prince of the Ember Wastes', 'Dark brown hair, dark-gold eyes, faded leather jacket; a rebel who keeps your way out open'], SEVERIN: ['The Regent', 'Forged the tradition of seven princes claiming the eighth heir'] };
      Object.keys(R).forEach(k => md.push('⟦CHAR|' + NAME[k] + '|m|' + (k === 'SEVERIN' ? 58 : 30) + '||' + R[k][0] + '|' + R[k][1] + '⟧'));
      md.push('⟦CHAR|' + NAME.YOU + '|f|25||' + (zh ? '第八家族的继承人' : 'Heir of the Eighth House') + '|' + (zh ? '名字、外貌和经历由你决定' : 'Your name, look and story are yours to decide') + '⟧');
    }
    md.push('⟦GOAL|' + zhNames(c.goal) + '|' + ((tr.en || {})[c.goal] || c.goal) + '⟧');
    /* CH32 开头：按 CH31 的选择和 CH23 的心意播放终局 */
    if (c.n === 32 && d.endings.length) {
      md.push('', '# SCENE｜' + L.endT, '⟦BG|' + bgName(62) + '|ending⟧');
      const E = id => d.endings.find(e => e.id === id);
      const endBlock = e => (e ? e.story.map(narr).concat(e.lines.map(l => say(l[0], l[1]))) : []);
      md.push('⟦IF|route_single⟧');
      PRINCES.forEach((p, i) => { md.push('⟦IF|heart_' + p.toLowerCase() + '⟧'); md.push(...endBlock(E('END_0' + (i + 1)))); md.push('⟦/IF⟧'); });
      md.push('⟦IF|heart_none⟧', NARR + (zh ? '：' : ': ') + L.meet, '⟦/IF⟧', '⟦/IF⟧');
      md.push('⟦IF|route_solo⟧', ...endBlock(E('END_08')), '⟦/IF⟧');
      md.push('⟦IF|route_open⟧', ...endBlock(E('END_09')), '⟦/IF⟧');
    }
    c.scenes.forEach(sc => {
      const place = sc.kind === 'D' ? toEn(sc.title) : (sc.kind === 'A' ? title : title + (zh ? '（续）' : ' (cont.)'));
      md.push('', '# SCENE｜' + place, '⟦BG|' + bgName(sc.bg || 1) + '|' + place + '⟧');
      sc.narr.filter(keep).forEach(t => md.push(narr(t)));
      sc.lines.forEach(l => md.push(say(l[1], l[2])));
      if (keep(sc.fact)) md.push(narr(sc.fact));
      sc.conds.forEach(cd => {
        md.push('⟦IF|heart_any⟧');
        cd.items.forEach(it => { if (it[0] === 'say' && it[1].startsWith('THE CHOSEN PRINCE')) md.push(chosen(it[2])); else md.push(line(it)); });
        if (c.n === 24) PRINCES.forEach(p => { const lw = d.last_words[p[0] + p.slice(1).toLowerCase()]; if (!lw) return; md.push('⟦IF|heart_' + p.toLowerCase() + '⟧'); lw.scene.forEach(t => md.push(narr(t))); md.push(say(p, lw.line)); md.push('⟦/IF⟧'); });
        if (sc.nobond.length) { md.push('⟦ELSE⟧'); sc.nobond.filter(keep).forEach(t => md.push(narr(t))); }
        md.push('⟦/IF⟧');
      });
    });
    /* CH23：先表白场，再选心意（场内选择，# · 收尾后回到正文） */
    if (c.rel) {
      md.push('', '# SCENE｜' + L.door, '⟦BG|' + bgName(46) + '|door⟧');
      c.rel.forEach(l => md.push(say(l[0], l[1])));
      md.push('', '# CHOICE｜' + L.who);
      PRINCES.forEach((p, i) => { md.push('#### ' + 'ABCDEFG'[i] + '｜' + L.with.replace('{n}', NAME[p])); md.push(say(p, c.rel.find(l => l[0] === p) ? c.rel.find(l => l[0] === p)[1] : '…').replace(/“.*”/, zh ? '“好。”' : '“Then let’s try.”')); md.push('⟦OPT|' + 'ABCDEFG'[i] + '|set:heart_' + p.toLowerCase() + ',heart_any⟧'); });
      md.push('#### H｜' + L.none, narr(zh ? '你没有选任何人。七个人都尊重了这个答案。' : 'You choose no one. All seven respect the answer.'), '⟦OPT|H|set:heart_none⟧', '', '# ·');
      md.push('', '# SCENE｜' + L.door, '⟦BG|' + bgName(46) + '|door⟧', narr(zh ? '夜风从第八门外吹进来。你回到众人身边。' : 'Night air drifts in from beyond the Eighth Door. You return to the others.'));
    }
    /* 章末三选一 */
    md.push('', '# CHOICE｜' + L.what);
    const FIX31 = { A: ['认真回应你心里的那个人', 'Answer the one you chose, for real'], B: ['选择自由，先成全自己', 'Choose freedom and your own life first'], C: ['和愿意的人谈一段坦诚的非排他关系', 'Talk openly about a non-exclusive bond with those who want it'] };
    (c.choice || []).forEach(o => {
      const lbl = c.n === 31 && FIX31[o.k] ? FIX31[o.k][zh ? 0 : 1] : zhNames(toEn(o.label));
      md.push('#### ' + o.k + '｜' + lbl);
      if (keep(o.react)) md.push(narr(o.react));
      const flags = ['c' + c.n + '_' + o.k];
      (o.state.match(/`([a-z_]+)`\s*\+=/g) || []).forEach(x => flags.push(x.match(/`([a-z_]+)`/)[1]));
      const rm = /route_mode`?\s*=\s*(\w+)/.exec(o.state); if (rm) flags.push('route_' + rm[1]);
      md.push('⟦OPT|' + o.k + '|set:' + [...new Set(flags)].join(',') + '⟧');
    });
    md.push('', '# ·');
    out.push({ n: c.n, t: title, md: md.join('\n') });
  });
  return out;
}
if (typeof module !== 'undefined') module.exports = buildM108;
