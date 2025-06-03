import { IoredisManager } from '../configs/ioredisManager.config.js';

export const bullMQConnection = () => {
  return IoredisManager.getInstance().getRedisClient();
};
