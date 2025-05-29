import { RedisKeyGenerator } from '../utils/RedisKeyGenerator.util.js';
import { RedisKeys } from '../constants/redisKeys.constant.js';

describe('RedisKeyGenerator', () => {
  describe('pinCodeVerifyEmail', () => {
    it('should generate the correct Redis key for email pin code verification', () => {
      const email = 'test@example.com';
      const expectedKey = `${RedisKeys.PIN_CODE_VERIFY_EMAIL}:${email}`;
      const generatedKey = RedisKeyGenerator.pinCodeVerifyEmail({ email });
      expect(generatedKey).toBe(expectedKey);
    });

    it('should handle different email addresses correctly', () => {
      const email1 = 'user1@domain.com';
      const email2 = 'another.user@service.co.uk';

      const expectedKey1 = `${RedisKeys.PIN_CODE_VERIFY_EMAIL}:${email1}`;
      expect(RedisKeyGenerator.pinCodeVerifyEmail({ email: email1 })).toBe(expectedKey1);

      const expectedKey2 = `${RedisKeys.PIN_CODE_VERIFY_EMAIL}:${email2}`;
      expect(RedisKeyGenerator.pinCodeVerifyEmail({ email: email2 })).toBe(expectedKey2);
    });
  });
});
