/* 小游戏：游戏库优先 + 按剧情定制。
   游戏库 912 个 = 53 种玩法模板。其中 15 种通用玩法（132 个现成游戏：找东西、翻牌、保险箱、心跳同步、拆弹……）不带剧情内容，任何剧都能直接用；
   其余是官方剧按自己剧情写的题，题面绑定那部剧的人物，不能原样搬，但它们的「玩法模板」可以换上新剧情再用。
   能纯文字换内容的模板有 11 种（下面 TPL_NAME）；找不同、拖拽定位、旋转画面这类要配专门图片和坐标，等生图接口接好再开放。 */
export const TPL_NAME = { m111_pick: '选一个', m111_order: '排顺序', m111_classify: '分类', m111_mark: '圈出可疑处', m111_match: '连线配对', m111_pair: '找相同', m112_free: '心意选择', m111_device: '试开关', m111_deal: '写约定', m111_hold: '按住稳住', m111_morse: '敲暗号' };
export const LANG5 = '五种语言：所有给玩家看的文字都写成 [中文, English, 日本語, 한국어, Español] 五个元素的数组（下面写作 [中,英]，实际都要五种）；标题写 zh/en/ja/ko/es 五个字段，说明写 pz（中）/pe（英）/pj（日）/pk（韩）/ps（西）五个字段';
export const TPL_SPEC = LANG5 + '。tpl 只能用：m111_pick（选一个，ask=[中,英]，items 3-4 个，ans=正确下标）/ m111_order（items 按正确顺序给，游戏会打乱）/ m111_classify（bins 2-3 个分类，items=[[[中,英],分类下标]]）/ m111_mark（圈出可疑的一处，ask，items 4 个，ans=[下标]）/ m111_match（items=[[[左中,左英],[右中,右英]]] 正确配对）/ m111_pair（找出相同的两个，items，pair=[i,j]）/ m112_free（没有标准答案的心意选择，ask，items）/ m111_device（试开关：controls=[[[选项中,英],是否正确true/false,[点了之后的反馈中,英]]] 3-4 个，正好 1 个 true）/ m111_deal（写约定，没有标准答案：groups=[[[问题中,英],[[选项中,英],…]]] 2-4 组）/ m111_hold（按住稳住：label=[中,英]，need=3-6 秒）/ m111_morse（敲暗号：label=[中,英]，code 用 . 和 - 写，3-6 位）';
export const GENERIC = /^(find|memory|code|rhythm|hold|whack|wires|slide|simon|scratch|dice|order|catch|balance|quiz)$/;
const S2 = x => String(x == null ? '' : x).trim();
/* 2026-11-27 小游戏五语言：每段文字 [中文, English, 日本語, 한국어, Español]，至少要有中英；日韩西缺了播放时用英文 */
const bi = x => Array.isArray(x) && x.length >= 2 && S2(x[0]) && S2(x[1]) ? x.slice(0, 5).map((v, i) => S2(v).slice(0, i ? 140 : 80)) : null;
export function checkGame(g) {
  const T = g && g.tpl; if (!TPL_NAME[T]) return null;
  const o = { tpl: T, seconds: 40, zh: S2(g.zh).slice(0, 16), en: S2(g.en || g.zh).slice(0, 40), pz: S2(g.pz).slice(0, 140), pe: S2(g.pe).slice(0, 220), a: '', b: '', kw: [] };
  if (!o.zh || !o.pz) return null; if (!o.pe) o.pe = o.pz;
  ['ja', 'ko', 'es'].forEach(l => { if (S2(g[l])) o[l] = S2(g[l]).slice(0, 40); }); [['pj', 'ja'], ['pk', 'ko'], ['ps', 'es']].forEach(([k]) => { if (S2(g[k])) o[k] = S2(g[k]).slice(0, 220); });
  const items = Array.isArray(g.items) ? g.items : [];
  if (T === 'm111_pick' || T === 'm111_mark' || T === 'm112_free') {
    o.ask = bi(g.ask) || [o.pz.slice(0, 40), o.pe.slice(0, 80)]; o.items = items.map(bi).filter(Boolean).slice(0, 4); if (o.items.length < 3) return null;
    const a = Number(Array.isArray(g.ans) ? g.ans[0] : g.ans);
    if (T === 'm111_pick') { if (!(a >= 0 && a < o.items.length)) return null; o.ans = a; }
    if (T === 'm111_mark') { if (!(a >= 0 && a < o.items.length)) return null; o.ans = [a]; }
  } else if (T === 'm111_order') { o.items = items.map(bi).filter(Boolean).slice(0, 5); if (o.items.length < 3) return null; }
  else if (T === 'm111_pair') { o.items = items.map(bi).filter(Boolean).slice(0, 4); const pr = (g.pair || []).map(Number); if (o.items.length < 3 || pr.length !== 2 || pr[0] === pr[1] || pr.some(x => !(x >= 0 && x < o.items.length))) return null; o.pair = pr; }
  else if (T === 'm111_classify') { o.bins = (g.bins || []).map(bi).filter(Boolean).slice(0, 3); if (o.bins.length < 2) return null; o.items = items.map(x => Array.isArray(x) && bi(x[0]) && Number(x[1]) >= 0 && Number(x[1]) < o.bins.length ? [bi(x[0]), Number(x[1])] : null).filter(Boolean).slice(0, 4); if (o.items.length < 3) return null; }
  else if (T === 'm111_match') { o.items = items.map(x => Array.isArray(x) && bi(x[0]) && bi(x[1]) ? [bi(x[0]), bi(x[1])] : null).filter(Boolean).slice(0, 4); if (o.items.length < 3) return null; }
  else if (T === 'm111_device') { o.controls = (g.controls || []).map(x => Array.isArray(x) && bi(x[0]) ? [bi(x[0]), x[1] === true || x[1] === 'true', bi(x[2]) || ['', '']] : null).filter(Boolean).slice(0, 4); if (o.controls.length < 3 || o.controls.filter(x => x[1]).length !== 1) return null; }
  else if (T === 'm111_deal') { o.groups = (g.groups || []).map(x => Array.isArray(x) && bi(x[0]) && Array.isArray(x[1]) ? [bi(x[0]), x[1].map(bi).filter(Boolean).slice(0, 4)] : null).filter(x => x && x[1].length).slice(0, 4); if (o.groups.length < 2) return null; o.seconds = 60; }
  else if (T === 'm111_hold') { o.label = bi(g.label) || [o.pz, o.pe]; o.need = Math.max(3, Math.min(6, Number(g.need) || 4)); }
  else if (T === 'm111_morse') { o.label = bi(g.label) || [o.pz, o.pe]; o.code = String(g.code || '').replace(/[^.-]/g, '').slice(0, 6); if (o.code.length < 3) return null; }
  return o;
}
export function libList(MG) { return (MG || []).filter(g => g && g.id && /^g_/.test(g.id) && GENERIC.test(g.tpl)); }
/* 发给 AI 的游戏库清单：编号 + 名字 + 触发词，让它先在库里挑贴剧情的 */
export function libPrompt(lib) { return lib.map(g => g.id + '=' + g.zh + (g.kw && g.kw.length ? '(' + g.kw.slice(0, 3).join('/') + ')' : '')).join('；'); }
