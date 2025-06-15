import { NextFunction, Request, Response } from 'express';
import {
  createBrandRequestBodySchema,
  CreateBrandRequestBody,
  updateBrandRequestBodySchema,
  UpdateBrandRequestBody
} from '../schema/zod/api/requests/brand.schema.js';
import { BrandService } from '../services/Brand.service.js';
import { sendSuccessResponse } from '../utils/responses.util.js';
import { StatusCodes } from 'http-status-codes';

type CreateRequestType = Request<unknown, unknown, CreateBrandRequestBody>;
type DeleteRequestType = Request<{ id: string }>;
type UpdateRequestType = Request<{ id: string }, unknown, UpdateBrandRequestBody>;
type GetDetailsRequestType = Request<{ id: string }>;
type GetAllRequestType = Request<
  unknown,
  unknown,
  unknown,
  {
    page?: number;
    limit?: number;
  }
>;
interface IBrandController {
  create: (request: CreateRequestType, response: Response, next: NextFunction) => Promise<void>;
  delete: (request: DeleteRequestType, response: Response, next: NextFunction) => Promise<void>;
  update: (request: UpdateRequestType, response: Response, next: NextFunction) => Promise<void>;
  getAll: (params: GetAllRequestType, response: Response, next: NextFunction) => Promise<void>;
  getDetails: (request: GetDetailsRequestType, response: Response, next: NextFunction) => Promise<void>;
}

const DEFAULT_PAGE_GET_ALL = 1;
const DEFAULT_LIMIT_GET_ALL = 10;

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

  public async update(request: UpdateRequestType, response: Response) {
    const { id } = request.params;
    const requestBody = request.body;
    const updateData = updateBrandRequestBodySchema.parse(requestBody);
    const brandUpdated = await this._brandService.update({ brandId: id, updateData });
    sendSuccessResponse<typeof brandUpdated>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Update brand success',
        data: brandUpdated
      }
    });
  }

  public async getAll(request: GetAllRequestType, response: Response) {
    const { page = DEFAULT_PAGE_GET_ALL, limit = DEFAULT_LIMIT_GET_ALL } = request.query;

    const data = await this._brandService.getAll({
      page: Number(page),
      limit: Number(limit) > 0 ? Number(limit) : DEFAULT_LIMIT_GET_ALL
    });
    sendSuccessResponse<typeof data.paginatedResult, typeof data.metadata>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Get all brands success',
        data: data.paginatedResult,
        metadata: data.metadata
      }
    });
  }

  public async getDetails(request: GetDetailsRequestType, response: Response) {
    const { id } = request.params;
    const brand = await this._brandService.getDetails({ brandId: id });
    sendSuccessResponse<typeof brand>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Get details brand success',
        data: brand
      }
    });
  }
}
