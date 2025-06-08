import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.ts';

type Details = {
  resendAvailable: boolean;
  expiresAt: number;
  sentAt: number;
  remainingMs: number;
};

type ConstructorParams = {
  errorDetails: Details;
  message?: string | null;
};

export class ResetPasswordTokenRequestTooSoonError extends AppError<Details> {
  constructor({ message = null, errorDetails }: ConstructorParams) {
    super({
      statusCode: StatusCodes.TOO_MANY_REQUESTS,
      errorInstanceKey: 'RESET_PASSWORD_TOKEN_REQUEST_TOO_SOON',
      details: errorDetails,
      message
    });
  }
}
