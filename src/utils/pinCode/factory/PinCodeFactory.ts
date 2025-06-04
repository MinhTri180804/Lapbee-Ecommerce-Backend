import { TypePinCodeEnum } from '../../../enums/typePinCode.enum.js';
import { PinCode } from '../core/PinCode.js';
import { PinCodeVerifyEmail } from '../core/PinCodeVerifyEmail.js';

type GeneratePinCodeBasedType = {
  [key in TypePinCodeEnum]: PinCode;
};

export class PinCodeFactory {
  private static _generatePinCodeBasedType: GeneratePinCodeBasedType = {
    [TypePinCodeEnum.VERIFY_EMAIL]: new PinCodeVerifyEmail()
  };

  static create(type: TypePinCodeEnum) {
    return this._generatePinCodeBasedType[type];
  }
}
