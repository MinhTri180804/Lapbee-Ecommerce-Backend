import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

export class PinCodeExpiredError extends AppError<null> {
  constructor() {
    super({
      statusCode: StatusCodes.GONE,
      errorInstanceKey: 'PIN_CODE_EXPIRED',
      details: null
    });
  }
}
