import { Redis } from 'ioredis';
import { RedisKeyGenerator } from '../../utils/RedisKeyGenerator.util.js';
import { env } from '../../configs/env.config.js';

type SavePinCodeVerifyEmailParams = {
  email: string;
  pinCode: string;
};

type SaveRefreshTokenWhitelistParams = {
  jti: string;
  userAuthId: string;
};

type GetPinCodeVerifyEmailParams = {
  email: string;
};

type CheckExistRefreshTokenWhitelistParams = {
  userAuthId: string;
  jti: string;
};

type SaveResetPasswordTokenParams = {
  userAuthId: string;
  jti: string;
  expiresAt: number;
};

type GetResetPasswordTokenParams = {
  userAuthId: string;
};

type GetResetPasswordTokenReturns = SaveResetPasswordTokenValue | null;

type RemovePinCodeVerifyEmailParams = {
  email: string;
};

type RemoveRefreshTokenWhitelistParams = {
  userAuthId: string;
  jti: string;
};

type RemoveResetPasswordTokenParams = {
  userAuthId: string;
};

type SavePinCodeVerifyEmailResponse = {
  expiredTimeAtPinCode: number;
};

type GetPinCodeVerifyEmailReturns = {
  pinCode: number;
  expiredAt: number;
  createdAt: number;
} | null;

type SaveResetPasswordTokenValue = {
  jti: string;
  expiredAt: number;
  createdAt: number;
};

type SaveAccessTokenToBacklistParams = {
  jti: string;
  expiredAt: number;
};

type CheckAccessTokenExistInBlacklistParams = {
  jti: string;
};

interface IIoredisService {
  savePinCodeVerifyEmail: (params: SavePinCodeVerifyEmailParams) => Promise<SavePinCodeVerifyEmailResponse>;
  getPinCodeVerifyEmail: (params: GetPinCodeVerifyEmailParams) => Promise<GetPinCodeVerifyEmailReturns>;
  removePinCodeVerifyEmail: (params: RemovePinCodeVerifyEmailParams) => Promise<void>;
  saveRefreshTokenWhitelist: (params: SaveRefreshTokenWhitelistParams) => Promise<void>;
  checkExistRefreshTokenWhitelist: (params: CheckExistRefreshTokenWhitelistParams) => Promise<boolean>;
  removeRefreshTokenWhitelist: (params: RemoveRefreshTokenWhitelistParams) => Promise<void>;
  saveResetPasswordToken: (params: SaveResetPasswordTokenParams) => Promise<void>;
  getResetPasswordToken: (params: GetResetPasswordTokenParams) => Promise<GetResetPasswordTokenReturns>;
  removeResetPasswordToken: (params: RemoveResetPasswordTokenParams) => Promise<void>;
  saveAccessTokenToBlacklist: (params: SaveAccessTokenToBacklistParams) => Promise<void>;
}
export class IoredisService implements IIoredisService {
  private _redisInstance: Redis;
  private readonly _pinCodeVerifyEmailExpiresInMinute = Number(env.expiredTime.minute.PIN_CODE_VERIFY_EMAIL_REGISTER);
  private readonly _pinCodeVerifyEmailExpiresInSecond = 60 * this._pinCodeVerifyEmailExpiresInMinute;
  private readonly _resetPasswordTokenExpiresInMinute = Number(env.expiredTime.minute.RESET_PASSWORD_TOKEN);
  private readonly _resetPasswordTokenExpiresInSecond = 60 * this._resetPasswordTokenExpiresInMinute;

  constructor(redis: Redis) {
    this._redisInstance = redis;
  }

  /**
   * Saves a PIN code for email verification to Redis.
   *
   * This method stores the provided PIN code associated with a specific email address
   * in Redis. The stored value is a string containing the PIN code and its intended
   * expiry timestamp (Unix timestamp in seconds) for verification purposes.
   *
   * The key in Redis is generated based on the email. The Redis entry itself
   * is set to expire after the PIN code's intended expiry time plus an additional
   * 15 minutes, providing a grace period for potential verification retry attempts
   * within Redis while ensuring the PIN code itself is considered expired after
   * its initial duration.
   *
   * @param params - An object containing the email address and the PIN code.
   * @param params.email - The email address for which the PIN code is being saved.
   * @param params.pinCode - The PIN code to be saved.
   * @returns A promise that resolves to an object containing the Unix timestamp (in seconds)
   * when the PIN code itself is considered expired for verification purposes.
   * @throws This method may throw errors if the Redis operation fails (e.g., connection issues).
   */
  public async savePinCodeVerifyEmail(params: SavePinCodeVerifyEmailParams): Promise<SavePinCodeVerifyEmailResponse> {
    const { email, pinCode } = params;

    // CurrentTime is Unix timestamp second
    const currentTime = Math.floor(Date.now() / 1000);

    // ExpiredTimeAtPinCode is unix timestamp second
    const expiredTimeAtPinCode = currentTime + this._pinCodeVerifyEmailExpiresInSecond;

    // ExpiredTimeAtRedisInSecond is unix timestamp second
    const expiredTimeAtRedisInSecond = 60 * (this._pinCodeVerifyEmailExpiresInMinute + 15);

    const key = RedisKeyGenerator.pinCodeVerifyEmail({ email });
    const value = `${pinCode}-${expiredTimeAtPinCode}-${currentTime}`;
    await this._redisInstance.setex(key, expiredTimeAtRedisInSecond, value);
    return { expiredTimeAtPinCode };
  }

  public async getPinCodeVerifyEmail({ email }: GetPinCodeVerifyEmailParams): Promise<GetPinCodeVerifyEmailReturns> {
    const key = RedisKeyGenerator.pinCodeVerifyEmail({ email });
    const data = await this._redisInstance.get(key);
    if (!data) {
      return null;
    }
    const [pinCode, expiredAt, createdAt] = data.split('-');
    return {
      pinCode: Number(pinCode),
      expiredAt: Number(expiredAt),
      createdAt: Number(createdAt)
    };
  }

  public async removePinCodeVerifyEmail({ email }: RemovePinCodeVerifyEmailParams): Promise<void> {
    const key = RedisKeyGenerator.pinCodeVerifyEmail({ email });
    await this._redisInstance.del(key);
  }

  public async saveRefreshTokenWhitelist({ userAuthId, jti }: SaveRefreshTokenWhitelistParams): Promise<void> {
    const key = RedisKeyGenerator.refreshTokenWhitelist({ userAuthId });
    await this._redisInstance.sadd(key, jti);
  }

  public async checkExistRefreshTokenWhitelist({
    userAuthId,
    jti
  }: CheckExistRefreshTokenWhitelistParams): Promise<boolean> {
    const key = RedisKeyGenerator.refreshTokenWhitelist({ userAuthId });
    const isExist = await this._redisInstance.sismember(key, jti);
    return !!isExist;
  }

  public async removeRefreshTokenWhitelist({ userAuthId, jti }: RemoveRefreshTokenWhitelistParams): Promise<void> {
    const key = RedisKeyGenerator.refreshTokenWhitelist({ userAuthId });
    await this._redisInstance.srem(key, jti);
  }

  public async saveResetPasswordToken({ userAuthId, jti }: SaveResetPasswordTokenParams): Promise<void> {
    const key = RedisKeyGenerator.resetPasswordToken({ userAuthId });
    const currentTime = Math.floor(Date.now() / 1000);
    const tokenExpiresAt = currentTime + this._resetPasswordTokenExpiresInSecond;
    const value: SaveResetPasswordTokenValue = {
      jti: jti,
      expiredAt: tokenExpiresAt,
      createdAt: currentTime
    };
    const expiresAtInRedis = this._resetPasswordTokenExpiresInSecond + 15 * 60;
    await this._redisInstance.setex(key, expiresAtInRedis, JSON.stringify(value));
    return;
  }

  public async getResetPasswordToken({
    userAuthId
  }: GetResetPasswordTokenParams): Promise<GetResetPasswordTokenReturns> {
    const key = RedisKeyGenerator.resetPasswordToken({ userAuthId });
    const data = await this._redisInstance.get(key);
    if (!data) return null;
    const { expiredAt, jti, createdAt } = JSON.parse(data) as SaveResetPasswordTokenValue;
    return {
      jti,
      expiredAt: Number(expiredAt),
      createdAt: Number(createdAt)
    };
  }

  public async removeResetPasswordToken({ userAuthId }: RemoveResetPasswordTokenParams): Promise<void> {
    const key = RedisKeyGenerator.resetPasswordToken({ userAuthId });
    await this._redisInstance.del(key);
    return;
  }

  public async saveAccessTokenToBlacklist({ jti, expiredAt }: SaveAccessTokenToBacklistParams): Promise<void> {
    const key = RedisKeyGenerator.accessTokenBlacklist({ jti });
    await this._redisInstance.setex(key, expiredAt, '1');
    return;
  }

  public async checkAccessTokenExistInBlacklist({ jti }: CheckAccessTokenExistInBlacklistParams): Promise<boolean> {
    const key = RedisKeyGenerator.accessTokenBlacklist({ jti });
    const result = await this._redisInstance.get(key);
    if (!result) {
      return false;
    }

    return true;
  }
}
