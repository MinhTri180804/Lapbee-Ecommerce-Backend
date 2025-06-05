import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type Details = null;

export class AccountPasswordUpdatedError extends AppError<Details> {
  constructor() {
    super({
      statusCode: StatusCodes.BAD_REQUEST,
      errorInstanceKey: 'ACCOUNT_PASSWORD_UPDATED',
      details: null
    });
  }
}
