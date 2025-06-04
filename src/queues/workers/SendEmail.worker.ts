import { Job, Worker } from 'bullmq';
import { Redis } from 'ioredis';
import winston from 'winston';
import { IoredisManager } from '../../configs/ioredisManager.config.js';
import { JobsSendEmailValues } from '../../constants/jobs.constant.js';
import { Queues } from '../../constants/queues.constant.js';
import { WorkerLogger } from '../../loggers/bullMQ.logger.js';
import { ProcessorSendEmail } from '../processor/SendEmail.processor.js';

export class SendEmailWorker {
  static instance: SendEmailWorker;
  private _worker: Worker | undefined;
  private _loggerConnection: winston.Logger = WorkerLogger.child({
    type: 'Connection'
  });
  private _loggerJob: winston.Logger = WorkerLogger.child({
    type: 'Job'
  });
  private _connection: Redis = IoredisManager.getInstance().getRedisClient();

  private constructor() {}

  public workerConnect() {
    this._worker = new Worker(
      Queues.SEND_EMAIL,
      async (job: Job) => {
        const handle = ProcessorSendEmail.handle({ name: job.name as JobsSendEmailValues });
        if (handle) {
          return await handle({ data: job.data });
        }

        //TODO: Implement throw error
      },
      {
        connection: this._connection
      }
    );

    this._listenEventConnection();
    this._listenEventJobWorker();
  }

  static getInstance() {
    if (!SendEmailWorker.instance) {
      SendEmailWorker.instance = new SendEmailWorker();
    }

    return SendEmailWorker.instance;
  }

  private _listenEventConnection() {
    if (!this._worker) return;
    this._worker.on('error', (error) => {
      this._loggerConnection.info('Worker Redis connection error: ', error);
    });

    this._worker.on('closed', () => {
      this._loggerConnection.info('Worker connection closed');
    });

    this._worker.on('ioredis:close', () => {
      this._loggerConnection.info('Worker connection to ioredis closed');
    });

    this._worker.on('ready', () => {
      this._loggerConnection.info('Worker connected to Redis');
    });
  }

  private _listenEventJobWorker() {
    if (!this._worker) return;
    this._worker.on('completed', (job) => {
      this._loggerJob.info(`Completed job ${job.id} - ${job.name}`);
    });

    this._worker.on('failed', (job, error) => {
      this._loggerJob.error(`Failed job ${job?.id} - ${job?.name}, with error: `, error);
    });
  }

  public async closeWorker() {
    if (!this._worker) return;
    try {
      await this._worker.close();
    } catch (error) {
      this._loggerConnection.error('Close worker sendEmail error: ', error);
      throw new Error('Close worker sendEmail error');
    }
  }
}
