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
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  tv: '<rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/>',
  whistle: '<circle cx="9" cy="14" r="6"/><path d="M13.5 10L22 6v5l-6 2"/><path d="M5 5l2 3"/>',
  chevL: '<path d="M15 18l-6-6 6-6"/>',
  chevR: '<path d="M9 18l6-6-6-6"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  bolt: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
  folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  bot: '<rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>'
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
const ALL_TEAM_IDS = ['A', 'B', 'C', 'D'];
const TEAM_LABELS = { A: 'الفريق أ', B: 'الفريق ب', C: 'الفريق ج', D: 'الفريق د' };
const DEFAULT_TEAM_NAMES = ['فريق الكرك', 'فريق السحلب', 'فريق العنّاب', 'فريق التمر هندي'];

const GAMES = {
  karak: { name: 'كرك', img: '/assets/ui/karak.png', tag: 'لعبة الخداع', desc: 'سؤال غريب بفراغ، كل فريق يكتب إجابة مزيفة تخدع التاني وبعدين الكل يدور على الإجابة الصح وسط 6 إجابات.' },
  sahlab: { name: 'سحلب', img: '/assets/ui/sahlab.png', tag: 'سلم التلميحات', desc: 'صورة مموهة و5 تلميحات بتسهل واحدة ورا التانية. خمّن بدري تاخد نقط أكتر، وكل غلطة بتجمد فريقك.' },
  tamr: { name: 'لبن تمر هندي', img: '/assets/ui/tamr.png', tag: 'ساعة الشطرنج', desc: 'الشخصية السرية — كل فريق عنده شخصية سرية لازم يخمنها بأسئلة أه/لأ، وساعة شطرنج بتعد على الفريق اللي عليه الدور.' },
  annab: { name: 'عنّاب', img: '/assets/ui/annab.png', tag: 'زرار الباز · 4 اختيارات', desc: '20 سؤال بـ 4 اختيارات وزرار باز لقائد كل فريق! اللي يدوس الأول يجاوب، ولو غلط بتتشطب إجابته والفرصة تروح للفريق التاني يختار من الـ 3 الباقيين.' }
};

// كتالوج شامل موحّد في كل الألعاب الأربعة (يشمل الـ 6 كتالوجات الجديدة + كل الكتالوجات السابقة)
const ALL_CATS = [
  ['spacetoon', 'كرتونات سبيستون'],
  ['egyptian_comedy', 'أفلام مصرية كوميدية'],
  ['foreign_movies', 'أفلام أجنبية'],
  ['foreign_series', 'مسلسلات أجنبي'],
  ['foreign_cartoons', 'كرتون أجنبي'],
  ['euro_football', 'كرة القدم الأوروبية'],
  ['anime', 'أنمي'],
  ['islamic_history', 'تاريخ إسلامي'],
  ['islamic', 'أسئلة دينية'],
  ['quran', 'القرآن الكريم'],
  ['hadith', 'الأحاديث النبوية'],
  ['egypt', 'مصر'],
  ['history', 'تاريخ'],
  ['geography', 'جغرافيا'],
  ['places', 'أماكن ومعالم'],
  ['people', 'مشاهير ونجوم'],
  ['cinema', 'أفلام ومسلسلات'],
  ['sports', 'رياضة'],
  ['science', 'علوم'],
  ['food', 'أكل ومشروبات'],
  ['animals', 'حيوانات'],
  ['things', 'أشياء واختراعات'],
  ['weird', 'غرائب الشعوب'],
  ['language', 'لغة وكلمات']
];
const CATS = {
  karak: ALL_CATS,
  sahlab: ALL_CATS,
  tamr: ALL_CATS,
  annab: ALL_CATS
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

const savedSetup = LS.get('setup', null) || {};
const legacyCustom = LS.get('custom', []);
const savedCustomByGame = LS.get('customByGame', null) || {
  karak: Array.isArray(legacyCustom) ? legacyCustom : [],
  sahlab: [],
  tamr: [],
  annab: []
};
const S = {
  screen: 'home',
  mode: null, // create | join
  code: null,
  profile: LS.get('profile', null) || { name: '', outfit: 'karak_cup', face: 'mustache_boss', hat: 'fez_tarboush' },
  avTab: 'outfit',
  setup: {
    game: null,
    playMode: 'teams',
    teamCount: 2,
    teamNames: [...DEFAULT_TEAM_NAMES],
    adminPlays: false,
    adminTeam: 'A',
    categories: [],
    count: 10,
    writeSec: 60,
    voteSec: 30,
    hintSec: 30,
    chessSec: 180,
    buzzSec: 20,
    useCustom: false,
    hideSecret: false,
    ...savedSetup
  },
  customByGame: savedCustomByGame,
  savedPacks: LS.get('savedPacks', []),
  custom: [],
  customInRoom: false,
  view: null,
  offset: 0,
  es: null,
  pollTimer: null,
  drawer: false,
  draft: {},
  pickOpt: null,
  busy: false,
  synced: false,
  lastEventId: null,
  prevScores: null,
  bumps: {},
  lastKey: null,
  resumable: null
};
if (!S.setup.buzzSec) S.setup.buzzSec = 20;
if (S.setup.playMode !== 'solo') S.setup.playMode = 'teams';
if (!S.setup.teamCount || S.setup.teamCount < 2 || S.setup.teamCount > 4) S.setup.teamCount = 2;
if (!Array.isArray(S.setup.teamNames)) S.setup.teamNames = [...DEFAULT_TEAM_NAMES];
while (S.setup.teamNames.length < 4) S.setup.teamNames.push(DEFAULT_TEAM_NAMES[S.setup.teamNames.length]);
S.setup.hideSecret = Boolean(S.setup.hideSecret);
S.setup.adminPlays = Boolean(S.setup.adminPlays);
if (!ALL_TEAM_IDS.slice(0, S.setup.teamCount).includes(S.setup.adminTeam)) S.setup.adminTeam = 'A';

function defaultCustomItem(game) {
  if (game === 'sahlab') return { truth: '', hints: ['', '', '', '', ''], photo: '' };
  if (game === 'tamr') return { truth: '', photo: '' };
  if (game === 'annab') return { q: '', truth: '', bluffs: ['', '', ''] };
  return { q: '', truth: '' };
}
function normalizeCustomItem(it, game) {
  const x = it && typeof it === 'object' ? it : {};
  if (game === 'sahlab') {
    const rawH = Array.isArray(x.hints) ? x.hints : (x.q ? [x.q] : []);
    return {
      truth: String(x.truth || x.answer || ''),
      hints: [0, 1, 2, 3, 4].map((i) => String(rawH[i] ?? '')),
      photo: String(x.photo || '')
    };
  }
  if (game === 'tamr') {
    return {
      truth: String(x.truth || x.name || ''),
      photo: String(x.photo || '')
    };
  }
  if (game === 'annab') {
    const rawB = Array.isArray(x.bluffs) ? x.bluffs : [];
    return {
      q: String(x.q || ''),
      truth: String(x.truth || ''),
      bluffs: [0, 1, 2].map((i) => String(rawB[i] ?? ''))
    };
  }
  return { q: String(x.q || ''), truth: String(x.truth || '') };
}
function isCustomValid(it, game) {
  if (!it || !String(it.truth || '').trim()) return false;
  if (game === 'tamr') return true;
  if (game === 'sahlab') return Array.isArray(it.hints) && it.hints.some((h) => String(h || '').trim());
  return Boolean(String(it.q || '').trim());
}
function curCustomGame() {
  const inRoom = Boolean(S.customInRoom && S.view);
  return (inRoom ? S.view.game : S.setup.game) || 'karak';
}
function customList(game = curCustomGame()) {
  const g = ['karak', 'sahlab', 'tamr', 'annab'].includes(game) ? game : 'karak';
  if (!Array.isArray(S.customByGame[g])) S.customByGame[g] = [];
  S.customByGame[g] = S.customByGame[g].map((it) => normalizeCustomItem(it, g));
  S.custom = S.customByGame[g];
  return S.customByGame[g];
}
function validCustomList(game = curCustomGame()) {
  const g = ['karak', 'sahlab', 'tamr', 'annab'].includes(game) ? game : 'karak';
  return customList(g).filter((it) => isCustomValid(it, g));
}

const NON_BLOCKING_ACTIONS = new Set([
  'adjust_score', 'tm_penalty', 'sh_judge', 'tm_judge', 'sh_toggle_freeze',
  'update_lobby', 'rename_team', 'kr_suggest', 'kr_vote_suggest', 'sh_suggest', 'tm_suggest',
  'toggle_secret', 'an_buzz', 'an_pick', 'an_suggest', 'an_reset_buzz', 'an_pass_turn', 'an_reveal',
  'set_team_count', 'set_play_mode', 'add_test_player', 'admin_join_team', 'admin_become_judge'
]);

// ------------------------------------------------------------------
// الشبكة
// ------------------------------------------------------------------
function applyView(v) {
  if (!v) return;
  if (S.view && v.seq && S.view.seq && v.seq < S.view.seq) return;
  S.offset = (v.now || Date.now()) - Date.now();
  onEvent(v);
  S.view = v;
  if (v.status === 'closed') { closedRoom(); return; }
  render();
}

async function api(action, data = {}) {
  const blocking = !NON_BLOCKING_ACTIONS.has(action);
  if (blocking && S.busy) return { ok: false };
  if (blocking) S.busy = true;
  const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = ctrl ? setTimeout(() => ctrl.abort(), 15000) : null;
  try {
    const r = await fetch('/api/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, code: S.code, pid: ident.pid, secret: ident.secret, ...data }),
      signal: ctrl ? ctrl.signal : undefined
    });
    const j = await r.json();
    if (!j.ok && j.error) toast(j.error, 'err');
    if (j.ok && j.view) applyView(j.view);
    return j;
  } catch (e) {
    toast('الاتصال بالسيرفر اتأخر أو وقع — جرب تاني', 'err');
    return { ok: false };
  } finally {
    if (timer) clearTimeout(timer);
    if (blocking) S.busy = false;
  }
}

function connect(code) {
  if (S.es) S.es.close();
  if (S.pollTimer) clearInterval(S.pollTimer);
  S.code = code;
  S.synced = false;
  S.lastEventId = null;
  const es = new EventSource(`/api/stream?code=${encodeURIComponent(code)}&pid=${ident.pid}&secret=${ident.secret}`);
  S.es = es;
  es.onmessage = (ev) => {
    try { applyView(JSON.parse(ev.data)); } catch (e) {}
  };
  es.onerror = async () => {
    const r = await fetch('/api/room-exists?code=' + encodeURIComponent(code)).then((x) => x.json()).catch(() => null);
    if (r && !r.ok) closedRoom();
  };
  S.pollTimer = setInterval(async () => {
    if (!S.code) return;
    const r = await fetch(`/api/state?code=${encodeURIComponent(S.code)}&pid=${ident.pid}&secret=${ident.secret}`).then((x) => x.json()).catch(() => null);
    if (!r) return;
    if (!r.ok && r.closed) { closedRoom(); return; }
    if (r.ok && r.view && (!S.view || r.view.seq !== S.view.seq)) applyView(r.view);
  }, 1500);
}

function closedRoom() {
  if (S.es) S.es.close();
  if (S.pollTimer) clearInterval(S.pollTimer);
  S.es = null;
  S.pollTimer = null;
  S.view = null;
  S.customInRoom = false;
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
  if (!S.synced) {
    S.synced = true;
    S.lastEventId = e ? e.id : 0;
    return;
  }
  if (!e || e.id === S.lastEventId) return;
  S.lastEventId = e.id;
  const tn = (id) => (v.teams.find((t) => t.id === id) || {}).name || '';
  if (e.type === 'an_wrong_steal' || e.type === 'an_reset' || e.type === 'an_timeout_steal') S.pickOpt = null;
  const msgs = {
    join: () => isHost() && `${e.name} دخل الغرفة`,
    wrong: () => e.bothFrozen ? `كل الفرق اتجمدت! التلميح الجاي بيفتح تلقائياً...` : `${tn(e.team)} جاوب غلط — اتجمد لحد التلميح الجاي!`,
    unfrozen: () => `الحكم فك التجميد عن ${tn(e.team)}`,
    frozen_by_admin: () => `الحكم جمّد ${tn(e.team)}`,
    guess: () => isAdmin() && `${tn(e.team)} بعت تخمين جديد!`,
    golden: () => `فرصة ذهبية لـ ${tn(e.team)}!`,
    rejected: () => `الحكم رفض إجابة ${tn(e.team)} — اكتبوا واحدة تانية`,
    penalty: () => `عقوبة تضليل: -15 ثانية من ${tn(e.team)}`,
    adjust: () => `تعديل نقاط ${tn(e.team)} (${e.delta > 0 ? '+' : ''}${e.delta})`,
    hint: () => 'اتفتح تلميح جديد — التجميد اتفك!',
    turn: () => `الدور على ${tn(e.team)}`,
    game_changed: () => `اتغيرت اللعبة لـ ${GAMES[e.game] ? GAMES[e.game].name : e.game}`,
    team_count: () => `عدد الفرق بقى ${e.teamCount} فرق`,
    admin_play: () => e.adminPlays ? `الحكم انضم لـ ${tn(e.team)} والـ AI مسك التحكيم!` : `الحكم رجع لمنصة التحكيم`,
    buzz: () => `${tn(e.team)} داس الباز الأول! دوره يختار الإجابة`,
    an_correct: () => v.aiJudge ? `${tn(e.team)} جاوب صح! (+10 نقطة تلقائياً)` : `${tn(e.team)} جاوب صح! الحكم يقدر يزوّد النقط براحته`,
    an_wrong_steal: () => `إجابة ${tn(e.wrongTeam)} غلط! الفرصة راحت لـ ${tn(e.nextTeam)} يختار من الاختيارات الباقية`,
    an_both_wrong: () => `كل المحاولات غلط! اتكشفت الإجابة الصح`,
    an_timeout_steal: () => `وقت ${tn(e.wrongTeam)} خلص! الفرصة راحت لـ ${tn(e.nextTeam)}`,
    an_reset: () => `اتفتح الباز من الأول لكل الفرق!`
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
const teamOf = (id) => (S.view ? S.view.teams.find((t) => t.id === id) : null) || { id, name: TEAM_LABELS[id] || 'الفريق أ', score: 0 };
const playersOf = (team) => (S.view ? S.view.players.filter((p) => p.team === team) : []);
const isAdmin = () => Boolean(S.view && S.view.me.role === 'admin');
const isHost = () => Boolean(S.view && (S.view.me.role === 'admin' || S.view.me.isHost));
const me = () => (S.view ? S.view.me : {});
const myTeam = () => me().team;
const blankify = (q) => esc(q).replace(/_{2,}/g, '<span class="blank">؟؟؟</span>');

function secretBar(label, valueHtml) {
  const v = S.view;
  const hidden = Boolean(v && v.settings && v.settings.hideSecret);
  return `<div class="secret ${hidden ? 'is-hidden' : ''}">
    ${ic(hidden ? 'eyeOff' : 'eye')}
    <div class="secret-body">
      <span>${esc(label)}</span>
      <b>${hidden ? '••• مخفية (وضع التلفزيون شغال) •••' : valueHtml}</b>
    </div>
    <button class="btn sm secret-toggle ${hidden ? 'olive' : 'ghost'}" onclick="api('toggle_secret')" title="${hidden ? 'إظهار الإجابات على شاشة الحكم' : 'إخفاء الإجابات من شاشة الحكم (وضع التلفزيون)'}">
      ${ic(hidden ? 'eye' : 'eyeOff')} ${hidden ? 'إظهار الإجابة' : 'إخفاء (تلفزيون)'}
    </button>
  </div>`;
}

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
  if (v.game === 'annab') return s.buzzSec || 20;
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
  const mt = myTeam();
  const host = isHost();
  const cell = (t) => {
    const bump = S.bumps[t.id] && Date.now() - S.bumps[t.id].at < 2500 ? S.bumps[t.id].d : null;
    const cap = v.players.find((p) => p.id === t.captainId);
    return `<div class="score team-${t.id} ${mt === t.id ? 'mine' : ''}">
      ${avatar(cap, 'xs')}
      <div class="score-txt"><span class="score-name">${esc(t.name)}${mt === t.id ? ' <em>(فريقك)</em>' : ''}</span>
      <span class="score-val" data-team-score="${t.id}">${t.score}</span></div>
      ${host ? `<div class="score-qctl" title="تعديل سريع للنقاط">
        <button class="qscore plus" onclick="api('adjust_score',{team:'${t.id}',delta:5})" aria-label="زود 5 نقاط لـ ${esc(t.name)}">+5</button>
        <button class="qscore minus" onclick="api('adjust_score',{team:'${t.id}',delta:-5})" aria-label="نقص 5 نقاط من ${esc(t.name)}">-5</button>
      </div>` : ''}
      ${bump ? `<span class="bump ${bump > 0 ? 'up' : 'down'}">${bump > 0 ? '+' : ''}${bump}</span>` : ''}
    </div>`;
  };
  const midHtml = `<div class="score-mid"><span class="round-pill">${GAMES[v.game].name} · الجولة ${Math.max(1, v.round + 1)} من ${v.totalRounds}${v.aiJudge ? ' · الـ AI بيحكم' : ''}</span>${timerRing()}</div>`;
  if (v.teams.length === 2) {
    const [a, b] = v.teams;
    return `<div class="scorebar">${cell(a)}${midHtml}${cell(b)}</div>`;
  }
  return `<div class="scorebar scorebar-multi teams-count-${v.teams.length}">
    ${midHtml}
    <div class="score-multi-grid">${v.teams.map(cell).join('')}</div>
  </div>`;
}

// ------------------------------------------------------------------
// الرسم العام
// ------------------------------------------------------------------
function screenKey() {
  const v = S.view;
  if (S.customInRoom) return 'customInRoom';
  if (!v) return S.screen;
  if (v.me.role === 'kicked') return 'kicked';
  if (v.status === 'lobby') return isAdmin() ? 'lobbyAdmin' : myTeam() ? 'lobbyPlayer' : 'teamPick';
  if (v.status === 'playing') return !isAdmin() && !myTeam() ? 'teamPick' : `${v.game}:${v.phase}:${v.round}:${v.me.role}`;
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
  if (S.customInRoom) {
    html = viewCustom();
  } else if (!v) {
    html = ({ home: viewHome, avatar: viewAvatar, setup: viewSetup, custom: viewCustom, closed: viewClosed, loading: viewLoading })[S.screen]();
  } else if (key === 'kicked') html = viewKicked();
  else if (v.status === 'lobby') html = isAdmin() ? viewLobbyAdmin() : myTeam() ? viewLobbyPlayer() : viewTeamPick();
  else if (v.status === 'playing') {
    if (!isAdmin() && !myTeam()) html = viewTeamPick();
    else html = v.game === 'karak' ? viewKarak() : v.game === 'sahlab' ? viewSahlab() : v.game === 'annab' ? viewAnnab() : viewTamr();
    if (isHost()) html += adminDrawer();
  } else if (v.status === 'finished') html = viewFinal() + (isHost() ? adminDrawer() : '');

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

function tamrClockSec(teamId) {
  const v = S.view;
  if (!v || !v.tm || !v.tm.clocks) return 0;
  let s = v.tm.clocks[teamId] ?? 0;
  const active = v.tm.golden || v.tm.turn;
  if (v.tm.turnRunning && active === teamId && v.tm.lastTick) {
    const elapsed = Math.max(0, Math.floor(((Date.now() + S.offset) - v.tm.lastTick) / 1000));
    s = Math.max(0, s - elapsed);
  }
  return s;
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
      const sec = tamrClockSec(c.dataset.team);
      c.textContent = mmss(sec);
      const card = c.closest('.clock');
      if (card) card.classList.toggle('low', sec <= 30);
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
      <img src="/assets/ui/karak.png" alt=""/><img src="/assets/ui/sahlab.png" alt=""/><img src="/assets/ui/tamr.png" alt=""/><img src="/assets/ui/annab.png" alt=""/>
    </div>
    <div class="card tape home-card">
      <button class="btn primary block lg" onclick="goCreate()">${ic('whistle')} اعمل غرفة (أنا الحكم أو العب معاهم)</button>
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
      ${['اعمل شخصيتك', 'الحكم يعمل الغرفة (2 لـ 4 فرق) أو يلعب معاهم', 'امسح الـ QR وادخل من موبايلك', 'العبوا والنقط بتتحسب لوحدها'].map((t, i) => `<div class="how"><b>${i + 1}</b><span>${t}</span></div>`).join('')}
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
  const isSolo = s.playMode === 'solo';
  const cats = g ? CATS[g] : [];
  const customOk = g ? validCustomList(g).length : 0;
  const unitLbl = g === 'tamr' ? 'شخصية جاهزة' : 'سؤال جاهز';
  const tc = Math.max(2, Math.min(4, Number(s.teamCount) || 2));
  const activeTeamIds = ALL_TEAM_IDS.slice(0, tc);
  if (!activeTeamIds.includes(s.adminTeam)) s.adminTeam = 'A';
  return `${topbar(stepper(['الشخصية', 'إعداد اللعبة', 'غرفة الانتظار', 'اللعب'], 1))}
  <section class="wrap setup">
    <div class="setup-head">
      <h1 class="h1">إعداد السهرة</h1>
      <p class="sub">اختار اللعبة، حدد نظام اللعب (فرق من 2 لـ 4 فرق · أو وضع فردي لحد 10 لاعبين)، وتقدر كمان تلعب معاهم والـ AI يحكم!</p>
    </div>

    <div class="card">
      <h2 class="h2"><span class="num">1</span> اختار اللعبة</h2>
      <div class="games">
        ${Object.entries(GAMES).map(([k, G]) => `
          <button class="game-card ${g === k ? 'sel' : ''}" onclick="pickGame('${k}')" aria-pressed="${g === k}">
            <div class="game-art"><img src="${G.img}" alt="${esc(G.name)}"/></div>
            <span class="game-tag">${G.tag}</span>
            <b class="game-name">${G.name}</b>
            <span class="game-desc">${G.desc}</span>
            ${g === k ? `<span class="stamp">${ic('check')}</span>` : ''}
          </button>`).join('')}
      </div>
    </div>

    <div class="setup-cols">
      <div class="card">
        <h2 class="h2"><span class="num">2</span> نظام اللعب (فردي ولا فرق) ودورك</h2>
        <div class="field">
          <span>نظام اللعب <small>(اختار بين اللعب في فرق أو اللعب الفردي لحد 10 أشخاص)</small></span>
          <div class="seg play-mode-seg">
            <button type="button" class="${!isSolo ? 'on' : ''}" onclick="setSetupPlayMode('teams')">${ic('users')} نظام الفرق (2 لـ 4 فرق)</button>
            <button type="button" class="${isSolo ? 'on' : ''}" onclick="setSetupPlayMode('solo')">${ic('crown')} وضع فردي — كل واحد لوحده (لحد 10 لاعبين)</button>
          </div>
        </div>
        ${isSolo ? `
          <div class="solo-mode-banner">
            <div class="solo-banner-head">${ic('crown')} <b>وضع اللعب الفردي (لحد 10 أشخاص)</b></div>
            <p class="sub">كل لاعب بيدخل الغرفة بيلعب لوحده باسمه وشخصيته بدون تقسيم فرق (من 2 لحد 10 لاعبين).</p>
            <p class="note">${ic('bulb')} <span>في لعبة <b>كرك</b>: الطبيعي <b>6 إجابات</b> (5 مضللة + 1 صح)، ولو عدد اللاعبين 6 أو أكتر (6، 7، 8، 9، 10 لاعبين) عدد الإجابات المضللة بيزيد تلقائياً على حسب عددهم عشان كذبة كل لاعب تنزل مع الإجابة الصح!</span></p>
          </div>
        ` : `
          <div class="field">
            <span>عدد الفرق <small>(تقدر تزود لحد 4 فرق أو تقلل لفريقين)</small></span>
            <div class="team-count-bar">
              <div class="seg team-count-seg">
                ${[2, 3, 4].map((n) => `<button type="button" class="${tc === n ? 'on' : ''}" onclick="setSetupTeamCount(${n})">${n === 2 ? 'فريقين (2)' : n === 3 ? '3 فرق' : '4 فرق'}</button>`).join('')}
              </div>
              <div class="row">
                <button type="button" class="btn olive sm" ${tc >= 4 ? 'disabled' : ''} onclick="setSetupTeamCount(${tc + 1})" title="زود فريق">${ic('plus')} زود فريق</button>
                <button type="button" class="btn ghost sm" ${tc <= 2 ? 'disabled' : ''} onclick="setSetupTeamCount(${tc - 1})" title="شيل فريق">${ic('x')} شيل فريق</button>
              </div>
            </div>
          </div>
          ${activeTeamIds.map((tid, i) => `
            <label class="field team-name-field team-${tid}"><span>${TEAM_LABELS[tid]}</span>
              <input id="tn${i}" class="input" maxlength="24" value="${esc(s.teamNames[i] || DEFAULT_TEAM_NAMES[i])}" oninput="S.setup.teamNames[${i}]=this.value"/>
            </label>`).join('')}
        `}
        <div class="admin-play-box ${s.adminPlays ? 'on' : ''}">
          <span class="field-lbl">${ic('whistle')} وضع الحكم (إنت):</span>
          <div class="seg">
            <button type="button" class="${!s.adminPlays ? 'on' : ''}" onclick="setSetupAdminPlay(false)">${ic('whistle')} أنا الحكم (أنظم بنفسي)</button>
            <button type="button" class="${s.adminPlays ? 'on' : ''}" onclick="setSetupAdminPlay(true)">${ic('users')} العب معاهم والـ AI يحكم</button>
          </div>
          ${s.adminPlays ? (isSolo ? `
            <div class="admin-team-picker">
              <p class="note">${ic('check')} <span>هتدخل كلاعب فردي ضمن الـ 10 لاعبين، والـ <b>AI</b> هيمسك التحكيم والنقاط بالكامل!</span></p>
            </div>
          ` : `
            <div class="admin-team-picker">
              <span>هتنضم وتلعب مع أنهي فريق؟</span>
              <div class="row wrap-row">
                ${activeTeamIds.map((tid, idx) => `
                  <button type="button" class="btn sm ${s.adminTeam === tid ? 'olive' : 'ghost'} team-pill-${tid}" onclick="setSetupAdminPlay(true,'${tid}')">
                    ${s.adminTeam === tid ? ic('check') : ''} ${esc(s.teamNames[idx] || DEFAULT_TEAM_NAMES[idx])}
                  </button>`).join('')}
              </div>
              <p class="note ${g === 'tamr' ? 'warn' : ''}">
                ${g === 'tamr'
                  ? `${ic('bulb')} <span>في لعبة <b>لبن تمر هندي</b> يفضل وجود حكم بشري لأن الأسئلة شفوية، بس لو لعبت معاهم الـ AI هيصحح التخمينات المكتوبة ويدير الساعات والجولات تلقائياً!</span>`
                  : `${ic('check')} <span>كل تحكم الحكم هيتحول للـ <b>AI تلقائياً</b> (تصحيح، نقاط، ونقل للجولة الجاية) وهتظهرلك شاشة لاعب عادي في فريقك عشان ماتتحرقلكش الإجابات!</span>`}
              </p>
            </div>`) : `<p class="note">${ic('crown')} <span>${isSolo ? 'في الوضع الفردي كل لاعب بيبعت إجابته بنفسه، وتقدر تنضم للعب معاهم في أي وقت من غرفة الانتظار.' : 'بعد ما اللاعبين يدخلوا، إنت اللي بتختار قائد كل فريق وتقدر كمان تنضم لأي فريق من جوه غرفة الانتظار.'}</span></p>`}
        </div>
      </div>

      <div class="card">
        <h2 class="h2"><span class="num">3</span> الأسئلة</h2>
        <div class="seg">
          <button class="${!s.useCustom ? 'on' : ''}" onclick="S.setup.useCustom=false;render()">بنك الأسئلة</button>
          <button class="${s.useCustom ? 'on' : ''}" onclick="S.setup.useCustom=true;render()">أسئلتك الخاصة (كاستم)</button>
        </div>
        ${s.useCustom ? (g ? `
          <div class="custom-sum">
            <div><b>${customOk}</b> ${unitLbl} <small>(${GAMES[g].name})</small></div>
            <button class="btn olive sm" onclick="openCustom()">${ic('pencil')} ${customOk ? 'عدّل أسئلتك / المحفوظات' : 'اكتب أسئلتك أو اختار محفوظ'}</button>
          </div>
          ${S.savedPacks.filter((pk) => pk.game === g).length ? `<div class="saved-mini-note">${ic('folder')} عندك <b>${S.savedPacks.filter((pk) => pk.game === g).length}</b> باكج أسئلة محفوظ لـ ${GAMES[g].name} جاهز للاستعمال!</div>` : ''}
          ` : '<p class="note">اختار اللعبة الأول عشان تفتح صفحة أسئلتها الخاصة.</p>') : `
          ${cats.length ? `<div class="field"><span>الكتالوج الشامل (${cats.length} قسم — لو ماختارتش حاجة هيبقى كوكتيل)</span>
            <div class="chips">${cats.map(([id, l]) => `<button class="chip ${s.categories.includes(id) ? 'on' : ''}" onclick="toggleCat('${id}')">${l}</button>`).join('')}</div></div>` : '<p class="note">اختار اللعبة الأول.</p>'}
          ${g ? `<button class="ai-toggle ${s.ai !== false ? 'on' : ''}" onclick="S.setup.ai=${s.ai === false};render()" aria-pressed="${s.ai !== false}">
            <span class="ai-orb" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="ai-txt"><b>مساعد الأسئلة الذكي (AI)</b><small>${s.ai !== false ? 'شغال — هيجمع أسئلة وصور جديدة من الكتالوج اللي اخترته ويخلطها مع البنك. (القرآن والأحاديث والأسئلة الدينية من البنك الموثّق بس)' : 'مقفول — الأسئلة من البنك بس'}</small></span>
            <span class="switch" aria-hidden="true"><span></span></span>
          </button>` : ''}
          <label class="field"><span>عدد ${g === 'tamr' ? 'الجولات' : 'الأسئلة'}: <b id="countLbl">${s.count}</b></span>
            <input type="range" class="range" min="3" max="30" value="${s.count}" oninput="S.setup.count=+this.value;document.getElementById('countLbl').textContent=this.value"/>
          </label>
          <p class="note">${ic('star')} كل سؤال بيتسأل مرة واحدة بس — عمره ما هيتكرر في أي سهرة جاية.</p>`}
      </div>

      <div class="card">
        <h2 class="h2"><span class="num">4</span> الوقت وشاشة الحكم</h2>
        ${!g ? '<p class="note">اختار اللعبة الأول.</p>' : g === 'karak' ? rangeField('writeSec', 'وقت كتابة الإجابة المزيفة', 20, 180, 5) + rangeField('voteSec', 'وقت الاختيار', 15, 120, 5) : g === 'sahlab' ? rangeField('hintSec', 'وقت كل تلميح', 15, 120, 5) : g === 'annab' ? rangeField('buzzSec', 'وقت الباز والإجابة', 10, 60, 5) : rangeField('chessSec', 'رصيد ساعة الشطرنج لكل فريق', 60, 600, 15)}
        <button class="ai-toggle tv-toggle ${s.hideSecret ? 'on' : ''}" onclick="S.setup.hideSecret=!S.setup.hideSecret;LS.set('setup',S.setup);render()" aria-pressed="${Boolean(s.hideSecret)}">
          <span class="tv-orb" aria-hidden="true">${ic(s.hideSecret ? 'eyeOff' : 'tv')}</span>
          <span class="ai-txt"><b>وضع التلفزيون (إخفاء الإجابات من شاشة الحكم)</b><small>${s.hideSecret ? 'شغال — الإجابات السرية هتكون مخفية من شاشة الحكم وتقدر تظهرها بزرار في أي وقت' : 'مقفول — الإجابات الصح بتظهر للحكم من أول الجولة'}</small></span>
          <span class="switch" aria-hidden="true"><span></span></span>
        </button>
        <p class="note warn">${ic('lock')} الوقت بيتقفل أول ما اللعبة تبدأ — وتقدر تغيّر إخفاء الإجابات في أي وقت من شاشة الحكم.</p>
      </div>
    </div>

    <div class="next-bar"><button class="btn primary lg" onclick="createRoom()">${ic('next')} اعمل الغرفة وابعت الدعوة</button></div>
  </section>`;
}
function setSetupPlayMode(mode) {
  S.setup.playMode = mode === 'solo' ? 'solo' : 'teams';
  LS.set('setup', S.setup);
  render();
}
function setSetupTeamCount(n) {
  const count = Math.max(2, Math.min(4, Number(n) || 2));
  S.setup.playMode = 'teams';
  S.setup.teamCount = count;
  while (S.setup.teamNames.length < 4) S.setup.teamNames.push(DEFAULT_TEAM_NAMES[S.setup.teamNames.length] || 'فريق');
  const active = ALL_TEAM_IDS.slice(0, count);
  if (!active.includes(S.setup.adminTeam)) S.setup.adminTeam = 'A';
  LS.set('setup', S.setup);
  render();
}
function setSetupAdminPlay(plays, team) {
  S.setup.adminPlays = Boolean(plays);
  if (team) S.setup.adminTeam = team;
  LS.set('setup', S.setup);
  render();
}
function fmtSec(x) { return x >= 60 ? `${Math.floor(x / 60)}:${String(x % 60).padStart(2, '0')} دقيقة` : `${x} ثانية`; }
function rangeField(key, label, min, max, step) {
  const val = S.setup[key];
  return `<label class="field"><span>${label}: <b id="lbl_${key}">${fmtSec(val)}</b></span>
    <input type="range" class="range" min="${min}" max="${max}" step="${step}" value="${val}" oninput="S.setup.${key}=+this.value;document.getElementById('lbl_${key}').textContent=fmtSec(+this.value)"/></label>`;
}
function pickGame(k) {
  S.setup.game = k;
  S.setup.categories = [];
  if (k === 'annab') S.setup.count = 20;
  customList(k);
  render();
}
function toggleCat(id) { const c = S.setup.categories; const i = c.indexOf(id); i >= 0 ? c.splice(i, 1) : c.push(id); render(); }
async function createRoom() {
  const s = S.setup;
  if (!s.game) return toast('اختار اللعبة الأول', 'err');
  const custom = validCustomList(s.game);
  if (s.useCustom && !custom.length) return toast('اكتب أسئلة الكاستم الأول', 'err');
  if (s.useCustom && s.game === 'tamr' && custom.length < 2) return toast('تمر هندي محتاج شخصيتين على الأقل في الكاستم', 'err');
  LS.set('setup', s);
  const r = await api('create_room', { game: s.game, settings: s, customPack: custom, profile: S.profile });
  if (r.ok) {
    LS.set('session', { code: r.code, role: 'admin' });
    history.replaceState(null, '', '/');
    connect(r.code);
  }
}

// ==================================================================
// 4) صفحة الأسئلة المخصصة (كاستم — مخصصة لكل لعبة)
// ==================================================================
function annabBluffStatusText(c) {
  const filled = Array.isArray(c.bluffs) ? c.bluffs.filter((b) => String(b || '').trim()).length : 0;
  if (filled === 0) return 'الـ AI هيكمّل الـ 3 اختيارات تلقائياً';
  if (filled === 1) return 'كتبت اختيار · الـ AI هيكمّل 2';
  if (filled === 2) return 'كتبت اختيارين · الـ AI هيكمّل 1';
  return 'كتبت الـ 3 اختيارات بإيدك';
}

function updateCustomMeta(idx) {
  saveCustom();
  const g = curCustomGame();
  const list = customList(g);
  const ok = validCustomList(g).length;
  const pill = document.getElementById('customReadyPill');
  if (pill) pill.textContent = `${ok} / ${list.length} ${g === 'tamr' ? 'شخصية جاهزة' : 'سؤال جاهز'}`;
  if (g === 'annab' && idx !== undefined && list[idx]) {
    const bEl = document.getElementById('annabBluffBadge_' + idx);
    if (bEl) bEl.textContent = annabBluffStatusText(list[idx]);
  }
}

function switchCustomGame(k) {
  const inRoom = Boolean(S.customInRoom && S.view);
  if (inRoom) {
    lobbyPickGame(k);
  } else {
    S.setup.game = k;
    LS.set('setup', S.setup);
  }
  const list = customList(k);
  if (!list.length) presetCustom(k === 'tamr' ? 6 : 5, true, k);
  render();
}

function uploadCustomPhoto(idx, inputEl) {
  const file = inputEl && inputEl.files && inputEl.files[0];
  if (!file) return;
  const g = curCustomGame();
  const list = customList(g);
  if (!list[idx]) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 440;
      let w = img.width || 300;
      let h = img.height || 300;
      if (w > maxDim || h > maxDim) {
        if (w >= h) { h = Math.round((h * maxDim) / w); w = maxDim; }
        else { w = Math.round((w * maxDim) / h); h = maxDim; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFBF2';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      list[idx].photo = dataUrl;
      saveCustom();
      toast('اترفعت الصورة بنجاح');
      render();
    };
    img.onerror = () => toast('ملف الصورة مش مدعوم — جرب صورة تانية', 'err');
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function clearCustomPhoto(idx) {
  const g = curCustomGame();
  const list = customList(g);
  if (!list[idx]) return;
  list[idx].photo = '';
  saveCustom();
  render();
}

function addCustomItem() {
  const g = curCustomGame();
  const list = customList(g);
  list.push(defaultCustomItem(g));
  saveCustom();
  render();
}

function removeCustomItem(idx) {
  const g = curCustomGame();
  const list = customList(g);
  list.splice(idx, 1);
  saveCustom();
  render();
}

function renderCustomPhotoBox(c, i, isTamr) {
  const label = isTamr ? '٢) صورة الشخصية (اختياري)' : 'صورة السؤال (اختياري)';
  const emptyNote = isTamr
    ? 'بدون صورة: هيتكتب اسم الشخصية بس في نص الكارت (مش هنجيب صورة من النت)'
    : 'بدون صورة: هيتكتب الاسم (الإجابة) بس في نص الشاشة من غير أي صورة من النت';
  return `<div class="custom-photo-box ${c.photo ? 'has-photo' : ''}">
    <input type="file" id="cfile_${i}" accept="image/*" style="display:none" onchange="uploadCustomPhoto(${i}, this)"/>
    <div class="custom-photo-head">
      <span class="field-lbl">${ic('image')} ${label}</span>
      <div class="row wrap-row">
        <button type="button" class="btn olive sm" onclick="document.getElementById('cfile_${i}').click()">
          ${ic('upload')} ${c.photo ? 'تغيير الصورة' : (isTamr ? 'ارفع صورة الشخصية (اختياري)' : 'ارفع صورة (اختياري)')}
        </button>
        ${c.photo ? `<button type="button" class="btn danger sm" onclick="clearCustomPhoto(${i})">${ic('trash')} حذف الصورة (${isTamr ? 'الاسم بس' : 'الاسم بس'})</button>` : ''}
      </div>
    </div>
    ${c.photo
      ? `<div class="custom-photo-preview"><img src="${esc(c.photo)}" alt="معاينة الصورة"/><span>${isTamr ? 'صورة الشخصية جاهزة وهتظهر في الكارت' : 'الصورة جاهزة وهتظهر مموهة وتوضح مع التلميحات'}</span></div>`
      : `<div class="custom-no-photo-badge">${ic('check')} <span>${emptyNote}</span></div>`}
  </div>`;
}

function viewCustom() {
  const inRoom = Boolean(S.customInRoom && S.view);
  const g = curCustomGame();
  const list = customList(g);
  const readyCount = validCustomList(g).length;
  const isTamr = g === 'tamr';

  const gameMeta = {
    karak: {
      title: 'أسئلتك الخاصة — لعبة كرك',
      desc: 'اكتب <b>السؤال</b> و<b>الإجابة الصح</b> لكل سؤال، وزوّد أو قلّل عدد الأسئلة براحتك. (لو حطيت <b>____</b> في السؤال هيبان مكانها علامة الفراغ، والـ AI هيكمّل إجابتين مزيفين مع إجابات الفريقين).',
      addLbl: 'أضف سؤال جديد'
    },
    sahlab: {
      title: 'أسئلتك الخاصة — لعبة سحلب',
      desc: 'كل سؤال ليه <b>الإجابة الصح</b> و<b>5 تلميحات تدريجية</b> (التلميح الأول لحد التلميح الخامس) + <b>ميزة رفع صورة (اختياري)</b>. لو مارفعتش صورة، هيبقى مكتوب الإجابة بس في نص الشاشة من غير أي صورة من النت.',
      addLbl: 'أضف سؤال جديد (بـ 5 تلميحات)'
    },
    tamr: {
      title: 'أسئلتك الخاصة — لعبة لبن تمر هندي',
      desc: 'حاجتين بس لكل شخصية: <b>١) اسم الشخصية</b> و<b>٢) صورة الشخصية (اختياري)</b>. لو مفيش صورة، هيتحط اسم الشخصية بس في نص الكارت ومش هنجيب صورة من النت.',
      addLbl: 'أضف شخصية جديدة'
    },
    annab: {
      title: 'أسئلتك الخاصة — لعبة عنّاب',
      desc: 'شبه كرك: اكتب <b>السؤال</b>، وبعدين <b>الإجابة الصح</b>، وبعدين <b>الاختيارات التانية الغلط</b> لو عايز تكتبها بإيدك — أو سيبها فاضية والـ <b>AI</b> هيكتب الاختيارات الباقية تلقائياً.',
      addLbl: 'أضف سؤال جديد'
    }
  }[g];

  const hintMeta = [
    ['التلميح الأول', '100 نقطة — الأصعب'],
    ['التلميح الثاني', '80 نقطة'],
    ['التلميح الثالث', '60 نقطة'],
    ['التلميح الرابع', '40 نقطة'],
    ['التلميح الخامس', '20 نقطة — الأسهل']
  ];

  const cardsHtml = list.map((c, i) => {
    if (g === 'karak') {
      return `<div class="card q-row custom-card custom-karak" data-custom-card="${i}">
        <div class="q-card-head">
          <span class="q-badge">السؤال ${i + 1}</span>
          <button type="button" class="icon-btn danger" aria-label="حذف السؤال" title="حذف السؤال" onclick="removeCustomItem(${i})">${ic('trash')}</button>
        </div>
        <div class="q-fields">
          <label class="field"><span>السؤال</span>
            <textarea id="cq${i}" class="input" rows="2" maxlength="220" oninput="customList('karak')[${i}].q=this.value;updateCustomMeta(${i})" placeholder="مثال: أطول حرب في التاريخ استمرت ____">${esc(c.q)}</textarea>
          </label>
          <label class="field"><span>الإجابة الصح</span>
            <input id="ca${i}" class="input" maxlength="80" value="${esc(c.truth)}" oninput="customList('karak')[${i}].truth=this.value;updateCustomMeta(${i})" placeholder="مثال: 335 سنة"/>
          </label>
        </div>
      </div>`;
    }

    if (g === 'sahlab') {
      return `<div class="card q-row custom-card custom-sahlab" data-custom-card="${i}">
        <div class="q-card-head">
          <span class="q-badge">السؤال ${i + 1} <small>(سؤال واحد و5 تلميحات)</small></span>
          <button type="button" class="icon-btn danger" aria-label="حذف السؤال" title="حذف السؤال" onclick="removeCustomItem(${i})">${ic('trash')}</button>
        </div>
        <div class="q-fields">
          <label class="field"><span>الإجابة الصح <small>(الاسم اللي هيظهر في نص الشاشة)</small></span>
            <input id="ca${i}" class="input big" maxlength="80" value="${esc(c.truth)}" oninput="customList('sahlab')[${i}].truth=this.value;updateCustomMeta(${i})" placeholder="اكتب الإجابة هنا (مثال: برج إيفل، الكشري، محمد صلاح...)"/>
          </label>
          <div class="sahlab-hints-box">
            <span class="field-lbl">${ic('bulb')} التلميحات الخمسة للسؤال رقم ${i + 1}</span>
            <div class="sahlab-hints-grid">
              ${hintMeta.map(([hName, hPts], hIdx) => `
                <label class="field hint-field">
                  <span><b>${hIdx + 1}. ${hName}</b> <small>(${hPts})</small></span>
                  <input id="ch_${i}_${hIdx}" class="input" maxlength="220" value="${esc((c.hints && c.hints[hIdx]) || '')}" oninput="customList('sahlab')[${i}].hints[${hIdx}]=this.value;updateCustomMeta(${i})" placeholder="اكتب ${hName}..."/>
                </label>`).join('')}
            </div>
          </div>
          ${renderCustomPhotoBox(c, i, false)}
        </div>
      </div>`;
    }

    if (g === 'tamr') {
      return `<div class="card q-row custom-card custom-tamr" data-custom-card="${i}">
        <div class="q-card-head">
          <span class="q-badge">الشخصية ${i + 1}</span>
          <button type="button" class="icon-btn danger" aria-label="حذف الشخصية" title="حذف الشخصية" onclick="removeCustomItem(${i})">${ic('trash')}</button>
        </div>
        <div class="q-fields">
          <label class="field"><span>١) اسم الشخصية</span>
            <input id="ca${i}" class="input big" maxlength="80" value="${esc(c.truth)}" oninput="customList('tamr')[${i}].truth=this.value;updateCustomMeta(${i})" placeholder="اكتب اسم الشخصية بس (مثال: عادل إمام، باتمان، أحمد زويل...)"/>
          </label>
          ${renderCustomPhotoBox(c, i, true)}
        </div>
      </div>`;
    }

    // عنّاب (annab)
    return `<div class="card q-row custom-card custom-annab" data-custom-card="${i}">
      <div class="q-card-head">
        <span class="q-badge">السؤال ${i + 1}</span>
        <span class="pill ai-bluff-pill" id="annabBluffBadge_${i}">${annabBluffStatusText(c)}</span>
        <button type="button" class="icon-btn danger" aria-label="حذف السؤال" title="حذف السؤال" onclick="removeCustomItem(${i})">${ic('trash')}</button>
      </div>
      <div class="q-fields">
        <label class="field"><span>السؤال</span>
          <textarea id="cq${i}" class="input" rows="2" maxlength="220" oninput="customList('annab')[${i}].q=this.value;updateCustomMeta(${i})" placeholder="اكتب السؤال هنا...">${esc(c.q)}</textarea>
        </label>
        <label class="field"><span>الإجابة الصح</span>
          <input id="ca${i}" class="input" maxlength="60" value="${esc(c.truth)}" oninput="customList('annab')[${i}].truth=this.value;updateCustomMeta(${i})" placeholder="اكتب الإجابة الصح..."/>
        </label>
        <div class="annab-bluffs-box">
          <div class="annab-bluffs-head">
            <span class="field-lbl">الاختيارات التانية الغلط (اختياري — لو سبت أي خانة فاضية الـ AI هيكتبها تلقائياً)</span>
          </div>
          <div class="annab-bluffs-grid">
            ${[0, 1, 2].map((bIdx) => `
              <label class="field bluff-field">
                <span>الاختيار الغلط ${bIdx + 1} <small>(اختياري)</small></span>
                <input id="cb_${i}_${bIdx}" class="input" maxlength="60" value="${esc((c.bluffs && c.bluffs[bIdx]) || '')}" oninput="customList('annab')[${i}].bluffs[${bIdx}]=this.value;updateCustomMeta(${i})" placeholder="سيبه فاضي لو عايز الـ AI يكتبه"/>
              </label>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  const gamePacks = (S.savedPacks || []).filter((pk) => pk && pk.game === g);
  const savedPacksHtml = `<div class="card saved-packs-card" id="savedPacksBox">
    <div class="saved-packs-head">
      <div>
        <h2 class="h2">${ic('folder')} مكتبة أسئلتك المحفوظة <small>(${GAMES[g].name})</small></h2>
        <p class="sub">كتبت أسئلة كتير وعايز تستعملها بعدين؟ احفظها هنا باسم وهتفضل موجودة دايماً في أي سهرة جاية.</p>
      </div>
      <div class="row wrap-row">
        <input type="file" id="importPackFile" accept=".json,application/json" style="display:none" onchange="importSavedPackFile(this)"/>
        <button type="button" class="btn ghost sm" onclick="document.getElementById('importPackFile').click()">${ic('upload')} استيراد ملف</button>
      </div>
    </div>
    <div class="saved-save-bar">
      <input id="packNameInput" class="input" maxlength="50" placeholder="اكتب اسم لحفظ الأسئلة دي (مثال: سهرة الصحاب، أسئلة كورة، شخصياتنا...)" value="${esc(S.draft.packName || '')}" oninput="S.draft.packName=this.value" onkeydown="if(event.key==='Enter')saveCustomPackNow()"/>
      <button type="button" class="btn primary sm" onclick="saveCustomPackNow()">${ic('save')} احفظ الأسئلة الحالية للمستقبل (${readyCount})</button>
    </div>
    ${gamePacks.length ? `<div class="saved-packs-list">
      ${gamePacks.map((pk) => {
        const cnt = Array.isArray(pk.items) ? pk.items.length : 0;
        const dt = pk.updatedAt ? new Date(pk.updatedAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }) : '';
        return `<div class="saved-pack-item" data-pack-id="${esc(pk.id)}">
          <div class="sp-info">
            <b>${ic('folder')} ${esc(pk.name)}</b>
            <span class="pill">${cnt} ${isTamr ? 'شخصية' : 'سؤال'}</span>
            ${dt ? `<small class="sub">${esc(dt)}</small>` : ''}
          </div>
          <div class="sp-actions">
            <button type="button" class="btn olive sm" onclick="loadSavedPack('${esc(pk.id)}', false)">${ic('check')} استعملهم دلوقتي</button>
            <button type="button" class="btn ghost sm" onclick="loadSavedPack('${esc(pk.id)}', true)" title="إضافة الأسئلة دي فوق الأسئلة المكتوبة حالياً">${ic('plus')} زوّد على الحالي</button>
            <button type="button" class="btn ghost sm" onclick="exportSavedPack('${esc(pk.id)}')" title="تحميل كملف">${ic('download')}</button>
            <button type="button" class="icon-btn danger" onclick="deleteSavedPack('${esc(pk.id)}')" title="حذف الباكج">${ic('trash')}</button>
          </div>
        </div>`;
      }).join('')}
    </div>` : `<p class="note">${ic('star')} لسه مفيش أسئلة محفوظة لـ <b>${GAMES[g].name}</b> — اكتب أسئلتك تحت ودوس <b>«احفظ الأسئلة الحالية للمستقبل»</b> عشان تلاقيها جاهزة في أي وقت!</p>`}
  </div>`;

  return `${topbar(stepper(['الشخصية', 'إعداد اللعبة', 'غرفة الانتظار', 'اللعب'], inRoom ? 2 : 1))}
  <section class="wrap custom">
    <div class="card tape custom-head-card">
      <div class="custom-game-tabs" role="tablist" aria-label="اختيار اللعبة لتعديل أسئلتها الخاصة">
        ${Object.entries(GAMES).map(([k, G]) => `
          <button type="button" role="tab" class="custom-game-tab ${g === k ? 'on' : ''}" onclick="switchCustomGame('${k}')" aria-selected="${g === k}">
            <img src="${G.img}" alt=""/>
            <span>${G.name}</span>
          </button>`).join('')}
      </div>
      <h1 class="h1">${ic('pencil')} ${gameMeta.title}</h1>
      <p class="sub">${gameMeta.desc}</p>
      <div class="row wrap-row">
        <button type="button" class="btn ghost sm" onclick="presetCustom(5)">${isTamr ? '5 شخصيات' : '5 أسئلة'}</button>
        <button type="button" class="btn ghost sm" onclick="presetCustom(10)">${isTamr ? '10 شخصيات' : '10 أسئلة'}</button>
        <button type="button" class="btn ghost sm" onclick="presetCustom(20)">${isTamr ? '20 شخصية' : '20 سؤال'}</button>
        <button type="button" class="btn olive sm" onclick="addCustomItem()">${ic('plus')} ${gameMeta.addLbl}</button>
        <span class="spacer"></span>
        <span class="pill" id="customReadyPill">${readyCount} / ${list.length} ${isTamr ? 'شخصية جاهزة' : 'سؤال جاهز'}</span>
      </div>
    </div>
    ${savedPacksHtml}
    <div class="custom-list">
      ${cardsHtml}
      <button type="button" class="btn olive block lg" onclick="addCustomItem()">${ic('plus')} ${gameMeta.addLbl}</button>
    </div>
    <div class="next-bar">
      ${inRoom ? `<button type="button" class="btn ghost lg" onclick="S.customInRoom=false;render()">رجوع لغرفة الانتظار</button>` : `<button type="button" class="btn ghost lg" onclick="S.screen='setup';render()">رجوع للإعداد</button>`}
      <button type="button" class="btn primary lg" onclick="finishCustom()">${ic('check')} ${inRoom ? 'احفظ في الغرفة وارجع للانتظار' : 'احفظ وكمّل الإعداد'}</button>
    </div>
  </section>`;
}

async function fetchSavedPacksFromServer() {
  try {
    const r = await fetch('/api/custom-packs').then((x) => x.json());
    if (r && r.ok && Array.isArray(r.packs)) {
      const byId = new Map();
      (S.savedPacks || []).forEach((p) => { if (p && p.id) byId.set(p.id, p); });
      r.packs.forEach((p) => { if (p && p.id) byId.set(p.id, p); });
      S.savedPacks = Array.from(byId.values()).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      LS.set('savedCustomPacks', S.savedPacks);
    }
  } catch (e) {}
}

async function saveCustomPackNow() {
  saveCustom();
  const g = curCustomGame();
  const valid = validCustomList(g).map((c) => normalizeCustomItem(c, g));
  if (!valid.length) return toast(g === 'tamr' ? 'اكتب شخصية واحدة على الأقل قبل الحفظ' : 'اكتب سؤال واحد كامل على الأقل قبل الحفظ', 'err');
  const inp = document.getElementById('packNameInput');
  const rawName = (inp ? inp.value : S.draft.packName || '').trim();
  const packName = rawName || `أسئلة ${GAMES[g].name} (${new Date().toLocaleDateString('ar-EG')})`;
  const existingIdx = (S.savedPacks || []).findIndex((p) => p && p.game === g && p.name === packName);
  const entry = {
    id: existingIdx >= 0 ? S.savedPacks[existingIdx].id : 'pk_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
    name: packName,
    game: g,
    items: JSON.parse(JSON.stringify(valid)),
    updatedAt: Date.now()
  };
  if (existingIdx >= 0) S.savedPacks[existingIdx] = entry;
  else S.savedPacks.unshift(entry);
  LS.set('savedCustomPacks', S.savedPacks);
  S.draft.packName = '';
  try {
    await fetch('/api/custom-packs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save', id: entry.id, name: entry.name, game: entry.game, items: entry.items })
    });
  } catch (e) {}
  toast(`اتحفظ «${packName}» (${valid.length} ${g === 'tamr' ? 'شخصية' : 'سؤال'}) للاستعمال في أي وقت!`);
  render();
}

function loadSavedPack(packId, append = false) {
  const g = curCustomGame();
  const pk = (S.savedPacks || []).find((p) => p && p.id === packId);
  if (!pk || !Array.isArray(pk.items)) return toast('الباكج ده مش موجود', 'err');
  const cloned = pk.items.map((c) => normalizeCustomItem(JSON.parse(JSON.stringify(c)), g));
  if (append) {
    const curValid = validCustomList(g).map((c) => normalizeCustomItem(c, g));
    S.customByGame[g] = curValid.concat(cloned);
  } else {
    S.customByGame[g] = cloned;
  }
  S.custom = S.customByGame[g];
  saveCustom();
  toast(append ? `اتضافت أسئلة «${pk.name}» على الأسئلة الحالية!` : `اتحمّلت أسئلة «${pk.name}» (${cloned.length}) جاهزة للعب!`);
  render();
}

async function deleteSavedPack(packId) {
  const pk = (S.savedPacks || []).find((p) => p && p.id === packId);
  if (!pk) return;
  S.savedPacks = (S.savedPacks || []).filter((p) => p && p.id !== packId);
  LS.set('savedCustomPacks', S.savedPacks);
  try {
    await fetch('/api/custom-packs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id: packId })
    });
  } catch (e) {}
  toast(`اتحذف باكج «${pk.name}»`);
  render();
}

function exportSavedPack(packId) {
  const pk = (S.savedPacks || []).find((p) => p && p.id === packId);
  if (!pk) return;
  const blob = new Blob([JSON.stringify(pk, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${pk.name.replace(/[^\w\u0600-\u06FF-]+/g, '_')}_${pk.game}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

function importSavedPackFile(inputEl) {
  const file = inputEl && inputEl.files && inputEl.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const data = JSON.parse(reader.result);
      const g = (data && GAMES[data.game] ? data.game : curCustomGame());
      const rawItems = Array.isArray(data) ? data : Array.isArray(data.items) ? data.items : [];
      const items = rawItems.map((c) => normalizeCustomItem(c, g)).filter((c) => isCustomValid(c, g));
      if (!items.length) return toast('الملف مفيهوش أسئلة صالحة', 'err');
      const name = String(data.name || file.name.replace(/\.json$/i, '') || `باكج مستورد`).slice(0, 50);
      const entry = {
        id: 'pk_' + Date.now().toString(36),
        name,
        game: g,
        items,
        updatedAt: Date.now()
      };
      S.savedPacks.unshift(entry);
      LS.set('savedCustomPacks', S.savedPacks);
      S.customByGame[g] = items.map((c) => normalizeCustomItem(JSON.parse(JSON.stringify(c)), g));
      saveCustom();
      try {
        await fetch('/api/custom-packs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'save', id: entry.id, name: entry.name, game: entry.game, items: entry.items })
        });
      } catch (e) {}
      toast(`اتحفظ واستورد «${name}» (${items.length}) بنجاح!`);
      render();
    } catch (e) {
      toast('ملف JSON مش سليم', 'err');
    }
  };
  reader.readAsText(file);
}

function openCustom() {
  const g = S.setup.game || 'karak';
  if (!S.setup.game) S.setup.game = g;
  if (!customList(g).length) presetCustom(g === 'tamr' ? 6 : 5, true, g);
  S.customInRoom = false;
  S.screen = 'custom';
  fetchSavedPacksFromServer().then(() => render());
  render();
}
function openCustomInLobby() {
  const g = (S.view && S.view.game) || S.setup.game || 'karak';
  if (!customList(g).length) presetCustom(g === 'tamr' ? 6 : 5, true, g);
  S.customInRoom = true;
  fetchSavedPacksFromServer().then(() => render());
  render();
}
async function finishCustom() {
  saveCustom();
  const g = curCustomGame();
  const custom = validCustomList(g);
  if (S.customInRoom && S.view) {
    const tc = S.view.teams ? S.view.teams.length : 2;
    if (!custom.length) return toast(g === 'tamr' ? `اكتب اسم ${tc} شخصيات على الأقل الأول` : 'اكتب سؤال واحد كامل على الأقل الأول', 'err');
    if (g === 'tamr' && custom.length < tc) return toast(`تمر هندي محتاج ${tc} شخصيات على الأقل`, 'err');
    await api('update_lobby', { game: g, settings: { useCustom: true }, customPack: custom });
    S.customInRoom = false;
    toast('اتحفظت الأسئلة الخاصة في الغرفة');
    render();
    return;
  }
  S.setup.useCustom = true;
  S.screen = 'setup';
  render();
}
function presetCustom(n, silent, gameArg) {
  const g = gameArg || curCustomGame();
  const list = customList(g);
  while (list.length < n) list.push(defaultCustomItem(g));
  if (list.length > n) {
    S.customByGame[g] = list.slice(0, n).concat(list.slice(n).filter((c) => isCustomValid(c, g)));
    S.custom = S.customByGame[g];
  }
  saveCustom();
  if (!silent) render();
}
function saveCustom() {
  LS.set('customByGame', S.customByGame);
  LS.set('custom', S.customByGame.karak || []);
}

// ==================================================================
// 5) غرفة الانتظار
// ==================================================================
function memberRow(p, adminCtl) {
  const v = S.view;
  const t = v.teams.find((x) => x.id === p.team);
  const cap = t && t.captainId === p.id;
  const isAdmPlayer = Boolean(p.isAdminPlayer);
  return `<li class="member ${p.online ? '' : 'offline'} ${p.id === me().id ? 'me' : ''}">
    ${avatar(p, 'sm')}
    <span class="m-name">${esc(p.name)}${isAdmPlayer ? ' <small>(الأدمن · لاعب)</small>' : ''}${p.isTest ? ' <small>(تجريبي)</small>' : ''}${p.id === me().id ? ' <small>(إنت)</small>' : ''}</span>
    ${cap ? `<span class="crown" title="القائد">${ic('crown')} القائد</span>` : ''}
    ${adminCtl ? `<span class="m-ctl">
      ${p.team && !cap ? `<button class="icon-btn" title="اعمله قائد" aria-label="اعمله قائد" onclick="api('set_captain',{target:'${p.id}'})">${ic('crown')}</button>` : ''}
      <button class="icon-btn" title="${p.team ? 'انقله للفريق اللي بعده' : 'حطه في فريق'}" aria-label="نقل" onclick="api('move_player',{target:'${p.id}'})">${ic('swap')}</button>
      ${!isAdmPlayer ? `<button class="icon-btn danger" title="اطرده" aria-label="طرد" onclick="kick('${p.id}','${esc(String(p.name).replace(/['"\\]/g, ''))}')">${ic('kick')}</button>` : ''}
    </span>` : ''}
  </li>`;
}
function kick(id, name) { if (confirm(`تطرد ${name} من الغرفة؟`)) api('kick', { target: id }); }

function lobbyRangeField(key, label, min, max, step, val) {
  return `<label class="field"><span>${label}: <b id="llbl_${key}">${fmtSec(val)}</b></span>
    <input type="range" class="range" min="${min}" max="${max}" step="${step}" value="${val}"
      oninput="document.getElementById('llbl_${key}').textContent=fmtSec(+this.value)"
      onchange="lobbySetSetting('${key}',+this.value)"/></label>`;
}

function lobbyPickGame(k) {
  S.setup.game = k;
  S.setup.categories = [];
  const nextSettings = { categories: [] };
  if (k === 'annab') {
    S.setup.count = 20;
    nextSettings.count = 20;
  }
  LS.set('setup', S.setup);
  const custom = validCustomList(k);
  api('update_lobby', { game: k, settings: nextSettings, customPack: custom });
}
function lobbyToggleCat(id) {
  const v = S.view;
  if (!v) return;
  const cur = Array.isArray(v.settings.categories) ? [...v.settings.categories] : [];
  const i = cur.indexOf(id);
  if (i >= 0) cur.splice(i, 1); else cur.push(id);
  S.setup.categories = cur;
  LS.set('setup', S.setup);
  api('update_lobby', { settings: { categories: cur } });
}
function lobbySetSetting(key, val) {
  S.setup[key] = val;
  LS.set('setup', S.setup);
  api('update_lobby', { settings: { [key]: val } });
}
function lobbySetCustom(useCustom) {
  const g = (S.view && S.view.game) || S.setup.game || 'karak';
  const custom = validCustomList(g);
  S.setup.useCustom = useCustom;
  LS.set('setup', S.setup);
  api('update_lobby', { settings: { useCustom }, customPack: custom });
}
function lobbySetPlayMode(mode) {
  const playMode = mode === 'solo' ? 'solo' : 'teams';
  S.setup.playMode = playMode;
  LS.set('setup', S.setup);
  api('set_play_mode', { playMode });
}
function lobbySetTeamCount(count) {
  const n = Math.max(2, Math.min(4, Number(count) || 2));
  S.setup.playMode = 'teams';
  S.setup.teamCount = n;
  LS.set('setup', S.setup);
  api('set_team_count', { count: n });
}

function viewLobbyAdmin() {
  const v = S.view;
  const s = v.settings;
  const g = v.game;
  const isSolo = v.playMode === 'solo' || s.playMode === 'solo';
  const cats = CATS[g] || [];
  const customReady = v.customCount || validCustomList(g).length;
  const unitLbl = g === 'tamr' ? 'شخصية جاهزة' : 'سؤال جاهز';
  const unassigned = isSolo ? [] : v.players.filter((p) => !p.team);
  const empty = isSolo ? [] : v.teams.filter((t) => !playersOf(t.id).length);
  const soloNeedMore = isSolo && v.teams.length < 2;
  const cannotStart = isSolo ? soloNeedMore : empty.length > 0;
  const tc = v.teams.length;
  const timers = v.game === 'karak' ? `كتابة ${s.writeSec}ث · اختيار ${s.voteSec}ث` : v.game === 'sahlab' ? `كل تلميح ${s.hintSec}ث` : v.game === 'annab' ? `الباز والإجابة ${s.buzzSec || 20}ث` : `ساعة ${mmss(s.chessSec)} لكل ${isSolo ? 'لاعب' : 'فريق'}`;
  const catNames = s.useCustom ? `كاستم (${customReady} ${g === 'tamr' ? 'شخصية' : 'سؤال'})` : s.categories.length ? s.categories.map((c) => (cats.find((x) => x[0] === c) || [c, c])[1]).join('، ') : 'كوكتيل';
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
          <div><span>نظام اللعب</span><b>${isSolo ? `فردي (${v.players.length} / 10 لاعبين)` : `فرق (${tc} فرق)`}</b></div>
          <div><span>وضع الأدمن</span><b>${v.adminPlays ? (isSolo ? 'لاعب فردي (حكم AI)' : `لاعب مع ${esc(teamOf(v.adminTeam).name)} (حكم AI)`) : 'حكم بشري'}</b></div>
          <div><span>الأسئلة</span><b>${esc(catNames)}</b></div>
          <div><span>العدد</span><b>${s.useCustom ? customReady : s.count}</b></div>
          <div><span>الوقت</span><b>${timers}</b></div>
          <div><span>اللاعبين</span><b>${v.players.length} / ${(v.caps || {}).room || (isSolo ? 10 : 40)}</b></div>
          <div><span>وضع التلفزيون</span><b>${s.hideSecret ? 'إخفاء الإجابات' : 'إظهار للحكم'}</b></div>
          ${v.ai && v.ai.on ? `<div><span>الـ AI</span><b class="ai-state ${v.ai.status}">${v.ai.status === 'loading' ? '<i class="ai-dot"></i> بيجمع أسئلة جديدة...' : v.ai.status === 'ready' ? `جهّز ${v.ai.ready} سؤال جديد` : v.ai.status === 'verified' ? 'البنك الموثّق' : 'هيكمل من البنك'}</b></div>` : ''}
        </div>
        <p class="note warn">${ic('lock')} تقدر تعدّل اللعبة، نظام اللعب (فردي/فرق)، والأسئلة براحتك قبل ما تدوس ابدأ.</p>
      </aside>

      <div class="lobby-main">
        <div class="judge-card card ${v.adminPlays ? 'admin-playing-mode' : ''}">
          <div class="judge-card-top">
            ${avatar(v.admin, 'md')}
            <div class="judge-card-info">
              <b>${esc(v.admin.name)}</b>
              <span class="sub">${v.adminPlays ? (isSolo ? 'منضم كلاعب فردي — الـ AI هيمسك التحكيم بالكامل وقت اللعب!' : `منضم كلاعب في «${esc(teamOf(v.adminTeam).name)}» — الـ AI هيمسك التحكيم بالكامل وقت اللعب!`) : 'إنت الحكم — أو تقدر تلعب معاهم والـ AI يحكم كل حاجة تلقائياً!'}</span>
            </div>
            <span class="badge">${v.adminPlays ? ic('users') + ' لاعب + حكم AI' : ic('whistle') + ' الحكم'}</span>
          </div>
          <div class="judge-play-actions">
            <span>${v.adminPlays ? 'وضعك الحالي:' : isSolo ? 'عايز تلعب معاهم في الوضع الفردي؟' : 'عايز تلعب معاهم في فريق؟ اختار فريقك:'}</span>
            <div class="row wrap-row">
              ${isSolo ? `
                <button type="button" class="btn sm ${v.adminPlays ? 'olive' : 'ghost'}" onclick="api('admin_join_team',{team:'S1'})">
                  ${v.adminPlays ? ic('check') + ' بتلعب معاهم فردي (حكم AI)' : ic('users') + ' العب معاهم فردي (والـ AI يحكم)'}
                </button>
              ` : v.teams.map((t) => `
                <button type="button" class="btn sm ${v.adminPlays && v.adminTeam === t.id ? 'olive' : 'ghost'} team-pill-${t.id}" onclick="api('admin_join_team',{team:'${t.id}'})">
                  ${v.adminPlays && v.adminTeam === t.id ? ic('check') : ic('users')} العب مع ${esc(t.name)}
                </button>`).join('')}
              ${v.adminPlays ? `<button type="button" class="btn sm primary" onclick="api('admin_become_judge')">${ic('whistle')} ارجع حكم بس (بدون لعب)</button>` : ''}
            </div>
            ${v.adminPlays && g === 'tamr' ? `<p class="note warn" style="margin:6px 0 0">${ic('bulb')} <span>تنبيه: لعبة <b>لبن تمر هندي</b> يفضل فيها حكم بشري عشان الأسئلة الشفوية، بس الـ AI هيدير الساعات ويصحح التخمينات المكتوبة أوتوماتيك!</span></p>` : ''}
          </div>
        </div>

        <div class="card lobby-teams-bar">
          <div class="row wrap-row" style="justify-content:space-between">
            <div>
              <b>${ic(isSolo ? 'crown' : 'users')} نظام اللعب: ${isSolo ? `وضع فردي (${v.players.length} / 10 لاعبين)` : `نظام الفرق (${tc} فرق)`}</b>
              <span class="sub" style="display:block">${isSolo ? 'كل لاعب بيلعب لوحده لحد 10 أشخاص · وفي كرك عدد الإجابات المضللة بيزيد مع عدد اللاعبين (بحد أدنى 6 اختيارات)' : 'تقدر تلعب بنظام الفرق (2 لـ 4 فرق) أو تحوّل للوضع الفردي (لحد 10 لاعبين)'}</span>
            </div>
            <div class="row wrap-row">
              <div class="seg play-mode-seg">
                <button type="button" class="${!isSolo ? 'on' : ''}" onclick="lobbySetPlayMode('teams')">${ic('users')} فرق (2-4)</button>
                <button type="button" class="${isSolo ? 'on' : ''}" onclick="lobbySetPlayMode('solo')">${ic('crown')} فردي (لحد 10)</button>
              </div>
              ${!isSolo ? `
                <div class="seg team-count-seg">
                  ${[2, 3, 4].map((n) => `<button type="button" class="${tc === n ? 'on' : ''}" onclick="lobbySetTeamCount(${n})">${n} فرق</button>`).join('')}
                </div>
                <button type="button" class="btn olive sm" ${tc >= 4 ? 'disabled' : ''} onclick="lobbySetTeamCount(${tc + 1})">${ic('plus')} زود فريق</button>
                <button type="button" class="btn ghost sm" ${tc <= 2 ? 'disabled' : ''} onclick="lobbySetTeamCount(${tc - 1})">${ic('x')} شيل فريق</button>
              ` : ''}
            </div>
          </div>
        </div>

        ${isSolo ? `
          <div class="card solo-lobby-card">
            <div class="team-head">
              <div>
                <h3 class="h3">${ic('crown')} اللاعبين في الوضع الفردي (${v.players.length} / 10 لاعبين)</h3>
                <p class="sub">${g === 'karak' ? `في كرك هيظهر ${Math.max(6, v.teams.length + 1)} اختيارات (${Math.max(5, v.teams.length)} إجابات مضللة + إجابة واحدة صح)` : 'كل لاعب هيلعب لوحده والنقاط هتتحسب لكل لاعب بشكل مستقل'}</p>
              </div>
              <button type="button" class="btn olive sm" ${v.players.length >= 10 ? 'disabled' : ''} onclick="addTest(null)">${ic('plus')} ضيف لاعب تجريبي</button>
            </div>
            ${v.players.length ? `
              <ul class="members solo-members-grid">
                ${v.players.map((p, idx) => `
                  <li class="member solo-member team-${p.team || ('S' + (idx + 1))} ${p.online ? '' : 'offline'} ${p.id === me().id ? 'me' : ''}">
                    <span class="solo-rank">#${idx + 1}</span>
                    ${avatar(p, 'sm')}
                    <span class="m-name">${esc(p.name)}${p.isAdminPlayer ? ' <small>(الأدمن · لاعب)</small>' : ''}${p.isTest ? ' <small>(تجريبي)</small>' : ''}${p.id === me().id ? ' <small>(إنت)</small>' : ''}</span>
                    <span class="crown">${ic('crown')} فردي</span>
                    ${!p.isAdminPlayer ? `<span class="m-ctl"><button class="icon-btn danger" title="اطرده" aria-label="طرد" onclick="kick('${p.id}','${esc(String(p.name).replace(/['"\\]/g, ''))}')">${ic('kick')}</button></span>` : ''}
                  </li>`).join('')}
              </ul>
            ` : `<div class="empty">${sticker('latte', 52)}<span>مستني اللاعبين يدخلوا الغرفة (من 2 لحد 10 لاعبين)...</span></div>`}
          </div>
        ` : `
          <div class="teams-2 teams-grid teams-count-${tc}">
            ${v.teams.map((t, idx) => `
              <div class="card team-col team-${t.id}">
                <div class="team-head">
                  <input id="rn${t.id}" class="input team-title" maxlength="24" value="${esc(S.draft['rn' + t.id] ?? t.name)}" oninput="S.draft['rn${t.id}']=this.value" onchange="api('rename_team',{team:'${t.id}',name:this.value});delete S.draft['rn${t.id}']" aria-label="اسم الفريق"/>
                  <span class="count">${playersOf(t.id).length}/${(v.caps || {}).team || 20} ${ic('users')}</span>
                </div>
                <ul class="members">${playersOf(t.id).map((p) => memberRow(p, true)).join('') || `<li class="empty">${sticker(idx % 2 === 0 ? 'latte' : 'pink', 46)}<span>مستني لاعبين...</span></li>`}</ul>
              </div>`).join('')}
          </div>
          ${unassigned.length ? `<div class="card unassigned"><h3 class="h3">لسه بيختاروا فريق (${unassigned.length})</h3><ul class="members">${unassigned.map((p) => memberRow(p, true)).join('')}</ul></div>` : ''}
        `}

        <div class="card lobby-config" id="lobbyConfig">
          <h2 class="h2">${ic('sliders')} تغيير اللعبة والأسئلة والإعدادات <small>(من غير ما تخرج اللاعبين)</small></h2>
          <div class="field">
            <span>نوع اللعبة الحالية</span>
            <div class="lobby-games">
              ${Object.entries(GAMES).map(([k, G]) => `
                <button class="lobby-game-btn ${g === k ? 'sel' : ''}" onclick="lobbyPickGame('${k}')" aria-pressed="${g === k}">
                  <img src="${G.img}" alt=""/>
                  <div><b>${G.name}</b><small>${G.tag}</small></div>
                  ${g === k ? `<span class="lobby-check">${ic('check')}</span>` : ''}
                </button>`).join('')}
            </div>
          </div>

          <div class="lobby-config-cols">
            <div class="lobby-config-box">
              <h3 class="h3">الأسئلة والكتالوج الشامل</h3>
              <div class="seg">
                <button class="${!s.useCustom ? 'on' : ''}" onclick="lobbySetCustom(false)">بنك الأسئلة</button>
                <button class="${s.useCustom ? 'on' : ''}" onclick="lobbySetCustom(true)">أسئلتك الخاصة (كاستم)</button>
              </div>
              ${s.useCustom ? `
                <div class="custom-sum">
                  <div><b>${customReady}</b> ${unitLbl} <small>(${GAMES[g].name})</small></div>
                  <button class="btn olive sm" onclick="openCustomInLobby()">${ic('pencil')} ${customReady ? 'عدّل أسئلتك / المحفوظات' : 'اكتب أسئلتك أو اختار محفوظ'}</button>
                </div>` : `
                <div class="field">
                  <span>الكتالوج الشامل (${cats.length} قسم — لو ماختارتش حاجة هيبقى كوكتيل)</span>
                  <div class="chips">${cats.map(([id, l]) => `<button class="chip ${s.categories.includes(id) ? 'on' : ''}" onclick="lobbyToggleCat('${id}')">${l}</button>`).join('')}</div>
                </div>
                <button class="ai-toggle ${s.ai !== false ? 'on' : ''}" onclick="lobbySetSetting('ai', ${s.ai === false})" aria-pressed="${s.ai !== false}">
                  <span class="ai-orb" aria-hidden="true"><i></i><i></i><i></i></span>
                  <span class="ai-txt"><b>مساعد الأسئلة الذكي (AI)</b><small>${s.ai !== false ? 'شغال — بيجمع أسئلة جديدة على حسب الكتالوج' : 'مقفول — الأسئلة من البنك بس'}</small></span>
                  <span class="switch" aria-hidden="true"><span></span></span>
                </button>
                <label class="field"><span>عدد ${g === 'tamr' ? 'الجولات' : 'الأسئلة'}: <b id="lcountLbl">${s.count}</b></span>
                  <input type="range" class="range" min="3" max="30" value="${s.count}" oninput="document.getElementById('lcountLbl').textContent=this.value" onchange="lobbySetSetting('count',+this.value)"/>
                </label>`}
            </div>

            <div class="lobby-config-box">
              <h3 class="h3">إعدادات الوقت وشاشة الحكم</h3>
              ${g === 'karak'
                ? lobbyRangeField('writeSec', 'وقت كتابة الإجابة المزيفة', 20, 180, 5, s.writeSec) + lobbyRangeField('voteSec', 'وقت الاختيار', 15, 120, 5, s.voteSec)
                : g === 'sahlab'
                  ? lobbyRangeField('hintSec', 'وقت كل تلميح', 15, 120, 5, s.hintSec)
                  : g === 'annab'
                    ? lobbyRangeField('buzzSec', 'وقت الباز والإجابة', 10, 60, 5, s.buzzSec || 20)
                    : lobbyRangeField('chessSec', 'رصيد ساعة الشطرنج لكل فريق', 60, 600, 15, s.chessSec)}
              <button class="ai-toggle tv-toggle ${s.hideSecret ? 'on' : ''}" onclick="lobbySetSetting('hideSecret', ${!s.hideSecret})" aria-pressed="${Boolean(s.hideSecret)}">
                <span class="tv-orb" aria-hidden="true">${ic(s.hideSecret ? 'eyeOff' : 'tv')}</span>
                <span class="ai-txt"><b>وضع التلفزيون (إخفاء الإجابات من شاشة الحكم)</b><small>${s.hideSecret ? 'شغال — الإجابات مخفية من شاشة الحكم وتقدر تظهرها بزرار جوه اللعبة' : 'مقفول — الإجابات الصح بتظهر للحكم'}</small></span>
                <span class="switch" aria-hidden="true"><span></span></span>
              </button>
            </div>
          </div>
        </div>

        <details class="card tools">
          <summary>${ic('users')} أدوات التجربة السريعة</summary>
          <p class="sub">${isSolo ? 'ضيف لاعبين تجريبيين في الوضع الفردي (لحد 10 لاعبين).' : 'لاعب وهمي للتجربة بس — أو تقدر تملى كل الفرق الفاضية بضغطة واحدة.'}</p>
          <div class="row wrap-row">
            ${isSolo
              ? `<button class="btn ghost sm" ${v.players.length >= 10 ? 'disabled' : ''} onclick="addTest(null)">${ic('plus')} ضيف لاعب فردي تجريبي (${v.players.length}/10)</button>`
              : v.teams.map((t) => `<button class="btn ghost sm" onclick="addTest('${t.id}')">${ic('plus')} لـ ${esc(t.name)}</button>`).join('')}
          </div>
        </details>
      </div>
    </div>
    <div class="next-bar">
      ${isSolo && soloNeedMore ? `<span class="why">${ic('users')} الوضع الفردي محتاج لاعبين اتنين على الأقل (حالياً ${v.teams.length})</span>` : ''}
      ${!isSolo && empty.length ? `<span class="why">${ic('users')} ${esc(empty.map((t) => t.name).join(' و '))} محتاج لاعب على الأقل</span>` : ''}
      <button class="btn primary lg" ${cannotStart ? 'disabled' : ''} onclick="startGame()">${ic('play')} ابدأ ${GAMES[v.game].name}${v.adminPlays ? ' (الـ AI هيحكم)' : ''}</button>
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
  S.busy = false;
  const btn = document.querySelector('.next-bar .btn.primary');
  if (btn) { btn.disabled = true; btn.innerHTML = 'بنجهز الأسئلة...'; }
  const r = await api('start_game');
  if (!r || !r.ok) render();
}

function viewTeamPick() {
  const v = S.view;
  return `${topbar(stepper(['الشخصية', 'الفريق', 'اللعب'], 1))}
  <section class="wrap narrow team-pick">
    <h1 class="h1 center">اختار فريقك (${v.teams.length} فرق)</h1>
    <p class="sub center">${v.adminPlays ? `الأدمن ${esc(v.admin.name)} بيلعب معاكم والـ AI هو الحكم` : `الحكم ${esc(v.admin.name)} هيختار قائد كل فريق`}</p>
    <div class="pick-2 teams-grid teams-count-${v.teams.length}">
      ${v.teams.map((t) => `
        <button class="card team-pick-card team-${t.id}" onclick="api('pick_team',{team:'${t.id}'})">
          <b class="tp-name">${esc(t.name)}</b>
          <div class="tp-avatars">${playersOf(t.id).slice(0, 6).map((p) => avatar(p, 'sm')).join('') || '<span class="sub">لسه فاضي — كن أول واحد</span>'}</div>
          <span class="tp-count">${playersOf(t.id).length} / ${(v.caps || {}).team || 20} لاعب</span>
          <span class="btn primary sm">${playersOf(t.id).length >= ((v.caps || {}).team || 20) ? 'الفريق كامل' : `انضم ${ic('next')}`}</span>
        </button>`).join('')}
    </div>
  </section>`;
}

function viewLobbyPlayer() {
  const v = S.view;
  const isSolo = v.playMode === 'solo' || (v.settings && v.settings.playMode === 'solo');
  const t = teamOf(myTeam());
  const others = v.teams.filter((x) => x.id !== myTeam());
  return `${topbar(stepper(['الشخصية', isSolo ? 'الانتظار' : 'الفريق', 'اللعب'], 1))}
  <section class="wrap narrow lobby-player">
    <div class="card tape team-col team-${t.id}">
      <p class="sub">${isSolo ? 'وضع اللعب الفردي — كل لاعب لوحده' : 'إنت في'}</p>
      <h1 class="h1">${esc(t.name)}</h1>
      ${isSolo ? `<p class="captain-banner">${ic('crown')} إنت بتلعب بشكل فردي ضد باقي اللاعبين (${v.teams.length} / 10 لاعبين)</p>` : me().captain ? `<p class="captain-banner">${ic('crown')} إنت قائد الفريق — إنت اللي هتبعت الإجابات</p>` : ''}
      <ul class="members">${playersOf(t.id).map((p) => memberRow(p, false)).join('')}</ul>
    </div>
    ${others.length ? `<div class="mini-teams-list">
      ${others.map((other) => `<div class="card mini-team team-${other.id}"><b>${esc(other.name)}</b><div class="tp-avatars">${playersOf(other.id).map((p) => avatar(p, 'xs')).join('') || '<span class="sub">فاضي</span>'}</div></div>`).join('')}
    </div>` : ''}
    <div class="waiting">${sticker('teapot', 90, 'wobble')}<p>مستنيين بداية <b>${GAMES[v.game].name}</b>${v.adminPlays ? ' (حكم AI)' : ''}<span class="dots"><i></i><i></i><i></i></span></p></div>
    ${!isSolo ? `<div class="row wrap-row">
      ${others.map((other) => `<button class="btn ghost block" onclick="api('pick_team',{team:'${other.id}'})">${ic('swap')} غيّر لفريق ${esc(other.name)}</button>`).join('')}
    </div>` : ''}
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
  if (src === 'truth') return 'الإجابة الصح';
  if (src === 'admin') return 'كذبة الحكم';
  if (src === 'ai') return 'كذبة الـ AI';
  const t = S.view && S.view.teams ? S.view.teams.find((x) => x.id === src) : null;
  if (t) return `كذبة ${t.name}`;
  if (ALL_TEAM_IDS.includes(src)) return `كذبة ${teamOf(src).name}`;
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
        <h2 class="h2">${ic('pencil')} ${cap ? 'اكتب إجابة مزيفة تخدع بيها الفرق التانية' : 'اقترح كذبة على القائد'}</h2>
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
    const last = v.round + 1 >= v.totalRounds;
    return `${projector(k.q.replace(/_{2,}/, '«' + k.truth + '»'))}${revealList(k)}
      ${isHost() ? `<div class="next-bar"><span class="why">${v.aiJudge ? 'الـ AI هينقل تلقائياً بعد ثواني أو دوس دلوقتي' : ''}</span><button class="btn primary lg" onclick="nextRound()">${last ? ic('trophy') + ' النتيجة النهائية' : ic('next') + ' السؤال الجاي'}</button></div>` : `<div class="waiting small"><p>${v.aiJudge ? 'الـ AI بيفتح السؤال الجاي تلقائياً' : 'مستنيين الحكم للسؤال الجاي'}<span class="dots"><i></i><i></i><i></i></span></p></div>`}`;
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
  const hideSecret = Boolean(v.settings && v.settings.hideSecret);
  const nameOf = (pid) => (v.players.find((p) => p.id === pid) || {}).name || '';
  const secret = secretBar('الإجابة الصح (ماتورهاش لحد)', esc(k.truth));
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
        <h2 class="h2">${ic('whistle')} الإجابات <small>${ph === 'write' ? '— الفرق بتكتب دلوقتي' : '— راجع وانشر'}</small></h2>
        <div class="src-row truth"><span class="src-tag">الصح</span><span class="src-txt">${hideSecret ? '<em>••• مخفية (وضع التلفزيون) •••</em>' : esc(k.truth)}</span></div>
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
    const votedFlags = Object.fromEntries(v.teams.map((t) => [t.id, Boolean(k.votes[t.id])]));
    return `${projector(k.q)}${secret}
      <div class="opts admin-opts">
        ${k.options.map((o) => {
          const voted = v.teams.filter((t) => k.votes[t.id] === o.id);
          const sugg = v.teams.map((t) => Object.values(k.voteSuggest[t.id] || {}).filter((x) => x === o.id).length);
          return `<div class="opt ${!hideSecret && o.src === 'truth' ? 'truth-hint' : ''}">
            <span class="opt-text">${esc(o.text)}</span>${hideSecret ? '' : `<span class="opt-src src-${o.src}">${srcLabel(o.src)}</span>`}
            <span class="pickers">${voted.map((t) => `<span class="tchip team-${t.id}">${ic('check')} ${esc(t.name)}</span>`).join('')}${sugg.map((n, i) => (n ? `<span class="tchip ghost team-${v.teams[i].id}">${n} اقتراح</span>` : '')).join('')}</span>
          </div>`;
        }).join('')}
      </div>
      <div class="next-bar"><span class="why">${statusPills(votedFlags, 'اختار', 'لسه')}</span><button class="btn primary lg" onclick="api('kr_force_reveal')">${ic('bolt')} اكشف دلوقتي</button></div>`;
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
  const hideSecret = Boolean(v.settings && v.settings.hideSecret);
  const blur = solved ? 0 : [16, 12, 8, 5, 2][Math.min(sh.hintIdx, 4)];
  const t = myTeam();
  const values = v.points.sahlab;
  const nameOf = (pid) => (v.players.find((p) => p.id === pid) || {}).name || '';
  const ladder = `<ol class="ladder">
    ${Array.from({ length: sh.totalHints }).map((_, i) => {
      const open = i <= sh.hintIdx || solved;
      const txt = open ? (sh.hints[i] || (sh.allHints && sh.allHints[i])) : admin && !hideSecret && sh.allHints ? sh.allHints[i] : null;
      return `<li class="rung ${open ? 'open' : 'locked'} ${i === sh.hintIdx && !solved ? 'current' : ''}">
        <span class="rung-pts">${values[Math.min(i, values.length - 1)]}</span>
        <span class="rung-txt">${txt ? esc(txt) : `${ic('lock')} تلميح ${i + 1}`}${!open && admin && !hideSecret ? ' <small>(مقفول عند اللاعبين)</small>' : ''}</span>
      </li>`;
    }).join('')}
  </ol>`;
  const hasPhoto = Boolean(sh.photo);
  const photo = hasPhoto
    ? `<div class="photo-frame"><div class="photo" style="filter:blur(${blur}px)"><img src="${esc(sh.photo)}" alt="" onerror="const f=this.closest('.photo-frame');if(f)f.remove();const g=document.querySelector('.sahlab-grid');if(g)g.classList.add('no-photo');"/></div><span class="photo-tag">${solved ? 'اتكشفت الصورة' : `وضوح الصورة ${sh.hintIdx + 1}/5`}</span></div>`
    : '';
  const noPhotoCenterBox = !hasPhoto && admin && !solved
    ? `<div class="card sahlab-name-center ${hideSecret ? 'is-hidden' : ''}">
        <span class="sub">الإجابة المطلوبة (سؤال بدون صورة)</span>
        <b class="sahlab-center-ans">${hideSecret ? '••• مخفية (وضع التلفزيون) •••' : esc(sh.answer)}</b>
      </div>`
    : '';
  const frozenPills = `<div class="pills">${v.teams.map((x) => {
    const isFrz = Boolean(sh.frozen[x.id]);
    const isPend = Boolean(sh.pending[x.id]);
    return `<span class="status-pill team-${x.id} ${isFrz ? 'frozen' : isPend ? 'wait' : 'ok'}">
      ${isFrz ? ic('snow') + ' متجمد' : isPend ? ic('clock') + ' مستني الحكم' : ic('check') + ' يقدر يخمن'} · ${esc(x.name)}
      ${admin && !solved ? `<button class="pill-btn" onclick="api('sh_toggle_freeze',{team:'${x.id}'})" title="${isFrz ? 'فك التجميد' : 'تجميد الفريق'}">${isFrz ? 'فك' : 'تجميد'}</button>` : ''}
    </span>`;
  }).join('')}</div>`;
  const allFrozen = !solved && v.teams.every((x) => Boolean(sh.frozen[x.id]));
  const bothFrozenBanner = allFrozen
    ? `<div class="card frozen-card both-frozen">${ic('snow')}<div><b>كل الفرق اتجمدت!</b><p class="sub">التلميح الجاي بيفتح تلقائياً دلوقتي وهيفك التجميد عن الكل...</p></div></div>`
    : '';

  let actions = '';
  if (solved) {
    const w = sh.winner ? teamOf(sh.winner) : null;
    actions = `<div class="card solved team-${sh.winner || 'none'}">
      <span class="sub">الإجابة</span><h2 class="h1">${esc(sh.answer)}</h2>
      <p>${w ? `${ic('trophy')} ${esc(w.name)} خمّنها وخد <b>+${sh.wonPts}</b>` : 'محدش خمّنها المرة دي'}</p>
    </div>
    ${isHost() ? `<div class="next-bar"><span class="why">${v.aiJudge ? 'الـ AI هينقل للجولة الجاية تلقائياً أو دوس دلوقتي' : ''}</span><button class="btn primary lg" onclick="nextRound()">${v.round + 1 >= v.totalRounds ? ic('trophy') + ' النتيجة النهائية' : ic('next') + ' الجولة الجاية'}</button></div>` : `<div class="waiting small"><p>${v.aiJudge ? 'الـ AI بيجهز الجولة الجاية تلقائياً' : 'مستنيين الحكم'}<span class="dots"><i></i><i></i><i></i></span></p></div>`}`;
  } else if (admin) {
    const teamSugs = v.teams.map((x) => {
      const entries = Object.entries((sh.suggestions && sh.suggestions[x.id]) || {});
      return entries.length && !sh.pending[x.id] ? `<div class="card sub-sugs team-${x.id}"><span class="sub">اقتراحات ${esc(x.name)}:</span> <div class="sugs">${entries.map(([pid, txt]) => `<span class="sug"><b>${esc(nameOf(pid))}:</b> ${esc(txt)}</span>`).join('')}</div></div>` : '';
    }).join('');
    actions = `${secretBar('الإجابة (ماتورهاش لحد)', esc(sh.answer))}
      ${bothFrozenBanner}
      ${v.teams.map((x) => (sh.pending[x.id] ? `<div class="card judge team-${x.id}"><span>${esc(x.name)} بيقول:</span><b class="big-txt">${esc(sh.pending[x.id])}</b>
        <div class="row"><button class="btn olive" onclick="api('sh_judge',{team:'${x.id}',correct:true})">${ic('check')} صح (+${sh.value})</button><button class="btn danger" onclick="api('sh_judge',{team:'${x.id}',correct:false})">${ic('x')} غلط (تجميد الفريق)</button></div></div>` : '')).join('')}
      ${teamSugs}
      <div class="next-bar"><button class="btn ghost lg" onclick="api('sh_next_hint')">${ic('skip')} ${sh.hintIdx >= sh.totalHints - 1 ? 'اكشف الإجابة' : 'افتح التلميح الجاي'}</button></div>`;
  } else {
    const frozen = Boolean(sh.frozen[t]);
    const sug = sh.suggestions || {};
    const mine = sug[me().id] || '';
    const others = Object.entries(sug);
    actions = `${bothFrozenBanner}` + (
      sh.myPending ? `<div class="card done-card">${ic('clock')}<div><b>تخمين فريقكم اتبعت:</b><p class="big-txt">${esc(sh.myPending)}</p><span class="sub">${v.aiJudge ? 'الـ AI بيصحح الإجابة...' : 'مستنيين حكم الحكم...'}</span></div></div>`
      : frozen ? `<div class="card frozen-card">${ic('snow')}<div><b>فريقكم متجمد في التلميح ده!</b><p class="sub">جاوبتوا غلط على التلميح رقم ${sh.hintIdx + 1} — التجميد هيتفك أول ما يفتح التلميح الجاي.</p></div></div>`
      : me().captain ? `<div class="card write-card"><h2 class="h2">${ic('bulb')} تخمين الفريق (+${sh.value})</h2>
          <div class="row"><input id="shGuess" class="input big" maxlength="60" placeholder="إيه هي الإجابة؟" value="${esc(S.draft.sh ?? '')}" oninput="S.draft.sh=this.value" onkeydown="if(event.key==='Enter')shGuess()"/></div>
          <button class="btn primary block" onclick="shGuess()">${ic('check')} ابعت التخمين</button>
          ${others.length ? `<div class="sugs"><span class="sub">اقتراحات فريقك (دوس لاختيارها):</span>${others.map(([pid, txt]) => `<button class="sug" onclick="S.draft.sh=this.dataset.t;render()" data-t="${esc(txt)}"><b>${esc(nameOf(pid))}:</b> ${esc(txt)}</button>`).join('')}</div>` : ''}
          <p class="note">التخمين الغلط بيجمد فريقكم لحد التلميح الجاي.</p></div>`
      : `<div class="card write-card">
          <h2 class="h2">${ic('bulb')} اقترح الإجابة على قائد فريقك</h2>
          <div class="row"><input id="shSugIn" class="input big" maxlength="60" placeholder="اكتب تخمينك للقائد..." value="${esc(S.draft.shSug ?? mine)}" oninput="S.draft.shSug=this.value" onkeydown="if(event.key==='Enter')shSuggest()"/></div>
          <button class="btn olive block" onclick="shSuggest()">${ic('bulb')} ابعت اقتراحك للقائد</button>
          ${others.length ? `<div class="sugs"><span class="sub">اقتراحات الفريق:</span>${others.map(([pid, txt]) => `<span class="sug"><b>${esc(nameOf(pid))}:</b> ${esc(txt)}</span>`).join('')}</div>` : ''}
        </div>`
    );
  }
  return `${topbar()}<section class="wrap game sahlab">${scorebar()}
    <div class="sahlab-grid ${hasPhoto ? '' : 'no-photo'}">
      ${hasPhoto ? `<div>${photo}<div class="value-badge">قيمة التلميح الحالي: <b>${sh.value}</b> نقطة</div>${frozenPills}</div>` : ''}
      <div>
        ${!hasPhoto ? `${noPhotoCenterBox}<div class="value-badge">قيمة التلميح الحالي: <b>${sh.value}</b> نقطة</div>${frozenPills}` : ''}
        ${ladder}${actions}
      </div>
    </div>
    ${sh.guesses.length ? `<div class="card guesses"><h3 class="h3">التخمينات السابقة</h3>${sh.guesses.map((g) => `<span class="g ${g.correct ? 'ok' : 'no'} team-${g.team}">${esc(teamOf(g.team).name)}: ${esc(g.text)} ${g.correct ? ic('check') : ic('x')}</span>`).join('')}</div>` : ''}
  </section>`;
}
function shGuess() { const t = (S.draft.sh || '').trim(); if (!t) return toast('اكتب التخمين الأول', 'err'); api('sh_guess', { text: t }).then((r) => { if (r.ok) S.draft.sh = ''; }); }
function shSuggest() { const t = (S.draft.shSug || '').trim(); if (!t) return; api('sh_suggest', { text: t }).then((r) => r.ok && toast('اقتراحك وصل للقائد')); }

// ==================================================================
// 8) لبن تمر هندي
// ==================================================================
function viewTamr() {
  const v = S.view;
  const tm = v.tm;
  const admin = isAdmin();
  const t = myTeam();
  const solved = v.phase === 'solved';
  const hideSecret = Boolean(v.settings && v.settings.hideSecret);
  const active = tm.golden || tm.turn;
  const nameOf = (pid) => (v.players.find((p) => p.id === pid) || {}).name || '';
  const clock = (id) => {
    const T = teamOf(id);
    const on = !solved && active === id;
    const sec = tamrClockSec(id);
    return `<div class="clock team-${id} ${on ? 'active' : ''} ${sec <= 30 ? 'low' : ''} ${tm.golden && tm.golden !== id ? 'frozen' : ''}">
      <span class="clock-name">${esc(T.name)}${t === id ? ' (فريقك)' : ''}</span>
      <span class="clock-digits js-clock" data-team="${id}">${mmss(sec)}</span>
      <span class="clock-state">${solved ? '' : tm.golden === id ? 'فرصة ذهبية!' : on ? (v.pausedLeft != null ? 'متوقف' : 'دورهم — الوقت بيعد') : 'مستني'}</span>
    </div>`;
  };
  const charCard = (id, label) => {
    const c = tm.chars[id];
    if (admin && !solved && hideSecret) {
      return `<div class="char-card hidden-char team-${id}">${ic('eyeOff')}<b>شخصية ${esc(teamOf(id).name)} مخفية</b><span>وضع التلفزيون شغال — هتظهر أول ما الجولة تتحل أو لو دست إظهار فوق</span></div>`;
    }
    if (!c) return `<div class="char-card hidden-char">${ic('eyeOff')}<b>شخصيتكم سر!</b><span>اسألوا الفرق التانية أسئلة إجابتها أه أو لأ</span></div>`;
    const photoHtml = c.photo ? `<div class="char-photo"><img src="${esc(c.photo)}" alt="" onerror="this.parentElement.remove()"/></div>` : '';
    const briefHtml = c.brief ? `<span class="char-brief">${esc(c.brief)}</span>` : '';
    return `<div class="char-card team-${id} ${c.photo ? '' : 'name-only'}">
      ${photoHtml}
      ${label ? `<span class="sub">${label}</span>` : ''}
      <b class="char-name">${esc(c.name)}</b>
      ${briefHtml}
    </div>`;
  };
  let center = '';
  if (admin) {
    const secretSummary = v.teams.map((x) => `${esc(x.name)}: ${esc((tm.chars[x.id] || {}).name || '')}`).join(' · ');
    center = `${!solved ? secretBar('الشخصيات السرية للفرق', secretSummary) : ''}<div class="chars-2 teams-count-${v.teams.length}">${v.teams.map((x) => charCard(x.id, `${esc(x.name)} لازم يخمن`)).join('')}</div>`;
  } else {
    const others = v.teams.filter((x) => x.id !== t);
    center = `<div class="chars-2 teams-count-${v.teams.length}">${charCard(t, '')}${others.map((o) => charCard(o.id, `شخصية ${esc(o.name)} — جاوبوهم بأه أو لأ بس`)).join('')}</div>`;
  }
  let actions = '';
  if (solved) {
    const w = tm.winner ? teamOf(tm.winner) : null;
    actions = `<div class="card solved team-${tm.winner || 'none'}"><p>${w ? `${ic('trophy')} ${esc(w.name)} كسب الجولة ${tm.reason === 'timeout' ? '(وقت الخصم خلص)' : 'بالتخمين الصح'} <b>+${tm.wonPts}</b>` : ''}</p></div>
      ${isHost() ? `<div class="next-bar"><button class="btn primary lg" onclick="nextRound()">${v.round + 1 >= v.totalRounds ? ic('trophy') + ' النتيجة النهائية' : ic('next') + ' الجولة الجاية'}</button></div>` : ''}`;
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
    const sug = tm.suggestions || {};
    const mine = sug[me().id] || '';
    const others = Object.entries(sug);
    actions = tm.golden ? `<div class="golden">${ic('star')} ${tm.golden === t ? 'فرصتكم الذهبية! خمنوا دلوقتي والساعات واقفة' : `فرصة ذهبية لـ ${esc(teamOf(tm.golden).name)}`}</div>` : '';
    if (tm.pending && tm.pending.team === t) actions += `<div class="card done-card">${ic('clock')}<div><b>تخمينكم:</b><p class="big-txt">${esc(tm.pending.text)}</p><span class="sub">${v.aiJudge ? 'الـ AI بيصحح...' : 'مستنيين الحكم...'}</span></div></div>`;
    else if (myTurn && me().captain) actions += `<div class="card write-card">
        <h2 class="h2">${ic('bulb')} دوركم — اسألوا وبعدين خمّنوا أو حوّلوا الساعة</h2>
        <div class="row"><input id="tmGuess" class="input big" maxlength="60" placeholder="اسم الشخصية" value="${esc(S.draft.tm ?? '')}" oninput="S.draft.tm=this.value" onkeydown="if(event.key==='Enter')tmGuess()"/></div>
        <div class="row"><button class="btn primary" onclick="tmGuess()">${ic('check')} نخمن</button>${!tm.golden ? `<button class="btn ghost" onclick="api('tm_pass')">${ic('swap')} خلصنا دورنا</button>` : ''}</div>
        ${others.length ? `<div class="sugs"><span class="sub">اقتراحات فريقك (دوس لاختيارها):</span>${others.map(([pid, txt]) => `<button class="sug" onclick="S.draft.tm=this.dataset.t;render()" data-t="${esc(txt)}"><b>${esc(nameOf(pid))}:</b> ${esc(txt)}</button>`).join('')}</div>` : ''}
      </div>`;
    else if (myTurn) actions += `<div class="card write-card">
        <h2 class="h2">${ic('crown')} دوركم — اسألوا واقترحوا اسم الشخصية على القائد</h2>
        <div class="row"><input id="tmSugIn" class="input big" maxlength="60" placeholder="اقترح اسم الشخصية للقائد..." value="${esc(S.draft.tmSug ?? mine)}" oninput="S.draft.tmSug=this.value" onkeydown="if(event.key==='Enter')tmSuggest()"/></div>
        <button class="btn olive block" onclick="tmSuggest()">${ic('bulb')} اقترح على القائد</button>
        ${others.length ? `<div class="sugs"><span class="sub">اقتراحات الفريق:</span>${others.map(([pid, txt]) => `<span class="sug"><b>${esc(nameOf(pid))}:</b> ${esc(txt)}</span>`).join('')}</div>` : ''}
      </div>`;
    else actions += `<div class="card"><p class="center">دور ${esc(teamOf(active).name)} — جاوبوا أسئلتهم بأه أو لأ بصراحة!</p></div>`;
  }
  return `${topbar()}<section class="wrap game tamr">${scorebar()}
    <div class="clocks-2 teams-count-${v.teams.length}">${v.teams.map((x) => clock(x.id)).join('')}</div>
    ${center}${actions}
    ${tm.guesses.length ? `<div class="card guesses"><h3 class="h3">التخمينات</h3>${tm.guesses.map((g) => `<span class="g ${g.correct ? 'ok' : 'no'} team-${g.team}">${esc(teamOf(g.team).name)}: ${esc(g.text)}</span>`).join('')}</div>` : ''}
  </section>`;
}
function tmGuess() { const t = (S.draft.tm || '').trim(); if (!t) return toast('اكتب اسم الشخصية الأول', 'err'); api('tm_guess', { text: t }).then((r) => { if (r.ok) S.draft.tm = ''; }); }
function tmSuggest() { const t = (S.draft.tmSug || '').trim(); if (!t) return; api('sh_suggest' in window ? 'tm_suggest' : 'tm_suggest', { text: t }).then((r) => r.ok && toast('اقتراحك وصل للقائد')); }

// ==================================================================
// 8.5) عنّاب (زرار الباز و 4 اختيارات)
// ==================================================================
function viewAnnab() {
  const v = S.view;
  const an = v.an;
  const admin = isAdmin();
  const t = myTeam();
  const cap = me().captain;
  const solved = v.phase === 'solved';
  const hideSecret = Boolean(v.settings && v.settings.hideSecret);
  const elim = an.eliminated || [];
  const picks = an.picks || [];
  const remOptsCount = Math.max(1, 4 - elim.length);

  // شريط حالة الدور / الباز
  let banner = '';
  if (!solved) {
    if (an.subPhase === 'buzz') {
      banner = `<div class="card annab-banner buzz-open">${ic('bell')}<div><b>الباز مفتوح لكل الفرق!</b><p class="sub">قائد الفريق اللي يدوس على زرار الباز الأول هو اللي يجاوب.</p></div></div>`;
    } else if (an.subPhase === 'answer') {
      banner = `<div class="card annab-banner team-${an.buzzedTeam}">${ic('bolt')}<div><b>${esc(teamOf(an.buzzedTeam).name)} داس الباز الأول!</b><p class="sub">الباز اتقفل على باقي الفرق — قائد ${esc(teamOf(an.buzzedTeam).name)} بيختار من الـ 4 اختيارات دلوقتي.</p></div></div>`;
    } else if (an.subPhase === 'steal') {
      const wrongT = an.firstWrongTeam || (an.buzzedTeam === 'A' ? 'B' : 'A');
      banner = `<div class="card annab-banner steal-banner team-${an.buzzedTeam}">${ic('x')}<div><b>الإجابة غلط من ${esc(teamOf(wrongT).name)}!</b><p class="sub">الإجابة الصح لسه ماتكشفتش — الفرصة دلوقتي لـ <b>${esc(teamOf(an.buzzedTeam).name)}</b> يختار من الـ ${remOptsCount} اختيارات الباقيين!</p></div></div>`;
    }
  } else {
    const w = an.winner ? teamOf(an.winner) : null;
    banner = `<div class="card solved team-${an.winner || 'none'}">
      <span class="sub">الإجابة الصح</span><h2 class="h1">${esc(an.truth)}</h2>
      <p>${w ? `${ic('trophy')} <b>${esc(w.name)}</b> جاوبها صح ${an.attempt > 1 ? '(في فرصة التكملة!)' : '(من أول باز!)'} ${v.aiJudge ? '— الـ AI زوّد +10 نقط تلقائياً' : '— الحكم يحدد النقط'}` : 'محدش جاب الإجابة الصح المرة دي'}</p>
    </div>`;
  }

  // شبكة الاختيارات الأربعة
  const canCaptainPick = !admin && !solved && cap && (an.subPhase === 'answer' || an.subPhase === 'steal') && an.buzzedTeam === t;
  const canSuggest = !admin && !solved && !cap;
  const letters = ['أ', 'ب', 'ج', 'د'];
  const optsHtml = `<div class="opts annab-opts ${admin ? 'admin-opts' : ''}">
    ${an.options.map((o, idx) => {
      const isElim = elim.includes(o.id);
      const isTruth = o.id === an.correctId;
      const showTruthAdmin = admin && !solved && !hideSecret && isTruth;
      const showTruthSolved = solved && isTruth;
      const pickedBy = picks.find((pk) => pk.optId === o.id);
      const isSel = canCaptainPick && S.pickOpt === o.id && !isElim;

      // اقتراحات اللاعبين
      let sugHtml = '';
      if (admin) {
        const counts = v.teams.map((tm) => Object.values((an.suggestions && an.suggestions[tm.id]) || {}).filter((x) => x === o.id).length);
        sugHtml = counts.map((n, i) => (n ? `<span class="tchip ghost team-${v.teams[i].id}">${n} اقتراح</span>` : '')).join('');
      } else {
        const vs = an.suggestions || {};
        const sugBy = Object.entries(vs).filter(([, id]) => id === o.id).map(([pid]) => v.players.find((p) => p.id === pid)).filter(Boolean);
        sugHtml = sugBy.length ? `<span class="sug-avs">${sugBy.map((p) => avatar(p, 'xxs')).join('')}</span>` : '';
      }

      const cls = [
        'opt',
        isElim ? 'eliminated' : '',
        showTruthSolved ? 'revealed truth correct' : '',
        solved && !isTruth && !isElim ? 'revealed fake' : '',
        showTruthAdmin ? 'truth-hint' : '',
        isSel ? 'sel' : ''
      ].filter(Boolean).join(' ');

      const disabled = admin || solved || isElim || (!canCaptainPick && !canSuggest);
      return `<button class="${cls}" data-opt-id="${o.id}" ${disabled ? 'disabled' : ''} onclick="anClickOpt('${o.id}')">
        <div class="opt-head">
          <span class="opt-letter">${letters[idx] || idx + 1}</span>
          <span class="opt-text">${esc(o.text)}</span>
        </div>
        <div class="opt-meta">
          ${isElim ? `<span class="opt-src src-wrong">${ic('x')} إجابة غلط${pickedBy ? ` (${esc(teamOf(pickedBy.team).name)})` : ''}</span>` : ''}
          ${showTruthSolved || showTruthAdmin ? `<span class="opt-src src-truth">${ic('check')} الإجابة الصح</span>` : ''}
          ${!isElim && pickedBy && pickedBy.correct ? `<span class="tchip team-${pickedBy.team}">${ic('check')} ${esc(teamOf(pickedBy.team).name)}</span>` : ''}
          ${sugHtml}
        </div>
      </button>`;
    }).join('')}
  </div>`;

  // منطقة تفاعل اللاعب أو الحكم
  let controls = '';
  if (admin) {
    const scorePanel = `<div class="card judge-score-panel">
      <h3 class="h3">${ic('trophy')} تحكم الحكم في النقاط <small>(زود أو نقص لأي فريق براحتك)</small></h3>
      <div class="judge-score-grid teams-count-${v.teams.length}">
        ${v.teams.map((tm) => `<div class="judge-score-box team-${tm.id}">
          <div class="js-head"><b>${esc(tm.name)}</b><span class="js-val">${tm.score}</span></div>
          <div class="js-btns">
            ${[10, 5, 1, -1, -5, -10].map((d) => `<button class="btn sm ${d > 0 ? 'olive' : 'danger'}" onclick="api('adjust_score',{team:'${tm.id}',delta:${d}})">${d > 0 ? '+' : ''}${d}</button>`).join('')}
          </div>
        </div>`).join('')}
      </div>
    </div>`;

    const roundTools = !solved ? `<div class="card admin-tools">
      ${an.subPhase !== 'buzz' ? `<button class="btn ghost sm" onclick="api('an_reset_buzz')">${ic('bell')} إعادة فتح الباز للفرق</button>` : ''}
      <button class="btn ghost sm" onclick="api('an_pass_turn')">${ic('swap')} حوّل الفرصة للفريق اللي بعده</button>
      <button class="btn primary sm" onclick="api('an_reveal')">${ic('bolt')} اكشف الإجابة الصح دلوقتي</button>
    </div>` : `<div class="next-bar"><button class="btn primary lg" onclick="nextRound()">${v.round + 1 >= v.totalRounds ? ic('trophy') + ' النتيجة النهائية' : ic('next') + ' السؤال الجاي'}</button></div>`;

    controls = `${scorePanel}${roundTools}`;
  } else if (!solved) {
    if (an.subPhase === 'buzz') {
      if (cap) {
        controls = `<div class="buzzer-wrap">
          <button class="buzzer-btn" id="buzzerBtn" onclick="api('an_buzz')">
            <span class="buzzer-dome">
              ${ic('bell')}
              <span class="buzzer-title">دوس الباز!</span>
              <span class="buzzer-sub">إنت قائد ${esc(teamOf(t).name)} — اللي يدوس الأول يجاوب</span>
            </span>
          </button>
        </div>`;
      } else {
        const capPlayer = v.players.find((p) => p.id === teamOf(t).captainId);
        controls = `<div class="card buzz-wait-card">${ic('crown')}<div><b>زرار الباز عند قائد فريقك ${capPlayer ? `(${esc(capPlayer.name)})` : ''} بس!</b><p class="sub">دوس على أي اختيار من الـ 4 عشان تقترحه على القائد.</p></div></div>`;
      }
    } else if (an.buzzedTeam === t) {
      if (cap) {
        const selOpt = an.options.find((x) => x.id === S.pickOpt && !elim.includes(x.id));
        controls = `<div class="annab-confirm-bar">
          <button id="anConfirmBtn" class="btn primary lg block" ${selOpt ? '' : 'disabled'} onclick="anConfirmPick()">
            ${ic('check')} ${selOpt ? `أكد الإجابة: «${esc(selOpt.text)}»` : `اختار إجابة من الـ ${an.subPhase === 'steal' ? remOptsCount + ' الباقيين' : '4 اختيارات'} فوق`}
          </button>
        </div>`;
      } else {
        controls = `<div class="card write-card center"><p class="sub" style="margin:0">${ic('bulb')} <b>فريقكم اللي بيجاوب دلوقتي!</b> دوس على الاختيار اللي شايفه صح فوق عشان تقترحه على القائد.</p></div>`;
      }
    } else {
      controls = `<div class="card frozen-card">${ic('lock')}<div><b>${an.subPhase === 'steal' ? `فرصة التكملة عند ${esc(teamOf(an.buzzedTeam).name)}` : `الباز اتقفل — ${esc(teamOf(an.buzzedTeam).name)} داس الأول!`}</b><p class="sub">${an.subPhase === 'steal' ? `بيختاروا دلوقتي من الـ ${remOptsCount} اختيارات الباقيين.` : `لو جاوبوا غلط، إجابتهم هتتشطب والفرصة هتتنقل للفريق اللي بعده!`}</p></div></div>`;
    }
  } else {
    controls = isHost()
      ? `<div class="next-bar"><span class="why">${v.aiJudge ? 'الـ AI هينقل للسؤال الجاي تلقائياً أو دوس دلوقتي' : ''}</span><button class="btn primary lg" onclick="nextRound()">${v.round + 1 >= v.totalRounds ? ic('trophy') + ' النتيجة النهائية' : ic('next') + ' السؤال الجاي'}</button></div>`
      : `<div class="waiting small"><p>${v.aiJudge ? 'الـ AI بيفتح السؤال الجاي تلقائياً' : 'مستنيين الحكم للسؤال الجاي'}<span class="dots"><i></i><i></i><i></i></span></p></div>`;
  }

  return `${topbar()}<section class="wrap game annab">${scorebar()}
    ${projector(an.q)}
    ${admin && !solved ? secretBar('الإجابة الصح (ماتورهاش لحد)', esc(an.truth)) : ''}
    ${banner}
    ${!admin && !solved && an.subPhase === 'buzz' ? controls + optsHtml : optsHtml + controls}
  </section>`;
}

function anClickOpt(optId) {
  const v = S.view;
  if (!v || !v.an) return;
  const an = v.an;
  if ((an.eliminated || []).includes(optId)) return;
  if (me().captain && (an.subPhase === 'answer' || an.subPhase === 'steal') && an.buzzedTeam === myTeam()) {
    S.pickOpt = optId;
    render();
  }
  api('an_suggest', { opt: optId }).then((r) => {
    if (r.ok && !me().captain) toast('اقتراحك وصل لقائد فريقك');
  });
}
function anConfirmPick() {
  if (!S.pickOpt) return toast('اختار إجابة الأول', 'err');
  const opt = S.pickOpt;
  api('an_pick', { opt }).then((r) => {
    if (r.ok) S.pickOpt = null;
  });
}

// ==================================================================
// 9) النهاية
// ==================================================================
function viewFinal() {
  const v = S.view;
  const sorted = v.teams.slice().sort((a, b) => b.score - a.score);
  const win = sorted[0];
  const lose = sorted[1] || sorted[0];
  const third = sorted[2] || null;
  const tie = sorted.length > 1 && sorted[0].score === sorted[1].score;
  const capOf = (t) => v.players.find((p) => p.id === t.captainId);
  return `${topbar()}<section class="wrap narrow final">
    <h1 class="h1 center">${tie ? 'تعادل!' : `${esc(win.name)} كسب السهرة`}</h1>
    <div class="podium">
      <div class="pod second team-${lose.id}">${avatar(capOf(lose), 'md')}<b>${esc(lose.name)}</b><span class="pod-score">${lose.score}</span><div class="pod-block">2</div></div>
      <div class="pod first team-${win.id}">${tie ? '' : `<span class="pod-crown">${ic('crown')}</span>`}${avatar(capOf(win), 'lg')}<b>${esc(win.name)}</b><span class="pod-score">${win.score}</span><div class="pod-block">1</div></div>
      ${third ? `<div class="pod third team-${third.id}">${avatar(capOf(third), 'sm')}<b>${esc(third.name)}</b><span class="pod-score">${third.score}</span><div class="pod-block">3</div></div>` : ''}
    </div>
    <div class="final-teams teams-grid teams-count-${v.teams.length}">${v.teams.map((t) => `<div class="card team-col team-${t.id}"><b>${esc(t.name)} (${t.score})</b><div class="tp-avatars">${playersOf(t.id).map((p) => avatar(p, 'xs')).join('')}</div></div>`).join('')}</div>
    ${isHost() ? `<div class="next-bar col">
      <button class="btn primary lg" onclick="returnToLobby()">${ic('sliders')} ارجع لغرفة الانتظار (العب تاني أو غيّر اللعبة)</button>
      <button class="btn ghost" onclick="closeRoom()">${ic('home')} اقفل الغرفة وابدأ من جديد</button>
    </div>` : '<div class="waiting small"><p>الحكم هيقرر الخطوة الجاية<span class="dots"><i></i><i></i><i></i></span></p></div>'}
  </section>`;
}

// ==================================================================
// 10) درج الحكم أثناء اللعب
// ==================================================================
function adminDrawer() {
  const v = S.view;
  const hideSecret = Boolean(v.settings && v.settings.hideSecret);
  return `<button class="fab" onclick="S.drawer=!S.drawer;render()" aria-expanded="${S.drawer}">${ic('whistle')} ${v.adminPlays ? 'تحكم الأدمن (AI حكم)' : 'لوحة الحكم'}</button>
  ${S.drawer ? `<div class="drawer-backdrop" onclick="S.drawer=false;render()"></div>
  <aside class="drawer" role="dialog" aria-label="لوحة الحكم">
    <div class="drawer-head"><h2 class="h2">${ic('whistle')} ${v.adminPlays ? 'لوحة الأدمن (الـ AI بيحكم)' : 'لوحة الحكم'}</h2><button class="icon-btn" aria-label="إغلاق" onclick="S.drawer=false;render()">${ic('x')}</button></div>
    ${v.status === 'playing' ? `<div class="drawer-sec">
      <h3 class="h3">وضع لعب الأدمن والتحكيم</h3>
      ${v.adminPlays
        ? `<p class="sub">إنت حالياً بتلعب مع <b>${esc(teamOf(v.adminTeam).name)}</b> والـ AI هو اللي بيحكم.</p>
           <button class="btn ghost block" onclick="api('admin_become_judge');S.drawer=false">${ic('whistle')} اخرج من الفريق وارجع حكم بشري</button>`
        : `<p class="sub">عايز تنضم لفريق وتلعب معاهم والـ AI يمسك التحكيم؟</p>
           <div class="row wrap-row">${v.teams.map((t) => `<button class="btn olive sm" onclick="api('admin_join_team',{team:'${t.id}'});S.drawer=false">العب مع ${esc(t.name)}</button>`).join('')}</div>`}
      <button class="btn ${v.pausedLeft != null ? 'primary' : 'ghost'} block" style="margin-top:8px" onclick="api('pause')">${v.pausedLeft != null ? ic('play') + ' كمّل اللعب' : ic('pause') + ' إيقاف مؤقت'}</button>
      ${!v.adminPlays ? `<button class="btn ${hideSecret ? 'olive' : 'ghost'} block" onclick="api('toggle_secret')">${ic(hideSecret ? 'eye' : 'eyeOff')} ${hideSecret ? 'إظهار الإجابات السرية للحكم' : 'إخفاء الإجابات (وضع التلفزيون)'}</button>` : ''}
      <button class="btn ghost block" onclick="nextRound();S.drawer=false">${ic('next')} تخطي للجولة الجاية</button>
    </div>` : ''}
    <div class="drawer-sec">
      <h3 class="h3">تعديل النقاط (بيظهر فوراً لكل الفرق)</h3>
      ${v.teams.map((t) => `<div class="adj team-${t.id}"><b>${esc(t.name)}</b><span class="adj-score">${t.score}</span>
        <div class="row">${[-10, -5, -1, 1, 5, 10].map((d) => `<button class="btn sm ${d > 0 ? 'olive' : 'danger'}" onclick="api('adjust_score',{team:'${t.id}',delta:${d}})">${d > 0 ? '+' : ''}${d}</button>`).join('')}</div></div>`).join('')}
    </div>
    <div class="drawer-sec">
      <h3 class="h3">اللاعبين</h3>
      ${v.teams.map((t) => `<p class="sub">${esc(t.name)}</p><ul class="members">${playersOf(t.id).map((p) => memberRow(p, true)).join('')}</ul>`).join('')}
    </div>
    <div class="drawer-sec">
      <h3 class="h3">تغيير اللعبة / إنهاء الجولة</h3>
      <button class="btn olive block" onclick="returnToLobby()">${ic('sliders')} إنهاء والرجوع لغرفة الانتظار (لتغيير اللعبة أو الإعدادات)</button>
      <button class="btn danger block" onclick="closeRoom()">${ic('home')} اقفل الغرفة وابدأ من جديد</button>
    </div>
  </aside>` : ''}`;
}
async function returnToLobby() {
  S.drawer = false;
  S.pickOpt = null;
  S.draft = {};
  await api('end_to_lobby');
  toast('رجعنا لغرفة الانتظار — تقدر تغيّر اللعبة أو الأسئلة أو الفرق دلوقتي!');
}
async function closeRoom() {
  if (!confirm('تقفل الغرفة؟ كل اللاعيبة هيخرجوا.')) return;
  await api('close_room');
  if (S.es) S.es.close();
  if (S.pollTimer) clearInterval(S.pollTimer);
  S.es = null; S.pollTimer = null; S.view = null; S.drawer = false; S.lastKey = null; S.customInRoom = false;
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
  fetchSavedPacksFromServer();
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
