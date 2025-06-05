import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type Details = null;

export class PinCodeGoneError extends AppError<Details> {
  constructor() {
    super({ statusCode: StatusCodes.GONE, errorInstanceKey: 'PIN_CODE_GONE', details: null });
  }
}
