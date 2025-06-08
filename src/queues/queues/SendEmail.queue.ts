import { Queue } from 'bullmq';
import { Queues } from '../../constants/queues.constant.js';
import { Redis } from 'ioredis';
import {
  ResendSetPasswordTokenJobType,
  ResetPasswordTokenJobType,
  VerificationEmailSuccessJobType,
  VerifyEmailJobType
} from '../jobs/SendEmail.job.js';
import { QueueLogger } from '../../loggers/bullMQ.logger.js';
import winston from 'winston';
import { bullMQConnection } from '../../utils/bullMQConnection.util.js';

type WriteLogAddJobSuccess = {
  jobName: string;
  jobId: string;
};

export class SendEmailQueue {
  static instance: SendEmailQueue;
  private _logger: winston.Logger = QueueLogger;
  private readonly _connection: Redis;
  private readonly _name: string = Queues.SEND_EMAIL;
  private _queue: Queue | undefined;

  constructor() {
    this._connection = bullMQConnection();
    this._initQueue();
  }

  static getInstance() {
    if (!SendEmailQueue.instance) {
      this.instance = new SendEmailQueue();
    }
    return SendEmailQueue.instance;
  }

  private _initQueue() {
    this._queue = new Queue(this._name, { connection: this._connection });
  }

  private _writeLogAddJobSuccess({ jobName, jobId }: WriteLogAddJobSuccess) {
    this._logger.info(`Add job ${jobName}-${jobId} into queue ${this._queue?.name} success`);
  }

  private _writeLogAddJobError({ error }: { error: unknown }) {
    this._logger.error('Add job sendEmailVerify fail with error: ', error);
  }

  private _isSendEmailQueueInstance() {
    if (!this._queue) {
      throw new Error('SendEmailQueue not create instance');
    }
  }

  public async addJobSendEmailVerify(job: VerifyEmailJobType) {
    this._isSendEmailQueueInstance();
    const { name, data, jobOptions } = job;
    try {
      await this._queue!.add(name, data, jobOptions);
      this._writeLogAddJobSuccess({ jobName: name, jobId: jobOptions.jobId as string });
    } catch (error) {
      this._writeLogAddJobError({ error });
      throw new Error(`Add job sendEmailVerify fail with error: ${(error as Error).message}`);
    }
  }

  public async addJobSendEmailVerificationSuccess(job: VerificationEmailSuccessJobType) {
    this._isSendEmailQueueInstance();
    const { data, jobOptions, name } = job;
    try {
      await this._queue!.add(name, data, jobOptions);
      this._writeLogAddJobSuccess({ jobName: name, jobId: jobOptions.jobId as string });
    } catch (error) {
      this._writeLogAddJobError({ error });
      throw new Error(`Add job sendEmailVerificationSuccess fail with error: ${(error as Error).message}`);
    }
  }

  public async addJobResendSetPasswordToken(job: ResendSetPasswordTokenJobType) {
    this._isSendEmailQueueInstance();
    const { data, jobOptions, name } = job;

    try {
      await this._queue!.add(name, data, jobOptions);
      this._writeLogAddJobSuccess({ jobName: name, jobId: jobOptions.jobId as string });
    } catch (error) {
      this._writeLogAddJobError({ error });
      throw new Error(`Add job resendSetPasswordToken fail with error: ${(error as Error).message}`);
    }
  }

  public async addJobResetPasswordToken(job: ResetPasswordTokenJobType) {
    this._isSendEmailQueueInstance();

    const { data, jobOptions, name } = job;

    try {
      await this._queue!.add(name, data, jobOptions);
      this._writeLogAddJobSuccess({ jobName: name, jobId: jobOptions.jobId as string });
    } catch (error) {
      this._writeLogAddJobError({ error });
      throw new Error(`Add job resetPasswordToken fail with error: ${(error as Error).message}`);
    }
  }
}
