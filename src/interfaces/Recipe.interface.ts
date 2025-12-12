import { Document, Schema } from "mongoose";
import { Category } from "@/interfaces/Category.interface";

export interface Ingredient {
  title: string;
  items: string[];
}

export interface DirectionStep {
  order: number;
  text: string;
  image?: string;
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
  mainCategory: Schema.Types.ObjectId | Category,
  secondaryCategories: Schema.Types.ObjectId[] | Category[],
  author: {
    name: string;
    avatar?: string;
  };
  publishDate: Date;
  prepTime: number;
  cookTime: number;
  isVegan: boolean;
  mainImage: string;
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