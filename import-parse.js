/* ==================================================================
   import-parse.js — real client-side parsing for Bulk import.

   Supported sources:
     .txt / .html / .htm  — read directly
     .epub                — unzipped in-browser (minimal ZIP reader +
                            DecompressionStream), chapters to text
     .pdf                 — text extraction via pdf.js (lazy-loaded CDN)
     http(s) URL          — fetched when the site allows it (CORS)

   Output: window.parseCookbookSource(fileOrUrl) → Promise<{
     text, warning? }>, and window.extractRecipes(text) → recipe drafts
   [{title, ingredients:[{name,amount,unit}], steps:[string]}].
   window.analyzeDraft(draft, crit, DIET_RULES) applies dietary criteria.
   ================================================================== */

/* ---------------- minimal ZIP (for EPUB) --------------------------- */
async function inflateRaw(bytes) {
  const ds = new DecompressionStream('deflate-raw');
  const stream = new Blob([bytes]).stream().pipeThrough(ds);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function unzip(buf) {
  const b = new Uint8Array(buf);
  const dv = new DataView(buf);
  /* find End Of Central Directory */
  let eocd = -1;
  for (let i = b.length - 22; i >= Math.max(0, b.length - 66000); i--) {
    if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('Not a valid ZIP/EPUB file');
  const count = dv.getUint16(eocd + 10, true);
  let off = dv.getUint32(eocd + 16, true);
  const entries = [];
  for (let n = 0; n < count; n++) {
    if (dv.getUint32(off, true) !== 0x02014b50) break;
    const method = dv.getUint16(off + 10, true);
    const csize = dv.getUint32(off + 20, true);
    const nameLen = dv.getUint16(off + 28, true);
    const extraLen = dv.getUint16(off + 30, true);
    const cmtLen = dv.getUint16(off + 32, true);
    const lho = dv.getUint32(off + 42, true);
    const name = new TextDecoder().decode(b.subarray(off + 46, off + 46 + nameLen));
    entries.push({ name, method, csize, lho });
    off += 46 + nameLen + extraLen + cmtLen;
  }
  async function read(entry) {
    const lnl = dv.getUint16(entry.lho + 26, true);
    const lel = dv.getUint16(entry.lho + 28, true);
    const start = entry.lho + 30 + lnl + lel;
    const data = b.subarray(start, start + entry.csize);
    if (entry.method === 0) return data;
    if (entry.method === 8) return inflateRaw(data);
    throw new Error('Unsupported compression in EPUB');
  }
  return { entries, read };
}

/* ---------------- HTML → text -------------------------------------- */
function htmlToText(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script,style,nav,header,footer').forEach((n) => n.remove());
  /* keep block boundaries as newlines */
  doc.querySelectorAll('p,div,li,h1,h2,h3,h4,h5,h6,tr,br,section,article').forEach((n) => n.append('\n'));
  return (doc.body ? doc.body.textContent : doc.textContent || '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n');
}

/* ---------------- PDF via pdf.js (lazy) ---------------------------- */
let pdfjsLoading = null;
function loadPdfJs() {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (!pdfjsLoading) {
    pdfjsLoading = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/pdfjs-dist@3.11.174/legacy/build/pdf.min.js';
      s.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/legacy/build/pdf.worker.min.js';
        resolve(window.pdfjsLib);
      };
      s.onerror = () => reject(new Error('Could not load the PDF reader (offline?)'));
      document.head.appendChild(s);
    });
  }
  return pdfjsLoading;
}

async function pdfToText(buf) {
  const pdfjs = await loadPdfJs();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  let out = '';
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const tc = await page.getTextContent();
    let last = null;
    for (const it of tc.items) {
      if (last !== null && Math.abs(it.transform[5] - last) > 2) out += '\n';
      out += it.str + ' ';
      last = it.transform[5];
    }
    out += '\n\n';
  }
  return out;
}

/* ---------------- EPUB → text -------------------------------------- */
async function epubToText(buf) {
  const zip = await unzip(buf);
  const dec = new TextDecoder();
  const chapters = zip.entries.filter((e) => /\.(x?html?|xml)$/i.test(e.name) && !/toc|nav|cover|container|content\.opf/i.test(e.name));
  let out = '';
  for (const ch of chapters) {
    try { out += htmlToText(dec.decode(await zip.read(ch))) + '\n\n'; } catch (e) { /* skip bad chapter */ }
  }
  if (!out.trim()) {
    /* fall back to every text-ish entry */
    for (const ch of zip.entries.filter((e) => /\.(x?html?|xml|txt)$/i.test(e.name))) {
      try { out += htmlToText(dec.decode(await zip.read(ch))) + '\n\n'; } catch (e) {}
    }
  }
  return out;
}

/* ---------------- main source reader ------------------------------- */
async function parseCookbookSource(src) {
  if (typeof src === 'string') {
    /* URL */
    let res;
    try {
      res = await fetch(src, { mode: 'cors' });
    } catch (e) {
      throw new Error('That site blocks cross-site reading (CORS). Save the page/book as a file and upload it instead.');
    }
    if (!res.ok) throw new Error('The site answered ' + res.status + ' — check the address.');
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (ct.includes('pdf')) return { text: await pdfToText(await res.arrayBuffer()) };
    if (ct.includes('epub') || /\.epub($|\?)/i.test(src)) return { text: await epubToText(await res.arrayBuffer()) };
    return { text: htmlToText(await res.text()) };
  }
  /* File */
  const name = (src.name || '').toLowerCase();
  if (name.endsWith('.pdf')) return { text: await pdfToText(await src.arrayBuffer()) };
  if (name.endsWith('.epub')) return { text: await epubToText(await src.arrayBuffer()) };
  if (name.endsWith('.html') || name.endsWith('.htm')) return { text: htmlToText(await src.text()) };
  if (name.endsWith('.txt') || name.endsWith('.md')) return { text: await src.text() };
  if (name.endsWith('.mobi')) throw new Error('MOBI isn\u2019t supported \u2014 convert to EPUB (Calibre does this) and try again.');
  /* unknown: try as text */
  return { text: await src.text(), warning: 'Unknown file type — read as plain text.' };
}

/* ---------------- recipe extraction -------------------------------- */
const UNIT_WORDS = 'cups?|cup|tbsp|tablespoons?|tsp|teaspoons?|g|grams?|kg|ml|l|litres?|liters?|oz|ounces?|lbs?|pounds?|cans?|cloves?|bunche?s?|pinch(?:es)?|dash(?:es)?|sprigs?|stalks?|slices?|heads?|pieces?';
const FRACTIONS = { '\u00bc': 0.25, '\u00bd': 0.5, '\u00be': 0.75, '\u2153': 0.333, '\u2154': 0.667, '\u215b': 0.125, '\u215c': 0.375, '\u215d': 0.625, '\u215e': 0.875 };

function parseAmount(s) {
  if (!s) return null;
  s = s.trim();
  let total = 0, any = false;
  for (const part of s.split(/[\s]+/)) {
    if (FRACTIONS[part] != null) { total += FRACTIONS[part]; any = true; }
    else if (/^\d+\/\d+$/.test(part)) { const [a, b] = part.split('/'); total += Number(a) / Number(b); any = true; }
    else if (/^[\d.,]+$/.test(part)) { total += Number(part.replace(',', '.')); any = true; }
  }
  return any ? Math.round(total * 100) / 100 : null;
}

const ING_RE = new RegExp('^\\s*(?:[-\u2022*\u25e6\u2023]\\s*)?((?:\\d[\\d\\s\\/.,]*|[\u00bc\u00bd\u00be\u2153\u2154\u215b\u215c\u215d\u215e])\\s*)?(' + UNIT_WORDS + ')?\\.?\\s+(.{2,80})$', 'i');

function classifyIngredient(line) {
  const m = line.match(ING_RE);
  if (!m) return null;
  const hasAmt = !!m[1];
  const hasUnit = !!m[2];
  if (!hasAmt && !hasUnit) return null;
  let name = m[3].trim().replace(/[,.;]$/, '');
  /* strip leading "of " */
  name = name.replace(/^of\s+/i, '');
  if (name.length < 2 || /^(and|or|the|with|into|until)\b/i.test(name)) return null;
  return { amount: parseAmount(m[1]), unit: hasUnit ? m[2].toLowerCase().replace(/^tablespoons?$/, 'tbsp').replace(/^teaspoons?$/, 'tsp').replace(/^grams?$/, 'g').replace(/^(litres?|liters?)$/, 'l').replace(/^ounces?$/, 'oz').replace(/^pounds?$/, 'lb').replace(/^cups$/, 'cup') : '', name };
}

function looksLikeTitle(line) {
  const t = line.trim();
  if (t.length < 3 || t.length > 70) return false;
  if (/[.:]$/.test(t) && !/:$/.test(t)) return false;
  if (classifyIngredient(t)) return false;
  const words = t.split(/\s+/);
  if (words.length > 10) return false;
  /* mostly capitalized or short */
  return /[A-Za-z]/.test(t);
}

function extractRecipes(text) {
  const lines = text.split('\n').map((l) => l.trim());
  const recipes = [];
  let i = 0;
  while (i < lines.length) {
    /* find a run of >=3 ingredient lines within a window */
    let runStart = -1, run = [];
    for (let j = i; j < lines.length; j++) {
      const ing = lines[j] ? classifyIngredient(lines[j]) : null;
      if (ing) {
        if (runStart < 0) runStart = j;
        run.push(ing);
      } else if (runStart >= 0) {
        if (lines[j] === '' && run.length < 25) continue;   /* allow single gaps */
        if (run.length >= 3) break;
        runStart = -1; run = [];
      }
    }
    if (runStart < 0 || run.length < 3) break;

    /* title: nearest previous title-ish line, skipping headers like "Ingredients" */
    let title = 'Untitled recipe';
    for (let k = runStart - 1; k >= Math.max(0, runStart - 8); k--) {
      const t = lines[k];
      if (!t) continue;
      if (/^ingredients\b/i.test(t)) continue;
      if (looksLikeTitle(t)) { title = t.replace(/:$/, ''); break; }
    }

    /* steps: lines after the run until the next probable title/ingredient run */
    let end = runStart;
    let seen = 0;
    for (let j = runStart; j < lines.length && seen < run.length; j++) { if (lines[j] && classifyIngredient(lines[j])) seen++; end = j; }
    const steps = [];
    let j = end + 1;
    for (; j < lines.length && steps.length < 20; j++) {
      const t = lines[j];
      if (!t) { if (steps.length && lines[j + 1] && looksLikeTitle(lines[j + 1]) && classifyIngredient(lines[j + 2] || '')) break; continue; }
      if (/^(method|directions?|instructions?)\b:?$/i.test(t)) continue;
      if (classifyIngredient(t) && steps.length) break;   /* next recipe's ingredients */
      if (t.length > 20) steps.push(t.replace(/^\d+[.)]\s*/, ''));
      else if (steps.length) break;
    }
    recipes.push({ title, ingredients: run, steps });
    i = j;
    if (recipes.length >= 60) break;   /* sanity cap */
  }
  return recipes;
}

/* ---------------- dietary analysis --------------------------------- */
const DIET_RULES = [
  { match: /\b(butter)\b/i, not: /vegan|plant/i, crit: ['vegan'], sub: 'vegan butter' },
  { match: /\beggs?\b/i, not: /flax|chia|replacer/i, crit: ['vegan', 'egg-free'], sub: 'flax egg' },
  { match: /\bhoney\b/i, crit: ['vegan'], sub: 'maple syrup' },
  { match: /\b(milk)\b/i, not: /oat|soy|almond|coconut|plant|rice|cashew/i, crit: ['vegan'], sub: 'oat milk' },
  { match: /\bcream\b/i, not: /coconut|cashew|plant/i, crit: ['vegan'], sub: 'coconut cream' },
  { match: /\b(cheese|parmesan|cheddar|feta|mozzarella)\b/i, not: /vegan|cashew|plant/i, crit: ['vegan'], sub: 'cashew cheese' },
  { match: /\byogh?urt\b/i, not: /coconut|soy|plant/i, crit: ['vegan'], sub: 'coconut yogurt' },
  { match: /\bmayonnaise|mayo\b/i, not: /vegan/i, crit: ['vegan', 'egg-free'], sub: 'vegan mayo' },
  { match: /\b(beef|chicken|pork|lamb|bacon|ham|turkey|fish|salmon|tuna|shrimp|prawn|anchov)/i, crit: ['vegan'], sub: null },
  { match: /\bgelatine?\b/i, crit: ['vegan'], sub: 'agar agar' },
  { match: /\bsoy sauce\b/i, crit: ['soy-free'], sub: 'coconut aminos' },
  { match: /\btamari\b/i, crit: ['soy-free'], sub: 'coconut aminos' },
  { match: /\b(tofu|tempeh|edamame)\b/i, crit: ['soy-free'], sub: null },
  { match: /\bmiso\b/i, crit: ['soy-free'], sub: 'chickpea miso' },
  { match: /\b(wheat |all[- ]purpose |plain |bread )?flour\b/i, not: /gf|gluten[- ]free|rice|almond|chickpea|coconut|buckwheat|corn/i, crit: ['wheat-free'], sub: 'GF flour blend' },
  { match: /\b(bread|breadcrumbs?|panko)\b/i, not: /gf|gluten[- ]free/i, crit: ['wheat-free'], sub: 'GF breadcrumbs' },
  { match: /\b(pasta|spaghetti|penne|macaroni|noodles?)\b/i, not: /rice|gf|gluten[- ]free|soba|zucchini/i, crit: ['wheat-free'], sub: 'GF pasta' },
  { match: /\b(couscous|bulgur|semolina|seitan)\b/i, crit: ['wheat-free'], sub: null },
];

function analyzeDraft(draft, crit, amend) {
  const hits = [], fixable = [], blocked = [];
  const amended = draft.ingredients.map((ing) => {
    let out = ing;
    for (const rule of DIET_RULES) {
      const active = rule.crit.some((c) => crit[c]);
      if (!active) continue;
      if (!rule.match.test(ing.name)) continue;
      if (rule.not && rule.not.test(ing.name)) continue;
      const issue = { ing: ing.name, crit: rule.crit.filter((c) => crit[c]), sub: rule.sub };
      hits.push(issue);
      if (rule.sub) { fixable.push(issue); if (amend) out = { ...ing, name: rule.sub, notes: 'was: ' + ing.name }; }
      else blocked.push(issue);
      break;   /* one rule per ingredient */
    }
    return out;
  });
  let status = 'ok';
  if (blocked.length) status = 'skip';
  else if (hits.length && amend) status = 'amend';
  else if (hits.length) status = 'skip';
  return { status, hits, fixable, blocked, ingredients: amended };
}

window.parseCookbookSource = parseCookbookSource;
window.extractRecipes = extractRecipes;
window.analyzeDraft = analyzeDraft;
window.htmlToText = htmlToText;
window.classifyIngredient = classifyIngredient;
