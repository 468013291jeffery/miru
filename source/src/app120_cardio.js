/* ================= 通用角色卡导入 / 导出（v9 · 第十九批 · 2026-11-03）=================
   读写行业通用的角色卡格式（SillyTavern 等用的 Character Card V2：chara_card_v2），
   这样外部创作者做好的角色能直接进 MIRU，MIRU 的角色也能带出去。

   导入（「我的」页 → ⇧ 导入角色卡）：.json，或把数据藏在图里的 .png（tEXt 块 chara / ccv3，base64 的 JSON）。
     name → 名字 · description → 外貌与设定 · personality → 性格 · scenario → 故事背景 · first_mes → 开场白
     mes_example → 说话示例 · tags → 标签 · character_book.entries → 设定集（接 app117，命中关键词才带）
     PNG 的图本身 → 头像。{{user}} → 你，{{char}} → 他的名字。
   安全闸（不过不让进）：写明或暗示未成年（年龄 < 18、学生年级、child / minor / loli 等）一律拒收；
     年龄写不清的按 25 岁处理，低于 21 的抬到 21（与创建器同一条线）。
   导出：角色页的 ⇩ 按钮 → 有头像就出 PNG（图里带数据，外部工具直接能读），拿不到图就出 JSON；
     「我的角色卡」也能导出成同一格式（名字、外貌、喜欢、不喜欢写进对应字段）。
   往返：MIRU 自己的字段放在 data.extensions.miru，导出再导入不丢。 */
(function () {
  "use strict";
  const zh = () => (typeof CL === "function" ? CL() === "zh" : S.lang === "zh");
  const L2 = (a, b) => zh() ? a : b;
  const x0 = s => ({ en: s, zh: s });
  const MINOR = /(未成年|小学生|初中生|高中生|中学生|萝莉|正太|幼女|童颜巨|\bloli\b|\bshota\b|\bminor\b|\bunderage\b|\bchild\b|\bkid\b|\bteen(?:ager)?\b|\bhigh[- ]?school(?:er)?\b|\bmiddle[- ]?school\b|\b1[0-7]\s*(?:-|\s)?(?:years?[- ]old|y\/?o)\b|(?:^|\D)1[0-7]\s*岁)/i;

  /* ---------- PNG tEXt 读写 ---------- */
  const CRC = (function () { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(u8) { let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = CRC[(c ^ u8[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function pngText(buf) {
    const u8 = new Uint8Array(buf), dv = new DataView(buf), out = {};
    if (u8[0] !== 0x89 || u8[1] !== 0x50) return out;
    let p = 8;
    while (p + 8 <= u8.length) {
      const len = dv.getUint32(p), type = String.fromCharCode(u8[p + 4], u8[p + 5], u8[p + 6], u8[p + 7]);
      if (type === "tEXt") {
        const d = u8.subarray(p + 8, p + 8 + len); const z = d.indexOf(0);
        if (z > 0) { const k = String.fromCharCode.apply(null, d.subarray(0, z)); out[k] = String.fromCharCode.apply(null, d.subarray(z + 1)); }
      }
      if (type === "IEND") break;
      p += 12 + len;
    }
    return out;
  }
  function b64utf8(s) { const bin = atob(String(s).trim()); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return new TextDecoder().decode(u); }
  function utf8b64(s) { const u = new TextEncoder().encode(s); let bin = ""; for (let i = 0; i < u.length; i += 0x8000) bin += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(bin); }
  function pngWithText(pngBuf, key, text) {
    const u8 = new Uint8Array(pngBuf); const dv = new DataView(pngBuf);
    let p = 8, iend = -1;
    while (p + 8 <= u8.length) { const len = dv.getUint32(p); const type = String.fromCharCode(u8[p + 4], u8[p + 5], u8[p + 6], u8[p + 7]); if (type === "IEND") { iend = p; break; } p += 12 + len; }
    if (iend < 0) throw new Error("bad png");
    const kb = new TextEncoder().encode(key), tb = new Uint8Array(text.length); for (let i = 0; i < text.length; i++) tb[i] = text.charCodeAt(i) & 255;
    const data = new Uint8Array(kb.length + 1 + tb.length); data.set(kb, 0); data[kb.length] = 0; data.set(tb, kb.length + 1);
    const chunk = new Uint8Array(12 + data.length); const cv = new DataView(chunk.buffer);
    cv.setUint32(0, data.length); chunk.set([0x74, 0x45, 0x58, 0x74], 4); chunk.set(data, 8);
    cv.setUint32(8 + data.length, crc32(chunk.subarray(4, 8 + data.length)));
    const out = new Uint8Array(u8.length + chunk.length); out.set(u8.subarray(0, iend), 0); out.set(chunk, iend); out.set(u8.subarray(iend), iend + chunk.length);
    return out;
  }

  /* ---------- 卡 → MIRU ---------- */
  function cardData(obj) {
    if (!obj || typeof obj !== "object") return null;
    if (obj.data && (obj.spec === "chara_card_v2" || obj.spec === "chara_card_v3" || obj.data.name)) return obj.data;
    if (obj.name || obj.char_name) return { name: obj.name || obj.char_name, description: obj.description || obj.char_persona || "", personality: obj.personality || "", scenario: obj.scenario || obj.world_scenario || "", first_mes: obj.first_mes || obj.char_greeting || "", mes_example: obj.mes_example || obj.example_dialogue || "", tags: obj.tags || [] };
    return null;
  }
  function checkCard(d) {
    const all = [d.name, d.description, d.personality, d.scenario, d.first_mes, (d.tags || []).join(" ")].join("\n");
    const ext = (d.extensions && d.extensions.miru) || {};
    if (ext.age && +ext.age < 18) return L2("这个角色写明未满 18 岁，MIRU 不能导入。", "This character is under 18 — MIRU can't import it.");
    if (MINOR.test(all)) return L2("角色卡里有未成年相关的描述，MIRU 不能导入。", "The card describes a minor — MIRU can't import it.");
    if (!String(d.name || "").trim()) return L2("角色卡里没有名字。", "The card has no name.");
    return "";
  }
  function guessAge(d) {
    const ext = (d.extensions && d.extensions.miru) || {};
    if (ext.age) return Math.max(21, +ext.age || 25);
    const m = /(\d{2})\s*(?:岁|years?[- ]old|y\/?o)/i.exec([d.description, d.personality].join(" "));
    return Math.max(21, m ? +m[1] : 25);
  }
  function guessG(d) {
    const ext = (d.extensions && d.extensions.miru) || {};
    if (ext.g === "f" || ext.g === "m") return ext.g;
    const s = [d.description, d.personality].join(" ");
    const f = (s.match(/\b(she|her|hers|woman|girl)\b|她|女/gi) || []).length, m = (s.match(/\b(he|him|his|man|guy)\b|他|男/gi) || []).length;
    return f > m ? "f" : "m";
  }
  function importCard(obj, avatarUrl) {
    const d = cardData(obj); if (!d) { toast(L2("看不懂这个文件：不是角色卡", "Couldn't read this file as a character card")); return null; }
    const bad = checkCard(d); if (bad) { toast("⛔ " + bad); return null; }
    const name = String(d.name).trim().slice(0, 40);
    /* 导出的是「我的角色卡」（extensions.miru.persona）⇒ 导回来还是一张玩家角色卡，不是一个新角色 */
    const pe = d.extensions && d.extensions.miru;
    if (pe && pe.persona) {
      const P = { id: "p" + Date.now(), name: name, pron: pe.g === "m" ? "he" : pe.g === "f" ? "she" : "they", age: pe.age || "", look: pe.looks || "", like: pe.likes || "", dislike: pe.dislike || "", bio: pe.bio || "", label: pe.label || "" };
      if (avatarUrl) P.img = avatarUrl;
      S.personas.push(P); S.pid = P.id; save();
      toast(L2("已导入你的角色卡「" + name + "」，并设为当前", "Imported your role card \u201c" + name + "\u201d and set it active"));
      try { if (typeof rerender === "function") rerender(); } catch (e) { console.warn("[card] rerender", e); }
      return P.id;
    }
    /* {{user}}：中文句子里换成「你」，其他语言换成玩家的名字（没有名字就是 you） */
    const sub = s => { s = String(s || ""); const u = /[\u4e00-\u9fff]/.test(s) ? "你" : ((typeof me === "function" && me() && me() !== "You") ? me() : "you"); return s.replace(/\{\{\s*user\s*\}\}/gi, u).replace(/\{\{\s*char\s*\}\}/gi, name).replace(/<USER>/g, u).replace(/<BOT>/g, name).trim(); };
    const ext = (d.extensions && d.extensions.miru) || {};
    const id = "u" + Date.now(), wid = "uw" + Date.now(), g = guessG(d), age = guessAge(d);
    const pal = [["#C98A6B", "#1B1520"], ["#7A63C9", "#141024"], ["#5E9E96", "#13212A"]][hash(id) % 3];
    const first_ = sub(d.first_mes) || (zh() ? "……你来了。" : "…You came.");
    const by = "@" + String(d.creator || (me() || "you")).toLowerCase().replace(/\s+/g, "").slice(0, 24);
    S.mine.chars[id] = {
      n: name, age: age, g: g, h: ext.h || "", w: wid, pal: pal, a: "charm", v: { pitch: 1, rate: 1 }, by: by,
      role: x0(sub(ext.role || d.creator_notes || "").slice(0, 200) || sub(d.scenario).slice(0, 120)),
      looks: x0(sub(ext.looks || d.description).slice(0, 600)),
      vibe: x0(sub(ext.vibe || d.personality || d.description).slice(0, 600)),
      tells: { en: [], zh: [] }, twist: x0(""), likes: x0(sub(ext.likes || "")), secret: x0(sub(ext.secret || "")),
      pitch: x0("“" + first_.replace(/\*[^*]*\*/g, "").trim().slice(0, 80) + "”"), solo: x0(first_),
      examples: sub(d.mes_example).slice(0, 1500), imported: { spec: obj.spec || "v1", at: Date.now(), creator: d.creator || "" }
    };
    const lore = ((d.character_book && d.character_book.entries) || []).filter(e => e && e.enabled !== false && (e.content || "").trim())
      .map(e => ({ keys: (e.keys || e.key || []).map(String).map(s => s.trim()).filter(Boolean), txt: sub(e.content).slice(0, 300), only: [] }))
      .filter(e => e.keys.length).slice(0, 60);
    S.mine.worlds[wid] = { id: wid, or: g === "f" ? "gl" : "bl", cover: null, pal: pal, author: by, official: false, stats: [0, 0, 0], heat: S.heat, cast: [id],
      tags: (d.tags || []).map(String).slice(0, 6), title: x0(name), hook: x0(sub(ext.hook || d.creator_notes || d.scenario).slice(0, 80)), premise: x0(sub(d.scenario).slice(0, 600)),
      you: x0(""), warn: x0(""), rel: [], status: { time: x0(""), place: x0("") }, openings: [], lore: lore };
    if (avatarUrl) S.art[id] = avatarUrl;
    S.works.unshift({ id: id, kind: "char", title: name, at: Date.now(), seed: 0 });
    save();
    toast(L2("已导入「" + name + "」" + (lore.length ? "，带 " + lore.length + " 条设定" : ""), "Imported " + name + (lore.length ? " with " + lore.length + " lore entries" : "")));
    try { if (typeof track === "function") track("card_import", { spec: obj.spec || "v1", lore: lore.length }); } catch (e) { console.warn("[card] track", e); }
    try { openChar(id); } catch (e) { console.warn("[card] open", e); }
    return id;
  }
  async function shrink(buf, type) {
    const url = URL.createObjectURL(new Blob([buf], { type: type || "image/png" }));
    try {
      const im = await new Promise((res, rej) => { const i = new Image(); i.addEventListener("load", () => res(i)); i.addEventListener("error", rej); i.src = url; });
      const k = Math.min(1, 640 / Math.max(im.width, im.height)); const c = document.createElement("canvas");
      c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      return c.toDataURL("image/jpeg", 0.85);
    } finally { URL.revokeObjectURL(url); }
  }
  async function readFile(f) {
    const buf = await f.arrayBuffer();
    if (/\.png$/i.test(f.name) || f.type === "image/png") {
      const tx = pngText(buf); const raw = tx.ccv3 || tx.chara;
      if (!raw) { toast(L2("这张图里没有角色卡数据", "No character data in this image")); return; }
      let obj = null; try { obj = JSON.parse(b64utf8(raw)); } catch (e) { console.warn("[card] png json", e); }
      let av = null; try { av = await shrink(buf, "image/png"); } catch (e) { console.warn("[card] avatar", e); }
      importCard(obj, av); return;
    }
    let obj = null; try { obj = JSON.parse(new TextDecoder().decode(buf)); } catch (e) { console.warn("[card] json", e); }
    importCard(obj, null);
  }
  function pickFile() {
    const inp = document.createElement("input"); inp.type = "file"; inp.accept = ".json,.png,application/json,image/png";
    inp.addEventListener("change", () => { const f = inp.files && inp.files[0]; if (f) readFile(f).catch(e => { console.warn("[card] import", e); toast(L2("导入失败", "Import failed")); }); });
    inp.click();
  }

  /* ---------- MIRU → 卡 ---------- */
  function cardOf(id) {
    const c = ch(id); if (!c) return null; const w = c.w ? wd(c.w) : null;
    const lore = (w && ((w.pack && w.pack.lore) || w.lore)) || [];
    return {
      spec: "chara_card_v2", spec_version: "2.0",
      data: {
        name: c.n, description: [Lz(c.looks), Lz(c.role)].filter(Boolean).join("\n\n"), personality: Lz(c.vibe) || "",
        scenario: w ? Lz(w.premise) || "" : "", first_mes: Lz(c.solo) || String(Lz(c.pitch) || "").replace(/^“|”$/g, ""),
        mes_example: c.examples || "", creator_notes: w ? Lz(w.hook) || "" : "", system_prompt: "", post_history_instructions: "",
        alternate_greetings: [], tags: (w && w.tags) || [], creator: c.by || "MIRU", character_version: "1",
        character_book: lore.length ? { entries: lore.map((e, i) => ({ keys: e.keys, content: e.txt, enabled: true, insertion_order: i, id: i, extensions: {} })), extensions: {} } : undefined,
        extensions: { miru: { age: c.age, g: c.g, h: c.h || "", role: Lz(c.role), looks: Lz(c.looks), vibe: Lz(c.vibe), likes: Lz(c.likes), secret: Lz(c.secret), hook: w ? Lz(w.hook) : "" } }
      }
    };
  }
  function cardOfPersona(p) {
    p = p || persona();
    const g = p.pron === "he" ? "m" : p.pron === "she" ? "f" : "x";
    return { spec: "chara_card_v2", spec_version: "2.0", data: {
      name: p.name || "", description: [p.look, p.bio].filter(Boolean).join("\n\n"), personality: [p.like ? (zh() ? "喜欢：" : "Likes: ") + p.like : "", p.dislike ? (zh() ? "不喜欢：" : "Dislikes: ") + p.dislike : ""].filter(Boolean).join("\n"),
      scenario: "", first_mes: "", mes_example: "", creator_notes: p.label || "", tags: ["persona"], creator: "MIRU", character_version: "1",
      extensions: { miru: { persona: 1, age: p.age || "", g: g, looks: p.look || "", likes: p.like || "", dislike: p.dislike || "", bio: p.bio || "", label: p.label || "" } } } };
  }
  function download(blob, name) {
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  async function exportCard(card, imgSrc, base) {
    const json = JSON.stringify(card, null, 2), fname = String(base || card.data.name || "character").replace(/[\\/:*?"<>|]+/g, "_");
    if (imgSrc) {
      try {
        const r = await fetch(imgSrc, { mode: "cors" }); if (!r.ok) throw new Error("img " + r.status);
        const bmp = await createImageBitmap(await r.blob());
        const c = document.createElement("canvas"); c.width = bmp.width; c.height = bmp.height; c.getContext("2d").drawImage(bmp, 0, 0);
        const png = await new Promise(res => c.toBlob(res, "image/png")); if (!png) throw new Error("toBlob");
        const out = pngWithText(await png.arrayBuffer(), "chara", utf8b64(json));
        download(new Blob([out], { type: "image/png" }), fname + ".png");
        toast(L2("已导出角色卡（图片里带数据）", "Card exported (data inside the image)")); return;
      } catch (e) { console.warn("[card] png export, falling back to json", e); }
    }
    download(new Blob([json], { type: "application/json" }), fname + ".json");
    toast(L2("已导出角色卡（JSON）", "Card exported (JSON)"));
  }

  document.addEventListener("click", function (e) {
    const t = e.target; if (!t || !t.closest) return; let x;
    if ((x = t.closest("[data-ccimp]"))) { e.stopImmediatePropagation(); pickFile(); return; }
    if ((x = t.closest("[data-ccexp]"))) { e.stopImmediatePropagation(); const id = x.dataset.ccexp; const card = cardOf(id); if (!card) return; let src = null; try { src = S.art[id] || (typeof artSrc === "function" ? artSrc(id) : null); } catch (er) { src = null; } exportCard(card, src, card.data.name); return; }
    if ((x = t.closest("[data-ccexpme]"))) { e.stopImmediatePropagation(); const p = persona(); exportCard(cardOfPersona(p), p.img || null, (p.name || "me") + "_" + L2("我的角色卡", "role_card")); return; }
  }, true);

  window.cardIO = { importCard: importCard, cardOf: cardOf, cardOfPersona: cardOfPersona, pngText: pngText, pngWithText: pngWithText, utf8b64: utf8b64, b64utf8: b64utf8 };
})();
