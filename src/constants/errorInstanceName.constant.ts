import { ErrorInstance } from './errorInstance.constant';

type ErrorInstanceNameType = {
  [key in ErrorInstance]: string;
};

export const ErrorInstanceName: ErrorInstanceNameType = {
  [ErrorInstance.APP]: 'APP_ERROR'
};
