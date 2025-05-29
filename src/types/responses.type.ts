import { ErrorInstance } from '../constants/errorInstance.constant.js';
import { ErrorCodes } from '../constants/errorCodes.constants.js';

export type SuccessResponseType<T = null, U = null> = {
  success?: true;
  statusCode: number;
  message: string;
  data?: T | null;
  metadata?: U | null;
};

export type ErrorResponseType<T = null> = {
  success?: boolean;
  statusCode: number;
  message: string;
  error: {
    code: ErrorCodes;
    message: string;
    name: string;
    details?: T[] | null;
    instance: ErrorInstance;
    devInfo?: {
      stack: string;
      isOperational: boolean;
    };
  };
};
