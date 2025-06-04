import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';

type Details = {
  resendAvailable: boolean;
  expiredAt: number;
  sentAt: number;
};

type ConstructorParams = {
  errorDetails: Details;
  message?: string | null;
};

export class VerificationPendingOtpExpiredError extends AppError<Details> {
  constructor({ errorDetails, message = null }: ConstructorParams) {
    super({
      statusCode: StatusCodes.CONFLICT,
      errorInstanceKey: 'VERIFICATION_PENDING_OTP_EXPIRED',
      details: errorDetails,
      message
    });
  }
}
