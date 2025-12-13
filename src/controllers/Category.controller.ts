import { CategoryService } from "@/services/Category.service";
import { NextFunction, Request, Response } from "express";



export class categoryController {
  private static categoryService: CategoryService;
  
  
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try{
      const categories = await this.categoryService.findAll();
      return {
        success: true,
        data: categories,
      }
    }catch(error){
      next(error)
    }
  }
  
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const file = ((req as Express.Request).file) as Express.Multer.File;
      const category = await this.categoryService.create(file, req.body);

      res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, name, description } = req.body; 
      const payload = {
        name,
        description
      }
      const file = ((req as Express.Request).file) as Express.Multer.File;
      const category = await this.categoryService.update(id, file, payload);

      res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.categoryService.delete(id);

      res.json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  
}