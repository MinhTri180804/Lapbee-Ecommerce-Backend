import { env } from '../../configs/env.config.js';
import { IoredisManager } from '../../configs/ioredisManager.config.js';
import { EmailAlreadyPendingVerificationError } from '../../errors/EmailAlreadyPendingVerification.error.js';
import { EmailExistError } from '../../errors/EmailExist.error.js';
import { VerificationPendingOtpExpiredError } from '../../errors/VerificationPendingOtpExpired.error.js';
import { VerifiedNoPasswordError } from '../../errors/VerifiedNoPassword.error.js';
import { SendEmailJobs } from '../../queues/jobs/SendEmail.job.js';
import { SendEmailQueue } from '../../queues/queues/SendEmail.queue.js';
import { UserAuthRepository } from '../../repositories/UserAuth.repository.js';
import { PinCodeVerifyEmail } from '../../utils/pinCode/core/PinCodeVerifyEmail.js';
import { SubjectSendEmail } from '../../utils/subjectSendEmail.util.js';
import { IoredisService } from '../Ioredis.service.js';

type RegisterParams = {
  email: string;
};

interface IAuthLocalService {
  register: (params: RegisterParams) => Promise<void>;
}

export class AuthLocalService implements IAuthLocalService {
  private _pinCodeExpiredTimeMinute: number = Number(env.expiredTime.minute.PIN_CODE_VERIFY_EMAIL_REGISTER);
  private _pinCodeExpiredTimeMs: number = this._pinCodeExpiredTimeMinute * 60 * 1000;
  private _pinCodeResendAvailableMinute: number = Number(env.pinCode.verifyEmail.RESEND_AVAILABLE_MINUTE);
  private _pinCodeResendAvailableMs: number = this._pinCodeResendAvailableMinute * 60 * 1000;

  constructor() {}

  public async register({ email }: RegisterParams) {
    const userAuthRepository = new UserAuthRepository();
    const userAuthDocument = await userAuthRepository.findByEmail({ email });
    if (userAuthDocument) {
      if (userAuthDocument.isSetPassword) {
        throw new VerifiedNoPasswordError({});
      }
      throw new EmailExistError({});
    }

    const redisInstance = IoredisManager.getInstance().getRedisClient();
    const ioredisService = new IoredisService(redisInstance);
    const pinCodeRegistered = await ioredisService.getPinCodeVerifyEmail({ email });
    if (pinCodeRegistered) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, expiresAt] = pinCodeRegistered.split('-');
      const currentTime = Date.now();

      // Convert pinCodeExpiredTime ( second ) to millisecond
      const pinCodeExpiresAtMs = Number(expiresAt) * 1000;

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
    const { expiredTimeAtPinCode } = await ioredisService.savePinCodeVerifyEmail({ email, pinCode });
    const subject = SubjectSendEmail.verifyEmail();
    const job = SendEmailJobs.createVerifyEmail({
      to: email,
      otp: pinCode,
      subject,
      otpExpiredAt: expiredTimeAtPinCode
    });
    const sendEmailQueueInstance = SendEmailQueue.getInstance();
    await sendEmailQueueInstance.addJobSendEmailVerify(job);
    return;
  }
}
