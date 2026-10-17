/* =====================================================================
   على القهوة v14 — واجهة اللعب (Mobile-first, RTL)
   كل الحالة الحقيقية على السيرفر — الواجهة بتعرض اللي السيرفر يبعته لكل مستخدم
   ===================================================================== */

// ------------------------------------------------------------------
// أيقونات خطية (بدون إيموجي)
// ------------------------------------------------------------------
const IC = {
  crown: '<path d="M2 5l3.5 12h13L22 5l-6 6-4-7-4 7-6-6z"/><path d="M5 20h14"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  play: '<path d="M7 4l13 8-13 8V4z"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  next: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  dice: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.3"/><circle cx="15.5" cy="15.5" r="1.3"/><circle cx="15.5" cy="8.5" r="1.3"/><circle cx="8.5" cy="15.5" r="1.3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  swap: '<path d="M7 16V4M3 8l4-4 4 4M17 8v12M21 16l-4 4-4-4"/>',
  kick: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
  pencil: '<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  skip: '<path d="M5 4l10 8-10 8V4zM19 5v14"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  enter: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>',
  snow: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
  eyeOff: '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22"/>',
  whistle: '<circle cx="9" cy="14" r="6"/><path d="M13.5 10L22 6v5l-6 2"/><path d="M5 5l2 3"/>',
  chevL: '<path d="M15 18l-6-6 6-6"/>',
  chevR: '<path d="M9 18l6-6-6-6"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  bolt: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>'
};
const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || ''}</svg>`;

// ملصقات مرسومة (sprite من صورة واحدة)
const STICKERS = {
  dallah: [100, 55, 290, 325], cup: [525, 88, 240, 205], teapot: [875, 88, 315, 245], latte: [380, 255, 178, 322],
  croissant: [700, 330, 258, 182], pink: [128, 468, 190, 295], rocket: [518, 552, 255, 240], pencil: [982, 488, 160, 285]
};
function sticker(name, w, cls = '') {
  const [x, y, sw, sh] = STICKERS[name];
  const s = w / sw;
  return `<span class="sticker ${cls}" aria-hidden="true" style="width:${w}px;height:${Math.round(sh * s)}px;background-size:${Math.round(1264 * s)}px auto;background-position:-${Math.round(x * s)}px -${Math.round(y * s)}px"></span>`;
}

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = (sel) => document.querySelector(sel);

// ------------------------------------------------------------------
// بيانات ثابتة
// ------------------------------------------------------------------
const GAMES = {
  karak: { name: 'كرك', img: '/assets/ui/karak.jpg', tag: 'لعبة الخداع', desc: 'سؤال غريب بفراغ، كل فريق يكتب إجابة مزيفة تخدع التاني، وبعدين الكل يدور على الإجابة الصح وسط 6 إجابات.' },
  sahlab: { name: 'سحلب', img: '/assets/ui/sahlab.jpg', tag: 'سلم التلميحات', desc: 'صورة مموهة و5 تلميحات بتسهل واحدة ورا التانية. خمّن بدري تاخد نقط أكتر، وكل غلطة بتجمد فريقك.' },
  tamr: { name: 'لبن تمر هندي', img: '/assets/ui/tamr.jpg', tag: 'ساعة الشطرنج', desc: 'كل فريق عنده شخصية سرية لازم يخمنها بأسئلة أه/لأ، وساعة شطرنج بتعد على الفريق اللي عليه الدور.' }
};
const CATS = {
  karak: [['history', 'تاريخ'], ['geography', 'جغرافيا'], ['science', 'علوم'], ['sports', 'رياضة'], ['cinema', 'أفلام ومسلسلات'], ['food', 'أكل ومشروبات'], ['egypt', 'مصر'], ['animals', 'حيوانات'], ['weird', 'غرائب الشعوب'], ['language', 'لغة وكلمات']],
  sahlab: [['places', 'أماكن'], ['people', 'مشاهير'], ['food', 'أكل'], ['movies', 'أفلام'], ['things', 'أشياء']],
  tamr: []
};

// ------------------------------------------------------------------
// الحالة المحلية
// ------------------------------------------------------------------
const LS = {
  get(k, d) { try { return JSON.parse(localStorage.getItem('ahwa_' + k)) ?? d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('ahwa_' + k, JSON.stringify(v)); } catch (e) {} }
};
function randId(n = 12) { const a = new Uint8Array(n); crypto.getRandomValues(a); return [...a].map((b) => b.toString(16).padStart(2, '0')).join(''); }

const ident = LS.get('ident', null) || { pid: 'p_' + randId(6), secret: randId(12) };
LS.set('ident', ident);

const S = {
  screen: 'home',
  mode: null, // create | join
  code: null,
  profile: LS.get('profile', null) || { name: '', outfit: 'karak_cup', face: 'mustache_boss', hat: 'fez_tarboush' },
  avTab: 'outfit',
  setup: LS.get('setup', null) || { game: null, teamNames: ['فريق الكرك', 'فريق السحلب'], categories: [], count: 10, writeSec: 60, voteSec: 30, hintSec: 30, chessSec: 180, useCustom: false },
  custom: LS.get('custom', []),
  view: null,
  offset: 0,
  es: null,
  drawer: false,
  draft: {},
  pickOpt: null,
  busy: false,
  lastEventId: null,
  prevScores: null,
  bumps: {},
  lastKey: null,
  resumable: null
};

// ------------------------------------------------------------------
// الشبكة
// ------------------------------------------------------------------
async function api(action, data = {}) {
  if (S.busy && action !== 'kr_suggest' && action !== 'kr_vote_suggest') return { ok: false };
  S.busy = true;
  try {
    const r = await fetch('/api/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, code: S.code, pid: ident.pid, secret: ident.secret, ...data }) });
    const j = await r.json();
    if (!j.ok && j.error) toast(j.error, 'err');
    return j;
  } catch (e) {
    toast('الاتصال بالسيرفر وقع — اتأكد إنك على نفس الشبكة', 'err');
    return { ok: false };
  } finally {
    S.busy = false;
  }
}

function connect(code) {
  if (S.es) S.es.close();
  S.code = code;
  const es = new EventSource(`/api/stream?code=${encodeURIComponent(code)}&pid=${ident.pid}&secret=${ident.secret}`);
  S.es = es;
  es.onmessage = (ev) => {
    const v = JSON.parse(ev.data);
    S.offset = v.now - Date.now();
    onEvent(v);
    S.view = v;
    if (v.status === 'closed') { closedRoom(); return; }
    render();
  };
  es.onerror = async () => {
    const r = await fetch('/api/room-exists?code=' + encodeURIComponent(code)).then((x) => x.json()).catch(() => null);
    if (r && !r.ok) closedRoom();
  };
}

function closedRoom() {
  if (S.es) S.es.close();
  S.es = null;
  S.view = null;
  LS.set('session', null);
  S.screen = 'closed';
  render();
}

function onEvent(v) {
  // نقاط متحركة
  if (S.prevScores && v.teams) {
    v.teams.forEach((t) => {
      const old = S.prevScores[t.id];
      if (old != null && old !== t.score) S.bumps[t.id] = { d: t.score - old, at: Date.now() };
    });
  }
  S.prevScores = v.teams ? Object.fromEntries(v.teams.map((t) => [t.id, t.score])) : null;

  const e = v.lastEvent;
  if (!e || e.id === S.lastEventId) return;
  const first = S.lastEventId === null;
  S.lastEventId = e.id;
  if (first) return;
  const tn = (id) => (v.teams.find((t) => t.id === id) || {}).name || '';
  const msgs = {
    join: () => v.me.role === 'admin' && `${e.name} دخل الغرفة`,
    wrong: () => `${tn(e.team)} غلط — اتجمد`,
    golden: () => `فرصة ذهبية لـ ${tn(e.team)}!`,
    rejected: () => `الحكم رفض إجابة ${tn(e.team)} — اكتبوا واحدة تانية`,
    penalty: () => `عقوبة تضليل: -15 ثانية من ${tn(e.team)}`,
    adjust: () => `الحكم عدّل نقاط ${tn(e.team)} (${e.delta > 0 ? '+' : ''}${e.delta})`,
    hint: () => 'اتفتح تلميح جديد',
    turn: () => `الدور على ${tn(e.team)}`
  };
  const m = msgs[e.type] && msgs[e.type]();
  if (m) toast(m);
  if (e.type === 'final') setTimeout(confetti, 300);
}

// ------------------------------------------------------------------
// التوست
// ------------------------------------------------------------------
function toast(msg, kind = '') {
  const box = $('#toasts');
  const el = document.createElement('div');
  el.className = 'toast ' + kind;
  el.innerHTML = `${kind === 'err' ? ic('x') : ic('bulb')}<span>${esc(msg)}</span>`;
  box.appendChild(el);
  setTimeout(() => el.classList.add('out'), 2800);
  setTimeout(() => el.remove(), 3300);
}

// ------------------------------------------------------------------
// أدوات العرض
// ------------------------------------------------------------------
function avatar(cfg, size = 'md', extra = '') {
  return `<span class="avatar av-${size} ${extra}">${buildCharacterSVG(cfg || {})}</span>`;
}
const teamOf = (id) => (S.view ? S.view.teams.find((t) => t.id === id) : null) || { id, name: id === 'A' ? 'الفريق أ' : 'الفريق ب', score: 0 };
const playersOf = (team) => (S.view ? S.view.players.filter((p) => p.team === team) : []);
const isAdmin = () => S.view && S.view.me.role === 'admin';
const me = () => (S.view ? S.view.me : {});
const myTeam = () => me().team;
const blankify = (q) => esc(q).replace(/_{2,}/g, '<span class="blank">؟؟؟</span>');

function logo(size = 'lg') {
  return `<div class="logo logo-${size}">
    <div class="logo-board"><span class="logo-tape"></span>
      <span class="logo-line1">على</span><span class="logo-line2">القهوة</span>
      ${sticker('cup', size === 'lg' ? 66 : 30, 'logo-cup')}
    </div>
  </div>`;
}

function stepper(steps, active) {
  return `<ol class="stepper" aria-label="مراحل">${steps
    .map((s, i) => `<li class="${i < active ? 'done' : i === active ? 'on' : ''}"><span class="step-n">${i < active ? ic('check') : i + 1}</span><span class="step-t">${s}</span></li>`)
    .join('<li class="step-line" aria-hidden="true"></li>')}</ol>`;
}

function topbar(extra = '') {
  const v = S.view;
  return `<header class="topbar">
    ${logo('sm')}
    <div class="topbar-mid">${extra}</div>
    ${v ? `<div class="room-chip" title="كود الغرفة">${ic('lock')}<b>${esc(v.code)}</b></div>` : ''}
  </header>`;
}

function remaining() {
  const v = S.view;
  if (!v) return 0;
  if (v.pausedLeft != null) return Math.ceil(v.pausedLeft / 1000);
  if (!v.deadline) return 0;
  return Math.max(0, Math.ceil((v.deadline - (Date.now() + S.offset)) / 1000));
}
function phaseTotal() {
  const v = S.view;
  if (!v) return 1;
  const s = v.settings;
  if (v.game === 'karak') return v.phase === 'vote' ? s.voteSec : v.phase === 'write' && v.kr && remaining() > s.writeSec ? remaining() : s.writeSec;
  if (v.game === 'sahlab') return s.hintSec;
  return s.chessSec;
}
function timerRing() {
  const v = S.view;
  const show = v && (v.deadline || v.pausedLeft != null) && !(v.game === 'tamr');
  if (!show) return '';
  return `<div class="timer js-timer ${v.pausedLeft != null ? 'paused' : ''}" role="timer">
    <svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19" class="t-bg"/><circle cx="22" cy="22" r="19" class="t-fg"/></svg>
    <span class="t-num">${remaining()}</span>
  </div>`;
}

function scorebar() {
  const v = S.view;
  const [a, b] = v.teams;
  const mt = myTeam();
  const cell = (t) => {
    const bump = S.bumps[t.id] && Date.now() - S.bumps[t.id].at < 2500 ? S.bumps[t.id].d : null;
    const cap = v.players.find((p) => p.id === t.captainId);
    return `<div class="score team-${t.id} ${mt === t.id ? 'mine' : ''}">
      ${avatar(cap, 'xs')}
      <div class="score-txt"><span class="score-name">${esc(t.name)}${mt === t.id ? ' <em>(فريقك)</em>' : ''}</span>
      <span class="score-val">${t.score}</span></div>
      ${bump ? `<span class="bump ${bump > 0 ? 'up' : 'down'}">${bump > 0 ? '+' : ''}${bump}</span>` : ''}
    </div>`;
  };
  return `<div class="scorebar">
    ${cell(a)}
    <div class="score-mid"><span class="round-pill">${GAMES[v.game].name} · الجولة ${Math.max(1, v.round + 1)} من ${v.totalRounds}</span>${timerRing()}</div>
    ${cell(b)}
  </div>`;
}

// ------------------------------------------------------------------
// الرسم العام
// ------------------------------------------------------------------
function screenKey() {
  const v = S.view;
  if (!v) return S.screen;
  if (v.me.role === 'kicked') return 'kicked';
  if (v.status === 'lobby') return isAdmin() ? 'lobbyAdmin' : myTeam() ? 'lobbyPlayer' : 'teamPick';
  if (v.status === 'playing') return !isAdmin() && !myTeam() ? 'teamPick' : `${v.game}:${v.phase}:${v.round}`;
  if (v.status === 'finished') return 'final';
  return S.screen;
}

function render() {
  const app = $('#app');
  const key = screenKey();
  // حفظ التركيز والكتابة
  const act = document.activeElement;
  const focusId = act && act.id && (act.tagName === 'INPUT' || act.tagName === 'TEXTAREA') ? act.id : null;
  const selS = focusId ? act.selectionStart : null;
  const selE = focusId ? act.selectionEnd : null;
  const scrollY = window.scrollY;

  let html = '';
  const v = S.view;
  if (!v) {
    html = ({ home: viewHome, avatar: viewAvatar, setup: viewSetup, custom: viewCustom, closed: viewClosed, loading: viewLoading })[S.screen]();
  } else if (key === 'kicked') html = viewKicked();
  else if (v.status === 'lobby') html = isAdmin() ? viewLobbyAdmin() : myTeam() ? viewLobbyPlayer() : viewTeamPick();
  else if (v.status === 'playing') {
    if (!isAdmin() && !myTeam()) html = viewTeamPick();
    else html = v.game === 'karak' ? viewKarak() : v.game === 'sahlab' ? viewSahlab() : viewTamr();
    if (isAdmin()) html += adminDrawer();
  } else if (v.status === 'finished') html = viewFinal() + (isAdmin() ? adminDrawer() : '');

  const changed = key !== S.lastKey;
  app.className = changed ? 'enter' : '';
  app.innerHTML = html;
  S.lastKey = key;

  if (focusId) {
    const el = document.getElementById(focusId);
    if (el) { el.focus({ preventScroll: true }); try { el.setSelectionRange(selS, selE); } catch (e) {} }
  }
  if (changed) window.scrollTo(0, 0); else window.scrollTo(0, scrollY);
  tick();
}

// تحديث العداد بدون إعادة رسم
function tick() {
  const el = document.querySelector('.js-timer');
  if (el) {
    const r = remaining();
    const total = Math.max(1, phaseTotal());
    el.querySelector('.t-num').textContent = r;
    const fg = el.querySelector('.t-fg');
    const C = 2 * Math.PI * 19;
    fg.style.strokeDasharray = C;
    fg.style.strokeDashoffset = C * (1 - Math.min(1, r / total));
    el.classList.toggle('low', r <= 5 && S.view.pausedLeft == null);
  }
  const v = S.view;
  if (v && v.game === 'tamr' && v.tm) {
    document.querySelectorAll('.js-clock').forEach((c) => {
      c.textContent = mmss(v.tm.clocks[c.dataset.team]);
    });
  }
}
setInterval(tick, 250);
const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// ==================================================================
// 1) الصفحة الرئيسية
// ==================================================================
function viewHome() {
  return `<section class="wrap narrow home">
    ${logo('lg')}
    <p class="home-sub">ألعاب السهرة على القهوة — فرق، حكم، وأسئلة عمرها ما بتتكرر</p>
    <div class="home-art" aria-hidden="true">
      <img src="/assets/ui/karak.jpg" alt="" class="blend"/><img src="/assets/ui/sahlab.jpg" alt="" class="blend"/><img src="/assets/ui/tamr.jpg" alt="" class="blend"/>
    </div>
    <div class="card tape home-card">
      <button class="btn primary block lg" onclick="goCreate()">${ic('whistle')} اعمل غرفة (أنا الحكم)</button>
      <div class="or"><span>أو</span></div>
      <label class="field"><span>عندك كود غرفة؟</span>
        <div class="row">
          <input id="joinCode" class="input code-input" maxlength="7" placeholder="ABC-123" value="${esc(S.draft.joinCode || '')}" oninput="S.draft.joinCode=this.value.toUpperCase()" autocomplete="off"/>
          <button class="btn olive" onclick="goJoinCode()">${ic('enter')} ادخل</button>
        </div>
      </label>
      ${S.resumable ? `<button class="btn ghost block" onclick="resume()">${ic('home')} ارجع لغرفتك ${esc(S.resumable.code)}</button>` : ''}
    </div>
    <div class="home-how">
      ${['اعمل شخصيتك', 'الحكم يعمل الغرفة ويوزع الفرق', 'امسح الـ QR وادخل من موبايلك', 'العبوا والنقط بتتحسب لوحدها'].map((t, i) => `<div class="how"><b>${i + 1}</b><span>${t}</span></div>`).join('')}
    </div>
  </section>`;
}

function goCreate() { S.mode = 'create'; S.screen = 'avatar'; render(); }
async function goJoinCode() {
  const code = (S.draft.joinCode || '').trim().toUpperCase();
  if (!/^[A-Z0-9]{3}-?[A-Z0-9]{3}$/.test(code)) return toast('اكتب الكود صح (6 حروف/أرقام)', 'err');
  const c = code.includes('-') ? code : code.slice(0, 3) + '-' + code.slice(3);
  const r = await fetch('/api/room-exists?code=' + c).then((x) => x.json()).catch(() => ({}));
  if (!r.ok) return toast('الغرفة دي مش موجودة', 'err');
  history.replaceState(null, '', '/room/' + c);
  S.mode = 'join'; S.code = c; S.screen = 'avatar'; render();
}
function resume() { const s = S.resumable; S.mode = s.role === 'admin' ? 'create' : 'join'; connect(s.code); }

// ==================================================================
// 2) صفحة الشخصية (زي kalak)
// ==================================================================
function viewAvatar() {
  const p = S.profile;
  const parts = CHARACTER_PARTS[S.avTab];
  const curIdx = parts.findIndex((x) => x.id === p[S.avTab]);
  const cur = parts[curIdx] || parts[0];
  const steps = S.mode === 'create' ? ['الشخصية', 'إعداد اللعبة', 'غرفة الانتظار', 'اللعب'] : ['الشخصية', 'الفريق', 'اللعب'];
  const tabs = [['outfit', 'الشكل'], ['face', 'الوش'], ['hat', 'الطاقية']];
  return `${topbar(stepper(steps, 0))}
  <section class="wrap avatar-page">
    <div class="card tape av-stage-card">
      <h1 class="h1">اعمل شخصيتك</h1>
      <div class="av-stage">
        <button class="arrow" aria-label="السابق" onclick="cyclePart(-1)">${ic('chevR')}</button>
        <div class="av-pedestal" id="avPreview">${avatar(p, 'xl', 'bob')}</div>
        <button class="arrow" aria-label="التالي" onclick="cyclePart(1)">${ic('chevL')}</button>
      </div>
      <p class="part-name">${esc(cur.name)} <small>${curIdx + 1} / ${parts.length}</small></p>
      <label class="field"><span>اسمك</span>
        <input id="pname" class="input big" maxlength="20" placeholder="اكتب اسمك هنا" value="${esc(p.name)}" oninput="S.profile.name=this.value"/>
      </label>
      <button class="btn ghost sm" onclick="randomAvatar()">${ic('dice')} شخصية عشوائية</button>
    </div>
    <div class="card parts-card">
      <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" class="tab ${S.avTab === k ? 'on' : ''}" onclick="S.avTab='${k}';render()">${l} <small>${CHARACTER_PARTS[k].length}</small></button>`).join('')}</div>
      <div class="parts-grid">
        ${parts.map((it) => `<button class="part ${p[S.avTab] === it.id ? 'on' : ''}" title="${esc(it.name)}" onclick="setPart('${S.avTab}','${it.id}')">${avatar({ ...p, [S.avTab]: it.id }, 'sm')}</button>`).join('')}
      </div>
    </div>
    <div class="next-bar"><button class="btn primary lg" onclick="avatarNext()">التالي ${ic('next')}</button></div>
  </section>`;
}
function setPart(cat, id) { S.profile[cat] = id; LS.set('profile', S.profile); render(); }
function cyclePart(step) {
  const parts = CHARACTER_PARTS[S.avTab];
  const i = parts.findIndex((x) => x.id === S.profile[S.avTab]);
  S.profile[S.avTab] = parts[(i + step + parts.length) % parts.length].id;
  LS.set('profile', S.profile);
  render();
}
function randomAvatar() {
  for (const k of ['outfit', 'face', 'hat']) { const arr = CHARACTER_PARTS[k]; S.profile[k] = arr[Math.floor(Math.random() * arr.length)].id; }
  LS.set('profile', S.profile);
  render();
}
async function avatarNext() {
  if (!S.profile.name.trim()) { toast('اكتب اسمك الأول', 'err'); $('#pname') && $('#pname').focus(); return; }
  LS.set('profile', S.profile);
  if (S.mode === 'create') { S.screen = 'setup'; render(); return; }
  const r = await api('join', { profile: S.profile });
  if (r.ok) { LS.set('session', { code: S.code, role: 'player' }); connect(S.code); }
}

// ==================================================================
// 3) إعداد اللعبة (الحكم)
// ==================================================================
function viewSetup() {
  const s = S.setup;
  const g = s.game;
  const cats = g ? CATS[g] : [];
  const customOk = S.custom.filter((c) => c.q && c.truth).length;
  return `${topbar(stepper(['الشخصية', 'إعداد اللعبة', 'غرفة الانتظار', 'اللعب'], 1))}
  <section class="wrap setup">
    <div class="setup-head">
      <h1 class="h1">إعداد السهرة</h1>
      <p class="sub">إنت الحكم: مش هتلعب، بس هتنظم وتحكم وتشوف الإجابات الصح.</p>
    </div>

    <div class="card">
      <h2 class="h2"><span class="num">1</span> اختار اللعبة</h2>
      <div class="games">
        ${Object.entries(GAMES).map(([k, G]) => `
          <button class="game-card ${g === k ? 'sel' : ''}" onclick="pickGame('${k}')" aria-pressed="${g === k}">
            <img src="${G.img}" alt="" class="blend"/>
            <span class="game-tag">${G.tag}</span>
            <b class="game-name">${G.name}</b>
            <span class="game-desc">${G.desc}</span>
            ${g === k ? `<span class="stamp">${ic('check')}</span>` : ''}
          </button>`).join('')}
      </div>
    </div>

    <div class="setup-cols">
      <div class="card">
        <h2 class="h2"><span class="num">2</span> أسماء الفريقين</h2>
        ${[0, 1].map((i) => `
          <label class="field team-name-field team-${i ? 'B' : 'A'}"><span>${i ? 'الفريق ب' : 'الفريق أ'}</span>
            <input id="tn${i}" class="input" maxlength="24" value="${esc(s.teamNames[i])}" oninput="S.setup.teamNames[${i}]=this.value"/>
          </label>`).join('')}
        <p class="note">${ic('crown')} بعد ما اللاعبين يدخلوا، إنت اللي بتختار قائد كل فريق.</p>
      </div>

      <div class="card">
        <h2 class="h2"><span class="num">3</span> الأسئلة</h2>
        <div class="seg">
          <button class="${!s.useCustom ? 'on' : ''}" onclick="S.setup.useCustom=false;render()">بنك الأسئلة</button>
          <button class="${s.useCustom ? 'on' : ''}" onclick="S.setup.useCustom=true;render()">أسئلتك الخاصة (كاستم)</button>
        </div>
        ${s.useCustom ? `
          <div class="custom-sum">
            <b>${customOk}</b> سؤال جاهز
            <button class="btn olive sm" onclick="openCustom()">${ic('pencil')} ${customOk ? 'عدّل أسئلتك' : 'اكتب أسئلتك'}</button>
          </div>` : `
          ${cats.length ? `<div class="field"><span>الفئات <small>(لو ماختارتش حاجة هيبقى كوكتيل)</small></span>
            <div class="chips">${cats.map(([id, l]) => `<button class="chip ${s.categories.includes(id) ? 'on' : ''}" onclick="toggleCat('${id}')">${l}</button>`).join('')}</div></div>` : g === 'tamr' ? '<p class="note">شخصيات مشهورة متنوعة (ممثلين، لاعيبة، مطربين، تاريخ).</p>' : '<p class="note">اختار اللعبة الأول.</p>'}
          <label class="field"><span>عدد ${g === 'tamr' ? 'الجولات' : 'الأسئلة'}: <b id="countLbl">${s.count}</b></span>
            <input type="range" class="range" min="3" max="20" value="${s.count}" oninput="S.setup.count=+this.value;document.getElementById('countLbl').textContent=this.value"/>
          </label>
          <p class="note">${ic('star')} كل سؤال بيتسأل مرة واحدة بس — عمره ما هيتكرر في أي سهرة جاية.</p>`}
      </div>

      <div class="card">
        <h2 class="h2"><span class="num">4</span> الوقت</h2>
        ${!g ? '<p class="note">اختار اللعبة الأول.</p>' : g === 'karak' ? rangeField('writeSec', 'وقت كتابة الإجابة المزيفة', 20, 180, 5) + rangeField('voteSec', 'وقت الاختيار', 15, 120, 5) : g === 'sahlab' ? rangeField('hintSec', 'وقت كل تلميح', 15, 120, 5) : rangeField('chessSec', 'رصيد ساعة الشطرنج لكل فريق', 60, 600, 15)}
        <p class="note warn">${ic('lock')} الوقت بيتقفل أول ما اللعبة تبدأ — مش هتقدر تغيره في النص.</p>
      </div>
    </div>

    <div class="next-bar"><button class="btn primary lg" onclick="createRoom()">${ic('next')} اعمل الغرفة وابعت الدعوة</button></div>
  </section>`;
}
function fmtSec(x) { return x >= 60 ? `${Math.floor(x / 60)}:${String(x % 60).padStart(2, '0')} دقيقة` : `${x} ثانية`; }
function rangeField(key, label, min, max, step) {
  const val = S.setup[key];
  return `<label class="field"><span>${label}: <b id="lbl_${key}">${fmtSec(val)}</b></span>
    <input type="range" class="range" min="${min}" max="${max}" step="${step}" value="${val}" oninput="S.setup.${key}=+this.value;document.getElementById('lbl_${key}').textContent=fmtSec(+this.value)"/></label>`;
}
function pickGame(k) { S.setup.game = k; S.setup.categories = []; render(); }
function toggleCat(id) { const c = S.setup.categories; const i = c.indexOf(id); i >= 0 ? c.splice(i, 1) : c.push(id); render(); }
async function createRoom() {
  const s = S.setup;
  if (!s.game) return toast('اختار اللعبة الأول', 'err');
  const custom = S.custom.filter((c) => c.q.trim() && c.truth.trim());
  if (s.useCustom && !custom.length) return toast('اكتب أسئلة الكاستم الأول', 'err');
  if (s.useCustom && s.game === 'tamr' && custom.length < 2) return toast('تمر هندي محتاج شخصيتين على الأقل', 'err');
  LS.set('setup', s);
  const r = await api('create_room', { game: s.game, settings: s, customPack: custom, profile: S.profile });
  if (r.ok) {
    LS.set('session', { code: r.code, role: 'admin' });
    history.replaceState(null, '', '/');
    connect(r.code);
  }
}

// ==================================================================
// 4) صفحة الأسئلة المخصصة (كاستم)
// ==================================================================
function viewCustom() {
  const g = S.setup.game;
  const qLabel = g === 'sahlab' ? 'التلميح' : g === 'tamr' ? 'وصف الشخصية' : 'السؤال';
  const aLabel = g === 'tamr' ? 'اسم الشخصية' : 'الإجابة الصح';
  return `${topbar(stepper(['الشخصية', 'إعداد اللعبة', 'غرفة الانتظار', 'اللعب'], 1))}
  <section class="wrap narrow custom">
    <div class="card tape">
      <h1 class="h1">${ic('pencil')} أسئلتك الخاصة</h1>
      <p class="sub">اكتب ${qLabel} و${aLabel}. ${g === 'karak' ? 'في كرك حط <b>____</b> مكان الإجابة في السؤال، والـ AI هيجيب إجابتين مزيفين لكل سؤال.' : ''}</p>
      <div class="row wrap-row">
        <button class="btn ghost sm" onclick="presetCustom(10)">10 أسئلة</button>
        <button class="btn ghost sm" onclick="presetCustom(20)">20 سؤال</button>
        <span class="spacer"></span>
        <span class="pill">${S.custom.filter((c) => c.q && c.truth).length} / ${S.custom.length} جاهز</span>
      </div>
    </div>
    <div class="custom-list">
      ${S.custom.map((c, i) => `
        <div class="card q-row">
          <div class="q-num">${i + 1}</div>
          <div class="q-fields">
            <label class="field"><span>${qLabel}</span><textarea id="cq${i}" class="input" rows="2" maxlength="220" oninput="S.custom[${i}].q=this.value;saveCustom()" placeholder="${g === 'karak' ? 'مثال: أطول حرب في التاريخ استمرت ____' : ''}">${esc(c.q)}</textarea></label>
            <label class="field"><span>${aLabel}</span><input id="ca${i}" class="input" maxlength="60" value="${esc(c.truth)}" oninput="S.custom[${i}].truth=this.value;saveCustom()"/></label>
          </div>
          <button class="icon-btn danger" aria-label="حذف" onclick="S.custom.splice(${i},1);saveCustom();render()">${ic('trash')}</button>
        </div>`).join('')}
      <button class="btn ghost block" onclick="S.custom.push({q:'',truth:''});saveCustom();render()">${ic('plus')} أضف سؤال</button>
    </div>
    <div class="next-bar"><button class="btn primary lg" onclick="S.setup.useCustom=true;S.screen='setup';render()">${ic('check')} احفظ وكمّل الإعداد</button></div>
  </section>`;
}
function openCustom() { if (!S.custom.length) presetCustom(10, true); S.screen = 'custom'; render(); }
function presetCustom(n, silent) {
  while (S.custom.length < n) S.custom.push({ q: '', truth: '' });
  if (S.custom.length > n) S.custom = S.custom.slice(0, n).concat(S.custom.slice(n).filter((c) => c.q || c.truth));
  saveCustom();
  if (!silent) render();
}
function saveCustom() { LS.set('custom', S.custom); }

// ==================================================================
// 5) غرفة الانتظار
// ==================================================================
function memberRow(p, adminCtl) {
  const v = S.view;
  const t = v.teams.find((x) => x.id === p.team);
  const cap = t && t.captainId === p.id;
  return `<li class="member ${p.online ? '' : 'offline'} ${p.id === me().id ? 'me' : ''}">
    ${avatar(p, 'sm')}
    <span class="m-name">${esc(p.name)}${p.isTest ? ' <small>(تجريبي)</small>' : ''}${p.id === me().id ? ' <small>(إنت)</small>' : ''}</span>
    ${cap ? `<span class="crown" title="القائد">${ic('crown')} القائد</span>` : ''}
    ${adminCtl ? `<span class="m-ctl">
      ${p.team && !cap ? `<button class="icon-btn" title="اعمله قائد" aria-label="اعمله قائد" onclick="api('set_captain',{target:'${p.id}'})">${ic('crown')}</button>` : ''}
      <button class="icon-btn" title="${p.team ? 'انقله للفريق التاني' : 'حطه في فريق'}" aria-label="نقل" onclick="api('move_player',{target:'${p.id}'})">${ic('swap')}</button>
      <button class="icon-btn danger" title="اطرده" aria-label="طرد" onclick="kick('${p.id}','${esc(String(p.name).replace(/['"\\]/g, ''))}')">${ic('kick')}</button>
    </span>` : ''}
  </li>`;
}
function kick(id, name) { if (confirm(`تطرد ${name} من الغرفة؟`)) api('kick', { target: id }); }

function viewLobbyAdmin() {
  const v = S.view;
  const s = v.settings;
  const unassigned = v.players.filter((p) => !p.team);
  const empty = v.teams.filter((t) => !playersOf(t.id).length);
  const timers = v.game === 'karak' ? `كتابة ${s.writeSec}ث · اختيار ${s.voteSec}ث` : v.game === 'sahlab' ? `كل تلميح ${s.hintSec}ث` : `ساعة ${mmss(s.chessSec)} لكل فريق`;
  const catNames = s.useCustom ? `كاستم (${v.customCount} سؤال)` : s.categories.length ? s.categories.map((c) => (CATS[v.game].find((x) => x[0] === c) || [c, c])[1]).join('، ') : 'كوكتيل';
  return `${topbar(stepper(['الشخصية', 'إعداد اللعبة', 'غرفة الانتظار', 'اللعب'], 2))}
  <section class="wrap wide lobby">
    <div class="lobby-grid">
      <aside class="card tape invite">
        <h2 class="h2">${ic('link')} ادعي الشلة</h2>
        <p class="sub">امسحوا الكود بكاميرا الموبايل أو انسخوا الرابط للدخول للغرفة</p>
        <div class="qr-box"><img src="/api/qr?code=${encodeURIComponent(v.code)}" alt="QR للدخول للغرفة" width="220" height="220"/></div>
        <div class="code-big" aria-label="كود الغرفة">${esc(v.code)}</div>
        <div class="link-row"><input class="input" readonly value="${esc(`${location.origin}/room/${v.code}`)}" onclick="this.select()"/><button class="btn olive sm" onclick="copyLink()">${ic('copy')} نسخ</button></div>
        <div class="settings-sum">
          <div><span>اللعبة</span><b>${GAMES[v.game].name}</b></div>
          <div><span>الأسئلة</span><b>${esc(catNames)}</b></div>
          <div><span>العدد</span><b>${s.useCustom ? v.customCount : s.count}</b></div>
          <div><span>الوقت</span><b>${timers}</b></div>
        </div>
        <p class="note warn">${ic('lock')} الإعدادات هتتقفل أول ما تدوس ابدأ.</p>
      </aside>

      <div class="lobby-main">
        <div class="judge-card card">
          ${avatar(v.admin, 'md')}
          <div><b>${esc(v.admin.name)}</b><span class="sub">الحكم — مش بيلعب</span></div>
          <span class="badge">${ic('whistle')} الحكم</span>
        </div>
        <div class="teams-2">
          ${v.teams.map((t) => `
            <div class="card team-col team-${t.id}">
              <div class="team-head">
                <input id="rn${t.id}" class="input team-title" maxlength="24" value="${esc(S.draft['rn' + t.id] ?? t.name)}" oninput="S.draft['rn${t.id}']=this.value" onchange="api('rename_team',{team:'${t.id}',name:this.value});delete S.draft['rn${t.id}']" aria-label="اسم الفريق"/>
                <span class="count">${playersOf(t.id).length} ${ic('users')}</span>
              </div>
              <ul class="members">${playersOf(t.id).map((p) => memberRow(p, true)).join('') || `<li class="empty">${sticker(t.id === 'A' ? 'latte' : 'pink', 46)}<span>مستني لاعبين...</span></li>`}</ul>
            </div>`).join('')}
        </div>
        ${unassigned.length ? `<div class="card unassigned"><h3 class="h3">لسه بيختاروا فريق (${unassigned.length})</h3><ul class="members">${unassigned.map((p) => memberRow(p, true)).join('')}</ul></div>` : ''}
        <details class="card tools">
          <summary>${ic('sliders')} أدوات التجربة</summary>
          <p class="sub">لاعب وهمي للتجربة بس — مابيكونش قائد ومابيلعبش.</p>
          <div class="row"><button class="btn ghost sm" onclick="addTest('A')">${ic('plus')} لـ ${esc(v.teams[0].name)}</button><button class="btn ghost sm" onclick="addTest('B')">${ic('plus')} لـ ${esc(v.teams[1].name)}</button></div>
        </details>
      </div>
    </div>
    <div class="next-bar">
      ${empty.length ? `<span class="why">${ic('users')} ${esc(empty.map((t) => t.name).join(' و '))} محتاج لاعب على الأقل</span>` : ''}
      <button class="btn primary lg" ${empty.length ? 'disabled' : ''} onclick="startGame()">${ic('play')} ابدأ ${GAMES[v.game].name}</button>
    </div>
  </section>`;
}
function copyLink() {
  const u = `${location.origin}/room/${S.view.code}`;
  (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(() => toast('اتنسخ الرابط')).catch(() => toast(u));
}
function addTest(team) {
  const pick = (k) => CHARACTER_PARTS[k][Math.floor(Math.random() * CHARACTER_PARTS[k].length)].id;
  api('add_test_player', { team, parts: { outfit: pick('outfit'), face: pick('face'), hat: pick('hat') } });
}
async function startGame() {
  const btn = document.querySelector('.next-bar .btn.primary');
  if (btn) { btn.disabled = true; btn.innerHTML = 'بنجهز الأسئلة...'; }
  await api('start_game');
}

function viewTeamPick() {
  const v = S.view;
  return `${topbar(stepper(['الشخصية', 'الفريق', 'اللعب'], 1))}
  <section class="wrap narrow team-pick">
    <h1 class="h1 center">اختار فريقك</h1>
    <p class="sub center">الحكم ${esc(v.admin.name)} هيختار قائد كل فريق</p>
    <div class="pick-2">
      ${v.teams.map((t) => `
        <button class="card team-pick-card team-${t.id}" onclick="api('pick_team',{team:'${t.id}'})">
          <b class="tp-name">${esc(t.name)}</b>
          <div class="tp-avatars">${playersOf(t.id).slice(0, 6).map((p) => avatar(p, 'sm')).join('') || '<span class="sub">لسه فاضي — كن أول واحد</span>'}</div>
          <span class="tp-count">${playersOf(t.id).length} لاعب</span>
          <span class="btn primary sm">انضم ${ic('next')}</span>
        </button>`).join('')}
    </div>
  </section>`;
}

function viewLobbyPlayer() {
  const v = S.view;
  const t = teamOf(myTeam());
  const other = teamOf(myTeam() === 'A' ? 'B' : 'A');
  return `${topbar(stepper(['الشخصية', 'الفريق', 'اللعب'], 1))}
  <section class="wrap narrow lobby-player">
    <div class="card tape team-col team-${t.id}">
      <p class="sub">إنت في</p>
      <h1 class="h1">${esc(t.name)}</h1>
      ${me().captain ? `<p class="captain-banner">${ic('crown')} إنت قائد الفريق — إنت اللي هتبعت الإجابات</p>` : ''}
      <ul class="members">${playersOf(t.id).map((p) => memberRow(p, false)).join('')}</ul>
    </div>
    <div class="card mini-team team-${other.id}"><b>${esc(other.name)}</b><div class="tp-avatars">${playersOf(other.id).map((p) => avatar(p, 'xs')).join('') || '<span class="sub">فاضي</span>'}</div></div>
    <div class="waiting">${sticker('teapot', 90, 'wobble')}<p>مستنيين الحكم يبدأ <b>${GAMES[v.game].name}</b><span class="dots"><i></i><i></i><i></i></span></p></div>
    <button class="btn ghost block" onclick="api('pick_team',{team:'${other.id}'})">${ic('swap')} غيّر لفريق ${esc(other.name)}</button>
  </section>`;
}

// ==================================================================
// 6) كرك
// ==================================================================
function statusPills(flags, labelDone, labelWait) {
  return `<div class="pills">${S.view.teams.map((t) => `<span class="status-pill team-${t.id} ${flags[t.id] ? 'ok' : 'wait'}">${flags[t.id] ? ic('check') : ic('clock')} ${esc(t.name)}: ${flags[t.id] ? labelDone : labelWait}</span>`).join('')}</div>`;
}

function projector(q, extra = '') {
  return `<div class="projector"><div class="proj-screen"><p class="proj-q">${blankify(q)}</p>${extra}</div><div class="proj-pull" aria-hidden="true"></div></div>`;
}

function viewKarak() {
  const v = S.view;
  const k = v.kr;
  const admin = isAdmin();
  let body = '';
  if (admin) body = karakAdmin(k);
  else body = karakPlayer(k);
  return `${topbar()}<section class="wrap game karak">${scorebar()}${body}</section>`;
}

function srcLabel(src) {
  const v = S.view;
  if (src === 'truth') return 'الإجابة الصح';
  if (src === 'A' || src === 'B') return `كذبة ${teamOf(src).name}`;
  if (src === 'admin') return 'كذبة الحكم';
  return 'كذبة الـ AI';
}

function revealList(k) {
  const v = S.view;
  const lines = (k.results && k.results.lines) || [];
  return `<div class="reveal-list">
    ${k.options.slice().sort((a, b) => (a.src === 'truth') - (b.src === 'truth')).map((o, i) => {
      const pickers = v.teams.filter((t) => k.votes && k.votes[t.id] === o.id);
      return `<div class="opt revealed ${o.src === 'truth' ? 'truth' : 'fake'}" style="animation-delay:${i * 0.35}s">
        <span class="opt-text">${esc(o.text)}</span>
        <span class="opt-src src-${o.src}">${srcLabel(o.src)}</span>
        ${pickers.length ? `<span class="pickers">${pickers.map((t) => `<span class="tchip team-${t.id}">${esc(t.name)}</span>`).join('')}</span>` : ''}
      </div>`;
    }).join('')}
  </div>
  <div class="card results">
    ${lines.map((l) => {
      const t = teamOf(l.team);
      const txt = l.kind === 'truth' ? `${esc(t.name)} لقى الإجابة الصح` : l.kind === 'fooled' ? `${esc(t.name)} اتخدع في كذبة ${esc(teamOf(l.by).name)}` : l.kind === 'house' ? `${esc(t.name)} وقع في ${l.src === 'admin' ? 'كذبة الحكم' : 'كذبة الـ AI'}` : `${esc(t.name)} ماختارش في الوقت`;
      const who = l.kind === 'fooled' ? l.by : l.team;
      return `<div class="res-line"><span>${txt}</span>${l.pts ? `<b class="pts ${l.pts > 0 ? 'up' : 'down'}">${esc(teamOf(who).name)} ${l.pts > 0 ? '+' : ''}${l.pts}</b>` : '<b class="pts">0</b>'}</div>`;
    }).join('')}
  </div>`;
}

function karakPlayer(k) {
  const v = S.view;
  const t = myTeam();
  const cap = me().captain;
  const ph = v.phase;
  if (ph === 'write') {
    const sug = k.suggestions || {};
    const mine = sug[me().id] || '';
    const others = Object.entries(sug);
    const nameOf = (pid) => (v.players.find((p) => p.id === pid) || {}).name || '';
    return `${projector(k.q)}
      ${k.myBluff ? `<div class="card done-card">${ic('check')} <div><b>إجابة فريقكم اتبعتت:</b><p class="big-txt">${esc(k.myBluff)}</p></div></div>${statusPills(k.submitted, 'بعت', 'لسه بيكتب')}` : `
      <div class="card write-card">
        <h2 class="h2">${ic('pencil')} ${cap ? 'اكتب إجابة مزيفة تخدع بيها الفريق التاني' : 'اقترح كذبة على القائد'}</h2>
        <p class="sub">${cap ? 'إنت القائد — اختار من اقتراحات فريقك أو اكتب بنفسك وابعت.' : 'القائد هو اللي هيختار ويبعت.'}</p>
        <div class="row">
          <input id="bluffIn" class="input big" maxlength="60" placeholder="اكتب حاجة تصدق..." value="${esc(S.draft.bluff ?? (cap ? '' : mine))}" oninput="S.draft.bluff=this.value" onkeydown="if(event.key==='Enter')${cap ? 'sendBluff()' : 'suggestBluff()'}"/>
        </div>
        <div class="row">
          ${cap ? `<button class="btn primary block" onclick="sendBluff()">${ic('check')} ابعت إجابة الفريق</button>` : `<button class="btn olive block" onclick="suggestBluff()">${ic('bulb')} اقترح</button>`}
        </div>
        ${others.length ? `<div class="sugs"><span class="sub">اقتراحات الفريق:</span>${others.map(([pid, txt]) => `<button class="sug" ${cap ? `onclick="S.draft.bluff=this.dataset.t;render()" data-t="${esc(txt)}"` : ''}><b>${esc(nameOf(pid))}:</b> ${esc(txt)}</button>`).join('')}</div>` : ''}
      </div>
      ${statusPills(k.submitted, 'بعت', 'لسه بيكتب')}`}`;
  }
  if (ph === 'review') {
    return `${projector(k.q)}<div class="waiting">${sticker('dallah', 90, 'wobble')}<p>الحكم بيراجع الإجابات<span class="dots"><i></i><i></i><i></i></span></p></div>`;
  }
  if (ph === 'vote') {
    const vs = k.voteSuggest || {};
    const sel = k.myVote || S.pickOpt;
    return `${projector(k.q, '<p class="proj-hint">فين الإجابة الصح؟</p>')}
      ${k.myVote ? `<div class="card done-card">${ic('check')} <div><b>فريقكم اختار:</b><p class="big-txt">${esc((k.options.find((o) => o.id === k.myVote) || {}).text)}</p></div></div>` : `<p class="sub center">${cap ? 'اختار الإجابة اللي شايفها صح وأكد' : 'دوس على الإجابة اللي شايفها صح عشان تقترحها على القائد'}</p>`}
      <div class="opts">
        ${k.options.map((o) => {
          const sugBy = Object.entries(vs).filter(([, id]) => id === o.id).map(([pid]) => v.players.find((p) => p.id === pid)).filter(Boolean);
          return `<button class="opt ${o.mine ? 'mine' : ''} ${sel === o.id ? 'sel' : ''}" ${o.mine || k.myVote ? 'disabled' : ''} onclick="pickOpt('${o.id}')">
            <span class="opt-text">${esc(o.text)}</span>
            ${o.mine ? '<span class="opt-src">إجابتكم</span>' : ''}
            ${sugBy.length ? `<span class="sug-avs">${sugBy.map((p) => avatar(p, 'xxs')).join('')}</span>` : ''}
          </button>`;
        }).join('')}
      </div>
      ${cap && !k.myVote ? `<div class="next-bar"><button class="btn primary lg" ${S.pickOpt ? '' : 'disabled'} onclick="confirmVote()">${ic('check')} أكد الاختيار</button></div>` : ''}
      ${statusPills(k.voted, 'اختار', 'لسه')}`;
  }
  if (ph === 'reveal') {
    return `${projector(k.q.replace(/_{2,}/, '«' + k.truth + '»'))}${revealList(k)}
      <div class="waiting small"><p>مستنيين الحكم للسؤال الجاي<span class="dots"><i></i><i></i><i></i></span></p></div>`;
  }
  return '';
}
function suggestBluff() { const t = (S.draft.bluff || '').trim(); if (!t) return; api('kr_suggest', { text: t }).then((r) => r.ok && toast('اقتراحك وصل للقائد')); }
function sendBluff() { const t = (S.draft.bluff || '').trim(); if (!t) return toast('اكتب الإجابة الأول', 'err'); api('kr_submit_bluff', { text: t }).then((r) => { if (r.ok) S.draft.bluff = ''; }); }
function pickOpt(id) {
  if (me().captain) { S.pickOpt = id; render(); }
  api('kr_vote_suggest', { opt: id });
}
function confirmVote() { if (!S.pickOpt) return; api('kr_vote_submit', { opt: S.pickOpt }).then((r) => { if (r.ok) S.pickOpt = null; }); }

function karakAdmin(k) {
  const v = S.view;
  const ph = v.phase;
  const nameOf = (pid) => (v.players.find((p) => p.id === pid) || {}).name || '';
  const secret = `<div class="secret">${ic('eyeOff')}<div><span>الإجابة الصح (ماتورهاش لحد)</span><b>${esc(k.truth)}</b></div></div>`;
  if (ph === 'write' || ph === 'review') {
    const teamBox = (t) => `
      <div class="src-row team-${t.id}">
        <span class="src-tag">${esc(t.name)}</span>
        <span class="src-txt">${k.teamBluff[t.id] ? esc(k.teamBluff[t.id]) + (k.autoFilled[t.id] ? ' <small>(الـ AI كملها)</small>' : '') : '<em>لسه بيكتبوا...</em>'}</span>
        ${ph === 'review' && k.teamBluff[t.id] && !k.autoFilled[t.id] ? `<button class="btn danger sm" onclick="api('kr_reject',{team:'${t.id}'})">${ic('x')} ارفض</button>` : ''}
        ${Object.keys(k.suggestions[t.id] || {}).length && !k.teamBluff[t.id] ? `<div class="src-sugs">${Object.entries(k.suggestions[t.id]).map(([pid, x]) => `<span>${esc(nameOf(pid))}: ${esc(x)}</span>`).join('')}</div>` : ''}
      </div>`;
    return `${projector(k.q)}${secret}
      <div class="card">
        <h2 class="h2">${ic('whistle')} الإجابات الست <small>${ph === 'write' ? '— الفرق بتكتب دلوقتي' : '— راجع وانشر'}</small></h2>
        <div class="src-row truth"><span class="src-tag">الصح</span><span class="src-txt">${esc(k.truth)}</span></div>
        ${v.teams.map(teamBox).join('')}
        <div class="src-row admin">
          <span class="src-tag">كذبتك</span>
          <input id="admBluff" class="input" maxlength="60" placeholder="اكتب كذبة بإيدك (ولو سبتها الـ AI هيكمل)" value="${esc(S.draft.admBluff ?? k.adminBluff)}" oninput="S.draft.admBluff=this.value" onchange="api('kr_admin_bluff',{text:this.value})"/>
          <button class="btn olive sm" onclick="api('kr_admin_bluff',{text:document.getElementById('admBluff').value}).then(r=>r.ok&&toast('اتحفظت'))">${ic('check')} حفظ</button>
        </div>
        ${k.aiBluffs.map((b, i) => `<div class="src-row ai"><span class="src-tag">AI ${i + 1}</span><span class="src-txt">${esc(b)}</span><button class="icon-btn" title="غيّرها" aria-label="غير كذبة الـ AI" onclick="api('kr_regen_ai',{index:${i}})">${ic('dice')}</button></div>`).join('')}
      </div>
      <div class="next-bar">
        ${ph === 'write' ? `<span class="why">${statusPills(k.submitted, 'بعت', 'بيكتب')}</span>` : ''}
        <button class="btn primary lg" onclick="publish()">${ic('next')} ${ph === 'write' ? 'انشر دلوقتي (الـ AI يكمل الناقص)' : 'انشر الإجابات للاعبين'}</button>
      </div>`;
  }
  if (ph === 'vote') {
    return `${projector(k.q)}${secret}
      <div class="opts admin-opts">
        ${k.options.map((o) => {
          const voted = v.teams.filter((t) => k.votes[t.id] === o.id);
          const sugg = v.teams.map((t) => Object.values(k.voteSuggest[t.id] || {}).filter((x) => x === o.id).length);
          return `<div class="opt ${o.src === 'truth' ? 'truth-hint' : ''}">
            <span class="opt-text">${esc(o.text)}</span><span class="opt-src src-${o.src}">${srcLabel(o.src)}</span>
            <span class="pickers">${voted.map((t) => `<span class="tchip team-${t.id}">${ic('check')} ${esc(t.name)}</span>`).join('')}${sugg.map((n, i) => (n ? `<span class="tchip ghost team-${v.teams[i].id}">${n} اقتراح</span>` : '')).join('')}</span>
          </div>`;
        }).join('')}
      </div>
      <div class="next-bar"><span class="why">${statusPills({ A: !!k.votes.A, B: !!k.votes.B }, 'اختار', 'لسه')}</span><button class="btn primary lg" onclick="api('kr_force_reveal')">${ic('bolt')} اكشف دلوقتي</button></div>`;
  }
  if (ph === 'reveal') {
    const last = v.round + 1 >= v.totalRounds;
    return `${projector(k.q.replace(/_{2,}/, '«' + k.truth + '»'))}${revealList(k)}
      <div class="next-bar"><button class="btn primary lg" onclick="nextRound()">${last ? ic('trophy') + ' النتيجة النهائية' : ic('next') + ' السؤال الجاي'}</button></div>`;
  }
  return '';
}
function publish() {
  const el = document.getElementById('admBluff');
  const txt = el ? el.value.trim() : '';
  const go = () => api('kr_publish').then(() => { S.draft.admBluff = undefined; });
  if (txt) api('kr_admin_bluff', { text: txt }).then((r) => r.ok && go()); else go();
}
function nextRound() { S.pickOpt = null; S.draft = {}; api('next'); }

// ==================================================================
// 7) سحلب
// ==================================================================
function viewSahlab() {
  const v = S.view;
  const sh = v.sh;
  const admin = isAdmin();
  const solved = v.phase === 'solved';
  const blur = solved ? 0 : [16, 12, 8, 5, 2][Math.min(sh.hintIdx, 4)];
  const t = myTeam();
  const values = v.points.sahlab;
  const ladder = `<ol class="ladder">
    ${Array.from({ length: sh.totalHints }).map((_, i) => {
      const open = i <= sh.hintIdx || solved;
      const txt = open ? (sh.hints[i] || (sh.allHints && sh.allHints[i])) : admin && sh.allHints ? sh.allHints[i] : null;
      return `<li class="rung ${open ? 'open' : 'locked'} ${i === sh.hintIdx && !solved ? 'current' : ''}">
        <span class="rung-pts">${values[Math.min(i, values.length - 1)]}</span>
        <span class="rung-txt">${txt ? esc(txt) : `${ic('lock')} تلميح ${i + 1}`}${!open && admin ? ' <small>(مقفول عند اللاعبين)</small>' : ''}</span>
      </li>`;
    }).join('')}
  </ol>`;
  const photo = `<div class="photo-frame"><div class="photo" style="filter:blur(${blur}px)">${sh.photo ? `<img src="${sh.photo}" alt="صورة مموهة"/>` : `<div class="photo-ph">${sticker('latte', 80)}</div>`}</div><span class="photo-tag">${solved ? 'اتكشفت' : `وضوح ${sh.hintIdx + 1}/5`}</span></div>`;
  const frozenPills = `<div class="pills">${v.teams.map((x) => `<span class="status-pill team-${x.id} ${sh.frozen[x.id] ? 'frozen' : sh.pending[x.id] ? 'wait' : 'ok'}">${sh.frozen[x.id] ? ic('snow') + ' متجمد' : sh.pending[x.id] ? ic('clock') + ' مستني الحكم' : ic('check') + ' يقدر يخمن'} · ${esc(x.name)}</span>`).join('')}</div>`;

  let actions = '';
  if (solved) {
    const w = sh.winner ? teamOf(sh.winner) : null;
    actions = `<div class="card solved team-${sh.winner || 'none'}">
      <span class="sub">الإجابة</span><h2 class="h1">${esc(sh.answer)}</h2>
      <p>${w ? `${ic('trophy')} ${esc(w.name)} خمّنها وخد <b>+${sh.wonPts}</b>` : 'محدش خمّنها المرة دي'}</p>
    </div>
    ${admin ? `<div class="next-bar"><button class="btn primary lg" onclick="nextRound()">${v.round + 1 >= v.totalRounds ? ic('trophy') + ' النتيجة النهائية' : ic('next') + ' الجولة الجاية'}</button></div>` : '<div class="waiting small"><p>مستنيين الحكم<span class="dots"><i></i><i></i><i></i></span></p></div>'}`;
  } else if (admin) {
    actions = `<div class="secret">${ic('eyeOff')}<div><span>الإجابة (ماتورهاش لحد)</span><b>${esc(sh.answer)}</b></div></div>
      ${v.teams.map((x) => (sh.pending[x.id] ? `<div class="card judge team-${x.id}"><span>${esc(x.name)} بيقول:</span><b class="big-txt">${esc(sh.pending[x.id])}</b>
        <div class="row"><button class="btn olive" onclick="api('sh_judge',{team:'${x.id}',correct:true})">${ic('check')} صح (+${sh.value})</button><button class="btn danger" onclick="api('sh_judge',{team:'${x.id}',correct:false})">${ic('x')} غلط (تجميد)</button></div></div>` : '')).join('')}
      <div class="next-bar"><button class="btn ghost lg" onclick="api('sh_next_hint')">${ic('skip')} ${sh.hintIdx >= sh.totalHints - 1 ? 'اكشف الإجابة' : 'افتح التلميح الجاي'}</button></div>`;
  } else {
    const frozen = sh.frozen[t];
    actions = sh.myPending ? `<div class="card done-card">${ic('clock')}<div><b>تخمينكم:</b><p class="big-txt">${esc(sh.myPending)}</p><span class="sub">مستنيين حكم الحكم...</span></div></div>`
      : frozen ? `<div class="card frozen-card">${ic('snow')} فريقكم متجمد لحد التلميح الجاي</div>`
      : me().captain ? `<div class="card write-card"><h2 class="h2">${ic('bulb')} تخمين الفريق (+${sh.value})</h2>
          <div class="row"><input id="shGuess" class="input big" maxlength="60" placeholder="إيه هي الإجابة؟" value="${esc(S.draft.sh || '')}" oninput="S.draft.sh=this.value" onkeydown="if(event.key==='Enter')shGuess()"/></div>
          <button class="btn primary block" onclick="shGuess()">${ic('check')} ابعت التخمين</button>
          <p class="note">التخمين الغلط بيجمد فريقكم لحد التلميح الجاي.</p></div>`
      : `<div class="card"><p class="center">${ic('crown')} قول تخمينك لقائد فريقك — هو اللي بيبعت</p></div>`;
  }
  return `${topbar()}<section class="wrap game sahlab">${scorebar()}
    <div class="sahlab-grid">
      <div>${photo}<div class="value-badge">قيمة التلميح الحالي: <b>${sh.value}</b> نقطة</div>${frozenPills}</div>
      <div>${ladder}${actions}</div>
    </div>
    ${sh.guesses.length ? `<div class="card guesses"><h3 class="h3">التخمينات</h3>${sh.guesses.map((g) => `<span class="g ${g.correct ? 'ok' : 'no'} team-${g.team}">${esc(teamOf(g.team).name)}: ${esc(g.text)} ${g.correct ? ic('check') : ic('x')}</span>`).join('')}</div>` : ''}
  </section>`;
}
function shGuess() { const t = (S.draft.sh || '').trim(); if (!t) return; api('sh_guess', { text: t }).then((r) => { if (r.ok) S.draft.sh = ''; }); }

// ==================================================================
// 8) لبن تمر هندي
// ==================================================================
function viewTamr() {
  const v = S.view;
  const tm = v.tm;
  const admin = isAdmin();
  const t = myTeam();
  const solved = v.phase === 'solved';
  const active = tm.golden || tm.turn;
  const clock = (id) => {
    const T = teamOf(id);
    const on = !solved && active === id;
    return `<div class="clock team-${id} ${on ? 'active' : ''} ${tm.clocks[id] <= 30 ? 'low' : ''} ${tm.golden && tm.golden !== id ? 'frozen' : ''}">
      <span class="clock-name">${esc(T.name)}${t === id ? ' (فريقك)' : ''}</span>
      <span class="clock-digits js-clock" data-team="${id}">${mmss(tm.clocks[id])}</span>
      <span class="clock-state">${solved ? '' : tm.golden === id ? 'فرصة ذهبية!' : on ? (v.pausedLeft != null ? 'متوقف' : 'دورهم — الوقت بيعد') : 'مستني'}</span>
    </div>`;
  };
  const charCard = (id, label) => {
    const c = tm.chars[id];
    if (!c) return `<div class="char-card hidden-char">${ic('eyeOff')}<b>شخصيتكم سر!</b><span>اسألوا الفريق التاني أسئلة إجابتها أه أو لأ</span></div>`;
    return `<div class="char-card team-${id}">
      <div class="char-photo">${c.photo ? `<img src="${c.photo}" alt="${esc(c.name)}"/>` : sticker('cup', 70)}</div>
      <span class="sub">${label}</span><b class="char-name">${esc(c.name)}</b><span class="char-brief">${esc(c.brief)}</span>
    </div>`;
  };
  let center = '';
  if (admin) {
    center = `<div class="chars-2">${charCard('A', `${esc(teamOf('A').name)} لازم يخمن`)}${charCard('B', `${esc(teamOf('B').name)} لازم يخمن`)}</div>`;
  } else {
    const o = t === 'A' ? 'B' : 'A';
    center = `<div class="chars-2">${charCard(t, '')}${charCard(o, `شخصية ${esc(teamOf(o).name)} — جاوبوهم بأه أو لأ بس`)}</div>`;
  }
  let actions = '';
  if (solved) {
    const w = tm.winner ? teamOf(tm.winner) : null;
    actions = `<div class="card solved team-${tm.winner || 'none'}"><p>${w ? `${ic('trophy')} ${esc(w.name)} كسب الجولة ${tm.reason === 'timeout' ? '(وقت الخصم خلص)' : 'بالتخمين الصح'} <b>+${tm.wonPts}</b>` : ''}</p></div>
      ${admin ? `<div class="next-bar"><button class="btn primary lg" onclick="nextRound()">${v.round + 1 >= v.totalRounds ? ic('trophy') + ' النتيجة النهائية' : ic('next') + ' الجولة الجاية'}</button></div>` : ''}`;
  } else if (admin) {
    actions = `${tm.golden ? `<div class="golden">${ic('star')} فرصة ذهبية لـ ${esc(teamOf(tm.golden).name)} — الساعات واقفة</div>` : ''}
      ${tm.pending ? `<div class="card judge team-${tm.pending.team}"><span>${esc(teamOf(tm.pending.team).name)} بيخمن:</span><b class="big-txt">${esc(tm.pending.text)}</b>
        <div class="row"><button class="btn olive" onclick="api('tm_judge',{correct:true})">${ic('check')} صح (+${v.points.tamr.guess})</button><button class="btn danger" onclick="api('tm_judge',{correct:false})">${ic('x')} غلط</button></div></div>` : ''}
      <div class="card admin-tools">
        <button class="btn ghost" onclick="api('tm_force_pass')">${ic('swap')} حوّل الدور</button>
        <button class="btn ghost" onclick="api('pause')">${v.pausedLeft != null ? ic('play') + ' كمّل' : ic('pause') + ' وقف الساعة'}</button>
        ${v.teams.map((x) => `<button class="btn danger sm" onclick="api('tm_penalty',{team:'${x.id}'})">-15ث تضليل ${esc(x.name)}</button>`).join('')}
        ${tm.golden ? `<button class="btn ghost sm" onclick="api('tm_end_golden')">إلغاء الفرصة الذهبية</button>` : ''}
      </div>`;
  } else {
    const myTurn = active === t;
    actions = tm.golden ? `<div class="golden">${ic('star')} ${tm.golden === t ? 'فرصتكم الذهبية! خمنوا دلوقتي والساعات واقفة' : `فرصة ذهبية لـ ${esc(teamOf(tm.golden).name)}`}</div>` : '';
    if (tm.pending && tm.pending.team === t) actions += `<div class="card done-card">${ic('clock')}<div><b>تخمينكم:</b><p class="big-txt">${esc(tm.pending.text)}</p><span class="sub">مستنيين الحكم...</span></div></div>`;
    else if (myTurn && me().captain) actions += `<div class="card write-card">
        <h2 class="h2">${ic('bulb')} دوركم — اسألوا وبعدين خمّنوا أو حوّلوا الساعة</h2>
        <div class="row"><input id="tmGuess" class="input big" maxlength="60" placeholder="اسم الشخصية" value="${esc(S.draft.tm || '')}" oninput="S.draft.tm=this.value" onkeydown="if(event.key==='Enter')tmGuess()"/></div>
        <div class="row"><button class="btn primary" onclick="tmGuess()">${ic('check')} نخمن</button>${!tm.golden ? `<button class="btn ghost" onclick="api('tm_pass')">${ic('swap')} خلصنا دورنا</button>` : ''}</div>
      </div>`;
    else if (myTurn) actions += `<div class="card"><p class="center">${ic('crown')} دوركم — اسألوا، والقائد يخمّن أو يحوّل الساعة</p></div>`;
    else actions += `<div class="card"><p class="center">دور ${esc(teamOf(active).name)} — جاوبوا أسئلتهم بأه أو لأ بصراحة!</p></div>`;
  }
  return `${topbar()}<section class="wrap game tamr">${scorebar()}
    <div class="clocks-2">${clock('A')}${clock('B')}</div>
    ${center}${actions}
    ${tm.guesses.length ? `<div class="card guesses"><h3 class="h3">التخمينات</h3>${tm.guesses.map((g) => `<span class="g ${g.correct ? 'ok' : 'no'} team-${g.team}">${esc(teamOf(g.team).name)}: ${esc(g.text)}</span>`).join('')}</div>` : ''}
  </section>`;
}
function tmGuess() { const t = (S.draft.tm || '').trim(); if (!t) return; api('tm_guess', { text: t }).then((r) => { if (r.ok) S.draft.tm = ''; }); }

// ==================================================================
// 9) النهاية
// ==================================================================
function viewFinal() {
  const v = S.view;
  const [a, b] = v.teams;
  const tie = a.score === b.score;
  const win = a.score >= b.score ? a : b;
  const lose = win === a ? b : a;
  const capOf = (t) => v.players.find((p) => p.id === t.captainId);
  return `${topbar()}<section class="wrap narrow final">
    <h1 class="h1 center">${tie ? 'تعادل!' : `${esc(win.name)} كسب السهرة`}</h1>
    <div class="podium">
      <div class="pod second team-${lose.id}">${avatar(capOf(lose), 'md')}<b>${esc(lose.name)}</b><span class="pod-score">${lose.score}</span><div class="pod-block">2</div></div>
      <div class="pod first team-${win.id}">${tie ? '' : `<span class="pod-crown">${ic('crown')}</span>`}${avatar(capOf(win), 'lg')}<b>${esc(win.name)}</b><span class="pod-score">${win.score}</span><div class="pod-block">1</div></div>
    </div>
    <div class="final-teams">${v.teams.map((t) => `<div class="card team-col team-${t.id}"><b>${esc(t.name)}</b><div class="tp-avatars">${playersOf(t.id).map((p) => avatar(p, 'xs')).join('')}</div></div>`).join('')}</div>
    ${isAdmin() ? `<div class="next-bar col">
      <button class="btn primary lg" onclick="api('end_to_lobby')">${ic('users')} العب تاني بنفس الفرق</button>
      <button class="btn ghost" onclick="closeRoom()">${ic('home')} اقفل الغرفة وابدأ من جديد</button>
    </div>` : '<div class="waiting small"><p>الحكم هيقرر الخطوة الجاية<span class="dots"><i></i><i></i><i></i></span></p></div>'}
  </section>`;
}

// ==================================================================
// 10) درج الحكم أثناء اللعب
// ==================================================================
function adminDrawer() {
  const v = S.view;
  return `<button class="fab" onclick="S.drawer=!S.drawer;render()" aria-expanded="${S.drawer}">${ic('whistle')} لوحة الحكم</button>
  ${S.drawer ? `<div class="drawer-backdrop" onclick="S.drawer=false;render()"></div>
  <aside class="drawer" role="dialog" aria-label="لوحة الحكم">
    <div class="drawer-head"><h2 class="h2">${ic('whistle')} لوحة الحكم</h2><button class="icon-btn" aria-label="إغلاق" onclick="S.drawer=false;render()">${ic('x')}</button></div>
    ${v.status === 'playing' ? `<div class="drawer-sec">
      <h3 class="h3">الوقت</h3>
      <button class="btn ${v.pausedLeft != null ? 'primary' : 'ghost'} block" onclick="api('pause')">${v.pausedLeft != null ? ic('play') + ' كمّل اللعب' : ic('pause') + ' إيقاف مؤقت'}</button>
      <p class="note">${ic('lock')} مدة التايمر مقفولة أثناء اللعب.</p>
    </div>` : ''}
    <div class="drawer-sec">
      <h3 class="h3">النقاط</h3>
      ${v.teams.map((t) => `<div class="adj team-${t.id}"><b>${esc(t.name)}</b><span class="adj-score">${t.score}</span>
        <div class="row">${[-10, -5, 5, 10].map((d) => `<button class="btn sm ${d > 0 ? 'olive' : 'danger'}" onclick="api('adjust_score',{team:'${t.id}',delta:${d}})">${d > 0 ? '+' : ''}${d}</button>`).join('')}</div></div>`).join('')}
    </div>
    <div class="drawer-sec">
      <h3 class="h3">اللاعبين</h3>
      ${v.teams.map((t) => `<p class="sub">${esc(t.name)}</p><ul class="members">${playersOf(t.id).map((p) => memberRow(p, true)).join('')}</ul>`).join('')}
    </div>
    <div class="drawer-sec">
      <h3 class="h3">إنهاء</h3>
      <button class="btn ghost block" onclick="if(confirm('تنهي اللعبة وترجع لغرفة الانتظار بنفس الكود واللاعيبة؟'))api('end_to_lobby').then(()=>{S.drawer=false})">${ic('users')} إنهاء والرجوع لغرفة الانتظار</button>
      <button class="btn danger block" onclick="closeRoom()">${ic('home')} اقفل الغرفة وابدأ من جديد</button>
    </div>
  </aside>` : ''}`;
}
async function closeRoom() {
  if (!confirm('تقفل الغرفة؟ كل اللاعيبة هيخرجوا.')) return;
  await api('close_room');
  if (S.es) S.es.close();
  S.es = null; S.view = null; S.drawer = false; S.lastKey = null;
  LS.set('session', null);
  S.mode = 'create'; S.screen = 'setup';
  render();
}

// ==================================================================
// شاشات بسيطة
// ==================================================================
function viewClosed() {
  return `<section class="wrap narrow center-page">${logo('lg')}<div class="card tape"><h1 class="h1">الغرفة اتقفلت</h1><p class="sub">الحكم قفل الغرفة أو الكود مش صحيح.</p><button class="btn primary block" onclick="location.href='/'">${ic('home')} الصفحة الرئيسية</button></div></section>`;
}
function viewKicked() {
  return `<section class="wrap narrow center-page">${logo('lg')}<div class="card tape"><h1 class="h1">الحكم طلّعك من الغرفة</h1><button class="btn primary block" onclick="LS.set('session',null);location.href='/'">${ic('home')} الصفحة الرئيسية</button></div></section>`;
}
function viewLoading() {
  return `<section class="wrap narrow center-page">${logo('lg')}<div class="waiting">${sticker('dallah', 90, 'wobble')}<p>بنحضّر القهوة<span class="dots"><i></i><i></i><i></i></span></p></div></section>`;
}

// كونفيتي بسيط
function confetti() {
  const box = document.createElement('div');
  box.className = 'confetti';
  const colors = ['#C2643C', '#4F7C74', '#E0B15C', '#8B5E3C', '#F3E6D0'];
  for (let i = 0; i < 70; i++) {
    const s = document.createElement('i');
    s.style.left = Math.random() * 100 + '%';
    s.style.background = colors[i % colors.length];
    s.style.animationDelay = Math.random() * 0.8 + 's';
    s.style.transform = `rotate(${Math.random() * 360}deg)`;
    box.appendChild(s);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 4000);
}

// لمبات الزينة
(function bulbs() {
  const el = document.querySelector('.bulbs');
  if (!el) return;
  const n = Math.max(8, Math.round(window.innerWidth / 90));
  el.innerHTML = Array.from({ length: n }).map((_, i) => {
    const x = (i + 0.5) / n;
    const y = 8 + Math.sin(x * Math.PI * 4 + 0.6) * 10 + 14 * Math.sin(x * Math.PI);
    return `<span class="bulb" style="left:${x * 100}%;top:${y}px;animation-delay:${(i % 5) * 0.6}s"></span>`;
  }).join('');
})();

// ==================================================================
// بداية التشغيل
// ==================================================================
(async function boot() {
  const m = location.pathname.match(/^\/room\/([A-Za-z0-9-]+)/);
  const session = LS.get('session', null);
  if (m) {
    const code = m[1].toUpperCase();
    S.mode = 'join';
    S.code = code;
    S.screen = 'loading';
    render();
    const r = await fetch('/api/room-exists?code=' + encodeURIComponent(code)).then((x) => x.json()).catch(() => ({}));
    if (!r.ok) { S.screen = 'closed'; render(); return; }
    if (session && session.code === code && S.profile.name) {
      if (session.role === 'admin') { connect(code); return; }
      const j = await api('join', { profile: S.profile });
      if (j.ok) { connect(code); return; }
    }
    S.screen = 'avatar';
    render();
    return;
  }
  if (session) {
    const r = await fetch('/api/room-exists?code=' + encodeURIComponent(session.code)).then((x) => x.json()).catch(() => ({}));
    if (r.ok) S.resumable = session; else LS.set('session', null);
  }
  render();
})();
