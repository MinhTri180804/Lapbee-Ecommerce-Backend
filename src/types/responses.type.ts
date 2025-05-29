import { ErrorInstance } from '../constants/errorInstance.constant.js';
import { ErrorCodes } from '../constants/errorCodes.constant.js';

export type SuccessResponseType<T = null, U = null> = {
  success?: true;
  statusCode: number;
  message: string;
  data?: T | null;
  metadata?: U | null;
};

export type ErrorResponseType<T = null> = {
  success?: false;
  statusCode: number;
  message: string;
  error: {
    code: ErrorCodes;
    message: string;
    name: string;
    details?: T[] | null;
    devInfo?: {
      instance: ErrorInstance;
      stack: string;
      isOperational: boolean;
    };
  };
};
