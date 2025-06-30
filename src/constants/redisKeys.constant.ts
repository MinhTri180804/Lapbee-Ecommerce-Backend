export const RedisKeys = {
  PIN_CODE_VERIFY_EMAIL: 'register:verifyEmail',
  REFRESH_TOKEN_WHITELIST: 'whitelist:refresh_token',
  RESET_PASSWORD_TOKEN: 'resetPasswordToken',
  ACCESS_TOKEN_BLACKLIST: 'blacklist:access_token'
} as const;

export type RedisKeysKeys = keyof typeof RedisKeys;
export type RedisKeysValues = (typeof RedisKeys)[RedisKeysKeys];
