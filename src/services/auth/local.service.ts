import { decode, JwtPayload } from 'jsonwebtoken';
import { UserAuthRoleEnum } from 'src/enums/userAuthRole.enum.js';
import { NotMatchAccountUpdatePasswordError } from 'src/errors/NotMatchAccountUpdatePassword.error.js';
import { PinCodeGoneError } from 'src/errors/PinCodeGone.error.js';
import { PinCodeNotFoundError } from 'src/errors/PinCodeNotFound.error.js';
import { PinCodeRequestTooSoonError } from 'src/errors/PinCodeRequestTooSoon.error.js';
import { ResetPasswordTokenAccountPendingError } from 'src/errors/ResetPasswordTokenAccountPending.error.js';
import {
  ForgotPasswordRequestBody,
  LoginRequestBody,
  RefreshTokenRequestBody,
  ResendResetPasswordTokenRequestBody,
  ResendSetPasswordTokenRequestBody,
  ResendVerifyEmailRequestBody,
  ResetPasswordRequestBody,
  SetPasswordRequestBody,
  VerifyEmailRegisterRequestBody
} from 'src/schema/zod/api/requests/auth/local.schema.js';
import { env } from '../../configs/env.config.js';
import { AccountLockedError } from '../../errors/AccountLocked.error.js';
import { AccountPasswordUpdatedError } from '../../errors/AccountPasswordUpdated.error.js';
import { EmailAlreadyPendingVerificationError } from '../../errors/EmailAlreadyPendingVerification.error.js';
import { EmailExistError } from '../../errors/EmailExist.error.js';
import { InvalidCredentialsError } from '../../errors/InvalidCredentials.error.js';
import { JWTTokenInvalidError } from '../../errors/JwtTokenInvalid.error.js';
import { NotFoundEmailSetPasswordError } from '../../errors/NotFoundEmailSetPassword.error.js';
import { PinCodeExpiredError } from '../../errors/PinCodeExpired.error.js';
import { PinCodeInvalidError } from '../../errors/PinCodeInValid.error.js';
import { VerificationPendingOtpExpiredError } from '../../errors/VerificationPendingOtpExpired.error.js';
import { VerifiedNoPasswordError } from '../../errors/VerifiedNoPassword.error.js';
import { SendEmailJobs } from '../../queues/jobs/SendEmail.job.js';
import { SendEmailQueue } from '../../queues/queues/SendEmail.queue.js';
import { UserAuthRepository } from '../../repositories/UserAuth.repository.js';
import { JWTGenerator } from '../../utils/JwtGenerator.util.js';
import { comparePassword, hashPassword } from '../../utils/password.util.js';
import { PinCodeVerifyEmail } from '../../utils/pinCode/core/PinCodeVerifyEmail.js';
import { SubjectSendEmail } from '../../utils/subjectSendEmail.util.js';
import { IoredisService } from '../external/Ioredis.service.js';
import { EmailNotExistError } from 'src/errors/EmailNotExist.error.js';
import { ResetPasswordTokenNotFoundError } from 'src/errors/ResetPasswordTokenNotFound.error.js';
import { ResetPasswordTokenRequestTooSoonError } from 'src/errors/ResetPasswordTokenTooSoon.error.js';

type RegisterParams = {
  email: string;
};

type VerifyEmailRegisterParams = VerifyEmailRegisterRequestBody;

type SetPasswordParams = SetPasswordRequestBody;

type ResendVerifyEmailParam = ResendVerifyEmailRequestBody;

type ResendSetPasswordTokenParams = ResendSetPasswordTokenRequestBody;

type LoginParams = LoginRequestBody;

type ForgotPasswordParams = ForgotPasswordRequestBody;

type ResetPasswordParams = ResetPasswordRequestBody;

type ResendResetPasswordTokenParams = ResendResetPasswordTokenRequestBody;

type RefreshTokenParams = RefreshTokenRequestBody;

type LoginReturns = {
  accessToken: string;
  refreshToken: string;
};

type VerifyEmailRegisterReturns = {
  tokenSetPassword: string;
  email: string;
};

interface IAuthLocalService {
  register: (params: RegisterParams) => Promise<void>;
  verifyEmailRegister: (params: VerifyEmailRegisterParams) => Promise<VerifyEmailRegisterReturns>;
  resendVerifyEmail: (params: ResendVerifyEmailParam) => Promise<void>;
  resendSetPasswordToken: (params: ResendSetPasswordTokenParams) => Promise<void>;
  login: (params: LoginParams) => Promise<LoginReturns>;
  forgotPassword: (params: ForgotPasswordParams) => Promise<void>;
  resetPassword: (params: ResetPasswordParams) => Promise<{ accessToken: string; refreshToken: string }>;
  resendResetPasswordToken: (params: ResendResetPasswordTokenParams) => Promise<void>;
  refreshToken: (params: RefreshTokenParams) => Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
}

export class AuthLocalService implements IAuthLocalService {
  private _pinCodeExpiredTimeMinute: number = Number(env.expiredTime.minute.PIN_CODE_VERIFY_EMAIL_REGISTER);
  private _pinCodeExpiredTimeMs: number = this._pinCodeExpiredTimeMinute * 60 * 1000;
  private _pinCodeResendAvailableMinute: number = Number(env.pinCode.verifyEmail.RESEND_AVAILABLE_MINUTE);
  private _pinCodeResendAvailableMs: number = this._pinCodeResendAvailableMinute * 60 * 1000;
  private _pinCodeCoolDownTimeMinute: number = Number(env.coolDownTime.minute.PIN_CODE_VERIFY_EMAIL);
  private _pinCodeCoolDownTimeSecond: number = 60 * this._pinCodeCoolDownTimeMinute;
  private _resetPasswordTokenCoolDownTimeMinute: number = Number(env.coolDownTime.minute.RESET_PASSWORD_TOKEN);
  private _resetPasswordTokenCoolDownTimeSecond: number = this._resetPasswordTokenCoolDownTimeMinute * 60;
  private _userAuthRepository: UserAuthRepository;
  private _ioredisService: IoredisService;

  constructor(userAuthRepository: UserAuthRepository, ioredisService: IoredisService) {
    this._userAuthRepository = userAuthRepository;
    this._ioredisService = ioredisService;
  }

  public async register({ email }: RegisterParams) {
    const userAuthRepository = new UserAuthRepository();
    const userAuthDocument = await userAuthRepository.findByEmail({ email });
    if (userAuthDocument) {
      if (!userAuthDocument.isSetPassword) {
        throw new VerifiedNoPasswordError({});
      }
      throw new EmailExistError({});
    }

    const dataGetPinCodeVerifyEmail = await this._ioredisService.getPinCodeVerifyEmail({ email });
    if (dataGetPinCodeVerifyEmail) {
      const { expiredAt } = dataGetPinCodeVerifyEmail;
      const currentTime = Date.now();

      // Convert pinCodeExpiredTime ( second ) to millisecond
      const pinCodeExpiresAtMs = Number(expiredAt) * 1000;

      // Calculator sentAt time by pinCodeExpiresAtMs - pinCodeExpiredTimeMs convert from pinCodeExpiresTimeMinute
      const sentAt = pinCodeExpiresAtMs - this._pinCodeExpiredTimeMs;

      // Calculator condition resend pinCode (otp)
      const elapsedMs = currentTime - sentAt;
      const isResendAvailable = elapsedMs >= this._pinCodeResendAvailableMs;
      const remainingMs = !isResendAvailable ? this._pinCodeResendAvailableMs - elapsedMs : 0;

      if (currentTime > pinCodeExpiresAtMs) {
        throw new VerificationPendingOtpExpiredError({
          errorDetails: {
            resendAvailable: true,
            expiredAt: pinCodeExpiresAtMs,
            sentAt: sentAt
          }
        });
      }

      throw new EmailAlreadyPendingVerificationError({
        errorDetails: {
          expiresAt: pinCodeExpiresAtMs,
          sentAt,
          resendAvailable: isResendAvailable,
          remainingMs
        }
      });
    }

    const pinCodeVerifyEmail = new PinCodeVerifyEmail();
    const pinCode = pinCodeVerifyEmail.generate();
    const { expiredTimeAtPinCode } = await this._ioredisService.savePinCodeVerifyEmail({ email, pinCode });
    const subject = SubjectSendEmail.verifyEmail();
    const job = SendEmailJobs.createVerifyEmail({
      to: email,
      otp: pinCode,
      subject,
      otpExpiredAt: expiredTimeAtPinCode
    });
    const sendEmailQueueInstance = SendEmailQueue.getInstance();
    sendEmailQueueInstance.addJobSendEmailVerify(job);
    return;
  }

  public async verifyEmailRegister({
    email,
    otp: pinCode
  }: VerifyEmailRegisterParams): Promise<VerifyEmailRegisterReturns> {
    const dataGetPinCodeVerifyEmail = await this._ioredisService.getPinCodeVerifyEmail({ email });
    if (!dataGetPinCodeVerifyEmail) {
      throw new PinCodeGoneError();
    }

    const { pinCode: pinCodeInRedis, expiredAt } = dataGetPinCodeVerifyEmail;

    if (Number(pinCode) !== pinCodeInRedis) {
      throw new PinCodeInvalidError();
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime > expiredAt) {
      throw new PinCodeExpiredError();
    }

    await this._ioredisService.removePinCodeVerifyEmail({ email });
    const userAuth = await this._userAuthRepository.createRegisterLocal({ email });
    const tokenSetPassword = JWTGenerator.createPassword({ userAuthId: userAuth.id });
    const { jti, exp } = decode(tokenSetPassword) as JwtPayload;
    console.log(jti);
    await this._userAuthRepository.verifyEmailRegister({ userAuthId: userAuth.id, jti: jti as string });
    const jobSendEmailVerificationSuccess = SendEmailJobs.createVerificationEmailSuccess({
      to: email,
      tokenSetPassword: tokenSetPassword,
      expiresAt: exp as number
    });

    await SendEmailQueue.getInstance().addJobSendEmailVerificationSuccess(jobSendEmailVerificationSuccess);
    return { tokenSetPassword, email };
  }

  public async setPassword({ password, passwordConfirm, tokenSetPassword }: SetPasswordParams) {
    const { sub, jti } = JWTGenerator.verifyToken({ token: tokenSetPassword, typeToken: 'CREATE_PASSWORD_TOKEN' });
    const userAuth = await this._userAuthRepository.findById({ userAuthId: sub as string });
    if (!userAuth) {
      throw new JWTTokenInvalidError({ message: 'TokenSetPassword invalid' });
    }

    if (!userAuth.jtiSetPassword && userAuth.password) {
      throw new AccountPasswordUpdatedError();
    }

    if (userAuth.jtiSetPassword !== jti) {
      throw new JWTTokenInvalidError({ message: 'TokenSetPassword invalid' });
    }

    await this._userAuthRepository.createPassword({ userAuth: userAuth, password, passwordConfirm });

    const { accessToken } = JWTGenerator.accessToken({
      userAuthId: sub as string,
      role: userAuth.role
    });
    const { refreshToken, jti: jtiRefreshToken } = JWTGenerator.refreshToken({ userAuthId: sub as string });
    await this._ioredisService.saveRefreshTokenWhitelist({ userAuthId: sub as string, jti: jtiRefreshToken });
    return { accessToken, refreshToken };
  }

  public async resendVerifyEmail({ email }: ResendVerifyEmailParam): Promise<void> {
    const dataPinCode = await this._ioredisService.getPinCodeVerifyEmail({ email });
    if (!dataPinCode) {
      throw new PinCodeNotFoundError({});
    }

    const { createdAt } = dataPinCode;
    const currentTime = Math.floor(Date.now() / 1000);
    const conditionResend = currentTime >= createdAt + this._pinCodeCoolDownTimeSecond;
    if (!conditionResend) {
      throw new PinCodeRequestTooSoonError({ message: 'Request resend pinCode verify email too soon, please wait.' });
    }

    const newPinCode = new PinCodeVerifyEmail().generate();
    const { expiredTimeAtPinCode } = await this._ioredisService.savePinCodeVerifyEmail({
      email,
      pinCode: newPinCode
    });

    const subject = SubjectSendEmail.verifyEmail();

    const job = SendEmailJobs.createVerifyEmail({
      to: email,
      subject: subject,
      otp: newPinCode,
      otpExpiredAt: expiredTimeAtPinCode
    });

    await SendEmailQueue.getInstance().addJobSendEmailVerify(job);
    return;
  }

  public async resendSetPasswordToken({ email }: ResendSetPasswordTokenParams) {
    const userAuthDocument = await this._userAuthRepository.findByEmail({ email });

    if (!userAuthDocument) {
      throw new NotFoundEmailSetPasswordError({});
    }

    if (!userAuthDocument.jtiSetPassword) {
      throw new AccountPasswordUpdatedError();
    }

    const setPasswordToken = JWTGenerator.createPassword({ userAuthId: userAuthDocument.id as string });
    const { jti, exp } = decode(setPasswordToken) as JwtPayload;

    await this._userAuthRepository.updateJtiSetPassword({ userAuth: userAuthDocument, jtiSetPassword: jti as string });

    const job = SendEmailJobs.createResendSetPasswordToken({
      to: email,
      expiresAt: exp as number,
      tokenSetPassword: setPasswordToken
    });

    await SendEmailQueue.getInstance().addJobResendSetPasswordToken(job);
  }

  public async login({ email, password }: LoginParams): Promise<LoginReturns> {
    //TODO: Optimization logic accessToken and refreshToken generator for many devices
    const userAuth = await this._userAuthRepository.findByEmail({ email });
    if (!userAuth) {
      throw new InvalidCredentialsError({});
    }

    const isMatchPassword = await comparePassword({ password, encryptedPassword: userAuth.password as string });
    if (!isMatchPassword) {
      throw new InvalidCredentialsError({});
    }

    if (userAuth.blockedStatus?.isBlocked) {
      throw new AccountLockedError({
        messageBlocked: userAuth.blockedStatus.message || ''
      });
    }

    const { accessToken } = JWTGenerator.accessToken({ userAuthId: userAuth.id, role: userAuth.role });
    const { refreshToken, jti } = JWTGenerator.refreshToken({ userAuthId: userAuth.id });
    await this._ioredisService.saveRefreshTokenWhitelist({ userAuthId: userAuth.id, jti });

    return { accessToken, refreshToken };
  }

  public async forgotPassword({ email }: ForgotPasswordParams): Promise<void> {
    const userAuth = await this._userAuthRepository.findByEmail({ email });
    if (!userAuth || !userAuth.password) return;
    const resetPasswordTokenInRedis = await this._ioredisService.getResetPasswordToken({ userAuthId: userAuth.id });
    if (resetPasswordTokenInRedis) {
      const { expiredAt, createdAt } = resetPasswordTokenInRedis;
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime < expiredAt) {
        const isResendAvailable = currentTime - (createdAt + this._resetPasswordTokenCoolDownTimeSecond) > 0;
        const remainingMS = isResendAvailable
          ? 0
          : createdAt + this._resetPasswordTokenCoolDownTimeSecond - currentTime;
        throw new ResetPasswordTokenAccountPendingError({
          errorDetails: {
            resendAvailable: isResendAvailable,
            sentAt: createdAt,
            expiresAt: expiredAt,
            remainingMs: remainingMS
          }
        });
      }
    }
    const { token, expiresAt, jti } = JWTGenerator.resetPasswordToken({ userAuthId: userAuth.id });
    await this._ioredisService.saveResetPasswordToken({ userAuthId: userAuth.id, jti, expiresAt });
    const job = SendEmailJobs.createResetPasswordToken({ to: email, tokenResetPassword: token, expiresAt });
    await SendEmailQueue.getInstance().addJobResetPasswordToken(job);
    return;
  }

  public async resetPassword({
    resetPasswordToken,
    password
  }: ResetPasswordParams): Promise<{ accessToken: string; refreshToken: string }> {
    const { sub, jti } = JWTGenerator.verifyToken({
      token: resetPasswordToken,
      typeToken: 'RESET_PASSWORD_TOKEN'
    });

    const dataRedis = await this._ioredisService.getResetPasswordToken({ userAuthId: sub as string });
    if (!dataRedis) {
      throw new JWTTokenInvalidError({ message: 'ResetPasswordToken invalid' });
    }

    const { jti: jtiOfRedis } = dataRedis;

    if (jti !== jtiOfRedis) {
      throw new JWTTokenInvalidError({ message: 'ResetPasswordToken invalid' });
    }

    const newPassword = await hashPassword({ password });
    const updatePassword = await this._userAuthRepository.updatePassword({ userAuthId: sub as string, newPassword });
    if (!updatePassword) {
      throw new NotMatchAccountUpdatePasswordError({});
    }

    await this._ioredisService.removeResetPasswordToken({ userAuthId: sub as string });
    const { accessToken } = JWTGenerator.accessToken({ userAuthId: sub as string, role: UserAuthRoleEnum.CUSTOMER });
    const { refreshToken, jti: jtiRefreshToken } = JWTGenerator.refreshToken({ userAuthId: sub as string });
    await this._ioredisService.saveRefreshTokenWhitelist({ userAuthId: sub as string, jti: jtiRefreshToken });

    return { accessToken, refreshToken };
  }

  public async resendResetPasswordToken({ email }: ResendResetPasswordTokenParams): Promise<void> {
    const userAuth = await this._userAuthRepository.findByEmail({ email });
    if (!userAuth) {
      throw new EmailNotExistError({});
    }
    const resetPasswordTokenData = await this._ioredisService.getResetPasswordToken({ userAuthId: userAuth.id });
    if (!resetPasswordTokenData) {
      throw new ResetPasswordTokenNotFoundError({});
    }

    const { createdAt, expiredAt } = resetPasswordTokenData;
    const currentTime = Math.floor(Date.now() / 1000);
    if (createdAt + this._resetPasswordTokenCoolDownTimeSecond > currentTime) {
      throw new ResetPasswordTokenRequestTooSoonError({
        errorDetails: {
          resendAvailable: false,
          expiresAt: expiredAt,
          remainingMs: createdAt + this._resetPasswordTokenCoolDownTimeSecond - currentTime,
          sentAt: createdAt
        }
      });
    }

    const {
      token: newResetPasswordToken,
      jti: newJtiResetPasswordToken,
      expiresAt: newExpiresAtResetPasswordToken
    } = JWTGenerator.resetPasswordToken({ userAuthId: userAuth.id });

    await this._ioredisService.saveResetPasswordToken({
      userAuthId: userAuth.id as string,
      jti: newJtiResetPasswordToken,
      expiresAt: newExpiresAtResetPasswordToken
    });

    const job = SendEmailJobs.createResendResetPasswordToken({
      to: email,
      expiresAt: newExpiresAtResetPasswordToken,
      tokenResetPassword: newResetPasswordToken
    });

    await SendEmailQueue.getInstance().addJobResendResetPasswordToken(job);
    return;
  }

  public async refreshToken({ refreshToken }: RefreshTokenParams): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    //TODO: Optimization logic refreshToken for many devices
    const { jti, sub } = decode(refreshToken) as JwtPayload;

    const jtiExistInWhitelist = await this._ioredisService.checkExistRefreshTokenWhitelist({
      userAuthId: sub as string,
      jti: jti as string
    });

    if (!jtiExistInWhitelist) {
      throw new JWTTokenInvalidError({ message: 'RefreshToken invalid' });
    }

    await this._ioredisService.removeRefreshTokenWhitelist({ userAuthId: sub as string, jti: jti as string });

    const { accessToken: newAccessToken } = JWTGenerator.accessToken({
      userAuthId: sub as string,
      role: UserAuthRoleEnum.CUSTOMER
    });
    const { refreshToken: newRefreshToken, jti: newJtiRefreshToken } = JWTGenerator.refreshToken({
      userAuthId: sub as string
    });

    await this._ioredisService.saveRefreshTokenWhitelist({ userAuthId: sub as string, jti: newJtiRefreshToken });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
