import crypto from 'node:crypto';
import { TypePinCodeValue } from '../../../constants/typePinCode.constant.js';
import { ModePinCodeEnum } from '../../../enums/modePinCode.enum.js';

type VerifyModeType = {
  [key in ModePinCodeEnum]: (pinCode: string) => boolean;
};

type GeneratePinCodeBasedModeType = {
  [key in ModePinCodeEnum]: (length: number) => string;
};

type PinCodeConstructorParams = {
  length: number;
  type: TypePinCodeValue;
  mode: ModePinCodeEnum;
};

const NUMERIC_CHARS_DEFAULT = '0123456789';
const ALPHABETIC_CHARS_DEFAULT = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export abstract class PinCode {
  private _NUMERIC_CHARS: string;
  private _ALPHABETIC_CHARS: string;
  private _ALPHANUMERIC_CHARS: string;

  protected _length: number;
  protected _type: TypePinCodeValue;
  protected _mode: ModePinCodeEnum;
  protected _verifyMode: VerifyModeType = {
    [ModePinCodeEnum.ONLY_NUMERIC]: (pinCode: string) => this._isModeOnlyNumerics(pinCode),
    [ModePinCodeEnum.ONLY_ALPHABETIC]: (pinCode: string) => this._isModeOnlyAlphabetic(pinCode),
    [ModePinCodeEnum.COMBINE_ALPHANUMERIC]: (pinCode) => this._isModeCombineAlphanumeric(pinCode)
  };
  protected _generatePinCodeBasedMode: GeneratePinCodeBasedModeType = {
    [ModePinCodeEnum.ONLY_NUMERIC]: (length: number) => this.generateNumericPin(length),
    [ModePinCodeEnum.ONLY_ALPHABETIC]: (length: number) => this.generateAlphabeticPin(length),
    [ModePinCodeEnum.COMBINE_ALPHANUMERIC]: (length: number) => this.generateAlphanumericPin(length)
  };

  /**
   * Constructs a new PinCode instance, allowing for customization of character sets.
   *
   * @param params - An object containing the core parameters for the PIN code.
   * @param params.length - The desired length of the PIN code to be generated or verified.
   * @param params.type - The type of PIN code (e.g., 'OTP', 'STATIC').
   * @param params.mode - The mode of the PIN code, defining its character set (e.g., 'ONLY_NUMBERS', 'ONLY_LETTERS', 'COMBINE_NUMBERS_LETTERS').
   * @param numericChars - (Optional) A string containing all allowed numeric characters. Defaults to `NUMERIC_CHARS_DEFAULT`.
   * @param alphabeticChars - (Optional) A string containing all allowed alphabetic characters. Defaults to `ALPHABETIC_CHARS_DEFAULT`.
   */
  constructor(
    { length, type, mode }: PinCodeConstructorParams,
    numericChars: string = NUMERIC_CHARS_DEFAULT,
    alphabeticChars = ALPHABETIC_CHARS_DEFAULT
  ) {
    this._length = length;
    this._type = type;
    this._mode = mode;
    this._NUMERIC_CHARS = numericChars;
    this._ALPHABETIC_CHARS = alphabeticChars;
    this._ALPHANUMERIC_CHARS = this._NUMERIC_CHARS + this._ALPHABETIC_CHARS;
  }

  // -------------- Private method
  /**
   * Generates a random PinCode based on the provided character set.
   * This is an internal method used by other public generation methods.
   *
   * @param length The desired length of the PinCode.
   * @param characters The string of characters that the PinCode can contain.
   * @returns A randomly generated PinCode.
   * @throws Error if the length is invalid (less than 1) or the character set is empty.
   */
  private _generateRandomPinCode(length: number, characters: string): string {
    if (length < 1) {
      throw new Error('PinCode length must be at least 1.');
    }
    if (characters.length === 0) {
      throw new Error('Character set cannot be empty.');
    }

    let pinCode = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      pinCode += characters.charAt(randomIndex);
    }
    return pinCode;
  }

  /**
   * Generates a PIN code that is guaranteed to contain at least one numeric digit
   * and at least one alphabetic character.
   *
   * This method ensures the PIN code is a true combination of numbers and letters
   * by initially placing one of each, then filling the rest of the length with
   * random alphanumeric characters. Finally, it shuffles the array to randomize
   * the positions of all characters.
   *
   * @param length The desired total length of the PIN code. Must be at least 2
   * to accommodate both a number and a letter.
   * @returns A randomly generated PIN code string containing at least one number and one letter.
   * @throws {Error} If the `length` is less than 2, as it's impossible to guarantee
   * a combination of numbers and letters with a shorter length.
   */
  private _generateStrictlyCombinedPinCode(length: number): string {
    if (length < 2) {
      throw new Error('PinCode length must be at least 2.');
    }

    const characters = this._ALPHANUMERIC_CHARS;
    const pinCodeArray: string[] = [];

    // Add first element is number
    const randomNumberIndex = Math.floor(Math.random() * this._NUMERIC_CHARS.length);
    pinCodeArray.push(this._NUMERIC_CHARS.charAt(randomNumberIndex));

    // Add second element is letter
    const randomLetterIndex = Math.floor(Math.random() * this._ALPHABETIC_CHARS.length);
    pinCodeArray.push(this._ALPHABETIC_CHARS.charAt(randomLetterIndex));

    // Add rest elements
    const remainingLength = length - 2;
    for (let i = 0; i < remainingLength; i++) {
      const randomCharactersIndex = Math.floor(Math.random() * characters.length);
      pinCodeArray.push(characters.charAt(randomCharactersIndex));
    }

    // Swap elements
    for (let i = pinCodeArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pinCodeArray[i], pinCodeArray[j]] = [pinCodeArray[j], pinCodeArray[i]];
    }

    return pinCodeArray.join('');
  }

  // -------------- Protected method --------------
  /**
   * Checks if a given PIN code consists solely of alphabetic characters (a-z, A-Z).
   *
   * @param pinCode The PIN code string to validate.
   * @returns `true` if the PIN code contains only letters, `false` otherwise.
   */
  protected _isModeOnlyAlphabetic(pinCode: string): boolean {
    const regex = /^[a-zA-Z]+$/;
    return regex.test(pinCode);
  }

  /**
   * Checks if a given PIN code consists solely of numeric digits (0-9).
   *
   * @param pinCode The PIN code string to validate.
   * @returns `true` if the PIN code contains only numbers, `false` otherwise.
   */
  protected _isModeOnlyNumerics(pinCode: string): boolean {
    const regex = /^[0-9]+$/;
    return regex.test(pinCode);
  }

  /**
   * Checks if a given PIN code contains both alphabetic characters (a-z, A-Z) and numeric digits (0-9).
   *
   * This method uses a regular expression to validate that the PIN code is alphanumeric
   * and includes at least one letter and at least one number.
   *
   * @param pinCode The PIN code string to validate.
   * @returns `true` if the PIN code contains a combination of letters and numbers, `false` otherwise.
   */
  protected _isModeCombineAlphanumeric(pinCode: string): boolean {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/;
    return regex.test(pinCode);
  }

  /**
   * Determines if the given PIN code matches the character mode set for this PinCode instance.
   * It uses the `_verifyMode` mapping to call the appropriate validation function based on `this._mode`.
   *
   * @param pinCode The PIN code string to check against the current mode.
   * @returns `true` if the PIN code's characters are consistent with the configured mode, `false` otherwise.
   */
  protected _isMatchWithMode(pinCode: string): boolean {
    return this._verifyMode[this._mode](pinCode);
  }

  // -------------- Public method
  /**
   * Generates a PinCode consisting only of numeric digits (0-9).
   *
   * @param length The desired length of the numeric PinCode.
   * @returns A numeric PinCode.
   */
  public generateNumericPin(length: number): string {
    return this._generateRandomPinCode(length, this._NUMERIC_CHARS);
  }

  /**
   * Generates a PinCode consisting only of alphabetic characters (a-z, A-Z).
   *
   * @param length The desired length of the alphabetic PinCode.
   * @returns An alphabetic PinCode.
   */
  public generateAlphabeticPin(length: number): string {
    return this._generateRandomPinCode(length, this._ALPHABETIC_CHARS);
  }

  /**
   * Generates a PinCode containing both alphabetic characters and numeric digits.
   *
   * @param length The desired length of the alphanumeric PinCode.
   * @returns An alphanumeric PinCode.
   */
  public generateAlphanumericPin(length: number): string {
    return this._generateStrictlyCombinedPinCode(length);
  }

  /**
   * Hashes a given PIN code using the SHA-256 algorithm.
   * This is typically used for securely storing PIN codes.
   *
   * @param pinCode The plaintext PIN code to be hashed.
   * @returns A hexadecimal string representing the SHA-256 hash of the PIN code.
   */
  public hash(pinCode: string): string {
    return crypto.createHash('sha256').update(pinCode).digest('hex');
  }

  /**
   * Verifies if a given plaintext PIN code matches a stored hash,
   * considering its length and character mode.
   *
   * The verification process involves:
   * 1. Checking if the input PIN code's length matches the configured length.
   * 2. Validating if the input PIN code's characters conform to the configured `mode`.
   * 3. Hashing the input PIN code and comparing it with the provided hash.
   *
   * @param pinCode The plaintext PIN code to verify.
   * @param pinCodeHash The SHA-256 hash of the expected PIN code.
   * @returns `true` if the PIN code is valid, matches the mode, and its hash matches the provided hash; otherwise, `false`.
   */
  public verify(pinCode: string, pinCodeHash: string): boolean {
    if (pinCode.length !== this._length) return false;

    const isMatchWithMode = this._isMatchWithMode(pinCode);
    if (!isMatchWithMode) return false;

    const hashPinCodeInput = this.hash(pinCode);
    return hashPinCodeInput === pinCodeHash;
  }

  /**
   * Generates a new PIN code based on the configured `mode` and `length` of this instance.
   * This method acts as a dispatcher, calling the appropriate generation method
   * (e.g., `generateNumericPin`, `generateAlphabeticPin`, `generateAlphanumericPin`)
   * internally.
   *
   * @returns A newly generated PIN code string.
   */
  public generate(): string {
    return this._generatePinCodeBasedMode[this._mode](this._length);
  }
}
