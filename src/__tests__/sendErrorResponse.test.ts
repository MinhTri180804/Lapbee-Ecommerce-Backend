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
