export const JobsSendEmail = {
  VERIFY_EMAIL: 'send_email_verify'
} as const;

export type JobsSendEmailKeys = keyof typeof JobsSendEmail;
export type JobsSendEmailValues = (typeof JobsSendEmail)[JobsSendEmailKeys];
