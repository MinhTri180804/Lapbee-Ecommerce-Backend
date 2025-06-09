export const JobsSendEmail = {
  VERIFY_EMAIL: 'send_email_verify',
  VERIFICATION_EMAIL_SUCCESS: 'send_email_verification_success',
  RESEND_SET_PASSWORD_TOKEN: 'resend_set_password_token',
  RESET_PASSWORD_TOKEN: 'reset_password_token',
  RESEND_RESET_PASSWORD_TOKEN: 'resend_reset_password_token'
} as const;

export type JobsSendEmailKeys = keyof typeof JobsSendEmail;
export type JobsSendEmailValues = (typeof JobsSendEmail)[JobsSendEmailKeys];
