import { Queue } from 'bullmq';
import { QueuesEnum } from '../../enums/queues.enum.js';
import { Redis } from 'ioredis';
import { VerifyEmailJobType } from '../jobs/SendEmail.job.js';
import { QueueLogger } from '../../loggers/bullMQ.logger.js';
import winston from 'winston';
import { bullMQConnection } from '../../utils/bullMQConnection.util.js';

export class SendEmailQueue {
  static instance: SendEmailQueue;
  private _logger: winston.Logger = QueueLogger;
  private readonly _connection: Redis;
  private readonly _name: string = QueuesEnum.SEND_EMAIL;
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

  public async addJobSendEmailVerify(job: VerifyEmailJobType) {
    if (!this._queue) {
      throw new Error('SendEmailQueue not create instance');
    }
    const { name, data, jobOptions } = job;
    try {
      await this._queue.add(name, data, jobOptions);
      this._logger.info(`Add job ${name}-${jobOptions.jobId} into queue ${this._queue.name} success`);
    } catch (error) {
      this._logger.error('Add job sendEmailVerify fail with error: ', error);
      throw new Error(`Add job sendEmailVerify fail with error: ${(error as Error).message}`);
    }
  }
}
