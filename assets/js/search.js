/**
 * Product search.
 *
 * 1. Product-type words in the query ("sữa rửa mặt", "kem chống nắng", "toner", "dầu gội"…) are
 *    recognised and only products of that type are returned.
 * 2. Vietnamese accents are respected when the customer types them: "nắng" does not match "nâng",
 *    "mặt" does not match "mát". Typing without accents ("kem chong nang") still works.
 * 3. The rest of the query must match whole words (or word beginnings). Products matching in the
 *    name / type / line are shown first; matches only inside long descriptions are used as a
 *    fallback when nothing else matches.
 */

/* ---------------- Text helpers ---------------- */
const HANGUL = /[ᄀ-ᇿ㄰-㆏가-힯]/;

/** Lower case, unified Unicode form, punctuation → spaces (keeps accents). */
export function cleanText(s) {
  return String(s || '')
    .normalize('NFC')
    .toLowerCase()
    .replace(/[™®©]/g, '')
    .replace(/[.,;:!?()[\]{}"'“”‘’\/\\|+&_–—-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Remove Vietnamese accents: "nắng" → "nang", "đầu" → "dau". */
export function stripMarks(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .normalize('NFC');
}

const hasMarks = (s) => stripMarks(s) !== s;
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Word (or word-beginning) match. Korean has no spaces inside compounds, so it matches anywhere.
function wordHit(text, word, { whole = false } = {}) {
  if (!word) return false;
  if (HANGUL.test(word)) return text.includes(word);
  const re = new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRe(word)}${whole ? '(?=$|[^\\p{L}\\p{N}])' : ''}`, 'u');
  return re.test(text);
}

/* ---------------- Product types ----------------
   q: words customers type (accents optional — an unaccented version is matched automatically
      only when the customer types without accents).
   p: words that identify the product type in a product's name / type line (vi + ko).
   cats: alternatively, the product category from app.js (cleanser, toner, serum, moisturizer,
      sun, mask, hair). exclude: categories never returned for this type. */
const PRODUCT_TYPES = [
  { id: 'remover', q: ['nước tẩy trang', 'tẩy trang', 'cleansing water', 'makeup remover', '클렌징 워터', '클렌징워터'], p: ['tẩy trang', 'cleansing water', '클렌징 워터'] },
  { id: 'cleanser', q: ['sữa rửa mặt', 'rửa mặt', 'srm', 'cleanser', 'foam cleansing', 'cleansing foam', 'foam', 'bọt rửa mặt', '클렌저', '폼 클렌징', '클렌징 폼', '폼클렌징', '클렌징폼'], p: ['sữa rửa mặt', 'bọt rửa mặt', 'foam cleansing', 'cleansing foam', '폼'] },
  { id: 'sun', q: ['kem chống nắng', 'chống nắng', 'kcn', 'sunscreen', 'suncream', 'sun cream', 'sunblock', 'sun block', 'spf', '선크림', '선블록', '자외선'], p: ['chống nắng', 'suncream', 'sunscreen', 'sunblock', '선크림', '선블록'] },
  { id: 'bb', q: ['bb cream', 'kem bb', 'kem nền', 'bb', '비비크림', '비비'], p: ['bb cream', 'kem nền', '비비크림', 'bb크림'] },
  { id: 'toner', q: ['nước hoa hồng', 'nước cân bằng', 'toner', '토너'], p: ['toner', 'nước hoa hồng', 'nước cân bằng', '토너'] },
  { id: 'mist', q: ['xịt khoáng', 'mist', '미스트'], p: ['mist', 'xịt khoáng', '미스트'] },
  { id: 'serum', q: ['huyết thanh', 'tinh chất', 'serum', 'ampoule', 'ampule', 'essence', '세럼', '앰플', '에센스'], p: ['serum', 'ampoule', 'essence', 'tinh chất', '세럼', '앰플', '에센스'], not: ['toner', '토너'], exclude: ['hair'] },
  { id: 'mask', q: ['mặt nạ', 'mask', 'mask pack', '마스크팩', '마스크'], p: ['mặt nạ', 'mask', '마스크'], exclude: ['hair'] },
  { id: 'moisturizer', q: ['kem dưỡng ẩm', 'kem dưỡng', 'sữa dưỡng', 'dưỡng ẩm', 'moisturizer', 'moisturiser', 'emulsion', 'lotion', 'balm', 'sáp dưỡng', '모이스처라이저', '에멀전', '로션', '크림'], cats: ['moisturizer'] },
  { id: 'shampoo', q: ['dầu gội đầu', 'dầu gội', 'shampoo', '샴푸'], p: ['dầu gội', 'shampoo', '샴푸'] },
  { id: 'conditioner', q: ['dầu xả', 'kem xả', 'kem ủ tóc', 'ủ tóc', 'hair treatment', 'treatment', '트리트먼트'], p: ['kem xả', 'kem ủ', 'ủ tóc', 'treatment', '트리트먼트'], cats: ['hair'], needBoth: true },
  { id: 'scalp', q: ['tinh chất da đầu', 'xịt dưỡng tóc', 'scalp essence', 'scalp', '두피 에센스', '스칼프'], p: ['da đầu', 'scalp', '스칼프', '두피'], cats: ['hair'], needBoth: true },
  { id: 'hair', q: ['chăm sóc tóc', 'da đầu', 'tóc', 'hair', '헤어', '두피', '모발'], cats: ['hair'] }
];

// Longest phrases first so "kem chống nắng" wins over "kem", "tinh chất da đầu" over "tinh chất"
const TYPE_PHRASES = PRODUCT_TYPES
  .flatMap((t) => t.q.map((phrase) => ({ type: t, phrase: cleanText(phrase) })))
  .sort((a, b) => b.phrase.length - a.phrase.length);

/** Finds product-type phrases in the query. Returns { types, rest } (rest = remaining words). */
export function detectTypes(query) {
  let rest = cleanText(query);
  const marked = hasMarks(rest);
  const types = [];
  for (const { type, phrase } of TYPE_PHRASES) {
    // Accented query: compare with accents. Unaccented query: compare without accents.
    const target = marked ? phrase : stripMarks(phrase);
    const hay = marked ? rest : stripMarks(rest);
    if (!target || !wordHit(hay, target, { whole: true })) continue;
    if (!types.includes(type)) types.push(type);
    // remove the phrase from the remaining query (same position in the accented text)
    const re = new RegExp(`(^|\\s)${escapeRe(target)}(?=$|\\s)`, 'u');
    if (marked) rest = rest.replace(re, ' ');
    else rest = stripMarks(rest).replace(re, ' ');
    rest = rest.replace(/\s+/g, ' ').trim();
  }
  return { types, rest };
}

/* ---------------- Index ---------------- */

/**
 * fields: { name: [..], type: [..], meta: [..], body: [..], kind: [..] } — plain strings in any language.
 *   kind: the product's own names + type line, used to recognise product types
 *   name: product names, brand, line   · type: short type line (tag), category label
 *   meta: concerns, badges, spec       · body: long descriptions
 */
export function buildSearchEntry(fields, category) {
  const join = (arr) => cleanText((arr || []).filter(Boolean).join(' · '));
  const name = join(fields.name);
  const type = join(fields.type);
  const meta = join(fields.meta);
  const body = join(fields.body);
  return {
    category,
    name, type, meta, body,
    nameX: stripMarks(name), typeX: stripMarks(type), metaX: stripMarks(meta), bodyX: stripMarks(body),
    // what the product is, for product-type matching: its own names + type line (not the broad
    // catalogue group such as "Chống nắng & BB", which would pull BB cream into sunscreen)
    kind: fields.kind ? join(fields.kind) : `${name} · ${type}`
  };
}

function matchesType(s, t) {
  if (t.exclude && t.exclude.includes(s.category)) return false;
  if (t.not && t.not.some((w) => wordHit(s.kind, cleanText(w)))) return false;
  const inCat = t.cats ? t.cats.includes(s.category) : null;
  const byWords = t.p ? t.p.some((w) => wordHit(s.kind, cleanText(w))) : null;
  if (t.needBoth) return !!inCat && !!byWords;
  if (inCat !== null && byWords !== null) return inCat || byWords;
  return inCat !== null ? inCat : !!byWords;
}

/* ---------------- Search ---------------- */

/**
 * items: array of { entry, s } where s = buildSearchEntry(...).
 * Returns the matching entries, best first.
 */
export function searchIndex(items, query) {
  const q = cleanText(query);
  if (!q) return [];
  const { types, rest } = detectTypes(q);

  let pool = items;
  if (types.length) pool = items.filter(({ s }) => types.some((t) => matchesType(s, t)));

  const words = rest.split(' ').filter((w) => w && w.length >= 1);
  if (!words.length) {
    // Only a product type was asked for: keep the catalogue order
    return pool.map(({ entry }) => entry);
  }

  const restMarked = hasMarks(rest);
  const phrase = rest;
  const scored = pool.map(({ entry, s }) => {
    const F = (k) => (restMarked ? s[k] : s[`${k}X`]);
    const fields = { name: F('name'), type: F('type'), meta: F('meta'), body: F('body') };
    let score = 0;
    let tier = 2; // 0 = phrase in name/type, 1 = all words in name/type/meta, 2 = needs description
    let allTop = true;
    for (const raw of words) {
      const w = restMarked && hasMarks(raw) ? raw : stripMarks(raw);
      const useX = !(restMarked && hasMarks(raw));
      const f = useX
        ? { name: s.nameX, type: s.typeX, meta: s.metaX, body: s.bodyX }
        : { name: s.name, type: s.type, meta: s.meta, body: s.body };
      if (wordHit(f.name, w)) score += 4;
      else if (wordHit(f.type, w)) score += 3;
      else if (wordHit(f.meta, w)) score += 2;
      else if (wordHit(f.body, w)) { score += 0.5; allTop = false; }
      else return null; // every word has to be found
    }
    if (allTop) tier = 1;
    if (words.length > 1 && (wordHit(fields.name, phrase) || wordHit(fields.type, phrase))) { tier = 0; score += 5; }
    return { entry, score, tier };
  }).filter(Boolean);

  if (!scored.length) return [];
  // Show only the best tier that has results (description-only matches are a fallback)
  const best = Math.min(...scored.map((r) => r.tier));
  const keep = best === 0 ? 1 : best; // phrase hits and full word hits are shown together
  return scored
    .filter((r) => r.tier <= keep)
    .sort((a, b) => a.tier - b.tier || b.score - a.score)
    .map((r) => r.entry);
}
