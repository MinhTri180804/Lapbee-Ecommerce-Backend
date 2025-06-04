import { ErrorInstance, ErrorInstanceValues } from './errorInstance.constant.js';

type ErrorMessagesType = {
  [key in ErrorInstanceValues]: string;
};

export const ErrorMessages: ErrorMessagesType = {
  [ErrorInstance.EMAIL_ALREADY_PENDING_VERIFICATION]:
    'Verification email was already sent and is awaiting confirmation.',
  [ErrorInstance.VERIFICATION_PENDING_OTP_EXPIRED]: 'The verification code has expired. Please request a new one.',
  [ErrorInstance.UNKNOWN]: 'Internal Server Error',
  [ErrorInstance.VALIDATION_REQUEST_BODY]: 'Validation failed. Please ensure all required fields are correctly filled.',
  [ErrorInstance.EMAIL_EXIST]: 'Email exist.',
  [ErrorInstance.VERIFIED_NO_PASSWORD]:
    "Your account's email is verified but no password has been set. Please use the 'Forgot Password' feature to create a new password."
};
