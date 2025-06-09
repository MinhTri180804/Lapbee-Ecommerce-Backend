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

type CreateVerificationEmailSuccessParams = {
  to: string;
  tokenSetPassword: string;
  expiresAt: number;
};

type CreateResendSetPasswordTokenParams = {
  to: string;
  tokenSetPassword: string;
  expiresAt: number;
};

type CreateResetPasswordTokenParams = {
  to: string;
  tokenResetPassword: string;
  expiresAt: number;
};

type CreateResendResetPasswordTokenParams = CreateResetPasswordTokenParams;

type CreateVerificationEmailSuccessReturns = {
  data: CreateVerificationEmailSuccessParams;
  name: JobsSendEmailValues;
  jobOptions: JobsOptions;
};

type CreateVerifyEmailReturns = {
  data: CreateVerifyEmailParams;
  name: JobsSendEmailValues;
  jobOptions: JobsOptions;
};

type CreateResendSetPasswordTokenReturns = {
  data: CreateResendSetPasswordTokenParams;
  name: JobsSendEmailValues;
  jobOptions: JobsOptions;
};

type CreateResetPasswordTokenReturns = {
  data: CreateResetPasswordTokenParams;
  name: JobsSendEmailValues;
  jobOptions: JobsOptions;
};

type CreateResendResetpasswordTokenReturns = {
  data: CreateResendResetPasswordTokenParams;
  name: JobsSendEmailValues;
  jobOptions: JobsOptions;
};

interface ISendEmailJobs {
  createVerifyEmail: (params: CreateVerifyEmailParams) => CreateVerifyEmailReturns;
  createVerificationEmailSuccess: (
    params: CreateVerificationEmailSuccessParams
  ) => CreateVerificationEmailSuccessReturns;
  createResendSetPasswordToken: (params: CreateResendSetPasswordTokenParams) => CreateResendSetPasswordTokenReturns;
  createResetPasswordToken: (params: CreateResetPasswordTokenParams) => CreateResetPasswordTokenReturns;
  createResendResetPasswordToken: (
    params: CreateResendResetPasswordTokenParams
  ) => CreateResendResetpasswordTokenReturns;
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

  private _writeLogCreateJobSuccess({ jobId }: { jobId: string }) {
    this._logger.info('Created job send verify email, jobID: ', jobId);
  }

  public createVerifyEmail(data: CreateVerifyEmailParams): CreateVerifyEmailReturns {
    const { to: email } = data;
    const jobOptions: JobsOptions = {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000
      },
      removeOnComplete: true,
      removeOnFail: {
        count: 10
      },
      jobId: `verifyEmail-${encodeURIComponent(email)}`
    };
    this._writeLogCreateJobSuccess({ jobId: jobOptions.jobId as string });
    return { data, name: JobsSendEmail.VERIFY_EMAIL, jobOptions };
  }

  public createVerificationEmailSuccess(
    data: CreateVerificationEmailSuccessParams
  ): CreateVerificationEmailSuccessReturns {
    const { to: email } = data;
    const jobOptions: JobsOptions = {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000
      },
      removeOnComplete: true,
      removeOnFail: {
        count: 10
      },
      jobId: `verificationEmailSuccess-${encodeURIComponent(email)}`
    };
    this._writeLogCreateJobSuccess({ jobId: jobOptions.jobId as string });
    return { data, jobOptions, name: JobsSendEmail.VERIFICATION_EMAIL_SUCCESS };
  }

  public createResendSetPasswordToken(data: CreateResendSetPasswordTokenParams): CreateResendSetPasswordTokenReturns {
    const { to: email } = data;

    const jobOptions: JobsOptions = {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000
      },
      removeOnComplete: true,
      removeOnFail: {
        count: 10
      },
      jobId: `resendSetPasswordToken-${encodeURIComponent(email)}`
    };

    this._writeLogCreateJobSuccess({ jobId: jobOptions.jobId as string });
    return { data, jobOptions, name: JobsSendEmail.RESEND_SET_PASSWORD_TOKEN };
  }

  public createResetPasswordToken(data: CreateResetPasswordTokenParams): CreateResetPasswordTokenReturns {
    const { to: email } = data;

    const jobOptions: JobsOptions = {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000
      },
      removeOnComplete: true,
      removeOnFail: {
        count: 10
      },
      jobId: `resetPasswordToken-${encodeURIComponent(email)}`
    };

    this._writeLogCreateJobSuccess({ jobId: jobOptions.jobId as string });
    return { data, jobOptions, name: JobsSendEmail.RESET_PASSWORD_TOKEN };
  }

  public createResendResetPasswordToken(
    data: CreateResendResetPasswordTokenParams
  ): CreateResendResetpasswordTokenReturns {
    const { to: email } = data;

    const jobOptions: JobsOptions = {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000
      },
      removeOnComplete: true,
      removeOnFail: {
        count: 10
      },
      jobId: `resendResetPasswordToken-${encodeURIComponent(email)}`
    };

    this._writeLogCreateJobSuccess({ jobId: jobOptions.jobId as string });
    return { data, jobOptions, name: JobsSendEmail.RESEND_RESET_PASSWORD_TOKEN };
  }
}

export type VerifyEmailJobType = CreateVerifyEmailReturns;
export type VerificationEmailSuccessJobType = CreateVerificationEmailSuccessReturns;
export type ResendSetPasswordTokenJobType = CreateResendSetPasswordTokenReturns;
export type ResetPasswordTokenJobType = CreateResetPasswordTokenReturns;
export type ResendResetPasswordTokenJobType = CreateResendResetpasswordTokenReturns;

export const SendEmailJobs = _SendEmailJobs.getInstance();
