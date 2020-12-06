const mongoose = require('mongoose');
const Recipe = require('./Recipe');
const User = require('./User');
const weeklyMenu = require('./weeklyMenu');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', err => {
  conole.error('Connection error:', err)
}); //db.on()

db.once('open', async () => {
  await Recipe.deleteMany({});
  await weeklyMenu.deleteMany({});
  await User.deleteMany({});

  const recipes = await seedRecipes();
  const weeklyMenus = await seedWeeklyMenus(recipes);
  const users = await seedUsers();

  await printReport();

  console.log(`Created ${recipes.length} recipe(s).`);
  console.log(`Created ${weeklyMenus.length} menu(s).`);
  console.log(`Created ${users.length} users.`);
  console.log(`Done.`);
  process.exit(0);

}); // db.once() initaliser

const seedRecipes = async () => {
  try {
    return await Recipe.create([
      {
        title: 'Beef & Basil Pesto Meatballs',
        description: 'Change what you know about meatballs by adding a dollop of basil pesto to your mixture for an easy flavour boost. Served with a simple tomato sauce on top of spaghetti (and we have not forgotten the cheese!), this is an Italian-inspired bowl everyone will love!',
        tags: [
          {name: 'meat'}
        ],
        allergens: [
          {name: 'Gluten'},
          {name: 'Egg'},
          {name: 'Milk'},
          {name: 'Tree Nuts'},
        ],
        preparationTime: 45,
        cookingDifficulty: 'Easy',
        ingredients: [
          {name: 'Brown onion', quantity: 0.5},
          {name: 'Garlic', quantity: 2, metric: 'clove'},
          {name: 'Basil', quantity: 1, metric: 'punnet'},
          {name: 'Zucchini', quantity: 1},
          {name: 'Beef mince', quantity: 1, metric: 'packet'},
          {name: 'Fine breadcrumbs', quantity: 1, metric: 'packet'},
          {name: 'Basil pesto', quantity: 1, metric: 'sachet'},
          {name: 'Spaghetti pasta', quantity: 1, metric: 'packet'},
          {name: 'Dried oregano', quantity: 0.5, metric: 'sachet'},
          {name: 'Passata', quantity: 1, metric: 'box'},
          {name: 'Beef stock', quantity: 1, metric: 'cube'},
          {name: 'Baby spinach leaves', quantity: 1, metric: 'bag'},
          {name: 'Grated Parmesan cheese', quantity: 1, metric: 'packet'}
        ],
        nutritionalValue: [
          {
            energy: 3636,
            fat: 30.1,
            ofWhichSaturates: 12.4,
            carbohydrates: 90.1,
            ofWhichSugars: 15.1,
            dietaryFibre: 0,
            protein: 53,
            cholestrol: 0,
            sodium: 1229
          }
        ],
        utensils: [
          {name: 'Large pan'},
          {name: 'Large non-stick pan'},
          {name: 'Lid'}
        ],
        instructions: [
          {step: 'Bring a large saucepan of salted water to the boil. Finely chop the brown onion (see ingredients). Finely chop the garlic. Pick and thinly slice the basil leaves. Grate the zucchini.'},
          {step: 'In a medium bowl, combine the beef mince, fine breadcrumbs, salt, egg and basil pesto. Using damp hands, take a heaped spoonful of the beef mixture and gently shape into a small meatball. Transfer to a plate and repeat with the remaining mixture. You should get about 4-5 meatballs per person. TIP: The pesto makes these meatballs extra tender but also delicate, so handle them carefully!'},
          {step: 'Cook the spaghetti in the boiling water until "al dente", 10 minutes. Reserve 1/2 cup pasta water, drain the pasta, then return to the saucepan and drizzle with olive oil to prevent sticking. While the pasta is cooking, heat a drizzle of olive oil in a large frying pan over a medium-high heat. Cook the beef meatballs until browned, 5-6 minutes (the meatballs will continue cooking in step 5). Cook the meatballs in batches if your pan is getting crowded. Transfer to a plate and set aside.'},
          {step: 'Return the frying pan to a medium-high heat and add another drizzle of olive oil, if needed. Add the onion, garlic, dried oregano (see ingredients) and zucchini and cook until softened, 5 minutes. Add the passata, brown sugar, butter and some reserved pasta water (1 1/2 tbs for 2 people / 1/4 cup for 4 people). Crumble the beef stock (1 cube for 2 people / 2 cubes for 4 people) into the sauce and bring to the boil.'},
          {step: 'Add the meatballs to the sauce and cover with a lid or foil. Reduce the heat to medium and simmer until the meatballs are cooked through, 6-7 minutes. Add the baby spinach leaves to the pan, increase the heat to high and cover with a lid or foil until just wilted, 1 minute. Season to taste. TIP: Add more reserved pasta water to your sauce if it is dry!'},
          {step: 'Divide the spaghetti, basil pesto meatballs and sauce between plates. Sprinkle with the grated Parmesan cheese to serve.'}
        ]
      },
      {
        title: 'Butter Chicken with Basmati Rice',
        description: 'Enjoy a favourite Indian diner classic in a zap without the fuss! This ready-to-heat butter chicken is deliciously mild and creamy served up on a bed of jasmine rice.',
        tags: [
          {name: 'meat'}
        ],
        allergens: [
          {name: 'Milk'}
        ],
        preparationTime: 5,
        cookingDifficulty: 'Easy',
        ingredients: [
          {name: 'Butter chicken with basmati rice', quantity: 1}
        ],
        nutritionalValue: [
          {
            energy: 1656,
            fat: 25.6,
            ofWhichSaturates: 12.6,
            carbohydrates: 25.2,
            ofWhichSugars: 4.9,
            dietaryFibre: 0,
            protein: 16.4,
            cholestrol: 0,
            sodium: 861
          }
        ],
        utensils: [],
        instructions: [
          {step: 'Microwave (900W) - remove sleeve and pierce film in several places. Place container in microwave and heat until piping hot, 2-3 mins.'},
          {step: 'Carefully remove from microwave and let stand for 1 min before peeling back the film. Enjoy! Note: Do not reheat or refrigerate once heated.'}
        ]
      }
    ]); // Recipe.create
  } catch (err) {
    console.warn('Error creating recipe(s):', err);
    process.exit(1);
  }
}; // seedRecipes()

const seedWeeklyMenus = async (recipes) => {
  try {
    return await weeklyMenu.create([
      {
        week: 1,
        description: '12 Dec - 18 Dec',
        recipes: [
          recipes[0],
          recipes[1]
        ]
      },
      {
        week: 2,
        description: '19 Dec - 25 Dec',
        recipes: [
          recipes[1]
        ]
      }
    ]); // weeklyMenu.create()
  } catch (err) {
    console.warn('Error creating weekly menus:', err)
    process.exit(1)
  }
}; // seedWeeklyMenus()

const seedUsers = async () => {
  try {
    return await User.create([
      {
        firstName: 'Danny',
        lastName: 'Lai',
        email: 'danny@email.com',
        passwordDigest: bcrypt.hashSync('chicken', 10),
        ratings: []
      },
      {
        firstName: 'Frank',
        lastName: 'Lai',
        email: 'frank@email.com',
        passwordDigest: bcrypt.hashSync('chicken', 10),
        ratings: []
      },
    ]); //
  } catch (err) {
    console.warn('Error creating weekly menus:', err)
    process.exit(1)
  }
}; // seedUsers()

// CLI debugging
const printReport = async () => {

  const recipeCheck = await Recipe.find();

  recipeCheck.forEach(recipe => {
    console.log(recipe);
  }); // recipeCheck.forEach

  const weeklyMenuCheck = await weeklyMenu.find();

  weeklyMenuCheck.forEach(weeklyMenu => {
    console.log(weeklyMenu);
  }); // weeklyMenuCheck.forEach

  const userCheck = await User.find();

    userCheck.forEach(user => {
      console.log(user);
    }); // userCheck.forEach

}; // printReport()
