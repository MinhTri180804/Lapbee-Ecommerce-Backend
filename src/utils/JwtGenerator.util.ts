import { env } from '../configs/env.config.js';
import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { v4 as uuidV4 } from 'uuid';

type SetPasswordParams = {
  userAuthId: string;
};

class _JWTGenerator {
  static instance: _JWTGenerator;

  constructor() {}

  static getInstance() {
    if (!_JWTGenerator.instance) {
      _JWTGenerator.instance = new _JWTGenerator();
    }

    return _JWTGenerator.instance;
  }

  public setPassword({ userAuthId }: SetPasswordParams) {
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

  public isMatchWithTypeStringValue(value: string): boolean {
    return /^\d+\s?(d|h|m|s)$/i.test(value);
  }
}

export const JWTGenerator = _JWTGenerator.getInstance();
