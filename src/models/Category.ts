import { Category as CategoryInterface } from "@/interfaces/Category.interface";
import { model, Schema } from "mongoose";

const CategorySchema = new Schema<CategoryInterface>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true },
);

export const Category = model<CategoryInterface>("Category", CategorySchema);