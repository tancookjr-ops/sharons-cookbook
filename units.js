/* ==================================================================
   units.js — display-time measurement conversion.
   Metric ↔ imperial, and volume ↔ weight via per-ingredient specific
   gravity (g/ml) — never a water-standard. Stored data never changes.
   ================================================================== */

/* Specific gravity (g/ml) by ingredient keyword; first match wins.
   Format: [keyword, loose sg, packed sg?] — the third value is for dry,
   packable ingredients (spooned loose vs pressed into the measure).
   Seed values only — at runtime the app keeps an editable copy (Settings
   → Ingredient specific gravity) and publishes it as window.DENSITY_TABLE,
   which is the source of truth. */
var ING_DENSITY = [
  ['icing sugar', 0.56, 0.62], ['brown sugar', 0.72, 0.93], ['sugar', 0.85],
  ['whole wheat flour', 0.55, 0.62], ['gf flour', 0.55, 0.62], ['flour', 0.53, 0.63],
  ['cornstarch', 0.64], ['cornmeal', 0.68], ['cocoa', 0.52, 0.6],
  ['baking powder', 0.9], ['baking soda', 0.9], ['salt', 1.22],
  ['butter', 0.91], ['margarine', 0.91], ['shortening', 0.92],
  ['peanut butter', 1.01], ['tahini', 1.02],
  ['oil', 0.92], ['honey', 1.42], ['maple syrup', 1.32], ['molasses', 1.4],
  ['jam', 1.33], ['tomato paste', 1.1], ['ketchup', 1.14],
  ['soy sauce', 1.15], ['coconut aminos', 1.15], ['vinegar', 1.01],
  ['milk', 1.03], ['buttermilk', 1.03], ['cream', 1.0], ['yogurt', 1.03],
  ['broth', 1.0], ['stock', 1.0], ['water', 1.0], ['wine', 0.99], ['juice', 1.05],
  ['oats', 0.41, 0.48], ['rice', 0.78], ['quinoa', 0.74], ['couscous', 0.72],
  ['lentil', 0.85], ['bean', 0.86], ['chickpea', 0.86], ['split pea', 0.85],
  ['breadcrumb', 0.42, 0.5], ['panko', 0.25],
  ['walnut', 0.52], ['pecan', 0.45], ['almond', 0.6], ['cashew', 0.58],
  ['sunflower seed', 0.58], ['pumpkin seed', 0.56], ['sesame', 0.58],
  ['chia', 0.68], ['flax', 0.53], ['hemp', 0.55],
  ['parmesan', 0.42], ['cheese', 0.38],
  ['raisin', 0.68], ['cranberr', 0.6], ['date', 0.72], ['coconut', 0.35, 0.48],
];
/* packing: 'loose' (default) or 'packed' — only differs for entries
   that carry a packed value. */
function densityFor(name, packing) {
  var n = String(name || '').toLowerCase();
  var packed = packing === 'packed';
  var table = window.DENSITY_TABLE;
  if (table) {
    for (var j = 0; j < table.length; j++) {
      if (n.indexOf(table[j].key) !== -1) {
        if (packed && table[j].packed != null) return table[j].packed;
        return table[j].sg != null ? table[j].sg : null;
      }
    }
    return null;
  }
  for (var i = 0; i < ING_DENSITY.length; i++) {
    if (n.indexOf(ING_DENSITY[i][0]) !== -1) {
      if (packed && ING_DENSITY[i][2] != null) return ING_DENSITY[i][2];
      return ING_DENSITY[i][1];
    }
  }
  return null;
}
/* Does this ingredient have distinct loose/packed values? (for UI) */
function isPackable(name) {
  var n = String(name || '').toLowerCase();
  var table = window.DENSITY_TABLE;
  if (table) {
    for (var j = 0; j < table.length; j++) if (n.indexOf(table[j].key) !== -1) return table[j].packed != null;
    return false;
  }
  for (var i = 0; i < ING_DENSITY.length; i++) if (n.indexOf(ING_DENSITY[i][0]) !== -1) return ING_DENSITY[i][2] != null;
  return false;
}

/* unit → [kind, ml-or-g per unit] */
var UNIT_DEFS = {
  ml: ['vol', 1], l: ['vol', 1000], litre: ['vol', 1000], liter: ['vol', 1000],
  tsp: ['vol', 5], tbsp: ['vol', 15], cup: ['vol', 250], cups: ['vol', 250],
  'fl oz': ['vol', 30],
  g: ['wt', 1], kg: ['wt', 1000], oz: ['wt', 28.35], lb: ['wt', 453.6], lbs: ['wt', 453.6],
};
function unitDef(u) { return UNIT_DEFS[String(u || '').toLowerCase().trim()] || null; }

function roundTo(n, q) { return Math.round(n / q) * q; }
function fmtNum(n) {
  var r = Math.round(n * 100) / 100;
  return String(r % 1 === 0 ? r : r);
}

/* Format a canonical amount (ml or g) in the requested system. */
function fmtCanonical(kind, amt, system) {
  if (kind === 'vol') {
    if (system === 'imperial') {
      if (amt < 15) return fmtNum(roundTo(amt / 5, 0.25)) + ' tsp';
      if (amt < 60) return fmtNum(roundTo(amt / 15, 0.25)) + ' tbsp';
      return fmtNum(roundTo(amt / 240, 0.25)) + ' cup';
    }
    if (amt >= 1000) return fmtNum(amt / 1000) + ' l';
    return fmtNum(roundTo(amt, amt < 20 ? 1 : 5)) + ' ml';
  }
  if (system === 'imperial') {
    if (amt >= 453.6) return fmtNum(roundTo(amt / 453.6, 0.05)) + ' lb';
    return fmtNum(roundTo(amt / 28.35, 0.25)) + ' oz';
  }
  if (amt >= 1000) return fmtNum(amt / 1000) + ' kg';
  return fmtNum(roundTo(amt, amt < 20 ? 1 : 5)) + ' g';
}

/* Main entry: ingredient {name, unit}, already-scaled amount, and the
   active {system: metric|imperial, form: volume|weight}, plus packing
   ('loose' | 'packed') for dry, packable ingredients.
   Returns {text, approx, packable} — approx marks a density-based
   vol↔wt hop; packable says the packing choice affected (or could
   affect) this ingredient. Count-style units pass through untouched. */
function convertIngredientDisplay(ing, scaledAmount, system, form, packing) {
  if (scaledAmount == null || scaledAmount === '') return { text: '', approx: false, packable: false };
  var def = unitDef(ing.unit);
  if (!def) return { text: window.fmtAmount(scaledAmount) + (ing.unit ? ' ' + ing.unit : ''), approx: false, packable: false };

  var kind = def[0];
  var canonical = scaledAmount * def[1];   /* ml or g */
  var wantKind = form === 'weight' ? 'wt' : 'vol';
  var approx = false;
  var packable = false;

  if (kind !== wantKind) {
    var d = densityFor(ing.name, packing);
    if (d) {
      canonical = kind === 'vol' ? canonical * d : canonical / d;
      kind = wantKind;
      approx = true;
      packable = isPackable(ing.name);
    }
    /* no density known → keep the ingredient's native kind */
  }
  return { text: fmtCanonical(kind, canonical, system), approx: approx, packable: packable };
}

window.ING_DENSITY = ING_DENSITY;
window.densityFor = densityFor;
window.isPackable = isPackable;
window.convertIngredientDisplay = convertIngredientDisplay;
