import { CustomError } from './customError.ts';

export class UnauthorizedError extends CustomError {
  statusCode = 401;
  constructor() {
    super('Not authorized');
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: 'Not Authorized' }];
  }
}
