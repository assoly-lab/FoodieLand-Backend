import { AuthController } from "@/controllers/Auth.controller";
import { avatarImageUpload, validateAuth, validateLogin, validateRegister } from "@/middlewares/auth.middleware";
import express from "express";


const router = express.Router();

const authController = new AuthController();

router.post('/register', avatarImageUpload, validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);

router.use(validateAuth);
router.post('/logout', authController.logout);

export default router;