import { env } from '../configs/env.config.js';
import { SubjectSendEmail } from '../constants/subjectSendEmail.constant.js';
import {
  ResendSetPasswordTokenJobType,
  VerificationEmailSuccessJobType,
  VerifyEmailJobType
} from '../queues/jobs/SendEmail.job.js';
import { NodemailerManager } from '../configs/NodemailerManager.config.js';
import { formatTime } from '../utils/formatTime.util.js';
import { Transporter } from 'nodemailer';

type VerifyEmailParams = Pick<VerifyEmailJobType, 'data'>;
type VerificationEmailSuccessParams = Pick<VerificationEmailSuccessJobType, 'data'>;
type ResendSetPasswordTokenParams = Pick<ResendSetPasswordTokenJobType, 'data'>;

interface ISendEmailService {
  verifyEmail: (params: VerifyEmailParams) => Promise<void>;
  verificationEmailSuccess: (params: VerificationEmailSuccessParams) => Promise<void>;
  resendSetPasswordToken: (params: ResendSetPasswordTokenParams) => Promise<void>;
}

export class SendEmailService implements ISendEmailService {
  private _transporter: Transporter = NodemailerManager.getInstance().getInstanceTransporter();

  constructor() {}

  public async verifyEmail({ data }: VerifyEmailParams) {
    try {
      const { to, subject, otp, otpExpiredAt } = data;
      const otpExpiredTimeFormat = formatTime({ second: otpExpiredAt });
      const effectiveTime = env.expiredTime.minute.PIN_CODE_VERIFY_EMAIL_REGISTER;
      await this._transporter.sendMail({
        from: 'lapbee@gmail.com',
        to,
        subject,
        html: `<div>
              <div>Mã OTP: <h4>${otp}</h4></div>
              <h5>Có hiệu lực trong ${effectiveTime} phút</h5>
              <p>Thời gian hết hạn: ${otpExpiredTimeFormat}</p>
            </div>`
      });
    } catch (error) {
      console.log('Send email verify error: ', error);
      throw new Error(`Send email verify error: ${(error as Error).message}`);
    }
  }

  public async verificationEmailSuccess({ data }: VerificationEmailSuccessParams) {
    try {
      const { to, expiresAt, tokenSetPassword } = data;
      const subject = SubjectSendEmail.VERIFICATION_EMAIL_SUCCESS;
      const urlCallback = `${env.client.urlCallback.SET_PASSWORD}?token=${tokenSetPassword}`;
      const timeExpiresFormat = formatTime({ second: expiresAt });
      await this._transporter.sendMail({
        from: 'lapbee@gmail.com',
        to,
        subject,
        html: `<div>
              <div><h4>Bạn đã xác thực email đăng kí tài khoản thành công</h4></div>
              <h5>Dưới đây là đường dẫn đặt mật khẩu cho tài khoản phòng trường hợp bạn đã xác thực email nhưng chưa đặt mật khẩu cho tài khoản</h5>
              <div>${urlCallback}</div>
              <button>
                <a href=${urlCallback}>Đặt mật khẩu cho tài khoản</a>
              </button>
              <div>Thời hạn sử dụng của đường dẫn đặt lại mật khẩu đến ${timeExpiresFormat}</div>
            </div>`
      });
    } catch (error) {
      console.log('Send email verification success error: ', error);
      throw new Error(`Send email verification success error: ${(error as Error).message}`);
    }
  }

  public async resendSetPasswordToken({ data }: ResendSetPasswordTokenParams) {
    try {
      const { to, expiresAt, tokenSetPassword } = data;
      const subject = SubjectSendEmail.VERIFICATION_EMAIL_SUCCESS;
      const urlCallback = `${env.client.urlCallback.SET_PASSWORD}?token=${tokenSetPassword}`;
      const timeExpiresFormat = formatTime({ second: expiresAt });
      await this._transporter.sendMail({
        from: 'lapbee@gmail.com',
        to,
        subject,
        html: `<div>
              <h5>Dưới đây là đường dẫn đặt mật khẩu cho tài khoản của bạn</h5>
              <div>${urlCallback}</div>
              <button>
                <a href=${urlCallback}>Đặt mật khẩu cho tài khoản</a>
              </button>
              <div>Thời hạn sử dụng của đường dẫn đặt lại mật khẩu đến ${timeExpiresFormat}</div>
            </div>`
      });
    } catch (error) {
      console.log('Send email resend setPasswordToken success error: ', error);
      throw new Error(`Send email resend setPasswordToken success error: ${(error as Error).message}`);
    }
  }
}
