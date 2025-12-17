// src/utils/seedDatabase.ts

import mongoose, { Types } from 'mongoose';
import fs from 'fs';
import path from 'path';

import { Category as CategoryInterface } from '@/interfaces/Category.interface';
import { Recipe as RecipeInterface, DirectionStep } from '@/interfaces/Recipe.interface'; 
import { User } from '@/models/User';
import { Category } from '@/models/Category';
import { Recipe } from '@/models/Recipe';


const UPLOADS_BASE_URL = "/upload";
const HOST_URL = process.env.HOST_URL || "http://localhost:5001";

const seedDatabase = async () => {
  try {
    const existingCategories = await Category.countDocuments();
    if (existingCategories > 0) {
      console.log('Database already seeded. Skipping seed process.');
      return;
    }
    console.log('Seeding database with initial data...');
    const adminUser = await User.findOneAndUpdate(
      { email: "admin@digitalspeak.com" },
      { 
        name: "digitalspeak", 
        email: "admin@digitalspeak.com", 
        password: "20262026",
        role: "ADMIN" 
      },
      { upsert: true, new: true }
    );
    console.log(`Seeded Admin User: ${adminUser.name}`);
    const categoryData: Partial<CategoryInterface>[] = [
      { name: 'Breakfast', description: 'Start your day right.', image: { name: '1.png', url: `${HOST_URL}${UPLOADS_BASE_URL}/categories/1.png` } },
      { name: 'Vegan', description: 'Plant-based deliciousness.', image: { name: '2.png', url: `${HOST_URL}${UPLOADS_BASE_URL}/categories/2.png` } },
      { name: 'Meat', description: 'Hearty meat dishes.', image: { name: '3.png', url: `${HOST_URL}${UPLOADS_BASE_URL}/categories/3.png` } },
      { name: 'Dessert', description: 'Sweet treats.', image: { name: '4.png', url: `${HOST_URL}${UPLOADS_BASE_URL}/categories/4.png` } },
      { name: 'Lunch', description: 'Mid-day meals.', image: { name: '5.png', url: `${HOST_URL}${UPLOADS_BASE_URL}/categories/5.png` } },
      { name: 'Chocolate', description: 'Anything cocoa.', image: { name: '6.png', url: `${HOST_URL}${UPLOADS_BASE_URL}/categories/6.png` } },
    ];
    const seededCategories = await Category.insertMany(categoryData);
    console.log(`Seeded ${seededCategories.length} categories.`);
    const recipeTitles = [
      'Big and Juicy Wagyu Beef Cheeseburger',
      'Fruity Pancake with Orange & Blueberry',
      'Fresh and Healthy Mixed Mayonnaise Salad',
      'Fresh Lime Roasted Salmon with Ginger Sauce',
      'The Best Easy One Pot Chicken and Rice',
      'Chicken Meatballs with Cream Cheese',
      'Mixed Tropical Fruit Salad with Superfood Boost',
      'Strawberry Oatmeal Pancake with Honey Syrup',
      'The Creamiest Creamy Chicken and Bacon Pasta'
    ];

    const recipeData = recipeTitles.map((title, index) => {
      const imageNumber = index + 1;
      
      const directionSteps: DirectionStep[] = [
        { 
          order: 1, 
          title: `Step 1: Prep ${title.substring(0, 20)}...`, 
          description: `Chop all required ingredients very fine and mix them well in a bowl.`,
          ...(imageNumber % 3 === 0 && {
              image: { 
                  name: '1.png', 
                  url: `${HOST_URL}${UPLOADS_BASE_URL}/directions/1.png` 
              } 
          })
        },
        { order: 2, title: 'Step 2: Cook it up.', description: 'Cook on a medium heat for 10-15 minutes until golden.' },
      ];

      return {
        title,
        description: `A delicious recipe for ${title.toLowerCase()}, perfect for any meal of the day!`,
        mainCategory: seededCategories[index % seededCategories.length]._id, // Cycle categories
        author: adminUser._id,
        prepTime: 10,
        cookTime: 15,
        isVegan: (index % 4 === 0),
        mainImage: { 
            name: `${imageNumber}.png`, 
            url: `${HOST_URL}${UPLOADS_BASE_URL}/recipes/${imageNumber}.png` 
        },
        nutrition: {
            calories: Math.floor(Math.random() * 500) + 100,
            carbohydrate: Math.floor(Math.random() * 50) + 10,
            cholesterol: Math.floor(Math.random() * 100) + 5,
            protein: Math.floor(Math.random() * 30) + 5,
            totalFat: Math.floor(Math.random() * 40) + 5,
        },
        ingredients: [
          { title: 'Main', items: ['2 cups main ingredient', '1/2 cup liquid', 'Spices to taste'] },
          { title: 'Garnish', items: ['Fresh herbs', 'Lemon slice'] }
        ],
        directions: directionSteps,
      };
    });
    await Recipe.insertMany(recipeData);
    console.log(`Seeded ${recipeData.length} recipes.`);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

export default seedDatabase;
