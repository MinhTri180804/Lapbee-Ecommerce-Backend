import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type Details = null;

type ConstructorParams = {
  message?: string | null;
};

export class NotFoundEmailSetPasswordError extends AppError<Details> {
  constructor({ message = null }: ConstructorParams) {
    super({
      statusCode: StatusCodes.BAD_REQUEST,
      errorInstanceKey: 'NOTFOUND_EMAIL_SET_PASSWORD',
      details: null,
      message
    });
  }
}
