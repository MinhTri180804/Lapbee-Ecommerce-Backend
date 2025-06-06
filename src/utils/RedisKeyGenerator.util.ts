import { RedisKeys } from '../constants/redisKeys.constant.js';

type PinCodeVerifyEmailParams = {
  email: string;
};

type RefreshTokenWhitelistParams = {
  userAuthId: string;
};

export class RedisKeyGenerator {
  /**
   * Generates a Redis key specifically for storing or retrieving PIN codes
   * used in email verification.
   *
   * The generated key follows the format `RedisKeys.PIN_CODE_VERIFY_EMAIL:<email_address>`,
   * ensuring a unique and easily identifiable key for each email.
   *
   * @param params - An object containing the necessary data to generate the key.
   * @param params.email - The email address for which the Redis key is to be generated.
   * @returns A string representing the unique Redis key for the given email's PIN code verification.
   *
   * @example
   * ```typescript
   * const key = RedisKeyGenerator.pinCodeVerifyEmail({ email: 'test@example.com' });
   * // key will be "RedisKeys.PIN_CODE_VERIFY_EMAIL:test@example.com"
   * ```
   */
  static pinCodeVerifyEmail(params: PinCodeVerifyEmailParams): string {
    const { email } = params;
    return `${RedisKeys.PIN_CODE_VERIFY_EMAIL}:${email}`;
  }

  static refreshTokenWhitelist({ userAuthId }: RefreshTokenWhitelistParams): string {
    return `${RedisKeys.REFRESH_TOKEN_WHITELIST}:${userAuthId}`;
  }
}
