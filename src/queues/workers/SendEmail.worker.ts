import { Job, Worker } from 'bullmq';
import { QueuesEnum } from '../../enums/queues.enum.js';
import { JobsSendEmailEnum } from '../../enums/jobs.enum.js';
import { WorkerLogger } from '../../loggers/bullMQ.logger.js';
import { IoredisManager } from '../../configs/IoredisManager.config.js';
import { ProcessorSendEmail } from '../processor/SendEmail.processor.js';
import winston from 'winston';
import { Redis } from 'ioredis';

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
      QueuesEnum.SEND_EMAIL,
      async (job: Job) => {
        const handle = ProcessorSendEmail.handle({ name: job.name as JobsSendEmailEnum });
        return await handle({ data: job.data });
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
