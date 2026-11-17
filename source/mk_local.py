import os,json,argparse,pathlib
parser=argparse.ArgumentParser(description="Build a private local LongCat demo; do not share its output.")
parser.add_argument("--input",default="index.html")
parser.add_argument("--output",default="reports/MIRU_local_LongCat.html")
args=parser.parse_args()
key=os.environ.get("LONGCAT_API_KEY","").strip()
if not key: parser.error("LONGCAT_API_KEY must be set in the environment")
s=open(args.input,encoding='utf8').read()
inj='<script>/* local build: LongCat preset (do not share this file) */try{if(!localStorage.getItem("miru.lc.key"))localStorage.setItem("miru.lc.key",__MIRU_LOCAL_KEY__);window.MIRU_LC_PRESET=1}catch(_){}</script>'
inj=inj.replace("__MIRU_LOCAL_KEY__",json.dumps(key).replace("<", "\\u003c"))
selftest='''<script>/* local build: show a one-line LongCat check on open */window.addEventListener("load",()=>setTimeout(async()=>{try{if(typeof lcApply!=="function")return;lcCfg().provider="longcat";lcApply();const b=document.createElement("div");b.id="lcbanner";b.style.cssText="position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:99999;max-width:92vw;padding:10px 16px;border-radius:14px;font:600 14px/1.4 system-ui;background:#2a2333;color:#fff;border:1px solid #f0b77e;box-shadow:0 6px 24px #0008;cursor:pointer";b.textContent="正在连接 LongCat…";b.onclick=()=>b.remove();document.body.appendChild(b);const t0=Date.now();let r;try{r=await SAMPLE("用一句不超过15个字的中文打招呼。",{modelTier:"quick"})}catch(e){r={err:e}}b.textContent=r&&r.text?"✓ LongCat 已连接（"+(Date.now()-t0)+"ms）："+r.text:"✗ LongCat 没连上："+(r.err&&(r.err.code+" "+(r.err.message||""))||"无回复");setTimeout(()=>b.remove(),15000)}catch(_){}},2500))</script>'''
i=s.find('<script');s=s[:i]+inj+s[i:]
s=s.replace('function lcCfg(){S.ai=S.ai||{provider:"claude",','function lcCfg(){S.ai=S.ai||{provider:window.MIRU_LC_PRESET?"longcat":"claude",',1)
j=-1
s=(s[:j]+selftest+s[j:]) if j>0 else s+selftest
pathlib.Path(args.output).parent.mkdir(parents=True,exist_ok=True)
open(args.output,'w',encoding='utf8').write(s)
