import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

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

export class EmailAlreadyPendingVerificationError extends AppError<Details> {
  constructor({ errorDetails, message = null }: ConstructorParams) {
    super({
      statusCode: StatusCodes.CONFLICT,
      errorInstanceKey: 'EMAIL_ALREADY_PENDING_VERIFICATION',
      details: errorDetails,
      message
    });
  }
}
