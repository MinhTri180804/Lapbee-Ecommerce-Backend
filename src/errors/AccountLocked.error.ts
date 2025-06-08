import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type Details = {
  messageBlocked: string;
};

type ConstructorParams = {
  message?: string | null;
  messageBlocked: string;
};

export class AccountLockedError extends AppError<Details> {
  constructor({ message = null, messageBlocked }: ConstructorParams) {
    super({
      statusCode: StatusCodes.FORBIDDEN,
      errorInstanceKey: 'ACCOUNT_LOCKED',
      details: {
        messageBlocked
      },
      message
    });
  }
}
