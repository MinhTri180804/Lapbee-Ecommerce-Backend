import { PinCodeVerifyEmail } from '../utils/pinCode/core/PinCodeVerifyEmail.js';
import { TypePinCodeEnum } from '../enums/typePinCode.enum.js';
import { ModePinCodeEnum } from '../enums/modePinCode.enum.js';

jest.mock('../configs/env.config.js', () => ({
  env: {
    pinCode: {
      verifyEmail: {
        length: '8'
      }
    }
  }
}));

describe('PinCodeVerifyEmail', () => {
  // Clean up mocks and modules after each test to ensure test isolation,
  // especially when different tests might want different mock values for the same module.
  afterEach(() => {
    jest.resetModules();
  });

  describe('Constructor', () => {
    it('should initialize with correct length from env, type VERIFY_EMAIL, and mode ONLY_NUMERIC', async () => {
      // Ensure the default mock for env.config.js is used
      // Re-import PinCodeVerifyEmail to use the current mock state
      const { PinCodeVerifyEmail: TestPinCodeVerifyEmail } = await import(
        '../utils/pinCode/core/PinCodeVerifyEmail.js'
      );

      const instance = new TestPinCodeVerifyEmail();
      const expectedLengthFromEnv = 8; // Based on the default mock

      // Accessing protected members for verification.
      // Using @ts-expect-error as these are protected in the superclass.
      // @ts-expect-error _length is a protected property
      expect(instance._length).toBe(expectedLengthFromEnv);
      // @ts-expect-error _type is a protected property
      expect(instance._type).toBe(TypePinCodeEnum.VERIFY_EMAIL);
      // @ts-expect-error _mode is a protected property
      expect(instance._mode).toBe(ModePinCodeEnum.ONLY_NUMERIC);
    });

    it('should initialize with default length 6 if env variable for length is undefined', async () => {
      // Override the mock for this specific test case
      jest.mock('../configs/env.config.js', () => ({
        env: {
          pinCode: {
            verifyEmail: {
              // length is undefined here
            }
          }
        }
      }));
      // Re-import PinCodeVerifyEmail to use the overridden mock
      const { PinCodeVerifyEmail: TestPinCodeVerifyEmail } = await import(
        '../utils/pinCode/core/PinCodeVerifyEmail.js'
      );

      const instance = new TestPinCodeVerifyEmail();
      const expectedDefaultLength = 6;

      // @ts-expect-error _length is a protected property
      expect(instance._length).toBe(expectedDefaultLength);
      // @ts-expect-error _type is a protected property
      expect(instance._type).toBe(TypePinCodeEnum.VERIFY_EMAIL);
      // @ts-expect-error _mode is a protected property
      expect(instance._mode).toBe(ModePinCodeEnum.ONLY_NUMERIC);
    });

    it('should initialize with default length 6 if env variable for length is not a valid number', async () => {
      // Override the mock for this specific test case
      jest.mock('../configs/env.config.js', () => ({
        env: {
          pinCode: {
            verifyEmail: {
              length: 'not-a-number'
            }
          }
        }
      }));
      // Re-import PinCodeVerifyEmail to use the overridden mock
      const { PinCodeVerifyEmail: TestPinCodeVerifyEmail } = await import(
        '../utils/pinCode/core/PinCodeVerifyEmail.js'
      );

      const instance = new TestPinCodeVerifyEmail();
      const expectedDefaultLength = 6;
      // @ts-expect-error _length is a protected property
      expect(instance._length).toBe(expectedDefaultLength);
    });

    it('should initialize with default length 6 if env variable for length is "0" (Number("0") is 0, 0 || 6 is 6)', async () => {
      // Override the mock for this specific test case
      jest.mock('../configs/env.config.js', () => ({
        env: {
          pinCode: {
            verifyEmail: {
              length: '0'
            }
          }
        }
      }));
      // Re-import PinCodeVerifyEmail to use the overridden mock
      const { PinCodeVerifyEmail: TestPinCodeVerifyEmail } = await import(
        '../utils/pinCode/core/PinCodeVerifyEmail.js'
      );

      const instance = new TestPinCodeVerifyEmail();
      const expectedDefaultLength = 6;
      // @ts-expect-error _length is a protected property
      expect(instance._length).toBe(expectedDefaultLength);
    });
  });

  describe('Inherited functionality (based on constructor settings)', () => {
    const MOCKED_ENV_LENGTH = 8; // Matches the default mock at the top

    beforeEach(async () => {
      // Ensure the default mock (length 8) is active for these tests
      // This might seem redundant due to afterEach + resetModules, but explicit re-mocking
      // ensures clarity if the top-level mock were to change or be less specific.
      jest.mock('../configs/env.config.js', () => ({
        env: {
          pinCode: {
            verifyEmail: {
              length: String(MOCKED_ENV_LENGTH)
            }
          }
        }
      }));
    });

    it('generate() should produce a numeric PIN of the configured length from env', async () => {
      const { PinCodeVerifyEmail: TestPinCodeVerifyEmail } = await import(
        '../utils/pinCode/core/PinCodeVerifyEmail.js'
      );
      const instance = new TestPinCodeVerifyEmail();
      const pin = instance.generate();

      expect(pin).toHaveLength(MOCKED_ENV_LENGTH);
      expect(pin).toMatch(/^[0-9]+$/);
      // @ts-expect-error _mode is a protected property
      expect(instance._mode).toBe(ModePinCodeEnum.ONLY_NUMERIC);
    });

    it('verify() should work correctly for numeric PINs of the configured length', async () => {
      const { PinCodeVerifyEmail: TestPinCodeVerifyEmail } = await import(
        '../utils/pinCode/core/PinCodeVerifyEmail.js'
      );
      const instance = new TestPinCodeVerifyEmail();

      // Dynamically create a correct pin based on MOCKED_ENV_LENGTH
      const correctPin = '0'.repeat(MOCKED_ENV_LENGTH - 1) + '1'; // e.g., "00000001" for length 8
      const hashedCorrectPin = instance.hash(correctPin);

      expect(instance.verify(correctPin, hashedCorrectPin)).toBe(true);

      // Test with incorrect length
      const shortPin = '1'.repeat(MOCKED_ENV_LENGTH - 1);
      expect(instance.verify(shortPin, instance.hash(shortPin))).toBe(false);

      // Test with incorrect characters (non-numeric) for ONLY_NUMERIC mode
      const nonNumericPin = 'a'.repeat(MOCKED_ENV_LENGTH);
      expect(instance.verify(nonNumericPin, instance.hash(nonNumericPin))).toBe(false);

      // Test with correct pin structure but wrong hash
      expect(instance.verify(correctPin, instance.hash('9'.repeat(MOCKED_ENV_LENGTH)))).toBe(false);
    });
  });
});
