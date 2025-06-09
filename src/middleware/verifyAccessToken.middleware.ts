import { RequestHandler } from 'express';
import { AuthorizationHeaderMissingError } from '../errors/AuthorizationHeaderMissing.error.js';
import { JWTGenerator } from '../utils/JwtGenerator.util.js';

export const verifyAccessTokenMiddleware: RequestHandler = (request, _, next) => {
  try {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new AuthorizationHeaderMissingError({ message: 'Authorization header missing' });
    }

    const parts = authHeader.split(' ');

    if (parts.length < 2 || parts[0].toLowerCase() !== 'bearer') {
      throw new AuthorizationHeaderMissingError({ message: 'Authorization header must be in format: Bearer <token>' });
    }

    // eslint-disable-next-line
    const [_, accessToken] = parts;
    JWTGenerator.verifyToken({ token: accessToken, typeToken: 'ACCESS_TOKEN' });

    next();
  } catch (error) {
    next(error);
  }
};
