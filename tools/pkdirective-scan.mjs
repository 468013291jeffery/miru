// 扫描剧本指令的注册层（2026-10-27 改版：源码形状从"包装"变成 PKREG.add）
//
//   旧形状（已不存在）：const _pkX = pkDirective; pkDirective = function(th,b){ … return _pkX(th,b) }
//   新形状：            PKREG.add("appXX.js", function(th,b,next){ … return next(th,b) })
//
//   order = 注册顺序（按 build.py 的 parts 顺序 + 文件内出现顺序），与运行时链的装配顺序一致。
import fs from 'node:fs';

export function scanPkDirective(SRC = 'source/src', buildPath = 'source/build.py') {
  const build = fs.readFileSync(buildPath, 'utf8');
  const parts = /parts\s*=\s*\[([\s\S]*?)\]/.exec(build);
  const order = parts ? [...parts[1].matchAll(/"([^"]+\.js)"/g)].map(x => x[1]) : [];

  const RE = /PKREG\.add\(\s*"([^"]+)"\s*,\s*function\s*\(([^)]*)\)\s*\{/g;
  const layers = [];
  let seq = 0;

  for (const f of order.length ? order : fs.readdirSync(SRC).filter(x => x.endsWith('.js'))) {
    const P = SRC + '/' + f;
    if (!fs.existsSync(P)) continue;
    const src = fs.readFileSync(P, 'utf8');
    RE.lastIndex = 0;
    let h;
    while ((h = RE.exec(src))) {
      const open = h.index + h[0].length;
      let d = 1, j = open;
      while (j < src.length && d > 0) { const c = src[j]; if (c === '{') d++; else if (c === '}') d--; j++ }
      const body = src.slice(open, j - 1);

      /* 分支文本 = 该类型测试自己的语句或块 */
      const branchBlock = (idx) => {
        const brace = body.indexOf('{', idx), semi = body.indexOf(';', idx);
        if (brace >= 0 && (semi < 0 || brace < semi)) {
          let dd = 1, jj = brace + 1;
          while (jj < body.length && dd > 0) { const c = body[jj]; if (c === '{') dd++; else if (c === '}') dd--; jj++ }
          return body.slice(brace, jj);
        }
        return semi < 0 ? body.slice(idx) : body.slice(idx, semi + 1);
      };

      const claims = new Set(), consumes = new Set();
      let t;
      const reEq = /b\[1\]\s*===\s*"([a-z0-9_]+)"/g;
      while ((t = reEq.exec(body))) {
        claims.add(t[1]);
        if (/return\s+true/.test(branchBlock(t.index))) consumes.add(t[1]);
      }
      const reInc = /\[([^\]]*)\]\.includes\(b\[1\]\)/g;
      while ((t = reInc.exec(body))) {
        const names = [...t[1].matchAll(/"([a-z0-9_]+)"/g)].map(x => x[1]);
        const consumed = /return\s+true/.test(branchBlock(t.index));
        names.forEach(n => { claims.add(n); if (consumed) consumes.add(n) });
      }

      layers.push({ file: f, reg: h[1], order: seq++, chars: body.length, claims: [...claims], consumes: [...consumes] });
    }
  }

  /* 赢家 = 注册顺序最大（最后注册 = 最外层，先看到 beat） */
  const winner = {};
  for (const L of layers) for (const ty of L.consumes) {
    if (!winner[ty] || L.order > winner[ty].order) winner[ty] = { file: L.reg, order: L.order };
  }

  return { layers, winner };
}
