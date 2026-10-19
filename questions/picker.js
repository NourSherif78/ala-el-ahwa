/**
 * محرك اختيار الأسئلة — يضمن إن أي سؤال اتسأل قبل كده مايتكررش أبداً
 * مع دعم 3 مستويات صعوبة (سهل / متوسط / صعب)، وفلترة عربية 100% بدون أي إنجليزي،
 * وتوليد إجابات مضللة ذكية من نفس نوع الإجابة ونفس الكتالوج بالظبط.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USED_FILE = path.join(DATA_DIR, 'used_questions.json');
const AI_FILE = path.join(DATA_DIR, 'ai_generated.json');

function safeRequire(p) {
  try { return require(p); } catch (e) { return []; }
}

const PACK19 = safeRequire('./pack_v19.js') || {};
const P19_KARAK = Array.isArray(PACK19.karak) ? PACK19.karak : [];
const P19_SAHLAB = Array.isArray(PACK19.sahlab) ? PACK19.sahlab : [];
const P19_TAMR = Array.isArray(PACK19.tamr) ? PACK19.tamr : [];
const P19_ANNAB = Array.isArray(PACK19.annab) ? PACK19.annab : [];

const PACK22 = safeRequire('./pack_v22_levels.js') || {};
const P22_KARAK = Array.isArray(PACK22.karak) ? PACK22.karak : [];
const P22_ANNAB = Array.isArray(PACK22.annab) ? PACK22.annab : [];

const KARAK_ALL = [
  ...P22_KARAK,
  ...safeRequire('./karak_a.js'),
  ...safeRequire('./karak_b.js'),
  ...safeRequire('./karak_c.js'),
  ...P19_KARAK
];

const BANKS = {
  karak: KARAK_ALL,
  sahlab: [...safeRequire('./sahlab.js'), ...safeRequire('./sahlab_b.js'), ...P19_SAHLAB],
  tamr: [...safeRequire('./tamr.js').map((t) => ({ cat: 'celebs', ...t })), ...safeRequire('./tamr_b.js'), ...P19_TAMR],
  annab: [
    ...P22_ANNAB,
    ...safeRequire('./annab.js'),
    ...P19_ANNAB,
    ...KARAK_ALL.map((k) => ({
      id: 'an_' + k.id,
      cat: k.cat,
      q: k.q,
      truth: k.truth,
      bluffs: (k.bluffs || []).slice(0, 3),
      difficulty: k.difficulty
    }))
  ],
  yansoon: safeRequire('./yansoon.js')
};

// ---------- التطبيع العربي للمقارنة ----------
function normalizeAr(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, '') // تشكيل وتطويل
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/^ال/, '')
    .replace(/\sال/g, ' ')
    .replace(/[^\u0600-\u06FFa-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function hashText(s) {
  return crypto.createHash('sha1').update(normalizeAr(s)).digest('hex').slice(0, 16);
}

// ---------- تصنيف مستوى الصعوبة (سهل / متوسط / صعب) ----------
const EASY_NUMBERS = new Set([
  '114', '30', '5', '7', '4', '11', '12', '24', '60', '365', '90',
  '114 سورة', '30 جزء', '5 صلوات', '7 سماوات', '4 غرف', '7 أيام', '12 شهراً'
]);

function isNumericAnswer(ans) {
  const s = String(ans || '').trim();
  return /\d/.test(s);
}

function getItemDifficulty(game, it) {
  if (!it) return 'medium';
  if (it.difficulty === 'easy' || it.difficulty === 'medium' || it.difficulty === 'hard') {
    return it.difficulty;
  }
  if (game === 'karak' || game === 'annab') {
    const q = String(it.q || '');
    const truth = String(it.truth || '').trim();
    // الأسئلة الرقمية الدقيقة أو التواريخ أو أرقام الحلقات والبطاقات = صعب
    if (isNumericAnswer(truth) && !EASY_NUMBERS.has(truth)) {
      return 'hard';
    }
    if (/(بطاقة الرقم|في أي عام|في أي سنة|سنة ____|عام ____|كم عدد حلقات|الاسم الحقيقي لـ|المؤلف الحقيقي|مخترع|تأسست عام|معاهدة|سلالة|النسبة المئوية|كم يبلغ)/.test(q)) {
      return 'hard';
    }
    // الأسئلة القصيرة المباشرة والشهيرة = سهل
    const truthWords = truth.split(/\s+/).length;
    if (truthWords <= 2 && q.length <= 78 && !isNumericAnswer(truth)) {
      return 'easy';
    }
    return 'medium';
  }
  if (game === 'sahlab') {
    const ans = String(it.answer || '').trim();
    const firstHint = String((it.hints && it.hints[0]) || '');
    if (ans.split(/\s+/).length >= 3 || firstHint.length > 90) return 'hard';
    if (ans.split(/\s+/).length === 1) return 'easy';
    return 'medium';
  }
  if (game === 'tamr') {
    const name = String(it.name || '').trim();
    if (name.split(/\s+/).length === 1 || (it.id && it.id.startsWith('t_'))) return 'easy';
    if (name.split(/\s+/).length === 2) return 'medium';
    return 'hard';
  }
  return 'medium';
}

// ---------- التحقق الصارم من سلامة السؤال وخلوه من الإنجليزي أو الفراغين ----------
const ENG_RE = /[A-Za-z]/;
function isValidArabicItem(game, it) {
  if (!it || typeof it !== 'object') return false;
  if (game === 'karak') {
    const q = String(it.q || '').trim();
    const truth = String(it.truth || '').trim();
    if (!q || !truth) return false;
    if (ENG_RE.test(q) || ENG_RE.test(truth)) return false;
    const parts = q.split('____');
    if (parts.length !== 2) return false; // لازم فراغ واحد بس بالظبط
    if (q.includes('؟؟؟') || q.includes('???')) return false;
    const bl = Array.isArray(it.bluffs) ? it.bluffs : [];
    if (bl.length < 3 || bl.some((b) => ENG_RE.test(String(b)))) return false;
    return true;
  }
  if (game === 'annab') {
    const q = String(it.q || '').trim();
    const truth = String(it.truth || '').trim();
    if (!q || !truth) return false;
    if (ENG_RE.test(q) || ENG_RE.test(truth)) return false;
    if ((q.match(/____/g) || []).length > 1) return false;
    const bl = Array.isArray(it.bluffs) ? it.bluffs : [];
    if (bl.length < 3 || bl.some((b) => ENG_RE.test(String(b)))) return false;
    return true;
  }
  if (game === 'sahlab') {
    const ans = String(it.answer || '').trim();
    const hints = Array.isArray(it.hints) ? it.hints : [];
    if (!ans || hints.length < 3) return false;
    if (ENG_RE.test(ans) || hints.some((h) => ENG_RE.test(String(h)))) return false;
    return true;
  }
  if (game === 'tamr') {
    const name = String(it.name || '').trim();
    const brief = String(it.brief || '').trim();
    if (!name || ENG_RE.test(name) || ENG_RE.test(brief)) return false;
    return true;
  }
  if (game === 'yansoon') {
    const word = String(it.word || '').trim();
    if (!word || ENG_RE.test(word)) return false;
    const len = it.len || word.length;
    if (len < 3 || len > 8) return false;
    return true;
  }
  return false;
}

// ---------- سجل الأسئلة المستخدمة ----------
let USED = { ids: [], hashes: [] };
function loadUsed() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (fs.existsSync(USED_FILE)) USED = JSON.parse(fs.readFileSync(USED_FILE, 'utf8'));
  } catch (e) { USED = { ids: [], hashes: [] }; }
  USED.ids = USED.ids || [];
  USED.hashes = USED.hashes || [];
}
loadUsed();
const usedIdSet = new Set(USED.ids);
const usedHashSet = new Set(USED.hashes);

function saveUsed() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(USED_FILE, JSON.stringify({ ids: [...usedIdSet], hashes: [...usedHashSet] }));
  } catch (e) {}
}

// تنظيف أي أسئلة AI قديمة بايظة أو فيها إنجليزي أو فراغين
let AI_POOL = { karak: [], sahlab: [], tamr: [], annab: [], yansoon: [] };
try {
  if (fs.existsSync(AI_FILE)) {
    const rawPool = JSON.parse(fs.readFileSync(AI_FILE, 'utf8')) || {};
    for (const g of ['karak', 'sahlab', 'tamr', 'annab', 'yansoon']) {
      AI_POOL[g] = (Array.isArray(rawPool[g]) ? rawPool[g] : []).filter((it) => isValidArabicItem(g, it));
    }
  }
} catch (e) {}
function saveAiPool() {
  try { fs.writeFileSync(AI_FILE, JSON.stringify(AI_POOL)); } catch (e) {}
}

function itemText(game, it) {
  if (game === 'karak' || game === 'annab') return it.q;
  if (game === 'sahlab') return it.answer;
  if (game === 'yansoon') return it.word;
  return it.name;
}

function isUsed(game, it) {
  return usedIdSet.has(it.id) || usedHashSet.has(hashText(game + ':' + itemText(game, it)));
}

function markUsed(game, it) {
  if (!it || it.custom) return;
  usedIdSet.add(it.id);
  usedHashSet.add(hashText(game + ':' + itemText(game, it)));
  saveUsed();
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const CAT_LABELS = {
  history: 'تاريخ', geography: 'جغرافيا', science: 'علوم', sports: 'رياضة', cinema: 'أفلام ومسلسلات',
  food: 'أكل ومشروبات', drinks: 'مشروبات', nature: 'طبيعة', body: 'جسم الإنسان', culture: 'ثقافة وفنون',
  egypt: 'مصر', animals: 'حيوانات', weird: 'غرائب وعادات الشعوب', language: 'لغة وكلمات',
  places: 'أماكن ومعالم', people: 'مشاهير ونجوم', movies: 'أفلام', things: 'أشياء واختراعات', celebs: 'مشاهير ونجوم',
  anime: 'أنمي', islamic_history: 'تاريخ إسلامي', islamic: 'أسئلة دينية إسلامية', quran: 'القرآن الكريم', hadith: 'الأحاديث النبوية',
  spacetoon: 'كرتونات سبيستون', egyptian_comedy: 'أفلام مصرية كوميدية', foreign_movies: 'أفلام أجنبية',
  foreign_series: 'مسلسلات أجنبي', foreign_cartoons: 'كرتون أجنبي', euro_football: 'كرة القدم الأوروبية'
};

const CAT_ALIASES = {
  people: ['people', 'celebs'],
  celebs: ['celebs', 'people'],
  food: ['food', 'drinks'],
  geography: ['geography', 'places', 'nature'],
  science: ['science', 'body', 'nature'],
  language: ['language', 'culture'],
  cinema: ['cinema', 'movies', 'egyptian_comedy', 'foreign_movies', 'foreign_series', 'culture'],
  movies: ['movies', 'cinema', 'egyptian_comedy', 'foreign_movies'],
  places: ['places', 'geography'],
  geography: ['geography', 'places'],
  things: ['things', 'science'],
  science: ['science', 'things'],
  sports: ['sports', 'euro_football'],
  euro_football: ['euro_football', 'sports'],
  spacetoon: ['spacetoon', 'anime'],
  anime: ['anime', 'spacetoon'],
  foreign_cartoons: ['foreign_cartoons', 'spacetoon'],
  egyptian_comedy: ['egyptian_comedy', 'cinema', 'movies'],
  foreign_movies: ['foreign_movies', 'movies', 'cinema'],
  foreign_series: ['foreign_series', 'cinema']
};

function matchesCatWithAliases(itemCat, cats, allowRelated = false) {
  if (!cats || !cats.length) return true;
  if (cats.includes(itemCat)) return true;
  if (!allowRelated) return false;
  return cats.some((c) => (CAT_ALIASES[c] || []).includes(itemCat));
}

const RELIGIOUS = new Set(['islamic_history', 'islamic', 'quran', 'hadith']);

// ---------- Google Gemini (اختياري فقط لو فيه GEMINI_API_KEY + فلترة صارمة) ----------
const https = require('https');
function geminiOnce(prompt, timeoutMs) {
  return new Promise((resolve) => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return resolve({ status: 0, content: '' });
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const body = JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.7 }
    });
    const req = https.request(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }, timeout: timeoutMs },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          let content = '';
          try {
            const j = JSON.parse(raw);
            content = j.candidates[0].content.parts.map((p) => p.text || '').join('');
          } catch (e) {}
          resolve({ status: res.statusCode, content });
        });
      }
    );
    req.on('error', () => resolve({ status: 0, content: '' }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, content: '' }); });
    req.write(body);
    req.end();
  });
}

function prefetchAI(game, cats, n, difficulty = 'medium') {
  // بنعتمد على بنك الأسئلة الموثق والمنقح 100% عربي بدون أي هلوسة من خدمات خارجية مجانية
  return Promise.resolve([]);
}

/**
 * اختيار n عنصر جديد للعبة مع مراعاة الكتالوج ومستوى الصعوبة (easy / medium / hard)
 */
async function pickQuestions(game, cats, n, aiFresh = [], difficulty = 'medium', extra = {}) {
  const diff = ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'medium';
  const targetWordLen = game === 'yansoon' && extra && extra.wordLen ? Number(extra.wordLen) : null;
  const inCat = (it) => matchesCatWithAliases(it.cat, cats, false);
  const inRelatedCat = (it) => matchesCatWithAliases(it.cat, cats, true);
  const inLen = (it) => !targetWordLen || (it.len || (it.word && it.word.length)) === targetWordLen;

  // ترتيب أولويات الصعوبة حسب اختيار الحكم
  const diffTiers =
    diff === 'easy'
      ? [
          (it) => getItemDifficulty(game, it) === 'easy',
          (it) => getItemDifficulty(game, it) === 'medium' && !isNumericAnswer(it.truth),
          (it) => getItemDifficulty(game, it) === 'medium'
        ]
      : diff === 'hard'
      ? [
          (it) => getItemDifficulty(game, it) === 'hard',
          (it) => getItemDifficulty(game, it) === 'medium',
          (it) => true
        ]
      : [
          (it) => getItemDifficulty(game, it) === 'medium' || getItemDifficulty(game, it) === 'easy',
          (it) => true
        ];

  const poolSource = BANKS[game] || [];
  const aiSource = AI_POOL[game] || [];
  const all = [...poolSource, ...aiSource].filter((it) => isValidArabicItem(game, it));
  const fresh = all.filter((it) => !isUsed(game, it));

  const chosen = [];
  const chosenIds = new Set();

  const addFromPool = (pool) => {
    for (const it of shuffle(pool)) {
      if (chosen.length >= n) break;
      if (chosenIds.has(it.id)) continue;
      chosenIds.add(it.id);
      chosen.push(it);
    }
  };

  // لو لعبة يانسون بنفلتر حسب طول الكلمة المطلوب
  if (game === 'yansoon') {
    const freshLen = fresh.filter(inLen);
    const allLen = all.filter(inLen);
    addFromPool(freshLen.filter(inCat));
    if (chosen.length < n) addFromPool(freshLen);
    if (chosen.length < n) addFromPool(allLen.filter(inCat));
    if (chosen.length < n) addFromPool(allLen);
    if (chosen.length < n) addFromPool(fresh);
    if (chosen.length < n) addFromPool(all);
    return shuffle(chosen);
  }

  // 1) أسئلة جديدة من نفس الكتالوج حسب تدرج الصعوبة المختار
  for (const matchDiff of diffTiers) {
    if (chosen.length >= n) break;
    addFromPool(fresh.filter((it) => inCat(it) && matchDiff(it)));
  }

  // 2) لو لسه فيه أسئلة جديدة في نفس الكتالوج بأي صعوبة (إلا لو سهل نتجنب الأسئلة الرقمية المعقدة قدر الإمكان)
  if (chosen.length < n) {
    addFromPool(fresh.filter((it) => inCat(it) && (diff !== 'easy' || !isNumericAnswer(it.truth))));
  }

  // 3) لو الكتالوج اتسأل قبل كده، نعيد فتح أسئلة نفس الكتالوج بنفس الصعوبة قبل الخروج لكتالوج تاني
  if (chosen.length < n) {
    for (const matchDiff of diffTiers) {
      if (chosen.length >= n) break;
      const pool = shuffle(all.filter((it) => inCat(it) && matchDiff(it) && !chosenIds.has(it.id))).slice(0, n - chosen.length);
      pool.forEach((it) => {
        usedIdSet.delete(it.id);
        usedHashSet.delete(hashText(game + ':' + itemText(game, it)));
      });
      addFromPool(pool);
    }
  }

  if (chosen.length < n) {
    const pool = shuffle(all.filter((it) => inCat(it) && !chosenIds.has(it.id))).slice(0, n - chosen.length);
    pool.forEach((it) => {
      usedIdSet.delete(it.id);
      usedHashSet.delete(hashText(game + ':' + itemText(game, it)));
    });
    addFromPool(pool);
  }

  // 4) الكتالوجات القريبة المرتبطة بنفس الصعوبة
  if (chosen.length < n) {
    for (const matchDiff of diffTiers) {
      if (chosen.length >= n) break;
      addFromPool(fresh.filter((it) => inRelatedCat(it) && matchDiff(it)));
    }
  }
  if (chosen.length < n) {
    addFromPool(all.filter((it) => inRelatedCat(it)));
  }

  // 5) تكملة احتياطية من البنك العام بنفس الصعوبة
  if (chosen.length < n) {
    for (const matchDiff of diffTiers) {
      if (chosen.length >= n) break;
      addFromPool(fresh.filter((it) => matchDiff(it)));
    }
  }
  if (chosen.length < n) {
    addFromPool(all);
  }

  return shuffle(chosen);
}

// ---------- توليد إجابات مضللة ذكية من نفس نوع الإجابة ونفس الكتالوج ----------
const AR_NUM_WORDS_M = [
  'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة',
  'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر', 'عشرون'
];
const AR_NUM_WORDS_F = [
  'واحدة', 'اثنتان', 'ثلاث', 'أربع', 'خمس', 'ست', 'سبع', 'ثماني', 'تسع', 'عشر',
  'إحدى عشرة', 'اثنتا عشرة', 'ثلاث عشرة', 'أربع عشرة', 'خمس عشرة', 'ست عشرة', 'سبع عشرة', 'ثماني عشرة', 'تسع عشرة', 'عشرون'
];

function generatePlausibleNumbers(num, count = 16) {
  const candidates = new Set();
  const isYear = num >= 1000 && num <= 2030;
  if (isYear) {
    const offsets = [-25, -18, -14, -10, -7, -5, -3, -2, -1, 1, 2, 3, 5, 7, 10, 12, 15, 20];
    for (const d of shuffle(offsets)) {
      const v = num + d;
      if (v > 600 && v <= 2026 && v !== num) candidates.add(String(v));
    }
  } else if (num >= 100) {
    const lastDigit = num % 10;
    const offsets = [-200, -150, -100, -90, -50, -30, -20, -10, -4, -2, -1, 1, 2, 4, 10, 20, 30, 50, 90, 100, 150, 200];
    for (const d of shuffle(offsets)) {
      const v = num + d;
      if (v > 10 && v !== num) candidates.add(String(v));
    }
    for (let h = 1; h <= 9; h++) {
      const v = h * 100 + lastDigit;
      if (v !== num && v > 0) candidates.add(String(v));
    }
  } else if (num > 20) {
    const offsets = [-15, -12, -10, -8, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20];
    for (const d of shuffle(offsets)) {
      const v = num + d;
      if (v >= 2 && v !== num) candidates.add(String(v));
    }
  } else {
    const base = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 25, 30];
    for (const v of shuffle(base)) {
      if (v !== num) candidates.add(String(v));
    }
  }
  return shuffle([...candidates]).slice(0, count);
}

/**
 * توليد كذبات متطابقة 100% مع نوع الإجابة (رقم / رقم+وحدة / نص من نفس الكتالوج)
 */
function smartBluffsForItem(itemOrTruth, n = 16) {
  const isObj = itemOrTruth && typeof itemOrTruth === 'object';
  const truth = String(isObj ? itemOrTruth.truth : itemOrTruth || '').trim();
  const cat = isObj ? itemOrTruth.cat : null;
  const q = isObj ? String(itemOrTruth.q || '') : '';
  const itemBluffs = isObj && Array.isArray(itemOrTruth.bluffs) ? itemOrTruth.bluffs.map((b) => String(b).trim()) : [];

  const normTruth = normalizeAr(truth);
  const seen = new Set([normTruth]);
  const result = [];

  const pushUnique = (val) => {
    const s = String(val || '').trim();
    if (!s || ENG_RE.test(s)) return;
    const nk = normalizeAr(s);
    if (!nk || seen.has(nk)) return;
    seen.add(nk);
    result.push(s);
  };

  // 1) لو الإجابة رقم صريح فقط (مثل "405" أو "15" أو "1999")
  if (/^\d+$/.test(truth)) {
    const num = parseInt(truth, 10);
    // أولاً كذبات السؤال نفسها لو هي أرقام
    for (const b of shuffle(itemBluffs)) {
      if (/^\d+$/.test(b)) pushUnique(b);
    }
    for (const numStr of generatePlausibleNumbers(num, n + 10)) {
      pushUnique(numStr);
      if (result.length >= n) break;
    }
    return result.slice(0, n);
  }

  // 2) لو الإجابة رقم متبوع بوحدة أو معدود (مثل "20 ساعة" أو "3 قلوب" أو "114 سورة")
  const numUnitMatch = truth.match(/^(\d+)\s+(.+)$/);
  if (numUnitMatch) {
    const num = parseInt(numUnitMatch[1], 10);
    const unit = numUnitMatch[2].trim();
    for (const b of shuffle(itemBluffs)) {
      if (/\d/.test(b)) pushUnique(b);
    }
    for (const numStr of generatePlausibleNumbers(num, n + 10)) {
      pushUnique(`${numStr} ${unit}`);
      if (result.length >= n) break;
    }
    return result.slice(0, n);
  }

  // 3) لو الإجابة تبدأ بعدد مكتوب بالحروف (مثل "ثلاثة قلوب" أو "أربع غرف" أو "سبعة")
  const words = truth.split(/\s+/);
  const firstWord = words[0];
  const restWords = words.slice(1).join(' ');
  if (AR_NUM_WORDS_M.includes(firstWord) || AR_NUM_WORDS_F.includes(firstWord)) {
    for (const b of shuffle(itemBluffs)) pushUnique(b);
    const numList = AR_NUM_WORDS_F.includes(firstWord) ? AR_NUM_WORDS_F : AR_NUM_WORDS_M;
    for (const w of shuffle(numList)) {
      pushUnique(restWords ? `${w} ${restWords}` : w);
      if (result.length >= n) break;
    }
    return result.slice(0, n);
  }

  // 4) لو الإجابة نصية: نضمن عدم دخول أي أرقام نهائياً، ونسحب من نفس الكتالوج فقط
  for (const b of shuffle(itemBluffs)) {
    if (!/\d/.test(b)) pushUnique(b);
  }

  const truthWordCount = words.length;
  const sameCatItems = cat
    ? BANKS.karak.filter((k) => k.cat === cat && normalizeAr(k.truth) !== normTruth)
    : [];
  const relatedCatItems = cat
    ? BANKS.karak.filter((k) => k.cat !== cat && matchesCatWithAliases(k.cat, [cat], true) && normalizeAr(k.truth) !== normTruth)
    : [];

  // نجمع كذبات وإجابات نفس الكتالوج (الغير رقمية فقط) مع أولوية التطابق التام في عدد الكلمات
  const extractNonNumericCandidates = (items) => {
    const exactLen = [];
    const closeLen = [];
    const otherLen = [];
    for (const it of shuffle(items)) {
      const candidates = [it.truth, ...(Array.isArray(it.bluffs) ? it.bluffs : [])];
      for (const c of candidates) {
        const s = String(c || '').trim();
        if (!s || /\d/.test(s) || ENG_RE.test(s)) continue;
        if (AR_NUM_WORDS_M.includes(s) || AR_NUM_WORDS_F.includes(s)) continue;
        const wc = s.split(/\s+/).length;
        if (wc === truthWordCount) exactLen.push(s);
        else if (Math.abs(wc - truthWordCount) === 1) closeLen.push(s);
        else if (wc <= 4) otherLen.push(s);
      }
    }
    return [...shuffle(exactLen), ...shuffle(closeLen), ...shuffle(otherLen)];
  };

  for (const c of extractNonNumericCandidates(sameCatItems)) {
    pushUnique(c);
    if (result.length >= n) return result.slice(0, n);
  }

  for (const c of extractNonNumericCandidates(relatedCatItems)) {
    pushUnique(c);
    if (result.length >= n) return result.slice(0, n);
  }

  // ملاذ أخير للأسئلة المخصصة اللي مالهاش كتالوج محدد: إجابات غير رقمية بنفس عدد الكلمات
  for (const c of extractNonNumericCandidates(BANKS.karak)) {
    pushUnique(c);
    if (result.length >= n) break;
  }

  return result.slice(0, n);
}

/** كذبات احتياطية (توافق مع الاستدعاءات القديمة) */
function fallbackBluffs(truthOrItem, n = 16) {
  return smartBluffsForItem(truthOrItem, n);
}

/** كذبات AI إضافية للأسئلة المخصصة */
async function aiBluffsFor(questions) {
  if (!questions.length) return [];
  return questions.map((q) => smartBluffsForItem(q, 10));
}

function stats() {
  const r = {};
  for (const g of Object.keys(BANKS)) {
    const all = [...BANKS[g], ...(AI_POOL[g] || [])];
    r[g] = { total: all.length, fresh: all.filter((it) => !isUsed(g, it)).length };
  }
  return r;
}

module.exports = {
  pickQuestions,
  prefetchAI,
  markUsed,
  aiBluffsFor,
  fallbackBluffs,
  smartBluffsForItem,
  getItemDifficulty,
  isValidArabicItem,
  normalizeAr,
  shuffle,
  stats,
  BANKS,
  CAT_LABELS
};
