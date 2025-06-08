import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type Details = null;

type ConstructorParams = {
  message?: string | null;
};

export class InvalidCredentialsError extends AppError<Details> {
  constructor({ message = null }: ConstructorParams) {
    super({
      statusCode: StatusCodes.UNAUTHORIZED,
      errorInstanceKey: 'INVALID_CREDENTIALS',
      details: null,
      message
    });
  }
}
