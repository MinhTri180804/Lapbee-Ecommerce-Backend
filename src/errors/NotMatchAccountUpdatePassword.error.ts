import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type Details = null;

type ConstructorParams = {
  message?: string | null;
};

export class NotMatchAccountUpdatePasswordError extends AppError<Details> {
  constructor({ message = null }: ConstructorParams) {
    super({
      statusCode: StatusCodes.BAD_REQUEST,
      errorInstanceKey: 'NOT_MATCH_ACCOUNT_UPDATE_PASSWORD',
      details: null,
      message
    });
  }
}
