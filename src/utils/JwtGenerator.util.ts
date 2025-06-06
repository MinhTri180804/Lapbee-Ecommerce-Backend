import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { UserAuthRoleEnum } from '../enums/userAuthRole.enum.js';
import { JWTTokenExpiredError } from '../errors/JwtTokenExpired.error.js';
import { JWTTokenInvalidError } from '../errors/JwtTokenInvalid.error.js';
import { v4 as uuidV4 } from 'uuid';
import { env } from '../configs/env.config.js';

type CreatePasswordParams = {
  userAuthId: string;
};

type AccessTokenParams = {
  userAuthId: string;
  role: UserAuthRoleEnum;
};

type RefreshTokenParams = {
  userAuthId: string;
};

type VerifyTokenParams = {
  token: string;
  typeToken: TypeTokenKeys;
};

type TokenMessageErrorExpired = {
  [key in TypeTokenKeys]: string;
};

type TokenMessageErrorInvalid = {
  [key in TypeTokenKeys]: string;
};

const TypeToken = {
  ACCESS_TOKEN: env.jwt.SECRET_KEY.ACCESS_TOKEN,
  REFRESH_TOKEN: env.jwt.SECRET_KEY.REFRESH_TOKEN,
  CREATE_PASSWORD_TOKEN: env.jwt.SECRET_KEY.SET_PASSWORD
} as const;

const tokenMessageErrorExpired: TokenMessageErrorExpired = {
  ACCESS_TOKEN: 'AccessToken expired',
  REFRESH_TOKEN: 'RefreshToken expired',
  CREATE_PASSWORD_TOKEN: 'CreatePasswordToken expired'
};

const tokenMessageErrorInvalid: TokenMessageErrorInvalid = {
  ACCESS_TOKEN: 'AccessToken Invalid',
  REFRESH_TOKEN: 'RefreshToken Invalid',
  CREATE_PASSWORD_TOKEN: 'CreatePasswordToken Invalid'
};

type TypeTokenKeys = keyof typeof TypeToken;

export class JWTGenerator {
  static verifyToken({ token, typeToken }: VerifyTokenParams): jwt.JwtPayload {
    try {
      const SECRET_KEY = TypeToken[typeToken] as string;
      const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new JWTTokenExpiredError({ message: tokenMessageErrorExpired[typeToken] });
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new JWTTokenInvalidError({ message: tokenMessageErrorInvalid[typeToken] });
      }

      throw error;
    }
  }

  static accessToken({ userAuthId, role }: AccessTokenParams): string {
    const jti = uuidV4();
    const SECRET_KEY = env.jwt.SECRET_KEY.ACCESS_TOKEN as string;
    const EXPIRES = env.expiredTime.hours.ACCESS_TOKEN as string;
    const accessToken = jwt.sign(
      {
        role: role
      },
      SECRET_KEY,
      {
        subject: userAuthId,
        expiresIn: EXPIRES as StringValue,
        jwtid: jti
      }
    );
    return accessToken;
  }

  static refreshToken({ userAuthId }: RefreshTokenParams): string {
    const jti = uuidV4();
    const SECRET_KEY = env.jwt.SECRET_KEY.REFRESH_TOKEN as string;
    const EXPIRES = env.expiredTime.day.REFRESH_TOKEN as string;
    const refreshToken = jwt.sign({}, SECRET_KEY, {
      subject: userAuthId,
      expiresIn: EXPIRES as StringValue,
      jwtid: jti
    });
    return refreshToken;
  }

  static createPassword({ userAuthId }: CreatePasswordParams): string {
    const jti = uuidV4();
    const SECRET_KEY = env.jwt.SECRET_KEY.SET_PASSWORD as string;
    const EXPIRES = env.expiredTime.day.TOKEN_SET_PASSWORD as string;
    const jwtToken = jwt.sign({}, SECRET_KEY, {
      subject: userAuthId,
      expiresIn: EXPIRES as StringValue,
      jwtid: jti
    });

    return jwtToken;
  }

  static isMatchWithTypeStringValue(value: string): boolean {
    return /^\d+\s?(d|h|m|s)$/i.test(value);
  }
}
