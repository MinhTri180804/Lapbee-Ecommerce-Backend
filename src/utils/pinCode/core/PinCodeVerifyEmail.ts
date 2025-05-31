import { env } from '../../../configs/env.config.js';
import { ModePinCodeEnum } from '../../../enums/modePinCode.enum.js';
import { TypePinCodeEnum } from '../../../enums/typePinCode.enum.js';
import { PinCode } from './PinCode.js';

const LENGTH_PIN_CODE = Number(env.pinCode.verifyEmail.length) || 6;

export class PinCodeVerifyEmail extends PinCode {
  constructor() {
    super({
      length: LENGTH_PIN_CODE,
      type: TypePinCodeEnum.VERIFY_EMAIL,
      mode: ModePinCodeEnum.ONLY_NUMERIC
    });
  }
}
