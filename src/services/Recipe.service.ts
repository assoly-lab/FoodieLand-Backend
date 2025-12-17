import { BadRequestError, NotFoundError } from "@/core/errors/AppErrors";
import { DirectionStep, Recipe, RecipeFilters } from "@/interfaces/Recipe.interface";
import { RecipeRepository } from "@/repositories/Recipe.repository";
import { Types } from "mongoose";


export class RecipeService {
  private baseUrl ;
  private recipeRepository: RecipeRepository;
  
  constructor(){
    this.baseUrl = "upload/recipes";
    this.recipeRepository = new RecipeRepository();
  }
  
  async findAll(filters: RecipeFilters):Promise<Recipe[]> {
    
    return await this.recipeRepository.findAll(filters);
  }
  
  async findById(id: string): Promise<Recipe> {
    const recipe = await this.recipeRepository.findById(id);
    if(!recipe){
      throw new NotFoundError("Recipe not found")
    }
    return recipe
  }
  
  async findOtherRecipes(id: string, limit: number = 3): Promise<Recipe[]> {
    if(!id){
      throw new BadRequestError("Recipe ID is required")
    }
    
    const recipes = await this.recipeRepository.findOtherRecipes(limit, id);
    return recipes
  }

  async findByTitle(title: string): Promise<Recipe> {
    const recipe = await this.recipeRepository.findByTitle(title);
    if(!recipe){
      throw new NotFoundError("Recipe not found")
    }
    return recipe
  }
  
  async findByCategory(catId: string): Promise<Recipe[]> {
    if(!catId){
      throw new BadRequestError("Category ID is required");
    }
    const recipes = await this.recipeRepository.findByCategory(catId);
    return recipes
  }
  
  async pullSecondaryCategory(catId: string): Promise<boolean> {
    if(!catId){
      throw new BadRequestError("Category ID is required");
    }
    const result = await this.recipeRepository.pullSecondaryCategory(catId);
    return result;
  }
  
  async create(userId: Types.ObjectId, fileMap:  Map<string, Express.Multer.File>, data: Partial<Recipe>): Promise<Recipe> {
    
    if(userId){
      throw new BadRequestError("User ID is required");
    }
    
    if(data.title){
      const existingRecipe = await this.recipeRepository.findByTitle(data.title);
      if(existingRecipe){
        throw new BadRequestError("Recipe with the same title already exist");
      }
    }
    if(!fileMap){
      throw new BadRequestError("Recipe image is required");
    }
    
    if(!data.directions){
      throw new BadRequestError("Recipe directions are required");
    }
    
    const mainFile = fileMap.get('mainImage');
    if (!mainFile) throw new BadRequestError("Recipe image is required");
    
    const mainImage = {
       name: mainFile.filename,
       url: `${process.env.HOST_URL}/${this.baseUrl}/${mainFile.filename}`
     };
    
    const directions: DirectionStep[] = data.directions.map((step: DirectionStep) => {
        const stepFile = fileMap.get(`directionImage_${step.order}`);
        return {
          ...step,
          ...( 
            stepFile ? {
              image:{
                name: stepFile.filename,
                url: `${process.env.HOST_URL}/${this.baseUrl}/${stepFile.filename}`
                }
            } : 
            {}
          )
        };
      });

    const recipeData: Partial<Recipe> = {
      ...data,
      mainImage,
      directions,
      author: new Types.ObjectId(userId)
      
    }
    return await this.recipeRepository.create(recipeData);
  }
  
  async update(userId: Types.ObjectId, id: string, fileMap:  Map<string, Express.Multer.File>, data: Partial<Recipe>): Promise<Recipe> {
    
    if(userId){
      throw new BadRequestError("User ID is required");
    }
    const mainFile = fileMap.get('mainImage');
    
    const directions: DirectionStep[] | undefined = data.directions?.map((step: DirectionStep) => {
        const stepFile = fileMap.get(`directionImage_${step.order}`);
        console.log("Step File: ", stepFile)
        return {
          ...step,
          ...( 
            stepFile ? {
              image:{
                name: stepFile.filename,
                url: `${process.env.HOST_URL}/${this.baseUrl}/${stepFile.filename}`
                }
            } : 
            {}
          )
        };
      });

    const recipeData: Partial<Recipe> = {
      ...data,
      ...(mainFile ? {
        mainImage: {
          name: mainFile.filename,
          url: `${process.env.HOST_URL}/${this.baseUrl}/${mainFile.filename}`
        }
      }: {}),
      ...(directions ? {directions} : []),
      author: new Types.ObjectId(userId),
      updatedAt: new Date()
    }
    const recipe = await this.recipeRepository.update(id, recipeData);
    if(!recipe){
      throw new NotFoundError("Recipe not found");
    }
    return recipe;
  }
  
  async deleteByCategory(catId: string): Promise<boolean> {
    if(!catId){
      throw new BadRequestError("Category ID is required");
    }
    const result = await this.recipeRepository.deleteByCategory(catId);
    return !!result;
  }
  
  async delete(id: string): Promise<boolean> {
    const category = await this.recipeRepository.findById(id);
    if (!category) {
      throw new NotFoundError("Recipe not found");
    }
    return await this.recipeRepository.delete(id); 
  }
}