import winston from 'winston';
import { MongooseManager } from './src/configs/mongooseManager.config.js';
import { GracefulShutdownManager } from './src/utils/gracefulShutdownManager.util.js';
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

    // Start HTTP Server
    const server = app.listen(PORT, (error) => {
      if (error) throw error;

      logger.info(`Server running on port: ${PORT}`);
    });

    new GracefulShutdownManager({ httpServer: server, mongooseConnection: mongooseManager.getConnection() }, logger);
  } catch (error) {
    logger.error('Failed to start application...');
    logger.error(`Error failed start application: `, error);
    const manager = new GracefulShutdownManager({}, logger);
    await manager.initiateShutdown();
  }
};

await startApplication();
