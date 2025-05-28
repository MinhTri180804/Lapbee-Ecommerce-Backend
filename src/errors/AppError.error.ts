import { StatusCodes } from 'http-status-codes';
import { ErrorInstance } from '../constants/errorInstance.constant.js';

export class AppError extends Error {
  readonly statusCode: StatusCodes;
  readonly isOperational: boolean = true;
  readonly errorInstance: ErrorInstance.APP;

  static readonly staticErrorInstance: ErrorInstance = ErrorInstance.APP;

  constructor(statusCode: StatusCodes, message: string) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this, this.constructor);
  }
}
