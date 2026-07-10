/* recipes/salads.js — 24 vegan salads. Mostly raw and seasonal, garden-
   forward. Pushes to window.CB.recipes. */

R({ title: 'Rainbow Tahini Slaw', subtitle: 'Crunch and colour', category: 'Salads', cuisine: 'Canadian', mealType: 'Lunch',
  description: 'Shredded cabbage, carrot and pepper in a creamy lemon-tahini dressing.',
  prepMinutes: 15, cookMinutes: 0, servings: 6,
  ingredients: [[300,'g','red cabbage','shredded'],[2,'','carrot','grated'],[1,'','red pepper','sliced'],[60,'ml','tahini'],[30,'ml','lemon juice'],[15,'ml','maple syrup'],[30,'ml','sunflower seeds']],
  instructions: [['Whisk','Loosen tahini with lemon, maple and water to a pourable dressing.'],['Toss','Toss the vegetables in the dressing.'],['Finish','Scatter sunflower seeds; rest 10 minutes before serving.']],
  nutrition: nut(190,6,12,18,6,8), tags:['raw','garden','anti-inflammatory'],
  antiInflammatoryNotes: 'Cruciferous cabbage and sesame.' });

R({ title: 'Massaged Kale Caesar', subtitle: 'No anchovy in sight', category: 'Salads', cuisine: 'Canadian', mealType: 'Lunch',
  description: 'Garden kale massaged tender in a creamy cashew-caper Caesar with crunchy chickpeas.',
  prepMinutes: 15, cookMinutes: 20, servings: 4,
  ingredients: [[1,'','bunch kale','stemmed, torn'],[540,'ml','chickpeas','roasted'],[125,'ml','cashews','soaked'],[15,'ml','capers'],[2,'clove','garlic'],[30,'ml','lemon juice'],[15,'ml','nutritional yeast'],[30,'ml','olive oil']],
  instructions: [['Roast','Roast chickpeas with oil until crunchy.',{t:20,temp:'210 °C'}],['Dress','Blend cashews, capers, garlic, lemon, yeast and water to a creamy dressing.',{eq:'Blender'}],['Massage','Massage kale with the dressing until silky; top with chickpeas.']],
  nutrition: nut(340,15,18,32,9,4), tags:['high-protein','garden','anti-inflammatory'],
  antiInflammatoryNotes: 'Dark leafy kale, olive oil and garlic.', favourite:true, rating:5 });

R({ title: 'Watermelon & Mint Salad', subtitle: 'Summer on a plate', category: 'Salads', cuisine: 'Mediterranean', mealType: 'Snack',
  description: 'Cool watermelon with mint, lime and a crumble of plant-based feta.',
  prepMinutes: 10, cookMinutes: 0, servings: 4,
  ingredients: [[800,'g','watermelon','cubed'],[100,'g','plant-based feta','crumbled'],[10,'','mint leaves'],[1,'','lime','juiced'],[15,'ml','olive oil']],
  instructions: [['Arrange','Scatter watermelon on a platter.'],['Finish','Top with feta and mint; dress with lime and oil.']],
  nutrition: nut(160,4,8,18,2,15), tags:['raw','summer','quick'],
  eoeNotes: 'Soft and juicy; a refreshing raw dish.' });

R({ title: 'Shaved Fennel & Orange', subtitle: 'Bright winter crunch', category: 'Salads', cuisine: 'Italian', mealType: 'Lunch',
  description: 'Paper-thin fennel with orange segments, olives and a citrus dressing.',
  prepMinutes: 15, cookMinutes: 0, servings: 4,
  ingredients: [[2,'','fennel bulb','shaved'],[2,'','oranges','segmented'],[80,'ml','black olives'],[30,'ml','olive oil'],[15,'ml','lemon juice'],[15,'ml','fresh parsley']],
  instructions: [['Shave','Slice fennel wafer-thin, ideally on a mandoline.'],['Toss','Combine with orange, olives, oil and lemon; scatter parsley.']],
  nutrition: nut(170,3,11,18,5,11), tags:['raw','winter','anti-inflammatory'],
  eoeNotes: 'Crunchy and raw — chew well or slice extra-thin.' });

R({ title: 'Quinoa Tabbouleh', subtitle: 'Herbs first, grain second', category: 'Salads', cuisine: 'Middle Eastern', mealType: 'Lunch',
  description: 'A herb-heavy tabbouleh using protein-rich quinoa instead of bulgur.',
  prepMinutes: 20, cookMinutes: 15, servings: 6,
  ingredients: [[250,'ml','quinoa','cooked, cooled'],[2,'','bunch parsley','finely chopped'],[15,'','mint leaves'],[3,'','tomatoes','diced'],[3,'','spring onion'],[60,'ml','olive oil'],[45,'ml','lemon juice']],
  instructions: [['Chop','Chop the herbs fine — they are the salad, not a garnish.'],['Toss','Combine everything with oil, lemon and salt; rest to meld.']],
  nutrition: nut(220,6,12,24,5,4), tags:['garden','summer','high-protein'],
  bloodSugarNotes: 'Herbs and quinoa keep it low-glycemic.' });

R({ title: 'Roasted Beet & Walnut Salad', subtitle: 'Earthy and jewel-bright', category: 'Salads', cuisine: 'French', mealType: 'Lunch',
  description: 'Sweet roasted beets with toasted walnuts and a mustard vinaigrette over greens.',
  prepMinutes: 15, cookMinutes: 45, servings: 4,
  ingredients: [[600,'g','beets','wrapped, roasted'],[60,'ml','walnuts','toasted'],[100,'g','rocket'],[15,'ml','Dijon mustard'],[30,'ml','olive oil'],[15,'ml','red wine vinegar'],[15,'ml','maple syrup']],
  instructions: [['Roast','Roast beets whole until tender; peel and wedge.',{t:45,temp:'200 °C'}],['Dress','Whisk mustard, oil, vinegar and maple.'],['Plate','Toss rocket with dressing; top with beets and walnuts.']],
  nutrition: nut(260,5,18,22,6,15), tags:['autumn','anti-inflammatory','garden'],
  antiInflammatoryNotes: 'Beets, walnuts and olive oil.' });

R({ title: 'Chickpea Smash "Tuna" Salad', subtitle: 'A taste of the sea, no fish', category: 'Salads', cuisine: 'Canadian', mealType: 'Lunch',
  description: 'Mashed chickpeas with celery, dill and a whisper of dulse for a sandwich-ready salad.',
  prepMinutes: 12, cookMinutes: 0, servings: 4,
  ingredients: [[540,'ml','chickpeas','rinsed'],[2,'','celery','diced'],[3,'','spring onion'],[60,'ml','vegan mayonnaise'],[15,'ml','lemon juice'],[5,'ml','dulse flakes','for the sea'],[15,'ml','fresh dill']],
  instructions: [['Mash','Coarsely mash the chickpeas — keep some texture.'],['Fold','Stir in celery, onion, mayo, lemon, dulse and dill.'],['Serve','Pile on toast, in lettuce cups, or from the bowl.']],
  nutrition: nut(260,10,13,26,8,4), tags:['high-protein','maritime','quick'],
  bloodSugarNotes: 'Fibre-rich chickpeas make a steady lunch.' });

R({ title: 'Thai Green Mango Salad', subtitle: 'Sour, sweet, fiery', category: 'Salads', cuisine: 'Thai', mealType: 'Lunch',
  description: 'Shredded unripe mango with lime, chilli and crushed peanuts.',
  prepMinutes: 20, cookMinutes: 0, servings: 4,
  ingredients: [[2,'','green mango','shredded'],[1,'','carrot','shredded'],[1,'','chilli','sliced'],[45,'ml','lime juice'],[15,'ml','soy sauce'],[15,'ml','maple syrup'],[60,'ml','peanuts','crushed'],[15,'ml','fresh coriander']],
  instructions: [['Dress','Whisk lime, soy and maple.'],['Toss','Toss mango, carrot and chilli in the dressing.'],['Top','Finish with peanuts and coriander.']],
  nutrition: nut(210,6,10,28,5,18), tags:['raw','summer'],
  eoeNotes: 'Crunchy and raw; contains peanut and soy — check tolerance.' });

R({ title: 'Tomato Caprese', subtitle: 'Peak tomato, plant-based', category: 'Salads', cuisine: 'Italian', mealType: 'Lunch',
  description: 'Thick tomato slices with vegan mozzarella, basil and good olive oil.',
  prepMinutes: 10, cookMinutes: 0, servings: 4,
  ingredients: [[4,'','tomatoes','ripe, sliced'],[200,'g','vegan mozzarella','sliced'],[12,'','basil leaves'],[45,'ml','olive oil'],[15,'ml','balsamic vinegar']],
  instructions: [['Layer','Alternate tomato and mozzarella on a plate.'],['Dress','Tuck in basil; drizzle with oil and balsamic; season.']],
  nutrition: nut(280,7,22,12,3,7), tags:['raw','summer','garden'],
  eoeNotes: 'Soft and juicy; a gentle raw dish.', favourite:true, rating:5 });

R({ title: 'Warm Lentil & Roasted Vegetable Salad', subtitle: 'Autumn on a fork', category: 'Salads', cuisine: 'French', mealType: 'Dinner',
  description: 'Puy lentils tossed with roasted roots and a sharp mustard dressing.',
  prepMinutes: 15, cookMinutes: 30, servings: 4,
  ingredients: [[250,'ml','Puy lentils','cooked'],[2,'','carrot','chunked'],[1,'','red onion','wedged'],[1,'','zucchini'],[15,'ml','Dijon mustard'],[45,'ml','olive oil'],[15,'ml','red wine vinegar'],[15,'ml','fresh parsley']],
  instructions: [['Roast','Roast the vegetables in a little oil until soft.',{t:28,temp:'210 °C'}],['Dress','Whisk mustard, oil and vinegar.'],['Toss','Fold lentils, vegetables and dressing; finish with parsley.']],
  nutrition: nut(320,14,16,34,10,7), tags:['high-protein','autumn','garden'],
  bloodSugarNotes: 'Lentils keep this filling and steady.' });

R({ title: 'Smashed Cucumber Sesame Salad', subtitle: 'Bruised, not sliced', category: 'Salads', cuisine: 'Chinese', mealType: 'Snack',
  description: 'Smashed cucumbers that drink up a garlicky sesame-soy dressing.',
  prepMinutes: 12, cookMinutes: 0, servings: 4,
  ingredients: [[3,'','cucumber','smashed'],[2,'clove','garlic'],[30,'ml','soy sauce'],[15,'ml','rice vinegar'],[15,'ml','toasted sesame oil'],[5,'ml','maple syrup'],[10,'ml','sesame seeds']],
  instructions: [['Smash','Bash cucumbers with the flat of a knife; tear into pieces and salt.'],['Dress','Whisk garlic, soy, vinegar, sesame oil and maple; toss.'],['Serve','Scatter sesame seeds.']],
  nutrition: nut(120,3,8,10,2,5), tags:['raw','summer','garden','quick'],
  eoeNotes: 'Crunchy raw cucumber; contains soy and sesame.' });

R({ title: 'Grilled Peach & Rocket', subtitle: 'Char and pepper', category: 'Salads', cuisine: 'Mediterranean', mealType: 'Lunch',
  description: 'Warm grilled peaches over peppery rocket with balsamic and toasted almonds.',
  prepMinutes: 10, cookMinutes: 8, servings: 4,
  ingredients: [[4,'','peaches','halved'],[100,'g','rocket'],[45,'ml','almonds','toasted'],[30,'ml','olive oil'],[15,'ml','balsamic vinegar']],
  instructions: [['Grill','Grill peaches cut-side down until charred and soft.',{t:6}],['Toss','Dress rocket with oil and balsamic.'],['Plate','Top with peaches and almonds.']],
  nutrition: nut(210,4,14,18,4,13), tags:['summer','garden'],
  eoeNotes: 'Peaches turn very soft on the grill.' });

R({ title: 'Picnic Three-Bean Salad', subtitle: 'Make it the day before', category: 'Salads', cuisine: 'Canadian', mealType: 'Lunch',
  description: 'Green beans, kidney and cannellini beans in a tangy maple-mustard dressing.',
  prepMinutes: 15, cookMinutes: 5, servings: 6,
  ingredients: [[250,'g','green beans','blanched'],[400,'g','kidney beans','rinsed'],[400,'g','cannellini beans','rinsed'],[1,'','red onion','diced'],[45,'ml','olive oil'],[30,'ml','apple cider vinegar'],[15,'ml','maple syrup'],[15,'ml','Dijon mustard']],
  instructions: [['Blanch','Blanch green beans briefly; cool.',{t:3}],['Dress','Whisk oil, vinegar, maple and mustard.'],['Marinate','Toss everything; chill a few hours.',{t:120}]],
  nutrition: nut(260,11,10,34,10,8), tags:['high-protein','summer','batch-cooking','freezer-friendly'] });

R({ title: 'Shredded Brussels & Apple Salad', subtitle: 'Autumn shred', category: 'Salads', cuisine: 'Canadian', mealType: 'Lunch',
  description: 'Finely shaved Brussels sprouts with crisp apple, dried cranberries and pecans.',
  prepMinutes: 15, cookMinutes: 0, servings: 4,
  ingredients: [[400,'g','Brussels sprouts','shaved'],[1,'','apple','matchsticks'],[60,'ml','dried cranberries'],[60,'ml','pecans','toasted'],[45,'ml','olive oil'],[15,'ml','lemon juice'],[10,'ml','maple syrup']],
  instructions: [['Shave','Slice sprouts very thin.'],['Dress','Whisk oil, lemon and maple; toss and rest 10 minutes.'],['Top','Fold in apple, cranberries and pecans.']],
  nutrition: nut(250,5,16,24,6,14), tags:['raw','autumn','garden'],
  eoeNotes: 'Raw and crunchy; shave finely and chew well.' });

R({ title: 'Corn, Tomato & Avocado Salad', subtitle: 'August in a bowl', category: 'Salads', cuisine: 'Mexican', mealType: 'Lunch',
  description: 'Sweet raw corn, ripe tomatoes and avocado with lime and coriander.',
  prepMinutes: 12, cookMinutes: 0, servings: 4,
  ingredients: [[500,'ml','sweet corn','raw kernels'],[3,'','tomatoes','diced'],[1,'','avocado','cubed'],[3,'','spring onion'],[1,'','lime'],[30,'ml','olive oil'],[15,'ml','fresh coriander']],
  instructions: [['Combine','Toss corn, tomato, avocado and onion.'],['Dress','Squeeze over lime, drizzle oil, add coriander and salt.']],
  nutrition: nut(230,5,14,26,6,7), tags:['raw','summer','garden'],
  eoeNotes: 'Fresh and raw; soft but for the corn — cook corn briefly if needed.' });

R({ title: 'Roasted Cauliflower & Herb Salad', subtitle: 'Warm and green-flecked', category: 'Salads', cuisine: 'Middle Eastern', mealType: 'Lunch',
  description: 'Golden roasted cauliflower tossed with parsley, mint and a lemony dressing.',
  prepMinutes: 12, cookMinutes: 25, servings: 4,
  ingredients: [[1,'','cauliflower','florets'],[45,'ml','olive oil'],[15,'ml','fresh parsley'],[15,'ml','fresh mint'],[30,'ml','lemon juice'],[60,'ml','pomegranate seeds'],[30,'ml','pine nuts','toasted']],
  instructions: [['Roast','Roast cauliflower in oil until deeply golden.',{t:24,temp:'220 °C'}],['Toss','Fold with herbs, lemon and pomegranate; top with pine nuts.']],
  nutrition: nut(240,6,18,16,5,6), tags:['garden','anti-inflammatory'],
  antiInflammatoryNotes: 'Cauliflower, herbs and olive oil.' });

R({ title: 'Sweet Potato & Black Bean Salad', subtitle: 'Hearty and smoky', category: 'Salads', cuisine: 'Mexican', mealType: 'Lunch',
  description: 'Roasted sweet potato and black beans with lime, cumin and coriander.',
  prepMinutes: 12, cookMinutes: 25, servings: 4,
  ingredients: [[600,'g','sweet potato','cubed'],[540,'ml','black beans','rinsed'],[5,'ml','ground cumin'],[1,'','lime'],[45,'ml','olive oil'],[3,'','spring onion'],[15,'ml','fresh coriander']],
  instructions: [['Roast','Roast sweet potato with cumin and half the oil.',{t:25,temp:'210 °C'}],['Toss','Combine with beans, onion, lime, coriander and the rest of the oil.']],
  nutrition: nut(320,11,10,50,12,9), tags:['high-protein','autumn','batch-cooking'],
  bloodSugarNotes: 'Beans balance the sweet potato for a steady lunch.' });

R({ title: 'Carrot Ribbon & Ginger Salad', subtitle: 'Bright peeler salad', category: 'Salads', cuisine: 'Japanese', mealType: 'Snack',
  description: 'Long carrot ribbons in a zippy ginger-sesame dressing.',
  prepMinutes: 12, cookMinutes: 0, servings: 4,
  ingredients: [[4,'','carrot','peeled into ribbons'],[15,'g','fresh ginger','grated'],[30,'ml','rice vinegar'],[15,'ml','soy sauce'],[15,'ml','toasted sesame oil'],[10,'ml','sesame seeds']],
  instructions: [['Ribbon','Peel carrots into long ribbons.'],['Dress','Whisk ginger, vinegar, soy and sesame oil; toss and rest.'],['Finish','Scatter sesame seeds.']],
  nutrition: nut(120,2,8,12,3,6), tags:['raw','quick','anti-inflammatory'],
  eoeNotes: 'Raw ribbons; soften in the dressing 15 minutes if needed.' });

R({ title: 'Farro & Roasted Squash Salad', subtitle: 'Nutty and filling', category: 'Salads', cuisine: 'Italian', mealType: 'Dinner',
  description: 'Chewy farro with roasted squash, rocket and a maple-balsamic dressing.',
  prepMinutes: 15, cookMinutes: 30, servings: 4,
  ingredients: [[250,'ml','farro','cooked'],[500,'g','squash','cubed'],[80,'g','rocket'],[45,'ml','olive oil'],[15,'ml','balsamic vinegar'],[10,'ml','maple syrup'],[45,'ml','pumpkin seeds']],
  instructions: [['Roast','Roast squash in a little oil until caramelised.',{t:25,temp:'210 °C'}],['Dress','Whisk oil, balsamic and maple.'],['Toss','Combine farro, squash and rocket; top with seeds.']],
  nutrition: nut(340,9,15,44,7,10), tags:['autumn','garden','high-fibre'] });

R({ title: 'Spinach & Strawberry Salad', subtitle: 'Late-spring green and red', category: 'Salads', cuisine: 'Canadian', mealType: 'Lunch',
  description: 'Tender spinach with strawberries, red onion and a balsamic dressing.',
  prepMinutes: 10, cookMinutes: 0, servings: 4,
  ingredients: [[120,'g','spinach'],[250,'g','strawberries','sliced'],[0.5,'','red onion','shaved'],[45,'ml','olive oil'],[15,'ml','balsamic vinegar'],[10,'ml','maple syrup'],[45,'ml','almonds','flaked']],
  instructions: [['Dress','Whisk oil, balsamic and maple.'],['Toss','Combine spinach, strawberries and onion; top with almonds.']],
  nutrition: nut(200,4,14,16,4,10), tags:['raw','spring','summer','garden'],
  eoeNotes: 'Soft leaves and berries; a gentle raw salad.' });

R({ title: 'Panzanella', subtitle: 'Bread salad, sun-warm', category: 'Salads', cuisine: 'Italian', mealType: 'Lunch',
  description: 'Torn sourdough soaked in tomato juices with cucumber, basil and red onion.',
  prepMinutes: 15, cookMinutes: 10, servings: 4,
  ingredients: [[250,'g','sourdough','torn, toasted'],[5,'','tomatoes','very ripe'],[1,'','cucumber'],[0.5,'','red onion'],[12,'','basil leaves'],[60,'ml','olive oil'],[30,'ml','red wine vinegar']],
  instructions: [['Toast','Toast the bread until crisp.',{t:8}],['Salt','Salt the tomatoes to draw out their juices.'],['Toss','Combine everything; rest 20 minutes so the bread drinks the juices.',{t:20}]],
  nutrition: nut(300,6,17,32,4,7), tags:['summer','garden'] });

R({ title: 'Sesame Soba Noodle Salad', subtitle: 'Cool and nutty', category: 'Salads', cuisine: 'Japanese', mealType: 'Lunch',
  description: 'Chilled buckwheat soba with edamame, cucumber and a sesame dressing.',
  prepMinutes: 15, cookMinutes: 8, servings: 4,
  ingredients: [[250,'g','soba noodles'],[200,'g','edamame','shelled'],[1,'','cucumber','julienned'],[2,'','carrot','julienned'],[45,'ml','soy sauce'],[30,'ml','toasted sesame oil'],[15,'ml','rice vinegar'],[15,'ml','sesame seeds']],
  instructions: [['Cook','Boil soba, rinse cold.',{t:6}],['Dress','Whisk soy, sesame oil and vinegar.'],['Toss','Combine noodles, edamame and vegetables; top with sesame.']],
  nutrition: nut(360,15,12,50,6,6), tags:['high-protein'],
  eoeNotes: 'Contains soy and sesame — common triggers; check tolerance.' });

R({ title: 'Chopped Mediterranean Chickpea Salad', subtitle: 'Everything diced small', category: 'Salads', cuisine: 'Greek', mealType: 'Lunch',
  description: 'A finely chopped salad of chickpeas, cucumber, tomato and herbs — scoopable and fresh.',
  prepMinutes: 15, cookMinutes: 0, servings: 4,
  ingredients: [[540,'ml','chickpeas','rinsed'],[1,'','cucumber','diced'],[3,'','tomatoes','diced'],[0.5,'','red onion','diced'],[80,'ml','kalamata olives'],[45,'ml','olive oil'],[30,'ml','lemon juice'],[15,'ml','fresh parsley']],
  instructions: [['Chop','Dice everything to a similar small size.'],['Toss','Combine with olives, oil, lemon, parsley and salt.']],
  nutrition: nut(290,10,17,26,8,6), tags:['raw','high-protein','garden','anti-inflammatory'],
  antiInflammatoryNotes: 'Chickpeas, olive oil and fresh vegetables.', favourite:true, rating:4 });

R({ title: 'Winter Citrus & Avocado Salad', subtitle: 'A sunny January plate', category: 'Salads', cuisine: 'Mediterranean', mealType: 'Lunch',
  description: 'Sliced oranges and grapefruit with avocado, shallot and mint.',
  prepMinutes: 15, cookMinutes: 0, servings: 4,
  ingredients: [[2,'','oranges','sliced'],[1,'','grapefruit','segmented'],[1,'','avocado','sliced'],[1,'','shallot','shaved'],[8,'','mint leaves'],[30,'ml','olive oil'],[10,'ml','maple syrup']],
  instructions: [['Arrange','Fan citrus and avocado on a platter.'],['Finish','Scatter shallot and mint; drizzle oil and maple.']],
  nutrition: nut(230,3,15,24,7,16), tags:['raw','winter','anti-inflammatory'],
  eoeNotes: 'Soft citrus and avocado; a gentle winter salad.' });
