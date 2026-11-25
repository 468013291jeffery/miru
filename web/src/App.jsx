import React, { useEffect, useMemo, useState } from 'react';
import { api, session } from './api.js';
import Pro from './Pro.jsx';

/* MIRU Studio（React）：创作者看自己发布的作品——状态、播放、点赞、语言、发布检查结果。
   第一个用 React 写的页面；之后的新页面都放在 web/ 里，和主站老代码分开。 */
const T = {
  zh: { title: '我的作品', sub: '你发布到 MIRU 的互动剧', gems: '钻石', empty: '还没有发布作品。去「创作」页用 AI 引导创作写第一部吧。', login: '请先在 MIRU 登录，再打开这个页面。',
        plays: '播放', likes: '点赞', langs: '语言', status: { live: '已上线', pending: '审核中', rejected: '未通过', takedown: '已下架' }, back: '回到 MIRU', qa: '发布检查', ok: '通过', issues: '个问题', all: '全部', open: '打开' },
  en: { title: 'My stories', sub: 'Interactive stories you published on MIRU', gems: 'Gems', empty: "You haven't published a story yet. Use the AI creator in the Create tab to write your first one.", login: 'Sign in on MIRU first, then open this page again.',
        plays: 'plays', likes: 'likes', langs: 'Languages', status: { live: 'Live', pending: 'In review', rejected: 'Rejected', takedown: 'Taken down' }, back: 'Back to MIRU', qa: 'Publish check', ok: 'passed', issues: 'issues', all: 'All', open: 'Open' }
};
const LANG = { en: 'EN', zh: '中', ja: '日', ko: '한', es: 'ES' };

/* #pro → MIRU Studio Pro（官方标准剧本编辑器）；其他 → 我的作品 */
export default function App() { return /^#pro/.test(location.hash) ? <Pro /> : <Works />; }

function Works() {
  const { token, lang } = session();
  const t = T[lang === 'zh' ? 'zh' : 'en'];
  const [works, setWorks] = useState(null), [gems, setGems] = useState(null), [err, setErr] = useState(''), [tab, setTab] = useState('all');
  useEffect(() => {
    if (!token) return;
    api('/works?mine=1').then(j => setWorks(j.works || [])).catch(e => setErr(e.status === 401 ? t.login : String(e.message)));
    api('/wallet').then(j => setGems(j.gems)).catch(() => {});
  }, [token]);
  const shown = useMemo(() => (works || []).filter(w => tab === 'all' || w.status === tab), [works, tab]);
  const counts = useMemo(() => (works || []).reduce((m, w) => (m[w.status] = (m[w.status] || 0) + 1, m), {}), [works]);
  return (
    <div className="wrap">
      <header>
        <a className="back" href="/">‹ {t.back}</a>
        <h1>{t.title}</h1>
        <p className="sub">{t.sub}</p>
        {gems != null && <span className="gem">💎 {gems} <small>{t.gems}</small></span>}
      </header>
      {!token && <p className="note">{t.login}</p>}
      {err && <p className="note">{err}</p>}
      {works && works.length > 0 && (
        <nav className="tabs">
          {['all', 'live', 'pending', 'rejected'].map(k => (
            <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{k === 'all' ? t.all : t.status[k]} <b>{k === 'all' ? works.length : counts[k] || 0}</b></button>
          ))}
        </nav>
      )}
      {works && works.length === 0 && <p className="note">{t.empty}</p>}
      <ul className="grid">
        {shown.map(w => {
          const errs = (w.qa && w.qa.err && w.qa.err.length) || 0;
          return (
            <li key={w.id} className="card">
              <div className="cover" style={w.cover ? { backgroundImage: `url(${w.cover})` } : null}><span className={'st ' + w.status}>{t.status[w.status] || w.status}</span></div>
              <div className="body">
                <h3>{w.title}</h3>
                <p className="hook">{w.hook}</p>
                <p className="meta">▶ {w.plays || 0} {t.plays} · ♥ {w.likes || 0} {t.likes}</p>
                {Array.isArray(w.langs) && <p className="meta">{t.langs}: {w.langs.map(l => LANG[l] || l).join(' · ')}</p>}
                <p className={'qa ' + (errs ? 'bad' : 'good')}>{t.qa}: {errs ? errs + ' ' + t.issues : t.ok}</p>
                {(w.tags || []).length > 0 && <p className="tags">{w.tags.slice(0, 6).map(x => <span key={x}>{x}</span>)}</p>}
                <a className="open" href="/">{t.open} ›</a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
