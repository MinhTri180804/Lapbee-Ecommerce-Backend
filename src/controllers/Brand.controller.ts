import { NextFunction, Request, Response } from 'express';
import { createBrandRequestBodySchema, CreateBrandRequestBodySchema } from '../schema/zod/api/requests/brand.schema.js';
import { BrandService } from '../services/Brand.service.js';
import { sendSuccessResponse } from '../utils/responses.util.js';
import { StatusCodes } from 'http-status-codes';

type CreateRequestType = Request<unknown, unknown, CreateBrandRequestBodySchema>;
type DeleteRequestType = Request<{ id: string }>;

interface IBrandController {
  create: (request: CreateRequestType, response: Response, next: NextFunction) => Promise<void>;
  delete: (request: DeleteRequestType, response: Response, next: NextFunction) => Promise<void>;
}

export class BrandController implements IBrandController {
  private _brandService: BrandService = new BrandService();
  constructor() {}
  public async create(request: CreateRequestType, response: Response) {
    const requestData = request.body;
    const createData = createBrandRequestBodySchema.parse(requestData);
    const brandData = await this._brandService.create(createData);

    sendSuccessResponse<typeof brandData>({
      response,
      content: {
        statusCode: StatusCodes.CREATED,
        message: 'Create brand success',
        data: brandData
      }
    });
  }

  public async delete(request: DeleteRequestType, response: Response) {
    const { id } = request.params;
    await this._brandService.delete({ brandId: id });

    sendSuccessResponse({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Delete brand success'
      }
    });
  }
}
