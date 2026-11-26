import React, { useEffect, useState } from 'react';
import './pro.css';

/* 后台 · 待精选（/web/dist/#feat）
   用后台登录（admin.html 存的 miru_admin_tok）。列出系统自动算出的候选用户作品，每条显示四项门槛是否达标；
   点「通过」= 设为精选（和后台作品详情里的「设为推荐」是同一个操作）。影视版进官方视频排，插画 / 轻读进「创作者精选」。 */
const tok = () => { try { return localStorage.getItem('miru_admin_tok') || ''; } catch (_) { return ''; } };
const LANE = { film: '精选·影视', illus: '精选·插画' };
const FMT = { film: '🎬 影视', illus: '🖼 插画', lite: '📖 轻读' };
const CK = [['script', '剧本'], ['assets', '素材'], ['games', '小游戏'], ['data', '读者数据']];

export default function Feat() {
  const [d, setD] = useState(null), [err, setErr] = useState(''), [minPlays, setMin] = useState(200), [busy, setBusy] = useState('');
  const load = async () => {
    setErr('');
    try {
      const r = await fetch('/api/works?candidates=1&min_plays=' + minPlays, { headers: { Authorization: 'Bearer ' + tok() } });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(r.status === 403 || r.status === 401 ? '请先在后台（admin.html）登录，再打开这个页面' : (j.error || r.status));
      setD(j);
    } catch (e) { setErr(String(e.message || e)); }
  };
  useEffect(() => { load(); }, []);
  const act = async (id, op) => {
    setBusy(id);
    try {
      const r = await fetch('/api/admin?r=work', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tok() }, body: JSON.stringify({ id, op }) });
      if (!r.ok) throw new Error(String(r.status));
      await load();
    } catch (e) { alert('操作失败：' + e.message); }
    setBusy('');
  };
  const Row = ({ w, featured }) => (
    <li style={{ cursor: 'default', alignItems: 'flex-start' }}>
      <div className="pthumb" style={w.cover ? { backgroundImage: 'url(' + w.cover + ')', backgroundSize: 'cover' } : null}>{!w.cover && <span className="dim">无封面</span>}</div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <b>{w.title}</b>
        <span className="dim">{w.author} · {FMT[w.format] || FMT.lite} · ▶ {w.plays} · ♥ {w.likes}（{w.rate}%）{w.qscore != null ? ' · 审稿 ' + w.qscore : ''} · {w.media ? '图 ' + w.media.img + ' / 视频 ' + w.media.vid + ' / ' + w.media.ch + ' 章 / 小游戏 ' + w.media.games : '还没有素材统计（老作品，重新发布后才有）'}</span>
        <div className="prow pwr">{CK.map(([k, t]) => <span key={k} className={'tag ' + (w.checks[k] ? 'ok' : 'bad')}>{w.checks[k] ? '✓' : '✗'} {t}</span>)}<span className="tag">{LANE[w.lane]}</span></div>
      </div>
      {featured ? <button className="pbtn sm" disabled={busy === w.id} onClick={() => act(w.id, 'unfeature')}>取消精选</button>
        : <button className={'pbtn sm' + (w.pass ? ' primary' : '')} disabled={busy === w.id} onClick={() => act(w.id, 'feature')}>{w.pass ? '通过' : '仍然通过'}</button>}
    </li>
  );
  return (
    <div className="pro">
      <header className="phead"><div><span className="eyebrow">MIRU 后台</span><h1>待精选</h1><p className="dim">系统每次打开时按四项门槛算一遍：剧本没有必改问题（有 AI 审稿分的要 ≥80）、图片位置基本挂齐、每章有小游戏、读者数和点赞率达标。视频只决定进哪条道：影视版进官方视频排，插画 / 轻读进「创作者精选」。点「通过」才真正上精选。</p></div></header>
      <div className="prow pwr"><label className="pf" style={{ maxWidth: 220 }}><span>读者数门槛</span><input type="number" value={minPlays} onChange={e => setMin(Number(e.target.value) || 0)} /></label><button className="pbtn" onClick={load}>重新计算</button>{d && <span className="dim">平均点赞率 {d.avgRate}%</span>}</div>
      {err && <p className="note">{err}</p>}
      {d && <>
        <h3>候选（{d.works.filter(w => w.pass).length} 部全部达标 / 共 {d.works.length} 部）</h3>
        {!d.works.length && <p className="note">还没有上线的用户作品。</p>}
        <ul className="plist">{d.works.map(w => <Row key={w.id} w={w} />)}</ul>
        <h3>已精选（{d.featured.length}）</h3>
        <ul className="plist">{d.featured.map(w => <Row key={w.id} w={w} featured />)}</ul>
      </>}
    </div>
  );
}
