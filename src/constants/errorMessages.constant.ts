import { ErrorCodes } from './errorCodes.constant.js';

type ErrorMessagesType = {
  [key in ErrorCodes]: string;
};

export const ErrorMessages: ErrorMessagesType = {
  [ErrorCodes.USER_MOT_FOUND]: 'User not found'
};
