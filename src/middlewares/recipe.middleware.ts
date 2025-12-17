import { Category } from "@/interfaces/Category.interface";
import { validateRequest } from "@/middlewares/validation.middleware";
import { NextFunction, Request, Response } from "express";
import { body, param } from "express-validator";
import { isValidObjectId } from "mongoose";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/recipes/"));
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

export const recipeUploadFiles = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).any();

export const createRecipeValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("mainCategory")
    .notEmpty()
    .withMessage("Main category is required")
    .custom((value) => isValidObjectId(value))
    .withMessage("Invalid Main Category ID"),

  body("secondaryCategories")
    .optional()
    .isArray()
    .withMessage("Secondary categories must be an array")
    .custom((categories: Category[]) => categories.every((cat) => isValidObjectId(cat._id)))
    .withMessage("One or more Secondary Category IDs are invalid"),

  body("prepTime")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Prep time must be a positive number"),
  body("cookTime")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Cook time must be a positive number"),

  body("nutrition").optional().isObject(),
  body("nutrition.calories").optional().isNumeric(),
  body("nutrition.protein").optional().isNumeric(),

  body("ingredients")
    .isArray({ min: 1 })
    .withMessage("At least one ingredient is required"),
  body("ingredients.*.title")
    .notEmpty()
    .withMessage("Title is required"),
  body("ingredients.*.items")
    .isArray({ min: 1 })
    .withMessage("Each ingredient must have at least one item"),
  body("ingredients.sections.*.items.*")
    .trim()
    .notEmpty()
    .withMessage("Ingredient item cannot be empty"),

  body("directions")
    .isArray({ min: 1 })
    .withMessage("At least one direction step is required"),
  body("directions.*.order")
    .isInt({ min: 1 })
    .withMessage("Step order must be a number"),
  body("directions.*.title")
    .trim()
    .notEmpty()
    .withMessage("Step title is required"),
  body("directions.*.description")
    .trim()
    .notEmpty()
    .withMessage("Step description is required"),
  validateRequest,
];

export const updateRecipeValidator = [
  param("id")
    .if((value, { req }) => req.method === "PUT")
    .isMongoId()
    .withMessage("Invalid Recipe ID in URL"),

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title too long"),

  body("mainCategory")
    .notEmpty()
    .withMessage("Main category is required")
    .custom((value: Category | string) =>{
     if(typeof value ==='object'){
       return isValidObjectId(value._id)
     }else{
       return isValidObjectId(value)
       
     }
      })
    .withMessage("Invalid Main Category ID"),

  body("secondaryCategories")
    .optional()
    .isArray()
    .withMessage("Secondary categories must be an array")
    .custom((categories: Category[]) => categories.every((cat) => isValidObjectId(cat._id)))
    .withMessage("One or more Secondary Category IDs are invalid"),

  body("prepTime")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Prep time must be a positive number"),
  body("cookTime")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Cook time must be a positive number"),

  body("nutrition").optional().isObject(),
  body("nutrition.calories").optional().isNumeric(),
  body("nutrition.protein").optional().isNumeric(),

  body("ingredients")
    .isArray({ min: 1 })
    .withMessage("At least one ingredient section is required"),
  body("ingredients.*.title")
    .notEmpty()
    .withMessage("Ingredient title is required"),
  body("ingredients.*.items")
    .isArray({ min: 1 })
    .withMessage("Each ingredient section must have at least one item"),
  body("ingredients.*.items.*")
    .trim()
    .notEmpty()
    .withMessage("Ingredient item cannot be empty"),

  body("directions")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one direction step is required"),
  body("directions.*.order")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Step order must be a number"),
  body("directions.*.title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Step title is required"),
  body("directions.*.description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Step description is required"),
  validateRequest,
];

export const getRecipeValidator = [
  param("id")
    .if((value, { req }) => req.method === "GET")
    .isMongoId()
    .withMessage("Invalid Recipe ID in URL"),
  validateRequest
]


export const parseMultipartToJson = (req: Request, res: Response, next: NextFunction) => {
  const jsonFields = ['mainCategory', 'secondaryCategories', 'nutrition', 'ingredients', 'directions'];
  
  jsonFields.forEach(field => {
    if (req.body[field] && typeof req.body[field] === 'string') {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (e) {
        next(e)
      }
    }
  });
  next();
};