import {
  DirectionStep,
  Ingredient,
  Nutrition,
  Recipe as RecipeInterface,
} from "@/interfaces/Recipe.interface";
import { model, Schema } from "mongoose";

export const NutritionSchema = new Schema<Nutrition>({
  calories: Number,
  carbohydrate: Number,
  cholesterol: Number,
  protein: Number,
  totalFat: Number,
});

export const IngredientSectionSchema = new Schema<Ingredient>({
  title: { type: String, required: true },
  items: [{ type: String, required: true }],
});

const DirectionSchema = new Schema<DirectionStep>({
  order: { type: Number, required: true },
  text: { type: String, required: true },
});

export const RecipeSchema = new Schema<RecipeInterface>(
  {
    title: { type: String, required: true },
    mainCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    secondaryCategories: [{
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    }],
    author: {
      name: { type: String, required: true },
      avatar: { type: String },
    },
    publishDate: { type: Date, default: Date.now },
    prepTime: Number,
    cookTime: Number,
    isVegan: Boolean,
    mainImage: { type: String, required: true },
    nutrition: NutritionSchema,
    ingredients: {
      sections: [IngredientSectionSchema],
    },
    directions: [DirectionSchema],
  },
  { timestamps: true },
);

export const Recipe = model<RecipeInterface>("Recipe", RecipeSchema);
