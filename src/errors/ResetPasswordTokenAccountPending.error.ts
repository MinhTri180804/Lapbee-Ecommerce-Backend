import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type Details = {
  resendAvailable: boolean;
  sentAt: number;
  expiresAt: number;
  remainingMs: number;
};

type ConstructorParams = {
  errorDetails: Details;
  message?: string | null;
};

export class ResetPasswordTokenAccountPendingError extends AppError<Details> {
  constructor({ errorDetails, message = null }: ConstructorParams) {
    super({
      statusCode: StatusCodes.CONFLICT,
      errorInstanceKey: 'RESET_PASSWORD_TOKEN_ACCOUNT_PENDING',
      details: errorDetails,
      message
    });
  }
}
