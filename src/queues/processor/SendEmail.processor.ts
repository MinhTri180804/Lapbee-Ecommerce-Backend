import { JobsSendEmailEnum } from '../../enums/jobs.enum.js';
import { VerifyEmailJobType } from '../jobs/SendEmail.job.js';
import { SendEmailService } from '../../services/SendEmail.service.js';

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

  private async _sendEmailVerify({ data }: SendEmailVerifyParams): Promise<void> {
    const sendEmailService = new SendEmailService();
    await sendEmailService.verifyEmail({ data });
  }

  public handle({ name }: HandleParams) {
    return this._mappingProcessor[name];
  }
}

export const ProcessorSendEmail = _ProcessorSendEmail.getInstance();
