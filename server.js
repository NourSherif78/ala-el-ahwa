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
    const rawHost = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
    const rawProto = String(req.headers['x-forwarded-proto'] || 'http').split(',')[0].trim().toLowerCase();
    if (/^[A-Za-z0-9.-]+(:\d{1,5})?$/.test(rawHost)) {
      const proto = rawProto === 'https' ? 'https' : 'http';
      return `${proto}://${rawHost}`;
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
const ALL_TEAM_IDS = ['A', 'B', 'C', 'D'];
const SOLO_IDS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10'];
const MAX_SOLO = 10;
const DEFAULT_TEAM_NAMES = ['فريق الكرك', 'فريق السحلب', 'فريق العنّاب', 'فريق التمر هندي'];
const POINTS = {
  karak: { truth: 10, fooled: 5, houseBluff: -5 },
  sahlab: [10, 8, 6, 4, 2],
  tamr: { guess: 20, timeout: 10 },
  annab: { first: 10, steal: 5 }
};
const DEFAULT_SETTINGS = {
  playMode: 'teams', // 'teams' | 'solo'
  difficulty: 'medium', // 'easy' | 'medium' | 'hard'
  count: 10,
  categories: [],
  useCustom: false,
  writeSec: 60,
  voteSec: 30,
  hintSec: 30,
  chessSec: 180,
  buzzSec: 20,
  hideSecret: false,
  teamCount: 2,
  teamNames: [...DEFAULT_TEAM_NAMES],
  adminPlays: false,
  adminTeam: 'A'
};
const LIMITS = { count: [3, 30], writeSec: [20, 180], voteSec: [15, 120], hintSec: [15, 120], chessSec: [60, 600], buzzSec: [10, 60], teamCount: [2, 4] };

// ============================================================
// درع الحماية الشامل ضد الثغرات (Injection Shield)
// يحمي من: SQLi · XSS · HTMLi · Command Injection · Code Injection · Prompt Injection · SSTI · Prototype Pollution
// ============================================================
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype', 'toString', 'valueOf', 'hasOwnProperty', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__']);

function stripInjections(raw, maxLen = 400) {
  // قص النص قبل تطبيق الـ Regex لمنع هجمات ReDoS (Regular Expression Denial of Service)
  let s = String(raw == null ? '' : raw).slice(0, Math.max(512, maxLen * 4));
  // 1) إزالة محارف التحكم والـ Null Bytes ومحارف التوجيه الخفية
  s = s.replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g, ' ');
  // 2) حماية XSS و HTML Injection (إزالة أي تاجات HTML أو بروتوكولات خبيثة أو Event Handlers)
  s = s.replace(/<[^>]*>/g, '');
  s = s.replace(/[<>`]/g, '');
  s = s.replace(/\b(?:javascript|vbscript|data\s*:\s*text\/html)\s*:/gi, '');
  s = s.replace(/\bon[a-z]{2,20}\s*=/gi, '');
  // 3) حماية Server-Side Template Injection (SSTI) و Code Injection
  s = s.replace(/\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}|\$\{[\s\S]*?\}|<%[\s\S]*?%>|#\{[\s\S]*?\}/g, '');
  s = s.replace(/\b(?:eval|Function|setTimeout|setInterval|setImmediate|require|import)\s*\(/gi, '');
  s = s.replace(/\b(?:process\.env|child_process|globalThis|__proto__|prototype|constructor)\b/gi, '');
  // 4) حماية Command Injection (أوامر النظام والشيل)
  s = s.replace(/\$\([^)]*\)/g, '');
  s = s.replace(/(?:;|\|\||&&|\|)\s*(?:rm|cat|ls|dir|whoami|id|uname|nc|netcat|bash|sh|zsh|cmd|powershell|pwsh|curl|wget|python|node|php|perl|ruby|chmod|chown)\b/gi, '');
  s = s.replace(/\b(?:\/bin\/(?:sh|bash|zsh)|cmd\.exe|powershell\.exe|\/etc\/passwd|\/etc\/shadow)\b/gi, '');
  // 5) حماية SQL Injection (SQLi) و NoSQL Injection
  s = s.replace(/\bUNION\s+(?:ALL\s+)?SELECT\b/gi, '');
  s = s.replace(/\b(?:DROP|ALTER|TRUNCATE)\s+(?:TABLE|DATABASE|USER)\b/gi, '');
  s = s.replace(/\b(?:INSERT\s+INTO|DELETE\s+FROM|UPDATE\s+\w+\s+SET)\b/gi, '');
  s = s.replace(/['"]\s*(?:OR|AND)\s+['"]?\w+['"]?\s*=\s*['"]?\w+/gi, '');
  s = s.replace(/\b(?:xp_cmdshell|SLEEP\s*\(\s*\d+\s*\)|BENCHMARK\s*\(|WAITFOR\s+DELAY|INFORMATION_SCHEMA)\b/gi, '');
  s = s.replace(/\/\*[\s\S]*?\*\/|--\s*$/gm, '');
  // 6) حماية Prompt Injection (اختراق أو خداع الذكاء الاصطناعي بالعربي والإنجليزي)
  s = s.replace(/\b(?:ignore|disregard|forget|override)\s+(?:all\s+|any\s+)?(?:previous|prior|above|system|developer)?\s*(?:instructions|rules|prompts|directives|constraints)\b/gi, '');
  s = s.replace(/\b(?:system\s*prompt|developer\s*message|you\s+are\s+now\s+in\s+developer\s+mode|jailbreak|do\s+anything\s+now)\b/gi, '');
  s = s.replace(/<\|(?:im_start|im_end|system|user|assistant|endoftext)\|>|\[INST\]|\[\/INST\]|<<SYS>>|<\/SYS>>/gi, '');
  s = s.replace(/(?:انسى|تجاهل|الغِ|تخطى)\s+(?:كل\s+|جميع\s+)?(?:التعليمات|الأوامر|القواعد|الإرشادات)\s*(?:السابقة|القديمة|الأولى)?/g, '');
  return s.replace(/\s+/g, ' ').trim();
}

const rid = (n = 8) => crypto.randomBytes(n).toString('hex');
const clamp = (v, [a, b]) => Math.max(a, Math.min(b, Number(v) || a));
const clean = (s, max = 80) => stripInjections(s, max).slice(0, max);
const cleanId = (s, max = 40) => {
  const out = String(s == null ? '' : s).replace(/[^A-Za-z0-9_-]/g, '').slice(0, max);
  return FORBIDDEN_KEYS.has(out) ? '' : out;
};
function safeEqualSecret(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || !a || !b || a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'));
  } catch (e) {
    return false;
  }
}

const SAVED_PACKS_FILE = path.join(BASE_DIR, 'data', 'saved_custom_packs.json');
let SAVED_PACKS = [];
function loadSavedPacks() {
  try {
    const dir = path.dirname(SAVED_PACKS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (fs.existsSync(SAVED_PACKS_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(SAVED_PACKS_FILE, 'utf8'));
      if (Array.isArray(parsed)) SAVED_PACKS = parsed;
    }
  } catch (e) { SAVED_PACKS = []; }
}
function persistSavedPacks() {
  try {
    const dir = path.dirname(SAVED_PACKS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SAVED_PACKS_FILE, JSON.stringify(SAVED_PACKS));
  } catch (e) {}
}
loadSavedPacks();

function hashSecret(secret) {
  return crypto.createHash('sha256').update(String(secret || '')).digest('hex');
}

function makeCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c = '';
  for (let i = 0; i < 6; i++) c += chars[crypto.randomInt(0, chars.length)];
  return c.slice(0, 3) + '-' + c.slice(3);
}

const WIKI_UA = 'AlaElAhwa/15 (https://ala-el-ahwa.onrender.com; contact@alaelahwa.com)';
const ALLOWED_WIKI_API = /^https:\/\/(en\.wikipedia\.org|ar\.wikipedia\.org|commons\.wikimedia\.org)\/w\/api\.php\?/i;

function fetchJson(target, timeoutMs = 6500, redirectsLeft = 4) {
  if (!ALLOWED_WIKI_API.test(target)) return Promise.resolve(null);
  return new Promise((resolve) => {
    const req = https.get(target, { headers: { 'User-Agent': WIKI_UA, Accept: 'application/json' }, timeout: timeoutMs }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirectsLeft > 0) {
        res.resume();
        const nextUrl = new URL(res.headers.location, target).href;
        if (!ALLOWED_WIKI_API.test(nextUrl)) return resolve(null);
        return fetchJson(nextUrl, timeoutMs, redirectsLeft - 1).then(resolve);
      }
      let raw = '';
      res.on('data', (c) => {
        if (raw.length <= 2 * 1024 * 1024) raw += c;
      });
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
const SAFE_IMG_MIME = /^image\/(jpeg|jpg|png|webp|gif|avif)\b/i;

function fetchImageBytes(target, timeoutMs = 8000, redirectsLeft = 5) {
  if (!ALLOWED_IMG_HOST.test(target)) return Promise.resolve(null);
  if (IMG_BYTES_CACHE.has(target)) return Promise.resolve(IMG_BYTES_CACHE.get(target));
  if (IMG_INFLIGHT.has(target)) return IMG_INFLIGHT.get(target);
  const job = new Promise((resolve) => {
    const req = https.get(target, { headers: { 'User-Agent': WIKI_UA, Accept: 'image/webp,image/png,image/jpeg,*/*;q=0.5' }, timeout: timeoutMs }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirectsLeft > 0) {
        res.resume();
        const nextUrl = new URL(res.headers.location, target).href;
        return fetchImageBytes(nextUrl, timeoutMs, redirectsLeft - 1).then(resolve);
      }
      const ct = String(res.headers['content-type'] || '').toLowerCase().split(';')[0].trim();
      if (res.statusCode !== 200 || !SAFE_IMG_MIME.test(ct)) {
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

function newTeams(names, teamCount = 2) {
  const n = clamp(teamCount, LIMITS.teamCount);
  const arr = Array.isArray(names) ? names : [];
  return ALL_TEAM_IDS.slice(0, n).map((id, i) => ({
    id,
    name: clean(arr[i], 24) || DEFAULT_TEAM_NAMES[i] || `الفريق ${id}`,
    captainId: null,
    score: 0
  }));
}

function teamIds(room) {
  return room.teams.map((t) => t.id);
}

function validTeamId(room, id) {
  const ids = teamIds(room);
  return ids.includes(id) ? id : ids[0] || 'A';
}

function nextTeamId(room, curId) {
  const ids = teamIds(room);
  const idx = ids.indexOf(curId);
  return ids[(idx + 1) % ids.length] || ids[0] || 'A';
}

function clearRoomTimers(room) {
  if (room.sh && room.sh.autoHintTimer) { clearTimeout(room.sh.autoHintTimer); room.sh.autoHintTimer = null; }
  if (room.autoNextTimer) { clearTimeout(room.autoNextTimer); room.autoNextTimer = null; }
}

function scheduleAutoNext(room, sec = 6) {
  if (!room.aiJudge) return;
  if (room.autoNextTimer) clearTimeout(room.autoNextTimer);
  setDeadline(room, sec);
  room.autoNextTimer = setTimeout(async () => {
    room.autoNextTimer = null;
    if (room.status !== 'playing') return;
    const readyForNext = (room.game === 'karak' && room.phase === 'reveal') || (room.game !== 'karak' && room.phase === 'solved');
    if (!readyForNext) return;
    room.paused = false;
    await nextRound(room);
    broadcast(room);
  }, sec * 1000);
}

function isSoloMode(room) {
  return Boolean(room && room.settings && room.settings.playMode === 'solo');
}

function syncSoloTeams(room) {
  if (!isSoloMode(room)) return;
  const oldScoreByCap = {};
  (room.teams || []).forEach((t) => {
    if (t.captainId) oldScoreByCap[t.captainId] = t.score || 0;
  });
  const playersList = Object.values(room.players).slice(0, MAX_SOLO);
  room.teams = playersList.map((p, i) => {
    const sid = SOLO_IDS[i] || ('S' + (i + 1));
    p.team = sid;
    if (p.id === room.admin.pid) {
      room.admin.playingTeam = sid;
      room.settings.adminTeam = sid;
    }
    return {
      id: sid,
      name: clean(p.name, 24) || `لاعب ${i + 1}`,
      captainId: p.id,
      score: oldScoreByCap[p.id] || 0,
      isSolo: true
    };
  });
}

function syncAdminPlaying(room, adminPlays, adminTeam) {
  if (adminPlays) {
    const tId = isSoloMode(room)
      ? 'S1'
      : validTeamId(room, adminTeam || room.admin.playingTeam || room.settings.adminTeam || 'A');
    room.aiJudge = true;
    room.admin.playingTeam = tId;
    room.settings.adminPlays = true;
    room.settings.adminTeam = tId;
    const prof = room.admin.profile || {};
    const existing = room.players[room.admin.pid];
    const oldTeam = existing ? existing.team : null;
    room.players[room.admin.pid] = {
      id: room.admin.pid,
      secret: room.admin.secret,
      name: prof.name || 'الحكم',
      outfit: prof.outfit,
      face: prof.face,
      hat: prof.hat,
      team: tId,
      isHostPlayer: true,
      conns: room.admin.conns || 1
    };
    if (isSoloMode(room)) {
      syncSoloTeams(room);
    } else {
      if (oldTeam && oldTeam !== tId) ensureCaptain(room, oldTeam);
      ensureCaptain(room, tId);
    }
  } else {
    const oldTeam = room.admin.playingTeam || (room.players[room.admin.pid] && room.players[room.admin.pid].team);
    room.aiJudge = false;
    room.admin.playingTeam = null;
    room.settings.adminPlays = false;
    delete room.players[room.admin.pid];
    if (isSoloMode(room)) {
      syncSoloTeams(room);
    } else if (oldTeam) {
      ensureCaptain(room, oldTeam);
    }
  }
}

function syncRoomTeams(room, teamCount, teamNames) {
  if (isSoloMode(room)) {
    syncSoloTeams(room);
    return;
  }
  const n = clamp(teamCount ?? room.settings.teamCount ?? room.teams.length, LIMITS.teamCount);
  room.settings.teamCount = n;
  if (Array.isArray(teamNames)) {
    room.settings.teamNames = ALL_TEAM_IDS.map((_, i) => clean(teamNames[i], 24) || room.settings.teamNames[i] || DEFAULT_TEAM_NAMES[i]);
  }
  const activeIds = ALL_TEAM_IDS.slice(0, n);
  const oldMap = Object.fromEntries(room.teams.map((t) => [t.id, t]));
  room.teams = activeIds.map((id, i) => {
    if (oldMap[id] && !oldMap[id].isSolo) {
      oldMap[id].name = room.settings.teamNames[i] || oldMap[id].name;
      return oldMap[id];
    }
    return { id, name: room.settings.teamNames[i] || DEFAULT_TEAM_NAMES[i], captainId: null, score: 0 };
  });
  let idx = 0;
  for (const p of Object.values(room.players)) {
    if (p.team && !activeIds.includes(p.team)) {
      if (p.id === room.admin.pid) {
        p.team = activeIds[0];
        room.admin.playingTeam = activeIds[0];
        room.settings.adminTeam = activeIds[0];
      } else if (SOLO_IDS.includes(p.team)) {
        // لو كان في وضع فردي واتحول لفرق، نوزع اللاعبين على الفرق بالتساوي
        p.team = activeIds[idx % activeIds.length];
        idx++;
      } else {
        p.team = null;
      }
    }
  }
  room.teams.forEach((t) => ensureCaptain(room, t.id));
}

const MAX_ROOMS = 500;
function createRoom(admin, game, settings, customPack) {
  if (ROOMS.size >= MAX_ROOMS) {
    let victimCode = null;
    let oldestTouch = Infinity;
    for (const [k, r] of ROOMS) {
      if ((!r.clients || r.clients.size === 0) && (r.touched || 0) < oldestTouch) {
        oldestTouch = r.touched || 0;
        victimCode = k;
      }
    }
    if (victimCode) {
      const vr = ROOMS.get(victimCode);
      if (vr) clearRoomTimers(vr);
      ROOMS.delete(victimCode);
    } else {
      ERR('السيرفر وصل للحد الأقصى من الغرف النشطة حالياً، جرب بعد دقيقة');
    }
  }
  let code = makeCode();
  while (ROOMS.has(code)) code = makeCode();
  const room = {
    code,
    seq: 1,
    inviteUrl: `http://${LAN_IP}:${PORT}/room/${code}`,
    admin: { pid: admin.pid, secret: admin.secret, profile: admin.profile, playingTeam: null },
    aiJudge: false,
    game,
    settings,
    customPack,
    status: 'lobby', // lobby | playing | finished
    teams: settings.playMode === 'solo' ? [] : newTeams(settings.teamNames, settings.teamCount),
    players: {},
    kicked: new Set(),
    queue: [],
    round: -1,
    phase: null,
    deadline: null,
    pausedLeft: null,
    kr: null, sh: null, tm: null, an: null,
    autoNextTimer: null,
    lastEvent: null,
    clients: new Set(),
    touched: Date.now()
  };
  if (settings.adminPlays) {
    syncAdminPlaying(room, true, settings.adminTeam || 'A');
  }
  if (settings.playMode === 'solo') {
    syncSoloTeams(room);
  }
  ROOMS.set(code, room);
  return room;
}

function sanitizeSettings(game, s = {}) {
  const out = { ...DEFAULT_SETTINGS, teamNames: [...DEFAULT_TEAM_NAMES] };
  out.playMode = s.playMode === 'solo' ? 'solo' : 'teams';
  out.difficulty = ['easy', 'medium', 'hard'].includes(s.difficulty) ? s.difficulty : 'medium';
  const defCount = game === 'annab' ? 20 : out.count;
  out.count = clamp(s.count ?? defCount, LIMITS.count);
  out.writeSec = clamp(s.writeSec ?? out.writeSec, LIMITS.writeSec);
  out.voteSec = clamp(s.voteSec ?? out.voteSec, LIMITS.voteSec);
  out.hintSec = clamp(s.hintSec ?? out.hintSec, LIMITS.hintSec);
  out.chessSec = clamp(s.chessSec ?? out.chessSec, LIMITS.chessSec);
  out.buzzSec = clamp(s.buzzSec ?? out.buzzSec, LIMITS.buzzSec);
  out.hideSecret = !!s.hideSecret;
  out.teamCount = clamp(s.teamCount ?? out.teamCount, LIMITS.teamCount);
  out.categories = Array.isArray(s.categories) ? s.categories.map((c) => clean(c, 24)).slice(0, 30) : [];
  out.useCustom = !!s.useCustom;
  out.ai = s.ai === undefined ? true : !!s.ai;
  out.adminPlays = !!s.adminPlays;
  out.adminTeam = ALL_TEAM_IDS.includes(s.adminTeam) ? s.adminTeam : 'A';
  if (Array.isArray(s.teamNames)) {
    out.teamNames = ALL_TEAM_IDS.map((_, i) => clean(s.teamNames[i], 24) || DEFAULT_TEAM_NAMES[i]);
  }
  return out;
}

function cleanPhoto(raw) {
  const s = String(raw == null ? '' : raw).trim();
  if (!s || s.length > 350000) return '';
  if (/^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=\s]+$/i.test(s)) {
    return s.replace(/\s+/g, '');
  }
  return '';
}

function sanitizeCustom(list, game = 'karak') {
  if (!Array.isArray(list)) return [];
  let totalPhotoBytes = 0;
  return list
    .slice(0, 50)
    .map((x) => {
      if (!x || typeof x !== 'object') return null;
      const q = clean(x.q, 220);
      const truth = clean(x.truth || x.answer || x.name, 80);
      const rawHints = Array.isArray(x.hints) ? x.hints.slice(0, 5).map((h) => clean(h, 220)) : [];
      const nonEmptyHints = rawHints.filter(Boolean);
      const hints = nonEmptyHints.length ? nonEmptyHints : (q ? [q] : []);
      const bluffs = Array.isArray(x.bluffs) ? x.bluffs.map((b) => clean(b, 60)).filter(Boolean).slice(0, 3) : [];
      let photo = cleanPhoto(x.photo);
      if (photo) {
        if (totalPhotoBytes + photo.length > 3 * 1024 * 1024) photo = '';
        else totalPhotoBytes += photo.length;
      }
      return { q, truth, hints, bluffs, photo };
    })
    .filter((x) => {
      if (!x || !x.truth) return false;
      if (game === 'tamr') return true;
      if (game === 'sahlab') return x.hints.length > 0;
      return Boolean(x.q && x.truth);
    })
    .slice(0, 50);
}

function teamMembers(room, teamId) {
  return Object.values(room.players).filter((p) => p.team === teamId);
}
// سعة الغرفة: 40 لاعب في وضع الفرق (20 لكل فريق) · و10 لاعبين في الوضع الفردي
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
  return Boolean(t && t.captainId === pid);
}

function event(room, type, data = {}) {
  room.lastEvent = { id: rid(4), type, ...data, at: Date.now() };
}

function addScore(room, teamId, pts) {
  const n = Number(pts);
  if (!Number.isFinite(n)) return;
  const t = room.teams.find((x) => x.id === teamId);
  if (t) t.score = Math.max(-9999, Math.min(99999, (Number(t.score) || 0) + Math.trunc(n)));
}

function otherTeam(id) { return id === 'A' ? 'B' : 'A'; }

function setDeadline(room, sec) {
  room.deadline = sec ? Date.now() + sec * 1000 : null;
  room.pausedLeft = null;
}

// تجهيز حالة المساعد الذكي حسب الكتالوج ومستوى الصعوبة المختار
function startAiPrefetch(room) {
  const s = room.settings;
  room.aiJob = null;
  room.aiReadyList = [];
  room.aiReady = 0;
  if (!s.ai || s.useCustom) return;
  const REL = ['islamic_history', 'islamic', 'quran', 'hadith'];
  if (s.categories.length && s.categories.every((c) => REL.includes(c))) { room.aiStatus = 'verified'; return; }
  room.aiReady = s.count;
  room.aiStatus = 'ready';
}

// ============================================================
// بداية اللعبة (فورية وبدون أي انتظار للشبكة)
// ============================================================
async function startGame(room) {
  const s = room.settings;
  if (isSoloMode(room)) syncSoloTeams(room);
  const tCount = Math.max(2, room.teams.length);
  let items = [];
  if (s.useCustom && room.customPack.length) {
    items = room.customPack.map((c, i) => {
      if (room.game === 'karak' || room.game === 'annab') {
        return { id: 'custom_' + i, custom: true, q: c.q, truth: c.truth, bluffs: Array.isArray(c.bluffs) ? c.bluffs.filter(Boolean) : [] };
      }
      if (room.game === 'sahlab') {
        const hints = Array.isArray(c.hints) && c.hints.filter(Boolean).length ? c.hints.filter(Boolean).slice(0, 5) : [c.q || 'خمّن الإجابة'];
        return { id: 'custom_' + i, custom: true, answer: c.truth, aliases: [], imageQuery: '', customPhoto: c.photo || null, hints };
      }
      return { id: 'custom_' + i, custom: true, name: c.truth, brief: '', imageQuery: '', customPhoto: c.photo || null };
    });
    if (room.game === 'karak' || room.game === 'annab') {
      const targetLen = room.game === 'annab' ? 3 : 10;
      items.forEach((it) => {
        const userBluffs = (it.bluffs || []).filter(Boolean);
        const seen = new Set([Q.normalizeAr(it.truth), ...userBluffs.map(Q.normalizeAr)]);
        const extra = Q.smartBluffsForItem(it, 16).filter((b) => {
          const k = Q.normalizeAr(b);
          if (!k || seen.has(k)) return false;
          seen.add(k);
          return true;
        });
        it.bluffs = [...userBluffs, ...extra].slice(0, targetLen);
      });
    }
    if (room.game === 'tamr') {
      while (items.length < tCount || items.length % tCount !== 0) {
        const src = items[items.length % room.customPack.length];
        items.push({ ...src, id: 'custom_pair_' + items.length });
      }
    }
  } else {
    const need = room.game === 'tamr' ? s.count * tCount : s.count;
    const aiFresh = Array.isArray(room.aiReadyList) && room.aiReadyList.length ? room.aiReadyList : [];
    items = await Q.pickQuestions(room.game, s.categories, need, aiFresh, s.difficulty);
    room.aiUsed = items.filter((x) => x.ai).length;
  }
  if (!items.length) throw new Error('مفيش أسئلة متاحة حالياً — جرب فئات تانية');

  room.queue = items;
  if (room.game === 'sahlab' || room.game === 'tamr') {
    setImmediate(() => warmQueueImages(items, 0).catch(() => {}));
  }
  room.totalRounds = room.game === 'tamr' ? Math.max(1, Math.floor(items.length / tCount)) : items.length;
  room.teams.forEach((t) => (t.score = 0));
  room.status = 'playing';
  room.round = -1;
  await nextRound(room);
}

async function nextRound(room) {
  clearRoomTimers(room);
  room.round++;
  if (room.round >= room.totalRounds) return finishGame(room);
  if (room.game === 'karak') startKarakRound(room);
  else if (room.game === 'sahlab') await startSahlabRound(room);
  else if (room.game === 'annab') startAnnabRound(room);
  else await startTamrRound(room);
}

function finishGame(room) {
  clearRoomTimers(room);
  room.status = 'finished';
  room.phase = 'final';
  setDeadline(room, 0);
  const sorted = [...room.teams].sort((a, b) => b.score - a.score);
  const topTie = sorted.length >= 2 && sorted[0].score === sorted[1].score;
  event(room, 'final', { winner: topTie ? null : sorted[0].id });
}

// ============================================================
// كرك (يدعم 2 لـ 4 فرق أو 2 لـ 10 لاعبين فردي + تحكيم AI تلقائي)
// ============================================================
function startKarakRound(room) {
  const item = room.queue[room.round];
  Q.markUsed('karak', item);
  const ids = teamIds(room);
  // أولاً إجابات السؤال المضللة الأصلية، ثم إجابات ذكية مطابقة 100% لنوع الإجابة (رقم/نص) ونفس الكتالوج
  const ownBluffs = Q.shuffle(Array.isArray(item.bluffs) ? item.bluffs : []);
  const extraBluffs = Q.smartBluffsForItem(item, 20);
  const bl = [...ownBluffs, ...extraBluffs];
  const uniqueBl = [];
  const seenBl = new Set([Q.normalizeAr(item.truth)]);
  for (const b of bl) {
    const k = Q.normalizeAr(b);
    if (k && !seenBl.has(k)) {
      seenBl.add(k);
      uniqueBl.push(b);
    }
  }
  // لو عدد اللاعبين/الفرق أقل من 5، الـ AI بيكمل لحد ما يبقوا 5 إجابات مضللة على الأقل (+ 1 صح = 6 إجابات)
  const aiCount = Math.max(1, 5 - ids.length - (room.aiJudge ? 0 : 1));
  room.kr = {
    q: item.q,
    truth: item.truth,
    cat: item.cat || 'custom',
    aiBluffs: uniqueBl.slice(0, aiCount),
    spareBluffs: uniqueBl.slice(aiCount),
    adminBluff: '',
    teamBluff: Object.fromEntries(ids.map((id) => [id, ''])),
    teamBluffBy: Object.fromEntries(ids.map((id) => [id, null])),
    autoFilled: Object.fromEntries(ids.map((id) => [id, false])),
    suggestions: Object.fromEntries(ids.map((id) => [id, {}])),
    options: [],
    voteSuggest: Object.fromEntries(ids.map((id) => [id, {}])),
    votes: Object.fromEntries(ids.map((id) => [id, null])),
    results: null
  };
  room.phase = 'write';
  setDeadline(room, room.settings.writeSec);
  event(room, 'round', { round: room.round });
}

function spareBluff(room, avoid) {
  const kr = room.kr;
  const taken = new Set(avoid.filter(Boolean).map(Q.normalizeAr));
  while (kr.spareBluffs.length) {
    const b = kr.spareBluffs.shift();
    if (!taken.has(Q.normalizeAr(b))) return b;
  }
  const fb = Q.smartBluffsForItem({ q: kr.q, truth: kr.truth, cat: kr.cat, bluffs: [] }, 24).find((b) => !taken.has(Q.normalizeAr(b)));
  if (fb) return fb;
  const tStr = String(kr.truth || '').trim();
  if (/^\d+$/.test(tStr)) return String((parseInt(tStr, 10) || 10) + 13);
  return 'إجابة غير معروفة';
}

function karakCheckWriteDone(room) {
  const kr = room.kr;
  const ids = teamIds(room);
  if (ids.every((id) => kr.teamBluff[id])) {
    if (room.aiJudge) {
      karakPublish(room);
    } else {
      room.phase = 'review';
      setDeadline(room, 0);
      event(room, 'review');
    }
  }
}

function karakWriteTimeout(room) {
  const kr = room.kr;
  const ids = teamIds(room);
  for (const t of ids) {
    if (!kr.teamBluff[t]) {
      kr.teamBluff[t] = spareBluff(room, [kr.truth, ...Object.values(kr.teamBluff), ...kr.aiBluffs]);
      kr.autoFilled[t] = true;
    }
  }
  if (room.aiJudge) {
    karakPublish(room);
  } else {
    room.phase = 'review';
    setDeadline(room, 0);
    event(room, 'review');
  }
}

function karakPublish(room) {
  const kr = room.kr;
  const ids = teamIds(room);
  const list = [{ src: 'truth', text: kr.truth }];
  const seen = new Set([Q.normalizeAr(kr.truth)]);
  const push = (src, text) => {
    let t = clean(text, 60);
    if (!t || seen.has(Q.normalizeAr(t))) t = spareBluff(room, [...seen]);
    seen.add(Q.normalizeAr(t));
    list.push({ src, text: t });
  };
  // إجابة كل فريق أو كل لاعب فردي (من 2 لحد 10 لاعبين)
  for (const id of ids) {
    push(kr.autoFilled[id] ? 'ai' : id, kr.teamBluff[id]);
  }
  // لو الحكم كتب إجابة مضللة
  if (!room.aiJudge && kr.adminBluff) {
    push('admin', kr.adminBluff);
  }
  // أقل عدد للإجابات هو 6 (5 مضللة + 1 صح)، ولو عدد اللاعبين 6 فما فوق بيزيد العدد تلقائياً على حسب عددهم
  const targetTotalOptions = Math.max(6, ids.length + 1);
  for (const b of kr.aiBluffs) {
    if (list.length >= targetTotalOptions) break;
    push('ai', b);
  }
  while (list.length < targetTotalOptions) {
    push('ai', spareBluff(room, [...seen]));
  }
  kr.options = Q.shuffle(list).map((o, i) => ({ id: 'o' + i, ...o }));
  room.phase = 'vote';
  setDeadline(room, room.settings.voteSec);
  event(room, 'vote');
}

function karakReveal(room) {
  const kr = room.kr;
  const ids = teamIds(room);
  const P = POINTS.karak;
  const delta = Object.fromEntries(ids.map((id) => [id, 0]));
  const lines = [];
  for (const t of ids) {
    const v = kr.options.find((o) => o.id === kr.votes[t]);
    if (!v) { lines.push({ team: t, kind: 'none', pts: 0 }); continue; }
    if (v.src === 'truth') {
      delta[t] += P.truth;
      lines.push({ team: t, kind: 'truth', pts: P.truth, opt: v.id });
    } else if (ids.includes(v.src)) {
      delta[v.src] = (delta[v.src] || 0) + P.fooled;
      lines.push({ team: t, kind: 'fooled', by: v.src, pts: P.fooled, opt: v.id });
    } else {
      delta[t] += P.houseBluff;
      lines.push({ team: t, kind: 'house', src: v.src, pts: P.houseBluff, opt: v.id });
    }
  }
  for (const t of ids) addScore(room, t, delta[t] || 0);
  kr.results = { delta, lines };
  room.phase = 'reveal';
  setDeadline(room, 0);
  event(room, 'reveal', { delta });
  scheduleAutoNext(room, 7);
}

// ============================================================
// سحلب (يدعم 2 أو 3 أو 4 فرق أو فردي لحد 10 + تحكيم AI تلقائي)
// ============================================================
async function startSahlabRound(room) {
  const item = room.queue[room.round];
  Q.markUsed('sahlab', item);
  const ids = teamIds(room);
  let initialPhoto = item.customPhoto || null;
  if (!item.custom && item.imageQuery) {
    initialPhoto = await Promise.race([
      wikiImage(item.imageQuery, item.answer),
      new Promise((r) => setTimeout(() => r(null), 350))
    ]);
  }
  room.sh = {
    answer: item.answer,
    aliases: item.aliases || [],
    hints: item.hints,
    hintIdx: 0,
    frozen: Object.fromEntries(ids.map((id) => [id, false])),
    pending: Object.fromEntries(ids.map((id) => [id, null])),
    suggestions: Object.fromEntries(ids.map((id) => [id, {}])),
    guesses: [],
    winner: null,
    photo: initialPhoto,
    autoHintTimer: null
  };
  room.phase = 'play';
  setDeadline(room, room.settings.hintSec);
  event(room, 'round', { round: room.round });
  if (!item.custom && item.imageQuery && !initialPhoto) {
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

function sahlabAllFrozen(room) {
  const sh = room.sh;
  if (!sh) return false;
  return teamIds(room).every((id) => Boolean(sh.frozen[id]));
}

function sahlabNextHint(room) {
  const sh = room.sh;
  if (!sh) return;
  const ids = teamIds(room);
  if (sh.autoHintTimer) { clearTimeout(sh.autoHintTimer); sh.autoHintTimer = null; }
  if (sh.hintIdx >= sh.hints.length - 1) return sahlabSolve(room, null);
  sh.hintIdx++;
  sh.frozen = Object.fromEntries(ids.map((id) => [id, false]));
  sh.pending = Object.fromEntries(ids.map((id) => [id, null]));
  sh.suggestions = Object.fromEntries(ids.map((id) => [id, {}]));
  setDeadline(room, room.settings.hintSec);
  event(room, 'hint', { idx: sh.hintIdx });
}

function sahlabSolve(room, teamId) {
  const sh = room.sh;
  if (!sh) return;
  const ids = teamIds(room);
  if (sh.autoHintTimer) { clearTimeout(sh.autoHintTimer); sh.autoHintTimer = null; }
  sh.winner = teamId;
  const pts = teamId ? POINTS.sahlab[Math.min(sh.hintIdx, POINTS.sahlab.length - 1)] : 0;
  if (teamId) addScore(room, teamId, pts);
  sh.pending = Object.fromEntries(ids.map((id) => [id, null]));
  sh.suggestions = Object.fromEntries(ids.map((id) => [id, {}]));
  sh.wonPts = pts;
  room.phase = 'solved';
  setDeadline(room, 0);
  event(room, 'solved', { team: teamId, pts });
  scheduleAutoNext(room, 6);
}

function sahlabScheduleBothFrozen(room) {
  const sh = room.sh;
  if (!sh || !sahlabAllFrozen(room)) return;
  if (sh.autoHintTimer) clearTimeout(sh.autoHintTimer);
  setDeadline(room, 2);
  sh.autoHintTimer = setTimeout(() => {
    if (room.status === 'playing' && room.game === 'sahlab' && room.phase === 'play' && room.sh === sh && sahlabAllFrozen(room)) {
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
  const bothFrozen = sahlabAllFrozen(room);
  event(room, 'wrong', { team: teamId, text: pend, bothFrozen });
  if (bothFrozen) sahlabScheduleBothFrozen(room);
}

// ============================================================
// لبن تمر هندي (يدعم 2 أو 3 أو 4 فرق أو فردي + تحكيم AI تلقائي)
// ============================================================
async function startTamrRound(room) {
  const ids = teamIds(room);
  const tCount = ids.length;
  const roundItems = ids.map((_, idx) => room.queue[room.round * tCount + idx] || room.queue[(room.round * tCount + idx) % room.queue.length]);
  roundItems.forEach((it) => Q.markUsed('tamr', it));

  const photos = await Promise.race([
    Promise.all(roundItems.map((it) => (it.custom ? Promise.resolve(it.customPhoto || null) : (it.imageQuery ? wikiImage(it.imageQuery, it.name) : Promise.resolve(null))))),
    new Promise((r) => setTimeout(() => r(roundItems.map((it) => (it.custom ? (it.customPhoto || null) : null))), 350))
  ]);

  const chars = {};
  ids.forEach((id, idx) => {
    const it = roundItems[idx];
    chars[id] = { name: it.name, brief: it.brief || '', photo: photos[idx] || null };
  });

  room.tm = {
    chars,
    turn: ids[room.round % tCount] || 'A',
    clocks: Object.fromEntries(ids.map((id) => [id, room.settings.chessSec])),
    lastTick: Date.now(),
    golden: null,
    pending: null,
    suggestions: Object.fromEntries(ids.map((id) => [id, {}])),
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
  ids.forEach((id, idx) => {
    const it = roundItems[idx];
    if (!it.custom && it.imageQuery && !photos[idx]) {
      wikiImage(it.imageQuery, it.name).then((img) => {
        if (img && room.tm === tm && tm.chars[id] && !tm.chars[id].photo) {
          tm.chars[id].photo = img;
          broadcast(room);
        }
      });
    }
  });
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
  scheduleAutoNext(room, 6);
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
    tm.golden = null;
    tm.turn = team;
    event(room, 'wrong', { team, text });
  } else {
    tm.golden = nextTeamId(room, team);
    event(room, 'golden', { team: tm.golden, wrongTeam: team, text });
  }
}

// ============================================================
// عنّاب (زرار الباز + 4 اختيارات · يدعم 2 أو 3 أو 4 فرق + تحكيم AI تلقائي)
// ============================================================
function startAnnabRound(room) {
  const item = room.queue[room.round];
  Q.markUsed('annab', item);
  const ids = teamIds(room);
  const seen = new Set([Q.normalizeAr(item.truth)]);
  const baseBluffs = item.custom ? (item.bluffs || []) : Q.shuffle(item.bluffs || []);
  const wrongPool = [...baseBluffs, ...Q.smartBluffsForItem(item, 10)];
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
    firstWrongTeam: null,
    triedTeams: [],
    attempt: 0,
    eliminated: [],
    picks: [],
    suggestions: Object.fromEntries(ids.map((id) => [id, {}])),
    winner: null,
    wonPts: 0
  };
  room.phase = 'play';
  setDeadline(room, 0);
  event(room, 'round', { round: room.round });
}

function annabAdvanceAfterMiss(room, wrongTeam, text, isTimeout = false) {
  const an = room.an;
  const ids = teamIds(room);
  if (!an.triedTeams.includes(wrongTeam)) an.triedTeams.push(wrongTeam);
  an.firstWrongTeam = wrongTeam;
  const remainingTeams = ids.filter((id) => !an.triedTeams.includes(id));
  const remainingWrongOpts = 3 - an.eliminated.length;

  if (remainingTeams.length === 0 || remainingWrongOpts <= 0) {
    an.winner = null;
    room.phase = 'solved';
    setDeadline(room, 0);
    event(room, 'an_both_wrong', { wrongTeam, text });
    scheduleAutoNext(room, 6);
    return;
  }

  if (remainingTeams.length === 1) {
    const nextTeam = remainingTeams[0];
    an.buzzedTeam = nextTeam;
    an.attempt = an.triedTeams.length + 1;
    an.subPhase = 'steal';
    setDeadline(room, room.settings.buzzSec);
    event(room, isTimeout ? 'an_timeout_steal' : 'an_wrong_steal', { wrongTeam, nextTeam, team: nextTeam, text });
  } else {
    // في حالة 3 أو 4 فرق ولسه أكتر من فريق ماجاوبش: الباز يفتح للفرق الباقية
    an.buzzedTeam = null;
    an.attempt = an.triedTeams.length;
    an.subPhase = 'buzz';
    setDeadline(room, 0);
    event(room, isTimeout ? 'an_timeout_steal' : 'an_wrong_steal', { wrongTeam, nextTeam: null, text });
  }
}

function annabHandlePick(room, teamId, opt) {
  const an = room.an;
  const ids = teamIds(room);
  const correct = opt.id === an.correctId;
  an.picks.push({ team: teamId, optId: opt.id, text: opt.text, correct, attempt: an.attempt });
  an.suggestions = Object.fromEntries(ids.map((id) => [id, {}]));
  if (correct) {
    an.winner = teamId;
    if (room.aiJudge) {
      const pts = an.triedTeams.length === 0 ? POINTS.annab.first : POINTS.annab.steal;
      addScore(room, teamId, pts);
      an.wonPts = pts;
    }
    room.phase = 'solved';
    setDeadline(room, 0);
    event(room, 'an_correct', { team: teamId, text: opt.text, pts: an.wonPts || 0 });
    scheduleAutoNext(room, 6);
    return;
  }
  if (!an.eliminated.includes(opt.id)) an.eliminated.push(opt.id);
  annabAdvanceAfterMiss(room, teamId, opt.text, false);
}

function annabTimeout(room) {
  const an = room.an;
  if (!an || room.phase !== 'play') return;
  if ((an.subPhase === 'answer' || an.subPhase === 'steal') && an.buzzedTeam) {
    annabAdvanceAfterMiss(room, an.buzzedTeam, null, true);
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
        tm.clocks[tm.turn] = Math.max(0, (tm.clocks[tm.turn] || 0) - steps);
        if (tm.clocks[tm.turn] === 0) {
          tamrSolve(room, nextTeamId(room, tm.turn), POINTS.tamr.timeout, 'timeout');
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
  for (const [code, room] of ROOMS) if (now - room.touched > 6 * 3600e3 && room.clients.size === 0) ROOMS.delete(code);
}, 250);

// ============================================================
// العرض المخصص لكل مستخدم (فلترة الأسرار)
// ============================================================
function viewFor(room, pid) {
  const isHost = room.admin.pid === pid;
  const adminPlaying = Boolean(room.aiJudge && room.admin.playingTeam);
  // أثناء اللعب: لو الأدمن منضم لفريق، بيتعامل كلاعب عشان مايتحرقش عليه السؤال والـ AI هو اللي بيحكم
  const isJudgeView = isHost && !(adminPlaying && room.status === 'playing');
  const me = room.players[pid] || null;
  const myTeam = me ? me.team : (isHost && adminPlaying ? room.admin.playingTeam : null);
  const ids = teamIds(room);

  let meObj;
  if (isHost) {
    if (adminPlaying && room.status === 'playing') {
      meObj = { role: 'player', isHost: true, id: pid, team: myTeam, captain: isCaptain(room, pid) };
    } else {
      meObj = { role: 'admin', isHost: true, id: pid, team: myTeam, captain: myTeam ? isCaptain(room, pid) : false };
    }
  } else if (me) {
    meObj = { role: 'player', isHost: false, id: pid, team: myTeam, captain: isCaptain(room, pid) };
  } else {
    meObj = { role: 'guest', isHost: false, id: pid };
  }

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
    aiJudge: !!room.aiJudge,
    adminPlays: !!room.aiJudge,
    adminTeam: room.admin.playingTeam || null,
    adminPlayingTeam: room.admin.playingTeam || null,
    customCount: room.customPack.length,
    customPack: isHost ? room.customPack : undefined,
    teams: room.teams.map((t) => ({ ...t })),
    players: Object.values(room.players).map((p) => ({
      id: p.id,
      name: p.name,
      outfit: p.outfit,
      face: p.face,
      hat: p.hat,
      team: p.team,
      isTest: !!p.isTest,
      isHostPlayer: !!p.isHostPlayer,
      isAdminPlayer: !!p.isHostPlayer,
      online: p.isTest || p.isHostPlayer || p.conns > 0
    })),
    admin: {
      name: room.admin.profile.name,
      outfit: room.admin.profile.outfit,
      face: room.admin.profile.face,
      hat: room.admin.profile.hat,
      playingTeam: room.admin.playingTeam || null,
      online: room.admin.conns > 0
    },
    me: meObj,
    lastEvent: room.lastEvent,
    points: POINTS,
    playMode: room.settings.playMode || 'teams',
    ai: { on: !!room.settings.ai && !room.settings.useCustom, status: room.aiStatus || 'off', ready: room.aiReady || 0, used: room.aiUsed || 0 },
    caps: { room: isSoloMode(room) ? MAX_SOLO : MAX_PLAYERS, team: isSoloMode(room) ? 1 : MAX_TEAM, solo: MAX_SOLO }
  };
  if (room.kicked.has(pid)) v.me.role = 'kicked';

  if (room.game === 'karak' && room.kr) {
    const kr = room.kr;
    const reveal = room.phase === 'reveal';
    const k = { q: kr.q, cat: kr.cat };
    const submittedMap = Object.fromEntries(ids.map((id) => [id, !!kr.teamBluff[id]]));
    const votedMap = Object.fromEntries(ids.map((id) => [id, !!kr.votes[id]]));
    if (isJudgeView) {
      Object.assign(k, {
        truth: kr.truth,
        aiBluffs: kr.aiBluffs,
        adminBluff: kr.adminBluff,
        teamBluff: kr.teamBluff,
        autoFilled: kr.autoFilled,
        suggestions: kr.suggestions,
        voteSuggest: kr.voteSuggest,
        votes: kr.votes,
        results: kr.results
      });
      k.submitted = submittedMap;
      k.voted = votedMap;
      k.options = kr.options;
    } else {
      k.submitted = submittedMap;
      k.voted = votedMap;
      if (myTeam) {
        k.myBluff = kr.teamBluff[myTeam];
        k.suggestions = kr.suggestions[myTeam] || {};
        k.voteSuggest = kr.voteSuggest[myTeam] || {};
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
    if (reveal && isJudgeView) k.votes = kr.votes;
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
      pending: isJudgeView ? sh.pending : Object.fromEntries(ids.map((id) => [id, !!sh.pending[id]])),
      myPending: myTeam ? sh.pending[myTeam] : null,
      suggestions: isJudgeView ? sh.suggestions : myTeam ? (sh.suggestions && sh.suggestions[myTeam]) || {} : {},
      guesses: sh.guesses.map((g) => ({ team: g.team, text: isJudgeView || solved || g.team === myTeam ? g.text : '؟؟؟', correct: g.correct, hint: g.hint })),
      photo: sh.photo,
      winner: sh.winner,
      wonPts: sh.wonPts || 0
    };
    if (isJudgeView || solved) { v.sh.answer = sh.answer; v.sh.allHints = isJudgeView ? sh.hints : undefined; }
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
      pending: tm.pending ? { team: tm.pending.team, text: isJudgeView || tm.pending.team === myTeam ? tm.pending.text : null } : null,
      suggestions: isJudgeView ? tm.suggestions : myTeam ? (tm.suggestions && tm.suggestions[myTeam]) || {} : {},
      guesses: tm.guesses,
      winner: tm.winner,
      wonPts: tm.wonPts,
      reason: tm.reason,
      paused: !!room.paused || room.pausedLeft != null
    };
    // كل فريق بيشوف شخصيات الفرق التانية (اللي هيجاوب عنها) — ومايشوفش شخصيته
    if (isJudgeView || solved) {
      v.tm.chars = tm.chars;
    } else if (myTeam) {
      v.tm.chars = Object.fromEntries(Object.entries(tm.chars).filter(([k]) => k !== myTeam));
    } else {
      v.tm.chars = {};
    }
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
      triedTeams: an.triedTeams || [],
      attempt: an.attempt,
      eliminated: an.eliminated,
      picks: an.picks,
      winner: an.winner,
      wonPts: an.wonPts || 0,
      suggestions: isJudgeView ? an.suggestions : myTeam ? (an.suggestions && an.suggestions[myTeam]) || {} : {}
    };
    if (isJudgeView || solved) {
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
function authAdmin(room, b) {
  const pid = cleanId(b && b.pid, 40);
  const secret = cleanId(b && b.secret, 40);
  return Boolean(pid && secret && room.admin.pid === pid && safeEqualSecret(room.admin.secret, secret));
}
function authPlayer(room, b) {
  const pid = cleanId(b && b.pid, 40);
  const secret = cleanId(b && b.secret, 40);
  if (!pid || !secret || !Object.prototype.hasOwnProperty.call(room.players, pid)) return null;
  const p = room.players[pid];
  return p && safeEqualSecret(p.secret, secret) ? p : null;
}

const ERR = (m) => { const e = new Error(m); e.user = true; throw e; };

async function handleAction(b) {
  const action = cleanId(b && b.action, 40);
  const reqPid = cleanId(b && b.pid, 40);
  const reqSecret = cleanId(b && b.secret, 40);
  if (!reqPid || !reqSecret) ERR('هوية غير صحيحة');
  b.pid = reqPid;
  b.secret = reqSecret;

  if (action === 'create_room') {
    const game = ['karak', 'sahlab', 'tamr', 'annab'].includes(b.game) ? b.game : ERR('اختار اللعبة الأول');
    const profile = { name: clean(b.profile && b.profile.name, 20) || 'الحكم', outfit: cleanId(b.profile && b.profile.outfit, 30), face: cleanId(b.profile && b.profile.face, 30), hat: cleanId(b.profile && b.profile.hat, 30) };
    const custom = sanitizeCustom(b.customPack, game);
    const settings = sanitizeSettings(game, b.settings);
    if (settings.useCustom && !custom.length) ERR('اكتب أسئلة الكاستم الأول');
    if (game === 'tamr' && settings.useCustom && custom.length < 2) ERR('تمر هندي محتاج شخصيتين على الأقل في الكاستم');
    if ((game === 'karak' || game === 'annab' || game === 'sahlab') && settings.useCustom && custom.length < 1) ERR('محتاج سؤال واحد على الأقل');
    const room = createRoom({ pid: reqPid, secret: reqSecret, profile }, game, settings, custom);
    startAiPrefetch(room);
    return { room };
  }

  const room = ROOMS.get(cleanId(b.code, 10).toUpperCase());
  if (!room) ERR('الغرفة دي مش موجودة أو اتقفلت');
  room.touched = Date.now();
  const admin = authAdmin(room, b);
  const ids = teamIds(room);

  // ---------- انضمام لاعب ----------
  if (action === 'join') {
    if (room.kicked.has(b.pid)) ERR('الحكم طلعك من الغرفة دي');
    if (room.admin.pid === b.pid) return { room };
    const prof = b.profile || {};
    const existing = Object.prototype.hasOwnProperty.call(room.players, b.pid) ? room.players[b.pid] : null;
    if (existing && !safeEqualSecret(existing.secret, b.secret)) ERR('هوية غير صحيحة');
    const roomCap = isSoloMode(room) ? MAX_SOLO : MAX_PLAYERS;
    if (!existing && Object.keys(room.players).length >= roomCap) {
      ERR(isSoloMode(room) ? `الوضع الفردي كامل (${MAX_SOLO} لاعبين كحد أقصى)` : `الغرفة كاملة (${MAX_PLAYERS} لاعب)`);
    }
    const p = existing || { id: reqPid, secret: reqSecret, team: null, conns: 0 };
    p.name = clean(prof.name, 20) || p.name || 'لاعب';
    p.outfit = cleanId(prof.outfit, 30) || p.outfit;
    p.face = cleanId(prof.face, 30) || p.face;
    p.hat = cleanId(prof.hat, 30) || p.hat;
    room.players[p.id] = p;
    if (isSoloMode(room)) {
      syncSoloTeams(room);
    }
    event(room, 'join', { name: p.name });
    return { room };
  }

  if (action === 'pick_team') {
    const p = authPlayer(room, b) || ERR('ادخل الغرفة الأول');
    if (isSoloMode(room)) {
      syncSoloTeams(room);
      return { room };
    }
    if (!ids.includes(b.team)) ERR('فريق غير صحيح');
    if (room.status === 'playing' && p.team && p.team !== b.team) {
      ERR('ماينفعش تغير فريقك أثناء اللعب — استنى لغرفة الانتظار');
    }
    if (p.team !== b.team) assertTeamRoom(room, b.team, p.id);
    const old = p.team;
    p.team = b.team;
    if (p.id === room.admin.pid) {
      room.admin.playingTeam = b.team;
      room.settings.adminTeam = b.team;
    }
    if (old && old !== b.team) ensureCaptain(room, old);
    ensureCaptain(room, b.team);
    return { room };
  }

  if (action === 'unpick_team') {
    const p = authPlayer(room, b) || ERR('ادخل الغرفة الأول');
    if (room.status === 'playing') ERR('ماينفعش تسيب الفريق أثناء اللعب');
    if (!isSoloMode(room) && p.team) {
      const old = p.team;
      p.team = null;
      ensureCaptain(room, old);
    }
    return { room };
  }

  if (action === 'leave_room') {
    const p = authPlayer(room, b);
    if (p && !p.isHostPlayer) {
      const old = p.team;
      delete room.players[p.id];
      if (isSoloMode(room)) syncSoloTeams(room);
      else if (old) ensureCaptain(room, old);
    }
    return { room };
  }

  if (action === 'update_profile') {
    if (room.status === 'playing') ERR('ماينفعش تغير شكل شخصيتك وإنت جوه الجيم');
    const prof = b.profile || {};
    const p = authPlayer(room, b);
    if (!admin && !p) ERR('ادخل الغرفة الأول');
    if (admin) {
      room.admin.profile.name = clean(prof.name, 20) || room.admin.profile.name || 'الحكم';
      room.admin.profile.outfit = cleanId(prof.outfit, 30) || room.admin.profile.outfit;
      room.admin.profile.face = cleanId(prof.face, 30) || room.admin.profile.face;
      room.admin.profile.hat = cleanId(prof.hat, 30) || room.admin.profile.hat;
      const admPl = Object.prototype.hasOwnProperty.call(room.players, room.admin.pid) ? room.players[room.admin.pid] : null;
      if (admPl) {
        admPl.name = room.admin.profile.name;
        admPl.outfit = room.admin.profile.outfit;
        admPl.face = room.admin.profile.face;
        admPl.hat = room.admin.profile.hat;
      }
    }
    if (p) {
      p.name = clean(prof.name, 20) || p.name || 'لاعب';
      p.outfit = cleanId(prof.outfit, 30) || p.outfit;
      p.face = cleanId(prof.face, 30) || p.face;
      p.hat = cleanId(prof.hat, 30) || p.hat;
    }
    if (isSoloMode(room)) syncSoloTeams(room);
    return { room };
  }

  // ---------- أكشنز اللاعبين أثناء اللعب ----------
  const p = authPlayer(room, b);
  if (p && action.startsWith('kr_') && room.game === 'karak' && room.kr) {
    const kr = room.kr;
    const t = p.team;
    if (!t || !ids.includes(t)) ERR('اختار فريق الأول');
    if (action === 'kr_suggest' && room.phase === 'write') {
      const txt = clean(b.text, 60);
      if (txt && Q.normalizeAr(txt) === Q.normalizeAr(kr.truth)) ERR('دي الإجابة الصح! اكتب حاجة تانية تخدع بيها');
      if (!kr.suggestions[t]) kr.suggestions[t] = {};
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
      if (!o || o.src === t) ERR('ماينفعش تختار إجابةك');
      if (!kr.voteSuggest[t]) kr.voteSuggest[t] = {};
      kr.voteSuggest[t][p.id] = o.id;
      return { room };
    }
    if (action === 'kr_vote_submit' && room.phase === 'vote') {
      if (!isCaptain(room, p.id)) ERR('القائد بس هو اللي يأكد الاختيار');
      const o = kr.options.find((x) => x.id === b.opt);
      if (!o || o.src === t) ERR('ماينفعش تختار إجابتك');
      kr.votes[t] = o.id;
      if (ids.every((id) => kr.votes[id])) karakReveal(room);
      return { room };
    }
    if (!admin) ERR('مش وقته دلوقتي');
  }
  if (p && (action === 'sh_guess' || action === 'sh_suggest') && room.game === 'sahlab' && room.sh && room.phase === 'play') {
    const sh = room.sh;
    if (!p.team || !ids.includes(p.team)) ERR('اختار فريق الأول');
    if (sh.frozen[p.team]) ERR('أنت متجمد لحد التلميح الجاي');
    if (action === 'sh_suggest') {
      const txt = clean(b.text, 60);
      if (!sh.suggestions) sh.suggestions = {};
      if (!sh.suggestions[p.team]) sh.suggestions[p.team] = {};
      if (txt) sh.suggestions[p.team][p.id] = txt; else delete sh.suggestions[p.team][p.id];
      return { room };
    }
    if (!isCaptain(room, p.id)) ERR('القائد بس هو اللي يبعت التخمين');
    if (sh.pending[p.team]) ERR('مستنيين حكم الحكم على تخمينكم');
    const txt = clean(b.text, 60) || ERR('اكتب التخمين');
    sh.pending[p.team] = txt;
    if (sahlabMatches(sh, txt)) {
      sahlabJudge(room, p.team, true);
    } else if (room.aiJudge) {
      // في وضع الـ AI Judge: يصنّف الإجابة فوراً
      sahlabJudge(room, p.team, false);
    } else {
      event(room, 'guess', { team: p.team, text: txt });
    }
    return { room };
  }
  if (p && action.startsWith('tm_') && !['tm_judge', 'tm_force_pass', 'tm_penalty', 'tm_end_golden'].includes(action) && room.game === 'tamr' && room.tm && room.phase === 'play') {
    const tm = room.tm;
    if (!p.team || !ids.includes(p.team)) ERR('اختار فريق الأول');
    if (action === 'tm_suggest') {
      const txt = clean(b.text, 60);
      if (!tm.suggestions) tm.suggestions = {};
      if (!tm.suggestions[p.team]) tm.suggestions[p.team] = {};
      if (txt) tm.suggestions[p.team][p.id] = txt; else delete tm.suggestions[p.team][p.id];
      return { room };
    }
    if (!isCaptain(room, p.id)) ERR('القائد بس');
    const active = tm.golden || tm.turn;
    if (p.team !== active) ERR('مش دورك دلوقتي');
    if (action === 'tm_pass') {
      if (tm.golden) ERR('استخدم الفرصة الذهبية الأول');
      tm.turn = nextTeamId(room, tm.turn);
      tm.lastTick = Date.now();
      event(room, 'turn', { team: tm.turn });
      return { room };
    }
    if (action === 'tm_guess') {
      if (tm.pending) ERR('في تخمين مستني الحكم');
      const txt = clean(b.text, 60) || ERR('اكتب اسم الشخصية');
      tm.pending = { team: p.team, text: txt };
      tm.lastTick = Date.now();
      if (tamrMatches(tm.chars[p.team].name, txt)) {
        tamrJudge(room, true);
      } else if (room.aiJudge) {
        tamrJudge(room, false);
      } else {
        event(room, 'guess', { team: p.team, text: txt });
      }
      return { room };
    }
  }
  if (p && ['an_suggest', 'an_buzz', 'an_pick'].includes(action) && room.game === 'annab' && room.an && room.phase === 'play') {
    const an = room.an;
    if (!p.team || !ids.includes(p.team)) ERR('اختار فريق الأول');
    if (action === 'an_suggest') {
      const o = an.options.find((x) => x.id === b.opt);
      if (!o || an.eliminated.includes(o.id)) ERR('الاختيار ده مش متاح');
      if (!an.suggestions) an.suggestions = {};
      if (!an.suggestions[p.team]) an.suggestions[p.team] = {};
      an.suggestions[p.team][p.id] = o.id;
      return { room };
    }
    if (action === 'an_buzz') {
      if (!isCaptain(room, p.id)) ERR('قائد الفريق بس هو اللي بيدوس زرار الباز');
      if ((an.triedTeams || []).includes(p.team)) ERR('جاوبت على السؤال ده خلاص');
      if (an.subPhase !== 'buzz' || an.buzzedTeam) ERR(`${(room.teams.find((x) => x.id === an.buzzedTeam) || {}).name || 'لاعب تاني'} سبق وداس الباز!`);
      an.buzzedTeam = p.team;
      an.attempt = (an.triedTeams || []).length + 1;
      an.subPhase = 'answer';
      setDeadline(room, room.settings.buzzSec);
      event(room, 'buzz', { team: p.team });
      return { room };
    }
    if (action === 'an_pick') {
      if (!isCaptain(room, p.id)) ERR('قائد الفريق بس هو اللي بيختار الإجابة');
      if (an.subPhase === 'buzz' || !an.buzzedTeam) ERR('دوس زرار الباز الأول!');
      if (p.team !== an.buzzedTeam) ERR('مش دورك في الإجابة دلوقتي');
      const opt = an.options.find((x) => x.id === b.opt);
      if (!opt || an.eliminated.includes(opt.id)) ERR('الاختيار ده مش متاح');
      annabHandlePick(room, p.team, opt);
      return { room };
    }
  }

  // ---------- أكشنز الحكم / مضيف الغرفة ----------
  if (!admin) ERR('الأكشن ده للحكم بس');

  switch (action) {
    case 'toggle_secret': {
      room.settings.hideSecret = b.hideSecret !== undefined ? !!b.hideSecret : !room.settings.hideSecret;
      break;
    }
    case 'admin_join_team': {
      if (isSoloMode(room)) {
        if (!room.players[room.admin.pid] && Object.keys(room.players).length >= MAX_SOLO) {
          ERR(`الوضع الفردي كامل (${MAX_SOLO} لاعبين كحد أقصى)`);
        }
        syncAdminPlaying(room, true, 'S1');
        event(room, 'admin_joined_team', { team: room.admin.playingTeam || 'S1', name: room.admin.profile.name });
        break;
      }
      const targetTeam = validTeamId(room, b.team || room.admin.playingTeam || 'A');
      assertTeamRoom(room, targetTeam, room.admin.pid);
      syncAdminPlaying(room, true, targetTeam);
      event(room, 'admin_joined_team', { team: targetTeam, name: room.admin.profile.name });
      break;
    }
    case 'admin_become_judge': {
      syncAdminPlaying(room, false, null);
      event(room, 'admin_became_judge', { name: room.admin.profile.name });
      break;
    }
    case 'set_play_mode': {
      if (room.status === 'playing') ERR('انهي الجولة الحالية الأول عشان تغير نظام اللعب');
      room.settings.playMode = b.playMode === 'solo' ? 'solo' : 'teams';
      syncRoomTeams(room, room.settings.teamCount, room.settings.teamNames);
      break;
    }
    case 'set_team_count': {
      if (room.status === 'playing') ERR('انهي الجولة الحالية الأول عشان تغير عدد الفرق');
      room.settings.playMode = 'teams';
      syncRoomTeams(room, b.teamCount || b.count, b.teamNames);
      break;
    }
    case 'update_lobby': {
      if (room.status === 'playing') ERR('انهي الجولة الحالية الأول عشان تغير اللعبة أو الإعدادات');
      room.status = 'lobby';
      room.phase = null;
      clearRoomTimers(room);
      room.kr = room.sh = room.tm = room.an = null;
      room.round = -1;
      setDeadline(room, 0);
      room.paused = false;

      const oldGame = room.game;
      if (['karak', 'sahlab', 'tamr', 'annab'].includes(b.game)) room.game = b.game;
      if (b.customPack !== undefined) room.customPack = sanitizeCustom(b.customPack, room.game);

      const merged = { ...room.settings, ...(b.settings || {}) };
      if (room.game !== oldGame && (!b.settings || b.settings.categories === undefined)) {
        merged.categories = [];
      }
      if (room.game === 'annab' && room.game !== oldGame && (!b.settings || b.settings.count === undefined)) {
        merged.count = 20;
      }
      room.settings = sanitizeSettings(room.game, merged);
      syncRoomTeams(room, room.settings.teamCount, b.settings && b.settings.teamNames);
      if (b.settings && b.settings.adminPlays !== undefined) {
        syncAdminPlaying(room, !!b.settings.adminPlays, b.settings.adminTeam || room.admin.playingTeam || 'A');
      }
      startAiPrefetch(room);
      if (room.game !== oldGame) event(room, 'game_changed', { game: room.game });
      break;
    }
    case 'set_captain': {
      const tid = cleanId(b.target, 40);
      const target = tid && Object.prototype.hasOwnProperty.call(room.players, tid) ? room.players[tid] : null;
      if (!target || !target.team) ERR('اللاعب مش في فريق');
      const tm = room.teams.find((t) => t.id === target.team);
      if (tm) tm.captainId = target.id;
      break;
    }
    case 'move_player': {
      if (isSoloMode(room)) break;
      const tid = cleanId(b.target, 40);
      const target = (tid && Object.prototype.hasOwnProperty.call(room.players, tid) ? room.players[tid] : null) || ERR('لاعب غير موجود');
      const old = target.team;
      const dest = ids.includes(b.team) ? b.team : nextTeamId(room, old || ids[ids.length - 1]);
      if (dest !== old) assertTeamRoom(room, dest, target.id);
      target.team = dest;
      if (target.id === room.admin.pid) {
        room.admin.playingTeam = dest;
        room.settings.adminTeam = dest;
      }
      if (old) ensureCaptain(room, old);
      ensureCaptain(room, target.team);
      break;
    }
    case 'kick': {
      const tid = cleanId(b.target, 40);
      const target = (tid && Object.prototype.hasOwnProperty.call(room.players, tid) ? room.players[tid] : null) || ERR('لاعب غير موجود');
      if (target.id === room.admin.pid) {
        syncAdminPlaying(room, false, null);
        break;
      }
      const old = target.team;
      delete room.players[target.id];
      if (!target.isTest) room.kicked.add(target.id);
      if (isSoloMode(room)) {
        syncSoloTeams(room);
      } else if (old) {
        ensureCaptain(room, old);
      }
      break;
    }
    case 'rename_team': {
      if (room.status === 'playing') ERR('الإعدادات مقفولة أثناء اللعب');
      const idx = ALL_TEAM_IDS.indexOf(b.team);
      const t = room.teams.find((x) => x.id === b.team);
      if (t) {
        t.name = clean(b.name, 24) || t.name;
        if (idx >= 0) room.settings.teamNames[idx] = t.name;
      }
      break;
    }
    case 'add_test_player': {
      const cap = isSoloMode(room) ? MAX_SOLO : MAX_PLAYERS;
      if (Object.keys(room.players).length >= cap) {
        ERR(isSoloMode(room) ? `الوضع الفردي كامل (${MAX_SOLO} لاعبين كحد أقصى)` : `الغرفة كاملة (${MAX_PLAYERS} لاعب)`);
      }
      const targetTeam = !isSoloMode(room) && ids.includes(b.team) ? b.team : null;
      if (targetTeam) assertTeamRoom(room, targetTeam, null);
      const n = Object.values(room.players).filter((x) => x.isTest).length + 1;
      const parts = b.parts || {};
      const id = 'test_' + rid(4);
      room.players[id] = { id, secret: rid(8), name: 'لاعب تجريبي ' + n, outfit: cleanId(parts.outfit, 30), face: cleanId(parts.face, 30), hat: cleanId(parts.hat, 30), team: targetTeam, isTest: true, conns: 0 };
      if (isSoloMode(room)) {
        syncSoloTeams(room);
      } else if (room.players[id].team) {
        ensureCaptain(room, room.players[id].team);
      }
      break;
    }
    case 'start_game': {
      if (room.status === 'playing' || room._busy) ERR('اللعبة شغالة بالفعل');
      if (isSoloMode(room)) {
        syncSoloTeams(room);
        if (room.teams.length < 2) ERR('وضع اللعب الفردي محتاج لاعبين اتنين على الأقل في الغرفة عشان تبدأ اللعبة');
      } else {
        for (const t of room.teams) if (!teamMembers(room, t.id).length) ERR(`${t.name} لسه فاضي — محتاج لاعب واحد على الأقل في كل فريق`);
      }
      if (room.settings.useCustom && !room.customPack.length) ERR('اكتب أسئلة الكاستم الأول أو اختار بنك الأسئلة');
      if (room.settings.useCustom && room.game === 'tamr' && room.customPack.length < 2) ERR('تمر هندي محتاج شخصيتين على الأقل في الكاستم');
      room.teams.forEach((t) => ensureCaptain(room, t.id));
      room._busy = true;
      try { await startGame(room); } finally { room._busy = false; }
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
      const rawD = Number(b.delta);
      const d = Number.isFinite(rawD) ? Math.round(rawD) : 0;
      if (!d || Math.abs(d) > 100) ERR('قيمة غير مسموحة');
      const teamId = validTeamId(room, b.team);
      addScore(room, teamId, d);
      const t = room.teams.find((x) => x.id === teamId);
      event(room, 'adjust', { team: teamId, delta: d, score: t ? t.score : 0 });
      break;
    }
    case 'end_to_lobby': {
      clearRoomTimers(room);
      room.status = 'lobby';
      room.phase = null;
      room.kr = room.sh = room.tm = room.an = null;
      room.round = -1;
      setDeadline(room, 0);
      room.paused = false;
      if (isSoloMode(room)) syncSoloTeams(room);
      room.teams.forEach((t) => (t.score = 0));
      startAiPrefetch(room);
      event(room, 'lobby', {});
      break;
    }
    case 'close_room': {
      clearRoomTimers(room);
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
      const maxIdx = Math.max(0, (room.kr.aiBluffs || []).length - 1);
      const i = Math.max(0, Math.min(maxIdx, Number(b.index) || 0));
      room.kr.aiBluffs[i] = spareBluff(room, [room.kr.truth, ...room.kr.aiBluffs, ...Object.values(room.kr.teamBluff), room.kr.adminBluff]);
      break;
    }
    case 'kr_reject': {
      if (!room.kr || room.phase !== 'review') ERR('مش وقته');
      const t = validTeamId(room, b.team);
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
      if (room.phase !== 'vote') karakPublish(room);
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
      sahlabJudge(room, validTeamId(room, b.team), !!b.correct);
      break;
    }
    case 'sh_toggle_freeze': {
      if (!room.sh || room.phase !== 'play') ERR('مش وقته');
      const t = validTeamId(room, b.team);
      room.sh.frozen[t] = b.frozen !== undefined ? !!b.frozen : !room.sh.frozen[t];
      if (room.sh.frozen[t]) {
        room.sh.pending[t] = null;
        const bothFrozen = sahlabAllFrozen(room);
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
      room.tm.turn = nextTeamId(room, room.tm.turn);
      room.tm.lastTick = Date.now();
      event(room, 'turn', { team: room.tm.turn });
      break;
    }
    case 'tm_penalty': {
      if (!room.tm || room.phase !== 'play') ERR('مش وقته');
      const t = validTeamId(room, b.team);
      room.tm.clocks[t] = Math.max(0, (room.tm.clocks[t] || 0) - 15);
      room.tm.lastTick = Date.now();
      event(room, 'penalty', { team: t, left: room.tm.clocks[t] });
      if (room.tm.clocks[t] === 0) tamrSolve(room, nextTeamId(room, t), POINTS.tamr.timeout, 'timeout');
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
      room.an.triedTeams = [];
      room.an.attempt = 0;
      room.an.eliminated = [];
      room.an.picks = [];
      room.an.winner = null;
      room.an.suggestions = Object.fromEntries(ids.map((id) => [id, {}]));
      setDeadline(room, 0);
      event(room, 'an_reset', {});
      break;
    }
    case 'an_pass_turn': {
      if (!room.an || room.phase !== 'play') ERR('مش وقته');
      const nextTeam = nextTeamId(room, room.an.buzzedTeam || ids[0]);
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
      scheduleAutoNext(room, 6);
      break;
    }

    case 'next': {
      if (room.status !== 'playing' || room._busy) ERR('مش وقته');
      const ok = (room.game === 'karak' && room.phase === 'reveal') || (room.game !== 'karak' && room.phase === 'solved');
      if (!ok) ERR('خلص الجولة الأول');
      room.paused = false;
      room._busy = true;
      try { await nextRound(room); } finally { room._busy = false; }
      break;
    }
    default:
      ERR('أكشن غير معروف');
  }
  return { room };
}

// ============================================================
// HTTP + جدار الحماية (Security Headers & Rate Limiting)
// ============================================================
const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin'
};

function applySecurityHeaders(res) {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    try { res.setHeader(k, v); } catch (e) {}
  }
}

const RATE_BUCKETS = new Map();
function checkRateLimit(req, limit = 180, windowMs = 10000) {
  const ip = String((req.headers && req.headers['x-forwarded-for']) || (req.socket && req.socket.remoteAddress) || 'unknown').split(',')[0].trim();
  const now = Date.now();
  let b = RATE_BUCKETS.get(ip);
  if (!b || now - b.start > windowMs) {
    b = { start: now, count: 0 };
    RATE_BUCKETS.set(ip, b);
    if (RATE_BUCKETS.size > 5000) {
      for (const [k, v] of RATE_BUCKETS) if (now - v.start > windowMs) RATE_BUCKETS.delete(k);
    }
  }
  b.count++;
  return b.count <= limit;
}

function safeJsonParse(raw) {
  try {
    return JSON.parse(raw || '{}', (key, val) => {
      if (FORBIDDEN_KEYS.has(key) || (key && key.startsWith('$'))) return undefined;
      return val;
    });
  } catch (e) {
    return {};
  }
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 1.2e6) req.destroy(); });
    req.on('end', () => {
      const parsed = safeJsonParse(body);
      resolve(parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {});
    });
    req.on('error', () => resolve({}));
  });
}
function json(res, code, obj) {
  applySecurityHeaders(res);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(obj));
}

const ASSETS_ROOT = path.resolve(BASE_DIR, 'assets');
const MAX_CLIENTS_PER_ROOM = 80;
const ROOM_TTL_MS = 3 * 60 * 60 * 1000; // 3 ساعات

setInterval(() => {
  const now = Date.now();
  for (const [code, r] of ROOMS) {
    if (now - (r.touched || 0) > ROOM_TTL_MS && (!r.clients || r.clients.size === 0)) {
      clearRoomTimers(r);
      ROOMS.delete(code);
    }
  }
}, 10 * 60 * 1000).unref();

const server = http.createServer(async (req, res) => {
  applySecurityHeaders(res);
  if (!['GET', 'POST', 'HEAD'].includes(req.method || '')) {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8', Allow: 'GET, POST, HEAD' });
    return res.end('Method Not Allowed');
  }
  if (!checkRateLimit(req)) {
    return json(res, 429, { ok: false, error: 'طلبات كتير في وقت قصير، استنى ثواني وجرب تاني' });
  }

  let parsed;
  try {
    parsed = url.parse(req.url || '/', true);
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Bad Request');
  }

  let p = '/';
  try {
    p = decodeURIComponent(parsed.pathname || '/');
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Bad Request');
  }
  if (p.includes('\0')) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Bad Request');
  }

  if (p === '/api/custom-packs') {
    const publicPack = (pk) => ({ id: pk.id, name: pk.name, game: pk.game, count: pk.count, items: pk.items, updatedAt: pk.updatedAt });
    const ownsPack = (pk, pid, secHash) => Boolean(pid && secHash && pk.ownerPid === pid && safeEqualSecret(pk.ownerHash, secHash));
    if (req.method === 'GET') {
      const pid = cleanId(parsed.query.pid, 40);
      const secret = cleanId(parsed.query.secret, 40);
      const secHash = secret ? hashSecret(secret) : '';
      const myPacks = pid && secHash ? SAVED_PACKS.filter((pk) => ownsPack(pk, pid, secHash)).map(publicPack) : [];
      return json(res, 200, { ok: true, packs: myPacks });
    }
    if (req.method === 'POST') {
      const b = await readBody(req);
      const pid = cleanId(b.pid, 40);
      const secret = cleanId(b.secret, 40);
      const secHash = secret ? hashSecret(secret) : '';
      if (!pid || !secHash) return json(res, 403, { ok: false, error: 'هوية غير صحيحة' });
      if (b.action === 'save') {
        const game = ['karak', 'sahlab', 'tamr', 'annab'].includes(b.game) ? b.game : 'karak';
        const items = sanitizeCustom(b.items, game);
        if (!items.length) return json(res, 200, { ok: false, error: 'مفيش أسئلة مكتوبة عشان تتحفظ' });
        const name = clean(b.name, 50) || `باقة ${game} (${items.length})`;
        const id = cleanId(b.id, 40) || ('pack_' + rid(5));
        const existingIdx = SAVED_PACKS.findIndex((x) => x.id === id);
        if (existingIdx >= 0 && SAVED_PACKS[existingIdx].ownerPid && !ownsPack(SAVED_PACKS[existingIdx], pid, secHash)) {
          return json(res, 403, { ok: false, error: 'مش مسموح تعدل باقة مش بتاعتك' });
        }
        const pack = { id, name, game, count: items.length, items, ownerPid: pid, ownerHash: secHash, updatedAt: Date.now() };
        if (existingIdx >= 0) SAVED_PACKS[existingIdx] = pack;
        else SAVED_PACKS.unshift(pack);
        if (SAVED_PACKS.length > 100) SAVED_PACKS = SAVED_PACKS.slice(0, 100);
        persistSavedPacks();
        const myPacks = SAVED_PACKS.filter((pk) => ownsPack(pk, pid, secHash)).map(publicPack);
        return json(res, 200, { ok: true, pack: publicPack(pack), packs: myPacks });
      }
      if (b.action === 'delete') {
        const id = cleanId(b.id, 40);
        SAVED_PACKS = SAVED_PACKS.filter((x) => !(x.id === id && ownsPack(x, pid, secHash)));
        persistSavedPacks();
        const myPacks = SAVED_PACKS.filter((pk) => ownsPack(pk, pid, secHash)).map(publicPack);
        return json(res, 200, { ok: true, packs: myPacks });
      }
      return json(res, 400, { ok: false, error: 'أكشن غير معروف' });
    }
  }

  if (p === '/api/action' && req.method === 'POST') {
    const b = await readBody(req);
    try {
      const out = await handleAction(b);
      if (out.room) broadcast(out.room);
      const pid = cleanId(b.pid, 40);
      return json(res, 200, { ok: true, code: out.room ? out.room.code : null, view: out.room ? viewFor(out.room, pid) : null });
    } catch (e) {
      if (!e.user) console.error(e);
      return json(res, 200, { ok: false, error: e.user ? e.message : 'حصلت مشكلة، جرب تاني' });
    }
  }

  if (p === '/api/state') {
    const code = cleanId(parsed.query.code, 10).toUpperCase();
    const room = ROOMS.get(code);
    const pid = cleanId(parsed.query.pid, 40);
    if (!room) return json(res, 404, { ok: false, error: 'الغرفة مش موجودة' });
    return json(res, 200, { ok: true, view: viewFor(room, pid) });
  }

  if (p === '/api/stream') {
    const code = cleanId(parsed.query.code, 10).toUpperCase();
    const room = ROOMS.get(code);
    const pid = cleanId(parsed.query.pid, 40);
    const secret = cleanId(parsed.query.secret, 40);
    if (!room) return json(res, 404, { ok: false, error: 'الغرفة مش موجودة' });
    if (room.clients.size >= MAX_CLIENTS_PER_ROOM) return json(res, 429, { ok: false, error: 'الغرفة وصلت للحد الأقصى من الاتصالات' });
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no'
    });
    if (res.socket && typeof res.socket.setNoDelay === 'function') res.socket.setNoDelay(true);
    const isAdm = Boolean(pid && secret && room.admin.pid === pid && safeEqualSecret(room.admin.secret, secret));
    const pl = pid && secret && Object.prototype.hasOwnProperty.call(room.players, pid) && safeEqualSecret(room.players[pid].secret, secret) ? room.players[pid] : null;
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
    const room = ROOMS.get(cleanId(parsed.query.code, 10).toUpperCase());
    return json(res, 200, { ok: !!room, game: room && room.game, status: room && room.status });
  }

  if (p === '/api/qr') {
    const room = ROOMS.get(cleanId(parsed.query.code, 10).toUpperCase());
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
      'Cache-Control': 'public, max-age=86400',
      'Content-Security-Policy': "default-src 'none'; sandbox",
      'X-Content-Type-Options': 'nosniff'
    });
    return res.end(entry.buf);
  }

  if (p === '/' || p.startsWith('/room/')) p = '/index.html';
  const isAsset = p.startsWith('/assets/') && !p.includes('..');
  if (!PUBLIC_FILES.has(p) && !isAsset) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('Not found'); }
  const fp = path.resolve(BASE_DIR, '.' + p);
  if (isAsset && !fp.startsWith(ASSETS_ROOT + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Forbidden');
  }
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
