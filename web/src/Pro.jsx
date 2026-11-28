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
/* 2026-11-28 老板定：专业版所有 AI 收费先统一按 💎1（写一章、角色卡、审稿、小游戏、大纲 / 选题、识别编剧稿、翻译每种语言、AI 生图每张）。 */
/* 2026-11-28 fix：AI 审稿后「AI 帮我修这一处」每处 💎1；video：AI 生成一段约 10 秒的视频 💎25（老板确认是 10 秒一段、成本约 ¥7，按 3–5 倍收） */
const PRICE = { chapter: 1, card: 1, review: 1, games: 1, outline: 1, fix: 1, video: 25 };
const uid = () => 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{"projects":[]}'); } catch (_) { return { projects: [] }; } };
const persist = d => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (_) {} };
const token = () => { try { return (JSON.parse(localStorage.getItem('miru_v2') || '{}').cloud || {}).token || ''; } catch (_) { return ''; } };
const gems = () => { try { return P ? P.S.keys : null; } catch (_) { return null; } };
/* 2026-11-28 提示以前交给外层 App 显示（被剧本工具这一层盖住，看不见），或者是一个没有样式的 div（落在页面最底下）——
   用户点了按钮以为「没反应」。现在一律在剧本工具自己这一层的屏幕中下方显示。 */
const toast = s => { const t = document.createElement('div'); t.className = 'ptoast'; t.textContent = s; t.style.cssText = 'position:fixed;left:50%;bottom:12%;transform:translateX(-50%);z-index:99999;max-width:86%;padding:12px 18px;border-radius:12px;background:rgba(30,24,38,.96);color:#fff;font-size:15px;line-height:1.5;box-shadow:0 8px 30px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.14);text-align:center'; document.body.appendChild(t); setTimeout(() => t.remove(), 3200); };
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
    /* 当前作品没有时，从「我的作品」里取最近改过的一部 */
    if (!g || !(g.title || g.premise || g.hook)) { try { const shelf = JSON.parse(localStorage.getItem('miru.creator.v2.works') || '{}'); const list = Object.values(shelf).map(w => w && w.project).filter(x => x && (x.title || x.premise || x.hook)).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)); if (list[0]) g = list[0]; } catch (_) {} }
    if (!g || !(g.title || g.premise || g.hook)) return toast('还没有可以带入的作品：请先在「创作中心 → AI 引导」里写一部，再回来点这里');
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
  const [tab, setTab] = useState('set'); /* 2026-11-28 打开剧本默认停在第一个标签「① 设定」（原来是第三个「③ 剧本」） */
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
      {tab === 'qa' && <QA p={p} qa={qa} script={script} upd={upd} />}
      {tab === 'assets' && <Assets p={p} upd={upd} script={script} />}
      {tab === 'games' && <Games p={p} upd={upd} />}
      {tab === 'pub' && <Publish p={p} upd={upd} qa={qa} script={script} />}
      {tab === 'ver' && <Versions p={p} upd={upd} />}
      {/* 2026-11-28 每一页最下面加「下一步」，按顺序走到下一个标签；最后一页没有 */}
      {(() => { const i = TABS.findIndex(t => t[0] === tab); const nx = TABS[i + 1]; if (!nx) return null; return <div className="prow" style={{ justifyContent: 'flex-end', margin: '18px 0 28px' }}><button className="pbtn primary" onClick={() => { setTab(nx[0]); try { window.scrollTo(0, 0); document.querySelectorAll('.pro, .pro *').forEach(e => { if (e.scrollTop) e.scrollTop = 0; }); } catch (_) {} }}>下一步：{nx[1].replace(/^\S+\s*/, '')} ›</button></div>; })()}
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
      const r = await ai(RULES().slice(0, 6000) + '\n\n你是 MIRU 官方剧的总编剧。按上面的终版规则，给这部互动恋爱剧写 ' + n + ' 章的章节大纲。每章：标题 t（≤14 字）、本章目标 goal（这一章玩家要经历和决定什么，一句话）。只返回 JSON {"chapters":[{"t":"","goal":""}]}\n标题：' + p.title + '\n钩子：' + p.hook + '\n设定：' + p.premise + '\n玩家身份：' + p.you + (p.idea ? '\n作者原始想法（最高优先：人物数量、身份和核心关系必须与它一致）：' + String(p.idea).slice(0, 300) : '') + '\n人物：' + p.cast.map(c => c.name + '（' + c.identity + '，' + c.personality + '）').join('；'), 4000);
      const C = (r && r.chapters || []).filter(c => c && c.t).slice(0, n);
      if (!C.length) throw new Error('empty');
      upd(x => { x.chapters = C.map((c, i) => ({ t: String(c.t), goal: String(c.goal || ''), body: (x.chapters[i] && x.chapters[i].body) || '' })); return x; });
      toast('大纲好了：' + C.length + ' 章');
    } catch (_) { toast('这次没生成出来，没扣钻'); try { P && (P.S.keys += PRICE.outline, P.save()); } catch (__) {} }
    setBusy(false);
  };
  /* 2026-11-28 设定页最上面加「AI 帮我想 / 帮我改」：作者写一句想法，AI 把剧名、钩子、设定、玩家身份、标签一起想出来；
     已经写了的，「帮我想」不动它只补空的，「帮我改」会把已写的改得更抓人。下面的选题分析、章节大纲再基于这些内容做。 */
  const [busy2, setBusy2] = useState('');
  const helpMe = async mode => {
    const idea = String(p.idea || '').trim();
    if (!idea && !p.title && !p.premise && !p.hook) return toast('先在上面写一句你想写的故事，比如「黑帮继承人和卧底女警的契约婚姻」');
    if (mode === 'fix' && !p.title && !p.premise && !p.hook) return toast('还没有写任何内容可以改，先点「AI 帮我想」');
    /* 2026-11-28 老板反馈：写了「我和 8 个吸血鬼的故事」，AI 没按这个想。原因：下面已经有内容时「帮我想」只补空的，等于没用上这句想法。
       现在：有想法、下面又已有内容时先问一句要不要按想法全部重想；提示词里要求人物数量、身份、关系必须和想法一致；还没有人物卡时顺手把主要角色建成人物卡。 */
    const over = mode === 'think' && !!idea && !!(p.title || p.premise || p.hook) && window.confirm('下面已经有剧名 / 钩子 / 设定了。\n\n确定：按这句想法全部重新想（会覆盖下面已写的内容）\n取消：只补空着的');
    if (!pay(PRICE.outline, 'pro_setup')) return; setBusy2(mode);
    try {
      const r = await ai(RULES().slice(0, 4000) + '\n\n你是 MIRU 官方互动恋爱剧的策划。' + (mode === 'fix' ? '把作者已经写的设定改得更抓人、更具体，保持作者的核心想法和人物关系不变。' : '根据作者的一句想法，把这部剧的基础设定想出来。必须严格围绕作者的想法：想法里写明的人物数量、身份、种族、关系和题材一个都不能改、不能少（比如「我和 8 个吸血鬼」就必须是玩家和 8 个吸血鬼）。' + (over ? '下面的已有内容只作参考，全部按想法重写。' : '作者已经写了的字段原样保留，只补空的。')) + '全员成年。恋爱对象：' + ({ bg: '男女', bl: '男男', gl: '女女' }[p.orient] || '男女') + '。写作语言：' + (LN[p.lang] || '中文') + '。只返回 JSON {"title":"剧名（≤14 字）","hook":"一句话钩子（≤40 字，出现在首页卡片上，要让人想点开）","premise":"设定 / 简介（150–300 字：世界、冲突、主要人物关系、玩家卷进来的原因）","you":"玩家身份（故事给玩家的位置，≤20 字）","tags":["3–6 个标签"],"cast":[{"name":"名字","identity":"身份","personality":"性格与反差"}]}\ncast 是主要可攻略角色，数量必须和想法一致，最多 10 个。\n作者的想法：' + (idea || '（没单独写，看下面已有内容）') + '\n已有：' + JSON.stringify({ title: p.title, hook: p.hook, premise: p.premise, you: p.you, tags: p.tags }), 2500);
      if (!r || typeof r !== 'object') throw new Error('empty');
      upd(x => { ['title', 'hook', 'premise', 'you'].forEach(k => { if (r[k] && (mode === 'fix' || over || !String(x[k] || '').trim())) x[k] = String(r[k]); }); if (Array.isArray(r.tags) && r.tags.length && (mode === 'fix' || over || !(x.tags || []).length)) x.tags = r.tags.map(String).slice(0, 12); if (mode === 'think' && Array.isArray(r.cast) && r.cast.length && !x.cast.some(c => c.name)) x.cast = r.cast.filter(c => c && c.name).slice(0, 10).map((c, i) => ({ ...blank().cast[0], key: 'c' + (i + 1), name: String(c.name), identity: String(c.identity || ''), personality: String(c.personality || '') })); return x; });
      toast(mode === 'fix' ? '改好了，看看下面的内容' : '想好了，看看下面的内容，不满意可以再改');
    } catch (_) { toast('这次没生成出来，没扣钻'); try { P && (P.S.keys += PRICE.outline, P.save()); } catch (__) {} }
    setBusy2('');
  };
  return (
    <div className="ppanel">
      <div className="pbox"><b>先告诉 AI 你想写什么</b>
        <F label="一句话想法（可以很随意）" hint="比如：黑帮继承人和卧底女警的契约婚姻；或：我穿进游戏成了反派的未婚妻"><textarea rows={2} value={p.idea || ''} onChange={e => set('idea', e.target.value)} /></F>
        <div className="prow pwr"><button className="pbtn primary" disabled={!!busy2} onClick={() => helpMe('think')}>{busy2 === 'think' ? 'AI 在想…' : '✨ AI 帮我想 · 💎' + PRICE.outline}</button><button className="pbtn" disabled={!!busy2} onClick={() => helpMe('fix')}>{busy2 === 'fix' ? 'AI 在改…' : '✨ AI 帮我改 · 💎' + PRICE.outline}</button></div>
        <small className="dim">「帮我想」：把下面空着的剧名、钩子、设定、玩家身份、标签补出来，你写过的不动。「帮我改」：把你已经写的改得更抓人。</small>
      </div>
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
    /* 2026-11-28 AI 要先知道作者想要什么样的角色：卡片最上面加了「你想要什么样的角色」，AI 按这句话 + 剧的设定 + 已有的其他角色来写；
       名字可以不填，让 AI 起。 */
    const c = p.cast[i]; if (!c.name && !String(c.want || '').trim()) return toast('先写一句「你想要什么样的角色」，或者先填名字');
    if (!pay(PRICE.card, 'pro_card')) return; setBusy(i);
    try {
      const spec = (P && P.MIRU_CARD_SPEC13) || '';
      const r = await ai(spec.slice(0, 3000) + '\n\n按 MIRU 角色卡规范，补全这个角色。最重要的依据是「作者想要的角色」这句话，其次是剧的设定；要和已有的其他角色有明显区别、能互相形成关系。保留作者已经写的内容，只补空的、把模糊的写具体。全员成年（21+）。只返回 JSON {"name":"名字（作者没填才起）","identity":"","age":"","looks":"","personality":"性格与反差","speech":"说话方式","boundary":"边界","openingLine":"单聊开场白","sellingPoint":"一句话卖点"}\n剧：' + p.title + '｜' + p.premise.slice(0, 600) + '\n作者想要的角色：' + (String(c.want || '').trim() || '（没写，按剧的设定和这个位置来定）') + '\n这个位置：' + (i === 0 ? '第一主角（男主 / 女主）' : '配角 / 其他可攻略角色') + '\n已有的其他角色：' + (p.cast.filter((_, k) => k !== i && _.name).map(o => o.name + '（' + (o.identity || '') + '；' + (o.personality || '').slice(0, 40) + '）').join('；') || '无') + '\n角色：' + JSON.stringify(c), 2500);
      if (!r || typeof r !== 'object') throw new Error('empty');
      upd(x => { const t = x.cast[i]; ['name', 'identity', 'age', 'looks', 'personality', 'speech', 'boundary', 'openingLine', 'sellingPoint'].forEach(k => { if (r[k] && !String(t[k] || '').trim()) t[k] = String(r[k]); }); if (Number(t.age) && Number(t.age) < 21) t.age = '21'; return x; });
      toast('人物卡补好了');
    } catch (_) { toast('这次没生成出来，没扣钻'); try { P && (P.S.keys += PRICE.card, P.save()); } catch (__) {} }
    setBusy(-1);
  };
  return (
    <div className="ppanel">
      <p className="dim">第一位是男主 / 女主。人物卡会写进剧本（⟦CHAR⟧），也会出现在 App「发现 → 角色」里，玩家可以单独聊天。全员必须成年。</p>
      {p.cast.map((c, i) => (
        <div className="pcard" key={i}>
          <F label="你想要什么样的角色？（一句话就行，AI 按这个来写）" hint="比如：表面冷淡的黑帮继承人，只对我一个人心软；或：阳光学弟，其实一直在暗中保护我"><textarea rows={2} value={c.want || ''} onChange={e => set(i, 'want', e.target.value)} /></F>
          <div className="prow pwr">
            <F label={i === 0 ? '主角名字（可以留空让 AI 起）' : '名字（可以留空让 AI 起）'}><input value={c.name} onChange={e => set(i, 'name', e.target.value)} /></F>
            <F label="性别"><select value={c.gender} onChange={e => set(i, 'gender', e.target.value)}><option value="m">男</option><option value="f">女</option><option value="x">其他</option></select></F>
            <F label="年龄"><input type="number" min="21" value={c.age} onChange={e => set(i, 'age', e.target.value)} style={{ width: 80 }} /></F>
          </div>
          <F label="身份"><input value={c.identity} onChange={e => set(i, 'identity', e.target.value)} /></F>
          <F label="性格与反差"><textarea rows={2} value={c.personality} onChange={e => set(i, 'personality', e.target.value)} /></F>
          <F label="说话方式"><input value={c.speech || ''} onChange={e => set(i, 'speech', e.target.value)} /></F>
          <F label="边界"><input value={c.boundary || ''} onChange={e => set(i, 'boundary', e.target.value)} /></F>
          <F label="外貌（用于立绘）"><input value={c.looks || ''} onChange={e => set(i, 'looks', e.target.value)} /></F>
          <F label="单聊开场白"><input value={c.openingLine || ''} onChange={e => set(i, 'openingLine', e.target.value)} /></F>
          <div className="prow"><button className="pbtn" disabled={busy === i} onClick={() => fill(i)}>{busy === i ? '补全中…' : '✨ AI 按我想要的角色生成 / 补全 · 💎' + PRICE.card}</button>{i > 0 && <button className="pbtn ghost" onClick={() => upd(x => (x.cast.splice(i, 1), x))}>删除</button>}</div>
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
      const fmt = 'MIRU 标准剧本写法（必须严格遵守，否则播不出来）：\n# SCENE｜地点 （每章 3–5 场）\n⟦BG|bg_c' + String(ci + 1).padStart(2, '0') + 's01|地点和时间⟧ （每个 SCENE 下一行必须是 BG）\n旁白：叙述\n角色名：“台词”\n你：玩家说的话（少用，玩家只扮演自己）\n⟦FREE|提示|建议1|建议2|建议3⟧ （玩家自由回复）\n⟦CG|cg_c' + String(ci + 1).padStart(2, '0') + '_1|画面⟧ 心动名场面插图（' + ({ light: '这一档每章 1 张背景、插图最多 1 张，同一个地点重复用同一个 BG 槽位名', std: '这一档每章约 2 个不同的 BG 槽位、1 张插图', pro: '这一档每章 3–5 场、2–3 张插图' }[p.tier || 'std']) + '）\n⟦CALL|角色|提示⟧…⟦/CALL⟧ 来电；⟦PHOTO|标题|说明⟧ 他发来的照片\n⟦SET|flag⟧ 记下选择；⟦IF|flag⟧…⟦ELSE⟧…⟦/IF⟧ 按之前的选择显示不同内容\n章末必须是：\n# CHOICE｜问题\n#### A｜选项\n⟦OPT|A|set:flag⟧\n选项后的 2–4 行剧情\n#### B｜…（至少 2 个，最多 3 个，后果要不一样）\n# ·\n不要写「## 」小标题，不要写 # CHAPTER 行，不要写 ⟦CHAR⟧ 和 ⟦GOAL⟧。';
      const ask = mode === 'polish' ? '按终版规则和标准写法，修改下面这一章：保持剧情和选择不变，把对白写得更有张力和暧昧感、补齐缺的背景卡/插图/选项后果，修正格式问题。只返回 JSON {"body":"整章剧本"}\n原文：\n' + c.body
        : '按终版规则和标准写法，写出第 ' + (ci + 1) + ' 章完整剧本（约 60–90 行正文，' + (ci === 0 ? '第 1 章前 10 句主角必须出场，用具体行为展示他对你的态度；' : '') + '结尾留钩子）。只返回 JSON {"body":"整章剧本"}';
      const r = await ai(RULES().slice(0, 7000) + '\n\n' + fmt + '\n\n【作品】' + p.title + '｜钩子：' + p.hook + '\n设定：' + p.premise.slice(0, 1200) + '\n玩家身份：' + (p.you || '待定') + (p.idea ? '\n作者原始想法（最高优先：人物数量、身份和核心关系必须与它和设定一致，不得擅自增减或改写）：' + String(p.idea).slice(0, 300) : '') + '\n人物：' + p.cast.map(x => x.name + '（' + [x.identity, x.personality, x.speech].filter(Boolean).join('；') + '）').join('\n') + '\n前情：\n' + (prev || '（这是第一章）') + '\n【本章】第 ' + (ci + 1) + ' 章「' + c.t + '」目标：' + (c.goal || '自定') + '\n\n' + ask, 8000);
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
        <p className="dim" style={{ margin: '0 0 10px' }}>这里写的是每一章的正文。AI 写章时依据的是「① 设定」（剧名、钩子、设定、玩家身份）和「② 人物卡」：那两页是整部剧的总纲，这里是按总纲写出来的戏。想换故事方向或人物，先回 ①② 改，再回来重写这一章。{p.title ? ' 当前：《' + p.title + '》' + (p.cast.filter(k => k.name).length ? ' · ' + p.cast.filter(k => k.name).length + ' 个角色' : ' · 还没有人物卡') : ' 当前还没有填设定。'}</p>
        <div className="prow pwr">
          <F label={'第 ' + (ci + 1) + ' 章标题'}><input value={c.t} onChange={e => setC('t', e.target.value)} /></F>
          <F label="本章目标（⟦GOAL⟧，App 用它判断这一章什么时候算完成）"><input value={c.goal} onChange={e => setC('goal', e.target.value)} /></F>
        </div>
        <div className="pins">{INSERTS.map(([n, t]) => <button key={n} onClick={() => ins(t)}>{n}</button>)}</div>
        <textarea ref={ta} className="pcode" spellCheck={false} value={c.body} onChange={e => setC('body', e.target.value)} placeholder={'# SCENE｜雨夜·公寓门口\n⟦BG|bg_c01s01|雨夜的公寓门口⟧\n旁白：门铃在凌晨两点响起。\n' + lead + '：“抱歉，这么晚打扰你。”\n…\n# CHOICE｜你要开门吗？\n#### A｜开门\n⟦OPT|A|set:open⟧\n…\n#### B｜隔着门问他是谁\n⟦OPT|B|set:ask⟧\n…\n# ·'} />
        <div className="prow pwr">
          <button className="pbtn primary" disabled={busy} onClick={() => write('write')}>{busy ? 'AI 写作中…（约 1 分钟）' : (c.body.trim() ? '✨ AI 续写' : '✨ AI 按官方规则写这一章') + ' · 💎' + PRICE.chapter}</button>
          <button className="pbtn" disabled={busy} onClick={() => write('polish')}>✨ AI 按规则改稿 · 💎{PRICE.chapter}</button>
          <small className="dim" style={{ flexBasis: '100%' }}>两个按钮不一样：「续写」是接着你已经写的往下写新内容（空白时就是写完整一章）；「改稿」不加新剧情，只把你已经写好的这一章按官方规则改规范（格式、背景卡、章末选择等）。</small>
          {p.chapters.length > 1 && <button className="pbtn ghost" onClick={() => { if (window.confirm ? true : true) { upd(x => (x.chapters.splice(ci, 1), x)); setCi(Math.max(0, ci - 1)); } }}>删除这一章</button>}
        </div>
        {chErr.length > 0 && <ul className="pqa">{chErr.map((s, i) => <li key={i} className={qa.err.includes(s) ? 'r' : 'y'}>{s}</li>)}</ul>}
        <Draft p={p} upd={upd} />
      </section>
    </div>
  );
}

function QA({ p, qa, script, upd }) {
  const [rev, setRev] = useState(null), [busy, setBusy] = useState(false);
  /* 2026-11-28 AI 审稿的每一条后面加「AI 帮我修这一处」：只改这一个问题，别的不动；修之前自动存一个版本，可以在「⑧ 版本」里恢复。每处 💎1，修成才扣。 */
  const [fixing, setFixing] = useState(-1), [fixed, setFixed] = useState({});
  const fixOne = async (x, i) => {
    const ci = Math.max(1, Number(x.ch) || 1) - 1, c = p.chapters[ci];
    if (!c || !String(c.body || '').trim()) return toast('第 ' + (ci + 1) + ' 章还没有正文，没法修');
    if (!upd) return;
    if (!pay(PRICE.fix, 'pro_fix')) return; setFixing(i);
    try {
      const r = await ai(RULES().slice(0, 6000) + '\n\n你是 MIRU 官方剧的改稿编辑。只修下面这一个问题，其余剧情、选择、格式标记（# SCENE、⟦BG|…⟧、⟦CG|…⟧、# CHOICE、⟦OPT|…⟧、⟦SET|…⟧、⟦IF|…⟧ 等）和槽位名一律保持不变，不要删减篇幅。只返回 JSON {"body":"修改后的整章剧本"}\n【作品】' + p.title + '｜设定：' + String(p.premise || '').slice(0, 800) + '\n人物：' + p.cast.filter(k => k.name).map(k => k.name + '（' + [k.identity, k.personality].filter(Boolean).join('；') + '）').join('；') + '\n【要修的问题】规则 ' + x.rule + '：' + x.issue + '\n【建议改法】' + x.fix + '\n【第 ' + (ci + 1) + ' 章原文】\n' + c.body, 8000);
      const body = r && typeof r.body === 'string' ? r.body.trim() : '';
      if (body.length < Math.min(200, c.body.length * 0.5)) throw new Error('short');
      upd(y => { snap(y, 'AI 修复前 · 第 ' + (ci + 1) + ' 章'); y.chapters[ci].body = body; return y; });
      setFixed(f => Object.assign({}, f, { [i]: 1 })); toast('第 ' + (ci + 1) + ' 章这一处修好了（修改前的样子存在「⑧ 版本」里）');
    } catch (_) { toast('这一处没修成，没扣钻'); try { P && (P.S.keys += PRICE.fix, P.save()); } catch (__) {} }
    setFixing(-1);
  };
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
      {rev && <div className="prev"><p><b>得分 {rev.score}</b></p><ul className="pqa">{rev.items.map((x, i) => <li key={i} className="y"><b>第 {x.ch} 章 · 规则 {x.rule}</b>：{x.issue}<br /><span className="dim">改法：{x.fix}</span><br /><button className="pbtn sm" style={{ marginTop: 6 }} disabled={fixing >= 0 || !!fixed[i]} onClick={() => fixOne(x, i)}>{fixed[i] ? '✓ 已修复' : fixing === i ? 'AI 修复中…（约 1 分钟）' : '✨ AI 帮我修这一处 · 💎' + PRICE.fix}</button></li>)}</ul></div>}
    </div>
  );
}

/* 素材：三档（轻量 / 标准 / 官方级）+ 每个位置都可以「上传自己的图」或「AI 生成」。
   AI 生图走主站 studioGenImage（mod206）：接口接好之前按钮会提示先上传；接好后不用改这里。按张收费，成功才扣。 */
const TIERS = {
  light: { name: '轻量', per: '每章 1 张背景（同一个地点可以反复用同一张），插图可选', target: n => Math.max(6, n * 1 + 2), tip: '适合先上线试水：封面 + 主角立绘 + 每章一张背景。' },
  std: { name: '标准', per: '每章约 2 张背景 + 1 张心动插图', target: n => n * 3 + 2, tip: '大多数用户作品推荐这一档。' },
  pro: { name: '官方级', per: '每章 3–5 张背景 + 2–3 张插图', target: n => Math.max(70, n * 6), tip: '和官方剧一样的量，一部大约 70–80 张。' },
};
const SIZE = { bg: [768, 1344], cg: [768, 1344], cover: [768, 1024], char: [768, 1024] };
function Assets({ p, upd, script }) {
  const S = useMemo(() => slotsOf(script), [script]);
  const [busy, setBusy] = useState(''), [prog, setProg] = useState('');
  const tier = TIERS[p.tier || 'std'];
  const imgPrice = (() => { try { return (P && P.studioImagePrice && P.studioImagePrice()) || 1; } catch (_) { return 1; } })();
  const ready = () => { try { return !!(P && P.studioImageReady && P.studioImageReady()); } catch (_) { return false; } };
  const putFile = async (slot, file) => {
    const tk = token(); if (!tk) throw new Error('请先在 MIRU 登录');
    /* 2026-11-28 视频最长 1 分钟（40MB 以内）；前 10 秒免费，之后每多 10 秒 💎1。图片 / 音频仍是 4MB。 */
    const isVid = /^video\//.test(file.type || '');
    let sec = 0;
    if (isVid) {
      if (file.size > 40 * 1048576) throw new Error('视频不能超过 40MB');
      sec = await new Promise(ok => { const v = document.createElement('video'); v.preload = 'metadata'; v.onloadedmetadata = () => { ok(v.duration || 0); URL.revokeObjectURL(v.src); }; v.onerror = () => ok(0); v.src = URL.createObjectURL(file); });
      if (!(sec > 0)) throw new Error('读不到视频时长，请换一个 mp4 文件');
      if (sec > 60.5) throw new Error('视频最长 1 分钟（这段 ' + Math.round(sec) + ' 秒）');
      const cost = Math.max(0, Math.ceil(sec / 10) - 1);
      if (cost > 0 && !window.confirm('这段视频 ' + Math.round(sec) + ' 秒：前 10 秒免费，之后每 10 秒 💎1，共 💎' + cost + '。继续上传？')) throw new Error('已取消');
    } else if (file.size > 4 * 1048576) throw new Error('单个文件不能超过 4MB');
    const r = await fetch('/api/pkg?work=' + encodeURIComponent(p.id) + '&slot=' + encodeURIComponent(slot) + '&mime=' + encodeURIComponent(file.type) + '&name=' + encodeURIComponent(file.name) + (isVid ? '&sec=' + sec.toFixed(1) : ''), { method: 'PUT', headers: { Authorization: 'Bearer ' + tk, 'Content-Type': file.type }, body: file });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.url && !(j.asset && j.asset.url)) throw new Error(j.error || r.status);
    const url = j.url || j.asset.url;
    upd(x => { if (slot === 'cover') x.cover = url; else x.assets[slot] = url; return x; });
    return url;
  };
  const up = async (slot, file) => { if (!file) return; setBusy(slot); try { await putFile(slot, file); toast('已上传'); } catch (e) { toast('上传失败：' + (e.message || e)); } setBusy(''); };
  const promptFor = (slot, note, kind) => {
    const lead = p.cast[0] || {};
    const base = 'Cinematic romance visual novel art, soft dramatic lighting, rich color, high detail, no text, no watermark, no logo.';
    if (kind === 'char') { const c = p.cast.find(x => 'char_' + (x.key || x.name) === slot) || lead; return base + ' Character portrait, waist-up, facing viewer, adult (' + (c.age || 25) + '), ' + (c.gender === 'f' ? 'woman' : 'man') + '. ' + [c.looks, c.identity, c.personality].filter(Boolean).join('. ').slice(0, 400); }
    if (kind === 'cover') return base + ' Story cover poster for "' + p.title + '": ' + (p.hook || p.premise).slice(0, 300) + '. Featuring ' + (lead.looks || lead.identity || 'the male lead') + '.';
    if (kind === 'cg') return base + ' Romantic key scene illustration: ' + (note || slot) + '. Featuring ' + (lead.looks || lead.identity || 'the lead') + '. Story: ' + p.title + '.';
    return base + ' Background scenery only, no people: ' + (note || slot) + '. Setting of the story "' + p.title + '".';
  };
  const gen = async (slot, note, kind) => {
    if (!ready()) { toast('AI 生图接口还在接入，接好之后这个按钮直接能用；现在可以先上传自己的图'); return false; }
    if (!P || (P.S.keys || 0) < imgPrice) { try { P && P.paySheet && P.paySheet('img'); } catch (_) {} toast('钻石不够（每张 💎' + imgPrice + '）'); return false; }
    const [w, h] = SIZE[kind] || SIZE.bg;
    let u = await P.studioGenImage({ prompt: promptFor(slot, note, kind), w, h, slot, kind, title: p.title });
    if (!u) throw new Error('empty');
    const blob = await (await fetch(u)).blob();
    await putFile(slot, new File([blob], slot + '.' + ((blob.type.split('/')[1] || 'png').replace('jpeg', 'jpg')), { type: blob.type || 'image/png' }));
    try { P.spend(imgPrice, 'img'); } catch (_) {}
    return true;
  };
  /* 2026-11-28 视频位置也可以 AI 生成：把一张图（优先封面）变成约 10 秒的动态画面（和主站「让画面动起来」同一个接口），💎25，成功才扣。 */
  const [vprog, setVprog] = useState('');
  const genVideo = async (slot, note) => {
    const src = p.cover || p.assets[(S.cg[0] || {}).slot] || p.assets[(S.bg[0] || {}).slot] || Object.keys(p.assets).filter(k => /^char_/.test(k)).map(k => p.assets[k])[0];
    if (!src) return toast('AI 视频是把一张图变成会动的画面：先上传或生成封面（或任意一张插图）');
    if (!window.confirm('AI 会用' + (p.cover ? '封面' : '已有的一张图') + '生成一段约 10 秒的视频，💎' + PRICE.video + '，生成成功才扣，大约要 1–2 分钟。继续？')) return;
    if (!pay(PRICE.video, 'pro_video')) return; setBusy(slot); setVprog('准备中…');
    try {
      const ep = (P && typeof P.MIRU_TTS === 'string' && P.MIRU_TTS) || '/api/tts';
      const blob0 = await (await fetch(src)).blob();
      const image = await new Promise((ok, no) => { const im = new Image(); im.onload = () => { try { const k = Math.min(1, 640 / Math.max(im.naturalWidth, im.naturalHeight)), cv = document.createElement('canvas'); cv.width = Math.round(im.naturalWidth * k); cv.height = Math.round(im.naturalHeight * k); cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height); ok(cv.toDataURL('image/jpeg', .84)); } catch (e) { no(e); } }; im.onerror = no; im.src = URL.createObjectURL(blob0); });
      const prompt = ('Cinematic romance drama shot' + (slot === 'opening_video' ? ', opening scene of the story "' + p.title + '"' : '') + ': ' + String(note && slot !== 'opening_video' ? note : (p.hook || p.premise || '')).slice(0, 240) + '. Subtle natural motion: breathing, a blink, hair moving slightly, a slow turn toward the camera; slow gentle camera push-in. Moody practical lighting, film look, keep the faces identical. No text.').replace(/\s+/g, ' ');
      const r = await fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ vid: { image, prompt } }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.id) throw new Error(j.error || r.status);
      let url = '';
      for (let i = 0; i < 72 && !url; i++) {
        await new Promise(z => setTimeout(z, 5000)); setVprog('生成中 ' + Math.min(99, Math.round((i + 1) / 24 * 100)) + '%');
        let st = null; try { st = await (await fetch(ep + '?vid=' + encodeURIComponent(j.id))).json(); } catch (_) { continue; }
        if (st.state === 'success' && st.url) url = st.url; else if (st.state === 'failed') throw new Error('failed');
      }
      if (!url) throw new Error('timeout');
      try { const vb = await (await fetch(url)).blob(); await putFile(slot, new File([vb], slot + '.mp4', { type: 'video/mp4' })); }
      catch (_) { upd(x => { x.assets[slot] = url; return x; }); }
      toast('视频生成好了');
    } catch (e) { try { P && (P.S.keys += PRICE.video, P.save()); } catch (_) {} toast('视频没生成出来，没扣钻'); }
    setBusy(''); setVprog('');
  };
  const genOne = async (slot, note, kind) => { setBusy(slot); try { if (await gen(slot, note, kind)) toast('生成好了'); } catch (e) { toast('这张没生成出来，没扣钻'); } setBusy(''); };
  const imgSlots = [['cover', '封面', 'cover']].concat(p.cast.filter(c => c.name).map(c => ['char_' + (c.key || c.name), c.name + ' 的立绘', 'char']), S.bg.map(s => [s.slot, s.note, 'bg']), S.cg.map(s => [s.slot, s.note, 'cg']));
  const missing = imgSlots.filter(([s]) => !(s === 'cover' ? p.cover : p.assets[s]));
  const genAll = async () => {
    if (!missing.length) return toast('图片都齐了');
    if (!ready()) return toast('AI 生图接口还在接入，接好之后这个按钮直接能用；现在可以先上传自己的图');
    let ok = 0;
    for (let i = 0; i < missing.length; i++) {
      const [s, n, k] = missing[i]; setProg((i + 1) + ' / ' + missing.length); setBusy(s);
      try { if (!(await gen(s, n, k))) break; ok++; } catch (_) {}
    }
    setBusy(''); setProg(''); toast('生成了 ' + ok + ' 张' + (ok < missing.length ? '，剩下的没生成出来（没扣钻），可以再点一次或自己上传' : ''));
  };
  const row = (slot, note, kind) => {
    const url = slot === 'cover' ? p.cover : p.assets[slot]; const isImg = !['video', 'bgm'].includes(kind);
    const acc = kind === 'video' ? 'video/*' : kind === 'bgm' ? 'audio/*' : 'image/*';
    return <div className="pslot" key={kind + slot}>
      <div className="pthumb">{url ? (kind === 'video' ? <video src={url} muted /> : kind === 'bgm' ? <span>🎵</span> : <img src={url} alt="" />) : <span className="dim">缺</span>}</div>
      <div className="pslotb"><b>{slot}</b><small className="dim">{note}</small></div>
      <label className="pbtn sm">{busy === slot ? '处理中…' : url ? '换成自己的' : '上传自己的'}<input type="file" accept={acc} hidden onChange={e => up(slot, e.target.files[0])} /></label>
      {isImg && <button className="pbtn sm" disabled={!!busy} onClick={() => genOne(slot, note, kind)}>{url ? 'AI 重画' : 'AI 生成'} · 💎{imgPrice}</button>}
      {kind === 'video' && <button className="pbtn sm" disabled={!!busy} onClick={() => genVideo(slot, note)}>{busy === slot && vprog ? vprog : (url ? 'AI 重新生成' : 'AI 生成') + ' · 💎' + PRICE.video}</button>}
      {url && <button className="pbtn ghost sm" onClick={() => upd(x => { if (slot === 'cover') x.cover = ''; else delete x.assets[slot]; return x; })}>移除</button>}
    </div>;
  };
  const n = p.chapters.length, target = tier.target(n), have = imgSlots.length - missing.length;
  return (
    <div className="ppanel">
      <div className="pbox"><b>素材档位</b><p className="dim">按剧本里写的位置挂图：剧本里有几个 ⟦BG⟧ ⟦CG⟧，下面就列几个。先选一档，AI 写章时会按这一档安排背景和插图数量。</p>
        <div className="prow pwr">{Object.entries(TIERS).map(([k, t]) => <button key={k} className={'pbtn' + ((p.tier || 'std') === k ? ' primary' : '')} onClick={() => upd(x => (x.tier = k, x))}>{t.name}</button>)}</div>
        <p className="dim">{tier.name}：{tier.per}。{tier.tip} 这部 {n} 章，建议约 {target} 张图；现在剧本里有 {imgSlots.length} 个图片位置，已挂 {have} 张。</p>
      </div>
      <div className="pbox"><b>每张图两种方式：上传自己的，或 AI 生成</b><p className="dim">上传不扣钻。AI 生成每张 💎{imgPrice}，生成成功才扣；不满意可以「AI 重画」或换成自己的。{ready() ? '' : '（AI 生图接口还在接入，接好之后按钮直接能用。）'}</p>
        <button className="pbtn primary" disabled={!!busy} onClick={genAll}>{prog ? '生成中 ' + prog : '✨ 一键生成缺少的 ' + missing.length + ' 张 · 💎' + missing.length * imgPrice}</button></div>
      <h3>封面与人物立绘</h3>
      {row('cover', '发现页和首页卡片，竖版 3:4', 'cover')}
      {p.cast.filter(c => c.name).map(c => row('char_' + (c.key || c.name), c.name + ' 的立绘', 'char'))}
      <h3>背景（⟦BG⟧ · {S.bg.length}）</h3>{S.bg.map(s => row(s.slot, s.note, 'bg'))}
      <h3>心动插图（⟦CG⟧ · {S.cg.length}）</h3>{S.cg.map(s => row(s.slot, s.note, 'cg'))}
      <h3>视频（⟦VIDEO⟧ · {S.video.length}，可选）</h3>{S.video.map(s => row(s.slot, s.note, 'video'))}{row('opening_video', '开场视频（可选）：上传自己的（最长 1 分钟，前 10 秒免费，之后每 10 秒 💎1），或让 AI 用封面生成一段约 10 秒的', 'video')}
      {S.bgm.length > 0 && <><h3>自定义音乐（⟦BGM⟧ · {S.bgm.length}）</h3><p className="dim">MIRU 曲库里已有的提示词（tense / romantic / night…）不用上传。</p>{S.bgm.map(s => row('bgm_' + s.slot, s.slot, 'bgm'))}</>}
    </div>
  );
}

function Games({ p, upd }) {
  const [q, setQ] = useState(''), [ci, setCi] = useState(0), [busy, setBusy] = useState(false);
  const lib = useMemo(() => { try { return libList(P && P.MG100); } catch (_) { return []; } }, []);
  const shown = lib.filter(g => !q || (g.zh + g.en + (g.kw || []).join(' ')).toLowerCase().includes(q.toLowerCase())).slice(0, 80);
  /* 2026-11-27 每章 2 个小游戏：第 1 个放在章节前半段（避开选择块），第 2 个放在章末选择之前；已经有 2 个就替换（k=0 换第一个，否则换最后一个） */
  const place = (x, i, id, k) => {
    const c = x.chapters[i]; if (!c) return; const L = String(c.body).split('\n'); const line = '⟦MG|' + id + '⟧';
    const mg = L.map((l, j) => /^⟦MG\|[^⟧]*⟧$/.test(l.trim()) ? j : -1).filter(j => j >= 0);
    if (mg.length >= 2) { L[mg[k === 0 ? 0 : mg.length - 1]] = line; c.body = L.join('\n'); return; }
    const lastCh = (() => { for (let j = L.length - 1; j >= 0; j--) if (/^#\s*CHOICE/.test(L[j].trim())) return j; return -1; })();
    const end = lastCh > 0 ? lastCh : L.length;
    let at = end;
    if (k === 0) {
      at = Math.max(1, Math.floor(end * 0.45));
      let inCh = false; for (let j = 0; j < at; j++) { const t = L[j].trim(); if (/^#\s*CHOICE/.test(t)) inCh = true; else if (/^#\s*·\s*$/.test(t)) inCh = false; }
      while (inCh && at < end) { if (/^#\s*·\s*$/.test(L[at].trim())) { inCh = false; at++; break; } at++; }
      if (mg.length === 1 && mg[0] < at) at = end;
    }
    L.splice(at, 0, line); c.body = L.join('\n');
  };
  const stripMg = (x, i) => { const c = x.chapters[i]; if (c) c.body = String(c.body).split('\n').filter(l => !/^⟦MG\|[^⟧]*⟧$/.test(l.trim())).join('\n'); };
  const design = async () => {
    if (!p.chapters.some(c => c.body.trim())) return toast('先写剧本，AI 才能按剧情配游戏');
    if (!pay(PRICE.games, 'pro_games')) return; setBusy(true);
    try {
      const dig = p.chapters.map((c, i) => '## 第' + (i + 1) + '章 ' + c.t + '\n' + String(c.body).split('\n').filter(l => /[：:]/.test(l)).slice(0, 30).join('\n')).join('\n\n');
      const r = await ai('给这部互动恋爱剧的每一章配 2 个小游戏（同一章两个玩法不同，一个在前半段、一个在章末前），都必须是这一章剧情里「你」正在做的事。\n第一步：先看 MIRU 游戏库里有没有贴这一章剧情的现成游戏（下面的清单，编号=名字(触发词)），有就用 {"ch":章,"lib":"编号"}。\n第二步：库里没有贴的，再按剧情定制：题目和选项用这一章的具体人物、物件、台词。' + TPL_SPEC + '；zh 标题 ≤8 字；pz/pe/pj/pk/ps 是一句游戏说明（中/英/日/韩/西）。整部剧混用不同玩法，别都用同一种。\n只返回 JSON {"games":[{"ch":1,"lib":"g_xxx"},{"ch":1,"tpl":"","zh":"","en":"","ja":"","ko":"","es":"","pz":"","pe":"","pj":"","pk":"","ps":"", …该模板的字段（文字都是五语言数组）}]}（每章正好 2 条）\n\n【游戏库】' + libPrompt(lib) + '\n\n【剧本】\n' + dig.slice(0, 18000), 14000);
      const G = (r && r.games) || []; let nLib = 0, nNew = 0; const cnt = {};
      upd(x => {
        G.forEach(g => {
          const i = Number(g && g.ch) - 1; if (!x.chapters[i]) return;
          const k = cnt[i] || 0; if (k >= 2) return;
          const isLib = g.lib && lib.some(l => l.id === g.lib); const o = isLib ? null : checkGame(g); if (!isLib && !o) return;
          if (!k) stripMg(x, i); cnt[i] = k + 1;
          if (isLib) { place(x, i, g.lib, k); nLib++; return; }
          o.id = 'g_pro_' + x.id.slice(1, 9) + '_c' + (i + 1) + (k ? '_' + (k + 1) : '');
          x.games = (x.games || []).filter(y => y.id !== o.id).concat([o]); place(x, i, o.id, k); nNew++;
        });
        return x;
      });
      if (!nLib && !nNew) throw new Error('empty');
      toast('配好了：游戏库现成 ' + nLib + ' 个，按剧情定制 ' + nNew + ' 个（每章 2 个：一个在前半段、一个在章末选择之前，可以在剧本里挪位置）');
    } catch (_) { toast('这次没配出来，没扣钻'); try { P && (P.S.keys += PRICE.games, P.save()); } catch (__) {} }
    setBusy(false);
  };
  return (
    <div className="ppanel">
      <p className="dim">规范：每章 2 个小游戏（检查里少于 2 个会拦），放在剧情里「你」正在做这件事的地方，都可以跳过；游戏文字支持中、英、日、韩、西五种语言。MIRU 游戏库一共 912 个、53 种玩法：其中 {lib.length} 个是通用的现成游戏，任何剧都能直接用；其余是官方剧按自己剧情写的题，题面绑定那部剧的人物，不能原样搬，但它们的玩法可以换上你的剧情再用（现在开放 11 种纯文字玩法，找不同、拖拽定位这类要配专门图片的，等生图接口接好再开放）。</p>
      <div className="pbox"><b>AI 自动配（库里优先，没有合适的再定制）</b><p className="dim">AI 读完每一章：库里有贴剧情的现成游戏就直接用；没有的，用 11 种玩法（选一个 / 排顺序 / 分类 / 圈出可疑处 / 连线 / 找相同 / 心意选择 / 试开关 / 写约定 / 按住稳住 / 敲暗号）按这一章剧情定制，中英日韩西五种语言。</p><button className="pbtn primary" disabled={busy} onClick={design}>{busy ? '配游戏中…' : '✨ AI 给每章配 2 个小游戏 · 💎' + PRICE.games}</button></div>
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
const DRAFT_PRICE = n => 1;
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
  const fileRef = useRef();
  const load = async e => {
    const f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f) return;
    const ext = (f.name.split('.').pop() || '').toLowerCase();
    try {
      let t = '';
      if (['txt', 'md', 'markdown'].includes(ext)) t = await f.text();
      else if (ext === 'docx') { if (!P || typeof P.imDocx !== 'function') throw new Error('na'); t = await P.imDocx(await f.arrayBuffer()); }
      else if (ext === 'pdf') { if (!P || typeof P.imPdf !== 'function') throw new Error('na'); t = await P.imPdf(await f.arrayBuffer()); }
      else return toast('支持 .docx / .pdf / .txt / .md；老的 .doc 请先在 Word 里另存为 .docx');
      t = String(Array.isArray(t) ? t.join('\n') : t || '').trim(); if (!t) throw new Error('empty');
      setTxt(t); toast('已读入「' + f.name + '」：' + t.length + ' 字，看一眼没问题就点「识别成标准剧本」');
    } catch (_) { toast(P ? '这个文件读不出来（可能是扫描图片版），换成 .docx 或 .txt 试试' : '请在 MIRU 里打开才能读 Word / PDF'); }
  };
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
    <div className="pbox"><b>识别编剧稿</b><p className="dim">上传编剧稿（Word .docx / PDF / txt）或直接粘贴，编剧用自然中文写的稿子（第一幕、第二幕、图片标注、人物设定）都可以，AI 按章转成 MIRU 标准剧本：不改剧情、不删台词，只整理格式、补背景卡和章末选择。每次 💎1，转好才扣。</p>
      <div className="prow pwr"><button className="pbtn" onClick={() => fileRef.current.click()}>⇪ 上传编剧稿（Word / PDF / txt）</button><input ref={fileRef} type="file" accept=".docx,.pdf,.txt,.md,.markdown" hidden onChange={load} /><span className="dim">也可以直接粘贴到下面</span></div>
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
      const o = await ai(RULES().slice(0, 4000) + '\n\n你是 MIRU 的选题编辑，面向英语区女性向互动恋爱读者。分析这个选题，只写能从设定本身推出来的判断，不要编造数据、书名、作者或网址。只返回 JSON {"position":"一句话定位","audience":"目标读者","promise":"体验承诺（玩家会感受到什么）","tropes":["核心母题/梗 3-6 个"],"hooks":["前三章的钩子 3 个"],"twists":["中后段反转方向 2-3 个"],"risks":["容易写崩或踩线的地方 2-4 个"],"motifs":[{"name":"母题卡名","use":"在剧里怎么用"}]}\n剧名：' + p.title + '\n钩子：' + p.hook + '\n设定：' + p.premise + '\n玩家身份：' + p.you + (p.idea ? '\n作者原始想法（最高优先：人物数量、身份和核心关系必须与它一致）：' + String(p.idea).slice(0, 300) : '') + '\n人物：' + p.cast.map(c => c.name + '（' + c.identity + '）').join('；'), 3000);
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
  /* 2026-11-28 创作者协议：发布前必须勾选同意（协议全文 /creator-terms.html，版本 2）；同意记录跟作品一起上传 pack.meta.original */
  const [agree, setAgree] = useState(p.agreed === 2), [terms, setTerms] = useState(false);
  const price = 1;
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
    if (!agree) return toast('请先勾选同意《MIRU 创作者协议》');
    const tk = token(); if (!tk) return toast('请先在 MIRU 登录');
    const stale = langs.filter(l => !(p.tr && p.tr[l]) || p.tr[l].src !== script.length);
    if (stale.length && !window.__proForce) { window.__proForce = 1; return toast('这些语言版本还没翻译或剧本改过了：' + stale.map(l => LN[l]).join('、') + '。再点一次「发布」就先不带这些版本发布'); }
    window.__proForce = 0; setBusy('pub');
    const pack = { script, assets: Object.assign({}, p.assets, p.cover ? { cover: p.cover } : {}), characters: p.cast.filter(c => c.name).map((c, i) => ({ key: (c.key && /^[a-z0-9_]+$/.test(c.key) ? c.key : 'c' + (i + 1)), name: c.name, gender: c.gender, age: Number(c.age) || 21, identity: c.identity, looks: c.looks, personality: c.personality, speech: c.speech, boundary: c.boundary, openingLine: c.openingLine, sellingPoint: c.sellingPoint, portrait: p.assets['char_' + (c.key || c.name)] || '' })), games: p.games || [], opening_video: p.assets.opening_video || undefined, ver: Date.now(), meta: { langs: [p.lang].concat(langs.filter(l => p.tr && p.tr[l] && p.tr[l].src === script.length)), premise: p.premise, you: p.you, studio: 'pro', original: { v: 2, at: new Date().toISOString() } } };
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
      <p className="dim">英文版默认就有。翻译是整部剧逐行翻（台词、选项、场景名、人物卡、小游戏说明），和原文一行对一行，App 按读者的语言显示。每种语言 💎{price}，翻好才扣；剧本改过之后要重翻。</p>
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
      <div style={{ margin: '14px 0 12px', padding: '12px 14px', border: '1px solid rgba(255,255,255,.14)', borderRadius: 12, fontSize: 13.5, lineHeight: 1.7 }}>
        <b>创作者协议与原创声明</b>
        <ul style={{ margin: '6px 0 8px', paddingLeft: 18 }}>
          <li>作品的著作权归你；你授权 MIRU 在平台内展示、分发并用于宣传（非独占，你可以随时删除作品）。</li>
          <li>你保证作品是你原创或已获得合法授权，没有抄袭、搬运，不侵犯他人权利；如有侵权由你本人承担责任，MIRU 有权下架。</li>
          <li>所有角色必须是虚构的成年人，不含露骨色情等违规内容。</li>
        </ul>
        <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', cursor: 'pointer' }}><input type="checkbox" checked={agree} style={{ marginTop: 4 }} onChange={e => { const v = e.target.checked; setAgree(v); upd(x => { x.agreed = v ? 2 : 0; return x; }); }} /><span>我已阅读并同意 <button type="button" onClick={e => { e.preventDefault(); setTerms(true); }} style={{ background: 'none', border: 0, padding: 0, color: '#F0B77E', font: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}>《MIRU 创作者协议》</button></span></label>
      </div>
      {terms && <div style={{ position: 'fixed', inset: 0, zIndex: 99998, background: 'rgba(8,6,12,.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }} onClick={() => setTerms(false)}>
        <div style={{ width: '100%', maxWidth: 720, height: '88vh', background: '#0C0B10', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 8 }}><button className="pbtn sm" onClick={() => setTerms(false)}>✕ 关闭</button></div>
          <iframe title="creator-terms" src="/creator-terms.html#zh" style={{ flex: 1, border: 0, width: '100%' }} />
        </div>
      </div>}
      <button className="pbtn primary big" disabled={busy === 'pub'} onClick={publish}>{busy === 'pub' ? '发布中…' : p.cloudId ? '🌐 更新已发布的作品' : '🌐 发布到 MIRU'}</button>
      <div className="prow pwr" style={{ marginTop: 12 }}>
        <button className="pbtn" onClick={() => { const b = new Blob([script], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = (p.title || 'script') + '.md'; a.click(); }}>⇩ 下载剧本 .md</button>
      </div>
      {res && <div className="pbox"><b>{res.status === 'live' ? '已上线' : '审核中'}</b><p className="dim">作品 ID：{res.id}{res.qa && res.qa.assets ? ' · 素材覆盖：背景 ' + res.qa.assets.coverage.bg.have + '/' + res.qa.assets.coverage.bg.total + '，插图 ' + res.qa.assets.coverage.cg.have + '/' + res.qa.assets.coverage.cg.total : ''}</p>{res.qa && res.qa.warn && res.qa.warn.length > 0 && <ul className="pqa">{res.qa.warn.slice(0, 8).map((s, i) => <li key={i} className="y">{s}</li>)}</ul>}</div>}
    </div>
  );
}
