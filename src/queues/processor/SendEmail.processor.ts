import { JobsSendEmail, JobsSendEmailValues } from '../../constants/jobs.constant.js';
import { SendEmailService } from '../../services/SendEmail.service.js';
import {
  ResendSetPasswordTokenJobType,
  ResetPasswordTokenJobType,
  VerificationEmailSuccessJobType,
  VerifyEmailJobType
} from '../jobs/SendEmail.job.js';

type SendEmailVerifyParams = Pick<VerifyEmailJobType, 'data'>;
type SendEmailVerificationSuccessParams = Pick<VerificationEmailSuccessJobType, 'data'>;
type ResendSetPasswordTokenParams = Pick<ResendSetPasswordTokenJobType, 'data'>;
type ResetPasswordTokenParams = Pick<ResetPasswordTokenJobType, 'data'>;

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
    [JobsSendEmail['VERIFY_EMAIL']]: this._sendEmailVerify,
    [JobsSendEmail.VERIFICATION_EMAIL_SUCCESS]: this._sendEmailVerificationSuccess,
    [JobsSendEmail.RESEND_SET_PASSWORD_TOKEN]: this._resendSetPasswordToken,
    [JobsSendEmail.RESET_PASSWORD_TOKEN]: this._resetPasswordToken
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

  private async _sendEmailVerificationSuccess({ data }: SendEmailVerificationSuccessParams): Promise<void> {
    const sendEmailService = new SendEmailService();
    await sendEmailService.verificationEmailSuccess({ data });
  }

  private async _resendSetPasswordToken({ data }: ResendSetPasswordTokenParams): Promise<void> {
    const sendEmailService = new SendEmailService();
    await sendEmailService.resendSetPasswordToken({ data });
  }

  private async _resetPasswordToken({ data }: ResetPasswordTokenParams): Promise<void> {
    const sendEmailService = new SendEmailService();
    await sendEmailService.resetPasswordToken({ data });
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
