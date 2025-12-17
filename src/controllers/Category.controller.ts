import { CategoryService } from "@/services/Category.service";
import { NextFunction, Request, Response } from "express";

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.findAll();
      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = (req as Express.Request).file as Express.Multer.File;
      const category = await this.categoryService.create(file, req.body);

      res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, name, description } = req.body;
      const payload = {
        name,
        description,
      };
      const file = (req as Express.Request).file as Express.Multer.File;
      const category = await this.categoryService.update(id, file, payload);

      res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
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
