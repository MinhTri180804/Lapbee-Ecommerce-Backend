import { StatusCodes } from 'http-status-codes';
import { ZodFormattedError } from 'zod';
import { AppError } from './AppError.error.js';

type Details<T> = ZodFormattedError<T>;

type ConstructorParams<T> = {
  errorDetails: Details<T>;
  message?: string | null;
};

export class ValidateRequestBodyError<T> extends AppError<Details<T>> {
  constructor({ errorDetails, message = null }: ConstructorParams<T>) {
    super({
      statusCode: StatusCodes.BAD_REQUEST,
      errorInstanceKey: 'VALIDATION_REQUEST_BODY',
      details: errorDetails,
      message
    });
  }
}
