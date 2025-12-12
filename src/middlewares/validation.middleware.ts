import { BadRequestError } from '@/core/errors/AppErrors';
import { Request, Response, NextFunction } from 'express';
import { validationResult, FieldValidationError } from 'express-validator';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  console.log(req.body);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => {
      const fieldError = error as FieldValidationError;
      return {
        field: fieldError.path,
        message: fieldError.msg,
      };
    });
    throw new BadRequestError(errorMessages);
  }
  next();
};
