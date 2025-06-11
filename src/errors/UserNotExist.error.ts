import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type Details = null;
type ConstructorParams = {
  message?: string | null;
};

export class UserNotExistError extends AppError<Details> {
  constructor({ message = null }: ConstructorParams) {
    super({
      statusCode: StatusCodes.BAD_REQUEST,
      errorInstanceKey: 'USER_NOT_EXIST',
      details: null,
      message
    });
  }
}
