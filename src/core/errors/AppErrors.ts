interface ValidationError {
  field: string;
  message: string;
}

export class AppError extends Error {
  public validationErrors?: ValidationError[];

  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true,
    public stack = ""
  ) {
    super(message);
    this.name = this.constructor.name;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, message);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string | ValidationError[]) {
    const isArray = Array.isArray(message);
    super(400, isArray ? "Validation Error" : (message as string));
    if (isArray) {
      this.validationErrors = message;
    }
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(403, message);
  }
}


export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}