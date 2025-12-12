import { AuthController } from "@/controllers/Auth.controller";
import { validateAuth, validateLogin, validateRegister } from "@/middlewares/auth.middleware";
import express from "express";


const router = express.Router();

router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);

router.use(validateAuth);
router.post('/logout', AuthController.logout);