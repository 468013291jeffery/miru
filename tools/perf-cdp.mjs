/* ============ 进游戏之后：用 CDP 自己量（不依赖 agent-browser daemon）============
   为什么另起一份：agent-browser 的 daemon 是单例，多个窗口同名 session 会互相导航走对方的页面
   （2026-10-27 凌晨实测：两轮测量互相打掉）。这里自己起一个带调试端口的 Edge，
   CDP 直连，页面归我一家所有 —— 读数因此可复现。

   用法：
     node tools/perf-cdp.mjs --quick                 # 只量三格：进 thread / renderChat×10 / save×30
     node tools/perf-cdp.mjs --chapters 3            # 真走 3 章，逐章记账（会跑几分钟）
     node tools/perf-cdp.mjs --save .browser-save.json --world ice --out reports/perf-cdp.json

   它复用同仓的两把尺：tools/perf-ingame.js（探针）与 tools/perf-ingame-run.js（页内驱动器）。
   ============================================================= */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d; };
const flag = n => args.includes('--' + n);

const URL0 = opt('url', 'http://127.0.0.1:8131/');
const PORT = Number(opt('port', 9333));
const SAVE = opt('save', '.browser-save.json');
const WORLD = opt('world', 'ice');
const CHOICE = opt('choice', 'B');
const CHAPTERS = Number(opt('chapters', 0));
const OUT = opt('out', 'reports/perf-cdp.json');
const CPU = Number(opt('cpu', 0));            // CPU 降频倍数（模拟手机：4~6）
const NET = opt('net', '');                    // 形如 1.6/150 = 1.6 Mbps 下行 / 150ms RTT
const EDGE = opt('edge', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe');

const sleep = ms => new Promise(r => setTimeout(r, ms));
const say = (...a) => console.log(...a);

function launch() {
  const profile = path.join(os.tmpdir(), 'miru-cdp-profile-' + Date.now());
  const p = spawn(EDGE, [
    '--headless=new',
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + profile,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    '--mute-audio', '--window-size=430,932',
    URL0,
  ], { stdio: 'ignore' });
  p.on('error', e => say('!! 起浏览器失败: ' + e.message));
  return { proc: p, profile };
}

async function waitPort() {
  for (let i = 0; i < 120; i++) {
    try { const r = await fetch(`http://127.0.0.1:${PORT}/json/version`); if (r.ok) return await r.json(); } catch (_) {}
    await sleep(250);
  }
  throw new Error('调试端口没起来：' + PORT);
}

async function pageTarget() {
  for (let i = 0; i < 40; i++) {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    const t = list.find(x => x.type === 'page' && String(x.url).includes('8131')) || list.find(x => x.type === 'page');
    if (t && t.webSocketDebuggerUrl) return t;
    await sleep(250);
  }
  throw new Error('没有可用的 page target');
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const waiting = new Map();
  ws.addEventListener('message', ev => {
    let m; try { m = JSON.parse(typeof ev.data === 'string' ? ev.data : ev.data.toString()); } catch (_) { return }
    if (m.id && waiting.has(m.id)) { const { res, rej } = waiting.get(m.id); waiting.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result) }
  });
  const ready = new Promise((res, rej) => { ws.addEventListener('open', () => res()); ws.addEventListener('error', e => rej(new Error('ws error'))) });
  const send = (method, params) => new Promise((res, rej) => {
    const i = ++id; waiting.set(i, { res, rej });
    ws.send(JSON.stringify({ id: i, method, params: params || {} }));
  });
  return { ws, ready, send };
}

async function main() {
  const { proc, profile } = launch();
  const cleanup = () => { try { proc.kill() } catch (_) {} };
  try {
    const ver = await waitPort();
    say('浏览器 ' + (ver.Browser || '?') + ' · 端口 ' + PORT);
    const t = await pageTarget();
    const { ws, ready, send } = connect(t.webSocketDebuggerUrl);
    await ready;
    await send('Runtime.enable');
    await send('Page.enable');

    const evaluate = async (expr) => {
      const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true, userGesture: true });
      if (r.exceptionDetails) throw new Error('页面里抛错: ' + JSON.stringify(r.exceptionDetails).slice(0, 400));
      return r.result ? r.result.value : undefined;
    };
    const waitFor = async (expr, ms) => {
      const t0 = Date.now();
      while (Date.now() - t0 < ms) { try { if (await evaluate(expr)) return true } catch (_) {} await sleep(200) }
      return false;
    };

    say('[1/5] 等页面脚本就绪');
    const ok0 = await waitFor('typeof S !== "undefined" && typeof renderChat === "function"', 30000);
    say('      S/renderChat 就绪 = ' + ok0);
    if (!ok0) throw new Error('页面没起来（S 或 renderChat 不存在）');

    say('[2/5] 塞入真存档 ' + SAVE);
    const raw = fs.readFileSync(SAVE, 'utf8');
    /* ⚠️ 不能在「已经跑着 app 的页面」上写 localStorage 再 reload ——
       旧文档的 beforeunload 会 save() 一次，把刚写进去的 79 KB 覆盖成它内存里的空存档
       （2026-10-27 实测：写 79,254 字节，reload 后只剩 539）。
       所以先跳到**同源、没有 app 的 404 页**去写，再导航进游戏。 */
    const seedUrl = URL0.replace(/\/$/, '') + '/__seed';
    await send('Page.navigate', { url: seedUrl });
    await sleep(400);
    const onSeed = await waitFor('document.readyState === "complete" && location.pathname === "/__seed"', 15000);
    say('      落点 404 页 = ' + onSeed);
    if (!onSeed) throw new Error('没能落到同源 404 页去写存档');
    const wlen = await evaluate(`localStorage.setItem("miru_v2", ${JSON.stringify(raw)}); (localStorage.getItem("miru_v2")||"").length`);
    say('      写入字节 = ' + wlen + '（源文件 ' + raw.length + '）');
    await send('Page.navigate', { url: URL0 });
    const fresh = await waitFor('document.readyState === "complete" && typeof S !== "undefined" && typeof renderChat === "function"', 30000);
    say('      游戏页就绪 = ' + fresh);
    if (!fresh) throw new Error('导航进游戏页之后没等到 S/renderChat');
    say('      存储自检 = ' + await evaluate(`JSON.stringify((function(){
      var v=localStorage.getItem("miru_v2")||"";
      var o=null; try{o=JSON.parse(v)}catch(e){}
      return {len:v.length, parsed:!!o, threads:o&&o.threads?Object.keys(o.threads).length:"-", lang:o?o.lang:"-"};
    })())`));
    /* ---- 把靶子换成「手机」：CPU 降频 + 网络限速，然后重新导航一次，
       这样 performance.timing 量到的就是**手机上的加载**，而不是本机 localhost。---- */
    if (CPU > 1) { await send('Emulation.setCPUThrottlingRate', { rate: CPU }); say('      CPU 降频 x' + CPU) }
    if (NET) {
      const [mbps, rtt] = String(NET).split('/').map(Number);
      await send('Network.enable');
      await send('Network.emulateNetworkConditions', {
        offline: false, latency: rtt || 150,
        downloadThroughput: (mbps || 1.6) * 1024 * 1024 / 8,
        uploadThroughput: 750 * 1024 / 8,
        connectionType: 'cellular3g',
      });
      say('      网络 ' + (mbps || 1.6) + ' Mbps · RTT ' + (rtt || 150) + ' ms');
    }
    if (CPU > 1 || NET) {
      await send('Page.navigate', { url: URL0 });
      await waitFor('document.readyState === "complete" && typeof S !== "undefined" && typeof renderChat === "function"', 60000);
      say('      降级条件下重新加载完成');
      say('      ' + await evaluate(fs.readFileSync('tools/perf-ingame.js', 'utf8')));
      say('      ' + await evaluate(fs.readFileSync('tools/perf-ingame-run.js', 'utf8')));
    }
    const st0 = await evaluate(`JSON.stringify({lang:S.lang, ob:!!S.ob, threads:Object.keys(S.threads).length, lens:Object.keys(S.threads).map(function(k){return (S.threads[k].msgs||[]).length}), lastTab:S.lastTab})`);
    say('      存档生效 = ' + st0);
    const nThreads = JSON.parse(st0).threads;
    if (!nThreads) throw new Error('存档没进到页面里（threads=0）—— 别拿空线程的读数当基线');

    say('[3/5] 注入探针与页内驱动器');
    say('      ' + await evaluate(fs.readFileSync('tools/perf-ingame.js', 'utf8')));
    say('      ' + await evaluate(fs.readFileSync('tools/perf-ingame-run.js', 'utf8')));

    /* ---- speak 监听器：把「念的是什么」和「屏幕上是什么」逐条对账 ----
       装在 app45/app62/app86 三次覆盖之后，所以看到的是**最终生效**的那个 speak。 */
    if (flag('spy')) {
      const spy = `(function(){
        if(window.__SPY_WRAPPED) return "already";
        window.__SPY_WRAPPED=1; window.__SPY=[];
        const orig=window.speak;
        window.speak=function(text,id,onend){
          try{
            const th=(typeof curT!=="undefined"&&curT&&S.threads[curT])||null;
            const last=th&&th.msgs&&th.msgs.length?th.msgs[th.msgs.length-1]:null;
            let rec=false; try{rec=!!(typeof recorded==="function"&&recorded(text,id))}catch(e){}
            let tts=false; try{tts=!!(typeof ttsOn==="function"&&ttsOn())}catch(e){}
            let qlen=-1,qhead=""; try{const q=(th&&th.pk&&th.pk.q)||[];qlen=q.length;qhead=q[0]?(Array.isArray(q[0])?String(q[0][2]):String(q[0])):""}catch(e){}
            window.__SPY.push({t:Math.round(performance.now()),id:String(id||""),
              text:String(text||"").slice(0,90),
              rec:rec, tts:tts, avdead:(typeof AVDEAD!=="undefined"?AVDEAD:-1),
              qlen:qlen, qhead:String(qhead||"").slice(0,90),
              qsame:!!(qhead&&String(qhead).trim()===String(text||"").trim()),
              last:last?String(last.txt||"").slice(0,90):"",
              lastWho:last?String(last.who||""):"",
              same:last?!!(String(last.txt||"").trim()&&String(last.txt||"").trim()===String(text||"").trim()):false});
          }catch(e){}
          return orig.apply(this,arguments);
        };
        return "spy on";
      })()`;
      say('      ' + await evaluate(spy));

      /* 第二层：(b) 真正放出去的那段音频。录音包是 data: URI，我可以用「长度+前缀」反查它属于哪句台词。 */
      const audSpy = `(function(){
        if(window.__AUDSPY) return "already";
        window.__AUDSPY=1; window.__AUD=[];
        try{
          const op=HTMLMediaElement.prototype.play;
          HTMLMediaElement.prototype.play=function(){
            try{const s=String(this.src||this.currentSrc||"");
              window.__AUD.push({t:Math.round(performance.now()),kind:/^data:/.test(s)?"data":(/^blob:/.test(s)?"blob":(s?"url":"empty")),len:s.length,head:s.slice(0,44),tail:s.slice(-24)});
            }catch(e){}
            let p; try{p=op.apply(this,arguments)}catch(e){return Promise.resolve()}
            if(p&&p.catch)p.catch(()=>{});
            return p;
          };
        }catch(e){}
        try{
          if(typeof speechSynthesis!=="undefined"){
            const os=speechSynthesis.speak.bind(speechSynthesis);
            speechSynthesis.speak=function(u){try{window.__AUD.push({t:Math.round(performance.now()),kind:"device",len:0,head:String((u&&u.text)||"").slice(0,44),tail:""})}catch(e){} return os(u)};
          }
        }catch(e){}
        return "aud spy on";
      })()`;
      say('      ' + await evaluate(audSpy));

      /* 第三层：每一句「等多久」。pkWait 的同步耗时≈0，真正的时间在它的 promise 里 ——
         所以量的是从进函数到 resolve 的墙钟，和它本该等的 ms 比。比值 >> 1 就是节奏被拖住了。 */
      const waitSpy = `(function(){
        if(window.__WAITSPY) return "already";
        window.__WAITSPY=1; window.__WAIT=[];
        try{
          const o=pkWait;
          pkWait=function(th,prev,spd,ms){
            const t0=performance.now();
            const p=o.apply(this,arguments);
            try{p.then(function(){window.__WAIT.push({ms:Math.round(ms||0),actual:Math.round(performance.now()-t0),av:(typeof AVDEAD!=="undefined"?AVDEAD:-1),txt:String((prev&&prev.txt)||"").slice(0,40)})})}catch(e){}
            return p;
          };
        }catch(e){}
        return "wait spy on";
      })()`;
      say('      ' + await evaluate(waitSpy));
    }

    /* --send "<一句话>"：直接走 doSend，看它到底有没有把玩家那句落进对话。
       判据：n0 → n1 有没有 +1；没 +1 就把拦下它的那一格（busy / aiGate / quest / 异常）打出来。 */
    if (opt('send')) {
      const txt = opt('send');
      const r = await evaluate(`(async function(){try{
        var t0=Date.now(); var th=S.threads[curT]; if(!th) return "no-th";
        var n0=th.msgs.length, ai=null, err="";
        try{ ai = (typeof aiGate==="function")? aiGate() : undefined }catch(e){ err="aiGate:"+e.message }
        var busy0 = (typeof busy!=="undefined")? busy : undefined;
        try{ doSend(${JSON.stringify(txt)},"say",false) }catch(e){ err+=" doSend:"+e.message }
        await new Promise(r=>setTimeout(r,900));
        var th2=S.threads[curT], n1=th2.msgs.length;
        return JSON.stringify({n0:n0,n1:n1,busy0:busy0,aiGate:ai,err:err,
          last:th2.msgs.slice(-3).map(function(m){return m.who+"/"+m.k+" len="+String(m.txt||"").length}),
          cin:(function(){var e=$("#cin");return e?("hidden="+!!e.hidden+" val="+String(e.value||"").slice(0,20)):"no-el"})(),
          toast:(function(){var e=$(".toast,.x-toast,#toast");return e?String(e.textContent||"").slice(0,60):"none"})()});
      }catch(e){return "ERR "+e.message}})()`);
      say('      send: ' + r);
    }

    if (flag('novoice')) {
      say('      关朗读（对照组）: ' + await evaluate(`S.autoVoice=false; save(); "autoVoice="+S.autoVoice`));
    }

    say('[4/5] 三格微基准（用存档里最长的那条线程 = 真实游玩现场）');
    const quick = await evaluate(`(function(){
      var out={};
      var ids=Object.keys(S.threads);
      var best=null; ids.forEach(function(id){var t=S.threads[id]; if(t&&t.msgs&&(!best||t.msgs.length>best.msgs.length))best=t});
      if(!best)return JSON.stringify({err:"no thread", ids:ids});
      out.thread={id:best.id,wid:best.wid,msgs:best.msgs.length};
      // ① 进 thread：通往游戏的那条真实路径（save → renderChat → show → scrollChat）
      openThread(best.id);
      var s0=performance.now(); openThread(best.id); out.openThreadMs=+(performance.now()-s0).toFixed(2);
      // ② renderChat ×10：整条消息列表拼成 HTML 再整块 innerHTML 替换
      var a=[]; for(var i=0;i<10;i++){var s=performance.now();renderChat();a.push(performance.now()-s)}
      out.renderChat={n:a.length,ms:+(a.reduce(function(x,y){return x+y},0)/a.length).toFixed(2),max:+Math.max.apply(null,a).toFixed(2)};
      // ③ save ×30：整份 S 序列化 + localStorage 同步写
      var b=[]; for(var j=0;j<30;j++){var s2=performance.now();save();b.push(performance.now()-s2)}
      out.save={n:b.length,ms:+(b.reduce(function(x,y){return x+y},0)/b.length).toFixed(2),max:+Math.max.apply(null,b).toFixed(2),bytes:JSON.stringify(S).length};
      // ④ chatBgSet ×20：每落一条消息都会调它（里面有强制重排 void offsetWidth）
      var c=[]; var cw=(best.cast&&best.cast[0])||"n";
      for(var k=0;k<20;k++){var s3=performance.now();try{chatBgSet(cw,"idle")}catch(e){};c.push(performance.now()-s3)}
      out.chatBgSet={n:c.length,ms:+(c.reduce(function(x,y){return x+y},0)/c.length).toFixed(2),max:+Math.max.apply(null,c).toFixed(2)};
      out.scale={msgs:best.msgs.length, domNodes:document.querySelectorAll("*").length, msgsNodes:document.querySelectorAll("#msgs > *").length};
      /* 左右分栏还在不在：数一数 .m-row 与 .m-row.me，并量它们离左边缘多远 */
      try{
        const box=document.querySelector("#msgs");
        const rows=[...document.querySelectorAll("#msgs .m-row")];
        const lefts=rows.map(r=>Math.round(r.getBoundingClientRect().left-(box?box.getBoundingClientRect().left:0)));
        const me=document.querySelectorAll("#msgs .m-row.me").length;
        const av=document.querySelectorAll("#msgs .m-row .av").length;
        out.layout={rows:rows.length, me:me, avatars:av,
          distinctLefts:Array.from(new Set(lefts)).sort((a,b)=>a-b).slice(0,6),
          sampleAlign:rows.slice(0,3).map(r=>getComputedStyle(r).alignSelf+"/"+getComputedStyle(r).flexDirection)};
      }catch(e){out.layout={err:String(e.message)}}
      // ⑤ 这次导航本身的耗时（回答「进入游戏时卡」——first paint 之前发生了什么）
      var pt=performance.timing||{}; var n0=pt.navigationStart||0;
      out.timing=n0?{ttfb:pt.responseStart-n0, html:pt.responseEnd-n0, domInteractive:pt.domInteractive-n0, dcl:pt.domContentLoadedEventStart-n0, load:pt.loadEventEnd-n0, transferKB:Math.round(((performance.getEntriesByType&&performance.getEntriesByType("navigation")[0]||{}).transferSize||0)/1024)}:{};
      out.pending={msgs:best.msgs.length};
      return JSON.stringify(out);
    })()`);
    say('      ' + quick);
    if (JSON.parse(quick).err) throw new Error('没有可量的线程: ' + quick);

    const result = { when: new Date().toISOString(), url: URL0, save: SAVE, world: WORLD, quick: JSON.parse(quick) };

    /* ---- 帧率：这才是玩家嘴里的「卡」----
       停在聊天页、播着的特效循环在跑，然后采 3 秒 requestAnimationFrame 的间隔。
       判据：p95 > 33ms 或 掉帧率 > 5% ⇒ 玩家能看出来在卡。 */
    say('[4b] 3 秒帧采样（特效在跑）');
    const framesRaw = await evaluate(`(function(){
      try{ openThread(Object.keys(S.threads).reduce(function(b,k){var t=S.threads[k];return (!b||(t.msgs||[]).length>(S.threads[b].msgs||[]).length)?k:b},null)); }catch(e){}
      return new Promise(function(res){
        var d=[],last=performance.now(),t0=last;
        function step(now){ d.push(now-last); last=now;
          if(now-t0<3000){ requestAnimationFrame(step) }
          else { var s=d.slice().sort(function(a,b){return a-b});
            var at=function(p){return s[Math.min(s.length-1,Math.max(0,Math.round((s.length-1)*p)))]};
            var over=d.filter(function(x){return x>33.4}).length;
            res(JSON.stringify({n:d.length, p50:+at(.5).toFixed(1), p95:+at(.95).toFixed(1), max:+Math.max.apply(null,d).toFixed(1), dropped:over, dropPct:+(100*over/d.length).toFixed(1), fps:+(1000/(d.reduce(function(a,b){return a+b},0)/d.length)).toFixed(0)}));
          }
        }
        requestAnimationFrame(step);
      });
    })()`, 20000);
    say('      ' + framesRaw);
    result.frames = JSON.parse(framesRaw);

    /* ---- 真发一轮：玩家打字 → 等 AI 回复。这是唯一还没量过的路径。---- */
    if (flag('send')) {
      say('[4c] 真发一轮（打字 → 等回复，期间采帧）');
      const sent = await evaluate(`(function(){
        try{
          var c=document.querySelector("#cin"); if(!c) return "no #cin";
          c.value="我拿起杯子，看着你。"; c.dispatchEvent(new Event("input",{bubbles:true}));
          var b=document.querySelector("[data-send]"); if(!b) return "no send btn";
          b.click(); return "sent";
        }catch(e){ return "ERR "+e.message }
      })()`);
      say('      ' + sent);
      const round = await evaluate(`new Promise(function(res){
        var d=[],last=performance.now(),t0=last,busySince=0;
        function step(now){ d.push(now-last); last=now;
          if(now-t0<25000){ requestAnimationFrame(step) }
          else { var s=d.slice().sort(function(a,b){return a-b});
            var at=function(p){return s[Math.min(s.length-1,Math.max(0,Math.round((s.length-1)*p)))]};
            var over=d.filter(function(x){return x>33.4}).length;
            var th=S.threads[curT];
            res(JSON.stringify({n:d.length,p50:+at(.5).toFixed(1),p95:+at(.95).toFixed(1),max:+Math.max.apply(null,d).toFixed(1),dropped:over,dropPct:+(100*over/d.length).toFixed(1),fps:+(1000/(d.reduce(function(a,b){return a+b},0)/d.length)).toFixed(0),msgs:th?th.msgs.length:-1}));
          }
        }
        requestAnimationFrame(step);
      })`);
      say('      ' + round);
      result.round = JSON.parse(round);
    }

    if (CHAPTERS > 0) {
      say('[5/6] 起点（强制新开一章，别接着上次半播的状态）');
      const setup = await evaluate(`(async function(){try{
        S.packs=S.packs||{};S.packs["${WORLD}"]={own:1,end:{}};S.pkSpd=1;
        Object.keys(S.threads).filter(function(id){return S.threads[id].wid==="${WORLD}"}).forEach(function(id){delete S.threads[id]});
        save();
        /* 探针：packRun 到底有没有被叫起来（只观测，不改行为） */
        if(!window.__RUNS){window.__RUNS=[];const _pr=window.packRun;
          window.packRun=function(th){try{window.__RUNS.push({t:Date.now(),id:th&&th.id,pk:(typeof PKPLAY!=="undefined")?PKPLAY[th.id]:null,q:(th&&th.pk&&th.pk.q||[]).length})}catch(e){}
            return _pr.apply(this,arguments)}}
        /* 再上一层：pkWait 进/出、pkDirective 判定、readMs 取值 —— 把「卡在哪个 await」钉住 */
        if(!window.__WAITLOG){window.__WAITLOG=[];
          var _pw=window.pkWait; window.pkWait=function(th,prev,spd,ms){var id=th&&th.id;
            window.__WAITLOG.push({ev:"enter",ms:Math.round(ms||0),spd:String(spd),pk:prev&&prev.k});
            var p=_pw.apply(this,arguments);
            try{p.then(function(){window.__WAITLOG.push({ev:"exit"})},function(e){window.__WAITLOG.push({ev:"reject",m:String(e&&e.message||e).slice(0,40)})})}catch(e){}
            return p};
          var _pd=window.pkDirective; window.pkDirective=function(th,b){var r=_pd.apply(this,arguments);
            try{if(Array.isArray(b)&&b[0]==="sys")window.__WAITLOG.push({ev:"directive",k:b[1],r:!!r})}catch(e){}
            return r};
        }
        var t=packStart("${WORLD}","watch",1);
        var taps=0;
        await new Promise(r=>setTimeout(r,1500));
        while(t.pk&&t.pk.stop&&taps<4){ try{PKWAIT[t.id]([])}catch(e){} taps++; await new Promise(r=>setTimeout(r,700)) }
        return JSON.stringify({id:t.id,ch:t.pk.ch,st:t.pk.st,msgs:t.msgs.length,taps:taps,
          q:((t.pk.q||[]).length), live:(curT===t.id),
          pkplay:(typeof PKPLAY!=="undefined")?PKPLAY[t.id]:null,
          stop:(t.pk.stop?String(t.pk.stop[0]+"/"+t.pk.stop[1]):null),
          runs:(window.__RUNS||[]).length,
          runIds:(window.__RUNS||[]).slice(0,4).map(function(x){return x.pk+":"+x.q}),
          waitlog:(window.__WAITLOG||[]).slice(-6),
          scHidden:(function(){var e=$("#s-chat");return e?!!e.hidden:"no-el"})()});
      }catch(e){return "ERR "+e.message}})()`);
      say('      ' + setup);
      if (String(setup).startsWith('ERR')) throw new Error(setup);
      result.setup = setup;
      say('[6/6] 真走 ' + CHAPTERS + ' 章');
      say('      ' + await evaluate(`__MIRUPERF.reset(); __PERFRUN.start({chapters:${CHAPTERS},choice:"${CHOICE}"})`));
      const t0 = Date.now();
      let last = '';
      while (Date.now() - t0 < 20 * 60000) {
        await sleep(6000);
        /* 2026-10-27：**替玩家点一下**。
           app101_you.js 的 tapMode 默认开着（S.pkTap101 未定义 ⇒ true），它把内层 pkWait 的 ms 设成 864e5（24 小时）
           ⇒ **每一句都等一次点击**，而点击处理器（app14_pack.js:501）调的是 `PKNEXT[curT]`，不是 `PKWAIT`。
           量尺不点这一下，就永远看到 msgs 不动 —— 那不是产品故障，是「点一下再播放」。 */
        try {
          await evaluate(`(function(){try{if(typeof PKNEXT!=="undefined"&&PKNEXT[curT]){PKNEXT[curT]();return "tapped"}return "no-latch"}catch(e){return "err"}})()`);
        } catch (_) {}
        let st;
        try { st = JSON.parse(await evaluate('__PERFRUN.status()')) } catch (e) { say('      poll err ' + e.message); continue }
        const line = `      ${Math.round((Date.now() - t0) / 1000)}s ch=${st.ch} st=${st.st} msgs=${st.msgs} runs=${st.runs} ${st.err || ''}`;
        if (line !== last) { say(line); last = line }
        if (st.done) break;
      }
      result.runs = JSON.parse(await evaluate('__PERFRUN.report()')).runs;
      result.probe = JSON.parse(await evaluate('__MIRUPERF.report()'));
    }

    /* 用和 Ann 存档同一把尺收尾：消息间隔分布。她存档里 21 段间隔精确落在 14 秒档，
       修好之后这一档应该消失（剧情句之间只剩阅读节奏 ~2 秒）。 */
    if (CHAPTERS > 0) {
      const gaps = await evaluate(`(function(){
        var th=S.threads[curT]; if(!th||!th.msgs) return "{}";
        var d=[]; for(var i=1;i<th.msgs.length;i++){var a=th.msgs[i-1].at,b=th.msgs[i].at; if(a&&b)d.push(+((b-a)/1000).toFixed(1))}
        var b={}; d.forEach(function(g){var k=Math.round(g/2)*2; b[k]=(b[k]||0)+1});
        var near=d.filter(function(g){return g>=12&&g<=16}).length;
        return JSON.stringify({msgs:th.msgs.length, near14:near, hist:b});
      })()`);
      say('\n间隔分布（和她存档同一把尺）: ' + gaps);
      result.gaps = JSON.parse(gaps);
    }

    /* ---- speak 对账表 ---- */
    if (flag('spy')) {
      const raw = await evaluate(`JSON.stringify(window.__SPY||[])`);
      const rows = JSON.parse(raw);
      result.spy = rows;
      const same = rows.filter(r => r.same).length;
      const qSame = rows.filter(r => r.qsame).length;
      say('\n=== speak 对账（念的 vs 屏幕最后一条 / vs 待播队头）===');
      say('共 ' + rows.length + ' 次 · 与屏幕最后一条**一致** ' + same + ' · **不一致** ' + (rows.length - same) + ' · 与待播队头一致 ' + qSame);
      say('路径分布：录音包命中 ' + rows.filter(r => r.rec).length + ' · 服务器TTS可用 ' + rows.filter(r => r.tts).length + ' · AVDEAD=' + (rows.length ? rows[rows.length - 1].avdead : '-'));
      for (const r of rows.slice(0, 20)) {
        say('  ' + (r.same ? '✓' : '✗') + ' [' + r.id + '] 念「' + r.text.slice(0, 30) + '」' + (r.rec ? ' (录音)' : '') + ' | 屏幕「' + r.last.slice(0, 30) + '」·' + r.lastWho + ' | 队头「' + String(r.qhead || '').slice(0, 30) + '」q=' + r.qlen);
      }

      /* ---- 每句等多久 ---- */
      const wRaw = await evaluate(`JSON.stringify(window.__WAIT||[])`);
      const waits = JSON.parse(wRaw);
      result.waits = waits;
      if (waits.length) {
        const ratios = waits.map(w => (w.ms ? w.actual / w.ms : 0)).sort((a, b) => a - b);
        const at = p => ratios[Math.min(ratios.length - 1, Math.round((ratios.length - 1) * p))];
        const over = waits.filter(w => w.actual > w.ms + 500).length;
        say('\n=== 每句等多久（' + waits.length + ' 句）===');
        say('实际/应等 比值：p50 ' + at(.5).toFixed(2) + ' · p95 ' + at(.95).toFixed(2) + ' · 最大 ' + ratios[ratios.length - 1].toFixed(2)
          + ' · **超出应等 0.5 s 的 ' + over + ' 句**');
        for (const w of waits.slice(0, 12)) {
          say('  应等 ' + w.ms + 'ms → 实等 ' + w.actual + 'ms (x' + (w.ms ? (w.actual / w.ms).toFixed(2) : '-') + ') avdead=' + w.av + ' 「' + w.txt + '」');
        }
      }
      const audRaw = await evaluate(`JSON.stringify(window.__AUD||[])`);
      const aud = JSON.parse(audRaw);
      result.aud = aud;
      // 录音包指纹：长度 → 文本
      const packs = [];
      for (const f of ['audio/zh.json', 'audio/en.json']) {
        try { const j = JSON.parse(fs.readFileSync(f, 'utf8')); for (const k of Object.keys(j)) packs.push({ len: j[k].length, text: k.split('|').slice(1).join('|'), who: k.split('|')[0], pack: f }); } catch (_) {}
      }
      const byLen = new Map();
      for (const p of packs) { if (!byLen.has(p.len)) byLen.set(p.len, []); byLen.get(p.len).push(p) }
      say('\n=== 实际播放的音频（' + aud.length + ' 次）===');
      const kinds = {};
      for (const a of aud) kinds[a.kind] = (kinds[a.kind] || 0) + 1;
      say('来源分布：' + JSON.stringify(kinds));
      for (const a of aud.slice(0, 16)) {
        let whose = '';
        if (a.kind === 'data') {
          const cand = byLen.get(a.len) || [];
          whose = cand.length === 1 ? ('录音包 · ' + cand[0].who + '「' + cand[0].text.slice(0, 40) + '」') : (cand.length ? ('录音包 · ' + cand.length + ' 个同长度候选') : 'data URI（非录音包 / 服务器 TTS 缓存）');
        } else if (a.kind === 'device') whose = '设备语音「' + a.head + '」';
        else whose = a.kind + ' ' + a.head.slice(0, 30);
        say('  [' + a.kind + '] len=' + a.len + ' → ' + whose);
      }
    }

    /* ---- 复现模式：接着她存档里某条线程的待播队列跑，不新开章 ----
       用法：--resume <线程id> --secs 60 */
    if (opt('resume')) {
      const tid = opt('resume');
      const secs = Number(opt('secs', 60));
      say('[4r] 接着跑线程 ' + tid + '（不新开章）');
      const st = await evaluate(`(function(){try{
        const th=S.threads[${JSON.stringify(tid)}]; if(!th) return "no thread";
        openThread(th.id);
        const q=(th.pk&&th.pk.q)||[];
        const head=q[0]?(Array.isArray(q[0])?String(q[0][2]):String(q[0])):"";
        try{packRun(th)}catch(e){return "packRun threw: "+e.message}
        return JSON.stringify({id:th.id,wid:th.wid,ch:th.pk&&th.pk.ch,st:th.pk&&th.pk.st,q:q.length,msgs:th.msgs.length,head:head.slice(0,60)});
      }catch(e){return "ERR "+e.message}})()`);
      say('      ' + st);
      const t0 = Date.now();
      while (Date.now() - t0 < secs * 1000) {
        await sleep(4000);
        /* 调试读数：为什么不放 beat —— live / 播放器状态 / 队头 / 已显示条数 */
        const dbg = await evaluate(`JSON.stringify((function(){try{
          var th=S.threads[${JSON.stringify(tid)}]; var q=(th&&th.pk&&th.pk.q)||[];
          var head=q[0]?(Array.isArray(q[0])?(q[0][0]+"/"+q[0][1]):String(q[0])):"-";
          var sc=(typeof $==="function")?$("#s-chat"):null;
          return {live:!!(curT===th.id&&sc&&!sc.hidden), curT:curT, wid:th&&th.wid,
            pk:{ch:th.pk&&th.pk.ch,st:th.pk&&th.pk.st,q:q.length,unread:th._unread,held:th._held,after:th.pk&&th.pk.after},
            pkplay:(typeof PKPLAY!=="undefined")?PKPLAY[th.id]:null,
            pknext:!!(typeof PKNEXT!=="undefined"&&PKNEXT[th.id]), pkwait:!!(typeof PKWAIT!=="undefined"&&PKWAIT[th.id]),
            msgs:th.msgs.length, avskip:(typeof AVSKIP!=="undefined"?AVSKIP:-1), avdeadsilent:(typeof AVSILENT!=="undefined"?AVSILENT:-1),
            head:head};}catch(e){return {err:String(e.message)}}})())`);
        say('      ' + Math.round((Date.now() - t0) / 1000) + 's  ' + dbg);
      }
    }

    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(result, null, 2), 'utf8');
    say('\n写到 ' + OUT);

    const f = n => (typeof n === 'number' ? n.toFixed(1) : String(n));
    say('\n=== 三格 ===');
    const tm = result.quick.timing || {};
    say('页面加载（本次导航）: TTFB ' + tm.ttfb + 'ms · HTML ' + tm.html + 'ms · DOMInteractive ' + tm.domInteractive + 'ms · DCL ' + tm.dcl + 'ms · load ' + tm.load + 'ms · 传输 ' + tm.transferKB + ' KB'
      + (CPU > 1 ? '（CPU x' + CPU + '）' : '') + (NET ? '（网络 ' + NET + '）' : ''));
    say('线程: ' + result.quick.thread.wid + ' · 消息 ' + result.quick.thread.msgs + ' 条');
    say('进 thread（打开一条已有的 30-55 条消息的线程）: ' + f(result.quick.openThreadMs) + ' ms');
    say('renderChat 单次（整屏重建）: 均 ' + f(result.quick.renderChat.ms) + ' ms / 峰 ' + f(result.quick.renderChat.max) + ' ms');
    say('save 单次（整份 S 序列化 + 同步写盘）: 均 ' + f(result.quick.save.ms) + ' ms / 峰 ' + f(result.quick.save.max) + ' ms · 存档 ' + result.quick.save.bytes + ' B');
    say('chatBgSet 单次（每落一条消息都调，内含强制重排）: 均 ' + f(result.quick.chatBgSet.ms) + ' ms / 峰 ' + f(result.quick.chatBgSet.max) + ' ms');
    say('规模: DOM ' + result.quick.scale.domNodes + ' 节点 · #msgs 子节点 ' + result.quick.scale.msgsNodes);
    if (result.frames) say('帧率: ' + result.frames.fps + ' fps · p50 ' + result.frames.p50 + 'ms · p95 ' + result.frames.p95 + 'ms · 最长 ' + result.frames.max + 'ms · 掉帧 ' + result.frames.dropped + '/' + result.frames.n + ' (' + result.frames.dropPct + '%)');

    if (result.runs && result.runs.length) {
      /* 2026-10-27 Ann：「say 类不发声」。这一跑结束后直接对账：屏幕上出现过的 say 台词，
         有多少条真的进了 `S._voiceLog`（said / silent / unvoiced 三档），并列出没发声的那几条。 */
      try {
        const va = JSON.parse(await evaluate(`JSON.stringify((function(){try{
          var th=S.threads[curT]; if(!th) return {err:"no-th"};
          var says=th.msgs.filter(function(m){return m.k==="say"&&m.who&&m.who!=="me"&&m.who!=="n"&&m.who!=="sys"});
          var log=S._voiceLog||[];
          var said=log.filter(function(e){return e.ev==="said"}).length;
          var sil =log.filter(function(e){return e.ev==="silent"}).length;
          var unv =log.filter(function(e){return e.ev==="unvoiced"});
          var saidSay=log.filter(function(e){return e.ev==="said"&&e.k==="say"}).length;
          return {says:says.length, said:said, silent:sil, unvoiced:unv.length,
                  saidSay:saidSay, unvSample:unv.slice(-4).map(function(e){return (e.who||"?")+"「"+(e.txt||"")+"」"+e.why}),
                  lastSays:says.slice(-4).map(function(m){return m.who+"「"+String(m.txt||"").slice(0,18)+"」"})};
        }catch(e){return {err:String(e.message)}}})())`));
        say('\n=== 语音对账（这条线程）===');
        say('  say 台词 ' + va.says + ' 条 · 记到 said ' + va.said + ' 条（其中 k=say 的 ' + va.saidSay + '）· silent ' + va.silent + ' · **unvoiced ' + va.unvoiced + '**');
        if (va.unvSample && va.unvSample.length) say('  没发声的样本: ' + va.unvSample.join(' | '));
        if (va.lastSays) say('  最后几条台词: ' + va.lastSays.join(' | '));
        result.voiceAudit = va;
      } catch (e) { say('  语音对账失败: ' + e.message) }
      say('\n章 | 墙钟 | save 次数/累计 | renderChat 次数/累计 | 长任务 n/ms/max | 掉帧 | msgs 前→后');
      for (const r of result.runs) {
        if (r.phase !== 'main') continue;
        say(`${r.ch} | ${f(r.wallMs)} | ${r.saveCalls}/${f(r.saveMs)} | ${r.renderChatCalls}/${f(r.renderChatMs)} | ${r.ltN}/${f(r.ltMs)}/${f(r.ltMax)} | ${r.framesDropped} | ${r.msgsBefore}→${r.msgsAfter}`);
      }
    }
    ws.close();
  } finally {
    cleanup();
    await sleep(300);
    try { fs.rmSync(profile, { recursive: true, force: true }) } catch (_) {}
  }
}

main().catch(e => { console.error('失败: ' + e.message); process.exit(1) });
