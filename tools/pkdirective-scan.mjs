// 扫描 pkDirective 层：每层认领哪些类型、该类型分支**到底消费不消费**（2026-10-27）
//
//   上一版的两个误判都出在「切片窗口」：
//     · app20 的 `event` 分支里没有 return true，但窗口取太宽，把隔壁 fx 的 return true 也算了
//     · app56 的 `item` 分支很长，窗口取太窄，没看到结尾的 return true
//   ⇒ 改成**按分支边界切**：从本次 `b[1]==="X"` 起，切到**下一个 `b[1]===` 或 `return _pk`** 为止。
import fs from 'node:fs';

export function scanPkDirective(SRC = 'source/src', buildPath = 'source/build.py') {
  const RE = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*pkDirective\s*;\s*pkDirective\s*=\s*function\s*\(([^)]*)\)\s*\{/g;

  const build = fs.readFileSync(buildPath, 'utf8');
  const parts = /parts\s*=\s*\[([\s\S]*?)\]/.exec(build);
  const order = parts ? [...parts[1].matchAll(/"([^"]+\.js)"/g)].map(x => x[1]) : [];
  const rank = new Map(order.map((f, i) => [f, i]));

  const layers = [];

  for (const f of fs.readdirSync(SRC).filter(x => x.endsWith('.js'))) {
    const src = fs.readFileSync(SRC + '/' + f, 'utf8');
    RE.lastIndex = 0;
    let h;
    while ((h = RE.exec(src))) {
      const open = h.index + h[0].length;
      let d = 1, j = open;
      while (j < src.length && d > 0) { const c = src[j]; if (c === '{') d++; else if (c === '}') d--; j++ }
      const body = src.slice(open, j - 1);

      const consume = new Set();   // 这个层真正消费的类型
      const claims = new Set();    // 认领但可能只是观察

      /* 分支边界：下一个 b[1]=== 或 末尾的 return _pk */
      const marks = [];
      const reEq = /b\[1\]\s*===\s*"([a-z0-9_]+)"/g;
      let t;
      while ((t = reEq.exec(body))) marks.push({ idx: t.index, type: t[1] });
      const reInc = /\[([^\]]*)\]\.includes\(b\[1\]\)/g;
      while ((t = reInc.exec(body))) {
        const names = [...t[1].matchAll(/"([a-z0-9_]+)"/g)].map(x => x[1]);
        if (names.length) marks.push({ idx: t.index, type: null, multi: names });
      }
      marks.sort((a, b) => a.idx - b.idx);

      /* 分支文本 = 该类型测试这一次的**语句或块**：
         · 有形如 `if(b[1]==="x"){…}` 的块 ⇒ 取到块尾
         · 无形（`if(b[1]==="x")doSomething();`）⇒ 取到分号
         上一版取「第一个 { 起配平」，会把外层 if(b[0]==="sys") 的整个大块算进来，
         于是 app20 的 event/bg 分支被误判成"消费"（因为隔壁 fx 分支里有 return true）。 */
      const branchBlock = (idx) => {
        const brace = body.indexOf('{', idx);
        const semi = body.indexOf(';', idx);
        if (brace >= 0 && (semi < 0 || brace < semi)) {
          let dd = 1, jj = brace + 1;
          while (jj < body.length && dd > 0) { const c = body[jj]; if (c === '{') dd++; else if (c === '}') dd--; jj++ }
          return body.slice(brace, jj);
        }
        return semi < 0 ? body.slice(idx) : body.slice(idx, semi + 1);
      };
      for (let k = 0; k < marks.length; k++) {
        const seg = branchBlock(marks[k].idx);
        const consumed = /return\s+true/.test(seg);
        const types = marks[k].multi || [marks[k].type];
        for (const ty of types) { claims.add(ty); if (consumed) consume.add(ty) }
      }

      if (claims.size) {
        layers.push({
          file: f,
          order: rank.has(f) ? rank.get(f) : 9999,
          chars: body.length,
          claims: [...claims],
          consumes: [...consume]
        });
      }
    }
  }

  /* 赢家 = 加载序最大（最外层）的消费型 */
  const winner = {};
  for (const L of layers) for (const ty of L.consumes) {
    if (!winner[ty] || L.order > winner[ty].order) winner[ty] = { file: L.file, order: L.order };
  }

  return { layers, winner };
}
