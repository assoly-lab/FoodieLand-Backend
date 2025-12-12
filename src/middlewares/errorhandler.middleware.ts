import { AppError } from "@/core/errors/AppErrors";
import logger from "@/utils/logger.util";
import { Request, Response, NextFunction } from "express";

interface HttpError extends Error {
  status?: number;
} 

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error(`[${err.statusCode}] - ${err.message}`);
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      validationErrors: err.validationErrors,
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    logger.error(`[400] - Validation Error: ${err.message}`);
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  // MongoDB duplicate key error
  if (err.name === "MongoServerError" && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    logger.error(`[400] - Duplicate field: ${field}`);
    return res.status(400).json({
      success: false,
      error: `Duplicate field: ${field}. Please use another value.`,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    logger.error(`[401] - Invalid token`);
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    logger.error(`[401] - Token expired`);
    return res.status(401).json({
      success: false,
      error: "Token expired",
    });
  }
  console.log(err);
  // Default error
  logger.error(`[${err.status || 500}] - ${err.message}`);
  logger.error(`[${err.status || 500}] - ${err.stack}`);

  res.status(err.status || 500).json({
    success: false,
    error: err.message,
  });
};
