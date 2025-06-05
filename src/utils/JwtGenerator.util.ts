import { env } from '../configs/env.config.js';
import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { UserAuthRoleEnum } from 'src/enums/userAuthRole.enum.js';
import { v4 as uuidV4 } from 'uuid';

type SetPasswordParams = {
  userAuthId: string;
};

type AccessTokenParams = {
  userAuthId: string;
  role: UserAuthRoleEnum;
};

type RefreshTokenParams = {
  userAuthId: string;
};

export class JWTGenerator {
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

  static setPassword({ userAuthId }: SetPasswordParams): string {
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
