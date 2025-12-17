import { Document } from "mongoose";


export interface CategoryImage {
  name: string;
  url: string;
}

export interface Category extends Document {
  name: string;
  description: string;
  image: CategoryImage;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryFilters {
  search?: string
}