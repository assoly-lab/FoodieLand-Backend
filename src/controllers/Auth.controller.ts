import { UserPayload } from "@/interfaces/User.interface";
import { AuthService } from "@/services/Auth.service";
import { NextFunction, Request, Response } from "express";

export class AuthController {
  private static authService: AuthService;
  
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: UserPayload = req.body;
      const user = await this.authService.register(userData);
      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(
        email,
        password,
      );
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  
  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        res.status(401).json({
          success: false,
          error: "Refresh token required",
        });
        return;
      }

      const result = await this.authService.refreshToken(refreshToken);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as any;
      await this.authService.logout(user.id);

      res.clearCookie("refreshToken",{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  
}