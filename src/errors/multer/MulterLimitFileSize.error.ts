import { StatusCodes } from 'http-status-codes';
import { AppError } from '../AppError.error.js';

type Details = null;

type ConstructorParams = {
  message?: string | null;
};

export class MulterLimitFileSizeError extends AppError<Details> {
  constructor({ message = null }: ConstructorParams) {
    super({
      statusCode: StatusCodes.BAD_REQUEST,
      errorInstanceKey: 'MULTER_LIMIT_FILE_SIZE',
      details: null,
      message
    });
  }
}
