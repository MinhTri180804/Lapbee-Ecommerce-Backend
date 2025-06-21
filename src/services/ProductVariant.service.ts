import { BadRequestError } from '../errors/BadRequest.error.js';
import { IProductVariantDocument } from '../models/productVariant.model.js';
import { ProductRepository } from '../repositories/Product.repository.js';
import { ProductVariantRepository } from '../repositories/productVariant.repository.js';
import {
  CreateManyProductsVariantRequestBody,
  CreateProductVariantRequestBody
} from '../schema/zod/api/requests/productVariant.schema.js';
import { validateObjectIds } from '../utils/validateObjectId.util.js';
import { ProductVariantZodSchemaType } from './../schema/zod/productVariant/index.schema.js';

type CreateParams = CreateProductVariantRequestBody & {
  productId: string;
};

type CreateManyParams = {
  productId: string;
} & CreateManyProductsVariantRequestBody;

interface IProductVariantService {
  create: (params: CreateParams) => Promise<IProductVariantDocument>;
  createMany: (params: CreateManyParams) => Promise<IProductVariantDocument[]>;
}

export class ProductVariantService implements IProductVariantService {
  private _productVariantRepository: ProductVariantRepository = new ProductVariantRepository();
  private _productRepository: ProductRepository = new ProductRepository();

  constructor() {}

  private async _validateReference(data: string[], nameFieldReference: string) {
    const invalidObjectId = validateObjectIds(data);
    if (invalidObjectId.length > 0) {
      throw new BadRequestError({
        message: `${nameFieldReference}: ${invalidObjectId.join('-')} invalid objectId`
      });
    }

    const existingIds = await this._productVariantRepository.findExistingIds({
      ids: data
    });

    if (existingIds.length === 0) {
      throw new BadRequestError({
        message: `${nameFieldReference}: ${data.join('-')} is not existing`
      });
    }

    if (existingIds.length !== data.length) {
      const invalidIds = data.filter((id) => !existingIds.includes(id));
      throw new BadRequestError({ message: `${nameFieldReference}: ${invalidIds.join('-')} is not existing` });
    }
  }

  public async create(createData: CreateParams): Promise<IProductVariantDocument> {
    const product = await this._productRepository.findById({ id: createData.productId });

    // Validation productId exist
    if (!product) {
      throw new BadRequestError({ message: 'ProductId is not exist' });
    }

    // Validation list related blog id exist
    if (createData.relatedBlogId.length > 0) {
      //TODO: Implement blog repository check relatedBlogId exist later
    }

    // Validation list related product variant id exist
    if (createData.relatedProductVariantId.length > 0) {
      await this._validateReference(createData.relatedProductVariantId, 'relatedProductVariantId');
    }

    // Validation list suggest product variant id exist
    if (createData.suggestProductVariantId.length > 0) {
      await this._validateReference(createData.suggestProductVariantId, 'suggestProductVariantId');
    }

    const productVariant = await this._productVariantRepository.create({
      ...createData,
      brandId: product.brandId,
      categoryId: product.categoryId,
      state: product.state
    });
    return productVariant;
  }

  public async createMany({
    productId,
    productsVariant: createData
  }: CreateManyParams): Promise<IProductVariantDocument[]> {
    const product = await this._productRepository.findById({ id: productId });
    if (!product) {
      throw new BadRequestError({ message: 'ProductId is not exist' });
    }

    const suggestProductVariantIdSet = new Set<string>();
    const relatedProductVariantIdSet = new Set<string>();

    createData.forEach((productVariant) => {
      if (productVariant.relatedProductVariantId.length > 0) {
        productVariant.relatedProductVariantId.forEach((relatedProductVariantId) =>
          relatedProductVariantIdSet.add(relatedProductVariantId)
        );
      }

      if (productVariant.suggestProductVariantId.length > 0) {
        productVariant.suggestProductVariantId.forEach((suggestProductVariantId) =>
          suggestProductVariantIdSet.add(suggestProductVariantId)
        );
      }
    });

    if (suggestProductVariantIdSet.size > 0) {
      await this._validateReference([...suggestProductVariantIdSet], 'suggestProductVariantId');
    }

    if (relatedProductVariantIdSet.size > 0) {
      await this._validateReference([...relatedProductVariantIdSet], 'relatedProductVariantId');
    }

    const variantToCreate: ProductVariantZodSchemaType[] = createData.map((data) => ({
      ...data,
      categoryId: product.categoryId,
      brandId: product.brandId,
      state: product.state,
      productId: product.id
    }));

    const productsVariantCreated = await this._productVariantRepository.createMany({ data: variantToCreate });
    return productsVariantCreated;
  }
}
