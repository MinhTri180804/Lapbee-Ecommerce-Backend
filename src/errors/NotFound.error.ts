import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type Details = null;
type ConstructorParams = {
  message?: string | null;
};

export class NotFoundError extends AppError<Details> {
  constructor({ message = null }: ConstructorParams) {
    super({
      statusCode: StatusCodes.NOT_FOUND,
      errorInstanceKey: 'NOT_FOUND',
      details: null,
      message
    });
  }
}
