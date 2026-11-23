/* recipes/soups.js — 20 vegan soups & stews. Many blended smooth for
   EoE; several raw/chilled and seasonal. Pushes to window.CB.recipes. */

R({ title: 'Golden Cauliflower Soup', subtitle: 'Silk in a bowl', category: 'Soups & stews', cuisine: 'Canadian', mealType: 'Lunch',
  description: 'Cauliflower simmered soft and blended velvety with turmeric and a little coconut milk.',
  prepMinutes: 10, cookMinutes: 25, servings: 4,
  ingredients: [[1,'','cauliflower','florets'],[1,'','onion'],[3,'clove','garlic'],[5,'ml','ground turmeric'],[800,'ml','vegetable stock'],[125,'ml','coconut milk'],[30,'ml','olive oil'],[15,'ml','lemon juice']],
  instructions: [['Soften','Cook onion and garlic in the oil; add turmeric.',{t:6}],['Simmer','Add cauliflower and stock; simmer until very soft.',{t:16}],['Blend','Blend with coconut milk until completely smooth; brighten with lemon.',{eq:'Blender'}]],
  nutrition: nut(210,6,14,18,5,6), tags:['eoe-friendly','anti-inflammatory','garden'],
  eoeNotes: 'Blended fully smooth — a reliable easy texture.',
  antiInflammatoryNotes: 'Turmeric, olive oil and cruciferous cauliflower.', favourite:true, rating:5 });

R({ title: 'Tomato & Roasted Pepper Soup', subtitle: 'Better than the tin', category: 'Soups & stews', cuisine: 'Mediterranean', mealType: 'Lunch',
  description: 'Roasted peppers and tomatoes blended into a smooth, sweet-smoky soup.',
  prepMinutes: 10, cookMinutes: 35, servings: 4,
  ingredients: [[3,'','red pepper','halved'],[6,'','tomatoes','halved'],[1,'','onion'],[3,'clove','garlic'],[600,'ml','vegetable stock'],[45,'ml','olive oil'],[8,'','basil leaves']],
  instructions: [['Roast','Roast peppers, tomatoes, onion and garlic in the oil until charred.',{t:30,temp:'220 °C'}],['Blend','Blend with stock and basil until smooth.',{eq:'Blender'}],['Warm','Reheat, season, and serve.']],
  nutrition: nut(190,4,13,17,5,10), tags:['eoe-friendly','summer','garden','anti-inflammatory'],
  eoeNotes: 'Smooth and warming — very easy to swallow.' });

R({ title: 'Carrot & Ginger Soup', subtitle: 'Bright and warming', category: 'Soups & stews', cuisine: 'Canadian', mealType: 'Lunch',
  description: 'Sweet carrots and fresh ginger blended into a glowing, smooth soup.',
  prepMinutes: 10, cookMinutes: 25, servings: 4,
  ingredients: [[700,'g','carrot','sliced'],[1,'','onion'],[25,'g','fresh ginger'],[800,'ml','vegetable stock'],[125,'ml','coconut milk'],[30,'ml','coconut oil'],[15,'ml','lime juice']],
  instructions: [['Soften','Cook onion and ginger in the oil.',{t:6}],['Simmer','Add carrots and stock; simmer until very tender.',{t:18}],['Blend','Blend with coconut milk; finish with lime.',{eq:'Blender'}]],
  nutrition: nut(200,3,13,20,5,11), tags:['eoe-friendly','anti-inflammatory','autumn'],
  eoeNotes: 'Completely smooth once blended.',
  antiInflammatoryNotes: 'Ginger and carotene-rich carrots.' });

R({ title: 'Split Pea Soup', subtitle: 'Thick, humble, hearty', category: 'Soups & stews', cuisine: 'Canadian', mealType: 'Dinner',
  description: 'Yellow split peas simmered soft with carrot and thyme into a smoky, filling bowl.',
  prepMinutes: 10, cookMinutes: 55, servings: 6,
  ingredients: [[500,'ml','yellow split peas','rinsed'],[1,'','onion'],[2,'','carrot'],[2,'','celery'],[5,'ml','smoked paprika'],[1.5,'l','vegetable stock'],[1,'','bay leaf'],[30,'ml','olive oil']],
  instructions: [['Soften','Cook onion, carrot and celery in the oil; add paprika.',{t:8}],['Simmer','Add split peas, stock and bay; simmer until falling apart.',{t:45}],['Finish','Mash or partly blend for a thick, smooth pot.']],
  nutrition: nut(300,17,6,46,15,6), tags:['eoe-friendly','high-protein','freezer-friendly','winter'],
  eoeNotes: 'Blend for a smooth bowl; naturally soft.', freezer:'Freezes 6 months.' });

R({ title: 'Garden Minestrone', subtitle: 'Everything from the beds', category: 'Soups & stews', cuisine: 'Italian', mealType: 'Dinner',
  description: 'A brothy tomato soup full of beans, seasonal vegetables and small pasta.',
  prepMinutes: 15, cookMinutes: 30, servings: 6,
  ingredients: [[400,'g','white beans','rinsed'],[1,'','onion'],[2,'','carrot'],[2,'','celery'],[1,'','zucchini'],[400,'g','crushed tomatoes'],[1.2,'l','vegetable stock'],[150,'g','small pasta'],[45,'ml','olive oil'],[15,'ml','fresh basil']],
  instructions: [['Soffritto','Soften onion, carrot and celery in the oil.',{t:8}],['Simmer','Add tomatoes, stock, beans and zucchini; simmer.',{t:15}],['Pasta','Add pasta and cook until tender; finish with basil.',{t:8}]],
  nutrition: nut(300,12,8,48,10,8), tags:['high-protein','garden','summer','batch-cooking'] });

R({ title: 'Miso Soup with Tofu', subtitle: 'Ten quiet minutes', category: 'Soups & stews', cuisine: 'Japanese', mealType: 'Lunch',
  description: 'A gentle dashi-style broth with silken tofu, wakame and spring onion.',
  prepMinutes: 5, cookMinutes: 8, servings: 2,
  ingredients: [[750,'ml','water'],[10,'g','kombu'],[45,'ml','white miso'],[200,'g','silken tofu','cubed'],[5,'g','wakame','dried'],[2,'','spring onion']],
  instructions: [['Broth','Steep kombu in just-simmered water; remove.',{t:5}],['Miso','Whisk miso into a ladle of broth, then return to the pot off the boil.'],['Serve','Add tofu, wakame and spring onion; warm gently.',{t:2}]],
  nutrition: nut(90,7,4,6,1,2), tags:['eoe-friendly','high-protein','quick'],
  eoeNotes: 'Soft tofu in warm broth; contains soy — check tolerance.' });

R({ title: 'Chilled Gazpacho', subtitle: 'No stove, all summer', category: 'Soups & stews', cuisine: 'Mediterranean', mealType: 'Lunch',
  description: 'Ripe tomatoes, cucumber and pepper blended cold and smooth with sherry vinegar.',
  prepMinutes: 15, cookMinutes: 0, servings: 4,
  ingredients: [[8,'','tomatoes','ripe'],[1,'','cucumber'],[1,'','red pepper'],[1,'clove','garlic'],[45,'ml','olive oil'],[15,'ml','sherry vinegar'],[60,'ml','bread','soaked',{optional:true}]],
  instructions: [['Blend','Blend everything until completely smooth.',{eq:'Blender'}],['Chill','Chill at least 2 hours.',{t:120}],['Serve','Pour into bowls; drizzle with oil.']],
  nutrition: nut(170,3,12,15,4,9), tags:['raw','eoe-friendly','summer','garden','anti-inflammatory'],
  eoeNotes: 'Smooth and cold — soothing and easy.', rating:4 });

R({ title: 'Creamy Broccoli Soup', subtitle: 'Green and good for you', category: 'Soups & stews', cuisine: 'Canadian', mealType: 'Lunch',
  description: 'Broccoli simmered and blended silky with white beans for body — no cream.',
  prepMinutes: 10, cookMinutes: 20, servings: 4,
  ingredients: [[600,'g','broccoli','florets'],[400,'g','white beans','rinsed'],[1,'','onion'],[3,'clove','garlic'],[800,'ml','vegetable stock'],[30,'ml','olive oil'],[15,'ml','lemon juice']],
  instructions: [['Soften','Cook onion and garlic in the oil.',{t:5}],['Simmer','Add broccoli, beans and stock; simmer until tender.',{t:12}],['Blend','Blend smooth with lemon.',{eq:'Blender'}]],
  nutrition: nut(230,12,8,30,10,5), tags:['eoe-friendly','high-protein','anti-inflammatory'],
  eoeNotes: 'Beans make it creamy without dairy; fully smooth.' });

R({ title: 'Harira', subtitle: 'Moroccan comfort', category: 'Soups & stews', cuisine: 'Other', mealType: 'Dinner',
  description: 'A fragrant tomato, lentil and chickpea soup with warm spice and fresh herbs.',
  prepMinutes: 15, cookMinutes: 40, servings: 6,
  ingredients: [[250,'ml','brown lentils'],[540,'ml','chickpeas','rinsed'],[400,'g','crushed tomatoes'],[1,'','onion'],[10,'ml','ras el hanout'],[3,'ml','cinnamon'],[1.2,'l','vegetable stock'],[30,'ml','olive oil'],[15,'ml','fresh coriander'],[1,'','lemon']],
  instructions: [['Spice','Soften onion in the oil; toast the spices.',{t:6}],['Simmer','Add lentils, chickpeas, tomatoes and stock; simmer until lentils are soft.',{t:32}],['Finish','Stir in coriander; serve with lemon.']],
  nutrition: nut(300,15,7,46,13,8), tags:['high-protein','anti-inflammatory','freezer-friendly','winter'],
  freezer:'Freezes 3 months.' });

R({ title: 'Tom Kha Vegetables', subtitle: 'Coconut, lime, lemongrass', category: 'Soups & stews', cuisine: 'Thai', mealType: 'Dinner',
  description: 'A silky-sour coconut broth with mushrooms, tofu and plenty of lime.',
  prepMinutes: 15, cookMinutes: 20, servings: 4,
  ingredients: [[400,'ml','coconut milk'],[600,'ml','vegetable stock'],[2,'','lemongrass','bruised'],[25,'g','galangal','sliced'],[200,'g','mushrooms'],[300,'g','firm tofu','cubed'],[30,'ml','soy sauce'],[30,'ml','lime juice'],[1,'','chilli']],
  instructions: [['Infuse','Simmer coconut milk and stock with lemongrass and galangal.',{t:8}],['Add','Add mushrooms and tofu; simmer until tender.',{t:8}],['Balance','Season with soy, lime and chilli.']],
  nutrition: nut(300,13,22,14,3,6), tags:['high-protein','anti-inflammatory'],
  antiInflammatoryNotes: 'Ginger family, chilli and coconut.' });

R({ title: 'Potato Leek Soup', subtitle: 'Old reliable', category: 'Soups & stews', cuisine: 'French', mealType: 'Lunch',
  description: 'Leeks and potatoes simmered soft and blended into a smooth, comforting soup.',
  prepMinutes: 12, cookMinutes: 25, servings: 4,
  ingredients: [[3,'','leeks','sliced'],[600,'g','potatoes','cubed'],[3,'clove','garlic'],[900,'ml','vegetable stock'],[125,'ml','oat cream'],[30,'ml','olive oil'],[15,'ml','chives']],
  instructions: [['Sweat','Soften leeks and garlic in the oil without colouring.',{t:8}],['Simmer','Add potatoes and stock; simmer until soft.',{t:15}],['Blend','Blend smooth, stir in oat cream; top with chives.',{eq:'Blender'}]],
  nutrition: nut(260,5,11,36,4,5), tags:['eoe-friendly','garden'],
  eoeNotes: 'Classic smooth soup — very gentle.' });

R({ title: 'Smoky Black Bean Soup', subtitle: 'Deep and warming', category: 'Soups & stews', cuisine: 'Mexican', mealType: 'Dinner',
  description: 'Black beans simmered with cumin and smoked paprika, blended half-smooth and topped with avocado.',
  prepMinutes: 12, cookMinutes: 30, servings: 5,
  ingredients: [[800,'ml','black beans','two cans'],[1,'','onion'],[1,'','red pepper'],[3,'clove','garlic'],[10,'ml','ground cumin'],[10,'ml','smoked paprika'],[900,'ml','vegetable stock'],[1,'','lime'],[1,'','avocado']],
  instructions: [['Soften','Cook onion, pepper and garlic; add cumin and paprika.',{t:8}],['Simmer','Add beans and stock; simmer.',{t:18}],['Blend','Blend half for body; finish with lime and avocado.']],
  nutrition: nut(300,15,9,44,15,5), tags:['high-protein','eoe-friendly','freezer-friendly'],
  eoeNotes: 'Blend fully for the smoothest bowl.', freezer:'Freezes 3 months.' });

R({ title: 'Mushroom Barley Soup', subtitle: 'Earthy and chewy', category: 'Soups & stews', cuisine: 'Canadian', mealType: 'Dinner',
  description: 'A brothy, savoury soup of mushrooms and pearl barley with thyme.',
  prepMinutes: 15, cookMinutes: 45, servings: 6,
  ingredients: [[500,'g','mushrooms','sliced'],[250,'ml','pearl barley'],[1,'','onion'],[2,'','carrot'],[2,'','celery'],[3,'clove','garlic'],[1.5,'l','vegetable stock'],[15,'ml','fresh thyme'],[30,'ml','olive oil'],[30,'ml','soy sauce']],
  instructions: [['Brown','Cook mushrooms in the oil until deeply golden.',{t:10}],['Soften','Add onion, carrot, celery and garlic.',{t:8}],['Simmer','Add barley, stock, thyme and soy; simmer until barley is tender.',{t:35}]],
  nutrition: nut(240,8,7,38,7,5), tags:['autumn','freezer-friendly','batch-cooking'],
  freezer:'Freezes 3 months.' });

R({ title: 'Sweet Corn Chowder', subtitle: 'Peak-summer bowl', category: 'Soups & stews', cuisine: 'Canadian', mealType: 'Dinner',
  description: 'Fresh corn simmered with potato and blended part-smooth for a creamy, dairy-free chowder.',
  prepMinutes: 15, cookMinutes: 25, servings: 4,
  ingredients: [[750,'ml','sweet corn','kernels'],[400,'g','potatoes','diced'],[1,'','onion'],[2,'','celery'],[700,'ml','vegetable stock'],[250,'ml','oat milk'],[30,'ml','olive oil'],[15,'ml','chives']],
  instructions: [['Soften','Cook onion and celery in the oil.',{t:6}],['Simmer','Add potato, corn and stock; simmer until soft.',{t:15}],['Cream','Blend half, return with oat milk; top with chives.']],
  nutrition: nut(290,7,9,48,6,10), tags:['eoe-friendly','summer','garden'],
  eoeNotes: 'Blend fully for a smooth chowder.' });

R({ title: 'Roasted Parsnip & Apple Soup', subtitle: 'Sweet meets earthy', category: 'Soups & stews', cuisine: 'Canadian', mealType: 'Lunch',
  description: 'Roasted parsnips and orchard apples blended smooth with a little curry warmth.',
  prepMinutes: 12, cookMinutes: 35, servings: 4,
  ingredients: [[600,'g','parsnip','chunked'],[2,'','apples','wedged'],[1,'','onion'],[5,'ml','curry powder'],[800,'ml','vegetable stock'],[45,'ml','olive oil']],
  instructions: [['Roast','Roast parsnip, apple and onion in the oil until caramelised.',{t:30,temp:'210 °C'}],['Blend','Simmer with stock and curry, then blend smooth.',{eq:'Blender'}]],
  nutrition: nut(240,4,12,32,7,14), tags:['eoe-friendly','autumn','anti-inflammatory'],
  eoeNotes: 'Smooth and gently sweet.' });

R({ title: 'Lemon Lentil Soup', subtitle: 'Bright as a Beirut kitchen', category: 'Soups & stews', cuisine: 'Middle Eastern', mealType: 'Lunch',
  description: 'Red lentils simmered soft with cumin and finished with plenty of lemon.',
  prepMinutes: 10, cookMinutes: 25, servings: 4,
  ingredients: [[375,'ml','red lentils','rinsed'],[1,'','onion'],[3,'clove','garlic'],[10,'ml','ground cumin'],[1,'l','vegetable stock'],[30,'ml','olive oil'],[1,'','lemon'],[15,'ml','fresh parsley']],
  instructions: [['Soften','Cook onion and garlic in the oil; add cumin.',{t:6}],['Simmer','Add lentils and stock; simmer until collapsed.',{t:18}],['Finish','Blend smooth if you like; season with lemon and parsley.']],
  nutrition: nut(280,15,8,38,9,4), tags:['eoe-friendly','high-protein','anti-inflammatory'],
  eoeNotes: 'Naturally soft; blend for a fully smooth soup.', favourite:true, rating:5 });

R({ title: 'Ribollita', subtitle: 'Twice-boiled Tuscan stew', category: 'Soups & stews', cuisine: 'Italian', mealType: 'Dinner',
  description: 'A thick bean and kale stew thickened with day-old bread — better reheated.',
  prepMinutes: 15, cookMinutes: 40, servings: 6,
  ingredients: [[800,'ml','cannellini beans','two cans'],[1,'','bunch kale'],[400,'g','crushed tomatoes'],[1,'','onion'],[2,'','carrot'],[3,'clove','garlic'],[1,'l','vegetable stock'],[200,'g','stale bread','torn'],[45,'ml','olive oil']],
  instructions: [['Soffritto','Soften onion, carrot and garlic in the oil.',{t:8}],['Simmer','Add tomatoes, beans, kale and stock; simmer.',{t:20}],['Thicken','Stir in bread; cook until thick and stew-like.',{t:10}]],
  nutrition: nut(320,14,9,48,12,6), tags:['high-protein','autumn','garden','batch-cooking'] });

R({ title: 'Beet Borscht', subtitle: 'Ruby and restorative', category: 'Soups & stews', cuisine: 'Other', mealType: 'Lunch',
  description: 'Earthy beets blended smooth with a swirl of coconut yogurt and dill.',
  prepMinutes: 15, cookMinutes: 35, servings: 4,
  ingredients: [[700,'g','beets','peeled, diced'],[1,'','onion'],[2,'','carrot'],[900,'ml','vegetable stock'],[15,'ml','red wine vinegar'],[125,'ml','coconut yogurt'],[15,'ml','fresh dill']],
  instructions: [['Simmer','Simmer beets, onion and carrot in stock until very soft.',{t:30}],['Blend','Blend smooth with vinegar.',{eq:'Blender'}],['Serve','Swirl in coconut yogurt; top with dill.']],
  nutrition: nut(190,4,6,30,7,18), tags:['eoe-friendly','anti-inflammatory','autumn'],
  eoeNotes: 'Smooth and soothing; a beautiful colour.' });

R({ title: 'Chilled Cucumber Avocado Soup', subtitle: 'Cool as it gets', category: 'Soups & stews', cuisine: 'Mediterranean', mealType: 'Lunch',
  description: 'A raw, blended soup of cucumber, avocado and herbs — no cooking at all.',
  prepMinutes: 12, cookMinutes: 0, servings: 3,
  ingredients: [[2,'','cucumber'],[1,'','avocado'],[15,'ml','lemon juice'],[1,'clove','garlic'],[15,'ml','fresh dill'],[15,'ml','fresh mint'],[250,'ml','cold water'],[30,'ml','olive oil']],
  instructions: [['Blend','Blend everything until silky, loosening with water.',{eq:'Blender'}],['Chill','Chill an hour; serve very cold.',{t:60}]],
  nutrition: nut(180,3,15,12,5,4), tags:['raw','eoe-friendly','summer','garden'],
  eoeNotes: 'Raw and completely smooth — cooling and gentle.' });

R({ title: 'Butter Bean & Fennel Stew', subtitle: 'Creamy without cream', category: 'Soups & stews', cuisine: 'Mediterranean', mealType: 'Dinner',
  description: 'Soft butter beans braised with fennel, tomato and orange zest.',
  prepMinutes: 12, cookMinutes: 30, servings: 4,
  ingredients: [[800,'ml','butter beans','two cans'],[1,'','fennel bulb','sliced'],[1,'','onion'],[3,'clove','garlic'],[400,'g','crushed tomatoes'],[1,'','orange','zested'],[45,'ml','olive oil'],[15,'ml','fresh parsley']],
  instructions: [['Soften','Cook fennel, onion and garlic in the oil until sweet.',{t:12}],['Braise','Add beans, tomatoes and orange zest; braise gently.',{t:18}],['Finish','Mash a few beans for body; scatter parsley.']],
  nutrition: nut(300,13,11,40,12,8), tags:['eoe-friendly','high-protein','anti-inflammatory'],
  eoeNotes: 'Soft beans in a smooth sauce; a gentle stew.' });
