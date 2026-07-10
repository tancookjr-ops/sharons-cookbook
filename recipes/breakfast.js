/* recipes/breakfast.js — 22 vegan breakfasts. Raw, EoE-friendly and
   seasonal where noted. Loaded before data.js; pushes to window.CB.recipes. */

R({ title: 'Golden Turmeric Porridge', subtitle: 'A warm, gentle start', category: 'Breakfast', cuisine: 'Indian', mealType: 'Breakfast',
  description: 'Creamy oats simmered with turmeric, ginger and coconut milk — soft, soothing and bright as morning sun.',
  prepMinutes: 3, cookMinutes: 10, servings: 2,
  ingredients: [[180,'ml','rolled oats'],[400,'ml','coconut milk','light, or oat milk'],[5,'g','fresh ginger','grated'],[2.5,'ml','ground turmeric'],[1,'ml','cinnamon'],[15,'ml','maple syrup',null,{optional:true}],[30,'ml','coconut yogurt','to finish',{optional:true}]],
  instructions: [['Simmer','Warm oats, coconut milk, ginger, turmeric and cinnamon over medium heat, stirring, until thick and creamy.',{t:10}],['Serve','Sweeten to taste, spoon into bowls and swirl through coconut yogurt.']],
  nutrition: nut(310,7,14,40,6,10), tags:['eoe-friendly','anti-inflammatory','garden'],
  eoeNotes: 'Soft and completely smooth — a reliable easy texture.',
  antiInflammatoryNotes: 'Turmeric, ginger and oats are a classic anti-inflammatory trio.', rating:5 });

R({ title: 'Peach & Basil Chia Pudding', subtitle: 'Summer in a jar', category: 'Breakfast', cuisine: 'Mediterranean', mealType: 'Breakfast',
  description: 'Chia set overnight in almond milk, layered with ripe peaches and a whisper of garden basil.',
  prepMinutes: 8, cookMinutes: 0, servings: 2,
  ingredients: [[60,'ml','chia seeds'],[375,'ml','almond milk'],[10,'ml','maple syrup'],[2,'','peaches','ripe, sliced'],[4,'','basil leaves','from the garden, torn']],
  instructions: [['Stir','Whisk chia, almond milk and maple syrup; rest 5 minutes, whisk again to stop clumps.'],['Set','Chill at least 4 hours or overnight.',{t:240}],['Layer','Spoon into jars with peaches and basil.']],
  nutrition: nut(260,7,12,32,11,16), tags:['raw','eoe-friendly','summer','blood-sugar-friendly'],
  bloodSugarNotes: 'Chia fibre slows the fruit sugars for a gentle curve.',
  eoeNotes: 'Soft, pudding texture; contains almond — check tolerance.' });

R({ title: 'Silken Tofu Breakfast Bowl', subtitle: 'Cool, soft, five minutes', category: 'Breakfast', cuisine: 'Japanese', mealType: 'Breakfast',
  description: 'Chilled silken tofu spooned into bowls with tamari, ginger and a shower of spring onion.',
  prepMinutes: 5, cookMinutes: 0, servings: 2,
  ingredients: [[300,'g','silken tofu','well chilled'],[15,'ml','tamari','or soy sauce'],[5,'g','fresh ginger','grated'],[2,'','spring onion','thinly sliced'],[10,'ml','toasted sesame oil'],[5,'ml','sesame seeds',null,{optional:true}]],
  instructions: [['Spoon','Turn the tofu gently into two bowls in soft, large curds.'],['Dress','Spoon over tamari, ginger, sesame oil, spring onion and seeds. Eat with a spoon.']],
  nutrition: nut(160,12,10,4,1,2), tags:['raw','eoe-friendly','high-protein','quick'],
  eoeNotes: 'Silky and boneless; contains soy and sesame — check tolerance.' });

R({ title: 'Roasted Apple Cinnamon Oatmeal', subtitle: 'Autumn, slow and sweet', category: 'Breakfast', cuisine: 'Canadian', mealType: 'Breakfast',
  description: 'Orchard apples roasted until jammy, folded through creamy oats with cinnamon and maple.',
  prepMinutes: 10, cookMinutes: 25, servings: 4,
  ingredients: [[2,'','apples','cored and diced'],[15,'ml','maple syrup'],[3,'ml','cinnamon'],[375,'ml','rolled oats'],[900,'ml','oat milk'],[30,'ml','walnuts','toasted, chopped',{optional:true}]],
  instructions: [['Roast','Toss apples with maple and half the cinnamon; roast until soft and caramelised.',{t:20,temp:'200 °C',eq:'Sheet pan'}],['Cook oats','Simmer oats, oat milk and the rest of the cinnamon until creamy.',{t:8}],['Serve','Top each bowl with roasted apple and walnuts.']],
  nutrition: nut(330,9,9,55,7,16), tags:['eoe-friendly','autumn','garden'],
  eoeNotes: 'Soft throughout; leave off the walnuts for the smoothest bowl.',
  storage: 'Fridge 4 days; loosen with milk when reheating.' });

R({ title: 'Savoury Chickpea Socca', subtitle: 'A pancake with a Riviera accent', category: 'Breakfast', cuisine: 'French', mealType: 'Breakfast',
  description: 'A single golden chickpea-flour pancake, crisp at the edges, blistered under the grill — naturally gluten-free protein.',
  prepMinutes: 10, cookMinutes: 12, servings: 2,
  ingredients: [[250,'ml','chickpea flour'],[300,'ml','water'],[30,'ml','olive oil'],[2.5,'ml','salt'],[1,'','rosemary sprig','leaves picked',{optional:true}]],
  instructions: [['Batter','Whisk flour, water, half the oil and salt; rest 30 minutes.',{t:30}],['Pour','Heat an ovenproof pan very hot with the rest of the oil; pour the batter and blister under the grill.',{t:10,temp:'240 °C',eq:'Cast-iron pan'}],['Serve','Scatter rosemary, cut in wedges, eat warm.']],
  nutrition: nut(300,12,15,28,5,4), tags:['high-protein','mediterranean','gluten-free'],
  bloodSugarNotes: 'Chickpea flour is low glycemic and high in protein.' });

R({ title: 'Green Garden Smoothie', subtitle: 'Drink your greens', category: 'Breakfast', cuisine: 'Canadian', mealType: 'Breakfast',
  description: 'Spinach, cucumber, green apple and mint blended silky with banana — light, cooling, wide awake.',
  prepMinutes: 5, cookMinutes: 0, servings: 2,
  ingredients: [[1,'','banana','frozen'],[60,'g','spinach','from the garden'],[0.5,'','cucumber'],[1,'','green apple'],[6,'','mint leaves'],[300,'ml','coconut water']],
  instructions: [['Blend','Blend everything until completely smooth, adding water to loosen.',{eq:'Blender'}]],
  nutrition: nut(150,3,1,35,6,22), tags:['raw','eoe-friendly','garden','summer'],
  eoeNotes: 'Fully blended and smooth — very easy to swallow.' });

R({ title: 'Wild Blueberry Buckwheat Pancakes', subtitle: 'Weekend blue-and-gold', category: 'Breakfast', cuisine: 'Canadian', mealType: 'Breakfast',
  description: 'Nutty buckwheat pancakes studded with wild Nova Scotia blueberries and pooled with maple.',
  prepMinutes: 10, cookMinutes: 15, servings: 4,
  ingredients: [[250,'ml','buckwheat flour'],[10,'ml','baking powder'],[375,'ml','oat milk'],[15,'ml','ground flax','plus 45 ml water'],[15,'ml','maple syrup'],[250,'ml','wild blueberries'],[15,'ml','coconut oil','for the pan']],
  instructions: [['Batter','Stir flax and water, rest 5 minutes. Whisk flours and baking powder, then the wet, then fold in berries.'],['Griddle','Cook in a little coconut oil until bubbles set, then flip.',{t:6}],['Serve','Stack and drown in maple.']],
  nutrition: nut(290,7,8,50,6,14), tags:['garden','summer'],
  storage: 'Fridge 3 days; freeze between parchment and toast from frozen.' });

R({ title: 'Coconut Mango Chia Parfait', subtitle: 'Tropical, no cooking', category: 'Breakfast', cuisine: 'Thai', mealType: 'Breakfast',
  description: 'Coconut chia layered with mango purée — bright, soft and made the night before.',
  prepMinutes: 8, cookMinutes: 0, servings: 2,
  ingredients: [[60,'ml','chia seeds'],[300,'ml','coconut milk'],[10,'ml','maple syrup'],[1,'','mango','ripe, cubed'],[15,'ml','lime juice']],
  instructions: [['Set','Whisk chia, coconut milk and maple; chill overnight.',{t:240}],['Purée','Blend most of the mango with lime; dice the rest.'],['Layer','Alternate chia and mango purée in glasses; top with diced mango.']],
  nutrition: nut(280,5,15,33,10,18), tags:['raw','eoe-friendly','blood-sugar-friendly'],
  eoeNotes: 'Soft, spoonable layers — an easy texture.' });

R({ title: 'Creamy Millet & Pear Porridge', subtitle: 'Softer than oats', category: 'Breakfast', cuisine: 'Other', mealType: 'Breakfast',
  description: 'Millet simmered to a smooth porridge with cardamom and topped with poached pear.',
  prepMinutes: 5, cookMinutes: 25, servings: 3,
  ingredients: [[180,'ml','millet'],[750,'ml','oat milk'],[2,'','cardamom pods','crushed'],[2,'','pears','ripe, sliced'],[15,'ml','maple syrup']],
  instructions: [['Simmer','Cook millet with oat milk and cardamom, stirring often, until creamy and soft.',{t:22}],['Poach','Warm pear slices in a splash of water and maple until tender.',{t:6}],['Serve','Blend the porridge smooth if you like; top with pear.']],
  nutrition: nut(300,7,5,58,5,15), tags:['eoe-friendly','autumn','gluten-free'],
  eoeNotes: 'Blend for a fully smooth, EoE-gentle porridge.' });

R({ title: 'Tomato & Herb Tofu Scramble', subtitle: 'The garden on toast', category: 'Breakfast', cuisine: 'Mediterranean', mealType: 'Breakfast',
  description: 'Firm tofu scrambled golden with turmeric, folded with sweet cherry tomatoes and soft herbs.',
  prepMinutes: 10, cookMinutes: 10, servings: 2,
  ingredients: [[350,'g','firm tofu','crumbled'],[2.5,'ml','ground turmeric'],[2.5,'ml','kala namak','black salt, for eggy flavour',{optional:true}],[200,'g','cherry tomatoes','halved'],[15,'ml','olive oil'],[15,'ml','fresh parsley','chopped'],[15,'ml','chives','snipped']],
  instructions: [['Scramble','Fry tofu in the oil with turmeric and black salt until golden, 6 minutes.',{t:6}],['Fold','Add tomatoes and warm through until they slump; fold in the herbs.',{t:3}]],
  nutrition: nut(240,18,16,7,3,4), tags:['high-protein','garden','summer'],
  antiInflammatoryNotes: 'Tofu, olive oil and tomatoes; turmeric adds a gentle boost.' });

R({ title: 'Sweet Potato Breakfast Hash', subtitle: 'Skillet, spice, morning', category: 'Breakfast', cuisine: 'Mexican', mealType: 'Breakfast',
  description: 'Cubed sweet potato crisped with peppers, black beans and smoked paprika.',
  prepMinutes: 12, cookMinutes: 20, servings: 4,
  ingredients: [[600,'g','sweet potato','diced small'],[1,'','red pepper','diced'],[1,'','onion','diced'],[540,'ml','black beans','one can, rinsed'],[5,'ml','smoked paprika'],[5,'ml','ground cumin'],[30,'ml','olive oil'],[1,'','avocado','sliced, to serve']],
  instructions: [['Crisp','Fry sweet potato in the oil over medium-high until browned and tender.',{t:14}],['Build','Add onion, pepper and spices; cook until soft, then fold in beans and warm through.',{t:6}],['Serve','Top with avocado and hot sauce.']],
  nutrition: nut(360,10,14,52,12,10), tags:['high-protein','autumn','garden','blood-sugar-friendly'],
  bloodSugarNotes: 'Beans and fibre steady the sweet-potato carbs.' });

R({ title: 'Strawberry Rhubarb Compote Bowl', subtitle: 'The first taste of spring', category: 'Breakfast', cuisine: 'Canadian', mealType: 'Breakfast',
  description: 'Softly stewed rhubarb and strawberries over coconut yogurt — tart, pink and seasonal.',
  prepMinutes: 8, cookMinutes: 12, servings: 3,
  ingredients: [[300,'g','rhubarb','sliced'],[250,'g','strawberries','halved'],[30,'ml','maple syrup'],[5,'ml','vanilla extract'],[500,'ml','coconut yogurt'],[45,'ml','pumpkin seeds','to finish']],
  instructions: [['Stew','Gently cook rhubarb, strawberries and maple until collapsed and glossy.',{t:12}],['Cool','Stir in vanilla; cool a little.'],['Serve','Spoon over coconut yogurt; scatter seeds.']],
  nutrition: nut(250,5,12,30,5,20), tags:['eoe-friendly','spring','garden'],
  eoeNotes: 'Soft compote over yogurt; skip the seeds for a smooth bowl.' });

R({ title: 'Banana Oat Blender Muffins', subtitle: 'One jug, twelve muffins', category: 'Breakfast', cuisine: 'Canadian', mealType: 'Breakfast',
  description: 'Whole-oat muffins whizzed in the blender, sweetened only with ripe banana and dates.',
  prepMinutes: 10, cookMinutes: 20, servings: 12, yield: '12 muffins',
  ingredients: [[500,'ml','rolled oats'],[3,'','bananas','very ripe'],[6,'','dates','pitted'],[250,'ml','oat milk'],[10,'ml','baking powder'],[5,'ml','cinnamon'],[15,'ml','ground flax','plus 45 ml water']],
  instructions: [['Blend','Blend everything until smooth; rest 5 minutes to thicken.',{eq:'Blender'}],['Bake','Divide into a lined tin; bake until springy.',{t:20,temp:'180 °C'}]],
  nutrition: nut(130,3,2,26,3,9), tags:['freezer-friendly','blood-sugar-friendly'],
  bloodSugarNotes: 'No added sugar — fruit and oats only.',
  freezer: 'Freeze in a bag for 3 months; thaw at room temperature.' });

R({ title: 'Pumpkin Spice Baked Oatmeal', subtitle: 'Cut it into squares', category: 'Breakfast', cuisine: 'Canadian', mealType: 'Breakfast',
  description: 'A tray of soft, spiced pumpkin oats you slice all week.',
  prepMinutes: 10, cookMinutes: 35, servings: 8,
  ingredients: [[750,'ml','rolled oats'],[250,'ml','pumpkin purée'],[625,'ml','oat milk'],[45,'ml','maple syrup'],[10,'ml','pumpkin spice'],[10,'ml','baking powder'],[45,'ml','pecans','chopped',{optional:true}]],
  instructions: [['Mix','Stir everything but the pecans; pour into a lined dish.'],['Bake','Scatter pecans and bake until set.',{t:35,temp:'180 °C'}],['Slice','Cool 10 minutes and cut into squares.']],
  nutrition: nut(220,6,6,37,5,11), tags:['eoe-friendly','autumn','freezer-friendly','batch-cooking'],
  eoeNotes: 'Soft and moist; leave out pecans for an easy texture.',
  storage: 'Fridge 5 days.' });

R({ title: 'Avocado Smash on Sourdough', subtitle: 'Ten minutes, no apologies', category: 'Breakfast', cuisine: 'Canadian', mealType: 'Breakfast',
  description: 'Lemony smashed avocado on toasted sourdough with chilli and garden radish.',
  prepMinutes: 8, cookMinutes: 3, servings: 2,
  ingredients: [[2,'','avocados','ripe'],[15,'ml','lemon juice'],[2,'','sourdough slices'],[2,'','radishes','thinly sliced'],[1,'ml','chilli flakes',null,{optional:true}],[15,'ml','olive oil']],
  instructions: [['Smash','Fork the avocado with lemon and salt.'],['Toast','Toast the sourdough; drizzle with oil.'],['Build','Pile on the avocado, top with radish and chilli.']],
  nutrition: nut(340,7,22,30,9,3), tags:['quick','garden','summer','high-fibre'],
  antiInflammatoryNotes: 'Avocado and olive oil are heart-friendly monounsaturated fats.' });

R({ title: 'Cucumber & Dill Tofu Toast', subtitle: 'Cool and herby', category: 'Breakfast', cuisine: 'Other', mealType: 'Breakfast',
  description: 'Whipped silken tofu "cream cheese" on rye with cucumber ribbons and dill.',
  prepMinutes: 10, cookMinutes: 0, servings: 2,
  ingredients: [[200,'g','silken tofu'],[15,'ml','lemon juice'],[5,'ml','white miso'],[2,'','rye bread slices'],[0.5,'','cucumber','ribboned'],[10,'ml','fresh dill','chopped']],
  instructions: [['Whip','Blend tofu, lemon and miso until thick and smooth.',{eq:'Blender'}],['Build','Spread on rye; layer cucumber and dill.']],
  nutrition: nut(210,11,6,28,4,4), tags:['raw','high-protein','garden'],
  eoeNotes: 'The tofu spread is smooth; contains soy — check tolerance.' });

R({ title: 'Raspberry Coconut Smoothie Bowl', subtitle: 'Thick enough for a spoon', category: 'Breakfast', cuisine: 'Canadian', mealType: 'Breakfast',
  description: 'Frozen raspberries and banana blended thick with coconut, spooned and topped.',
  prepMinutes: 7, cookMinutes: 0, servings: 2,
  ingredients: [[300,'g','raspberries','frozen'],[1,'','banana','frozen'],[150,'ml','coconut milk'],[15,'ml','coconut flakes'],[15,'ml','chia seeds','to top']],
  instructions: [['Blend','Blend raspberries, banana and coconut milk thick — spoonable, not pourable.',{eq:'Blender'}],['Top','Spoon into bowls; finish with coconut and chia.']],
  nutrition: nut(240,4,12,32,11,17), tags:['raw','eoe-friendly','summer','blood-sugar-friendly'],
  eoeNotes: 'Smooth base; add toppings only as tolerated.' });

R({ title: 'Warm Quinoa Berry Bowl', subtitle: 'Protein to start the day', category: 'Breakfast', cuisine: 'Other', mealType: 'Breakfast',
  description: 'Fluffy quinoa cooked in almond milk with cinnamon and a heap of warm berries.',
  prepMinutes: 5, cookMinutes: 20, servings: 3,
  ingredients: [[180,'ml','quinoa','rinsed'],[500,'ml','almond milk'],[3,'ml','cinnamon'],[250,'ml','mixed berries'],[30,'ml','almond butter'],[15,'ml','maple syrup']],
  instructions: [['Cook','Simmer quinoa in almond milk with cinnamon until soft and creamy.',{t:18}],['Warm berries','Heat the berries with maple until juicy.',{t:4}],['Serve','Swirl almond butter through; top with berries.']],
  nutrition: nut(340,11,14,44,7,15), tags:['high-protein','gluten-free','blood-sugar-friendly'],
  bloodSugarNotes: 'Complete plant protein plus fibre for a steady morning.' });

R({ title: 'Zucchini Bread Baked Oats', subtitle: 'Sneak the garden glut in', category: 'Breakfast', cuisine: 'Canadian', mealType: 'Breakfast',
  description: 'Grated summer zucchini folded into warmly spiced baked oats.',
  prepMinutes: 12, cookMinutes: 30, servings: 6,
  ingredients: [[625,'ml','rolled oats'],[1,'','zucchini','grated, squeezed dry'],[500,'ml','oat milk'],[45,'ml','maple syrup'],[5,'ml','cinnamon'],[10,'ml','baking powder'],[45,'ml','walnuts','chopped',{optional:true}]],
  instructions: [['Mix','Stir everything together; pour into a lined dish.'],['Bake','Bake until golden and set.',{t:30,temp:'180 °C'}]],
  nutrition: nut(230,6,7,37,5,12), tags:['garden','summer','freezer-friendly'],
  storage: 'Fridge 5 days; freezes well.' });

R({ title: 'Apple Bircher Muesli', subtitle: 'The original overnight oats', category: 'Breakfast', cuisine: 'Other', mealType: 'Breakfast',
  description: 'Oats soaked with grated apple, lemon and almond milk — soft by morning, Swiss-style.',
  prepMinutes: 10, cookMinutes: 0, servings: 3,
  ingredients: [[375,'ml','rolled oats'],[2,'','apples','grated'],[15,'ml','lemon juice'],[500,'ml','almond milk'],[30,'ml','raisins'],[30,'ml','almonds','flaked',{optional:true}]],
  instructions: [['Soak','Stir oats, apple, lemon, milk and raisins; chill overnight.',{t:240}],['Serve','Loosen with milk; top with almonds.']],
  nutrition: nut(280,7,8,46,6,18), tags:['raw','eoe-friendly','autumn'],
  eoeNotes: 'Soft, soaked texture; omit almonds for the gentlest bowl.' });

R({ title: 'Carrot Cake Overnight Oats', subtitle: 'Dessert for breakfast', category: 'Breakfast', cuisine: 'Canadian', mealType: 'Breakfast',
  description: 'Grated carrot, warm spice and raisins soaked into oats overnight.',
  prepMinutes: 8, cookMinutes: 0, servings: 2,
  ingredients: [[250,'ml','rolled oats'],[1,'','carrot','finely grated'],[375,'ml','oat milk'],[30,'ml','raisins'],[3,'ml','cinnamon'],[1,'ml','nutmeg'],[15,'ml','maple syrup'],[30,'ml','walnuts','to top',{optional:true}]],
  instructions: [['Stir','Combine everything but the walnuts in a jar.'],['Soak','Chill overnight.',{t:240}],['Serve','Top with walnuts and a little more milk.']],
  nutrition: nut(320,8,9,52,7,20), tags:['blood-sugar-friendly','autumn'],
  bloodSugarNotes: 'Oats and carrot fibre keep the sugars gentle.' });

R({ title: 'Overnight Bircher with Fig', subtitle: 'Late-summer sweetness', category: 'Breakfast', cuisine: 'Mediterranean', mealType: 'Breakfast',
  description: 'Soaked oats with fresh figs, orange zest and a drizzle of tahini.',
  prepMinutes: 8, cookMinutes: 0, servings: 2,
  ingredients: [[250,'ml','rolled oats'],[375,'ml','oat milk'],[15,'ml','orange juice'],[3,'','figs','quartered'],[15,'ml','tahini'],[10,'ml','maple syrup']],
  instructions: [['Soak','Stir oats, milk and orange; chill overnight.',{t:240}],['Serve','Top with figs and a drizzle of tahini and maple.']],
  nutrition: nut(300,8,10,46,7,19), tags:['raw','eoe-friendly','summer','garden'],
  eoeNotes: 'Soft soaked oats; tahini adds sesame — check tolerance.' });
