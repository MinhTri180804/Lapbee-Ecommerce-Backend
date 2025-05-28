import { Response } from 'express';
import { SuccessResponseType } from '../types/responses.type.js';

type SendSuccessResponseParams<T, U> = {
  response: Response<SuccessResponseType<T, U>>;
  content: SuccessResponseType<T, U>;
};

export const sendSuccessResponse = <T = null, U = null>(params: SendSuccessResponseParams<T, U>) => {
  const { content, response } = params;
  response.status(content.statusCode).json({
    success: true,
    statusCode: content.statusCode,
    message: content.message,
    data: content.data || null,
    metadata: content.metadata || null
  });
};
