import { createTransport, Transporter } from 'nodemailer';
import { env } from './env.config.js';
import winston from 'winston';

export class NodemailerManager {
  private static _instance: NodemailerManager;
  private _instanceTransporter: Transporter | undefined;
  private _logger: winston.Logger;

  private constructor(logger: winston.Logger) {
    this._logger = logger;
  }

  public static getInstance(): NodemailerManager {
    if (!NodemailerManager._instance) {
      throw new Error('instance NodemailerManager is not exist.');
    }

    return NodemailerManager._instance;
  }

  public static createInstance(logger: winston.Logger): NodemailerManager {
    if (NodemailerManager._instance) {
      return NodemailerManager._instance;
    }

    NodemailerManager._instance = new NodemailerManager(logger);
    return NodemailerManager._instance;
  }

  public createTransporter(): Transporter {
    if (this._instanceTransporter) return this._instanceTransporter;

    this._logger.info('Transporter creating...');
    const HOST = env.mailtrap.HOST;
    const USERNAME = env.mailtrap.USERNAME;
    const PORT = Number(env.mailtrap.PORT);
    const PASSWORD = env.mailtrap.PASSWORD;
    this._instanceTransporter = createTransport({
      host: HOST,
      port: PORT,
      auth: {
        user: USERNAME,
        pass: PASSWORD
      }
    });

    this._logger.info('Transporter created success.');

    return this._instanceTransporter;
  }

  public getInstanceTransporter(): Transporter {
    this._checkInstanceTransporterExist();
    return this._instanceTransporter!;
  }

  public verifyTransporter(): Promise<Transporter> {
    this._checkInstanceTransporterExist();

    return new Promise((resolve, reject) => {
      this._instanceTransporter!.verify((error, success) => {
        if (error) {
          this._logger.error('Transporter send email verify error: ', error);
          return reject(error);
        }

        if (success) {
          this._logger.info('Transporter send email verify success');
          return resolve(this._instanceTransporter!);
        }
      });
    });
  }

  public disconnectTransporter(): void {
    this._checkInstanceTransporterExist();

    this._instanceTransporter!.close();
  }

  public isTransporterReady(): boolean {
    return !!this._instanceTransporter;
  }

  private _checkInstanceTransporterExist(): void {
    if (!this._instanceTransporter) {
      this._logger.error('Instance Transporter is not exist.');
      throw new Error('Instance Transporter is not exist.');
    }
  }
}
