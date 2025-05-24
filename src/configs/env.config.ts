export const env = {
  app: {
    PORT: process.env.PORT || 8080
  },
  mongodb: {
    PORT: process.env.MONGO_PROD_PORT || '27017',
    USERNAME: process.env.MONGO_USERNAME,
    PASSWORD: process.env.MONGO_PASSWORD,
    HOST: process.env.MONGO_HOST
  },
  redis: {
    HOST: process.env.REDIS_HOST || '127.0.0.1',
    PORT: process.env.REDIS_PORT || '6379'
  },
  mailtrap: {
    HOST: process.env.MAILTRAP_HOST,
    PORT: process.env.MAILTRAP_PORT,
    USERNAME: process.env.MAITRAP_USERNAME,
    PASSWORD: process.env.MAILTRAP_PASSWORD
  },
  jwt: {
    SECRET_KEY: {
      ACCESS_TOKEN: process.env.JWT_SECRET_KEY_ACCESS_TOKEN,
      REFRESH_TOKEN: process.env.JWT_SECRET_KEY_REFRESH_TOKEN,
      UPDATE_PASSWORD: process.env.JWT_SECRET_KEY_UPDATE_PASSWORD,
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
