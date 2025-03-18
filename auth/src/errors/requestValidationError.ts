import type { ValidationError } from 'express-validator';
import { CustomError } from './customError';

export class RequestValidationError extends CustomError {
  public errors: ValidationError[];
  statusCode = 400;

  constructor(errors: ValidationError[]) {
    super('Invalid request parameters.');
    this.errors = errors;
    // Bc im extending build in class

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => {
      if (error.type === 'field') return { message: error.msg, field: error.path };
      return { message: error.msg };
    });
  }
}
