import { NextFunction, Request, Response } from 'express';
import {
  CreateCategoryRequestBody,
  UpdateCategoryRequestBody,
  updateCategoryRequestBodySchema
} from '../schema/zod/api/requests/category.schema.js';
import { CategoryService } from '../services/Category.service.js';
import { sendSuccessResponse } from '../utils/responses.util.js';
import { StatusCodes } from 'http-status-codes';

type CreateRequestType = Request<unknown, unknown, CreateCategoryRequestBody>;
type DeleteRequestType = Request<{ id: string }>;
type UpdateRequestType = Request<{ id: string }, unknown, UpdateCategoryRequestBody>;
type GetDetailsRequestType = Request<{ id: string }>;

interface ICategoryController {
  create: (request: CreateRequestType, response: Response, next: NextFunction) => Promise<void>;
  delete: (request: DeleteRequestType, response: Response, next: NextFunction) => Promise<void>;
  update: (request: UpdateRequestType, response: Response, next: NextFunction) => Promise<void>;
  getDetails: (request: GetDetailsRequestType, response: Response, next: NextFunction) => Promise<void>;
}

export class CategoryController implements ICategoryController {
  private _categoryService: CategoryService = new CategoryService();
  constructor() {}

  public async create(request: CreateRequestType, response: Response): Promise<void> {
    const { name, slug, parentId } = request.body;

    const categoryData = await this._categoryService.create({ name, slug, parentId });

    sendSuccessResponse<typeof categoryData>({
      response,
      content: {
        statusCode: StatusCodes.CREATED,
        message: 'Create category success',
        data: categoryData
      }
    });
  }

  public async delete(request: DeleteRequestType, response: Response): Promise<void> {
    const { id } = request.params;

    await this._categoryService.delete({ categoryId: id });
    sendSuccessResponse({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Delete category success'
      }
    });
  }

  public async update(request: UpdateRequestType, response: Response): Promise<void> {
    const { id } = request.params;
    const requestBody = request.body;
    const updateData = updateCategoryRequestBodySchema.parse(requestBody);
    const categoryUpdated = await this._categoryService.update({ categoryId: id, updateData });

    sendSuccessResponse<typeof categoryUpdated>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Updated category success',
        data: categoryUpdated
      }
    });
  }

  public async getDetails(request: GetDetailsRequestType, response: Response): Promise<void> {
    const { id } = request.params;

    const category = await this._categoryService.getDetails({ categoryId: id });

    sendSuccessResponse<typeof category>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Get details category success',
        data: category
      }
    });
  }
}
