import React, { useEffect, useMemo, useRef, useState } from 'react';
import { assemble, parseScript, dslQA, slotsOf, segments, dirFields, charLine } from './dsl.js';
import { TPL_NAME, TPL_SPEC, checkGame, libList, libPrompt } from './games.js';
import './pro.css';

/* MIRU Studio Pro —— 用户端的「官方标准」剧本编辑器。
   写出来的是和后台「剧本生产」、官方剧完全相同的 MIRU 标准剧本（pack.script），发布走同一条服务器审查
   （api/_dslqa.js + api/_package.js），App 用同一个导入器播放：背景 / 插图 / 视频 / 来电 / 条件分支 / 小游戏 / 多语言版本都一样。
   在 MIRU 里打开时（创作中心 → 专业模式），AI 和钻石走主站同一个账户（parent.ask / parent.spend）；单独打开也能写、能检查、能导出。 */

const P = (() => { try { return window.parent !== window && window.parent.MIRU_BRIDGE ? window.parent : null; } catch (_) { return null; } })();
const KEY = 'miru_pro_v1';
const LN = { zh: '中文', en: 'English', ja: '日本語', ko: '한국어', es: 'Español' };
const NAMES = { en: 'English (American)', ja: 'Japanese', ko: 'Korean', es: 'Spanish (Latin American)', zh: 'Simplified Chinese' };
const PRICE = { chapter: 3, card: 1, review: 2, games: 2, outline: 2 };
const uid = () => 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{"projects":[]}'); } catch (_) { return { projects: [] }; } };
const persist = d => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (_) {} };
const token = () => { try { return (JSON.parse(localStorage.getItem('miru_v2') || '{}').cloud || {}).token || ''; } catch (_) { return ''; } };
const gems = () => { try { return P ? P.S.keys : null; } catch (_) { return null; } };
const toast = s => { try { if (P && P.toast) return P.toast(s); } catch (_) {} const t = document.createElement('div'); t.className = 'ptoast'; t.textContent = s; document.body.appendChild(t); setTimeout(() => t.remove(), 2600); };
function pay(n, why) { if (!n) return true; if (!P) { toast('请在 MIRU 里打开（创作中心 → 专业模式）才能用 AI'); return false; } try { return !!P.spend(n, why); } catch (_) { return false; } }
async function ai(prompt, maxTokens) { if (!P || typeof P.ask !== 'function') throw new Error('no-ai'); return P.ask(prompt, { maxTokens: maxTokens || 4000, timeout: 120000 }); }
const RULES = () => { try { return (P && P.MIRU_RULES && P.MIRU_RULES.gen) || ''; } catch (_) { return ''; } };

const blank = () => ({ id: uid(), title: '', hook: '', premise: '', you: '', orient: 'bg', lang: 'zh', langs: ['en'], tags: [], cast: [{ key: 'lead', name: '', gender: 'm', age: '28', identity: '', personality: '', speech: '', boundary: '', openingLine: '', looks: '', portrait: '' }], chapters: [{ t: '', goal: '', body: '' }], assets: {}, cover: '', games: [], tr: {}, updated: Date.now() });

const INSERTS = [
  ['场景', '\n# SCENE｜地点\n⟦BG|bg_c{c}s{s}|地点和时间⟧\n旁白：'],
  ['旁白', '\n旁白：'],
  ['台词', '\n{lead}：“”'],
  ['你说', '\n你：'],
  ['自由回复', '\n⟦FREE|给玩家的提示|回复建议1|回复建议2|回复建议3⟧'],
  ['选择', '\n# CHOICE｜这一刻你要怎么做？\n#### A｜选项一\n⟦OPT|A|set:c{c}_a⟧\n{lead}：“”\n#### B｜选项二\n⟦OPT|B|set:c{c}_b⟧\n{lead}：“”\n#### C｜选项三\n⟦OPT|C|set:c{c}_c⟧\n{lead}：“”\n# ·'],
  ['插图', '\n⟦CG|cg_c{c}_{n}|这一幕画面⟧'],
  ['视频', '\n⟦VIDEO|vid_c{c}_{n}|这段视频的内容⟧'],
  ['照片', '\n⟦PHOTO|他发来的照片|说明⟧'],
  ['来电', '\n⟦CALL|{lead}|来电提示⟧\n{lead}：“”\n⟦/CALL⟧'],
  ['音乐', '\n⟦BGM|tense⟧'],
  ['特效', '\n⟦FX|petals⟧'],
  ['记一笔', '\n⟦SET|c{c}_flag⟧'],
  ['条件分支', '\n⟦IF|c{c}_a⟧\n{lead}：“（选过 A 才会看到）”\n⟦ELSE⟧\n{lead}：“（其他情况）”\n⟦/IF⟧'],
  ['秘密', '\n⟦SECRET|S_A|只有作者知道的真相|knows:{lead}|reveal_from:{c}⟧'],
  ['揭露', '\n⟦REVEAL|S_A⟧'],
  ['设定集', '\n⟦LORE|关键词1,关键词2|玩家问到这些词时角色要知道的设定⟧'],
];

export default function Pro() {
  const [db, setDb] = useState(load);
  const [cur, setCur] = useState(null);
  useEffect(() => persist(db), [db]);
  const proj = db.projects.find(p => p.id === cur);
  const upd = fn => setDb(d => ({ ...d, projects: d.projects.map(p => p.id === cur ? { ...fn(JSON.parse(JSON.stringify(p))), updated: Date.now() } : p) }));
  if (!proj) return <List db={db} setDb={setDb} open={setCur} />;
  return <Editor p={proj} upd={upd} back={() => setCur(null)} />;
}

function List({ db, setDb, open }) {
  const fileRef = useRef();
  const add = p => { setDb(d => ({ ...d, projects: [p, ...d.projects] })); open(p.id); };
  const fromGuide = () => {
    let g = null; try { g = JSON.parse(localStorage.getItem('miru.creator.v2.project') || 'null'); } catch (_) {}
    if (!g) return toast('没有找到 AI 引导创作里的作品');
    const p = blank(); p.title = g.title || ''; p.hook = g.hook || ''; p.premise = [g.premise, g.world, g.conflict].filter(Boolean).join('\n');
    const lead = g.lead || {}; p.cast[0] = { ...p.cast[0], name: lead.name || '', identity: lead.role || lead.identity || '', personality: lead.personality || lead.desc || '' };
    (Array.isArray(g.support) ? g.support : []).slice(0, 5).forEach((s, i) => p.cast.push({ ...blank().cast[0], key: 'c' + (i + 2), name: s.name || '', identity: s.role || '', personality: s.personality || s.desc || '' }));
    add(p); toast('已从 AI 引导创作带入设定和人物');
  };
  const importMd = e => { const f = e.target.files[0]; if (!f) return; f.text().then(t => { const s = parseScript(t); const p = blank(); p.title = s.title || f.name.replace(/\.\w+$/, ''); p.orient = s.orient || 'bg'; if (s.cast.length) p.cast = s.cast.map((c, i) => ({ ...blank().cast[0], ...c, key: 'c' + (i + 1) })); if (s.chapters.length) p.chapters = s.chapters; add(p); toast('已导入 ' + s.chapters.length + ' 章'); }); e.target.value = ''; };
  return (
    <div className="pro">
      <header className="phead"><div><span className="eyebrow">MIRU Studio Pro</span><h1>官方标准剧本编辑器</h1><p className="dim">和 MIRU 官方剧同一套剧本写法、同一套发布审查：背景、插图、视频、来电、条件分支、小游戏、多语言版本都能写。</p></div>{P && <button className="pbtn ghost" onClick={() => P.closeStudioPro && P.closeStudioPro()}>✕ 关闭</button>}</header>
      <div className="prow pwr">
        <button className="pbtn primary" onClick={() => add(blank())}>＋ 新建剧本</button>
        <button className="pbtn" onClick={fromGuide}>⇪ 从 AI 引导创作带入</button>
        <button className="pbtn" onClick={() => fileRef.current.click()}>⇪ 导入剧本 .md</button>
        <input ref={fileRef} type="file" accept=".md,.txt" hidden onChange={importMd} />
        {P && P.openOldPro && <button className="pbtn ghost" onClick={() => P.openOldPro()}>旧版结构编辑器</button>}
      </div>
      {db.projects.length === 0 ? <p className="note">还没有剧本。新建一部，或把 AI 引导创作里的故事带进来，按官方标准细写。</p> :
        <ul className="plist">{db.projects.map(p => {
          const q = dslQA(assemble(p));
          return <li key={p.id} onClick={() => open(p.id)}><b>{p.title || '未命名'}</b><span className="dim">{p.chapters.length} 章 · {q.err.length ? q.err.length + ' 个必须修的问题' : '结构通过'} · {new Date(p.updated).toLocaleString()}</span>{p.cloudId && <span className="tag ok">已发布</span>}</li>;
        })}</ul>}
    </div>
  );
}

const TABS = [['set', '① 设定'], ['cast', '② 人物卡'], ['write', '③ 剧本'], ['qa', '④ 检查'], ['assets', '⑤ 素材'], ['games', '⑥ 小游戏'], ['pub', '⑦ 语言与发布'], ['ver', '⑧ 版本']];

function Editor({ p, upd, back }) {
  const [tab, setTab] = useState('write');
  const script = useMemo(() => assemble(p), [p]);
  const qa = useMemo(() => dslQA(script), [script]);
  const [g, setG] = useState(gems());
  useEffect(() => { const t = setInterval(() => setG(gems()), 2000); return () => clearInterval(t); }, []);
  return (
    <div className="pro">
      <header className="phead">
        <div className="prow"><button className="pbtn ghost" onClick={back}>‹ 剧本列表</button><b className="ptitle">{p.title || '未命名'}</b></div>
        <div className="prow">{g != null && <span className="gem">💎 {g}</span>}<span className={'tag ' + (qa.err.length ? 'bad' : 'ok')} onClick={() => setTab('qa')}>{qa.err.length ? qa.err.length + ' 个问题' : '结构通过'}{qa.warn.length ? ' · ' + qa.warn.length + ' 条建议' : ''}</span></div>
      </header>
      <nav className="ptabs">{TABS.map(([k, t]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{t}</button>)}</nav>
      {tab === 'set' && <Setup p={p} upd={upd} />}
      {tab === 'cast' && <Cast p={p} upd={upd} />}
      {tab === 'write' && <Write p={p} upd={upd} qa={qa} />}
      {tab === 'qa' && <QA p={p} qa={qa} script={script} />}
      {tab === 'assets' && <Assets p={p} upd={upd} script={script} />}
      {tab === 'games' && <Games p={p} upd={upd} />}
      {tab === 'pub' && <Publish p={p} upd={upd} qa={qa} script={script} />}
      {tab === 'ver' && <Versions p={p} upd={upd} />}
    </div>
  );
}

function F({ label, children, hint }) { return <label className="pf"><span>{label}</span>{children}{hint && <small className="dim">{hint}</small>}</label>; }

function Setup({ p, upd }) {
  const [busy, setBusy] = useState(false);
  const set = (k, v) => upd(x => (x[k] = v, x));
  const outline = async () => {
    if (!p.premise && !p.title) return toast('先写一句设定或标题');
    const n = Math.max(1, Math.min(20, Number(prompt('要几章？官方标准 15–20 章，短篇也可以', String(p.chapters.length > 1 ? p.chapters.length : 15))) || 0)); if (!n) return;
    if (!pay(PRICE.outline, 'pro_outline')) return; setBusy(true);
    try {
      const r = await ai(RULES().slice(0, 6000) + '\n\n你是 MIRU 官方剧的总编剧。按上面的终版规则，给这部互动恋爱剧写 ' + n + ' 章的章节大纲。每章：标题 t（≤14 字）、本章目标 goal（这一章玩家要经历和决定什么，一句话）。只返回 JSON {"chapters":[{"t":"","goal":""}]}\n标题：' + p.title + '\n钩子：' + p.hook + '\n设定：' + p.premise + '\n玩家身份：' + p.you + '\n人物：' + p.cast.map(c => c.name + '（' + c.identity + '，' + c.personality + '）').join('；'), 4000);
      const C = (r && r.chapters || []).filter(c => c && c.t).slice(0, n);
      if (!C.length) throw new Error('empty');
      upd(x => { x.chapters = C.map((c, i) => ({ t: String(c.t), goal: String(c.goal || ''), body: (x.chapters[i] && x.chapters[i].body) || '' })); return x; });
      toast('大纲好了：' + C.length + ' 章');
    } catch (_) { toast('这次没生成出来，没扣钻'); try { P && (P.S.keys += PRICE.outline, P.save()); } catch (__) {} }
    setBusy(false);
  };
  return (
    <div className="ppanel">
      <F label="剧名"><input value={p.title} onChange={e => set('title', e.target.value)} /></F>
      <F label="一句话钩子" hint="出现在首页卡片和发现页"><input value={p.hook} onChange={e => set('hook', e.target.value)} /></F>
      <F label="设定 / 简介"><textarea rows={5} value={p.premise} onChange={e => set('premise', e.target.value)} /></F>
      <F label="玩家身份" hint="玩家只扮演自己；这里写的是故事给你的位置，比如「刚入职的法医」"><input value={p.you} onChange={e => set('you', e.target.value)} /></F>
      <div className="prow pwr">
        <F label="恋爱对象"><select value={p.orient} onChange={e => set('orient', e.target.value)}><option value="bg">男女（BG）</option><option value="bl">男男（BL）</option><option value="gl">女女（GL）</option></select></F>
        <F label="写作语言"><select value={p.lang} onChange={e => set('lang', e.target.value)}>{Object.entries(LN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></F>
      </div>
      <F label="标签" hint="用逗号分开，比如：黑帮, 先婚后爱, 慢热"><input value={(p.tags || []).join(', ')} onChange={e => set('tags', e.target.value.split(/[,，]/).map(s => s.trim()).filter(Boolean).slice(0, 12))} /></F>
      <Research p={p} upd={upd} />
      <div className="pbox"><b>章节大纲</b><p className="dim">现在 {p.chapters.length} 章。AI 按终版规则排一份大纲（标题 + 本章目标），已经写好的正文不会被覆盖。</p><button className="pbtn primary" disabled={busy} onClick={outline}>{busy ? '生成中…' : '✨ AI 排章节大纲 · 💎' + PRICE.outline}</button></div>
    </div>
  );
}

function Cast({ p, upd }) {
  const [busy, setBusy] = useState(-1);
  const set = (i, k, v) => upd(x => (x.cast[i][k] = v, x));
  const fill = async i => {
    const c = p.cast[i]; if (!c.name) return toast('先写名字');
    if (!pay(PRICE.card, 'pro_card')) return; setBusy(i);
    try {
      const spec = (P && P.MIRU_CARD_SPEC13) || '';
      const r = await ai(spec.slice(0, 3000) + '\n\n按 MIRU 角色卡规范，补全这个角色。保留作者已经写的内容，只补空的、把模糊的写具体。全员成年（21+）。只返回 JSON {"identity":"","age":"","looks":"","personality":"性格与反差","speech":"说话方式","boundary":"边界","openingLine":"单聊开场白","sellingPoint":"一句话卖点"}\n剧：' + p.title + '｜' + p.premise.slice(0, 600) + '\n角色：' + JSON.stringify(c), 2500);
      if (!r || typeof r !== 'object') throw new Error('empty');
      upd(x => { const t = x.cast[i]; ['identity', 'age', 'looks', 'personality', 'speech', 'boundary', 'openingLine', 'sellingPoint'].forEach(k => { if (r[k] && !String(t[k] || '').trim()) t[k] = String(r[k]); }); if (Number(t.age) && Number(t.age) < 21) t.age = '21'; return x; });
      toast('人物卡补好了');
    } catch (_) { toast('这次没生成出来，没扣钻'); try { P && (P.S.keys += PRICE.card, P.save()); } catch (__) {} }
    setBusy(-1);
  };
  return (
    <div className="ppanel">
      <p className="dim">第一位是男主 / 女主。人物卡会写进剧本（⟦CHAR⟧），也会出现在 App「发现 → 角色」里，玩家可以单独聊天。全员必须成年。</p>
      {p.cast.map((c, i) => (
        <div className="pcard" key={i}>
          <div className="prow pwr">
            <F label={i === 0 ? '主角名字' : '名字'}><input value={c.name} onChange={e => set(i, 'name', e.target.value)} /></F>
            <F label="性别"><select value={c.gender} onChange={e => set(i, 'gender', e.target.value)}><option value="m">男</option><option value="f">女</option><option value="x">其他</option></select></F>
            <F label="年龄"><input type="number" min="21" value={c.age} onChange={e => set(i, 'age', e.target.value)} style={{ width: 80 }} /></F>
          </div>
          <F label="身份"><input value={c.identity} onChange={e => set(i, 'identity', e.target.value)} /></F>
          <F label="性格与反差"><textarea rows={2} value={c.personality} onChange={e => set(i, 'personality', e.target.value)} /></F>
          <F label="说话方式"><input value={c.speech || ''} onChange={e => set(i, 'speech', e.target.value)} /></F>
          <F label="边界"><input value={c.boundary || ''} onChange={e => set(i, 'boundary', e.target.value)} /></F>
          <F label="外貌（用于立绘）"><input value={c.looks || ''} onChange={e => set(i, 'looks', e.target.value)} /></F>
          <F label="单聊开场白"><input value={c.openingLine || ''} onChange={e => set(i, 'openingLine', e.target.value)} /></F>
          <div className="prow"><button className="pbtn" disabled={busy === i} onClick={() => fill(i)}>{busy === i ? '补全中…' : '✨ AI 按角色卡规范补全 · 💎' + PRICE.card}</button>{i > 0 && <button className="pbtn ghost" onClick={() => upd(x => (x.cast.splice(i, 1), x))}>删除</button>}</div>
        </div>
      ))}
      <button className="pbtn" onClick={() => upd(x => (x.cast.push({ ...blank().cast[0], key: 'c' + (x.cast.length + 1), name: '' }), x))}>＋ 添加角色</button>
    </div>
  );
}

function Write({ p, upd, qa }) {
  const [ci, setCi] = useState(0);
  const [busy, setBusy] = useState(false);
  const ta = useRef();
  const c = p.chapters[ci] || p.chapters[0];
  const lead = (p.cast[0] && p.cast[0].name) || '他';
  const setC = (k, v) => upd(x => (x.chapters[ci][k] = v, x));
  const ins = tpl => {
    const el = ta.current; const n = (c.body.match(/⟦(CG|VIDEO)\|/g) || []).length + 1, s = (c.body.match(/^#\s*SCENE/gm) || []).length + 1;
    const t = tpl.replace(/\{lead\}/g, lead).replace(/\{c\}/g, String(ci + 1).padStart(2, '0')).replace(/\{s\}/g, String(s).padStart(2, '0')).replace(/\{n\}/g, n);
    const a = el ? el.selectionStart : c.body.length; const v = c.body.slice(0, a) + t + c.body.slice(a);
    setC('body', v); setTimeout(() => { if (el) { el.focus(); el.selectionStart = el.selectionEnd = a + t.length; } }, 0);
  };
  const write = async mode => {
    const price = PRICE.chapter; if (mode === 'polish' && !c.body.trim()) return toast('这一章还没有正文');
    if (!pay(price, 'pro_chapter')) return; setBusy(true);
    try {
      const prev = p.chapters.slice(Math.max(0, ci - 2), ci).map((x, k) => '【第' + (ci - 1 + k) + '章 ' + x.t + '】目标：' + x.goal + '\n' + String(x.body).slice(-1200)).join('\n');
      const fmt = 'MIRU 标准剧本写法（必须严格遵守，否则播不出来）：\n# SCENE｜地点 （每章 3–5 场）\n⟦BG|bg_c' + String(ci + 1).padStart(2, '0') + 's01|地点和时间⟧ （每个 SCENE 下一行必须是 BG）\n旁白：叙述\n角色名：“台词”\n你：玩家说的话（少用，玩家只扮演自己）\n⟦FREE|提示|建议1|建议2|建议3⟧ （玩家自由回复）\n⟦CG|cg_c' + String(ci + 1).padStart(2, '0') + '_1|画面⟧ 心动名场面插图（每章 2–3 张）\n⟦CALL|角色|提示⟧…⟦/CALL⟧ 来电；⟦PHOTO|标题|说明⟧ 他发来的照片\n⟦SET|flag⟧ 记下选择；⟦IF|flag⟧…⟦ELSE⟧…⟦/IF⟧ 按之前的选择显示不同内容\n章末必须是：\n# CHOICE｜问题\n#### A｜选项\n⟦OPT|A|set:flag⟧\n选项后的 2–4 行剧情\n#### B｜…（至少 2 个，最多 3 个，后果要不一样）\n# ·\n不要写「## 」小标题，不要写 # CHAPTER 行，不要写 ⟦CHAR⟧ 和 ⟦GOAL⟧。';
      const ask = mode === 'polish' ? '按终版规则和标准写法，修改下面这一章：保持剧情和选择不变，把对白写得更有张力和暧昧感、补齐缺的背景卡/插图/选项后果，修正格式问题。只返回 JSON {"body":"整章剧本"}\n原文：\n' + c.body
        : '按终版规则和标准写法，写出第 ' + (ci + 1) + ' 章完整剧本（约 60–90 行正文，' + (ci === 0 ? '第 1 章前 10 句主角必须出场，用具体行为展示他对你的态度；' : '') + '结尾留钩子）。只返回 JSON {"body":"整章剧本"}';
      const r = await ai(RULES().slice(0, 7000) + '\n\n' + fmt + '\n\n【作品】' + p.title + '｜钩子：' + p.hook + '\n设定：' + p.premise.slice(0, 1200) + '\n玩家身份：' + (p.you || '待定') + '\n人物：' + p.cast.map(x => x.name + '（' + [x.identity, x.personality, x.speech].filter(Boolean).join('；') + '）').join('\n') + '\n前情：\n' + (prev || '（这是第一章）') + '\n【本章】第 ' + (ci + 1) + ' 章「' + c.t + '」目标：' + (c.goal || '自定') + '\n\n' + ask, 8000);
      const body = r && typeof r.body === 'string' ? r.body.replace(/^#+\s*CHAPTER.*$/gim, '').replace(/^⟦(CHAR|GOAL)\|.*$/gm, '').trim() : '';
      if (body.length < 80) throw new Error('short');
      setC('body', mode === 'polish' || !c.body.trim() ? body : c.body + '\n\n' + body);
      toast(mode === 'polish' ? '这一章改好了' : '这一章写好了');
    } catch (_) { toast('这次没写出来，没扣钻'); try { P && (P.S.keys += price, P.save()); } catch (__) {} }
    setBusy(false);
  };
  const chErr = useMemo(() => qa.err.concat(qa.warn).filter(s => s.includes('第 ' + (ci + 1) + ' 章')), [qa, ci]);
  return (
    <div className="pwrite">
      <aside className="pchs">
        {p.chapters.map((x, i) => <button key={i} className={i === ci ? 'on' : ''} onClick={() => setCi(i)}><b>{i + 1}</b> {x.t || '未命名'}<small>{String(x.body).split('\n').filter(Boolean).length} 行</small></button>)}
        <button className="add" onClick={() => { upd(x => (x.chapters.push({ t: '', goal: '', body: '' }), x)); setCi(p.chapters.length); }}>＋ 加一章</button>
      </aside>
      <section className="ped">
        <div className="prow pwr">
          <F label={'第 ' + (ci + 1) + ' 章标题'}><input value={c.t} onChange={e => setC('t', e.target.value)} /></F>
          <F label="本章目标（⟦GOAL⟧，App 用它判断这一章什么时候算完成）"><input value={c.goal} onChange={e => setC('goal', e.target.value)} /></F>
        </div>
        <div className="pins">{INSERTS.map(([n, t]) => <button key={n} onClick={() => ins(t)}>{n}</button>)}</div>
        <textarea ref={ta} className="pcode" spellCheck={false} value={c.body} onChange={e => setC('body', e.target.value)} placeholder={'# SCENE｜雨夜·公寓门口\n⟦BG|bg_c01s01|雨夜的公寓门口⟧\n旁白：门铃在凌晨两点响起。\n' + lead + '：“抱歉，这么晚打扰你。”\n…\n# CHOICE｜你要开门吗？\n#### A｜开门\n⟦OPT|A|set:open⟧\n…\n#### B｜隔着门问他是谁\n⟦OPT|B|set:ask⟧\n…\n# ·'} />
        <div className="prow pwr">
          <button className="pbtn primary" disabled={busy} onClick={() => write('write')}>{busy ? 'AI 写作中…（约 1 分钟）' : (c.body.trim() ? '✨ AI 续写' : '✨ AI 按官方规则写这一章') + ' · 💎' + PRICE.chapter}</button>
          <button className="pbtn" disabled={busy} onClick={() => write('polish')}>✨ AI 按规则改稿 · 💎{PRICE.chapter}</button>
          {p.chapters.length > 1 && <button className="pbtn ghost" onClick={() => { if (window.confirm ? true : true) { upd(x => (x.chapters.splice(ci, 1), x)); setCi(Math.max(0, ci - 1)); } }}>删除这一章</button>}
        </div>
        {chErr.length > 0 && <ul className="pqa">{chErr.map((s, i) => <li key={i} className={qa.err.includes(s) ? 'r' : 'y'}>{s}</li>)}</ul>}
        <Draft p={p} upd={upd} />
      </section>
    </div>
  );
}

function QA({ p, qa, script }) {
  const [rev, setRev] = useState(null), [busy, setBusy] = useState(false);
  const st = qa.stats;
  const review = async () => {
    if (!pay(PRICE.review, 'pro_review')) return; setBusy(true);
    try {
      const r = await ai(RULES().slice(0, 9000) + '\n\n你是 MIRU 官方审稿人。按上面的终版规则逐条审这部剧本，找出真正影响体验的问题（开篇、人物一致性、选择后果是否不同、暧昧张力、节奏、信息是否提前泄露、玩家是否被代替说话/决定、安全）。每条写：章节、问题、违反哪条规则、具体怎么改。只返回 JSON {"score":0-100,"items":[{"ch":1,"rule":"05","issue":"","fix":""}]}\n\n' + script.slice(0, 26000), 5000);
      if (!r || !Array.isArray(r.items)) throw new Error('empty'); setRev(r);
    } catch (_) { toast('这次没审出来，没扣钻'); try { P && (P.S.keys += PRICE.review, P.save()); } catch (__) {} }
    setBusy(false);
  };
  return (
    <div className="ppanel">
      <div className="pstats">{[['章', st.chapters], ['场景', st.scenes], ['选择', st.choices], ['选项', st.options], ['台词行', st.lines], ['插图/视频', st.assets.cg + st.assets.video], ['小游戏', st.mg], ['人物卡', st.casts]].map(([k, v]) => <div key={k}><b>{v}</b><small>{k}</small></div>)}</div>
      <h3>结构检查（和发布审查同一套规则）</h3>
      {qa.err.length === 0 && qa.warn.length === 0 && <p className="good">全部通过。</p>}
      <ul className="pqa">{qa.err.map((s, i) => <li key={'e' + i} className="r">⛔ {s}</li>)}{qa.warn.map((s, i) => <li key={'w' + i} className="y">△ {s}</li>)}</ul>
      <h3>AI 审稿（按终版规则逐条看内容）</h3>
      <button className="pbtn primary" disabled={busy} onClick={review}>{busy ? '审稿中…' : '✨ AI 审稿 · 💎' + PRICE.review}</button>
      {rev && <div className="prev"><p><b>得分 {rev.score}</b></p><ul className="pqa">{rev.items.map((x, i) => <li key={i} className="y"><b>第 {x.ch} 章 · 规则 {x.rule}</b>：{x.issue}<br /><span className="dim">改法：{x.fix}</span></li>)}</ul></div>}
    </div>
  );
}

function Assets({ p, upd, script }) {
  const S = useMemo(() => slotsOf(script), [script]);
  const [busy, setBusy] = useState('');
  const up = async (slot, file) => {
    if (!file) return; const tk = token(); if (!tk) return toast('请先在 MIRU 登录');
    if (file.size > 4 * 1048576) return toast('单个文件不能超过 4MB');
    setBusy(slot);
    try {
      const r = await fetch('/api/pkg?work=' + encodeURIComponent(p.id) + '&slot=' + encodeURIComponent(slot) + '&mime=' + encodeURIComponent(file.type) + '&name=' + encodeURIComponent(file.name), { method: 'PUT', headers: { Authorization: 'Bearer ' + tk, 'Content-Type': file.type }, body: file });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.url && !(j.asset && j.asset.url)) throw new Error(j.error || r.status);
      const url = j.url || j.asset.url;
      upd(x => { if (slot === 'cover') x.cover = url; else x.assets[slot] = url; return x; }); toast('已上传');
    } catch (e) { toast('上传失败：' + (e.message || e)); }
    setBusy('');
  };
  const row = (slot, note, kind) => {
    const url = slot === 'cover' ? p.cover : p.assets[slot]; const acc = kind === 'video' ? 'video/*' : kind === 'bgm' ? 'audio/*' : 'image/*';
    return <div className="pslot" key={kind + slot}>
      <div className="pthumb">{url ? (kind === 'video' ? <video src={url} muted /> : kind === 'bgm' ? <span>🎵</span> : <img src={url} alt="" />) : <span className="dim">缺</span>}</div>
      <div className="pslotb"><b>{slot}</b><small className="dim">{note}</small></div>
      <label className="pbtn sm">{busy === slot ? '上传中…' : url ? '替换' : '上传'}<input type="file" accept={acc} hidden onChange={e => up(slot, e.target.files[0])} /></label>
      {url && <button className="pbtn ghost sm" onClick={() => upd(x => { if (slot === 'cover') x.cover = ''; else delete x.assets[slot]; return x; })}>移除</button>}
    </div>;
  };
  const total = S.bg.length + S.cg.length + S.video.length, have = [...S.bg, ...S.cg, ...S.video].filter(s => p.assets[s.slot]).length;
  return (
    <div className="ppanel">
      <p className="dim">素材按剧本里的位置挂：剧本写了几个 ⟦BG⟧ ⟦CG⟧ ⟦VIDEO⟧，这里就列几个。已挂 {have} / {total}。官方剧一部大约 70–80 张图：每章 3–5 张背景 + 2–3 张插图。缺的位置不挡发布（播放时跳过或由 AI 兜底），但会影响推荐。按位置上传不扣钻。</p>
      <h3>封面与人物立绘</h3>
      {row('cover', '发现页和首页卡片，竖版 3:4', 'img')}
      {p.cast.filter(c => c.name).map(c => row('char_' + (c.key || c.name), c.name + ' 的立绘', 'img'))}
      <h3>背景（⟦BG⟧ · {S.bg.length}）</h3>{S.bg.map(s => row(s.slot, s.note, 'img'))}
      <h3>心动插图（⟦CG⟧ · {S.cg.length}）</h3>{S.cg.map(s => row(s.slot, s.note, 'img'))}
      <h3>视频（⟦VIDEO⟧ · {S.video.length}）</h3>{S.video.map(s => row(s.slot, s.note, 'video'))}{row('opening_video', '开场 10 秒视频（可选）', 'video')}
      {S.bgm.length > 0 && <><h3>自定义音乐（⟦BGM⟧ · {S.bgm.length}）</h3><p className="dim">MIRU 曲库里已有的提示词（tense / romantic / night…）不用上传。</p>{S.bgm.map(s => row('bgm_' + s.slot, s.slot, 'bgm'))}</>}
    </div>
  );
}

function Games({ p, upd }) {
  const [q, setQ] = useState(''), [ci, setCi] = useState(0), [busy, setBusy] = useState(false);
  const lib = useMemo(() => { try { return libList(P && P.MG100); } catch (_) { return []; } }, []);
  const shown = lib.filter(g => !q || (g.zh + g.en + (g.kw || []).join(' ')).toLowerCase().includes(q.toLowerCase())).slice(0, 80);
  const place = (x, i, id) => { const c = x.chapters[i]; if (!c) return; if (/⟦MG\|/.test(c.body)) c.body = c.body.replace(/^⟦MG\|[^⟧]*⟧\s*$/m, '⟦MG|' + id + '⟧'); else { const k = c.body.search(/^#\s*CHOICE/m); c.body = k > 0 ? c.body.slice(0, k) + '⟦MG|' + id + '⟧\n' + c.body.slice(k) : c.body + '\n⟦MG|' + id + '⟧'; } };
  const design = async () => {
    if (!p.chapters.some(c => c.body.trim())) return toast('先写剧本，AI 才能按剧情配游戏');
    if (!pay(PRICE.games, 'pro_games')) return; setBusy(true);
    try {
      const dig = p.chapters.map((c, i) => '## 第' + (i + 1) + '章 ' + c.t + '\n' + String(c.body).split('\n').filter(l => /[：:]/.test(l)).slice(0, 30).join('\n')).join('\n\n');
      const r = await ai('给这部互动恋爱剧的每一章配 1 个小游戏，必须是这一章剧情里「你」正在做的事。\n第一步：先看 MIRU 游戏库里有没有贴这一章剧情的现成游戏（下面的清单，编号=名字(触发词)），有就用 {"ch":章,"lib":"编号"}。\n第二步：库里没有贴的，再按剧情定制一个：题目和选项用这一章的具体人物、物件、台词。' + TPL_SPEC + '。每段文字写成 [中文, English]；zh 标题 ≤8 字；pz/pe 是一句游戏说明。整部剧混用不同玩法，别都用同一种。\n只返回 JSON {"games":[{"ch":1,"lib":"g_xxx"},{"ch":2,"tpl":"","zh":"","en":"","pz":"","pe":"", …该模板的字段}]}\n\n【游戏库】' + libPrompt(lib) + '\n\n【剧本】\n' + dig.slice(0, 18000), 8000);
      const G = (r && r.games) || []; let nLib = 0, nNew = 0;
      upd(x => {
        G.forEach(g => {
          const i = Number(g && g.ch) - 1; if (!x.chapters[i]) return;
          if (g.lib && lib.some(l => l.id === g.lib)) { place(x, i, g.lib); nLib++; return; }
          const o = checkGame(g); if (!o) return;
          o.id = 'g_pro_' + x.id.slice(1, 9) + '_c' + (i + 1);
          x.games = (x.games || []).filter(y => y.id !== o.id).concat([o]); place(x, i, o.id); nNew++;
        });
        return x;
      });
      if (!nLib && !nNew) throw new Error('empty');
      toast('配好了：游戏库现成 ' + nLib + ' 个，按剧情定制 ' + nNew + ' 个（每章 1 个，放在章末选择之前，可以在剧本里挪位置）');
    } catch (_) { toast('这次没配出来，没扣钻'); try { P && (P.S.keys += PRICE.games, P.save()); } catch (__) {} }
    setBusy(false);
  };
  return (
    <div className="ppanel">
      <p className="dim">规范：每章最多 1 个小游戏，放在剧情里「你」正在做这件事的地方，都可以跳过。MIRU 游戏库一共 912 个、53 种玩法：其中 {lib.length} 个是通用的现成游戏，任何剧都能直接用；其余是官方剧按自己剧情写的题，题面绑定那部剧的人物，不能原样搬，但它们的玩法可以换上你的剧情再用（现在开放 11 种纯文字玩法，找不同、拖拽定位这类要配专门图片的，等生图接口接好再开放）。</p>
      <div className="pbox"><b>AI 自动配（库里优先，没有合适的再定制）</b><p className="dim">AI 读完每一章：库里有贴剧情的现成游戏就直接用；没有的，用 11 种玩法（选一个 / 排顺序 / 分类 / 圈出可疑处 / 连线 / 找相同 / 心意选择 / 试开关 / 写约定 / 按住稳住 / 敲暗号）按这一章剧情定制，中英双语。</p><button className="pbtn primary" disabled={busy} onClick={design}>{busy ? '配游戏中…' : '✨ AI 给每章配小游戏 · 💎' + PRICE.games}</button></div>
      {(p.games || []).length > 0 && <><h3>已定制（{p.games.length}）</h3><ul className="pqa">{p.games.map(g => <li key={g.id} className="g"><b>{g.zh}</b> · {TPL_NAME[g.tpl] || g.tpl} · <span className="dim">{g.pz}</span> <button className="pbtn ghost sm" onClick={() => upd(x => { x.games = x.games.filter(y => y.id !== g.id); x.chapters.forEach(c => { c.body = c.body.split('\n').filter(l => l.trim() !== '⟦MG|' + g.id + '⟧').join('\n'); }); return x; })}>删除</button></li>)}</ul></>}
      <h3>自己从游戏库挑（{lib.length} 个通用游戏）</h3>
      <div className="prow pwr"><F label="放到第几章"><select value={ci} onChange={e => setCi(Number(e.target.value))}>{p.chapters.map((c, i) => <option key={i} value={i}>第 {i + 1} 章 {c.t}</option>)}</select></F><F label="搜索"><input value={q} onChange={e => setQ(e.target.value)} placeholder="戒指、保险箱、心跳…" /></F></div>
      {!lib.length && <p className="note">在 MIRU 里打开才能读到游戏库。</p>}
      <div className="pglib">{shown.map(g => <button key={g.id} onClick={() => { upd(x => (place(x, ci, g.id), x)); toast('已放进第 ' + (ci + 1) + ' 章'); }}><b>{g.zh}</b><small>{g.en}</small></button>)}</div>
    </div>
  );
}

/* 版本记录：手动存、每次发布自动存，最多留 30 个；可以对比行数、恢复 */
function snap(x, note) { const v = { at: Date.now(), note, title: x.title, chapters: JSON.parse(JSON.stringify(x.chapters)), cast: JSON.parse(JSON.stringify(x.cast)), games: JSON.parse(JSON.stringify(x.games || [])) }; x.versions = [v].concat(x.versions || []).slice(0, 30); return x; }
function Versions({ p, upd }) {
  const [note, setNote] = useState('');
  const cur = assemble(p).split('\n').length;
  return (
    <div className="ppanel">
      <p className="dim">每次「发布 / 更新」会自动存一个版本；改大段之前也可以手动存一个。恢复会先把现在的样子另存一份，不会丢。</p>
      <div className="prow pwr"><F label="版本说明"><input value={note} onChange={e => setNote(e.target.value)} placeholder="比如：第 3 章改了结局" /></F><button className="pbtn primary" onClick={() => { upd(x => snap(x, note || '手动保存')); setNote(''); toast('已保存版本'); }}>保存当前版本</button></div>
      {!(p.versions || []).length && <p className="note">还没有版本记录。</p>}
      <ul className="plist">{(p.versions || []).map((v, i) => {
        const n = assemble({ ...p, chapters: v.chapters, cast: v.cast }).split('\n').length;
        return <li key={v.at} style={{ cursor: 'default' }}><b>{new Date(v.at).toLocaleString()}</b><span className="dim">{v.note} · {v.chapters.length} 章 · {n} 行（现在 {cur} 行，{n === cur ? '一样长' : (cur - n > 0 ? '多了 ' : '少了 ') + Math.abs(cur - n) + ' 行'}）</span><button className="pbtn sm" onClick={() => { upd(x => { snap(x, '恢复前自动保存'); x.chapters = JSON.parse(JSON.stringify(v.chapters)); x.cast = JSON.parse(JSON.stringify(v.cast)); x.games = JSON.parse(JSON.stringify(v.games || [])); return x; }); toast('已恢复到这个版本'); }}>恢复</button></li>;
      })}</ul>
    </div>
  );
}

/* 识别编剧稿：编剧用自然中文写的稿子（第一幕、人物设定、图片标注……）→ AI 转成 MIRU 标准剧本，一章一章转 */
const DRAFT_PRICE = n => Math.max(3, Math.ceil(n / 3000) * 2);
async function convertDraft(text, p, onProg) {
  const parts = []; const chunks = String(text).split(/\n(?=\s*(?:第\s*[0-9一二三四五六七八九十百]+\s*[章幕回集]|#+\s*CHAPTER|Chapter\s+\d+))/i).filter(s => s.trim());
  const blocks = chunks.length > 1 ? chunks : String(text).match(/[\s\S]{1,6000}(?=\n|$)/g) || [];
  for (let i = 0; i < blocks.length; i++) {
    const r = await ai(RULES().slice(0, 5000) + '\n\n把下面这段编剧稿转成 MIRU 标准剧本的一章（不改剧情、不删台词，只整理成格式；人物设定、执行规则、后台说明不要当成正文）。格式：# SCENE｜地点 + 下一行 ⟦BG|bg_c' + String(i + 1).padStart(2, '0') + 's01|说明⟧；旁白：…；角色名：“台词”；稿子里标了图片的地方写 ⟦CG|cg_c' + String(i + 1).padStart(2, '0') + '_n|画面⟧；章末必须是 # CHOICE｜问题 + #### A｜选项 + ⟦OPT|A|set:flag⟧ + 选项后剧情 … + # ·（稿子里没有选择就按剧情补一道有不同后果的选择）。不要写 # CHAPTER 行和 ⟦CHAR⟧。\n只返回 JSON {"t":"章节标题","goal":"本章目标","body":"整章剧本","cast":[{"name":"","gender":"m","age":"","identity":"","personality":""}]}\n人物（已知）：' + p.cast.map(c => c.name).filter(Boolean).join('、') + '\n\n【稿子】\n' + blocks[i].slice(0, 9000), 8000);
    if (!r || typeof r.body !== 'string' || r.body.length < 40) return null;
    parts.push(r); onProg && onProg(Math.round((i + 1) / blocks.length * 100));
  }
  return parts;
}
function Draft({ p, upd }) {
  const [txt, setTxt] = useState(''), [busy, setBusy] = useState(false), [prog, setProg] = useState(0);
  const price = DRAFT_PRICE(txt.length);
  const run = async () => {
    if (txt.trim().length < 200) return toast('稿子太短了');
    if (!pay(price, 'pro_draft')) return; setBusy(true); setProg(0);
    try {
      const parts = await convertDraft(txt, p, setProg); if (!parts || !parts.length) throw new Error('fail');
      upd(x => {
        snap(x, '识别编剧稿之前');
        const empty = x.chapters.length === 1 && !x.chapters[0].body.trim();
        const chs = parts.map(r => ({ t: String(r.t || ''), goal: String(r.goal || ''), body: String(r.body).replace(/^#+\s*CHAPTER.*$/gim, '').replace(/^⟦(CHAR|GOAL)\|.*$/gm, '').trim() }));
        x.chapters = empty ? chs : x.chapters.concat(chs);
        parts.forEach(r => (r.cast || []).forEach(c => { if (c && c.name && !x.cast.some(y => y.name === c.name)) { if (x.cast.length === 1 && !x.cast[0].name) x.cast = []; x.cast.push({ ...blank().cast[0], key: 'c' + (x.cast.length + 1), name: String(c.name), gender: String(c.gender || 'm').charAt(0), age: String(c.age || ''), identity: String(c.identity || ''), personality: String(c.personality || '') }); } }));
        return x;
      });
      setTxt(''); toast('识别好了：' + parts.length + ' 章，已加进剧本（之前的样子存在版本记录里）');
    } catch (_) { toast('这次没识别完，没扣钻'); try { P && (P.S.keys += price, P.save()); } catch (__) {} }
    setBusy(false);
  };
  return (
    <div className="pbox"><b>识别编剧稿</b><p className="dim">把编剧用自然中文写的稿子（第一幕、第二幕、图片标注、人物设定都可以）粘贴进来，AI 按章转成 MIRU 标准剧本：不改剧情、不删台词，只整理格式、补背景卡和章末选择。按字数计费，约每 3000 字 💎2，最少 💎3，转好才扣。</p>
      <textarea className="pcode" style={{ minHeight: 160 }} value={txt} onChange={e => setTxt(e.target.value)} placeholder="把编剧稿粘贴到这里…" />
      <div className="prow"><button className="pbtn primary" disabled={busy || !txt.trim()} onClick={run}>{busy ? '识别中 ' + prog + '%' : '✨ 识别成标准剧本 · 💎' + price}</button><span className="dim">{txt.length} 字</span></div>
    </div>
  );
}

/* 选题与定位（对应后台 ①）：AI 没有联网，这里不编造「参考来源」，只做选题分析和母题卡；真实资料请作者自己补进设定 */
function Research({ p, upd }) {
  const [busy, setBusy] = useState(false);
  const r = p.research;
  const run = async () => {
    if (!p.title && !p.premise) return toast('先写剧名或设定');
    if (!pay(PRICE.outline, 'pro_research')) return; setBusy(true);
    try {
      const o = await ai(RULES().slice(0, 4000) + '\n\n你是 MIRU 的选题编辑，面向英语区女性向互动恋爱读者。分析这个选题，只写能从设定本身推出来的判断，不要编造数据、书名、作者或网址。只返回 JSON {"position":"一句话定位","audience":"目标读者","promise":"体验承诺（玩家会感受到什么）","tropes":["核心母题/梗 3-6 个"],"hooks":["前三章的钩子 3 个"],"twists":["中后段反转方向 2-3 个"],"risks":["容易写崩或踩线的地方 2-4 个"],"motifs":[{"name":"母题卡名","use":"在剧里怎么用"}]}\n剧名：' + p.title + '\n钩子：' + p.hook + '\n设定：' + p.premise + '\n玩家身份：' + p.you + '\n人物：' + p.cast.map(c => c.name + '（' + c.identity + '）').join('；'), 3000);
      if (!o || !o.position) throw new Error('empty'); upd(x => (x.research = o, x)); toast('选题分析好了');
    } catch (_) { toast('这次没分析出来，没扣钻'); try { P && (P.S.keys += PRICE.outline, P.save()); } catch (__) {} }
    setBusy(false);
  };
  const L = (k, t) => r && r[k] && (Array.isArray(r[k]) ? r[k].length > 0 : true) ? <p><b>{t}：</b>{Array.isArray(r[k]) ? r[k].map(x => typeof x === 'string' ? x : x.name + '（' + x.use + '）').join('；') : r[k]}</p> : null;
  return (
    <div className="pbox"><b>选题与定位</b><p className="dim">对应后台「① 选题与素材研究」：定位、目标读者、体验承诺、母题卡、前三章钩子、反转方向、风险点。AI 不联网，不会编造参考来源；真实资料请自己补进设定。</p>
      <button className="pbtn primary" disabled={busy} onClick={run}>{busy ? '分析中…' : (r ? '重新分析' : '✨ AI 选题分析') + ' · 💎' + PRICE.outline}</button>
      {r && <div className="prev" style={{ fontSize: 13 }}>{L('position', '定位')}{L('audience', '读者')}{L('promise', '体验承诺')}{L('tropes', '母题')}{L('hooks', '前三章钩子')}{L('twists', '反转方向')}{L('risks', '风险')}{L('motifs', '母题卡')}</div>}
    </div>
  );
}

async function translateScript(script, cast, LG, onProg) {
  const lines = script.split('\n');
  const jobs = [];
  lines.forEach((l, i) => {
    const d = dirFields(l);
    if (d) { d.idx.forEach(k => jobs.push({ i, d: true, k, t: d.a[k] })); return; }
    const s = segments(l); if (s && s[1].trim()) jobs.push({ i, s, t: s[1] });
  });
  const names = cast.filter(c => c.name).map(c => c.name);
  const gl = {};
  if (names.length) { const r = await ai('Translate these character names into ' + NAMES[LG] + ' (romanize Chinese names into natural ' + NAMES[LG] + ' names or keep them consistent). Return ONLY JSON {"t":[...]} same order.\n' + JSON.stringify(names.concat(['旁白', '你'])), 800); (r && r.t || []).forEach((x, k) => { const src = names.concat(['旁白', '你'])[k]; if (src && x) gl[src] = String(x); }); }
  if (!gl['旁白']) gl['旁白'] = LG === 'en' ? 'Narrator' : '旁白';
  if (!gl['你']) gl['你'] = LG === 'en' ? 'You' : '你';
  const gloss = Object.entries(gl).map(([a, b]) => a + ' → ' + b).join('; ');
  const out = new Array(jobs.length).fill(null);
  for (let k = 0; k < jobs.length; k += 30) {
    const part = jobs.slice(k, k + 30).map(j => j.t);
    let r = null;
    for (let t = 0; t < 2 && !r; t++) { try { r = await ai('Translate each string of this interactive romance script into natural, vivid ' + NAMES[LG] + '. Keep flirting and tension, keep "you" for the player, keep quotes and emoji. Names: ' + gloss + '. Return ONLY JSON {"t":[...]} same count, same order.\n' + JSON.stringify(part), Math.min(7000, 400 + part.join('').length * 3)); if (!r || !Array.isArray(r.t) || r.t.length !== part.length) r = null; } catch (_) { r = null; } }
    if (!r) return null;
    r.t.forEach((x, j) => { out[k + j] = String(x || '').replace(/[\n|⟦⟧]/g, ' '); });
    onProg && onProg(Math.min(100, Math.round((k + 30) / jobs.length * 100)));
  }
  const L = lines.slice();
  const dirs = {};
  jobs.forEach((j, n) => {
    if (j.d) { (dirs[j.i] = dirs[j.i] || {})[j.k] = out[n]; return; }
    let pre = j.s[0]; const nm = pre.replace(/[：:]\s*$/, '').trim(); if (gl[nm]) pre = pre.replace(nm, gl[nm]);
    L[j.i] = pre + out[n] + j.s[2];
  });
  Object.entries(dirs).forEach(([i, f]) => { const d = dirFields(L[i]); if (!d) return; Object.entries(f).forEach(([k, v]) => { d.a[k] = v; }); if (d.k === 'CHAR' && gl[d.a[0]]) d.a[0] = gl[d.a[0]]; if (d.k === 'CALL' && gl[d.a[0]]) d.a[0] = gl[d.a[0]]; L[i] = L[i].replace(/^(\s*)⟦.*⟧\s*$/, '$1⟦' + d.k + '|' + d.a.join('|') + '⟧'); });
  return L.join('\n');
}

function Publish({ p, upd, qa, script }) {
  const [busy, setBusy] = useState(''), [prog, setProg] = useState(0), [res, setRes] = useState(null);
  const price = Math.max(3, p.chapters.length);
  const langs = [...new Set(['en'].concat(p.langs || []))].filter(l => l !== p.lang);
  const toggle = l => upd(x => { const s = new Set(x.langs || []); s.has(l) ? s.delete(l) : s.add(l); x.langs = [...s]; return x; });
  const translate = async LG => {
    if (!pay(price, 'translate')) return; setBusy('tr_' + LG); setProg(0);
    try { const t = await translateScript(script, p.cast, LG, setProg); if (!t) throw new Error('fail'); upd(x => { x.tr = x.tr || {}; x.tr[LG] = { at: Date.now(), script: t, src: script.length }; return x; }); toast(LN[LG] + ' 版翻好了'); }
    catch (_) { toast('翻译没完成，没扣钻'); try { P && (P.S.keys += price, P.save()); } catch (__) {} }
    setBusy('');
  };
  const publish = async () => {
    if (!qa.ok) return toast('还有 ' + qa.err.length + ' 个必须修的问题，先到「④ 检查」里改');
    const tk = token(); if (!tk) return toast('请先在 MIRU 登录');
    const stale = langs.filter(l => !(p.tr && p.tr[l]) || p.tr[l].src !== script.length);
    if (stale.length && !window.__proForce) { window.__proForce = 1; return toast('这些语言版本还没翻译或剧本改过了：' + stale.map(l => LN[l]).join('、') + '。再点一次「发布」就先不带这些版本发布'); }
    window.__proForce = 0; setBusy('pub');
    const pack = { script, assets: Object.assign({}, p.assets, p.cover ? { cover: p.cover } : {}), characters: p.cast.filter(c => c.name).map((c, i) => ({ key: (c.key && /^[a-z0-9_]+$/.test(c.key) ? c.key : 'c' + (i + 1)), name: c.name, gender: c.gender, age: Number(c.age) || 21, identity: c.identity, looks: c.looks, personality: c.personality, speech: c.speech, boundary: c.boundary, openingLine: c.openingLine, sellingPoint: c.sellingPoint, portrait: p.assets['char_' + (c.key || c.name)] || '' })), games: p.games || [], opening_video: p.assets.opening_video || undefined, ver: Date.now(), meta: { langs: [p.lang].concat(langs.filter(l => p.tr && p.tr[l] && p.tr[l].src === script.length)), premise: p.premise, you: p.you, studio: 'pro' } };
    langs.forEach(l => { if (p.tr && p.tr[l] && p.tr[l].src === script.length) pack['script_' + l] = p.tr[l].script; });
    let author = ''; try { author = (P && P.persona && P.persona() || {}).name || ''; } catch (_) {}
    try {
      const r = await fetch('/api/works', { method: 'POST', headers: { Authorization: 'Bearer ' + tk, 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'publish', authorName: author, work: { id: p.cloudId, title: p.title, hook: p.hook, lang: p.lang, orient: p.orient, tags: p.tags, cover: p.cover || null, pack } }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || (j.reasons || []).join(', ') || r.status);
      upd(x => snap(Object.assign(x, { cloudId: j.id }), '发布 · ' + (j.status === 'live' ? '已上线' : '审核中'))); setRes(j); toast(j.status === 'live' ? '🌐 已上线，所有人都能玩' : '🌐 已提交，审核通过后上线');
    } catch (e) { toast('发布没成功：' + (e.message || e)); }
    setBusy('');
  };
  return (
    <div className="ppanel">
      <h3>语言版本</h3>
      <p className="dim">英文版默认就有。翻译是整部剧逐行翻（台词、选项、场景名、人物卡、小游戏说明），和原文一行对一行，App 按读者的语言显示。每种语言 💎{price}（章节数，最少 3），翻好才扣；剧本改过之后要重翻。</p>
      <div className="plangs">{Object.entries(LN).filter(([k]) => k !== p.lang).map(([k, v]) => {
        const on = k === 'en' || (p.langs || []).includes(k); const t = p.tr && p.tr[k]; const fresh = t && t.src === script.length;
        return <div key={k} className="plang"><label><input type="checkbox" checked={on} disabled={k === 'en'} onChange={() => toggle(k)} /> {v}</label><span className={'tag ' + (fresh ? 'ok' : t ? 'warn' : '')}>{fresh ? '已翻译' : t ? '剧本改过，需重翻' : '未翻译'}</span>{on && <button className="pbtn sm" disabled={!!busy} onClick={() => translate(k)}>{busy === 'tr_' + k ? '翻译中 ' + prog + '%' : (t ? '重新翻译' : '翻译') + ' · 💎' + price}</button>}</div>;
      })}</div>
      <h3>发布</h3>
      <ul className="pqa">
        <li className={qa.ok ? 'g' : 'r'}>{qa.ok ? '✓ 结构检查通过' : '⛔ 还有 ' + qa.err.length + ' 个必须修的问题'}</li>
        <li className={p.cover ? 'g' : 'y'}>{p.cover ? '✓ 有封面' : '△ 没有封面：会用第一张背景兜底'}</li>
        <li className={p.cast.some(c => c.name) ? 'g' : 'y'}>{p.cast.filter(c => c.name).length} 张人物卡</li>
        <li className="g">{(p.games || []).length} 个定制小游戏</li>
      </ul>
      <button className="pbtn primary big" disabled={busy === 'pub'} onClick={publish}>{busy === 'pub' ? '发布中…' : p.cloudId ? '🌐 更新已发布的作品' : '🌐 发布到 MIRU'}</button>
      <div className="prow pwr" style={{ marginTop: 12 }}>
        <button className="pbtn" onClick={() => { const b = new Blob([script], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = (p.title || 'script') + '.md'; a.click(); }}>⇩ 下载剧本 .md</button>
      </div>
      {res && <div className="pbox"><b>{res.status === 'live' ? '已上线' : '审核中'}</b><p className="dim">作品 ID：{res.id}{res.qa && res.qa.assets ? ' · 素材覆盖：背景 ' + res.qa.assets.coverage.bg.have + '/' + res.qa.assets.coverage.bg.total + '，插图 ' + res.qa.assets.coverage.cg.have + '/' + res.qa.assets.coverage.cg.total : ''}</p>{res.qa && res.qa.warn && res.qa.warn.length > 0 && <ul className="pqa">{res.qa.warn.slice(0, 8).map((s, i) => <li key={i} className="y">{s}</li>)}</ul>}</div>}
    </div>
  );
}
