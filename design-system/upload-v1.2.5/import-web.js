/* ==================================================================
   import-web.js — real web/YouTube/photo import helpers.
   - fetchTextCors: direct fetch, falling back to public CORS relays
   - extractWebRecipes: schema.org JSON-LD Recipe (verbatim), then
     microdata/common recipe-plugin markup, then heuristic text scan
   - readerToDrafts: structured parse of reader-mode markdown
   - fetchRecipesFromUrl: full pipeline; picks the best-quality draft
   - draftToRecipe: draft → app recipe schema. Ingredients and steps
     are kept word-for-word; dietary substitutions apply ONLY when the
     user explicitly opts in.
   - ytVideoId / ytMetadata / ytDescription: YouTube via oEmbed + the
     watch page's embedded shortDescription
   - ocrImages: photo OCR via tesseract.js (lazy-loaded)
   Depends on globals from import-parse.js (classifyIngredient,
   extractRecipes, analyzeDraft, htmlToText).
   ================================================================== */

function cleanRecipeUrl(u) {
  try {
    const x = new URL(u); x.hash = '';
    Array.from(x.searchParams.keys()).filter((k) => /^(utm_|fbclid|gclid|gbraid|wbraid|mc_|igsh|ref$|si$)/i.test(k)).forEach((k) => x.searchParams.delete(k));
    return x.href;
  } catch (e) { return u; }
}

/* Anti-bot / relay-error pages that come back with HTTP 200. */
function looksBlocked(t) {
  return /just a moment|attention required|cf-browser-verification|challenge-platform|enable javascript and cookies|access denied|are you a robot|captcha/i.test(String(t).slice(0, 4000));
}

async function fetchTextCors(url) {
  url = cleanRecipeUrl(url);
  const tries = [url, 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url), 'https://corsproxy.io/?url=' + encodeURIComponent(url), 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(url)];
  let last = null;
  for (const u of tries) {
    try {
      const r = await fetch(u, { mode: 'cors' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const t = await r.text();
      if (t && t.length > 40 && !looksBlocked(t)) return t;
      throw new Error(looksBlocked(t) ? 'Anti-bot page' : 'Empty response');
    } catch (e) { last = e; }
  }
  let host = url; try { host = new URL(url).hostname; } catch (e) {}
  throw new Error('Could not read ' + host + ' \u2014 the site blocks reading and the relay services could not reach it either (' + (last && last.message) + ')');
}

function isoMinutes(d) {
  const m = /^-?P(?:(\d+(?:\.\d+)?)D)?(?:T(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?)?$/.exec(String(d || '').trim());
  if (!m) return 0;
  return Math.round((+m[1] || 0) * 1440 + (+m[2] || 0) * 60 + (+m[3] || 0) + (+m[4] || 0) / 60);
}

/* "1 hour 10 minutes" / "45 mins" / "1h30m" → minutes */
function textMinutes(s) {
  s = String(s || '').toLowerCase();
  let m = 0;
  const h = s.match(/(\d+(?:\.\d+)?)\s*h(?:ou)?rs?\b|(\d+(?:\.\d+)?)\s*h\b/);
  const mm = s.match(/(\d+(?:\.\d+)?)\s*m(?:in(?:ute)?s?)?\b/);
  if (h) m += (+(h[1] || h[2]) || 0) * 60;
  if (mm) m += +mm[1] || 0;
  if (!m) { const d = s.match(/(\d+)/); if (d) m = +d[1]; }
  return Math.round(m);
}

function ldStr(v) {
  if (v == null) return '';
  if (typeof v === 'string') return v.trim();
  if (Array.isArray(v)) return ldStr(v[0]);
  if (typeof v === 'object') return ldStr(v.url || v['@id'] || v.text || v.name || '');
  return String(v);
}

function ldNum(v) { return Number(String(ldStr(v)).replace(/[^\d.]/g, '')) || 0; }

function collectLdRecipes(j, acc) {
  acc = acc || [];
  if (!j) return acc;
  if (Array.isArray(j)) { j.forEach((x) => collectLdRecipes(x, acc)); return acc; }
  if (typeof j === 'object') {
    const t = [].concat(j['@type'] || []);
    if (t.some((x) => String(x).toLowerCase() === 'recipe')) acc.push(j);
    if (j['@graph']) collectLdRecipes(j['@graph'], acc);
    if (j.mainEntity) collectLdRecipes(j.mainEntity, acc);
  }
  return acc;
}

function flattenInstructions(v, acc) {
  acc = acc || [];
  if (!v) return acc;
  if (typeof v === 'string') {
    v.split(/\n+/).map((s) => s.replace(/^\s*(?:\d+[.)]|step \d+:?)\s*/i, '').trim()).filter((s) => s.length > 3).forEach((s) => acc.push(s));
    return acc;
  }
  if (Array.isArray(v)) { v.forEach((x) => flattenInstructions(x, acc)); return acc; }
  if (typeof v === 'object') {
    if (v.itemListElement) return flattenInstructions(v.itemListElement, acc);
    const t = (v.text || v.name || '').trim();
    if (t) acc.push(t);
  }
  return acc;
}

function parseServings(y) {
  const s = ldStr(y);
  const m = s.match(/\d+/);
  return m ? Number(m[0]) : 0;
}

function ldToDraft(r, url) {
  let host = ''; try { host = new URL(url).hostname.replace(/^www\./, ''); } catch (e) {}
  const n = r.nutrition || {};
  return {
    title: ldStr(r.name) || 'Untitled recipe',
    ingredients: [].concat(r.recipeIngredient || r.ingredients || []).map((x) => ldStr(x)).filter(Boolean),
    steps: flattenInstructions(r.recipeInstructions),
    servings: parseServings(r.recipeYield) || 0,
    yield: ldStr(r.recipeYield),
    prepMinutes: isoMinutes(r.prepTime),
    cookMinutes: isoMinutes(r.cookTime) || Math.max(0, isoMinutes(r.totalTime) - isoMinutes(r.prepTime)),
    image: ldStr(r.image),
    category: ldStr(r.recipeCategory),
    cuisine: ldStr(r.recipeCuisine),
    calories: ldNum(n.calories),
    nutrition: { calories: ldNum(n.calories), protein: ldNum(n.proteinContent), fat: ldNum(n.fatContent), carbs: ldNum(n.carbohydrateContent), fibre: ldNum(n.fiberContent), sugar: ldNum(n.sugarContent) },
    sourceUrl: url, host,
    exact: true,   /* structured source — ingredients/steps are verbatim */
  };
}

function microdataDraft(doc, url) {
  const qa = (sel) => Array.from(doc.querySelectorAll(sel)).map((n) => n.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const ings = qa('[itemprop="recipeIngredient"], [itemprop="ingredients"], .wprm-recipe-ingredient, .tasty-recipes-ingredients li, .mv-create-ingredients li');
  if (ings.length < 2) return null;
  let steps = qa('[itemprop="recipeInstructions"] li, .wprm-recipe-instruction, .tasty-recipes-instructions li, .mv-create-instructions li');
  if (!steps.length) steps = qa('[itemprop="recipeInstructions"]');
  const titleEl = doc.querySelector('[itemprop="name"], h1');
  let host = ''; try { host = new URL(url).hostname.replace(/^www\./, ''); } catch (e) {}
  return { title: titleEl ? titleEl.textContent.trim() : (doc.title || 'Untitled recipe'), ingredients: ings, steps, servings: 0, prepMinutes: 0, cookMinutes: 0, image: '', category: '', cuisine: '', calories: 0, sourceUrl: url, host, exact: true };
}

function textToDrafts(text, url) {
  let host = ''; try { host = new URL(url).hostname.replace(/^www\./, ''); } catch (e) {}
  return window.extractRecipes(text).map((d) => ({
    title: d.title,
    ingredients: d.ingredients.map((i) => ((i.amount != null ? i.amount + ' ' : '') + (i.unit ? i.unit + ' ' : '') + i.name).trim()),
    steps: d.steps, servings: 0, prepMinutes: 0, cookMinutes: 0, image: '', category: '', cuisine: '', calories: 0, sourceUrl: url, host, exact: false,
  }));
}

/* Structured parse of reader-mode markdown (r.jina.ai): finds the
   Ingredients / Instructions sections and the recipe-card meta lines,
   keeping every ingredient and step line verbatim. */
function readerToDrafts(md, url) {
  let host = ''; try { host = new URL(url).hostname.replace(/^www\./, ''); } catch (e) {}
  const tM = md.match(/^Title:\s*(.+)$/m);
  const clean = (s) => s.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').trim();
  const lines = md.split(/\r?\n/).map(clean);
  let title = tM ? clean(tM[1]).replace(/\s*[-|–].{0,40}$/, '').trim() : '';
  const ingStart = /^#{0,6}\s*ingredients\b/i;
  const stepStart = /^#{0,6}\s*(instructions|directions|method|steps|preparation|how to (?:make|prepare))\b/i;
  const sectionEnd = /^#{0,6}\s*(notes|nutrition(?:al)? (?:facts|information)|nutrition\b|equipment|video|faq|storage|tips|serving suggestions|related|comments|leave a reply|you may also|more recipes|did you make)\b/i;
  const junk = /^(us customary|metric|[123]x\b|cook mode|prevent your screen|pin\b|print\b|rate\b|save\b|jump to|scale\b|share\b|tweet\b|email\b|facebook|pinterest|instagram|advertisement)/i;
  const ings = [], steps = [];
  let mode = '';
  for (let l of lines) {
    if (!l) continue;
    if (ingStart.test(l)) { mode = 'ing'; continue; }
    if (stepStart.test(l)) { mode = 'step'; continue; }
    if (sectionEnd.test(l)) { mode = ''; continue; }
    if (!mode || junk.test(l)) continue;
    if (!title && /^#{1,3}\s+/.test(l)) { title = l.replace(/^#+\s*/, ''); continue; }
    const isBullet = /^(?:[-*•▢□☐]|\d+[.)])\s+/.test(l);
    l = l.replace(/^(?:[-*•▢□☐]|\d+[.)])\s+/, '').replace(/^#+\s*/, '').trim();
    if (!l) continue;
    if (/^(for the |for serving|optional:)/i.test(l) || /:$/.test(l)) continue; /* sub-group headings */
    if (mode === 'ing') {
      if (l.length > 140) continue;
      if (isBullet || /\d/.test(l) || /^[a-z]/i.test(l) && l.split(' ').length <= 8) ings.push(l);
    } else if (mode === 'step') {
      if (isBullet || l.length > 15) steps.push(l);
    }
  }
  if (ings.length < 2 || steps.length < 2) return [];
  const grab = (re) => { const m = md.match(re); return m ? m[1] : ''; };
  const num = (re) => { const m = md.match(re); return m ? Number(m[1]) : 0; };
  const prep = textMinutes(grab(/prep(?:aration)?\s*time:?\s*([^\n|]{1,40})/i));
  let cook = textMinutes(grab(/cook(?:ing)?\s*time:?\s*([^\n|]{1,40})/i));
  const total = textMinutes(grab(/total\s*time:?\s*([^\n|]{1,40})/i));
  if (!cook && total > prep) cook = total - prep;
  const nutrition = {
    calories: num(/calories:?\s*(\d+)/i), protein: num(/protein:?\s*(\d+(?:\.\d+)?)\s*g/i),
    fat: num(/(?:^|\s)fat:?\s*(\d+(?:\.\d+)?)\s*g/i), carbs: num(/carb(?:ohydrate)?s?:?\s*(\d+(?:\.\d+)?)\s*g/i),
    fibre: num(/fib(?:re|er):?\s*(\d+(?:\.\d+)?)\s*g/i), sugar: num(/sugar:?\s*(\d+(?:\.\d+)?)\s*g/i),
  };
  return [{
    title: title || 'Untitled recipe', ingredients: ings, steps,
    servings: num(/(?:servings|serves|yield):?\s*(\d+)/i) || 0, yield: grab(/yield:?\s*([^\n|]{1,40})/i).trim(),
    prepMinutes: prep, cookMinutes: cook, image: '',
    category: grab(/course:?\s*([a-z &,-]{3,30})/i).trim(), cuisine: grab(/cuisine:?\s*([a-z &,-]{3,30})/i).trim(),
    calories: nutrition.calories, nutrition, sourceUrl: url, host,
    exact: true, /* lines are verbatim from the page's recipe card */
  }];
}

/* Quality score: prefer structured, titled, timed, amount-ful drafts. */
function draftScore(d) {
  if (!d) return -1;
  let s = 0;
  if (d.exact) s += 6;
  if (d.title && !/^untitled/i.test(d.title)) s += 4;
  s += Math.min(d.ingredients.length, 12);
  s += d.ingredients.filter((i) => /\d/.test(typeof i === 'string' ? i : String(i.amount))).length;
  s += Math.min(d.steps.length, 12) * 2;
  if ((d.prepMinutes || 0) + (d.cookMinutes || 0) > 0) s += 3;
  if (d.calories) s += 2;
  if (d.servings) s += 1;
  return s;
}

function extractWebRecipes(html, url) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const out = [];
  doc.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
    let j; try { j = JSON.parse(s.textContent); } catch (e) { return; }
    collectLdRecipes(j).forEach((r) => { const d = ldToDraft(r, url); if (d.ingredients.length) out.push(d); });
  });
  if (out.length) return out;
  const micro = microdataDraft(doc, url);
  if (micro) return [micro];
  /* last resort: heuristic scan of the page text */
  return textToDrafts(window.htmlToText(html), url);
}

/* Full pipeline for one URL: fetch + structured extraction; unless the
   result is structured (JSON-LD/microdata), ALSO read the page through
   a text-mode reader and keep whichever draft is higher quality. */
async function fetchRecipesFromUrl(url) {
  url = cleanRecipeUrl(url);
  let drafts = [], ferr = null;
  try { drafts = extractWebRecipes(await fetchTextCors(url), url); } catch (e) { ferr = e; }
  if (drafts.length && drafts[0].exact) return drafts;
  let reader = [];
  try {
    const r = await fetch('https://r.jina.ai/' + url);
    const md = r.ok ? await r.text() : '';
    if (md && md.length > 200 && !looksBlocked(md)) {
      reader = readerToDrafts(md, url);
      if (!reader.length) reader = textToDrafts(md, url);
    }
  } catch (e) {}
  const best = draftScore(reader[0]) > draftScore(drafts[0]) ? reader : drafts;
  if (!best.length && ferr) throw ferr;
  return best;
}

/* Meal-type inference from title/category/cuisine keywords. */
function inferMeal(d) {
  const t = ((d.title || '') + ' ' + (d.category || '') + ' ' + (d.cuisine || '')).toLowerCase();
  if (/dessert|ice cream|gelato|sorbet|cake|cupcake|cookie|biscuit|brownie|\bpie\b|pudding|custard|tart\b|cheesecake|fudge|candy|mousse|macaron|donut|doughnut|pastry|sweet/.test(t)) return 'Dessert';
  if (/breakfast|brunch|pancake|waffle|oatmeal|porridge|granola|muesli|smoothie|omelet|scramble|french toast/.test(t)) return 'Breakfast';
  if (/snack|appetizer|appetiser|\bdip\b|hummus|trail mix|energy ball|cracker|popcorn/.test(t)) return 'Snack';
  if (/lunch|salad|sandwich|\bwrap\b/.test(t)) return 'Lunch';
  return 'Dinner';
}

/* Factual, self-written summary — replaces the page's editorial prose. */
function factSummary(d) {
  const bits = [];
  if (d.yield) bits.push('makes ' + d.yield.toLowerCase().replace(/^makes\s+/i, ''));
  else if (d.servings) bits.push('serves ' + d.servings);
  const total = (d.prepMinutes || 0) + (d.cookMinutes || 0);
  if (total) bits.push('about ' + total + ' min');
  bits.push(d.ingredients.length + ' ingredients, ' + d.steps.length + ' steps');
  const what = [d.cuisine, d.category].filter((x) => x && !/^(other|uncategori)/i.test(x)).join(' ').toLowerCase();
  return (what ? what.charAt(0).toUpperCase() + what.slice(1) + ' from ' : 'From ') + (d.host || 'the web') + ' \u2014 ' + bits.join(' \u00b7 ') + '. Ingredients and method kept exactly as published.';
}

/* draft → app recipe. ingredients may be verbatim strings (web/YouTube)
   or already-parsed objects (bulk/photo). crit=null → NO changes. */
function draftToRecipe(d, opts) {
  opts = opts || {};
  let ings = d.ingredients.map((line) => {
    if (typeof line !== 'string') return line;
    const p = window.classifyIngredient(line);
    return p || { amount: null, unit: '', name: line };
  });
  const tags = ['imported'];
  if (opts.crit && Object.values(opts.crit).some(Boolean)) {
    const res = window.analyzeDraft({ ingredients: ings }, opts.crit, true);
    if (res.fixable.length) { ings = res.ingredients; tags.push('amended'); }
  }
  const meal = d.mealType || inferMeal(d);
  const cat = (d.category && !/^(other|uncategori)/i.test(d.category)) ? d.category : (meal === 'Dessert' ? 'Desserts' : 'Imported');
  return {
    recipeId: 'imp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    title: d.title,
    subtitle: opts.subtitle || (d.host ? 'Imported from ' + d.host : 'Imported'),
    description: d.exact != null ? factSummary(d) : (d.description || ''),
    category: cat, cuisine: d.cuisine || 'Other',
    mealType: meal, difficulty: 'Easy',
    prepMinutes: d.prepMinutes || 0, cookMinutes: d.cookMinutes || 0,
    totalMinutes: (d.prepMinutes || 0) + (d.cookMinutes || 0),
    servings: d.servings || 4, tags,
    sourceUrl: d.sourceUrl || '', image: d.image || '',
    ingredients: ings,
    instructions: d.steps.map((s) => ({ instruction: s })),
    nutrition: Object.assign({ calories: d.calories || 0, protein: 0, fat: 0, carbs: 0, fibre: 0, sugar: 0 }, d.nutrition || {}),
  };
}

/* ---------------- YouTube ------------------------------------------ */
function ytVideoId(url) {
  const m = String(url || '').match(/(?:youtube\.com\/(?:watch\?[^#]*v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{6,20})/i);
  return m ? m[1] : null;
}

async function ytMetadata(url) {
  const r = await fetch('https://noembed.com/embed?url=' + encodeURIComponent(url));
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return { title: j.title, author: j.author_name || '', thumb: j.thumbnail_url || '' };
}

/* The watch page embeds the full description as "shortDescription" in a
   JSON blob — fetched through a relay since YouTube blocks direct reads. */
async function ytDescription(vid) {
  const html = await fetchTextCors('https://www.youtube.com/watch?v=' + vid);
  const m = html.match(/"shortDescription":"((?:[^"\\]|\\.)*)"/);
  if (!m) return '';
  try { return JSON.parse('"' + m[1] + '"'); } catch (e) { return ''; }
}

/* ---------------- photo OCR (tesseract.js, lazy) -------------------- */
let tessLoading = null;
function loadTesseract() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  if (!tessLoading) {
    tessLoading = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/tesseract.js@5.1.1/dist/tesseract.min.js';
      s.onload = () => resolve(window.Tesseract);
      s.onerror = () => { tessLoading = null; reject(new Error('Could not load the text-recognition engine (offline?)')); };
      document.head.appendChild(s);
    });
  }
  return tessLoading;
}

async function ocrImages(files, onProgress) {
  const T = await loadTesseract();
  const worker = await T.createWorker('eng', 1, {
    logger: (m) => { if (m.status === 'recognizing text' && onProgress) onProgress(m.progress); },
  });
  let out = '';
  try {
    for (const f of files) {
      const { data } = await worker.recognize(f);
      out += data.text + '\n\n';
    }
  } finally { await worker.terminate(); }
  return out;
}

window.WebImport = { fetchTextCors, fetchRecipesFromUrl, extractWebRecipes, readerToDrafts, draftToRecipe, factSummary, ytVideoId, ytMetadata, ytDescription, ocrImages };
