import { RequestHandler } from 'express';
import { JWTGenerator } from '../utils/JwtGenerator.util.js';
import { MissingTokenError } from '../errors/MissingToken.error.js';
import { IoredisManager } from 'src/configs/ioredisManager.config.js';
import { IoredisService } from 'src/services/external/Ioredis.service.js';
import { JWTTokenInvalidError } from 'src/errors/JwtTokenInvalid.error.js';

export const verifyRefreshTokenMiddleware: RequestHandler = async (request, _, next) => {
  try {
    const refreshToken = request.cookies?.refreshToken as string | undefined;
    if (!refreshToken) {
      throw new MissingTokenError({ message: 'Authentication failed, RefreshToken missing' });
    }
    const { jti, sub } = JWTGenerator.verifyToken({ token: refreshToken, typeToken: 'REFRESH_TOKEN' });
    const redis = IoredisManager.getInstance().getRedisClient();
    const ioredisService = new IoredisService(redis);
    const isExist = await ioredisService.checkExistRefreshTokenWhitelist({
      userAuthId: sub as string,
      jti: jti as string
    });
    if (!isExist) {
      throw new JWTTokenInvalidError({ message: 'RefreshToken invalid' });
    }
    next();
  } catch (error) {
    next(error);
  }
};
