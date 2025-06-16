import { RequestHandler } from 'express';
import { ValidateRequestBodyError } from '../errors/ValidateRequestBody.error.js';
import { ZodSchema } from 'zod';

export const validateRequestBody = <T>(schemaValidate: ZodSchema<T>): RequestHandler => {
  return (request, _, next) => {
    const result = schemaValidate.safeParse(request.body);
    if (!result.success) {
      throw new ValidateRequestBodyError<T>({
        errorDetails: result.error.format()
      });
    }

    if (!Object.keys(result.data as []).length) {
      throw new ValidateRequestBodyError({
        errorDetails: {
          _errors: ['Request body not empty']
        }
      });
    }

    next();
  };
};
