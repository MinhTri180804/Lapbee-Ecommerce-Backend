export const env = {
  app: {
    PORT: process.env.PORT || 8080,
    NODE_ENV: process.env.NODE_ENV
  },
  pinCode: {
    verifyEmail: {
      length: process.env.PIN_CODE_VERIFY_EMAIL_LENGTH,
      RESEND_AVAILABLE_MINUTE: process.env.PIN_CODE_VERIFY_EMAIL_RESEND_AVAILABLE_MINUTE || 1
    }
  },
  mongodb: {
    PORT: process.env.MONGO_PROD_PORT || '27017',
    USERNAME: process.env.MONGO_USERNAME,
    PASSWORD: process.env.MONGO_PASSWORD,
    HOST: process.env.MONGO_HOST,
    SOURCE_AUTH: process.env.MONGO_SOURCE_AUTH,
    DATABASE: process.env.MONGO_DATABASE
  },
  redis: {
    HOST: process.env.REDIS_HOST || '127.0.0.1',
    PORT: process.env.REDIS_PORT || 6379
  },
  expiredTime: {
    minute: {
      PIN_CODE_VERIFY_EMAIL_REGISTER: process.env.EXPIRED_TIME_MINUTE_PIN_CODE_VERIFY_EMAIL_REGISTER
    },
    day: {
      TOKEN_SET_PASSWORD: process.env.EXPIRED_TIME_DAY_TOKEN_SET_PASSWORD
    }
  },
  mailtrap: {
    HOST: process.env.MAILTRAP_HOST,
    PORT: process.env.MAILTRAP_PORT,
    USERNAME: process.env.MAILTRAP_USERNAME,
    PASSWORD: process.env.MAILTRAP_PASSWORD
  },
  jwt: {
    SECRET_KEY: {
      ACCESS_TOKEN: process.env.JWT_SECRET_KEY_ACCESS_TOKEN,
      REFRESH_TOKEN: process.env.JWT_SECRET_KEY_REFRESH_TOKEN,
      UPDATE_PASSWORD: process.env.JWT_SECRET_KEY_UPDATE_PASSWORD,
      SET_PASSWORD: process.env.JWT_SECRET_KEY_SET_PASSWORD,
      RESET_PASSWORD: process.env.JWT_SECRET_KEY_RESET_PASSWORD,
      FORGOT_PASSWORD: process.env.JWT_SECRET_KEY_FORGOT_PASSWORD
    }
  },
  zalo: {
    APP_ID: process.env.ZALO_APP_ID,
    CODE_VERIFIER: process.env.ZALO_CODE_VERIFIER,
    CODE_CHALLENGE: process.env.ZALO_CODE_CHALLENGE,
    URL_CALLBACK: process.env.ZALO_URL_CALLBACK
  }
};
