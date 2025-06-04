import winston from 'winston';
import { JobsSendEmail, JobsSendEmailValues } from '../../constants/jobs.constant.js';
import { JobLogger } from '../../loggers/bullMQ.logger.js';
import { JobsOptions } from 'bullmq';

type CreateVerifyEmailParams = {
  to: string;
  subject: string;
  otp: string;
  otpExpiredAt: number;
};

type CreateVerifyEmailReturns = {
  data: CreateVerifyEmailParams;
  name: JobsSendEmailValues;
  jobOptions: JobsOptions;
};

interface ISendEmailJobs {
  createVerifyEmail: (params: CreateVerifyEmailParams) => CreateVerifyEmailReturns;
}

class _SendEmailJobs implements ISendEmailJobs {
  static instance: _SendEmailJobs;
  private _logger: winston.Logger = JobLogger;
  private constructor() {}

  static getInstance() {
    if (!_SendEmailJobs.instance) {
      _SendEmailJobs.instance = new _SendEmailJobs();
    }

    return _SendEmailJobs.instance;
  }

  public createVerifyEmail(data: CreateVerifyEmailParams) {
    const jobOptions: JobsOptions = {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000
      },
      removeOnComplete: true,
      removeOnFail: {
        count: 10
      }
    };
    this._logger.info('Created job send verify email, jobID: ', jobOptions.jobId);
    return { data, name: JobsSendEmail.VERIFY_EMAIL, jobOptions };
  }
}

export type VerifyEmailJobType = CreateVerifyEmailReturns;

export const SendEmailJobs = _SendEmailJobs.getInstance();
