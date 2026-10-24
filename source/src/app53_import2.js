/* ---- v153 · 上传剧本：也能读 .pdf 和老的 .doc ----
   .pdf → bundled pdf.js (no network; text layer, page by page). Scanned PDFs that are only pictures have no text and are reported.
   .doc (Word 97–2003) → a small compound-file reader that walks the piece table of the WordDocument stream. */
let PDFJS_P=null;
function imRunSrc(src){return new Promise((res,rej)=>{try{const u=URL.createObjectURL(new Blob([src],{type:"text/javascript"}));const sc=document.createElement("script");sc.src=u;sc.onload=()=>res();sc.onerror=()=>{try{(0,eval)(src);res()}catch(e){rej(e)}};document.head.appendChild(sc)}catch(e){try{(0,eval)(src);res()}catch(e2){rej(e2)}}})}
/* PDF.js 的 1.4 MB 不再进主包（2026-10-25）：只有真的要导入 PDF 时才去取 pdfjs_embed.js。
   它只是给 window 挂两个字符串，取回来再走原来的 imRunSrc，行为与以前一模一样。
   取不到（离线/文件没部署）时把错误抛给调用方，导入面板会照常提示「读不了这个文件」。 */
function imLoadPdfjs(done, fail){
  if(window.PDFJS_SRC) return done();
  const sc=document.createElement("script");
  sc.src="pdfjs_embed.js";
  sc.onload=()=>done();
  sc.onerror=()=>fail(new Error("pdfjs not available"));
  document.head.appendChild(sc);
}
function imPdfLib(){if(!PDFJS_P)PDFJS_P=new Promise((res,rej)=>{imLoadPdfjs(async()=>{try{if(!window.pdfjsLib)await imRunSrc(window.PDFJS_SRC);if(!window.pdfjsWorker)await imRunSrc(window.PDFJS_WORKER_SRC);const L=window.pdfjsLib||window["pdfjs-dist/build/pdf"];if(!L)throw "pdfjs";res(L)}catch(e){rej(e)}},rej)});return PDFJS_P}
async function imPdf(buf){const L=await imPdfLib();const pdf=await L.getDocument({data:new Uint8Array(buf),isEvalSupported:false,useSystemFonts:true}).promise;const out=[];
 for(let i=1;i<=pdf.numPages;i++){const pg=await pdf.getPage(i),tc=await pg.getTextContent();const rows=[];tc.items.forEach(it=>{if(!it.str)return;const x=it.transform[4],y=it.transform[5];let r=rows.find(r2=>Math.abs(r2.y-y)<=Math.max(2,(it.height||10)*0.35));if(!r){r={y,its:[]};rows.push(r)}r.its.push({x,s:it.str})});
  rows.sort((r1,r2)=>r2.y-r1.y).forEach(r=>out.push(r.its.sort((a1,a2)=>a1.x-a2.x).map(z=>z.s).join("").replace(/\s+([，。！？：；、”」）])/g,"$1").replace(/([“「（])\s+/g,"$1").replace(/\s*“\s*”\s*/g,"").replace(/\s*「\s*」\s*/g,"")));out.push("")}
 /* PDF text is cut at the page edge: glue a line back onto the previous one when it doesn't look like a new paragraph */
 const merged=[];out.forEach(l=>{const t2=l.trim();const prev=merged[merged.length-1];if(t2&&prev&&!/[。！？!?”」"…：:）)]$/.test(prev)&&!/^(#|第.{1,4}章|CHAPTER|SCENE|CHOICE|[A-E][｜|.、]|入口|【|[^\s：:]{1,12}[：:])/i.test(t2)&&prev.length>18)merged[merged.length-1]=prev+t2;else merged.push(t2)});
 const txt=merged.join("\n");if(txt.replace(/\s/g,"").length<30)throw "scanned";return txt}
/* ---- .doc: compound file binary format ---- */
function imCfb(buf){const dv=new DataView(buf),u8=new Uint8Array(buf);if(dv.getUint32(0,true)!==0xE011CFD0)throw "notcfb";
 const ss=1<<dv.getUint16(30,true),mss=1<<dv.getUint16(32,true),nFat=dv.getUint32(44,true),dir0=dv.getUint32(48,true),cut=dv.getUint32(56,true),mf0=dv.getUint32(60,true),dif0=dv.getUint32(68,true);
 const sec=n=>512+n*ss;const difat=[];for(let i=0;i<109&&difat.length<nFat;i++)difat.push(dv.getUint32(76+i*4,true));
 let d=dif0;while(difat.length<nFat&&d<0xFFFFFFFA){for(let i=0;i<ss/4-1&&difat.length<nFat;i++)difat.push(dv.getUint32(sec(d)+i*4,true));d=dv.getUint32(sec(d)+ss-4,true)}
 const fat=[];difat.forEach(s2=>{for(let i=0;i<ss/4;i++)fat.push(dv.getUint32(sec(s2)+i*4,true))});
 const chain=(st,t)=>{const r=[];let c=st,g=0;while(c<0xFFFFFFFA&&g++<1e6){r.push(c);c=t[c]}return r};
 const read=st=>{const ch2=chain(st,fat),o=new Uint8Array(ch2.length*ss);ch2.forEach((c,i)=>o.set(u8.subarray(sec(c),sec(c)+ss),i*ss));return o};
 const dirB=read(dir0),ents=[];for(let o=0;o+128<=dirB.length;o+=128){const dd=new DataView(dirB.buffer,o,128),nl=dd.getUint16(64,true);if(!nl)continue;
  let name="";for(let k=0;k<nl/2-1;k++)name+=String.fromCharCode(dd.getUint16(k*2,true));ents.push({name,type:dd.getUint8(66),start:dd.getUint32(116,true),size:dd.getUint32(120,true)})}
 const root=ents.find(e=>e.type===5),mini=root?read(root.start):new Uint8Array(0),mfat=[];if(mf0<0xFFFFFFFA)chain(mf0,fat).forEach(s2=>{for(let i=0;i<ss/4;i++)mfat.push(dv.getUint32(sec(s2)+i*4,true))});
 return name=>{const e=ents.find(x=>x.name===name);if(!e)return null;if(e.size<cut&&e.type===2){const ch2=chain(e.start,mfat),o=new Uint8Array(ch2.length*mss);ch2.forEach((c,i)=>o.set(mini.subarray(c*mss,c*mss+mss),i*mss));return o.subarray(0,e.size)}return read(e.start).subarray(0,e.size)}}
function imDoc(buf){const get=imCfb(buf),wd2=get("WordDocument");if(!wd2)throw "noword";const W=new DataView(wd2.buffer,wd2.byteOffset,wd2.byteLength);
 if(W.getUint16(0,true)!==0xA5EC)throw "fib";if(W.getUint16(0x0B,true)&0x01)throw "encrypted";
 const tbl=get((W.getUint16(0x0A,true)&0x0200)?"1Table":"0Table");if(!tbl)throw "table";const fcClx=W.getUint32(0x01A2,true),lcbClx=W.getUint32(0x01A6,true);
 const T=new DataView(tbl.buffer,tbl.byteOffset,tbl.byteLength);let p=fcClx;const end=fcClx+lcbClx;let txt="";
 while(p<end){const k=T.getUint8(p);if(k===1){p+=3+T.getUint16(p+1,true);continue}if(k!==2)break;const lcb=T.getUint32(p+1,true),b=p+5,n=(lcb-4)/12;
  for(let i=0;i<n;i++){const cp0=T.getUint32(b+i*4,true),cp1=T.getUint32(b+(i+1)*4,true),pcd=b+(n+1)*4+i*8;let fc=T.getUint32(pcd+2,true);const comp=!!(fc&0x40000000),len=cp1-cp0;
   if(comp){fc=(fc&~0x40000000)>>>1;txt+=new TextDecoder("windows-1252").decode(wd2.subarray(fc,fc+len))}else txt+=new TextDecoder("utf-16le").decode(wd2.subarray(fc,fc+len*2))}
  break}
 if(!txt){/* very old or odd files: fall back to the UTF-16 runs in the document stream */const m=new TextDecoder("utf-16le").decode(wd2).match(/[ -~　-〿一-鿿＀-￯\r“”‘’…—]{6,}/g);txt=(m||[]).join("\r")}
 /* field codes: drop the instruction part ( \x13 instr \x14 result \x15 ) */
 txt=txt.replace(/\x13[^\x14\x15]*\x14/g,"").replace(/[\x13\x15]/g,"").replace(/[\r\x0b\x0c]/g,"\n").replace(/\x07/g,"\t").replace(/[\x00-\x08\x0e-\x1f]/g,"");return txt}
window.addEventListener("change",async e=>{if(e.target.id!=="imFile"||!e.target.files||!e.target.files[0])return;const f=e.target.files[0];if(!/\.(pdf|doc)$/i.test(f.name))return;
 e.stopImmediatePropagation();if(f.size>10e6){toast(LL("文件太大（最大 10MB）","File too large (max 10MB)"));return}
 toast(LL("正在读取 "+f.name+" ……","Reading "+f.name+"…"));
 try{const buf=await f.arrayBuffer();const txt=/\.pdf$/i.test(f.name)?await imPdf(buf):imDoc(buf);imLoad(txt,f.name)}
 catch(err){toast(err==="scanned"?LL("这个 PDF 是扫描图片，没有文字层。请导出带文字的 PDF，或另存为 .docx / .txt","This PDF is scanned images with no text. Export a text PDF, or save as .docx / .txt"):
  err==="encrypted"?LL("这个文档加了密码，请先取消密码再上传","This document is password-protected — remove the password first"):LL("读不出这个文件，可能已损坏","Couldn't read this file — it may be damaged"))}e.target.value=""},true);
