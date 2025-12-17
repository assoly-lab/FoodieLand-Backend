import { CategoryController } from "@/controllers/Category.controller";
import { validateAuth } from "@/middlewares/auth.middleware";
import { categoryUploadFiles, validateCreateCategory, validateUpdateCategory } from "@/middlewares/category.middleware";
import express from "express";


const router = express.Router();
const categoryController = new CategoryController();

// router.use(validateAuth);

router.get('/' ,categoryController.getAll);

router.post('/', categoryUploadFiles, validateCreateCategory, categoryController.create)

router.put('/:id', categoryUploadFiles, validateUpdateCategory, categoryController.update)

router.delete('/:id', categoryController.delete)

export default router;

