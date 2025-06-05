import { decode, JwtPayload } from 'jsonwebtoken';
import { PinCodeGoneError } from 'src/errors/PinCodeGone.error.js';
import { env } from '../../configs/env.config.js';
import { EmailAlreadyPendingVerificationError } from '../../errors/EmailAlreadyPendingVerification.error.js';
import { EmailExistError } from '../../errors/EmailExist.error.js';
import { PinCodeExpiredError } from '../../errors/PinCodeExpired.error.js';
import { PinCodeInvalidError } from '../../errors/PinCodeInValid.error.js';
import { VerificationPendingOtpExpiredError } from '../../errors/VerificationPendingOtpExpired.error.js';
import { VerifiedNoPasswordError } from '../../errors/VerifiedNoPassword.error.js';
import { SendEmailJobs } from '../../queues/jobs/SendEmail.job.js';
import { SendEmailQueue } from '../../queues/queues/SendEmail.queue.js';
import { UserAuthRepository } from '../../repositories/UserAuth.repository.js';
import { JWTGenerator } from '../../utils/JwtGenerator.util.js';
import { PinCodeVerifyEmail } from '../../utils/pinCode/core/PinCodeVerifyEmail.js';
import { SubjectSendEmail } from '../../utils/subjectSendEmail.util.js';
import { IoredisService } from '../Ioredis.service.js';
import { VerifyEmailRegisterRequestBody } from 'src/schema/zod/api/requests/auth/local.schema.js';

type RegisterParams = {
  email: string;
};

type VerifyEmailRegisterParams = VerifyEmailRegisterRequestBody;

type VerifyEmailRegisterReturns = {
  tokenSetPassword: string;
  email: string;
};

interface IAuthLocalService {
  register: (params: RegisterParams) => Promise<void>;
  verifyEmailRegister: (params: VerifyEmailRegisterParams) => Promise<VerifyEmailRegisterReturns>;
}

export class AuthLocalService implements IAuthLocalService {
  private _pinCodeExpiredTimeMinute: number = Number(env.expiredTime.minute.PIN_CODE_VERIFY_EMAIL_REGISTER);
  private _pinCodeExpiredTimeMs: number = this._pinCodeExpiredTimeMinute * 60 * 1000;
  private _pinCodeResendAvailableMinute: number = Number(env.pinCode.verifyEmail.RESEND_AVAILABLE_MINUTE);
  private _pinCodeResendAvailableMs: number = this._pinCodeResendAvailableMinute * 60 * 1000;
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
      if (userAuthDocument.isSetPassword) {
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
    const tokenSetPassword = JWTGenerator.setPassword({ userAuthId: userAuth.id });
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
}
