import { StatusCodes } from 'http-status-codes';
import { AppError } from '../AppError.error.js';

type Details = null;

type ConstructorParams = {
  message?: string | null;
};

export class MulterLimitPartCountError extends AppError<Details> {
  constructor({ message = null }: ConstructorParams) {
    super({
      statusCode: StatusCodes.BAD_REQUEST,
      errorInstanceKey: 'MULTER_LIMIT_PART_COUNT',
      details: null,
      message
    });
  }
}
