import { StatusCodes } from 'http-status-codes';
import { ErrorCodes, ErrorCodesValues } from '../constants/errorCodes.constant.js';
import { ErrorInstance, ErrorInstanceKeys, ErrorInstanceValues } from '../constants/errorInstance.constant.js';
import { ErrorMessages } from '../constants/errorMessages.constant.js';

type AppErrorConstructor<T> = {
  statusCode: StatusCodes;
  errorInstanceKey: ErrorInstanceKeys;
  details: T;
  message?: string | null;
};

export class AppError<T> extends Error {
  readonly statusCode: StatusCodes;
  readonly isOperational: boolean;
  readonly errorInstance: ErrorInstanceValues;
  readonly errorCode: ErrorCodesValues;
  readonly name: ErrorInstanceValues | string;
  readonly details: T | null;

  protected constructor({ statusCode, errorInstanceKey, details, message }: AppErrorConstructor<T>) {
    super(message || ErrorMessages[ErrorInstance[errorInstanceKey]]);
    this.statusCode = statusCode;
    this.errorInstance = ErrorInstance[errorInstanceKey];
    this.errorCode = ErrorCodes[this.errorInstance];
    this.details = details;
    this.isOperational = errorInstanceKey === 'UNKNOWN' ? false : true;
    this.name = ErrorInstance[errorInstanceKey];
    this.message = message || ErrorMessages[this.errorInstance];
    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this, this.constructor);
  }
}
