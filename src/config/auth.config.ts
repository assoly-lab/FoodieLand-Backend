import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret";
export const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-token-secret";
export const JWT_EXPIRES_IN: number = process.env.JWT_EXPIRES_IN
  ? Number(process.env.JWT_EXPIRES_IN)
  : 3600;
export const JWT_REFRESH_EXPIRES_IN: number = process.env.JWT_REFRESH_EXPIRES_IN
  ? Number(process.env.JWT_REFRESH_EXPIRES_IN)
  : 3600;

export const PASSWORD_RESET_EXPIRES = 60 * 60 * 1000;
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCK_TIME = 15 * 60 * 1000;
