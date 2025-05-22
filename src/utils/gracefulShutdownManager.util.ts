import { Server } from 'http';
import mongoose from 'mongoose';
import winston from 'winston';

interface ShutdownOptions {
  httpServer?: Server;
  mongooseConnection?: typeof mongoose.connection;
}

export class GracefulShutdownManager {
  private readonly httpServer: ShutdownOptions['httpServer'];
  private readonly mongooseConnection: ShutdownOptions['mongooseConnection'];
  private readonly logger: winston.Logger;
  private readonly SHUTDOWN_TIMEOUT_SECOND: number = 10000;

  constructor(options: ShutdownOptions, logger: winston.Logger) {
    this.httpServer = options.httpServer;
    this.mongooseConnection = options.mongooseConnection;
    this.logger = logger;

    this.registerProcessHandlers();
  }

  // --- PRIVATE METHODS for closing individual services ---

  // Private method close http server
  private async _closeHttpServer(): Promise<void> {
    if (this.httpServer && this.httpServer.listening) {
      this.logger.info('Closing HTTP server...');
      return await new Promise((resolve, reject) => {
        this.httpServer?.close((error) => {
          if (error) {
            this.logger.error('Error closing HTTP server: ', error);
            return reject(error);
          }
          this.logger.info('HTTP server closed.');
          resolve();
        });
      });
    }
  }

  // Private method close mongoose connection
  private async _closeMongooseConnection(): Promise<void> {
    if (this.mongooseConnection && this.mongooseConnection.readyState === 1) {
      this.logger.info('Closing Mongoose connection...');
      await this.mongooseConnection.close();
      this.logger.info('Mongoose connection closed.');
    }
  }

  // --- PUBLIC METHOD to initiate shutdown ---

  public async initiateShutdown(): Promise<void> {
    this.logger.info('\nReceived termination signal. Initiating graceful shutdown...');

    const shutdownTimeout = setTimeout(() => {
      this.logger.error('Graceful Shutdown time out. Forcing exit!');
    }, this.SHUTDOWN_TIMEOUT_SECOND);

    try {
      await this._closeHttpServer();
      await this._closeMongooseConnection();
      // Add stop more services here...

      this.logger.info('All services shut down gracefully. Exiting process.');
      clearTimeout(shutdownTimeout);
      process.exit(0);
    } catch (error) {
      this.logger.error('Error during graceful shutdown: ', error);
      clearTimeout(shutdownTimeout);
      process.exit(1);
    }
  }

  // -- Register process event handlers --

  private registerProcessHandlers() {
    process.on('SIGTERM', async () => await this.initiateShutdown());
    process.on('SIGINT', async () => await this.initiateShutdown());

    process.on('unhandledRejection', async (reason, promise) => {
      this.logger.error('Unhandled Rejection at: ', promise, 'reason:', reason);

      await this.initiateShutdown();
    });

    process.on('uncaughtException', async (error) => {
      this.logger.error('Uncaught Exception: ', error.message, error.stack);

      await this.initiateShutdown();
    });

    process.on('exit', (code) => {
      this.logger.info(`Process exited with code: ${code}`);
    });
  }
}
