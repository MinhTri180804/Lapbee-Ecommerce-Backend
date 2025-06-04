import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { sendSuccessResponse } from '../utils/responses.util.js';
import { SuccessResponseType } from '../types/responses.type.js';

describe('sendSuccessResponse util function', () => {
  // eslint-disable-next-line
  let mockResponse: Partial<Response<SuccessResponseType<any, any>, Record<string, any>>>;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('Should send a 200 OK success response with data and message', () => {
    const mockData = { id: 1, name: 'Test product' };
    const mockMessage = 'Product fetched successfully.';
    const mockStatusCode = StatusCodes.OK;
    const mockContent: SuccessResponseType<{ id: number; name: string }> = {
      message: mockMessage,
      statusCode: mockStatusCode,
      data: mockData,
      metadata: null
    };

    sendSuccessResponse({
      response: mockResponse as Response<SuccessResponseType<{ id: number; name: string }, null>>,
      content: mockContent
    });

    expect(mockResponse.status).toHaveBeenCalledWith(mockStatusCode);
    expect(mockResponse.json).toHaveBeenCalledWith({ ...mockContent, success: true });
  });

  it('Should send a 201 Created success response with metadata', () => {
    const mockData = { id: 1, name: 'Test product' };
    const mockMessage = 'Created product successfully';
    const mockStatusCode = StatusCodes.CREATED;
    const mockMetadata = { version: '1.0', createdBy: 'admin' };
    const mockContent: SuccessResponseType<{ id: number; name: string }, { version: string; createdBy: string }> = {
      statusCode: mockStatusCode,
      message: mockMessage,
      data: mockData,
      metadata: mockMetadata
    };

    sendSuccessResponse({
      response: mockResponse as Response<
        SuccessResponseType<{ id: number; name: string }, { version: string; createdBy: string }>
      >,
      content: mockContent
    });

    expect(mockResponse.status).toHaveBeenCalledWith(mockStatusCode);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      statusCode: mockStatusCode,
      message: mockMessage,
      data: mockData,
      metadata: mockMetadata
    });
  });

  it('Should send a 200 success response without data and metadata', () => {
    const mockStatusCode = StatusCodes.OK;
    const mockMessage = ReasonPhrases.OK;

    sendSuccessResponse({
      response: mockResponse as Response<SuccessResponseType>,
      content: {
        statusCode: mockStatusCode,
        message: mockMessage
      }
    });

    expect(mockResponse.status).toHaveBeenCalledWith(mockStatusCode);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      statusCode: mockStatusCode,
      message: mockMessage,
      data: null,
      metadata: null
    });
  });
});
