/* recipes/drinks.js — 20 vegan drinks. Mostly raw (smoothies, juices,
   coolers) and seasonal. Pushes to window.CB.recipes. */

R({ title: 'Wild Blueberry Smoothie', subtitle: 'Purple and bright', category: 'Drinks', cuisine: 'Canadian', mealType: 'Breakfast',
  description: 'Wild blueberries, banana and oat milk blended into a thick, purple glass.',
  prepMinutes: 5, cookMinutes: 0, servings: 2,
  ingredients: [[300,'ml','wild blueberries','frozen'],[1,'','banana'],[375,'ml','oat milk'],[15,'ml','ground flax'],[10,'ml','maple syrup',null,{optional:true}]],
  instructions: [['Blend','Blend everything until smooth and thick.',{eq:'Blender'}]],
  nutrition: nut(190,4,4,36,7,20), tags:['raw','eoe-friendly','summer','garden'],
  eoeNotes: 'Smooth and cold — easy to sip.', favourite:true, rating:5 });

R({ title: 'Golden Milk', subtitle: 'A warm hug at night', category: 'Drinks', cuisine: 'Indian', mealType: 'Snack',
  description: 'Warm coconut-oat milk with turmeric, ginger and black pepper.',
  prepMinutes: 3, cookMinutes: 6, servings: 2,
  ingredients: [[500,'ml','oat milk'],[5,'ml','ground turmeric'],[5,'g','fresh ginger','grated'],[1,'','pinch black pepper'],[10,'ml','maple syrup'],[15,'ml','coconut milk']],
  instructions: [['Warm','Whisk everything in a pan and warm gently — do not boil.',{t:5}],['Strain','Strain into mugs.']],
  nutrition: nut(120,2,5,16,1,10), tags:['eoe-friendly','anti-inflammatory'],
  eoeNotes: 'Smooth and warming.', antiInflammatoryNotes: 'Turmeric, ginger and pepper — the classic trio.' });

R({ title: 'Green Detox Juice', subtitle: 'Bright and grassy', category: 'Drinks', cuisine: 'Canadian', mealType: 'Breakfast',
  description: 'A fresh-pressed juice of cucumber, celery, apple and ginger.',
  prepMinutes: 10, cookMinutes: 0, servings: 2,
  ingredients: [[1,'','cucumber'],[3,'','celery'],[2,'','green apple'],[20,'g','fresh ginger'],[1,'','lemon']],
  instructions: [['Juice','Run everything through a juicer.',{eq:'Juicer'}],['Serve','Stir and pour over ice.']],
  nutrition: nut(110,2,0,28,3,20), tags:['raw','anti-inflammatory','garden'],
  antiInflammatoryNotes: 'Ginger and a load of raw vegetables.' });

R({ title: 'Iced Matcha Latte', subtitle: 'Cool green lift', category: 'Drinks', cuisine: 'Japanese', mealType: 'Snack',
  description: 'Whisked matcha over ice with oat milk and a little maple.',
  prepMinutes: 5, cookMinutes: 0, servings: 1,
  ingredients: [[5,'ml','matcha powder'],[60,'ml','hot water'],[250,'ml','oat milk'],[10,'ml','maple syrup']],
  instructions: [['Whisk','Whisk matcha with hot water until frothy.'],['Pour','Pour over iced oat milk; sweeten.']],
  nutrition: nut(120,2,4,18,1,11), tags:['eoe-friendly','anti-inflammatory'],
  eoeNotes: 'Smooth; a gentle caffeine lift.' });

R({ title: 'Strawberry Rhubarb Cooler', subtitle: 'Pink porch drink', category: 'Drinks', cuisine: 'Canadian', mealType: 'Snack',
  description: 'A tart-sweet rhubarb-strawberry syrup topped with sparkling water.',
  prepMinutes: 5, cookMinutes: 12, servings: 4,
  ingredients: [[250,'g','rhubarb','sliced'],[250,'g','strawberries'],[60,'ml','maple syrup'],[500,'ml','sparkling water'],[8,'','mint leaves']],
  instructions: [['Syrup','Simmer rhubarb and strawberries with maple; strain and cool.',{t:10}],['Mix','Pour over ice; top with sparkling water and mint.']],
  nutrition: nut(80,1,0,20,2,16), tags:['spring','garden'] });

R({ title: 'Ginger Turmeric Shot', subtitle: 'A fiery little glass', category: 'Drinks', cuisine: 'Other', mealType: 'Snack',
  description: 'A concentrated raw shot of ginger, turmeric, lemon and cayenne.',
  prepMinutes: 8, cookMinutes: 0, servings: 6,
  ingredients: [[80,'g','fresh ginger'],[40,'g','fresh turmeric'],[2,'','lemon','juiced'],[1,'','pinch cayenne'],[1,'','pinch black pepper']],
  instructions: [['Blend','Blend ginger and turmeric with a little water; strain hard.',{eq:'Blender'}],['Mix','Stir in lemon, cayenne and pepper; keep chilled.']],
  nutrition: nut(25,0,0,6,1,2), tags:['raw','anti-inflammatory'],
  antiInflammatoryNotes: 'A concentrated dose of ginger and turmeric.' });

R({ title: 'Watermelon Mint Cooler', subtitle: 'Straight from the melon', category: 'Drinks', cuisine: 'Mediterranean', mealType: 'Snack',
  description: 'Blended watermelon with lime and mint over ice — nothing added.',
  prepMinutes: 8, cookMinutes: 0, servings: 4,
  ingredients: [[1,'kg','watermelon','cubed'],[1,'','lime','juiced'],[10,'','mint leaves'],[250,'ml','sparkling water',null,{optional:true}]],
  instructions: [['Blend','Blend watermelon with lime and mint; strain if you like.',{eq:'Blender'}],['Serve','Pour over ice; top with sparkling water.']],
  nutrition: nut(70,1,0,17,1,14), tags:['raw','summer'],
  eoeNotes: 'Smooth and cooling.' });

R({ title: 'Hot Spiced Apple Cider', subtitle: 'Mulled and cosy', category: 'Drinks', cuisine: 'Canadian', mealType: 'Snack',
  description: 'Apple cider warmed with cinnamon, clove and orange.',
  prepMinutes: 5, cookMinutes: 20, servings: 6,
  ingredients: [[1.5,'l','apple cider'],[2,'','cinnamon stick'],[4,'','clove'],[1,'','orange','sliced'],[15,'g','fresh ginger']],
  instructions: [['Simmer','Warm everything gently to infuse — do not boil.',{t:20}],['Serve','Ladle into mugs, leaving the spices behind.']],
  nutrition: nut(120,0,0,30,0,26), tags:['eoe-friendly','autumn','garden'],
  eoeNotes: 'Smooth and warming.' });

R({ title: 'Chocolate Peanut Butter Shake', subtitle: 'Dessert in a glass', category: 'Drinks', cuisine: 'Canadian', mealType: 'Snack',
  description: 'A thick shake of frozen banana, cocoa and peanut butter.',
  prepMinutes: 5, cookMinutes: 0, servings: 2,
  ingredients: [[2,'','bananas','frozen'],[30,'ml','cocoa powder'],[45,'ml','peanut butter'],[375,'ml','oat milk'],[5,'ml','maple syrup']],
  instructions: [['Blend','Blend everything thick and creamy.',{eq:'Blender'}]],
  nutrition: nut(280,8,12,38,6,20), tags:['raw','eoe-friendly','high-protein'],
  eoeNotes: 'Smooth; contains peanut — check tolerance.' });

R({ title: 'Cucumber Lime Agua Fresca', subtitle: 'Barely sweet, very cold', category: 'Drinks', cuisine: 'Mexican', mealType: 'Snack',
  description: 'Blended cucumber and lime strained into a crisp, pale-green refresher.',
  prepMinutes: 8, cookMinutes: 0, servings: 4,
  ingredients: [[2,'','cucumber'],[2,'','lime','juiced'],[1,'l','water'],[30,'ml','maple syrup'],[8,'','mint leaves']],
  instructions: [['Blend','Blend cucumber with water; strain.',{eq:'Blender'}],['Mix','Stir in lime, maple and mint; serve over ice.']],
  nutrition: nut(45,1,0,11,1,9), tags:['raw','summer','garden'] });

R({ title: 'Spiced Chai Latte', subtitle: 'Steeped and frothy', category: 'Drinks', cuisine: 'Indian', mealType: 'Snack',
  description: 'Black tea simmered with warm spices and frothy oat milk.',
  prepMinutes: 5, cookMinutes: 12, servings: 2,
  ingredients: [[2,'','black tea bags'],[500,'ml','oat milk'],[250,'ml','water'],[4,'','cardamom pods'],[1,'','cinnamon stick'],[15,'g','fresh ginger'],[15,'ml','maple syrup']],
  instructions: [['Simmer','Simmer water with the spices and ginger; add tea and steep.',{t:8}],['Froth','Add oat milk, warm, and sweeten; strain into mugs.',{t:3}]],
  nutrition: nut(110,2,4,16,1,10), tags:['eoe-friendly','anti-inflammatory'],
  eoeNotes: 'Smooth and warming.' });

R({ title: 'Mango Lassi', subtitle: 'Cool and creamy', category: 'Drinks', cuisine: 'Indian', mealType: 'Snack',
  description: 'A dairy-free lassi of mango and coconut yogurt with cardamom.',
  prepMinutes: 5, cookMinutes: 0, servings: 2,
  ingredients: [[1,'','mango','ripe'],[250,'ml','coconut yogurt'],[125,'ml','oat milk'],[2,'','cardamom pods','ground'],[10,'ml','maple syrup']],
  instructions: [['Blend','Blend everything until smooth and frothy.',{eq:'Blender'}]],
  nutrition: nut(200,3,8,30,3,24), tags:['raw','eoe-friendly'],
  eoeNotes: 'Smooth and cooling — a gentle sip.' });

R({ title: 'Beet & Berry Smoothie', subtitle: 'Deep red glow', category: 'Drinks', cuisine: 'Canadian', mealType: 'Breakfast',
  description: 'Raw beet, mixed berries and banana blended earthy-sweet.',
  prepMinutes: 6, cookMinutes: 0, servings: 2,
  ingredients: [[0.5,'','beet','raw, grated'],[300,'ml','mixed berries','frozen'],[1,'','banana'],[375,'ml','oat milk'],[15,'ml','chia seeds']],
  instructions: [['Blend','Blend everything until completely smooth.',{eq:'Blender'}]],
  nutrition: nut(210,5,5,40,9,22), tags:['raw','eoe-friendly','anti-inflammatory','garden'],
  eoeNotes: 'Blend fully smooth for the gentlest sip.' });

R({ title: 'Lemon Ginger Tea', subtitle: 'Soothe and settle', category: 'Drinks', cuisine: 'Other', mealType: 'Snack',
  description: 'Fresh ginger steeped with lemon and a little maple — caffeine-free.',
  prepMinutes: 3, cookMinutes: 10, servings: 2,
  ingredients: [[25,'g','fresh ginger','sliced'],[500,'ml','water'],[1,'','lemon','juiced'],[15,'ml','maple syrup']],
  instructions: [['Steep','Simmer ginger in the water; steep 10 minutes.',{t:10}],['Finish','Stir in lemon and maple; strain into mugs.']],
  nutrition: nut(40,0,0,10,0,8), tags:['eoe-friendly','anti-inflammatory'],
  eoeNotes: 'Warm and soothing on the throat.' });

R({ title: 'Maple Cold Brew', subtitle: 'Smooth over ice', category: 'Drinks', cuisine: 'Canadian', mealType: 'Snack',
  description: 'Slow-steeped cold brew coffee with oat milk and maple.',
  prepMinutes: 5, cookMinutes: 0, servings: 2,
  ingredients: [[80,'ml','coarse coffee'],[750,'ml','cold water'],[125,'ml','oat milk'],[15,'ml','maple syrup']],
  instructions: [['Steep','Steep coffee in cold water 12 hours; strain.',{t:720}],['Serve','Pour over ice; add oat milk and maple.']],
  nutrition: nut(60,1,1,11,0,9), tags:['eoe-friendly','quick'] });

R({ title: 'Peach Iced Tea', subtitle: 'Porch-swing sipping', category: 'Drinks', cuisine: 'Canadian', mealType: 'Snack',
  description: 'Black tea sweetened with a fresh peach syrup and plenty of ice.',
  prepMinutes: 8, cookMinutes: 10, servings: 4,
  ingredients: [[3,'','black tea bags'],[1,'l','water','hot'],[2,'','peaches','sliced'],[45,'ml','maple syrup'],[1,'','lemon']],
  instructions: [['Brew','Steep the tea; cool.'],['Syrup','Simmer peaches with maple; mash and strain.',{t:8}],['Mix','Combine over ice with lemon.']],
  nutrition: nut(70,1,0,17,1,15), tags:['summer','garden'] });

R({ title: 'Coconut Mango Smoothie', subtitle: 'Tropical and thick', category: 'Drinks', cuisine: 'Thai', mealType: 'Breakfast',
  description: 'Frozen mango and coconut milk blended into a creamy tropical smoothie.',
  prepMinutes: 5, cookMinutes: 0, servings: 2,
  ingredients: [[400,'g','mango','frozen'],[250,'ml','coconut milk'],[125,'ml','oat milk'],[1,'','lime','juiced']],
  instructions: [['Blend','Blend everything until thick and smooth.',{eq:'Blender'}]],
  nutrition: nut(240,3,14,28,3,22), tags:['raw','eoe-friendly','summer'],
  eoeNotes: 'Smooth and cooling.' });

R({ title: 'Cranberry Orange Spritzer', subtitle: 'A festive fizz', category: 'Drinks', cuisine: 'Canadian', mealType: 'Snack',
  description: 'Tart cranberry and orange topped with sparkling water — no alcohol.',
  prepMinutes: 5, cookMinutes: 10, servings: 4,
  ingredients: [[250,'ml','cranberries'],[60,'ml','maple syrup'],[2,'','oranges','juiced'],[500,'ml','sparkling water'],[1,'','rosemary sprig',null,{optional:true}]],
  instructions: [['Syrup','Simmer cranberries with maple until they pop; strain.',{t:8}],['Mix','Combine with orange juice over ice; top with sparkling water.']],
  nutrition: nut(90,0,0,22,2,17), tags:['winter','garden'] });

R({ title: 'Pumpkin Spice Latte', subtitle: 'The autumn ritual', category: 'Drinks', cuisine: 'Canadian', mealType: 'Snack',
  description: 'Real pumpkin whisked into a spiced, frothy oat-milk latte.',
  prepMinutes: 5, cookMinutes: 8, servings: 2,
  ingredients: [[500,'ml','oat milk'],[45,'ml','pumpkin purée'],[10,'ml','pumpkin spice'],[20,'ml','maple syrup'],[60,'ml','strong coffee']],
  instructions: [['Warm','Whisk oat milk, pumpkin, spice and maple over low heat until steaming.',{t:6}],['Pour','Add coffee; froth and pour.']],
  nutrition: nut(140,3,4,22,2,14), tags:['eoe-friendly','autumn'],
  eoeNotes: 'Smooth and warming.' });

R({ title: 'Green Protein Smoothie', subtitle: 'Post-garden fuel', category: 'Drinks', cuisine: 'Canadian', mealType: 'Breakfast',
  description: 'Spinach, banana, hemp and almond butter blended into a filling green glass.',
  prepMinutes: 5, cookMinutes: 0, servings: 2,
  ingredients: [[60,'g','spinach'],[1,'','banana','frozen'],[30,'ml','hemp seeds'],[30,'ml','almond butter'],[375,'ml','oat milk'],[15,'ml','maple syrup',null,{optional:true}]],
  instructions: [['Blend','Blend everything until completely smooth.',{eq:'Blender'}]],
  nutrition: nut(300,12,16,30,6,15), tags:['raw','eoe-friendly','high-protein','garden'],
  eoeNotes: 'Blend fully smooth; contains almond — check tolerance.' });
