/**
 * محرك اختيار الأسئلة — يضمن إن أي سؤال اتسأل قبل كده مايتكررش أبداً
 * (السجل محفوظ في data/used_questions.json ويفضل موجود حتى بعد إعادة تشغيل السيرفر)
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

const BANKS = {
  karak: [...safeRequire('./karak_a.js'), ...safeRequire('./karak_b.js')],
  sahlab: safeRequire('./sahlab.js'),
  tamr: safeRequire('./tamr.js')
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

// أسئلة الـ AI اللي اتولدت قبل كده تتحفظ (عشان لو اتولدت ومااتسألتش تفضل متاحة)
let AI_POOL = { karak: [], sahlab: [], tamr: [] };
try { if (fs.existsSync(AI_FILE)) AI_POOL = { ...AI_POOL, ...JSON.parse(fs.readFileSync(AI_FILE, 'utf8')) }; } catch (e) {}
function saveAiPool() {
  try { fs.writeFileSync(AI_FILE, JSON.stringify(AI_POOL)); } catch (e) {}
}

function itemText(game, it) {
  if (game === 'karak') return it.q;
  if (game === 'sahlab') return it.answer;
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

// ---------- توليد بالذكاء الاصطناعي من النت (pollinations) ----------
const https = require('https');
function fetchText(targetUrl, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const req = https.get(targetUrl, { headers: { 'User-Agent': 'AlaElAhwa/14' }, timeout: timeoutMs }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchText(res.headers.location, timeoutMs).then(resolve).catch(reject);
      }
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => resolve(raw));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function extractJsonArray(raw) {
  if (Array.isArray(raw)) return raw;
  const m = String(raw || '').match(/\[[\s\S]*\]/);
  if (!m) return [];
  try { return JSON.parse(m[0]); } catch (e) { return []; }
}

const CAT_LABELS = {
  history: 'تاريخ', geography: 'جغرافيا', science: 'علوم', sports: 'رياضة', cinema: 'أفلام ومسلسلات',
  food: 'أكل ومشروبات', egypt: 'مصر', animals: 'حيوانات', weird: 'غرائب وعادات الشعوب', language: 'لغة وكلمات',
  places: 'أماكن', people: 'مشاهير', movies: 'أفلام', things: 'أشياء'
};

async function aiGenerate(game, cats, count) {
  const topic = (cats && cats.length ? cats : ['weird', 'science', 'history']).map((c) => CAT_LABELS[c] || c).join('، ');
  const avoid = [...BANKS[game], ...AI_POOL[game]].slice(-25).map((it) => itemText(game, it)).join(' | ');
  let prompt;
  if (game === 'karak') {
    prompt = `اكتب ${count} أسئلة لعبة خداع جماعية زي Fibbage بالعربي. المواضيع: ${topic}. كل سؤال حقيقة غريبة وحقيقية فيها فراغ ____ والإجابة الصح قصيرة (1-4 كلمات). أرجع JSON Array فقط بالشكل: [{"q":"... ____ ...","truth":"...","bluffs":["كذبة1","كذبة2","كذبة3","كذبة4"]}]. ماتكررش دول: ${avoid}`;
  } else if (game === 'sahlab') {
    prompt = `اكتب ${count} عناصر للعبة تخمين بالتلميحات بالعربي. المواضيع: ${topic}. كل عنصر شيء أو مكان أو شخص مشهور مع 5 تلميحات من الأصعب للأسهل ولا تذكر الإجابة في التلميحات. أرجع JSON Array فقط: [{"answer":"...","aliases":["..."],"imageQuery":"English Wikipedia title","hints":["...","...","...","...","..."]}]. ماتكررش: ${avoid}`;
  } else {
    prompt = `اكتب ${count} شخصيات مشهورة جداً عند الجمهور المصري والعربي للعبة Guess Who. أرجع JSON Array فقط: [{"name":"...","brief":"وصف في سطر","imageQuery":"English Wikipedia title"}]. ماتكررش: ${avoid}`;
  }
  try {
    const raw = await fetchText(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?json=true&seed=${Date.now() % 100000}`);
    const arr = extractJsonArray(raw);
    const out = [];
    for (const it of arr) {
      let item = null;
      if (game === 'karak' && it.q && it.truth) {
        const q = String(it.q).includes('____') ? String(it.q) : String(it.q) + ' ____';
        const bl = (Array.isArray(it.bluffs) ? it.bluffs : []).map(String).filter((b) => normalizeAr(b) !== normalizeAr(it.truth));
        if (bl.length < 2) continue;
        item = { id: 'ai_k_' + hashText(q), cat: (cats && cats[0]) || 'weird', q, truth: String(it.truth), bluffs: bl.slice(0, 4), ai: true };
      } else if (game === 'sahlab' && it.answer && Array.isArray(it.hints) && it.hints.length >= 3) {
        item = { id: 'ai_s_' + hashText(it.answer), cat: (cats && cats[0]) || 'things', answer: String(it.answer), aliases: it.aliases || [], imageQuery: it.imageQuery || it.answer, hints: it.hints.slice(0, 5).map(String), ai: true };
      } else if (game === 'tamr' && it.name) {
        item = { id: 'ai_t_' + hashText(it.name), name: String(it.name), brief: String(it.brief || ''), imageQuery: it.imageQuery || it.name, ai: true };
      }
      if (item && !isUsed(game, item) && !AI_POOL[game].some((x) => x.id === item.id)) out.push(item);
    }
    if (out.length) { AI_POOL[game].push(...out); saveAiPool(); }
    return out;
  } catch (e) {
    return [];
  }
}

/**
 * اختيار n عنصر جديد تماماً (مااتسألش قبل كده) للعبة
 */
async function pickQuestions(game, cats, n) {
  const all = [...BANKS[game], ...AI_POOL[game]];
  const fresh = all.filter((it) => !isUsed(game, it));
  const inCats = cats && cats.length && game !== 'tamr' ? fresh.filter((it) => cats.includes(it.cat)) : fresh;
  let chosen = shuffle(inCats).slice(0, n);
  if (chosen.length < n) {
    const ids = new Set(chosen.map((c) => c.id));
    chosen.push(...shuffle(fresh.filter((it) => !ids.has(it.id))).slice(0, n - chosen.length));
  }
  let tries = 0;
  while (chosen.length < n && tries < 3) {
    tries++;
    const gen = await aiGenerate(game, cats, Math.min(10, n - chosen.length + 2));
    const ids = new Set(chosen.map((c) => c.id));
    chosen.push(...gen.filter((g) => !ids.has(g.id)).slice(0, n - chosen.length));
  }
  return chosen;
}

/** كذبات AI إضافية لسؤال (لو محتاجين بدائل أو الأسئلة المخصصة) */
async function aiBluffsFor(questions) {
  if (!questions.length) return [];
  const list = questions.map((q, i) => `${i + 1}) ${q.q} = ${q.truth}`).join('\n');
  const prompt = `لكل سؤال من دول اكتب 3 إجابات غلط مقنعة وقصيرة بنفس نوع الإجابة الصح. أرجع JSON Array فقط بنفس الترتيب، كل عنصر Array من 3 نصوص.\n${list}`;
  try {
    const raw = await fetchText(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?json=true&seed=${Date.now() % 100000}`, 15000);
    const arr = extractJsonArray(raw);
    return questions.map((q, i) => (Array.isArray(arr[i]) ? arr[i].map(String).filter((b) => normalizeAr(b) !== normalizeAr(q.truth)) : []));
  } catch (e) {
    return questions.map(() => []);
  }
}

/** كذبات احتياطية من إجابات أسئلة تانية (لما الـ AI مايردش) */
function fallbackBluffs(truth, n) {
  const pool = shuffle(BANKS.karak.map((k) => k.truth).filter((t) => normalizeAr(t) !== normalizeAr(truth)));
  const len = String(truth).split(' ').length;
  const similar = pool.filter((t) => Math.abs(t.split(' ').length - len) <= 1);
  return [...similar, ...pool].slice(0, n);
}

function stats() {
  const r = {};
  for (const g of Object.keys(BANKS)) {
    const all = [...BANKS[g], ...AI_POOL[g]];
    r[g] = { total: all.length, fresh: all.filter((it) => !isUsed(g, it)).length };
  }
  return r;
}

module.exports = { pickQuestions, markUsed, aiBluffsFor, fallbackBluffs, normalizeAr, shuffle, stats, BANKS, CAT_LABELS };
