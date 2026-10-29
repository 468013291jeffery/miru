// 官方剧本的自动审查（D先生）—— 纯函数，服务端跑，也可以被 admin.html 的按钮触发。
//
// 为什么要有它：官方剧的 publish 路径原来只查两件事 ——「有章节」和「有人点了审改通过」，
// 而结构对不对**没人看**（浏览器里那套 R.check 查的是写作规则，不查"能不能播"）。
// 这里补的就是那一格：**结构上播不出来的东西**。
//
// 只查这几类（都能从文本直接判定，不需要渲染）：
//   章 / 场景 / 选择 / 「# ·」收尾 / 指令闭包 / 未知指令 / 「你：」
// 露骨与未成年**不在这里**：那由 api/_lib.js 的 safety() 管，publish 时会再跑一次。
//
// 口径来源：解析器在 source/src/app51_import.js（imParse）+ app90_youturn.js + app94_official2.js。
// 这份只做行级检查，不重实现解析 —— 想验"真的能播"，仍然要用 App 那份解析器跑一遍。

// 2026-10-29：⟦SET⟧ / ⟦IF⟧⟦ELSE⟧⟦/IF⟧ / ⟦OPT⟧ 进了剧本语法（运行时 app16_story2.js:27-28 与 app14_pack.js:471/233 早就支持），
// 这里必须同步认它们，否则审查会把合法的留痕/条件/选项效果句报成「未知指令」并挡住上线。
const KNOWN = new Set(['CHAR', 'BGM', 'TIME', 'BG', 'CG', 'VIDEO', 'PHOTO', 'MG', 'FREE', 'CALL', '/CALL', 'ITEM', 'SET', 'IF', 'ELSE', '/IF', 'OPT', 'GOAL', 'SECRET', 'REVEAL']);
const RE_DIR = /^⟦([A-Z/]+)((?:\|[^|⟧]*)*)⟧$/;

function dslQA(md) {
  const text = String(md || '').replace(/\r\n?/g, '\n');
  const L = text.split('\n').map(s => s.trim());
  const st = { chapters: 0, scenes: 0, choices: 0, options: 0, dots: 0, you: 0, casts: 0, lines: 0, callsOpen: 0, callsClose: 0, ifs: 0, ifEnds: 0, unknown: [] };
  const perCh = [];
  let cur = null;
  const closeCh = () => { if (cur) perCh.push(cur); };
  for (const raw of L) {
    if (!raw) continue;
    if (/^#+\s*CHAPTER\s+\d+/i.test(raw)) { closeCh(); cur = { t: raw.replace(/^#+\s*/, '').slice(0, 60), choices: 0, dots: 0, scenes: 0, lines: 0 }; st.chapters++; continue; }
    if (/^#\s*SCENE/i.test(raw)) { st.scenes++; if (cur) cur.scenes++; continue; }
    if (/^#\s*CHOICE/i.test(raw)) { st.choices++; if (cur) cur.choices++; continue; }
    if (/^#{1,6}\s*[A-D]\s*[｜|]/.test(raw)) { st.options++; continue; }
    if (/^#\s*·\s*$/.test(raw)) { st.dots++; if (cur) cur.dots++; continue; }
    if (/^(你|您|You)\s*[:：]/.test(raw)) { st.you++; continue; }
    if (raw.charAt(0) === '⟦') {
      const m = raw.match(RE_DIR);
      if (!m || !KNOWN.has(m[1])) { st.unknown.push(raw.slice(0, 24)); continue; }
      if (m[1] === 'CALL') st.callsOpen++;
      else if (m[1] === '/CALL') st.callsClose++;
      else if (m[1] === 'CHAR') st.casts++;
      else if (m[1] === 'IF') st.ifs++;
      else if (m[1] === '/IF') st.ifEnds++;
      continue;
    }
    st.lines++;
    if (cur) cur.lines++;
  }
  closeCh();

  const err = [], warn = [];
  if (!st.chapters) err.push('没有章节：找不到「# CHAPTER 1｜…」这样的标记');
  if (st.unknown.length) err.push('有 ' + st.unknown.length + ' 条不认识的 ⟦…⟧ 指令（会原样显示给玩家）：' + st.unknown.slice(0, 3).join(' / '));
  if (st.callsOpen !== st.callsClose) err.push('⟦CALL⟧ 与 ⟦/CALL⟧ 数量不等（' + st.callsOpen + ' / ' + st.callsClose + '）—— 没闭合的那一通会把后面的内容全吞掉');
  if (st.ifs !== st.ifEnds) warn.push('⟦IF⟧ 与 ⟦/IF⟧ 数量不等（' + st.ifs + ' / ' + st.ifEnds + '）—— 没闭合的条件块会按内容平铺播出（不丢字，但条件失效）');
  perCh.forEach((c, i) => {
    const n = i + 1;
    if (!c.scenes) warn.push('第 ' + n + ' 章没有 SCENE（没有背景卡）');
    if (!c.choices) err.push('第 ' + n + ' 章章末没有 CHOICE —— 这一章结尾只会显示「继续」');
    if (c.dots < c.choices) err.push('第 ' + n + ' 章：CHOICE ' + c.choices + ' 道，却只有 ' + c.dots + ' 个「# ·」收尾（少收尾会让后面的场景算进最后一个选项）');
    if (c.lines < 3) warn.push('第 ' + n + ' 章正文只有 ' + c.lines + ' 行');
  });
  if (!st.you) warn.push('正文里没有「你：…」—— 系统只能把说话最多的角色当成玩家（实测 danger→卢西恩、moon→凯尔）');
  if (st.options < st.choices * 2) warn.push('选项数 ' + st.options + ' 少于选择道数 ' + st.choices + ' 的两倍 —— 可能有选择题只剩 1 个选项');
  if (!st.casts) warn.push('没有 ⟦CHAR⟧ 角色卡 —— 演员表只能从台词里猜');

  return { ok: !err.length, err, warn, stats: st, perCh: perCh.map((c, i) => ({ n: i + 1, choices: c.choices, dots: c.dots, scenes: c.scenes, lines: c.lines })) };
}

module.exports = { dslQA, KNOWN_DIRECTIVES: KNOWN };
