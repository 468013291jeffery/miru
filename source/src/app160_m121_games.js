/* M121 minigames. New widget types on the shared MG100 player: match, order, pick, sort, place, audio, schedule, cards. */
(function (root) {
  'use strict';
  const BOARDS = [
    { id: 'M121_C01_MG01', scene: 'C01_S02', widget: 'match', name_zh: '四人的小动作', name_en: 'Read the Room', art: 'BG_C01_S02', prompt: '把每件小事连到做这件事的人。', pairs: [['毛巾', 'Luca'], ['座位', 'Sebastian'], ['幽默', 'Julian'], ['姓名卡', 'Ryan']] },
    { id: 'M121_C01_MG02', scene: 'C01_S03', widget: 'pick', name_zh: '收音频道核对', name_en: 'Check the Mic Channels', art: 'BG_C01_S03', prompt: '选出该做的那一步。不要删日志。', options: [['log', '红灯频道，请求登记册'], ['del', '删除日志'], ['ignore', '当没看见']], correct: ['log'] },
    { id: 'M121_C02_MG01', scene: 'C02_S02', widget: 'order', name_zh: '海上路线', name_en: 'Safe Paddle Route', art: 'BG_C02_S02', prompt: '按安全顺序排这三步。', steps: ['先检查潮线', '避开红浮标', '返回码头'] },
    { id: 'M121_C02_MG02', scene: 'C02_S03', widget: 'sort', name_zh: '赞助授权拆分', name_en: 'Separate the Release', art: 'BG_C02_S03', prompt: '把两段影像放进不同的合同框。', buckets: ['运动授权', '未经授权'], cards: [{ label: '康复训练', bucket: '运动授权' }, { label: '私下约会', bucket: '未经授权' }] },
    { id: 'M121_C03_MG01', scene: 'C03_S02', widget: 'match', name_zh: '香草与味道', name_en: 'Choose the Herbs', art: 'BG_C03_S02', prompt: '把香草配到合适的菜。', pairs: [['柠檬百里香', '烤鱼'], ['罗勒', '意面'], ['薄荷', '饮品']] },
    { id: 'M121_C03_MG02', scene: 'C03_S03', widget: 'order', name_zh: '提前印好的日期', name_en: 'The Printed Date', art: 'BG_C03_S03', prompt: '按时间先后排这三张纸。', steps: ['底片拍摄', '宣传计划', '节目邀约'] },
    { id: 'M121_C04_MG01', scene: 'C04_S02', widget: 'place', name_zh: '别针安全盒', name_en: 'Pin Safety Box', art: 'BG_C04_S02', prompt: '按顺序点。不要徒手抓针尖。', sequence: ['用磁盒捡针', '点检数量'], trap: '徒手抓锐端' },
    { id: 'M121_C04_MG02', scene: 'C04_S03', widget: 'pick', name_zh: '剧照与宣传图比对', name_en: 'Spot the Altered Still', art: 'BG_C04_S03', prompt: '标出被加进去的那一块。', options: [['logo', '原片左侧的公关标志'], ['sea', '背景海面'], ['face', '人物的脸']], correct: ['logo'] },
    { id: 'M121_C05_MG01', scene: 'C05_S02', widget: 'link', name_zh: '利益冲突标注', name_en: 'Mark the Conflicts', art: 'BG_C05_S02', prompt: '把人和他真正负责的事连上。', pairs: [['Sebastian', '度假村少数股权'], ['Naomi', '节目制作'], ['Ada', '独立法律']] },
    { id: 'M121_C05_MG02', scene: 'C05_S04', widget: 'place', name_zh: '距离与许可', name_en: 'Distance and Permission', art: 'BG_C05_S04', prompt: '按这个顺序靠近。', sequence: ['保持一臂距离', '先问', '等你回答'] },
    { id: 'M121_C06_MG01', scene: 'C06_S02', widget: 'schedule', name_zh: '约会安排表', name_en: 'Edit the Date Card', art: 'BG_C06_S02', prompt: '拿掉名次，留下一个可以自己选的空位。', remove: '名次标签', keep: '自选空位', ban: '强制双人' },
    { id: 'M121_C06_MG02', scene: 'C06_S03', widget: 'audio', name_zh: '被剪掉的停顿', name_en: 'The Missing Pause', art: 'BG_C06_S03', prompt: '选出还留着完整停顿的那一条。', tracks: [['full', '原始声轨，停顿还在', [2, 8, 2, 2, 8, 3]], ['cut', '剪短的停顿', [6, 6, 6, 2, 6]], ['gone', '停顿被删掉', [8, 8, 8, 8]]] , correct: 'full' },
    { id: 'M121_C07_MG01', scene: 'C07_S02', widget: 'order', name_zh: '安全频道封存', name_en: 'Seal the Safety Channel', art: 'BG_C07_S02', prompt: '按封存步骤排。', steps: ['停止收音', '记录设备时间', '双人封签'] },
    { id: 'M121_C07_MG02', scene: 'C07_S03', widget: 'place', name_zh: '客厅安全区', name_en: 'A Dry Common Area', art: 'BG_C07_S03', prompt: '灯该放在哪里。', zones: [['dry', '干燥的公共区域'], ['door', '出口前面'], ['wet', '潮湿的角落']], correct: 'dry' },
    { id: 'M121_C08_MG01', scene: 'C08_S02', widget: 'pick', name_zh: '重建镜头角度', name_en: 'Rebuild the Camera Angle', art: 'BG_C08_S02', prompt: '三件都要留下。', options: [['cam', '原机位'], ['frame', '完整画幅'], ['slate', '保留标记板'], ['crop', '裁掉标记板']], correct: ['cam', 'frame', 'slate'] },
    { id: 'M121_C08_MG02', scene: 'C08_S03', widget: 'sort', name_zh: '我的回应范围', name_en: 'What Can Be Public', art: 'BG_C08_S03', prompt: '哪些能公开，哪些不能。', buckets: ['可以公开', '不公开'], cards: [{ label: '节目更正事实', bucket: '可以公开' }, { label: '未经许可的亲密细节', bucket: '不公开' }] },
    { id: 'M121_C09_MG01', scene: 'C09_S02', widget: 'order', name_zh: '训练计划卡', name_en: 'Training Plan', art: 'BG_C09_S02', prompt: '强度之后要有恢复。', steps: ['强度训练', '理疗', '休息'] },
    { id: 'M121_C09_MG02', scene: 'C09_S03', widget: 'pick', name_zh: '股权条款核验', name_en: 'Check the Equity Clause', art: 'BG_C09_S03', prompt: '两栏都要核对。', options: [['stake', 'Sebastian 持股栏'], ['vote', '回避节目投票栏'], ['title', '只看标题']], correct: ['stake', 'vote'] },
    { id: 'M121_C10_MG01', scene: 'C10_S02', widget: 'pick', name_zh: '菜单里的偏好', name_en: 'Menu Preferences', art: 'BG_C10_S02', prompt: '两件都要做。', options: [['side', '辣酱单独盛'], ['ask', '先问有没有过敏'], ['mix', '辣酱直接拌进主菜']], correct: ['side', 'ask'] },
    { id: 'M121_C10_MG02', scene: 'C10_S03', widget: 'order', name_zh: '无条件的道歉', name_en: 'An Apology With No Price', art: 'BG_C10_S03', prompt: '把这三句排成一句道歉。', steps: ['我错在哪里', '我会怎么做', '你不必原谅'] },
    { id: 'M121_C11_MG01', scene: 'C11_S02', widget: 'place', name_zh: '耳返实体静音', name_en: 'Hard Mute', art: 'BG_C11_S02', prompt: '先拨开关，再看灯。', sequence: ['拨到静音', '确认指示灯灭了'], trap: '保持开启' },
    { id: 'M121_C11_MG02', scene: 'C11_S03', widget: 'link', name_zh: '承诺与交换', name_en: 'Promise or Pressure', art: 'BG_C11_S03', prompt: '哪句话是自主，哪句话是压力。', pairs: [['愿意等，不要求马上答复', '自主'], ['用公开选择换曝光', '压力']] },
    { id: 'M121_C12_MG01', scene: 'C12_S02', widget: 'match', name_zh: '最后的钥匙', name_en: 'The Last Keys', art: 'BG_C12_S02', prompt: '每样东西还给该拿的人。', pairs: [['钥匙', '物业'], ['围裙', 'Luca'], ['道具', '摄制组']] },
    { id: 'M121_C12_MG02', scene: 'C12_S03', widget: 'cards', name_zh: '真实约会协议', name_en: 'A Real Date Agreement', art: 'BG_C12_S03', prompt: '四项都写明，或者选择独身。', required: ['exclusive', 'cadence', 'boundary', 'renegotiate'], clauses: [['exclusive', '是否排他'], ['cadence', '联系频率'], ['boundary', '边界'], ['renegotiate', '可以重新谈']] }
  ];
  function listsEqual(a, b) { return JSON.stringify(a || []) === JSON.stringify(b || []); }
  function grade(board, answer) {
    const got = answer || {};
    if (board.widget === 'match' || board.widget === 'link') {
      const want = board.pairs.map(p => p[0] + '>' + p[1]).sort();
      const have = (got.pairs || []).map(p => p[0] + '>' + p[1]).sort();
      return listsEqual(want, have) ? 'win' : 'lose';
    }
    if (board.widget === 'order') return listsEqual(got.order, board.steps) ? 'win' : 'lose';
    if (board.widget === 'pick') {
      const want = board.correct.slice().sort();
      const have = (got.picks || []).slice().sort();
      return listsEqual(want, have) ? 'win' : 'lose';
    }
    if (board.widget === 'sort') return board.cards.every(c => (got.buckets || {})[c.label] === c.bucket) ? 'win' : 'lose';
    if (board.widget === 'place' && board.sequence) return listsEqual(got.order, board.sequence) ? 'win' : 'lose';
    if (board.widget === 'place') return got.zone === board.correct ? 'win' : 'lose';
    if (board.widget === 'audio') return got.track === board.correct ? 'win' : 'lose';
    if (board.widget === 'schedule') return !!(got.removed && got.removed.includes(board.remove) && got.removed.includes(board.ban) && got.kept && got.kept.includes(board.keep)) ? 'win' : 'lose';
    if (board.widget === 'cards') return got.solo || board.required.every(id => got.on && got.on[id]) ? 'win' : 'lose';
    return 'lose';
  }
  root.M121_BOARDS = BOARDS;
  root.m121Grade = grade;
  if (typeof module !== 'undefined' && module.exports) module.exports = { boards: BOARDS, grade: grade };
  if (typeof MG100 === 'undefined' || typeof document === 'undefined' || typeof mgOpen !== 'function') return;

  const byId = Object.fromEntries(BOARDS.map(b => [b.id, b]));
  for (const b of BOARDS) {
    if (!MG100.some(g => g.id === 'g_' + b.id)) MG100.push({ id: 'g_' + b.id, zh: b.name_zh, en: b.name_en, tpl: 'm121', a: '', b: '-', kw: [], spec: b });
  }
  function html(s) { return typeof esc === 'function' ? esc(s) : String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function mix(list) { return typeof shuf === 'function' ? shuf(list) : list.slice(); }
  function bars(nums) { return '<i class="m121wave">' + nums.map(n => '<b style="height:' + (n * 8) + 'px"></b>').join('') + '</i>'; }
  function shell(board, body) {
    return '<img class="m121art" alt="" src="art/official/m121-off-camera/images/' + board.art + '.webp">' +
      '<p class="m121ask">' + html(board.prompt) + '</p>' + body +
      '<div class="m121foot"><button type="button" data-m121="help">请他们帮忙</button><button type="button" class="m121go" data-m121="go">确认</button></div>';
  }
  function paint(A, board, done) {
    const state = { pairs: [], picks: [], order: [], buckets: {}, zone: '', track: '', removed: [], kept: [], on: {}, solo: false, left: '' };
    if (board.widget === 'order') state.order = mix(board.steps.slice());
    if (board.widget === 'place' && board.sequence) state.order = [];
    function draw() {
      let body = '';
      if (board.widget === 'match' || board.widget === 'link') {
        const usedL = new Set(state.pairs.map(p => p[0])), usedR = new Set(state.pairs.map(p => p[1]));
        const rights = mix(board.pairs.map(p => p[1]));
        body = '<div class="m121cols"><div>' + board.pairs.map(p => '<button type="button" class="m121btn' + (state.left === p[0] ? ' on' : '') + (usedL.has(p[0]) ? ' ok' : '') + '" data-left="' + html(p[0]) + '"' + (usedL.has(p[0]) ? ' disabled' : '') + '>' + html(p[0]) + '</button>').join('') +
          '</div><div>' + rights.map(r => '<button type="button" class="m121btn' + (usedR.has(r) ? ' ok' : '') + '" data-right="' + html(r) + '"' + (usedR.has(r) ? ' disabled' : '') + '>' + html(r) + '</button>').join('') + '</div></div>';
      } else if (board.widget === 'order') {
        body = state.order.map((step, i) => '<div class="m121row"><b>' + html(step) + '</b><button type="button" data-up="' + i + '" aria-label="上移">↑</button><button type="button" data-down="' + i + '" aria-label="下移">↓</button></div>').join('');
      } else if (board.widget === 'pick') {
        body = board.options.map(o => '<button type="button" class="m121btn' + (state.picks.includes(o[0]) ? ' on' : '') + '" data-pick="' + html(o[0]) + '">' + html(o[1]) + '</button>').join('');
      } else if (board.widget === 'sort') {
        body = '<p class="m121hint">' + html(state.item || '先点一件东西') + '</p>' + board.cards.map(c => '<button type="button" class="m121btn' + (state.item === c.label ? ' on' : '') + '" data-item="' + html(c.label) + '">' + html(c.label) + (state.buckets[c.label] ? ' → ' + html(state.buckets[c.label]) : '') + '</button>').join('') +
          '<div class="m121cols">' + board.buckets.map(b => '<button type="button" class="m121btn" data-bucket="' + html(b) + '">' + html(b) + '</button>').join('') + '</div>';
      } else if (board.widget === 'place' && board.sequence) {
        const opts = board.sequence.concat(board.trap ? [board.trap] : []);
        body = '<p class="m121hint">' + html(state.order.join(' → ') || '按顺序点') + '</p>' + opts.map(s => '<button type="button" class="m121btn" data-step="' + html(s) + '">' + html(s) + '</button>').join('');
      } else if (board.widget === 'place') {
        body = board.zones.map(z => '<button type="button" class="m121zone' + (state.zone === z[0] ? ' on' : '') + '" data-zone="' + html(z[0]) + '">' + html(z[1]) + '</button>').join('');
      } else if (board.widget === 'audio') {
        body = board.tracks.map(t => '<button type="button" class="m121btn' + (state.track === t[0] ? ' on' : '') + '" data-track="' + html(t[0]) + '">' + bars(t[2]) + '<span>' + html(t[1]) + '</span></button>').join('');
      } else if (board.widget === 'schedule') {
        body = [board.remove, board.keep, board.ban].map(name => '<button type="button" class="m121btn' + (state.removed.includes(name) ? ' off' : state.kept.includes(name) ? ' on' : '') + '" data-chip="' + html(name) + '">' + html(name) + '</button>').join('') +
          '<p class="m121hint">再点一次会拿掉。名次和强制项要拿掉，空位要留下。</p>';
      } else if (board.widget === 'cards') {
        body = board.clauses.map(c => '<button type="button" class="m121btn' + (state.on[c[0]] ? ' on' : '') + '" data-clause="' + html(c[0]) + '">' + html(c[1]) + '</button>').join('') +
          '<button type="button" class="m121btn' + (state.solo ? ' on' : '') + '" data-solo="1">独身，这份约会协议不签</button>';
      }
      A.innerHTML = shell(board, body);
      const img = A.querySelector('.m121art');
      if (img) img.addEventListener('error', () => img.remove());
    }
    draw();
    A.onclick = function (e) {
      const t = e.target.closest('[data-m121],[data-left],[data-right],[data-up],[data-down],[data-pick],[data-item],[data-bucket],[data-step],[data-zone],[data-track],[data-chip],[data-clause],[data-solo]');
      if (!t) return;
      if (t.dataset.m121 === 'help') { done('help'); return; }
      if (t.dataset.left) { state.left = t.dataset.left; draw(); return; }
      if (t.dataset.right) {
        if (!state.left) return;
        const pair = [state.left, t.dataset.right];
        const ok = board.pairs.some(p => p[0] === pair[0] && p[1] === pair[1]);
        state.left = '';
        if (!ok) { done('lose'); return; }
        state.pairs.push(pair);
        if (state.pairs.length === board.pairs.length) { done(grade(board, state)); return; }
        draw(); return;
      }
      if (t.dataset.up || t.dataset.down) {
        const i = +(t.dataset.up || t.dataset.down), j = t.dataset.up ? i - 1 : i + 1;
        if (j < 0 || j >= state.order.length) return;
        const swap = state.order[i]; state.order[i] = state.order[j]; state.order[j] = swap; draw(); return;
      }
      if (t.dataset.pick) {
        const id = t.dataset.pick;
        state.picks = state.picks.includes(id) ? state.picks.filter(x => x !== id) : state.picks.concat(id);
        draw(); return;
      }
      if (t.dataset.item) { state.item = t.dataset.item; draw(); return; }
      if (t.dataset.bucket) { if (state.item) state.buckets[state.item] = t.dataset.bucket; state.item = ''; draw(); return; }
      if (t.dataset.step) {
        if (board.trap && t.dataset.step === board.trap) { done('lose'); return; }
        state.order.push(t.dataset.step);
        if (state.order.length === board.sequence.length) { done(grade(board, state)); return; }
        draw(); return;
      }
      if (t.dataset.zone) { state.zone = t.dataset.zone; draw(); return; }
      if (t.dataset.track) { state.track = t.dataset.track; draw(); return; }
      if (t.dataset.chip) {
        const name = t.dataset.chip;
        if (name === board.keep) { state.kept = state.kept.includes(name) ? [] : [name]; state.removed = state.removed.filter(x => x !== name); }
        else state.removed = state.removed.includes(name) ? state.removed.filter(x => x !== name) : state.removed.concat(name);
        draw(); return;
      }
      if (t.dataset.clause) { state.solo = false; state.on[t.dataset.clause] = !state.on[t.dataset.clause]; draw(); return; }
      if (t.dataset.solo) { state.solo = !state.solo; draw(); return; }
      if (t.dataset.m121 === 'go') done(grade(board, state));
    };
  }
  MG_T.m121 = function (A, G, sub, done, T, zh) {
    const board = (G && G.spec) || byId[String(G && G.id || '').replace(/^g_/, '')];
    if (!board) { done('skip'); return; }
    sub.textContent = zh ? '点选即可。跳过或请他们帮忙都会让故事继续。' : 'Tap to play. Skip and help both continue the story.';
    paint(A, board, done);
  };
  const open = mgOpen;
  mgOpen = function (id, cb) {
    if (!String(id).startsWith('g_M121_')) return open.apply(this, arguments);
    const G = MG100.find(g => g.id === id);
    if (!G) { cb && cb('skip'); return; }
    if (typeof mgClose === 'function') mgClose();
    const zh = typeof CL === 'function' && CL() === 'zh';
    const ov = document.createElement('div');
    ov.className = 'mg60 m121play';
    ov.innerHTML = '<div class="mgbox"><div class="mghd"><b>🎮 ' + html(zh ? G.zh : G.en) + '</b><button type="button" data-mgskip="1">' + (zh ? '跳过' : 'Skip') + ' ›</button></div><p class="mgsub"></p><div class="mgarea"></div><div class="mgres" hidden></div></div>';
    document.body.appendChild(ov);
    const area = ov.querySelector('.mgarea'), sub = ov.querySelector('.mgsub');
    let over = false;
    const timers = [];
    const finish = function (r) {
      if (over) return;
      over = true;
      timers.forEach(clearTimeout);
      if (r === 'skip') { ov.remove(); cb && cb('skip'); return; }
      const res = ov.querySelector('.mgres');
      const title = r === 'win' ? (zh ? '做对了' : 'Done') : r === 'help' ? (zh ? '他们帮你补完' : 'They finish it with you') : (zh ? '记下没完成的部分' : 'The miss is noted');
      res.hidden = false;
      res.innerHTML = '<b>' + title + '</b><button type="button" class="btn btn-p btn-block" data-mgback="1">' + (zh ? '回到剧情' : 'Back to the story') + '</button>';
      res.dataset.r = r;
    };
    MGX = { ov: ov, cb: cb, G: G, timers: timers, done: finish };
    ov.addEventListener('click', function (e) {
      if (e.target.closest('[data-mgskip]')) finish('skip');
      if (e.target.closest('[data-mgback]')) { const r = ov.querySelector('.mgres').dataset.r; ov.remove(); MGX = null; cb && cb(r); }
    });
    try { MG_T.m121(area, G, sub, finish, timers, zh); } catch (e) { finish('skip'); }
  };
  const result = mgResult;
  mgResult = function (th, d, r) {
    if (!d || !String(d.id || '').startsWith('g_M121_')) return result.apply(this, arguments);
    const id = String(d.id).slice(2);
    const flag = r === 'win' ? 'm121_mg_' + id + '_win' : r === 'help' ? 'm121_mg_' + id + '_help' : r === 'lose' ? 'm121_mg_' + id + '_lose' : 'm121_mg_' + id + '_skip';
    pkSet(th, flag);
    const zh = typeof CL === 'function' && CL() === 'zh';
    const line = r === 'win' ? (zh ? '这一步你自己做完了。' : 'You finished this step.') : r === 'help' ? (zh ? '在场的人帮你补完。故事继续。' : 'Someone here finishes it with you. The story continues.') : r === 'lose' ? (zh ? '有一处没对上。他们补上，故事继续。' : 'One piece did not match. They complete it, and the story continues.') : (zh ? '这一步跳过了。故事继续。' : 'This step is skipped. The story continues.');
    th.pk.mgN = (th.pk.mgN || 0) + 1;
    if (typeof save === 'function') save();
    return [['n', 'act', line]];
  };
  if (!document.getElementById('m121-game-css')) {
    const st = document.createElement('style');
    st.id = 'm121-game-css';
    st.textContent = '.m121play .mgbox{max-width:420px;max-height:92vh;overflow:auto}.m121art{width:100%;height:28vh;min-height:140px;object-fit:cover;border-radius:16px;display:block;background:#241828}.m121ask,.m121hint{font-size:14px;line-height:1.45;margin:10px 0}.m121btn,.m121zone{display:flex;align-items:center;gap:8px;width:100%;min-height:48px;margin:0 0 8px;padding:12px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);color:#fff;font-size:16px;text-align:left;touch-action:manipulation}.m121btn.on,.m121zone.on{border-color:#F0B77E;background:rgba(240,183,126,.18)}.m121btn.ok{opacity:.55}.m121btn.off{opacity:.4;text-decoration:line-through}.m121cols{display:grid;grid-template-columns:1fr 1fr;gap:8px}.m121row{display:flex;align-items:center;gap:8px;margin-bottom:8px}.m121row b{flex:1;font-size:16px}.m121row button{width:44px;height:44px;border-radius:12px;border:0;background:rgba(255,255,255,.1);color:#fff;font-size:18px}.m121foot{display:flex;gap:8px;margin-top:12px}.m121foot button{flex:1;min-height:48px;border-radius:14px;border:1px solid rgba(255,255,255,.2);background:transparent;color:#fff;font-size:15px}.m121foot .m121go{background:#F0B77E;color:#241810;border:0;font-weight:700}.m121wave{display:flex;align-items:flex-end;gap:3px;height:42px}.m121wave b{width:6px;background:#F0B77E;border-radius:3px;display:block}';
    document.head.appendChild(st);
  }
})(typeof window !== 'undefined' ? window : globalThis);
