import { StatusCodes } from 'http-status-codes';
import { env } from '../configs/env.config.js';
import { ErrorCodes } from '../constants/errorCodes.constant.js';
import { ErrorInstance } from '../constants/errorInstance.constant.js';
import { ErrorMessages } from '../constants/errorMessages.constant.js';
import { ValidationMessages } from '../constants/validationMessages.constant.js';
import { EmailAlreadyPendingVerificationError } from '../errors/EmailAlreadyPendingVerification.error.js';
import { EmailExistError } from '../errors/EmailExist.error.js';
import { ValidateRequestBodyError } from '../errors/ValidateRequestBody.error.js';
import { VerificationPendingOtpExpiredError } from '../errors/VerificationPendingOtpExpired.error.js';
import { registerLocalRequestBodySchema } from '../schema/zod/api/requests/auth/local.schema.js';
import { sendErrorResponse } from '../utils/responses.util.js';
import { UnknownError } from '../errors/Unknown.error.js';
import { JWTTokenInvalidError } from '../errors/JwtTokenInvalid.error.js';
import { JWTTokenExpiredError } from '../errors/JwtTokenExpired.error.js';
import { AccountPasswordUpdatedError } from '../errors/AccountPasswordUpdated.error.js';
import { PinCodeRequestTooSoonError } from '../errors/PinCodeRequestTooSoon.error.js';
import { PinCodeNotFoundError } from '../errors/PinCodeNotFound.error.js';
import { NotFoundEmailSetPasswordError } from '../errors/NotFoundEmailSetPassword.error.js';

const mockResponse = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: any = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn();
  return res;
};

describe('sendErrorResponse', () => {
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    res = mockResponse();
    jest.clearAllMocks();
  });

  it('Send Error Response with EmailExistError', () => {
    Object.defineProperty(env.app, 'NODE_ENV', {
      writable: true,
      value: 'dev'
    });

    const error = new EmailExistError({});
    sendErrorResponse({ content: error, response: res });

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: StatusCodes.CONFLICT,
        message: ErrorMessages.EMAIL_EXIST_ERROR,
        error: expect.objectContaining({
          code: ErrorCodes.EMAIL_EXIST_ERROR,
          name: ErrorInstance.EMAIL_EXIST,
          details: expect.objectContaining({
            field: 'email',
            message: 'Email register exist'
          })
        })
      })
    );
  });

  it('Send Error Response with VerificationPendingOtpExpired', () => {
    Object.defineProperty(env.app, 'NODE_ENV', {
      writable: true,
      value: 'prod'
    });

    const expiredAt = 123;
    const sentAt = 123;
    const resendAvailable = true;

    const error = new VerificationPendingOtpExpiredError({
      errorDetails: {
        expiredAt,
        resendAvailable,
        sentAt
      }
    });

    sendErrorResponse({ content: error, response: res });

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: StatusCodes.CONFLICT,
        message: ErrorMessages.VERIFICATION_PENDING_OTP_EXPIRED_ERROR,
        error: expect.objectContaining({
          code: ErrorCodes.VERIFICATION_PENDING_OTP_EXPIRED_ERROR,
          name: ErrorInstance.VERIFICATION_PENDING_OTP_EXPIRED
        })
      })
    );
  });

  it('Send Error Response with EmailAlreadyPendingVerification', () => {
    Object.defineProperty(env.app, 'NODE_ENV', {
      writable: true,
      value: 'dev'
    });

    const resendAvailable = true;
    const expiresAt = 123;
    const sentAt = 123;
    const remainingMs = 123;

    const error = new EmailAlreadyPendingVerificationError({
      errorDetails: {
        resendAvailable,
        expiresAt,
        sentAt,
        remainingMs
      }
    });

    sendErrorResponse({ content: error, response: res });

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: StatusCodes.CONFLICT,
        message: ErrorMessages.EMAIL_ALREADY_PENDING_VERIFICATION_ERROR,
        error: expect.objectContaining({
          code: ErrorCodes.EMAIL_ALREADY_PENDING_VERIFICATION_ERROR,
          name: ErrorInstance.EMAIL_ALREADY_PENDING_VERIFICATION,
          details: expect.objectContaining({
            resendAvailable,
            expiresAt,
            sentAt,
            remainingMs
          })
        })
      })
    );
  });

  it('Send Error Response with ValidateRequestBody', () => {
    Object.defineProperty(env.app, 'NODE_ENV', {
      writable: true,
      value: 'dev'
    });

    const requestBody = {};

    const result = registerLocalRequestBodySchema.safeParse(requestBody);
    const error = new ValidateRequestBodyError({
      errorDetails: result.error!.format()
    });

    sendErrorResponse({
      response: res,
      content: error
    });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorMessages.VALIDATION_REQUEST_BODY_ERROR,
        error: expect.objectContaining({
          code: ErrorCodes.VALIDATION_REQUEST_BODY_ERROR,
          name: ErrorInstance.VALIDATION_REQUEST_BODY,
          details: expect.objectContaining({
            _errors: [],
            email: {
              _errors: [ValidationMessages.api.request.auth.local.register.EMAIL_REQUIRED]
            }
          })
        })
      })
    );
  });

  it('Send Error Response with TokenInvalidError', () => {
    Object.defineProperty(env.app, 'NODE_ENV', {
      writable: true,
      value: 'dev'
    });

    const error = new JWTTokenInvalidError({});
    sendErrorResponse({
      response: res,
      content: error
    });

    expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: ErrorMessages.JWT_TOKEN_INVALID,
        error: expect.objectContaining({
          code: ErrorCodes.JWT_TOKEN_INVALID,
          name: ErrorInstance.JWT_TOKEN_INVALID,
          details: null
        })
      })
    );
  });

  it('Send Error Response with AccountPasswordUpdatedError', () => {
    Object.defineProperty(env.app, 'NODE_ENV', {
      writable: true,
      value: 'dev'
    });

    const error = new AccountPasswordUpdatedError();
    sendErrorResponse({
      response: res,
      content: error
    });

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorMessages.ACCOUNT_PASSWORD_UPDATED,
        error: expect.objectContaining({
          code: ErrorCodes.ACCOUNT_PASSWORD_UPDATED,
          name: ErrorInstance.ACCOUNT_PASSWORD_UPDATED,
          details: null
        })
      })
    );
  });

  it('Send Error Response with TokenInvalidError and custom message', () => {
    Object.defineProperty(env.app, 'NODE_ENV', {
      writable: true,
      value: 'dev'
    });

    const customMessage = 'custom message';
    const error = new JWTTokenInvalidError({ message: customMessage });
    sendErrorResponse({
      response: res,
      content: error
    });

    expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: customMessage,
        error: expect.objectContaining({
          code: ErrorCodes.JWT_TOKEN_INVALID,
          name: ErrorInstance.JWT_TOKEN_INVALID,
          details: null
        })
      })
    );
  });

  it('Send Error Response with PinCodeRequestTooSoonError', () => {
    Object.defineProperty(env.app, 'NODE_ENV', {
      writable: true,
      value: 'dev'
    });

    const error = new PinCodeRequestTooSoonError({});
    sendErrorResponse({
      response: res,
      content: error
    });

    expect(res.status).toHaveBeenCalledWith(StatusCodes.TOO_MANY_REQUESTS);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: StatusCodes.TOO_MANY_REQUESTS,
        message: ErrorMessages.PIN_CODE_REQUEST_TOO_SOON_ERROR,
        error: expect.objectContaining({
          code: ErrorCodes.PIN_CODE_REQUEST_TOO_SOON_ERROR,
          name: ErrorInstance.PIN_CODE_REQUEST_TOO_SOON,
          details: null
        })
      })
    );
  });

  it('Send Error Response with PinCodeRequestTooSoonError with custom message', () => {
    Object.defineProperty(env.app, 'NODE_ENV', {
      writable: true,
      value: 'dev'
    });

    const customMessage = 'custom message';
    const error = new PinCodeRequestTooSoonError({ message: customMessage });
    sendErrorResponse({
      response: res,
      content: error
    });

    expect(res.status).toHaveBeenCalledWith(StatusCodes.TOO_MANY_REQUESTS);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: StatusCodes.TOO_MANY_REQUESTS,
        message: customMessage,
        error: expect.objectContaining({
          code: ErrorCodes.PIN_CODE_REQUEST_TOO_SOON_ERROR,
          name: ErrorInstance.PIN_CODE_REQUEST_TOO_SOON,
          details: null
        })
      })
    );
  });

  it('Send Error Response with NotFoundEmailSetPasswordError', () => {
    Object.defineProperty(env.app, 'NODE_ENV', {
      writable: true,
      value: 'dev'
    });

    const error = new NotFoundEmailSetPasswordError({});
    sendErrorResponse({
      response: res,
      content: error
    });

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorMessages.NOTFOUND_EMAIL_SET_PASSWORD_TOKEN_ERROR,
        error: expect.objectContaining({
          code: ErrorCodes.NOTFOUND_EMAIL_SET_PASSWORD_TOKEN_ERROR,
          name: ErrorInstance.NOTFOUND_EMAIL_SET_PASSWORD_TOKEN,
          details: null
        })
      })
    );
  });

  it('Send Error Response with NotFoundEmailSetPasswordError with custom message', () => {
    Object.defineProperty(env.app, 'NODE_ENV', {
      writable: true,
      value: 'dev'
    });

    const customMessage = 'custom message';
    const error = new NotFoundEmailSetPasswordError({ message: customMessage });
    sendErrorResponse({
      response: res,
      content: error
    });

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: customMessage,
        error: expect.objectContaining({
          code: ErrorCodes.NOTFOUND_EMAIL_SET_PASSWORD_TOKEN_ERROR,
          name: ErrorInstance.NOTFOUND_EMAIL_SET_PASSWORD_TOKEN,
          details: null
        })
      })
    );
  });

  it('Send Error Response with PinCodeNotFoundError', () => {
    Object.defineProperty(env.app, 'NODE_ENV', {
      writable: true,
      value: 'dev'
    });

    const error = new PinCodeNotFoundError({});
    sendErrorResponse({
      response: res,
      content: error
    });

    expect(res.status).toHaveBeenCalledWith(StatusCodes.GONE);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: StatusCodes.GONE,
        message: ErrorMessages.PIN_CODE_NOTFOUND_ERROR,
        error: expect.objectContaining({
          code: ErrorCodes.PIN_CODE_NOTFOUND_ERROR,
          name: ErrorInstance.PIN_CODE_NOTFOUND,
          details: null
        })
      })
    );
  });

  it('Send Error Response with PinCodeNotFoundError with custom message', () => {
    Object.defineProperty(env.app, 'NODE_ENV', {
      writable: true,
      value: 'dev'
    });

    const customMessage = 'custom message';
    const error = new PinCodeNotFoundError({ message: customMessage });
    sendErrorResponse({
      response: res,
      content: error
    });

    expect(res.status).toHaveBeenCalledWith(StatusCodes.GONE);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: StatusCodes.GONE,
        message: customMessage,
        error: expect.objectContaining({
          code: ErrorCodes.PIN_CODE_NOTFOUND_ERROR,
          name: ErrorInstance.PIN_CODE_NOTFOUND,
          details: null
        })
      })
    );
  });

  it('Send Error Response with JWTTokenExpiredError', () => {
    Object.defineProperty(env.app, 'NODE_ENV', {
      writable: true,
      value: 'dev'
    });

    const error = new JWTTokenExpiredError({});
    sendErrorResponse({
      response: res,
      content: error
    });

    expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: ErrorMessages.JWT_TOKEN_EXPIRED,
        error: expect.objectContaining({
          code: ErrorCodes.JWT_TOKEN_EXPIRED,
          name: ErrorInstance.JWT_TOKEN_EXPIRED,
          details: null
        })
      })
    );
  });

  it('Send Error Response with JWTTokenExpiredError and custom message', () => {
    Object.defineProperty(env.app, 'NODE_ENV', {
      writable: true,
      value: 'dev'
    });

    const customMessage = '123123123';
    const error = new JWTTokenExpiredError({ message: customMessage });
    sendErrorResponse({
      response: res,
      content: error
    });

    expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: customMessage,
        error: expect.objectContaining({
          code: ErrorCodes.JWT_TOKEN_EXPIRED,
          name: ErrorInstance.JWT_TOKEN_EXPIRED,
          details: null
        })
      })
    );
  });

  it('Send Error Response with UnknownError', () => {
    Object.defineProperty(env.app, 'NODE_ENV', {
      writable: true,
      value: 'dev'
    });

    const error = new UnknownError({});
    sendErrorResponse({
      response: res,
      content: error
    });

    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ErrorMessages.UNKNOWN_ERROR,
        error: expect.objectContaining({
          code: ErrorCodes.UNKNOWN_ERROR,
          name: ErrorInstance.UNKNOWN,
          details: null,
          devInfo: expect.objectContaining({
            instance: ErrorInstance.UNKNOWN,
            isOperational: false,
            stack: expect.any(String)
          })
        })
      })
    );
  });
});
