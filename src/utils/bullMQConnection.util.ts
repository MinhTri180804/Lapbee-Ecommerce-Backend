import { IoredisManager } from '../configs/IoredisManager.config.js';

export const bullMQConnection = () => {
  return IoredisManager.getInstance().getRedisClient();
};
