import { CustomError } from './customError.ts';

export class BadRequestError extends CustomError {
  statusCode = 400;
  public message: string;

  constructor(message: string) {
    super(message);
    this.message = message;

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.message }];
  }
}
