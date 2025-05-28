export type SuccessResponseType<T = null, U = null> = {
  success?: true;
  statusCode: number;
  message: string;
  data?: T | null;
  metadata?: U | null;
};
