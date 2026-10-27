/* ================= 剧本指令分发：把「谁赢」写出来（2026-10-27）=================
   Ann 拍板：「可以把这俩分清楚，现在用的都是 b」。

   ## 现状（量出来的，不是猜的）
   `pkDirective` 被 **26 层**猴补丁包过，看起来是包装链，实际是一张**藏在链里的分发表**：
   每层认领 `b[1] === "某类型"` 然后 `return true` 吃掉这个 beat。
   ⇒ **谁生效由文件名加载顺序决定**（后加载的在外层，先看到 beat）。

   今天扫出两处真冲突：

     event：app16_story2（appendMsg 渲染） vs app17_custom（pkPart 合并块渲染）
            实际生效 = **app17_custom**（38 < 39，它在外层）
            ⇒ app16 那份**从不执行**，且没有任何报错

     fx   ：app20_fx_booth（fxSet） vs app59_fx100
            实际生效 = **app59_fx100**（42 < 83）

   ## 这个文件做什么
   **只登记，不改行为。** 把「类型 → 谁在处理（以及为什么）」和「谁被覆盖了（死代码）」写成一张表，
   再由 `tools/pkdirective-check.mjs` **拿代码扫出来的结果和这张表对账**：
     · 表里没登记的类型 ⇒ 红（新增了一个类型的处理者却没写进表）
     · 表里写的赢家 ≠ 扫出来的最外层赢家 ⇒ 红（加载顺序变了，行为悄悄变了）
     · 声明的死代码如果哪天又活了（层被删了）⇒ 红

   ## 为什么这样最有价值
   「谁赢」从此**是代码里的一行字**，不是文件名顺序的意外。想改赢家，就得改这一行 —— 那是一次可见的决定。
================================================================================== */
(function () {
  'use strict';

  /* 类型 → 生效的实现（按 2026-10-27 的加载顺序实测） */
  const DIRECT = {
    event: { by: 'app17_custom.js', why: 'pkPart 合并块渲染（B 方案，Ann 确认在用）' },
    fx: { by: 'app20_fx_booth.js', why: '唯一真正的消费者；app59 也认领 fx，但只做副作用、不消费' },
    fx100: { by: 'app59_fx100.js', why: '专用类型' },
    sfx: { by: 'app59_fx100.js', why: '专用类型' },
    ring: { by: 'app20_fx_booth.js', why: '专用类型' },
    mono: { by: 'app19_bgm.js', why: '专用类型' },
    rd: { by: 'app21_dims.js', why: '维度变化' },
    bgm: { by: 'app24_gl.js', why: '场景背景音乐' },
    title: { by: 'app23_heir.js', why: '标题卡（与 money/post/anchor 同一层）' },
    money: { by: 'app23_heir.js', why: '同上' },
    post: { by: 'app23_heir.js', why: '同上' },
    anchor: { by: 'app23_heir.js', why: '同上' },
    recall: { by: 'app37_hooks.js', why: '回忆卡' },
    say: { by: 'app32_myline.js', why: '玩家自己那句的改写' },
    item: { by: 'app56_story3.js', why: '道具' },
    branch: { by: 'app56_story3.js', why: '分支' },
    join: { by: 'app56_story3.js', why: '合流' },
    decide: { by: 'app56_story3.js', why: '抉择' },
    arc: { by: 'app56_story3.js', why: '弧线' },
    cg94: { by: 'app94_official2.js', why: '官方剧 CG' },
    vid94: { by: 'app94_official2.js', why: '官方剧视频' }
  };

  /* 被覆盖、**从不执行**的实现（留着是为了让下一个人知道它存在过） */
  const DEAD = [
    { type: 'event', by: 'app16_story2.js', why: '被 app17_custom 的 pkPart 版覆盖（38 < 39，后者在外层）' }
  ];

  /* 观察者：不认领类型、对每个 beat 都做副作用、**不消费** */
  const OBSERVE = [
    'app28_burst.js', 'app29_style.js', 'app30_fx3.js', 'app31_score.js',
    'app40_sfx.js', 'app41_merge.js', 'app46_cp.js', 'app58_bgm100.js',
    'app100_fixes.js', 'app101_you.js'
  ];

  window.PKDIRECT = DIRECT;
  window.PKDEAD = DEAD;
  window.PKOBSERVE = OBSERVE;

  window.__pkdir = function () {
    return {
      处理者: Object.keys(DIRECT).length + ' 个类型',
      死代码: DEAD.length + ' 处',
      观察者: OBSERVE.length + ' 层',
      明细: DIRECT
    };
  };
})();
