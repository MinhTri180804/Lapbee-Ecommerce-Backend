import { RedisKeys } from '../constants/redisKeys.constant.js';

type PinCodeVerifyEmailParams = {
  email: string;
};

export class RedisKeyGenerator {
  static pinCodeVerifyEmail(params: PinCodeVerifyEmailParams): string {
    const { email } = params;
    return `${RedisKeys.PIN_CODE_VERIFY_EMAIL}:${email}`;
  }
}
