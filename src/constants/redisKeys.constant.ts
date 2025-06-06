export const RedisKeys = {
  PIN_CODE_VERIFY_EMAIL: 'register:verifyEmail',
  REFRESH_TOKEN_WHITELIST: 'refreshToken_whitelist'
} as const;

export type RedisKeysKeys = keyof typeof RedisKeys;
export type RedisKeysValues = (typeof RedisKeys)[RedisKeysKeys];
