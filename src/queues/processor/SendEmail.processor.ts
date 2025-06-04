import { JobsSendEmailValues } from '../../constants/jobs.constant.js';
import { SendEmailService } from '../../services/SendEmail.service.js';
import { VerifyEmailJobType } from '../jobs/SendEmail.job.js';

type SendEmailVerifyParams = Pick<VerifyEmailJobType, 'data'>;
type HandleParams = {
  name: JobsSendEmailValues;
};

type MappingProcessor = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [key in JobsSendEmailValues]: Function;
};

class _ProcessorSendEmail {
  static instance: _ProcessorSendEmail;
  private _mappingProcessor: MappingProcessor = {
    send_email_verify: this._sendEmailVerify
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
    const handler = this._mappingProcessor[name];
    if (handler) {
      return this._mappingProcessor[name];
    }
    // TODO: Implement write log and alert admin job name not define handler
  }
}

export const ProcessorSendEmail = _ProcessorSendEmail.getInstance();
