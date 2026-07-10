/* recipes/sauces-preserves.js — 16 vegan sauces & dressings + 12 vegan
   preserves. Pushes to window.CB.recipes. */

/* ---- Sauces & dressings (16) ---- */
R({ title: 'Everyday Cashew Cream', subtitle: 'The dairy-free workhorse', category: 'Sauces & dressings', cuisine: 'Canadian', mealType: 'Snack',
  description: 'Soaked cashews blended silky — pourable or thick, sweet or savoury.',
  prepMinutes: 10, cookMinutes: 0, servings: 8, yield: 'About 400 ml',
  ingredients: [[250,'ml','cashews','soaked'],[125,'ml','water'],[15,'ml','lemon juice'],[2.5,'ml','salt']],
  instructions: [['Blend','Blend everything until completely smooth, adding water for a pourable cream.',{eq:'Blender'}]],
  nutrition: nut(120,4,10,6,1,1), tags:['raw','eoe-friendly'],
  eoeNotes: 'Silky smooth; contains cashew — check nut tolerance.', storage:'Fridge 5 days.' });

R({ title: 'Garden Basil Pesto', subtitle: 'Summer, jarred', category: 'Sauces & dressings', cuisine: 'Italian', mealType: 'Snack',
  description: 'A bright, dairy-free basil pesto with pine nuts and nutritional yeast.',
  prepMinutes: 10, cookMinutes: 0, servings: 8, yield: 'About 300 ml',
  ingredients: [[2,'','bunch basil'],[60,'ml','pine nuts'],[2,'clove','garlic'],[30,'ml','nutritional yeast'],[125,'ml','olive oil'],[15,'ml','lemon juice']],
  instructions: [['Blitz','Pulse basil, pine nuts, garlic and yeast.'],['Stream','With the motor running, add oil and lemon to a loose paste.']],
  nutrition: nut(170,3,17,3,1,1), tags:['raw','garden','summer','anti-inflammatory'],
  antiInflammatoryNotes: 'Herbs, olive oil and garlic.', freezer:'Freeze in cubes 6 months.', favourite:true, rating:5 });

R({ title: 'Romesco Sauce', subtitle: 'Smoky Catalan red', category: 'Sauces & dressings', cuisine: 'Mediterranean', mealType: 'Snack',
  description: 'Roasted red peppers and almonds blended into a rich, smoky sauce.',
  prepMinutes: 10, cookMinutes: 20, servings: 8,
  ingredients: [[3,'','red pepper','roasted'],[80,'ml','almonds','toasted'],[1,'','tomato','roasted'],[1,'clove','garlic'],[10,'ml','smoked paprika'],[15,'ml','sherry vinegar'],[80,'ml','olive oil']],
  instructions: [['Roast','Roast peppers and tomato until soft and charred.',{t:20,temp:'220 °C'}],['Blend','Blend with almonds, garlic, paprika, vinegar and oil until thick.',{eq:'Blender'}]],
  nutrition: nut(150,3,14,6,2,3), tags:['eoe-friendly','anti-inflammatory'],
  eoeNotes: 'Smooth once blended; contains almond — check tolerance.' });

R({ title: 'Chimichurri', subtitle: 'Herby, garlicky, raw', category: 'Sauces & dressings', cuisine: 'Other', mealType: 'Snack',
  description: 'A punchy raw sauce of parsley, oregano, garlic and red wine vinegar.',
  prepMinutes: 10, cookMinutes: 0, servings: 8,
  ingredients: [[1,'','bunch parsley','finely chopped'],[15,'ml','dried oregano'],[3,'clove','garlic'],[1,'ml','chilli flakes'],[60,'ml','red wine vinegar'],[125,'ml','olive oil']],
  instructions: [['Chop','Chop the parsley and garlic very fine.'],['Mix','Stir with oregano, chilli, vinegar and oil; rest 20 minutes.',{t:20}]],
  nutrition: nut(140,1,15,2,1,1), tags:['raw','garden','anti-inflammatory'],
  antiInflammatoryNotes: 'Fresh herbs, garlic and olive oil.' });

R({ title: 'Lemon Tahini Dressing', subtitle: 'Pour it on everything', category: 'Sauces & dressings', cuisine: 'Middle Eastern', mealType: 'Snack',
  description: 'A creamy, tangy tahini dressing that loosens to any thickness.',
  prepMinutes: 5, cookMinutes: 0, servings: 8,
  ingredients: [[125,'ml','tahini'],[45,'ml','lemon juice'],[1,'clove','garlic'],[125,'ml','water'],[2.5,'ml','salt']],
  instructions: [['Whisk','Whisk tahini with lemon and garlic; it will seize, then loosen with water to a pourable cream.']],
  nutrition: nut(120,4,10,5,1,1), tags:['raw','eoe-friendly','anti-inflammatory'],
  eoeNotes: 'Smooth; contains sesame — check tolerance.' });

R({ title: 'Cashew Alfredo', subtitle: 'Cloak your pasta', category: 'Sauces & dressings', cuisine: 'Italian', mealType: 'Snack',
  description: 'A silky, garlicky cashew sauce that clings like the real thing.',
  prepMinutes: 10, cookMinutes: 5, servings: 6,
  ingredients: [[250,'ml','cashews','soaked'],[3,'clove','garlic'],[45,'ml','nutritional yeast'],[15,'ml','lemon juice'],[375,'ml','oat milk'],[2.5,'ml','nutmeg']],
  instructions: [['Blend','Blend cashews, garlic, yeast, lemon and oat milk until silky.',{eq:'Blender'}],['Warm','Heat gently to thicken; season with nutmeg.',{t:4}]],
  nutrition: nut(180,6,13,10,1,2), tags:['eoe-friendly'],
  eoeNotes: 'Very smooth; contains cashew — check tolerance.' });

R({ title: 'Peanut Satay Sauce', subtitle: 'Sweet, salty, nutty', category: 'Sauces & dressings', cuisine: 'Thai', mealType: 'Snack',
  description: 'A warm peanut sauce with coconut, lime and a little chilli.',
  prepMinutes: 8, cookMinutes: 5, servings: 8,
  ingredients: [[125,'ml','peanut butter'],[125,'ml','coconut milk'],[30,'ml','soy sauce'],[15,'ml','maple syrup'],[15,'ml','lime juice'],[1,'','chilli']],
  instructions: [['Warm','Whisk everything in a small pan over low heat until glossy.',{t:4}]],
  nutrition: nut(160,6,12,8,1,4), tags:['eoe-friendly'],
  eoeNotes: 'Smooth; contains peanut and soy — common triggers.' });

R({ title: 'Salsa Verde', subtitle: 'A spoonful of green', category: 'Sauces & dressings', cuisine: 'Italian', mealType: 'Snack',
  description: 'A raw, briny herb sauce with capers, mustard and lots of parsley.',
  prepMinutes: 10, cookMinutes: 0, servings: 8,
  ingredients: [[1,'','bunch parsley'],[30,'ml','capers'],[15,'ml','Dijon mustard'],[1,'clove','garlic'],[125,'ml','olive oil'],[15,'ml','red wine vinegar']],
  instructions: [['Chop','Finely chop parsley, capers and garlic.'],['Mix','Stir in mustard, oil and vinegar.']],
  nutrition: nut(130,1,14,2,1,1), tags:['raw','garden','anti-inflammatory'] });

R({ title: 'Roasted Red Pepper Sauce', subtitle: 'Silky and sweet', category: 'Sauces & dressings', cuisine: 'Mediterranean', mealType: 'Snack',
  description: 'Roasted peppers blended smooth with garlic and olive oil for pasta or grains.',
  prepMinutes: 8, cookMinutes: 20, servings: 6,
  ingredients: [[4,'','red pepper','roasted'],[2,'clove','garlic'],[45,'ml','olive oil'],[15,'ml','lemon juice'],[2.5,'ml','salt']],
  instructions: [['Roast','Roast peppers until soft and blackened; peel.',{t:20,temp:'230 °C'}],['Blend','Blend with garlic, oil, lemon and salt.',{eq:'Blender'}]],
  nutrition: nut(110,1,9,7,2,4), tags:['eoe-friendly','anti-inflammatory'],
  eoeNotes: 'Smooth — a gentle, versatile sauce.' });

R({ title: 'Maple Mustard Vinaigrette', subtitle: 'Shake and pour', category: 'Sauces & dressings', cuisine: 'Canadian', mealType: 'Snack',
  description: 'A simple emulsion of Dijon, maple and cider vinegar.',
  prepMinutes: 3, cookMinutes: 0, servings: 8,
  ingredients: [[30,'ml','Dijon mustard'],[30,'ml','maple syrup'],[45,'ml','apple cider vinegar'],[125,'ml','olive oil']],
  instructions: [['Shake','Shake everything in a jar until emulsified.']],
  nutrition: nut(120,0,12,4,0,3), tags:['raw','quick'] });

R({ title: 'Coconut Curry Sauce', subtitle: 'Simmer-anything base', category: 'Sauces & dressings', cuisine: 'Thai', mealType: 'Snack',
  description: 'A quick coconut-tomato curry base to pour over vegetables or tofu.',
  prepMinutes: 8, cookMinutes: 15, servings: 6,
  ingredients: [[400,'ml','coconut milk'],[200,'g','crushed tomatoes'],[30,'ml','curry powder'],[1,'','onion'],[15,'g','fresh ginger'],[30,'ml','coconut oil']],
  instructions: [['Fry','Soften onion and ginger in the oil; add curry powder.',{t:6}],['Simmer','Add tomatoes and coconut milk; simmer smooth.',{t:8}]],
  nutrition: nut(160,2,14,8,2,4), tags:['eoe-friendly','anti-inflammatory'],
  eoeNotes: 'Smooth and mild; adjust heat to taste.' });

R({ title: 'Green Goddess Dressing', subtitle: 'Herb-packed and creamy', category: 'Sauces & dressings', cuisine: 'Canadian', mealType: 'Snack',
  description: 'A creamy avocado-herb dressing brimming with parsley, chives and tarragon.',
  prepMinutes: 8, cookMinutes: 0, servings: 8,
  ingredients: [[1,'','avocado'],[15,'ml','fresh chives'],[15,'ml','fresh parsley'],[10,'ml','fresh tarragon'],[30,'ml','lemon juice'],[125,'ml','water'],[30,'ml','olive oil']],
  instructions: [['Blend','Blend everything smooth, loosening with water.',{eq:'Blender'}]],
  nutrition: nut(90,1,8,4,2,1), tags:['raw','eoe-friendly','garden'],
  eoeNotes: 'Smooth and mild — a gentle green sauce.' });

R({ title: 'Mushroom Gravy', subtitle: 'For mash and rolls', category: 'Sauces & dressings', cuisine: 'Canadian', mealType: 'Snack',
  description: 'A savoury onion-mushroom gravy thickened with flour, no drippings needed.',
  prepMinutes: 8, cookMinutes: 20, servings: 8,
  ingredients: [[250,'g','mushrooms','minced'],[1,'','onion'],[30,'ml','flour'],[600,'ml','vegetable stock'],[30,'ml','soy sauce'],[30,'ml','olive oil'],[5,'ml','fresh thyme']],
  instructions: [['Brown','Cook mushrooms and onion in the oil until deep gold.',{t:10}],['Thicken','Stir in flour, then stock and soy; simmer smooth.',{t:8}]],
  nutrition: nut(80,2,4,8,1,2), tags:['eoe-friendly','comfort'],
  eoeNotes: 'Blend for a silky gravy.' });

R({ title: 'Chipotle Cashew Crema', subtitle: 'Smoky and cooling', category: 'Sauces & dressings', cuisine: 'Mexican', mealType: 'Snack',
  description: 'A smoky, tangy cashew crema for tacos and bowls.',
  prepMinutes: 8, cookMinutes: 0, servings: 8,
  ingredients: [[250,'ml','cashews','soaked'],[1,'','chipotle in adobo'],[30,'ml','lime juice'],[125,'ml','water'],[2.5,'ml','salt']],
  instructions: [['Blend','Blend everything silky, loosening with water.',{eq:'Blender'}]],
  nutrition: nut(120,4,9,7,1,1), tags:['raw','eoe-friendly'],
  eoeNotes: 'Smooth; contains cashew — check tolerance.' });

R({ title: 'Miso Ginger Dressing', subtitle: 'Umami in a jar', category: 'Sauces & dressings', cuisine: 'Japanese', mealType: 'Snack',
  description: 'A bright miso-ginger dressing for salads, grains and roasted vegetables.',
  prepMinutes: 5, cookMinutes: 0, servings: 8,
  ingredients: [[45,'ml','white miso'],[20,'g','fresh ginger'],[30,'ml','rice vinegar'],[15,'ml','maple syrup'],[60,'ml','toasted sesame oil'],[60,'ml','water']],
  instructions: [['Blend','Blend everything until smooth.',{eq:'Blender'}]],
  nutrition: nut(90,1,8,4,0,3), tags:['raw','eoe-friendly'],
  eoeNotes: 'Smooth; contains soy and sesame — check tolerance.' });

R({ title: 'Everyday Marinara', subtitle: 'Make a big pot', category: 'Sauces & dressings', cuisine: 'Italian', mealType: 'Snack',
  description: 'A slow, garlicky tomato sauce that freezes beautifully.',
  prepMinutes: 8, cookMinutes: 40, servings: 8,
  ingredients: [[1.6,'l','crushed tomatoes','two large cans'],[6,'clove','garlic'],[1,'','onion'],[60,'ml','olive oil'],[10,'ml','dried oregano'],[8,'','basil leaves']],
  instructions: [['Soften','Cook onion and garlic gently in the oil.',{t:8}],['Simmer','Add tomatoes and oregano; simmer low and slow. Finish with basil.',{t:30}]],
  nutrition: nut(120,3,8,12,3,7), tags:['eoe-friendly','garden','freezer-friendly','batch-cooking'],
  eoeNotes: 'Smooth and soft; blend if you like.', freezer:'Freezes 6 months.' });

/* ---- Preserves (12) ---- */
R({ title: 'Wild Blueberry Chia Jam', subtitle: 'No pectin, no fuss', category: 'Preserves', cuisine: 'Canadian', mealType: 'Snack',
  description: 'A quick fridge jam of wild blueberries set with chia — barely sweetened.',
  prepMinutes: 5, cookMinutes: 12, servings: 16, yield: 'About 2 cups',
  ingredients: [[500,'ml','wild blueberries'],[30,'ml','maple syrup'],[30,'ml','chia seeds'],[15,'ml','lemon juice']],
  instructions: [['Cook','Simmer berries with maple until they burst.',{t:8}],['Set','Stir in chia and lemon; cool to thicken.']],
  nutrition: nut(35,1,1,7,2,5), tags:['eoe-friendly','summer','garden','blood-sugar-friendly'],
  eoeNotes: 'Soft and smooth.', bloodSugarNotes: 'Chia and lemon keep the sugar gentle.', storage:'Fridge 2 weeks.' });

R({ title: 'Refrigerator Dill Pickles', subtitle: 'Crunch in a day', category: 'Preserves', cuisine: 'Canadian', mealType: 'Snack',
  description: 'Garden cucumbers in a garlic-dill brine — no canning required.',
  prepMinutes: 15, cookMinutes: 5, servings: 12, yield: '2 jars',
  ingredients: [[6,'','cucumbers','spears'],[250,'ml','water'],[250,'ml','white vinegar'],[15,'ml','salt'],[4,'clove','garlic'],[4,'','dill sprig'],[10,'ml','mustard seeds']],
  instructions: [['Pack','Pack cucumbers with garlic, dill and mustard seeds into jars.'],['Brine','Warm water, vinegar and salt to dissolve; pour over and cool.',{t:5}],['Wait','Chill at least 24 hours before eating.',{t:1440}]],
  nutrition: nut(15,1,0,3,1,1), tags:['raw','summer','garden','fermentation'],
  storage:'Fridge 1 month.' });

R({ title: 'Roasted Tomato Passata', subtitle: 'The taste of August, saved', category: 'Preserves', cuisine: 'Italian', mealType: 'Snack',
  description: 'Roasted garden tomatoes blended and reduced into a rich passata for the freezer.',
  prepMinutes: 15, cookMinutes: 60, servings: 20, yield: 'About 1.5 litres',
  ingredients: [[3,'kg','tomatoes','halved'],[1,'','onion'],[6,'clove','garlic'],[60,'ml','olive oil'],[8,'','basil leaves']],
  instructions: [['Roast','Roast tomatoes, onion and garlic in the oil until collapsed.',{t:45,temp:'200 °C'}],['Blend','Blend, then reduce on the stove to your thickness; stir in basil.',{t:15}]],
  nutrition: nut(60,2,4,7,2,4), tags:['eoe-friendly','summer','garden','freezer-friendly','batch-cooking'],
  eoeNotes: 'Smooth; a versatile base.', freezer:'Freezes 12 months.', favourite:true, rating:5 });

R({ title: 'Quick Pickled Red Onions', subtitle: 'Pink and tangy', category: 'Preserves', cuisine: 'Mexican', mealType: 'Snack',
  description: 'Thinly sliced red onion softened in a sweet-tart brine.',
  prepMinutes: 10, cookMinutes: 0, servings: 16, yield: '1 jar',
  ingredients: [[2,'','red onion','thinly sliced'],[250,'ml','apple cider vinegar'],[125,'ml','water'],[15,'ml','maple syrup'],[10,'ml','salt']],
  instructions: [['Pack','Pack onions into a jar.'],['Brine','Whisk vinegar, water, maple and salt; pour over.'],['Wait','Ready in 30 minutes; better the next day.',{t:30}]],
  nutrition: nut(20,0,0,5,0,4), tags:['raw','quick','garden'], storage:'Fridge 3 weeks.' });

R({ title: 'Strawberry Rhubarb Jam', subtitle: 'Spring in a jar', category: 'Preserves', cuisine: 'Canadian', mealType: 'Snack',
  description: 'A small-batch jam balancing sweet strawberries and tart rhubarb.',
  prepMinutes: 10, cookMinutes: 30, servings: 24, yield: 'About 3 cups',
  ingredients: [[500,'g','strawberries','halved'],[400,'g','rhubarb','sliced'],[250,'ml','sugar'],[30,'ml','lemon juice']],
  instructions: [['Macerate','Toss fruit with sugar; rest 30 minutes.',{t:30}],['Cook','Simmer with lemon until thick and glossy.',{t:25}],['Jar','Ladle into sterile jars.']],
  nutrition: nut(45,0,0,11,1,10), tags:['spring','garden','batch-cooking'],
  storage:'Sealed 6 months; fridge 3 weeks once open.' });

R({ title: 'Fermented Sauerkraut', subtitle: 'Living, tangy cabbage', category: 'Preserves', cuisine: 'Other', mealType: 'Snack',
  description: 'Just cabbage and salt, fermented into a crunchy, gut-friendly kraut.',
  prepMinutes: 25, cookMinutes: 0, servings: 20, yield: '1 large jar',
  ingredients: [[1,'','cabbage','shredded'],[20,'g','salt'],[10,'ml','caraway seeds',null,{optional:true}]],
  instructions: [['Salt','Massage cabbage with salt until it releases plenty of brine.',{t:10}],['Pack','Pack tightly under the brine with caraway; weigh down.'],['Ferment','Leave at room temperature 1–3 weeks, tasting, then refrigerate.',{t:1440}]],
  nutrition: nut(20,1,0,4,2,2), tags:['raw','fermentation','anti-inflammatory','winter'],
  antiInflammatoryNotes: 'Live-fermented and gut-friendly.', storage:'Fridge 6 months.' });

R({ title: 'Slow Apple Butter', subtitle: 'Autumn, reduced', category: 'Preserves', cuisine: 'Canadian', mealType: 'Snack',
  description: 'Orchard apples cooked down slowly with cinnamon to a dark, spreadable butter.',
  prepMinutes: 15, cookMinutes: 120, servings: 24, yield: 'About 3 cups',
  ingredients: [[2,'kg','apples','chopped'],[125,'ml','apple cider'],[80,'ml','maple syrup'],[10,'ml','cinnamon'],[2,'ml','clove']],
  instructions: [['Soften','Simmer apples with cider until collapsed.',{t:30}],['Blend','Blend smooth, then cook low, stirring, until thick and dark.',{t:90}]],
  nutrition: nut(50,0,0,13,1,11), tags:['eoe-friendly','autumn','garden'],
  eoeNotes: 'Completely smooth.', storage:'Fridge 3 weeks; freezes well.' });

R({ title: 'Preserved Lemons', subtitle: 'A jar that gets better', category: 'Preserves', cuisine: 'Middle Eastern', mealType: 'Snack',
  description: 'Lemons packed in salt until soft and intense — a little goes a long way.',
  prepMinutes: 20, cookMinutes: 0, servings: 20, yield: '1 jar',
  ingredients: [[8,'','lemons'],[125,'ml','salt'],[3,'','bay leaf'],[10,'ml','coriander seeds']],
  instructions: [['Cut','Quarter lemons almost through; pack with salt.'],['Jar','Press into a jar with bay and coriander; top with lemon juice.'],['Wait','Turn daily; ready in 3–4 weeks.',{t:1440}]],
  nutrition: nut(10,0,0,3,1,1), tags:['fermentation'], storage:'Cool, dark cupboard 6 months.' });

R({ title: 'Zucchini Relish', subtitle: 'The glut, tamed', category: 'Preserves', cuisine: 'Canadian', mealType: 'Snack',
  description: 'A sweet-tangy relish that turns a summer zucchini mountain into jars.',
  prepMinutes: 30, cookMinutes: 40, servings: 32, yield: 'About 4 cups',
  ingredients: [[4,'','zucchini','finely diced'],[1,'','onion'],[1,'','red pepper'],[30,'ml','salt'],[300,'ml','apple cider vinegar'],[200,'ml','sugar'],[10,'ml','mustard seeds'],[5,'ml','turmeric']],
  instructions: [['Salt','Salt the diced vegetables; rest an hour and drain.',{t:60}],['Cook','Simmer with vinegar, sugar and spices until thick.',{t:35}],['Jar','Ladle into sterile jars.']],
  nutrition: nut(30,0,0,7,1,6), tags:['summer','garden','batch-cooking'],
  storage:'Sealed 6 months.' });

R({ title: 'Spiced Pumpkin Butter', subtitle: 'Spread the season', category: 'Preserves', cuisine: 'Canadian', mealType: 'Snack',
  description: 'Pumpkin purée cooked down with maple and warm spice.',
  prepMinutes: 5, cookMinutes: 30, servings: 20, yield: 'About 2.5 cups',
  ingredients: [[750,'ml','pumpkin purée'],[125,'ml','maple syrup'],[125,'ml','apple cider'],[10,'ml','pumpkin spice'],[15,'ml','lemon juice']],
  instructions: [['Cook','Simmer everything low, stirring, until thick and glossy.',{t:28}]],
  nutrition: nut(45,1,0,11,1,9), tags:['eoe-friendly','autumn'],
  eoeNotes: 'Smooth and soft.', storage:'Fridge 3 weeks; freezes well.' });

R({ title: 'Napa Cabbage Kimchi', subtitle: 'Fire and funk', category: 'Preserves', cuisine: 'Other', mealType: 'Snack',
  description: 'A vegan kimchi with plenty of gochugaru, ginger and garlic — no fish sauce.',
  prepMinutes: 40, cookMinutes: 0, servings: 24, yield: '1 large jar', difficulty:'Medium',
  ingredients: [[1,'','napa cabbage','chopped'],[60,'ml','salt'],[45,'ml','gochugaru','Korean chilli'],[6,'clove','garlic'],[30,'g','fresh ginger'],[30,'ml','soy sauce'],[2,'','carrot','julienned'],[4,'','spring onion']],
  instructions: [['Salt','Salt the cabbage; rest 2 hours, then rinse.',{t:120}],['Paste','Blend chilli, garlic, ginger and soy; toss with vegetables and cabbage.'],['Ferment','Pack under brine; ferment at room temperature 2–5 days, then chill.',{t:1440}]],
  nutrition: nut(25,1,0,5,2,2), tags:['raw','fermentation','anti-inflammatory'],
  antiInflammatoryNotes: 'Live-fermented with garlic, ginger and chilli.', storage:'Fridge 3 months.' });

R({ title: 'Green Tomato Chutney', subtitle: 'For the end-of-season fruit', category: 'Preserves', cuisine: 'Indian', mealType: 'Snack',
  description: 'Unripe tomatoes cooked down with apple, ginger and warm spice.',
  prepMinutes: 25, cookMinutes: 60, servings: 32, yield: 'About 4 cups',
  ingredients: [[1.5,'kg','green tomatoes','chopped'],[2,'','apples','chopped'],[1,'','onion'],[30,'g','fresh ginger'],[300,'ml','apple cider vinegar'],[200,'ml','sugar'],[10,'ml','mustard seeds'],[5,'ml','ground cumin']],
  instructions: [['Combine','Put everything in a heavy pot.'],['Simmer','Cook low, stirring, until dark and thick.',{t:60}],['Jar','Ladle into sterile jars.']],
  nutrition: nut(35,1,0,8,1,6), tags:['autumn','garden','batch-cooking'],
  storage:'Sealed 6 months; mellows with age.' });
