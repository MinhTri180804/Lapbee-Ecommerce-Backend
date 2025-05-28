import { Response } from 'express';
import { SuccessResponseType } from '../types/responses.type.js';
import { StatusCodes } from 'http-status-codes';

type SendSuccessResponseParams<T, U> = {
  response: Response<SuccessResponseType<T, U>>;
  content: SuccessResponseType<T, U>;
};

type SendSuccessNoContentResponseParams = {
  response: Response;
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

export const sendSuccessResponseNoContent = (params: SendSuccessNoContentResponseParams) => {
  const { response } = params;
  response.status(StatusCodes.NO_CONTENT);
};
