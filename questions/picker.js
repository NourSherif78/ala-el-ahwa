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

const KARAK_ALL = [...safeRequire('./karak_a.js'), ...safeRequire('./karak_b.js'), ...safeRequire('./karak_c.js')];
const BANKS = {
  karak: KARAK_ALL,
  sahlab: [...safeRequire('./sahlab.js'), ...safeRequire('./sahlab_b.js')],
  tamr: [...safeRequire('./tamr.js').map((t) => ({ cat: 'celebs', ...t })), ...safeRequire('./tamr_b.js')],
  annab: [
    ...safeRequire('./annab.js'),
    ...KARAK_ALL.map((k) => ({ id: 'an_' + k.id, cat: k.cat, q: k.q, truth: k.truth, bluffs: (k.bluffs || []).slice(0, 3) }))
  ]
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
let AI_POOL = { karak: [], sahlab: [], tamr: [], annab: [] };
try { if (fs.existsSync(AI_FILE)) AI_POOL = { ...AI_POOL, ...JSON.parse(fs.readFileSync(AI_FILE, 'utf8')) }; } catch (e) {}
AI_POOL.annab = AI_POOL.annab || [];
function saveAiPool() {
  try { fs.writeFileSync(AI_FILE, JSON.stringify(AI_POOL)); } catch (e) {}
}

function itemText(game, it) {
  if (game === 'karak' || game === 'annab') return it.q;
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

// طلب للـ AI بطريقة POST (الـ GET كان بيقع لما البرومبت يطول)
// الطلبات بتمشي واحد ورا التاني (الخدمة المجانية بتسمح بطلب واحد في المرة) + إعادة محاولة لو اتزحمت
let AI_CHAIN = Promise.resolve();
function aiChatOnce(prompt, timeoutMs) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ model: 'openai', messages: [{ role: 'system', content: 'Reply with JSON only. Be brief. Do not think at length.' }, { role: 'user', content: prompt }], reasoning_effort: 'low', max_tokens: 6000, seed: Math.floor(Math.random() * 1e6) });
    const req = https.request('https://text.pollinations.ai/openai', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'User-Agent': 'AlaElAhwa/15' }, timeout: timeoutMs }, (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        let content = '';
        try { const j = JSON.parse(raw); content = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || ''; } catch (e) {}
        if (process.env.AI_DEBUG) console.log('[ai]', res.statusCode, raw.slice(0, 300));
        resolve({ status: res.statusCode, content });
      });
    });
    req.on('error', (e) => { if (process.env.AI_DEBUG) console.log('[ai] err', e.message); resolve({ status: 0, content: '' }); });
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, content: '' }); });
    req.write(body);
    req.end();
  });
}
// Google Gemini (أسرع وأدق) — بيشتغل لو اتحط GEMINI_API_KEY في إعدادات Render
function geminiOnce(prompt, timeoutMs) {
  return new Promise((resolve) => {
    const key = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const body = JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.9 } });
    const req = https.request(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }, timeout: timeoutMs }, (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        let content = '';
        try { const j = JSON.parse(raw); content = j.candidates[0].content.parts.map((p) => p.text || '').join(''); } catch (e) {}
        if (process.env.AI_DEBUG) console.log('[gemini]', res.statusCode, raw.slice(0, 300));
        resolve({ status: res.statusCode, content });
      });
    });
    req.on('error', () => resolve({ status: 0, content: '' }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, content: '' }); });
    req.write(body);
    req.end();
  });
}
function aiChat(prompt, timeoutMs = 40000) {
  const run = async () => {
    if (process.env.GEMINI_API_KEY) {
      const g = await geminiOnce(prompt, timeoutMs);
      if (g.content) return g.content;
    }
    for (let attempt = 0; attempt < 2; attempt++) {
      const r = await aiChatOnce(prompt, timeoutMs);
      if (r.content) return r.content;
      // الخدمة المجانية: رد واحد كل 30 ثانية
      await new Promise((ok) => setTimeout(ok, r.status === 402 || r.status === 429 ? 31000 : 3000));
    }
    return '';
  };
  const p = AI_CHAIN.then(run, run);
  AI_CHAIN = p.catch(() => '');
  return p;
}

function extractJsonArray(raw) {
  if (Array.isArray(raw)) return raw;
  const s = String(raw || '');
  const tryParse = (t) => { try { return JSON.parse(t); } catch (e) { return undefined; } };
  let v = tryParse(s.trim());
  if (v === undefined) { const m = s.match(/\[[\s\S]*\]/); if (m) v = tryParse(m[0]); }
  if (v === undefined) { const m = s.match(/\{[\s\S]*\}/); if (m) v = tryParse(m[0]); }
  if (Array.isArray(v)) return v;
  if (v && typeof v === 'object') {
    const arr = Object.values(v).find((x) => Array.isArray(x));
    return arr || [v];
  }
  return [];
}

const CAT_LABELS = {
  history: 'تاريخ', geography: 'جغرافيا', science: 'علوم', sports: 'رياضة', cinema: 'أفلام ومسلسلات',
  food: 'أكل ومشروبات', egypt: 'مصر', animals: 'حيوانات', weird: 'غرائب وعادات الشعوب', language: 'لغة وكلمات',
  places: 'أماكن', people: 'مشاهير', movies: 'أفلام', things: 'أشياء', celebs: 'مشاهير',
  anime: 'أنمي', islamic_history: 'تاريخ إسلامي', islamic: 'أسئلة دينية إسلامية', quran: 'القرآن الكريم', hadith: 'الأحاديث النبوية'
};
const RELIGIOUS = new Set(['islamic_history', 'islamic', 'quran', 'hadith']);

function aiPrompt(game, cats, count, avoid) {
  const topic = (cats && cats.length ? cats : ['weird', 'science', 'history']).map((c) => CAT_LABELS[c] || c).join('، ');
  const rel = (cats || []).some((c) => RELIGIOUS.has(c))
    ? ' للأسئلة الدينية: معلومات صحيحة وموثقة من مصادر أهل السنة المعروفة فقط، وممنوع تأليف أي نص قرآني أو حديث، والإجابات المزيفة تكون أسماء أو أرقام أو أماكن مش نصوص دينية. أي نبي أو صحابي خلي imageQuery فاضي "".'
    : '';
  if (game === 'karak') {
    return `اكتب ${count} أسئلة لعبة خداع جماعية زي Fibbage بالعربي. المواضيع: ${topic}. كل سؤال معلومة حقيقية مدهشة فيها فراغ ____ والإجابة الصح قصيرة (1-4 كلمات).${rel} أرجع JSON فقط بالشكل {"items":[...]} وكل عنصر: [{"cat":"اسم الموضوع","q":"... ____ ...","truth":"...","bluffs":["كذبة1","كذبة2","كذبة3","كذبة4"]}]. ماتكررش دول: ${avoid}`;
  }
  if (game === 'annab') {
    return `اكتب ${count} أسئلة مسابقات سرعة (4 اختيارات) بالعربي. المواضيع: ${topic}. كل سؤال واضح ومباشر ومعاه الإجابة الصح و3 اختيارات غلط مقنعة من نفس النوع.${rel} أرجع JSON فقط بالشكل {"items":[...]} وكل عنصر: [{"cat":"اسم الموضوع","q":"السؤال؟","truth":"الإجابة الصح","bluffs":["غلط1","غلط2","غلط3"]}]. ماتكررش دول: ${avoid}`;
  }
  if (game === 'sahlab') {
    return `اكتب ${count} عناصر للعبة تخمين بالتلميحات بالعربي. المواضيع: ${topic}. كل عنصر شيء أو مكان أو شخصية مشهورة مع 5 تلميحات من الأصعب للأسهل ولا تذكر الإجابة في التلميحات، و imageQuery هو عنوان مقالة ويكيبيديا الإنجليزية عشان نجيب صورة.${rel} أرجع JSON فقط بالشكل {"items":[...]} وكل عنصر: [{"answer":"...","aliases":["..."],"imageQuery":"English Wikipedia title","hints":["...","...","...","...","..."]}]. ماتكررش: ${avoid}`;
  }
  return `اكتب ${count} شخصيات مشهورة جداً عند الجمهور العربي للعبة Guess Who (أسئلة أه/لأ). المواضيع: ${topic}. و imageQuery هو عنوان مقالة ويكيبيديا الإنجليزية للصورة.${rel} أرجع JSON فقط بالشكل {"items":[...]} وكل عنصر: [{"name":"...","brief":"وصف في سطر","imageQuery":"English Wikipedia title"}]. ماتكررش: ${avoid}`;
}

async function aiGenerate(game, catsIn, count) {
  // القرآن والأحاديث والأسئلة الدينية: من البنك الموثّق بس — الـ AI ممنوع يألف فيها
  const cats = (catsIn || []).filter((c) => !RELIGIOUS.has(c));
  if (catsIn && catsIn.length && !cats.length) return [];
  const avoid = shuffle([...BANKS[game], ...AI_POOL[game]].filter((it) => !cats || !cats.length || cats.includes(it.cat))).slice(0, 25).map((it) => itemText(game, it)).join(' | ');
  const prompt = aiPrompt(game, cats, count, avoid);
  const LABEL_TO_ID = Object.fromEntries(Object.entries(CAT_LABELS).map(([k, v]) => [normalizeAr(v), k]));
  const catFor = (it) => {
    const fromAi = it && it.cat && (cats.includes(it.cat) ? it.cat : LABEL_TO_ID[normalizeAr(it.cat)]);
    if (fromAi && (!cats.length || cats.includes(fromAi))) return fromAi;
    return cats.length ? cats[Math.floor(Math.random() * cats.length)] : game === 'tamr' ? 'celebs' : game === 'sahlab' ? 'things' : 'weird';
  };
  const religious = (cats || []).some((c) => RELIGIOUS.has(c));
  try {
    const raw = await aiChat(prompt, 40000);
    const arr = extractJsonArray(raw);
    const out = [];
    for (const it of arr) {
      if (!it || typeof it !== 'object') continue;
      let item = null;
      if (game === 'karak' && it.q && it.truth) {
        const q0 = String(it.q).replace(/_{2,}/g, '____'); const q = q0.includes('____') ? q0 : q0 + ' ____';
        const bl = (Array.isArray(it.bluffs) ? it.bluffs : []).map(String).filter((b) => normalizeAr(b) !== normalizeAr(it.truth));
        if (bl.length < 2) continue;
        item = { id: 'ai_k_' + hashText(q), cat: catFor(it), q, truth: String(it.truth), bluffs: bl.slice(0, 4), ai: true };
      } else if (game === 'annab' && it.q && it.truth) {
        const q = String(it.q).trim();
        const bl = (Array.isArray(it.bluffs) ? it.bluffs : []).map(String).filter((b) => normalizeAr(b) !== normalizeAr(it.truth));
        if (bl.length < 3) continue;
        item = { id: 'ai_an_' + hashText(q), cat: catFor(it), q, truth: String(it.truth), bluffs: bl.slice(0, 3), ai: true };
      } else if (game === 'sahlab' && it.answer && Array.isArray(it.hints) && it.hints.length >= 3) {
        item = { id: 'ai_s_' + hashText(it.answer), cat: catFor(it), answer: String(it.answer), aliases: Array.isArray(it.aliases) ? it.aliases.map(String) : [], imageQuery: religious ? String(it.imageQuery || '') : String(it.imageQuery || it.answer), hints: it.hints.slice(0, 5).map(String), ai: true };
      } else if (game === 'tamr' && it.name) {
        item = { id: 'ai_t_' + hashText(it.name), cat: catFor(it), name: String(it.name), brief: String(it.brief || ''), imageQuery: religious ? '' : String(it.imageQuery || it.name), ai: true };
      }
      if (item && !isUsed(game, item) && !AI_POOL[game].some((x) => x.id === item.id)) out.push(item);
    }
    if (out.length) { AI_POOL[game].push(...out); if (AI_POOL[game].length > 600) AI_POOL[game] = AI_POOL[game].slice(-600); saveAiPool(); }
    return out;
  } catch (e) {
    return [];
  }
}

/**
 * الـ AI بيجمع أسئلة جديدة في الخلفية أول ما الحكم يعمل الغرفة (عشان البداية تبقى فورية)
 */
function prefetchAI(game, cats, n) {
  const want = Math.max(3, Math.ceil(n * 0.5));
  const job = aiGenerate(game, cats, Math.min(10, want)).catch(() => []);
  return job;
}

/**
 * اختيار n عنصر جديد تماماً (مااتسألش قبل كده) للعبة
 * aiFresh: أسئلة الـ AI اللي اتجمعت للغرفة دي — بتتخلط مع البنك (حوالي النص)
 */
async function pickQuestions(game, cats, n, aiFresh = []) {
  const inCat = (it) => !cats || !cats.length || cats.includes(it.cat);
  const ratio = process.env.GEMINI_API_KEY ? 0.5 : 0.3;
  const ai = shuffle(aiFresh.filter((it) => !isUsed(game, it) && inCat(it))).slice(0, Math.ceil(n * ratio));
  const aiIds = new Set(ai.map((x) => x.id));
  const all = [...BANKS[game], ...AI_POOL[game]].filter((it) => !aiIds.has(it.id));
  const fresh = all.filter((it) => !isUsed(game, it));
  let chosen = [...ai, ...shuffle(fresh.filter(inCat)).slice(0, n - ai.length)];
  if (chosen.length < n && !(cats && cats.length && cats.every((c) => RELIGIOUS.has(c)))) {
    let tries = 0;
    while (chosen.length < n && tries < 1) {
      tries++;
      const gen = await aiGenerate(game, cats, Math.min(8, n - chosen.length + 2));
      const ids = new Set(chosen.map((c) => c.id));
      chosen.push(...gen.filter((g) => !ids.has(g.id)).slice(0, n - chosen.length));
    }
  }
  // لو الفئات اللي اختارها خلصت، نعيد استخدام أسئلة نفس الفئات قبل ما نروح لفئات تانية
  if (chosen.length < n) {
    const ids = new Set(chosen.map((c) => c.id));
    const catPool = shuffle(all.filter((it) => inCat(it) && !ids.has(it.id))).slice(0, n - chosen.length);
    catPool.forEach((it) => { usedIdSet.delete(it.id); usedHashSet.delete(hashText(game + ':' + itemText(game, it))); });
    chosen.push(...catPool);
  }
  if (chosen.length < n) {
    const ids = new Set(chosen.map((c) => c.id));
    chosen.push(...shuffle(fresh.filter((it) => !ids.has(it.id))).slice(0, n - chosen.length));
  }
  if (chosen.length < n) {
    const ids = new Set(chosen.map((c) => c.id));
    chosen.push(...shuffle(all.filter((it) => !ids.has(it.id))).slice(0, n - chosen.length));
  }
  return shuffle(chosen);
}

/** كذبات AI إضافية لسؤال (لو محتاجين بدائل أو الأسئلة المخصصة) */
async function aiBluffsFor(questions) {
  if (!questions.length) return [];
  const list = questions.map((q, i) => `${i + 1}) ${q.q} = ${q.truth}`).join('\n');
  const prompt = `لكل سؤال من دول اكتب 3 إجابات غلط مقنعة وقصيرة بنفس نوع الإجابة الصح. أرجع JSON فقط بالشكل {"items":[["غلط1","غلط2","غلط3"], ...]} بنفس ترتيب الأسئلة.\n${list}`;
  try {
    const raw = await aiChat(prompt, 20000);
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

module.exports = { pickQuestions, prefetchAI, markUsed, aiBluffsFor, fallbackBluffs, normalizeAr, shuffle, stats, BANKS, CAT_LABELS };
