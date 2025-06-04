import { env } from '../configs/env.config.js';
import { VerifyEmailJobType } from '../queues/jobs/SendEmail.job.js';
import { NodemailerManager } from '../configs/NodemailerManager.config.js';
import { formatTime } from '../utils/formatTime.util.js';
import { Transporter } from 'nodemailer';

type VerifyEmailParams = Pick<VerifyEmailJobType, 'data'>;

interface ISendEmailService {
  verifyEmail: (params: VerifyEmailParams) => Promise<void>;
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
}
