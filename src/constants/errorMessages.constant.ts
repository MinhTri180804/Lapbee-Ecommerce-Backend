import { ErrorCodes } from './errorCodes.constant.js';

type ErrorMessagesType = {
  [key in ErrorCodes]: string;
};

export const ErrorMessages: ErrorMessagesType = {
  [ErrorCodes.USER_MOT_FOUND]: 'User not found',
  [ErrorCodes.EMAIL_ALREADY_PENDING_VERIFICATION]: 'Verification email was already sent and is awaiting confirmation.',
  [ErrorCodes.VERIFICATION_PENDING_OTP_EXPIRED]: 'The verification code has expired. Please request a new one.',
  [ErrorCodes.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  [ErrorCodes.VALIDATION_REQUEST_BODY]: 'Validation failed. Please ensure all required fields are correctly filled.',
  [ErrorCodes.EMAIL_EXISTS]: 'Email exist.',
  [ErrorCodes.EMAIL_VERIFIED_NO_PASSWORD]:
    "Your account's email is verified but no password has been set. Please use the 'Forgot Password' feature to create a new password."
};
