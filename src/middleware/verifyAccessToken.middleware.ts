import { RequestHandler } from 'express';
import { JWTGenerator } from '../utils/JwtGenerator.util.js';
import { MissingTokenError } from 'src/errors/MissingToken.error.js';
import { IoredisService } from '../services/external/Ioredis.service.js';
import { IoredisManager } from 'src/configs/ioredisManager.config.js';
import { JWTTokenInvalidError } from 'src/errors/JwtTokenInvalid.error.js';

export const verifyAccessTokenMiddleware: RequestHandler = async (request, _, next) => {
  try {
    const accessToken = request.cookies?.accessToken as string | undefined;
    if (!accessToken) {
      throw new MissingTokenError({ message: 'Authentication failed, AccessToken missing' });
    }
    const { jti } = JWTGenerator.verifyToken({ token: accessToken, typeToken: 'ACCESS_TOKEN' });
    const redis = IoredisManager.getInstance().getRedisClient();
    const ioredisService = new IoredisService(redis);
    const result = await ioredisService.checkAccessTokenExistInBlacklist({ jti: jti as string });
    if (result) {
      throw new JWTTokenInvalidError({ message: 'AccessToken invalid' });
    }

    next();
  } catch (error) {
    next(error);
  }
};
