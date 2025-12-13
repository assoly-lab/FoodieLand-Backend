import { Category as CategoryInterface } from "@/interfaces/Category.interface";
import { Category } from "@/models/Category";



export class CategoryRepository {
  
  async create(data: Partial<CategoryInterface>): Promise<CategoryInterface> {
    const category = new Category(data);
    return await category.save();
  }
  
  async findById(id: string): Promise<CategoryInterface | null> {
    const query = Category.findById(id);
    return query.exec();
  }
  
  async findByName(name: string): Promise<CategoryInterface | null> {
    const query = Category.findOne({ name });
    return query.exec();
  }
  
  async findAll(): Promise<CategoryInterface[]> {
    return await Category.find();
  }
  
  async update(id: string, data: Partial<CategoryInterface>): Promise<CategoryInterface | null>{
    return await Category.findByIdAndUpdate(
      id,
      {...data, updatedAt: new Date()},
      { new: true }
    )
  }
  
  async delete(id: string):Promise<boolean> {
    const result = await Category.findByIdAndDelete(id);
    return !!result
  }
}