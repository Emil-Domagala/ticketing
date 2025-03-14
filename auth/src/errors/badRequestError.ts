import { CustomError } from './customError.ts';

export class BadRequestError extends CustomError {
  statusCode = 400;
  public message: string;
  public field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.message = message;
    this.field = field;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors(): { message: string; field?: string }[] {
    if (this.field) return [{ message: this.message, field: this.field }];
    return [{ message: this.message }];
  }
}
