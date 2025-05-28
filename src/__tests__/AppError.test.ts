import { StatusCodes } from 'http-status-codes';
import { AppError } from '../errors/AppError.error';
import { ErrorInstance } from '../constants/errorInstance.constant';

describe('AppError', () => {
  it('should create an instance of AppError with correct properties', () => {
    const statusCode = StatusCodes.BAD_REQUEST;
    const message = 'This is a test error message';
    const error = new AppError(statusCode, message);

    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(statusCode);
    expect(error.message).toBe(message);
    expect(error.isOperational).toBe(true);
    expect(error.errorInstance).toBe(ErrorInstance.APP);
    expect(error.name).toBe('AppError');
    expect(error.stack).toBeDefined();
  });

  it('should have the correct static error instance', () => {
    expect(AppError.staticErrorInstance).toBe(ErrorInstance.APP);
  });
});
