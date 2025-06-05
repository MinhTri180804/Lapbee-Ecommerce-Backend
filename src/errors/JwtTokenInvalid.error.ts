import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type Details = null;

export class JWTTokenInvalidError extends AppError<Details> {
  constructor() {
    super({
      statusCode: StatusCodes.UNAUTHORIZED,
      errorInstanceKey: 'JWT_TOKEN_INVALID',
      details: null
    });
  }
}
