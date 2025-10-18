const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
require('dotenv').config();

const sampleRecipes = [
  // Indian Recipes
  {
    title: "Butter Chicken",
    description: "Succulent chicken in a creamy tomato gravy, a North Indian classic.",
    category: "indian",
    ingredients: [
      { name: "Chicken", amount: "500", unit: "g" },
      { name: "Tomatoes", amount: "4", unit: "medium" },
      { name: "Onions", amount: "2", unit: "medium" },
      { name: "Ginger Garlic Paste", amount: "2", unit: "tbsp" },
      { name: "Heavy Cream", amount: "1/2", unit: "cup" },
      { name: "Butter", amount: "3", unit: "tbsp" },
      { name: "Garam Masala", amount: "1", unit: "tsp" },
      { name: "Red Chili Powder", amount: "1", unit: "tsp" },
      { name: "Turmeric", amount: "1/2", unit: "tsp" },
      { name: "Salt", amount: "to taste", unit: "" }
    ],
    instructions: [
      { step: 1, description: "Marinate chicken with yogurt, ginger-garlic paste, and spices for 30 minutes." },
      { step: 2, description: "Cook chicken until golden brown and set aside." },
      { step: 3, description: "Make tomato gravy by cooking onions, tomatoes, and spices." },
      { step: 4, description: "Blend the gravy and add cream and butter." },
      { step: 5, description: "Add cooked chicken and simmer for 10 minutes." }
    ],
    prepTime: 30,
    cookTime: 45,
    servings: 4,
    difficulty: "medium",
    imageUrl: "assets/Images/chiken.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=a03U45jFxOI&pp=ygUVYnV0dGVyIGNoaWNrZW4gcmVjaXBl",
    isPremium: false,
    tags: ["chicken", "curry", "north-indian", "non-vegetarian"],
    nutrition: {
      calories: 420,
      protein: 35,
      carbs: 12,
      fat: 28,
      fiber: 3
    }
  },
  {
    title: "Masala Dosa",
    description: "South Indian crispy rice crepe filled with spiced potato mash.",
    category: "indian",
    ingredients: [
      { name: "Rice", amount: "2", unit: "cups" },
      { name: "Urad Dal", amount: "1/2", unit: "cup" },
      { name: "Potatoes", amount: "4", unit: "medium" },
      { name: "Onions", amount: "2", unit: "medium" },
      { name: "Green Chilies", amount: "3", unit: "" },
      { name: "Mustard Seeds", amount: "1", unit: "tsp" },
      { name: "Curry Leaves", amount: "10", unit: "" },
      { name: "Turmeric", amount: "1/2", unit: "tsp" },
      { name: "Salt", amount: "to taste", unit: "" }
    ],
    instructions: [
      { step: 1, description: "Soak rice and dal separately for 4-6 hours." },
      { step: 2, description: "Grind to make smooth batter and ferment overnight." },
      { step: 3, description: "Boil potatoes and mash them." },
      { step: 4, description: "Make potato masala with onions, spices, and curry leaves." },
      { step: 5, description: "Make thin dosas and fill with potato masala." }
    ],
    prepTime: 480,
    cookTime: 30,
    servings: 6,
    difficulty: "hard",
    imageUrl: "assets/Images/masala.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=mDqkxZ3UVzc&pp=ygULbWFzYWxhIGRvc2E%3D",
    isPremium: false,
    tags: ["dosa", "south-indian", "vegetarian", "fermented"],
    nutrition: {
      calories: 280,
      protein: 8,
      carbs: 52,
      fat: 4,
      fiber: 6
    }
  },
  {
    title: "Rogan Josh",
    description: "Kashmiri-style lamb curry with aromatic spices and yogurt base.",
    category: "indian",
    ingredients: [
      { name: "Lamb", amount: "750", unit: "g" },
      { name: "Yogurt", amount: "1/2", unit: "cup" },
      { name: "Onions", amount: "3", unit: "large" },
      { name: "Ginger Garlic Paste", amount: "2", unit: "tbsp" },
      { name: "Kashmiri Red Chili", amount: "2", unit: "tbsp" },
      { name: "Fennel Seeds", amount: "1", unit: "tsp" },
      { name: "Cinnamon", amount: "1", unit: "inch" },
      { name: "Cardamom", amount: "4", unit: "" },
      { name: "Cloves", amount: "4", unit: "" },
      { name: "Bay Leaves", amount: "2", unit: "" }
    ],
    instructions: [
      { step: 1, description: "Marinate lamb with yogurt and spices for 2 hours." },
      { step: 2, description: "Fry onions until golden brown and make paste." },
      { step: 3, description: "Cook marinated lamb with onion paste." },
      { step: 4, description: "Add whole spices and simmer for 1 hour." },
      { step: 5, description: "Garnish with fresh coriander and serve hot." }
    ],
    prepTime: 120,
    cookTime: 90,
    servings: 6,
    difficulty: "hard",
    imageUrl: "assets/Images/roganjosh.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=ZaZNZdehT0E&pp=ygUKcm9nYW4gam9zaA%3D%3D",
    isPremium: true,
    tags: ["lamb", "kashmiri", "curry", "non-vegetarian", "spicy"],
    nutrition: {
      calories: 380,
      protein: 32,
      carbs: 8,
      fat: 24,
      fiber: 2
    }
  },

  // Italian Recipes
  {
    title: "Spaghetti Carbonara",
    description: "Creamy pasta with pancetta and parmesan.",
    category: "italian",
    ingredients: [
      { name: "Spaghetti", amount: "400", unit: "g" },
      { name: "Pancetta", amount: "150", unit: "g" },
      { name: "Eggs", amount: "4", unit: "large" },
      { name: "Parmesan Cheese", amount: "100", unit: "g" },
      { name: "Black Pepper", amount: "1", unit: "tsp" },
      { name: "Salt", amount: "to taste", unit: "" }
    ],
    instructions: [
      { step: 1, description: "Cook spaghetti according to package directions." },
      { step: 2, description: "Fry pancetta until crispy." },
      { step: 3, description: "Whisk eggs with parmesan and black pepper." },
      { step: 4, description: "Combine hot pasta with pancetta and egg mixture." },
      { step: 5, description: "Toss quickly to create creamy sauce." }
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: "medium",
    imageUrl: "assets/Images/spaghetti.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=TLpflXrGoEI&pp=ygUQc3BhZ2hldHRpIHJlY2lwZQ%3D%3D",
    isPremium: false,
    tags: ["pasta", "italian", "carbonara", "quick"],
    nutrition: {
      calories: 520,
      protein: 24,
      carbs: 58,
      fat: 22,
      fiber: 2
    }
  },
  {
    title: "Margherita Pizza",
    description: "Classic pizza with tomato, mozzarella & basil.",
    category: "italian",
    ingredients: [
      { name: "Pizza Dough", amount: "1", unit: "ball" },
      { name: "Tomato Sauce", amount: "1/2", unit: "cup" },
      { name: "Fresh Mozzarella", amount: "200", unit: "g" },
      { name: "Fresh Basil", amount: "10", unit: "leaves" },
      { name: "Olive Oil", amount: "2", unit: "tbsp" },
      { name: "Salt", amount: "to taste", unit: "" }
    ],
    instructions: [
      { step: 1, description: "Preheat oven to 500°F (260°C)." },
      { step: 2, description: "Roll out pizza dough on floured surface." },
      { step: 3, description: "Spread tomato sauce and top with mozzarella." },
      { step: 4, description: "Bake for 10-12 minutes until golden." },
      { step: 5, description: "Top with fresh basil and drizzle with olive oil." }
    ],
    prepTime: 20,
    cookTime: 12,
    servings: 4,
    difficulty: "easy",
    imageUrl: "assets/Images/pizza.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=vcfNpDtVqOw&pp=ygUQbWFyZ2hlcml0YSBwaXp6YQ%3D%3D",
    isPremium: false,
    tags: ["pizza", "italian", "vegetarian", "classic"],
    nutrition: {
      calories: 320,
      protein: 14,
      carbs: 42,
      fat: 12,
      fiber: 3
    }
  },

  // Healthy Recipes
  {
    title: "Green Salad",
    description: "Fresh veggies with light dressing.",
    category: "healthy",
    ingredients: [
      { name: "Mixed Greens", amount: "4", unit: "cups" },
      { name: "Cherry Tomatoes", amount: "1", unit: "cup" },
      { name: "Cucumber", amount: "1", unit: "medium" },
      { name: "Avocado", amount: "1", unit: "" },
      { name: "Red Onion", amount: "1/4", unit: "" },
      { name: "Olive Oil", amount: "3", unit: "tbsp" },
      { name: "Lemon Juice", amount: "2", unit: "tbsp" },
      { name: "Salt & Pepper", amount: "to taste", unit: "" }
    ],
    instructions: [
      { step: 1, description: "Wash and chop all vegetables." },
      { step: 2, description: "Make dressing with olive oil, lemon juice, salt, and pepper." },
      { step: 3, description: "Toss greens with half the dressing." },
      { step: 4, description: "Add tomatoes, cucumber, and avocado." },
      { step: 5, description: "Drizzle remaining dressing and serve immediately." }
    ],
    prepTime: 15,
    cookTime: 1,
    servings: 4,
    difficulty: "easy",
    imageUrl: "assets/Images/salad.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=ln_P2jNCSA0&pp=ygULZ3JlZW4gc2FsYWQ%3D",
    isPremium: false,
    tags: ["salad", "healthy", "vegetarian", "fresh", "low-calorie"],
    nutrition: {
      calories: 120,
      protein: 3,
      carbs: 8,
      fat: 10,
      fiber: 5
    }
  },
  {
    title: "Fruit Smoothie",
    description: "Refreshing blend of fruits and yogurt.",
    category: "healthy",
    ingredients: [
      { name: "Banana", amount: "1", unit: "large" },
      { name: "Strawberries", amount: "1/2", unit: "cup" },
      { name: "Blueberries", amount: "1/2", unit: "cup" },
      { name: "Greek Yogurt", amount: "1/2", unit: "cup" },
      { name: "Honey", amount: "1", unit: "tbsp" },
      { name: "Almond Milk", amount: "1", unit: "cup" },
      { name: "Ice Cubes", amount: "1/2", unit: "cup" }
    ],
    instructions: [
      { step: 1, description: "Add all ingredients to blender." },
      { step: 2, description: "Blend on high speed for 1-2 minutes." },
      { step: 3, description: "Add more liquid if too thick." },
      { step: 4, description: "Taste and adjust sweetness if needed." },
      { step: 5, description: "Pour into glasses and serve immediately." }
    ],
    prepTime: 5,
    cookTime: 1,
    servings: 2,
    difficulty: "easy",
    imageUrl: "assets/Images/smoothie.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=yFhu3dm0224&pp=ygUWZnJ1aXQgc21vb3RoaWUgcmVjaXBlcw%3D%3D",
    isPremium: false,
    tags: ["smoothie", "healthy", "vegetarian", "breakfast", "refreshing"],
    nutrition: {
      calories: 180,
      protein: 8,
      carbs: 35,
      fat: 2,
      fiber: 4
    }
  },
  {
    title: "Sushi",
    description: "Traditional Japanese rice rolls with fresh fish and vegetables.",
    category: "japanese",
    ingredients: [
      { name: "Sushi Rice", amount: "2", unit: "cups" },
      { name: "Water", amount: "3", unit: "cups" },
      { name: "Rice Vinegar", amount: "1/4", unit: "cup" },
      { name: "Sugar", amount: "2", unit: "tbsp" },
      { name: "Salt", amount: "1", unit: "tsp" },
      { name: "Nori Sheets", amount: "8", unit: "sheets" },
      { name: "Sashimi-grade Fish", amount: "1/2", unit: "lb" },
      { name: "Cucumber", amount: "1", unit: "medium" },
      { name: "Avocado", amount: "1", unit: "" },
      { name: "Wasabi", amount: "1", unit: "tbsp" },
      { name: "Soy Sauce", amount: "1/4", unit: "cup" }
    ],
    instructions: [
      { step: 1, description: "Rinse rice until water runs clear, then cook with water." },
      { step: 2, description: "Mix vinegar, sugar, and salt. Fold into cooked rice." },
      { step: 3, description: "Cut fish and vegetables into thin strips." },
      { step: 4, description: "Place nori on bamboo mat, spread rice, add fillings." },
      { step: 5, description: "Roll tightly, slice, and serve with wasabi and soy sauce." }
    ],
    prepTime: 45,
    cookTime: 30,
    servings: 4,
    difficulty: "hard",
    imageUrl: "assets/Images/sushi.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=Jup6quVqy0s",
    isPremium: false,
    tags: ["sushi", "japanese", "seafood", "rice", "traditional"],
    nutrition: {
      calories: 350,
      protein: 25,
      carbs: 45,
      fat: 8,
      fiber: 2
    }
  },
  {
    title: "Tempura",
    description: "Light and crispy Japanese fried vegetables and seafood.",
    category: "japanese",
    ingredients: [
      { name: "All-purpose Flour", amount: "1", unit: "cup" },
      { name: "Egg", amount: "1", unit: "large" },
      { name: "Ice-cold Water", amount: "1", unit: "cup" },
      { name: "Salt", amount: "1/4", unit: "tsp" },
      { name: "Mixed Vegetables", amount: "2", unit: "cups" },
      { name: "Shrimp", amount: "1/2", unit: "lb" },
      { name: "Vegetable Oil", amount: "2", unit: "cups" },
      { name: "Tempura Sauce", amount: "1/2", unit: "cup" }
    ],
    instructions: [
      { step: 1, description: "Mix flour, egg, cold water, and salt for batter." },
      { step: 2, description: "Cut vegetables into bite-sized pieces." },
      { step: 3, description: "Heat oil to 350°F (175°C)." },
      { step: 4, description: "Dip ingredients in batter and fry until golden." },
      { step: 5, description: "Drain on paper towels and serve with tempura sauce." }
    ],
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: "medium",
    imageUrl: "assets/Images/temp.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=8x8x8x8x8x8",
    isPremium: false,
    tags: ["tempura", "japanese", "fried", "vegetables", "seafood"],
    nutrition: {
      calories: 280,
      protein: 15,
      carbs: 25,
      fat: 12,
      fiber: 3
    }
  },
  {
    title: "Ramen",
    description: "Rich and flavorful Japanese noodle soup with various toppings.",
    category: "japanese",
    ingredients: [
      { name: "Ramen Noodles", amount: "4", unit: "servings" },
      { name: "Chicken Broth", amount: "6", unit: "cups" },
      { name: "Soy Sauce", amount: "3", unit: "tbsp" },
      { name: "Miso Paste", amount: "2", unit: "tbsp" },
      { name: "Garlic", amount: "3", unit: "cloves" },
      { name: "Ginger", amount: "1", unit: "inch" },
      { name: "Pork Belly", amount: "200", unit: "g" },
      { name: "Soft-boiled Eggs", amount: "4", unit: "" },
      { name: "Green Onions", amount: "4", unit: "" },
      { name: "Nori", amount: "4", unit: "sheets" }
    ],
    instructions: [
      { step: 1, description: "Simmer chicken broth with soy sauce, miso, garlic, and ginger." },
      { step: 2, description: "Cook pork belly until tender and slice thinly." },
      { step: 3, description: "Boil eggs for 6 minutes, then cool and peel." },
      { step: 4, description: "Cook ramen noodles according to package directions." },
      { step: 5, description: "Assemble bowls with noodles, broth, pork, eggs, and toppings." }
    ],
    prepTime: 30,
    cookTime: 60,
    servings: 4,
    difficulty: "medium",
    imageUrl: "assets/Images/ramen.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=8x8x8x8x8x8",
    isPremium: false,
    tags: ["ramen", "japanese", "noodles", "soup", "comfort-food"],
    nutrition: {
      calories: 450,
      protein: 30,
      carbs: 40,
      fat: 20,
      fiber: 3
    }
  }
];

async function seedRecipes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cookverse');
    console.log('✅ Connected to MongoDB');

    // Clear existing recipes
    await Recipe.deleteMany({});
    console.log('🗑️  Cleared existing recipes');

    // Insert sample recipes
    const recipes = await Recipe.insertMany(sampleRecipes);
    console.log(`🌱 Seeded ${recipes.length} recipes successfully`);

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error seeding recipes:', error);
    process.exit(1);
  }
}

// Run the seed function
seedRecipes();
