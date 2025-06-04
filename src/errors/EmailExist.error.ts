import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type Details = {
  field: string;
  message: string;
};

type ConstructorParams = {
  message?: string | null;
};

export class EmailExistError extends AppError<Details> {
  constructor({ message = null }: ConstructorParams) {
    super({
      statusCode: StatusCodes.CONFLICT,
      errorInstanceKey: 'EMAIL_EXIST',
      details: {
        field: 'email',
        message: 'Email register exist'
      },
      message
    });
  }
}
