import { env } from '../../../configs/env.config.js';
import { ModePinCodeEnum } from '../../../enums/modePinCode.enum.js';
import { TypePinCode } from '../../../constants/typePinCode.constant.js';
import { PinCode } from './PinCode.js';

const LENGTH_PIN_CODE = Number(env.pinCode.verifyEmail.length) || 6;

export class PinCodeVerifyEmail extends PinCode {
  constructor() {
    super({
      length: LENGTH_PIN_CODE,
      type: TypePinCode.VERIFY_EMAIL,
      mode: ModePinCodeEnum.ONLY_NUMERIC
    });
  }
}
