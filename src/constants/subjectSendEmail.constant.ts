export const SubjectSendEmail = {
  VERIFY_EMAIL: 'Verify email register',
  VERIFICATION_EMAIL_SUCCESS: 'You Verification email register success',
  RESEND_SET_PASSWORD_TOKEN: 'Resend token set password for account'
} as const;

export type SubjectSendEmailKeys = keyof typeof SubjectSendEmail;
export type SubjectSendEmailValues = (typeof SubjectSendEmail)[SubjectSendEmailKeys];
