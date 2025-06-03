import { ErrorInstance } from './errorInstance.constant.js';

type ErrorInstanceNameType = {
  [key in ErrorInstance]: string;
};

export const ErrorInstanceName: ErrorInstanceNameType = {
  [ErrorInstance.APP]: 'APP_ERROR',
  [ErrorInstance.EMAIL_EXIST]: 'EMAIL_EXIST',
  [ErrorInstance.VALIDATION_REQUEST_BODY]: 'VALIDATION_REQUEST_BODY'
};
