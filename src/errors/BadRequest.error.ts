import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type ConstructorParams<T> = {
  message?: string | null;
  details?: T | null;
};

export class BadRequestError<T = null> extends AppError<T> {
  constructor({ message = null, details = null }: ConstructorParams<T>) {
    super({
      statusCode: StatusCodes.BAD_REQUEST,
      errorInstanceKey: 'BAD_REQUEST',
      details: details,
      message
    });
  }
}
