import { NextFunction, Request, Response } from 'express';
import { EmailAlreadyPendingVerificationError } from 'src/errors/EmailAlreadyPendingVerification.error.js';
import { EmailExistError } from 'src/errors/EmailExist.error.js';
import { ValidateRequestBodyError } from 'src/errors/ValidateRequestBody.error.js';
import { VerificationPendingOtpExpiredError } from 'src/errors/VerificationPendingOtpExpired.error.js';
import { VerifiedNoPasswordError } from 'src/errors/VerifiedNoPassword.error.js';
import { ErrorInstance } from '../constants/errorInstance.constant.js';
import { AppError } from '../errors/AppError.error.js';
import { UnknownError } from '../errors/Unknown.error.js';
import { sendErrorResponse } from '../utils/responses.util.js';

type ErrorHandler<T extends AppError<unknown> | Error> = (response: Response, error: T) => void;

type MappingHandler = {
  [ErrorInstance.EMAIL_ALREADY_PENDING_VERIFICATION]: ErrorHandler<EmailAlreadyPendingVerificationError>;
  [ErrorInstance.EMAIL_EXIST]: ErrorHandler<EmailExistError>;
  [ErrorInstance.VALIDATION_REQUEST_BODY]: ErrorHandler<ValidateRequestBodyError<unknown>>;
  [ErrorInstance.VERIFICATION_PENDING_OTP_EXPIRED]: ErrorHandler<VerificationPendingOtpExpiredError>;
  [ErrorInstance.VERIFIED_NO_PASSWORD]: ErrorHandler<VerifiedNoPasswordError>;
  [ErrorInstance.UNKNOWN]: ErrorHandler<UnknownError>;
};

class _ErrorMiddlewareHandler {
  static instance: _ErrorMiddlewareHandler;
  private mappingHandler: MappingHandler = {
    [ErrorInstance.EMAIL_ALREADY_PENDING_VERIFICATION]: this._emailAlreadyPendingVerificationErrorHandler,
    [ErrorInstance.EMAIL_EXIST]: this._emailExistErrorHandler,
    [ErrorInstance.VALIDATION_REQUEST_BODY]: this._validateRequestBodyErrorHandler,
    [ErrorInstance.VERIFICATION_PENDING_OTP_EXPIRED]: this._verificationPendingOtpExpiredErrorHandler,
    [ErrorInstance.VERIFIED_NO_PASSWORD]: this._verifiedNoPasswordErrorHandler,
    [ErrorInstance.UNKNOWN]: this._unknownErrorHandler
  };

  private constructor() {}

  static getInstance() {
    if (!_ErrorMiddlewareHandler.instance) {
      _ErrorMiddlewareHandler.instance = new _ErrorMiddlewareHandler();
    }

    return _ErrorMiddlewareHandler.instance;
  }

  // eslint-disable-next-line
  private _unknownErrorHandler(response: Response, _: Error) {
    const _error = new UnknownError({});
    // TODO: Implement handle alert when have unknown error

    sendErrorResponse<null>({
      response,
      content: _error
    });
  }

  private _emailAlreadyPendingVerificationErrorHandler(
    response: Response,
    error: EmailAlreadyPendingVerificationError
  ) {
    sendErrorResponse<EmailAlreadyPendingVerificationError['details']>({
      response,
      content: error
    });
  }

  private _emailExistErrorHandler(response: Response, error: EmailExistError) {
    sendErrorResponse<EmailExistError['details']>({
      response,
      content: error
    });
  }

  private _validateRequestBodyErrorHandler(response: Response, error: ValidateRequestBodyError<unknown>) {
    sendErrorResponse<ValidateRequestBodyError<unknown>['details']>({
      response,
      content: error
    });
  }

  private _verificationPendingOtpExpiredErrorHandler(response: Response, error: VerificationPendingOtpExpiredError) {
    sendErrorResponse<VerificationPendingOtpExpiredError['details']>({
      response,
      content: error
    });
  }

  private _verifiedNoPasswordErrorHandler(response: Response, error: VerifiedNoPasswordError) {
    sendErrorResponse<VerifiedNoPasswordError['details']>({
      response,
      content: error
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public handler(error: AppError<unknown> | Error, _: Request, response: Response, __: NextFunction) {
    if (error instanceof AppError && !(error instanceof UnknownError)) {
      const handler = this.mappingHandler[error.errorInstance];
      if (handler) {
        handler(response, error as AppError<null>);
        return;
      }
      // TODO: Send email admin alert error instanceof AppError but not match with handler
    }

    this._unknownErrorHandler(response, error);
    return;
  }
}

export const ErrorMiddlewareHandler = _ErrorMiddlewareHandler.getInstance();
