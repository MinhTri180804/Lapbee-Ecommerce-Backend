import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { MulterLimitFieldCountError } from '../errors/multer/MulterLimitFieldCount.error.js';
import { MulterLimitFieldKeyError } from '../errors/multer/MulterLimitFieldKey.error.js';
import { MulterLimitFieldValueError } from '../errors/multer/MulterLimitFieldValue.error.js';
import { MulterLimitFileCountError } from '../errors/multer/MulterLimitFileCount.error.js';
import { MulterLimitFileSizeError } from '../errors/multer/MulterLimitFileSize.error.js';
import { MulterLimitPartCountError } from '../errors/multer/MulterLimitPartCount.error.js';
import { MulterLimitUnexpectedFileError } from '../errors/multer/MulterLimitUnexpectedFile.error.js';

type ConstructorParams = {
  sizeMB?: number;
  storageEngine?: multer.StorageEngine;
  fieldName?: string;
};

type MappingMulterErrorCode = {
  [key in multer.ErrorCode]: (next: NextFunction) => void;
};

export class UploadMulterMiddleware {
  private _sizeMB: number;
  private _storageEngine: multer.StorageEngine;
  private _uploadMulter: multer.Multer;
  private _fieldName: string;
  private _mappingMulterErrorCode: MappingMulterErrorCode = {
    LIMIT_FILE_SIZE: this._handleErrorLimitFileSize,
    LIMIT_FIELD_COUNT: this._handleErrorLimitFieldCount,
    LIMIT_FIELD_KEY: this._handleErrorLimitFieldKey,
    LIMIT_FIELD_VALUE: this._handleErrorLimitFieldValue,
    LIMIT_FILE_COUNT: this._handleErrorLimitFileCount,
    LIMIT_UNEXPECTED_FILE: this._handleErrorLimitUnexpectedFile,
    LIMIT_PART_COUNT: this._handleErrorLimitPartCount
  };

  constructor({ sizeMB = 10, storageEngine = multer.memoryStorage(), fieldName = 'image' }: ConstructorParams) {
    this._sizeMB = sizeMB;
    this._storageEngine = storageEngine;
    this._fieldName = fieldName;
    this._uploadMulter = multer({
      storage: this._storageEngine,
      limits: { fileSize: this._sizeMB * 1024 * 1024 }
    });
  }

  private _handleErrorLimitFileSize(next: NextFunction) {
    next(new MulterLimitFileSizeError({}));
    return;
  }

  private _handleErrorLimitFileCount(next: NextFunction) {
    next(new MulterLimitFileCountError({}));
    return;
  }

  private _handleErrorLimitFieldCount(next: NextFunction) {
    next(new MulterLimitFieldCountError({}));
    return;
  }

  private _handleErrorLimitFieldKey(next: NextFunction) {
    next(new MulterLimitFieldKeyError({}));
    return;
  }

  private _handleErrorLimitFieldValue(next: NextFunction) {
    next(new MulterLimitFieldValueError({}));
    return;
  }

  private _handleErrorLimitPartCount(next: NextFunction) {
    next(new MulterLimitPartCountError({}));
    return;
  }

  private _handleErrorLimitUnexpectedFile(next: NextFunction) {
    next(new MulterLimitUnexpectedFileError({}));
    return;
  }

  private _handleError(error: multer.MulterError, next: NextFunction) {
    this._mappingMulterErrorCode[error.code](next);
  }

  public singleUpload(request: Request, response: Response, next: NextFunction) {
    this._uploadMulter.single(this._fieldName)(request, response, (error) => {
      if (error) {
        if (error instanceof multer.MulterError) {
          this._handleError(error, next);
        }

        next(error);
      }

      next();
    });
  }
}
