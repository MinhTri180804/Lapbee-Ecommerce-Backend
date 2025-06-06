import { Redis } from 'ioredis';
import { IoredisService } from '../services/Ioredis.service.js';
import { RedisKeyGenerator } from '../utils/RedisKeyGenerator.util.js';
import { env } from '../configs/env.config.js';
import { RedisKeys } from '../constants/redisKeys.constant.js';

jest.mock('../configs/env.config.js', () => ({
  env: {
    expiredTime: {
      minute: {
        PIN_CODE_VERIFY_EMAIL_REGISTER: 10
      }
    }
  }
}));

jest.mock('../utils/RedisKeyGenerator.util.js', () => ({
  RedisKeyGenerator: {
    pinCodeVerifyEmail: jest.fn()
  }
}));

describe('IoredisService', () => {
  let ioredisService: IoredisService;
  let mockRedisInstance: jest.Mocked<Redis>;

  const MOCK_CURRENT_TIME = 1678886400000;
  const originalDateNow = Date.now;

  beforeAll(() => {
    Date.now = jest.fn(() => MOCK_CURRENT_TIME);
  });

  afterAll(() => {
    Date.now = originalDateNow;
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();

    mockRedisInstance = {
      setex: jest.fn().mockResolvedValue('OK')
    } as unknown as jest.Mocked<Redis>;

    ioredisService = new IoredisService(mockRedisInstance);
  });

  // --- Test Cases for savePinCodeVerifyEmail method ---
  describe('savePinCodeVerifyEmail', () => {
    it('should save pin code with correct key, value (pinCode-expiredTimeAtPinCode) and Redis expiration', async () => {
      const email = 'test@example.com';
      const pinCode = '123456';
      const mockKey = `${RedisKeys.PIN_CODE_VERIFY_EMAIL}:${email}`;

      (RedisKeyGenerator.pinCodeVerifyEmail as jest.Mock).mockReturnValue(mockKey);

      const envPinCodeExpiresInMinute = Number(env.expiredTime.minute.PIN_CODE_VERIFY_EMAIL_REGISTER);
      const envPinCodeExpiresInSecond = 60 * envPinCodeExpiresInMinute;

      const currentTime = Math.floor(MOCK_CURRENT_TIME / 1000);
      const expectedExpiredTimeAtPinCode = Math.floor(MOCK_CURRENT_TIME / 1000) + envPinCodeExpiresInSecond;

      const expectedExpiredTimeAtRedis = 60 * (envPinCodeExpiresInMinute + 15); // (10 + 15) * 60 = 1500 second

      const expectedValueToSave = `${pinCode}-${expectedExpiredTimeAtPinCode}-${currentTime}`;

      const result = await ioredisService.savePinCodeVerifyEmail({ email, pinCode });

      expect(RedisKeyGenerator.pinCodeVerifyEmail).toHaveBeenCalledTimes(1);
      expect(RedisKeyGenerator.pinCodeVerifyEmail).toHaveBeenCalledWith({ email });

      expect(mockRedisInstance.setex).toHaveBeenCalledTimes(1);
      expect(mockRedisInstance.setex).toHaveBeenCalledWith(mockKey, expectedExpiredTimeAtRedis, expectedValueToSave);

      expect(result).toEqual({ expiredTimeAtPinCode: expectedExpiredTimeAtPinCode });
    });

    it('should calculate expiration times correctly when env variable changes', async () => {
      jest.clearAllMocks();
      jest.resetModules();

      jest.mock('../configs/env.config.js', () => ({
        env: {
          expiredTime: {
            minute: {
              PIN_CODE_VERIFY_EMAIL_REGISTER: 5
            }
          }
        }
      }));

      // Re-import IoredisService, env, và RedisKeyGenerator để đảm bảo chúng sử dụng các mock mới
      const { IoredisService: NewIoredisService } = await import('../services/Ioredis.service.js');
      const { env: newEnv } = await import('../configs/env.config.js');
      const { RedisKeyGenerator: newRedisKeyGenerator } = await import('../utils/RedisKeyGenerator.util.js');

      const newMockRedisInstance: jest.Mocked<Redis> = {
        setex: jest.fn().mockResolvedValue('OK')
      } as unknown as jest.Mocked<Redis>;
      const newIoredisService = new NewIoredisService(newMockRedisInstance);

      const email = 'another@example.com';
      const pinCode = '654321';
      const mockKey = `${RedisKeys.PIN_CODE_VERIFY_EMAIL}:${email}`;

      (newRedisKeyGenerator.pinCodeVerifyEmail as jest.Mock).mockReturnValue(mockKey);

      const newEnvPinCodeExpiresInMinute = Number(newEnv.expiredTime.minute.PIN_CODE_VERIFY_EMAIL_REGISTER);
      const newEnvPinCodeExpiresInSecond = 60 * newEnvPinCodeExpiresInMinute;

      const currentTime = Math.floor(MOCK_CURRENT_TIME / 1000);
      const expectedExpiredTimeAtPinCode = Math.floor(MOCK_CURRENT_TIME / 1000) + newEnvPinCodeExpiresInSecond;

      const expectedExpiredTimeAtRedis = 60 * (newEnvPinCodeExpiresInMinute + 15);

      const expectedValueToSave = `${pinCode}-${expectedExpiredTimeAtPinCode}-${currentTime}`;

      const result = await newIoredisService.savePinCodeVerifyEmail({ email, pinCode });

      expect(newRedisKeyGenerator.pinCodeVerifyEmail).toHaveBeenCalledWith({ email });
      expect(newMockRedisInstance.setex).toHaveBeenCalledWith(mockKey, expectedExpiredTimeAtRedis, expectedValueToSave);
      expect(result).toEqual({ expiredTimeAtPinCode: expectedExpiredTimeAtPinCode });
    });

    it('should reject the promise if setex fails (e.g., Redis connection error)', async () => {
      const email = 'fail@example.com';
      const pinCode = '999999';
      const mockKey = `${RedisKeys.PIN_CODE_VERIFY_EMAIL}:${email}`;

      (RedisKeyGenerator.pinCodeVerifyEmail as jest.Mock).mockReturnValue(mockKey);

      mockRedisInstance.setex.mockRejectedValue(new Error('Redis connection error'));

      await expect(ioredisService.savePinCodeVerifyEmail({ email, pinCode })).rejects.toThrow('Redis connection error');

      expect(mockRedisInstance.setex).toHaveBeenCalledTimes(1);
    });
  });
});
