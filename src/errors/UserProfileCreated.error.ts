import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type Details = null;
type ConstructorParams = {
  message?: string | null;
};

export class UserProfileCreatedError extends AppError<Details> {
  constructor({ message }: ConstructorParams) {
    super({
      statusCode: StatusCodes.BAD_REQUEST,
      errorInstanceKey: 'USER_PROFILE_CREATED',
      details: null,
      message
    });
  }
}
