import { CategoryImage, Category as CategoryInterface } from "@/interfaces/Category.interface";
import { model, Schema } from "mongoose";

const CategoryImageSchema = new Schema<CategoryImage>(
  {
    url: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

const CategorySchema = new Schema<CategoryInterface>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: CategoryImageSchema,
  },
  { timestamps: true },
);

export const Category = model<CategoryInterface>("Category", CategorySchema);