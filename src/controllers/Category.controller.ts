import { NextFunction, Request, Response } from 'express';
import {
  ChangeParentIdRequestBody,
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
type GetAllRequestType = Request<
  unknown,
  unknown,
  unknown,
  {
    page?: string;
    limit?: string;
  }
>;
type ChangeParentIdRequestType = Request<{ id: string }, unknown, ChangeParentIdRequestBody>;

interface ICategoryController {
  create: (request: CreateRequestType, response: Response, next: NextFunction) => Promise<void>;
  delete: (request: DeleteRequestType, response: Response, next: NextFunction) => Promise<void>;
  update: (request: UpdateRequestType, response: Response, next: NextFunction) => Promise<void>;
  getDetails: (request: GetDetailsRequestType, response: Response, next: NextFunction) => Promise<void>;
  getAll: (request: GetAllRequestType, response: Response, next: NextFunction) => Promise<void>;
  changeParentId: (request: ChangeParentIdRequestType, response: Response, next: NextFunction) => Promise<void>;
}

const DEFAULT_PAGE_GET_ALL = 1;
const DEFAULT_LIMIT_GET_ALL = 10;

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

  public async getAll(request: GetAllRequestType, response: Response): Promise<void> {
    const { page = DEFAULT_PAGE_GET_ALL, limit = DEFAULT_LIMIT_GET_ALL } = request.query;

    const { categoriesData, metadata } = await this._categoryService.getAll({
      page: Number(page),
      limit: Number(limit)
    });

    sendSuccessResponse<typeof categoriesData, typeof metadata>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Get all categories success',
        data: categoriesData,
        metadata: metadata
      }
    });
  }

  public async changeParentId(request: ChangeParentIdRequestType, response: Response): Promise<void> {
    const { newParentId } = request.body;
    const { id } = request.params;

    await this._categoryService.changeParentId({ categoryId: id, newParentId });
    sendSuccessResponse({
      response,
      content: {
        statusCode: StatusCodes.NO_CONTENT,
        message: 'Update new parent for category success'
      }
    });
  }
}
