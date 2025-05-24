import mongoose, { Mongoose } from 'mongoose';
import winston from 'winston';
import { env } from './env.config.js';

export class MongooseManager {
  private static _instance: MongooseManager;
  private _mongooseInstance: Mongoose | undefined;
  private _logger: winston.Logger;

  constructor(logger: winston.Logger) {
    this._logger = logger;
  }

  static getInstance(logger: winston.Logger) {
    if (!MongooseManager._instance) {
      MongooseManager._instance = new MongooseManager(logger);
    }

    return MongooseManager._instance;
  }

  public async connect(): Promise<void> {
    if (this._mongooseInstance && this._mongooseInstance.connection.readyState === 1) {
      this._logger.info('MongoDB connection already established.');
      return;
    }

    try {
      this._logger.info('Connecting to MongoDB...');
      const USERNAME = env.mongodb.USERNAME;
      const PASSWORD = env.mongodb.PASSWORD;
      const HOST = env.mongodb.HOST;
      const PORT = env.mongodb.PORT;
      const SOURCE_AUTH = env.mongodb.SOURCE_AUTH;
      const mongodbURL = `mongodb://${USERNAME}abc:${PASSWORD}@${HOST}:${PORT}/lapbee_ecommerce?authSource=${SOURCE_AUTH}`;
      console.log(mongodbURL);
      this._mongooseInstance = await mongoose.connect(mongodbURL);
      this._logger.info('MongoDB connected');
    } catch (error) {
      this._logger.error('Failed to connect to MongoDB: ', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this._mongooseInstance && this._mongooseInstance.connection.readyState === 1) {
      try {
        this._logger.info('Closing MongoDB connection...');
        await this._mongooseInstance.connection.close();
        this._logger.info('MongoDB connection closed.');
      } catch (error) {
        this._logger.error('Closing MongoDB error: ', error);
        throw error;
      }
    }
  }

  public getConnection(): mongoose.Connection {
    if (!this._mongooseInstance || this._mongooseInstance.connection.readyState === 0) {
      this._logger.error('MongoDB connection is not established or disconnected.');
      throw new Error('MongoDB connection not established.');
    }

    return this._mongooseInstance.connection;
  }
}
