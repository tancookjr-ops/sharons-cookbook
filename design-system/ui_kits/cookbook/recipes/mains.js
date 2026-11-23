/* recipes/mains.js — 30 vegan mains. Global spread; EoE-friendly, raw
   and seasonal where noted. Pushes to window.CB.recipes. */

R({ title: 'Creamy Red Lentil Dal', subtitle: 'Comfort in a pot', category: 'Mains', cuisine: 'Indian', mealType: 'Dinner',
  description: 'Red lentils melt into a silky, golden dal with ginger, turmeric and a garlicky tempered oil poured over at the end.',
  prepMinutes: 10, cookMinutes: 25, servings: 4, favourite: true, rating: 5,
  ingredients: [[375,'ml','red lentils','rinsed'],[1,'','onion','diced'],[3,'clove','garlic'],[15,'g','fresh ginger','grated'],[5,'ml','ground turmeric'],[5,'ml','ground cumin'],[400,'ml','coconut milk'],[30,'ml','coconut oil'],[5,'ml','black mustard seeds'],[15,'ml','fresh coriander','to finish']],
  instructions: [['Simmer','Cook lentils, onion, half the garlic, ginger and turmeric in 750 ml water until collapsed and soft.',{t:20}],['Loosen','Stir in coconut milk and cumin; blend a little for extra silk.'],['Temper','Sizzle mustard seeds and the rest of the garlic in coconut oil; pour over. Finish with coriander.',{t:2}]],
  nutrition: nut(360,16,16,40,9,6), tags:['eoe-friendly','high-protein','anti-inflammatory','freezer-friendly'],
  eoeNotes: 'Soft and smooth — blend fully for the gentlest texture.',
  antiInflammatoryNotes: 'Turmeric, ginger, garlic and lentils together.', freezer:'Freezes 3 months.' });

R({ title: 'Mushroom Bolognese', subtitle: 'Slow-simmered, meaty, meatless', category: 'Mains', cuisine: 'Italian', mealType: 'Dinner',
  description: 'Finely chopped mushrooms and lentils build a deep, savoury ragù for a big bowl of pasta.',
  prepMinutes: 15, cookMinutes: 40, servings: 4,
  ingredients: [[400,'g','mushrooms','finely chopped'],[250,'ml','brown lentils','cooked'],[1,'','onion','diced'],[1,'','carrot','diced'],[3,'clove','garlic'],[796,'ml','crushed tomatoes'],[30,'ml','tomato paste'],[30,'ml','olive oil'],[5,'ml','dried oregano'],[400,'g','spaghetti']],
  instructions: [['Brown','Cook mushrooms in the oil until deeply golden and dry.',{t:10}],['Soffritto','Add onion, carrot and garlic; soften. Stir in tomato paste and oregano.',{t:8}],['Simmer','Add tomatoes and lentils; simmer low until rich, 20 minutes. Toss with cooked spaghetti.',{t:20}]],
  nutrition: nut(520,20,13,82,12,12), tags:['high-protein','garden','batch-cooking'],
  antiInflammatoryNotes: 'Mushrooms, tomatoes and olive oil.' });

R({ title: 'Chickpea Shakshuka', subtitle: 'A skillet of sunny tomatoes', category: 'Mains', cuisine: 'Middle Eastern', mealType: 'Dinner',
  description: 'Chickpeas simmered in a spiced tomato sauce with soft folds of silken tofu standing in for the eggs.',
  prepMinutes: 10, cookMinutes: 25, servings: 4,
  ingredients: [[540,'ml','chickpeas','rinsed'],[796,'ml','crushed tomatoes'],[1,'','onion','diced'],[1,'','red pepper','diced'],[3,'clove','garlic'],[10,'ml','smoked paprika'],[5,'ml','ground cumin'],[200,'g','silken tofu','spooned in'],[30,'ml','olive oil'],[15,'ml','fresh parsley']],
  instructions: [['Soften','Cook onion, pepper and garlic in the oil; add paprika and cumin.',{t:8}],['Simmer','Add tomatoes and chickpeas; simmer until thick.',{t:12}],['Nestle','Spoon in soft tofu, warm through, scatter parsley. Scoop with bread.',{t:4}]],
  nutrition: nut(340,15,14,40,10,10), tags:['high-protein','anti-inflammatory','garden'],
  antiInflammatoryNotes: 'Tomatoes, chickpeas, olive oil and warm spices.', favourite:true, rating:5 });

R({ title: 'Coconut Chickpea Curry', subtitle: 'Weeknight gold', category: 'Mains', cuisine: 'Thai', mealType: 'Dinner',
  description: 'Chickpeas and spinach in a quick coconut-tomato sauce, ready before the rice is.',
  prepMinutes: 10, cookMinutes: 20, servings: 4,
  ingredients: [[540,'ml','chickpeas','rinsed'],[400,'ml','coconut milk'],[400,'g','crushed tomatoes'],[1,'','onion','diced'],[3,'clove','garlic'],[15,'g','fresh ginger'],[30,'ml','curry powder'],[120,'g','spinach'],[15,'ml','coconut oil']],
  instructions: [['Base','Fry onion, garlic and ginger in the oil; add curry powder.',{t:6}],['Simmer','Add tomatoes, coconut milk and chickpeas; simmer to thicken.',{t:12}],['Wilt','Stir in spinach until it collapses. Serve over rice.',{t:2}]],
  nutrition: nut(400,14,20,42,11,8), tags:['high-protein','eoe-friendly','freezer-friendly'],
  eoeNotes: 'Soft and saucy; blend for an even gentler bowl.', freezer:'Freezes 3 months.' });

R({ title: 'Silken Tofu Mapo', subtitle: 'Soft, savoury, a little fiery', category: 'Mains', cuisine: 'Chinese', mealType: 'Dinner',
  description: 'Cubes of silken tofu in a glossy, umami-rich sauce with mushrooms — soft enough to eat with a spoon.',
  prepMinutes: 10, cookMinutes: 15, servings: 4,
  ingredients: [[500,'g','silken tofu','cubed'],[200,'g','mushrooms','minced'],[3,'clove','garlic'],[15,'g','fresh ginger'],[30,'ml','doubanjiang','fermented chilli bean paste'],[30,'ml','soy sauce'],[15,'ml','cornstarch','plus water'],[3,'','spring onion'],[30,'ml','vegetable oil']],
  instructions: [['Fry','Brown mushrooms with garlic and ginger in the oil; stir in the chilli bean paste.',{t:6}],['Simmer','Add 300 ml water and soy; slide in the tofu and warm gently.',{t:5}],['Thicken','Stir in the cornstarch slurry until glossy; top with spring onion.',{t:2}]],
  nutrition: nut(260,16,16,12,3,4), tags:['high-protein','eoe-friendly'],
  eoeNotes: 'Very soft; the sauce is spiced — go mild for comfort.' });

R({ title: 'Butternut Squash Risotto', subtitle: 'Stir, sip, repeat', category: 'Mains', cuisine: 'Italian', mealType: 'Dinner',
  description: 'Creamy risotto folded with roasted squash and sage, no dairy needed — the rice does the work.',
  prepMinutes: 15, cookMinutes: 35, servings: 4,
  ingredients: [[350,'ml','arborio rice'],[600,'g','butternut squash','cubed'],[1,'','onion','diced'],[3,'clove','garlic'],[1.2,'l','vegetable stock','hot'],[125,'ml','white wine',null,{optional:true}],[8,'','fresh sage','leaves'],[45,'ml','olive oil'],[30,'ml','nutritional yeast']],
  instructions: [['Roast','Roast half the squash until caramelised; steam and mash the rest.',{t:25,temp:'200 °C'}],['Toast','Soften onion and garlic in oil; toast rice, splash in wine.',{t:5}],['Stir','Add hot stock a ladle at a time until creamy; fold in squash mash, roasted cubes, sage and yeast.',{t:20}]],
  nutrition: nut(470,10,14,74,6,8), tags:['eoe-friendly','autumn','garden'],
  eoeNotes: 'Soft and creamy throughout.', rating:5 });

R({ title: 'Quinoa-Stuffed Peppers', subtitle: 'Summer bells, filled up', category: 'Mains', cuisine: 'Mediterranean', mealType: 'Dinner',
  description: 'Sweet peppers baked with a herby quinoa, tomato and white bean filling.',
  prepMinutes: 20, cookMinutes: 35, servings: 4,
  ingredients: [[4,'','bell peppers','tops off, seeded'],[250,'ml','quinoa','cooked'],[400,'g','white beans','rinsed'],[200,'g','cherry tomatoes','halved'],[2,'clove','garlic'],[30,'ml','olive oil'],[15,'ml','fresh parsley'],[15,'ml','fresh mint']],
  instructions: [['Mix','Toss quinoa, beans, tomatoes, garlic, herbs and oil; season well.'],['Fill','Pack into the peppers and stand in a dish with a splash of water.'],['Bake','Bake until the peppers slump and colour.',{t:35,temp:'190 °C'}]],
  nutrition: nut(360,13,11,55,12,9), tags:['high-protein','garden','summer'],
  bloodSugarNotes: 'Quinoa and beans keep it high-fibre and steady.' });

R({ title: 'Sweet Potato & Black Bean Enchiladas', subtitle: 'Rolled, sauced, baked', category: 'Mains', cuisine: 'Mexican', mealType: 'Dinner',
  description: 'Soft tortillas rolled around spiced sweet potato and black beans under a smoky red sauce.',
  prepMinutes: 25, cookMinutes: 30, servings: 4,
  ingredients: [[600,'g','sweet potato','diced, roasted'],[540,'ml','black beans','rinsed'],[8,'','corn tortillas'],[500,'ml','tomato passata'],[10,'ml','smoked paprika'],[5,'ml','ground cumin'],[1,'','onion'],[30,'ml','olive oil'],[1,'','avocado','to serve']],
  instructions: [['Sauce','Simmer passata with paprika, cumin and half the onion.',{t:10}],['Fill','Mash roasted sweet potato with beans; roll into tortillas.'],['Bake','Sit seam-down, cover with sauce, bake. Top with avocado.',{t:20,temp:'190 °C'}]],
  nutrition: nut(430,14,12,68,14,11), tags:['high-protein','autumn','batch-cooking'] });

R({ title: 'Melanzane alla Parmigiana', subtitle: 'Eggplant, layered and lush', category: 'Mains', cuisine: 'Italian', mealType: 'Dinner',
  description: 'Roasted eggplant layered with tomato sauce and a cashew-parm crumb — soft, rich and dairy-free.',
  prepMinutes: 25, cookMinutes: 40, servings: 4,
  ingredients: [[2,'','eggplant','sliced'],[796,'ml','crushed tomatoes'],[3,'clove','garlic'],[125,'ml','cashews','blitzed with yeast'],[30,'ml','nutritional yeast'],[45,'ml','olive oil'],[8,'','basil leaves']],
  instructions: [['Roast','Brush eggplant with oil and roast until tender.',{t:25,temp:'200 °C'}],['Sauce','Simmer tomatoes with garlic and basil.',{t:12}],['Layer & bake','Alternate eggplant, sauce and cashew-parm; bake until bubbling.',{t:20,temp:'190 °C'}]],
  nutrition: nut(390,12,26,28,9,12), tags:['eoe-friendly','summer','garden'],
  eoeNotes: 'Very soft once baked; a gentle texture.' });

R({ title: 'Thai Green Vegetable Curry', subtitle: 'Fragrant and fast', category: 'Mains', cuisine: 'Thai', mealType: 'Dinner',
  description: 'Coconut green curry loaded with the week\u2019s vegetables and basil.',
  prepMinutes: 15, cookMinutes: 20, servings: 4,
  ingredients: [[45,'ml','green curry paste','check vegan'],[400,'ml','coconut milk'],[300,'g','firm tofu','cubed'],[1,'','zucchini','sliced'],[150,'g','green beans'],[1,'','red pepper'],[15,'ml','soy sauce'],[8,'','Thai basil leaves'],[15,'ml','lime juice']],
  instructions: [['Bloom','Fry the curry paste in a splash of coconut milk until fragrant.',{t:3}],['Simmer','Add the rest of the coconut milk, tofu and vegetables; simmer until just tender.',{t:12}],['Finish','Season with soy and lime; stir through basil. Serve with rice.']],
  nutrition: nut(380,16,26,22,6,8), tags:['high-protein','garden'],
  antiInflammatoryNotes: 'Ginger, chilli and coconut; load up the greens.' });

R({ title: "Lentil Shepherd's Pie", subtitle: 'Mash on top, comfort below', category: 'Mains', cuisine: 'Canadian', mealType: 'Dinner',
  description: 'A savoury lentil and vegetable base under a cloud of soft potato mash.',
  prepMinutes: 25, cookMinutes: 35, servings: 6,
  ingredients: [[500,'ml','brown lentils','cooked'],[1,'','onion'],[2,'','carrot'],[150,'g','mushrooms'],[30,'ml','tomato paste'],[30,'ml','soy sauce'],[900,'g','potatoes','for mash'],[60,'ml','oat milk'],[30,'ml','olive oil'],[125,'ml','frozen peas']],
  instructions: [['Base','Soften onion, carrot and mushrooms; add lentils, tomato paste, soy and peas.',{t:12}],['Mash','Boil potatoes; mash with oat milk and oil until smooth.'],['Bake','Spoon base into a dish, top with mash, fork it, and bake until golden.',{t:25,temp:'200 °C'}]],
  nutrition: nut(360,15,8,58,12,8), tags:['eoe-friendly','high-protein','freezer-friendly','autumn'],
  eoeNotes: 'The mash is smooth; keep the base finely chopped for softness.', freezer:'Freezes 3 months.' });

R({ title: 'Miso-Glazed Eggplant', subtitle: 'Nasu dengaku', category: 'Mains', cuisine: 'Japanese', mealType: 'Dinner',
  description: 'Roasted eggplant halves lacquered with a sweet-savoury miso glaze until spoon-soft.',
  prepMinutes: 10, cookMinutes: 25, servings: 4,
  ingredients: [[2,'','eggplant','halved, scored'],[45,'ml','white miso'],[15,'ml','maple syrup'],[15,'ml','rice vinegar'],[15,'ml','toasted sesame oil'],[5,'ml','sesame seeds'],[2,'','spring onion']],
  instructions: [['Roast','Brush eggplant with oil; roast cut-side down until soft.',{t:18,temp:'200 °C'}],['Glaze','Whisk miso, maple and vinegar; spread on and roast until caramelised.',{t:7}],['Finish','Scatter sesame and spring onion.']],
  nutrition: nut(220,5,12,24,7,14), tags:['eoe-friendly','high-fibre'],
  eoeNotes: 'Meltingly soft; contains soy and sesame — check tolerance.' });

R({ title: 'Chana Masala', subtitle: 'The takeaway you make at home', category: 'Mains', cuisine: 'Indian', mealType: 'Dinner',
  description: 'Chickpeas simmered in an onion-tomato masala sharp with amchoor and fresh ginger.',
  prepMinutes: 15, cookMinutes: 30, servings: 4,
  ingredients: [[800,'ml','chickpeas','two cans, rinsed'],[2,'','onion','finely chopped'],[400,'g','crushed tomatoes'],[4,'clove','garlic'],[20,'g','fresh ginger'],[10,'ml','garam masala'],[5,'ml','amchoor','dried mango powder',{optional:true}],[30,'ml','coconut oil'],[15,'ml','fresh coriander']],
  instructions: [['Brown','Fry onion in the oil until deep gold; add garlic and ginger.',{t:12}],['Masala','Add tomatoes and spices; cook down to a thick paste.',{t:8}],['Simmer','Add chickpeas and a cup of water; simmer to meld. Finish with coriander.',{t:10}]],
  nutrition: nut(360,15,12,50,13,9), tags:['high-protein','anti-inflammatory','freezer-friendly'],
  antiInflammatoryNotes: 'Warm spices, garlic, ginger and legumes.', favourite:true, rating:5, freezer:'Freezes 3 months.' });

R({ title: 'Vegetable Paella', subtitle: 'One pan, saffron gold', category: 'Mains', cuisine: 'Mediterranean', mealType: 'Dinner',
  description: 'Saffron rice with artichokes, peppers and beans, crisped into a socarrat at the base.',
  prepMinutes: 20, cookMinutes: 35, servings: 6,
  ingredients: [[400,'ml','paella rice'],[1,'','onion'],[1,'','red pepper'],[200,'g','artichoke hearts'],[400,'g','white beans','rinsed'],[1,'','pinch saffron'],[1.2,'l','vegetable stock','hot'],[125,'ml','frozen peas'],[45,'ml','olive oil'],[1,'','lemon']],
  instructions: [['Sofrito','Soften onion and pepper in the oil; stir in rice and saffron.',{t:8}],['Simmer','Add hot stock, beans and artichokes; simmer without stirring.',{t:18}],['Socarrat','Add peas, then turn heat up briefly to crisp the base. Rest; serve with lemon.',{t:5}]],
  nutrition: nut(410,11,10,70,8,6), tags:['garden','summer','batch-cooking'] });

R({ title: 'Tofu Pad Thai', subtitle: 'Sweet, sour, savoury', category: 'Mains', cuisine: 'Thai', mealType: 'Dinner',
  description: 'Rice noodles tossed with crisp tofu, bean sprouts and a tamarind sauce, showered with peanuts.',
  prepMinutes: 20, cookMinutes: 12, servings: 4,
  ingredients: [[250,'g','rice noodles'],[300,'g','firm tofu','pressed, cubed'],[45,'ml','tamarind paste'],[30,'ml','soy sauce'],[30,'ml','maple syrup'],[150,'g','bean sprouts'],[3,'','spring onion'],[60,'ml','peanuts','crushed'],[30,'ml','vegetable oil'],[1,'','lime']],
  instructions: [['Soak','Soak the noodles until pliable; drain.'],['Crisp','Fry tofu in the oil until golden.',{t:8}],['Toss','Add noodles, sauce, sprouts and spring onion; toss hot. Top with peanuts and lime.',{t:3}]],
  nutrition: nut(470,18,17,62,5,14), tags:['high-protein'],
  eoeNotes: 'Contains soy and peanut — a common trigger pair; check tolerance.' });

R({ title: 'Mushroom & Leek Pot Pie', subtitle: 'Golden lid, creamy middle', category: 'Mains', cuisine: 'Canadian', mealType: 'Dinner',
  description: 'A creamy mushroom and leek filling under flaky vegan pastry.',
  prepMinutes: 25, cookMinutes: 35, servings: 6, difficulty:'Medium',
  ingredients: [[500,'g','mushrooms','sliced'],[2,'','leeks','sliced'],[3,'clove','garlic'],[30,'ml','flour'],[500,'ml','oat milk'],[30,'ml','olive oil'],[15,'ml','fresh thyme'],[320,'g','puff pastry','vegan']],
  instructions: [['Filling','Cook mushrooms and leeks in oil; stir in flour, then oat milk to a creamy sauce with thyme.',{t:15}],['Assemble','Tip into a dish; lay pastry over and seal.'],['Bake','Bake until the pastry is deep gold.',{t:30,temp:'200 °C'}]],
  nutrition: nut(430,9,26,40,4,6), tags:['autumn','garden','comfort'] });

R({ title: 'Cauliflower Steaks with Tahini', subtitle: 'Roast it thick', category: 'Mains', cuisine: 'Middle Eastern', mealType: 'Dinner',
  description: 'Thick cauliflower slabs roasted till caramelised, over lemony tahini with pomegranate.',
  prepMinutes: 10, cookMinutes: 30, servings: 4,
  ingredients: [[1,'','cauliflower','cut into thick steaks'],[45,'ml','olive oil'],[5,'ml','ground cumin'],[60,'ml','tahini'],[15,'ml','lemon juice'],[60,'ml','pomegranate seeds'],[15,'ml','fresh parsley']],
  instructions: [['Roast','Brush cauliflower with oil and cumin; roast until deeply golden and tender.',{t:28,temp:'220 °C'}],['Whisk','Loosen tahini with lemon and water to a pourable cream.'],['Plate','Pool the tahini, sit the steaks on top, scatter pomegranate and parsley.']],
  nutrition: nut(300,9,22,20,7,7), tags:['anti-inflammatory','garden'],
  antiInflammatoryNotes: 'Cauliflower, olive oil and sesame.' });

R({ title: 'Zucchini & Herb Fritters', subtitle: 'Use up the glut', category: 'Mains', cuisine: 'Greek', mealType: 'Dinner',
  description: 'Crisp-edged courgette fritters bound with chickpea flour and packed with dill and mint.',
  prepMinutes: 15, cookMinutes: 15, servings: 4,
  ingredients: [[3,'','zucchini','grated, squeezed'],[180,'ml','chickpea flour'],[3,'','spring onion'],[15,'ml','fresh dill'],[15,'ml','fresh mint'],[2,'clove','garlic'],[45,'ml','olive oil'],[125,'ml','coconut yogurt','to serve']],
  instructions: [['Mix','Combine zucchini, flour, onion, herbs and garlic into a thick batter.'],['Fry','Spoon into hot oil and cook until golden on both sides.',{t:10}],['Serve','With a dollop of coconut yogurt.']],
  nutrition: nut(300,10,17,28,6,6), tags:['garden','summer','high-protein'] });

R({ title: 'White Bean & Kale Stew', subtitle: 'Rustic and nourishing', category: 'Mains', cuisine: 'Italian', mealType: 'Dinner',
  description: 'Creamy cannellini beans and garden kale in a garlicky, rosemary-scented broth.',
  prepMinutes: 10, cookMinutes: 25, servings: 4,
  ingredients: [[800,'ml','cannellini beans','two cans'],[1,'','bunch kale','stemmed'],[4,'clove','garlic'],[1,'','onion'],[750,'ml','vegetable stock'],[1,'','rosemary sprig'],[45,'ml','olive oil'],[15,'ml','lemon juice']],
  instructions: [['Soften','Cook onion, garlic and rosemary in the oil.',{t:6}],['Simmer','Add beans and stock; mash some for body.',{t:12}],['Wilt','Stir in kale until tender; brighten with lemon.',{t:5}]],
  nutrition: nut(330,15,11,44,13,4), tags:['eoe-friendly','high-protein','autumn','garden'],
  eoeNotes: 'Soft beans and greens; blend part for a creamier bowl.' });

R({ title: 'Soft Polenta with Roasted Vegetables', subtitle: 'A golden bed', category: 'Mains', cuisine: 'Italian', mealType: 'Dinner',
  description: 'Loose, creamy polenta topped with olive-oil-roasted vegetables.',
  prepMinutes: 10, cookMinutes: 35, servings: 4,
  ingredients: [[250,'ml','polenta'],[1,'l','vegetable stock'],[30,'ml','nutritional yeast'],[1,'','zucchini'],[1,'','red pepper'],[200,'g','cherry tomatoes'],[1,'','red onion'],[45,'ml','olive oil'],[8,'','basil leaves']],
  instructions: [['Roast','Toss vegetables with oil and roast until soft and blistered.',{t:25,temp:'210 °C'}],['Stir','Whisk polenta into simmering stock; cook creamy, stir in yeast.',{t:15}],['Serve','Spoon polenta into bowls; pile on vegetables and basil.']],
  nutrition: nut(360,8,16,48,6,9), tags:['eoe-friendly','summer','garden','gluten-free'],
  eoeNotes: 'Polenta is smooth and soft — an easy base.' });

R({ title: 'Smoky Black Bean Tacos', subtitle: 'Ten-minute dinner', category: 'Mains', cuisine: 'Mexican', mealType: 'Dinner',
  description: 'Quick smoky black beans in warm tortillas with cabbage slaw and lime crema.',
  prepMinutes: 12, cookMinutes: 10, servings: 4,
  ingredients: [[540,'ml','black beans','rinsed'],[8,'','corn tortillas'],[10,'ml','smoked paprika'],[5,'ml','ground cumin'],[200,'g','red cabbage','shredded'],[125,'ml','cashew cream'],[1,'','lime'],[15,'ml','olive oil'],[15,'ml','fresh coriander']],
  instructions: [['Beans','Warm beans with paprika, cumin and a splash of water; mash lightly.',{t:6}],['Slaw','Toss cabbage with lime and salt.'],['Build','Fill tortillas with beans, slaw, cashew cream and coriander.']],
  nutrition: nut(360,13,12,52,13,6), tags:['high-protein','quick'] });

R({ title: 'Peanut Tofu Noodle Bowl', subtitle: 'Cold noodles, warm peanut', category: 'Mains', cuisine: 'Chinese', mealType: 'Dinner',
  description: 'Chewy noodles with baked tofu, crunchy vegetables and a gingery peanut sauce.',
  prepMinutes: 20, cookMinutes: 15, servings: 4,
  ingredients: [[250,'g','noodles'],[300,'g','firm tofu','baked'],[90,'ml','peanut butter'],[30,'ml','soy sauce'],[15,'ml','rice vinegar'],[15,'g','fresh ginger'],[1,'','carrot','julienned'],[1,'','cucumber','julienned'],[3,'','spring onion']],
  instructions: [['Sauce','Whisk peanut butter, soy, vinegar, ginger and warm water to a pourable sauce.'],['Toss','Cook and cool noodles; toss with sauce.'],['Bowl','Top with tofu, carrot, cucumber and spring onion.']],
  nutrition: nut(480,22,22,50,6,9), tags:['high-protein'],
  eoeNotes: 'Contains peanut and soy — common triggers; check tolerance.' });

R({ title: 'Moroccan Chickpea Tagine', subtitle: 'Sweet, spiced, gentle', category: 'Mains', cuisine: 'Other', mealType: 'Dinner',
  description: 'Chickpeas and squash braised with apricots, cinnamon and preserved lemon over couscous.',
  prepMinutes: 15, cookMinutes: 35, servings: 4,
  ingredients: [[540,'ml','chickpeas','rinsed'],[500,'g','squash','cubed'],[80,'ml','dried apricots','halved'],[1,'','onion'],[10,'ml','ras el hanout'],[3,'ml','cinnamon'],[400,'g','crushed tomatoes'],[0.5,'','preserved lemon','chopped',{optional:true}],[250,'ml','couscous']],
  instructions: [['Spice','Soften onion; toast ras el hanout and cinnamon.',{t:6}],['Braise','Add squash, chickpeas, apricots and tomatoes; braise until tender.',{t:25}],['Serve','Fluff couscous with hot water; spoon the tagine over. Finish with preserved lemon.']],
  nutrition: nut(420,14,7,80,13,18), tags:['eoe-friendly','autumn','freezer-friendly'],
  eoeNotes: 'Soft-braised and stewy; a gentle texture.', freezer:'Freezes 3 months.' });

R({ title: 'Saag Chana', subtitle: 'Greens and chickpeas', category: 'Mains', cuisine: 'Indian', mealType: 'Dinner',
  description: 'Silky puréed spinach with chickpeas, ginger and warm spices.',
  prepMinutes: 12, cookMinutes: 20, servings: 4,
  ingredients: [[400,'g','spinach'],[540,'ml','chickpeas','rinsed'],[1,'','onion'],[3,'clove','garlic'],[15,'g','fresh ginger'],[10,'ml','garam masala'],[5,'ml','ground turmeric'],[125,'ml','coconut milk'],[30,'ml','coconut oil']],
  instructions: [['Wilt','Blanch spinach and blend to a smooth purée.',{eq:'Blender'}],['Masala','Fry onion, garlic, ginger and spices in the oil.',{t:8}],['Simmer','Add chickpeas, spinach purée and coconut milk; warm through.',{t:8}]],
  nutrition: nut(320,14,16,32,10,5), tags:['eoe-friendly','high-protein','anti-inflammatory'],
  eoeNotes: 'Puréed greens make this smooth and easy.',
  antiInflammatoryNotes: 'Leafy greens, turmeric and ginger.' });

R({ title: 'Roasted Ratatouille', subtitle: 'Provence in a tray', category: 'Mains', cuisine: 'French', mealType: 'Dinner',
  description: 'Eggplant, courgette, peppers and tomato roasted together until jammy and soft.',
  prepMinutes: 20, cookMinutes: 40, servings: 4,
  ingredients: [[1,'','eggplant','cubed'],[2,'','zucchini','sliced'],[2,'','bell pepper','chunked'],[4,'','tomatoes','wedged'],[1,'','onion'],[4,'clove','garlic'],[60,'ml','olive oil'],[15,'ml','herbes de Provence'],[8,'','basil leaves']],
  instructions: [['Toss','Toss all the vegetables with oil, garlic and herbs on two trays.'],['Roast','Roast, turning once, until soft and caramelised.',{t:40,temp:'210 °C'}],['Finish','Fold together with basil; serve warm or at room temperature.']],
  nutrition: nut(240,5,15,26,8,14), tags:['eoe-friendly','summer','garden','anti-inflammatory'],
  eoeNotes: 'Roasted very soft; a reliable EoE texture.',
  antiInflammatoryNotes: 'A whole tray of vegetables in olive oil.', rating:5 });

R({ title: 'Lentil & Mushroom Meatballs', subtitle: 'In a pool of tomato', category: 'Mains', cuisine: 'Italian', mealType: 'Dinner',
  description: 'Hearty baked lentil-mushroom balls simmered in tomato sauce for pasta or a sub.',
  prepMinutes: 25, cookMinutes: 30, servings: 4, difficulty:'Medium',
  ingredients: [[500,'ml','brown lentils','cooked'],[200,'g','mushrooms','minced'],[125,'ml','breadcrumbs'],[30,'ml','ground flax','plus water'],[3,'clove','garlic'],[15,'ml','dried oregano'],[796,'ml','crushed tomatoes'],[45,'ml','olive oil']],
  instructions: [['Mix','Pulse lentils, cooked mushrooms, breadcrumbs, flax, garlic and oregano; roll into balls.'],['Bake','Bake until firm and browned.',{t:20,temp:'200 °C'}],['Simmer','Slip into simmering tomato sauce for 10 minutes.',{t:10}]],
  nutrition: nut(400,19,14,52,14,10), tags:['high-protein','freezer-friendly','batch-cooking'],
  freezer:'Freeze cooked balls 3 months.' });

R({ title: 'Cauliflower Shawarma Bowls', subtitle: 'Spiced and piled high', category: 'Mains', cuisine: 'Middle Eastern', mealType: 'Dinner',
  description: 'Shawarma-spiced roasted cauliflower and chickpeas over garlicky rice with tahini.',
  prepMinutes: 20, cookMinutes: 30, servings: 4,
  ingredients: [[1,'','cauliflower','florets'],[540,'ml','chickpeas','rinsed'],[15,'ml','shawarma spice'],[45,'ml','olive oil'],[375,'ml','rice','cooked'],[60,'ml','tahini'],[15,'ml','lemon juice'],[1,'','tomato','diced'],[15,'ml','fresh parsley']],
  instructions: [['Roast','Toss cauliflower and chickpeas with spice and oil; roast until crisp-edged.',{t:28,temp:'220 °C'}],['Sauce','Loosen tahini with lemon and water.'],['Bowl','Spoon over rice; pile on the roast, tomato, parsley and tahini.']],
  nutrition: nut(520,17,22,66,12,6), tags:['high-protein','batch-cooking'] });

R({ title: 'Teriyaki Tofu & Broccoli', subtitle: 'Sticky and quick', category: 'Mains', cuisine: 'Japanese', mealType: 'Dinner',
  description: 'Crisp tofu and broccoli glazed in a glossy homemade teriyaki.',
  prepMinutes: 15, cookMinutes: 15, servings: 4,
  ingredients: [[400,'g','firm tofu','cubed'],[400,'g','broccoli','florets'],[45,'ml','soy sauce'],[30,'ml','maple syrup'],[15,'ml','rice vinegar'],[15,'g','fresh ginger'],[10,'ml','cornstarch','plus water'],[30,'ml','vegetable oil'],[5,'ml','sesame seeds']],
  instructions: [['Crisp','Fry tofu in the oil until golden; steam broccoli until bright.',{t:8}],['Glaze','Simmer soy, maple, vinegar and ginger; thicken with the slurry.',{t:3}],['Toss','Coat tofu and broccoli; finish with sesame. Serve on rice.']],
  nutrition: nut(320,20,16,26,6,12), tags:['high-protein','quick'],
  eoeNotes: 'Contains soy and sesame; broccoli is firm — steam soft if needed.' });

R({ title: 'Squash & Sage Gnocchi', subtitle: 'Pillows and crisp sage', category: 'Mains', cuisine: 'Italian', mealType: 'Dinner',
  description: 'Soft potato gnocchi tossed with roasted squash, olive oil and frizzled sage.',
  prepMinutes: 30, cookMinutes: 20, servings: 4, difficulty:'Medium',
  ingredients: [[700,'g','potato gnocchi','vegan'],[500,'g','squash','cubed, roasted'],[10,'','fresh sage','leaves'],[3,'clove','garlic'],[60,'ml','olive oil'],[30,'ml','nutritional yeast'],[30,'ml','walnuts','toasted',{optional:true}]],
  instructions: [['Crisp sage','Fry sage in the oil until crisp; lift out. Soften garlic in the same oil.',{t:4}],['Toss','Boil gnocchi until they float; toss with garlic oil, squash and yeast.',{t:4}],['Finish','Scatter sage and walnuts.']],
  nutrition: nut(470,11,18,66,6,7), tags:['eoe-friendly','autumn','garden'],
  eoeNotes: 'Soft gnocchi and squash; leave off walnuts for smoothness.' });

R({ title: 'Winter Root Vegetable Curry', subtitle: 'Root cellar warmth', category: 'Mains', cuisine: 'Indian', mealType: 'Dinner',
  description: 'Carrots, parsnip and potato simmered in a fragrant coconut curry.',
  prepMinutes: 20, cookMinutes: 30, servings: 5,
  ingredients: [[2,'','carrot','chunked'],[2,'','parsnip','chunked'],[400,'g','potatoes','cubed'],[400,'ml','coconut milk'],[400,'g','crushed tomatoes'],[1,'','onion'],[30,'ml','curry powder'],[15,'g','fresh ginger'],[30,'ml','coconut oil'],[250,'ml','red lentils']],
  instructions: [['Base','Fry onion, ginger and curry powder in the oil.',{t:6}],['Simmer','Add roots, lentils, tomatoes, coconut milk and water; simmer until tender.',{t:24}],['Serve','Season and serve with rice or flatbread.']],
  nutrition: nut(420,14,18,54,12,10), tags:['eoe-friendly','winter','freezer-friendly','anti-inflammatory'],
  eoeNotes: 'Soft-cooked and stewy; blend part for a smoother curry.', freezer:'Freezes 3 months.' });
