import { ErrorInstance, ErrorInstanceValues } from './errorInstance.constant.js';

type ErrorCodes = {
  [key in ErrorInstanceValues]: number;
};

export const ErrorCodes: ErrorCodes = {
  [ErrorInstance.EMAIL_EXIST]: 1002,
  [ErrorInstance.VERIFIED_NO_PASSWORD]: 1003,
  [ErrorInstance.VERIFICATION_PENDING_OTP_EXPIRED]: 1004,
  [ErrorInstance.EMAIL_ALREADY_PENDING_VERIFICATION]: 1005,
  [ErrorInstance.UNKNOWN]: 5000,
  [ErrorInstance.VALIDATION_REQUEST_BODY]: 1006,
  [ErrorInstance.PIN_CODE_GONE]: 4010,
  [ErrorInstance.PIN_CODE_INVALID]: 4000,
  [ErrorInstance.PIN_CODE_EXPIRED]: 4001,
  [ErrorInstance.JWT_TOKEN_INVALID]: 4002,
  [ErrorInstance.JWT_TOKEN_EXPIRED]: 4003,
  [ErrorInstance.ACCOUNT_PASSWORD_UPDATED]: 4004,
  [ErrorInstance.PIN_CODE_REQUEST_TOO_SOON]: 4029,
  [ErrorInstance.PIN_CODE_NOTFOUND]: 4010,
  [ErrorInstance.NOTFOUND_EMAIL_SET_PASSWORD_TOKEN]: 4000,
  [ErrorInstance.ACCOUNT_LOCKED]: 4030,
  [ErrorInstance.INVALID_CREDENTIALS]: 4010,
  [ErrorInstance.RESET_PASSWORD_TOKEN_REQUEST_TOO_SOON]: 4029,
  [ErrorInstance.RESET_PASSWORD_TOKEN_ACCOUNT_PENDING]: 1005,
  [ErrorInstance.NOT_MATCH_ACCOUNT_UPDATE_PASSWORD]: 4004
} as const;

export type ErrorCodesKeys = keyof typeof ErrorCodes;
export type ErrorCodesValues = (typeof ErrorCodes)[ErrorCodesKeys];
