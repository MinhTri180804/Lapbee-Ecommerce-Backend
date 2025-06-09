export const SubjectSendEmail = {
  VERIFY_EMAIL: 'Verify email register',
  VERIFICATION_EMAIL_SUCCESS: 'You Verification email register success',
  RESEND_SET_PASSWORD_TOKEN: 'Resend token set password for account',
  RESET_PASSWORD_TOKEN: 'Your reset password link',
  RESEND_RESET_PASSWORD_TOKEN: 'Resend reset password token for account'
} as const;

export type SubjectSendEmailKeys = keyof typeof SubjectSendEmail;
export type SubjectSendEmailValues = (typeof SubjectSendEmail)[SubjectSendEmailKeys];
