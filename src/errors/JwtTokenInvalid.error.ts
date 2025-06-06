import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type Details = null;

type ConstructorParams = {
  message?: string | null;
};

export class JWTTokenInvalidError extends AppError<Details> {
  constructor({ message = null }: ConstructorParams) {
    super({
      statusCode: StatusCodes.UNAUTHORIZED,
      errorInstanceKey: 'JWT_TOKEN_INVALID',
      details: null,
      message
    });
  }
}
