import { body } from "express-validator";
import { validateRequest } from "@/middlewares/validation.middleware";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "@/core/errors/AppErrors";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/config/auth.config";
import { User } from "@/models/User";
import { User as UserInterface } from "@/interfaces/User.interface";
import { v4 as uuidv4 } from 'uuid';
import multer from "multer";
import path from "path";

declare global {
  namespace Express {
    interface Request {
      user?: UserInterface;
    }
  }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads/avatars/'));
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

export const avatarImageUpload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
}).single("avatar")


export const validateRegister = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  validateRequest,
];

export const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .custom((value) => {
      // Check if it's a valid email or phone number
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!isEmail) {
        throw new Error("Please enter a valid email.");
      }
      return true;
    }),
  body("password").notEmpty().withMessage("Password is required"),
  validateRequest,
];

export const validateAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("Authentication required");
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).exec();
    if (!user) {
      throw new UnauthorizedError("User not found or inactive");
    }
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      console.log(error);
      next(new UnauthorizedError("Invalid token"));
    }
  }
}