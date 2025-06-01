import winston from 'winston';

class LoggerBullMQ {
  static instance: LoggerBullMQ;
  private _logger: winston.Logger;
  private _queueLogger: winston.Logger;
  private _jobLogger: winston.Logger;
  private _workerLogger: winston.Logger;

  constructor() {
    this._logger = winston.createLogger({
      level: 'info',
      defaultMeta: { service: 'bullMQ' },
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.label({ label: 'BullMQ' }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'logs/BullMQ/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/bullMQ/combine.log' })
      ]
    });
    this._queueLogger = this._createQueueLogger();
    this._jobLogger = this._createJobLogger();
    this._workerLogger = this._createWorkerLogger();
  }

  static getInstance() {
    if (!LoggerBullMQ.instance) {
      LoggerBullMQ.instance = new LoggerBullMQ();
    }
    return LoggerBullMQ.instance;
  }

  private _createQueueLogger(): winston.Logger {
    return this._logger.child({
      defaultMeta: { component: 'Queue' }
    });
  }

  private _createJobLogger(): winston.Logger {
    return this._logger.child({
      defaultMeta: { component: 'Job' }
    });
  }

  private _createWorkerLogger(): winston.Logger {
    return this._logger.child({ component: 'Worker' });
  }

  get jobLogger(): winston.Logger {
    return this._jobLogger;
  }

  get queueLogger(): winston.Logger {
    return this._queueLogger;
  }

  get workerLogger(): winston.Logger {
    return this._workerLogger;
  }
}

export const JobLogger = LoggerBullMQ.getInstance().jobLogger;
export const QueueLogger = LoggerBullMQ.getInstance().queueLogger;
export const WorkerLogger = LoggerBullMQ.getInstance().workerLogger;
