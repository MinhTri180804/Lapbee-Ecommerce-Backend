import { AppError } from './AppError.error.js';
import { StatusCodes } from 'http-status-codes';

type Details = null;

type ConstructorParams = {
  message?: string;
};

export class MaxSizeFileError extends AppError<Details> {
  constructor({ message = 'File size is too large' }: ConstructorParams) {
    super({
      statusCode: StatusCodes.BAD_REQUEST,
      errorInstanceKey: 'MAX_SIZE_FILE',
      details: null,
      message
    });
  }
}
