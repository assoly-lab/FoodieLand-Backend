import { Document, Schema, Types } from "mongoose";
import { Category } from "@/interfaces/Category.interface";
import { User } from "@/interfaces/User.interface";

export interface Ingredient {
  title: string;
  items: string[];
}

export interface RecipeImage {
  url: string;
  name: string;
}


export interface DirectionStep {
  order: number;
  title: string;
  description: string;
  image?: RecipeImage;
}

export interface Nutrition {
  calories: Number,
  carbohydrate: Number,
  cholesterol: Number,
  protein: Number,
  totalFat: Number,
}


export interface Recipe extends Document {
  title: string;
  description: string;
  mainCategory: Schema.Types.ObjectId | Category,
  secondaryCategories: Schema.Types.ObjectId[] | Category[],
  author: Types.ObjectId | User;
  publishDate: Date;
  prepTime: number;
  cookTime: number;
  isVegan: boolean;
  mainImage: RecipeImage;
  nutrition?: {
    calories: number;
    carbohydrate: number;
    cholesterol: number;
    protein: number;
    totalFat: number;
  };
  ingredients: {
    sections: {
      title: string;
      items: string[];
    }[];
  };

  directions: DirectionStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeFilters {
  search?: string;
  category?: string;
}