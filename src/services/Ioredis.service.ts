import { Redis } from 'ioredis';
import { RedisKeyGenerator } from '../utils/RedisKeyGenerator.util.js';
import { env } from '../configs/env.config.js';

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

type GetPinCodeVerifyEmailReturns = {
  pinCode: number;
  expiredAt: number;
} | null;

type RemovePinCodeVerifyEmailParams = {
  email: string;
};

type RemoveRefreshTokenWhitelistParams = {
  userAuthId: string;
  jti: string;
};

type SavePinCodeVerifyEmailResponse = {
  expiredTimeAtPinCode: number;
};

interface IIoredisService {
  savePinCodeVerifyEmail: (params: SavePinCodeVerifyEmailParams) => Promise<SavePinCodeVerifyEmailResponse>;
  getPinCodeVerifyEmail: (params: GetPinCodeVerifyEmailParams) => Promise<GetPinCodeVerifyEmailReturns>;
  removePinCodeVerifyEmail: (params: RemovePinCodeVerifyEmailParams) => Promise<void>;
  saveRefreshTokenWhitelist: (params: SaveRefreshTokenWhitelistParams) => Promise<void>;
  checkExistRefreshTokenWhitelist: (params: CheckExistRefreshTokenWhitelistParams) => Promise<boolean>;
  removeRefreshTokenWhitelist: (params: RemoveRefreshTokenWhitelistParams) => Promise<void>;
}
export class IoredisService implements IIoredisService {
  private _redisInstance: Redis;
  private readonly _pinCodeVerifyEmailExpiresInMinute = Number(env.expiredTime.minute.PIN_CODE_VERIFY_EMAIL_REGISTER);
  private readonly _pinCodeVerifyEmailExpiresInSecond = 60 * this._pinCodeVerifyEmailExpiresInMinute;

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
    const value = `${pinCode}-${expiredTimeAtPinCode}`;
    await this._redisInstance.setex(key, expiredTimeAtRedisInSecond, value);
    return { expiredTimeAtPinCode };
  }

  public async getPinCodeVerifyEmail({ email }: GetPinCodeVerifyEmailParams): Promise<GetPinCodeVerifyEmailReturns> {
    const key = RedisKeyGenerator.pinCodeVerifyEmail({ email });
    const data = await this._redisInstance.get(key);
    if (!data) {
      return null;
    }
    const [pinCode, expiredAt] = data.split('-');
    return {
      pinCode: Number(pinCode),
      expiredAt: Number(expiredAt)
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
}
