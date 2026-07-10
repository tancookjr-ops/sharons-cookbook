/* recipes/sides-breads.js — 16 vegan sides + 12 vegan breads & baking.
   Pushes to window.CB.recipes. */

/* ---- Sides (16) ---- */
R({ title: 'Garlic Roasted Potatoes', subtitle: 'Crisp edges, fluffy middle', category: 'Sides', cuisine: 'Canadian', mealType: 'Dinner',
  description: 'Parboiled then roasted potatoes tossed with garlic and rosemary.',
  prepMinutes: 10, cookMinutes: 40, servings: 6,
  ingredients: [[1,'kg','potatoes','chunked'],[6,'clove','garlic','smashed'],[2,'','rosemary sprig'],[60,'ml','olive oil']],
  instructions: [['Parboil','Boil potatoes 8 minutes; drain and rough up the edges.',{t:8}],['Roast','Toss with oil, garlic and rosemary; roast until golden and crisp.',{t:35,temp:'220 °C'}]],
  nutrition: nut(240,4,9,36,4,2), tags:['garden'],
  eoeNotes: 'Soft inside; skip roasting hard for a gentler texture.' });

R({ title: 'Lemon Herb Quinoa', subtitle: 'A better grain side', category: 'Sides', cuisine: 'Mediterranean', mealType: 'Dinner',
  description: 'Fluffy quinoa brightened with lemon and a handful of soft herbs.',
  prepMinutes: 5, cookMinutes: 18, servings: 4,
  ingredients: [[250,'ml','quinoa','rinsed'],[500,'ml','vegetable stock'],[1,'','lemon','zest and juice'],[15,'ml','fresh parsley'],[15,'ml','fresh mint'],[30,'ml','olive oil']],
  instructions: [['Cook','Simmer quinoa in stock until fluffy; rest covered.',{t:15}],['Finish','Fork through lemon, herbs and oil.']],
  nutrition: nut(220,6,10,28,4,2), tags:['high-protein','gluten-free','garden'] });

R({ title: 'Maple Roasted Carrots', subtitle: 'Nova Scotia sweet', category: 'Sides', cuisine: 'Canadian', mealType: 'Dinner',
  description: 'Whole young carrots roasted with maple and thyme until burnished.',
  prepMinutes: 8, cookMinutes: 30, servings: 6,
  ingredients: [[800,'g','carrot','halved lengthways'],[30,'ml','maple syrup'],[30,'ml','olive oil'],[10,'ml','fresh thyme']],
  instructions: [['Roast','Toss carrots with oil, maple and thyme; roast until tender and glazed.',{t:30,temp:'210 °C'}]],
  nutrition: nut(150,2,7,22,5,14), tags:['autumn','garden','eoe-friendly'],
  eoeNotes: 'Roasted soft — a gentle side.' });

R({ title: 'Garlicky Sautéed Greens', subtitle: 'Five-minute vegetables', category: 'Sides', cuisine: 'Italian', mealType: 'Dinner',
  description: 'Garden greens wilted quickly with garlic, chilli and lemon.',
  prepMinutes: 5, cookMinutes: 8, servings: 4,
  ingredients: [[1,'','bunch kale','or chard, stemmed'],[3,'clove','garlic'],[1,'ml','chilli flakes'],[30,'ml','olive oil'],[15,'ml','lemon juice']],
  instructions: [['Sizzle','Warm garlic and chilli in the oil.',{t:2}],['Wilt','Add greens and a splash of water; wilt until tender. Finish with lemon.',{t:5}]],
  nutrition: nut(120,4,9,8,3,1), tags:['garden','anti-inflammatory','quick'],
  antiInflammatoryNotes: 'Leafy greens, garlic and olive oil.' });

R({ title: 'Coconut Rice', subtitle: 'Fragrant and fluffy', category: 'Sides', cuisine: 'Thai', mealType: 'Dinner',
  description: 'Jasmine rice cooked in coconut milk for a soft, subtly sweet side.',
  prepMinutes: 5, cookMinutes: 18, servings: 4,
  ingredients: [[300,'ml','jasmine rice','rinsed'],[200,'ml','coconut milk'],[250,'ml','water'],[2.5,'ml','salt']],
  instructions: [['Cook','Bring rice, coconut milk, water and salt to a boil, then cover and steam low.',{t:15}],['Rest','Rest 5 minutes; fluff.',{t:5}]],
  nutrition: nut(280,4,9,44,1,1), tags:['eoe-friendly','gluten-free'],
  eoeNotes: 'Soft and smooth-grained — a gentle base.' });

R({ title: 'Balsamic Roasted Brussels Sprouts', subtitle: 'Caramelised and crisp', category: 'Sides', cuisine: 'Italian', mealType: 'Dinner',
  description: 'Halved sprouts roasted hard and finished with a balsamic glaze.',
  prepMinutes: 8, cookMinutes: 25, servings: 4,
  ingredients: [[600,'g','Brussels sprouts','halved'],[30,'ml','olive oil'],[30,'ml','balsamic vinegar'],[10,'ml','maple syrup']],
  instructions: [['Roast','Roast sprouts cut-side down in oil until deeply browned.',{t:22,temp:'220 °C'}],['Glaze','Reduce balsamic with maple; toss the sprouts through.',{t:3}]],
  nutrition: nut(160,5,8,18,6,8), tags:['autumn','garden'] });

R({ title: 'Smashed Crispy Potatoes', subtitle: 'Maximum crunch', category: 'Sides', cuisine: 'Canadian', mealType: 'Dinner',
  description: 'Baby potatoes boiled, smashed flat and roasted until shattering-crisp.',
  prepMinutes: 10, cookMinutes: 35, servings: 4,
  ingredients: [[800,'g','baby potatoes'],[45,'ml','olive oil'],[2,'','rosemary sprig'],[2.5,'ml','flaky salt']],
  instructions: [['Boil','Boil potatoes until tender.',{t:15}],['Smash','Smash flat on an oiled tray; brush with oil.'],['Roast','Roast until crisp and golden.',{t:25,temp:'230 °C'}]],
  nutrition: nut(220,4,10,30,3,1), tags:['garden'] });

R({ title: 'Mediterranean Roasted Vegetables', subtitle: 'A tray of colour', category: 'Sides', cuisine: 'Mediterranean', mealType: 'Dinner',
  description: 'Peppers, zucchini, eggplant and red onion roasted with oregano.',
  prepMinutes: 15, cookMinutes: 35, servings: 6,
  ingredients: [[2,'','bell pepper'],[1,'','zucchini'],[1,'','eggplant'],[1,'','red onion'],[60,'ml','olive oil'],[10,'ml','dried oregano']],
  instructions: [['Roast','Toss all the vegetables with oil and oregano; roast until soft and blistered.',{t:35,temp:'210 °C'}]],
  nutrition: nut(170,3,12,15,5,8), tags:['eoe-friendly','summer','garden','anti-inflammatory'],
  eoeNotes: 'Roasted soft throughout.' });

R({ title: 'Cauliflower Mash', subtitle: 'Lighter than potato', category: 'Sides', cuisine: 'Canadian', mealType: 'Dinner',
  description: 'Steamed cauliflower blended silky with garlic and olive oil.',
  prepMinutes: 8, cookMinutes: 15, servings: 4,
  ingredients: [[1,'','cauliflower','florets'],[2,'clove','garlic'],[45,'ml','olive oil'],[30,'ml','oat milk'],[2.5,'ml','salt']],
  instructions: [['Steam','Steam cauliflower and garlic until very soft.',{t:12}],['Blend','Blend with oil, oat milk and salt until smooth.',{eq:'Blender'}]],
  nutrition: nut(150,4,12,9,3,3), tags:['eoe-friendly','anti-inflammatory','low-carb'],
  eoeNotes: 'Completely smooth — a reliable easy texture.' });

R({ title: 'Braised Red Cabbage', subtitle: 'Sweet and sour, slow', category: 'Sides', cuisine: 'French', mealType: 'Dinner',
  description: 'Red cabbage braised low with apple, cider vinegar and a little maple.',
  prepMinutes: 12, cookMinutes: 45, servings: 6,
  ingredients: [[1,'','red cabbage','shredded'],[1,'','apple','grated'],[1,'','onion'],[60,'ml','apple cider vinegar'],[30,'ml','maple syrup'],[30,'ml','olive oil'],[2,'','clove']],
  instructions: [['Soften','Cook onion in the oil; add cabbage and apple.',{t:8}],['Braise','Add vinegar, maple and clove; braise covered until meltingly soft.',{t:40}]],
  nutrition: nut(150,2,7,22,5,15), tags:['eoe-friendly','winter','freezer-friendly'],
  eoeNotes: 'Braised very soft.', freezer:'Freezes 3 months.' });

R({ title: 'Chilli-Lime Grilled Corn', subtitle: 'Cob season', category: 'Sides', cuisine: 'Mexican', mealType: 'Dinner',
  description: 'Charred corn brushed with a smoky chilli-lime oil.',
  prepMinutes: 5, cookMinutes: 12, servings: 4,
  ingredients: [[4,'','corn cobs'],[30,'ml','olive oil'],[5,'ml','smoked paprika'],[1,'','lime'],[15,'ml','fresh coriander']],
  instructions: [['Grill','Grill the cobs, turning, until charred.',{t:12}],['Dress','Brush with oil and paprika; squeeze over lime and scatter coriander.']],
  nutrition: nut(160,4,7,24,3,5), tags:['summer','garden'] });

R({ title: 'Sesame Green Beans', subtitle: 'Snappy and nutty', category: 'Sides', cuisine: 'Chinese', mealType: 'Dinner',
  description: 'Blistered green beans tossed with garlic, soy and toasted sesame.',
  prepMinutes: 5, cookMinutes: 10, servings: 4,
  ingredients: [[500,'g','green beans','trimmed'],[2,'clove','garlic'],[30,'ml','soy sauce'],[15,'ml','toasted sesame oil'],[15,'ml','sesame seeds'],[15,'ml','vegetable oil']],
  instructions: [['Blister','Fry beans in the oil until charred and tender.',{t:8}],['Toss','Add garlic, soy and sesame oil; toss and finish with seeds.',{t:2}]],
  nutrition: nut(140,4,10,10,4,4), tags:['garden','quick'],
  eoeNotes: 'Contains soy and sesame; cook beans soft if needed.' });

R({ title: 'Herbed Couscous', subtitle: 'Ready in five', category: 'Sides', cuisine: 'Other', mealType: 'Dinner',
  description: 'Fluffy couscous with lemon, olive oil and fresh herbs.',
  prepMinutes: 5, cookMinutes: 5, servings: 4,
  ingredients: [[250,'ml','couscous'],[300,'ml','vegetable stock','boiling'],[1,'','lemon'],[30,'ml','olive oil'],[15,'ml','fresh parsley'],[15,'ml','fresh mint']],
  instructions: [['Steam','Pour boiling stock over couscous; cover 5 minutes.',{t:5}],['Fluff','Fork through lemon, oil and herbs.']],
  nutrition: nut(230,6,8,34,2,1), tags:['quick','garden'] });

R({ title: 'Orange Roasted Beets', subtitle: 'Sweet and earthy', category: 'Sides', cuisine: 'Canadian', mealType: 'Dinner',
  description: 'Beet wedges roasted with orange and thyme until tender and glossy.',
  prepMinutes: 10, cookMinutes: 40, servings: 4,
  ingredients: [[700,'g','beets','wedged'],[1,'','orange','juice and zest'],[30,'ml','olive oil'],[10,'ml','fresh thyme']],
  instructions: [['Roast','Toss beets with oil, orange and thyme; roast covered, then uncovered to glaze.',{t:40,temp:'200 °C'}]],
  nutrition: nut(140,3,7,20,5,14), tags:['eoe-friendly','autumn','anti-inflammatory'],
  eoeNotes: 'Roasted soft; a gentle side.' });

R({ title: 'Creamy Polenta', subtitle: 'Golden and soft', category: 'Sides', cuisine: 'Italian', mealType: 'Dinner',
  description: 'Slow-stirred polenta enriched with olive oil and nutritional yeast.',
  prepMinutes: 5, cookMinutes: 25, servings: 4,
  ingredients: [[250,'ml','polenta'],[1,'l','vegetable stock'],[30,'ml','nutritional yeast'],[30,'ml','olive oil']],
  instructions: [['Whisk','Rain polenta into simmering stock, whisking.'],['Stir','Cook low, stirring, until thick and creamy; beat in yeast and oil.',{t:22}]],
  nutrition: nut(240,5,10,32,3,1), tags:['eoe-friendly','gluten-free'],
  eoeNotes: 'Smooth and soft — a reliable EoE base.' });

R({ title: 'Dukkah Roasted Squash', subtitle: 'Spiced and nutty', category: 'Sides', cuisine: 'Middle Eastern', mealType: 'Dinner',
  description: 'Squash wedges roasted soft and dusted with crunchy dukkah.',
  prepMinutes: 10, cookMinutes: 35, servings: 4,
  ingredients: [[1,'kg','squash','wedged'],[45,'ml','olive oil'],[45,'ml','dukkah'],[15,'ml','fresh parsley']],
  instructions: [['Roast','Roast squash in the oil until tender and caramelised.',{t:35,temp:'210 °C'}],['Finish','Scatter dukkah and parsley.']],
  nutrition: nut(240,5,15,24,5,7), tags:['autumn','garden','anti-inflammatory'] });

/* ---- Breads & baking (12) ---- */
R({ title: 'Dutch Oven Crusty Bread', subtitle: 'No kneading, big crust', category: 'Breads & baking', cuisine: 'Canadian', mealType: 'Snack',
  description: 'A slow, no-knead loaf baked in a covered pot for a bakery crust and open crumb.',
  prepMinutes: 15, cookMinutes: 45, servings: 10, yield: '1 loaf', difficulty:'Medium',
  ingredients: [[750,'ml','bread flour'],[5,'ml','instant yeast'],[10,'ml','salt'],[375,'ml','water','lukewarm']],
  instructions: [['Mix','Stir flour, yeast, salt and water to a shaggy dough; cover and rest 12–18 hours.',{t:720}],['Shape','Fold into a round on a floured cloth; rest 45 minutes.',{t:45}],['Bake','Bake in a screaming-hot covered pot, then uncovered to brown.',{t:45,temp:'230 °C',eq:'Dutch oven'}]],
  nutrition: nut(180,6,1,37,2,1), tags:['batch-cooking'],
  storage: 'Cut-side down 2 days; freeze sliced.' });

R({ title: 'Rosemary Focaccia', subtitle: 'Dimpled and golden', category: 'Breads & baking', cuisine: 'Italian', mealType: 'Snack',
  description: 'A pillowy olive-oil focaccia dimpled with rosemary and flaky salt.',
  prepMinutes: 20, cookMinutes: 25, servings: 12, yield: '1 tray', difficulty:'Medium',
  ingredients: [[750,'ml','bread flour'],[7,'ml','instant yeast'],[10,'ml','salt'],[450,'ml','water'],[90,'ml','olive oil'],[2,'','rosemary sprig'],[5,'ml','flaky salt']],
  instructions: [['Mix','Stir a wet dough; rise until doubled and bubbly.',{t:120}],['Dimple','Stretch into an oiled tray; dimple with oily fingers, add rosemary and salt.',{t:40}],['Bake','Bake until deep gold.',{t:25,temp:'220 °C'}]],
  nutrition: nut(230,5,9,32,2,1), tags:['garden'],
  storage: 'Best day of; reheat to revive.' });

R({ title: 'Seeded Whole-Grain Loaf', subtitle: 'A sandwich workhorse', category: 'Breads & baking', cuisine: 'Canadian', mealType: 'Snack',
  description: 'A hearty whole-wheat loaf packed with sunflower, pumpkin and flax seeds.',
  prepMinutes: 20, cookMinutes: 40, servings: 12, yield: '1 loaf', difficulty:'Medium',
  ingredients: [[500,'ml','whole wheat flour'],[250,'ml','bread flour'],[7,'ml','instant yeast'],[10,'ml','salt'],[125,'ml','mixed seeds'],[400,'ml','water'],[30,'ml','maple syrup']],
  instructions: [['Knead','Knead a soft dough; rise until doubled.',{t:90}],['Shape','Shape into a tin; prove.',{t:45}],['Bake','Bake until hollow-sounding.',{t:40,temp:'210 °C'}]],
  nutrition: nut(190,7,4,34,4,3), tags:['high-fibre','batch-cooking'],
  freezer:'Freeze sliced 3 months.' });

R({ title: 'Vegan Banana Bread', subtitle: 'Use the black bananas', category: 'Breads & baking', cuisine: 'Canadian', mealType: 'Snack',
  description: 'A moist, tender banana loaf sweetened mostly by very ripe bananas.',
  prepMinutes: 12, cookMinutes: 55, servings: 10, yield: '1 loaf',
  ingredients: [[3,'','bananas','very ripe'],[500,'ml','flour'],[125,'ml','maple syrup'],[80,'ml','olive oil'],[125,'ml','oat milk'],[10,'ml','baking powder'],[5,'ml','baking soda'],[5,'ml','cinnamon'],[60,'ml','walnuts',null,{optional:true}]],
  instructions: [['Mash','Mash bananas; whisk in maple, oil and oat milk.'],['Fold','Fold in dry ingredients and walnuts.'],['Bake','Pour into a tin; bake until a skewer comes clean.',{t:55,temp:'180 °C'}]],
  nutrition: nut(240,4,8,40,2,16), tags:['freezer-friendly'],
  eoeNotes: 'Soft and moist; leave out walnuts for a smooth crumb.', freezer:'Freezes 3 months.' });

R({ title: 'Summer Zucchini Bread', subtitle: 'Sneak in the garden', category: 'Breads & baking', cuisine: 'Canadian', mealType: 'Snack',
  description: 'A spiced, moist loaf that hides a whole grated zucchini.',
  prepMinutes: 15, cookMinutes: 55, servings: 10, yield: '1 loaf',
  ingredients: [[1,'','zucchini','grated'],[500,'ml','flour'],[150,'ml','maple syrup'],[80,'ml','olive oil'],[125,'ml','oat milk'],[10,'ml','baking powder'],[5,'ml','baking soda'],[5,'ml','cinnamon'],[2,'ml','nutmeg']],
  instructions: [['Mix','Whisk maple, oil and oat milk; stir in grated zucchini.'],['Fold','Fold in the dry ingredients.'],['Bake','Bake in a lined tin until set.',{t:55,temp:'180 °C'}]],
  nutrition: nut(220,4,7,37,2,14), tags:['summer','garden','freezer-friendly'],
  freezer:'Freezes 3 months.' });

R({ title: 'Irish-Style Soda Bread', subtitle: 'No yeast, no wait', category: 'Breads & baking', cuisine: 'Other', mealType: 'Snack',
  description: 'A quick loaf leavened with baking soda and vegan buttermilk — on the table in an hour.',
  prepMinutes: 10, cookMinutes: 40, servings: 8, yield: '1 loaf',
  ingredients: [[625,'ml','flour'],[5,'ml','baking soda'],[5,'ml','salt'],[375,'ml','oat milk'],[15,'ml','lemon juice'],[30,'ml','olive oil']],
  instructions: [['Curdle','Stir lemon into oat milk; rest to curdle.'],['Mix','Combine dry, then wet, to a soft dough; do not overwork.'],['Bake','Shape a round, slash a cross, and bake.',{t:40,temp:'200 °C'}]],
  nutrition: nut(210,5,4,38,2,2), tags:['quick'] });

R({ title: 'Garlic Flatbreads', subtitle: 'Pan-cooked and puffed', category: 'Breads & baking', cuisine: 'Indian', mealType: 'Snack',
  description: 'Soft yogurt flatbreads cooked in a dry pan and brushed with garlic oil.',
  prepMinutes: 20, cookMinutes: 15, servings: 6, yield: '6 flatbreads',
  ingredients: [[500,'ml','flour'],[7,'ml','baking powder'],[200,'ml','coconut yogurt'],[125,'ml','water'],[3,'clove','garlic'],[45,'ml','olive oil'],[15,'ml','fresh coriander']],
  instructions: [['Dough','Mix flour, baking powder, yogurt and water; rest 20 minutes.',{t:20}],['Cook','Roll and cook in a hot dry pan until blistered.',{t:12}],['Brush','Brush with garlic oil; scatter coriander.']],
  nutrition: nut(240,6,8,36,2,2), tags:['garden'],
  eoeNotes: 'Soft and pliable warm.' });

R({ title: 'Skillet Cornbread', subtitle: 'Crisp edge, tender crumb', category: 'Breads & baking', cuisine: 'Mexican', mealType: 'Snack',
  description: 'A golden, slightly sweet cornbread baked in a hot skillet.',
  prepMinutes: 10, cookMinutes: 25, servings: 8,
  ingredients: [[250,'ml','cornmeal'],[250,'ml','flour'],[15,'ml','baking powder'],[300,'ml','oat milk'],[15,'ml','apple cider vinegar'],[60,'ml','maple syrup'],[60,'ml','olive oil']],
  instructions: [['Curdle','Stir vinegar into oat milk.'],['Mix','Combine dry and wet just until smooth.'],['Bake','Pour into a hot oiled skillet; bake until golden.',{t:25,temp:'200 °C',eq:'Cast-iron pan'}]],
  nutrition: nut(230,4,8,36,2,10), tags:['comfort'] });

R({ title: 'Pumpkin Spice Bread', subtitle: 'Autumn loaf', category: 'Breads & baking', cuisine: 'Canadian', mealType: 'Snack',
  description: 'A moist pumpkin loaf warm with cinnamon, ginger and clove.',
  prepMinutes: 12, cookMinutes: 55, servings: 10, yield: '1 loaf',
  ingredients: [[250,'ml','pumpkin purée'],[500,'ml','flour'],[150,'ml','maple syrup'],[80,'ml','olive oil'],[100,'ml','oat milk'],[10,'ml','baking powder'],[5,'ml','baking soda'],[10,'ml','pumpkin spice']],
  instructions: [['Mix','Whisk pumpkin, maple, oil and oat milk.'],['Fold','Stir in dry ingredients.'],['Bake','Bake in a lined tin until a skewer comes clean.',{t:55,temp:'180 °C'}]],
  nutrition: nut(230,4,8,38,2,15), tags:['autumn','freezer-friendly'],
  freezer:'Freezes 3 months.' });

R({ title: 'Oat & Molasses Brown Bread', subtitle: 'A Maritime table staple', category: 'Breads & baking', cuisine: 'Maritime', mealType: 'Snack',
  description: 'The dark, faintly sweet oat brown bread of Nova Scotia kitchens.',
  prepMinutes: 20, cookMinutes: 40, servings: 12, yield: '1 loaf', difficulty:'Medium',
  ingredients: [[250,'ml','rolled oats'],[375,'ml','boiling water'],[500,'ml','flour'],[7,'ml','instant yeast'],[80,'ml','molasses'],[10,'ml','salt'],[30,'ml','olive oil']],
  instructions: [['Soak','Pour boiling water over oats; cool to warm.',{t:20}],['Knead','Mix in molasses, oil, flour, yeast and salt; knead and rise.',{t:90}],['Bake','Shape into a tin, prove, and bake.',{t:40,temp:'190 °C'}]],
  nutrition: nut(190,5,3,37,3,6), tags:['maritime','batch-cooking'],
  storage: 'Keeps 3 days; toasts beautifully.', favourite:true, rating:5 });

R({ title: 'Herb Dinner Rolls', subtitle: 'Soft and pull-apart', category: 'Breads & baking', cuisine: 'Canadian', mealType: 'Snack',
  description: 'Fluffy pull-apart rolls brushed with herb oil.',
  prepMinutes: 25, cookMinutes: 20, servings: 12, yield: '12 rolls', difficulty:'Medium',
  ingredients: [[625,'ml','bread flour'],[7,'ml','instant yeast'],[8,'ml','salt'],[250,'ml','oat milk','warm'],[60,'ml','olive oil'],[15,'ml','maple syrup'],[15,'ml','mixed herbs']],
  instructions: [['Knead','Knead a soft dough; rise until doubled.',{t:75}],['Shape','Divide into balls in a tin; prove.',{t:40}],['Bake','Brush with herb oil; bake until golden.',{t:20,temp:'190 °C'}]],
  nutrition: nut(190,5,6,30,1,2), tags:['garden','comfort'] });

R({ title: 'Apple Cinnamon Muffins', subtitle: 'Orchard mornings', category: 'Breads & baking', cuisine: 'Canadian', mealType: 'Breakfast',
  description: 'Tender muffins studded with diced apple and a cinnamon-sugar top.',
  prepMinutes: 15, cookMinutes: 22, servings: 12, yield: '12 muffins',
  ingredients: [[500,'ml','flour'],[125,'ml','maple syrup'],[80,'ml','olive oil'],[200,'ml','oat milk'],[10,'ml','baking powder'],[5,'ml','baking soda'],[7,'ml','cinnamon'],[2,'','apples','diced']],
  instructions: [['Mix','Whisk maple, oil and oat milk; fold in dry and apple.'],['Bake','Divide into a lined tin; bake until springy.',{t:22,temp:'190 °C'}]],
  nutrition: nut(200,3,7,33,1,13), tags:['autumn','garden','freezer-friendly'],
  freezer:'Freezes 3 months.' });
