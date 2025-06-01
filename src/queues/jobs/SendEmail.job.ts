import winston from 'winston';
import { JobsSendEmailEnum } from '../../enums/jobs.enum.js';
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
  name: JobsSendEmailEnum;
  jobOptions: JobsOptions;
};

interface ISendEmailJobs {
  createVerifyEmail: (params: CreateVerifyEmailParams) => CreateVerifyEmailReturns;
}

class SendEmailJobs implements ISendEmailJobs {
  static instance: SendEmailJobs;
  private _logger: winston.Logger = JobLogger;
  constructor() {}

  static getInstance() {
    if (!SendEmailJobs.instance) {
      SendEmailJobs.instance = new SendEmailJobs();
    }

    return SendEmailJobs.instance;
  }

  createVerifyEmail(data: CreateVerifyEmailParams) {
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
    return { data, name: JobsSendEmailEnum.VERIFY_EMAIL, jobOptions };
  }
}

export type VerifyEmailJobType = CreateVerifyEmailReturns;

export const SendEmailJobsInstance = SendEmailJobs.instance;
