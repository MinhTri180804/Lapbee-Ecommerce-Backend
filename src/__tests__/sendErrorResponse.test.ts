import { env } from '../configs/env.config.js';
import { ErrorMessages } from '../constants/errorMessages.constant.js';
import { ErrorCodes } from '../constants/errorCodes.constant.js';
import { ErrorResponseType } from '../types/responses.type.js';
import { sendErrorResponse } from '../utils/responses.util.js';
import { ErrorInstance } from '../constants/errorInstance.constant.js';
import { ErrorInstanceName } from '../constants/errorInstanceName.constant.js';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnThis(); // Mock method status và cho phép chaining
  res.json = jest.fn(); // Mock method json
  return res;
};

describe('sendErrorResponse', () => {
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    res = mockResponse();
    jest.clearAllMocks();
  });

  it('should send a successful error response with devInfo in development environment', () => {
    Object.defineProperty(env.app, 'NODE_ENV', {
      writable: true,
      value: 'dev'
    });

    const errorContent: ErrorResponseType<{ field: string; value: string }> = {
      statusCode: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
      error: {
        code: ErrorCodes.USER_MOT_FOUND,
        message: ErrorMessages[ErrorCodes.USER_MOT_FOUND],
        name: ErrorInstanceName[ErrorInstance.APP],
        details: [{ field: 'name', value: 'invalid' }],
        devInfo: {
          instance: ErrorInstance.APP,
          stack: 'Error stack trace',
          isOperational: true
        }
      }
    };

    sendErrorResponse({ content: errorContent, response: res });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: ReasonPhrases.BAD_REQUEST,
        error: expect.objectContaining({
          code: ErrorCodes.USER_MOT_FOUND,
          message: ErrorMessages[ErrorCodes.USER_MOT_FOUND],
          name: ErrorInstanceName[ErrorInstance.APP],
          details: [{ field: 'name', value: 'invalid' }],
          devInfo: {
            instance: ErrorInstance.APP,
            stack: 'Error stack trace',
            isOperational: true
          }
        })
      })
    );
  });

  it('should send a successful error response without devInfo in production environment', () => {
    Object.defineProperty(env.app, 'NODE_ENV', {
      writable: true,
      value: 'prod'
    });

    const errorContent: ErrorResponseType<{ field: string; value: string }> = {
      statusCode: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
      error: {
        code: ErrorCodes.USER_MOT_FOUND,
        message: ErrorMessages[ErrorCodes.USER_MOT_FOUND],
        name: ErrorInstanceName[ErrorInstance.APP],
        details: [{ field: 'name', value: 'invalid' }],
        devInfo: {
          instance: ErrorInstance.APP,
          stack: 'Error stack trace',
          isOperational: true
        }
      }
    };

    sendErrorResponse({ content: errorContent, response: res });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: ReasonPhrases.BAD_REQUEST,
        error: expect.objectContaining({
          code: ErrorCodes.USER_MOT_FOUND,
          message: ErrorMessages[ErrorCodes.USER_MOT_FOUND],
          name: ErrorInstanceName[ErrorInstance.APP],
          details: [{ field: 'name', value: 'invalid' }]
        })
      })
    );
  });

  it('should handle error content with minimal details', () => {
    Object.defineProperty(env.app, 'NODE_ENV', {
      writable: true,
      value: 'dev'
    });

    const errorContent: ErrorResponseType = {
      statusCode: StatusCodes.NOT_FOUND,
      message: ReasonPhrases.NOT_FOUND,
      error: {
        code: ErrorCodes.USER_MOT_FOUND,
        message: ErrorMessages[ErrorCodes.USER_MOT_FOUND],
        name: ErrorInstanceName[ErrorInstance.APP],
        devInfo: {
          instance: ErrorInstance.APP,
          stack: 'Minimal stack',
          isOperational: true
        }
      }
    };

    sendErrorResponse({ content: errorContent, response: res });

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: ReasonPhrases.NOT_FOUND,
        error: expect.objectContaining({
          code: ErrorCodes.USER_MOT_FOUND,
          message: ErrorMessages[ErrorCodes.USER_MOT_FOUND],
          name: ErrorInstanceName[ErrorInstance.APP],
          details: null,
          devInfo: {
            instance: ErrorInstance.APP,
            stack: 'Minimal stack',
            isOperational: true
          }
        })
      })
    );
  });
});
