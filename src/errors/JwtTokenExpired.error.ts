import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type ConstructorParams = {
  message?: string | null;
};

export class JWTTokenExpiredError extends AppError<null> {
  constructor({ message = null }: ConstructorParams) {
    super({
      statusCode: StatusCodes.UNAUTHORIZED,
      errorInstanceKey: 'JWT_TOKEN_EXPIRED',
      details: null,
      message
    });
  }
}
