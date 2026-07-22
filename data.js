/* ==================================================================
   data.js — seed content for the Sharon's Cookbook UI kit.

   Recipe collection (2026-07 update):
   • The original starter recipes are kept; the two that used fish or
     animal dairy were converted to vegan alternatives (see below).
   • ~200 further vegan recipes are imported from recipes/*.js
     (window.CB.recipes), focused on vegan, EoE-friendly, raw and
     seasonal foods — no meat, fish, or animal dairy anywhere.
   • The pantry is built from every ingredient the recipes use, so each
     recipe shows "✓ in your pantry" (assume-all-available import).

   Exposed as window.CookbookData.
   ================================================================== */
(function () {
  /* ---- Starter recipes (product originals; 4 vegan as-is) ---------- */
  const starterRecipes = [
    {
      recipeId: 'rec_hummus', title: 'Classic Lemon Hummus', subtitle: 'Smooth, bright, ready in ten minutes',
      description: 'A pantry-staple hummus with plenty of lemon and a good glug of olive oil. Doubles easily.',
      category: 'Sauces & dressings', cuisine: 'Middle Eastern', mealType: 'Snack', difficulty: 'Easy',
      prepMinutes: 10, cookMinutes: 0, totalMinutes: 10, servings: 6, yield: 'About 2 cups', favourite: true, rating: 5,
      tags: ['vegan', 'anti-inflammatory', 'raw', 'freezer-friendly'],
      ingredients: [
        { name: 'chickpeas', amount: 540, unit: 'ml', notes: 'one can, drained and rinsed' },
        { name: 'tahini', amount: 60, unit: 'ml' },
        { name: 'lemon', amount: 1, unit: '', notes: 'juiced, about 3 tbsp' },
        { name: 'garlic', amount: 1, unit: 'clove' },
        { name: 'olive oil', amount: 45, unit: 'ml' },
        { name: 'ground cumin', amount: 2.5, unit: 'ml' },
        { name: 'salt', amount: 2.5, unit: 'ml' },
      ],
      instructions: [
        { title: 'Blitz', instruction: 'Combine chickpeas, tahini, lemon juice, garlic, cumin and salt in a food processor. Blend until crumbly.' },
        { title: 'Emulsify', instruction: 'With the motor running, stream in the olive oil and 2–4 tablespoons of cold water until silky. Taste and adjust lemon and salt.' },
        { title: 'Serve', instruction: 'Spoon into a bowl, swirl the top, and finish with olive oil and a pinch of cumin.' },
      ],
      nutrition: { calories: 180, protein: 6, fat: 11, carbs: 15, fibre: 4, sugar: 1 },
      notes: 'Keeps a week in the fridge. Loosens up with a splash of water after chilling.',
      eoeNotes: 'Smooth texture — generally easy for EoE; check tolerance for sesame (tahini).',
      bloodSugarNotes: 'Low glycemic; pair with vegetables rather than bread to keep it gentle.',
      antiInflammatoryNotes: 'Olive oil, chickpeas and garlic are all anti-inflammatory staples.',
      storage: 'Airtight container in the fridge, up to 7 days.', freezer: 'Freezes fine for 3 months; stir well after thawing.', reheating: 'Serve cold or at room temperature.',
    },
    {
      recipeId: 'rec_chili', title: 'Three-Bean Garden Chili', subtitle: 'A big, freezer-friendly pot',
      description: 'Hearty vegan chili built for batch cooking — sweet with garden tomatoes and squash, warm with cumin and smoked paprika.',
      category: 'Soups & stews', cuisine: 'Mexican', mealType: 'Dinner', difficulty: 'Easy',
      prepMinutes: 20, cookMinutes: 45, totalMinutes: 65, servings: 8, yield: 'About 4 litres', favourite: true, rating: 5,
      tags: ['vegan', 'freezer-friendly', 'high-protein', 'blood-sugar-friendly', 'garden', 'batch-cooking'],
      ingredients: [
        { name: 'olive oil', amount: 30, unit: 'ml' },
        { name: 'onion', amount: 2, unit: '', notes: 'diced' },
        { name: 'garlic', amount: 4, unit: 'clove' },
        { name: 'bell pepper', amount: 2, unit: '', notes: 'any colour' },
        { name: 'crushed tomatoes', amount: 796, unit: 'ml', notes: 'one large can, or 1 kg fresh' },
        { name: 'black beans', amount: 540, unit: 'ml', notes: 'one can, rinsed' },
        { name: 'kidney beans', amount: 540, unit: 'ml', notes: 'one can, rinsed' },
        { name: 'chickpeas', amount: 540, unit: 'ml', notes: 'one can, rinsed' },
        { name: 'chili powder', amount: 30, unit: 'ml' },
        { name: 'ground cumin', amount: 15, unit: 'ml' },
        { name: 'smoked paprika', amount: 10, unit: 'ml' },
        { name: 'zucchini', amount: 1, unit: '', optional: true, notes: 'from the garden, diced' },
      ],
      instructions: [
        { title: 'Soften', instruction: 'Heat the oil in a large pot over medium heat. Cook onion, garlic and peppers until soft, about 8 minutes.', timerMinutes: 8, equipment: 'Large pot' },
        { title: 'Bloom the spices', instruction: 'Stir in chili powder, cumin and paprika; cook 1 minute until fragrant.', timerMinutes: 1 },
        { title: 'Simmer', instruction: 'Add tomatoes, all the beans, zucchini if using, and a cup of water. Simmer uncovered 35 minutes, stirring now and then.', timerMinutes: 35 },
        { title: 'Season and rest', instruction: 'Salt to taste. Like most chilis, it is even better the next day.' },
      ],
      nutrition: { calories: 310, protein: 15, fat: 7, carbs: 48, fibre: 14, sugar: 9 },
      notes: 'Serve over rice, baked potatoes, or on its own with cornbread.',
      bloodSugarNotes: 'High fibre and plant protein keep this very blood-sugar friendly.',
      antiInflammatoryNotes: 'Beans, tomatoes, garlic and spices — solidly anti-inflammatory.',
      storage: 'Fridge 4–5 days.', freezer: 'Portion into containers; freezes beautifully for 6 months.', reheating: 'Reheat gently on the stove with a splash of water.',
    },
    {
      recipeId: 'rec_squash', title: 'Roasted Squash & Sage Soup', subtitle: 'Autumn in a bowl',
      description: 'Deeply roasted squash blended silky-smooth with fresh sage — a natural home for the garden harvest.',
      category: 'Soups & stews', cuisine: 'Canadian', mealType: 'Lunch', difficulty: 'Easy',
      prepMinutes: 15, cookMinutes: 55, totalMinutes: 70, servings: 6, yield: '', favourite: false, rating: 4,
      tags: ['vegan', 'eoe-friendly', 'freezer-friendly', 'garden', 'anti-inflammatory'],
      ingredients: [
        { name: 'butternut squash', amount: 1.2, unit: 'kg', notes: 'peeled and cubed' },
        { name: 'onion', amount: 1, unit: '' },
        { name: 'olive oil', amount: 45, unit: 'ml' },
        { name: 'fresh sage', amount: 8, unit: '', notes: 'leaves, from the garden' },
        { name: 'vegetable stock', amount: 1, unit: 'l' },
        { name: 'maple syrup', amount: 15, unit: 'ml', optional: true, notes: "Nova Scotia's finest" },
      ],
      instructions: [
        { title: 'Roast', instruction: 'Toss squash and onion with oil, spread on a tray and roast until caramelised at the edges.', timerMinutes: 40, temperature: '200 °C', equipment: 'Sheet pan' },
        { title: 'Crisp the sage', instruction: 'Fry sage leaves in a little oil for 30 seconds until crisp; set a few aside for garnish.' },
        { title: 'Blend', instruction: 'Simmer the roasted vegetables in stock for 10 minutes, add most of the sage, then blend until completely smooth. Season, adding maple syrup if the squash needs help.', timerMinutes: 10, equipment: 'Blender' },
      ],
      nutrition: { calories: 190, protein: 3, fat: 9, carbs: 28, fibre: 5, sugar: 8 },
      eoeNotes: 'Completely smooth once blended — a reliable EoE-friendly texture.',
      antiInflammatoryNotes: 'Squash and olive oil; skip the maple syrup to keep sugar minimal.',
      storage: 'Fridge 5 days.', freezer: 'Freeze flat in bags for 6 months.', reheating: 'Stovetop over medium, whisking as it warms.',
    },
    /* CONVERTED → vegan: was "Tancook Island Fish Chowder" (haddock + milk + cream + butter).
       Same coastal soul, now plant-based: mushroom for the flake, oat cream, a hit of dulse. */
    {
      recipeId: 'rec_chowder', title: 'Tancook Island Corn Chowder', subtitle: 'The way the coast makes it',
      description: 'A creamy Nova Scotia chowder gone plant-based — potatoes, sweet corn and oat cream, with torn king oyster mushroom for the flake and a whisper of dulse for the sea. No flour, no fuss.',
      category: 'Soups & stews', cuisine: 'Maritime', mealType: 'Dinner', difficulty: 'Medium',
      prepMinutes: 20, cookMinutes: 30, totalMinutes: 50, servings: 4, yield: '', favourite: true, rating: 5,
      tags: ['vegan', 'eoe-friendly', 'maritime', 'garden', 'freezer-friendly'], source: 'Family recipe, made plant-based',
      ingredients: [
        { name: 'king oyster mushrooms', amount: 300, unit: 'g', notes: 'torn into chunks, for the flaky bite' },
        { name: 'potatoes', amount: 500, unit: 'g', notes: 'waxy, diced' },
        { name: 'sweet corn', amount: 375, unit: 'ml', notes: 'fresh or frozen kernels' },
        { name: 'onion', amount: 1, unit: '' },
        { name: 'celery', amount: 2, unit: '', notes: 'stalks, diced' },
        { name: 'olive oil', amount: 30, unit: 'ml', substitutions: ['vegan butter'] },
        { name: 'oat milk', amount: 500, unit: 'ml' },
        { name: 'oat cream', amount: 250, unit: 'ml', substitutions: ['cashew cream'] },
        { name: 'dulse flakes', amount: 5, unit: 'ml', optional: true, notes: 'Nova Scotia seaweed, for a taste of the sea' },
        { name: 'chives', amount: 2, unit: 'tbsp', notes: 'snipped, from the garden' },
      ],
      instructions: [
        { title: 'Sear', instruction: 'Brown the mushrooms in the oil until golden at the edges; lift out. They stand in for the flake of fish.', timerMinutes: 6, equipment: 'Dutch oven' },
        { title: 'Build the base', instruction: 'In the same pot, sweat onion and celery until translucent, about 6 minutes.', timerMinutes: 6 },
        { title: 'Cook the potatoes', instruction: 'Add potatoes and just enough water to cover. Simmer until tender, about 12 minutes.', timerMinutes: 12 },
        { title: 'Finish', instruction: 'Add corn, oat milk, oat cream, dulse and the mushrooms. Warm gently below a simmer for 8 minutes — never boil. Season, rest 10 minutes, and serve with chives.', timerMinutes: 8 },
      ],
      nutrition: { calories: 340, protein: 9, fat: 14, carbs: 46, fibre: 6, sugar: 9 },
      notes: 'Chowder improves with a rest — make it an hour ahead if you can.',
      eoeNotes: 'Soft, creamy and boneless — an easy texture. Blend half for an even smoother bowl.',
      antiInflammatoryNotes: 'Olive oil, oats and vegetables; dulse adds iodine and minerals.',
      storage: 'Fridge 3 days.', freezer: 'Oat cream holds without splitting; freezes 3 months.', reheating: 'Very gently on the stove; do not boil.',
    },
    /* CONVERTED → vegan: was vegetarian (dairy feta). Now plant-based feta by default. */
    {
      recipeId: 'rec_greek', title: 'Garden Greek Salad', subtitle: 'No lettuce, all crunch',
      description: 'Tomatoes, cucumber and herbs straight from the garden with olives and a sharp oregano dressing, finished with marinated plant-based feta.',
      category: 'Salads', cuisine: 'Greek', mealType: 'Lunch', difficulty: 'Easy',
      prepMinutes: 15, cookMinutes: 0, totalMinutes: 15, servings: 4, yield: '', favourite: false, rating: 4,
      tags: ['vegan', 'raw', 'garden', 'anti-inflammatory', 'blood-sugar-friendly'],
      ingredients: [
        { name: 'tomatoes', amount: 4, unit: '', notes: 'ripe, cut in wedges' },
        { name: 'cucumber', amount: 1, unit: '', notes: 'thick half-moons' },
        { name: 'red onion', amount: 0.5, unit: '', notes: 'thinly sliced' },
        { name: 'kalamata olives', amount: 125, unit: 'ml' },
        { name: 'plant-based feta', amount: 150, unit: 'g', notes: 'marinated in oil', substitutions: ['marinated firm tofu', 'almond feta'] },
        { name: 'olive oil', amount: 60, unit: 'ml' },
        { name: 'red wine vinegar', amount: 15, unit: 'ml' },
        { name: 'dried oregano', amount: 5, unit: 'ml' },
      ],
      instructions: [
        { instruction: "Layer tomatoes, cucumber, onion and olives in a wide bowl — don't toss yet." },
        { instruction: 'Whisk oil, vinegar, oregano and a pinch of salt; pour over the vegetables.' },
        { instruction: 'Top with a slab of plant-based feta, Greek-style, grind over pepper, and bring to the table untossed.' },
      ],
      nutrition: { calories: 250, protein: 5, fat: 22, carbs: 12, fibre: 3, sugar: 6 },
      bloodSugarNotes: 'Very low glycemic load — a good lunch anchor.',
      antiInflammatoryNotes: 'Olive oil, tomatoes and herbs make this a Mediterranean classic.',
      storage: 'Best immediately; keeps a day undressed.',
    },
    {
      recipeId: 'rec_oats', title: 'Blueberry Overnight Oats', subtitle: 'Breakfast that makes itself',
      description: 'Steel-cut texture without the morning wait — oats, chia and wild Nova Scotia blueberries.',
      category: 'Breakfast', cuisine: 'Canadian', mealType: 'Breakfast', difficulty: 'Easy',
      prepMinutes: 5, cookMinutes: 0, totalMinutes: 5, servings: 2, yield: '', favourite: false, rating: 4,
      tags: ['vegan', 'blood-sugar-friendly', 'eoe-friendly', 'raw'],
      ingredients: [
        { name: 'rolled oats', amount: 250, unit: 'ml' },
        { name: 'chia seeds', amount: 30, unit: 'ml' },
        { name: 'oat milk', amount: 375, unit: 'ml', substitutions: ['any plant milk'] },
        { name: 'wild blueberries', amount: 250, unit: 'ml', notes: 'fresh or frozen' },
        { name: 'cinnamon', amount: 2.5, unit: 'ml' },
        { name: 'maple syrup', amount: 15, unit: 'ml', optional: true },
      ],
      instructions: [
        { instruction: "Stir everything together in a jar. Really — that's it." },
        { instruction: 'Refrigerate at least 4 hours or overnight. Loosen with a splash of milk before eating.', timerMinutes: 240 },
      ],
      nutrition: { calories: 320, protein: 10, fat: 9, carbs: 52, fibre: 10, sugar: 12 },
      bloodSugarNotes: 'Oats + chia give a slow release; skip the maple syrup for the gentlest curve.',
      eoeNotes: 'Soft texture; use tolerated plant milk.',
      storage: 'Fridge, 3 days in sealed jars.',
    },
  ];

  /* ---- Merge the imported vegan collection (recipes/*.js) ---------- */
  const imported = (window.CB && Array.isArray(window.CB.recipes)) ? window.CB.recipes : [];
  const recipes = starterRecipes.concat(imported);

  /* ================================================================
     Pantry — built from every ingredient the recipes use, so each
     recipe reads "✓ in your pantry". (Assume-all-available import.)
     Curated staples below add expiry / min-stock so the alerts work.
     ================================================================ */
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const SKIP = new Set(['water', 'cold water', 'warm water', 'hot water', 'boiling water', 'ice', 'ice cubes', 'salt and pepper']);

  // → [category, location] for a plant ingredient. Best-effort grouping.
  function catOf(nameRaw) {
    const n = ' ' + nameRaw.toLowerCase() + ' ';
    const rules = [
      [/frozen/, 'Frozen', 'Freezer'],
      [/\boil\b|vinegar/, 'Oils & vinegars', 'Pantry'],
      [/\b(almond|walnut|cashew|pecan|hazelnut|pine nut|pistachio|peanut)s?\b|sunflower seed|pumpkin seed|sesame seed|chia seed|flax|hemp/, 'Other', 'Pantry'],
      [/tofu|tempeh|edamame|seitan/, 'Legumes', 'Fridge'],
      [/canned|\bcan\b|crushed tomatoes|coconut milk|coconut cream|tomato paste|tomato passata|passata|\bstock\b|\bbroth\b|bouillon/, 'Canned', 'Pantry'],
      [/\b(lentils?|beans?|chickpeas?|split peas?|dal)\b/, 'Legumes', 'Pantry'],
      [/flour|\boats?\b|\brice\b|quinoa|pasta|noodle|barley|couscous|polenta|cornmeal|corn meal|millet|buckwheat|bulgur|semolina|\bbread\b|tortilla|breadcrumb|cornstarch|corn starch/, 'Grains', 'Bulk storage'],
      [/milk|yogurt|yoghurt|\bcream\b|cheese|\bbutter\b|feta|\bcurd\b|custard/, 'Dairy', 'Fridge'],
      [/sugar|baking powder|baking soda|\byeast\b|cocoa|cacao|vanilla|icing/, 'Baking', 'Pantry'],
      [/maple syrup|molasses|agave|jam|marmalade|tahini|nut butter|peanut butter|almond butter|miso|olives|capers|sun-dried|pickled|syrup|dates?\b|dried fig|raisin|apricot/, 'Preserves', 'Pantry'],
      [/salt|pepper|paprika|cumin|cinnamon|nutmeg|turmeric|oregano|thyme|chilli|chili|cardamom|\bclove|garam|curry|bay lea|za'?atar|sumac|coriander seed|fennel seed|mustard seed|caraway|dried|ground|\bspice|zest|extract|flakes|cayenne|saffron|vanilla pod/, 'Spices', 'Pantry'],
    ];
    for (const [re, c, l] of rules) if (re.test(n)) return [c, l];
    if (/basil|parsley|cilantro|coriander|\bmint\b|\bdill\b|\bsage\b|chives|rosemary|tarragon|marjoram|lemongrass/.test(n)) return ['Produce', 'Garden harvest'];
    if (/onion|garlic|potato|squash|pumpkin|ginger|shallot|beet|turnip|rutabaga|carrot|parsnip|apple|pear|lemon|lime|orange|winter/.test(n)) return ['Produce', 'Pantry'];
    return ['Produce', 'Fridge'];
  }
  const QDEF = {
    'Produce': { quantity: 6, unit: '' }, 'Dairy': { quantity: 1, unit: 'l' }, 'Grains': { quantity: 1, unit: 'kg' },
    'Legumes': { quantity: 3, unit: 'cans' }, 'Canned': { quantity: 3, unit: 'cans' }, 'Oils & vinegars': { quantity: 750, unit: 'ml' },
    'Baking': { quantity: 500, unit: 'g' }, 'Spices': { quantity: 60, unit: 'g' }, 'Preserves': { quantity: 1, unit: 'jar' },
    'Frozen': { quantity: 1, unit: 'kg' }, 'Other': { quantity: 300, unit: 'g' },
  };

  // Curated staples: expiry + min/max so dashboard & pantry alerts fire. All vegan.
  // store = default preferred store (editable in the pantry).
  const curated = [
    { name: 'Olive oil', category: 'Oils & vinegars', quantity: 1500, unit: 'ml', minimum: 500, maximum: 3000, location: 'Pantry', store: 'Costco' },
    { name: 'Chickpeas', category: 'Legumes', quantity: 4, unit: 'cans', minimum: 2, maximum: 8, location: 'Pantry', store: 'No Frills' },
    { name: 'Garlic', category: 'Produce', quantity: 3, unit: 'heads', minimum: 1, location: 'Pantry', store: "Pete's Fruitique" },
    { name: 'Tahini', category: 'Preserves', quantity: 1, unit: 'jar', minimum: 1, location: 'Pantry', notes: 'Running low' },
    { name: 'Smoked paprika', category: 'Spices', quantity: 40, unit: 'g', minimum: 20, location: 'Pantry' },
    { name: 'Maple syrup', category: 'Preserves', quantity: 1, unit: 'l', minimum: 1, location: 'Pantry', notes: 'Nova Scotia grade A' },
    { name: 'Oat milk', category: 'Dairy', quantity: 2, unit: 'l', minimum: 1, location: 'Fridge', expiry: '2026-07-14' },
    { name: 'Plant-based feta', category: 'Dairy', quantity: 200, unit: 'g', minimum: 100, location: 'Fridge', expiry: '2026-07-13' },
    { name: 'King oyster mushrooms', category: 'Produce', quantity: 400, unit: 'g', location: 'Fridge', expiry: '2026-07-11' },
    { name: 'Fresh coriander', category: 'Produce', quantity: 1, unit: 'bunch', location: 'Garden harvest', expiry: '2026-07-06' },
    { name: 'Fresh sage', category: 'Produce', quantity: 1, unit: 'bunch', location: 'Garden harvest' },
    { name: 'Wild blueberries', category: 'Frozen', quantity: 1, unit: 'kg', location: 'Freezer' },
    { name: 'Rolled oats', category: 'Grains', quantity: 2, unit: 'kg', minimum: 0.5, location: 'Bulk storage' },
    { name: 'Dried chickpeas', category: 'Legumes', quantity: 3, unit: 'kg', minimum: 1, location: 'Bulk storage' },
    { name: 'Dulse flakes', category: 'Preserves', quantity: 80, unit: 'g', minimum: 30, location: 'Pantry', notes: 'Nova Scotia seaweed' },
  ];

  function buildPantry(allRecipes) {
    const map = {};
    for (const r of allRecipes) {
      for (const i of (r.ingredients || [])) {
        const name = String(i.name || '').trim();
        if (!name) continue;
        const key = name.toLowerCase();
        if (SKIP.has(key) || map[key]) continue;
        const [category, location] = catOf(name);
        const q = QDEF[category] || { quantity: 1, unit: '' };
        map[key] = { name: cap(name), category, quantity: q.quantity, unit: q.unit, location };
      }
    }
    for (const c of curated) map[c.name.toLowerCase()] = c; // curated wins
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
  }
  const pantry = buildPantry(recipes);

  /* ---- Garden (expanded for a fuller seasonal harvest) ------------ */
  const garden = [
    { plantName: 'Tomato', variety: 'San Marzano', location: 'Bed 2', plantDate: '2026-05-24', harvestDate: '2026-08-15', quantity: 6, unit: 'kg', preservation: ['Freezing', 'Canning'], notes: 'Twelve plants, staked.', harvests: [{ date: '2026-08-15', quantity: 6, unit: 'kg' }] },
    { plantName: 'Sage', variety: '', location: 'Herb spiral', plantDate: '2026-05-10', harvestDate: '2026-09-30', quantity: 4, unit: 'bunches', preservation: ['Drying'], notes: 'Perennial — third year.', harvests: [{ date: '2026-07-01', quantity: 2, unit: 'bunches' }] },
    { plantName: 'Zucchini', variety: 'Costata Romanesco', location: 'Bed 4', plantDate: '2026-05-28', harvestDate: '2026-07-20', quantity: 3, unit: 'kg', preservation: ['Freezing'], notes: 'Two hills — watch for gluts.', harvests: [{ date: '2026-07-06', quantity: 1.5, unit: 'kg' }] },
    { plantName: 'Blueberry', variety: 'Wild lowbush', location: 'Back slope', plantDate: '2023-05-01', harvestDate: '2026-08-01', quantity: 2, unit: 'kg', preservation: ['Freezing'], notes: 'Established patch.', harvests: [{ date: '2026-07-05', quantity: 1.2, unit: 'kg' }] },
    { plantName: 'Kale', variety: 'Lacinato', location: 'Bed 1', plantDate: '2026-05-05', harvestDate: '2026-07-01', quantity: 2, unit: 'kg', preservation: ['Freezing'], notes: 'Cut-and-come-again all season.', harvests: [{ date: '2026-07-07', quantity: 0.6, unit: 'kg' }] },
    { plantName: 'Cucumber', variety: 'Marketmore', location: 'Bed 3', plantDate: '2026-05-30', harvestDate: '2026-07-25', quantity: 4, unit: 'kg', preservation: ['Fermentation'], notes: 'Trellised along the fence.', harvests: [] },
    { plantName: 'Basil', variety: 'Genovese', location: 'Herb spiral', plantDate: '2026-05-20', harvestDate: '2026-07-15', quantity: 1.5, unit: 'bunches', preservation: ['Freezing'], notes: 'Pinch often for pesto.', harvests: [{ date: '2026-07-04', quantity: 0.5, unit: 'bunches' }] },
    { plantName: 'Rhubarb', variety: 'Victoria', location: 'Back slope', plantDate: '2022-04-15', harvestDate: '2026-06-01', quantity: 3, unit: 'kg', preservation: ['Freezing', 'Canning'], notes: 'Stop pulling by July.', harvests: [{ date: '2026-06-20', quantity: 2, unit: 'kg' }] },
    { plantName: 'Green beans', variety: 'Provider', location: 'Bed 5', plantDate: '2026-06-01', harvestDate: '2026-08-05', quantity: 2.5, unit: 'kg', preservation: ['Freezing'], notes: 'Succession sown.', harvests: [] },
    { plantName: 'Bell pepper', variety: 'Sweet Carmen', location: 'Greenhouse', plantDate: '2026-05-15', harvestDate: '2026-08-20', quantity: 2, unit: 'kg', preservation: ['Freezing'], notes: 'Warmest corner.', harvests: [] },
  ];

  /* ---- Household shopping (vegan; no meat & fish) ------------------ */
  const household = [
    { name: 'Lemons', category: 'Produce', quantity: 6, unit: '', checked: false, priority: 'normal' },
    { name: 'Red onion', category: 'Produce', quantity: 2, unit: '', checked: false, priority: 'normal' },
    { name: 'Sourdough loaf', category: 'Bakery', quantity: 1, unit: '', checked: true, priority: 'normal' },
    { name: 'Frozen peas', category: 'Frozen', quantity: 1, unit: 'bag', checked: false, priority: 'normal' },
    { name: 'Tahini', category: 'Pantry', quantity: 1, unit: 'jar', checked: false, priority: 'high', notes: 'Running low' },
    { name: 'Oat milk', category: 'Dairy', quantity: 2, unit: 'cartons', checked: false, priority: 'normal', recurring: true },
    { name: 'Silken tofu', category: 'Produce', quantity: 2, unit: 'blocks', checked: false, priority: 'normal' },
    { name: 'King oyster mushrooms', category: 'Produce', quantity: 400, unit: 'g', checked: false, priority: 'normal' },
    { name: 'Dish soap', category: 'Cleaning', quantity: 1, unit: '', checked: true, priority: 'normal' },
  ];

  const botanicals = [
    { name: 'Coconut oil', category: 'Soap oils', quantity: 5, unit: 'kg', checked: false, priority: 'high', notes: 'For summer soap batch' },
    { name: 'Lavender essential oil', category: 'Essential oils', quantity: 250, unit: 'ml', checked: false, priority: 'normal' },
    { name: 'Soy wax flakes', category: 'Wax', quantity: 10, unit: 'kg', checked: false, priority: 'normal', recurring: true },
    { name: 'Cotton wicks', category: 'Wicks', quantity: 100, unit: '', checked: true, priority: 'normal' },
    { name: 'Sodium hydroxide', category: 'Lye', quantity: 2, unit: 'kg', checked: false, priority: 'high' },
    { name: 'Amber jars 250ml', category: 'Jars', quantity: 48, unit: '', checked: false, priority: 'normal' },
    { name: 'Kraft labels', category: 'Labels', quantity: 200, unit: '', checked: false, priority: 'normal' },
    { name: 'Shipping boxes', category: 'Shipping', quantity: 30, unit: '', checked: true, priority: 'normal' },
  ];

  /* ---- Meal plans (current week, Mon–Sun by day index) ------------ */
  const plans = [
    { day: 0, mealType: 'Breakfast', recipeId: 'rec_oats', servings: 2, completed: true },
    { day: 0, mealType: 'Dinner', recipeId: 'rec_chili', servings: 8, batch: true },
    { day: 1, mealType: 'Lunch', recipeId: 'rec_greek', servings: 4 },
    { day: 1, mealType: 'Dinner', recipeId: 'rec_chili', servings: 2, leftovers: true },
    { day: 2, mealType: 'Lunch', recipeId: 'rec_squash', servings: 6 },
    { day: 3, mealType: 'Breakfast', recipeId: 'rec_oats', servings: 2 },
    { day: 3, mealType: 'Dinner', recipeId: 'rec_chowder', servings: 4 },
    { day: 4, mealType: 'Snack', recipeId: 'rec_hummus', servings: 6 },
    { day: 5, mealType: 'Dinner', recipeId: 'rec_squash', servings: 6, batch: true },
    { day: 6, mealType: 'Lunch', recipeId: 'rec_greek', servings: 4 },
  ];

  const activity = [
    { summary: 'Imported 200 vegan recipes via AI assistant', rel: 'just now' },
    { summary: 'Stocked the pantry from the new recipes', rel: 'just now' },
    { summary: 'Harvested 0.6 kg kale', rel: 'yesterday' },
    { summary: 'Planned “Three-Bean Garden Chili” for Monday', rel: '2 days ago' },
  ];

  window.CookbookData = { recipes, pantry, garden, household, botanicals, plans, activity };
})();
