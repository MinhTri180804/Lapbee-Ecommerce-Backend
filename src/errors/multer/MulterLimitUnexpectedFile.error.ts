import { StatusCodes } from 'http-status-codes';
import { AppError } from '../AppError.error.js';

type Details = null;

type ConstructorParams = {
  message?: string | null;
};

export class MulterLimitUnexpectedFileError extends AppError<Details> {
  constructor({ message = null }: ConstructorParams) {
    super({
      statusCode: StatusCodes.BAD_REQUEST,
      errorInstanceKey: 'MULTER_LIMIT_UNEXPECTED_FILE',
      details: null,
      message
    });
  }
}
