/* recipes/snacks-desserts.js — 16 vegan snacks + 12 vegan desserts.
   Pushes to window.CB.recipes. */

/* ---- Snacks (16) ---- */
R({ title: 'Crispy Roasted Chickpeas', subtitle: 'The crunchy handful', category: 'Snacks', cuisine: 'Middle Eastern', mealType: 'Snack',
  description: 'Chickpeas roasted until shatteringly crisp and dusted with smoked paprika.',
  prepMinutes: 5, cookMinutes: 30, servings: 4,
  ingredients: [[540,'ml','chickpeas','rinsed, dried'],[30,'ml','olive oil'],[10,'ml','smoked paprika'],[2.5,'ml','salt']],
  instructions: [['Dry','Pat the chickpeas very dry.'],['Roast','Toss with oil and roast, shaking, until crunchy; dust with paprika.',{t:30,temp:'220 °C'}]],
  nutrition: nut(190,8,8,22,6,3), tags:['high-protein','anti-inflammatory'],
  bloodSugarNotes: 'High-fibre, high-protein — a steadying snack.' });

R({ title: 'No-Bake Energy Balls', subtitle: 'Pantry, meet blender', category: 'Snacks', cuisine: 'Canadian', mealType: 'Snack',
  description: 'Dates, oats and peanut butter rolled into pop-able bites.',
  prepMinutes: 12, cookMinutes: 0, servings: 16, yield: '16 balls',
  ingredients: [[12,'','dates','pitted'],[250,'ml','rolled oats'],[90,'ml','peanut butter'],[30,'ml','cocoa powder'],[30,'ml','chia seeds']],
  instructions: [['Blitz','Blitz dates, then add the rest to a sticky dough.'],['Roll','Roll into balls; chill to firm.',{t:30}]],
  nutrition: nut(110,3,5,15,3,9), tags:['raw','blood-sugar-friendly','freezer-friendly'],
  eoeNotes: 'Chewy; contains peanut — check tolerance.', freezer:'Freezes 3 months.' });

R({ title: 'Garden Kale Chips', subtitle: 'Crisp, salty, green', category: 'Snacks', cuisine: 'Canadian', mealType: 'Snack',
  description: 'Kale leaves baked low until they shatter, dusted with nutritional yeast.',
  prepMinutes: 8, cookMinutes: 18, servings: 4,
  ingredients: [[1,'','bunch kale','torn'],[30,'ml','olive oil'],[30,'ml','nutritional yeast'],[2.5,'ml','salt']],
  instructions: [['Massage','Massage kale with oil.'],['Bake','Bake low until crisp; dust with yeast and salt.',{t:18,temp:'150 °C'}]],
  nutrition: nut(90,4,6,7,2,1), tags:['garden','anti-inflammatory'] });

R({ title: 'Maple Spiced Nuts', subtitle: 'Sweet and warm', category: 'Snacks', cuisine: 'Canadian', mealType: 'Snack',
  description: 'Mixed nuts glazed with maple and warm spice, roasted crackling.',
  prepMinutes: 5, cookMinutes: 15, servings: 8,
  ingredients: [[500,'ml','mixed nuts'],[45,'ml','maple syrup'],[5,'ml','cinnamon'],[2,'ml','cayenne'],[2.5,'ml','salt']],
  instructions: [['Toss','Toss nuts with maple, spice and salt.'],['Roast','Roast, stirring, until glazed; cool to crisp.',{t:15,temp:'170 °C'}]],
  nutrition: nut(240,7,19,12,3,7), tags:['high-protein'],
  eoeNotes: 'Crunchy; contains tree nuts — check tolerance.' });

R({ title: 'Classic Guacamole', subtitle: 'Bowl and chips', category: 'Snacks', cuisine: 'Mexican', mealType: 'Snack',
  description: 'Ripe avocado mashed with lime, onion and coriander.',
  prepMinutes: 10, cookMinutes: 0, servings: 4,
  ingredients: [[3,'','avocados'],[1,'','lime'],[0.25,'','red onion','minced'],[1,'','tomato','diced'],[15,'ml','fresh coriander'],[1,'','chilli',null,{optional:true}]],
  instructions: [['Mash','Mash avocado with lime and salt.'],['Fold','Stir in onion, tomato, coriander and chilli.']],
  nutrition: nut(180,2,15,12,7,2), tags:['raw','eoe-friendly','anti-inflammatory'],
  eoeNotes: 'Soft and smooth mashed; a gentle dip.' });

R({ title: 'Baba Ganoush', subtitle: 'Smoky eggplant dip', category: 'Snacks', cuisine: 'Middle Eastern', mealType: 'Snack',
  description: 'Charred eggplant blended silky with tahini and lemon.',
  prepMinutes: 10, cookMinutes: 30, servings: 6,
  ingredients: [[2,'','eggplant'],[60,'ml','tahini'],[2,'clove','garlic'],[30,'ml','lemon juice'],[30,'ml','olive oil']],
  instructions: [['Char','Roast eggplant until collapsed and smoky; scoop the flesh.',{t:30,temp:'230 °C'}],['Blend','Blend with tahini, garlic and lemon; swirl with oil.']],
  nutrition: nut(150,3,12,9,4,4), tags:['eoe-friendly','anti-inflammatory','garden'],
  eoeNotes: 'Smooth; contains sesame — check tolerance.' });

R({ title: 'White Bean & Rosemary Dip', subtitle: 'Two-minute blitz', category: 'Snacks', cuisine: 'Italian', mealType: 'Snack',
  description: 'Cannellini beans whipped smooth with rosemary, garlic and lemon.',
  prepMinutes: 5, cookMinutes: 0, servings: 6,
  ingredients: [[400,'g','cannellini beans','rinsed'],[1,'clove','garlic'],[5,'ml','fresh rosemary'],[30,'ml','lemon juice'],[45,'ml','olive oil']],
  instructions: [['Blend','Blend everything smooth, loosening with water.',{eq:'Blender'}]],
  nutrition: nut(140,5,9,12,4,1), tags:['eoe-friendly','high-protein','anti-inflammatory'],
  eoeNotes: 'Whipped smooth — a gentle dip.' });

R({ title: 'Trail Mix', subtitle: 'Pocket fuel', category: 'Snacks', cuisine: 'Canadian', mealType: 'Snack',
  description: 'A raw mix of nuts, seeds and dried fruit for the trail or the desk.',
  prepMinutes: 5, cookMinutes: 0, servings: 8,
  ingredients: [[250,'ml','almonds'],[125,'ml','pumpkin seeds'],[125,'ml','dried cranberries'],[80,'ml','dark chocolate chips']],
  instructions: [['Mix','Toss everything together; store in a jar.']],
  nutrition: nut(220,6,15,18,3,11), tags:['raw','high-protein'],
  eoeNotes: 'Crunchy; contains tree nuts — check tolerance.' });

R({ title: 'Seed Crackers', subtitle: 'Crisp and shard-like', category: 'Snacks', cuisine: 'Other', mealType: 'Snack',
  description: 'A gluten-free cracker of mixed seeds bound with psyllium — no flour.',
  prepMinutes: 10, cookMinutes: 45, servings: 10,
  ingredients: [[125,'ml','sunflower seeds'],[125,'ml','pumpkin seeds'],[60,'ml','flax seeds'],[60,'ml','sesame seeds'],[15,'ml','psyllium husk'],[300,'ml','water'],[2.5,'ml','salt']],
  instructions: [['Soak','Stir everything and rest until gel-like.',{t:15}],['Bake','Spread thin and bake low until crisp; break into shards.',{t:45,temp:'160 °C'}]],
  nutrition: nut(150,5,12,6,4,1), tags:['gluten-free','high-fibre'] });

R({ title: 'Sea Salt Edamame', subtitle: 'Two-minute protein', category: 'Snacks', cuisine: 'Japanese', mealType: 'Snack',
  description: 'Steamed edamame tossed with flaky salt — the easiest snack there is.',
  prepMinutes: 2, cookMinutes: 5, servings: 4,
  ingredients: [[400,'g','edamame','in pods'],[5,'ml','flaky salt']],
  instructions: [['Steam','Steam or boil the pods until bright and tender.',{t:5}],['Salt','Toss with flaky salt; eat warm.']],
  nutrition: nut(130,11,5,10,5,2), tags:['high-protein','quick'],
  eoeNotes: 'Soft beans; contains soy — check tolerance.' });

R({ title: 'Apple Nachos', subtitle: 'Snack for small hands', category: 'Snacks', cuisine: 'Canadian', mealType: 'Snack',
  description: 'Sliced apples drizzled with peanut butter and scattered with seeds.',
  prepMinutes: 8, cookMinutes: 0, servings: 4,
  ingredients: [[3,'','apples','sliced'],[60,'ml','peanut butter','warmed'],[30,'ml','pumpkin seeds'],[15,'ml','dark chocolate chips'],[5,'ml','cinnamon']],
  instructions: [['Fan','Fan apple slices on a plate.'],['Drizzle','Drizzle peanut butter; scatter seeds, chips and cinnamon.']],
  nutrition: nut(190,5,11,20,4,13), tags:['raw','garden','quick','blood-sugar-friendly'],
  eoeNotes: 'Soft apple and nut butter; contains peanut.' });

R({ title: 'Roasted Beet Hummus', subtitle: 'Hummus, gone pink', category: 'Snacks', cuisine: 'Middle Eastern', mealType: 'Snack',
  description: 'Classic hummus blended with roasted beet for colour and earthy sweetness.',
  prepMinutes: 10, cookMinutes: 40, servings: 8,
  ingredients: [[540,'ml','chickpeas','rinsed'],[2,'','beets','roasted'],[60,'ml','tahini'],[30,'ml','lemon juice'],[1,'clove','garlic'],[45,'ml','olive oil']],
  instructions: [['Roast','Roast beets until tender; peel.',{t:40,temp:'200 °C'}],['Blend','Blend everything until silky, loosening with water.',{eq:'Blender'}]],
  nutrition: nut(180,6,11,16,5,3), tags:['eoe-friendly','anti-inflammatory','garden'],
  eoeNotes: 'Smooth; contains sesame — check tolerance.', favourite:true, rating:4 });

R({ title: 'Nutritional Yeast Popcorn', subtitle: 'Movie night, cheesy-savoury', category: 'Snacks', cuisine: 'Canadian', mealType: 'Snack',
  description: 'Stovetop popcorn tossed with olive oil and nutritional yeast.',
  prepMinutes: 3, cookMinutes: 6, servings: 4,
  ingredients: [[125,'ml','popcorn kernels'],[30,'ml','olive oil'],[45,'ml','nutritional yeast'],[2.5,'ml','salt']],
  instructions: [['Pop','Pop the kernels in a covered pot with a little oil.',{t:5}],['Toss','Toss with the rest of the oil, yeast and salt.']],
  nutrition: nut(160,5,8,20,4,1), tags:['quick','high-fibre'] });

R({ title: 'Stuffed Medjool Dates', subtitle: 'Three-ingredient treat', category: 'Snacks', cuisine: 'Middle Eastern', mealType: 'Snack',
  description: 'Soft dates filled with almond butter and a flake of salt.',
  prepMinutes: 8, cookMinutes: 0, servings: 6,
  ingredients: [[12,'','Medjool dates','pitted'],[90,'ml','almond butter'],[2.5,'ml','flaky salt'],[15,'ml','sesame seeds',null,{optional:true}]],
  instructions: [['Fill','Open each date and spoon in almond butter.'],['Finish','Press closed; sprinkle with salt and sesame.']],
  nutrition: nut(150,3,7,22,3,18), tags:['raw','blood-sugar-friendly'],
  eoeNotes: 'Soft and chewy; contains almond and sesame.' });

R({ title: 'Cucumber Sushi Rolls', subtitle: 'Cool and crunchy', category: 'Snacks', cuisine: 'Japanese', mealType: 'Snack',
  description: 'Cucumber wrappers rolled around avocado and carrot — no rice, no cooking.',
  prepMinutes: 20, cookMinutes: 0, servings: 4,
  ingredients: [[2,'','cucumber','wide ribbons'],[1,'','avocado','sliced'],[1,'','carrot','julienned'],[0.5,'','red pepper','julienned'],[15,'ml','soy sauce'],[5,'ml','sesame seeds']],
  instructions: [['Roll','Lay cucumber ribbons, fill with avocado, carrot and pepper; roll up.'],['Serve','Pin with a toothpick; serve with soy and sesame.']],
  nutrition: nut(110,2,8,9,4,4), tags:['raw','garden','summer'],
  eoeNotes: 'Raw and crunchy; contains soy and sesame.' });

R({ title: 'Chia Oat Bars', subtitle: 'Grab-and-go slices', category: 'Snacks', cuisine: 'Canadian', mealType: 'Snack',
  description: 'Chewy no-bake bars of oats, chia and dried fruit held with date paste.',
  prepMinutes: 15, cookMinutes: 0, servings: 12, yield: '12 bars',
  ingredients: [[375,'ml','rolled oats'],[10,'','dates','pitted'],[45,'ml','chia seeds'],[90,'ml','almond butter'],[60,'ml','dried apricots','chopped'],[60,'ml','maple syrup']],
  instructions: [['Blitz','Blend dates and almond butter to a paste; mix with everything else.'],['Press','Press firmly into a lined tin; chill and slice.',{t:60}]],
  nutrition: nut(180,5,7,26,4,13), tags:['raw','blood-sugar-friendly','freezer-friendly'],
  freezer:'Freezes 3 months.' });

/* ---- Desserts (12) ---- */
R({ title: 'Banana Nice Cream', subtitle: 'Soft-serve from the freezer', category: 'Desserts', cuisine: 'Canadian', mealType: 'Snack',
  description: 'Frozen bananas blended into a soft, creamy soft-serve — one ingredient.',
  prepMinutes: 5, cookMinutes: 0, servings: 2,
  ingredients: [[3,'','bananas','frozen'],[30,'ml','oat milk'],[5,'ml','vanilla extract']],
  instructions: [['Blend','Blend frozen banana with a splash of oat milk until soft-serve smooth.',{eq:'Blender'}]],
  nutrition: nut(160,2,1,38,4,20), tags:['raw','eoe-friendly','blood-sugar-friendly'],
  eoeNotes: 'Cold, soft and completely smooth.', favourite:true, rating:5 });

R({ title: 'Dark Chocolate Avocado Mousse', subtitle: 'Silky and rich', category: 'Desserts', cuisine: 'French', mealType: 'Snack',
  description: 'Ripe avocado blended with cocoa and maple into a decadent, smooth mousse.',
  prepMinutes: 10, cookMinutes: 0, servings: 4,
  ingredients: [[2,'','avocados'],[60,'ml','cocoa powder'],[80,'ml','maple syrup'],[60,'ml','oat milk'],[5,'ml','vanilla extract'],[1,'','pinch salt']],
  instructions: [['Blend','Blend everything until glossy and completely smooth.',{eq:'Blender'}],['Chill','Chill 30 minutes.',{t:30}]],
  nutrition: nut(240,3,14,30,7,20), tags:['raw','eoe-friendly','anti-inflammatory'],
  eoeNotes: 'Velvet-smooth — a reliable easy dessert.' });

R({ title: 'Vegan Chocolate Chip Cookies', subtitle: 'Chewy centres, crisp edges', category: 'Desserts', cuisine: 'Canadian', mealType: 'Snack',
  description: 'The classic cookie, made with flax egg and vegan butter.',
  prepMinutes: 15, cookMinutes: 12, servings: 18, yield: '18 cookies',
  ingredients: [[500,'ml','flour'],[125,'ml','vegan butter'],[150,'ml','brown sugar'],[80,'ml','maple syrup'],[15,'ml','ground flax','plus water'],[5,'ml','baking soda'],[125,'ml','dark chocolate chips']],
  instructions: [['Cream','Beat vegan butter with sugar and maple; stir in flax egg.'],['Mix','Fold in flour, soda and chocolate.'],['Bake','Scoop and bake until golden at the edges.',{t:12,temp:'180 °C'}]],
  nutrition: nut(180,2,7,28,1,14), tags:['freezer-friendly','comfort'],
  freezer:'Freeze dough balls; bake from frozen.' });

R({ title: 'Summer Berry Crumble', subtitle: 'Bubbling and golden', category: 'Desserts', cuisine: 'Canadian', mealType: 'Snack',
  description: 'Mixed summer berries under a crisp oat-and-almond crumble.',
  prepMinutes: 15, cookMinutes: 35, servings: 6,
  ingredients: [[700,'g','mixed berries'],[45,'ml','maple syrup'],[15,'ml','cornstarch'],[250,'ml','rolled oats'],[125,'ml','flour'],[80,'ml','vegan butter'],[60,'ml','almonds','flaked']],
  instructions: [['Fill','Toss berries with maple and cornstarch in a dish.'],['Crumble','Rub oats, flour, butter and almonds to clumps; scatter over.'],['Bake','Bake until bubbling and golden.',{t:35,temp:'190 °C'}]],
  nutrition: nut(300,5,13,44,6,20), tags:['summer','garden'],
  eoeNotes: 'Soft fruit base; leave off almonds for a gentler top.' });

R({ title: 'Chocolate Chia Pudding', subtitle: 'Set it and forget it', category: 'Desserts', cuisine: 'Other', mealType: 'Snack',
  description: 'A rich chocolate chia pudding that sets in the fridge overnight.',
  prepMinutes: 5, cookMinutes: 0, servings: 3,
  ingredients: [[80,'ml','chia seeds'],[500,'ml','oat milk'],[45,'ml','cocoa powder'],[45,'ml','maple syrup'],[5,'ml','vanilla extract']],
  instructions: [['Whisk','Whisk everything well; whisk again after 10 minutes to stop clumps.'],['Set','Chill overnight.',{t:240}]],
  nutrition: nut(220,6,10,28,10,15), tags:['raw','eoe-friendly','blood-sugar-friendly'],
  eoeNotes: 'Soft pudding texture — a gentle dessert.' });

R({ title: 'Maple Poached Pears', subtitle: 'Elegant and easy', category: 'Desserts', cuisine: 'French', mealType: 'Snack',
  description: 'Whole pears poached soft in maple, cinnamon and a little orange.',
  prepMinutes: 10, cookMinutes: 30, servings: 4,
  ingredients: [[4,'','pears','peeled'],[125,'ml','maple syrup'],[500,'ml','water'],[1,'','cinnamon stick'],[1,'','orange','juiced']],
  instructions: [['Poach','Simmer pears in maple, water, cinnamon and orange, turning, until tender.',{t:28}],['Reduce','Reduce the liquid to a syrup; spoon over.',{t:5}]],
  nutrition: nut(200,1,0,52,5,42), tags:['eoe-friendly','autumn','garden'],
  eoeNotes: 'Poached spoon-soft — very easy to eat.' });

R({ title: 'Coconut Rice Pudding', subtitle: 'Creamy and comforting', category: 'Desserts', cuisine: 'Thai', mealType: 'Snack',
  description: 'Short-grain rice simmered slowly in coconut milk with cardamom.',
  prepMinutes: 5, cookMinutes: 35, servings: 4,
  ingredients: [[200,'ml','short-grain rice'],[400,'ml','coconut milk'],[400,'ml','oat milk'],[60,'ml','maple syrup'],[2,'','cardamom pods']],
  instructions: [['Simmer','Cook rice in the milks with cardamom, stirring, until thick and creamy.',{t:32}],['Sweeten','Stir in maple; loosen with milk if needed.']],
  nutrition: nut(300,4,14,42,2,16), tags:['eoe-friendly','gluten-free'],
  eoeNotes: 'Soft and creamy — a soothing dessert.' });

R({ title: 'Cinnamon Apple Crisp', subtitle: 'The autumn classic', category: 'Desserts', cuisine: 'Canadian', mealType: 'Snack',
  description: 'Cinnamon-spiced orchard apples under a buttery oat topping.',
  prepMinutes: 15, cookMinutes: 40, servings: 6,
  ingredients: [[1,'kg','apples','sliced'],[45,'ml','maple syrup'],[10,'ml','cinnamon'],[250,'ml','rolled oats'],[125,'ml','flour'],[100,'ml','vegan butter'],[80,'ml','brown sugar']],
  instructions: [['Fill','Toss apples with maple and cinnamon.'],['Top','Rub oats, flour, butter and sugar to clumps; scatter over.'],['Bake','Bake until the apples are tender and the top is golden.',{t:40,temp:'190 °C'}]],
  nutrition: nut(330,4,13,52,5,28), tags:['autumn','garden','comfort'],
  eoeNotes: 'Soft apple base beneath a crisp top.', favourite:true, rating:5 });

R({ title: 'Lemon Coconut Bliss Balls', subtitle: 'Bright little bites', category: 'Desserts', cuisine: 'Other', mealType: 'Snack',
  description: 'No-bake balls of cashew, coconut and lemon, rolled in more coconut.',
  prepMinutes: 12, cookMinutes: 0, servings: 14, yield: '14 balls',
  ingredients: [[250,'ml','cashews'],[125,'ml','desiccated coconut'],[8,'','dates','pitted'],[1,'','lemon','zest and juice'],[15,'ml','maple syrup']],
  instructions: [['Blitz','Blitz everything to a sticky dough.'],['Roll','Roll into balls; coat in coconut and chill.',{t:30}]],
  nutrition: nut(120,2,8,11,2,8), tags:['raw','blood-sugar-friendly'],
  eoeNotes: 'Chewy; contains cashew — check tolerance.' });

R({ title: 'Wild Blueberry Galette', subtitle: 'Rustic and free-form', category: 'Desserts', cuisine: 'French', mealType: 'Snack',
  description: 'A free-form pastry folded around juicy wild blueberries.',
  prepMinutes: 25, cookMinutes: 35, servings: 8, difficulty:'Medium',
  ingredients: [[375,'ml','flour'],[125,'ml','vegan butter','cold'],[60,'ml','ice water'],[500,'ml','wild blueberries'],[45,'ml','maple syrup'],[15,'ml','cornstarch'],[1,'','lemon','zest']],
  instructions: [['Pastry','Rub butter into flour; add water to a dough; chill.',{t:30}],['Fill','Toss berries with maple, cornstarch and zest; pile on the rolled pastry and fold the edges.'],['Bake','Bake until golden and bubbling.',{t:35,temp:'200 °C'}]],
  nutrition: nut(260,3,11,38,3,14), tags:['summer','garden'] });

R({ title: 'Chocolate Beet Brownies', subtitle: 'Fudgy secret', category: 'Desserts', cuisine: 'Canadian', mealType: 'Snack',
  description: 'Dense, fudgy brownies with roasted beet keeping them moist.',
  prepMinutes: 15, cookMinutes: 30, servings: 12, yield: '12 squares',
  ingredients: [[250,'g','beets','roasted, puréed'],[250,'ml','flour'],[125,'ml','cocoa powder'],[150,'ml','maple syrup'],[80,'ml','olive oil'],[125,'ml','dark chocolate chips'],[5,'ml','baking powder']],
  instructions: [['Mix','Whisk beet purée, maple and oil; fold in cocoa, flour, baking powder and chips.'],['Bake','Bake in a lined tin until just set; cool before cutting.',{t:28,temp:'180 °C'}]],
  nutrition: nut(220,3,9,33,3,18), tags:['garden','freezer-friendly'],
  freezer:'Freezes 3 months.' });

R({ title: 'Mango Coconut Sorbet', subtitle: 'Two ingredients, no churn', category: 'Desserts', cuisine: 'Thai', mealType: 'Snack',
  description: 'Frozen mango blended with coconut milk into an instant, smooth sorbet.',
  prepMinutes: 5, cookMinutes: 0, servings: 4,
  ingredients: [[600,'g','mango','frozen'],[150,'ml','coconut milk'],[15,'ml','lime juice'],[15,'ml','maple syrup',null,{optional:true}]],
  instructions: [['Blend','Blend frozen mango with coconut milk and lime until smooth.',{eq:'Blender'}],['Serve','Eat soft, or freeze 1 hour to scoop.']],
  nutrition: nut(160,2,7,26,3,22), tags:['raw','eoe-friendly','summer','blood-sugar-friendly'],
  eoeNotes: 'Cold and completely smooth.' });
