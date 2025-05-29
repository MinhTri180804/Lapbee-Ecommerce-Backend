import { Redis } from 'ioredis';
import { RedisKeyGenerator } from '../utils/RedisKeyGenerator.util.js';
import { env } from '../configs/env.config.js';

type SavePinCodeVerifyEmailParams = {
  email: string;
  pinCode: string;
};

type SavePinCodeVerifyEmailResponse = {
  expiredTimeAtPinCode: number;
};

interface IIoredisService {
  savePinCodeVerifyEmail: (params: SavePinCodeVerifyEmailParams) => Promise<SavePinCodeVerifyEmailResponse>;
}

export class IoredisService implements IIoredisService {
  private _redisInstance: Redis;
  private readonly _pinCodeVerifyEmailExpiresInMinute = Number(env.expiredTime.minute.PIN_CODE_VERIFY_EMAIL_REGISTER);
  private readonly _pinCodeVerifyEmailExpiresInSecond = 60 * this._pinCodeVerifyEmailExpiresInMinute;

  constructor(redis: Redis) {
    this._redisInstance = redis;
  }

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
}
