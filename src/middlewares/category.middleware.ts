import { body, param } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { validateRequest } from './validation.middleware';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads/categories/'));
    },
    filename: function (req, file, cb) {
        const uniqueName = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

export const categoryUploadFiles = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
}).single("image")


export const validateCreateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),
  validateRequest,
];

export const validateUpdateCategory = [
  param("id")
    .if((value, { req }) => req.method === "PUT")
    .isMongoId()
    .withMessage("Invalid Category ID in URL"),
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name is required"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description is required"),
  validateRequest,
];