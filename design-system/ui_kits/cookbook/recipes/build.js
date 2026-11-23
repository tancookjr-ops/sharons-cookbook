/* ==================================================================
   recipes/build.js — compact recipe builder for the Cookbook UI kit.

   The AI-import recipe collection lives in the sibling chunk files
   (breakfast.js, mains.js, …). Each calls R({ … }) with terse tuple
   ingredients/instructions; this expands them to the full schema the
   screens read (SCHEMA.md → Recipe / Ingredient / Instruction) and
   pushes onto window.CB.recipes, which data.js merges.

   Ingredient tuple:  [amount, unit, name, notes?, extra?]
       amount ''/null → "to taste";  extra = {optional:true} | {substitutions:[…]}
   Instruction tuple: [title, instruction, extra?]
       extra = { t:timerMinutes, temp:'200 °C', eq:'Blender' }
   nut(calories, protein, fat, carbs, fibre, sugar) — per serving.

   EVERYTHING added through here is vegan: no meat, no fish, no animal
   dairy or eggs. Dairy-style items are always the plant-based version.
   ================================================================== */
window.CB = { recipes: [] };

function slug(t) {
  return 'rec_' + String(t).toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function ing(a) {
  if (a && !Array.isArray(a)) return a;               // already a full object
  var amount = a[0], unit = a[1], name = a[2], notes = a[3], extra = a[4];
  var o = { name: name, amount: (amount === '' || amount == null ? null : amount), unit: unit || '' };
  if (notes) o.notes = notes;
  if (extra) {
    if (extra.optional) o.optional = true;
    if (extra.substitutions) o.substitutions = extra.substitutions;
  }
  return o;
}

function step(a) {
  if (a && !Array.isArray(a)) return a;
  var title = a[0], instruction = a[1], extra = a[2];
  var o = {};
  if (title) o.title = title;
  o.instruction = instruction;
  if (extra) {
    if (extra.t) o.timerMinutes = extra.t;
    if (extra.temp) o.temperature = extra.temp;
    if (extra.eq) o.equipment = extra.eq;
  }
  return o;
}

function nut(calories, protein, fat, carbs, fibre, sugar) {
  return { calories: calories, protein: protein, fat: fat, carbs: carbs, fibre: fibre, sugar: sugar };
}

function R(o) {
  o.prepMinutes = o.prepMinutes || 0;
  o.cookMinutes = o.cookMinutes || 0;
  o.totalMinutes = o.prepMinutes + o.cookMinutes;
  o.difficulty = o.difficulty || 'Easy';
  o.servings = o.servings || 4;
  o.mealType = o.mealType || 'Dinner';
  o.cuisine = o.cuisine || 'Other';
  o.ingredients = (o.ingredients || []).map(ing);
  o.instructions = (o.instructions || []).map(step);
  o.nutrition = o.nutrition || nut(0, 0, 0, 0, 0, 0);
  o.tags = o.tags || [];
  if (o.tags.indexOf('vegan') === -1) o.tags.unshift('vegan'); // safety: everything here is vegan
  if (!o.recipeId) o.recipeId = slug(o.title);
  window.CB.recipes.push(o);
  return o;
}
