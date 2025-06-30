import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';
type ConstructorParams = {
  message?: string | null;
};

type Details = null;

export class MissingTokenError extends AppError<Details> {
  constructor({ message = null }: ConstructorParams) {
    super({
      statusCode: StatusCodes.UNAUTHORIZED,
      errorInstanceKey: 'MISSING_TOKEN',
      message,
      details: null
    });
  }
}
