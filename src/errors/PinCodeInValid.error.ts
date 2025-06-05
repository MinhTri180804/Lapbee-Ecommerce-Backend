import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type Details = null;

export class PinCodeInvalidError extends AppError<Details> {
  constructor() {
    super({
      statusCode: StatusCodes.BAD_REQUEST,
      errorInstanceKey: 'PIN_CODE_INVALID',
      details: null
    });
  }
}
