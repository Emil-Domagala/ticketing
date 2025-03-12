import { CustomError } from './customError.ts';

export class DatabaseConnectionError extends CustomError {
  reason = 'Database connection error';
  statusCode = 500;
  constructor() {
    super('Error connecting to the database');
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
