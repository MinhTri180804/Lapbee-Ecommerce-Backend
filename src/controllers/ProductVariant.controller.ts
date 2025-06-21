import { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { ProductVariantService } from '../services/ProductVariant.service.js';
import {
  CreateManyProductsVariantRequestBody,
  CreateProductVariantRequestBody,
  createProductVariantRequestBodySchema
} from '../schema/zod/api/requests/productVariant.schema.js';
import { sendSuccessResponse } from '../utils/responses.util.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from 'src/errors/BadRequest.error.js';

type CreateRequestType = Request<{ id: string }, unknown, CreateProductVariantRequestBody>;
type CreateManyRequestType = Request<{ id: string }, unknown, CreateManyProductsVariantRequestBody>;
type GetAllProductVariantsByProductRequestType = Request<{ id: string }>;

interface IProductVariantController {
  create: (request: CreateRequestType, response: Response, next: NextFunction) => Promise<void>;
  createMany: (request: CreateManyRequestType, response: Response, next: NextFunction) => Promise<void>;
  getAllProductVariantsByProduct: (
    request: GetAllProductVariantsByProductRequestType,
    response: Response,
    next: NextFunction
  ) => Promise<void>;
}

export class ProductVariantController implements IProductVariantController {
  private _productVariantService: ProductVariantService = new ProductVariantService();
  constructor() {}

  public async create(request: CreateRequestType, response: Response): Promise<void> {
    const { id } = request.params;
    if (!isValidObjectId(id)) {
      throw new BadRequestError({ message: 'ProductId invalid ObjectId ' });
    }
    const requestBody = request.body;
    const createData = createProductVariantRequestBodySchema.parse(requestBody);
    const productVariant = await this._productVariantService.create({ ...createData, productId: id });
    sendSuccessResponse<typeof productVariant>({
      response,
      content: {
        statusCode: StatusCodes.CREATED,
        message: 'Created product variant success',
        data: productVariant
      }
    });
  }

  public async createMany(request: CreateManyRequestType, response: Response): Promise<void> {
    const { id } = request.params;
    const { productsVariant } = request.body;

    const createData = productsVariant.map((productVariant) =>
      createProductVariantRequestBodySchema.parse(productVariant)
    );

    const productsVariantCreated = await this._productVariantService.createMany({
      productId: id,
      productsVariant: createData
    });

    sendSuccessResponse<typeof productsVariantCreated>({
      response,
      content: {
        statusCode: StatusCodes.CREATED,
        message: 'Create many products variant success',
        data: productsVariantCreated
      }
    });
  }

  public async getAllProductVariantsByProduct(
    request: GetAllProductVariantsByProductRequestType,
    response: Response
  ): Promise<void> {
    const { id } = request.params;
    const productVariants = await this._productVariantService.getAllProductVariantsByProduct({ productId: id });
    sendSuccessResponse<typeof productVariants>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Get all product variants of product success',
        data: productVariants
      }
    });
  }
}
