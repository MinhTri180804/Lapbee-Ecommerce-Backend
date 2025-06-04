export const Queues = {
  SEND_EMAIL: 'send_email'
} as const;

export type QueuesKeys = keyof typeof Queues;
export type QueuesValues = (typeof Queues)[QueuesKeys];
