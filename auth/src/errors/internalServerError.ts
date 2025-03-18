import { CustomError } from './customError';

export class InternalServerError extends CustomError {
  statusCode = 500;
  public message: string;
  constructor() {
    super('Internal server error');
    this.message = 'Something went wrong';
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
  serializeErrors() {
    return [{ message: 'Internal server error' }];
  }
}
