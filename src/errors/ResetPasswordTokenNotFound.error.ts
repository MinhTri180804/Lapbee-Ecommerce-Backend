import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type Details = null;

type ConstructorParams = {
  message?: string | null;
};

export class ResetPasswordTokenNotFoundError extends AppError<Details> {
  constructor({ message = null }: ConstructorParams) {
    super({
      statusCode: StatusCodes.GONE,
      errorInstanceKey: 'RESET_PASSWORD_TOKEN_NOT_FOUND',
      details: null,
      message
    });
  }
}
