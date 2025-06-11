import { NextFunction, Request, Response } from 'express';
import { EmailAlreadyPendingVerificationError } from 'src/errors/EmailAlreadyPendingVerification.error.js';
import { EmailExistError } from 'src/errors/EmailExist.error.js';
import { PinCodeExpiredError } from 'src/errors/PinCodeExpired.error.js';
import { PinCodeInvalidError } from 'src/errors/PinCodeInValid.error.js';
import { ValidateRequestBodyError } from 'src/errors/ValidateRequestBody.error.js';
import { VerificationPendingOtpExpiredError } from 'src/errors/VerificationPendingOtpExpired.error.js';
import { VerifiedNoPasswordError } from 'src/errors/VerifiedNoPassword.error.js';
import { ErrorInstance } from '../constants/errorInstance.constant.js';
import { AppError } from '../errors/AppError.error.js';
import { PinCodeGoneError } from '../errors/PinCodeGone.error.js';
import { UnknownError } from '../errors/Unknown.error.js';
import { sendErrorResponse } from '../utils/responses.util.js';
import { JWTTokenInvalidError } from '../errors/JwtTokenInvalid.error.js';
import { JWTTokenExpiredError } from '../errors/JwtTokenExpired.error.js';
import { PinCodeRequestTooSoonError } from '../errors/PinCodeRequestTooSoon.error.js';
import { AccountPasswordUpdatedError } from 'src/errors/AccountPasswordUpdated.error.js';
import { PinCodeNotFoundError } from '../errors/PinCodeNotFound.error.js';
import { NotFoundEmailSetPasswordError } from 'src/errors/NotFoundEmailSetPassword.error.js';
import { AccountLockedError } from 'src/errors/AccountLocked.error.js';
import { InvalidCredentialsError } from 'src/errors/InvalidCredentials.error.js';
import { ResetPasswordTokenRequestTooSoonError } from '../errors/ResetPasswordTokenTooSoon.error.js';
import { ResetPasswordTokenAccountPendingError } from '../errors/ResetPasswordTokenAccountPending.error.js';
import { NotMatchAccountUpdatePasswordError } from '../errors/NotMatchAccountUpdatePassword.error.js';
import { ResetPasswordTokenNotFoundError } from '../errors/ResetPasswordTokenNotFound.error.js';
import { EmailNotExistError } from '../errors/EmailNotExist.error.js';
import { AuthorizationHeaderMissingError } from '../errors/AuthorizationHeaderMissing.error.js';
import { UserProfileCreatedError } from '../errors/UserProfileCreated.error.js';
import { UserNotExistError } from '../errors/UserNotExist.error.js';
import { UserProfileNotExistError } from '../errors/UserProfileNotExist.error.js';

type ErrorHandler<T extends AppError<unknown> | Error> = (response: Response, error: T) => void;

type MappingHandler = {
  [ErrorInstance.EMAIL_ALREADY_PENDING_VERIFICATION]: ErrorHandler<EmailAlreadyPendingVerificationError>;
  [ErrorInstance.EMAIL_EXIST]: ErrorHandler<EmailExistError>;
  [ErrorInstance.VALIDATION_REQUEST_BODY]: ErrorHandler<ValidateRequestBodyError<unknown>>;
  [ErrorInstance.VERIFICATION_PENDING_OTP_EXPIRED]: ErrorHandler<VerificationPendingOtpExpiredError>;
  [ErrorInstance.VERIFIED_NO_PASSWORD]: ErrorHandler<VerifiedNoPasswordError>;
  [ErrorInstance.UNKNOWN]: ErrorHandler<UnknownError>;
  [ErrorInstance.PIN_CODE_GONE]: ErrorHandler<PinCodeGoneError>;
  [ErrorInstance.PIN_CODE_EXPIRED]: ErrorHandler<PinCodeExpiredError>;
  [ErrorInstance.PIN_CODE_INVALID]: ErrorHandler<PinCodeInvalidError>;
  [ErrorInstance.JWT_TOKEN_INVALID]: ErrorHandler<JWTTokenInvalidError>;
  [ErrorInstance.JWT_TOKEN_EXPIRED]: ErrorHandler<JWTTokenExpiredError>;
  [ErrorInstance.PIN_CODE_REQUEST_TOO_SOON]: ErrorHandler<PinCodeRequestTooSoonError>;
  [ErrorInstance.ACCOUNT_PASSWORD_UPDATED]: ErrorHandler<AccountPasswordUpdatedError>;
  [ErrorInstance.PIN_CODE_NOTFOUND]: ErrorHandler<PinCodeNotFoundError>;
  [ErrorInstance.NOTFOUND_EMAIL_SET_PASSWORD_TOKEN]: ErrorHandler<NotFoundEmailSetPasswordError>;
  [ErrorInstance.ACCOUNT_LOCKED]: ErrorHandler<AccountLockedError>;
  [ErrorInstance.INVALID_CREDENTIALS]: ErrorHandler<InvalidCredentialsError>;
  [ErrorInstance.RESET_PASSWORD_TOKEN_REQUEST_TOO_SOON]: ErrorHandler<ResetPasswordTokenRequestTooSoonError>;
  [ErrorInstance.RESET_PASSWORD_TOKEN_ACCOUNT_PENDING]: ErrorHandler<ResetPasswordTokenAccountPendingError>;
  [ErrorInstance.NOT_MATCH_ACCOUNT_UPDATE_PASSWORD]: ErrorHandler<NotMatchAccountUpdatePasswordError>;
  [ErrorInstance.RESET_PASSWORD_TOKEN_NOT_FOUND]: ErrorHandler<ResetPasswordTokenNotFoundError>;
  [ErrorInstance.EMAIL_NOT_EXIST]: ErrorHandler<EmailNotExistError>;
  [ErrorInstance.AUTHORIZATION_HEADER_MISSING]: ErrorHandler<AuthorizationHeaderMissingError>;
  [ErrorInstance.USER_PROFILE_CREATED]: ErrorHandler<UserProfileCreatedError>;
  [ErrorInstance.USER_NOT_EXIST]: ErrorHandler<UserNotExistError>;
  [ErrorInstance.USER_PROFILE_NOT_EXIST]: ErrorHandler<UserProfileNotExistError>;
};

class _ErrorMiddlewareHandler {
  static instance: _ErrorMiddlewareHandler;
  private mappingHandler: MappingHandler = {
    [ErrorInstance.EMAIL_ALREADY_PENDING_VERIFICATION]: this._emailAlreadyPendingVerificationErrorHandler,
    [ErrorInstance.EMAIL_EXIST]: this._emailExistErrorHandler,
    [ErrorInstance.VALIDATION_REQUEST_BODY]: this._validateRequestBodyErrorHandler,
    [ErrorInstance.VERIFICATION_PENDING_OTP_EXPIRED]: this._verificationPendingOtpExpiredErrorHandler,
    [ErrorInstance.VERIFIED_NO_PASSWORD]: this._verifiedNoPasswordErrorHandler,
    [ErrorInstance.UNKNOWN]: this._unknownErrorHandler,
    [ErrorInstance.PIN_CODE_GONE]: this._pinCodeGoneErrorHandler,
    [ErrorInstance.PIN_CODE_EXPIRED]: this._pinCodeExpiredErrorHandler,
    [ErrorInstance.PIN_CODE_INVALID]: this._pinCodeInvalidErrorHandler,
    [ErrorInstance.JWT_TOKEN_INVALID]: this._tokenInvalidErrorHandler,
    [ErrorInstance.JWT_TOKEN_EXPIRED]: this._tokenExpiredErrorHandler,
    [ErrorInstance.PIN_CODE_REQUEST_TOO_SOON]: this._pinCodeRequestTooSoonErrorHandler,
    [ErrorInstance.ACCOUNT_PASSWORD_UPDATED]: this._accountPasswordUpdatedErrorHandler,
    [ErrorInstance.PIN_CODE_NOTFOUND]: this._pinCodeNotFoundErrorHandler,
    [ErrorInstance.NOTFOUND_EMAIL_SET_PASSWORD_TOKEN]: this._notFoundEmailSetPasswordTokenErrorHandler,
    [ErrorInstance.ACCOUNT_LOCKED]: this._accountLockedErrorHandler,
    [ErrorInstance.INVALID_CREDENTIALS]: this._invalidCredentialsErrorHandler,
    [ErrorInstance.RESET_PASSWORD_TOKEN_REQUEST_TOO_SOON]: this._resetPasswordTokenRequestTooSoonErrorHandler,
    [ErrorInstance.RESET_PASSWORD_TOKEN_ACCOUNT_PENDING]: this._resetPasswordTokenAccountPendingErrorHandler,
    [ErrorInstance.NOT_MATCH_ACCOUNT_UPDATE_PASSWORD]: this._notMatchAccountUpdatePasswordErrorHandler,
    [ErrorInstance.RESET_PASSWORD_TOKEN_NOT_FOUND]: this._resetPasswordTokenNotFoundErrorHandler,
    [ErrorInstance.EMAIL_NOT_EXIST]: this._emailNotExistErrorHandler,
    [ErrorInstance.AUTHORIZATION_HEADER_MISSING]: this._authorizationHeaderMissingErrorHandler,
    [ErrorInstance.USER_PROFILE_CREATED]: this._userProfileCreatedErrorHandler,
    [ErrorInstance.USER_NOT_EXIST]: this._userNotExistErrorHandler,
    [ErrorInstance.USER_PROFILE_NOT_EXIST]: this._userProfileNotExistErrorHandler
  };

  private constructor() {}

  static getInstance() {
    if (!_ErrorMiddlewareHandler.instance) {
      _ErrorMiddlewareHandler.instance = new _ErrorMiddlewareHandler();
    }

    return _ErrorMiddlewareHandler.instance;
  }

  private _unknownErrorHandler(response: Response, error: Error) {
    const { message } = error;
    const _error = new UnknownError({ message });
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

  private _pinCodeGoneErrorHandler(response: Response, error: PinCodeGoneError) {
    sendErrorResponse<PinCodeGoneError['details']>({
      response,
      content: error
    });
  }

  private _pinCodeExpiredErrorHandler(response: Response, error: PinCodeExpiredError) {
    sendErrorResponse<PinCodeExpiredError['details']>({
      response,
      content: error
    });
  }

  private _pinCodeInvalidErrorHandler(response: Response, error: PinCodeInvalidError) {
    sendErrorResponse<PinCodeInvalidError['details']>({
      response,
      content: error
    });
  }

  private _tokenInvalidErrorHandler(response: Response, error: JWTTokenInvalidError) {
    sendErrorResponse<JWTTokenInvalidError['details']>({
      response,
      content: error
    });
  }

  private _tokenExpiredErrorHandler(response: Response, error: JWTTokenExpiredError) {
    sendErrorResponse<JWTTokenExpiredError>({
      response,
      content: error
    });
  }

  private _pinCodeRequestTooSoonErrorHandler(response: Response, error: PinCodeRequestTooSoonError) {
    sendErrorResponse<PinCodeRequestTooSoonError['details']>({
      response,
      content: error
    });
  }

  private _accountPasswordUpdatedErrorHandler(response: Response, error: AccountPasswordUpdatedError) {
    sendErrorResponse<AccountPasswordUpdatedError['details']>({
      response,
      content: error
    });
  }

  private _pinCodeNotFoundErrorHandler(response: Response, error: PinCodeNotFoundError) {
    sendErrorResponse<PinCodeNotFoundError['details']>({
      response,
      content: error
    });
  }

  private _notFoundEmailSetPasswordTokenErrorHandler(response: Response, error: NotFoundEmailSetPasswordError) {
    sendErrorResponse<NotFoundEmailSetPasswordError['details']>({
      response,
      content: error
    });
  }

  private _accountLockedErrorHandler(response: Response, error: AccountLockedError) {
    sendErrorResponse<AccountLockedError['details']>({ response, content: error });
  }

  private _invalidCredentialsErrorHandler(response: Response, error: InvalidCredentialsError) {
    sendErrorResponse<InvalidCredentialsError['details']>({ response, content: error });
  }

  private _resetPasswordTokenRequestTooSoonErrorHandler(
    response: Response,
    error: ResetPasswordTokenRequestTooSoonError
  ) {
    sendErrorResponse<ResetPasswordTokenRequestTooSoonError['details']>({
      response,
      content: error
    });
  }

  private _resetPasswordTokenAccountPendingErrorHandler(
    response: Response,
    error: ResetPasswordTokenAccountPendingError
  ) {
    sendErrorResponse({
      response,
      content: error
    });
  }

  private _notMatchAccountUpdatePasswordErrorHandler(response: Response, error: NotMatchAccountUpdatePasswordError) {
    sendErrorResponse({ response, content: error });
  }

  private _resetPasswordTokenNotFoundErrorHandler(response: Response, error: ResetPasswordTokenNotFoundError) {
    sendErrorResponse({ response, content: error });
  }

  private _emailNotExistErrorHandler(response: Response, error: EmailNotExistError) {
    sendErrorResponse({
      response,
      content: error
    });
  }

  private _authorizationHeaderMissingErrorHandler(response: Response, error: AuthorizationHeaderMissingError) {
    sendErrorResponse({
      response,
      content: error
    });
  }

  private _userProfileCreatedErrorHandler(response: Response, error: UserProfileCreatedError) {
    sendErrorResponse({
      response,
      content: error
    });
  }

  private _userNotExistErrorHandler(response: Response, error: UserNotExistError) {
    sendErrorResponse({
      response,
      content: error
    });
  }

  private _userProfileNotExistErrorHandler(response: Response, error: UserProfileNotExistError) {
    sendErrorResponse({
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
