import { RecipeService } from "@/services/Recipe.service";
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

export class RecipeController {
  private recipeService: RecipeService;

  constructor() {
    this.recipeService = new RecipeService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipes = await this.recipeService.findAll();
      res.status(200).json({
        success: true,
        data: recipes,
      });
    } catch (error) {
      next(error);
    }
  }
  
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const recipe = await this.recipeService.findById(id);
      const otherRecipes = await this.recipeService.findOtherRecipes(String(recipe._id))
  
      res.status(200).json({
        success: true,
        data: {
          recipe,
          otherRecipes
        },
      });
    } catch (error) {
      next(error);
    }
  };
  
  getByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categoryId } = req.params; 
      const recipes = await this.recipeService.findByCategory(categoryId);
  
      res.status(200).json({
        success: true,
        data: recipes,
      });
    } catch (error) {
      next(error);
    }
  }
  
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const files = req.files as Express.Multer.File[];
      const fileMap = new Map<string, Express.Multer.File>();
      files.forEach(file => fileMap.set(file.fieldname, file));
      const recipe = await this.recipeService.create(userId as Types.ObjectId, fileMap, req.body);
      res.status(201).json({
        success: true,
        data: recipe,
      });
    } catch (error) {
      next(error);
    }
  }
  
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const { id } = req.body;
      const files = req.files as Express.Multer.File[];
      const fileMap = new Map<string, Express.Multer.File>();
      files.forEach(file =>{
        console.log("field: ",file.fieldname)
      fileMap.set(file.fieldname, file)
      });
      const recipe = await this.recipeService.update(userId as Types.ObjectId, id, fileMap, req.body);
      res.status(201).json({
        success: true,
        data: recipe,
      });
    } catch (error) {
      next(error);
    }
  }
  
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.recipeService.delete(id);

      res.json({
        success: true,
        message: "Recipe deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}