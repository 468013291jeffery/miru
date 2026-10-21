/* ================= v3.6 · AI PICTURES via Qwen (z-image-turbo for new pictures, wan2.5-i2i for "same face, new scene") =================
   Every existing picture feature (story stills, covers, creator art, photo booth) calls AIG.mcp.callTool(srv, tool, args).
   On the MIRU site this shim answers those calls through POST /api/tts {img} instead of the claude.ai connector,
   returning the same MCP-style result ({content:[{type:"image",data,mimeType}]}), so nothing else had to change. */
const QIMG={ep:typeof TTS_EP!=="undefined"?TTS_EP:""};
/* big uploads to the model region are slow (1MB ≈ 40s+) → send a small JPEG of the reference */
function qimgShrink(src,max){return new Promise(ok=>{const im=new Image();im.crossOrigin="anonymous";im.onload=()=>{try{const s=Math.min(1,max/Math.max(im.naturalWidth,im.naturalHeight)),c=document.createElement("canvas");c.width=Math.round(im.naturalWidth*s);c.height=Math.round(im.naturalHeight*s);c.getContext("2d").drawImage(im,0,0,c.width,c.height);ok(c.toDataURL("image/jpeg",.85))}catch(_){ok(src)}};im.onerror=()=>ok(src);im.src=src})}
const QIMG_MCP={async callTool(srv,tool,a){a=a||{};
 if(tool===AIG.tts){const e=new Error("voice via connector not available");e.code="tool_error";throw e}
 const body={img:{prompt:String(a.prompt||""),w:a.width||768,h:a.height||1024}};if(tool===AIG.edit&&a.input_image)body.img.image=await qimgShrink(a.input_image,560);
 const r=await fetch(QIMG.ep,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const j=await r.json().catch(()=>({}));
 if(r.ok&&j.task){for(let i=0;i<40;i++){await new Promise(z=>setTimeout(z,3000));let p;try{p=await fetch(QIMG.ep+"?imgtask="+encodeURIComponent(j.task)).then(x=>x.json())}catch(_){continue}
   if(p.state==="success"&&p.data)return {content:[{type:"image",data:p.data,mimeType:p.mime||"image/png"}]};if(p.state==="failed"){const e=new Error(p.err||"edit failed");e.code="tool_error";throw e}}
  const e=new Error("edit timeout");e.code="tool_error";throw e}
 if(!r.ok||!j.data){const e=new Error(String(j.error||r.status));e.code=r.status===429?"rate_limited":"tool_error";throw e}
 return {content:[{type:"image",data:j.data,mimeType:j.mime||"image/png"}]}}};
function qimgOn(){if(QIMG.ep&&typeof AIG==="object")AIG.mcp=QIMG_MCP}
qimgOn();setTimeout(qimgOn,0);setTimeout(qimgOn,500);
