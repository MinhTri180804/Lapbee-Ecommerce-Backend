import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type Details = null;
type ConstructorParams = {
  message?: string | null;
};

export class UnknownError extends AppError<Details> {
  constructor({ message = null }: ConstructorParams) {
    super({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, errorInstanceKey: 'UNKNOWN', details: null, message });
  }
}
