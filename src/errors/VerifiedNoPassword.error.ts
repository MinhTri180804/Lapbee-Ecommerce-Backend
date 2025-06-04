import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type Details = null;

type ConstructorParams = {
  message?: string | null;
};

export class VerifiedNoPasswordError extends AppError<Details> {
  constructor({ message = null }: ConstructorParams) {
    super({
      statusCode: StatusCodes.CONFLICT,
      errorInstanceKey: 'VERIFIED_NO_PASSWORD',
      details: null,
      message
    });
  }
}
