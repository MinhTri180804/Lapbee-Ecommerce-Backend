import { ErrorCodes } from './errorCodes.contants';

type ErrorMessagesType = {
  [key in ErrorCodes]: string;
};

export const errorMessages: ErrorMessagesType = {
  [ErrorCodes.USER_MOT_FOUND]: 'User not found'
};
