import { env } from '../configs/env.config.js';
import { Response } from 'express';
import { ErrorResponseType, SuccessResponseType } from '../types/responses.type.js';
import { StatusCodes } from 'http-status-codes';

type SendSuccessResponseParams<T, U> = {
  response: Response<SuccessResponseType<T, U>>;
  content: SuccessResponseType<T, U>;
};

type SendSuccessNoContentResponseParams = {
  response: Response;
};

type SendErrorResponseParams<T> = {
  response: Response<ErrorResponseType<T>>;
  content: ErrorResponseType<T>;
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

export const sendErrorResponse = <T>(params: SendErrorResponseParams<T>) => {
  const { content, response } = params;

  const errorObjectResponse: ErrorResponseType<T> = {
    success: false,
    statusCode: content.statusCode,
    message: content.message,
    error: {
      code: content.error.code,
      name: content.error.name,
      details: content.error?.details || null,
      devInfo: {
        instance: content.error.devInfo!.instance,
        stack: content.error.devInfo!.stack,
        isOperational: content.error.devInfo!.isOperational
      }
    }
  };

  if (env.app.NODE_ENV !== 'dev' || (env.app.NODE_ENV === 'dev' && content.error.devInfo?.isOperational)) {
    delete errorObjectResponse.error.devInfo;
  }

  response.status(content.statusCode).json(errorObjectResponse);
};
