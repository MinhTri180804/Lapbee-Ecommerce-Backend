export const TypePinCode = {
  VERIFY_EMAIL: 'verify-email'
} as const;

export type TypePinCodeKey = keyof typeof TypePinCode;
export type TypePinCodeValue = (typeof TypePinCode)[TypePinCodeKey];
