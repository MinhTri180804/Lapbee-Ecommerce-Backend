import { Redis } from 'ioredis';
import { env } from '../configs/env.config.js';
import winston from 'winston';

export class IoredisManager {
  private static _instance: IoredisManager;
  private _redisInstance: Redis | undefined;
  private _logger: winston.Logger;

  private constructor(logger: winston.Logger) {
    this._logger = logger;
  }

  public static getInstance() {
    if (!IoredisManager._instance) {
      throw new Error('IoredisManager instance has not been created. Call createInstance(logger) first.');
    }
    return IoredisManager._instance;
  }

  public static createInstance(logger: winston.Logger) {
    if (IoredisManager._instance) return IoredisManager._instance;

    IoredisManager._instance = new IoredisManager(logger);
    return IoredisManager._instance;
  }

  public async connectRedisClient() {
    if (this._redisInstance) return this._redisInstance;

    const PORT = Number(env.redis.PORT);
    const HOST = env.redis.HOST;
    this._redisInstance = new Redis(PORT, HOST, {
      maxRetriesPerRequest: null
    });

    return await new Promise((resolve, reject) => {
      this._redisInstance!.on('connecting', () => {
        this._logger.info('Redis connecting...');
      });

      this._redisInstance!.on('connect', () => {
        this._logger.info('Redis connected success');
      });

      this._redisInstance!.on('ready', () => {
        this._logger.info('Redis is ready to use');
        resolve(this._redisInstance);
      });

      this._redisInstance!.on('error', (error) => {
        this._logger.error('Redis connect error: ', error);
        reject(error);
      });

      this._redisInstance!.on('close', () => {
        this._logger.info('Redis connection closed.');
      });
    });
  }

  public disconnectRedisClient() {
    if (!this._redisInstance) {
      this._logger.warn('Redis instance does not exist.');
      return;
    }

    if (this._redisInstance.status !== 'ready') {
      this._logger.warn('Redis is not connected. Current status: ', this._redisInstance.status);
      return;
    }

    this._redisInstance.removeAllListeners();
    this._redisInstance.disconnect(false);
    this._logger.info('Redis disconnected');
  }

  public getRedisClient() {
    if (!this._redisInstance) {
      throw new Error('Redis client is not connected');
    }

    return this._redisInstance;
  }
}
