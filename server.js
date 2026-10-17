/**
 * سيرفر "على القهوة" v14
 * - غرف حقيقية بدون أي بوتات (الغرفة بتبدأ فاضية وكل النقاط صفر)
 * - الأدمن = الحكم (مابيلعبش) وشاشته خاصة فيها الإجابات
 * - كرك بنظام kalak: 6 إجابات = 1 صح + مزيفة فريق أ + مزيفة فريق ب + مزيفة الأدمن + 2 من الـ AI
 * - سحلب (سلم التلميحات) + لبن تمر هندي (ساعة شطرنج)
 * - كل الحسابات على السيرفر والإجابات الصح ماتتبعتش للاعبين قبل الكشف
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const url = require('url');
const crypto = require('crypto');
const Q = require('./questions/picker');

let QRCode = null;
try { QRCode = require('qrcode'); } catch (e) {}

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

function getLanIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const n of nets[name]) if (n.family === 'IPv4' && !n.internal) return n.address;
  }
  return 'localhost';
}
const LAN_IP = getLanIp();

function getBaseUrl(req) {
  if (process.env.RENDER_EXTERNAL_URL) return process.env.RENDER_EXTERNAL_URL.replace(/\/$/, '');
  if (req && req.headers) {
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    if (host) {
      const proto = req.headers['x-forwarded-proto'] || 'http';
      return `${proto}://${host}`;
    }
  }
  return `http://${LAN_IP}:${PORT}`;
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp'
};
// الملفات المسموح عرضها فقط (عشان بنك الأسئلة والإجابات مايتسربش)
const PUBLIC_FILES = new Set(['/index.html', '/app.js', '/avatar.js', '/styles.css']);

// ============================================================
// إعدادات ثابتة
// ============================================================
const POINTS = {
  karak: { truth: 10, fooled: 5, houseBluff: -5 },
  sahlab: [10, 8, 6, 4, 2],
  tamr: { guess: 20, timeout: 10 },
  annab: { first: 10, steal: 5 }
};
const DEFAULT_SETTINGS = {
  count: 10,
  categories: [],
  useCustom: false,
  writeSec: 60,
  voteSec: 30,
  hintSec: 30,
  chessSec: 180,
  buzzSec: 20,
  hideSecret: false,
  teamNames: ['فريق الكرك', 'فريق السحلب']
};
const LIMITS = { count: [3, 30], writeSec: [20, 180], voteSec: [15, 120], hintSec: [15, 120], chessSec: [60, 600], buzzSec: [10, 60] };

// ============================================================
// أدوات
// ============================================================
const rid = (n = 8) => crypto.randomBytes(n).toString('hex');
const clamp = (v, [a, b]) => Math.max(a, Math.min(b, Number(v) || a));
const clean = (s, max = 80) => String(s == null ? '' : s).replace(/[<>]/g, '').trim().slice(0, max);

function makeCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c = '';
  for (let i = 0; i < 6; i++) c += chars[Math.floor(Math.random() * chars.length)];
  return c.slice(0, 3) + '-' + c.slice(3);
}

const WIKI_UA = 'AlaElAhwa/15 (https://ala-el-ahwa.onrender.com; contact@alaelahwa.com)';

function fetchJson(target, timeoutMs = 6500, redirectsLeft = 4) {
  return new Promise((resolve) => {
    const req = https.get(target, { headers: { 'User-Agent': WIKI_UA, Accept: 'application/json' }, timeout: timeoutMs }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirectsLeft > 0) {
        res.resume();
        const nextUrl = new URL(res.headers.location, target).href;
        return fetchJson(nextUrl, timeoutMs, redirectsLeft - 1).then(resolve);
      }
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => { try { resolve(JSON.parse(raw)); } catch (e) { resolve(null); } });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

// كاش لبيانات الصور نفسها في الرام عشان الـ 40 لاعب ياخدوا الصورة فوراً ومنغير حظر من ويكيبيديا
const IMG_BYTES_CACHE = new Map();
const IMG_INFLIGHT = new Map();
const ALLOWED_IMG_HOST = /^https:\/\/(upload|thumb)\.wikimedia\.org\//i;

function fetchImageBytes(target, timeoutMs = 8000, redirectsLeft = 5) {
  if (!ALLOWED_IMG_HOST.test(target)) return Promise.resolve(null);
  if (IMG_BYTES_CACHE.has(target)) return Promise.resolve(IMG_BYTES_CACHE.get(target));
  if (IMG_INFLIGHT.has(target)) return IMG_INFLIGHT.get(target);
  const job = new Promise((resolve) => {
    const req = https.get(target, { headers: { 'User-Agent': WIKI_UA, Accept: 'image/*,*/*;q=0.8' }, timeout: timeoutMs }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirectsLeft > 0) {
        res.resume();
        const nextUrl = new URL(res.headers.location, target).href;
        return fetchImageBytes(nextUrl, timeoutMs, redirectsLeft - 1).then(resolve);
      }
      const ct = String(res.headers['content-type'] || '');
      if (res.statusCode !== 200 || !ct.startsWith('image/')) {
        res.resume();
        return resolve(null);
      }
      const chunks = [];
      let total = 0;
      res.on('data', (c) => {
        total += c.length;
        if (total <= 6 * 1024 * 1024) chunks.push(c);
      });
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        if (buf.length < 300) return resolve(null);
        const entry = { buf, type: ct || 'image/jpeg', at: Date.now() };
        if (IMG_BYTES_CACHE.size >= 350) {
          const oldest = IMG_BYTES_CACHE.keys().next().value;
          if (oldest) IMG_BYTES_CACHE.delete(oldest);
        }
        IMG_BYTES_CACHE.set(target, entry);
        resolve(entry);
      });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  }).finally(() => IMG_INFLIGHT.delete(target));
  IMG_INFLIGHT.set(target, job);
  return job;
}

const IMG_CACHE = new Map();
const WIKI_URL_CACHE = new Map();
const WIKI_INFLIGHT = new Map();

async function wikiImage(rawTitle, arFallback = '') {
  const title = String(rawTitle || '').trim();
  const ar = String(arFallback || '').trim();
  if (!title) return null;
  const cacheKey = `${title}||${ar}`;
  if (IMG_CACHE.has(cacheKey)) return IMG_CACHE.get(cacheKey);
  if (IMG_CACHE.has(title) && IMG_CACHE.get(title)) return IMG_CACHE.get(title);
  if (WIKI_INFLIGHT.has(cacheKey)) return WIKI_INFLIGHT.get(cacheKey);

  const job = (async () => {
    const candidates = [];
    const addCandidate = (u) => { if (u && ALLOWED_IMG_HOST.test(u) && !candidates.includes(u)) candidates.push(u); };
    if (WIKI_URL_CACHE.has(title)) addCandidate(WIKI_URL_CACHE.get(title));
    if (ar && WIKI_URL_CACHE.has('ar:' + ar)) addCandidate(WIKI_URL_CACHE.get('ar:' + ar));

    const collectPages = (d) => {
      if (!d || !d.query || !d.query.pages) return;
      const pages = Object.values(d.query.pages).sort((a, b) => (a.index || 0) - (b.index || 0));
      for (const p of pages) {
        if (p.thumbnail && p.thumbnail.source) addCandidate(p.thumbnail.source);
        if (Array.isArray(p.imageinfo)) {
          for (const ii of p.imageinfo) addCandidate(ii.thumburl || ii.url);
        }
      }
    };

    if (!candidates.length) {
      const isArPrefix = title.startsWith('ar:');
      const cleanTitle = isArPrefix ? title.slice(3).trim() : title;
      const isArabicText = /[\u0600-\u06FF]/.test(cleanTitle);
      const steps = [];
      if (isArPrefix || isArabicText) {
        steps.push(['ar.wikipedia.org', cleanTitle]);
        if (ar && ar !== cleanTitle) steps.push(['ar.wikipedia.org', ar]);
        steps.push(['en.wikipedia.org', cleanTitle]);
      } else {
        steps.push(['en.wikipedia.org', cleanTitle]);
        if (ar) steps.push(['ar.wikipedia.org', ar]);
      }

      for (const [host, term] of steps) {
        if (!term) continue;
        const d1 = await fetchJson(`https://${host}/w/api.php?action=query&titles=${encodeURIComponent(term)}&prop=pageimages&piprop=thumbnail&pilicense=any&pithumbsize=560&redirects=1&format=json`);
        collectPages(d1);
        if (candidates.length) break;
        const d2 = await fetchJson(`https://${host}/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(term)}&gsrlimit=4&prop=pageimages&piprop=thumbnail&pilicense=any&pithumbsize=560&format=json`);
        collectPages(d2);
        if (candidates.length) break;
      }

      if (!candidates.length) {
        const term = cleanTitle || ar;
        const dc = await fetchJson(`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(term)}&gsrnamespace=6&gsrlimit=4&prop=imageinfo&iiprop=url&iiurlwidth=560&format=json`);
        collectPages(dc);
      }
    }

    for (const src of candidates) {
      const ok = await fetchImageBytes(src);
      if (ok) {
        const out = `/api/img?u=${encodeURIComponent(src)}`;
        IMG_CACHE.set(title, out);
        IMG_CACHE.set(cacheKey, out);
        return out;
      }
    }
    return null;
  })().finally(() => WIKI_INFLIGHT.delete(cacheKey));

  WIKI_INFLIGHT.set(cacheKey, job);
  return job;
}

// تحضير الصور دفعة واحدة لطابور الجولات عشان تظهر فوراً من أول ثانية
async function warmQueueImages(items, waitFirstCount = 2) {
  if (!Array.isArray(items) || !items.length) return;
  const enTitles = [];
  const arTitles = [];
  for (const it of items) {
    const q = String((it && it.imageQuery) || '').trim();
    if (!q || WIKI_URL_CACHE.has(q) || IMG_CACHE.has(q)) continue;
    if (q.startsWith('ar:') || /[\u0600-\u06FF]/.test(q)) arTitles.push(q.replace(/^ar:/, '').trim());
    else enTitles.push(q);
  }
  const resolveBatch = async (host, list, prefix = '') => {
    for (let i = 0; i < list.length; i += 40) {
      const chunk = list.slice(i, i + 40);
      const j = await fetchJson(`https://${host}/w/api.php?action=query&titles=${encodeURIComponent(chunk.join('|'))}&prop=pageimages&piprop=thumbnail&pilicense=any&pithumbsize=560&redirects=1&format=json`);
      if (!j || !j.query) continue;
      const norm = {};
      (j.query.normalized || []).forEach((n) => (norm[n.to] = n.from));
      const redir = {};
      (j.query.redirects || []).forEach((r) => (redir[r.to] = r.from));
      for (const p of Object.values(j.query.pages || {})) {
        const src = p.thumbnail && p.thumbnail.source;
        if (!src || !ALLOWED_IMG_HOST.test(src)) continue;
        let orig = p.title;
        WIKI_URL_CACHE.set(prefix + orig, src);
        WIKI_URL_CACHE.set(orig, src);
        if (redir[orig]) { orig = redir[orig]; WIKI_URL_CACHE.set(prefix + orig, src); WIKI_URL_CACHE.set(orig, src); }
        if (norm[orig]) { orig = norm[orig]; WIKI_URL_CACHE.set(prefix + orig, src); WIKI_URL_CACHE.set(orig, src); }
      }
    }
  };
  await Promise.all([
    enTitles.length ? resolveBatch('en.wikipedia.org', [...new Set(enTitles)], '') : null,
    arTitles.length ? resolveBatch('ar.wikipedia.org', [...new Set(arTitles)], 'ar:') : null
  ]);
  if (waitFirstCount > 0) {
    const first = items.slice(0, waitFirstCount);
    await Promise.race([
      Promise.all(first.map((it) => (it && it.imageQuery ? wikiImage(it.imageQuery, it.answer || it.name) : null))),
      new Promise((r) => setTimeout(r, 2500))
    ]);
  }
  setImmediate(async () => {
    for (const it of items.slice(waitFirstCount)) {
      if (it && it.imageQuery) await wikiImage(it.imageQuery, it.answer || it.name);
    }
  });
}

// ============================================================
// الغرف
// ============================================================
const ROOMS = new Map();

function newTeams(names) {
  return [
    { id: 'A', name: clean(names[0], 24) || DEFAULT_SETTINGS.teamNames[0], captainId: null, score: 0 },
    { id: 'B', name: clean(names[1], 24) || DEFAULT_SETTINGS.teamNames[1], captainId: null, score: 0 }
  ];
}

function createRoom(admin, game, settings, customPack) {
  let code = makeCode();
  while (ROOMS.has(code)) code = makeCode();
  const room = {
    code,
    seq: 1,
    inviteUrl: `http://${LAN_IP}:${PORT}/room/${code}`,
    admin: { pid: admin.pid, secret: admin.secret, profile: admin.profile },
    game,
    settings,
    customPack,
    status: 'lobby', // lobby | playing | finished
    teams: newTeams(settings.teamNames),
    players: {},
    kicked: new Set(),
    queue: [],
    round: -1,
    phase: null,
    deadline: null,
    pausedLeft: null,
    kr: null, sh: null, tm: null, an: null,
    lastEvent: null,
    clients: new Set(),
    touched: Date.now()
  };
  ROOMS.set(code, room);
  return room;
}

function sanitizeSettings(game, s = {}) {
  const out = { ...DEFAULT_SETTINGS };
  const defCount = game === 'annab' ? 20 : out.count;
  out.count = clamp(s.count ?? defCount, LIMITS.count);
  out.writeSec = clamp(s.writeSec ?? out.writeSec, LIMITS.writeSec);
  out.voteSec = clamp(s.voteSec ?? out.voteSec, LIMITS.voteSec);
  out.hintSec = clamp(s.hintSec ?? out.hintSec, LIMITS.hintSec);
  out.chessSec = clamp(s.chessSec ?? out.chessSec, LIMITS.chessSec);
  out.buzzSec = clamp(s.buzzSec ?? out.buzzSec, LIMITS.buzzSec);
  out.hideSecret = !!s.hideSecret;
  out.categories = Array.isArray(s.categories) ? s.categories.map((c) => clean(c, 20)).slice(0, 20) : [];
  out.useCustom = !!s.useCustom;
  out.ai = s.ai === undefined ? true : !!s.ai;
  out.teamNames = Array.isArray(s.teamNames) ? [clean(s.teamNames[0], 24) || out.teamNames[0], clean(s.teamNames[1], 24) || out.teamNames[1]] : out.teamNames;
  return out;
}

function sanitizeCustom(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((x) => ({
      q: clean(x.q, 220),
      truth: clean(x.truth, 60),
      bluffs: Array.isArray(x.bluffs) ? x.bluffs.map((b) => clean(b, 60)).filter(Boolean).slice(0, 3) : []
    }))
    .filter((x) => x.q && x.truth)
    .slice(0, 30);
}

function teamMembers(room, teamId) {
  return Object.values(room.players).filter((p) => p.team === teamId);
}
// سعة الغرفة: 40 لاعب — كل فريق 20
const MAX_PLAYERS = 40;
const MAX_TEAM = 20;
function assertTeamRoom(room, teamId, pid) {
  const members = teamMembers(room, teamId).filter((p) => p.id !== pid);
  if (members.length >= MAX_TEAM) ERR(`${(room.teams.find((t) => t.id === teamId) || {}).name || 'الفريق'} كامل (${MAX_TEAM} لاعب)`);
}

function ensureCaptain(room, teamId) {
  const t = room.teams.find((x) => x.id === teamId);
  if (!t) return;
  const members = teamMembers(room, teamId);
  if (t.captainId && members.some((m) => m.id === t.captainId)) return;
  const real = members.filter((m) => !m.isTest);
  t.captainId = (real[0] || members[0] || {}).id || null;
}

function isCaptain(room, pid) {
  const p = room.players[pid];
  if (!p || !p.team) return false;
  const t = room.teams.find((x) => x.id === p.team);
  return t && t.captainId === pid;
}

function event(room, type, data = {}) {
  room.lastEvent = { id: rid(4), type, ...data, at: Date.now() };
}

function addScore(room, teamId, pts) {
  const t = room.teams.find((x) => x.id === teamId);
  if (t) t.score += pts;
}

function otherTeam(id) { return id === 'A' ? 'B' : 'A'; }

function setDeadline(room, sec) {
  room.deadline = sec ? Date.now() + sec * 1000 : null;
  room.pausedLeft = null;
}

// الـ AI بيجمع أسئلة/صور جديدة حسب الكتالوج اللي الحكم اختاره (في الخلفية)
function startAiPrefetch(room) {
  const s = room.settings;
  room.aiJob = null;
  room.aiReady = 0;
  if (!s.ai || s.useCustom) return;
  const REL = ['islamic_history', 'islamic', 'quran', 'hadith'];
  if (s.categories.length && s.categories.every((c) => REL.includes(c))) { room.aiStatus = 'verified'; return; }
  const need = room.game === 'tamr' ? s.count * 2 : s.count;
  room.aiStatus = 'loading';
  room.aiJob = Q.prefetchAI(room.game, s.categories, need).then((list) => {
    room.aiReady = list.length;
    room.aiStatus = list.length ? 'ready' : 'off';
    broadcast(room);
    return list;
  });
}

// ============================================================
// بداية اللعبة
// ============================================================
async function startGame(room) {
  const s = room.settings;
  let items = [];
  if (s.useCustom && room.customPack.length) {
    items = room.customPack.map((c, i) => {
      if (room.game === 'karak' || room.game === 'annab') {
        return { id: 'custom_' + i, custom: true, q: c.q, truth: c.truth, bluffs: Array.isArray(c.bluffs) ? [...c.bluffs] : [] };
      }
      if (room.game === 'sahlab') return { id: 'custom_' + i, custom: true, answer: c.truth, aliases: [], imageQuery: c.truth, hints: [c.q] };
      return { id: 'custom_' + i, custom: true, name: c.truth, brief: c.q, imageQuery: c.truth };
    });
    if (room.game === 'karak' || room.game === 'annab') {
      const needAi = items.filter((it) => (it.bluffs || []).length < 3);
      if (needAi.length) {
        const ai = await Q.aiBluffsFor(needAi);
        needAi.forEach((it, idx) => {
          const got = [...(it.bluffs || []), ...(ai[idx] || [])].slice(0, 4);
          it.bluffs = got.length >= 3 ? got : [...got, ...Q.fallbackBluffs(it.truth, 4)].slice(0, 4);
        });
      }
    }
    if (room.game === 'tamr' && items.length % 2) items.push(...(await Q.pickQuestions('tamr', [], 1)));
  } else {
    const need = room.game === 'tamr' ? s.count * 2 : s.count;
    let aiFresh = [];
    if (s.ai && room.aiJob) {
      // نستنى الـ AI بحد أقصى 6 ثواني — لو اتأخر نكمل بالبنك
      aiFresh = await Promise.race([room.aiJob, new Promise((r) => setTimeout(() => r([]), 6000))]);
    }
    items = await Q.pickQuestions(room.game, s.categories, need, aiFresh || []);
    room.aiUsed = items.filter((x) => x.ai).length;
  }
  if (!items.length) throw new Error('مفيش أسئلة جديدة متاحة حالياً — جرب فئات تانية');

  room.queue = items;
  if (room.game === 'sahlab' || room.game === 'tamr') {
    await warmQueueImages(items, room.game === 'tamr' ? 2 : 1);
  }
  room.totalRounds = room.game === 'tamr' ? Math.floor(items.length / 2) : items.length;
  room.teams.forEach((t) => (t.score = 0));
  room.status = 'playing';
  room.round = -1;
  await nextRound(room);
}

async function nextRound(room) {
  if (room.sh && room.sh.autoHintTimer) { clearTimeout(room.sh.autoHintTimer); room.sh.autoHintTimer = null; }
  room.round++;
  if (room.round >= room.totalRounds) return finishGame(room);
  if (room.game === 'karak') startKarakRound(room);
  else if (room.game === 'sahlab') await startSahlabRound(room);
  else if (room.game === 'annab') startAnnabRound(room);
  else await startTamrRound(room);
}

function finishGame(room) {
  if (room.sh && room.sh.autoHintTimer) { clearTimeout(room.sh.autoHintTimer); room.sh.autoHintTimer = null; }
  room.status = 'finished';
  room.phase = 'final';
  setDeadline(room, 0);
  const [a, b] = room.teams;
  event(room, 'final', { winner: a.score === b.score ? null : a.score > b.score ? 'A' : 'B' });
}

// ============================================================
// كرك
// ============================================================
function startKarakRound(room) {
  const item = room.queue[room.round];
  Q.markUsed('karak', item);
  const bl = Q.shuffle(item.bluffs || []);
  room.kr = {
    q: item.q,
    truth: item.truth,
    cat: item.cat || 'custom',
    aiBluffs: bl.slice(0, 2),
    spareBluffs: bl.slice(2),
    adminBluff: '',
    teamBluff: { A: '', B: '' },
    teamBluffBy: { A: null, B: null },
    autoFilled: { A: false, B: false },
    suggestions: { A: {}, B: {} },
    options: [],
    voteSuggest: { A: {}, B: {} },
    votes: { A: null, B: null },
    results: null
  };
  while (room.kr.aiBluffs.length < 2) room.kr.aiBluffs.push(...Q.fallbackBluffs(item.truth, 2 - room.kr.aiBluffs.length));
  room.phase = 'write';
  setDeadline(room, room.settings.writeSec);
  event(room, 'round', { round: room.round });
}

function spareBluff(room, avoid) {
  const kr = room.kr;
  const taken = new Set(avoid.map(Q.normalizeAr));
  while (kr.spareBluffs.length) {
    const b = kr.spareBluffs.shift();
    if (!taken.has(Q.normalizeAr(b))) return b;
  }
  const fb = Q.fallbackBluffs(kr.truth, 12).find((b) => !taken.has(Q.normalizeAr(b)));
  return fb || 'معلومة مش معروفة';
}

function karakCheckWriteDone(room) {
  const kr = room.kr;
  if (kr.teamBluff.A && kr.teamBluff.B) {
    room.phase = 'review';
    setDeadline(room, 0);
    event(room, 'review');
  }
}

function karakWriteTimeout(room) {
  const kr = room.kr;
  for (const t of ['A', 'B']) {
    if (!kr.teamBluff[t]) {
      kr.teamBluff[t] = spareBluff(room, [kr.truth, kr.teamBluff.A, kr.teamBluff.B, ...kr.aiBluffs]);
      kr.autoFilled[t] = true;
    }
  }
  room.phase = 'review';
  setDeadline(room, 0);
  event(room, 'review');
}

function karakPublish(room) {
  const kr = room.kr;
  const list = [{ src: 'truth', text: kr.truth }];
  const seen = new Set([Q.normalizeAr(kr.truth)]);
  const push = (src, text) => {
    let t = clean(text, 60);
    if (!t || seen.has(Q.normalizeAr(t))) t = spareBluff(room, [...seen]);
    seen.add(Q.normalizeAr(t));
    list.push({ src, text: t });
  };
  push(kr.autoFilled.A ? 'ai' : 'A', kr.teamBluff.A);
  push(kr.autoFilled.B ? 'ai' : 'B', kr.teamBluff.B);
  push(kr.adminBluff ? 'admin' : 'ai', kr.adminBluff || spareBluff(room, [...seen]));
  kr.aiBluffs.forEach((b) => push('ai', b));
  kr.options = Q.shuffle(list).map((o, i) => ({ id: 'o' + i, ...o }));
  room.phase = 'vote';
  setDeadline(room, room.settings.voteSec);
  event(room, 'vote');
}

function karakReveal(room) {
  const kr = room.kr;
  const P = POINTS.karak;
  const delta = { A: 0, B: 0 };
  const lines = [];
  for (const t of ['A', 'B']) {
    const v = kr.options.find((o) => o.id === kr.votes[t]);
    if (!v) { lines.push({ team: t, kind: 'none', pts: 0 }); continue; }
    if (v.src === 'truth') { delta[t] += P.truth; lines.push({ team: t, kind: 'truth', pts: P.truth, opt: v.id }); }
    else if (v.src === 'A' || v.src === 'B') { delta[v.src] += P.fooled; lines.push({ team: t, kind: 'fooled', by: v.src, pts: P.fooled, opt: v.id }); }
    else { delta[t] += P.houseBluff; lines.push({ team: t, kind: 'house', src: v.src, pts: P.houseBluff, opt: v.id }); }
  }
  addScore(room, 'A', delta.A);
  addScore(room, 'B', delta.B);
  kr.results = { delta, lines };
  room.phase = 'reveal';
  setDeadline(room, 0);
  event(room, 'reveal', { delta });
}

// ============================================================
// سحلب
// ============================================================
async function startSahlabRound(room) {
  const item = room.queue[room.round];
  Q.markUsed('sahlab', item);
  let initialPhoto = null;
  if (item.imageQuery) {
    initialPhoto = await Promise.race([
      wikiImage(item.imageQuery, item.answer),
      new Promise((r) => setTimeout(() => r(null), 2600))
    ]);
  }
  room.sh = {
    answer: item.answer,
    aliases: item.aliases || [],
    hints: item.hints,
    hintIdx: 0,
    frozen: { A: false, B: false },
    pending: { A: null, B: null },
    suggestions: { A: {}, B: {} },
    guesses: [],
    winner: null,
    photo: initialPhoto,
    autoHintTimer: null
  };
  room.phase = 'play';
  setDeadline(room, room.settings.hintSec);
  event(room, 'round', { round: room.round });
  if (item.imageQuery && !initialPhoto) {
    wikiImage(item.imageQuery, item.answer).then((img) => {
      if (img && room.sh && room.sh.answer === item.answer && !room.sh.photo) {
        room.sh.photo = img;
        broadcast(room);
      }
    });
  }
}

function sahlabMatches(sh, text) {
  const g = Q.normalizeAr(text);
  if (!g) return false;
  return [sh.answer, ...sh.aliases].some((a) => {
    const n = Q.normalizeAr(a);
    return n && (n === g || (g.length >= 4 && n.includes(g)) || (n.length >= 4 && g.includes(n)));
  });
}

function sahlabNextHint(room) {
  const sh = room.sh;
  if (!sh) return;
  if (sh.autoHintTimer) { clearTimeout(sh.autoHintTimer); sh.autoHintTimer = null; }
  if (sh.hintIdx >= sh.hints.length - 1) return sahlabSolve(room, null);
  sh.hintIdx++;
  sh.frozen = { A: false, B: false };
  sh.pending = { A: null, B: null };
  sh.suggestions = { A: {}, B: {} };
  setDeadline(room, room.settings.hintSec);
  event(room, 'hint', { idx: sh.hintIdx });
}

function sahlabSolve(room, teamId) {
  const sh = room.sh;
  if (!sh) return;
  if (sh.autoHintTimer) { clearTimeout(sh.autoHintTimer); sh.autoHintTimer = null; }
  sh.winner = teamId;
  const pts = teamId ? POINTS.sahlab[Math.min(sh.hintIdx, POINTS.sahlab.length - 1)] : 0;
  if (teamId) addScore(room, teamId, pts);
  sh.pending = { A: null, B: null };
  sh.suggestions = { A: {}, B: {} };
  sh.wonPts = pts;
  room.phase = 'solved';
  setDeadline(room, 0);
  event(room, 'solved', { team: teamId, pts });
}

function sahlabScheduleBothFrozen(room) {
  const sh = room.sh;
  if (!sh || !(sh.frozen.A && sh.frozen.B)) return;
  if (sh.autoHintTimer) clearTimeout(sh.autoHintTimer);
  setDeadline(room, 2);
  sh.autoHintTimer = setTimeout(() => {
    if (room.status === 'playing' && room.game === 'sahlab' && room.phase === 'play' && room.sh === sh && sh.frozen.A && sh.frozen.B) {
      sahlabNextHint(room);
      broadcast(room);
    }
  }, 1800);
}

function sahlabJudge(room, teamId, correct) {
  const sh = room.sh;
  const pend = sh.pending[teamId];
  if (!pend) return;
  sh.guesses.push({ team: teamId, text: pend, correct, hint: sh.hintIdx });
  sh.pending[teamId] = null;
  if (correct) return sahlabSolve(room, teamId);
  sh.frozen[teamId] = true;
  const bothFrozen = !!(sh.frozen.A && sh.frozen.B);
  event(room, 'wrong', { team: teamId, text: pend, bothFrozen });
  if (bothFrozen) sahlabScheduleBothFrozen(room);
}

// ============================================================
// لبن تمر هندي
// ============================================================
async function startTamrRound(room) {
  const a = room.queue[room.round * 2];
  const b = room.queue[room.round * 2 + 1];
  Q.markUsed('tamr', a);
  Q.markUsed('tamr', b);
  const [photoA, photoB] = await Promise.race([
    Promise.all([
      a.imageQuery ? wikiImage(a.imageQuery, a.name) : Promise.resolve(null),
      b.imageQuery ? wikiImage(b.imageQuery, b.name) : Promise.resolve(null)
    ]),
    new Promise((r) => setTimeout(() => r([null, null]), 2600))
  ]);
  room.tm = {
    chars: { A: { name: a.name, brief: a.brief, photo: photoA }, B: { name: b.name, brief: b.brief, photo: photoB } },
    turn: room.round % 2 ? 'B' : 'A',
    clocks: { A: room.settings.chessSec, B: room.settings.chessSec },
    lastTick: Date.now(),
    golden: null,
    pending: null,
    suggestions: { A: {}, B: {} },
    guesses: [],
    winner: null,
    wonPts: 0,
    reason: null
  };
  room.phase = 'play';
  room.paused = false;
  setDeadline(room, 0);
  event(room, 'round', { round: room.round });
  const tm = room.tm;
  if (a.imageQuery && !photoA) {
    wikiImage(a.imageQuery, a.name).then((img) => { if (img && room.tm === tm && !tm.chars.A.photo) { tm.chars.A.photo = img; broadcast(room); } });
  }
  if (b.imageQuery && !photoB) {
    wikiImage(b.imageQuery, b.name).then((img) => { if (img && room.tm === tm && !tm.chars.B.photo) { tm.chars.B.photo = img; broadcast(room); } });
  }
}

function tamrMatches(name, text) {
  const n = Q.normalizeAr(name);
  const g = Q.normalizeAr(text);
  if (!g) return false;
  return n === g || (g.length >= 4 && n.includes(g)) || n.split(' ').some((part) => part.length >= 4 && part === g);
}

function tamrSolve(room, teamId, pts, reason) {
  const tm = room.tm;
  tm.winner = teamId;
  tm.wonPts = pts;
  tm.reason = reason;
  tm.pending = null;
  if (teamId) addScore(room, teamId, pts);
  room.phase = 'solved';
  event(room, 'solved', { team: teamId, pts, reason });
}

function tamrJudge(room, correct) {
  const tm = room.tm;
  if (!tm.pending) return;
  const { team, text } = tm.pending;
  tm.guesses.push({ team, text, correct });
  tm.pending = null;
  tm.lastTick = Date.now();
  if (correct) return tamrSolve(room, team, POINTS.tamr.guess, 'guess');
  if (tm.golden === team) {
    // الفرصة الذهبية ضاعت — الدور يكمل عادي على نفس الفريق
    tm.golden = null;
    tm.turn = team;
    event(room, 'wrong', { team, text });
  } else {
    tm.golden = otherTeam(team);
    event(room, 'golden', { team: tm.golden, wrongTeam: team, text });
  }
}

// ============================================================
// عنّاب (زرار الباز + 4 اختيارات)
// ============================================================
function startAnnabRound(room) {
  const item = room.queue[room.round];
  Q.markUsed('annab', item);
  const seen = new Set([Q.normalizeAr(item.truth)]);
  const wrongPool = [...Q.shuffle(item.bluffs || []), ...Q.fallbackBluffs(item.truth, 10)];
  const wrongs = [];
  for (const w of wrongPool) {
    const t = clean(w, 60);
    if (t && !seen.has(Q.normalizeAr(t))) {
      seen.add(Q.normalizeAr(t));
      wrongs.push(t);
      if (wrongs.length === 3) break;
    }
  }
  const rawOpts = Q.shuffle([
    { text: item.truth, isCorrect: true },
    ...wrongs.map((w) => ({ text: w, isCorrect: false }))
  ]);
  const options = rawOpts.map((o, i) => ({ id: 'o' + i, text: o.text }));
  const correctIdx = rawOpts.findIndex((o) => o.isCorrect);
  const correctId = options[correctIdx >= 0 ? correctIdx : 0].id;
  room.an = {
    q: item.q,
    cat: item.cat || 'custom',
    truth: item.truth,
    options,
    correctId,
    subPhase: 'buzz', // 'buzz' | 'answer' | 'steal'
    buzzedTeam: null,
    attempt: 0,
    eliminated: [],
    picks: [],
    suggestions: { A: {}, B: {} },
    winner: null
  };
  room.phase = 'play';
  setDeadline(room, 0);
  event(room, 'round', { round: room.round });
}

function annabHandlePick(room, teamId, opt) {
  const an = room.an;
  const correct = opt.id === an.correctId;
  an.picks.push({ team: teamId, optId: opt.id, text: opt.text, correct, attempt: an.attempt });
  an.suggestions = { A: {}, B: {} };
  if (correct) {
    an.winner = teamId;
    room.phase = 'solved';
    setDeadline(room, 0);
    event(room, 'an_correct', { team: teamId, text: opt.text });
    return;
  }
  if (!an.eliminated.includes(opt.id)) an.eliminated.push(opt.id);
  if (an.attempt === 1) {
    const nextTeam = otherTeam(teamId);
    an.buzzedTeam = nextTeam;
    an.attempt = 2;
    an.subPhase = 'steal';
    setDeadline(room, room.settings.buzzSec);
    event(room, 'an_wrong_steal', { wrongTeam: teamId, team: nextTeam, text: opt.text });
  } else {
    an.winner = null;
    room.phase = 'solved';
    setDeadline(room, 0);
    event(room, 'an_both_wrong', { wrongTeam: teamId, text: opt.text });
  }
}

function annabTimeout(room) {
  const an = room.an;
  if (!an || room.phase !== 'play') return;
  if (an.subPhase === 'answer' && an.buzzedTeam) {
    const prev = an.buzzedTeam;
    const nextTeam = otherTeam(prev);
    an.buzzedTeam = nextTeam;
    an.attempt = 2;
    an.subPhase = 'steal';
    setDeadline(room, room.settings.buzzSec);
    event(room, 'an_timeout_steal', { wrongTeam: prev, team: nextTeam });
  } else if (an.subPhase === 'steal') {
    an.winner = null;
    room.phase = 'solved';
    setDeadline(room, 0);
    event(room, 'an_both_wrong', { wrongTeam: an.buzzedTeam });
  }
}

// ============================================================
// المؤقت العام
// ============================================================
setInterval(() => {
  const now = Date.now();
  for (const room of ROOMS.values()) {
    if (room.status !== 'playing' || room.pausedLeft != null) continue;
    let shouldBroadcast = false;
    if (room.game === 'tamr' && room.phase === 'play' && room.tm && !room.tm.golden && !room.tm.pending && !room.paused) {
      const tm = room.tm;
      if (!tm.lastTick) tm.lastTick = now;
      if (now - tm.lastTick >= 1000) {
        const steps = Math.floor((now - tm.lastTick) / 1000);
        tm.lastTick += steps * 1000;
        tm.clocks[tm.turn] = Math.max(0, tm.clocks[tm.turn] - steps);
        if (tm.clocks[tm.turn] === 0) {
          tamrSolve(room, otherTeam(tm.turn), POINTS.tamr.timeout, 'timeout');
          shouldBroadcast = true;
        }
      }
    } else if (room.tm) {
      room.tm.lastTick = now;
    }
    if (room.deadline && now >= room.deadline) {
      room.deadline = null;
      if (room.game === 'karak' && room.phase === 'write') karakWriteTimeout(room);
      else if (room.game === 'karak' && room.phase === 'vote') karakReveal(room);
      else if (room.game === 'sahlab' && room.phase === 'play') sahlabNextHint(room);
      else if (room.game === 'annab' && room.phase === 'play') annabTimeout(room);
      shouldBroadcast = true;
    }
    if (shouldBroadcast) broadcast(room);
  }
  // تنظيف الغرف القديمة (6 ساعات بدون نشاط)
  for (const [code, room] of ROOMS) if (now - room.touched > 6 * 3600e3 && room.clients.size === 0) ROOMS.delete(code);
}, 250);

// ============================================================
// العرض المخصص لكل مستخدم (فلترة الأسرار)
// ============================================================
function viewFor(room, pid) {
  const isAdmin = room.admin.pid === pid;
  const me = room.players[pid] || null;
  const myTeam = me ? me.team : null;
  const v = {
    now: Date.now(),
    seq: room.seq || 1,
    code: room.code,
    inviteUrl: room.inviteUrl,
    game: room.game,
    status: room.status,
    phase: room.phase,
    round: room.round,
    totalRounds: room.totalRounds || room.settings.count,
    deadline: room.deadline,
    pausedLeft: room.pausedLeft,
    settings: { ...room.settings },
    customCount: room.customPack.length,
    customPack: isAdmin ? room.customPack : undefined,
    teams: room.teams.map((t) => ({ ...t })),
    players: Object.values(room.players).map((p) => ({ id: p.id, name: p.name, outfit: p.outfit, face: p.face, hat: p.hat, team: p.team, isTest: !!p.isTest, online: p.isTest || p.conns > 0 })),
    admin: { name: room.admin.profile.name, outfit: room.admin.profile.outfit, face: room.admin.profile.face, hat: room.admin.profile.hat, online: room.admin.conns > 0 },
    me: isAdmin ? { role: 'admin', id: pid } : me ? { role: 'player', id: pid, team: myTeam, captain: isCaptain(room, pid) } : { role: 'guest', id: pid },
    lastEvent: room.lastEvent,
    points: POINTS,
    ai: { on: !!room.settings.ai && !room.settings.useCustom, status: room.aiStatus || 'off', ready: room.aiReady || 0, used: room.aiUsed || 0 },
    caps: { room: MAX_PLAYERS, team: MAX_TEAM }
  };
  if (room.kicked.has(pid)) v.me.role = 'kicked';

  if (room.game === 'karak' && room.kr) {
    const kr = room.kr;
    const reveal = room.phase === 'reveal';
    const k = { q: kr.q, cat: kr.cat };
    if (isAdmin) {
      Object.assign(k, { truth: kr.truth, aiBluffs: kr.aiBluffs, adminBluff: kr.adminBluff, teamBluff: kr.teamBluff, autoFilled: kr.autoFilled, suggestions: kr.suggestions, voteSuggest: kr.voteSuggest, votes: kr.votes, results: kr.results });
      k.submitted = { A: !!kr.teamBluff.A, B: !!kr.teamBluff.B };
      k.options = kr.options;
    } else {
      k.submitted = { A: !!kr.teamBluff.A, B: !!kr.teamBluff.B };
      k.voted = { A: !!kr.votes.A, B: !!kr.votes.B };
      if (myTeam) {
        k.myBluff = kr.teamBluff[myTeam];
        k.suggestions = kr.suggestions[myTeam];
        k.voteSuggest = kr.voteSuggest[myTeam];
        k.myVote = kr.votes[myTeam];
      }
      k.options = kr.options.map((o) => {
        const base = { id: o.id, text: o.text };
        if (reveal) Object.assign(base, { src: o.src });
        else if (myTeam && o.src === myTeam) base.mine = true;
        return base;
      });
      if (reveal) Object.assign(k, { truth: kr.truth, votes: kr.votes, results: kr.results });
    }
    if (reveal && isAdmin) k.votes = kr.votes;
    v.kr = k;
  }

  if (room.game === 'sahlab' && room.sh) {
    const sh = room.sh;
    const solved = room.phase === 'solved';
    v.sh = {
      hints: sh.hints.slice(0, sh.hintIdx + 1),
      totalHints: sh.hints.length,
      hintIdx: sh.hintIdx,
      value: POINTS.sahlab[Math.min(sh.hintIdx, POINTS.sahlab.length - 1)],
      frozen: sh.frozen,
      pending: isAdmin ? sh.pending : { A: !!sh.pending.A, B: !!sh.pending.B },
      myPending: myTeam ? sh.pending[myTeam] : null,
      suggestions: isAdmin ? sh.suggestions : myTeam ? (sh.suggestions && sh.suggestions[myTeam]) || {} : {},
      guesses: sh.guesses.map((g) => ({ team: g.team, text: isAdmin || solved || g.team === myTeam ? g.text : '؟؟؟', correct: g.correct, hint: g.hint })),
      photo: sh.photo,
      winner: sh.winner,
      wonPts: sh.wonPts || 0
    };
    if (isAdmin || solved) { v.sh.answer = sh.answer; v.sh.allHints = isAdmin ? sh.hints : undefined; }
    if (solved) v.sh.hints = sh.hints;
  }

  if (room.game === 'tamr' && room.tm) {
    const tm = room.tm;
    const solved = room.phase === 'solved';
    const turnRunning = room.phase === 'play' && !room.paused && room.pausedLeft == null && !tm.golden && !tm.pending;
    v.tm = {
      turn: tm.turn,
      clocks: { ...tm.clocks },
      lastTick: tm.lastTick || Date.now(),
      turnRunning,
      golden: tm.golden,
      pending: tm.pending ? { team: tm.pending.team, text: isAdmin || tm.pending.team === myTeam ? tm.pending.text : null } : null,
      suggestions: isAdmin ? tm.suggestions : myTeam ? (tm.suggestions && tm.suggestions[myTeam]) || {} : {},
      guesses: tm.guesses,
      winner: tm.winner,
      wonPts: tm.wonPts,
      reason: tm.reason,
      paused: !!room.paused || room.pausedLeft != null
    };
    // كل فريق بيشوف شخصية الفريق التاني (اللي هيجاوب عنها) — ومايشوفش شخصيته
    if (isAdmin || solved) v.tm.chars = tm.chars;
    else if (myTeam) v.tm.chars = { [otherTeam(myTeam)]: tm.chars[otherTeam(myTeam)] };
    else v.tm.chars = {};
  }

  if (room.game === 'annab' && room.an) {
    const an = room.an;
    const solved = room.phase === 'solved';
    v.an = {
      q: an.q,
      cat: an.cat,
      options: an.options,
      subPhase: an.subPhase,
      buzzedTeam: an.buzzedTeam,
      firstWrongTeam: an.firstWrongTeam,
      attempt: an.attempt,
      eliminated: an.eliminated,
      picks: an.picks,
      winner: an.winner,
      suggestions: isAdmin ? an.suggestions : myTeam ? (an.suggestions && an.suggestions[myTeam]) || {} : {}
    };
    if (isAdmin || solved) {
      v.an.correctId = an.correctId;
      v.an.truth = an.truth;
    }
  }
  return v;
}

function send(client, room) {
  try { client.res.write(`data: ${JSON.stringify(viewFor(room, client.pid))}\n\n`); } catch (e) {}
}
function broadcast(room) {
  room.touched = Date.now();
  room.seq = (room.seq || 0) + 1;
  for (const c of room.clients) send(c, room);
}

// ============================================================
// الأكشنز
// ============================================================
function authAdmin(room, b) { return room.admin.pid === b.pid && room.admin.secret === b.secret; }
function authPlayer(room, b) { const p = room.players[b.pid]; return p && p.secret === b.secret ? p : null; }

const ERR = (m) => { const e = new Error(m); e.user = true; throw e; };

async function handleAction(b) {
  const action = b.action;

  if (action === 'create_room') {
    const game = ['karak', 'sahlab', 'tamr', 'annab'].includes(b.game) ? b.game : ERR('اختار اللعبة الأول');
    const profile = { name: clean(b.profile && b.profile.name, 20) || 'الحكم', outfit: clean(b.profile && b.profile.outfit, 30), face: clean(b.profile && b.profile.face, 30), hat: clean(b.profile && b.profile.hat, 30) };
    const custom = sanitizeCustom(b.customPack);
    const settings = sanitizeSettings(game, b.settings);
    if (settings.useCustom && !custom.length) ERR('اكتب أسئلة الكاستم الأول');
    if ((game === 'karak' || game === 'annab') && settings.useCustom && custom.length < 1) ERR('محتاج سؤال واحد على الأقل');
    const room = createRoom({ pid: clean(b.pid, 40), secret: clean(b.secret, 40), profile }, game, settings, custom);
    startAiPrefetch(room);
    return { room };
  }

  const room = ROOMS.get(clean(b.code, 10).toUpperCase());
  if (!room) ERR('الغرفة دي مش موجودة أو اتقفلت');
  room.touched = Date.now();
  const admin = authAdmin(room, b);

  // ---------- انضمام لاعب ----------
  if (action === 'join') {
    if (room.kicked.has(b.pid)) ERR('الحكم طلعك من الغرفة دي');
    if (room.admin.pid === b.pid) return { room };
    const prof = b.profile || {};
    const existing = room.players[b.pid];
    if (existing && existing.secret !== b.secret) ERR('هوية غير صحيحة');
    if (!existing && Object.keys(room.players).length >= MAX_PLAYERS) ERR(`الغرفة كاملة (${MAX_PLAYERS} لاعب)`);
    const p = existing || { id: clean(b.pid, 40), secret: clean(b.secret, 40), team: null, conns: 0 };
    p.name = clean(prof.name, 20) || p.name || 'لاعب';
    p.outfit = clean(prof.outfit, 30) || p.outfit;
    p.face = clean(prof.face, 30) || p.face;
    p.hat = clean(prof.hat, 30) || p.hat;
    room.players[p.id] = p;
    event(room, 'join', { name: p.name });
    return { room };
  }

  if (action === 'pick_team') {
    const p = authPlayer(room, b) || ERR('ادخل الغرفة الأول');
    if (!['A', 'B'].includes(b.team)) ERR('فريق غير صحيح');
    if (p.team !== b.team) assertTeamRoom(room, b.team, p.id);
    const old = p.team;
    p.team = b.team;
    if (old && old !== b.team) ensureCaptain(room, old);
    ensureCaptain(room, b.team);
    return { room };
  }

  // ---------- أكشنز اللاعبين أثناء اللعب ----------
  const p = authPlayer(room, b);
  if (p && action.startsWith('kr_') && room.game === 'karak' && room.kr) {
    const kr = room.kr;
    const t = p.team;
    if (!t) ERR('اختار فريق الأول');
    if (action === 'kr_suggest' && room.phase === 'write') {
      const txt = clean(b.text, 60);
      if (txt && Q.normalizeAr(txt) === Q.normalizeAr(kr.truth)) ERR('دي الإجابة الصح! اكتب حاجة تانية تخدع بيها');
      if (txt) kr.suggestions[t][p.id] = txt; else delete kr.suggestions[t][p.id];
      return { room };
    }
    if (action === 'kr_submit_bluff' && room.phase === 'write') {
      if (!isCaptain(room, p.id)) ERR('القائد بس هو اللي يبعت إجابة الفريق');
      const txt = clean(b.text, 60);
      if (!txt) ERR('اكتب إجابة الأول');
      if (Q.normalizeAr(txt) === Q.normalizeAr(kr.truth)) ERR('دي الإجابة الصح! اكتبوا حاجة تانية');
      kr.teamBluff[t] = txt;
      kr.teamBluffBy[t] = p.id;
      kr.autoFilled[t] = false;
      karakCheckWriteDone(room);
      return { room };
    }
    if (action === 'kr_vote_suggest' && room.phase === 'vote') {
      const o = kr.options.find((x) => x.id === b.opt);
      if (!o || o.src === t) ERR('ماينفعش تختار إجابة فريقك');
      kr.voteSuggest[t][p.id] = o.id;
      return { room };
    }
    if (action === 'kr_vote_submit' && room.phase === 'vote') {
      if (!isCaptain(room, p.id)) ERR('القائد بس هو اللي يأكد الاختيار');
      const o = kr.options.find((x) => x.id === b.opt);
      if (!o || o.src === t) ERR('ماينفعش تختار إجابة فريقك');
      kr.votes[t] = o.id;
      if (kr.votes.A && kr.votes.B) karakReveal(room);
      return { room };
    }
    ERR('مش وقته دلوقتي');
  }
  if (p && (action === 'sh_guess' || action === 'sh_suggest') && room.game === 'sahlab' && room.sh && room.phase === 'play') {
    const sh = room.sh;
    if (!p.team) ERR('اختار فريق الأول');
    if (sh.frozen[p.team]) ERR('فريقكم متجمد لحد التلميح الجاي');
    if (action === 'sh_suggest') {
      const txt = clean(b.text, 60);
      if (!sh.suggestions) sh.suggestions = { A: {}, B: {} };
      if (txt) sh.suggestions[p.team][p.id] = txt; else delete sh.suggestions[p.team][p.id];
      return { room };
    }
    if (!isCaptain(room, p.id)) ERR('القائد بس هو اللي يبعت التخمين');
    if (sh.pending[p.team]) ERR('مستنيين حكم الحكم على تخمينكم');
    const txt = clean(b.text, 60) || ERR('اكتب التخمين');
    sh.pending[p.team] = txt;
    if (sahlabMatches(sh, txt)) sahlabJudge(room, p.team, true);
    else event(room, 'guess', { team: p.team, text: txt });
    return { room };
  }
  if (p && action.startsWith('tm_') && room.game === 'tamr' && room.tm && room.phase === 'play') {
    const tm = room.tm;
    if (!p.team) ERR('اختار فريق الأول');
    if (action === 'tm_suggest') {
      const txt = clean(b.text, 60);
      if (!tm.suggestions) tm.suggestions = { A: {}, B: {} };
      if (txt) tm.suggestions[p.team][p.id] = txt; else delete tm.suggestions[p.team][p.id];
      return { room };
    }
    if (!isCaptain(room, p.id)) ERR('القائد بس');
    const active = tm.golden || tm.turn;
    if (p.team !== active) ERR('مش دوركم');
    if (action === 'tm_pass') {
      if (tm.golden) ERR('استخدموا الفرصة الذهبية الأول');
      tm.turn = otherTeam(tm.turn);
      tm.lastTick = Date.now();
      event(room, 'turn', { team: tm.turn });
      return { room };
    }
    if (action === 'tm_guess') {
      if (tm.pending) ERR('في تخمين مستني الحكم');
      const txt = clean(b.text, 60) || ERR('اكتب اسم الشخصية');
      tm.pending = { team: p.team, text: txt };
      tm.lastTick = Date.now();
      if (tamrMatches(tm.chars[p.team].name, txt)) tamrJudge(room, true);
      else event(room, 'guess', { team: p.team, text: txt });
      return { room };
    }
  }
  if (p && action.startsWith('an_') && room.game === 'annab' && room.an && room.phase === 'play') {
    const an = room.an;
    if (!p.team) ERR('اختار فريق الأول');
    if (action === 'an_suggest') {
      const o = an.options.find((x) => x.id === b.opt);
      if (!o || an.eliminated.includes(o.id)) ERR('الاختيار ده مش متاح');
      if (!an.suggestions) an.suggestions = { A: {}, B: {} };
      an.suggestions[p.team][p.id] = o.id;
      return { room };
    }
    if (action === 'an_buzz') {
      if (!isCaptain(room, p.id)) ERR('قائد الفريق بس هو اللي بيدوس زرار الباز');
      if (an.subPhase !== 'buzz' || an.buzzedTeam) ERR(`${(room.teams.find((x) => x.id === an.buzzedTeam) || {}).name || 'الفريق التاني'} سبق وداس الباز!`);
      an.buzzedTeam = p.team;
      an.attempt = 1;
      an.subPhase = 'answer';
      setDeadline(room, room.settings.buzzSec);
      event(room, 'buzz', { team: p.team });
      return { room };
    }
    if (action === 'an_pick') {
      if (!isCaptain(room, p.id)) ERR('قائد الفريق بس هو اللي بيختار الإجابة');
      if (an.subPhase === 'buzz' || !an.buzzedTeam) ERR('دوس زرار الباز الأول!');
      if (p.team !== an.buzzedTeam) ERR('مش دور فريقكم في الإجابة دلوقتي');
      const opt = an.options.find((x) => x.id === b.opt);
      if (!opt || an.eliminated.includes(opt.id)) ERR('الاختيار ده مش متاح');
      annabHandlePick(room, p.team, opt);
      return { room };
    }
  }

  // ---------- أكشنز الحكم ----------
  if (!admin) ERR('الأكشن ده للحكم بس');

  switch (action) {
    case 'toggle_secret': {
      room.settings.hideSecret = b.hideSecret !== undefined ? !!b.hideSecret : !room.settings.hideSecret;
      break;
    }
    case 'update_lobby': {
      if (room.status === 'playing') ERR('انهي الجولة الحالية الأول عشان تغير اللعبة أو الإعدادات');
      room.status = 'lobby';
      room.phase = null;
      if (room.sh && room.sh.autoHintTimer) clearTimeout(room.sh.autoHintTimer);
      room.kr = room.sh = room.tm = room.an = null;
      room.round = -1;
      setDeadline(room, 0);
      room.paused = false;

      const oldGame = room.game;
      if (['karak', 'sahlab', 'tamr', 'annab'].includes(b.game)) room.game = b.game;
      if (b.customPack !== undefined) room.customPack = sanitizeCustom(b.customPack);

      const merged = { ...room.settings, ...(b.settings || {}) };
      if (room.game !== oldGame && (!b.settings || b.settings.categories === undefined)) {
        merged.categories = [];
      }
      if (room.game === 'annab' && room.game !== oldGame && (!b.settings || b.settings.count === undefined)) {
        merged.count = 20;
      }
      room.settings = sanitizeSettings(room.game, merged);
      if (b.settings && Array.isArray(b.settings.teamNames)) {
        room.teams[0].name = clean(b.settings.teamNames[0], 24) || room.teams[0].name;
        room.teams[1].name = clean(b.settings.teamNames[1], 24) || room.teams[1].name;
      }
      startAiPrefetch(room);
      if (room.game !== oldGame) event(room, 'game_changed', { game: room.game });
      break;
    }
    case 'set_captain': {
      const target = room.players[b.target];
      if (!target || !target.team) ERR('اللاعب مش في فريق');
      room.teams.find((t) => t.id === target.team).captainId = target.id;
      break;
    }
    case 'move_player': {
      const target = room.players[b.target] || ERR('لاعب غير موجود');
      const old = target.team;
      const dest = ['A', 'B'].includes(b.team) ? b.team : otherTeam(old || 'B');
      if (dest !== old) assertTeamRoom(room, dest, target.id);
      target.team = dest;
      if (old) ensureCaptain(room, old);
      ensureCaptain(room, target.team);
      break;
    }
    case 'kick': {
      const target = room.players[b.target] || ERR('لاعب غير موجود');
      const old = target.team;
      delete room.players[target.id];
      if (!target.isTest) room.kicked.add(target.id);
      if (old) ensureCaptain(room, old);
      break;
    }
    case 'rename_team': {
      if (room.status === 'playing') ERR('الإعدادات مقفولة أثناء اللعب');
      const t = room.teams.find((x) => x.id === b.team);
      if (t) t.name = clean(b.name, 24) || t.name;
      break;
    }
    case 'add_test_player': {
      if (Object.keys(room.players).length >= MAX_PLAYERS) ERR(`الغرفة كاملة (${MAX_PLAYERS} لاعب)`);
      if (['A', 'B'].includes(b.team)) assertTeamRoom(room, b.team, null);
      const n = Object.values(room.players).filter((x) => x.isTest).length + 1;
      const parts = b.parts || {};
      const id = 'test_' + rid(4);
      room.players[id] = { id, secret: rid(8), name: 'لاعب تجريبي ' + n, outfit: parts.outfit, face: parts.face, hat: parts.hat, team: ['A', 'B'].includes(b.team) ? b.team : null, isTest: true, conns: 0 };
      if (room.players[id].team) ensureCaptain(room, room.players[id].team);
      break;
    }
    case 'start_game': {
      if (room.status === 'playing') ERR('اللعبة شغالة بالفعل');
      for (const t of room.teams) if (!teamMembers(room, t.id).length) ERR(`${t.name} لسه فاضي — محتاج لاعب واحد على الأقل في كل فريق`);
      if (room.settings.useCustom && !room.customPack.length) ERR('اكتب أسئلة الكاستم الأول أو اختار بنك الأسئلة');
      if (room.settings.useCustom && room.game === 'tamr' && room.customPack.length < 2) ERR('تمر هندي محتاج شخصيتين على الأقل في الكاستم');
      room.teams.forEach((t) => ensureCaptain(room, t.id));
      await startGame(room);
      break;
    }
    case 'pause': {
      if (room.status !== 'playing') break;
      if (room.pausedLeft == null) {
        room.pausedLeft = room.deadline ? Math.max(0, room.deadline - Date.now()) : 0;
        room.deadline = null;
        room.paused = true;
      } else {
        room.deadline = room.pausedLeft ? Date.now() + room.pausedLeft : null;
        room.pausedLeft = null;
        room.paused = false;
        if (room.tm) room.tm.lastTick = Date.now();
      }
      break;
    }
    case 'adjust_score': {
      const d = Math.round(Number(b.delta) || 0);
      if (!d || Math.abs(d) > 100) ERR('قيمة غير مسموحة');
      const teamId = b.team === 'B' ? 'B' : 'A';
      addScore(room, teamId, d);
      const t = room.teams.find((x) => x.id === teamId);
      event(room, 'adjust', { team: teamId, delta: d, score: t ? t.score : 0 });
      break;
    }
    case 'end_to_lobby': {
      if (room.sh && room.sh.autoHintTimer) clearTimeout(room.sh.autoHintTimer);
      room.status = 'lobby';
      room.phase = null;
      room.kr = room.sh = room.tm = room.an = null;
      room.round = -1;
      setDeadline(room, 0);
      room.paused = false;
      room.teams.forEach((t) => (t.score = 0));
      startAiPrefetch(room);
      event(room, 'lobby', {});
      break;
    }
    case 'close_room': {
      if (room.sh && room.sh.autoHintTimer) clearTimeout(room.sh.autoHintTimer);
      event(room, 'closed');
      room.status = 'closed';
      broadcast(room);
      ROOMS.delete(room.code);
      return { closed: true };
    }

    // كرك
    case 'kr_admin_bluff': {
      if (!room.kr || !['write', 'review'].includes(room.phase)) ERR('مش وقته');
      const txt = clean(b.text, 60);
      if (txt && Q.normalizeAr(txt) === Q.normalizeAr(room.kr.truth)) ERR('دي الإجابة الصح نفسها');
      room.kr.adminBluff = txt;
      break;
    }
    case 'kr_regen_ai': {
      if (!room.kr || !['write', 'review'].includes(room.phase)) ERR('مش وقته');
      const i = Number(b.index) === 1 ? 1 : 0;
      room.kr.aiBluffs[i] = spareBluff(room, [room.kr.truth, ...room.kr.aiBluffs, room.kr.teamBluff.A, room.kr.teamBluff.B, room.kr.adminBluff]);
      break;
    }
    case 'kr_reject': {
      if (!room.kr || room.phase !== 'review') ERR('مش وقته');
      const t = b.team === 'B' ? 'B' : 'A';
      room.kr.teamBluff[t] = '';
      room.kr.autoFilled[t] = false;
      room.phase = 'write';
      setDeadline(room, 30);
      event(room, 'rejected', { team: t });
      break;
    }
    case 'kr_publish': {
      if (!room.kr || !['review', 'write'].includes(room.phase)) ERR('مش وقته');
      if (room.phase === 'write') karakWriteTimeout(room);
      karakPublish(room);
      break;
    }
    case 'kr_force_reveal': {
      if (!room.kr || room.phase !== 'vote') ERR('مش وقته');
      karakReveal(room);
      break;
    }

    // سحلب
    case 'sh_judge': {
      if (!room.sh || room.phase !== 'play') ERR('مش وقته');
      sahlabJudge(room, b.team === 'B' ? 'B' : 'A', !!b.correct);
      break;
    }
    case 'sh_toggle_freeze': {
      if (!room.sh || room.phase !== 'play') ERR('مش وقته');
      const t = b.team === 'B' ? 'B' : 'A';
      room.sh.frozen[t] = b.frozen !== undefined ? !!b.frozen : !room.sh.frozen[t];
      if (room.sh.frozen[t]) {
        room.sh.pending[t] = null;
        const bothFrozen = !!(room.sh.frozen.A && room.sh.frozen.B);
        event(room, 'wrong', { team: t, bothFrozen });
        if (bothFrozen) sahlabScheduleBothFrozen(room);
      } else {
        if (room.sh.autoHintTimer) { clearTimeout(room.sh.autoHintTimer); room.sh.autoHintTimer = null; }
        event(room, 'unfrozen', { team: t });
      }
      break;
    }
    case 'sh_next_hint': {
      if (!room.sh || room.phase !== 'play') ERR('مش وقته');
      sahlabNextHint(room);
      break;
    }

    // تمر هندي
    case 'tm_judge': {
      if (!room.tm || room.phase !== 'play') ERR('مش وقته');
      tamrJudge(room, !!b.correct);
      break;
    }
    case 'tm_force_pass': {
      if (!room.tm || room.phase !== 'play') ERR('مش وقته');
      room.tm.golden = null;
      room.tm.turn = otherTeam(room.tm.turn);
      room.tm.lastTick = Date.now();
      event(room, 'turn', { team: room.tm.turn });
      break;
    }
    case 'tm_penalty': {
      if (!room.tm || room.phase !== 'play') ERR('مش وقته');
      const t = b.team === 'B' ? 'B' : 'A';
      room.tm.clocks[t] = Math.max(0, room.tm.clocks[t] - 15);
      room.tm.lastTick = Date.now();
      event(room, 'penalty', { team: t, left: room.tm.clocks[t] });
      if (room.tm.clocks[t] === 0) tamrSolve(room, otherTeam(t), POINTS.tamr.timeout, 'timeout');
      break;
    }
    case 'tm_end_golden': {
      if (!room.tm) ERR('مش وقته');
      room.tm.golden = null;
      room.tm.lastTick = Date.now();
      break;
    }

    // عنّاب
    case 'an_reset_buzz': {
      if (!room.an) ERR('مش وقته');
      room.phase = 'play';
      room.an.subPhase = 'buzz';
      room.an.buzzedTeam = null;
      room.an.attempt = 0;
      room.an.eliminated = [];
      room.an.picks = [];
      room.an.winner = null;
      room.an.suggestions = { A: {}, B: {} };
      setDeadline(room, 0);
      event(room, 'an_reset', {});
      break;
    }
    case 'an_pass_turn': {
      if (!room.an || room.phase !== 'play') ERR('مش وقته');
      const nextTeam = otherTeam(room.an.buzzedTeam || 'A');
      room.an.buzzedTeam = nextTeam;
      room.an.attempt = room.an.attempt === 1 ? 2 : 1;
      room.an.subPhase = room.an.attempt === 2 ? 'steal' : 'answer';
      setDeadline(room, room.settings.buzzSec);
      event(room, 'turn', { team: nextTeam });
      break;
    }
    case 'an_reveal': {
      if (!room.an) ERR('مش وقته');
      room.phase = 'solved';
      setDeadline(room, 0);
      break;
    }

    case 'next': {
      if (room.status !== 'playing') ERR('مش وقته');
      const ok = (room.game === 'karak' && room.phase === 'reveal') || (room.game !== 'karak' && room.phase === 'solved');
      if (!ok) ERR('خلص الجولة الأول');
      room.paused = false;
      await nextRound(room);
      break;
    }
    default:
      ERR('أكشن غير معروف');
  }
  return { room };
}

// ============================================================
// HTTP
// ============================================================
function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 1e6) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch (e) { resolve({}); } });
    req.on('error', () => resolve({}));
  });
}
function json(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(obj));
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  let p = decodeURI(parsed.pathname || '/');

  if (p === '/api/action' && req.method === 'POST') {
    const b = await readBody(req);
    try {
      const out = await handleAction(b);
      if (out.room) broadcast(out.room);
      const pid = clean(b.pid, 40);
      return json(res, 200, { ok: true, code: out.room ? out.room.code : null, view: out.room ? viewFor(out.room, pid) : null });
    } catch (e) {
      if (!e.user) console.error(e);
      return json(res, 200, { ok: false, error: e.user ? e.message : 'حصلت مشكلة، جرب تاني' });
    }
  }

  if (p === '/api/state') {
    const code = clean(parsed.query.code, 10).toUpperCase();
    const room = ROOMS.get(code);
    const pid = clean(parsed.query.pid, 40);
    if (!room) return json(res, 404, { ok: false, error: 'الغرفة مش موجودة' });
    return json(res, 200, { ok: true, view: viewFor(room, pid) });
  }

  if (p === '/api/stream') {
    const code = clean(parsed.query.code, 10).toUpperCase();
    const room = ROOMS.get(code);
    const pid = clean(parsed.query.pid, 40);
    const secret = clean(parsed.query.secret, 40);
    if (!room) return json(res, 404, { ok: false, error: 'الغرفة مش موجودة' });
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no'
    });
    if (res.socket && typeof res.socket.setNoDelay === 'function') res.socket.setNoDelay(true);
    const isAdm = room.admin.pid === pid && room.admin.secret === secret;
    const pl = room.players[pid] && room.players[pid].secret === secret ? room.players[pid] : null;
    const who = isAdm ? room.admin : pl;
    if (who) who.conns = (who.conns || 0) + 1;
    const client = { res, pid: who ? pid : 'guest_' + rid(3) };
    room.clients.add(client);
    broadcast(room);
    const ka = setInterval(() => { try { res.write(': ka\n\n'); } catch (e) {} }, 15000);
    req.on('close', () => {
      clearInterval(ka);
      room.clients.delete(client);
      if (who) who.conns = Math.max(0, (who.conns || 1) - 1);
      broadcast(room);
    });
    return;
  }

  if (p === '/api/room-exists') {
    const room = ROOMS.get(clean(parsed.query.code, 10).toUpperCase());
    return json(res, 200, { ok: !!room, game: room && room.game, status: room && room.status });
  }

  if (p === '/api/qr') {
    const room = ROOMS.get(clean(parsed.query.code, 10).toUpperCase());
    const base = getBaseUrl(req);
    const target = room ? `${base}/room/${room.code}` : `${base}/`;
    let svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"></svg>';
    if (QRCode) { try { svg = await QRCode.toString(target, { type: 'svg', margin: 1, color: { dark: '#3B2A1E', light: '#FFFBF2' } }); } catch (e) {} }
    res.writeHead(200, { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'no-store' });
    return res.end(svg);
  }

  if (p === '/api/stats') return json(res, 200, { ok: true, banks: Q.stats(), lan: `http://${LAN_IP}:${PORT}` });

  if (p === '/api/img') {
    const u = String(parsed.query.u || '');
    if (!ALLOWED_IMG_HOST.test(u)) { res.writeHead(404); return res.end(); }
    const entry = await fetchImageBytes(u);
    if (!entry) { res.writeHead(404); return res.end(); }
    res.writeHead(200, {
      'Content-Type': entry.type,
      'Content-Length': entry.buf.length,
      'Cache-Control': 'public, max-age=86400'
    });
    return res.end(entry.buf);
  }

  if (p === '/' || p.startsWith('/room/')) p = '/index.html';
  const isAsset = p.startsWith('/assets/') && !p.includes('..');
  if (!PUBLIC_FILES.has(p) && !isAsset) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('Not found'); }
  const fp = path.join(BASE_DIR, p);
  fs.stat(fp, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(fp).toLowerCase()] || 'application/octet-stream', 'Cache-Control': isAsset ? 'public, max-age=3600' : 'no-store' });
    fs.createReadStream(fp).pipe(res);
  });
});

// تحضير روابط صور كل بنوك الأسئلة في الخلفية عند تشغيل السيرفر
setImmediate(() => {
  const allImgItems = [...(Q.BANKS.sahlab || []), ...(Q.BANKS.tamr || [])].filter((x) => x && x.imageQuery);
  warmQueueImages(allImgItems, 0).catch(() => {});
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Ala El-Ahwa v15 running at http://localhost:${PORT}  |  LAN: http://${LAN_IP}:${PORT}`);
  console.log('Question banks:', JSON.stringify(Q.stats()));
});
