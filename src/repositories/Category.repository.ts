import { Category as CategoryInterface } from "@/interfaces/Category.interface";
import { Category } from "@/models/Category";
import { RecipeService } from "@/services/Recipe.service";
import path from "path";
import fs from "fs"



export class CategoryRepository {
  private recipeService: RecipeService;

  constructor(){
    this.recipeService = new RecipeService();
  }
  
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
  
  
  async findAll(search: string): Promise<CategoryInterface[]> {
    const query: any = {}
    if(search) query.name = { $regex: search, $options: 'i' }
    return await Category.find(query);
  }
  
  async update(id: string, data: Partial<CategoryInterface>): Promise<CategoryInterface | null>{
    return await Category.findByIdAndUpdate(
      id,
      {...data, updatedAt: new Date()},
      { new: true }
    )
  }
  
  async delete(catId: string):Promise<boolean> {
    
    const recipesToDelete = await this.recipeService.findByCategory(catId);
    if (recipesToDelete && recipesToDelete.length > 0) {
      recipesToDelete.forEach((recipe) => {
          if (recipe.mainImage?.name) {
            const mainImagePath = path.join(__dirname, "../../uploads/recipes", recipe.mainImage.name);
            if (fs.existsSync(mainImagePath)) fs.unlinkSync(mainImagePath);
          }
          recipe.directions.forEach((step) => {
            if (step.image?.name) {
              const stepImagePath = path.join(__dirname, "../../uploads/recipes", step.image.name);
              if (fs.existsSync(stepImagePath)) fs.unlinkSync(stepImagePath);
            }
          });
        });
    }
    await this.recipeService.pullSecondaryCategory(catId);
    await this.recipeService.deleteByCategory(catId);
    const result = await Category.findByIdAndDelete(catId);
    return !!result
  }
}