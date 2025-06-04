export const SubjectSendEmail = {
  VERIFY_EMAIL: 'Verify email register',
  VERIFICATION_EMAIL_SUCCESS: 'You Verification email register success'
} as const;

export type SubjectSendEmailKeys = keyof typeof SubjectSendEmail;
export type SubjectSendEmailValues = (typeof SubjectSendEmail)[SubjectSendEmailKeys];
