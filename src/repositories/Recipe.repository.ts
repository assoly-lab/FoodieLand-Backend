import { RecipeFilters, Recipe as RecipeInterface } from "@/interfaces/Recipe.interface";
import { Recipe } from "@/models/Recipe";
import { Types } from "mongoose";


export class RecipeRepository {
  
  async findById(id: string): Promise<RecipeInterface | null> {
    const query = Recipe.findById(id).populate("author mainCategory secondaryCategories");
    return query.exec();
  }
  
  async findByTitle(title: string): Promise<RecipeInterface | null> {
    const query = Recipe.findOne({ title }).populate("author mainCategory secondaryCategories");
    return query.exec();
  }
  
  async findByCategory(catId: string): Promise<RecipeInterface[]> {
    const query = Recipe.find({ mainCategory: catId }).populate("author mainCategory secondaryCategories");
    return query.exec();
  }
  
  async findOtherRecipes(limit: number, currentRecipeId?: string): Promise<RecipeInterface[]>  {
    
      const pipeline: any[] = [];
      if (currentRecipeId) {
        pipeline.push({ $match: { _id: { $ne: currentRecipeId } } });
      }
      pipeline.push({ $sample: { size: limit } });
      pipeline.push({ 
        $lookup: { 
          from: 'categories',
          localField: 'mainCategory', 
          foreignField: '_id', 
          as: 'mainCategory' 
        } 
      });
      pipeline.push({ $unwind: '$mainCategory' });
      pipeline.push({ 
          $lookup: { 
            from: 'categories', 
            localField: 'secondaryCategories', 
            foreignField: '_id', 
            as: 'secondaryCategories' 
          } 
        });
      pipeline.push({ 
        $lookup: { 
          from: 'users',
          localField: 'author', 
          foreignField: '_id', 
          as: 'author' 
        } 
      });
      pipeline.push({ $unwind: '$author' });
      pipeline.push({
        $project: {
            "author.password": 0,
            "author.email": 0,
        }
      });
    
      return await Recipe.aggregate(pipeline);
  }
  
  async findAll(filters?: RecipeFilters): Promise<RecipeInterface[]> {
    const query: any = {};
    if (filters?.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }
    if (filters?.category) {
      query.mainCategory = new Types.ObjectId(filters.category);
    }
    return await Recipe.find(query).populate("author mainCategory secondaryCategories");
  }
  
  async create(data: Partial<RecipeInterface>): Promise<RecipeInterface> {
    const recipe = new Recipe(data);
    return (await recipe.save()).populate("author mainCategory secondaryCategories");
  }
  
  async pullSecondaryCategory(catId: string): Promise<boolean> {
    const result = await Recipe.updateMany(
       { secondaryCategories: catId as any },
       { $pull: { secondaryCategories: catId } }
     );
    return !!result;
  }
  
  async deleteByCategory(catId: string): Promise<boolean> {
    const result = await Recipe.deleteMany({ mainCategory: catId });
    return !!result;
  }
  
  async update(id: string, data: Partial<RecipeInterface>): Promise<RecipeInterface | null>{
    return await Recipe.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true }
    ).populate("author mainCategory secondaryCategories");
  }
  
  async delete(id: string):Promise<boolean> {
    const result = await Recipe.findByIdAndDelete(id);
    return !!result
  }
}