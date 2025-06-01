import { VerifyEmailJobType } from '../queues/jobs/SendEmail.job.js';
import { TransporterInstance } from '../configs/NodemailerManager.config.js';
import { formatTime } from '../utils/formatTime.util.js';

type VerifyEmailParams = Pick<VerifyEmailJobType, 'data'>;

interface ISendEmailService {
  verifyEmail: (params: VerifyEmailParams) => Promise<void>;
}

export class SendEmailService implements ISendEmailService {
  constructor() {}

  public async verifyEmail({ data }: VerifyEmailParams) {
    try {
      const { to, subject, otp, otpExpiredAt } = data;
      const transporter = TransporterInstance;
      const otpExpiredTimeFormat = formatTime({ second: otpExpiredAt });
      await transporter.sendMail({
        from: 'lapbee@gmail.com',
        to,
        subject,
        html: `<div>
              <div>Mã OTP: <h4>${otp}</h4></div>
              <h5>Có hiệu lực trong 5 phút</h5>
              <p>Thời gian hết hạn: ${otpExpiredTimeFormat}</p>
            </div>`
      });
    } catch (error) {
      console.log('Send email verify error: ', error);
      throw new Error(`Send email verify error: ${(error as Error).message}`);
    }
  }
}
