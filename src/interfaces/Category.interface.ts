

export interface Category extends Document {
  name: string;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}