import { RecipeController } from "@/controllers/Recipe.controller";
import { validateAuth } from "@/middlewares/auth.middleware";
import { createRecipeValidator, getRecipeValidator, parseMultipartToJson, recipeUploadFiles, updateRecipeValidator } from "@/middlewares/recipe.middleware";
import express from "express";


const router = express.Router();
const recipeController = new RecipeController();

// router.use(validateAuth);

router.get('/' ,recipeController.getAll);

router.get("/:id", getRecipeValidator, recipeController.getById);

router.post('/', recipeUploadFiles, parseMultipartToJson, createRecipeValidator, recipeController.create)

router.get("/category/:categoryId", recipeController.getByCategory);

router.put('/:id', recipeUploadFiles, parseMultipartToJson, updateRecipeValidator, recipeController.update)

router.delete('/:id', recipeController.delete)

export default router;

