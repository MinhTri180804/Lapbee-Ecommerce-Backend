import winston from 'winston';
import { MongooseManager } from './src/configs/MongooseManager.config.js';
import { GracefulShutdownManager } from './src/utils/gracefulShutdownManager.util.js';
import { IoredisManager } from './src/configs/ioredisManager.config.js';
import { NodemailerManager } from './src/configs/NodemailerManager.config.js';
import { SendEmailWorker } from './src/queues/workers/SendEmail.worker.js';
import app from './src/app.js';
import { env } from './src/configs/env.config.js';

const PORT = Number(env.app.PORT);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

const startApplication = async () => {
  try {
    logger.info('Starting Lapbee E-Commerce application...');

    // Connecting mongoDB with mongoose
    const mongooseManager = MongooseManager.getInstance(logger);
    await mongooseManager.connect();

    // Connecting Redis with ioredis
    const ioredisManager = IoredisManager.createInstance(logger);
    await ioredisManager.connectRedisClient();

    // Connecting Transporter send email with Nodemailer
    const nodemailerManager = NodemailerManager.createInstance(logger);
    nodemailerManager.createTransporter();
    await nodemailerManager.verifyTransporter();

    // Connecting sendEmailWorker with bullMQ
    const sendEmailWorker = SendEmailWorker.getInstance();
    sendEmailWorker.workerConnect();

    // Start HTTP Server
    const server = app.listen(PORT, (error) => {
      if (error) throw error;

      logger.info(`Server running on port: ${PORT}`);
    });

    new GracefulShutdownManager(
      {
        httpServer: server,
        mongooseConnection: mongooseManager.getConnection(),
        ioredisManager: ioredisManager,
        nodemailerManager: nodemailerManager,
        sendEmailWorker: sendEmailWorker
      },
      logger
    );
  } catch (error) {
    logger.error('Failed to start application...');
    logger.error(`Error failed start application: `, error);
    const manager = new GracefulShutdownManager({}, logger);
    await manager.initiateShutdown();
  }
};

await startApplication();
