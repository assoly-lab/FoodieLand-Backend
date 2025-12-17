import {
  DirectionStep,
  Ingredient,
  Nutrition,
  RecipeImage,
  Recipe as RecipeInterface,
} from "@/interfaces/Recipe.interface";
import { model, Schema } from "mongoose";


const RecipeImageSchema = new Schema<RecipeImage>(
  {
    url: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

export const NutritionSchema = new Schema<Nutrition>(
  {
    calories: Number,
    carbohydrate: Number,
    cholesterol: Number,
    protein: Number,
    totalFat: Number,
  },
  { _id: false },
);

export const IngredientSectionSchema = new Schema<Ingredient>(
  {
    title: { type: String, required: true },
    items: [{ type: String, required: true }],
  },
  { _id: false },
);

const DirectionSchema = new Schema<DirectionStep>(
  {
    order: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: RecipeImageSchema
  },
  { _id: false },
);

export const RecipeSchema = new Schema<RecipeInterface>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    mainCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    secondaryCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      }
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    publishDate: { type: Date, default: Date.now },
    prepTime: Number,
    cookTime: Number,
    mainImage: RecipeImageSchema,
    nutrition: NutritionSchema,
    ingredients: [IngredientSectionSchema],
    directions: [DirectionSchema],
  },
  { timestamps: true },
);

export const Recipe = model<RecipeInterface>("Recipe", RecipeSchema);
