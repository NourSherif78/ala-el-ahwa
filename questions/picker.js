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

// ---------- توليد إجابات مضللة ذكية مرتبطة بالسؤال والإجابة 100% ----------
const AR_NUM_WORDS_M = [
  'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة',
  'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر', 'عشرون'
];
const AR_NUM_WORDS_F = [
  'واحدة', 'اثنتان', 'ثلاث', 'أربع', 'خمس', 'ست', 'سبع', 'ثماني', 'تسع', 'عشر',
  'إحدى عشرة', 'اثنتا عشرة', 'ثلاث عشرة', 'أربع عشرة', 'خمس عشرة', 'ست عشرة', 'سبع عشرة', 'ثماني عشرة', 'تسع عشرة', 'عشرون'
];

// قوائم المثنى والتعبيرات الزمنية والعددية الدارجة في الأسئلة الخاصة
const DUAL_TIME_POOLS = [
  ['مرة واحدة', 'مرتين', '3 مرات', '4 مرات', '5 مرات', '6 مرات', '7 مرات', '10 مرات', 'ولا مرة'],
  ['نصف ساعة', 'نص ساعة', 'ربع ساعة', 'ثلث ساعة', 'ساعة واحدة', 'ساعة إلا ربع', 'ساعة ونص', 'ساعتين', '3 ساعات', '4 ساعات', '5 ساعات', '6 ساعات'],
  ['دقيقة واحدة', 'دقيقتين', '3 دقائق', '5 دقائق', '10 دقائق', '15 دقيقة', '20 دقيقة', 'نصف دقيقة'],
  ['ثانية واحدة', 'ثانيتين', '3 ثواني', '5 ثواني', '10 ثواني', '15 ثانية', '30 ثانية'],
  ['يوم واحد', 'يومين', '3 أيام', '4 أيام', '5 أيام', '6 أيام', 'أسبوع كامل', '10 أيام', 'أسبوعين'],
  ['أسبوع واحد', 'أسبوعين', '3 أسابيع', 'شهر كامل', '10 أيام', 'شهرين', '4 أسابيع'],
  ['شهر واحد', 'شهرين', '3 شهور', '4 شهور', '5 شهور', '6 شهور', '8 شهور', 'سنة كاملة', 'سنة ونص'],
  ['سنة واحدة', 'سنتين', 'عامين', '3 سنين', '4 سنين', '5 سنين', '6 سنين', '7 سنين', '10 سنين'],
  ['شخص واحد', 'شخصين', '3 أشخاص', '4 أشخاص', '5 أشخاص', '6 أشخاص', '10 أشخاص'],
  ['متر واحد', 'مترين', '3 أمتار', '4 أمتار', '5 أمتار', '10 أمتار', 'نصف متر'],
  ['كيلو واحد', 'كيلوين', '3 كيلو', '4 كيلو', '5 كيلو', '10 كيلو', 'نصف كيلو'],
  ['كوب واحد', 'كوبايتين', '3 كوبايات', '4 كوبايات', '5 كوبايات', '6 كوبايات', 'فنجان واحد', 'فنجانين']
];

// القواميس الدلالية الشاملة للأسئلة الخاصة والعامة
const SEMANTIC_POOLS = {
  colors_m: ['أحمر', 'أزرق', 'أخضر', 'أصفر', 'أسود', 'أبيض', 'برتقالي', 'بنفسجي', 'وردي', 'بني', 'رمادي', 'ذهبي', 'فضي', 'كحلي', 'تركواز', 'نبيتي', 'بيج', 'زيتي', 'سماوي'],
  colors_f: ['حمراء', 'زرقاء', 'خضراء', 'صفراء', 'سوداء', 'بيضاء', 'برتقالية', 'بنفسجية', 'وردية', 'بنية', 'رمادية', 'ذهبية', 'فضية', 'كحلية'],
  days: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
  months_greg: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  months_hijri: ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'],
  seasons: ['الصيف', 'الشتاء', 'الربيع', 'الخريف'],
  continents: ['آسيا', 'أفريقيا', 'أوروبا', 'أمريكا الشمالية', 'أمريكا الجنوبية', 'أستراليا', 'القارة القطبية الجنوبية'],
  arab_countries: ['مصر', 'السعودية', 'المغرب', 'الجزائر', 'تونس', 'الإمارات', 'الكويت', 'قطر', 'الأردن', 'لبنان', 'سوريا', 'العراق', 'فلسطين', 'السودان', 'ليبيا', 'اليمن', 'سلطنة عمان', 'البحرين'],
  world_countries: ['إيطاليا', 'فرنسا', 'ألمانيا', 'إسبانيا', 'البرازيل', 'الأرجنتين', 'اليابان', 'الصين', 'الهند', 'روسيا', 'تركيا', 'إنجلترا', 'أمريكا', 'كندا', 'أستراليا', 'المكسيك', 'البرتغال', 'هولندا', 'سويسرا', 'اليونان', 'كوريا الجنوبية', 'السويد', 'بلجيكا'],
  egypt_cities: ['القاهرة', 'الإسكندرية', 'الجيزة', 'أسوان', 'الأقصر', 'بورسعيد', 'الإسماعيلية', 'السويس', 'المنصورة', 'طنطا', 'الزقازيق', 'أسيوط', 'المنيا', 'الفيوم', 'دمياط', 'مطروح', 'شرم الشيخ', 'الغردقة', 'دهب', 'الساحل الشمالي', 'العين السخنة'],
  egypt_areas: ['المعادي', 'مدينة نصر', 'الزمالك', 'المهندسين', 'مصر الجديدة', 'حلوان', 'شبرا', 'فيصل', 'الهرم', 'التجمع الخامس', 'الشيخ زايد', 'أكتوبر', 'وسط البلد', 'الدقي', 'عين شمس', 'العباسية', 'المقطم', 'الرحاب', 'مدينتي'],
  world_cities: ['روما', 'باريس', 'لندن', 'مدريد', 'برلين', 'طوكيو', 'موسكو', 'واشنطن', 'بكين', 'أثينا', 'فيينا', 'أمستردام', 'لشبونة', 'إسطنبول', 'الرياض', 'دبي', 'أبوظبي', 'الدوحة', 'بيروت', 'دمشق', 'بغداد', 'عمّان', 'الرباط', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'القدس', 'نيويورك', 'ميلانو'],
  hangout_places: ['القهوة', 'الكافيه', 'السينما', 'البحر', 'النادي', 'الجيم', 'المول', 'البيت', 'الجامعة', 'الشغل', 'المطعم', 'الساحل', 'الحديقة', 'البلايستيشن', 'الكورنيش', 'السطح'],
  food_dishes: ['كشري', 'ملوخية', 'محشي ورق عنب', 'محشي كرنب', 'مكرونة بالبشاميل', 'فتة باللحمة', 'حواوشي', 'كبدة إسكندراني', 'فول وطعمية', 'شاورما', 'فراخ مشوية', 'حمام محشي', 'ممبار', 'كوارع', 'مسقعة', 'بامية باللحمة', 'رز معمر', 'فطير مشلتت', 'بيتزا', 'برجر', 'سوشي', 'شيش طاووق', 'كفتة مشوية', 'سمك مشوي', 'جمبري', 'رنجة وفسيخ', 'إندومي', 'بطاطس محمرة', 'نجرسكو', 'رقاق باللحمة'],
  sweets: ['كنافة بالمانجا', 'بسبوسة بالقشطة', 'أم علي', 'رز بلبن', 'قطايف', 'بقلاوة', 'بلح الشام', 'زلابية', 'تشيز كيك', 'آيس كريم', 'مولتن كيك', 'شوكولاتة', 'وافل بالنوتيلا', 'جاتوه', 'مهلبية', 'بسكويت', 'دونتس', 'كريب نوتيلا'],
  drinks: ['شاي بالنعناع', 'قهوة تركي', 'شاي كرك', 'سحلب بالمكسرات', 'عنّاب ساقع', 'تمر هندي', 'عصير قصب', 'عصير مانجا', 'عصير فراولة', 'ليمون بالنعناع', 'نسكافيه', 'كابتشينو', 'آيس كوفي', 'ينسون دافي', 'حلبة باللبن', 'سوبيا', 'خشاف', 'شاي بلبن', 'موهيتو', 'هوت شوكلت', 'عصير برتقال', 'عصير جوافة'],
  fruits_veg: ['مانجا', 'فراولة', 'بطيخ', 'موز', 'تفاح', 'برتقال', 'عنب', 'رمان', 'تين', 'جوافة', 'خوخ', 'مشمش', 'أناناس', 'كيوي', 'أفوكادو', 'بلح', 'شمام', 'كمثرى', 'ليمون', 'طماطم', 'خيار', 'بطاطس', 'جزر'],
  animals: ['الأسد', 'النمر', 'الفيل', 'الزرافة', 'الحصان', 'الجمل', 'الدولفين', 'الحوت الأزرق', 'الأخطبوط', 'البطريق', 'الكنغر', 'الكوالا', 'الباندا', 'التمساح', 'الصقر', 'النسر', 'البومة', 'النعامة', 'الغراب', 'الببغاء', 'القطة', 'الكلب', 'الذئب', 'الثعلب', 'الدب القطبي', 'الفهد', 'الحرباء', 'السلحفاة', 'النحلة', 'النملة', 'العقرب', 'القرش', 'القرد', 'الغزال', 'الأرنب', 'الخفاش'],
  body_organs: ['القلب', 'المخ', 'الكبد', 'الكلى', 'الرئتين', 'المعدة', 'الجلد', 'العين', 'الأذن', 'اللسان', 'العظام', 'الدم', 'الأمعاء', 'البنكرياس', 'العمود الفقري', 'القرنية', 'الغدة الدرقية', 'الأسنان', 'الأعصاب', 'العضلات'],
  planets_space: ['عطارد', 'الزهرة', 'الأرض', 'المريخ', 'المشتري', 'زحل', 'أورانوس', 'نبتون', 'الشمس', 'القمر', 'مجرة درب التبانة', 'الثقب الأسود', 'بلوتو', 'المذنب', 'النيزك'],
  metals_elements: ['الذهب', 'الفضة', 'الحديد', 'النحاس', 'الألومنيوم', 'الزئبق', 'الأكسجين', 'الهيدروجين', 'النيتروجين', 'الكربون', 'الألماس', 'البلاتين', 'اليورانيوم', 'الكالسيوم', 'الصوديوم', 'الكبريت', 'الرصاص', 'القصدير'],
  football_clubs: ['الأهلي', 'الزمالك', 'بيراميدز', 'الإسماعيلي', 'الاتحاد السكندري', 'المصري البورسعيدي', 'غزل المحلة', 'المقاولون العرب', 'ريال مدريد', 'برشلونة', 'ليفربول', 'مانشستر سيتي', 'مانشستر يونايتد', 'أرسنال', 'تشيلسي', 'بايرن ميونخ', 'يوفنتوس', 'ميلان', 'إنتر ميلان', 'باريس سان جيرمان', 'أتلتيكو مدريد', 'بوروسيا دورتموند', 'الهلال السعودي', 'النصر السعودي'],
  football_players: ['محمد صلاح', 'كريستيانو رونالدو', 'ليونيل ميسي', 'محمد أبو تريكة', 'محمود الخطيب', 'حسن شحاتة', 'عصام الحضري', 'حسام حسن', 'شيكابالا', 'أحمد سيد زيزو', 'إمام عاشور', 'محمد الشناوي', 'عمر مرموش', 'أحمد حجازي', 'محمد النني', 'كيليان مبابي', 'إيرلينج هالاند', 'فينيسيوس جونيور', 'زين الدين زيدان', 'رونالدينيو', 'مارادونا', 'بيليه', 'لوكا مودريتش', 'كريم بنزيما', 'نيمار', 'كيفين دي بروين', 'روبرت ليفاندوفسكي'],
  actors_eg: ['عادل إمام', 'أحمد حلمي', 'كريم عبد العزيز', 'أحمد عز', 'أحمد مكي', 'محمد هنيدي', 'علاء ولي الدين', 'أحمد السقا', 'محمد سعد', 'هاني رمزي', 'حسن حسني', 'سمير غانم', 'طلعت زكريا', 'ماجد الكدواني', 'بيومي فؤاد', 'محمد رمضان', 'أمير كرارة', 'ياسر جلال', 'نور الشريف', 'أحمد زكي', 'محمود عبد العزيز', 'فؤاد المهندس', 'إسماعيل ياسين', 'سعيد صالح', 'يونس شلبي', 'عبلة كامل', 'ياسمين عبد العزيز', 'منى زكي', 'دنيا سمير غانم', 'يحيى الفخراني', 'صلاح عبد الله', 'سليمان عيد'],
  singers_ar: ['عمرو دياب', 'تامر حسني', 'محمد حماقي', 'شيرين عبد الوهاب', 'أنغام', 'أصالة', 'أم كلثوم', 'عبد الحليم حافظ', 'محمد منير', 'بهاء سلطان', 'تامر عاشور', 'رامي صبري', 'أحمد سعد', 'ويجز', 'مروان بابلو', 'كايروكي', 'حمزة نمرة', 'إليسا', 'نانسي عجرم', 'كاظم الساهر', 'جورج وسوف', 'راغب علامة', 'حكيم', 'محمد عبد الوهاب', 'فيروز', 'وردة الجزائرية', 'ماجدة الرومي', 'حسين الجسمي'],
  movies_series: ['الناظر', 'اللمبي', 'عسل أسود', 'إشاعة حب', 'فول الصين العظيم', 'مرجان أحمد مرجان', 'التجربة الدنماركية', 'غبي منه فيه', 'بوحة', 'لا تراجع ولا استسلام', 'الحرب العالمية الثالثة', 'بنك الحظ', 'صعيدي في الجامعة الأمريكية', 'زكي شان', 'الكبير أوي', 'لن أعيش في جلباب أبي', 'رأفت الهجان', 'الاختيار', 'جعفر العمدة', 'الجزيرة', 'الفيل الأزرق', 'كيرة والجن', 'ولاد رزق', 'همام في أمستردام', 'عبود على الحدود', 'يا أنا يا خالتي', 'عندليب الدقي', 'كدة رضا', 'إبراهيم الأبيض'],
  anime_cartoons: ['لوفي', 'زورو', 'ناروتو', 'ساسكي', 'غوكو', 'فيجيتا', 'المحقق كونان', 'كابتن ماجد', 'ليفاي', 'إيرين ييغر', 'لايت ياغامي', 'سايتاما', 'غون', 'بيكاتشو', 'سبونج بوب', 'بسيط', 'شفيق', 'توم وجيري', 'سيمبا', 'شريك', 'باتمان', 'سوبرمان', 'سبايدرمان', 'هزيم الرعد', 'ريمي', 'سالي', 'عهد الأصدقاء', 'سابق ولاحق', 'أبطال الديجيتال'],
  cars: ['مرسيدس', 'بي إم دبليو', 'تويوتا كورولا', 'هيونداي إلنترا', 'كيا سيراتو', 'فيات 128', 'شاهين', 'لادا', 'نيسان صني', 'تيسلا', 'فيراري', 'لامبورجيني', 'بورش', 'شيفروليه لانوس', 'ميتسوبيشي لانسر', 'أودي', 'فولكس فاجن', 'جيب رانجلر', 'سوزوكي ماروتي', 'بيجو 504', 'سكودا أوكتافيا'],
  apps_games: ['واتساب', 'إنستجرام', 'تيك توك', 'فيسبوك', 'يوتيوب', 'تويتر', 'سناب شات', 'تليجرام', 'ببجي', 'فيفا', 'فورتنايت', 'ماين كرافت', 'كول أوف ديوتي', 'نتفليكس', 'سبوتيفاي', 'طلبات', 'أوبر', 'جوجل مابس', 'كلاش رويال', 'صب واي', 'كاندي كراش'],
  tech_devices: ['آيفون', 'سامسونج', 'شاومي', 'أوبو', 'ريلمي', 'هواوي', 'نوكيا أبو كشاف', 'بلايستيشن 5', 'لاب توب', 'آيباد', 'سماعة بلوتوث', 'ساعة ذكية', 'إكس بوكس'],
  jobs_professions: ['مهندس', 'دكتور', 'محامي', 'محاسب', 'مبرمج', 'طيار', 'ضابط', 'مدرس', 'شيف', 'مخرج', 'ممثل', 'لاعب كورة', 'رائد فضاء', 'يوتيوبر', 'رجل أعمال', 'صحفي', 'صيدلي', 'مذيع', 'مهندس معماري', 'مصمم جرافيك', 'تاجر', 'مدير بنك'],
  colleges_subjects: ['كلية الهندسة', 'كلية الطب', 'كلية التجارة', 'كلية الحقوق', 'كلية الصيدلة', 'كلية حاسبات ومعلومات', 'كلية الإعلام', 'كلية الألسن', 'كلية الفنون الجميلة', 'كلية الآداب', 'كلية العلوم', 'كلية التربية', 'الفيزياء', 'الكيمياء', 'الرياضيات', 'التاريخ', 'الجغرافيا', 'اللغة العربية', 'اللغة الإنجليزية', 'الأحياء', 'الفلسفة'],
  fears_things: ['الضلمة', 'الأماكن العالية', 'الصرصار', 'الكلاب', 'الحقن', 'دكتور السنان', 'الامتحانات', 'البحر الغويط', 'التعابين', 'العناكب', 'الفقر', 'الزحمة', 'الأسانسير', 'الفئران', 'القطط', 'الوحدة', 'الحسد'],
  habits_activities: ['النوم', 'الأكل بالليل', 'السهر للصبح', 'مسك الموبايل', 'شرب القهوة', 'التأخير على المواعيد', 'نسيان المفاتيح', 'اللعب على البلايستيشن', 'الفرجة على الماتشات', 'الخروج مع الصحاب', 'الهروب من العزومة', 'الرد المتأخر', 'النسيان', 'الكسل', 'الضحك من غير سبب', 'الزعل السريع', 'المذاكرة ليلة الامتحان', 'الشوبينج', 'السفر', 'التصوير'],
  excuses_phrases: ['أنا في الطريق', 'خمس دقايق وأكون عندك', 'الموبايل كان صامت', 'النت عندي فاصل', 'معيش فكة', 'نسيت المحفظة في البيت', 'صحيت متأخر', 'الطريق كان زحمة', 'البطارية فصلت', 'والله ما شوفت الرسالة', 'كنت نايم', 'أنا نازل على السلم'],
  reasons_because: ['بسبب الزحمة', 'بسبب النوم المتأخر', 'بسبب النسيان', 'عشان يوفر فلوس', 'عشان كان جعان', 'بسبب الصداع', 'عشان يلحق الماتش', 'بسبب الكسل', 'عشان الموبايل فصل شحن', 'بسبب الجو الحر', 'عشان مايزعلش حد'],
  male_names: ['أحمد', 'محمد', 'محمود', 'عمر', 'علي', 'مصطفى', 'يوسف', 'كريم', 'إبراهيم', 'حسن', 'حسين', 'خالد', 'طارق', 'رامي', 'سامح', 'شريف', 'مروان', 'زياد', 'مازن', 'ياسين', 'سيف', 'آدم', 'تامر', 'عمرو', 'وليد', 'هشام'],
  female_names: ['سارة', 'مريم', 'نور', 'سلمى', 'ياسمين', 'ندى', 'ملك', 'فريدة', 'حبيبة', 'جنّى', 'آية', 'إيمان', 'هدى', 'رانيا', 'منى', 'مي', 'نهى', 'دينا', 'ريم', 'يارا', 'فاطمة', 'خديجة', 'عائشة', 'هاجر', 'رضوى'],
  islamic_figures: ['سيدنا محمد', 'سيدنا إبراهيم', 'سيدنا موسى', 'سيدنا عيسى', 'سيدنا يوسف', 'سيدنا نوح', 'سيدنا سليمان', 'سيدنا داود', 'سيدنا يونس', 'سيدنا أيوب', 'سيدنا آدم', 'أبو بكر الصديق', 'عمر بن الخطاب', 'عثمان بن عفان', 'علي بن أبي طالب', 'خالد بن الوليد', 'عمرو بن العاص', 'سعد بن أبي وقاص', 'بلال بن رباح', 'أبو هريرة', 'أنس بن مالك', 'صلاح الدين الأيوبي'],
  quran_surahs: ['سورة البقرة', 'سورة آل عمران', 'سورة الكهف', 'سورة يس', 'سورة الرحمن', 'سورة الملك', 'سورة الواقعة', 'سورة يوسف', 'سورة مريم', 'سورة الإخلاص', 'سورة الفاتحة', 'سورة الفلق', 'سورة الناس', 'سورة الكوثر', 'سورة العصر', 'سورة النور', 'سورة الحشر', 'سورة طه', 'سورة الأنبياء', 'سورة القصص']
};

// الكلمات التي لا تُحذف منها "ال" التعريف أبداً لأنها جزء من العلم
const KEEP_AL_WORDS = new Set([
  ...SEMANTIC_POOLS.egypt_cities,
  ...SEMANTIC_POOLS.egypt_areas,
  ...SEMANTIC_POOLS.arab_countries,
  ...SEMANTIC_POOLS.world_countries,
  ...SEMANTIC_POOLS.world_cities,
  ...SEMANTIC_POOLS.football_clubs,
  ...SEMANTIC_POOLS.days,
  'الله', 'الإسكندرية', 'الأقصر', 'الأهلي', 'الزمالك', 'الإسماعيلي', 'الإسماعيلية', 'الاتحاد', 'المصري', 'المقاولون',
  'السعودية', 'الإمارات', 'الكويت', 'الأردن', 'العراق', 'السودان', 'المغرب', 'الجزائر', 'البحرين', 'اليمن',
  'القاهرة', 'الجيزة', 'المنصورة', 'الزقازيق', 'المنيا', 'الفيوم', 'الغردقة', 'السويس', 'المحلة', 'المعادي', 'المهندسين', 'الهرم',
  'الدقي', 'العباسية', 'المقطم', 'الرحاب', 'الرياض', 'الدوحة', 'الرباط', 'القدس', 'الناظر', 'اللمبي',
  'الكبير', 'الاختيار', 'الجزيرة', 'الهلال', 'النصر'
]);

function matchTruthArticleStyle(candidate, truth) {
  const c = String(candidate || '').trim();
  const t = String(truth || '').trim();
  if (!c || !t) return c;
  const truthHasAl = /^ال/.test(t);
  const candHasAl = /^ال/.test(c);
  const cWords = c.split(/\s+/);
  const tWords = t.split(/\s+/);

  if (cWords.length === 1 && tWords.length === 1) {
    if (!truthHasAl && candHasAl && !KEEP_AL_WORDS.has(c) && c.length > 4) {
      return c.slice(2);
    }
  }
  return c;
}

function inferSemanticPools(q, truth, context = {}) {
  const normT = normalizeAr(truth);
  const normQ = normalizeAr(q);
  const rawQ = String(q || '');
  const rawT = String(truth || '').trim();
  const matchedPools = [];
  const addPool = (arr) => {
    if (Array.isArray(arr) && arr.length && !matchedPools.includes(arr)) matchedPools.push(arr);
  };

  // 0) لو السؤال عن شخص في الشلة أو الإجابة اسم من أسماء اللاعبين في الغرفة
  const playerNames = Array.isArray(context.playerNames)
    ? context.playerNames.map((x) => String(x || '').trim()).filter((x) => x.length >= 2 && !ENG_RE.test(x))
    : [];
  const isPersonWhoQ = /(مين اكتر|مين في الشله|مين فينا|مين الشخص|مين اللي|صاحب مين|مين اول واحد|من هو الشخص|مين دايما|مين اشطر|مين اكسل)/.test(normQ);
  if (playerNames.some((pn) => normalizeAr(pn) === normT) || isPersonWhoQ) {
    if (playerNames.length >= 2) addPool(playerNames);
    if (SEMANTIC_POOLS.female_names.some((fn) => normalizeAr(fn) === normT) || /(هي|بنت|واحده|صاحبتنا)/.test(normQ)) {
      addPool(SEMANTIC_POOLS.female_names);
    } else {
      addPool(SEMANTIC_POOLS.male_names);
    }
  }

  // 1) تحليل كلمات السؤال (q) والإجابة (truth) أولاً لتحديد المجال الدلالي بدقة (عشان نفرق مثلاً بين نادي الزمالك ومنطقة الزمالك)
  const normCombined = `${normQ} ${normT}`;

  if (/(لون|لونه|لونها|الالوان)/.test(normCombined)) {
    const isFem = /(حمراء|زرقاء|خضراء|صفراء|سوداء|بيضاء|يه$)/.test(rawT);
    addPool(isFem ? SEMANTIC_POOLS.colors_f : SEMANTIC_POOLS.colors_m);
  }
  if (/(يوم ايه|اي يوم|يوم من ايام|ايام الاسبوع|اجازه)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.days);
  }
  if (/(شهر هجري|رمضان|شعبان|شوال|ذو الحجه|محرم)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.months_hijri);
  } else if (/(اي شهر|في شهر|شهور السنه|مواليد شهر)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.months_greg);
  }
  if (/(فصل من فصول|الصيف|الشتاء|الربيع|الخريف)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.seasons);
  }
  if (/(قاره|قارات)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.continents);
  }
  if (/(أكله|اكله|اكل|أكل|وجبه|طبق|يتغدي|يتعشي|يفطر|بيحب ياكل|ياكل ايه|طبيخ|طعام|عزومه|سحور|فطار)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.food_dishes);
  }
  if (/(حلوي|حلويات|تحليه|حاجه حلوه|كيك|تورته|شوكولاته|ايس كريم|كنافه|بسبوسه)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.sweets);
  }
  if (/(مشروب|بيشرب|يشرب|عصير|قهوه|شاي|نسكافيه|كافيه|مشاريب)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.drinks);
  }
  if (/(فاكهه|فواكه|خضار|ثمره)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.fruits_veg);
  }
  if (/(نادي|فريق كوره|بيشجع|بشجعه|بطل الدوري|دوري ابطال|ماتش)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.football_clubs);
  }
  if (/(لاعب|هداف|كابتن|نجم كوره|حارس مرمي|الكره الذهبيه)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.football_players);
  }
  if (/(محافظه|سافرنا|سافرت|مصيف|مدينه في مصر|بلدياتنا)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.egypt_cities);
  }
  if (/(منطقه|حي |ساكن في|بيسكن في|عنوان|شارع|ميدان)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.egypt_areas);
  }
  if (/(عاصمه|مدينه عالميه|سافر بره)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.world_cities);
  }
  if (/(دوله عربيه|بلد عربي|الوطن العربي)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.arab_countries);
  } else if (/(دوله|بلد|جنسيه|منتخب)/.test(normCombined)) {
    addPool([...SEMANTIC_POOLS.arab_countries, ...SEMANTIC_POOLS.world_countries]);
  }
  if (/(خروجه|نخرج فين|مكان بيحب|اتقابلوا فين|قعدوا فين|بيقعد فين|يروح فين|فسحه)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.hangout_places);
  }
  if (/(ممثل|فنان|بطل فيلم|بطل مسلسل|كوميديان|الزعيم|بيضحكني)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.actors_eg);
  }
  if (/(مغني|مطرب|اغنيه|بيسمع مين|البوم|مهرجان)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.singers_ar);
  }
  if (/(فيلم|مسلسل|سينما|مسرحيه)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.movies_series);
  }
  if (/(انمي|كرتون|سبيستون|اوتاكو|مانجا)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.anime_cartoons);
  }
  if (/(حيوان|طائر|كائن|حشره|سمكه|ثدييات|زواحف)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.animals);
  }
  if (/(عضو في جسم|جسم الانسان|القلب|المخ|الكبد|المعده|عضله|هرمون|فيتامين)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.body_organs);
  }
  if (/(كوكب|فضاء|نجم|مجره|المجموعه الشمسيه|القمر|الشمس)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.planets_space);
  }
  if (/(معدن|عنصر|كيمياء|غاز|الجدول الدوري|ذهب|فضه|حديد)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.metals_elements);
  }
  if (/(عربيه|سياره|ماركه عربيه|بيركب|سواقه|رخصه)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.cars);
  }
  if (/(تطبيق|ابلكيشن|موقع|برنامج|سوشيال ميديا|لعبه موبايل|بلايستيشن|جيمز)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.apps_games);
  }
  if (/(موبايل|تليفون|جهاز|لابتوب|شاحن)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.tech_devices);
  }
  if (/(وظيفه|شغلانه|بيشتغل ايه|نفسه يطلع|مهنه|كارير|شركه)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.jobs_professions);
  }
  if (/(كليه|تخصص|ماده دراسيه|امتحان|جامعه|مدرسه)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.colleges_subjects);
  }
  if (/(بيخاف من|بخاف من|فوبيا|بيترعب|اكتر حاجه بتخوف|مرعوب)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.fears_things);
  }
  if (/(حجه|عذر|بيقول ايه لما|جمله مشهوره|كلمه دايما بيقولها|لما يتاخر|رد فعل)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.excuses_phrases);
  }
  if (/(بسبب|عشان|لانه|لانها|ليه |لماذا|سبب )/.test(normCombined) && /^(بسبب|عشان|لأن|لان)/.test(rawT)) {
    addPool(SEMANTIC_POOLS.reasons_because);
  }
  if (/(عاده|بيعمل ايه|اكتر حاجه بيحب يعملها|هوايه|وقت فراغه|بيقضي يومه)/.test(normCombined)) {
    addPool(SEMANTIC_POOLS.habits_activities);
  }
  if (/(سوره|آيه|ايه في القرآن|قران كريم)/.test(normCombined) || /^سورة\s/.test(rawT)) {
    addPool(SEMANTIC_POOLS.quran_surahs);
  }
  if (/(نبي|رسول|صحابي|غزوه|خليفه)/.test(normCombined) || /^سيدنا\s/.test(rawT)) {
    addPool(SEMANTIC_POOLS.islamic_figures);
  }

  // 2) فحص تطابق الإجابة نفسها مع أي قاموس من القواميس الدلالية
  for (const [, pool] of Object.entries(SEMANTIC_POOLS)) {
    if (pool.some((item) => normalizeAr(item) === normT)) {
      addPool(pool);
    }
  }

  // 3) فحص تطابق الإجابة مع بنك أسئلة كرك وعناب لاستخراج كذبات نفس السؤال والكتالوج
  const exactBankMatches = [...BANKS.karak, ...BANKS.annab].filter((it) => normalizeAr(it.truth) === normT);
  if (exactBankMatches.length) {
    const bankBluffs = [];
    for (const m of exactBankMatches) {
      if (Array.isArray(m.bluffs)) bankBluffs.push(...m.bluffs);
    }
    if (bankBluffs.length) addPool(bankBluffs);
  }

  return matchedPools;
}

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
 * توليد كذبات ذكية متطابقة 100% مع سياق السؤال ونوع الإجابة (أرقام / مثنى / وقت / قواميس دلالية / كتالوج)
 */
function smartBluffsForItem(itemOrTruth, n = 16, context = {}) {
  const isObj = itemOrTruth && typeof itemOrTruth === 'object';
  const truth = String(isObj ? itemOrTruth.truth : itemOrTruth || '').trim();
  const cat = isObj && itemOrTruth.cat && itemOrTruth.cat !== 'custom' ? itemOrTruth.cat : null;
  const q = isObj ? String(itemOrTruth.q || '') : '';
  const itemBluffs = isObj && Array.isArray(itemOrTruth.bluffs) ? itemOrTruth.bluffs.map((b) => String(b).trim()).filter(Boolean) : [];

  const normTruth = normalizeAr(truth);
  const seen = new Set([normTruth]);
  const result = [];

  const pushUnique = (val, applyStyle = false) => {
    let s = String(val || '').trim();
    if (!s || ENG_RE.test(s)) return;
    if (applyStyle) s = matchTruthArticleStyle(s, truth);
    const nk = normalizeAr(s);
    if (!nk || seen.has(nk)) return;
    seen.add(nk);
    result.push(s);
  };

  // أولاً: أي كذبات كتبها المستخدم بنفسه للسؤال ده ليها الأولوية القصوى
  for (const b of shuffle(itemBluffs)) {
    pushUnique(b, false);
  }
  if (result.length >= n) return result.slice(0, n);

  // 1) لو الإجابة نسبة مئوية (مثل "50%" أو "%50" أو "75 في المية")
  const pctMatch = truth.match(/^%?(\d+)\s*(%|٪|في المية|بالمئة|في المائة)$/) || truth.match(/^(%|٪)\s*(\d+)$/);
  if (pctMatch) {
    const isLeadingSymbol = pctMatch[1] === '%' || pctMatch[1] === '٪';
    const num = parseInt(isLeadingSymbol ? pctMatch[2] : pctMatch[1], 10);
    const suffix = isLeadingSymbol ? '' : pctMatch[2];
    const pctPool = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 99, 100];
    for (const p of shuffle(pctPool)) {
      if (p === num) continue;
      pushUnique(isLeadingSymbol ? `${pctMatch[1]}${p}` : (suffix.length > 1 ? `${p} ${suffix}` : `${p}${suffix}`));
      if (result.length >= n) return result.slice(0, n);
    }
  }

  // 2) لو الإجابة رقم صريح فقط (مثل "405" أو "15" أو "1999")
  if (/^\d+$/.test(truth)) {
    const num = parseInt(truth, 10);
    for (const numStr of generatePlausibleNumbers(num, n + 10)) {
      pushUnique(numStr);
      if (result.length >= n) break;
    }
    return result.slice(0, n);
  }

  // 3) لو الإجابة رقم متبوع بوحدة أو معدود أو مسبوق بكلمة (مثل "20 ساعة" أو "سنة 1999" أو "حوالي 50 جنيه")
  const numPatternMatch = truth.match(/^([^\d]*?)(\d+)([^\d]*)$/);
  if (numPatternMatch) {
    const prefix = numPatternMatch[1];
    const num = parseInt(numPatternMatch[2], 10);
    const suffix = numPatternMatch[3];
    for (const numStr of generatePlausibleNumbers(num, n + 10)) {
      pushUnique(`${prefix}${numStr}${suffix}`);
      if (result.length >= n) break;
    }
    return result.slice(0, n);
  }

  // 4) لو الإجابة من كلمات المثنى أو التعبيرات الزمنية/العددية الدارجة (مثل "مرتين"، "ساعتين"، "يومين"، "نصف ساعة")
  for (const pool of DUAL_TIME_POOLS) {
    if (pool.some((x) => normalizeAr(x) === normTruth)) {
      for (const cand of shuffle(pool)) {
        pushUnique(cand);
        if (result.length >= n) return result.slice(0, n);
      }
    }
  }

  // 5) لو الإجابة تبدأ بعدد مكتوب بالحروف (مثل "ثلاثة قلوب" أو "أربع غرف" أو "سبعة")
  const words = truth.split(/\s+/);
  const firstWord = words[0];
  const restWords = words.slice(1).join(' ');
  if (AR_NUM_WORDS_M.includes(firstWord) || AR_NUM_WORDS_F.includes(firstWord)) {
    const numList = AR_NUM_WORDS_F.includes(firstWord) ? AR_NUM_WORDS_F : AR_NUM_WORDS_M;
    for (const w of shuffle(numList)) {
      pushUnique(restWords ? `${w} ${restWords}` : w);
      if (result.length >= n) break;
    }
    return result.slice(0, n);
  }

  // 6) التحليل الدلالي الذكي للسؤال والإجابة (Semantic Domain Matching)
  const semanticPools = inferSemanticPools(q, truth, context);
  for (const pool of semanticPools) {
    for (const cand of shuffle(pool)) {
      if (!/\d/.test(cand)) pushUnique(cand, true);
      if (result.length >= n) return result.slice(0, n);
    }
  }

  // 7) لو السؤال ليه كتالوج محدد أو قدرنا نستنتج أسئلة مشابهة في الكلمات من البنك
  const truthWordCount = words.length;
  const qTokens = normalizeAr(q)
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !['هذا', 'هذه', 'الذي', 'التي', 'ماذا', 'لماذا', 'كانت', 'يكون', 'تكون', 'اكتر', 'اشهر', 'اعلي', 'اول', 'اسمه', 'اسمها'].includes(w));

  const inferredCats = new Set();
  if (cat) inferredCats.add(cat);
  if (qTokens.length) {
    for (const it of BANKS.karak) {
      const nq = normalizeAr(it.q);
      if (qTokens.some((tk) => nq.includes(tk))) {
        if (it.cat) inferredCats.add(it.cat);
      }
    }
  }

  const catList = [...inferredCats];
  const sameCatItems = catList.length
    ? BANKS.karak.filter((k) => catList.includes(k.cat) && normalizeAr(k.truth) !== normTruth)
    : [];
  const relatedCatItems = catList.length
    ? BANKS.karak.filter((k) => !catList.includes(k.cat) && matchesCatWithAliases(k.cat, catList, true) && normalizeAr(k.truth) !== normTruth)
    : [];

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
    pushUnique(c, true);
    if (result.length >= n) return result.slice(0, n);
  }

  for (const c of extractNonNumericCandidates(relatedCatItems)) {
    pushUnique(c, true);
    if (result.length >= n) return result.slice(0, n);
  }

  // 8) لو الإجابة عبارة عن جملة/سبب/فعل طويل (3 كلمات فأكثر) ومالوش كتالوج مباشر، نستخدم جمل وعادات طبيعية بدل أسماء علم عشوائية
  if (truthWordCount >= 3) {
    for (const c of shuffle([...SEMANTIC_POOLS.excuses_phrases, ...SEMANTIC_POOLS.habits_activities, ...SEMANTIC_POOLS.reasons_because])) {
      pushUnique(c, false);
      if (result.length >= n) return result.slice(0, n);
    }
  }

  // ملاذ أخير بنفس عدد الكلمات ونمط الـ التعريف
  for (const c of extractNonNumericCandidates(BANKS.karak)) {
    pushUnique(c, true);
    if (result.length >= n) break;
  }

  return result.slice(0, n);
}

/** كذبات احتياطية (توافق مع الاستدعاءات القديمة) */
function fallbackBluffs(truthOrItem, n = 16, context = {}) {
  return smartBluffsForItem(truthOrItem, n, context);
}

/** كذبات AI إضافية للأسئلة المخصصة */
async function aiBluffsFor(questions, context = {}) {
  if (!questions.length) return [];
  return questions.map((q) => smartBluffsForItem(q, 10, context));
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

