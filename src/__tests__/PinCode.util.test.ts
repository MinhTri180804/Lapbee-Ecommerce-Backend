import { PinCode } from '../utils/pinCode/core/PinCode.js'; // Adjust path as per your project structure
import { TypePinCodeEnum } from '../enums/typePinCode.enum.js'; // Adjust path
import { ModePinCodeEnum } from '../enums/modePinCode.enum.js'; // Adjust path

// Concrete class implementation for testing the abstract PinCode class
class TestablePinCode extends PinCode {
  constructor(
    params: { length: number; type: TypePinCodeEnum; mode: ModePinCodeEnum },
    numericChars?: string,
    alphabeticChars?: string
  ) {
    super(params, numericChars, alphabeticChars);
  }

  // Expose protected methods for testing purposes
  public testIsModeOnlyAlphabetic(pinCode: string): boolean {
    return this._isModeOnlyAlphabetic(pinCode);
  }

  public testIsModeOnlyNumerics(pinCode: string): boolean {
    return this._isModeOnlyNumerics(pinCode);
  }

  public testIsModeCombineAlphanumeric(pinCode: string): boolean {
    return this._isModeCombineAlphanumeric(pinCode);
  }

  public testIsMatchWithMode(pinCode: string): boolean {
    return this._isMatchWithMode(pinCode);
  }

  // Expose private methods for testing specific error cases or logic
  public testGenerateRandomPinCode(length: number, characters: string): string {
    // @ts-expect-error Accessing private method for test. This is expected to be an error.
    return this._generateRandomPinCode(length, characters);
  }

  public testGenerateStrictlyCombinedPinCode(length: number): string {
    // @ts-expect-error Accessing private method for test. This is expected to be an error.
    return this._generateStrictlyCombinedPinCode(length);
  }
}

describe('PinCode', () => {
  // Default parameters for many tests
  const defaultParams = {
    length: 6,
    type: TypePinCodeEnum.VERIFY_EMAIL,
    mode: ModePinCodeEnum.ONLY_NUMERIC
  };

  describe('Constructor', () => {
    it('should initialize properties correctly with default character sets', () => {
      const pinCodeInstance = new TestablePinCode(defaultParams);
      // @ts-expect-error Accessing protected property _length for test. This is expected to be an error.
      expect(pinCodeInstance._length).toBe(defaultParams.length);
      // @ts-expect-error Accessing protected property _type for test. This is expected to be an error.
      expect(pinCodeInstance._type).toBe(defaultParams.type);
      // @ts-expect-error Accessing protected property _mode for test. This is expected to be an error.
      expect(pinCodeInstance._mode).toBe(defaultParams.mode);
      // @ts-expect-error Accessing private property _NUMERIC_CHARS for test. This is expected to be an error.
      expect(pinCodeInstance._NUMERIC_CHARS).toBe('0123456789');
      // @ts-expect-error Accessing private property _ALPHABETIC_CHARS for test. This is expected to be an error.
      expect(pinCodeInstance._ALPHABETIC_CHARS).toBe('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
      // @ts-expect-error Accessing private property _ALPHANUMERIC_CHARS for test. This is expected to be an error.
      expect(pinCodeInstance._ALPHANUMERIC_CHARS).toBe(
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      );
    });

    it('should initialize properties correctly with custom character sets', () => {
      const customNumeric = '123';
      const customAlphabetic = 'abc';
      const pinCodeInstance = new TestablePinCode(defaultParams, customNumeric, customAlphabetic);
      // @ts-expect-error Accessing private property _NUMERIC_CHARS for test. This is expected to be an error.
      expect(pinCodeInstance._NUMERIC_CHARS).toBe(customNumeric);
      // @ts-expect-error Accessing private property _ALPHABETIC_CHARS for test. This is expected to be an error.
      expect(pinCodeInstance._ALPHABETIC_CHARS).toBe(customAlphabetic);
      // @ts-expect-error Accessing private property _ALPHANUMERIC_CHARS for test. This is expected to be an error.
      expect(pinCodeInstance._ALPHANUMERIC_CHARS).toBe(customNumeric + customAlphabetic);
    });
  });

  describe('_generateRandomPinCode (tested via exposed public method)', () => {
    const pinCodeInstance = new TestablePinCode(defaultParams); // Instance for calling the test method

    it('should throw an error if length is less than 1', () => {
      expect(() => pinCodeInstance.testGenerateRandomPinCode(0, '123')).toThrow('PinCode length must be at least 1.');
    });

    it('should throw an error if characters set is empty', () => {
      expect(() => pinCodeInstance.testGenerateRandomPinCode(5, '')).toThrow('Character set cannot be empty.');
    });

    it('should generate a pin code of the specified length', () => {
      const length = 8;
      const chars = '0123456789';
      const pin = pinCodeInstance.testGenerateRandomPinCode(length, chars);
      expect(pin).toHaveLength(length);
    });

    it('should generate a pin code using only characters from the provided set', () => {
      const length = 10;
      const chars = 'abc';
      const pin = pinCodeInstance.testGenerateRandomPinCode(length, chars);
      for (const char of pin) {
        expect(chars).toContain(char);
      }
    });
  });

  describe('_generateStrictlyCombinedPinCode (tested via exposed public method)', () => {
    const pinCodeInstance = new TestablePinCode({
      length: 6, // Min length for this type is 2
      type: TypePinCodeEnum.VERIFY_EMAIL,
      mode: ModePinCodeEnum.COMBINE_ALPHANUMERIC
    });

    it('should throw an error if length is less than 2', () => {
      expect(() => pinCodeInstance.testGenerateStrictlyCombinedPinCode(1)).toThrow(
        'PinCode length must be at least 2.'
      );
    });

    it('should generate a pin code of the specified length', () => {
      const length = 8;
      const pin = pinCodeInstance.testGenerateStrictlyCombinedPinCode(length);
      expect(pin).toHaveLength(length);
    });

    it('should generate a pin code containing at least one numeric and one alphabetic character', () => {
      const length = 10;
      const pin = pinCodeInstance.testGenerateStrictlyCombinedPinCode(length);
      expect(pin).toMatch(/[0-9]/); // Contains at least one digit
      expect(pin).toMatch(/[a-zA-Z]/); // Contains at least one letter
    });

    it('should generate a pin using only alphanumeric characters', () => {
      const length = 10;
      const pin = pinCodeInstance.testGenerateStrictlyCombinedPinCode(length);
      expect(pin).toMatch(/^[a-zA-Z0-9]+$/);
    });
  });

  describe('Character type validation methods (tested via exposed public methods)', () => {
    const pinCodeInstance = new TestablePinCode(defaultParams);

    describe('_isModeOnlyAlphabetic', () => {
      it('should return true for only alphabetic characters', () => {
        expect(pinCodeInstance.testIsModeOnlyAlphabetic('abcXYZ')).toBe(true);
      });
      it('should return false for alphanumeric characters', () => {
        expect(pinCodeInstance.testIsModeOnlyAlphabetic('abcXYZ123')).toBe(false);
      });
      it('should return false for only numeric characters', () => {
        expect(pinCodeInstance.testIsModeOnlyAlphabetic('123456')).toBe(false);
      });
      it('should return false for empty string', () => {
        expect(pinCodeInstance.testIsModeOnlyAlphabetic('')).toBe(false);
      });
    });

    describe('_isModeOnlyNumerics', () => {
      it('should return true for only numeric characters', () => {
        expect(pinCodeInstance.testIsModeOnlyNumerics('123456')).toBe(true);
      });
      it('should return false for alphanumeric characters', () => {
        expect(pinCodeInstance.testIsModeOnlyNumerics('abcXYZ123')).toBe(false);
      });
      it('should return false for only alphabetic characters', () => {
        expect(pinCodeInstance.testIsModeOnlyNumerics('abcXYZ')).toBe(false);
      });
      it('should return false for empty string', () => {
        expect(pinCodeInstance.testIsModeOnlyNumerics('')).toBe(false);
      });
    });

    describe('_isModeCombineAlphanumeric', () => {
      it('should return true for a combination of letters and numbers', () => {
        expect(pinCodeInstance.testIsModeCombineAlphanumeric('abc123XYZ')).toBe(true);
      });
      it('should return false for only alphabetic characters', () => {
        expect(pinCodeInstance.testIsModeCombineAlphanumeric('abcXYZ')).toBe(false);
      });
      it('should return false for only numeric characters', () => {
        expect(pinCodeInstance.testIsModeCombineAlphanumeric('123456')).toBe(false);
      });
      it('should return false if it contains special characters', () => {
        expect(pinCodeInstance.testIsModeCombineAlphanumeric('abc123!')).toBe(false);
      });
      it('should return false for empty string', () => {
        expect(pinCodeInstance.testIsModeCombineAlphanumeric('')).toBe(false);
      });
    });
  });

  describe('_isMatchWithMode (tested via exposed public method)', () => {
    it('should correctly validate ONLY_NUMERIC mode', () => {
      const pinCodeInstance = new TestablePinCode({ ...defaultParams, mode: ModePinCodeEnum.ONLY_NUMERIC });
      expect(pinCodeInstance.testIsMatchWithMode('123456')).toBe(true);
      expect(pinCodeInstance.testIsMatchWithMode('123abc')).toBe(false);
      expect(pinCodeInstance.testIsMatchWithMode('abcdef')).toBe(false);
    });

    it('should correctly validate ONLY_ALPHABETIC mode', () => {
      const pinCodeInstance = new TestablePinCode({ ...defaultParams, mode: ModePinCodeEnum.ONLY_ALPHABETIC });
      expect(pinCodeInstance.testIsMatchWithMode('abcdef')).toBe(true);
      expect(pinCodeInstance.testIsMatchWithMode('abc123DEF')).toBe(false); // The class method isModeOnlyAlphabetic checks for *only* alphabetic
      expect(pinCodeInstance.testIsMatchWithMode('123456')).toBe(false);
    });

    it('should correctly validate COMBINE_ALPHANUMERIC mode', () => {
      const pinCodeInstance = new TestablePinCode({ ...defaultParams, mode: ModePinCodeEnum.COMBINE_ALPHANUMERIC });
      expect(pinCodeInstance.testIsMatchWithMode('abc123DEF')).toBe(true);
      expect(pinCodeInstance.testIsMatchWithMode('abcdef')).toBe(false); // Needs numbers too
      expect(pinCodeInstance.testIsMatchWithMode('123456')).toBe(false); // Needs letters too
      expect(pinCodeInstance.testIsMatchWithMode('abc123!')).toBe(false); // No special chars
    });
  });

  describe('Public generation methods', () => {
    const length = 6;

    describe('generateNumericPin', () => {
      const pinCodeInstance = new TestablePinCode({ ...defaultParams, length, mode: ModePinCodeEnum.ONLY_NUMERIC });
      const pin = pinCodeInstance.generateNumericPin(length);

      it('should generate a numeric pin of the correct length', () => {
        expect(pin).toHaveLength(length);
      });
      it('should generate a pin containing only numbers', () => {
        expect(pin).toMatch(/^[0-9]+$/);
      });
    });

    describe('generateAlphabeticPin', () => {
      const pinCodeInstance = new TestablePinCode({ ...defaultParams, length, mode: ModePinCodeEnum.ONLY_ALPHABETIC });
      const pin = pinCodeInstance.generateAlphabeticPin(length);

      it('should generate an alphabetic pin of the correct length', () => {
        expect(pin).toHaveLength(length);
      });
      it('should generate a pin containing only letters', () => {
        expect(pin).toMatch(/^[a-zA-Z]+$/);
      });
    });

    describe('generateAlphanumericPin', () => {
      const pinCodeInstance = new TestablePinCode({
        ...defaultParams,
        length,
        mode: ModePinCodeEnum.COMBINE_ALPHANUMERIC
      });

      it('should generate an alphanumeric pin of the correct length (min 2)', () => {
        const pin = pinCodeInstance.generateAlphanumericPin(length);
        expect(pin).toHaveLength(length);
      });

      it('should generate an alphanumeric pin with at least one number and one letter', () => {
        const pin = pinCodeInstance.generateAlphanumericPin(length);
        expect(pin).toMatch(/[0-9]/);
        expect(pin).toMatch(/[a-zA-Z]/);
      });

      it('should throw error if length is less than 2', () => {
        expect(() => pinCodeInstance.generateAlphanumericPin(1)).toThrow('PinCode length must be at least 2.');
      });
    });
  });

  describe('generate (dispatcher method)', () => {
    const length = 8;

    it('should call generateNumericPin for ONLY_NUMERIC mode', () => {
      const pinCodeInstance = new TestablePinCode({
        type: TypePinCodeEnum.VERIFY_EMAIL,
        length,
        mode: ModePinCodeEnum.ONLY_NUMERIC
      });
      const pin = pinCodeInstance.generate();
      expect(pin).toHaveLength(length);
      expect(pin).toMatch(/^[0-9]+$/);
    });

    it('should call generateAlphabeticPin for ONLY_ALPHABETIC mode', () => {
      const pinCodeInstance = new TestablePinCode({
        type: TypePinCodeEnum.VERIFY_EMAIL,
        length,
        mode: ModePinCodeEnum.ONLY_ALPHABETIC
      });
      const pin = pinCodeInstance.generate();
      expect(pin).toHaveLength(length);
      expect(pin).toMatch(/^[a-zA-Z]+$/);
    });

    it('should call generateAlphanumericPin for COMBINE_ALPHANUMERIC mode', () => {
      const pinCodeInstance = new TestablePinCode({
        type: TypePinCodeEnum.VERIFY_EMAIL,
        length,
        mode: ModePinCodeEnum.COMBINE_ALPHANUMERIC
      });
      const pin = pinCodeInstance.generate();
      expect(pin).toHaveLength(length);
      expect(pin).toMatch(/[0-9]/);
      expect(pin).toMatch(/[a-zA-Z]/);
      expect(pin).toMatch(/^[a-zA-Z0-9]+$/);
    });
  });

  describe('hash', () => {
    const pinCodeInstance = new TestablePinCode(defaultParams);
    it('should generate a SHA-256 hash', () => {
      const pin = '123456';
      const hashedPin = pinCodeInstance.hash(pin);
      // SHA-256 hashes are 64 hex characters long
      expect(hashedPin).toHaveLength(64);
      expect(hashedPin).toMatch(/^[a-f0-9]+$/);
    });

    it('should generate the same hash for the same input', () => {
      const pin = 'testPin';
      expect(pinCodeInstance.hash(pin)).toBe(pinCodeInstance.hash(pin));
    });

    it('should generate different hashes for different inputs', () => {
      const pin1 = 'testPin1';
      const pin2 = 'testPin2';
      expect(pinCodeInstance.hash(pin1)).not.toBe(pinCodeInstance.hash(pin2));
    });
  });

  describe('verify', () => {
    const length = 6;
    const pin = '1a2B3c'; // Valid for COMBINE_ALPHANUMERIC
    let pinCodeInstance: TestablePinCode;
    let hashedPin: string;

    beforeEach(() => {
      // Setup instance for COMBINE_ALPHANUMERIC mode for these tests
      pinCodeInstance = new TestablePinCode({
        length,
        type: TypePinCodeEnum.VERIFY_EMAIL,
        mode: ModePinCodeEnum.COMBINE_ALPHANUMERIC
      });
      hashedPin = pinCodeInstance.hash(pin);
    });

    it('should return true for a correct pin, matching length, mode and hash', () => {
      expect(pinCodeInstance.verify(pin, hashedPin)).toBe(true);
    });

    it('should return false if pin length does not match', () => {
      expect(pinCodeInstance.verify('1a2B3', hashedPin)).toBe(false); // Shorter
      expect(pinCodeInstance.verify('1a2B3c4', hashedPin)).toBe(false); // Longer
    });

    it('should return false if pin does not match mode', () => {
      // Using the same hashedPin, but provide a pin that doesn't match COMBINE_ALPHANUMERIC mode
      expect(pinCodeInstance.verify('123456', hashedPin)).toBe(false); // Only numeric
      expect(pinCodeInstance.verify('abcdef', hashedPin)).toBe(false); // Only alphabetic
    });

    it('should return false if pin is correct by mode and length, but hash does not match', () => {
      const wrongPin = 'xY1z2W'; // Correct mode and length, but different pin
      expect(pinCodeInstance.verify(wrongPin, hashedPin)).toBe(false);
    });

    it('should return false if hashed pin is incorrect', () => {
      const incorrectHash = 'someRandomIncorrectHashValueThatIsNotTheRealHash1234567890';
      expect(pinCodeInstance.verify(pin, incorrectHash)).toBe(false);
    });

    // Test with ONLY_NUMERIC mode
    it('should correctly verify for ONLY_NUMERIC mode', () => {
      const numericPin = '789012';
      const numericInstance = new TestablePinCode({
        length,
        type: TypePinCodeEnum.VERIFY_EMAIL,
        mode: ModePinCodeEnum.ONLY_NUMERIC
      });
      const numericHash = numericInstance.hash(numericPin);

      expect(numericInstance.verify(numericPin, numericHash)).toBe(true);
      expect(numericInstance.verify('78901A', numericHash)).toBe(false); // Invalid char
    });

    // Test with ONLY_ALPHABETIC mode
    it('should correctly verify for ONLY_ALPHABETIC mode', () => {
      const alphabeticPin = 'GhIjKl';
      const alphabeticInstance = new TestablePinCode({
        length,
        type: TypePinCodeEnum.VERIFY_EMAIL,
        mode: ModePinCodeEnum.ONLY_ALPHABETIC
      });
      const alphabeticHash = alphabeticInstance.hash(alphabeticPin);

      expect(alphabeticInstance.verify(alphabeticPin, alphabeticHash)).toBe(true);
      expect(alphabeticInstance.verify('GhIjK1', alphabeticHash)).toBe(false); // Invalid char
    });
  });
});
