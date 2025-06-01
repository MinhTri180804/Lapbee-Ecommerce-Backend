import { JobsSendEmailEnum } from '../../enums/jobs.enum.js';
import { VerifyEmailJobType } from '../jobs/SendEmail.job.js';

type SendEmailVerifyParams = Pick<VerifyEmailJobType, 'data'>;
type HandleParams = {
  name: JobsSendEmailEnum;
};

class _ProcessorSendEmail {
  static instance: _ProcessorSendEmail;
  private _mappingProcessor = {
    [JobsSendEmailEnum.VERIFY_EMAIL]: this._sendEmailVerify
  };

  private constructor() {}

  static getInstance() {
    if (!_ProcessorSendEmail.instance) {
      _ProcessorSendEmail.instance = new _ProcessorSendEmail();
    }

    return _ProcessorSendEmail.instance;
  }

  private _sendEmailVerify({ data }: SendEmailVerifyParams): Promise<void> {
    const { to, subject, otp } = data;
    //TODO: Implement service send email verify
    return new Promise((resolve) => {
      resolve();
    });
  }

  public handle({ name }: HandleParams) {
    return this._mappingProcessor[name];
  }
}

export const ProcessorSendEmail = _ProcessorSendEmail.instance;
