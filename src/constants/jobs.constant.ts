export const JobsSendEmail = {
  VERIFY_EMAIL: 'send_email_verify',
  VERIFICATION_EMAIL_SUCCESS: 'send_email_verification_success'
} as const;

export type JobsSendEmailKeys = keyof typeof JobsSendEmail;
export type JobsSendEmailValues = (typeof JobsSendEmail)[JobsSendEmailKeys];
