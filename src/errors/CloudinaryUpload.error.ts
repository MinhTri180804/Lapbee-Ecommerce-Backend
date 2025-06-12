import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.error.js';
import { UploadApiErrorResponse } from 'cloudinary';

type Details = null;

type ConstructorParams = {
  errorCloudinary: UploadApiErrorResponse;
};

export class CloudinaryUploadError extends AppError<Details> {
  constructor({ errorCloudinary }: ConstructorParams) {
    super({
      statusCode: errorCloudinary.http_code as StatusCodes,
      errorInstanceKey: 'CLOUDINARY_UPLOAD',
      message: errorCloudinary.message || null,
      details: null
    });
  }
}
