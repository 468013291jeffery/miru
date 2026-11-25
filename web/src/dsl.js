// MIRU 标准剧本（和后台「剧本生产」、官方剧同一套写法）的拼装、检查、翻译工具。
// 检查规则是 api/_dslqa.js（能不能播）+ api/_package.js scriptRules（规范）的浏览器版，口径一致：
// 这里报错的，发布时服务器也会挡；这里通过的，服务器也会放行。改规则要两边一起改。

export const KNOWN = new Set(['CHAR', 'BGM', 'TIME', 'BG', 'CG', 'VIDEO', 'PHOTO', 'MG', 'FREE', 'CALL', '/CALL', 'ITEM', 'SET', 'IF', 'ELSE', '/IF', 'OPT', 'GOAL', 'DONE', 'SECRET', 'REVEAL', 'ORIENT', 'LORE', 'FX', 'SFX']);
export const RE_DIR = /^⟦([A-Z/]+)((?:\|[^|⟧]*)*)⟧$/;
const clean = s => String(s == null ? '' : s).replace(/[|⟦⟧\n\r]/g, ' ').trim();

/* 项目 → 完整剧本 */
export function charLine(c) {
  return '⟦CHAR|' + [clean(c.name), clean(c.gender || 'm').charAt(0), clean(c.age || ''), '', clean(c.identity), clean([c.personality, c.speech && ('说话方式：' + c.speech), c.boundary && ('边界：' + c.boundary)].filter(Boolean).join('；'))].join('|') + '⟧';
}
export function assemble(p) {
  const out = ['# ' + clean(p.title || '未命名'), ''];
  (p.chapters || []).forEach((c, i) => {
    out.push('# CHAPTER ' + (i + 1) + '｜' + clean(c.t || ('第' + (i + 1) + '章')));
    if (i === 0) {
      out.push('⟦ORIENT|' + (p.orient || 'bg') + '⟧');
      (p.cast || []).filter(x => x.name).forEach(x => out.push(charLine(x)));
    }
    if (c.goal) out.push('⟦GOAL|' + clean(c.goal) + '⟧');
    String(c.body || '').replace(/\r\n?/g, '\n').split('\n').forEach(l => out.push(l));
    out.push('');
  });
  return out.join('\n').replace(/\n{3,}/g, '\n\n');
}
/* 完整剧本（.md）→ 项目章节（导入编剧稿 / 后台下载的 .md） */
export function parseScript(md) {
  const L = String(md || '').replace(/\r\n?/g, '\n').split('\n');
  const p = { title: '', orient: '', cast: [], chapters: [] };
  let cur = null;
  for (const raw of L) {
    const line = raw.trim();
    if (!p.title && /^#\s+(?!CHAPTER|SCENE|CHOICE|·)/i.test(line) && !cur) { p.title = line.replace(/^#\s+/, ''); continue; }
    const mc = line.match(/^#+\s*CHAPTER\s+\d+\s*[｜|]?\s*(.*)$/i);
    if (mc) { cur = { t: mc[1] || '', goal: '', body: [] }; p.chapters.push(cur); continue; }
    if (!cur) continue;
    const m = line.match(RE_DIR);
    if (m && m[1] === 'ORIENT') { p.orient = (m[2] || '').slice(1).trim(); continue; }
    if (m && m[1] === 'GOAL' && !cur.goal) { cur.goal = (m[2] || '').slice(1); continue; }
    if (m && m[1] === 'CHAR') {
      const a = (m[2] || '').slice(1).split('|');
      if (!p.cast.some(c => c.name === a[0])) p.cast.push({ key: '', name: a[0] || '', gender: a[1] || 'm', age: a[2] || '', identity: a[4] || '', personality: a[5] || '' });
      continue;
    }
    cur.body.push(raw);
  }
  p.chapters.forEach(c => { c.body = c.body.join('\n').replace(/^\n+|\n+$/g, ''); });
  return p;
}

/* 能不能播（api/_dslqa.js 的浏览器版） */
export function dslQA(md) {
  const L = String(md || '').replace(/\r\n?/g, '\n').split('\n').map(s => s.trim());
  const st = { chapters: 0, scenes: 0, choices: 0, options: 0, dots: 0, you: 0, casts: 0, lines: 0, callsOpen: 0, callsClose: 0, ifs: 0, ifEnds: 0, unknown: [], mg: 0, assets: { bg: 0, cg: 0, video: 0, photo: 0, item: 0, total: 0 } };
  const perCh = []; let cur = null; const lore = []; const orChars = [];
  const closeCh = () => { if (cur) perCh.push(cur); };
  for (const raw of L) {
    if (!raw) continue;
    if (/^#+\s*CHAPTER\s+\d+/i.test(raw)) { closeCh(); cur = { t: raw.replace(/^#+\s*/, '').slice(0, 60), choices: 0, dots: 0, scenes: 0, lines: 0, mg: 0, first: [] }; st.chapters++; continue; }
    if (/^#\s*SCENE/i.test(raw)) { st.scenes++; if (cur) cur.scenes++; continue; }
    if (/^#\s*CHOICE/i.test(raw)) { st.choices++; if (cur) cur.choices++; continue; }
    if (/^#{1,6}\s*[A-E]\s*[｜|]/.test(raw)) { st.options++; continue; }
    if (/^#\s*·\s*$/.test(raw)) { st.dots++; if (cur) cur.dots++; continue; }
    if (/^(你|您|You)\s*[:：]/.test(raw)) { st.you++; }
    if (raw.charAt(0) === '⟦') {
      const m = raw.match(RE_DIR);
      if (!m || !KNOWN.has(m[1])) { st.unknown.push(raw.slice(0, 24)); continue; }
      const k = m[1];
      if (k === 'CALL') st.callsOpen++; else if (k === '/CALL') st.callsClose++;
      else if (k === 'CHAR') { st.casts++; const p = raw.replace(/^⟦CHAR\|/, '').replace(/⟧$/, '').split('|'); orChars.push(p[0]); }
      else if (k === 'IF') st.ifs++; else if (k === '/IF') st.ifEnds++;
      else if (k === 'MG') { st.mg++; if (cur) cur.mg++; }
      else if (k === 'LORE') { const p = raw.replace(/^⟦LORE\|/, '').replace(/⟧$/, '').split('|'); lore.push({ keys: String(p[0] || '').split(/[,，、]/).filter(Boolean), txt: String(p[1] || '').trim(), raw: raw.slice(0, 30) }); }
      else if (['BG', 'CG', 'VIDEO', 'PHOTO', 'ITEM'].includes(k)) { const kk = k.toLowerCase(); st.assets[kk]++; st.assets.total++; }
      continue;
    }
    if (/^#/.test(raw)) continue;
    st.lines++;
    if (cur) { cur.lines++; if (cur.first.length < 10) cur.first.push(raw); }
  }
  closeCh();
  const err = [], warn = [];
  if (!st.chapters) err.push('没有章节：找不到「# CHAPTER 1｜…」这样的标记');
  if (st.unknown.length) err.push('有 ' + st.unknown.length + ' 条不认识的 ⟦…⟧ 指令（会原样显示给玩家）：' + st.unknown.slice(0, 3).join(' / '));
  if (st.callsOpen !== st.callsClose) err.push('⟦CALL⟧ 与 ⟦/CALL⟧ 数量不等（' + st.callsOpen + ' / ' + st.callsClose + '）—— 没闭合的那一通电话会把后面的内容全吞掉');
  if (st.ifs !== st.ifEnds) warn.push('⟦IF⟧ 与 ⟦/IF⟧ 数量不等（' + st.ifs + ' / ' + st.ifEnds + '）—— 条件会失效');
  perCh.forEach((c, i) => {
    const n = i + 1;
    if (!c.scenes) warn.push('第 ' + n + ' 章没有 SCENE（没有背景卡）');
    if (!c.choices) err.push('第 ' + n + ' 章章末没有 CHOICE —— 这一章结尾只会显示「继续」');
    if (c.dots < c.choices) err.push('第 ' + n + ' 章：CHOICE ' + c.choices + ' 道，却只有 ' + c.dots + ' 个「# ·」收尾');
    if (c.lines < 3) warn.push('第 ' + n + ' 章正文只有 ' + c.lines + ' 行');
    if (c.mg > 1) warn.push('第 ' + n + ' 章有 ' + c.mg + ' 个小游戏：规范要求每章最多 1 个');
    if (c.scenes && (c.scenes < 3 || c.scenes > 5)) warn.push('第 ' + n + ' 章有 ' + c.scenes + ' 场：规范建议 3–5 场');
  });
  if (perCh[0] && orChars.length && !perCh[0].first.some(l => orChars.some(nm => nm && l.startsWith(nm + '：')))) warn.push('第 1 章前 10 句主要角色还没有开口：开篇要先让玩家看到他怎么对待你（规则 05）');
  if (!st.you) warn.push('正文里没有「你：…」—— 系统只能把说话最多的角色当成玩家');
  if (st.options < st.choices * 2) warn.push('选项数 ' + st.options + ' 少于选择道数 ' + st.choices + ' 的两倍 —— 有选择题只剩 1 个选项');
  if (st.chapters && (st.chapters < 15 || st.chapters > 20)) warn.push('全剧 ' + st.chapters + ' 章：官方标准 15–20 章（短篇可以忽略）');
  if (!st.casts) warn.push('没有人物卡（⟦CHAR⟧）：角色页看不到他们，AI 续写也不知道人设');
  lore.forEach(e => { if (!e.keys.length || !e.txt) err.push('设定集格式不对：' + e.raw + '…（要写成 ⟦LORE|关键词1,关键词2|设定内容⟧）'); });
  /* 规范：每个 # SCENE 下一行必须是 ⟦BG⟧（服务器会挡） */
  const lines = String(md || '').replace(/\r\n?/g, '\n').split('\n'); let ch = 0;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (/^#+\s*CHAPTER\s+\d+/i.test(l)) ch++;
    if (/^#\s*SCENE/i.test(l)) { let j = i + 1; while (j < lines.length && !lines[j].trim()) j++; if (!/^⟦BG\|/.test((lines[j] || '').trim())) err.push('第 ' + (ch || '?') + ' 章「' + l.slice(0, 24) + '」下一行必须是 ⟦BG|槽位|说明⟧'); }
    if (/^##\s/.test(l)) warn.push('出现了「## 」小标题 —— 会原样播给玩家');
  }
  return { ok: err.length === 0, err, warn, stats: st, perCh };
}

/* 剧本里所有素材位置 */
export function slotsOf(md) {
  const o = { bg: [], cg: [], video: [], photo: [], bgm: [], mg: [], char: [] }; const seen = {};
  for (const raw of String(md || '').split('\n')) {
    const m = raw.trim().match(RE_DIR); if (!m) continue;
    const a = (m[2] || '').slice(1).split('|'); const k = { BG: 'bg', CG: 'cg', VIDEO: 'video', PHOTO: 'photo', BGM: 'bgm', MG: 'mg', CHAR: 'char' }[m[1]]; if (!k) continue;
    let v = String(a[0] || '').trim(); if (!v) continue; if (k === 'mg' && !/^g_/.test(v)) v = 'g_' + v;
    const key = k + ':' + v; if (seen[key]) continue; seen[key] = 1;
    o[k].push({ slot: v, note: String(a[1] || '').trim() });
  }
  return o;
}

/* 翻译：逐行只换文字，⟦指令⟧、槽位名、结构标记原样保留 —— 运行时要求译本和原文「一行对一行」 */
export function segments(line) {
  const l = line;
  let m;
  if ((m = l.match(/^(\s*#+\s*CHAPTER\s+\d+\s*[｜|]\s*)(.+)$/i))) return [m[1], m[2], ''];
  if ((m = l.match(/^(\s*#\s*(?:SCENE|CHOICE)\s*[｜|]\s*)(.+)$/i))) return [m[1], m[2], ''];
  if ((m = l.match(/^(\s*#{1,6}\s*[A-E]\s*[｜|]\s*)(.+)$/))) return [m[1], m[2], ''];
  if (/^\s*#/.test(l)) return null;
  if ((m = l.match(/^(\s*)⟦(GOAL|PHOTO)\|([^|⟧]*)((?:\|[^⟧]*)?)⟧\s*$/))) return null; /* 下面单独处理 */
  if (/^\s*⟦/.test(l)) return null;
  if ((m = l.match(/^(\s*[^：:“"]{1,16}[：:]\s*)(.+)$/))) return [m[1], m[2], ''];
  if (l.trim()) return ['', l, ''];
  return null;
}
/* 指令里需要翻的字段：GOAL 内容、FREE 提示与选项、CG/VIDEO/BG 的说明、CALL 提示、PHOTO 说明、CHAR 身份与性格 */
export function dirFields(line) {
  const m = line.trim().match(RE_DIR); if (!m) return null;
  const a = (m[2] || '').slice(1).split('|');
  const idx = { GOAL: [0], FREE: a.map((_, i) => i), BG: [1], CG: [1], VIDEO: [1], CALL: [1], PHOTO: [0, 1], CHAR: [4, 5], LORE: [1], SECRET: [1] }[m[1]];
  if (!idx) return null;
  return { k: m[1], a, idx: idx.filter(i => a[i] && a[i].trim()) };
}
