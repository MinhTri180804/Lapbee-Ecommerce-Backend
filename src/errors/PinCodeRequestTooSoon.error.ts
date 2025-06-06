import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type Details = null;

type ConstructorParams = {
  message?: string | null;
};

export class PinCodeRequestTooSoonError extends AppError<Details> {
  constructor({ message = null }: ConstructorParams) {
    super({
      statusCode: StatusCodes.TOO_MANY_REQUESTS,
      errorInstanceKey: 'PIN_CODE_REQUEST_TOO_SOON',
      details: null,
      message
    });
  }
}
