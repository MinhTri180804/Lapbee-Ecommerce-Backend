import { Response } from 'express';
import { sendSuccessResponseNoContent } from '../utils/responses.util';
import { StatusCodes } from 'http-status-codes';

describe('SendSuccessNoContentResponseParams util function', () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('Should send a 204 no content success response', () => {
    sendSuccessResponseNoContent({ response: mockResponse as Response });

    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
  });
});
