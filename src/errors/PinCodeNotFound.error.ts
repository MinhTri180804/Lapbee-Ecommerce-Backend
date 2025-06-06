import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type Details = null;

type ConstructorParams = {
  message?: string | null;
};

export class PinCodeNotFoundError extends AppError<Details> {
  constructor({ message = null }: ConstructorParams) {
    super({
      statusCode: StatusCodes.GONE,
      errorInstanceKey: 'PIN_CODE_NOTFOUND',
      details: null,
      message
    });
  }
}
