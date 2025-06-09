import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type Details = null;

type ConstructorParams = {
  message?: string | null;
};

export class AuthorizationHeaderMissingError extends AppError<Details> {
  constructor({ message = null }: ConstructorParams) {
    super({
      statusCode: StatusCodes.UNAUTHORIZED,
      errorInstanceKey: 'AUTHORIZATION_HEADER_MISSING',
      details: null,
      message
    });
  }
}
