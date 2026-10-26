/* ================= v2.7 · SIGN-IN FIRST =================
   New install: language → welcome (18+) → 【登录页】 → taste → hook drama.
   The sign-in page offers Sign in with Apple, Sign in with Google, email (sign in / create / forgot password) and 「先逛逛」 (guest,
   switchable off in the operations console). Guests can bind an account later without losing anything (the guest account is upgraded).
   Signing in to an existing account restores that account's progress and diamonds on this device.
   Apple / Google buttons go live as soon as APPLE_CLIENT_ID / GOOGLE_CLIENT_ID are set on the server; until then they say so honestly.
   Me → account card: provider, change password, sign out, sign out everywhere, delete account (App Store requirement).
   Also here: operations notices (banner / popup / maintenance), console-controlled prices, banned-account notice, funnel events. */
const AU70 = { prov: null, cfg: null, bannedShown: false, busy: false };
const AUT = {
  title: { zh: "登录 MIRU", en: "Sign in to MIRU", ja: "MIRU にログイン", ko: "MIRU 로그인", es: "Inicia sesión en MIRU" },
  sub: { zh: "保存你的进度、选择和钻石，换手机也能接着看。", en: "Keep your progress, choices and diamonds — pick up on any phone.", ja: "進行状況・選択・ダイヤを保存。機種変更しても続きから。", ko: "진행 상황, 선택, 다이아를 저장해 어떤 폰에서도 이어서 볼 수 있어요.", es: "Guarda tu progreso, tus decisiones y tus diamantes en cualquier teléfono." },
  apple: { zh: "通过 Apple 登录", en: "Continue with Apple", ja: "Apple でサインイン", ko: "Apple로 계속하기", es: "Continuar con Apple" },
  google: { zh: "通过 Google 登录", en: "Continue with Google", ja: "Google でログイン", ko: "Google로 계속하기", es: "Continuar con Google" },
  email: { zh: "邮箱登录 / 注册", en: "Continue with email", ja: "メールでログイン / 登録", ko: "이메일로 로그인 / 가입", es: "Continuar con correo" },
  guest: { zh: "先逛逛，稍后再登录", en: "Look around first", ja: "まずは見てみる", ko: "먼저 둘러볼게요", es: "Explorar primero" },
  gift: { zh: "新用户登录即送钻石", en: "New accounts get free diamonds", ja: "新規登録でダイヤをプレゼント", ko: "신규 가입 시 다이아 지급", es: "Las cuentas nuevas reciben diamantes" },
  soonA: { zh: "Apple 登录正在接入，先用邮箱或「先逛逛」，之后可以在「我的」里绑定。", en: "Sign in with Apple is coming soon — use email or look around for now; you can link it later in Me.", ja: "Apple サインインは準備中です。メールか「まずは見てみる」をご利用ください。", ko: "Apple 로그인은 준비 중이에요. 이메일이나 '먼저 둘러볼게요'를 이용해 주세요.", es: "Apple estará disponible pronto. Usa el correo o explora primero." },
  soonG: { zh: "Google 登录正在接入，先用邮箱或「先逛逛」，之后可以在「我的」里绑定。", en: "Google sign-in is coming soon — use email or look around for now; you can link it later in Me.", ja: "Google ログインは準備中です。メールか「まずは見てみる」をご利用ください。", ko: "Google 로그인은 준비 중이에요. 이메일이나 '먼저 둘러볼게요'를 이용해 주세요.", es: "Google estará disponible pronto. Usa el correo o explora primero." },
  login: { zh: "登录", en: "Sign in", ja: "ログイン", ko: "로그인", es: "Iniciar sesión" },
  register: { zh: "注册", en: "Create account", ja: "新規登録", ko: "가입", es: "Crear cuenta" },
  em: { zh: "邮箱", en: "Email", ja: "メールアドレス", ko: "이메일", es: "Correo" },
  pw: { zh: "密码（至少 6 位）", en: "Password (6+ characters)", ja: "パスワード（6文字以上）", ko: "비밀번호 (6자 이상)", es: "Contraseña (6+ caracteres)" },
  nick: { zh: "昵称（可选）", en: "Name (optional)", ja: "ニックネーム（任意）", ko: "닉네임 (선택)", es: "Nombre (opcional)" },
  forgot: { zh: "忘记密码？", en: "Forgot password?", ja: "パスワードをお忘れですか？", ko: "비밀번호를 잊으셨나요?", es: "¿Olvidaste tu contraseña?" },
  sendCode: { zh: "发送验证码", en: "Send code", ja: "コードを送信", ko: "코드 보내기", es: "Enviar código" },
  code: { zh: "6 位验证码", en: "6-digit code", ja: "6桁のコード", ko: "6자리 코드", es: "Código de 6 dígitos" },
  newpw: { zh: "新密码（至少 6 位）", en: "New password (6+ characters)", ja: "新しいパスワード（6文字以上）", ko: "새 비밀번호 (6자 이상)", es: "Nueva contraseña (6+)" },
  reset: { zh: "重设密码并登录", en: "Reset and sign in", ja: "再設定してログイン", ko: "재설정하고 로그인", es: "Restablecer e iniciar sesión" },
  sent: { zh: "如果这个邮箱注册过，验证码已经发出，15 分钟内有效。", en: "If that email has an account, a code is on its way (valid 15 minutes).", ja: "登録済みのアドレスならコードを送信しました（15分有効）。", ko: "가입된 이메일이면 코드를 보냈어요 (15분 유효).", es: "Si ese correo tiene cuenta, te enviamos un código (15 min)." },
  nomail: { zh: "邮件服务还没开通：请联系客服，由客服在后台为你重置密码。", en: "Email isn't set up yet — contact support and we'll reset it for you.", ja: "メール送信は準備中です。サポートにご連絡ください。", ko: "이메일 발송은 준비 중이에요. 고객센터에 문의해 주세요.", es: "El correo aún no está activo: contacta con soporte." },
  wrong: { zh: "邮箱或密码不对", en: "Wrong email or password", ja: "メールアドレスまたはパスワードが違います", ko: "이메일 또는 비밀번호가 틀렸어요", es: "Correo o contraseña incorrectos" },
  taken: { zh: "这个邮箱已注册，请直接登录", en: "That email already has an account — sign in instead", ja: "このメールは登録済みです。ログインしてください", ko: "이미 가입된 이메일이에요. 로그인해 주세요", es: "Ese correo ya tiene cuenta: inicia sesión" },
  net: { zh: "网络不稳定，请稍后再试", en: "Network problem — try again", ja: "通信エラーです。もう一度お試しください", ko: "네트워크 오류예요. 다시 시도해 주세요", es: "Error de red, inténtalo de nuevo" },
  welcomeBack: { zh: "欢迎回来，进度已恢复", en: "Welcome back — progress restored", ja: "おかえりなさい。進行状況を復元しました", ko: "다시 오신 걸 환영해요. 진행 상황을 복원했어요", es: "¡Bienvenido de nuevo! Progreso restaurado" },
  hi: { zh: "登录成功", en: "You're signed in", ja: "ログインしました", ko: "로그인했어요", es: "Sesión iniciada" },
  banned: { zh: "账号已被封禁", en: "This account is suspended", ja: "このアカウントは停止されています", ko: "이 계정은 정지되었어요", es: "Esta cuenta está suspendida" },
  until: { zh: "解封时间", en: "Until", ja: "解除日時", ko: "해제 시각", es: "Hasta" },
  forever: { zh: "永久", en: "Permanent", ja: "無期限", ko: "영구", es: "Permanente" },
  acct: { zh: "账号与同步", en: "Account & sync", ja: "アカウントと同期", ko: "계정 및 동기화", es: "Cuenta y sincronización" },
  guestAcct: { zh: "游客账号 · 登录后进度和钻石才能在换手机后找回", en: "Guest · sign in so your progress and diamonds survive a new phone", ja: "ゲスト · ログインすると機種変更後も引き継げます", ko: "게스트 · 로그인하면 폰을 바꿔도 이어져요", es: "Invitado · inicia sesión para no perder tu progreso" },
  bind: { zh: "登录 / 注册", en: "Sign in / up", ja: "ログイン / 登録", ko: "로그인 / 가입", es: "Entrar / Registrarse" },
  chpw: { zh: "修改密码", en: "Change password", ja: "パスワード変更", ko: "비밀번호 변경", es: "Cambiar contraseña" },
  out: { zh: "退出登录", en: "Sign out", ja: "ログアウト", ko: "로그아웃", es: "Cerrar sesión" },
  outAll: { zh: "退出所有设备", en: "Sign out everywhere", ja: "すべての端末からログアウト", ko: "모든 기기에서 로그아웃", es: "Cerrar sesión en todos" },
  del: { zh: "注销账号", en: "Delete account", ja: "アカウント削除", ko: "계정 삭제", es: "Eliminar cuenta" },
  delAsk: { zh: "注销后，云端进度、钻石、你发布的作品和上传的素材都会被删除，无法恢复。确定注销吗？", en: "Deleting removes your cloud progress, diamonds, published stories and uploads. This can't be undone. Delete your account?", ja: "削除するとクラウドの進行状況・ダイヤ・投稿作品・素材が消え、元に戻せません。削除しますか？", ko: "삭제하면 클라우드 진행 상황, 다이아, 게시한 작품과 업로드가 모두 삭제되며 되돌릴 수 없어요. 삭제할까요?", es: "Se borrarán tu progreso en la nube, diamantes, historias y archivos. No se puede deshacer. ¿Eliminar?" },
  delDone: { zh: "账号已注销", en: "Account deleted", ja: "アカウントを削除しました", ko: "계정을 삭제했어요", es: "Cuenta eliminada" },
  oldpw: { zh: "当前密码", en: "Current password", ja: "現在のパスワード", ko: "현재 비밀번호", es: "Contraseña actual" },
  saved: { zh: "已保存", en: "Saved", ja: "保存しました", ko: "저장했어요", es: "Guardado" },
  via: { zh: "登录方式", en: "Signed in with", ja: "ログイン方法", ko: "로그인 방법", es: "Sesión con" },
  synced: { zh: "已同步", en: "synced", ja: "同期済み", ko: "동기화됨", es: "sincronizado" },
  preview: { zh: "这是预览版，连不上账号服务器。登录请打开正式网址 miru-wheat-pi.vercel.app，或先点「先逛逛」。", en: "This is a preview that can't reach the account server. Sign in at miru-wheat-pi.vercel.app, or tap Look around first.", ja: "これはプレビュー版のためログインできません。miru-wheat-pi.vercel.app でログインするか、「まずは見てみる」を選んでください。", ko: "미리보기 버전이라 로그인할 수 없어요. miru-wheat-pi.vercel.app 에서 로그인하거나 '먼저 둘러볼게요'를 눌러 주세요.", es: "Esta vista previa no puede conectarse. Inicia sesión en miru-wheat-pi.vercel.app o explora primero." },
  previewNote: { zh: "预览版：登录功能请在正式网址 miru-wheat-pi.vercel.app 使用", en: "Preview: sign-in works at miru-wheat-pi.vercel.app", ja: "プレビュー版：ログインは miru-wheat-pi.vercel.app で", ko: "미리보기: 로그인은 miru-wheat-pi.vercel.app 에서", es: "Vista previa: inicia sesión en miru-wheat-pi.vercel.app" },
  keep: { zh: "这是你之前选的口味，都还在。想改就改，不改直接保存。", en: "These are the tastes you picked before — all kept. Change anything or just save.", ja: "以前選んだ好みはそのまま残っています。変更しても、そのまま保存してもOK。", ko: "예전에 고른 취향이 그대로 있어요. 바꾸거나 그대로 저장하세요.", es: "Estos son los gustos que elegiste antes. Cámbialos o guarda sin más." },
  cancel: { zh: "取消", en: "Cancel", ja: "キャンセル", ko: "취소", es: "Cancelar" },
};
function au(k) { const x = AUT[k] || {}; return x[S.lang] || x.en || ""; }
const PROV_NAME = { apple: "Apple", google: "Google", email: "Email", guest: "Guest" };
function provName70(p) { p = p || "email"; const zh = S.lang === "zh"; if (p === "email") return zh ? "邮箱" : S.lang === "ja" ? "メール" : S.lang === "ko" ? "이메일" : S.lang === "es" ? "Correo" : "Email"; if (p === "guest") return zh ? "游客" : "Guest"; return PROV_NAME[p] || p; }
function au70Loggedin() { const c = S.cloud || {}; return !!(c.token && (c.email || (c.provider && c.provider !== "guest"))); }
async function au70Prov() {
  if (!CLOUD_EP) return { google: "", apple: "", email: false, reset: false, guest: true, preview: true };
  if (AU70.prov) return AU70.prov;
  try { const r = await fetch(CLOUD_EP + "/auth?providers=1"); if (r.ok) AU70.prov = await r.json(); } catch (_) {}
  return AU70.prov || { google: "", apple: "", email: true, reset: false, guest: true };
}
function au70Script(src) { return new Promise((ok, no) => { if (document.querySelector('script[src="' + src + '"]')) return ok(); const s = document.createElement("script"); s.src = src; s.async = true; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }

/* ---------- the sign-in page (part of onboarding) ---------- */
const APPLE_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.97-3.46-1.07-1.57-2.74-1.78-3.33-1.8-1.42-.14-2.77.83-3.49.83-.72 0-1.83-.81-3.01-.79-1.55.02-2.98.9-3.78 2.29-1.61 2.8-.41 6.94 1.16 9.21.77 1.11 1.68 2.36 2.88 2.31 1.16-.05 1.59-.75 2.99-.75 1.4 0 1.79.75 3.01.72 1.24-.02 2.03-1.13 2.79-2.25.88-1.29 1.24-2.54 1.26-2.6-.03-.01-2.42-.93-2.45-3.71zM14.08 5.84c.64-.77 1.07-1.85.95-2.92-.92.04-2.03.61-2.69 1.38-.59.68-1.1 1.77-.96 2.82 1.02.08 2.06-.52 2.7-1.28z"/></svg>';
const GOOGLE_SVG = '<svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
function au70Buttons(inSheet) {
  return '<div class="au70b">' +
    '<button class="au70btn au70apple" data-au70="apple">' + APPLE_SVG + '<span>' + esc(au("apple")) + '</span></button>' +
    '<div class="au70g"><button class="au70btn au70google" data-au70="google">' + GOOGLE_SVG + '<span>' + esc(au("google")) + '</span></button><div class="au70gslot" id="' + (inSheet ? "auGs" : "auG") + '"></div></div>' +
    '<button class="au70btn au70mail" data-au70="email">✉️ <span>' + esc(au("email")) + '</span></button></div>';
}
function renderAuth70() {
  const cols = [["mason", "lucien", "wren", "ethan"], ["iris", "adrian", "nico", "sasha"], ["rowan", "theo", "noor", "elijah"]];
  let art = "";
  try { art = '<div class="ob-art" style="height:34%;min-height:190px"><div class="cols">' + cols.map(c => '<div class="col">' + c.concat(c).map(id => '<img src="' + artSrc(id) + '" alt="">').join("") + '</div>').join("") + '</div><div class="fade"></div></div>'; } catch (_) {}
  screen("s-ob", art + '<div class="scroll pad stack" style="gap:12px;padding-block:0 22px">' +
    '<div class="row" style="justify-content:space-between"><div class="brand" style="font-size:26px">MI<b>RU</b></div>' + langPicker() + '</div>' +
    '<h1 style="font-size:26px;line-height:1.15">' + esc(au("title")) + '</h1><p class="dim" style="font-size:13.5px;line-height:1.55">' + esc(au("sub")) + '</p>' +
    /* 2026-10-27 Ann：把「先逛逛」提到最上面。
       它是唯一**不依赖账号服务器**的入口（而登录用的 Vercel 那条腿在国内不通），
       之前却排在最底下、折叠之外 —— 玩家看不到，就以为整个应用进不去。 */
    '<button class="btn btn-p btn-block" data-au70="guest" id="au70guest" style="margin-top:2px">' + esc(au("guest")) + '</button>' +
    (CLOUD_EP ? '' : '<p class="xs faint" style="text-align:center;line-height:1.5;margin-top:-2px">' + esc(au("previewNote")) + '</p>') +
    '<p class="au70gift" style="margin-top:10px">🎁 ' + esc(au("gift")) + '</p>' + au70Buttons(false) + '</div>');
  show("s-ob");
  au70Prov().then(p => { const g = $("#au70guest"); if (g && p && p.guest === false) g.remove(); au70MountGoogle("auG"); });
  track("auth_view");
}
const _renderOB70 = renderOB;
renderOB = function () {
  if (!S.ob && !au70Loggedin() && !S.authChoice) { renderAuth70(); return; }
  return _renderOB70.apply(this, arguments);
};

const _startApp70 = startApp;
startApp = function () { if (!au70Loggedin() && !S.authChoice) { renderAuth70(); return; } return _startApp70.apply(this, arguments); };
/* ---------- Google: the official button is laid over ours once a client ID exists ---------- */
async function au70MountGoogle(slotId) {
  const p = await au70Prov(); const slot = document.getElementById(slotId); if (!p.google || !slot) return;
  try {
    await au70Script("https://accounts.google.com/gsi/client");
    google.accounts.id.initialize({ client_id: p.google, callback: r => au70OAuth("google", { idToken: r.credential }), ux_mode: "popup" });
    slot.innerHTML = ""; google.accounts.id.renderButton(slot, { theme: "outline", size: "large", shape: "pill", text: "continue_with", width: Math.min(Math.max(slot.parentElement.clientWidth || 300, 200), 400), locale: S.lang });
    slot.classList.add("on");
  } catch (_) {}
}
async function au70Apple() {
  const p = await au70Prov(); if (!p.apple) { toast(au("soonA")); return; }
  try {
    await au70Script("https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js");
    AppleID.auth.init({ clientId: p.apple, scope: "name email", redirectURI: location.origin + "/", usePopup: true });
    const r = await AppleID.auth.signIn();
    const nm = r.user && r.user.name ? [r.user.name.firstName, r.user.name.lastName].filter(Boolean).join(" ") : "";
    au70OAuth("apple", { idToken: r.authorization.id_token, name: nm });
  } catch (e) { if (!(e && /popup_closed|user_cancel/i.test(String(e.error || e)))) toast(au("net")); }
}
async function au70OAuth(op, body) {
  try { const r = await capi("/auth", { json: Object.assign({ op }, body) }); if (!r.ok) { au70Err(r); return; } await au70Done(r.j, op); } catch (_) { toast(au("net")); }
}
/* 2026-10-27 修：错误对象直接丢进 toast 会渲成「[object Object]」（Ann 注册后看到的就是它）。
   先取成人话；本地没有账号服务器时给一句明确的话，而不是一个字符串化的对象。 */
function au70ErrText(e) {
 if (!e) return "";
 if (typeof e === "string") return e;
 if (typeof e === "object") return String(e.message || e.code || e.error || JSON.stringify(e));
 return String(e);
}
function au70Err(r) {
 const e0 = r.j && r.j.error;
 const e = au70ErrText(e0);
 if (r.status === 403 && (e0 === "banned" || e === "banned")) { au70Banned(r.j); return; }
 if (r.status === 503 || (e0 && e0.code === "no_backend")) {
  toast(S.lang === "zh" ? "本地预览没有账号服务器 —— 点最上面的「先逛逛」就能玩" : "No account server in this preview - tap Look around at the top");
  return;
 }
 toast(e === "wrong email or password" ? au("wrong") : e === "email already registered" ? au("taken") : (e || au("net")));
}
/* after any successful sign-in */
async function au70Done(j, method) {
  const c = cloudInfo(); const sameUser = c.uid === j.user.id;
  c.token = j.token; c.uid = j.user.id; c.email = j.user.email; c.provider = j.user.provider; c.name = j.user.name;
  CL0.on = true; CL0.checked = true; if (!sameUser) c.ver = 0; save0();
  track("login", { method, restored: !!j.restored });
  closeSheet();
  if (j.restored && !sameUser) {
    let had = false; try { had = await cloudPull(); } catch (_) {}
    const cc = cloudInfo(); cc.token = j.token; cc.uid = j.user.id; cc.email = j.user.email; cc.provider = j.user.provider;
    S.authChoice = method; save0(); await walletPull().catch(() => {});
    toast(au("welcomeBack"));
    if (had && S.ob) { au70After(); return; }
  } else {
    S.authChoice = method; save0(); await walletPull().catch(() => {}); cloudPush(true); toast(au("hi"));
  }
  if (!S.ob || ($("#s-ob") && !$("#s-ob").hidden)) au70After(); else { try { renderTab(S.lastTab || "me"); } catch (_) {} }
}
/* after the sign-in page (signed in or 「先逛逛」) the player still makes their own choices:
   new players → language → 18+ → pairing → taste → hook drama; returning players → home, with their saved taste opened so they can
   see their earlier choices are kept and change them. */
function au70After() {
  if (!S.ob) { obStep = 0; renderOB(); return; }
  startApp();
  setTimeout(() => { try { prefSheet(); toast(au("keep")); } catch (_) {} }, 450);
}

/* ---------- email sheet: sign in · create · forgot · reset ---------- */
function authSheet70(mode) {
  mode = mode || "login";
  const tabs = '<div class="au70tabs"><button class="' + (mode === "login" ? "on" : "") + '" data-au70m="login">' + esc(au("login")) + '</button><button class="' + (mode === "register" ? "on" : "") + '" data-au70m="register">' + esc(au("register")) + '</button></div>';
  let body = "";
  if (mode === "login" || mode === "register") {
    body = tabs + '<input id="au7e" type="email" autocomplete="email" placeholder="' + esc(au("em")) + '" class="up66i">' +
      (mode === "register" ? '<input id="au7n" type="text" autocomplete="nickname" placeholder="' + esc(au("nick")) + '" class="up66i">' : '') +
      '<input id="au7p" type="password" autocomplete="' + (mode === "login" ? "current-password" : "new-password") + '" placeholder="' + esc(au("pw")) + '" class="up66i">' +
      '<button class="btn btn-p btn-block" data-au70go="' + mode + '">' + esc(au(mode)) + '</button>' +
      (mode === "login" ? '<button class="lnk au70small" data-au70m="forgot">' + esc(au("forgot")) + '</button>' : '');
  } else if (mode === "forgot") {
    body = '<h2>' + esc(au("forgot")) + '</h2><input id="au7e" type="email" autocomplete="email" placeholder="' + esc(au("em")) + '" class="up66i"><button class="btn btn-p btn-block" data-au70go="forgot">' + esc(au("sendCode")) + '</button><button class="lnk au70small" data-au70m="login">← ' + esc(au("login")) + '</button>';
  } else if (mode === "reset") {
    body = '<h2>' + esc(au("forgot")) + '</h2><p class="xs faint">' + esc(au("sent")) + '</p><input id="au7e" type="email" class="up66i" value="' + esc(AU70.resetEmail || "") + '"><input id="au7c" inputmode="numeric" maxlength="6" placeholder="' + esc(au("code")) + '" class="up66i"><input id="au7p" type="password" autocomplete="new-password" placeholder="' + esc(au("newpw")) + '" class="up66i"><button class="btn btn-p btn-block" data-au70go="reset">' + esc(au("reset")) + '</button>';
  }
  sheet('<div class="au70s">' + body + '</div>');
  setTimeout(() => { const e = $("#au7e"); if (e && !e.value) e.focus(); }, 60);
}
function authAll70() { sheet('<div class="au70s"><h2>' + esc(au("title")) + '</h2><p class="xs faint">' + esc(au("sub")) + '</p>' + au70Buttons(true) + '</div>'); au70MountGoogle("auGs"); }
acctSheet = function (mode) { authAll70(); };

document.addEventListener("click", async e => {
  let x;
  if ((x = e.target.closest("[data-au70]"))) {
    e.preventDefault(); e.stopImmediatePropagation(); const k = x.dataset.au70;
    if (!CLOUD_EP && k !== "guest") { toast(au("preview")); return; }
    if (k === "apple") au70Apple();
    else if (k === "google") { const p = await au70Prov(); if (!p.google) toast(au("soonG")); }
    else if (k === "email") authSheet70("login");
    else if (k === "guest") { S.authChoice = "guest"; save(); track("login", { method: "guest" }); au70After(); }
    return;
  }
  if ((x = e.target.closest("[data-au70m]"))) { e.preventDefault(); authSheet70(x.dataset.au70m); return; }
  if ((x = e.target.closest("[data-au70go]"))) {
    e.preventDefault(); if (AU70.busy) return; AU70.busy = true; x.disabled = true;
    const mode = x.dataset.au70go, email = (($("#au7e") || {}).value || "").trim(), pw = ($("#au7p") || {}).value || "";
    try {
      if (mode === "forgot") {
        const r = await capi("/auth", { json: { op: "forgot", email } });
        if (r.status === 501) toast(au("nomail")); else if (r.ok) { AU70.resetEmail = email; authSheet70("reset"); } else au70Err(r);
      } else if (mode === "reset") {
        const r = await capi("/auth", { json: { op: "reset", email, code: (($("#au7c") || {}).value || "").trim(), password: pw } });
        if (r.ok) await au70Done(Object.assign({ restored: true }, r.j), "email"); else au70Err(r);
      } else {
        const r = await capi("/auth", { json: { op: mode, email, password: pw, name: (($("#au7n") || {}).value || "").trim() || undefined, lang: S.lang } });
        if (r.ok) await au70Done(r.j, "email"); else au70Err(r);
      }
    } catch (_) { toast(au("net")); }
    AU70.busy = false; if (x.isConnected) x.disabled = false;
    return;
  }
}, true);

/* ---------- Me → account card ---------- */
acctCardHTML = function () {
  if (!CLOUD_EP) return "";
  const c = cloudInfo();
  if (!au70Loggedin()) return '<div class="card acct68 au70card"><div class="row"><div class="grow"><b>☁️ ' + esc(au("acct")) + '</b><p class="xs faint">' + esc(au("guestAcct")) + '</p></div><button class="btn btn-p btn-sm" data-au70card="bind">' + esc(au("bind")) + '</button></div></div>';
  const who = c.name || c.email || c.uid;
  return '<div class="card acct68 au70card"><div class="row"><div class="au70av">' + esc(String(who || "?").slice(0, 1).toUpperCase()) + '</div><div class="grow"><b>' + esc(who) + '</b><p class="xs faint">' + esc(au("via")) + ' ' + esc(provName70(c.provider)) + (c.email && c.name ? ' · ' + esc(c.email) : '') + (c.syncedAt ? ' · ☁️ ' + esc(au("synced")) : '') + '</p></div></div>' +
    '<div class="au70acts">' + (c.provider === "email" || (c.email && !c.provider) ? '<button class="btn btn-g btn-sm" data-au70card="pw">' + esc(au("chpw")) + '</button>' : '') +
    '<button class="btn btn-g btn-sm" data-au70card="out">' + esc(au("out")) + '</button><button class="btn btn-g btn-sm" data-au70card="outall">' + esc(au("outAll")) + '</button><button class="lnk au70del" data-au70card="del">' + esc(au("del")) + '</button></div></div>';
};
document.addEventListener("click", async e => {
  const x = e.target.closest("[data-au70card]"); if (!x) return; e.preventDefault(); e.stopImmediatePropagation();
  const k = x.dataset.au70card;
  if (k === "bind") { authAll70(); return; }
  if (k === "pw") { sheet('<div class="au70s"><h2>' + esc(au("chpw")) + '</h2><input id="au7o" type="password" autocomplete="current-password" placeholder="' + esc(au("oldpw")) + '" class="up66i"><input id="au7p" type="password" autocomplete="new-password" placeholder="' + esc(au("newpw")) + '" class="up66i"><button class="btn btn-p btn-block" data-au70card="pwgo">' + esc(au("chpw")) + '</button></div>'); return; }
  if (k === "pwgo") { const r = await capi("/auth", { json: { op: "password", old: ($("#au7o") || {}).value, password: ($("#au7p") || {}).value } }); if (r.ok) { cloudInfo().token = r.j.token; save0(); closeSheet(); toast(au("saved")); } else au70Err(r); return; }
  if (k === "outall") { const r = await capi("/auth", { json: { op: "logout_all" } }); if (r.ok) { cloudInfo().token = r.j.token; save0(); toast(au("saved")); } else au70Err(r); return; }
  if (k === "out") { await cloudPush(true).catch(() => {}); const c = cloudInfo(); ["token", "email", "uid", "provider", "name", "syncedAt"].forEach(f => delete c[f]); c.ver = 0; S.authChoice = null; save0(); CL0.on = false; CL0.checked = false; toast(au("out")); cloudBoot(); startApp(); return; }
  if (k === "del") {
    if (!confirm(au("delAsk"))) return;
    const r = await capi("/auth", { json: { op: "delete" } });
    if (r.ok) { toast(au("delDone")); try { localStorage.clear(); } catch (_) {} setTimeout(() => location.reload(), 900); } else au70Err(r);
  }
}, true);

/* ---------- suspended accounts ---------- */
function au70Banned(j) {
  if (AU70.bannedShown) return; AU70.bannedShown = true;
  sheet('<div class="au70s"><h2>⛔ ' + esc(au("banned")) + '</h2><p style="margin:8px 0">' + esc(j.reason || "") + '</p><p class="xs faint">' + esc(au("until")) + '：' + esc(j.until ? new Date(j.until).toLocaleString() : au("forever")) + '</p></div>');
}
const _capi70 = capi;
capi = async function (path, opt) { const r = await _capi70(path, opt); try { if (r.status === 403 && r.j && r.j.error === "banned") au70Banned(r.j); } catch (_) {} return r; };

/* ---------- console config, notices and maintenance ---------- */
async function au70Config() {
  if (!CLOUD_EP) return;
  try {
    const r = await fetch(CLOUD_EP + "/health?config=1&lang=" + encodeURIComponent(S.lang || "")); if (!r.ok) return; const j = await r.json(); AU70.cfg = j;
    const up = j.config && j.config.upload_price;
    if (up && typeof UPRICE === "object") Object.assign(UPRICE, { audio: up.audio, image: up.image, video: up.video, mg: up.game });
    if (j.auth) AU70.prov = Object.assign(AU70.prov || { email: true, guest: true }, { google: j.auth.google, apple: j.auth.apple, reset: j.auth.reset });
    const off = S.noticeOff || [];
    (j.notices || []).filter(n => n.kind === "popup" && !off.includes(n.id)).slice(0, 1).forEach(n => { if (!S.ob) return; S.noticeOff = off.concat(n.id); save(); sheet('<div class="au70s"><h2>📣 ' + esc(n.title) + '</h2><p style="white-space:pre-wrap;line-height:1.6;margin-top:8px">' + esc(n.body || "") + '</p></div>'); });
    try { if (S.ob && S.lastTab === "home") renderTab("home"); } catch (_) {}
  } catch (_) {}
}
const _renderHome70 = renderHome;
renderHome = function (v) {
  const r = _renderHome70.apply(this, arguments);
  try {
    const j = AU70.cfg; if (!j) return r; const sc = v.querySelector(".scroll") || v; const off = S.noticeOff || [];
    const items = [];
    if (j.config && j.config.maintenance) items.push({ id: "m", title: "🛠", body: j.config.maintenance, sticky: 1 });
    (j.notices || []).filter(n => n.kind !== "popup" && !off.includes(n.id)).forEach(n => items.push(n));
    if (items.length && !v.querySelector(".notice70")) sc.insertAdjacentHTML("afterbegin", items.map(n => '<div class="notice70"><div class="grow"><b>' + esc(n.title) + '</b> <span>' + esc(n.body || "") + '</span></div>' + (n.sticky ? '' : '<button data-notoff="' + n.id + '" aria-label="close">✕</button>') + '</div>').join(""));
  } catch (_) {}
  return r;
};
document.addEventListener("click", e => { const x = e.target.closest("[data-notoff]"); if (!x) return; S.noticeOff = (S.noticeOff || []).concat(Number(x.dataset.notoff)); save(); const n = x.closest(".notice70"); n && n.remove(); });
setTimeout(au70Config, 1600);

/* ---------- funnel events ---------- */
document.addEventListener("click", e => { if (e.target.closest("[data-pfsave]")) track("taste_done"); }, true);
if (typeof hookPlay === "function") { const _hp70 = hookPlay; let once = false; hookPlay = function () { if (!once) { once = true; track("hook_play"); } return _hp70.apply(this, arguments); }; }
const _packOpen70 = packOpen;
packOpen = function (th, n) { try { if (th && th.pk) { if (n === 1 && !th.pk._st70) { th.pk._st70 = 1; track("story_start", { wid: th.wid }); } if (typeof pkSetPresent === "function") pkSetPresent(th, n); if (typeof pkOpenMark === "function") pkOpenMark(th, n); } } catch (_) {} return _packOpen70.apply(this, arguments); };
const _reply70 = reply;
reply = function (th, ctx) { try { if (ctx && ctx.kind === "talk") track("talk", { wid: th && th.wid }); } catch (_) {} return _reply70.apply(this, arguments); };
const _units70 = unitsSheet;
unitsSheet = function () { track("store_open"); return _units70.apply(this, arguments); };

(function () {
  const st = document.createElement("style");
  st.textContent = `
.au70b{display:flex;flex-direction:column;gap:10px;margin-top:4px}
.au70btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;height:48px;border-radius:999px;font-weight:700;font-size:15px}
.au70apple{background:#fff;color:#000}.au70google{background:#fff;color:#1f1f1f;border:1px solid #dadce0}.au70mail{background:transparent;color:var(--text);border:1px solid var(--line)}
.au70g{position:relative}.au70gslot{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:var(--bg);border-radius:999px;overflow:hidden}.au70gslot.on{display:flex}
.au70guest{display:block;width:100%;text-align:center;padding:10px;font-size:13.5px;color:var(--dim)}
.au70gift{font-size:12.5px;color:var(--gold);margin:0}
.au70s{display:flex;flex-direction:column;gap:10px}.au70s h2{margin:0}.au70s .up66i{margin:0}
.au70tabs{display:flex;gap:6px;background:var(--panel2);padding:4px;border-radius:999px}.au70tabs button{flex:1;padding:9px;border-radius:999px;font-weight:700;color:var(--dim)}.au70tabs button.on{background:var(--raise);color:var(--text)}
.au70small{align-self:center;font-size:12.5px;color:var(--dim);padding:6px}
.au70card .au70av{width:40px;height:40px;border-radius:50%;background:var(--grad);display:grid;place-items:center;font-weight:800;color:#1B1017;margin-right:10px;flex:none}
.au70acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;align-items:center}.au70del{font-size:12px;color:var(--faint);margin-left:auto}
.notice70{display:flex;gap:10px;align-items:flex-start;margin:0 0 10px;padding:10px 12px;border-radius:14px;background:rgba(156,132,224,.14);border:1px solid rgba(156,132,224,.35);font-size:12.5px;line-height:1.45}.notice70 button{color:var(--faint)}`;
  document.head.appendChild(st);
})();
/* while the sign-in page is up, nothing else pops over it (welcome gifts, promos, notices) */
const _sheet70 = sheet;
sheet = function (html) { try { const ob = $("#s-ob"); if (ob && !ob.hidden && ob.querySelector(".au70b") && String(html).indexOf("au70s") < 0 && String(html).indexOf("data-lang=") < 0) return; } catch (_) {} return _sheet70.apply(this, arguments); };
/* switching language on the sign-in page redraws the sign-in page in that language */
document.addEventListener("click", e => { const x = e.target.closest("[data-lang]"); if (!x) return; try { const ob = $("#s-ob"); if (ob && !ob.hidden && ob.querySelector(".au70b")) setTimeout(() => { if (!au70Loggedin() && !S.authChoice) renderAuth70(); }, 0); } catch (_) {} });
